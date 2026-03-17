// ── CONTEXT SIGNALS v2 — 14 additive signals, cap 55 ─────────────
const MAX_BONUS = 55;

function entropy(text) {
  const freq = {};
  for (const c of text) freq[c] = (freq[c] || 0) + 1;
  const len = text.length;
  return -Object.values(freq).reduce((e,n) => { const p=n/len; return e + p*Math.log2(p); }, 0);
}

function contextSignals(text) {
  const signals = [];
  let total = 0;
  const add = (label, pts) => {
    signals.push({ label, score: pts });
    total = Math.min(total + pts, MAX_BONUS);
  };

  // Base64 blob
  if (/[A-Za-z0-9+/]{30,}={0,2}/.test(text))
    add('Base64 blob present', 35);

  // Hex-encoded sequence
  if (/(?:0x[0-9a-fA-F]{2}[\s,]*){5,}/.test(text))
    add('Hex-encoded data sequence', 30);

  // Zero-width / invisible chars
  if (/[\u200b-\u200f\u202a-\u202e\ufeff\u00ad]/.test(text))
    add('Zero-width chars (steganography)', 42);

  // Stacked override keywords
  const oc = (text.match(/\b(ignore|bypass|override|forget|disable|circumvent|disregard|remove|skip)\b/gi)||[]).length;
  if (oc >= 2) add(`Stacked override terms (${oc}×)`, Math.min(oc*10, 35));

  // Urgency / pressure language
  if (/\b(urgent|urgently|immediately|asap|right now|you must|you have to|do it now|now!|hurry|critical)\b/i.test(text))
    add('Urgency pressure language', 18);

  // False authority claim
  if (/\bi\s+(am|'m)\s+(the\s+)?(ceo|cto|ciso|admin|developer|owner|authorized\s+user|system\s+admin|anthropic|openai)/i.test(text))
    add('False authority claim', 25);

  // High entropy (obfuscation)
  if (text.length > 40 && entropy(text) > 4.4)
    add('High-entropy input (obfuscation likely)', 28);

  // Letter-spaced evasion: i g n o r e
  if (/(?:[a-z]\s){5,}/.test(text.toLowerCase()))
    add('Letter-spaced payload evasion', 22);

  // Unicode homoglyph attack (Cyrillic, Greek lookalikes)
  if (/[\u0400-\u04FF\u0370-\u03FF]/.test(text) && text.replace(/[\u0400-\u04FF\u0370-\u03FF]/g,'').length < text.length*0.9)
    add('Unicode homoglyph substitution', 38);

  // Reverse-engineered payload attempt
  if (/([a-z]{3,})\s+\1/.test(text.split('').reverse().join('').toLowerCase()))
    add('Reversed text pattern detected', 20);

  // Multiple injection vector combos (stacking categories)
  const vecKeywords = ['ignore','admin','password','execute','base64','sql','script','dump','system'];
  const vecHits = vecKeywords.filter(k => text.toLowerCase().includes(k)).length;
  if (vecHits >= 3) add(`Multi-vector attack (${vecHits} vectors)`, Math.min(vecHits*8, 40));

  // Excessive punctuation / special chars (obfuscation)
  const specialRatio = (text.match(/[^a-zA-Z0-9\s]/g)||[]).length / Math.max(text.length, 1);
  if (specialRatio > 0.35 && text.length > 30)
    add('Excessive special chars (evasion)', 18);

  // Newline flooding (delimiter injection)
  if ((text.match(/\n/g)||[]).length >= 4)
    add('Newline flooding (delimiter injection)', 20);

  // Very long prompt anomaly
  if (text.length > 1200)
    add('Abnormally long prompt (bulk injection)', 15);

  return { score: total, signals };
}

module.exports = contextSignals;
