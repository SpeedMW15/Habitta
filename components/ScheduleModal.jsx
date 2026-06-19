"use client";

import { useState } from "react";
import { SITE_CONFIG } from "@/config/site";
import { supabase } from "@/lib/supabase";

export default function ScheduleModal({ propiedad }) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        nombre: "",
        telefono: "",
        fecha: "",
        hora: "",
    });

    function actualizar(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function enviarWhatsApp(e) {
        e.preventDefault();

        const mensaje = `
Hola, soy ${form.nombre}.

Estoy interesado en la propiedad:

🏠 ${propiedad.titulo}
📍 ${propiedad.ubicacion}

Me gustaría agendar una visita.

📅 Fecha: ${form.fecha}
🕓 Hora: ${form.hora}

Mi teléfono es: ${form.telefono}

Quedo atento a su confirmación.
`;

        const { error } = await supabase.from("citas").insert([
            {
                propiedad_id: propiedad.id,
                nombre: form.nombre,
                telefono: form.telefono,
                fecha: form.fecha,
                hora: form.hora,
                mensaje,
            },
        ]);

        if (error) {
            alert("No se pudo guardar la cita: " + error.message);
            return;
        }

        const url = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(
            mensaje
        )}`;

        window.location.href = url;
    }

    return (
        <>
            <button
                type="button"
                className="schedule-open-button"
                onClick={() => setOpen(true)}
            >
                📅 Agendar visita
            </button>

            {open && (
                <div className="modal-overlay">
                    <form className="schedule-modal" onSubmit={enviarWhatsApp}>
                        <button
                            type="button"
                            className="close-modal"
                            onClick={() => setOpen(false)}
                        >
                            ×
                        </button>

                        <p>Agendar visita</p>
                        <h2>{propiedad.titulo}</h2>

                        <input
                            name="nombre"
                            value={form.nombre}
                            onChange={actualizar}
                            placeholder="Tu nombre"
                            required
                        />

                        <input
                            name="telefono"
                            value={form.telefono}
                            onChange={actualizar}
                            placeholder="Tu teléfono"
                            required
                        />

                        <input
                            type="date"
                            name="fecha"
                            value={form.fecha}
                            onChange={actualizar}
                            required
                        />

                        <input
                            type="time"
                            name="hora"
                            value={form.hora}
                            onChange={actualizar}
                            required
                        />

                        <button type="submit">
                            Enviar solicitud por WhatsApp
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}