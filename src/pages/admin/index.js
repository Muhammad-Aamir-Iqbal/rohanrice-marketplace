import Head from 'next/head';
import AdminRouteGuard from '@/components/AdminRouteGuard';
import { useAppStore } from '@/context/AppStoreContext';
import {
  formatCurrency,
  getDailyVisitors,
  getPopularProducts,
  getSalesSummary,
  getTopCategory,
  getPopularPages,
} from '@/utils/appHelpers';

export default function AdminDashboardPage() {
  const { data } = useAppStore();

  const sales = getSalesSummary(data.orders);
  const topCategory = getTopCategory(data.orders, data.products, data.categories);
  const visitorSeries = getDailyVisitors(data.visitorLogs, 7);
  const popularProducts = getPopularProducts(data.orders, data.products);
  const popularPages = getPopularPages(data.visitorLogs);

  const totalVisitors = new Set(data.visitorLogs.map((log) => log.visitorId)).size;

  const maxVisitors = Math.max(...visitorSeries.map((item) => item.visitors), 1);

  return (
    <AdminRouteGuard>
      <Head>
        <title>Admin Dashboard | Rohan Rice</title>
      </Head>

      <section>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <article className="card-premium">
            <p className="text-xs text-gray-500">Total Products</p>
            <p className="text-3xl font-bold text-rice-green-700 mt-1">{data.products.length}</p>
          </article>
          <article className="card-premium">
            <p className="text-xs text-gray-500">Total Orders</p>
            <p className="text-3xl font-bold text-rice-green-700 mt-1">{data.orders.length}</p>
          </article>
          <article className="card-premium">
            <p className="text-xs text-gray-500">Total Customers</p>
            <p className="text-3xl font-bold text-rice-green-700 mt-1">{data.customers.length}</p>
          </article>
          <article className="card-premium">
            <p className="text-xs text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-rice-green-700 mt-1">{formatCurrency(sales.totalRevenue)}</p>
          </article>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          <article className="card">
            <p className="text-xs text-gray-500">Today Sales</p>
            <p className="text-xl font-bold text-rice-green-700 mt-1">{formatCurrency(sales.todaySales)}</p>
          </article>
          <article className="card">
            <p className="text-xs text-gray-500">This Week Sales</p>
            <p className="text-xl font-bold text-rice-green-700 mt-1">{formatCurrency(sales.weekSales)}</p>
          </article>
          <article className="card">
            <p className="text-xs text-gray-500">This Month Sales</p>
            <p className="text-xl font-bold text-rice-green-700 mt-1">{formatCurrency(sales.monthSales)}</p>
          </article>
          <article className="card">
            <p className="text-xs text-gray-500">Top Selling Category</p>
            <p className="text-sm font-semibold text-rice-green-700 mt-1">{topCategory.category}</p>
            <p className="text-xs text-gray-500">{formatCurrency(topCategory.value)}</p>
          </article>
        </div>

        <div className="grid xl:grid-cols-3 gap-5 mt-6">
          <article className="card-premium xl:col-span-2">
            <h2 className="text-xl font-semibold">Daily Visitors</h2>
            <p className="text-xs text-gray-500 mt-1">Website Visitors: {totalVisitors}</p>
            <div className="mt-4 grid grid-cols-7 gap-2 items-end h-36">
              {visitorSeries.map((item) => (
                <div key={item.dateKey} className="flex flex-col items-center justify-end h-full">
                  <div
                    className="w-full bg-rice-green-600 rounded-t"
                    style={{ height: `${Math.max(8, (item.visitors / maxVisitors) * 100)}%` }}
                  />
                  <p className="text-[10px] text-gray-500 mt-1">{item.dateKey.slice(5)}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="card-premium">
            <h2 className="text-xl font-semibold">Popular Products</h2>
            <div className="mt-3 space-y-2 text-sm">
              {popularProducts.length ? (
                popularProducts.map((item) => (
                  <div key={item.productId} className="flex justify-between border-b border-rice-beige-200 pb-1">
                    <span>{item.name}</span>
                    <span className="font-semibold text-rice-green-700">{item.qty} kg</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No product sales data yet.</p>
              )}
            </div>
          </article>
        </div>

        <div className="grid lg:grid-cols-2 gap-5 mt-6">
          <article className="card-premium">
            <h2 className="text-xl font-semibold">Most Visited Pages</h2>
            <div className="mt-3 space-y-2 text-sm">
              {popularPages.length ? (
                popularPages.map((item) => (
                  <div key={item.page} className="flex justify-between border-b border-rice-beige-200 pb-1">
                    <span>{item.page}</span>
                    <span className="font-semibold text-rice-green-700">{item.count}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No visit data yet.</p>
              )}
            </div>
          </article>

          <article className="card-premium">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <div className="mt-3 space-y-2 text-sm">
              {data.orders.slice(0, 6).map((order) => (
                <div key={order.id} className="border-b border-rice-beige-200 pb-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">{order.orderNumber}</span>
                    <span className="text-rice-green-700">{formatCurrency(order.totalAmount)}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {order.customerName} - {order.orderStatus}
                  </p>
                </div>
              ))}

              {!data.orders.length && <p className="text-gray-500">No orders yet.</p>}
            </div>
          </article>
        </div>
      </section>
    </AdminRouteGuard>
  );
}

