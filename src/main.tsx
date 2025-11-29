import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; // Importar CartProvider

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider> {/* Envolver la app AQUÍ */}
        <App />
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);