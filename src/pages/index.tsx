import { useState } from 'react';
import { useRouter } from 'next/router';
import { config, POST } from '@/api-service/api';
import { getUserFromToken, useAuthStore } from '@/store/auth';
import { RoleEnum } from '@/models/enum/role.enum';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const login = useAuthStore((state) => state.login);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        POST('/api/v1/authentication/login',
            {
                body: {
                    email: username,
                    password: password
                }
            }
        ).then((res: any) => {
            if (Number(res.response.status) == 200) {
                login(res.data?.jwtToken);
                config.token = res.data?.jwtToken;
                let user = getUserFromToken(res.data?.jwtToken);
                if (user.role == RoleEnum.ADMIN) router.push('/dashboard');
                else router.push('/invoices');
            } else {
                let error = Array.isArray(res.error?.message) ? (res.error?.message).join(', ') : res.error?.message;
                setError(error);
            }
        }).catch((res: any) => {
            alert('Failed to login, please try again later');
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md">
                <h1 className="text-xl font-bold mb-4 text-center">Invoice Management Service</h1><br />
                <h2 className="text-xl font-bold mb-4">Login</h2>
                {error && <p className="text-red-500">{error}</p>}
                <input
                    type="text"
                    placeholder="Email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                    Login
                </button>
            </form>
        </div>
    );
}
