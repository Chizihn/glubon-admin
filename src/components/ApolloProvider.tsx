import { ApolloProvider } from "@apollo/client";
import { Toaster } from "sonner";
import { apolloClient } from "../lib/apolloClient";

// function AuthInitializer({ children }: { children: React.ReactNode }) {
//   const { initializeAuth, isLoading } = useAuthStore();

//   useEffect(() => {
//     initializeAuth();
//   }, [initializeAuth]);

//   if (isLoading)
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p>Loading</p>
//       </div>
//     );

//   return <> {children} </>;
// }

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
