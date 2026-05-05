import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '@/components/providers/auth-provider';
import { toast } from 'sonner';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api/v1', '') : 'http://localhost:5000';

export const useSocket = () => {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (user && !socket) {
            const newSocket = io(SOCKET_URL, {
                withCredentials: true,
            });

            newSocket.on('connect', () => {
                console.log('Connected to socket server');
                newSocket.emit('join', user.id || user._id);
            });

            newSocket.on('notification', (data) => {
                console.log('Received notification:', data);
                toast(data.message || 'New update available!', {
                    description: `Type: ${data.type}`,
                });
            });

            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
            };
        }
    }, [user]);

    return socket;
};
