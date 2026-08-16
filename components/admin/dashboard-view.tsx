"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  ChevronRight,
  Clock,
  FileDown,
  FolderOpen,
  Layers,
  Pencil,
  Play,
  X,
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
import type { Recurso, Unidad } from "@/lib/types/database";

interface DashboardViewProps {
  stats: Estadisticas;
  unidades: Unidad[];
  recursos: Recurso[];
  onAbrirUnidad: (unidad: Unidad) => void;
  onEditarRecurso: (recurso: Recurso) => void;
}

type Detalle =
  | { tipo: "unidad"; items: UnidadConMetricas[] }
  | { tipo: "recurso"; items: Recurso[] };

interface Tarjeta {
  key: string;
  label: string;
  value: number;
  detail: string;
  icon: typeof Layers;
  alerta?: boolean;
  /** Encabezado del panel desplegable. */
  titulo: string;
  detalle: Detalle;
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
        <p className="truncate text-xs text-ds-on-surface-variant">
          {etiquetaCategoria[unidad.categoria]} · {motivo}
        </p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-ds-on-surface-variant" />
    </button>
  );
}

function RecursoRow({
  recurso,
  unidadTitulo,
  onClick,
}: {
  recurso: Recurso;
  unidadTitulo: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-ds-surface-container-high"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ds-surface-container-highest">
        <Play className="h-4 w-4 text-ds-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ds-on-surface">
          {recurso.titulo}
        </p>
        <p className="truncate text-xs text-ds-on-surface-variant">
          {unidadTitulo} · {recurso.urls_video.filter(Boolean).length} video(s) ·{" "}
          {recurso.urls_recurso.filter(Boolean).length} archivo(s)
        </p>
      </div>
      <Pencil className="h-4 w-4 shrink-0 text-ds-primary" />
    </button>
  );
}

export function DashboardView({
  stats,
  unidades,
  recursos,
  onAbrirUnidad,
  onEditarRecurso,
}: DashboardViewProps) {
  const [abierta, setAbierta] = useState<string | null>(null);

  const atencion = unidadesQueNecesitanAtencion(stats);

  const titulosPorUnidad = useMemo(
    () => new Map(unidades.map((u) => [u.id, u.titulo])),
    [unidades]
  );

  const tarjetas: Tarjeta[] = [
    {
      key: "unidades",
      label: "Unidades",
      value: stats.unidades.total,
      detail: `${stats.unidades.secundaria} secundaria · ${stats.unidades.universidad} universidad`,
      icon: Layers,
      titulo: "Todas las unidades",
      detalle: { tipo: "unidad", items: stats.todas },
    },
    {
      key: "recursos",
      label: "Recursos",
      value: stats.recursos.total,
      detail: `${stats.recursos.secundaria} secundaria · ${stats.recursos.universidad} universidad`,
      icon: FolderOpen,
      titulo: "Todos los recursos",
      detalle: { tipo: "recurso", items: recursos },
    },
    {
      key: "videos",
      label: "Videos enlazados",
      value: stats.videos,
      detail: "Recursos con al menos un video",
      icon: Play,
      titulo: "Recursos con video",
      detalle: {
        tipo: "recurso",
        items: recursos.filter((r) => r.urls_video.filter(Boolean).length > 0),
      },
    },
    {
      key: "vacias",
      label: "Unidades vacias",
      value: stats.vacias.length,
      detail:
        stats.vacias.length > 0
          ? "Sin ningun recurso publicado"
          : "Todas tienen contenido",
      icon: AlertCircle,
      alerta: stats.vacias.length > 0,
      titulo: "Unidades sin recursos",
      detalle: { tipo: "unidad", items: stats.vacias },
    },
    {
      key: "sineditar",
      label: "Sin editar",
      value: stats.desactualizadas.length,
      detail: `Mas de ${DIAS_DESACTUALIZADA} dias sin cambios`,
      icon: Clock,
      alerta: stats.desactualizadas.length > 0,
      titulo: "Unidades sin editar",
      detalle: { tipo: "unidad", items: stats.desactualizadas },
    },
    {
      key: "archivos",
      label: "Material descargable",
      value: stats.archivos,
      detail: "Recursos con archivos adjuntos",
      icon: FileDown,
      titulo: "Recursos con material descargable",
      detalle: {
        tipo: "recurso",
        items: recursos.filter(
          (r) => r.urls_recurso.filter(Boolean).length > 0
        ),
      },
    },
  ];

  const tarjetaAbierta = tarjetas.find((t) => t.key === abierta) ?? null;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-headline text-2xl font-bold text-ds-on-surface">
          Resumen
        </h2>
        <p className="mt-1 text-sm text-ds-on-surface-variant">
          Estado general del contenido. Toca una tarjeta para ver y editar lo
          que incluye.
        </p>
      </div>

      {/* Metricas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tarjetas.map((t) => (
          <StatCard
            key={t.key}
            label={t.label}
            value={t.value}
            detail={t.detail}
            icon={t.icon}
            alerta={t.alerta}
            activa={abierta === t.key}
            // Sin elementos no hay nada que desplegar.
            onClick={
              t.detalle.items.length > 0
                ? () => setAbierta(abierta === t.key ? null : t.key)
                : undefined
            }
          />
        ))}
      </div>

      {/* Detalle de la tarjeta seleccionada */}
      {tarjetaAbierta && (
        <Card className="ring-0 bg-ds-surface-container-low shadow-editorial">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="font-headline text-base text-ds-on-surface">
              {tarjetaAbierta.titulo}
              <span className="ml-2 text-sm font-normal text-ds-on-surface-variant">
                {tarjetaAbierta.detalle.items.length}
              </span>
            </CardTitle>
            <button
              onClick={() => setAbierta(null)}
              className="text-ds-on-surface-variant transition-colors hover:text-ds-primary"
              aria-label="Cerrar detalle"
            >
              <X className="h-4 w-4" />
            </button>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              {tarjetaAbierta.detalle.tipo === "unidad"
                ? tarjetaAbierta.detalle.items.map((u) => (
                    <UnidadRow
                      key={u.id}
                      unidad={u}
                      motivo={
                        u.recursoCount === 0
                          ? "sin recursos"
                          : `${u.recursoCount} recurso(s) · editada ${tiempoRelativo(
                              u.updated_at
                            )}`
                      }
                      onClick={() => onAbrirUnidad(u)}
                    />
                  ))
                : tarjetaAbierta.detalle.items.map((r) => (
                    <RecursoRow
                      key={r.id}
                      recurso={r}
                      unidadTitulo={
                        (r.unidad_id && titulosPorUnidad.get(r.unidad_id)) ||
                        "Sin unidad"
                      }
                      onClick={() => onEditarRecurso(r)}
                    />
                  ))}
            </div>
          </CardContent>
        </Card>
      )}

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
