
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto max-w-3xl space-y-8">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About</h1>
            <p className="text-muted-foreground md:text-xl">
              This is a blank project template to help you get started with your ideas quickly.
            </p>
            <p className="text-muted-foreground">
              Feel free to customize this page with information about your project, team, or company.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
