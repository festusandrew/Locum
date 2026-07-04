import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
    ArrowLeft, Building2, MapPin, Phone, Mail, Globe, Star, Users,
    Calendar, Clock, FileText, ShieldCheck, Download, Edit, MoreHorizontal,
    CheckCircle, AlertTriangle, User, Banknote, CreditCard, Award,
    MessageSquare, Activity, Briefcase, Heart, Hash, BadgeCheck, Bed, X, Sparkles,
    Archive, RotateCcw
} from 'lucide-react';
import { useSystemSettings } from '../contexts/SystemSettingsContext';
import { AddNoteModal } from './ui/AddNoteModal';

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
            nationality: 'Irish',
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
                { id: 'BK-3401', locum: 'Sarah Mitchell', department: 'General Surgery', date: '2026-02-12', time: '08:00-18:00', status: 'confirmed' },
                { id: 'BK-3398', locum: 'Emily Chen', department: 'Anesthesiology', date: '2026-02-12', time: '08:00-16:00', status: 'confirmed' },
                { id: 'BK-3395', locum: 'Sarah Mitchell', department: 'Surgical On-Call', date: '2026-02-14', time: '20:00-08:00', status: 'confirmed' },
                { id: 'BK-3390', locum: 'TBC', department: 'Emergency Medicine', date: '2026-02-15', time: '08:00-20:00', status: 'pending' },
                { id: 'BK-3385', locum: 'Rachel Martinez', department: 'Pediatrics', date: '2026-02-13', time: '09:00-17:00', status: 'confirmed' },
                { id: 'BK-3380', locum: 'James Harrison', department: 'Cardiology', date: '2026-02-10', time: '08:00-18:00', status: 'completed' },
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
                { locum: 'Sarah Mitchell', rating: 5, date: '2026-02-08', comment: 'Excellent theatre facilities. Nursing staff very supportive and professional. Great hospital to work in.' },
                { locum: 'Emily Chen', rating: 5, date: '2026-02-05', comment: 'Well-organized anaesthetics department. Clear protocols. Always happy to locum here.' },
                { locum: 'Michael Brooks', rating: 4, date: '2026-02-01', comment: 'Good ED setup but can get overwhelmed at peak times. Staff are great though.' },
                { locum: 'Rachel Martinez', rating: 5, date: '2026-01-28', comment: 'Fantastic paeds department. Very welcoming to locums.' },
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
            nationality: 'Irish',
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
                { id: 'BK-2801', locum: 'James Harrison', department: 'Cardiology', date: '2026-02-12', time: '08:00-18:00', status: 'confirmed' },
                { id: 'BK-2798', locum: 'TBC', department: 'Emergency Medicine', date: '2026-02-13', time: '08:00-20:00', status: 'pending' },
            ],
        },
        ratings: {
            avgRating: 4.6, totalReviews: 52,
            categories: { 'Working Environment': 4.7, 'Staff Friendliness': 4.6, 'Facilities & Equipment': 4.4, 'Communication': 4.6, 'Payment Timeliness': 4.7, 'Overall Satisfaction': 4.6 },
            recentFeedback: [
                { locum: 'James Harrison', rating: 5, date: '2026-02-07', comment: 'Great cardiology department. State-of-the-art cath lab.' },
                { locum: 'Michael Brooks', rating: 4, date: '2026-02-02', comment: 'Busy ED but well-managed. Supportive senior staff.' },
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
    const { isWhitelabelActive, brandingFacilityId, setBrandingFacilityId, setIsWhitelabelActive } = useSystemSettings();
    const [profile, setProfile] = useState<any>(() => {
        const stored = localStorage.getItem(`mployus_facility_profile_${facilityId}`);
        if (stored) return JSON.parse(stored);
        const initial = facilityProfiles[facilityId] || facilityProfiles['CL-001'];
        localStorage.setItem(`mployus_facility_profile_${facilityId}`, JSON.stringify(initial));
        return initial;
    });

    const [activeTab, setActiveTab] = useState<'overview' | 'departments' | 'contract' | 'compliance' | 'bookings' | 'financial' | 'ratings' | 'notes'>('overview');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddNoteModal, setShowAddNoteModal] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [modalTab, setModalTab] = useState<'overview' | 'location' | 'contacts' | 'contract'>('overview');

    // Form states
    const [editForm, setEditForm] = useState({
        name: profile.name,
        type: profile.type || 'hospital',
        status: profile.status,
        description: profile.overview?.description || '',
        address: profile.overview?.address || '',
        eircode: profile.overview?.eircode || '',
        phone: profile.overview?.phone || '',
        fax: profile.overview?.fax || '',
        email: profile.overview?.email || '',
        website: profile.overview?.website || '',
        hseRegion: profile.overview?.hseRegion || '',
        hseArea: profile.overview?.hseArea || '',
        beds: profile.overview?.beds || 0,
        established: profile.overview?.established || 0,
        ownership: profile.overview?.ownership || '',
        hiqaRegistration: profile.overview?.hiqaRegistration || '',
        hiqaLastInspection: profile.overview?.hiqaLastInspection || '',
        hiqaStatus: profile.overview?.hiqaStatus || 'Compliant',
        jciAccredited: profile.overview?.jciAccredited || false,
        nationality: profile.overview?.nationality || 'Irish',

        // Contacts
        primaryContactName: profile.contacts?.primary?.name || '',
        primaryContactRole: profile.contacts?.primary?.role || '',
        primaryContactPhone: profile.contacts?.primary?.phone || '',
        primaryContactEmail: profile.contacts?.primary?.email || '',
        primaryContactMobile: profile.contacts?.primary?.mobile || '',

        secondaryContactName: profile.contacts?.secondary?.name || '',
        secondaryContactRole: profile.contacts?.secondary?.role || '',
        secondaryContactPhone: profile.contacts?.secondary?.phone || '',
        secondaryContactEmail: profile.contacts?.secondary?.email || '',
        secondaryContactMobile: profile.contacts?.secondary?.mobile || '',

        financeContactName: profile.contacts?.finance?.name || '',
        financeContactRole: profile.contacts?.finance?.role || '',
        financeContactPhone: profile.contacts?.finance?.phone || '',
        financeContactEmail: profile.contacts?.finance?.email || '',
        financeContactMobile: profile.contacts?.finance?.mobile || '',

        nursingContactName: profile.contacts?.nursing?.name || '',
        nursingContactRole: profile.contacts?.nursing?.role || '',
        nursingContactPhone: profile.contacts?.nursing?.phone || '',
        nursingContactEmail: profile.contacts?.nursing?.email || '',
        nursingContactMobile: profile.contacts?.nursing?.mobile || '',

        escalationContactName: profile.contacts?.escalation?.name || '',
        escalationContactRole: profile.contacts?.escalation?.role || '',
        escalationContactPhone: profile.contacts?.escalation?.phone || '',
        escalationContactEmail: profile.contacts?.escalation?.email || '',
        escalationContactMobile: profile.contacts?.escalation?.mobile || '',

        // Contract
        frameworkType: profile.contract?.frameworkType || 'HSE National Framework Agreement',
        contractRef: profile.contract?.contractRef || '',
        contractStartDate: profile.contract?.startDate || '',
        contractEndDate: profile.contract?.endDate || '',
        autoRenewal: profile.contract?.autoRenewal || false,
        paymentTerms: profile.contract?.paymentTerms || 'Net 30 days',
        invoiceFrequency: profile.contract?.invoiceFrequency || 'Fortnightly',
        poRequired: profile.contract?.poRequired || false,
        agencyMargin: profile.contract?.agencyMargin || '15%',
        vatApplicable: profile.contract?.vatApplicable || false,
        vatRate: profile.contract?.vatRate || '23%',
        logo: profile.logo || '',
        themeColor: profile.themeColor || '#10B981',
    });



    const [showArchived, setShowArchived] = useState(false);
    const [noteToEdit, setNoteToEdit] = useState<any>(null);

    useEffect(() => {
        const stored = localStorage.getItem(`mployus_facility_profile_${facilityId}`);
        const currentProfile = stored ? JSON.parse(stored) : (facilityProfiles[facilityId] || facilityProfiles['CL-001']);
        if (currentProfile.notes) {
            currentProfile.notes = currentProfile.notes.map((n: any, idx: number) => ({
                id: n.id || `note-${idx}-${n.date}-${Math.random().toString(36).substring(2, 6)}`,
                ...n
            }));
        }
        setProfile(currentProfile);
        setEditForm({
            name: currentProfile.name,
            type: currentProfile.type || 'hospital',
            status: currentProfile.status,
            description: currentProfile.overview?.description || '',
            address: currentProfile.overview?.address || '',
            eircode: currentProfile.overview?.eircode || '',
            phone: currentProfile.overview?.phone || '',
            fax: currentProfile.overview?.fax || '',
            email: currentProfile.overview?.email || '',
            website: currentProfile.overview?.website || '',
            hseRegion: currentProfile.overview?.hseRegion || '',
            hseArea: currentProfile.overview?.hseArea || '',
            beds: currentProfile.overview?.beds || 0,
            established: currentProfile.overview?.established || 0,
            ownership: currentProfile.overview?.ownership || '',
            hiqaRegistration: currentProfile.overview?.hiqaRegistration || '',
            hiqaLastInspection: currentProfile.overview?.hiqaLastInspection || '',
            hiqaStatus: currentProfile.overview?.hiqaStatus || 'Compliant',
            jciAccredited: currentProfile.overview?.jciAccredited || false,
            nationality: currentProfile.overview?.nationality || 'Irish',

            // Contacts
            primaryContactName: currentProfile.contacts?.primary?.name || '',
            primaryContactRole: currentProfile.contacts?.primary?.role || '',
            primaryContactPhone: currentProfile.contacts?.primary?.phone || '',
            primaryContactEmail: currentProfile.contacts?.primary?.email || '',
            primaryContactMobile: currentProfile.contacts?.primary?.mobile || '',

            secondaryContactName: currentProfile.contacts?.secondary?.name || '',
            secondaryContactRole: currentProfile.contacts?.secondary?.role || '',
            secondaryContactPhone: currentProfile.contacts?.secondary?.phone || '',
            secondaryContactEmail: currentProfile.contacts?.secondary?.email || '',
            secondaryContactMobile: currentProfile.contacts?.secondary?.mobile || '',

            financeContactName: currentProfile.contacts?.finance?.name || '',
            financeContactRole: currentProfile.contacts?.finance?.role || '',
            financeContactPhone: currentProfile.contacts?.finance?.phone || '',
            financeContactEmail: currentProfile.contacts?.finance?.email || '',
            financeContactMobile: currentProfile.contacts?.finance?.mobile || '',

            nursingContactName: currentProfile.contacts?.nursing?.name || '',
            nursingContactRole: currentProfile.contacts?.nursing?.role || '',
            nursingContactPhone: currentProfile.contacts?.nursing?.phone || '',
            nursingContactEmail: currentProfile.contacts?.nursing?.email || '',
            nursingContactMobile: currentProfile.contacts?.nursing?.mobile || '',

            escalationContactName: currentProfile.contacts?.escalation?.name || '',
            escalationContactRole: currentProfile.contacts?.escalation?.role || '',
            escalationContactPhone: currentProfile.contacts?.escalation?.phone || '',
            escalationContactEmail: currentProfile.contacts?.escalation?.email || '',
            escalationContactMobile: currentProfile.contacts?.escalation?.mobile || '',

            // Contract
            frameworkType: currentProfile.contract?.frameworkType || 'HSE National Framework Agreement',
            contractRef: currentProfile.contract?.contractRef || '',
            contractStartDate: currentProfile.contract?.startDate || '',
            contractEndDate: currentProfile.contract?.endDate || '',
            autoRenewal: currentProfile.contract?.autoRenewal || false,
            paymentTerms: currentProfile.contract?.paymentTerms || 'Net 30 days',
            invoiceFrequency: currentProfile.contract?.invoiceFrequency || 'Fortnightly',
            poRequired: currentProfile.contract?.poRequired || false,
            agencyMargin: currentProfile.contract?.agencyMargin || '15%',
            vatApplicable: currentProfile.contract?.vatApplicable || false,
            vatRate: currentProfile.contract?.vatRate || '23%',
            logo: currentProfile.logo || '',
            themeColor: currentProfile.themeColor || '#10B981',
        });
    }, [facilityId]);

    const updateProfile = (updated: any) => {
        setProfile(updated);
        localStorage.setItem(`mployus_facility_profile_${facilityId}`, JSON.stringify(updated));

        // Sync with central clients database list
        const storedClientsStr = localStorage.getItem('mployus_clients');
        if (storedClientsStr) {
            try {
                const clients = JSON.parse(storedClientsStr);
                const updatedClients = clients.map((c: any) => {
                    if (c.id === facilityId) {
                        return {
                            ...c,
                            name: updated.name,
                            status: updated.status === 'active' ? 'active' : 'inactive',
                            address: updated.overview?.address || c.address,
                            contactEmail: updated.overview?.email || c.contactEmail,
                            contactPhone: updated.overview?.phone || c.contactPhone,
                            type: updated.type || c.type,
                            logo: updated.logo,
                            themeColor: updated.themeColor
                        };
                    }
                    return c;
                });
                localStorage.setItem('mployus_clients', JSON.stringify(updatedClients));
            } catch (err) {
                console.error("Error syncing central client update:", err);
            }
        }
    };

    const handleOpenEdit = () => {
        setEditForm({
            name: profile.name,
            type: profile.type || 'hospital',
            status: profile.status,
            description: profile.overview?.description || '',
            address: profile.overview?.address || '',
            eircode: profile.overview?.eircode || '',
            phone: profile.overview?.phone || '',
            fax: profile.overview?.fax || '',
            email: profile.overview?.email || '',
            website: profile.overview?.website || '',
            hseRegion: profile.overview?.hseRegion || '',
            hseArea: profile.overview?.hseArea || '',
            beds: profile.overview?.beds || 0,
            established: profile.overview?.established || 0,
            ownership: profile.overview?.ownership || '',
            hiqaRegistration: profile.overview?.hiqaRegistration || '',
            hiqaLastInspection: profile.overview?.hiqaLastInspection || '',
            hiqaStatus: profile.overview?.hiqaStatus || 'Compliant',
            jciAccredited: profile.overview?.jciAccredited || false,
            nationality: profile.overview?.nationality || 'Irish',

            // Contacts
            primaryContactName: profile.contacts?.primary?.name || '',
            primaryContactRole: profile.contacts?.primary?.role || '',
            primaryContactPhone: profile.contacts?.primary?.phone || '',
            primaryContactEmail: profile.contacts?.primary?.email || '',
            primaryContactMobile: profile.contacts?.primary?.mobile || '',

            secondaryContactName: profile.contacts?.secondary?.name || '',
            secondaryContactRole: profile.contacts?.secondary?.role || '',
            secondaryContactPhone: profile.contacts?.secondary?.phone || '',
            secondaryContactEmail: profile.contacts?.secondary?.email || '',
            secondaryContactMobile: profile.contacts?.secondary?.mobile || '',

            financeContactName: profile.contacts?.finance?.name || '',
            financeContactRole: profile.contacts?.finance?.role || '',
            financeContactPhone: profile.contacts?.finance?.phone || '',
            financeContactEmail: profile.contacts?.finance?.email || '',
            financeContactMobile: profile.contacts?.finance?.mobile || '',

            nursingContactName: profile.contacts?.nursing?.name || '',
            nursingContactRole: profile.contacts?.nursing?.role || '',
            nursingContactPhone: profile.contacts?.nursing?.phone || '',
            nursingContactEmail: profile.contacts?.nursing?.email || '',
            nursingContactMobile: profile.contacts?.nursing?.mobile || '',

            escalationContactName: profile.contacts?.escalation?.name || '',
            escalationContactRole: profile.contacts?.escalation?.role || '',
            escalationContactPhone: profile.contacts?.escalation?.phone || '',
            escalationContactEmail: profile.contacts?.escalation?.email || '',
            escalationContactMobile: profile.contacts?.escalation?.mobile || '',

            // Contract
            frameworkType: profile.contract?.frameworkType || 'HSE National Framework Agreement',
            contractRef: profile.contract?.contractRef || '',
            contractStartDate: profile.contract?.startDate || '',
            contractEndDate: profile.contract?.endDate || '',
            autoRenewal: profile.contract?.autoRenewal || false,
            paymentTerms: profile.contract?.paymentTerms || 'Net 30 days',
            invoiceFrequency: profile.contract?.invoiceFrequency || 'Fortnightly',
            poRequired: profile.contract?.poRequired || false,
            agencyMargin: profile.contract?.agencyMargin || '15%',
            vatApplicable: profile.contract?.vatApplicable || false,
            vatRate: profile.contract?.vatRate || '23%',
            logo: profile.logo || '',
            themeColor: profile.themeColor || '#10B981',
        });
        setModalTab('overview');
        setShowEditModal(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updated = {
            ...profile,
            name: editForm.name,
            type: editForm.type,
            status: editForm.status,
            logo: editForm.logo,
            themeColor: editForm.themeColor,
            overview: {
                ...profile.overview,
                description: editForm.description,
                address: editForm.address,
                eircode: editForm.eircode,
                phone: editForm.phone,
                fax: editForm.fax,
                email: editForm.email,
                website: editForm.website,
                established: editForm.established,
                beds: editForm.beds,
                ownership: editForm.ownership,
                hseRegion: editForm.hseRegion,
                hseArea: editForm.hseArea,
                hiqaRegistration: editForm.hiqaRegistration,
                hiqaLastInspection: editForm.hiqaLastInspection,
                hiqaStatus: editForm.hiqaStatus,
                jciAccredited: editForm.jciAccredited,
                nationality: editForm.nationality,
            },
            contacts: {
                ...profile.contacts,
                primary: {
                    name: editForm.primaryContactName,
                    role: editForm.primaryContactRole,
                    phone: editForm.primaryContactPhone,
                    email: editForm.primaryContactEmail,
                    mobile: editForm.primaryContactMobile,
                },
                secondary: {
                    name: editForm.secondaryContactName,
                    role: editForm.secondaryContactRole,
                    phone: editForm.secondaryContactPhone,
                    email: editForm.secondaryContactEmail,
                    mobile: editForm.secondaryContactMobile,
                },
                finance: {
                    name: editForm.financeContactName,
                    role: editForm.financeContactRole,
                    phone: editForm.financeContactPhone,
                    email: editForm.financeContactEmail,
                    mobile: editForm.financeContactMobile,
                },
                nursing: {
                    name: editForm.nursingContactName,
                    role: editForm.nursingContactRole,
                    phone: editForm.nursingContactPhone,
                    email: editForm.nursingContactEmail,
                    mobile: editForm.nursingContactMobile,
                },
                escalation: {
                    name: editForm.escalationContactName,
                    role: editForm.escalationContactRole,
                    phone: editForm.escalationContactPhone,
                    email: editForm.escalationContactEmail,
                    mobile: editForm.escalationContactMobile,
                },
            },
            contract: {
                ...profile.contract,
                frameworkType: editForm.frameworkType,
                contractRef: editForm.contractRef,
                startDate: editForm.contractStartDate,
                endDate: editForm.contractEndDate,
                autoRenewal: editForm.autoRenewal,
                paymentTerms: editForm.paymentTerms,
                invoiceFrequency: editForm.invoiceFrequency,
                poRequired: editForm.poRequired,
                agencyMargin: editForm.agencyMargin,
                vatApplicable: editForm.vatApplicable,
                vatRate: editForm.vatRate,
            }
        };
        updateProfile(updated);
        setShowEditModal(false);
        toast.success('Facility profile updated successfully');
    };

    const handleAddFacilityNote = (newNote: any) => {
        let updatedNotes;
        const noteIndex = profile.notes.findIndex((n: any) => n.id === newNote.id);
        if (noteIndex > -1) {
            updatedNotes = profile.notes.map((n: any) => n.id === newNote.id ? newNote : n);
            toast.success('Internal note updated successfully');
        } else {
            updatedNotes = [newNote, ...profile.notes];
            toast.success('Internal note added successfully');
        }
        updateProfile({ ...profile, notes: updatedNotes });
        setNoteToEdit(null);
    };

    const handleArchiveFacilityNote = (noteId: string) => {
        const updatedNotes = profile.notes.map((n: any) => {
            if (n.id === noteId) {
                return { ...n, isArchived: !n.isArchived };
            }
            return n;
        });
        updateProfile({ ...profile, notes: updatedNotes });
        const note = updatedNotes.find((n: any) => n.id === noteId);
        toast.success(note?.isArchived ? 'Note archived successfully' : 'Note restored successfully');
    };

    const handleTriggerEditNote = (note: any) => {
        setNoteToEdit(note);
        setShowAddNoteModal(true);
    };

    const handleExport = () => {
        const dataStr = JSON.stringify(profile, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = `${profile.name.replace(/\s+/g, '_')}_profile.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        toast.success('Facility profile exported successfully');
    };

    const handleToggleStatus = () => {
        const newStatus = profile.status === 'active' ? 'inactive' : 'active';
        updateProfile({ ...profile, status: newStatus });
        toast.success(`Facility status marked as ${newStatus}`);
    };

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
    const isThisFacilityWhitelabelActive = isWhitelabelActive && brandingFacilityId === facilityId;

    return (
        <div className="p-6 space-y-6">
            {/* Back + Header */}
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors">
                    <ArrowLeft className="w-4 h-4 text-[#6B7280]" />
                </button>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h2 className="text-[#1F2937]">{profile.name} Details</h2>
                        <span className={`px-2 py-0.5 rounded text-[11px] border ${typeColors[profile.type]}`}>{typeLabels[profile.type]}</span>
                        {getStatusBadge(profile.status)}
                    </div>
                    <p className="text-sm text-[#6B7280]">Comprehensive facility information, contracts, and booking history</p>
                </div>
                <div className="flex items-center gap-2 relative">
                    {/* Commented out whitelabeling preview portal trigger button
                    <button 
                        onClick={() => {
                            if (isThisFacilityWhitelabelActive) {
                                setIsWhitelabelActive(false);
                                setBrandingFacilityId(null);
                                toast.success("Returned to main portal view");
                            } else {
                                setBrandingFacilityId(facilityId);
                                setIsWhitelabelActive(true);
                                toast.success(`Active Whitelabel Portal updated to ${profile.name}!`);
                            }
                        }}
                        className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition-all font-semibold ${
                            isThisFacilityWhitelabelActive 
                                ? 'text-white shadow-md animate-pulse'
                                : 'text-[#4B5563] border border-[#E5E7EB] hover:bg-[#F9FAFB]'
                        }`}
                        style={isThisFacilityWhitelabelActive ? { backgroundColor: profile.themeColor || '#10B981' } : undefined}
                    >
                        <Sparkles className={`w-3.5 h-3.5 ${isThisFacilityWhitelabelActive ? 'animate-spin' : ''}`} />
                        <span>{isThisFacilityWhitelabelActive ? 'Portal Active' : 'Preview Portal'}</span>
                    </button>
                    */}
                    <button onClick={handleOpenEdit} className="flex items-center gap-1.5 px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"><Edit className="w-3.5 h-3.5" /> Edit</button>
                    <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"><Download className="w-3.5 h-3.5" /> Export</button>
                    <button onClick={() => setShowMoreMenu(!showMoreMenu)} className="p-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"><MoreHorizontal className="w-4 h-4 text-[#6B7280]" /></button>
                    
                    {showMoreMenu && (
                        <div className="absolute right-0 top-11 w-48 bg-white rounded-lg shadow-lg border border-[#E5E7EB] py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                            <button
                                onClick={() => {
                                    handleToggleStatus();
                                    setShowMoreMenu(false);
                                }}
                                className="w-full text-left px-4 py-2 text-xs text-[#1F2937] hover:bg-[#F9FAFB] flex items-center gap-2"
                            >
                                <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />
                                Mark as {profile.status === 'active' ? 'Inactive' : 'Active'}
                            </button>
                            <button
                                onClick={() => {
                                    toast.info('Compliance report downloaded');
                                    setShowMoreMenu(false);
                                }}
                                className="w-full text-left px-4 py-2 text-xs text-[#1F2937] hover:bg-[#F9FAFB] flex items-center gap-2 border-t border-[#F3F4F6]"
                            >
                                <ShieldCheck className="w-3.5 h-3.5 text-[#3B82F6]" />
                                Download Compliance PDF
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Header Card */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
                <div className="flex items-start gap-5">
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-[#E5E7EB]">
                        {profile.logo ? (
                            <img src={profile.logo} alt={profile.name} className="w-full h-full object-cover" />
                        ) : (
                            <Building2 className="w-10 h-10 text-[#3B82F6]" />
                        )}
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
                    {tabs.map(tab => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-3 px-4 text-sm border-b-2 transition-colors whitespace-nowrap ${
                                    isActive 
                                        ? isWhitelabelActive 
                                            ? 'text-[#1F2937]'
                                            : 'border-[#10B981] text-[#10B981]' 
                                        : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'
                                }`}
                                style={{ 
                                    fontWeight: isActive ? 600 : 400,
                                    borderColor: isActive && isWhitelabelActive ? (profile.themeColor || '#10B981') : undefined,
                                    color: isActive && isWhitelabelActive ? (profile.themeColor || '#10B981') : undefined
                                }}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
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
                                            { label: 'Zip / Postal Code', value: profile.overview.eircode },
                                            { label: 'Phone', value: profile.overview.phone },
                                            { label: 'Fax', value: profile.overview.fax },
                                            { label: 'Email', value: profile.overview.email },
                                            { label: 'Website', value: profile.overview.website },
                                            { label: 'Established', value: profile.overview.established },
                                            { label: 'Ownership', value: profile.overview.ownership },
                                            { label: 'Bed Capacity', value: `${profile.overview.beds} beds` },
                                            { label: 'Nationality', value: profile.overview.nationality || 'Irish' },
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
                                    <h4 className="text-sm text-[#1F2937] flex items-center gap-2" style={{ fontWeight: 600 }}><ShieldCheck className="w-4 h-4 text-[#10B981]" /> Accreditation & Compliance</h4>
                                    <div className="bg-[#F0FDF4] rounded-lg p-4 space-y-3">
                                        {[
                                            { label: 'Health Authority Region', value: profile.overview.hseRegion },
                                            { label: 'Service Area / Sub-District', value: profile.overview.hseArea },
                                            { label: 'Regulatory License / Registration ID', value: profile.overview.hiqaRegistration },
                                            { label: 'Last Inspection / Audit Date', value: profile.overview.hiqaLastInspection },
                                            { label: 'Compliance / Registration Status', value: profile.overview.hiqaStatus },
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
                            <div className="space-y-3">
                                {profile.notes
                                    .filter((note: any) => showArchived || !note.isArchived)
                                    .map((note: any, i: number) => (
                                        <div 
                                            key={note.id || i} 
                                            className={`p-4 border rounded-lg transition-all ${note.isArchived ? 'bg-[#F9FAFB] border-dashed border-[#D1D5DB] opacity-75' : 'border-[#E5E7EB]'}`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 bg-[#EDE9FE] rounded-full flex items-center justify-center">
                                                        <User className="w-3.5 h-3.5 text-[#8B5CF6]" />
                                                    </div>
                                                    <span className="text-sm text-[#1F2937]" style={{ fontWeight: 500 }}>{note.author}</span>
                                                    {note.isArchived && (
                                                        <span className="px-1.5 py-0.5 text-[10px] font-medium bg-[#E5E7EB] text-[#4B5563] rounded">Archived</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs text-[#9CA3AF]">{note.date}</span>
                                                    <div className="flex items-center gap-1">
                                                        <button 
                                                            onClick={() => handleTriggerEditNote(note)}
                                                            className="p-1 text-[#9CA3AF] hover:text-[#3B82F6] hover:bg-gray-100 rounded transition-colors"
                                                            title="Edit Note"
                                                        >
                                                            <Edit className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleArchiveFacilityNote(note.id)}
                                                            className={`p-1 rounded transition-colors ${note.isArchived ? 'text-[#10B981] hover:text-[#059669] hover:bg-[#ECFDF5]' : 'text-[#9CA3AF] hover:text-[#EF4444] hover:bg-red-50'}`}
                                                            title={note.isArchived ? "Restore Note" : "Archive Note"}
                                                        >
                                                            {note.isArchived ? <RotateCcw className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-[#6B7280] pl-9">{note.content}</p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Facility Profile Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-white flex-shrink-0">
                            <h3 className="text-lg font-semibold text-[#1F2937]">Edit Facility Profile</h3>
                            <button onClick={() => setShowEditModal(false)} className="text-[#9CA3AF] hover:text-[#6B7280] p-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Tab Headers */}
                        <div className="flex border-b border-[#E5E7EB] px-6 bg-[#F9FAFB] flex-shrink-0 overflow-x-auto">
                            {[
                                { id: 'overview' as const, label: '1. Overview & Accreditation' },
                                { id: 'location' as const, label: '2. Location & Region' },
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

                        <form onSubmit={handleEditSubmit} className="flex flex-col flex-1 overflow-hidden">
                            <div className="p-6 space-y-4 overflow-y-auto flex-1">
                                {modalTab === 'overview' && (
                                    <div className="space-y-4">
                                        <div className="mb-4">
                                            <label className="block text-xs text-[#6B7280] mb-2 font-medium">Facility Logo</label>
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-xl border-2 border-dashed border-[#D1D5DB] bg-[#F9FAFB] flex items-center justify-center overflow-hidden shrink-0">
                                                    {editForm.logo ? (
                                                        <img src={editForm.logo} alt="Preview" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Building2 className="w-6 h-6 text-[#9CA3AF]" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="relative inline-block">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    const reader = new FileReader();
                                                                    reader.onloadend = () => {
                                                                        setEditForm({ ...editForm, logo: reader.result as string });
                                                                        toast.success("Logo uploaded successfully!");
                                                                    };
                                                                    reader.readAsDataURL(file);
                                                                }
                                                            }}
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                        />
                                                        <button
                                                            type="button"
                                                            className="px-4 py-2 text-xs font-semibold bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB] rounded-lg hover:bg-[#E5E7EB] transition-colors"
                                                        >
                                                            Choose Logo Image
                                                        </button>
                                                    </div>
                                                    {editForm.logo && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setEditForm({ ...editForm, logo: '' })}
                                                            className="ml-3 text-xs text-[#EF4444] hover:underline font-medium"
                                                        >
                                                            Remove Logo
                                                        </button>
                                                    )}
                                                    <p className="text-[10px] text-[#9CA3AF] mt-1">Accepts PNG, JPG, or SVG. Max 2MB.</p>
                                                </div>
                                            </div>

                                        <div className="mt-4 border-t border-[#F3F4F6] pt-4">
                                            <label className="block text-xs text-[#6B7280] mb-2 font-semibold">Custom Brand Theme Color</label>
                                            <div className="flex flex-wrap items-center gap-3">
                                                {[
                                                    { hex: '#10B981', name: 'HSE Green' },
                                                    { hex: '#3B82F6', name: 'NHS Blue' },
                                                    { hex: '#6366F1', name: 'Care Indigo' },
                                                    { hex: '#7C3AED', name: 'Beacon Purple' },
                                                    { hex: '#EC4899', name: 'Clinic Pink' },
                                                    { hex: '#EF4444', name: 'Emergency Red' },
                                                    { hex: '#F59E0B', name: 'Amber Warning' },
                                                    { hex: '#0D9488', name: 'Teal Health' },
                                                ].map((color) => (
                                                    <button
                                                        key={color.hex}
                                                        type="button"
                                                        onClick={() => setEditForm({ ...editForm, themeColor: color.hex })}
                                                        className="w-8 h-8 rounded-full border-2 transition-all relative flex items-center justify-center hover:scale-110"
                                                        style={{ 
                                                            backgroundColor: color.hex,
                                                            borderColor: editForm.themeColor === color.hex ? '#1F2937' : 'transparent',
                                                            boxShadow: editForm.themeColor === color.hex ? '0 0 0 2px rgba(0,0,0,0.1)' : 'none'
                                                        }}
                                                        title={color.name}
                                                    >
                                                        {editForm.themeColor === color.hex && (
                                                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                                        )}
                                                    </button>
                                                ))}

                                                <div className="flex items-center gap-2 ml-4 pl-4 border-l border-[#E5E7EB]">
                                                    <input 
                                                        type="color" 
                                                        value={editForm.themeColor || '#10B981'}
                                                        onChange={(e) => setEditForm({ ...editForm, themeColor: e.target.value })}
                                                        className="w-8 h-8 rounded cursor-pointer border border-[#D1D5DB] p-0"
                                                    />
                                                    <input 
                                                        type="text" 
                                                        value={editForm.themeColor || '#10B981'}
                                                        onChange={(e) => setEditForm({ ...editForm, themeColor: e.target.value })}
                                                        placeholder="#10B981"
                                                        className="w-24 px-2 py-1 text-xs border border-[#E5E7EB] rounded-lg uppercase font-mono focus:outline-none focus:ring-1 focus:ring-[#10B981] text-[#1F2937] bg-white text-center"
                                                    />
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-[#9CA3AF] mt-2">Pick a brand color which will customize active buttons, navigation tabs, hover highlights, and indicators for this facility's whitelabeled view.</p>
                                        </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-[#6B7280] font-medium mb-1">Facility Name <span className="text-[#EF4444]">*</span></label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={editForm.name}
                                                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] font-medium mb-1">Facility Type <span className="text-[#EF4444]">*</span></label>
                                                <select
                                                    value={editForm.type}
                                                    onChange={e => setEditForm({ ...editForm, type: e.target.value })}
                                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                >
                                                    <option value="hospital">Hospital</option>
                                                    <option value="clinic">Clinic</option>
                                                    <option value="care_home">Care Home</option>
                                                    <option value="private_practice">Private Practice</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-[#6B7280] font-medium mb-1">Status</label>
                                                <select
                                                    value={editForm.status}
                                                    onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] font-medium mb-1">Ownership</label>
                                                <input
                                                    type="text"
                                                    value={editForm.ownership}
                                                    onChange={e => setEditForm({ ...editForm, ownership: e.target.value })}
                                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs text-[#6B7280] font-medium mb-1">Established Year</label>
                                                <input
                                                    type="number"
                                                    value={editForm.established || ''}
                                                    onChange={e => setEditForm({ ...editForm, established: Number(e.target.value) })}
                                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] font-medium mb-1">Bed Capacity</label>
                                                <input
                                                    type="number"
                                                    value={editForm.beds || ''}
                                                    onChange={e => setEditForm({ ...editForm, beds: Number(e.target.value) })}
                                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] font-medium mb-1">Nationality <span className="text-[#EF4444]">*</span></label>
                                                <select
                                                    value={editForm.nationality}
                                                    onChange={e => setEditForm({ ...editForm, nationality: e.target.value })}
                                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                >
                                                    <option value="Irish">Irish</option>
                                                    <option value="British">British</option>
                                                    <option value="American">American</option>
                                                    <option value="Canadian">Canadian</option>
                                                    <option value="Australian">Australian</option>
                                                    <option value="German">German</option>
                                                    <option value="French">French</option>
                                                    <option value="Spanish">Spanish</option>
                                                    <option value="Italian">Italian</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#6B7280] font-medium mb-1">Description</label>
                                            <textarea
                                                rows={3}
                                                value={editForm.description}
                                                onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                            />
                                        </div>
                                        <div className="border-t border-[#E5E7EB] pt-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                                                <h4 className="text-sm font-semibold text-[#1F2937]">Accreditation & Compliance</h4>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs text-[#6B7280] font-medium mb-1">Accreditation Code</label>
                                                    <input
                                                        type="text"
                                                        value={editForm.hiqaRegistration}
                                                        onChange={e => setEditForm({ ...editForm, hiqaRegistration: e.target.value })}
                                                        placeholder="e.g., HIQA-OSV-0001234"
                                                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-[#6B7280] font-medium mb-1">Compliance Status</label>
                                                    <select
                                                        value={editForm.hiqaStatus}
                                                        onChange={e => setEditForm({ ...editForm, hiqaStatus: e.target.value })}
                                                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                    >
                                                        <option value="Compliant">Compliant</option>
                                                        <option value="Substantially Compliant">Substantially Compliant</option>
                                                        <option value="Non-Compliant">Non-Compliant</option>
                                                        <option value="Pending Review">Pending Review</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-[#6B7280] font-medium mb-1">Last Audit Date</label>
                                                    <input
                                                        type="date"
                                                        value={editForm.hiqaLastInspection}
                                                        onChange={e => setEditForm({ ...editForm, hiqaLastInspection: e.target.value })}
                                                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                    />
                                                </div>
                                                <div className="flex items-center mt-5">
                                                    <label className="flex items-center gap-2 cursor-pointer text-xs text-[#6B7280] font-medium">
                                                        <input
                                                            type="checkbox"
                                                            checked={editForm.jciAccredited}
                                                            onChange={e => setEditForm({ ...editForm, jciAccredited: e.target.checked })}
                                                            className="rounded border-[#E5E7EB] text-[#10B981] focus:ring-[#10B981] w-4 h-4 bg-white"
                                                        />
                                                        JCI Accredited Facility
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {modalTab === 'location' && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2">
                                                <label className="block text-xs text-[#6B7280] font-medium mb-1">Full Address <span className="text-[#EF4444]">*</span></label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={editForm.address}
                                                    onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] font-medium mb-1">Zip / Postal Code</label>
                                                <input
                                                    type="text"
                                                    value={editForm.eircode}
                                                    onChange={e => setEditForm({ ...editForm, eircode: e.target.value })}
                                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] font-medium mb-1">Main Phone <span className="text-[#EF4444]">*</span></label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={editForm.phone}
                                                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] font-medium mb-1">Fax</label>
                                                <input
                                                    type="text"
                                                    value={editForm.fax}
                                                    onChange={e => setEditForm({ ...editForm, fax: e.target.value })}
                                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] font-medium mb-1">Email Address <span className="text-[#EF4444]">*</span></label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={editForm.email}
                                                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs text-[#6B7280] font-medium mb-1">Website</label>
                                                <input
                                                    type="text"
                                                    value={editForm.website}
                                                    onChange={e => setEditForm({ ...editForm, website: e.target.value })}
                                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                        </div>
                                        <div className="border-t border-[#E5E7EB] pt-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <FileText className="w-4 h-4 text-[#059669]" />
                                                <h4 className="text-sm font-semibold text-[#1F2937]">Region & Jurisdiction</h4>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs text-[#6B7280] font-medium mb-1">Region</label>
                                                    <input
                                                        type="text"
                                                        value={editForm.hseRegion}
                                                        onChange={e => setEditForm({ ...editForm, hseRegion: e.target.value })}
                                                        placeholder="e.g., NHS London, NSW Health, State Health Dept"
                                                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-[#6B7280] font-medium mb-1">Service Area</label>
                                                    <input
                                                        type="text"
                                                        value={editForm.hseArea}
                                                        onChange={e => setEditForm({ ...editForm, hseArea: e.target.value })}
                                                        placeholder="e.g., CHO 7 - Dublin South City"
                                                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {modalTab === 'contacts' && (
                                    <div className="space-y-6">
                                        {/* Primary Contact */}
                                        <div className="border border-[#E5E7EB] rounded-xl p-4 bg-[#F9FAFB]">
                                            <h4 className="text-sm font-semibold text-[#1F2937] flex items-center gap-1.5 mb-3">
                                                <Users className="w-4 h-4 text-[#8B5CF6]" />
                                                Primary Contact Person
                                            </h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-[11px] text-[#6B7280] font-medium mb-1">Contact Name <span className="text-[#EF4444]">*</span></label>
                                                    <input
                                                        type="text"
                                                        required={modalTab === 'contacts'}
                                                        value={editForm.primaryContactName}
                                                        onChange={e => setEditForm({ ...editForm, primaryContactName: e.target.value })}
                                                        className="w-full px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] text-[#6B7280] font-medium mb-1">Role/Position <span className="text-[#EF4444]">*</span></label>
                                                    <input
                                                        type="text"
                                                        required={modalTab === 'contacts'}
                                                        value={editForm.primaryContactRole}
                                                        onChange={e => setEditForm({ ...editForm, primaryContactRole: e.target.value })}
                                                        className="w-full px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] text-[#6B7280] font-medium mb-1">Contact Phone <span className="text-[#EF4444]">*</span></label>
                                                    <input
                                                        type="text"
                                                        required={modalTab === 'contacts'}
                                                        value={editForm.primaryContactPhone}
                                                        onChange={e => setEditForm({ ...editForm, primaryContactPhone: e.target.value })}
                                                        className="w-full px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] text-[#6B7280] font-medium mb-1">Mobile Phone</label>
                                                    <input
                                                        type="text"
                                                        value={editForm.primaryContactMobile}
                                                        onChange={e => setEditForm({ ...editForm, primaryContactMobile: e.target.value })}
                                                        className="w-full px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937]"
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="block text-[11px] text-[#6B7280] font-medium mb-1">Contact Email <span className="text-[#EF4444]">*</span></label>
                                                    <input
                                                        type="email"
                                                        required={modalTab === 'contacts'}
                                                        value={editForm.primaryContactEmail}
                                                        onChange={e => setEditForm({ ...editForm, primaryContactEmail: e.target.value })}
                                                        className="w-full px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937]"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Secondary Contact */}
                                        <div className="border border-[#E5E7EB] rounded-xl p-4 bg-white">
                                            <h4 className="text-sm font-semibold text-[#1F2937] flex items-center gap-1.5 mb-3">
                                                <Users className="w-4 h-4 text-[#3B82F6]" />
                                                Secondary Contact
                                            </h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-[11px] text-[#6B7280] font-medium mb-1">Contact Name</label>
                                                    <input
                                                        type="text"
                                                        value={editForm.secondaryContactName}
                                                        onChange={e => setEditForm({ ...editForm, secondaryContactName: e.target.value })}
                                                        className="w-full px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] text-[#6B7280] font-medium mb-1">Role/Position</label>
                                                    <input
                                                        type="text"
                                                        value={editForm.secondaryContactRole}
                                                        onChange={e => setEditForm({ ...editForm, secondaryContactRole: e.target.value })}
                                                        className="w-full px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] text-[#6B7280] font-medium mb-1">Phone</label>
                                                    <input
                                                        type="text"
                                                        value={editForm.secondaryContactPhone}
                                                        onChange={e => setEditForm({ ...editForm, secondaryContactPhone: e.target.value })}
                                                        className="w-full px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] text-[#6B7280] font-medium mb-1">Email</label>
                                                    <input
                                                        type="email"
                                                        value={editForm.secondaryContactEmail}
                                                        onChange={e => setEditForm({ ...editForm, secondaryContactEmail: e.target.value })}
                                                        className="w-full px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937]"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Finance Contact */}
                                        <div className="border border-[#E5E7EB] rounded-xl p-4 bg-white">
                                            <h4 className="text-sm font-semibold text-[#1F2937] flex items-center gap-1.5 mb-3">
                                                <Users className="w-4 h-4 text-[#F59E0B]" />
                                                Finance Contact
                                            </h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-[11px] text-[#6B7280] font-medium mb-1">Contact Name</label>
                                                    <input
                                                        type="text"
                                                        value={editForm.financeContactName}
                                                        onChange={e => setEditForm({ ...editForm, financeContactName: e.target.value })}
                                                        className="w-full px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] text-[#6B7280] font-medium mb-1">Role/Position</label>
                                                    <input
                                                        type="text"
                                                        value={editForm.financeContactRole}
                                                        onChange={e => setEditForm({ ...editForm, financeContactRole: e.target.value })}
                                                        className="w-full px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] text-[#6B7280] font-medium mb-1">Phone</label>
                                                    <input
                                                        type="text"
                                                        value={editForm.financeContactPhone}
                                                        onChange={e => setEditForm({ ...editForm, financeContactPhone: e.target.value })}
                                                        className="w-full px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] text-[#6B7280] font-medium mb-1">Email</label>
                                                    <input
                                                        type="email"
                                                        value={editForm.financeContactEmail}
                                                        onChange={e => setEditForm({ ...editForm, financeContactEmail: e.target.value })}
                                                        className="w-full px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937]"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Nursing Contact */}
                                        <div className="border border-[#E5E7EB] rounded-xl p-4 bg-white">
                                            <h4 className="text-sm font-semibold text-[#1F2937] flex items-center gap-1.5 mb-3">
                                                <Users className="w-4 h-4 text-[#10B981]" />
                                                Nursing Contact
                                            </h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-[11px] text-[#6B7280] font-medium mb-1">Contact Name</label>
                                                    <input
                                                        type="text"
                                                        value={editForm.nursingContactName}
                                                        onChange={e => setEditForm({ ...editForm, nursingContactName: e.target.value })}
                                                        className="w-full px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] text-[#6B7280] font-medium mb-1">Role/Position</label>
                                                    <input
                                                        type="text"
                                                        value={editForm.nursingContactRole}
                                                        onChange={e => setEditForm({ ...editForm, nursingContactRole: e.target.value })}
                                                        className="w-full px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] text-[#6B7280] font-medium mb-1">Phone</label>
                                                    <input
                                                        type="text"
                                                        value={editForm.nursingContactPhone}
                                                        onChange={e => setEditForm({ ...editForm, nursingContactPhone: e.target.value })}
                                                        className="w-full px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] text-[#6B7280] font-medium mb-1">Email</label>
                                                    <input
                                                        type="email"
                                                        value={editForm.nursingContactEmail}
                                                        onChange={e => setEditForm({ ...editForm, nursingContactEmail: e.target.value })}
                                                        className="w-full px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937]"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Escalation Contact */}
                                        <div className="border border-[#E5E7EB] rounded-xl p-4 bg-white">
                                            <h4 className="text-sm font-semibold text-[#1F2937] flex items-center gap-1.5 mb-3">
                                                <Users className="w-4 h-4 text-[#EF4444]" />
                                                Escalation Contact
                                            </h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-[11px] text-[#6B7280] font-medium mb-1">Contact Name</label>
                                                    <input
                                                        type="text"
                                                        value={editForm.escalationContactName}
                                                        onChange={e => setEditForm({ ...editForm, escalationContactName: e.target.value })}
                                                        className="w-full px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] text-[#6B7280] font-medium mb-1">Role/Position</label>
                                                    <input
                                                        type="text"
                                                        value={editForm.escalationContactRole}
                                                        onChange={e => setEditForm({ ...editForm, escalationContactRole: e.target.value })}
                                                        className="w-full px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] text-[#6B7280] font-medium mb-1">Phone</label>
                                                    <input
                                                        type="text"
                                                        value={editForm.escalationContactPhone}
                                                        onChange={e => setEditForm({ ...editForm, escalationContactPhone: e.target.value })}
                                                        className="w-full px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] text-[#6B7280] font-medium mb-1">Email</label>
                                                    <input
                                                        type="email"
                                                        value={editForm.escalationContactEmail}
                                                        onChange={e => setEditForm({ ...editForm, escalationContactEmail: e.target.value })}
                                                        className="w-full px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937]"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {modalTab === 'contract' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Briefcase className="w-4 h-4 text-[#10B981]" />
                                            <h4 className="text-sm font-semibold text-[#1F2937]">Framework & Contract details</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-[#6B7280] font-medium mb-1">Contract Reference Number</label>
                                                <input
                                                    type="text"
                                                    value={editForm.contractRef}
                                                    onChange={e => setEditForm({ ...editForm, contractRef: e.target.value })}
                                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] font-medium mb-1">Framework Type</label>
                                                <input
                                                    type="text"
                                                    value={editForm.frameworkType}
                                                    onChange={e => setEditForm({ ...editForm, frameworkType: e.target.value })}
                                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] font-medium mb-1">Contract Start Date</label>
                                                <input
                                                    type="date"
                                                    value={editForm.contractStartDate}
                                                    onChange={e => setEditForm({ ...editForm, contractStartDate: e.target.value })}
                                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] font-medium mb-1">Contract End Date</label>
                                                <input
                                                    type="date"
                                                    value={editForm.contractEndDate}
                                                    onChange={e => setEditForm({ ...editForm, contractEndDate: e.target.value })}
                                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] font-medium mb-1">Payment Terms</label>
                                                <select
                                                    value={editForm.paymentTerms}
                                                    onChange={e => setEditForm({ ...editForm, paymentTerms: e.target.value })}
                                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                >
                                                    <option value="Immediate">Immediate</option>
                                                    <option value="Net 15 days">Net 15 days</option>
                                                    <option value="Net 30 days">Net 30 days</option>
                                                    <option value="Net 60 days">Net 60 days</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] font-medium mb-1">Invoice Frequency</label>
                                                <select
                                                    value={editForm.invoiceFrequency}
                                                    onChange={e => setEditForm({ ...editForm, invoiceFrequency: e.target.value })}
                                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                >
                                                    <option value="Weekly">Weekly</option>
                                                    <option value="Fortnightly">Fortnightly</option>
                                                    <option value="Monthly">Monthly</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-[#6B7280] font-medium mb-1">Agency Margin (%)</label>
                                                <input
                                                    type="text"
                                                    value={editForm.agencyMargin}
                                                    onChange={e => setEditForm({ ...editForm, agencyMargin: e.target.value })}
                                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-3 justify-center mt-4">
                                                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#6B7280] font-medium">
                                                    <input
                                                        type="checkbox"
                                                        checked={editForm.poRequired}
                                                        onChange={e => setEditForm({ ...editForm, poRequired: e.target.checked })}
                                                        className="rounded border-[#E5E7EB] text-[#10B981] focus:ring-[#10B981] w-4 h-4 bg-white"
                                                    />
                                                    PO Required
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#6B7280] font-medium">
                                                    <input
                                                        type="checkbox"
                                                        checked={editForm.autoRenewal}
                                                        onChange={e => setEditForm({ ...editForm, autoRenewal: e.target.checked })}
                                                        className="rounded border-[#E5E7EB] text-[#10B981] focus:ring-[#10B981] w-4 h-4 bg-white"
                                                    />
                                                    Auto Renewal
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#6B7280] font-medium">
                                                    <input
                                                        type="checkbox"
                                                        checked={editForm.vatApplicable}
                                                        onChange={e => setEditForm({ ...editForm, vatApplicable: e.target.checked })}
                                                        className="rounded border-[#E5E7EB] text-[#10B981] focus:ring-[#10B981] w-4 h-4 bg-white"
                                                    />
                                                    VAT Applicable
                                                </label>
                                                {editForm.vatApplicable && (
                                                    <div>
                                                        <label className="block text-xs text-[#6B7280] font-medium mb-1">VAT Rate (%)</label>
                                                        <input
                                                            type="text"
                                                            value={editForm.vatRate}
                                                            onChange={e => setEditForm({ ...editForm, vatRate: e.target.value })}
                                                            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 border-t border-[#E5E7EB] bg-[#F9FAFB] flex justify-end gap-3 flex-shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#4B5563] bg-white hover:bg-[#F9FAFB] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Note Modal */}
            <AddNoteModal
                isOpen={showAddNoteModal}
                onClose={() => { setShowAddNoteModal(false); setNoteToEdit(null); }}
                onAddNote={handleAddFacilityNote}
                defaultAuthor="System Admin"
                title="Add Facility Note"
                placeholder="Type internal facility note content here..."
                noteToEdit={noteToEdit}
            />
        </div>
    );
}
