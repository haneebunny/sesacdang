"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import KakaoMap from "../components/KakaoMap";

// Mock 식당 데이터
const MOCK_RESTAURANTS = [
  {
    id: 1,
    name: "건국관 식당",
    category: "한식/학식",
    priceLevel: "under_10k",
    rating: 4.1,
    walkTime: 5,
    totalTime: 12,
    beplpay: true,
    beplpayCheckedAt: "2026-07-16",
    seatClass: "mid",
    signal: "green", // 🟢 여유
    isSproutRecommend: true,
    lat: 37.5250,
    lng: 126.8620,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCz5htHWrxf-gx62ujlgspkcWC2zD8PMzV8YDqDUbhFEkcmAixmdL8-eNVurqB6Q1DbZdUX2RtbZpfHbzqnhMxKaYpCX9fkzVtDIV7TURrLGB7cxVdEV7mbHj_c4QVroxQIwSPY-hx_qRlEGD2jJCuijfeqTeG6ymkaOr-iovBSMVdsIwFKDlmt6UvSHN1OC_hstzDuKliKB6sZfh_MMtnl_2TCqTbeRnC_Fj6RYOVGDFMXh9Kskwu4ssS0WO5NGcnk4aopX1EfC1I",
  },
  {
    id: 2,
    name: "샐러드 팩토리",
    category: "샐러드/카페",
    priceLevel: "over_10k",
    rating: 4.5,
    walkTime: 8,
    totalTime: 18,
    beplpay: true,
    beplpayCheckedAt: "2026-07-10",
    seatClass: "mid",
    signal: "green", // 🟢 여유
    isSproutRecommend: false,
    lat: 37.5270,
    lng: 126.8660,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvNLFccnrRi0PWROq-uRRTGyelDvw9voMOottq0EA51RKNeZEzvjl2ZIgUy0hfzI8qLsHBrUjs0wSG-Ck3QchH7owzHXj3DoPOxj5FqVzesZGqdotmPg2XvmEKqSRFkVWVtP06IVcHxtNnjWNAAlZCk4oEZZjatG4-QKVnbRhEWZ30flzpL5EgeLNLXHWY3xV1kA8BQ9audldq6JTr0WDCAwno8VX7P5SXMR8YIPcIapFCDKhJ08iEBR-rEC_1kcHdMXb5dR29ikI",
  },
  {
    id: 3,
    name: "국수나무",
    category: "일식/면요리",
    priceLevel: "under_10k",
    rating: 3.9,
    walkTime: 12,
    totalTime: 25,
    beplpay: false,
    beplpayCheckedAt: "2026-06-01",
    seatClass: "small",
    signal: "yellow", // 🟡 보통
    isSproutRecommend: false,
    lat: 37.5290,
    lng: 126.8630,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqlkEEMcNG-vNMYT_5YFoO2xpBSX4HTaBNfSpeZNvqpP3PkdONXZO82G3rnv-GgsAu7WpBLGM1n06ct6iuUp3064NsYCUGeYguuf_TElBmtOX5mYKIqGs9tB7y_oX8TBNZmJELfV7KSSZdQLzmMrALpad5vfaYt2t6dYHuDDZCzrqQUrK6vFEf-W7pbUGf8cmCY-NOG-yKj4vQO7FTzWwYoSbPDfdUf-ExBQAf9CaB5yS_1LgRNNWspObpz03Tj0mZCDDDe0UfDCk",
  },
];

