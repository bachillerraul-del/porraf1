# Porra F1 – Vercel (API + Frontend)

App mínima de porra F1 desplegable en **Vercel** con:
- **Frontend Next.js** (pages router)
- **Backend en Vercel (Serverless API Routes)** que **calcula automáticamente los puntos**
- Persistencia **opcional** con **Vercel Blob** (si no configuras token, usa memoria volátil)

## Reglas de puntuación
- Acierto exacto: **5 pts**
- Error ±1 posición: **3 pts**
- Error ±2 posiciones: **1 pt**
- Piloto del Día acertado: **+5 pts**

## Endpoints
- `GET /api/gps` → lista de Grandes Premios
- `GET /api/predictions?gpId=...` → lista de pronósticos (por GP)
- `POST /api/predictions` → crear pronóstico
- `GET /api/results?gpId=...` → resultados oficiales (por GP)
- `POST /api/results` → guardar/actualizar resultados oficiales
- `GET /api/standings?gpId=...` → clasificación calculada (puntos)

## Deploy rápido (sin base de datos)
1. Sube este repo a **GitHub**.
2. Entra en **vercel.com → New Project → Import GitHub Repo**.
3. Deploy. (El almacenamiento por defecto es **en memoria**).

## Persistencia con Vercel Blob (opcional)
1. En Vercel: **Storage → Blob** → crea un token **Read/Write**.
2. En tu proyecto: **Settings → Environment Variables**:
   - `BLOB_READ_WRITE_TOKEN` = *tu token*
3. Redeploy. La app guardará `predictions.json` y `results.json` en Blob.

> Si el token no está configurado, la app usa memoria volátil de la función serverless.

## Desarrollo local
```bash
npm install
npm run dev
# http://localhost:5173
```

## Estructura
```
pages/
  index.js            # Frontend
  api/
    gps.js
    predictions.js
    results.js
    standings.js
lib/
  store.js            # Capa de persistencia (Blob o memoria)
public/
  favicon.ico
```
