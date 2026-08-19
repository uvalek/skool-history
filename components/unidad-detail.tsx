"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, FileText, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { VideoCarousel } from "@/components/video-carousel";
import { CATEGORIAS } from "@/lib/categorias";
import type { Recurso, Unidad } from "@/lib/types/database";

interface UnidadDetailProps {
  unidad: Unidad;
  recursos: Recurso[];
}


export function UnidadDetail({ unidad, recursos }: UnidadDetailProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedRecurso = recursos[selectedIndex] || null;
  const c = CATEGORIAS[unidad.categoria];
  // Forma que espera VideoCarousel y el resto de la vista.
  const theme = {
    accent: c.accent,
    accentText: "#ffffff",
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
            <h2 className="font-headline text-sm font-semibold text-ds-on-surface-variant uppercase tracking-wider mb-3">
              Contenido de la unidad
            </h2>
            <div className="space-y-1">
              {recursos.map((recurso, index) => (
                <button
                  key={recurso.id}
                  onClick={() => setSelectedIndex(index)}
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
                            backgroundColor: "#e7e0ec",
                            color: "#665883",
                          }
                    }
                  >
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium truncate">
                    {recurso.titulo}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Contenido principal - Video/Links */}
        <main className="min-w-0 p-6 md:p-8">
          {selectedRecurso ? (
            <div className="space-y-6">
              <h1 className="font-headline text-2xl font-bold text-ds-on-surface">
                {selectedRecurso.titulo}
              </h1>

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
