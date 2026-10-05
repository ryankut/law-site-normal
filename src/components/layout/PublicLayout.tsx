import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Newsletter from './Newsletter';
import BackToTop from '@/components/ui/BackToTop';
import ScrollToTop from '@/components/ui/ScrollToTop';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import PageLoader from '@/components/ui/PageLoader';

export function PublicLayout() {
  return (
    <div className="public-site flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <main id="main-content" className="grow">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Newsletter />
      <Footer />
      <BackToTop />
    </div>
  );
}