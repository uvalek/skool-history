"use client";

import Link from "next/link";
import {
  BookOpen,
  ExternalLink,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  School,
  X,
} from "lucide-react";

export type Seccion = "dashboard" | "secundaria" | "universidad";

interface AdminSidebarProps {
  seccion: Seccion;
  onSeccionChange: (s: Seccion) => void;
  conteos: { secundaria: number; universidad: number };
  onLogout: () => void;
  abierta: boolean;
  onCerrar: () => void;
}

const items: {
  id: Seccion;
  label: string;
  icon: typeof LayoutDashboard;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "secundaria", label: "Secundaria", icon: School },
  { id: "universidad", label: "Universidad", icon: GraduationCap },
];

export function AdminSidebar({
  seccion,
  onSeccionChange,
  conteos,
  onLogout,
  abierta,
  onCerrar,
}: AdminSidebarProps) {
  return (
    <>
      {/* Velo para el cajon en movil */}
      {abierta && (
        <div
          className="fixed inset-0 z-40 bg-[#392b53]/20 backdrop-blur-sm md:hidden"
          onClick={onCerrar}
          aria-hidden
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-ds-surface-container-low transition-transform duration-300 md:translate-x-0 ${
          abierta ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Marca */}
        <div className="flex h-16 shrink-0 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-ds-primary" />
            <span className="font-headline text-lg font-bold tracking-tight text-ds-on-surface">
              Elizaveta
            </span>
          </Link>
          <button
            onClick={onCerrar}
            className="text-ds-on-surface-variant md:hidden"
            aria-label="Cerrar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navegacion */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {items.map(({ id, label, icon: Icon }) => {
            const activa = seccion === id;
            const conteo =
              id === "secundaria"
                ? conteos.secundaria
                : id === "universidad"
                  ? conteos.universidad
                  : null;

            return (
              <button
                key={id}
                onClick={() => onSeccionChange(id)}
                className={`flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
                  activa
                    ? "bg-ds-primary-container text-ds-on-primary-container"
                    : "text-ds-on-surface-variant hover:bg-ds-surface-container-high hover:text-ds-primary"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="flex-1 text-left">{label}</span>
                {conteo !== null && (
                  <span
                    className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold ${
                      activa
                        ? "bg-ds-on-primary-container/15 text-ds-on-primary-container"
                        : "bg-ds-surface-container-highest text-ds-on-surface-variant"
                    }`}
                  >
                    {conteo}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Pie */}
        <div className="space-y-1 px-3 pb-4">
          <Link
            href="/"
            target="_blank"
            className="flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium text-ds-on-surface-variant transition-colors hover:bg-ds-surface-container-high hover:text-ds-primary"
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            Ver sitio publico
          </Link>
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium text-ds-on-surface-variant transition-colors hover:bg-ds-surface-container-high hover:text-ds-error"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Salir
          </button>
        </div>
      </aside>
    </>
  );
}
