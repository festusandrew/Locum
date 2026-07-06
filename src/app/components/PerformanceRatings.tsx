import { useState, useEffect } from 'react';
import {
    Star, Users, Building2, TrendingUp, Award, ThumbsUp,
    Clock, Target, ArrowUp, ArrowDown, Search, Download,
    BarChart3, CheckCircle, AlertTriangle, Eye
} from 'lucide-react';
import { Pagination } from './ui/Pagination';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, RadarChart, Radar, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis, LineChart, Line
} from 'recharts';

interface LocumPerformance {
    id: string;
    name: string;
    specialty: string;
    department: string;
    avgRating: number;
    totalShifts: number;
    completionRate: number;
    onTimeRate: number;
    clientFeedback: number;
    reliability: number;
    trend: 'up' | 'down' | 'stable';
}

interface ClientPerformance {
    id: string;
    name: string;
    type: string;
    paymentReliability: number;
    bookingFrequency: number;
    avgPaymentDays: number;
    complaints: number;
    satisfaction: number;
    trend: 'up' | 'down' | 'stable';
}

const locumPerformances: LocumPerformance[] = [
    { id: 'LP-001', name: 'Sarah Mitchell', specialty: 'General Surgery', department: 'Surgery', avgRating: 4.9, totalShifts: 145, completionRate: 99.3, onTimeRate: 97.2, clientFeedback: 4.8, reliability: 98, trend: 'up' },
    { id: 'LP-002', name: 'James Harrison', specialty: 'Cardiology', department: 'Cardiology', avgRating: 4.8, totalShifts: 128, completionRate: 97.7, onTimeRate: 95.3, clientFeedback: 4.7, reliability: 96, trend: 'stable' },
    { id: 'LP-003', name: 'Emily Chen', specialty: 'Anesthesiology', department: 'Surgery', avgRating: 4.9, totalShifts: 162, completionRate: 99.4, onTimeRate: 98.1, clientFeedback: 4.9, reliability: 99, trend: 'up' },
    { id: 'LP-004', name: 'Michael Brooks', specialty: 'Emergency Medicine', department: 'Emergency (A&E)', avgRating: 4.5, totalShifts: 98, completionRate: 93.9, onTimeRate: 88.8, clientFeedback: 4.3, reliability: 91, trend: 'down' },
    { id: 'LP-005', name: 'Rachel Martinez', specialty: 'Pediatrics', department: 'Pediatrics', avgRating: 4.7, totalShifts: 134, completionRate: 96.3, onTimeRate: 94.0, clientFeedback: 4.6, reliability: 95, trend: 'up' },
    { id: 'LP-006', name: 'David Thompson', specialty: 'Orthopedics', department: 'Surgery', avgRating: 4.4, totalShifts: 86, completionRate: 94.2, onTimeRate: 90.7, clientFeedback: 4.2, reliability: 92, trend: 'down' },
];

const clientPerformances: ClientPerformance[] = [
    { id: 'CP-001', name: "St. James's Hospital", type: 'Hospital', paymentReliability: 98, bookingFrequency: 42, avgPaymentDays: 14, complaints: 0, satisfaction: 4.8, trend: 'up' },
    { id: 'CP-002', name: 'Cork University Hospital', type: 'Hospital', paymentReliability: 95, bookingFrequency: 28, avgPaymentDays: 21, complaints: 1, satisfaction: 4.6, trend: 'stable' },
    { id: 'CP-003', name: 'Galway Clinic', type: 'Clinic', paymentReliability: 100, bookingFrequency: 15, avgPaymentDays: 7, complaints: 0, satisfaction: 4.9, trend: 'up' },
    { id: 'CP-004', name: 'Mater Hospital', type: 'Hospital', paymentReliability: 92, bookingFrequency: 35, avgPaymentDays: 28, complaints: 2, satisfaction: 4.3, trend: 'down' },
    { id: 'CP-005', name: 'Beaumont Hospital', type: 'Hospital', paymentReliability: 96, bookingFrequency: 22, avgPaymentDays: 18, complaints: 1, satisfaction: 4.5, trend: 'stable' },
];

