"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MarkdownEditor } from "@/components/markdown-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Pencil,
  Trash2,
  LogOut,
  X,
  FolderOpen,
  ChevronRight,
  ArrowLeft,
  GripVertical,
  GraduationCap,
  School,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type {
  Unidad,
  UnidadInsert,
  UnidadColor,
  Recurso,
  RecursoInsert,
  Categoria,
} from "@/lib/types/database";
import { FOLDER_COLORS, getFolderColor } from "@/lib/folder-colors";

// Componente sortable para cada recurso
function SortableRecursoItem({
  recurso,
  index,
  onEdit,
  onDelete,
}: {
  recurso: Recurso;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
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
      <Card className="ring-0 bg-ds-surface-container-low shadow-editorial">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing touch-none text-ds-on-surface-variant hover:text-ds-primary"
            >
              <GripVertical className="h-5 w-5" />
            </button>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ds-surface-container-highest text-sm font-semibold text-ds-on-surface-variant">
              {index + 1}
            </span>
            <div>
              <h3 className="font-headline font-semibold text-ds-on-surface">
                {recurso.titulo}
              </h3>
              <p className="text-xs text-ds-on-surface-variant">
                {recurso.urls_video.filter(Boolean).length} video(s)
                {" · "}
                {recurso.urls_recurso.filter(Boolean).length} archivo(s)
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="text-ds-primary"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="text-ds-error"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- Color Picker ---
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

// --- Unidad Card ---
function UnidadCard({
  unidad,
  onOpen,
  onEdit,
  onDelete,
}: {
  unidad: Unidad;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const color = getFolderColor(unidad.color);
  return (
    <Card
      className="ring-0 bg-ds-surface-container-low shadow-editorial cursor-pointer transition-all hover:-translate-y-0.5 hover:bg-ds-surface-bright"
      onClick={onOpen}
    >
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: color.bgHex }}
          >
            <FolderOpen className="h-5 w-5" style={{ color: color.iconHex }} />
          </div>
          <div>
            <h3 className="font-headline font-semibold text-ds-on-surface">
              {unidad.titulo}
            </h3>
            {unidad.descripcion && (
              <p className="text-sm text-ds-on-surface-variant">
                {unidad.descripcion}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="text-ds-primary"
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
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <ChevronRight className="h-5 w-5 text-ds-on-surface-variant" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminPage() {
  const supabase = createClient();
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Estado principal
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [loading, setLoading] = useState(true);

  // Vista: "unidades" o "recursos" (dentro de una unidad)
  const [vista, setVista] = useState<"unidades" | "recursos">("unidades");
  const [unidadActiva, setUnidadActiva] = useState<Unidad | null>(null);
  const [recursos, setRecursos] = useState<Recurso[]>([]);

  // Forms
  const [showUnidadForm, setShowUnidadForm] = useState(false);
  const [editingUnidadId, setEditingUnidadId] = useState<string | null>(null);
  const [unidadTitulo, setUnidadTitulo] = useState("");
  const [unidadDescripcion, setUnidadDescripcion] = useState("");
  const [unidadCategoria, setUnidadCategoria] =
    useState<Categoria>("secundaria");
  const [unidadColor, setUnidadColor] = useState<UnidadColor>("purple");

  const [showRecursoForm, setShowRecursoForm] = useState(false);
  const [editingRecursoId, setEditingRecursoId] = useState<string | null>(null);
  const [recursoTitulo, setRecursoTitulo] = useState("");
  const [recursoDescripcion, setRecursoDescripcion] = useState("");
  const [urlsVideo, setUrlsVideo] = useState<string[]>([""]);
  const [urlsRecurso, setUrlsRecurso] = useState<string[]>([""]);

  useEffect(() => {
    fetchUnidades();
  }, []);

  // --- Derived data ---
  const unidadesSecundaria = unidades.filter(
    (u) => u.categoria === "secundaria"
  );
  const unidadesUniversidad = unidades.filter(
    (u) => u.categoria === "universidad"
  );

  // --- Fetch ---
  async function fetchUnidades() {
    const { data } = await supabase
      .from("unidades")
      .select("*")
      .order("orden", { ascending: true });
    setUnidades((data as Unidad[]) || []);
    setLoading(false);
  }

  async function fetchRecursos(unidadId: string) {
    const { data } = await supabase
      .from("recursos")
      .select("*")
      .eq("unidad_id", unidadId)
      .order("orden", { ascending: true });
    setRecursos((data as Recurso[]) || []);
  }

  // --- Navegar a unidad ---
  function abrirUnidad(unidad: Unidad) {
    setUnidadActiva(unidad);
    setVista("recursos");
    fetchRecursos(unidad.id);
  }

  function volverAUnidades() {
    setVista("unidades");
    setUnidadActiva(null);
    setRecursos([]);
    resetRecursoForm();
  }

  // --- Unidad CRUD ---
  function resetUnidadForm() {
    setUnidadTitulo("");
    setUnidadDescripcion("");
    setUnidadCategoria("secundaria");
    setUnidadColor("purple");
    setEditingUnidadId(null);
    setShowUnidadForm(false);
  }

  function startEditUnidad(unidad: Unidad) {
    setUnidadTitulo(unidad.titulo);
    setUnidadDescripcion(unidad.descripcion);
    setUnidadCategoria(unidad.categoria);
    setUnidadColor(unidad.color || "purple");
    setEditingUnidadId(unidad.id);
    setShowUnidadForm(true);
  }

  async function handleUnidadSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: UnidadInsert = {
      titulo: unidadTitulo,
      descripcion: unidadDescripcion,
      categoria: unidadCategoria,
      color: unidadColor,
      orden: unidades.length,
    };

    if (editingUnidadId) {
      await supabase.from("unidades").update(payload).eq("id", editingUnidadId);
    } else {
      await supabase.from("unidades").insert(payload);
    }
    resetUnidadForm();
    fetchUnidades();
  }

  async function handleDeleteUnidad(id: string) {
    if (
      !confirm(
        "Eliminar esta unidad? Se borraran todos los recursos dentro de ella."
      )
    )
      return;
    await supabase.from("unidades").delete().eq("id", id);
    fetchUnidades();
  }

  // --- Recurso CRUD ---
  function resetRecursoForm() {
    setRecursoTitulo("");
    setRecursoDescripcion("");
    setUrlsVideo([""]);
    setUrlsRecurso([""]);
    setEditingRecursoId(null);
    setShowRecursoForm(false);
  }

  function startEditRecurso(recurso: Recurso) {
    setRecursoTitulo(recurso.titulo);
    setRecursoDescripcion(recurso.descripcion || "");
    setUrlsVideo(recurso.urls_video.length ? recurso.urls_video : [""]);
    setUrlsRecurso(recurso.urls_recurso.length ? recurso.urls_recurso : [""]);
    setEditingRecursoId(recurso.id);
    setShowRecursoForm(true);
  }

  async function handleRecursoSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!unidadActiva) return;

    if (editingRecursoId) {
      await supabase
        .from("recursos")
        .update({
          titulo: recursoTitulo,
          descripcion: recursoDescripcion,
          urls_video: urlsVideo.filter(Boolean),
          urls_recurso: urlsRecurso.filter(Boolean),
        })
        .eq("id", editingRecursoId);
    } else {
      await supabase.from("recursos").insert({
        titulo: recursoTitulo,
        descripcion: recursoDescripcion,
        categoria: unidadActiva.categoria,
        urls_video: urlsVideo.filter(Boolean),
        urls_recurso: urlsRecurso.filter(Boolean),
        unidad_id: unidadActiva.id,
        orden: recursos.length,
      });
    }
    resetRecursoForm();
    fetchRecursos(unidadActiva.id);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || !unidadActiva) return;

    const oldIndex = recursos.findIndex((r) => r.id === active.id);
    const newIndex = recursos.findIndex((r) => r.id === over.id);
    const reordered = arrayMove(recursos, oldIndex, newIndex);

    setRecursos(reordered);

    await Promise.all(
      reordered.map((r, i) =>
        supabase.from("recursos").update({ orden: i }).eq("id", r.id)
      )
    );
  }

  async function handleDeleteRecurso(id: string) {
    if (!confirm("Eliminar este recurso?")) return;
    if (!unidadActiva) return;
    await supabase.from("recursos").delete().eq("id", id);
    fetchRecursos(unidadActiva.id);
  }

  // --- Helpers ---
  function updateArrayField(
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) {
    setter((prev) => prev.map((v, i) => (i === index ? value : v)));
  }

  function addArrayField(
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    setter((prev) => [...prev, ""]);
  }

  function removeArrayField(
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) {
    setter((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  // --- Section renderer ---
  function renderUnidadSection(
    title: string,
    icon: React.ReactNode,
    list: Unidad[]
  ) {
    return (
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          {icon}
          <h3 className="font-headline text-lg font-bold text-ds-on-surface">
            {title}
          </h3>
          <span className="ml-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-ds-surface-container-highest px-2 text-xs font-semibold text-ds-on-surface-variant">
            {list.length}
          </span>
        </div>
        {list.length > 0 ? (
          <div className="space-y-3">
            {list.map((unidad) => (
              <UnidadCard
                key={unidad.id}
                unidad={unidad}
                onOpen={() => abrirUnidad(unidad)}
                onEdit={() => startEditUnidad(unidad)}
                onDelete={() => handleDeleteUnidad(unidad.id)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-ds-surface-container-low py-8 text-center">
            <p className="text-sm text-ds-on-surface-variant">
              No hay unidades en esta categoria.
            </p>
          </div>
        )}
      </section>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ds-surface">
        <p className="text-ds-on-surface-variant">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ds-surface">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b ghost-border">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            {vista === "recursos" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={volverAUnidades}
                className="text-ds-on-surface-variant"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <h1 className="font-headline text-lg font-bold text-ds-on-surface">
              {vista === "unidades"
                ? "Panel de Administracion"
                : `Unidad: ${unidadActiva?.titulo}`}
            </h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-ds-on-surface-variant"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Salir
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        {/* ========= VISTA UNIDADES ========= */}
        {vista === "unidades" && (
          <>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-headline text-2xl font-bold text-ds-on-surface">
                Unidades
              </h2>
              {!showUnidadForm && (
                <Button
                  onClick={() => setShowUnidadForm(true)}
                  className="rounded-full bg-ds-primary text-ds-on-primary hover:bg-ds-primary-dim"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Unidad
                </Button>
              )}
            </div>

            {/* Form Unidad */}
            {showUnidadForm && (
              <Card className="mb-8 ring-0 bg-ds-surface-container-low shadow-editorial">
                <CardHeader>
                  <CardTitle className="font-headline text-ds-on-surface">
                    {editingUnidadId ? "Editar Unidad" : "Nueva Unidad"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUnidadSubmit} className="space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-ds-on-surface-variant">
                        Titulo de la Unidad
                      </label>
                      <Input
                        value={unidadTitulo}
                        onChange={(e) => setUnidadTitulo(e.target.value)}
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
                        value={unidadDescripcion}
                        onChange={(e) => setUnidadDescripcion(e.target.value)}
                        placeholder="Breve descripcion de la unidad"
                        className="bg-ds-surface-container-highest border-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-ds-on-surface-variant">
                        Categoria
                      </label>
                      <Select
                        value={unidadCategoria}
                        onValueChange={(v) =>
                          setUnidadCategoria(v as Categoria)
                        }
                      >
                        <SelectTrigger className="bg-ds-surface-container-highest border-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="secundaria">Secundaria</SelectItem>
                          <SelectItem value="universidad">
                            Universidad
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <ColorPicker value={unidadColor} onChange={setUnidadColor} />
                    <div className="flex gap-3">
                      <Button
                        type="submit"
                        className="rounded-full bg-ds-primary text-ds-on-primary hover:bg-ds-primary-dim"
                      >
                        {editingUnidadId ? "Guardar Cambios" : "Crear Unidad"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={resetUnidadForm}
                        className="rounded-full text-ds-on-surface-variant"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Secciones por categoria */}
            {renderUnidadSection(
              "Secundaria",
              <School className="h-5 w-5 text-ds-primary" />,
              unidadesSecundaria
            )}
            {renderUnidadSection(
              "Universidad",
              <GraduationCap className="h-5 w-5 text-ds-secondary" />,
              unidadesUniversidad
            )}
          </>
        )}

        {/* ========= VISTA RECURSOS (dentro de unidad) ========= */}
        {vista === "recursos" && unidadActiva && (
          <>
            <div className="mb-2">
              <p className="text-sm text-ds-on-surface-variant">
                {unidadActiva.categoria === "secundaria"
                  ? "Secundaria"
                  : "Universidad"}
                {unidadActiva.descripcion &&
                  ` · ${unidadActiva.descripcion}`}
              </p>
            </div>

            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-headline text-xl font-bold text-ds-on-surface">
                Recursos de la unidad
              </h2>
              {!showRecursoForm && (
                <Button
                  onClick={() => setShowRecursoForm(true)}
                  className="rounded-full bg-ds-primary text-ds-on-primary hover:bg-ds-primary-dim"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Recurso
                </Button>
              )}
            </div>

            {/* Form Recurso */}
            {showRecursoForm && (
              <Card className="mb-8 ring-0 bg-ds-surface-container-low shadow-editorial">
                <CardHeader>
                  <CardTitle className="font-headline text-ds-on-surface">
                    {editingRecursoId ? "Editar Recurso" : "Nuevo Recurso"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRecursoSubmit} className="space-y-6">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-ds-on-surface-variant">
                        Titulo del Recurso
                      </label>
                      <Input
                        value={recursoTitulo}
                        onChange={(e) => setRecursoTitulo(e.target.value)}
                        placeholder="Ej: Clase 1 - Introduccion"
                        required
                        className="bg-ds-surface-container-highest border-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-ds-on-surface-variant">
                        Descripcion (opcional)
                      </label>
                      <MarkdownEditor
                        value={recursoDescripcion}
                        onChange={setRecursoDescripcion}
                        placeholder="Describe el contenido de este recurso..."
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-ds-on-surface-variant">
                        URLs de Video (YouTube)
                      </label>
                      {urlsVideo.map((url, i) => (
                        <div key={i} className="mb-2 flex gap-2">
                          <Input
                            value={url}
                            onChange={(e) =>
                              updateArrayField(setUrlsVideo, i, e.target.value)
                            }
                            placeholder="https://youtube.com/watch?v=..."
                            className="bg-ds-surface-container-highest border-none"
                          />
                          {urlsVideo.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeArrayField(setUrlsVideo, i)}
                              className="text-ds-error shrink-0"
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
                        onClick={() => addArrayField(setUrlsVideo)}
                        className="text-ds-primary"
                      >
                        + Agregar video
                      </Button>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-ds-on-surface-variant">
                        URLs de Recurso (Google Drive)
                      </label>
                      {urlsRecurso.map((url, i) => (
                        <div key={i} className="mb-2 flex gap-2">
                          <Input
                            value={url}
                            onChange={(e) =>
                              updateArrayField(
                                setUrlsRecurso,
                                i,
                                e.target.value
                              )
                            }
                            placeholder="https://drive.google.com/..."
                            className="bg-ds-surface-container-highest border-none"
                          />
                          {urlsRecurso.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                removeArrayField(setUrlsRecurso, i)
                              }
                              className="text-ds-error shrink-0"
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
                        onClick={() => addArrayField(setUrlsRecurso)}
                        className="text-ds-primary"
                      >
                        + Agregar recurso
                      </Button>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="submit"
                        className="rounded-full bg-ds-primary text-ds-on-primary hover:bg-ds-primary-dim"
                      >
                        {editingRecursoId
                          ? "Guardar Cambios"
                          : "Crear Recurso"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={resetRecursoForm}
                        className="rounded-full text-ds-on-surface-variant"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Lista de Recursos - Drag & Drop */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={recursos.map((r) => r.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {recursos.map((recurso, index) => (
                    <SortableRecursoItem
                      key={recurso.id}
                      recurso={recurso}
                      index={index}
                      onEdit={() => startEditRecurso(recurso)}
                      onDelete={() => handleDeleteRecurso(recurso.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {recursos.length === 0 && !showRecursoForm && (
              <p className="py-12 text-center text-ds-on-surface-variant">
                Esta unidad aun no tiene recursos. Agrega el primero.
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}
