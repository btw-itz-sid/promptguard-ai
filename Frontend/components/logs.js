// ThreatMonitor — matches ThreatMonitor.tsx exactly
const LogStore = {
  entries: [],
  MAX: 50,
  add(entry) {
    this.entries.unshift(entry);
    if (this.entries.length > this.MAX) this.entries.pop();
    this.render();
  },
  levelClass(level) {
    const m = { safe:'level-safe', low:'level-low', medium:'level-medium', high:'level-high', critical:'level-critical' };
    return m[(level||'safe').toLowerCase()] || 'level-low';
  },
  render() {
    const el = document.getElementById('monitor-body');
    if (!el) return;
    if (!this.entries.length) {
      el.innerHTML = `<div class="monitor-empty">
        <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <p>Waiting for incoming prompts...</p>
        <span>Use the scanner above to test prompts</span>
      </div>`; return;
    }
    el.innerHTML = this.entries.map(e => {
      const lc = this.levelClass(e.threatLevel);
      const safe = e.isSafe;
      const iconColor = safe ? '#34d399' : '#fb7185';
      const iconBorder = safe ? 'rgba(16,185,129,.2)' : 'rgba(244,63,94,.2)';
      const iconSvg = safe
        ? `<svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:#34d399;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
        : `<svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:#fb7185;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
      return `<div class="log-row ${!safe?'threat-row':''}">
        <div class="log-icon ${lc}" style="border-color:${iconBorder}">${iconSvg}</div>
        <div class="log-body">
          <div class="log-meta">
            <div class="log-badges">
              <span class="log-badge ${lc}">${e.threatLevel}</span>
              ${(e.detectedPatterns||[]).length ? `<span class="pattern-tag-sm">${e.detectedPatterns[0]}</span>` : ''}
              ${!safe ? `<span class="blocked-tag">⛔ BLOCKED</span>` : ''}
              <span class="conf-tag">${e.confidence}% confidence</span>
            </div>
            <span class="log-time">${e.timestamp}</span>
          </div>
          <p class="log-prompt">${e.prompt}</p>
        </div>
      </div>`;
    }).join('');
  }
};
