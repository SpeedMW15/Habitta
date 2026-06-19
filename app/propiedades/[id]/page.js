import Link from "next/link";
import Gallery from "@/components/Gallery";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { supabase } from "@/lib/supabase";
import ScheduleModal from "@/components/ScheduleModal";
import { SITE_CONFIG } from "@/config/site";

export default async function PropertyPage({ params }) {
    const { id } = await params;

    const { data: propiedad, error } = await supabase
        .from("propiedades")
        .select(`
      *,
      imagenes_propiedad (
        url,
        orden
      )
    `)
        .eq("id", id)
        .single();

    if (error || !propiedad) {
        return (
            <main className="property-detail-page">
                <Link href="/propiedades" className="back-link">
                    ← Regresar al catálogo
                </Link>
                <h1>Propiedad no encontrada</h1>
            </main>
        );
    }

    const imagenes =
        propiedad.imagenes_propiedad?.length > 0
            ? propiedad.imagenes_propiedad
                .sort((a, b) => a.orden - b.orden)
                .map((img) => img.url)
            : ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200"];

    const mensaje = `Hola, me interesa la propiedad: ${propiedad.titulo}`;

    return (
        <main className="property-detail-page">
            <Link href="/propiedades" className="back-link">
                ← Regresar al catálogo
            </Link>

            <Gallery imagenes={imagenes} />

            <section className="detail-content">
                <div>
                    <span className="property-type">{propiedad.tipo}</span>
                    <h1>{propiedad.titulo}</h1>
                    <p className="detail-location">{propiedad.ubicacion}</p>
                    <p className="detail-price">{propiedad.precio}</p>

                    <div className="detail-features">
                        {propiedad.tipo !== "Terreno" && (
                            <>
                                <span>{propiedad.recamaras} recámaras</span>
                                <span>{propiedad.banos} baños</span>
                                <span>{propiedad.estacionamientos} estacionamientos</span>
                            </>
                        )}
                        <span>{propiedad.metros} m²</span>
                    </div>

                    <h2>Descripción</h2>
                    <p className="detail-description">{propiedad.descripcion}</p>
                </div>

                <aside className="contact-card">
                    <h3>¿Te interesa esta propiedad?</h3>
                    <p>Contacta a la asesora para recibir más información.</p>

                    <a
                        href={`whatsapp://send?phone=${SITE_CONFIG.whatsapp}&text=${encodeURIComponent(mensaje)}`}
                        className="whatsapp-button"
                    >
                        Contactar por WhatsApp
                    </a>

                    <ScheduleModal propiedad={propiedad} />
                </aside>
            </section>

            <WhatsAppFloat />
        </main>
    );
}