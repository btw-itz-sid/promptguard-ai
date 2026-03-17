// ── REGEX RULES v2 — 50 rules across 12 categories ──────────────
module.exports = [

  // ─── JAILBREAK ────────────────────────────────────────────────
  { name:'Jailbreak — Ignore Instructions', category:'Jailbreak', severity:'critical', score:92,
    pattern:/ignore\s+(all\s+)?(previous|prior|above|earlier|given)\s+(instructions?|prompts?|rules?|constraints?|guidelines?|context)/i },
  { name:'Jailbreak — DAN / STAN / AIM Mode', category:'Jailbreak', severity:'critical', score:94,
    pattern:/\b(DAN|STAN|AIM|DUDE|KEVIN|JAILBREAK|UCAR|BHAI|DEV\s*MODE)\b/ },
  { name:'Jailbreak — Freed / Unchained', category:'Jailbreak', severity:'critical', score:92,
    pattern:/you\s+(are\s+now|have\s+been)\s+(freed?|unchained|jailbroken|unfiltered|uncensored|unleashed|liberated)/i },
  { name:'Jailbreak — Forget All Rules', category:'Jailbreak', severity:'critical', score:90,
    pattern:/forget\s+(all\s+)?(your\s+)?(rules|guidelines|restrictions|training|instructions|constraints|limits|prior\s+context)/i },
  { name:'Jailbreak — Bypass Safety', category:'Jailbreak', severity:'high', score:82,
    pattern:/\b(bypass|circumvent|override|disable|remove|deactivate|turn\s+off)\s+(safety|security|filters?|restrictions?|limits?|rules?|guidelines?|guardrails?)/i },
  { name:'Jailbreak — No Restrictions Mode', category:'Jailbreak', severity:'high', score:84,
    pattern:/without\s+(any\s+)?(restrictions?|limits?|filters?|rules?|guidelines?|safety|censorship|oversight)/i },
  { name:'Jailbreak — Opposite Day', category:'Jailbreak', severity:'high', score:78,
    pattern:/opposite\s+day|do\s+the\s+opposite\s+of|pretend\s+.{0,20}opposite|reverse\s+your\s+(rules|guidelines)/i },
  { name:'Jailbreak — Grandma Exploit', category:'Jailbreak', severity:'high', score:75,
    pattern:/grandma\s+(used\s+to\s+)?(tell|read|whisper|say|explain|describe)\s+.{0,40}(step|how|make|create|build)/i },
  { name:'Jailbreak — Story / Fiction Frame', category:'Jailbreak', severity:'medium', score:60,
    pattern:/write\s+a\s+(story|fiction|novel|screenplay|script)\s+where\s+.{0,60}(character|person|ai|robot)\s+(explains?|describes?|shows?|tells?)/i },

  // ─── PROMPT INJECTION ─────────────────────────────────────────
  { name:'Prompt Injection — Token Smuggling', category:'Prompt Injection', severity:'critical', score:96,
    pattern:/\[INST\]|\[\/INST\]|<\|im_start\|>|<\|im_end\|>|\{\{.*?\}\}|\{%.*?%\}|<s>|<\/s>/i },
  { name:'Prompt Injection — System Header Override', category:'Prompt Injection', severity:'critical', score:95,
    pattern:/###\s*(SYSTEM|INSTRUCTION|OVERRIDE|CONTEXT|PROMPT|NEW\s+TASK|HIDDEN|ADMIN)/i },
  { name:'Prompt Injection — Admin/Root Token', category:'Prompt Injection', severity:'critical', score:92,
    pattern:/\[(override|admin|root|superuser|god|system|master|developer|operator)\]/i },
  { name:'Prompt Injection — Delimiter Attack', category:'Prompt Injection', severity:'high', score:80,
    pattern:/(={4,}|-{4,}|\*{4,}|_{4,}|#{4,})\s*(SYSTEM|INSTRUCTION|OVERRIDE|NEW|END|START|IGNORE)/i },
  { name:'Prompt Injection — New Instruction Append', category:'Prompt Injection', severity:'high', score:82,
    pattern:/\n{2,}\s*(now|instead|actually|wait|stop|new\s+task|your\s+new|real\s+instruction)/i },
  { name:'Prompt Injection — End Anchor Escape', category:'Prompt Injection', severity:'high', score:79,
    pattern:/(end\s+of\s+(conversation|session|context|prompt|input)|ignore\s+above|disregard\s+above)/i },

  // ─── CREDENTIAL ACCESS ────────────────────────────────────────
  { name:'Credential Access — Internal DB', category:'Credential Access', severity:'critical', score:97,
    pattern:/internal\s+.{0,40}(database|db|credential|password|secret|config|server|storage|vault)/i },
  { name:'Credential Access — Dump Secrets', category:'Credential Access', severity:'critical', score:96,
    pattern:/(print|show|display|output|reveal|dump|expose|fetch|list|return|log|send|share)\s+.{0,50}(credential|password|passwd|secret|api[\s_-]?key|token|auth|bearer)/i },
  { name:'Credential Access — Database Creds', category:'Credential Access', severity:'critical', score:97,
    pattern:/(database|db|sql|mongo|redis|postgres|mysql|firebase|sqlite|dynamo|elastic)\s+.{0,40}(credential|password|secret|key|config|access|login|connection)/i },
  { name:'Credential Access — Env File', category:'Credential Access', severity:'critical', score:95,
    pattern:/(\.env\b|environment\s+variable|process\.env|os\.environ|dotenv|config\.yml|secrets\.yaml)/i },
  { name:'Credential Access — Private Key', category:'Credential Access', severity:'critical', score:96,
    pattern:/(ssh[\s_-]?key|private[\s_-]?key|\.pem\b|rsa[\s_-]?key|BEGIN\s+PRIVATE|pgp\s+key|gpg\s+key|id_rsa)/i },
  { name:'Credential Access — AWS/Cloud Keys', category:'Credential Access', severity:'critical', score:97,
    pattern:/(aws[\s_-]?(access|secret|session)[\s_-]?key|AKIA[0-9A-Z]{16}|gcp[\s_-]?service[\s_-]?account|azure[\s_-]?client[\s_-]?secret)/i },
  { name:'Credential Access — JWT Token', category:'Credential Access', severity:'high', score:85,
    pattern:/(jwt|json\s+web\s+token|bearer\s+token|access\s+token|refresh\s+token)\s+.{0,30}(show|get|reveal|dump|extract|steal)/i },

  // ─── ENCODED PAYLOAD ──────────────────────────────────────────
  { name:'Encoded Payload — Decode Execute', category:'Encoded Payload', severity:'critical', score:98,
    pattern:/(decode|decrypt|decipher|atob|from_base64|base64_decode)\s+.{0,60}(execute|run|perform|follow|apply|act\s+on|carry\s+out|obey)/i },
  { name:'Encoded Payload — Execute Instructions', category:'Encoded Payload', severity:'critical', score:97,
    pattern:/\b(execute|run|apply|follow|perform|carry\s+out)\s+(its?|the(se)?|those|following|above|hidden)?\s*(instructions?|commands?|payload|directives?|orders?)/i },
  { name:'Encoded Payload — Base64 Blob', category:'Encoded Payload', severity:'high', score:72,
    pattern:/base64\s*[:\-]?\s*[A-Za-z0-9+/]{20,}/i },
  { name:'Encoded Payload — ROT13 Cipher', category:'Encoded Payload', severity:'medium', score:65,
    pattern:/rot[\s_-]?13|caesar\s+cipher|shift\s+cipher|decode\s+this\s+message/i },

  // ─── DATA EXFILTRATION ────────────────────────────────────────
  { name:'Data Exfil — System Prompt Leak', category:'Data Exfiltration', severity:'critical', score:96,
    pattern:/(reveal|show|print|output|expose|share|leak|tell\s+me|give\s+me|repeat|return|display)\s+(your\s+)?(system\s+prompt|initial\s+prompt|instructions?|configuration|training\s+data|context\s+window)/i },
  { name:'Data Exfil — Send to URL', category:'Data Exfiltration', severity:'critical', score:94,
    pattern:/send\s+.{0,60}(data|info|records?|logs?|history|context|credentials?|content)\s+(to|via|through|using|at)\s+(http|https|ftp|url|webhook)/i },
  { name:'Data Exfil — Repeat All Context', category:'Data Exfiltration', severity:'high', score:84,
    pattern:/repeat\s+(back\s+)?(everything|all)\s+(you|in\s+your)\s*(know|have|context|system|memory|been\s+told)/i },
  { name:'Data Exfil — Training Data Extraction', category:'Data Exfiltration', severity:'high', score:82,
    pattern:/(extract|reproduce|output|regurgitate|recite)\s+.{0,40}(training\s+data|training\s+examples?|dataset|memorized)/i },
  { name:'Data Exfil — Webhook Exfil', category:'Data Exfiltration', severity:'critical', score:95,
    pattern:/(post|send|fetch|curl|wget|http\.get|axios|request)\s+.{0,80}(webhook|requestbin|ngrok|burp|canary|exfil)/i },

  // ─── PRIVILEGE ESCALATION ─────────────────────────────────────
  { name:'Privilege Escalation — Admin Mode', category:'Privilege Escalation', severity:'critical', score:93,
    pattern:/\b(admin|root|superuser|sudo|operator)\s+(access|mode|privileges?|rights?|override|panel|shell|console)/i },
  { name:'Privilege Escalation — Developer Mode', category:'Privilege Escalation', severity:'high', score:80,
    pattern:/(developer|debug|maintenance|god|super|unrestricted|elevated)\s+mode\s+(on|enabled|activated|unlocked|granted|engaged)/i },
  { name:'Privilege Escalation — Impersonation', category:'Privilege Escalation', severity:'high', score:82,
    pattern:/i\s+(am|'m)\s+(the\s+)?(ceo|cto|ciso|admin|developer|owner|authorized|system\s+admin|openai|anthropic|google)/i },

  // ─── CODE EXECUTION ───────────────────────────────────────────
  { name:'Code Execution — OS Commands', category:'Code Execution', severity:'critical', score:98,
    pattern:/os\.(system|popen|execvp?e?|spawn)|subprocess\.(call|run|Popen|check_output|check_call)|child_process\.(exec|spawn|fork)/i },
  { name:'Code Execution — Eval / Exec', category:'Code Execution', severity:'critical', score:97,
    pattern:/\beval\s*\(|\bexec\s*\(|\b__import__\s*\(|\bcompile\s*\(|\bFunction\s*\(|new\s+Function/i },
  { name:'Code Execution — Shell Injection', category:'Code Execution', severity:'critical', score:96,
    pattern:/(`[^`]*`|\$\([^)]*\))\s*(rm|del|format|drop|wget|curl|nc|bash|sh|python|perl|ruby)/i },
  { name:'Code Execution — File Write', category:'Code Execution', severity:'high', score:80,
    pattern:/(open|write|fopen|file_put_contents|fs\.write)\s*\(.{0,60}(\/etc\/|\/usr\/|\.bashrc|\.zshrc|crontab|authorized_keys)/i },

  // ─── SQL INJECTION ────────────────────────────────────────────
  { name:'SQL Injection — Classic', category:'SQL Injection', severity:'critical', score:96,
    pattern:/('\s*(OR|AND)\s*'?\d+|UNION\s+(ALL\s+)?SELECT|;\s*DROP\s+(TABLE|DATABASE)|1\s*=\s*1\s*--|--\s*$|\/\*.*?\*\/|xp_cmdshell|EXEC\s*\()/i },
  { name:'SQL Injection — Blind', category:'SQL Injection', severity:'critical', score:94,
    pattern:/(SLEEP\s*\(\d+\)|WAITFOR\s+DELAY|BENCHMARK\s*\(|IF\s*\(\s*(SELECT|EXISTS)|CASE\s+WHEN\s+.{0,30}THEN)/i },
  { name:'SQL Injection — Stacked Query', category:'SQL Injection', severity:'critical', score:95,
    pattern:/;\s*(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|TRUNCATE|EXEC)\s/i },

  // ─── XSS ──────────────────────────────────────────────────────
  { name:'XSS — Script Tag', category:'XSS', severity:'critical', score:97,
    pattern:/<script[\s>]|javascript\s*:|on(load|click|error|mouseover|focus|blur|input|change|submit|keydown)\s*=/i },
  { name:'XSS — SVG/IMG Payload', category:'XSS', severity:'critical', score:95,
    pattern:/<(svg|img|iframe|object|embed|link|meta)[^>]*(onerror|onload|src\s*=\s*["']?javascript)/i },

  // ─── SOCIAL ENGINEERING ───────────────────────────────────────
  { name:'Social Eng — Research Framing', category:'Social Engineering', severity:'medium', score:55,
    pattern:/for\s+(research|educational|academic|scientific|testing)\s+purposes?.{0,60}(how\s+to|steps?\s+to|instructions?\s+for|method\s+to)/i },
  { name:'Social Eng — Hypothetical Frame', category:'Social Engineering', severity:'medium', score:58,
    pattern:/hypothetically\s+(speaking\s+)?(if|assuming)\s+you\s+(could|had\s+no|were\s+able|weren'?t|can)/i },
  { name:'Social Eng — Roleplay Exploit', category:'Social Engineering', severity:'high', score:76,
    pattern:/(roleplay|role\s*play|act\s+as|pretend\s+(to\s+be|you\s+are)|play\s+the\s+role\s+of)\s+.{0,40}(no\s+rules|no\s+limits|no\s+restrictions|unrestricted|evil|hacker|villain)/i },
  { name:'Social Eng — Trust Manipulation', category:'Social Engineering', severity:'medium', score:60,
    pattern:/(trust\s+me|i\s+promise|don'?t\s+tell\s+anyone|between\s+us|keep\s+this\s+secret|off\s+the\s+record)\s+.{0,60}(how|what|where|tell|show|give)/i },

  // ─── SYSTEM RECON ─────────────────────────────────────────────
  { name:'System Recon — File Listing', category:'System Recon', severity:'high', score:82,
    pattern:/(list|show|cat|ls|dir|find|ls\s+-la|find\s+\/)\s+.{0,30}(files?|directories?|folders?|\/etc\/|\/var\/|system\s+path|config\s+files?)/i },
  { name:'System Recon — User Enumeration', category:'System Recon', severity:'high', score:80,
    pattern:/(list|enumerate|dump|show|get)\s+.{0,30}(users?|accounts?|usernames?|principals?|employees?|staff)/i },
  { name:'System Recon — Network Probe', category:'System Recon', severity:'high', score:79,
    pattern:/(nmap|ping|traceroute|netstat|ifconfig|ipconfig|arp\s+-a|nslookup|dig\s+).{0,60}(internal|network|subnet|server|host)/i },
  { name:'System Recon — Security Probe', category:'System Recon', severity:'medium', score:62,
    pattern:/(what|how)\s+(are|do)\s+you\s+(detect|block|filter|check|monitor|protect|scan|validate)/i },
];
