import { useState, useEffect } from 'react';
import { locumService } from '../services/locumService';
import { Locum } from '../types';
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
    { id: 'PAY-001', locum: 'Sarah Mitchell', period: 'Feb 1-15, 2026', shifts: 6, hours: 52, baseRate: 55, grossPay: 2860, tax: 572, prsi: 114.40, netPay: 2173.60, status: 'processed', payDate: '2026-02-20' },
    { id: 'PAY-002', locum: 'James Harrison', period: 'Feb 1-15, 2026', shifts: 5, hours: 56, baseRate: 60, grossPay: 3360, tax: 672, prsi: 134.40, netPay: 2553.60, status: 'processed', payDate: '2026-02-20' },
    { id: 'PAY-003', locum: 'Emily Chen', period: 'Feb 1-15, 2026', shifts: 4, hours: 40, baseRate: 58, grossPay: 2320, tax: 464, prsi: 92.80, netPay: 1763.20, status: 'pending', payDate: '2026-02-20' },
    { id: 'PAY-004', locum: 'Michael Brooks', period: 'Feb 1-15, 2026', shifts: 3, hours: 36, baseRate: 52, grossPay: 1872, tax: 374.40, prsi: 74.88, netPay: 1422.72, status: 'on_hold', payDate: '2026-02-20' },
    { id: 'PAY-005', locum: 'Rachel Martinez', period: 'Feb 1-15, 2026', shifts: 5, hours: 48, baseRate: 55, grossPay: 2640, tax: 528, prsi: 105.60, netPay: 2006.40, status: 'pending', payDate: '2026-02-20' },
    { id: 'PAY-006', locum: 'David Thompson', period: 'Feb 1-15, 2026', shifts: 4, hours: 40, baseRate: 52, grossPay: 2080, tax: 416, prsi: 83.20, netPay: 1580.80, status: 'processed', payDate: '2026-02-20' },
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
    const [locumsList, setLocumsList] = useState<Locum[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');

    useEffect(() => {
        const fetchLocums = async () => {
            try {
                const data = await locumService.getAllLocums();
                setLocumsList(data);
            } catch (err) {
                console.error('Failed to load locums', err);
            }
        };
        fetchLocums();
    }, []);

    const departments = [...new Set(locumsList.map(l => l.department).filter(Boolean))];
    const filteredLocums = selectedDepartment
        ? locumsList.filter(l => l.department === selectedDepartment)
        : locumsList;

    const [payrollForm, setPayrollForm] = useState({
        id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
        locum: '',
        period: '',
        shifts: 0,
        hours: 0,
        baseRate: 0,
        grossPay: 0,
        tax: 0,
        prsi: 0,
        netPay: 0,
        payDate: new Date().toISOString().split('T')[0],
        status: 'pending' as 'processed' | 'pending' | 'on_hold'
    });

    const calculatePayroll = (field: string, value: any) => {
        const updated = { ...payrollForm, [field]: value };

        if (field === 'hours' || field === 'baseRate') {
            updated.grossPay = updated.hours * updated.baseRate;
        }

        updated.tax = updated.grossPay * 0.20;
        updated.prsi = updated.grossPay * 0.04;
        updated.netPay = updated.grossPay - updated.tax - updated.prsi;

        setPayrollForm(updated);
    };

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

            {/* Updated Log Payroll Modal */}
            {showLogPayrollModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
                    <div className="bg-white rounded-xl w-full max-w-4xl shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#D1FAE5] text-[#10B981] rounded-lg">
                                    <Wallet className="w-5 h-5" />
                                </div>
                                <h3 className="text-[#1F2937]" style={{ fontWeight: 700 }}>Log Locum Payroll</h3>
                            </div>
                            <button onClick={() => setShowLogPayrollModal(false)} className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors">
                                <X className="w-5 h-5 text-[#6B7280]" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                {/* Left Column: Basic Info */}
                                <div className="space-y-6">
                                    <h4 className="text-xs font-black text-[#1F2937] uppercase tracking-widest border-b border-[#F3F4F6] pb-2">Record Details</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Payroll ID</label>
                                            <input
                                                type="text"
                                                value={payrollForm.id}
                                                readOnly
                                                className="w-full px-4 py-2.5 text-sm border border-[#E5E7EB] rounded-lg bg-[#F9FAFB] text-[#6B7280] outline-none font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Payroll Status</label>
                                            <select
                                                value={payrollForm.status}
                                                onChange={(e) => calculatePayroll('status', e.target.value)}
                                                className="w-full px-4 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#10B981] outline-none"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="processed">Processed</option>
                                                <option value="on_hold">On Hold</option>
                                            </select>
                                        </div>
                                    </div>

                                    <h4 className="text-xs font-black text-[#1F2937] uppercase tracking-widest border-b border-[#F3F4F6] pb-2">Professional & Period</h4>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Department</label>
                                            <select
                                                value={selectedDepartment}
                                                onChange={(e) => {
                                                    setSelectedDepartment(e.target.value);
                                                    calculatePayroll('locum', '');
                                                }}
                                                className="w-full px-4 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#10B981] outline-none transition-all"
                                            >
                                                <option value="">All Departments</option>
                                                {departments.map(dept => (
                                                    <option key={dept} value={dept}>{dept}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Locum Professional</label>
                                            <select
                                                value={payrollForm.locum}
                                                onChange={(e) => calculatePayroll('locum', e.target.value)}
                                                className="w-full px-4 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#10B981] outline-none transition-all"
                                            >
                                                <option value="">Select Locum...</option>
                                                {filteredLocums.map(l => (
                                                    <option key={l.id} value={l.name}>{l.name} ({l.specialty})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Payroll Period</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Feb 1-15, 2026"
                                                    value={payrollForm.period}
                                                    onChange={(e) => calculatePayroll('period', e.target.value)}
                                                    className="w-full px-4 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#10B981] outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Pay Date</label>
                                                <input
                                                    type="date"
                                                    value={payrollForm.payDate}
                                                    onChange={(e) => calculatePayroll('payDate', e.target.value)}
                                                    className="w-full px-4 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#10B981] outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <h4 className="text-xs font-black text-[#1F2937] uppercase tracking-widest border-b border-[#F3F4F6] pb-2">Work Metrics</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Total Shifts</label>
                                            <input
                                                type="number"
                                                value={payrollForm.shifts || ''}
                                                onChange={(e) => calculatePayroll('shifts', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#10B981] outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Total Hours</label>
                                            <input
                                                type="number"
                                                value={payrollForm.hours || ''}
                                                onChange={(e) => calculatePayroll('hours', parseFloat(e.target.value) || 0)}
                                                className="w-full px-4 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#10B981] outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Financial Breakdown */}
                                <div className="space-y-6">
                                    <h4 className="text-xs font-black text-[#1F2937] uppercase tracking-widest border-b border-[#F3F4F6] pb-2 text-right">Compensation & Statutory Deductions</h4>

                                    <div className="grid grid-cols-1 gap-4 mb-4">
                                        <div className="text-right">
                                            <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Base Hourly Rate (€)</label>
                                            <input
                                                type="number"
                                                value={payrollForm.baseRate || ''}
                                                onChange={(e) => calculatePayroll('baseRate', parseFloat(e.target.value) || 0)}
                                                className="w-32 px-4 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#10B981] outline-none text-right ml-auto"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-[#E5E7EB] space-y-4">
                                        <div className="flex justify-between items-center pb-4 border-b border-[#E5E7EB]">
                                            <span className="text-sm text-[#6B7280] font-medium uppercase tracking-tighter">Gross Pay</span>
                                            <span className="text-xl font-black text-[#1F2937]">€{payrollForm.grossPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                        </div>

                                        <div className="space-y-3 pt-2">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-[#6B7280]">Tax (20% PAYE)</span>
                                                <span className="text-[#DC2626] font-bold">-€{payrollForm.tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-[#6B7280]">PRSI (4% Employee)</span>
                                                <span className="text-[#DC2626] font-bold">-€{payrollForm.prsi.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                            </div>
                                        </div>

                                        <div className="pt-6 mt-4 border-t-2 border-dashed border-[#E5E7EB]">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-xs font-black text-[#10B981] uppercase tracking-tighter">Net Take-Home Pay</p>
                                                    <p className="text-[10px] text-[#9CA3AF]">Calculated Remittance Value</p>
                                                </div>
                                                <span className="text-3xl font-black text-[#10B981]">€{payrollForm.netPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                        <p className="text-[11px] text-[#059669] leading-relaxed">
                                            <strong>Audit Note:</strong> This payroll record (ID: {payrollForm.id}) includes all mandatory fields required for Irish Revenue compliance. Net pay is derived after statutory PAYE and PRSI deductions.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 border-t border-[#E5E7EB] flex justify-end gap-3 bg-[#F9FAFB] shrink-0">
                            <button
                                onClick={() => setShowLogPayrollModal(false)}
                                className="px-6 py-2.5 text-sm text-[#6B7280] font-bold hover:text-[#1F2937] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    console.log('Payroll logged:', payrollForm);
                                    setShowLogPayrollModal(false);
                                }}
                                className="px-8 py-2.5 bg-[#10B981] text-white rounded-lg text-sm font-bold hover:bg-[#059669] shadow-lg shadow-emerald-100 transition-all active:scale-95 flex items-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Commit to Ledger
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                                        <label className="block text-xs text-[#6B7280] mb-1" style={{ fontWeight: 500 }}>Invoice Number *</label>
                                        <input
                                            type="text"
                                            placeholder="INV-2026-046"
                                            className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            value={invoiceForm.invoiceNumber}
                                            onChange={(e) => setInvoiceForm({ ...invoiceForm, invoiceNumber: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-[#6B7280] mb-1" style={{ fontWeight: 500 }}>Issue Date *</label>
                                        <input
                                            type="date"
                                            className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            value={invoiceForm.issueDate}
                                            onChange={(e) => setInvoiceForm({ ...invoiceForm, issueDate: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-[#6B7280] mb-1" style={{ fontWeight: 500 }}>Due Date *</label>
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
                                        <label className="block text-xs text-[#6B7280] mb-1" style={{ fontWeight: 500 }}>Client Name *</label>
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

                            {/* Summary */}
                            <div className="bg-[#F9FAFB] rounded-lg p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#6B7280]">Subtotal:</span>
                                    <span className="text-[#1F2937]" style={{ fontWeight: 600 }}>€{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#1F2937]" style={{ fontWeight: 600 }}>Total Amount:</span>
                                    <span className="text-lg text-[#10B981]" style={{ fontWeight: 700 }}>€{totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

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
                                onClick={() => setShowNewInvoiceModal(false)}
                                className="px-4 py-2 bg-[#10B981] text-white rounded-lg text-sm hover:bg-[#059669] flex items-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Create Invoice
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Invoice Detail Modal */}
            {showInvoiceDetail && selectedInvoice && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
                    <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#ECFDF5] text-[#10B981] rounded-lg flex items-center justify-center">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <h3 className="text-[#1F2937] text-lg" style={{ fontWeight: 700 }}>Invoice {selectedInvoice.id}</h3>
                            </div>
                            <button onClick={() => setShowInvoiceDetail(false)} className="p-2 hover:bg-[#F3F4F6] rounded-lg">
                                <X className="w-5 h-5 text-[#6B7280]" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
                            <div className="max-w-3xl mx-auto bg-white p-10 rounded-xl shadow-sm border border-[#E5E7EB]">
                                <h1 className="text-2xl font-black text-[#10B981]">MPLOYUS</h1>
                                <p className="text-sm text-[#6B7280] mt-4">Invoice for {selectedInvoice.client}</p>
                                <div className="mt-8 border-t pt-8">
                                    <div className="flex justify-between">
                                        <span className="font-bold">Total Due:</span>
                                        <span className="text-xl font-black text-[#1F2937]">€{selectedInvoice.amount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Remittance Detail Modal */}
            {showPayrollDetail && selectedPayroll && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
                    <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#ECFDF5] text-[#10B981] rounded-lg">
                                    <Receipt className="w-5 h-5" />
                                </div>
                                <h3 className="text-[#1F2937]" style={{ fontWeight: 700 }}>Remittance Advice: {selectedPayroll.id}</h3>
                            </div>
                            <button onClick={() => setShowPayrollDetail(false)} className="p-2 hover:bg-[#F3F4F6] rounded-lg">
                                <X className="w-5 h-5 text-[#6B7280]" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-10 bg-[#F8FAFC]">
                            <div className="max-w-3xl mx-auto bg-white p-12 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-10">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h1 className="text-3xl font-black text-[#10B981] tracking-tighter">MPLOYUS</h1>
                                        <p className="text-[10px] text-[#6B7280] font-bold uppercase tracking-widest">Locum Payroll Remittance</p>
                                    </div>
                                    <div className="text-right">
                                        <h2 className="text-sm font-black text-[#1F2937] uppercase tracking-widest">Processed Date</h2>
                                        <p className="text-xl font-bold text-[#10B981]">{selectedPayroll.payDate}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-12 py-8 border-y border-[#F3F4F6]">
                                    <div className="space-y-4">
                                        <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-widest">Recipient Details</p>
                                        <div className="space-y-1">
                                            <p className="text-lg font-black text-[#1F2937]">{selectedPayroll.locum}</p>
                                            <p className="text-sm text-[#6B7280]">Period: {selectedPayroll.period}</p>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-4 border-l border-[#F3F4F6] pl-12">
                                        <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-widest">Net Payment</p>
                                        <p className="text-4xl font-black text-[#10B981]">€{selectedPayroll.netPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
