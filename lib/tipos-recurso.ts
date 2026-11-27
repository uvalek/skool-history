import { BookOpen, GraduationCap, Library, PenLine } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { TipoRecurso } from "@/lib/types/database";

/**
 * Catalogo de tipos de recurso: fuente unica de etiquetas, iconos y de la
 * regla que decide que cuenta como avance.
 *
 * Nace de un problema real del contenido: la profesora no tenia donde decir
 * "esto es bibliografia", asi que creaba unidades aparte llamadas
 * "Referencias Unidad N". El alumno veia esas unidades al mismo nivel que las
 * de trabajo y el progreso le pedia marcar cada referencia como si fuera una
 * leccion.
 */
export interface TipoRecursoConfig {
  id: TipoRecurso;
  /** Nombre de un recurso suelto: "Teoria". */
  label: string;
  /** Encabezado de su grupo en la lista de la unidad: "Actividades". */
  plural: string;
  /** Ayuda en el formulario del panel. */
  descripcion: string;
  icono: LucideIcon;
  /**
   * Si entra en la barra de progreso. Las referencias no: son material de
   * consulta, no algo que se termine, y mezclarlas haria el porcentaje
   * inutil en unidades con mucha bibliografia.
   */
  cuenta: boolean;
}

export const TIPOS_RECURSO: Record<TipoRecurso, TipoRecursoConfig> = {
  teoria: {
    id: "teoria",
    label: "Teoría",
    plural: "Teoría",
    descripcion: "Clase, lectura o explicación que el alumno debe estudiar",
    icono: BookOpen,
    cuenta: true,
  },
  actividad: {
    id: "actividad",
    label: "Actividad",
    plural: "Actividades",
    descripcion: "Tarea o ejercicio que el alumno tiene que entregar o hacer",
    icono: PenLine,
    cuenta: true,
  },
  evaluacion: {
    id: "evaluacion",
    label: "Evaluación",
    plural: "Evaluaciones",
    descripcion: "Examen, rúbrica o cualquier cosa con la que se califica",
    icono: GraduationCap,
    cuenta: true,
  },
  referencia: {
    id: "referencia",
    label: "Referencia",
    plural: "Referencias",
    descripcion: "Bibliografía y material de consulta; no cuenta como avance",
    icono: Library,
    cuenta: false,
  },
};

/** Orden en que se muestran los grupos y las opciones del formulario. */
export const TIPOS_RECURSO_ORDEN: TipoRecurso[] = [
  "teoria",
  "actividad",
  "evaluacion",
  "referencia",
];

/** El mismo default que la columna en la base de datos. */
export const TIPO_POR_DEFECTO: TipoRecurso = "teoria";

/**
 * Normaliza lo que venga de la base. La columna tiene CHECK y default, pero
 * una fila leida con un select parcial o una categoria nueva sin desplegar
 * dejarian el valor vacio, y entonces conviene caer en el default a que
 * revienten los accesos al catalogo.
 */
export function tipoRecurso(valor: string | null | undefined): TipoRecursoConfig {
  return TIPOS_RECURSO[
    valor && valor in TIPOS_RECURSO ? (valor as TipoRecurso) : TIPO_POR_DEFECTO
  ];
}

/** Los ids que entran en la barra de progreso de una unidad. */
export function idsQueCuentan(
  recursos: { id: string; tipo: string | null }[]
): string[] {
  return recursos.filter((r) => tipoRecurso(r.tipo).cuenta).map((r) => r.id);
}
