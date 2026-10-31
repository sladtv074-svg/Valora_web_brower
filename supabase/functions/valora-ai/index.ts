const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const UPSTREAM_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini";
const MAX_MESSAGES = 20;
const MAX_CONTENT_LENGTH = 2000;
const ACTIVITIES = ["gamer", "streamer", "professionnel", "loisir"];

const BASE_PROMPT = [
  "Tu es Valora IA, l'assistant intégré au navigateur Valora.",
  "Présente-toi uniquement comme Valora IA, sans jamais mentionner un autre fournisseur ou modèle.",
  "Réponds en français, de façon claire, chaleureuse et concise.",
  "Si l'utilisateur demande d'ouvrir un site, dis-le brièvement et ajoute à la toute fin de ta réponse une ligne exactement au format [OUVRIR: domaine.tld].",
].join(" ");

interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function parseTurns(value: unknown): ChatTurn[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_MESSAGES) return null;
  const turns: ChatTurn[] = [];
  for (const item of value) {
    if (typeof item !== "object" || item === null) return null;
    const { role, content } = item as Record<string, unknown>;
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string" || content.trim().length === 0 || content.length > MAX_CONTENT_LENGTH) {
      return null;
    }
    turns.push({ role, content });
  }
  return turns;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("AI_API_KEY");
    if (!apiKey) {
      return json({ error: "not_configured" }, 503);
    }

    const body = (await req.json()) as Record<string, unknown>;
    const turns = parseTurns(body.messages);
    if (!turns) {
      return json({ error: "invalid_messages" }, 400);
    }

    const activity = typeof body.activity === "string" && ACTIVITIES.includes(body.activity) ? body.activity : null;
    const systemPrompt = activity
      ? `${BASE_PROMPT} L'utilisateur se décrit comme un profil « ${activity} » : adapte tes exemples à ce profil.`
      : BASE_PROMPT;

    const upstream = await fetch(UPSTREAM_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 700,
        messages: [{ role: "system", content: systemPrompt }, ...turns],
      }),
    });

    if (!upstream.ok) {
      console.error("Upstream AI error", upstream.status);
      return json({ error: "upstream_failed" }, 502);
    }

    const payload = (await upstream.json()) as {
      choices?: { message?: { content?: unknown } }[];
    };
    const reply = payload.choices?.[0]?.message?.content;
    if (typeof reply !== "string" || reply.trim().length === 0) {
      return json({ error: "empty_reply" }, 502);
    }

    return json({ reply: reply.trim() });
  } catch (error) {
    console.error("valora-ai failed", error);
    return json({ error: "internal" }, 500);
  }
});
