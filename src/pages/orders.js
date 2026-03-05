import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { useAppStore } from '@/context/AppStoreContext';
import { formatCurrency, formatDate } from '@/utils/appHelpers';

export default function OrdersPage() {
  const router = useRouter();
  const { isCustomer, currentUser, data } = useAppStore();

  useEffect(() => {
    if (!isCustomer) {
      router.replace('/login?next=/orders');
    }
  }, [isCustomer, router]);

  const orders = useMemo(
    () => data.orders.filter((order) => order.customerId === currentUser?.id),
    [currentUser?.id, data.orders]
  );

  if (!isCustomer) return null;

  return (
    <>
      <Head>
        <title>My Orders | Rohan Rice</title>
      </Head>

      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-serif font-bold text-charcoal">My Orders</h1>

          {!orders.length ? (
            <div className="card-premium mt-6">
              <p className="text-gray-600">You have not placed any order yet.</p>
            </div>
          ) : (
            <div className="space-y-4 mt-6">
              {orders.map((order) => (
                <article key={order.id} className="card-premium">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div>
                      <h2 className="text-lg font-semibold">Order {order.orderNumber}</h2>
                      <p className="text-sm text-gray-600">Placed on {formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-rice-green-700 font-semibold">{formatCurrency(order.totalAmount)}</p>
                      <p className="text-xs text-gray-500 capitalize">Status: {order.orderStatus}</p>
                    </div>
                  </div>

                  <div className="mt-3 border-t border-rice-beige-200 pt-3 space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="text-sm flex justify-between">
                        <span>{item.productName} x {item.quantity}</span>
                        <span>{formatCurrency(item.lineTotal)}</span>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

