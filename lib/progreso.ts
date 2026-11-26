"use client";

/**
 * Progreso del alumno, guardado en su propio navegador.
 *
 * No hay cuentas: el portal es de acceso libre y pedir registro para ver un
 * PDF seria mas friccion de la que vale. Asi que lo que el alumno marca vive
 * en localStorage, en su dispositivo, y nunca viaja a Supabase. Nadie queda
 * identificado y la profesora no puede ver quien vio que.
 *
 * El costo: es por dispositivo y por navegador. Telefono y computadora llevan
 * cuentas distintas, y borrar los datos del sitio lo borra. Para marcar
 * lecciones vistas es un costo aceptable; para calificaciones no lo seria.
 */

export const CLAVE_VISTOS = "progreso-vistos";
export const CLAVE_ULTIMO = "progreso-ultimo";

/** id de recurso -> fecha ISO en que se marco. */
export type Vistos = Record<string, string>;
/** id de unidad -> id del ultimo recurso abierto en ella. */
type Ultimos = Record<string, string>;

const EVENTO = "progreso-cambio";

/* --------------------------------------------------------------------
   Lectura con cache.

   useSyncExternalStore vuelve a pedir la instantanea en cada render y entra
   en bucle infinito si recibe un objeto nuevo cada vez. Por eso se guarda el
   texto crudo y solo se reconstruye el objeto cuando ese texto cambia: dos
   lecturas seguidas sin cambios devuelven exactamente la misma referencia.
   -------------------------------------------------------------------- */
const VACIO: Vistos = {};
let crudoEnCache: string | null = null;
let valorEnCache: Vistos = VACIO;

function leerCrudo(clave: string): string | null {
  try {
    return localStorage.getItem(clave);
  } catch {
    // Navegacion privada o almacenamiento bloqueado.
    return null;
  }
}

function escribir(clave: string, valor: unknown) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    // Sin almacenamiento el progreso dura lo que la pestaña. Preferible a
    // que el boton no haga nada.
  }
  window.dispatchEvent(new Event(EVENTO));
}

export function leerVistos(): Vistos {
  const crudo = leerCrudo(CLAVE_VISTOS);
  if (crudo !== crudoEnCache) {
    crudoEnCache = crudo;
    try {
      valorEnCache = crudo ? (JSON.parse(crudo) as Vistos) : VACIO;
    } catch {
      valorEnCache = VACIO;
    }
  }
  return valorEnCache;
}

/** En el servidor no hay progreso; siempre la misma referencia. */
export function vistosEnServidor(): Vistos {
  return VACIO;
}

export function suscribir(alCambiar: () => void): () => void {
  // El evento propio cubre esta pestaña; "storage" cubre las demas, para que
  // marcar algo en una se refleje en la otra.
  window.addEventListener(EVENTO, alCambiar);
  window.addEventListener("storage", alCambiar);
  return () => {
    window.removeEventListener(EVENTO, alCambiar);
    window.removeEventListener("storage", alCambiar);
  };
}

export function alternarVisto(recursoId: string) {
  const actuales = { ...leerVistos() };
  if (actuales[recursoId]) delete actuales[recursoId];
  else actuales[recursoId] = new Date().toISOString();
  escribir(CLAVE_VISTOS, actuales);
}

/** Cuantos de esos recursos estan vistos. Ignora ids que ya no existen. */
export function contarVistos(vistos: Vistos, recursoIds: string[]): number {
  return recursoIds.reduce((n, id) => (vistos[id] ? n + 1 : n), 0);
}

/* ------------------------- Retomar la lectura ------------------------- */

function leerUltimos(): Ultimos {
  const crudo = leerCrudo(CLAVE_ULTIMO);
  if (!crudo) return {};
  try {
    return JSON.parse(crudo) as Ultimos;
  } catch {
    return {};
  }
}

export function guardarUltimo(unidadId: string, recursoId: string) {
  escribir(CLAVE_ULTIMO, { ...leerUltimos(), [unidadId]: recursoId });
}

export function leerUltimo(unidadId: string): string | null {
  return leerUltimos()[unidadId] ?? null;
}
