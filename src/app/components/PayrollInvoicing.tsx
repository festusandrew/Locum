import { useState } from 'react';
import {
    Wallet, FileText, CreditCard, Download, Search, Eye, X,
    CheckCircle, Clock, AlertCircle, TrendingUp, ArrowUp, ArrowDown,
    Building2, Users, Receipt, Plus, Send, Trash2
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, LineChart, Line
} from 'recharts';

interface PayrollItem {
    id: string;
    locum: string;
    period: string;
    shifts: number;
    hours: number;
    baseRate: number;
    grossPay: number;
    tax: number;
    prsi: number;
    netPay: number;
    status: 'processed' | 'pending' | 'on_hold';
    payDate: string;
}

interface Invoice {
    id: string;
    client: string;
    amount: number;
    issueDate: string;
    dueDate: string;
    status: 'paid' | 'sent' | 'overdue' | 'draft';
    shifts: number;
}

const payrollItems: PayrollItem[] = [
    { id: 'PAY-001', locum: 'Dr. Sarah Mitchell', period: 'Feb 1-15, 2026', shifts: 6, hours: 52, baseRate: 55, grossPay: 2860, tax: 572, prsi: 114.40, netPay: 2173.60, status: 'processed', payDate: '2026-02-20' },
    { id: 'PAY-002', locum: 'Dr. James Harrison', period: 'Feb 1-15, 2026', shifts: 5, hours: 56, baseRate: 60, grossPay: 3360, tax: 672, prsi: 134.40, netPay: 2553.60, status: 'processed', payDate: '2026-02-20' },
    { id: 'PAY-003', locum: 'Dr. Emily Chen', period: 'Feb 1-15, 2026', shifts: 4, hours: 40, baseRate: 58, grossPay: 2320, tax: 464, prsi: 92.80, netPay: 1763.20, status: 'pending', payDate: '2026-02-20' },
    { id: 'PAY-004', locum: 'Dr. Michael Brooks', period: 'Feb 1-15, 2026', shifts: 3, hours: 36, baseRate: 52, grossPay: 1872, tax: 374.40, prsi: 74.88, netPay: 1422.72, status: 'on_hold', payDate: '2026-02-20' },
    { id: 'PAY-005', locum: 'Dr. Rachel Martinez', period: 'Feb 1-15, 2026', shifts: 5, hours: 48, baseRate: 55, grossPay: 2640, tax: 528, prsi: 105.60, netPay: 2006.40, status: 'pending', payDate: '2026-02-20' },
    { id: 'PAY-006', locum: 'Dr. David Thompson', period: 'Feb 1-15, 2026', shifts: 4, hours: 40, baseRate: 52, grossPay: 2080, tax: 416, prsi: 83.20, netPay: 1580.80, status: 'processed', payDate: '2026-02-20' },
];

const invoices: Invoice[] = [
    { id: 'INV-2026-045', client: "St. James's Hospital", amount: 24500, issueDate: '2026-02-01', dueDate: '2026-02-28', status: 'sent', shifts: 18 },
    { id: 'INV-2026-044', client: 'Cork University Hospital', amount: 18200, issueDate: '2026-02-01', dueDate: '2026-02-28', status: 'sent', shifts: 14 },
    { id: 'INV-2026-043', client: 'Galway Clinic', amount: 9400, issueDate: '2026-01-15', dueDate: '2026-02-15', status: 'overdue', shifts: 8 },
    { id: 'INV-2026-042', client: 'Mater Hospital', amount: 15800, issueDate: '2026-01-15', dueDate: '2026-02-15', status: 'paid', shifts: 12 },
    { id: 'INV-2026-041', client: 'Beaumont Hospital', amount: 12600, issueDate: '2026-01-01', dueDate: '2026-01-31', status: 'paid', shifts: 10 },
    { id: 'INV-2026-040', client: 'Beacon Hospital', amount: 5200, issueDate: '2026-01-01', dueDate: '2026-01-31', status: 'paid', shifts: 5 },
];

const profitData = [
    { month: 'Sep', revenue: 285, cost: 198, profit: 87 },
    { month: 'Oct', revenue: 312, cost: 215, profit: 97 },
    { month: 'Nov', revenue: 298, cost: 205, profit: 93 },
    { month: 'Dec', revenue: 265, cost: 188, profit: 77 },
    { month: 'Jan', revenue: 342, cost: 228, profit: 114 },
    { month: 'Feb', revenue: 368, cost: 245, profit: 123 },
];

const payStatusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
    processed: { label: 'Processed', color: '#059669', bg: '#D1FAE5', border: '#A7F3D0' },
    pending: { label: 'Pending', color: '#D97706', bg: '#FEF3C7', border: '#FDE68A' },
    on_hold: { label: 'On Hold', color: '#DC2626', bg: '#FEE2E2', border: '#FECACA' },
};

const invStatusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
    paid: { label: 'Paid', color: '#059669', bg: '#D1FAE5', border: '#A7F3D0' },
    sent: { label: 'Sent', color: '#3B82F6', bg: '#DBEAFE', border: '#BFDBFE' },
    overdue: { label: 'Overdue', color: '#DC2626', bg: '#FEE2E2', border: '#FECACA' },
    draft: { label: 'Draft', color: '#6B7280', bg: '#F3F4F6', border: '#E5E7EB' },
};

export function PayrollInvoicing() {
    const [activeTab, setActiveTab] = useState<'payroll' | 'invoicing' | 'financial'>('payroll');
    const [searchTerm, setSearchTerm] = useState('');
    const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
    const [showLogPayrollModal, setShowLogPayrollModal] = useState(false);
    const [showInvoiceDetail, setShowInvoiceDetail] = useState(false);
    const [showPayrollDetail, setShowPayrollDetail] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [selectedPayroll, setSelectedPayroll] = useState<PayrollItem | null>(null);
    const [invoiceForm, setInvoiceForm] = useState({
        client: '',
        invoiceNumber: '',
        issueDate: '',
        dueDate: '',
        paymentTerms: '30',
        vatRegistered: true,
        vatRate: '23',
        currency: 'EUR',
        reference: '',
        notes: '',
        lineItems: [
            { description: '', quantity: 1, rate: 0, amount: 0 }
        ],
    });

    const totalGross = payrollItems.reduce((s, p) => s + p.grossPay, 0);
    const totalNet = payrollItems.reduce((s, p) => s + p.netPay, 0);
    const outstandingInvoices = invoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((s, i) => s + i.amount, 0);
    const overdueAmount = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0);

    // Calculate invoice totals
    const calculateLineTotal = (index: number) => {
        const item = invoiceForm.lineItems[index];
        return item.quantity * item.rate;
    };

    const subtotal = invoiceForm.lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const vatAmount = invoiceForm.vatRegistered ? (subtotal * parseFloat(invoiceForm.vatRate || '0') / 100) : 0;
    const totalAmount = subtotal + vatAmount;

    const addLineItem = () => {
        setInvoiceForm({
            ...invoiceForm,
            lineItems: [...invoiceForm.lineItems, { description: '', quantity: 1, rate: 0, amount: 0 }]
        });
    };

    const removeLineItem = (index: number) => {
        if (invoiceForm.lineItems.length > 1) {
            const newLineItems = invoiceForm.lineItems.filter((_, i) => i !== index);
            setInvoiceForm({ ...invoiceForm, lineItems: newLineItems });
        }
    };

    const updateLineItem = (index: number, field: string, value: any) => {
        const newLineItems = [...invoiceForm.lineItems];
        (newLineItems[index] as any)[field] = value;
        if (field === 'quantity' || field === 'rate') {
            newLineItems[index].amount = newLineItems[index].quantity * newLineItems[index].rate;
        }
        setInvoiceForm({ ...invoiceForm, lineItems: newLineItems });
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="text-[#1F2937] mb-1">Payroll & Invoicing</h2>
                <p className="text-sm text-[#6B7280]">Manage locum payroll, client invoicing, and financial reporting</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: 'Total Gross Payroll', value: `€${totalGross.toLocaleString()}`, icon: Wallet, color: '#10B981', bg: '#D1FAE5' },
                    { label: 'Total Net Payroll', value: `€${totalNet.toLocaleString()}`, icon: CreditCard, color: '#3B82F6', bg: '#DBEAFE' },
                    { label: 'Outstanding Invoices', value: `€${outstandingInvoices.toLocaleString()}`, icon: Receipt, color: '#F59E0B', bg: '#FEF3C7' },
                    { label: 'Overdue Amount', value: `€${overdueAmount.toLocaleString()}`, icon: AlertCircle, color: '#EF4444', bg: '#FEE2E2' },
                ].map(s => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: s.bg }}>
                                    <Icon className="w-5 h-5" style={{ color: s.color }} />
                                </div>
                                <div>
                                    <p className="text-xs text-[#9CA3AF]">{s.label}</p>
                                    <p className="text-xl text-[#1F2937]" style={{ fontWeight: 700 }}>{s.value}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-[#E5E7EB]">
                <div className="border-b border-[#E5E7EB] px-5 flex items-center justify-between">
                    <div className="flex gap-6">
                        {[
                            { id: 'payroll' as const, label: 'Locum Payroll' },
                            { id: 'invoicing' as const, label: 'Client Invoicing' },
                            { id: 'financial' as const, label: 'Financial Reporting' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-3 text-sm border-b-2 transition-colors ${activeTab === tab.id ? 'border-[#10B981] text-[#10B981]' : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'}`}
                                style={{ fontWeight: activeTab === tab.id ? 600 : 400 }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]">
                            <Download className="w-4 h-4" /> Export
                        </button>
                        {activeTab === 'payroll' && (
                            <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[#10B981] text-white rounded-lg hover:bg-[#059669]" onClick={() => setShowLogPayrollModal(true)}>
                                <Plus className="w-4 h-4" /> Log Payroll
                            </button>
                        )}
                        {activeTab === 'invoicing' && (
                            <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[#10B981] text-white rounded-lg hover:bg-[#059669]" onClick={() => setShowNewInvoiceModal(true)}>
                                <Plus className="w-4 h-4" /> New Invoice
                            </button>
                        )}
                    </div>
                </div>

                {activeTab === 'payroll' && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#E5E7EB]">
                                    {['ID', 'Locum', 'Period', 'Shifts', 'Hours', 'Gross Pay', 'Tax (20%)', 'PRSI (4%)', 'Net Pay', 'Status', 'Pay Date'].map(h => (
                                        <th key={h} className="px-4 py-2.5 text-left text-xs text-[#9CA3AF]" style={{ fontWeight: 500 }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {payrollItems.map(p => {
                                    const sc = payStatusConfig[p.status];
                                    return (
                                        <tr
                                            key={p.id}
                                            className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] cursor-pointer group"
                                            onClick={() => {
                                                setSelectedPayroll(p);
                                                setShowPayrollDetail(true);
                                            }}
                                        >
                                            <td className="px-4 py-3 text-xs text-[#6B7280]">{p.id}</td>
                                            <td className="px-4 py-3 text-sm text-[#1F2937] group-hover:text-[#10B981] transition-colors">{p.locum}</td>
                                            <td className="px-4 py-3 text-xs text-[#6B7280]">{p.period}</td>
                                            <td className="px-4 py-3 text-xs text-[#1F2937]">{p.shifts}</td>
                                            <td className="px-4 py-3 text-xs text-[#1F2937]">{p.hours}h</td>
                                            <td className="px-4 py-3 text-sm text-[#1F2937]">€{p.grossPay.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-xs text-[#DC2626]">-€{p.tax.toFixed(2)}</td>
                                            <td className="px-4 py-3 text-xs text-[#DC2626]">-€{p.prsi.toFixed(2)}</td>
                                            <td className="px-4 py-3 text-sm text-[#1F2937]" style={{ fontWeight: 700 }}>€{p.netPay.toFixed(2)}</td>
                                            <td className="px-4 py-3">
                                                <span className="px-2 py-1 rounded-full text-[11px] border" style={{ backgroundColor: sc.bg, color: sc.color, borderColor: sc.border }}>{sc.label}</span>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-[#6B7280]">{p.payDate}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot>
                                <tr className="bg-[#F9FAFB]">
                                    <td className="px-4 py-3 text-xs text-[#1F2937]" style={{ fontWeight: 700 }} colSpan={4}>TOTAL</td>
                                    <td className="px-4 py-3 text-xs text-[#1F2937]" style={{ fontWeight: 600 }}>{payrollItems.reduce((s, p) => s + p.hours, 0)}h</td>
                                    <td className="px-4 py-3 text-sm text-[#1F2937]" style={{ fontWeight: 700 }}>€{totalGross.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-xs text-[#DC2626]" style={{ fontWeight: 600 }}>-€{payrollItems.reduce((s, p) => s + p.tax, 0).toFixed(2)}</td>
                                    <td className="px-4 py-3 text-xs text-[#DC2626]" style={{ fontWeight: 600 }}>-€{payrollItems.reduce((s, p) => s + p.prsi, 0).toFixed(2)}</td>
                                    <td className="px-4 py-3 text-sm text-[#10B981]" style={{ fontWeight: 700 }}>€{totalNet.toFixed(2)}</td>
                                    <td colSpan={2}></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}

                {activeTab === 'invoicing' && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#E5E7EB]">
                                    {['Invoice #', 'Client', 'Amount', 'Shifts', 'Issue Date', 'Due Date', 'Status', 'Action'].map(h => (
                                        <th key={h} className="px-4 py-2.5 text-left text-xs text-[#9CA3AF]" style={{ fontWeight: 500 }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map(inv => {
                                    const sc = invStatusConfig[inv.status];
                                    return (
                                        <tr key={inv.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                                            <td className="px-4 py-3 text-sm text-[#1F2937]" style={{ fontWeight: 500 }}>{inv.id}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-3.5 h-3.5 text-[#9CA3AF]" />
                                                    <span className="text-sm text-[#1F2937]">{inv.client}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-[#1F2937]" style={{ fontWeight: 700 }}>€{inv.amount.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-xs text-[#6B7280]">{inv.shifts}</td>
                                            <td className="px-4 py-3 text-xs text-[#6B7280]">{inv.issueDate}</td>
                                            <td className="px-4 py-3 text-xs text-[#6B7280]">{inv.dueDate}</td>
                                            <td className="px-4 py-3">
                                                <span className="px-2 py-1 rounded-full text-[11px] border" style={{ backgroundColor: sc.bg, color: sc.color, borderColor: sc.border }}>{sc.label}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedInvoice(inv);
                                                            setShowInvoiceDetail(true);
                                                        }}
                                                        className="p-1.5 rounded-lg hover:bg-[#F3F4F6] text-[#6B7280]"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </button>
                                                    {inv.status === 'draft' && (
                                                        <button className="p-1.5 rounded-lg hover:bg-[#D1FAE5] text-[#10B981]"><Send className="w-3.5 h-3.5" /></button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'financial' && (
                    <div className="p-5 space-y-5">
                        <div className="grid grid-cols-4 gap-4">
                            {[
                                { label: 'Revenue MTD', value: '€368,200', change: '+18%', up: true },
                                { label: 'Profit Margin', value: '33.4%', change: '+2.1%', up: true },
                                { label: 'Avg Cost/Shift', value: '€486', change: '-€12', up: true },
                                { label: 'Revenue/Client', value: '€2,360', change: '+€180', up: true },
                            ].map(m => (
                                <div key={m.label} className="p-4 bg-[#F9FAFB] rounded-lg">
                                    <p className="text-xs text-[#9CA3AF]">{m.label}</p>
                                    <p className="text-xl text-[#1F2937] mt-1" style={{ fontWeight: 700 }}>{m.value}</p>
                                    <span className="text-xs text-[#10B981] flex items-center gap-0.5 mt-1">
                                        <ArrowUp className="w-3 h-3" /> {m.change}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div>
                            <h4 className="text-[#1F2937] mb-3">Profit Margins (€k)</h4>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={profitData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                                    <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '12px' }} formatter={(v: number) => [`€${v}k`, '']} />
                                    <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} name="Revenue" />
                                    <Bar dataKey="cost" fill="#E5E7EB" radius={[4, 4, 0, 0]} name="Cost" />
                                    <Bar dataKey="profit" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Profit" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>

            {/* New Invoice Modal */}
            {showNewInvoiceModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
                    <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between sticky top-0 bg-white z-10">
                            <h3 className="text-[#1F2937]" style={{ fontWeight: 600 }}>Create New Invoice</h3>
                            <button onClick={() => setShowNewInvoiceModal(false)} className="p-2 hover:bg-[#F3F4F6] rounded-lg">
                                <X className="w-5 h-5 text-[#6B7280]" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Invoice Details */}
                            <div>
                                <h4 className="text-sm text-[#1F2937] mb-3" style={{ fontWeight: 600 }}>Invoice Information</h4>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs text-[#6B7280] mb-1" style={{ fontWeight: 500 }}>Invoice Number <span className="text-[#EF4444]">*</span></label>
                                        <input
                                            type="text"
                                            placeholder="INV-2026-046"
                                            className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            value={invoiceForm.invoiceNumber}
                                            onChange={(e) => setInvoiceForm({ ...invoiceForm, invoiceNumber: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-[#6B7280] mb-1" style={{ fontWeight: 500 }}>Issue Date <span className="text-[#EF4444]">*</span></label>
                                        <input
                                            type="date"
                                            className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            value={invoiceForm.issueDate}
                                            onChange={(e) => setInvoiceForm({ ...invoiceForm, issueDate: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-[#6B7280] mb-1" style={{ fontWeight: 500 }}>Due Date <span className="text-[#EF4444]">*</span></label>
                                        <input
                                            type="date"
                                            className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            value={invoiceForm.dueDate}
                                            onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Client Details */}
                            <div>
                                <h4 className="text-sm text-[#1F2937] mb-3" style={{ fontWeight: 600 }}>Client Details</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-[#6B7280] mb-1" style={{ fontWeight: 500 }}>Client Name <span className="text-[#EF4444]">*</span></label>
                                        <select
                                            className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            value={invoiceForm.client}
                                            onChange={(e) => setInvoiceForm({ ...invoiceForm, client: e.target.value })}
                                        >
                                            <option value="">Select client...</option>
                                            <option value="St. James's Hospital">St. James's Hospital</option>
                                            <option value="Cork University Hospital">Cork University Hospital</option>
                                            <option value="Galway Clinic">Galway Clinic</option>
                                            <option value="Mater Hospital">Mater Hospital</option>
                                            <option value="Beaumont Hospital">Beaumont Hospital</option>
                                            <option value="Beacon Hospital">Beacon Hospital</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-[#6B7280] mb-1" style={{ fontWeight: 500 }}>Reference / PO Number</label>
                                        <input
                                            type="text"
                                            placeholder="Optional reference"
                                            className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            value={invoiceForm.reference}
                                            onChange={(e) => setInvoiceForm({ ...invoiceForm, reference: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Line Items */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>Line Items</h4>
                                    <button
                                        type="button"
                                        onClick={addLineItem}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#10B981] border border-[#10B981] rounded-lg hover:bg-[#ECFDF5]"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Add Line
                                    </button>
                                </div>
                                <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                                                <th className="px-3 py-2 text-left text-xs text-[#9CA3AF]" style={{ fontWeight: 500 }}>Description</th>
                                                <th className="px-3 py-2 text-left text-xs text-[#9CA3AF] w-24" style={{ fontWeight: 500 }}>Qty</th>
                                                <th className="px-3 py-2 text-left text-xs text-[#9CA3AF] w-32" style={{ fontWeight: 500 }}>Rate (€)</th>
                                                <th className="px-3 py-2 text-left text-xs text-[#9CA3AF] w-32" style={{ fontWeight: 500 }}>Amount (€)</th>
                                                <th className="px-3 py-2 w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {invoiceForm.lineItems.map((item, index) => (
                                                <tr key={index} className="border-b border-[#F3F4F6]">
                                                    <td className="px-3 py-2">
                                                        <input
                                                            type="text"
                                                            placeholder="e.g., Locum services - General Surgery"
                                                            className="w-full px-2 py-1.5 text-sm border border-[#E5E7EB] rounded focus:outline-none focus:ring-1 focus:ring-[#10B981]"
                                                            value={item.description}
                                                            onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            className="w-full px-2 py-1.5 text-sm border border-[#E5E7EB] rounded focus:outline-none focus:ring-1 focus:ring-[#10B981]"
                                                            value={item.quantity}
                                                            onChange={(e) => updateLineItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            className="w-full px-2 py-1.5 text-sm border border-[#E5E7EB] rounded focus:outline-none focus:ring-1 focus:ring-[#10B981]"
                                                            value={item.rate}
                                                            onChange={(e) => updateLineItem(index, 'rate', parseFloat(e.target.value) || 0)}
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <div className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>
                                                            €{(item.quantity * item.rate).toFixed(2)}
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeLineItem(index)}
                                                            disabled={invoiceForm.lineItems.length === 1}
                                                            className="p-1.5 rounded hover:bg-[#FEE2E2] text-[#DC2626] disabled:opacity-30 disabled:hover:bg-transparent"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* VAT & Payment Terms */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm text-[#1F2937] mb-3" style={{ fontWeight: 600 }}>VAT Details</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                id="vatRegistered"
                                                className="w-4 h-4 text-[#10B981] border-[#E5E7EB] rounded focus:ring-[#10B981]"
                                                checked={invoiceForm.vatRegistered}
                                                onChange={(e) => setInvoiceForm({ ...invoiceForm, vatRegistered: e.target.checked })}
                                            />
                                            <label htmlFor="vatRegistered" className="text-sm text-[#1F2937]">
                                                VAT Registered
                                            </label>
                                        </div>
                                        {invoiceForm.vatRegistered && (
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1" style={{ fontWeight: 500 }}>VAT Rate (%)</label>
                                                <select
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                                    value={invoiceForm.vatRate}
                                                    onChange={(e) => setInvoiceForm({ ...invoiceForm, vatRate: e.target.value })}
                                                >
                                                    <option value="0">0% - Zero Rated</option>
                                                    <option value="9">9% - Reduced Rate</option>
                                                    <option value="13.5">13.5% - Reduced Rate</option>
                                                    <option value="23">23% - Standard Rate</option>
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm text-[#1F2937] mb-3" style={{ fontWeight: 600 }}>Payment Terms</h4>
                                    <div>
                                        <label className="block text-xs text-[#6B7280] mb-1" style={{ fontWeight: 500 }}>Payment Terms (Days)</label>
                                        <select
                                            className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            value={invoiceForm.paymentTerms}
                                            onChange={(e) => setInvoiceForm({ ...invoiceForm, paymentTerms: e.target.value })}
                                        >
                                            <option value="0">Due on Receipt</option>
                                            <option value="7">Net 7 Days</option>
                                            <option value="14">Net 14 Days</option>
                                            <option value="30">Net 30 Days</option>
                                            <option value="60">Net 60 Days</option>
                                            <option value="90">Net 90 Days</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <h4 className="text-sm text-[#1F2937] mb-3" style={{ fontWeight: 600 }}>Additional Notes</h4>
                                <textarea
                                    rows={3}
                                    placeholder="Add any additional notes or payment instructions..."
                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                    value={invoiceForm.notes}
                                    onChange={(e) => setInvoiceForm({ ...invoiceForm, notes: e.target.value })}
                                />
                            </div>

                            {/* Invoice Summary */}
                            <div className="border-t border-[#E5E7EB] pt-4">
                                <div className="bg-[#F9FAFB] rounded-lg p-4">
                                    <h4 className="text-sm text-[#1F2937] mb-3" style={{ fontWeight: 600 }}>Invoice Summary</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#6B7280]">Subtotal:</span>
                                            <span className="text-[#1F2937]" style={{ fontWeight: 600 }}>€{subtotal.toFixed(2)}</span>
                                        </div>
                                        {invoiceForm.vatRegistered && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-[#6B7280]">VAT ({invoiceForm.vatRate}%):</span>
                                                <span className="text-[#1F2937]" style={{ fontWeight: 600 }}>€{vatAmount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="border-t border-[#E5E7EB] pt-2 mt-2">
                                            <div className="flex justify-between">
                                                <span className="text-[#1F2937]" style={{ fontWeight: 600 }}>Total Amount:</span>
                                                <span className="text-lg text-[#10B981]" style={{ fontWeight: 700 }}>€{totalAmount.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-5 border-t border-[#E5E7EB] flex justify-end gap-2 sticky bottom-0 bg-white">
                            <button
                                type="button"
                                onClick={() => setShowNewInvoiceModal(false)}
                                className="px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg text-sm hover:bg-[#F9FAFB]"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg text-sm hover:bg-[#F9FAFB]"
                            >
                                Save as Draft
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    console.log('Invoice created:', invoiceForm);
                                    setShowNewInvoiceModal(false);
                                }}
                                className="px-4 py-2 bg-[#10B981] text-white rounded-lg text-sm hover:bg-[#059669] flex items-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Create & Send Invoice
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Invoice Detail Modal */}
            {showInvoiceDetail && selectedInvoice && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
                    <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
                        {/* Header */}
                        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#ECFDF5] text-[#10B981] rounded-lg flex items-center justify-center">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-[#1F2937] text-lg" style={{ fontWeight: 700 }}>Invoice {selectedInvoice.id}</h3>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-xs text-[#6B7280]">Issued on {selectedInvoice.issueDate}</span>
                                        <span className="w-1 h-1 bg-[#D1D5DB] rounded-full"></span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] border font-semibold`}
                                            style={{
                                                backgroundColor: invStatusConfig[selectedInvoice.status].bg,
                                                color: invStatusConfig[selectedInvoice.status].color,
                                                borderColor: invStatusConfig[selectedInvoice.status].border
                                            }}>
                                            {invStatusConfig[selectedInvoice.status].label}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]">
                                    <Download className="w-4 h-4" /> Download PDF
                                </button>
                                <button onClick={() => setShowInvoiceDetail(false)} className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors">
                                    <X className="w-5 h-5 text-[#6B7280]" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
                            <div className="max-w-3xl mx-auto space-y-8 bg-white p-10 rounded-xl shadow-sm border border-[#E5E7EB]">
                                {/* Branding & Status */}
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h1 className="text-2xl font-black text-[#10B981] tracking-tighter">MPLOYUS</h1>
                                        <p className="text-xs text-[#6B7280] font-medium tracking-widest uppercase">Locum Management Solutions</p>
                                    </div>
                                    <div className="text-right">
                                        <h2 className="text-3xl font-bold text-[#1F2937] uppercase tracking-tight">INVOICE</h2>
                                        <p className="text-sm text-[#6B7280] mt-1 font-mono">{selectedInvoice.id}</p>
                                    </div>
                                </div>

                                {/* Invoice Meta */}
                                <div className="flex justify-between items-start border-y border-[#F3F4F6] py-8">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider mb-2">Issued By</p>
                                            <div className="space-y-1">
                                                <p className="text-sm text-[#1F2937]" style={{ fontWeight: 700 }}>Mployus Locum Solutions Ltd.</p>
                                                <p className="text-xs text-[#6B7280]">123 Business Park, Dublin 2</p>
                                                <p className="text-xs text-[#6B7280]">Ireland</p>
                                                <p className="text-xs text-[#6B7280]">VAT ID: IE 9876543A</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-4">
                                        <div>
                                            <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider mb-2">Billed To</p>
                                            <div className="space-y-1">
                                                <p className="text-sm text-[#1F2937]" style={{ fontWeight: 700 }}>{selectedInvoice.client}</p>
                                                <p className="text-xs text-[#6B7280]">Accounts Payable Department</p>
                                                <p className="text-xs text-[#6B7280]">Health Service Executive</p>
                                                <p className="text-xs text-[#6B7280]">Dublin, Ireland</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-6 py-6 border-b border-[#F3F4F6]">
                                    <div>
                                        <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider mb-1">Invoice Date</p>
                                        <p className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>{selectedInvoice.issueDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider mb-1">Due Date</p>
                                        <p className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>{selectedInvoice.dueDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider mb-1">Reference</p>
                                        <p className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>PO-2026-X892</p>
                                    </div>
                                </div>

                                {/* Items Table */}
                                <div>
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b-2 border-[#1F2937]">
                                                <th className="py-3 text-left text-[10px] text-[#1F2937] font-black uppercase tracking-wider">Description</th>
                                                <th className="py-3 text-center text-[10px] text-[#1F2937] font-black uppercase tracking-wider w-20">Qty</th>
                                                <th className="py-3 text-right text-[10px] text-[#1F2937] font-black uppercase tracking-wider w-32">Rate</th>
                                                <th className="py-3 text-right text-[10px] text-[#1F2937] font-black uppercase tracking-wider w-32">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#F3F4F6]">
                                            {[
                                                { desc: 'Professional Locum Medical Services', qty: selectedInvoice.shifts, rate: selectedInvoice.amount / selectedInvoice.shifts * 0.85, amount: selectedInvoice.amount * 0.85 },
                                                { desc: 'Administrative & Agency Processing Fee', qty: 1, rate: selectedInvoice.amount * 0.15, amount: selectedInvoice.amount * 0.15 },
                                            ].map((item, i) => (
                                                <tr key={i}>
                                                    <td className="py-4">
                                                        <p className="text-sm text-[#1F2937] font-bold">{item.desc}</p>
                                                        <p className="text-xs text-[#6B7280] mt-0.5 italic">Services provided for locum shift period: Feb 2026</p>
                                                    </td>
                                                    <td className="py-4 text-center text-sm text-[#1F2937] font-medium">{item.qty}</td>
                                                    <td className="py-4 text-right text-sm text-[#1F2937]">€{item.rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                    <td className="py-4 text-right text-sm text-[#1F2937]" style={{ fontWeight: 700 }}>€{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Totals */}
                                <div className="flex justify-end pt-4">
                                    <div className="w-72 space-y-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#6B7280] font-medium">Subtotal</span>
                                            <span className="text-[#1F2937] font-bold">€{(selectedInvoice.amount / 1.23).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#6B7280] font-medium">VAT (23%)</span>
                                            <span className="text-[#1F2937] font-bold">€{(selectedInvoice.amount - (selectedInvoice.amount / 1.23)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-4 px-4 bg-[#10B981] text-white rounded-lg shadow-sm">
                                            <span className="text-sm font-black uppercase tracking-widest">Total Amount Due</span>
                                            <span className="text-2xl font-black">€{selectedInvoice.amount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Info */}
                                <div className="pt-8 border-t border-[#F3F4F6] grid grid-cols-2 gap-8">
                                    <div>
                                        <h5 className="text-[10px] text-[#1F2937] font-black uppercase tracking-widest mb-3">Bank Details</h5>
                                        <div className="space-y-1 text-xs text-[#6B7280]">
                                            <p className="flex justify-between"><span className="font-bold text-[#1F2937]">Bank:</span> Bank of Ireland</p>
                                            <p className="flex justify-between"><span className="font-bold text-[#1F2937]">IBAN:</span> IE49 BOFI 9000 0123 4567 89</p>
                                            <p className="flex justify-between"><span className="font-bold text-[#1F2937]">BIC:</span> BOFIIE2D</p>
                                        </div>
                                    </div>
                                    <div className="text-xs text-[#6B7280] leading-relaxed italic">
                                        <p>Notes: Please settle this invoice within 30 days of issuance. Late payments may be subject to statutory interest as per the European Communities (Late Payment in Commercial Transactions) Regulations.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-5 border-t border-[#E5E7EB] bg-[#F9FAFB] flex justify-end gap-3 shrink-0">
                            <button
                                onClick={() => setShowInvoiceDetail(false)}
                                className="px-6 py-2.5 text-sm text-[#6B7280] font-bold hover:text-[#1F2937] transition-colors"
                            >
                                Close
                            </button>
                            {selectedInvoice.status !== 'paid' && (
                                <button className="px-6 py-2.5 bg-[#10B981] text-white rounded-lg text-sm font-black hover:bg-[#059669] flex items-center gap-2 shadow-md shadow-emerald-100 transition-all active:scale-95">
                                    <Send className="w-4 h-4" /> Send Reminder
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Log Payroll Modal */}
            {showLogPayrollModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
                    <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
                            <h3 className="text-[#1F2937]" style={{ fontWeight: 600 }}>Log Locum Payroll</h3>
                            <button onClick={() => setShowLogPayrollModal(false)} className="p-2 hover:bg-[#F3F4F6] rounded-lg">
                                <X className="w-5 h-5 text-[#6B7280]" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs text-[#6B7280] mb-1">Select Locum Professional</label>
                                    <select className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#10B981]">
                                        <option>Select locum...</option>
                                        <option>Dr. Sarah Mitchell</option>
                                        <option>Dr. James Harrison</option>
                                        <option>Dr. Emily Chen</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-[#6B7280] mb-1">Pay Period Start</label>
                                    <input type="date" className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#10B981]" />
                                </div>
                                <div>
                                    <label className="block text-xs text-[#6B7280] mb-1">Pay Period End</label>
                                    <input type="date" className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#10B981]" />
                                </div>
                                <div>
                                    <label className="block text-xs text-[#6B7280] mb-1">Hours Worked</label>
                                    <input type="number" placeholder="0.00" className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#10B981]" />
                                </div>
                                <div>
                                    <label className="block text-xs text-[#6B7280] mb-1">Hourly Rate (€)</label>
                                    <input type="number" placeholder="0.00" className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#10B981]" />
                                </div>
                            </div>
                            <div className="bg-[#F9FAFB] p-4 rounded-lg space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#6B7280]">Gross Calculation</span>
                                    <span className="font-bold text-[#1F2937]">€0.00</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-[#6B7280]">Estimated Tax (20%)</span>
                                    <span className="text-[#DC2626]">-€0.00</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-[#6B7280]">Estimated PRSI (4%)</span>
                                    <span className="text-[#DC2626]">-€0.00</span>
                                </div>
                                <div className="flex justify-between border-t border-[#E5E7EB] pt-2 mt-2">
                                    <span className="text-sm font-bold text-[#1F2937]">Estimated Net Pay</span>
                                    <span className="text-sm font-bold text-[#10B981]">€0.00</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-5 border-t border-[#E5E7EB] bg-[#F9FAFB] flex justify-end gap-3">
                            <button onClick={() => setShowLogPayrollModal(false)} className="px-4 py-2 text-sm text-[#6B7280] font-medium">Cancel</button>
                            <button className="px-4 py-2 bg-[#10B981] text-white rounded-lg text-sm font-bold hover:bg-[#059669]">Log Payment Record</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payroll Detail Modal (Locum Invoice) */}
            {showPayrollDetail && selectedPayroll && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
                    <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
                        {/* Header */}
                        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#DBEAFE] text-[#3B82F6] rounded-lg flex items-center justify-center">
                                    <Receipt className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-[#1F2937] text-lg" style={{ fontWeight: 700 }}>Locum Payment Advice: {selectedPayroll.id}</h3>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-xs text-[#6B7280]">Period: {selectedPayroll.period}</span>
                                        <span className="w-1 h-1 bg-[#D1D5DB] rounded-full"></span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] border font-semibold`}
                                            style={{
                                                backgroundColor: payStatusConfig[selectedPayroll.status].bg,
                                                color: payStatusConfig[selectedPayroll.status].color,
                                                borderColor: payStatusConfig[selectedPayroll.status].border
                                            }}>
                                            {payStatusConfig[selectedPayroll.status].label}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]">
                                    <Download className="w-4 h-4" /> Download Statement
                                </button>
                                <button onClick={() => setShowPayrollDetail(false)} className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors">
                                    <X className="w-5 h-5 text-[#6B7280]" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
                            <div className="max-w-3xl mx-auto space-y-8 bg-white p-10 rounded-xl shadow-sm border border-[#E5E7EB]">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h1 className="text-xl font-black text-[#1F2937] tracking-tight">MPLOYUS PAYROLL</h1>
                                        <p className="text-[10px] text-[#6B7280] font-bold tracking-widest uppercase mt-1">Locum Remittance Advice</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-[#9CA3AF] uppercase font-bold tracking-widest">Statement Date</p>
                                        <p className="text-sm text-[#1F2937] font-bold">{selectedPayroll.payDate}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-12 py-8 border-y border-[#F3F4F6]">
                                    <div>
                                        <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider mb-2">Agency Details</p>
                                        <div className="text-xs space-y-1">
                                            <p className="font-bold text-[#1F2937]">Mployus Locum Solutions Ltd.</p>
                                            <p className="text-[#6B7280]">123 Business Park, Dublin 2</p>
                                            <p className="text-[#6B7280]">Ireland</p>
                                            <p className="text-[#6B7280]">Employer Reg: 8274920L</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider mb-2">Recipient</p>
                                        <div className="text-xs space-y-1">
                                            <p className="font-bold text-[#1F2937]">{selectedPayroll.locum}</p>
                                            <p className="text-[#6B7280]">PPS No: 1234567FA</p>
                                            <p className="text-[#6B7280]">Medical Registration: MC9988</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs text-[#1F2937] font-black uppercase tracking-widest mb-4">Earnings Breakdown</h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-sm py-2 border-b border-dashed border-[#E5E7EB]">
                                            <div>
                                                <p className="font-bold text-[#1F2937]">Professional Services ({selectedPayroll.hours} Hours)</p>
                                                <p className="text-xs text-[#6B7280]">Locum shifts across {selectedPayroll.shifts} scheduled slots</p>
                                            </div>
                                            <span className="font-bold text-[#1F2937]">€{selectedPayroll.grossPay.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-xs text-[#1F2937] font-black uppercase tracking-widest">Deductions & Statutory</h4>
                                    <div className="space-y-2 bg-[#F9FAFB] p-4 rounded-lg">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#6B7280]">PAYE Income Tax (20%)</span>
                                            <span className="text-[#DC2626] font-medium">-€{selectedPayroll.tax.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#6B7280]">PRSI (Employee Contribution)</span>
                                            <span className="text-[#DC2626] font-medium">-€{selectedPayroll.prsi.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between border-t border-[#E5E7EB] pt-2 mt-2">
                                            <span className="text-sm font-black text-[#1F2937]">Total Deductions</span>
                                            <span className="text-sm font-bold text-[#DC2626]">-€{(selectedPayroll.tax + selectedPayroll.prsi).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <div className="w-full bg-[#10B981] text-white rounded-xl p-6 shadow-lg shadow-emerald-100 flex justify-between items-center">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Net Amount Transferable</p>
                                            <h2 className="text-3xl font-black">€{selectedPayroll.netPay.toLocaleString()}</h2>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Payment Method</p>
                                            <p className="text-sm font-bold">SEPA Bank Transfer</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 text-[10px] text-[#9CA3AF] leading-relaxed italic border-t border-[#F3F4F6]">
                                    <p>This document serves as a remittance advice and is not a valid tax invoice. Statutory contributions are calculated based on current Revenue Ireland guidelines for locum practitioners.</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-5 border-t border-[#E5E7EB] bg-[#F9FAFB] flex justify-end gap-3 shrink-0">
                            <button
                                onClick={() => setShowPayrollDetail(false)}
                                className="px-6 py-2.5 text-sm text-[#6B7280] font-bold hover:text-[#1F2937] transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}