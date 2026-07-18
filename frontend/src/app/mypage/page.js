"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getRestaurants, saveRestaurants } from "../../data/restaurantsData";

export default function MyPage() {
  const [restaurants, setRestaurants] = useState([]);
  
  // 마이페이지 초기 로드 및 갱신
  const loadData = () => {
    setRestaurants(getRestaurants());
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // '3기 새싹 수강생'이 작성한 리뷰 수집
  const myReviews = useMemo(() => {
    const list = [];
    restaurants.forEach((shop) => {
      shop.reviews.forEach((rev) => {
        if (rev.user === "3기 새싹 수강생" || rev.user === "새싹 학생") {
          list.push({
            restaurantId: shop.id,
            restaurantName: shop.name,
            review: rev
          });
        }
      });
    });
    // 정렬: 최신순
    return list.sort((a, b) => b.review.id - a.review.id);
  }, [restaurants]);

  // 리뷰 삭제 처리
  const handleDeleteReview = (restaurantId, reviewId) => {
    if (confirm("정말 이 리뷰를 삭제하시겠습니까?")) {
      const updatedList = restaurants.map((shop) => {
        if (shop.id === restaurantId) {
          const filteredReviews = shop.reviews.filter((r) => r.id !== reviewId);
          // 평균 별점 재계산
          const totalRating = filteredReviews.reduce((sum, r) => sum + r.rating, 0);
          const avgRating = filteredReviews.length > 0 
            ? parseFloat((totalRating / filteredReviews.length).toFixed(1)) 
            : 0;
          return {
            ...shop,
            reviews: filteredReviews,
            rating: avgRating
          };
        }
        return shop;
      });
      saveRestaurants(updatedList);
      setRestaurants(updatedList);
      alert("리뷰가 삭제되었습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-36 text-on-surface">
      <main className="pt-24 px-margin_mobile space-y-6 max-w-md mx-auto w-full flex-1">
        {/* Profile Card */}
        <section className="glass-card rounded-2xl p-6 flex flex-col items-center shadow-sm bg-white/30">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-crystal-border shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAXw3hfgRYITPQSPujJwXwRfwStKgQK81KtwP3-CV89lz0Zw9Zan7yEMIjrExl3n5B1mhu8Nct0VG98Nal5PImFdCjqL1JsGZdn0sQ6W7m1A8xW9Muq_G5p1GItBHJMyJy4s9aGui1Q_E28BCBj-LBcWGVdFd9_oDTF20TCjvTk8XvrYq_u6zi26o8jwY-gx98GQXaibcLEJgmispedVJBXWp6b6zlC-7mFrQOia4LkRjT1TxWr0ZAHLYV-qTzs72j7FSjsYCRuMg" 
                alt="Profile"
              />
            </div>
            <span className="absolute bottom-0 right-0 bg-primary text-white font-label-bold text-[10px] px-2 py-1 rounded-full border-2 border-white font-bold">3기</span>
          </div>
          
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6 font-bold">새싹 학생</h2>
          
          <div className="w-full grid grid-cols-3 gap-2 border-t border-white/20 pt-6">
            <div className="text-center">
              <p className="font-label-bold text-label-bold text-on-surface-variant font-semibold text-[11px]">남긴 리뷰</p>
              <p className="font-headline-sm text-headline-sm text-primary font-bold mt-1">{myReviews.length}</p>
            </div>
            <div className="text-center border-x border-white/20">
              <p className="font-label-bold text-label-bold text-on-surface-variant font-semibold text-[11px]">등록한 식당</p>
              <p className="font-headline-sm text-headline-sm text-primary font-bold mt-1">3</p>
            </div>
            <div className="text-center">
              <p className="font-label-bold text-label-bold text-on-surface-variant font-semibold text-[11px]">도움돼요</p>
              <p className="font-headline-sm text-headline-sm text-primary font-bold mt-1">41</p>
            </div>
          </div>
        </section>

        {/* Taste Profile */}
        <section className="glass-card rounded-2xl p-6 bg-white/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">내 취향</h3>
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">insights</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-secondary-container/40 text-on-secondary-container font-label-bold text-[11px] px-3 py-1.5 rounded-full border border-white/40 font-semibold">#얼큰한</span>
            <span className="bg-secondary-container/40 text-on-secondary-container font-label-bold text-[11px] px-3 py-1.5 rounded-full border border-white/40 font-semibold">#가성비</span>
            <span className="bg-secondary-container/40 text-on-secondary-container font-label-bold text-[11px] px-3 py-1.5 rounded-full border border-white/40 font-semibold">#혼밥</span>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1.5 text-xs">
                <span className="font-label-bold text-on-surface font-semibold">국밥</span>
                <span className="font-label-bold text-primary font-bold">4.2</span>
              </div>
              <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "84%" }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1.5 text-xs">
                <span className="font-label-bold text-on-surface font-semibold">분식</span>
                <span className="font-label-bold text-primary font-bold">3.8</span>
              </div>
              <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary opacity-70 rounded-full" style={{ width: "76%" }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* My Reviews */}
        <section className="space-y-4">
          <h3 className="font-headline-sm text-headline-sm text-on-surface px-1 font-bold">내가 남긴 리뷰</h3>
          
          {myReviews.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center text-on-surface-variant bg-white/30">
              <span className="material-symbols-outlined text-[48px] text-outline mb-2">rate_review</span>
              <p className="font-body-lg font-medium">아직 남긴 리뷰가 없습니다.</p>
              <p className="font-body-md text-xs text-outline mt-1">맛있는 식당을 찾아 첫 리뷰를 작성해보세요!</p>
              <Link 
                href="/"
                className="mt-4 bg-primary text-white px-4 py-2 rounded-lg font-label-bold text-xs font-semibold inline-block"
              >
                맛집 둘러보기
              </Link>
            </div>
          ) : (
            myReviews.map(({ restaurantId, restaurantName, review }) => (
              <div key={review.id} className="glass-card rounded-2xl p-4 flex flex-col gap-3 bg-white/30">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-label-bold text-body-md text-on-surface font-bold">{restaurantName}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((starNum) => (
                        <span 
                          key={starNum}
                          className={`material-symbols-outlined text-[16px] ${starNum <= review.rating ? "text-amber-rating" : "text-outline-variant"}`}
                          style={{ fontVariationSettings: starNum <= review.rating ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          star
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="font-label-sm text-on-surface-variant text-[11px]">{review.date}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {review.tags.map((tag) => (
                    <span key={tag} className="bg-white/60 text-on-surface-variant font-label-sm text-[10px] px-2 py-0.5 rounded border border-white/80 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                
                {review.comment && (
                  <p className="font-body-md text-body-md text-on-surface leading-snug">{review.comment}</p>
                )}
                
                <div className="flex gap-4 pt-2 border-t border-white/20">
                  <button 
                    onClick={() => router.push(`/restaurants/${restaurantId}/review`)}
                    className="font-label-bold text-label-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer border-none bg-transparent text-xs"
                  >
                    수정
                  </button>
                  <button 
                    onClick={() => handleDeleteReview(restaurantId, review.id)}
                    className="font-label-bold text-label-sm text-on-surface-variant hover:text-error transition-colors cursor-pointer border-none bg-transparent text-xs"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </main>


    </div>
  );
}
