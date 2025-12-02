export interface Car {
  id?: number;
  brand: string;
  model: string;
  price?: number;
  photo?: string;
  maxPrice?: number;
  minPrice?: number;
  startDate?: string | Date;
  endDate?: string | Date;
} 