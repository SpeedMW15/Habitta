import Link from "next/link";

export default function PropertyCard({ propiedad }) {
  return (
    <article className="property-card">
      <div className={`property-ribbon ribbon-${propiedad.estado?.toLowerCase()}`}>
        {propiedad.estado || "Disponible"}
      </div>
      <img src={propiedad.imagen} alt={propiedad.titulo} />

      <div className="property-info">
        <span className="property-type">{propiedad.tipo}</span>
        <p className="price">{propiedad.precio}</p>
        <h3>{propiedad.titulo}</h3>
        <p>{propiedad.ubicacion}</p>

        <div className="details">
          {propiedad.tipo !== "Terreno" && (
            <>
              <span>{propiedad.recamaras} rec.</span>
              <span>{propiedad.banos} baños</span>
              <span>{propiedad.estacionamientos} est.</span>
            </>
          )}

          <span>{propiedad.metros} m²</span>
        </div>

        <Link href={`/propiedades/${propiedad.id}`} className="card-button">
          Ver propiedad
        </Link>
      </div>
    </article>
  );
}