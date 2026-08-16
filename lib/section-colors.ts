/**
 * Identidad de color de cada seccion del panel. Los tonos de secundaria y
 * universidad son los mismos que ya usan el portal publico (navbar, selector
 * de nivel y vista de unidad), para que el panel no invente una paleta aparte.
 */
export type SeccionColor = "dashboard" | "secundaria" | "universidad";

export interface ColoresSeccion {
  /** Color solido: botones principales y puntos activos. */
  accent: string;
  /** Fondo suave: pildora activa de la barra lateral. */
  light: string;
  /** Texto sobre el fondo suave. */
  onLight: string;
  /** Base del degradado radial, casi blanca con un matiz del acento. */
  base: string;
  /** Acento difuminado al que llega el degradado en los bordes. */
  glow: string;
}

export const SECTION_COLORS: Record<SeccionColor, ColoresSeccion> = {
  dashboard: {
    accent: "#5d48ce",
    light: "#c2b9ff",
    onLight: "#391baa",
    base: "#fdfaff",
    glow: "rgba(93, 72, 206, 0.34)",
  },
  secundaria: {
    accent: "#059669",
    light: "#d1fae5",
    onLight: "#065f46",
    base: "#fafffc",
    glow: "rgba(5, 150, 105, 0.30)",
  },
  universidad: {
    accent: "#b45309",
    light: "#fef3c7",
    onLight: "#78350f",
    base: "#fffdfa",
    glow: "rgba(180, 83, 9, 0.30)",
  },
};
