import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import {
    ArrowLeft, User, Mail, Phone, MapPin, Briefcase, Calendar, Clock,
    FileText, ShieldCheck, Star, Download, Upload, AlertTriangle,
    CheckCircle, XCircle, ChevronLeft, ChevronRight, CreditCard,
    Search, SlidersHorizontal, Heart, Globe, Hash, Building2, Award,
    BadgeCheck, Banknote, Activity, MessageSquare, Edit, MoreHorizontal,
    RefreshCw, Archive, History, ChevronDown, ChevronUp, Paperclip, X, Eye
} from 'lucide-react';

interface LocumProfilePageProps {
    locumId: string;
    onBack: () => void;
}

interface ComplianceDocument {
    name: string;
    category: string;
    status: 'valid' | 'expiring' | 'expired' | 'pending';
    expiryDate: string;
    uploadedDate: string;
    reference: string;
    mandatory: boolean;
    awardedBy: string;
    updatedBy: string;
    updatedDate: string;
    fileName: string;
    fileSize: string;
    comments: { author: string; date: string; text: string }[];
    history: { action: string; by: string; date: string; detail: string }[];
}

// Helper to build compliance documents with all new fields
function buildDocuments(): ComplianceDocument[] {
    return [
        {
            name: 'Medical Council of Ireland Registration',
            category: 'Registration',
            status: 'valid',
            expiryDate: '2027-03-31',
            uploadedDate: '2026-01-15',
            reference: 'IMC-34521',
            mandatory: true,
            awardedBy: 'Medical Council of Ireland',
            updatedBy: 'Lisa Keane',
            updatedDate: '2026-01-15',
            fileName: 'IMC_Registration_SMitchell_2027.pdf',
            fileSize: '245 KB',
            comments: [
                { author: 'Lisa Keane', date: '2026-01-15', text: 'Annual renewal received and verified against IMC online register.' },
                { author: 'Omar Murphy', date: '2025-12-10', text: 'Renewal reminder sent. Expiry approaching in Q1 2027.' },
            ],
            history: [
                { action: 'Renewed', by: 'Lisa Keane', date: '2026-01-15', detail: 'Uploaded renewed IMC certificate valid until 31/03/2027.' },
                { action: 'Verified', by: 'Omar Murphy', date: '2025-03-20', detail: 'Cross-checked against Medical Council public register.' },
                { action: 'Uploaded', by: 'Sarah Mitchell', date: '2024-01-12', detail: 'Initial registration document uploaded at onboarding.' },
            ],
        },
        {
            name: 'UK GMC Registration',
            category: 'Registration',
            status: 'valid',
            expiryDate: '2027-06-30',
            uploadedDate: '2026-01-15',
            reference: 'GMC-7654321',
            mandatory: false,
            awardedBy: 'General Medical Council (UK)',
            updatedBy: 'Lisa Keane',
            updatedDate: '2026-01-15',
            fileName: 'GMC_Registration_SMitchell_2027.pdf',
            fileSize: '198 KB',
            comments: [
                { author: 'Lisa Keane', date: '2026-01-15', text: 'GMC licence to practise confirmed active. Revalidation due 2027.' },
            ],
            history: [
                { action: 'Renewed', by: 'Lisa Keane', date: '2026-01-15', detail: 'Updated GMC certificate after annual revalidation.' },
                { action: 'Uploaded', by: 'Sarah Mitchell', date: '2023-03-15', detail: 'Initial GMC registration uploaded at onboarding.' },
            ],
        },
        {
            name: 'Garda Vetting Clearance (NVB)',
            category: 'Vetting',
            status: 'valid',
            expiryDate: '2028-01-20',
            uploadedDate: '2025-01-20',
            reference: 'NVB-2025-89012',
            mandatory: true,
            awardedBy: 'National Vetting Bureau (An Garda Siochana)',
            updatedBy: 'Omar Murphy',
            updatedDate: '2025-01-22',
            fileName: 'NVB_Vetting_Disclosure_SMitchell_2025.pdf',
            fileSize: '312 KB',
            comments: [
                { author: 'Omar Murphy', date: '2025-01-22', text: 'Re-vetting completed. No findings disclosed. Valid for 3 years per HSE policy.' },
            ],
            history: [
                { action: 'Re-vetted', by: 'Omar Murphy', date: '2025-01-22', detail: 'NVB re-vetting disclosure received. Clear - no specified information.' },
                { action: 'Uploaded', by: 'Lisa Keane', date: '2023-03-18', detail: 'Initial Garda Vetting disclosure uploaded post-onboarding.' },
            ],
        },
        {
            name: 'Professional Indemnity Insurance',
            category: 'Insurance',
            status: 'valid',
            expiryDate: '2026-12-31',
            uploadedDate: '2026-01-02',
            reference: 'MPS-IE-456789',
            mandatory: true,
            awardedBy: 'Medical Protection Society (MPS)',
            updatedBy: 'Sarah Mitchell',
            updatedDate: '2026-01-02',
            fileName: 'MPS_Indemnity_Certificate_2026.pdf',
            fileSize: '178 KB',
            comments: [
                { author: 'Lisa Keane', date: '2026-01-05', text: 'Verified cover level is adequate for consultant-grade locum surgery. Cover: \u20AC10M per claim.' },
                { author: 'Omar Murphy', date: '2025-12-15', text: 'Reminded Sarah Mitchell to renew MPS membership before 31/12/2025.' },
            ],
            history: [
                { action: 'Renewed', by: 'Sarah Mitchell', date: '2026-01-02', detail: 'Renewed MPS membership certificate uploaded. Cover valid 01/01/2026 - 31/12/2026.' },
                { action: 'Verified', by: 'Lisa Keane', date: '2026-01-05', detail: 'Confirmed cover level and specialty match. Adequate for general surgery locum work.' },
                { action: 'Uploaded', by: 'Sarah Mitchell', date: '2025-01-04', detail: 'Previous year MPS certificate uploaded.' },
            ],
        },
        {
            name: 'BLS/CPR Certification',
            category: 'Training',
            status: 'valid',
            expiryDate: '2027-06-15',
            uploadedDate: '2025-06-15',
            reference: 'ARC-BLS-2025-1234',
            mandatory: true,
            awardedBy: 'Irish Heart Foundation / ARC',
            updatedBy: 'Sarah Mitchell',
            updatedDate: '2025-06-15',
            fileName: 'BLS_CPR_Cert_SMitchell_2025.pdf',
            fileSize: '156 KB',
            comments: [
                { author: 'Lisa Keane', date: '2025-06-16', text: 'BLS provider course completed. 2-year validity per IHF guidelines.' },
            ],
            history: [
                { action: 'Renewed', by: 'Sarah Mitchell', date: '2025-06-15', detail: 'Completed BLS recertification at RCSI training centre.' },
                { action: 'Uploaded', by: 'Sarah Mitchell', date: '2023-06-20', detail: 'Initial BLS certificate uploaded.' },
            ],
        },
        {
            name: 'ACLS Certification',
            category: 'Training',
            status: 'valid',
            expiryDate: '2027-06-15',
            uploadedDate: '2025-06-15',
            reference: 'ARC-ACLS-2025-789',
            mandatory: true,
            awardedBy: 'Irish Heart Foundation / ARC',
            updatedBy: 'Sarah Mitchell',
            updatedDate: '2025-06-15',
            fileName: 'ACLS_Cert_SMitchell_2025.pdf',
            fileSize: '162 KB',
            comments: [],
            history: [
                { action: 'Renewed', by: 'Sarah Mitchell', date: '2025-06-15', detail: 'ACLS provider course completed at Beaumont Hospital training facility.' },
                { action: 'Uploaded', by: 'Sarah Mitchell', date: '2023-06-20', detail: 'Initial ACLS certificate uploaded at onboarding.' },
            ],
        },
        {
            name: 'Manual Handling Certificate',
            category: 'Training',
            status: 'valid',
            expiryDate: '2027-09-01',
            uploadedDate: '2025-09-01',
            reference: 'MH-2025-5678',
            mandatory: true,
            awardedBy: 'HSE / Approved QQI Provider',
            updatedBy: 'Lisa Keane',
            updatedDate: '2025-09-03',
            fileName: 'Manual_Handling_Cert_SMitchell_2025.pdf',
            fileSize: '134 KB',
            comments: [
                { author: 'Lisa Keane', date: '2025-09-03', text: 'Refresher training completed. Cert uploaded and verified against QQI framework.' },
            ],
            history: [
                { action: 'Renewed', by: 'Lisa Keane', date: '2025-09-03', detail: 'Manual handling refresher completed. New cert uploaded.' },
                { action: 'Uploaded', by: 'Sarah Mitchell', date: '2023-09-10', detail: 'Initial manual handling certificate at onboarding.' },
            ],
        },
        {
            name: 'Hand Hygiene Training (HSELanD)',
            category: 'Training',
            status: 'valid',
            expiryDate: '2026-11-30',
            uploadedDate: '2025-11-30',
            reference: 'HSE-HH-2025-3456',
            mandatory: true,
            awardedBy: 'HSELanD (HSE)',
            updatedBy: 'Sarah Mitchell',
            updatedDate: '2025-11-30',
            fileName: 'HSELanD_HandHygiene_SMitchell_2025.pdf',
            fileSize: '89 KB',
            comments: [],
            history: [
                { action: 'Renewed', by: 'Sarah Mitchell', date: '2025-11-30', detail: 'HSELanD hand hygiene e-learning module completed and cert downloaded.' },
                { action: 'Uploaded', by: 'Sarah Mitchell', date: '2024-11-28', detail: 'Previous year completion uploaded.' },
            ],
        },
        {
            name: 'Children First E-Learning',
            category: 'Training',
            status: 'valid',
            expiryDate: '2027-05-01',
            uploadedDate: '2025-05-01',
            reference: 'CF-2025-7890',
            mandatory: true,
            awardedBy: 'Tusla / DCEDIY',
            updatedBy: 'Sarah Mitchell',
            updatedDate: '2025-05-01',
            fileName: 'ChildrenFirst_Cert_SMitchell_2025.pdf',
            fileSize: '102 KB',
            comments: [
                { author: 'Omar Murphy', date: '2025-05-02', text: 'Children First Act 2015 e-learning completed. Required for all healthcare workers in Ireland.' },
            ],
            history: [
                { action: 'Renewed', by: 'Sarah Mitchell', date: '2025-05-01', detail: 'Children First e-learning refresher completed via Tusla portal.' },
                { action: 'Uploaded', by: 'Sarah Mitchell', date: '2023-05-05', detail: 'Initial completion certificate uploaded.' },
            ],
        },
        {
            name: 'Patient Moving & Handling',
            category: 'Training',
            status: 'valid',
            expiryDate: '2027-09-01',
            uploadedDate: '2025-09-01',
            reference: 'PMH-2025-2345',
            mandatory: false,
            awardedBy: 'HSE / Approved QQI Provider',
            updatedBy: 'Lisa Keane',
            updatedDate: '2025-09-03',
            fileName: 'PatientMH_Cert_SMitchell_2025.pdf',
            fileSize: '128 KB',
            comments: [],
            history: [
                { action: 'Renewed', by: 'Lisa Keane', date: '2025-09-03', detail: 'Completed alongside manual handling refresher.' },
            ],
        },
        {
            name: 'Infection Prevention & Control',
            category: 'Training',
            status: 'valid',
            expiryDate: '2027-02-28',
            uploadedDate: '2025-02-28',
            reference: 'IPC-2025-6789',
            mandatory: true,
            awardedBy: 'HSELanD (HSE)',
            updatedBy: 'Sarah Mitchell',
            updatedDate: '2025-02-28',
            fileName: 'IPC_Cert_SMitchell_2025.pdf',
            fileSize: '94 KB',
            comments: [
                { author: 'Lisa Keane', date: '2025-03-01', text: 'IPC training completed on HSELanD. Mandatory annual refresher per HSE policy.' },
            ],
            history: [
                { action: 'Renewed', by: 'Sarah Mitchell', date: '2025-02-28', detail: 'Annual IPC refresher completed on HSELanD.' },
                { action: 'Uploaded', by: 'Sarah Mitchell', date: '2024-03-01', detail: 'Previous year IPC cert uploaded.' },
            ],
        },
        {
            name: 'HIQA Standards Awareness',
            category: 'Training',
            status: 'valid',
            expiryDate: '2027-04-15',
            uploadedDate: '2025-04-15',
            reference: 'HIQA-2025-1234',
            mandatory: false,
            awardedBy: 'HIQA / HSELanD',
            updatedBy: 'Sarah Mitchell',
            updatedDate: '2025-04-15',
            fileName: 'HIQA_Standards_Cert_SMitchell_2025.pdf',
            fileSize: '87 KB',
            comments: [],
            history: [
                { action: 'Uploaded', by: 'Sarah Mitchell', date: '2025-04-15', detail: 'HIQA National Standards awareness e-learning completed.' },
            ],
        },
        {
            name: 'CV / Curriculum Vitae',
            category: 'Documentation',
            status: 'valid',
            expiryDate: 'N/A',
            uploadedDate: '2026-01-10',
            reference: 'CV-SM-2026',
            mandatory: true,
            awardedBy: 'Self',
            updatedBy: 'Sarah Mitchell',
            updatedDate: '2026-01-10',
            fileName: 'CV_DrSarahMitchell_Jan2026.pdf',
            fileSize: '456 KB',
            comments: [
                { author: 'Omar Murphy', date: '2026-01-12', text: 'CV reviewed. Comprehensive and up to date. Includes all relevant surgical experience.' },
            ],
            history: [
                { action: 'Updated', by: 'Sarah Mitchell', date: '2026-01-10', detail: 'Updated CV with latest surgical positions and publications.' },
                { action: 'Uploaded', by: 'Sarah Mitchell', date: '2023-03-15', detail: 'Initial CV uploaded during registration.' },
            ],
        },
        {
            name: 'Photo ID (Passport)',
            category: 'Identity',
            status: 'valid',
            expiryDate: '2031-08-15',
            uploadedDate: '2025-08-15',
            reference: 'PP-IE-123456',
            mandatory: true,
            awardedBy: 'Department of Foreign Affairs (Ireland)',
            updatedBy: 'Lisa Keane',
            updatedDate: '2025-08-16',
            fileName: 'Passport_Scan_SMitchell_2025.pdf',
            fileSize: '1.2 MB',
            comments: [
                { author: 'Lisa Keane', date: '2025-08-16', text: 'New passport issued after renewal. Previous passport (expired 2025) archived.' },
            ],
            history: [
                { action: 'Renewed', by: 'Lisa Keane', date: '2025-08-16', detail: 'New Irish passport scanned and uploaded. Expiry 15/08/2031.' },
                { action: 'Archived', by: 'Lisa Keane', date: '2025-08-16', detail: 'Previous passport scan archived (expired 15/08/2025).' },
                { action: 'Uploaded', by: 'Lisa Keane', date: '2023-03-15', detail: 'Original passport scan uploaded at onboarding.' },
            ],
        },
        {
            name: 'Right to Work Verification',
            category: 'Identity',
            status: 'valid',
            expiryDate: 'N/A',
            uploadedDate: '2023-03-15',
            reference: 'RTW-IE-CITIZEN',
            mandatory: true,
            awardedBy: 'Mployus Internal Verification',
            updatedBy: 'Lisa Keane',
            updatedDate: '2023-03-15',
            fileName: 'RTW_Verification_SMitchell.pdf',
            fileSize: '67 KB',
            comments: [
                { author: 'Lisa Keane', date: '2023-03-15', text: 'Irish citizen - automatic right to work in Ireland and UK (CTA). No visa required.' },
            ],
            history: [
                { action: 'Verified', by: 'Lisa Keane', date: '2023-03-15', detail: 'Right to work confirmed. Irish citizen under Common Travel Area (CTA) agreement.' },
            ],
        },
        {
            name: 'Two Professional References',
            category: 'Documentation',
            status: 'valid',
            expiryDate: 'N/A',
            uploadedDate: '2023-03-10',
            reference: 'REF-SM-001',
            mandatory: true,
            awardedBy: 'Previous Employers',
            updatedBy: 'Omar Murphy',
            updatedDate: '2023-03-12',
            fileName: 'Professional_References_SMitchell.pdf',
            fileSize: '234 KB',
            comments: [
                { author: 'Omar Murphy', date: '2023-03-12', text: 'Both referees contacted and confirmed via phone. Ref 1: Consultant Surgeon, St. James\'s. Ref 2: Clinical Director, Beaumont Hospital.' },
            ],
            history: [
                { action: 'Verified', by: 'Omar Murphy', date: '2023-03-12', detail: 'Phone verification completed for both referees. Satisfactory references received.' },
                { action: 'Uploaded', by: 'Sarah Mitchell', date: '2023-03-10', detail: 'Two professional reference letters uploaded.' },
            ],
        },
    ];
}

