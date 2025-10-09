import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  profilePic?: string;
  isVerified: boolean;
  isActive: boolean;
  status: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (token: string, user: User) => {
        Cookies.set("auth-token", token, { expires: 7 });
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        Cookies.remove("auth-token");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
