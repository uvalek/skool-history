import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { UnidadCard } from "@/components/unidad-card";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIAS, esCategoria } from "@/lib/categorias";
import { tipoRecurso } from "@/lib/tipos-recurso";
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
  //
  // Van en dos cuentas distintas a proposito: la insignia dice cuanto material
  // hay en total, y la barra mide solo lo que hay que estudiar. Si las
  // referencias entraran en la barra, una unidad con veinte entradas de
  // bibliografia se veria casi vacia de avance para siempre.
  const unidadIds = (unidades || []).map((u) => u.id);
  const idsQueCuentanPorUnidad: Record<string, string[]> = {};
  const totalPorUnidad: Record<string, number> = {};

  if (unidadIds.length > 0) {
    const { data: filas } = await supabase
      .from("recursos")
      .select("id, unidad_id, tipo")
      .in("unidad_id", unidadIds)
      .order("orden", { ascending: true });

    for (const fila of filas || []) {
      totalPorUnidad[fila.unidad_id] = (totalPorUnidad[fila.unidad_id] || 0) + 1;
      if (tipoRecurso(fila.tipo).cuenta) {
        (idsQueCuentanPorUnidad[fila.unidad_id] ||= []).push(fila.id);
      }
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
                recursoIds={idsQueCuentanPorUnidad[unidad.id] || []}
                recursoCount={totalPorUnidad[unidad.id] || 0}
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
