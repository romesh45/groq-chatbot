/* ═══════════════════════════════════════════════════════
   AI.js  —  Chatbot powered by Groq API (via serverless proxy)
   ═══════════════════════════════════════════════════════ */

/* ─── State ────────────────────────────────────────────── */
let conversationHistory = [];    // stores {role, content} pairs
let isLoading = false;

/* ─── DOM refs ─────────────────────────────────────────── */
const chatMessages = document.getElementById("chatMessages");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearChat");

/* ─── Auto-resize textarea ─────────────────────────────── */
userInput.addEventListener("input", () => {
    userInput.style.height = "auto";
    userInput.style.height = Math.min(userInput.scrollHeight, 120) + "px";
});

/* ─── Send on Enter (Shift+Enter = newline) ────────────── */
userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
});

sendBtn.addEventListener("click", handleSend);
clearBtn.addEventListener("click", clearChat);

/* ═══════════════════════════════════════════════════════
   Core: send message → call Groq → render reply
   ═══════════════════════════════════════════════════════ */
async function handleSend() {
    const text = userInput.value.trim();
    if (!text || isLoading) return;

    /* Append user message to UI + history */
    appendMessage("user", text);
    conversationHistory.push({ role: "user", content: text });

    /* Reset input */
    userInput.value = "";
    userInput.style.height = "auto";

    /* Show typing indicator */
    const typingId = showTyping();
    isLoading = true;
    sendBtn.disabled = true;

    try {
        const reply = await callAPI(conversationHistory);
        removeTyping(typingId);
        appendMessage("bot", reply);
        conversationHistory.push({ role: "assistant", content: reply });
    } catch (err) {
        removeTyping(typingId);
        showError(err.message);
    } finally {
        isLoading = false;
        sendBtn.disabled = false;
        userInput.focus();
    }
}

/* ═══════════════════════════════════════════════════════
   Proxy API call
   ═══════════════════════════════════════════════════════ */
async function callAPI(history) {
    const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        const msg = data?.error || `HTTP ${res.status}`;
        if (res.status === 429) throw new Error("Rate limit hit. Wait a moment and try again.");
        throw new Error(msg);
    }

    return data.reply;
}

/* ═══════════════════════════════════════════════════════
   UI helpers
   ═══════════════════════════════════════════════════════ */
function appendMessage(role, text) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("message", role === "user" ? "user-message" : "bot-message");

    const bubble = document.createElement("div");
    bubble.classList.add("message-bubble");

    if (role === "bot") {
        bubble.innerHTML = typeof marked !== "undefined"
            ? marked.parse(text)
            : escapeHtml(text).replace(/\n/g, "<br>");
    } else {
        bubble.textContent = text;
    }

    const time = document.createElement("div");
    time.classList.add("message-time");
    time.textContent = formatTime();

    wrapper.appendChild(bubble);
    wrapper.appendChild(time);
    chatMessages.appendChild(wrapper);
    scrollToBottom();
}

function showTyping() {
    const id = "typing-" + Date.now();
    const wrapper = document.createElement("div");
    wrapper.classList.add("message", "bot-message");
    wrapper.id = id;
    wrapper.innerHTML = `
      <div class="message-bubble typing-indicator">
        <span></span><span></span><span></span>
      </div>`;
    chatMessages.appendChild(wrapper);
    scrollToBottom();
    return id;
}

function removeTyping(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function showError(msg) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("message", "bot-message", "error-message");
    wrapper.innerHTML = `<div class="message-bubble">⚠️ ${escapeHtml(msg)}</div>`;
    chatMessages.appendChild(wrapper);
    scrollToBottom();
}

function clearChat() {
    conversationHistory = [];
    chatMessages.innerHTML = `
      <div class="message bot-message">
        <div class="message-bubble">
          Chat cleared. Clean slate — almost like you never asked that question. 😏
        </div>
        <div class="message-time">just now</div>
      </div>`;
}

function scrollToBottom() {
    chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: "smooth" });
}

function formatTime() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}


/* ═══════════════════════════════════════════════════════
   Tech Stack Icon Tooltips  (left panel)
   ═══════════════════════════════════════════════════════ */
const descriptions = {
    htmljs: "HTML / JavaScript: The core web technologies used to build this chatbot — structured markup, dynamic UI rendering, and direct API calls from the browser. No backend required.",
    groq: "Groq API: A free-tier AI inference API that provides blazing-fast LLM responses. We call it directly from JavaScript using fetch() — zero cost, zero backend.",
    llama: "LLaMA 3.3 70B: Meta's open-source large language model, hosted and accelerated by Groq. State-of-the-art quality on Groq's free tier.",
    css: "CSS3: Used to style the entire interface — the dark theme, animated components, responsive layout, and the custom chat UI you're interacting with right now.",
};

const aboutSection = document.getElementById("aboutSection");
const tooltipIcons = document.getElementsByClassName("tooltip");

for (let i = 0; i < tooltipIcons.length; i++) {
    tooltipIcons[i].addEventListener("click", (e) => {
        const id = e.currentTarget.id;
        if (descriptions[id]) aboutSection.textContent = descriptions[id];
    });
}

/* ─── Dark / Light mode toggle ─────────────────────────── */
const themeBtn = document.getElementById("themeToggle");
const moonIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const sunIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

let isDark = true;

themeBtn.addEventListener("click", () => {
    isDark = !isDark;
    document.body.classList.toggle("light", !isDark);
    themeBtn.innerHTML = isDark ? sunIcon : moonIcon;
    themeBtn.title = isDark ? "Switch to light mode" : "Switch to dark mode";
});

/* Social share buttons */
const socialIconButtons = document.getElementsByClassName("social-icon");

function postToSocialMedia(classList) {
    const content = `Check out my AI Chatbot built with Groq + LLaMA 3! 🤖\n${window.location.href}`;
    if (classList.contains("twitter")) {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`);
    } else if (classList.contains("linkedin")) {
        window.open(`https://www.linkedin.com/share?text=${encodeURIComponent(content)}`);
    } else if (classList.contains("whatsapp")) {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(content)}`);
    }
}

for (let i = 0; i < socialIconButtons.length; i++) {
    socialIconButtons[i].addEventListener("click", () =>
        postToSocialMedia(socialIconButtons[i].classList)
    );
}

/* ─── Name easter egg ──────────────────────────────────── */
const profileName = document.getElementById("profileName");
const nameHint = document.getElementById("nameHint");
let nameToggled = false;

if (profileName) {
    profileName.addEventListener("click", () => {
        profileName.style.transform = "scale(1.05)";
        setTimeout(() => { profileName.style.transform = "scale(1)"; }, 300);

        if (!nameToggled) {
            profileName.textContent = "you can call me Aizen 😎";
            nameToggled = true;
            if (nameHint) {
                nameHint.style.opacity = "0";
                setTimeout(() => { nameHint.style.display = "none"; }, 300);
            }
        } else {
            profileName.textContent = "Romeshwar K";
            nameToggled = false;
        }
    });
}
