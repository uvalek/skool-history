"use client";

import { useSyncExternalStore } from "react";
import {
  leerVistos,
  suscribir,
  vistosEnServidor,
  type Vistos,
} from "@/lib/progreso";

/**
 * Lee el progreso de forma que React lo mantenga al dia en todas las piezas
 * que lo muestran: la palomita del recurso, la lista lateral y la barra de la
 * tarjeta se enteran del mismo cambio sin pasarse estado entre ellas.
 *
 * En el servidor devuelve siempre vacio, que es justo lo que se pinta en el
 * HTML inicial; el valor real aparece tras hidratar.
 */
export function useVistos(): Vistos {
  return useSyncExternalStore(suscribir, leerVistos, vistosEnServidor);
}
