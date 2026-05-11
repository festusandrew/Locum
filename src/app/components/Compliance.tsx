import {
    CheckSquare,
    AlertTriangle,
    FileCheck,
    Clock,
    Search,
    SlidersHorizontal,
    Download,
    Eye,
    X,
    Upload,
    Calendar,
    User,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    XCircle,
    DollarSign,
    CreditCard,
    MoreVertical,
    Edit,
    History,
    Archive,
    StickyNote,
    FileText
} from 'lucide-react';
import { useState } from 'react';
import { LocumProfile } from './LocumProfile';

interface ComplianceRecord {
    id: string;
    locumName: string;
    avatar: string;
    specialty: string;
    overallCompliance: number;
    documents: {
        medicalLicense: { status: 'valid' | 'expiring' | 'expired', expiryDate: string, uploadedDate: string };
        garda: { status: 'valid' | 'expiring' | 'expired', expiryDate: string, uploadedDate: string };
        indemnityInsurance: { status: 'valid' | 'expiring' | 'expired', expiryDate: string, uploadedDate: string };
        cprTraining: { status: 'valid' | 'expiring' | 'expired', expiryDate: string, uploadedDate: string };
    };
}

const complianceData: ComplianceRecord[] = [
    {
        id: '#GS234FS',
        locumName: 'Dr. Sarah Mitchell',
        avatar: '👩‍⚕️',
        specialty: 'General Surgery',
        overallCompliance: 100,
        documents: {
            medicalLicense: { status: 'valid', expiryDate: '2026-03-15', uploadedDate: '2023-03-15' },
            garda: { status: 'valid', expiryDate: '2025-08-22', uploadedDate: '2023-08-22' },
            indemnityInsurance: { status: 'valid', expiryDate: '2025-12-31', uploadedDate: '2023-12-31' },
            cprTraining: { status: 'valid', expiryDate: '2025-06-10', uploadedDate: '2023-06-10' }
        }
    },
    {
        id: '#EC0125D',
        locumName: 'Dr. James Harrison',
        avatar: '👨‍⚕️',
        specialty: 'Cardiology',
        overallCompliance: 75,
        documents: {
            medicalLicense: { status: 'valid', expiryDate: '2025-11-30', uploadedDate: '2023-11-30' },
            garda: { status: 'expiring', expiryDate: '2025-01-15', uploadedDate: '2023-01-15' },
            indemnityInsurance: { status: 'valid', expiryDate: '2026-02-28', uploadedDate: '2023-02-28' },
            cprTraining: { status: 'valid', expiryDate: '2025-09-05', uploadedDate: '2023-09-05' }
        }
    },
    {
        id: '#MK4521A',
        locumName: 'Dr. Emily Chen',
        avatar: '👩‍⚕️',
        specialty: 'Anesthesiology',
        overallCompliance: 50,
        documents: {
            medicalLicense: { status: 'valid', expiryDate: '2027-01-20', uploadedDate: '2023-01-20' },
            garda: { status: 'expired', expiryDate: '2024-11-30', uploadedDate: '2023-11-30' },
            indemnityInsurance: { status: 'expiring', expiryDate: '2025-01-05', uploadedDate: '2023-01-05' },
            cprTraining: { status: 'valid', expiryDate: '2025-07-18', uploadedDate: '2023-07-18' }
        }
    },
    {
        id: '#LW9872P',
        locumName: 'Dr. Michael Brooks',
        avatar: '👨‍⚕️',
        specialty: 'Emergency Medicine',
        overallCompliance: 100,
        documents: {
            medicalLicense: { status: 'valid', expiryDate: '2026-05-12', uploadedDate: '2023-05-12' },
            garda: { status: 'valid', expiryDate: '2025-10-08', uploadedDate: '2023-10-08' },
            indemnityInsurance: { status: 'valid', expiryDate: '2026-03-22', uploadedDate: '2023-03-22' },
            cprTraining: { status: 'valid', expiryDate: '2025-04-30', uploadedDate: '2023-04-30' }
        }
    },
    {
        id: '#PM6543K',
        locumName: 'Dr. Rachel Martinez',
        avatar: '👩‍⚕️',
        specialty: 'Pediatrics',
        overallCompliance: 75,
        documents: {
            medicalLicense: { status: 'valid', expiryDate: '2025-09-14', uploadedDate: '2023-09-14' },
            garda: { status: 'valid', expiryDate: '2025-07-25', uploadedDate: '2023-07-25' },
            indemnityInsurance: { status: 'valid', expiryDate: '2026-01-10', uploadedDate: '2023-01-10' },
            cprTraining: { status: 'expiring', expiryDate: '2025-01-20', uploadedDate: '2023-01-20' }
        }
    },
    {
        id: '#RT8765N',
        locumName: 'Dr. David Thompson',
        avatar: '👨‍⚕️',
        specialty: 'Orthopedics',
        overallCompliance: 25,
        documents: {
            medicalLicense: { status: 'expiring', expiryDate: '2025-01-08', uploadedDate: '2023-01-08' },
            garda: { status: 'expired', expiryDate: '2024-10-15', uploadedDate: '2023-10-15' },
            indemnityInsurance: { status: 'expired', expiryDate: '2024-12-01', uploadedDate: '2023-12-01' },
            cprTraining: { status: 'valid', expiryDate: '2025-08-22', uploadedDate: '2023-08-22' }
        }
    },
];

