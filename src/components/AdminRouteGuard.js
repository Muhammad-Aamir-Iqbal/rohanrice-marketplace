import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAppStore } from '@/context/AppStoreContext';

export default function AdminRouteGuard({ children }) {
  const router = useRouter();
  const { hydrated, isAdmin } = useAppStore();

  useEffect(() => {
    if (!hydrated) return;
    if (!isAdmin) {
      router.replace('/admin/login');
    }
  }, [hydrated, isAdmin, router]);

  if (!hydrated || !isAdmin) {
    return null;
  }

  return children;
}

