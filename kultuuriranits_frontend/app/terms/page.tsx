import Link from "next/link";

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-gray-50 py-14">
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-4xl mx-auto mb-12">
                    <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">
                        Kasutustingimused
                    </h1>

                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Need tingimused kirjeldavad Kultuuriranitsa portaali kasutamise üldiseid
                        põhimõtteid.
                    </p>
                </div>

                <div className="mb-8 rounded-3xl border border-blue-100 bg-blue-50 p-5 sm:p-6 text-left shadow-sm">
                    <p className="text-sm sm:text-base font-semibold text-blue-900 leading-relaxed">
                        <span className="font-black">Märkus:</span> tegemist on Tallinna Ülikooli
                        tarkvaraarenduse projekti raames loodud prototüübiga. Lehel olev info on
                        näitlik ega kujuta endast ametlikku teenust, juriidilist dokumenti ega
                        päriselt toimiva portaali lõplikke tingimusi.
                    </p>
                </div>

                <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6 sm:p-8 lg:p-10 space-y-10">
                    <section className="space-y-3">
                        <h2 className="text-2xl font-black text-gray-900">
                            1. Portaali eesmärk
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Kultuuriranits on portaal, mis koondab kultuuriprogramme,
                            õppematerjale ja nendega seotud infot. Portaali eesmärk on muuta
                            kultuurihariduslikud võimalused õpetajatele, koolidele ja
                            kultuuriasutustele paremini leitavaks.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-black text-gray-900">
                            2. Kasutajakontod ja rollid
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Portaalis võivad olla erinevad kasutajarollid, näiteks õpetaja,
                            kultuuriasutus ja administraator. Rollist sõltub, milliseid toiminguid
                            kasutaja portaalis teha saab.
                        </p>

                        <ul className="list-disc pl-6 space-y-2 text-gray-600 leading-relaxed">
                            <li>õpetaja saab otsida programme, lisada lemmikuid ja anda tagasisidet;</li>
                            <li>kultuuriasutus saab hallata enda programme ja õppematerjale;</li>
                            <li>administraator saab hallata portaali sisu ja kasutajaid.</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-black text-gray-900">
                            3. Kasutaja vastutus
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Kasutaja vastutab selle eest, et tema sisestatud andmed oleksid
                            korrektsed, asjakohased ja ei rikuks kolmandate isikute õigusi.
                        </p>

                        <ul className="list-disc pl-6 space-y-2 text-gray-600 leading-relaxed">
                            <li>portaali ei tohi lisada eksitavat või sobimatut sisu;</li>
                            <li>üleslaetud failide kasutamiseks peab kasutajal olema vastav õigus;</li>
                            <li>kontaktandmed ja programmi info peavad olema võimalikult ajakohased.</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-black text-gray-900">
                            4. Kultuuriprogrammid ja õppematerjalid
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Kultuuriasutus vastutab enda lisatud programmide, kirjelduste,
                            hindade, toimumisinfo, piltide ja õppematerjalide õigsuse eest.
                            Portaal võib kuvada neid andmeid õpetajatele ja teistele kasutajatele.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-black text-gray-900">
                            5. Keelatud tegevused
                        </h2>

                        <ul className="list-disc pl-6 space-y-2 text-gray-600 leading-relaxed">
                            <li>portaali tahtlik häirimine või tehniline ründamine;</li>
                            <li>valeandmete sisestamine;</li>
                            <li>teiste kasutajate kontodele ligipääsu proovimine;</li>
                            <li>autoriõigusi või isikuandmeid rikkuva sisu üleslaadimine;</li>
                            <li>portaali kasutamine eesmärgil, mis ei ole seotud selle põhifunktsioonidega.</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-black text-gray-900">
                            6. Portaali kättesaadavus
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Portaal võib aeg-ajalt olla ajutiselt kättesaamatu hooldustööde,
                            arenduse või tehniliste probleemide tõttu. Püüame tagada portaali
                            võimalikult sujuva toimimise.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-black text-gray-900">
                            7. Sisu muutmine ja eemaldamine
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Portaali haldajal on õigus parandada, peita või eemaldada sisu, mis on
                            ebatäpne, aegunud, sobimatu või vastuolus portaali eesmärgiga.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-black text-gray-900">
                            8. Tingimuste muutmine
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Kasutustingimusi võidakse vajadusel uuendada. Uuendatud tingimused
                            avaldatakse samal lehel.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-black text-gray-900">
                            9. Kontakt
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Küsimuste korral võta meiega ühendust kontaktilehe kaudu.
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