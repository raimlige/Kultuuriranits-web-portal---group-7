'use client';

import { useState, useEffect, useRef } from 'react';
import { Users, GraduationCap, MapPin, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Link from 'next/link';
import { Program } from '@/models/Program';
import { getPopularPrograms } from '@/app/lib/program';

export function PopularPrograms() {
  const [popularPrograms, setPopularPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACK_URL;

  useEffect(() => {
    const loadDatabaseData = async () => {
      try {
        setLoading(true);
        const responseData = await getPopularPrograms();
        const programsArray = responseData?.content ? responseData.content : responseData;

        if (Array.isArray(programsArray)) {
          const activePrograms = programsArray.filter(
            (p: Program) => p.status?.toLowerCase() === 'active'
          );
          setPopularPrograms(activePrograms.slice(0, 6));
        }
      } catch (error) {
        console.error("Viga andmete laadimisel komponenti:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDatabaseData();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 1.5 : scrollLeft + clientWidth / 1.5;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-gray-500 font-medium animate-pulse">
        Laetakse populaarseid programme kohalikust andmebaasist...
      </div>
    );
  }

  if (popularPrograms.length === 0) return null;

  return (
    <div className="py-8 mb-16 relative w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Populaarsed programmid</h2>
          <p className="text-gray-500 font-medium">Enim broneeritud ja kõrgelt hinnatud kultuuriprogrammid õpilastele</p>
        </div>
        <Link href="/programs" className="text-blue-600 font-extrabold hover:text-blue-800 transition-colors flex items-center gap-1">
          Vaata kõiki <span className="text-lg leading-none">&rarr;</span>
        </Link>
      </div>

      <div className="relative group/carousel">
        {/* Karusselli liikumise nupud */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 z-20 p-3.5 rounded-full bg-white shadow-lg border border-gray-100 text-gray-600 hover:text-blue-600 hover:border-blue-100 hover:shadow-xl transition-all transform active:scale-90 cursor-pointer"
        >
          <ChevronLeft className="w-5.5 h-5.5" />
        </button>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6 z-20 p-3.5 rounded-full bg-white shadow-lg border border-gray-100 text-gray-600 hover:text-blue-600 hover:border-blue-100 hover:shadow-xl transition-all transform active:scale-90 cursor-pointer"
        >
          <ChevronRight className="w-5.5 h-5.5" />
        </button>

        {/* Kaartide rida */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar pb-6 -mx-2 px-2 scroll-smooth"
          style={{ scrollbarWidth: 'none' }}
        >
          {popularPrograms.map((program) => {
            const displayImage = program.imageName 
              ? `${BACKEND_URL}/uploads/${program.imageName}` 
              : 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=800';

            return (
              <div key={program.id} className="flex-shrink-0 w-[340px] group/card bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300 flex flex-col h-full">
                
                {/* Pildi ala */}
                <div className="relative h-48 overflow-hidden shrink-0 bg-gray-50">
                  <img 
                    src={displayImage} 
                    alt={program.title} 
                    className="w-full h-full object-cover group-hover/card:scale-[1.02] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4 flex gap-1.5">
                    <span className="bg-blue-600/90 backdrop-blur-md text-[9px] font-bold text-white uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm border border-blue-500/20 flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-white text-white" />
                      Populaarne
                    </span>
                  </div>
                </div>
                
                {/* Info sisu andmebaasist */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Asukoht / Toimumiskoht */}
                    <div className="flex items-center text-xs font-bold text-gray-400 gap-1.5 uppercase tracking-wider mb-2.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="truncate">{program.location}</span>
                    </div>
                    {/* Pealkiri */}
                    <h3 className="text-lg font-black text-gray-900 group-hover/card:text-blue-600 transition-colors leading-snug mb-4 line-clamp-2">
                      {program.title}
                    </h3>
                  </div>

                  {/* Alumine detailide osa */}
                  <div className="mt-auto">
                    <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 border-t border-gray-50 pt-4">
                      {/* Sihtgrupp (targetGroup) */}
                      <div className="flex items-center gap-2.5 text-xs font-bold text-gray-600">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-blue-600 shrink-0">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <span className="truncate">{program.targetGroup}</span>
                      </div>
                      {/* Grupi suurus (min - max) */}
                      <div className="flex items-center gap-2.5 text-xs font-bold text-gray-600">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-blue-600 shrink-0">
                          <Users className="w-4 h-4" />
                        </div>
                        <span className="truncate">{program.minGroupSize} - {program.maxGroupSize} õp.</span>
                      </div>
                    </div>

                    {/* Hind ja vaatamise nupp */}
                    <div className="mt-6 flex items-center justify-between gap-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Hind alates</span>
                        <span className="text-base font-extrabold text-blue-700">
                          {program.pricePerStudent}€ <span className="text-[10px] text-blue-500 font-semibold">/ õpilane</span>
                        </span>
                      </div>

                      <Link 
                        href={`/programs/${program.id}`}
                        className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-blue-600 text-white font-extrabold text-xs hover:bg-blue-700 active:scale-95 transition-all shadow-sm cursor-pointer"
                      >
                        Vaata
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}