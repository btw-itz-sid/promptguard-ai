// ── SANITIZER v2 ─────────────────────────────────────────────────
function sanitize(text) {
  let out = text;

  out = out.replace(/<script[\s\S]*?<\/script>/gi, '[SCRIPT_REMOVED]');
  out = out.replace(/<[^>]+>/g, '');
  out = out.replace(/javascript\s*:/gi, 'blocked:');
  out = out.replace(/on\w+\s*=/gi, 'data-blocked=');
  out = out.replace(/\beval\s*\(/gi, 'BLOCKED(');
  out = out.replace(/\bexec\s*\(/gi, 'BLOCKED(');
  out = out.replace(/\b__import__\s*\(/gi, 'BLOCKED(');
  out = out.replace(/new\s+Function\s*\(/gi, 'BLOCKED(');

  // Injection tokens
  out = out.replace(/\[(override|admin|root|superuser|god|system|master|developer|operator)\]/gi, '[BLOCKED]');
  out = out.replace(/###\s*(SYSTEM|INSTRUCTION|OVERRIDE|CONTEXT|PROMPT)/gi, '[BLOCKED]');
  out = out.replace(/\[INST\]|\[\/INST\]|<\|im_start\|>|<\|im_end\|>/gi, '[BLOCKED]');

  // Jailbreak triggers
  out = out.replace(/\b(DAN|STAN|JAILBREAK|AIM|DUDE|UCAR)\b/g, '[BLOCKED]');

  // Instruction override phrases
  out = out.replace(/ignore\s+(all\s+)?(previous|prior|above)\s+instructions?/gi, '[INSTRUCTION_OVERRIDE_BLOCKED]');
  out = out.replace(/forget\s+(all\s+)?(your\s+)?(rules|guidelines|instructions?)/gi, '[INSTRUCTION_OVERRIDE_BLOCKED]');

  // Base64 blobs
  out = out.replace(/[A-Za-z0-9+/]{30,}={0,2}/g, m => {
    try { return `[B64_BLOCKED:"${Buffer.from(m,'base64').toString('utf8').slice(0,15)}…"]`; }
    catch(_) { return '[B64_BLOCKED]'; }
  });

  // Hex sequences
  out = out.replace(/(?:0x[0-9a-fA-F]{2}[\s,]*){4,}/gi, '[HEX_BLOCKED]');

  // SQL keywords in suspicious context
  out = out.replace(/;\s*(DROP|DELETE|TRUNCATE|ALTER)\s+(TABLE|DATABASE|SCHEMA)/gi, '; [SQL_BLOCKED]');
  out = out.replace(/UNION\s+(ALL\s+)?SELECT/gi, '[UNION_BLOCKED]');

  return out.trim();
}

module.exports = sanitize;
