# CogniPath — AI-Powered Cognitive Learning Journeys

> *Transform any topic into a deep, gamified, personalized learning experience — in seconds.*

---

## 📖 Overview

**CogniPath** is a full-stack, AI-powered learning platform that converts any subject — a movie, a book, a scientific concept, or even a webpage URL — into a structured, 9-chapter cognitive roadmap powered by Google Gemini AI.

Give CogniPath a topic and it builds your personal curriculum — with rich chapter content, cover images, key takeaways, an AI tutor, and a final quiz — all in seconds.

> **"Learn anything. Master everything."**

---

## ✨ Features

### 🧠 AI-Generated Learning Roadmaps
- Enter any topic, movie, book, concept, or paste a webpage URL
- Gemini AI generates a **9-chapter cognitive roadmap** with deep educational content
- Intelligent **model fallback chain** — if one model hits a rate limit, it seamlessly switches to the next
- Automatic **media-type detection** (`movie`, `book`, `tv`, `general`) for accurate cover image sourcing

### 📚 Immersive Chapter Experience
- Each chapter opens in a **full-page, distraction-free reading view**
- Beautiful **AI-sourced cover image** at the top (iTunes, Wikipedia, Open Library, Pollinations AI)
- **Adjustable text size** (A− / A+) for comfortable reading
- **Key Takeaways** — 4–5 AI-generated bullet points summarizing each chapter

### 🤖 Built-In AI Tutor
- Click **AI Discussion** inside any chapter to open a live chat sidebar
- The AI tutor has full context of the chapter for accurate, relevant answers
- Ask questions, request summaries, or get quizzed on the material
- Chat history is **auto-saved** per chapter

### 🎯 Final Assessment & Certificates
- After completing all 9 chapters, a **Final Quiz** is unlocked
- 9 multiple-choice questions testing mastery of the full curriculum
- Earn a **personalized digital certificate** with your score and EXP reward

### 🎮 Gamification
| Feature | Description |
|---|---|
| 🔥 **Daily Streak** | Complete a chapter every day to grow your streak |
| ⭐ **EXP Points** | Earn 50 EXP per chapter + bonus EXP from quizzes |
| 🪙 **Gold Coins** | Rewarded daily and on streaks — spend in the store |
| 🏆 **Leaderboard** | Compete based on total EXP earned |
| 🏅 **Achievement Wall** | Gallery of all your earned certificates |

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript 5.8, Vite 6 |
| **Styling** | Tailwind CSS v4, `@tailwindcss/typography` |
| **Animations** | Framer Motion |
| **Backend** | Express.js via `tsx` |
| **AI Engine** | Google Gemini (`gemini-2.0-flash`) with multi-model fallback |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Cover Images** | iTunes · Open Library · Google Books · Wikipedia · Pollinations AI |
| **Avatars** | DiceBear API |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- A [Google Gemini API Key](https://aistudio.google.com/apikey) (free tier available)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/cognipath.git
cd cognipath

# 2. Install dependencies
npm install

# 3. Set your Gemini API Key

# Windows (PowerShell)
$env:GEMINI_API_KEY="your_api_key_here"

# macOS / Linux
export GEMINI_API_KEY=your_api_key_here

# Or create a .env file in the root
echo "GEMINI_API_KEY=your_api_key_here" > .env

# 4. Start the development server
npm run dev
```

Open your browser at **[http://localhost:3000](http://localhost:3000)**

### Build for Production

```bash
npm run build
npm run start
```

---

## 🔧 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | ✅ Yes | Your Google AI Studio API key |

> ⚠️ **Never commit your API key.** Use a `.env` file and add it to `.gitignore`.

---

## 📁 Project Structure

```
CogniPath/
├── server.ts                    # Express backend + Gemini AI (/api/roadmap, /api/chat)
├── vite.config.ts
├── package.json
└── src/
    ├── main.tsx                 # App entry point
    ├── App.tsx                  # Root component — global state & routing
    ├── index.css                # Global styles + Tailwind config
    ├── types.ts                 # TypeScript interfaces
    ├── ErrorBoundary.tsx        # Crash safety net
    ├── lib/
    │   └── sound.ts             # Web Audio sound effects
    └── components/
        ├── LandingView.tsx      # Marketing landing page
        ├── DashboardView.tsx    # Journey generation hub
        ├── RoadmapView.tsx      # Zigzag milestone path
        ├── ChapterView.tsx      # Full-page chapter reader
        ├── AIChatSidebar.tsx    # AI tutor chat panel
        ├── QuizView.tsx         # Final assessment
        ├── LibraryView.tsx      # Saved journeys
        ├── ProfileView.tsx      # Profile & cosmetic store
        ├── AnalyticsView.tsx    # Learning statistics
        ├── AchievementWall.tsx  # Certificate gallery
        └── LeaderboardView.tsx  # EXP leaderboard
```

---

## 🔄 How It Works

```
User types a topic or URL
        │
        ▼
  Express backend (/api/roadmap)
        │
        ├─► Gemini AI builds 9-chapter roadmap JSON
        │       └─► Fallback to next model on rate limit
        │
        ├─► Cover image fetched (iTunes → Wikipedia → Pollinations AI)
        │
        └─► JSON returned to React frontend
                │
                ▼
        Zigzag Roadmap path rendered
                │
                ▼
        User clicks chapter → Full-page reader opens
                │
                ├─► Chapter content (Markdown)
                ├─► Cover image banner
                ├─► Key Takeaways
                └─► AI Discussion (/api/chat)
```

---

## 🛣️ Future Plans

- [ ] Multi-language support (Hindi, Spanish, French, Arabic…)
- [ ] Voice narration / Text-to-speech for chapters
- [ ] Collaborative journeys — share roadmaps with others
- [ ] Mobile app (Android & iOS)
- [ ] Cloud sync — user accounts with database backend
- [ ] Export chapter notes and certificates as PDF
- [ ] Custom chapter count (5, 9, 12, 15…)
- [ ] Spaced repetition review system

---

## 📄 License

This project is licensed under the **MIT License** — meaning anyone can freely use, copy, modify, and share this code as long as they give credit to the original author.

---
📌 Disclaimer: Some statistics displayed on this platform (such as member counts, cards generated, and community metrics) are illustrative placeholders and do not reflect real data. SAGE is built purely for educational and knowledge-exploration purposes. Include this sentence in the README file And then update in the GitHub

<div align="center">

**Made with ❤️ for curious minds everywhere.**

*CogniPath — Where curiosity becomes mastery.*

</div>
