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
    grade?: string;
    subSpecialty?: string;
    imcNumber?: string;
    gmcNumber?: string;
    primaryLanguage?: string;
    dob?: string;
    gender?: string;
    nationality?: string;
    ppsn?: string;
    address?: string;
    eircode?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    languages?: string[];
    maxWeeklyHours?: number;
    preferredLocations?: string[];
    preferredShifts?: string[];
    imcExpiry?: string;
    gmcExpiry?: string;
    specialistRegister?: string;
    financial?: {
        taxStatus?: string;
        revenueRegistered?: boolean;
        vatRegistered?: boolean;
        bankName?: string;
        iban?: string;
        bic?: string;
        standardDayRate?: number;
        standardNightRate?: number;
        weekendRate?: number;
        oncallRate?: number;
    };
}

export interface Applicant {
    id: string;
    name: string;
    specialty: string;
    location: string;
    status: 'new' | 'interview' | 'verification' | 'onboarding' | 'hired';
    appliedDate: string;
    stage: string;
    phone?: string;
    email?: string;
    department?: string;
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
    logo?: string;
    themeColor?: string;
}

export interface MatchSuggestion {
    id: number;
    shift: string;
    locum: string;
    specialty: string;
    baseSpecialty: number;
    baseDistance: number;
    basePerf: number;
    baseCompliance: number;
    date: string;
    facilityIndex: number;
    reasons: string[];
    status?: 'pending' | 'accepted' | 'skipped';
    skipReason?: string;
}

export interface ComplianceReminder {
    id: number;
    locum: string;
    document: string;
    daysUntilExpiry: number;
    action: string;
    autoSent: boolean;
    status: 'pending' | 'sent' | 'verified';
}

export interface AutomationRule {
    id: number;
    document: string;
    trigger: string;
    action: string;
    active: boolean;
}

export interface SchedulingResult {
    id: number;
    facilityIndex: number;
    shifts: number;
    filled: number;
    auto: number;
    manual: number;
    unfilled: number;
    wasAutoFilled?: boolean;
}

export interface AIStats {
    aiMatches: number;
    autoScheduled: number;
    complianceReminders: number;
    timeSaved: number;
}

export interface Shift {
    id: string;
    facility: string;
    location: string;
    specialty: string;
    department?: string;
    date: string;
    time: string;
    hours: number;
    rate: number;
    status: 'open' | 'filled' | 'cancelled' | 'urgent' | 'recurring';
    locum: string | null;
    requiredCompliance: string[];
}

export interface Timesheet {
    id: string;
    locum: string;
    facility: string;
    location: string;
    shiftDate: string;
    clockIn: string;
    clockOut: string;
    scheduledHours: number;
    actualHours: number;
    overtime: number;
    rate: number;
    total: number;
    status: 'submitted' | 'approved' | 'rejected' | 'pending_client' | 'auto_approved';
    gpsVerified: boolean;
    signature: boolean;
    supportingDocs: boolean;
    submittedAt: string;
    notes?: string;
}

export interface ComplianceRecord {
    id: string;
    locumName: string;
    avatar: string;
    specialty: string;
    overallCompliance: number;
    documents: {
        medicalLicense: { status: 'valid' | 'expiring' | 'expired', expiryDate: string, uploadedDate: string };
        garda: { status: 'valid' | 'expiring' | 'expired', expiryDate: string, uploadedDate: string };
        indemnityInsurance: { status: 'valid' | 'expiring' | 'expired', expiryDate: string, uploadedDate: string };
        cprTraining: { status: 'valid' | 'expiring' | 'expired', expiryDate: string, uploadedDate: string };
    };
}

export interface PayrollItem {
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

export interface Invoice {
    id: string;
    client: string;
    amount: number;
    issueDate: string;
    dueDate: string;
    status: 'paid' | 'sent' | 'overdue' | 'draft';
    shifts: number;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    type: 'shift' | 'compliance' | 'booking' | 'payment';
    read: boolean;
}

export interface EmailLog {
    id: string;
    recipient: string;
    subject: string;
    type: 'email' | 'sms';
    sentAt: string;
    status: 'delivered' | 'opened' | 'failed' | 'bounced';
    template?: string;
}

