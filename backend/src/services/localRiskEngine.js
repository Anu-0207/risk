/**
 * Local Risk Engine for RiskVault
 * Evaluates local regex, heuristic and pattern detection across:
 * - Privacy (PII, Phone, Credit Card, Email, Aadhaar, PAN)
 * - Security & Prompt Injection (jailbreak, system prompt extraction, bypass)
 * - Cybersecurity (malware, phishing, ransomware, SQLi, exploits)
 * - Fraud (stolen card, suspicious transfers, fake transactions)
 * - Compliance & Reliability indicators
 */

export function runLocalRiskAnalysis(input) {
  const text = String(input || '');
  const lower = text.toLowerCase();

  const threats = [];
  const recommendations = [];

  let privacyScore = 0;
  let securityScore = 0;
  let hallucinationScore = 0;
  let biasScore = 0;
  let complianceScore = 0;
  let fraudScore = 0;

  // --- PRIVACY CHECKS ---
  // 1. Email pattern
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emails = text.match(emailRegex);
  if (emails && emails.length > 0) {
    privacyScore += Math.min(35, emails.length * 20);
    threats.push({
      id: 'local_priv_email_' + Date.now() + Math.random().toString(36).substring(2, 5),
      threat: 'Direct Email Address Exposure',
      category: 'Privacy',
      severity: 'Medium',
      evidence: `Detected email pattern: "${emails[0]}"${emails.length > 1 ? ` (+${emails.length - 1} more)` : ''}`,
      explanation: 'Plaintext email addresses in AI prompts can lead to unintended PII leakage or training ingestion.',
      status: 'Open',
    });
  }

  // 2. Phone number pattern
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
  const phones = text.match(phoneRegex);
  if (phones && phones.length > 0) {
    privacyScore += Math.min(30, phones.length * 20);
    threats.push({
      id: 'local_priv_phone_' + Date.now() + Math.random().toString(36).substring(2, 5),
      threat: 'Telephone Number Detected',
      category: 'Privacy',
      severity: 'Medium',
      evidence: `Detected contact number: "${phones[0]}"`,
      explanation: 'Contact numbers represent sensitive PII that should be anonymized before transmitting to external AI models.',
      status: 'Open',
    });
  }

  // 3. Credit Card pattern (13-19 digits with optional dashes/spaces)
  const ccRegex = /\b(?:\d{4}[-\s]?){3}\d{4}\b|\b\d{15,16}\b/g;
  const creditCards = text.match(ccRegex);
  if (creditCards && creditCards.length > 0) {
    privacyScore += 50;
    fraudScore += 40;
    threats.push({
      id: 'local_priv_cc_' + Date.now() + Math.random().toString(36).substring(2, 5),
      threat: 'Credit Card / Payment Number Pattern',
      category: 'Privacy',
      severity: 'Critical',
      evidence: `Detected payment card format matching digits: "${creditCards[0].replace(/\d{4}(?=\d)/g, '****-')}"`,
      explanation: 'Unmasked payment card numbers violate PCI-DSS regulations and present severe financial exfiltration risk.',
      status: 'Open',
    });
  }

  // 4. Aadhaar-like pattern (12 digits in groups of 4)
  const aadhaarRegex = /\b\d{4}\s\d{4}\s\d{4}\b/g;
  const aadhaar = text.match(aadhaarRegex);
  if (aadhaar && aadhaar.length > 0) {
    privacyScore += 45;
    threats.push({
      id: 'local_priv_aadhaar_' + Date.now() + Math.random().toString(36).substring(2, 5),
      threat: 'National ID (Aadhaar-like format)',
      category: 'Privacy',
      severity: 'High',
      evidence: `Matched 12-digit national identifier pattern: "${aadhaar[0].substring(0, 4)} **** ****"`,
      explanation: 'Government-issued identification numbers must not be sent over unencrypted or third-party AI pipelines.',
      status: 'Open',
    });
  }

  // 5. PAN-like pattern (5 letters, 4 numbers, 1 letter)
  const panRegex = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g;
  const pan = text.toUpperCase().match(panRegex);
  if (pan && pan.length > 0) {
    privacyScore += 40;
    threats.push({
      id: 'local_priv_pan_' + Date.now() + Math.random().toString(36).substring(2, 5),
      threat: 'Tax ID / PAN-like Pattern Detected',
      category: 'Privacy',
      severity: 'High',
      evidence: `Matched tax identification structure: "${pan[0]}"`,
      explanation: 'Taxpayer identification numbers are sensitive financial identifiers subject to strict data protection.',
      status: 'Open',
    });
  }

  // --- PROMPT INJECTION & SECURITY ---
  const promptInjectionSignals = [
    { pattern: /ignore\s+(all\s+)?previous\s+instructions/i, name: 'Prompt Override: "Ignore previous instructions"', sev: 'Critical' },
    { pattern: /ignore\s+(the\s+)?system\s+prompt/i, name: 'System Directive Hijacking', sev: 'Critical' },
    { pattern: /reveal\s+(the\s+)?(system\s+prompt|hidden\s+instructions)/i, name: 'System Prompt Exfiltration Attempt', sev: 'High' },
    { pattern: /jailbreak|bypass\s+(all\s+)?restrictions|dan\s+mode|developer\s+mode/i, name: 'AI Jailbreak / Guardrail Bypass Heuristic', sev: 'Critical' },
    { pattern: /disregard\s+safety\s+guidelines/i, name: 'Safety Filter Bypass Directive', sev: 'High' },
  ];

  for (const signal of promptInjectionSignals) {
    if (signal.pattern.test(text)) {
      securityScore += 45;
      complianceScore += 30;
      threats.push({
        id: 'local_sec_inj_' + Date.now() + Math.random().toString(36).substring(2, 5),
        threat: signal.name,
        category: 'Security',
        severity: signal.sev,
        evidence: `Matched prompt injection indicator: "${text.match(signal.pattern)?.[0]}"`,
        explanation: 'Input contains adversarial prompt patterns aimed at overriding model system boundaries or extracting internal logic.',
        status: 'Open',
      });
    }
  }

  // --- CYBERSECURITY & EXPLOITS ---
  const cyberSignals = [
    { pattern: /\b(malware|ransomware|trojan|keylogger|rootkit)\b/i, name: 'Malware / Ransomware Threat Context', sev: 'High' },
    { pattern: /\b(phishing|credential\s+theft|harvest(ing)?\s+passwords?)\b/i, name: 'Phishing / Credential Harvesting Context', sev: 'High' },
    { pattern: /(\bselect\b.*\bfrom\b|\bunion\b.*\bselect\b|\bdrop\b\s+\btable\b|'--|;\s*drop\b)/i, name: 'SQL Injection Syntax Signature', sev: 'Critical' },
    { pattern: /\b(zero-day|cve-\d{4}-\d+|buffer\s+overflow|reverse\s+shell|payload\s+execution)\b/i, name: 'Exploit / Vulnerability Weaponization', sev: 'Critical' },
    { pattern: /(powershell\.exe\s+-enc|cmd\.exe\s+\/c|curl\s+http.*\|\s*bash)/i, name: 'Remote Code / Shell Execution Command', sev: 'Critical' },
  ];

  for (const signal of cyberSignals) {
    if (signal.pattern.test(text)) {
      securityScore += 40;
      complianceScore += 25;
      threats.push({
        id: 'local_sec_cyber_' + Date.now() + Math.random().toString(36).substring(2, 5),
        threat: signal.name,
        category: 'Security',
        severity: signal.sev,
        evidence: `Matched cybersecurity signature: "${text.match(signal.pattern)?.[0]}"`,
        explanation: 'The input contains code execution, exploit payloads, or malicious security threat terminology.',
        status: 'Open',
      });
    }
  }

  // --- FRAUD & FINANCIAL CRIME ---
  const fraudSignals = [
    { pattern: /\b(unauthorized\s+transaction|suspicious\s+transfer|wire\s+fraud)\b/i, name: 'Unauthorized Transaction Signal', sev: 'High' },
    { pattern: /\b(stolen\s+card|fake\s+transaction|chargeback\s+fraud|carding)\b/i, name: 'Payment Card / Fraudulent Activity', sev: 'Critical' },
    { pattern: /\b(identity\s+theft|synthetic\s+identity|fake\s+kyc|account\s+takeover)\b/i, name: 'Identity Compromise / ATO Signal', sev: 'Critical' },
    { pattern: /\b(crypto\s+drainer|seed\s+phrase\s+theft|wallet\s+drain)\b/i, name: 'Cryptocurrency Exfiltration Signal', sev: 'Critical' },
  ];

  for (const signal of fraudSignals) {
    if (signal.pattern.test(text)) {
      fraudScore += 45;
      threats.push({
        id: 'local_fraud_' + Date.now() + Math.random().toString(36).substring(2, 5),
        threat: signal.name,
        category: 'Fraud',
        severity: signal.sev,
        evidence: `Detected fraud indicator: "${text.match(signal.pattern)?.[0]}"`,
        explanation: 'Input demonstrates transaction anomalies, stolen identity tokens, or illicit financial behavior flags.',
        status: 'Open',
      });
    }
  }

  // --- HALLUCINATION & FACTUAL DRIFT HEURISTICS ---
  const unverifiedFactualPatterns = [
    /\b(as\s+we\s+all\s+know|guaranteed\s+100%|scientific\s+fact\s+without\s+proof|it\s+is\s+proven\s+that\s+everyone)\b/i,
    /\b(unsubstantiated\s+cure|instant\s+wealth|guaranteed\s+returns\s+of\s+\d+%)\b/i,
  ];
  for (const p of unverifiedFactualPatterns) {
    if (p.test(text)) {
      hallucinationScore += 35;
      threats.push({
        id: 'local_hallucination_' + Date.now() + Math.random().toString(36).substring(2, 5),
        threat: 'Unverifiable Absolutist Claim',
        category: 'Hallucination',
        severity: 'Medium',
        evidence: `Flagged claim pattern: "${text.match(p)?.[0]}"`,
        explanation: 'Absolute claims without verifiable grounding indicate potential model hallucination or misleading assertions.',
        status: 'Open',
      });
    }
  }

  // --- BIAS HEURISTICS ---
  const biasTerms = /\b(all\s+(women|men|immigrants|races|religions)\s+are\s+(lazy|violent|inferior|bad)|inherently\s+superior)\b/i;
  if (biasTerms.test(text)) {
    biasScore += 70;
    threats.push({
      id: 'local_bias_' + Date.now() + Math.random().toString(36).substring(2, 5),
      threat: 'Stereotypical / Discriminatory Generalization',
      category: 'Bias',
      severity: 'Critical',
      evidence: `Matched bias pattern: "${text.match(biasTerms)?.[0]}"`,
      explanation: 'Generalizing harmful attributes to demographic groups breaches responsible AI fairness guidelines.',
      status: 'Open',
    });
  }

  // Generate actionable recommendations
  if (privacyScore > 20) {
    recommendations.push({
      id: 'rec_priv_mask',
      title: 'Implement Automated PII Redaction / Masking',
      description: 'Filter or tokenize personal information (emails, phone numbers, identifiers) before sending payloads to LLM APIs.',
      resolved: false,
      priority: 'High',
    });
  }
  if (securityScore > 20) {
    recommendations.push({
      id: 'rec_sec_guard',
      title: 'Enforce Pre-Execution Input Sanitization',
      description: 'Deploy deterministic prompt injection filters and strict system boundary delimiters (e.g., XML boundary wrapping).',
      resolved: false,
      priority: 'High',
    });
  }
  if (fraudScore > 20) {
    recommendations.push({
      id: 'rec_fraud_freeze',
      title: 'Route to Secondary Anti-Fraud Review Gate',
      description: 'Place flagged financial operations or transfers into a manual verification quarantine before execution.',
      resolved: false,
      priority: 'Critical',
    });
  }
  if (threats.length === 0) {
    recommendations.push({
      id: 'rec_clean_pass',
      title: 'Maintain Standard Audit Logging',
      description: 'No immediate critical risk signals detected. Continue standard telemetry and periodically review token usage.',
      resolved: true,
      priority: 'Low',
    });
  }

  // Cap category scores between 0 and 100
  return {
    privacy: Math.min(100, privacyScore),
    security: Math.min(100, securityScore),
    hallucination: Math.min(100, hallucinationScore),
    bias: Math.min(100, biasScore),
    compliance: Math.min(100, complianceScore),
    fraud: Math.min(100, fraudScore),
    threats,
    recommendations,
  };
}
