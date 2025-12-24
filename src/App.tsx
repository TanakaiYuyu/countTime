import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SettingsPage from './pages/SettingsPage';
import RenderPage from './pages/RenderPage';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/render" element={<RenderPage />} />
        <Route
          path="/settings"
          element={
            <>
              <SettingsPage />
              <Footer />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
