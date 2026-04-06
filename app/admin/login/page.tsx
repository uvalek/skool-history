"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Credenciales incorrectas. Inténtalo de nuevo.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ds-surface px-4">
      <Card className="w-full max-w-md border-none bg-ds-surface-container-low shadow-editorial">
        <CardHeader className="items-center text-center">
          <BookOpen className="mb-2 h-10 w-10 text-ds-primary" />
          <CardTitle className="font-headline text-2xl text-ds-on-surface">
            Panel de Administración
          </CardTitle>
          <p className="text-sm text-ds-on-surface-variant">
            Ingresa con tu cuenta para gestionar los recursos.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-ds-on-surface-variant">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="bg-ds-surface-container-highest border-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ds-on-surface-variant">
                Contraseña
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-ds-surface-container-highest border-none"
              />
            </div>
            {error && (
              <p className="text-sm text-ds-error">{error}</p>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-ds-primary text-ds-on-primary hover:bg-ds-primary-dim"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
