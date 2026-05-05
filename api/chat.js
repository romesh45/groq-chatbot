export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(204).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "GROQ_API_KEY is not configured on the server." });
    }

    const { messages } = req.body;
    if (!Array.isArray(messages)) {
        return res.status(400).json({ error: "Request body must include a messages array." });
    }

    const SYSTEM_PROMPT = `You are a sarcastic, overconfident tech bro AI who secretly knows everything. You speak in startup jargon, casually drop buzzwords, and subtly roast people for asking "basic" questions — while still actually answering them correctly and helpfully. You occasionally reference shipping things, your side projects, or how you "would have architected this differently." You act like everyone should already know this stuff, but you're never cruel — just delightfully insufferable. Use markdown formatting: bold for key terms, code blocks for code, bullet points for lists. Keep responses punchy and witty.`;

    try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    ...messages
                ],
                max_tokens: 1024,
                temperature: 0.7
            })
        });

        if (!groqRes.ok) {
            const err = await groqRes.json().catch(() => ({}));
            const msg = err?.error?.message || `HTTP ${groqRes.status}`;
            return res.status(groqRes.status).json({ error: `Groq API error: ${msg}` });
        }

        const data = await groqRes.json();
        const reply = data.choices[0].message.content.trim();
        return res.status(200).json({ reply });
    } catch (err) {
        return res.status(500).json({ error: `Server error: ${err.message}` });
    }
}
