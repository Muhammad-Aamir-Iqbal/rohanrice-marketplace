import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/context/AppStoreContext';
import { fileToDataUrl } from '@/utils/appHelpers';

export default function ProfilePage() {
  const router = useRouter();
  const { isCustomer, currentUser, updateCurrentProfile } = useAppStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!isCustomer) {
      router.replace('/login?next=/profile');
      return;
    }

    setFormData({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
    });
  }, [currentUser?.email, currentUser?.name, currentUser?.phone, isCustomer, router]);

  if (!isCustomer) return null;

  const onImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const profileImage = await fileToDataUrl(file);
    const response = updateCurrentProfile({ profileImage });
    setStatus(response.message);
    setTimeout(() => setStatus(''), 2000);
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const response = updateCurrentProfile({
      name: formData.name,
      phone: formData.phone,
    });

    setStatus(response.message);
    setTimeout(() => setStatus(''), 2000);
  };

  return (
    <>
      <Head>
        <title>My Profile | Rohan Rice</title>
      </Head>

      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-serif font-bold text-charcoal">My Profile</h1>
          <p className="text-sm text-gray-600 mt-2">Manage your customer profile information.</p>

          {status && (
            <div className="mt-4 rounded-md px-3 py-2 bg-rice-green-50 border border-rice-green-200 text-rice-green-800 text-sm">
              {status}
            </div>
          )}

          <div className="card-premium mt-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-rice-beige-100 border border-rice-beige-200 overflow-hidden flex items-center justify-center text-xs text-gray-500">
                {currentUser?.profileImage ? (
                  <img src={currentUser.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  'No image'
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Upload Profile Image</label>
                <input type="file" accept="image/*" className="input-field" onChange={onImageChange} />
              </div>
            </div>

            <form onSubmit={onSubmit} className="mt-5 grid sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold mb-1">Name</label>
                <input
                  className="input-field"
                  value={formData.name}
                  onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Email</label>
                <input className="input-field bg-gray-100" value={formData.email} disabled />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Phone (+92)</label>
                <input
                  className="input-field"
                  value={formData.phone}
                  onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <button type="submit" className="btn-primary">
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

