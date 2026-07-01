import { Shift } from '../types';

const SHIFTS_KEY = 'mployus_shifts';

const defaultShifts: Shift[] = [
    { id: 'SH-001', facility: "St. James's Hospital", location: 'Dublin', specialty: 'General Surgery', date: '2026-02-10', time: '08:00 - 16:00', hours: 8, rate: 55, status: 'filled', locum: 'Sarah Mitchell', requiredCompliance: ['Medical License', 'Garda Vetting'] },
    { id: 'SH-002', facility: 'Cork University Hospital', location: 'Cork', specialty: 'Cardiology', date: '2026-02-10', time: '09:00 - 21:00', hours: 12, rate: 60, status: 'filled', locum: 'James Harrison', requiredCompliance: ['Medical License', 'Indemnity Insurance'] },
    { id: 'SH-003', facility: 'Beaumont Hospital', location: 'Dublin', specialty: 'Emergency Medicine', date: '2026-02-10', time: '20:00 - 08:00', hours: 12, rate: 65, status: 'urgent', locum: null, requiredCompliance: ['Medical License', 'Garda Vetting', 'CPR Training'] },
    { id: 'SH-004', facility: 'University Hospital Galway', location: 'Galway', specialty: 'Anesthesiology', date: '2026-02-11', time: '07:00 - 19:00', hours: 12, rate: 58, status: 'open', locum: null, requiredCompliance: ['Medical License', 'Indemnity Insurance'] },
    { id: 'SH-005', facility: 'Mater Hospital', location: 'Dublin', specialty: 'Pediatrics', date: '2026-02-11', time: '08:00 - 20:00', hours: 12, rate: 55, status: 'open', locum: null, requiredCompliance: ['Medical License', 'Garda Vetting'] },
    { id: 'SH-006', facility: "St. James's Hospital", location: 'Dublin', specialty: 'General Surgery', date: '2026-02-12', time: '08:00 - 16:00', hours: 8, rate: 55, status: 'recurring', locum: 'Sarah Mitchell', requiredCompliance: ['Medical License', 'Garda Vetting'] },
    { id: 'SH-007', facility: 'Limerick University Hospital', location: 'Limerick', specialty: 'Orthopedics', date: '2026-02-09', time: '09:00 - 17:00', hours: 8, rate: 52, status: 'cancelled', locum: null, requiredCompliance: ['Medical License'] },
    { id: 'SH-008', facility: 'Waterford University Hospital', location: 'Waterford', specialty: 'Emergency Medicine', date: '2026-02-12', time: '20:00 - 08:00', hours: 12, rate: 65, status: 'urgent', locum: null, requiredCompliance: ['Medical License', 'CPR Training'] },
    { id: 'SH-009', facility: 'Galway Clinic', location: 'Galway', specialty: 'General Surgery', date: '2026-02-13', time: '08:00 - 16:00', hours: 8, rate: 58, status: 'open', locum: null, requiredCompliance: ['Medical License', 'Indemnity Insurance'] },
    { id: 'SH-010', facility: 'Beacon Hospital', location: 'Dublin', specialty: 'Cardiology', date: '2026-02-13', time: '09:00 - 17:00', hours: 8, rate: 60, status: 'filled', locum: 'Emily Chen', requiredCompliance: ['Medical License'] },
];

export const shiftService = {
    getAll: async (): Promise<Shift[]> => {
        await new Promise(resolve => setTimeout(resolve, 50));
        const stored = localStorage.getItem(SHIFTS_KEY);
        if (!stored) {
            localStorage.setItem(SHIFTS_KEY, JSON.stringify(defaultShifts));
            return defaultShifts;
        }
        return JSON.parse(stored);
    },

    saveAll: async (shifts: Shift[]): Promise<void> => {
        localStorage.setItem(SHIFTS_KEY, JSON.stringify(shifts));
    },

    create: async (shift: Shift): Promise<Shift> => {
        const shifts = await shiftService.getAll();
        shifts.push(shift);
        await shiftService.saveAll(shifts);
        return shift;
    },

    update: async (shift: Shift): Promise<Shift> => {
        const shifts = await shiftService.getAll();
        const updated = shifts.map(s => s.id === shift.id ? shift : s);
        await shiftService.saveAll(updated);
        return shift;
    },

    cancel: async (id: string, reason: string): Promise<boolean> => {
        const shifts = await shiftService.getAll();
        const updated = shifts.map(s => s.id === id ? { ...s, status: 'cancelled' as const } : s);
        await shiftService.saveAll(updated);
        return true;
    },

    assignLocum: async (id: string, locumName: string): Promise<Shift> => {
        const shifts = await shiftService.getAll();
        let updatedShift: Shift | null = null;
        const updated = shifts.map(s => {
            if (s.id === id) {
                updatedShift = { ...s, locum: locumName, status: 'filled' as const };
                return updatedShift;
            }
            return s;
        });
        await shiftService.saveAll(updated);
        if (!updatedShift) throw new Error(`Shift not found: id ${id}`);
        return updatedShift;
    }
};
