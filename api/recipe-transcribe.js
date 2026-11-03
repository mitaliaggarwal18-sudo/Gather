export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const apiKey = process.env.OpenAI_API_Key || process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(503).json({ error: "AI is not configured. Check the OpenAI API key environment variable in Vercel." });
  const { audio, mimeType } = req.body || {};
  if (typeof audio !== "string" || audio.length > 4_100_000 || !/^[A-Za-z0-9+/]+={0,2}$/.test(audio)) {
    return res.status(400).json({ error: "The recording is empty or too large. Record a shorter recipe description." });
  }
  const allowedTypes = new Set(["audio/webm", "audio/webm;codecs=opus", "audio/mp4", "audio/ogg", "audio/wav"]);
  const type = allowedTypes.has(mimeType) ? mimeType.split(";")[0] : "audio/webm";
  const extension = type === "audio/mp4" ? "m4a" : type === "audio/wav" ? "wav" : type === "audio/ogg" ? "ogg" : "webm";
  try {
    const bytes = Buffer.from(audio, "base64");
    if (!bytes.length || bytes.length > 3_000_000) return res.status(400).json({ error: "The recording is too large. Record a shorter recipe description." });
    const form = new FormData();
    form.append("file", new Blob([bytes], { type }), `recipe.${extension}`);
    form.append("model", "gpt-transcribe");
    form.append("response_format", "json");
    form.append("prompt", "Transcribe a spoken recipe description, including ingredient quantities and cooking steps. Preserve the speaker's language and numbers.");
    const upstream = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST", headers: { Authorization: `Bearer ${apiKey}` }, body: form
    });
    const payload = await upstream.json();
    if (!upstream.ok) return res.status(upstream.status === 429 ? 503 : 502).json({ error: payload?.error?.message || "Audio transcription failed." });
    const text = typeof payload.text === "string" ? payload.text.trim() : "";
    if (!text) return res.status(502).json({ error: "No speech was detected. Try again in a quieter place." });
    return res.status(200).json({ text });
  } catch {
    return res.status(500).json({ error: "Audio transcription failed. Please try again." });
  }
}
