import Head from 'next/head';
import AdminRouteGuard from '@/components/AdminRouteGuard';
import { useAppStore } from '@/context/AppStoreContext';
import { formatCurrency, formatDate } from '@/utils/appHelpers';

export default function AdminLedgerPage() {
  const { data } = useAppStore();

  const productsById = data.products.reduce((acc, product) => {
    acc[product.id] = product;
    return acc;
  }, {});

  const workersById = data.workers.reduce((acc, worker) => {
    acc[worker.id] = worker;
    return acc;
  }, {});

  return (
    <AdminRouteGuard>
      <Head>
        <title>Ledger | Rohan Rice Admin</title>
      </Head>

      <section className="card-premium">
        <h1 className="text-2xl font-serif font-bold">Immutable Ledger</h1>
        <p className="text-sm text-gray-600 mt-1">All sales and stock events are append-only and fraud-auditable.</p>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-rice-beige-200">
                <th className="py-2">Date</th>
                <th className="py-2">Type</th>
                <th className="py-2">Product</th>
                <th className="py-2">Quantity</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Order ID</th>
                <th className="py-2">Worker</th>
              </tr>
            </thead>
            <tbody>
              {data.ledger.map((entry) => (
                <tr key={entry.id} className="border-b border-rice-beige-100">
                  <td className="py-2 pr-3 text-xs text-gray-500">{formatDate(entry.createdAt)}</td>
                  <td className="py-2 pr-3 uppercase text-xs font-semibold text-rice-green-700">{entry.type}</td>
                  <td className="py-2 pr-3">{productsById[entry.productId]?.name || entry.productId}</td>
                  <td className="py-2 pr-3">{entry.quantity} kg</td>
                  <td className="py-2 pr-3 font-semibold">{formatCurrency(entry.amount)}</td>
                  <td className="py-2 pr-3 text-xs">{entry.orderId || '-'}</td>
                  <td className="py-2 pr-3">{workersById[entry.workerId]?.name || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!data.ledger.length && <p className="text-sm text-gray-500 py-4">No ledger entries generated yet.</p>}
        </div>
      </section>
    </AdminRouteGuard>
  );
}
