import {
    Users,
    Calendar,
    DollarSign,
    Activity,
    TrendingUp,
    ArrowUp,
    Search,
    SlidersHorizontal,
    Download,
    ChevronDown,
    Sparkles
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useState, useEffect } from 'react';
import { useSystemSettings } from '../contexts/SystemSettingsContext';
import { toast } from 'sonner';

const admissionDischargeData = [
    { month: 'Jun', admissions: 160, discharges: 145 },
    { month: 'Jul', admissions: 185, discharges: 170 },
    { month: 'Aug', admissions: 145, discharges: 165 },
    { month: 'Sep', admissions: 210, discharges: 190 },
    { month: 'Oct', admissions: 168, discharges: 143 },
    { month: 'Nov', admissions: 155, discharges: 135 },
    { month: 'Dec', admissions: 125, discharges: 110 },
];

const locumsList = [
    {
        id: '#GS234FS',
        name: 'Sarah Mitchell',
        gender: 'Female',
        age: '32 years old',
        date: 'Nov, 28-2024',
        department: 'General Surgery',
        diagnosis: 'Appendicitis',
        avatar: '👩‍⚕️'
    },
    {
        id: '#EC0125D',
        name: 'James Harrison',
        gender: 'Male',
        age: '45 years old',
        date: 'Nov, 28-2024',
        department: 'Cardiology',
        diagnosis: 'Coronary Artery Disease',
        avatar: '👨‍⚕️'
    },
    {
        id: '#MK4521A',
        name: 'Emily Chen',
        gender: 'Female',
        age: '38 years old',
        date: 'Nov, 29-2024',
        department: 'Anesthesiology',
        diagnosis: 'Post-operative Care',
        avatar: '👩‍⚕️'
    },
    {
        id: '#LW9872P',
        name: 'Michael Brooks',
        gender: 'Male',
        age: '41 years old',
        date: 'Nov, 29-2024',
        department: 'Emergency Medicine',
        diagnosis: 'Trauma Assessment',
        avatar: '👨‍⚕️'
    },
];

const doctorSchedule = [
    { name: 'Sarah Mitchell', specialty: 'Anesthesiology', status: 'available', available: 72, unavailable: 24, leave: 16 },
    { name: 'James Harrison', specialty: 'Dermatology', status: 'unavailable', available: 68, unavailable: 28, leave: 14 },
    { name: 'Emily Chen', specialty: 'General Surgery', status: 'available', available: 75, unavailable: 20, leave: 15 },
];

