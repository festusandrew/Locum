import { useState } from 'react';
import {
    ArrowLeft, Calendar, Clock, MapPin, DollarSign, Users, Building2,
    CheckCircle, AlertTriangle, Edit, Ban, UserPlus, Download, MoreHorizontal,
    Phone, Mail, ShieldCheck, FileText, Activity, MessageSquare, X,
    Copy, Send, TrendingUp, Trash2
} from 'lucide-react';
import { toast } from 'sonner';

interface ShiftDetailPageProps {
    shiftId: string;
    onBack: () => void;
    onViewLocumProfile?: (id: string) => void;
}

const shiftProfiles: Record<string, any> = {
    'SH-001': {
        id: 'SH-001',
        facility: "St. James's Hospital",
        facilityId: 'CL-001',
        location: 'Dublin',
        address: "James's Street, Dublin 8",
        specialty: 'General Surgery',
        department: 'Surgical Department',
        date: '2026-02-10',
        startTime: '08:00',
        endTime: '16:00',
        hours: 8,
        rate: 55,
        totalPay: 440,
        status: 'filled',
        locum: 'Sarah Mitchell',
        locumId: 'LOC-001',
        grade: 'Consultant',
        shiftType: 'Standard',
        createdBy: 'Omar Murphy',
        createdDate: '2026-01-15',
        lastModified: '2026-02-08',
        requiredCompliance: [
            { name: 'Medical Council Registration', status: 'verified', expiryDate: '2027-05-15' },
            { name: 'Garda Vetting', status: 'verified', expiryDate: '2026-12-20' },
            { name: 'Indemnity Insurance', status: 'verified', expiryDate: '2026-11-30' },
            { name: 'BLS/CPR Certification', status: 'verified', expiryDate: '2027-03-10' },
        ],
        contactPerson: {
            name: "Siobhan O'Reilly",
            role: 'Locum Coordinator',
            phone: '+353 1 410 3100',
            email: 'siobhan.oreilly@stjames.ie',
        },
        timeline: [
            { date: '2026-02-08 14:30', user: 'Omar Murphy', action: 'Shift confirmed', details: 'Sarah Mitchell confirmed availability' },
            { date: '2026-02-07 10:15', user: 'System', action: 'Locum assigned', details: 'Sarah Mitchell assigned to shift' },
            { date: '2026-02-05 09:20', user: 'Lisa Keane', action: 'Compliance verified', details: 'All compliance documents verified' },
            { date: '2026-01-15 16:45', user: 'Omar Murphy', action: 'Shift created', details: 'Shift posted as open' },
        ],
        notes: [
            { date: '2026-02-08', author: 'Omar Murphy', content: 'Sarah Mitchell confirmed. Parking pass arranged. Theatre 3.' },
            { date: '2026-02-05', author: 'Lisa Keane', content: 'All compliance docs verified and current.' },
        ],
        description: 'Consultant General Surgeon required for elective surgery list. Theatre experience essential. Familiarity with laparoscopic procedures preferred.',
    },
    'SH-003': {
        id: 'SH-003',
        facility: 'Beaumont Hospital',
        facilityId: 'CL-003',
        location: 'Dublin',
        address: 'Beaumont Road, Dublin 9',
        specialty: 'Emergency Medicine',
        department: 'Emergency Department',
        date: '2026-02-10',
        startTime: '20:00',
        endTime: '08:00',
        hours: 12,
        rate: 65,
        totalPay: 780,
        status: 'urgent',
        locum: null,
        locumId: null,
        grade: 'SHO / Registrar',
        shiftType: 'Night Shift - Urgent',
        createdBy: 'Lisa Keane',
        createdDate: '2026-02-08',
        lastModified: '2026-02-09',
        requiredCompliance: [
            { name: 'Medical Council Registration', status: 'required', expiryDate: null },
            { name: 'Garda Vetting', status: 'required', expiryDate: null },
            { name: 'ACLS Certification', status: 'required', expiryDate: null },
            { name: 'BLS/CPR Certification', status: 'required', expiryDate: null },
        ],
        contactPerson: {
            name: "Michael O'Brien",
            role: 'ED Clinical Director',
            phone: '+353 1 809 3000',
            email: 'mobrien@beaumont.ie',
        },
        timeline: [
            { date: '2026-02-09 15:20', user: 'System', action: 'Shift marked urgent', details: 'Auto-escalated due to proximity and no assignment' },
            { date: '2026-02-09 09:10', user: 'Lisa Keane', action: 'Notifications sent', details: 'Shift broadcast to 12 eligible locums' },
            { date: '2026-02-08 18:30', user: 'Lisa Keane', action: 'Shift created', details: 'Emergency cover required - staff callout' },
        ],
        notes: [
            { date: '2026-02-09', author: 'Lisa Keane', content: 'URGENT: Need ED cover tonight. Staff member called in sick. Offering premium rate.' },
        ],
        description: 'Emergency Medicine Doctor required urgently for night shift. High patient volume expected. ACLS essential. Previous ED experience required.',
    },
    'SH-004': {
        id: 'SH-004',
        facility: 'University Hospital Galway',
        facilityId: 'CL-004',
        location: 'Galway',
        address: 'Newcastle Road, Galway',
        specialty: 'Anesthesiology',
        department: 'Anaesthetics',
        date: '2026-02-11',
        startTime: '07:00',
        endTime: '19:00',
        hours: 12,
        rate: 58,
        totalPay: 696,
        status: 'open',
        locum: null,
        locumId: null,
        grade: 'Consultant / Senior Registrar',
        shiftType: 'Standard',
        createdBy: 'Omar Murphy',
        createdDate: '2026-01-28',
        lastModified: '2026-02-01',
        requiredCompliance: [
            { name: 'Medical Council Registration', status: 'required', expiryDate: null },
            { name: 'Indemnity Insurance', status: 'required', expiryDate: null },
            { name: 'BLS/CPR Certification', status: 'required', expiryDate: null },
            { name: 'Airway Management Certification', status: 'preferred', expiryDate: null },
        ],
        contactPerson: {
            name: 'Fiona Lynch',
            role: 'Anaesthetics Consultant',
            phone: '+353 91 524 222',
            email: 'flynch@uhg.ie',
        },
        timeline: [
            { date: '2026-02-01 11:00', user: 'Omar Murphy', action: 'Rate adjusted', details: 'Increased from €55/hr to €58/hr' },
            { date: '2026-01-28 14:20', user: 'Omar Murphy', action: 'Shift created', details: 'Posted to locum pool' },
        ],
        notes: [
            { date: '2026-02-01', author: 'Omar Murphy', content: 'Increased rate to attract candidates. General theatre list, moderate complexity cases.' },
        ],
        description: 'Consultant Anaesthetist required for elective theatre list. Mix of general surgery and orthopaedic cases. Teaching hospital environment.',
    },
};

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
    open: { label: 'Open', color: '#3B82F6', bg: '#DBEAFE', border: '#BFDBFE' },
    filled: { label: 'Filled', color: '#059669', bg: '#D1FAE5', border: '#A7F3D0' },
    cancelled: { label: 'Cancelled', color: '#6B7280', bg: '#F3F4F6', border: '#E5E7EB' },
    urgent: { label: 'Urgent', color: '#DC2626', bg: '#FEE2E2', border: '#FECACA' },
    recurring: { label: 'Recurring', color: '#7C3AED', bg: '#EDE9FE', border: '#DDD6FE' },
};

