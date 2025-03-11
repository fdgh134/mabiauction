import { useState } from "react";
import SearchAuction from "./SearchAuction";
import AuctionList from "./AuctionList";
import { AuctionItem, fetchAuctionList } from "../services/mabinogiApi";
import { Category, categoryMap } from "../constants/categoryMap";
import CategoryTree from "./CategoryTree";

export default function MabinogiAuctionPage() {
  const [auctionData, setAuctionData] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [keyword, setKeyword] = useState<string>("");

  // SearchAuction에서 검색이 완료되면 이 함수를 호출하여 상태를 업데이트
  const handleSearchComplete = (results: AuctionItem[], errorMsg?: string) => {
    if (errorMsg) {
      setError(errorMsg);
    } else {
      setError(null);
    }
    setAuctionData(results);
  };

  const handleCategoryClick = async (cat: Category) => {
    setSelectedCategory(cat);
    console.log("선택한 카테고리:", cat);
    setLoading(true);
    setError(null);
    try {
      // 카테고리만 필터링하여 데이터를 불러옵니다.
      const data = await fetchAuctionList("", cat.code);
      if (data && data.auctionItems && data.auctionItems.length > 0) {
        setAuctionData(data.auctionItems);
      } else {
        setAuctionData([]);
        setError("해당 카테고리 매물이 없습니다.");
      }
    } catch (err) {
      console.error(err);
      setError("카테고리 조회 중 오류 발생");
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto relative">
      <div className="sticky top-0 w-full bg-white z-10">
        {/* 검색 컴포넌트: 검색 시 handleSearchComplete를 통해 부모에 결과 전달 */}
        <SearchAuction
          onSearchComplete={handleSearchComplete}
          setLoading={setLoading}
          setError={setError}
          onKeywordChange={(kw: string) => setKeyword(kw)}
          selectedCategory={selectedCategory ? selectedCategory.code : null}
        />
      </div>
      <div className="flex gap-4 p-4">
        <aside className="w-1/6 border p-2 rounded">
          <CategoryTree
            nodes={categoryMap}
            onCategoryClick={handleCategoryClick}
            selectedCategoryCode={selectedCategory ? selectedCategory.code : null}
          />
        </aside>
        {/* 리스트 컴포넌트: 부모가 가진 auctionData, loading, error를 props로 전달 */}
        <AuctionList
          auctionData={auctionData}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}
