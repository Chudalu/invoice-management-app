import { useSocket } from '@/hooks/userSocket';
import { useState } from 'react';

export default function NotificationBell() {
    const { notifications } = useSocket();
    const [show, setShow] = useState(false);

    return (
        <div className="relative">
            <button onClick={() => setShow(!show)} className="bg-blue-500 text-white px-3 py-1 rounded">
                🔔 {notifications.length}
            </button>
            {show && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg p-3 rounded">
                    {notifications.length > 0 ? (
                        notifications.map((note, index) => (
                            <p key={index} className="text-sm border-b py-1">
                                {note}
                            </p>
                        ))
                    ) : (
                        <p className="text-sm">No notifications</p>
                    )}
                </div>
            )}
        </div>
    );
}
