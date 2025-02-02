import Link from 'next/link';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'next/router';
import NotificationBell from './NotificationBell';

export default function Layout({ children }: { children: React.ReactNode; }) {
    const { user, logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white p-5">
                <h2 className="text-2xl font-bold">IMS Admin</h2>
                <nav className="mt-5">
                    <ul>
                        <li className="mb-3">
                            <Link href="/dashboard" className="block p-2 hover:bg-gray-700 rounded">Dashboard</Link>
                        </li>
                        <li className="mb-3">
                            <Link href="/invoices" className="block p-2 hover:bg-gray-700 rounded">Invoices</Link>
                        </li>
                        <li className="mb-3">
                            <Link href="/users" className="block p-2 hover:bg-gray-700 rounded">Users</Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-gray-100 p-5">
                {/* Top Navbar */}
                <div className="flex justify-between items-center bg-white p-3 shadow">
                    <h2 className="text-xl font-bold">Welcome, {user?.userName}</h2>
                    <div className="flex">
                        <NotificationBell />
                        <button onClick={handleLogout} className="bg-red-500 text-white px-3 mx-1 py-1 rounded">Logout</button>
                    </div>
                </div>

                {/* Page Content */}
                <div className="mt-5">{children}</div>
            </main>
        </div>
    );
}
