"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen } from "lucide-react";
import { CATEGORIAS, CATEGORIAS_ORDEN } from "@/lib/categorias";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 glass-card border-b ghost-border">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <BookOpen className="h-6 w-6 text-ds-primary" />
          <span className="font-headline text-lg font-bold tracking-tight text-ds-on-surface">
            Elizaveta
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {CATEGORIAS_ORDEN.map((id) => {
            const c = CATEGORIAS[id];
            const activa = pathname?.startsWith(`/${id}`);
            return (
              <Link
                key={id}
                href={`/${id}`}
                className="rounded-full px-3 py-1.5 text-sm font-semibold transition-all sm:px-4"
                style={
                  activa
                    ? { backgroundColor: c.accent, color: "#ffffff" }
                    : undefined
                }
              >
                {activa ? (
                  c.label
                ) : (
                  <span className="text-ds-on-surface-variant transition-colors hover:text-ds-primary">
                    {c.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
