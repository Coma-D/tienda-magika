import React, { useState, useEffect } from 'react';
import { Star, TrendingUp, Package } from 'lucide-react';
import { Card } from '../../types';
import { CardItem } from '../cards/CardItem';
import { CardDetail } from '../cards/CardDetail';
import { CardFilters } from '../cards/CardFilters';
import { useAuth } from '../../hooks/useAuth';
import { useCollection } from '../../hooks/useCollection';
import { mockCards } from '../../data/mockData';

export const Collection: React.FC = () => {
  const { user } = useAuth();
  const { cards, toggleFavorite, getCollectionStats, addToCollection, removeFromCollection } = useCollection(user?.id);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('Todas');
  const [selectedColor, setSelectedColor] = useState('Todos');
  const [selectedType, setSelectedType] = useState('Todos');
  const [selectedSet, setSelectedSet] = useState('Todos');

  useEffect(() => {
    if (cards.length === 0 && user) {
      mockCards.slice(0, 3).forEach(card => {
        addToCollection(card);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const filteredCards = cards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = selectedRarity === 'Todas' || card.rarity === selectedRarity;
    const matchesColor = selectedColor === 'Todos' || card.color === selectedColor;
    const matchesType = selectedType === 'Todos' || card.type === selectedType;
    const matchesSet = selectedSet === 'Todos' || card.set === selectedSet;

    return matchesSearch && matchesRarity && matchesColor && matchesType && matchesSet;
  });

  const stats = getCollectionStats();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Mi Colección</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Cartas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCards}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sets Completos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completeSets}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Favoritas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.favoriteCards}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CardFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedRarity={selectedRarity}
        onRarityChange={setSelectedRarity}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedSet={selectedSet}
        onSetChange={setSelectedSet}
      />

      <div className="bg-white rounded-lg shadow-sm p-6">
        {filteredCards.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Tu colección está vacía</p>
            <p className="text-gray-400">Agrega cartas desde el catálogo para comenzar</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredCards.map((card) => (
              <div key={card.id}>
                <CardItem
                  card={card}
                  onClick={() => setSelectedCard(card)}
                  isFavorite={card.isFavorite}
                  showFavorite={true}
                  onToggleFavorite={() => toggleFavorite(card.id)}
                  collectionQuantity={card.quantity}
                  onRemove={() => removeFromCollection(card.id)}
                  onAddToCollection={() => addToCollection(card)} // <--- ESTO ACTIVA EL BOTÓN "+"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <CardDetail
        card={selectedCard}
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
      />
    </div>
  );
};