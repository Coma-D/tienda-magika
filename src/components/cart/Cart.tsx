import React from 'react';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCart } from '../../hooks/useCart';

interface CartProps {
  onCheckout: () => void;
  onNavigateToCatalog?: () => void; // Opcional: para navegar al catálogo si está vacío
}

export const Cart: React.FC<CartProps> = ({ onCheckout }) => {
  const { items, updateQuantity, removeFromCart, total } = useCart();

  const formatCLP = (price: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-100 mb-8">Tu Carrito</h1>
        <div className="bg-gray-900 rounded-3xl shadow-2xl border border-gray-800 p-12 text-center relative overflow-hidden group">
          {/* Efecto de fondo ambiental */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -z-10 group-hover:bg-blue-600/20 transition-all duration-700"></div>

          <div className="flex flex-col items-center justify-center z-10 relative">
            <div className="bg-gray-800/80 p-8 rounded-full mb-6 ring-1 ring-white/10 shadow-xl backdrop-blur-sm">
              <ShoppingCart className="h-16 w-16 text-blue-400" />
            </div>
            
            <h2 className="text-4xl font-extrabold mb-4 text-white tracking-tight">
              Tu carrito está <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">vacío</span>
            </h2>
            
            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
              Parece que aún no has descubierto tu próxima carta favorita. 
              Explora el multiverso y encuentra las mejores adiciones para tu mazo.
            </p>
            
            <Button 
              onClick={() => window.location.href = '/'} // O usar la función de navegación si se pasa como prop
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-xl shadow-lg shadow-blue-900/30 text-lg transition-all transform hover:scale-105 hover:shadow-blue-500/25 flex items-center"
            >
              Explorar el Catálogo <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900">Carrito de Compras</h1>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.card.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <img
                  src={item.card.image}
                  alt={item.card.name}
                  className="w-16 h-16 object-cover rounded"
                />
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.card.name}</h3>
                  <p className="text-sm text-gray-600">{item.card.set}</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCLP(item.card.price)}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.card.id, item.quantity - 1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-3 py-1 bg-gray-100 rounded">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.card.id, item.quantity + 1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="text-right min-w-[100px]">
                  <p className="font-semibold text-gray-900">
                    {formatCLP(item.card.price * item.quantity)}
                  </p>
                </div>
                
                <button
                  onClick={() => removeFromCart(item.card.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-green-600">
                {formatCLP(total)}
              </span>
            </div>
            <Button onClick={onCheckout} className="w-full" size="lg">
              Finalizar compra
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};