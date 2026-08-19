export type Categoria = "secundaria" | "uatx" | "uvhm";

// --- Unidades ---
export type UnidadColor =
  | "purple"
  | "blue"
  | "teal"
  | "green"
  | "yellow"
  | "orange"
  | "rose"
  | "slate";

export interface Unidad {
  id: string;
  created_at: string;
  updated_at: string;
  titulo: string;
  descripcion: string;
  categoria: Categoria;
  orden: number;
  color: UnidadColor;
  /** Banner de la tarjeta: URL externa o archivo subido al bucket "banners". */
  imagen_url: string | null;
}

export interface UnidadInsert {
  titulo: string;
  descripcion?: string;
  categoria: Categoria;
  orden?: number;
  color?: UnidadColor;
  imagen_url?: string | null;
}

export interface UnidadUpdate {
  titulo?: string;
  descripcion?: string;
  categoria?: Categoria;
  orden?: number;
  color?: UnidadColor;
  imagen_url?: string | null;
}

// --- Recursos ---
export interface Recurso {
  id: string;
  created_at: string;
  updated_at: string;
  titulo: string;
  descripcion: string;
  categoria: Categoria;
  urls_video: string[];
  urls_recurso: string[];
  unidad_id: string | null;
  orden: number;
}

export interface RecursoInsert {
  titulo: string;
  descripcion?: string;
  categoria: Categoria;
  urls_video: string[];
  urls_recurso: string[];
  unidad_id: string;
  orden?: number;
}

export interface RecursoUpdate {
  titulo?: string;
  descripcion?: string;
  categoria?: Categoria;
  urls_video?: string[];
  urls_recurso?: string[];
  unidad_id?: string;
  orden?: number;
}

// Unidad con sus recursos incluidos
export interface UnidadConRecursos extends Unidad {
  recursos: Recurso[];
}
