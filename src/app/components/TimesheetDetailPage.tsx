import { useState } from 'react';
import {
    ArrowLeft, Clock, CheckCircle, XCircle, AlertTriangle, Download,
    FileText, MapPin, Building2, User, Calendar, Navigation, Upload,
    Edit, MoreHorizontal, ThumbsUp, ThumbsDown, MessageSquare, Activity, X
} from 'lucide-react';

interface TimesheetDetailPageProps {
    timesheetId: string;
    onBack: () => void;
}

const timesheetProfiles: Record<string, any> = {
    'TS-2026-001': {
        id: 'TS-2026-001',
        locum: 'Dr. Sarah Mitchell',
        locumId: 'LOC-001',
        facility: "St. James's Hospital",
        facilityId: 'CL-001',
        location: 'Dublin',
        address: "James's Street, Dublin 8",
        department: 'General Surgery',
        shiftDate: '2026-02-09',
        dayOfWeek: 'Sunday',
        clockIn: '07:58',
        clockOut: '16:05',
        scheduledStart: '08:00',
        scheduledEnd: '16:00',
        scheduledHours: 8.0,
        actualHours: 8.12,
        regularHours: 8.0,
        overtime: 0.12,
        breaksTaken: 0.5,
        rate: 55.00,
        overtimeRate: 82.50,
        totalPay: 446.60,
        status: 'submitted',
        gpsVerified: true,
        gpsClockIn: '53.3415, -6.2872',
        gpsClockOut: '53.3416, -6.2870',
        signature: true,
        signatureTimestamp: '2026-02-09 16:10',
        supportingDocs: true,
        submittedAt: '2026-02-09 16:30',
        submittedBy: 'Dr. Sarah Mitchell',
        shiftType: 'Day Shift',
        paymentMethod: 'PAYE',
        niNumber: 'AB123456C',
        taxCode: '1257L',
        pensionContrib: true,
        timeline: [
            { date: '2026-02-09 16:30', user: 'Dr. Sarah Mitchell', action: 'Timesheet submitted', details: 'Submitted for approval with all verifications' },
            { date: '2026-02-09 16:10', user: 'Dr. Sarah Mitchell', action: 'Digital signature captured', details: 'Signed electronically via mobile app' },
            { date: '2026-02-09 16:05', user: 'System', action: 'Clock out recorded', details: 'GPS verified at facility location' },
            { date: '2026-02-09 07:58', user: 'System', action: 'Clock in recorded', details: 'GPS verified at facility location' },
        ],
        notes: [],
        attachments: [
            { name: 'Parking_Receipt.pdf', size: '124 KB', uploadedAt: '2026-02-09 16:25' },
        ],
        breakdown: {
            grossPay: 446.60,
            incomeTax: 89.32,
            niEmployee: 44.66,
            pensionEmployee: 22.33,
            netPay: 290.29,
            niEmployer: 49.13,
            pensionEmployer: 13.40,
            totalEmployerCost: 509.13,
        },
    },
    'TS-2026-002': {
        id: 'TS-2026-002',
        locum: 'Dr. James Harrison',
        locumId: 'LOC-002',
        facility: 'Cork University Hospital',
        facilityId: 'CL-002',
        location: 'Cork',
        address: 'Wilton, Cork',
        department: 'Cardiology',
        shiftDate: '2026-02-09',
        dayOfWeek: 'Sunday',
        clockIn: '08:55',
        clockOut: '21:10',
        scheduledStart: '09:00',
        scheduledEnd: '21:00',
        scheduledHours: 12.0,
        actualHours: 12.25,
        regularHours: 12.0,
        overtime: 0.25,
        breaksTaken: 0.75,
        rate: 60.00,
        overtimeRate: 90.00,
        totalPay: 735.00,
        status: 'pending_client',
        gpsVerified: true,
        gpsClockIn: '51.8985, -8.4756',
        gpsClockOut: '51.8985, -8.4756',
        signature: true,
        signatureTimestamp: '2026-02-09 21:15',
        supportingDocs: false,
        submittedAt: '2026-02-09 21:45',
        submittedBy: 'Dr. James Harrison',
        shiftType: 'Long Day',
        paymentMethod: 'Self-Employed (Umbrella)',
        niNumber: 'CD789012E',
        taxCode: '1257L',
        pensionContrib: false,
        timeline: [
            { date: '2026-02-10 09:00', user: 'System', action: 'Sent to client for approval', details: 'Awaiting confirmation from facility' },
            { date: '2026-02-09 21:45', user: 'Dr. James Harrison', action: 'Timesheet submitted', details: 'Submitted for agency review' },
            { date: '2026-02-09 21:15', user: 'Dr. James Harrison', action: 'Digital signature captured', details: 'Signed via mobile app' },
            { date: '2026-02-09 21:10', user: 'System', action: 'Clock out recorded', details: 'GPS verified' },
            { date: '2026-02-09 08:55', user: 'System', action: 'Clock in recorded', details: 'GPS verified' },
        ],
        notes: [
            { date: '2026-02-09', author: 'Dr. James Harrison', content: 'Very busy shift. Multiple emergency cases. No time for proper lunch break.' },
        ],
        attachments: [],
        breakdown: {
            grossPay: 735.00,
            incomeTax: 0, // Self-employed
            niEmployee: 0,
            pensionEmployee: 0,
            netPay: 735.00,
            niEmployer: 0,
            pensionEmployer: 0,
            totalEmployerCost: 735.00,
        },
    },
};

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
    submitted: { label: 'Submitted', color: '#3B82F6', bg: '#DBEAFE', border: '#BFDBFE' },
    approved: { label: 'Approved', color: '#059669', bg: '#D1FAE5', border: '#A7F3D0' },
    rejected: { label: 'Rejected', color: '#DC2626', bg: '#FEE2E2', border: '#FECACA' },
    pending_client: { label: 'Pending Client', color: '#D97706', bg: '#FEF3C7', border: '#FDE68A' },
    auto_approved: { label: 'Auto-Approved', color: '#059669', bg: '#D1FAE5', border: '#A7F3D0' },
};

