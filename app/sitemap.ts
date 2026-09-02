import type { MetadataRoute } from "next";
const base = "https://teselando.es";
export default function sitemap(): MetadataRoute.Sitemap { return ["/", "/como-funciona/", "/precios/", "/sobre-teselando/", "/contacto/"].map((path) => ({ url: `${base}${path}` })); }
