import React, { useState } from 'react';
import { HelpCircle, Send, CheckCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { faqData } from '../../data/mockData';

export const Support: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'faq' | 'contact'>('faq');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitted(true);
    setIsSubmitting(false);
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  const handleInputChange = (field: string, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Ticket enviado!</h1>
          <p className="text-gray-600 mb-6">
            Hemos recibido tu consulta y nuestro equipo de soporte se pondrá en contacto contigo pronto.
          </p>
          <Button onClick={() => setIsSubmitted(false)} variant="outline">
            Enviar otra consulta
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Centro de Soporte</h1>
        <p className="text-gray-600">¿Necesitas ayuda? Estamos aquí para asistirte</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('faq')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'faq'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <HelpCircle className="h-5 w-5 inline mr-2" />
              Preguntas Frecuentes
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'contact'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Send className="h-5 w-5 inline mr-2" />
              Contactar Soporte
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'faq' ? (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Preguntas Frecuentes</h2>
            <p className="text-gray-600 mt-1">Encuentra respuestas rápidas a las consultas más comunes</p>
          </div>
          <div className="divide-y divide-gray-200">
            {faqData.map((faq, index) => (
              <div key={index} className="p-6">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                  {expandedFaq === index ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="mt-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Contactar Soporte</h2>
            <p className="text-gray-600 mt-1">Describe tu problema y nuestro equipo te ayudará</p>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nombre completo"
                value={contactForm.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
              <Input
                label="Correo electrónico"
                type="email"
                value={contactForm.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            <Input
              label="Asunto"
              value={contactForm.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="Describe brevemente tu consulta"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje
              </label>
              <textarea
                value={contactForm.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Describe detalladamente tu problema o consulta..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={6}
                required
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">¿Cómo podemos ayudarte mejor?</h3>
              <p className="text-sm text-gray-600">
                • Describe el problema paso a paso<br/>
                • Incluye capturas de pantalla si es necesario<br/>
                • Menciona el navegador y dispositivo que usas<br/>
                • Proporciona cualquier mensaje de error que hayas visto
              </p>
            </div>

            <Button type="submit" loading={isSubmitting} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Enviar ticket de soporte
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};