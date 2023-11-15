import { create } from "zustand";

interface useStoreModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useStoreModal = create<useStoreModalState>((set) => ({
  isOpen: false,
  open: () => set(() => ({ isOpen: true })),
  close: () => set(() => ({ isOpen: false })),
}));
