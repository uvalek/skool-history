"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const isSecundaria = pathname?.startsWith("/secundaria");
  const isUniversidad = pathname?.startsWith("/universidad");

  return (
    <header className="sticky top-0 z-50 glass-card border-b ghost-border">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-ds-primary" />
          <span className="font-headline text-lg font-bold text-ds-on-surface tracking-tight">
            Elizaveta
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            href="/secundaria"
            className="rounded-full px-4 py-1.5 text-sm font-semibold transition-all"
            style={
              isSecundaria
                ? { backgroundColor: "#059669", color: "#ffffff" }
                : undefined
            }
          >
            {!isSecundaria && (
              <span className="text-ds-on-surface-variant hover:text-ds-primary transition-colors">
                Secundaria
              </span>
            )}
            {isSecundaria && "Secundaria"}
          </Link>
          <Link
            href="/universidad"
            className="rounded-full px-4 py-1.5 text-sm font-semibold transition-all"
            style={
              isUniversidad
                ? { backgroundColor: "#b45309", color: "#ffffff" }
                : undefined
            }
          >
            {!isUniversidad && (
              <span className="text-ds-on-surface-variant hover:text-ds-primary transition-colors">
                Universidad
              </span>
            )}
            {isUniversidad && "Universidad"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
