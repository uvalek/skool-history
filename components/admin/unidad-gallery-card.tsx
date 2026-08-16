"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FileText, GripVertical, Pencil, Trash2 } from "lucide-react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UnidadBanner } from "@/components/unidad-banner";
import { tiempoRelativo } from "@/lib/admin-stats";
import type { Unidad } from "@/lib/types/database";

interface UnidadGalleryCardProps {
  unidad: Unidad;
  recursoCount: number;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function UnidadGalleryCard({
  unidad,
  recursoCount,
  onOpen,
  onEdit,
  onDelete,
}: UnidadGalleryCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: unidad.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="group h-full">
      <Card
        className="h-full cursor-pointer gap-0 overflow-hidden p-0 ring-0 admin-card shadow-editorial transition-all hover:-translate-y-0.5 hover:bg-white"
        onClick={onOpen}
      >
        <div className="relative">
          <UnidadBanner
            imagenUrl={unidad.imagen_url}
            color={unidad.color}
            className="h-32"
          />

          {/* Controles: al pasar el cursor o al enfocar con teclado */}
          <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-ds-primary backdrop-blur-sm transition-colors hover:bg-white"
              aria-label="Editar unidad"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-ds-error backdrop-blur-sm transition-colors hover:bg-white"
              aria-label="Eliminar unidad"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="absolute left-2 top-2 flex h-7 w-7 cursor-grab touch-none items-center justify-center rounded-full bg-white/90 text-ds-on-surface-variant opacity-0 backdrop-blur-sm transition-opacity hover:text-ds-primary active:cursor-grabbing group-hover:opacity-100 group-focus-within:opacity-100"
            aria-label="Reordenar unidad"
          >
            <GripVertical className="h-3.5 w-3.5" />
          </button>
        </div>

        <CardHeader className="pt-4">
          <CardTitle className="font-headline text-base font-semibold leading-snug text-ds-on-surface">
            {unidad.titulo}
          </CardTitle>
          {unidad.descripcion && (
            <CardDescription className="line-clamp-2 text-sm text-ds-on-surface-variant">
              {unidad.descripcion}
            </CardDescription>
          )}
        </CardHeader>

        <CardFooter className="mt-auto items-center justify-between gap-2 border-0 bg-transparent px-4 pb-4 pt-3">
          <Badge variant={recursoCount === 0 ? "alerta" : "accent"}>
            <FileText className="h-3.5 w-3.5" />
            {recursoCount === 0
              ? "Sin recursos"
              : `${recursoCount} recurso${recursoCount === 1 ? "" : "s"}`}
          </Badge>
          <span className="truncate text-xs text-ds-on-surface-variant">
            {tiempoRelativo(unidad.updated_at)}
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
