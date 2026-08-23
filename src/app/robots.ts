// 위생 항목 — 성적표는 해시에만 있어 색인 대상이 아니지만, 크롤 예산을 랜딩·/how로 몰아준다
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://scored.kr/sitemap.xml",
  };
}
