import React, { useState } from 'react';
import { Upload, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';

interface PublishCardFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PublishCardForm: React.FC<PublishCardFormProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardName: '',
    price: '',
    condition: 'Near Mint',
    description: '',
    imageUrl: ''
  });

  const conditions = ['Mint', 'Near Mint', 'Lightly Played', 'Moderately Played', 'Heavily Played'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setStep('success');
    setLoading(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    setStep('form');
    setFormData({
      cardName: '',
      price: '',
      condition: 'Near Mint',
      description: '',
      imageUrl: ''
    });
    onClose();
  };

  if (step === 'success') {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} className="max-w-md">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Carta publicada!</h2>
          <p className="text-gray-600 mb-6">
            Tu carta ha sido publicada en el marketplace y está disponible para la venta.
          </p>
          <Button onClick={handleClose} className="w-full">
            Continuar
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Publicar Carta" className="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Nombre de la carta"
          value={formData.cardName}
          onChange={(e) => handleChange('cardName', e.target.value)}
          placeholder="Ej: Lightning Bolt"
          required
        />

        <Input
          label="Precio (USD)"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => handleChange('price', e.target.value)}
          placeholder="0.00"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condición
          </label>
          <select
            value={formData.condition}
            onChange={(e) => handleChange('condition', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            {conditions.map(condition => (
              <option key={condition} value={condition}>{condition}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción (opcional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe el estado de la carta, detalles adicionales..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Foto de la carta
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              Arrastra una imagen aquí o haz clic para seleccionar
            </p>
            <input type="file" className="hidden" accept="image/*" />
          </div>
        </div>

        <Button type="submit" loading={loading} className="w-full">
          Publicar carta
        </Button>
      </form>
    </Modal>
  );
};