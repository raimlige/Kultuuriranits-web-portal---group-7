export default function InfoPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[80vh]">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">
          Info
        </h1>
        <p className="text-lg text-gray-600">
          Tutvu Kultuuriranitsa eesmärgi, kasutustingimuste ja lisamaterjalidega.
        </p>
      </div>

      <div className="space-y-8">
        <section className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
          <h2 className="font-extrabold text-xl text-gray-900 mb-4">
            Mis on Kultuuriranits?
          </h2>

          <div className="space-y-4 text-gray-600 text-sm pl-4 border-l-2 border-blue-600 leading-relaxed">
            <p>
              Kultuuriranits on Kultuuriministeeriumi eestvedamisel loodud toetusmeede,
              mille eesmärk on tagada laste ja noorte osalemine kultuurielus,
              kultuuri hindava publiku järelkasv ning soodsad tingimused kultuuris
              osalemiseks.
            </p>

            <p>
              Pearaha alusel määratud toetus võimaldab igal lapsel külastada kooli
              õppekavaga seotult vähemalt ühte kultuuriasutust aastas, aidates
              omandada nii riikliku õppekavaga ettenähtud ainepädevusi kui ka
              kasvada loovateks ja mitmekülgseteks isiksusteks.
            </p>

            <p>
              Iga kalendriaasta alguses liigub kultuuriranitsa toetus KOV
              toetusfondi kaudu koolidesse. 2026. aasta toetus on samas
              eelarvemahus kui 2025. aastal ning on määratud igale Eesti 1.–9.
              klassi õpilasele, sh hariduslike erivajadustega ning koduõppel
              olevatele õpilastele.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <h2 className="font-extrabold text-xl text-gray-900 mb-4">
              Kultuuriranits on mõeldud:
            </h2>

            <ul className="space-y-3 text-gray-600 text-sm pl-4 border-l-2 border-blue-600 leading-relaxed">
              <li>
                õpilase mitmekülgse kultuurikogemuse teadlikuks ja süsteemseks
                kujundamiseks terve põhikooli õpikaare jooksul;
              </li>
              <li>
                laste ja noorte kultuurikogemuse suurendamiseks, st et valitud
                osa õppekavast omandatakse kultuuriasutustes;
              </li>
              <li>
                igale Eesti põhikoolis õppivale lapsele minimaalselt ühe
                kultuurikogemuse tagamiseks õppeaastas.
              </li>
            </ul>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <h2 className="font-extrabold text-xl text-gray-900 mb-4">
              Toetusmeetme kasutamise tingimused:
            </h2>

            <ul className="space-y-3 text-gray-600 text-sm pl-4 border-l-2 border-blue-600 leading-relaxed">
              <li>
                õppekäik peab toimuma kultuuri- või mäluasutusse, näiteks
                muuseumisse, teatrisse, kontserdile, kinno või näitusele;
              </li>
              <li>
                toetatud on ka õppekäigud teistesse kultuuriasutustesse, kui
                seal toimub õpilastele suunatud ja õppekavaga seotud kultuuriüritus
                või haridusprogramm;
              </li>
              <li>
                kultuuriranitsa tegevustes osalemine on õpilasele kohustuslik,
                kuna on seotud õppekavaga;
              </li>
              <li>
                toetus sobib ka kultuuriasutuse külastuse transpordikulude
                katmiseks;
              </li>
              <li>
                toetust ei tohi kasutada koolis kohapeal toimuvate aktuste,
                vabatahtlike klassiekskursioonide ega huvitegevuse puhul.
              </li>
            </ul>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <h2 className="font-extrabold text-xl text-gray-900 mb-4">
              Soovitused:
            </h2>

            <ul className="space-y-3 text-gray-600 text-sm pl-4 border-l-2 border-blue-600 leading-relaxed">
              <li>
                Külastatavasse asutusse õppekäiku broneerides soovitame märkida,
                et külastuse eest tasumiseks kasutatakse Kultuuriranitsa
                toetusmeedet.
              </li>
              <li>
                Lisaks Kultuuriranitsa toetusmeetmele on koolil võimalik eraldi
                taotleda etenduskunstide regionaalse kättesaadavuse toetust{" "}
                <a
                  href="https://rahvakultuur.ee/toetused/toetusmeetmed/etenduskunstide-regionaalse-kattesaadavuse-toetused-teater-maal/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Teater maal
                </a>
                .
              </li>
              <li>
                Lapsed teatrisse toetuse tingimuste ja taotlemise kohta saab infot
                oma piirkonna{" "}
                <a
                  href="https://rahvakultuur.ee/kontakt/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  rahvakultuurispetsialistilt
                </a>
                .
              </li>
            </ul>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-7 bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <h2 className="font-extrabold text-xl text-gray-900 mb-4">
              Lugemist
            </h2>

            <div className="space-y-4 text-gray-600 text-sm pl-4 border-l-2 border-blue-600 leading-relaxed">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Kultuuriminister eraldas erakorraliselt pool miljonit eurot laste
                  ja noorte kultuurihariduse toetamiseks
                </h3>
                <p>
                  2026. aastaks eraldas kultuuriminister Heidy Purga erakorraliselt
                  pool miljonit eurot kultuuri ja hariduse koostöö toetamiseks.
                  Lisarahastuse eest saavad Kultuuriministeeriumi haldusala asutused
                  pakkuda koolidele õppekavaga seotud tasuta kultuurikülastusi.
                </p>
              </div>

              <a
                href="https://www.kul.ee/uudised/kultuuriministeerium-voimaldab-54-000-opilasele-tasuta-kultuurikulastuse"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:underline"
              >
                Kultuuriministeerium võimaldab 54 000 õpilasele tasuta
                kultuurikülastuse
              </a>

              <div>
                <a
                  href="https://www.opleht.ee/2025/09/kooliopilase-ranitsas-on-ruumi-ka-kultuurile/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:underline mb-2"
                >
                  Kooliõpilase ranitsas on ruumi ka kultuurile
                </a>
                <p>
                  Kultuurihariduse ja ligipääsetavuse nõunik{" "}
                  <span className="font-semibold text-gray-900">
                    Annikki Aruväli
                  </span>{" "}
                  kirjutab Kultuuriranitsa kasutamise võimalustest ja tagasisidest.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <h2 className="font-extrabold text-xl text-gray-900 mb-4">
              Vaheanalüüsid
            </h2>

            <ul className="space-y-3 text-gray-600 text-sm pl-4 border-l-2 border-blue-600 leading-relaxed">
              <li>
                <a
                  href="https://www.kul.ee/sites/default/files/documents/2025-11/Kultuuriranitsa%20vaheanal%C3%BC%C3%BCs%202025.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Kultuuriranitsa vaheanalüüs 2025 PDF
                </a>
              </li>
              <li>
                <a
                  href="https://www.kul.ee/sites/default/files/documents/2024-05/%C3%95pilaste%20kultuuris%20osalemise%20uuring%20L%C3%95PPARUANNE_2024.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  3.–9. klasside õpilaste kultuuris osalemise uuring 2024 PDF
                </a>
              </li>
              <li>
                <a
                  href="https://hm.ee/oppekavad#kas-klassis-voib-kog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Haridus- ja Teadusministeeriumi lisainfo
                </a>
              </li>
            </ul>
          </div>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="font-extrabold text-xl text-gray-900 mb-4">
              Uuri rohkem Kultuuriministeeriumi kodulehelt
            </h2>

            <p className="text-gray-600 text-sm mb-5">
              Kultuuriministeeriumi lehelt leiab täpsema info Kultuuriranitsa
              rahastuse, eesmärkide ja kasutamise kohta.
            </p>

            <a
              href="https://www.kul.ee/asutus-uudised-ja-rahastamine/rahastamine/kultuuriranits"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Kliki siia
            </a>
          </div>

          <div className="shrink-0">
            <img
              src="https://www.kul.ee/sites/default/files/KULTUURIMINISTEERIUM_EST.svg"
              alt="Kultuuriministeerium"
              className="h-12 w-auto"
            />
          </div>
        </section>
      </div>
    </main>
  );
}