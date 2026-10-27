const invalidCredentials = { error: "Invalid login credentials" };

module.exports = async function usernameLogin(req, res) {
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

  const username = typeof req.body?.username === "string"
    ? req.body.username.trim().toLowerCase()
    : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";

  if (!/^[a-z0-9._-]{3,30}$/.test(username) || password.length < 1 || password.length > 128) {
    return res.status(401).json(invalidCredentials);
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !publishableKey || !serviceKey) {
    return res.status(503).json({ error: "Username login is not configured" });
  }

  try {
    const profilesUrl = new URL("/rest/v1/perfiles", supabaseUrl);
    profilesUrl.search = new URLSearchParams({
      select: "email",
      nombre_usuario_login: `eq.${username}`,
      limit: "2",
    });

    const serviceHeaders = { apikey: serviceKey };
    if (serviceKey.startsWith("eyJ")) {
      serviceHeaders.Authorization = `Bearer ${serviceKey}`;
    }

    const profileResponse = await fetch(profilesUrl, {
      headers: serviceHeaders,
      signal: AbortSignal.timeout(5000),
    });
    if (!profileResponse.ok) {
      return res.status(503).json({ error: "Authentication service unavailable" });
    }

    const profiles = await profileResponse.json();
    const email = Array.isArray(profiles) && profiles.length === 1
      ? profiles[0].email
      : "invalid-login@d10scup.invalid";

    const authResponse = await fetch(new URL("/auth/v1/token?grant_type=password", supabaseUrl), {
      method: "POST",
      headers: {
        apikey: publishableKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      signal: AbortSignal.timeout(5000),
    });

    if (!authResponse.ok || email.endsWith(".invalid")) {
      return res.status(401).json(invalidCredentials);
    }

    const session = await authResponse.json();
    if (!session.access_token || !session.refresh_token) {
      return res.status(401).json(invalidCredentials);
    }

    return res.status(200).json({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });
  } catch {
    return res.status(503).json({ error: "Authentication service unavailable" });
  }
};
