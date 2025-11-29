import React, { useState, useEffect } from 'react';
import { Plus, Filter, DollarSign } from 'lucide-react';
import { MarketplaceListing, Card } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { CardDetail } from '../cards/CardDetail';
import { PublishCardForm } from './PublishCardForm';
import { useCart } from '../../hooks/useCart';
import { Toast } from '../ui/Toast';

interface MarketplaceProps {
  listings: MarketplaceListing[];
  onAddListing: (listing: MarketplaceListing) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ listings, onAddListing }) => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showPublishForm, setShowPublishForm] = useState(false);
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('Todas');
  const [selectedColor, setSelectedColor] = useState('Todos');
  const [selectedType, setSelectedType] = useState('Todos');
  const [selectedSet, setSelectedSet] = useState('Todos');
  
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedCondition, setSelectedCondition] = useState('Todas');

  const [availableSets, setAvailableSets] = useState<string[]>([]);
  
  const rarities = [
    { value: 'Todas', label: 'Todas las Rarezas' },
    { value: 'Common', label: 'Común' },
    { value: 'Uncommon', label: 'Poco común' },
    { value: 'Rare', label: 'Rara' },
    { value: 'Epic', label: 'Épica' },
    { value: 'Legendary', label: 'Legendaria' }
  ];

  const colors = [
    { value: 'Todos', label: 'Todos los Colores' },
    { value: 'White', label: 'Blanco' },
    { value: 'Blue', label: 'Azul' },
    { value: 'Black', label: 'Negro' },
    { value: 'Red', label: 'Rojo' },
    { value: 'Green', label: 'Verde' },
    { value: 'Colorless', label: 'Incoloro' }
  ];

  const types = [
    { value: 'Todos', label: 'Todos los Tipos' },
    { value: 'Creature', label: 'Criatura' },
    { value: 'Spell', label: 'Hechizo' },
    { value: 'Artifact', label: 'Artefacto' },
    { value: 'Land', label: 'Tierra' }
  ];

  const conditions = ['Todas', 'Mint', 'Near Mint', 'Lightly Played', 'Moderately Played', 'Heavily Played'];
  
  const conditionTranslations: Record<string, string> = {
    'Todas': 'Todas las Condiciones',
    'Mint': 'Nueva',
    'Near Mint': 'Casi Nueva',
    'Lightly Played': 'Ligeramente Jugada',
    'Moderately Played': 'Moderadamente Jugada',
    'Heavily Played': 'Muy Jugada'
  };
  
  useEffect(() => {
    const savedSets = localStorage.getItem('availableSets');
    if (savedSets) {
      setAvailableSets(JSON.parse(savedSets));
    } else {
      setAvailableSets([
        'Colección Básica 2024', 'Alpha', 'Beta', 'Unlimited', 
        'Arabian Nights', 'Antiquities', 'Legends', 'The Dark'
      ]);
    }
  }, []);

  const formatCLP = (price: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.card.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = selectedRarity === 'Todas' || listing.card.rarity === selectedRarity;
    const matchesColor = selectedColor === 'Todos' || listing.card.color === selectedColor;
    const matchesType = selectedType === 'Todos' || listing.card.type === selectedType;
    const matchesSet = selectedSet === 'Todos' || listing.card.set === selectedSet;

    const matchesPrice = (!priceRange.min || listing.price >= parseFloat(priceRange.min)) &&
                         (!priceRange.max || listing.price <= parseFloat(priceRange.max));
    const matchesCondition = selectedCondition === 'Todas' || listing.condition === selectedCondition;
    
    return matchesSearch && matchesRarity && matchesColor && matchesType && matchesSet && matchesPrice && matchesCondition;
  });

  const handleBuyCard = (listing: MarketplaceListing) => {
    // IMPORTANTE: Pasamos la condición del listing a la carta
    // para que al llegar a "Mi Colección" se guarde con el estado correcto (ej: Near Mint)
    const cardForCart = { 
      ...listing.card, 
      price: listing.price,
      condition: listing.condition 
    };
    
    addToCart(cardForCart, 1);
    setShowToast(true);
  };

  const darkInputClasses = "w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-gray-200 placeholder-gray-500";

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Marketplace</h1>
          <p className="text-gray-400 mt-2">Compra y vende cartas con otros jugadores</p>
        </div>
        <Button 
          onClick={() => setShowPublishForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20 font-bold"
        >
          <Plus className="h-5 w-5 mr-2" />
          Publicar carta
        </Button>
      </div>

      <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6 mb-8">
        <div className="flex items-center mb-6 text-gray-200">
          <Filter className="h-5 w-5 mr-2 text-blue-400" />
          <h2 className="text-lg font-semibold">Filtros de Compra</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div>
            <Input
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 border-gray-700 text-gray-200 focus:border-blue-500 placeholder-gray-500"
            />
          </div>
          
          <div>
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className={darkInputClasses}
            >
              {rarities.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className={darkInputClasses}
            >
              {colors.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className={darkInputClasses}
            >
              {types.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedSet}
              onChange={(e) => setSelectedSet(e.target.value)}
              className={darkInputClasses}
            >
              <option value="Todos">Todas las Ediciones</option>
              {availableSets.map(set => (
                <option key={set} value={set}>{set}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">
              Precio mínimo
            </label>
            <input
              type="number"
              placeholder="0"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              className={darkInputClasses}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">
              Precio máximo
            </label>
            <input
              type="number"
              placeholder="100000"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              className={darkInputClasses}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">
              Condición
            </label>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className={darkInputClasses}
            >
              {conditions.map(condition => (
                <option key={condition} value={condition}>{conditionTranslations[condition]}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <div key={listing.id} className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 overflow-hidden hover:shadow-2xl transition-all hover:border-gray-700 group">
            <div 
              className="cursor-pointer relative overflow-hidden"
              onClick={() => setSelectedCard(listing.card)}
            >
              <img
                src={listing.card.image}
                alt={listing.card.name}
                className="w-full h-64 object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80" />
            </div>
            
            <div className="p-6 relative">
              <div className="absolute -top-12 right-4 bg-gray-900/90 backdrop-blur-md px-3 py-1 rounded-lg border border-green-500/30 shadow-lg">
                <span className="text-xl font-bold text-green-400">
                  {formatCLP(listing.price)}
                </span>
              </div>

              <h3 className="font-bold text-xl text-gray-100 mb-2 truncate">{listing.card.name}</h3>
              
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="bg-blue-900/30 text-blue-300 border border-blue-800">
                  {conditionTranslations[listing.condition]}
                </Badge>
                <Badge className="!bg-gray-800 !text-gray-200 !border-gray-600 border font-medium">
                  {listing.card.rarity}
                </Badge>
              </div>
              
              <div className="flex items-center mb-6 p-3 bg-gray-800/50 rounded-lg border border-gray-800">
                <img
                  src={listing.seller.avatar}
                  alt={listing.seller.name}
                  className="w-10 h-10 rounded-full mr-3 border border-gray-600"
                />
                <div>
                  <p className="text-sm font-bold text-gray-200">{listing.seller.name}</p>
                  <p className="text-xs text-gray-500">Vendedor</p>
                </div>
              </div>
              
              <Button
                onClick={() => handleBuyCard(listing)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-10 shadow-lg shadow-green-900/20"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Comprar ahora
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredListings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No se encontraron cartas con los filtros seleccionados</p>
        </div>
      )}

      <CardDetail
        card={selectedCard}
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
      />

      <PublishCardForm
        isOpen={showPublishForm}
        onClose={() => setShowPublishForm(false)}
        availableSets={availableSets}
        onPublish={onAddListing}
      />

      <Toast 
        message="Carta añadida al carrito"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};