import {
    Bell,
    BellRing,
    Check,
    X,
    Search,
    Filter,
    Archive,
    Trash2,
    Settings,
    AlertCircle,
    CheckCircle,
    Info,
    DollarSign,
    Calendar,
    Users,
    FileText,
    Clock,
    MoreVertical,
    Mail,
    Smartphone,
    BellOff,
    Volume2
} from 'lucide-react';
import { useState } from 'react';

interface Notification {
    id: string;
    type: 'system' | 'shift' | 'compliance' | 'payment' | 'locum' | 'alert';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    actionUrl?: string;
}

const notifications: Notification[] = [
    {
        id: '1',
        type: 'alert',
        title: 'Urgent: Shift Coverage Needed',
        message: 'Emergency shift at St. James\'s Hospital requires immediate coverage for tonight (19:00-07:00)',
        timestamp: '2024-12-11T10:15:00',
        read: false,
        priority: 'urgent'
    },
    {
        id: '2',
        type: 'compliance',
        title: 'Document Expiring Soon',
        message: 'Dr. Sarah Mitchell\'s Medical Council registration expires in 15 days',
        timestamp: '2024-12-11T09:30:00',
        read: false,
        priority: 'high'
    },
    {
        id: '3',
        type: 'shift',
        title: 'Shift Confirmed',
        message: 'Dr. James Harrison confirmed for Thursday 14 Dec at Cork University Hospital',
        timestamp: '2024-12-11T08:45:00',
        read: true,
        priority: 'medium'
    },
    {
        id: '4',
        type: 'payment',
        title: 'Payment Processed',
        message: 'Weekly payment batch of €45,280 processed successfully to 23 locums',
        timestamp: '2024-12-11T08:00:00',
        read: true,
        priority: 'medium'
    },
    {
        id: '5',
        type: 'locum',
        title: 'New Locum Registration',
        message: 'Dr. Rachel O\'Brien has registered and uploaded all compliance documents',
        timestamp: '2024-12-10T16:20:00',
        read: true,
        priority: 'low'
    },
    {
        id: '6',
        type: 'system',
        title: 'System Maintenance Scheduled',
        message: 'Platform maintenance scheduled for Sunday 15 Dec, 02:00-04:00 GMT',
        timestamp: '2024-12-10T14:30:00',
        read: false,
        priority: 'medium'
    },
    {
        id: '7',
        type: 'compliance',
        title: 'Compliance Documents Pending',
        message: '3 locums have pending document verifications requiring your review',
        timestamp: '2024-12-10T12:15:00',
        read: true,
        priority: 'high'
    },
    {
        id: '8',
        type: 'shift',
        title: 'Shift Cancellation',
        message: 'Shift cancelled by facility: Wednesday 13 Dec at University Hospital Galway',
        timestamp: '2024-12-10T11:00:00',
        read: true,
        priority: 'medium'
    },
    {
        id: '9',
        type: 'payment',
        title: 'Invoice Generated',
        message: 'Monthly invoice #INV-2024-12 generated for December billing cycle',
        timestamp: '2024-12-10T09:00:00',
        read: true,
        priority: 'low'
    },
    {
        id: '10',
        type: 'system',
        title: 'New Feature Available',
        message: 'Enhanced reporting dashboard with new analytics tools is now live',
        timestamp: '2024-12-09T15:45:00',
        read: true,
        priority: 'low'
    }
];

