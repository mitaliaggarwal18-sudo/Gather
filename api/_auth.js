const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const publishableKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

export async function requireGatherUser(req, res) {
  const token = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!token || !supabaseUrl || !publishableKey) {
    res.status(401).json({ error: "Sign in to use Gather AI tools." });
    return null;
  }
  try {
    const headers = { apikey: publishableKey, Authorization: `Bearer ${token}` };
    const auth = await fetch(`${supabaseUrl}/auth/v1/user`, { headers });
    if (!auth.ok) {
      res.status(401).json({ error: "Your session expired. Sign in again." });
      return null;
    }
    const user = await auth.json();
    const quota = await fetch(`${supabaseUrl}/rest/v1/rpc/consume_gather_ai_quota`, {
      method: "POST", headers: { ...headers, "Content-Type": "application/json" }, body: "{}"
    });
    if (!quota.ok) {
      res.status(quota.status === 429 ? 429 : 503).json({ error: "AI usage limit could not be checked. Try again shortly." });
      return null;
    }
    const count = Number(await quota.json());
    if (count > 30) {
      res.setHeader("Retry-After", "3600");
      res.status(429).json({ error: "Gather AI limit reached (30 requests per hour). Try again later." });
      return null;
    }
    return user;
  } catch {
    res.status(503).json({ error: "Could not verify your Gather account. Try again shortly." });
    return null;
  }
}
