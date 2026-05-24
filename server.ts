import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client on the server
// User-Agent must be set to 'aistudio-build' for AI Studio telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Import questions data - using runtime require or relative imports
// Since server.ts is bundled via esbuild as CommonJS or run directly, we can define questions inline or reference.
// To keep server.ts simple and fully self-contained/compiled, let's include mock base questions if needed
// or just send them from the frontend.
// To make the architecture secure and performant, we can implement the routes nicely.
const mockQuestions = [
  // --- UNT ---
  {
    id: 'unt_1',
    exam: 'UNT',
    subject: 'History of Kazakhstan',
    year: '2025',
    difficulty: 'Intermediate',
    topic: 'Altyn Orda (Golden Horde)',
    text: 'According to NTC 2025–26 official curriculum, in which year did Almalyk become the recognized center of the Chagatay Ulus?',
    options: [
      '1269 (Talas Kurultai)',
      '1310 (Reorganization under Esen Buga)',
      '1321 (Division into Transoxiana and Mogulistan)',
      '1346 (Reign of Kazan Khan)'
    ],
    correctIndex: 1
  },
  {
    id: 'unt_2',
    exam: 'UNT',
    subject: 'Mathematical Literacy',
    year: '2026',
    difficulty: 'Easy',
    topic: 'Venn Diagrams & Sets',
    text: 'In a class of 25 students, 15 study Kazakh, 12 study English, and 5 study both language programs. How many students do not study either subject?',
    options: [
      '1 student',
      '3 students',
      '5 students',
      '8 students'
    ],
    correctIndex: 1
  },
  {
    id: 'unt_3',
    exam: 'UNT',
    subject: 'Physics',
    year: '2025',
    difficulty: 'Advanced',
    topic: 'Quantum Physics',
    text: 'Determine the energy of a photon with a frequency of 5 × 10¹⁴ Hz. (Use Planck\'s constant h ≈ 6.63 × 10⁻³⁴ J·s).',
    options: [
      '3.32 × 10⁻¹⁹ Joules',
      '1.32 × 10⁻¹⁹ Joules',
      '6.63 × 10⁻¹⁹ Joules',
      '9.95 × 10⁻¹⁹ Joules'
    ],
    correctIndex: 0
  },
  // --- AP ---
  {
    id: 'ap_1',
    exam: 'AP',
    subject: 'Calculus BC',
    year: '2025',
    difficulty: 'Advanced',
    topic: 'Taylor Series Expansion',
    text: 'Find the coefficient of the x³ term in the Taylor series expansion of f(x) = e^(2x) about x = 0.',
    options: [
      '1/3',
      '4/3',
      '2/3',
      '8/3'
    ],
    correctIndex: 1
  },
  {
    id: 'ap_2',
    exam: 'AP',
    subject: 'Computer Science A',
    year: '2026',
    difficulty: 'Intermediate',
    topic: 'Recursion Trace',
    text: 'Consider the following recursive method:\n\npublic int fun(int n) {\n  if (n <= 1) return 1;\n  return fun(n - 1) + fun(n - 2);\n}\n\nWhat is the value returned by the method call fun(5)?',
    options: [
      '5',
      '8',
      '13',
      '21'
    ],
    correctIndex: 1
  },
  {
    id: 'ap_3',
    exam: 'AP',
    subject: 'Physics C: Electromagnetism',
    year: '2025',
    difficulty: 'Intermediate',
    topic: 'Faraday\'s Law',
    text: 'A flat circular loop of wire with an area of 0.1 m² is placed perpendicular to a magnetic field that increases uniformly from 0.5 Tesla to 1.5 Tesla in a span of 0.2 seconds. What is the magnitude of the induced electromotive force (EMF) in the loop?',
    options: [
      '0.1 Volts',
      '0.5 Volts',
      '1.0 Volts',
      '2.0 Volts'
    ],
    correctIndex: 1
  },
  // --- IELTS ---
  {
    id: 'ielts_1',
    exam: 'IELTS',
    subject: 'Academic Reading',
    year: '2025',
    difficulty: 'Intermediate',
    topic: 'Avian Navigation Studies',
    passage: 'A recent trial conducted by biology researchers at the Cambridge Science Institute (2025) indicates that migrating avian species utilize highly localized visual markers to calibrate their internal magnetoreception. When biological filters are applied that disrupt magnetic fields, the birds exhibit brief disorientation but soon recalibrate using high-contrast landmarks like mountain profiles or coastlines.',
    text: 'Based on the passage details, what main mechanism do avian species use to recover their navigational course when magnetic sensitivity is blocked?',
    options: [
      'They depend on sound waves emitted by major wind currents.',
      'They rely on high-contrast landmark features to calibrate orientation.',
      'They emit ultrasonic pings that echo off visual obstacles.',
      'They temporarily stall flight patterns until the magnetic storms pass.'
    ],
    correctIndex: 1
  },
  {
    id: 'ielts_2',
    exam: 'IELTS',
    subject: 'Academic Reading',
    year: '2026',
    difficulty: 'Easy',
    topic: 'Global Grid Transitions',
    passage: 'By mid-2025, modern smart-grid energy platforms surpassed antique coal-fired utilities in combined active generation storage across three major continents, marking historical steps towards climate neutrality. However, coal remains the primary base load resource for nighttime operations in four high-demand manufacturing territories.',
    text: 'True, False, or Not Given: Global coal consumption dropped to absolute zero during nighttime peak periods.',
    options: [
      'True',
      'False',
      'Not Given'
    ],
    correctIndex: 1
  },
  // --- SAT ---
  {
    id: 'sat_1',
    exam: 'SAT',
    subject: 'Evidence-Based Reading & Writing',
    year: '2026',
    difficulty: 'Advanced',
    topic: 'Words in Context',
    passage: 'As natural history curators attempt to exhibit organic sculptures made of living lichens, they understand that these biological assets will naturally decay over time. Curators are thus placed in the ______ position of whether to replace decaying specimens with synthetic duplicates (thus breaking the biological premise) or allow the artwork to gradually fade from view.',
    text: 'Which choice most logically completes the blank in the context of the sentence?',
    options: [
      'precarious (unstable or difficult)',
      'enviable (highly desirable)',
      'unambiguous (completely clear)',
      'superfluous (unnecessary/redundant)'
    ],
    correctIndex: 0
  },
  {
    id: 'sat_2',
    exam: 'SAT',
    subject: 'Math',
    year: '2025',
    difficulty: 'Intermediate',
    topic: 'Quadratic Equations',
    text: 'For what value of the constant k does the quadratic equation f(x) = x² - 4x + k have exactly one distinct real root?',
    options: [
      '0',
      '2',
      '4',
      '8'
    ],
    correctIndex: 2
  },
  // --- IB ---
  {
    id: 'ib_1',
    exam: 'IB',
    subject: 'Biology HL',
    year: '2025',
    difficulty: 'Easy',
    topic: 'Mendelian Genetics',
    text: 'In a classical dihybrid cross of two heterozygous garden pea plants (RrYy × RrYy), what is the calculated fraction of offspring that are expected to be homozygous recessive for both traits (rryy)?',
    options: [
      '1/16',
      '3/16',
      '9/16',
      '1/4'
    ],
    correctIndex: 0
  },
  {
    id: 'ib_2',
    exam: 'IB',
    subject: 'Physics HL',
    year: '2025',
    difficulty: 'Intermediate',
    topic: 'Ideal Gases',
    text: 'An ideal gas is enclosed in a rigid container with volume V and pressure P. If the temperature of the gas is maintained constant while the total volume is reduced to exactly V/4, what is the new pressure exerted by the gas?',
    options: [
      'P/4',
      'P',
      '2P',
      '4P'
    ],
    correctIndex: 3
  }
];

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Get database questions
app.get('/api/questions', (req, res) => {
  const { exam } = req.query;
  if (!exam) {
    res.json(mockQuestions);
    return;
  }
  const filtered = mockQuestions.filter(q => q.exam === exam);
  res.json(filtered);
});

