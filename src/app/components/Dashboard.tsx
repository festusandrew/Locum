import {
    Users,
    Calendar,
    DollarSign,
    Activity,
    TrendingUp,
    ArrowUp,
    Search,
    SlidersHorizontal,
    Download
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useState } from 'react';

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

    const filteredLocums = locumsList.filter(locum => {
        const matchesSearch = locum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            locum.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            locum.department.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

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
                            <span className="text-2xl font-bold text-[#1F2937]">€7,209.29</span>
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