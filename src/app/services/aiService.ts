import { MatchSuggestion, ComplianceReminder, AutomationRule, SchedulingResult, AIStats } from '../types';

const WEIGHTS_KEY = 'mployus_ai_weights';
const MATCHES_KEY = 'mployus_ai_matches';
const RULES_KEY = 'mployus_ai_rules';
const COMPLIANCE_KEY = 'mployus_ai_compliance_reminders';
const STATS_KEY = 'mployus_ai_stats';
const SCHEDULING_KEY = 'mployus_ai_scheduling_results';
const AUTOPILOT_KEY = 'mployus_ai_autopilot';

const defaultWeights = {
    specialty: 95,
    distance: 80,
    performance: 90,
    pricing: 70,
    compliance: 95
};

const defaultStats: AIStats = {
    aiMatches: 34,
    autoScheduled: 17,
    complianceReminders: 12,
    timeSaved: 48
};

const defaultMatches: MatchSuggestion[] = [
    { id: 1, shift: 'Emergency Medicine Night Shift', facilityIndex: 2, date: '10 Feb 20:00-08:00', locum: 'Rachel Martinez', specialty: 'Emergency', baseSpecialty: 98, baseDistance: 95, basePerf: 94, baseCompliance: 90, reasons: ['Specialty match', 'Available', '15 min from facility', '4.7 rating'], status: 'pending' },
    { id: 2, shift: 'Anesthesiology Day Shift', facilityIndex: 3, date: '11 Feb 07:00-19:00', locum: 'Emily Chen', specialty: 'Surgery', baseSpecialty: 95, baseDistance: 80, basePerf: 92, baseCompliance: 100, reasons: ['Specialty match', 'Preferred locum', 'All compliance docs valid'], status: 'pending' },
    { id: 3, shift: 'Pediatrics Day Shift', facilityIndex: 4, date: '11 Feb 08:00-20:00', locum: 'Rachel Martinez', specialty: 'Pediatrics', baseSpecialty: 90, baseDistance: 85, basePerf: 94, baseCompliance: 85, reasons: ['Specialty match', 'Available', 'Client preference', '96.3% completion'], status: 'pending' },
    { id: 4, shift: 'General Surgery Day Shift', facilityIndex: 6, date: '13 Feb 08:00-16:00', locum: 'Sarah Mitchell', specialty: 'Surgery', baseSpecialty: 100, baseDistance: 90, basePerf: 99, baseCompliance: 95, reasons: ['Perfect specialty match', 'Top performer', '99.3% completion rate', 'Client favorite'], status: 'pending' },
];

const defaultComplianceReminders: ComplianceReminder[] = [
    { id: 1, locum: 'David Thompson', document: 'Medical License', daysUntilExpiry: 3, action: 'Renewal reminder sent', autoSent: true, status: 'sent' },
    { id: 2, locum: 'Rachel Martinez', document: 'CPR Training', daysUntilExpiry: 18, action: 'Scheduled for 25 Feb', autoSent: false, status: 'pending' },
    { id: 3, locum: 'James Harrison', document: 'Garda Vetting', daysUntilExpiry: 45, action: 'Auto-reminder queued for Day 30', autoSent: false, status: 'pending' },
    { id: 4, locum: 'Sarah Mitchell', document: 'Indemnity Insurance', daysUntilExpiry: 60, action: 'No action needed yet', autoSent: false, status: 'pending' },
];

const defaultRules: AutomationRule[] = [
    { id: 1, document: 'Medical License Registration', trigger: '30 days before expiry', action: 'Send Email & Portal Alert', active: true },
    { id: 2, document: 'Background Screening / Garda Vetting', trigger: '60 days before expiry', action: 'Send Portal Warning & Alert Admin', active: true },
    { id: 3, document: 'Professional Indemnity Insurance', trigger: '45 days before expiry', action: 'Request Update via Email', active: false },
];

const defaultSchedulingResults: SchedulingResult[] = [
    { id: 1, facilityIndex: 0, shifts: 8, filled: 7, auto: 5, manual: 2, unfilled: 1 },
    { id: 2, facilityIndex: 1, shifts: 6, filled: 5, auto: 4, manual: 1, unfilled: 1 },
    { id: 3, facilityIndex: 2, shifts: 5, filled: 4, auto: 3, manual: 1, unfilled: 1 },
    { id: 4, facilityIndex: 4, shifts: 4, filled: 4, auto: 3, manual: 1, unfilled: 0 },
    { id: 5, facilityIndex: 3, shifts: 3, filled: 3, auto: 2, manual: 1, unfilled: 0 },
];