export function Notifications() {
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'system' | 'shift' | 'compliance' | 'payment' | 'locum' | 'alert'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [notificationsList, setNotificationsList] = useState(notifications);
    const [showSettings, setShowSettings] = useState(false);

    // Notification Preferences State
    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        shiftUpdates: true,
        complianceAlerts: true,
        paymentNotifications: true,
        locumRegistration: true,
        systemUpdates: false,
        urgentOnly: false,
        doNotDisturb: false,
        quietHoursStart: '22:00',
        quietHoursEnd: '08:00'
    });

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'system':
                return <Info className="w-5 h-5 text-[#3B82F6]" />;
            case 'shift':
                return <Calendar className="w-5 h-5 text-[#8B5CF6]" />;
            case 'compliance':
                return <FileText className="w-5 h-5 text-[#F59E0B]" />;
            case 'payment':
                return <DollarSign className="w-5 h-5 text-[#10B981]" />;
            case 'locum':
                return <Users className="w-5 h-5 text-[#6366F1]" />;
            case 'alert':
                return <AlertCircle className="w-5 h-5 text-[#EF4444]" />;
            default:
                return <Bell className="w-5 h-5 text-[#6B7280]" />;
        }
    };

    const getNotificationBgColor = (type: string) => {
        switch (type) {
            case 'system':
                return 'bg-[#DBEAFE]';
            case 'shift':
                return 'bg-[#EDE9FE]';
            case 'compliance':
                return 'bg-[#FEF3C7]';
            case 'payment':
                return 'bg-[#D1FAE5]';
            case 'locum':
                return 'bg-[#E0E7FF]';
            case 'alert':
                return 'bg-[#FEE2E2]';
            default:
                return 'bg-[#F3F4F6]';
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'urgent':
                return 'bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5]';
            case 'high':
                return 'bg-[#FED7AA] text-[#C2410C] border-[#FDBA74]';
            case 'medium':
                return 'bg-[#FEF3C7] text-[#D97706] border-[#FDE047]';
            case 'low':
                return 'bg-[#E0E7FF] text-[#6366F1] border-[#C7D2FE]';
            default:
                return 'bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]';
        }
    };

    const getTimeAgo = (timestamp: string) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diffMs = now.getTime() - time.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return time.toLocaleDateString('en-IE');
    };

    const filteredNotifications = notificationsList.filter(notif => {
        // Filter by type
        if (selectedFilter !== 'all') {
            if (selectedFilter === 'unread' && notif.read) return false;
            if (selectedFilter !== 'unread' && notif.type !== selectedFilter) return false;
        }

        // Filter by search
        if (searchQuery && !notif.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !notif.message.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        return true;
    });

    const unreadCount = notificationsList.filter(n => !n.read).length;

    const handleMarkAsRead = (id: string) => {
        setNotificationsList(notificationsList.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const handleMarkAllAsRead = () => {
        setNotificationsList(notificationsList.map(n => ({ ...n, read: true })));
    };

    const handleDelete = (id: string) => {
        setNotificationsList(notificationsList.filter(n => n.id !== id));
    };

    return (
        <div className="p-6">
            {/* Page Title */}
            <div className="mb-6">
                <h2 className="text-[#1F2937] mb-1">Notifications</h2>
                <p className="text-sm text-[#6B7280]">Stay updated with system alerts and activity</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-5 mb-6">
                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-[#FEE2E2] rounded-lg flex items-center justify-center">
                            <BellRing className="w-5 h-5 text-[#EF4444]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#1F2937]">{unreadCount}</p>
                        </div>
                    </div>
                    <p className="text-xs text-[#6B7280]">Unread Notifications</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-[#FEF3C7] rounded-lg flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-[#D97706]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#1F2937]">
                                {notificationsList.filter(n => n.priority === 'urgent' || n.priority === 'high').length}
                            </p>
                        </div>
                    </div>
                    <p className="text-xs text-[#6B7280]">High Priority</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-[#DBEAFE] rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-[#3B82F6]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#1F2937]">24h</p>
                        </div>
                    </div>
                    <p className="text-xs text-[#6B7280]">Recent Activity</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-[#D1FAE5] rounded-lg flex items-center justify-center">
                            <Settings className="w-5 h-5 text-[#10B981]" />
                        </div>
                        <div>
                            <button
                                onClick={() => setShowSettings(true)}
                                className="text-sm text-[#10B981] hover:underline"
                            >
                                Configure
                            </button>
                        </div>
                    </div>
                    <p className="text-xs text-[#6B7280]">Notification Settings</p>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-5">
                {/* Filters Sidebar */}
                <div className="col-span-1">
                    <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
                        <h3 className="text-sm font-medium text-[#1F2937] mb-3">Filter By</h3>
                        <div className="space-y-1">
                            <button
                                onClick={() => setSelectedFilter('all')}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedFilter === 'all'
                                        ? 'bg-[#10B981] text-white'
                                        : 'text-[#6B7280] hover:bg-[#F9FAFB]'
                                    }`}
                            >
                                All Notifications ({notificationsList.length})
                            </button>
                            <button
                                onClick={() => setSelectedFilter('unread')}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${selectedFilter === 'unread'
                                        ? 'bg-[#10B981] text-white'
                                        : 'text-[#6B7280] hover:bg-[#F9FAFB]'
                                    }`}
                            >
                                <span>Unread</span>
                                {unreadCount > 0 && (
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${selectedFilter === 'unread' ? 'bg-white text-[#10B981]' : 'bg-[#FEE2E2] text-[#EF4444]'
                                        }`}>
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                            <div className="pt-2 mt-2 border-t border-[#E5E7EB]">
                                <p className="text-xs text-[#6B7280] mb-2 px-3">By Type</p>
                                <button
                                    onClick={() => setSelectedFilter('alert')}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedFilter === 'alert'
                                            ? 'bg-[#10B981] text-white'
                                            : 'text-[#6B7280] hover:bg-[#F9FAFB]'
                                        }`}
                                >
                                    Alerts ({notificationsList.filter(n => n.type === 'alert').length})
                                </button>
                                <button
                                    onClick={() => setSelectedFilter('compliance')}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedFilter === 'compliance'
                                            ? 'bg-[#10B981] text-white'
                                            : 'text-[#6B7280] hover:bg-[#F9FAFB]'
                                        }`}
                                >
                                    Compliance ({notificationsList.filter(n => n.type === 'compliance').length})
                                </button>
                                <button
                                    onClick={() => setSelectedFilter('shift')}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedFilter === 'shift'
                                            ? 'bg-[#10B981] text-white'
                                            : 'text-[#6B7280] hover:bg-[#F9FAFB]'
                                        }`}
                                >
                                    Shifts ({notificationsList.filter(n => n.type === 'shift').length})
                                </button>
                                <button
                                    onClick={() => setSelectedFilter('payment')}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedFilter === 'payment'
                                            ? 'bg-[#10B981] text-white'
                                            : 'text-[#6B7280] hover:bg-[#F9FAFB]'
                                        }`}
                                >
                                    Payments ({notificationsList.filter(n => n.type === 'payment').length})
                                </button>
                                <button
                                    onClick={() => setSelectedFilter('locum')}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedFilter === 'locum'
                                            ? 'bg-[#10B981] text-white'
                                            : 'text-[#6B7280] hover:bg-[#F9FAFB]'
                                        }`}
                                >
                                    Locums ({notificationsList.filter(n => n.type === 'locum').length})
                                </button>
                                <button
                                    onClick={() => setSelectedFilter('system')}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedFilter === 'system'
                                            ? 'bg-[#10B981] text-white'
                                            : 'text-[#6B7280] hover:bg-[#F9FAFB]'
                                        }`}
                                >
                                    System ({notificationsList.filter(n => n.type === 'system').length})
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="col-span-3">
                    <div className="bg-white rounded-xl border border-[#E5E7EB]">
                        {/* Header */}
                        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h3 className="text-[#1F2937]">
                                    {selectedFilter === 'all' && 'All Notifications'}
                                    {selectedFilter === 'unread' && 'Unread Notifications'}
                                    {selectedFilter === 'alert' && 'Alert Notifications'}
                                    {selectedFilter === 'compliance' && 'Compliance Notifications'}
                                    {selectedFilter === 'shift' && 'Shift Notifications'}
                                    {selectedFilter === 'payment' && 'Payment Notifications'}
                                    {selectedFilter === 'locum' && 'Locum Notifications'}
                                    {selectedFilter === 'system' && 'System Notifications'}
                                </h3>
                                <span className="px-2 py-1 bg-[#F3F4F6] text-[#6B7280] rounded text-xs">
                                    {filteredNotifications.length}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search notifications..."
                                        className="pl-10 pr-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                    />
                                </div>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllAsRead}
                                        className="px-3 py-2 text-sm text-[#10B981] hover:bg-[#F0FDF4] rounded-lg transition-colors"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="divide-y divide-[#F3F4F6]">
                            {filteredNotifications.length === 0 ? (
                                <div className="p-12 text-center">
                                    <BellOff className="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
                                    <p className="text-sm text-[#6B7280]">No notifications found</p>
                                </div>
                            ) : (
                                filteredNotifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 hover:bg-[#F9FAFB] transition-colors ${!notification.read ? 'bg-[#F0FDF4]' : ''
                                            }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`w-10 h-10 ${getNotificationBgColor(notification.type)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                                {getNotificationIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-medium text-[#1F2937]">{notification.title}</h4>
                                                        {!notification.read && (
                                                            <div className="w-2 h-2 bg-[#10B981] rounded-full" />
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-2 py-1 rounded text-xs border ${getPriorityBadge(notification.priority)}`}>
                                                            {notification.priority.toUpperCase()}
                                                        </span>
                                                        <button className="p-1 hover:bg-[#E5E7EB] rounded">
                                                            <MoreVertical className="w-4 h-4 text-[#6B7280]" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-[#6B7280] mb-2">{notification.message}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-[#9CA3AF]">{getTimeAgo(notification.timestamp)}</span>
                                                    <div className="flex items-center gap-2">
                                                        {!notification.read && (
                                                            <button
                                                                onClick={() => handleMarkAsRead(notification.id)}
                                                                className="px-2 py-1 text-xs text-[#10B981] hover:bg-[#D1FAE5] rounded flex items-center gap-1"
                                                            >
                                                                <Check className="w-3 h-3" />
                                                                Mark as read
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDelete(notification.id)}
                                                            className="px-2 py-1 text-xs text-[#EF4444] hover:bg-[#FEE2E2] rounded flex items-center gap-1"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Settings Dialog */}
            {showSettings && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-[700px] max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-[#1F2937]">Notification Settings</h3>
                                <p className="text-sm text-[#6B7280]">Manage how you receive notifications</p>
                            </div>
                            <button
                                onClick={() => setShowSettings(false)}
                                className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Notification Channels */}
                        <div className="mb-6 pb-6 border-b border-[#E5E7EB]">
                            <h4 className="text-sm font-medium text-[#1F2937] mb-4">Notification Channels</h4>
                            <div className="space-y-3">
                                <label className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-lg cursor-pointer hover:bg-[#F9FAFB]">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-[#6B7280]" />
                                        <div>
                                            <p className="text-sm font-medium text-[#1F2937]">Email Notifications</p>
                                            <p className="text-xs text-[#6B7280]">Receive notifications via email</p>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={preferences.emailNotifications}
                                        onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                                        className="w-5 h-5 text-[#10B981] border-[#E5E7EB] rounded"
                                    />
                                </label>

                                <label className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-lg cursor-pointer hover:bg-[#F9FAFB]">
                                    <div className="flex items-center gap-3">
                                        <Bell className="w-5 h-5 text-[#6B7280]" />
                                        <div>
                                            <p className="text-sm font-medium text-[#1F2937]">Push Notifications</p>
                                            <p className="text-xs text-[#6B7280]">Receive browser push notifications</p>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={preferences.pushNotifications}
                                        onChange={(e) => setPreferences({ ...preferences, pushNotifications: e.target.checked })}
                                        className="w-5 h-5 text-[#10B981] border-[#E5E7EB] rounded"
                                    />
                                </label>

                                <label className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-lg cursor-pointer hover:bg-[#F9FAFB]">
                                    <div className="flex items-center gap-3">
                                        <Smartphone className="w-5 h-5 text-[#6B7280]" />
                                        <div>
                                            <p className="text-sm font-medium text-[#1F2937]">SMS Notifications</p>
                                            <p className="text-xs text-[#6B7280]">Receive notifications via SMS</p>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={preferences.smsNotifications}
                                        onChange={(e) => setPreferences({ ...preferences, smsNotifications: e.target.checked })}
                                        className="w-5 h-5 text-[#10B981] border-[#E5E7EB] rounded"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Notification Types */}
                        <div className="mb-6 pb-6 border-b border-[#E5E7EB]">
                            <h4 className="text-sm font-medium text-[#1F2937] mb-4">Notification Types</h4>
                            <div className="space-y-2">
                                <label className="flex items-center justify-between py-2 cursor-pointer">
                                    <span className="text-sm text-[#1F2937]">Shift updates and changes</span>
                                    <input
                                        type="checkbox"
                                        checked={preferences.shiftUpdates}
                                        onChange={(e) => setPreferences({ ...preferences, shiftUpdates: e.target.checked })}
                                        className="w-5 h-5 text-[#10B981] border-[#E5E7EB] rounded"
                                    />
                                </label>
                                <label className="flex items-center justify-between py-2 cursor-pointer">
                                    <span className="text-sm text-[#1F2937]">Compliance alerts and expiring documents</span>
                                    <input
                                        type="checkbox"
                                        checked={preferences.complianceAlerts}
                                        onChange={(e) => setPreferences({ ...preferences, complianceAlerts: e.target.checked })}
                                        className="w-5 h-5 text-[#10B981] border-[#E5E7EB] rounded"
                                    />
                                </label>
                                <label className="flex items-center justify-between py-2 cursor-pointer">
                                    <span className="text-sm text-[#1F2937]">Payment processing and invoices</span>
                                    <input
                                        type="checkbox"
                                        checked={preferences.paymentNotifications}
                                        onChange={(e) => setPreferences({ ...preferences, paymentNotifications: e.target.checked })}
                                        className="w-5 h-5 text-[#10B981] border-[#E5E7EB] rounded"
                                    />
                                </label>
                                <label className="flex items-center justify-between py-2 cursor-pointer">
                                    <span className="text-sm text-[#1F2937]">New locum registrations</span>
                                    <input
                                        type="checkbox"
                                        checked={preferences.locumRegistration}
                                        onChange={(e) => setPreferences({ ...preferences, locumRegistration: e.target.checked })}
                                        className="w-5 h-5 text-[#10B981] border-[#E5E7EB] rounded"
                                    />
                                </label>
                                <label className="flex items-center justify-between py-2 cursor-pointer">
                                    <span className="text-sm text-[#1F2937]">System updates and maintenance</span>
                                    <input
                                        type="checkbox"
                                        checked={preferences.systemUpdates}
                                        onChange={(e) => setPreferences({ ...preferences, systemUpdates: e.target.checked })}
                                        className="w-5 h-5 text-[#10B981] border-[#E5E7EB] rounded"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Advanced Settings */}
                        <div className="mb-6">
                            <h4 className="text-sm font-medium text-[#1F2937] mb-4">Advanced Settings</h4>
                            <div className="space-y-3">
                                <label className="flex items-center justify-between py-2 cursor-pointer">
                                    <div>
                                        <p className="text-sm text-[#1F2937]">Urgent notifications only</p>
                                        <p className="text-xs text-[#6B7280]">Only receive high priority alerts</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={preferences.urgentOnly}
                                        onChange={(e) => setPreferences({ ...preferences, urgentOnly: e.target.checked })}
                                        className="w-5 h-5 text-[#10B981] border-[#E5E7EB] rounded"
                                    />
                                </label>
                                <label className="flex items-center justify-between py-2 cursor-pointer">
                                    <div>
                                        <p className="text-sm text-[#1F2937]">Do Not Disturb</p>
                                        <p className="text-xs text-[#6B7280]">Pause all notifications temporarily</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={preferences.doNotDisturb}
                                        onChange={(e) => setPreferences({ ...preferences, doNotDisturb: e.target.checked })}
                                        className="w-5 h-5 text-[#10B981] border-[#E5E7EB] rounded"
                                    />
                                </label>
                                <div className="pt-3">
                                    <p className="text-sm text-[#1F2937] mb-3">Quiet Hours</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-[#6B7280] mb-1">Start Time</label>
                                            <input
                                                type="time"
                                                value={preferences.quietHoursStart}
                                                onChange={(e) => setPreferences({ ...preferences, quietHoursStart: e.target.value })}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#6B7280] mb-1">End Time</label>
                                            <input
                                                type="time"
                                                value={preferences.quietHoursEnd}
                                                onChange={(e) => setPreferences({ ...preferences, quietHoursEnd: e.target.value })}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowSettings(false)}
                                className="flex-1 px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg hover:bg-[#F9FAFB]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    alert('Settings saved successfully!');
                                    setShowSettings(false);
                                }}
                                className="flex-1 px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] flex items-center justify-center gap-2"
                            >
                                <Check className="w-4 h-4" />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
