import type { NextApiRequest, NextApiResponse } from "next";
import { getState } from "./_store";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { gps } = getState();
  res.status(200).json({ ok: true, gps });
}