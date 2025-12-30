// controllers/ai.js
const axios = require('axios');
const Question = require('../models/Question');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_KEY;

async function callOpenRouter(prompt, model = 'mistralai/mistral-7b-instruct:free') {
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

// function buildPrompt(topics = [], numQuestions = 10, type = 'mixed') {
//   return `You are an exam paper generator. Return an array of ${numQuestions} ${type} questions covering these topics: ${topics.join(', ')}.
// Output format:
// [
//   {
//     "type":"MCQ"|"Subjective",
//     "question":"...",
//     "options":["opt1","opt2","opt3","opt4"], // only for MCQ
//     "answer":"correct answer",
//     "explanation":"short explanation (optional)"
//   }, ...
// ]`;
// }

function buildPrompt(topics = [], numQuestions = 10, type = 'mixed') {
  return `
You are a professional university exam paper setter.

Create a question paper based on the following topics:
${topics.join(', ')}

General Instructions:
- Use clear and simple academic language
- Questions must be suitable for university examinations
- Do not repeat similar questions
- Maintain a balanced difficulty level
- Follow a formal exam paper structure

------------------------------------

Section A – Multiple Choice Questions (MCQs)

- Provide clear MCQs related to the topics
- Each question must have four options (A, B, C, D)
- Write only the questions and options (no answers)

------------------------------------

Section B – Short Answer Questions

- Questions should test conceptual understanding
- Answers should be possible within 2–3 sentences

------------------------------------

Section C – Long Answer Questions

- Questions should require detailed explanations
- Suitable for 8–10 mark answers

------------------------------------

Formatting Rules:
- Section titles must be on separate lines
- Questions must appear below their respective section
- Number questions clearly (1, 2, 3, …)
- Do NOT use JSON, arrays, or code blocks
- Output must be plain text only

Return only the formatted question paper.
`;
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





// // controllers/ai.js
// const axios = require('axios');
// const Question = require('../models/Question');

// const OPENROUTER_API_KEY =
//   process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_KEY;

// /**
//  * Call OpenRouter API
//  */
// async function callOpenRouter(prompt, model = 'mistralai/devstral-2512:free') {
//   if (!OPENROUTER_API_KEY) {
//     throw new Error('Missing OPENROUTER_API_KEY in env');
//   }

//   const url = 'https://openrouter.ai/api/v1/chat/completions';

//   const body = {
//     model,
//     messages: [
//       {
//         role: 'user',
//         content: prompt
//       }
//     ],
//     temperature: 0.3,
//     max_tokens: 1500
//   };

//   const headers = {
//     Authorization: `Bearer ${OPENROUTER_API_KEY}`,
//     'Content-Type': 'application/json'
//   };

//   const resp = await axios.post(url, body, {
//     headers,
//     timeout: 30000
//   });

//   return resp.data;
// }

// /**
//  * Build a HUMAN-READABLE question paper prompt
//  * ❌ NO JSON
//  * ✅ Exam style
//  */
// function buildPrompt(topics = [], numQuestions = 10, type = 'mixed') {
//   return `
// You are a university exam paper setter.

// Generate a clean, readable question paper.

// Subject topics:
// ${topics.join(', ')}

// Number of questions: ${numQuestions}
// Question type: ${type}

// Rules:
// - DO NOT use JSON
// - DO NOT use brackets, keys, or quotes
// - Write like a real exam paper
// - Use numbering (1, 2, 3...)
// - For MCQs, show options as a, b, c, d
// - After each question, show:
//   Answer:
//   Explanation: (short)

// Structure example:

// Section A – MCQs
// 1. Question text
//    a) option
//    b) option
//    c) option
//    d) option
//    Answer:
//    Explanation:

// Section B – Subjective
// 2. Question text
//    Answer:
//    Explanation:

// Keep language simple and academic.
// `;
// }

// /**
//  * Generate Questions Controller
//  */
// exports.generateQuestions = async (req, res) => {
//   try {
//     const {
//       topics = [],
//       numQuestions = 10,
//       type = 'mixed',
//       save = false
//     } = req.body;

//     if (!Array.isArray(topics) || topics.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'topics array is required'
//       });
//     }

//     // 1️⃣ Build readable prompt
//     const prompt = buildPrompt(topics, numQuestions, type);

//     // 2️⃣ Call AI
//     const aiResp = await callOpenRouter(prompt);

//     const content =
//       aiResp?.choices?.[0]?.message?.content ||
//       'No content generated';

//     // 3️⃣ Optional: Save as RAW text questions (simple split)
//     if (save) {
//       const blocks = content
//         .split(/\n(?=\d+\.)/)
//         .map(q => q.trim())
//         .filter(Boolean);

//       const saved = [];

//       for (const block of blocks) {
//         const qdoc = await Question.create({
//           type: block.toLowerCase().includes('a)')
//             ? 'MCQ'
//             : 'Subjective',
//           question: block,
//           options: [],
//           answer: '',
//           explanation: '',
//           topics
//         });
//         saved.push(qdoc);
//       }

//       return res.json({
//         success: true,
//         data: saved
//       });
//     }

//     // 4️⃣ Send plain text to frontend
//     return res.json({
//       success: true,
//       data: content
//     });
//   } catch (err) {
//     console.error('AI GENERATION ERROR:', err.message);

//     return res.status(500).json({
//       success: false,
//       message: 'AI question generation failed'
//     });
//   }
// };
