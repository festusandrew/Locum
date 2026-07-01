import { useState, useEffect } from 'react';
import {
    Clock, CheckCircle, XCircle, AlertCircle, Search, Download,
    Eye, X, FileText, MapPin, Calendar, User, ChevronDown,
    ThumbsUp, ThumbsDown, Timer, Navigation, Upload
} from 'lucide-react';
import { Timesheet } from '../types';
import { timesheetService } from '../services/timesheetService';

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
    submitted: { label: 'Submitted', color: '#3B82F6', bg: '#DBEAFE', border: '#BFDBFE' },
    approved: { label: 'Approved', color: '#059669', bg: '#D1FAE5', border: '#A7F3D0' },
    rejected: { label: 'Rejected', color: '#DC2626', bg: '#FEE2E2', border: '#FECACA' },
    pending_client: { label: 'Pending Client', color: '#D97706', bg: '#FEF3C7', border: '#FDE68A' },
    auto_approved: { label: 'Auto-Approved', color: '#059669', bg: '#D1FAE5', border: '#A7F3D0' },
};

export function TimesheetsAttendance({ onViewTimesheetDetail }: { onViewTimesheetDetail?: (id: string) => void }) {
    const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showDetail, setShowDetail] = useState(false);
    const [selectedTs, setSelectedTs] = useState<Timesheet | null>(null);
    const [activeTab, setActiveTab] = useState<'timesheets' | 'attendance' | 'approval'>('timesheets');

    useEffect(() => {
        const fetchTimesheets = async () => {
            try {
                const data = await timesheetService.getAll();
                setTimesheets(data);
            } catch (error) {
                console.error('Error fetching timesheets:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTimesheets();
    }, []);

    const filtered = timesheets.filter(ts => {
        const matchSearch = ts.locum.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ts.facility.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ts.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === 'all' || ts.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const pendingCount = timesheets.filter(t => t.status === 'submitted').length;
    const approvedCount = timesheets.filter(t => t.status === 'approved' || t.status === 'auto_approved').length;
    const totalHours = timesheets.reduce((s, t) => s + t.actualHours, 0);
    const totalPay = timesheets.reduce((s, t) => s + t.total, 0);

    const handleExport = () => {
        const csv = [
            ['ID', 'Locum', 'Facility', 'Date', 'Clock In', 'Clock Out', 'Hours', 'OT', 'Rate', 'Total', 'Status'],
            ...timesheets.map(t => [t.id, t.locum, t.facility, t.shiftDate, t.clockIn, t.clockOut, t.actualHours, t.overtime, `€${t.rate}`, `€${t.total}`, t.status])
        ].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `timesheets-${new Date().toISOString().split('T')[0]}.csv`; a.click();
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="text-[#1F2937] mb-1">Timesheets & Attendance</h2>
                <p className="text-sm text-[#6B7280]">Track locum timesheets, approvals, and attendance verification</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: 'Pending Approval', value: pendingCount.toString(), icon: Clock, color: '#F59E0B', bg: '#FEF3C7' },
                    { label: 'Approved This Week', value: approvedCount.toString(), icon: CheckCircle, color: '#10B981', bg: '#D1FAE5' },
                    { label: 'Total Hours Logged', value: totalHours.toFixed(1), icon: Timer, color: '#3B82F6', bg: '#DBEAFE' },
                    { label: 'Total Payable', value: `€${totalPay.toLocaleString('en-IE', { minimumFractionDigits: 2 })}`, icon: FileText, color: '#8B5CF6', bg: '#EDE9FE' },
                ].map(s => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: s.bg }}>
                                    <Icon className="w-5 h-5" style={{ color: s.color }} />
                                </div>
                                <div>
                                    <p className="text-xs text-[#9CA3AF]">{s.label}</p>
                                    <p className="text-xl text-[#1F2937]" style={{ fontWeight: 700 }}>{s.value}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-[#E5E7EB]">
                <div className="border-b border-[#E5E7EB] px-5">
                    <div className="flex gap-6">
                        {[
                            { id: 'timesheets' as const, label: 'All Timesheets' },
                            { id: 'approval' as const, label: 'Approval Queue', badge: pendingCount },
                            { id: 'attendance' as const, label: 'Attendance Tracking' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-3 text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === tab.id
                                        ? 'border-[#10B981] text-[#10B981]'
                                        : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'
                                    }`}
                                style={{ fontWeight: activeTab === tab.id ? 600 : 400 }}
                            >
                                {tab.label}
                                {tab.badge && (
                                    <span className="bg-[#F59E0B] text-white text-[10px] px-1.5 py-0.5 rounded-full">{tab.badge}</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Toolbar */}
                <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                            <input
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder="Search timesheets..."
                                className="pl-9 pr-4 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] w-64"
                            />
                        </div>
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg">
                            <option value="all">All Status</option>
                            <option value="submitted">Submitted</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="pending_client">Pending Client</option>
                            <option value="auto_approved">Auto-Approved</option>
                        </select>
                    </div>
                    <button onClick={handleExport} className="flex items-center gap-2 px-3 py-2 text-sm text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]">
                        <Download className="w-4 h-4" /> Export
                    </button>
                </div>

                {/* Table */}
                {activeTab === 'timesheets' || activeTab === 'approval' ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#E5E7EB]">
                                    {['ID', 'Locum', 'Facility', 'Shift Date', 'Clock In/Out', 'Hours', 'OT', 'Total', 'Verification', 'Status', 'Action'].map(h => (
                                        <th key={h} className="px-4 py-2.5 text-left text-xs text-[#9CA3AF]" style={{ fontWeight: 500 }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {(activeTab === 'approval' ? filtered.filter(t => t.status === 'submitted') : filtered).map(ts => {
                                    const sc = statusConfig[ts.status];
                                    return (
                                        <tr key={ts.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                                            <td className="px-4 py-3 text-xs text-[#6B7280]">{ts.id}</td>
                                            <td className="px-4 py-3 text-sm text-[#1F2937]">{ts.locum}</td>
                                            <td className="px-4 py-3">
                                                <p className="text-xs text-[#1F2937]">{ts.facility}</p>
                                                <p className="text-[11px] text-[#9CA3AF]">{ts.location}</p>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-[#6B7280]">{ts.shiftDate}</td>
                                            <td className="px-4 py-3">
                                                <p className="text-xs text-[#1F2937]">{ts.clockIn} - {ts.clockOut}</p>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-[#1F2937]" style={{ fontWeight: 500 }}>{ts.actualHours.toFixed(1)}h</td>
                                            <td className="px-4 py-3 text-xs text-[#F59E0B]">{ts.overtime > 0 ? `+${ts.overtime.toFixed(1)}h` : '-'}</td>
                                            <td className="px-4 py-3 text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>€{ts.total.toFixed(2)}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    <Navigation className={`w-3 h-3 ${ts.gpsVerified ? 'text-[#10B981]' : 'text-[#DC2626]'}`} />
                                                    <FileText className={`w-3 h-3 ${ts.signature ? 'text-[#10B981]' : 'text-[#DC2626]'}`} />
                                                    <Upload className={`w-3 h-3 ${ts.supportingDocs ? 'text-[#10B981]' : 'text-[#9CA3AF]'}`} />
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="px-2 py-1 rounded-full text-[11px] border" style={{ backgroundColor: sc.bg, color: sc.color, borderColor: sc.border }}>
                                                    {sc.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => onViewTimesheetDetail?.(ts.id)}
                                                    className="p-1.5 rounded-lg hover:bg-[#DBEAFE] text-[#3B82F6] transition-colors"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    /* Attendance Tracking Tab */
                    <div className="p-5">
                        <div className="grid grid-cols-3 gap-4 mb-5">
                            {[
                                { label: 'On Time Rate', value: '94.2%', desc: 'Within 5 min of scheduled clock-in' },
                                { label: 'Late Arrivals This Week', value: '3', desc: 'Average delay: 12 minutes' },
                                { label: 'Absence Reports', value: '1', desc: 'Pending review' },
                            ].map(m => (
                                <div key={m.label} className="p-4 bg-[#F9FAFB] rounded-lg">
                                    <p className="text-xs text-[#9CA3AF]">{m.label}</p>
                                    <p className="text-xl text-[#1F2937] mt-1" style={{ fontWeight: 700 }}>{m.value}</p>
                                    <p className="text-[11px] text-[#6B7280] mt-0.5">{m.desc}</p>
                                </div>
                            ))}
                        </div>
                        <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                                        {['Locum', 'Facility', 'Scheduled', 'Clock In', 'Clock Out', 'GPS', 'Status'].map(h => (
                                            <th key={h} className="px-4 py-2.5 text-left text-xs text-[#9CA3AF]" style={{ fontWeight: 500 }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {timesheets.slice(0, 5).map(ts => (
                                        <tr key={ts.id} className="border-b border-[#F3F4F6]">
                                            <td className="px-4 py-3 text-sm text-[#1F2937]">{ts.locum}</td>
                                            <td className="px-4 py-3 text-xs text-[#6B7280]">{ts.facility}</td>
                                            <td className="px-4 py-3 text-xs text-[#6B7280]">{ts.scheduledHours}h</td>
                                            <td className="px-4 py-3 text-xs text-[#1F2937]">{ts.clockIn}</td>
                                            <td className="px-4 py-3 text-xs text-[#1F2937]">{ts.clockOut}</td>
                                            <td className="px-4 py-3">
                                                {ts.gpsVerified ?
                                                    <CheckCircle className="w-4 h-4 text-[#10B981]" /> :
                                                    <XCircle className="w-4 h-4 text-[#DC2626]" />
                                                }
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs ${parseInt(ts.clockIn) <= 8 ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>
                                                    {parseInt(ts.clockIn) <= 8 ? 'On Time' : 'Late'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {showDetail && selectedTs && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-[520px] max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB]">
                            <h3 className="text-[#1F2937]">Timesheet Details</h3>
                            <button onClick={() => setShowDetail(false)} className="p-1 hover:bg-[#F3F4F6] rounded-lg">
                                <X className="w-5 h-5 text-[#6B7280]" />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="text-xs text-[#9CA3AF]">Timesheet ID</p><p className="text-sm text-[#1F2937]">{selectedTs.id}</p></div>
                                <div><p className="text-xs text-[#9CA3AF]">Status</p><span className="px-2 py-1 rounded-full text-[11px] border" style={{ backgroundColor: statusConfig[selectedTs.status].bg, color: statusConfig[selectedTs.status].color, borderColor: statusConfig[selectedTs.status].border }}>{statusConfig[selectedTs.status].label}</span></div>
                                <div><p className="text-xs text-[#9CA3AF]">Locum</p><p className="text-sm text-[#1F2937]">{selectedTs.locum}</p></div>
                                <div><p className="text-xs text-[#9CA3AF]">Facility</p><p className="text-sm text-[#1F2937]">{selectedTs.facility}</p></div>
                                <div><p className="text-xs text-[#9CA3AF]">Shift Date</p><p className="text-sm text-[#1F2937]">{selectedTs.shiftDate}</p></div>
                                <div><p className="text-xs text-[#9CA3AF]">Clock In / Out</p><p className="text-sm text-[#1F2937]">{selectedTs.clockIn} - {selectedTs.clockOut}</p></div>
                                <div><p className="text-xs text-[#9CA3AF]">Actual Hours</p><p className="text-sm text-[#1F2937]">{selectedTs.actualHours.toFixed(2)}h</p></div>
                                <div><p className="text-xs text-[#9CA3AF]">Overtime</p><p className="text-sm text-[#F59E0B]">{selectedTs.overtime > 0 ? `${selectedTs.overtime.toFixed(2)}h` : 'None'}</p></div>
                                <div><p className="text-xs text-[#9CA3AF]">Rate</p><p className="text-sm text-[#1F2937]">€{selectedTs.rate}/hr</p></div>
                                <div><p className="text-xs text-[#9CA3AF]">Total Payable</p><p className="text-sm text-[#1F2937]" style={{ fontWeight: 700 }}>€{selectedTs.total.toFixed(2)}</p></div>
                            </div>
                            <div className="border-t border-[#E5E7EB] pt-4">
                                <p className="text-xs text-[#9CA3AF] mb-2">Verification</p>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-1.5">
                                        {selectedTs.gpsVerified ? <CheckCircle className="w-4 h-4 text-[#10B981]" /> : <XCircle className="w-4 h-4 text-[#DC2626]" />}
                                        <span className="text-xs text-[#6B7280]">GPS Verified</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        {selectedTs.signature ? <CheckCircle className="w-4 h-4 text-[#10B981]" /> : <XCircle className="w-4 h-4 text-[#DC2626]" />}
                                        <span className="text-xs text-[#6B7280]">Digital Signature</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        {selectedTs.supportingDocs ? <CheckCircle className="w-4 h-4 text-[#10B981]" /> : <XCircle className="w-4 h-4 text-[#DC2626]" />}
                                        <span className="text-xs text-[#6B7280]">Supporting Docs</span>
                                    </div>
                                </div>
                            </div>
                            {selectedTs.notes && (
                                <div className="bg-[#FEF3C7] p-3 rounded-lg">
                                    <p className="text-xs text-[#92400E]" style={{ fontWeight: 500 }}>Note:</p>
                                    <p className="text-xs text-[#92400E] mt-0.5">{selectedTs.notes}</p>
                                </div>
                            )}
                        </div>
                        {selectedTs.status === 'submitted' && (
                            <div className="p-5 border-t border-[#E5E7EB] flex gap-2 justify-end">
                                <button className="px-4 py-2 text-sm border border-[#DC2626] text-[#DC2626] rounded-lg hover:bg-[#FEE2E2]">Reject</button>
                                <button className="px-4 py-2 text-sm bg-[#10B981] text-white rounded-lg hover:bg-[#059669]">Approve</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}