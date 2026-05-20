import { create } from 'zustand';
import { searchMusic } from '../api/youtube';

interface SearchState {
  query: string;
  results: any[];
  isLoading: boolean;
  searchTimeout: any;
  setQuery: (query: string) => void;
  search: (query: string, immediate?: boolean) => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  results: [],
  isLoading: false,
  searchTimeout: null,
  setQuery: (query) => set({ query }),
  search: (query, immediate = false) => {
    // Clear existing timeout
    const currentTimeout = get().searchTimeout;
    if (currentTimeout) clearTimeout(currentTimeout);

    if (!query.trim()) {
      set({ results: [], query: '', isLoading: false });
      return;
    }

    set({ query, isLoading: true });

    const performSearch = async () => {
      try {
        const results = await searchMusic(query);
        set({ results, isLoading: false });
      } catch (error) {
        console.error('Search error:', error);
        set({ isLoading: false });
      }
    };

    if (immediate) {
      performSearch();
    } else {
      // Set new debounce timeout (300ms for snappier typing)
      const timeout = setTimeout(performSearch, 300);
      set({ searchTimeout: timeout });
    }
  },
}));
