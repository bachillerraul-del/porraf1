import { getState, upsertResultados } from "./_store";

export default function handler(req, res){
  if (req.method === "GET") {
    const { gpId } = req.query;
    const { results } = getState();
    if (gpId && typeof gpId === "string") {
      const r = results.find(x => x.gpId === gpId);
      return res.status(200).json({ ok: true, result: r ?? null });
    }
    return res.status(200).json({ ok: true, results });
  }
  if (req.method === "POST") {
    const body = req.body || {};
    if (!body.gpId) return res.status(400).json({ ok:false, error:"gpId requerido" });
    upsertResultados({
      gpId: body.gpId,
      qualyOficial: body.qualyOficial ?? [],
      carreraOficial: body.carreraOficial ?? [],
      pilotoDelDia: body.pilotoDelDia ?? undefined,
      updatedAt: Date.now()
    });
    return res.status(200).json({ ok: true });
  }
  res.setHeader("Allow", "GET, POST");
  res.status(405).end("Method Not Allowed");
}
