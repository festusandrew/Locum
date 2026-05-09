import { useState } from 'react';
import {
    AlertTriangle, Shield, Users, Clock, Bell, CheckCircle,
    XCircle, MapPin, Phone, Mail, ChevronRight, FileText,
    Zap, Building2, Calendar, Activity, X, UserSearch, Send,
    UserPlus
} from 'lucide-react';

interface Alert {
    id: string;
    title: string;
    description: string;
    type: 'staffing' | 'compliance' | 'incident' | 'emergency';
    severity: 'critical' | 'high' | 'medium' | 'low';
    timestamp: string;
    status: 'active' | 'acknowledged' | 'resolved';
    assignedTo?: string;
    relatedEntity?: string;
}

const initialAlerts: Alert[] = [
    { id: 'ALT-001', title: 'Critical Staffing Shortage - Emergency Department', description: 'Beaumont Hospital ED has no coverage for tonight\'s night shift (20:00-08:00). All emergency locums contacted.', type: 'staffing', severity: 'critical', timestamp: '2026-02-10 14:30', status: 'active', relatedEntity: 'Beaumont Hospital' },
    { id: 'ALT-002', title: 'Expired Medical License', description: 'Dr. David Thompson\'s medical license expired 3 days ago. All upcoming shifts must be cancelled until renewed.', type: 'compliance', severity: 'critical', timestamp: '2026-02-10 09:00', status: 'active', assignedTo: 'Compliance Team', relatedEntity: 'Dr. David Thompson' },
    { id: 'ALT-003', title: 'Unfilled Weekend Shifts', description: '4 shifts at Waterford University Hospital for 15-16 Feb remain unfilled. Deadline approaching.', type: 'staffing', severity: 'high', timestamp: '2026-02-10 08:15', status: 'active', relatedEntity: 'Waterford University Hospital' },
    { id: 'ALT-004', title: 'Incident Report Filed', description: 'Medication error reported at Cork University Hospital during Dr. Harrison\'s shift. Investigation required.', type: 'incident', severity: 'high', timestamp: '2026-02-09 22:30', status: 'acknowledged', assignedTo: 'Quality Assurance', relatedEntity: 'Dr. James Harrison' },
    { id: 'ALT-005', title: 'Garda Vetting Expired', description: 'Dr. Emily Chen\'s Garda Vetting certificate expired 12 days ago. Document upload pending.', type: 'compliance', severity: 'high', timestamp: '2026-02-09 10:00', status: 'acknowledged', relatedEntity: 'Dr. Emily Chen' },
    { id: 'ALT-006', title: 'Locum Called in Sick', description: 'Dr. Michael Brooks has called in sick for tomorrow\'s shift at Limerick University Hospital. Replacement needed.', type: 'emergency', severity: 'high', timestamp: '2026-02-09 20:00', status: 'active', relatedEntity: 'Dr. Michael Brooks' },
    { id: 'ALT-007', title: 'Insurance Expiring Soon', description: '3 locums have indemnity insurance expiring within 14 days. Renewal reminders sent.', type: 'compliance', severity: 'medium', timestamp: '2026-02-09 08:00', status: 'acknowledged', assignedTo: 'Compliance Team' },
    { id: 'ALT-008', title: 'High Cancellation Rate', description: 'Limerick region showing 15% shift cancellation rate this month - above 10% threshold.', type: 'staffing', severity: 'medium', timestamp: '2026-02-08 14:00', status: 'active' },
    { id: 'ALT-009', title: 'Client Payment Overdue', description: 'Galway Clinic invoice INV-2026-043 (€9,400) is 10 days overdue. Follow-up required.', type: 'incident', severity: 'medium', timestamp: '2026-02-08 09:00', status: 'active', relatedEntity: 'Galway Clinic' },
    { id: 'ALT-010', title: 'CPR Training Expiring', description: 'Dr. Rachel Martinez CPR Training certificate expiring in 18 days.', type: 'compliance', severity: 'low', timestamp: '2026-02-07 08:00', status: 'acknowledged', relatedEntity: 'Dr. Rachel Martinez' },
];

const emergencyContacts = [
    { name: 'Emergency Staffing Desk', phone: '+353 1 800 4567', available: '24/7' },
    { name: 'Compliance Officer - Siobhan Brady', phone: '+353 1 234 5680', available: 'Mon-Fri 08:00-18:00' },
    { name: 'Clinical Director - Dr. Aidan Murphy', phone: '+353 1 234 5681', available: 'On Call' },
    { name: 'Operations Manager - Ciara Walsh', phone: '+353 1 234 5682', available: 'Mon-Fri 07:00-20:00' },
];

