// Mock 식당 및 리뷰 데이터베이스 (LocalStorage를 활용한 영속화)

const DEFAULT_RESTAURANTS = [
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
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAyjqZDeT2GGKdMfJ-MraN9-lpTjZ3SCs1pNQnYJ9iaTh4bWofgjNCCjBP2e7o1yrCLyuSk7eDtcnhFl6vbzRS9LhwUzubxkE2f-iLKMNT9UdGHgPUekice_XZmHrcMhDa4yTWyFaYWr4QvWriQdwconPlZDTdGXcAIsQI470XypPOBMfSHFA2EQEPQgFI1Q5XkIc3mVS5PNElu8Mq5TQYFV_h7NBWwD65SANRV_mBsEp6jau9tzClviyqdjOC5lLcw8wSfbWDnVqo",
    menu: [
      { name: "정통 비빔밥", price: 6500, desc: "인기 메뉴 • 신선한 제철 나물" },
      { name: "돈까스 정식", price: 7000, desc: "등심까스 • 우동 소량 포함" },
      { name: "뚝배기 불고기", price: 7500, desc: "달콤 짭짤한 밥도둑" }
    ],
    reviews: [
      {
        id: 101,
        user: "같은 수업 수강생",
        rating: 4,
        tags: ["혼밥good", "가성비"],
        comment: "맛이 깔끔하고 빨리 나와서 좋아요. 바쁜 점심 시간에 딱입니다.",
        date: "어제"
      },
      {
        id: 102,
        user: "건축학과 21학번",
        rating: 5,
        tags: ["친절"],
        comment: "돈까스 정식 구성이 정말 알차요. 소스도 수제인 것 같아 맛있습니다.",
        date: "3일 전"
      }
    ],
    aiEstimate: {
      rating: 4.3,
      reason: "이 식당은 점심시간에도 회전율이 빨라 대기 시간이 적습니다. 특히 비빔밥 메뉴가 인기가 많으며 혼자 식사하기에 매우 쾌적한 환경입니다."
    }
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
    menu: [
      { name: "닭가슴살 샐러드", price: 8500, desc: "단백질 충전 대표 샐러드" },
      { name: "아보카도 샌드위치", price: 7500, desc: "건강한 지방과 고소함" }
    ],
    reviews: [
      {
        id: 201,
        user: "경영학과 20학번",
        rating: 5,
        tags: ["혼밥good", "친절"],
        comment: "재료가 정말 신선하고 매장 안이 조용해서 좋아요.",
        date: "2일 전"
      }
    ],
    aiEstimate: {
      rating: 4.4,
      reason: "샐러드가 다이어트나 조용히 식사하기에 아주 좋습니다. 테이블은 넉넉하지만 음식이 나오는 데 약간의 시간(약 7분)이 필요합니다."
    }
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
    menu: [
      { name: "생면국수", price: 6000, desc: "맑은 국물과 쫄깃한 생면" },
      { name: "치즈돈까스", price: 8500, desc: "모짜렐라 치즈가 듬뿍" }
    ],
    reviews: [
      {
        id: 301,
        user: "컴공과 22학번",
        rating: 4,
        tags: ["가성비", "빨리나옴"],
        comment: "기본 국수가 저렴해서 부담 없이 먹기 좋습니다.",
        date: "1주일 전"
      }
    ],
    aiEstimate: {
      rating: 3.8,
      reason: "면 요리라서 금방 나옵니다. 혼자 앉는 자리는 조금 협소하지만 회전율이 빨라 대기는 거의 없습니다."
    }
  },
  {
    id: 4,
    name: "진진 가마솥 국밥",
    category: "한식/국밥",
    priceLevel: "under_10k",
    rating: 4.3,
    walkTime: 5,
    totalTime: 15,
    beplpay: true,
    beplpayCheckedAt: "2026-07-15",
    seatClass: "mid",
    signal: "green",
    isSproutRecommend: true,
    lat: 37.5260,
    lng: 126.8640,
    imageUrl: "https://images.unsplash.com/photo-1547928576-a4a33237eceb?auto=format&fit=crop&w=500&q=80",
    menu: [
      { name: "가마솥 국밥", price: 7000, desc: "24시간 푹 고아낸 진한 국물" },
      { name: "얼큰 순대국", price: 8000, desc: "매콤하고 얼큰한 해장 국밥" }
    ],
    reviews: [
      {
        id: 401,
        user: "같은 수업 수강생",
        rating: 5,
        tags: ["혼밥good", "가성비", "빨리나옴"],
        comment: "깍두기가 맛있고 국물이 진짜 깊습니다. 추천해요!",
        date: "오늘"
      }
    ],
    aiEstimate: {
      rating: 4.5,
      reason: "얼큰한 국밥 좋아하시고 혼밥 자리 있어요. 가성비가 훌륭하며 특히 깍두기 맛집으로 소문난 곳입니다."
    }
  },
  {
    id: 5,
    name: "이화 순대국 전문",
    category: "한식/국밥",
    priceLevel: "under_10k",
    rating: 4.1,
    walkTime: 8,
    totalTime: 18,
    beplpay: false,
    beplpayCheckedAt: "2026-06-15",
    seatClass: "large",
    signal: "green",
    isSproutRecommend: false,
    lat: 37.5280,
    lng: 126.8650,
    imageUrl: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=500&q=80",
    menu: [
      { name: "순대국밥", price: 8000, desc: "머리고기와 순대가 듬뿍" },
      { name: "모듬순대 (소)", price: 12000, desc: "전통 순대와 머리고기 수육" }
    ],
    reviews: [
      {
        id: 501,
        user: "학생회 임원",
        rating: 4,
        tags: ["4인석있음", "친절"],
        comment: "자리가 꽤 넓어서 4인 이상 방문하기 좋습니다. 국물도 담백해요.",
        date: "3일 전"
      }
    ],
    aiEstimate: {
      rating: 4.1,
      reason: "담백한 국물 선호하시면 추천해요. 4인 테이블 배치가 여유롭고 음식이 5분 내로 나옵니다."
    }
  },
  {
    id: 6,
    name: "학생회관 푸드코트",
    category: "일식/면요리",
    priceLevel: "under_10k",
    rating: 3.7,
    walkTime: 3,
    totalTime: 10,
    beplpay: true,
    beplpayCheckedAt: "2026-07-02",
    seatClass: "large",
    signal: "yellow",
    isSproutRecommend: false,
    lat: 37.5245,
    lng: 126.8615,
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80",
    menu: [
      { name: "자장면", price: 5000, desc: "저렴한 학생식당 자장면" },
      { name: "돈까스", price: 6000, desc: "바삭하고 큰 옛날 돈까스" }
    ],
    reviews: [
      {
        id: 601,
        user: "같은 수업 수강생",
        rating: 3,
        tags: ["가성비", "4인석있음"],
        comment: "사람이 너무 많아서 자리가 조금 부족하지만 음식은 빨리 나와서 좋아요.",
        date: "1주일 전"
      }
    ],
    aiEstimate: {
      rating: 3.6,
      reason: "학생회관이라 자리가 매우 많지만 점심 피크에는 웨이팅 가중치가 큽니다. 가성비는 최고입니다."
    }
  }
];

