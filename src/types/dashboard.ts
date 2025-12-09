export interface DashboardStats {
  totalRevenue: number;
  newBookingsCount: number;
  upcomingDeparturesCount: number;
  pendingBookingsCount: number;
  revenueGrowthPercent: number | null;
}

export interface UpcomingDeparture {
  tourId: string;
  availableDateId: string;
  tourTitle: string;
  startDate: string;
  endDate: string;
  bookedSlots: number;
  maxSlots: number;
  status: 'FULL' | 'SUFFICIENT' | 'NEED_MORE' | 'AVAILABLE';
}

export interface RevenueChartData {
  date: string;
  currentRevenue: number;
  previousRevenue: number;
}

export interface TopDestination {
  locationId: string;
  locationName: string;
  percentage: number;
  bookingCount: number;
}

export interface RecentBooking {
  id: string;
  customerName: string | null;
  customerPhone: string | null;
  tourTitle: string | null;
  departureDate: string | null;
  totalPrice: number;
  status: string;
}
