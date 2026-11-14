import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://study-track-drab.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/verify", "/about", "/contact", "/privacy", "/terms", "/login", "/register"],
        disallow: ["/api/", "/dashboard/", "/timer/", "/calendar/", "/subjects/", "/tasks/", "/notes/", "/analytics/", "/revisions/", "/achievements/", "/profile/", "/settings/"],
      },
      {
        userAgent: "Mediapartners-Google",
        allow: "/",
      },
      {
        userAgent: "AdsBot-Google",
        allow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
