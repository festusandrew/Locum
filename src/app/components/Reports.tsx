import {
    FileText,
    TrendingUp,
    Calendar,
    Download,
    Filter,
    BarChart3,
    PieChart,
    Activity,
    Users,
    DollarSign,
    CheckSquare,
    Clock,
    ArrowUp,
    ArrowDown,
    X,
    ChevronDown
} from 'lucide-react';
import { useState } from 'react';
import { Pagination } from './ui/Pagination';
import { BarChart, Bar, LineChart, Line, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ReportTemplate {
    id: string;
    name: string;
    description: string;
    category: 'financial' | 'performance' | 'compliance' | 'operational';
    icon: any;
}

const reportTemplates: ReportTemplate[] = [
    {
        id: 'financial-summary',
        name: 'Financial Summary Report',
        description: 'Overview of revenue, payments, and financial metrics',
        category: 'financial',
        icon: DollarSign
    },
    {
        id: 'locum-performance',
        name: 'Locum Performance Report',
        description: 'Individual locum ratings, shifts completed, and feedback',
        category: 'performance',
        icon: Users
    },
    {
        id: 'compliance-status',
        name: 'Compliance Status Report',
        description: 'Document expiry tracking and compliance rates',
        category: 'compliance',
        icon: CheckSquare
    },
    {
        id: 'shift-fill-rate',
        name: 'Shift Fill Rate Analysis',
        description: 'Shift coverage rates, gaps, and trends',
        category: 'operational',
        icon: Activity
    },
    {
        id: 'facility-usage',
        name: 'Facility Usage Report',
        description: 'Facility-wise locum bookings and spending',
        category: 'operational',
        icon: BarChart3
    },
    {
        id: 'monthly-summary',
        name: 'Monthly Summary Report',
        description: 'Comprehensive monthly performance overview',
        category: 'performance',
        icon: Calendar
    }
];

// Chart Data
const monthlyRevenueData = [
    { month: 'Jan', revenue: 45000, expenses: 32000 },
    { month: 'Feb', revenue: 52000, expenses: 35000 },
    { month: 'Mar', revenue: 48000, expenses: 33000 },
    { month: 'Apr', revenue: 61000, expenses: 38000 },
    { month: 'May', revenue: 55000, expenses: 36000 },
    { month: 'Jun', revenue: 67000, expenses: 42000 },
];

const shiftFillRateData = [
    { month: 'Jun', fillRate: 87 },
    { month: 'Jul', fillRate: 92 },
    { month: 'Aug', fillRate: 85 },
    { month: 'Sep', fillRate: 94 },
    { month: 'Oct', fillRate: 91 },
    { month: 'Nov', fillRate: 89 },
    { month: 'Dec', fillRate: 93 },
];

const specialtyDistributionData = [
    { name: 'General Surgery', value: 28, color: '#10B981' },
    { name: 'Cardiology', value: 22, color: '#3B82F6' },
    { name: 'Anesthesiology', value: 18, color: '#8B5CF6' },
    { name: 'Emergency Medicine', value: 15, color: '#F59E0B' },
    { name: 'Pediatrics', value: 10, color: '#EF4444' },
    { name: 'Orthopedics', value: 7, color: '#6B7280' },
];

const topPerformingLocums = [
    { name: 'Sarah Mitchell', shifts: 52, rating: 4.9, revenue: 65000, change: 12 },
    { name: 'Emily Chen', shifts: 48, rating: 4.8, revenue: 58500, change: 8 },
    { name: 'James Harrison', shifts: 45, rating: 4.7, revenue: 54000, change: -3 },
    { name: 'Michael Brooks', shifts: 42, rating: 4.6, revenue: 51200, change: 15 },
    { name: 'Rachel Martinez', shifts: 38, rating: 4.8, revenue: 47800, change: 5 },
];

export function Reports() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [dateRange, setDateRange] = useState('last-30-days');
    const [showGenerateDialog, setShowGenerateDialog] = useState(false);
    const [selectedReport, setSelectedReport] = useState<ReportTemplate | null>(null);
    const [locumPage, setLocumPage] = useState(1);
    const locumPageSize = 3;

    const filteredTemplates = selectedCategory === 'all'
        ? reportTemplates
        : reportTemplates.filter(t => t.category === selectedCategory);

    const handleGenerateReport = (template: ReportTemplate) => {
        setSelectedReport(template);
        setShowGenerateDialog(true);
    };

    const handleDownloadReport = () => {
        // Simulate report download
        alert('Report downloaded successfully!');
        setShowGenerateDialog(false);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IE', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="p-6">
            {/* Page Title */}
            <div className="mb-6">
                <h2 className="text-[#1F2937] mb-1">Reports & Analytics</h2>
                <p className="text-sm text-[#6B7280]">Generate insights and reports for your operations</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-5 mb-6">
                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-[#D1FAE5] rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-[#10B981]" />
                        </div>
                        <div>
                            <p className="text-xs text-[#6B7280]">Total Revenue</p>
                            <p className="text-2xl font-bold text-[#1F2937]">{formatCurrency(67000)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#10B981]">
                        <ArrowUp className="w-3 h-3" />
                        <span>+18% from last month</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-[#DBEAFE] rounded-lg flex items-center justify-center">
                            <Activity className="w-5 h-5 text-[#3B82F6]" />
                        </div>
                        <div>
                            <p className="text-xs text-[#6B7280]">Shift Fill Rate</p>
                            <p className="text-2xl font-bold text-[#1F2937]">93%</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#10B981]">
                        <ArrowUp className="w-3 h-3" />
                        <span>+4% improvement</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-[#FEF3C7] rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-[#D97706]" />
                        </div>
                        <div>
                            <p className="text-xs text-[#6B7280]">Active Locums</p>
                            <p className="text-2xl font-bold text-[#1F2937]">247</p>
                        </div>
                    </div>
                    <p className="text-xs text-[#6B7280]">892 total registered</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-[#E0E7FF] rounded-lg flex items-center justify-center">
                            <CheckSquare className="w-5 h-5 text-[#6366F1]" />
                        </div>
                        <div>
                            <p className="text-xs text-[#6B7280]">Compliance Rate</p>
                            <p className="text-2xl font-bold text-[#1F2937]">94.8%</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#10B981]">
                        <ArrowUp className="w-3 h-3" />
                        <span>+3% from last month</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-3 gap-5 mb-6">
                {/* Revenue Trends */}
                <div className="col-span-2 bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="text-[#1F2937] mb-1">Revenue & Expenses Trends</h3>
                            <p className="text-xs text-[#6B7280]">Monthly comparison</p>
                        </div>
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                        >
                            <option value="last-30-days">Last 30 Days</option>
                            <option value="last-90-days">Last 90 Days</option>
                            <option value="last-6-months">Last 6 Months</option>
                            <option value="last-year">Last Year</option>
                        </select>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={monthlyRevenueData}>
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
                            <Legend />
                            <Bar dataKey="revenue" fill="#10B981" radius={[8, 8, 0, 0]} name="Revenue" />
                            <Bar dataKey="expenses" fill="#6B7280" radius={[8, 8, 0, 0]} name="Expenses" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Specialty Distribution */}
                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <div className="mb-5">
                        <h3 className="text-[#1F2937] mb-1">Shift by Specialty</h3>
                        <p className="text-xs text-[#6B7280]">Distribution breakdown</p>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <RechartsPie>
                            <Pie
                                data={specialtyDistributionData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {specialtyDistributionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </RechartsPie>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                        {specialtyDistributionData.map((item) => (
                            <div key={item.name} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-[#6B7280]">{item.name}</span>
                                </div>
                                <span className="font-medium text-[#1F2937]">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Shift Fill Rate Chart */}
            <div className="bg-white rounded-xl p-5 border border-[#E5E7EB] mb-6">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h3 className="text-[#1F2937] mb-1">Shift Fill Rate Trend</h3>
                        <p className="text-xs text-[#6B7280]">Monthly shift coverage percentage</p>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={shiftFillRateData}>
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
                            domain={[80, 100]}
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
                            dataKey="fillRate"
                            stroke="#10B981"
                            strokeWidth={3}
                            dot={{ fill: '#10B981', r: 5 }}
                            name="Fill Rate %"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Top Performing Locums */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] mb-6">
                <div className="p-5 border-b border-[#E5E7EB]">
                    <h3 className="text-[#1F2937]">Top Performing Locums</h3>
                    <p className="text-xs text-[#6B7280] mt-1">Based on shifts completed and ratings</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#E5E7EB]">
                                <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Rank</th>
                                <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Locum Name</th>
                                <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Shifts Completed</th>
                                <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Rating</th>
                                <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Revenue Generated</th>
                                <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Change</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topPerformingLocums.slice((locumPage - 1) * locumPageSize, locumPage * locumPageSize).map((locum, sIndex) => {
                                const index = (locumPage - 1) * locumPageSize + sIndex;
                                return (
                                    <tr key={locum.name} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                                        <td className="px-5 py-4">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${index === 0 ? 'bg-[#FEF3C7] text-[#D97706]' :
                                                    index === 1 ? 'bg-[#E5E7EB] text-[#6B7280]' :
                                                        index === 2 ? 'bg-[#FED7AA] text-[#C2410C]' :
                                                            'bg-[#F3F4F6] text-[#9CA3AF]'
                                                }`}>
                                                {index + 1}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="text-sm font-medium text-[#1F2937]">{locum.name}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="text-sm text-[#1F2937]">{locum.shifts}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-1">
                                                <span className="text-sm font-medium text-[#1F2937]">{locum.rating}</span>
                                                <span className="text-sm">⭐</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="text-sm font-semibold text-[#1F2937]">{formatCurrency(locum.revenue)}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className={`flex items-center gap-1 text-xs ${locum.change >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                                                {locum.change >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                                <span>{Math.abs(locum.change)}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <Pagination
                        currentPage={locumPage}
                        totalItems={topPerformingLocums.length}
                        pageSize={locumPageSize}
                        onPageChange={setLocumPage}
                    />
                </div>
            </div>

            {/* Report Templates */}
            <div className="bg-white rounded-xl border border-[#E5E7EB]">
                <div className="p-5 border-b border-[#E5E7EB]">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-[#1F2937]">Report Templates</h3>
                            <p className="text-xs text-[#6B7280] mt-1">Generate custom reports for your needs</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                            >
                                <option value="all">All Categories</option>
                                <option value="financial">Financial</option>
                                <option value="performance">Performance</option>
                                <option value="compliance">Compliance</option>
                                <option value="operational">Operational</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="p-5 grid grid-cols-2 gap-4">
                    {filteredTemplates.map((template) => {
                        const Icon = template.icon;
                        return (
                            <div
                                key={template.id}
                                className="p-4 border border-[#E5E7EB] rounded-xl hover:shadow-md transition-shadow cursor-pointer"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-[#F9FAFB] rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-6 h-6 text-[#10B981]" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-[#1F2937] mb-1">{template.name}</h4>
                                        <p className="text-xs text-[#6B7280] mb-3">{template.description}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-1 bg-[#F3F4F6] text-[#6B7280] rounded text-xs capitalize">
                                                {template.category}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleGenerateReport(template)}
                                        className="px-3 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] text-sm flex items-center gap-2"
                                    >
                                        <FileText className="w-4 h-4" />
                                        Generate
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Generate Report Dialog */}
            {showGenerateDialog && selectedReport && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-[500px]">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-[#1F2937]">Generate Report</h3>
                                <p className="text-sm text-[#6B7280]">{selectedReport.name}</p>
                            </div>
                            <button
                                onClick={() => setShowGenerateDialog(false)}
                                className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#1F2937] mb-2">Date Range</label>
                                <select className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]">
                                    <option>Last 7 Days</option>
                                    <option>Last 30 Days</option>
                                    <option>Last 90 Days</option>
                                    <option>Last 6 Months</option>
                                    <option>Last Year</option>
                                    <option>Custom Range</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1F2937] mb-2">Report Format</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button className="px-4 py-2 border-2 border-[#10B981] bg-[#D1FAE5] text-[#059669] rounded-lg text-sm font-medium">
                                        PDF
                                    </button>
                                    <button className="px-4 py-2 border border-[#E5E7EB] text-[#6B7280] rounded-lg text-sm hover:bg-[#F9FAFB]">
                                        Excel
                                    </button>
                                    <button className="px-4 py-2 border border-[#E5E7EB] text-[#6B7280] rounded-lg text-sm hover:bg-[#F9FAFB]">
                                        CSV
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1F2937] mb-2">Filters (Optional)</label>
                                <div className="space-y-2">
                                    <select className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-sm">
                                        <option>All Facilities</option>
                                        <option>St. James's Hospital, Dublin</option>
                                        <option>Cork University Hospital</option>
                                        <option>University Hospital Galway</option>
                                    </select>
                                    <select className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-sm">
                                        <option>All Specialties</option>
                                        <option>General Surgery</option>
                                        <option>Cardiology</option>
                                        <option>Anesthesiology</option>
                                        <option>Emergency Medicine</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 text-[#10B981] border-[#E5E7EB] rounded" />
                                    <span className="text-sm text-[#6B7280]">Include detailed breakdown</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer mt-2">
                                    <input type="checkbox" className="w-4 h-4 text-[#10B981] border-[#E5E7EB] rounded" defaultChecked />
                                    <span className="text-sm text-[#6B7280]">Include charts and graphs</span>
                                </label>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-2">
                            <button
                                onClick={() => setShowGenerateDialog(false)}
                                className="flex-1 px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg hover:bg-[#F9FAFB]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDownloadReport}
                                className="flex-1 px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] flex items-center justify-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Generate & Download
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
