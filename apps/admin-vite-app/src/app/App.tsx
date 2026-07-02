import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { LayoutPage } from "@/pages/layout/LayoutPage";
import { BannerPage } from "@/pages/banner/BannerPage";
import { AboutPage } from "@/pages/about/AboutPage";
import { WeddingHighlightsPage } from "@/pages/highlights/WeddingHighlightsPage";
import { WeddingReelsPage } from "@/pages/reels/WeddingReelsPage";
import { TraditionalFilmsPage } from "@/pages/films/TraditionalFilmsPage";
import { ContactCtaPage } from "@/pages/contact/ContactCtaPage";
import { ContactInboxPage } from "@/pages/contact/ContactInboxPage";
import { HeaderPage } from "@/pages/header/HeaderPage";
import { FooterConfigPage } from "@/pages/footer/FooterConfigPage";
import { WebPreviewImagePage } from "@/pages/web-preview-image/WebPreviewImagePage";
import { CustomSectionsPage } from "@/pages/custom-sections/CustomSectionsPage";
import { CustomSectionEditorPage } from "@/pages/custom-sections/CustomSectionEditorPage";
import { SectionsHubPage } from "@/pages/sections-hub/SectionsHubPage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { OAuthCallbackPage } from "@/pages/auth/OAuthCallbackPage";
import { VideoLibraryPage } from "@/pages/videos/VideoLibraryPage";
import { useAuth } from "@/features/auth";

function PrivateRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export function App() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="oauth-callback" element={<OAuthCallbackPage />} />
      <Route element={<PrivateRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="layout" element={<LayoutPage />} />
          <Route path="sections">
            <Route index element={<SectionsHubPage />} />
            <Route path="banner" element={<BannerPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="wedding-highlights" element={<WeddingHighlightsPage />} />
            <Route path="wedding-reels" element={<WeddingReelsPage />} />
            <Route path="traditional-films" element={<TraditionalFilmsPage />} />
            <Route path="contact-cta" element={<ContactCtaPage />} />
            <Route path="custom-sections" element={<CustomSectionsPage />} />
            <Route path="custom-sections/:id" element={<CustomSectionEditorPage />} />
          </Route>
          <Route path="header" element={<HeaderPage />} />
          <Route path="footer" element={<FooterConfigPage />} />
          <Route path="og-image" element={<WebPreviewImagePage />} />
          <Route path="contact-inbox" element={<ContactInboxPage />} />
          <Route path="video-library" element={<VideoLibraryPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
