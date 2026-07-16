"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNavigation() {
  const pathname = usePathname();

  // 리뷰 작성 페이지 (/restaurants/[id]/review)인지 체크하여 숨김
  const isReviewPage = /^\/restaurants\/\d+\/review$/.test(pathname);
  if (isReviewPage) {
    return null;
  }

  const navItems = [
    {
      name: "홈",
      href: "/",
      icon: "home",
    },
    {
      name: "검색",
      href: "/ai",
      icon: "search",
    },
    {
      name: "리뷰",
      href: "/review/create",
      icon: "rate_review",
    },
    {
      name: "내 페이지",
      href: "/mypage",
      icon: "person",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
      <div className="max-w-md mx-auto h-16 rounded-full bg-white/20 backdrop-blur-3xl border border-white/60 shadow-[0px_8px_32px_rgba(0,0,0,0.04)] flex justify-around items-center px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center active:scale-90 duration-200 ${
                isActive ? "text-secondary" : "text-on-surface-variant hover:opacity-80 transition-opacity"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[26px] ${isActive ? "active-dot" : ""}`}
                style={{
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {item.icon}
              </span>
              <span className="font-label-bold text-label-bold">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
