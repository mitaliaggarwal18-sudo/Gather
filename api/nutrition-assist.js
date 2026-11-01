export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const apiKey = process.env.OpenAI_API_Key || process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(503).json({ error: "AI is not configured yet. Check the OpenAI_API_Key production environment variable in Vercel." });
  const { ingredient, quantity, unit, databaseMatch } = req.body || {};
  if (typeof ingredient !== "string" || !ingredient.trim() || ingredient.length > 160) {
    return res.status(400).json({ error: "Please provide a valid ingredient name." });
  }
  const db = databaseMatch && typeof databaseMatch === "object" ? databaseMatch : null;
  const prompt = {
    task: db
      ? "Check whether the supplied generic food database nutrition values are plausible for the named ingredient. Preserve them if broadly reasonable. Only adjust if clearly inaccurate for the stated food identity/state. Do not pretend to consult a live database."
      : "Estimate typical nutrition for the named ingredient because the local reference database has no match. Do not invent brand-specific label facts.",
    ingredient: ingredient.trim(),
    quantity: Number(quantity) || 0,
    unit: typeof unit === "string" ? unit : "g",
    database_per_100g: db ? { kcal: db.kcal, protein: db.p, carbs: db.c, fiber: db.f } : null
  };
  const schema = {
    type: "object",
    additionalProperties: false,
    properties: {
      ingredient: { type: "string" },
      nutritionPer100g: {
        type: "object", additionalProperties: false,
        properties: { kcal: { type: "number" }, protein: { type: "number" }, carbs: { type: "number" }, fiber: { type: "number" } },
        required: ["kcal", "protein", "carbs", "fiber"]
      },
      confidence: { type: "string", enum: ["low", "medium", "high"] },
      note: { type: "string" }
    },
    required: ["ingredient", "nutritionPer100g", "confidence", "note"]
  };
  try {
    const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.1,
        response_format: { type: "json_schema", json_schema: { name: "nutrition_assist", strict: true, schema } },
        messages: [
          { role: "system", content: "You are a cautious food nutrition assistant. Return typical generic edible-food nutrition per 100 g. Use standard food composition knowledge only; never claim laboratory accuracy or a source lookup. Distinguish raw versus cooked when apparent. If identity or state is ambiguous, use conservative typical values and low confidence, and explain the assumption in note. Fibre must be nonnegative and cannot exceed total carbs. Calories, protein, carbs and fibre must be plausible nonnegative numbers." },
          { role: "user", content: JSON.stringify(prompt) }
        ]
      })
    });
    const payload = await upstream.json();
    if (!upstream.ok) {
      const message = payload?.error?.message || "OpenAI request failed.";
      return res.status(upstream.status === 429 ? 503 : 502).json({ error: message });
    }
    const content = payload?.choices?.[0]?.message?.content;
    if (!content) return res.status(502).json({ error: "AI returned an empty response." });
    const result = JSON.parse(content);
    const n = result.nutritionPer100g;
    if (![n.kcal, n.protein, n.carbs, n.fiber].every(v => Number.isFinite(v) && v >= 0) || n.fiber > n.carbs + 0.5) {
      return res.status(502).json({ error: "AI returned invalid nutrition values. Please use a product label or manual entry." });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Nutrition assistance failed. Please try again later." });
  }
}