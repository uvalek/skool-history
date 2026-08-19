import Link from "next/link";
import { GraduationCap, School } from "lucide-react";
import { CATEGORIAS, CATEGORIAS_ORDEN } from "@/lib/categorias";
import type { Categoria } from "@/lib/types/database";

const iconos: Record<Categoria, typeof School> = {
  secundaria: School,
  uatx: GraduationCap,
  uvhm: GraduationCap,
};

export function GateSelector() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {CATEGORIAS_ORDEN.map((id) => {
        const c = CATEGORIAS[id];
        const Icon = iconos[id];

        return (
          <Link key={id} href={`/${id}`} className="block">
            <div
              className="rotating-gradient h-full transition-all hover:-translate-y-1"
              style={
                {
                  "--gradient-color-1": c.accent,
                  "--gradient-color-2": c.glow,
                  boxShadow: `0 2px 16px ${c.wash}, 0 4px 32px ${c.wash}`,
                } as React.CSSProperties
              }
            >
              <div className="relative z-[1] m-[3px] flex h-full flex-col items-center gap-6 rounded-[calc(1rem-3px)] bg-white p-10">
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-full"
                  style={{ backgroundColor: c.light }}
                >
                  <Icon className="h-10 w-10" style={{ color: c.accent }} />
                </div>
                <div className="text-center">
                  <h2 className="font-headline text-2xl font-bold text-ds-on-surface">
                    {c.label}
                  </h2>
                  <p className="mt-2 text-ds-on-surface-variant">
                    {c.descripcion}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
