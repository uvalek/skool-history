"use client";

import { useRef, useState } from "react";
import { ImagePlus, Link2, Loader2, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UnidadBanner } from "@/components/unidad-banner";
import { createClient } from "@/lib/supabase/client";
import type { UnidadColor } from "@/lib/types/database";

/** Debe coincidir con el limite configurado en el bucket de Supabase. */
const MAX_BYTES = 5 * 1024 * 1024;

interface BannerPickerProps {
  value: string | null;
  onChange: (url: string | null) => void;
  color: UnidadColor;
}

export function BannerPicker({ value, onChange, color }: BannerPickerProps) {
  const [modo, setModo] = useState<"archivo" | "enlace">("archivo");
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");
  const inputArchivo = useRef<HTMLInputElement>(null);

  async function subirArchivo(file: File) {
    setError("");

    if (!file.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("La imagen supera el limite de 5 MB.");
      return;
    }

    setSubiendo(true);
    const supabase = createClient();
    // Nombre unico: evita colisiones y que una unidad pise el banner de otra.
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const ruta = `${crypto.randomUUID()}.${ext}`;

    const { error: errorSubida } = await supabase.storage
      .from("banners")
      .upload(ruta, file, { cacheControl: "3600" });

    if (errorSubida) {
      setError("No se pudo subir la imagen. Intentalo de nuevo.");
      setSubiendo(false);
      return;
    }

    const { data } = supabase.storage.from("banners").getPublicUrl(ruta);
    onChange(data.publicUrl);
    setSubiendo(false);
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-ds-on-surface-variant">
        Banner de la unidad (opcional)
      </label>

      {/* Vista previa: siempre visible, asi se ve tal cual quedara la tarjeta */}
      <div className="mb-3 overflow-hidden rounded-xl">
        <UnidadBanner imagenUrl={value} color={color} className="h-36" />
      </div>

      {value && (
        <div className="mb-3 flex items-center justify-between gap-3 rounded-lg bg-ds-surface-container-highest px-3 py-2">
          <span className="truncate text-xs text-ds-on-surface-variant">
            {value}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              onChange(null);
              setError("");
              if (inputArchivo.current) inputArchivo.current.value = "";
            }}
            className="shrink-0 text-ds-error"
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Quitar
          </Button>
        </div>
      )}

      {/* Selector de modo */}
      <div className="mb-2 flex items-center gap-1 rounded-full bg-ds-surface-container-highest p-1">
        {(
          [
            { id: "archivo", label: "Subir archivo", icon: Upload },
            { id: "enlace", label: "Pegar enlace", icon: Link2 },
          ] as const
        ).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setModo(id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
              modo === id
                ? "bg-ds-surface-container-lowest text-ds-primary shadow-editorial"
                : "text-ds-on-surface-variant hover:text-ds-primary"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {modo === "archivo" ? (
        <div>
          <input
            ref={inputArchivo}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) subirArchivo(file);
            }}
          />
          <Button
            type="button"
            variant="ghost"
            disabled={subiendo}
            onClick={() => inputArchivo.current?.click()}
            className="w-full rounded-lg bg-ds-surface-container-highest text-ds-on-surface-variant hover:text-ds-primary"
          >
            {subiendo ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <ImagePlus className="mr-2 h-4 w-4" />
                Elegir imagen (max. 5 MB)
              </>
            )}
          </Button>
        </div>
      ) : (
        <Input
          type="url"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value || null)}
          placeholder="https://ejemplo.com/imagen.jpg"
          className="border-none bg-ds-surface-container-highest"
        />
      )}

      {error && <p className="mt-2 text-sm text-ds-error">{error}</p>}
    </div>
  );
}
