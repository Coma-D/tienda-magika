import { useState, useEffect } from 'react';
import { CollectionCard, Card } from '../types';

interface CollectionState {
  cards: CollectionCard[];
  addToCollection: (card: Card) => void;
  removeFromCollection: (cardId: string) => void;
  toggleFavorite: (cardId: string) => void;
  getCollectionStats: () => {
    totalCards: number;
    completeSets: number;
    favoriteCards: number;
  };
}

export const useCollection = (userId?: string): CollectionState => {
  const [cards, setCards] = useState<CollectionCard[]>([]);

  useEffect(() => {
    if (userId) {
      const savedCollection = localStorage.getItem(`collection_${userId}`);
      if (savedCollection) {
        setCards(JSON.parse(savedCollection));
      }
    }
  }, [userId]);

  useEffect(() => {
    if (userId && cards.length > 0) {
      localStorage.setItem(`collection_${userId}`, JSON.stringify(cards));
    }
  }, [cards, userId]);

  const addToCollection = (card: Card) => {
    setCards(prevCards => {
      const existingCard = prevCards.find(c => c.id === card.id);
      
      if (existingCard) {
        return prevCards.map(c => 
          c.id === card.id 
            ? { ...c, quantity: (c.quantity || 1) + 1 } 
            : c
        );
      }

      const collectionCard: CollectionCard = {
        ...card,
        isFavorite: false,
        addedAt: new Date().toISOString(),
        quantity: 1
      };
      return [...prevCards, collectionCard];
    });
  };

  // Lógica Modificada: Eliminar de uno en uno
  const removeFromCollection = (cardId: string) => {
    setCards(prevCards => {
      const existingCard = prevCards.find(c => c.id === cardId);
      
      // Si no existe, no hacemos nada
      if (!existingCard) return prevCards;

      // Si tiene más de 1 copia, restamos 1
      if (existingCard.quantity > 1) {
        return prevCards.map(c => 
          c.id === cardId 
            ? { ...c, quantity: c.quantity - 1 }
            : c
        );
      }

      // Si solo queda 1, la eliminamos de la lista
      return prevCards.filter(card => card.id !== cardId);
    });
  };

  const toggleFavorite = (cardId: string) => {
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === cardId ? { ...card, isFavorite: !card.isFavorite } : card
      )
    );
  };

  const getCollectionStats = () => {
    const totalCards = cards.reduce((acc, card) => acc + (card.quantity || 1), 0);
    const sets = new Set(cards.map(card => card.set));
    const completeSets = sets.size;
    const favoriteCards = cards.filter(card => card.isFavorite).length;

    return { totalCards, completeSets, favoriteCards };
  };

  return {
    cards,
    addToCollection,
    removeFromCollection,
    toggleFavorite,
    getCollectionStats
  };
};