import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  ExternalLink,
  Keyboard,
  MonitorUp,
  Volume2,
} from "lucide-react";

export default function AccessibilityPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Tagasi avalehele
        </Link>

        <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-8 md:p-12 mb-8">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-6">
            Juurdepääsetavus
          </h1>

          <p className="text-lg leading-relaxed text-gray-700">
            Kultuuriranitsa koduleht on ehitatud ja koostatud nii, et see
            vastaks EN 301 549 V.3.2.1 juurdepääsetavuse suunistele. See
            tähendab, et on kasutatud teatud tehnilisi vahendeid ja sisu
            koostamise põhimõtteid, mis aitavad kodulehe sisu tarbida nägemis-,
            kuulmis-, füüsiliste, kõne-, tunnetuslike, keele-, õppimis- ja
            neuroloogiliste puudustega kasutajatel.
          </p>
        </div>

        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Eye className="w-5 h-5" />
            </div>

            <div>
              <h2 className="text-lg font-black text-blue-950 mb-2">
                Süsteemi tasemel seadistused
              </h2>

              <p className="text-sm leading-relaxed text-blue-900">
                Info juurdepääsetavust on võimalik parandada ka oma arvuti
                brauseri- ja operatsioonisüsteemi tasemel seadistades.
                Põhjalikum samateemaline juhend on kättesaadav{" "}
                <a
                  href="https://www.w3.org/WAI/users/browsing/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-bold underline"
                >
                  siin inglise keeles
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <article className="rounded-3xl bg-white border border-gray-200 shadow-sm p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Keyboard className="w-5 h-5" />
              </div>

              <h2 className="text-2xl font-black text-gray-900">
                Klaviatuuriga navigeerimine
              </h2>
            </div>

            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Sellel kodulehel on võimalik navigeerida ainult klaviatuuri
                abil. Navigatsioon toimub{" "}
                <span className="font-bold">Tab</span> klahvi abil. Iga
                vajutusega liigub fookus järgmisele elemendile. Hetkel aktiivset
                elementi märgib värvimuutus ja kastike selle ümber. Fookuses
                oleva lingi aktiveerimiseks tuleb vajutada klaviatuuril klahvi{" "}
                <span className="font-bold">Enter</span>.
              </p>

              <p>
                Esimene link{" "}
                <span className="font-bold">“Liigu edasi põhisisu juurde”</span>
                , mis sellisel viisil navigeerides aktiivseks muutub, on
                tavakasutaja eest varjatud ning mõeldud spetsiaalselt
                klaviatuuriga navigeerijatele. “Liigu edasi põhisisu juurde”
                jätab vahele päise ja hüppab lehe põhisisu juurde.
              </p>

              <p>
                Navigeerides nupule{" "}
                <span className="font-bold">“Juurdepääsetavus”</span>, avaneb
                aken, kus saab raadionupu{" "}
                <span className="font-bold">“Must ja kollane tekst”</span> abil
                vahetada lehe kujunduse kõrgkontrastseks – tekst muutub
                kollaseks ja taust mustaks.
              </p>
            </div>
          </article>

          <article className="rounded-3xl bg-white border border-gray-200 shadow-sm p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center">
                <MonitorUp className="w-5 h-5" />
              </div>

              <h2 className="text-2xl font-black text-gray-900">
                Sisu suurendamine
              </h2>
            </div>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <section>
                <h3 className="text-lg font-black text-gray-900 mb-3">
                  Veebilehitsejad
                </h3>

                <p>
                  Sisu suurendamiseks soovitame esmalt kasutada
                  veebilehitsejale sisseehitatud funktsionaalsust. Kõikides
                  populaarsetes veebilehitsejates on võimalik lehte suurendada
                  ja vähendada, kui hoida all{" "}
                  <kbd className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-sm font-bold">
                    Ctrl
                  </kbd>{" "}
                  klahvi, OS X operatsioonisüsteemis{" "}
                  <kbd className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-sm font-bold">
                    Cmd
                  </kbd>{" "}
                  klahvi, ja samal ajal vajutada kas{" "}
                  <kbd className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-sm font-bold">
                    +
                  </kbd>{" "}
                  või{" "}
                  <kbd className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-sm font-bold">
                    -
                  </kbd>{" "}
                  klahvi.
                </p>

                <p className="mt-4">
                  Teine mugav võimalus on kasutada hiirt: hoides all{" "}
                  <kbd className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-sm font-bold">
                    Ctrl
                  </kbd>{" "}
                  klahvi ja samal ajal liigutades hiire kerimisrulli. Tagasi
                  normaalsuurusesse saab, kui vajutada samaaegselt{" "}
                  <kbd className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-sm font-bold">
                    Ctrl
                  </kbd>{" "}
                  ja{" "}
                  <kbd className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-sm font-bold">
                    0
                  </kbd>{" "}
                  klahvile.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-black text-gray-900 mb-3">
                  Eraldiseisvad programmid
                </h3>

                <p>
                  Kõik enamlevinud operatsioonisüsteemid sisaldavad seadeid
                  ekraanil esitatava sisu suurendamiseks.
                </p>

                <ul className="mt-4 space-y-3 list-disc pl-6">
                  <li>
                    <span className="font-bold">Windows 10:</span> vajuta all
                    vasakul Windowsi logoga nupule ja samal ajal klaviatuuril
                    plussmärgiga nupule nii mitu korda, kui soovid suurendada.
                    Vähendamiseks vajuta Windowsi logo nuppu ja miinusmärgiga
                    nuppu.
                  </li>

                  <li>
                    <span className="font-bold">Apple arvutid:</span> navigeeri
                    järgnevalt: Apple menüü &gt; System Preferences &gt;
                    Accessibility või Universal Access &gt; Zoom.
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-black text-gray-900 mb-3">
                  Veebilehitseja laiendused
                </h3>

                <p>
                  Veebilehitsejate jaoks on olemas suurendamist võimaldavad
                  laiendused, mis täiendavad veebilehitseja olemasolevat
                  funktsionaalsust. Näiteks Firefoxi jaoks “Zoom Page”, mis
                  lubab suurendada nii kogu lehte kui ka ainult teksti; Chrome'i
                  jaoks AutoZoom.
                </p>
              </section>
            </div>
          </article>

          <article className="rounded-3xl bg-white border border-gray-200 shadow-sm p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center">
                <Volume2 className="w-5 h-5" />
              </div>

              <h2 className="text-2xl font-black text-gray-900">
                Ekraanilugeja kasutamine
              </h2>
            </div>

            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Ekraanilugeja on programm, mis üritab arvutiekraanil kujutatavat
                interpreteerida ja teistes vormides edasi anda - näiteks
                helidena või audiokommentaarina. Eelkõige on see abivahend
                vaegnägijate jaoks.
              </p>

              <p>
                Sellel kodulehel esitatud sisu on loodud vastavalt
                ekraanilugejatele arusaadavatele standarditele ja nii, et igat
                tüüpi visuaalset sisu on teises vormis võimalik taasesitada.
                Näiteks on piltidel küljes tekstilised kirjeldused, struktuursete
                elementide paigutus ja järjekord arvestab ekraanilugeja liikumist
                ekraanil ning võimaldab infot tarbida loogilises järjekorras.
              </p>

              <section className="pt-2">
                <h3 className="text-lg font-black text-gray-900 mb-3">
                  Valik populaarseid ekraanilugejaid
                </h3>

                <ul className="space-y-3 list-disc pl-6">
                  <li>
                    JAWS Windowsile —{" "}
                    <a
                      href="https://www.freedomscientific.com"
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-blue-700 underline"
                    >
                      külasta
                    </a>
                  </li>

                  <li>VoiceOver OS X süsteemile, sisseehitatud ja tasuta.</li>

                  <li>
                    NVDA Windowsile —{" "}
                    <a
                      href="https://www.nvaccess.org/download/"
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-blue-700 underline"
                    >
                      laadi alla
                    </a>
                  </li>

                  <li>
                    SystemAccess Windowsile —{" "}
                    <a
                      href="https://www.pneumasolutions.com/sero/"
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-blue-700 underline"
                    >
                      külasta
                    </a>
                  </li>
                </ul>
              </section>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}