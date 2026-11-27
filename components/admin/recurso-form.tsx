"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MarkdownEditor } from "@/components/markdown-editor";
import { TIPOS_RECURSO, TIPOS_RECURSO_ORDEN } from "@/lib/tipos-recurso";
import type { TipoRecurso } from "@/lib/types/database";

export interface RecursoFormValues {
  titulo: string;
  descripcion: string;
  tipo: TipoRecurso;
  urlsVideo: string[];
  urlsRecurso: string[];
}

interface RecursoFormProps {
  values: RecursoFormValues;
  onChange: (v: RecursoFormValues) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  editando: boolean;
}

/**
 * Que clase de material es. Va en botones y no en un desplegable porque la
 * decision importa: lo que se marque aqui define si el recurso le cuenta al
 * alumno como avance, y con un select esa consecuencia quedaba escondida.
 */
function TipoPicker({
  value,
  onChange,
}: {
  value: TipoRecurso;
  onChange: (t: TipoRecurso) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-ds-on-surface-variant">
        Tipo de material
      </label>
      <div className="flex flex-wrap gap-2">
        {TIPOS_RECURSO_ORDEN.map((id) => {
          const t = TIPOS_RECURSO[id];
          const Icono = t.icono;
          const activo = value === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-pressed={activo}
              className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-all ${
                activo
                  ? "bg-ds-primary text-ds-on-primary"
                  : "bg-ds-surface-container-highest text-ds-on-surface-variant hover:text-ds-primary"
              }`}
            >
              <Icono className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-ds-on-surface-variant">
        {TIPOS_RECURSO[value].descripcion}
      </p>
    </div>
  );
}

/** Lista editable de URLs: cada fila se puede quitar si hay mas de una. */
function UrlList({
  label,
  placeholder,
  urls,
  onChange,
  addLabel,
}: {
  label: string;
  placeholder: string;
  urls: string[];
  onChange: (urls: string[]) => void;
  addLabel: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-ds-on-surface-variant">
        {label}
      </label>
      {urls.map((url, i) => (
        <div key={i} className="mb-2 flex gap-2">
          <Input
            value={url}
            onChange={(e) =>
              onChange(urls.map((v, j) => (j === i ? e.target.value : v)))
            }
            placeholder={placeholder}
            className="bg-ds-surface-container-highest border-none"
          />
          {urls.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onChange(urls.filter((_, j) => j !== i))}
              className="shrink-0 text-ds-error"
              aria-label="Quitar"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onChange([...urls, ""])}
        className="text-ds-primary"
      >
        {addLabel}
      </Button>
    </div>
  );
}

export function RecursoForm({
  values,
  onChange,
  onSubmit,
  onCancel,
  editando,
}: RecursoFormProps) {
  const set = <K extends keyof RecursoFormValues>(
    key: K,
    value: RecursoFormValues[K]
  ) => onChange({ ...values, [key]: value });

  return (
    <Card className="mb-8 ring-0 admin-card shadow-editorial">
      <CardHeader>
        <CardTitle className="font-headline text-ds-on-surface">
          {editando ? "Editar Recurso" : "Nuevo Recurso"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-ds-on-surface-variant">
              Titulo del Recurso
            </label>
            <Input
              value={values.titulo}
              onChange={(e) => set("titulo", e.target.value)}
              placeholder="Ej: Clase 1 - Introduccion"
              required
              className="bg-ds-surface-container-highest border-none"
            />
          </div>

          <TipoPicker value={values.tipo} onChange={(t) => set("tipo", t)} />

          <div>
            <label className="mb-1 block text-sm font-medium text-ds-on-surface-variant">
              Descripcion (opcional)
            </label>
            <MarkdownEditor
              value={values.descripcion}
              onChange={(v) => set("descripcion", v)}
              placeholder="Describe el contenido de este recurso..."
            />
          </div>

          <UrlList
            label="URLs de Video (YouTube)"
            placeholder="https://youtube.com/watch?v=..."
            urls={values.urlsVideo}
            onChange={(u) => set("urlsVideo", u)}
            addLabel="+ Agregar video"
          />

          <UrlList
            label="URLs de Recurso (Google Drive)"
            placeholder="https://drive.google.com/..."
            urls={values.urlsRecurso}
            onChange={(u) => set("urlsRecurso", u)}
            addLabel="+ Agregar recurso"
          />

          <div className="flex gap-3">
            <Button
              type="submit"
              className="rounded-full bg-ds-primary text-ds-on-primary hover:bg-ds-primary-dim"
            >
              {editando ? "Guardar Cambios" : "Crear Recurso"}
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
