import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
    Building2, Search, Plus, MapPin, Phone, Mail, Star, Users,
    Eye, X, ChevronDown, Download, SlidersHorizontal, MessageCircle,
    FileText, Calendar, DollarSign, Edit, MoreVertical, Archive,
    Globe, Award, Briefcase, ShieldCheck, Activity
} from 'lucide-react';
import { Client } from '../types';
import { clientService } from '../services/clientService';

const feedbackData = [
    { id: 'FB-001', client: "St. James's Hospital", locum: 'Sarah Mitchell', rating: 5, comment: 'Excellent surgeon, highly professional. Would definitely book again.', date: '2026-02-08' },
    { id: 'FB-002', client: 'Cork University Hospital', locum: 'James Harrison', rating: 4, comment: 'Good cardiologist, punctual and reliable.', date: '2026-02-06' },
    { id: 'FB-003', client: 'Galway Clinic', locum: 'Emily Chen', rating: 5, comment: 'Outstanding anesthesiologist. Patients felt very comfortable.', date: '2026-02-05' },
    { id: 'FB-004', client: "St. James's Hospital", locum: 'Michael Brooks', rating: 3, comment: 'Competent but arrived 15 minutes late to shift.', date: '2026-02-03' },
];

const typeLabels: Record<string, string> = {
    hospital: 'Hospital',
    clinic: 'Clinic',
    care_home: 'Care Home',
    private_practice: 'Private Practice',
};

const typeColors: Record<string, string> = {
    hospital: 'bg-[#DBEAFE] text-[#1D4ED8] border-[#BFDBFE]',
    clinic: 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]',
    care_home: 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]',
    private_practice: 'bg-[#EDE9FE] text-[#7C3AED] border-[#DDD6FE]',
};

