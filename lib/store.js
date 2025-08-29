// Capa de datos: Vercel Blob si hay token; si no, memoria en caliente.
import { put, list } from "@vercel/blob";

const MEMORY = { predictions: [], results: [] };

// Lista de GPs de ejemplo (puedes editar)
export const GPS = [
  { id: "nld-2025", nombre: "GP Países Bajos", fecha: "2025-08-31T15:00:00+02:00" },
  { id: "ita-2025", nombre: "GP de Italia",     fecha: "2025-09-07T15:00:00+02:00" },
  { id: "aze-2025", nombre: "GP de Azerbaiyán", fecha: "2025-09-21T13:00:00+02:00" }
];

function blobEnabled() {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

async function loadFromBlob(name, fallback) {
  try {
    const { blobs } = await list({ prefix: `porra/${name}.json` });
    if (!blobs.length) return fallback;
    const url = blobs[0].url;
    const res = await fetch(url);
    if (!res.ok) return fallback;
    return await res.json();
  } catch {
    return fallback;
  }
}

async function saveToBlob(name, data) {
  try {
    await put(`porra/${name}.json`, JSON.stringify(data, null, 2), {
      access: "public",
      contentType: "application/json; charset=utf-8"
    });
    return true;
  } catch {
    return false;
  }
}

// API pública del store
export async function getState() {
  if (blobEnabled()) {
    const predictions = await loadFromBlob("predictions", []);
    const results = await loadFromBlob("results", []);
    return { gps: GPS, predictions, results, mode: "blob" };
  }
  return { gps: GPS, predictions: MEMORY.predictions, results: MEMORY.results, mode: "memory" };
}

export async function addPrediction(p) {
  if (blobEnabled()) {
    const predictions = await loadFromBlob("predictions", []);
    predictions.push(p);
    await saveToBlob("predictions", predictions);
    return;
  }
  MEMORY.predictions.push(p);
}

export async function upsertResultados(r) {
  if (blobEnabled()) {
    const results = await loadFromBlob("results", []);
    const i = results.findIndex(x => x.gpId === r.gpId);
    if (i >= 0) results[i] = r; else results.push(r);
    await saveToBlob("results", results);
    return;
  }
  const i = MEMORY.results.findIndex(x => x.gpId === r.gpId);
  if (i >= 0) MEMORY.results[i] = r; else MEMORY.results.push(r);
}
