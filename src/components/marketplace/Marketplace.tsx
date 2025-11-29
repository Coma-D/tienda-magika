import React, { useState } from 'react';
import { Plus, Filter, DollarSign } from 'lucide-react';
import { MarketplaceListing, Card } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { CardDetail } from '../cards/CardDetail';
import { PublishCardForm } from './PublishCardForm';
import { mockListings } from '../../data/mockData';

export const Marketplace: React.FC = () => {
  const [listings] = useState<MarketplaceListing[]>(mockListings);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showPublishForm, setShowPublishForm] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedCondition, setSelectedCondition] = useState('Todas');

  const conditions = ['Todas', 'Mint', 'Near Mint', 'Lightly Played', 'Moderately Played', 'Heavily Played'];

  const formatCLP = (price: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
  };

  const filteredListings = listings.filter(listing => {
    const matchesPrice = (!priceRange.min || listing.price >= parseFloat(priceRange.min)) &&
                         (!priceRange.max || listing.price <= parseFloat(priceRange.max));
    const matchesCondition = selectedCondition === 'Todas' || listing.condition === selectedCondition;
    
    return matchesPrice && matchesCondition;
  });

  const handleBuyCard = (listing: MarketplaceListing) => {
    alert(`¡Has comprado ${listing.card.name} por ${formatCLP(listing.price)}!`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
          <p className="text-gray-600 mt-2">Compra y vende cartas con otros jugadores</p>
        </div>
        <Button onClick={() => setShowPublishForm(true)}>
          <Plus className="h-5 w-5 mr-2" />
          Publicar carta
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 text-gray-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio mínimo
            </label>
            <input
              type="number"
              placeholder="0"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio máximo
            </label>
            <input
              type="number"
              placeholder="100000"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condición
            </label>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {conditions.map(condition => (
                <option key={condition} value={condition}>{condition}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <div key={listing.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
            <div 
              className="cursor-pointer"
              onClick={() => setSelectedCard(listing.card)}
            >
              <img
                src={listing.card.image}
                alt={listing.card.name}
                className="w-full h-48 object-cover"
              />
            </div>
            
            <div className="p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2">{listing.card.name}</h3>
              <div className="flex items-center justify-between mb-3">
                <Badge>{listing.condition}</Badge>
                <span className="text-2xl font-bold text-green-600">
                  {formatCLP(listing.price)}
                </span>
              </div>
              
              <div className="flex items-center mb-4">
                <img
                  src={listing.seller.avatar}
                  alt={listing.seller.name}
                  className="w-8 h-8 rounded-full mr-3"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{listing.seller.name}</p>
                  <p className="text-xs text-gray-500">Vendedor</p>
                </div>
              </div>
              
              <Button
                onClick={() => handleBuyCard(listing)}
                className="w-full"
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
      />
    </div>
  );
};