// PromptTester — matches PromptTester.tsx exactly
let _scanning = false;

function levelClass(level) {
  const m={safe:'level-safe',low:'level-low',medium:'level-medium',high:'level-high',critical:'level-critical'};
  return m[(level||'').toLowerCase()]||'level-low';
}

async function runScan() {
  const input = document.getElementById('scan-input');
  const prompt = input.value.trim();
  if (!prompt || _scanning) return;

  _scanning = true;
  const btn = document.getElementById('scan-btn');
  btn.disabled = true;
  btn.innerHTML = `<svg class="anim-spin" viewBox="0 0 24 24" style="width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:2"><circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20"/></svg> Scanning...`;
  document.getElementById('scan-result').innerHTML = '';

  try {
    const res = await fetch('/scan', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({prompt})
    });
    if (!res.ok) throw new Error('HTTP '+res.status);
    const data = await res.json();
    _renderResult(data, prompt);
  } catch(e) {
    document.getElementById('scan-result').innerHTML = `
      <div style="background:rgba(245,158,11,.05);border:1px solid rgba(245,158,11,.2);border-radius:12px;padding:16px">
        <p style="color:#fbbf24;font-family:'JetBrains Mono',monospace;font-size:13px">⚠ Cannot reach backend — run <code>node index.js</code> first</p>
      </div>`;
  } finally {
    _scanning = false;
    btn.disabled = false;
    btn.innerHTML = `<svg viewBox="0 0 24 24" style="width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Scan Prompt`;
  }
}

function _renderResult(data, prompt) {
  const score   = data.score || 0;
  const isSafe  = data.status === 'ALLOWED';
  const level   = isSafe ? (score < 10 ? 'safe' : 'low') : score >= 88 ? 'critical' : score >= 65 ? 'high' : score >= 40 ? 'medium' : 'low';
  const patterns= (data.findings||[]).map(f=>f.category).filter((v,i,a)=>a.indexOf(v)===i).slice(0,5);
  const conf    = Math.max(score, isSafe ? 100-score : score);
  const lc      = levelClass(level);

  const safeIconSvg   = `<svg viewBox="0 0 24 24" style="width:24px;height:24px;stroke:#34d399;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
  const threatIconSvg = `<svg viewBox="0 0 24 24" style="width:24px;height:24px;stroke:#fb7185;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;

  const suggestions = isSafe
    ? ['Prompt appears clean — no injection patterns detected', 'Continue with normal processing']
    : ['Remove instruction override attempts', 'Avoid using system-level keywords', 'Rephrase without privilege escalation terms'];

  document.getElementById('scan-result').innerHTML = `
    <div class="result-box ${isSafe?'result-safe':'result-threat'}">
      <div class="result-inner">
        <div class="result-icon" style="${isSafe?'background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.2)':'background:rgba(244,63,94,.1);border:1px solid rgba(244,63,94,.2)'}">
          ${isSafe ? safeIconSvg : threatIconSvg}
        </div>
        <div style="flex:1">
          <div class="result-title-row">
            <span class="result-title">${isSafe?'✓ Prompt is Safe':'⚠ Threat Detected'}</span>
            <span class="level-badge ${lc}">${level}</span>
          </div>
          <div class="conf-row">
            <span class="conf-lbl">Confidence:</span>
            <div class="conf-track">
              <div class="conf-fill" style="width:${conf}%;background:${isSafe?'#10b981':'#f43f5e'}"></div>
            </div>
            <span class="conf-lbl">${conf}%</span>
          </div>
          ${patterns.length ? `
            <p class="section-label">Detected Patterns:</p>
            <div class="pattern-list">${patterns.map(p=>`<span class="pattern-tag">${p}</span>`).join('')}</div>
          ` : ''}
          <div style="margin-top:12px">
            <p class="section-label">Suggestions:</p>
            <div class="suggest-list">${suggestions.map(s=>`<div class="suggest-item"><span class="suggest-dot">•</span>${s}</div>`).join('')}</div>
          </div>
          ${!isSafe && data.sanitized ? `
            <div style="margin-top:12px">
              <p class="section-label">Sanitized Version:</p>
              <div class="sanitized-block"><code>${data.sanitized}</code></div>
            </div>
          ` : ''}
        </div>
      </div>
    </div>`;

  // Push to threat monitor
  LogStore.add({
    id: 'scan-'+Date.now(),
    timestamp: new Date().toLocaleTimeString(),
    prompt,
    threatLevel: level,
    detectedPatterns: patterns,
    isSafe,
    confidence: conf,
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const ta = document.getElementById('scan-input');
  ta.addEventListener('keydown', e => { if (e.ctrlKey && e.key==='Enter') runScan(); });
  ta.addEventListener('input',   e => { document.getElementById('char-cnt').textContent = e.target.value.length+' characters'; });
});
