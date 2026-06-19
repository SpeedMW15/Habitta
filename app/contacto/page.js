import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function ContactoPage() {
  const mensaje = "Hola, me gustaría recibir información sobre propiedades en venta.";

  return (
    <>
      <Navbar />

      <main className="contact-page">
        <section className="contact-card-page">
          <p>Contacto</p>
          <h1>Agenda una visita o pide información</h1>
          <span>
            Recibe atención personalizada para encontrar casa, departamento o terreno.
          </span>

          <div className="contact-actions">
            <a
              href={`https://wa.me/521XXXXXXXXXX?text=${encodeURIComponent(mensaje)}`}
              target="_blank"
              className="whatsapp-button"
            >
              Escribir por WhatsApp
            </a>

            <a href="tel:+52XXXXXXXXXX" className="call-button">
              Llamar ahora
            </a>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}