// Gemini Mode 1 — Mistake Explainer API
app.post('/api/gemini/explain', async (req, res) => {
  try {
    const { question, options, studentAnswer, correctAnswer, language } = req.body;

    if (!question || !options || !studentAnswer || !correctAnswer) {
      res.status(400).json({ error: 'Missing required parameters for explaining the mistake.' });
      return;
    }

    const targetLanguageName = {
      en: 'English',
      kk: 'Kazakh (Қазақ тілі)',
      uz: 'Uzbek (Oʻzbekcha)',
      ky: 'Kyrgyz (Кыргызча)'
    }[language as 'en' | 'kk' | 'uz' | 'ky'] || 'English';

    const systemPromptMessage = `You are an expert multilingual exam preparation tutor for high school and university entrance exams: AP, IELTS, SAT, IB, and UNT.
The student has answered a question incorrectly. You must provide a structured, encouraging explanation in the following target language: ${targetLanguageName}.
Do NOT use or mix any other languages. If the language is Kazakh (Қазақ тілі), respond entirely in formal but friendly Kazakh. If Uzbek, respond entirely in Uzbek. If Kyrgyz, respond entirely in Kyrgyz. If English, respond entirely in English.

Your response MUST follow the specified JSON schema exactly, providing high-quality content inside the corresponding fields.

FIELDS TO FILL:
1. correctAnswer: State the accurate core response Option clearly. Explain briefly and encourage the student.
2. whyWrong: Gently clarify what misunderstanding or miscalculation or trap led the student to choose "${studentAnswer}" instead of the correct answer. Be encouraging and non-condescending.
3. conceptExplained: Teach the underlying academic rule, formula, or grammar skill related to this question using a clear explanatory sample.
4. workedExample: Provide a brand-new but similarly structured practice question, followed immediately by its step-by-step resolution.
5. tip: One short, catchy memory trick, mnemonic, or rule-of-thumb to avoid making this error again.`;

    const userContentPrompt = `
Question details:
- Question: "${question}"
- Possible Options: ${JSON.stringify(options)}
- Student's incorrect choice: "${studentAnswer}"
- Verified correct answer: "${correctAnswer}"

Please generate the step-by-step mistake lesson strictly in "${targetLanguageName}".`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: userContentPrompt,
      config: {
        systemInstruction: systemPromptMessage,
        temperature: 0.3,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            correctAnswer: {
              type: Type.STRING,
              description: 'The correct answer explanation written entirely in the target language.'
            },
            whyWrong: {
              type: Type.STRING,
              description: 'Clear diagnostic explaining why the student’s custom choice was incorrect, written entirely in the target language.'
            },
            conceptExplained: {
              type: Type.STRING,
              description: 'Underlying conceptual guide or formula rules, written entirely in the target language.'
            },
            workedExample: {
              type: Type.STRING,
              description: 'A completely new but similar practice question and its full step-by-step solution, written entirely in the target language.'
            },
            tip: {
              type: Type.STRING,
              description: 'Short handy rule-of-thumb or mnemonic, written entirely in the target language.'
            }
          },
          required: ['correctAnswer', 'whyWrong', 'conceptExplained', 'workedExample', 'tip']
        }
      }
    });

    if (!response.text) {
      throw new Error('Gemini returned empty text response');
    }

    const structuredResult = JSON.parse(response.text.trim());
    res.json(structuredResult);
  } catch (error: any) {
    console.error('Error during Gemini explanation processing:', error);
    res.status(500).json({
      error: 'Failed to generate explanation. Please try again.',
      details: error.message
    });
  }
});

