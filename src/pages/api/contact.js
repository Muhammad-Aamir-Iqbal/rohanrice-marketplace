// pages/api/contact.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, company, email, phone, subject, message } = req.body;

  // Validate required fields
  if (!name || !company || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // TODO: Send email via nodemailer or SES
    // Save to database
    
    console.log('Contact inquiry:', {
      name,
      company,
      email,
      phone,
      subject,
      message,
      timestamp: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: 'Inquiry received. We will contact you within 24 hours.',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ error: 'Failed to submit inquiry' });
  }
}
