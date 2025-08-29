export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    message: "Healthy",
    time: new Date().toISOString(),
    region: process.env.VERCEL_REGION || null,
    commit: process.env.VERCEL_GIT_COMMIT_SHA || null,
    url: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
  });
}
