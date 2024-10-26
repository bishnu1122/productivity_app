import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  userName: string | null;
  setUserName: (name: string) => void;
  clearUserName: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userName: null,
      setUserName: (name) => set({ userName: name }),
      clearUserName: () => set({ userName: null }),
    }),
    {
      name: 'user-storage',
    }
  )
);