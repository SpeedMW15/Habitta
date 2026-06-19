"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  let activeIndex = 0;
  if (pathname.startsWith("/propiedades")) activeIndex = 1;
  if (pathname.startsWith("/contacto")) activeIndex = 2;

  return (
    <header className="premium-navbar">
      <Link href="/" className="premium-logo">
        <Image
          src="/logo.png"
          alt="Habitta"
          width={230}
          height={90}
          priority
          className="premium-logo-img"
        />
      </Link>

      <nav className="premium-nav-links" style={{ "--active-index": activeIndex }}>
        <span className="nav-pill"></span>

        <Link href="/" className={pathname === "/" ? "is-active" : ""}>
          Inicio
        </Link>

        <Link
          href="/propiedades"
          className={pathname.startsWith("/propiedades") ? "is-active" : ""}
        >
          Propiedades
        </Link>

        <Link
          href="/contacto"
          className={pathname.startsWith("/contacto") ? "is-active" : ""}
        >
          Contacto
        </Link>
      </nav>

      <Link href="/contacto" className="nav-cta">
        Agendar una cita
      </Link>
    </header>
  );
}