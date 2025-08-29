import { put, list } from "@vercel/blob";

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

export async function getParticipants() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return [];
  return await loadFromBlob("participants", []);
}
export async function setParticipants(list) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  await saveToBlob("participants", list);
  return true;
}

export async function getState() {
  return await loadFromBlob("state", { gps:[], predictions:[], results:[] });
}
export async function saveState(state) {
  await saveToBlob("state", state);
}
export async function addPrediction(pred) {
  const s = await getState();
  s.predictions.push(pred);
  await saveState(s);
}
