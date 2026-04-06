"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, Play, FileText, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { Recurso, Unidad, Categoria } from "@/lib/types/database";

interface UnidadDetailProps {
  unidad: Unidad;
  recursos: Recurso[];
}

const themeColors: Record<
  Categoria,
  {
    accent: string;
    accentText: string;
    accentLight: string;
    accentLightText: string;
    linkColor: string;
    badgeBg: string;
    badgeText: string;
    downloadBg: string;
    downloadText: string;
    downloadHover: string;
  }
> = {
  secundaria: {
    accent: "#059669",
    accentText: "#ffffff",
    accentLight: "#d1fae5",
    accentLightText: "#065f46",
    linkColor: "#059669",
    badgeBg: "#d1fae5",
    badgeText: "#065f46",
    downloadBg: "#d1fae5",
    downloadText: "#065f46",
    downloadHover: "#a7f3d0",
  },
  universidad: {
    accent: "#b45309",
    accentText: "#ffffff",
    accentLight: "#fef3c7",
    accentLightText: "#78350f",
    linkColor: "#b45309",
    badgeBg: "#fef3c7",
    badgeText: "#78350f",
    downloadBg: "#fef3c7",
    downloadText: "#78350f",
    downloadHover: "#fde68a",
  },
};

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export function UnidadDetail({ unidad, recursos }: UnidadDetailProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedRecurso = recursos[selectedIndex] || null;
  const theme = themeColors[unidad.categoria];

  const videoId = selectedRecurso?.urls_video[0]
    ? extractYouTubeId(selectedRecurso.urls_video[0])
    : null;

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
            {unidad.categoria === "secundaria" ? "Secundaria" : "Universidad"}
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

              {/* Video */}
              {videoId && (
                <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-editorial">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={selectedRecurso.titulo}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              )}

              {/* Si no hay video ID pero hay URL */}
              {!videoId && selectedRecurso.urls_video[0] && (
                <div className="flex aspect-video items-center justify-center rounded-xl bg-ds-surface-container-highest">
                  <div className="text-center">
                    <Play className="mx-auto mb-2 h-12 w-12 text-ds-on-surface-variant" />
                    <a
                      href={selectedRecurso.urls_video[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                      style={{ color: theme.linkColor }}
                    >
                      Ver video en nueva pestaña
                    </a>
                  </div>
                </div>
              )}

              {/* Descripción */}
              {selectedRecurso.descripcion && (
                <div className="rounded-xl bg-ds-surface-container-low p-5 prose-ds text-sm">
                  <ReactMarkdown>{selectedRecurso.descripcion}</ReactMarkdown>
                </div>
              )}

              {/* Videos adicionales */}
              {selectedRecurso.urls_video.length > 1 && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-ds-on-surface-variant">
                    Videos adicionales
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRecurso.urls_video.slice(1).map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
                        style={{
                          border: `1px solid ${theme.accent}30`,
                          color: theme.linkColor,
                        }}
                      >
                        <Play className="mr-1 h-4 w-4" />
                        Video {i + 2}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Recursos descargables */}
              {selectedRecurso.urls_recurso.length > 0 &&
                selectedRecurso.urls_recurso.some(Boolean) && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-ds-on-surface-variant">
                      Material descargable
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRecurso.urls_recurso
                        .filter(Boolean)
                        .map((url, i) => (
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
                            {selectedRecurso.urls_recurso.filter(Boolean)
                              .length > 1
                              ? `Recurso ${i + 1}`
                              : "Descargar Recurso"}
                          </a>
                        ))}
                    </div>
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
