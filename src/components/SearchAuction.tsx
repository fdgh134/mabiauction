import { useState } from "react";
import { searchAuctionItems, AuctionItem } from "../services/mabinogiApi";
import type { JSX } from "react";

interface SearchAuctionProps {
  onSearchComplete: (results: AuctionItem[], errorMsg?: string) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function SearchAuction({
  onSearchComplete,
  setLoading,
  setError,
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
      const data = await searchAuctionItems(keyword);
      if (data.length === 0) {
        onSearchComplete([], "검색 결과가 없습니다.");
      } else {
        onSearchComplete(data);
      }
    } catch (err) {
      console.error(err);
      onSearchComplete([], "검색 중 오류 발생");
    }
    setLoading(false);
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
            onChange={(e) => setKeyword(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-64"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            검색
          </button>
        </div>
      </div>
    </>
  );
}
