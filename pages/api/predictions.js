import { addPrediction, getState } from "../../lib/store";
import { verifyToken } from "../../lib/auth";

function uuid() {
  return "xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = Math.random()*16|0, v = c === "x" ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

export default async function handler(req, res){
  if (req.method === "GET") {
    const { gpId, usuario } = req.query;
    const { predictions } = await getState();
    let list = predictions;
    if (gpId && typeof gpId === "string") list = list.filter(p => p.gpId === gpId);
    if (usuario && typeof usuario === "string") list = list.filter(p => p.usuario === usuario);
    return res.status(200).json({ ok: true, predictions: list });
  }
  if (req.method === "POST") {
    try {
      const token = req.cookies.auth;
      const payload = await verifyToken(token);
      const b = req.body || {};
      if (!b.gpId) return res.status(400).json({ ok:false, error:"gpId requerido" });
      const p = {
        id: uuid(),
        usuario: payload.name,
        gpId: b.gpId,
        qualy: Array.isArray(b.qualy) ? b.qualy.slice(0,3) : [],
        carrera: Array.isArray(b.carrera) ? b.carrera.slice(0,5) : [],
        pilotoDelDia: b.pilotoDelDia ?? undefined,
        createdAt: Date.now()
      };
      await addPrediction(p);
      return res.status(200).json({ ok:true, id:p.id });
    } catch {
      return res.status(401).json({ ok:false, error:"auth inválida" });
    }
  }
  res.setHeader("Allow", "GET, POST");
  res.status(405).end("Method Not Allowed");
}
