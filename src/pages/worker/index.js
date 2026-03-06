import Head from 'next/head';
import { useMemo, useState } from 'react';
import WorkerRouteGuard from '@/components/WorkerRouteGuard';
import { useAppStore } from '@/context/AppStoreContext';
import { fileToDataUrl, formatCurrency, formatDate } from '@/utils/appHelpers';

export default function WorkerDashboardPage() {
  const { data, markOrderDelivered, markOrderPaid, uploadPaymentProof } = useAppStore();
  const [status, setStatus] = useState('');
  const [proofState, setProofState] = useState({});

  const todayKey = new Date().toISOString().slice(0, 10);
  const todaysDeliveries = useMemo(
    () => data.orders.filter((order) => order.createdAt?.slice(0, 10) === todayKey || ['OUT_FOR_DELIVERY', 'DELIVERED', 'PAID'].includes(order.orderStatus)),
    [data.orders, todayKey]
  );

  const setOrderProof = (orderId, updates) => {
    setProofState((prev) => ({
      ...prev,
      [orderId]: {
        ...(prev[orderId] || { transactionId: '', senderPhone: '+92', paymentProofImage: '' }),
        ...updates,
      },
    }));
  };

  const handleProofImage = async (orderId, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setOrderProof(orderId, { paymentProofImage: dataUrl });
  };

  const handleUploadProof = async (order) => {
    const proof = proofState[order.id] || {};
    const response = await uploadPaymentProof({
      orderId: order.id,
      paymentMethod: order.paymentMethod,
      transactionId: proof.transactionId,
      senderPhone: proof.senderPhone,
      paymentProofImage: proof.paymentProofImage,
    });
    setStatus(response.message || '');
    setTimeout(() => setStatus(''), 1800);
  };

  const handleMarkDelivered = async (orderId) => {
    const response = await markOrderDelivered(orderId);
    setStatus(response.message || '');
    setTimeout(() => setStatus(''), 1800);
  };

  const handleMarkPaid = async (order) => {
    const proof = proofState[order.id] || {};
    const response = await markOrderPaid({
      orderId: order.id,
      paymentProofImage: proof.paymentProofImage || '',
      transactionId: proof.transactionId || '',
      senderPhone: proof.senderPhone || '',
      complete: true,
    });
    setStatus(response.message || '');
    setTimeout(() => setStatus(''), 2000);
  };

  return (
    <WorkerRouteGuard>
      <Head>
        <title>Worker Dashboard | Rohan Rice</title>
      </Head>

      <section className="space-y-5">
        <article className="card-premium">
          <h1 className="text-2xl font-serif font-bold">Today&apos;s Deliveries</h1>
          <p className="text-sm text-gray-600 mt-1">View assigned orders, contact customer, mark delivered, upload proof, and mark paid.</p>
          {status && (
            <div className="mt-4 rounded-md px-3 py-2 bg-rice-green-50 border border-rice-green-200 text-rice-green-800 text-sm">
              {status}
            </div>
          )}
        </article>

        {todaysDeliveries.map((order) => {
          const proof = proofState[order.id] || { transactionId: '', senderPhone: '+92', paymentProofImage: '' };
          return (
            <article key={order.id} className="card-premium">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Order {order.orderNumber}</h2>
                  <p className="text-sm text-gray-600">{order.customerName} | {order.address?.city}, {order.address?.area}</p>
                  <p className="text-sm text-gray-600">Placed: {formatDate(order.createdAt)}</p>
                  <p className="text-sm text-rice-green-700 font-semibold mt-1">{formatCurrency(order.totalAmount)}</p>
                  <p className="text-xs text-gray-500 mt-1">Status: {order.orderStatus}</p>
                </div>
                <a href={`tel:${order.address?.phone || order.customerPhone || ''}`} className="btn-secondary text-sm px-4 py-2 h-fit">
                  Call Customer
                </a>
              </div>

              <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <button type="button" className="btn-secondary text-sm" onClick={() => void handleMarkDelivered(order.id)}>
                  Mark Delivered
                </button>
                <input
                  className="input-field text-sm"
                  placeholder="Transaction ID"
                  value={proof.transactionId}
                  onChange={(event) => setOrderProof(order.id, { transactionId: event.target.value })}
                />
                <input
                  className="input-field text-sm"
                  placeholder="Sender Phone"
                  value={proof.senderPhone}
                  onChange={(event) => setOrderProof(order.id, { senderPhone: event.target.value })}
                />
                <input type="file" className="input-field text-sm" accept="image/*" onChange={(event) => void handleProofImage(order.id, event)} />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" className="btn-secondary text-sm px-4 py-2" onClick={() => void handleUploadProof(order)}>
                  Upload Payment Proof
                </button>
                <button type="button" className="btn-primary text-sm px-4 py-2" onClick={() => void handleMarkPaid(order)}>
                  Mark Paid
                </button>
              </div>
            </article>
          );
        })}

        {!todaysDeliveries.length && (
          <article className="card-premium">
            <p className="text-gray-600">No deliveries assigned right now.</p>
          </article>
        )}
      </section>
    </WorkerRouteGuard>
  );
}
