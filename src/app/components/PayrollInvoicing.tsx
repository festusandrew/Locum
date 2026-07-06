import { useState, useEffect } from 'react';
import { locumService } from '../services/locumService';
import { Locum, PayrollItem, Invoice } from '../types';
import { payrollService } from '../services/payrollService';
import { toast } from 'sonner';
import { Pagination } from './ui/Pagination';
import {
    Wallet, FileText, CreditCard, Download, Search, Eye, X,
    CheckCircle, Clock, AlertCircle, TrendingUp, ArrowUp, ArrowDown,
    Building2, Users, Receipt, Plus, Send, Trash2, ShieldCheck, Printer
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, LineChart, Line
} from 'recharts';

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
    const [payrollItems, setPayrollItems] = useState<PayrollItem[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
    const [showLogPayrollModal, setShowLogPayrollModal] = useState(false);
    const [showInvoiceDetail, setShowInvoiceDetail] = useState(false);
    const [showPayrollDetail, setShowPayrollDetail] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [selectedPayroll, setSelectedPayroll] = useState<PayrollItem | null>(null);
    const [locumsList, setLocumsList] = useState<Locum[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [payrollPage, setPayrollPage] = useState(1);
    const payrollPageSize = 5;
    const [invoicePage, setInvoicePage] = useState(1);
    const invoicePageSize = 5;

    useEffect(() => {
        setPayrollPage(1);
        setInvoicePage(1);
    }, [searchTerm, selectedDepartment]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [locums, payroll, invs] = await Promise.all([
                    locumService.getAllLocums(),
                    payrollService.getPayrollItems(),
                    payrollService.getInvoices()
                ]);
                setLocumsList(locums);
                setPayrollItems(payroll);
                setInvoices(invs);
            } catch (err) {
                console.error('Failed to load payroll and invoicing data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
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

    const handleUpdateInvoiceStatus = async (id: string, newStatus: Invoice['status']) => {
        try {
            const updated = await payrollService.updateInvoiceStatus(id, newStatus);
            setInvoices(prev => prev.map(inv => inv.id === id ? updated : inv));
            setSelectedInvoice(updated);
            toast.success(`Invoice status updated to ${newStatus}!`);
        } catch (err) {
            console.error("Update invoice status error:", err);
            toast.error("Failed to update invoice status");
        }
    };

    if (loading) {
        return (
            <div className="p-6 flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="w-8 h-8 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin font-medium"></div>
                <p className="text-sm text-[#6B7280]">Loading payroll and invoicing details...</p>
            </div>
        );
    }

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
                                {payrollItems.slice((payrollPage - 1) * payrollPageSize, payrollPage * payrollPageSize).map(p => {
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
                        <Pagination
                            currentPage={payrollPage}
                            totalItems={payrollItems.length}
                            pageSize={payrollPageSize}
                            onPageChange={setPayrollPage}
                        />
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
                                {invoices.slice((invoicePage - 1) * invoicePageSize, invoicePage * invoicePageSize).map(inv => {
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
                        <Pagination
                            currentPage={invoicePage}
                            totalItems={invoices.length}
                            pageSize={invoicePageSize}
                            onPageChange={setInvoicePage}
                        />
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
                                onClick={async () => {
                                    if (!payrollForm.locum) {
                                        toast.error("Please select a locum professional.");
                                        return;
                                    }
                                    try {
                                        const newItem = { ...payrollForm };
                                        const created = await payrollService.createPayrollItem(newItem);
                                        setPayrollItems(prev => [created, ...prev]);
                                        setShowLogPayrollModal(false);
                                        // Reset form
                                        setPayrollForm({
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
                                            status: 'pending'
                                        });
                                        toast.success("Payroll logged successfully!");
                                    } catch (err) {
                                        toast.error("Failed to log payroll item");
                                    }
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
                                onClick={async () => {
                                    if (!invoiceForm.client) {
                                        toast.error("Please select a client.");
                                        return;
                                    }
                                    try {
                                        const newInv: Invoice = {
                                            id: invoiceForm.invoiceNumber || `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
                                            client: invoiceForm.client,
                                            amount: totalAmount,
                                            issueDate: invoiceForm.issueDate || new Date().toISOString().split('T')[0],
                                            dueDate: invoiceForm.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                                            status: 'draft',
                                            shifts: invoiceForm.lineItems.reduce((acc, item) => acc + item.quantity, 0)
                                        };
                                        const created = await payrollService.createInvoice(newInv);
                                        setInvoices(prev => [created, ...prev]);
                                        setShowNewInvoiceModal(false);
                                        setInvoiceForm({
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
                                        toast.success("Invoice created successfully!");
                                    } catch (err) {
                                        toast.error("Failed to create invoice");
                                    }
                                }}
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
            {showInvoiceDetail && selectedInvoice && (() => {
                const subtotalAmt = selectedInvoice.amount / 1.23;
                const vatAmt = selectedInvoice.amount - subtotalAmt;
                const avgRate = subtotalAmt / selectedInvoice.shifts;
                const sc = invStatusConfig[selectedInvoice.status] || { label: selectedInvoice.status, color: '#6B7280', bg: '#F3F4F6', border: '#E5E7EB' };

                return (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6 print-invoice-overlay">
                        <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
                            {/* Modal Header Toolbar */}
                            <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-white shrink-0 no-print-element">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#ECFDF5] text-[#10B981] rounded-lg flex items-center justify-center">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-[#1F2937] text-lg font-bold">Invoice {selectedInvoice.id}</h3>
                                            <span className="px-2.5 py-0.5 rounded-full text-[11px] border font-bold uppercase tracking-wider" style={{ backgroundColor: sc.bg, color: sc.color, borderColor: sc.border }}>
                                                {sc.label}
                                            </span>
                                        </div>
                                        <p className="text-xs text-[#6B7280]">Review billing details and change payment status</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {selectedInvoice.status !== 'paid' && (
                                        <button
                                            onClick={() => handleUpdateInvoiceStatus(selectedInvoice.id, 'paid')}
                                            className="flex items-center gap-1.5 px-3 py-2 text-xs bg-[#10B981] text-white rounded-lg hover:bg-[#059669] font-semibold transition-all cursor-pointer shadow-sm shadow-emerald-50 active:scale-95"
                                        >
                                            <CheckCircle className="w-3.5 h-3.5" /> Mark as Paid
                                        </button>
                                    )}
                                    {selectedInvoice.status === 'draft' && (
                                        <button
                                            onClick={() => handleUpdateInvoiceStatus(selectedInvoice.id, 'sent')}
                                            className="flex items-center gap-1.5 px-3 py-2 text-xs bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] font-semibold transition-all cursor-pointer shadow-sm shadow-blue-50 active:scale-95"
                                        >
                                            <Send className="w-3.5 h-3.5" /> Send Invoice
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            window.print();
                                        }}
                                        className="flex items-center gap-1.5 px-3 py-2 text-xs text-[#374151] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] font-semibold transition-all cursor-pointer active:scale-95"
                                    >
                                        <Printer className="w-3.5 h-3.5" /> Print / Download
                                    </button>
                                    <button onClick={() => setShowInvoiceDetail(false)} className="p-2 hover:bg-[#F3F4F6] rounded-lg ml-2 cursor-pointer transition-colors">
                                        <X className="w-5 h-5 text-[#6B7280]" />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body: Printed Style Invoice */}
                            <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC] print-invoice-scroll">
                                <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-8 print-invoice-paper relative overflow-hidden">
                                    {/* Brand Header */}
                                    <div className="flex justify-between items-start pt-2">
                                        <div>
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#10B981] to-[#0D9488] flex items-center justify-center text-white font-black text-xl shadow-md">M</div>
                                                <span className="text-2xl font-black text-[#10B981] tracking-tight">MPLOYUS</span>
                                            </div>
                                            <div className="mt-5 space-y-0.5 text-xs text-[#6B7280]">
                                                <p className="font-bold text-[#1F2937] text-sm">Mployus Healthcare Staffing Ltd</p>
                                                <p>24 Upper Mount Street</p>
                                                <p>Dublin 2, D02 KH28</p>
                                                <p>Ireland</p>
                                                <p className="pt-1"><span className="text-[#9CA3AF] font-medium">VAT ID:</span> IE9928347L</p>
                                                <p><span className="text-[#9CA3AF] font-medium">Email:</span> billing@mployus.ie</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <h1 className="text-3xl font-black text-[#1F2937] tracking-tight uppercase">INVOICE</h1>
                                            <div className="mt-5 space-y-1.5 text-xs text-[#6B7280]">
                                                <p>Invoice #: <span className="font-mono font-bold text-[#1F2937]">{selectedInvoice.id}</span></p>
                                                <p>Date Issued: <span className="font-semibold text-[#374151]">{selectedInvoice.issueDate}</span></p>
                                                <p>Due Date: <span className="font-semibold text-[#374151]">{selectedInvoice.dueDate}</span></p>
                                                <p>Terms: <span className="font-semibold text-[#374151]">Net 30</span></p>
                                                <div className="pt-2">
                                                    <span className="px-2 py-0.5 rounded text-[10px] border font-bold uppercase tracking-wider" style={{ backgroundColor: sc.bg, color: sc.color, borderColor: sc.border }}>
                                                        {sc.label}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Billed To / Remittance Details */}
                                    <div className="grid grid-cols-2 gap-8 border-t border-[#F3F4F6] pt-6">
                                        <div className="p-5 bg-emerald-50/40 border border-emerald-100/50 rounded-xl space-y-2">
                                            <p className="text-[10px] text-[#059669] font-bold uppercase tracking-wider">Billed To</p>
                                            <div className="space-y-0.5 text-xs text-[#4B5563]">
                                                <p className="font-bold text-[#1F2937] text-sm">{selectedInvoice.client}</p>
                                                <p className="font-medium text-[#4B5563]">Finance & Accounts Department</p>
                                                <p className="text-[#6B7280]">Client Facility ID: <span className="font-mono text-[#1F2937] font-semibold">CL-{selectedInvoice.client.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase()}</span></p>
                                                <p className="text-[#6B7280]">Ireland</p>
                                            </div>
                                        </div>
                                        <div className="p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-2">
                                            <div className="flex items-center gap-1.5 text-[10px] text-[#10B981] font-bold uppercase tracking-wider">
                                                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" /> Remittance Instructions
                                            </div>
                                            <div className="space-y-1 text-xs text-[#4B5563]">
                                                <p className="font-bold text-[#1F2937]">Allied Irish Banks (AIB)</p>
                                                <div className="grid grid-cols-[80px_1fr] gap-y-1 text-xs pt-1">
                                                    <span className="text-[#9CA3AF] font-medium">IBAN:</span>
                                                    <span className="font-mono text-[#1F2937] font-bold break-all">IE98 AIBK 9311 5234 5678 90</span>
                                                    
                                                    <span className="text-[#9CA3AF] font-medium">BIC/SWIFT:</span>
                                                    <span className="font-mono text-[#1F2937] font-semibold">AIBKIE2D</span>
                                                    
                                                    <span className="text-[#9CA3AF] font-medium">Reference:</span>
                                                    <span className="font-mono text-[#10B981] font-bold">{selectedInvoice.id}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Line Items Table */}
                                    <div className="border border-[#E2E8F0] rounded-xl overflow-hidden mt-6 bg-white">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs text-[#4B5563] font-bold">
                                                    <th className="px-5 py-3.5">Description</th>
                                                    <th className="px-5 py-3.5 text-center w-28">Quantity</th>
                                                    <th className="px-5 py-3.5 text-right w-36">Unit Price</th>
                                                    <th className="px-5 py-3.5 text-right w-36">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-xs text-[#374151]">
                                                <tr className="border-b border-[#F3F4F6]">
                                                    <td className="px-5 py-5">
                                                        <p className="font-semibold text-[#1F2937] text-sm">Locum Medical & Specialist Placements</p>
                                                        <p className="text-[11px] text-[#6B7280] mt-1 leading-relaxed">Agency staffing coverage rendered at {selectedInvoice.client} for general clinical shifts. All shifts validated by clinical supervisor.</p>
                                                    </td>
                                                    <td className="px-5 py-5 text-center text-sm font-medium text-[#1F2937]">{selectedInvoice.shifts} shifts</td>
                                                    <td className="px-5 py-5 text-right text-sm font-medium text-[#4B5563]">€{avgRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                    <td className="px-5 py-5 text-right text-sm font-bold text-[#1F2937]">€{subtotalAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Summary Block */}
                                    <div className="flex justify-end pt-4">
                                        <div className="w-80 p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-3">
                                            <div className="flex justify-between text-xs text-[#4B5563]">
                                                <span className="font-medium">Subtotal</span>
                                                <span className="font-semibold text-[#1F2937]">€{subtotalAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                            </div>
                                            <div className="flex justify-between text-xs text-[#4B5563] pb-3 border-b border-[#E2E8F0]">
                                                <span className="font-medium">VAT (23% Standard Rate)</span>
                                                <span className="font-semibold text-[#1F2937]">€{vatAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                            </div>
                                            <div className="flex justify-between items-baseline font-bold text-[#1F2937] pt-1">
                                                <span className="text-xs uppercase tracking-wider text-[#4B5563]">Total Due (EUR)</span>
                                                <span className="text-xl text-[#10B981] font-black">€{selectedInvoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer Notes */}
                                    <div className="border-t border-[#E2E8F0] pt-6 space-y-2">
                                        <p className="text-[11px] font-bold text-[#4B5563] uppercase tracking-wider mb-1">Important Terms & Notes</p>
                                        <div className="text-[11px] text-[#6B7280] leading-relaxed space-y-1.5">
                                            <p><strong className="text-[#4B5563]">1. Payment Reference:</strong> Please quote the invoice reference number <span className="font-mono text-[#10B981] font-bold">{selectedInvoice.id}</span> on all bank transfers to ensure prompt account allocation.</p>
                                            <p><strong className="text-[#4B5563]">2. Net Payment Period:</strong> Payment terms are strictly 30 days from the invoice issue date. Overdue balances are subject to statutory interest charges.</p>
                                            <p><strong className="text-[#4B5563]">3. Questions & Discrepancies:</strong> If you have any inquiries regarding this invoice, contact our billing desk at <span className="text-[#10B981] font-semibold">billing@mployus.ie</span> or phone +353 (1) 496 0120 within 7 business days.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}

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
