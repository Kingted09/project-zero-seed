
import React from 'react';
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Welcome to Your Project
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              A clean slate for your next great idea. Start building something amazing.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 min-[400px]:w-auto">
            <Button>
              Get Started
            </Button>
            <Button variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
