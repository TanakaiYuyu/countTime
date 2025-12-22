import SettingsPage from './pages/SettingsPage';
import RenderPage from './pages/RenderPage';
import Footer from './components/Footer';

/**
 * TelemetryOS App Entry Point
 * 
 * TelemetryOS automatically routes to:
 * - /settings in Studio (configuration UI)
 * - /render in playlists (on-screen display)
 * 
 * No internal routing needed - each mount point is standalone.
 */
function App() {
  const pathname = window.location.pathname;

  // Render based on current path - TelemetryOS handles routing
  if (pathname === '/render') {
    return <RenderPage />;
  }

  // Default to settings (also handles /settings explicitly)
  return (
    <>
      <SettingsPage />
      <Footer />
    </>
  );
}

export default App;
