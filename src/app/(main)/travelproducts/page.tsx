"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { HERO_BANNER_SLIDES } from "@/components/home/hero-banner/constants";
import HeroBanner from "@/components/home/hero-banner";
import ProductCard from "@/components/travelproducts/product-card";
import useDebouncedValue from "@/lib/use-debounced-value";

import styles from "./styles.module.css";

// 상단의 큰 추천 숙소 카드에 보여 줄 내용이에요.
const featuredProducts = [
  {
    id: 1,
    image: "/images/a.png",
    title: "포항 : 당장 가고 싶은 숙소",
    description: "살어리 살어리랐다 청산(靑山)에 쉬어가요.",
  },
  {
    id: 2,
    image: "/images/b.png",
    title: "강릉 : 마음까지 깨끗해지는 하얀 숙소",
    description: "시원한 바다와 하늘을 한눈에 담아보세요.",
  },
];

// 검색창 아래에 보여 줄 숙소 테마와 아이콘이에요.
const categories = [
  { name: "전체", icon: "/icons/search.svg" },
  { name: "1인 전용", icon: "/icons/single_person_accommodation.svg" },
  { name: "아파트", icon: "/icons/apartment.svg" },
  { name: "호텔", icon: "/icons/hotel.svg" },
  { name: "캠핑", icon: "/icons/camp.svg" },
  { name: "룸 서비스 가능", icon: "/icons/room_service.svg" },
  { name: "불멍", icon: "/icons/fire.svg" },
  { name: "반신욕&스파", icon: "/icons/spa.svg" },
  { name: "바다 위 숙소", icon: "/icons/house_on_the_sea.svg" },
  { name: "플랜테리어", icon: "/icons/planterior.svg" },
];

// 현재는 API를 연결하지 않고, 화면 연습을 위한 임시 상품을 보여 줘요.
type TravelProduct = {
  id: number;
  image: string;
  writer: string;
  title: string;
  description: string;
  tag: string;
  price: string;
  region: string;
  category: string;
  // 실제 API에 판매 상태 필드가 아직 없어, 화면 확인용으로 임시 상태를 두었어요.
  isSoldOut: boolean;
};

const products: TravelProduct[] = [
  {
    id: 1,
    image: "/images/a.png",
    writer: "반얀트리",
    title: "강동 캠퍼스에서 쉬어가세요",
    description: "편안한 클라스룸에서 코딩의 피로를 풀어 보세요.",
    tag: "#7인 이하 #코딩 #캠퍼스 #리프레시 가능",
    price: "33,000 원",
    region: "서울",
    category: "호텔",
    isSoldOut: false,
  },
  {
    id: 2,
    image: "/images/c.png",
    writer: "트립러버",
    title: "부산 광안리 오션뷰 숙소",
    description: "창문 너머 바다를 바라보며 조용한 휴식을 즐겨보세요.",
    tag: "#오션뷰 #광안리 #룸서비스",
    price: "59,000 원",
    region: "부산",
    category: "룸 서비스 가능",
    isSoldOut: true,
  },
  {
    id: 3,
    image: "/images/d.png",
    writer: "반얀트리",
    title: "제주 프라이빗 스파 펜션",
    description: "따뜻한 반신욕과 함께 저녁 노을을 만끽할 수 있어요.",
    tag: "#반신욕&스파 #제주 #감성숙소",
    price: "74,000 원",
    region: "제주",
    category: "반신욕&스파",
    isSoldOut: false,
  },
  {
    id: 4,
    image: "/images/b.png",
    writer: "바다좋아",
    title: "양양 불멍 감성 캠핑하우스",
    description: "작은 마당에서 밤하늘과 함께 불멍을 즐길 수 있어요.",
    tag: "#불멍 #캠핑 #양양",
    price: "42,000 원",
    region: "강원",
    category: "불멍",
    isSoldOut: false,
  },
  {
    id: 5,
    image: "/images/c.png",
    writer: "여행일기",
    title: "강릉 바다 위 감성 스테이",
    description: "바닷가 산책로와 연결된 아늑한 숙소예요.",
    tag: "#바다 위 숙소 #강릉 #힐링",
    price: "67,000 원",
    region: "강릉",
    category: "바다 위 숙소",
    isSoldOut: true,
  },
  {
    id: 6,
    image: "/images/d.png",
    writer: "쉬어가요",
    title: "서울 1인 전용 미니 스테이",
    description: "혼자만의 하루를 조용하게 보낼 수 있는 숙소예요.",
    tag: "#1인 전용 #서울 #도심휴식",
    price: "28,000 원",
    region: "서울",
    category: "1인 전용",
    isSoldOut: false,
  },
  {
    id: 7,
    image: "/images/b.png",
    writer: "트립러버",
    title: "전주 플랜테리어 숙소",
    description: "초록 식물로 가득한 공간에서 여유를 누려보세요.",
    tag: "#플랜테리어 #전주 #사진맛집",
    price: "46,000 원",
    region: "전주",
    category: "플랜테리어",
    isSoldOut: false,
  },
  {
    id: 8,
    image: "/images/a.png",
    writer: "반얀트리",
    title: "경기도 가족형 아파트 숙소",
    description: "넓은 거실과 주방이 있어 가족 여행에 좋아요.",
    tag: "#아파트 #가족여행 #경기",
    price: "53,000 원",
    region: "경기",
    category: "아파트",
    isSoldOut: true,
  },
];

