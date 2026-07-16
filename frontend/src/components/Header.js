"use client";

import React from "react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full h-16 z-50 bg-white/30 backdrop-blur-2xl border-b border-white/80 shadow-[0px_4px_16px_rgba(0,0,0,0.02)] flex justify-between items-center px-margin_mobile">
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
