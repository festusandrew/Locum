export type ShiftSlotStatus = 'available' | 'booked' | 'leave' | 'blocked' | 'off';
export type ShiftType = 'morning' | 'afternoon' | 'night';

export interface ShiftSlot {
    type: ShiftType;
    status: ShiftSlotStatus;
    facility?: string;
    shiftId?: string;
    time?: string;
}

export interface DaySchedule {
    shifts: ShiftSlot[];
}

export interface LocumWeekSchedule {
    locumId: string;
    days: DaySchedule[];
}

export interface Locum {
    id: string;
    name: string;
    avatar: string;
    specialty: string;
    department: string;
    location: string;
    phone: string;
    email: string;
    status: string; // 'available' | 'booked' | 'unavailable'
    shifts: number;
    rating: number;
    compliance: number;
    experience: string;
    qualifications: string[];
    joinDate: string;
}

export interface Applicant {
    id: string;
    name: string;
    specialty: string;
    location: string;
    status: 'new' | 'interview' | 'verification' | 'onboarding' | 'hired';
    appliedDate: string;
    stage: string;
}

export interface Client {
    id: string;
    name: string;
    type: 'hospital' | 'clinic' | 'care_home' | 'private_practice';
    location: string;
    address: string;
    contactPerson: string;
    contactEmail: string;
    contactPhone: string;
    activeShifts: number;
    totalBookings: number;
    avgRating: number;
    status: 'active' | 'inactive' | 'pending';
    monthlySpend: number;
    preferredLocums: number;
    complianceReqs: string[];
}
