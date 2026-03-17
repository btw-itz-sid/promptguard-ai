// AttackVectorPie — matches AttackVectorPie.tsx exactly (Recharts PieChart)
const PIE_DATA = [
  { name:'Direct Override',   value:342, color:'#f43f5e' },
  { name:'Prompt Extraction', value:189, color:'#fb923c' },
  { name:'Role Manipulation', value:127, color:'#fbbf24' },
  { name:'SQL Injection',     value:98,  color:'#a78bfa' },
  { name:'Token Injection',   value:76,  color:'#22d3ee' },
  { name:'Context Break',     value:54,  color:'#10b981' },
];

function drawPie(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width  = rect.width  * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  const W = rect.width, H = rect.height;
  const cx = W/2, cy = H/2 - 10;
  const R = Math.min(W, H) * 0.38;
  const total = PIE_DATA.reduce((s,d) => s+d.value, 0);
  ctx.clearRect(0, 0, W, H);

  let angle = -Math.PI/2;
  PIE_DATA.forEach(d => {
    const sweep = (d.value/total) * 2*Math.PI;
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,R,angle,angle+sweep); ctx.closePath();
    ctx.fillStyle = d.color; ctx.fill();
    // % label
    const mid = angle + sweep/2;
    const pct = Math.round((d.value/total)*100);
    if (pct >= 6) {
      const lx = cx + R*0.65*Math.cos(mid), ly = cy + R*0.65*Math.sin(mid);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 11px JetBrains Mono,monospace';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(pct+'%', lx, ly);
    }
    angle += sweep;
  });

  // Legend row below
  const ly = cy + R + 20;
  let lx = 16;
  ctx.font = '11px JetBrains Mono,monospace'; ctx.textBaseline = 'middle';
  // Skip legend in canvas — rendered separately in HTML
}

function renderPieLegend(id) {
  const total = PIE_DATA.reduce((s,d) => s+d.value, 0);
  document.getElementById(id).innerHTML = PIE_DATA.map(d => `
    <div style="display:flex;align-items:center;gap:8px">
      <div style="width:8px;height:8px;border-radius:50%;background:${d.color};flex-shrink:0"></div>
      <span style="font-size:12px;color:#94a3b8;font-family:'JetBrains Mono',monospace;flex:1">${d.name}</span>
      <span style="font-size:12px;font-weight:600;color:#f1f5f9">${d.value}</span>
    </div>`).join('');
}
