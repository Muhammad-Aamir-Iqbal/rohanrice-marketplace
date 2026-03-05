import React from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import AdminLayout from '@/components/AdminLayout';
import { AppStoreProvider } from '@/context/AppStoreContext';
import '@/styles/globals.css';

const isAuthPage = (pathname) =>
  ['/login', '/signup', '/admin/login', '/admin/signup'].includes(pathname);

const isAdminPanelPage = (pathname) =>
  pathname.startsWith('/admin') && !['/admin/login', '/admin/signup'].includes(pathname);

function Shell({ Component, pageProps }) {
  const router = useRouter();

  if (isAuthPage(router.pathname)) {
    return <Component {...pageProps} />;
  }

  if (isAdminPanelPage(router.pathname)) {
    return (
      <AdminLayout>
        <Component {...pageProps} />
      </AdminLayout>
    );
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default function App(props) {
  return (
    <AppStoreProvider>
      <Shell {...props} />
    </AppStoreProvider>
  );
}

