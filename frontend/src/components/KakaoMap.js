"use client";

import React, { useEffect, useRef, useState } from "react";

// 새싹 캠퍼스 고정 좌표 (서울 양천구 목동서로 339)
const CAMPUS_COORDS = {
  lat: 37.5259,
  lng: 126.8644,
};

export default function KakaoMap({ restaurants = [] }) {
  const mapContainerRef = useRef(null);
  const [mapError, setMapError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initMap = () => {
      if (!window.kakao || !window.kakao.maps) {
        setMapError(true);
        setLoading(false);
        return;
      }

      window.kakao.maps.load(() => {
        try {
          const container = mapContainerRef.current;
          if (!container) return;

          const options = {
            center: new window.kakao.maps.LatLng(CAMPUS_COORDS.lat, CAMPUS_COORDS.lng),
            level: 4, // 지도의 확대 레벨
          };

          const map = new window.kakao.maps.Map(container, options);

          // 1. 캠퍼스 중심점 마커 추가 (초록색 원형 핀)
          const campusPosition = new window.kakao.maps.LatLng(CAMPUS_COORDS.lat, CAMPUS_COORDS.lng);
          
          // 커스텀 오버레이로 캠퍼스 핀 표시
          const campusContent = `
            <div style="position: relative; display: flex; align-items: center; justify-content: center;">
              <div style="position: absolute; width: 48px; height: 48px; background-color: rgba(52, 107, 0, 0.2); border-radius: 50%; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <div style="position: relative; width: 24px; height: 24px; background-color: #346b00; border: 2px solid white; border-radius: 50%; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"></div>
            </div>
          `;

          const campusOverlay = new window.kakao.maps.CustomOverlay({
            position: campusPosition,
            content: campusContent,
            yAnchor: 0.5,
          });
          campusOverlay.setMap(map);

          // 2. 주변 식당 마커들 추가
          restaurants.forEach((shop) => {
            if (!shop.lat || !shop.lng) return;

            const shopPosition = new window.kakao.maps.LatLng(shop.lat, shop.lng);
            
            // 신호등 상태에 따른 색상 결정 (🟢 / 🟡 / 🔴)
            let markerColor = "#4CAF50"; // default green
            if (shop.signal === "yellow") markerColor = "#FFB300";
            if (shop.signal === "red") markerColor = "#EF5350";

            const shopContent = `
              <div style="cursor: pointer; display: flex; flex-col; items: center; position: relative;">
                <div style="background-color: ${markerColor}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 10px; font-weight: bold; border: 1.5px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.15); white-space: nowrap;">
                  ${shop.name}
                </div>
                <div style="width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 5px solid ${markerColor}; margin-top: -1px; margin-left: auto; margin-right: auto; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.1));"></div>
              </div>
            `;

            const shopOverlay = new window.kakao.maps.CustomOverlay({
              position: shopPosition,
              content: shopContent,
              yAnchor: 1.1,
            });
            shopOverlay.setMap(map);
          });

          setLoading(false);
        } catch (err) {
          console.error("카카오맵 초기화 실패:", err);
          setMapError(true);
          setLoading(false);
        }
      });
    };

    // Kakao 객체가 로드되길 기다린 후 이니셜라이즈
    if (window.kakao && window.kakao.maps) {
      initMap();
    } else {
      // 1초 뒤에 재시도하거나 layout script 로드 완료 이벤트를 처리할 수 있음
      const timer = setTimeout(() => {
        if (window.kakao && window.kakao.maps) {
          initMap();
        } else {
          setMapError(true);
          setLoading(false);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [restaurants]);

  if (mapError) {
    return (
      <div className="w-full h-full rounded-[14px] bg-surface-container flex flex-col items-center justify-center p-4 text-center border border-white/60">
        <span className="material-symbols-outlined text-primary text-[48px] mb-2">map</span>
        <h4 className="font-headline-sm text-on-surface font-semibold">지도 로드 실패</h4>
        <p className="font-body-md text-on-surface-variant mt-1 text-xs">
          카카오맵 API를 불러오지 못했습니다. 환경변수 설정을 확인해주세요.<br/>
          (캠퍼스 기준: 서울 양천구 목동서로 339)
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative rounded-[14px] overflow-hidden">
      {loading && (
        <div className="absolute inset-0 bg-surface-container/60 flex items-center justify-center z-10 backdrop-blur-sm">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
