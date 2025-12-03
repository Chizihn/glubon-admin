import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
  fromPromise,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { useAuthStore } from "../store/authStore";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";
export const GRAPHQL_ENDPOINT = `${API_BASE_URL}/graphql`;

export const WEBSOCKET_ENDPOINT = `${API_BASE_URL.replace(
  "https",
  "wss"
).replace("http", "ws")}/graphql`;

const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT,
});

// Set Authorization Header using Zustand store
const authLink = setContext((_, { headers }) => {
  const token = useAuthStore.getState().token;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Token refresh logic
let isRefreshing = false;
let pendingRequests: (() => void)[] = [];

const resolvePendingRequests = () => {
  pendingRequests.forEach((cb) => cb());
  pendingRequests = [];
};

const errorLink = onError(
  ({ graphQLErrors, operation, forward, networkError }) => {
    const { login, logout, user } = useAuthStore.getState();

    const unauthenticated = graphQLErrors?.some(
      (err) =>
        err.extensions?.code === "UNAUTHENTICATED" ||
        err.message.includes("Unauthorized") ||
        err.message.includes("Authentication")
    );

    if (unauthenticated) {
      if (!isRefreshing) {
        isRefreshing = true;

        return fromPromise(
          fetch(GRAPHQL_ENDPOINT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: `
              mutation RefreshToken($refreshToken: String!) {
                refreshToken(refreshToken: $refreshToken) {
                  accessToken
                  refreshToken
                  expiresAt
                }
              }
            `,
              variables: {
                refreshToken: useAuthStore.getState().refreshToken,
              },
            }),
          })
            .then((res) => res.json())
            .then((res) => {
              const tokens = res.data?.refreshToken;

              if (!tokens?.accessToken)
                throw new Error("Invalid refresh token");

              login(tokens, user!); // Zustand update
              resolvePendingRequests();
              return tokens.accessToken;
            })
            .catch((err) => {
              console.error("Token refresh failed:", err);
              logout();
              window.location.href = "/auth/login";
              return;
            })
            .finally(() => {
              isRefreshing = false;
            })
        ).flatMap((newAccessToken) => {
          const oldHeaders = operation.getContext().headers;
          operation.setContext({
            headers: {
              ...oldHeaders,
              authorization: `Bearer ${newAccessToken}`,
            },
          });
          return forward(operation);
        });
      } else {
        // Queue the request until refresh is done
        return fromPromise(
          new Promise((resolve) => {
            pendingRequests.push(() => resolve(null));
          })
        ).flatMap(() => forward(operation));
      }
    }

    if (networkError) {
      console.error("Network error:", networkError);
    }

    // Return undefined for non-auth errors to let them bubble up
    return;
  }
);

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
    },
    query: {
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
});
