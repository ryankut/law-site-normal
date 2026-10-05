import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, lazy } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { BookConsultation } from '@/pages/BookConsultation';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { ClientPortal } from '@/pages/ClientPortal';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { useAuthStore } from '@/store/authStore';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminComingSoon } from '@/components/admin/AdminComingSoon';
import { PracticeAreasAdmin } from '@/pages/admin/PracticeAreasAdmin';
import { MatterTypesAdmin } from '@/pages/admin/MatterTypesAdmin';
import { TeamMembersAdmin } from '@/pages/admin/TeamMembersAdmin';
import { FaqsAdmin } from '@/pages/admin/FaqsAdmin';
import { NewsCategoriesAdmin } from '@/pages/admin/NewsCategoriesAdmin';
import { NewsArticlesAdmin } from '@/pages/admin/NewsArticlesAdmin';
import { ClientLogosAdmin } from '@/pages/admin/ClientLogosAdmin';
import { ResourcesAdmin } from '@/pages/admin/ResourcesAdmin';
import { NewsletterAdmin } from '@/pages/admin/NewsletterAdmin';
import { ContactAdmin } from '@/pages/admin/ContactAdmin';
import { SettingsAdmin } from '@/pages/admin/SettingsAdmin';
import './index.css';

const HomePage = lazy(() => import('@/pages/HomePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const PracticeAreasPage = lazy(() => import('@/pages/PracticeAreasPage'));
const BlogPage = lazy(() => import('@/pages/BlogPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));
const NewsArticlePage = lazy(() => import('@/pages/NewsArticlePage'));
const ResourcesPage = lazy(() => import('@/pages/ResourcesPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role || '')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'CLIENT' ? '/portal' : '/admin'} replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const { loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <Routes>
      {/* Public Routes - harringtonandco shell */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/practice" element={<PracticeAreasPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<NewsArticlePage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/book-consultation" element={<BookConsultation />} />
      </Route>

      {/* Auth Routes - no site chrome */}
      <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
      <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />

      {/* Client Portal */}
      <Route path="/portal" element={<ProtectedRoute allowedRoles={['CLIENT']}><ClientPortal /></ProtectedRoute>} />
      <Route path="/portal/*" element={<ProtectedRoute allowedRoles={['CLIENT']}><ClientPortal /></ProtectedRoute>} />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'ATTORNEY']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="practice-areas" element={<PracticeAreasAdmin />} />
        <Route path="matter-types" element={<MatterTypesAdmin />} />
        <Route path="team-members" element={<TeamMembersAdmin />} />
        <Route path="faqs" element={<FaqsAdmin />} />
        <Route path="news-categories" element={<NewsCategoriesAdmin />} />
        <Route path="news-articles" element={<NewsArticlesAdmin />} />
        <Route path="client-logos" element={<ClientLogosAdmin />} />
        <Route path="resources" element={<ResourcesAdmin />} />
        <Route path="newsletter" element={<NewsletterAdmin />} />
        <Route path="contact" element={<ContactAdmin />} />
        <Route path="settings" element={<SettingsAdmin />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;