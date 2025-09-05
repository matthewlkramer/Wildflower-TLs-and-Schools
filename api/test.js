export default async function handler(req, res) {
  res.status(200).json({ ok: true, url: req.url, method: req.method, note: 'test function reachable' });
}

