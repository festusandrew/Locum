import { useState, useEffect } from 'react';
import {
    Calendar, Clock, Plus, Search, MapPin, CheckCircle, XCircle, X, ChevronLeft, ChevronRight, Download,
    MoreVertical, Building2, Edit2, UserPlus, Eye, Ban, RefreshCw
} from 'lucide-react';
import { Shift } from '../types';
import { shiftService } from '../services/shiftService';
import { toast } from 'sonner';

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
    open: { label: 'Open', color: '#3B82F6', bg: '#DBEAFE', border: '#BFDBFE' },
    filled: { label: 'Filled', color: '#059669', bg: '#D1FAE5', border: '#A7F3D0' },
    cancelled: { label: 'Cancelled', color: '#6B7280', bg: '#F3F4F6', border: '#E5E7EB' },
    urgent: { label: 'Urgent', color: '#DC2626', bg: '#FEE2E2', border: '#FECACA' },
    recurring: { label: 'Recurring', color: '#7C3AED', bg: '#EDE9FE', border: '#DDD6FE' },
};

const specialtiesList = ['General Surgery', 'Cardiology', 'Emergency Medicine', 'Anesthesiology', 'Pediatrics', 'Orthopedics'];
const departmentsList = ['Surgery', 'Cardiology', 'Emergency (A&E)', 'Pediatrics', 'Outpatients', 'Internal Medicine'];

