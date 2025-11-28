
export interface Seller {
  name: string;
  price: string;
  currency: string;
  link: string;
  inStock: boolean;
  offers?: string;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  pros: string[];
  cons: string[];
  summary: string;
}

export interface ProductData {
  productName: string;
  brand: string;
  category: string;
  description: string;
  keyFeatures: string[];
  sellers: Seller[];
  reviews: ReviewSummary;
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface AnalysisResult {
  productData: ProductData | null;
  sources: GroundingSource[];
  rawText?: string;
}