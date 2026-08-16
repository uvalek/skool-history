"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

interface VideoCarouselProps {
  videos: string[];
  titulo: string;
  theme: {
    accent: string;
    accentText: string;
    linkColor: string;
  };
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export function VideoCarousel({ videos, titulo, theme }: VideoCarouselProps) {
  const [index, setIndex] = useState(0);

  if (videos.length === 0) return null;

  const total = videos.length;
  const actual = videos[index];
  const videoId = extractYouTubeId(actual);

  // Circular: con pocos videos es mas comodo que toparse con un extremo.
  const ir = (delta: number) => setIndex((i) => (i + delta + total) % total);

  return (
    <div
      className="space-y-3"
      onKeyDown={(e) => {
        if (total < 2) return;
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          ir(-1);
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          ir(1);
        }
      }}
      role="group"
      aria-roledescription="carrusel"
      aria-label={`Videos de ${titulo}`}
      tabIndex={total > 1 ? 0 : undefined}
    >
      <div className="group relative aspect-video w-full overflow-hidden rounded-xl shadow-editorial">
        {videoId ? (
          // La clave fuerza recargar el iframe al cambiar de video, para que
          // el anterior deje de reproducirse.
          <iframe
            key={videoId}
            src={`https://www.youtube.com/embed/${videoId}`}
            title={`${titulo} — video ${index + 1} de ${total}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-ds-surface-container-highest">
            <div className="text-center">
              <Play className="mx-auto mb-2 h-12 w-12 text-ds-on-surface-variant" />
              <a
                href={actual}
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

        {total > 1 && (
          <>
            <button
              onClick={() => ir(-1)}
              aria-label="Video anterior"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full shadow-editorial backdrop-blur-sm transition-opacity hover:opacity-100 focus-visible:opacity-100 md:opacity-80"
              style={{ backgroundColor: theme.accent, color: theme.accentText }}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => ir(1)}
              aria-label="Video siguiente"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full shadow-editorial backdrop-blur-sm transition-opacity hover:opacity-100 focus-visible:opacity-100 md:opacity-80"
              style={{ backgroundColor: theme.accent, color: theme.accentText }}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-medium text-ds-on-surface-variant">
            Video {index + 1} de {total}
          </span>
          <div className="flex items-center gap-1.5">
            {videos.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Ir al video ${i + 1}`}
                aria-current={i === index}
                className="h-2 rounded-full transition-all"
                style={
                  i === index
                    ? { width: "1.25rem", backgroundColor: theme.accent }
                    : { width: "0.5rem", backgroundColor: "#c8c5d0" }
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
