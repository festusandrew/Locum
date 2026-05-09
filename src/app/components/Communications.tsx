import { useState } from 'react';
import {
    Bell, Mail, Megaphone, X, Send, Users, CheckCircle, Eye
} from 'lucide-react';

interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    type: 'shift' | 'compliance' | 'booking' | 'payment';
    read: boolean;
}

interface EmailLog {
    id: string;
    recipient: string;
    subject: string;
    type: 'email' | 'sms';
    sentAt: string;
    status: 'delivered' | 'opened' | 'failed' | 'bounced';
    template?: string;
}

const notifications: Notification[] = [
    { id: '1', title: 'Urgent Shift Unfilled', message: 'Emergency Medicine night shift at Beaumont Hospital still needs coverage.', time: '1 hour ago', type: 'shift', read: false },
    { id: '2', title: 'Compliance Alert', message: 'Dr. David Thompson\'s Medical License expires in 3 days.', time: '2 hours ago', type: 'compliance', read: false },
    { id: '3', title: 'Booking Confirmed', message: 'Dr. Sarah Mitchell confirmed for St. James\'s Hospital, 10 Feb 08:00-16:00.', time: '3 hours ago', type: 'booking', read: true },
    { id: '4', title: 'Payment Processed', message: '€2,173.60 paid to Dr. Sarah Mitchell for Feb 1-15 period.', time: '5 hours ago', type: 'payment', read: true },
    { id: '5', title: 'New Shift Request', message: 'Galway Clinic requests 2 locums for General Surgery, 14-15 Feb.', time: '6 hours ago', type: 'shift', read: false },
    { id: '6', title: 'Timesheet Submitted', message: 'Dr. David Thompson submitted timesheet TS-2026-006 for review.', time: 'Yesterday', type: 'booking', read: true },
];

const emailLogs: EmailLog[] = [
    { id: '1', recipient: 'All Active Locums (892)', subject: 'Weekly Shift Availability Update', type: 'email', sentAt: '2026-02-10 08:00', status: 'delivered', template: 'Weekly Broadcast' },
    { id: '2', recipient: 'Dr. Sarah Mitchell', subject: 'Shift Confirmation - St. James\'s Hospital', type: 'email', sentAt: '2026-02-09 14:30', status: 'opened' },
    { id: '3', recipient: 'Dr. David Thompson', subject: 'Compliance Reminder: Medical License Expiring', type: 'sms', sentAt: '2026-02-09 10:00', status: 'delivered' },
    { id: '4', recipient: 'Cork University Hospital', subject: 'Invoice INV-2026-044', type: 'email', sentAt: '2026-02-08 09:00', status: 'opened' },
    { id: '5', recipient: 'Dr. Emily Chen', subject: 'Garda Vetting Renewal Required', type: 'sms', sentAt: '2026-02-07 11:00', status: 'delivered' },
    { id: '6', recipient: 'All Dublin Locums (345)', subject: 'New Shifts Available - Beaumont Hospital', type: 'email', sentAt: '2026-02-07 08:00', status: 'delivered', template: 'Shift Alert' },
];

const typeColors: Record<string, string> = {
    shift: '#3B82F6',
    compliance: '#EF4444',
    booking: '#10B981',
    payment: '#8B5CF6',
};

