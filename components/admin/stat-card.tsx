import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  detail?: string;
  icon: LucideIcon;
  /** Resalta la tarjeta cuando el valor pide accion (unidades vacias, etc). */
  alerta?: boolean;
}

export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  alerta = false,
}: StatCardProps) {
  return (
    <Card className="ring-0 bg-ds-surface-container-low shadow-editorial">
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
        {detail && (
          <p className="mt-1 text-xs text-ds-on-surface-variant">{detail}</p>
        )}
      </CardContent>
    </Card>
  );
}
