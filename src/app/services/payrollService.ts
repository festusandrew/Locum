import { PayrollItem, Invoice } from '../types';

const PAYROLL_KEY = 'mployus_payroll_items';
const INVOICES_KEY = 'mployus_invoices';

const defaultPayroll: PayrollItem[] = [
    { id: 'PAY-001', locum: 'Sarah Mitchell', period: 'Feb 1-15, 2026', shifts: 6, hours: 52, baseRate: 55, grossPay: 2860, tax: 572, prsi: 114.40, netPay: 2173.60, status: 'processed', payDate: '2026-02-20' },
    { id: 'PAY-002', locum: 'James Harrison', period: 'Feb 1-15, 2026', shifts: 5, hours: 56, baseRate: 60, grossPay: 3360, tax: 672, prsi: 134.40, netPay: 2553.60, status: 'processed', payDate: '2026-02-20' },
    { id: 'PAY-003', locum: 'Emily Chen', period: 'Feb 1-15, 2026', shifts: 4, hours: 40, baseRate: 58, grossPay: 2320, tax: 464, prsi: 92.80, netPay: 1763.20, status: 'pending', payDate: '2026-02-20' },
    { id: 'PAY-004', locum: 'Michael Brooks', period: 'Feb 1-15, 2026', shifts: 3, hours: 36, baseRate: 52, grossPay: 1872, tax: 374.40, prsi: 74.88, netPay: 1422.72, status: 'on_hold', payDate: '2026-02-20' },
    { id: 'PAY-005', locum: 'Rachel Martinez', period: 'Feb 1-15, 2026', shifts: 5, hours: 48, baseRate: 55, grossPay: 2640, tax: 528, prsi: 105.60, netPay: 2006.40, status: 'pending', payDate: '2026-02-20' },
    { id: 'PAY-006', locum: 'David Thompson', period: 'Feb 1-15, 2026', shifts: 4, hours: 40, baseRate: 52, grossPay: 2080, tax: 416, prsi: 83.20, netPay: 1580.80, status: 'processed', payDate: '2026-02-20' },
];

const defaultInvoices: Invoice[] = [
    { id: 'INV-2026-045', client: "St. James's Hospital", amount: 24500, issueDate: '2026-02-01', dueDate: '2026-02-28', status: 'sent', shifts: 18 },
    { id: 'INV-2026-044', client: 'Cork University Hospital', amount: 18200, issueDate: '2026-02-01', dueDate: '2026-02-28', status: 'sent', shifts: 14 },
    { id: 'INV-2026-043', client: 'Galway Clinic', amount: 9400, issueDate: '2026-01-15', dueDate: '2026-02-15', status: 'overdue', shifts: 8 },
    { id: 'INV-2026-042', client: 'Mater Hospital', amount: 15800, issueDate: '2026-01-15', dueDate: '2026-02-15', status: 'paid', shifts: 12 },
    { id: 'INV-2026-041', client: 'Beaumont Hospital', amount: 12600, issueDate: '2026-01-01', dueDate: '2026-01-31', status: 'paid', shifts: 10 },
    { id: 'INV-2026-040', client: 'Beacon Hospital', amount: 5200, issueDate: '2026-01-01', dueDate: '2026-01-31', status: 'paid', shifts: 5 },
];

export const payrollService = {
    // ================= PAYROLL API =================
    getPayrollItems: async (): Promise<PayrollItem[]> => {
        await new Promise(resolve => setTimeout(resolve, 50));
        const stored = localStorage.getItem(PAYROLL_KEY);
        if (!stored) {
            localStorage.setItem(PAYROLL_KEY, JSON.stringify(defaultPayroll));
            return defaultPayroll;
        }
        return JSON.parse(stored);
    },

    saveAllPayroll: async (items: PayrollItem[]): Promise<void> => {
        localStorage.setItem(PAYROLL_KEY, JSON.stringify(items));
    },

    createPayrollItem: async (item: PayrollItem): Promise<PayrollItem> => {
        const items = await payrollService.getPayrollItems();
        items.push(item);
        await payrollService.saveAllPayroll(items);
        return item;
    },

    // ================= INVOICING API =================
    getInvoices: async (): Promise<Invoice[]> => {
        await new Promise(resolve => setTimeout(resolve, 50));
        const stored = localStorage.getItem(INVOICES_KEY);
        if (!stored) {
            localStorage.setItem(INVOICES_KEY, JSON.stringify(defaultInvoices));
            return defaultInvoices;
        }
        return JSON.parse(stored);
    },

    saveAllInvoices: async (invoices: Invoice[]): Promise<void> => {
        localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
    },

    createInvoice: async (invoice: Invoice): Promise<Invoice> => {
        const invoices = await payrollService.getInvoices();
        invoices.push(invoice);
        await payrollService.saveAllInvoices(invoices);
        return invoice;
    },

    updateInvoiceStatus: async (id: string, status: Invoice['status']): Promise<Invoice> => {
        const invoices = await payrollService.getInvoices();
        let updated: Invoice | null = null;
        const mapped = invoices.map(i => {
            if (i.id === id) {
                updated = { ...i, status };
                return updated;
            }
            return i;
        });
        await payrollService.saveAllInvoices(mapped);
        if (!updated) throw new Error(`Invoice not found: id ${id}`);
        return updated;
    }
};
