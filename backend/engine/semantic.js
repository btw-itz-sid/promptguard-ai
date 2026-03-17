// ── SEMANTIC ENGINE v2 — 20 NLP intent rules ─────────────────────
const RULES = [
  { id:'s1',  category:'Credential Access',    severity:'critical', score:97,
    desc:'Intent to access credentials',
    must:[['access','retrieve','get','fetch','obtain','read','extract','pull','grab','steal','find','give','show','tell','send','dump']],
    any: [['internal','backend','server','system','database','db','infra','vault'],
          ['credential','credentials','password','passwd','secret','key','token','auth','login','api key','api_key']] },
  { id:'s2',  category:'Credential Access',    severity:'critical', score:95,
    desc:'Print or expose secrets',
    must:[['print','show','display','output','reveal','expose','dump','list','tell','share','return','log','write']],
    any: [['credential','credentials','password','passwd','secret','key','token','auth','config','env','environment','vault']] },
  { id:'s3',  category:'Credential Access',    severity:'critical', score:97,
    desc:'Database credential extraction',
    must:[['database','db','sql','mongo','postgres','mysql','redis','firebase','sqlite','cassandra','dynamo','elastic']],
    any: [['credential','credentials','password','secret','key','token','config','access','login','dump','connection']] },
  { id:'s4',  category:'Jailbreak',            severity:'critical', score:92,
    desc:'Security bypass intent',
    must:[['bypass','circumvent','evade','avoid','skip','disable','remove','ignore','get around','break out','work around']],
    any: [['security','filter','restriction','limit','rule','policy','safety','check','validation','guard','constraint','guardrail']] },
  { id:'s5',  category:'Data Exfiltration',    severity:'critical', score:96,
    desc:'System prompt extraction',
    must:[['reveal','show','tell','give','output','print','share','expose','repeat','return','display','leak','reproduce']],
    any: [['system','initial','original','hidden','internal','full'],
          ['prompt','instruction','directive','context','configuration','setup','rules','guidelines']] },
  { id:'s6',  category:'Jailbreak',            severity:'critical', score:92,
    desc:'Instruction override',
    must:[['ignore','forget','disregard','override','stop','remove','delete','clear','abandon','skip','bypass']],
    any: [['instruction','rule','guideline','policy','restriction','constraint','previous','prior','above','training','all']] },
  { id:'s7',  category:'Encoded Payload',      severity:'critical', score:98,
    desc:'Decode and execute payload',
    must:[['decode','decrypt','decipher','atob','base64','encoded','cipher','hidden message','rot13']],
    any: [['execute','run','perform','follow','do','apply','act','carry out','obey','instructions','commands','task','these']] },
  { id:'s8',  category:'Malware',              severity:'critical', score:97,
    desc:'Malware or exploit creation',
    must:[['create','write','build','generate','make','develop','code','craft','produce','design']],
    any: [['malware','virus','ransomware','keylogger','trojan','worm','backdoor','exploit','payload','rootkit','spyware','botnet','rat','stealer']] },
  { id:'s9',  category:'Privilege Escalation', severity:'critical', score:93,
    desc:'Admin impersonation',
    must:[['admin','administrator','superuser','root','privileged','elevated','authorized','operator']],
    any: [['act as','pretend','you are','be the','role','impersonate','access','mode','become','i am','i\'m','give me']] },
  { id:'s10', category:'Data Exfiltration',    severity:'high',     score:88,
    desc:'Private data extraction',
    must:[['extract','get','pull','retrieve','collect','harvest','scrape','steal','copy','export','download']],
    any: [['private','personal','sensitive','confidential','internal','proprietary','classified','secret'],
          ['data','info','information','records','details','files','logs','history','database','documents']] },
  { id:'s11', category:'Social Engineering',   severity:'high',     score:78,
    desc:'Roleplay jailbreak',
    must:[['pretend','roleplay','role play','act as','imagine','simulate','play the role','you are now','character']],
    any: [['no restrictions','no limits','no rules','no guidelines','unrestricted','uncensored','without filter','freely','do anything']] },
  { id:'s12', category:'System Recon',         severity:'medium',   score:60,
    desc:'Probing defenses',
    must:[['what','how','tell me','describe','explain','list']],
    any: [['security measures','security checks','safety filters','how you protect','how you detect','what you block','your restrictions','your limits','your rules','what you monitor']] },
  { id:'s13', category:'Code Execution',       severity:'critical', score:96,
    desc:'Remote code execution intent',
    must:[['run','execute','eval','call','invoke','launch','trigger','start']],
    any: [['shell','bash','terminal','command','script','code','function','process','subprocess','os command']] },
  { id:'s14', category:'Prompt Injection',     severity:'critical', score:94,
    desc:'Instruction smuggling via formatting',
    must:[['below','following','above','here','note','attention','important','update']],
    any: [['new instructions','new task','ignore previous','override','your real','actually you','from now on','starting now']] },
  { id:'s15', category:'Data Exfiltration',    severity:'critical', score:95,
    desc:'Webhook or remote exfil',
    must:[['send','post','upload','transmit','forward','submit','push']],
    any: [['webhook','url','endpoint','server','http','https','api','remote','external','internet']] },
  { id:'s16', category:'Jailbreak',            severity:'high',     score:82,
    desc:'Mode switch attack',
    must:[['enter','switch','enable','turn on','activate','engage','start']],
    any: [['dev mode','developer mode','god mode','unrestricted mode','no filter mode','jailbreak mode','admin mode','maintenance mode']] },
  { id:'s17', category:'Credential Access',    severity:'critical', score:95,
    desc:'Token or session hijack intent',
    must:[['steal','capture','intercept','hijack','clone','copy','read','get','extract']],
    any: [['session','cookie','jwt','token','bearer','auth','oauth','saml','sso','api key']] },
  { id:'s18', category:'Social Engineering',   severity:'high',     score:75,
    desc:'Urgency pressure attack',
    must:[['urgent','immediately','asap','right now','hurry','quick','fast','now']],
    any: [['override','bypass','skip','ignore','don\'t check','no time','emergency','critical']] },
  { id:'s19', category:'System Recon',         severity:'high',     score:80,
    desc:'Infrastructure enumeration',
    must:[['list','enumerate','find','discover','identify','map','scan']],
    any: [['servers','hosts','ips','endpoints','services','ports','databases','internal network','infrastructure','systems']] },
  { id:'s20', category:'Code Execution',       severity:'critical', score:95,
    desc:'Injection via string construction',
    must:[['concat','join','combine','build','construct','assemble','format','string','concatenate']],
    any: [['command','query','sql','shell','eval','exec','code','payload','injection','script']] },
];

function tokenize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s'_\-]/g,' ').split(/\s+/).filter(Boolean);
}

function semanticCheck(text) {
  const tokens = tokenize(text);
  const lower  = text.toLowerCase();
  const matches = [];
  let maxScore = 0;

  for (const rule of RULES) {
    let pass = true;
    for (const group of rule.must) {
      if (!group.some(kw => tokens.includes(kw) || lower.includes(kw))) { pass = false; break; }
    }
    if (pass && rule.any) {
      for (const group of rule.any) {
        if (!group.some(kw => tokens.includes(kw) || lower.includes(kw))) { pass = false; break; }
      }
    }
    if (pass) {
      matches.push({ id:rule.id, name:rule.desc, category:rule.category, severity:rule.severity, score:rule.score });
      maxScore = Math.max(maxScore, rule.score);
    }
  }
  return { score: maxScore, matches };
}

module.exports = semanticCheck;
