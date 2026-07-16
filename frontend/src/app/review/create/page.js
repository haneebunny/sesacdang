"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRestaurants, addReview } from "../../../data/restaurantsData";

export default function CreateReviewGeneral() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState([]);
  const [selectedId, setSelectedId] = useState(1);
  
  // 입력 폼 상태
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState([]);
  const [comment, setComment] = useState("");
  const [beplpay, setBeplpay] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const data = getRestaurants();
      setRestaurants(data);
      if (data && data.length > 0) {
        setSelectedId(data[0].id);
        setBeplpay(data[0].beplpay);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const currentShop = restaurants.find((r) => r.id === Number(selectedId));

  useEffect(() => {
    if (currentShop) {
      const timer = setTimeout(() => {
        setBeplpay(currentShop.beplpay);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [selectedId, currentShop]);

  if (restaurants.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-body-lg text-on-surface-variant">식당 목록을 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  const AVAILABLE_TAGS = ["혼밥good", "가성비", "빨리나옴", "4인석있음", "친절", "양많음"];

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    addReview(selectedId, {
      rating,
      tags: selectedTags,
      comment,
      beplpay
    });

    alert("리뷰가 성공적으로 등록되었습니다!");
    router.push(`/restaurants/${selectedId}`);
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased pb-32">
      {/* Top App Bar (Fixed) */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-16 z-50 flex items-center justify-between px-margin_mobile bg-surface/85 backdrop-blur-lg border-b border-white/60 shadow-sm">
        <button 
          onClick={() => router.back()}
          aria-label="닫기" 
          className="p-2 -ml-2 active:scale-95 transition-transform cursor-pointer border-none bg-transparent"
        >
          <span className="material-symbols-outlined text-on-surface">close</span>
        </button>
        <h1 className="font-headline-sm text-headline-sm text-on-surface font-bold">리뷰 쓰기</h1>
        <button 
          onClick={handleSubmit}
          className="font-headline-sm text-headline-sm text-primary-container font-bold hover:opacity-80 transition-opacity cursor-pointer border-none bg-transparent"
        >
          등록
        </button>
      </header>

      {/* Main Content Area */}
      <main className="pt-20 px-margin_mobile space-y-6 max-w-md mx-auto">
        {/* Restaurant Selector Card */}
        <section className="glass-card p-4 rounded-2xl flex flex-col gap-2 shadow-sm bg-white/30">
          <label className="font-label-bold text-xs text-on-surface-variant font-semibold px-1">리뷰를 작성할 식당 선택</label>
          <select 
            value={selectedId} 
            onChange={(e) => setSelectedId(Number(e.target.value))}
            className="w-full p-3 rounded-xl bg-white/60 border border-white/80 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30 outline-none"
          >
            {restaurants.map((shop) => (
              <option key={shop.id} value={shop.id}>
                {shop.name} ({shop.category})
              </option>
            ))}
          </select>
        </section>

        {/* Star Rating Section */}
        <section className="flex flex-col items-center justify-center py-4 space-y-3">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((starNum) => (
              <button 
                key={starNum}
                type="button"
                className="star-btn active:scale-110 transition-transform cursor-pointer border-none bg-transparent"
                onClick={() => setRating(starNum)}
              >
                <span 
                  className={`material-symbols-outlined text-4xl ${starNum <= rating ? "text-amber-rating" : "text-outline-variant"}`}
                  style={{ fontVariationSettings: starNum <= rating ? "'FILL' 1" : "'FILL' 0" }}
                >
                  star
                </span>
              </button>
            ))}
          </div>
          <p className="font-headline-sm text-headline-sm text-secondary font-semibold">식사는 어떠셨나요?</p>
        </section>

        {/* Tag Selection Section */}
        <section className="space-y-4">
          <div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">이런 점이 좋았어요</h3>
            <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              자동 추출된 태그예요 — 골라만 주세요
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-4 py-2 rounded-full font-medium border text-xs shadow-sm transition-all cursor-pointer ${
                    isSelected
                      ? "bg-primary-container border-primary-container text-white"
                      : "bg-white/40 border-white/80 text-on-surface-variant hover:bg-white/60"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </section>

        {/* Comment Section */}
        <section className="space-y-2">
          <textarea 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full h-32 glass-card rounded-2xl p-4 font-body-md text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary-container/30 border-white/60 resize-none transition-all" 
            placeholder="한 줄로 남겨주세요 (선택)"
          />
        </section>

        {/* BeplPay Toggle Row */}
        <section className="glass-card p-5 rounded-2xl flex items-center justify-between shadow-sm bg-white/30">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
              <span className="font-headline-sm text-body-lg font-bold">비플페이 결제 됐어요</span>
            </div>
            <p className="font-label-sm text-on-surface-variant text-[11px]">확인일 갱신에 도움이 돼요</p>
          </div>
          
          <button
            type="button"
            onClick={() => setBeplpay(!beplpay)}
            className={`w-12 h-7 rounded-full transition-all duration-300 relative focus:outline-none border-none cursor-pointer flex items-center ${
              beplpay ? "bg-primary-container" : "bg-outline-variant"
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute shadow-md transition-transform duration-300 ${
              beplpay ? "translate-x-6" : "translate-x-1"
            }`}></div>
          </button>
        </section>
      </main>

      {/* Bottom Action Button */}
      <footer className="fixed bottom-0 left-0 right-0 p-margin_mobile bg-gradient-to-t from-surface via-surface/90 to-transparent z-40">
        <div className="max-w-md mx-auto">
          <button 
            onClick={handleSubmit}
            className="w-full h-14 bg-primary text-white rounded-xl font-headline-sm text-headline-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 border-none cursor-pointer"
          >
            리뷰 등록하기
          </button>
        </div>
      </footer>
    </div>
  );
}