function getTimesheetProfile(id: string) {
    if (timesheetProfiles[id]) return timesheetProfiles[id];
    return timesheetProfiles['TS-2026-001'];
}

export function TimesheetDetailPage({ timesheetId, onBack }: TimesheetDetailPageProps) {
    const profile = getTimesheetProfile(timesheetId);
    const [activeTab, setActiveTab] = useState<'details' | 'breakdown' | 'timeline' | 'notes'>('details');
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    const config = statusConfig[profile.status];

    const tabs = [
        { id: 'details' as const, label: 'Timesheet Details' },
        { id: 'breakdown' as const, label: 'Pay Breakdown' },
        { id: 'timeline' as const, label: 'Timeline' },
        { id: 'notes' as const, label: 'Notes & Attachments' },
    ];

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(amount);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="p-6 space-y-6">
            {/* Back + Header */}
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors">
                    <ArrowLeft className="w-4 h-4 text-[#6B7280]" />
                </button>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h2 className="text-[#1F2937]">Timesheet Details</h2>
                        <span className="px-2 py-0.5 rounded text-[11px] border" style={{ backgroundColor: config.bg, color: config.color, borderColor: config.border }}>
                            {config.label}
                        </span>
                    </div>
                    <p className="text-sm text-[#6B7280]">Comprehensive timesheet information and approval workflow</p>
                </div>
                <div className="flex items-center gap-2">
                    {profile.status === 'submitted' && (
                        <>
                            <button
                                onClick={() => setShowRejectModal(true)}
                                className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#DC2626] border border-[#DC2626] rounded-lg hover:bg-[#FEE2E2]"
                            >
                                <XCircle className="w-3.5 h-3.5" /> Reject
                            </button>
                            <button
                                onClick={() => setShowApprovalModal(true)}
                                className="flex items-center gap-1.5 px-3 py-2 text-sm bg-[#10B981] text-white rounded-lg hover:bg-[#059669]"
                            >
                                <CheckCircle className="w-3.5 h-3.5" /> Approve
                            </button>
                        </>
                    )}
                    <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]">
                        <Download className="w-3.5 h-3.5" /> Export PDF
                    </button>
                    <button className="p-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]">
                        <MoreHorizontal className="w-4 h-4 text-[#6B7280]" />
                    </button>
                </div>
            </div>

            {/* Header Card */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
                <div className="flex items-start gap-5">
                    <div className="w-20 h-20 bg-[#EFF6FF] rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Clock className="w-10 h-10 text-[#3B82F6]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl text-[#1F2937]" style={{ fontWeight: 700 }}>{profile.locum}</h3>
                            <span className="text-xs text-[#9CA3AF] bg-[#F3F4F6] px-2 py-0.5 rounded">{profile.id}</span>
                        </div>
                        <p className="text-sm text-[#6B7280] mb-3">{formatDate(profile.shiftDate)} · {profile.dayOfWeek} · {profile.shiftType}</p>
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#6B7280]">
                            <span className="flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-[#9CA3AF]" />{profile.facility}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-[#9CA3AF]" />{profile.location}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-[#9CA3AF]" />{profile.department}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-[#9CA3AF]" />{profile.clockIn} - {profile.clockOut}
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 flex-shrink-0">
                        <div className="bg-[#F9FAFB] rounded-lg px-4 py-3 text-center min-w-[90px]">
                            <p className="text-lg text-[#1F2937]" style={{ fontWeight: 700 }}>{profile.actualHours.toFixed(2)}h</p>
                            <p className="text-[10px] text-[#9CA3AF]">Actual Hours</p>
                        </div>
                        <div className="bg-[#F9FAFB] rounded-lg px-4 py-3 text-center min-w-[90px]">
                            <p className="text-lg text-[#F59E0B]" style={{ fontWeight: 700 }}>{profile.overtime > 0 ? `+${profile.overtime.toFixed(2)}h` : '0h'}</p>
                            <p className="text-[10px] text-[#9CA3AF]">Overtime</p>
                        </div>
                        <div className="bg-[#F9FAFB] rounded-lg px-4 py-3 text-center min-w-[90px]">
                            <p className="text-lg text-[#10B981]" style={{ fontWeight: 700 }}>{formatCurrency(profile.totalPay)}</p>
                            <p className="text-[10px] text-[#9CA3AF]">Total Pay</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-[#E5E7EB]">
                <div className="border-b border-[#E5E7EB] px-5 flex gap-1 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-3 px-4 text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-[#10B981] text-[#10B981]' : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'}`}
                            style={{ fontWeight: activeTab === tab.id ? 600 : 400 }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {/* === DETAILS === */}
                    {activeTab === 'details' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                {/* Time & Attendance */}
                                <div className="space-y-4">
                                    <h4 className="text-sm text-[#1F2937] flex items-center gap-2" style={{ fontWeight: 600 }}>
                                        <Clock className="w-4 h-4 text-[#3B82F6]" /> Time & Attendance
                                    </h4>
                                    <div className="bg-[#F9FAFB] rounded-lg p-4 space-y-3">
                                        {[
                                            { label: 'Shift Date', value: formatDate(profile.shiftDate) },
                                            { label: 'Day of Week', value: profile.dayOfWeek },
                                            { label: 'Scheduled Hours', value: `${profile.scheduledHours.toFixed(2)} hours` },
                                            { label: 'Scheduled Times', value: `${profile.scheduledStart} - ${profile.scheduledEnd}` },
                                            { label: 'Clock In', value: profile.clockIn },
                                            { label: 'Clock Out', value: profile.clockOut },
                                            { label: 'Actual Hours Worked', value: `${profile.actualHours.toFixed(2)} hours` },
                                            { label: 'Regular Hours', value: `${profile.regularHours.toFixed(2)} hours` },
                                            { label: 'Overtime Hours', value: `${profile.overtime.toFixed(2)} hours` },
                                            { label: 'Breaks Taken', value: `${profile.breaksTaken.toFixed(2)} hours` },
                                        ].map(item => (
                                            <div key={item.label} className="flex justify-between items-start">
                                                <span className="text-xs text-[#9CA3AF] min-w-[140px]">{item.label}</span>
                                                <span className="text-xs text-[#1F2937] text-right" style={{ fontWeight: 500 }}>{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Facility & Worker Info */}
                                <div className="space-y-4">
                                    <h4 className="text-sm text-[#1F2937] flex items-center gap-2" style={{ fontWeight: 600 }}>
                                        <Building2 className="w-4 h-4 text-[#10B981]" /> Facility & Worker Information
                                    </h4>
                                    <div className="bg-[#F0FDF4] rounded-lg p-4 space-y-3">
                                        {[
                                            { label: 'Locum Name', value: profile.locum },
                                            { label: 'Locum ID', value: profile.locumId },
                                            { label: 'Facility Name', value: profile.facility },
                                            { label: 'Facility ID', value: profile.facilityId },
                                            { label: 'Department', value: profile.department },
                                            { label: 'Location', value: profile.location },
                                            { label: 'Full Address', value: profile.address },
                                            { label: 'Shift Type', value: profile.shiftType },
                                            { label: 'NI Number', value: profile.niNumber },
                                            { label: 'Tax Code', value: profile.taxCode },
                                        ].map(item => (
                                            <div key={item.label} className="flex justify-between items-start">
                                                <span className="text-xs text-[#065F46]">{item.label}</span>
                                                <span className="text-xs text-[#065F46] text-right" style={{ fontWeight: 500 }}>{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Pay Rates */}
                            <div>
                                <h4 className="text-sm text-[#1F2937] flex items-center gap-2 mb-3" style={{ fontWeight: 600 }}>
                                    <FileText className="w-4 h-4 text-[#8B5CF6]" /> Pay Rates
                                </h4>
                                <div className="border border-[#E5E7EB] rounded-lg p-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-xs text-[#9CA3AF] mb-1">Standard Hourly Rate</p>
                                            <p className="text-lg text-[#1F2937]" style={{ fontWeight: 700 }}>{formatCurrency(profile.rate)}/hr</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#9CA3AF] mb-1">Overtime Rate (1.5x)</p>
                                            <p className="text-lg text-[#F59E0B]" style={{ fontWeight: 700 }}>{formatCurrency(profile.overtimeRate)}/hr</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#9CA3AF] mb-1">Payment Method</p>
                                            <p className="text-sm text-[#1F2937]" style={{ fontWeight: 500 }}>{profile.paymentMethod}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Verification Status */}
                            <div>
                                <h4 className="text-sm text-[#1F2937] flex items-center gap-2 mb-3" style={{ fontWeight: 600 }}>
                                    <CheckCircle className="w-4 h-4 text-[#10B981]" /> Verification Status
                                </h4>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className={`border rounded-lg p-4 ${profile.gpsVerified ? 'border-[#A7F3D0] bg-[#ECFDF5]' : 'border-[#FECACA] bg-[#FEF2F2]'}`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            {profile.gpsVerified ? (
                                                <CheckCircle className="w-5 h-5 text-[#10B981]" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-[#DC2626]" />
                                            )}
                                            <span className="text-sm" style={{ fontWeight: 600, color: profile.gpsVerified ? '#059669' : '#DC2626' }}>
                                                GPS Verification
                                            </span>
                                        </div>
                                        <p className="text-xs text-[#6B7280]">Clock In: {profile.gpsClockIn}</p>
                                        <p className="text-xs text-[#6B7280]">Clock Out: {profile.gpsClockOut}</p>
                                    </div>

                                    <div className={`border rounded-lg p-4 ${profile.signature ? 'border-[#A7F3D0] bg-[#ECFDF5]' : 'border-[#FECACA] bg-[#FEF2F2]'}`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            {profile.signature ? (
                                                <CheckCircle className="w-5 h-5 text-[#10B981]" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-[#DC2626]" />
                                            )}
                                            <span className="text-sm" style={{ fontWeight: 600, color: profile.signature ? '#059669' : '#DC2626' }}>
                                                Digital Signature
                                            </span>
                                        </div>
                                        <p className="text-xs text-[#6B7280]">
                                            {profile.signature ? `Signed: ${profile.signatureTimestamp}` : 'Not signed'}
                                        </p>
                                    </div>

                                    <div className={`border rounded-lg p-4 ${profile.supportingDocs ? 'border-[#A7F3D0] bg-[#ECFDF5]' : 'border-[#FDE68A] bg-[#FFFBEB]'}`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            {profile.supportingDocs ? (
                                                <CheckCircle className="w-5 h-5 text-[#10B981]" />
                                            ) : (
                                                <Upload className="w-5 h-5 text-[#F59E0B]" />
                                            )}
                                            <span className="text-sm" style={{ fontWeight: 600, color: profile.supportingDocs ? '#059669' : '#D97706' }}>
                                                Supporting Documents
                                            </span>
                                        </div>
                                        <p className="text-xs text-[#6B7280]">
                                            {profile.supportingDocs ? `${profile.attachments?.length || 0} file(s) attached` : 'No files attached'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Submission Info */}
                            <div>
                                <h4 className="text-sm text-[#1F2937] flex items-center gap-2 mb-3" style={{ fontWeight: 600 }}>
                                    <Activity className="w-4 h-4 text-[#6B7280]" /> Submission Information
                                </h4>
                                <div className="bg-[#F9FAFB] rounded-lg p-4 space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-[#9CA3AF]">Submitted By</span>
                                        <span className="text-[#1F2937]" style={{ fontWeight: 500 }}>{profile.submittedBy}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-[#9CA3AF]">Submitted At</span>
                                        <span className="text-[#1F2937]" style={{ fontWeight: 500 }}>{profile.submittedAt}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-[#9CA3AF]">Current Status</span>
                                        <span className="px-2 py-0.5 rounded text-[11px] border" style={{ backgroundColor: config.bg, color: config.color, borderColor: config.border }}>
                                            {config.label}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* === PAY BREAKDOWN === */}
                    {activeTab === 'breakdown' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                {/* Employee Pay */}
                                <div>
                                    <h4 className="text-sm text-[#1F2937] mb-3" style={{ fontWeight: 600 }}>Employee Pay Breakdown</h4>
                                    <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
                                        <div className="bg-[#F9FAFB] px-4 py-2 border-b border-[#E5E7EB]">
                                            <p className="text-xs text-[#9CA3AF]" style={{ fontWeight: 500 }}>EARNINGS</p>
                                        </div>
                                        <div className="p-4 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-[#6B7280]">Regular Hours ({profile.regularHours}h @ {formatCurrency(profile.rate)}/h)</span>
                                                <span className="text-[#1F2937]" style={{ fontWeight: 600 }}>{formatCurrency(profile.regularHours * profile.rate)}</span>
                                            </div>
                                            {profile.overtime > 0 && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-[#6B7280]">Overtime ({profile.overtime}h @ {formatCurrency(profile.overtimeRate)}/h)</span>
                                                    <span className="text-[#F59E0B]" style={{ fontWeight: 600 }}>{formatCurrency(profile.overtime * profile.overtimeRate)}</span>
                                                </div>
                                            )}
                                            <div className="border-t border-[#E5E7EB] pt-2 mt-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-[#1F2937]" style={{ fontWeight: 600 }}>Gross Pay</span>
                                                    <span className="text-[#1F2937]" style={{ fontWeight: 700 }}>{formatCurrency(profile.breakdown.grossPay)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {profile.paymentMethod === 'PAYE' && (
                                            <>
                                                <div className="bg-[#F9FAFB] px-4 py-2 border-t border-[#E5E7EB]">
                                                    <p className="text-xs text-[#9CA3AF]" style={{ fontWeight: 500 }}>DEDUCTIONS</p>
                                                </div>
                                                <div className="p-4 space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-[#6B7280]">Income Tax (PAYE)</span>
                                                        <span className="text-[#DC2626]">-{formatCurrency(profile.breakdown.incomeTax)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-[#6B7280]">National Insurance (Employee)</span>
                                                        <span className="text-[#DC2626]">-{formatCurrency(profile.breakdown.niEmployee)}</span>
                                                    </div>
                                                    {profile.pensionContrib && (
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-[#6B7280]">Pension Contribution (5%)</span>
                                                            <span className="text-[#DC2626]">-{formatCurrency(profile.breakdown.pensionEmployee)}</span>
                                                        </div>
                                                    )}
                                                    <div className="border-t border-[#E5E7EB] pt-2 mt-2">
                                                        <div className="flex justify-between">
                                                            <span className="text-[#1F2937]" style={{ fontWeight: 600 }}>Net Pay</span>
                                                            <span className="text-lg text-[#10B981]" style={{ fontWeight: 700 }}>{formatCurrency(profile.breakdown.netPay)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Employer Costs */}
                                {profile.paymentMethod === 'PAYE' && (
                                    <div>
                                        <h4 className="text-sm text-[#1F2937] mb-3" style={{ fontWeight: 600 }}>Employer Costs</h4>
                                        <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
                                            <div className="bg-[#F9FAFB] px-4 py-2 border-b border-[#E5E7EB]">
                                                <p className="text-xs text-[#9CA3AF]" style={{ fontWeight: 500 }}>EMPLOYER CONTRIBUTIONS</p>
                                            </div>
                                            <div className="p-4 space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-[#6B7280]">Gross Pay</span>
                                                    <span className="text-[#1F2937]">{formatCurrency(profile.breakdown.grossPay)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-[#6B7280]">Employer NI (11%)</span>
                                                    <span className="text-[#F59E0B]">+{formatCurrency(profile.breakdown.niEmployer)}</span>
                                                </div>
                                                {profile.pensionContrib && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-[#6B7280]">Employer Pension (3%)</span>
                                                        <span className="text-[#F59E0B]">+{formatCurrency(profile.breakdown.pensionEmployer)}</span>
                                                    </div>
                                                )}
                                                <div className="border-t border-[#E5E7EB] pt-2 mt-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-[#1F2937]" style={{ fontWeight: 600 }}>Total Employer Cost</span>
                                                        <span className="text-lg text-[#1F2937]" style={{ fontWeight: 700 }}>{formatCurrency(profile.breakdown.totalEmployerCost)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {profile.paymentMethod !== 'PAYE' && (
                                    <div>
                                        <h4 className="text-sm text-[#1F2937] mb-3" style={{ fontWeight: 600 }}>Self-Employed Notes</h4>
                                        <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg p-4">
                                            <p className="text-xs text-[#1E40AF]">
                                                <span style={{ fontWeight: 600 }}>Note:</span> As a self-employed contractor via umbrella company, you are responsible for your own tax and National Insurance contributions. No PAYE or employer contributions apply.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* === TIMELINE === */}
                    {activeTab === 'timeline' && (
                        <div className="space-y-4">
                            <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>Timesheet Timeline</h4>
                            <div className="space-y-1">
                                {profile.timeline.map((event: any, idx: number) => (
                                    <div key={idx} className="flex gap-4 pb-4 border-l-2 border-[#E5E7EB] pl-4 ml-2 last:border-l-0">
                                        <div className="relative">
                                            <div className="absolute -left-[22px] w-3 h-3 bg-[#10B981] rounded-full border-2 border-white" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-sm text-[#1F2937]" style={{ fontWeight: 500 }}>{event.action}</p>
                                                <span className="text-xs text-[#9CA3AF]">{event.date}</span>
                                            </div>
                                            <p className="text-xs text-[#6B7280]">{event.details}</p>
                                            <p className="text-xs text-[#9CA3AF] mt-0.5">by {event.user}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* === NOTES & ATTACHMENTS === */}
                    {activeTab === 'notes' && (
                        <div className="space-y-6">
                            {/* Notes */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>Timesheet Notes</h4>
                                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#10B981] border border-[#10B981] rounded-lg hover:bg-[#ECFDF5]">
                                        <MessageSquare className="w-3.5 h-3.5" /> Add Note
                                    </button>
                                </div>
                                {profile.notes.length > 0 ? (
                                    <div className="space-y-3">
                                        {profile.notes.map((note: any, idx: number) => (
                                            <div key={idx} className="border border-[#E5E7EB] rounded-lg p-4 bg-[#FFFBEB]">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <p className="text-sm text-[#1F2937]" style={{ fontWeight: 500 }}>{note.author}</p>
                                                        <p className="text-xs text-[#9CA3AF]">{formatDate(note.date)}</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-[#6B7280]">{note.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="border border-[#E5E7EB] rounded-lg p-8 text-center">
                                        <MessageSquare className="w-8 h-8 text-[#9CA3AF] mx-auto mb-2" />
                                        <p className="text-sm text-[#9CA3AF]">No notes added yet</p>
                                    </div>
                                )}
                            </div>

                            {/* Attachments */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>Attachments</h4>
                                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#10B981] border border-[#10B981] rounded-lg hover:bg-[#ECFDF5]">
                                        <Upload className="w-3.5 h-3.5" /> Upload File
                                    </button>
                                </div>
                                {profile.attachments && profile.attachments.length > 0 ? (
                                    <div className="space-y-2">
                                        {profile.attachments.map((file: any, idx: number) => (
                                            <div key={idx} className="flex items-center justify-between border border-[#E5E7EB] rounded-lg p-3 hover:bg-[#F9FAFB]">
                                                <div className="flex items-center gap-3">
                                                    <FileText className="w-5 h-5 text-[#3B82F6]" />
                                                    <div>
                                                        <p className="text-sm text-[#1F2937]" style={{ fontWeight: 500 }}>{file.name}</p>
                                                        <p className="text-xs text-[#9CA3AF]">{file.size} · Uploaded {file.uploadedAt}</p>
                                                    </div>
                                                </div>
                                                <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#3B82F6] border border-[#3B82F6] rounded-lg hover:bg-[#EFF6FF]">
                                                    <Download className="w-3.5 h-3.5" /> Download
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="border border-[#E5E7EB] rounded-lg p-8 text-center">
                                        <Upload className="w-8 h-8 text-[#9CA3AF] mx-auto mb-2" />
                                        <p className="text-sm text-[#9CA3AF]">No files attached</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Approval Modal */}
            {showApprovalModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
                    <div className="bg-white rounded-xl w-full max-w-lg">
                        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
                            <h3 className="text-[#1F2937]" style={{ fontWeight: 600 }}>Approve Timesheet</h3>
                            <button onClick={() => setShowApprovalModal(false)} className="p-2 hover:bg-[#F3F4F6] rounded-lg">
                                <X className="w-5 h-5 text-[#6B7280]" />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-lg p-4">
                                <p className="text-sm text-[#059669]">
                                    <span style={{ fontWeight: 600 }}>Confirm approval</span> for timesheet {profile.id}. The locum will be notified and the timesheet will be processed for payment.
                                </p>
                            </div>
                            <div className="bg-[#F9FAFB] rounded-lg p-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-[#6B7280]">Total Hours:</span>
                                    <span className="text-[#1F2937]" style={{ fontWeight: 600 }}>{profile.actualHours.toFixed(2)}h</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#6B7280]">Gross Pay:</span>
                                    <span className="text-[#1F2937]" style={{ fontWeight: 600 }}>{formatCurrency(profile.totalPay)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-5 border-t border-[#E5E7EB] flex justify-end gap-2">
                            <button onClick={() => setShowApprovalModal(false)} className="px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg text-sm hover:bg-[#F9FAFB]">
                                Cancel
                            </button>
                            <button className="px-4 py-2 bg-[#10B981] text-white rounded-lg text-sm hover:bg-[#059669] flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Approve Timesheet
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
                    <div className="bg-white rounded-xl w-full max-w-lg">
                        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
                            <h3 className="text-[#1F2937]" style={{ fontWeight: 600 }}>Reject Timesheet</h3>
                            <button onClick={() => setShowRejectModal(false)} className="p-2 hover:bg-[#F3F4F6] rounded-lg">
                                <X className="w-5 h-5 text-[#6B7280]" />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-lg p-4">
                                <p className="text-sm text-[#92400E]">
                                    <span style={{ fontWeight: 600 }}>Warning:</span> Rejecting this timesheet will notify the locum and require them to resubmit with corrections.
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm text-[#1F2937] mb-1" style={{ fontWeight: 500 }}>Reason for Rejection <span className="text-[#EF4444]">*</span></label>
                                <textarea
                                    value={rejectionReason}
                                    onChange={e => setRejectionReason(e.target.value)}
                                    placeholder="Please provide a clear reason for rejection..."
                                    rows={4}
                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                />
                            </div>
                        </div>
                        <div className="p-5 border-t border-[#E5E7EB] flex justify-end gap-2">
                            <button onClick={() => setShowRejectModal(false)} className="px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg text-sm hover:bg-[#F9FAFB]">
                                Cancel
                            </button>
                            <button className="px-4 py-2 bg-[#DC2626] text-white rounded-lg text-sm hover:bg-[#B91C1C] flex items-center gap-2">
                                <XCircle className="w-4 h-4" />
                                Reject Timesheet
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
