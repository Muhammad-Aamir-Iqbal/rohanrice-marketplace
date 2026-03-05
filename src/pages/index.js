import Head from 'next/head';
import Link from 'next/link';
import { useMemo } from 'react';
import { useAppStore } from '@/context/AppStoreContext';
import { getCategoryNameById, formatCurrency, formatDate } from '@/utils/appHelpers';

const fallbackReviews = [
  {
    id: 'f1',
    customerName: 'Aamir Hassan',
    rating: 5,
    comment: 'Excellent aroma and very clean grain quality. Highly recommended.',
  },
  {
    id: 'f2',
    customerName: 'Sadia Noor',
    rating: 5,
    comment: 'Consistent quality for home cooking. Delivery and packaging were also very good.',
  },
  {
    id: 'f3',
    customerName: 'Usman Raza',
    rating: 4,
    comment: 'Reliable supplier. We use it regularly for family and guest meals.',
  },
];

export default function HomePage() {
  const { data } = useAppStore();
  const heroTagline = data.settings?.heroTagline || 'Premium Rice From the Heart of Punjab.';

  const featuredProducts = useMemo(
    () => data.products.filter((product) => product.isFeatured).slice(0, 4),
    [data.products]
  );

  const reviewItems = useMemo(() => {
    const approved = data.reviews
      .filter((review) => review.isApproved)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (approved.length) return approved.slice(0, 3);
    return fallbackReviews;
  }, [data.reviews]);

  const latestPosts = useMemo(
    () => data.blogPosts.filter((post) => post.status === 'published').slice(0, 3),
    [data.blogPosts]
  );

  return (
    <>
      <Head>
        <title>Rohan Rice | Premium Rice From the Heart of Punjab</title>
        <meta
          name="description"
          content="Rohan Rice is a trusted rice supplier in Narowal, Punjab, Pakistan. Buy premium rice online with quality assurance and reliable service."
        />
        <meta
          name="keywords"
          content="Premium rice Pakistan, Basmati rice Pakistan, Buy rice online Pakistan, Rice supplier Punjab, Narowal rice supplier"
        />
      </Head>

      <section className="bg-gradient-premium py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="inline-flex px-3 py-1 text-xs rounded-full bg-rice-gold-100 text-rice-gold-800 font-semibold mb-4">
              {heroTagline}
            </p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-charcoal leading-tight">
              {heroTagline}
            </h1>
            <p className="mt-4 text-gray-700 text-lg">
              Rohan Rice brings carefully selected rice varieties from trusted sources to your kitchen.
              Every grain represents quality, purity, and the agricultural richness of Punjab.
            </p>
            <p className="mt-4 text-gray-700">
              Welcome to Rohan Rice, a trusted rice supplier dedicated to providing premium-quality rice to customers who value taste, aroma, and purity.
              Located in Narowal, Punjab, our business is inspired by the strong agricultural heritage of the region.
              Whether you are buying rice for your home or your business, we ensure every order meets strict standards of quality and freshness.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/shop" className="btn-primary px-6 py-3">
                Shop Now
              </Link>
              <Link href="/about" className="btn-secondary px-6 py-3">
                Learn More
              </Link>
            </div>
            <p className="mt-5 text-rice-green-800 font-semibold">Pure Grains. Honest Trade. Trusted Quality.</p>
          </div>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-3 mb-8">
            <div>
              <h2 className="text-3xl font-serif font-bold text-charcoal">Featured Rice Products</h2>
              <p className="text-gray-600 mt-2">
                Discover our premium rice varieties carefully selected for their aroma, texture, and cooking excellence.
              </p>
            </div>
            <Link href="/shop" className="text-rice-green-700 font-semibold hover:text-rice-green-900">
              View All
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map((product) => (
              <article key={product.id} className="card-premium">
                <div className="h-32 rounded-md bg-rice-beige-100 border border-rice-beige-200 flex items-center justify-center text-rice-green-700 text-sm font-semibold px-3 text-center">
                  {product.image ? <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded" /> : product.name}
                </div>
                <p className="text-xs text-rice-gold-700 mt-3 font-semibold">
                  {getCategoryNameById(data.categories, product.categoryId)}
                </p>
                <h3 className="text-lg font-semibold mt-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">{product.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <p className="font-bold text-rice-green-700">{formatCurrency(product.pricePerKg)}/kg</p>
                  <p className="text-xs text-gray-500">Stock: {product.stockQuantity} kg</p>
                </div>
                <Link href={`/product/${product.id}`} className="btn-secondary w-full mt-4 text-center">
                  View Details
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-rice-beige-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-charcoal text-center">Why Choose Rohan Rice</h2>
          <div className="grid md:grid-cols-3 gap-5 mt-8">
            <article className="card">
              <h3 className="text-lg font-semibold">High Quality Rice</h3>
              <p className="mt-2 text-sm text-gray-600">
                We carefully select rice varieties known for their excellent taste and consistency.
              </p>
            </article>
            <article className="card">
              <h3 className="text-lg font-semibold">Trusted Business</h3>
              <p className="mt-2 text-sm text-gray-600">
                Rohan Rice is committed to honest trade and reliable service.
              </p>
            </article>
            <article className="card">
              <h3 className="text-lg font-semibold">Customer Satisfaction</h3>
              <p className="mt-2 text-sm text-gray-600">
                We prioritize the needs and trust of our customers in every order.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-charcoal">Rice Categories</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {data.categories.map((category) => (
              <div key={category.id} className="border border-rice-beige-200 rounded-lg p-4 bg-rice-beige-50">
                <p className="font-semibold text-rice-green-800">{category.name}</p>
                <p className="text-sm text-gray-600 mt-1">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-rice-beige-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-charcoal">What Our Customers Say</h2>
          <p className="text-gray-600 mt-2 max-w-2xl">
            Customer satisfaction is the foundation of our business. Read reviews from customers who trust Rohan Rice for their daily needs.
          </p>

          <div className="grid md:grid-cols-3 gap-5 mt-8">
            {reviewItems.map((review) => (
              <article key={review.id} className="card">
                <p className="text-rice-gold-600 text-sm">{'*'.repeat(review.rating || 5)}</p>
                <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
                <p className="mt-3 text-sm font-semibold text-rice-green-800">{review.customerName}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-3 mb-8">
            <div>
              <h2 className="text-3xl font-serif font-bold text-charcoal">Latest Blog Posts</h2>
              <p className="text-gray-600 mt-2">From field knowledge to kitchen excellence.</p>
            </div>
            <Link href="/blog" className="text-rice-green-700 font-semibold hover:text-rice-green-900">
              Read Blog
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {latestPosts.map((post) => (
              <article key={post.id} className="card-premium">
                <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
                <h3 className="text-lg mt-2">{post.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className="inline-block mt-4 text-rice-green-700 font-semibold hover:text-rice-green-900">
                  Read More
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-gradient-rice text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold">Need help with your rice order?</h2>
          <p className="mt-3 opacity-95">
            Contact us anytime for product guidance, pricing, and bulk inquiries. Your satisfaction is our priority.
          </p>
          <Link href="/contact" className="mt-6 inline-block bg-white text-rice-green-700 font-semibold px-6 py-3 rounded-lg hover:bg-rice-beige-100">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}

