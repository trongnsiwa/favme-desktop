import create from "zustand";
import { Category, Favorite, Label } from "@prisma/client";

interface StoreState {
  screenLoading: boolean;
  showScreenLoading: (isLoading: boolean) => void;
  openSidebar: boolean;
  toggleSidebar: (open: boolean) => void;
  ownCategories: Category[];
  setOwnCategories: (categories: Category[]) => void;
  showFavorite: boolean;
  toggleFavorite: () => void;
  favorite: (Favorite & { category: Category } & { labels: Label[] }) | null;
  setFavorite: (favorite: Favorite & { category: Category; labels: Label[] }) => void;
  refetchFavorites: any;
  setRefetchFavorites: (refetch: any) => void;
  manageCategory: boolean;
  toggleManageCategory: (open: boolean) => void;
  refetchCategories: () => boolean;
  setRefetchCategories: (refetch: any) => void;
}

export const useStore = create<StoreState>((set) => ({
  screenLoading: false,
  showScreenLoading: (isLoading) => set({ screenLoading: isLoading }),
  openSidebar: true,
  toggleSidebar: (open) => set({ openSidebar: open }),
  ownCategories: [],
  setOwnCategories: (categories) => set({ ownCategories: categories }),
  showFavorite: false,
  toggleFavorite: () => set((state) => ({ showFavorite: !state.showFavorite })),
  favorite: null,
  setFavorite: (favorite) => set({ favorite: favorite }),
  refetchFavorites: null,
  setRefetchFavorites: (refetch) => set({ refetchFavorites: refetch }),
  manageCategory: false,
  toggleManageCategory: (open) => set((state) => ({ manageCategory: open })),
  refetchCategories: () => true,
  setRefetchCategories: (refetch) => set({ refetchCategories: refetch })
}));
