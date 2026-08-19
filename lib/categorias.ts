import type { Categoria } from "@/lib/types/database";

/**
 * Fuente unica de verdad de las categorias: etiqueta, ruta y paleta.
 * Antes cada color vivia repetido en la navbar, el selector de nivel, el hero,
 * la tarjeta, la vista de unidad y el panel; agregar una categoria obligaba a
 * tocarlos todos.
 */
export interface CategoriaConfig {
  id: Categoria;
  /** Nombre visible. */
  label: string;
  /** Texto de apoyo en el selector de nivel. */
  descripcion: string;
  /** Encabezado de la pagina de la categoria. */
  heroTitulo: string;
  heroSubtitulo: string;

  /** Color solido: botones, pildoras activas, enlaces. */
  accent: string;
  /** Fondo suave y su texto. */
  light: string;
  onLight: string;
  /** Tono claro para degradados del hero. */
  glow: string;
  /** Base casi blanca del degradado del panel. */
  base: string;
  /** Acento difuminado al que llega el degradado del panel. */
  wash: string;
}

export const CATEGORIAS: Record<Categoria, CategoriaConfig> = {
  secundaria: {
    id: "secundaria",
    label: "Secundaria",
    descripcion: "Recursos de historia para nivel secundario",
    heroTitulo: "Historia — Secundaria",
    heroSubtitulo:
      "Explora los recursos de historia preparados para el nivel secundario.",
    accent: "#059669",
    light: "#d1fae5",
    onLight: "#065f46",
    glow: "#6ee7b7",
    base: "#fafffc",
    wash: "rgba(5, 150, 105, 0.30)",
  },
  uatx: {
    id: "uatx",
    label: "UATX",
    descripcion: "Recursos de historia para la Universidad Autónoma de Tlaxcala",
    heroTitulo: "Historia — UATX",
    heroSubtitulo:
      "Accede a los recursos académicos de historia para el nivel universitario.",
    accent: "#b45309",
    light: "#fef3c7",
    onLight: "#78350f",
    glow: "#fbbf24",
    base: "#fffdfa",
    wash: "rgba(180, 83, 9, 0.30)",
  },
  uvhm: {
    id: "uvhm",
    label: "UVHM",
    descripcion: "Recursos de historia para la Universidad Virtual Hispánica de México",
    heroTitulo: "Historia — UVHM",
    heroSubtitulo:
      "Accede a los recursos académicos de historia para el nivel universitario.",
    accent: "#0061ab",
    light: "#d3e4ff",
    onLight: "#004075",
    glow: "#7cb8f5",
    base: "#fafcff",
    wash: "rgba(0, 97, 171, 0.30)",
  },
};

/** Orden en que aparecen en la navegacion y el selector de nivel. */
export const CATEGORIAS_ORDEN: Categoria[] = ["secundaria", "uatx", "uvhm"];

export function esCategoria(valor: string): valor is Categoria {
  return valor in CATEGORIAS;
}
