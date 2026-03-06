import Head from 'next/head';
import AdminRouteGuard from '@/components/AdminRouteGuard';
import { useAppStore } from '@/context/AppStoreContext';
import { formatCurrency, formatDate } from '@/utils/appHelpers';

const statuses = [
  'PENDING_PAYMENT',
  'PENDING_PAYMENT_VERIFICATION',
  'CONFIRMED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'PAID',
  'COMPLETED',
  'CANCELLED',
];

export default function AdminOrdersPage() {
  const { data, updateOrderStatus, assignWorkerToOrder } = useAppStore();

  const workersById = data.workers.reduce((acc, worker) => {
    acc[worker.id] = worker;
    return acc;
  }, {});

  const handleStatusChange = async (orderId, status) => {
    await updateOrderStatus(orderId, status);
  };

  const handleAssignWorker = async (orderId, workerId) => {
    if (!workerId) return;
    await assignWorkerToOrder(orderId, workerId);
  };

  return (
    <AdminRouteGuard>
      <Head>
        <title>Admin Orders | Rohan Rice</title>
      </Head>

      <section className="card-premium">
        <h1 className="text-2xl font-serif font-bold">Orders Control Center</h1>
        <p className="text-sm text-gray-600 mt-1">Assign workers, track payment states, and move orders through delivery lifecycle.</p>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-rice-beige-200">
                <th className="py-2">Order</th>
                <th className="py-2">Customer</th>
                <th className="py-2">Payment</th>
                <th className="py-2">Total</th>
                <th className="py-2">Worker</th>
                <th className="py-2">Date</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.orders.map((order) => (
                <tr key={order.id} className="border-b border-rice-beige-100 align-top">
                  <td className="py-2 pr-3">
                    <p className="font-semibold">{order.orderNumber}</p>
                    <div className="text-xs text-gray-500 space-y-1 mt-1">
                      {order.items.slice(0, 2).map((item) => (
                        <p key={item.id}>{item.productName} x {item.quantity}</p>
                      ))}
                      {order.items.length > 2 && <p>+{order.items.length - 2} more items</p>}
                    </div>
                  </td>
                  <td className="py-2 pr-3">
                    <p>{order.customerName}</p>
                    <p className="text-xs text-gray-500">{order.customerEmail}</p>
                  </td>
                  <td className="py-2 pr-3">
                    <p className="capitalize">{order.paymentMethod.replace(/_/g, ' ')}</p>
                  </td>
                  <td className="py-2 pr-3 font-semibold text-rice-green-700">{formatCurrency(order.totalAmount)}</td>
                  <td className="py-2 pr-3">
                    <select
                      className="input-field text-sm min-w-40"
                      value={order.workerId || ''}
                      onChange={(event) => {
                        void handleAssignWorker(order.id, event.target.value);
                      }}
                    >
                      <option value="">Assign Worker</option>
                      {data.workers
                        .filter((worker) => worker.status === 'active')
                        .map((worker) => (
                          <option key={worker.id} value={worker.id}>
                            {worker.name}
                          </option>
                        ))}
                    </select>
                    {order.workerId && (
                      <p className="text-xs text-gray-500 mt-1">{workersById[order.workerId]?.phone || ''}</p>
                    )}
                  </td>
                  <td className="py-2 pr-3 text-xs text-gray-500">{formatDate(order.createdAt)}</td>
                  <td className="py-2">
                    <select
                      className="input-field text-sm min-w-48"
                      value={order.orderStatus}
                      onChange={(event) => {
                        void handleStatusChange(order.id, event.target.value);
                      }}
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!data.orders.length && <p className="text-sm text-gray-500 py-4">No orders received yet.</p>}
        </div>
      </section>
    </AdminRouteGuard>
  );
}
