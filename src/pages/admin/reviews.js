import Head from 'next/head';
import AdminRouteGuard from '@/components/AdminRouteGuard';
import { useAppStore } from '@/context/AppStoreContext';
import { formatDate } from '@/utils/appHelpers';

export default function AdminReviewsPage() {
  const { data, approveReview, deleteReview } = useAppStore();

  return (
    <AdminRouteGuard>
      <Head>
        <title>Admin Reviews | Rohan Rice</title>
      </Head>

      <section className="card-premium">
        <h1 className="text-2xl font-serif font-bold">Reviews Moderation</h1>
        <p className="text-sm text-gray-600 mt-1">Approve, reject, or delete customer reviews.</p>

        <div className="mt-5 space-y-3">
          {data.reviews.map((review) => {
            const productName = data.products.find((product) => product.id === review.productId)?.name || 'Deleted Product';
            return (
              <article key={review.id} className="border border-rice-beige-200 rounded-md p-3 bg-rice-beige-50">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                  <div>
                    <p className="font-semibold">{productName}</p>
                    <p className="text-xs text-gray-500">
                      By {review.customerName} on {formatDate(review.createdAt)}
                    </p>
                  </div>
                  <p className="text-xs text-rice-gold-700">{'*'.repeat(review.rating)}</p>
                </div>

                <p className="text-sm text-gray-700 mt-2">{review.comment}</p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {review.isApproved ? (
                    <button type="button" className="btn-secondary text-xs px-3 py-1" onClick={() => approveReview(review.id, false)}>
                      Unapprove
                    </button>
                  ) : (
                    <button type="button" className="btn-primary text-xs px-3 py-1" onClick={() => approveReview(review.id, true)}>
                      Approve
                    </button>
                  )}

                  <button
                    type="button"
                    className="px-3 py-1 text-xs rounded bg-red-50 text-red-700 border border-red-200"
                    onClick={() => deleteReview(review.id)}
                  >
                    Delete
                  </button>

                  <span className={`px-2 py-1 text-xs rounded ${review.isApproved ? 'bg-rice-green-100 text-rice-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {review.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </div>
              </article>
            );
          })}

          {!data.reviews.length && <p className="text-sm text-gray-500">No reviews available yet.</p>}
        </div>
      </section>
    </AdminRouteGuard>
  );
}

