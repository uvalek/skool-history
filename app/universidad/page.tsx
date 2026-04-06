import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { UnidadCard } from "@/components/unidad-card";
import { createClient } from "@/lib/supabase/server";
import type { Unidad } from "@/lib/types/database";

export default async function UniversidadPage() {
  const supabase = await createClient();

  const { data: unidades } = await supabase
    .from("unidades")
    .select("*")
    .eq("categoria", "universidad")
    .order("orden", { ascending: true })
    .returns<Unidad[]>();

  // Obtener conteo de recursos por unidad
  const unidadIds = (unidades || []).map((u) => u.id);
  let recursoCounts: Record<string, number> = {};

  if (unidadIds.length > 0) {
    const { data: countData } = await supabase
      .from("recursos")
      .select("unidad_id")
      .in("unidad_id", unidadIds);

    if (countData) {
      recursoCounts = countData.reduce(
        (acc, r) => {
          acc[r.unidad_id] = (acc[r.unidad_id] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );
    }
  }

  return (
    <>
      <Navbar />
      <HeroSection
        title="Historia — Universidad"
        subtitle="Accede a los recursos académicos de historia para el nivel universitario."
        variant="universidad"
      />
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-12">
        {unidades && unidades.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {unidades.map((unidad) => (
              <UnidadCard
                key={unidad.id}
                unidad={unidad}
                recursoCount={recursoCounts[unidad.id] || 0}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-lg text-ds-on-surface-variant">
              Aún no hay unidades disponibles. ¡Vuelve pronto!
            </p>
          </div>
        )}
      </main>
    </>
  );
}
