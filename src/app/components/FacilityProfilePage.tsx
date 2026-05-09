import { useState } from 'react';
import {
    ArrowLeft, Building2, MapPin, Phone, Mail, Globe, Star, Users,
    Calendar, Clock, FileText, ShieldCheck, Download, Edit, MoreHorizontal,
    CheckCircle, AlertTriangle, User, Banknote, CreditCard, Award,
    MessageSquare, Activity, Briefcase, Heart, Hash, BadgeCheck, Bed
} from 'lucide-react';

interface FacilityProfilePageProps {
    facilityId: string;
    onBack: () => void;
}

const facilityProfiles: Record<string, any> = {
    'CL-001': {
        id: 'CL-001', name: "St. James's Hospital", type: 'hospital', status: 'active',
        overview: {
            address: "James's Street, Dublin 8, D08 NHY1",
            eircode: 'D08 NHY1',
            phone: '+353 1 410 3000',
            fax: '+353 1 410 3010',
            email: 'locum.bookings@stjames.ie',
            website: 'www.stjames.ie',
            hseRegion: 'HSE Dublin Midlands',
            hseArea: 'CHO 7 - Dublin South City',
            beds: 1000,
            established: 1727,
            ownership: 'Public (HSE Voluntary)',
            hiqaRegistration: 'HIQA-OSV-0001234',
            hiqaLastInspection: '2025-09-15',
            hiqaStatus: 'Compliant',
            jciAccredited: true,
            description: "St. James's Hospital is Ireland's largest acute academic teaching hospital. It serves as the national centre for several specialties and is the primary teaching hospital of Trinity College Dublin.",
        },
        contacts: {
            primary: { name: "Siobhan O'Reilly", role: 'Locum Coordinator / HR Manager', phone: '+353 1 410 3100', email: 'siobhan.oreilly@stjames.ie', mobile: '+353 87 234 5678' },
            secondary: { name: 'Dr. Paul Connolly', role: 'Director of Medical Staffing', phone: '+353 1 410 3200', email: 'paul.connolly@stjames.ie', mobile: '+353 86 345 6789' },
            finance: { name: 'Marie Kavanagh', role: 'Accounts Payable Manager', phone: '+353 1 410 3300', email: 'accounts@stjames.ie', mobile: '' },
            nursing: { name: 'Catherine Doyle', role: 'Director of Nursing', phone: '+353 1 410 3400', email: 'catherine.doyle@stjames.ie', mobile: '+353 87 456 7890' },
            escalation: { name: 'Dr. Eamon Walsh', role: 'CEO / Hospital Manager', phone: '+353 1 410 3001', email: 'ceo@stjames.ie', mobile: '' },
        },
        departments: [
            { name: 'General Surgery', locumDemand: 'High', avgShiftsPerMonth: 24, preferredGrade: 'Consultant / Registrar', currentVacancies: 3 },
            { name: 'Emergency Medicine', locumDemand: 'High', avgShiftsPerMonth: 40, preferredGrade: 'SHO / Registrar', currentVacancies: 5 },
            { name: 'Cardiology', locumDemand: 'Medium', avgShiftsPerMonth: 12, preferredGrade: 'Consultant', currentVacancies: 1 },
            { name: 'Anesthesiology', locumDemand: 'High', avgShiftsPerMonth: 30, preferredGrade: 'Consultant / Registrar', currentVacancies: 4 },
            { name: 'Orthopedics', locumDemand: 'Medium', avgShiftsPerMonth: 16, preferredGrade: 'Consultant', currentVacancies: 2 },
            { name: 'Pediatrics', locumDemand: 'Low', avgShiftsPerMonth: 8, preferredGrade: 'Registrar', currentVacancies: 0 },
        ],
        contract: {
            frameworkType: 'HSE National Framework Agreement',
            contractRef: 'SJH-MPS-2025-001',
            startDate: '2025-01-01',
            endDate: '2027-12-31',
            autoRenewal: true,
            paymentTerms: 'Net 30 days',
            invoiceFrequency: 'Fortnightly',
            poRequired: true,
            agreedRates: {
                consultantDay: 1200,
                consultantNight: 1500,
                consultantWeekend: 1600,
                registrarDay: 750,
                registrarNight: 950,
                registrarWeekend: 1000,
                shoDay: 500,
                shoNight: 650,
                shoWeekend: 700,
            },
            agencyMargin: '15%',
            vatApplicable: true,
            vatRate: '23%',
        },
        compliance: {
            requirements: [
                { name: 'Medical Council of Ireland Registration', mandatory: true, description: 'Current registration with IMC on General or Specialist Register' },
                { name: 'Garda Vetting (NVB Clearance)', mandatory: true, description: 'National Vetting Bureau clearance within last 3 years' },
                { name: 'Professional Indemnity Insurance', mandatory: true, description: 'Minimum cover of €2.5M per occurrence' },
                { name: 'BLS / CPR Certification', mandatory: true, description: 'Current Basic Life Support certification (ARC or equivalent)' },
                { name: 'ACLS Certification', mandatory: true, description: 'Advanced Cardiac Life Support for ED and critical care roles' },
                { name: 'Manual Handling Certificate', mandatory: true, description: 'Patient Manual Handling training within last 3 years' },
                { name: 'Hand Hygiene Training (HSELanD)', mandatory: true, description: 'HSE online hand hygiene module completion' },
                { name: 'Children First E-Learning', mandatory: true, description: 'Children First national guidance awareness training' },
                { name: 'Infection Prevention & Control', mandatory: true, description: 'IPC awareness module completion' },
                { name: 'HIQA Standards Awareness', mandatory: false, description: 'Familiarity with HIQA National Standards for Safer Better Healthcare' },
                { name: 'Right to Work Verification', mandatory: true, description: 'Proof of Irish/EU citizenship or valid work permit (Stamp 4 / Critical Skills)' },
                { name: 'Two Professional References', mandatory: true, description: 'Two recent professional references from senior clinicians' },
                { name: 'Photo ID', mandatory: true, description: 'Valid passport or national ID' },
                { name: 'Current CV', mandatory: true, description: 'Updated curriculum vitae within last 6 months' },
            ],
        },
        financial: {
            monthlySpend: 48500,
            ytdSpend: 97000,
            annualBudget: 620000,
            totalSpendAllTime: 1850000,
            avgInvoiceAmount: 24250,
            outstandingBalance: 12300,
            lastPaymentDate: '2026-02-05',
            lastPaymentAmount: 24100,
            recentInvoices: [
                { id: 'INV-SJH-2026-004', date: '2026-02-01', period: '16-31 Jan 2026', amount: 24100, status: 'paid', paidDate: '2026-02-05' },
                { id: 'INV-SJH-2026-003', date: '2026-01-16', period: '01-15 Jan 2026', amount: 24900, status: 'paid', paidDate: '2026-01-22' },
                { id: 'INV-SJH-2026-002', date: '2026-01-01', period: '16-31 Dec 2025', amount: 12300, status: 'overdue', paidDate: null },
                { id: 'INV-SJH-2026-001', date: '2025-12-16', period: '01-15 Dec 2025', amount: 22800, status: 'paid', paidDate: '2025-12-30' },
            ],
        },
        bookings: {
            totalBookings: 342, activeShifts: 12, pendingBookings: 4,
            completionRate: 96, cancellationRate: 2.8,
            preferredLocums: 15,
            recentBookings: [
                { id: 'BK-3401', locum: 'Dr. Sarah Mitchell', department: 'General Surgery', date: '2026-02-12', time: '08:00-18:00', status: 'confirmed' },
                { id: 'BK-3398', locum: 'Dr. Emily Chen', department: 'Anesthesiology', date: '2026-02-12', time: '08:00-16:00', status: 'confirmed' },
                { id: 'BK-3395', locum: 'Dr. Sarah Mitchell', department: 'Surgical On-Call', date: '2026-02-14', time: '20:00-08:00', status: 'confirmed' },
                { id: 'BK-3390', locum: 'TBC', department: 'Emergency Medicine', date: '2026-02-15', time: '08:00-20:00', status: 'pending' },
                { id: 'BK-3385', locum: 'Dr. Rachel Martinez', department: 'Pediatrics', date: '2026-02-13', time: '09:00-17:00', status: 'confirmed' },
                { id: 'BK-3380', locum: 'Dr. James Harrison', department: 'Cardiology', date: '2026-02-10', time: '08:00-18:00', status: 'completed' },
            ],
        },
        ratings: {
            avgRating: 4.8, totalReviews: 67,
            categories: {
                'Working Environment': 4.9,
                'Staff Friendliness': 4.8,
                'Facilities & Equipment': 4.7,
                'Communication': 4.8,
                'Payment Timeliness': 4.6,
                'Overall Satisfaction': 4.8,
            },
            recentFeedback: [
                { locum: 'Dr. Sarah Mitchell', rating: 5, date: '2026-02-08', comment: 'Excellent theatre facilities. Nursing staff very supportive and professional. Great hospital to work in.' },
                { locum: 'Dr. Emily Chen', rating: 5, date: '2026-02-05', comment: 'Well-organized anaesthetics department. Clear protocols. Always happy to locum here.' },
                { locum: 'Dr. Michael Brooks', rating: 4, date: '2026-02-01', comment: 'Good ED setup but can get overwhelmed at peak times. Staff are great though.' },
                { locum: 'Dr. Rachel Martinez', rating: 5, date: '2026-01-28', comment: 'Fantastic paeds department. Very welcoming to locums.' },
            ],
        },
        notes: [
            { date: '2026-02-08', author: 'Omar Murphy', content: 'Meeting with Siobhan re: Q2 locum requirements. Expecting increased demand in ED and surgery. Need to pre-book preferred locums.' },
            { date: '2026-01-20', author: 'Lisa Keane', content: 'Invoice dispute resolved for INV-SJH-2025-024. Overcharge of 3 hours corrected.' },
            { date: '2025-12-15', author: 'Omar Murphy', content: 'Annual contract review completed. Rates adjusted +3% per HSE framework. New PO process in place for 2026.' },
        ],
    },
    'CL-002': {
        id: 'CL-002', name: 'Cork University Hospital', type: 'hospital', status: 'active',
        overview: {
            address: 'Wilton, Cork, T12 DC4A',
            eircode: 'T12 DC4A',
            phone: '+353 21 492 2000',
            fax: '+353 21 492 2010',
            email: 'locum.coordinator@cuh.ie',
            website: 'www.cuh.hse.ie',
            hseRegion: 'HSE South',
            hseArea: 'CHO 4 - Cork / Kerry',
            beds: 800,
            established: 1978,
            ownership: 'Public (HSE)',
            hiqaRegistration: 'HIQA-OSV-0002345',
            hiqaLastInspection: '2025-07-20',
            hiqaStatus: 'Compliant',
            jciAccredited: false,
            description: 'Cork University Hospital is a major academic teaching hospital and the largest hospital in the HSE South region, providing tertiary referral services across a wide range of specialties.',
        },
        contacts: {
            primary: { name: 'Patrick Murphy', role: 'Medical HR Coordinator', phone: '+353 21 492 2100', email: 'pmurphy@cuh.ie', mobile: '+353 86 123 4567' },
            secondary: { name: 'Dr. Deirdre Collins', role: 'Clinical Director', phone: '+353 21 492 2200', email: 'dcollins@cuh.ie', mobile: '' },
            finance: { name: 'Tom Fitzgerald', role: 'Finance Manager', phone: '+353 21 492 2300', email: 'finance@cuh.ie', mobile: '' },
            nursing: { name: 'Mary O\'Sullivan', role: 'Director of Nursing', phone: '+353 21 492 2400', email: 'mosullivan@cuh.ie', mobile: '' },
            escalation: { name: 'Dr. Brian Lenehan', role: 'CEO', phone: '+353 21 492 2001', email: 'ceo@cuh.ie', mobile: '' },
        },
        departments: [
            { name: 'Cardiology', locumDemand: 'High', avgShiftsPerMonth: 20, preferredGrade: 'Consultant', currentVacancies: 2 },
            { name: 'Emergency Medicine', locumDemand: 'High', avgShiftsPerMonth: 32, preferredGrade: 'SHO / Registrar', currentVacancies: 4 },
            { name: 'General Medicine', locumDemand: 'Medium', avgShiftsPerMonth: 16, preferredGrade: 'Registrar', currentVacancies: 2 },
            { name: 'Orthopedics', locumDemand: 'Medium', avgShiftsPerMonth: 12, preferredGrade: 'Consultant', currentVacancies: 1 },
        ],
        contract: {
            frameworkType: 'HSE National Framework Agreement',
            contractRef: 'CUH-MPS-2025-002',
            startDate: '2025-01-01',
            endDate: '2027-12-31',
            autoRenewal: true,
            paymentTerms: 'Net 30 days',
            invoiceFrequency: 'Fortnightly',
            poRequired: true,
            agreedRates: {
                consultantDay: 1150,
                consultantNight: 1400,
                consultantWeekend: 1500,
                registrarDay: 700,
                registrarNight: 900,
                registrarWeekend: 950,
                shoDay: 480,
                shoNight: 620,
                shoWeekend: 680,
            },
            agencyMargin: '15%',
            vatApplicable: true,
            vatRate: '23%',
        },
        compliance: {
            requirements: [
                { name: 'Medical Council of Ireland Registration', mandatory: true, description: 'Current registration with IMC' },
                { name: 'Garda Vetting (NVB Clearance)', mandatory: true, description: 'National Vetting Bureau clearance' },
                { name: 'Professional Indemnity Insurance', mandatory: true, description: 'Minimum €2.5M cover' },
                { name: 'BLS / CPR Certification', mandatory: true, description: 'Current BLS certification' },
                { name: 'Manual Handling Certificate', mandatory: true, description: 'Within last 3 years' },
                { name: 'Hand Hygiene Training (HSELanD)', mandatory: true, description: 'HSE hand hygiene module' },
                { name: 'Children First E-Learning', mandatory: true, description: 'Children First training' },
                { name: 'Infection Prevention & Control', mandatory: true, description: 'IPC module' },
                { name: 'Right to Work Verification', mandatory: true, description: 'Proof of right to work' },
                { name: 'Two Professional References', mandatory: true, description: 'Recent references' },
                { name: 'Photo ID', mandatory: true, description: 'Valid ID' },
                { name: 'Current CV', mandatory: true, description: 'Updated CV' },
            ],
        },
        financial: {
            monthlySpend: 35200, ytdSpend: 70400, annualBudget: 450000, totalSpendAllTime: 1120000,
            avgInvoiceAmount: 17600, outstandingBalance: 0, lastPaymentDate: '2026-02-03', lastPaymentAmount: 17600,
            recentInvoices: [
                { id: 'INV-CUH-2026-004', date: '2026-02-01', period: '16-31 Jan 2026', amount: 17600, status: 'paid', paidDate: '2026-02-03' },
                { id: 'INV-CUH-2026-003', date: '2026-01-16', period: '01-15 Jan 2026', amount: 17800, status: 'paid', paidDate: '2026-01-28' },
            ],
        },
        bookings: {
            totalBookings: 256, activeShifts: 8, pendingBookings: 3, completionRate: 95, cancellationRate: 3.1, preferredLocums: 10,
            recentBookings: [
                { id: 'BK-2801', locum: 'Dr. James Harrison', department: 'Cardiology', date: '2026-02-12', time: '08:00-18:00', status: 'confirmed' },
                { id: 'BK-2798', locum: 'TBC', department: 'Emergency Medicine', date: '2026-02-13', time: '08:00-20:00', status: 'pending' },
            ],
        },
        ratings: {
            avgRating: 4.6, totalReviews: 52,
            categories: { 'Working Environment': 4.7, 'Staff Friendliness': 4.6, 'Facilities & Equipment': 4.4, 'Communication': 4.6, 'Payment Timeliness': 4.7, 'Overall Satisfaction': 4.6 },
            recentFeedback: [
                { locum: 'Dr. James Harrison', rating: 5, date: '2026-02-07', comment: 'Great cardiology department. State-of-the-art cath lab.' },
                { locum: 'Dr. Michael Brooks', rating: 4, date: '2026-02-02', comment: 'Busy ED but well-managed. Supportive senior staff.' },
            ],
        },
        notes: [
            { date: '2026-01-25', author: 'Omar Murphy', content: 'CUH increasing locum demand for cardiology Q1-Q2 due to consultant vacancy.' },
        ],
    },
};

