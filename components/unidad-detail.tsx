"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, Download, FileText, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { VideoCarousel } from "@/components/video-carousel";
import { UltimaActualizacion } from "@/components/ultima-actualizacion";
import { EtiquetaTipo } from "@/components/etiqueta-tipo";
import { BotonVisto } from "@/components/boton-visto";
import { guardarUltimo, leerUltimo } from "@/lib/progreso";
import { useVistos } from "@/lib/usar-progreso";
import { CATEGORIAS } from "@/lib/categorias";
import {
  TIPOS_RECURSO,
  TIPOS_RECURSO_ORDEN,
  tipoRecurso,
} from "@/lib/tipos-recurso";
import type { Recurso, Unidad } from "@/lib/types/database";

interface UnidadDetailProps {
  unidad: Unidad;
  recursos: Recurso[];
}


export function UnidadDetail({ unidad, recursos }: UnidadDetailProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const vistos = useVistos();

  // La lista se agrupa por tipo de material: la teoria primero, la
  // bibliografia al final. Antes todo venia seguido y el alumno no podia
  // distinguir una clase que debe estudiar de una referencia de consulta.
  //
  // El numero visible cuenta sobre la lista agrupada, no sobre el campo
  // 'orden': si numerara por 'orden' los grupos saldrian con numeros
  // salteados y pareceria que faltan recursos.
  const grupos = useMemo(() => {
    let n = 0;
    return TIPOS_RECURSO_ORDEN.map((tipo) => {
      const items = recursos
        .filter((r) => tipoRecurso(r.tipo).id === tipo)
        .map((recurso) => ({ recurso, index: n++ }));
      return { tipo, config: TIPOS_RECURSO[tipo], items };
    }).filter((g) => g.items.length > 0);
  }, [recursos]);

  // Orden en que se recorren con la lista: el mismo que se ve.
  const ordenados = useMemo(
    () => grupos.flatMap((g) => g.items.map((i) => i.recurso)),
    [grupos]
  );

  // Con un solo grupo el encabezado no separa nada y solo mete ruido.
  const mostrarEncabezados = grupos.length > 1;

  const selectedRecurso = ordenados[selectedIndex] || null;

  // Retoma el recurso donde se quedo. Va en un efecto y no en el estado
  // inicial porque localStorage no existe en el servidor: leerlo al construir
  // el estado haria que el HTML del servidor y el del cliente no coincidieran.
  useEffect(() => {
    const ultimo = leerUltimo(unidad.id);
    if (!ultimo) return;
    const i = ordenados.findIndex((r) => r.id === ultimo);
    if (i > 0) setSelectedIndex(i);
  }, [unidad.id, ordenados]);

  function seleccionar(index: number, recursoId: string) {
    setSelectedIndex(index);
    guardarUltimo(unidad.id, recursoId);
  }
  const c = CATEGORIAS[unidad.categoria];
  // Forma que espera VideoCarousel y el resto de la vista.
  const theme = {
    accent: c.accent,
    accentText: c.onAccent,
    accentLight: c.light,
    accentLightText: c.onLight,
    linkColor: c.accent,
    downloadBg: c.light,
    downloadText: c.onLight,
  };

  // Las URLs pueden traer huecos vacios de los formularios del panel.
  const videos = selectedRecurso?.urls_video.filter(Boolean) ?? [];
  const archivos = selectedRecurso?.urls_recurso.filter(Boolean) ?? [];

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col">
      {/* Breadcrumb */}
      <div className="border-b ghost-border bg-ds-surface-container-low px-6 py-3">
        <div className="mx-auto flex max-w-7xl items-center gap-2 text-sm">
          <Link
            href={`/${unidad.categoria}`}
            className="flex items-center gap-1 hover:underline"
            style={{ color: theme.linkColor }}
          >
            <ArrowLeft className="h-4 w-4" />
            {c.label}
          </Link>
          <span className="text-ds-on-surface-variant">/</span>
          <span className="font-medium text-ds-on-surface">
            {unidad.titulo}
          </span>
        </div>
      </div>

      {/* Layout principal */}
      <div className="unidad-layout mx-auto w-full max-w-7xl flex-1">
        {/* Sidebar - Lista de recursos */}
        <aside className="border-b md:border-b-0 md:border-r ghost-border bg-ds-surface-container-low overflow-y-auto">
          <div className="p-4">
            <h2 className="font-headline text-sm font-semibold text-ds-on-surface-variant uppercase tracking-wider">
              Contenido de la unidad
            </h2>
            <UltimaActualizacion
              creado={unidad.created_at}
              actualizado={unidad.updated_at}
              genero="f"
              className="mb-3 mt-1 block"
            />
            <div className="space-y-1">
              {grupos.map((grupo) => {
                const IconoGrupo = grupo.config.icono;
                return (
                  <div
                    key={grupo.tipo}
                    className={
                      mostrarEncabezados ? "pt-4 first:pt-0" : undefined
                    }
                  >
                    {mostrarEncabezados && (
                      <div className="mb-1 flex items-center gap-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-ds-on-surface-variant">
                        <IconoGrupo className="h-3 w-3" />
                        {grupo.config.plural}
                      </div>
                    )}
                    <div className="space-y-1">
                      {grupo.items.map(({ recurso, index }) => (
                        <button
                          key={recurso.id}
                          onClick={() => seleccionar(index, recurso.id)}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-all"
                          style={
                            selectedIndex === index
                              ? {
                                  backgroundColor: theme.accentLight,
                                  color: theme.accentLightText,
                                }
                              : undefined
                          }
                        >
                          <span
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                            style={
                              selectedIndex === index
                                ? {
                                    backgroundColor: theme.accent,
                                    color: theme.accentText,
                                  }
                                : {
                                    backgroundColor:
                                      "var(--ds-surface-container-highest)",
                                    color: "var(--ds-on-surface-variant)",
                                  }
                            }
                          >
                            {index + 1}
                          </span>
                          <span className="min-w-0 flex-1 truncate text-sm font-medium">
                            {recurso.titulo}
                          </span>
                          {vistos[recurso.id] && (
                            <Check
                              className="h-4 w-4 shrink-0"
                              strokeWidth={3}
                              style={
                                selectedIndex === index
                                  ? undefined
                                  : { color: theme.accent }
                              }
                              aria-label="Visto"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Contenido principal - Video/Links */}
        <main className="min-w-0 p-6 md:p-8">
          {selectedRecurso ? (
            <div className="space-y-6">
              <div>
                <EtiquetaTipo
                  tipo={selectedRecurso.tipo}
                  className="mb-2"
                />
                <h1 className="font-headline text-2xl font-bold text-ds-on-surface">
                  {selectedRecurso.titulo}
                </h1>
                <UltimaActualizacion
                  creado={selectedRecurso.created_at}
                  actualizado={selectedRecurso.updated_at}
                  className="mt-1 block"
                />
                {/* Una referencia no se "termina": es material de consulta y
                    no entra en la barra de progreso, asi que ofrecer el boton
                    seria prometer un avance que nunca se moveria. */}
                {tipoRecurso(selectedRecurso.tipo).cuenta && (
                  <BotonVisto
                    recursoId={selectedRecurso.id}
                    accent={theme.accent}
                    onAccent={theme.accentText}
                    className="mt-3"
                  />
                )}
              </div>

              {/* Videos: uno embebido, con carrusel si hay varios */}
              <VideoCarousel
                key={selectedRecurso.id}
                videos={videos}
                titulo={selectedRecurso.titulo}
                theme={theme}
              />

              {/* Material descargable, justo debajo de los videos */}
              {archivos.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-ds-on-surface-variant">
                    Material descargable
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {archivos.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
                        style={{
                          backgroundColor: theme.downloadBg,
                          color: theme.downloadText,
                        }}
                      >
                        <Download className="mr-1 h-4 w-4" />
                        {archivos.length > 1
                          ? `Recurso ${i + 1}`
                          : "Descargar Recurso"}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Descripción */}
              {selectedRecurso.descripcion && (
                <div className="rounded-xl bg-ds-surface-container-low p-5 prose-ds text-sm">
                  <ReactMarkdown>{selectedRecurso.descripcion}</ReactMarkdown>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center text-ds-on-surface-variant">
                <FileText className="mx-auto mb-3 h-12 w-12" />
                <p>Selecciona un recurso de la lista</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
