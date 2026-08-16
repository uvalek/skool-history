"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu, Plus } from "lucide-react";
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
  rectSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  AdminSidebar,
  type Seccion,
} from "@/components/admin/admin-sidebar";
import { DashboardView } from "@/components/admin/dashboard-view";
import { RecursoListItem } from "@/components/admin/recurso-list-item";
import {
  RecursoForm,
  type RecursoFormValues,
} from "@/components/admin/recurso-form";
import {
  UnidadForm,
  type UnidadFormValues,
} from "@/components/admin/unidad-form";
import { UnidadGalleryCard } from "@/components/admin/unidad-gallery-card";
import { UnidadListItem } from "@/components/admin/unidad-list-item";
import {
  ViewToggle,
  VISTA_STORAGE_KEY,
  type VistaUnidades,
} from "@/components/admin/view-toggle";
import {
  calcularEstadisticas,
  contarRecursosPorUnidad,
  etiquetaCategoria,
} from "@/lib/admin-stats";
import type {
  Categoria,
  Recurso,
  Unidad,
  UnidadInsert,
} from "@/lib/types/database";

const UNIDAD_FORM_VACIO: UnidadFormValues = {
  titulo: "",
  descripcion: "",
  categoria: "secundaria",
  color: "purple",
};

const RECURSO_FORM_VACIO: RecursoFormValues = {
  titulo: "",
  descripcion: "",
  urlsVideo: [""],
  urlsRecurso: [""],
};

