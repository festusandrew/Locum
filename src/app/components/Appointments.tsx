import { Calendar, Clock, Search, SlidersHorizontal, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { useState } from 'react';

const appointments = [
    {
        id: 1,
        time: '09:00 AM',
        locum: 'Dr. Sarah Mitchell',
        facility: 'City General Hospital',
        department: 'General Surgery',
        type: 'Consultation',
        duration: '2 hours',
        status: 'confirmed'
    },
    {
        id: 2,
        time: '11:30 AM',
        locum: 'Dr. James Harrison',
        facility: 'St. Mary\'s Medical Center',
        department: 'Cardiology',
        type: 'Follow-up',
        duration: '1 hour',
        status: 'confirmed'
    },
    {
        id: 3,
        time: '02:00 PM',
        locum: 'Dr. Emily Chen',
        facility: 'Regional Medical Center',
        department: 'Anesthesiology',
        type: 'Surgery',
        duration: '4 hours',
        status: 'pending'
    },
    {
        id: 4,
        time: '04:30 PM',
        locum: 'Dr. Michael Brooks',
        facility: 'Parkview Hospital',
        department: 'Emergency Medicine',
        type: 'Emergency',
        duration: '3 hours',
        status: 'confirmed'
    },
];

const upcomingShifts = [
    { date: 'Mon, Dec 9', count: 12, urgent: 2 },
    { date: 'Tue, Dec 10', count: 15, urgent: 1 },
    { date: 'Wed, Dec 11', count: 18, urgent: 3 },
    { date: 'Thu, Dec 12', count: 14, urgent: 0 },
    { date: 'Fri, Dec 13', count: 16, urgent: 2 },
];

export function Appointments() {
    const [currentMonth, setCurrentMonth] = useState(11); // December (0-indexed)
    const [currentYear, setCurrentYear] = useState(2024);
    const [showScheduleDialog, setShowScheduleDialog] = useState(false);

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const handlePreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    return (
        <div className="p-6">
            {/* Page Title */}
            <div className="mb-6">
                <h2 className="text-[#1F2937] mb-1">Appointments</h2>
                <p className="text-sm text-[#6B7280]">Manage and schedule all shift appointments</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-5 mb-6">
                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <p className="text-xs text-[#6B7280] mb-1">Today&apos;s Shifts</p>
                    <p className="text-2xl font-bold text-[#1F2937]">24</p>
                    <p className="text-xs text-[#10B981] mt-1">4 pending confirmation</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <p className="text-xs text-[#6B7280] mb-1">This Week</p>
                    <p className="text-2xl font-bold text-[#1F2937]">75</p>
                    <p className="text-xs text-[#6B7280] mt-1">8 urgent requests</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <p className="text-xs text-[#6B7280] mb-1">Confirmed</p>
                    <p className="text-2xl font-bold text-[#1F2937]">68</p>
                    <p className="text-xs text-[#10B981] mt-1">91% confirmation rate</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <p className="text-xs text-[#6B7280] mb-1">Cancelled</p>
                    <p className="text-2xl font-bold text-[#1F2937]">3</p>
                    <p className="text-xs text-[#EF4444] mt-1">2 in last 24 hours</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-5">
                {/* Calendar & Appointments */}
                <div className="col-span-2 space-y-5">
                    {/* Calendar Widget */}
                    <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-[#1F2937]">{monthNames[currentMonth]} {currentYear}</h3>
                            <div className="flex items-center gap-2">
                                <button className="w-8 h-8 flex items-center justify-center border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]" onClick={handlePreviousMonth}>
                                    <ChevronLeft className="w-4 h-4 text-[#6B7280]" />
                                </button>
                                <button className="w-8 h-8 flex items-center justify-center border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]" onClick={handleNextMonth}>
                                    <ChevronRight className="w-4 h-4 text-[#6B7280]" />
                                </button>
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-2 mb-3">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                <div key={day} className="text-center text-xs font-medium text-[#6B7280] py-2">
                                    {day}
                                </div>
                            ))}
                            {Array.from({ length: 35 }, (_, i) => {
                                const day = i - 2;
                                const isToday = day === 8;
                                const hasShifts = day > 0 && day <= 31 && day % 3 === 0;
                                return (
                                    <div
                                        key={i}
                                        className={`aspect-square flex flex-col items-center justify-center text-sm rounded-lg ${day < 1 || day > 31
                                            ? 'text-[#D1D5DB]'
                                            : isToday
                                                ? 'bg-[#10B981] text-white font-semibold'
                                                : hasShifts
                                                    ? 'bg-[#F3F4F6] text-[#1F2937] font-medium cursor-pointer hover:bg-[#E5E7EB]'
                                                    : 'text-[#1F2937] cursor-pointer hover:bg-[#F9FAFB]'
                                            }`}
                                    >
                                        {day > 0 && day <= 31 && (
                                            <>
                                                <span>{day}</span>
                                                {hasShifts && <div className="w-1 h-1 bg-[#10B981] rounded-full mt-1" />}
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Today's Appointments */}
                    <div className="bg-white rounded-xl border border-[#E5E7EB]">
                        <div className="p-5 border-b border-[#E5E7EB]">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[#1F2937]">Today&apos;s Appointments</h3>
                                <button className="flex items-center gap-2 px-3 py-2 text-sm bg-[#10B981] text-white rounded-lg hover:bg-[#059669]" onClick={() => setShowScheduleDialog(true)}>
                                    <Plus className="w-4 h-4" />
                                    Schedule Shift
                                </button>
                            </div>
                        </div>
                        <div className="p-5 space-y-3">
                            {appointments.map((appointment) => (
                                <div
                                    key={appointment.id}
                                    className="flex items-center gap-4 p-4 border border-[#E5E7EB] rounded-xl hover:shadow-sm transition-shadow"
                                >
                                    <div className="text-center px-3 py-2 bg-[#F9FAFB] rounded-lg">
                                        <p className="text-xs text-[#6B7280]">Time</p>
                                        <p className="font-semibold text-[#1F2937]">{appointment.time}</p>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-1">
                                            <div>
                                                <h4 className="font-medium text-[#1F2937]">{appointment.locum}</h4>
                                                <p className="text-xs text-[#6B7280]">{appointment.facility}</p>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-full text-xs ${appointment.status === 'confirmed'
                                                ? 'bg-[#D1FAE5] text-[#059669] border border-[#A7F3D0]'
                                                : 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]'
                                                }`}>
                                                {appointment.status === 'confirmed' ? '● Confirmed' : '● Pending'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                                            <span>{appointment.department}</span>
                                            <span>•</span>
                                            <span>{appointment.type}</span>
                                            <span>•</span>
                                            <span>{appointment.duration}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Upcoming Schedule */}
                <div className="space-y-5">
                    <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                        <h3 className="text-[#1F2937] mb-5">Upcoming Schedule</h3>
                        <div className="space-y-3">
                            {upcomingShifts.map((shift, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg hover:bg-[#F3F4F6] cursor-pointer"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-[#1F2937]">{shift.date}</p>
                                        <p className="text-xs text-[#6B7280]">{shift.count} shifts scheduled</p>
                                    </div>
                                    {shift.urgent > 0 && (
                                        <span className="px-2 py-1 bg-[#FEE2E2] text-[#DC2626] rounded text-xs font-medium">
                                            {shift.urgent} urgent
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                        <h3 className="text-[#1F2937] mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <button className="w-full px-4 py-3 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] text-sm font-medium">
                                Create New Shift
                            </button>
                            <button className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] text-[#1F2937] rounded-lg hover:bg-[#F3F4F6] text-sm font-medium">
                                View All Appointments
                            </button>
                            <button className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] text-[#1F2937] rounded-lg hover:bg-[#F3F4F6] text-sm font-medium">
                                Manage Recurring Shifts
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Schedule Dialog */}
            {showScheduleDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl p-6 w-96">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[#1F2937]">Schedule Shift</h3>
                            <button className="w-6 h-6 flex items-center justify-center text-[#6B7280] hover:text-[#EF4444]" onClick={() => setShowScheduleDialog(false)}>
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-[#6B7280]" />
                                <input type="date" className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-[#6B7280]" />
                                <input type="time" className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Search className="w-4 h-4 text-[#6B7280]" />
                                <input type="text" placeholder="Locum Name" className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]" />
                            </div>
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal className="w-4 h-4 text-[#6B7280]" />
                                <input type="text" placeholder="Department" className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]" />
                            </div>
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal className="w-4 h-4 text-[#6B7280]" />
                                <input type="text" placeholder="Type" className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]" />
                            </div>
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal className="w-4 h-4 text-[#6B7280]" />
                                <input type="text" placeholder="Duration" className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]" />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button className="px-4 py-3 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] text-sm font-medium">
                                Schedule
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}