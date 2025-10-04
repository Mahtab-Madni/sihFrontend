import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Droplets, FlaskConical, MapPin, TrendingUp } from 'lucide-react';

// Logos – make sure these paths are correct
import logo1 from '@/assets/logo1.jpeg';
import logo2 from '@/assets/logo2.jpeg';
import logo3 from '@/assets/logo3.jpeg';
import logo4 from '@/assets/logo4.jpeg';
import logo5 from '@/assets/logo5.jpeg';
import logo6 from '@/assets/logo6.jpeg';
import logo7 from '@/assets/logo7.jpeg';
import HeroCarousel from './heroCarousel';

// Hero image
import heroImage from '@/assets/hero-water.jpg'; // <- aapka hero image path

const logos = [logo1, logo2, logo3, logo4, logo5, logo6, logo7];

const Dashboard = ({ onSectionChange }) => {
  const features = [
    {
      icon: FlaskConical,
      title: 'Automated Analysis',
      description: 'Calculate HPI, MI, and Cd indices automatically using validated scientific formulas.',
    },
    {
      icon: MapPin,
      title: 'Geospatial Mapping',
      description: 'Visualize contamination levels on interactive maps with color-coded markers.',
    },
    {
      icon: TrendingUp,
      title: 'Data Visualization',
      description: 'Generate comprehensive charts and reports for scientific analysis.',
    },
  ];

  const stats = [
    { label: 'Samples Analyzed', value: '1,247', icon: FlaskConical, trend: '+12%' },
    { label: 'Districts Covered', value: '32', icon: MapPin, trend: '+5' },
    { label: 'Water Sources', value: '156', icon: Droplets, trend: '+8%' },
  ];

  return (
    <div className="flex flex-col gap-8 pb-8">
<HeroCarousel onSectionChange={onSectionChange} />
      {/* Hero Section with image */}
      {/* <div className="relative h-[500px] md:h-[600px] w-full">
        <img
          src={heroImage}
          alt="Water testing"
          className="absolute inset-0 w-full h-full object-cover brightness-50"
        />
        <div className="relative container mx-auto px-4 py-16 md:py-24 flex flex-col justify-center h-full">
          <div className="max-w-2xl text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Advanced Water Quality Analysis Platform
            </h1>
            <p className="text-lg mb-6">
              Comprehensive tools for analyzing groundwater contamination and generating scientific reports for environmental monitoring.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => onSectionChange('upload')}
                className="bg-primary hover:bg-primary/90"
              >
                Upload Data
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-background/20 hover:bg-background/30 border-white text-white"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div> */}

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Powerful Analysis Tools</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform provides comprehensive tools for water quality analysis
            and contamination assessment using advanced scientific methodologies.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-border/40">
                <CardHeader>
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-2">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-border/40">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-muted-foreground text-sm">{stat.label}</p>
                      <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>{stat.trend} from last month</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-2">Ready to analyze your water quality data?</h3>
                <p className="text-primary-foreground/80 max-w-xl">
                  Upload your sample data to generate comprehensive analysis
                  reports and visualizations.
                </p>
              </div>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => onSectionChange('upload')}
                className="whitespace-nowrap"
              >
                Start Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Scrolling Logos */}
      <section style={{ maxWidth: '1280px', margin: '2rem auto 3rem auto', padding: '0 1rem' }}>
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '1rem', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.05)', padding: '1rem' }}>
          <div style={{ width: '100%', overflow: 'hidden' }}>
            <div className="animate-scroll-track" style={{ display: 'flex', gap: '2rem', willChange: 'transform' }}>
              {[...logos, ...logos].map((src, i) => (
                <div
                  key={i}
                  style={{
                    flexShrink: 0,
                    width: '10rem',
                    height: '6rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}
                >
                  <img
                    src={src}
                    alt={`logo-${i}`}
                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                  />
                </div>
              ))}
            </div>
          </div>
          <style>{`
            @keyframes scrollTrack {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-scroll-track {
              animation: scrollTrack 24s linear infinite;
            }
            @media (prefers-reduced-motion: reduce) {
              .animate-scroll-track { animation: none; }
            }
          `}</style>
        </div>
      </section>

    </div>
  );
};

export default Dashboard;
