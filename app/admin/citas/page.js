"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CitasPage() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  async function cargarCitas() {
    const { data, error } = await supabase
      .from("citas")
      .select(`
        *,
        propiedades (
          titulo,
          ubicacion
        )
      `)
      .order("creado_en", { ascending: false });

    if (error) {
      alert("Error cargando citas: " + error.message);
      setLoading(false);
      return;
    }

    setCitas(data);
    setLoading(false);
  }

  useEffect(() => {
    cargarCitas();
  }, []);

  return (
    <main className="admin-page">
      <Link href="/admin" className="back-link">
        ← Volver al panel
      </Link>

      <section className="admin-header">
        <div>
          <p>Agenda</p>
          <h1>Citas recibidas</h1>
          <span>Solicitudes de visita enviadas por clientes.</span>
        </div>
      </section>

      {loading ? (
        <p>Cargando citas...</p>
      ) : citas.length === 0 ? (
        <p>No hay citas registradas.</p>
      ) : (
        <section className="appointments-list">
          {citas.map((cita) => (
            <article className="appointment-card" key={cita.id}>
              <div>
                <p className="appointment-date">
                  {cita.fecha} · {cita.hora}
                </p>

                <h3>{cita.nombre}</h3>

                <p>
                  <strong>Teléfono:</strong> {cita.telefono}
                </p>

                <p>
                  <strong>Propiedad:</strong>{" "}
                  {cita.propiedades?.titulo || "Propiedad eliminada"}
                </p>

                <p>
                  <strong>Ubicación:</strong>{" "}
                  {cita.propiedades?.ubicacion || "Sin ubicación"}
                </p>
              </div>

              <a
                href={`https://wa.me/52${cita.telefono.replace(/\D/g, "")}`}
                target="_blank"
                className="whatsapp-button"
              >
                Responder por WhatsApp
              </a>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}