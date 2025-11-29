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
  selectedCondition?: string;
  onConditionChange?: (value: string) => void;
  onAddCard?: () => void;
  availableSets?: string[];
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
  selectedCondition,
  onConditionChange,
  onAddCard,
  availableSets = []
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

  const conditions = [
    { value: 'Todas', label: 'Todas las Condiciones' },
    { value: 'Mint', label: 'Nueva' },
    { value: 'Near Mint', label: 'Casi Nueva' },
    { value: 'Lightly Played', label: 'Ligeramente Jugada' },
    { value: 'Moderately Played', label: 'Moderadamente Jugada' },
    { value: 'Heavily Played', label: 'Muy Jugada' }
  ];

  const setsToUse = availableSets.length > 0 ? availableSets : ['Colección Básica 2024'];

  const darkInputClasses = "bg-gray-800 border-gray-700 text-gray-200 focus:border-blue-500 placeholder-gray-500";
  const darkSelectClasses = "w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-gray-200";

  // Lógica dinámica para el grid: 6 columnas si hay condición, 5 si no la hay.
  const hasConditionFilter = selectedCondition && onConditionChange;
  const gridColsClass = hasConditionFilter ? "lg:grid-cols-6" : "lg:grid-cols-5";

  return (
    <div className="bg-gray-900 rounded-xl shadow-md border border-gray-800 p-6 mb-6">
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridColsClass} gap-4`}>
        
        {/* El buscador ocupa su espacio natural */}
        <div className="w-full">
          <Input
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={darkInputClasses}
          />
        </div>
        
        <div>
          <select
            value={selectedRarity}
            onChange={(e) => onRarityChange(e.target.value)}
            className={darkSelectClasses}
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
            className={darkSelectClasses}
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
            className={darkSelectClasses}
          >
            {types.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Renderizado condicional del filtro de Condición */}
        {hasConditionFilter && (
          <div>
            <select
              value={selectedCondition}
              onChange={(e) => onConditionChange(e.target.value)}
              className={darkSelectClasses}
            >
              {conditions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center gap-2">
          <select
            value={selectedSet}
            onChange={(e) => onSetChange(e.target.value)}
            className={`${darkSelectClasses} flex-1 min-w-0`}
          >
            <option value="Todos">Todas las Ediciones</option>
            {setsToUse.map(set => (
              <option key={set} value={set}>{set}</option>
            ))}
          </select>
          
          {onAddCard && (
            <Button 
              onClick={onAddCard} 
              className="px-3 py-2 shadow-sm flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white border-none"
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