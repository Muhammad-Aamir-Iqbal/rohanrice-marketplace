// src/utils/seo.js
export const SEO = {
  title: "RohanRice - Premium Rice Export Marketplace | Global Reach",
  description: "Premium rice export marketplace connecting certified rice farms with global buyers. Trusted by 500+ businesses in 50+ countries.",
  keywords: "basmati rice, premium rice exporter, global rice supplier, certified rice, rice export marketplace, bulk rice orders",
  author: "RohanRice Marketplace",
  type: "website",
  image: "/og-image.jpg",
  url: "https://rohanrice.com",
};

export const createMetaTags = (pageTitle, pageDescription, pageImage = SEO.image) => ({
  title: pageTitle || SEO.title,
  description: pageDescription || SEO.description,
  openGraph: {
    title: pageTitle || SEO.title,
    description: pageDescription || SEO.description,
    image: pageImage,
    type: "website",
    url: SEO.url,
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle || SEO.title,
    description: pageDescription || SEO.description,
    image: pageImage,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
});

export const structuredData = {
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RohanRice",
    url: SEO.url,
    logo: "/logo.png",
    description: SEO.description,
    sameAs: [
      "https://twitter.com/rohanrice",
      "https://linkedin.com/company/rohanrice",
      "https://facebook.com/rohanrice",
    ],
  },
  business: {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "RohanRice",
    image: "/og-image.jpg",
    description: SEO.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: "RohanRice Export House",
      addressLocality: "Punjab",
      addressCountry: "IN",
    },
    telephone: "+91-XXXXXXXXXX",
    email: "exports@rohanrice.com",
    priceRange: "$$ - $$$",
  },
  product: {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Premium Basmati Rice",
    description: "Superior long-grain basmati rice with exceptional aroma",
    image: "/rice-image.jpg",
    brand: {
      "@type": "Brand",
      name: "RohanRice",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: "0.75",
      highPrice: "1.35",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "500",
    },
  },
};
