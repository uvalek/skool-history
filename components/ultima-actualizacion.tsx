import { fechaCompleta, fechaISO, tiempoRelativo } from "@/lib/fechas";
import { cn } from "@/lib/utils";

interface UltimaActualizacionProps {
  creado: string;
  actualizado: string;
  /**
   * Concordancia del participio: "actualizada" para una unidad, "actualizado"
   * para un recurso.
   */
  genero?: "m" | "f";
  /** false deja solo "hace 3 dias", para footers y lineas ya cargadas. */
  etiqueta?: boolean;
  className?: string;
}

/**
 * Leyenda chica con la ultima vez que algo se toco.
 *
 * Los triggers de la base solo mueven updated_at en un UPDATE, asi que cuando
 * coincide con created_at la fila nunca se edito y decir "actualizada" seria
 * mentira: en ese caso dice "creada".
 */
export function UltimaActualizacion({
  creado,
  actualizado,
  genero = "m",
  etiqueta = true,
  className,
}: UltimaActualizacionProps) {
  const seEdito = actualizado !== creado;
  const fecha = seEdito ? actualizado : creado;
  const verbo = `${seEdito ? "actualizad" : "cread"}${genero === "f" ? "a" : "o"}`;

  return (
    <time
      dateTime={fechaISO(fecha)}
      title={fechaCompleta(fecha)}
      // El texto sale de la hora del render. Sin esto React avisa de desajuste
      // cuando el servidor y el navegador caen en lados distintos de un corte
      // ("hoy" contra "hace 1 dia").
      suppressHydrationWarning
      className={cn("text-xs text-ds-on-surface-variant", className)}
    >
      {etiqueta ? `${verbo} ` : ""}
      {tiempoRelativo(fecha)}
    </time>
  );
}
