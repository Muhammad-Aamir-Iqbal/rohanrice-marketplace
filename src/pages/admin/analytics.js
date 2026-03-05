import Head from 'next/head';
import AdminRouteGuard from '@/components/AdminRouteGuard';
import { useAppStore } from '@/context/AppStoreContext';
import { getDailyVisitors, getPopularPages, getPopularProducts, formatDate } from '@/utils/appHelpers';

export default function AdminAnalyticsPage() {
  const { data } = useAppStore();

  const daily = getDailyVisitors(data.visitorLogs, 14);
  const popularPages = getPopularPages(data.visitorLogs);
  const popularProducts = getPopularProducts(data.orders, data.products);

  const maxDaily = Math.max(...daily.map((entry) => entry.visitors), 1);

  return (
    <AdminRouteGuard>
      <Head>
        <title>Visitor Analytics | Rohan Rice</title>
      </Head>

      <section className="space-y-6">
        <article className="card-premium">
          <h1 className="text-2xl font-serif font-bold">Visitor Analytics</h1>
          <p className="text-sm text-gray-600 mt-1">Daily visitors, page visits, and user navigation history.</p>

          <div className="mt-5 grid grid-cols-7 gap-2 items-end h-44">
            {daily.map((entry) => (
              <div key={entry.dateKey} className="flex flex-col items-center justify-end h-full">
                <div
                  className="w-full bg-rice-green-600 rounded-t"
                  style={{ height: `${Math.max(8, (entry.visitors / maxDaily) * 100)}%` }}
                />
                <p className="text-[10px] text-gray-500 mt-1">{entry.dateKey.slice(5)}</p>
              </div>
            ))}
          </div>
        </article>

        <div className="grid lg:grid-cols-2 gap-6">
          <article className="card-premium">
            <h2 className="text-xl font-semibold">Most Visited Pages</h2>
            <div className="mt-4 space-y-2 text-sm">
              {popularPages.map((page) => (
                <div key={page.page} className="flex justify-between border-b border-rice-beige-200 pb-1">
                  <span>{page.page}</span>
                  <span className="font-semibold text-rice-green-700">{page.count}</span>
                </div>
              ))}
              {!popularPages.length && <p className="text-gray-500">No page visits yet.</p>}
            </div>
          </article>

          <article className="card-premium">
            <h2 className="text-xl font-semibold">Popular Products</h2>
            <div className="mt-4 space-y-2 text-sm">
              {popularProducts.map((item) => (
                <div key={item.productId} className="flex justify-between border-b border-rice-beige-200 pb-1">
                  <span>{item.name}</span>
                  <span className="font-semibold text-rice-green-700">{item.qty} kg</span>
                </div>
              ))}
              {!popularProducts.length && <p className="text-gray-500">No product activity yet.</p>}
            </div>
          </article>
        </div>

        <article className="card-premium">
          <h2 className="text-xl font-semibold">User Navigation History</h2>
          <p className="text-xs text-gray-500 mt-1">Example events: user visited shop page, viewed product, added to cart, completed order.</p>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-rice-beige-200">
                  <th className="py-2">Date</th>
                  <th className="py-2">Visitor</th>
                  <th className="py-2">Role</th>
                  <th className="py-2">Page</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.visitorLogs.slice(0, 120).map((log) => (
                  <tr key={log.id} className="border-b border-rice-beige-100">
                    <td className="py-2 pr-3 text-xs text-gray-500">{formatDate(log.createdAt)}</td>
                    <td className="py-2 pr-3 text-xs">{log.visitorId?.slice(-6)}</td>
                    <td className="py-2 pr-3 capitalize">{log.userRole}</td>
                    <td className="py-2 pr-3">{log.page}</td>
                    <td className="py-2 pr-3">{log.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!data.visitorLogs.length && <p className="text-sm text-gray-500 py-4">No visitor logs yet.</p>}
          </div>
        </article>
      </section>
    </AdminRouteGuard>
  );
}

