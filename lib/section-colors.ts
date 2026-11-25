import { CATEGORIAS } from "@/lib/categorias";
import type { Categoria } from "@/lib/types/database";

/** Secciones del panel: el dashboard mas una por categoria. */
export type SeccionColor = "dashboard" | Categoria;

export interface ColoresSeccion {
  accent: string;
  /** Texto legible encima de accent. */
  onAccent: string;
  light: string;
  onLight: string;
  base: string;
  glow: string;
}

const dashboard: ColoresSeccion = {
  accent: "var(--cat-dashboard-accent)",
  onAccent: "var(--cat-dashboard-on-accent)",
  light: "var(--cat-dashboard-light)",
  onLight: "var(--cat-dashboard-on-light)",
  base: "var(--cat-dashboard-base)",
  glow: "var(--cat-dashboard-wash)",
};

/**
 * Los colores de cada categoria salen de CATEGORIAS, para que el panel y el
 * portal de alumnos no se desincronicen.
 */
export const SECTION_COLORS: Record<SeccionColor, ColoresSeccion> = {
  dashboard,
  ...(Object.fromEntries(
    Object.values(CATEGORIAS).map((c) => [
      c.id,
      {
        accent: c.accent,
        onAccent: c.onAccent,
        light: c.light,
        onLight: c.onLight,
        base: c.base,
        glow: c.wash,
      },
    ])
  ) as Record<Categoria, ColoresSeccion>),
};
