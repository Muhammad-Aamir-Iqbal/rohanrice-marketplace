import Head from 'next/head';
import AdminRouteGuard from '@/components/AdminRouteGuard';
import { useAppStore } from '@/context/AppStoreContext';
import { formatDate } from '@/utils/appHelpers';

export default function AdminCustomersPage() {
  const { data } = useAppStore();

  return (
    <AdminRouteGuard>
      <Head>
        <title>Admin Customers | Rohan Rice</title>
      </Head>

      <section className="card-premium">
        <h1 className="text-2xl font-serif font-bold">Customers</h1>
        <p className="text-sm text-gray-600 mt-1">View registered customer accounts and profile info.</p>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-rice-beige-200">
                <th className="py-2">Customer</th>
                <th className="py-2">Email</th>
                <th className="py-2">Phone</th>
                <th className="py-2">Joined</th>
                <th className="py-2">Orders</th>
              </tr>
            </thead>
            <tbody>
              {data.customers.map((customer) => {
                const orderCount = data.orders.filter((order) => order.customerId === customer.id).length;

                return (
                  <tr key={customer.id} className="border-b border-rice-beige-100">
                    <td className="py-2 pr-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-rice-beige-100 border border-rice-beige-200 overflow-hidden flex items-center justify-center text-xs">
                          {customer.profileImage ? (
                            <img src={customer.profileImage} alt={customer.name} className="w-full h-full object-cover" />
                          ) : (
                            customer.name?.slice(0, 1)?.toUpperCase() || 'C'
                          )}
                        </div>
                        <span className="font-semibold">{customer.name}</span>
                      </div>
                    </td>
                    <td className="py-2 pr-3">{customer.email}</td>
                    <td className="py-2 pr-3">{customer.phone}</td>
                    <td className="py-2 pr-3 text-xs text-gray-500">{formatDate(customer.createdAt)}</td>
                    <td className="py-2 pr-3">{orderCount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!data.customers.length && <p className="text-sm text-gray-500 py-4">No customers registered yet.</p>}
        </div>
      </section>
    </AdminRouteGuard>
  );
}

