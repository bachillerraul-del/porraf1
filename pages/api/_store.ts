export type GP = { id: string; nombre: string; fecha: string };
export type Prediction = {
  id: string;
  usuario: string;
  gpId: string;
  qualy: string[];
  carrera: string[];
  pilotoDelDia?: string;
  createdAt: number;
};
export type Resultados = {
  gpId: string;
  qualyOficial: string[];
  carreraOficial: string[];
  pilotoDelDia?: string;
  updatedAt: number;
};

const _state = {
  gps: <GP[]>[
    { id: "nld-2025", nombre: "GP Países Bajos", fecha: "2025-08-31T15:00:00+02:00" },
    { id: "ita-2025", nombre: "GP de Italia", fecha: "2025-09-07T15:00:00+02:00" }
  ],
  predictions: <Prediction[]>[],
  results: <Resultados[]>[]
};

export function getState() { return _state; }
export function upsertResultados(r: Resultados) {
  const i = _state.results.findIndex(x => x.gpId === r.gpId);
  if (i >= 0) _state.results[i] = r; else _state.results.push(r);
}
export function addPrediction(p: Prediction) {
  _state.predictions.push(p);
}