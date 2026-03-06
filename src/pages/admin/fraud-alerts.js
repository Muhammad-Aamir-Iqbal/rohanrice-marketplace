import Head from 'next/head';
import AdminRouteGuard from '@/components/AdminRouteGuard';
import { useAppStore } from '@/context/AppStoreContext';
import { formatDate } from '@/utils/appHelpers';

const alertStatuses = ['open', 'investigating', 'resolved'];

export default function AdminFraudAlertsPage() {
  const { data, updateFraudAlertStatus } = useAppStore();

  const workersById = data.workers.reduce((acc, worker) => {
    acc[worker.id] = worker;
    return acc;
  }, {});

  const ordersById = data.orders.reduce((acc, order) => {
    acc[order.id] = order;
    return acc;
  }, {});

  return (
    <AdminRouteGuard>
      <Head>
        <title>Fraud Alerts | Rohan Rice Admin</title>
      </Head>

      <section className="card-premium">
        <h1 className="text-2xl font-serif font-bold">Fraud Alerts</h1>
        <p className="text-sm text-gray-600 mt-1">Review suspicious worker/payment behavior and resolve alerts.</p>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-rice-beige-200">
                <th className="py-2">Date</th>
                <th className="py-2">Type</th>
                <th className="py-2">Order</th>
                <th className="py-2">Worker</th>
                <th className="py-2">Details</th>
                <th className="py-2">Severity</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.fraudAlerts.map((alert) => (
                <tr key={alert.id} className="border-b border-rice-beige-100">
                  <td className="py-2 pr-3 text-xs text-gray-500">{formatDate(alert.createdAt)}</td>
                  <td className="py-2 pr-3 text-xs uppercase font-semibold text-red-700">{alert.type}</td>
                  <td className="py-2 pr-3">{ordersById[alert.orderId]?.orderNumber || '-'}</td>
                  <td className="py-2 pr-3">{workersById[alert.workerId]?.name || '-'}</td>
                  <td className="py-2 pr-3 max-w-sm">{alert.details}</td>
                  <td className="py-2 pr-3">
                    <span className={`px-2 py-1 text-xs rounded ${
                      alert.severity === 'high' ? 'bg-red-50 text-red-700 border border-red-200' :
                      alert.severity === 'medium' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                      'bg-rice-beige-100 text-rice-beige-900'
                    }`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="py-2 pr-3">
                    <select
                      className="input-field text-sm min-w-32"
                      value={alert.status}
                      onChange={(event) => {
                        void updateFraudAlertStatus(alert.id, event.target.value);
                      }}
                    >
                      {alertStatuses.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!data.fraudAlerts.length && <p className="text-sm text-gray-500 py-4">No fraud alerts detected.</p>}
        </div>
      </section>
    </AdminRouteGuard>
  );
}
