import { Client } from '../types';

const STORAGE_KEY = 'mployus_clients';

const defaultClients: Client[] = [
    { id: 'CL-001', name: "St. James's Hospital", type: 'hospital', location: 'Dublin', address: "James's Street, Dublin 8", contactPerson: 'Siobhan O\'Reilly', contactEmail: 'siobhan@stjames.ie', contactPhone: '+353 1 410 3000', activeShifts: 12, totalBookings: 342, avgRating: 4.8, status: 'active', monthlySpend: 48500, preferredLocums: 15, complianceReqs: ['Medical License', 'Garda Vetting', 'Indemnity Insurance'] },
    { id: 'CL-002', name: 'Cork University Hospital', type: 'hospital', location: 'Cork', address: 'Wilton, Cork', contactPerson: 'Patrick Murphy', contactEmail: 'pmurphy@cuh.ie', contactPhone: '+353 21 492 2000', activeShifts: 8, totalBookings: 256, avgRating: 4.6, status: 'active', monthlySpend: 35200, preferredLocums: 10, complianceReqs: ['Medical License', 'Garda Vetting', 'CPR Training'] },
    { id: 'CL-003', name: 'Galway Clinic', type: 'clinic', location: 'Galway', address: 'Doughiska, Galway', contactPerson: 'Aoife Brennan', contactEmail: 'abrennan@galwayclinic.ie', contactPhone: '+353 91 785 000', activeShifts: 4, totalBookings: 128, avgRating: 4.9, status: 'active', monthlySpend: 18900, preferredLocums: 6, complianceReqs: ['Medical License', 'Indemnity Insurance'] },
    { id: 'CL-004', name: 'Leopardstown Park Care Home', type: 'care_home', location: 'Dublin', address: 'Leopardstown, Dublin 18', contactPerson: 'Niamh Walsh', contactEmail: 'nwalsh@lpch.ie', contactPhone: '+353 1 295 5055', activeShifts: 3, totalBookings: 89, avgRating: 4.5, status: 'active', monthlySpend: 12400, preferredLocums: 4, complianceReqs: ['Medical License', 'Garda Vetting', 'CPR Training', 'Manual Handling'] },
    { id: 'CL-005', name: 'Beacon Medical Group', type: 'private_practice', location: 'Dublin', address: 'Sandyford, Dublin 18', contactPerson: 'Dr. Ciaran Kelly', contactEmail: 'ckelly@beaconmed.ie', contactPhone: '+353 1 293 6600', activeShifts: 2, totalBookings: 67, avgRating: 4.7, status: 'active', monthlySpend: 9800, preferredLocums: 3, complianceReqs: ['Medical License', 'Indemnity Insurance'] },
    { id: 'CL-006', name: 'Limerick Regional Hospital', type: 'hospital', location: 'Limerick', address: 'Dooradoyle, Limerick', contactPerson: 'Aisling Daly', contactEmail: 'adaly@ulh.ie', contactPhone: '+353 61 301 111', activeShifts: 0, totalBookings: 45, avgRating: 4.3, status: 'inactive', monthlySpend: 0, preferredLocums: 5, complianceReqs: ['Medical License', 'Garda Vetting', 'Indemnity Insurance', 'CPR Training'] },
];

export const clientService = {
    /**
     * Retrieves all client facilities from localStorage or populates with defaults.
     */
    getAll: async (): Promise<Client[]> => {
        // Simulating backend call delay
        await new Promise(resolve => setTimeout(resolve, 50));
        
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultClients));
            return defaultClients;
        }
        return JSON.parse(stored);
    },

    /**
     * Saves a full clients list to localStorage.
     */
    saveAll: async (clients: Client[]): Promise<void> => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
    },

    /**
     * Simulates backend HTTP POST to create a new client.
     */
    create: async (client: Client): Promise<Client> => {
        const stored = localStorage.getItem(STORAGE_KEY);
        const clients: Client[] = stored ? JSON.parse(stored) : defaultClients;
        
        clients.push(client);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
        return client;
    },

    /**
     * Simulates backend HTTP PUT to update an existing client's details.
     */
    update: async (client: Client): Promise<Client> => {
        const stored = localStorage.getItem(STORAGE_KEY);
        const clients: Client[] = stored ? JSON.parse(stored) : defaultClients;
        
        const updated = clients.map(c => c.id === client.id ? client : c);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return client;
    },

    /**
     * Simulates backend HTTP DELETE or PATCH status archive.
     */
    archive: async (id: string): Promise<boolean> => {
        const stored = localStorage.getItem(STORAGE_KEY);
        const clients: Client[] = stored ? JSON.parse(stored) : defaultClients;
        
        const filtered = clients.filter(c => c.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        return true;
    }
};
