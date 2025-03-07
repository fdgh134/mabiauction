import { useState } from "react";
import SearchAuction from "./SearchAuction";
import AuctionList from "./AuctionList";
import { AuctionItem } from "../services/mabinogiApi";

export default function MabinogiAuctionPage() {
  const [auctionData, setAuctionData] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // SearchAuction에서 검색이 완료되면 이 함수를 호출하여 상태를 업데이트
  const handleSearchComplete = (results: AuctionItem[], errorMsg?: string) => {
    if (errorMsg) {
      setError(errorMsg);
    } else {
      setError(null);
    }
    setAuctionData(results);
  };

  return (
    <div>
      {/* 검색 컴포넌트: 검색 시 handleSearchComplete를 통해 부모에 결과 전달 */}
      <SearchAuction
        onSearchComplete={handleSearchComplete}
        setLoading={setLoading}
        setError={setError}
      />

      {/* 리스트 컴포넌트: 부모가 가진 auctionData, loading, error를 props로 전달 */}
      <AuctionList
        auctionData={auctionData}
        loading={loading}
        error={error}
      />
    </div>
  );
}
