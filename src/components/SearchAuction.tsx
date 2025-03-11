import { useState } from "react";
import { fetchAuctionList, searchAuctionItems, AuctionItem } from "../services/mabinogiApi";
import type { JSX } from "react";

interface SearchAuctionProps {
  onSearchComplete: (results: AuctionItem[], errorMsg?: string) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  onKeywordChange?: (kw: string) => void;
  selectedCategory: number | null;
}

export default function SearchAuction({
  onSearchComplete,
  setLoading,
  setError,
  onKeywordChange,
  selectedCategory
}: SearchAuctionProps): JSX.Element {
  const [keyword, setKeyword] = useState<string>("");

  const handleSearch = async () => {
    if (!keyword.trim()) {
      setError("검색어를 입력하세요.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (selectedCategory) {
        // 카테고리가 선택된 경우: 검색어와 함께 선택된 카테고리 필터를 사용
        const data = await fetchAuctionList(keyword, selectedCategory);
        if (data && data.auctionItems && data.auctionItems.length > 0) {
          onSearchComplete(data.auctionItems);
        } else {
          onSearchComplete([], "검색 결과가 없습니다.");
        }
      } else {
        // 카테고리가 선택되지 않은 경우: 전체 아이템 중 검색어로 검색
        const data = await searchAuctionItems(keyword);
        if (data.length === 0) {
          onSearchComplete([], "검색 결과가 없습니다.");
        } else {
          onSearchComplete(data);
        }
      }
    } catch (err) {
      console.error(err);
      onSearchComplete([], "검색 중 오류 발생");
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    if (onKeywordChange) {
      onKeywordChange(e.target.value);
    }
  };

  return (
    <>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">경매장 검색</h2>
        <div className="flex items-center mb-4 gap-2">
          <input
            type="text"
            placeholder="아이템 이름 입력"
            value={keyword}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 w-64 md:basis-3/4"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded md:basis-1/4"
          >
            검색
          </button>
        </div>
      </div>
    </>
  );
}
