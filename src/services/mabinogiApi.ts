export interface OptionType {
  option_type: string;
  option_sub_type: string | null;
  option_value: string;
  option_value2: string | null;
  option_desc: string | null;
}

export interface AuctionItem {
  auction_price_per_unit: number;   
  date_auction_expire: string;        
  item_count: number;              
  item_display_name: string;       
  item_name: string; 
  item_option?: OptionType[];
}

interface AuctionResponse {
  auction_item: AuctionItem[];
  next_cursor?: string | null;
}

const API_KEY = import.meta.env.VITE_NEXON_API_KEY;
const BASE_URL = "https://open.api.nexon.com/mabinogi/v1/auction";
const DEFAULT_CURSOR = ""; 

export async function fetchAuctionList(
  item_name: string,
  auction_item_category: string | number,
  cursor: string = DEFAULT_CURSOR
): Promise<AuctionResponse> {
  const categoryStr = typeof auction_item_category === "string" 
    ? auction_item_category.trim() 
    : String(auction_item_category).trim();
  
  // 두 파라미터 모두 비어있으면 에러 처리
  if (!categoryStr && !item_name.trim()) {
    throw new Error("카테고리와 아이템 이름 중 하나 이상은 필수 입력값입니다.");
  }
  
  const url = new URL(`${BASE_URL}/list`);
  url.searchParams.append("auction_item_category", categoryStr);

  if (item_name.trim() !== "") {
    url.searchParams.append("item_name", item_name.trim());
  }

  if (cursor) {
    url.searchParams.append("cursor", cursor);
  }

  const response = await fetch(url.toString(), {
    headers: {
      "accept": "application/json",
      "x-nxopen-api-key": API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`경매장 리스트 호출 실패: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export async function searchAuctionItems(
  keyword: string,
  cursor: string = DEFAULT_CURSOR
): Promise<AuctionResponse> {
  const searchKeyword = keyword.trim();
  if (searchKeyword === "") {
    throw new Error("키워드가 비어있습니다.");
  }

  const url = new URL(`${BASE_URL}/keyword-search`);
  url.searchParams.append("keyword", searchKeyword);
  if (cursor) {
    url.searchParams.append("cursor", cursor);
  }

  const response = await fetch(url.toString(), {
    headers: {
      "accept": "application/json",
      "x-nxopen-api-key": API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`키워드 검색 호출 실패: ${response.statusText}`);
  }

  const data = (await response.json()) as AuctionResponse;
  return data;
}