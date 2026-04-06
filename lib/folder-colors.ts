import type { UnidadColor } from "@/lib/types/database";

export const FOLDER_COLORS: {
  value: UnidadColor;
  bgHex: string;
  iconHex: string;
  label: string;
}[] = [
  { value: "purple", bgHex: "#c2b9ff", iconHex: "#391baa", label: "Morado" },
  { value: "blue", bgHex: "#bbd6ff", iconHex: "#004075", label: "Azul" },
  { value: "teal", bgHex: "#b2f0e8", iconHex: "#00504a", label: "Turquesa" },
  { value: "green", bgHex: "#b8f0b0", iconHex: "#1a5e12", label: "Verde" },
  { value: "yellow", bgHex: "#ffe08a", iconHex: "#6b5300", label: "Amarillo" },
  { value: "orange", bgHex: "#ffc4a3", iconHex: "#7a3000", label: "Naranja" },
  { value: "rose", bgHex: "#ff9dad", iconHex: "#69172c", label: "Rosa" },
  { value: "slate", bgHex: "#c8c5d0", iconHex: "#3b3850", label: "Gris" },
];

export function getFolderColor(color: UnidadColor) {
  return FOLDER_COLORS.find((c) => c.value === color) || FOLDER_COLORS[0];
}
