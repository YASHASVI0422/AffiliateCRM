const fetch = require('node-fetch');
const Lead = require('../models/Lead');
const Ticket = require('../models/Ticket');

// Google Gemini Free API
const callGemini = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const err = new Error('GEMINI_API_KEY not set in .env');
    err.statusCode = 500;
    throw err;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
            thinkingConfig: {
              thinkingBudget: 0
            }
          },
        }),
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    if (!res.ok) {
      if (res.status === 429) {
        const err = new Error('AI rate limit reached, please try again in a moment');
        err.statusCode = 429;
        throw err;
      }
      const errData = await res.json().catch(() => ({}));
      const err = new Error(errData.error?.message || 'Gemini API error');
      err.statusCode = res.status;
      throw err;
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      const err = new Error('AI request timed out, please try again');
      err.statusCode = 408;
      throw err;
    }
    throw error;
  }
};

// Clean JSON from Gemini response (removes markdown code blocks if any)
const parseJSON = (text) => {
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
};

// ── AI Dashboard Insight ──────────────────────────────────────────────────────
const getDashboardInsight = async (req, res, next) => {
  try {
    const { totalLeads, convertedLeads, conversionRate, openTickets, newLeadsToday, totalUsers } = req.body;

    const prompt = `You are a CRM business analyst AI. Analyze these stats and return ONLY a valid JSON object (no markdown, no extra text):
{
  "summary": "2 sentence plain-english overview of the business health",
  "highlights": ["key insight 1", "key insight 2", "key insight 3"],
  "action": "one specific recommended action for today",
  "mood": "positive or neutral or warning"
}

Stats to analyze:
- Total Leads: ${totalLeads}
- Converted Leads: ${convertedLeads}
- Conversion Rate: ${conversionRate}%
- Open/In-Progress Tickets: ${openTickets}
- New Leads Today: ${newLeadsToday}
- Active Affiliates: ${totalUsers}

Return ONLY the JSON object, nothing else.`;

    const text = await callGemini(prompt);
    const insight = parseJSON(text);
    res.json({ success: true, data: insight });
  } catch (error) {
    next(error);
  }
};

// ── AI Ticket Reply Suggester ─────────────────────────────────────────────────
const suggestTicketReply = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId).populate('user', 'name');
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

    if (req.user.role !== 'admin' && ticket.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied to this ticket' });
    }

    const prevReplies = ticket.replies.map(r =>
      `[${r.isAdmin ? 'Admin' : 'User'}]: ${r.message}`
    ).join('\n');

    const isAdmin = req.user.role === 'admin';
    const persona = isAdmin 
      ? `You are a customer support agent for AffiliateCRM. Write a reply from the support team to the user (${ticket.user?.name}) who created the ticket.`
      : `You are the user (${req.user.name}) who created this support ticket. Write a reply from your perspective to the customer support team/admin.`;

    const prompt = `${persona}
Write a professional, clear, and concise reply under 100 words.
Return ONLY the reply text — no subject, no greetings like "Hi Sarah" if you are Sarah, no markdown, just the text.
If you need to provide specific details that are not in the conversation history, use clear placeholders like [Insert AI Service Name] or [Insert Error Message] so the user can fill them in.

Ticket Subject: ${ticket.subject}
Category: ${ticket.category}
Priority: ${ticket.priority}
Ticket Submitter: ${ticket.user?.name}

Original issue description:
${ticket.description}

${prevReplies ? `Previous replies in chronological order:\n${prevReplies}` : 'No previous replies.'}

Write the reply now:`;

    const reply = await callGemini(prompt);
    res.json({ success: true, data: { reply: reply.trim() } });
  } catch (error) {
    next(error);
  }
};

