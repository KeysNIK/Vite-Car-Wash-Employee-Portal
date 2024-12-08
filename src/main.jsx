import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import LoginForm from './assets/components/login-block/LoginForm.jsx';
import MainPage from './assets/components/main-page/MainPage.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <StrictMode>
      {isAuthenticated ? <MainPage /> : <LoginForm onLoginSuccess={handleLoginSuccess} />}
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<App />);
