"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminPage() {
    const router = useRouter();
    const [propiedades, setPropiedades] = useState([]);
    const [loading, setLoading] = useState(true);

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
            console.error("Error cargando propiedades:", error);
            alert("Error cargando propiedades: " + error.message);
            setLoading(false);
            return;
        }

        const propiedadesConImagen = data.map((propiedad) => ({
            ...propiedad,
            imagen:
                propiedad.imagenes_propiedad?.[0]?.url ||
                "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200",
        }));

        setPropiedades(propiedadesConImagen);
        setLoading(false);
    }

    async function eliminarPropiedad(id) {
        const confirmar = confirm("¿Seguro que quieres eliminar esta propiedad?");
        if (!confirmar) return;

        const { error } = await supabase
            .from("propiedades")
            .delete()
            .eq("id", id);

        if (error) {
            alert("Error al eliminar: " + error.message);
            return;
        }

        setPropiedades(propiedades.filter((propiedad) => propiedad.id !== id));
        alert("Propiedad eliminada correctamente");
    }

    async function cerrarSesion() {
        await supabase.auth.signOut();
        router.push("/admin/login");
    }

    useEffect(() => {
        cargarPropiedades();
    }, []);

    return (
        <main className="admin-page">
            <section className="admin-header">
                <div>
                    <p>Panel privado</p>
                    <h1>Administrar propiedades</h1>
                    <span>Gestiona casas, departamentos y terrenos disponibles.</span>
                </div>

                <div className="admin-actions">
                    <Link href="/admin/nueva" className="admin-add-button">
                        + Agregar propiedad
                    </Link>

                    <Link href="/admin/citas" className="admin-add-button">
                        📅 Ver citas
                    </Link>

                    <button onClick={cerrarSesion}>
                        Cerrar sesión
                    </button>
                </div>
            </section>

            {loading ? (
                <p>Cargando propiedades...</p>
            ) : propiedades.length === 0 ? (
                <p>No hay propiedades registradas.</p>
            ) : (
                <section className="admin-list">
                    {propiedades.map((propiedad) => (
                        <article className="admin-property-card" key={propiedad.id}>
                            <img src={propiedad.imagen} alt={propiedad.titulo} />

                            <div className="admin-property-info">
                                <span>{propiedad.tipo}</span>
                                <h3>{propiedad.titulo}</h3>
                                <p>{propiedad.ubicacion}</p>
                                <strong>{propiedad.precio}</strong>
                                <p className={`status-badge status-${propiedad.estado?.toLowerCase()}`}>
                                    {propiedad.estado}
                                </p>
                            </div>

                            <div className="admin-actions">
                                <Link href={`/admin/editar/${propiedad.id}`}>
                                    <button>Editar</button>
                                </Link>

                                <button
                                    className="delete-button"
                                    onClick={() => eliminarPropiedad(propiedad.id)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </article>
                    ))}
                </section>
            )}
        </main>
    );
}