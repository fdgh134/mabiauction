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
  item_option: ItemOption[] | null;
}

export interface AuctionItem {
  itemId: string;
  itemName: string;
  displayName: string;
  count: number;
  price: number;
  expireDate: string;
  options?: Array<{
    option_type: string;
    option_sub_type?: string;
    option_desc?: string;
    option_value: string;
    option_value2?: string;
  }>;
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
export async function fetchAuctionList(keyword: string | null, categoryCode: number) {
  const params = new URLSearchParams();
  if (keyword && keyword.trim() !== "") {
    params.append("item_name", keyword);
  }
  // categoryCode가 0이 아니면 카테고리 필터를 추가합니다.
  if (categoryCode) {
    params.append("auction_item_category", categoryCode.toString());
  }
  const response = await fetch(`https://open.api.nexon.com/mabinogi/v1/auction/list?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return await response.json();
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
    const items: AuctionItem[] = data.auction_item.map((raw: RawAuctionItem) => ({
      itemId: raw.item_name,
      itemName: raw.item_name,
      displayName: raw.item_display_name,
      count: raw.item_count,
      price: raw.auction_price_per_unit,
      expireDate: raw.date_auction_expire,
      options: (raw.item_option || []).map((option) => ({
        option_type: option.option_type,
        option_sub_type: option.option_sub_type !== null ? option.option_sub_type : undefined,
        option_desc: option.option_desc !== null ? option.option_desc : undefined,
        option_value: option.option_value,
        option_value2: option.option_value2 !== null ? option.option_value2 : undefined,
      }))
    }));
    return items;
  } catch (error) {
    console.error("Error in searchAuctionItems:", error);
    return [];
  }
};



