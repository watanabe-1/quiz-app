import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    // サイト全体のクローリングを拒否
    rules: [
      {
        userAgent: "*",
        disallow: "/",
      },
    ],
  };
}
