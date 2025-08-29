import { getState } from "./_store";

export default function handler(req, res){
  const { gps } = getState();
  res.status(200).json({ ok: true, gps });
}
