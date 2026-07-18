"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { getRestaurants } from "../../data/restaurantsData";

export default function AISearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const restaurants = getRestaurants();

  // 퀵 추천 태그 리스트
  const SUGGESTIONS = ["혼밥 국밥", "4명 가성비", "빨리 나오는 곳", "따뜻한 국물"];

  // 검색 로직 구현
  const filteredResults = useMemo(() => {
    if (!searchTerm.trim()) {
      // 검색어가 없을 때는 새싹 추천 식당이나 별점 높은 식당을 기본 노출
      return restaurants
        .filter((shop) => shop.isSproutRecommend || shop.rating >= 4.0)
        .sort((a, b) => b.rating - a.rating);
    }

    const term = searchTerm.toLowerCase();

    return restaurants.filter((shop) => {
      // 1. 이름 및 카테고리 검색
      const matchName = shop.name.toLowerCase().includes(term);
      const matchCategory = shop.category.toLowerCase().includes(term);
      
      // 2. 키워드 매핑 검색
      let matchKeyword = false;
      
      if (term.includes("국밥") || term.includes("국물")) {
        matchKeyword = shop.category.includes("국밥") || shop.name.includes("국밥");
      }
      if (term.includes("혼밥")) {
        matchKeyword = shop.reviews.some((r) => r.tags.includes("혼밥good"));
      }
      if (term.includes("가성비")) {
        matchKeyword = shop.priceLevel === "under_10k" || shop.reviews.some((r) => r.tags.includes("가성비"));
      }
      if (term.includes("4명") || term.includes("4인석") || term.includes("인원")) {
        matchKeyword = shop.seatClass === "mid" || shop.seatClass === "large";
      }
      if (term.includes("빨리") || term.includes("속도")) {
        matchKeyword = shop.reviews.some((r) => r.tags.includes("빨리나옴"));
      }

      return matchName || matchCategory || matchKeyword;
    });
  }, [searchTerm, restaurants]);

  return (
    <main className="pt-24 px-margin_mobile space-y-6 pb-32 max-w-md mx-auto w-full flex-1">
      {/* Background Decorative Element (Subtle blur) */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-10 w-64 h-64 bg-primary-fixed/20 opacity-20 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-1/4 -right-10 w-72 h-72 bg-secondary-fixed-dim/20 opacity-20 blur-[100px] rounded-full"></div>
      </div>

      {/* AI Search Bar */}
      <section>
        <div className="glass-card rounded-2xl p-4 flex items-center gap-3 shadow-md border-white/80">
          <span className="text-xl">✨</span>
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none focus:ring-0 w-full font-body-lg text-body-lg text-on-surface placeholder:text-outline-variant p-0 outline-none" 
            placeholder="예: 4명 앉는 가성비 국밥집"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="text-outline hover:text-on-surface-variant cursor-pointer border-none bg-transparent"
            >
              <span className="material-symbols-outlined text-xl">cancel</span>
            </button>
          )}
        </div>
      </section>

      {/* Quick Suggestions */}
      <section className="flex overflow-x-auto no-scrollbar gap-2 -mx-margin_mobile px-margin_mobile py-1">
        {SUGGESTIONS.map((tag) => (
          <button 
            key={tag}
            onClick={() => setSearchTerm(tag)}
            className={`glass-card px-4 py-2 rounded-full whitespace-nowrap font-label-bold text-xs text-secondary border-white/60 active:scale-95 transition-transform cursor-pointer ${
              searchTerm === tag ? "bg-secondary text-white border-secondary" : "bg-white/40"
            }`}
          >
            {tag}
          </button>
        ))}
      </section>

      {/* AI Result Cards */}
      <section className="space-y-6">
        <div className="flex justify-between items-baseline px-1">
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            {searchTerm ? `"${searchTerm}" AI 추천 결과` : "AI 추천 맛집"}
          </h3>
          <span className="text-xs text-outline font-medium">후보 {filteredResults.length}곳</span>
        </div>

        {filteredResults.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] text-outline mb-2">search_off</span>
            <p className="font-body-lg font-medium">검색어와 연관된 AI 추천 결과가 없습니다.</p>
            <p className="font-body-md text-xs text-outline mt-1">다른 키워드로 검색하거나 조건 완화를 시도해보세요.</p>
            <button 
              onClick={() => setSearchTerm("")}
              className="mt-4 bg-primary text-white px-4 py-2 rounded-lg font-label-bold text-xs font-semibold"
            >
              추천 검색어 초기화
            </button>
          </div>
        ) : (
          filteredResults.map((shop, idx) => {
            const seatLabel = shop.seatClass === "small" ? "1~2인석" : shop.seatClass === "mid" ? "👥 4인석" : "👥 단체 가능";
            
            return (
              <div 
                key={shop.id}
                className="glass-card rounded-2xl p-5 space-y-4 shadow-lg border-white/80 relative overflow-hidden group hover:scale-[1.01] transition-transform duration-200"
              >
                {/* 순위 뱃지 */}
                {idx === 0 && (
                  <div className="absolute top-0 right-0 bg-primary-container text-white px-3 py-1 rounded-bl-xl font-label-bold text-[10px] font-bold">
                    새싹 추천 1위
                  </div>
                )}
                {idx > 0 && idx < 3 && (
                  <div className="absolute top-0 right-0 bg-secondary/80 text-white px-3 py-1 rounded-bl-xl font-label-bold text-[10px] font-semibold">
                    새싹 추천 {idx + 1}위
                  </div>
                )}

                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">{shop.name}</h2>
                    <div className="inline-flex items-center px-2 py-0.5 bg-secondary-fixed-dim/40 rounded-lg">
                      <span className="text-[10px] mr-1">✨</span>
                      <span className="font-label-sm text-[11px] text-on-secondary-fixed-variant font-bold">AI 추정</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-0.5">
                      <span className="material-symbols-outlined text-amber-rating text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="font-display-lg text-display-lg text-on-surface font-bold">{shop.aiEstimate?.rating || shop.rating}</span>
                    </div>
                    <p className="text-[10px] text-outline italic">*(AI 추정)*</p>
                  </div>
                </div>

                {/* AI 추천 사유 박스 */}
                <div className="bg-primary/5 p-4 rounded-xl border border-primary-container/20">
                  <p className="font-body-md text-on-surface-variant italic leading-relaxed text-sm">
                    &quot;{shop.aiEstimate?.reason || `${shop.name}은(는) 수강생들이 자주 찾는 ${shop.category} 맛집으로 가성비와 음식의 퀄리티가 우수합니다.`}&quot;
                  </p>
                </div>

                {/* 메타 뱃지 리스트 */}
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 glass-card bg-white/40 border-white/20 px-2.5 py-1 rounded-full text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-status-available"></div>
                    <span className="font-label-sm text-on-surface-variant font-semibold">도보 {shop.walkTime}분</span>
                  </div>
                  <div className="flex items-center gap-1.5 glass-card bg-white/40 border-white/20 px-2.5 py-1 rounded-full text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-status-available"></div>
                    <span className="font-label-sm text-on-surface-variant font-semibold">{seatLabel}</span>
                  </div>
                  {shop.beplpay && (
                    <div className="flex items-center gap-1.5 glass-card bg-white/40 border-white/20 px-2.5 py-1 rounded-full text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-status-available"></div>
                      <span className="font-label-sm text-on-surface-variant font-semibold">비플페이 O</span>
                    </div>
                  )}
                </div>

                <Link 
                  href={`/restaurants/${shop.id}`}
                  className="w-full py-3.5 bg-secondary text-white font-label-bold rounded-xl active:scale-[0.98] transition-all shadow-md block text-center font-bold text-xs"
                >
                  상세 보기
                </Link>
              </div>
            );
          })
        )}
      </section>
    </main>
  );
}
