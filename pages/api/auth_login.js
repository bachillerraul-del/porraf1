import { getParticipants } from "../../../lib/store";
import { checkPin, signToken } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST"); return res.status(405).end();
  }
  const { name, pin } = req.body || {};
  if (!name || !pin) return res.status(400).json({ ok:false, error:"name y pin requeridos" });

  const participants = await getParticipants();
  const user = participants.find(u => u.name.toLowerCase() === String(name).toLowerCase());
  if (!user || !checkPin(user.hash, user.salt, pin)) {
    return res.status(401).json({ ok:false, error:"Credenciales inválidas" });
  }

  const token = await signToken({ sub: user.id, name: user.name, role: user.role });
  res.setHeader("Set-Cookie", [
    `auth=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60*60*24*30}`
  ]);
  return res.status(200).json({ ok:true, user: { id:user.id, name:user.name, role:user.role } });
}
