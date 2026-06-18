'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const slides = [
  {
    title: 'Kultuuriranits',
    description: 'Eesti suurim kultuurihariduse platvorm. Too kultuur oma õpilasteni mugavalt ja kiirelt.',
    buttonText: 'Vaata programme',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop',
    color: 'from-blue-600 to-blue-800'
  },
  {
    title: 'Broneeri lihtsalt',
    description: 'Kõik ühes kohas: vali programm, vali aeg ja kinnita. Arveldus toimub automaatselt.',
    buttonText: 'Vaata programme',
    image: 'https://www.kul.ee/sites/default/files/styles/hero_image/public/2022-01/pexels-anastasia-shuraeva-8467296.jpg?itok=lbK-of0u',
    color: 'from-green-600 to-green-800'
  },
  {
    title: 'Õpetajatele ja muuseumidele',
    description: 'Loodud koostöös Kultuuriministeeriumiga. Lihtsustab koolide ja kultuuriasutuste vahelist koostööd.',
    buttonText: 'Loo konto',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop',
    color: 'from-purple-600 to-purple-800'
  }
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="relative h-[500px] w-full overflow-hidden bg-gray-950 group">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide 
              ? 'opacity-100 z-10 pointer-events-auto' 
              : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover transform scale-105 transition-transform duration-10000"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} mix-blend-multiply opacity-70`} />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-sm">
                {slide.title}
              </h1>
              <p className="text-lg sm:text-xl text-gray-100/90 mb-8 max-w-xl leading-relaxed drop-shadow-sm">
                {slide.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/otsi"
                  className="inline-block bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 ease-out shadow-xl hover:bg-gray-100 hover:scale-105 hover:shadow-2xl active:scale-95"
                >
                  {slide.buttonText}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 text-white backdrop-blur-sm opacity-0 z-20 cursor-pointer transition-all duration-300 ease-out group-hover:opacity-100 hover:bg-white/40 hover:scale-110 active:scale-95"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 text-white backdrop-blur-sm opacity-0 z-20 cursor-pointer transition-all duration-300 ease-out group-hover:opacity-100 hover:bg-white/40 hover:scale-110 active:scale-95"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ease-out cursor-pointer ${
              index === currentSlide ? 'w-8 bg-white' : 'w-2.5 bg-white/45 hover:bg-white/70 hover:scale-110'
            }`}
          />
        ))}
      </div>
    </div>
  );
}