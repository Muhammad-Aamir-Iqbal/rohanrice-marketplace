import Head from 'next/head';
import { useState } from 'react';
import AdminRouteGuard from '@/components/AdminRouteGuard';
import { useAppStore } from '@/context/AppStoreContext';
import { fileToDataUrl, formatDate } from '@/utils/appHelpers';

const initialForm = {
  title: '',
  excerpt: '',
  content: '',
  image: '',
  status: 'published',
};

export default function AdminBlogPage() {
  const { data, addBlogPost, updateBlogPost, deleteBlogPost } = useAppStore();

  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId('');
  };

  const onImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const image = await fileToDataUrl(file);
    setFormData((prev) => ({ ...prev, image }));
  };

  const onSubmit = (event) => {
    event.preventDefault();

    if (editingId) {
      updateBlogPost(editingId, formData);
      setStatusMessage('Blog post updated.');
      resetForm();
      return;
    }

    const response = addBlogPost(formData);
    setStatusMessage(response.message);
    if (response.success) resetForm();
  };

  const startEdit = (post) => {
    setEditingId(post.id);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image || '',
      status: post.status || 'published',
    });
  };

  return (
    <AdminRouteGuard>
      <Head>
        <title>Admin Blog | Rohan Rice</title>
      </Head>

      <section className="grid xl:grid-cols-3 gap-6">
        <article className="card-premium xl:col-span-1">
          <h1 className="text-2xl font-serif font-bold">{editingId ? 'Edit Blog Post' : 'Create Blog Post'}</h1>

          {statusMessage && (
            <div className="mt-4 rounded-md px-3 py-2 bg-rice-green-50 border border-rice-green-200 text-rice-green-800 text-sm">
              {statusMessage}
            </div>
          )}

          <form className="mt-4 space-y-3" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-semibold mb-1">Title</label>
              <input
                className="input-field"
                value={formData.title}
                onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Excerpt</label>
              <textarea
                rows={3}
                className="input-field"
                value={formData.excerpt}
                onChange={(event) => setFormData((prev) => ({ ...prev, excerpt: event.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Content</label>
              <textarea
                rows={7}
                className="input-field"
                value={formData.content}
                onChange={(event) => setFormData((prev) => ({ ...prev, content: event.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Blog image upload</label>
              <input type="file" accept="image/*" className="input-field" onChange={onImageChange} />
              {formData.image && (
                <img src={formData.image} alt="Blog preview" className="mt-2 h-20 w-full object-cover rounded border" />
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Status</label>
              <select
                className="input-field"
                value={formData.status}
                onChange={(event) => setFormData((prev) => ({ ...prev, status: event.target.value }))}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update Post' : 'Create Post'}
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
          <h2 className="text-2xl font-serif font-bold">All Blog Posts</h2>
          <div className="mt-4 space-y-3">
            {data.blogPosts.map((post) => (
              <article key={post.id} className="border border-rice-beige-200 rounded-md p-3 bg-rice-beige-50">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-charcoal">{post.title}</h3>
                    <p className="text-xs text-gray-500">
                      {formatDate(post.createdAt)} - {post.status}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{post.excerpt}</p>
                  </div>
                  <div className="flex gap-2 h-fit">
                    <button type="button" className="btn-secondary px-3 py-1 text-xs" onClick={() => startEdit(post)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1 text-xs rounded bg-red-50 text-red-700 border border-red-200"
                      onClick={() => deleteBlogPost(post.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </article>
      </section>
    </AdminRouteGuard>
  );
}

