// Simple in-memory store (lost on cold starts)
const state = {
  gps: [
    { id: "nld-2025", nombre: "GP Países Bajos", fecha: "2025-08-31T15:00:00+02:00" },
    { id: "ita-2025", nombre: "GP de Italia",     fecha: "2025-09-07T15:00:00+02:00" }
  ],
  predictions: [],
  results: []
};

export function getState(){ return state; }

export function upsertResultados(r){
  const i = state.results.findIndex(x => x.gpId === r.gpId);
  if (i >= 0) state.results[i] = r; else state.results.push(r);
}

export function addPrediction(p){
  state.predictions.push(p);
}