// Comprehensive mock data for UK/Ireland locum system
const locumProfiles: Record<string, any> = {
    '#GS234FS': {
        id: '#GS234FS', name: 'Sarah Mitchell', avatar: 'SM', status: 'available',
        personal: {
            dob: '1984-06-15', nationality: 'Irish', gender: 'Female',
            address: '42 Pembroke Road, Ballsbridge, Dublin 4, D04 X5K2',
            phone: '+353 1 234 5678', mobile: '+353 87 654 3210', email: 'sarah.mitchell@email.com',
            emergencyContact: 'John Mitchell (Spouse)', emergencyPhone: '+353 87 111 2233',
            ppsn: '1234567T', eircode: 'D04 X5K2',
        },
        professional: {
            specialty: 'General Surgery', subSpecialty: 'Laparoscopic Surgery',
            experience: '12 years', grade: 'Consultant',
            imcNumber: 'IMC-34521', imcExpiry: '2027-03-31', imcStatus: 'valid',
            gmcNumber: 'GMC-7654321', gmcExpiry: '2027-06-30', gmcStatus: 'valid',
            specialistRegister: 'Yes - General Surgery Division',
            qualifications: [
                { name: 'MB BCh BAO', institution: 'Trinity College Dublin', year: '2008' },
                { name: 'FRCS (General Surgery)', institution: 'Royal College of Surgeons in Ireland', year: '2014' },
                { name: 'Diploma in Minimally Invasive Surgery', institution: 'RCSI', year: '2016' },
            ],
            languages: ['English', 'Irish', 'French'],
            preferredLocations: ['Dublin', 'Wicklow', 'Kildare'],
            preferredShifts: ['Day', 'On-call'],
            maxWeeklyHours: 48,
        },
        compliance: {
            overall: 100,
            documents: buildDocuments(),
        },
        financial: {
            taxStatus: 'Self-Employed (Sole Trader)',
            revenueRegistered: true,
            vatRegistered: false,
            bankName: 'AIB',
            iban: 'IE29 AIBK 9311 5212 3456 78',
            bic: 'AIBKIE2D',
            standardDayRate: 850,
            standardNightRate: 1050,
            weekendRate: 1100,
            oncallRate: 450,
            totalEarnings: 156800,
            ytdEarnings: 18200,
            pendingPayments: 2550,
            payments: [
                { id: 'PAY-2401', date: '2026-02-07', facility: "St. James's Hospital", description: 'Day Shift - General Surgery', hours: 10, rate: 85, amount: 850, status: 'paid' },
                { id: 'PAY-2400', date: '2026-02-03', facility: "St. James's Hospital", description: 'Day Shift - General Surgery', hours: 8, rate: 85, amount: 680, status: 'paid' },
                { id: 'PAY-2399', date: '2026-01-31', facility: 'Beaumont Hospital', description: 'On-Call Cover', hours: 12, rate: 85, amount: 1020, status: 'pending' },
                { id: 'PAY-2398', date: '2026-01-28', facility: "St. James's Hospital", description: 'Day Shift - General Surgery', hours: 10, rate: 85, amount: 850, status: 'paid' },
                { id: 'PAY-2397', date: '2026-01-24', facility: 'Galway Clinic', description: 'Elective Surgery List', hours: 8, rate: 95, amount: 760, status: 'paid' },
                { id: 'PAY-2396', date: '2026-01-20', facility: 'Beaumont Hospital', description: 'Emergency Cover', hours: 12, rate: 85, amount: 1020, status: 'paid' },
            ]
        },
        shifts: {
            totalCompleted: 145, totalCancelled: 3, totalDeclined: 8, noShows: 0,
            completionRate: 98,
            recentShifts: [
                { id: 'SH-3401', facility: "St. James's Hospital, Dublin", department: 'General Surgery', date: '2026-02-07', time: '08:00 - 18:00', hours: 10, status: 'completed', rate: 85 },
                { id: 'SH-3398', facility: "St. James's Hospital, Dublin", department: 'General Surgery', date: '2026-02-03', time: '08:00 - 16:00', hours: 8, status: 'completed', rate: 85 },
                { id: 'SH-3395', facility: 'Beaumont Hospital, Dublin', department: 'Surgical On-Call', date: '2026-01-31', time: '20:00 - 08:00', hours: 12, status: 'completed', rate: 85 },
                { id: 'SH-3390', facility: "St. James's Hospital, Dublin", department: 'General Surgery', date: '2026-01-28', time: '08:00 - 18:00', hours: 10, status: 'completed', rate: 85 },
                { id: 'SH-3385', facility: 'Galway Clinic', department: 'Day Surgery', date: '2026-01-24', time: '08:00 - 16:00', hours: 8, status: 'completed', rate: 95 },
                { id: 'SH-3380', facility: 'Beaumont Hospital, Dublin', department: 'Emergency Surgery', date: '2026-01-20', time: '20:00 - 08:00', hours: 12, status: 'completed', rate: 85 },
                { id: 'SH-3376', facility: "St. James's Hospital, Dublin", department: 'General Surgery', date: '2026-01-17', time: '08:00 - 18:00', hours: 10, status: 'completed', rate: 85 },
                { id: 'SH-3371', facility: 'Cork University Hospital', department: 'General Surgery', date: '2026-01-13', time: '08:00 - 16:00', hours: 8, status: 'cancelled', rate: 85 },
            ],
            upcomingShifts: [
                { id: 'SH-3410', facility: "St. James's Hospital, Dublin", department: 'General Surgery', date: '2026-02-12', time: '08:00 - 18:00', hours: 10, status: 'confirmed', rate: 85 },
                { id: 'SH-3415', facility: 'Beaumont Hospital, Dublin', department: 'Surgical On-Call', date: '2026-02-14', time: '20:00 - 08:00', hours: 12, status: 'confirmed', rate: 85 },
                { id: 'SH-3420', facility: "St. James's Hospital, Dublin", department: 'General Surgery', date: '2026-02-17', time: '08:00 - 18:00', hours: 10, status: 'pending', rate: 85 },
            ]
        },
        performance: {
            avgRating: 4.9, totalReviews: 89, recommendRate: 98,
            ratings: { 5: 72, 4: 14, 3: 2, 2: 1, 0: 0 },
            recentFeedback: [
                { facility: "St. James's Hospital", reviewer: "Siobhan O'Reilly", rating: 5, date: '2026-02-08', comment: 'Exceptional surgeon. Completed complex laparoscopic procedure ahead of schedule. Excellent rapport with nursing staff.' },
                { facility: 'Beaumont Hospital', reviewer: 'Dr. Paul Connolly', rating: 5, date: '2026-02-01', comment: 'Outstanding on-call cover. Managed two emergency cases efficiently. Very reliable.' },
                { facility: 'Galway Clinic', reviewer: 'Aoife Brennan', rating: 5, date: '2026-01-25', comment: 'Brilliant day surgery list. Patients very satisfied. Meticulous documentation.' },
                { facility: "St. James's Hospital", reviewer: "Siobhan O'Reilly", rating: 4, date: '2026-01-18', comment: 'Great work as always. Minor delay in starting but otherwise exemplary.' },
                { facility: 'Cork University Hospital', reviewer: 'Patrick Murphy', rating: 5, date: '2026-01-14', comment: 'Superb clinical skills. Taught registrars during the list. Real asset.' },
            ],
            incidents: []
        },
        notes: [
            { date: '2026-02-05', author: 'Omar Murphy', content: 'Discussed extending availability to include Saturdays for March. Dr. Mitchell agreeable.' },
            { date: '2026-01-20', author: 'Lisa Keane', content: "Updated bank details per Sarah Mitchell's request. Verified via phone callback." },
            { date: '2025-12-10', author: 'Omar Murphy', content: 'Annual review completed. All compliance documents up to date. Excellent performer - consider for preferred locum panel.' },
        ],
        joinDate: '2023-03-15',
    },
    '#EC0125D': {
        id: '#EC0125D', name: 'James Harrison', avatar: 'JH', status: 'booked',
        personal: {
            dob: '1981-09-22', nationality: 'British/Irish', gender: 'Male',
            address: '15 Washington Street, Cork City, Cork, T12 HP62',
            phone: '+353 21 496 0202', mobile: '+353 86 789 4561', email: 'james.harrison@email.com',
            emergencyContact: 'Claire Harrison (Spouse)', emergencyPhone: '+353 86 555 7890',
            ppsn: '2345678A', eircode: 'T12 HP62',
        },
        professional: {
            specialty: 'Cardiology', subSpecialty: 'Interventional Cardiology',
            experience: '15 years', grade: 'Consultant',
            imcNumber: 'IMC-28934', imcExpiry: '2027-09-30', imcStatus: 'valid',
            gmcNumber: 'GMC-6543210', gmcExpiry: '2027-09-30', gmcStatus: 'valid',
            specialistRegister: 'Yes - Cardiology Division',
            qualifications: [
                { name: 'MB BCh BAO', institution: 'University College Cork', year: '2005' },
                { name: 'MRCPI', institution: 'Royal College of Physicians of Ireland', year: '2009' },
                { name: 'MD (Cardiology)', institution: "King's College London", year: '2013' },
                { name: 'FESC', institution: 'European Society of Cardiology', year: '2015' },
            ],
            languages: ['English'],
            preferredLocations: ['Cork', 'Waterford', 'Kerry'],
            preferredShifts: ['Day', 'On-call'],
            maxWeeklyHours: 48,
        },
        compliance: {
            overall: 100,
            documents: [
                { name: 'Medical Council of Ireland Registration', category: 'Registration', status: 'valid', expiryDate: '2027-09-30', uploadedDate: '2026-01-10', reference: 'IMC-28934', mandatory: true, awardedBy: 'Medical Council of Ireland', updatedBy: 'Lisa Keane', updatedDate: '2026-01-10', fileName: 'IMC_Registration_JHarrison_2027.pdf', fileSize: '238 KB', comments: [{ author: 'Lisa Keane', date: '2026-01-10', text: 'Annual renewal verified against IMC register.' }], history: [{ action: 'Renewed', by: 'Lisa Keane', date: '2026-01-10', detail: 'IMC certificate renewed. Valid until 30/09/2027.' }, { action: 'Uploaded', by: 'James Harrison', date: '2023-01-10', detail: 'Initial IMC registration uploaded at onboarding.' }] },
                { name: 'UK GMC Registration', category: 'Registration', status: 'valid', expiryDate: '2027-09-30', uploadedDate: '2026-01-10', reference: 'GMC-6543210', mandatory: false, awardedBy: 'General Medical Council (UK)', updatedBy: 'Lisa Keane', updatedDate: '2026-01-10', fileName: 'GMC_Registration_JHarrison_2027.pdf', fileSize: '205 KB', comments: [], history: [{ action: 'Renewed', by: 'Lisa Keane', date: '2026-01-10', detail: 'Updated GMC certificate.' }] },
                { name: 'Garda Vetting Clearance (NVB)', category: 'Vetting', status: 'valid', expiryDate: '2027-11-15', uploadedDate: '2024-11-15', reference: 'NVB-2024-67890', mandatory: true, awardedBy: 'National Vetting Bureau (An Garda Siochana)', updatedBy: 'Omar Murphy', updatedDate: '2024-11-17', fileName: 'NVB_Vetting_JHarrison_2024.pdf', fileSize: '298 KB', comments: [{ author: 'Omar Murphy', date: '2024-11-17', text: 'Re-vetting completed. Clear disclosure.' }], history: [{ action: 'Re-vetted', by: 'Omar Murphy', date: '2024-11-17', detail: 'NVB re-vetting completed.' }] },
                { name: 'Professional Indemnity Insurance', category: 'Insurance', status: 'valid', expiryDate: '2026-12-31', uploadedDate: '2026-01-05', reference: 'MDU-IE-234567', mandatory: true, awardedBy: 'Medical Defence Union (MDU)', updatedBy: 'James Harrison', updatedDate: '2026-01-05', fileName: 'MDU_Indemnity_JHarrison_2026.pdf', fileSize: '185 KB', comments: [{ author: 'Lisa Keane', date: '2026-01-06', text: 'MDU membership verified. Adequate cover for interventional cardiology.' }], history: [{ action: 'Renewed', by: 'James Harrison', date: '2026-01-05', detail: 'MDU membership renewed for 2026.' }] },
                { name: 'BLS/CPR Certification', category: 'Training', status: 'valid', expiryDate: '2027-03-20', uploadedDate: '2025-03-20', reference: 'ARC-BLS-2025-5678', mandatory: true, awardedBy: 'Irish Heart Foundation / ARC', updatedBy: 'James Harrison', updatedDate: '2025-03-20', fileName: 'BLS_Cert_JHarrison_2025.pdf', fileSize: '148 KB', comments: [], history: [{ action: 'Renewed', by: 'James Harrison', date: '2025-03-20', detail: 'BLS recertification completed.' }] },
                { name: 'ACLS Certification', category: 'Training', status: 'valid', expiryDate: '2027-03-20', uploadedDate: '2025-03-20', reference: 'ARC-ACLS-2025-345', mandatory: true, awardedBy: 'Irish Heart Foundation / ARC', updatedBy: 'James Harrison', updatedDate: '2025-03-20', fileName: 'ACLS_Cert_JHarrison_2025.pdf', fileSize: '155 KB', comments: [], history: [{ action: 'Renewed', by: 'James Harrison', date: '2025-03-20', detail: 'ACLS recertification completed.' }] },
                { name: 'Manual Handling Certificate', category: 'Training', status: 'valid', expiryDate: '2027-07-15', uploadedDate: '2025-07-15', reference: 'MH-2025-9012', mandatory: true, awardedBy: 'HSE / Approved QQI Provider', updatedBy: 'Lisa Keane', updatedDate: '2025-07-16', fileName: 'ManualHandling_JHarrison_2025.pdf', fileSize: '130 KB', comments: [], history: [{ action: 'Renewed', by: 'Lisa Keane', date: '2025-07-16', detail: 'Manual handling refresher completed.' }] },
                { name: 'Hand Hygiene Training (HSELanD)', category: 'Training', status: 'valid', expiryDate: '2026-10-20', uploadedDate: '2025-10-20', reference: 'HSE-HH-2025-7890', mandatory: true, awardedBy: 'HSELanD (HSE)', updatedBy: 'James Harrison', updatedDate: '2025-10-20', fileName: 'HSELanD_HH_JHarrison_2025.pdf', fileSize: '86 KB', comments: [], history: [{ action: 'Renewed', by: 'James Harrison', date: '2025-10-20', detail: 'Annual hand hygiene refresher completed on HSELanD.' }] },
                { name: 'Children First E-Learning', category: 'Training', status: 'valid', expiryDate: '2027-08-01', uploadedDate: '2025-08-01', reference: 'CF-2025-4567', mandatory: true, awardedBy: 'Tusla / DCEDIY', updatedBy: 'James Harrison', updatedDate: '2025-08-01', fileName: 'ChildrenFirst_JHarrison_2025.pdf', fileSize: '98 KB', comments: [], history: [{ action: 'Renewed', by: 'James Harrison', date: '2025-08-01', detail: 'Children First e-learning refresher completed.' }] },
                { name: 'Infection Prevention & Control', category: 'Training', status: 'valid', expiryDate: '2027-01-15', uploadedDate: '2025-01-15', reference: 'IPC-2025-3456', mandatory: true, awardedBy: 'HSELanD (HSE)', updatedBy: 'James Harrison', updatedDate: '2025-01-15', fileName: 'IPC_Cert_JHarrison_2025.pdf', fileSize: '91 KB', comments: [], history: [{ action: 'Renewed', by: 'James Harrison', date: '2025-01-15', detail: 'IPC annual refresher completed.' }] },
                { name: 'CV / Curriculum Vitae', category: 'Documentation', status: 'valid', expiryDate: 'N/A', uploadedDate: '2026-01-08', reference: 'CV-JH-2026', mandatory: true, awardedBy: 'Self', updatedBy: 'James Harrison', updatedDate: '2026-01-08', fileName: 'CV_DrJamesHarrison_2026.pdf', fileSize: '512 KB', comments: [], history: [{ action: 'Updated', by: 'James Harrison', date: '2026-01-08', detail: 'CV updated with latest publications and PCI data.' }] },
                { name: 'Photo ID (Passport)', category: 'Identity', status: 'valid', expiryDate: '2030-04-22', uploadedDate: '2025-04-22', reference: 'PP-IE-654321', mandatory: true, awardedBy: 'Department of Foreign Affairs (Ireland)', updatedBy: 'Lisa Keane', updatedDate: '2025-04-23', fileName: 'Passport_JHarrison_2025.pdf', fileSize: '1.1 MB', comments: [], history: [{ action: 'Uploaded', by: 'Lisa Keane', date: '2025-04-23', detail: 'Irish passport scan uploaded.' }] },
                { name: 'Right to Work Verification', category: 'Identity', status: 'valid', expiryDate: 'N/A', uploadedDate: '2023-01-10', reference: 'RTW-IE-DUAL', mandatory: true, awardedBy: 'Mployus Internal Verification', updatedBy: 'Lisa Keane', updatedDate: '2023-01-10', fileName: 'RTW_JHarrison.pdf', fileSize: '72 KB', comments: [{ author: 'Lisa Keane', date: '2023-01-10', text: 'Dual British/Irish citizen. CTA rights confirmed.' }], history: [{ action: 'Verified', by: 'Lisa Keane', date: '2023-01-10', detail: 'Right to work confirmed under CTA.' }] },
                { name: 'Two Professional References', category: 'Documentation', status: 'valid', expiryDate: 'N/A', uploadedDate: '2023-01-08', reference: 'REF-JH-001', mandatory: true, awardedBy: 'Previous Employers', updatedBy: 'Omar Murphy', updatedDate: '2023-01-10', fileName: 'References_JHarrison.pdf', fileSize: '218 KB', comments: [{ author: 'Omar Murphy', date: '2023-01-10', text: 'Both referees contacted. Excellent references from CUH and Kings College Hospital London.' }], history: [{ action: 'Verified', by: 'Omar Murphy', date: '2023-01-10', detail: 'Phone verification completed. Satisfactory.' }] },
            ]
        },
        financial: {
            taxStatus: 'Self-Employed (Sole Trader)', revenueRegistered: true, vatRegistered: false,
            bankName: 'Bank of Ireland', iban: 'IE64 BOFI 9000 1712 3456 78', bic: 'BOFIIE2D',
            standardDayRate: 950, standardNightRate: 1200, weekendRate: 1250, oncallRate: 500,
            totalEarnings: 198400, ytdEarnings: 22800, pendingPayments: 1900,
            payments: [
                { id: 'PAY-2410', date: '2026-02-06', facility: 'Cork University Hospital', description: 'Day Shift - Cardiology', hours: 10, rate: 95, amount: 950, status: 'paid' },
                { id: 'PAY-2408', date: '2026-02-01', facility: 'Cork University Hospital', description: 'On-Call Cardiology', hours: 12, rate: 95, amount: 1140, status: 'pending' },
                { id: 'PAY-2405', date: '2026-01-29', facility: 'Cork University Hospital', description: 'Day Shift - Cath Lab', hours: 8, rate: 95, amount: 760, status: 'paid' },
            ]
        },
        shifts: {
            totalCompleted: 128, totalCancelled: 2, totalDeclined: 5, noShows: 0, completionRate: 98,
            recentShifts: [
                { id: 'SH-3405', facility: 'Cork University Hospital', department: 'Cardiology', date: '2026-02-06', time: '08:00 - 18:00', hours: 10, status: 'completed', rate: 95 },
                { id: 'SH-3400', facility: 'Cork University Hospital', department: 'Cardiology On-Call', date: '2026-02-01', time: '20:00 - 08:00', hours: 12, status: 'completed', rate: 95 },
            ],
            upcomingShifts: [
                { id: 'SH-3425', facility: 'Cork University Hospital', department: 'Cath Lab', date: '2026-02-12', time: '08:00 - 18:00', hours: 10, status: 'confirmed', rate: 95 },
            ]
        },
        performance: {
            avgRating: 4.8, totalReviews: 76, recommendRate: 96,
            ratings: { 5: 58, 4: 15, 3: 2, 2: 1, 0: 0 },
            recentFeedback: [
                { facility: 'Cork University Hospital', reviewer: 'Patrick Murphy', rating: 5, date: '2026-02-07', comment: 'Excellent interventional cardiologist. Managed complex PCI with outstanding results.' },
                { facility: 'Cork University Hospital', reviewer: 'Patrick Murphy', rating: 4, date: '2026-02-02', comment: 'Very reliable on-call cover. Efficient and thorough.' },
            ],
            incidents: []
        },
        notes: [
            { date: '2026-01-15', author: 'Omar Murphy', content: 'James Harrison confirmed for CUH cardiology panel for Q1 2026.' },
        ],
        joinDate: '2023-01-10',
    },
};

