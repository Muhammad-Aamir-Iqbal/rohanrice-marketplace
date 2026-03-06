import Head from 'next/head';
import AdminRouteGuard from '@/components/AdminRouteGuard';
import { useAppStore } from '@/context/AppStoreContext';

export default function AdminStockPage() {
  const { data } = useAppStore();

  return (
    <AdminRouteGuard>
      <Head>
        <title>Stock | Rohan Rice Admin</title>
      </Head>

      <section className="card-premium">
        <h1 className="text-2xl font-serif font-bold">Inventory Stock</h1>
        <p className="text-sm text-gray-600 mt-1">Live stock quantities update automatically when orders are completed.</p>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-rice-beige-200">
                <th className="py-2">Product</th>
                <th className="py-2">Category</th>
                <th className="py-2">Stock (kg)</th>
                <th className="py-2">Price per kg</th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => {
                const category = data.categories.find((cat) => cat.id === product.categoryId);
                return (
                  <tr key={product.id} className="border-b border-rice-beige-100">
                    <td className="py-2 pr-3 font-semibold">{product.name}</td>
                    <td className="py-2 pr-3">{category?.name || '-'}</td>
                    <td className="py-2 pr-3">{product.stockQuantity}</td>
                    <td className="py-2 pr-3">Rs {product.pricePerKg}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!data.products.length && <p className="text-sm text-gray-500 py-4">No products found.</p>}
        </div>
      </section>
    </AdminRouteGuard>
  );
}