// ── AI Lead Scoring ───────────────────────────────────────────────────────────
const scoreLeadAI = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.leadId).populate('assignedAffiliate', 'name');
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    if (req.user.role === 'affiliate') {
      if (lead.assignedAffiliate?._id.toString() !== req.user._id.toString() && lead.createdBy?.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to score this lead' });
      }
    }

    const prompt = `You are a CRM lead scoring AI. Analyze this lead and return ONLY a valid JSON object (no markdown):
{
  "score": <number between 1 and 100>,
  "grade": "Hot or Warm or Cold",
  "reason": "one sentence explanation",
  "nextAction": "specific next step to move this lead forward"
}

CRITICAL INSTRUCTION ON CURRENT STATUS:
The score, grade, reason, and nextAction MUST be directly relevant to the lead's current status:
- If the current status is 'Converted': the score must be 100, the grade must be 'Hot', the reason must state that the lead is successfully converted (do NOT say they are "about to lock in" or "imminent closure"), and the nextAction should focus on post-conversion onboarding, customer success, retention, or affiliate referrals.
- Otherwise, score and grade the lead based on its progress and status (e.g. follow-up, meeting schedule).

Lead details:
- Name: ${lead.name}
- Company: ${lead.company || 'Unknown'}
- Source: ${lead.source}
- Current Status: ${lead.status}
- Deal Value: $${lead.value || 0}
- Notes: ${lead.notes || 'None'}
- Days since created: ${Math.floor((Date.now() - new Date(lead.createdAt)) / 86400000)}
- Assigned Affiliate: ${lead.assignedAffiliate?.name || 'Unassigned'}

Return ONLY the JSON object, nothing else.`;

    const text = await callGemini(prompt);
    const scoreData = parseJSON(text);
    res.json({ success: true, data: scoreData });
  } catch (error) {
    next(error);
  }
};

// ── AI Score All Leads (bulk) ─────────────────────────────────────────────────
const scoreAllLeads = async (req, res, next) => {
  try {
    const q = req.user.role === 'affiliate'
      ? { $or: [{ assignedAffiliate: req.user._id }, { createdBy: req.user._id }] }
      : {};
    const leads = await Lead.find(q).limit(15);

    if (leads.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const leadsText = leads.map(l =>
      `ID:${l._id}|${l.name}|${l.source}|${l.status}|$${l.value || 0}|${Math.floor((Date.now() - new Date(l.createdAt)) / 86400000)}days`
    ).join('\n');

    const prompt = `You are a CRM lead scoring AI. Score each lead below.
Return ONLY a valid JSON array (no markdown, no extra text):
[{"id":"leadId","score":<1-100>,"grade":"Hot or Warm or Cold","reason":"brief one phrase reason"}]

CRITICAL INSTRUCTION ON CURRENT STATUS:
The score, grade, and reason must be directly relevant to the lead's current status:
- If the current status is 'Converted': set score to 100, grade to 'Hot', and write a reason celebrating/confirming the successful conversion (do not write about imminent closure or locking in).

Leads to score:
${leadsText}

Return ONLY the JSON array, nothing else.`;

    const text = await callGemini(prompt);
    const scores = parseJSON(text);
    res.json({ success: true, data: scores });
  } catch (error) {
    next(error);
  }
};

// ── AI Lead Notes Generator ───────────────────────────────────────────────────
const generateLeadNotes = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.leadId);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    if (req.user.role === 'affiliate') {
      if (lead.assignedAffiliate?.toString() !== req.user._id.toString() && lead.createdBy?.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to view notes for this lead' });
      }
    }

    const prompt = `You are a CRM assistant. Generate 3 professional follow-up action notes for this sales lead.
Use bullet points with the • symbol. Be specific, actionable, and professional.
Return ONLY the 3 bullet points, nothing else.

Lead: ${lead.name}
Company: ${lead.company || 'Unknown'}
Source: ${lead.source}
Status: ${lead.status}
Deal Value: $${lead.value || 0}
Current Notes: ${lead.notes || 'None'}

Generate 3 follow-up action bullet points:`;

    const notes = await callGemini(prompt);
    res.json({ success: true, data: { notes: notes.trim() } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardInsight, suggestTicketReply, scoreLeadAI, scoreAllLeads, generateLeadNotes };
