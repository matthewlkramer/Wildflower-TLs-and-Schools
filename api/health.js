export default async function handler(_req, res) {
  res.status(200).json({ ok: true, service: 'wftls-api', ts: new Date().toISOString() });
}

