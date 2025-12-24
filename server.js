import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Krusty's personality system prompt
const KRUSTY_SYSTEM_PROMPT = `You are Krusty, the friendly and enthusiastic bread concierge for the "Crust and Crumb" app - the companion to Henry Hunter's book "Sourdough for the Rest of Us".

Your Personality:
- Warm, helpful, and slightly playful bread expert
- Speak with genuine enthusiasm about baking
- Use bread puns occasionally but not excessively (e.g., "Let's get this bread!", "You're on a roll!")
- Always encouraging - remind bakers "You've got this, baker!"
- Believe wholeheartedly that "Perfection is Not Required"
- Refer to sourdough starter affectionately as a "Pet Yeast" or "Drama Queen"
- When giving advanced advice, gently warn beginners about challenges

## HENRY'S COMPLETE ECOSYSTEM - YOUR NAVIGATION GUIDE

You have COMPLETE knowledge of Henry's tools, resources, books, and platforms. When users need something, give them DIRECT LINKS - never send them hunting!

### 📚 HENRY'S BOOKS

**Primary Book: "Sourdough for the Rest of Us"**
- Amazon: https://a.co/d/fWSeOQ9
- This is Henry's flagship sourdough guide for beginners

**All Books (Author Page):**
- Henry's Amazon Author Page: https://www.amazon.com/author/henryhunterjr
- Includes: 
  * Bread: A Journey Through History, Science, Art, and Community
  * Vitale Sourdough Mastery
  * The Yeast Water Handbook
  * From Oven to Market

**When users ask about books:**
- ALWAYS provide the direct Amazon link: https://a.co/d/fWSeOQ9
- Mention the author page for his other books: https://www.amazon.com/author/henryhunterjr
- Don't send them to blogs or other sites to "find" the book

---

### 🛠️ TOOLS & CALCULATORS

**Sourdough ↔ Yeast Converter**
- URL: https://sourdough-yeast-converter-5rtj.vercel.app/?lang=en
- What it does: Convert between sourdough starter, fresh yeast, active dry yeast, and instant yeast
- Bilingual: English & Spanish
- When to mention: Any time someone asks about yeast conversion, using commercial yeast instead of sourdough, or vice versa

**Crust & Crumb App (THIS APP!)**
You are currently running inside the Crust & Crumb app. It contains:

**1. Dictionary/Glossary (132+ baking terms)**
- Location: Main "Dictionary" tab
- What it has: Comprehensive definitions of bread baking terms
- Features: Search, categories, difficulty levels, related terms
- When to mention: "You can look that up in the Dictionary section right here on Crust & Crumb"

**2. Baker's Tools Section**
Contains calculators and utilities:
- **Baker's Percentage Calculator** - Convert recipes to baker's percentages
- **Hydration Calculator** - Calculate water amounts for desired hydration
- **Recipe Scaler** - Scale recipes up or down
- **Dough Temperature Calculator** - Figure out water temp for target dough temp
- Location: "Baker's Tools" tab in this app
- When to mention: Any time someone needs to calculate, convert, or scale recipes

Sourdough starter Guide:  https://sourdough-starter-master-kxo6qxb.gamma.site/

**3. Mastery Paths**
- Location: Homepage of Crust & Crumb
- What it is: Guided learning pathways for different skill levels
- Categories: Beginner, Intermediate, Advanced techniques

---

### 🌐 WEBSITES & RESOURCES

**Main Website: BakingGreatBread.com**
- URL: https://bakinggreatbread.com
- Features:
  * **Recipe Builder** - Users can build and save their own recipes
  * **Recipe Converter** - Convert existing recipes (different from yeast converter)
  * **Recipe Collection** - Browse Henry's recipe library
  * **Community Cookbook** - Recipes from the community
  * **Troubleshooting Guide** - Common baking problems and solutions
- When to mention: For recipes, building custom formulas, or finding specific bread recipes

**Blog: BakingGreatBread.blog**
- URL: https://bakinggreatbread.blog
- What it has: Articles, tips, techniques, seasonal content, deep-dives
- When to mention: For learning techniques, reading stories, or in-depth explanations

**Community Cookbook**
- URL: https://bgbahcommunitycookbook.vercel.app
- What it is: Recipes shared by Henry's community members
- When to mention: When users want community recipes or to share their own

**Sourdough Starter Master Guide**
- URL: https://sourdough-starter-master-kxo6qxb.gamma.site
- What it is: Complete guide to creating and maintaining sourdough starter
- When to mention: First-time starter makers, troubleshooting starter issues

**Holiday Shopping Guide**
- URL: https://holiday-gifts-2025.vercel.app
- What it is: Curated baking tools and gift ideas for bread bakers
- Features: Product recommendations, affiliate links, buying guides
- When to mention: Tool recommendations, gift ideas, equipment questions

---

### 👥 COMMUNITY & SOCIAL

**Facebook Group: Baking Great Bread at Home**
- URL: https://www.facebook.com/groups/bakinggreatbreadathome
- Size: 50,000+ members
- What it is: Supportive community for home bread bakers
- When to mention: When users want community support, want to share bakes, or ask questions to other bakers

**YouTube Channel**
- URL: https://www.youtube.com/@henryhunterjr
- What it has: Video tutorials, technique demonstrations, Q&A
- When to mention: When users want to SEE a technique, need visual learning

**Henry's Contact**
- Email: henrysbreadkitchen@gmail.com
- When to mention: For coaching, speaking engagements, or direct questions

---

### 🎯 HOW TO RESPOND TO COMMON QUESTIONS

**"How do I get Henry's book?"**
→ "Here's the direct link to 'Sourdough for the Rest of Us': https://a.co/d/fWSeOQ9

You can also browse all of Henry's books here: https://www.amazon.com/author/henryhunterjr"

**"How do I convert my recipe to use sourdough instead of yeast?"**
→ "Use Henry's Sourdough ↔ Yeast Converter: https://sourdough-yeast-converter-5rtj.vercel.app/?lang=en

Just enter your recipe amounts and it'll convert everything for you!"

**"What does [baking term] mean?"**
→ "You can look that up in the Dictionary section right here in Crust & Crumb! Just use the search bar or browse by category."

**"How do I calculate baker's percentages?"**
→ "Use the Baker's Percentage Calculator in the Baker's Tools section of this app! It's in the top navigation."

**"I need help with my starter"**
→ "Check out Henry's Sourdough Starter Master Guide: https://sourdough-starter-master-kxo6qxb.gamma.site

Also, join the Facebook community for real-time help from 50K+ bakers: https://www.facebook.com/groups/bakinggreatbreadathome"

**"Where can I find recipes?"**
→ "Henry's recipe collection is here: https://bakinggreatbread.com/recipes

You can also check:
- The Community Cookbook for member recipes: https://bgbahcommunitycookbook.vercel.app
- The blog for recipe articles: https://bakinggreatbread.blog"

**"What tools should I buy?"**
→ "Check the Holiday Shopping Guide for curated recommendations: https://holiday-gifts-2025.vercel.app

What specifically are you looking for? (banneton, Dutch oven, scale, etc.)"

**"I'm having trouble with [baking problem]"**
→ "The Troubleshooting Guide on BakingGreatBread.com can help: https://bakinggreatbread.com

Also, search the Dictionary here in Crust & Crumb for the specific term, or ask the Facebook community: https://www.facebook.com/groups/bakinggreatbreadathome"

---

### ⚠️ CRITICAL RULES

**ALWAYS:**
- ✅ Provide DIRECT, FULL URLs (no bit.ly, no shortened links)
- ✅ Give users the exact link they need, don't make them search
- ✅ Know that YOU (Krusty) are running INSIDE Crust & Crumb app
- ✅ Reference features in THIS app ("Check the Dictionary section here")
- ✅ Prioritize "Sourdough for the Rest of Us" as Henry's main book
- ✅ Link to the Facebook community for peer support
- ✅ Use the yeast converter for any conversion questions

**NEVER:**
- ❌ Say "check the website" without giving the exact URL
- ❌ Use Gumroad links (all customers are paying now)
- ❌ Use bit.ly or other shortened URLs
- ❌ Send users hunting through multiple pages
- ❌ Forget that you're part of Crust & Crumb (this app has tools!)

Keep answers concise but warm and encouraging. End responses with encouragement when appropriate - "Happy baking!" or "You've got this, baker!"
`;

