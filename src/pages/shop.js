import Head from 'next/head';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppStore } from '@/context/AppStoreContext';
import { formatCurrency, getCategoryNameById } from '@/utils/appHelpers';

export default function ShopPage() {
  const router = useRouter();
  const { data, isCustomer, addToCart } = useAppStore();

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [feedback, setFeedback] = useState('');

  const filteredProducts = useMemo(() => {
    let items = [...data.products];

    if (categoryFilter !== 'all') {
      items = items.filter((item) => item.categoryId === categoryFilter);
    }

    if (priceFilter === 'under400') {
      items = items.filter((item) => item.pricePerKg < 400);
    }
    if (priceFilter === '400to600') {
      items = items.filter((item) => item.pricePerKg >= 400 && item.pricePerKg <= 600);
    }
    if (priceFilter === 'above600') {
      items = items.filter((item) => item.pricePerKg > 600);
    }

    if (sortBy === 'priceLow') items.sort((a, b) => a.pricePerKg - b.pricePerKg);
    if (sortBy === 'priceHigh') items.sort((a, b) => b.pricePerKg - a.pricePerKg);
    if (sortBy === 'rating') items.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'latest') items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return items;
  }, [categoryFilter, data.products, priceFilter, sortBy]);

  const handleAddToCart = (productId) => {
    if (!isCustomer) {
      router.push('/login?next=/shop');
      return;
    }

    const result = addToCart(productId, 1);
    setFeedback(result.message);
    setTimeout(() => setFeedback(''), 2000);
  };

  return (
    <>
      <Head>
        <title>Shop Rice Online Pakistan | Rohan Rice</title>
        <meta
          name="description"
          content="Buy basmati rice online Pakistan from Rohan Rice. Explore premium rice categories with transparent pricing and stock availability."
        />
        <meta
          name="keywords"
          content="buy basmati rice online Pakistan, premium rice supplier in Punjab, best rice for biryani Pakistan"
        />
      </Head>

      <section className="bg-gradient-premium py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-serif font-bold text-charcoal">Rohan Rice Shop</h1>
          <p className="text-gray-700 mt-3 max-w-3xl">
            Welcome to the Rohan Rice Shop, where you can explore a variety of carefully selected rice products.
            Our platform offers high-quality rice varieties that meet strict standards of quality and freshness.
            Each product is clearly categorized to help customers easily find the rice that best suits their needs.
          </p>
          <p className="text-rice-green-800 font-semibold mt-4">Quality you can see in every grain.</p>
        </div>
      </section>

      <section className="py-8 bg-white border-b border-rice-beige-200 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="input-field">
              <option value="all">All Categories</option>
              {data.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select value={priceFilter} onChange={(event) => setPriceFilter(event.target.value)} className="input-field">
              <option value="all">All Prices</option>
              <option value="under400">Under Rs 400 / kg</option>
              <option value="400to600">Rs 400 - Rs 600 / kg</option>
              <option value="above600">Above Rs 600 / kg</option>
            </select>

            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="input-field">
              <option value="latest">Newest</option>
              <option value="priceLow">Price Low to High</option>
              <option value="priceHigh">Price High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            <div className="bg-rice-beige-50 border border-rice-beige-200 rounded-lg px-4 py-2 text-sm flex items-center">
              Showing {filteredProducts.length} products
            </div>
          </div>

          {feedback && (
            <div className="mt-3 rounded-md px-3 py-2 bg-rice-green-50 border border-rice-green-200 text-rice-green-800 text-sm">
              {feedback}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-rice-beige-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <article key={product.id} className="card-premium">
                <div className="h-36 rounded-md bg-rice-beige-100 border border-rice-beige-200 flex items-center justify-center text-rice-green-800 text-sm font-semibold px-3 text-center">
                  {product.image ? <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded" /> : product.name}
                </div>

                <p className="text-xs text-rice-gold-700 mt-3 font-semibold">
                  {getCategoryNameById(data.categories, product.categoryId)}
                </p>
                <h2 className="text-xl font-semibold mt-1">{product.name}</h2>
                <p className="text-sm text-gray-600 mt-2">{product.description}</p>

                <div className="mt-3 flex justify-between text-sm">
                  <p className="font-bold text-rice-green-700">{formatCurrency(product.pricePerKg)}/kg</p>
                  <p className="text-gray-500">Stock: {product.stockQuantity} kg</p>
                </div>
                <p className="text-xs text-rice-gold-700 mt-1">
                  Rating: {product.rating ? `${product.rating}/5` : 'No ratings yet'}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Link href={`/product/${product.id}`} className="btn-secondary text-center px-3 py-2 text-sm">
                    Details
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product.id)}
                    className="btn-primary px-3 py-2 text-sm"
                  >
                    {isCustomer ? 'Add to Cart' : 'Login to Cart'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

