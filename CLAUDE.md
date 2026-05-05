# Chatbot with Groq — Claude Code Context

## Project Overview
A portfolio chatbot page — left panel shows profile/tech stack info, right panel is a live AI chat UI.  
**Stack:** Pure HTML + CSS + JS (no framework, no build step, no backend).  
**AI:** Groq API (free tier) → LLaMA 3.3 70B, called directly from the browser via `fetch()`.

## File Map
```
AI.html   — page structure: left info panel + right chat UI
AI.css    — all styles including chat bubble, typing indicator, responsive layout
AI.js     — Groq API call, chat state, message rendering, tooltip descriptions
```

## The One Required Setup Step
In `AI.js` line 14, replace the placeholder with a real Groq API key:
```js
const GROQ_API_KEY = "YOUR_GROQ_API_KEY_HERE";
```
Get a free key at: https://console.groq.com → API Keys → Create API Key

## Key Constants in AI.js
```js
GROQ_API_KEY   = "..."                      // free key from console.groq.com
GROQ_MODEL     = "llama-3.3-70b-versatile"  // change to any Groq model
SYSTEM_PROMPT  = "..."                      // customize bot personality here
```

## Available Groq Models (free tier)
- `llama-3.3-70b-versatile`   ← current default (best quality)
- `llama3-8b-8192`            ← fastest, lightest
- `mixtral-8x7b-32768`        ← large context window
- `gemma2-9b-it`              ← Google's Gemma 2

## Personalisation Checklist (AI.html)
- [ ] Line ~60: `<h3 class="name">Your Name</h3>` — replace with your name
- [ ] Line ~61: `<p class="bot-extra-info">AI Developer · Builder</p>` — your tagline
- [ ] Line ~57: `<img ... src="...">` — replace with your photo URL
- [ ] Line ~73: heading `<h1 class="heading">My Gen AI</h1>` — rename if you want
- [ ] Line ~77: project description `<p class="description">` — rewrite your description

## Colour System (AI.css)
Primary accent: `#F55036` (Groq red-orange)  
Background:     `linear-gradient(to right, #000, #1F2937)`  
Card bg:        `rgba(30,41,59,0.7)`  
Border:         `#1e293b`  
Text muted:     `rgb(148,163,184)`  

## Chat UI Component Structure (AI.html)
```
.chat-ui
  .chat-header          ← bot name, status dot, clear button
  .chat-messages        ← scrollable message list (#chatMessages)
  .chat-input-area      ← textarea + send button
  .api-key-notice       ← yellow warning, hidden once key is set
```

## JS Architecture (AI.js)
- `conversationHistory[]` — full message array sent to Groq each time (multi-turn memory)
- `callGroq(history)`     — async fetch to Groq API, returns reply string
- `handleSend()`          — orchestrates: append user msg → show typing → call API → render reply
- `appendMessage(role, text)` — renders a bubble into #chatMessages
- `showTyping() / removeTyping()` — animated 3-dot indicator while waiting
- `clearChat()`           — resets history array + DOM

## Common Things to Edit

### Change bot personality
```js
// AI.js — SYSTEM_PROMPT constant
const SYSTEM_PROMPT = `You are a helpful, friendly, and concise AI assistant...`;
```

### Change the model
```js
const GROQ_MODEL = "llama3-8b-8192";  // faster responses
```

### Adjust max response length
```js
// in callGroq() → body JSON
max_tokens: 1024,   // increase for longer answers
```

### Add a new tech icon to the left panel
1. Add icon HTML inside `.topics-list` in `AI.html` (copy an existing `.topic-icon` block)
2. Add its description in `AI.js` → `descriptions` object

### Change accent colour globally
Find `#F55036` in `AI.css` and replace all instances with your preferred colour.

## Deployment (all free)
- **GitHub Pages:** push files → Settings → Pages → deploy from `main`
- **Netlify:** drag the folder into https://app.netlify.com/drop
- **Vercel:** `npx vercel` in the project folder

## No Build Step Needed
Open `AI.html` directly in a browser to test locally. No `npm install`, no server required.
