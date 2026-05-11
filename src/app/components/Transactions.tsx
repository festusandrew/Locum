import {
    Activity,
    TrendingUp,
    TrendingDown,
    Clock,
    Search,
    SlidersHorizontal,
    Download,
    Eye,
    X,
    CheckCircle,
    AlertCircle,
    Calendar,
    DollarSign,
    Receipt,
    CreditCard
} from 'lucide-react';
import { useState } from 'react';

interface Transaction {
    id: string;
    date: string;
    locumName: string;
    facility: string;
    type: 'payment' | 'invoice' | 'refund';
    amount: number;
    status: 'completed' | 'pending' | 'failed';
    paymentMethod: string;
    description: string;
    shiftDate: string;
    invoiceNumber?: string;
}

const transactions: Transaction[] = [
    {
        id: 'TXN-2024-001',
        date: '2024-12-11 09:45',
        locumName: 'Sarah Mitchell',
        facility: 'St. James\'s Hospital, Dublin',
        type: 'payment',
        amount: 1250.00,
        status: 'completed',
        paymentMethod: 'Bank Transfer',
        description: 'General Surgery Shift - 8 hours',
        shiftDate: '2024-12-09',
        invoiceNumber: 'INV-2024-1234'
    },
    {
        id: 'TXN-2024-002',
        date: '2024-12-11 08:30',
        locumName: 'James Harrison',
        facility: 'Cork University Hospital',
        type: 'payment',
        amount: 980.50,
        status: 'pending',
        paymentMethod: 'Bank Transfer',
        description: 'Cardiology Consultation - 6 hours',
        shiftDate: '2024-12-08',
        invoiceNumber: 'INV-2024-1235'
    },
    {
        id: 'TXN-2024-003',
        date: '2024-12-10 16:20',
        locumName: 'Emily Chen',
        facility: 'University Hospital Galway',
        type: 'payment',
        amount: 1580.00,
        status: 'completed',
        paymentMethod: 'Direct Debit',
        description: 'Anesthesiology - 10 hours',
        shiftDate: '2024-12-07',
        invoiceNumber: 'INV-2024-1236'
    },
    {
        id: 'TXN-2024-004',
        date: '2024-12-10 14:15',
        locumName: 'Michael Brooks',
        facility: 'University Hospital Limerick',
        type: 'payment',
        amount: 1420.00,
        status: 'completed',
        paymentMethod: 'Bank Transfer',
        description: 'Emergency Medicine - 9 hours',
        shiftDate: '2024-12-06',
        invoiceNumber: 'INV-2024-1237'
    },
    {
        id: 'TXN-2024-005',
        date: '2024-12-10 11:00',
        locumName: 'Rachel Martinez',
        facility: 'Beaumont Hospital, Dublin',
        type: 'invoice',
        amount: 875.00,
        status: 'pending',
        paymentMethod: 'Bank Transfer',
        description: 'Pediatrics Consultation - 5 hours',
        shiftDate: '2024-12-05',
        invoiceNumber: 'INV-2024-1238'
    },
    {
        id: 'TXN-2024-006',
        date: '2024-12-09 15:45',
        locumName: 'David Thompson',
        facility: 'University Hospital Waterford',
        type: 'payment',
        amount: 1125.00,
        status: 'completed',
        paymentMethod: 'Bank Transfer',
        description: 'Orthopedics Surgery - 7 hours',
        shiftDate: '2024-12-04',
        invoiceNumber: 'INV-2024-1239'
    },
    {
        id: 'TXN-2024-007',
        date: '2024-12-09 10:30',
        locumName: 'Sarah Mitchell',
        facility: 'Mater Misericordiae Hospital',
        type: 'payment',
        amount: 1680.00,
        status: 'completed',
        paymentMethod: 'Direct Debit',
        description: 'General Surgery - 12 hours',
        shiftDate: '2024-12-03',
        invoiceNumber: 'INV-2024-1240'
    },
    {
        id: 'TXN-2024-008',
        date: '2024-12-08 09:15',
        locumName: 'James Harrison',
        facility: 'Cork University Hospital',
        type: 'refund',
        amount: -350.00,
        status: 'completed',
        paymentMethod: 'Bank Transfer',
        description: 'Shift Cancellation Refund',
        shiftDate: '2024-12-02',
        invoiceNumber: 'INV-2024-1241'
    },
    {
        id: 'TXN-2024-009',
        date: '2024-12-08 08:00',
        locumName: 'Emily Chen',
        facility: 'St. Vincent\'s Hospital, Dublin',
        type: 'payment',
        amount: 1320.00,
        status: 'failed',
        paymentMethod: 'Bank Transfer',
        description: 'Anesthesiology - 8 hours',
        shiftDate: '2024-12-01',
        invoiceNumber: 'INV-2024-1242'
    },
    {
        id: 'TXN-2024-010',
        date: '2024-12-07 16:30',
        locumName: 'Michael Brooks',
        facility: 'Tallaght Hospital, Dublin',
        type: 'payment',
        amount: 1050.00,
        status: 'completed',
        paymentMethod: 'Bank Transfer',
        description: 'Emergency Medicine - 6 hours',
        shiftDate: '2024-11-30',
        invoiceNumber: 'INV-2024-1243'
    },
];

