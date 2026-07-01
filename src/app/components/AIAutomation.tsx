import { useState, useEffect } from 'react';
import {
    Sparkles, Brain, Calendar, Users, TrendingUp, Zap,
    CheckCircle, Clock, Shield, X, MapPin, Sliders, ChevronDown, Check, Plus, Play,
    ShieldAlert, Send, ToggleLeft, ToggleRight, ArrowRight, RefreshCw, Info
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer
} from 'recharts';
import { useSystemSettings } from '../contexts/SystemSettingsContext';
import { toast } from 'sonner';
import { MatchSuggestion, ComplianceReminder, AutomationRule, SchedulingResult, AIStats } from '../types';
import { aiService } from '../services/aiService';

export function AIAutomation() {
    const { t, getHospitals } = useSystemSettings();
    const hospitals = getHospitals();

    // Loading states for integration feedback
    const [isLoadingData, setIsLoadingData] = useState(true);

    // 1. Core Config & Auto-Pilot States
    const [autopilot, setAutopilot] = useState<boolean>(true);
    
    // 2. Statistics (reactive to accept/skip and simulations)
    const [stats, setStats] = useState<AIStats>({
        aiMatches: 34,
        autoScheduled: 17,
        complianceReminders: 12,
        timeSaved: 48
    });

    // 3. Smart Matching Weights
    const [weights, setWeights] = useState({
        specialty: 95,
        distance: 80,
        performance: 90,
        pricing: 70,
        compliance: 95
    });
    const [showWeightsConfig, setShowWeightsConfig] = useState(false);

    // Smart Match states
    const [matches, setMatches] = useState<MatchSuggestion[]>([]);
    const [skippingMatchId, setSkippingMatchId] = useState<number | null>(null);
    const [isRefreshingMatches, setIsRefreshingMatches] = useState(false);

    // 4. Demand Forecasting States
    const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
    const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
    const [selectedTimeframe, setSelectedTimeframe] = useState<number>(6); // weeks count
    const [activeCampaignInsight, setActiveCampaignInsight] = useState<any | null>(null);
    const [isLaunchingCampaign, setIsLaunchingCampaign] = useState(false);
    const [campaignIncentive, setCampaignIncentive] = useState(10); // +10% premium

    // 5. Auto Compliance States
    const [complianceList, setComplianceList] = useState<ComplianceReminder[]>([]);
    const [rules, setRules] = useState<AutomationRule[]>([]);
    const [showAddRuleModal, setShowAddRuleModal] = useState(false);
    const [newRule, setNewRule] = useState({
        document: 'CPR Certification',
        trigger: '30 days before expiry',
        action: 'Send SMS & Email Reminder'
    });

    // 6. Auto-Scheduling Simulation States
    const [isSimulatingSchedule, setIsSimulatingSchedule] = useState(false);
    const [simStep, setSimStep] = useState(0);
    const [autoScheduleStats, setAutoScheduleStats] = useState({
        totalShifts: 26,
        filled: 17,
        auto: 12,
        manual: 5,
        unfilled: 9
    });
    const [scheduleResults, setScheduleResults] = useState<SchedulingResult[]>([]);
    const [pendingScheduleResult, setPendingScheduleResult] = useState<{ results: SchedulingResult[], newStats: AIStats } | null>(null);

    // Load all data from API service on mount
    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoadingData(true);
            try {
                const [
                    autopilotVal,
                    statsVal,
                    weightsVal,
                    matchesVal,
                    rulesVal,
                    complianceVal,
                    schedulingVal
                ] = await Promise.all([
                    aiService.getAutopilotState(),
                    aiService.getStats(),
                    aiService.getWeights(),
                    aiService.getMatches(),
                    aiService.getRules(),
                    aiService.getComplianceReminders(),
                    aiService.getSchedulingResults()
                ]);

                setAutopilot(autopilotVal);
                setStats(statsVal);
                setWeights(weightsVal);
                setMatches(matchesVal);
                setRules(rulesVal);
                setComplianceList(complianceVal);
                setScheduleResults(schedulingVal);

                // Initialize scheduling aggregate statistics based on results
                const initialAuto = schedulingVal.reduce((acc, curr) => acc + curr.auto, 0);
                const initialManual = schedulingVal.reduce((acc, curr) => acc + curr.manual, 0);
                const initialUnfilled = schedulingVal.reduce((acc, curr) => acc + curr.unfilled, 0);
                const initialFilled = schedulingVal.reduce((acc, curr) => acc + curr.filled, 0);
                const totalShifts = schedulingVal.reduce((acc, curr) => acc + curr.shifts, 0);

                setAutoScheduleStats({
                    totalShifts,
                    filled: initialFilled,
                    auto: initialAuto,
                    manual: initialManual,
                    unfilled: initialUnfilled
                });

            } catch (error) {
                console.error("Failed to load AI automation data", error);
                toast.error("Error connecting to AI automation service.");
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchInitialData();
    }, []);

    // Dynamic Match Score Calculator based on weights
    const getMatchScore = (item: MatchSuggestion) => {
        const totalWeight = weights.specialty + weights.distance + weights.performance + weights.pricing + weights.compliance;
        if (totalWeight === 0) return 0;
        
        const weightedSum = 
            (item.baseSpecialty * weights.specialty) +
            (item.baseDistance * weights.distance) +
            (item.basePerf * weights.performance) +
            (92 * weights.pricing) + // baseline pricing score
            (item.baseCompliance * weights.compliance);
            
        return Math.round(weightedSum / totalWeight);
    };

    // Preset Weights Configurations
    const applyWeightsPreset = async (preset: 'quality' | 'budget' | 'balanced') => {
        let newWeights = { ...weights };
        if (preset === 'quality') {
            newWeights = { specialty: 100, distance: 50, performance: 100, pricing: 40, compliance: 100 };
        } else if (preset === 'budget') {
            newWeights = { specialty: 85, distance: 75, performance: 70, pricing: 100, compliance: 90 };
        } else {
            newWeights = { specialty: 95, distance: 80, performance: 90, pricing: 70, compliance: 95 };
        }

        setWeights(newWeights);
        try {
            await aiService.saveWeights(newWeights);
            toast.success(`Weights updated: Focus on ${preset === 'quality' ? 'Quality' : preset === 'budget' ? 'Budget' : 'Balanced'}`);
        } catch (error) {
            toast.error("Failed to save matching weights");
        }
    };

    // Handle single slider change (optional save on drag could be added, let's update local weights)
    const handleWeightChange = (key: keyof typeof weights, value: number) => {
        const updated = { ...weights, [key]: value };
        setWeights(updated);
        // Save dynamically to simulate immediate persistence
        aiService.saveWeights(updated).catch(e => console.error(e));
    };

    // Accept / Skip logic consuming service endpoints
    const handleAcceptMatch = async (id: number, locumName: string, shiftName: string) => {
        try {
            const updatedMatch = await aiService.acceptMatch(id);
            setMatches(prev => prev.map(m => m.id === id ? updatedMatch : m));
            
            // Reload stats from service since acceptMatch modifies stats on back-end/service layer
            const updatedStats = await aiService.getStats();
            setStats(updatedStats);

            toast.success(`Match accepted! Roster updated for ${locumName} on ${shiftName}.`);
        } catch (error) {
            toast.error("Failed to book locum match");
        }
    };

    const handleSkipMatch = async (id: number, reason: string) => {
        try {
            const updatedMatch = await aiService.skipMatch(id, reason);
            setMatches(prev => prev.map(m => m.id === id ? updatedMatch : m));
            setSkippingMatchId(null);
            toast.info(`Match skipped. AI model feedback logged: "${reason}"`);
        } catch (error) {
            toast.error("Failed to log skip feedback");
        }
    };

    const handleRefreshMatches = async () => {
        setIsRefreshingMatches(true);
        try {
            const refreshed = await aiService.refreshMatches();
            setMatches(refreshed);
            toast.success("AI Matching Engine executed. Scores updated dynamically.");
        } catch (error) {
            toast.error("Failed to fetch fresh matches");
        } finally {
            setIsRefreshingMatches(false);
        }
    };

    // Demand Forecasting Actions
    const fullForecastData = [
        { week: 'Week 1', emergency: 18, surgery: 12, cardiology: 8, pediatrics: 6, other: 10, total: 54 },
        { week: 'Week 2', emergency: 22, surgery: 14, cardiology: 9, pediatrics: 7, other: 11, total: 63 },
        { week: 'Week 3', emergency: 20, surgery: 15, cardiology: 8, pediatrics: 8, other: 12, total: 63 },
        { week: 'Week 4', emergency: 25, surgery: 16, cardiology: 10, pediatrics: 9, other: 13, total: 73 },
        { week: 'Week 5', emergency: 28, surgery: 18, cardiology: 11, pediatrics: 7, other: 14, total: 78 },
        { week: 'Week 6', emergency: 24, surgery: 15, cardiology: 9, pediatrics: 10, other: 12, total: 70 },
        { week: 'Week 7', emergency: 30, surgery: 20, cardiology: 12, pediatrics: 11, other: 15, total: 88 },
        { week: 'Week 8', emergency: 32, surgery: 22, cardiology: 14, pediatrics: 12, other: 16, total: 96 },
        { week: 'Week 9', emergency: 35, surgery: 19, cardiology: 13, pediatrics: 10, other: 14, total: 91 },
        { week: 'Week 10', emergency: 27, surgery: 17, cardiology: 11, pediatrics: 9, other: 12, total: 76 },
        { week: 'Week 11', emergency: 29, surgery: 18, cardiology: 12, pediatrics: 11, other: 15, total: 85 },
        { week: 'Week 12', emergency: 34, surgery: 21, cardiology: 15, pediatrics: 13, other: 18, total: 101 },
    ];

    const getFilteredForecastData = () => {
        const sliced = fullForecastData.slice(0, selectedTimeframe);
        
        return sliced.map(d => {
            const result: any = { week: d.week };
            
            const showEmergency = (selectedSpecialty === 'all' || selectedSpecialty === 'emergency') &&
                                 (selectedDepartment === 'all' || selectedDepartment === 'Emergency (A&E)');
            if (showEmergency) result.emergency = d.emergency;

            const showSurgery = (selectedSpecialty === 'all' || selectedSpecialty === 'surgery') &&
                               (selectedDepartment === 'all' || selectedDepartment === 'Surgery');
            if (showSurgery) result.surgery = d.surgery;

            const showCardiology = (selectedSpecialty === 'all' || selectedSpecialty === 'cardiology') &&
                                  (selectedDepartment === 'all' || selectedDepartment === 'Cardiology');
            if (showCardiology) result.cardiology = d.cardiology;

            const showPediatrics = (selectedSpecialty === 'all' || selectedSpecialty === 'pediatrics') &&
                                  (selectedDepartment === 'all' || selectedDepartment === 'Pediatrics');
            if (showPediatrics) result.pediatrics = d.pediatrics;

            if (selectedSpecialty === 'all' && selectedDepartment === 'all') {
                result.other = d.other;
                result.total = d.total;
            }
            
            return result;
        });
    };

    const predictiveInsights = [
        { id: 1, insight: 'Emergency Medicine demand expected to increase 25% next month due to seasonal shifts', confidence: 87, category: 'demand', actionable: true, specialty: 'Emergency' },
        { id: 2, insight: 'Dublin region will require 12 additional Locums for March based on historical scheduling patterns', confidence: 82, category: 'staffing', actionable: true, specialty: 'General' },
        { id: 3, insight: 'Cork University Hospital likely to increase booking frequency by 20% based on contract renewal data', confidence: 75, category: 'client', actionable: false, specialty: 'Cardiology' },
        { id: 4, insight: '3 high-performing locums are at risk of churning based on decreased shift acceptance rates', confidence: 78, category: 'retention', actionable: true, specialty: 'Retention' },
    ];

    const handleLaunchCampaign = async () => {
        if (!activeCampaignInsight) return;
        setIsLaunchingCampaign(true);
        try {
            await aiService.launchStaffingCampaign(activeCampaignInsight.id, campaignIncentive);
            setIsLaunchingCampaign(false);
            setActiveCampaignInsight(null);
            toast.success(`Staffing Campaign successfully launched! Broadcast sent to eligible Locums with a ${campaignIncentive}% rate incentive.`);
        } catch (error) {
            toast.error("Failed to launch staffing campaign");
            setIsLaunchingCampaign(false);
        }
    };

    // Auto Compliance Actions
    const handleToggleRule = async (id: number) => {
        try {
            const updated = await aiService.toggleRule(id);
            setRules(prev => prev.map(r => r.id === id ? updated : r));
            toast.success(`Compliance automation rule "${updated.document}" ${updated.active ? 'activated' : 'deactivated'}`);
        } catch (error) {
            toast.error("Failed to update rule status");
        }
    };

    const handleAddRuleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const created = await aiService.createRule({
                document: newRule.document,
                trigger: newRule.trigger,
                action: newRule.action
            });
            setRules(prev => [...prev, created]);
            setShowAddRuleModal(false);
            toast.success("New compliance automation rule successfully created!");
        } catch (error) {
            toast.error("Failed to add compliance rule");
        }
    };

    const handleSendUrgentReminder = async (id: number, locum: string) => {
        try {
            const updated = await aiService.sendUrgentReminder(id);
            setComplianceList(prev => prev.map(c => c.id === id ? updated : c));
            
            const updatedStats = await aiService.getStats();
            setStats(updatedStats);

            toast.success(`Urgent compliance alert sent to ${locum} via SMS and Email.`);
        } catch (error) {
            toast.error("Failed to trigger reminder alert");
        }
    };

    const handleVerifyDocument = async (id: number, locum: string, document: string) => {
        try {
            const updated = await aiService.verifyDocument(id);
            setComplianceList(prev => prev.map(c => c.id === id ? updated : c));
            toast.success(`Document "${document}" for ${locum} has been verified.`);
        } catch (error) {
            toast.error("Failed to verify document");
        }
    };

    // Auto-Scheduling Simulation & Execution Actions
    const handleRunAutoSchedule = async () => {
        setIsSimulatingSchedule(true);
        setSimStep(1);
        try {
            const runResults = await aiService.executeAutoScheduleRun();
            setPendingScheduleResult(runResults);
        } catch (error) {
            console.error(error);
            toast.error("Scheduler run failed");
            setIsSimulatingSchedule(false);
            setSimStep(0);
        }
    };

    // Timeline control for scheduler animation synced with backend API results
    useEffect(() => {
        if (!isSimulatingSchedule) return;

        let timer: any;
        if (simStep === 1) {
            timer = setTimeout(() => setSimStep(2), 900);
        } else if (simStep === 2) {
            timer = setTimeout(() => setSimStep(3), 900);
        } else if (simStep === 3) {
            timer = setTimeout(() => setSimStep(4), 900);
        } else if (simStep === 4) {
            timer = setTimeout(() => setSimStep(5), 900);
        } else if (simStep === 5) {
            timer = setTimeout(() => {
                setIsSimulatingSchedule(false);
                setSimStep(0);
                
                if (pendingScheduleResult) {
                    const { results, newStats } = pendingScheduleResult;
                    setScheduleResults(results);
                    setStats(newStats);

                    // Compute aggregate statistics
                    const totalAuto = results.reduce((acc, curr) => acc + curr.auto, 0);
                    const totalManual = results.reduce((acc, curr) => acc + curr.manual, 0);
                    const totalUnfilled = results.reduce((acc, curr) => acc + curr.unfilled, 0);
                    const totalFilled = results.reduce((acc, curr) => acc + curr.filled, 0);
                    const totalShifts = results.reduce((acc, curr) => acc + curr.shifts, 0);

                    setAutoScheduleStats({
                        totalShifts,
                        filled: totalFilled,
                        auto: totalAuto,
                        manual: totalManual,
                        unfilled: totalUnfilled
                    });

                    toast.success("AI Scheduler Execution Completed! Shifts auto-assigned, fill rate increased.");
                    setPendingScheduleResult(null);
                }
            }, 1200);
        }

        return () => clearTimeout(timer);
    }, [isSimulatingSchedule, simStep, pendingScheduleResult]);

    // Autopilot toggle handler
    const handleAutopilotToggle = async () => {
        const nextVal = !autopilot;
        setAutopilot(nextVal);
        try {
            await aiService.saveAutopilotState(nextVal);
            toast.success(`AI Auto-Pilot ${nextVal ? 'enabled. Auto-matching active.' : 'disabled. Manual review mandatory.'}`);
        } catch (error) {
            toast.error("Failed to save autopilot settings");
        }
    };

    const [activeTab, setActiveTab] = useState<'matching' | 'forecasting' | 'compliance' | 'scheduling'>('matching');

    if (isLoadingData) {
        return (
            <div className="p-6 flex flex-col items-center justify-center min-h-[400px] space-y-3">
                <RefreshCw className="w-8 h-8 text-[#8B5CF6] animate-spin" />
                <p className="text-sm text-zinc-500 font-semibold animate-pulse">Initializing AI and Automation engine configurations...</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            
            {/* Header section with styling & Auto-Pilot Toggle */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#8B5CF6]/5 to-[#EC4899]/5 rounded-full blur-3xl pointer-events-none" />
                <div className="flex items-center gap-4 z-10">
                    <div className="w-12 h-12 bg-gradient-to-tr from-[#8B5CF6] to-[#EC4899] rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 transform hover:rotate-6 transition-transform">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl text-[#1F2937] font-semibold tracking-tight mb-0">AI & Automation Hub</h2>
                            <span className="text-[10px] px-2 py-0.5 font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span> Engine v4.2
                            </span>
                        </div>
                        <p className="text-xs text-[#6B7280]">Real-time clinical matching, demand forecasting models, automated compliance tracking, and automated schedules.</p>
                    </div>
                </div>

                {/* Auto Pilot Trigger Switch */}
                <div className="flex items-center gap-3 px-4 py-2.5 bg-zinc-50 border border-zinc-200/80 rounded-xl z-10 shrink-0">
                    <div className="text-right">
                        <p className="text-xs text-[#1F2937] font-semibold">AI Auto-Pilot</p>
                        <p className="text-[10px] text-[#9CA3AF]">{autopilot ? "Fully automated background matching" : "Manual review mode active"}</p>
                    </div>
                    <button 
                        onClick={handleAutopilotToggle}
                        className="focus:outline-none transition-transform active:scale-95"
                    >
                        {autopilot ? (
                            <ToggleRight className="w-10 h-10 text-[#10B981] fill-emerald-500/10 cursor-pointer" />
                        ) : (
                            <ToggleLeft className="w-10 h-10 text-[#9CA3AF] cursor-pointer" />
                        )}
                    </button>
                </div>
            </div>

            {/* Smart Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'AI Matches This Week', value: stats.aiMatches, sub: '91% client acceptance', icon: Brain, color: '#8B5CF6', bg: '#EDE9FE' },
                    { label: 'Auto-Scheduled Shifts', value: stats.autoScheduled, sub: 'Auto-fill active', icon: Calendar, color: '#10B981', bg: '#D1FAE5' },
                    { label: 'Compliance Reminders', value: stats.complianceReminders, sub: 'Sent dynamically', icon: Shield, color: '#3B82F6', bg: '#DBEAFE' },
                    { label: 'Coordinator Hours Saved', value: `${stats.timeSaved}h`, sub: 'This month vs manual', icon: Clock, color: '#F59E0B', bg: '#FEF3C7' },
                ].map(s => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: s.bg }}>
                                    <Icon className="w-6 h-6" style={{ color: s.color }} />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-[#9CA3AF] tracking-wide uppercase">{s.label}</p>
                                    <p className="text-2xl text-[#1F2937] font-bold mt-0.5" style={{ fontFamily: 'var(--font-display)' }}>{s.value}</p>
                                    <p className="text-[11px] text-[#10B981] font-medium flex items-center gap-1 mt-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                                        {s.sub}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Tabs Control Box */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                <div className="border-b border-[#E5E7EB] bg-zinc-50/50 px-6">
                    <div className="flex gap-8 overflow-x-auto">
                        {[
                            { id: 'matching' as const, label: 'Smart Match Diagnostics', icon: Brain },
                            { id: 'forecasting' as const, label: 'Demand Forecasting Models', icon: TrendingUp },
                            { id: 'compliance' as const, label: 'Automated Credentials Protection', icon: Shield },
                            { id: 'scheduling' as const, label: 'Auto-Scheduler Engine', icon: Calendar },
                        ].map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 text-sm border-b-2 transition-all duration-300 flex items-center gap-2.5 whitespace-nowrap focus:outline-none relative ${activeTab === tab.id ? 'border-[#8B5CF6] text-[#8B5CF6] font-semibold' : 'border-transparent text-[#6B7280] hover:text-[#1F2937] hover:border-zinc-300'}`}
                                >
                                    <Icon className={`w-4 h-4 transition-transform ${activeTab === tab.id ? 'scale-110 text-[#8B5CF6]' : 'text-[#9CA3AF]'}`} />
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] rounded-full" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* TAB 1: Smart Match Diagnostics */}
                {activeTab === 'matching' && (
                    <div className="p-6 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-base text-[#1F2937] font-semibold">Clinical Matching Engine</h3>
                                <p className="text-xs text-[#9CA3AF]">Recommends the best verified locum professionals for unfilled shifts based on credential fit, distance, performance and budget weightings.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setShowWeightsConfig(!showWeightsConfig)}
                                    className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all ${showWeightsConfig ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-[#E5E7EB] text-[#4B5563] hover:bg-zinc-50'}`}
                                >
                                    <Sliders className="w-3.5 h-3.5" /> Adjust Algorithm Weights
                                </button>
                                <button 
                                    onClick={handleRefreshMatches}
                                    disabled={isRefreshingMatches}
                                    className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#8B5CF6] hover:bg-[#7c3aed] rounded-xl shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
                                >
                                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingMatches ? 'animate-spin' : ''}`} /> 
                                    {isRefreshingMatches ? 'Recalculating...' : 'Refresh Suggestions'}
                                </button>
                            </div>
                        </div>

                        {/* Expandable Parameters Tuning sliders */}
                        {showWeightsConfig && (
                            <div className="p-5 bg-zinc-50 border border-zinc-200 rounded-2xl animate-in fade-in duration-300 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wide flex items-center gap-1.5">
                                        <Sliders className="w-3.5 h-3.5 text-zinc-500" /> Match Priority Slider Adjustments
                                    </h4>
                                    <div className="flex gap-2">
                                        <button onClick={() => applyWeightsPreset('balanced')} className="px-2 py-1 text-[10px] font-semibold bg-white border border-zinc-200 rounded text-zinc-600 hover:bg-zinc-50">Balanced Preset</button>
                                        <button onClick={() => applyWeightsPreset('quality')} className="px-2 py-1 text-[10px] font-semibold bg-indigo-50 border border-indigo-100 rounded text-indigo-600 hover:bg-indigo-100">Quality-Driven</button>
                                        <button onClick={() => applyWeightsPreset('budget')} className="px-2 py-1 text-[10px] font-semibold bg-emerald-50 border border-emerald-100 rounded text-emerald-600 hover:bg-emerald-100">Cost-Saving</button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
                                    {[
                                        { key: 'specialty', label: 'Specialty & Title Match' },
                                        { key: 'distance', label: 'Proximity / Commute' },
                                        { key: 'performance', label: 'Historical Rating' },
                                        { key: 'pricing', label: 'Hourly Rate Budget' },
                                        { key: 'compliance', label: 'Credentials Validated' },
                                    ].map(item => (
                                        <div key={item.key} className="space-y-1.5">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-zinc-500 font-medium">{item.label}</span>
                                                <span className="font-bold text-zinc-700">{weights[item.key as keyof typeof weights]}%</span>
                                            </div>
                                            <input 
                                                type="range" 
                                                min="0" 
                                                max="100"
                                                value={weights[item.key as keyof typeof weights]}
                                                onChange={(e) => handleWeightChange(item.key as keyof typeof weights, parseInt(e.target.value))}
                                                className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="text-[10px] text-zinc-400">
                                    *Match percentages in candidate cards update dynamically in real time as sliders are modified.
                                </div>
                            </div>
                        )}

                        {/* Suggestions matches list */}
                        {isRefreshingMatches ? (
                            <div className="py-20 flex flex-col items-center justify-center bg-zinc-50/50 border border-dashed border-[#E5E7EB] rounded-2xl space-y-3">
                                <RefreshCw className="w-8 h-8 text-[#8B5CF6] animate-spin" />
                                <p className="text-xs text-[#6B7280] font-medium animate-pulse">Consulting schedule requirements and compiling compliance scores...</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {matches.filter(m => m.status !== 'skipped').map(match => {
                                    const score = getMatchScore(match);
                                    const hospitalName = hospitals[match.facilityIndex % hospitals.length] || 'Facility General';
                                    const isAccepted = match.status === 'accepted';

                                    return (
                                        <div key={match.id} className={`border rounded-2xl p-5 transition-all relative overflow-hidden bg-white shadow-sm hover:shadow-md ${isAccepted ? 'border-emerald-200 bg-emerald-50/10' : 'border-[#E5E7EB] hover:border-zinc-300'}`}>
                                            
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                                <div className="flex-1 space-y-2.5">
                                                    
                                                    {/* Shift details row */}
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="text-sm font-semibold text-[#1F2937]">{match.shift}</span>
                                                        <ArrowRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
                                                        <span className="text-sm font-bold text-[#8B5CF6]">{match.locum}</span>
                                                        {isAccepted && (
                                                            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-full flex items-center gap-1">
                                                                <Check className="w-3 h-3" /> Confirmed Fill
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Location, Specialty & Date */}
                                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#6B7280]">
                                                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#9CA3AF]" /> {hospitalName}</span>
                                                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#9CA3AF]" /> {match.date}</span>
                                                        <span className="flex items-center gap-1.5"><TagBadge specialty={match.specialty} /></span>
                                                    </div>

                                                    {/* Reasons for recommendation tags */}
                                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                                        {match.reasons.map((r, i) => (
                                                            <span key={i} className="px-2.5 py-0.5 bg-zinc-100 text-[#4B5563] text-[10px] rounded-lg border border-zinc-200/50 font-medium">{r}</span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Match Score Gauge & Interactive buttons */}
                                                <div className="flex items-center gap-5 shrink-0 self-center md:self-start">
                                                    <div className="text-center">
                                                        <div 
                                                            className="w-14 h-14 rounded-full border-[3px] flex flex-col items-center justify-center bg-white shadow-inner relative"
                                                            style={{ 
                                                                borderColor: score >= 90 ? '#10B981' : score >= 80 ? '#3B82F6' : '#F59E0B' 
                                                            }}
                                                        >
                                                            <span className="text-sm font-bold" style={{ color: score >= 90 ? '#10B981' : score >= 80 ? '#3B82F6' : '#F59E0B' }}>{score}%</span>
                                                        </div>
                                                        <p className="text-[10px] text-[#9CA3AF] font-medium mt-1 uppercase tracking-wider">AI Conf</p>
                                                    </div>

                                                    <div className="flex flex-col gap-1.5 w-24">
                                                        {isAccepted ? (
                                                            <button 
                                                                disabled 
                                                                className="w-full px-3 py-2 text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl flex items-center justify-center gap-1"
                                                            >
                                                                <Check className="w-3.5 h-3.5 text-emerald-600" /> Booked
                                                            </button>
                                                        ) : (
                                                            <>
                                                                <button 
                                                                    onClick={() => handleAcceptMatch(match.id, match.locum, match.shift)}
                                                                    className="w-full px-3 py-2 text-xs font-semibold bg-[#10B981] hover:bg-[#059669] text-white rounded-xl shadow-sm hover:scale-105 active:scale-95 transition-all"
                                                                >
                                                                    Book Locum
                                                                </button>
                                                                <button 
                                                                    onClick={() => setSkippingMatchId(match.id)}
                                                                    className="w-full px-3 py-2 text-xs font-semibold border border-[#E5E7EB] text-[#4B5563] hover:bg-zinc-50 rounded-xl hover:text-red-600 hover:border-red-200 active:scale-95 transition-all"
                                                                >
                                                                    Skip Match
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Skip Feedbacks inline popup modal */}
                                            {skippingMatchId === match.id && (
                                                <div className="mt-4 p-4 border border-zinc-200 rounded-xl bg-zinc-50 animate-in slide-in-from-top duration-200">
                                                    <p className="text-xs font-bold text-zinc-700 mb-2">Help improve the AI: Why are you skipping this match?</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {[
                                                            "Hourly rate exceeds budget",
                                                            "Locum commute is too far",
                                                            "Facility prefers alternate staff",
                                                            "Shift schedule overlaps other bookings",
                                                            "Insufficient user ratings feedback"
                                                        ].map(reasonOption => (
                                                            <button 
                                                                key={reasonOption}
                                                                onClick={() => handleSkipMatch(match.id, reasonOption)}
                                                                className="px-2.5 py-1.5 text-[10px] bg-white border border-zinc-200 hover:border-indigo-400 rounded-lg text-zinc-600 hover:text-indigo-600 hover:bg-indigo-50/20 transition-all font-medium"
                                                            >
                                                                {reasonOption}
                                                            </button>
                                                        ))}
                                                        <button 
                                                            onClick={() => setSkippingMatchId(null)}
                                                            className="px-2.5 py-1.5 text-[10px] bg-zinc-200 hover:bg-zinc-300 rounded-lg text-zinc-600 transition-all font-medium flex items-center gap-1"
                                                        >
                                                            <X className="w-3 h-3" /> Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {matches.filter(m => m.status !== 'skipped').length === 0 && (
                                    <div className="py-12 text-center bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                                        <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                                        <p className="text-sm font-semibold text-zinc-700">All matching recommendations addressed!</p>
                                        <p className="text-xs text-zinc-500 mt-1">Click "Refresh Suggestions" to pull in new shifts requiring clinical staff.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 2: Demand Forecasting Models */}
                {activeTab === 'forecasting' && (
                    <div className="p-6 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-base text-[#1F2937] font-semibold">Hospital Demand Forecasting</h3>
                                <p className="text-xs text-[#9CA3AF]">Predictive ML model outlining expected shift vacancy spikes over the coming weeks by hospital specialty and region.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-zinc-500 font-medium">Filter Specialty:</span>
                                    <select
                                        value={selectedSpecialty}
                                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                                        className="px-3 py-1.5 text-xs bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none"
                                    >
                                        <option value="all">All Specialties Combined</option>
                                        <option value="emergency">Emergency Medicine</option>
                                        <option value="surgery">General Surgery</option>
                                        <option value="cardiology">Cardiology</option>
                                        <option value="pediatrics">Pediatrics</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-zinc-500 font-medium">Filter Department:</span>
                                    <select
                                        value={selectedDepartment}
                                        onChange={(e) => setSelectedDepartment(e.target.value)}
                                        className="px-3 py-1.5 text-xs bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none"
                                    >
                                        <option value="all">All Departments</option>
                                        <option value="Emergency (A&E)">Emergency (A&E)</option>
                                        <option value="Surgery">Surgery</option>
                                        <option value="Cardiology">Cardiology</option>
                                        <option value="Pediatrics">Pediatrics</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-zinc-500 font-medium">Timeline:</span>
                                    <select
                                        value={selectedTimeframe}
                                        onChange={(e) => setSelectedTimeframe(parseInt(e.target.value))}
                                        className="px-3 py-1.5 text-xs bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none"
                                    >
                                        <option value="6">6 Weeks (Short-Term)</option>
                                        <option value="12">12 Weeks (Extended Forecast)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Recharts Area Forecast Plot */}
                        <div className="bg-zinc-50/50 p-5 rounded-2xl border border-zinc-150">
                            <ResponsiveContainer width="100%" height={320}>
                                <AreaChart data={getFilteredForecastData()}>
                                    <defs>
                                        <linearGradient id="colorEmergency" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorSurgery" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorCardiology" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorPediatrics" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorOther" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                                    <XAxis dataKey="week" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                                    
                                    {/* Conditionally render plots based on filters */}
                                    {(selectedSpecialty === 'all' || selectedSpecialty === 'emergency') && 
                                     (selectedDepartment === 'all' || selectedDepartment === 'Emergency (A&E)') && (
                                        <Area type="monotone" dataKey="emergency" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorEmergency)" name="Emergency" />
                                    )}
                                    {(selectedSpecialty === 'all' || selectedSpecialty === 'surgery') && 
                                     (selectedDepartment === 'all' || selectedDepartment === 'Surgery') && (
                                        <Area type="monotone" dataKey="surgery" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorSurgery)" name="General Surgery" />
                                    )}
                                    {(selectedSpecialty === 'all' || selectedSpecialty === 'cardiology') && 
                                     (selectedDepartment === 'all' || selectedDepartment === 'Cardiology') && (
                                        <Area type="monotone" dataKey="cardiology" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorCardiology)" name="Cardiology" />
                                    )}
                                    {(selectedSpecialty === 'all' || selectedSpecialty === 'pediatrics') && 
                                     (selectedDepartment === 'all' || selectedDepartment === 'Pediatrics') && (
                                        <Area type="monotone" dataKey="pediatrics" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#colorPediatrics)" name="Pediatrics" />
                                    )}
                                    {selectedSpecialty === 'all' && selectedDepartment === 'all' && (
                                        <>
                                            <Area type="monotone" dataKey="other" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorOther)" name="Other Depts" />
                                            <Area type="monotone" dataKey="total" stroke="#6366F1" strokeWidth={2} strokeDasharray="4 4" fillOpacity={0.1} fill="url(#colorTotal)" name="Total Vacancies Forecasted" />
                                        </>
                                    )}
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Actionable Predictive Insights */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-[#1F2937]">System Generated Staffing Actions</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {predictiveInsights.map((insight) => (
                                    <div key={insight.id} className="flex items-start gap-4 p-4 bg-white border border-[#E5E7EB] hover:border-zinc-300 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#8B5CF6]/5 to-transparent rounded-full pointer-events-none" />
                                        <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                                            <Sparkles className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <p className="text-xs text-[#1F2937] leading-relaxed font-semibold">{insight.insight}</p>
                                            <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-100">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-zinc-400">Confidence: {insight.confidence}%</span>
                                                    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-md ${
                                                        insight.category === 'demand' ? 'bg-red-50 text-red-600 border border-red-100' :
                                                        insight.category === 'staffing' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                                        insight.category === 'client' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                        'bg-amber-50 text-amber-600 border border-amber-100'
                                                    }`}>{insight.category.toUpperCase()}</span>
                                                </div>
                                                {insight.actionable && (
                                                    <button 
                                                        onClick={() => setActiveCampaignInsight(insight)}
                                                        className="text-[10px] font-bold text-[#8B5CF6] hover:text-[#7C3AED] hover:underline flex items-center gap-0.5 group/btn focus:outline-none"
                                                    >
                                                        Run Campaign <ChevronDown className="w-3.5 h-3.5 transform transition-transform group-hover/btn:translate-x-0.5 -rotate-90" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Interactive Staffing Campaign Launch Modal */}
                        {activeCampaignInsight && (
                            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                                <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-zinc-200 overflow-hidden animate-in zoom-in-95 duration-200">
                                    <div className="p-5 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="w-5 h-5" />
                                            <h3 className="text-sm font-bold tracking-tight">AI Staffing Campaign Wizard</h3>
                                        </div>
                                        <button 
                                            onClick={() => setActiveCampaignInsight(null)}
                                            className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-lg transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="p-5 space-y-4">
                                        <div>
                                            <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">AI Forecast Trigger</p>
                                            <p className="text-xs font-semibold text-zinc-700 mt-1">{activeCampaignInsight.insight}</p>
                                        </div>
                                        <hr className="border-zinc-150" />
                                        
                                        {/* Campaign Setup form fields */}
                                        <div className="space-y-3">
                                            <label className="block text-xs font-bold text-zinc-600">Select Communication Channels</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {['Email Broadcast', 'SMS Alert', 'App Push Notification'].map(ch => (
                                                    <div key={ch} className="border border-zinc-200 rounded-xl p-2 bg-zinc-50 flex flex-col items-center justify-center text-center">
                                                        <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-500 mb-1.5" />
                                                        <span className="text-[10px] text-zinc-600 font-semibold">{ch}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold text-zinc-600">
                                                <span>Hourly Rate Premium Incentive</span>
                                                <span className="text-[#8B5CF6]">+{campaignIncentive}% over standard</span>
                                            </div>
                                            <input 
                                                type="range" 
                                                min="0" 
                                                max="25"
                                                step="5"
                                                value={campaignIncentive}
                                                onChange={(e) => setCampaignIncentive(parseInt(e.target.value))}
                                                className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                            />
                                            <p className="text-[9px] text-zinc-400">Add an incentive to fill urgent forecast shortages faster. Current model predicts +35% acceptance increase at +10%.</p>
                                        </div>

                                        <div className="bg-indigo-50 border border-indigo-150 rounded-xl p-3.5 flex items-start gap-3">
                                            <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-[11px] font-semibold text-indigo-800">Targeting Strategy</p>
                                                <p className="text-[10px] text-indigo-700/80 leading-relaxed mt-0.5">We will target 14 compatible {activeCampaignInsight.specialty} locums in the database matching facility credentials with compliance documents valid.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-5 py-4 bg-zinc-50 border-t border-zinc-200 flex justify-end gap-2.5">
                                        <button 
                                            onClick={() => setActiveCampaignInsight(null)}
                                            className="px-3.5 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-xl transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={handleLaunchCampaign}
                                            disabled={isLaunchingCampaign}
                                            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] rounded-xl flex items-center justify-center gap-1.5 hover:opacity-90 shadow-sm transition-all focus:outline-none"
                                        >
                                            {isLaunchingCampaign ? (
                                                <>
                                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Broadcasting...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-3.5 h-3.5" /> Launch Staffing Campaign
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 3: Automated Compliance Credentials */}
                {activeTab === 'compliance' && (
                    <div className="p-6 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-base text-[#1F2937] font-semibold">Automated Compliance Rules & Checks</h3>
                                <p className="text-xs text-[#9CA3AF]">Monitors document expirations, schedules automated renewal notifications to clinical staff, and enforces credential booking locks.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setShowAddRuleModal(true)}
                                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#10B981] hover:bg-[#059669] rounded-xl shadow-sm hover:scale-105 active:scale-95 transition-all focus:outline-none"
                                >
                                    <Plus className="w-4 h-4" /> Add Automation Rule
                                </button>
                            </div>
                        </div>

                        {/* Statistics boxes for compliance */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0"><CheckCircle className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wide font-medium">Compliance Rules Enabled</p>
                                    <p className="text-lg font-bold text-emerald-800 mt-0.5">{rules.filter(r => r.active).length} / {rules.length} Rules</p>
                                </div>
                            </div>
                            <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 shrink-0"><Send className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wide font-medium">Auto Sent Reminders MTD</p>
                                    <p className="text-lg font-bold text-indigo-800 mt-0.5">{stats.complianceReminders} Alerts</p>
                                </div>
                            </div>
                            <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-2xl flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 shrink-0"><Shield className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wide font-medium">Auto-Verified Docs MTD</p>
                                    <p className="text-lg font-bold text-purple-800 mt-0.5">15 Uploads</p>
                                </div>
                            </div>
                        </div>

                        {/* Rules configurations panel */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-[#1F2937]">Active Compliance Rules Matrix</h4>
                            <div className="border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
                                <table className="w-full border-collapse bg-white">
                                    <thead>
                                        <tr className="bg-zinc-50 border-b border-[#E5E7EB]">
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280]">Target Roster Document</th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280]">Trigger Condition</th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280]">Automated Actions Launched</th>
                                            <th className="px-5 py-3 text-right text-xs font-semibold text-[#6B7280]">Status Switch</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100">
                                        {rules.map(rule => (
                                            <tr key={rule.id} className="hover:bg-zinc-50/50 transition-colors">
                                                <td className="px-5 py-3.5 text-xs text-[#1F2937] font-semibold">{rule.document}</td>
                                                <td className="px-5 py-3.5 text-xs text-[#6B7280]">{rule.trigger}</td>
                                                <td className="px-5 py-3.5 text-xs text-[#6B7280]">{rule.action}</td>
                                                <td className="px-5 py-3.5 text-right">
                                                    <button 
                                                        onClick={() => handleToggleRule(rule.id)}
                                                        className={`text-xs px-2.5 py-1 rounded-md font-semibold border transition-colors ${rule.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}
                                                    >
                                                        {rule.active ? 'Active' : 'Disabled'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Interactive Expiries Reminders Table */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-[#1F2937] flex items-center gap-1.5">
                                <ShieldAlert className="w-4 h-4 text-red-500" /> Approaching Credentials Expirations
                            </h4>
                            <div className="border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
                                <table className="w-full border-collapse bg-white">
                                    <thead>
                                        <tr className="bg-zinc-50 border-b border-[#E5E7EB]">
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280]">Locum Professional</th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280]">Document Requirement</th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280]">Days left</th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280]">Last Auto Action</th>
                                            <th className="px-5 py-3 text-right text-xs font-semibold text-[#6B7280]">Actions Queue</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100">
                                        {complianceList.map((c) => {
                                            const docName = c.document === 'Garda Vetting' ? t('nationalVettingShort') : c.document === 'Medical License' ? t('medicalLicense') : c.document;
                                            const isCritical = c.daysUntilExpiry <= 7;
                                            const isWarning = c.daysUntilExpiry <= 30 && c.daysUntilExpiry > 7;

                                            return (
                                                <tr key={c.id} className="hover:bg-zinc-50/50 transition-colors">
                                                    <td className="px-5 py-3.5 text-xs text-[#1F2937] font-semibold">{c.locum}</td>
                                                    <td className="px-5 py-3.5 text-xs text-[#6B7280]">{docName}</td>
                                                    <td className="px-5 py-3.5 text-xs">
                                                        {c.status === 'verified' ? (
                                                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">Verified</span>
                                                        ) : (
                                                            <span className={`font-semibold ${isCritical ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-emerald-600'}`}>
                                                                {c.daysUntilExpiry} days
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-3.5 text-xs text-[#6B7280]">{c.action}</td>
                                                    <td className="px-5 py-3.5 text-right">
                                                        <div className="flex justify-end gap-1.5">
                                                            {c.status === 'verified' ? (
                                                                <span className="text-emerald-500 font-bold text-xs flex items-center gap-0.5">
                                                                    <Check className="w-3.5 h-3.5 text-emerald-500" /> Checked
                                                                </span>
                                                            ) : (
                                                                <>
                                                                    <button 
                                                                        onClick={() => handleSendUrgentReminder(c.id, c.locum)}
                                                                        className="px-2.5 py-1 text-[10px] font-semibold bg-indigo-50 border border-indigo-150 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors focus:outline-none"
                                                                    >
                                                                        Alert Staff
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => handleVerifyDocument(c.id, c.locum, c.document)}
                                                                        className="px-2.5 py-1 text-[10px] font-semibold bg-emerald-50 border border-emerald-150 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors focus:outline-none"
                                                                    >
                                                                        Verify Upload
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Modal to Add Rule */}
                        {showAddRuleModal && (
                            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                                <form onSubmit={handleAddRuleSubmit} className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-zinc-200 overflow-hidden animate-in zoom-in-95 duration-200">
                                    <div className="p-5 bg-gradient-to-r from-[#10B981] to-[#059669] text-white flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-5 h-5" />
                                            <h3 className="text-sm font-bold tracking-tight">Create Automation Rule</h3>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => setShowAddRuleModal(false)}
                                            className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-lg transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="p-5 space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-zinc-600">Credential Document Type</label>
                                            <input 
                                                type="text" 
                                                value={newRule.document}
                                                onChange={(e) => setNewRule(prev => ({ ...prev, document: e.target.value }))}
                                                required
                                                className="w-full px-3 py-2 text-xs border border-zinc-200 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] rounded-xl outline-none"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-zinc-600">Alert Trigger Condition</label>
                                            <select 
                                                value={newRule.trigger}
                                                onChange={(e) => setNewRule(prev => ({ ...prev, trigger: e.target.value }))}
                                                className="w-full px-3 py-2 text-xs border border-zinc-200 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] rounded-xl outline-none"
                                            >
                                                <option value="90 days before expiry">90 days before expiry</option>
                                                <option value="60 days before expiry">60 days before expiry</option>
                                                <option value="30 days before expiry">30 days before expiry</option>
                                                <option value="14 days before expiry">14 days before expiry</option>
                                                <option value="On expiry date">On expiry date</option>
                                            </select>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-zinc-600">Auto Action Response</label>
                                            <select 
                                                value={newRule.action}
                                                onChange={(e) => setNewRule(prev => ({ ...prev, action: e.target.value }))}
                                                className="w-full px-3 py-2 text-xs border border-zinc-200 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] rounded-xl outline-none"
                                            >
                                                <option value="Send Email & SMS Alert">Send Email & SMS Alert</option>
                                                <option value="Send Portal Alert & Email Admin">Send Portal Alert & Email Admin</option>
                                                <option value="Auto block from shift selection">Auto block from shift selection</option>
                                                <option value="Email Coordinator for Review">Email Coordinator for Review</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="px-5 py-4 bg-zinc-50 border-t border-zinc-200 flex justify-end gap-2">
                                        <button 
                                            type="button"
                                            onClick={() => setShowAddRuleModal(false)}
                                            className="px-3.5 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-xl"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit"
                                            className="px-4 py-2 text-xs font-bold text-white bg-[#10B981] hover:bg-[#059669] rounded-xl"
                                        >
                                            Create Rule
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 4: Auto-Scheduler Engine */}
                {activeTab === 'scheduling' && (
                    <div className="p-6 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-base text-[#1F2937] font-semibold">Shift Roster Auto-Scheduling</h3>
                                <p className="text-xs text-[#9CA3AF]">Simulates and runs clinical shifts auto-fill based on verified calendar schedules, credential status, and geographical factors.</p>
                            </div>
                            <div>
                                <button 
                                    onClick={handleRunAutoSchedule}
                                    className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-90 rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 focus:outline-none"
                                >
                                    <Play className="w-3.5 h-3.5 fill-white" /> Execute Auto-Scheduler Run
                                </button>
                            </div>
                        </div>

                        {/* Scheduler Statistics metrics */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                                <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wide">Auto-Fill Success Rate</p>
                                <p className="text-2xl font-bold text-emerald-800 mt-1" style={{ fontFamily: 'var(--font-display)' }}>
                                    {autoScheduleStats.totalShifts > 0 ? Math.round((autoScheduleStats.auto / autoScheduleStats.totalShifts) * 100) : 0}%
                                </p>
                                <p className="text-[11px] text-emerald-700/80 font-medium mt-0.5">{autoScheduleStats.auto} of {autoScheduleStats.totalShifts} shifts automated</p>
                            </div>
                            <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                                <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wide">Avg Roster Match Score</p>
                                <p className="text-2xl font-bold text-indigo-800 mt-1" style={{ fontFamily: 'var(--font-display)' }}>89.2%</p>
                                <p className="text-[11px] text-indigo-700/80 font-medium mt-0.5">Satisfies 85% safety threshold</p>
                            </div>
                            <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl">
                                <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wide">Requires Coordinator Review</p>
                                <p className="text-2xl font-bold text-amber-800 mt-1" style={{ fontFamily: 'var(--font-display)' }}>{autoScheduleStats.unfilled}</p>
                                <p className="text-[11px] text-amber-700/80 font-medium mt-0.5">{autoScheduleStats.unfilled === 0 ? "Roster fully matched!" : "Flagged due to low compliance overlap"}</p>
                            </div>
                        </div>

                        {/* Roster automation results */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-[#1F2937]">Facility Filling Metrics (This Week)</h4>
                            <div className="border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm bg-white">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-zinc-50 border-b border-[#E5E7EB]">
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280]">Facility Location</th>
                                            <th className="px-5 py-3 text-center text-xs font-semibold text-[#6B7280]">Total Posted</th>
                                            <th className="px-5 py-3 text-center text-xs font-semibold text-[#6B7280]">Filled Slots</th>
                                            <th className="px-5 py-3 text-center text-xs font-semibold text-[#6B7280]">AI Placed</th>
                                            <th className="px-5 py-3 text-center text-xs font-semibold text-[#6B7280]">Manual Placed</th>
                                            <th className="px-5 py-3 text-right text-xs font-semibold text-[#6B7280]">Status Queue</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100">
                                        {scheduleResults.map((result) => {
                                            const facilityName = hospitals[result.facilityIndex % hospitals.length] || 'Hospital General';
                                            return (
                                                <tr key={result.id} className="hover:bg-zinc-50/50 transition-colors">
                                                    <td className="px-5 py-3.5 text-xs text-[#1F2937] font-semibold">{facilityName}</td>
                                                    <td className="px-5 py-3.5 text-xs text-center font-bold text-zinc-750">{result.shifts}</td>
                                                    <td className="px-5 py-3.5 text-xs text-center font-semibold text-emerald-600">{result.filled}</td>
                                                    <td className="px-5 py-3.5 text-xs text-center">
                                                        <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full font-bold text-[10px]">
                                                            {result.auto} AI
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3.5 text-xs text-center text-zinc-500 font-medium">{result.manual}</td>
                                                    <td className="px-5 py-3.5 text-right text-xs">
                                                        {result.unfilled > 0 ? (
                                                            <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 rounded font-semibold text-[10px]">
                                                                {result.unfilled} Flagged Review
                                                            </span>
                                                        ) : (
                                                            <span className={`px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded font-semibold text-[10px] inline-flex items-center gap-1 ${result.wasAutoFilled ? 'animate-pulse' : ''}`}>
                                                                <Check className="w-3 h-3 text-emerald-500" /> Complete
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Auto-Scheduler progress steps simulation overlay */}
                        {isSimulatingSchedule && (
                            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                                <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-zinc-200 overflow-hidden animate-in zoom-in-95 duration-200 p-6 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                                            <Brain className="w-5 h-5 text-indigo-600 animate-pulse" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-zinc-800">Executing Auto-Scheduler Engine</h3>
                                            <p className="text-[10px] text-zinc-400">Model: RosterOptimizer v4.2</p>
                                        </div>
                                    </div>
                                    <hr className="border-zinc-150" />

                                    {/* Checklist of run progress steps */}
                                    <div className="space-y-4">
                                        {[
                                            { step: 1, label: 'Reading open shift calendars & requirements...' },
                                            { step: 2, label: 'Scanning candidate pool & checking commute ranges...' },
                                            { step: 3, label: 'Verifying real-time credential compliance checks...' },
                                            { step: 4, label: 'Executing cost and distance optimization calculations...' },
                                            { step: 5, label: 'Saving match selections to shifts database...' },
                                        ].map(item => {
                                            const isActive = simStep === item.step;
                                            const isDone = simStep > item.step;

                                            return (
                                                <div key={item.step} className="flex items-center justify-between gap-3 text-xs">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 border ${
                                                            isDone ? 'bg-emerald-500 border-emerald-500 text-white' :
                                                            isActive ? 'bg-indigo-50 border-indigo-500 text-indigo-700 animate-pulse' :
                                                            'bg-zinc-50 border-zinc-200 text-zinc-400'
                                                        }`}>
                                                            {isDone ? <Check className="w-3 h-3 text-white" /> : item.step}
                                                        </div>
                                                        <span className={`font-semibold ${isActive ? 'text-zinc-800 font-bold' : isDone ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                                            {item.label}
                                                        </span>
                                                    </div>
                                                    {isActive && (
                                                        <Clock className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Simulation running progress bar */}
                                    <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
                                        <div 
                                            className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
                                            style={{ width: `${(simStep - 1) * 25}%` }}
                                        />
                                    </div>
                                    <div className="text-[10px] text-zinc-400 text-center">
                                        Optimization factors include client travel distance, compliance ratings, and agency margins.
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// Small subcomponents for UI presentation helper
function TagBadge({ specialty }: { specialty: string }) {
    if (specialty === 'Emergency') return <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-100 rounded text-[10px] font-bold">EMERGENCY</span>;
    if (specialty === 'Surgery') return <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-[10px] font-bold">SURGERY</span>;
    if (specialty === 'Pediatrics') return <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded text-[10px] font-bold">PEDIATRICS</span>;
    if (specialty === 'Cardiology') return <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[10px] font-bold">CARDIOLOGY</span>;
    return <span className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-100 rounded text-[10px] font-bold">CLINICAL</span>;
}
