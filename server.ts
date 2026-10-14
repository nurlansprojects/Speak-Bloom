import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

// Endpoint: Real AI Speaking Assessment
app.post('/api/assess-speaking', async (req, res) => {
  try {
    const {
      audioBase64,
      mimeType = 'audio/webm',
      transcript: providedTranscript,
      promptText,
      activityTitle,
      activityType,
      durationSeconds = 0,
    } = req.body;

    if (!promptText) {
      return res.status(400).json({ error: 'Missing promptText' });
    }

    const systemInstruction = `You are a certified, supportive English Speaking Assessor for "Speak Bloom", an Apple-inspired English speaking learning platform.
Your mission is to evaluate an English learner's spoken response objectively, constructively, and encouragingly.
Do NOT treat regional or international accent variations as errors as long as speech is intelligible.
Evaluate the speech across five core pillars:
1. Fluency & Speech Continuity (rhythm, smooth pacing, avoiding excessive unnatural pauses)
2. Pronunciation & Intelligibility (clarity of articulation, word stress, vowel/consonant clarity)
3. Clarity & Organization (coherence, logical flow of spoken ideas)
4. Spoken Vocabulary (appropriate lexical choices, natural phrasing)
5. Prompt Relevance & Development (answering the prompt thoroughly with examples or reasoning)

You MUST respond strictly in valid JSON matching this schema:
{
  "transcript": string (the exact transcribed speech spoken by the user),
  "fluencyScore": number (1-100),
  "pronunciationScore": number (1-100),
  "clarityScore": number (1-100),
  "vocabularyScore": number (1-100),
  "relevanceScore": number (1-100),
  "overallScore": number (1-100),
  "speakingPaceWpm": number (estimated words per minute, ideal conversational English is 120-150 WPM),
  "pauseAnalysis": string (e.g. "Natural breath pauses with minor hesitation before complex sentences"),
  "detectedFillers": string[] (e.g. ["um", "like", "you know"]),
  "strengths": string[] (2-4 clear strengths),
  "improvementTips": string[] (2-4 practical, actionable recommendations for the next speaking attempt),
  "pronunciationNotes": string[] (specific words to practice or stress patterns to watch),
  "detailedFeedback": string (2-3 paragraphs of supportive, high-value coach commentary),
  "disclaimer": "Automated pronunciation and fluency assessments are objective AI estimates to guide practice."
}`;

    let contents: any[] = [];

    if (audioBase64) {
      // Audio provided: Multimodal speech evaluation
      const cleanBase64 = audioBase64.replace(/^data:audio\/\w+;base64,/, '');
      contents = [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: mimeType.split(';')[0] || 'audio/webm',
                data: cleanBase64,
              },
            },
            {
              text: `Please listen to this student's recorded English speaking response.
Speaking Activity: "${activityTitle || 'Speaking Practice'}" (${activityType || 'speaking task'}).
Prompt given to the student: "${promptText}".
Duration of recording: ${durationSeconds} seconds.
Transcribe what they said exactly, analyze their spoken delivery, pronunciation, pace, fluency, and content, and provide the JSON evaluation.`,
            },
          ],
        },
      ];
    } else {
      // Transcript provided fallback
      contents = [
        {
          role: 'user',
          parts: [
            {
              text: `Here is the transcribed spoken response from a student for an English speaking exercise.
Speaking Activity: "${activityTitle || 'Speaking Practice'}" (${activityType || 'speaking task'}).
Prompt given to the student: "${promptText}".
Transcript of student speech: "${providedTranscript || 'I would like to share my thoughts on this topic.'}".
Duration: ${durationSeconds} seconds.
Evaluate this spoken response according to the speaking rubrics and provide the JSON evaluation.`,
            },
          ],
        },
      ];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : { overallScore: 80, detailedFeedback: text };
    }

    return res.json(parsed);
  } catch (error: any) {
    console.error('Error during speaking assessment:', error);
    return res.status(500).json({
      error: 'Failed to process speaking assessment',
      message: error?.message || 'Server error',
    });
  }
});

// Endpoint: AI Speaking Coach Interactive Conversation
app.post('/api/coach-chat', async (req, res) => {
  try {
    const { messages, scenario, level = 'Intermediate' } = req.body;

    const systemInstruction = `You are "Bloom", the interactive AI Speaking Coach inside Speak Bloom.
Your mission is to simulate realistic, engaging English conversations to build speaking confidence and fluency.
Guidelines:
- Act in character for the scenario: ${scenario || 'General Conversational Practice'}.
- Target student level: ${level}.
- Keep your replies conversational, natural, and concise (2-4 sentences max), mimicking real spoken dialogue.
- Always ask a thought-provoking or warm follow-up question to encourage the student to elaborate.
- Include a very brief, friendly coaching tip when appropriate (e.g., "[Tip: Try using 'In my opinion' or connecting words like 'Moreover']").
- Maintain a warm, encouraging, Apple-standard premium persona.`;

    const chatContents = (messages || []).map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: chatContents,
      config: {
        systemInstruction,
      },
    });

    const reply = response.text || "That's wonderful! Can you tell me a little more about what inspired you?";
    return res.json({ reply });
  } catch (error: any) {
    console.error('Error in coach chat:', error);
    return res.status(500).json({ error: error?.message || 'Coach conversation failed' });
  }
});

// Endpoint: Text to Speech (speech synthesis guidance / prompt reading)
app.post('/api/generate-prompt-help', async (req, res) => {
  try {
    const { promptText, topic } = req.body;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `For this English speaking prompt: "${promptText}" (Topic: ${topic || 'English Speaking'}), provide:
1. Three key ideas/points a student can mention.
2. Useful spoken transition phrases (e.g., "From my perspective...", "For instance...").
3. A short sample model spoken answer (about 40-60 words).
Return strictly JSON with keys: "keyPoints" (string[]), "transitionPhrases" (string[]), "sampleResponse" (string).`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed' });
  }
});

// Setup Vite dev server or static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Speak Bloom server running on http://localhost:${PORT}`);
  });
}

startServer();
