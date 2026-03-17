// ThreatChart — matches ThreatChart.tsx (Recharts AreaChart) via Canvas
const AREA_DATA = [
  {time:'00:00',safe:45,threats:12,blocked:8},
  {time:'04:00',safe:38,threats:15,blocked:11},
  {time:'08:00',safe:62,threats:28,blocked:22},
  {time:'12:00',safe:78,threats:35,blocked:29},
  {time:'16:00',safe:95,threats:42,blocked:38},
  {time:'20:00',safe:71,threats:31,blocked:25},
  {time:'23:59',safe:52,threats:18,blocked:14},
];
const SERIES = [
  {key:'safe',   stroke:'#10b981', rgb:[16,185,129],  label:'Safe Prompts'},
  {key:'threats',stroke:'#f59e0b', rgb:[245,158,11],  label:'Detected Threats'},
  {key:'blocked',stroke:'#f43f5e', rgb:[244,63,94],   label:'Blocked'},
];

function renderAreaChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  const W0 = canvas.offsetWidth || 700, H0 = 320;
  canvas.width = W0 * dpr; canvas.height = H0 * dpr;
  canvas.style.width = W0+'px'; canvas.style.height = H0+'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  const W = W0, H = H0;
  const PAD = {top:16,right:16,bottom:48,left:36};
  const gW = W-PAD.left-PAD.right, gH = H-PAD.top-PAD.bottom;

  ctx.clearRect(0,0,W,H);
  const all = AREA_DATA.flatMap(d=>SERIES.map(s=>d[s.key]));
  const max = Math.max(...all);
  const n = AREA_DATA.length;
  const xP = i => PAD.left + (i/(n-1))*gW;
  const yP = v => PAD.top  + gH - (v/max)*gH;

  // Grid
  [0,.25,.5,.75,1].forEach(t => {
    const y = PAD.top + gH*(1-t);
    ctx.beginPath(); ctx.moveTo(PAD.left,y); ctx.lineTo(PAD.left+gW,y);
    ctx.strokeStyle='#1e293b'; ctx.lineWidth=1; ctx.setLineDash([3,3]); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle='#64748b'; ctx.font='11px JetBrains Mono,monospace';
    ctx.textAlign='right'; ctx.textBaseline='middle';
    ctx.fillText(Math.round(max*t), PAD.left-6, y);
  });
  // X labels
  AREA_DATA.forEach((d,i) => {
    ctx.fillStyle='#64748b'; ctx.font='11px JetBrains Mono,monospace';
    ctx.textAlign='center'; ctx.textBaseline='top';
    ctx.fillText(d.time, xP(i), PAD.top+gH+8);
  });

  // Areas + lines
  SERIES.forEach(s => {
    const [r,g,b] = s.rgb;
    const grad = ctx.createLinearGradient(0,PAD.top,0,PAD.top+gH);
    grad.addColorStop(0,`rgba(${r},${g},${b},0.3)`);
    grad.addColorStop(1,`rgba(${r},${g},${b},0)`);
    ctx.beginPath();
    AREA_DATA.forEach((d,i) => i===0 ? ctx.moveTo(xP(i),yP(d[s.key])) : ctx.lineTo(xP(i),yP(d[s.key])));
    ctx.lineTo(xP(n-1),PAD.top+gH); ctx.lineTo(xP(0),PAD.top+gH); ctx.closePath();
    ctx.fillStyle=grad; ctx.fill();
    ctx.beginPath();
    AREA_DATA.forEach((d,i) => i===0 ? ctx.moveTo(xP(i),yP(d[s.key])) : ctx.lineTo(xP(i),yP(d[s.key])));
    ctx.strokeStyle=s.stroke; ctx.lineWidth=2; ctx.lineJoin='round'; ctx.stroke();
    AREA_DATA.forEach((d,i) => {
      ctx.beginPath(); ctx.arc(xP(i),yP(d[s.key]),3,0,2*Math.PI);
      ctx.fillStyle=s.stroke; ctx.fill();
    });
  });

  // Legend
  let lx=PAD.left; const ly=H-10;
  SERIES.forEach(s => {
    ctx.beginPath(); ctx.arc(lx+5,ly,5,0,2*Math.PI); ctx.fillStyle=s.stroke; ctx.fill();
    ctx.fillStyle='#94a3b8'; ctx.font='11px JetBrains Mono,monospace';
    ctx.textAlign='left'; ctx.textBaseline='middle';
    ctx.fillText(s.label, lx+14, ly);
    lx += ctx.measureText(s.label).width + 28;
  });
}
