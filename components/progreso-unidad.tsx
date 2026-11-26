"use client";

import { contarVistos } from "@/lib/progreso";
import { useVistos } from "@/lib/usar-progreso";
import { cn } from "@/lib/utils";

interface ProgresoUnidadProps {
  recursoIds: string[];
  accent: string;
  className?: string;
}

/**
 * Cuantos recursos de la unidad lleva vistos el alumno.
 *
 * El hueco se reserva aunque no haya nada marcado: el servidor siempre pinta
 * cero y el valor real llega tras hidratar, asi que sin una altura fija la
 * tarjeta daria un salto al aparecer la barra. Con cero no se dibuja nada,
 * para no llenar la rejilla de barras vacias en la primera visita.
 */
export function ProgresoUnidad({
  recursoIds,
  accent,
  className,
}: ProgresoUnidadProps) {
  const vistos = useVistos();
  const total = recursoIds.length;
  const hechos = contarVistos(vistos, recursoIds);
  const completa = total > 0 && hechos === total;

  return (
    <div className={cn("h-[18px]", className)}>
      {hechos > 0 && (
        <div className="flex items-center gap-2">
          <div
            className="h-1 flex-1 overflow-hidden rounded-full bg-ds-surface-container-highest"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={hechos}
            aria-label={`${hechos} de ${total} recursos vistos`}
          >
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{
                width: `${(hechos / total) * 100}%`,
                backgroundColor: accent,
              }}
            />
          </div>
          <span
            className="shrink-0 text-xs font-semibold"
            style={completa ? { color: accent } : undefined}
          >
            {completa ? (
              "Completa"
            ) : (
              <span className="text-ds-on-surface-variant">
                {hechos}/{total}
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
