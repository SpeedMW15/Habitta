export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <p>Asesoría inmobiliaria profesional</p>
        <h1>Encuentra la casa ideal para tu familia</h1>
        <span>Compra, venta y renta de propiedades con atención personalizada.</span>

        <div className="search-box">
          <input placeholder="Buscar por ciudad o zona..." />
          <button>Buscar</button>
        </div>
      </div>
    </section>
  );
}