"use client";

import { Check } from "lucide-react";
import { alternarVisto } from "@/lib/progreso";
import { useVistos } from "@/lib/usar-progreso";
import { cn } from "@/lib/utils";

interface BotonVistoProps {
  recursoId: string;
  /** Color de la categoria, para que la marca combine con su unidad. */
  accent: string;
  onAccent: string;
  className?: string;
}

/**
 * Marca o desmarca un recurso como visto.
 *
 * Durante la hidratacion pinta siempre "sin ver", porque el servidor no puede
 * saber el progreso de nadie; useSyncExternalStore sustituye ese valor por el
 * real en cuanto el componente monta, sin que React avise de desajuste.
 */
export function BotonVisto({
  recursoId,
  accent,
  onAccent,
  className,
}: BotonVistoProps) {
  const vistos = useVistos();
  const visto = Boolean(vistos[recursoId]);

  return (
    <button
      type="button"
      onClick={() => alternarVisto(recursoId)}
      aria-pressed={visto}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5",
        "text-sm font-semibold transition-all",
        visto ? "" : "ghost-border text-ds-on-surface-variant hover:text-ds-primary",
        className
      )}
      style={visto ? { backgroundColor: accent, color: onAccent } : undefined}
    >
      <span
        className={cn(
          "flex h-4 w-4 items-center justify-center rounded-full",
          visto ? "" : "border border-current"
        )}
        style={visto ? { backgroundColor: onAccent, color: accent } : undefined}
      >
        {visto && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
      {visto ? "Visto" : "Marcar como visto"}
    </button>
  );
}
