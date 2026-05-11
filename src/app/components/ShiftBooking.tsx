import { useState } from 'react';
import {
    Calendar, Clock, Plus, Search, MapPin, Users, AlertTriangle,
    CheckCircle, XCircle, X, ChevronLeft, ChevronRight, Download,
    MoreVertical, Building2, DollarSign, Filter, RefreshCw, Edit2,
    Trash2, UserPlus, Eye, Ban
} from 'lucide-react';

interface Shift {
    id: string;
    facility: string;
    location: string;
    specialty: string;
    date: string;
    time: string;
    hours: number;
    rate: number;
    status: 'open' | 'filled' | 'cancelled' | 'urgent' | 'recurring';
    locum: string | null;
    requiredCompliance: string[];
}

const shifts: Shift[] = [
    { id: 'SH-001', facility: "St. James's Hospital", location: 'Dublin', specialty: 'General Surgery', date: '2026-02-10', time: '08:00 - 16:00', hours: 8, rate: 55, status: 'filled', locum: 'Sarah Mitchell', requiredCompliance: ['Medical License', 'Garda Vetting'] },
    { id: 'SH-002', facility: 'Cork University Hospital', location: 'Cork', specialty: 'Cardiology', date: '2026-02-10', time: '09:00 - 21:00', hours: 12, rate: 60, status: 'filled', locum: 'James Harrison', requiredCompliance: ['Medical License', 'Indemnity Insurance'] },
    { id: 'SH-003', facility: 'Beaumont Hospital', location: 'Dublin', specialty: 'Emergency Medicine', date: '2026-02-10', time: '20:00 - 08:00', hours: 12, rate: 65, status: 'urgent', locum: null, requiredCompliance: ['Medical License', 'Garda Vetting', 'CPR Training'] },
    { id: 'SH-004', facility: 'University Hospital Galway', location: 'Galway', specialty: 'Anesthesiology', date: '2026-02-11', time: '07:00 - 19:00', hours: 12, rate: 58, status: 'open', locum: null, requiredCompliance: ['Medical License', 'Indemnity Insurance'] },
    { id: 'SH-005', facility: 'Mater Hospital', location: 'Dublin', specialty: 'Pediatrics', date: '2026-02-11', time: '08:00 - 20:00', hours: 12, rate: 55, status: 'open', locum: null, requiredCompliance: ['Medical License', 'Garda Vetting'] },
    { id: 'SH-006', facility: "St. James's Hospital", location: 'Dublin', specialty: 'General Surgery', date: '2026-02-12', time: '08:00 - 16:00', hours: 8, rate: 55, status: 'recurring', locum: 'Sarah Mitchell', requiredCompliance: ['Medical License', 'Garda Vetting'] },
    { id: 'SH-007', facility: 'Limerick University Hospital', location: 'Limerick', specialty: 'Orthopedics', date: '2026-02-09', time: '09:00 - 17:00', hours: 8, rate: 52, status: 'cancelled', locum: null, requiredCompliance: ['Medical License'] },
    { id: 'SH-008', facility: 'Waterford University Hospital', location: 'Waterford', specialty: 'Emergency Medicine', date: '2026-02-12', time: '20:00 - 08:00', hours: 12, rate: 65, status: 'urgent', locum: null, requiredCompliance: ['Medical License', 'CPR Training'] },
    { id: 'SH-009', facility: 'Galway Clinic', location: 'Galway', specialty: 'General Surgery', date: '2026-02-13', time: '08:00 - 16:00', hours: 8, rate: 58, status: 'open', locum: null, requiredCompliance: ['Medical License', 'Indemnity Insurance'] },
    { id: 'SH-010', facility: 'Beacon Hospital', location: 'Dublin', specialty: 'Cardiology', date: '2026-02-13', time: '09:00 - 17:00', hours: 8, rate: 60, status: 'filled', locum: 'Emily Chen', requiredCompliance: ['Medical License'] },
];

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
    open: { label: 'Open', color: '#3B82F6', bg: '#DBEAFE', border: '#BFDBFE' },
    filled: { label: 'Filled', color: '#059669', bg: '#D1FAE5', border: '#A7F3D0' },
    cancelled: { label: 'Cancelled', color: '#6B7280', bg: '#F3F4F6', border: '#E5E7EB' },
    urgent: { label: 'Urgent', color: '#DC2626', bg: '#FEE2E2', border: '#FECACA' },
    recurring: { label: 'Recurring', color: '#7C3AED', bg: '#EDE9FE', border: '#DDD6FE' },
};

