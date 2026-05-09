import { useState } from 'react';
import {
    Users, Calendar, Clock, AlertTriangle, ShieldCheck, Wallet,
    TrendingUp, ArrowUp, ArrowDown, Plus, Send, Upload, CheckCircle,
    Zap, Activity, Building2, FileText, ChevronRight, Bell,
    MapPin, Star
} from 'lucide-react';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const shiftTrendsData = [
    { month: 'Sep', filled: 142, open: 28, cancelled: 8 },
    { month: 'Oct', filled: 168, open: 32, cancelled: 12 },
    { month: 'Nov', filled: 155, open: 25, cancelled: 6 },
    { month: 'Dec', filled: 130, open: 40, cancelled: 15 },
    { month: 'Jan', filled: 178, open: 22, cancelled: 9 },
    { month: 'Feb', filled: 195, open: 18, cancelled: 5 },
];

const revenueData = [
    { month: 'Sep', revenue: 285000, cost: 198000 },
    { month: 'Oct', revenue: 312000, cost: 215000 },
    { month: 'Nov', revenue: 298000, cost: 205000 },
    { month: 'Dec', revenue: 265000, cost: 188000 },
    { month: 'Jan', revenue: 342000, cost: 228000 },
    { month: 'Feb', revenue: 368000, cost: 245000 },
];

const specialtyDemand = [
    { name: 'Emergency', value: 32, color: '#EF4444' },
    { name: 'Surgery', value: 24, color: '#10B981' },
    { name: 'Cardiology', value: 18, color: '#3B82F6' },
    { name: 'Pediatrics', value: 14, color: '#F59E0B' },
    { name: 'Other', value: 12, color: '#8B5CF6' },
];

const upcomingBookings = [
    { id: 'BK-001', locum: 'Dr. Sarah Mitchell', facility: "St. James's Hospital", specialty: 'General Surgery', date: '10 Feb', time: '08:00 - 16:00', status: 'confirmed' },
    { id: 'BK-002', locum: 'Dr. James Harrison', facility: 'Cork University Hospital', specialty: 'Cardiology', date: '10 Feb', time: '09:00 - 21:00', status: 'confirmed' },
    { id: 'BK-003', locum: 'Pending Assignment', facility: 'Beaumont Hospital', specialty: 'Emergency Medicine', date: '10 Feb', time: '20:00 - 08:00', status: 'urgent' },
    { id: 'BK-004', locum: 'Dr. Emily Chen', facility: 'University Hospital Galway', specialty: 'Anesthesiology', date: '11 Feb', time: '07:00 - 19:00', status: 'pending' },
    { id: 'BK-005', locum: 'Pending Assignment', facility: 'Mater Hospital', specialty: 'Pediatrics', date: '11 Feb', time: '08:00 - 20:00', status: 'open' },
];

const complianceAlerts = [
    { locum: 'Dr. David Thompson', doc: 'Medical License', daysLeft: 3, severity: 'critical' },
    { locum: 'Dr. Emily Chen', doc: 'Garda Vetting', daysLeft: -12, severity: 'expired' },
    { locum: 'Dr. Rachel Martinez', doc: 'CPR Training', daysLeft: 18, severity: 'warning' },
    { locum: 'Dr. David Thompson', doc: 'Indemnity Insurance', daysLeft: -45, severity: 'expired' },
];

const emergencyAlerts = [
    { id: 1, message: 'Night shift coverage needed at Beaumont Hospital - Emergency Medicine', time: '2 hours ago', priority: 'high' },
    { id: 2, message: 'Waterford University Hospital urgent shift unfilled for 12 Feb', time: '4 hours ago', priority: 'high' },
    { id: 3, message: 'Dr. Michael Brooks called in sick - Limerick replacement needed', time: '5 hours ago', priority: 'medium' },
];

interface DashboardOverviewProps {
    onNavigate: (page: string) => void;
}

