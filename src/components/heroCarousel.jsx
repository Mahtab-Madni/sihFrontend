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
      {/* Background Images */}
      {heroImages.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`hero-${index}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          } brightness-50`}
        />
      ))}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10"></div>

      {/* Content Overlay */}
      <div className="relative z-20 container mx-auto px-6 py-16 md:py-24 flex flex-col justify-center items-start h-full text-white max-w-2xl text-left">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Advanced Water Quality Analysis Platform
        </h1>
        <p className="text-lg mb-6 border-l-4 border-white pl-4">
          Comprehensive tools for analyzing groundwater contamination and
          generating scientific reports for environmental monitoring.
        </p>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => onSectionChange("upload")}
            className="px-6 py-3 text-lg font-semibold rounded-md bg-primary hover:bg-primary/90 transition-colors"
          >
            Upload Data
          </button>
          <button className="px-6 py-3 text-lg font-semibold rounded-md border border-white bg-white/10 hover:bg-white/20 text-white transition-colors">
            Learn More
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full p-3 z-30"
      >
        &#8592;
      </button>
      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full p-3 z-30"
      >
        &#8594;
      </button>
    </div>
  );
};

export default HeroCarousel;
