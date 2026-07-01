import { ComplianceRecord } from '../types';

const COMPLIANCE_KEY = 'mployus_compliance_records';

const defaultCompliance: ComplianceRecord[] = [
    {
        id: '#GS234FS',
        locumName: 'Sarah Mitchell',
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
        locumName: 'James Harrison',
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
        locumName: 'Emily Chen',
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
        locumName: 'Michael Brooks',
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
        locumName: 'Rachel Martinez',
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
        locumName: 'David Thompson',
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

export const complianceService = {
    getAllRecords: async (): Promise<ComplianceRecord[]> => {
        await new Promise(resolve => setTimeout(resolve, 50));
        const stored = localStorage.getItem(COMPLIANCE_KEY);
        if (!stored) {
            localStorage.setItem(COMPLIANCE_KEY, JSON.stringify(defaultCompliance));
            return defaultCompliance;
        }
        return JSON.parse(stored);
    },

    saveAll: async (records: ComplianceRecord[]): Promise<void> => {
        localStorage.setItem(COMPLIANCE_KEY, JSON.stringify(records));
    },

    calculateOverallCompliance: (docs: ComplianceRecord['documents']): number => {
        const docTypes = Object.keys(docs) as Array<keyof ComplianceRecord['documents']>;
        const validDocs = docTypes.filter(d => docs[d].status === 'valid').length;
        return Math.round((validDocs / docTypes.length) * 100);
    },

    uploadDocument: async (locumId: string, docType: string, expiryDate: string): Promise<ComplianceRecord> => {
        const records = await complianceService.getAllRecords();
        let updated: ComplianceRecord | null = null;
        
        const mapped = records.map(r => {
            if (r.id === locumId) {
                const docs = { ...r.documents };
                (docs as any)[docType] = {
                    status: 'valid' as const,
                    expiryDate,
                    uploadedDate: new Date().toISOString().split('T')[0]
                };
                const overallCompliance = complianceService.calculateOverallCompliance(docs);
                updated = { ...r, documents: docs, overallCompliance };
                return updated;
            }
            return r;
        });

        await complianceService.saveAll(mapped);
        if (!updated) throw new Error(`Locum compliance record not found: ID ${locumId}`);
        return updated;
    },

    updateExpiryDate: async (locumId: string, docType: string, expiryDate: string): Promise<ComplianceRecord> => {
        const records = await complianceService.getAllRecords();
        let updated: ComplianceRecord | null = null;

        const mapped = records.map(r => {
            if (r.id === locumId) {
                const docs = { ...r.documents };
                const currentDoc = (docs as any)[docType];
                
                // Calculate state based on expiry date
                const today = new Date();
                const expiry = new Date(expiryDate);
                const diffTime = expiry.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                let status: 'valid' | 'expiring' | 'expired' = 'valid';
                if (diffDays <= 0) {
                    status = 'expired';
                } else if (diffDays <= 30) {
                    status = 'expiring';
                }

                (docs as any)[docType] = {
                    ...currentDoc,
                    status,
                    expiryDate
                };

                const overallCompliance = complianceService.calculateOverallCompliance(docs);
                updated = { ...r, documents: docs, overallCompliance };
                return updated;
            }
            return r;
        });

        await complianceService.saveAll(mapped);
        if (!updated) throw new Error(`Locum compliance record not found: ID ${locumId}`);
        return updated;
    },

    verifyDocument: async (locumId: string, docType: string): Promise<ComplianceRecord> => {
        const records = await complianceService.getAllRecords();
        let updated: ComplianceRecord | null = null;

        const mapped = records.map(r => {
            if (r.id === locumId) {
                const docs = { ...r.documents };
                const doc = (docs as any)[docType];
                (docs as any)[docType] = {
                    ...doc,
                    status: 'valid' as const
                };
                const overallCompliance = complianceService.calculateOverallCompliance(docs);
                updated = { ...r, documents: docs, overallCompliance };
                return updated;
            }
            return r;
        });

        await complianceService.saveAll(mapped);
        if (!updated) throw new Error(`Locum compliance record not found: ID ${locumId}`);
        return updated;
    }
};
