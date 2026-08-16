"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FolderOpen, GripVertical, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getFolderColor } from "@/lib/folder-colors";
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

  const color = getFolderColor(unidad.color);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="group">
      <Card
        className="h-full overflow-hidden p-0 ring-0 admin-card shadow-editorial cursor-pointer gap-0 transition-all hover:-translate-y-0.5 hover:bg-white"
        onClick={onOpen}
      >
        {/* Portada de color */}
        <div
          className="relative flex h-28 items-center justify-center"
          style={{ backgroundColor: color.bgHex }}
        >
          <FolderOpen className="h-10 w-10" style={{ color: color.iconHex }} />

          {/* Acciones: visibles al pasar el cursor o al enfocar con teclado */}
          <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-ds-surface-container-lowest/90 text-ds-primary backdrop-blur-sm transition-colors hover:bg-ds-surface-container-lowest"
              aria-label="Editar unidad"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-ds-surface-container-lowest/90 text-ds-error backdrop-blur-sm transition-colors hover:bg-ds-surface-container-lowest"
              aria-label="Eliminar unidad"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="absolute left-2 top-2 flex h-7 w-7 cursor-grab touch-none items-center justify-center rounded-full bg-ds-surface-container-lowest/90 text-ds-on-surface-variant opacity-0 backdrop-blur-sm transition-opacity hover:text-ds-primary active:cursor-grabbing group-hover:opacity-100 group-focus-within:opacity-100"
            aria-label="Reordenar unidad"
          >
            <GripVertical className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-headline font-semibold leading-snug text-ds-on-surface">
            {unidad.titulo}
          </h3>
          {unidad.descripcion && (
            <p className="mt-1.5 line-clamp-2 text-sm text-ds-on-surface-variant">
              {unidad.descripcion}
            </p>
          )}

          <div className="mt-4 flex items-center justify-between gap-2 pt-1">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                recursoCount === 0
                  ? "bg-ds-tertiary-container text-ds-on-tertiary-container"
                  : "bg-ds-secondary-container text-ds-on-secondary-container"
              }`}
            >
              {recursoCount === 0
                ? "Sin recursos"
                : `${recursoCount} recurso${recursoCount === 1 ? "" : "s"}`}
            </span>
            <span className="truncate text-xs text-ds-on-surface-variant">
              {tiempoRelativo(unidad.updated_at)}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
