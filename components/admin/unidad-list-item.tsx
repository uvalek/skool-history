"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronRight,
  FolderOpen,
  GripVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getFolderColor } from "@/lib/folder-colors";
import { tiempoRelativo } from "@/lib/admin-stats";
import type { Unidad } from "@/lib/types/database";

interface UnidadListItemProps {
  unidad: Unidad;
  recursoCount: number;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function UnidadListItem({
  unidad,
  recursoCount,
  onOpen,
  onEdit,
  onDelete,
}: UnidadListItemProps) {
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
    <div ref={setNodeRef} style={style}>
      <Card
        className="ring-0 bg-ds-surface-container-low shadow-editorial cursor-pointer transition-all hover:-translate-y-0.5 hover:bg-ds-surface-bright"
        onClick={onOpen}
      >
        <CardContent className="flex items-center justify-between gap-3 p-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              {...attributes}
              {...listeners}
              onClick={(e) => e.stopPropagation()}
              className="cursor-grab touch-none text-ds-on-surface-variant transition-colors hover:text-ds-primary active:cursor-grabbing"
              aria-label="Reordenar unidad"
            >
              <GripVertical className="h-5 w-5" />
            </button>
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: color.bgHex }}
            >
              <FolderOpen
                className="h-5 w-5"
                style={{ color: color.iconHex }}
              />
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-headline font-semibold text-ds-on-surface">
                {unidad.titulo}
              </h3>
              <p className="truncate text-xs text-ds-on-surface-variant">
                {recursoCount} recurso(s) · editada{" "}
                {tiempoRelativo(unidad.updated_at)}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="text-ds-primary"
              aria-label="Editar unidad"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-ds-error"
              aria-label="Eliminar unidad"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <ChevronRight className="h-5 w-5 text-ds-on-surface-variant" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
