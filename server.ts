import "dotenv/config";
import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { generateFallbackRoadmap } from "./server/fallbackGenerator";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper to clean HTML and fetch content from a URL
async function fetchUrlContent(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!response.ok) {
      return `Failed to fetch URL status: ${response.statusText}`;
    }
    const html = await response.text();
    // Strip style, script and html tags
    const cleanText = html
      .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
      .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return cleanText.substring(0, 8000); // Limit to 8k characters for fast API performance
  } catch (error: any) {
    console.error("Error in fetchUrlContent:", error);
    return `Error retrieving content: ${error.message}`;
  }
}

// Free public cover artwork resolver for Books, Movies, TV shows, Links, and General Topics
async function fetchWikipediaImage(query: string): Promise<string | null> {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&pithumbsize=600&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=5`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      const pages = data?.query?.pages;
      if (pages) {
        for (const pageId in pages) {
          const page = pages[pageId];
          if (page.thumbnail && page.thumbnail.source) {
            console.log(`Found Wikipedia image for "${query}": ${page.thumbnail.source}`);
            return page.thumbnail.source;
          }
        }
      }
    }
  } catch (err) {
    console.warn("Wikipedia image search failed:", err);
  }
  return null;
}

async function fetchGoogleBooksImage(query: string): Promise<string | null> {
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=3`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      const items = data.items || [];
      for (const item of items) {
        const imageLinks = item.volumeInfo?.imageLinks;
        if (imageLinks) {
          const img = imageLinks.medium || imageLinks.large || imageLinks.thumbnail;
          if (img) {
            const secureImg = img.replace(/^http:/i, 'https:');
            console.log(`Found Google Books cover for "${query}": ${secureImg}`);
            return secureImg;
          }
        }
      }
    }
  } catch (err) {
    console.warn("Google Books API failed:", err);
  }
  return null;
}

