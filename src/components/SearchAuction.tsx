import { useState } from "react";
import { searchAuctionItems, AuctionItem } from "../services/mabinogiApi";
import type { JSX } from "react";

export default function SearchAuction(): JSX.Element {
  const [keyword, setKeyword] = useState<string>("");
  const [searchResults, setSearchResults] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!keyword.trim()) {
      setError("검색어를 입력하세요.");
      return;
    }

    setLoading(true);
    setError(null);

    const data = await searchAuctionItems(keyword);

    if (data.length === 0) {
      setError("검색 결과가 없습니다.");
    }

    setSearchResults(data);
    setLoading(false);
  };

  return (
    <>
      <div>
        <h2>경매장 검색</h2>
        <input
          type="text"
          placeholder="아이템 이름 입력"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button onClick={handleSearch}>검색</button>

        {loading && <p>검색 중...</p>}
        {error && !loading && <p>{error}</p>}

        {!error && searchResults.length > 0 && (
          <ul>
            {searchResults.map((item) => (
              <li key={item.itemId}>
                <strong>{item.itemName}</strong> - {item.price} Gold
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
