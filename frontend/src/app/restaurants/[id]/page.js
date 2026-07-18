"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getRestaurantById } from "../../../data/restaurantsData";

export default function RestaurantDetail({ params }) {
  const router = useRouter();
  const [shop, setShop] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showRouteModal, setShowRouteModal] = useState(false);

  // React.use(params) 호환 처리 (Next.js 15+ 대응)
  const unwrappedParams = React.use ? React.use(params) : params;
  const id = unwrappedParams.id;

  useEffect(() => {
    if (id) {
      const timer = setTimeout(() => {
        const data = getRestaurantById(id);
        setShop(data);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [id]);

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-body-lg text-on-surface-variant">식당 정보를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  // 신호등 판정 스타일 설정
  const signalConfigs = {
    green: { bg: "bg-status-available", text: "text-text-available", border: "border-status-available/20", label: "가능", desc: "여유 있어요" },
    yellow: { bg: "bg-status-tight", text: "text-text-tight", border: "border-status-tight/20", label: "혼잡", desc: "보통이에요" },
    red: { bg: "bg-status-impossible", text: "text-text-impossible", border: "border-status-impossible/20", label: "불가", desc: "혼잡/포기" },
  };
  const signal = signalConfigs[shop.signal] || signalConfigs.green;

  // 좌석 표시 라벨 설정
  const seatLabels = {
    small: { title: "소규모", desc: "1~2인석 위주" },
    mid: { title: "중규모", desc: "4인석 있음" },
    large: { title: "대규모", desc: "단체 가능" }
  };
  const seatInfo = seatLabels[shop.seatClass] || seatLabels.mid;

  // 왕복 시간 계산: 도보 시간 * 2 + 음식 조리 시간 + 식사 시간 (여기서는 기본 22분으로 가정하거나 shop.totalTime을 보정)
  // 도보 5분인 경우 왕복 10분 + 식사/대기 22분 = 총 32분
  const totalRoundTime = shop.walkTime * 2 + (shop.totalTime - shop.walkTime);

  return (
    <div className="min-h-screen bg-background pb-36 text-on-surface">
      {/* Hero Section */}
      <section className="relative w-full h-56">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            className="w-full h-full object-cover" 
            src={shop.imageUrl} 
            alt={shop.name}
          />
        </div>
        
        {/* Controls Overlay */}
        <div className="absolute top-4 left-margin_mobile z-10">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/40 shadow-md active:scale-90 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-white">arrow_back</span>
          </button>
        </div>
        
        <div className="absolute top-4 right-margin_mobile z-10">
          <button 
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/40 shadow-md active:scale-90 transition-transform cursor-pointer"
          >
            <span className={`material-symbols-outlined ${isBookmarked ? "text-amber-rating" : "text-white"}`} style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0" }}>
              bookmark
            </span>
          </button>
        </div>

        {/* Status Signal Badge */}
        <div className="absolute bottom-4 left-margin_mobile z-10">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/40 backdrop-blur-md border border-white/60">
            <span className={`w-2 h-2 rounded-full ${signal.bg} animate-pulse`}></span>
            <span className={`font-label-bold text-label-bold ${signal.text}`}>{signal.label}</span>
          </div>
        </div>
      </section>

      {/* Main Title & Content */}
      <main className="relative -mt-6 z-20 px-margin_mobile space-y-6 max-w-md mx-auto">
        {/* Title Glass Card */}
        <div className="glass-card rounded-2xl p-lg shadow-sm bg-white/30">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface font-bold">{shop.name}</h2>
                <p className="text-on-surface-variant text-body-md mt-0.5">
                  {shop.category} · {shop.priceLevel === "under_10k" ? "만원 이하" : "만원 초과"}
                </p>
              </div>
              
              <div className="flex flex-col items-end gap-1">
                {shop.beplpay ? (
                  <div className="flex items-center gap-1 bg-primary px-3 py-1 rounded-full text-on-primary shadow-sm">
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span className="font-label-bold text-label-sm font-semibold">비플페이 O</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 bg-outline-variant/50 px-3 py-1 rounded-full text-on-surface-variant">
                    <span className="font-label-bold text-label-sm font-semibold">비플페이 X</span>
                  </div>
                )}
                <span className="text-[10px] text-outline mt-0.5">{shop.beplpayCheckedAt.slice(2)} 확인</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-margin_mobile px-margin_mobile no-scrollbar">
          {/* 왕복 소요 시간 */}
          <div className="flex-shrink-0 w-32 h-24 glass-card rounded-xl p-3 flex flex-col justify-between cursor-pointer hover:bg-white/50 transition-colors" onClick={() => setShowRouteModal(true)}>
            <span className="material-symbols-outlined text-primary-container text-xl">location_on</span>
            <div>
              <p className="text-[10px] text-on-surface-variant">도보 {shop.walkTime}분</p>
              <p className="text-label-bold font-label-bold text-primary font-bold">왕복 {totalRoundTime}분</p>
            </div>
          </div>

          {/* 혼잡도 */}
          <div className="flex-shrink-0 w-32 h-24 glass-card rounded-xl p-3 flex flex-col justify-between">
            <span className={`material-symbols-outlined ${signal.text} text-xl`}>signal_cellular_alt</span>
            <div>
              <p className="text-[10px] text-on-surface-variant">혼잡도</p>
              <p className={`text-label-bold font-label-bold ${signal.text} font-bold`}>{signal.desc}</p>
            </div>
          </div>

          {/* 좌석 규모 */}
          <div className="flex-shrink-0 w-32 h-24 glass-card rounded-xl p-3 flex flex-col justify-between">
            <span className="material-symbols-outlined text-secondary text-xl">group</span>
            <div>
              <p className="text-[10px] text-on-surface-variant">{seatInfo.title}</p>
              <p className="text-label-bold font-label-bold text-on-surface font-bold">{seatInfo.desc}</p>
            </div>
          </div>
        </div>

        {/* AI Summary Card */}
        {shop.aiEstimate && (
          <div className="glass-card rounded-2xl p-md border-l-4 border-l-primary-fixed bg-primary/5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/50 border border-white/60">
                <span className="material-symbols-outlined text-primary text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <span className="font-label-bold text-label-sm text-primary font-bold">AI 추정</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-amber-rating text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="font-label-bold text-label-bold font-bold">{shop.aiEstimate.rating}</span>
                <span className="text-[10px] text-outline">(*AI 추정*)</span>
              </div>
            </div>
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              {shop.aiEstimate.reason}
            </p>
          </div>
        )}

        {/* Rating & Reviews */}
        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-rating text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="font-display-lg text-display-lg font-bold">{shop.rating}</span>
            </div>
            <div className="text-right">
              <p className="text-label-bold font-label-bold text-secondary font-semibold">같은 수업 {shop.reviews.length * 4}명 방문</p>
              <p className="text-label-sm text-outline">최근 {shop.reviews[0]?.date || "최근"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {shop.reviews.length === 0 ? (
              <div className="glass-card rounded-xl p-6 text-center text-on-surface-variant">
                <p className="font-body-md">작성된 리뷰가 없습니다.</p>
                <p className="text-xs text-outline mt-1">첫 번째 리뷰를 남겨주세요!</p>
              </div>
            ) : (
              shop.reviews.map((rev) => (
                <div key={rev.id} className="glass-card rounded-xl p-md space-y-2 bg-white/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-label-bold text-body-md text-on-surface font-semibold">{rev.user}</p>
                      <div className="flex gap-0.5 mt-0.5">
                        {[1, 2, 3, 4, 5].map((starNum) => (
                          <span 
                            key={starNum} 
                            className={`material-symbols-outlined text-[14px] ${starNum <= rev.rating ? "text-amber-rating" : "text-outline-variant"}`}
                            style={{ fontVariationSettings: starNum <= rev.rating ? "'FILL' 1" : "'FILL' 0" }}
                          >
                            star
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-outline">{rev.date}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {rev.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded bg-white/60 border border-white/80 text-[10px] text-on-secondary-container font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {rev.comment && (
                    <p className="text-body-md text-on-surface-variant leading-snug">{rev.comment}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Menu & Price */}
        <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
          <div className="p-md bg-white/10 border-b border-white/60 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">restaurant_menu</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">주요 메뉴</h3>
          </div>
          <div className="divide-y divide-white/20 bg-white/10">
            {shop.menu.map((menuItem) => (
              <div key={menuItem.name} className="p-md flex justify-between items-center hover:bg-white/5 transition-colors">
                <div>
                  <p className="font-body-lg text-body-lg text-on-surface font-semibold">{menuItem.name}</p>
                  {menuItem.desc && <p className="text-label-sm text-outline mt-0.5">{menuItem.desc}</p>}
                </div>
                <span className="font-headline-sm text-headline-sm text-primary font-bold">{menuItem.price.toLocaleString()}원</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-24 left-0 w-full px-margin_mobile z-40 pointer-events-none">
        <div className="max-w-md mx-auto flex gap-3 pointer-events-auto">
          <button 
            onClick={() => setShowRouteModal(true)}
            className="flex-1 h-14 bg-primary text-on-primary rounded-xl font-headline-sm text-headline-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform cursor-pointer border-none"
          >
            <span className="material-symbols-outlined">directions</span>
            길찾기
          </button>
          
          <Link 
            href={`/restaurants/${shop.id}/review`}
            className="flex-1 h-14 bg-white/80 backdrop-blur-md text-primary rounded-xl font-headline-sm text-headline-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform border border-primary/20 hover:bg-white"
          >
            <span className="material-symbols-outlined">edit</span>
            리뷰 쓰기
          </Link>
        </div>
      </div>



      {/* 길찾기 정보 모달 */}
      {showRouteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowRouteModal(false)}></div>
          <div className="glass-card w-full max-w-sm rounded-2xl p-6 relative z-10 space-y-4 shadow-2xl border border-white/80">
            <h3 className="font-headline-sm text-headline-sm text-secondary font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined">directions</span>
              길찾기 정보
            </h3>
            
            <div className="space-y-3 pt-2">
              <div className="bg-white/40 border border-white/60 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-baseline border-b border-white/20 pb-2">
                  <span className="text-xs text-on-surface-variant font-medium">캠퍼스 고정 기준점</span>
                  <span className="text-xs text-outline">양천구 목동서로 339</span>
                </div>
                
                <div className="flex justify-between items-center pt-1">
                  <span className="text-sm font-semibold">도보 소요 시간</span>
                  <span className="font-bold text-primary">편도 {shop.walkTime}분</span>
                </div>
                <div className="flex justify-between items-center text-xs text-on-surface-variant">
                  <span>총 이동 거리</span>
                  <span>약 {(shop.walkTime * 67).toLocaleString()}m</span>
                </div>
                <div className="flex justify-between items-center text-xs text-on-surface-variant">
                  <span>신호등 계산</span>
                  <span className={signal.text}>🟢 보행 {signal.desc}</span>
                </div>
              </div>

              <div className="text-center pt-2 text-[11px] text-outline">
                실시간 위치 수집 없이 캠퍼스 기준 고정 좌표로 계산한 최단 도보 경로입니다.
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button 
                onClick={() => setShowRouteModal(false)}
                className="flex-1 py-3 rounded-xl font-label-bold border border-white/80 text-outline-variant hover:bg-white/20 active:scale-95 transition-all"
              >
                닫기
              </button>
              
              <a 
                href={`https://map.kakao.com/link/to/${shop.name},${shop.lat},${shop.lng}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 rounded-xl font-label-bold bg-primary text-white text-center hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-1"
              >
                카카오맵으로 보기
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
