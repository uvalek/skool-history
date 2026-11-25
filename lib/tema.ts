export type Tema = "claro" | "oscuro";

/** Clave en localStorage. Solo guarda algo si el usuario eligio. */
export const CLAVE_TEMA = "tema";

/**
 * Se ejecuta antes del primer pintado, dentro de <head>.
 *
 * El servidor siempre manda <html class="dark"> porque oscuro es el valor por
 * defecto; este script solo quita la clase cuando el usuario pidio claro. Al
 * correr antes de que el navegador pinte, nadie ve el destello blanco que
 * saldria si el tema se decidiera ya montado React.
 *
 * El try/catch es necesario: en navegacion privada o con las cookies
 * bloqueadas, leer localStorage lanza excepcion, y sin capturarla el script
 * reventaria antes de que cargue el resto de la pagina.
 */
export const SCRIPT_TEMA = `try{if(localStorage.getItem(${JSON.stringify(
  CLAVE_TEMA
)})==="claro"){document.documentElement.classList.remove("dark")}}catch(e){}`;
