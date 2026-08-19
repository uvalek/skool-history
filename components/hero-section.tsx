import { CATEGORIAS } from "@/lib/categorias";
import type { Categoria } from "@/lib/types/database";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  /** Sin categoria, usa el morado de la marca. */
  categoria?: Categoria;
}

export function HeroSection({ title, subtitle, categoria }: HeroSectionProps) {
  const c = categoria ? CATEGORIAS[categoria] : null;

  const estilos = c
    ? {
        gradient: `linear-gradient(135deg, ${c.glow} 0%, ${c.light} 40%, ${c.base} 100%)`,
        shadow: `0 4px 24px ${c.wash}, 0 1.5px 6px ${c.wash}`,
        titleColor: c.onLight,
        subtitleColor: c.accent,
      }
    : {
        gradient: "linear-gradient(135deg, #c2b9ff 0%, #fef7ff 100%)",
        shadow:
          "0 4px 24px rgba(93, 72, 206, 0.12), 0 1.5px 6px rgba(93, 72, 206, 0.08)",
        titleColor: "#392b53",
        subtitleColor: "#665883",
      };

  return (
    <section className="px-6 pt-6 pb-2">
      <div className="mx-auto max-w-7xl">
        <div
          className="rounded-2xl px-8 py-12 md:px-12 md:py-16"
          style={{ background: estilos.gradient, boxShadow: estilos.shadow }}
        >
          <h1
            className="font-headline text-4xl font-extrabold tracking-tight md:text-5xl"
            style={{ color: estilos.titleColor }}
          >
            {title}
          </h1>
          <p
            className="mt-4 max-w-2xl text-lg"
            style={{ color: estilos.subtitleColor }}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
