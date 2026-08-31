/**
 * Resuelve una ruta de `public/` respetando la base con la que se compiló.
 *
 * Escribís `"audio/es-verdad.mp3"` en mockData y esto lo convierte en la URL
 * correcta, sirva el sitio desde `/tys/` o desde la raíz de tu dominio. Una
 * ruta absoluta con barra inicial también funciona: se le saca la barra.
 *
 * Las URLs externas (http, //, data:, blob:) pasan de largo sin tocarse.
 */
export function asset(path) {
  if (!path) return path;
  const value = String(path);
  if (/^[a-z][a-z0-9+.-]*:/i.test(value) || value.startsWith("//")) return value;
  return import.meta.env.BASE_URL + value.replace(/^\/+/, "");
}
