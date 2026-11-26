import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { UnidadCard } from "@/components/unidad-card";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIAS, esCategoria } from "@/lib/categorias";
import type { Unidad } from "@/lib/types/database";

// Sin prerenderizado: la profesora publica unidades desde el panel y los
// alumnos deben verlas al instante, sin esperar a un nuevo despliegue.
export const dynamic = "force-dynamic";

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;
  if (!esCategoria(categoria)) notFound();

  const config = CATEGORIAS[categoria];
  const supabase = await createClient();

  const { data: unidades } = await supabase
    .from("unidades")
    .select("*")
    .eq("categoria", categoria)
    .order("orden", { ascending: true })
    .returns<Unidad[]>();

  // Los ids de cada unidad, en una sola consulta. Antes solo se contaban,
  // pero la barra de progreso necesita saber cuales son para cruzarlos con lo
  // que el alumno lleva visto en su navegador.
  const unidadIds = (unidades || []).map((u) => u.id);
  let recursosPorUnidad: Record<string, string[]> = {};

  if (unidadIds.length > 0) {
    const { data: filas } = await supabase
      .from("recursos")
      .select("id, unidad_id")
      .in("unidad_id", unidadIds)
      .order("orden", { ascending: true });

    if (filas) {
      recursosPorUnidad = filas.reduce(
        (acc, r) => {
          (acc[r.unidad_id] ||= []).push(r.id);
          return acc;
        },
        {} as Record<string, string[]>
      );
    }
  }

  return (
    <>
      <Navbar />
      <HeroSection
        title={config.heroTitulo}
        subtitle={config.heroSubtitulo}
        categoria={categoria}
      />
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-12">
        {unidades && unidades.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {unidades.map((unidad) => (
              <UnidadCard
                key={unidad.id}
                unidad={unidad}
                recursoIds={recursosPorUnidad[unidad.id] || []}
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
