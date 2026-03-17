// App — matches App.tsx tab logic and init
function goTab(name) {
  document.querySelectorAll('.pane').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(b=>b.classList.remove('active'));
  document.getElementById('pane-'+name).classList.add('active');
  document.querySelector(`.nav-tab[data-tab="${name}"]`).classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
  renderStats('stats-grid');
  renderAreaChart('area-chart-canvas');
  setTimeout(() => { drawPie('pie-canvas'); renderPieLegend('pie-legend'); }, 80);
  LogStore.render();
  renderRules();
  goTab('dashboard');
});
