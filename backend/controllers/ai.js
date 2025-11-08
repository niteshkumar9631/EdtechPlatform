// controllers/ai.js
const axios = require('axios');
const Question = require('../models/Question');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_KEY;

async function callOpenRouter(prompt, model = 'qwen/qwen3-30b-a3b:free') {
  if (!OPENROUTER_API_KEY) throw new Error('Missing OPENROUTER_API_KEY in env');

  const url = 'https://openrouter.ai/api/v1/chat/completions';
  const body = {
    model,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
    max_tokens: 1500
  };

  const headers = {
    Authorization: `Bearer ${OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json'
  };

  const resp = await axios.post(url, body, { headers, timeout: 30000 });
  return resp.data;
}

function buildPrompt(topics = [], numQuestions = 10, type = 'mixed') {
  return `You are an exam paper generator. Return a JSON array (ONLY JSON) of ${numQuestions} ${type} questions covering these topics: ${topics.join(', ')}.
Output format:
[
  {
    "type":"MCQ"|"Subjective",
    "question":"...",
    "options":["opt1","opt2","opt3","opt4"], // only for MCQ
    "answer":"correct answer",
    "explanation":"short explanation (optional)"
  }, ...
]`;
}

function tryParseModelOutput(text) {
  try {
    const trimmed = text.trim();
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      return JSON.parse(trimmed);
    }
  } catch (err) { /* fallthrough */ }

  const lines = text.split('\n');
  const items = [];
  let buffer = '';
  for (let line of lines) {
    if (/^\d+\./.test(line.trim())) {
      if (buffer) items.push(buffer.trim());
      buffer = line.replace(/^\d+\.\s*/, '');
    } else {
      buffer += ' ' + line;
    }
  }
  if (buffer) items.push(buffer.trim());

  const result = items.map(q => ({ type: 'Subjective', question: q }));
  return result;
}

exports.generateQuestions = async (req, res) => {
  try {
    const { topics = [], numQuestions = 10, type = 'mixed', save = false } = req.body;
    if (!topics || !Array.isArray(topics) || topics.length === 0) {
      return res.status(400).json({ success: false, message: 'topics array is required' });
    }

    const prompt = buildPrompt(topics, numQuestions, type);
    const aiResp = await callOpenRouter(prompt);
    const content = aiResp?.choices?.[0]?.message?.content || aiResp?.choices?.[0]?.text || JSON.stringify(aiResp);

    let parsed = [];
    try {
      parsed = tryParseModelOutput(content);
    } catch (err) {
      console.warn('parse failed', err);
      return res.status(500).json({ success: false, message: 'Could not parse AI output' });
    }

    if (save) {
      const saved = [];
      for (const q of parsed) {
        const qdoc = await Question.create({
          type: q.type || 'Subjective',
          question: q.question || q,
          options: (q.options || []).map(opt => ({ text: opt, isCorrect: false })),
          answer: q.answer || '',
          explanation: q.explanation || '',
          topics
        });
        saved.push(qdoc);
      }
      return res.json({ success: true, data: saved });
    }

    return res.json({ success: true, data: parsed });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
