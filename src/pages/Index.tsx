
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Hero />
        <section className="container py-8 md:py-12 lg:py-24">
          <div className="mx-auto grid max-w-5xl gap-6 lg:gap-12">
            {/* Your content will go here */}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
