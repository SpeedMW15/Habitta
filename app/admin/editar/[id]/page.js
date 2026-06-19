"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditarPropiedadPage({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    titulo: "",
    precio: "",
    ubicacion: "",
    tipo: "Casa",
    recamaras: "",
    banos: "",
    estacionamientos: "",
    metros: "",
    descripcion: "",
    estado: "Disponible",
  });

  useEffect(() => {
    async function cargarPropiedad() {
      const { id } = await params;

      const { data, error } = await supabase
        .from("propiedades")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert("Error al cargar propiedad: " + error.message);
        router.push("/admin");
        return;
      }

      setForm({
        titulo: data.titulo || "",
        precio: data.precio || "",
        ubicacion: data.ubicacion || "",
        tipo: data.tipo || "Casa",
        recamaras: data.recamaras || "",
        banos: data.banos || "",
        estacionamientos: data.estacionamientos || "",
        metros: data.metros || "",
        descripcion: data.descripcion || "",
        estado: data.estado || "Disponible",
      });

      setLoading(false);
    }

    cargarPropiedad();
  }, [params, router]);

  function actualizarCampo(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function guardarCambios() {
    const { id } = await params;

    const { error } = await supabase
      .from("propiedades")
      .update({
        titulo: form.titulo,
        precio: form.precio,
        ubicacion: form.ubicacion,
        tipo: form.tipo,
        recamaras: Number(form.recamaras) || 0,
        banos: Number(form.banos) || 0,
        estacionamientos: Number(form.estacionamientos) || 0,
        metros: Number(form.metros) || 0,
        descripcion: form.descripcion,
        estado: form.estado,
      })
      .eq("id", id);

    if (error) {
      alert("Error al guardar: " + error.message);
      return;
    }

    alert("Propiedad actualizada correctamente");
    router.push("/admin");
  }

  if (loading) {
    return <main className="admin-page">Cargando propiedad...</main>;
  }

  return (
    <main className="admin-page">
      <Link href="/admin" className="back-link">
        ← Volver al panel
      </Link>

      <section className="form-card">
        <p>Editar propiedad</p>
        <h1>Modificar datos</h1>

        <form className="property-form">
          <input
            name="titulo"
            value={form.titulo}
            onChange={actualizarCampo}
            placeholder="Título de la propiedad"
          />

          <input
            name="precio"
            value={form.precio}
            onChange={(e) => {
              const soloNumeros = e.target.value.replace(/\D/g, "");
              const formateado = soloNumeros
                ? "$" + Number(soloNumeros).toLocaleString("es-MX")
                : "";

              setForm({
                ...form,
                precio: formateado,
              });
            }}
            placeholder="$0"
          />

          <input
            name="ubicacion"
            value={form.ubicacion}
            onChange={actualizarCampo}
            placeholder="Ubicación"
          />

          <select name="tipo" value={form.tipo} onChange={actualizarCampo}>
            <option>Casa</option>
            <option>Departamento</option>
            <option>Terreno</option>
          </select>

          <select name="estado" value={form.estado} onChange={actualizarCampo}>
            <option>Disponible</option>
            <option>Apartada</option>
            <option>Vendida</option>
          </select>

          <div className="form-grid">
            {form.tipo !== "Terreno" && (
              <>
                <input
                  name="recamaras"
                  value={form.recamaras}
                  onChange={actualizarCampo}
                  placeholder="Recámaras"
                />

                <input
                  name="banos"
                  value={form.banos}
                  onChange={actualizarCampo}
                  placeholder="Baños"
                />

                <input
                  name="estacionamientos"
                  value={form.estacionamientos}
                  onChange={actualizarCampo}
                  placeholder="Estacionamientos"
                />
              </>
            )}

            <input
              name="metros"
              value={form.metros}
              onChange={actualizarCampo}
              placeholder="Metros²"
            />
          </div>

          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={actualizarCampo}
            placeholder="Descripción de la propiedad"
          ></textarea>

          <button type="button" onClick={guardarCambios}>
            Guardar cambios
          </button>
        </form>
      </section>
    </main>
  );
}