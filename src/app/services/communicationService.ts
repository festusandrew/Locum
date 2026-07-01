import { Notification, EmailLog } from '../types';

const NOTIFICATIONS_KEY = 'mployus_notifications';
const EMAIL_LOGS_KEY = 'mployus_email_logs';

const defaultNotifications: Notification[] = [
    { id: '1', title: 'Urgent Shift Unfilled', message: 'Emergency Medicine night shift at Beaumont Hospital still needs coverage.', time: '1 hour ago', type: 'shift', read: false },
    { id: '2', title: 'Compliance Alert', message: "Dr. David Thompson's Medical License expires in 3 days.", time: '2 hours ago', type: 'compliance', read: false },
    { id: '3', title: 'Booking Confirmed', message: 'Dr. Sarah Mitchell confirmed for St. James\'s Hospital, 10 Feb 08:00-16:00.', time: '3 hours ago', type: 'booking', read: true },
    { id: '4', title: 'Payment Processed', message: '€2,173.60 paid to Dr. Sarah Mitchell for Feb 1-15 period.', time: '5 hours ago', type: 'payment', read: true },
    { id: '5', title: 'New Shift Request', message: 'Galway Clinic requests 2 locums for General Surgery, 14-15 Feb.', time: '6 hours ago', type: 'shift', read: false },
    { id: '6', title: 'Timesheet Submitted', message: 'Dr. David Thompson submitted timesheet TS-2026-006 for review.', time: 'Yesterday', type: 'booking', read: true },
];

const defaultEmailLogs: EmailLog[] = [
    { id: '1', recipient: 'All Active Locums (892)', subject: 'Weekly Shift Availability Update', type: 'email', sentAt: '2026-02-10 08:00', status: 'delivered', template: 'Weekly Broadcast' },
    { id: '2', recipient: 'Dr. Sarah Mitchell', subject: 'Shift Confirmation - St. James\'s Hospital', type: 'email', sentAt: '2026-02-09 14:30', status: 'opened' },
    { id: '3', recipient: 'Dr. David Thompson', subject: 'Compliance Reminder: Medical License Expiring', type: 'sms', sentAt: '2026-02-09 10:00', status: 'delivered' },
    { id: '4', recipient: 'Cork University Hospital', subject: 'Invoice INV-2026-044', type: 'email', sentAt: '2026-02-08 09:00', status: 'opened' },
    { id: '5', recipient: 'Dr. Emily Chen', subject: 'Garda Vetting Renewal Required', type: 'sms', sentAt: '2026-02-07 11:00', status: 'delivered' },
    { id: '6', recipient: 'All Dublin Locums (345)', subject: 'New Shifts Available - Beaumont Hospital', type: 'email', sentAt: '2026-02-07 08:00', status: 'delivered', template: 'Shift Alert' },
];

export const communicationService = {
    // ================= NOTIFICATIONS API =================
    getNotifications: async (): Promise<Notification[]> => {
        await new Promise(resolve => setTimeout(resolve, 50));
        const stored = localStorage.getItem(NOTIFICATIONS_KEY);
        if (!stored) {
            localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(defaultNotifications));
            return defaultNotifications;
        }
        return JSON.parse(stored);
    },

    saveAllNotifications: async (notifications: Notification[]): Promise<void> => {
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    },

    markAllNotificationsAsRead: async (): Promise<Notification[]> => {
        const notifications = await communicationService.getNotifications();
        const updated = notifications.map(n => ({ ...n, read: true }));
        await communicationService.saveAllNotifications(updated);
        return updated;
    },

    // ================= COMMUNICATIONS SENT LOGS API =================
    getEmailLogs: async (): Promise<EmailLog[]> => {
        await new Promise(resolve => setTimeout(resolve, 50));
        const stored = localStorage.getItem(EMAIL_LOGS_KEY);
        if (!stored) {
            localStorage.setItem(EMAIL_LOGS_KEY, JSON.stringify(defaultEmailLogs));
            return defaultEmailLogs;
        }
        return JSON.parse(stored);
    },

    saveAllEmailLogs: async (logs: EmailLog[]): Promise<void> => {
        localStorage.setItem(EMAIL_LOGS_KEY, JSON.stringify(logs));
    },

    sendBroadcast: async (broadcast: {
        type: 'email' | 'sms';
        recipientGroup: string;
        subject?: string;
        message: string;
        template?: string;
        recipientLabel: string;
    }): Promise<EmailLog> => {
        const logs = await communicationService.getEmailLogs();
        const newLog: EmailLog = {
            id: String(logs.length + 1),
            recipient: broadcast.recipientLabel,
            subject: broadcast.type === 'email' ? (broadcast.subject || 'Broadcast Message') : 'SMS Broadcast',
            type: broadcast.type,
            sentAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            status: 'delivered' as const,
            template: broadcast.template || 'Custom Broadcast'
        };
        logs.unshift(newLog); // prepend to show first in UI logs list
        await communicationService.saveAllEmailLogs(logs);
        return newLog;
    }
};