const typeLabels: Record<string, string> = { hospital: 'Hospital', clinic: 'Clinic', care_home: 'Care Home', private_practice: 'Private Practice' };
const typeColors: Record<string, string> = { hospital: 'bg-[#DBEAFE] text-[#1D4ED8] border-[#BFDBFE]', clinic: 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]', care_home: 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]', private_practice: 'bg-[#EDE9FE] text-[#7C3AED] border-[#DDD6FE]' };

function getFacilityProfile(id: string) {
    if (facilityProfiles[id]) return facilityProfiles[id];
    return facilityProfiles['CL-001'];
}

export function FacilityProfilePage({ facilityId, onBack }: FacilityProfilePageProps) {
    const profile = getFacilityProfile(facilityId);
    const [activeTab, setActiveTab] = useState<'overview' | 'departments' | 'contract' | 'compliance' | 'bookings' | 'financial' | 'ratings' | 'notes'>('overview');

    const tabs = [
        { id: 'overview' as const, label: 'Overview' },
        { id: 'departments' as const, label: 'Departments' },
        { id: 'contract' as const, label: 'Contract & Rates' },
        { id: 'compliance' as const, label: 'Compliance Requirements' },
        { id: 'bookings' as const, label: 'Bookings' },
        { id: 'financial' as const, label: 'Financial' },
        { id: 'ratings' as const, label: 'Ratings & Feedback' },
        { id: 'notes' as const, label: 'Notes' },
    ];

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(amount);

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            active: 'bg-[#D1FAE5] text-[#059669] border-[#A7F3D0]',
            inactive: 'bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]',
            confirmed: 'bg-[#DBEAFE] text-[#1D4ED8] border-[#BFDBFE]',
            pending: 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]',
            completed: 'bg-[#D1FAE5] text-[#059669] border-[#A7F3D0]',
            paid: 'bg-[#D1FAE5] text-[#059669] border-[#A7F3D0]',
            overdue: 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]',
            Compliant: 'bg-[#D1FAE5] text-[#059669] border-[#A7F3D0]',
        };
        return <span className={`px-2 py-0.5 rounded text-[11px] border ${styles[status] || 'bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]'}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
    };

    const demandColors: Record<string, string> = { High: 'text-[#EF4444]', Medium: 'text-[#F59E0B]', Low: 'text-[#10B981]' };

    return (
        <div className="p-6 space-y-6">
            {/* Back + Header */}
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors">
                    <ArrowLeft className="w-4 h-4 text-[#6B7280]" />
                </button>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h2 className="text-[#1F2937]">Facility Profile</h2>
                        <span className={`px-2 py-0.5 rounded text-[11px] border ${typeColors[profile.type]}`}>{typeLabels[profile.type]}</span>
                        {getStatusBadge(profile.status)}
                    </div>
                    <p className="text-sm text-[#6B7280]">Comprehensive facility information, contracts, and booking history</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]"><Edit className="w-3.5 h-3.5" /> Edit</button>
                    <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]"><Download className="w-3.5 h-3.5" /> Export</button>
                    <button className="p-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]"><MoreHorizontal className="w-4 h-4 text-[#6B7280]" /></button>
                </div>
            </div>

            {/* Header Card */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
                <div className="flex items-start gap-5">
                    <div className="w-20 h-20 bg-[#EFF6FF] rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-10 h-10 text-[#3B82F6]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl text-[#1F2937]" style={{ fontWeight: 700 }}>{profile.name}</h3>
                            <span className="text-xs text-[#9CA3AF] bg-[#F3F4F6] px-2 py-0.5 rounded">{profile.id}</span>
                        </div>
                        <p className="text-sm text-[#6B7280] mb-3 max-w-2xl">{profile.overview.description}</p>
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#6B7280]">
                            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#9CA3AF]" />{profile.overview.address}</span>
                            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#9CA3AF]" />{profile.overview.phone}</span>
                            <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-[#9CA3AF]" />{profile.overview.website}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 flex-shrink-0">
                        <div className="bg-[#F9FAFB] rounded-lg px-4 py-3 text-center min-w-[90px]">
                            <p className="text-lg text-[#1F2937]" style={{ fontWeight: 700 }}>{profile.bookings.activeShifts}</p>
                            <p className="text-[10px] text-[#9CA3AF]">Active Shifts</p>
                        </div>
                        <div className="bg-[#F9FAFB] rounded-lg px-4 py-3 text-center min-w-[90px]">
                            <p className="text-lg text-[#F59E0B]" style={{ fontWeight: 700 }}>{profile.ratings.avgRating}</p>
                            <p className="text-[10px] text-[#9CA3AF]">Avg Rating</p>
                        </div>
                        <div className="bg-[#F9FAFB] rounded-lg px-4 py-3 text-center min-w-[90px]">
                            <p className="text-lg text-[#10B981]" style={{ fontWeight: 700 }}>{formatCurrency(profile.financial.monthlySpend)}</p>
                            <p className="text-[10px] text-[#9CA3AF]">Monthly Spend</p>
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
                    {/* === OVERVIEW === */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                {/* Facility Details */}
                                <div className="space-y-4">
                                    <h4 className="text-sm text-[#1F2937] flex items-center gap-2" style={{ fontWeight: 600 }}><Building2 className="w-4 h-4 text-[#3B82F6]" /> Facility Details</h4>
                                    <div className="bg-[#F9FAFB] rounded-lg p-4 space-y-3">
                                        {[
                                            { label: 'Full Address', value: profile.overview.address },
                                            { label: 'Eircode', value: profile.overview.eircode },
                                            { label: 'Phone', value: profile.overview.phone },
                                            { label: 'Fax', value: profile.overview.fax },
                                            { label: 'Email', value: profile.overview.email },
                                            { label: 'Website', value: profile.overview.website },
                                            { label: 'Established', value: profile.overview.established },
                                            { label: 'Ownership', value: profile.overview.ownership },
                                            { label: 'Bed Capacity', value: `${profile.overview.beds} beds` },
                                        ].map(item => (
                                            <div key={item.label} className="flex justify-between items-start">
                                                <span className="text-xs text-[#9CA3AF] min-w-[120px]">{item.label}</span>
                                                <span className="text-xs text-[#1F2937] text-right" style={{ fontWeight: 500 }}>{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Regulatory & HSE */}
                                <div className="space-y-4">
                                    <h4 className="text-sm text-[#1F2937] flex items-center gap-2" style={{ fontWeight: 600 }}><ShieldCheck className="w-4 h-4 text-[#10B981]" /> Regulatory & HSE Information</h4>
                                    <div className="bg-[#F0FDF4] rounded-lg p-4 space-y-3">
                                        {[
                                            { label: 'HSE Region', value: profile.overview.hseRegion },
                                            { label: 'HSE Area / CHO', value: profile.overview.hseArea },
                                            { label: 'HIQA Registration', value: profile.overview.hiqaRegistration },
                                            { label: 'HIQA Last Inspection', value: profile.overview.hiqaLastInspection },
                                            { label: 'HIQA Status', value: profile.overview.hiqaStatus },
                                            { label: 'JCI Accredited', value: profile.overview.jciAccredited ? 'Yes' : 'No' },
                                        ].map(item => (
                                            <div key={item.label} className="flex justify-between items-start">
                                                <span className="text-xs text-[#065F46]">{item.label}</span>
                                                <span className="text-xs text-[#065F46] text-right" style={{ fontWeight: 500 }}>{item.value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <h4 className="text-sm text-[#1F2937] flex items-center gap-2 pt-2" style={{ fontWeight: 600 }}><Users className="w-4 h-4 text-[#8B5CF6]" /> Primary Contact</h4>
                                    <div className="bg-[#EDE9FE] rounded-lg p-4 space-y-2">
                                        <p className="text-sm text-[#5B21B6]" style={{ fontWeight: 600 }}>{profile.contacts.primary.name}</p>
                                        <p className="text-xs text-[#7C3AED]">{profile.contacts.primary.role}</p>
                                        <div className="flex items-center gap-1.5 text-xs text-[#6D28D9]"><Phone className="w-3 h-3" />{profile.contacts.primary.phone}</div>
                                        <div className="flex items-center gap-1.5 text-xs text-[#6D28D9]"><Mail className="w-3 h-3" />{profile.contacts.primary.email}</div>
                                        {profile.contacts.primary.mobile && (
                                            <div className="flex items-center gap-1.5 text-xs text-[#6D28D9]"><Phone className="w-3 h-3" />{profile.contacts.primary.mobile} (Mobile)</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* All Contacts */}
                            <div>
                                <h4 className="text-sm text-[#1F2937] flex items-center gap-2 mb-3" style={{ fontWeight: 600 }}><Users className="w-4 h-4 text-[#6B7280]" /> Key Contacts</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.entries(profile.contacts).filter(([key]) => key !== 'primary').map(([key, contact]: [string, any]) => (
                                        <div key={key} className="border border-[#E5E7EB] rounded-lg p-3 hover:bg-[#F9FAFB]">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-sm text-[#1F2937]" style={{ fontWeight: 500 }}>{contact.name}</p>
                                                <span className="text-[10px] text-[#9CA3AF] bg-[#F3F4F6] px-1.5 py-0.5 rounded capitalize">{key}</span>
                                            </div>
                                            <p className="text-xs text-[#6B7280] mb-2">{contact.role}</p>
                                            <div className="flex items-center gap-3 text-[11px] text-[#9CA3AF]">
                                                <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{contact.phone}</span>
                                                <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{contact.email}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* === DEPARTMENTS === */}
                    {activeTab === 'departments' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>Departments Requiring Locum Cover</h4>
                                <p className="text-xs text-[#9CA3AF]">{profile.departments.reduce((s: number, d: any) => s + d.currentVacancies, 0)} total vacancies</p>
                            </div>
                            <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
                                <table className="w-full">
                                    <thead><tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                                        {['Department', 'Locum Demand', 'Avg. Shifts/Month', 'Preferred Grade', 'Current Vacancies'].map(h => (
                                            <th key={h} className="px-4 py-2.5 text-left text-xs text-[#9CA3AF]" style={{ fontWeight: 500 }}>{h}</th>
                                        ))}
                                    </tr></thead>
                                    <tbody>
                                        {profile.departments.map((dept: any) => (
                                            <tr key={dept.name} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                                                <td className="px-4 py-3 text-sm text-[#1F2937]" style={{ fontWeight: 500 }}>{dept.name}</td>
                                                <td className="px-4 py-3"><span className={`text-xs ${demandColors[dept.locumDemand]}`} style={{ fontWeight: 600 }}>{dept.locumDemand}</span></td>
                                                <td className="px-4 py-3 text-sm text-[#6B7280]">{dept.avgShiftsPerMonth}</td>
                                                <td className="px-4 py-3 text-xs text-[#6B7280]">{dept.preferredGrade}</td>
                                                <td className="px-4 py-3"><span className={`text-sm ${dept.currentVacancies > 0 ? 'text-[#EF4444]' : 'text-[#10B981]'}`} style={{ fontWeight: 600 }}>{dept.currentVacancies}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* === CONTRACT & RATES === */}
                    {activeTab === 'contract' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm text-[#1F2937] flex items-center gap-2 mb-3" style={{ fontWeight: 600 }}><FileText className="w-4 h-4 text-[#6B7280]" /> Contract Details</h4>
                                    <div className="bg-[#F9FAFB] rounded-lg p-4 space-y-3">
                                        {[
                                            { label: 'Framework Type', value: profile.contract.frameworkType },
                                            { label: 'Contract Reference', value: profile.contract.contractRef },
                                            { label: 'Start Date', value: profile.contract.startDate },
                                            { label: 'End Date', value: profile.contract.endDate },
                                            { label: 'Auto Renewal', value: profile.contract.autoRenewal ? 'Yes' : 'No' },
                                            { label: 'Payment Terms', value: profile.contract.paymentTerms },
                                            { label: 'Invoice Frequency', value: profile.contract.invoiceFrequency },
                                            { label: 'PO Required', value: profile.contract.poRequired ? 'Yes' : 'No' },
                                            { label: 'Agency Margin', value: profile.contract.agencyMargin },
                                            { label: 'VAT Applicable', value: `${profile.contract.vatApplicable ? 'Yes' : 'No'} (${profile.contract.vatRate})` },
                                        ].map(item => (
                                            <div key={item.label} className="flex justify-between"><span className="text-xs text-[#9CA3AF]">{item.label}</span><span className="text-xs text-[#1F2937]" style={{ fontWeight: 500 }}>{item.value}</span></div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm text-[#1F2937] flex items-center gap-2 mb-3" style={{ fontWeight: 600 }}><Banknote className="w-4 h-4 text-[#10B981]" /> Agreed Rates (Excl. VAT)</h4>
                                    <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
                                        <table className="w-full">
                                            <thead><tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                                                {['Grade', 'Day', 'Night', 'Weekend'].map(h => (
                                                    <th key={h} className="px-3 py-2 text-xs text-[#9CA3AF]" style={{ fontWeight: 500 }}>{h}</th>
                                                ))}
                                            </tr></thead>
                                            <tbody>
                                                <tr className="border-b border-[#F3F4F6]">
                                                    <td className="px-3 py-2.5 text-xs text-[#1F2937]" style={{ fontWeight: 500 }}>Consultant</td>
                                                    <td className="px-3 py-2.5 text-xs text-[#10B981]" style={{ fontWeight: 600 }}>{formatCurrency(profile.contract.agreedRates.consultantDay)}</td>
                                                    <td className="px-3 py-2.5 text-xs text-[#10B981]" style={{ fontWeight: 600 }}>{formatCurrency(profile.contract.agreedRates.consultantNight)}</td>
                                                    <td className="px-3 py-2.5 text-xs text-[#10B981]" style={{ fontWeight: 600 }}>{formatCurrency(profile.contract.agreedRates.consultantWeekend)}</td>
                                                </tr>
                                                <tr className="border-b border-[#F3F4F6]">
                                                    <td className="px-3 py-2.5 text-xs text-[#1F2937]" style={{ fontWeight: 500 }}>Registrar</td>
                                                    <td className="px-3 py-2.5 text-xs text-[#10B981]" style={{ fontWeight: 600 }}>{formatCurrency(profile.contract.agreedRates.registrarDay)}</td>
                                                    <td className="px-3 py-2.5 text-xs text-[#10B981]" style={{ fontWeight: 600 }}>{formatCurrency(profile.contract.agreedRates.registrarNight)}</td>
                                                    <td className="px-3 py-2.5 text-xs text-[#10B981]" style={{ fontWeight: 600 }}>{formatCurrency(profile.contract.agreedRates.registrarWeekend)}</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-3 py-2.5 text-xs text-[#1F2937]" style={{ fontWeight: 500 }}>SHO</td>
                                                    <td className="px-3 py-2.5 text-xs text-[#10B981]" style={{ fontWeight: 600 }}>{formatCurrency(profile.contract.agreedRates.shoDay)}</td>
                                                    <td className="px-3 py-2.5 text-xs text-[#10B981]" style={{ fontWeight: 600 }}>{formatCurrency(profile.contract.agreedRates.shoNight)}</td>
                                                    <td className="px-3 py-2.5 text-xs text-[#10B981]" style={{ fontWeight: 600 }}>{formatCurrency(profile.contract.agreedRates.shoWeekend)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* === COMPLIANCE REQUIREMENTS === */}
                    {activeTab === 'compliance' && (
                        <div className="space-y-4">
                            <p className="text-sm text-[#6B7280]">Documents and certifications this facility requires from all locum professionals before they can work shifts.</p>
                            <div className="space-y-2">
                                {profile.compliance.requirements.map((req: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${req.mandatory ? 'bg-[#FEF2F2]' : 'bg-[#F3F4F6]'}`}>
                                                {req.mandatory ? <AlertTriangle className="w-4 h-4 text-[#EF4444]" /> : <FileText className="w-4 h-4 text-[#6B7280]" />}
                                            </div>
                                            <div>
                                                <p className="text-sm text-[#1F2937]">{req.name}</p>
                                                <p className="text-xs text-[#9CA3AF]">{req.description}</p>
                                            </div>
                                        </div>
                                        <span className={`text-[10px] px-2 py-0.5 rounded border ${req.mandatory ? 'text-[#EF4444] border-[#FECACA] bg-[#FEF2F2]' : 'text-[#6B7280] border-[#E5E7EB] bg-[#F9FAFB]'}`}>
                                            {req.mandatory ? 'Mandatory' : 'Preferred'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* === BOOKINGS === */}
                    {activeTab === 'bookings' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-5 gap-4">
                                <div className="bg-[#F9FAFB] rounded-lg p-3 text-center"><p className="text-lg text-[#1F2937]" style={{ fontWeight: 700 }}>{profile.bookings.totalBookings}</p><p className="text-[10px] text-[#9CA3AF]">Total Bookings</p></div>
                                <div className="bg-[#F9FAFB] rounded-lg p-3 text-center"><p className="text-lg text-[#3B82F6]" style={{ fontWeight: 700 }}>{profile.bookings.activeShifts}</p><p className="text-[10px] text-[#9CA3AF]">Active Shifts</p></div>
                                <div className="bg-[#F9FAFB] rounded-lg p-3 text-center"><p className="text-lg text-[#F59E0B]" style={{ fontWeight: 700 }}>{profile.bookings.pendingBookings}</p><p className="text-[10px] text-[#9CA3AF]">Pending</p></div>
                                <div className="bg-[#F9FAFB] rounded-lg p-3 text-center"><p className="text-lg text-[#10B981]" style={{ fontWeight: 700 }}>{profile.bookings.completionRate}%</p><p className="text-[10px] text-[#9CA3AF]">Completion Rate</p></div>
                                <div className="bg-[#F9FAFB] rounded-lg p-3 text-center"><p className="text-lg text-[#8B5CF6]" style={{ fontWeight: 700 }}>{profile.bookings.preferredLocums}</p><p className="text-[10px] text-[#9CA3AF]">Preferred Locums</p></div>
                            </div>

                            <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
                                <table className="w-full">
                                    <thead><tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                                        {['Booking ID', 'Locum', 'Department', 'Date', 'Time', 'Status'].map(h => (
                                            <th key={h} className="px-4 py-2.5 text-left text-xs text-[#9CA3AF]" style={{ fontWeight: 500 }}>{h}</th>
                                        ))}
                                    </tr></thead>
                                    <tbody>
                                        {profile.bookings.recentBookings.map((b: any) => (
                                            <tr key={b.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                                                <td className="px-4 py-2.5 text-xs text-[#6B7280]">{b.id}</td>
                                                <td className="px-4 py-2.5 text-xs text-[#1F2937]" style={{ fontWeight: 500 }}>{b.locum}</td>
                                                <td className="px-4 py-2.5 text-xs text-[#6B7280]">{b.department}</td>
                                                <td className="px-4 py-2.5 text-xs text-[#6B7280]">{b.date}</td>
                                                <td className="px-4 py-2.5 text-xs text-[#6B7280]">{b.time}</td>
                                                <td className="px-4 py-2.5">{getStatusBadge(b.status)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* === FINANCIAL === */}
                    {activeTab === 'financial' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-4 gap-4">
                                <div className="bg-[#F0FDF4] rounded-lg p-4 border border-[#A7F3D0]"><p className="text-xs text-[#065F46]">Monthly Spend</p><p className="text-xl text-[#065F46] mt-1" style={{ fontWeight: 700 }}>{formatCurrency(profile.financial.monthlySpend)}</p></div>
                                <div className="bg-[#F0FDF4] rounded-lg p-4 border border-[#A7F3D0]"><p className="text-xs text-[#065F46]">YTD Spend (2026)</p><p className="text-xl text-[#065F46] mt-1" style={{ fontWeight: 700 }}>{formatCurrency(profile.financial.ytdSpend)}</p></div>
                                <div className="bg-[#F9FAFB] rounded-lg p-4 border border-[#E5E7EB]"><p className="text-xs text-[#6B7280]">Annual Budget</p><p className="text-xl text-[#1F2937] mt-1" style={{ fontWeight: 700 }}>{formatCurrency(profile.financial.annualBudget)}</p></div>
                                <div className={`rounded-lg p-4 border ${profile.financial.outstandingBalance > 0 ? 'bg-[#FEF3C7] border-[#FDE68A]' : 'bg-[#F9FAFB] border-[#E5E7EB]'}`}>
                                    <p className={`text-xs ${profile.financial.outstandingBalance > 0 ? 'text-[#92400E]' : 'text-[#6B7280]'}`}>Outstanding Balance</p>
                                    <p className={`text-xl mt-1 ${profile.financial.outstandingBalance > 0 ? 'text-[#92400E]' : 'text-[#1F2937]'}`} style={{ fontWeight: 700 }}>{formatCurrency(profile.financial.outstandingBalance)}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm text-[#1F2937] mb-3" style={{ fontWeight: 600 }}>Recent Invoices</h4>
                                <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
                                    <table className="w-full">
                                        <thead><tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                                            {['Invoice ID', 'Date Issued', 'Period', 'Amount', 'Status', 'Paid Date'].map(h => (
                                                <th key={h} className="px-4 py-2.5 text-left text-xs text-[#9CA3AF]" style={{ fontWeight: 500 }}>{h}</th>
                                            ))}
                                        </tr></thead>
                                        <tbody>
                                            {profile.financial.recentInvoices.map((inv: any) => (
                                                <tr key={inv.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                                                    <td className="px-4 py-2.5 text-xs text-[#6B7280]">{inv.id}</td>
                                                    <td className="px-4 py-2.5 text-xs text-[#6B7280]">{inv.date}</td>
                                                    <td className="px-4 py-2.5 text-xs text-[#6B7280]">{inv.period}</td>
                                                    <td className="px-4 py-2.5 text-xs text-[#10B981]" style={{ fontWeight: 600 }}>{formatCurrency(inv.amount)}</td>
                                                    <td className="px-4 py-2.5">{getStatusBadge(inv.status)}</td>
                                                    <td className="px-4 py-2.5 text-xs text-[#6B7280]">{inv.paidDate || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* === RATINGS & FEEDBACK === */}
                    {activeTab === 'ratings' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm text-[#1F2937] mb-3" style={{ fontWeight: 600 }}>Overall Rating</h4>
                                    <div className="bg-[#FEF3C7] rounded-lg p-5 border border-[#FDE68A] text-center">
                                        <div className="flex items-center justify-center gap-2 mb-1">
                                            <Star className="w-6 h-6 text-[#F59E0B] fill-[#F59E0B]" />
                                            <span className="text-3xl text-[#92400E]" style={{ fontWeight: 700 }}>{profile.ratings.avgRating}</span>
                                            <span className="text-sm text-[#92400E]">/ 5</span>
                                        </div>
                                        <p className="text-xs text-[#92400E]">Based on {profile.ratings.totalReviews} locum reviews</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm text-[#1F2937] mb-3" style={{ fontWeight: 600 }}>Category Ratings</h4>
                                    <div className="space-y-2">
                                        {Object.entries(profile.ratings.categories).map(([cat, rating]) => (
                                            <div key={cat} className="flex items-center gap-3">
                                                <span className="text-xs text-[#6B7280] w-40">{cat}</span>
                                                <div className="flex-1 h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: `${((rating as number) / 5) * 100}%` }} />
                                                </div>
                                                <span className="text-xs text-[#1F2937] w-6 text-right" style={{ fontWeight: 600 }}>{rating as number}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm text-[#1F2937] mb-3" style={{ fontWeight: 600 }}>Recent Locum Feedback</h4>
                                <div className="space-y-3">
                                    {profile.ratings.recentFeedback.map((fb: any, i: number) => (
                                        <div key={i} className="p-4 border border-[#E5E7EB] rounded-lg">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <p className="text-sm text-[#10B981]" style={{ fontWeight: 600 }}>{fb.locum}</p>
                                                    <p className="text-xs text-[#9CA3AF]">{fb.date}</p>
                                                </div>
                                                <div className="flex items-center gap-0.5">
                                                    {Array.from({ length: 5 }).map((_, j) => (
                                                        <Star key={j} className={`w-3.5 h-3.5 ${j < fb.rating ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-[#E5E7EB]'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-[#6B7280]">{fb.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* === NOTES === */}
                    {activeTab === 'notes' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>Internal Notes & Activity Log</h4>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-[#10B981] text-white rounded-lg hover:bg-[#059669]">
                                    <MessageSquare className="w-3.5 h-3.5" /> Add Note
                                </button>
                            </div>
                            <div className="space-y-3">
                                {profile.notes.map((note: any, i: number) => (
                                    <div key={i} className="p-4 border border-[#E5E7EB] rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 bg-[#EDE9FE] rounded-full flex items-center justify-center">
                                                    <User className="w-3.5 h-3.5 text-[#8B5CF6]" />
                                                </div>
                                                <span className="text-sm text-[#1F2937]" style={{ fontWeight: 500 }}>{note.author}</span>
                                            </div>
                                            <span className="text-xs text-[#9CA3AF]">{note.date}</span>
                                        </div>
                                        <p className="text-sm text-[#6B7280] pl-9">{note.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
