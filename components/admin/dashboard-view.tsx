"use client";

import {
  AlertCircle,
  ChevronRight,
  Clock,
  FileDown,
  FolderOpen,
  Layers,
  Play,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/admin/stat-card";
import { getFolderColor } from "@/lib/folder-colors";
import {
  DIAS_DESACTUALIZADA,
  etiquetaCategoria,
  tiempoRelativo,
  unidadesQueNecesitanAtencion,
  type Estadisticas,
  type UnidadConMetricas,
} from "@/lib/admin-stats";
import type { Unidad } from "@/lib/types/database";

interface DashboardViewProps {
  stats: Estadisticas;
  onAbrirUnidad: (unidad: Unidad) => void;
}

function UnidadRow({
  unidad,
  motivo,
  onClick,
}: {
  unidad: UnidadConMetricas;
  motivo: string;
  onClick: () => void;
}) {
  const color = getFolderColor(unidad.color);

  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-ds-surface-container-high"
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: color.bgHex }}
      >
        <FolderOpen className="h-4 w-4" style={{ color: color.iconHex }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ds-on-surface">
          {unidad.titulo}
        </p>
        <p className="text-xs text-ds-on-surface-variant">
          {etiquetaCategoria[unidad.categoria]} · {motivo}
        </p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-ds-on-surface-variant" />
    </button>
  );
}

export function DashboardView({ stats, onAbrirUnidad }: DashboardViewProps) {
  const atencion = unidadesQueNecesitanAtencion(stats);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-headline text-2xl font-bold text-ds-on-surface">
          Resumen
        </h2>
        <p className="mt-1 text-sm text-ds-on-surface-variant">
          Estado general del contenido del portal.
        </p>
      </div>

      {/* Metricas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Unidades"
          value={stats.unidades.total}
          detail={`${stats.unidades.secundaria} secundaria · ${stats.unidades.universidad} universidad`}
          icon={Layers}
        />
        <StatCard
          label="Recursos"
          value={stats.recursos.total}
          detail={`${stats.recursos.secundaria} secundaria · ${stats.recursos.universidad} universidad`}
          icon={FolderOpen}
        />
        <StatCard
          label="Videos enlazados"
          value={stats.videos}
          detail={`${stats.archivos} archivo(s) descargable(s)`}
          icon={Play}
        />
        <StatCard
          label="Unidades vacias"
          value={stats.vacias.length}
          detail={
            stats.vacias.length > 0
              ? "Sin ningun recurso publicado"
              : "Todas tienen contenido"
          }
          icon={AlertCircle}
          alerta={stats.vacias.length > 0}
        />
        <StatCard
          label="Sin editar"
          value={stats.desactualizadas.length}
          detail={`Mas de ${DIAS_DESACTUALIZADA} dias sin cambios`}
          icon={Clock}
          alerta={stats.desactualizadas.length > 0}
        />
        <StatCard
          label="Material descargable"
          value={stats.archivos}
          detail="Enlaces a Google Drive y similares"
          icon={FileDown}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Necesitan atencion */}
        <Card className="ring-0 bg-ds-surface-container-low shadow-editorial">
          <CardHeader>
            <CardTitle className="font-headline text-base text-ds-on-surface">
              Necesitan atencion
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {atencion.length > 0 ? (
              <div className="space-y-1">
                {atencion.map((u) => (
                  <UnidadRow
                    key={u.id}
                    unidad={u}
                    motivo={
                      u.recursoCount === 0
                        ? "sin recursos"
                        : `editada ${tiempoRelativo(u.updated_at)}`
                    }
                    onClick={() => onAbrirUnidad(u)}
                  />
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-ds-on-surface-variant">
                Todo al dia. Ninguna unidad esta vacia ni desactualizada.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Actividad reciente */}
        <Card className="ring-0 bg-ds-surface-container-low shadow-editorial">
          <CardHeader>
            <CardTitle className="font-headline text-base text-ds-on-surface">
              Actividad reciente
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {stats.recientes.length > 0 ? (
              <div className="space-y-1">
                {stats.recientes.map((u) => (
                  <UnidadRow
                    key={u.id}
                    unidad={u}
                    motivo={`${u.recursoCount} recurso(s) · ${tiempoRelativo(
                      u.updated_at
                    )}`}
                    onClick={() => onAbrirUnidad(u)}
                  />
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-ds-on-surface-variant">
                Aun no hay unidades creadas.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
