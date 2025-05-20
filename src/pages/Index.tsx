
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, AlertTriangle, Shield, Info } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-primary/5 py-16">
        <div className="container px-6 mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-lg">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Crisis Management App</h1>
              <p className="text-xl mb-8 text-muted-foreground">
                Stay informed, stay safe. Your personal safety assistant during emergencies and natural disasters.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signin">
                  <Button size="lg" className="group">
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="outline" size="lg">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-24 h-24 md:w-32 md:h-32 text-primary animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16">
        <div className="container px-6 mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Essential Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<AlertTriangle className="h-8 w-8 text-primary" />}
              title="Real-time Alerts"
              description="Receive immediate notifications about emergencies and hazards in your area."
            />
            <FeatureCard 
              icon={<Shield className="h-8 w-8 text-primary" />}
              title="Safety Resources"
              description="Access critical information, guides, and resources to keep you safe during emergencies."
            />
            <FeatureCard 
              icon={<Info className="h-8 w-8 text-primary" />}
              title="Crisis Map"
              description="Interactive map showing nearby incidents, safe zones, and emergency services."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-muted py-8">
        <div className="container px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {new Date().getFullYear()} Crisis Management App. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary">About</Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy</Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string 
}) => {
  return (
    <div className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Index;
