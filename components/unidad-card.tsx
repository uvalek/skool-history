import Link from "next/link";
import { FolderOpen, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getFolderColor } from "@/lib/folder-colors";
import type { Unidad } from "@/lib/types/database";

interface UnidadCardProps {
  unidad: Unidad;
  recursoCount: number;
}

export function UnidadCard({ unidad, recursoCount }: UnidadCardProps) {
  const color = getFolderColor(unidad.color);

  return (
    <Link href={`/${unidad.categoria}/unidad/${unidad.id}`}>
      <Card className="min-w-0 ring-0 bg-white transition-all hover:-translate-y-1 hover:bg-ds-surface-bright cursor-pointer group" style={{ boxShadow: '0 2px 12px rgba(57, 43, 83, 0.08), 0 4px 24px rgba(93, 72, 206, 0.06)' }}>
        <CardContent className="p-6">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-xl mb-4 transition-transform group-hover:scale-105"
            style={{ backgroundColor: color.bgHex }}
          >
            <FolderOpen className="h-7 w-7" style={{ color: color.iconHex }} />
          </div>
          <h3 className="font-headline text-lg font-bold text-ds-on-surface leading-tight mb-2">
            {unidad.titulo}
          </h3>
          {unidad.descripcion && (
            <p className="text-sm text-ds-on-surface-variant mb-3 line-clamp-2">
              {unidad.descripcion}
            </p>
          )}
          <div className="flex items-center gap-1.5 text-xs text-ds-on-surface-variant">
            <FileText className="h-3.5 w-3.5" />
            <span>
              {recursoCount} {recursoCount === 1 ? "recurso" : "recursos"}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
