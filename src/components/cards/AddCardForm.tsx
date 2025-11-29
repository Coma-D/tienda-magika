import React, { useState, useRef } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { Card } from '../../types';
import { Upload, Trash2 } from 'lucide-react';

interface AddCardFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (card: Card) => void;
  availableSets?: string[];
  onAddSet?: (newSet: string) => void;
  onDeleteSet?: (set: string) => void;
}

export const AddCardForm: React.FC<AddCardFormProps> = ({ 
  isOpen, 
  onClose, 
  onAdd, 
  availableSets = [], 
  onAddSet,
  onDeleteSet 
}) => {
  const [loading, setLoading] = useState(false);
  const [isCustomSet, setIsCustomSet] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    rarity: 'Common',
    color: 'Colorless',
    type: 'Creature',
    set: 'Colección Básica 2024',
    description: '',
    manaCoat: '0',
    image: '/sp_res5myxp7z.jpg'
  });

  const defaultSets = [
    'Colección Básica 2024', 'Alpha', 'Beta', 'Unlimited', 
    'Arabian Nights', 'Antiquities', 'Legends', 'The Dark'
  ];
  const setsToUse = availableSets.length > 0 ? availableSets : defaultSets;

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSetSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'NEW_CUSTOM_SET') {
      setIsCustomSet(true);
      handleChange('set', '');
    } else {
      setIsCustomSet(false);
      handleChange('set', value);
    }
  };

  const handleDeleteCurrentSet = () => {
    if (isCustomSet || !formData.set || formData.set === 'NEW_CUSTOM_SET') return;
    if (onDeleteSet) {
      onDeleteSet(formData.set);
      handleChange('set', setsToUse[0] || '');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    if (isCustomSet && formData.set.trim() && onAddSet) {
      onAddSet(formData.set);
    }

    const newCard: Card = {
      id: Date.now().toString(),
      name: formData.name,
      image: formData.image,
      rarity: formData.rarity as any,
      color: formData.color as any,
      type: formData.type as any,
      set: formData.set,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      manaCoat: parseInt(formData.manaCoat) || 0,
    };

    onAdd(newCard);
    setLoading(false);
    
    setFormData({
      name: '', price: '', rarity: 'Common', color: 'Colorless', 
      type: 'Creature', set: 'Colección Básica 2024', description: '', 
      manaCoat: '0', image: '/sp_res5myxp7z.jpg'
    });
    setIsCustomSet(false);
    
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Añadir Carta al Catálogo" className="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* SUBIDA DE IMAGEN */}
        <div className="flex justify-center mb-4">
          <div 
            className="relative w-32 h-44 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all overflow-hidden group"
            onClick={() => fileInputRef.current?.click()}
          >
            {formData.image !== '/sp_res5myxp7z.jpg' ? (
              <>
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-bold">Cambiar</span>
                </div>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-xs text-gray-500 text-center px-2">Subir Imagen</span>
              </>
            )}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          </div>
        </div>

        <Input
          label="Nombre de la carta"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Ej: Shivan Dragon"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Precio Mercado (CLP)"
            type="number"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            placeholder="5000"
            required
          />
          <Input
            label="Coste de Maná"
            type="number"
            value={formData.manaCoat}
            onChange={(e) => handleChange('manaCoat', e.target.value)}
            placeholder="0"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rareza</label>
            <select
              value={formData.rarity}
              onChange={(e) => handleChange('rarity', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Common">Común</option>
              <option value="Uncommon">Poco común</option>
              <option value="Rare">Rara</option>
              <option value="Epic">Épica</option>
              <option value="Legendary">Legendaria</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <select
              value={formData.color}
              onChange={(e) => handleChange('color', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="White">Blanco</option>
              <option value="Blue">Azul</option>
              <option value="Black">Negro</option>
              <option value="Red">Rojo</option>
              <option value="Green">Verde</option>
              <option value="Colorless">Incoloro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Creature">Criatura</option>
              <option value="Spell">Hechizo</option>
              <option value="Artifact">Artefacto</option>
              <option value="Land">Tierra</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Edición / Set</label>
          <div className="flex gap-2">
            <select
              value={isCustomSet ? 'NEW_CUSTOM_SET' : formData.set}
              onChange={handleSetSelectChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {setsToUse.map(set => (
                <option key={set} value={set}>{set}</option>
              ))}
              <option disabled>──────────</option>
              <option value="NEW_CUSTOM_SET">+ Crear nueva edición...</option>
            </select>
            {!isCustomSet && onDeleteSet && (
              <button type="button" onClick={handleDeleteCurrentSet} className="p-2 text-red-500 hover:bg-red-50 border border-gray-300 rounded-lg">
                <Trash2 className="h-5 w-5" />
              </button>
            )}
          </div>
          {isCustomSet && <Input value={formData.set} onChange={(e) => handleChange('set', e.target.value)} placeholder="Escribe el nombre de la nueva edición..." autoFocus required className="mt-2" />}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Texto de Reglas</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Descripción de la habilidad..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <Button type="submit" loading={loading} className="w-full">Añadir al Catálogo</Button>
      </form>
    </Modal>
  );
};