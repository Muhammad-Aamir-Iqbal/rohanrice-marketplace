// pages/api/auth/verify-otp.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP required' });
  }

  // TODO: Verify OTP against database
  // For now, accept any 6-digit code
  if (otp.length === 6) {
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
    return res.status(200).json({
      token,
      user: {
        email,
        name: 'OTP User',
        isAdmin: false,
      },
    });
  }

  return res.status(401).json({ error: 'Invalid OTP' });
}