export function ShiftBooking({ subPage = 'board', onViewShiftDetail }: { subPage?: string; onViewShiftDetail?: (id: string) => void }) {
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [specialtyFilter, setSpecialtyFilter] = useState('all');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [showCreateShift, setShowCreateShift] = useState(false);
    const [viewMode, setViewMode] = useState<'board' | 'calendar'>(subPage === 'calendar' ? 'calendar' : 'board');
    const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
    
    // Actions modals & inputs
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
    const [assignLocumName, setAssignLocumName] = useState('');
    const [cancelReason, setCancelReason] = useState('');
    
    const [formData, setFormData] = useState({
        facility: '',
        specialty: '',
        department: '',
        date: '',
        startTime: '08:00',
        endTime: '16:00',
        rate: '',
        shiftType: 'open' as 'open' | 'recurring' | 'urgent',
        compliance: [] as string[],
    });

    // Calendar view states
    const [calendarSubView, setCalendarSubView] = useState<'month' | 'week' | 'day'>('week');
    const [calendarAnchorDate, setCalendarAnchorDate] = useState<Date>(new Date(2026, 1, 9)); // Mon 9 Feb 2026

    // Fetch shifts on mount
    useEffect(() => {
        const fetchShifts = async () => {
            setLoading(true);
            try {
                const data = await shiftService.getAll();
                setShifts(data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load shifts");
            } finally {
                setLoading(false);
            }
        };
        fetchShifts();
    }, []);

    const filteredShifts = shifts.filter(s => {
        const matchesSearch = s.facility.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.locum || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
        const matchesSpecialty = specialtyFilter === 'all' || s.specialty === specialtyFilter;
        const matchesDepartment = departmentFilter === 'all' || s.department === departmentFilter;
        return matchesSearch && matchesStatus && matchesSpecialty && matchesDepartment;
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

    // Create new shift submit handler
    const handleCreateShiftSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.facility || !formData.specialty || !formData.date || !formData.rate) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const calculatedHours = 8; // dummy calculation
        const newShift: Shift = {
            id: `SH-${Math.floor(100 + Math.random() * 900)}`,
            facility: formData.facility,
            location: formData.facility.includes('Cork') ? 'Cork' : formData.facility.includes('Galway') ? 'Galway' : 'Dublin',
            specialty: formData.specialty,
            department: formData.department || undefined,
            date: formData.date,
            time: `${formData.startTime} - ${formData.endTime}`,
            hours: calculatedHours,
            rate: parseFloat(formData.rate) || 55,
            status: formData.shiftType,
            locum: null,
            requiredCompliance: ['Medical License']
        };

        try {
            await shiftService.create(newShift);
            const data = await shiftService.getAll();
            setShifts(data);
            setShowCreateShift(false);
            setFormData({
                facility: '',
                specialty: '',
                department: '',
                date: '',
                startTime: '08:00',
                endTime: '16:00',
                rate: '',
                shiftType: 'open',
                compliance: [],
            });
            toast.success("Shift created successfully!");
        } catch (error) {
            toast.error("Failed to create shift");
        }
    };

    // Assign Locum submit handler
    const handleAssignLocumSubmit = async () => {
        if (!selectedShift || !assignLocumName) {
            toast.error("Please select a locum.");
            return;
        }
        try {
            await shiftService.assignLocum(selectedShift.id, assignLocumName);
            const data = await shiftService.getAll();
            setShifts(data);
            setShowAssignModal(false);
            setAssignLocumName('');
            toast.success(`Locum assigned to shift ${selectedShift.id}`);
        } catch (error) {
            toast.error("Failed to assign locum");
        }
    };

    // Cancel Shift submit handler
    const handleCancelShiftSubmit = async () => {
        if (!selectedShift) return;
        try {
            await shiftService.cancel(selectedShift.id, cancelReason);
            const data = await shiftService.getAll();
            setShifts(data);
            setShowCancelModal(false);
            setCancelReason('');
            toast.success(`Shift ${selectedShift.id} cancelled successfully.`);
        } catch (error) {
            toast.error("Failed to cancel shift");
        }
    };

    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Helper to find Monday of a given date's week (Monday-start)
    const getMonday = (src: Date) => {
        const d = new Date(src);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    };

    // Week view days: 7 days starting from Monday of that week
    const getWeekDays = () => {
        const monday = getMonday(calendarAnchorDate);
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
            return {
                date: d,
                dateStr: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
                dayName: daysOfWeek[i]
            };
        });
    };

    // Month view days: first day to last day of that month
    const getMonthDays = () => {
        const year = calendarAnchorDate.getFullYear();
        const month = calendarAnchorDate.getMonth();
        const firstDayIndex = new Date(year, month, 1).getDay(); // Sun = 0, Mon = 1, etc.
        const prefixEmptyCount = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
        const totalDays = new Date(year, month + 1, 0).getDate();
        
        const list = [];
        for (let i = 0; i < prefixEmptyCount; i++) {
            list.push({ isEmpty: true, key: `empty-${i}`, dateStr: '' });
        }
        for (let day = 1; day <= totalDays; day++) {
            const d = new Date(year, month, day);
            list.push({
                isEmpty: false,
                key: `day-${day}`,
                date: d,
                dateStr: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
                dayNum: day
            });
        }
        return list;
    };

    const handlePrevCalendar = () => {
        if (calendarSubView === 'month') {
            setCalendarAnchorDate(new Date(calendarAnchorDate.getFullYear(), calendarAnchorDate.getMonth() - 1, 1));
        } else if (calendarSubView === 'week') {
            const prev = new Date(calendarAnchorDate);
            prev.setDate(prev.getDate() - 7);
            setCalendarAnchorDate(prev);
        } else {
            const prev = new Date(calendarAnchorDate);
            prev.setDate(prev.getDate() - 1);
            setCalendarAnchorDate(prev);
        }
    };

    const handleNextCalendar = () => {
        if (calendarSubView === 'month') {
            setCalendarAnchorDate(new Date(calendarAnchorDate.getFullYear(), calendarAnchorDate.getMonth() + 1, 1));
        } else if (calendarSubView === 'week') {
            const next = new Date(calendarAnchorDate);
            next.setDate(next.getDate() + 7);
            setCalendarAnchorDate(next);
        } else {
            const next = new Date(calendarAnchorDate);
            next.setDate(next.getDate() + 1);
            setCalendarAnchorDate(next);
        }
    };

    const formatCalendarHeader = () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        if (calendarSubView === 'month') {
            return `${months[calendarAnchorDate.getMonth()]} ${calendarAnchorDate.getFullYear()}`;
        } else if (calendarSubView === 'week') {
            const monday = getMonday(calendarAnchorDate);
            const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);
            return `Week of ${monday.getDate()} ${months[monday.getMonth()]} - ${sunday.getDate()} ${months[sunday.getMonth()]} ${sunday.getFullYear()}`;
        } else {
            return `${calendarAnchorDate.getDate()} ${months[calendarAnchorDate.getMonth()]} ${calendarAnchorDate.getFullYear()}`;
        }
    };

    if (loading) {
        return (
            <div className="p-6 flex flex-col items-center justify-center min-h-[350px] space-y-3">
                <RefreshCw className="w-8 h-8 text-[#10B981] animate-spin" />
                <p className="text-xs text-zinc-500 font-semibold animate-pulse">Consulting schedule rosters...</p>
            </div>
        );
    }

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
                            <select value={specialtyFilter} onChange={e => setSpecialtyFilter(e.target.value)}
                                className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white">
                                <option value="all">All Specialties</option>
                                {specialtiesList.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <select value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)}
                                className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white">
                                <option value="all">All Departments</option>
                                {departmentsList.map(d => <option key={d} value={d}>{d}</option>)}
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
                <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-[#E5E7EB] bg-[#F9FAFB] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 bg-white border border-[#E5E7EB] rounded-lg p-0.5">
                                <button type="button" onClick={handlePrevCalendar} className="p-1.5 hover:bg-[#F3F4F6] rounded text-[#6B7280] transition-colors">
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button type="button" onClick={handleNextCalendar} className="p-1.5 hover:bg-[#F3F4F6] rounded text-[#6B7280] transition-colors">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                            <h3 className="text-base text-[#1F2937] font-semibold select-none">
                                {formatCalendarHeader()}
                            </h3>
                        </div>

                        <div className="flex items-center gap-1 bg-white border border-[#E5E7EB] rounded-lg p-1">
                            {(['month', 'week', 'day'] as const).map(view => (
                                <button
                                    key={view}
                                    type="button"
                                    onClick={() => setCalendarSubView(view)}
                                    className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-all ${
                                        calendarSubView === view
                                            ? 'bg-[#10B981] text-white shadow-sm'
                                            : 'text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F3F4F6]'
                                    }`}
                                >
                                    {view}
                                </button>
                            ))}
                        </div>

                        <button 
                            type="button"
                            onClick={() => setShowCreateShift(true)} 
                            className="flex items-center gap-2 px-4 py-2 text-sm bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors shadow-sm ml-auto sm:ml-0"
                        >
                            <Plus className="w-4 h-4" />Create Shift
                        </button>
                    </div>

                    {calendarSubView === 'month' && (
                        <div className="divide-y divide-[#E5E7EB]">
                            <div className="grid grid-cols-7 bg-[#F9FAFB] text-center py-2.5">
                                {daysOfWeek.map(dayName => (
                                    <span key={dayName} className="text-xs font-semibold text-[#4B5563] uppercase tracking-wider">{dayName}</span>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 bg-white auto-rows-[110px] divide-x divide-y divide-[#E5E7EB] border-t border-[#E5E7EB]">
                                {getMonthDays().map((cell) => {
                                    if (cell.isEmpty) {
                                        return <div key={cell.key} className="bg-[#FAFAFA] border-r border-b border-[#E5E7EB]" />;
                                    }

                                    const dayShifts = shifts.filter(s => s.date === cell.dateStr);
                                    const isToday = cell.dateStr === '2026-02-09';

                                    return (
                                        <div 
                                            key={cell.key} 
                                            onClick={() => {
                                                if (cell.date) {
                                                    setCalendarAnchorDate(cell.date);
                                                    setCalendarSubView('day');
                                                }
                                            }}
                                            className={`p-1.5 flex flex-col gap-1 cursor-pointer transition-colors hover:bg-[#F3FFFA]/50 border-r border-b border-[#E5E7EB] overflow-hidden ${
                                                isToday ? 'bg-[#ECFDF5]' : ''
                                            }`}
                                        >
                                            <span className={`text-xs font-bold text-[#4B5563] self-end px-1.5 py-0.5 rounded-full ${
                                                isToday ? 'bg-[#10B981] text-white' : ''
                                            }`}>
                                                {cell.dayNum}
                                            </span>
                                            <div className="flex-1 overflow-y-auto space-y-1 scrollbar-none">
                                                {dayShifts.slice(0, 3).map(shift => {
                                                    const config = statusConfig[shift.status];
                                                    return (
                                                        <div 
                                                            key={shift.id} 
                                                            className="px-1 py-0.5 rounded text-[9px] border truncate"
                                                            style={{ backgroundColor: config.bg, borderColor: config.border, color: config.color, fontWeight: 500 }}
                                                        >
                                                            {shift.specialty}
                                                        </div>
                                                    );
                                                })}
                                                {dayShifts.length > 3 && (
                                                    <div className="text-[9px] text-[#10B981] font-semibold text-center">
                                                        +{dayShifts.length - 3} more
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {calendarSubView === 'week' && (
                        <div className="divide-y divide-[#E5E7EB]">
                            <div className="grid grid-cols-7 border-b border-[#E5E7EB] bg-[#FAFAFA]">
                                {getWeekDays().map(day => {
                                    const isToday = day.dateStr === '2026-02-09';
                                    return (
                                        <div key={day.dateStr} className="p-3 border-r border-[#E5E7EB] last:border-r-0 text-center flex flex-col items-center">
                                            <p className="text-xs text-[#6B7280] font-medium uppercase tracking-wider">{day.dayName}</p>
                                            <p className={`text-lg mt-1 w-8 h-8 flex items-center justify-center rounded-full ${
                                                isToday ? 'bg-[#10B981] text-white font-bold shadow-sm' : 'text-[#1F2937] font-semibold'
                                            }`}>
                                                {day.date.getDate()}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="grid grid-cols-7 min-h-[450px] divide-x divide-[#E5E7EB] bg-white">
                                {getWeekDays().map(day => {
                                    const dayShifts = shifts.filter(s => s.date === day.dateStr);
                                    return (
                                        <div key={day.dateStr} className="p-2.5 space-y-2.5 bg-white hover:bg-[#FAFAFA]/30 transition-colors">
                                            {dayShifts.map(shift => {
                                                const config = statusConfig[shift.status];
                                                return (
                                                    <div 
                                                        key={shift.id} 
                                                        onClick={() => onViewShiftDetail?.(shift.id)}
                                                        className="p-2.5 rounded-xl border cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 bg-white"
                                                        style={{ borderColor: config.border, borderLeftWidth: '4px', borderLeftColor: config.color }}
                                                    >
                                                        <div className="flex items-center justify-between gap-1 mb-1">
                                                            <span className="text-[11px] font-bold" style={{ color: config.color }}>
                                                                {shift.specialty}
                                                            </span>
                                                            <span className="text-[9px] px-1 py-0.2 rounded font-semibold uppercase"
                                                                style={{ backgroundColor: config.bg, color: config.color }}>
                                                                {shift.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-[10px] text-[#1F2937] font-semibold truncate mb-0.5">{shift.facility}</p>
                                                        <p className="text-[9px] text-[#6B7280] font-medium">{shift.time} ({shift.hours}h)</p>
                                                        {shift.locum && (
                                                            <div className="flex items-center gap-1 mt-1.5 pt-1 border-t border-[#F3F4F6]">
                                                                <div className="w-4 h-4 bg-[#EDE9FE] rounded-full flex items-center justify-center text-[8px] font-bold text-[#8B5CF6]">
                                                                    {shift.locum[0]}
                                                                </div>
                                                                <span className="text-[9px] text-[#4B5563] font-medium truncate">{shift.locum}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                            {dayShifts.length === 0 && (
                                                <div className="h-full flex items-center justify-center py-10">
                                                    <span className="text-[10px] text-[#9CA3AF] italic text-center">No shifts scheduled</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {calendarSubView === 'day' && (
                        <div className="bg-white p-6">
                            <div className="max-w-2xl mx-auto space-y-4">
                                <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                                    <h4 className="text-sm font-bold text-[#374151] uppercase tracking-wider">Shifts Scheduled For Today</h4>
                                    <span className="text-xs bg-[#E8FBF2] text-[#10B981] font-semibold px-2 py-1 rounded-full">
                                        {shifts.filter(s => s.date === `${calendarAnchorDate.getFullYear()}-${String(calendarAnchorDate.getMonth() + 1).padStart(2, '0')}-${String(calendarAnchorDate.getDate()).padStart(2, '0')}`).length} Shifts
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {(() => {
                                        const currentDayStr = `${calendarAnchorDate.getFullYear()}-${String(calendarAnchorDate.getMonth() + 1).padStart(2, '0')}-${String(calendarAnchorDate.getDate()).padStart(2, '0')}`;
                                        const dayShifts = shifts.filter(s => s.date === currentDayStr);
                                        
                                        if (dayShifts.length === 0) {
                                            return (
                                                <div className="text-center py-16 border-2 border-dashed border-[#E5E7EB] rounded-xl">
                                                    <Calendar className="w-10 h-10 text-[#9CA3AF] mx-auto mb-2" />
                                                    <p className="text-sm text-[#4B5563] font-medium">No shifts scheduled for this date</p>
                                                    <p className="text-xs text-[#9CA3AF] mt-1">Navigate to other days or click "Create Shift" to add one.</p>
                                                </div>
                                            );
                                        }

                                        return dayShifts.map(shift => {
                                            const config = statusConfig[shift.status];
                                            return (
                                                <div 
                                                    key={shift.id} 
                                                    onClick={() => onViewShiftDetail?.(shift.id)}
                                                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-[#E5E7EB] rounded-xl hover:shadow-md transition-all hover:bg-[#FAFAFA]/50 cursor-pointer"
                                                >
                                                    <div className="flex items-start gap-3.5">
                                                        <div className="w-10 h-10 bg-[#ECFDF5] rounded-xl flex items-center justify-center flex-shrink-0 text-[#10B981] font-bold">
                                                            {shift.specialty.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                 <h5 className="font-bold text-sm text-[#1F2937]">{shift.specialty}</h5>
                                                                 <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full"
                                                                    style={{ backgroundColor: config.bg, color: config.color }}>
                                                                    {config.label}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-[#6B7280] font-medium flex items-center gap-1.5">
                                                                <Building2 className="w-3.5 h-3.5 text-[#9CA3AF]" /> {shift.facility} ({shift.location})
                                                            </p>
                                                            <p className="text-xs text-[#9CA3AF] mt-1 flex items-center gap-1.5">
                                                                <Clock className="w-3.5 h-3.5" /> {shift.time} • {shift.hours} Hours • €{shift.rate}/hr
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 md:mt-0 flex items-center gap-3 border-t md:border-t-0 pt-3 md:pt-0">
                                                        {shift.locum ? (
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 bg-[#EDE9FE] rounded-full flex items-center justify-center text-xs font-bold text-[#8B5CF6]">
                                                                    {shift.locum[0]}
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-[#4B5563] font-semibold">{shift.locum}</p>
                                                                    <p className="text-[10px] text-[#9CA3AF]">Assigned Locum</p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-[#9CA3AF] italic">Unassigned</span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        });
                                    })()}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Create Shift Modal */}
            {showCreateShift && (
                <div className="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <form onSubmit={handleCreateShiftSubmit} className="bg-white rounded-xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl border border-zinc-200 animate-in zoom-in-95 duration-200">
                        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between sticky top-0 bg-white">
                            <h3 className="text-[#1F2937] font-semibold">Create New Shift</h3>
                            <button type="button" onClick={() => setShowCreateShift(false)} className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-1">Facility *</label>
                                <select 
                                    value={formData.facility}
                                    onChange={e => setFormData({ ...formData, facility: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                >
                                    <option value="">Select facility...</option>
                                    <option value="St. James's Hospital">St. James's Hospital, Dublin</option>
                                    <option value="Cork University Hospital">Cork University Hospital</option>
                                    <option value="University Hospital Galway">University Hospital Galway</option>
                                    <option value="Beaumont Hospital">Beaumont Hospital, Dublin</option>
                                    <option value="Mater Hospital">Mater Hospital, Dublin</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-1">Specialty Requirement *</label>
                                <select 
                                    value={formData.specialty}
                                    onChange={e => setFormData({ ...formData, specialty: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                >
                                    <option value="">Select specialty...</option>
                                    <option value="General Surgery">General Surgery</option>
                                    <option value="Cardiology">Cardiology</option>
                                    <option value="Emergency Medicine">Emergency Medicine</option>
                                    <option value="Anesthesiology">Anesthesiology</option>
                                    <option value="Pediatrics">Pediatrics</option>
                                    <option value="Orthopedics">Orthopedics</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-1">Department Requirement *</label>
                                <select 
                                    value={formData.department}
                                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                >
                                    <option value="">Select department...</option>
                                    {departmentsList.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-1">Date *</label>
                                    <input 
                                        type="date" 
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        required
                                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-1">Pay Rate (€/hr) *</label>
                                    <input 
                                        type="number" 
                                        placeholder="55" 
                                        value={formData.rate}
                                        onChange={e => setFormData({ ...formData, rate: e.target.value })}
                                        required
                                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]" 
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-1">Start Time</label>
                                    <input 
                                        type="time" 
                                        value={formData.startTime}
                                        onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-1">End Time</label>
                                    <input 
                                        type="time" 
                                        value={formData.endTime}
                                        onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2">Shift Type</label>
                                <div className="flex gap-3">
                                    {(['open', 'recurring', 'urgent'] as const).map(type => (
                                        <label key={type} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${formData.shiftType === type ? 'border-[#10B981] bg-[#ECFDF5] text-[#10B981]' : 'border-[#E5E7EB] hover:bg-[#F9FAFB] text-zinc-650'}`}>
                                            <input 
                                                type="radio" 
                                                name="shiftType" 
                                                checked={formData.shiftType === type}
                                                onChange={() => setFormData({ ...formData, shiftType: type })}
                                                className="accent-[#10B981] hidden" 
                                            />
                                            <span className="text-sm font-semibold capitalize">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="p-5 border-t border-[#E5E7EB] flex justify-end gap-2 bg-zinc-50">
                            <button type="button" onClick={() => setShowCreateShift(false)} className="px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg text-sm hover:bg-[#F9FAFB] font-semibold transition-colors">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-[#10B981] text-white rounded-lg text-sm hover:bg-[#059669] font-bold shadow-md transition-all">Create Shift</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Assign Shift Modal */}
            {showAssignModal && selectedShift && (
                <div className="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl border border-zinc-200 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between sticky top-0 bg-white">
                            <h3 className="text-[#1F2937] font-semibold">Assign Shift: {selectedShift.id}</h3>
                            <button type="button" onClick={() => setShowAssignModal(false)} className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-[#6B7280] mb-0.5">Facility</label>
                                    <p className="text-sm text-[#1F2937] font-semibold">{selectedShift.facility}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#6B7280] mb-0.5">Specialty Requirement</label>
                                    <p className="text-sm text-[#1F2937] font-semibold">{selectedShift.specialty}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-[#6B7280] mb-0.5">Date</label>
                                    <p className="text-sm text-[#1F2937] font-semibold">{selectedShift.date}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#6B7280] mb-0.5">Pay Rate</label>
                                    <p className="text-sm text-[#1F2937] font-semibold">€{selectedShift.rate}/hr</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#6B7280] mb-1">Locum Professional Assignment *</label>
                                <select 
                                    value={assignLocumName}
                                    onChange={e => setAssignLocumName(e.target.value)}
                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                >
                                    <option value="">Select locum...</option>
                                    <option value="Sarah Mitchell">Sarah Mitchell (General Surgery)</option>
                                    <option value="James Harrison">James Harrison (Cardiology)</option>
                                    <option value="Emily Chen">Emily Chen (Anesthesiology)</option>
                                    <option value="Rachel Martinez">Rachel Martinez (Pediatrics)</option>
                                    <option value="David Thompson">David Thompson (Orthopedics)</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-5 border-t border-[#E5E7EB] flex justify-end gap-2 bg-zinc-50">
                            <button type="button" onClick={() => setShowAssignModal(false)} className="px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg text-sm hover:bg-[#F9FAFB] font-semibold transition-colors">Cancel</button>
                            <button type="button" onClick={handleAssignLocumSubmit} className="px-4 py-2 bg-[#10B981] text-white rounded-lg text-sm hover:bg-[#059669] font-bold shadow-md transition-all">Assign Shift</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Shift Modal */}
            {showCancelModal && selectedShift && (
                <div className="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl border border-zinc-200 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between sticky top-0 bg-white">
                            <h3 className="text-[#1F2937] font-semibold">Cancel Shift: {selectedShift.id}</h3>
                            <button type="button" onClick={() => setShowCancelModal(false)} className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-[#6B7280] mb-0.5">Facility</label>
                                    <p className="text-sm text-[#1F2937] font-semibold">{selectedShift.facility}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#6B7280] mb-0.5">Specialty Requirement</label>
                                    <p className="text-sm text-[#1F2937] font-semibold">{selectedShift.specialty}</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#6B7280] mb-1">Reason for Cancellation</label>
                                <textarea 
                                    value={cancelReason} 
                                    onChange={e => setCancelReason(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]" 
                                    placeholder="Enter administrative reason for cancelling this shift..."
                                />
                            </div>
                        </div>
                        <div className="p-5 border-t border-[#E5E7EB] flex justify-end gap-2 bg-zinc-50">
                            <button type="button" onClick={() => setShowCancelModal(false)} className="px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg text-sm hover:bg-[#F9FAFB] font-semibold transition-colors">Cancel</button>
                            <button type="button" onClick={handleCancelShiftSubmit} className="px-4 py-2 bg-[#DC2626] text-white rounded-lg text-sm hover:bg-[#B91C1C] font-bold shadow-md transition-all">Cancel Shift</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}