async function fetchItunesImage(query: string): Promise<string | null> {
  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&limit=5`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      const results = data.results || [];
      const best = results.find((r: any) =>
        r.kind === 'feature-movie' ||
        r.kind === 'tv-episode' ||
        r.collectionType === 'Album' ||
        r.wrapperType === 'audiobook'
      ) || results[0];
      if (best && best.artworkUrl100) {
        const highRes = best.artworkUrl100.replace('100x100bb.jpg', '600x600bb.jpg');
        console.log(`Found iTunes artwork for "${query}": ${highRes}`);
        return highRes;
      }
    }
  } catch (err) {
    console.warn("iTunes API failed:", err);
  }
  return null;
}

async function fetchOgImageFromUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (response.ok) {
      const html = await response.text();
      const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
      if (ogMatch && ogMatch[1]) return ogMatch[1];

      const twitterMatch = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i) ||
                           html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
      if (twitterMatch && twitterMatch[1]) return twitterMatch[1];

      const iconMatch = html.match(/<link[^>]+rel=["'](?:apple-touch-icon|shortcut icon|icon)["'][^>]+href=["']([^"']+)["']/i);
      if (iconMatch && iconMatch[1]) {
        let iconUrl = iconMatch[1];
        if (!iconUrl.startsWith('http')) {
          const parsedUrl = new URL(url);
          if (iconUrl.startsWith('//')) {
            iconUrl = parsedUrl.protocol + iconUrl;
          } else if (iconUrl.startsWith('/')) {
            iconUrl = parsedUrl.origin + iconUrl;
          } else {
            iconUrl = parsedUrl.origin + '/' + iconUrl;
          }
        }
        return iconUrl;
      }
    }
  } catch (err) {
    console.warn("Failed to fetch og:image from URL:", err);
  }
  return null;
}

async function fetchExactCoverImage(query: string, mediaType?: string): Promise<string | null> {
  const q = query.trim();
  if (!q) return null;

  // 1. URL input: fetch OpenGraph images
  if (/^https?:\/\/[^\s$.?#].[^\s]*$/i.test(q)) {
    console.log(`URL detected. Fetching OpenGraph metadata image for "${q}"...`);
    const ogImg = await fetchOgImageFromUrl(q);
    if (ogImg) return ogImg;
  }

  const checkBooks = async () => {
    console.log(`Searching Google Books for "${q}"...`);
    const gBook = await fetchGoogleBooksImage(q);
    if (gBook) return gBook;
    console.log(`Searching Open Library for "${q}"...`);
    try {
      const olResponse = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=3`);
      if (olResponse.ok) {
        const olData = await olResponse.json();
        const withCover = (olData.docs || []).find((d: any) => d.cover_i);
        if (withCover) return `https://covers.openlibrary.org/b/id/${withCover.cover_i}-L.jpg`;
      }
    } catch (err) { console.warn("Open Library search failed:", err); }
    return null;
  };

  const checkMovie = async () => {
    console.log(`Searching iTunes for "${q}"...`);
    const itunes = await fetchItunesImage(q);
    if (itunes) return itunes;
    return null;
  };

  const checkTv = async () => {
    try {
      console.log(`Searching TVmaze for "${q}"...`);
      const tvmazeResponse = await fetch(`https://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(q)}`);
      if (tvmazeResponse.ok) {
        const tvData = await tvmazeResponse.json();
        if (tvData?.image?.original) return tvData.image.original;
      }
    } catch (err) { console.warn("TVmaze search failed:", err); }
    return null;
  };

  const checkWikipedia = async () => {
    console.log(`Searching Wikipedia for "${q}"...`);
    return await fetchWikipediaImage(q);
  };

  // Prioritize based on media type
  let result = null;
  const type = (mediaType || '').toLowerCase();
  
  if (type === 'movie' || type === 'film') {
    result = await checkMovie() || await checkWikipedia();
  } else if (type === 'book') {
    result = await checkBooks() || await checkWikipedia();
  } else if (type === 'tv' || type === 'television') {
    result = await checkTv() || await checkMovie() || await checkWikipedia();
  } else {
    // general/unknown fallback
    result = await checkWikipedia() || await checkBooks() || await checkMovie();
  }

  if (result) return result;

  // Final fallback using Pollinations AI
  const fallbackImage = `https://image.pollinations.ai/prompt/${encodeURIComponent(q)}`;
  console.log(`Using fallback image for "${q}": ${fallbackImage}`);
  return fallbackImage;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API route for generating dynamic roadmaps
  app.post("/api/roadmap", async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    let isUrl = false;
    let urlContext = "";
    
    // Basic URL detection
    if (/^https?:\/\/[^\s$.?#].[^\s]*$/i.test(prompt.trim())) {
      isUrl = true;
      console.log(`URL detected: ${prompt.trim()}. Fetching content...`);
      urlContext = await fetchUrlContent(prompt.trim());
    }

    const userTopic = isUrl ? `web page content at ${prompt}` : prompt;
    console.log(`Generating roadmap for: ${userTopic}`);

    const attempts = [
      { model: "gemini-3.5-flash", useSearch: true },
      { model: "gemini-3.5-flash", useSearch: false },
      { model: "gemini-3.1-flash-lite", useSearch: true },
      { model: "gemini-3.1-flash-lite", useSearch: false },
      { model: "gemini-flash-latest", useSearch: true },
      { model: "gemini-flash-latest", useSearch: false },
      { model: "gemini-3.1-pro-preview", useSearch: true },
      { model: "gemini-3.1-pro-preview", useSearch: false },
    ];

    let parsedData = null;
    let lastModelError = null;

    for (const attempt of attempts) {
      try {
        console.log(`Attempting dynamic roadmap generation with model: "${attempt.model}" (useSearch: ${attempt.useSearch})...`);
        
        const config: any = {
          responseMimeType: "application/json",
        };
        if (attempt.useSearch) {
          config.tools = [{ googleSearch: {} }];
        }

        const response = await ai.models.generateContent({
          model: attempt.model,
          contents: `You are an elite cognitive learning architect. Create an interactive, highly comprehensive educational roadmap for the subject: "${prompt}".
          ${isUrl ? `This roadmap MUST be based on the following fetched webpage content: \n\n${urlContext}\n\n` : ''}
          
          Your mission is to generate EXACTLY 9 chapters.
          Each chapter must teach real, actionable knowledge, explaining what it teaches, and how the user can apply it in the future.
          Each chapter's content should be EXTREMELY substantial, at least twice as long as normal (6-8 paragraphs of dense, high-quality, practical learning material written in Markdown). Do not shorten it, write a mini-book chapter for each.
          
          Use Google Search to find a high-quality, real public cover image URL representing this book, movie, or topic and return it in "coverImage" for the roadmap. 
          Additionally, for EACH chapter, you must provide a "coverImage" URL (using an Unsplash featured image format, e.g., https://images.unsplash.com/featured/800x400/?keyword,topic).
          Also, for EACH chapter, provide exactly 4-5 key takeaways as an array of strings in "bulletPoints".
          
          You must also generate EXACTLY 9 multiple-choice quiz questions. Each question MUST directly represent and test the core learning material from its corresponding chapter (Question 1 for Chapter 1, Question 2 for Chapter 2, etc.). Each question must have exactly 4 distinct choices and indicate the correct answer index (0-3).
          
          Return the result as a strictly valid JSON object with the following structure:
          {
            "title": "Roadmap Title",
            "description": "Engaging description summarizing what the learner will gain",
            "imageSearchQuery": "Cleaned up name of the main subject (e.g., 'Interstellar', 'Photosynthesis') for image search",
            "mediaType": "movie", // MUST be one of: "movie", "book", "tv", "general"
            "coverImage": "Leave empty",
            "chapters": [
              {
                "title": "Chapter 1: ...",
                "content": "Deep, 2x extended educational content in Markdown...",
                "coverImage": "https://image.pollinations.ai/prompt/relevant%20keyword",
                "bulletPoints": ["Key point 1", "Key point 2", "Key point 3", "Key point 4"]
              },
              ... (exactly 9 chapters)
            ],
            "quiz": [
              {
                "question": "Clear multiple choice question testing Chapter 1's content...",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correctAnswerIndex": 0
              },
              ... (exactly 9 questions, matching chapters 1 to 9 in order)
            ]
          }`,
          config,
        });

        const text = response.text;
        if (!text) {
          throw new Error("Empty response from Gemini API");
        }

        parsedData = JSON.parse(text);
        console.log(`Successfully generated roadmap using model "${attempt.model}"!`);
        break; // Successfully generated and parsed, break out of loop
      } catch (error: any) {
        console.warn(`Model "${attempt.model}" (useSearch: ${attempt.useSearch}) failed or reached quota limit:`, error.message || error);
        lastModelError = error;

        // Convert status to string safely to avoid TypeError
        const errMsg = (error.message || "").toLowerCase();
        const errStatus = String(error.status || "").toLowerCase();
        const errCode = error.code || (error.error && error.error.code);
        
        // Only break early on hard authentication errors (invalid API key).
        // For quota (429) or rate limits, we DO NOT break, we let the loop try the next model seamlessly!
        if (
          errCode === 403 || 
          errCode === 401 ||
          errMsg.includes("key_invalid") ||
          errMsg.includes("unauthorized")
        ) {
          console.warn("Fatal API auth error detected (Invalid Key). Advancing immediately to localized smart learning generator.");
          break;
        } else {
          console.warn("Model failed (possibly quota/rate-limit). Switching seamlessly to the next model fallback...");
        }
      }
    }

    if (parsedData) {
      // Resolve exact cover artwork if requested, passing mediaType for accuracy
      try {
        const searchQuery = parsedData.imageSearchQuery || parsedData.title || prompt;
        const exactCover = await fetchExactCoverImage(searchQuery, parsedData.mediaType);
        if (exactCover) {
          parsedData.coverImage = exactCover;
        }
      } catch (err) {
        console.warn("Could not fetch exact cover image, using Gemini cover:", err);
      }
      res.json(parsedData);
    } else {
      console.warn("All Gemini models failed or reached quota limits. Activating local smart learning generator as fallback:", lastModelError?.message || lastModelError);
      try {
        const fallbackData = generateFallbackRoadmap(prompt);
        // Resolve exact cover artwork even for localized fallbacks!
        try {
          const exactCover = await fetchExactCoverImage(prompt);
          if (exactCover) {
            fallbackData.coverImage = exactCover;
          }
        } catch (err) {
          console.warn("Could not fetch exact cover image for fallback, using localized cover:", err);
        }
        console.log(`Successfully generated localized cognitive course for: "${prompt}"`);
        res.json(fallbackData);
      } catch (fallbackError: any) {
        console.error("Critical error in fallback generator:", fallbackError);
        res.status(500).json({ error: "Failed to generate roadmap", message: lastModelError?.message || "Failed to generate roadmap" });
      }
    }
  });

  // Chat API for AI Discussion
  app.post("/api/chat", async (req, res) => {
    const { message, context, history } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    try {
      const chatContext = `You are a helpful AI tutor discussing a specific chapter with a student.
      Here is the chapter content for context:
      "${context}"
      
      Keep your answers highly relevant, encouraging, and concise.`;

      const contents = [
        { role: "user", parts: [{ text: chatContext }] },
        { role: "model", parts: [{ text: "Understood. I am ready to discuss the chapter." }] }
      ];

      if (history && Array.isArray(history)) {
        history.forEach((msg) => {
          contents.push({
            role: msg.role === "ai" ? "model" : "user",
            parts: [{ text: msg.content }]
          });
        });
      }

      contents.push({ role: "user", parts: [{ text: message }] });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
      });

      res.json({ reply: response.text });
    } catch (error: any) {
      console.error("Chat API error:", error);
      res.status(500).json({ error: "Failed to get AI response" });
    }
  });

  // Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
