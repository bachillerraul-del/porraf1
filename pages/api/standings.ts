import type { NextApiRequest, NextApiResponse } from "next";
import { getState } from "./_store";

function puntosPosicion(arrOficial: string[], pred: string[], n: number) {
  let pts = 0;
  for (let i = 0; i < n; i++) {
    const piloto = pred[i];
    const idxOficial = arrOficial.findIndex(x => x === piloto);
    if (idxOficial === -1) continue;
    const diff = Math.abs(idxOficial - i);
    if (diff === 0) pts += 5;
    else if (diff === 1) pts += 3;
    else if (diff === 2) pts += 1;
  }
  return pts;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { gpId } = req.query;
  if (!gpId || typeof gpId !== "string") {
    return res.status(400).json({ ok:false, error:"gpId requerido" });
  }
  const { predictions, results } = getState();
  const r = results.find(x => x.gpId === gpId);
  if (!r) return res.status(200).json({ ok:true, standings: [], note:"Sin resultados aún" });

  const lista = predictions.filter(p => p.gpId === gpId);
  const tabla = lista.map(p => {
    const q = puntosPosicion(r.qualyOficial, p.qualy, 3);
    const c = puntosPosicion(r.carreraOficial, p.carrera, 5);
    const extra = (r.pilotoDelDia && p.pilotoDelDia && r.pilotoDelDia === p.pilotoDelDia) ? 5 : 0;
    return {
      usuario: p.usuario,
      puntos: q + c + extra,
      desglose: { qualy: q, carrera: c, pilotoDelDia: extra },
      prediction: p
    };
  }).sort((a,b)=> b.puntos - a.puntos);

  res.status(200).json({ ok:true, standings: tabla, updatedAt: r.updatedAt });
}