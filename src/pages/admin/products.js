import Head from 'next/head';
import { useMemo, useState } from 'react';
import AdminRouteGuard from '@/components/AdminRouteGuard';
import { useAppStore } from '@/context/AppStoreContext';
import { fileToDataUrl, formatCurrency, getCategoryNameById } from '@/utils/appHelpers';

const initialForm = {
  name: '',
  categoryId: '',
  pricePerKg: '',
  stockQuantity: '',
  description: '',
  image: '',
  isFeatured: false,
};

export default function AdminProductsPage() {
  const { data, addProduct, updateProduct, deleteProduct } = useAppStore();

  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState('');
  const [status, setStatus] = useState('');

  const categories = useMemo(() => data.categories, [data.categories]);

  const startEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      categoryId: product.categoryId,
      pricePerKg: String(product.pricePerKg),
      stockQuantity: String(product.stockQuantity),
      description: product.description,
      image: product.image || '',
      isFeatured: Boolean(product.isFeatured),
    });
  };

  const resetForm = () => {
    setEditingId('');
    setFormData(initialForm);
  };

  const onImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const image = await fileToDataUrl(file);
    setFormData((prev) => ({ ...prev, image }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (editingId) {
      const response = await updateProduct(editingId, formData);
      setStatus(response.message);
      if (response.success) {
        resetForm();
      }
      return;
    }

    const response = await addProduct(formData);
    setStatus(response.message);

    if (response.success) {
      resetForm();
    }
  };

  const onDelete = async (productId) => {
    const response = await deleteProduct(productId);
    setStatus(response.message);
  };

  return (
    <AdminRouteGuard>
      <Head>
        <title>Admin Products | Rohan Rice</title>
      </Head>

      <section className="grid xl:grid-cols-3 gap-6">
        <article className="card-premium xl:col-span-1 h-fit">
          <h1 className="text-2xl font-serif font-bold">{editingId ? 'Edit Product' : 'Add Rice Product'}</h1>

          {status && (
            <div className="mt-4 rounded-md px-3 py-2 bg-rice-green-50 border border-rice-green-200 text-rice-green-800 text-sm">
              {status}
            </div>
          )}

          <form className="mt-4 space-y-3" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-semibold mb-1">Product Name</label>
              <input
                className="input-field"
                value={formData.name}
                onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Rice Category</label>
              <select
                className="input-field"
                value={formData.categoryId}
                onChange={(event) => setFormData((prev) => ({ ...prev, categoryId: event.target.value }))}
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold mb-1">Price per kg</label>
                <input
                  type="number"
                  className="input-field"
                  value={formData.pricePerKg}
                  onChange={(event) => setFormData((prev) => ({ ...prev, pricePerKg: event.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Stock quantity</label>
                <input
                  type="number"
                  className="input-field"
                  value={formData.stockQuantity}
                  onChange={(event) => setFormData((prev) => ({ ...prev, stockQuantity: event.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Description</label>
              <textarea
                rows={4}
                className="input-field"
                value={formData.description}
                onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Product image upload</label>
              <input type="file" accept="image/*" className="input-field" onChange={onImageChange} />
              {formData.image && (
                <img src={formData.image} alt="Preview" className="mt-2 h-20 w-full object-cover rounded border" />
              )}
            </div>

            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(event) => setFormData((prev) => ({ ...prev, isFeatured: event.target.checked }))}
              />
              Mark as featured product
            </label>

            <div className="flex gap-2">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update Product' : 'Add Product'}
              </button>
              {editingId && (
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </article>

        <article className="card-premium xl:col-span-2">
          <h2 className="text-2xl font-serif font-bold">Manage Products</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-rice-beige-200">
                  <th className="py-2">Product</th>
                  <th className="py-2">Category</th>
                  <th className="py-2">Price</th>
                  <th className="py-2">Stock</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.products.map((product) => (
                  <tr key={product.id} className="border-b border-rice-beige-100">
                    <td className="py-2 pr-3">
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.isFeatured ? 'Featured' : 'Standard'}</p>
                    </td>
                    <td className="py-2 pr-3">{getCategoryNameById(data.categories, product.categoryId)}</td>
                    <td className="py-2 pr-3">{formatCurrency(product.pricePerKg)}</td>
                    <td className="py-2 pr-3">{product.stockQuantity} kg</td>
                    <td className="py-2">
                      <div className="flex gap-2">
                        <button type="button" className="btn-secondary px-3 py-1 text-xs" onClick={() => startEdit(product)}>
                          Edit
                        </button>
                        <button type="button" className="px-3 py-1 text-xs rounded bg-red-50 text-red-700 border border-red-200" onClick={() => onDelete(product.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </AdminRouteGuard>
  );
}

