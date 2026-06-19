export default function Hero() {
  return (
    <section className="premium-hero">
      <div className="hero-overlay"></div>

      <div className="premium-hero-content">
        <p className="hero-kicker">Bienvenido a Habitta Inmobiliaria</p>

        <h1>
          Encuentra la casa ideal para tu <span>familia</span>
        </h1>

        <p className="hero-description">
          Compra, venta y renta de propiedades con atención personalizada.
        </p>

        <form className="premium-search">
          <input placeholder="Buscar por ciudad o zona..." />
          <button type="button">Buscar</button>
        </form>

        <div className="hero-benefits">
          <div>
            <strong>Seguridad</strong>
            <small>Propiedades verificadas</small>
          </div>

          <div>
            <strong>Atención personalizada</strong>
            <small>Asesoría en todo el proceso</small>
          </div>

          <div>
            <strong>Mejores opciones</strong>
            <small>Al mejor precio del mercado</small>
          </div>
        </div>
      </div>
    </section>
  );
}