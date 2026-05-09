import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

// If VITE_SOCKET_URL is not set, it defaults to the same host in production, or localhost in dev.
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const useSocket = (userId: string | undefined) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    socketRef.current = io(SOCKET_URL);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [userId]);

  return socketRef.current;
};
