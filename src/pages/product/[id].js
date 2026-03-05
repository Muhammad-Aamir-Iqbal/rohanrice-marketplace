import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '@/context/AppStoreContext';
import { formatCurrency, getCategoryNameById, formatDate } from '@/utils/appHelpers';

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const {
    data,
    isCustomer,
    addToCart,
    addReview,
    logVisitorEvent,
  } = useAppStore();

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [feedback, setFeedback] = useState('');

  const product = useMemo(
    () => data.products.find((item) => item.id === id),
    [data.products, id]
  );

  const reviews = useMemo(
    () => data.reviews.filter((review) => review.productId === id && review.isApproved),
    [data.reviews, id]
  );

  useEffect(() => {
    if (!id) return;
    logVisitorEvent({
      page: `/product/${id}`,
      action: 'product_view',
      details: { productId: id },
    });
  }, [id, logVisitorEvent]);

  if (!product) {
    return (
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-serif font-bold text-charcoal">Product not found</h1>
          <Link href="/shop" className="inline-block mt-5 btn-primary">
            Back to Shop
          </Link>
        </div>
      </section>
    );
  }

  const categoryName = getCategoryNameById(data.categories, product.categoryId);

  const handleAddToCart = () => {
    if (!isCustomer) {
      router.push(`/login?next=/product/${product.id}`);
      return;
    }

    const result = addToCart(product.id, 1);
    setFeedback(result.message);
    setTimeout(() => setFeedback(''), 2200);
  };

  const handleReviewSubmit = (event) => {
    event.preventDefault();

    if (!isCustomer) {
      router.push(`/login?next=/product/${product.id}`);
      return;
    }

    const result = addReview({
      productId: product.id,
      rating: Number(reviewRating),
      comment: reviewComment.trim(),
    });

    setFeedback(result.message);

    if (result.success) {
      setReviewComment('');
      setReviewRating(5);
    }

    setTimeout(() => setFeedback(''), 2600);
  };

  return (
    <>
      <Head>
        <title>{product.name} | Rohan Rice</title>
        <meta name="description" content={product.description} />
      </Head>

      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500 mb-4">
            <Link href="/shop" className="hover:text-rice-green-700">Shop</Link> / {product.name}
          </p>

          <div className="grid lg:grid-cols-2 gap-8">
            <article className="card-premium">
              <div className="h-72 rounded-md bg-rice-beige-100 border border-rice-beige-200 flex items-center justify-center text-rice-green-800 font-semibold px-3 text-center">
                {product.image ? <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded" /> : product.name}
              </div>

              <h2 className="text-xl font-semibold mt-6">Customer Reviews</h2>
              {reviews.length ? (
                <div className="mt-3 space-y-3">
                  {reviews.map((review) => (
                    <div key={review.id} className="border border-rice-beige-200 rounded-lg p-3 bg-rice-beige-50">
                      <p className="text-xs text-rice-gold-700">{'*'.repeat(review.rating)}</p>
                      <p className="text-sm text-gray-700 mt-1">{review.comment}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {review.customerName} - {formatDate(review.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-3">No approved reviews yet.</p>
              )}
            </article>

            <article className="card-premium">
              <p className="text-xs font-semibold text-rice-gold-700">{categoryName}</p>
              <h1 className="text-3xl font-serif font-bold text-charcoal mt-1">{product.name}</h1>
              <p className="text-gray-700 mt-3">{product.description}</p>

              <div className="mt-5 grid sm:grid-cols-2 gap-3">
                <div className="bg-rice-beige-50 border border-rice-beige-200 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Price per kg</p>
                  <p className="font-bold text-rice-green-700">{formatCurrency(product.pricePerKg)}</p>
                </div>
                <div className="bg-rice-beige-50 border border-rice-beige-200 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Stock availability</p>
                  <p className="font-bold text-rice-green-700">{product.stockQuantity} kg</p>
                </div>
                <div className="bg-rice-beige-50 border border-rice-beige-200 rounded-lg p-3 sm:col-span-2">
                  <p className="text-xs text-gray-500">Rating</p>
                  <p className="font-bold text-rice-green-700">
                    {product.reviewCount ? `${product.rating}/5 (${product.reviewCount} reviews)` : 'No ratings yet'}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <button type="button" onClick={handleAddToCart} className="btn-primary">
                  {isCustomer ? 'Add to Cart' : 'Login to Add to Cart'}
                </button>
                <Link href="/cart" className="btn-secondary">
                  Go to Cart
                </Link>
              </div>

              {feedback && (
                <div className="mt-3 rounded-md px-3 py-2 bg-rice-green-50 border border-rice-green-200 text-rice-green-800 text-sm">
                  {feedback}
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="mt-8 border-t border-rice-beige-200 pt-6">
                <h2 className="text-xl font-semibold">Write a Review</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Submit your star rating and review. Admin approval is required before public display.
                </p>

                <div className="mt-3">
                  <label className="block text-sm font-semibold mb-1">Star Rating</label>
                  <select
                    value={reviewRating}
                    onChange={(event) => setReviewRating(event.target.value)}
                    className="input-field"
                  >
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={2}>2 Stars</option>
                    <option value={1}>1 Star</option>
                  </select>
                </div>

                <div className="mt-3">
                  <label className="block text-sm font-semibold mb-1">Review</label>
                  <textarea
                    className="input-field"
                    rows={4}
                    value={reviewComment}
                    onChange={(event) => setReviewComment(event.target.value)}
                    required
                    placeholder="Share your cooking experience and quality feedback"
                  />
                </div>

                <button type="submit" className="btn-primary mt-4">
                  {isCustomer ? 'Submit Review' : 'Login to Review'}
                </button>
              </form>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}

