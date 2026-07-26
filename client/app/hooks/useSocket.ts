import { useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';
import { API_BASE } from '../services/api';
import type { Job } from '../types';

type UseSocketOptions = {
  token: string;
  onNewJob: (job: Job) => void;
};

// custom hook for socket.io listeners
export function useSocket({ token, onNewJob }: UseSocketOptions) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(API_BASE, {
      auth: { token },
      withCredentials: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[socket.io] Connected:', socket.id);
    });

    socket.on('new-job', (job: Job) => {
      onNewJob(job);
    });

    socket.on('connection_error', (err) => {
      console.log('[socket.io] Connection error:', err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  return socketRef;
}
