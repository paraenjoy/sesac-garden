import type { ReactNode } from "react";
import Header from "@/components/commons/header";
import ScrollToTop from "@/components/commons/scroll-to-top";
import styles from "./layout.module.css";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      {/* 로그인·회원가입을 제외한 페이지만 Header를 공통으로 사용해요. */}
      <Header />
      <div className={styles.pageContent}>{children}</div>
      <ScrollToTop />
    </>
  );
}
