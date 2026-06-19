import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link href="/" className="navbar-logo">
        <Image
          src="/logo.png"
          alt="Habitta"
          width={140}
          height={60}
          priority
        />
      </Link>

      <div>
        <Link href="/">Inicio</Link>
        <Link href="/propiedades">Propiedades</Link>
        <Link href="/contacto">Contacto</Link>
      </div>
    </nav>
  );
}