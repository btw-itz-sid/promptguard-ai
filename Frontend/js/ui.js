// DetectionRules — matches DetectionRules.tsx exactly
const RULES_DATA = [
  {id:'1', name:'Direct Override Attempt',  pattern:'ignore (previous|all) instructions?',         severity:'critical', enabled:true,  matches:342},
  {id:'2', name:'System Prompt Extraction', pattern:'(show|reveal|display) (your )?system prompt', severity:'critical', enabled:true,  matches:189},
  {id:'3', name:'Role Manipulation',        pattern:'you are now (in |a )?developer mode',          severity:'high',     enabled:true,  matches:127},
  {id:'4', name:'SQL Injection Pattern',    pattern:'(DROP|DELETE|INSERT|UPDATE) (TABLE|DATABASE)', severity:'high',     enabled:true,  matches:98},
  {id:'5', name:'Context Delimiter Break',  pattern:'={3,}|\\n{3,}|(END|START) CONTEXT',            severity:'medium',   enabled:true,  matches:76},
  {id:'6', name:'Token Injection',          pattern:'\\[(SYSTEM|INST|ADMIN)\\]',                    severity:'medium',   enabled:true,  matches:54},
];

function toggleRule(id) {
  const r = RULES_DATA.find(r=>r.id===id);
  if (r) { r.enabled = !r.enabled; renderRules(); }
}

function renderRules() {
  const active = RULES_DATA.filter(r=>r.enabled).length;
  const el = document.getElementById('rules-active-count');
  if (el) el.textContent = `${active} active / ${RULES_DATA.length} total`;

  // ToggleRight (on) — cyan
  const onSvg = `<svg viewBox="0 0 24 24" style="width:24px;height:24px" fill="none">
    <rect x="1" y="6" width="22" height="12" rx="6" fill="#22d3ee" stroke="#22d3ee" stroke-width="1"/>
    <circle cx="16" cy="12" r="4" fill="#0f172a"/>
  </svg>`;
  // ToggleLeft (off) — slate
  const offSvg = `<svg viewBox="0 0 24 24" style="width:24px;height:24px" fill="none">
    <rect x="1" y="6" width="22" height="12" rx="6" stroke="#475569" stroke-width="2"/>
    <circle cx="8" cy="12" r="4" fill="#475569"/>
  </svg>`;

  document.getElementById('rules-list').innerHTML = RULES_DATA.map(r => `
    <div class="rule-row ${r.enabled?'':'off'}">
      <button class="toggle-btn" onclick="toggleRule('${r.id}')">${r.enabled ? onSvg : offSvg}</button>
      <div class="rule-body">
        <div class="rule-name-row">
          <span class="rule-name">${r.name}</span>
          <span class="sev-badge sev-${r.severity}">${r.severity}</span>
        </div>
        <div class="rule-pattern-block"><code>${r.pattern}</code></div>
        <p class="rule-matches">Matched ${r.matches.toLocaleString()} times in last 24h</p>
      </div>
      <div class="rule-actions">
        <button class="rule-btn edit" title="Edit">
          <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="rule-btn del" title="Delete">
          <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
        </button>
      </div>
    </div>`).join('');
}
