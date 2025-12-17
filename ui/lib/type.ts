"use server";

export interface Query {
  page: string;
  size: string;
  sort_by: string;
  order_by: string;
  search?: string;
  transport_type ?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  metaData: Pagination | null;
}

export interface Pagination {
  page: number;
  size: number;
  totalCounts: number;
  totalPages: number;
}
