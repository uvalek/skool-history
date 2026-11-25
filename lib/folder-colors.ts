import type { UnidadColor } from "@/lib/types/database";

/**
 * Los ocho colores que la profesora puede dar a una carpeta.
 *
 * Son variables CSS y no hexadecimales porque se aplican con style inline:
 * en tema oscuro cada pareja se invierte (fondo oscuro, icono claro) y eso
 * solo puede resolverlo el navegador, no un valor fijado al construir.
 */
export const FOLDER_COLORS: {
  value: UnidadColor;
  bgHex: string;
  iconHex: string;
  label: string;
}[] = [
  {
    value: "purple",
    bgHex: "var(--folder-purple-bg)",
    iconHex: "var(--folder-purple-icon)",
    label: "Morado",
  },
  {
    value: "blue",
    bgHex: "var(--folder-blue-bg)",
    iconHex: "var(--folder-blue-icon)",
    label: "Azul",
  },
  {
    value: "teal",
    bgHex: "var(--folder-teal-bg)",
    iconHex: "var(--folder-teal-icon)",
    label: "Turquesa",
  },
  {
    value: "green",
    bgHex: "var(--folder-green-bg)",
    iconHex: "var(--folder-green-icon)",
    label: "Verde",
  },
  {
    value: "yellow",
    bgHex: "var(--folder-yellow-bg)",
    iconHex: "var(--folder-yellow-icon)",
    label: "Amarillo",
  },
  {
    value: "orange",
    bgHex: "var(--folder-orange-bg)",
    iconHex: "var(--folder-orange-icon)",
    label: "Naranja",
  },
  {
    value: "rose",
    bgHex: "var(--folder-rose-bg)",
    iconHex: "var(--folder-rose-icon)",
    label: "Rosa",
  },
  {
    value: "slate",
    bgHex: "var(--folder-slate-bg)",
    iconHex: "var(--folder-slate-icon)",
    label: "Gris",
  },
];

export function getFolderColor(color: UnidadColor) {
  return FOLDER_COLORS.find((c) => c.value === color) || FOLDER_COLORS[0];
}
