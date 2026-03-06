import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import AdminLayout from '@/components/AdminLayout';
import WorkerLayout from '@/components/WorkerLayout';
import { AppStoreProvider } from '@/context/AppStoreContext';
import '@/styles/globals.css';

const isAuthPage = (pathname) =>
  ['/login', '/signup', '/admin/login', '/admin/signup', '/worker/login'].includes(pathname);

const isAdminPanelPage = (pathname) =>
  pathname.startsWith('/admin') && !['/admin/login', '/admin/signup'].includes(pathname);

const isWorkerPanelPage = (pathname) =>
  pathname.startsWith('/worker') && pathname !== '/worker/login';

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

  if (isWorkerPanelPage(router.pathname)) {
    return (
      <WorkerLayout>
        <Component {...pageProps} />
      </WorkerLayout>
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
    <>
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <AppStoreProvider>
        <Shell {...props} />
      </AppStoreProvider>
    </>
  );
}
