// ── ANALYZER v2 ───────────────────────────────────────────────────
// Pipeline:
//   1. Deobfuscate RAW input (before any normalization)
//   2. Normalize (zero-width, unicode, leet)
//   3. Scan normalized original + every decoded layer
//   4. Context signals (additive)
//   5. Score → status
//   6. Return shape compatible with PromptGuard UI

const RULES          = require('./rules');
const semanticCheck  = require('./semantic');
const contextSignals = require('./context');
const sanitize       = require('./sanitizer');
const { removeZeroWidth, normalizeUnicode, normalizeLeet, deobfuscateAll } = require('./deobfuscator');

function runAllRules(text, label) {
  const findings = [];
  let maxScore = 0;
  for (const rule of RULES) {
    if (rule.pattern.test(text)) {
      const matchText = (text.match(rule.pattern)||[''])[0].slice(0, 80);
      findings.push({
        name: rule.name, category: rule.category, severity: rule.severity,
        score: rule.score,
        layer: label === 'original' ? 'regex' : `regex↑${label}`,
        match: matchText, deobfuscated: label !== 'original', sourceLabel: label,
      });
      maxScore = Math.max(maxScore, rule.score);
    }
  }
  const sem = semanticCheck(text);
  for (const m of sem.matches) {
    findings.push({
      name: m.name, category: m.category, severity: m.severity, score: m.score,
      layer: label === 'original' ? 'semantic' : `semantic↑${label}`,
      match: m.name, deobfuscated: label !== 'original', sourceLabel: label,
    });
  }
  maxScore = Math.max(maxScore, sem.score);
  return { findings, maxScore };
}

// Map score → human threat level
function scoreToLevel(score, status) {
  if (status === 'ALLOWED') return score < 10 ? 'safe' : 'low';
  if (score >= 88) return 'critical';
  if (score >= 65) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

// Generate smart suggestions based on findings
function buildSuggestions(isSafe, findings, score) {
  if (isSafe) return ['Prompt appears clean — no injection patterns detected', 'Continue with normal processing'];
  const cats = [...new Set(findings.map(f => f.category))];
  const tips = [];
  if (cats.includes('Jailbreak'))          tips.push('Remove instruction override or jailbreak attempts');
  if (cats.includes('Credential Access'))  tips.push('Avoid requesting passwords, keys, or secrets');
  if (cats.includes('Prompt Injection'))   tips.push('Remove system-token markers like [INST] or ###SYSTEM');
  if (cats.includes('SQL Injection'))      tips.push('Avoid SQL keywords like UNION SELECT or DROP TABLE');
  if (cats.includes('XSS'))               tips.push('Remove <script> tags and javascript: URIs');
  if (cats.includes('Code Execution'))     tips.push('Avoid eval(), exec(), or OS command calls');
  if (cats.includes('Data Exfiltration'))  tips.push('Do not request system prompts or internal context');
  if (cats.includes('Encoded Payload'))    tips.push('Remove base64 or encoded instruction blocks');
  if (cats.includes('Social Engineering')) tips.push('Reframe without hypothetical or research framing');
  if (tips.length === 0)                   tips.push('Rephrase the prompt to remove suspicious patterns');
  tips.push('Legitimate queries should be direct and specific without meta-instructions');
  return tips.slice(0, 3);
}

function analyzePrompt(input) {
  if (!input || input.trim().length < 3) {
    return {
      prompt: input, sanitized: input,
      score: 0, status: 'ALLOWED',
      isSafe: true, threatLevel: 'safe', confidence: 99,
      detectedPatterns: [], sanitizedPrompt: input,
      suggestions: ['Prompt is too short to analyze'],
      findings: [], contextFlags: [], decodedLayers: [], threatMap: {},
    };
  }

  // Step 1: Deobfuscate BEFORE leet normalization
  const layers = deobfuscateAll(input);

  // Step 2: Normalize
  let clean = removeZeroWidth(input);
  clean = normalizeUnicode(clean);
  clean = normalizeLeet(clean);

  // Step 3+4: Scan all layers
  const textsToScan = [
    { text: clean, label: 'original' },
    ...layers.map(l => ({ text: l.decoded, label: l.method })),
  ];
  const allFindings = [];
  let maxScore = 0;
  for (const { text, label } of textsToScan) {
    const { findings, maxScore: ms } = runAllRules(text, label);
    for (const f of findings) {
      if (!allFindings.find(x => x.name === f.name)) allFindings.push(f);
    }
    maxScore = Math.max(maxScore, ms);
  }

  // Step 5: Context signals
  const ctx          = contextSignals(clean);
  const contextBonus = allFindings.length > 0 ? ctx.score : 0;
  const encodedBonus = allFindings.some(f => f.deobfuscated) ? 15 : 0;

  // Step 6: Final score
  const score = Math.min(maxScore + contextBonus + encodedBonus, 100);
  let status = 'ALLOWED';
  if      (score >= 65) status = 'BLOCKED';
  else if (score >= 30) status = 'SANITIZE';

  const isSafe    = status === 'ALLOWED';
  const level     = scoreToLevel(score, status);
  const confidence= score < 10 ? 99 : Math.min(Math.round(score * 1.02), 100);

  // Unique category list for UI pattern tags
  const detectedPatterns = [...new Set(allFindings.map(f => f.category))];

  const threatMap = {};
  for (const f of allFindings) threatMap[f.category] = (threatMap[f.category]||0)+1;

  const sanitizedOutput = sanitize(input);

  return {
    // ── Core fields (internal engine) ──
    prompt:       input,
    score,
    status,
    findings:     allFindings,
    contextFlags: ctx.signals,
    decodedLayers:layers,
    threatMap,
    // ── UI-compatible fields (PromptGuard shape) ──
    isSafe,
    threatLevel:      level,
    confidence,
    detectedPatterns,
    sanitizedPrompt:  isSafe ? undefined : sanitizedOutput,
    sanitized:        sanitizedOutput,
    suggestions:      buildSuggestions(isSafe, allFindings, score),
  };
}

module.exports = { analyzePrompt };
