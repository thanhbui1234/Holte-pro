import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AdminLayout } from "./components/layout/AdminLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { LayoutPage } from "./pages/LayoutPage";
import { BannerPage } from "./pages/BannerPage";
import { AboutPage } from "./pages/AboutPage";
import { WeddingHighlightsPage } from "./pages/WeddingHighlightsPage";
import { WeddingReelsPage } from "./pages/WeddingReelsPage";
import { TraditionalFilmsPage } from "./pages/TraditionalFilmsPage";
import { ContactCtaPage } from "./pages/ContactCtaPage";
import { HeaderPage } from "./pages/HeaderPage";
import { MenuConfigPage } from "./pages/MenuConfigPage";
import { FooterConfigPage } from "./pages/FooterConfigPage";
import { CustomSectionsPage } from "./pages/CustomSectionsPage";
import { CustomSectionEditorPage } from "./pages/CustomSectionEditorPage";
import { SectionsHubPage } from "./pages/SectionsHubPage";
import { ContactInboxPage } from "./pages/ContactInboxPage";
import { LoginPage } from "./pages/LoginPage";
import { OAuthCallbackPage } from "./pages/OAuthCallbackPage";
import { useAuth } from "./context/auth-context";

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
          <Route path="sections" element={<SectionsHubPage />} />
          <Route path="banner" element={<BannerPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="wedding-highlights" element={<WeddingHighlightsPage />} />
          <Route path="wedding-reels" element={<WeddingReelsPage />} />
          <Route path="traditional-films" element={<TraditionalFilmsPage />} />
          <Route path="contact-cta" element={<ContactCtaPage />} />
          <Route path="header" element={<HeaderPage />} />
          <Route path="menu" element={<MenuConfigPage />} />
          <Route path="footer" element={<FooterConfigPage />} />
          <Route path="custom-sections" element={<CustomSectionsPage />} />
          <Route path="custom-sections/:id" element={<CustomSectionEditorPage />} />
          <Route path="contact-inbox" element={<ContactInboxPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
