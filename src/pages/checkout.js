import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/context/AppStoreContext';
import { formatCurrency } from '@/utils/appHelpers';

const initialAddress = {
  fullName: '',
  phone: '+92',
  city: 'Narowal',
  area: '',
  addressLine: '',
};

export default function CheckoutPage() {
  const router = useRouter();
  const { isCustomer, cartItems, cartSubtotal, placeOrder, currentUser } = useAppStore();

  const [address, setAddress] = useState(initialAddress);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!isCustomer) {
      router.replace('/login?next=/checkout');
      return;
    }

    if (!cartItems.length) {
      router.replace('/cart');
      return;
    }

    setAddress((prev) => ({
      ...prev,
      fullName: currentUser?.name || '',
      phone: currentUser?.phone || '+92',
    }));
  }, [cartItems.length, currentUser?.name, currentUser?.phone, isCustomer, router]);

  if (!isCustomer) {
    return null;
  }

  const delivery = cartSubtotal > 5000 ? 0 : 250;
  const total = cartSubtotal + delivery;

  const onSubmit = async (event) => {
    event.preventDefault();

    const response = await placeOrder({
      address,
      notes,
      paymentMethod: 'cash_on_delivery',
    });

    setStatus(response.message);

    if (response.success) {
      setTimeout(() => router.push('/orders'), 1200);
    }
  };

  return (
    <>
      <Head>
        <title>Checkout | Rohan Rice</title>
      </Head>

      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-6">
          <form className="lg:col-span-2 card-premium" onSubmit={onSubmit}>
            <h1 className="text-3xl font-serif font-bold text-charcoal">Checkout</h1>
            <p className="text-sm text-gray-600 mt-2">Complete your order details below.</p>

            {status && (
              <div className="mt-4 rounded-md px-3 py-2 bg-rice-green-50 border border-rice-green-200 text-rice-green-800 text-sm">
                {status}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-3 mt-5">
              <div>
                <label className="block text-sm font-semibold mb-1">Full Name</label>
                <input
                  className="input-field"
                  value={address.fullName}
                  onChange={(event) => setAddress((prev) => ({ ...prev, fullName: event.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Phone</label>
                <input
                  className="input-field"
                  value={address.phone}
                  onChange={(event) => setAddress((prev) => ({ ...prev, phone: event.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">City</label>
                <input
                  className="input-field"
                  value={address.city}
                  onChange={(event) => setAddress((prev) => ({ ...prev, city: event.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Area</label>
                <input
                  className="input-field"
                  value={address.area}
                  onChange={(event) => setAddress((prev) => ({ ...prev, area: event.target.value }))}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold mb-1">Address</label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={address.addressLine}
                  onChange={(event) => setAddress((prev) => ({ ...prev, addressLine: event.target.value }))}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold mb-1">Order Notes (optional)</label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary mt-5">
              Place Order
            </button>
          </form>

          <aside className="card-premium h-fit">
            <h2 className="text-xl font-semibold">Summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>{formatCurrency(item.lineTotal)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-rice-beige-200 pt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(cartSubtotal)}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span>{formatCurrency(delivery)}</span></div>
              <div className="flex justify-between font-semibold"><span>Total</span><span>{formatCurrency(total)}</span></div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