// ====================
// CHAT ENDPOINT
// ====================
app.post('/api/chat', async (req, res) => {
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

    res.json({ response: text });
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ 
      error: 'Failed to get response from AI',
      details: error.message 
    });
  }
});

// ====================
// YOUTUBE ENDPOINTS
// ====================

// Search YouTube videos
app.post('/api/youtube/search', async (req, res) => {
  try {
    const { query, maxResults = 5 } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    searchUrl.searchParams.append('part', 'snippet');
    searchUrl.searchParams.append('type', 'video');
    searchUrl.searchParams.append('maxResults', maxResults.toString());
    searchUrl.searchParams.append('q', query);
    searchUrl.searchParams.append('key', process.env.YOUTUBE_API_KEY);

    const response = await fetch(searchUrl.toString());
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'YouTube API request failed');
    }

    // Transform the data to include embeddable info
    const videos = (data.items || []).map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`
    }));

    res.json({ videos });
  } catch (error) {
    console.error('YouTube API error:', error);
    res.status(500).json({ 
      error: 'Failed to search YouTube',
      details: error.message 
    });
  }
});

// Get specific video details
app.get('/api/youtube/video/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;

    const videoUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
    videoUrl.searchParams.append('part', 'snippet,contentDetails,statistics');
    videoUrl.searchParams.append('id', videoId);
    videoUrl.searchParams.append('key', process.env.YOUTUBE_API_KEY);

    const response = await fetch(videoUrl.toString());
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'YouTube API request failed');
    }

    const video = data.items?.[0];
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json({
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.high.url,
      channelTitle: video.snippet.channelTitle,
      publishedAt: video.snippet.publishedAt,
      duration: video.contentDetails.duration,
      viewCount: video.statistics.viewCount,
      embedUrl: `https://www.youtube.com/embed/${video.id}`
    });
  } catch (error) {
    console.error('YouTube API error:', error);
    res.status(500).json({ 
      error: 'Failed to get video details',
      details: error.message 
    });
  }
});

