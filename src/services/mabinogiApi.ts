const API_BASE_URL = "https://open.api.nexon.com/mabinogi/v1/auction";
const API_KEY = "test_9665ee96502b66eba3294ba110fdc2170f4d92a2262688c9ed8fd87516511cc9efe8d04e6d233bd35cf2fabdeb93fb0d";

export interface AuctionItem {
  itemId: string;
  itemName: string;
  price: number;
}

export interface AuctionListResponse {
  auctionItems: AuctionItem[];
}

export interface KeywordSearchResponse {
  auction_item: AuctionItem[];
}

/**
 * 경매장 리스트 가져오기 (GET 요청)
 */
export const fetchAuctionList = async (
  itemName: string = "롱 소드"
): Promise<AuctionListResponse | null> => {
  try {
    const url = `${API_BASE_URL}/list?item_name=${encodeURIComponent(itemName)}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-nxopen-api-key": API_KEY,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: AuctionListResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching auction data:", error);
    return null;
  }
};

/**
 * 특정 키워드로 아이템 검색 (GET 요청)
 */
export const searchAuctionItems = async (keyword: string): Promise<AuctionItem[]> => {
  try {
    if (!keyword.trim()) {
      console.warn("검색어를 입력하세요.");
      return [];
    }

    const formattedKeyword = keyword.trim();
    const url = `${API_BASE_URL}/keyword-search?keyword=${encodeURIComponent(
      formattedKeyword
    )}`;

    console.log("🔹 API 요청:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-nxopen-api-key": API_KEY,
        "Content-Type": "application/json",
      },
    });

    console.log("🔹 응답 상태 코드:", response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: KeywordSearchResponse = await response.json();
    console.log("🔹 API 응답 데이터:", JSON.stringify(data, null, 2));

    // API 구조에 따라 auction_item가 배열인지 확인 후 사용
    return data && data.auction_item ? data.auction_item : [];
  } catch (error) {
    console.error("❌ API 요청 실패:", error);
    return [];
  }
};



