import { useState } from "react";
import { fetchAuctionList, searchAuctionItems, AuctionItem } from "../services/mabinogiApi";
import type { JSX } from "react";

interface SearchAuctionProps {
  onSearchComplete: (results: AuctionItem[], errorMsg?: string) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  onKeywordChange?: (kw: string) => void;
  selectedCategory: string | null;
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
        // 카테고리가 선택된 경우: category와 item_name 기반 검색
        const data = await fetchAuctionList(keyword, selectedCategory);
        console.log("카테고리 검색 결과:", data.auction_item);
        if (data && data.auction_item && data.auction_item.length > 0) {
          onSearchComplete(data.auction_item);
        } else {
          onSearchComplete([], "검색 결과가 없습니다.");
        }
      } else {
        // 카테고리 미선택 시: 단순 키워드 검색
        const data = await searchAuctionItems(keyword);
        console.log("키워드 검색 결과:", data);
        if (data.auction_item.length === 0) {
          onSearchComplete([], "검색 결과가 없습니다.");
        } else {
          onSearchComplete(data.auction_item);
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