export const aiService = {
    // ================= AUTOPILOT API =================
    getAutopilotState: async (): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 50));
        const stored = localStorage.getItem(AUTOPILOT_KEY);
        return stored !== 'false';
    },

    saveAutopilotState: async (active: boolean): Promise<void> => {
        localStorage.setItem(AUTOPILOT_KEY, String(active));
    },

    // ================= STATS API =================
    getStats: async (): Promise<AIStats> => {
        await new Promise(resolve => setTimeout(resolve, 50));
        const stored = localStorage.getItem(STATS_KEY);
        if (!stored) {
            localStorage.setItem(STATS_KEY, JSON.stringify(defaultStats));
            return defaultStats;
        }
        return JSON.parse(stored);
    },

    updateStats: async (stats: AIStats): Promise<AIStats> => {
        localStorage.setItem(STATS_KEY, JSON.stringify(stats));
        return stats;
    },

    // ================= WEIGHTS API =================
    getWeights: async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
        const stored = localStorage.getItem(WEIGHTS_KEY);
        if (!stored) {
            localStorage.setItem(WEIGHTS_KEY, JSON.stringify(defaultWeights));
            return defaultWeights;
        }
        return JSON.parse(stored);
    },

    saveWeights: async (weights: typeof defaultWeights) => {
        localStorage.setItem(WEIGHTS_KEY, JSON.stringify(weights));
        return weights;
    },

    // ================= SMART MATCHES API =================
    getMatches: async (): Promise<MatchSuggestion[]> => {
        await new Promise(resolve => setTimeout(resolve, 80));
        const stored = localStorage.getItem(MATCHES_KEY);
        if (!stored) {
            localStorage.setItem(MATCHES_KEY, JSON.stringify(defaultMatches));
            return defaultMatches;
        }
        return JSON.parse(stored);
    },

    acceptMatch: async (id: number): Promise<MatchSuggestion> => {
        const matches = await aiService.getMatches();
        const updated = matches.map(m => m.id === id ? { ...m, status: 'accepted' as const } : m);
        localStorage.setItem(MATCHES_KEY, JSON.stringify(updated));
        
        // Increment statistics
        const stats = await aiService.getStats();
        stats.aiMatches += 1;
        stats.timeSaved += 2;
        await aiService.updateStats(stats);

        const match = updated.find(m => m.id === id);
        if (!match) throw new Error(`Match suggestions not found: id ${id}`);
        return match;
    },

    skipMatch: async (id: number, reason: string): Promise<MatchSuggestion> => {
        const matches = await aiService.getMatches();
        const updated = matches.map(m => m.id === id ? { ...m, status: 'skipped' as const, skipReason: reason } : m);
        localStorage.setItem(MATCHES_KEY, JSON.stringify(updated));

        const match = updated.find(m => m.id === id);
        if (!match) throw new Error(`Match suggestions not found: id ${id}`);
        return match;
    },

    refreshMatches: async (): Promise<MatchSuggestion[]> => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Recalculates match options with randomized adjustments
        const matches = defaultMatches.map(m => ({
            ...m,
            baseDistance: Math.min(100, Math.max(60, m.baseDistance + Math.floor(Math.random() * 11) - 5)),
            basePerf: Math.min(100, Math.max(80, m.basePerf + Math.floor(Math.random() * 7) - 3)),
            status: 'pending' as const
        }));
        localStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
        return matches;
    },

    // ================= DEMAND FORECASTING API =================
    launchStaffingCampaign: async (insightId: number, incentive: number): Promise<boolean> => {
        // Simulates REST endpoint POST request latency
        await new Promise(resolve => setTimeout(resolve, 1800));
        return true;
    },

    // ================= AUTOMATION RULES API =================
    getRules: async (): Promise<AutomationRule[]> => {
        await new Promise(resolve => setTimeout(resolve, 50));
        const stored = localStorage.getItem(RULES_KEY);
        if (!stored) {
            localStorage.setItem(RULES_KEY, JSON.stringify(defaultRules));
            return defaultRules;
        }
        return JSON.parse(stored);
    },

    toggleRule: async (id: number): Promise<AutomationRule> => {
        const rules = await aiService.getRules();
        let updatedRule: AutomationRule | null = null;
        const updated = rules.map(r => {
            if (r.id === id) {
                updatedRule = { ...r, active: !r.active };
                return updatedRule;
            }
            return r;
        });
        localStorage.setItem(RULES_KEY, JSON.stringify(updated));
        if (!updatedRule) throw new Error(`Automation rule not found: id ${id}`);
        return updatedRule;
    },

    createRule: async (rule: Omit<AutomationRule, 'id' | 'active'>): Promise<AutomationRule> => {
        const rules = await aiService.getRules();
        const newRule: AutomationRule = {
            id: rules.length + 1,
            document: rule.document,
            trigger: rule.trigger,
            action: rule.action,
            active: true
        };
        rules.push(newRule);
        localStorage.setItem(RULES_KEY, JSON.stringify(rules));
        return newRule;
    },

    // ================= COMPLIANCE REMINDERS API =================
    getComplianceReminders: async (): Promise<ComplianceReminder[]> => {
        await new Promise(resolve => setTimeout(resolve, 60));
        const stored = localStorage.getItem(COMPLIANCE_KEY);
        if (!stored) {
            localStorage.setItem(COMPLIANCE_KEY, JSON.stringify(defaultComplianceReminders));
            return defaultComplianceReminders;
        }
        return JSON.parse(stored);
    },

    sendUrgentReminder: async (id: number): Promise<ComplianceReminder> => {
        const reminders = await aiService.getComplianceReminders();
        let updated: ComplianceReminder | null = null;
        const mapped = reminders.map(r => {
            if (r.id === id) {
                updated = { ...r, status: 'sent' as const, action: 'Urgent reminder sent manually', autoSent: true };
                return updated;
            }
            return r;
        });
        localStorage.setItem(COMPLIANCE_KEY, JSON.stringify(mapped));
        
        // Increment compliance reminders sent MTD
        const stats = await aiService.getStats();
        stats.complianceReminders += 1;
        await aiService.updateStats(stats);

        if (!updated) throw new Error(`Compliance record not found: id ${id}`);
        return updated;
    },

    verifyDocument: async (id: number): Promise<ComplianceReminder> => {
        const reminders = await aiService.getComplianceReminders();
        let updated: ComplianceReminder | null = null;
        const mapped = reminders.map(r => {
            if (r.id === id) {
                updated = { ...r, status: 'verified' as const, action: 'Verified by Coordinator' };
                return updated;
            }
            return r;
        });
        localStorage.setItem(COMPLIANCE_KEY, JSON.stringify(mapped));
        if (!updated) throw new Error(`Compliance record not found: id ${id}`);
        return updated;
    },

    // ================= AUTO SCHEDULER API =================
    getSchedulingResults: async (): Promise<SchedulingResult[]> => {
        await new Promise(resolve => setTimeout(resolve, 50));
        const stored = localStorage.getItem(SCHEDULING_KEY);
        if (!stored) {
            localStorage.setItem(SCHEDULING_KEY, JSON.stringify(defaultSchedulingResults));
            return defaultSchedulingResults;
        }
        return JSON.parse(stored);
    },

    executeAutoScheduleRun: async (): Promise<{ results: SchedulingResult[], newStats: AIStats }> => {
        // Simulates heavy machine-learning calculations / async job execution on backend
        await new Promise(resolve => setTimeout(resolve, 4500));
        
        const currentStats = await aiService.getStats();
        const nextStats: AIStats = {
            aiMatches: currentStats.aiMatches,
            autoScheduled: currentStats.autoScheduled + 6,
            complianceReminders: currentStats.complianceReminders,
            timeSaved: currentStats.timeSaved + 8
        };
        await aiService.updateStats(nextStats);

        const currentResults = await aiService.getSchedulingResults();
        const nextResults = currentResults.map(item => ({
            ...item,
            filled: item.shifts,
            auto: item.shifts - item.manual,
            unfilled: 0,
            wasAutoFilled: item.unfilled > 0
        }));
        localStorage.setItem(SCHEDULING_KEY, JSON.stringify(nextResults));

        return {
            results: nextResults,
            newStats: nextStats
        };
    }
};
