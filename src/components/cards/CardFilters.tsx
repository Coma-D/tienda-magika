import React from 'react';
import { Plus } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface CardFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedRarity: string;
  onRarityChange: (value: string) => void;
  selectedColor: string;
  onColorChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  selectedSet: string;
  onSetChange: (value: string) => void;
  onAddCard?: () => void;
  availableSets?: string[]; // Nueva prop opcional
}

export const CardFilters: React.FC<CardFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedRarity,
  onRarityChange,
  selectedColor,
  onColorChange,
  selectedType,
  onTypeChange,
  selectedSet,
  onSetChange,
  onAddCard,
  availableSets = [] // Valor por defecto
}) => {
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

  // Usamos la lista dinámica si existe, si no, usamos un fallback
  const setsToUse = availableSets.length > 0 ? availableSets : ['Colección Básica 2024'];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <Input
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div>
          <select
            value={selectedRarity}
            onChange={(e) => onRarityChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {rarities.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {colors.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {types.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedSet}
            onChange={(e) => onSetChange(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
          >
            <option value="Todos">Todas las Ediciones</option>
            {setsToUse.map(set => (
              <option key={set} value={set}>{set}</option>
            ))}
          </select>
          
          {onAddCard && (
            <Button 
              onClick={onAddCard} 
              className="px-3 py-2 shadow-sm flex-shrink-0"
              title="Añadir nueva carta al catálogo"
            >
              <Plus className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};