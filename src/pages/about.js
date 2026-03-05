import Head from 'next/head';

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us | Rohan Rice</title>
        <meta
          name="description"
          content="About Rohan Rice, a trusted rice supplier based in Narowal, Punjab, Pakistan managed by Zeeshan Ali."
        />
      </Head>

      <section className="bg-gradient-premium py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-serif font-bold text-charcoal">About Rohan Rice</h1>
          <p className="mt-4 text-gray-700 leading-relaxed">
            Rohan Rice is a rice distribution platform dedicated to delivering high-quality rice products to customers across Pakistan.
            Our business is located in the fertile agricultural region of Narowal, Punjab, where rice farming has been an important tradition for generations.
            At Rohan Rice, we focus on providing rice that meets high standards of purity, taste, and consistency.
          </p>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-6">
          <article className="card-premium">
            <h2 className="text-2xl font-serif font-bold">Our Mission</h2>
            <p className="mt-3 text-gray-700">
              Our mission is to provide premium rice products while maintaining transparency, trust, and long-term relationships with our customers.
            </p>
          </article>

          <article className="card-premium">
            <h2 className="text-2xl font-serif font-bold">Our Vision</h2>
            <p className="mt-3 text-gray-700">
              To become a trusted rice brand recognized for quality, reliability, and customer satisfaction.
            </p>
          </article>
        </div>
      </section>

      <section className="py-14 bg-rice-beige-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-6">
          <article className="card">
            <h3 className="text-xl font-semibold">Rice Sourcing Information</h3>
            <p className="mt-2 text-gray-700 text-sm">
              We source rice from trusted growers and suppliers, focusing on quality control and consistency from procurement to delivery.
            </p>
          </article>

          <article className="card">
            <h3 className="text-xl font-semibold">Quality Commitment</h3>
            <p className="mt-2 text-gray-700 text-sm">
              Every product is selected with the goal of offering customers a reliable and satisfying experience.
            </p>
          </article>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-premium">
            <p className="text-sm text-rice-gold-700 font-semibold">Business Owner</p>
            <h2 className="text-2xl font-serif font-bold mt-2">Zeeshan Ali</h2>
            <p className="text-sm text-gray-600">Owner and Administrator</p>
            <p className="mt-4 text-gray-700">
              Through dedication and careful management, the goal is to build a professional platform that simplifies rice purchasing while maintaining high standards of service.
            </p>
            <p className="mt-4 text-sm text-gray-700">
              This platform was founded and built by the founder, and all technical rights for the platform architecture and source code are reserved by the founder.
            </p>
            <p className="mt-4 text-rice-green-800 font-semibold">Building trust through quality grains.</p>
          </div>
        </div>
      </section>
    </>
  );
}

