import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { config, GET, PATCH } from '@/api-service/api';
import ClientLayout from '@/components/ClientLayout';

export default function EditInvoicePage() {
    const router = useRouter();
    const { id } = router.query;
    const [invoice, setInvoice] = useState({
        title: '',
        amount: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch invoice details
    useEffect(() => {
        if (!id) return;

        const fetchInvoice = async () => {
            setLoading(true);
            const res = await GET('/api/v1/invoice/{id}', { params: { path: { id: Number(id) } }, headers: { authorization: `Bearer ${config.token}` } });
            if (res.response.ok && res.data) {
                setInvoice({
                    title: res.data.title,
                    amount: String(res.data.amount),
                    notes: res.data.notes!!
                });
            } else {
                setError('Invoice not found');
            }
            setLoading(false);
        };

        fetchInvoice();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInvoice({ ...invoice, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const res = await PATCH('/api/v1/invoice/{id}', { body: invoice as any, params: { path: { id: Number(id) } }, headers: { authorization: `Bearer ${config.token}` } });
        if (res.response.ok) {
            router.push('/my-invoices');
            alert('Invoice updated');
        } else {
            setError('Failed to update invoice');
        }

        setLoading(false);
    };

    return (
        <ClientLayout>
            <h1 className="text-2xl font-bold">Edit Invoice</h1>

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
                    {loading ? 'Updating...' : 'Update Invoice'}
                </button>
            </form>
        </ClientLayout>
    );
}
