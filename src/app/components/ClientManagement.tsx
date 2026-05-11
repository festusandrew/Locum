import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
    Building2, Search, Plus, MapPin, Phone, Mail, Star, Users,
    Eye, X, ChevronDown, Download, SlidersHorizontal, MessageCircle,
    FileText, Calendar, DollarSign, Edit, MoreVertical, Archive
} from 'lucide-react';
import { Client } from '../types';
import { clientService } from '../services/clientService';

const feedbackData = [
    { id: 'FB-001', client: "St. James's Hospital", locum: 'Dr. Sarah Mitchell', rating: 5, comment: 'Excellent surgeon, highly professional. Would definitely book again.', date: '2026-02-08' },
    { id: 'FB-002', client: 'Cork University Hospital', locum: 'Dr. James Harrison', rating: 4, comment: 'Good cardiologist, punctual and reliable.', date: '2026-02-06' },
    { id: 'FB-003', client: 'Galway Clinic', locum: 'Dr. Emily Chen', rating: 5, comment: 'Outstanding anesthesiologist. Patients felt very comfortable.', date: '2026-02-05' },
    { id: 'FB-004', client: "St. James's Hospital", locum: 'Dr. Michael Brooks', rating: 3, comment: 'Competent but arrived 15 minutes late to shift.', date: '2026-02-03' },
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
            complianceReqs: ['Medical License', 'Garda Vetting']
        };

        try {
            await clientService.create(newClient);
            // Refresh list from localStorage to guarantee persistence synchronization
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
        setFormData({
            name: client.name,
            type: client.type,
            address: client.address,
            eircode: '', // Assuming not in current client object
            location: client.location,
            phone: client.contactPhone,
            fax: '',
            email: client.contactEmail,
            website: '',
            hseRegion: '',
            hseArea: '',
            beds: '',
            ownership: '',
            contactPersonName: client.contactPerson,
            contactPersonRole: '',
            contactPersonPhone: client.contactPhone,
            contactPersonMobile: '',
            contactPersonEmail: client.contactEmail,
            status: client.status,
        });
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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
                    <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
                            <div>
                                <h3 className="text-[#1F2937]" style={{ fontWeight: 600 }}>Add New Client</h3>
                                <p className="text-xs text-[#6B7280] mt-0.5">Complete the form to onboard a new healthcare facility</p>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors">
                                <X className="w-5 h-5 text-[#6B7280]" />
                            </button>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div className="flex-1 overflow-y-auto px-6 py-6">
                            <div className="space-y-6">
                                {/* Basic Information */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Building2 className="w-4 h-4 text-[#10B981]" />
                                        <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>Basic Information</h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-xs text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>Facility Name <span className="text-[#EF4444]">*</span></label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="e.g., St. James's Hospital"
                                                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>Facility Type <span className="text-[#EF4444]">*</span></label>
                                            <select
                                                value={formData.type}
                                                onChange={e => setFormData({ ...formData, type: e.target.value as 'hospital' | 'clinic' | 'care_home' | 'private_practice' })}
                                                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            >
                                                <option value="hospital">Hospital</option>
                                                <option value="clinic">Clinic</option>
                                                <option value="care_home">Care Home</option>
                                                <option value="private_practice">Private Practice</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>Status <span className="text-[#EF4444]">*</span></label>
                                            <select
                                                value={formData.status}
                                                onChange={e => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' | 'pending' })}
                                                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>Ownership</label>
                                            <input
                                                type="text"
                                                value={formData.ownership}
                                                onChange={e => setFormData({ ...formData, ownership: e.target.value })}
                                                placeholder="e.g., Public (HSE), Private"
                                                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>Bed Capacity</label>
                                            <input
                                                type="number"
                                                value={formData.beds}
                                                onChange={e => setFormData({ ...formData, beds: e.target.value })}
                                                placeholder="e.g., 500"
                                                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Location & Contact Details */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <MapPin className="w-4 h-4 text-[#3B82F6]" />
                                        <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>Location & Contact Details</h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-xs text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>Full Address <span className="text-[#EF4444]">*</span></label>
                                            <input
                                                type="text"
                                                value={formData.address}
                                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                                placeholder="e.g., James's Street, Dublin 8"
                                                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>City/Location <span className="text-[#EF4444]">*</span></label>
                                            <input
                                                type="text"
                                                value={formData.location}
                                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                                placeholder="e.g., Dublin, Cork, Galway"
                                                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>Eircode</label>
                                            <input
                                                type="text"
                                                value={formData.eircode}
                                                onChange={e => setFormData({ ...formData, eircode: e.target.value })}
                                                placeholder="e.g., D08 NHY1"
                                                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>Main Phone <span className="text-[#EF4444]">*</span></label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder="+353 1 234 5678"
                                                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>Fax</label>
                                            <input
                                                type="tel"
                                                value={formData.fax}
                                                onChange={e => setFormData({ ...formData, fax: e.target.value })}
                                                placeholder="+353 1 234 5679"
                                                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>Email <span className="text-[#EF4444]">*</span></label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="contact@facility.ie"
                                                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>Website</label>
                                            <input
                                                type="url"
                                                value={formData.website}
                                                onChange={e => setFormData({ ...formData, website: e.target.value })}
                                                placeholder="www.facility.ie"
                                                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* HSE Information */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <FileText className="w-4 h-4 text-[#059669]" />
                                        <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>HSE Information</h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>HSE Region</label>
                                            <select
                                                value={formData.hseRegion}
                                                onChange={e => setFormData({ ...formData, hseRegion: e.target.value })}
                                                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
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
                                            <label className="block text-xs text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>HSE Area / CHO</label>
                                            <input
                                                type="text"
                                                value={formData.hseArea}
                                                onChange={e => setFormData({ ...formData, hseArea: e.target.value })}
                                                placeholder="e.g., CHO 7 - Dublin South City"
                                                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Primary Contact Person */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Users className="w-4 h-4 text-[#8B5CF6]" />
                                        <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>Primary Contact Person</h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>Contact Name <span className="text-[#EF4444]">*</span></label>
                                            <input
                                                type="text"
                                                value={formData.contactPersonName}
                                                onChange={e => setFormData({ ...formData, contactPersonName: e.target.value })}
                                                placeholder="e.g., Siobhan O'Reilly"
                                                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>Role/Position <span className="text-[#EF4444]">*</span></label>
                                            <input
                                                type="text"
                                                value={formData.contactPersonRole}
                                                onChange={e => setFormData({ ...formData, contactPersonRole: e.target.value })}
                                                placeholder="e.g., Locum Coordinator"
                                                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>Contact Phone <span className="text-[#EF4444]">*</span></label>
                                            <input
                                                type="tel"
                                                value={formData.contactPersonPhone}
                                                onChange={e => setFormData({ ...formData, contactPersonPhone: e.target.value })}
                                                placeholder="+353 1 234 5678"
                                                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>Mobile Phone</label>
                                            <input
                                                type="tel"
                                                value={formData.contactPersonMobile}
                                                onChange={e => setFormData({ ...formData, contactPersonMobile: e.target.value })}
                                                placeholder="+353 87 123 4567"
                                                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>Contact Email <span className="text-[#EF4444]">*</span></label>
                                            <input
                                                type="email"
                                                value={formData.contactPersonEmail}
                                                onChange={e => setFormData({ ...formData, contactPersonEmail: e.target.value })}
                                                placeholder="contact@facility.ie"
                                                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Info Note */}
                                <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg p-4">
                                    <p className="text-xs text-[#1E40AF]">
                                        <span style={{ fontWeight: 600 }}>Note:</span> Additional details such as contract terms, compliance requirements, and department information can be added after creating the client record.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E7EB] bg-[#F9FAFB]">
                            <p className="text-xs text-[#6B7280]"><span className="text-[#EF4444]">*</span> Required fields</p>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 text-sm text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAddClient}
                                    className="px-4 py-2 text-sm bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Create Client
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Client Modal */}
            {showEditModal && selectedClient && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
                    <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
                            <div>
                                <h3 className="text-[#1F2937]" style={{ fontWeight: 600 }}>Edit Facility: {selectedClient.name}</h3>
                                <p className="text-xs text-[#6B7280] mt-0.5">Update facility details and contact information</p>
                            </div>
                            <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors">
                                <X className="w-5 h-5 text-[#6B7280]" />
                            </button>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div className="flex-1 overflow-y-auto px-6 py-6">
                            <div className="space-y-6">
                                {/* Basic Information */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Building2 className="w-4 h-4 text-[#10B981]" />
                                        <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>Basic Information</h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-xs text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>Facility Name <span className="text-[#EF4444]">*</span></label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>Facility Type <span className="text-[#EF4444]">*</span></label>
                                            <select
                                                value={formData.type}
                                                onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            >
                                                <option value="hospital">Hospital</option>
                                                <option value="clinic">Clinic</option>
                                                <option value="care_home">Care Home</option>
                                                <option value="private_practice">Private Practice</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>Status <span className="text-[#EF4444]">*</span></label>
                                            <select
                                                value={formData.status}
                                                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Location & Contact */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <MapPin className="w-4 h-4 text-[#3B82F6]" />
                                        <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>Location & Contact</h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-xs text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>Full Address</label>
                                            <input
                                                type="text"
                                                value={formData.address}
                                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>Location <span className="text-[#EF4444]">*</span></label>
                                            <input
                                                type="text"
                                                value={formData.location}
                                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>Contact Email <span className="text-[#EF4444]">*</span></label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Person */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Users className="w-4 h-4 text-[#8B5CF6]" />
                                        <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>Primary Contact Person</h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>Contact Name</label>
                                            <input
                                                type="text"
                                                value={formData.contactPersonName}
                                                onChange={e => setFormData({ ...formData, contactPersonName: e.target.value })}
                                                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>Contact Phone</label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end px-6 py-4 border-t border-[#E5E7EB] bg-[#F9FAFB] gap-3">
                            <button
                                type="button"
                                onClick={() => setShowEditModal(false)}
                                className="px-4 py-2 text-sm text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleEditClient}
                                className="px-4 py-2 text-sm bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors flex items-center gap-2"
                            >
                                <Edit className="w-4 h-4" />
                                Save Changes
                            </button>
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