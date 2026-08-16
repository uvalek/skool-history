import { ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  detail?: string;
  icon: LucideIcon;
  /** Resalta la tarjeta cuando el valor pide accion (unidades vacias, etc). */
  alerta?: boolean;
  /** Si se pasa, la tarjeta se vuelve un boton que despliega su detalle. */
  onClick?: () => void;
  /** La tarjeta cuyo detalle esta abierto ahora mismo. */
  activa?: boolean;
}

export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  alerta = false,
  onClick,
  activa = false,
}: StatCardProps) {
  const contenido = (
    <CardContent className="p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-ds-on-surface-variant">
          {label}
        </span>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            alerta
              ? "bg-ds-tertiary-container text-ds-on-tertiary-container"
              : "bg-ds-surface-container-highest text-ds-primary"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="font-headline text-3xl font-bold tracking-tight text-ds-on-surface">
        {value}
      </p>
      <div className="mt-1 flex items-center justify-between gap-2">
        {detail && (
          <p className="text-xs text-ds-on-surface-variant">{detail}</p>
        )}
        {onClick && (
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-ds-primary transition-transform ${
              activa ? "rotate-180" : ""
            }`}
          />
        )}
      </div>
    </CardContent>
  );

  if (!onClick) {
    return (
      <Card className="ring-0 admin-card shadow-editorial">
        {contenido}
      </Card>
    );
  }

  return (
    <Card
      role="button"
      tabIndex={0}
      aria-expanded={activa}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={`cursor-pointer text-left transition-all hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none ${
        activa
          ? "bg-white ring-2 ring-ds-primary shadow-editorial"
          : "ring-0 admin-card shadow-editorial"
      }`}
    >
      {contenido}
    </Card>
  );
}
