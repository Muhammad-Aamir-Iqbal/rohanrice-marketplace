import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAppStore } from '@/context/AppStoreContext';

export default function WorkerRouteGuard({ children }) {
  const router = useRouter();
  const { hydrated, isWorker } = useAppStore();

  useEffect(() => {
    if (!hydrated) return;
    if (!isWorker) {
      router.replace('/worker/login');
    }
  }, [hydrated, isWorker, router]);

  if (!hydrated || !isWorker) {
    return null;
  }

  return children;
}
