"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Recurso } from "@/lib/types/database";

interface RecursoListItemProps {
  recurso: Recurso;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

export function RecursoListItem({
  recurso,
  index,
  onEdit,
  onDelete,
}: RecursoListItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: recurso.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="ring-0 admin-card shadow-editorial">
        <CardContent className="flex items-center justify-between gap-3 p-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab touch-none text-ds-on-surface-variant transition-colors hover:text-ds-primary active:cursor-grabbing"
              aria-label="Reordenar recurso"
            >
              <GripVertical className="h-5 w-5" />
            </button>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ds-surface-container-highest text-sm font-semibold text-ds-on-surface-variant">
              {index + 1}
            </span>
            <div className="min-w-0">
              <h3 className="truncate font-headline font-semibold text-ds-on-surface">
                {recurso.titulo}
              </h3>
              <p className="text-xs text-ds-on-surface-variant">
                {recurso.urls_video.filter(Boolean).length} video(s)
                {" · "}
                {recurso.urls_recurso.filter(Boolean).length} archivo(s)
              </p>
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="text-ds-primary"
              aria-label="Editar recurso"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="text-ds-error"
              aria-label="Eliminar recurso"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
