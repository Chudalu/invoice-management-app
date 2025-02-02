import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'next/router';
import { config, GET } from '@/api-service/api';
import { components } from '@/api-service/service';
import ClientLayout from '@/components/ClientLayout';
import Link from 'next/link';

export default function MyInvoicesPage() {
    const { token, user } = useAuthStore();
    const router = useRouter();

    const removeEmpty = (obj: any): any => {
        return Object.entries(obj)
            .filter(([_, v]) => v != null && v != '' && v != undefined)
            .reduce(
                (acc, [k, v]) => ({ ...acc, [k]: v === Object(v) ? removeEmpty(v) : v }),
                {}
            );
    };

    const fetchInvoices = async (filters: { title?: string; amount?: string; invoiceStatus?: string; }) => {
        return await GET('/api/v1/invoice', { params: { query: { ...removeEmpty(filters), userId: user?.id } }, headers: { authorization: `Bearer ${config.token}` } });
    };

    useEffect(() => {
        if (!token) {
            router.push('/');
        }
    }, [token, router]);

    const [searchFilters, setSearchFilters] = useState({
        title: '',
        amount: '',
        invoiceStatus: '',
    });

    // Invoices state
    const [invoices, setInvoices] = useState<components['schemas']['InvoiceDto'][]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch invoices
    const getInvoices = async () => {
        setLoading(true);
        const res = await fetchInvoices(searchFilters);
        if (res.response.ok) {
            setInvoices(res.data!!);
        }
        setLoading(false);
    };

    // Fetch invoices on component mount and when filters change
    useEffect(() => {
        getInvoices();
    }, [searchFilters]);

    // Handle input changes
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setSearchFilters({ ...searchFilters, [e.target.name]: e.target.value });
    };

    return (
        <ClientLayout>
            <h1 className="text-2xl font-bold">Invoices</h1>

            <div className="mt-3">
                <Link href="/add-invoice" className="bg-blue-500 text-white px-4 py-2 rounded">
                    + Add New Invoice
                </Link>
            </div>

            {/* Search Filters */}
            <div className="flex space-x-4 mt-5">
                <input
                    type="text"
                    name="title"
                    placeholder="Search by Title"
                    value={searchFilters.title}
                    onChange={handleFilterChange}
                    className="p-2 border rounded w-1/3"
                />
                <input
                    type="number"
                    name="amount"
                    placeholder="Search by Amount"
                    value={searchFilters.amount}
                    onChange={handleFilterChange}
                    className="p-2 border rounded w-1/3"
                />
                <select
                    name="invoiceStatus"
                    value={searchFilters.invoiceStatus}
                    onChange={handleFilterChange}
                    className="p-2 border rounded w-1/3"
                >
                    <option value="">All Statuses</option>
                    <option value="PAID">PAID</option>
                    <option value="UNPAID">UNPAID</option>
                    <option value="DECLINED">DECLINED</option>
                </select>
            </div>

            {/* Invoices Table */}
            {loading ? (
                <p className="mt-5">Loading invoices...</p>
            ) : invoices && invoices.length > 0 ? (
                <table className="w-full mt-5 border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">Invoice ID</th>
                            <th className="border p-2">Title</th>
                            <th className="border p-2">Date</th>
                            <th className="border p-2">Amount</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices?.map((invoice) => (
                            <tr key={invoice.id} className="text-center">
                                <td className="border p-2">{invoice.id}</td>
                                <td className="border p-2">{invoice.title}</td>
                                <td className="border p-2">{new Date(invoice.createdAt).toLocaleString()}</td>
                                <td className="border p-2">${invoice.amount}</td>
                                <td className="border p-2">{invoice.invoiceStatus}</td>
                                <td className="border p-2">
                                    <Link
                                        href={`/edit-invoice/${invoice.id}`}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                                    >
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : <p className="mt-5 text-center font-bold">No invoice found</p>}
        </ClientLayout>
    );
}