// Gemini Mode 2 — AI Study Assistant Chat API
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, chatHistory, currentExam, language } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Message payload is required.' });
      return;
    }

    const targetLanguageName = {
      en: 'English',
      kk: 'Kazakh (Қазақ тілі)',
      uz: 'Uzbek (Oʻzbekcha)',
      ky: 'Kyrgyz (Кыргызча)'
    }[language as 'en' | 'kk' | 'uz' | 'ky'] || 'English';

    const systemInstruction = `You are an expert multilingual AI study mentor for high school and college entry exams: AP, IELTS, SAT, IB, and UNT.
The student is studying for ${currentExam || 'these standard papers'}. You are carrying out a friendly academic conversation with them.
Answer their questions strictly in the requested language: ${targetLanguageName}. Do not speak any other language.

STRUCTURE RULES:
1. Provide a direct, encouraging, and clear academic explanation. Use plenty of layout formatting or examples.
2. If applicable, provide a concise step-by-step worked example.
3. If they asked for a practice question, OR if they expressed a desire to practice a concept, generate a realistic multiple-choice practice question appropriate for the specified exam, and fill it in the "suggestedPractice" field of the JSON structure, while informing them in the text reply that you have loaded a problem for them to try below.

IMPORTANT: "suggestedPractice" schema must match standard exam structures with 3 to 4 logical multiple-choice options, setting "correctIndex" securely (0-indexed). Do not reveal the correct index directly inside the text reply! Let them answer it in the UI interface.`;

    // Map frontend structural history to Gemini format if necessary, or pass context in prompt
    const contextPrompt = `
Current Exam context: ${currentExam || 'General Prep'}
Student Target Language: ${targetLanguageName}

Recent Conversation History:
${JSON.stringify((chatHistory || []).slice(-4))}

Latest Student Message: "${message}"

Generate your response in the requested schemas:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contextPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: {
              type: Type.STRING,
              description: 'The direct answers, text descriptions, and worked examples, written entirely in the target language.'
            },
            suggestedPractice: {
              type: Type.OBJECT,
              description: 'Optional. Generated exam practice question ONLY if the student wants to test themselves on this topic.',
              properties: {
                id: { type: Type.STRING, description: 'Unique random ID string, e.g. "gen_123"' },
                exam: { type: Type.STRING, description: 'Exam category, e.g., "UNT", "AP", "SAT", "IELTS", "IB"' },
                subject: { type: Type.STRING, description: 'Academic subject name' },
                year: { type: Type.STRING, description: 'E.g., "2025" or "2026"' },
                difficulty: { type: Type.STRING, description: 'e.g., "Easy", "Intermediate", "Advanced"' },
                topic: { type: Type.STRING, description: 'Concept topic name' },
                text: { type: Type.STRING, description: 'The question text description' },
                passage: { type: Type.STRING, description: 'Optional passage text if required' },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'List of MCQ option text strings (3 or 4 options)'
                },
                correctIndex: { type: Type.INTEGER, description: 'The 0-indexed correct option' }
              },
              required: ['id', 'exam', 'subject', 'year', 'difficulty', 'topic', 'text', 'options', 'correctIndex']
            }
          },
          required: ['reply']
        }
      }
    });

    if (!response.text) {
      throw new Error('Gemini returned empty text response');
    }

    const parsedResult = JSON.parse(response.text.trim());
    res.json(parsedResult);
  } catch (error: any) {
    console.error('Error during Gemini chat mentoring:', error);
    res.status(500).json({
      error: 'Failed to process chat. Please retry.',
      details: error.message
    });
  }
});

// Configure Vite integration for dev vs prod environments
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Akeser Prep Server] running on http://localhost:${PORT}`);
  });
}

startServer();
