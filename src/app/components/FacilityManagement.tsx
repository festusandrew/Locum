import { Building2, Search, Filter, Eye, TrendingUp, TrendingDown } from 'lucide-react';

const facilities = [
    {
        id: 1,
        name: 'City General Hospital',
        contact: 'Sarah Mitchell',
        shiftsPosted: 145,
        fillRate: 92,
        billingStatus: 'Current',
        lastActivity: '2 hours ago',
        trend: 'up'
    },
    {
        id: 2,
        name: 'St. Mary\'s Medical Center',
        contact: 'John Davidson',
        shiftsPosted: 128,
        fillRate: 85,
        billingStatus: 'Current',
        lastActivity: '5 hours ago',
        trend: 'up'
    },
    {
        id: 3,
        name: 'Regional Medical Center',
        contact: 'Emily Parker',
        shiftsPosted: 167,
        fillRate: 78,
        billingStatus: 'Overdue',
        lastActivity: '1 day ago',
        trend: 'down'
    },
    {
        id: 4,
        name: 'Parkview Community Hospital',
        contact: 'Michael Brown',
        shiftsPosted: 98,
        fillRate: 88,
        billingStatus: 'Current',
        lastActivity: '3 hours ago',
        trend: 'up'
    },
    {
        id: 5,
        name: 'Memorial Healthcare',
        contact: 'Lisa Anderson',
        shiftsPosted: 134,
        fillRate: 81,
        billingStatus: 'Current',
        lastActivity: '6 hours ago',
        trend: 'down'
    },
    {
        id: 6,
        name: 'Central Care Clinic',
        contact: 'David Wilson',
        shiftsPosted: 87,
        fillRate: 95,
        billingStatus: 'Current',
        lastActivity: '4 hours ago',
        trend: 'up'
    },
];

export function FacilityManagement() {
    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-[#111827] mb-1">Facility Management</h2>
                <p className="text-[#6B7280]">Manage healthcare facilities and track performance</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB]">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-[#1D4ED8]" />
                        </div>
                        <span className="text-[#10B981] flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>+8%</span>
                        </span>
                    </div>
                    <h3 className="text-[#111827] mb-1">89</h3>
                    <p className="text-[#6B7280]">Total Facilities</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB]">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-[#10B981]" />
                        </div>
                    </div>
                    <h3 className="text-[#111827] mb-1">87.3%</h3>
                    <p className="text-[#6B7280]">Average Fill Rate</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB]">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                            <span className="text-[#7C3AED]">£</span>
                        </div>
                    </div>
                    <h3 className="text-[#111827] mb-1">£2.4M</h3>
                    <p className="text-[#6B7280]">Total Revenue</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB]">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                            <span className="text-[#F59E0B]">⚠</span>
                        </div>
                    </div>
                    <h3 className="text-[#111827] mb-1">3</h3>
                    <p className="text-[#6B7280]">Overdue Billing</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center justify-between mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search facilities..."
                        className="w-full pl-12 pr-4 py-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                    />
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-3 border border-[#E5E7EB] rounded-xl hover:bg-[#F9FAFB] transition-colors flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Filter
                    </button>
                </div>
            </div>

            {/* Facilities Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                            <tr>
                                <th className="px-6 py-4 text-left text-[#374151]">Facility Name</th>
                                <th className="px-6 py-4 text-left text-[#374151]">Contact Person</th>
                                <th className="px-6 py-4 text-left text-[#374151]">Shifts Posted</th>
                                <th className="px-6 py-4 text-left text-[#374151]">Fill Rate</th>
                                <th className="px-6 py-4 text-left text-[#374151]">Billing Status</th>
                                <th className="px-6 py-4 text-left text-[#374151]">Last Activity</th>
                                <th className="px-6 py-4 text-left text-[#374151]">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]">
                            {facilities.map((facility) => (
                                <tr key={facility.id} className="hover:bg-[#F9FAFB] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                                <Building2 className="w-5 h-5 text-[#1D4ED8]" />
                                            </div>
                                            <span className="text-[#111827]">{facility.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-[#6B7280]">{facility.contact}</td>
                                    <td className="px-6 py-4 text-[#111827]">{facility.shiftsPosted}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`${facility.fillRate >= 90 ? 'text-[#10B981]' :
                                                    facility.fillRate >= 80 ? 'text-[#F59E0B]' :
                                                        'text-[#DC2626]'
                                                }`}>
                                                {facility.fillRate}%
                                            </span>
                                            {facility.trend === 'up' ? (
                                                <TrendingUp className="w-4 h-4 text-[#10B981]" />
                                            ) : (
                                                <TrendingDown className="w-4 h-4 text-[#DC2626]" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-lg ${facility.billingStatus === 'Current'
                                                ? 'bg-green-50 text-green-700'
                                                : 'bg-red-50 text-red-700'
                                            }`}>
                                            {facility.billingStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-[#6B7280]">{facility.lastActivity}</td>
                                    <td className="px-6 py-4">
                                        <button className="px-4 py-2 bg-[#1D4ED8] text-white rounded-lg hover:bg-[#1E40AF] transition-colors flex items-center gap-2">
                                            <Eye className="w-4 h-4" />
                                            View
                                        </button>
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
