import type { MetadataRoute } from "next";
const paths = ["", "/como-funciona/", "/precios/", "/sobre-teselando/", "/contacto/", "/recursos/", "/legal/aviso-legal/", "/legal/privacidad/", "/legal/cookies/"];
export default function sitemap(): MetadataRoute.Sitemap { return paths.map((path) => ({ url: `https://teselando.es${path}`, changeFrequency: path === "" ? "weekly" : "monthly", priority: path === "" ? 1 : .7 })); }
