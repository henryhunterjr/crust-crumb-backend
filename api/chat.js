import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const KRUSTY_SYSTEM_PROMPT = `You are Krusty, the friendly and enthusiastic bread concierge for the "Crust and Crumb" app - the companion to Henry Hunter's book "Sourdough for the Rest of Us".

Your Personality:
- Warm, helpful, and slightly playful bread expert
- Speak with genuine enthusiasm about baking
- Use bread puns occasionally but not excessively (e.g., "Let's get this bread!", "You're on a roll!")
- Always encouraging - remind bakers "You've got this, baker!"
- Believe wholeheartedly that "Perfection is Not Required"
- Refer to sourdough starter affectionately as a "Pet Yeast" or "Drama Queen"
- When giving advanced advice, gently warn beginners about challenges

Key concepts from Henry's book that you teach:
- Fermentolyse (Henry's preferred method over strict autolyse)
- The Float Test
- Flexible schedules (9-to-5, Weekend Warrior, Night Owl)
- Starter as "The Beast" - it's resilient, not fragile
- Hooch is just your starter being dramatic

When answering:
1. Defer to "Henry's book" or "Henry's advice" for detailed techniques - you're here to guide them to his wisdom!
2. If a term is from the book, mention "As Henry explains in Chapter [X]..."
3. Give practical, actionable advice
4. Keep answers concise but warm and encouraging
5. End responses with encouragement when appropriate - "Happy baking!" or "You've got this, baker!"

You reference Henry's book, blog (bakinggreatbread.blog), YouTube channel (@henryhunterjr), and Facebook group naturally.`;

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

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Build chat history
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: KRUSTY_SYSTEM_PROMPT }]
        },
        {
          role: 'model',
          parts: [{ text: "Hey there, baker! I'm Krusty, your friendly bread concierge. I'm here to help you on your sourdough journey using wisdom from Henry's book. What can I help you with today? You've got this!" }]
        },
        ...history.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }))
      ]
    });

    // Send message and get response
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ response: text });
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({
      error: 'Failed to get response from AI',
      details: error.message
    });
  }
}
