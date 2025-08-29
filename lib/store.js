import { put, list } from "@vercel/blob";

// Generic blob helpers
async function loadFromBlob(name, fallback) {
  const { blobs } = await list({ prefix: `porra/${name}.json` });
  if (!blobs.length) return fallback;
  const url = blobs[0].url;
  const r = await fetch(url);
  return r.ok ? await r.json() : fallback;
}
async function saveToBlob(name, data) {
  await put(`porra/${name}.json`, JSON.stringify(data, null, 2), {
    access: "public",
    contentType: "application/json; charset=utf-8"
  });
}

// Participants
export async function getParticipants() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return [];
  return await loadFromBlob("participants", []);
}
export async function setParticipants(list) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  await saveToBlob("participants", list);
  return true;
}

// Pilots
export async function getPilots() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return [];
  return await loadFromBlob("pilots", []);
}
export async function setPilots(list) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  await saveToBlob("pilots", Array.from(new Set(list.map(String))));
  return true;
}

// Predictions/Results
export async function getState() {
  // include a basic GP list
  const fallback = {
    gps: [
      { id: "nld-2025", nombre: "GP Países Bajos", fecha: "2025-08-31T15:00:00+02:00" },
      { id: "ita-2025", nombre: "GP de Italia",     fecha: "2025-09-07T15:00:00+02:00" },
      { id: "aze-2025", nombre: "GP de Azerbaiyán", fecha: "2025-09-21T13:00:00+02:00" }
    ],
    predictions: [],
    results: []
  };
  return await loadFromBlob("state", fallback);
}
export async function saveState(state) {
  await saveToBlob("state", state);
}
export async function addPrediction(pred) {
  const s = await getState();
  s.predictions.push(pred);
  await saveState(s);
}
export async function upsertResultados(record) {
  const s = await getState();
  const i = s.results.findIndex(x => x.gpId === record.gpId);
  if (i >= 0) s.results[i] = record; else s.results.push(record);
  await saveState(s);
}
