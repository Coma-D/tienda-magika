import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, MessageCircle, MoreVertical } from 'lucide-react';
import { ChatMessage, User } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { mockUsers, mockMessages } from '../../data/mockData';
import { useAuth } from '../../hooks/useAuth';
import { formatTime } from '../../utils/format';
import { t } from '../../data/constants';

export const Community: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Referencia para el auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al final cuando llegan mensajes nuevos
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: user,
      message: newMessage,
      timestamp: new Date().toISOString(),
      isPrivate: !!selectedUser,
      recipient: selectedUser || undefined
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulación de respuesta automática
    if (!selectedUser) {
      setTimeout(() => {
        const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
        if (randomUser.id !== user.id) {
          const autoReply: ChatMessage = {
            id: (Date.now() + 1).toString(),
            sender: randomUser,
            message: "¡Qué interesante! ¿Alguien tiene cartas de la edición Alpha?",
            timestamp: new Date().toISOString()
          };
          setMessages(prev => [...prev, autoReply]);
        }
      }, 3000);
    }
  };

  // Filtrar mensajes según el contexto (General o Privado)
  const filteredMessages = messages.filter(msg => {
    if (selectedUser) {
      return msg.isPrivate && (
        (msg.sender.id === user?.id && msg.recipient?.id === selectedUser.id) ||
        (msg.sender.id === selectedUser.id && msg.recipient?.id === user?.id)
      );
    } else {
      return !msg.isPrivate;
    }
  });

  // Clases comunes para el tema oscuro
  const darkInputClasses = "bg-gray-800 border-gray-700 text-gray-200 focus:border-blue-500 placeholder-gray-500";

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 h-[calc(100vh-4rem)]">
      <div className="grid lg:grid-cols-4 gap-6 h-full">
        
        {/* LISTA DE USUARIOS (Barra Lateral) */}
        <div className="lg:col-span-1 bg-gray-900 rounded-2xl shadow-lg border border-gray-800 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-800 bg-gray-900">
            <div className="flex items-center text-gray-100 mb-4">
              <Users className="h-5 w-5 mr-2 text-blue-500" />
              <h2 className="font-bold text-lg">Comunidad</h2>
            </div>
            {/* Buscador de usuarios */}
            <Input placeholder={t('Search users')} className={`text-sm ${darkInputClasses}`} />
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            <button
              onClick={() => setSelectedUser(null)}
              className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-center ${
                !selectedUser 
                  ? 'bg-blue-900/30 text-blue-300 shadow-sm ring-1 ring-blue-800' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              <div className={`p-2 rounded-full mr-3 ${!selectedUser ? 'bg-blue-900/50 text-blue-300' : 'bg-gray-800 text-gray-500'}`}>
                <MessageCircle className="h-5 w-5" />
              </div>
              <span className="font-bold text-sm">{t('General Chat')}</span>
            </button>
            
            <div className="pt-4 pb-2 px-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
              {t('Online')}
            </div>

            {mockUsers.filter(u => u.id !== user?.id).map((chatUser) => (
              <button
                key={chatUser.id}
                onClick={() => setSelectedUser(chatUser)}
                className={`w-full text-left p-2 rounded-xl transition-all duration-200 flex items-center group ${
                  selectedUser?.id === chatUser.id 
                    ? 'bg-blue-900/30 text-blue-300 shadow-sm ring-1 ring-blue-800' 
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <div className="relative mr-3">
                  <img src={chatUser.avatar} alt={chatUser.name} className="w-10 h-10 rounded-full object-cover shadow-sm ring-2 ring-gray-800" />
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900 ${chatUser.isOnline ? 'bg-green-500' : 'bg-gray-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{chatUser.name}</p>
                  <p className="text-xs text-gray-500 truncate group-hover:text-blue-400">
                    {chatUser.isOnline ? t('Online') : t('Offline')}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ÁREA DE CHAT */}
        <div className="lg:col-span-3 bg-gray-900 rounded-2xl shadow-lg border border-gray-800 flex flex-col overflow-hidden">
          {/* Header del Chat */}
          <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900 z-10 shadow-sm">
            <div className="flex items-center">
              {selectedUser ? (
                <>
                  <div className="relative mr-3">
                    <img src={selectedUser.avatar} alt={selectedUser.name} className="w-10 h-10 rounded-full object-cover border border-gray-700" />
                    {selectedUser.isOnline && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-900" />}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-100">{selectedUser.name}</h2>
                    <p className="text-xs text-green-500 font-medium flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                      {t('Online')}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-2 bg-blue-900/30 rounded-full mr-3 text-blue-400">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-100">{t('General Chat')}</h2>
                    <p className="text-xs text-gray-500">
                      {mockUsers.length} participantes
                    </p>
                  </div>
                </>
              )}
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-full transition-colors">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>

          {/* Lista de Mensajes */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-black/20 custom-scrollbar">
            {filteredMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-600">
                <MessageCircle className="h-16 w-16 mb-2 opacity-50" />
                <p>No hay mensajes aún. ¡Di hola!</p>
              </div>
            )}
            
            {filteredMessages.map((message) => {
              const isMe = message.sender.id === user?.id;
              return (
                <div key={message.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-[85%] sm:max-w-[75%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar del emisor */}
                    {!isMe && (
                      <img 
                        src={message.sender.avatar} 
                        alt={message.sender.name} 
                        className="w-8 h-8 rounded-full self-end mb-1 mr-2 shadow-sm border border-gray-700"
                      />
                    )}
                    
                    <div>
                      {/* Nombre */}
                      {!isMe && !selectedUser && (
                        <span className="text-xs text-gray-500 ml-1 mb-1 block">
                          {message.sender.name}
                        </span>
                      )}
                      
                      {/* Burbuja */}
                      <div className={`px-4 py-3 rounded-2xl shadow-md relative text-sm leading-relaxed ${
                        isMe 
                          ? 'bg-blue-600 text-white rounded-br-none' 
                          : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-none'
                      }`}>
                        {message.message}
                      </div>
                      
                      {/* Hora */}
                      <span className={`text-[10px] mt-1 block text-gray-500 ${isMe ? 'text-right mr-1' : 'ml-1'}`}>
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-gray-900 border-t border-gray-800">
            <form onSubmit={handleSendMessage} className="flex gap-3 items-center">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={selectedUser ? `Mensaje para ${selectedUser.name}...` : t('Type a message')}
                className="flex-1 rounded-full border-gray-700 bg-gray-800 focus:bg-gray-900 text-gray-200 transition-all shadow-inner focus:border-blue-500 placeholder-gray-500"
              />
              <Button 
                type="submit" 
                disabled={!newMessage.trim()}
                className="rounded-full w-12 h-12 p-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:shadow-none text-white"
              >
                <Send className="h-5 w-5 ml-0.5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};