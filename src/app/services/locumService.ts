import { Locum, Applicant } from '../types';

const LOCUMS_KEY = 'mployus_locums';
const APPLICANTS_KEY = 'mployus_applicants';

const defaultLocums: Locum[] = [
    { id: '#GS234FS', name: 'Sarah Mitchell', avatar: 'SM', specialty: 'General Surgery', department: 'Surgery', location: 'Dublin, Ireland', phone: '+353 1 234 5678', email: 'sarah.mitchell@email.com', status: 'available', shifts: 145, rating: 4.9, compliance: 100, experience: '12 years', qualifications: ['FRCS', 'MB BCh BAO'], joinDate: '2023-03-15' },
    { id: '#EC0125D', name: 'James Harrison', avatar: 'JH', specialty: 'Cardiology', department: 'Cardiology', location: 'Cork, Ireland', phone: '+353 21 496 0202', email: 'james.harrison@email.com', status: 'booked', shifts: 128, rating: 4.8, compliance: 100, experience: '15 years', qualifications: ['MRCPI', 'MD'], joinDate: '2023-01-10' },
    { id: '#MK4521A', name: 'Emily Chen', avatar: 'EC', specialty: 'Anesthesiology', department: 'Surgery', location: 'Galway, Ireland', phone: '+353 91 496 0000', email: 'emily.chen@email.com', status: 'available', shifts: 162, rating: 4.9, compliance: 75, experience: '10 years', qualifications: ['FCAI', 'MB BCh BAO'], joinDate: '2022-11-01' },
    { id: '#LW9872P', name: 'Michael Brooks', avatar: 'MB', specialty: 'Emergency Medicine', department: 'Emergency (A&E)', location: 'Limerick, Ireland', phone: '+353 61 496 0123', email: 'michael.brooks@email.com', status: 'unavailable', shifts: 98, rating: 4.5, compliance: 88, experience: '8 years', qualifications: ['MCEM', 'MB BCh BAO'], joinDate: '2023-06-20' },
    { id: '#PM6543K', name: 'Rachel Martinez', avatar: 'RM', specialty: 'Pediatrics', department: 'Pediatrics', location: 'Dublin, Ireland', phone: '+353 1 234 0741', email: 'rachel.martinez@email.com', status: 'available', shifts: 134, rating: 4.7, compliance: 92, experience: '9 years', qualifications: ['MRCPCH', 'DCH'], joinDate: '2023-04-05' },
    { id: '#RT8765N', name: 'David Thompson', avatar: 'DT', specialty: 'Orthopedics', department: 'Surgery', location: 'Waterford, Ireland', phone: '+353 51 496 0456', email: 'david.thompson@email.com', status: 'available', shifts: 86, rating: 4.4, compliance: 25, experience: '14 years', qualifications: ['FRCS (Orth)', 'MCh'], joinDate: '2023-09-01' },
    { id: '#KL3214B', name: 'Aoife Murphy', avatar: 'AM', specialty: 'Dermatology', department: 'Outpatients', location: 'Dublin, Ireland', phone: '+353 1 234 8901', email: 'aoife.murphy@email.com', status: 'available', shifts: 67, rating: 4.6, compliance: 100, experience: '7 years', qualifications: ['MRCPI', 'Dip Derm'], joinDate: '2024-01-15' },
    { id: '#NP7890C', name: 'Ciaran Kelly', avatar: 'CK', specialty: 'General Practice', department: 'Internal Medicine', location: 'Kilkenny, Ireland', phone: '+353 56 772 1234', email: 'ciaran.kelly@email.com', status: 'booked', shifts: 112, rating: 4.8, compliance: 100, experience: '11 years', qualifications: ['MICGP', 'MB BCh BAO'], joinDate: '2023-05-10' },
];

const defaultApplicants: Applicant[] = [
    { id: 'APP-001', name: 'Fiona Byrne', specialty: 'Psychiatry', location: 'Dublin', status: 'interview', appliedDate: '2026-02-05', stage: 'Interview Scheduled' },
    { id: 'APP-002', name: 'Liam O\'Connor', specialty: 'Radiology', location: 'Cork', status: 'verification', appliedDate: '2026-02-03', stage: 'Credential Verification' },
    { id: 'APP-003', name: 'Sinead Walsh', specialty: 'Oncology', location: 'Galway', status: 'onboarding', appliedDate: '2026-01-28', stage: 'Onboarding Checklist' },
    { id: 'APP-004', name: 'Ronan Daly', specialty: 'General Surgery', location: 'Limerick', status: 'new', appliedDate: '2026-02-09', stage: 'New Application' },
    { id: 'APP-005', name: 'Niamh Brennan', specialty: 'Anesthesiology', location: 'Dublin', status: 'new', appliedDate: '2026-02-08', stage: 'New Application' },
];

