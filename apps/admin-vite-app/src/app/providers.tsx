import { type ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/features/auth/context/auth-context";
import { ApiQueryProvider, NextQueryProvider } from "shared-api/react-query";
import { ApiClientProvider } from "shared-api/hooks";
import { apiClient } from "@/shared/api";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <ApiClientProvider value={apiClient}>
        <ApiQueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </ApiQueryProvider>
      </ApiClientProvider>
    </BrowserRouter>
  );
}
