// SecurityStats — 4 stat cards (matches SecurityStats.tsx exactly)
function renderStats(id) {
  const stats = [
    { label:'Threats Blocked',  value:'1,247', iconColor:'rgba(244,63,94,.1)', iconBorder:'rgba(244,63,94,.2)', valColor:'#fb7185', change:'+18.2%', changeClass:'change-pos',
      icon:`<svg viewBox="0 0 24 24" style="width:24px;height:24px;stroke:#fb7185;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>` },
    { label:'Prompts Analyzed', value:'45.2K', iconColor:'rgba(34,211,238,.1)', iconBorder:'rgba(34,211,238,.2)',  valColor:'#22d3ee', change:'+24.1%', changeClass:'change-pos',
      icon:`<svg viewBox="0 0 24 24" style="width:24px;height:24px;stroke:#22d3ee;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>` },
    { label:'Active Rules',     value:'89',    iconColor:'rgba(250,204,21,.1)', iconBorder:'rgba(250,204,21,.2)',  valColor:'#facc15', change:null,
      icon:`<svg viewBox="0 0 24 24" style="width:24px;height:24px;stroke:#facc15;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>` },
    { label:'Critical Alerts',  value:'12',    iconColor:'rgba(251,146,60,.1)', iconBorder:'rgba(251,146,60,.2)',  valColor:'#fb923c', change:'-33.3%', changeClass:'change-neg',
      icon:`<svg viewBox="0 0 24 24" style="width:24px;height:24px;stroke:#fb923c;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>` },
  ];
  document.getElementById(id).innerHTML = stats.map(s => `
    <div class="stat-card">
      <div class="stat-top">
        <div class="stat-icon" style="background:${s.iconColor};border:1px solid ${s.iconBorder}">${s.icon}</div>
        ${s.change ? `<span class="stat-change ${s.changeClass}">${s.change}</span>` : ''}
      </div>
      <div class="stat-val" style="color:${s.valColor}">${s.value}</div>
      <div class="stat-lbl">${s.label}</div>
    </div>`).join('');
}
