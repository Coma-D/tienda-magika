import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Card } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (card: Card, quantity?: number) => void; // Actualizado para aceptar cantidad
  removeFromCart: (cardId: string) => void;
  updateQuantity: (cardId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error loading cart", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Actualizado: Ahora usa la cantidad que le pasemos (por defecto 1)
  const addToCart = (card: Card, quantity: number = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.card.id === card.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.card.id === card.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { card, quantity }];
    });
  };

  const removeFromCart = (cardId: string) => {
    setItems(prevItems => prevItems.filter(item => item.card.id !== cardId));
  };

  const updateQuantity = (cardId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cardId);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.card.id === cardId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + (item.card.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      total
    }}>
      {children}
    </CartContext.Provider>
  );
};