const kpiData = [
    { month: 'Sep', fillRate: 84, timeToFill: 6.2, retention: 82, satisfaction: 4.5 },
    { month: 'Oct', fillRate: 86, timeToFill: 5.8, retention: 84, satisfaction: 4.5 },
    { month: 'Nov', fillRate: 88, timeToFill: 5.2, retention: 85, satisfaction: 4.6 },
    { month: 'Dec', fillRate: 82, timeToFill: 6.5, retention: 83, satisfaction: 4.4 },
    { month: 'Jan', fillRate: 90, timeToFill: 4.5, retention: 86, satisfaction: 4.7 },
    { month: 'Feb', fillRate: 91.5, timeToFill: 4.2, retention: 87, satisfaction: 4.7 },
];

const radarData = [
    { metric: 'Fill Rate', value: 91.5 },
    { metric: 'Retention', value: 87 },
    { metric: 'Satisfaction', value: 94 },
    { metric: 'On-Time', value: 94.2 },
    { metric: 'Completion', value: 96.8 },
    { metric: 'Compliance', value: 94.8 },
];

export function PerformanceRatings() {
    const [activeTab, setActiveTab] = useState<'locum' | 'client' | 'kpi'>('locum');
    const [searchTerm, setSearchTerm] = useState('');
    const [locumPage, setLocumPage] = useState(1);
    const locumPageSize = 4;
    const [clientPage, setClientPage] = useState(1);
    const clientPageSize = 4;

    useEffect(() => {
        setLocumPage(1);
        setClientPage(1);
    }, [searchTerm]);

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.floor(rating) ? 'text-[#F59E0B] fill-[#F59E0B]' : s - 0.5 <= rating ? 'text-[#F59E0B] fill-[#F59E0B] opacity-50' : 'text-[#E5E7EB]'}`} />
                ))}
                <span className="text-xs text-[#6B7280] ml-1">{rating.toFixed(1)}</span>
            </div>
        );
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="text-[#1F2937] mb-1">Performance & Ratings</h2>
                <p className="text-sm text-[#6B7280]">Track locum and client performance metrics, ratings, and KPIs</p>
            </div>

            {/* KPI Summary */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: 'Fill Rate', value: '91.5%', change: '+3.2%', icon: Target, color: '#10B981', bg: '#D1FAE5', up: true },
                    { label: 'Avg. Time to Fill', value: '4.2h', change: '-1.8h', icon: Clock, color: '#3B82F6', bg: '#DBEAFE', up: true },
                    { label: 'Locum Retention', value: '87%', change: '+2%', icon: Users, color: '#8B5CF6', bg: '#EDE9FE', up: true },
                    { label: 'Client Satisfaction', value: '4.7/5', change: '+0.2', icon: Star, color: '#F59E0B', bg: '#FEF3C7', up: true },
                ].map(kpi => {
                    const Icon = kpi.icon;
                    return (
                        <div key={kpi.label} className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: kpi.bg }}>
                                    <Icon className="w-5 h-5" style={{ color: kpi.color }} />
                                </div>
                                <div>
                                    <p className="text-xs text-[#9CA3AF]">{kpi.label}</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-xl text-[#1F2937]" style={{ fontWeight: 700 }}>{kpi.value}</p>
                                        <span className="text-xs text-[#10B981] flex items-center gap-0.5">
                                            <ArrowUp className="w-3 h-3" /> {kpi.change}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-[#E5E7EB]">
                <div className="border-b border-[#E5E7EB] px-5 flex items-center justify-between">
                    <div className="flex gap-6">
                        {[
                            { id: 'locum' as const, label: 'Locum Performance', icon: Users },
                            { id: 'client' as const, label: 'Client Performance', icon: Building2 },
                            { id: 'kpi' as const, label: 'KPI Reports', icon: BarChart3 },
                        ].map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-3 text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === tab.id ? 'border-[#10B981] text-[#10B981]' : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'}`}
                                    style={{ fontWeight: activeTab === tab.id ? 600 : 400 }}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]">
                        <Download className="w-4 h-4" /> Export
                    </button>
                </div>

                {activeTab === 'locum' && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#E5E7EB]">
                                    {['Locum', 'Specialty', 'Department', 'Rating', 'Shifts', 'Completion', 'On-Time', 'Reliability', 'Trend'].map(h => (
                                        <th key={h} className="px-4 py-2.5 text-left text-xs text-[#9CA3AF]" style={{ fontWeight: 500 }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {locumPerformances.slice((locumPage - 1) * locumPageSize, locumPage * locumPageSize).map(lp => (
                                    <tr key={lp.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center text-white text-xs">
                                                    {lp.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                </div>
                                                <p className="text-sm text-[#1F2937]">{lp.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-[#6B7280]">{lp.specialty}</td>
                                        <td className="px-4 py-3 text-xs text-[#6B7280]">{lp.department}</td>
                                        <td className="px-4 py-3">{renderStars(lp.avgRating)}</td>
                                        <td className="px-4 py-3 text-sm text-[#1F2937]" style={{ fontWeight: 500 }}>{lp.totalShifts}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-12 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full ${lp.completionRate >= 97 ? 'bg-[#10B981]' : lp.completionRate >= 95 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`} style={{ width: `${lp.completionRate}%` }} />
                                                </div>
                                                <span className="text-xs text-[#1F2937]">{lp.completionRate}%</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-[#1F2937]">{lp.onTimeRate}%</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-[11px] border ${lp.reliability >= 95 ? 'bg-[#D1FAE5] text-[#059669] border-[#A7F3D0]' : lp.reliability >= 90 ? 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]' : 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]'}`}>
                                                {lp.reliability}%
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {lp.trend === 'up' ? <ArrowUp className="w-4 h-4 text-[#10B981]" /> : lp.trend === 'down' ? <ArrowDown className="w-4 h-4 text-[#EF4444]" /> : <span className="text-xs text-[#9CA3AF]">-</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Pagination
                            currentPage={locumPage}
                            totalItems={locumPerformances.length}
                            pageSize={locumPageSize}
                            onPageChange={setLocumPage}
                        />
                    </div>
                )}

                {activeTab === 'client' && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#E5E7EB]">
                                    {['Client', 'Type', 'Payment Reliability', 'Avg Pay Days', 'Monthly Bookings', 'Complaints', 'Satisfaction', 'Trend'].map(h => (
                                        <th key={h} className="px-4 py-2.5 text-left text-xs text-[#9CA3AF]" style={{ fontWeight: 500 }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {clientPerformances.slice((clientPage - 1) * clientPageSize, clientPage * clientPageSize).map(cp => (
                                    <tr key={cp.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2.5">
                                                <Building2 className="w-4 h-4 text-[#9CA3AF]" />
                                                <p className="text-sm text-[#1F2937]">{cp.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-[#6B7280]">{cp.type}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-12 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#10B981] rounded-full" style={{ width: `${cp.paymentReliability}%` }} />
                                                </div>
                                                <span className="text-xs text-[#1F2937]">{cp.paymentReliability}%</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs ${cp.avgPaymentDays <= 14 ? 'text-[#10B981]' : cp.avgPaymentDays <= 21 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
                                                {cp.avgPaymentDays} days
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-[#1F2937]" style={{ fontWeight: 500 }}>{cp.bookingFrequency}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs ${cp.complaints === 0 ? 'text-[#10B981]' : cp.complaints <= 1 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
                                                {cp.complaints}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">{renderStars(cp.satisfaction)}</td>
                                        <td className="px-4 py-3">
                                            {cp.trend === 'up' ? <ArrowUp className="w-4 h-4 text-[#10B981]" /> : cp.trend === 'down' ? <ArrowDown className="w-4 h-4 text-[#EF4444]" /> : <span className="text-xs text-[#9CA3AF]">-</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Pagination
                            currentPage={clientPage}
                            totalItems={clientPerformances.length}
                            pageSize={clientPageSize}
                            onPageChange={setClientPage}
                        />
                    </div>
                )}

                {activeTab === 'kpi' && (
                    <div className="p-5 space-y-5">
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <h4 className="text-[#1F2937] mb-3">KPI Trends</h4>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={kpiData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                                        <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '12px' }} />
                                        <Line type="monotone" dataKey="fillRate" stroke="#10B981" strokeWidth={2} name="Fill Rate %" />
                                        <Line type="monotone" dataKey="retention" stroke="#3B82F6" strokeWidth={2} name="Retention %" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div>
                                <h4 className="text-[#1F2937] mb-3">Performance Radar</h4>
                                <ResponsiveContainer width="100%" height={300}>
                                    <RadarChart data={radarData}>
                                        <PolarGrid stroke="#E5E7EB" />
                                        <PolarAngleAxis dataKey="metric" tick={{ fill: '#6B7280', fontSize: 11 }} />
                                        <PolarRadiusAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} domain={[0, 100]} />
                                        <Radar dataKey="value" stroke="#10B981" fill="#10B981" fillOpacity={0.2} strokeWidth={2} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
