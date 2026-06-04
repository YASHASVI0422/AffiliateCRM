import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      setNotifications([]);
      return;
    }

    let socketUrl = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace('/api', '') 
      : 'http://localhost:5000';

    if (!socketUrl || socketUrl.startsWith('/')) {
      socketUrl = window.location.origin;
    }

    const newSocket = io(socketUrl, {
      autoConnect: true,
    });

    newSocket.on('connect', () => {
      newSocket.emit('join', user._id);
    });

    newSocket.on('ticket_reply_received', (data) => {
      const newNotif = {
        id: Math.random().toString(36).substring(2, 9),
        message: data.message || `New reply on ticket ${data.ticketId}`,
        createdAt: new Date(),
        read: false,
        entityType: 'Ticket',
        entityId: data.ticketId
      };
      setNotifications(prev => [newNotif, ...prev].slice(0, 20));
      toast.success(newNotif.message, { duration: 3000 });
    });

    newSocket.on('lead_status_changed', (data) => {
      const newNotif = {
        id: Math.random().toString(36).substring(2, 9),
        message: data.message || `Lead ${data.leadName} status updated to ${data.status}`,
        createdAt: new Date(),
        read: false,
        entityType: 'Lead',
        entityId: data.leadId
      };
      setNotifications(prev => [newNotif, ...prev].slice(0, 20));
      toast.success(newNotif.message, { duration: 3000 });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const clearAll = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <NotificationContext.Provider value={{ notifications, markAsRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