export const locumService = {
    // ================= LOCUMS API =================
    getAllLocums: async (): Promise<Locum[]> => {
        await new Promise(resolve => setTimeout(resolve, 50));
        const stored = localStorage.getItem(LOCUMS_KEY);
        let locumsList: Locum[];
        if (!stored) {
            locumsList = defaultLocums;
            localStorage.setItem(LOCUMS_KEY, JSON.stringify(defaultLocums));
        } else {
            locumsList = JSON.parse(stored);
        }
        // Migrating existing localstorage records to strip out "Dr. "
        let modified = false;
        const migrated = locumsList.map(l => {
            if (l.name.startsWith('Dr. ')) {
                modified = true;
                return { ...l, name: l.name.substring(4) };
            }
            return l;
        });
        if (modified) {
            localStorage.setItem(LOCUMS_KEY, JSON.stringify(migrated));
            return migrated;
        }
        return locumsList;
    },

    saveAllLocums: async (locums: Locum[]): Promise<void> => {
        localStorage.setItem(LOCUMS_KEY, JSON.stringify(locums));
    },

    createLocum: async (locum: Locum): Promise<Locum> => {
        const stored = localStorage.getItem(LOCUMS_KEY);
        const locums: Locum[] = stored ? JSON.parse(stored) : defaultLocums;
        
        locums.push(locum);
        localStorage.setItem(LOCUMS_KEY, JSON.stringify(locums));
        return locum;
    },

    updateLocum: async (locum: Locum): Promise<Locum> => {
        const stored = localStorage.getItem(LOCUMS_KEY);
        const locums: Locum[] = stored ? JSON.parse(stored) : defaultLocums;
        
        const updated = locums.map(l => l.id === locum.id ? locum : l);
        localStorage.setItem(LOCUMS_KEY, JSON.stringify(updated));
        return locum;
    },

    archiveLocum: async (id: string): Promise<boolean> => {
        const stored = localStorage.getItem(LOCUMS_KEY);
        const locums: Locum[] = stored ? JSON.parse(stored) : defaultLocums;
        
        const filtered = locums.filter(l => l.id !== id);
        localStorage.setItem(LOCUMS_KEY, JSON.stringify(filtered));
        return true;
    },

    getAllApplicants: async (): Promise<Applicant[]> => {
        await new Promise(resolve => setTimeout(resolve, 50));
        const stored = localStorage.getItem(APPLICANTS_KEY);
        let applicantsList: Applicant[];
        if (!stored) {
            applicantsList = defaultApplicants;
            localStorage.setItem(APPLICANTS_KEY, JSON.stringify(defaultApplicants));
        } else {
            applicantsList = JSON.parse(stored);
        }
        // Migrating existing localstorage records to strip out "Dr. "
        let modified = false;
        const migrated = applicantsList.map(a => {
            if (a.name.startsWith('Dr. ')) {
                modified = true;
                return { ...a, name: a.name.substring(4) };
            }
            return a;
        });
        if (modified) {
            localStorage.setItem(APPLICANTS_KEY, JSON.stringify(migrated));
            return migrated;
        }
        return applicantsList;
    },

    saveAllApplicants: async (applicants: Applicant[]): Promise<void> => {
        localStorage.setItem(APPLICANTS_KEY, JSON.stringify(applicants));
    },

    createApplicant: async (applicant: Applicant): Promise<Applicant> => {
        const stored = localStorage.getItem(APPLICANTS_KEY);
        const applicants: Applicant[] = stored ? JSON.parse(stored) : defaultApplicants;
        
        applicants.push(applicant);
        localStorage.setItem(APPLICANTS_KEY, JSON.stringify(applicants));
        return applicant;
    },

    updateApplicantStage: async (id: string, stage: string, status: Applicant['status']): Promise<Applicant> => {
        const stored = localStorage.getItem(APPLICANTS_KEY);
        const applicants: Applicant[] = stored ? JSON.parse(stored) : defaultApplicants;
        
        let updatedApplicant: Applicant | null = null;
        const updated = applicants.map(a => {
            if (a.id === id) {
                updatedApplicant = { ...a, stage, status };
                return updatedApplicant;
            }
            return a;
        });
        
        localStorage.setItem(APPLICANTS_KEY, JSON.stringify(updated));
        if (!updatedApplicant) throw new Error(`Applicant with ID ${id} not found`);
        return updatedApplicant;
    },

    hireApplicant: async (id: string): Promise<Locum> => {
        const storedApplicants = localStorage.getItem(APPLICANTS_KEY);
        const applicants: Applicant[] = storedApplicants ? JSON.parse(storedApplicants) : defaultApplicants;
        
        const applicant = applicants.find(a => a.id === id);
        if (!applicant) throw new Error(`Applicant with ID ${id} not found`);

        // Create new Locum profile based on Applicant
        const newLocum: Locum = {
            id: `#${applicant.id.replace('APP-', 'LC')}`,
            name: applicant.name,
            avatar: applicant.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
            specialty: applicant.specialty,
            department: applicant.department || (applicant.specialty.includes('Surgery') ? 'Surgery' : 'Internal Medicine'),
            location: applicant.location + ', Ireland',
            phone: applicant.phone || '+353 1 555 0199',
            email: applicant.email || `${applicant.name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
            status: 'available',
            shifts: 0,
            rating: 5.0,
            compliance: 100,
            experience: '5 years',
            qualifications: ['MB BCh BAO', 'MRCPI'],
            joinDate: new Date().toISOString().split('T')[0]
        };

        // Add to Locums
        const storedLocums = localStorage.getItem(LOCUMS_KEY);
        const locums: Locum[] = storedLocums ? JSON.parse(storedLocums) : defaultLocums;
        locums.push(newLocum);
        localStorage.setItem(LOCUMS_KEY, JSON.stringify(locums));

        // Delete from Applicants
        const filteredApplicants = applicants.filter(a => a.id !== id);
        localStorage.setItem(APPLICANTS_KEY, JSON.stringify(filteredApplicants));

        return newLocum;
    }
};
