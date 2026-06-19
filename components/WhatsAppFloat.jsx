export default function WhatsAppFloat() {
  const mensaje = "Hola, me interesa recibir información sobre propiedades en venta.";

  return (
    <a
      href={`https://wa.me/521XXXXXXXXXX?text=${encodeURIComponent(mensaje)}`}
      className="whatsapp-float"
      target="_blank"
    >
      WhatsApp
    </a>
  );
}