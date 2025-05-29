export interface UserDashboard {
  bookings: {
    total: number;
    upcoming: number;
    completed: number;
  };
  spending: {
    total: number;
  };
  recentBookings: Array<{
    _id: string;
    provider: {
      name: string;
    };
    service: {
      name: string;
    };
    status: string;
    totalAmount: number;
    bookingDate: Date;
    createdAt: Date;
  }>;
  favoriteCategories: Array<{
    _id: string;
    count: number;
    categoryData: {
      _id: string;
      name: string;
      icon: string;
    };
  }>;
}