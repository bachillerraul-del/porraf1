import { verifyToken } from "../../../lib/auth";

export default async function handler(req, res) {
  const cookie = req.headers.cookie || "";
  const match = cookie.match(/(?:^|; )auth=([^;]+)/);
  if (!match) return res.status(200).json({ ok:false, user:null });
  try {
    const payload = await verifyToken(decodeURIComponent(match[1]));
    return res.status(200).json({ ok:true, user: { id:payload.sub, name:payload.name, role:payload.role } });
  } catch {
    return res.status(200).json({ ok:false, user:null });
  }
}
