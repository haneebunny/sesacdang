"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  // 상세 페이지 (/restaurants/[id]) 또는 리뷰 작성 페이지 (/restaurants/[id]/review, /review/create)인지 체크
  const isDetailPage = /^\/restaurants\/\d+$/.test(pathname);
  const isReviewPage = /^\/restaurants\/\d+\/review$/.test(pathname) || pathname === "/review/create";

  if (isDetailPage || isReviewPage) {
    return null;
  }

  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-16 z-50 bg-white/30 backdrop-blur-2xl border-b border-white/80 shadow-[0px_4px_16px_rgba(0,0,0,0.02)] flex justify-between items-center px-margin_mobile">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-[32px]">eco</span>
        <h1 className="font-display-lg text-display-lg text-primary font-bold">새싹당</h1>
      </div>
      <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 active:scale-95 transition-all">
        <span className="material-symbols-outlined text-on-surface-variant">menu</span>
      </button>
    </header>
  );
}

