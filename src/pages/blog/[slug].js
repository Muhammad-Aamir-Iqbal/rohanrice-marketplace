import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useAppStore } from '@/context/AppStoreContext';
import { formatDate } from '@/utils/appHelpers';

export default function BlogDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { data } = useAppStore();

  const post = useMemo(
    () => data.blogPosts.find((item) => item.slug === slug && item.status === 'published'),
    [data.blogPosts, slug]
  );

  if (!post) {
    return (
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-serif font-bold text-charcoal">Blog article not found</h1>
          <Link href="/blog" className="inline-block mt-5 btn-primary">Back to Blog</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <Head>
        <title>{post.title} | Rohan Rice Blog</title>
        <meta name="description" content={post.excerpt} />
      </Head>

      <article className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="text-sm text-rice-green-700 hover:text-rice-green-900">
            Back to Blog
          </Link>
          <h1 className="text-4xl font-serif font-bold text-charcoal mt-4">{post.title}</h1>
          <p className="text-sm text-gray-500 mt-2">Published on {formatDate(post.createdAt)}</p>

          {post.image && (
            <div className="h-60 rounded-md overflow-hidden border border-rice-beige-200 mt-6">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          <p className="text-gray-700 mt-6 whitespace-pre-line leading-relaxed">{post.content}</p>
        </div>
      </article>
    </>
  );
}

