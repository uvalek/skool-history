import { CATEGORIAS } from "@/lib/categorias";
import type { Categoria } from "@/lib/types/database";

/** Secciones del panel: el dashboard mas una por categoria. */
export type SeccionColor = "dashboard" | Categoria;

export interface ColoresSeccion {
  accent: string;
  light: string;
  onLight: string;
  base: string;
  glow: string;
}

const dashboard: ColoresSeccion = {
  accent: "#5d48ce",
  light: "#c2b9ff",
  onLight: "#391baa",
  base: "#fdfaff",
  glow: "rgba(93, 72, 206, 0.34)",
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
        light: c.light,
        onLight: c.onLight,
        base: c.base,
        glow: c.wash,
      },
    ])
  ) as Record<Categoria, ColoresSeccion>),
};
