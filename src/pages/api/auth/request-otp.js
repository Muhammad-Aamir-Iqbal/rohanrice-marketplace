// pages/api/auth/request-otp.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // TODO: Generate OTP and send via email service
  // For now, return success
  return res.status(200).json({
    message: 'OTP sent to email',
    debug: 'In production, check your email for the OTP code',
  });
}

