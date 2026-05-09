import { useState } from 'react';
import {
    Sparkles, Brain, Calendar, Users, TrendingUp, Zap,
    CheckCircle, Clock, Target, ArrowRight, RefreshCw,
    BarChart3, Shield, Bell, Star, MapPin, Activity
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar
} from 'recharts';

const matchingSuggestions = [
    { id: 1, shift: 'Emergency Medicine Night Shift', facility: 'Beaumont Hospital', date: '10 Feb 20:00-08:00', locum: 'Dr. Rachel Martinez', matchScore: 94, reasons: ['Specialty match', 'Available', '15 min from facility', '4.7 rating'] },
    { id: 2, shift: 'Anesthesiology Day Shift', facility: 'University Hospital Galway', date: '11 Feb 07:00-19:00', locum: 'Dr. Emily Chen', matchScore: 91, reasons: ['Specialty match', 'Preferred locum', 'All compliance docs valid'] },
    { id: 3, shift: 'Pediatrics Day Shift', facility: 'Mater Hospital', date: '11 Feb 08:00-20:00', locum: 'Dr. Rachel Martinez', matchScore: 88, reasons: ['Specialty match', 'Available', 'Client preference', '96.3% completion'] },
    { id: 4, shift: 'General Surgery', facility: 'Galway Clinic', date: '13 Feb 08:00-16:00', locum: 'Dr. Sarah Mitchell', matchScore: 96, reasons: ['Perfect specialty match', 'Top performer', '99.3% completion rate', 'Client favorite'] },
];

const demandForecast = [
    { week: 'W7', emergency: 18, surgery: 12, cardiology: 8, pediatrics: 6, other: 10 },
    { week: 'W8', emergency: 22, surgery: 14, cardiology: 9, pediatrics: 7, other: 11 },
    { week: 'W9', emergency: 20, surgery: 15, cardiology: 8, pediatrics: 8, other: 12 },
    { week: 'W10', emergency: 25, surgery: 16, cardiology: 10, pediatrics: 9, other: 13 },
    { week: 'W11', emergency: 28, surgery: 18, cardiology: 11, pediatrics: 7, other: 14 },
    { week: 'W12', emergency: 24, surgery: 15, cardiology: 9, pediatrics: 10, other: 12 },
];

const complianceReminders = [
    { locum: 'Dr. David Thompson', document: 'Medical License', daysUntilExpiry: 3, action: 'Renewal reminder sent', autoSent: true },
    { locum: 'Dr. Rachel Martinez', document: 'CPR Training', daysUntilExpiry: 18, action: 'Scheduled for 25 Feb', autoSent: false },
    { locum: 'Dr. James Harrison', document: 'Garda Vetting', daysUntilExpiry: 45, action: 'Auto-reminder queued for Day 30', autoSent: false },
    { locum: 'Dr. Sarah Mitchell', document: 'Indemnity Insurance', daysUntilExpiry: 60, action: 'No action needed yet', autoSent: false },
];

const predictiveInsights = [
    { insight: 'Emergency Medicine demand expected to increase 25% next month due to seasonal trends', confidence: 87, category: 'demand', actionable: true },
    { insight: 'Dublin region will need 12 additional locums for March based on booking patterns', confidence: 82, category: 'staffing', actionable: true },
    { insight: 'Cork University Hospital likely to increase booking frequency by 20% based on contract renewal', confidence: 75, category: 'client', actionable: false },
    { insight: '3 locums at risk of churning based on decreased shift acceptance rates', confidence: 78, category: 'retention', actionable: true },
];

const autoScheduleResults = [
    { facility: "St. James's Hospital", shifts: 8, filled: 7, auto: 5, manual: 2, unfilled: 1 },
    { facility: 'Cork University Hospital', shifts: 6, filled: 5, auto: 4, manual: 1, unfilled: 1 },
    { facility: 'Beaumont Hospital', shifts: 5, filled: 4, auto: 3, manual: 1, unfilled: 1 },
    { facility: 'Mater Hospital', shifts: 4, filled: 4, auto: 3, manual: 1, unfilled: 0 },
    { facility: 'Galway Clinic', shifts: 3, filled: 3, auto: 2, manual: 1, unfilled: 0 },
];

