import Layout from '../components/Layout';
import { useAuthStore } from '../store/auth';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_REPORTS } from '@/services/apolloClient';

export default function DashboardPage() {
    const { token } = useAuthStore();
    const router = useRouter();

    // Redirect if not logged in
    useEffect(() => {
        if (!token) {
            router.push('/');
        }
    }, [token, router]);
    const { data, loading, error } = useQuery(GET_DASHBOARD_REPORTS);

    return (
        <Layout>
            <h1 className="text-2xl font-bold">Dashboard</h1>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">Error loading reports</p>}

            {data && (
                <div className="mt-5 grid grid-cols-2 gap-5">
                    {/* Invoice Reports */}
                    <div className="p-5 bg-white shadow rounded">
                        <h3 className="text-lg font-semibold">Total Invoices</h3>
                        <p className="text-2xl font-bold">{data.getInvoiceReport.totalInvoices}</p>
                    </div>
                    <div className="p-5 bg-white shadow rounded">
                        <h3 className="text-lg font-semibold">Paid Invoices</h3>
                        <p className="text-2xl font-bold text-green-500">{data.getInvoiceReport.paidInvoices}</p>
                    </div>
                    <div className="p-5 bg-white shadow rounded">
                        <h3 className="text-lg font-semibold">Unpaid Invoices</h3>
                        <p className="text-2xl font-bold text-yellow-500">{data.getInvoiceReport.unpaidInvoices}</p>
                    </div>
                    <div className="p-5 bg-white shadow rounded">
                        <h3 className="text-lg font-semibold">Declined Invoices</h3>
                        <p className="text-2xl font-bold text-red-500">{data.getInvoiceReport.declinedInvoices}</p>
                    </div>

                    {/* User Reports */}
                    <div className="p-5 bg-white shadow rounded">
                        <h3 className="text-lg font-semibold">Total Users</h3>
                        <p className="text-2xl font-bold">{data.getUserReport.totalUsers}</p>
                    </div>
                    <div className="p-5 bg-white shadow rounded">
                        <h3 className="text-lg font-semibold">Admins</h3>
                        <p className="text-2xl font-bold text-green-500">{data.getUserReport.admins}</p>
                    </div>
                    <div className="p-5 bg-white shadow rounded">
                        <h3 className="text-lg font-semibold">Clients</h3>
                        <p className="text-2xl font-bold text-gray-500">{data.getUserReport.clients}</p>
                    </div>
                </div>
            )}
        </Layout>
    );
}
