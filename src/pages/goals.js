import Head from 'next/head';
import Link from 'next/link';

export default function GoalsPage() {
  return (
    <>
      <Head>
        <title>Rohan Rice Vision</title>
      </Head>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-serif font-bold text-charcoal">Our Growth Vision</h1>
          <p className="mt-4 text-gray-700">
            Rohan Rice focuses on quality, trust, customer satisfaction, and long term business growth.
            We plan to expand product availability, improve customer experience, and strengthen our service standards.
          </p>
          <Link href="/about" className="inline-block mt-6 btn-primary">
            Learn More
          </Link>
        </div>
      </section>
    </>
  );
}
