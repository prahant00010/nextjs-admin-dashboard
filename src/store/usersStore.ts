import { create } from 'zustand';
import { User, UsersResponse } from '@/types';

interface UsersStore {
  users: User[];
  total: number;
  skip: number;
  limit: number;
  loading: boolean;
  error: string | null;
  // Cache key: search query + skip + limit
  cache: Map<string, { data: UsersResponse; timestamp: number }>;
  fetchUsers: (skip?: number, limit?: number, search?: string) => Promise<void>;
  clearCache: () => void;
}

/**
 * Caching Strategy:
 * - Cache API responses in memory using a Map
 * - Cache key: combination of search query, skip, and limit
 * - Cache duration: 5 minutes (300000ms)
 * - Why caching: Reduces API calls, improves performance, better UX
 * - Trade-off: Slightly stale data, but acceptable for this use case
 */
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCacheKey = (skip: number, limit: number, search?: string): string => {
  return `${search || ''}_${skip}_${limit}`;
};

export const useUsersStore = create<UsersStore>((set, get) => ({
  users: [],
  total: 0,
  skip: 0,
  limit: 10,
  loading: false,
  error: null,
  cache: new Map(),

  fetchUsers: async (skip = 0, limit = 10, search?: string) => {
    const cacheKey = getCacheKey(skip, limit, search);
    const cached = get().cache.get(cacheKey);

    // Check if cached data is still valid
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      set({
        users: cached.data.users,
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
      const url = search
        ? `https://dummyjson.com/users/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`
        : `https://dummyjson.com/users?limit=${limit}&skip=${skip}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch users');

      const data: UsersResponse = await response.json();

      // Update cache
      get().cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      set({
        users: data.users,
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

  clearCache: () => {
    set({ cache: new Map() });
  },
}));

