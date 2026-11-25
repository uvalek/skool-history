import { FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { getFolderColor } from "@/lib/folder-colors";
import type { UnidadColor } from "@/lib/types/database";

interface UnidadBannerProps {
  imagenUrl: string | null;
  color: UnidadColor;
  className?: string;
}

/**
 * Cabecera visual de una tarjeta de unidad. Si la unidad no tiene banner,
 * cae en un degradado del color de su carpeta con el icono al centro, para
 * que la rejilla no quede con huecos vacios.
 */
export function UnidadBanner({
  imagenUrl,
  color,
  className,
}: UnidadBannerProps) {
  const c = getFolderColor(color);

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden",
        className
      )}
      style={{
        // El segundo tono es el del icono al 20%. Antes se lograba pegando
        // "33" al final del hexadecimal, pero ahora los colores son var() y
        // "var(--x)33" no es CSS valido: invalidaba el degradado entero y el
        // banner se quedaba sin fondo. color-mix si acepta una variable.
        background: `linear-gradient(135deg, ${c.bgHex} 0%, color-mix(in srgb, ${c.iconHex} 20%, transparent) 100%)`,
      }}
    >
      {imagenUrl ? (
        // Las URLs las escribe la profesora (Drive, Unsplash, subida propia),
        // asi que no se pueden declarar dominios fijos para next/image.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imagenUrl}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <FolderOpen className="h-10 w-10" style={{ color: c.iconHex }} />
      )}
    </div>
  );
}
