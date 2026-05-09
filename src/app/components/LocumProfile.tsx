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
    SlidersHorizontal
} from 'lucide-react';
import { useState } from 'react';

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
    const [currentMonth, setCurrentMonth] = useState(11); // December (0-indexed)
    const [currentYear, setCurrentYear] = useState(2024);

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
    const getDaysInMonth = (month: number, year: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month: number, year: number) => {
        return new Date(year, month, 1).getDay();
    };

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentMonth, currentYear);
        const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
        const days = [];

        // Empty cells for days before the month starts
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="p-2"></div>);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const hasEvent = mockScheduleEvents.some(e => e.date === day && e.month === currentMonth && e.year === currentYear);
            const event = mockScheduleEvents.find(e => e.date === day && e.month === currentMonth && e.year === currentYear);

            days.push(
                <div key={day} className={`p-2 border border-[#E5E7EB] rounded-lg text-center ${hasEvent ? 'bg-[#D1FAE5]' : 'hover:bg-[#F9FAFB]'}`}>
                    <div className="text-sm font-medium text-[#1F2937]">{day}</div>
                    {event && (
                        <div className="text-xs text-[#10B981] mt-1">{event.shift}</div>
                    )}
                </div>
            );
        }

        return days;
    };

    const previousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>
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
                    )}

                    {/* Schedule Tab */}
                    {activeTab === 'schedule' && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="font-medium text-[#1F2937]">
                                    {monthNames[currentMonth]} {currentYear}
                                </h4>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={previousMonth}
                                        className="p-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={nextMonth}
                                        className="p-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Calendar */}
                            <div className="grid grid-cols-7 gap-2 mb-4">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                    <div key={day} className="p-2 text-center text-xs font-medium text-[#6B7280]">
                                        {day}
                                    </div>
                                ))}
                                {renderCalendar()}
                            </div>

                            {/* Upcoming Shifts */}
                            <div className="mt-6">
                                <h4 className="font-medium text-[#1F2937] mb-4">Upcoming Shifts</h4>
                                <div className="space-y-3">
                                    {mockScheduleEvents.map((event, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 border border-[#E5E7EB] rounded-lg">
                                            <div>
                                                <p className="text-sm font-medium text-[#1F2937]">{event.facility}</p>
                                                <p className="text-xs text-[#6B7280]">{event.date}/{event.month + 1}/{event.year} • {event.shift} Shift</p>
                                            </div>
                                            <span className="px-3 py-1 bg-[#DBEAFE] text-[#1D4ED8] border border-[#BFDBFE] rounded text-xs">
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