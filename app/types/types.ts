export interface SearchResult {
  url: string;
  company_name: string;
  logo_url?: string;
  phone_main?: string;
  location?: string;
  primary_category?: string;
  website?: string;
  email?: string;
  description_full?: string;
  products_and_services?: string[];
  description_short?: string;
}

export interface SearchResponse {
  source: 'cache' | 'live';
  results: SearchResult[];
}

export interface StatsResponse {
  total_requests: number;
  top_keywords: Array<{
    keyword: string;
    count: number;
  }>;
}