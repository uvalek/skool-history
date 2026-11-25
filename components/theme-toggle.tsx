"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { CLAVE_TEMA, type Tema } from "@/lib/tema";
import { cn } from "@/lib/utils";

/**
 * Alterna entre claro y oscuro, y recuerda la eleccion.
 *
 * El estado arranca en "oscuro" a proposito: es lo que pinta el servidor, asi
 * que el primer render del cliente coincide y React no marca desajuste de
 * hidratacion. Si el usuario tenia guardado claro, el efecto lo corrige en
 * cuanto monta; para entonces el script de <head> ya quito la clase, de modo
 * que lo unico que cambia es el icono, no los colores.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [tema, setTema] = useState<Tema>("oscuro");

  useEffect(() => {
    setTema(
      document.documentElement.classList.contains("dark") ? "oscuro" : "claro"
    );
  }, []);

  function alternar() {
    const siguiente: Tema = tema === "oscuro" ? "claro" : "oscuro";
    document.documentElement.classList.toggle("dark", siguiente === "oscuro");
    try {
      localStorage.setItem(CLAVE_TEMA, siguiente);
    } catch {
      // Sin almacenamiento el tema dura lo que la pestaña. Preferible a no
      // dejar cambiarlo.
    }
    setTema(siguiente);
  }

  const vaAOscuro = tema === "claro";
  const etiqueta = vaAOscuro ? "Cambiar a tema oscuro" : "Cambiar a tema claro";

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={etiqueta}
      title={etiqueta}
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
        "text-ds-on-surface-variant transition-colors",
        "hover:bg-ds-surface-container-high hover:text-ds-primary",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ds-primary",
        className
      )}
    >
      {vaAOscuro ? (
        <Moon className="h-[18px] w-[18px]" />
      ) : (
        <Sun className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}