// Generate basic profile for any ID not in detailed mock data
function getLocumProfile(id: string) {
    if (locumProfiles[id]) return locumProfiles[id];
    return locumProfiles['#GS234FS'];
}

export function LocumProfilePage({ locumId, onBack }: LocumProfilePageProps) {
    const [profile, setProfile] = useState(() => {
        const raw = getLocumProfile(locumId);
        // Deep copy so edits don't bleed unexpectedly until saved
        const copied = JSON.parse(JSON.stringify(raw));
        if (copied.name.startsWith('Dr. ')) {
            copied.name = copied.name.substring(4);
        }
        return copied;
    });

    const [showActionsDropdown, setShowActionsDropdown] = useState(false);
    const actionsDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (actionsDropdownRef.current && !actionsDropdownRef.current.contains(event.target as Node)) {
                setShowActionsDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Edit Profile Modal States
    const [showEditModal, setShowEditModal] = useState(false);
    const [editModalTab, setEditModalTab] = useState<'personal' | 'professional' | 'financial'>('personal');
    const [editName, setEditName] = useState('');
    const [editStatus, setEditStatus] = useState<'available' | 'booked' | 'unavailable'>('available');

    // Personal
    const [editDob, setEditDob] = useState('');
    const [editNationality, setEditNationality] = useState('');
    const [editGender, setEditGender] = useState('');
    const [editAddress, setEditAddress] = useState('');
    const [editMobile, setEditMobile] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editPpsn, setEditPpsn] = useState('');
    const [editEircode, setEditEircode] = useState('');
    const [editEmergencyContact, setEditEmergencyContact] = useState('');
    const [editEmergencyPhone, setEditEmergencyPhone] = useState('');

    // Professional
    const [editSpecialty, setEditSpecialty] = useState('');
    const [editSubSpecialty, setEditSubSpecialty] = useState('');
    const [editExperience, setEditExperience] = useState('');
    const [editGrade, setEditGrade] = useState('');
    const [editImcNumber, setEditImcNumber] = useState('');
    const [editImcExpiry, setEditImcExpiry] = useState('');
    const [editGmcNumber, setEditGmcNumber] = useState('');
    const [editGmcExpiry, setEditGmcExpiry] = useState('');
    const [editSpecialistRegister, setEditSpecialistRegister] = useState('');

    // Financial
    const [editTaxStatus, setEditTaxStatus] = useState('');
    const [editStandardDayRate, setEditStandardDayRate] = useState<number>(0);
    const [editStandardNightRate, setEditStandardNightRate] = useState<number>(0);
    const [editWeekendRate, setEditWeekendRate] = useState<number>(0);
    const [editOncallRate, setEditOncallRate] = useState<number>(0);
    const [editBankName, setEditBankName] = useState('');
    const [editIban, setEditIban] = useState('');
    const [editBic, setEditBic] = useState('');

    // Details-aligned extra edit fields
    const [editLanguages, setEditLanguages] = useState('');
    const [editMaxWeeklyHours, setEditMaxWeeklyHours] = useState<number>(48);
    const [editPreferredLocations, setEditPreferredLocations] = useState('');
    const [editPreferredShifts, setEditPreferredShifts] = useState<string[]>([]);
    const [editRevenueRegistered, setEditRevenueRegistered] = useState(false);
    const [editVatRegistered, setEditVatRegistered] = useState(false);

    const handleOpenEdit = () => {
        setEditName(profile.name);
        setEditStatus(profile.status);

        // Personal
        setEditDob(profile.personal.dob || '');
        setEditNationality(profile.personal.nationality || '');
        setEditGender(profile.personal.gender || '');
        setEditAddress(profile.personal.address || '');
        setEditMobile(profile.personal.mobile || '');
        setEditPhone(profile.personal.phone || '');
        setEditEmail(profile.personal.email || '');
        setEditPpsn(profile.personal.ppsn || '');
        setEditEircode(profile.personal.eircode || '');
        setEditEmergencyContact(profile.personal.emergencyContact || '');
        setEditEmergencyPhone(profile.personal.emergencyPhone || '');

        // Professional
        setEditSpecialty(profile.professional.specialty || '');
        setEditSubSpecialty(profile.professional.subSpecialty || '');
        setEditExperience(profile.professional.experience || '');
        setEditGrade(profile.professional.grade || '');
        setEditImcNumber(profile.professional.imcNumber || '');
        setEditImcExpiry(profile.professional.imcExpiry || '');
        setEditGmcNumber(profile.professional.gmcNumber || '');
        setEditGmcExpiry(profile.professional.gmcExpiry || '');
        setEditSpecialistRegister(profile.professional.specialistRegister || '');

        // Financial
        setEditTaxStatus(profile.financial.taxStatus || '');
        setEditStandardDayRate(profile.financial.standardDayRate || 0);
        setEditStandardNightRate(profile.financial.standardNightRate || 0);
        setEditWeekendRate(profile.financial.weekendRate || 0);
        setEditOncallRate(profile.financial.oncallRate || 0);
        setEditBankName(profile.financial.bankName || '');
        setEditIban(profile.financial.iban || '');
        setEditBic(profile.financial.bic || '');

        // Load custom extra details-aligned fields
        setEditLanguages(profile.professional.languages ? profile.professional.languages.join(', ') : '');
        setEditMaxWeeklyHours(profile.professional.maxWeeklyHours || 48);
        setEditPreferredLocations(profile.professional.preferredLocations ? profile.professional.preferredLocations.join(', ') : '');
        setEditPreferredShifts(profile.professional.preferredShifts || []);
        setEditRevenueRegistered(profile.financial.revenueRegistered || false);
        setEditVatRegistered(profile.financial.vatRegistered || false);

        setEditModalTab('personal');
        setShowEditModal(true);
    };

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        
        let cleanedName = editName;
        if (cleanedName.startsWith('Dr. ')) {
            cleanedName = cleanedName.substring(4);
        }

        const updated = {
            ...profile,
            name: cleanedName,
            status: editStatus,
            personal: {
                ...profile.personal,
                dob: editDob,
                nationality: editNationality,
                gender: editGender,
                address: editAddress,
                mobile: editMobile,
                phone: editPhone,
                email: editEmail,
                ppsn: editPpsn,
                eircode: editEircode,
                emergencyContact: editEmergencyContact,
                emergencyPhone: editEmergencyPhone,
            },
            professional: {
                ...profile.professional,
                specialty: editSpecialty,
                subSpecialty: editSubSpecialty,
                experience: editExperience,
                grade: editGrade,
                languages: editLanguages.split(',').map(s => s.trim()).filter(Boolean),
                maxWeeklyHours: Number(editMaxWeeklyHours),
                preferredLocations: editPreferredLocations.split(',').map(s => s.trim()).filter(Boolean),
                preferredShifts: editPreferredShifts,
                imcNumber: editImcNumber,
                imcExpiry: editImcExpiry,
                gmcNumber: editGmcNumber,
                gmcExpiry: editGmcExpiry,
                specialistRegister: editSpecialistRegister,
            },
            financial: {
                ...profile.financial,
                taxStatus: editTaxStatus,
                revenueRegistered: editRevenueRegistered,
                vatRegistered: editVatRegistered,
                standardDayRate: Number(editStandardDayRate),
                standardNightRate: Number(editStandardNightRate),
                weekendRate: Number(editWeekendRate),
                oncallRate: Number(editOncallRate),
                bankName: editBankName,
                iban: editIban,
                bic: editBic,
            }
        };

        setProfile(updated);
        // Persist session-wide
        locumProfiles[profile.id] = updated;

        setShowEditModal(false);
        toast.success("Profile updated successfully!");
    };

    const handleExportProfile = () => {
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(profile, null, 2))}`;
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', jsonString);
        downloadAnchor.setAttribute('download', `Locum_Profile_${profile.id.replace('#', '')}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        toast.success("Profile records exported successfully!");
    };

    const handleCopyId = () => {
        navigator.clipboard.writeText(profile.id);
        toast.success("Profile ID copied to clipboard!");
        setShowActionsDropdown(false);
    };

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

        // 1. Title
        csvContent += "LOCUM PROFILE COMPREHENSIVE REPORT\n\n";

        // 2. Personal Info
        csvContent += "PERSONAL INFORMATION\n";
        csvContent += "Locum ID,Full Name,Date of Birth,Gender,Nationality,PPSN,Eircode,Address,Email,Phone,Mobile,Joined Date\n";
        csvContent += [
            escapeCSVValue(profile.id),
            escapeCSVValue(profile.name),
            escapeCSVValue(profile.personal.dob),
            escapeCSVValue(profile.personal.gender),
            escapeCSVValue(profile.personal.nationality),
            escapeCSVValue(profile.personal.ppsn),
            escapeCSVValue(profile.personal.eircode),
            escapeCSVValue(profile.personal.address),
            escapeCSVValue(profile.personal.email),
            escapeCSVValue(profile.personal.phone),
            escapeCSVValue(profile.personal.mobile),
            escapeCSVValue(profile.joinDate)
        ].join(",") + "\n\n";

        // 3. Emergency Contacts
        csvContent += "EMERGENCY CONTACTS\n";
        csvContent += "Primary Emergency Contact,Emergency Phone\n";
        csvContent += [
            escapeCSVValue(profile.personal.emergencyContact),
            escapeCSVValue(profile.personal.emergencyPhone)
        ].join(",") + "\n\n";

        // 4. Professional Registration & Details
        csvContent += "PROFESSIONAL REGISTRATION & DETAILS\n";
        csvContent += "IMC Number,IMC Expiry,IMC Status,Specialist Register,GMC Number,GMC Expiry,GMC Status,Grade,Specialty,Sub-Specialty,Experience\n";
        csvContent += [
            escapeCSVValue(profile.professional.imcNumber),
            escapeCSVValue(profile.professional.imcExpiry),
            escapeCSVValue(profile.professional.imcStatus),
            escapeCSVValue(profile.professional.specialistRegister),
            escapeCSVValue(profile.professional.gmcNumber || "N/A"),
            escapeCSVValue(profile.professional.gmcExpiry || "N/A"),
            escapeCSVValue(profile.professional.gmcStatus || "N/A"),
            escapeCSVValue(profile.professional.grade),
            escapeCSVValue(profile.professional.specialty),
            escapeCSVValue(profile.professional.subSpecialty || "N/A"),
            escapeCSVValue(profile.professional.experience)
        ].join(",") + "\n\n";

        // Qualifications list
        csvContent += "ACADEMIC & PROFESSIONAL QUALIFICATIONS\n";
        csvContent += "Qualification Name,Institution,Year Awarded\n";
        profile.professional.qualifications.forEach((qual: any) => {
            csvContent += [
                escapeCSVValue(qual.name),
                escapeCSVValue(qual.institution),
                escapeCSVValue(qual.year)
            ].join(",") + "\n";
        });
        csvContent += "\n";

        // 5. Work Preferences & Rates
        csvContent += "WORK PREFERENCES & FINANCIAL RATES\n";
        csvContent += "Preferred Locations,Preferred Shifts,Max Weekly Hours,Standard Day Rate,Standard Night Rate,Weekend Rate,On-Call Rate,Tax Status,Revenue Registered,VAT Registered\n";
        csvContent += [
            escapeCSVValue(profile.professional.preferredLocations.join("; ")),
            escapeCSVValue(profile.professional.preferredShifts.join("; ")),
            escapeCSVValue(profile.professional.maxWeeklyHours),
            escapeCSVValue(`EUR ${profile.financial.standardDayRate}`),
            escapeCSVValue(`EUR ${profile.financial.standardNightRate}`),
            escapeCSVValue(`EUR ${profile.financial.weekendRate}`),
            escapeCSVValue(`EUR ${profile.financial.oncallRate}`),
            escapeCSVValue(profile.financial.taxStatus),
            escapeCSVValue(profile.financial.revenueRegistered ? "Yes" : "No"),
            escapeCSVValue(profile.financial.vatRegistered ? "Yes" : "No")
        ].join(",") + "\n\n";

        // 6. Compliance Summary & Document Registry
        csvContent += "COMPLIANCE & DOCUMENTS REGISTRY\n";
        csvContent += "Document Name,Category,Status,Expiry Date,Reference,Mandatory,Awarded By,File Name,File Size,Uploaded Date,Last Updated By,Last Updated Date\n";
        
        const allDocs = [
            ...profile.compliance.documents,
            ...(profile.compliance.optionalDocuments || [])
        ];
        allDocs.forEach((doc: any) => {
            csvContent += [
                escapeCSVValue(doc.name),
                escapeCSVValue(doc.category),
                escapeCSVValue(doc.status),
                escapeCSVValue(doc.expiryDate),
                escapeCSVValue(doc.reference),
                escapeCSVValue(doc.mandatory ? "Yes" : "No"),
                escapeCSVValue(doc.awardedBy),
                escapeCSVValue(doc.fileName),
                escapeCSVValue(doc.fileSize),
                escapeCSVValue(doc.uploadedDate),
                escapeCSVValue(doc.updatedBy),
                escapeCSVValue(doc.updatedDate)
            ].join(",") + "\n";
        });
        csvContent += "\n";

        // 7. Shifts History
        csvContent += "UPCOMING SHIFTS SCHEDULE\n";
        csvContent += "Shift ID,Facility,Department,Date,Time,Hours,Rate,Status\n";
        profile.shifts.upcomingShifts.forEach((shift: any) => {
            csvContent += [
                escapeCSVValue(shift.id),
                escapeCSVValue(shift.facility),
                escapeCSVValue(shift.department),
                escapeCSVValue(shift.date),
                escapeCSVValue(shift.time),
                escapeCSVValue(shift.hours),
                escapeCSVValue(shift.rate),
                escapeCSVValue(shift.status)
            ].join(",") + "\n";
        });
        csvContent += "\n";

        csvContent += "COMPLETED SHIFTS RECORDS\n";
        csvContent += "Shift ID,Facility,Department,Date,Time,Hours,Rate,Status\n";
        profile.shifts.recentShifts.forEach((shift: any) => {
            csvContent += [
                escapeCSVValue(shift.id),
                escapeCSVValue(shift.facility),
                escapeCSVValue(shift.department),
                escapeCSVValue(shift.date),
                escapeCSVValue(shift.time),
                escapeCSVValue(shift.hours),
                escapeCSVValue(shift.rate),
                escapeCSVValue(shift.status)
            ].join(",") + "\n";
        });
        csvContent += "\n";

        // 8. Payment Logs
        csvContent += "FINANCIAL TRANSACTION LOGS\n";
        csvContent += "Payment ID,Date,Description,Facility,Amount,Status\n";
        profile.financial.payments.forEach((pay: any) => {
            csvContent += [
                escapeCSVValue(pay.id),
                escapeCSVValue(pay.date),
                escapeCSVValue(pay.description),
                escapeCSVValue(pay.facility),
                escapeCSVValue(`EUR ${pay.amount}`),
                escapeCSVValue(pay.status)
            ].join(",") + "\n";
        });
        csvContent += "\n";

        // 9. Performance Summary & Ratings
        csvContent += "PERFORMANCE RATING & SERVICE RECORD\n";
        csvContent += "Average Rating,Total Reviews,Recommend Rate,Completed Shifts count,Cancelled Shifts count,Declined Shifts count,No-Show count\n";
        csvContent += [
            escapeCSVValue(profile.performance.avgRating),
            escapeCSVValue(profile.performance.totalReviews),
            escapeCSVValue(`${profile.performance.recommendRate}%`),
            escapeCSVValue(profile.shifts.totalCompleted),
            escapeCSVValue(profile.shifts.totalCancelled),
            escapeCSVValue(profile.shifts.totalDeclined),
            escapeCSVValue(profile.shifts.noShows)
        ].join(",") + "\n\n";

        csvContent += "RECENT FEEDBACK ENTRIES\n";
        csvContent += "Review Date,Author,Facility,Rating,Comment\n";
        profile.performance.recentFeedback.forEach((review: any) => {
            csvContent += [
                escapeCSVValue(review.date),
                escapeCSVValue(review.author),
                escapeCSVValue(review.facility),
                escapeCSVValue(`${review.rating}/5`),
                escapeCSVValue(review.comment)
            ].join(",") + "\n";
        });
        csvContent += "\n";

        // 10. Notes
        csvContent += "ADMINISTRATIVE RECORD NOTES\n";
        csvContent += "Date,Author,Note Text\n";
        profile.notes.forEach((note: any) => {
            csvContent += [
                escapeCSVValue(note.date),
                escapeCSVValue(note.author),
                escapeCSVValue(note.text)
            ].join(",") + "\n";
        });

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Locum_Profile_${profile.id.replace('#', '')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Profile record downloaded successfully as CSV!");
        setShowActionsDropdown(false);
    };

    const [activeTab, setActiveTab] = useState<'overview' | 'registration' | 'compliance' | 'shifts' | 'financial' | 'performance' | 'notes'>('overview');
    const [shiftFilter, setShiftFilter] = useState('all');
    const [paymentFilter, setPaymentFilter] = useState('all');

    // Compliance tab state
    const [docSearch, setDocSearch] = useState('');
    const [docCategoryFilter, setDocCategoryFilter] = useState('all');
    const [docStatusFilter, setDocStatusFilter] = useState('all');
    const [expandedDocs, setExpandedDocs] = useState<Set<number>>(new Set());
    const [historyDoc, setHistoryDoc] = useState<number | null>(null);

    const tabs = [
        { id: 'overview' as const, label: 'Overview' },
        { id: 'registration' as const, label: 'Registration & Qualifications' },
        { id: 'compliance' as const, label: 'Compliance & Documents' },
        { id: 'shifts' as const, label: 'Shift History' },
        { id: 'financial' as const, label: 'Financial' },
        { id: 'performance' as const, label: 'Performance' },
        { id: 'notes' as const, label: 'Notes & Activity' },
    ];

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            valid: 'bg-[#D1FAE5] text-[#059669] border-[#A7F3D0]',
            expiring: 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]',
            expired: 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]',
            available: 'bg-[#D1FAE5] text-[#059669] border-[#A7F3D0]',
            booked: 'bg-[#DBEAFE] text-[#1D4ED8] border-[#BFDBFE]',
            unavailable: 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]',
            completed: 'bg-[#D1FAE5] text-[#059669] border-[#A7F3D0]',
            confirmed: 'bg-[#DBEAFE] text-[#1D4ED8] border-[#BFDBFE]',
            pending: 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]',
            cancelled: 'bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]',
            paid: 'bg-[#D1FAE5] text-[#059669] border-[#A7F3D0]',
        };
        return (
            <span className={`px-2 py-0.5 rounded text-[11px] border ${styles[status] || 'bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(amount);

    const toggleDocExpand = (idx: number) => {
        setExpandedDocs(prev => {
            const next = new Set(prev);
            if (next.has(idx)) next.delete(idx);
            else next.add(idx);
            return next;
        });
    };

    // Filter compliance documents
    const allDocs: ComplianceDocument[] = profile.compliance.documents;
    const filteredDocs = allDocs.filter((doc: ComplianceDocument) => {
        const matchSearch = docSearch === '' ||
            doc.name.toLowerCase().includes(docSearch.toLowerCase()) ||
            doc.reference.toLowerCase().includes(docSearch.toLowerCase()) ||
            doc.awardedBy.toLowerCase().includes(docSearch.toLowerCase());
        const matchCategory = docCategoryFilter === 'all' || doc.category === docCategoryFilter;
        const matchStatus = docStatusFilter === 'all' || doc.status === docStatusFilter;
        return matchSearch && matchCategory && matchStatus;
    });

    const docCategories = [...new Set(allDocs.map((d: ComplianceDocument) => d.category))];

    const formatDateNice = (dateStr: string) => {
        if (dateStr === 'N/A') return 'N/A';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const getDaysUntilExpiry = (dateStr: string) => {
        if (dateStr === 'N/A') return null;
        const expiry = new Date(dateStr);
        const today = new Date(2026, 1, 10);
        const diff = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
    };

    return (
        <div className="p-6 space-y-6">
            {/* Back Button + Header */}
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors">
                    <ArrowLeft className="w-4 h-4 text-[#6B7280]" />
                </button>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h2 className="text-[#1F2937]">Locum Profile</h2>
                        {getStatusBadge(profile.status)}
                    </div>
                    <p className="text-sm text-[#6B7280]">Comprehensive locum information and compliance records</p>
                </div>
                <div className="flex items-center gap-2 relative" ref={actionsDropdownRef}>
                    <button 
                        onClick={handleOpenEdit}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
                    >
                        <Edit className="w-3.5 h-3.5" /> Edit Profile
                    </button>
                    <button 
                        onClick={handleExportCSV}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
                    >
                        <Download className="w-3.5 h-3.5" /> Export
                    </button>
                    <button 
                        onClick={() => setShowActionsDropdown(!showActionsDropdown)}
                        className={`p-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-all ${showActionsDropdown ? 'bg-[#F3F4F6] text-[#1F2937]' : ''}`}
                    >
                        <MoreHorizontal className="w-4 h-4 text-[#6B7280]" />
                    </button>

                    {showActionsDropdown && (
                        <div className="absolute right-0 top-full mt-1 bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-50 w-48 py-1">
                            <button
                                onClick={handleExportCSV}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#1F2937] hover:bg-[#F9FAFB] text-left transition-colors"
                            >
                                <FileText className="w-4 h-4 text-[#6B7280]" />
                                Export as CSV
                            </button>
                            <button
                                onClick={() => {
                                    handleExportProfile();
                                    setShowActionsDropdown(false);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#1F2937] hover:bg-[#F9FAFB] text-left transition-colors"
                            >
                                <FileText className="w-4 h-4 text-[#6B7280]" />
                                Export as JSON
                            </button>
                            <button
                                onClick={handleCopyId}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#1F2937] hover:bg-[#F9FAFB] text-left transition-colors"
                            >
                                <Hash className="w-4 h-4 text-[#6B7280]" />
                                Copy Profile ID
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Profile Header Card */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
                <div className="flex items-start gap-5">
                    <div className="w-20 h-20 bg-[#10B981] rounded-2xl flex items-center justify-center text-white text-2xl flex-shrink-0" style={{ fontWeight: 600 }}>
                        {profile.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl text-[#1F2937]" style={{ fontWeight: 700 }}>{profile.name}</h3>
                            <span className="text-xs text-[#9CA3AF] bg-[#F3F4F6] px-2 py-0.5 rounded">{profile.id}</span>
                        </div>
                        <p className="text-sm text-[#6B7280] mb-3">
                            {profile.professional.specialty} {profile.professional.subSpecialty ? `- ${profile.professional.subSpecialty}` : ''} | {profile.professional.grade} | {profile.professional.experience} experience
                        </p>
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#6B7280]">
                            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#9CA3AF]" />{profile.personal.address.split(',').slice(-2).join(',').trim()}</span>
                            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#9CA3AF]" />{profile.personal.mobile}</span>
                            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#9CA3AF]" />{profile.personal.email}</span>
                            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#9CA3AF]" />Joined {profile.joinDate}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3 flex-shrink-0">
                        <div className="bg-[#F9FAFB] rounded-lg px-4 py-3 text-center min-w-[90px]">
                            <p className="text-lg text-[#1F2937]" style={{ fontWeight: 700 }}>{profile.shifts.totalCompleted}</p>
                            <p className="text-[10px] text-[#9CA3AF]">Shifts Done</p>
                        </div>
                        <div className="bg-[#F9FAFB] rounded-lg px-4 py-3 text-center min-w-[90px]">
                            <p className="text-lg text-[#F59E0B]" style={{ fontWeight: 700 }}>{profile.performance.avgRating}</p>
                            <p className="text-[10px] text-[#9CA3AF]">Avg Rating</p>
                        </div>
                        <div className="bg-[#F9FAFB] rounded-lg px-4 py-3 text-center min-w-[90px]">
                            <p className={`text-lg ${profile.compliance.overall === 100 ? 'text-[#10B981]' : profile.compliance.overall >= 75 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`} style={{ fontWeight: 700 }}>{profile.compliance.overall}%</p>
                            <p className="text-[10px] text-[#9CA3AF]">Compliance</p>
                        </div>
                        <div className="bg-[#F9FAFB] rounded-lg px-4 py-3 text-center min-w-[90px]">
                            <p className="text-lg text-[#10B981]" style={{ fontWeight: 700 }}>{profile.shifts.completionRate}%</p>
                            <p className="text-[10px] text-[#9CA3AF]">Completion</p>
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
                            className={`py-3 px-4 text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-[#10B981] text-[#10B981]' : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'
                                }`}
                            style={{ fontWeight: activeTab === tab.id ? 600 : 400 }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {/* === OVERVIEW TAB === */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                {/* Personal Information */}
                                <div className="space-y-4">
                                    <h4 className="text-sm text-[#1F2937] flex items-center gap-2" style={{ fontWeight: 600 }}><User className="w-4 h-4 text-[#10B981]" /> Personal Information</h4>
                                    <div className="bg-[#F9FAFB] rounded-lg p-4 space-y-3">
                                        {[
                                            { label: 'Full Name', value: profile.name },
                                            { label: 'Date of Birth', value: new Date(profile.personal.dob).toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' }) },
                                            { label: 'Gender', value: profile.personal.gender },
                                            { label: 'Nationality', value: profile.personal.nationality },
                                            { label: 'PPS Number', value: profile.personal.ppsn.replace(/./g, (c: string, i: number) => i < 4 ? '*' : c) },
                                            { label: 'Address', value: profile.personal.address },
                                            { label: 'Eircode', value: profile.personal.eircode },
                                            { label: 'Phone', value: profile.personal.phone },
                                            { label: 'Mobile', value: profile.personal.mobile },
                                            { label: 'Email', value: profile.personal.email },
                                        ].map(item => (
                                            <div key={item.label} className="flex justify-between items-start">
                                                <span className="text-xs text-[#9CA3AF] min-w-[120px]">{item.label}</span>
                                                <span className="text-xs text-[#1F2937] text-right" style={{ fontWeight: 500 }}>{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Emergency Contact & Work Preferences */}
                                <div className="space-y-4">
                                    <h4 className="text-sm text-[#1F2937] flex items-center gap-2" style={{ fontWeight: 600 }}><Heart className="w-4 h-4 text-[#EF4444]" /> Emergency Contact</h4>
                                    <div className="bg-[#FEF2F2] rounded-lg p-4 space-y-3">
                                        <div className="flex justify-between"><span className="text-xs text-[#9CA3AF]">Contact</span><span className="text-xs text-[#1F2937]" style={{ fontWeight: 500 }}>{profile.personal.emergencyContact}</span></div>
                                        <div className="flex justify-between"><span className="text-xs text-[#9CA3AF]">Phone</span><span className="text-xs text-[#1F2937]" style={{ fontWeight: 500 }}>{profile.personal.emergencyPhone}</span></div>
                                    </div>

                                    <h4 className="text-sm text-[#1F2937] flex items-center gap-2 pt-2" style={{ fontWeight: 600 }}><Briefcase className="w-4 h-4 text-[#3B82F6]" /> Work Preferences</h4>
                                    <div className="bg-[#EFF6FF] rounded-lg p-4 space-y-3">
                                        <div className="flex justify-between"><span className="text-xs text-[#9CA3AF]">Preferred Locations</span><span className="text-xs text-[#1F2937] text-right" style={{ fontWeight: 500 }}>{profile.professional.preferredLocations.join(', ')}</span></div>
                                        <div className="flex justify-between"><span className="text-xs text-[#9CA3AF]">Preferred Shifts</span><span className="text-xs text-[#1F2937]" style={{ fontWeight: 500 }}>{profile.professional.preferredShifts.join(', ')}</span></div>
                                        <div className="flex justify-between"><span className="text-xs text-[#9CA3AF]">Max Weekly Hours</span><span className="text-xs text-[#1F2937]" style={{ fontWeight: 500 }}>{profile.professional.maxWeeklyHours} hrs (EWTD)</span></div>
                                        <div className="flex justify-between"><span className="text-xs text-[#9CA3AF]">Languages</span><span className="text-xs text-[#1F2937]" style={{ fontWeight: 500 }}>{profile.professional.languages.join(', ')}</span></div>
                                    </div>

                                    <h4 className="text-sm text-[#1F2937] flex items-center gap-2 pt-2" style={{ fontWeight: 600 }}><Banknote className="w-4 h-4 text-[#10B981]" /> Rate Summary</h4>
                                    <div className="bg-[#F0FDF4] rounded-lg p-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div><p className="text-[10px] text-[#065F46]">Day Rate</p><p className="text-sm text-[#065F46]" style={{ fontWeight: 700 }}>{formatCurrency(profile.financial.standardDayRate)}</p></div>
                                            <div><p className="text-[10px] text-[#065F46]">Night Rate</p><p className="text-sm text-[#065F46]" style={{ fontWeight: 700 }}>{formatCurrency(profile.financial.standardNightRate)}</p></div>
                                            <div><p className="text-[10px] text-[#065F46]">Weekend Rate</p><p className="text-sm text-[#065F46]" style={{ fontWeight: 700 }}>{formatCurrency(profile.financial.weekendRate)}</p></div>
                                            <div><p className="text-[10px] text-[#065F46]">On-Call Rate</p><p className="text-sm text-[#065F46]" style={{ fontWeight: 700 }}>{formatCurrency(profile.financial.oncallRate)}</p></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Upcoming Shifts */}
                            <div>
                                <h4 className="text-sm text-[#1F2937] flex items-center gap-2 mb-3" style={{ fontWeight: 600 }}><Calendar className="w-4 h-4 text-[#3B82F6]" /> Upcoming Shifts</h4>
                                <div className="space-y-2">
                                    {profile.shifts.upcomingShifts.map((shift: any) => (
                                        <div key={shift.id} className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-[#3B82F6] rounded-full" />
                                                <div>
                                                    <p className="text-sm text-[#1F2937]">{shift.facility}</p>
                                                    <p className="text-xs text-[#9CA3AF]">{shift.department} | {shift.date} | {shift.time}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-[#10B981]" style={{ fontWeight: 600 }}>{formatCurrency(shift.hours * shift.rate)}</span>
                                                {getStatusBadge(shift.status)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* === REGISTRATION & QUALIFICATIONS TAB === */}
                    {activeTab === 'registration' && (
                        <div className="space-y-6">
                            {/* Professional Registration */}
                            <div>
                                <h4 className="text-sm text-[#1F2937] flex items-center gap-2 mb-4" style={{ fontWeight: 600 }}><BadgeCheck className="w-4 h-4 text-[#10B981]" /> Professional Registration</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="border border-[#E5E7EB] rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>Medical Council of Ireland (IMC)</p>
                                            {getStatusBadge(profile.professional.imcStatus)}
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between"><span className="text-xs text-[#9CA3AF]">Registration No.</span><span className="text-xs text-[#1F2937]" style={{ fontWeight: 500 }}>{profile.professional.imcNumber}</span></div>
                                            <div className="flex justify-between"><span className="text-xs text-[#9CA3AF]">Expiry Date</span><span className="text-xs text-[#1F2937]" style={{ fontWeight: 500 }}>{profile.professional.imcExpiry}</span></div>
                                            <div className="flex justify-between"><span className="text-xs text-[#9CA3AF]">Specialist Register</span><span className="text-xs text-[#1F2937]" style={{ fontWeight: 500 }}>{profile.professional.specialistRegister}</span></div>
                                        </div>
                                    </div>
                                    {profile.professional.gmcNumber && (
                                        <div className="border border-[#E5E7EB] rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <p className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>UK General Medical Council (GMC)</p>
                                                {getStatusBadge(profile.professional.gmcStatus)}
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between"><span className="text-xs text-[#9CA3AF]">Registration No.</span><span className="text-xs text-[#1F2937]" style={{ fontWeight: 500 }}>{profile.professional.gmcNumber}</span></div>
                                                <div className="flex justify-between"><span className="text-xs text-[#9CA3AF]">Expiry Date</span><span className="text-xs text-[#1F2937]" style={{ fontWeight: 500 }}>{profile.professional.gmcExpiry}</span></div>
                                                <div className="flex justify-between"><span className="text-xs text-[#9CA3AF]">License Type</span><span className="text-xs text-[#1F2937]" style={{ fontWeight: 500 }}>Full Registration</span></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Qualifications */}
                            <div>
                                <h4 className="text-sm text-[#1F2937] flex items-center gap-2 mb-4" style={{ fontWeight: 600 }}><Award className="w-4 h-4 text-[#8B5CF6]" /> Qualifications & Education</h4>
                                <div className="space-y-3">
                                    {profile.professional.qualifications.map((qual: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-4 border border-[#E5E7EB] rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-[#EDE9FE] rounded-lg flex items-center justify-center">
                                                    <Award className="w-5 h-5 text-[#8B5CF6]" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>{qual.name}</p>
                                                    <p className="text-xs text-[#6B7280]">{qual.institution}</p>
                                                </div>
                                            </div>
                                            <span className="text-sm text-[#9CA3AF]">{qual.year}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Professional Details */}
                            <div>
                                <h4 className="text-sm text-[#1F2937] flex items-center gap-2 mb-4" style={{ fontWeight: 600 }}><Briefcase className="w-4 h-4 text-[#3B82F6]" /> Professional Details</h4>
                                <div className="bg-[#F9FAFB] rounded-lg p-4 grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between"><span className="text-xs text-[#9CA3AF]">Primary Specialty</span><span className="text-xs text-[#1F2937]" style={{ fontWeight: 500 }}>{profile.professional.specialty}</span></div>
                                        <div className="flex justify-between"><span className="text-xs text-[#9CA3AF]">Sub-Specialty</span><span className="text-xs text-[#1F2937]" style={{ fontWeight: 500 }}>{profile.professional.subSpecialty || 'N/A'}</span></div>
                                        <div className="flex justify-between"><span className="text-xs text-[#9CA3AF]">Grade</span><span className="text-xs text-[#1F2937]" style={{ fontWeight: 500 }}>{profile.professional.grade}</span></div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between"><span className="text-xs text-[#9CA3AF]">Years of Experience</span><span className="text-xs text-[#1F2937]" style={{ fontWeight: 500 }}>{profile.professional.experience}</span></div>
                                        <div className="flex justify-between"><span className="text-xs text-[#9CA3AF]">Languages Spoken</span><span className="text-xs text-[#1F2937]" style={{ fontWeight: 500 }}>{profile.professional.languages.join(', ')}</span></div>
                                        <div className="flex justify-between"><span className="text-xs text-[#9CA3AF]">EWTD Max Hours</span><span className="text-xs text-[#1F2937]" style={{ fontWeight: 500 }}>{profile.professional.maxWeeklyHours}h/week</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* === COMPLIANCE & DOCUMENTS TAB === */}
                    {activeTab === 'compliance' && (
                        <div className="space-y-5">
                            {/* Compliance Summary */}
                            <div className="flex items-center gap-6 p-4 bg-[#F9FAFB] rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="relative w-16 h-16">
                                        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E5E7EB" strokeWidth="3" />
                                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={profile.compliance.overall === 100 ? '#10B981' : profile.compliance.overall >= 75 ? '#F59E0B' : '#EF4444'} strokeWidth="3" strokeDasharray={`${profile.compliance.overall}, 100`} />
                                        </svg>
                                        <span className="absolute inset-0 flex items-center justify-center text-sm" style={{ fontWeight: 700 }}>{profile.compliance.overall}%</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>Overall Compliance Score</p>
                                        <p className="text-xs text-[#6B7280]">{allDocs.filter((d: ComplianceDocument) => d.status === 'valid').length} of {allDocs.length} documents valid</p>
                                    </div>
                                </div>
                                <div className="flex-1 grid grid-cols-4 gap-4">
                                    <div className="text-center">
                                        <p className="text-lg text-[#10B981]" style={{ fontWeight: 700 }}>{allDocs.filter((d: ComplianceDocument) => d.status === 'valid').length}</p>
                                        <p className="text-[10px] text-[#9CA3AF]">Valid</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg text-[#F59E0B]" style={{ fontWeight: 700 }}>{allDocs.filter((d: ComplianceDocument) => d.status === 'expiring').length}</p>
                                        <p className="text-[10px] text-[#9CA3AF]">Expiring Soon</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg text-[#EF4444]" style={{ fontWeight: 700 }}>{allDocs.filter((d: ComplianceDocument) => d.status === 'expired').length}</p>
                                        <p className="text-[10px] text-[#9CA3AF]">Expired</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg text-[#1F2937]" style={{ fontWeight: 700 }}>{allDocs.filter((d: ComplianceDocument) => d.mandatory).length}</p>
                                        <p className="text-[10px] text-[#9CA3AF]">Required</p>
                                    </div>
                                </div>
                            </div>

                            {/* Search & Filter Toolbar */}
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1 max-w-sm">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                                    <input
                                        value={docSearch}
                                        onChange={e => setDocSearch(e.target.value)}
                                        placeholder="Search documents, references, awarding bodies..."
                                        className="w-full pl-9 pr-4 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                    />
                                </div>
                                <select value={docCategoryFilter} onChange={e => setDocCategoryFilter(e.target.value)} className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg">
                                    <option value="all">All Categories</option>
                                    {docCategories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <select value={docStatusFilter} onChange={e => setDocStatusFilter(e.target.value)} className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg">
                                    <option value="all">All Status</option>
                                    <option value="valid">Valid</option>
                                    <option value="expiring">Expiring</option>
                                    <option value="expired">Expired</option>
                                </select>
                                <span className="text-xs text-[#9CA3AF] ml-2">{filteredDocs.length} document{filteredDocs.length !== 1 ? 's' : ''}</span>
                            </div>

                            {/* Document Cards by Category */}
                            {docCategories.map(category => {
                                const categoryDocs = filteredDocs.filter((d: ComplianceDocument) => d.category === category);
                                if (categoryDocs.length === 0) return null;

                                return (
                                    <div key={category}>
                                        <div className="flex items-center gap-2 mb-3">
                                            <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>{category}</h4>
                                            <span className="text-[10px] text-[#9CA3AF] bg-[#F3F4F6] px-1.5 py-0.5 rounded">{categoryDocs.length}</span>
                                        </div>
                                        <div className="space-y-2">
                                            {categoryDocs.map((doc: ComplianceDocument) => {
                                                const globalIdx = allDocs.indexOf(doc);
                                                const isExpanded = expandedDocs.has(globalIdx);
                                                const daysLeft = getDaysUntilExpiry(doc.expiryDate);

                                                return (
                                                    <div key={globalIdx} className={`border rounded-lg transition-all ${isExpanded ? 'border-[#10B981]/30 shadow-sm' : 'border-[#E5E7EB] hover:border-[#D1D5DB]'}`}>
                                                        {/* Main Row */}
                                                        <div className="p-3">
                                                            <div className="flex items-start gap-3">
                                                                {/* Status Icon */}
                                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${doc.status === 'valid' ? 'bg-[#D1FAE5]' : doc.status === 'expiring' ? 'bg-[#FEF3C7]' : 'bg-[#FEE2E2]'
                                                                    }`}>
                                                                    {doc.status === 'valid' ? <CheckCircle className="w-4 h-4 text-[#10B981]" /> :
                                                                        doc.status === 'expiring' ? <AlertTriangle className="w-4 h-4 text-[#F59E0B]" /> :
                                                                            <XCircle className="w-4 h-4 text-[#EF4444]" />}
                                                                </div>

                                                                {/* Document Info */}
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <p className="text-sm text-[#1F2937] truncate" style={{ fontWeight: 500 }}>{doc.name}</p>
                                                                        {doc.mandatory && (
                                                                            <span className="text-[9px] text-[#EF4444] border border-[#FECACA] bg-[#FEF2F2] px-1.5 py-0.5 rounded flex-shrink-0" style={{ fontWeight: 500 }}>Required</span>
                                                                        )}
                                                                        {!doc.mandatory && (
                                                                            <span className="text-[9px] text-[#6B7280] border border-[#E5E7EB] bg-[#F9FAFB] px-1.5 py-0.5 rounded flex-shrink-0">Optional</span>
                                                                        )}
                                                                        {getStatusBadge(doc.status)}
                                                                    </div>

                                                                    {/* Key details row */}
                                                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#6B7280]">
                                                                        <span className="flex items-center gap-1">
                                                                            <Award className="w-3 h-3 text-[#9CA3AF]" />
                                                                            <span className="text-[#9CA3AF]">Awarded:</span> {doc.awardedBy}
                                                                        </span>
                                                                        <span className="flex items-center gap-1">
                                                                            <Hash className="w-3 h-3 text-[#9CA3AF]" />
                                                                            <span className="text-[#9CA3AF]">Ref:</span> {doc.reference}
                                                                        </span>
                                                                        {doc.expiryDate !== 'N/A' && (
                                                                            <span className="flex items-center gap-1">
                                                                                <Calendar className="w-3 h-3 text-[#9CA3AF]" />
                                                                                <span className="text-[#9CA3AF]">Expires:</span>
                                                                                <span style={{ fontWeight: 500 }}>{formatDateNice(doc.expiryDate)}</span>
                                                                                {daysLeft !== null && daysLeft > 0 && daysLeft <= 90 && (
                                                                                    <span className="text-[#D97706] bg-[#FEF3C7] px-1 rounded text-[9px]" style={{ fontWeight: 500 }}>{daysLeft}d</span>
                                                                                )}
                                                                                {daysLeft !== null && daysLeft <= 0 && (
                                                                                    <span className="text-[#DC2626] bg-[#FEE2E2] px-1 rounded text-[9px]" style={{ fontWeight: 500 }}>Expired</span>
                                                                                )}
                                                                            </span>
                                                                        )}
                                                                        {doc.expiryDate === 'N/A' && (
                                                                            <span className="flex items-center gap-1">
                                                                                <Calendar className="w-3 h-3 text-[#9CA3AF]" />
                                                                                <span className="text-[#9CA3AF]">Expires:</span> No expiry
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    {/* Second info row */}
                                                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#6B7280] mt-1">
                                                                        <span className="flex items-center gap-1">
                                                                            <Paperclip className="w-3 h-3 text-[#9CA3AF]" />
                                                                            <span className="text-[#3B82F6] hover:underline cursor-pointer">{doc.fileName}</span>
                                                                            <span className="text-[#9CA3AF]">({doc.fileSize})</span>
                                                                        </span>
                                                                        <span className="flex items-center gap-1">
                                                                            <Upload className="w-3 h-3 text-[#9CA3AF]" />
                                                                            <span className="text-[#9CA3AF]">Uploaded:</span> {formatDateNice(doc.uploadedDate)}
                                                                        </span>
                                                                        <span className="flex items-center gap-1">
                                                                            <User className="w-3 h-3 text-[#9CA3AF]" />
                                                                            <span className="text-[#9CA3AF]">Updated by:</span>
                                                                            <span style={{ fontWeight: 500 }}>{doc.updatedBy}</span>
                                                                            <span className="text-[#9CA3AF]">on {formatDateNice(doc.updatedDate)}</span>
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {/* Action Buttons */}
                                                                <div className="flex items-center gap-1 flex-shrink-0">
                                                                    <button className="p-1.5 text-[#6B7280] hover:bg-[#F3F4F6] rounded-lg transition-colors" title="Download">
                                                                        <Download className="w-3.5 h-3.5" />
                                                                    </button>
                                                                    <button className="p-1.5 text-[#6B7280] hover:bg-[#F3F4F6] rounded-lg transition-colors" title="Edit">
                                                                        <Edit className="w-3.5 h-3.5" />
                                                                    </button>
                                                                    <button className="px-2 py-1 text-[10px] text-[#10B981] border border-[#10B981] rounded hover:bg-[#D1FAE5] transition-colors flex items-center gap-1" title="Update / Renew">
                                                                        <RefreshCw className="w-3 h-3" /> Renew
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setHistoryDoc(historyDoc === globalIdx ? null : globalIdx)}
                                                                        className={`px-2 py-1 text-[10px] border rounded flex items-center gap-1 transition-colors ${historyDoc === globalIdx ? 'text-[#8B5CF6] border-[#8B5CF6] bg-[#EDE9FE]' : 'text-[#6B7280] border-[#E5E7EB] hover:bg-[#F9FAFB]'}`}
                                                                        title="View History"
                                                                    >
                                                                        <History className="w-3 h-3" /> History
                                                                    </button>
                                                                    <button className="p-1.5 text-[#6B7280] hover:bg-[#FEF2F2] hover:text-[#DC2626] rounded-lg transition-colors" title="Archive">
                                                                        <Archive className="w-3.5 h-3.5" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => toggleDocExpand(globalIdx)}
                                                                        className="p-1.5 text-[#6B7280] hover:bg-[#F3F4F6] rounded-lg transition-colors"
                                                                    >
                                                                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* History Panel */}
                                                        {historyDoc === globalIdx && (
                                                            <div className="border-t border-[#E5E7EB] bg-[#FAFBFF] px-4 py-3">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <p className="text-xs text-[#1F2937] flex items-center gap-1.5" style={{ fontWeight: 600 }}>
                                                                        <History className="w-3.5 h-3.5 text-[#8B5CF6]" /> Document History
                                                                    </p>
                                                                    <button onClick={() => setHistoryDoc(null)} className="p-0.5 hover:bg-[#E5E7EB] rounded">
                                                                        <X className="w-3 h-3 text-[#9CA3AF]" />
                                                                    </button>
                                                                </div>
                                                                <div className="relative pl-4">
                                                                    <div className="absolute left-[7px] top-1 bottom-1 w-px bg-[#E5E7EB]" />
                                                                    <div className="space-y-2.5">
                                                                        {doc.history.map((entry, hIdx) => (
                                                                            <div key={hIdx} className="relative flex items-start gap-3">
                                                                                <div className={`w-3.5 h-3.5 rounded-full border-2 bg-white flex-shrink-0 -ml-[11px] z-10 ${entry.action === 'Renewed' || entry.action === 'Updated' ? 'border-[#10B981]' :
                                                                                        entry.action === 'Verified' ? 'border-[#3B82F6]' :
                                                                                            entry.action === 'Archived' ? 'border-[#9CA3AF]' :
                                                                                                entry.action === 'Re-vetted' ? 'border-[#8B5CF6]' :
                                                                                                    'border-[#E5E7EB]'
                                                                                    }`} />
                                                                                <div className="flex-1 min-w-0">
                                                                                    <div className="flex items-center gap-2">
                                                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${entry.action === 'Renewed' || entry.action === 'Updated' ? 'bg-[#D1FAE5] text-[#059669] border-[#A7F3D0]' :
                                                                                                entry.action === 'Verified' ? 'bg-[#DBEAFE] text-[#1D4ED8] border-[#BFDBFE]' :
                                                                                                    entry.action === 'Re-vetted' ? 'bg-[#EDE9FE] text-[#7C3AED] border-[#DDD6FE]' :
                                                                                                        entry.action === 'Archived' ? 'bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]' :
                                                                                                            'bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]'
                                                                                            }`} style={{ fontWeight: 500 }}>{entry.action}</span>
                                                                                        <span className="text-[10px] text-[#1F2937]" style={{ fontWeight: 500 }}>{entry.by}</span>
                                                                                        <span className="text-[10px] text-[#9CA3AF]">{formatDateNice(entry.date)}</span>
                                                                                    </div>
                                                                                    <p className="text-[10px] text-[#6B7280] mt-0.5">{entry.detail}</p>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Expanded Details */}
                                                        {isExpanded && (
                                                            <div className="border-t border-[#E5E7EB] bg-[#F9FAFB] p-4 space-y-4">
                                                                {/* Full detail grid */}
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div className="space-y-2.5">
                                                                        <p className="text-[10px] text-[#9CA3AF]" style={{ fontWeight: 600 }}>DOCUMENT DETAILS</p>
                                                                        <div className="bg-white rounded-lg p-3 space-y-2 border border-[#E5E7EB]">
                                                                            {[
                                                                                { label: 'Document Name', value: doc.name },
                                                                                { label: 'Category', value: doc.category },
                                                                                { label: 'Reference', value: doc.reference },
                                                                                { label: 'Compliance', value: doc.mandatory ? 'Required for compliance' : 'Optional / Recommended' },
                                                                                { label: 'Awarded / Issued By', value: doc.awardedBy },
                                                                            ].map(item => (
                                                                                <div key={item.label} className="flex items-start justify-between">
                                                                                    <span className="text-[10px] text-[#9CA3AF] min-w-[110px]">{item.label}</span>
                                                                                    <span className="text-[10px] text-[#1F2937] text-right" style={{ fontWeight: 500 }}>{item.value}</span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                    <div className="space-y-2.5">
                                                                        <p className="text-[10px] text-[#9CA3AF]" style={{ fontWeight: 600 }}>FILE & AUDIT TRAIL</p>
                                                                        <div className="bg-white rounded-lg p-3 space-y-2 border border-[#E5E7EB]">
                                                                            {[
                                                                                { label: 'File Name', value: doc.fileName },
                                                                                { label: 'File Size', value: doc.fileSize },
                                                                                { label: 'Originally Uploaded', value: formatDateNice(doc.uploadedDate) },
                                                                                { label: 'Expiry Date', value: doc.expiryDate === 'N/A' ? 'No expiry' : formatDateNice(doc.expiryDate) },
                                                                                { label: 'Last Updated By', value: `${doc.updatedBy} on ${formatDateNice(doc.updatedDate)}` },
                                                                            ].map(item => (
                                                                                <div key={item.label} className="flex items-start justify-between">
                                                                                    <span className="text-[10px] text-[#9CA3AF] min-w-[110px]">{item.label}</span>
                                                                                    <span className="text-[10px] text-[#1F2937] text-right" style={{ fontWeight: 500 }}>{item.value}</span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Comments Section */}
                                                                <div>
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <p className="text-[10px] text-[#9CA3AF]" style={{ fontWeight: 600 }}>COMMENTS ({doc.comments.length})</p>
                                                                        <button className="text-[10px] text-[#10B981] hover:underline flex items-center gap-1" style={{ fontWeight: 500 }}>
                                                                            <MessageSquare className="w-3 h-3" /> Add Comment
                                                                        </button>
                                                                    </div>
                                                                    {doc.comments.length > 0 ? (
                                                                        <div className="space-y-2">
                                                                            {doc.comments.map((comment, cIdx) => (
                                                                                <div key={cIdx} className="bg-white rounded-lg p-2.5 border border-[#E5E7EB]">
                                                                                    <div className="flex items-center justify-between mb-1">
                                                                                        <div className="flex items-center gap-1.5">
                                                                                            <div className="w-5 h-5 bg-[#EDE9FE] rounded-full flex items-center justify-center">
                                                                                                <User className="w-2.5 h-2.5 text-[#8B5CF6]" />
                                                                                            </div>
                                                                                            <span className="text-[10px] text-[#1F2937]" style={{ fontWeight: 500 }}>{comment.author}</span>
                                                                                        </div>
                                                                                        <span className="text-[9px] text-[#9CA3AF]">{formatDateNice(comment.date)}</span>
                                                                                    </div>
                                                                                    <p className="text-[10px] text-[#6B7280] pl-[26px]">{comment.text}</p>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="bg-white rounded-lg p-3 border border-dashed border-[#E5E7EB] text-center">
                                                                            <p className="text-[10px] text-[#9CA3AF]">No comments yet</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Bottom Actions */}
                            <div className="flex gap-2 pt-2">
                                <button className="px-4 py-2 text-sm bg-[#10B981] text-white rounded-lg hover:bg-[#059669]">Send Compliance Reminder</button>
                                <button className="px-4 py-2 text-sm border border-[#E5E7EB] text-[#1F2937] rounded-lg hover:bg-[#F9FAFB]">Request Document Upload</button>
                                <button className="px-4 py-2 text-sm border border-[#E5E7EB] text-[#1F2937] rounded-lg hover:bg-[#F9FAFB] flex items-center gap-1.5">
                                    <Download className="w-3.5 h-3.5" /> Export Compliance Pack
                                </button>
                            </div>
                        </div>
                    )}

                    {/* === SHIFT HISTORY TAB === */}
                    {activeTab === 'shifts' && (
                        <div className="space-y-4">
                            {/* Shift Stats */}
                            <div className="grid grid-cols-5 gap-4">
                                <div className="bg-[#F9FAFB] rounded-lg p-3 text-center"><p className="text-lg text-[#1F2937]" style={{ fontWeight: 700 }}>{profile.shifts.totalCompleted}</p><p className="text-[10px] text-[#9CA3AF]">Completed</p></div>
                                <div className="bg-[#F9FAFB] rounded-lg p-3 text-center"><p className="text-lg text-[#10B981]" style={{ fontWeight: 700 }}>{profile.shifts.completionRate}%</p><p className="text-[10px] text-[#9CA3AF]">Completion Rate</p></div>
                                <div className="bg-[#F9FAFB] rounded-lg p-3 text-center"><p className="text-lg text-[#F59E0B]" style={{ fontWeight: 700 }}>{profile.shifts.totalCancelled}</p><p className="text-[10px] text-[#9CA3AF]">Cancelled</p></div>
                                <div className="bg-[#F9FAFB] rounded-lg p-3 text-center"><p className="text-lg text-[#6B7280]" style={{ fontWeight: 700 }}>{profile.shifts.totalDeclined}</p><p className="text-[10px] text-[#9CA3AF]">Declined</p></div>
                                <div className="bg-[#F9FAFB] rounded-lg p-3 text-center"><p className="text-lg text-[#EF4444]" style={{ fontWeight: 700 }}>{profile.shifts.noShows}</p><p className="text-[10px] text-[#9CA3AF]">No Shows</p></div>
                            </div>

                            {/* Filter */}
                            <div className="flex items-center gap-2">
                                <select value={shiftFilter} onChange={e => setShiftFilter(e.target.value)} className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg">
                                    <option value="all">All Shifts</option>
                                    <option value="completed">Completed</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="pending">Pending</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            {/* Upcoming */}
                            {profile.shifts.upcomingShifts.length > 0 && (
                                <div>
                                    <h4 className="text-sm text-[#1F2937] mb-2" style={{ fontWeight: 600 }}>Upcoming</h4>
                                    <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
                                        <table className="w-full">
                                            <thead><tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                                                {['Shift ID', 'Facility', 'Department', 'Date', 'Time', 'Hours', 'Rate', 'Status'].map(h => (
                                                    <th key={h} className="px-3 py-2 text-left text-xs text-[#9CA3AF]" style={{ fontWeight: 500 }}>{h}</th>
                                                ))}
                                            </tr></thead>
                                            <tbody>
                                                {profile.shifts.upcomingShifts.map((s: any) => (
                                                    <tr key={s.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                                                        <td className="px-3 py-2.5 text-xs text-[#6B7280]">{s.id}</td>
                                                        <td className="px-3 py-2.5 text-xs text-[#1F2937]" style={{ fontWeight: 500 }}>{s.facility}</td>
                                                        <td className="px-3 py-2.5 text-xs text-[#6B7280]">{s.department}</td>
                                                        <td className="px-3 py-2.5 text-xs text-[#6B7280]">{s.date}</td>
                                                        <td className="px-3 py-2.5 text-xs text-[#6B7280]">{s.time}</td>
                                                        <td className="px-3 py-2.5 text-xs text-[#6B7280]">{s.hours}h</td>
                                                        <td className="px-3 py-2.5 text-xs text-[#10B981]" style={{ fontWeight: 500 }}>{formatCurrency(s.hours * s.rate)}</td>
                                                        <td className="px-3 py-2.5">{getStatusBadge(s.status)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Recent Shifts */}
                            <div>
                                <h4 className="text-sm text-[#1F2937] mb-2" style={{ fontWeight: 600 }}>History</h4>
                                <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
                                    <table className="w-full">
                                        <thead><tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                                            {['Shift ID', 'Facility', 'Department', 'Date', 'Time', 'Hours', 'Earnings', 'Status'].map(h => (
                                                <th key={h} className="px-3 py-2 text-left text-xs text-[#9CA3AF]" style={{ fontWeight: 500 }}>{h}</th>
                                            ))}
                                        </tr></thead>
                                        <tbody>
                                            {profile.shifts.recentShifts
                                                .filter((s: any) => shiftFilter === 'all' || s.status === shiftFilter)
                                                .map((s: any) => (
                                                    <tr key={s.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                                                        <td className="px-3 py-2.5 text-xs text-[#6B7280]">{s.id}</td>
                                                        <td className="px-3 py-2.5 text-xs text-[#1F2937]" style={{ fontWeight: 500 }}>{s.facility}</td>
                                                        <td className="px-3 py-2.5 text-xs text-[#6B7280]">{s.department}</td>
                                                        <td className="px-3 py-2.5 text-xs text-[#6B7280]">{s.date}</td>
                                                        <td className="px-3 py-2.5 text-xs text-[#6B7280]">{s.time}</td>
                                                        <td className="px-3 py-2.5 text-xs text-[#6B7280]">{s.hours}h</td>
                                                        <td className="px-3 py-2.5 text-xs text-[#10B981]" style={{ fontWeight: 500 }}>{formatCurrency(s.hours * s.rate)}</td>
                                                        <td className="px-3 py-2.5">{getStatusBadge(s.status)}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* === FINANCIAL TAB === */}
                    {activeTab === 'financial' && (
                        <div className="space-y-6">
                            {/* Financial Summary */}
                            <div className="grid grid-cols-4 gap-4">
                                <div className="bg-[#F0FDF4] rounded-lg p-4 border border-[#A7F3D0]"><p className="text-xs text-[#065F46]">Total Earnings (All Time)</p><p className="text-xl text-[#065F46] mt-1" style={{ fontWeight: 700 }}>{formatCurrency(profile.financial.totalEarnings)}</p></div>
                                <div className="bg-[#F0FDF4] rounded-lg p-4 border border-[#A7F3D0]"><p className="text-xs text-[#065F46]">YTD Earnings (2026)</p><p className="text-xl text-[#065F46] mt-1" style={{ fontWeight: 700 }}>{formatCurrency(profile.financial.ytdEarnings)}</p></div>
                                <div className="bg-[#FEF3C7] rounded-lg p-4 border border-[#FDE68A]"><p className="text-xs text-[#92400E]">Pending Payments</p><p className="text-xl text-[#92400E] mt-1" style={{ fontWeight: 700 }}>{formatCurrency(profile.financial.pendingPayments)}</p></div>
                                <div className="bg-[#F9FAFB] rounded-lg p-4 border border-[#E5E7EB]"><p className="text-xs text-[#6B7280]">Avg. Monthly</p><p className="text-xl text-[#1F2937] mt-1" style={{ fontWeight: 700 }}>{formatCurrency(profile.financial.ytdEarnings / 2)}</p></div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                {/* Tax & Banking */}
                                <div>
                                    <h4 className="text-sm text-[#1F2937] flex items-center gap-2 mb-3" style={{ fontWeight: 600 }}><CreditCard className="w-4 h-4 text-[#6B7280]" /> Tax & Banking Details</h4>
                                    <div className="bg-[#F9FAFB] rounded-lg p-4 space-y-3">
                                        <div className="flex justify-between"><span className="text-xs text-[#9CA3AF]">Tax Status</span><span className="text-xs text-[#1F2937]" style={{ fontWeight: 500 }}>{profile.financial.taxStatus}</span></div>
                                        <div className="flex justify-between"><span className="text-xs text-[#9CA3AF]">Revenue Registered</span><span className="text-xs text-[#1F2937]" style={{ fontWeight: 500 }}>{profile.financial.revenueRegistered ? 'Yes' : 'No'}</span></div>
                                        <div className="flex justify-between"><span className="text-xs text-[#9CA3AF]">VAT Registered</span><span className="text-xs text-[#1F2937]" style={{ fontWeight: 500 }}>{profile.financial.vatRegistered ? 'Yes' : 'No'}</span></div>
                                        <div className="border-t border-[#E5E7EB] pt-3">
                                            <div className="flex justify-between"><span className="text-xs text-[#9CA3AF]">Bank</span><span className="text-xs text-[#1F2937]" style={{ fontWeight: 500 }}>{profile.financial.bankName}</span></div>
                                        </div>
                                        <div className="flex justify-between"><span className="text-xs text-[#9CA3AF]">IBAN</span><span className="text-xs text-[#1F2937]" style={{ fontWeight: 500 }}>{profile.financial.iban.slice(0, 8)}****{profile.financial.iban.slice(-4)}</span></div>
                                        <div className="flex justify-between"><span className="text-xs text-[#9CA3AF]">BIC</span><span className="text-xs text-[#1F2937]" style={{ fontWeight: 500 }}>{profile.financial.bic}</span></div>
                                    </div>
                                </div>

                                {/* Rates */}
                                <div>
                                    <h4 className="text-sm text-[#1F2937] flex items-center gap-2 mb-3" style={{ fontWeight: 600 }}><Banknote className="w-4 h-4 text-[#10B981]" /> Agreed Rates</h4>
                                    <div className="bg-[#F9FAFB] rounded-lg p-4 space-y-3">
                                        <div className="flex justify-between"><span className="text-xs text-[#9CA3AF]">Standard Day Rate</span><span className="text-xs text-[#1F2937]" style={{ fontWeight: 600 }}>{formatCurrency(profile.financial.standardDayRate)}</span></div>
                                        <div className="flex justify-between"><span className="text-xs text-[#9CA3AF]">Night Rate</span><span className="text-xs text-[#1F2937]" style={{ fontWeight: 600 }}>{formatCurrency(profile.financial.standardNightRate)}</span></div>
                                        <div className="flex justify-between"><span className="text-xs text-[#9CA3AF]">Weekend Rate</span><span className="text-xs text-[#1F2937]" style={{ fontWeight: 600 }}>{formatCurrency(profile.financial.weekendRate)}</span></div>
                                        <div className="flex justify-between"><span className="text-xs text-[#9CA3AF]">On-Call Rate</span><span className="text-xs text-[#1F2937]" style={{ fontWeight: 600 }}>{formatCurrency(profile.financial.oncallRate)}</span></div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment History */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>Payment History</h4>
                                    <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)} className="px-3 py-1.5 text-xs border border-[#E5E7EB] rounded-lg">
                                        <option value="all">All</option><option value="paid">Paid</option><option value="pending">Pending</option>
                                    </select>
                                </div>
                                <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
                                    <table className="w-full">
                                        <thead><tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                                            {['Payment ID', 'Date', 'Facility', 'Description', 'Hours', 'Amount', 'Status'].map(h => (
                                                <th key={h} className="px-3 py-2 text-left text-xs text-[#9CA3AF]" style={{ fontWeight: 500 }}>{h}</th>
                                            ))}
                                        </tr></thead>
                                        <tbody>
                                            {profile.financial.payments
                                                .filter((p: any) => paymentFilter === 'all' || p.status === paymentFilter)
                                                .map((p: any) => (
                                                    <tr key={p.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                                                        <td className="px-3 py-2.5 text-xs text-[#6B7280]">{p.id}</td>
                                                        <td className="px-3 py-2.5 text-xs text-[#6B7280]">{p.date}</td>
                                                        <td className="px-3 py-2.5 text-xs text-[#1F2937]">{p.facility}</td>
                                                        <td className="px-3 py-2.5 text-xs text-[#6B7280]">{p.description}</td>
                                                        <td className="px-3 py-2.5 text-xs text-[#6B7280]">{p.hours}h</td>
                                                        <td className="px-3 py-2.5 text-xs text-[#10B981]" style={{ fontWeight: 600 }}>{formatCurrency(p.amount)}</td>
                                                        <td className="px-3 py-2.5">{getStatusBadge(p.status)}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* === PERFORMANCE TAB === */}
                    {activeTab === 'performance' && (
                        <div className="space-y-6">
                            {/* Rating Summary */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-[#FEF3C7] rounded-lg p-4 border border-[#FDE68A] text-center">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <Star className="w-5 h-5 text-[#F59E0B] fill-[#F59E0B]" />
                                        <span className="text-2xl text-[#92400E]" style={{ fontWeight: 700 }}>{profile.performance.avgRating}</span>
                                    </div>
                                    <p className="text-xs text-[#92400E]">Average Rating</p>
                                </div>
                                <div className="bg-[#F9FAFB] rounded-lg p-4 border border-[#E5E7EB] text-center">
                                    <p className="text-2xl text-[#1F2937]" style={{ fontWeight: 700 }}>{profile.performance.totalReviews}</p>
                                    <p className="text-xs text-[#6B7280]">Total Reviews</p>
                                </div>
                                <div className="bg-[#F0FDF4] rounded-lg p-4 border border-[#A7F3D0] text-center">
                                    <p className="text-2xl text-[#065F46]" style={{ fontWeight: 700 }}>{profile.performance.recommendRate}%</p>
                                    <p className="text-xs text-[#065F46]">Would Recommend</p>
                                </div>
                            </div>

                            {/* Rating Distribution */}
                            <div>
                                <h4 className="text-sm text-[#1F2937] mb-3" style={{ fontWeight: 600 }}>Rating Distribution</h4>
                                <div className="space-y-2">
                                    {[5, 4, 3, 2, 1].map(star => {
                                        const count = profile.performance.ratings[star] || 0;
                                        const total = profile.performance.totalReviews;
                                        const pct = total > 0 ? (count / total) * 100 : 0;
                                        return (
                                            <div key={star} className="flex items-center gap-3">
                                                <div className="flex items-center gap-1 w-16">
                                                    <span className="text-xs text-[#6B7280]">{star}</span>
                                                    <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
                                                </div>
                                                <div className="flex-1 h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: `${pct}%` }} />
                                                </div>
                                                <span className="text-xs text-[#6B7280] w-8 text-right">{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Recent Feedback */}
                            <div>
                                <h4 className="text-sm text-[#1F2937] mb-3" style={{ fontWeight: 600 }}>Recent Feedback</h4>
                                <div className="space-y-3">
                                    {profile.performance.recentFeedback.map((fb: any, i: number) => (
                                        <div key={i} className="p-4 border border-[#E5E7EB] rounded-lg">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <p className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>{fb.facility}</p>
                                                    <p className="text-xs text-[#9CA3AF]">Reviewed by {fb.reviewer} | {fb.date}</p>
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

                            {/* Incidents */}
                            {profile.performance.incidents.length === 0 ? (
                                <div className="p-4 bg-[#F0FDF4] rounded-lg border border-[#A7F3D0] text-center">
                                    <CheckCircle className="w-6 h-6 text-[#10B981] mx-auto mb-1" />
                                    <p className="text-sm text-[#065F46]" style={{ fontWeight: 500 }}>No incidents reported</p>
                                    <p className="text-xs text-[#6B7280]">Clean record with no reported issues</p>
                                </div>
                            ) : null}
                        </div>
                    )}

                    {/* === NOTES & ACTIVITY TAB === */}
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

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
                    <form onSubmit={handleSaveProfile} className="bg-white rounded-xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between flex-shrink-0">
                            <div>
                                <h3 className="text-lg text-[#1F2937]" style={{ fontWeight: 600 }}>Edit Locum Profile</h3>
                                <p className="text-xs text-[#9CA3AF]">Modify contact, registration, and rates for {profile.id}</p>
                            </div>
                            <button type="button" onClick={() => setShowEditModal(false)} className="p-2 hover:bg-[#F3F4F6] rounded-lg">
                                <X className="w-5 h-5 text-[#6B7280]" />
                            </button>
                        </div>

                        {/* Modal Sub-navigation Tabs */}
                        <div className="flex border-b border-[#E5E7EB] bg-[#F9FAFB] px-4 flex-shrink-0">
                            {(['personal', 'professional', 'financial'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setEditModalTab(tab)}
                                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${
                                        editModalTab === tab
                                            ? 'border-[#10B981] text-[#10B981]'
                                            : 'border-transparent text-[#6B7280] hover:text-[#1F2937] hover:border-[#E5E7EB]'
                                    }`}
                                >
                                    {tab} Details
                                </button>
                            ))}
                        </div>
                        
                        <div className="p-6 space-y-5 overflow-y-auto flex-1">
                            {/* PERSONAL DETAILS TAB */}
                            {editModalTab === 'personal' && (
                                <div className="space-y-4">
                                    <h4 className="text-xs font-semibold text-[#374151] uppercase tracking-wider border-b border-[#F3F4F6] pb-1">Core Account Information</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Full Name</label>
                                            <input 
                                                type="text" 
                                                value={editName}
                                                onChange={e => setEditName(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Availability Status</label>
                                            <select 
                                                value={editStatus}
                                                onChange={e => setEditStatus(e.target.value as any)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            >
                                                <option value="available">Available</option>
                                                <option value="booked">Booked</option>
                                                <option value="unavailable">Unavailable</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Date of Birth</label>
                                            <input 
                                                type="date" 
                                                value={editDob}
                                                onChange={e => setEditDob(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Nationality</label>
                                            <input 
                                                type="text" 
                                                value={editNationality}
                                                onChange={e => setEditNationality(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Gender</label>
                                            <select 
                                                value={editGender}
                                                onChange={e => setEditGender(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Female">Female</option>
                                                <option value="Male">Male</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <h4 className="text-xs font-semibold text-[#374151] uppercase tracking-wider border-b border-[#F3F4F6] pb-1 pt-2">Contact & Location</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Mobile Number</label>
                                            <input 
                                                type="text" 
                                                value={editMobile}
                                                onChange={e => setEditMobile(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Landline Phone</label>
                                            <input 
                                                type="text" 
                                                value={editPhone}
                                                onChange={e => setEditPhone(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Email Address</label>
                                            <input 
                                                type="email" 
                                                value={editEmail}
                                                onChange={e => setEditEmail(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Postal Address</label>
                                            <input 
                                                type="text" 
                                                value={editAddress}
                                                onChange={e => setEditAddress(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Eircode / Postcode</label>
                                            <input 
                                                type="text" 
                                                value={editEircode}
                                                onChange={e => setEditEircode(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">PPS Number</label>
                                            <input 
                                                type="text" 
                                                value={editPpsn}
                                                onChange={e => setEditPpsn(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Emergency Contact Name</label>
                                            <input 
                                                type="text" 
                                                value={editEmergencyContact}
                                                onChange={e => setEditEmergencyContact(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Emergency Phone</label>
                                            <input 
                                                type="text" 
                                                value={editEmergencyPhone}
                                                onChange={e => setEditEmergencyPhone(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* PROFESSIONAL DETAILS TAB */}
                            {editModalTab === 'professional' && (
                                <div className="space-y-4">
                                    <h4 className="text-xs font-semibold text-[#374151] uppercase tracking-wider border-b border-[#F3F4F6] pb-1">Specialization & Experience</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Primary Specialty</label>
                                            <input 
                                                type="text" 
                                                value={editSpecialty}
                                                onChange={e => setEditSpecialty(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Sub-Specialty</label>
                                            <input 
                                                type="text" 
                                                value={editSubSpecialty}
                                                onChange={e => setEditSubSpecialty(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Staff Grade</label>
                                            <input 
                                                type="text" 
                                                value={editGrade}
                                                onChange={e => setEditGrade(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Total Experience (Years)</label>
                                            <input 
                                                type="text" 
                                                value={editExperience}
                                                onChange={e => setEditExperience(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                    </div>

                                    <h4 className="text-xs font-semibold text-[#374151] uppercase tracking-wider border-b border-[#F3F4F6] pb-1 pt-2">Work Preferences & Capabilities</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Languages Spoken (comma-separated)</label>
                                            <input 
                                                type="text" 
                                                value={editLanguages}
                                                onChange={e => setEditLanguages(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                                placeholder="e.g. English, Spanish"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">EWTD Max Hours (weekly)</label>
                                            <input 
                                                type="number" 
                                                value={editMaxWeeklyHours}
                                                onChange={e => setEditMaxWeeklyHours(Number(e.target.value))}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs text-[#4B5563] mb-1 font-medium">Preferred Locations (comma-separated)</label>
                                        <input 
                                            type="text" 
                                            value={editPreferredLocations}
                                            onChange={e => setEditPreferredLocations(e.target.value)}
                                            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            placeholder="e.g. Dublin, Galway, Cork"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs text-[#4B5563] mb-2 font-medium">Preferred Shifts</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['Day', 'Night', 'Weekend', 'On-Call'].map(shift => {
                                                const isSelected = editPreferredShifts.includes(shift);
                                                return (
                                                    <button
                                                        key={shift}
                                                        type="button"
                                                        onClick={() => {
                                                            if (isSelected) {
                                                                setEditPreferredShifts(editPreferredShifts.filter(s => s !== shift));
                                                            } else {
                                                                setEditPreferredShifts([...editPreferredShifts, shift]);
                                                            }
                                                        }}
                                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                                            isSelected 
                                                                ? 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]'
                                                                : 'bg-[#F9FAFB] text-[#4B5563] border-[#E5E7EB] hover:bg-[#F3F4F6]'
                                                        }`}
                                                    >
                                                        {shift}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <h4 className="text-xs font-semibold text-[#374151] uppercase tracking-wider border-b border-[#F3F4F6] pb-1 pt-2">Medical Board Registrations</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">IMC Number (Ireland)</label>
                                            <input 
                                                type="text" 
                                                value={editImcNumber}
                                                onChange={e => setEditImcNumber(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">IMC Expiry Date</label>
                                            <input 
                                                type="date" 
                                                value={editImcExpiry}
                                                onChange={e => setEditImcExpiry(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">GMC Number (UK)</label>
                                            <input 
                                                type="text" 
                                                value={editGmcNumber}
                                                onChange={e => setEditGmcNumber(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">GMC Expiry Date</label>
                                            <input 
                                                type="date" 
                                                value={editGmcExpiry}
                                                onChange={e => setEditGmcExpiry(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs text-[#4B5563] mb-1 font-medium">Specialist Register Details</label>
                                        <input 
                                            type="text" 
                                            value={editSpecialistRegister}
                                            onChange={e => setEditSpecialistRegister(e.target.value)}
                                            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* FINANCIAL DETAILS TAB */}
                            {editModalTab === 'financial' && (
                                <div className="space-y-4">
                                    <h4 className="text-xs font-semibold text-[#374151] uppercase tracking-wider border-b border-[#F3F4F6] pb-1">Tax & Payment Setup</h4>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Tax Classification Status</label>
                                            <input 
                                                type="text" 
                                                value={editTaxStatus}
                                                onChange={e => setEditTaxStatus(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                                placeholder="e.g. Self-Employed (Sole Trader)"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-1">
                                        <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl">
                                            <input 
                                                type="checkbox"
                                                id="editRevenueRegistered"
                                                checked={editRevenueRegistered}
                                                onChange={e => setEditRevenueRegistered(e.target.checked)}
                                                className="w-4 h-4 text-[#10B981] focus:ring-[#10B981] border-[#E5E7EB] rounded"
                                            />
                                            <label htmlFor="editRevenueRegistered" className="text-xs text-[#374151] font-semibold cursor-pointer select-none">
                                                Revenue Registered Status
                                            </label>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl">
                                            <input 
                                                type="checkbox"
                                                id="editVatRegistered"
                                                checked={editVatRegistered}
                                                onChange={e => setEditVatRegistered(e.target.checked)}
                                                className="w-4 h-4 text-[#10B981] focus:ring-[#10B981] border-[#E5E7EB] rounded"
                                            />
                                            <label htmlFor="editVatRegistered" className="text-xs text-[#374151] font-semibold cursor-pointer select-none">
                                                VAT Registered Status
                                            </label>
                                        </div>
                                    </div>

                                    <h4 className="text-xs font-semibold text-[#374151] uppercase tracking-wider border-b border-[#F3F4F6] pb-1 pt-2">Default Shift Rates (€)</h4>
                                    <div className="grid grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Standard Day Rate</label>
                                            <input 
                                                type="number" 
                                                value={editStandardDayRate}
                                                onChange={e => setEditStandardDayRate(Number(e.target.value))}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Standard Night Rate</label>
                                            <input 
                                                type="number" 
                                                value={editStandardNightRate}
                                                onChange={e => setEditStandardNightRate(Number(e.target.value))}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Weekend Rate</label>
                                            <input 
                                                type="number" 
                                                value={editWeekendRate}
                                                onChange={e => setEditWeekendRate(Number(e.target.value))}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">On-Call Rate</label>
                                            <input 
                                                type="number" 
                                                value={editOncallRate}
                                                onChange={e => setEditOncallRate(Number(e.target.value))}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                    </div>

                                    <h4 className="text-xs font-semibold text-[#374151] uppercase tracking-wider border-b border-[#F3F4F6] pb-1 pt-2">Bank Routing & Coordinates</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium font-medium font-medium">Bank Name</label>
                                            <input 
                                                type="text" 
                                                value={editBankName}
                                                onChange={e => setEditBankName(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">BIC (SWIFT)</label>
                                            <input 
                                                type="text" 
                                                value={editBic}
                                                onChange={e => setEditBic(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs text-[#4B5563] mb-1 font-medium font-medium">IBAN Number</label>
                                        <input 
                                            type="text" 
                                            value={editIban}
                                            onChange={e => setEditIban(e.target.value)}
                                            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-5 border-t border-[#E5E7EB] flex justify-end gap-2 bg-[#F9FAFB] flex-shrink-0">
                            <button 
                                type="button" 
                                onClick={() => setShowEditModal(false)}
                                className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#4B5563] bg-white hover:bg-[#F3F4F6]"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg text-sm flex items-center gap-1.5"
                                style={{ fontWeight: 500 }}
                            >
                                <CheckCircle className="w-4 h-4" /> Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
