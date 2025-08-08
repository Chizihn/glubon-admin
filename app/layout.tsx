import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ApolloProviderWrapper } from "@/components/ApolloProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Glubon Admin Dashboard",
  description: "Admin dashboard for Glubon property rental platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloProviderWrapper>{children}</ApolloProviderWrapper>
      </body>
    </html>
  );
}