function getShiftProfile(id: string) {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(`shift_profile_${id}`);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error(e);
            }
        }
    }
    if (shiftProfiles[id]) return shiftProfiles[id];
    return shiftProfiles['SH-001'];
}

export function ShiftDetailPage({ shiftId, onBack, onViewLocumProfile }: ShiftDetailPageProps) {
    const [profile, setProfile] = useState<any>(() => ({ ...getShiftProfile(shiftId) }));
    const [activeTab, setActiveTab] = useState<'details' | 'compliance' | 'timeline' | 'notes'>('details');
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [selectedAssignee, setSelectedAssignee] = useState('Sarah Mitchell');
    const [showAddNoteInput, setShowAddNoteInput] = useState(false);
    const [newNoteContent, setNewNoteContent] = useState('');

    const [showEditModal, setShowEditModal] = useState(false);
    const [modalTab, setModalTab] = useState<'shift' | 'facility'>('shift');
    const [editForm, setEditForm] = useState({
        specialty: '',
        department: '',
        grade: '',
        shiftType: '',
        date: '',
        startTime: '',
        endTime: '',
        hours: 8,
        rate: 55,
        description: '',
        facility: '',
        location: '',
        address: '',
        facilityId: '',
        contactName: '',
        contactRole: '',
        contactPhone: '',
        contactEmail: '',
    });

    const handleOpenEdit = () => {
        setEditForm({
            specialty: profile.specialty || '',
            department: profile.department || '',
            grade: profile.grade || '',
            shiftType: profile.shiftType || '',
            date: profile.date || '',
            startTime: profile.startTime || '',
            endTime: profile.endTime || '',
            hours: profile.hours || 8,
            rate: profile.rate || 55,
            description: profile.description || '',
            facility: profile.facility || '',
            location: profile.location || '',
            address: profile.address || '',
            facilityId: profile.facilityId || '',
            contactName: profile.contactPerson?.name || '',
            contactRole: profile.contactPerson?.role || '',
            contactPhone: profile.contactPerson?.phone || '',
            contactEmail: profile.contactPerson?.email || '',
        });
        setModalTab('shift');
        setShowEditModal(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const updatedProfile = {
            ...profile,
            specialty: editForm.specialty,
            department: editForm.department,
            grade: editForm.grade,
            shiftType: editForm.shiftType,
            date: editForm.date,
            startTime: editForm.startTime,
            endTime: editForm.endTime,
            hours: Number(editForm.hours),
            rate: Number(editForm.rate),
            totalPay: Number(editForm.hours) * Number(editForm.rate),
            description: editForm.description,
            facility: editForm.facility,
            location: editForm.location,
            address: editForm.address,
            facilityId: editForm.facilityId,
            contactPerson: {
                name: editForm.contactName,
                role: editForm.contactRole,
                phone: editForm.contactPhone,
                email: editForm.contactEmail,
            },
            lastModified: new Date().toISOString().split('T')[0],
        };
        
        const timelineEntry = {
            date: new Date().toISOString().replace('T', ' ').substring(0, 16),
            user: 'Omar Murphy',
            action: 'Shift updated',
            details: 'Shift details edited via dashboard'
        };
        updatedProfile.timeline = [timelineEntry, ...(updatedProfile.timeline || [])];

        setProfile(updatedProfile);
        if (typeof window !== 'undefined') {
            localStorage.setItem(`shift_profile_${profile.id}`, JSON.stringify(updatedProfile));
        }
        setShowEditModal(false);
        toast.success("Shift details updated successfully!");
    };

    const [showActionDropdown, setShowActionDropdown] = useState(false);

    const handleBroadcast = () => {
        const timelineEntry = {
            date: new Date().toISOString().replace('T', ' ').substring(0, 16),
            user: 'Omar Murphy',
            action: 'Shift broadcasted',
            details: 'Shift broadcasted to all matching verified locum professionals'
        };
        const updatedProfile = {
            ...profile,
            timeline: [timelineEntry, ...(profile.timeline || [])]
        };
        setProfile(updatedProfile);
        if (typeof window !== 'undefined') {
            localStorage.setItem(`shift_profile_${profile.id}`, JSON.stringify(updatedProfile));
        }
        setShowActionDropdown(false);
        toast.success("Broadcast successful! 15 matching locums notified.");
    };

    const handleDuplicate = () => {
        setShowActionDropdown(false);
        toast.success(`Shift ${profile.id} cloned successfully! Draft SH-NEW created.`);
    };

    const handleEscalate = () => {
        const newRate = Math.round(profile.rate * 1.1);
        const timelineEntry = {
            date: new Date().toISOString().replace('T', ' ').substring(0, 16),
            user: 'Omar Murphy',
            action: 'Shift escalated',
            details: `Shift escalated to Urgent status. Hourly rate increased by 10% from €${profile.rate} to €${newRate}.`
        };
        const updatedProfile = {
            ...profile,
            status: 'urgent',
            rate: newRate,
            totalPay: newRate * profile.hours,
            timeline: [timelineEntry, ...(profile.timeline || [])]
        };
        setProfile(updatedProfile);
        if (typeof window !== 'undefined') {
            localStorage.setItem(`shift_profile_${profile.id}`, JSON.stringify(updatedProfile));
        }
        setShowActionDropdown(false);
        toast.success("Shift status upgraded to Urgent. Rates increased by 10%!");
    };

    const handleDownloadPDF = () => {
        const summaryText = `
MPLOYUS SHIFT BRIEFING SHEET
-----------------------------------------
Shift ID: ${profile.id}
Status: ${profile.status.toUpperCase()}
Specialty: ${profile.specialty}
Department: ${profile.department}
Grade: ${profile.grade}
Shift Type: ${profile.shiftType}
Date: ${profile.date}
Time: ${profile.startTime} - ${profile.endTime} (${profile.hours} hours)
Hourly Rate: €${profile.rate}
Total Pay: €${profile.totalPay}

FACILITY INFORMATION
-----------------------------------------
Facility: ${profile.facility} (${profile.facilityId})
Location: ${profile.location}
Address: ${profile.address}

FACILITY CONTACT
-----------------------------------------
Name: ${profile.contactPerson?.name}
Role: ${profile.contactPerson?.role}
Phone: ${profile.contactPerson?.phone}
Email: ${profile.contactPerson?.email}

Created Date: ${profile.createdDate || 'N/A'}
Last Modified: ${profile.lastModified || 'N/A'}
-----------------------------------------
Generated on: ${new Date().toLocaleString()}
`;
        const blob = new Blob([summaryText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `shift_briefing_${profile.id}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        setShowActionDropdown(false);
        toast.success("Shift briefing sheet downloaded!");
    };

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete shift ${profile.id}? This action cannot be undone.`)) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem(`shift_profile_${profile.id}`);
            }
            toast.success(`Shift ${profile.id} deleted successfully.`);
            onBack();
        }
        setShowActionDropdown(false);
    };

    const config = statusConfig[profile.status];

    const handleAssignLocum = () => {
        setProfile((prev: any) => ({
            ...prev,
            status: 'filled',
            locum: selectedAssignee,
            locumId: selectedAssignee === 'Sarah Mitchell' ? 'LOC-001' : selectedAssignee === 'James Harrison' ? 'LOC-002' : 'LOC-003',
            timeline: [
                { date: new Date().toISOString().replace('T', ' ').substring(0, 16), user: 'Omar Murphy', action: 'Locum assigned', details: `${selectedAssignee} assigned to shift` },
                ...prev.timeline
            ]
        }));
        setShowAssignModal(false);
        toast.success(`Locum ${selectedAssignee} assigned successfully!`);
    };

    const handleCancelShift = () => {
        if (!cancelReason.trim()) {
            toast.error("Please enter a cancellation reason.");
            return;
        }
        setProfile((prev: any) => ({
            ...prev,
            status: 'cancelled',
            timeline: [
                { date: new Date().toISOString().replace('T', ' ').substring(0, 16), user: 'Omar Murphy', action: 'Shift cancelled', details: `Reason: ${cancelReason}` },
                ...prev.timeline
            ]
        }));
        setShowCancelModal(false);
        toast.success("Shift cancelled successfully.");
    };

    const handleAddNote = () => {
        if (!newNoteContent.trim()) {
            toast.error("Please enter note content.");
            return;
        }
        setProfile((prev: any) => ({
            ...prev,
            notes: [
                { date: new Date().toISOString().split('T')[0], author: 'Omar Murphy', content: newNoteContent },
                ...prev.notes
            ]
        }));
        setNewNoteContent('');
        setShowAddNoteInput(false);
        toast.success("Note added successfully!");
    };

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `shift_${profile.id}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        toast.success("Shift details exported successfully!");
    };

    const tabs = [
        { id: 'details' as const, label: 'Shift Details' },
        { id: 'compliance' as const, label: 'Compliance' },
        { id: 'timeline' as const, label: 'Timeline' },
        { id: 'notes' as const, label: 'Notes' },
    ];

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(amount);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IE', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="p-6 space-y-6">
            {/* Back + Header */}
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors">
                    <ArrowLeft className="w-4 h-4 text-[#6B7280]" />
                </button>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h2 className="text-[#1F2937]">Shift Details</h2>
                        <span className="px-2 py-0.5 rounded text-[11px] border" style={{ backgroundColor: config.bg, color: config.color, borderColor: config.border }}>
                            {config.label}
                        </span>
                    </div>
                    <p className="text-sm text-[#6B7280]">Comprehensive shift information and management</p>
                </div>
                <div className="flex items-center gap-2">
                    {(profile.status === 'open' || profile.status === 'urgent') && (
                        <button
                            onClick={() => setShowAssignModal(true)}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm bg-[#10B981] text-white rounded-lg hover:bg-[#059669]"
                        >
                            <UserPlus className="w-3.5 h-3.5" /> Assign Locum
                        </button>
                    )}
                    <button 
                        onClick={handleOpenEdit}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]"
                    >
                        <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button 
                        onClick={handleExport}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]"
                    >
                        <Download className="w-3.5 h-3.5" /> Export
                    </button>
                    {profile.status !== 'cancelled' && (
                        <button
                            onClick={() => setShowCancelModal(true)}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#DC2626] border border-[#DC2626] rounded-lg hover:bg-[#FEE2E2]"
                        >
                            <Ban className="w-3.5 h-3.5" /> Cancel
                        </button>
                    )}
                    <div className="relative">
                        <button 
                            onClick={() => setShowActionDropdown(!showActionDropdown)}
                            className="p-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors relative"
                        >
                            <MoreHorizontal className="w-4 h-4 text-[#6B7280]" />
                        </button>
                        
                        {showActionDropdown && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowActionDropdown(false)} />
                                <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-20 py-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                                    <div className="px-3 py-1.5 text-xs text-[#9CA3AF] font-semibold uppercase tracking-wider border-b border-[#F3F4F6] mb-1">
                                        Shift Actions
                                    </div>
                                    <button
                                        onClick={handleBroadcast}
                                        className="w-full text-left px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F9FAFB] flex items-center gap-2.5 transition-colors"
                                    >
                                        <Send className="w-4 h-4 text-[#3B82F6]" /> Broadcast to Pool
                                    </button>
                                    <button
                                        onClick={handleDuplicate}
                                        className="w-full text-left px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F9FAFB] flex items-center gap-2.5 transition-colors"
                                    >
                                        <Copy className="w-4 h-4 text-[#10B981]" /> Duplicate Shift
                                    </button>
                                    {profile.status !== 'urgent' && (
                                        <button
                                            onClick={handleEscalate}
                                            className="w-full text-left px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F9FAFB] flex items-center gap-2.5 transition-colors"
                                        >
                                            <TrendingUp className="w-4 h-4 text-[#F59E0B]" /> Escalate to Urgent
                                        </button>
                                    )}
                                    <button
                                        onClick={handleDownloadPDF}
                                        className="w-full text-left px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F9FAFB] flex items-center gap-2.5 transition-colors"
                                    >
                                        <FileText className="w-4 h-4 text-[#7C3AED]" /> Download Briefing (.txt)
                                    </button>
                                    <div className="border-t border-[#F3F4F6] my-1" />
                                    <button
                                        onClick={handleDelete}
                                        className="w-full text-left px-4 py-2.5 text-sm text-[#EF4444] hover:bg-[#FEE2E2] flex items-center gap-2.5 transition-colors font-medium"
                                    >
                                        <Trash2 className="w-4 h-4 text-[#EF4444]" /> Delete Shift
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Header Card */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
                <div className="flex items-start gap-5">
                    <div className="w-20 h-20 bg-[#EFF6FF] rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-10 h-10 text-[#3B82F6]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl text-[#1F2937]" style={{ fontWeight: 700 }}>{profile.specialty}</h3>
                            <span className="text-xs text-[#9CA3AF] bg-[#F3F4F6] px-2 py-0.5 rounded">{profile.id}</span>
                            {profile.status === 'urgent' && (
                                <span className="flex items-center gap-1 text-xs text-[#DC2626] bg-[#FEE2E2] px-2 py-0.5 rounded border border-[#FECACA]">
                                    <AlertTriangle className="w-3 h-3" /> URGENT
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-[#6B7280] mb-3">{profile.description}</p>
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#6B7280]">
                            <span className="flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-[#9CA3AF]" />{profile.facility}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-[#9CA3AF]" />{profile.address}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-[#9CA3AF]" />{formatDate(profile.date)}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-[#9CA3AF]" />{profile.startTime} - {profile.endTime} ({profile.hours}h)
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 flex-shrink-0">
                        <div className="bg-[#F9FAFB] rounded-lg px-4 py-3 text-center min-w-[90px]">
                            <p className="text-lg text-[#10B981]" style={{ fontWeight: 700 }}>{formatCurrency(profile.rate)}/hr</p>
                            <p className="text-[10px] text-[#9CA3AF]">Hourly Rate</p>
                        </div>
                        <div className="bg-[#F9FAFB] rounded-lg px-4 py-3 text-center min-w-[90px]">
                            <p className="text-lg text-[#1F2937]" style={{ fontWeight: 700 }}>{formatCurrency(profile.totalPay)}</p>
                            <p className="text-[10px] text-[#9CA3AF]">Total Pay</p>
                        </div>
                        <div className="bg-[#F9FAFB] rounded-lg px-4 py-3 text-center min-w-[90px]">
                            <p className="text-lg text-[#1F2937]" style={{ fontWeight: 700 }}>{profile.hours}h</p>
                            <p className="text-[10px] text-[#9CA3AF]">Duration</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-[#E5E7EB]">
                <div className="border-b border-[#E5E7EB] px-5 flex gap-1 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-3 px-4 text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-[#10B981] text-[#10B981]' : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'}`}
                            style={{ fontWeight: activeTab === tab.id ? 600 : 400 }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {/* === DETAILS === */}
                    {activeTab === 'details' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                {/* Shift Information */}
                                <div className="space-y-4">
                                    <h4 className="text-sm text-[#1F2937] flex items-center gap-2" style={{ fontWeight: 600 }}>
                                        <Calendar className="w-4 h-4 text-[#3B82F6]" /> Shift Information
                                    </h4>
                                    <div className="bg-[#F9FAFB] rounded-lg p-4 space-y-3">
                                        {[
                                            { label: 'Shift ID', value: profile.id },
                                            { label: 'Specialty', value: profile.specialty },
                                            { label: 'Department', value: profile.department },
                                            { label: 'Grade Required', value: profile.grade },
                                            { label: 'Shift Type', value: profile.shiftType },
                                            { label: 'Date', value: formatDate(profile.date) },
                                            { label: 'Start Time', value: profile.startTime },
                                            { label: 'End Time', value: profile.endTime },
                                            { label: 'Total Hours', value: `${profile.hours} hours` },
                                            { label: 'Hourly Rate', value: formatCurrency(profile.rate) },
                                            { label: 'Total Payment', value: formatCurrency(profile.totalPay) },
                                        ].map(item => (
                                            <div key={item.label} className="flex justify-between items-start">
                                                <span className="text-xs text-[#9CA3AF] min-w-[120px]">{item.label}</span>
                                                <span className="text-xs text-[#1F2937] text-right" style={{ fontWeight: 500 }}>{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Facility Information */}
                                <div className="space-y-4">
                                    <h4 className="text-sm text-[#1F2937] flex items-center gap-2" style={{ fontWeight: 600 }}>
                                        <Building2 className="w-4 h-4 text-[#10B981]" /> Facility Information
                                    </h4>
                                    <div className="bg-[#F0FDF4] rounded-lg p-4 space-y-3">
                                        {[
                                            { label: 'Facility Name', value: profile.facility },
                                            { label: 'Location', value: profile.location },
                                            { label: 'Address', value: profile.address },
                                            { label: 'Facility ID', value: profile.facilityId },
                                        ].map(item => (
                                            <div key={item.label} className="flex justify-between items-start">
                                                <span className="text-xs text-[#065F46]">{item.label}</span>
                                                <span className="text-xs text-[#065F46] text-right" style={{ fontWeight: 500 }}>{item.value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <h4 className="text-sm text-[#1F2937] flex items-center gap-2 pt-2" style={{ fontWeight: 600 }}>
                                        <Users className="w-4 h-4 text-[#8B5CF6]" /> Facility Contact
                                    </h4>
                                    <div className="bg-[#EDE9FE] rounded-lg p-4 space-y-2">
                                        <p className="text-sm text-[#5B21B6]" style={{ fontWeight: 600 }}>{profile.contactPerson.name}</p>
                                        <p className="text-xs text-[#7C3AED]">{profile.contactPerson.role}</p>
                                        <div className="flex items-center gap-1.5 text-xs text-[#6D28D9]">
                                            <Phone className="w-3 h-3" />{profile.contactPerson.phone}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-[#6D28D9]">
                                            <Mail className="w-3 h-3" />{profile.contactPerson.email}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Assigned Locum */}
                            {profile.locum && (
                                <div>
                                    <h4 className="text-sm text-[#1F2937] flex items-center gap-2 mb-3" style={{ fontWeight: 600 }}>
                                        <Users className="w-4 h-4 text-[#10B981]" /> Assigned Locum
                                    </h4>
                                    <div className="border border-[#E5E7EB] rounded-lg p-4 hover:bg-[#F9FAFB] transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-[#ECFDF5] rounded-full flex items-center justify-center">
                                                    <Users className="w-6 h-6 text-[#10B981]" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>{profile.locum}</p>
                                                    <p className="text-xs text-[#6B7280]">{profile.grade} · ID: {profile.locumId}</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => onViewLocumProfile?.(profile.locumId)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#10B981] border border-[#10B981] rounded-lg hover:bg-[#ECFDF5]"
                                            >
                                                View Profile
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Admin Info */}
                            <div>
                                <h4 className="text-sm text-[#1F2937] flex items-center gap-2 mb-3" style={{ fontWeight: 600 }}>
                                    <Activity className="w-4 h-4 text-[#6B7280]" /> Administrative Information
                                </h4>
                                <div className="bg-[#F9FAFB] rounded-lg p-4 space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-[#9CA3AF]">Created By</span>
                                        <span className="text-[#1F2937]" style={{ fontWeight: 500 }}>{profile.createdBy}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-[#9CA3AF]">Created Date</span>
                                        <span className="text-[#1F2937]" style={{ fontWeight: 500 }}>{formatDate(profile.createdDate)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-[#9CA3AF]">Last Modified</span>
                                        <span className="text-[#1F2937]" style={{ fontWeight: 500 }}>{formatDate(profile.lastModified)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* === COMPLIANCE === */}
                    {activeTab === 'compliance' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>Required Compliance Documents</h4>
                                <p className="text-xs text-[#9CA3AF]">
                                    {profile.requiredCompliance.filter((c: any) => c.status === 'verified').length} of {profile.requiredCompliance.length} verified
                                </p>
                            </div>
                            <div className="space-y-2">
                                {profile.requiredCompliance.map((comp: any, idx: number) => (
                                    <div key={idx} className="border border-[#E5E7EB] rounded-lg p-4 hover:bg-[#F9FAFB]">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-3">
                                                {comp.status === 'verified' ? (
                                                    <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                                                ) : comp.status === 'required' ? (
                                                    <AlertTriangle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                                                ) : (
                                                    <ShieldCheck className="w-5 h-5 text-[#6B7280] flex-shrink-0 mt-0.5" />
                                                )}
                                                <div>
                                                    <p className="text-sm text-[#1F2937]" style={{ fontWeight: 500 }}>{comp.name}</p>
                                                    {comp.expiryDate && (
                                                        <p className="text-xs text-[#6B7280] mt-0.5">Expires: {formatDate(comp.expiryDate)}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded text-[11px] border ${comp.status === 'verified'
                                                    ? 'bg-[#D1FAE5] text-[#059669] border-[#A7F3D0]'
                                                    : comp.status === 'required'
                                                        ? 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]'
                                                        : 'bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]'
                                                }`}>
                                                {comp.status === 'verified' ? 'Verified' : comp.status === 'required' ? 'Required' : 'Preferred'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* === TIMELINE === */}
                    {activeTab === 'timeline' && (
                        <div className="space-y-4">
                            <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>Shift Timeline</h4>
                            <div className="space-y-1">
                                {profile.timeline.map((event: any, idx: number) => (
                                    <div key={idx} className="flex gap-4 pb-4 border-l-2 border-[#E5E7EB] pl-4 ml-2 last:border-l-0">
                                        <div className="relative">
                                            <div className="absolute -left-[22px] w-3 h-3 bg-[#10B981] rounded-full border-2 border-white" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-sm text-[#1F2937]" style={{ fontWeight: 500 }}>{event.action}</p>
                                                <span className="text-xs text-[#9CA3AF]">{event.date}</span>
                                            </div>
                                            <p className="text-xs text-[#6B7280]">{event.details}</p>
                                            <p className="text-xs text-[#9CA3AF] mt-0.5">by {event.user}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* === NOTES === */}
                    {activeTab === 'notes' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>Shift Notes</h4>
                                <button 
                                    onClick={() => setShowAddNoteInput(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#10B981] border border-[#10B981] rounded-lg hover:bg-[#ECFDF5]"
                                >
                                    <MessageSquare className="w-3.5 h-3.5" /> Add Note
                                </button>
                            </div>
                            
                            {showAddNoteInput && (
                                <div className="border border-[#E5E7EB] rounded-lg p-4 bg-[#F9FAFB] space-y-3">
                                    <textarea
                                        value={newNoteContent}
                                        onChange={e => setNewNoteContent(e.target.value)}
                                        placeholder="Type your note here..."
                                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                        rows={3}
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => setShowAddNoteInput(false)}
                                            className="px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-xs text-[#6B7280] hover:bg-[#F3F4F6]"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={handleAddNote}
                                            className="px-3 py-1.5 bg-[#10B981] text-white rounded-lg text-xs hover:bg-[#059669]"
                                        >
                                            Save Note
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3">
                                {profile.notes.map((note: any, idx: number) => (
                                    <div key={idx} className="border border-[#E5E7EB] rounded-lg p-4 bg-[#FFFBEB]">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <p className="text-sm text-[#1F2937]" style={{ fontWeight: 500 }}>{note.author}</p>
                                                <p className="text-xs text-[#9CA3AF]">{formatDate(note.date)}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-[#6B7280]">{note.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Assign Shift Modal */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
                    <div className="bg-white rounded-xl w-full max-w-lg">
                        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
                            <h3 className="text-[#1F2937]" style={{ fontWeight: 600 }}>Assign Locum to Shift</h3>
                            <button onClick={() => setShowAssignModal(false)} className="p-2 hover:bg-[#F3F4F6] rounded-lg">
                                <X className="w-5 h-5 text-[#6B7280]" />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm text-[#1F2937] mb-1" style={{ fontWeight: 500 }}>Select Locum</label>
                                <select 
                                    value={selectedAssignee}
                                    onChange={e => setSelectedAssignee(e.target.value)}
                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                >
                                    <option value="Sarah Mitchell">Sarah Mitchell - General Surgery</option>
                                    <option value="James Harrison">James Harrison - Cardiology</option>
                                    <option value="Emily Chen">Emily Chen - Anesthesiology</option>
                                </select>
                            </div>
                            <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg p-3">
                                <p className="text-xs text-[#1E40AF]">
                                    <span style={{ fontWeight: 600 }}>Note:</span> All compliance requirements will be verified before final confirmation.
                                </p>
                            </div>
                        </div>
                        <div className="p-5 border-t border-[#E5E7EB] flex justify-end gap-2">
                            <button onClick={() => setShowAssignModal(false)} className="px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg text-sm hover:bg-[#F9FAFB]">
                                Cancel
                            </button>
                            <button 
                                onClick={handleAssignLocum}
                                className="px-4 py-2 bg-[#10B981] text-white rounded-lg text-sm hover:bg-[#059669]"
                            >
                                Assign Locum
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Shift Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
                    <div className="bg-white rounded-xl w-full max-w-lg">
                        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
                            <h3 className="text-[#1F2937]" style={{ fontWeight: 600 }}>Cancel Shift</h3>
                            <button onClick={() => setShowCancelModal(false)} className="p-2 hover:bg-[#F3F4F6] rounded-lg">
                                <X className="w-5 h-5 text-[#6B7280]" />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-lg p-3">
                                <p className="text-xs text-[#92400E]">
                                    <span style={{ fontWeight: 600 }}>Warning:</span> This will cancel the shift. {profile.locum ? 'The assigned locum will be notified.' : 'This action cannot be undone.'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm text-[#1F2937] mb-1" style={{ fontWeight: 500 }}>Reason for Cancellation <span className="text-[#EF4444]">*</span></label>
                                <textarea
                                    value={cancelReason}
                                    onChange={e => setCancelReason(e.target.value)}
                                    placeholder="Please provide a reason for cancelling this shift..."
                                    rows={4}
                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                />
                            </div>
                        </div>
                        <div className="p-5 border-t border-[#E5E7EB] flex justify-end gap-2">
                            <button onClick={() => setShowCancelModal(false)} className="px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg text-sm hover:bg-[#F9FAFB]">
                                Keep Shift
                            </button>
                            <button 
                                onClick={handleCancelShift}
                                className="px-4 py-2 bg-[#DC2626] text-white rounded-lg text-sm hover:bg-[#B91C1C]"
                            >
                                Cancel Shift
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Shift Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between">
                            <div>
                                <h3 className="text-xl text-[#1F2937]" style={{ fontWeight: 700 }}>Edit Shift Details</h3>
                                <p className="text-xs text-[#6B7280] mt-0.5">Update all shift attributes, facility and contact details</p>
                            </div>
                            <button 
                                onClick={() => setShowEditModal(false)} 
                                className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="flex border-b border-[#E5E7EB] bg-[#F9FAFB] px-6 gap-2">
                            <button
                                type="button"
                                onClick={() => setModalTab('shift')}
                                className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
                                    modalTab === 'shift'
                                        ? 'border-[#10B981] text-[#10B981]'
                                        : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'
                                }`}
                            >
                                1. Shift Details
                            </button>
                            <button
                                type="button"
                                onClick={() => setModalTab('facility')}
                                className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
                                    modalTab === 'facility'
                                        ? 'border-[#10B981] text-[#10B981]'
                                        : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'
                                }`}
                            >
                                2. Facility & Contacts
                            </button>
                        </div>

                        {/* Modal Body / Form */}
                        <form onSubmit={handleEditSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* TAB 1: SHIFT DETAILS */}
                            {modalTab === 'shift' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-semibold uppercase tracking-wider">Specialty</label>
                                            <input 
                                                type="text" 
                                                value={editForm.specialty}
                                                onChange={e => setEditForm(prev => ({ ...prev, specialty: e.target.value }))}
                                                required
                                                className="w-full px-3.5 py-2.5 border border-[#E5E7EB] rounded-lg text-sm text-[#1F2937] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-semibold uppercase tracking-wider">Department</label>
                                            <input 
                                                type="text" 
                                                value={editForm.department}
                                                onChange={e => setEditForm(prev => ({ ...prev, department: e.target.value }))}
                                                required
                                                className="w-full px-3.5 py-2.5 border border-[#E5E7EB] rounded-lg text-sm text-[#1F2937] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-semibold uppercase tracking-wider">Grade Required</label>
                                            <input 
                                                type="text" 
                                                value={editForm.grade}
                                                onChange={e => setEditForm(prev => ({ ...prev, grade: e.target.value }))}
                                                required
                                                className="w-full px-3.5 py-2.5 border border-[#E5E7EB] rounded-lg text-sm text-[#1F2937] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-semibold uppercase tracking-wider">Shift Type</label>
                                            <input 
                                                type="text" 
                                                value={editForm.shiftType}
                                                onChange={e => setEditForm(prev => ({ ...prev, shiftType: e.target.value }))}
                                                required
                                                className="w-full px-3.5 py-2.5 border border-[#E5E7EB] rounded-lg text-sm text-[#1F2937] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-semibold uppercase tracking-wider">Date</label>
                                            <input 
                                                type="date" 
                                                value={editForm.date}
                                                onChange={e => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                                                required
                                                className="w-full px-3.5 py-2.5 border border-[#E5E7EB] rounded-lg text-sm text-[#1F2937] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-semibold uppercase tracking-wider">Start Time</label>
                                            <input 
                                                type="text" 
                                                value={editForm.startTime}
                                                onChange={e => setEditForm(prev => ({ ...prev, startTime: e.target.value }))}
                                                required
                                                placeholder="e.g. 08:00"
                                                className="w-full px-3.5 py-2.5 border border-[#E5E7EB] rounded-lg text-sm text-[#1F2937] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-semibold uppercase tracking-wider">End Time</label>
                                            <input 
                                                type="text" 
                                                value={editForm.endTime}
                                                onChange={e => setEditForm(prev => ({ ...prev, endTime: e.target.value }))}
                                                required
                                                placeholder="e.g. 16:00"
                                                className="w-full px-3.5 py-2.5 border border-[#E5E7EB] rounded-lg text-sm text-[#1F2937] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-semibold uppercase tracking-wider">Total Hours</label>
                                            <input 
                                                type="number" 
                                                value={editForm.hours}
                                                onChange={e => setEditForm(prev => ({ ...prev, hours: Number(e.target.value) }))}
                                                required
                                                className="w-full px-3.5 py-2.5 border border-[#E5E7EB] rounded-lg text-sm text-[#1F2937] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-semibold uppercase tracking-wider">Hourly Rate (€)</label>
                                            <input 
                                                type="number" 
                                                value={editForm.rate}
                                                onChange={e => setEditForm(prev => ({ ...prev, rate: Number(e.target.value) }))}
                                                required
                                                className="w-full px-3.5 py-2.5 border border-[#E5E7EB] rounded-lg text-sm text-[#1F2937] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs text-[#4B5563] mb-1 font-semibold uppercase tracking-wider">Description</label>
                                        <textarea 
                                            value={editForm.description}
                                            onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                            rows={3}
                                            className="w-full px-3.5 py-2.5 border border-[#E5E7EB] rounded-lg text-sm text-[#1F2937] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: FACILITY & CONTACTS */}
                            {modalTab === 'facility' && (
                                <div className="space-y-4">
                                    <div className="bg-[#F0FDF4] p-4 rounded-xl space-y-4 border border-[#DCFCE7]">
                                        <h4 className="text-sm font-semibold text-[#166534] flex items-center gap-1.5">
                                            <Building2 className="w-4 h-4" /> Facility Details
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-[#065F46] mb-1 font-semibold uppercase tracking-wider">Facility Name</label>
                                                <input 
                                                    type="text" 
                                                    value={editForm.facility}
                                                    onChange={e => setEditForm(prev => ({ ...prev, facility: e.target.value }))}
                                                    required
                                                    className="w-full px-3.5 py-2.5 border border-[#A7F3D0] rounded-lg text-sm text-[#1F2937] bg-white focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#065F46] mb-1 font-semibold uppercase tracking-wider">Facility ID</label>
                                                <input 
                                                    type="text" 
                                                    value={editForm.facilityId}
                                                    onChange={e => setEditForm(prev => ({ ...prev, facilityId: e.target.value }))}
                                                    required
                                                    className="w-full px-3.5 py-2.5 border border-[#A7F3D0] rounded-lg text-sm text-[#1F2937] bg-white focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-[#065F46] mb-1 font-semibold uppercase tracking-wider">Location (Region/City)</label>
                                                <input 
                                                    type="text" 
                                                    value={editForm.location}
                                                    onChange={e => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                                                    required
                                                    className="w-full px-3.5 py-2.5 border border-[#A7F3D0] rounded-lg text-sm text-[#1F2937] bg-white focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#065F46] mb-1 font-semibold uppercase tracking-wider">Full Address</label>
                                                <input 
                                                    type="text" 
                                                    value={editForm.address}
                                                    onChange={e => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                                                    required
                                                    className="w-full px-3.5 py-2.5 border border-[#A7F3D0] rounded-lg text-sm text-[#1F2937] bg-white focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-[#F5F3FF] p-4 rounded-xl space-y-4 border border-[#EDE9FE]">
                                        <h4 className="text-sm font-semibold text-[#5B21B6] flex items-center gap-1.5">
                                            <Users className="w-4 h-4" /> Contact Person
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-[#5B21B6] mb-1 font-semibold uppercase tracking-wider">Contact Name</label>
                                                <input 
                                                    type="text" 
                                                    value={editForm.contactName}
                                                    onChange={e => setEditForm(prev => ({ ...prev, contactName: e.target.value }))}
                                                    required
                                                    className="w-full px-3.5 py-2.5 border border-[#DDD6FE] rounded-lg text-sm text-[#1F2937] bg-white focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#5B21B6] mb-1 font-semibold uppercase tracking-wider">Contact Role</label>
                                                <input 
                                                    type="text" 
                                                    value={editForm.contactRole}
                                                    onChange={e => setEditForm(prev => ({ ...prev, contactRole: e.target.value }))}
                                                    required
                                                    className="w-full px-3.5 py-2.5 border border-[#DDD6FE] rounded-lg text-sm text-[#1F2937] bg-white focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-[#5B21B6] mb-1 font-semibold uppercase tracking-wider">Contact Phone</label>
                                                <input 
                                                    type="text" 
                                                    value={editForm.contactPhone}
                                                    onChange={e => setEditForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                                                    required
                                                    className="w-full px-3.5 py-2.5 border border-[#DDD6FE] rounded-lg text-sm text-[#1F2937] bg-white focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#5B21B6] mb-1 font-semibold uppercase tracking-wider">Contact Email</label>
                                                <input 
                                                    type="email" 
                                                    value={editForm.contactEmail}
                                                    onChange={e => setEditForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                                                    required
                                                    className="w-full px-3.5 py-2.5 border border-[#DDD6FE] rounded-lg text-sm text-[#1F2937] bg-white focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Modal Footer */}
                            <div className="pt-4 border-t border-[#E5E7EB] flex justify-end gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setShowEditModal(false)} 
                                    className="px-5 py-2.5 border border-[#E5E7EB] text-[#4B5563] rounded-lg text-sm hover:bg-[#F9FAFB] font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-5 py-2.5 bg-[#10B981] text-white rounded-lg text-sm hover:bg-[#059669] font-medium shadow-sm transition-all"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