const severityConfig: Record<string, { color: string; bg: string; border: string; label: string }> = {
    critical: { color: '#DC2626', bg: '#FEE2E2', border: '#FECACA', label: 'Critical' },
    high: { color: '#EA580C', bg: '#FFF7ED', border: '#FED7AA', label: 'High' },
    medium: { color: '#D97706', bg: '#FEF3C7', border: '#FDE68A', label: 'Medium' },
    low: { color: '#6B7280', bg: '#F3F4F6', border: '#E5E7EB', label: 'Low' },
};

const typeConfig: Record<string, { icon: any; color: string; label: string }> = {
    staffing: { icon: Users, color: '#3B82F6', label: 'Staffing' },
    compliance: { icon: Shield, color: '#EF4444', label: 'Compliance' },
    incident: { icon: AlertTriangle, color: '#F59E0B', label: 'Incident' },
    emergency: { icon: Zap, color: '#DC2626', label: 'Emergency' },
};

const statusConfig: Record<string, { color: string; bg: string; border: string; label: string }> = {
    active: { color: '#DC2626', bg: '#FEE2E2', border: '#FECACA', label: 'Active' },
    acknowledged: { color: '#D97706', bg: '#FEF3C7', border: '#FDE68A', label: 'Acknowledged' },
    resolved: { color: '#059669', bg: '#D1FAE5', border: '#A7F3D0', label: 'Resolved' },
};

