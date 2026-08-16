import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UnidadBanner } from "@/components/unidad-banner";
import type { Categoria, Unidad } from "@/lib/types/database";

interface UnidadCardProps {
  unidad: Unidad;
  recursoCount: number;
}

const acento: Record<Categoria, string> = {
  secundaria: "#059669",
  universidad: "#b45309",
};

export function UnidadCard({ unidad, recursoCount }: UnidadCardProps) {
  const color = acento[unidad.categoria];

  return (
    <Link
      href={`/${unidad.categoria}/unidad/${unidad.id}`}
      className="group block h-full"
    >
      <Card
        className="h-full min-w-0 gap-0 overflow-hidden p-0 ring-0 bg-white transition-all hover:-translate-y-1"
        style={{
          boxShadow:
            "0 2px 12px rgba(57, 43, 83, 0.08), 0 4px 24px rgba(93, 72, 206, 0.06)",
        }}
      >
        <UnidadBanner
          imagenUrl={unidad.imagen_url}
          color={unidad.color}
          className="h-40"
        />

        <CardHeader className="pt-5">
          <CardTitle className="font-headline text-lg font-bold leading-tight text-ds-on-surface">
            {unidad.titulo}
          </CardTitle>
          {unidad.descripcion && (
            <CardDescription className="line-clamp-2 text-sm text-ds-on-surface-variant">
              {unidad.descripcion}
            </CardDescription>
          )}
        </CardHeader>

        {/* Sin borde ni fondo propios: el sistema de diseno separa por tono,
            no por lineas. */}
        <CardFooter className="mt-auto items-center justify-between gap-3 border-0 bg-transparent px-4 pb-5 pt-4">
          <Badge variant="outline">
            <FileText className="h-3.5 w-3.5" />
            {recursoCount} {recursoCount === 1 ? "recurso" : "recursos"}
          </Badge>
          <span
            className="inline-flex items-center gap-1 text-sm font-semibold transition-transform group-hover:translate-x-0.5"
            style={{ color }}
          >
            Ver unidad
            <ArrowRight className="h-4 w-4" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
