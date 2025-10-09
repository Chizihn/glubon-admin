"use client";

import { apolloClient } from "@/lib/apolloClient";
import { ApolloProvider } from "@apollo/client";
import { Toaster } from "sonner";

export function ApolloProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ApolloProvider client={apolloClient}>
      <Toaster position="top-right" />
      {children}
    </ApolloProvider>
  );
}
