import Head from 'next/head';
import AdminRouteGuard from '@/components/AdminRouteGuard';
import { useAppStore } from '@/context/AppStoreContext';
import { formatCurrency, formatDate } from '@/utils/appHelpers';

const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const { data, updateOrderStatus } = useAppStore();

  const handleStatusChange = async (orderId, status) => {
    await updateOrderStatus(orderId, status);
  };

  return (
    <AdminRouteGuard>
      <Head>
        <title>Admin Orders | Rohan Rice</title>
      </Head>

      <section className="card-premium">
        <h1 className="text-2xl font-serif font-bold">Manage Orders</h1>
        <p className="text-sm text-gray-600 mt-1">Update order status and monitor sales operations.</p>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-rice-beige-200">
                <th className="py-2">Order</th>
                <th className="py-2">Customer</th>
                <th className="py-2">Items</th>
                <th className="py-2">Total</th>
                <th className="py-2">Date</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.orders.map((order) => (
                <tr key={order.id} className="border-b border-rice-beige-100">
                  <td className="py-2 pr-3 font-semibold">{order.orderNumber}</td>
                  <td className="py-2 pr-3">
                    <p>{order.customerName}</p>
                    <p className="text-xs text-gray-500">{order.customerEmail}</p>
                  </td>
                  <td className="py-2 pr-3">
                    {order.items.map((item) => (
                      <p key={item.id} className="text-xs">{item.productName} x {item.quantity}</p>
                    ))}
                  </td>
                  <td className="py-2 pr-3 font-semibold text-rice-green-700">{formatCurrency(order.totalAmount)}</td>
                  <td className="py-2 pr-3 text-xs text-gray-500">{formatDate(order.createdAt)}</td>
                  <td className="py-2">
                    <select
                      className="input-field text-sm"
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

