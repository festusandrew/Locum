import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { AddNoteModal } from './ui/AddNoteModal';
import {
    ArrowLeft, CheckCircle, XCircle, AlertTriangle, Download, Upload,
    FileText, Calendar, User, Mail, Phone, MapPin, Briefcase, Clock,
    Edit, MoreHorizontal, Activity, MessageSquare, Shield, FileCheck,
    X, CheckSquare, Archive, RotateCcw
} from 'lucide-react';

interface ComplianceDetailPageProps {
    locumId: string;
    onBack: () => void;
}

const complianceProfiles: Record<string, any> = {
    '#GS234FS': {
        id: '#GS234FS',
        locumName: 'Sarah Mitchell',
        email: 'sarah.mitchell@email.ie',
        phone: '+353 87 123 4567',
        specialty: 'General Surgery',
        grade: 'Consultant',
        location: 'Dublin',
        imcNumber: 'IMC-12345',
        overallCompliance: 100,
        lastReviewed: '2026-02-05',
        nextReview: '2026-08-05',
        documents: {
            medicalLicense: {
                name: 'Medical Council Registration',
                status: 'valid',
                expiryDate: '2026-03-15',
                uploadedDate: '2023-03-15',
                uploadedBy: 'Omar Murphy',
                fileSize: '1.2 MB',
                fileName: 'IMC_Certificate_Mitchell.pdf',
                registrationNumber: 'IMC-12345',
                issuingAuthority: 'Medical Council of Ireland',
                notes: 'Full registration with specialist division',
            },
            garda: {
                name: 'Garda Vetting',
                status: 'valid',
                expiryDate: '2025-08-22',
                uploadedDate: '2023-08-22',
                uploadedBy: 'Lisa Keane',
                fileSize: '856 KB',
                fileName: 'Garda_Vetting_Mitchell.pdf',
                registrationNumber: 'GV-2023-8822',
                issuingAuthority: 'An Garda Síochána',
                notes: 'Clear vetting with no disclosures',
            },
            indemnityInsurance: {
                name: 'Professional Indemnity Insurance',
                status: 'valid',
                expiryDate: '2025-12-31',
                uploadedDate: '2023-12-31',
                uploadedBy: 'Omar Murphy',
                fileSize: '2.1 MB',
                fileName: 'Indemnity_Insurance_2026.pdf',
                registrationNumber: 'POL-789456123',
                issuingAuthority: 'Medical Protection Society',
                notes: 'Cover: €10,000,000 per claim',
            },
            cprTraining: {
                name: 'BLS/CPR Certification',
                status: 'valid',
                expiryDate: '2025-06-10',
                uploadedDate: '2023-06-10',
                uploadedBy: 'Lisa Keane',
                fileSize: '654 KB',
                fileName: 'BLS_Certificate_Mitchell.pdf',
                registrationNumber: 'BLS-2023-456',
                issuingAuthority: 'Irish Heart Foundation',
                notes: 'Advanced life support certified',
            },
        },
        additionalDocs: [
            {
                name: 'Occupational Health Clearance',
                status: 'valid',
                expiryDate: '2026-01-20',
                uploadedDate: '2025-01-20',
                uploadedBy: 'Omar Murphy',
                fileSize: '445 KB',
                fileName: 'OH_Clearance_2026.pdf',
            },
            {
                name: 'Hepatitis B Immunity',
                status: 'valid',
                expiryDate: '2027-03-15',
                uploadedDate: '2024-03-15',
                uploadedBy: 'Lisa Keane',
                fileSize: '198 KB',
                fileName: 'HepB_Certificate.pdf',
            },
        ],
        timeline: [
            { date: '2026-02-05 10:30', user: 'Lisa Keane', action: 'Compliance review completed', details: 'All documents verified - 100% compliant' },
            { date: '2025-12-31 14:20', user: 'Omar Murphy', action: 'Document uploaded', details: 'Professional Indemnity Insurance renewed' },
            { date: '2025-01-20 09:15', user: 'Omar Murphy', action: 'Document uploaded', details: 'Occupational Health Clearance added' },
            { date: '2023-08-22 16:45', user: 'Lisa Keane', action: 'Document uploaded', details: 'Garda Vetting completed' },
        ],
        notes: [
            { date: '2026-02-05', author: 'Lisa Keane', content: 'All compliance documents verified and up to date. No action required. Next review scheduled for August 2026.' },
        ],
    },
    '#EC0125D': {
        id: '#EC0125D',
        locumName: 'James Harrison',
        email: 'james.harrison@email.ie',
        phone: '+353 86 234 5678',
        specialty: 'Cardiology',
        grade: 'Senior Registrar',
        location: 'Cork',
        imcNumber: 'IMC-67890',
        overallCompliance: 75,
        lastReviewed: '2026-01-28',
        nextReview: '2026-07-28',
        documents: {
            medicalLicense: {
                name: 'Medical Council Registration',
                status: 'valid',
                expiryDate: '2025-11-30',
                uploadedDate: '2023-11-30',
                uploadedBy: 'Omar Murphy',
                fileSize: '1.4 MB',
                fileName: 'IMC_Certificate_Harrison.pdf',
                registrationNumber: 'IMC-67890',
                issuingAuthority: 'Medical Council of Ireland',
                notes: 'Specialist registration in cardiology',
            },
            garda: {
                name: 'Garda Vetting',
                status: 'expiring',
                expiryDate: '2025-01-15',
                uploadedDate: '2023-01-15',
                uploadedBy: 'Lisa Keane',
                fileSize: '722 KB',
                fileName: 'Garda_Vetting_Harrison.pdf',
                registrationNumber: 'GV-2023-0115',
                issuingAuthority: 'An Garda Síochána',
                notes: 'URGENT: Expires in 5 days - renewal in progress',
            },
            indemnityInsurance: {
                name: 'Professional Indemnity Insurance',
                status: 'valid',
                expiryDate: '2026-02-28',
                uploadedDate: '2023-02-28',
                uploadedBy: 'Omar Murphy',
                fileSize: '1.9 MB',
                fileName: 'Indemnity_Insurance_Harrison.pdf',
                registrationNumber: 'POL-456789012',
                issuingAuthority: 'Medical Defence Union',
                notes: 'Cover: €10,000,000 per claim',
            },
            cprTraining: {
                name: 'BLS/CPR Certification',
                status: 'valid',
                expiryDate: '2025-09-05',
                uploadedDate: '2023-09-05',
                uploadedBy: 'Lisa Keane',
                fileSize: '589 KB',
                fileName: 'BLS_Certificate_Harrison.pdf',
                registrationNumber: 'BLS-2023-789',
                issuingAuthority: 'Irish Heart Foundation',
                notes: 'ACLS certified',
            },
        },
        additionalDocs: [],
        timeline: [
            { date: '2026-02-08 15:45', user: 'Lisa Keane', action: 'Reminder sent', details: 'Garda Vetting renewal reminder sent to locum' },
            { date: '2026-01-28 11:20', user: 'Omar Murphy', action: 'Compliance review completed', details: 'Action required: Garda Vetting expiring soon' },
            { date: '2023-11-30 09:30', user: 'Omar Murphy', action: 'Document uploaded', details: 'Medical Council Registration added' },
        ],
        notes: [
            { date: '2026-02-08', author: 'Lisa Keane', content: 'URGENT: Garda Vetting expires 15 Jan 2025. Renewal application submitted. Awaiting updated certificate.' },
        ],
    },
};

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: any }> = {
    valid: { label: 'Valid', color: '#059669', bg: '#D1FAE5', border: '#A7F3D0', icon: CheckCircle },
    expiring: { label: 'Expiring Soon', color: '#D97706', bg: '#FEF3C7', border: '#FDE68A', icon: Clock },
    expired: { label: 'Expired', color: '#DC2626', bg: '#FEE2E2', border: '#FECACA', icon: XCircle },
};