export default function AdminPage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // --- Datos ---
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Navegacion ---
  const [seccion, setSeccion] = useState<Seccion>("dashboard");
  const [unidadActivaId, setUnidadActivaId] = useState<string | null>(null);
  const [sidebarAbierta, setSidebarAbierta] = useState(false);
  const [vista, setVista] = useState<VistaUnidades>("galeria");

  // --- Formularios ---
  const [showUnidadForm, setShowUnidadForm] = useState(false);
  const [editingUnidadId, setEditingUnidadId] = useState<string | null>(null);
  const [unidadForm, setUnidadForm] =
    useState<UnidadFormValues>(UNIDAD_FORM_VACIO);

  const [showRecursoForm, setShowRecursoForm] = useState(false);
  const [editingRecursoId, setEditingRecursoId] = useState<string | null>(null);
  const [recursoForm, setRecursoForm] =
    useState<RecursoFormValues>(RECURSO_FORM_VACIO);

  // --- Carga inicial ---
  const fetchTodo = useCallback(async () => {
    const [{ data: u }, { data: r }] = await Promise.all([
      supabase.from("unidades").select("*").order("orden", { ascending: true }),
      supabase.from("recursos").select("*").order("orden", { ascending: true }),
    ]);
    setUnidades((u as Unidad[]) || []);
    setRecursos((r as Recurso[]) || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchTodo();
  }, [fetchTodo]);

  // La preferencia de vista se lee tras el montaje para no romper la hidratacion.
  useEffect(() => {
    const guardada = localStorage.getItem(VISTA_STORAGE_KEY);
    if (guardada === "galeria" || guardada === "lista") setVista(guardada);
  }, []);

  function cambiarVista(v: VistaUnidades) {
    setVista(v);
    localStorage.setItem(VISTA_STORAGE_KEY, v);
  }

  // --- Datos derivados ---
  const stats = useMemo(
    () => calcularEstadisticas(unidades, recursos),
    [unidades, recursos]
  );

  const conteos = useMemo(
    () => contarRecursosPorUnidad(recursos),
    [recursos]
  );

  // Derivada del estado, no copiada: asi refleja las ediciones y desaparece
  // sola si la unidad se elimina.
  const unidadActiva = useMemo(
    () => unidades.find((u) => u.id === unidadActivaId) ?? null,
    [unidades, unidadActivaId]
  );

  const categoriaActiva: Categoria =
    seccion === "universidad" ? "universidad" : "secundaria";

  const unidadesFiltradas = useMemo(
    () => unidades.filter((u) => u.categoria === categoriaActiva),
    [unidades, categoriaActiva]
  );

  const recursosDeUnidad = useMemo(
    () =>
      unidadActiva
        ? recursos
            .filter((r) => r.unidad_id === unidadActiva.id)
            .sort((a, b) => a.orden - b.orden)
        : [],
    [recursos, unidadActiva]
  );

  // --- Navegacion ---
  function irASeccion(s: Seccion) {
    setSeccion(s);
    setUnidadActivaId(null);
    setSidebarAbierta(false);
    resetUnidadForm();
    resetRecursoForm();
  }

  function abrirUnidad(unidad: Unidad) {
    setUnidadActivaId(unidad.id);
    setSeccion(unidad.categoria);
    resetRecursoForm();
  }

  function volverAUnidades() {
    setUnidadActivaId(null);
    resetRecursoForm();
  }

  // --- CRUD Unidad ---
  function resetUnidadForm() {
    setUnidadForm(UNIDAD_FORM_VACIO);
    setEditingUnidadId(null);
    setShowUnidadForm(false);
  }

  function nuevaUnidad() {
    setUnidadForm({ ...UNIDAD_FORM_VACIO, categoria: categoriaActiva });
    setEditingUnidadId(null);
    setShowUnidadForm(true);
  }

  function startEditUnidad(unidad: Unidad) {
    setUnidadForm({
      titulo: unidad.titulo,
      descripcion: unidad.descripcion,
      categoria: unidad.categoria,
      color: unidad.color || "purple",
    });
    setEditingUnidadId(unidad.id);
    setShowUnidadForm(true);
  }

  async function handleUnidadSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (editingUnidadId) {
      // Sin 'orden': reescribirlo aqui borraria el orden fijado a mano.
      await supabase
        .from("unidades")
        .update({
          titulo: unidadForm.titulo,
          descripcion: unidadForm.descripcion,
          categoria: unidadForm.categoria,
          color: unidadForm.color,
        })
        .eq("id", editingUnidadId);
    } else {
      const payload: UnidadInsert = {
        ...unidadForm,
        orden: unidades.filter((u) => u.categoria === unidadForm.categoria)
          .length,
      };
      await supabase.from("unidades").insert(payload);
    }

    resetUnidadForm();
    fetchTodo();
  }

  async function handleDeleteUnidad(id: string) {
    if (
      !confirm(
        "Eliminar esta unidad? Se borraran todos los recursos dentro de ella."
      )
    )
      return;
    await supabase.from("unidades").delete().eq("id", id);
    fetchTodo();
  }

  async function handleUnidadDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = unidadesFiltradas.findIndex((u) => u.id === active.id);
    const newIndex = unidadesFiltradas.findIndex((u) => u.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordenadas = arrayMove(unidadesFiltradas, oldIndex, newIndex);
    // 'orden' es un indice dentro de cada categoria; las paginas publicas
    // filtran por categoria antes de ordenar, asi que no hace falta un
    // indice global.
    const nuevoOrden = new Map(reordenadas.map((u, i) => [u.id, i]));

    setUnidades((prev) =>
      prev.map((u) =>
        nuevoOrden.has(u.id) ? { ...u, orden: nuevoOrden.get(u.id)! } : u
      )
    );

    await Promise.all(
      reordenadas.map((u, i) =>
        supabase.from("unidades").update({ orden: i }).eq("id", u.id)
      )
    );
  }

  // --- CRUD Recurso ---
  function resetRecursoForm() {
    setRecursoForm(RECURSO_FORM_VACIO);
    setEditingRecursoId(null);
    setShowRecursoForm(false);
  }

  function startEditRecurso(recurso: Recurso) {
    setRecursoForm({
      titulo: recurso.titulo,
      descripcion: recurso.descripcion || "",
      urlsVideo: recurso.urls_video.length ? recurso.urls_video : [""],
      urlsRecurso: recurso.urls_recurso.length ? recurso.urls_recurso : [""],
    });
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
          titulo: recursoForm.titulo,
          descripcion: recursoForm.descripcion,
          urls_video: recursoForm.urlsVideo.filter(Boolean),
          urls_recurso: recursoForm.urlsRecurso.filter(Boolean),
        })
        .eq("id", editingRecursoId);
    } else {
      await supabase.from("recursos").insert({
        titulo: recursoForm.titulo,
        descripcion: recursoForm.descripcion,
        categoria: unidadActiva.categoria,
        urls_video: recursoForm.urlsVideo.filter(Boolean),
        urls_recurso: recursoForm.urlsRecurso.filter(Boolean),
        unidad_id: unidadActiva.id,
        orden: recursosDeUnidad.length,
      });
    }

    resetRecursoForm();
    fetchTodo();
  }

  async function handleDeleteRecurso(id: string) {
    if (!confirm("Eliminar este recurso?")) return;
    await supabase.from("recursos").delete().eq("id", id);
    fetchTodo();
  }

  async function handleRecursoDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = recursosDeUnidad.findIndex((r) => r.id === active.id);
    const newIndex = recursosDeUnidad.findIndex((r) => r.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordenados = arrayMove(recursosDeUnidad, oldIndex, newIndex);
    const nuevoOrden = new Map(reordenados.map((r, i) => [r.id, i]));

    setRecursos((prev) =>
      prev.map((r) =>
        nuevoOrden.has(r.id) ? { ...r, orden: nuevoOrden.get(r.id)! } : r
      )
    );

    await Promise.all(
      reordenados.map((r, i) =>
        supabase.from("recursos").update({ orden: i }).eq("id", r.id)
      )
    );
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  // --- Render ---
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ds-surface">
        <p className="text-ds-on-surface-variant">Cargando...</p>
      </div>
    );
  }

  const tituloEncabezado = unidadActiva
    ? unidadActiva.titulo
    : seccion === "dashboard"
      ? "Panel de Administracion"
      : etiquetaCategoria[categoriaActiva];

  return (
    <div className="min-h-screen bg-ds-surface">
      <AdminSidebar
        seccion={seccion}
        onSeccionChange={irASeccion}
        conteos={{
          secundaria: stats.unidades.secundaria,
          universidad: stats.unidades.universidad,
        }}
        onLogout={handleLogout}
        abierta={sidebarAbierta}
        onCerrar={() => setSidebarAbierta(false)}
      />

      <div className="md:pl-[260px]">
        {/* Encabezado */}
        <header className="sticky top-0 z-30 glass-card border-b ghost-border">
          <div className="flex h-16 items-center gap-3 px-6">
            <button
              onClick={() => setSidebarAbierta(true)}
              className="text-ds-on-surface-variant md:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            {unidadActiva && (
              <Button
                variant="ghost"
                size="icon"
                onClick={volverAUnidades}
                className="text-ds-on-surface-variant"
                aria-label="Volver a unidades"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <h1 className="truncate font-headline text-lg font-bold text-ds-on-surface">
              {tituloEncabezado}
            </h1>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-8">
          {/* ========= DASHBOARD ========= */}
          {seccion === "dashboard" && !unidadActiva && (
            <DashboardView stats={stats} onAbrirUnidad={abrirUnidad} />
          )}

          {/* ========= UNIDADES DE UNA CATEGORIA ========= */}
          {seccion !== "dashboard" && !unidadActiva && (
            <>
              <div className="mb-8 flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-headline text-2xl font-bold text-ds-on-surface">
                    {etiquetaCategoria[categoriaActiva]}
                  </h2>
                  <p className="mt-1 text-sm text-ds-on-surface-variant">
                    {unidadesFiltradas.length} unidad(es) · arrastra para
                    reordenar
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <ViewToggle vista={vista} onChange={cambiarVista} />
                  {!showUnidadForm && (
                    <Button
                      onClick={nuevaUnidad}
                      className="rounded-full bg-ds-primary text-ds-on-primary hover:bg-ds-primary-dim"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Nueva Unidad
                    </Button>
                  )}
                </div>
              </div>

              {showUnidadForm && (
                <UnidadForm
                  values={unidadForm}
                  onChange={setUnidadForm}
                  onSubmit={handleUnidadSubmit}
                  onCancel={resetUnidadForm}
                  editando={editingUnidadId !== null}
                />
              )}

              {unidadesFiltradas.length > 0 ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleUnidadDragEnd}
                >
                  <SortableContext
                    items={unidadesFiltradas.map((u) => u.id)}
                    strategy={
                      vista === "galeria"
                        ? rectSortingStrategy
                        : verticalListSortingStrategy
                    }
                  >
                    {vista === "galeria" ? (
                      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {unidadesFiltradas.map((unidad) => (
                          <UnidadGalleryCard
                            key={unidad.id}
                            unidad={unidad}
                            recursoCount={conteos[unidad.id] || 0}
                            onOpen={() => abrirUnidad(unidad)}
                            onEdit={() => startEditUnidad(unidad)}
                            onDelete={() => handleDeleteUnidad(unidad.id)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {unidadesFiltradas.map((unidad) => (
                          <UnidadListItem
                            key={unidad.id}
                            unidad={unidad}
                            recursoCount={conteos[unidad.id] || 0}
                            onOpen={() => abrirUnidad(unidad)}
                            onEdit={() => startEditUnidad(unidad)}
                            onDelete={() => handleDeleteUnidad(unidad.id)}
                          />
                        ))}
                      </div>
                    )}
                  </SortableContext>
                </DndContext>
              ) : (
                !showUnidadForm && (
                  <div className="rounded-xl bg-ds-surface-container-low py-16 text-center">
                    <p className="text-sm text-ds-on-surface-variant">
                      No hay unidades en esta categoria. Crea la primera.
                    </p>
                  </div>
                )
              )}
            </>
          )}

          {/* ========= RECURSOS DE UNA UNIDAD ========= */}
          {unidadActiva && (
            <>
              <div className="mb-2">
                <p className="text-sm text-ds-on-surface-variant">
                  {etiquetaCategoria[unidadActiva.categoria]}
                  {unidadActiva.descripcion && ` · ${unidadActiva.descripcion}`}
                </p>
              </div>

              <div className="mb-8 flex items-center justify-between gap-3">
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

              {showRecursoForm && (
                <RecursoForm
                  values={recursoForm}
                  onChange={setRecursoForm}
                  onSubmit={handleRecursoSubmit}
                  onCancel={resetRecursoForm}
                  editando={editingRecursoId !== null}
                />
              )}

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleRecursoDragEnd}
              >
                <SortableContext
                  items={recursosDeUnidad.map((r) => r.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {recursosDeUnidad.map((recurso, index) => (
                      <RecursoListItem
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

              {recursosDeUnidad.length === 0 && !showRecursoForm && (
                <p className="py-12 text-center text-ds-on-surface-variant">
                  Esta unidad aun no tiene recursos. Agrega el primero.
                </p>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
