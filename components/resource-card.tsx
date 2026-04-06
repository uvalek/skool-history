import { Download, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import type { Recurso } from "@/lib/types/database";
import { cn } from "@/lib/utils";

interface ResourceCardProps {
  recurso: Recurso;
}

export function ResourceCard({ recurso }: ResourceCardProps) {
  const videoId = recurso.urls_video[0]
    ? extractYouTubeId(recurso.urls_video[0])
    : null;

  return (
    <Card className="min-w-0 overflow-hidden bg-ds-surface-container-low ring-0 shadow-editorial transition-all hover:-translate-y-0.5 hover:bg-ds-surface-bright">
      {videoId && (
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={recurso.titulo}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      )}
      {!videoId && recurso.urls_video[0] && (
        <div className="flex aspect-video items-center justify-center bg-ds-surface-container-highest rounded-t-lg">
          <Play className="h-12 w-12 text-ds-on-surface-variant" />
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-lg font-semibold text-ds-on-surface leading-tight">
          {recurso.titulo}
        </CardTitle>
        <p className="text-sm text-ds-on-surface-variant">
          {new Date(recurso.created_at).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {recurso.urls_recurso.map((url, i) => (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "rounded-full bg-ds-secondary-container text-ds-on-secondary-container hover:bg-ds-secondary-fixed-dim"
            )}
          >
            <Download className="mr-1 h-4 w-4" />
            {recurso.urls_recurso.length > 1
              ? `Recurso ${i + 1}`
              : "Descargar Recurso"}
          </a>
        ))}
        {recurso.urls_video.length > 1 &&
          recurso.urls_video.slice(1).map((url, i) => (
            <a
              key={`v-${i}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "rounded-full ghost-border text-ds-primary hover:bg-ds-primary-container"
              )}
            >
              <Play className="mr-1 h-4 w-4" />
              Video {i + 2}
            </a>
          ))}
      </CardContent>
    </Card>
  );
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}
