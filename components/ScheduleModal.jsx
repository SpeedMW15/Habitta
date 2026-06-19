"use client";

import { useState } from "react";
import { SITE_CONFIG } from "@/config/site";

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

    function enviarWhatsApp() {
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

        const url = `https://api.whatsapp.com/send?phone=${SITE_CONFIG.whatsapp}&text=${encodeURIComponent(
            mensaje
        )}`;

        window.location.href = url;
    }

    return (
        <>
            <button className="schedule-button" onClick={() => setOpen(true)}>
                📅 Agendar visita
            </button>

            {open && (
                <div className="modal-overlay">
                    <div className="schedule-modal">
                        <button className="close-modal" onClick={() => setOpen(false)}>
                            ×
                        </button>

                        <p>Agendar visita</p>
                        <h2>{propiedad.titulo}</h2>

                        <input
                            name="nombre"
                            value={form.nombre}
                            onChange={actualizar}
                            placeholder="Tu nombre"
                        />

                        <input
                            name="telefono"
                            value={form.telefono}
                            onChange={actualizar}
                            placeholder="Tu teléfono"
                        />

                        <input
                            type="date"
                            name="fecha"
                            value={form.fecha}
                            onChange={actualizar}
                        />

                        <input
                            type="time"
                            name="hora"
                            value={form.hora}
                            onChange={actualizar}
                        />

                        <button onClick={enviarWhatsApp}>
                            Enviar solicitud por WhatsApp
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}