import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link href="/" className="logo">
        Habitta
      </Link>

      <div>
        <Link href="/">Inicio</Link>
        <Link href="/propiedades">Propiedades</Link>
        <Link href="/contacto">Contacto</Link>
      </div>
    </nav>
  );
}