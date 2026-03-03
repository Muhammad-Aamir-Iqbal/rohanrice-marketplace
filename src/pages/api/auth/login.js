// pages/api/auth/login.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  // TODO: Replace with actual database authentication
  if (email && password) {
    // Simulate successful login
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
    return res.status(200).json({
      token,
      user: {
        email,
        name: 'Test User',
        isAdmin: email.includes('admin'),
      },
    });
  }

  return res.status(401).json({ error: 'Invalid credentials' });
}
