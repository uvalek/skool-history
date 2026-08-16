"use client";

import { FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FOLDER_COLORS } from "@/lib/folder-colors";
import type { Categoria, UnidadColor } from "@/lib/types/database";

function ColorPicker({
  value,
  onChange,
}: {
  value: UnidadColor;
  onChange: (c: UnidadColor) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-ds-on-surface-variant">
        Color del icono
      </label>
      <div className="flex flex-wrap gap-2">
        {FOLDER_COLORS.map((c) => (
          <button
            key={c.value}
            type="button"
            title={c.label}
            aria-label={c.label}
            onClick={() => onChange(c.value)}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
              value === c.value
                ? "ring-2 ring-ds-primary ring-offset-2 ring-offset-ds-surface-container-low scale-110"
                : "hover:scale-105"
            }`}
            style={{ backgroundColor: c.bgHex }}
          >
            <FolderOpen className="h-4 w-4" style={{ color: c.iconHex }} />
          </button>
        ))}
      </div>
    </div>
  );
}

export interface UnidadFormValues {
  titulo: string;
  descripcion: string;
  categoria: Categoria;
  color: UnidadColor;
}

interface UnidadFormProps {
  values: UnidadFormValues;
  onChange: (v: UnidadFormValues) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  editando: boolean;
}

export function UnidadForm({
  values,
  onChange,
  onSubmit,
  onCancel,
  editando,
}: UnidadFormProps) {
  const set = <K extends keyof UnidadFormValues>(
    key: K,
    value: UnidadFormValues[K]
  ) => onChange({ ...values, [key]: value });

  return (
    <Card className="mb-8 ring-0 bg-ds-surface-container-low shadow-editorial">
      <CardHeader>
        <CardTitle className="font-headline text-ds-on-surface">
          {editando ? "Editar Unidad" : "Nueva Unidad"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-ds-on-surface-variant">
              Titulo de la Unidad
            </label>
            <Input
              value={values.titulo}
              onChange={(e) => set("titulo", e.target.value)}
              placeholder="Ej: Unidad 1 - La Revolucion Industrial"
              required
              className="bg-ds-surface-container-highest border-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ds-on-surface-variant">
              Descripcion (opcional)
            </label>
            <Input
              value={values.descripcion}
              onChange={(e) => set("descripcion", e.target.value)}
              placeholder="Breve descripcion de la unidad"
              className="bg-ds-surface-container-highest border-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ds-on-surface-variant">
              Categoria
            </label>
            <Select
              value={values.categoria}
              onValueChange={(v) => set("categoria", v as Categoria)}
            >
              <SelectTrigger className="bg-ds-surface-container-highest border-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="secundaria">Secundaria</SelectItem>
                <SelectItem value="universidad">Universidad</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ColorPicker
            value={values.color}
            onChange={(c) => set("color", c)}
          />
          <div className="flex gap-3">
            <Button
              type="submit"
              className="rounded-full bg-ds-primary text-ds-on-primary hover:bg-ds-primary-dim"
            >
              {editando ? "Guardar Cambios" : "Crear Unidad"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              className="rounded-full text-ds-on-surface-variant"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
