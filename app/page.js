import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PropertyCard from "@/components/PropertyCard";
import Footer from "@/components/Footer";
import { propiedades } from "@/data/propiedades";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />

      <section className="properties-section">
        <div className="section-header">
          <p>Propiedades disponibles</p>
          <h2>Casas destacadas</h2>
        </div>

        <div className="properties-grid">
          {propiedades.map((propiedad) => (
            <PropertyCard key={propiedad.id} propiedad={propiedad} />
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}