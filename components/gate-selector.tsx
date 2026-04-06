import Link from "next/link";
import { GraduationCap, School } from "lucide-react";

export function GateSelector() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Secundaria */}
      <Link href="/secundaria" className="block">
        <div
          className="rotating-gradient transition-all hover:-translate-y-1"
          style={
            {
              "--gradient-color-1": "#059669",
              "--gradient-color-2": "#6ee7b7",
              boxShadow:
                "0 2px 16px rgba(5, 150, 105, 0.10), 0 4px 32px rgba(5, 150, 105, 0.06)",
            } as React.CSSProperties
          }
        >
          <div className="relative z-[1] m-[3px] flex flex-col items-center gap-6 rounded-[calc(1rem-3px)] bg-white p-12">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full"
              style={{ backgroundColor: "#d1fae5" }}
            >
              <School className="h-10 w-10" style={{ color: "#059669" }} />
            </div>
            <div className="text-center">
              <h2 className="font-headline text-2xl font-bold text-ds-on-surface">
                Secundaria
              </h2>
              <p className="mt-2 text-ds-on-surface-variant">
                Recursos de historia para nivel secundario
              </p>
            </div>
          </div>
        </div>
      </Link>

      {/* Universidad */}
      <Link href="/universidad" className="block">
        <div
          className="rotating-gradient transition-all hover:-translate-y-1"
          style={
            {
              "--gradient-color-1": "#b45309",
              "--gradient-color-2": "#fbbf24",
              boxShadow:
                "0 2px 16px rgba(180, 83, 9, 0.10), 0 4px 32px rgba(180, 83, 9, 0.06)",
            } as React.CSSProperties
          }
        >
          <div className="relative z-[1] m-[3px] flex flex-col items-center gap-6 rounded-[calc(1rem-3px)] bg-white p-12">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full"
              style={{ backgroundColor: "#fde68a" }}
            >
              <GraduationCap
                className="h-10 w-10"
                style={{ color: "#b45309" }}
              />
            </div>
            <div className="text-center">
              <h2 className="font-headline text-2xl font-bold text-ds-on-surface">
                Universidad
              </h2>
              <p className="mt-2 text-ds-on-surface-variant">
                Recursos de historia para nivel universitario
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
