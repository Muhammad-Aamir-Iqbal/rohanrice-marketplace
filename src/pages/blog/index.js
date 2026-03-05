import Head from 'next/head';
import Link from 'next/link';
import { useMemo } from 'react';
import { useAppStore } from '@/context/AppStoreContext';
import { formatDate } from '@/utils/appHelpers';

export default function BlogPage() {
  const { data } = useAppStore();

  const posts = useMemo(
    () => data.blogPosts.filter((post) => post.status === 'published'),
    [data.blogPosts]
  );

  return (
    <>
      <Head>
        <title>Rice Blog | Rohan Rice</title>
        <meta
          name="description"
          content="Read Rohan Rice blog articles about rice farming, quality tips, cooking guidance, and Pakistani rice varieties."
        />
      </Head>

      <section className="bg-gradient-premium py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-serif font-bold text-charcoal">Rohan Rice Blog</h1>
          <p className="text-gray-700 mt-3 max-w-3xl">
            Welcome to the Rohan Rice Blog, a space where we share knowledge and insights about rice, agriculture, and food culture.
            Our blog helps customers understand rice types, farming practices, cooking techniques, and quality selection.
          </p>
          <p className="text-rice-green-800 font-semibold mt-4">From field knowledge to kitchen excellence.</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post) => (
              <article key={post.id} className="card-premium">
                <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
                <h2 className="text-xl font-semibold mt-2">{post.title}</h2>
                <p className="text-sm text-gray-600 mt-2">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className="inline-block mt-4 text-rice-green-700 font-semibold hover:text-rice-green-900">
                  Read Article
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

