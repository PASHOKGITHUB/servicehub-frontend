// export interface ServiceCategory {
//   _id: string;
//   name: string;
//   description: string;
//   icon: string;
//   slug: string;
//   isActive: boolean;
//   sortOrder: number;
//   servicesCount?: number;
//   createdAt: Date;
//   updatedAt: Date;
// }

import { ServiceCategory } from "../Admin/Admin";


export interface Service {
  _id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  provider: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    averageRating: number;
    totalReviews: number;
  };
  price: number;
  duration: number;
  isActive: boolean;
  images: string[];
  serviceAreas: string[];
  tags: string[];
  averageRating: number;
  totalReviews: number;
  totalBookings: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BrowseServicesRequest {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  rating?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BrowseServicesResponse {
  services: Service[];
  categories: ServiceCategory[];
  pagination: {
    current: number;
    total: number;
    count: number;
    limit: number;
  };
}