export function AIAutomation() {
    const [activeTab, setActiveTab] = useState<'matching' | 'forecasting' | 'compliance' | 'scheduling'>('matching');

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className="text-[#1F2937] mb-0">AI & Automation</h2>
                    <p className="text-sm text-[#6B7280]">Smart locum matching, demand forecasting, automated workflows, and predictive analytics</p>
                </div>
            </div>

            {/* AI Stats */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: 'AI Matches This Week', value: '34', sub: '89% acceptance rate', icon: Brain, color: '#8B5CF6', bg: '#EDE9FE' },
                    { label: 'Auto-Scheduled Shifts', value: '17', sub: '65% of total fills', icon: Calendar, color: '#10B981', bg: '#D1FAE5' },
                    { label: 'Compliance Reminders', value: '12', sub: 'Sent automatically', icon: Shield, color: '#3B82F6', bg: '#DBEAFE' },
                    { label: 'Time Saved', value: '48h', sub: 'This month vs manual', icon: Clock, color: '#F59E0B', bg: '#FEF3C7' },
                ].map(s => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: s.bg }}>
                                    <Icon className="w-5 h-5" style={{ color: s.color }} />
                                </div>
                                <div>
                                    <p className="text-xs text-[#9CA3AF]">{s.label}</p>
                                    <p className="text-xl text-[#1F2937]" style={{ fontWeight: 700 }}>{s.value}</p>
                                    <p className="text-[11px] text-[#10B981]">{s.sub}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-[#E5E7EB]">
                <div className="border-b border-[#E5E7EB] px-5">
                    <div className="flex gap-6">
                        {[
                            { id: 'matching' as const, label: 'Smart Matching', icon: Brain },
                            { id: 'forecasting' as const, label: 'Demand Forecasting', icon: TrendingUp },
                            { id: 'compliance' as const, label: 'Auto Compliance', icon: Shield },
                            { id: 'scheduling' as const, label: 'Auto Scheduling', icon: Calendar },
                        ].map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-3 text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === tab.id ? 'border-[#8B5CF6] text-[#8B5CF6]' : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'}`}
                                    style={{ fontWeight: activeTab === tab.id ? 600 : 400 }}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Smart Matching Tab */}
                {activeTab === 'matching' && (
                    <div className="p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-[#1F2937]">AI-Suggested Matches</h4>
                                <p className="text-xs text-[#9CA3AF]">Best locum-to-shift matches based on specialty, location, performance, and availability</p>
                            </div>
                            <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#8B5CF6] border border-[#8B5CF6] rounded-lg hover:bg-[#EDE9FE]">
                                <RefreshCw className="w-4 h-4" /> Refresh Matches
                            </button>
                        </div>
                        <div className="space-y-3">
                            {matchingSuggestions.map(match => (
                                <div key={match.id} className="border border-[#E5E7EB] rounded-xl p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="text-sm text-[#1F2937]">{match.shift}</h4>
                                                <ArrowRight className="w-4 h-4 text-[#9CA3AF]" />
                                                <span className="text-sm text-[#8B5CF6]" style={{ fontWeight: 600 }}>{match.locum}</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {match.facility}</span>
                                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {match.date}</span>
                                            </div>
                                            <div className="flex gap-2 mt-2">
                                                {match.reasons.map((r, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-[#F3F4F6] text-[#6B7280] text-[10px] rounded-full">{r}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-center">
                                                <div className="w-14 h-14 rounded-full border-3 flex items-center justify-center" style={{ borderColor: match.matchScore >= 90 ? '#10B981' : '#F59E0B', borderWidth: '3px' }}>
                                                    <span className="text-sm" style={{ fontWeight: 700, color: match.matchScore >= 90 ? '#10B981' : '#F59E0B' }}>{match.matchScore}%</span>
                                                </div>
                                                <p className="text-[10px] text-[#9CA3AF] mt-1">Match Score</p>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <button className="px-3 py-1.5 text-xs bg-[#10B981] text-white rounded-lg hover:bg-[#059669]">Accept</button>
                                                <button className="px-3 py-1.5 text-xs border border-[#E5E7EB] text-[#6B7280] rounded-lg hover:bg-[#F9FAFB]">Skip</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Demand Forecasting Tab */}
                {activeTab === 'forecasting' && (
                    <div className="p-5 space-y-5">
                        <div>
                            <h4 className="text-[#1F2937] mb-1">Shift Demand Forecast</h4>
                            <p className="text-xs text-[#9CA3AF]">Predicted shift demand by specialty for the next 6 weeks</p>
                        </div>
                        <ResponsiveContainer width="100%" height={320}>
                            <AreaChart data={demandForecast}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                                <XAxis dataKey="week" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '12px' }} />
                                <Area type="monotone" dataKey="emergency" stackId="1" fill="#EF4444" stroke="#EF4444" fillOpacity={0.6} name="Emergency" />
                                <Area type="monotone" dataKey="surgery" stackId="1" fill="#10B981" stroke="#10B981" fillOpacity={0.6} name="Surgery" />
                                <Area type="monotone" dataKey="cardiology" stackId="1" fill="#3B82F6" stroke="#3B82F6" fillOpacity={0.6} name="Cardiology" />
                                <Area type="monotone" dataKey="pediatrics" stackId="1" fill="#F59E0B" stroke="#F59E0B" fillOpacity={0.6} name="Pediatrics" />
                                <Area type="monotone" dataKey="other" stackId="1" fill="#8B5CF6" stroke="#8B5CF6" fillOpacity={0.6} name="Other" />
                            </AreaChart>
                        </ResponsiveContainer>

                        <div>
                            <h4 className="text-[#1F2937] mb-3">Predictive Insights</h4>
                            <div className="space-y-2">
                                {predictiveInsights.map((insight, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 bg-[#F9FAFB] rounded-lg">
                                        <Sparkles className="w-4 h-4 text-[#8B5CF6] mt-0.5 shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-sm text-[#1F2937]">{insight.insight}</p>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                <span className="text-[11px] text-[#9CA3AF]">Confidence: {insight.confidence}%</span>
                                                <span className={`text-[11px] px-2 py-0.5 rounded-full ${insight.category === 'demand' ? 'bg-[#DBEAFE] text-[#1D4ED8]' :
                                                        insight.category === 'staffing' ? 'bg-[#D1FAE5] text-[#059669]' :
                                                            insight.category === 'client' ? 'bg-[#FEF3C7] text-[#92400E]' :
                                                                'bg-[#FEE2E2] text-[#DC2626]'
                                                    }`}>{insight.category}</span>
                                                {insight.actionable && (
                                                    <button className="text-[11px] text-[#8B5CF6] hover:underline">Take Action</button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Auto Compliance Tab */}
                {activeTab === 'compliance' && (
                    <div className="p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-[#1F2937]">Automated Compliance Reminders</h4>
                                <p className="text-xs text-[#9CA3AF]">System-managed document expiry tracking and renewal reminders</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-[#10B981] flex items-center gap-1">
                                    <CheckCircle className="w-3.5 h-3.5" /> Auto-reminders active
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="p-4 bg-[#F0FDF4] rounded-lg border border-[#A7F3D0]">
                                <p className="text-xs text-[#065F46]">Automation Rules Active</p>
                                <p className="text-xl text-[#065F46] mt-1" style={{ fontWeight: 700 }}>8</p>
                            </div>
                            <div className="p-4 bg-[#EFF6FF] rounded-lg border border-[#BFDBFE]">
                                <p className="text-xs text-[#1E40AF]">Reminders Sent This Month</p>
                                <p className="text-xl text-[#1E40AF] mt-1" style={{ fontWeight: 700 }}>24</p>
                            </div>
                            <div className="p-4 bg-[#FDF4FF] rounded-lg border border-[#E9D5FF]">
                                <p className="text-xs text-[#6B21A8]">Documents Auto-Verified</p>
                                <p className="text-xl text-[#6B21A8] mt-1" style={{ fontWeight: 700 }}>15</p>
                            </div>
                        </div>

                        <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                                        {['Locum', 'Document', 'Days Until Expiry', 'Automated Action', 'Status'].map(h => (
                                            <th key={h} className="px-4 py-2.5 text-left text-xs text-[#9CA3AF]" style={{ fontWeight: 500 }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {complianceReminders.map((r, i) => (
                                        <tr key={i} className="border-b border-[#F3F4F6]">
                                            <td className="px-4 py-3 text-sm text-[#1F2937]">{r.locum}</td>
                                            <td className="px-4 py-3 text-xs text-[#6B7280]">{r.document}</td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs ${r.daysUntilExpiry <= 7 ? 'text-[#DC2626]' : r.daysUntilExpiry <= 30 ? 'text-[#F59E0B]' : 'text-[#10B981]'}`} style={{ fontWeight: 600 }}>
                                                    {r.daysUntilExpiry} days
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-[#6B7280]">{r.action}</td>
                                            <td className="px-4 py-3">
                                                {r.autoSent ? (
                                                    <span className="flex items-center gap-1 text-xs text-[#10B981]"><CheckCircle className="w-3.5 h-3.5" /> Sent</span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-xs text-[#9CA3AF]"><Clock className="w-3.5 h-3.5" /> Queued</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Auto Scheduling Tab */}
                {activeTab === 'scheduling' && (
                    <div className="p-5 space-y-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-[#1F2937]">Automated Scheduling Results</h4>
                                <p className="text-xs text-[#9CA3AF]">AI-powered shift auto-assignment performance this week</p>
                            </div>
                            <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white rounded-lg hover:opacity-90">
                                <Zap className="w-4 h-4" /> Run Auto-Schedule
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-[#F0FDF4] rounded-lg border border-[#A7F3D0]">
                                <p className="text-xs text-[#065F46]">Auto-Fill Success Rate</p>
                                <p className="text-2xl text-[#065F46] mt-1" style={{ fontWeight: 700 }}>65%</p>
                                <p className="text-[11px] text-[#059669]">17 of 26 shifts auto-filled</p>
                            </div>
                            <div className="p-4 bg-[#EFF6FF] rounded-lg border border-[#BFDBFE]">
                                <p className="text-xs text-[#1E40AF]">Average Match Score</p>
                                <p className="text-2xl text-[#1E40AF] mt-1" style={{ fontWeight: 700 }}>89.2%</p>
                                <p className="text-[11px] text-[#3B82F6]">Above 85% threshold</p>
                            </div>
                            <div className="p-4 bg-[#FEF3C7] rounded-lg border border-[#FDE68A]">
                                <p className="text-xs text-[#92400E]">Manual Review Needed</p>
                                <p className="text-2xl text-[#92400E] mt-1" style={{ fontWeight: 700 }}>3</p>
                                <p className="text-[11px] text-[#D97706]">Low match confidence</p>
                            </div>
                        </div>

                        <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                                        {['Facility', 'Total Shifts', 'Filled', 'Auto-Filled', 'Manual', 'Unfilled'].map(h => (
                                            <th key={h} className="px-4 py-2.5 text-left text-xs text-[#9CA3AF]" style={{ fontWeight: 500 }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {autoScheduleResults.map((r, i) => (
                                        <tr key={i} className="border-b border-[#F3F4F6]">
                                            <td className="px-4 py-3 text-sm text-[#1F2937]">{r.facility}</td>
                                            <td className="px-4 py-3 text-sm text-[#1F2937]" style={{ fontWeight: 500 }}>{r.shifts}</td>
                                            <td className="px-4 py-3 text-sm text-[#10B981]">{r.filled}</td>
                                            <td className="px-4 py-3">
                                                <span className="px-2 py-0.5 bg-[#EDE9FE] text-[#7C3AED] text-xs rounded-full">{r.auto} AI</span>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-[#6B7280]">{r.manual}</td>
                                            <td className="px-4 py-3">
                                                {r.unfilled > 0 ? (
                                                    <span className="text-xs text-[#DC2626]" style={{ fontWeight: 500 }}>{r.unfilled}</span>
                                                ) : (
                                                    <CheckCircle className="w-4 h-4 text-[#10B981]" />
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
