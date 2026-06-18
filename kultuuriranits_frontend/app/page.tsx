import { HeroCarousel } from '../components/home/HeroCarousel';
import { CategoryCarousel } from '../components/home/CategoryCarousel';
import { HowItWorks } from '../components/home/HowItWorks';
import { PopularPrograms } from '../components/home/PopularPrograms';
import { UserRoles } from '../components/home/UserRoles';

export default function Home() {
  return (
    <main className="flex flex-col">
      {/* Hero Section - Full Width */}
      <HeroCarousel />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Categories Section */}
        <CategoryCarousel />

        {/* How It Works Section */}
        <HowItWorks />

        {/* For Whom Section */}
        <UserRoles />

        {/* Popular Programs Section */}
        <PopularPrograms />

        {/* Call to Action */}
        <div className="bg-blue-600 rounded-3xl p-12 text-center text-white mb-16 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-blue-700 rounded-full blur-3xl opacity-50"></div>

          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Valmis avastama Eesti kultuuri?</h2>
          <p className="text-xl text-blue-50 mb-10 max-w-2xl mx-auto relative z-10">
            Liitu tuhandete õpetajatega, kes juba kasutavad Kultuuriranitsat oma õppetöö rikastamiseks.
          </p>
          <div className="relative z-10">
            <a href="/programs" className="inline-block bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">Alusta otsingut</a>
          </div>
        </div>
      </div>
    </main>
  );
}