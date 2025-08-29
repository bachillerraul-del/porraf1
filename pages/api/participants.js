import { createSalt, hashPin } from "../../lib/auth";
import { setParticipants, getParticipants } from "../../lib/store";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const list = await getParticipants();
    return res.status(200).json({ ok: true, participants: list.map(p => ({ id:p.id, name:p.name, role:p.role })) });
  }
  if (req.method === "PUT") {
    const { list } = req.body || {};
    if (!Array.isArray(list) || !list.length) {
      return res.status(400).json({ ok:false, error:"list[] requerido" });
    }
    const final = list.map((u, i) => {
      const salt = createSalt();
      const hash = hashPin(u.pin, salt);
      return {
        id: `u${i+1}`,
        name: String(u.name),
        role: u.role === "admin" ? "admin" : "user",
        salt,
        hash
      };
    });
    await setParticipants(final);
    return res.status(200).json({ ok:true, count: final.length });
  }
  res.setHeader("Allow", "GET, PUT");
  res.status(405).end("Method Not Allowed");
}
