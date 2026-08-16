"use client";

import { LayoutGrid, List } from "lucide-react";

export type VistaUnidades = "galeria" | "lista";

export const VISTA_STORAGE_KEY = "admin-vista-unidades";

interface ViewToggleProps {
  vista: VistaUnidades;
  onChange: (v: VistaUnidades) => void;
}

const opciones: { id: VistaUnidades; label: string; icon: typeof List }[] = [
  { id: "galeria", label: "Vista galeria", icon: LayoutGrid },
  { id: "lista", label: "Vista lista", icon: List },
];

export function ViewToggle({ vista, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-ds-surface-container-high p-1">
      {opciones.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          title={label}
          aria-label={label}
          aria-pressed={vista === id}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
            vista === id
              ? "bg-ds-surface-container-lowest text-ds-primary shadow-editorial"
              : "text-ds-on-surface-variant hover:text-ds-primary"
          }`}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
