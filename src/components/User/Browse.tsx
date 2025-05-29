// src/components/User/Browse/index.tsx - Fixed version

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Clock, 
  IndianRupee,
  SlidersHorizontal,
  Grid,
  List
} from 'lucide-react';
import { useBrowseServices } from '@/hooks/useUserQueries';
import { formatCurrency } from '@/lib/formatters';
import { Service } from '@/domain/entities/User/Service';

const BrowseServices = () => {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: 12,
    search: '',
    category: 'all', // Changed from empty string to 'all'
    minPrice: '',
    maxPrice: '',
    city: '',
    rating: 'all', // Changed from empty string to 'all'
    sortBy: 'averageRating',
    sortOrder: 'desc'
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Convert 'all' values to empty strings for API calls
  const getApiParams = (params: typeof searchParams) => {
    return {
      ...params,
      category: params.category === 'all' ? '' : params.category,
      rating: params.rating === 'all' ? '' : params.rating,
    };
  };

  const { data, isLoading, error } = useBrowseServices(getApiParams(searchParams));

  const handleSearch = (value: string) => {
    setSearchParams(prev => ({
      ...prev,
      search: value,
      page: 1
    }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setSearchParams(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  };

  const clearFilters = () => {
    setSearchParams({
      page: 1,
      limit: 12,
      search: '',
      category: 'all', // Reset to 'all' instead of empty string
      minPrice: '',
      maxPrice: '',
      city: '',
      rating: 'all', // Reset to 'all' instead of empty string
      sortBy: 'averageRating',
      sortOrder: 'desc'
    });
  };

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">Failed to load services</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Browse Services</h1>
          <p className="text-gray-600">Discover trusted professionals in your area</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search services, providers, or locations..."
                className="pl-10"
                value={searchParams.search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                <span>Sort by:</span>
                <Select
                  value={searchParams.sortBy}
                  onValueChange={(value) => handleFilterChange('sortBy', value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="averageRating">Rating</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="totalBookings">Popularity</SelectItem>
                    <SelectItem value="createdAt">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Filters */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 ${showFilters || 'hidden sm:grid'}`}>
              <Select
                value={searchParams.category}
                onValueChange={(value) => handleFilterChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {data?.categories?.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Min Price (₹)"
                type="number"
                value={searchParams.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />

              <Input
                placeholder="Max Price (₹)"
                type="number"
                value={searchParams.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />

              <Input
                placeholder="City"
                value={searchParams.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
              />

              <Select
                value={searchParams.rating}
                onValueChange={(value) => handleFilterChange('rating', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Rating</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="3">3+ Stars</SelectItem>
                  <SelectItem value="2">2+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters */}
            {(searchParams.search || searchParams.category !== 'all' || searchParams.minPrice || 
              searchParams.maxPrice || searchParams.city || searchParams.rating !== 'all') && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600">Active filters:</span>
                {searchParams.search && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {searchParams.search}
                  </Badge>
                )}
                {searchParams.category !== 'all' && (
                  <Badge variant="secondary">
                    Category: {data?.categories?.find(c => c._id === searchParams.category)?.name}
                  </Badge>
                )}
                {(searchParams.minPrice || searchParams.maxPrice) && (
                  <Badge variant="secondary">
                    Price: ₹{searchParams.minPrice || '0'} - ₹{searchParams.maxPrice || '∞'}
                  </Badge>
                )}
                {searchParams.city && (
                  <Badge variant="secondary">City: {searchParams.city}</Badge>
                )}
                {searchParams.rating !== 'all' && (
                  <Badge variant="secondary">Rating: {searchParams.rating}+ stars</Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {isLoading ? (
        <ServicesSkeleton viewMode={viewMode} />
      ) : (
        <>
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {data?.pagination.count || 0} services found
            </p>
          </div>

          {/* Services Grid/List */}
          {data?.services?.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">No services found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={clearFilters}>Clear filters</Button>
              </CardContent>
            </Card>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                : "space-y-4"
            }>
              {data?.services?.map((service) => (
                <ServiceCard 
                  key={service._id} 
                  service={service} 
                  viewMode={viewMode}
                  onClick={() => router.push(`/user/services/${service._id}`)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {data && data.pagination.total > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={searchParams.page === 1}
                onClick={() => handlePageChange(searchParams.page - 1)}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, data.pagination.total) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={searchParams.page === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                disabled={searchParams.page === data.pagination.total}
                onClick={() => handlePageChange(searchParams.page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

interface ServiceCardProps {
  service: Service;
  viewMode: 'grid' | 'list';
  onClick: () => void;
}

const ServiceCard = ({ service, viewMode, onClick }: ServiceCardProps) => {
  if (viewMode === 'list') {
    return (
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {service.images?.length > 0 && (
              <div className="w-full sm:w-32 h-32 bg-gray-200 rounded-lg flex-shrink-0"></div>
            )}
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{service.name}</h3>
                  <p className="text-sm text-gray-600">by {service.provider.name}</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-primary">
                    {formatCurrency(service.price)}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="w-3 h-3" />
                    {service.duration}min
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm line-clamp-2">{service.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{service.averageRating.toFixed(1)}</span>
                    <span>({service.totalReviews})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {service.serviceAreas?.[0]}
                  </div>
                </div>
                <Badge variant="outline">{service.category.name}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardHeader className="p-4">
        {service.images?.length > 0 && (
          <div className="w-full h-32 bg-gray-200 rounded-lg mb-3"></div>
        )}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg leading-tight">{service.name}</CardTitle>
            <div className="text-right">
              <div className="text-lg font-bold text-primary">
                {formatCurrency(service.price)}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Clock className="w-3 h-3" />
                {service.duration}min
              </div>
            </div>
          </div>
          <CardDescription className="text-sm">{service.provider.name}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-gray-600 line-clamp-3 mb-3">{service.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{service.averageRating.toFixed(1)}</span>
            <span className="text-gray-500">({service.totalReviews})</span>
          </div>
          <Badge variant="outline" className="text-xs">{service.category.name}</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

const ServicesSkeleton = ({ viewMode }: { viewMode: 'grid' | 'list' }) => (
  <div className={
    viewMode === 'grid' 
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
      : "space-y-4"
  }>
    {[...Array(8)].map((_, i) => (
      <Card key={i}>
        <CardHeader className="p-4">
          <Skeleton className="h-32 w-full mb-3" />
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-4 w-24" />
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-3" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default BrowseServices;