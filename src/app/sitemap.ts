// 색인 대상은 정적 두 화면뿐 — /report는 해시에 결과가 있어 색인할 것이 없다
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://scored.kr/", priority: 1 },
    { url: "https://scored.kr/how", priority: 0.5 },
  ];
}
