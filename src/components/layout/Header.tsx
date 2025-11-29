import React, { useState } from 'react';
import { ShoppingCart, Menu, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useNotification } from '../../hooks/useNotification';
import { NAV_ITEMS } from '../../data/constants'; // Importar constantes

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, onToggleMobileMenu }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { items } = useCart();
  const { notifications, unreadCount, markAsRead } = useNotification();
  const [showNotifications, setShowNotifications] = useState(false);

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

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
                Tienda Magika
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
            <button onClick={onToggleMobileMenu} className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-200">
              <Menu className="h-5 w-5" />
            </button>
            <h1 onClick={() => onNavigate('catalog')} className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent cursor-pointer">
              Tienda Magika
            </h1>
          </div>

          <nav className="hidden md:flex space-x-8">
            {/* Renderizado dinámico desde constantes */}
            {NAV_ITEMS.map((item) => (
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
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-300">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && <span className="absolute top-1 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-gray-900"></span>}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="p-3 border-b border-gray-800 bg-gray-800/50"><h3 className="text-sm font-bold text-gray-200">Notificaciones</h3></div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-sm">No tienes notificaciones</div>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif.id} className={`p-3 border-b border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer ${!notif.read ? 'bg-blue-900/10' : ''}`} onClick={() => markAsRead(notif.id)}>
                          <p className={`text-sm ${!notif.read ? 'text-white font-semibold' : 'text-gray-400'}`}>{notif.message}</p>
                          <span className="text-xs text-gray-600 mt-1 block">{notif.date}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => onNavigate('cart')} className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-300">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border border-gray-900 shadow-sm">{cartItemCount}</span>}
            </button>

            <div className="flex items-center space-x-2">
              <img src={user?.avatar} alt={user?.name} className="h-8 w-8 rounded-full border border-gray-700" />
              <span className="hidden sm:block text-sm font-medium text-gray-300">{user?.name}</span>
              <button onClick={handleLogout} className="p-2 hover:bg-gray-800 rounded-lg transition-colors" title="Cerrar sesión">
                <LogOut className="h-4 w-4 text-gray-400 hover:text-gray-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};