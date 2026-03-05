import Head from 'next/head';
import { useState } from 'react';
import AdminRouteGuard from '@/components/AdminRouteGuard';
import { useAppStore } from '@/context/AppStoreContext';

export default function AdminCategoriesPage() {
  const { data, addCategory, updateCategory, deleteCategory } = useAppStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState('');
  const [status, setStatus] = useState('');

  const onSubmit = (event) => {
    event.preventDefault();

    if (editingId) {
      updateCategory(editingId, { name, description });
      setStatus('Category updated.');
      setEditingId('');
      setName('');
      setDescription('');
      return;
    }

    const response = addCategory({ name, description });
    setStatus(response.message);

    if (response.success) {
      setName('');
      setDescription('');
    }
  };

  const startEdit = (category) => {
    setEditingId(category.id);
    setName(category.name);
    setDescription(category.description || '');
  };

  const handleDelete = (id) => {
    const response = deleteCategory(id);
    setStatus(response.message);
  };

  return (
    <AdminRouteGuard>
      <Head>
        <title>Admin Categories | Rohan Rice</title>
      </Head>

      <section className="grid lg:grid-cols-2 gap-6">
        <article className="card-premium">
          <h1 className="text-2xl font-serif font-bold">Manage Categories</h1>

          {status && (
            <div className="mt-4 rounded-md px-3 py-2 bg-rice-green-50 border border-rice-green-200 text-rice-green-800 text-sm">
              {status}
            </div>
          )}

          <form className="mt-4 space-y-3" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-semibold mb-1">Category Name</label>
              <input className="input-field" value={name} onChange={(event) => setName(event.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Description</label>
              <textarea className="input-field" rows={4} value={description} onChange={(event) => setDescription(event.target.value)} />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update Category' : 'Add Category'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setEditingId('');
                    setName('');
                    setDescription('');
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </article>

        <article className="card-premium">
          <h2 className="text-2xl font-serif font-bold">Current Categories</h2>
          <div className="mt-4 space-y-3">
            {data.categories.map((category) => (
              <div key={category.id} className="border border-rice-beige-200 rounded-md p-3 bg-rice-beige-50">
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="font-semibold text-rice-green-800">{category.name}</p>
                    <p className="text-sm text-gray-600 mt-1">{category.description || 'No description'}</p>
                  </div>
                  <div className="flex gap-2 h-fit">
                    <button type="button" className="btn-secondary px-3 py-1 text-xs" onClick={() => startEdit(category)}>
                      Edit
                    </button>
                    <button type="button" className="px-3 py-1 text-xs rounded bg-red-50 text-red-700 border border-red-200" onClick={() => handleDelete(category.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </AdminRouteGuard>
  );
}

