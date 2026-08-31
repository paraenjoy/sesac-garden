"use client";

import { useEffect, useState } from "react";
import { HERO_BANNER_AUTOPLAY_MS, HERO_BANNER_SLIDES } from "./constants";
import styles from "./styles.module.css";

type HeroBannerProps = {
  small?: boolean;
  showText?: boolean;
};

export default function HeroBanner({
  small = false,
  showText = true,
}: HeroBannerProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const currentSlide = HERO_BANNER_SLIDES[currentSlideIndex];

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setCurrentSlideIndex(
        (previous) => (previous + 1) % HERO_BANNER_SLIDES.length,
      );
    }, HERO_BANNER_AUTOPLAY_MS);

    return () => window.clearInterval(timerId);
  }, []);

  const moveToPrevSlide = () => {
    setCurrentSlideIndex(
      (previous) =>
        (previous - 1 + HERO_BANNER_SLIDES.length) % HERO_BANNER_SLIDES.length,
    );
  };

  const moveToNextSlide = () => {
    setCurrentSlideIndex((previous) => (previous + 1) % HERO_BANNER_SLIDES.length);
  };

  return (
    <section
      className={`${styles.hero} ${small ? styles.small : ""}`}
      aria-label="해변 여행 배너"
      style={{
        backgroundImage: `linear-gradient(rgba(32, 100, 119, 0.12), rgba(32, 100, 119, 0.12)), url("${currentSlide.image}")`,
      }}
    >
      {/* 메인 화면의 큰 배너에만 여행 문구를 보여줘요. */}
      {!small && showText && (
        <div className={styles.textBox}>
          <p>{currentSlide.subtitle}</p>
          <h1>{currentSlide.title}</h1>
        </div>
      )}

      <button
        className={`${styles.arrowButton} ${styles.prevButton}`}
        type="button"
        onClick={moveToPrevSlide}
        aria-label="이전 배너 보기"
      >
        ‹
      </button>

      <button
        className={`${styles.arrowButton} ${styles.nextButton}`}
        type="button"
        onClick={moveToNextSlide}
        aria-label="다음 배너 보기"
      >
        ›
      </button>

      <div className={styles.dots}>
        {HERO_BANNER_SLIDES.map((slide, index) => (
          <button
            key={slide.title}
            className={index === currentSlideIndex ? styles.activeDot : ""}
            type="button"
            onClick={() => setCurrentSlideIndex(index)}
            aria-label={`${index + 1}번 배너 보기`}
            aria-current={index === currentSlideIndex ? "true" : undefined}
          />
        ))}
      </div>
    </section>
  );
}
