import { getPilots, setPilots } from "../../lib/store";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const pilots = await getPilots();
    return res.status(200).json({ ok: true, pilots });
  }
  if (req.method === "PUT") {
    const { list } = req.body || {};
    if (!Array.isArray(list)) return res.status(400).json({ ok:false, error:"list[] requerido" });
    await setPilots(list.map(String));
    return res.status(200).json({ ok:true });
  }
  res.setHeader("Allow", "GET, PUT");
  res.status(405).end("Method Not Allowed");
}
