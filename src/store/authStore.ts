import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/auth";
import { jwtDecode } from "jwt-decode";
import { apolloClient } from "../lib/apolloClient";
import { REFRESH_TOKEN } from "../graphql/mutations/auth";
import { GET_CURRENT_USER } from "../graphql/queries/users";

function scheduleTokenRefresh(refreshToken: string, login: AuthState["login"]) {
  const decoded: { exp: number } = jwtDecode(refreshToken);
  const expiresIn = decoded.exp * 1000 - Date.now();

  if (expiresIn > 0) {
    setTimeout(async () => {
      try {
        const response = await apolloClient.mutate({
          mutation: REFRESH_TOKEN,
          variables: { refreshToken },
        });

        const tokens = response.data?.refreshToken;
        if (tokens) {
          const user = useAuthStore.getState().user;
          login(tokens, user!);
        }
      } catch (err) {
        console.error("Silent token refresh failed", err);
        useAuthStore.getState().logout();
      }
    }, expiresIn - 60_000);
  }
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (
    tokens: { accessToken: string; refreshToken: string; expiresAt: string },
    user: User
  ) => void;
  logout: () => void;
  setUser: (user: User) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: (tokens, user) => {
        localStorage.setItem("auth-token", tokens.accessToken);
        localStorage.setItem("refresh-token", tokens.refreshToken);
        const permissions = user?.permissions || []; // adapt based on API
        localStorage.setItem("permissions", JSON.stringify(permissions));
        set({
          user,
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isAuthenticated: true,
        });
      },

      logout: () => {
        localStorage.removeItem("auth-token");
        localStorage.removeItem("refresh-token");
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      setUser: (user) => set({ user }),
      initializeAuth: async () => {
        set({ isLoading: true });
        const token = localStorage.getItem("auth-token");
        const refreshToken = localStorage.getItem("refresh-token");

        if (!token || !refreshToken) {
          set({ isLoading: false });
          // get().logout();
          // window.location.href = "/auth/login";
          return;
        }

        try {
          const { data } = await apolloClient.query({
            query: GET_CURRENT_USER,
            fetchPolicy: "network-only",
          });

          set({
            user: data.me,
            token,
            refreshToken,
            isAuthenticated: true,
          });

          scheduleTokenRefresh(refreshToken, get().login);
        } catch (err) {
          console.warn("Auth initialization failed", err);
          get().logout();
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
