import React, { useState } from 'react';
import { CreditCard, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useCart } from '../../hooks/useCart';

interface CheckoutProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ onBack, onSuccess }) => {
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    clearCart();
    setStep('success');
    setLoading(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (step === 'success') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Compra exitosa!</h1>
          <p className="text-gray-600 mb-6">
            Tu pedido ha sido procesado correctamente. Recibirás un correo de confirmación con los detalles del envío.
          </p>
          <Button onClick={onSuccess} className="w-full">
            Continuar comprando
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-6">
            <button
              onClick={onBack}
              className="mr-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Información de contacto</h2>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Nombre completo"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
                <Input
                  label="Correo electrónico"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Dirección de envío</h2>
              <div className="space-y-4">
                <Input
                  label="Dirección"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Ciudad"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    required
                  />
                  <Input
                    label="Código postal"
                    value={formData.zipCode}
                    onChange={(e) => handleChange('zipCode', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Información de pago</h2>
              <div className="space-y-4">
                <Input
                  label="Número de tarjeta"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) => handleChange('cardNumber', e.target.value)}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Fecha de vencimiento"
                    placeholder="MM/AA"
                    value={formData.expiryDate}
                    onChange={(e) => handleChange('expiryDate', e.target.value)}
                    required
                  />
                  <Input
                    label="CVV"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={(e) => handleChange('cvv', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg">
              <CreditCard className="h-5 w-5 mr-2" />
              Pagar ${total.toFixed(2)}
            </Button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen del pedido</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.card.id} className="flex items-center space-x-3">
                <img
                  src={item.card.image}
                  alt={item.card.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.card.name}</h3>
                  <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                </div>
                <span className="font-semibold text-gray-900">
                  ${(item.card.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total:</span>
              <span className="text-xl font-bold text-green-600">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};