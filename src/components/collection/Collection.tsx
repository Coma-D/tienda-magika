import React, { useState } from 'react';
import { Star, TrendingUp, Package, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { Card, CollectionCard } from '../../types';
import { CardItem } from '../cards/CardItem';
import { CardDetail } from '../cards/CardDetail';
import { CardFilters } from '../cards/CardFilters';
import { AddCardForm } from '../cards/AddCardForm'; 
import { CollectionState } from '../../hooks/useCollection';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { formatCLP } from '../../utils/format';

interface CollectionProps {
  catalogSets?: string[];
  collection: CollectionState;
}

export const Collection: React.FC<CollectionProps> = ({ catalogSets = [], collection }) => {
  const { 
    cards, toggleFavorite, getCollectionStats, addToCollection, 
    removeQuantityFromCollection, updateCollectionCard 
  } = collection;

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [deletingCard, setDeletingCard] = useState<CollectionCard | null>(null);
  const [deleteQuantity, setDeleteQuantity] = useState(1);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('Todas');
  const [selectedColor, setSelectedColor] = useState('Todos');
  const [selectedType, setSelectedType] = useState('Todos');
  const [selectedSet, setSelectedSet] = useState('Todos');
  const [selectedCondition, setSelectedCondition] = useState('Todas');

  const collectionSets = Array.from(new Set(cards.map(card => card.set))).sort();

  const filteredCards = cards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = selectedRarity === 'Todas' || card.rarity === selectedRarity;
    const matchesColor = selectedColor === 'Todos' || card.color === selectedColor;
    const matchesType = selectedType === 'Todos' || card.type === selectedType;
    const matchesSet = selectedSet === 'Todos' || card.set === selectedSet;
    const cardCondition = card.condition || 'Mint';
    const matchesCondition = selectedCondition === 'Todas' || cardCondition === selectedCondition;
    const matchesFavorite = !showFavoritesOnly || card.isFavorite;

    return matchesSearch && matchesRarity && matchesColor && matchesType && matchesSet && matchesCondition && matchesFavorite;
  });

  const stats = getCollectionStats();

  const handleAddCustomCard = (newCard: Card) => {
    addToCollection(newCard, 'custom');
    setIsAddModalOpen(false);
  };

  const initiateDelete = (card: CollectionCard) => {
    setDeletingCard(card);
    setDeleteQuantity(1);
  };

  const confirmDelete = () => {
    if (deletingCard) {
      removeQuantityFromCollection(deletingCard.id, deleteQuantity);
      setDeletingCard(null);
      if (selectedCard?.id === deletingCard.id && deleteQuantity >= deletingCard.quantity) {
        setSelectedCard(null);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-100 mb-2">Mi Colección</h1>
            <p className="text-gray-400">Gestiona tu inventario personal de cartas</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20">
            <Plus className="h-5 w-5 mr-2" /> Añadir Carta Propia
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg relative overflow-hidden group">
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-900/10 to-transparent"></div>
            <div className="flex items-center relative z-10">
              <div className="p-3 bg-blue-900/20 rounded-lg mr-4">
                <Package className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Total Cartas</p>
                <p className="text-3xl font-extrabold text-white mt-1">{stats.totalCards}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg relative overflow-hidden group">
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-green-900/10 to-transparent"></div>
            <div className="flex items-center relative z-10">
              <div className="p-3 bg-green-900/20 rounded-lg mr-4">
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Sets Activos</p>
                <p className="text-3xl font-extrabold text-white mt-1">{stats.completeSets}</p>
              </div>
            </div>
          </div>
          <div onClick={() => setShowFavoritesOnly(!showFavoritesOnly)} className={`bg-gray-900 rounded-xl p-6 border shadow-lg relative overflow-hidden group cursor-pointer transition-all duration-300 ${showFavoritesOnly ? 'border-yellow-500 ring-2 ring-yellow-500/30' : 'border-gray-800 hover:border-gray-600'}`}>
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-yellow-900/10 to-transparent"></div>
            <div className="flex items-center relative z-10">
              <div className={`p-3 rounded-lg mr-4 transition-colors ${showFavoritesOnly ? 'bg-yellow-500 text-black' : 'bg-yellow-900/20 text-yellow-500'}`}>
                <Star className={`h-8 w-8 ${showFavoritesOnly ? 'fill-current' : ''}`} />
              </div>
              <div>
                <p className={`text-sm font-medium uppercase tracking-wider ${showFavoritesOnly ? 'text-yellow-400' : 'text-gray-400'}`}>{showFavoritesOnly ? 'Mostrando Favoritas' : 'Favoritas'}</p>
                <p className="text-3xl font-extrabold text-white mt-1">{stats.favoriteCards}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CardFilters
        searchTerm={searchTerm} onSearchChange={setSearchTerm}
        selectedRarity={selectedRarity} onRarityChange={setSelectedRarity}
        selectedColor={selectedColor} onColorChange={setSelectedColor}
        selectedType={selectedType} onTypeChange={setSelectedType}
        selectedSet={selectedSet} onSetChange={setSelectedSet}
        selectedCondition={selectedCondition} onConditionChange={setSelectedCondition}
        availableSets={collectionSets.length > 0 ? collectionSets : undefined}
      />

      <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6 min-h-[400px]">
        {filteredCards.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="bg-gray-800 p-6 rounded-full mb-6">
              {showFavoritesOnly ? <Star className="h-16 w-16 text-yellow-600" /> : <Package className="h-16 w-16 text-gray-600" />}
            </div>
            <h3 className="text-xl font-bold text-gray-300 mb-2">{showFavoritesOnly ? 'No tienes cartas favoritas' : 'Tu colección está vacía'}</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">{showFavoritesOnly ? 'Marca algunas cartas como favoritas para verlas aquí.' : 'Aún no has añadido cartas. Puedes añadir tus propias cartas o buscar en el catálogo.'}</p>
            {!showFavoritesOnly && (
              <div className="flex gap-4">
                <Button onClick={() => window.location.href = '/'} className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-lg">Ir al Catálogo</Button>
                <Button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg"><Plus className="h-5 w-5 mr-2" /> Añadir Manualmente</Button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredCards.map((card) => (
              <div key={card.id} className="relative">
                <CardItem
                  card={card} onClick={() => setSelectedCard(card)}
                  isFavorite={card.isFavorite} showFavorite={true}
                  onToggleFavorite={() => toggleFavorite(card.id)}
                  collectionQuantity={card.quantity}
                  onRemove={() => initiateDelete(card)}
                  onAddToCollection={() => addToCollection(card)}
                  showPrice={false} 
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <CardDetail
        card={selectedCard} isOpen={!!selectedCard} onClose={() => setSelectedCard(null)}
        onAddToCollection={addToCollection} onEditCard={updateCollectionCard}
        onDeleteCard={() => selectedCard && initiateDelete(selectedCard as CollectionCard)}
        availableSets={catalogSets}
      />

      <AddCardForm isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddCustomCard} availableSets={catalogSets.length > 0 ? catalogSets : ['Colección Básica 2024']} />

      <Modal isOpen={!!deletingCard} onClose={() => setDeletingCard(null)} className="max-w-sm !bg-gray-900 border border-gray-800" showCloseButton={false}>
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-900/30 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-100 mb-2">Eliminar Carta</h3>
          <p className="text-gray-400 mb-6 text-sm">¿Estás seguro de que quieres eliminar <span className="font-bold text-white">"{deletingCard?.name}"</span> de tu colección?</p>
          {deletingCard && deletingCard.quantity > 1 && (
            <div className="bg-gray-800/50 p-4 rounded-lg mb-6 border border-gray-700">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 text-left">Cantidad a eliminar</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setDeleteQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-700 text-white hover:bg-gray-600">-</button>
                <div className="flex-1 text-center"><span className="text-xl font-bold text-white">{deleteQuantity}</span><span className="text-gray-500 text-sm ml-1">/ {deletingCard.quantity}</span></div>
                <button onClick={() => setDeleteQuantity(q => Math.min(deletingCard.quantity, q + 1))} className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-700 text-white hover:bg-gray-600">+</button>
              </div>
            </div>
          )}
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setDeletingCard(null)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white border-gray-700">Cancelar</Button>
            <Button variant="destructive" onClick={confirmDelete} className="flex-1 bg-red-600 hover:bg-red-700">{deletingCard && deletingCard.quantity > 1 && deleteQuantity < deletingCard.quantity ? `Eliminar ${deleteQuantity}` : 'Eliminar'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};