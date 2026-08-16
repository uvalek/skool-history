import { cn } from "@/lib/utils";
import { SECTION_COLORS, type SeccionColor } from "@/lib/section-colors";

const secciones = Object.keys(SECTION_COLORS) as SeccionColor[];

/**
 * Degradado radial de fondo, en el color de la seccion activa.
 *
 * Dibuja las tres capas a la vez y solo cambia su opacidad: los degradados no
 * se interpolan de forma fiable entre navegadores, asi que un fundido por
 * opacidad da una transicion suave al cambiar de seccion.
 */
export function RadialBackground({ seccion }: { seccion: SeccionColor }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      {secciones.map((s) => {
        const { base, glow } = SECTION_COLORS[s];
        return (
          <div
            key={s}
            className={cn(
              "absolute inset-0 size-full transition-opacity duration-700",
              s === seccion ? "opacity-100" : "opacity-0"
            )}
            style={{
              background: `radial-gradient(125% 125% at 50% 10%, ${base} 40%, ${glow} 100%)`,
            }}
          />
        );
      })}
    </div>
  );
}
