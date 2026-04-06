import { Navbar } from "@/components/navbar";
import { UnidadDetail } from "@/components/unidad-detail";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Unidad, Recurso } from "@/lib/types/database";

export default async function UnidadSecundariaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: unidad } = await supabase
    .from("unidades")
    .select("*")
    .eq("id", id)
    .eq("categoria", "secundaria")
    .single<Unidad>();

  if (!unidad) notFound();

  const { data: recursos } = await supabase
    .from("recursos")
    .select("*")
    .eq("unidad_id", id)
    .order("orden", { ascending: true })
    .returns<Recurso[]>();

  return (
    <>
      <Navbar />
      <UnidadDetail unidad={unidad} recursos={recursos || []} />
    </>
  );
}
