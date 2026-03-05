import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAppStore } from '@/context/AppStoreContext';
import { formatCurrency } from '@/utils/appHelpers';

export default function CartPage() {
  const router = useRouter();
  const {
    isCustomer,
    cartItems,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
  } = useAppStore();

  useEffect(() => {
    if (!isCustomer) {
      router.replace('/login?next=/cart');
    }
  }, [isCustomer, router]);

  if (!isCustomer) {
    return null;
  }

  const delivery = cartSubtotal > 5000 ? 0 : 250;
  const total = cartSubtotal + delivery;

  return (
    <>
      <Head>
        <title>Cart | Rohan Rice</title>
      </Head>

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-serif font-bold text-charcoal">Your Cart</h1>

          {!cartItems.length ? (
            <div className="card-premium mt-6 text-center">
              <p className="text-gray-600">Your cart is empty.</p>
              <Link href="/shop" className="btn-primary inline-block mt-4">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <article key={item.id} className="card-premium">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold">{item.product.name}</h2>
                        <p className="text-sm text-gray-600">{formatCurrency(item.product.pricePerKg)}/kg</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="btn-secondary px-3 py-2"
                          onClick={() => {
                            void updateCartQuantity(item.productId, item.quantity - 1);
                          }}
                        >
                          -
                        </button>
                        <span className="min-w-10 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          className="btn-secondary px-3 py-2"
                          onClick={() => {
                            void updateCartQuantity(item.productId, item.quantity + 1);
                          }}
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-rice-green-700">{formatCurrency(item.lineTotal)}</p>
                        <button
                          type="button"
                          className="text-xs text-red-600 hover:text-red-700 mt-1"
                          onClick={() => {
                            void removeFromCart(item.productId);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                ))}

                <button
                  type="button"
                  className="btn-ghost text-sm"
                  onClick={() => {
                    void clearCart();
                  }}
                >
                  Clear Cart
                </button>
              </div>

              <aside className="card-premium h-fit">
                <h2 className="text-xl font-semibold">Order Summary</h2>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>{formatCurrency(delivery)}</span>
                  </div>
                  <div className="border-t border-rice-beige-200 pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
                <Link href="/checkout" className="btn-primary w-full text-center mt-5">
                  Proceed to Checkout
                </Link>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

