<div align="center">

<br />

```
   ██████╗ ██████╗  ██████╗  ██████╗      ██████╗██╗  ██╗ █████╗ ████████╗██████╗  ██████╗ ████████╗
  ██╔════╝ ██╔══██╗██╔═══██╗██╔═══██╗    ██╔════╝██║  ██║██╔══██╗╚══██╔══╝██╔══██╗██╔═══██╗╚══██╔══╝
  ██║  ███╗██████╔╝██║   ██║██║   ██║    ██║     ███████║███████║   ██║   ██████╔╝██║   ██║   ██║   
  ██║   ██║██╔══██╗██║   ██║██║   ██║    ██║     ██╔══██║██╔══██║   ██║   ██╔══██╗██║   ██║   ██║   
  ╚██████╔╝██║  ██║╚██████╔╝╚██████╔╝    ╚██████╗██║  ██║██║  ██║   ██║   ██████╔╝╚██████╔╝   ██║   
   ╚═════╝ ╚═╝  ╚═╝ ╚═════╝  ╚═════╝      ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═════╝  ╚═════╝    ╚═╝  
```

<br />

**An AI-powered chatbot with glassmorphism UI — built on Groq's blazing-fast free inference.**  
*No backend overhead. Serverless. Deployed on Vercel.*

<br />

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-6366f1?style=for-the-badge&logo=vercel&logoColor=white)](https://groq-chatbot-six.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-romesh45-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/romesh45/groq-chatbot)
[![Model](https://img.shields.io/badge/Model-LLaMA%203.3%2070B-f55036?style=for-the-badge&logo=meta&logoColor=white)](https://console.groq.com)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)

<br />

</div>

---

<div align="center">

## ✦ Preview

*Glassmorphism meets minimal clean — frosted panels, soft indigo accents, smooth animations.*

> Click **Romeshwar K** on the live site — you'll find out why 😎

</div>

---

## ⚡ Features

- 🧠 **LLaMA 3.3 70B** via Groq — state-of-the-art responses at zero cost
- 🔒 **Secure API proxy** — Groq key lives in Vercel env vars, never in the browser
- 💬 **Multi-turn memory** — full conversation history sent with every message
- ✨ **Markdown rendering** — bot replies support headers, code blocks, lists
- 🌊 **Glassmorphism UI** — frosted panels, soft gradients, backdrop blur
- 🎭 **Easter egg** — click the name and see what happens
- ⌨️ **Typing indicator** — animated 3-dot indicator while waiting for response
- 📱 **Fully responsive** — works on mobile, tablet, desktop
- 🚀 **Serverless** — zero cold start penalty, Vercel edge network

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML5 · CSS3 · Vanilla JavaScript |
| **AI Model** | LLaMA 3.3 70B Versatile |
| **Inference** | [Groq API](https://console.groq.com) (free tier) |
| **Proxy** | Vercel Serverless Function (`/api/chat.js`) |
| **Deployment** | Vercel |
| **Markdown** | marked.js |

---

## 📁 Project Structure

```
groq-chatbot/
│
├── api/
│   └── chat.js          ← Vercel serverless function (Groq proxy)
│
├── AI.html              ← Page structure: profile panel + chat UI
├── AI.css               ← All styles: glassmorphism, bubbles, animations
├── AI.js                ← Chat logic: state, rendering, API calls
└── vercel.json          ← Routing config
```

---

## 🚀 Run Locally

**1. Clone the repo**
```bash
git clone https://github.com/romesh45/groq-chatbot.git
cd groq-chatbot
```

**2. Get a free Groq API key**

Go to [console.groq.com](https://console.groq.com) → API Keys → Create API Key

**3. Set up environment**
```bash
# Create a local env file
echo "GROQ_API_KEY=your_key_here" > .env
```

**4. Install Vercel CLI and run**
```bash
npm install -g vercel
vercel dev
```

Open `http://localhost:3000` — done.

---

## ☁️ Deploy Your Own

**Vercel (recommended)**

```bash
# Install CLI
npm install -g vercel

# Deploy
vercel

# Add your key
# Vercel Dashboard → Project → Settings → Environment Variables
# Key: GROQ_API_KEY  |  Value: gsk_...
```

**Or click below:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/romesh45/groq-chatbot)

---

## 🔐 How the Proxy Works

```
Browser (AI.js)
     │
     │  POST /api/chat
     │  { messages: [...] }
     ▼
Vercel Function (api/chat.js)
     │
     │  Authorization: Bearer $GROQ_API_KEY
     │  (key never leaves the server)
     ▼
Groq API → LLaMA 3.3 70B
     │
     ▼
{ reply: "..." } → back to browser
```

The API key is stored as a **Vercel Environment Variable** — it never appears in the client-side code or GitHub.

---

## 🎨 Customise

**Change the bot personality** — open `AI.js` and edit `SYSTEM_PROMPT`

**Change the model** — edit `GROQ_MODEL` in `api/chat.js`

```js
// Available free models on Groq
"llama-3.3-70b-versatile"   // default — best quality
"llama3-8b-8192"            // fastest
"mixtral-8x7b-32768"        // large context
"gemma2-9b-it"              // Google Gemma 2
```

**Change accent colour** — find `#6366F1` in `AI.css` and replace globally

---

## 👤 Author

<div align="center">

**Romeshwar K**  
AI Developer

[![GitHub](https://img.shields.io/badge/GitHub-romesh45-181717?style=flat-square&logo=github)](https://github.com/romesh45)

</div>

---

<div align="center">

*Built with 🤍 and way too much Groq inference*

</div>
