import Link from 'next/link';
import { FaXTwitter, FaInstagram, FaYoutube, FaLinkedinIn } from 'react-icons/fa6';

export function Footer() {
  return (
    <footer className="bg-[#003399] text-white py-12 px-4 sm:px-6 lg:px-8 w-full mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-12">
          <div className="md:col-span-1 flex flex-col justify-between h-full min-h-[100px]">
            <div className="w-fit space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight">
                Kultuuriranits
              </h2>

              <div className="flex justify-between items-center w-full pt-1" style={{ minHeight: '24px' }}>
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="X"
                >
                  <FaXTwitter className="w-5 h-5" />
                </a>

                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-5 h-5" />
                </a>

                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="YouTube"
                >
                  <FaYoutube className="w-5 h-5" />
                </a>

                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70">
                Avasta
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/programs" className="text-white/80 hover:text-white transition-colors">
                    Kultuuriprogrammid
                  </Link>
                </li>
                <li>
                  <Link href="/materials" className="text-white/80 hover:text-white transition-colors">
                    Õppematerjalid
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70">
                Juurdepääsetavus
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/accessibility"
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    Juurdepääsetavuse avaldus
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70">
                Portaalist
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/info" className="text-white/80 hover:text-white transition-colors">
                    Mis on Kultuuriranits?
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-white/80 hover:text-white transition-colors">
                    Kontakt
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70">
                Juriidiline info
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="text-white/80 hover:text-white transition-colors">
                    Privaatsuspoliitika
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-white/80 hover:text-white transition-colors">
                    Kasutustingimused
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-start text-sm text-white/90">
          <div className="space-y-1">
            <h4 className="font-bold text-base">Annikki Aruväli</h4>
            <div className="text-white/70 leading-snug pb-1">
              Kultuurihariduse ja<br />ligipääsetavuse nõunik
            </div>
            <p className="text-white/80 pt-1">+372 5199 6885</p>
            <a
              href="mailto:kultuuriranits@kul.ee"
              className="inline-block text-white/80 hover:text-white hover:underline transition-all"
            >
              kultuuriranits@kul.ee
            </a>
          </div>

          <div className="space-y-1 md:pl-4">
            <h4 className="font-bold text-base">Kultuuriministeerium</h4>
            <p className="text-white/80 pt-1">+372 628 2222</p>
            <a
              href="mailto:min@kul.ee"
              className="inline-block text-white/80 hover:text-white hover:underline transition-all mb-1"
            >
              min@kul.ee
            </a>
            <p className="text-white/60 text-xs mt-1">
              Suur-Karja 23, 15076 Tallinn
            </p>
          </div>

          <div className="space-y-3 md:max-w-sm md:ml-auto w-full">
            <h4 className="font-bold text-base">Püsi kursis uudistega</h4>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Sinu e-posti aadress"
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 flex-1 min-w-0"
                required
              />
              <button
                type="submit"
                className="bg-white text-[#003399] font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-white/90 transition-colors shrink-0 cursor-pointer"
              >
                Liitu
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 text-center text-xs text-white/50">
          <p>&copy; {new Date().getFullYear()} Kultuuriranits. Kõik õigused kaitstud.</p>
        </div>
      </div>
    </footer>
  );
}