export function Compliance({ onViewComplianceDetail }: { onViewComplianceDetail?: (id: string) => void }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [complianceFilter, setComplianceFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [selectedLocum, setSelectedLocum] = useState<ComplianceRecord | null>(null);
    const [activeTab, setActiveTab] = useState<'information' | 'schedule' | 'compliance' | 'shifts' | 'payments'>('information');
    const [showUploadDialog, setShowUploadDialog] = useState(false);

    // Document management dialogs
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [showHistoryDialog, setShowHistoryDialog] = useState(false);
    const [showArchiveDialog, setShowArchiveDialog] = useState(false);
    const [showNotesDialog, setShowNotesDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<{
        locum: ComplianceRecord;
        docType: 'medicalLicense' | 'garda' | 'indemnityInsurance' | 'cprTraining';
        docName: string;
    } | null>(null);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [documentNotes, setDocumentNotes] = useState('');
    const [editExpiryDate, setEditExpiryDate] = useState('');

    // Calculate stats
    const totalLocums = complianceData.length;
    const fullyCompliant = complianceData.filter(l => l.overallCompliance === 100).length;
    const expiringDocs = complianceData.reduce((count, locum) => {
        return count + Object.values(locum.documents).filter(d => d.status === 'expiring').length;
    }, 0);
    const expiredDocs = complianceData.reduce((count, locum) => {
        return count + Object.values(locum.documents).filter(d => d.status === 'expired').length;
    }, 0);

    // Filter data
    const filteredData = complianceData.filter(locum => {
        const matchesSearch = locum.locumName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            locum.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            locum.specialty.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesFilter = true;
        if (complianceFilter === 'compliant') {
            matchesFilter = locum.overallCompliance === 100;
        } else if (complianceFilter === 'expiring') {
            matchesFilter = Object.values(locum.documents).some(d => d.status === 'expiring');
        } else if (complianceFilter === 'expired') {
            matchesFilter = Object.values(locum.documents).some(d => d.status === 'expired');
        }

        return matchesSearch && matchesFilter;
    });

    const handleExport = () => {
        const csvContent = [
            ['Locum ID', 'Name', 'Specialty', 'Overall Compliance', 'Medical License', 'Garda Vetting', 'Indemnity Insurance', 'CPR Training'],
            ...complianceData.map(locum => [
                locum.id,
                locum.locumName,
                locum.specialty,
                `${locum.overallCompliance}%`,
                `${locum.documents.medicalLicense.status} (${locum.documents.medicalLicense.expiryDate})`,
                `${locum.documents.garda.status} (${locum.documents.garda.expiryDate})`,
                `${locum.documents.indemnityInsurance.status} (${locum.documents.indemnityInsurance.expiryDate})`,
                `${locum.documents.cprTraining.status} (${locum.documents.cprTraining.expiryDate})`
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `compliance-report-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const handleViewDetails = (locum: ComplianceRecord) => {
        setSelectedLocum(locum);
        setShowDetailsDialog(true);
        if (onViewComplianceDetail) {
            onViewComplianceDetail(locum.id);
        }
    };

    const getStatusBadge = (status: 'valid' | 'expiring' | 'expired') => {
        const styles = {
            valid: 'bg-[#D1FAE5] text-[#059669] border-[#A7F3D0]',
            expiring: 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]',
            expired: 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]'
        };
        const labels = {
            valid: 'Valid',
            expiring: 'Expiring Soon',
            expired: 'Expired'
        };
        return (
            <span className={`px-2 py-1 rounded text-xs border ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    const handleDocumentAction = (
        action: 'edit' | 'update' | 'history' | 'archive' | 'notes' | 'delete',
        locum: ComplianceRecord,
        docType: 'medicalLicense' | 'garda' | 'indemnityInsurance' | 'cprTraining',
        docName: string
    ) => {
        setSelectedDocument({ locum, docType, docName });
        setActiveDropdown(null);

        switch (action) {
            case 'edit':
                setEditExpiryDate(locum.documents[docType].expiryDate);
                setShowEditDialog(true);
                break;
            case 'update':
                setShowUpdateDialog(true);
                break;
            case 'history':
                setShowHistoryDialog(true);
                break;
            case 'archive':
                setShowArchiveDialog(true);
                break;
            case 'notes':
                setShowNotesDialog(true);
                break;
            case 'delete':
                setShowDeleteDialog(true);
                break;
        }
    };

    const DocumentCell = ({
        locum,
        docType,
        docName
    }: {
        locum: ComplianceRecord;
        docType: 'medicalLicense' | 'garda' | 'indemnityInsurance' | 'cprTraining';
        docName: string;
    }) => {
        const dropdownId = `${locum.id}-${docType}`;
        const doc = locum.documents[docType];

        return (
            <div className="relative group">
                <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 flex-1">
                        {getStatusBadge(doc.status)}
                        <p className="text-xs text-[#6B7280]">Exp: {doc.expiryDate}</p>
                    </div>
                    <button
                        onClick={() => setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#F3F4F6] rounded"
                    >
                        <MoreVertical className="w-4 h-4 text-[#6B7280]" />
                    </button>
                </div>

                {activeDropdown === dropdownId && (
                    <div className="absolute right-0 top-full mt-1 bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-10 w-48">
                        <button
                            onClick={() => handleDocumentAction('edit', locum, docType, docName)}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#1F2937] hover:bg-[#F9FAFB]"
                        >
                            <Edit className="w-4 h-4" />
                            Edit
                        </button>
                        <button
                            onClick={() => handleDocumentAction('update', locum, docType, docName)}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#1F2937] hover:bg-[#F9FAFB]"
                        >
                            <Upload className="w-4 h-4" />
                            Update
                        </button>
                        <button
                            onClick={() => handleDocumentAction('history', locum, docType, docName)}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#1F2937] hover:bg-[#F9FAFB]"
                        >
                            <History className="w-4 h-4" />
                            View History
                        </button>
                        <button
                            onClick={() => handleDocumentAction('notes', locum, docType, docName)}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#1F2937] hover:bg-[#F9FAFB]"
                        >
                            <StickyNote className="w-4 h-4" />
                            Notes
                        </button>
                        <button
                            onClick={() => handleDocumentAction('archive', locum, docType, docName)}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#DC2626] hover:bg-[#FEE2E2] border-t border-[#E5E7EB]"
                        >
                            <Archive className="w-4 h-4" />
                            Archive
                        </button>
                        <button
                            onClick={() => handleDocumentAction('delete', locum, docType, docName)}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#DC2626] hover:bg-[#FEE2E2] border-t border-[#E5E7EB]"
                        >
                            <XCircle className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="p-6">
            {/* Page Title */}
            <div className="mb-6">
                <h2 className="text-[#1F2937] mb-1">Compliance Management</h2>
                <p className="text-sm text-[#6B7280]">Track and manage all locum compliance documentation</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-5 mb-6">
                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-[#D1FAE5] rounded-lg flex items-center justify-center">
                            <CheckSquare className="w-5 h-5 text-[#10B981]" />
                        </div>
                        <div>
                            <p className="text-xs text-[#6B7280]">Fully Compliant</p>
                            <p className="text-2xl font-bold text-[#1F2937]">{fullyCompliant}</p>
                        </div>
                    </div>
                    <p className="text-xs text-[#6B7280]">{Math.round((fullyCompliant / totalLocums) * 100)}% of total locums</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-[#FEF3C7] rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-[#D97706]" />
                        </div>
                        <div>
                            <p className="text-xs text-[#6B7280]">Expiring Soon</p>
                            <p className="text-2xl font-bold text-[#1F2937]">{expiringDocs}</p>
                        </div>
                    </div>
                    <p className="text-xs text-[#6B7280]">Documents expiring in 30 days</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-[#FEE2E2] rounded-lg flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
                        </div>
                        <div>
                            <p className="text-xs text-[#6B7280]">Expired Docs</p>
                            <p className="text-2xl font-bold text-[#1F2937]">{expiredDocs}</p>
                        </div>
                    </div>
                    <p className="text-xs text-[#DC2626]">Requires immediate action</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-[#F3F4F6] rounded-lg flex items-center justify-center">
                            <FileCheck className="w-5 h-5 text-[#6B7280]" />
                        </div>
                        <div>
                            <p className="text-xs text-[#6B7280]">Avg. Compliance</p>
                            <p className="text-2xl font-bold text-[#1F2937]">
                                {Math.round(complianceData.reduce((sum, l) => sum + l.overallCompliance, 0) / totalLocums)}%
                            </p>
                        </div>
                    </div>
                    <p className="text-xs text-[#10B981]">+3% from last month</p>
                </div>
            </div>

            {/* Compliance Table */}
            <div className="bg-white rounded-xl border border-[#E5E7EB]">
                <div className="p-5 border-b border-[#E5E7EB]">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[#1F2937]">Locum Compliance Status</h3>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                                <input
                                    type="text"
                                    placeholder="Search locums..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-4 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                />
                            </div>
                            <select
                                value={complianceFilter}
                                onChange={(e) => setComplianceFilter(e.target.value)}
                                className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                            >
                                <option value="all">All Status</option>
                                <option value="compliant">Fully Compliant</option>
                                <option value="expiring">Has Expiring Docs</option>
                                <option value="expired">Has Expired Docs</option>
                            </select>
                            <button
                                onClick={handleExport}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]"
                            >
                                <Download className="w-4 h-4" />
                                Export
                            </button>
                            <button
                                onClick={() => setShowUploadDialog(true)}
                                className="flex items-center gap-2 px-4 py-2 text-sm bg-[#10B981] text-white rounded-lg hover:bg-[#059669]"
                            >
                                <Upload className="w-4 h-4" />
                                Upload Document
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#E5E7EB]">
                                <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Locum</th>
                                <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Medical License</th>
                                <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Garda Vetting</th>
                                <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Indemnity Insurance</th>
                                <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">CPR Training</th>
                                <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Overall</th>
                                <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((locum) => (
                                <tr key={locum.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#F3F4F6] rounded-full flex items-center justify-center">
                                                {locum.avatar}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-[#1F2937]">{locum.locumName}</p>
                                                <p className="text-xs text-[#6B7280]">{locum.specialty}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <DocumentCell
                                            locum={locum}
                                            docType="medicalLicense"
                                            docName="Medical License"
                                        />
                                    </td>
                                    <td className="px-5 py-4">
                                        <DocumentCell
                                            locum={locum}
                                            docType="garda"
                                            docName="Garda Vetting"
                                        />
                                    </td>
                                    <td className="px-5 py-4">
                                        <DocumentCell
                                            locum={locum}
                                            docType="indemnityInsurance"
                                            docName="Indemnity Insurance"
                                        />
                                    </td>
                                    <td className="px-5 py-4">
                                        <DocumentCell
                                            locum={locum}
                                            docType="cprTraining"
                                            docName="CPR Training"
                                        />
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-12 h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${locum.overallCompliance === 100 ? 'bg-[#10B981]' :
                                                            locum.overallCompliance >= 75 ? 'bg-[#D97706]' :
                                                                'bg-[#DC2626]'
                                                        }`}
                                                    style={{ width: `${locum.overallCompliance}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-medium text-[#1F2937]">{locum.overallCompliance}%</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <button
                                            onClick={() => handleViewDetails(locum)}
                                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#10B981] border border-[#10B981] rounded-lg hover:bg-[#D1FAE5]"
                                        >
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

            {/* Details Dialog */}
            {showDetailsDialog && selectedLocum && (
                <LocumProfile
                    locum={selectedLocum}
                    onClose={() => setShowDetailsDialog(false)}
                />
            )}

            {/* Upload Dialog */}
            {showUploadDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-[500px]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[#1F2937]">Upload Compliance Document</h3>
                            <button
                                onClick={() => setShowUploadDialog(false)}
                                className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#1F2937] mb-2">Select Locum</label>
                                <select className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]">
                                    <option>Choose locum...</option>
                                    {complianceData.map(locum => (
                                        <option key={locum.id} value={locum.id}>{locum.locumName}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1F2937] mb-2">Document Type</label>
                                <select className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]">
                                    <option>Choose document type...</option>
                                    <option>Medical License</option>
                                    <option>Garda Vetting</option>
                                    <option>Indemnity Insurance</option>
                                    <option>CPR Training</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1F2937] mb-2">Expiry Date</label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1F2937] mb-2">Upload File</label>
                                <div className="border-2 border-dashed border-[#E5E7EB] rounded-lg p-6 text-center hover:border-[#10B981] cursor-pointer">
                                    <Upload className="w-8 h-8 text-[#6B7280] mx-auto mb-2" />
                                    <p className="text-sm text-[#6B7280]">Click to upload or drag and drop</p>
                                    <p className="text-xs text-[#9CA3AF] mt-1">PDF, JPG, PNG up to 10MB</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                onClick={() => setShowUploadDialog(false)}
                                className="px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg hover:bg-[#F9FAFB]"
                            >
                                Cancel
                            </button>
                            <button className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669]">
                                Upload Document
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Document Dialog */}
            {showEditDialog && selectedDocument && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-[500px]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[#1F2937]">Edit Document</h3>
                            <button
                                onClick={() => setShowEditDialog(false)}
                                className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#1F2937] mb-2">Locum</label>
                                <input
                                    type="text"
                                    value={selectedDocument.locum.locumName}
                                    disabled
                                    className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#6B7280]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1F2937] mb-2">Document Type</label>
                                <input
                                    type="text"
                                    value={selectedDocument.docName}
                                    disabled
                                    className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#6B7280]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1F2937] mb-2">New Expiry Date</label>
                                <input
                                    type="date"
                                    value={editExpiryDate}
                                    onChange={(e) => setEditExpiryDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                onClick={() => setShowEditDialog(false)}
                                className="px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg hover:bg-[#F9FAFB]"
                            >
                                Cancel
                            </button>
                            <button className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669]">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Document Dialog */}
            {showUpdateDialog && selectedDocument && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-[500px]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[#1F2937]">Update Document</h3>
                            <button
                                onClick={() => setShowUpdateDialog(false)}
                                className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#1F2937] mb-2">Locum</label>
                                <input
                                    type="text"
                                    value={selectedDocument.locum.locumName}
                                    disabled
                                    className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#6B7280]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1F2937] mb-2">Document Type</label>
                                <input
                                    type="text"
                                    value={selectedDocument.docName}
                                    disabled
                                    className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#6B7280]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1F2937] mb-2">New Expiry Date</label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1F2937] mb-2">Upload New File</label>
                                <div className="border-2 border-dashed border-[#E5E7EB] rounded-lg p-6 text-center hover:border-[#10B981] cursor-pointer">
                                    <Upload className="w-8 h-8 text-[#6B7280] mx-auto mb-2" />
                                    <p className="text-sm text-[#6B7280]">Click to upload or drag and drop</p>
                                    <p className="text-xs text-[#9CA3AF] mt-1">PDF, JPG, PNG up to 10MB</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                onClick={() => setShowUpdateDialog(false)}
                                className="px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg hover:bg-[#F9FAFB]"
                            >
                                Cancel
                            </button>
                            <button className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669]">
                                Update Document
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View History Dialog */}
            {showHistoryDialog && selectedDocument && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-[600px] max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[#1F2937]">Document History</h3>
                            <button
                                onClick={() => setShowHistoryDialog(false)}
                                className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <p className="text-sm text-[#6B7280]">Locum: <span className="font-medium text-[#1F2937]">{selectedDocument.locum.locumName}</span></p>
                            <p className="text-sm text-[#6B7280]">Document: <span className="font-medium text-[#1F2937]">{selectedDocument.docName}</span></p>
                        </div>

                        <div className="space-y-4">
                            {/* Mock history entries */}
                            <div className="relative pl-8 pb-6 border-l-2 border-[#E5E7EB]">
                                <div className="absolute -left-2 top-0 w-4 h-4 bg-[#10B981] rounded-full border-2 border-white"></div>
                                <div className="bg-[#F9FAFB] rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-[#1F2937]">Document Updated</span>
                                        <span className="text-xs text-[#6B7280]">2024-12-15</span>
                                    </div>
                                    <p className="text-xs text-[#6B7280]">Expiry date changed to {selectedDocument.locum.documents[selectedDocument.docType].expiryDate}</p>
                                    <p className="text-xs text-[#6B7280] mt-1">By: Admin User</p>
                                </div>
                            </div>

                            <div className="relative pl-8 pb-6 border-l-2 border-[#E5E7EB]">
                                <div className="absolute -left-2 top-0 w-4 h-4 bg-[#10B981] rounded-full border-2 border-white"></div>
                                <div className="bg-[#F9FAFB] rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-[#1F2937]">Document Uploaded</span>
                                        <span className="text-xs text-[#6B7280]">{selectedDocument.locum.documents[selectedDocument.docType].uploadedDate}</span>
                                    </div>
                                    <p className="text-xs text-[#6B7280]">Original document uploaded</p>
                                    <p className="text-xs text-[#6B7280] mt-1">By: System</p>
                                </div>
                            </div>

                            <div className="relative pl-8">
                                <div className="absolute -left-2 top-0 w-4 h-4 bg-[#6B7280] rounded-full border-2 border-white"></div>
                                <div className="bg-[#F9FAFB] rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-[#1F2937]">Locum Registered</span>
                                        <span className="text-xs text-[#6B7280]">2023-01-10</span>
                                    </div>
                                    <p className="text-xs text-[#6B7280]">Locum added to system</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setShowHistoryDialog(false)}
                                className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669]"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Archive Document Dialog */}
            {showArchiveDialog && selectedDocument && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-[500px]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[#1F2937]">Archive Document</h3>
                            <button
                                onClick={() => setShowArchiveDialog(false)}
                                className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center gap-3 mb-4 p-4 bg-[#FEF3C7] border border-[#FDE68A] rounded-lg">
                                <AlertTriangle className="w-5 h-5 text-[#D97706]" />
                                <p className="text-sm text-[#D97706]">This action will archive the document. You can restore it later if needed.</p>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm text-[#6B7280]">Locum: <span className="font-medium text-[#1F2937]">{selectedDocument.locum.locumName}</span></p>
                                <p className="text-sm text-[#6B7280]">Document: <span className="font-medium text-[#1F2937]">{selectedDocument.docName}</span></p>
                                <p className="text-sm text-[#6B7280]">Expiry: <span className="font-medium text-[#1F2937]">{selectedDocument.locum.documents[selectedDocument.docType].expiryDate}</span></p>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-[#1F2937] mb-2">Reason for Archiving (Optional)</label>
                                <textarea
                                    rows={3}
                                    placeholder="Enter reason..."
                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowArchiveDialog(false)}
                                className="px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg hover:bg-[#F9FAFB]"
                            >
                                Cancel
                            </button>
                            <button className="px-4 py-2 bg-[#DC2626] text-white rounded-lg hover:bg-[#B91C1C]">
                                Archive Document
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notes Dialog */}
            {showNotesDialog && selectedDocument && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-[600px] max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[#1F2937]">Document Notes</h3>
                            <button
                                onClick={() => setShowNotesDialog(false)}
                                className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <p className="text-sm text-[#6B7280]">Locum: <span className="font-medium text-[#1F2937]">{selectedDocument.locum.locumName}</span></p>
                            <p className="text-sm text-[#6B7280]">Document: <span className="font-medium text-[#1F2937]">{selectedDocument.docName}</span></p>
                        </div>

                        {/* Add New Note */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-[#1F2937] mb-2">Add Note</label>
                            <textarea
                                rows={4}
                                value={documentNotes}
                                onChange={(e) => setDocumentNotes(e.target.value)}
                                placeholder="Enter your note here..."
                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                            ></textarea>
                            <button className="mt-2 px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] text-sm">
                                Add Note
                            </button>
                        </div>

                        {/* Existing Notes */}
                        <div>
                            <h4 className="text-sm font-medium text-[#1F2937] mb-3">Previous Notes</h4>
                            <div className="space-y-3">
                                {/* Mock notes */}
                                <div className="p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-[#1F2937]">Admin User</span>
                                        <span className="text-xs text-[#6B7280]">2024-12-10 14:30</span>
                                    </div>
                                    <p className="text-sm text-[#6B7280]">Verified document authenticity with Medical Council of Ireland.</p>
                                </div>

                                <div className="p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-[#1F2937]">Staff User</span>
                                        <span className="text-xs text-[#6B7280]">2024-11-28 09:15</span>
                                    </div>
                                    <p className="text-sm text-[#6B7280]">Reminder sent to locum regarding upcoming expiry.</p>
                                </div>

                                <div className="p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-[#1F2937]">System</span>
                                        <span className="text-xs text-[#6B7280]">{selectedDocument.locum.documents[selectedDocument.docType].uploadedDate}</span>
                                    </div>
                                    <p className="text-sm text-[#6B7280]">Document initially uploaded and verified.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setShowNotesDialog(false)}
                                className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669]"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Document Dialog */}
            {showDeleteDialog && selectedDocument && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-[500px]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[#1F2937]">Delete Document</h3>
                            <button
                                onClick={() => setShowDeleteDialog(false)}
                                className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center gap-3 mb-4 p-4 bg-[#FEF3C7] border border-[#FDE68A] rounded-lg">
                                <AlertTriangle className="w-5 h-5 text-[#D97706]" />
                                <p className="text-sm text-[#D97706]">This action will permanently delete the document. This cannot be undone.</p>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm text-[#6B7280]">Locum: <span className="font-medium text-[#1F2937]">{selectedDocument.locum.locumName}</span></p>
                                <p className="text-sm text-[#6B7280]">Document: <span className="font-medium text-[#1F2937]">{selectedDocument.docName}</span></p>
                                <p className="text-sm text-[#6B7280]">Expiry: <span className="font-medium text-[#1F2937]">{selectedDocument.locum.documents[selectedDocument.docType].expiryDate}</span></p>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-[#1F2937] mb-2">Reason for Deletion (Optional)</label>
                                <textarea
                                    rows={3}
                                    placeholder="Enter reason..."
                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowDeleteDialog(false)}
                                className="px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg hover:bg-[#F9FAFB]"
                            >
                                Cancel
                            </button>
                            <button className="px-4 py-2 bg-[#DC2626] text-white rounded-lg hover:bg-[#B91C1C]">
                                Delete Document
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}