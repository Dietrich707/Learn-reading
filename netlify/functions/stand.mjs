import { getStore } from "@netlify/blobs";
const ok = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
export default async (req) => {
  const url = new URL(req.url);
  const code = (url.searchParams.get("code") || "").trim().toLowerCase();
  if (!/^[a-z0-9-]{4,40}$/.test(code)) return ok({ error: "ongeldige code" }, 400);
  const store = getStore("leesliga");
  if (req.method === "GET") {
    const data = await store.get(code, { type: "json" });
    return ok({ data: data || null });
  }
  if (req.method === "PUT") {
    const body = await req.json();
    if (!body || typeof body !== "object" || JSON.stringify(body).length > 2_000_000) return ok({ error: "te groot" }, 413);
    await store.setJSON(code, body);
    return ok({ saved: true });
  }
  return ok({ error: "methode" }, 405);
};
export const config = { path: "/api/stand" };
