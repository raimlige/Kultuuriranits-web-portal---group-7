import { ContactForm } from "../../components/ContactForm";

export default function ContactPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <section className="text-center max-w-4xl mx-auto mb-14">
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">
          Kontakt
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Võta meiega ühendust, kui sul on küsimusi Kultuuriranitsa, programmide
          või toetusmeetme kasutamise kohta.
        </p>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col gap-6">
          <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6">
            <h2 className="font-black text-xl text-gray-900 mb-5">
              Kultuuriministeeriumi üldkontakt
            </h2>

            <div className="space-y-4 border-l-2 border-blue-600 pl-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
                <span className="font-bold text-gray-900">Telefon:</span>
                <span className="text-gray-600">+372 628 2222</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
                <span className="font-bold text-gray-900">E-post:</span>
                <a
                  href="mailto:min@kul.ee"
                  className="text-blue-600 hover:underline"
                >
                  min@kul.ee
                </a>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
                <span className="font-bold text-gray-900">Aadress:</span>
                <span className="text-gray-600">
                  Suur-Karja 23, 15076 Tallinn
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6">
            <h2 className="font-black text-xl text-gray-900 mb-1">
              Annikki Aruväli
            </h2>

            <p className="text-sm font-extrabold text-blue-600 uppercase tracking-wide mb-5">
              Kultuurihariduse ja ligipääsetavuse nõunik
            </p>

            <div className="space-y-4 border-l-2 border-blue-600 pl-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
                <span className="font-bold text-gray-900">Telefon:</span>
                <span className="text-gray-600">+372 5199 6885</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
                <span className="font-bold text-gray-900">E-post:</span>
                <a
                  href="mailto:annikki.aruvali@kul.ee"
                  className="text-blue-600 hover:underline"
                >
                  annikki.aruvali@kul.ee
                </a>
              </div>
            </div>
          </div>
        </div>

        <ContactForm />
      </section>
    </main>
  );
}