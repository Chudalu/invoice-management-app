import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/auth';
import { AppConfig } from '@/utils/app.config';
import { NotificationMessageDto } from '@/models/notification-message.dto';

const SOCKET_URL = AppConfig().API_URL;

export const useSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [notifications, setNotifications] = useState<string[]>([]);
    const { user } = useAuthStore();

    useEffect(() => {
        if (!user) return;
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);
        newSocket.on('invoice.status.update', (data: NotificationMessageDto) => {
            if (Number(data.userId) === Number(user.id))
                setNotifications((prev) => [...prev, `Your invoice - ${data.title}, with amount - $${data.amount} has been resolved to ${data.invoiceStatus}`]);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    return { socket, notifications };
};
