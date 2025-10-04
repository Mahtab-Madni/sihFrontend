import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

// Hero images
import heroWater from '@/assets/hero-water.jpg';
import hero3 from '@/assets/hero3.jpg';
import hero4 from '@/assets/hero4.jpg';
import hero5 from '@/assets/hero5.jpg';
import hero6 from '@/assets/hero6.jpg';
import hero7 from '@/assets/hero7.jpg';



const heroImages = [heroWater, hero3, hero4,hero5,hero6,hero7];

const HeroCarousel = ({ onSectionChange }) => {
  const [current, setCurrent] = useState(0);

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % heroImages.length);
  };

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
      {/* Images */}
      {heroImages.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`hero-${index}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === current ? 'opacity-100' : 'opacity-0'
          } brightness-50`}
        />
      ))}

      {/* Content Overlay */}
      <div className="relative container mx-auto px-4 py-16 md:py-24 flex flex-col justify-center h-full text-white max-w-2xl"
      style={{ display: 'flex', justifyContent: 'left', alignItems:'left' }}>
        <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{display:'flex', justifyContent:'left', alignItems:'left'}}>
          Advanced Water Quality Analysis Platform
        </h1>
        <p className="text-lg mb-6"  style={{outlineColor:'black',     display:'flex', justifyContent:'left', alignItems:'left'}}>
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

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 rounded-full p-2 z-10"
      >
        &#8592;
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 rounded-full p-2 z-10"
      >
        &#8594;
      </button>
    </div>
  );
};

export default HeroCarousel;
