import React, { useState } from 'react';
import { Send, Users, MessageCircle } from 'lucide-react';
import { ChatMessage, User } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { mockUsers, mockMessages } from '../../data/mockData';
import { useAuth } from '../../hooks/useAuth';

export const Community: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Users list */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-6">
            <Users className="h-5 w-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Usuarios conectados</h2>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => setSelectedUser(null)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                !selectedUser ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <MessageCircle className="h-5 w-5 text-blue-600 mr-3" />
                <span className="font-medium">Chat general</span>
              </div>
            </button>
            
            {mockUsers.map((chatUser) => (
              <button
                key={chatUser.id}
                onClick={() => setSelectedUser(chatUser)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedUser?.id === chatUser.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className="relative">
                    <img
                      src={chatUser.avatar}
                      alt={chatUser.name}
                      className="w-8 h-8 rounded-full"
                    />
                    {chatUser.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{chatUser.name}</p>
                    <p className="text-sm text-gray-500">
                      {chatUser.isOnline ? 'En línea' : 'Desconectado'}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedUser ? `Chat con ${selectedUser.name}` : 'Chat General'}
            </h1>
            <p className="text-gray-600">
              {selectedUser ? 'Conversación privada' : 'Habla con la comunidad CardTrader'}
            </p>
          </div>

          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages
              .filter(msg => {
                if (selectedUser) {
                  return msg.isPrivate && (
                    (msg.sender.id === user?.id && msg.recipient?.id === selectedUser.id) ||
                    (msg.sender.id === selectedUser.id && msg.recipient?.id === user?.id)
                  );
                } else {
                  return !msg.isPrivate;
                }
              })
              .map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender.id === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md ${
                    message.sender.id === user?.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  } rounded-lg p-3`}>
                    {message.sender.id !== user?.id && (
                      <p className="text-sm font-medium mb-1 text-gray-600">
                        {message.sender.name}
                      </p>
                    )}
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender.id === user?.id ? 'text-blue-200' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
          </div>

          <div className="p-6 border-t">
            <form onSubmit={handleSendMessage} className="flex space-x-3">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={selectedUser ? `Mensaje a ${selectedUser.name}...` : 'Escribe un mensaje...'}
                className="flex-1"
              />
              <Button type="submit" disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};