export function Dashboard() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showFilterDialog, setShowFilterDialog] = useState(false);
    const { isWhitelabelActive, brandingFacilityId, setBrandingFacilityId, setIsWhitelabelActive, formatCurrency } = useSystemSettings();

    const [clientsList, setClientsList] = useState<any[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('mployus_clients');
        if (stored) {
            try {
                setClientsList(JSON.parse(stored));
            } catch (e) {
                console.error("Error loading client directory for dashboard switcher:", e);
            }
        }
    }, [brandingFacilityId, isWhitelabelActive]);

    const handleExport = () => {
        const csvContent = [
            ['Locum ID', 'Name', 'Gender', 'Age', 'Date', 'Department', 'Primary Diagnosis'],
            ...locumsList.map(locum => [
                locum.id,
                locum.name,
                locum.gender,
                locum.age,
                locum.date,
                locum.department,
                locum.diagnosis
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `locums-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const activeClient = clientsList.find(c => c.id === brandingFacilityId);

    // If active tenant whitelabel context is loaded, render custom Client Portal Dashboard View
    if (isWhitelabelActive && activeClient) {
        return (
            <div className="p-6 space-y-6 animate-in fade-in duration-200">
                {/* Page Title & Status */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider" style={{ backgroundColor: activeClient.themeColor || '#10B981' }}>
                                Client Portal View
                            </span>
                            <h2 className="text-[#1F2937]" style={{ fontWeight: 700 }}>{activeClient.name} Dashboard</h2>
                        </div>
                        <p className="text-sm text-[#6B7280]">Comprehensive dashboard for managing roster allocations, staffing requests, and shift billing schedules</p>
                    </div>
                </div>

                {/* Client KPI Cards */}
                <div className="grid grid-cols-4 gap-5">
                    {/* Active Placed Locums */}
                    <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#EFF6FF]">
                                <Users className="w-5 h-5 text-[#3B82F6]" />
                            </div>
                            <span className="text-[11px] px-2 py-0.5 bg-[#D1FAE5] text-[#059669] rounded-full font-medium">92% Filled</span>
                        </div>
                        <div className="mb-2">
                            <span className="text-2xl font-bold text-[#1F2937]">{activeClient.activeShifts || 4} Placed</span>
                            <p className="text-xs text-[#6B7280] mt-1">Locum clinicians active this week</p>
                        </div>
                    </div>

                    {/* Total Shift Placements */}
                    <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#ECFDF5]">
                                <Calendar className="w-5 h-5 text-[#10B981]" />
                            </div>
                            <span className="text-[11px] px-2 py-0.5 bg-[#FEF3C7] text-[#D97706] rounded-full font-medium">3 Pending</span>
                        </div>
                        <div className="mb-2">
                            <span className="text-2xl font-bold text-[#1F2937]">{Math.round((activeClient.activeShifts || 4) * 2.5)} Rostered</span>
                            <p className="text-xs text-[#6B7280] mt-1">Total active & upcoming shift slots</p>
                        </div>
                    </div>

                    {/* Total Budget Spend */}
                    <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#FDF2F8]">
                                <DollarSign className="w-5 h-5 text-[#DB2777]" />
                            </div>
                            <span className="text-[11px] px-2 py-0.5 bg-[#EFF6FF] text-[#1D4ED8] rounded-full font-medium">Under Budget</span>
                        </div>
                        <div className="mb-2">
                            <span className="text-2xl font-bold text-[#1F2937]">{formatCurrency(activeClient.monthlySpend)}</span>
                            <p className="text-xs text-[#6B7280] mt-1">Accumulated staffing cost this month</p>
                        </div>
                    </div>

                    {/* Average Roster Fill Rate */}
                    <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F5F3FF]">
                                <Activity className="w-5 h-5 text-[#7C3AED]" />
                            </div>
                            <span className="text-[11px] px-2 py-0.5 bg-[#D1FAE5] text-[#059669] rounded-full font-medium">+2.1% MoM</span>
                        </div>
                        <div className="mb-2">
                            <span className="text-2xl font-bold text-[#1F2937]">94.2%</span>
                            <p className="text-xs text-[#6B7280] mt-1">Average shift fulfillment rate</p>
                        </div>
                    </div>
                </div>

                {/* Charts & Allocations */}
                <div className="grid grid-cols-3 gap-5">
                    {/* Budget vs Actual Cost Chart */}
                    <div className="col-span-2 bg-white rounded-xl p-5 border border-[#E5E7EB]">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-[#F3F4F6] rounded-lg flex items-center justify-center">
                                    <TrendingUp className="w-4 h-4 text-[#6B7280]" />
                                </div>
                                <h3 className="text-[#1F2937]">Monthly Staffing Budget vs Actual</h3>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-[#9CA3AF] rounded-full" />
                                    <span className="text-xs text-[#6B7280]">Target Budget</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: activeClient.themeColor || '#10B981' }} />
                                    <span className="text-xs text-[#6B7280]">Actual Spend</span>
                                </div>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={260}>
                            <LineChart data={[
                                { month: 'Jan', budget: Math.round(activeClient.monthlySpend * 0.9), actual: Math.round(activeClient.monthlySpend * 0.85) },
                                { month: 'Feb', budget: Math.round(activeClient.monthlySpend * 0.9), actual: Math.round(activeClient.monthlySpend * 0.92) },
                                { month: 'Mar', budget: Math.round(activeClient.monthlySpend * 1.0), actual: Math.round(activeClient.monthlySpend * 0.95) },
                                { month: 'Apr', budget: Math.round(activeClient.monthlySpend * 1.0), actual: Math.round(activeClient.monthlySpend * 1.02) },
                                { month: 'May', budget: Math.round(activeClient.monthlySpend * 1.1), actual: Math.round(activeClient.monthlySpend * 1.0) }
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                                <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis stroke="#9CA3AF" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '12px' }} />
                                <Line type="monotone" dataKey="budget" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                                <Line type="monotone" dataKey="actual" stroke={activeClient.themeColor || '#10B981'} strokeWidth={2.5} dot={{ fill: activeClient.themeColor || '#10B981', r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Departmental Allocation Needs */}
                    <div className="bg-white rounded-xl p-5 border border-[#E5E7EB] flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-[#F3F4F6] rounded-lg flex items-center justify-center">
                                    <Activity className="w-4 h-4 text-[#6B7280]" />
                                </div>
                                <h3 className="text-[#1F2937]">Shift Fulfillment Needs</h3>
                            </div>
                            <p className="text-xs text-[#6B7280] mb-4">Department rosters and urgent gaps for this week</p>
                            <div className="space-y-4">
                                {[
                                    { name: 'Emergency Medicine', required: 4, fulfilled: 3, progress: 75, color: activeClient.themeColor || '#3B82F6' },
                                    { name: 'Intensive Care (ICU)', required: 3, fulfilled: 3, progress: 100, color: '#10B981' },
                                    { name: 'General Surgery', required: 2, fulfilled: 1, progress: 50, color: '#F59E0B' },
                                ].map((dept, idx) => (
                                    <div key={idx} className="space-y-1.5">
                                        <div className="flex justify-between text-xs font-semibold">
                                            <span className="text-[#1F2937]">{dept.name}</span>
                                            <span className="text-[#6B7280]">{dept.fulfilled} / {dept.required} staff</span>
                                        </div>
                                        <div className="w-full bg-[#F3F4F6] rounded-full h-2">
                                            <div className="rounded-full h-2 transition-all duration-500" style={{ width: `${dept.progress}%`, backgroundColor: dept.progress === 100 ? '#10B981' : dept.color }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button className="w-full py-2 px-3 mt-4 text-xs font-bold text-center text-white rounded-lg hover:brightness-95 transition-all" style={{ backgroundColor: activeClient.themeColor || '#10B981' }}>
                            + Request New Staff Placement
                        </button>
                    </div>
                </div>

                {/* Booked Staff Roster table (HIPAA Compliant, No diagnosis/clinical metrics!) */}
                <div className="bg-white rounded-xl border border-[#E5E7EB]">
                    <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#F3F4F6] rounded-lg flex items-center justify-center">
                                <Users className="w-4 h-4 text-[#6B7280]" />
                            </div>
                            <h3 className="text-[#1F2937]">Active Placed Staff Roster</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#6B7280] hover:bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                                <Download className="w-3.5 h-3.5" /> Export Timesheets
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                                    <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Booking ID</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Placed Locum</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Specialty Dept</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Hourly Rate</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Approved Hours</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Roster Period</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Approved Cost</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Placement Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { id: '#BK-8821', locum: 'Sarah Mitchell', specialty: 'Anesthesiology', rate: 120, hours: 36, date: 'May 12, 2026', status: 'Active' },
                                    { id: '#BK-4921', locum: 'James Harrison', specialty: 'Cardiology', rate: 145, hours: 24, date: 'May 13, 2026', status: 'Scheduled' },
                                    { id: '#BK-3012', locum: 'Emily Chen', specialty: 'General Surgery', rate: 130, hours: 40, date: 'May 14, 2026', status: 'Active' },
                                    { id: '#BK-1102', locum: 'Michael Brooks', specialty: 'Emergency Medicine', rate: 110, hours: 48, date: 'May 15, 2026', status: 'Completed' }
                                ].map((roster, index) => (
                                    <tr key={index} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                                        <td className="px-5 py-4 text-xs font-mono font-semibold text-[#1F2937]">{roster.id}</td>
                                        <td className="px-5 py-4 text-sm font-semibold text-[#1F2937] flex items-center gap-2">
                                            <span className="w-6 h-6 rounded-full bg-[#F3F4F6] flex items-center justify-center text-xs">👤</span>
                                            {roster.locum}
                                        </td>
                                        <td className="px-5 py-4 text-sm text-[#4B5563]">{roster.specialty}</td>
                                        <td className="px-5 py-4 text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>€{roster.rate}/hr</td>
                                        <td className="px-5 py-4 text-sm text-[#6B7280]">{roster.hours} hrs</td>
                                        <td className="px-5 py-4 text-xs text-[#6B7280]">{roster.date}</td>
                                        <td className="px-5 py-4 text-sm text-[#1F2937]" style={{ fontWeight: 700 }}>€{(roster.rate * roster.hours).toLocaleString()}</td>
                                        <td className="px-5 py-4">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{
                                                backgroundColor: roster.status === 'Active' ? `${activeClient.themeColor || '#10B981'}15` : roster.status === 'Completed' ? '#D1FAE5' : '#F3F4F6',
                                                color: roster.status === 'Active' ? (activeClient.themeColor || '#10B981') : roster.status === 'Completed' ? '#059669' : '#6B7280',
                                                border: `1px solid ${roster.status === 'Active' ? `${activeClient.themeColor || '#10B981'}30` : roster.status === 'Completed' ? '#A7F3D0' : '#E5E7EB'}`
                                            }}>
                                                ● {roster.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    const filteredLocums = locumsList.filter(locum => {
        const matchesSearch = locum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            locum.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            locum.department.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    return (
        <div className="p-6">
            {/* Page Title */}
            <div className="mb-6">
                <h2 className="text-[#1F2937] mb-1">Dashboard</h2>
                <p className="text-sm text-[#6B7280]">Overview of all your detailed of patients and your income</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-5 mb-6">
                {/* Total Locums */}
                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 bg-[#F3F4F6] rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-[#6B7280]" />
                        </div>
                    </div>
                    <div className="mb-2">
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-2xl font-bold text-[#1F2937]">1,072</span>
                            <span className="flex items-center gap-1 text-xs text-[#10B981]">
                                <ArrowUp className="w-3 h-3" />
                                +12%
                            </span>
                        </div>
                        <p className="text-xs text-[#6B7280]">Locum increase in 7 days.</p>
                    </div>
                    <button className="text-xs text-[#6B7280] hover:text-[#1F2937]">See details</button>
                </div>

                {/* Total Appointments */}
                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 bg-[#F3F4F6] rounded-full flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-[#6B7280]" />
                        </div>
                    </div>
                    <div className="mb-2">
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-2xl font-bold text-[#1F2937]">197</span>
                            <span className="flex items-center gap-1 text-xs text-[#10B981]">
                                <ArrowUp className="w-3 h-3" />
                                +10%
                            </span>
                        </div>
                        <p className="text-xs text-[#6B7280]">Appointment increase in 7 days.</p>
                    </div>
                    <button className="text-xs text-[#6B7280] hover:text-[#1F2937]">See details</button>
                </div>

                {/* Total Income */}
                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 bg-[#F3F4F6] rounded-full flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-[#6B7280]" />
                        </div>
                    </div>
                    <div className="mb-2">
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-2xl font-bold text-[#1F2937]">{formatCurrency(7209.29)}</span>
                            <span className="flex items-center gap-1 text-xs text-[#10B981]">
                                <ArrowUp className="w-3 h-3" />
                                +24%
                            </span>
                        </div>
                        <p className="text-xs text-[#6B7280]">Treatments increase in 7 days.</p>
                    </div>
                    <button className="text-xs text-[#6B7280] hover:text-[#1F2937]">See details</button>
                </div>

                {/* Total Shifts */}
                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 bg-[#F3F4F6] rounded-full flex items-center justify-center">
                            <Activity className="w-5 h-5 text-[#6B7280]" />
                        </div>
                    </div>
                    <div className="mb-2">
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-2xl font-bold text-[#1F2937]">234</span>
                            <span className="flex items-center gap-1 text-xs text-[#10B981]">
                                <ArrowUp className="w-3 h-3" />
                                +11%
                            </span>
                        </div>
                        <p className="text-xs text-[#6B7280]">Income increase in 7 days.</p>
                    </div>
                    <button className="text-xs text-[#6B7280] hover:text-[#1F2937]">See details</button>
                </div>
            </div>

            {/* Charts and Schedule Row */}
            <div className="grid grid-cols-3 gap-5 mb-6">
                {/* Shift Fill Trends Chart */}
                <div className="col-span-2 bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#F3F4F6] rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-[#6B7280]" />
                            </div>
                            <h3 className="text-[#1F2937]">Admission and Discharge Trends</h3>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-[#10B981] rounded-full" />
                                <span className="text-xs text-[#6B7280]">Admissions</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-[#6B7280] rounded-full" />
                                <span className="text-xs text-[#6B7280]">Discharges</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute top-8 left-16 bg-white px-2 py-1 rounded shadow-sm border border-[#E5E7EB] z-10">
                            <p className="text-xs font-medium text-[#1F2937]">Oct, 2024</p>
                            <p className="text-xs text-[#6B7280]">Admissions: 168</p>
                            <p className="text-xs text-[#6B7280]">Discharges: 143</p>
                        </div>
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={admissionDischargeData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    stroke="#9CA3AF"
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    stroke="#9CA3AF"
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px',
                                        fontSize: '12px'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="admissions"
                                    stroke="#10B981"
                                    strokeWidth={2}
                                    dot={{ fill: '#10B981', r: 4 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="discharges"
                                    stroke="#6B7280"
                                    strokeWidth={2}
                                    dot={{ fill: '#6B7280', r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Doctor's Schedule */}
                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-8 h-8 bg-[#F3F4F6] rounded-lg flex items-center justify-center">
                            <Activity className="w-4 h-4 text-[#6B7280]" />
                        </div>
                        <h3 className="text-[#1F2937]">Locum&apos;s Schedule</h3>
                    </div>

                    {/* Summary Stats */}
                    <div className="flex gap-4 mb-5">
                        <div>
                            <p className="text-2xl font-bold text-[#1F2937]">72</p>
                            <p className="text-xs text-[#6B7280]">Available</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#1F2937]">24</p>
                            <p className="text-xs text-[#6B7280]">Unavailable</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#1F2937]">16</p>
                            <p className="text-xs text-[#6B7280]">Leave</p>
                        </div>
                    </div>

                    {/* List of Doctors */}
                    <div>
                        <p className="text-sm font-medium text-[#1F2937] mb-3">List of Locum</p>
                        <div className="space-y-3">
                            {doctorSchedule.map((doctor, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-[#F3F4F6] rounded-full flex items-center justify-center">
                                            <span className="text-xs">👤</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-[#1F2937]">{doctor.name}</p>
                                            <p className="text-xs text-[#6B7280]">{doctor.specialty}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-xs ${doctor.status === 'available'
                                            ? 'bg-[#D1FAE5] text-[#059669] border border-[#A7F3D0]'
                                            : 'bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]'
                                        }`}>
                                        {doctor.status === 'available' ? '● Available' : '● Unavailable'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Locum List Table */}
            <div className="bg-white rounded-xl border border-[#E5E7EB]">
                <div className="p-5 border-b border-[#E5E7EB]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#F3F4F6] rounded-lg flex items-center justify-center">
                                <Users className="w-4 h-4 text-[#6B7280]" />
                            </div>
                            <h3 className="text-[#1F2937]">Locum List</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-2 px-3 py-2 text-sm text-[#6B7280] hover:bg-[#F9FAFB] rounded-lg">
                                <Search className="w-4 h-4" />
                                Search
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 text-sm text-[#6B7280] hover:bg-[#F9FAFB] rounded-lg">
                                <SlidersHorizontal className="w-4 h-4" />
                                Filter
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 text-sm text-[#6B7280] hover:bg-[#F9FAFB] rounded-lg" onClick={handleExport}>
                                <Download className="w-4 h-4" />
                                Export
                            </button>
                            <select className="px-3 py-2 text-sm text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]">
                                <option>All Status</option>
                                <option>Available</option>
                                <option>Unavailable</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#E5E7EB]">
                                <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Locum ID</th>
                                <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Name</th>
                                <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Gender</th>
                                <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Age</th>
                                <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Date</th>
                                <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Department</th>
                                <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Primary Diagnosis</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLocums.map((locum, index) => (
                                <tr key={index} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                                    <td className="px-5 py-4 text-sm text-[#1F2937]">{locum.id}</td>
                                    <td className="px-5 py-4 text-sm text-[#1F2937]">{locum.name}</td>
                                    <td className="px-5 py-4 text-sm text-[#6B7280]">{locum.gender}</td>
                                    <td className="px-5 py-4 text-sm text-[#6B7280]">{locum.age}</td>
                                    <td className="px-5 py-4 text-sm text-[#6B7280]">{locum.date}</td>
                                    <td className="px-5 py-4 text-sm text-[#6B7280]">{locum.department}</td>
                                    <td className="px-5 py-4 text-sm text-[#6B7280]">{locum.diagnosis}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}