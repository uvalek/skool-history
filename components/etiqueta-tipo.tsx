import { tipoRecurso } from "@/lib/tipos-recurso";
import { cn } from "@/lib/utils";

interface EtiquetaTipoProps {
  tipo: string | null;
  className?: string;
}

/**
 * Pildora discreta con el tipo de material de un recurso.
 *
 * Deliberadamente sin color propio: en esta plataforma el color identifica la
 * categoria (Secundaria, UATX, UVHM) y un segundo acento aqui competiria con
 * ese significado. El tipo se distingue por icono y palabra, no por tono.
 */
export function EtiquetaTipo({ tipo, className }: EtiquetaTipoProps) {
  const t = tipoRecurso(tipo);
  const Icono = t.icono;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full bg-ds-surface-container-highest",
        "px-2 py-0.5 text-[11px] font-medium text-ds-on-surface-variant",
        className
      )}
    >
      <Icono className="h-3 w-3" />
      {t.label}
    </span>
  );
}
