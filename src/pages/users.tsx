import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'next/router';
import { config, GET } from '@/api-service/api';
import { components } from '@/api-service/service';
import Link from 'next/link';
import Layout from '@/components/Layout';

export default function MyInvoicesPage() {
    const { token } = useAuthStore();
    const router = useRouter();

    const fetchUsers = async () => {
        return await GET('/api/v1/user', { headers: { authorization: `Bearer ${config.token}` } });
    };

    useEffect(() => {
        if (!token) {
            router.push('/');
        }
        getUsers();
    }, [token, router]);


    // Users state
    const [users, setUsers] = useState<components['schemas']['UserDto'][]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch Users
    const getUsers = async () => {
        setLoading(true);
        const res = await fetchUsers();
        if (res.response.ok) {
            setUsers(res.data!!);
        }
        setLoading(false);
    };

    return (
        <Layout>
            <h1 className="text-2xl font-bold">Users</h1>

            <div className="mt-3">
                <Link href="/add-user" className="bg-blue-500 text-white px-4 py-2 rounded">
                    + Add New User
                </Link>
            </div>

            {/* Users Table */}
            {loading ? (
                <p className="mt-5">Loading users...</p>
            ) : users && users.length > 0 ? (
                <table className="w-full mt-5 border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">User ID</th>
                            <th className="border p-2">Username</th>
                            <th className="border p-2">Email</th>
                            <th className="border p-2">Role</th>
                            <th className="border p-2">Account Status</th>
                            <th className="border p-2">Date Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map((user) => (
                            <tr key={user.id} className="text-center">
                                <td className="border p-2">{user.id}</td>
                                <td className="border p-2">{user.userName}</td>
                                <td className="border p-2">{user.email}</td>
                                <td className="border p-2">{user.role}</td>
                                <td className="border p-2">{user.status}</td>
                                <td className="border p-2">{new Date(user.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : <p className="mt-5 text-center font-bold">No user found</p>}
        </Layout>
    );
}
