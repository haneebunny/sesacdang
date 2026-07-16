/* eslint-disable @next/next/no-page-custom-font */
import "./globals.css";
import Script from "next/script";
import { Be_Vietnam_Pro } from "next/font/google";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam-pro",
});

export const metadata = {
  title: "새싹당 - Saessak-dang",
  description: "새싹 수강생 전용 · 비플페이 되는 캠퍼스 근처 맛집 지도/리뷰/AI 추천 서비스",
};

export default function RootLayout({ children }) {
  const kakaoMapApiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY || "";

  return (
    <html lang="ko" className={`h-full ${beVietnamPro.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen text-on-surface bg-background flex flex-col antialiased">
        {/* Kakao Map SDK */}
        {kakaoMapApiKey && (
          <Script
            src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapApiKey}&libraries=services,clusterer&autoload=false`}
            strategy="beforeInteractive"
          />
        )}

        <Header />
        
        {children}

        <BottomNavigation />
      </body>
    </html>
  );
}

