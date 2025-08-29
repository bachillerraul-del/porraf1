import { getState } from "../../lib/store";

export default async function handler(req, res){
  const { gps, mode } = await getState();
  res.status(200).json({ ok: true, gps, storage: mode });
}
