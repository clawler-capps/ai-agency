import type { MetadataRoute } from "next";

const SITE = "https://www.sacramentoaiagency.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/pricing", "/contact", "/assessment"].map((path) => ({
    url: `${SITE}${path}`,
  }));
}
