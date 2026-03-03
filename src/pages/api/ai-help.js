// pages/api/ai-help.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  // TODO: Integrate with Algolia or OpenAI
  // For now, return mock responses
  const responses = {
    varieties: 'We offer 6 premium rice varieties: Basmati, 1121 Basmati, Super Kernel, IRRI-6, Sella, and Brown Rice. Each certified and export-ready.',
    stock: 'Current total stock across all varieties: 1000+ tons. Specific stock levels available on the marketplace page.',
    bulk: 'Bulk orders start from 100kg (varies by variety). Call our sales team for custom quantities and competitive pricing.',
    shipping: 'We ship internationally to 50+ countries. Standard shipping via ocean freight (FCL/LCL) with full documentation support.',
    certifications: 'All rice is ISO 9001, FDA approved, and FSSC 22000 certified. Selected varieties have organic certification.',
  };

  const keywords = Object.keys(responses);
  let answer = 'How can we help you with RohanRice? Ask about varieties, stock, bulk orders, shipping, or certifications.';

  for (const keyword of keywords) {
    if (query.toLowerCase().includes(keyword)) {
      answer = responses[keyword];
      break;
    }
  }

  return res.status(200).json({
    answer,
    source: 'RohanRice Knowledge Base',
  });
}
