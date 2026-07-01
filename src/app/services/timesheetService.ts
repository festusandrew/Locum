import { Timesheet } from '../types';

const TIMESHEETS_KEY = 'mployus_timesheets';

const defaultTimesheets: Timesheet[] = [
    { id: 'TS-2026-001', locum: 'Sarah Mitchell', facility: "St. James's Hospital", location: 'Dublin', shiftDate: '2026-02-09', clockIn: '07:58', clockOut: '16:05', scheduledHours: 8, actualHours: 8.12, overtime: 0, rate: 55, total: 446.60, status: 'submitted', gpsVerified: true, signature: true, supportingDocs: true, submittedAt: '2026-02-09 16:30' },
    { id: 'TS-2026-002', locum: 'James Harrison', facility: 'Cork University Hospital', location: 'Cork', shiftDate: '2026-02-09', clockIn: '08:55', clockOut: '21:10', scheduledHours: 12, actualHours: 12.25, overtime: 0.25, rate: 60, total: 735.00, status: 'pending_client', gpsVerified: true, signature: true, supportingDocs: false, submittedAt: '2026-02-09 21:45' },
    { id: 'TS-2026-003', locum: 'Emily Chen', facility: 'Galway Clinic', location: 'Galway', shiftDate: '2026-02-08', clockIn: '08:00', clockOut: '16:00', scheduledHours: 8, actualHours: 8.0, overtime: 0, rate: 58, total: 464.00, status: 'approved', gpsVerified: true, signature: true, supportingDocs: true, submittedAt: '2026-02-08 16:15' },
    { id: 'TS-2026-004', locum: 'Michael Brooks', facility: 'Limerick University Hospital', location: 'Limerick', shiftDate: '2026-02-08', clockIn: '09:15', clockOut: '17:30', scheduledHours: 8, actualHours: 8.25, overtime: 0.25, rate: 52, total: 429.00, status: 'rejected', gpsVerified: false, signature: true, supportingDocs: true, submittedAt: '2026-02-08 18:00', notes: 'GPS location did not match facility. Please resubmit with explanation.' },
    { id: 'TS-2026-005', locum: 'Rachel Martinez', facility: 'Mater Hospital', location: 'Dublin', shiftDate: '2026-02-07', clockIn: '20:00', clockOut: '08:05', scheduledHours: 12, actualHours: 12.08, overtime: 0, rate: 65, total: 785.20, status: 'auto_approved', gpsVerified: true, signature: true, supportingDocs: true, submittedAt: '2026-02-08 08:30' },
    { id: 'TS-2026-006', locum: 'David Thompson', facility: 'Waterford University Hospital', location: 'Waterford', shiftDate: '2026-02-07', clockIn: '08:00', clockOut: '16:30', scheduledHours: 8, actualHours: 8.5, overtime: 0.5, rate: 52, total: 442.00, status: 'submitted', gpsVerified: true, signature: true, supportingDocs: true, submittedAt: '2026-02-07 17:00' },
    { id: 'TS-2026-007', locum: 'Sarah Mitchell', facility: 'Beaumont Hospital', location: 'Dublin', shiftDate: '2026-02-06', clockIn: '07:55', clockOut: '16:00', scheduledHours: 8, actualHours: 8.08, overtime: 0, rate: 55, total: 444.40, status: 'approved', gpsVerified: true, signature: true, supportingDocs: true, submittedAt: '2026-02-06 16:20' },
];

export const timesheetService = {
    getAll: async (): Promise<Timesheet[]> => {
        await new Promise(resolve => setTimeout(resolve, 50));
        const stored = localStorage.getItem(TIMESHEETS_KEY);
        if (!stored) {
            localStorage.setItem(TIMESHEETS_KEY, JSON.stringify(defaultTimesheets));
            return defaultTimesheets;
        }
        return JSON.parse(stored);
    },

    saveAll: async (timesheets: Timesheet[]): Promise<void> => {
        localStorage.setItem(TIMESHEETS_KEY, JSON.stringify(timesheets));
    },

    create: async (timesheet: Timesheet): Promise<Timesheet> => {
        const list = await timesheetService.getAll();
        list.push(timesheet);
        await timesheetService.saveAll(list);
        return timesheet;
    },

    approve: async (id: string): Promise<Timesheet> => {
        const list = await timesheetService.getAll();
        let updated: Timesheet | null = null;
        const mapped = list.map(t => {
            if (t.id === id) {
                updated = { ...t, status: 'approved' as const };
                return updated;
            }
            return t;
        });
        await timesheetService.saveAll(mapped);
        if (!updated) throw new Error(`Timesheet not found: id ${id}`);
        return updated;
    },

    reject: async (id: string, notes?: string): Promise<Timesheet> => {
        const list = await timesheetService.getAll();
        let updated: Timesheet | null = null;
        const mapped = list.map(t => {
            if (t.id === id) {
                updated = { ...t, status: 'rejected' as const, notes };
                return updated;
            }
            return t;
        });
        await timesheetService.saveAll(mapped);
        if (!updated) throw new Error(`Timesheet not found: id ${id}`);
        return updated;
    }
};
