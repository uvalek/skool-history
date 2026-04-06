import { Navbar } from "@/components/navbar";
import { HandWrittenTitle } from "@/components/ui/hand-writing-text";
import { GateSelector } from "@/components/gate-selector";

export default function Home() {
  return (
    <>
      <Navbar />
      <section className="px-6 pt-6 pb-2">
        <div className="mx-auto max-w-7xl">
          <HandWrittenTitle
            title="Explora la Historia"
            subtitle="Selecciona tu nivel educativo para acceder a los recursos de estudio."
            strokeColor="text-[#5d48ce]"
          />
        </div>
      </section>
      <main className="mx-auto max-w-7xl flex-1 px-6 py-12">
        <GateSelector />
      </main>
    </>
  );
}
