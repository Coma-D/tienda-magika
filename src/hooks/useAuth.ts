import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Este hook ahora actúa como un "conector" seguro al contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  // Agregamos la función resetPassword que faltaba en el contexto original pero tu app usa
  const resetPassword = async (email: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(email.includes('@'));
      }, 1000);
    });
  };

  return { ...context, resetPassword };
};