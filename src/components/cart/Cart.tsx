import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCart } from '../../hooks/useCart';

interface CartProps {
  onCheckout: () => void;
}

export const Cart: React.FC<CartProps> = ({ onCheckout }) => {
  const { items, updateQuantity, removeFromCart, total } = useCart();

  const formatCLP = (price: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Carrito de Compras</h1>
          <p className="text-gray-600 mb-6">Tu carrito está vacío</p>
          <p className="text-gray-500">Agrega algunas cartas desde el catálogo</p>
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