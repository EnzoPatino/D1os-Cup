const supabaseUrl = "https://tfddypdwcbhunmpbrjke.supabase.co";
const publishableKey = "sb_publishable_Lv3JrpwVYusrQ8HzgJVirw_Me7Quc5Y";

module.exports = async function emailLogin(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const origin = req.headers.origin;
  const host = req.headers.host;
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return res.status(403).json({ error: "Forbidden" });
      }
    } catch {
      return res.status(403).json({ error: "Forbidden" });
    }
  }

  const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!email || email.length > 254 || !email.includes("@") || password.length < 1 || password.length > 128) {
    return res.status(400).json({ code: "invalid_credentials" });
  }

  try {
    const response = await fetch(new URL("/auth/v1/token?grant_type=password", supabaseUrl), {
      method: "POST",
      headers: {
        apikey: publishableKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      signal: AbortSignal.timeout(10000),
    });
    const payload = await response.json();

    if (!response.ok) {
      const code = payload.error_code || payload.code || "auth_error";
      const status = response.status === 400 || response.status === 422 ? 401 : response.status;
      return res.status(status).json({ code });
    }

    if (!payload.access_token || !payload.refresh_token) {
      return res.status(502).json({ code: "invalid_auth_response" });
    }

    return res.status(200).json({
      access_token: payload.access_token,
      refresh_token: payload.refresh_token,
    });
  } catch {
    return res.status(503).json({ code: "auth_unavailable" });
  }
};