export function ClientManagement({ subPage = 'directory', onViewProfile }: { subPage?: string; onViewProfile?: (id: string) => void }) {
    const [clientsList, setClientsList] = useState<Client[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [modalTab, setModalTab] = useState<'overview' | 'location' | 'contacts' | 'contract'>('overview');
    const [formData, setFormData] = useState({
        name: '',
        type: 'hospital' as 'hospital' | 'clinic' | 'care_home' | 'private_practice',
        address: '',
        eircode: '',
        location: '',
        phone: '',
        fax: '',
        email: '',
        website: '',
        hseRegion: '',
        hseArea: '',
        beds: '',
        ownership: '',
        contactPersonName: '',
        contactPersonRole: '',
        contactPersonPhone: '',
        contactPersonMobile: '',
        contactPersonEmail: '',
        status: 'pending' as 'active' | 'inactive' | 'pending',

        // Extended rich fields to mirror FacilityProfilePage.tsx details
        hiqaRegistration: '',
        hiqaStatus: 'Compliant',
        hiqaLastInspection: '',
        jciAccredited: false,
        description: '',
        established: '',

        // Secondary Contact details
        secondaryContactName: '',
        secondaryContactRole: '',
        secondaryContactPhone: '',
        secondaryContactMobile: '',
        secondaryContactEmail: '',

        // Finance Contact details
        financeContactName: '',
        financeContactRole: '',
        financeContactPhone: '',
        financeContactMobile: '',
        financeContactEmail: '',

        // Contractual Terms details
        frameworkType: 'HSE National Framework Agreement',
        contractRef: '',
        contractStartDate: '',
        contractEndDate: '',
        paymentTerms: 'Net 30 days',
        invoiceFrequency: 'Fortnightly',
        poRequired: true,
        agencyMargin: '15%',
    });

    // Fetch clients on mount
    useEffect(() => {
        const loadClients = async () => {
            try {
                const data = await clientService.getAll();
                setClientsList(data);
            } catch (err) {
                toast.error('Failed to load client directory');
            }
        };
        loadClients();
    }, []);

    const filteredClients = clientsList.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || c.type === typeFilter;
        return matchesSearch && matchesType;
    });

    const handleExport = () => {
        const csv = [
            ['ID', 'Name', 'Type', 'Location', 'Contact', 'Active Shifts', 'Monthly Spend'],
            ...clientsList.map(c => [c.id, c.name, typeLabels[c.type], c.location, c.contactPerson, c.activeShifts, `€${c.monthlySpend}`])
        ].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'clients-export.csv';
        a.click();
    };

    const handleAddClient = async () => {
        if (!formData.name) {
            toast.error('Facility Name is required');
            return;
        }

        const newId = `CL-00${clientsList.length + 1}`;
        const newClient: Client = {
            id: newId,
            name: formData.name,
            type: formData.type,
            location: formData.location || 'Dublin',
            address: formData.address || 'James\'s Street, Dublin 8',
            contactPerson: formData.contactPersonName || 'Contact Person',
            contactEmail: formData.contactPersonEmail || 'contact@facility.ie',
            contactPhone: formData.contactPersonPhone || '+353 1 123 4567',
            activeShifts: 0,
            totalBookings: 0,
            avgRating: 5.0,
            status: formData.status === 'active' ? 'active' : 'inactive',
            monthlySpend: 0,
            preferredLocums: 0,
            complianceReqs: ['Medical Council of Ireland Registration', 'Garda Vetting (NVB Clearance)', 'Professional Indemnity Insurance', 'BLS / CPR Certification']
        };

        // Construct complete facility profile matching FacilityProfilePage.tsx state schema
        const newFacilityProfile = {
            id: newId,
            name: formData.name,
            type: formData.type,
            status: formData.status === 'active' ? 'active' : 'inactive',
            overview: {
                address: formData.address || "James's Street, Dublin 8, D08 NHY1",
                eircode: formData.eircode || "D08 NHY1",
                phone: formData.phone || "+353 1 410 3000",
                fax: formData.fax || "",
                email: formData.email || "bookings@facility.ie",
                website: formData.website || "",
                hseRegion: formData.hseRegion || "",
                hseArea: formData.hseArea || "",
                beds: formData.beds ? parseInt(formData.beds) : 0,
                established: formData.established ? parseInt(formData.established) : new Date().getFullYear(),
                ownership: formData.ownership || "Public (HSE)",
                hiqaRegistration: formData.hiqaRegistration || "",
                hiqaLastInspection: formData.hiqaLastInspection || "",
                hiqaStatus: formData.hiqaStatus || "Compliant",
                jciAccredited: formData.jciAccredited,
                description: formData.description || `${formData.name} is a dedicated healthcare provider offering stellar treatment and services.`,
            },
            contacts: {
                primary: {
                    name: formData.contactPersonName || "Contact Person",
                    role: formData.contactPersonRole || "Locum Coordinator",
                    phone: formData.contactPersonPhone || "+353 1 123 4567",
                    email: formData.contactPersonEmail || "contact@facility.ie",
                    mobile: formData.contactPersonMobile || ""
                },
                secondary: {
                    name: formData.secondaryContactName || "",
                    role: formData.secondaryContactRole || "",
                    phone: formData.secondaryContactPhone || "",
                    email: formData.secondaryContactEmail || "",
                    mobile: formData.secondaryContactMobile || ""
                },
                finance: {
                    name: formData.financeContactName || "",
                    role: formData.financeContactRole || "",
                    phone: formData.financeContactPhone || "",
                    email: formData.financeContactEmail || "",
                    mobile: formData.financeContactMobile || ""
                },
                nursing: { name: '', role: '', phone: '', email: '', mobile: '' },
                escalation: { name: '', role: '', phone: '', email: '', mobile: '' }
            },
            departments: [
                { name: 'General Surgery', locumDemand: 'Medium', avgShiftsPerMonth: 12, preferredGrade: 'Registrar', currentVacancies: 1 },
                { name: 'Emergency Medicine', locumDemand: 'Medium', avgShiftsPerMonth: 16, preferredGrade: 'SHO / Registrar', currentVacancies: 2 }
            ],
            contract: {
                frameworkType: formData.frameworkType,
                contractRef: formData.contractRef || `${newId}-CONTRACT-2026`,
                startDate: formData.contractStartDate || new Date().toISOString().split('T')[0],
                endDate: formData.contractEndDate || '2028-12-31',
                autoRenewal: true,
                paymentTerms: formData.paymentTerms,
                invoiceFrequency: formData.invoiceFrequency,
                poRequired: formData.poRequired,
                agreedRates: {
                    consultantDay: 1100,
                    consultantNight: 1350,
                    consultantWeekend: 1450,
                    registrarDay: 700,
                    registrarNight: 850,
                    registrarWeekend: 900,
                    shoDay: 450,
                    shoNight: 580,
                    shoWeekend: 620,
                },
                agencyMargin: formData.agencyMargin,
                vatApplicable: true,
                vatRate: '23%'
            },
            compliance: {
                requirements: [
                    { name: 'Medical Council of Ireland Registration', mandatory: true, description: 'Current registration with IMC' },
                    { name: 'Garda Vetting (NVB Clearance)', mandatory: true, description: 'National Vetting Bureau clearance' },
                    { name: 'Professional Indemnity Insurance', mandatory: true, description: 'Minimum €2.5M cover' },
                    { name: 'BLS / CPR Certification', mandatory: true, description: 'Current BLS certification' }
                ]
            },
            financial: { monthlySpend: 0, ytdSpend: 0, annualBudget: 150000, totalSpendAllTime: 0, outstandingBalance: 0, recentInvoices: [] },
            bookings: { totalBookings: 0, activeShifts: 0, pendingBookings: 0, completionRate: 100, cancellationRate: 0, preferredLocums: 0, recentBookings: [] },
            ratings: { avgRating: 5.0, totalReviews: 0, categories: { 'Working Environment': 5.0, 'Staff Friendliness': 5.0, 'Facilities & Equipment': 5.0, 'Communication': 5.0, 'Payment Timeliness': 5.0, 'Overall Satisfaction': 5.0 }, recentFeedback: [] },
            notes: []
        };

        try {
            await clientService.create(newClient);
            localStorage.setItem(`mployus_facility_profile_${newId}`, JSON.stringify(newFacilityProfile));
            
            const updated = await clientService.getAll();
            setClientsList(updated);
            toast.success(`Client ${newClient.name} added successfully`);
            setShowAddModal(false);
            
            // Reset form
            setFormData({
                name: '',
                type: 'hospital',
                address: '',
                eircode: '',
                location: '',
                phone: '',
                fax: '',
                email: '',
                website: '',
                hseRegion: '',
                hseArea: '',
                beds: '',
                ownership: '',
                contactPersonName: '',
                contactPersonRole: '',
                contactPersonPhone: '',
                contactPersonMobile: '',
                contactPersonEmail: '',
                status: 'pending',

                hiqaRegistration: '',
                hiqaStatus: 'Compliant',
                hiqaLastInspection: '',
                jciAccredited: false,
                description: '',
                established: '',

                secondaryContactName: '',
                secondaryContactRole: '',
                secondaryContactPhone: '',
                secondaryContactMobile: '',
                secondaryContactEmail: '',

                financeContactName: '',
                financeContactRole: '',
                financeContactPhone: '',
                financeContactMobile: '',
                financeContactEmail: '',

                frameworkType: 'HSE National Framework Agreement',
                contractRef: '',
                contractStartDate: '',
                contractEndDate: '',
                paymentTerms: 'Net 30 days',
                invoiceFrequency: 'Fortnightly',
                poRequired: true,
                agencyMargin: '15%',
            });
        } catch (err) {
            toast.error('Failed to create facility');
        }
    };

    const handleEditClient = async () => {
        if (!selectedClient) return;
        if (!formData.name) {
            toast.error('Facility Name is required');
            return;
        }

        const updatedClient: Client = {
            ...selectedClient,
            name: formData.name,
            type: formData.type,
            location: formData.location,
            address: formData.address,
            contactPerson: formData.contactPersonName,
            contactEmail: formData.contactPersonEmail,
            contactPhone: formData.contactPersonPhone,
            status: formData.status === 'active' ? 'active' : 'inactive'
        };

        try {
            await clientService.update(updatedClient);

            // Fetch current profile in localStorage to merge changes safely without overwriting historical notes/bookings/financials
            const storedProfileStr = localStorage.getItem(`mployus_facility_profile_${selectedClient.id}`);
            if (storedProfileStr) {
                const profile = JSON.parse(storedProfileStr);
                const updatedProfile = {
                    ...profile,
                    name: formData.name,
                    type: formData.type,
                    status: formData.status === 'active' ? 'active' : 'inactive',
                    overview: {
                        ...profile.overview,
                        address: formData.address,
                        eircode: formData.eircode,
                        phone: formData.phone,
                        fax: formData.fax,
                        email: formData.email,
                        website: formData.website,
                        hseRegion: formData.hseRegion,
                        hseArea: formData.hseArea,
                        beds: formData.beds ? parseInt(formData.beds) : profile.overview?.beds,
                        established: formData.established ? parseInt(formData.established) : profile.overview?.established,
                        ownership: formData.ownership,
                        hiqaRegistration: formData.hiqaRegistration,
                        hiqaLastInspection: formData.hiqaLastInspection,
                        hiqaStatus: formData.hiqaStatus,
                        jciAccredited: formData.jciAccredited,
                        description: formData.description,
                    },
                    contacts: {
                        ...profile.contacts,
                        primary: {
                            name: formData.contactPersonName,
                            role: formData.contactPersonRole,
                            phone: formData.contactPersonPhone,
                            email: formData.contactPersonEmail,
                            mobile: formData.contactPersonMobile
                        },
                        secondary: {
                            name: formData.secondaryContactName,
                            role: formData.secondaryContactRole,
                            phone: formData.secondaryContactPhone,
                            email: formData.secondaryContactEmail,
                            mobile: formData.secondaryContactMobile
                        },
                        finance: {
                            name: formData.financeContactName,
                            role: formData.financeContactRole,
                            phone: formData.financeContactPhone,
                            email: formData.financeContactEmail,
                            mobile: formData.financeContactMobile
                        }
                    },
                    contract: {
                        ...profile.contract,
                        frameworkType: formData.frameworkType,
                        contractRef: formData.contractRef,
                        startDate: formData.contractStartDate,
                        endDate: formData.contractEndDate,
                        paymentTerms: formData.paymentTerms,
                        invoiceFrequency: formData.invoiceFrequency,
                        poRequired: formData.poRequired,
                        agencyMargin: formData.agencyMargin,
                    }
                };
                localStorage.setItem(`mployus_facility_profile_${selectedClient.id}`, JSON.stringify(updatedProfile));
            }

            const updated = await clientService.getAll();
            setClientsList(updated);
            toast.success(`Client ${formData.name} updated successfully`);
            setShowEditModal(false);
        } catch (err) {
            toast.error('Failed to save client changes');
        }
    };

    const handleArchiveClient = async () => {
        if (!selectedClient) return;
        try {
            await clientService.archive(selectedClient.id);
            const updated = await clientService.getAll();
            setClientsList(updated);
            toast.success(`Client ${selectedClient.name} archived successfully`);
            setShowArchiveModal(false);
        } catch (err) {
            toast.error('Failed to archive facility');
        }
    };

    const openEditModal = (client: Client) => {
        setSelectedClient(client);

        // Load complete existing profile to pre-fill all of the secondary / financial / licensing fields
        const stored = localStorage.getItem(`mployus_facility_profile_${client.id}`);
        const profile = stored ? JSON.parse(stored) : null;

        setFormData({
            name: client.name,
            type: client.type,
            address: client.address,
            eircode: profile?.overview?.eircode || '',
            location: client.location,
            phone: profile?.overview?.phone || client.contactPhone,
            fax: profile?.overview?.fax || '',
            email: profile?.overview?.email || client.contactEmail,
            website: profile?.overview?.website || '',
            hseRegion: profile?.overview?.hseRegion || '',
            hseArea: profile?.overview?.hseArea || '',
            beds: profile?.overview?.beds?.toString() || '',
            ownership: profile?.overview?.ownership || '',
            contactPersonName: client.contactPerson,
            contactPersonRole: profile?.contacts?.primary?.role || '',
            contactPersonPhone: client.contactPhone,
            contactPersonMobile: profile?.contacts?.primary?.mobile || '',
            contactPersonEmail: client.contactEmail,
            status: client.status,

            hiqaRegistration: profile?.overview?.hiqaRegistration || '',
            hiqaStatus: profile?.overview?.hiqaStatus || 'Compliant',
            hiqaLastInspection: profile?.overview?.hiqaLastInspection || '',
            jciAccredited: profile?.overview?.jciAccredited || false,
            description: profile?.overview?.description || '',
            established: profile?.overview?.established?.toString() || '',

            secondaryContactName: profile?.contacts?.secondary?.name || '',
            secondaryContactRole: profile?.contacts?.secondary?.role || '',
            secondaryContactPhone: profile?.contacts?.secondary?.phone || '',
            secondaryContactMobile: profile?.contacts?.secondary?.mobile || '',
            secondaryContactEmail: profile?.contacts?.secondary?.email || '',

            financeContactName: profile?.contacts?.finance?.name || '',
            financeContactRole: profile?.contacts?.finance?.role || '',
            financeContactPhone: profile?.contacts?.finance?.phone || '',
            financeContactMobile: profile?.contacts?.finance?.mobile || '',
            financeContactEmail: profile?.contacts?.finance?.email || '',

            frameworkType: profile?.contract?.frameworkType || 'HSE National Framework Agreement',
            contractRef: profile?.contract?.contractRef || '',
            contractStartDate: profile?.contract?.startDate || '',
            contractEndDate: profile?.contract?.endDate || '',
            paymentTerms: profile?.contract?.paymentTerms || 'Net 30 days',
            invoiceFrequency: profile?.contract?.invoiceFrequency || 'Fortnightly',
            poRequired: profile?.contract?.poRequired ?? true,
            agencyMargin: profile?.contract?.agencyMargin || '15%',
        });
        setModalTab('overview');
        setShowEditModal(true);
    };

    if (subPage === 'feedback') {
        return (
            <div className="p-6">
                <div className="mb-6">
                    <h2 className="text-[#1F2937] mb-1">Client Feedback</h2>
                    <p className="text-sm text-[#6B7280]">Reviews and ratings from healthcare facilities</p>
                </div>
                <div className="space-y-4">
                    {feedbackData.map(fb => (
                        <div key={fb.id} className="bg-white rounded-xl border border-[#E5E7EB] p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>{fb.client}</p>
                                        <span className="text-xs text-[#6B7280]">about</span>
                                        <p className="text-sm text-[#10B981]" style={{ fontWeight: 500 }}>{fb.locum}</p>
                                    </div>
                                    <div className="flex items-center gap-1 mb-2">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < fb.rating ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-[#E5E7EB]'}`} />
                                        ))}
                                    </div>
                                    <p className="text-sm text-[#6B7280]">{fb.comment}</p>
                                </div>
                                <span className="text-xs text-[#9CA3AF]">{fb.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-[#1F2937] mb-1">Client Directory</h2>
                <p className="text-sm text-[#6B7280]">Manage healthcare facilities and client relationships</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
                    <p className="text-xs text-[#6B7280] mb-1">Total Clients</p>
                    <p className="text-2xl text-[#1F2937]" style={{ fontWeight: 700 }}>{clientsList.length}</p>
                    <p className="text-xs text-[#10B981] mt-1">+2 this month</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
                    <p className="text-xs text-[#6B7280] mb-1">Active Clients</p>
                    <p className="text-2xl text-[#1F2937]" style={{ fontWeight: 700 }}>{clientsList.filter(c => c.status === 'active').length}</p>
                    <p className="text-xs text-[#6B7280] mt-1">With active shifts</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
                    <p className="text-xs text-[#6B7280] mb-1">Total Monthly Revenue</p>
                    <p className="text-2xl text-[#1F2937]" style={{ fontWeight: 700 }}>€{clientsList.reduce((s, c) => s + c.monthlySpend, 0).toLocaleString()}</p>
                    <p className="text-xs text-[#10B981] mt-1">+8% vs last month</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
                    <p className="text-xs text-[#6B7280] mb-1">Avg. Rating</p>
                    <p className="text-2xl text-[#1F2937]" style={{ fontWeight: 700 }}>{clientsList.length > 0 ? (clientsList.reduce((s, c) => s + c.avgRating, 0) / clientsList.length).toFixed(1) : '0.0'}</p>
                    <p className="text-xs text-[#6B7280] mt-1">Client satisfaction</p>
                </div>
            </div>

            {/* Client List */}
            <div className="bg-white rounded-xl border border-[#E5E7EB]">
                <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
                    <h3 className="text-[#1F2937]">All Clients</h3>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                            <input type="text" placeholder="Search clients..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]" />
                        </div>
                        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                            className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg">
                            <option value="all">All Types</option>
                            <option value="hospital">Hospital</option>
                            <option value="clinic">Clinic</option>
                            <option value="care_home">Care Home</option>
                            <option value="private_practice">Private Practice</option>
                        </select>
                        <button onClick={handleExport} className="flex items-center gap-2 px-3 py-2 text-sm text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]">
                            <Download className="w-4 h-4" />Export
                        </button>
                        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 text-sm bg-[#10B981] text-white rounded-lg hover:bg-[#059669]">
                            <Plus className="w-4 h-4" />Add Client
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                                <th className="px-4 py-3 text-left text-xs text-[#6B7280]" style={{ fontWeight: 500 }}>Facility</th>
                                <th className="px-4 py-3 text-left text-xs text-[#6B7280]" style={{ fontWeight: 500 }}>Type</th>
                                <th className="px-4 py-3 text-left text-xs text-[#6B7280]" style={{ fontWeight: 500 }}>Contact</th>
                                <th className="px-4 py-3 text-left text-xs text-[#6B7280]" style={{ fontWeight: 500 }}>Active Shifts</th>
                                <th className="px-4 py-3 text-left text-xs text-[#6B7280]" style={{ fontWeight: 500 }}>Monthly Spend</th>
                                <th className="px-4 py-3 text-left text-xs text-[#6B7280]" style={{ fontWeight: 500 }}>Rating</th>
                                <th className="px-4 py-3 text-left text-xs text-[#6B7280]" style={{ fontWeight: 500 }}>Status</th>
                                <th className="px-4 py-3 text-left text-xs text-[#6B7280]" style={{ fontWeight: 500 }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClients.map(client => (
                                <tr key={client.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                                    <td className="px-4 py-3 cursor-pointer" onClick={() => onViewProfile?.(client.id)}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-[#F3F4F6] rounded-lg flex items-center justify-center">
                                                <Building2 className="w-4 h-4 text-[#6B7280]" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-[#1F2937]" style={{ fontWeight: 500 }}>{client.name}</p>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3 text-[#9CA3AF]" />
                                                    <span className="text-xs text-[#6B7280]">{client.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs border ${typeColors[client.type]}`}>{typeLabels[client.type]}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-sm text-[#1F2937]">{client.contactPerson}</p>
                                        <p className="text-xs text-[#6B7280]">{client.contactEmail}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>{client.activeShifts}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>€{client.monthlySpend.toLocaleString()}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                                            <span className="text-sm text-[#1F2937]">{client.avgRating}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs border ${client.status === 'active' ? 'bg-[#D1FAE5] text-[#059669] border-[#A7F3D0]' : 'bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]'
                                            }`}>{client.status === 'active' ? 'Active' : 'Inactive'}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => onViewProfile?.(client.id)}
                                                className="flex items-center justify-center w-8 h-8 text-[#6B7280] hover:text-[#10B981] hover:bg-[#ECFDF5] rounded-lg transition-colors"
                                                title="View Profile">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => openEditModal(client)}
                                                className="flex items-center justify-center w-8 h-8 text-[#6B7280] hover:text-[#3B82F6] hover:bg-[#EFF6FF] rounded-lg transition-colors"
                                                title="Edit Facility">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => { setSelectedClient(client); setShowArchiveModal(true); }}
                                                className="flex items-center justify-center w-8 h-8 text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition-colors"
                                                title="Archive Facility">
                                                <Archive className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Client Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-white">
                            <div>
                                <h3 className="text-[#1F2937]" style={{ fontWeight: 600 }}>Add New Client Facility</h3>
                                <p className="text-xs text-[#6B7280] mt-0.5 font-normal">Complete the multi-tab form to onboard a new healthcare facility with rich profile details</p>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="p-1.5 hover:bg-[#F3F4F6] rounded-lg transition-colors">
                                <X className="w-5 h-5 text-[#6B7280]" />
                            </button>
                        </div>

                        {/* Modal Tab Headers */}
                        <div className="flex border-b border-[#E5E7EB] px-6 bg-[#F9FAFB]">
                            {[
                                { id: 'overview' as const, label: '1. Overview & HIQA' },
                                { id: 'location' as const, label: '2. Location & HSE' },
                                { id: 'contacts' as const, label: '3. Contacts' },
                                { id: 'contract' as const, label: '4. Contract Terms' },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setModalTab(tab.id)}
                                    className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                                        modalTab === tab.id
                                            ? 'border-[#10B981] text-[#10B981]'
                                            : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div className="flex-1 overflow-y-auto px-6 py-6">
                            {modalTab === 'overview' && (
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <Building2 className="w-4 h-4 text-[#10B981]" />
                                            <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>Basic Information</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2">
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Facility Name <span className="text-[#EF4444]">*</span></label>
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="e.g., St. James's Hospital"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Facility Type <span className="text-[#EF4444]">*</span></label>
                                                <select
                                                    value={formData.type}
                                                    onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                >
                                                    <option value="hospital">Hospital</option>
                                                    <option value="clinic">Clinic</option>
                                                    <option value="care_home">Care Home</option>
                                                    <option value="private_practice">Private Practice</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Status <span className="text-[#EF4444]">*</span></label>
                                                <select
                                                    value={formData.status}
                                                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Ownership</label>
                                                <input
                                                    type="text"
                                                    value={formData.ownership}
                                                    onChange={e => setFormData({ ...formData, ownership: e.target.value })}
                                                    placeholder="e.g., Public (HSE Voluntary), Private"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Bed Capacity</label>
                                                <input
                                                    type="number"
                                                    value={formData.beds}
                                                    onChange={e => setFormData({ ...formData, beds: e.target.value })}
                                                    placeholder="e.g., 500"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Established Year</label>
                                                <input
                                                    type="number"
                                                    value={formData.established}
                                                    onChange={e => setFormData({ ...formData, established: e.target.value })}
                                                    placeholder="e.g., 1995"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div className="flex items-center mt-6">
                                                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#6B7280] font-medium">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.jciAccredited}
                                                        onChange={e => setFormData({ ...formData, jciAccredited: e.target.checked })}
                                                        className="w-4 h-4 rounded text-[#10B981] focus:ring-[#10B981] border-[#E5E7EB]"
                                                    />
                                                    Joint Commission International (JCI) Accredited
                                                </label>
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Description</label>
                                                <textarea
                                                    value={formData.description}
                                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                    placeholder="Describe the facility history, focus, and general overview..."
                                                    rows={3}
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* HIQA Compliance */}
                                    <div className="border-t border-[#E5E7EB] pt-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                                            <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>HIQA Compliance & Accreditation</h4>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">HIQA Registration Number</label>
                                                <input
                                                    type="text"
                                                    value={formData.hiqaRegistration}
                                                    onChange={e => setFormData({ ...formData, hiqaRegistration: e.target.value })}
                                                    placeholder="e.g., HIQA-OSV-0001234"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">HIQA Registration Status</label>
                                                <select
                                                    value={formData.hiqaStatus}
                                                    onChange={e => setFormData({ ...formData, hiqaStatus: e.target.value })}
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                >
                                                    <option value="Compliant">Compliant</option>
                                                    <option value="Substantially Compliant">Substantially Compliant</option>
                                                    <option value="Non-Compliant">Non-Compliant</option>
                                                    <option value="Pending Review">Pending Review</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Last Inspection Date</label>
                                                <input
                                                    type="date"
                                                    value={formData.hiqaLastInspection}
                                                    onChange={e => setFormData({ ...formData, hiqaLastInspection: e.target.value })}
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalTab === 'location' && (
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <MapPin className="w-4 h-4 text-[#3B82F6]" />
                                            <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>Location & Contact Details</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2">
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Full Address <span className="text-[#EF4444]">*</span></label>
                                                <input
                                                    type="text"
                                                    value={formData.address}
                                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                                    placeholder="e.g., James's Street, Dublin 8"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">City/Location <span className="text-[#EF4444]">*</span></label>
                                                <input
                                                    type="text"
                                                    value={formData.location}
                                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                                    placeholder="e.g., Dublin, Cork, Galway"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Eircode</label>
                                                <input
                                                    type="text"
                                                    value={formData.eircode}
                                                    onChange={e => setFormData({ ...formData, eircode: e.target.value })}
                                                    placeholder="e.g., D08 NHY1"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Main Phone <span className="text-[#EF4444]">*</span></label>
                                                <input
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                    placeholder="+353 1 410 3000"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Fax</label>
                                                <input
                                                    type="tel"
                                                    value={formData.fax}
                                                    onChange={e => setFormData({ ...formData, fax: e.target.value })}
                                                    placeholder="+353 1 410 3010"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Email Address <span className="text-[#EF4444]">*</span></label>
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                    placeholder="contact@facility.ie"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Website</label>
                                                <input
                                                    type="url"
                                                    value={formData.website}
                                                    onChange={e => setFormData({ ...formData, website: e.target.value })}
                                                    placeholder="www.facility.ie"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* HSE Information */}
                                    <div className="border-t border-[#E5E7EB] pt-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <FileText className="w-4 h-4 text-[#059669]" />
                                            <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>HSE Information</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">HSE Region</label>
                                                <select
                                                    value={formData.hseRegion}
                                                    onChange={e => setFormData({ ...formData, hseRegion: e.target.value })}
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                >
                                                    <option value="">Select Region</option>
                                                    <option value="HSE Dublin Midlands">HSE Dublin Midlands</option>
                                                    <option value="HSE South">HSE South</option>
                                                    <option value="HSE West">HSE West</option>
                                                    <option value="HSE Mid-West">HSE Mid-West</option>
                                                    <option value="HSE South East">HSE South East</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">HSE Area / CHO</label>
                                                <input
                                                    type="text"
                                                    value={formData.hseArea}
                                                    onChange={e => setFormData({ ...formData, hseArea: e.target.value })}
                                                    placeholder="e.g., CHO 7 - Dublin South City"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalTab === 'contacts' && (
                                <div className="space-y-6">
                                    {/* Primary Contact Person */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <Users className="w-4 h-4 text-[#8B5CF6]" />
                                            <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>Primary Contact Person</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Contact Name <span className="text-[#EF4444]">*</span></label>
                                                <input
                                                    type="text"
                                                    value={formData.contactPersonName}
                                                    onChange={e => setFormData({ ...formData, contactPersonName: e.target.value })}
                                                    placeholder="e.g., Siobhan O'Reilly"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Role/Position <span className="text-[#EF4444]">*</span></label>
                                                <input
                                                    type="text"
                                                    value={formData.contactPersonRole}
                                                    onChange={e => setFormData({ ...formData, contactPersonRole: e.target.value })}
                                                    placeholder="e.g., Locum Coordinator"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Contact Phone <span className="text-[#EF4444]">*</span></label>
                                                <input
                                                    type="tel"
                                                    value={formData.contactPersonPhone}
                                                    onChange={e => setFormData({ ...formData, contactPersonPhone: e.target.value })}
                                                    placeholder="+353 1 410 3100"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Mobile Phone</label>
                                                <input
                                                    type="tel"
                                                    value={formData.contactPersonMobile}
                                                    onChange={e => setFormData({ ...formData, contactPersonMobile: e.target.value })}
                                                    placeholder="+353 87 234 5678"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Contact Email <span className="text-[#EF4444]">*</span></label>
                                                <input
                                                    type="email"
                                                    value={formData.contactPersonEmail}
                                                    onChange={e => setFormData({ ...formData, contactPersonEmail: e.target.value })}
                                                    placeholder="siobhan.oreilly@stjames.ie"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Secondary Contact */}
                                    <div className="border-t border-[#E5E7EB] pt-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Users className="w-4 h-4 text-[#3B82F6]" />
                                            <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>Secondary Contact</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Contact Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.secondaryContactName}
                                                    onChange={e => setFormData({ ...formData, secondaryContactName: e.target.value })}
                                                    placeholder="e.g., Patrick Murphy"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Role/Position</label>
                                                <input
                                                    type="text"
                                                    value={formData.secondaryContactRole}
                                                    onChange={e => setFormData({ ...formData, secondaryContactRole: e.target.value })}
                                                    placeholder="e.g., HR Director"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Phone</label>
                                                <input
                                                    type="tel"
                                                    value={formData.secondaryContactPhone}
                                                    onChange={e => setFormData({ ...formData, secondaryContactPhone: e.target.value })}
                                                    placeholder="+353 1 410 3200"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Email</label>
                                                <input
                                                    type="email"
                                                    value={formData.secondaryContactEmail}
                                                    onChange={e => setFormData({ ...formData, secondaryContactEmail: e.target.value })}
                                                    placeholder="secondary@facility.ie"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Finance Contact */}
                                    <div className="border-t border-[#E5E7EB] pt-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Users className="w-4 h-4 text-[#F59E0B]" />
                                            <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>Finance Contact</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Contact Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.financeContactName}
                                                    onChange={e => setFormData({ ...formData, financeContactName: e.target.value })}
                                                    placeholder="e.g., Marie Kavanagh"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Role/Position</label>
                                                <input
                                                    type="text"
                                                    value={formData.financeContactRole}
                                                    onChange={e => setFormData({ ...formData, financeContactRole: e.target.value })}
                                                    placeholder="e.g., Accounts Payable"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Phone</label>
                                                <input
                                                    type="tel"
                                                    value={formData.financeContactPhone}
                                                    onChange={e => setFormData({ ...formData, financeContactPhone: e.target.value })}
                                                    placeholder="+353 1 410 3300"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Email</label>
                                                <input
                                                    type="email"
                                                    value={formData.financeContactEmail}
                                                    onChange={e => setFormData({ ...formData, financeContactEmail: e.target.value })}
                                                    placeholder="accounts@facility.ie"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalTab === 'contract' && (
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <Briefcase className="w-4 h-4 text-[#10B981]" />
                                            <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>Framework & Contract details</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Contract Reference Number</label>
                                                <input
                                                    type="text"
                                                    value={formData.contractRef}
                                                    onChange={e => setFormData({ ...formData, contractRef: e.target.value })}
                                                    placeholder="e.g., SJH-MPS-2025-001"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Framework Type</label>
                                                <input
                                                    type="text"
                                                    value={formData.frameworkType}
                                                    onChange={e => setFormData({ ...formData, frameworkType: e.target.value })}
                                                    placeholder="e.g., HSE National Framework"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Contract Start Date</label>
                                                <input
                                                    type="date"
                                                    value={formData.contractStartDate}
                                                    onChange={e => setFormData({ ...formData, contractStartDate: e.target.value })}
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Contract End Date</label>
                                                <input
                                                    type="date"
                                                    value={formData.contractEndDate}
                                                    onChange={e => setFormData({ ...formData, contractEndDate: e.target.value })}
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Payment Terms</label>
                                                <select
                                                    value={formData.paymentTerms}
                                                    onChange={e => setFormData({ ...formData, paymentTerms: e.target.value })}
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                >
                                                    <option value="Immediate">Immediate</option>
                                                    <option value="Net 15 days">Net 15 days</option>
                                                    <option value="Net 30 days">Net 30 days</option>
                                                    <option value="Net 60 days">Net 60 days</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Invoice Frequency</label>
                                                <select
                                                    value={formData.invoiceFrequency}
                                                    onChange={e => setFormData({ ...formData, invoiceFrequency: e.target.value })}
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                >
                                                    <option value="Weekly">Weekly</option>
                                                    <option value="Fortnightly">Fortnightly</option>
                                                    <option value="Monthly">Monthly</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Agency Margin (%)</label>
                                                <input
                                                    type="text"
                                                    value={formData.agencyMargin}
                                                    onChange={e => setFormData({ ...formData, agencyMargin: e.target.value })}
                                                    placeholder="e.g., 15%"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div className="flex items-center mt-6">
                                                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#6B7280] font-medium">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.poRequired}
                                                        onChange={e => setFormData({ ...formData, poRequired: e.target.checked })}
                                                        className="w-4 h-4 rounded text-[#10B981] focus:ring-[#10B981] border-[#E5E7EB]"
                                                    />
                                                    Purchase Order (PO) Required for Invoicing
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E7EB] bg-[#F9FAFB]">
                            <div className="flex gap-1.5">
                                {['overview', 'location', 'contacts', 'contract'].map((tab, idx) => (
                                    <div
                                        key={tab}
                                        className={`w-2 h-2 rounded-full transition-all ${
                                            modalTab === tab ? 'bg-[#10B981] w-4' : 'bg-[#E5E7EB]'
                                        }`}
                                    />
                                ))}
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 text-sm text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-white transition-colors bg-white font-medium"
                                >
                                    Cancel
                                </button>
                                {modalTab !== 'contract' ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const tabs: Array<'overview' | 'location' | 'contacts' | 'contract'> = ['overview', 'location', 'contacts', 'contract'];
                                            const currentIdx = tabs.indexOf(modalTab);
                                            setModalTab(tabs[currentIdx + 1]);
                                        }}
                                        className="px-4 py-2 text-sm bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors font-semibold flex items-center gap-1"
                                    >
                                        Next Section
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleAddClient}
                                        className="px-4 py-2 text-sm bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors flex items-center gap-2 font-semibold"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Create Client
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Client Modal */}
            {showEditModal && selectedClient && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-white">
                            <div>
                                <h3 className="text-[#1F2937]" style={{ fontWeight: 600 }}>Edit Facility: {selectedClient.name}</h3>
                                <p className="text-xs text-[#6B7280] mt-0.5 font-normal">Update the multi-tab form fields to edit this healthcare facility profile details</p>
                            </div>
                            <button onClick={() => setShowEditModal(false)} className="p-1.5 hover:bg-[#F3F4F6] rounded-lg transition-colors">
                                <X className="w-5 h-5 text-[#6B7280]" />
                            </button>
                        </div>

                        {/* Modal Tab Headers */}
                        <div className="flex border-b border-[#E5E7EB] px-6 bg-[#F9FAFB]">
                            {[
                                { id: 'overview' as const, label: '1. Overview & HIQA' },
                                { id: 'location' as const, label: '2. Location & HSE' },
                                { id: 'contacts' as const, label: '3. Contacts' },
                                { id: 'contract' as const, label: '4. Contract Terms' },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setModalTab(tab.id)}
                                    className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                                        modalTab === tab.id
                                            ? 'border-[#10B981] text-[#10B981]'
                                            : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div className="flex-1 overflow-y-auto px-6 py-6">
                            {modalTab === 'overview' && (
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <Building2 className="w-4 h-4 text-[#10B981]" />
                                            <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>Basic Information</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2">
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Facility Name <span className="text-[#EF4444]">*</span></label>
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="e.g., St. James's Hospital"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Facility Type <span className="text-[#EF4444]">*</span></label>
                                                <select
                                                    value={formData.type}
                                                    onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                >
                                                    <option value="hospital">Hospital</option>
                                                    <option value="clinic">Clinic</option>
                                                    <option value="care_home">Care Home</option>
                                                    <option value="private_practice">Private Practice</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Status <span className="text-[#EF4444]">*</span></label>
                                                <select
                                                    value={formData.status}
                                                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Ownership</label>
                                                <input
                                                    type="text"
                                                    value={formData.ownership}
                                                    onChange={e => setFormData({ ...formData, ownership: e.target.value })}
                                                    placeholder="e.g., Public (HSE Voluntary), Private"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Bed Capacity</label>
                                                <input
                                                    type="number"
                                                    value={formData.beds}
                                                    onChange={e => setFormData({ ...formData, beds: e.target.value })}
                                                    placeholder="e.g., 500"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Established Year</label>
                                                <input
                                                    type="number"
                                                    value={formData.established}
                                                    onChange={e => setFormData({ ...formData, established: e.target.value })}
                                                    placeholder="e.g., 1995"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div className="flex items-center mt-6">
                                                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#6B7280] font-medium">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.jciAccredited}
                                                        onChange={e => setFormData({ ...formData, jciAccredited: e.target.checked })}
                                                        className="w-4 h-4 rounded text-[#10B981] focus:ring-[#10B981] border-[#E5E7EB]"
                                                    />
                                                    Joint Commission International (JCI) Accredited
                                                </label>
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Description</label>
                                                <textarea
                                                    value={formData.description}
                                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                    placeholder="Describe the facility history, focus, and general overview..."
                                                    rows={3}
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* HIQA Compliance */}
                                    <div className="border-t border-[#E5E7EB] pt-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                                            <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>HIQA Compliance & Accreditation</h4>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">HIQA Registration Number</label>
                                                <input
                                                    type="text"
                                                    value={formData.hiqaRegistration}
                                                    onChange={e => setFormData({ ...formData, hiqaRegistration: e.target.value })}
                                                    placeholder="e.g., HIQA-OSV-0001234"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">HIQA Registration Status</label>
                                                <select
                                                    value={formData.hiqaStatus}
                                                    onChange={e => setFormData({ ...formData, hiqaStatus: e.target.value })}
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                >
                                                    <option value="Compliant">Compliant</option>
                                                    <option value="Substantially Compliant">Substantially Compliant</option>
                                                    <option value="Non-Compliant">Non-Compliant</option>
                                                    <option value="Pending Review">Pending Review</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Last Inspection Date</label>
                                                <input
                                                    type="date"
                                                    value={formData.hiqaLastInspection}
                                                    onChange={e => setFormData({ ...formData, hiqaLastInspection: e.target.value })}
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalTab === 'location' && (
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <MapPin className="w-4 h-4 text-[#3B82F6]" />
                                            <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>Location & Contact Details</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2">
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Full Address <span className="text-[#EF4444]">*</span></label>
                                                <input
                                                    type="text"
                                                    value={formData.address}
                                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                                    placeholder="e.g., James's Street, Dublin 8"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">City/Location <span className="text-[#EF4444]">*</span></label>
                                                <input
                                                    type="text"
                                                    value={formData.location}
                                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                                    placeholder="e.g., Dublin, Cork, Galway"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Eircode</label>
                                                <input
                                                    type="text"
                                                    value={formData.eircode}
                                                    onChange={e => setFormData({ ...formData, eircode: e.target.value })}
                                                    placeholder="e.g., D08 NHY1"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Main Phone <span className="text-[#EF4444]">*</span></label>
                                                <input
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                    placeholder="+353 1 410 3000"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Fax</label>
                                                <input
                                                    type="tel"
                                                    value={formData.fax}
                                                    onChange={e => setFormData({ ...formData, fax: e.target.value })}
                                                    placeholder="+353 1 410 3010"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Email Address <span className="text-[#EF4444]">*</span></label>
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                    placeholder="contact@facility.ie"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Website</label>
                                                <input
                                                    type="url"
                                                    value={formData.website}
                                                    onChange={e => setFormData({ ...formData, website: e.target.value })}
                                                    placeholder="www.facility.ie"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* HSE Information */}
                                    <div className="border-t border-[#E5E7EB] pt-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <FileText className="w-4 h-4 text-[#059669]" />
                                            <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>HSE Information</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">HSE Region</label>
                                                <select
                                                    value={formData.hseRegion}
                                                    onChange={e => setFormData({ ...formData, hseRegion: e.target.value })}
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                >
                                                    <option value="">Select Region</option>
                                                    <option value="HSE Dublin Midlands">HSE Dublin Midlands</option>
                                                    <option value="HSE South">HSE South</option>
                                                    <option value="HSE West">HSE West</option>
                                                    <option value="HSE Mid-West">HSE Mid-West</option>
                                                    <option value="HSE South East">HSE South East</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">HSE Area / CHO</label>
                                                <input
                                                    type="text"
                                                    value={formData.hseArea}
                                                    onChange={e => setFormData({ ...formData, hseArea: e.target.value })}
                                                    placeholder="e.g., CHO 7 - Dublin South City"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalTab === 'contacts' && (
                                <div className="space-y-6">
                                    {/* Primary Contact Person */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <Users className="w-4 h-4 text-[#8B5CF6]" />
                                            <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>Primary Contact Person</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Contact Name <span className="text-[#EF4444]">*</span></label>
                                                <input
                                                    type="text"
                                                    value={formData.contactPersonName}
                                                    onChange={e => setFormData({ ...formData, contactPersonName: e.target.value })}
                                                    placeholder="e.g., Siobhan O'Reilly"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Role/Position <span className="text-[#EF4444]">*</span></label>
                                                <input
                                                    type="text"
                                                    value={formData.contactPersonRole}
                                                    onChange={e => setFormData({ ...formData, contactPersonRole: e.target.value })}
                                                    placeholder="e.g., Locum Coordinator"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Contact Phone <span className="text-[#EF4444]">*</span></label>
                                                <input
                                                    type="tel"
                                                    value={formData.contactPersonPhone}
                                                    onChange={e => setFormData({ ...formData, contactPersonPhone: e.target.value })}
                                                    placeholder="+353 1 410 3100"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Mobile Phone</label>
                                                <input
                                                    type="tel"
                                                    value={formData.contactPersonMobile}
                                                    onChange={e => setFormData({ ...formData, contactPersonMobile: e.target.value })}
                                                    placeholder="+353 87 234 5678"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Contact Email <span className="text-[#EF4444]">*</span></label>
                                                <input
                                                    type="email"
                                                    value={formData.contactPersonEmail}
                                                    onChange={e => setFormData({ ...formData, contactPersonEmail: e.target.value })}
                                                    placeholder="siobhan.oreilly@stjames.ie"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Secondary Contact */}
                                    <div className="border-t border-[#E5E7EB] pt-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Users className="w-4 h-4 text-[#3B82F6]" />
                                            <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>Secondary Contact</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Contact Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.secondaryContactName}
                                                    onChange={e => setFormData({ ...formData, secondaryContactName: e.target.value })}
                                                    placeholder="e.g., Patrick Murphy"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Role/Position</label>
                                                <input
                                                    type="text"
                                                    value={formData.secondaryContactRole}
                                                    onChange={e => setFormData({ ...formData, secondaryContactRole: e.target.value })}
                                                    placeholder="e.g., HR Director"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Phone</label>
                                                <input
                                                    type="tel"
                                                    value={formData.secondaryContactPhone}
                                                    onChange={e => setFormData({ ...formData, secondaryContactPhone: e.target.value })}
                                                    placeholder="+353 1 410 3200"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Email</label>
                                                <input
                                                    type="email"
                                                    value={formData.secondaryContactEmail}
                                                    onChange={e => setFormData({ ...formData, secondaryContactEmail: e.target.value })}
                                                    placeholder="secondary@facility.ie"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Finance Contact */}
                                    <div className="border-t border-[#E5E7EB] pt-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Users className="w-4 h-4 text-[#F59E0B]" />
                                            <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>Finance Contact</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Contact Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.financeContactName}
                                                    onChange={e => setFormData({ ...formData, financeContactName: e.target.value })}
                                                    placeholder="e.g., Marie Kavanagh"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Role/Position</label>
                                                <input
                                                    type="text"
                                                    value={formData.financeContactRole}
                                                    onChange={e => setFormData({ ...formData, financeContactRole: e.target.value })}
                                                    placeholder="e.g., Accounts Payable"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Phone</label>
                                                <input
                                                    type="tel"
                                                    value={formData.financeContactPhone}
                                                    onChange={e => setFormData({ ...formData, financeContactPhone: e.target.value })}
                                                    placeholder="+353 1 410 3300"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Email</label>
                                                <input
                                                    type="email"
                                                    value={formData.financeContactEmail}
                                                    onChange={e => setFormData({ ...formData, financeContactEmail: e.target.value })}
                                                    placeholder="accounts@facility.ie"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalTab === 'contract' && (
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <Briefcase className="w-4 h-4 text-[#10B981]" />
                                            <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>Framework & Contract details</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Contract Reference Number</label>
                                                <input
                                                    type="text"
                                                    value={formData.contractRef}
                                                    onChange={e => setFormData({ ...formData, contractRef: e.target.value })}
                                                    placeholder="e.g., SJH-MPS-2025-001"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Framework Type</label>
                                                <input
                                                    type="text"
                                                    value={formData.frameworkType}
                                                    onChange={e => setFormData({ ...formData, frameworkType: e.target.value })}
                                                    placeholder="e.g., HSE National Framework"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Contract Start Date</label>
                                                <input
                                                    type="date"
                                                    value={formData.contractStartDate}
                                                    onChange={e => setFormData({ ...formData, contractStartDate: e.target.value })}
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Contract End Date</label>
                                                <input
                                                    type="date"
                                                    value={formData.contractEndDate}
                                                    onChange={e => setFormData({ ...formData, contractEndDate: e.target.value })}
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Payment Terms</label>
                                                <select
                                                    value={formData.paymentTerms}
                                                    onChange={e => setFormData({ ...formData, paymentTerms: e.target.value })}
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                >
                                                    <option value="Immediate">Immediate</option>
                                                    <option value="Net 15 days">Net 15 days</option>
                                                    <option value="Net 30 days">Net 30 days</option>
                                                    <option value="Net 60 days">Net 60 days</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Invoice Frequency</label>
                                                <select
                                                    value={formData.invoiceFrequency}
                                                    onChange={e => setFormData({ ...formData, invoiceFrequency: e.target.value })}
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                >
                                                    <option value="Weekly">Weekly</option>
                                                    <option value="Fortnightly">Fortnightly</option>
                                                    <option value="Monthly">Monthly</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] mb-1.5 font-medium">Agency Margin (%)</label>
                                                <input
                                                    type="text"
                                                    value={formData.agencyMargin}
                                                    onChange={e => setFormData({ ...formData, agencyMargin: e.target.value })}
                                                    placeholder="e.g., 15%"
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div className="flex items-center mt-6">
                                                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#6B7280] font-medium">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.poRequired}
                                                        onChange={e => setFormData({ ...formData, poRequired: e.target.checked })}
                                                        className="w-4 h-4 rounded text-[#10B981] focus:ring-[#10B981] border-[#E5E7EB]"
                                                    />
                                                    Purchase Order (PO) Required for Invoicing
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E7EB] bg-[#F9FAFB]">
                            <div className="flex gap-1.5">
                                {['overview', 'location', 'contacts', 'contract'].map((tab, idx) => (
                                    <div
                                        key={tab}
                                        className={`w-2 h-2 rounded-full transition-all ${
                                            modalTab === tab ? 'bg-[#10B981] w-4' : 'bg-[#E5E7EB]'
                                        }`}
                                    />
                                ))}
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 text-sm text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-white transition-colors bg-white font-medium"
                                >
                                    Cancel
                                </button>
                                {modalTab !== 'contract' ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const tabs: Array<'overview' | 'location' | 'contacts' | 'contract'> = ['overview', 'location', 'contacts', 'contract'];
                                            const currentIdx = tabs.indexOf(modalTab);
                                            setModalTab(tabs[currentIdx + 1]);
                                        }}
                                        className="px-4 py-2 text-sm bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors font-semibold flex items-center gap-1"
                                    >
                                        Next Section
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleEditClient}
                                        className="px-4 py-2 text-sm bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors flex items-center gap-2 font-semibold"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Save Changes
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Archive Client Modal */}
            {showArchiveModal && selectedClient && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
                    <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-[#FEF2F2] text-[#EF4444] rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-[#FEE2E2]">
                                <Archive className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg text-[#1F2937] mb-2" style={{ fontWeight: 700 }}>Archive Facility?</h3>
                            <p className="text-sm text-[#6B7280] mb-6">
                                Are you sure you want to archive <strong>{selectedClient.name}</strong>? This will deactivate the facility and remove it from the active directory.
                            </p>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={handleArchiveClient}
                                    className="w-full py-2.5 bg-[#EF4444] text-white rounded-lg font-bold hover:bg-[#DC2626] transition-colors"
                                >
                                    Yes, Archive Facility
                                </button>
                                <button
                                    onClick={() => setShowArchiveModal(false)}
                                    className="w-full py-2.5 text-[#6B7280] font-medium hover:bg-[#F3F4F6] rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}