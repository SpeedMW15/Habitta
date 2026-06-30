"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";


export default function NuevaPropiedadPage() {
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
        imagenes: [],
    });

    const [resultadoIA, setResultadoIA] = useState("");
    const [loading, setLoading] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function verificarSesion() {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                router.push("/admin/login");
            }
        }

        verificarSesion();
    }, [router]);
    function actualizarCampo(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function generarContenidoIA() {
        setLoading(true);

        const res = await fetch("/api/generar-descripcion", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        });

        const data = await res.json();

        setResultadoIA(data.resultado || "No se pudo generar el contenido.");
        setLoading(false);
    }
    async function subirImagenes(propiedadId) {
        const urls = [];

        for (const archivo of form.imagenes) {
            const nombreLimpio = archivo.name
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-zA-Z0-9.-]/g, "-")
                .toLowerCase();

            const nombreArchivo = `${propiedadId}/${Date.now()}-${nombreLimpio}`;

            const { error } = await supabase.storage
                .from("propiedades")
                .upload(nombreArchivo, archivo);

            if (error) {
                alert("Error al subir imagen: " + error.message);
                return [];
            }

            const { data } = supabase.storage
                .from("propiedades")
                .getPublicUrl(nombreArchivo);

            urls.push(data.publicUrl);
        }

        return urls;
    }

    async function guardarPropiedad() {
        if (!form.titulo || !form.precio || !form.ubicacion) {
            alert("Completa todos los campos obligatorios.");

            return;
        }

        if (form.imagenes.length === 0) {
            alert("Debes seleccionar al menos una imagen.");

            return;
        }
        setGuardando(true);
        const { data, error } = await supabase
            .from("propiedades")
            .insert([
                {
                    titulo: form.titulo,
                    precio: form.precio,
                    ubicacion: form.ubicacion,
                    tipo: form.tipo,
                    recamaras: Number(form.recamaras) || 0,
                    banos: Number(form.banos) || 0,
                    estacionamientos: Number(form.estacionamientos) || 0,
                    metros: Number(form.metros) || 0,
                    descripcion: form.descripcion,
                    destacada: true,
                },
            ])
            .select()
            .single();

        if (error) {
            setGuardando(false);
            console.error(error);
            alert("Error al guardar la propiedad:\n\n" + error.message);
            return;
        }

        // Subir imágenes
        const urlsImagenes = await subirImagenes(data.id);

        if (urlsImagenes.length === 0) {
            setGuardando(false);
            alert("No se pudieron subir las imágenes.");
            return;
        }

        const imagenesData = urlsImagenes.map((url, index) => ({
            propiedad_id: data.id,
            url,
            orden: index + 1,
        }));

        console.log("Imágenes a insertar:", imagenesData);

        const { error: errorImagenes } = await supabase
            .from("imagenes_propiedad")
            .insert(imagenesData);

        if (errorImagenes) {
            console.error("ERROR INSERTANDO IMÁGENES:", errorImagenes);

            alert(
                "Error guardando imágenes:\n\n" +
                errorImagenes.message
            );

            setGuardando(false);
            return;
        }

        console.log("Imágenes guardadas correctamente.");

        setGuardando(false);

        alert("✅ Propiedad guardada correctamente.");

        router.push("/admin");
    }

    return (
        <main className="admin-page">
            <Link href="/admin" className="back-link">
                ← Volver al panel
            </Link>

            <section className="form-card">
                <p>Nueva propiedad</p>
                <h1>Agregar propiedad</h1>

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

                    <button type="button" onClick={generarContenidoIA}>
                        {loading ? "Generando..." : "✨ Generar contenido con IA"}
                    </button>

                    <textarea
                        name="descripcion"
                        value={form.descripcion}
                        onChange={actualizarCampo}
                        placeholder="Descripción de la propiedad"
                    ></textarea>

                    {resultadoIA && (
                        <div className="ai-result-box">
                            <h3>Resultado generado por IA</h3>
                            <button
                                type="button"
                                className="copy-ai-button"
                                onClick={() => navigator.clipboard.writeText(resultadoIA)}
                            >
                                Copiar texto
                            </button>

                            <button
                                type="button"
                                className="use-ai-button"
                                onClick={() => {
                                    const descripcionWeb = resultadoIA
                                        .split("**2. PUBLICACIÓN FACEBOOK:**")[0]
                                        .replace("Aquí te dejo la información solicitada:", "")
                                        .replace("**1. DESCRIPCIÓN WEB:**", "")
                                        .trim();

                                    setForm({ ...form, descripcion: descripcionWeb });
                                }}
                            >
                                Usar solo descripción web
                            </button>

                            <pre>{resultadoIA}</pre>
                        </div>
                    )}

                    <label className="upload-box">
                        <strong>Subir imágenes</strong>
                        <span>Selecciona fotos de la propiedad</span>

                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    imagenes: Array.from(e.target.files),
                                })
                            }
                            hidden
                        />

                        {form.imagenes.length > 0 && (
                            <small>{form.imagenes.length} imagen(es) seleccionada(s)</small>
                        )}
                    </label>

                    <button
                        type="button"
                        onClick={guardarPropiedad}
                        disabled={guardando}
                    >
                        {guardando ? "Guardando..." : "Guardar propiedad"}
                    </button>
                </form>
                <div className="preview-panel">
                    <p>Vista previa</p>

                    <article className="property-card preview-card">
                        <img
                            src={
                                form.imagenes.length > 0
                                    ? URL.createObjectURL(form.imagenes[0])
                                    : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200"
                            }
                            alt="Vista previa"
                        />

                        <div className="property-info">
                            <span className="property-type">{form.tipo}</span>

                            <p className="price">
                                {form.precio || "$0"}
                            </p>

                            <h3>
                                {form.titulo || "Título de la propiedad"}
                            </h3>

                            <p>
                                {form.ubicacion || "Ubicación de la propiedad"}
                            </p>

                            <div className="details">
                                {form.tipo !== "Terreno" && (
                                    <>
                                        <span>{form.recamaras || 0} rec.</span>
                                        <span>{form.banos || 0} baños</span>
                                        <span>{form.estacionamientos || 0} est.</span>
                                    </>
                                )}

                                <span>{form.metros || 0} m²</span>
                            </div>
                        </div>
                    </article>
                </div>
            </section>
        </main>
    );
}