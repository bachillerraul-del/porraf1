import { addPrediction, getState } from "./_store";

function uuid() {
  return "xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = Math.random()*16|0, v = c === "x" ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

export default function handler(req, res){
  if (req.method === "GET") {
    const { gpId, usuario } = req.query;
    const { predictions } = getState();
    let list = predictions;
    if (gpId && typeof gpId === "string") list = list.filter(p => p.gpId === gpId);
    if (usuario && typeof usuario === "string") list = list.filter(p => p.usuario === usuario);
    return res.status(200).json({ ok: true, predictions: list });
  }
  if (req.method === "POST") {
    const b = req.body || {};
    if (!b.usuario || !b.gpId) {
      return res.status(400).json({ ok:false, error:"usuario y gpId son obligatorios" });
    }
    const p = {
      id: uuid(),
      usuario: String(b.usuario).slice(0,40),
      gpId: b.gpId,
      qualy: Array.isArray(b.qualy) ? b.qualy.slice(0,3) : [],
      carrera: Array.isArray(b.carrera) ? b.carrera.slice(0,5) : [],
      pilotoDelDia: b.pilotoDelDia ?? undefined,
      createdAt: Date.now()
    };
    addPrediction(p);
    return res.status(200).json({ ok:true, id:p.id });
  }
  res.setHeader("Allow", "GET, POST");
  res.status(405).end("Method Not Allowed");
}
