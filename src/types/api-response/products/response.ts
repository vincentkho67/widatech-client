import { Product } from "@/types/product";

export interface ProductApiResponse {
    data: Product[];
    meta: {
      totalItems: number;
      itemsPerPage: number;
      currentPage: number;
      totalPages: number;
      isSearch: boolean;
    };
}