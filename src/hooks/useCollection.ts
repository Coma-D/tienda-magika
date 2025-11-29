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

  // Función auxiliar para generar una firma única de la carta basada en sus propiedades.
  // Esto asegura que si cambia CUALQUIER cosa (condición, precio, set), se trate como una carta distinta.
  const getCardSignature = (card: Card | CollectionCard) => {
    return JSON.stringify({
      // Usamos el ID original del catálogo como parte de la firma, 
      // pero si es una carta de colección ya tiene un ID único, así que comparamos propiedades base.
      // Para ser consistentes, comparamos los datos visuales/funcionales:
      catalogId: card.id.split('-')[0], // Intento de mantener la referencia base si el ID ya fue modificado
      name: card.name,
      set: card.set,
      condition: card.condition || 'Mint', // Valor por defecto importante
      price: card.price,
      rarity: card.rarity,
      color: card.color,
      type: card.type,
      manaCoat: card.manaCoat,
      image: card.image,
      description: card.description
    });
  };

  const addToCollection = (card: Card) => {
    setCards(prevCards => {
      // Calculamos la firma de la carta que queremos añadir
      const signatureToAdd = getCardSignature(card);

      // Buscamos si ya existe una carta con EXACTAMENTE la misma firma
      const existingCardIndex = prevCards.findIndex(c => getCardSignature(c) === signatureToAdd);
      
      if (existingCardIndex >= 0) {
        // Si existe idéntica, solo aumentamos la cantidad
        const newCards = [...prevCards];
        newCards[existingCardIndex] = {
          ...newCards[existingCardIndex],
          quantity: (newCards[existingCardIndex].quantity || 1) + 1
        };
        return newCards;
      } else {
        // Si NO existe (es diferente en algo), creamos una nueva entrada.
        // IMPORTANTE: Generamos un nuevo ID único para esta entrada de la colección
        // para evitar conflictos de keys en React si tenemos múltiples variantes de la misma carta base.
        const newCollectionCard: CollectionCard = {
          ...card,
          id: `${card.id}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, // ID Único de Colección
          isFavorite: false,
          addedAt: new Date().toISOString(),
          quantity: 1,
          condition: card.condition || 'Mint'
        };
        return [...prevCards, newCollectionCard];
      }
    });
  };

  const removeFromCollection = (cardId: string) => {
    setCards(prevCards => {
      const existingCard = prevCards.find(c => c.id === cardId);
      
      if (!existingCard) return prevCards;

      if (existingCard.quantity > 1) {
        return prevCards.map(c => 
          c.id === cardId 
            ? { ...c, quantity: c.quantity - 1 }
            : c
        );
      }

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