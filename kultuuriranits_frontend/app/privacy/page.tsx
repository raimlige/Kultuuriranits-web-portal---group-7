import Link from "next/link";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-gray-50 py-14">
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-4xl mx-auto mb-12">
                    <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">
                        Privaatsuspoliitika
                    </h1>

                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Siit leiad ülevaate sellest, milliseid andmeid Kultuuriranitsa portaalis
                        töödeldakse ja milleks neid kasutatakse.
                    </p>
                </div>

                <div className="mb-8 rounded-3xl border border-blue-100 bg-blue-50 p-5 sm:p-6 text-left shadow-sm">
                    <p className="text-sm sm:text-base font-semibold text-blue-900 leading-relaxed">
                        <span className="font-black">Märkus:</span> tegemist on Tallinna Ülikooli
                        tarkvaraarenduse projekti raames loodud prototüübiga. Lehel olev info on
                        näitlik ega kujuta endast ametlikku teenust, juriidilist dokumenti ega päriselt toimiva portaali lõplikku privaatsuspoliitikat.
                    </p>
                </div>

                <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6 sm:p-8 lg:p-10 space-y-10">
                    <section className="space-y-3">
                        <h2 className="text-2xl font-black text-gray-900">
                            1. Üldine teave
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Kultuuriranits on kultuuriprogrammide ja õppematerjalide koondamise
                            portaal, mille eesmärk on aidata õpetajatel leida sobivaid
                            kultuurihariduslikke võimalusi ning kultuuriasutustel oma programme
                            hallata.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Isikuandmeid kasutatakse ainult portaali toimimiseks, kasutajakontode
                            haldamiseks, programmide kuvamiseks ning kasutajate ja asutuste vahelise
                            suhtluse toetamiseks.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-black text-gray-900">
                            2. Milliseid andmeid võime töödelda?
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Portaali kasutamisel võidakse töödelda järgmisi andmeid:
                        </p>

                        <ul className="list-disc pl-6 space-y-2 text-gray-600 leading-relaxed">
                            <li>kasutaja nimi, e-posti aadress ja roll;</li>
                            <li>kasutajaga seotud organisatsiooni andmed;</li>
                            <li>kultuuriprogrammide kirjeldused, kontaktandmed ja lisainfo;</li>
                            <li>programmi pildid ja õppematerjalid;</li>
                            <li>õpetajate lisatud lemmikud ja tagasiside;</li>
                            <li>portaali kasutamisega seotud tehniline info, näiteks sessiooniandmed.</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-black text-gray-900">
                            3. Milleks andmeid kasutatakse?
                        </h2>

                        <ul className="list-disc pl-6 space-y-2 text-gray-600 leading-relaxed">
                            <li>kasutaja sisselogimiseks ja rollipõhise ligipääsu võimaldamiseks;</li>
                            <li>kultuuriprogrammide ja õppematerjalide lisamiseks ning haldamiseks;</li>
                            <li>õpetajatele sobivate programmide kuvamiseks;</li>
                            <li>tagasiside, lemmikute ja teavituste funktsionaalsuse pakkumiseks;</li>
                            <li>portaali turvalisuse ja töökindluse tagamiseks.</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-black text-gray-900">
                            4. Failid ja õppematerjalid
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Kultuuriasutused võivad portaali lisada programmidega seotud pilte ja
                            õppematerjale. Failide üleslaadimisel vastutab üleslaadija selle eest,
                            et tal on õigus neid materjale portaalis kasutada ja avaldada.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-black text-gray-900">
                            5. Andmete säilitamine
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Andmeid säilitatakse nii kaua, kui see on vajalik portaali toimimiseks
                            või kuni kasutaja või asutus palub andmete muutmist või eemaldamist,
                            kui selline eemaldamine on võimalik.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-black text-gray-900">
                            6. Andmete jagamine
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Portaali andmeid ei müüda kolmandatele osapooltele. Andmeid võidakse
                            kuvada teistele kasutajatele ainult ulatuses, mis on vajalik portaali
                            põhifunktsioonide toimimiseks, näiteks kultuuriprogrammi kontaktandmete
                            näitamiseks õpetajale.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-black text-gray-900">
                            7. Kasutaja õigused
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Kasutajal on õigus küsida infot enda andmete kohta ning paluda andmete
                            parandamist või eemaldamist, kui see on portaali toimimise ja kehtivate
                            nõuetega kooskõlas.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-black text-gray-900">
                            8. Kontakt
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Privaatsusega seotud küsimuste korral võta meiega ühendust kontaktilehe
                            kaudu.
                        </p>

                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-extrabold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
                        >
                            Võta ühendust
                        </Link>
                    </section>
                </div>
            </section>
        </main>
    );
}