export function DashboardOverview({ onNavigate }: DashboardOverviewProps) {
    const [selectedPeriod, setSelectedPeriod] = useState('7d');

    return (
        <div className="p-6 space-y-6">
            {/* Emergency Alerts Banner */}
            {emergencyAlerts.length > 0 && (
                <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Bell className="w-4 h-4 text-[#DC2626]" />
                        <span className="text-sm text-[#DC2626]" style={{ fontWeight: 600 }}>Emergency Staffing Alerts</span>
                        <span className="bg-[#DC2626] text-white text-[10px] px-1.5 py-0.5 rounded-full">{emergencyAlerts.length}</span>
                    </div>
                    <div className="space-y-1.5">
                        {emergencyAlerts.map(alert => (
                            <div key={alert.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${alert.priority === 'high' ? 'bg-[#DC2626]' : 'bg-[#F59E0B]'}`} />
                                    <p className="text-xs text-[#1F2937]">{alert.message}</p>
                                </div>
                                <span className="text-[10px] text-[#9CA3AF] whitespace-nowrap ml-4">{alert.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* KPI Cards Row 1 */}
            <div className="grid grid-cols-5 gap-4">
                {[
                    { label: 'Active Shifts Today', value: '47', change: '+8', trend: 'up', icon: Activity, color: '#10B981', bg: '#D1FAE5' },
                    { label: 'Open Requests', value: '12', change: '-3', trend: 'down', icon: Calendar, color: '#3B82F6', bg: '#DBEAFE' },
                    { label: 'Pending Approvals', value: '5', change: '+2', trend: 'up', icon: Clock, color: '#F59E0B', bg: '#FEF3C7' },
                    { label: 'Available Locums', value: '892', change: '+24', trend: 'up', icon: Users, color: '#8B5CF6', bg: '#EDE9FE' },
                    { label: 'Compliance Alerts', value: '4', change: '+1', trend: 'up', icon: AlertTriangle, color: '#EF4444', bg: '#FEE2E2' },
                ].map((kpi) => {
                    const Icon = kpi.icon;
                    return (
                        <div key={kpi.label} className="bg-white rounded-xl p-4 border border-[#E5E7EB] hover:shadow-sm transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: kpi.bg }}>
                                    <Icon className="w-[18px] h-[18px]" style={{ color: kpi.color }} />
                                </div>
                                <span className={`flex items-center gap-0.5 text-xs ${kpi.trend === 'up' && kpi.label !== 'Compliance Alerts' ? 'text-[#10B981]' : kpi.label === 'Compliance Alerts' ? 'text-[#EF4444]' : 'text-[#10B981]'}`}>
                                    {kpi.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                    {kpi.change}
                                </span>
                            </div>
                            <p className="text-2xl text-[#1F2937]" style={{ fontWeight: 700 }}>{kpi.value}</p>
                            <p className="text-xs text-[#9CA3AF] mt-0.5">{kpi.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* KPI Cards Row 2 */}
            <div className="grid grid-cols-5 gap-4">
                {[
                    { label: 'Payroll This Month', value: '€245,800', sub: '+12% vs last month', icon: Wallet },
                    { label: 'Revenue MTD', value: '€368,200', sub: '+18% vs last month', icon: TrendingUp },
                    { label: 'Total Clients', value: '156', sub: '12 new this month', icon: Building2 },
                    { label: 'Fill Rate', value: '91.5%', sub: '+3.2% improvement', icon: CheckCircle },
                    { label: 'Avg. Time to Fill', value: '4.2h', sub: '-1.8h from last month', icon: Zap },
                ].map((kpi) => {
                    const Icon = kpi.icon;
                    return (
                        <div key={kpi.label} className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
                            <div className="flex items-center gap-2 mb-2">
                                <Icon className="w-4 h-4 text-[#9CA3AF]" />
                                <p className="text-xs text-[#9CA3AF]">{kpi.label}</p>
                            </div>
                            <p className="text-xl text-[#1F2937]" style={{ fontWeight: 700 }}>{kpi.value}</p>
                            <p className="text-xs text-[#10B981] mt-0.5">{kpi.sub}</p>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
                <h3 className="text-[#1F2937] mb-3">Quick Actions</h3>
                <div className="flex gap-3">
                    {[
                        { label: 'Post New Shift', icon: Plus, color: '#10B981', onClick: () => onNavigate('shifts') },
                        { label: 'Book Locum', icon: Users, color: '#3B82F6', onClick: () => onNavigate('locums') },
                        { label: 'Approve Timesheets', icon: CheckCircle, color: '#F59E0B', onClick: () => onNavigate('timesheets') },
                        { label: 'Send Broadcast', icon: Send, color: '#8B5CF6', onClick: () => onNavigate('communications') },
                        { label: 'Upload Compliance Doc', icon: Upload, color: '#EF4444', onClick: () => onNavigate('compliance') },
                        { label: 'Generate Invoice', icon: FileText, color: '#06B6D4', onClick: () => onNavigate('payroll') },
                    ].map((action) => {
                        const Icon = action.icon;
                        return (
                            <button
                                key={action.label}
                                onClick={action.onClick}
                                className="flex-1 flex flex-col items-center gap-2 py-3 rounded-lg border border-[#E5E7EB] hover:border-[#10B981] hover:shadow-sm transition-all"
                            >
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${action.color}15` }}>
                                    <Icon className="w-[18px] h-[18px]" style={{ color: action.color }} />
                                </div>
                                <span className="text-xs text-[#6B7280]">{action.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-3 gap-5">
                {/* Shift Fill Trends */}
                <div className="col-span-2 bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-[#1F2937]">Shift Fill Trends</h3>
                            <p className="text-xs text-[#9CA3AF]">Monthly shift status breakdown</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 bg-[#10B981] rounded-full" />
                                    <span className="text-xs text-[#6B7280]">Filled</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 bg-[#3B82F6] rounded-full" />
                                    <span className="text-xs text-[#6B7280]">Open</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 bg-[#EF4444] rounded-full" />
                                    <span className="text-xs text-[#6B7280]">Cancelled</span>
                                </div>
                            </div>
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                                className="px-2 py-1 text-xs border border-[#E5E7EB] rounded-lg"
                            >
                                <option value="7d">Last 7 Days</option>
                                <option value="30d">Last 30 Days</option>
                                <option value="6m">Last 6 Months</option>
                            </select>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={shiftTrendsData} barGap={2}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                            <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis stroke="#9CA3AF" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '12px' }} />
                            <Bar dataKey="filled" fill="#10B981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="open" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="cancelled" fill="#EF4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Specialty Demand */}
                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <h3 className="text-[#1F2937] mb-1">Specialty Demand</h3>
                    <p className="text-xs text-[#9CA3AF] mb-3">Current shift distribution</p>
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie
                                data={specialtyDemand}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={75}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {specialtyDemand.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-2">
                        {specialtyDemand.map((s) => (
                            <div key={s.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                                    <span className="text-xs text-[#6B7280]">{s.name}</span>
                                </div>
                                <span className="text-xs text-[#1F2937]" style={{ fontWeight: 600 }}>{s.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Revenue & Bookings Row */}
            <div className="grid grid-cols-3 gap-5">
                {/* Revenue Chart */}
                <div className="col-span-2 bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-[#1F2937]">Revenue & Cost Overview</h3>
                            <p className="text-xs text-[#9CA3AF]">Monthly revenue vs operating costs</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 bg-[#10B981] rounded-full" />
                                <span className="text-xs text-[#6B7280]">Revenue</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 bg-[#9CA3AF] rounded-full" />
                                <span className="text-xs text-[#6B7280]">Cost</span>
                            </div>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                            <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis stroke="#9CA3AF" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`} />
                            <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '12px' }} formatter={(value: number) => [`€${value.toLocaleString()}`, '']} />
                            <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 4 }} />
                            <Line type="monotone" dataKey="cost" stroke="#9CA3AF" strokeWidth={2} dot={{ fill: '#9CA3AF', r: 4 }} strokeDasharray="5 5" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Compliance Alerts */}
                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[#1F2937]">Compliance Alerts</h3>
                        <button onClick={() => onNavigate('compliance')} className="text-xs text-[#10B981] hover:underline flex items-center gap-1">
                            View All <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="space-y-3">
                        {complianceAlerts.map((alert, i) => (
                            <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-[#F9FAFB]">
                                <div className={`w-2 h-2 rounded-full mt-1.5 ${alert.severity === 'expired' ? 'bg-[#DC2626]' : alert.severity === 'critical' ? 'bg-[#F59E0B]' : 'bg-[#F59E0B]'}`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-[#1F2937]" style={{ fontWeight: 500 }}>{alert.locum}</p>
                                    <p className="text-[11px] text-[#6B7280]">{alert.doc}</p>
                                    <p className={`text-[11px] mt-0.5 ${alert.daysLeft < 0 ? 'text-[#DC2626]' : 'text-[#F59E0B]'}`} style={{ fontWeight: 500 }}>
                                        {alert.daysLeft < 0 ? `Expired ${Math.abs(alert.daysLeft)} days ago` : `Expires in ${alert.daysLeft} days`}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Upcoming Bookings Table */}
            <div className="bg-white rounded-xl border border-[#E5E7EB]">
                <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
                    <div>
                        <h3 className="text-[#1F2937]">Upcoming Bookings</h3>
                        <p className="text-xs text-[#9CA3AF]">Next 48 hours</p>
                    </div>
                    <button onClick={() => onNavigate('shifts')} className="text-xs text-[#10B981] hover:underline flex items-center gap-1">
                        View All <ChevronRight className="w-3 h-3" />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#E5E7EB]">
                                {['Booking', 'Locum', 'Facility', 'Specialty', 'Schedule', 'Status'].map(h => (
                                    <th key={h} className="px-4 py-2.5 text-left text-xs text-[#9CA3AF]" style={{ fontWeight: 500 }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {upcomingBookings.map(b => (
                                <tr key={b.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                                    <td className="px-4 py-3 text-xs text-[#6B7280]">{b.id}</td>
                                    <td className="px-4 py-3 text-sm text-[#1F2937]">{b.locum}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <Building2 className="w-3 h-3 text-[#9CA3AF]" />
                                            <span className="text-xs text-[#6B7280]">{b.facility}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-[#6B7280]">{b.specialty}</td>
                                    <td className="px-4 py-3">
                                        <p className="text-xs text-[#1F2937]">{b.date}</p>
                                        <p className="text-[11px] text-[#9CA3AF]">{b.time}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-[11px] border ${b.status === 'confirmed' ? 'bg-[#D1FAE5] text-[#059669] border-[#A7F3D0]' :
                                                b.status === 'urgent' ? 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]' :
                                                    b.status === 'pending' ? 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]' :
                                                        'bg-[#DBEAFE] text-[#1D4ED8] border-[#BFDBFE]'
                                            }`}>
                                            {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Performance Metrics Row */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: 'Locum Retention Rate', value: '87%', sub: 'Last 12 months', color: '#10B981' },
                    { label: 'Client Satisfaction', value: '4.7/5', sub: 'Based on 342 reviews', color: '#F59E0B' },
                    { label: 'Avg Shift Completion', value: '96.8%', sub: 'Across all locums', color: '#3B82F6' },
                    { label: 'Profit Margin', value: '33.4%', sub: 'Trending upward', color: '#8B5CF6' },
                ].map((metric) => (
                    <div key={metric.label} className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-[#9CA3AF]">{metric.label}</p>
                            <Star className="w-3.5 h-3.5 text-[#E5E7EB]" />
                        </div>
                        <p className="text-xl text-[#1F2937]" style={{ fontWeight: 700, color: metric.color }}>{metric.value}</p>
                        <p className="text-[11px] text-[#9CA3AF] mt-1">{metric.sub}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
