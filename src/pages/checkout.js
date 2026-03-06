import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/context/AppStoreContext';
import { fileToDataUrl, formatCurrency } from '@/utils/appHelpers';

const initialAddress = {
  fullName: '',
  phone: '+92',
  city: 'Narowal',
  area: '',
  addressLine: '',
};

export default function CheckoutPage() {
  const router = useRouter();
  const { isCustomer, cartItems, cartSubtotal, placeOrder, currentUser, data } = useAppStore();

  const [address, setAddress] = useState(initialAddress);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [transactionId, setTransactionId] = useState('');
  const [senderPhone, setSenderPhone] = useState('+92');
  const [paymentProofImage, setPaymentProofImage] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

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
    setSenderPhone(currentUser?.phone || '+92');
  }, [cartItems.length, currentUser?.name, currentUser?.phone, isCustomer, router]);

  if (!isCustomer) {
    return null;
  }

  const delivery = cartSubtotal > 5000 ? 0 : 250;
  const total = cartSubtotal + delivery;

  const easyPaisaNumber = data.settings?.easyPaisaNumber || 'Not configured';
  const jazzCashNumber = data.settings?.jazzCashNumber || 'Not configured';
  const easyPaisaQrImage = data.settings?.easyPaisaQrImage || '';
  const jazzCashQrImage = data.settings?.jazzCashQrImage || '';

  const handleProofUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const image = await fileToDataUrl(file);
    setPaymentProofImage(image);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const response = await placeOrder({
      address,
      notes,
      paymentMethod,
      transactionId,
      senderPhone,
      paymentProofImage,
    });

    setStatus(response.message);

    if (response.success) {
      setTimeout(() => router.push('/orders'), 1200);
    }
    setLoading(false);
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
            <p className="text-sm text-gray-600 mt-2">Complete your delivery details and choose a secure payment method.</p>

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
                <textarea className="input-field" rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} />
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-rice-beige-200 bg-rice-beige-50 p-4">
              <h2 className="text-lg font-semibold text-charcoal">Payment Method</h2>
              <p className="text-xs text-gray-600 mt-1">Cash on Delivery or manual wallet payment with admin verification.</p>

              <div className="mt-3 grid sm:grid-cols-3 gap-2">
                <label className={`rounded-lg border p-3 cursor-pointer ${paymentMethod === 'cash_on_delivery' ? 'border-rice-green-500 bg-white' : 'border-rice-beige-200 bg-white/70'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash_on_delivery"
                    checked={paymentMethod === 'cash_on_delivery'}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                    className="mr-2"
                  />
                  Cash on Delivery
                </label>
                <label className={`rounded-lg border p-3 cursor-pointer ${paymentMethod === 'easypaisa' ? 'border-rice-green-500 bg-white' : 'border-rice-beige-200 bg-white/70'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="easypaisa"
                    checked={paymentMethod === 'easypaisa'}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                    className="mr-2"
                  />
                  EasyPaisa
                </label>
                <label className={`rounded-lg border p-3 cursor-pointer ${paymentMethod === 'jazzcash' ? 'border-rice-green-500 bg-white' : 'border-rice-beige-200 bg-white/70'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="jazzcash"
                    checked={paymentMethod === 'jazzcash'}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                    className="mr-2"
                  />
                  JazzCash
                </label>
              </div>

              {paymentMethod !== 'cash_on_delivery' && (
                <div className="mt-4 rounded-lg border border-rice-green-200 bg-white p-4">
                  <p className="text-sm font-semibold text-rice-green-800">Send payment to:</p>
                  <p className="text-sm text-gray-700 mt-1">EasyPaisa: {easyPaisaNumber}</p>
                  <p className="text-sm text-gray-700">JazzCash: {jazzCashNumber}</p>

                  <div className="mt-3 grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Transaction ID</label>
                      <input className="input-field" value={transactionId} onChange={(event) => setTransactionId(event.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Sender Phone</label>
                      <input className="input-field" value={senderPhone} onChange={(event) => setSenderPhone(event.target.value)} required />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold mb-1">Upload Payment Screenshot</label>
                      <input type="file" accept="image/*" className="input-field" onChange={handleProofUpload} required />
                      {paymentProofImage && (
                        <img src={paymentProofImage} alt="Payment proof" className="mt-2 w-24 h-24 rounded-lg border object-cover" />
                      )}
                    </div>
                    {((paymentMethod === 'easypaisa' && easyPaisaQrImage) || (paymentMethod === 'jazzcash' && jazzCashQrImage)) && (
                      <div className="sm:col-span-2">
                        <p className="text-xs text-gray-600 mb-2">Scan QR</p>
                        <img
                          src={paymentMethod === 'easypaisa' ? easyPaisaQrImage : jazzCashQrImage}
                          alt={`${paymentMethod} QR`}
                          className="w-28 h-28 rounded border border-rice-beige-200"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button type="submit" className="btn-primary mt-5" disabled={loading}>
              {loading ? 'Placing Order...' : 'Place Order'}
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
