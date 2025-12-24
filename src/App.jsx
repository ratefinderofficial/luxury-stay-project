import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

// --- STYLES ---
import './styles/global.css';
import './styles/theme.css';
import './styles/animations.css';

// --- CONTEXT PROVIDERS ---
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';

// --- COMPONENTS ---
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/Common/ErrorBoundary';
import Notification from './components/Common/Notification';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <SocketProvider>
            <NotificationProvider>
              <ThemeProvider>
                <AppRoutes />
                <Notification />
              </ThemeProvider>
            </NotificationProvider>
          </SocketProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;