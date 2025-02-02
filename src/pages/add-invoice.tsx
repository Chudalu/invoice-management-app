import ClientLayout from '../components/ClientLayout';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { config, POST } from '@/api-service/api';

export default function AddInvoicePage() {
    const router = useRouter();
    const [invoice, setInvoice] = useState({
        title: '',
        amount: '',
        notes: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInvoice({ ...invoice, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const res = await POST('/api/v1/invoice', { body: invoice as any, headers: { authorization: `Bearer ${config.token}` } });

        if (res.response.ok) {
            router.push('/my-invoices');
            alert('Invoice added successfully');
        } else {
            let error = res.error as any;
            setError(Array.isArray(error.message) ? error.message.join(', ') : error.message);
        }

        setLoading(false);
    };

    return (
        <ClientLayout>
            <h1 className="text-2xl font-bold">Add Invoice</h1>

            {error && <p className="text-red-500">{error}</p>}

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                <input
                    type="text"
                    name="title"
                    placeholder="Invoice Title"
                    value={invoice.title}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    type="number"
                    name="amount"
                    placeholder="Invoice Amount"
                    value={invoice.amount}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    type="text"
                    name="notes"
                    placeholder="Invoice Notes"
                    value={invoice.notes}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Invoice'}
                </button>
            </form>
        </ClientLayout>
    );
}
