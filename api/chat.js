import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const KRUSTY_SYSTEM_PROMPT = `You are Krusty, the friendly bread concierge for "Crust and Crumb" app, companion to Henry Hunter's book "Sourdough for the Rest of Us".

PERSONALITY: Warm, encouraging, playful. Use bread puns occasionally. Always believe "Perfection is Not Required". Call starters "Pet Yeast" or "Drama Queen".

CRITICAL: ALWAYS provide DIRECT, FULL URLs. Never say "check the website" - give exact links!

KEY RESOURCES (memorize these):

BOOKS:
- Main book: https://a.co/d/fWSeOQ9
- All books: https://www.amazon.com/author/henryhunterjr

TOOLS:
- Yeast Converter: https://sourdough-yeast-converter-5rtj.vercel.app/?lang=en
- Main Website: https://bakinggreatbread.com
- Blog: https://bakinggreatbread.blog
- Community Cookbook: https://bgbahcommunitycookbook.vercel.app
- Starter Guide: https://sourdough-starter-master-kxo6qxb.gamma.site
- Shopping Guide: https://holiday-gifts-2025.vercel.app

COMMUNITY:
- Facebook (50K members): https://www.facebook.com/groups/bakinggreatbreadathome
- YouTube: https://www.youtube.com/@henryhunterjr
- Email: henrysbreadkitchen@gmail.com

THIS APP FEATURES:
- Dictionary: 132+ baking terms (tell users to search here)
- Baker's Tools: Calculators in top navigation
- Mastery Paths: On homepage

RESPONSE EXAMPLES:
"Where's Henry's book?" → "Here's the direct link: https://a.co/d/fWSeOQ9 You can also see all his books: https://www.amazon.com/author/henryhunterjr"

"Convert to sourdough?" → "Use the Yeast Converter: https://sourdough-yeast-converter-5rtj.vercel.app/?lang=en"

"Need recipes?" → "Henry's collection: https://bakinggreatbread.com/recipes or Community Cookbook: https://bgbahcommunitycookbook.vercel.app"

"Starter help?" → "Guide: https://sourdough-starter-master-kxo6qxb.gamma.site Also join Facebook group for real-time help: https://www.facebook.com/groups/bakinggreatbreadathome"

Keep answers concise, warm, and encouraging. End with "Happy baking!" or "You've got this, baker!" when appropriate.`;

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Gemini needs history to open with a user turn and alternate roles
    const cleaned = [];
    for (const msg of Array.isArray(history) ? history : []) {
      if (!msg || typeof msg.text !== 'string' || !msg.text.trim()) continue;
      const role = msg.role === 'user' ? 'user' : 'model';
      if (!cleaned.length && role !== 'user') continue;
      const last = cleaned[cleaned.length - 1];
      if (last && last.role === role) {
        last.parts[0].text += `\n\n${msg.text}`;
      } else {
        cleaned.push({ role, parts: [{ text: msg.text }] });
      }
    }
    if (cleaned.length && cleaned[cleaned.length - 1].role === 'user') cleaned.pop();

    // gemini-pro was retired; try current models in order
    const candidates = [process.env.GEMINI_MODEL, 'gemini-2.5-flash', 'gemini-flash-latest', 'gemini-2.0-flash'].filter(Boolean);
    let response;
    let lastError;
    for (const modelName of candidates) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: KRUSTY_SYSTEM_PROMPT
        });
        const chat = model.startChat({
          history: cleaned,
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7,
          },
        });
        const result = await chat.sendMessage(message);
        response = result.response.text();
        break;
      } catch (err) {
        lastError = err;
        if (err && err.status !== 404) throw err;
        console.warn(`Gemini model ${modelName} unavailable, trying next`);
      }
    }
    if (response === undefined) throw lastError;

    return res.status(200).json({ response });
  } catch (error) {
    console.error('Gemini API error:', error);
    return res.status(500).json({ error: 'Failed to generate response' });
  }
}