// LocalStorage Helper Functions (클라이언트 사이드에서만 안전하게 실행)
export const getRestaurants = () => {
  if (typeof window === "undefined") return DEFAULT_RESTAURANTS;
  
  const stored = localStorage.getItem("saessakdang_restaurants");
  if (!stored) {
    localStorage.setItem("saessakdang_restaurants", JSON.stringify(DEFAULT_RESTAURANTS));
    return DEFAULT_RESTAURANTS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return DEFAULT_RESTAURANTS;
  }
};

export const saveRestaurants = (data) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("saessakdang_restaurants", JSON.stringify(data));
  }
};

export const getRestaurantById = (id) => {
  const list = getRestaurants();
  return list.find((shop) => shop.id === Number(id));
};

export const addReview = (restaurantId, reviewData) => {
  const list = getRestaurants();
  const index = list.findIndex((shop) => shop.id === Number(restaurantId));
  if (index !== -1) {
    const shop = list[index];
    const newReview = {
      id: Date.now(),
      user: "3기 새싹 수강생", // 기본 유저 닉네임 설정
      date: "방금 전",
      ...reviewData
    };
    
    // 리뷰 목록에 추가
    const updatedReviews = [newReview, ...shop.reviews];
    
    // 평균 별점 재계산
    const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = parseFloat((totalRating / updatedReviews.length).toFixed(1));
    
    list[index] = {
      ...shop,
      reviews: updatedReviews,
      rating: avgRating,
      beplpay: reviewData.beplpay !== undefined ? reviewData.beplpay : shop.beplpay,
      beplpayCheckedAt: reviewData.beplpay ? "2026-07-16" : shop.beplpayCheckedAt
    };
    
    saveRestaurants(list);
    return list[index];
  }
  return null;
};
