import Link from "next/link";

export default function Home() {
    return (
        <main>
            <h1>Avaleht</h1>
            <p>Tere tulemast! || admin roll</p>
            <Link href="/admin/users">Kasutajad</Link>
            <br />
            <Link href="/admin/programs">Programmid</Link>
            <br />
        </main>
    )
};