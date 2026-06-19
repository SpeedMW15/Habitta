"use client";

import { useState } from "react";

export default function Gallery({ imagenes }) {
  const [imagenActiva, setImagenActiva] = useState(imagenes[0]);

  return (
    <section className="gallery">
      <img className="main-gallery-img" src={imagenActiva} alt="Propiedad" />

      <div className="gallery-thumbs">
        {imagenes.map((imagen, index) => (
          <button
            key={index}
            onClick={() => setImagenActiva(imagen)}
            className={imagenActiva === imagen ? "active-thumb" : ""}
          >
            <img src={imagen} alt={`Foto ${index + 1}`} />
          </button>
        ))}
      </div>
    </section>
  );
}