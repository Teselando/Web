import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots { return { rules: [{ userAgent: "*", allow: "/", disallow: ["/solicitud/", "/solicitud/completada/", "/api/"] }], sitemap: "https://teselando.es/sitemap.xml", host: "https://teselando.es" }; }