function getComplianceProfile(id: string) {
    if (complianceProfiles[id]) return complianceProfiles[id];
    return complianceProfiles['#GS234FS'];
}

export function ComplianceDetailPage({ locumId, onBack }: ComplianceDetailPageProps) {
    const [showArchived, setShowArchived] = useState(false);
    const [noteToEdit, setNoteToEdit] = useState<any>(null);
    const [profile, setProfile] = useState(() => {
        const p = getComplianceProfile(locumId);
        if (p.notes) {
            p.notes = p.notes.map((n: any, idx: number) => ({
                id: n.id || `note-${idx}-${n.date}-${Math.random().toString(36).substring(2, 6)}`,
                ...n
            }));
        }
        return p;
    });
    const [showAddNoteModal, setShowAddNoteModal] = useState(false);

    useEffect(() => {
        const p = getComplianceProfile(locumId);
        if (p.notes) {
            p.notes = p.notes.map((n: any, idx: number) => ({
                id: n.id || `note-${idx}-${n.date}-${Math.random().toString(36).substring(2, 6)}`,
                ...n
            }));
        }
        setProfile(p);
    }, [locumId]);

    const [activeTab, setActiveTab] = useState<'documents' | 'timeline' | 'notes'>('documents');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadDocType, setUploadDocType] = useState('');
    const [uploadExpiryDate, setUploadExpiryDate] = useState('');
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileSelectClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            toast.success(`Selected file: ${file.name}`);
        }
    };

    const handleAddComplianceNote = (newNote: any) => {
        let updatedNotes;
        const noteIndex = profile.notes.findIndex((n: any) => n.id === newNote.id);
        if (noteIndex > -1) {
            updatedNotes = profile.notes.map((n: any) => n.id === newNote.id ? newNote : n);
            toast.success('Note updated successfully');
        } else {
            updatedNotes = [newNote, ...profile.notes];
            toast.success('Note added successfully');
        }
        const updatedProfile = {
            ...profile,
            notes: updatedNotes
        };
        setProfile(updatedProfile);
        complianceProfiles[profile.id] = updatedProfile;
        setNoteToEdit(null);
    };

    const handleArchiveComplianceNote = (noteId: string) => {
        const updatedNotes = profile.notes.map((n: any) => {
            if (n.id === noteId) {
                return { ...n, isArchived: !n.isArchived };
            }
            return n;
        });
        const updatedProfile = {
            ...profile,
            notes: updatedNotes
        };
        setProfile(updatedProfile);
        complianceProfiles[profile.id] = updatedProfile;
        const note = updatedNotes.find((n: any) => n.id === noteId);
        toast.success(note?.isArchived ? 'Note archived successfully' : 'Note restored successfully');
    };

    const handleTriggerEditNote = (note: any) => {
        setNoteToEdit(note);
        setShowAddNoteModal(true);
    };

    const handleUploadSubmit = () => {
        if (!uploadDocType || !uploadExpiryDate || !selectedFile) {
            toast.error("Please fill in all fields and select a file.");
            return;
        }
        toast.success(`Successfully uploaded ${selectedFile.name} for locum's compliance profile!`);
        setShowUploadModal(false);
        setSelectedFile(null);
        setUploadDocType('');
        setUploadExpiryDate('');
    };

    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleExportCSV = () => {
        const escapeCSVValue = (val: any) => {
            if (val === undefined || val === null) return "";
            let str = String(val);
            if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };

        let csvContent = "";

        // 1. Report Title & Header
        csvContent += "LOCUM COMPLIANCE REPORT\n\n";

        // 2. Personal & General Info
        csvContent += "GENERAL INFORMATION\n";
        csvContent += "Locum ID,Full Name,Email,Phone,Specialty,Grade,Location,IMC Number,Overall Compliance\n";
        csvContent += [
            escapeCSVValue(profile.id),
            escapeCSVValue(profile.locumName),
            escapeCSVValue(profile.email),
            escapeCSVValue(profile.phone),
            escapeCSVValue(profile.specialty),
            escapeCSVValue(profile.grade),
            escapeCSVValue(profile.location),
            escapeCSVValue(profile.imcNumber),
            escapeCSVValue(`${profile.overallCompliance}%`)
        ].join(",") + "\n\n";

        // 3. Document Registry
        csvContent += "COMPLIANCE DOCUMENTS REGISTRY\n";
        csvContent += "Document Name,Status,Expiry Date,Uploaded Date,Uploaded By,File Name,File Size,Registration Number,Issuing Authority,Notes\n";
        
        allDocuments.forEach((doc: any) => {
            csvContent += [
                escapeCSVValue(doc.name),
                escapeCSVValue(doc.status),
                escapeCSVValue(doc.expiryDate),
                escapeCSVValue(doc.uploadedDate),
                escapeCSVValue(doc.uploadedBy),
                escapeCSVValue(doc.fileName),
                escapeCSVValue(doc.fileSize),
                escapeCSVValue(doc.registrationNumber || "N/A"),
                escapeCSVValue(doc.issuingAuthority || "N/A"),
                escapeCSVValue(doc.notes || "N/A")
            ].join(",") + "\n";
        });
        csvContent += "\n";

        // 4. Timeline
        csvContent += "COMPLIANCE TIMELINE EVENTS\n";
        csvContent += "Date,User,Action,Details\n";
        profile.timeline.forEach((event: any) => {
            csvContent += [
                escapeCSVValue(event.date),
                escapeCSVValue(event.user),
                escapeCSVValue(event.action),
                escapeCSVValue(event.details)
            ].join(",") + "\n";
        });
        csvContent += "\n";

        // 5. Notes
        csvContent += "COMPLIANCE REVIEW NOTES\n";
        csvContent += "Date,Author,Note Content\n";
        profile.notes.forEach((note: any) => {
            csvContent += [
                escapeCSVValue(note.date),
                escapeCSVValue(note.author),
                escapeCSVValue(note.content)
            ].join(",") + "\n";
        });

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Compliance_Report_${profile.id.replace('#', '')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Compliance report exported successfully as CSV!");
        setShowDropdown(false);
    };

    const tabs = [
        { id: 'documents' as const, label: 'Compliance Documents' },
        { id: 'timeline' as const, label: 'Timeline' },
        { id: 'notes' as const, label: 'Notes' },
    ];

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const getDaysUntilExpiry = (expiryDate: string) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = expiry.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const allDocuments = [
        ...Object.entries(profile.documents).map(([key, doc]: [string, any]) => ({ ...doc, key })),
        ...profile.additionalDocs.map((doc: any, idx: number) => ({ ...doc, key: `additional-${idx}` })),
    ];

    const validDocs = allDocuments.filter((doc: any) => doc.status === 'valid').length;
    const expiringDocs = allDocuments.filter((doc: any) => doc.status === 'expiring').length;
    const expiredDocs = allDocuments.filter((doc: any) => doc.status === 'expired').length;

    return (
        <div className="p-6 space-y-6">
            {/* Back + Header */}
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors">
                    <ArrowLeft className="w-4 h-4 text-[#6B7280]" />
                </button>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h2 className="text-[#1F2937]">Compliance Profile</h2>
                        <span className={`px-2 py-0.5 rounded text-[11px] border ${profile.overallCompliance === 100
                                ? 'bg-[#D1FAE5] text-[#059669] border-[#A7F3D0]'
                                : profile.overallCompliance >= 75
                                    ? 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]'
                                    : 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]'
                            }`}>
                            {profile.overallCompliance}% Compliant
                        </span>
                    </div>
                    <p className="text-sm text-[#6B7280]">Complete compliance documentation and verification status</p>
                </div>
                <div className="flex items-center gap-2 relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors"
                    >
                        <Upload className="w-3.5 h-3.5" /> Upload Document
                    </button>
                    <button 
                        onClick={handleExportCSV}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
                    >
                        <Download className="w-3.5 h-3.5" /> Export Report
                    </button>
                    <button 
                        onClick={() => setShowDropdown(!showDropdown)}
                        className={`p-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-all ${showDropdown ? 'bg-[#F3F4F6] text-[#1F2937]' : ''}`}
                    >
                        <MoreHorizontal className="w-4 h-4 text-[#6B7280]" />
                    </button>

                    {showDropdown && (
                        <div className="absolute right-0 top-full mt-1 bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-50 w-48 py-1">
                            <button
                                onClick={handleExportCSV}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#1F2937] hover:bg-[#F9FAFB] text-left transition-colors"
                            >
                                <Download className="w-4 h-4 text-[#6B7280]" />
                                Export as CSV
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Header Card */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
                <div className="flex items-start gap-5">
                    <div className="w-20 h-20 bg-[#EFF6FF] rounded-2xl flex items-center justify-center flex-shrink-0 text-3xl">
                        👨‍⚕️
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl text-[#1F2937]" style={{ fontWeight: 700 }}>{profile.locumName}</h3>
                            <span className="text-xs text-[#9CA3AF] bg-[#F3F4F6] px-2 py-0.5 rounded">{profile.id}</span>
                        </div>
                        <p className="text-sm text-[#6B7280] mb-3">{profile.specialty} · {profile.grade} · IMC: {profile.imcNumber}</p>
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#6B7280]">
                            <span className="flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-[#9CA3AF]" />{profile.email}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-[#9CA3AF]" />{profile.phone}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-[#9CA3AF]" />{profile.location}
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 flex-shrink-0">
                        <div className="bg-[#ECFDF5] rounded-lg px-4 py-3 text-center min-w-[90px]">
                            <p className="text-lg text-[#10B981]" style={{ fontWeight: 700 }}>{validDocs}</p>
                            <p className="text-[10px] text-[#065F46]">Valid</p>
                        </div>
                        <div className="bg-[#FFFBEB] rounded-lg px-4 py-3 text-center min-w-[90px]">
                            <p className="text-lg text-[#F59E0B]" style={{ fontWeight: 700 }}>{expiringDocs}</p>
                            <p className="text-[10px] text-[#92400E]">Expiring</p>
                        </div>
                        <div className="bg-[#FEF2F2] rounded-lg px-4 py-3 text-center min-w-[90px]">
                            <p className="text-lg text-[#DC2626]" style={{ fontWeight: 700 }}>{expiredDocs}</p>
                            <p className="text-[10px] text-[#991B1B]">Expired</p>
                        </div>
                    </div>
                </div>

                {/* Review Info */}
                <div className="mt-4 pt-4 border-t border-[#E5E7EB] grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <CheckSquare className="w-4 h-4 text-[#10B981]" />
                        <div>
                            <p className="text-xs text-[#9CA3AF]">Last Reviewed</p>
                            <p className="text-sm text-[#1F2937]" style={{ fontWeight: 500 }}>{formatDate(profile.lastReviewed)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#3B82F6]" />
                        <div>
                            <p className="text-xs text-[#9CA3AF]">Next Review Due</p>
                            <p className="text-sm text-[#1F2937]" style={{ fontWeight: 500 }}>{formatDate(profile.nextReview)}</p>
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
                    {/* === DOCUMENTS === */}
                    {activeTab === 'documents' && (
                        <div className="space-y-6">
                            {/* Core Compliance Documents */}
                            <div>
                                <h4 className="text-sm text-[#1F2937] mb-3" style={{ fontWeight: 600 }}>Core Compliance Requirements</h4>
                                <div className="space-y-3">
                                    {Object.entries(profile.documents).map(([key, doc]: [string, any]) => {
                                        const config = statusConfig[doc.status];
                                        const Icon = config.icon;
                                        const daysLeft = getDaysUntilExpiry(doc.expiryDate);

                                        return (
                                            <div key={key} className={`border rounded-lg p-4 ${doc.status === 'valid' ? 'border-[#A7F3D0] bg-[#ECFDF5]' :
                                                    doc.status === 'expiring' ? 'border-[#FDE68A] bg-[#FFFBEB]' :
                                                        'border-[#FECACA] bg-[#FEF2F2]'
                                                }`}>
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-start gap-3 flex-1">
                                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.bg}`}>
                                                            <Icon className="w-5 h-5" style={{ color: config.color }} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h5 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>{doc.name}</h5>
                                                                <span className={`px-2 py-0.5 rounded text-[11px] border`} style={{ backgroundColor: config.bg, color: config.color, borderColor: config.border }}>
                                                                    {config.label}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-[#6B7280] mb-2">{doc.fileName}</p>
                                                            {doc.status === 'expiring' && (
                                                                <div className="flex items-center gap-1.5 text-xs text-[#D97706] mb-2">
                                                                    <AlertTriangle className="w-3.5 h-3.5" />
                                                                    <span style={{ fontWeight: 500 }}>Expires in {daysLeft} days</span>
                                                                </div>
                                                            )}
                                                            {doc.status === 'expired' && (
                                                                <div className="flex items-center gap-1.5 text-xs text-[#DC2626] mb-2">
                                                                    <XCircle className="w-3.5 h-3.5" />
                                                                    <span style={{ fontWeight: 500 }}>Expired {Math.abs(daysLeft)} days ago</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#3B82F6] border border-[#3B82F6] rounded-lg hover:bg-[#EFF6FF]">
                                                        <Download className="w-3.5 h-3.5" /> Download
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs bg-white/50 rounded-lg p-3">
                                                    <div>
                                                        <span className="text-[#9CA3AF]">Registration Number:</span>
                                                        <span className="text-[#1F2937] ml-2" style={{ fontWeight: 500 }}>{doc.registrationNumber}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[#9CA3AF]">Issuing Authority:</span>
                                                        <span className="text-[#1F2937] ml-2" style={{ fontWeight: 500 }}>{doc.issuingAuthority}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[#9CA3AF]">Expiry Date:</span>
                                                        <span className="text-[#1F2937] ml-2" style={{ fontWeight: 500 }}>{formatDate(doc.expiryDate)}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[#9CA3AF]">Uploaded:</span>
                                                        <span className="text-[#1F2937] ml-2" style={{ fontWeight: 500 }}>{formatDate(doc.uploadedDate)}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[#9CA3AF]">File Size:</span>
                                                        <span className="text-[#1F2937] ml-2" style={{ fontWeight: 500 }}>{doc.fileSize}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[#9CA3AF]">Uploaded By:</span>
                                                        <span className="text-[#1F2937] ml-2" style={{ fontWeight: 500 }}>{doc.uploadedBy}</span>
                                                    </div>
                                                </div>

                                                {doc.notes && (
                                                    <div className="mt-3 pt-3 border-t border-[#E5E7EB]">
                                                        <p className="text-xs text-[#6B7280]"><span style={{ fontWeight: 600 }}>Notes:</span> {doc.notes}</p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Additional Documents */}
                            {profile.additionalDocs.length > 0 && (
                                <div>
                                    <h4 className="text-sm text-[#1F2937] mb-3" style={{ fontWeight: 600 }}>Additional Documents</h4>
                                    <div className="space-y-2">
                                        {profile.additionalDocs.map((doc: any, idx: number) => {
                                            const config = statusConfig[doc.status];
                                            const Icon = config.icon;

                                            return (
                                                <div key={idx} className="border border-[#E5E7EB] rounded-lg p-3 hover:bg-[#F9FAFB]">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <Icon className="w-4 h-4" style={{ color: config.color }} />
                                                            <div>
                                                                <p className="text-sm text-[#1F2937]" style={{ fontWeight: 500 }}>{doc.name}</p>
                                                                <p className="text-xs text-[#9CA3AF]">Expires: {formatDate(doc.expiryDate)} · {doc.fileSize}</p>
                                                            </div>
                                                        </div>
                                                        <span className={`px-2 py-0.5 rounded text-[11px] border`} style={{ backgroundColor: config.bg, color: config.color, borderColor: config.border }}>
                                                            {config.label}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* === TIMELINE === */}
                    {activeTab === 'timeline' && (
                        <div className="space-y-4">
                            <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>Compliance Timeline</h4>
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
                                <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>Compliance Notes</h4>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 text-xs text-[#6B7280] cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={showArchived} 
                                            onChange={(e) => setShowArchived(e.target.checked)} 
                                            className="rounded text-[#10B981] focus:ring-[#10B981] border-[#E5E7EB] h-3.5 w-3.5"
                                        />
                                        Show Archived Notes
                                    </label>
                                    <button 
                                        onClick={() => { setNoteToEdit(null); setShowAddNoteModal(true); }}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-[#10B981] hover:bg-[#059669] text-white rounded-lg font-medium shadow-sm hover:shadow transition-all duration-200"
                                    >
                                        <MessageSquare className="w-3.5 h-3.5" /> Add Note
                                    </button>
                                </div>
                            </div>
                            {profile.notes.filter((note: any) => showArchived || !note.isArchived).length > 0 ? (
                                <div className="space-y-3">
                                    {profile.notes
                                        .filter((note: any) => showArchived || !note.isArchived)
                                        .map((note: any, idx: number) => (
                                            <div 
                                                key={note.id || idx} 
                                                className={`p-4 border rounded-lg transition-all ${note.isArchived ? 'bg-[#F9FAFB] border-dashed border-[#D1D5DB] opacity-75' : 'border-[#E5E7EB] bg-[#FFFBEB]'}`}
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-sm text-[#1F2937]" style={{ fontWeight: 500 }}>{note.author}</p>
                                                            {note.isArchived && (
                                                                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-[#E5E7EB] text-[#4B5563] rounded">Archived</span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-[#9CA3AF]">{formatDate(note.date)}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <button 
                                                            onClick={() => handleTriggerEditNote(note)}
                                                            className="p-1 text-[#9CA3AF] hover:text-[#3B82F6] hover:bg-gray-100 rounded transition-colors"
                                                            title="Edit Note"
                                                        >
                                                            <Edit className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleArchiveComplianceNote(note.id)}
                                                            className={`p-1 rounded transition-colors ${note.isArchived ? 'text-[#10B981] hover:text-[#059669] hover:bg-[#ECFDF5]' : 'text-[#9CA3AF] hover:text-[#EF4444] hover:bg-red-50'}`}
                                                            title={note.isArchived ? "Restore Note" : "Archive Note"}
                                                        >
                                                            {note.isArchived ? <RotateCcw className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-[#6B7280]">{note.content}</p>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <div className="border border-[#E5E7EB] rounded-lg p-8 text-center">
                                    <MessageSquare className="w-8 h-8 text-[#9CA3AF] mx-auto mb-2" />
                                    <p className="text-sm text-[#9CA3AF]">No notes added yet</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
                    <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl border border-[#E5E7EB] animate-in fade-in zoom-in-95 duration-150">
                        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
                            <h3 className="text-[#1F2937] font-semibold text-lg">Upload Compliance Document</h3>
                            <button 
                                onClick={() => {
                                    setShowUploadModal(false);
                                    setSelectedFile(null);
                                    setUploadDocType('');
                                    setUploadExpiryDate('');
                                }} 
                                className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-[#6B7280]" />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm text-[#1F2937] mb-1.5 font-medium">Document Type <span className="text-[#EF4444]">*</span></label>
                                <select
                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                    value={uploadDocType}
                                    onChange={(e) => setUploadDocType(e.target.value)}
                                >
                                    <option value="">Select document type...</option>
                                    <option value="medical">Medical Council Registration</option>
                                    <option value="garda">Garda Vetting</option>
                                    <option value="insurance">Professional Indemnity Insurance</option>
                                    <option value="cpr">BLS/CPR Certification</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-[#1F2937] mb-1.5 font-medium">Expiry Date <span className="text-[#EF4444]">*</span></label>
                                <input
                                    type="date"
                                    value={uploadExpiryDate}
                                    onChange={(e) => setUploadExpiryDate(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-[#1F2937] mb-1.5 font-medium">Upload File <span className="text-[#EF4444]">*</span></label>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    onChange={handleFileChange} 
                                    accept=".pdf,.png,.jpg,.jpeg" 
                                />

                                {!selectedFile ? (
                                    <div 
                                        onClick={handleFileSelectClick}
                                        className="border-2 border-dashed border-[#E5E7EB] hover:border-[#10B981] hover:bg-[#F0FDF4]/30 rounded-xl p-6 text-center cursor-pointer transition-all duration-200"
                                    >
                                        <Upload className="w-8 h-8 text-[#9CA3AF] mx-auto mb-2" />
                                        <p className="text-sm text-[#374151]" style={{ fontWeight: 500 }}>Click to select a file from your device</p>
                                        <p className="text-xs text-[#9CA3AF] mt-1">Accepts PDF, JPG, PNG up to 10MB</p>
                                    </div>
                                ) : (
                                    <div className="border border-[#10B981] bg-[#F0FDF4]/50 rounded-xl p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 bg-[#D1FAE5] rounded-lg flex items-center justify-center flex-shrink-0">
                                                <FileText className="w-5 h-5 text-[#10B981]" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-[#1F2937] truncate">{selectedFile.name}</p>
                                                <p className="text-xs text-[#6B7280]">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => setSelectedFile(null)}
                                            className="p-1.5 hover:bg-[#E5E7EB] rounded-lg transition-colors text-[#6B7280] hover:text-[#EF4444]"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="p-5 border-t border-[#E5E7EB] flex justify-end gap-2">
                            <button 
                                onClick={() => {
                                    setShowUploadModal(false);
                                    setSelectedFile(null);
                                    setUploadDocType('');
                                    setUploadExpiryDate('');
                                }} 
                                className="px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg text-sm hover:bg-[#F9FAFB] transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleUploadSubmit}
                                className="px-4 py-2 bg-[#10B981] text-white rounded-lg text-sm hover:bg-[#059669] transition-colors"
                            >
                                Upload Document
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Add Note Modal */}
            <AddNoteModal
                isOpen={showAddNoteModal}
                onClose={() => { setShowAddNoteModal(false); setNoteToEdit(null); }}
                onAddNote={handleAddComplianceNote}
                defaultAuthor="Lisa Keane"
                title="Add Compliance Note"
                placeholder="Type compliance note content here..."
                noteToEdit={noteToEdit}
            />
        </div>
    );
}
