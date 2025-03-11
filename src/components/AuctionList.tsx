import { useState } from "react";
import { AuctionItem } from "../services/mabinogiApi";
import type { JSX } from "react";

interface AuctionListProps {
  auctionData: AuctionItem[];
  loading: boolean;
  error: string | null;
}

const ITEMS_PER_PAGE = 7;

export default function AuctionList({
  auctionData,
  loading,
  error,
}: AuctionListProps): JSX.Element {
  // 페이지 상태는 AuctionList 컴포넌트 내부에서 관리할 수도 있고,
  // 부모에서 관리하도록 할 수도 있다.
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pagedResults = auctionData.slice(startIndex, endIndex);

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(auctionData.length / ITEMS_PER_PAGE);

  // 한 그룹에 최대 10개 페이지 버튼만 표시
  const maxVisiblePages = 10;
  const currentGroup = Math.floor((currentPage - 1) / maxVisiblePages);
  const startPage = currentGroup * maxVisiblePages + 1;
  const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) return <p className="p-4">로딩 중...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!auctionData || auctionData.length === 0)
    return <p className="p-4">검색된 경매장 데이터가 없습니다.</p>;

  return (
    <div className="w-5/6">
      <ul className="space-y-4 flex flex-col">
        {pagedResults.map((item, i) => (
          <li
            key={item.itemId + i}
            className="group relative border p-4 rounded w-3/4"
          >
            {/* 간단 정보 표시 */}
            <div className="flex justify-between">
              <p className="font-bold">{item.displayName}</p>
              <p>{item.price.toLocaleString()} Gold</p>
            </div>
            <p className="flex flex-row justify-end text-sm text-gray-600">
              만료 시각: {new Date(item.expireDate).toLocaleString()}
            </p>

            {/* 툴팁: 마우스 오버 시 옵션 상세 정보를 오른쪽에 표시 */}
            {item.options && item.options.length > 0 && (
              <div className="absolute left-full top-0 ml-2 w-1/3 p-2 bg-white border border-gray-300 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                <h3 className="font-bold text-sm mb-1">옵션:</h3>
                <ul className="text-xs">
                  {item.options.map((opt, idx) => (
                    <li key={idx}>
                      <strong>{opt.option_type}</strong>
                      {opt.option_sub_type ? ` (${opt.option_sub_type})` : ""}:{" "}
                      {opt.option_desc
                        ? opt.option_desc
                        : `${opt.option_value}${
                            opt.option_value2 ? " ~ " + opt.option_value2 : ""
                          }`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-center gap-2 w-3/4">
        {startPage > 1 && (
          <button
            onClick={() => handlePageChange(startPage - 1)}
            className="px-3 py-1 rounded border bg-white hover:bg-gray-100"
          >
            {"<"}
          </button>
        )}
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            disabled={page === currentPage}
            className={`px-3 py-1 rounded border ${
              page === currentPage ? "bg-gray-300 cursor-default" : "bg-white hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}
        {endPage < totalPages && (
          <button
            onClick={() => handlePageChange(endPage + 1)}
            className="px-3 py-1 rounded border bg-white hover:bg-gray-100"
          >
            {">"}
          </button>
        )}
      </div>
    </div>
  );
}