export default function TravelProductsPage() {
  const [activeSaleTab, setActiveSaleTab] = useState<"available" | "soldOut">(
    "available",
  );
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const debouncedKeyword = useDebouncedValue(keyword, 400);
  const searchKeyword = debouncedKeyword.trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const isSaleTabMatch =
        activeSaleTab === "available" ? !product.isSoldOut : product.isSoldOut;
      const isCategoryMatch =
        selectedCategory === "전체" || product.category === selectedCategory;
      const isKeywordMatch =
        searchKeyword === "" ||
        [product.title, product.region, product.description]
          .join(" ")
          .toLowerCase()
          .includes(searchKeyword);

      return isSaleTabMatch && isCategoryMatch && isKeywordMatch;
    });
  }, [activeSaleTab, searchKeyword, selectedCategory]);

  return (
    <main>
      <HeroBanner />

      <div className={styles.page}>
        <section className={styles.featureSection}>
          <h1 className={styles.mainTitle}>
            {HERO_BANNER_SLIDES[0].subtitle}, 2026 끝여름 낭만있게 마무리 하고 싶다면?
          </h1>

          <div className={styles.featureList}>
            {featuredProducts.map((product) => (
              <article className={styles.featureCard} key={product.id}>
                <Image
                  className={styles.featureImage}
                  src={product.image}
                  alt={product.title}
                  width={628}
                  height={628}
                />

                <div className={styles.featureBookmark}>
                  <Image
                    src="/icons/bookmark.svg"
                    alt=""
                    width={24}
                    height={24}
                  />
                  <span>24</span>
                </div>

                <div className={styles.featureText}>
                  <strong>{product.title}</strong>
                  <p>{product.description}</p>
                  <b>32,900 원</b>
                </div>
              </article>
            ))}

            <button
              className={styles.nextButton}
              type="button"
              aria-label="다음 숙소 보기"
            >
              ›
            </button>
          </div>
        </section>

        <Image
          className={styles.adBanner}
          src="/images/banner.png"
          alt="빌 패소 르꼬 전시회 근처 숙소 특가 예약"
          width={1280}
          height={240}
        />

        <section className={styles.productSection}>
          <h2>여기에서만 예약할 수 있는 숙소</h2>

          <div className={styles.tabs}>
            <button
              className={activeSaleTab === "available" ? styles.activeTab : ""}
              type="button"
              onClick={() => setActiveSaleTab("available")}
            >
              예약 가능 숙소
            </button>
            <button
              className={activeSaleTab === "soldOut" ? styles.activeTab : ""}
              type="button"
              onClick={() => setActiveSaleTab("soldOut")}
            >
              예약 마감 숙소
            </button>
          </div>

          <div className={styles.toolbar}>
            <div className={styles.dateBox}>
              <Image src="/icons/calendar.svg" alt="" width={24} height={24} />
              <span>YYYY. MM. DD - YYYY. MM. DD</span>
            </div>

            <label className={styles.searchBox}>
              <Image src="/icons/search.svg" alt="" width={24} height={24} />
              <input
                type="text"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") event.preventDefault();
                }}
                placeholder="제목을 검색해 주세요."
              />
            </label>

            <Link className={styles.sellButton} href="/travelproducts/new">
              <Image src="/icons/rwite.svg" alt="" width={20} height={20} />
              숙박권 판매하기
            </Link>
          </div>

          <div className={styles.categoryList}>
            {categories.map((category) => (
              <button
                className={`${styles.category} ${
                  selectedCategory === category.name ? styles.selectedCategory : ""
                }`}
                type="button"
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                aria-pressed={selectedCategory === category.name}
              >
                <Image src={category.icon} alt="" width={40} height={40} />
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          <h3 className={styles.saleStateTitle}>
            {activeSaleTab === "available" ? "예약 가능 숙소" : "예약 마감 숙소"}
          </h3>

          <div className={styles.productList} id="product-list">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                image={product.image}
                title={product.title}
                description={product.description}
                tag={product.tag}
                writer={product.writer}
                price={product.price}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <p className={styles.emptyState}>조건에 맞는 숙소가 없어요.</p>
          )}
        </section>
      </div>

      {/* 오른쪽 하단의 '최근 본 상품'. */}
      <aside className={styles.recentProducts}>
        <strong>최근 본 상품</strong>
        <Image src="/images/b.png" alt="최근 본 숙소" width={70} height={70} />
        <Image src="/images/c.png" alt="최근 본 숙소" width={70} height={70} />
        <Image src="/images/d.png" alt="최근 본 숙소" width={70} height={70} />
      </aside>
    </main>
  );
}
