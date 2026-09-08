import type { MetadataRoute } from "next";
export const dynamic = "force-static";
const paths = ["", "/como-funciona/", "/precios/", "/garantia/", "/sobre-teselando/", "/contacto/", "/recursos/", "/solicitud/", "/solicitud/completada/", "/legal/aviso-legal/", "/legal/privacidad/", "/legal/cookies/"];
export default function sitemap(): MetadataRoute.Sitemap { return paths.map((path) => ({ url: `https://teselando.es${path}`, changeFrequency: path === "" ? "weekly" : "monthly", priority: path === "" ? 1 : .7 })); }