export function Transactions() {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [showFilterDialog, setShowFilterDialog] = useState(false);
    const [showReceiptDialog, setShowReceiptDialog] = useState(false);

    // Calculate stats
    const totalTransactions = transactions.length;
    const completedTransactions = transactions.filter(t => t.status === 'completed');
    const totalRevenue = completedTransactions
        .filter(t => t.type !== 'refund')
        .reduce((sum, t) => sum + t.amount, 0);
    const pendingAmount = transactions
        .filter(t => t.status === 'pending')
        .reduce((sum, t) => sum + t.amount, 0);
    const failedTransactions = transactions.filter(t => t.status === 'failed').length;

    // Filter transactions
    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch =
            transaction.locumName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.facility.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
        const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;

        return matchesSearch && matchesType && matchesStatus;
    });

    const handleExport = () => {
        const csvContent = [
            ['Transaction ID', 'Date', 'Locum', 'Facility', 'Type', 'Amount (EUR)', 'Status', 'Payment Method', 'Invoice Number', 'Description'],
            ...transactions.map(t => [
                t.id,
                t.date,
                t.locumName,
                t.facility,
                t.type,
                t.amount.toFixed(2),
                t.status,
                t.paymentMethod,
                t.invoiceNumber || '',
                t.description
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const handleViewDetails = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setShowDetailsDialog(true);
    };

    const getStatusBadge = (status: 'completed' | 'pending' | 'failed') => {
        const styles = {
            completed: 'bg-[#D1FAE5] text-[#059669] border-[#A7F3D0]',
            pending: 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]',
            failed: 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]'
        };
        const labels = {
            completed: 'Completed',
            pending: 'Pending',
            failed: 'Failed'
        };
        const icons = {
            completed: <CheckCircle className="w-3 h-3" />,
            pending: <Clock className="w-3 h-3" />,
            failed: <AlertCircle className="w-3 h-3" />
        };
        return (
            <span className={`px-2.5 py-1 rounded-full text-xs border flex items-center gap-1 ${styles[status]}`}>
                {icons[status]}
                {labels[status]}
            </span>
        );
    };

    const getTypeBadge = (type: 'payment' | 'invoice' | 'refund') => {
        const styles = {
            payment: 'bg-[#DBEAFE] text-[#1D4ED8] border-[#BFDBFE]',
            invoice: 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]',
            refund: 'bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]'
        };
        const labels = {
            payment: 'Payment',
            invoice: 'Invoice',
            refund: 'Refund'
        };
        return (
            <span className={`px-2 py-1 rounded text-xs border ${styles[type]}`}>
                {labels[type]}
            </span>
        );
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IE', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    };

    return (
        <div className="p-6">
            {/* Page Title */}
            <div className="mb-6">
                <h2 className="text-[#1F2937] mb-1">Transactions</h2>
                <p className="text-sm text-[#6B7280]">View and manage all financial transactions</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-5 mb-6">
                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-[#D1FAE5] rounded-lg flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-[#10B981]" />
                        </div>
                        <div>
                            <p className="text-xs text-[#6B7280]">Total Revenue</p>
                            <p className="text-2xl font-bold text-[#1F2937]">{formatCurrency(totalRevenue)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#10B981]">
                        <TrendingUp className="w-3 h-3" />
                        <span>+15% from last month</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-[#FEF3C7] rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-[#D97706]" />
                        </div>
                        <div>
                            <p className="text-xs text-[#6B7280]">Pending Payments</p>
                            <p className="text-2xl font-bold text-[#1F2937]">{formatCurrency(pendingAmount)}</p>
                        </div>
                    </div>
                    <p className="text-xs text-[#6B7280]">{transactions.filter(t => t.status === 'pending').length} transactions awaiting</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-[#DBEAFE] rounded-lg flex items-center justify-center">
                            <Activity className="w-5 h-5 text-[#1D4ED8]" />
                        </div>
                        <div>
                            <p className="text-xs text-[#6B7280]">Total Transactions</p>
                            <p className="text-2xl font-bold text-[#1F2937]">{totalTransactions}</p>
                        </div>
                    </div>
                    <p className="text-xs text-[#6B7280]">This month</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-[#FEE2E2] rounded-lg flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-[#DC2626]" />
                        </div>
                        <div>
                            <p className="text-xs text-[#6B7280]">Failed Transactions</p>
                            <p className="text-2xl font-bold text-[#1F2937]">{failedTransactions}</p>
                        </div>
                    </div>
                    <p className="text-xs text-[#DC2626]">Requires attention</p>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-xl border border-[#E5E7EB]">
                <div className="p-5 border-b border-[#E5E7EB]">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[#1F2937]">All Transactions</h3>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                                <input
                                    type="text"
                                    placeholder="Search transactions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-4 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                />
                            </div>
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                            >
                                <option value="all">All Types</option>
                                <option value="payment">Payments</option>
                                <option value="invoice">Invoices</option>
                                <option value="refund">Refunds</option>
                            </select>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                            >
                                <option value="all">All Status</option>
                                <option value="completed">Completed</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
                            </select>
                            <button
                                onClick={handleExport}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]"
                            >
                                <Download className="w-4 h-4" />
                                Export
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#E5E7EB]">
                                <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Transaction ID</th>
                                <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Date & Time</th>
                                <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Locum</th>
                                <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Facility</th>
                                <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Type</th>
                                <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Amount</th>
                                <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Status</th>
                                <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map((transaction) => (
                                <tr key={transaction.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                                    <td className="px-5 py-4">
                                        <div>
                                            <p className="text-sm font-medium text-[#1F2937]">{transaction.id}</p>
                                            <p className="text-xs text-[#6B7280]">{transaction.invoiceNumber}</p>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <p className="text-sm text-[#1F2937]">{transaction.date.split(' ')[0]}</p>
                                        <p className="text-xs text-[#6B7280]">{transaction.date.split(' ')[1]}</p>
                                    </td>
                                    <td className="px-5 py-4">
                                        <p className="text-sm text-[#1F2937]">{transaction.locumName}</p>
                                    </td>
                                    <td className="px-5 py-4">
                                        <p className="text-sm text-[#6B7280]">{transaction.facility}</p>
                                    </td>
                                    <td className="px-5 py-4">
                                        {getTypeBadge(transaction.type)}
                                    </td>
                                    <td className="px-5 py-4">
                                        <p className={`text-sm font-semibold ${transaction.type === 'refund' ? 'text-[#DC2626]' : 'text-[#1F2937]'}`}>
                                            {formatCurrency(transaction.amount)}
                                        </p>
                                    </td>
                                    <td className="px-5 py-4">
                                        {getStatusBadge(transaction.status)}
                                    </td>
                                    <td className="px-5 py-4">
                                        <button
                                            onClick={() => handleViewDetails(transaction)}
                                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#10B981] border border-[#10B981] rounded-lg hover:bg-[#D1FAE5]"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-5 border-t border-[#E5E7EB]">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-[#6B7280]">
                            Showing <span className="font-medium text-[#1F2937]">{filteredTransactions.length}</span> of <span className="font-medium text-[#1F2937]">{totalTransactions}</span> transactions
                        </p>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1.5 text-sm border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] disabled:opacity-50" disabled>
                                Previous
                            </button>
                            <button className="px-3 py-1.5 text-sm bg-[#10B981] text-white rounded-lg hover:bg-[#059669]">
                                1
                            </button>
                            <button className="px-3 py-1.5 text-sm border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]">
                                2
                            </button>
                            <button className="px-3 py-1.5 text-sm border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]">
                                3
                            </button>
                            <button className="px-3 py-1.5 text-sm border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction Details Dialog */}
            {showDetailsDialog && selectedTransaction && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-[600px] max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-[#1F2937]">Transaction Details</h3>
                                <p className="text-sm text-[#6B7280]">{selectedTransaction.id}</p>
                            </div>
                            <button
                                onClick={() => setShowDetailsDialog(false)}
                                className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Status Banner */}
                        <div className={`p-4 rounded-lg mb-6 ${selectedTransaction.status === 'completed' ? 'bg-[#D1FAE5]' :
                                selectedTransaction.status === 'pending' ? 'bg-[#FEF3C7]' :
                                    'bg-[#FEE2E2]'
                            }`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {selectedTransaction.status === 'completed' && <CheckCircle className="w-5 h-5 text-[#059669]" />}
                                    {selectedTransaction.status === 'pending' && <Clock className="w-5 h-5 text-[#D97706]" />}
                                    {selectedTransaction.status === 'failed' && <AlertCircle className="w-5 h-5 text-[#DC2626]" />}
                                    <span className={`font-semibold ${selectedTransaction.status === 'completed' ? 'text-[#059669]' :
                                            selectedTransaction.status === 'pending' ? 'text-[#D97706]' :
                                                'text-[#DC2626]'
                                        }`}>
                                        {selectedTransaction.status === 'completed' ? 'Payment Completed' :
                                            selectedTransaction.status === 'pending' ? 'Payment Pending' :
                                                'Payment Failed'}
                                    </span>
                                </div>
                                <span className="text-2xl font-bold text-[#1F2937]">
                                    {formatCurrency(selectedTransaction.amount)}
                                </span>
                            </div>
                        </div>

                        {/* Transaction Details */}
                        <div className="space-y-4 mb-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-[#6B7280] mb-1">Transaction Date</p>
                                    <p className="text-sm font-medium text-[#1F2937]">{selectedTransaction.date}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#6B7280] mb-1">Shift Date</p>
                                    <p className="text-sm font-medium text-[#1F2937]">{selectedTransaction.shiftDate}</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-[#E5E7EB]">
                                <p className="text-xs text-[#6B7280] mb-1">Locum</p>
                                <p className="text-sm font-medium text-[#1F2937]">{selectedTransaction.locumName}</p>
                            </div>

                            <div>
                                <p className="text-xs text-[#6B7280] mb-1">Facility</p>
                                <p className="text-sm font-medium text-[#1F2937]">{selectedTransaction.facility}</p>
                            </div>

                            <div>
                                <p className="text-xs text-[#6B7280] mb-1">Description</p>
                                <p className="text-sm font-medium text-[#1F2937]">{selectedTransaction.description}</p>
                            </div>

                            <div className="pt-4 border-t border-[#E5E7EB]">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-[#6B7280]">Transaction Type</span>
                                    {getTypeBadge(selectedTransaction.type)}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-[#6B7280] mb-1">Payment Method</p>
                                <div className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-[#6B7280]" />
                                    <p className="text-sm font-medium text-[#1F2937]">{selectedTransaction.paymentMethod}</p>
                                </div>
                            </div>

                            {selectedTransaction.invoiceNumber && (
                                <div>
                                    <p className="text-xs text-[#6B7280] mb-1">Invoice Number</p>
                                    <div className="flex items-center gap-2">
                                        <Receipt className="w-4 h-4 text-[#6B7280]" />
                                        <p className="text-sm font-medium text-[#1F2937]">{selectedTransaction.invoiceNumber}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            {selectedTransaction.status === 'completed' && (
                                <>
                                    <button
                                        onClick={() => {
                                            setShowDetailsDialog(false);
                                            setShowReceiptDialog(true);
                                        }}
                                        className="flex-1 px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download Receipt
                                    </button>
                                    <button className="flex-1 px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg hover:bg-[#F9FAFB] flex items-center justify-center gap-2">
                                        <Receipt className="w-4 h-4" />
                                        View Invoice
                                    </button>
                                </>
                            )}
                            {selectedTransaction.status === 'pending' && (
                                <>
                                    <button className="flex-1 px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669]">
                                        Process Payment
                                    </button>
                                    <button className="flex-1 px-4 py-2 border border-[#DC2626] text-[#DC2626] rounded-lg hover:bg-[#FEE2E2]">
                                        Cancel Transaction
                                    </button>
                                </>
                            )}
                            {selectedTransaction.status === 'failed' && (
                                <>
                                    <button className="flex-1 px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669]">
                                        Retry Payment
                                    </button>
                                    <button className="flex-1 px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg hover:bg-[#F9FAFB]">
                                        Contact Support
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Receipt Dialog */}
            {showReceiptDialog && selectedTransaction && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Receipt Content - Ready for Print */}
                        <div id="receipt-content" className="p-8">
                            {/* Header */}
                            <div className="text-center mb-8 pb-6 border-b-2 border-[#10B981]">
                                <h1 className="text-3xl text-[#10B981] mb-2">MPLOYUS</h1>
                                <p className="text-sm text-[#6B7280]">Locum Management Services</p>
                                <p className="text-xs text-[#6B7280] mt-1">123 Healthcare Drive, Dublin 2, Ireland</p>
                                <p className="text-xs text-[#6B7280]">VAT Reg: IE1234567X | Tel: +353 1 234 5678</p>
                            </div>

                            {/* Receipt Title */}
                            <div className="text-center mb-8">
                                <h2 className="text-2xl text-[#1F2937] mb-2">PAYMENT RECEIPT</h2>
                                <div className="inline-block px-4 py-2 bg-[#D1FAE5] border border-[#10B981] rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-[#10B981] inline mr-2" />
                                    <span className="text-sm font-medium text-[#059669]">PAID IN FULL</span>
                                </div>
                            </div>

                            {/* Receipt Info */}
                            <div className="grid grid-cols-2 gap-6 mb-8 p-4 bg-[#F9FAFB] rounded-lg">
                                <div>
                                    <p className="text-xs text-[#6B7280] mb-1">Receipt Number</p>
                                    <p className="text-sm font-medium text-[#1F2937]">{selectedTransaction.id}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#6B7280] mb-1">Invoice Number</p>
                                    <p className="text-sm font-medium text-[#1F2937]">{selectedTransaction.invoiceNumber}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#6B7280] mb-1">Transaction Date</p>
                                    <p className="text-sm font-medium text-[#1F2937]">{selectedTransaction.date}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#6B7280] mb-1">Payment Method</p>
                                    <p className="text-sm font-medium text-[#1F2937]">{selectedTransaction.paymentMethod}</p>
                                </div>
                            </div>

                            {/* Bill To / From */}
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="p-4 border border-[#E5E7EB] rounded-lg">
                                    <p className="text-xs text-[#6B7280] mb-2">BILLED TO</p>
                                    <p className="font-medium text-[#1F2937] mb-1">{selectedTransaction.facility}</p>
                                    <p className="text-sm text-[#6B7280]">Healthcare Facility</p>
                                    <p className="text-sm text-[#6B7280]">Ireland</p>
                                </div>
                                <div className="p-4 border border-[#E5E7EB] rounded-lg">
                                    <p className="text-xs text-[#6B7280] mb-2">PAYMENT FROM</p>
                                    <p className="font-medium text-[#1F2937] mb-1">Mployus Ltd.</p>
                                    <p className="text-sm text-[#6B7280]">On behalf of: {selectedTransaction.locumName}</p>
                                    <p className="text-sm text-[#6B7280]">Dublin, Ireland</p>
                                </div>
                            </div>

                            {/* Service Details */}
                            <div className="mb-8">
                                <p className="text-xs text-[#6B7280] mb-3">SERVICE DETAILS</p>
                                <table className="w-full border border-[#E5E7EB]">
                                    <thead>
                                        <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                                            <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280]">Description</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280]">Service Date</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280]">Locum Name</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-[#6B7280]">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-[#E5E7EB]">
                                            <td className="px-4 py-3 text-sm text-[#1F2937]">{selectedTransaction.description}</td>
                                            <td className="px-4 py-3 text-sm text-[#1F2937]">{selectedTransaction.shiftDate}</td>
                                            <td className="px-4 py-3 text-sm text-[#1F2937]">{selectedTransaction.locumName}</td>
                                            <td className="px-4 py-3 text-sm text-[#1F2937] text-right">{formatCurrency(selectedTransaction.amount)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Payment Summary */}
                            <div className="mb-8">
                                <div className="ml-auto w-80">
                                    <div className="space-y-2 mb-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#6B7280]">Subtotal:</span>
                                            <span className="text-[#1F2937]">{formatCurrency(selectedTransaction.amount)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#6B7280]">VAT (0%):</span>
                                            <span className="text-[#1F2937]">{formatCurrency(0)}</span>
                                        </div>
                                    </div>
                                    <div className="pt-3 border-t-2 border-[#10B981]">
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-[#1F2937]">Total Paid:</span>
                                            <span className="text-xl font-bold text-[#10B981]">{formatCurrency(selectedTransaction.amount)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Confirmation */}
                            <div className="p-4 bg-[#D1FAE5] border border-[#10B981] rounded-lg mb-8">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-[#10B981] mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-[#059669] mb-1">Payment Confirmed</p>
                                        <p className="text-xs text-[#6B7280]">
                                            This payment was successfully processed on {selectedTransaction.date} via {selectedTransaction.paymentMethod}.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="text-center pt-6 border-t border-[#E5E7EB]">
                                <p className="text-xs text-[#6B7280] mb-1">Thank you for using Mployus Locum Management Services</p>
                                <p className="text-xs text-[#6B7280]">For inquiries, contact us at: support@mployus.ie | +353 1 234 5678</p>
                                <p className="text-xs text-[#9CA3AF] mt-3">This is an official computer-generated receipt and does not require a signature.</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="p-6 bg-[#F9FAFB] border-t border-[#E5E7EB] flex gap-3">
                            <button
                                onClick={() => setShowReceiptDialog(false)}
                                className="flex-1 px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg hover:bg-white"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    window.print();
                                }}
                                className="flex-1 px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] flex items-center justify-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Download / Print
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}