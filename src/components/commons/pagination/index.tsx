import styles from "./styles.module.css";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const MAX_VISIBLE_PAGES = 5;

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const half = Math.floor(MAX_VISIBLE_PAGES / 2);
  const startPage = Math.max(
    1,
    Math.min(currentPage - half, totalPages - MAX_VISIBLE_PAGES + 1),
  );
  const endPage = Math.min(totalPages, startPage + MAX_VISIBLE_PAGES - 1);

  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index,
  );

  return (
    <nav className={styles.pagination} aria-label="페이지 이동">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="이전 페이지"
      >
        ‹
      </button>

      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          className={pageNumber === currentPage ? styles.selected : ""}
          onClick={() => onPageChange(pageNumber)}
          aria-current={pageNumber === currentPage ? "page" : undefined}
        >
          {pageNumber}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
      >
        ›
      </button>
    </nav>
  );
}
