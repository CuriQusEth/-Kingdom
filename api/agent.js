export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      name: "Kingdom Sable Orchestrator",
      status: "active",
      wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
      platform: "Kingdom Sable",
      version: "1.0.0"
    });
  }

  if (req.method === 'POST') {
    try {
      const body = req.body;
      return res.status(200).json({
        status: "success",
        message: "Agent endpoint received POST request",
        agent: "Kingdom Sable Orchestrator",
        data: body
      });
    } catch (error) {
       return res.status(400).json({ error: "Invalid request" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