export function Communications() {
    const [activeTab, setActiveTab] = useState<'notifications' | 'logs'>('notifications');
    const [showBroadcastModal, setShowBroadcastModal] = useState(false);
    const [broadcastForm, setBroadcastForm] = useState({
        type: 'email' as 'email' | 'sms',
        recipientGroup: 'all_locums',
        template: '',
        subject: '',
        message: '',
        scheduleSend: false,
        scheduleDate: '',
        scheduleTime: '',
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    const recipientGroups = [
        { value: 'all_locums', label: 'All Active Locums', count: 892 },
        { value: 'dublin_locums', label: 'Dublin Locums', count: 345 },
        { value: 'cork_locums', label: 'Cork Locums', count: 178 },
        { value: 'galway_locums', label: 'Galway Locums', count: 124 },
        { value: 'specialty_surgery', label: 'General Surgery Specialists', count: 156 },
        { value: 'specialty_emergency', label: 'Emergency Medicine Specialists', count: 203 },
        { value: 'specialty_anesthesia', label: 'Anesthesia Specialists', count: 98 },
        { value: 'all_clients', label: 'All Client Facilities', count: 47 },
        { value: 'compliance_expiring', label: 'Locums with Expiring Compliance', count: 23 },
    ];

    const emailTemplates = [
        { value: '', label: 'Custom Message (No Template)' },
        { value: 'shift_alert', label: 'Shift Alert Template' },
        { value: 'weekly_update', label: 'Weekly Availability Update' },
        { value: 'compliance_reminder', label: 'Compliance Reminder' },
        { value: 'payment_notification', label: 'Payment Notification' },
        { value: 'shift_confirmation', label: 'Shift Confirmation' },
    ];

    const smsTemplates = [
        { value: '', label: 'Custom Message (No Template)' },
        { value: 'urgent_shift', label: 'Urgent Shift Alert' },
        { value: 'compliance_urgent', label: 'Urgent Compliance Reminder' },
        { value: 'shift_reminder', label: 'Shift Reminder (24h)' },
        { value: 'payment_sent', label: 'Payment Sent Notification' },
    ];

    const getRecipientCount = () => {
        const group = recipientGroups.find(g => g.value === broadcastForm.recipientGroup);
        return group?.count || 0;
    };

    const handleSendBroadcast = () => {
        console.log('Sending broadcast:', broadcastForm);
        setShowBroadcastModal(false);
        // Reset form
        setBroadcastForm({
            type: 'email',
            recipientGroup: 'all_locums',
            template: '',
            subject: '',
            message: '',
            scheduleSend: false,
            scheduleDate: '',
            scheduleTime: '',
        });
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="text-[#1F2937] mb-1">Communications</h2>
                <p className="text-sm text-[#6B7280]">Manage system notifications and email/SMS communication logs</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-3">
                {[
                    { id: 'notifications' as const, label: 'Notifications', icon: Bell, badge: unreadCount },
                    { id: 'logs' as const, label: 'Email & SMS Logs', icon: Mail },
                ].map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${activeTab === tab.id
                                    ? 'bg-[#10B981] text-white'
                                    : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                            {tab.badge && tab.badge > 0 && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/25' : 'bg-[#EF4444] text-white'}`}>{tab.badge}</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
                <div className="bg-white rounded-xl border border-[#E5E7EB]">
                    <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
                        <h3 className="text-[#1F2937]">Notification Center</h3>
                        <button className="text-xs text-[#10B981] hover:underline">Mark all as read</button>
                    </div>
                    <div className="divide-y divide-[#F3F4F6]">
                        {notifications.map(n => (
                            <div key={n.id} className={`p-4 flex items-start gap-3 hover:bg-[#F9FAFB] ${!n.read ? 'bg-[#F0FDF4]' : ''}`}>
                                <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: !n.read ? typeColors[n.type] : '#E5E7EB' }} />
                                <div className="flex-1">
                                    <p className="text-sm text-[#1F2937]" style={{ fontWeight: !n.read ? 600 : 400 }}>{n.title}</p>
                                    <p className="text-xs text-[#6B7280] mt-0.5">{n.message}</p>
                                    <p className="text-[11px] text-[#9CA3AF] mt-1">{n.time}</p>
                                </div>
                                <span className="px-2 py-0.5 rounded text-[10px] border" style={{ color: typeColors[n.type], borderColor: typeColors[n.type] + '40', backgroundColor: typeColors[n.type] + '10' }}>
                                    {n.type}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Email & SMS Logs Tab */}
            {activeTab === 'logs' && (
                <div className="bg-white rounded-xl border border-[#E5E7EB]">
                    <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
                        <h3 className="text-[#1F2937]">Sent Communications</h3>
                        <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[#10B981] text-white rounded-lg hover:bg-[#059669]" onClick={() => setShowBroadcastModal(true)}>
                            <Megaphone className="w-4 h-4" /> New Broadcast
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#E5E7EB]">
                                    {['Type', 'Recipient', 'Subject', 'Template', 'Sent At', 'Status'].map(h => (
                                        <th key={h} className="px-4 py-2.5 text-left text-xs text-[#9CA3AF]" style={{ fontWeight: 500 }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {emailLogs.map(log => (
                                    <tr key={log.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-[11px] ${log.type === 'email' ? 'bg-[#DBEAFE] text-[#1D4ED8]' : 'bg-[#EDE9FE] text-[#7C3AED]'}`}>
                                                {log.type.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-[#1F2937]">{log.recipient}</td>
                                        <td className="px-4 py-3 text-xs text-[#6B7280]">{log.subject}</td>
                                        <td className="px-4 py-3 text-xs text-[#9CA3AF]">{log.template || '-'}</td>
                                        <td className="px-4 py-3 text-xs text-[#6B7280]">{log.sentAt}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-[11px] border ${log.status === 'delivered' ? 'bg-[#D1FAE5] text-[#059669] border-[#A7F3D0]' :
                                                    log.status === 'opened' ? 'bg-[#DBEAFE] text-[#1D4ED8] border-[#BFDBFE]' :
                                                        log.status === 'failed' ? 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]' :
                                                            'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]'
                                                }`}>
                                                {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Broadcast Modal */}
            {showBroadcastModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
                    <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between sticky top-0 bg-white z-10">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-[#ECFDF5] rounded-lg flex items-center justify-center">
                                    <Megaphone className="w-4 h-4 text-[#10B981]" />
                                </div>
                                <h3 className="text-[#1F2937]" style={{ fontWeight: 600 }}>New Broadcast Message</h3>
                            </div>
                            <button onClick={() => setShowBroadcastModal(false)} className="p-2 hover:bg-[#F3F4F6] rounded-lg">
                                <X className="w-5 h-5 text-[#6B7280]" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Communication Type */}
                            <div>
                                <label className="block text-sm text-[#1F2937] mb-2" style={{ fontWeight: 500 }}>Communication Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setBroadcastForm({ ...broadcastForm, type: 'email' })}
                                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${broadcastForm.type === 'email'
                                                ? 'border-[#10B981] bg-[#ECFDF5] text-[#10B981]'
                                                : 'border-[#E5E7EB] bg-white text-[#6B7280] hover:border-[#D1D5DB]'
                                            }`}
                                    >
                                        <Mail className="w-4 h-4" />
                                        <span className="text-sm" style={{ fontWeight: 500 }}>Email</span>
                                    </button>
                                    <button
                                        onClick={() => setBroadcastForm({ ...broadcastForm, type: 'sms' })}
                                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${broadcastForm.type === 'sms'
                                                ? 'border-[#10B981] bg-[#ECFDF5] text-[#10B981]'
                                                : 'border-[#E5E7EB] bg-white text-[#6B7280] hover:border-[#D1D5DB]'
                                            }`}
                                    >
                                        <Send className="w-4 h-4" />
                                        <span className="text-sm" style={{ fontWeight: 500 }}>SMS</span>
                                    </button>
                                </div>
                            </div>

                            {/* Recipient Group */}
                            <div>
                                <label className="block text-sm text-[#1F2937] mb-2" style={{ fontWeight: 500 }}>
                                    Recipient Group <span className="text-[#EF4444]">*</span>
                                </label>
                                <select
                                    className="w-full px-3 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                    value={broadcastForm.recipientGroup}
                                    onChange={(e) => setBroadcastForm({ ...broadcastForm, recipientGroup: e.target.value })}
                                >
                                    {recipientGroups.map(group => (
                                        <option key={group.value} value={group.value}>
                                            {group.label} ({group.count})
                                        </option>
                                    ))}
                                </select>
                                <div className="mt-2 flex items-center gap-1.5 text-xs text-[#6B7280]">
                                    <Users className="w-3.5 h-3.5" />
                                    <span>Will be sent to <strong>{getRecipientCount()}</strong> recipients</span>
                                </div>
                            </div>

                            {/* Template Selection */}
                            <div>
                                <label className="block text-sm text-[#1F2937] mb-2" style={{ fontWeight: 500 }}>Message Template</label>
                                <select
                                    className="w-full px-3 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                    value={broadcastForm.template}
                                    onChange={(e) => setBroadcastForm({ ...broadcastForm, template: e.target.value })}
                                >
                                    {(broadcastForm.type === 'email' ? emailTemplates : smsTemplates).map(template => (
                                        <option key={template.value} value={template.value}>
                                            {template.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Subject (Email only) */}
                            {broadcastForm.type === 'email' && (
                                <div>
                                    <label className="block text-sm text-[#1F2937] mb-2" style={{ fontWeight: 500 }}>
                                        Subject Line <span className="text-[#EF4444]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter email subject..."
                                        className="w-full px-3 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                        value={broadcastForm.subject}
                                        onChange={(e) => setBroadcastForm({ ...broadcastForm, subject: e.target.value })}
                                    />
                                </div>
                            )}

                            {/* Message Content */}
                            <div>
                                <label className="block text-sm text-[#1F2937] mb-2" style={{ fontWeight: 500 }}>
                                    Message Content <span className="text-[#EF4444]">*</span>
                                </label>
                                <textarea
                                    rows={broadcastForm.type === 'email' ? 8 : 4}
                                    placeholder={broadcastForm.type === 'email' ? 'Enter your email message...' : 'Enter your SMS message (160 characters max)...'}
                                    className="w-full px-3 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                    value={broadcastForm.message}
                                    onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                                    maxLength={broadcastForm.type === 'sms' ? 160 : undefined}
                                />
                                {broadcastForm.type === 'sms' && (
                                    <div className="mt-1 flex items-center justify-between text-xs">
                                        <span className="text-[#6B7280]">SMS messages are limited to 160 characters</span>
                                        <span className={`${broadcastForm.message.length > 160 ? 'text-[#EF4444]' : 'text-[#6B7280]'}`}>
                                            {broadcastForm.message.length} / 160
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Schedule Send */}
                            <div className="border border-[#E5E7EB] rounded-lg p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <input
                                        type="checkbox"
                                        id="scheduleSend"
                                        className="w-4 h-4 text-[#10B981] border-[#E5E7EB] rounded focus:ring-[#10B981]"
                                        checked={broadcastForm.scheduleSend}
                                        onChange={(e) => setBroadcastForm({ ...broadcastForm, scheduleSend: e.target.checked })}
                                    />
                                    <label htmlFor="scheduleSend" className="text-sm text-[#1F2937]" style={{ fontWeight: 500 }}>
                                        Schedule for later
                                    </label>
                                </div>
                                {broadcastForm.scheduleSend && (
                                    <div className="grid grid-cols-2 gap-3 pl-7">
                                        <div>
                                            <label className="block text-xs text-[#6B7280] mb-1">Date</label>
                                            <input
                                                type="date"
                                                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                                value={broadcastForm.scheduleDate}
                                                onChange={(e) => setBroadcastForm({ ...broadcastForm, scheduleDate: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#6B7280] mb-1">Time</label>
                                            <input
                                                type="time"
                                                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                                value={broadcastForm.scheduleTime}
                                                onChange={(e) => setBroadcastForm({ ...broadcastForm, scheduleTime: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Preview Summary */}
                            <div className="bg-[#F9FAFB] rounded-lg p-4 border border-[#E5E7EB]">
                                <div className="flex items-center gap-2 mb-3">
                                    <Eye className="w-4 h-4 text-[#6B7280]" />
                                    <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>Broadcast Summary</h4>
                                </div>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-[#6B7280]">Type:</span>
                                        <span className="text-[#1F2937]" style={{ fontWeight: 500 }}>{broadcastForm.type.toUpperCase()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#6B7280]">Recipients:</span>
                                        <span className="text-[#1F2937]" style={{ fontWeight: 500 }}>{getRecipientCount()} people</span>
                                    </div>
                                    {broadcastForm.template && (
                                        <div className="flex justify-between">
                                            <span className="text-[#6B7280]">Template:</span>
                                            <span className="text-[#1F2937]" style={{ fontWeight: 500 }}>
                                                {(broadcastForm.type === 'email' ? emailTemplates : smsTemplates).find(t => t.value === broadcastForm.template)?.label}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-[#6B7280]">Send Time:</span>
                                        <span className="text-[#1F2937]" style={{ fontWeight: 500 }}>
                                            {broadcastForm.scheduleSend
                                                ? `${broadcastForm.scheduleDate || 'Not set'} at ${broadcastForm.scheduleTime || 'Not set'}`
                                                : 'Immediately'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-5 border-t border-[#E5E7EB] flex justify-between items-center sticky bottom-0 bg-white">
                            <button
                                onClick={() => setShowBroadcastModal(false)}
                                className="px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg text-sm hover:bg-[#F9FAFB]"
                            >
                                Cancel
                            </button>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg text-sm hover:bg-[#F9FAFB]">
                                    Save as Draft
                                </button>
                                <button
                                    onClick={handleSendBroadcast}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#10B981] text-white rounded-lg text-sm hover:bg-[#059669]"
                                >
                                    <Send className="w-4 h-4" />
                                    {broadcastForm.scheduleSend ? 'Schedule Broadcast' : 'Send Now'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}