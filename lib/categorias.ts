import type { Categoria } from "@/lib/types/database";

/**
 * Fuente unica de verdad de las categorias: etiqueta, ruta y paleta.
 * Antes cada color vivia repetido en la navbar, el selector de nivel, el hero,
 * la tarjeta, la vista de unidad y el panel; agregar una categoria obligaba a
 * tocarlos todos.
 *
 * Los colores no son hexadecimales sino referencias a variables CSS definidas
 * en globals.css. Casi todos se aplican con style inline (degradados del hero,
 * sombras, pildoras de la navbar), y un hexadecimal ahi quedaria congelado en
 * el bundle y no cambiaria al pasar a tema oscuro; con var() el navegador lo
 * resuelve en cada pintado.
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
  /** Texto legible encima de accent. */
  onAccent: string;
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
    accent: "var(--cat-secundaria-accent)",
    onAccent: "var(--cat-secundaria-on-accent)",
    light: "var(--cat-secundaria-light)",
    onLight: "var(--cat-secundaria-on-light)",
    glow: "var(--cat-secundaria-glow)",
    base: "var(--cat-secundaria-base)",
    wash: "var(--cat-secundaria-wash)",
  },
  uatx: {
    id: "uatx",
    label: "UATX",
    descripcion: "Recursos de historia para la Universidad Autónoma de Tlaxcala",
    heroTitulo: "Historia — UATX",
    heroSubtitulo:
      "Accede a los recursos académicos de historia para el nivel universitario.",
    accent: "var(--cat-uatx-accent)",
    onAccent: "var(--cat-uatx-on-accent)",
    light: "var(--cat-uatx-light)",
    onLight: "var(--cat-uatx-on-light)",
    glow: "var(--cat-uatx-glow)",
    base: "var(--cat-uatx-base)",
    wash: "var(--cat-uatx-wash)",
  },
  uvhm: {
    id: "uvhm",
    label: "UVHM",
    descripcion: "Recursos de historia para la Universidad Virtual Hispánica de México",
    heroTitulo: "Historia — UVHM",
    heroSubtitulo:
      "Accede a los recursos académicos de historia para el nivel universitario.",
    accent: "var(--cat-uvhm-accent)",
    onAccent: "var(--cat-uvhm-on-accent)",
    light: "var(--cat-uvhm-light)",
    onLight: "var(--cat-uvhm-on-light)",
    glow: "var(--cat-uvhm-glow)",
    base: "var(--cat-uvhm-base)",
    wash: "var(--cat-uvhm-wash)",
  },
};

/** Orden en que aparecen en la navegacion y el selector de nivel. */
export const CATEGORIAS_ORDEN: Categoria[] = ["secundaria", "uatx", "uvhm"];

export function esCategoria(valor: string): valor is Categoria {
  return valor in CATEGORIAS;
}
