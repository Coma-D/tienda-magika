import React, { useState } from 'react';
import { Star, TrendingUp, Package, Plus } from 'lucide-react';
import { Card } from '../../types';
import { CardItem } from '../cards/CardItem';
import { CardDetail } from '../cards/CardDetail';
import { CardFilters } from '../cards/CardFilters';
import { AddCardForm } from '../cards/AddCardForm'; // Importamos el formulario
import { useAuth } from '../../hooks/useAuth';
import { useCollection } from '../../hooks/useCollection';
import { Button } from '../ui/Button';

export const Collection: React.FC = () => {
  const { user } = useAuth();
  const { cards, toggleFavorite, getCollectionStats, addToCollection, removeFromCollection } = useCollection(user?.id);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Estado para modal de añadir
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('Todas');
  const [selectedColor, setSelectedColor] = useState('Todos');
  const [selectedType, setSelectedType] = useState('Todos');
  const [selectedSet, setSelectedSet] = useState('Todos');
  const [selectedCondition, setSelectedCondition] = useState('Todas');

  // Obtener sets disponibles de la colección actual para el filtro
  const availableSets = Array.from(new Set(cards.map(card => card.set))).sort();

  const filteredCards = cards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = selectedRarity === 'Todas' || card.rarity === selectedRarity;
    const matchesColor = selectedColor === 'Todos' || card.color === selectedColor;
    const matchesType = selectedType === 'Todos' || card.type === selectedType;
    const matchesSet = selectedSet === 'Todos' || card.set === selectedSet;
    const cardCondition = card.condition || 'Mint';
    const matchesCondition = selectedCondition === 'Todas' || cardCondition === selectedCondition;

    return matchesSearch && matchesRarity && matchesColor && matchesType && matchesSet && matchesCondition;
  });

  const stats = getCollectionStats();

  // Handler para añadir carta personalizada directamente a la colección
  const handleAddCustomCard = (newCard: Card) => {
    // Al añadir a colección personal, podemos asumir que el usuario la tiene
    addToCollection(newCard);
    setIsAddModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Cabecera y Estadísticas */}
      <div className="mb-10">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-100 mb-2">Mi Colección</h1>
            <p className="text-gray-400">Gestiona tu inventario personal de cartas</p>
          </div>
          {/* Botón principal de añadir también aquí por usabilidad */}
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20"
          >
            <Plus className="h-5 w-5 mr-2" /> Añadir Carta Propia
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Cartas */}
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
          
          {/* Sets Completos (o Variedad) */}
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
          
          {/* Favoritas */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg relative overflow-hidden group">
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-yellow-900/10 to-transparent"></div>
            <div className="flex items-center relative z-10">
              <div className="p-3 bg-yellow-900/20 rounded-lg mr-4">
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Favoritas</p>
                <p className="text-3xl font-extrabold text-white mt-1">{stats.favoriteCards}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
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
        selectedCondition={selectedCondition}
        onConditionChange={setSelectedCondition}
        availableSets={availableSets.length > 0 ? availableSets : undefined}
        // Pasamos la función onAddCard para que aparezca el botón "+" junto a los filtros
        onAddCard={() => setIsAddModalOpen(true)}
      />

      {/* Grid de Cartas */}
      <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6 min-h-[400px]">
        {filteredCards.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="bg-gray-800 p-6 rounded-full mb-6">
              <Package className="h-16 w-16 text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-300 mb-2">Tu colección está vacía</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Aún no has añadido cartas. Puedes añadir tus propias cartas o buscar en el catálogo.
            </p>
            <div className="flex gap-4">
              <Button 
                onClick={() => window.location.reload()} // Ir a catalogo (o usar navegación real)
                className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-lg"
              >
                Ir al Catálogo
              </Button>
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg"
              >
                <Plus className="h-5 w-5 mr-2" /> Añadir Manualmente
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredCards.map((card) => (
              <div key={card.id} className="relative">
                <CardItem
                  card={card}
                  onClick={() => setSelectedCard(card)}
                  isFavorite={card.isFavorite}
                  showFavorite={true}
                  onToggleFavorite={() => toggleFavorite(card.id)}
                  collectionQuantity={card.quantity}
                  onRemove={() => removeFromCollection(card.id)}
                  onAddToCollection={() => addToCollection(card)}
                  showPrice={false} // OCULTAR PRECIO EN COLECCIÓN
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Detalle */}
      <CardDetail
        card={selectedCard}
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        onAddToCollection={addToCollection}
        // No pasamos onAddToCart aquí porque estamos en la colección, no en compra
      />

      {/* Modal para añadir carta personalizada */}
      <AddCardForm 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddCustomCard}
        // Podemos pasar los sets disponibles para facilitar el autocompletado
        availableSets={availableSets.length > 0 ? availableSets : ['Colección Básica 2024']}
      />
    </div>
  );
};