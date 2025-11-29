import React, { createContext, useState, ReactNode } from 'react';

export interface Notification {
  id: string;
  userId: string; // ID del usuario que recibe la notificación (ej: vendedor)
  message: string;
  read: boolean;
  date: string;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (userId: string, message: string) => void;
  markAsRead: (id: string) => void;
  unreadCount: number;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // En una app real, aquí filtraríamos por el usuario logueado actualmente.
  // Para este demo, mostramos todas o simulamos que somos el vendedor.
  
  const addNotification = (userId: string, message: string) => {
    const newNotif: Notification = {
      id: Date.now().toString(),
      userId,
      message,
      read: false,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};