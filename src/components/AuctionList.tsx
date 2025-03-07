import { useEffect, useState } from "react";
import { fetchAuctionList, AuctionItem, AuctionListResponse } from "../services/mabinogiApi";
import type { JSX } from "react";

export default function AuctionList(): JSX.Element {
  const [auctionData, setAuctionData] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getAuctionData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data: AuctionListResponse | null = await fetchAuctionList("롱 소드");
        if (data && data.auctionItems && data.auctionItems.length > 0) {
          setAuctionData(data.auctionItems);
        } else {
          setAuctionData([]);
          setError("경매장 데이터를 찾을 수 없습니다.");
        }
      } catch (err) {
        console.error(err);
        setError("오류가 발생했습니다.");
      }

      setLoading(false);
    };

    getAuctionData();
  }, []);

  return (
    <>
      <div>
        <h1>마비노기 경매장 리스트</h1>

        {loading && <p>경매장 데이터를 불러오는 중...</p>}
        {error && !loading && <p>{error}</p>}

        {auctionData.length > 0 ? (
          <ul>
            {auctionData.map((item) => (
              <li key={item.itemId}>
                <strong>{item.itemName}</strong> - {item.price} Gold
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p>검색된 경매장 데이터가 없습니다.</p>
        )}
      </div>
    </>
  );
}