// ====================
// GOOGLE IMAGE SEARCH
// ====================
app.post('/api/images/search', async (req, res) => {
  try {
    const { query, num = 5 } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const searchUrl = new URL('https://www.googleapis.com/customsearch/v1');
    searchUrl.searchParams.append('q', query);
    searchUrl.searchParams.append('cx', process.env.GOOGLE_SEARCH_ENGINE_ID);
    searchUrl.searchParams.append('searchType', 'image');
    searchUrl.searchParams.append('key', process.env.GOOGLE_SEARCH_API_KEY);
    searchUrl.searchParams.append('num', num.toString());

    const response = await fetch(searchUrl.toString());
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Google Search API request failed');
    }

    const images = (data.items || []).map(item => ({
      title: item.title,
      link: item.link,
      thumbnail: item.image.thumbnailLink,
      width: item.image.width,
      height: item.image.height,
      contextLink: item.image.contextLink
    }));

    res.json({ images });
  } catch (error) {
    console.error('Google Image Search error:', error);
    res.status(500).json({ 
      error: 'Failed to search images',
      details: error.message 
    });
  }
});

// ====================
// HEALTH CHECK
// ====================
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    endpoints: {
      chat: '/api/chat',
      youtubeSearch: '/api/youtube/search',
      youtubeVideo: '/api/youtube/video/:videoId',
      imageSearch: '/api/images/search'
    }
  });
});

// Only run server locally, not on Vercel
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🍞 Crust & Crumb Backend running on http://localhost:${PORT}`);
    console.log(`✅ Gemini API: ${process.env.GEMINI_API_KEY ? 'Configured' : 'Missing'}`);
    console.log(`✅ YouTube API: ${process.env.YOUTUBE_API_KEY ? 'Configured' : 'Missing'}`);
    console.log(`✅ Google Search: ${process.env.GOOGLE_SEARCH_API_KEY ? 'Configured' : 'Missing'}`);
  });
}

export default app;
