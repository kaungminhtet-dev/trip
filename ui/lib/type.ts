"use server";

export interface Query {
  page: number;
  limit: number;
  search?: string;
  sort_by: string;
  order_by: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  metaData: Pagination | null;
}

export interface Pagination {
  page: number;
  limit: number;
  totalCounts: number;
  totalPages: number;
}