export function ShiftBooking({ subPage = 'board', onViewShiftDetail }: { subPage?: string; onViewShiftDetail?: (id: string) => void }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showCreateShift, setShowCreateShift] = useState(false);
    const [viewMode, setViewMode] = useState<'board' | 'calendar'>(subPage === 'calendar' ? 'calendar' : 'board');
    const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
    const [cancelReason, setCancelReason] = useState('');
    const [formData, setFormData] = useState({
        facility: '',
        specialty: '',
        date: '',
        startTime: '',
        endTime: '',
        rate: '',
        shiftType: 'one-time' as 'one-time' | 'recurring' | 'urgent',
        department: '',
        grade: '',
        description: '',
        compliance: [] as string[],
    });

    const filteredShifts = shifts.filter(s => {
        const matchesSearch = s.facility.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.locum || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const statusCounts = {
        open: shifts.filter(s => s.status === 'open').length,
        filled: shifts.filter(s => s.status === 'filled').length,
        urgent: shifts.filter(s => s.status === 'urgent').length,
        cancelled: shifts.filter(s => s.status === 'cancelled').length,
        recurring: shifts.filter(s => s.status === 'recurring').length,
    };

    const handleExport = () => {
        const csv = [
            ['ID', 'Facility', 'Location', 'Specialty', 'Date', 'Time', 'Hours', 'Rate/hr', 'Status', 'Locum'],
            ...shifts.map(s => [s.id, s.facility, s.location, s.specialty, s.date, s.time, s.hours, `€${s.rate}`, s.status, s.locum || 'Unassigned'])
        ].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'shifts-export.csv';
        a.click();
    };

    // Calendar view helpers
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const calendarDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(2026, 1, 9 + i);
        return { date: d, dateStr: d.toISOString().split('T')[0], dayName: daysOfWeek[i] };
    });

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-[#1F2937] mb-1">Shift & Booking Management</h2>
                    <p className="text-sm text-[#6B7280]">Manage shifts, bookings, and scheduling</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center border border-[#E5E7EB] rounded-lg overflow-hidden">
                        <button onClick={() => setViewMode('board')} className={`px-3 py-2 text-sm ${viewMode === 'board' ? 'bg-[#10B981] text-white' : 'bg-white text-[#6B7280]'}`}>Board</button>
                        <button onClick={() => setViewMode('calendar')} className={`px-3 py-2 text-sm ${viewMode === 'calendar' ? 'bg-[#10B981] text-white' : 'bg-white text-[#6B7280]'}`}>Calendar</button>
                    </div>
                </div>
            </div>

            {/* Status Summary */}
            <div className="grid grid-cols-5 gap-4 mb-6">
                {Object.entries(statusCounts).map(([status, count]) => {
                    const config = statusConfig[status];
                    return (
                        <div key={status} className="bg-white rounded-xl p-4 border border-[#E5E7EB] cursor-pointer hover:shadow-sm transition-shadow"
                            onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}>
                            <div className="flex items-center justify-between mb-2">
                                <span className={`px-2 py-0.5 rounded text-xs border`} style={{ backgroundColor: config.bg, color: config.color, borderColor: config.border }}>{config.label}</span>
                                {statusFilter === status && <CheckCircle className="w-4 h-4 text-[#10B981]" />}
                            </div>
                            <p className="text-2xl text-[#1F2937]" style={{ fontWeight: 700 }}>{count}</p>
                            <p className="text-xs text-[#6B7280] mt-0.5">shifts</p>
                        </div>
                    );
                })}
            </div>

            {viewMode === 'board' && (
                <div className="bg-white rounded-xl border border-[#E5E7EB]">
                    <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
                        <h3 className="text-[#1F2937]">All Shifts</h3>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                                <input type="text" placeholder="Search shifts..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-4 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]" />
                            </div>
                            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                                className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg">
                                <option value="all">All Status</option>
                                <option value="open">Open</option>
                                <option value="filled">Filled</option>
                                <option value="urgent">Urgent</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="recurring">Recurring</option>
                            </select>
                            <button onClick={handleExport} className="flex items-center gap-2 px-3 py-2 text-sm text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]">
                                <Download className="w-4 h-4" />Export
                            </button>
                            <button onClick={() => setShowCreateShift(true)} className="flex items-center gap-2 px-4 py-2 text-sm bg-[#10B981] text-white rounded-lg hover:bg-[#059669]">
                                <Plus className="w-4 h-4" />Create Shift
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                                    <th className="px-4 py-3 text-left text-xs text-[#6B7280]" style={{ fontWeight: 500 }}>Shift</th>
                                    <th className="px-4 py-3 text-left text-xs text-[#6B7280]" style={{ fontWeight: 500 }}>Facility</th>
                                    <th className="px-4 py-3 text-left text-xs text-[#6B7280]" style={{ fontWeight: 500 }}>Date & Time</th>
                                    <th className="px-4 py-3 text-left text-xs text-[#6B7280]" style={{ fontWeight: 500 }}>Specialty</th>
                                    <th className="px-4 py-3 text-left text-xs text-[#6B7280]" style={{ fontWeight: 500 }}>Rate</th>
                                    <th className="px-4 py-3 text-left text-xs text-[#6B7280]" style={{ fontWeight: 500 }}>Locum</th>
                                    <th className="px-4 py-3 text-left text-xs text-[#6B7280]" style={{ fontWeight: 500 }}>Status</th>
                                    <th className="px-4 py-3 text-left text-xs text-[#6B7280]" style={{ fontWeight: 500 }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredShifts.map(shift => {
                                    const config = statusConfig[shift.status];
                                    return (
                                        <tr key={shift.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                                            <td className="px-4 py-3">
                                                <p className="text-sm text-[#1F2937]" style={{ fontWeight: 500 }}>{shift.id}</p>
                                                <p className="text-xs text-[#6B7280]">{shift.hours}h</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-sm text-[#1F2937]">{shift.facility}</p>
                                                <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#9CA3AF]" /><span className="text-xs text-[#6B7280]">{shift.location}</span></div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-sm text-[#1F2937]">{shift.date}</p>
                                                <p className="text-xs text-[#6B7280]">{shift.time}</p>
                                            </td>
                                            <td className="px-4 py-3"><span className="text-sm text-[#1F2937]">{shift.specialty}</span></td>
                                            <td className="px-4 py-3"><span className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>€{shift.rate}/hr</span></td>
                                            <td className="px-4 py-3">
                                                {shift.locum ? (
                                                    <span className="text-sm text-[#1F2937]">{shift.locum}</span>
                                                ) : (
                                                    <span className="text-sm text-[#D97706]" style={{ fontStyle: 'italic' }}>Unassigned</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="px-2 py-1 rounded text-xs border" style={{ backgroundColor: config.bg, color: config.color, borderColor: config.border }}>{config.label}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setOpenActionMenu(openActionMenu === shift.id ? null : shift.id)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]"
                                                    >
                                                        <MoreVertical className="w-4 h-4" />
                                                        Actions
                                                    </button>
                                                    {openActionMenu === shift.id && (
                                                        <>
                                                            <div
                                                                className="fixed inset-0 z-10"
                                                                onClick={() => setOpenActionMenu(null)}
                                                            />
                                                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-[#E5E7EB] py-1 z-20">
                                                                {(shift.status === 'open' || shift.status === 'urgent') && (
                                                                    <button
                                                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#1F2937] hover:bg-[#F9FAFB] transition-colors text-left"
                                                                        onClick={() => { setSelectedShift(shift); setShowAssignModal(true); setOpenActionMenu(null); }}
                                                                    >
                                                                        <UserPlus className="w-4 h-4 text-[#10B981]" />
                                                                        Assign Locum
                                                                    </button>
                                                                )}
                                                                <button
                                                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#1F2937] hover:bg-[#F9FAFB] transition-colors text-left"
                                                                    onClick={() => { onViewShiftDetail?.(shift.id); setOpenActionMenu(null); }}
                                                                >
                                                                    <Eye className="w-4 h-4 text-[#3B82F6]" />
                                                                    View Details
                                                                </button>
                                                                {shift.status !== 'cancelled' && (
                                                                    <button
                                                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#1F2937] hover:bg-[#F9FAFB] transition-colors text-left"
                                                                        onClick={() => { setSelectedShift(shift); setOpenActionMenu(null); }}
                                                                    >
                                                                        <Edit2 className="w-4 h-4 text-[#F59E0B]" />
                                                                        Edit Shift
                                                                    </button>
                                                                )}
                                                                {shift.status !== 'cancelled' && (
                                                                    <>
                                                                        <div className="border-t border-[#E5E7EB] my-1" />
                                                                        <button
                                                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#DC2626] hover:bg-[#FEE2E2] transition-colors text-left"
                                                                            onClick={() => { setSelectedShift(shift); setShowCancelModal(true); setOpenActionMenu(null); }}
                                                                        >
                                                                            <Ban className="w-4 h-4" />
                                                                            Cancel Shift
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {viewMode === 'calendar' && (
                <div className="bg-white rounded-xl border border-[#E5E7EB]">
                    <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button className="p-1 hover:bg-[#F3F4F6] rounded"><ChevronLeft className="w-5 h-5 text-[#6B7280]" /></button>
                            <h3 className="text-[#1F2937]">Week of 9 - 15 Feb 2026</h3>
                            <button className="p-1 hover:bg-[#F3F4F6] rounded"><ChevronRight className="w-5 h-5 text-[#6B7280]" /></button>
                        </div>
                        <button onClick={() => setShowCreateShift(true)} className="flex items-center gap-2 px-4 py-2 text-sm bg-[#10B981] text-white rounded-lg hover:bg-[#059669]">
                            <Plus className="w-4 h-4" />Create Shift
                        </button>
                    </div>
                    <div className="grid grid-cols-7 border-b border-[#E5E7EB]">
                        {calendarDays.map(day => (
                            <div key={day.dateStr} className="p-3 border-r border-[#E5E7EB] last:border-r-0 text-center">
                                <p className="text-xs text-[#6B7280]">{day.dayName}</p>
                                <p className="text-lg text-[#1F2937]" style={{ fontWeight: 600 }}>{day.date.getDate()}</p>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 min-h-[400px]">
                        {calendarDays.map(day => {
                            const dayShifts = shifts.filter(s => s.date === day.dateStr);
                            return (
                                <div key={day.dateStr} className="border-r border-[#E5E7EB] last:border-r-0 p-2 space-y-1.5">
                                    {dayShifts.map(shift => {
                                        const config = statusConfig[shift.status];
                                        return (
                                            <div key={shift.id} className="p-2 rounded-lg border cursor-pointer hover:shadow-sm transition-shadow"
                                                style={{ backgroundColor: config.bg, borderColor: config.border }}>
                                                <p className="text-[11px]" style={{ fontWeight: 600, color: config.color }}>{shift.specialty}</p>
                                                <p className="text-[10px] text-[#6B7280] truncate">{shift.facility}</p>
                                                <p className="text-[10px] text-[#9CA3AF]">{shift.time}</p>
                                                {shift.locum && <p className="text-[10px] text-[#1F2937] mt-0.5 truncate">{shift.locum}</p>}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Create Shift Modal */}
            {showCreateShift && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-[550px] max-h-[80vh] overflow-y-auto">
                        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
                            <h3 className="text-[#1F2937]">Create New Shift</h3>
                            <button onClick={() => setShowCreateShift(false)} className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm text-[#1F2937] mb-1" style={{ fontWeight: 500 }}>Facility</label>
                                <select className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]">
                                    <option>Select facility...</option>
                                    <option>St. James's Hospital, Dublin</option>
                                    <option>Cork University Hospital</option>
                                    <option>University Hospital Galway</option>
                                    <option>Beaumont Hospital, Dublin</option>
                                    <option>Mater Hospital, Dublin</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-[#1F2937] mb-1" style={{ fontWeight: 500 }}>Specialty Requirement</label>
                                <select className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]">
                                    <option>Select specialty...</option>
                                    <option>General Surgery</option>
                                    <option>Cardiology</option>
                                    <option>Emergency Medicine</option>
                                    <option>Anesthesiology</option>
                                    <option>Pediatrics</option>
                                    <option>Orthopedics</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-[#1F2937] mb-1" style={{ fontWeight: 500 }}>Date</label>
                                    <input type="date" className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]" />
                                </div>
                                <div>
                                    <label className="block text-sm text-[#1F2937] mb-1" style={{ fontWeight: 500 }}>Pay Rate (€/hr)</label>
                                    <input type="number" placeholder="55" className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-[#1F2937] mb-1" style={{ fontWeight: 500 }}>Start Time</label>
                                    <input type="time" className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]" />
                                </div>
                                <div>
                                    <label className="block text-sm text-[#1F2937] mb-1" style={{ fontWeight: 500 }}>End Time</label>
                                    <input type="time" className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-[#1F2937] mb-1" style={{ fontWeight: 500 }}>Shift Type</label>
                                <div className="flex gap-3">
                                    {['One-time', 'Recurring', 'Urgent'].map(type => (
                                        <label key={type} className="flex items-center gap-2 px-3 py-2 border border-[#E5E7EB] rounded-lg cursor-pointer hover:bg-[#F9FAFB]">
                                            <input type="radio" name="shiftType" className="accent-[#10B981]" />
                                            <span className="text-sm text-[#6B7280]">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="p-5 border-t border-[#E5E7EB] flex justify-end gap-2">
                            <button onClick={() => setShowCreateShift(false)} className="px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg text-sm hover:bg-[#F9FAFB]">Cancel</button>
                            <button className="px-4 py-2 bg-[#10B981] text-white rounded-lg text-sm hover:bg-[#059669]">Create Shift</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Shift Modal */}
            {showAssignModal && selectedShift && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-[550px] max-h-[80vh] overflow-y-auto">
                        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
                            <h3 className="text-[#1F2937]">Assign Shift: {selectedShift.id}</h3>
                            <button onClick={() => setShowAssignModal(false)} className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm text-[#1F2937] mb-1" style={{ fontWeight: 500 }}>Facility</label>
                                <p className="text-sm text-[#1F2937]">{selectedShift.facility}</p>
                            </div>
                            <div>
                                <label className="block text-sm text-[#1F2937] mb-1" style={{ fontWeight: 500 }}>Specialty Requirement</label>
                                <p className="text-sm text-[#1F2937]">{selectedShift.specialty}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-[#1F2937] mb-1" style={{ fontWeight: 500 }}>Date</label>
                                    <p className="text-sm text-[#1F2937]">{selectedShift.date}</p>
                                </div>
                                <div>
                                    <label className="block text-sm text-[#1F2937] mb-1" style={{ fontWeight: 500 }}>Pay Rate (€/hr)</label>
                                    <p className="text-sm text-[#1F2937]">€{selectedShift.rate}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-[#1F2937] mb-1" style={{ fontWeight: 500 }}>Start Time</label>
                                    <p className="text-sm text-[#1F2937]">{selectedShift.time.split(' - ')[0]}</p>
                                </div>
                                <div>
                                    <label className="block text-sm text-[#1F2937] mb-1" style={{ fontWeight: 500 }}>End Time</label>
                                    <p className="text-sm text-[#1F2937]">{selectedShift.time.split(' - ')[1]}</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-[#1F2937] mb-1" style={{ fontWeight: 500 }}>Shift Type</label>
                                <p className="text-sm text-[#1F2937]">{selectedShift.status}</p>
                            </div>
                            <div>
                                <label className="block text-sm text-[#1F2937] mb-1" style={{ fontWeight: 500 }}>Locum</label>
                                <select className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]">
                                    <option>Select locum...</option>
                                    <option>Sarah Mitchell</option>
                                    <option>James Harrison</option>
                                    <option>Emily Chen</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-5 border-t border-[#E5E7EB] flex justify-end gap-2">
                            <button onClick={() => setShowAssignModal(false)} className="px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg text-sm hover:bg-[#F9FAFB]">Cancel</button>
                            <button className="px-4 py-2 bg-[#10B981] text-white rounded-lg text-sm hover:bg-[#059669]">Assign Shift</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Shift Modal */}
            {showCancelModal && selectedShift && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-[550px] max-h-[80vh] overflow-y-auto">
                        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
                            <h3 className="text-[#1F2937]">Cancel Shift: {selectedShift.id}</h3>
                            <button onClick={() => setShowCancelModal(false)} className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm text-[#1F2937] mb-1" style={{ fontWeight: 500 }}>Facility</label>
                                <p className="text-sm text-[#1F2937]">{selectedShift.facility}</p>
                            </div>
                            <div>
                                <label className="block text-sm text-[#1F2937] mb-1" style={{ fontWeight: 500 }}>Specialty Requirement</label>
                                <p className="text-sm text-[#1F2937]">{selectedShift.specialty}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-[#1F2937] mb-1" style={{ fontWeight: 500 }}>Date</label>
                                    <p className="text-sm text-[#1F2937]">{selectedShift.date}</p>
                                </div>
                                <div>
                                    <label className="block text-sm text-[#1F2937] mb-1" style={{ fontWeight: 500 }}>Pay Rate (€/hr)</label>
                                    <p className="text-sm text-[#1F2937]">€{selectedShift.rate}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-[#1F2937] mb-1" style={{ fontWeight: 500 }}>Start Time</label>
                                    <p className="text-sm text-[#1F2937]">{selectedShift.time.split(' - ')[0]}</p>
                                </div>
                                <div>
                                    <label className="block text-sm text-[#1F2937] mb-1" style={{ fontWeight: 500 }}>End Time</label>
                                    <p className="text-sm text-[#1F2937]">{selectedShift.time.split(' - ')[1]}</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-[#1F2937] mb-1" style={{ fontWeight: 500 }}>Shift Type</label>
                                <p className="text-sm text-[#1F2937]">{selectedShift.status}</p>
                            </div>
                            <div>
                                <label className="block text-sm text-[#1F2937] mb-1" style={{ fontWeight: 500 }}>Reason for Cancellation</label>
                                <textarea value={cancelReason} onChange={e => setCancelReason(e.target.value)}
                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]" />
                            </div>
                        </div>
                        <div className="p-5 border-t border-[#E5E7EB] flex justify-end gap-2">
                            <button onClick={() => setShowCancelModal(false)} className="px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg text-sm hover:bg-[#F9FAFB]">Cancel</button>
                            <button className="px-4 py-2 bg-[#DC2626] text-white rounded-lg text-sm hover:bg-[#B91C1C]">Cancel Shift</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}