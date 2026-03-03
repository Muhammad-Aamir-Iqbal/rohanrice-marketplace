// pages/robots.txt.js
function robots() {
  // robots.txt is handled at build time
}

export async function getServerSideProps({ res }) {
  const robots = `User-agent: *
Allow: /
Allow: /shop
Allow: /about
Allow: /goals
Allow: /contact
Disallow: /admin
Disallow: /api
Disallow: /*.json$
Disallow: /api/*

Sitemap: https://rohanrice.com/sitemap.xml

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /
`;

  res.setHeader('Content-Type', 'text/plain');
  res.write(robots);
  res.end();

  return {
    props: {},
  };
}

export default robots;
