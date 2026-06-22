import { type ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/features/auth/context/auth-context";
import { ApiQueryProvider, NextQueryProvider } from "shared-api/react-query";
import { ApiClientProvider } from "shared-api/hooks";
import { apiClient } from "@/shared/api";
import { UploadProvider } from "@/shared/context/UploadContext";
import { Toaster } from "sonner";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <ApiClientProvider value={apiClient}>
        <ApiQueryProvider>
          <UploadProvider>
            <AuthProvider>{children}</AuthProvider>
          </UploadProvider>
        </ApiQueryProvider>
      </ApiClientProvider>
      <Toaster position="bottom-right" richColors />
    </BrowserRouter>
  );
}

