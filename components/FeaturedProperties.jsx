"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import PropertyCard from "@/components/PropertyCard";

export default function FeaturedProperties() {
  const [propiedades, setPropiedades] = useState([]);

  useEffect(() => {
    async function cargarPropiedades() {
      const { data, error } = await supabase
        .from("propiedades")
        .select(`
          *,
          imagenes_propiedad (
            url,
            orden
          )
        `)
        .order("creado_en", { ascending: false })
        .limit(4);

      if (error) {
        console.log("Error cargando propiedades:", error);
        return;
      }

      const propiedadesConImagen = data.map((propiedad) => ({
        ...propiedad,
        imagen:
          propiedad.imagenes_propiedad
            ?.sort((a, b) => a.orden - b.orden)?.[0]?.url ||
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200",
      }));

      setPropiedades(propiedadesConImagen);
    }

    cargarPropiedades();
  }, []);

  return (
    <section className="home-properties-section">
      <div className="home-properties-intro">
        <p>Propiedades destacadas</p>
        <h2>Encuentra la propiedad perfecta para ti</h2>

        <Link href="/propiedades" className="view-all-button">
          Ver todas las propiedades →
        </Link>
      </div>

      <div className="home-properties-grid">
        {propiedades.map((propiedad) => (
          <PropertyCard key={propiedad.id} propiedad={propiedad} />
        ))}
      </div>
    </section>
  );
}