const API_BASE_URL = "https://open.api.nexon.com/mabinogi/v1/auction";
const API_KEY = "test_9665ee96502b66eba3294ba110fdc2170f4d92a2262688c9ed8fd87516511cc9efe8d04e6d233bd35cf2fabdeb93fb0d";

export interface ItemOption {
  option_type: string;
  option_sub_type: string | null;
  option_value: string;
  option_value2: string | null;
  option_desc: string | null;
}

export interface RawAuctionItem {
  item_name: string;
  item_display_name: string;
  item_count: number;
  auction_price_per_unit: number;
  date_auction_expire: string;
  item_option: ItemOption[];
}

export interface AuctionItem {
  itemId: string;
  itemName: string;
  displayName: string;
  count: number;
  price: number;
  expireDate: string;
  options: ItemOption[];
}

export interface AuctionListResponse {
  auctionItems: AuctionItem[];
}

export interface KeywordSearchResponse {
  auction_item: RawAuctionItem[];
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
    const data = await response.json();
    if (data && data.auctionItems && Array.isArray(data.auctionItems)) {
      const auctionItems: AuctionItem[] = data.auctionItems.map(
        (raw: RawAuctionItem) => ({
          itemId: raw.item_name,
          itemName: raw.item_name,
          displayName: raw.item_display_name,
          count: raw.item_count,
          price: raw.auction_price_per_unit,
          expireDate: raw.date_auction_expire,
          options: raw.item_option,
        })
      );
      return { auctionItems };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching auction list:", error);
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

    const data: KeywordSearchResponse = await response.json();
    console.log("🔹 API 응답 데이터:", JSON.stringify(data, null, 2));
    if (!data || !data.auction_item) return [];
    const items: AuctionItem[] = data.auction_item.map(
      (raw: RawAuctionItem) => ({
        itemId: raw.item_name,
        itemName: raw.item_name,
        displayName: raw.item_display_name,
        count: raw.item_count,
        price: raw.auction_price_per_unit,
        expireDate: raw.date_auction_expire,
        options: raw.item_option,
      })
    );
    return items;
  } catch (error) {
    console.error("Error in searchAuctionItems:", error);
    return [];
  }
};



