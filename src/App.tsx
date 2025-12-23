import SettingsPage from './pages/SettingsPage';
import RenderPage from './pages/RenderPage';
import Footer from './components/Footer';

function App() {
  const pathname = window.location.pathname;
  if (pathname === '/render') {
    return <RenderPage />;
  }
  
  return (
    <>
      <SettingsPage />
      <Footer />
    </>
  );
}

export default App;
