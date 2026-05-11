import {
    X,
    User,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    DollarSign,
    Upload,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    Search,
    SlidersHorizontal,
    MoreVertical,
    Download
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface LocumProfileProps {
    locum: {
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
    };
    onClose: () => void;
}

// Mock data for demonstration
const mockShifts = [
    { id: 'SH-001', facility: 'St. James\'s Hospital, Dublin', date: '2024-12-15', time: '08:00 - 16:00', status: 'completed', hours: 8, rate: 150 },
    { id: 'SH-002', facility: 'Cork University Hospital', date: '2024-12-18', time: '09:00 - 17:00', status: 'accepted', hours: 8, rate: 150 },
    { id: 'SH-003', facility: 'University Hospital Galway', date: '2024-12-20', time: '08:00 - 20:00', status: 'booked', hours: 12, rate: 160 },
    { id: 'SH-004', facility: 'Beaumont Hospital, Dublin', date: '2024-12-10', time: '10:00 - 18:00', status: 'declined', hours: 8, rate: 150 },
    { id: 'SH-005', facility: 'Mater Misericordiae Hospital', date: '2024-12-05', time: '08:00 - 16:00', status: 'cancelled', hours: 8, rate: 150 },
];

const mockPayments = [
    { id: 'PAY-001', date: '2024-12-11', description: 'General Surgery Shift - 8 hours', amount: 1200.00, status: 'completed', facility: 'St. James\'s Hospital' },
    { id: 'PAY-002', date: '2024-12-04', description: 'General Surgery Shift - 12 hours', amount: 1800.00, status: 'completed', facility: 'Cork University Hospital' },
    { id: 'PAY-003', date: '2024-11-28', description: 'Consultation - 6 hours', amount: 900.00, status: 'pending', facility: 'University Hospital Galway' },
    { id: 'PAY-004', date: '2024-11-20', description: 'Emergency Cover - 10 hours', amount: 1500.00, status: 'completed', facility: 'Beaumont Hospital' },
];

const mockScheduleEvents = [
    { date: 15, month: 12, year: 2024, shift: 'Morning', facility: 'St. James\'s' },
    { date: 18, month: 12, year: 2024, shift: 'Day', facility: 'Cork UH' },
    { date: 20, month: 12, year: 2024, shift: 'Full', facility: 'Galway UH' },
    { date: 22, month: 12, year: 2024, shift: 'Evening', facility: 'Beaumont' },
];

export function LocumProfile({ locum, onClose }: LocumProfileProps) {
    const [activeTab, setActiveTab] = useState<'information' | 'schedule' | 'compliance' | 'shifts' | 'payments'>('information');
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleExportCSV = () => {
        const escapeCSVValue = (val: any) => {
            if (val === undefined || val === null) return "";
            let str = String(val);
            if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };

        let csvContent = "";

        csvContent += "LOCUM PROFILE REPORT\n\n";
        csvContent += "GENERAL INFORMATION\n";
        csvContent += "Locum ID,Full Name,Specialty,Compliance Score,Email,Phone,Address,Experience,Status\n";
        csvContent += [
            escapeCSVValue(locum.id),
            escapeCSVValue(locum.locumName),
            escapeCSVValue(locum.specialty),
            escapeCSVValue(`${locum.overallCompliance}%`),
            escapeCSVValue("sarah.mitchell@email.ie"),
            escapeCSVValue("+353 87 123 4567"),
            escapeCSVValue("Dublin 2, Ireland"),
            escapeCSVValue("8 years"),
            escapeCSVValue("Active")
        ].join(",") + "\n\n";

        csvContent += "COMPLIANCE DOCUMENTS\n";
        csvContent += "Document Name,Status,Expiry Date,Uploaded Date\n";
        
        const docs = [
            { name: "Medical Council of Ireland License", ...locum.documents.medicalLicense },
            { name: "Garda Vetting Clearance", ...locum.documents.garda },
            { name: "Professional Indemnity Insurance", ...locum.documents.indemnityInsurance },
            { name: "CPR & First Aid Certification", ...locum.documents.cprTraining }
        ];
        
        docs.forEach(doc => {
            csvContent += [
                escapeCSVValue(doc.name),
                escapeCSVValue(doc.status),
                escapeCSVValue(doc.expiryDate),
                escapeCSVValue(doc.uploadedDate)
            ].join(",") + "\n";
        });
        csvContent += "\n";

        csvContent += "SHIFTS HISTORY\n";
        csvContent += "Shift ID,Facility,Date,Time,Status,Hours,Rate (EUR/hr),Total Payment (EUR)\n";
        mockShifts.forEach(shift => {
            csvContent += [
                escapeCSVValue(shift.id),
                escapeCSVValue(shift.facility),
                escapeCSVValue(shift.date),
                escapeCSVValue(shift.time),
                escapeCSVValue(shift.status),
                escapeCSVValue(shift.hours),
                escapeCSVValue(shift.rate),
                escapeCSVValue(shift.hours * shift.rate)
            ].join(",") + "\n";
        });
        csvContent += "\n";

        csvContent += "PAYMENT HISTORY\n";
        csvContent += "Payment ID,Date,Description,Facility,Amount (EUR),Status\n";
        mockPayments.forEach(pay => {
            csvContent += [
                escapeCSVValue(pay.id),
                escapeCSVValue(pay.date),
                escapeCSVValue(pay.description),
                escapeCSVValue(pay.facility),
                escapeCSVValue(pay.amount),
                escapeCSVValue(pay.status)
            ].join(",") + "\n";
        });

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Locum_Profile_${locum.id.replace('#', '')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setShowDropdown(false);
    };
    const [scheduleSubView, setScheduleSubView] = useState<'month' | 'week' | 'day'>('month');
    const [scheduleAnchorDate, setScheduleAnchorDate] = useState<Date>(new Date(2024, 11, 15)); // Dec 15, 2024

    // Shifts filters
    const [shiftsSearchTerm, setShiftsSearchTerm] = useState('');
    const [shiftsStatusFilter, setShiftsStatusFilter] = useState('all');
    const [showShiftsFilter, setShowShiftsFilter] = useState(false);

    // Payments filters
    const [paymentsSearchTerm, setPaymentsSearchTerm] = useState('');
    const [paymentsStatusFilter, setPaymentsStatusFilter] = useState('all');
    const [showPaymentsFilter, setShowPaymentsFilter] = useState(false);

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            valid: 'bg-[#D1FAE5] text-[#059669] border-[#A7F3D0]',
            expiring: 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]',
            expired: 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]',
            completed: 'bg-[#D1FAE5] text-[#059669] border-[#A7F3D0]',
            accepted: 'bg-[#DBEAFE] text-[#1D4ED8] border-[#BFDBFE]',
            booked: 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]',
            declined: 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]',
            cancelled: 'bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]',
            pending: 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]'
        };
        const labels: Record<string, string> = {
            valid: 'Valid',
            expiring: 'Expiring Soon',
            expired: 'Expired',
            completed: 'Completed',
            accepted: 'Accepted',
            booked: 'Booked',
            declined: 'Declined',
            cancelled: 'Cancelled',
            pending: 'Pending'
        };
        return (
            <span className={`px-2 py-1 rounded text-xs border ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IE', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    };

    // Calendar logic
    const scheduleDaysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Week helper (Sunday start, matching standard calendar)
    const getScheduleWeekDays = () => {
        const start = new Date(scheduleAnchorDate);
        start.setDate(start.getDate() - start.getDay()); // Sunday
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
            return {
                date: d,
                dayName: scheduleDaysOfWeek[i],
                dayNum: d.getDate()
            };
        });
    };

    const getDaysInScheduleMonth = (month: number, year: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfScheduleMonth = (month: number, year: number) => {
        return new Date(year, month, 1).getDay();
    };

    const getScheduleMonthDays = () => {
        const m = scheduleAnchorDate.getMonth();
        const y = scheduleAnchorDate.getFullYear();
        const firstDay = getFirstDayOfScheduleMonth(m, y);
        const daysInMonth = getDaysInScheduleMonth(m, y);
        const list = [];

        // Empty prefix blocks
        for (let i = 0; i < firstDay; i++) {
            list.push({ isEmpty: true, key: `empty-${i}`, date: null, dayNum: 0 });
        }

        // Month days
        for (let day = 1; day <= daysInMonth; day++) {
            const d = new Date(y, m, day);
            list.push({
                isEmpty: false,
                key: `day-${day}`,
                date: d,
                dayNum: day
            });
        }
        return list;
    };

    const handlePrevSchedule = () => {
        if (scheduleSubView === 'month') {
            setScheduleAnchorDate(new Date(scheduleAnchorDate.getFullYear(), scheduleAnchorDate.getMonth() - 1, 1));
        } else if (scheduleSubView === 'week') {
            const prev = new Date(scheduleAnchorDate);
            prev.setDate(prev.getDate() - 7);
            setScheduleAnchorDate(prev);
        } else {
            const prev = new Date(scheduleAnchorDate);
            prev.setDate(prev.getDate() - 1);
            setScheduleAnchorDate(prev);
        }
    };

    const handleNextSchedule = () => {
        if (scheduleSubView === 'month') {
            setScheduleAnchorDate(new Date(scheduleAnchorDate.getFullYear(), scheduleAnchorDate.getMonth() + 1, 1));
        } else if (scheduleSubView === 'week') {
            const next = new Date(scheduleAnchorDate);
            next.setDate(next.getDate() + 7);
            setScheduleAnchorDate(next);
        } else {
            const next = new Date(scheduleAnchorDate);
            next.setDate(next.getDate() + 1);
            setScheduleAnchorDate(next);
        }
    };

    const getScheduleHeaderLabel = () => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        if (scheduleSubView === 'month') {
            return `${months[scheduleAnchorDate.getMonth()]} ${scheduleAnchorDate.getFullYear()}`;
        } else if (scheduleSubView === 'week') {
            const sun = new Date(scheduleAnchorDate);
            sun.setDate(sun.getDate() - sun.getDay());
            const sat = new Date(sun);
            sat.setDate(sat.getDate() + 6);
            return `Week of ${sun.getDate()} ${months[sun.getMonth()].substring(0,3)} - ${sat.getDate()} ${months[sat.getMonth()].substring(0,3)} ${sat.getFullYear()}`;
        } else {
            return `${scheduleAnchorDate.getDate()} ${months[scheduleAnchorDate.getMonth()]} ${scheduleAnchorDate.getFullYear()}`;
        }
    };

    const findEventForDate = (d: Date) => {
        const day = d.getDate();
        const m = d.getMonth();
        const y = d.getFullYear();
        // Match both 0-indexed and 1-indexed to be completely safe
        return mockScheduleEvents.find(e => 
            e.date === day && 
            e.year === y && 
            (e.month === m + 1 || e.month === m)
        );
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-[#E5E7EB]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center text-2xl">
                                {locum.avatar}
                            </div>
                            <div>
                                <h3 className="text-xl text-[#1F2937]">{locum.locumName}</h3>
                                <p className="text-sm text-[#6B7280]">{locum.specialty} • {locum.id}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-[#6B7280]">Compliance:</span>
                                    <div className="w-24 h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${locum.overallCompliance === 100 ? 'bg-[#10B981]' :
                                                    locum.overallCompliance >= 75 ? 'bg-[#D97706]' :
                                                        'bg-[#DC2626]'
                                                }`}
                                            style={{ width: `${locum.overallCompliance}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-medium text-[#1F2937]">{locum.overallCompliance}%</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 relative" ref={dropdownRef}>
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className={`w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F3F4F6] rounded-lg transition-all ${showDropdown ? 'bg-[#F3F4F6] text-[#1F2937]' : ''}`}
                                title="More actions"
                            >
                                <MoreVertical className="w-5 h-5" />
                            </button>
                            
                            {showDropdown && (
                                <div className="absolute right-0 top-full mt-1 bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-50 w-48 py-1">
                                    <button
                                        onClick={handleExportCSV}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#1F2937] hover:bg-[#F9FAFB] text-left transition-colors"
                                    >
                                        <Download className="w-4 h-4 text-[#6B7280]" />
                                        Export as CSV
                                    </button>
                                </div>
                            )}

                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-2 mt-6 border-b border-[#E5E7EB]">
                        <button
                            onClick={() => setActiveTab('information')}
                            className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'information'
                                    ? 'border-[#10B981] text-[#10B981]'
                                    : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'
                                }`}
                        >
                            LOCUM INFORMATION
                        </button>
                        <button
                            onClick={() => setActiveTab('schedule')}
                            className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'schedule'
                                    ? 'border-[#10B981] text-[#10B981]'
                                    : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'
                                }`}
                        >
                            SCHEDULE
                        </button>
                        <button
                            onClick={() => setActiveTab('compliance')}
                            className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'compliance'
                                    ? 'border-[#10B981] text-[#10B981]'
                                    : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'
                                }`}
                        >
                            COMPLIANCE
                        </button>
                        <button
                            onClick={() => setActiveTab('shifts')}
                            className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'shifts'
                                    ? 'border-[#10B981] text-[#10B981]'
                                    : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'
                                }`}
                        >
                            ALL SHIFTS
                        </button>
                        <button
                            onClick={() => setActiveTab('payments')}
                            className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'payments'
                                    ? 'border-[#10B981] text-[#10B981]'
                                    : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'
                                }`}
                        >
                            PAYMENT HISTORY
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {/* Information Tab */}
                    {activeTab === 'information' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                {/* Personal Information */}
                                <div className="bg-[#F9FAFB] rounded-lg p-5">
                                    <h4 className="font-medium text-[#1F2937] mb-4">Personal Information</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <User className="w-4 h-4 text-[#6B7280]" />
                                            <div>
                                                <p className="text-xs text-[#6B7280]">Full Name</p>
                                                <p className="text-sm font-medium text-[#1F2937]">{locum.locumName}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-4 h-4 text-[#6B7280]" />
                                            <div>
                                                <p className="text-xs text-[#6B7280]">Email</p>
                                                <p className="text-sm font-medium text-[#1F2937]">sarah.mitchell@email.ie</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-4 h-4 text-[#6B7280]" />
                                            <div>
                                                <p className="text-xs text-[#6B7280]">Phone</p>
                                                <p className="text-sm font-medium text-[#1F2937]">+353 87 123 4567</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MapPin className="w-4 h-4 text-[#6B7280]" />
                                            <div>
                                                <p className="text-xs text-[#6B7280]">Address</p>
                                                <p className="text-sm font-medium text-[#1F2937]">Dublin 2, Ireland</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Professional Information */}
                                <div className="bg-[#F9FAFB] rounded-lg p-5">
                                    <h4 className="font-medium text-[#1F2937] mb-4">Professional Information</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Briefcase className="w-4 h-4 text-[#6B7280]" />
                                            <div>
                                                <p className="text-xs text-[#6B7280]">Specialty</p>
                                                <p className="text-sm font-medium text-[#1F2937]">{locum.specialty}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <User className="w-4 h-4 text-[#6B7280]" />
                                            <div>
                                                <p className="text-xs text-[#6B7280]">Locum ID</p>
                                                <p className="text-sm font-medium text-[#1F2937]">{locum.id}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-4 h-4 text-[#6B7280]" />
                                            <div>
                                                <p className="text-xs text-[#6B7280]">Years of Experience</p>
                                                <p className="text-sm font-medium text-[#1F2937]">8 years</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Briefcase className="w-4 h-4 text-[#6B7280]" />
                                            <div>
                                                <p className="text-xs text-[#6B7280]">Status</p>
                                                <span className="inline-block px-2 py-1 bg-[#D1FAE5] text-[#059669] border border-[#A7F3D0] rounded text-xs">Active</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Statistics */}
                            <div className="grid grid-cols-4 gap-4">
                                <div className="bg-white border border-[#E5E7EB] rounded-lg p-4">
                                    <p className="text-xs text-[#6B7280] mb-1">Total Shifts</p>
                                    <p className="text-2xl font-bold text-[#1F2937]">142</p>
                                </div>
                                <div className="bg-white border border-[#E5E7EB] rounded-lg p-4">
                                    <p className="text-xs text-[#6B7280] mb-1">Completed</p>
                                    <p className="text-2xl font-bold text-[#10B981]">138</p>
                                </div>
                                <div className="bg-white border border-[#E5E7EB] rounded-lg p-4">
                                    <p className="text-xs text-[#6B7280] mb-1">Avg. Rating</p>
                                    <p className="text-2xl font-bold text-[#1F2937]">4.9</p>
                                </div>
                                <div className="bg-white border border-[#E5E7EB] rounded-lg p-4">
                                    <p className="text-xs text-[#6B7280] mb-1">Total Earnings</p>
                                    <p className="text-2xl font-bold text-[#10B981]">€56,800</p>
                                </div>
                            </div>
                        </div>
                    )}                    {/* Schedule Tab */}
                    {activeTab === 'schedule' && (
                        <div>
                            {/* Schedule Header / Controls */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E5E7EB]">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-0.5">
                                        <button
                                            type="button"
                                            onClick={handlePrevSchedule}
                                            className="p-1.5 hover:bg-[#E5E7EB] rounded text-[#4B5563] transition-colors"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleNextSchedule}
                                            className="p-1.5 hover:bg-[#E5E7EB] rounded text-[#4B5563] transition-colors"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <h4 className="font-bold text-[#1F2937] text-lg select-none">
                                        {getScheduleHeaderLabel()}
                                    </h4>
                                </div>

                                {/* Month / Week / Day view switchers */}
                                <div className="flex items-center gap-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-1">
                                    {(['month', 'week', 'day'] as const).map(view => (
                                        <button
                                            key={view}
                                            type="button"
                                            onClick={() => setScheduleSubView(view)}
                                            className={`px-3.5 py-1 text-xs font-semibold rounded-md capitalize transition-all ${
                                                scheduleSubView === view
                                                    ? 'bg-[#10B981] text-white shadow-sm'
                                                    : 'text-[#6B7280] hover:text-[#1F2937] hover:bg-[#E5E7EB]'
                                            }`}
                                        >
                                            {view}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* === MONTH VIEW === */}
                            {scheduleSubView === 'month' && (
                                <div>
                                    <div className="grid grid-cols-7 gap-2 mb-4">
                                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                            <div key={day} className="p-2 text-center text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                                                {day}
                                            </div>
                                        ))}
                                        {getScheduleMonthDays().map((cell, idx) => {
                                            if (cell.isEmpty) {
                                                return <div key={cell.key} className="p-2" />;
                                            }

                                            const event = findEventForDate(cell.date!);
                                            const isToday = cell.date?.toDateString() === new Date(2024, 11, 15).toDateString();

                                            return (
                                                <div 
                                                    key={cell.key} 
                                                    onClick={() => {
                                                        if (cell.date) {
                                                            setScheduleAnchorDate(cell.date);
                                                            setScheduleSubView('day');
                                                        }
                                                    }}
                                                    className={`p-2.5 border border-[#E5E7EB] rounded-xl text-center cursor-pointer transition-all hover:bg-[#F3FFFA] ${
                                                        event ? 'bg-[#ECFDF5] border-[#A7F3D0]' : 'hover:bg-[#F9FAFB]'
                                                    } ${isToday ? 'ring-2 ring-[#10B981]' : ''}`}
                                                >
                                                    <div className={`text-xs font-bold ${event ? 'text-[#065F46]' : 'text-[#374151]'}`}>{cell.dayNum}</div>
                                                    {event && (
                                                        <div className="text-[10px] text-[#059669] font-bold mt-1 bg-white/80 py-0.5 rounded shadow-sm border border-[#A7F3D0] truncate">
                                                            {event.shift}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* === WEEK VIEW === */}
                            {scheduleSubView === 'week' && (
                                <div className="grid grid-cols-7 gap-3 min-h-[160px] bg-white p-2.5 border border-[#E5E7EB] rounded-xl shadow-sm">
                                    {getScheduleWeekDays().map(day => {
                                        const event = findEventForDate(day.date);
                                        const isToday = day.date.toDateString() === new Date(2024, 11, 15).toDateString();
                                        return (
                                            <div 
                                                key={day.date.toDateString()}
                                                onClick={() => {
                                                    setScheduleAnchorDate(day.date);
                                                    setScheduleSubView('day');
                                                }}
                                                className={`p-3 rounded-xl border flex flex-col items-center justify-between cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${
                                                    event ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]' : 'bg-[#F9FAFB] border-[#E5E7EB]'
                                                } ${isToday ? 'ring-2 ring-[#10B981]' : ''}`}
                                            >
                                                <div className="text-center">
                                                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">{day.dayName}</p>
                                                    <p className="text-sm font-black mt-0.5">{day.dayNum}</p>
                                                </div>
                                                {event ? (
                                                    <div className="mt-3 w-full text-center">
                                                        <span className="inline-block text-[9px] px-1.5 py-0.5 rounded-full bg-white border border-[#A7F3D0] font-bold">
                                                            {event.shift}
                                                        </span>
                                                        <p className="text-[9px] text-[#047857] font-semibold mt-1 truncate">{event.facility}</p>
                                                    </div>
                                                ) : (
                                                    <span className="text-[9px] text-[#9CA3AF] italic mt-4">Free</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* === DAILY VIEW === */}
                            {scheduleSubView === 'day' && (
                                <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm max-w-xl mx-auto">
                                    {(() => {
                                        const event = findEventForDate(scheduleAnchorDate);
                                        if (event) {
                                            return (
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                                                        <h5 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">Assigned Shift</h5>
                                                        <span className="px-2.5 py-1 text-xs font-bold bg-[#ECFDF5] text-[#10B981] rounded-full border border-[#A7F3D0]">
                                                            {event.shift} Shift
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-base font-bold text-[#1F2937]">{event.facility}</h4>
                                                        <p className="text-xs text-[#6B7280] mt-1">Location: Regional Cover Center</p>
                                                    </div>
                                                    <div className="p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] space-y-1.5 text-xs text-[#4B5563]">
                                                        <p><strong>Locum Professional:</strong> {locum.locumName}</p>
                                                        <p><strong>Specialty Grade:</strong> {locum.specialty}</p>
                                                        <p><strong>Shift Date:</strong> {scheduleAnchorDate.toLocaleDateString('en-IE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div className="text-center py-10">
                                                <Calendar className="w-10 h-10 text-[#9CA3AF] mx-auto mb-2" />
                                                <p className="text-sm text-[#4B5563] font-medium">No shifts assigned for this date</p>
                                                <p className="text-xs text-[#9CA3AF] mt-1">Locum is available and open for bookings.</p>
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}

                            {/* Upcoming Shifts list footer */}
                            <div className="mt-6">
                                <h4 className="font-bold text-[#1F2937] mb-4">Upcoming Schedule References</h4>
                                <div className="space-y-3">
                                    {mockScheduleEvents.map((event, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 border border-[#E5E7EB] rounded-xl hover:bg-[#F9FAFB] transition-colors">
                                            <div>
                                                <p className="text-sm font-semibold text-[#1F2937]">{event.facility}</p>
                                                <p className="text-xs text-[#6B7280]">{event.date}/{event.month}/{event.year} • {event.shift} Shift</p>
                                            </div>
                                            <span className="px-3 py-1 bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0] rounded-full text-xs font-bold">
                                                Scheduled
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Compliance Tab */}
                    {activeTab === 'compliance' && (
                        <div className="space-y-4">
                            <div className="p-4 bg-[#F9FAFB] rounded-lg mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-[#1F2937]">Overall Compliance</span>
                                    <span className="text-xl font-bold text-[#1F2937]">{locum.overallCompliance}%</span>
                                </div>
                                <div className="w-full h-3 bg-[#E5E7EB] rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${locum.overallCompliance === 100 ? 'bg-[#10B981]' :
                                                locum.overallCompliance >= 75 ? 'bg-[#D97706]' :
                                                    'bg-[#DC2626]'
                                            }`}
                                        style={{ width: `${locum.overallCompliance}%` }}
                                    />
                                </div>
                            </div>

                            <h4 className="font-medium text-[#1F2937]\">Document Status</h4>

                            {/* Medical License */}
                            <div className="p-4 border border-[#E5E7EB] rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-[#1F2937]">Medical Council of Ireland License</span>
                                    {getStatusBadge(locum.documents.medicalLicense.status)}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                                        <Calendar className="w-4 h-4" />
                                        <span>Expiry Date: {locum.documents.medicalLicense.expiryDate}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                                        <Upload className="w-4 h-4" />
                                        <span>Uploaded: {locum.documents.medicalLicense.uploadedDate}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Garda Vetting */}
                            <div className="p-4 border border-[#E5E7EB] rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-[#1F2937]">Garda Vetting Clearance</span>
                                    {getStatusBadge(locum.documents.garda.status)}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                                        <Calendar className="w-4 h-4" />
                                        <span>Expiry Date: {locum.documents.garda.expiryDate}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                                        <Upload className="w-4 h-4" />
                                        <span>Uploaded: {locum.documents.garda.uploadedDate}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Indemnity Insurance */}
                            <div className="p-4 border border-[#E5E7EB] rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-[#1F2937]">Professional Indemnity Insurance</span>
                                    {getStatusBadge(locum.documents.indemnityInsurance.status)}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                                        <Calendar className="w-4 h-4" />
                                        <span>Expiry Date: {locum.documents.indemnityInsurance.expiryDate}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                                        <Upload className="w-4 h-4" />
                                        <span>Uploaded: {locum.documents.indemnityInsurance.uploadedDate}</span>
                                    </div>
                                </div>
                            </div>

                            {/* CPR Training */}
                            <div className="p-4 border border-[#E5E7EB] rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-[#1F2937]">CPR & First Aid Certification</span>
                                    {getStatusBadge(locum.documents.cprTraining.status)}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                                        <Calendar className="w-4 h-4" />
                                        <span>Expiry Date: {locum.documents.cprTraining.expiryDate}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                                        <Upload className="w-4 h-4" />
                                        <span>Uploaded: {locum.documents.cprTraining.uploadedDate}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-6">
                                <button className="flex-1 px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669]">
                                    Send Reminder
                                </button>
                                <button className="flex-1 px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg hover:bg-[#F9FAFB]">
                                    Request Update
                                </button>
                            </div>
                        </div>
                    )}

                    {/* All Shifts Tab */}
                    {activeTab === 'shifts' && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-medium text-[#1F2937] mb-4">All Shifts</h4>
                                <button
                                    onClick={() => setShowShiftsFilter(!showShiftsFilter)}
                                    className="p-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]"
                                >
                                    <SlidersHorizontal className="w-4 h-4" />
                                </button>
                            </div>
                            {showShiftsFilter && (
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <Search className="w-4 h-4 text-[#6B7280]" />
                                        <input
                                            type="text"
                                            value={shiftsSearchTerm}
                                            onChange={(e) => setShiftsSearchTerm(e.target.value)}
                                            placeholder="Search shifts..."
                                            className="p-2 border border-[#E5E7EB] rounded-lg"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-[#6B7280]" />
                                        <select
                                            value={shiftsStatusFilter}
                                            onChange={(e) => setShiftsStatusFilter(e.target.value)}
                                            className="p-2 border border-[#E5E7EB] rounded-lg"
                                        >
                                            <option value="all">All Statuses</option>
                                            <option value="completed">Completed</option>
                                            <option value="accepted">Accepted</option>
                                            <option value="booked">Booked</option>
                                            <option value="declined">Declined</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                            <div className="space-y-3">
                                {mockShifts
                                    .filter(shift =>
                                        shift.facility.toLowerCase().includes(shiftsSearchTerm.toLowerCase()) &&
                                        (shiftsStatusFilter === 'all' || shift.status === shiftsStatusFilter)
                                    )
                                    .map((shift) => (
                                        <div key={shift.id} className="p-4 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <p className="text-sm font-medium text-[#1F2937]">{shift.facility}</p>
                                                    <p className="text-xs text-[#6B7280]">{shift.id}</p>
                                                </div>
                                                {getStatusBadge(shift.status)}
                                            </div>
                                            <div className="grid grid-cols-3 gap-4 text-xs text-[#6B7280] mt-3">
                                                <div>
                                                    <p className="mb-1">Date</p>
                                                    <p className="text-[#1F2937] font-medium">{shift.date}</p>
                                                </div>
                                                <div>
                                                    <p className="mb-1">Time</p>
                                                    <p className="text-[#1F2937] font-medium">{shift.time}</p>
                                                </div>
                                                <div>
                                                    <p className="mb-1">Payment</p>
                                                    <p className="text-[#10B981] font-medium">{formatCurrency(shift.hours * shift.rate)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* Payment History Tab */}
                    {activeTab === 'payments' && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-medium text-[#1F2937] mb-4">Payment History</h4>
                                <button
                                    onClick={() => setShowPaymentsFilter(!showPaymentsFilter)}
                                    className="p-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]"
                                >
                                    <SlidersHorizontal className="w-4 h-4" />
                                </button>
                            </div>
                            {showPaymentsFilter && (
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <Search className="w-4 h-4 text-[#6B7280]" />
                                        <input
                                            type="text"
                                            value={paymentsSearchTerm}
                                            onChange={(e) => setPaymentsSearchTerm(e.target.value)}
                                            placeholder="Search payments..."
                                            className="p-2 border border-[#E5E7EB] rounded-lg"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-[#6B7280]" />
                                        <select
                                            value={paymentsStatusFilter}
                                            onChange={(e) => setPaymentsStatusFilter(e.target.value)}
                                            className="p-2 border border-[#E5E7EB] rounded-lg"
                                        >
                                            <option value="all">All Statuses</option>
                                            <option value="completed">Completed</option>
                                            <option value="pending">Pending</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-[#D1FAE5] rounded-lg p-4">
                                    <p className="text-xs text-[#059669] mb-1">Total Earned</p>
                                    <p className="text-2xl font-bold text-[#059669]">€5,400.00</p>
                                </div>
                                <div className="bg-[#FEF3C7] rounded-lg p-4">
                                    <p className="text-xs text-[#D97706] mb-1">Pending</p>
                                    <p className="text-2xl font-bold text-[#D97706]">€900.00</p>
                                </div>
                                <div className="bg-[#F3F4F6] rounded-lg p-4">
                                    <p className="text-xs text-[#6B7280] mb-1">Transactions</p>
                                    <p className="text-2xl font-bold text-[#1F2937]">{mockPayments.length}</p>
                                </div>
                            </div>

                            <h4 className="font-medium text-[#1F2937] mb-4">Recent Payments</h4>
                            <div className="space-y-3">
                                {mockPayments
                                    .filter(payment =>
                                        payment.description.toLowerCase().includes(paymentsSearchTerm.toLowerCase()) &&
                                        (paymentsStatusFilter === 'all' || payment.status === paymentsStatusFilter)
                                    )
                                    .map((payment) => (
                                        <div key={payment.id} className="p-4 border border-[#E5E7EB] rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <p className="text-sm font-medium text-[#1F2937]">{payment.description}</p>
                                                    <p className="text-xs text-[#6B7280]">{payment.facility}</p>
                                                </div>
                                                {getStatusBadge(payment.status)}
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-[#6B7280] mt-3">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{payment.date}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="w-3 h-3" />
                                                    <span className="text-[#10B981] font-medium">{formatCurrency(payment.amount)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}