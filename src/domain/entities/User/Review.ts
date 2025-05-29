export interface Review {
  _id: string;
  customer: string;
  provider: {
    _id: string;
    name: string;
  };
  service: {
    _id: string;
    name: string;
  };
  booking: string;
  rating: number;
  comment?: string;
  images?: string[];
  isVisible: boolean;
  providerReply?: string;
  providerReplyAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReviewRequest {
  booking: string;
  rating: number;
  comment?: string;
  images?: string[];
}

export interface UpdateReviewRequest {
  rating?: number;
  comment?: string;
  images?: string[];
}

export interface ReviewsResponse {
  reviews: Review[];
  pagination: {
    current: number;
    total: number;
    count: number;
    limit: number;
  };
}