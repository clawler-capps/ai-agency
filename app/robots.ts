import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/questionnaire" },
    sitemap: "https://www.sacramentoaiagency.com/sitemap.xml",
  };
}
