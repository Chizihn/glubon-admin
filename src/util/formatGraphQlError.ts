import { ApolloError } from "@apollo/client";

export function formatGraphQLError(error: unknown): string {
  if (error instanceof ApolloError) {
    // Network error
    if (error.networkError) {
      console.error("[Network Error]:", error.networkError);
      return "A network error occurred. Please check your connection.";
    }

    // GraphQL errors
    if (error.graphQLErrors.length > 0) {
      const messages = error.graphQLErrors.map((err) => {
        if (err.extensions?.code === "UNAUTHENTICATED") {
          return "You are not authorized. Please log in.";
        }
        if (err.extensions?.code === "FORBIDDEN") {
          return "You do not have permission to perform this action.";
        }

        // Generic or custom message
        return err.message;
      });

      return messages.join(" | ");
    }

    return "An unexpected error occurred.";
  }

  // Fallback for non-Apollo errors
  return typeof error === "string" ? error : "An unknown error occurred.";
}
