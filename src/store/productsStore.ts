import { create } from 'zustand';
import { Product, ProductsResponse } from '@/types';

interface ProductsStore {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
  loading: boolean;
  error: string | null;
  selectedCategory: string | null;
  // Cache key: category + search + skip + limit
  cache: Map<string, { data: ProductsResponse; timestamp: number }>;
  fetchProducts: (
    skip?: number,
    limit?: number,
    search?: string,
    category?: string
  ) => Promise<void>;
  setCategory: (category: string | null) => void;
  clearCache: () => void;
}

/**
 * Caching Strategy:
 * - Cache API responses in memory using a Map
 * - Cache key: combination of category, search query, skip, and limit
 * - Cache duration: 5 minutes (300000ms)
 * - Why caching: Reduces API calls, improves performance, better UX
 * - Trade-off: Slightly stale data, but acceptable for this use case
 */
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCacheKey = (
  skip: number,
  limit: number,
  search?: string,
  category?: string
): string => {
  return `${category || ''}_${search || ''}_${skip}_${limit}`;
};

export const useProductsStore = create<ProductsStore>((set, get) => ({
  products: [],
  total: 0,
  skip: 0,
  limit: 10,
  loading: false,
  error: null,
  selectedCategory: null,
  cache: new Map(),

  fetchProducts: async (skip = 0, limit = 10, search?: string, category?: string) => {
    const cacheKey = getCacheKey(skip, limit, search, category);
    const cached = get().cache.get(cacheKey);

    // Check if cached data is still valid
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      set({
        products: cached.data.products,
        total: cached.data.total,
        skip: cached.data.skip,
        limit: cached.data.limit,
        loading: false,
        error: null,
      });
      return;
    }

    set({ loading: true, error: null });

    try {
      let url: string;
      if (category) {
        url = `https://dummyjson.com/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`;
      } else if (search) {
        url = `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`;
      } else {
        url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch products');

      const data: ProductsResponse = await response.json();

      // Update cache
      get().cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      set({
        products: data.products,
        total: data.total,
        skip: data.skip,
        limit: data.limit,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  },

  setCategory: (category) => {
    set({ selectedCategory: category, skip: 0 });
  },

  clearCache: () => {
    set({ cache: new Map() });
  },
}));

