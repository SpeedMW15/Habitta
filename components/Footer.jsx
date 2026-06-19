import Link from "next/link";
export default function Footer() {
  return (
    <footer className="footer">
      <h2>Habitta</h2>
      <p>Asesoría inmobiliaria profesional.</p>
      <p>Contacto por WhatsApp disponible.</p>

      <Link href="/admin" className="admin-footer-link">
        Administración
      </Link>
    </footer>
    
  );
}