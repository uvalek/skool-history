import type { Categoria, Recurso, Unidad } from "@/lib/types/database";

/** Dias sin cambios a partir de los cuales una unidad se considera desactualizada. */
export const DIAS_DESACTUALIZADA = 30;

export interface ConteoPorCategoria {
  total: number;
  secundaria: number;
  universidad: number;
}

export interface UnidadConMetricas extends Unidad {
  recursoCount: number;
  diasSinEditar: number;
}

export interface Estadisticas {
  unidades: ConteoPorCategoria;
  recursos: ConteoPorCategoria;
  videos: number;
  archivos: number;
  /** Todas las unidades con su conteo de recursos y antiguedad. */
  todas: UnidadConMetricas[];
  vacias: UnidadConMetricas[];
  desactualizadas: UnidadConMetricas[];
  recientes: UnidadConMetricas[];
}

/** Agrupa los recursos por unidad. Mismo patron que usan las paginas publicas. */
export function contarRecursosPorUnidad(
  recursos: Recurso[]
): Record<string, number> {
  return recursos.reduce(
    (acc, r) => {
      if (r.unidad_id) acc[r.unidad_id] = (acc[r.unidad_id] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
}

function diasDesde(fecha: string): number {
  const ms = Date.now() - new Date(fecha).getTime();
  return Math.floor(ms / 86_400_000);
}

function porCategoria<T extends { categoria: Categoria }>(
  items: T[]
): ConteoPorCategoria {
  return {
    total: items.length,
    secundaria: items.filter((i) => i.categoria === "secundaria").length,
    universidad: items.filter((i) => i.categoria === "universidad").length,
  };
}

export function calcularEstadisticas(
  unidades: Unidad[],
  recursos: Recurso[]
): Estadisticas {
  const conteos = contarRecursosPorUnidad(recursos);

  const conMetricas: UnidadConMetricas[] = unidades.map((u) => ({
    ...u,
    recursoCount: conteos[u.id] || 0,
    diasSinEditar: diasDesde(u.updated_at),
  }));

  // Un recurso puede enlazar varios videos y archivos, de ahi la suma anidada.
  const videos = recursos.reduce(
    (n, r) => n + r.urls_video.filter(Boolean).length,
    0
  );
  const archivos = recursos.reduce(
    (n, r) => n + r.urls_recurso.filter(Boolean).length,
    0
  );

  return {
    unidades: porCategoria(unidades),
    recursos: porCategoria(recursos),
    videos,
    archivos,
    todas: conMetricas,
    vacias: conMetricas.filter((u) => u.recursoCount === 0),
    desactualizadas: conMetricas
      .filter((u) => u.diasSinEditar >= DIAS_DESACTUALIZADA)
      .sort((a, b) => b.diasSinEditar - a.diasSinEditar),
    recientes: [...conMetricas]
      .sort((a, b) => a.diasSinEditar - b.diasSinEditar)
      .slice(0, 5),
  };
}

/**
 * Une las unidades que piden atencion: primero las vacias (mas urgentes,
 * porque los alumnos ven una unidad sin contenido) y luego las desactualizadas,
 * sin repetir las que caen en ambos grupos.
 */
export function unidadesQueNecesitanAtencion(
  stats: Estadisticas,
  limite = 6
): UnidadConMetricas[] {
  const vistas = new Set(stats.vacias.map((u) => u.id));
  return [
    ...stats.vacias,
    ...stats.desactualizadas.filter((u) => !vistas.has(u.id)),
  ].slice(0, limite);
}

const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

/** "hoy", "hace 3 dias", "hace 2 meses" */
export function tiempoRelativo(fecha: string): string {
  const dias = diasDesde(fecha);
  if (dias < 1) return "hoy";
  if (dias < 30) return rtf.format(-dias, "day");
  if (dias < 365) return rtf.format(-Math.floor(dias / 30), "month");
  return rtf.format(-Math.floor(dias / 365), "year");
}

export const etiquetaCategoria: Record<Categoria, string> = {
  secundaria: "Secundaria",
  universidad: "Universidad",
};
