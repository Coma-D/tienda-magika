import React from 'react';
import { ShoppingCart, User, Search, Menu, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onToggleMobileMenu
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { items } = useCart();

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const navigation = [
    { id: 'catalog', label: 'Catálogo', show: isAuthenticated },
    { id: 'collection', label: 'Mi Colección', show: isAuthenticated },
    { id: 'marketplace', label: 'Marketplace', show: isAuthenticated },
    { id: 'community', label: 'Comunidad', show: isAuthenticated },
    { id: 'support', label: 'Soporte', show: isAuthenticated },
  ];

  const handleLogout = () => {
    logout();
    onNavigate('auth');
  };

  if (!isAuthenticated) {
    return (
      <header className="bg-gray-900/90 shadow-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                CardTrader
              </h1>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-gray-900/90 backdrop-blur-md shadow-md border-b border-gray-800 sticky top-0 z-40 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-200"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent cursor-pointer"
              onClick={() => onNavigate('catalog')}
            >
              CardTrader
            </h1>
          </div>

          <nav className="hidden md:flex space-x-8">
            {navigation.filter(item => item.show).map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                  currentView === item.id
                    ? 'text-blue-300 bg-blue-900/30'
                    : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('cart')}
              className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-300"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border border-gray-900 shadow-sm">
                  {cartItemCount}
                </span>
              )}
            </button>

            <div className="flex items-center space-x-2">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="h-8 w-8 rounded-full border border-gray-700"
              />
              <span className="hidden sm:block text-sm font-medium text-gray-300">
                {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="h-4 w-4 text-gray-400 hover:text-gray-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};