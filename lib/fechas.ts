/**
 * Formato de fechas compartido entre el sitio publico y el panel.
 *
 * Antes vivia dentro de lib/admin-stats.ts, pero las tarjetas publicas tambien
 * necesitan decir cuando se actualizo una unidad y no tienen por que arrastrar
 * el calculo de estadisticas del panel.
 */

const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

export function diasDesde(fecha: string): number {
  const ms = Date.now() - new Date(fecha).getTime();
  return Math.floor(ms / 86_400_000);
}

/** "hoy", "hace 3 dias", "hace 2 meses" */
export function tiempoRelativo(fecha: string): string {
  const dias = diasDesde(fecha);
  if (dias < 1) return "hoy";
  if (dias < 30) return rtf.format(-dias, "day");
  if (dias < 365) return rtf.format(-Math.floor(dias / 30), "month");
  return rtf.format(-Math.floor(dias / 365), "year");
}

/** "12 de agosto de 2026", para el tooltip de la leyenda. */
export function fechaCompleta(fecha: string): string {
  return new Date(fecha).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Valor del atributo dateTime: Postgres devuelve un espacio donde ISO pide T. */
export function fechaISO(fecha: string): string {
  return new Date(fecha).toISOString();
}
