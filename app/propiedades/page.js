"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { supabase } from "@/lib/supabase";

export default function PropiedadesPage() {
  const [propiedades, setPropiedades] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [tipo, setTipo] = useState("Todos");

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
        .order("creado_en", { ascending: false });

      if (error) {
        console.log(error);
        return;
      }

      const propiedadesConImagen = data.map((propiedad) => ({
        ...propiedad,
        imagen:
          propiedad.imagenes_propiedad?.[0]?.url ||
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200",
      }));

      setPropiedades(propiedadesConImagen);
    }

    cargarPropiedades();
  }, []);

  const propiedadesFiltradas = propiedades.filter((propiedad) => {
    const coincideBusqueda =
      propiedad.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      propiedad.ubicacion.toLowerCase().includes(busqueda.toLowerCase());

    const coincideTipo = tipo === "Todos" || propiedad.tipo === tipo;

    return coincideBusqueda && coincideTipo;
  });

  return (
    <>
      <Navbar />

      <main className="catalog-page">
        <section className="catalog-header">
          <p>Catálogo</p>
          <h1>Propiedades disponibles</h1>
          <span>Casas, departamentos y terrenos en venta.</span>
        </section>

        <section className="filters-box">
          <input
            type="text"
            placeholder="Buscar por ubicación o nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <div className="filter-buttons">
            {["Todos", "Casa", "Departamento", "Terreno"].map((item) => (
              <button
                key={item}
                onClick={() => setTipo(item)}
                className={tipo === item ? "active-filter" : ""}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="properties-grid">
          {propiedadesFiltradas.length > 0 ? (
            propiedadesFiltradas.map((propiedad) => (
              <PropertyCard key={propiedad.id} propiedad={propiedad} />
            ))
          ) : (
            <p className="no-results">No se encontraron propiedades.</p>
          )}
        </section>
      </main>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}