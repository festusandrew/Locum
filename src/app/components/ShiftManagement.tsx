import { Calendar, Clock, DollarSign, Users, AlertCircle, Search, Filter, Plus } from 'lucide-react';

const shifts = [
    {
        id: 1,
        facility: 'City General Hospital',
        role: 'General Practitioner',
        date: 'Dec 10, 2024',
        time: '08:00 - 16:00',
        hours: 8,
        rate: '£65/hr',
        applicants: 12,
        status: 'open',
        urgent: false
    },
    {
        id: 2,
        facility: 'St. Mary\'s Medical Center',
        role: 'Anesthesiologist',
        date: 'Dec 12, 2024',
        time: '18:00 - 06:00',
        hours: 12,
        rate: '£95/hr',
        applicants: 5,
        status: 'urgent',
        urgent: true
    },
    {
        id: 3,
        facility: 'Regional Medical Center',
        role: 'Pediatrician',
        date: 'Dec 15, 2024',
        time: '09:00 - 17:00',
        hours: 8,
        rate: '£72/hr',
        applicants: 8,
        status: 'open',
        urgent: false
    },
    {
        id: 4,
        facility: 'Parkview Community Hospital',
        role: 'Surgeon',
        date: 'Dec 11, 2024',
        time: '07:00 - 19:00',
        hours: 12,
        rate: '£110/hr',
        applicants: 18,
        status: 'filled',
        urgent: false
    },
    {
        id: 5,
        facility: 'Memorial Healthcare',
        role: 'Cardiologist',
        date: 'Dec 14, 2024',
        time: '08:00 - 18:00',
        hours: 10,
        rate: '£88/hr',
        applicants: 3,
        status: 'urgent',
        urgent: true
    },
    {
        id: 6,
        facility: 'Central Care Clinic',
        role: 'General Practitioner',
        date: 'Dec 13, 2024',
        time: '12:00 - 20:00',
        hours: 8,
        rate: '£68/hr',
        applicants: 15,
        status: 'filled',
        urgent: false
    },
];

export function ShiftManagement() {
    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-[#111827] mb-1">Shift Management</h2>
                    <p className="text-[#6B7280]">Create and manage shifts across all facilities</p>
                </div>
                <button className="px-6 py-3 bg-[#1D4ED8] text-white rounded-xl hover:bg-[#1E40AF] transition-colors flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create Shift
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB] mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                        <label className="block text-[#374151] mb-2">Date Range</label>
                        <input
                            type="date"
                            className="w-full px-4 py-2 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                        />
                    </div>
                    <div>
                        <label className="block text-[#374151] mb-2">Role</label>
                        <select className="w-full px-4 py-2 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]">
                            <option>All Roles</option>
                            <option>General Practitioner</option>
                            <option>Anesthesiologist</option>
                            <option>Surgeon</option>
                            <option>Pediatrician</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[#374151] mb-2">Facility</label>
                        <select className="w-full px-4 py-2 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]">
                            <option>All Facilities</option>
                            <option>City General Hospital</option>
                            <option>St. Mary&apos;s Medical Center</option>
                            <option>Regional Medical Center</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[#374151] mb-2">Urgency</label>
                        <select className="w-full px-4 py-2 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]">
                            <option>All</option>
                            <option>Urgent</option>
                            <option>Normal</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[#374151] mb-2">Status</label>
                        <select className="w-full px-4 py-2 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]">
                            <option>All Statuses</option>
                            <option>Open</option>
                            <option>Filled</option>
                            <option>Urgent</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="flex items-center justify-between mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search shifts..."
                        className="w-full pl-12 pr-4 py-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                    />
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-3 border border-[#E5E7EB] rounded-xl hover:bg-[#F9FAFB] transition-colors flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        More Filters
                    </button>
                    <button className="px-4 py-3 border border-[#E5E7EB] rounded-xl hover:bg-[#F9FAFB] transition-colors flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Calendar View
                    </button>
                </div>
            </div>

            {/* Shift Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shifts.map((shift) => (
                    <div
                        key={shift.id}
                        className={`bg-white rounded-2xl p-6 shadow-sm border transition-all hover:shadow-md ${shift.urgent ? 'border-[#DC2626]' : 'border-[#E5E7EB]'
                            }`}
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h4 className="text-[#111827] mb-1">{shift.facility}</h4>
                                <p className="text-[#6B7280]">{shift.role}</p>
                            </div>
                            {shift.urgent && (
                                <span className="px-3 py-1 bg-red-50 text-[#DC2626] rounded-lg flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    Urgent
                                </span>
                            )}
                            {shift.status === 'filled' && (
                                <span className="px-3 py-1 bg-green-50 text-[#10B981] rounded-lg">
                                    Filled
                                </span>
                            )}
                            {shift.status === 'open' && !shift.urgent && (
                                <span className="px-3 py-1 bg-blue-50 text-[#1D4ED8] rounded-lg">
                                    Open
                                </span>
                            )}
                        </div>

                        {/* Details */}
                        <div className="space-y-3 mb-4">
                            <div className="flex items-center gap-2 text-[#6B7280]">
                                <Calendar className="w-4 h-4" />
                                <span>{shift.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#6B7280]">
                                <Clock className="w-4 h-4" />
                                <span>{shift.time} ({shift.hours}h)</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#6B7280]">
                                <DollarSign className="w-4 h-4" />
                                <span>{shift.rate}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#6B7280]">
                                <Users className="w-4 h-4" />
                                <span>{shift.applicants} applicants</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <button className="flex-1 px-4 py-2 bg-[#1D4ED8] text-white rounded-lg hover:bg-[#1E40AF] transition-colors">
                                View Details
                            </button>
                            {shift.status !== 'filled' && (
                                <button className="px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors">
                                    Edit
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