export function AlertsRisk() {
    const [allAlerts, setAllAlerts] = useState(initialAlerts);
    const [typeFilter, setTypeFilter] = useState('all');
    const [severityFilter, setSeverityFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
    const [showFindLocum, setShowFindLocum] = useState(false);
    const [showResolveModal, setShowResolveModal] = useState(false);
    const [resolutionText, setResolutionText] = useState('');

    const filtered = allAlerts.filter(a => {
        const matchType = typeFilter === 'all' || a.type === typeFilter;
        const matchSev = severityFilter === 'all' || a.severity === severityFilter;
        const matchStatus = statusFilter === 'all' || a.status === statusFilter;
        return matchType && matchSev && matchStatus;
    });

    const criticalCount = allAlerts.filter(a => a.severity === 'critical' && a.status === 'active').length;
    const highCount = allAlerts.filter(a => a.severity === 'high' && a.status !== 'resolved').length;
    const activeCount = allAlerts.filter(a => a.status === 'active').length;

    const updateStatus = (id: string, newStatus: 'acknowledged' | 'resolved') => {
        setAllAlerts(prev => prev.map(a =>
            a.id === id ? { ...a, status: newStatus, assignedTo: newStatus === 'acknowledged' ? 'You' : a.assignedTo } : a
        ));
        setSelectedAlert(null);
        setShowResolveModal(false);
        setResolutionText('');
    };

    const mockLocums = [
        { name: 'Dr. Kevin O\'Malley', specialty: 'General Practice', availability: 'Immediate', rating: 4.9 },
        { name: 'Dr. Sarah Higgins', specialty: 'Emergency Medicine', availability: '2 hours', rating: 4.8 },
        { name: 'Dr. Paul Byrne', specialty: 'General Practice', availability: 'Tomorrow', rating: 4.7 },
    ];

    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="text-[#1F2937] mb-1">Alerts & Risk Management</h2>
                <p className="text-sm text-[#6B7280]">Monitor staffing shortages, compliance risks, incidents, and emergency workflows</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: 'Critical Alerts', value: criticalCount.toString(), icon: AlertTriangle, color: '#DC2626', bg: '#FEE2E2' },
                    { label: 'High Priority', value: highCount.toString(), icon: Zap, color: '#EA580C', bg: '#FFF7ED' },
                    { label: 'Active Alerts', value: activeCount.toString(), icon: Bell, color: '#F59E0B', bg: '#FEF3C7' },
                    { label: 'Resolved Today', value: (allAlerts.filter(a => a.status === 'resolved').length).toString(), icon: CheckCircle, color: '#10B981', bg: '#D1FAE5' },
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

            <div className="grid grid-cols-3 gap-5">
                {/* Alerts List */}
                <div className="col-span-2 bg-white rounded-xl border border-[#E5E7EB]">
                    <div className="p-4 border-b border-[#E5E7EB]">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-[#1F2937]">All Alerts</h3>
                        </div>
                        <div className="flex gap-2">
                            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-1.5 text-xs border border-[#E5E7EB] rounded-lg">
                                <option value="all">All Types</option>
                                <option value="staffing">Staffing</option>
                                <option value="compliance">Compliance</option>
                                <option value="incident">Incident</option>
                                <option value="emergency">Emergency</option>
                            </select>
                            <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} className="px-3 py-1.5 text-xs border border-[#E5E7EB] rounded-lg">
                                <option value="all">All Severity</option>
                                <option value="critical">Critical</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-1.5 text-xs border border-[#E5E7EB] rounded-lg">
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="acknowledged">Acknowledged</option>
                                <option value="resolved">Resolved</option>
                            </select>
                        </div>
                    </div>

                    <div className="divide-y divide-[#F3F4F6]">
                        {filtered.map(alert => {
                            const sev = severityConfig[alert.severity];
                            const type = typeConfig[alert.type];
                            const status = statusConfig[alert.status];
                            const TypeIcon = type.icon;
                            return (
                                <div key={alert.id} className={`p-4 hover:bg-[#F9FAFB] transition-colors ${alert.severity === 'critical' && alert.status === 'active' ? 'bg-[#FEF2F2]' : ''}`}>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center mt-0.5" style={{ backgroundColor: `${type.color}15` }}>
                                            <TypeIcon className="w-4 h-4" style={{ color: type.color }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>{alert.title}</p>
                                                    <p className="text-xs text-[#6B7280] mt-0.5">{alert.description}</p>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] border font-semibold" style={{ backgroundColor: sev.bg, color: sev.color, borderColor: sev.border }}>
                                                        {sev.label}
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] border font-semibold" style={{ backgroundColor: status.bg, color: status.color, borderColor: status.border }}>
                                                        {status.label}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-[11px] text-[#9CA3AF] flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> {alert.timestamp}
                                                </span>
                                                {alert.relatedEntity && (
                                                    <span className="text-[11px] text-[#6B7280] font-medium">{alert.relatedEntity}</span>
                                                )}
                                                {alert.assignedTo && (
                                                    <span className="text-[11px] text-[#10B981] font-medium italic">Assigned: {alert.assignedTo}</span>
                                                )}
                                            </div>

                                            {alert.status !== 'resolved' && (
                                                <div className="flex gap-2 mt-3">
                                                    {alert.status === 'active' && (
                                                        <button
                                                            onClick={() => updateStatus(alert.id, 'acknowledged')}
                                                            className="px-3 py-1 text-[11px] bg-white border border-[#FDE68A] text-[#92400E] rounded-md hover:bg-[#FEF3C7] font-semibold transition-all shadow-sm flex items-center gap-1.5"
                                                        >
                                                            <CheckCircle className="w-3 h-3" /> Acknowledge
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => {
                                                            setSelectedAlert(alert);
                                                            setShowResolveModal(true);
                                                        }}
                                                        className="px-3 py-1 text-[11px] bg-white border border-[#A7F3D0] text-[#065F46] rounded-md hover:bg-[#D1FAE5] font-semibold transition-all shadow-sm flex items-center gap-1.5"
                                                    >
                                                        <Shield className="w-3 h-3" /> Resolve
                                                    </button>
                                                    {(alert.type === 'staffing' || alert.type === 'emergency') && (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedAlert(alert);
                                                                setShowFindLocum(true);
                                                            }}
                                                            className="px-3 py-1 text-[11px] bg-[#10B981] text-white rounded-md hover:bg-[#059669] font-semibold transition-all shadow-sm flex items-center gap-1.5"
                                                        >
                                                            <UserSearch className="w-3 h-3" /> Find Locum
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Panel */}
                <div className="space-y-5">
                    {/* Risk Overview */}
                    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
                        <h3 className="text-[#1F2937] mb-4">Risk Overview</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Staffing Risk', value: 'Medium', color: '#F59E0B', percent: 45 },
                                { label: 'Compliance Risk', value: 'High', color: '#EF4444', percent: 72 },
                                { label: 'Financial Risk', value: 'Low', color: '#10B981', percent: 18 },
                                { label: 'Operational Risk', value: 'Medium', color: '#F59E0B', percent: 38 },
                            ].map(r => (
                                <div key={r.label}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-[#6B7280]">{r.label}</span>
                                        <span className="text-xs" style={{ color: r.color, fontWeight: 600 }}>{r.value}</span>
                                    </div>
                                    <div className="w-full h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${r.percent}%`, backgroundColor: r.color }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Emergency Contacts */}
                    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
                        <h3 className="text-[#1F2937] mb-4">Emergency Contacts</h3>
                        <div className="space-y-3">
                            {emergencyContacts.map((c, i) => (
                                <div key={i} className="p-3 bg-[#F9FAFB] rounded-lg hover:border-[#10B981] border border-transparent transition-colors group">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>{c.name}</p>
                                        <button className="opacity-0 group-hover:opacity-100 p-1 bg-[#10B981] text-white rounded transition-all">
                                            <Phone className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Phone className="w-3 h-3 text-[#10B981]" />
                                        <span className="text-xs text-[#6B7280]">{c.phone}</span>
                                    </div>
                                    <p className="text-[11px] text-[#9CA3AF] mt-0.5">{c.available}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Incident Reporting */}
                    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
                        <h3 className="text-[#1F2937] mb-3">Quick Action</h3>
                        <button className="w-full px-4 py-3 bg-[#FEE2E2] text-[#DC2626] rounded-lg text-sm hover:bg-[#FECACA] flex items-center justify-center gap-2 font-bold shadow-sm transition-all active:scale-95">
                            <AlertTriangle className="w-4 h-4" />
                            File Emergency Incident
                        </button>
                    </div>
                </div>
            </div>

            {/* Resolve Modal */}
            {showResolveModal && selectedAlert && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                    <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
                        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-white">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#D1FAE5] text-[#059669] rounded-lg">
                                    <CheckCircle className="w-5 h-5" />
                                </div>
                                <h3 className="text-[#1F2937]" style={{ fontWeight: 700 }}>Resolve Alert: {selectedAlert.id}</h3>
                            </div>
                            <button onClick={() => setShowResolveModal(false)} className="p-2 hover:bg-[#F3F4F6] rounded-lg">
                                <X className="w-5 h-5 text-[#6B7280]" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                                <p className="text-sm font-bold text-[#1F2937]">{selectedAlert.title}</p>
                                <p className="text-xs text-[#6B7280] mt-1">{selectedAlert.description}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2">Resolution Notes</label>
                                <textarea
                                    value={resolutionText}
                                    onChange={(e) => setResolutionText(e.target.value)}
                                    className="w-full px-4 py-3 text-sm border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#10B981] h-32 outline-none resize-none"
                                    placeholder="Describe how this issue was resolved..."
                                ></textarea>
                            </div>
                        </div>
                        <div className="p-5 bg-[#F9FAFB] border-t border-[#E5E7EB] flex justify-end gap-3">
                            <button onClick={() => setShowResolveModal(false)} className="px-5 py-2 text-sm text-[#6B7280] font-bold">Cancel</button>
                            <button
                                onClick={() => updateStatus(selectedAlert.id, 'resolved')}
                                className="px-6 py-2 bg-[#10B981] text-white rounded-lg text-sm font-bold hover:bg-[#059669] shadow-md active:scale-95 transition-all"
                            >
                                Mark as Resolved
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Find Locum Modal */}
            {showFindLocum && selectedAlert && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                    <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
                        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-white">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#DBEAFE] text-[#1E40AF] rounded-lg">
                                    <UserSearch className="w-5 h-5" />
                                </div>
                                <h3 className="text-[#1F2937]" style={{ fontWeight: 700 }}>Emergency Locum Sourcing</h3>
                            </div>
                            <button onClick={() => setShowFindLocum(false)} className="p-2 hover:bg-[#F3F4F6] rounded-lg">
                                <X className="w-5 h-5 text-[#6B7280]" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between p-4 bg-[#F0F9FF] rounded-xl border border-[#BAE6FD]">
                                <div>
                                    <p className="text-xs text-[#0369A1] font-bold uppercase tracking-widest mb-1">Requirement</p>
                                    <p className="text-sm font-bold text-[#0C4A6E]">{selectedAlert.relatedEntity || 'Emergency Unit'}</p>
                                    <p className="text-xs text-[#0369A1] mt-0.5">Urgent shift coverage needed ASAP</p>
                                </div>
                                <div className="text-right">
                                    <span className="px-3 py-1 bg-[#0369A1] text-white rounded-full text-[10px] font-black uppercase tracking-tighter">Emergency Dispatch</span>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-black text-[#1F2937] uppercase tracking-widest mb-4">Available & Matched Professionals</h4>
                                <div className="space-y-3">
                                    {mockLocums.map((locum, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 border border-[#E5E7EB] rounded-xl hover:border-[#10B981] hover:bg-emerald-50/30 transition-all group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-[#F3F4F6] rounded-full flex items-center justify-center text-[#6B7280] group-hover:bg-[#10B981] group-hover:text-white transition-colors font-bold">
                                                    {locum.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-[#1F2937]">{locum.name}</p>
                                                    <p className="text-[11px] text-[#6B7280]">{locum.specialty} • {locum.rating} ★</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-[10px] text-[#6B7280] font-bold uppercase tracking-widest">Available In</p>
                                                    <p className="text-xs font-bold text-[#10B981]">{locum.availability}</p>
                                                </div>
                                                <button className="px-4 py-2 bg-[#10B981] text-white rounded-lg text-xs font-bold shadow-sm hover:bg-[#059669] flex items-center gap-2">
                                                    <Send className="w-3 h-3" /> Assign
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="p-5 bg-[#F9FAFB] border-t border-[#E5E7EB] flex justify-between items-center">
                            <p className="text-[10px] text-[#9CA3AF] italic">Automatic broadcast has been sent to 12 nearby locums</p>
                            <button className="text-sm font-bold text-[#10B981] flex items-center gap-2 hover:underline">
                                <UserPlus className="w-4 h-4" /> Invite via Phone
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
