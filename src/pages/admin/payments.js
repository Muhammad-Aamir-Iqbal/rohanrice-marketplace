import Head from 'next/head';
import { useState } from 'react';
import AdminRouteGuard from '@/components/AdminRouteGuard';
import { useAppStore } from '@/context/AppStoreContext';
import { formatCurrency, formatDate } from '@/utils/appHelpers';

export default function AdminPaymentsPage() {
  const { data, verifyPayment } = useAppStore();
  const [status, setStatus] = useState('');

  const ordersById = data.orders.reduce((acc, order) => {
    acc[order.id] = order;
    return acc;
  }, {});

  const pendingPayments = data.payments.filter((payment) => payment.verificationStatus === 'pending');

  const handleApprove = async (paymentId) => {
    const response = await verifyPayment(paymentId, true);
    setStatus(response.message || '');
    setTimeout(() => setStatus(''), 1800);
  };

  const handleReject = async (paymentId) => {
    const reason = window.prompt('Enter rejection reason', 'Payment details did not match.');
    const response = await verifyPayment(paymentId, false, reason || 'Payment details did not match.');
    setStatus(response.message || '');
    setTimeout(() => setStatus(''), 1800);
  };

  return (
    <AdminRouteGuard>
      <Head>
        <title>Payment Verification | Rohan Rice Admin</title>
      </Head>

      <section className="space-y-5">
        <article className="card-premium">
          <h1 className="text-2xl font-serif font-bold">Pending Payments</h1>
          <p className="text-sm text-gray-600 mt-1">Approve or reject EasyPaisa/JazzCash screenshots before order confirmation.</p>
          {status && (
            <div className="mt-4 rounded-md px-3 py-2 bg-rice-green-50 border border-rice-green-200 text-rice-green-800 text-sm">
              {status}
            </div>
          )}
        </article>

        <article className="card-premium">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rice-beige-200 text-left">
                  <th className="py-2">Order ID</th>
                  <th className="py-2">Customer</th>
                  <th className="py-2">Method</th>
                  <th className="py-2">Amount</th>
                  <th className="py-2">Transaction ID</th>
                  <th className="py-2">Screenshot</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingPayments.map((payment) => {
                  const order = ordersById[payment.orderId];
                  return (
                    <tr key={payment.id} className="border-b border-rice-beige-100">
                      <td className="py-2 pr-3">{order?.orderNumber || payment.orderId}</td>
                      <td className="py-2 pr-3">
                        <p>{order?.customerName || '-'}</p>
                        <p className="text-xs text-gray-500">{payment.senderPhone || '-'}</p>
                      </td>
                      <td className="py-2 pr-3 capitalize">{payment.paymentMethod}</td>
                      <td className="py-2 pr-3 font-semibold text-rice-green-700">{formatCurrency(payment.amount)}</td>
                      <td className="py-2 pr-3">
                        <p>{payment.transactionId || '-'}</p>
                        <p className="text-xs text-gray-500">{formatDate(payment.createdAt)}</p>
                      </td>
                      <td className="py-2 pr-3">
                        {payment.paymentProofImage ? (
                          <a
                            href={payment.paymentProofImage}
                            target="_blank"
                            rel="noreferrer"
                            className="text-rice-green-700 hover:text-rice-green-900 underline"
                          >
                            View
                          </a>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="py-2 pr-3">
                        <div className="flex gap-2">
                          <button type="button" className="px-3 py-1 text-xs rounded bg-rice-green-600 text-white hover:bg-rice-green-700" onClick={() => void handleApprove(payment.id)}>
                            Approve
                          </button>
                          <button type="button" className="px-3 py-1 text-xs rounded bg-red-50 text-red-700 border border-red-200 hover:bg-red-100" onClick={() => void handleReject(payment.id)}>
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!pendingPayments.length && <p className="text-sm text-gray-500 py-4">No payments pending verification.</p>}
          </div>
        </article>

        <article className="card-premium">
          <h2 className="text-lg font-semibold">Recent Payment History</h2>
          <div className="mt-3 space-y-2 text-sm">
            {data.payments.slice(0, 12).map((payment) => (
              <div key={payment.id} className="flex flex-wrap gap-2 justify-between border-b border-rice-beige-100 pb-2">
                <p>{ordersById[payment.orderId]?.orderNumber || payment.orderId}</p>
                <p className="capitalize">{payment.paymentMethod}</p>
                <p>{formatCurrency(payment.amount)}</p>
                <p className="uppercase text-xs text-rice-green-700">{payment.verificationStatus}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </AdminRouteGuard>
  );
}