export default function Home() {
  // 필터 상태
  const [beplpayFilter, setBeplpayFilter] = useState(true);
  const [safezoneFilter, setSafezoneFilter] = useState(false);
  const [sortBy, setSortBy] = useState("distance"); // "distance" | "rating"
  const [categoryFilter, setCategoryFilter] = useState(null); // null = 전체
  const [priceFilter, setPriceFilter] = useState(null); // null | "under_10k" | "over_10k"
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // 카테고리 목록 동적 추출
  const categories = useMemo(() => {
    const set = new Set(MOCK_RESTAURANTS.map((s) => s.category));
    return ["전체", ...Array.from(set)];
  }, []);

  // 카테고리 드롭다운 바깥 클릭 시 닫기
  const categoryRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 상황 입력 상태 (⏱ 잔여 시간, 👥 인원, 💰 예산)
  const [timeLeft, setTimeLeft] = useState(40);
  const [peopleCount, setPeopleCount] = useState(1);
  const [budget, setBudget] = useState(8000);

  // 상황 입력 수정 모달 열림 여부
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTime, setModalTime] = useState(timeLeft);
  const [modalPeople, setModalPeople] = useState(peopleCount);
  const [modalBudget, setModalBudget] = useState(budget);

  // 필터링 및 정렬 적용된 식당 리스트 계산
  const filteredRestaurants = useMemo(() => {
    return MOCK_RESTAURANTS.filter((shop) => {
      // 1. 비플페이 필터 적용
      if (beplpayFilter && !shop.beplpay) return false;
      
      // 2. 세이프존 필터 적용 (초록 신호등🟢만 통과)
      if (safezoneFilter && shop.signal !== "green") return false;

      // 3. 상황 입력 필터 적용 (예산 초과 필터링)
      const priceTextToNumber = { "under_10k": 8000, "over_10k": 13000 };
      const estimatedPrice = priceTextToNumber[shop.priceLevel] || 8000;
      if (estimatedPrice > budget) return false;

      // 4. 카테고리 필터 적용
      if (categoryFilter && shop.category !== categoryFilter) return false;

      // 5. 가격 필터 적용
      if (priceFilter && shop.priceLevel !== priceFilter) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === "distance") {
        return a.walkTime - b.walkTime;
      } else {
        return b.rating - a.rating;
      }
    });
  }, [beplpayFilter, safezoneFilter, budget, sortBy, categoryFilter, priceFilter]);

  // 상황 저장 핸들러
  const handleSaveSituation = () => {
    setTimeLeft(modalTime);
    setPeopleCount(modalPeople);
    setBudget(modalBudget);
    setIsModalOpen(false);
  };

  // 비플페이 확인 기간 계산 함수
  const isBeplpayExpired = (checkedAtStr) => {
    const checkedDate = new Date(checkedAtStr);
    const currentDate = new Date("2026-07-16"); // 현재 시스템 임시 일시 기준
    const diffTime = Math.abs(currentDate - checkedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 30;
  };

  return (
    <main className="pt-24 px-margin_mobile space-y-6 pb-32 max-w-md mx-auto w-full flex-1">
      {/* Situation Input Bar */}
      <section 
        className="glass-card rounded-xl p-4 cursor-pointer hover:bg-white/50 active:scale-98 transition-all"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h2 className="font-headline-sm text-headline-sm text-secondary font-bold">지금 상황</h2>
            <span className="font-label-sm text-label-sm text-outline flex items-center gap-0.5">
              상황에 맞는 곳만 골라드려요 <span className="material-symbols-outlined text-xs">edit</span>
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <div className="flex-none bg-secondary-fixed/30 border border-white/60 px-3 py-2 rounded-lg flex items-center gap-1">
              <span className="text-sm">⏱</span>
              <span className="font-label-bold text-label-bold text-secondary font-semibold">{timeLeft}분 남음</span>
            </div>
            <div className="flex-none bg-secondary-fixed/30 border border-white/60 px-3 py-2 rounded-lg flex items-center gap-1">
              <span className="text-sm">👥</span>
              <span className="font-label-bold text-label-bold text-secondary font-semibold">{peopleCount}명</span>
            </div>
            <div className="flex-none bg-secondary-fixed/30 border border-white/60 px-3 py-2 rounded-lg flex items-center gap-1">
              <span className="text-sm">💰</span>
              <span className="font-label-bold text-label-bold text-secondary font-semibold">{budget.toLocaleString()}원</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Chips */}
      <section className="flex gap-2 py-1 -mx-margin_mobile px-margin_mobile overflow-visible">
        <button 
          onClick={() => setBeplpayFilter(!beplpayFilter)}
          className={`flex-none px-4 py-2 rounded-full font-label-bold text-label-bold flex items-center gap-1 cursor-pointer transition-all ${
            beplpayFilter 
              ? "bg-primary-container text-white shadow-md shadow-primary-container/20" 
              : "bg-white/40 backdrop-blur-xl border border-white/80 text-secondary"
          }`}
        >
          비플페이 {beplpayFilter ? "ON" : "OFF"}
        </button>
        <button 
          onClick={() => setSafezoneFilter(!safezoneFilter)}
          className={`flex-none px-4 py-2 rounded-full font-label-bold text-label-bold cursor-pointer transition-all ${
            safezoneFilter 
              ? "bg-primary-container text-white shadow-md shadow-primary-container/20" 
              : "bg-white/40 backdrop-blur-xl border border-white/80 text-secondary"
          }`}
        >
          세이프존 {safezoneFilter ? "ON" : "OFF"}
        </button>

        {/* 카테고리 드롭다운 */}
        <div ref={categoryRef} className="relative flex-none">
          <button
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className={`px-4 py-2 rounded-full font-label-bold text-label-bold flex items-center gap-1 cursor-pointer transition-all ${
              categoryFilter || priceFilter || sortBy !== "distance"
                ? "bg-primary-container text-white shadow-md shadow-primary-container/20"
                : "bg-white/40 backdrop-blur-xl border border-white/80 text-secondary"
            }`}
          >
            {categoryFilter || "카테고리"}
            {(priceFilter || sortBy !== "distance") && (
              <span className="text-[10px] bg-white/20 px-1 py-0.5 rounded ml-1 flex items-center gap-0.5">
                {priceFilter ? (priceFilter === "under_10k" ? "💰≤1만" : "💰>1만") : ""} {sortBy === "rating" ? "⭐" : ""}
              </span>
            )}
            <span className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${
              isCategoryOpen ? "rotate-180" : ""
            }`}>expand_more</span>
          </button>
          {isCategoryOpen && (
            <div className="absolute top-full left-0 mt-2 z-50 bg-white/90 backdrop-blur-xl border border-white/80 rounded-2xl shadow-xl overflow-hidden min-w-[170px]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategoryFilter(cat === "전체" ? null : cat);
                    setIsCategoryOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 font-label-bold text-label-bold transition-colors hover:bg-primary/10 ${
                    (cat === "전체" && !categoryFilter) || cat === categoryFilter
                      ? "text-primary font-bold bg-primary/5"
                      : "text-on-surface"
                  }`}
                >
                  {cat === "전체" ? "전체 보기" : cat}
                  {((cat === "전체" && !categoryFilter) || cat === categoryFilter) && (
                    <span className="material-symbols-outlined text-primary text-[14px] float-right">check</span>
                  )}
                </button>
              ))}
              
              <div className="border-t border-on-surface/10 my-1"></div>
              <div className="px-4 py-1.5 text-[11px] font-label-bold text-outline-variant uppercase tracking-wider">
                정렬 및 필터
              </div>
              
              {/* 정렬 기준 토글 버튼 */}
              <button
                onClick={() => setSortBy(sortBy === "distance" ? "rating" : "distance")}
                className="w-full text-left px-4 py-2.5 font-label-bold text-label-bold transition-colors hover:bg-primary/10 text-on-surface flex justify-between items-center"
              >
                <span>{sortBy === "distance" ? "거리순 정렬" : "별점순 정렬"}</span>
                <span className="material-symbols-outlined text-[16px] text-outline">swap_vert</span>
              </button>
              
              {/* 가격 필터 토글 버튼 */}
              <button
                onClick={() => {
                  const levels = [null, "under_10k", "over_10k"];
                  const idx = levels.indexOf(priceFilter);
                  setPriceFilter(levels[(idx + 1) % levels.length]);
                }}
                className="w-full text-left px-4 py-2.5 font-label-bold text-label-bold transition-colors hover:bg-primary/10 text-on-surface flex justify-between items-center"
              >
                <span>가격: {priceFilter ? (priceFilter === "under_10k" ? "만원 이하" : "만원 초과") : "전체"}</span>
                {priceFilter && (
                  <span className="text-[11px] bg-secondary-fixed/30 text-secondary px-1.5 py-0.5 rounded font-bold">
                    {priceFilter === "under_10k" ? "≤1만" : ">1만"}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Map Card */}
      <section className="glass-card rounded-2xl p-1 h-56 relative overflow-hidden group">
        <KakaoMap restaurants={filteredRestaurants} />
      </section>

      {/* List Heading */}
      <section className="flex items-end pt-2">
        <div className="flex items-baseline gap-2">
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">지금 갈 수 있는 곳</h3>
          <span className="font-headline-sm text-primary font-bold">{filteredRestaurants.length}곳</span>
        </div>
      </section>

      {/* Restaurant List */}
      <section className="space-y-6">
        {filteredRestaurants.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] text-outline mb-2">search_off</span>
            <p className="font-body-lg font-medium">조건에 맞는 맛집이 없습니다.</p>
            <p className="font-body-md text-xs text-outline mt-1">상황 설정이나 필터를 변경해보세요.</p>
            <button 
              onClick={() => { setBeplpayFilter(false); setSafezoneFilter(false); setBudget(15000); }} 
              className="mt-4 bg-primary text-white px-4 py-2 rounded-lg font-label-bold text-label-bold"
            >
              필터 초기화
            </button>
          </div>
        ) : (
          filteredRestaurants.map((shop) => {
            const isExpired = isBeplpayExpired(shop.beplpayCheckedAt);
            const seatLabel = shop.seatClass === "small" ? "소(1~2인)" : shop.seatClass === "mid" ? "중(3~4인)" : "대(5인+)";

            return (
              <div 
                key={shop.id} 
                className={`glass-card rounded-2xl overflow-hidden relative transition-all duration-300 hover:shadow-md ${
                  shop.isSproutRecommend ? "border-2 border-primary/20" : ""
                }`}
              >
                {/* 뱃지 영역 */}
                {shop.isSproutRecommend && (
                  <div className="absolute top-3 left-3 z-10 bg-primary-container text-white px-3 py-1 rounded-full font-label-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm font-semibold">
                    <span className="material-symbols-outlined text-[12px] font-bold">spark</span> 새싹 추천
                  </div>
                )}
                
                <div className={`absolute top-3 right-3 z-10 text-white px-2 py-1 rounded-md font-label-bold text-[11px] flex items-center gap-1 shadow-sm ${
                  shop.signal === "green" ? "bg-status-available" : shop.signal === "yellow" ? "bg-status-tight" : "bg-status-impossible"
                }`}>
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  {shop.signal === "green" ? "여유" : shop.signal === "yellow" ? "보통" : "포기"}
                </div>

                {/* 이미지 */}
                <div className="h-40 w-full overflow-hidden bg-surface-container relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                    src={shop.imageUrl} 
                    alt={shop.name}
                  />
                </div>

                {/* 본문 정보 */}
                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">{shop.name}</h4>
                      <p className="font-label-bold text-label-bold text-outline-variant mt-0.5">
                        {shop.priceLevel === "under_10k" ? "만원 이하" : "만원 초과"} • {shop.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                      <span className="material-symbols-outlined text-status-tight text-[18px] font-bold">star</span>
                      <span className="font-label-bold text-label-bold text-status-tight font-bold">{shop.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                    <span className="material-symbols-outlined text-[18px]">directions_walk</span>
                    <p className="font-body-md">
                      <span className="font-bold text-on-surface">도보 {shop.walkTime}분</span> / 총 {shop.totalTime}분 소요
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {shop.beplpay && (
                      <span className="bg-secondary-fixed/50 px-2 py-1 rounded-md font-label-sm text-label-sm text-secondary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">payments</span> 
                        비플페이 O {isExpired ? "(최근 확인 안 됨)" : `(${shop.beplpayCheckedAt.slice(2)} 확인)`}
                      </span>
                    )}
                    <span className="bg-surface-variant px-2 py-1 rounded-md font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">group</span> 👥{seatLabel}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>


      {/* Situation Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="glass-card w-full max-w-sm rounded-2xl p-6 relative z-10 space-y-4 shadow-2xl border border-white/80">
            <h3 className="font-headline-sm text-headline-sm text-secondary font-bold">상황 변경하기</h3>
            
            <div className="space-y-3 pt-2">
              {/* ⏱ 잔여 시간 */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-bold text-on-surface">⏱ 잔여 시간 (분)</label>
                <div className="flex gap-2 items-center">
                  <input 
                    type="range" 
                    min="15" 
                    max="90" 
                    step="5"
                    value={modalTime} 
                    onChange={(e) => setModalTime(Number(e.target.value))}
                    className="flex-1 accent-primary"
                  />
                  <span className="font-label-bold w-12 text-right">{modalTime}분</span>
                </div>
              </div>

              {/* 👥 인원 */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-bold text-on-surface">👥 인원 (명)</label>
                <div className="flex gap-2">
                  {[1, 2, 4, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setModalPeople(num)}
                      className={`flex-1 py-2 rounded-lg font-label-bold border transition-all ${
                        modalPeople === num 
                          ? "bg-secondary text-white border-secondary" 
                          : "bg-white/40 border-white/80 text-secondary"
                      }`}
                    >
                      {num === 6 ? "5인+" : `${num}명`}
                    </button>
                  ))}
                </div>
              </div>

              {/* 💰 예산 */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-bold text-on-surface">💰 예산 (원)</label>
                <div className="flex gap-2">
                  {[6000, 8000, 10000, 15000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setModalBudget(val)}
                      className={`flex-1 py-2 rounded-lg font-label-bold border transition-all text-xs ${
                        modalBudget === val 
                          ? "bg-secondary text-white border-secondary" 
                          : "bg-white/40 border-white/80 text-secondary"
                      }`}
                    >
                      {val.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 rounded-xl font-label-bold border border-white/80 text-secondary bg-white/40 hover:bg-white/80 active:scale-95 transition-all"
              >
                취소
              </button>
              <button 
                onClick={handleSaveSituation}
                className="flex-1 py-3 rounded-xl font-label-bold bg-primary text-white hover:bg-primary/90 active:scale-95 transition-all"
              >
                적용하기
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

