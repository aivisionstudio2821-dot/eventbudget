import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { VendorAdminDashboard } from './components/admin/VendorAdminDashboard';

const RootView = () => window.location.pathname === '/admin'
  ? <VendorAdminDashboard />
  : <App />;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootView />
  </StrictMode>,
);
