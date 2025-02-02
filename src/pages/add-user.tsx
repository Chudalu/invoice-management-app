import ClientLayout from '../components/ClientLayout';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { config, POST } from '@/api-service/api';

export default function AddUserPage() {
    const router = useRouter();
    const [user, setUser] = useState({
        userName: '',
        email: '',
        password: '',
        role: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const res = await POST('/api/v1/authentication/register', { body: user as any, headers: { authorization: `Bearer ${config.token}` } });

        if (res.response.ok) {
            router.push('/users');
            alert('User added successfully');
        } else {
            let error = res.error as any;
            setError(Array.isArray(error.message) ? error.message.join(', ') : error.message);
        }

        setLoading(false);
    };

    return (
        <ClientLayout>
            <h1 className="text-2xl font-bold">Add User</h1>

            {error && <p className="text-red-500">{error}</p>}

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                <input
                    type="text"
                    name="userName"
                    placeholder="Username"
                    value={user.userName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={user.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    type="text"
                    name="password"
                    placeholder="Password"
                    value={user.password}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
                <select
                    name="role"
                    value={user.role}
                    onChange={handleChange}
                    className="p-2 border rounded w-1/3"
                >
                    <option value="">Select Role</option>
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                </select>
                <br />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={loading}>
                    {loading ? 'Adding...' : 'Add User'}
                </button>
            </form>
        </ClientLayout>
    );
}
