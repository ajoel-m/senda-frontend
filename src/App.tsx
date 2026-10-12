import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';
import { PanicEscapePage } from './pages/PanicEscapePage';
import { PreventionCenterPage } from './pages/PreventionCenterPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { SourcesPage } from './pages/SourcesPage';
import { NextStepsPage } from './pages/NextStepsPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { EmpresasPage } from './pages/EmpresasPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthModal } from './components/auth/AuthModal';
import { BottomNav } from './components/layout/BottomNav';
import { TrustFeedbackWidget } from './components/common/TrustFeedbackWidget';
import { RouteBackground } from './components/layout/RouteBackground';

// Componente para restaurar scroll al cambiar de ruta
const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Da tiempo a que la nueva página renderice antes de buscar el ancla
      const id = hash.replace('#', '');
      const timer = setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
      return () => clearTimeout(timer);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
        <div className="relative flex flex-col min-h-screen text-ink-primary selection:bg-sky-600 selection:text-white pb-16 md:pb-0">
          <RouteBackground />
          {/* Barra de Navegación Cartilla Artesanal */}
          <Navbar />

          {/* Contenido Principal Enrutado */}
          <div className="flex-1">
            <Routes>
              {/* Home Operativo Principal (Mockup Vista 2) */}
              <Route path="/" element={<HomePage />} />
              <Route path="/app" element={<HomePage />} />

              {/* Modo Pánico y Evacuación de Emergencia (Mockup Vista 3) */}
              <Route path="/panico" element={<PanicEscapePage />} />

              {/* Centro de Prevención (Mockup Vista 4) */}
              <Route path="/prevencion" element={<PreventionCenterPage />} />

              {/* Evaluación Estructural (Mockup Vista 5) */}
              <Route path="/evaluar" element={<AssessmentPage />} />

              {/* Landing Informativa Cívica */}
              <Route path="/informacion" element={<LandingPage />} />
              <Route path="/inicio" element={<LandingPage />} />

              {/* Módulos de Soporte e Información */}
              <Route path="/fuentes" element={<SourcesPage />} />
              <Route path="/proximos-pasos" element={<NextStepsPage />} />
              <Route path="/mis-reportes" element={<UserDashboardPage />} />
              <Route path="/empresas" element={<EmpresasPage />} />
              <Route path="/privacidad" element={<PrivacyPolicyPage />} />
              <Route path="/terminos" element={<TermsOfServicePage />} />

              {/* Redirección para cualquier ruta no mapeada */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          {/* Modal Global de Autenticación Google */}
          <AuthModal />

          {/* Barra Inferior Fija para Móviles (Mockup) */}
          <BottomNav />

          {/* Widget Flotante No Invasivo de Evaluación de Confianza (Req 12) */}
          <TrustFeedbackWidget />

          {/* Pie de Página Institucional Común */}
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
  );
};

export default App;
