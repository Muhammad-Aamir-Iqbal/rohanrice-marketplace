import Head from 'next/head';
import AdminRouteGuard from '@/components/AdminRouteGuard';
import { useAppStore } from '@/context/AppStoreContext';
import { formatDate } from '@/utils/appHelpers';

const statusOptions = ['new', 'read', 'resolved'];

export default function AdminMessagesPage() {
  const { data, markMessageStatus } = useAppStore();

  return (
    <AdminRouteGuard>
      <Head>
        <title>Contact Messages | Rohan Rice</title>
      </Head>

      <section className="card-premium">
        <h1 className="text-2xl font-serif font-bold">Contact Messages</h1>
        <p className="text-sm text-gray-600 mt-1">Messages submitted from the Contact Us page.</p>

        <div className="mt-5 space-y-3">
          {data.contactMessages.map((message) => (
            <article key={message.id} className="border border-rice-beige-200 rounded-md p-3 bg-rice-beige-50">
              <div className="flex flex-col md:flex-row md:justify-between gap-2">
                <div>
                  <p className="font-semibold text-charcoal">{message.name}</p>
                  <p className="text-xs text-gray-500">
                    {message.email} {message.phone ? `| ${message.phone}` : ''}
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(message.createdAt)}</p>
                </div>

                <select
                  className="input-field text-sm max-w-[150px]"
                  value={message.status}
                  onChange={(event) => markMessageStatus(message.id, event.target.value)}
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <p className="text-sm text-gray-700 mt-3 whitespace-pre-line">{message.message}</p>
            </article>
          ))}

          {!data.contactMessages.length && <p className="text-sm text-gray-500">No contact messages yet.</p>}
        </div>
      </section>
    </AdminRouteGuard>
  );
}

