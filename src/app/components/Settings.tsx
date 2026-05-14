import {
    Settings as SettingsIcon,
    User,
    Bell,
    Lock,
    Globe,
    Mail,
    Smartphone,
    Shield,
    Database,
    Palette,
    Calendar,
    DollarSign,
    Building2,
    Save,
    X,
    Check,
    Upload,
    Eye,
    EyeOff,
    Users,
    UserCog,
    UserPlus,
    Plus
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useUserRole, UserRole } from '../contexts/UserRoleContext';
import { useSystemSettings, RegionType, CurrencyType, DateFormatType, TimeFormatType } from '../contexts/SystemSettingsContext';
import { toast } from 'sonner';

type SettingsTab = 'profile' | 'notifications' | 'security' | 'system' | 'integrations' | 'access';

export function Settings() {
    const { role, setRole, permissions } = useUserRole();
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
    const [showPassword, setShowPassword] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Add Staff Dialog State
    const [showAddStaffDialog, setShowAddStaffDialog] = useState(false);
    const [newStaffData, setNewStaffData] = useState({
        fullName: '',
        email: '',
        phone: '',
        role: 'staff' as UserRole,
        department: 'Operations'
    });

    // Custom Integrations State
    const [showAddIntegrationDialog, setShowAddIntegrationDialog] = useState(false);
    const [customIntegrations, setCustomIntegrations] = useState<any[]>([
        { id: 'int-001', name: 'Slack Notification Alerts', description: 'Broadcast urgent unfilled shift alerts directly to Slack channels', status: 'connected', provider: 'Slack' },
        { id: 'int-002', name: 'Stripe Payments Sandbox', description: 'Zero upfront fee payment processor for locum timesheet billing', status: 'connected', provider: 'Stripe' }
    ]);
    const [newIntegrationData, setNewIntegrationData] = useState({
        name: '',
        description: '',
        provider: 'Webhook',
        apiKey: '',
        webhookUrl: ''
    });

    // Permission management state
    const [selectedUser, setSelectedUser] = useState('user-001');
    const [userPermissions, setUserPermissions] = useState({
        canViewTransactions: false,
        canViewCompliance: false,
        canViewNotifications: false,
        canViewReports: false,
        canCreateEntities: false,
        canEditEntities: false,
        canDeleteEntities: false,
        canExportData: false,
        canManageUsers: false,
    });

    // Profile Settings State
    const [profileData, setProfileData] = useState({
        fullName: 'Omar Abdullah',
        email: 'omar@mployus.ie',
        phone: '+353 1 234 5678',
        role: 'System Administrator',
        department: 'Operations',
        timezone: 'Europe/Dublin',
        language: 'English (Ireland)'
    });

    // Notification Settings State
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        newLocumRegistration: true,
        shiftConfirmation: true,
        complianceExpiry: true,
        paymentProcessed: false,
        systemUpdates: true,
        weeklyReport: true,
        monthlyReport: true
    });

    // Security Settings State
    const [security, setSecurity] = useState({
        twoFactorAuth: true,
        sessionTimeout: '30',
        passwordExpiry: '90',
        loginNotifications: true
    });

    const { 
        region, setRegion, 
        currency, setCurrency, 
        dateFormat, setDateFormat, 
        timeFormat, setTimeFormat,
        autoDetect, setAutoDetect
    } = useSystemSettings();

    // System Settings State
    const [systemSettings, setSystemSettings] = useState({
        dateFormat: dateFormat,
        timeFormat: timeFormat,
        currency: currency,
        fiscalYearStart: 'January',
        autoBackup: true,
        backupFrequency: 'daily',
        dataRetention: '365'
    });

    useEffect(() => {
        setSystemSettings(prev => ({
            ...prev,
            dateFormat,
            timeFormat,
            currency
        }));
    }, [dateFormat, timeFormat, currency]);

    const handleSave = () => {
        setCurrency(systemSettings.currency as any);
        setDateFormat(systemSettings.dateFormat as any);
        setTimeFormat(systemSettings.timeFormat as any);
        toast.success('System settings saved successfully!');
        setHasChanges(false);
    };

    const handleCancel = () => {
        // Reset changes
        setHasChanges(false);
    };

    const handleAddStaff = () => {
        // Simulate adding new staff
        alert(`New staff member added:\n${newStaffData.fullName}\n${newStaffData.email}`);
        setShowAddStaffDialog(false);
        // Reset form
        setNewStaffData({
            fullName: '',
            email: '',
            phone: '',
            role: 'staff',
            department: 'Operations'
        });
    };

    const tabs = [
        { id: 'profile' as SettingsTab, label: 'Profile', icon: User },
        { id: 'notifications' as SettingsTab, label: 'Notifications', icon: Bell },
        { id: 'security' as SettingsTab, label: 'Security', icon: Lock },
        { id: 'system' as SettingsTab, label: 'System', icon: SettingsIcon },
        { id: 'integrations' as SettingsTab, label: 'Integrations', icon: Globe },
        { id: 'access' as SettingsTab, label: 'Access', icon: Users }
    ];

    return (
        <div className="p-6">
            {/* Page Title */}
            <div className="mb-6">
                <h2 className="text-[#1F2937] mb-1">Settings</h2>
                <p className="text-sm text-[#6B7280]">Manage your account and system preferences</p>
            </div>

            <div className="grid grid-cols-4 gap-5">
                {/* Sidebar Navigation */}
                <div className="col-span-1">
                    <div className="bg-white rounded-xl border border-[#E5E7EB] p-3">
                        <nav className="space-y-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${isActive
                                                ? 'bg-[#10B981] text-white'
                                                : 'text-[#6B7280] hover:bg-[#F9FAFB]'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="text-sm">{tab.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Settings Content */}
                <div className="col-span-3">
                    <div className="bg-white rounded-xl border border-[#E5E7EB]">
                        {/* Profile Settings */}
                        {activeTab === 'profile' && (
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-[#1F2937] mb-1">Profile Settings</h3>
                                        <p className="text-sm text-[#6B7280]">Manage your personal information</p>
                                    </div>
                                </div>

                                {/* Profile Photo */}
                                <div className="mb-6 pb-6 border-b border-[#E5E7EB]">
                                    <label className="block text-sm font-medium text-[#1F2937] mb-3">Profile Photo</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-20 h-20 bg-[#F3F4F6] rounded-full flex items-center justify-center text-2xl">
                                            👤
                                        </div>
                                        <div>
                                            <button className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] text-sm flex items-center gap-2 mb-2">
                                                <Upload className="w-4 h-4" />
                                                Upload Photo
                                            </button>
                                            <p className="text-xs text-[#6B7280]">JPG, PNG or GIF. Max size 2MB.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Personal Information */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#1F2937] mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                value={profileData.fullName}
                                                onChange={(e) => {
                                                    setProfileData({ ...profileData, fullName: e.target.value });
                                                    setHasChanges(true);
                                                }}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#1F2937] mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => {
                                                    setProfileData({ ...profileData, email: e.target.value });
                                                    setHasChanges(true);
                                                }}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#1F2937] mb-2">Phone Number</label>
                                            <input
                                                type="tel"
                                                value={profileData.phone}
                                                onChange={(e) => {
                                                    setProfileData({ ...profileData, phone: e.target.value });
                                                    setHasChanges(true);
                                                }}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#1F2937] mb-2">Role</label>
                                            <input
                                                type="text"
                                                value={profileData.role}
                                                disabled
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg bg-[#F9FAFB] text-[#6B7280]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#1F2937] mb-2">Department</label>
                                            <select
                                                value={profileData.department}
                                                onChange={(e) => {
                                                    setProfileData({ ...profileData, department: e.target.value });
                                                    setHasChanges(true);
                                                }}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            >
                                                <option>Operations</option>
                                                <option>Finance</option>
                                                <option>Human Resources</option>
                                                <option>Administration</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#1F2937] mb-2">Timezone</label>
                                            <select
                                                value={profileData.timezone}
                                                onChange={(e) => {
                                                    setProfileData({ ...profileData, timezone: e.target.value });
                                                    setHasChanges(true);
                                                }}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            >
                                                <option>Europe/Dublin</option>
                                                <option>Europe/London</option>
                                                <option>UTC</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#1F2937] mb-2">Language</label>
                                        <select
                                            value={profileData.language}
                                            onChange={(e) => {
                                                setProfileData({ ...profileData, language: e.target.value });
                                                setHasChanges(true);
                                            }}
                                            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                        >
                                            <option>English (Ireland)</option>
                                            <option>English (UK)</option>
                                            <option>Irish (Gaeilge)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notifications Settings */}
                        {activeTab === 'notifications' && (
                            <div className="p-6">
                                <div className="mb-6">
                                    <h3 className="text-[#1F2937] mb-1">Notification Preferences</h3>
                                    <p className="text-sm text-[#6B7280]">Choose how you want to be notified</p>
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
                                                checked={notifications.emailNotifications}
                                                onChange={(e) => {
                                                    setNotifications({ ...notifications, emailNotifications: e.target.checked });
                                                    setHasChanges(true);
                                                }}
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
                                                checked={notifications.smsNotifications}
                                                onChange={(e) => {
                                                    setNotifications({ ...notifications, smsNotifications: e.target.checked });
                                                    setHasChanges(true);
                                                }}
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
                                                checked={notifications.pushNotifications}
                                                onChange={(e) => {
                                                    setNotifications({ ...notifications, pushNotifications: e.target.checked });
                                                    setHasChanges(true);
                                                }}
                                                className="w-5 h-5 text-[#10B981] border-[#E5E7EB] rounded"
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Activity Notifications */}
                                <div className="mb-6 pb-6 border-b border-[#E5E7EB]">
                                    <h4 className="text-sm font-medium text-[#1F2937] mb-4">Activity Notifications</h4>
                                    <div className="space-y-2">
                                        <label className="flex items-center justify-between py-2 cursor-pointer">
                                            <span className="text-sm text-[#1F2937]">New locum registration</span>
                                            <input
                                                type="checkbox"
                                                checked={notifications.newLocumRegistration}
                                                onChange={(e) => {
                                                    setNotifications({ ...notifications, newLocumRegistration: e.target.checked });
                                                    setHasChanges(true);
                                                }}
                                                className="w-5 h-5 text-[#10B981] border-[#E5E7EB] rounded"
                                            />
                                        </label>
                                        <label className="flex items-center justify-between py-2 cursor-pointer">
                                            <span className="text-sm text-[#1F2937]">Shift confirmations</span>
                                            <input
                                                type="checkbox"
                                                checked={notifications.shiftConfirmation}
                                                onChange={(e) => {
                                                    setNotifications({ ...notifications, shiftConfirmation: e.target.checked });
                                                    setHasChanges(true);
                                                }}
                                                className="w-5 h-5 text-[#10B981] border-[#E5E7EB] rounded"
                                            />
                                        </label>
                                        <label className="flex items-center justify-between py-2 cursor-pointer">
                                            <span className="text-sm text-[#1F2937]">Compliance documents expiring</span>
                                            <input
                                                type="checkbox"
                                                checked={notifications.complianceExpiry}
                                                onChange={(e) => {
                                                    setNotifications({ ...notifications, complianceExpiry: e.target.checked });
                                                    setHasChanges(true);
                                                }}
                                                className="w-5 h-5 text-[#10B981] border-[#E5E7EB] rounded"
                                            />
                                        </label>
                                        <label className="flex items-center justify-between py-2 cursor-pointer">
                                            <span className="text-sm text-[#1F2937]">Payment processed</span>
                                            <input
                                                type="checkbox"
                                                checked={notifications.paymentProcessed}
                                                onChange={(e) => {
                                                    setNotifications({ ...notifications, paymentProcessed: e.target.checked });
                                                    setHasChanges(true);
                                                }}
                                                className="w-5 h-5 text-[#10B981] border-[#E5E7EB] rounded"
                                            />
                                        </label>
                                        <label className="flex items-center justify-between py-2 cursor-pointer">
                                            <span className="text-sm text-[#1F2937]">System updates</span>
                                            <input
                                                type="checkbox"
                                                checked={notifications.systemUpdates}
                                                onChange={(e) => {
                                                    setNotifications({ ...notifications, systemUpdates: e.target.checked });
                                                    setHasChanges(true);
                                                }}
                                                className="w-5 h-5 text-[#10B981] border-[#E5E7EB] rounded"
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Report Notifications */}
                                <div>
                                    <h4 className="text-sm font-medium text-[#1F2937] mb-4">Report Notifications</h4>
                                    <div className="space-y-2">
                                        <label className="flex items-center justify-between py-2 cursor-pointer">
                                            <span className="text-sm text-[#1F2937]">Weekly summary report</span>
                                            <input
                                                type="checkbox"
                                                checked={notifications.weeklyReport}
                                                onChange={(e) => {
                                                    setNotifications({ ...notifications, weeklyReport: e.target.checked });
                                                    setHasChanges(true);
                                                }}
                                                className="w-5 h-5 text-[#10B981] border-[#E5E7EB] rounded"
                                            />
                                        </label>
                                        <label className="flex items-center justify-between py-2 cursor-pointer">
                                            <span className="text-sm text-[#1F2937]">Monthly performance report</span>
                                            <input
                                                type="checkbox"
                                                checked={notifications.monthlyReport}
                                                onChange={(e) => {
                                                    setNotifications({ ...notifications, monthlyReport: e.target.checked });
                                                    setHasChanges(true);
                                                }}
                                                className="w-5 h-5 text-[#10B981] border-[#E5E7EB] rounded"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security Settings */}
                        {activeTab === 'security' && (
                            <div className="p-6">
                                <div className="mb-6">
                                    <h3 className="text-[#1F2937] mb-1">Security Settings</h3>
                                    <p className="text-sm text-[#6B7280]">Manage your account security and privacy</p>
                                </div>

                                {/* Password Change */}
                                <div className="mb-6 pb-6 border-b border-[#E5E7EB]">
                                    <h4 className="text-sm font-medium text-[#1F2937] mb-4">Change Password</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#1F2937] mb-2">Current Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                                    placeholder="Enter current password"
                                                />
                                                <button
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]"
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-[#1F2937] mb-2">New Password</label>
                                                <input
                                                    type="password"
                                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                                    placeholder="Enter new password"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-[#1F2937] mb-2">Confirm Password</label>
                                                <input
                                                    type="password"
                                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                                    placeholder="Confirm new password"
                                                />
                                            </div>
                                        </div>
                                        <button className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] text-sm">
                                            Update Password
                                        </button>
                                    </div>
                                </div>

                                {/* Two-Factor Authentication */}
                                <div className="mb-6 pb-6 border-b border-[#E5E7EB]">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-[#1F2937] mb-1">Two-Factor Authentication</h4>
                                            <p className="text-xs text-[#6B7280]">Add an extra layer of security to your account</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={security.twoFactorAuth}
                                            onChange={(e) => {
                                                setSecurity({ ...security, twoFactorAuth: e.target.checked });
                                                setHasChanges(true);
                                            }}
                                            className="w-5 h-5 text-[#10B981] border-[#E5E7EB] rounded"
                                        />
                                    </div>
                                    {security.twoFactorAuth && (
                                        <div className="p-3 bg-[#D1FAE5] border border-[#A7F3D0] rounded-lg">
                                            <div className="flex items-center gap-2 text-sm text-[#059669]">
                                                <Shield className="w-4 h-4" />
                                                <span>Two-factor authentication is enabled</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Session Settings */}
                                <div className="mb-6 pb-6 border-b border-[#E5E7EB]">
                                    <h4 className="text-sm font-medium text-[#1F2937] mb-4">Session Settings</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#1F2937] mb-2">Session Timeout (minutes)</label>
                                            <select
                                                value={security.sessionTimeout}
                                                onChange={(e) => {
                                                    setSecurity({ ...security, sessionTimeout: e.target.value });
                                                    setHasChanges(true);
                                                }}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            >
                                                <option value="15">15 minutes</option>
                                                <option value="30">30 minutes</option>
                                                <option value="60">1 hour</option>
                                                <option value="120">2 hours</option>
                                            </select>
                                        </div>
                                        <label className="flex items-center justify-between py-2 cursor-pointer">
                                            <span className="text-sm text-[#1F2937]">Notify me of new login attempts</span>
                                            <input
                                                type="checkbox"
                                                checked={security.loginNotifications}
                                                onChange={(e) => {
                                                    setSecurity({ ...security, loginNotifications: e.target.checked });
                                                    setHasChanges(true);
                                                }}
                                                className="w-5 h-5 text-[#10B981] border-[#E5E7EB] rounded"
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Password Policy */}
                                <div>
                                    <h4 className="text-sm font-medium text-[#1F2937] mb-4">Password Policy</h4>
                                    <div>
                                        <label className="block text-sm font-medium text-[#1F2937] mb-2">Password Expiry (days)</label>
                                        <select
                                            value={security.passwordExpiry}
                                            onChange={(e) => {
                                                setSecurity({ ...security, passwordExpiry: e.target.value });
                                                setHasChanges(true);
                                            }}
                                            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                        >
                                            <option value="30">30 days</option>
                                            <option value="60">60 days</option>
                                            <option value="90">90 days</option>
                                            <option value="never">Never expire</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* System Settings */}
                        {activeTab === 'system' && (
                            <div className="p-6">
                                <div className="mb-6">
                                    <h3 className="text-[#1F2937] mb-1">System Settings</h3>
                                    <p className="text-sm text-[#6B7280]">Configure system preferences and defaults</p>
                                </div>

                                {/* Regional Settings */}
                                <div className="mb-6 pb-6 border-b border-[#E5E7EB]">
                                    <h4 className="text-sm font-medium text-[#1F2937] mb-4">Regional Settings</h4>

                                    {/* Auto-detect toggle switch */}
                                    <div className="flex items-center justify-between p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl mb-6">
                                        <div>
                                            <h5 className="text-sm font-semibold text-[#1F2937]">Auto-Detect Location</h5>
                                            <p className="text-xs text-[#6B7280] mt-0.5">Use your network IP geolocation to automatically assign your region and local currency.</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setAutoDetect(!autoDetect);
                                                toast.success(autoDetect ? "Switched to manual override mode" : "Auto-detection enabled!");
                                            }}
                                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${autoDetect ? 'bg-[#10B981]' : 'bg-[#D1D5DB]'}`}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${autoDetect ? 'translate-x-5' : 'translate-x-0'}`}
                                            />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-[#1F2937] mb-2">
                                                System Region {autoDetect && <span className="text-[10px] text-[#10B981] font-semibold ml-1 bg-[#ECFDF5] px-1.5 py-0.5 rounded-full">Auto-Locked</span>}
                                            </label>
                                            <select
                                                disabled={autoDetect}
                                                value={region}
                                                onChange={(e) => {
                                                    const newRegion = e.target.value as RegionType;
                                                    setRegion(newRegion);
                                                    
                                                    let defaultCurrency = 'USD';
                                                    let defaultDateFormat = 'DD/MM/YYYY';
                                                    if (newRegion === 'IE') {
                                                        defaultCurrency = 'EUR';
                                                        defaultDateFormat = 'DD/MM/YYYY';
                                                    } else if (newRegion === 'GB') {
                                                        defaultCurrency = 'GBP';
                                                        defaultDateFormat = 'DD/MM/YYYY';
                                                    } else if (newRegion === 'US') {
                                                        defaultCurrency = 'USD';
                                                        defaultDateFormat = 'MM/DD/YYYY';
                                                    }
                                                    
                                                    setSystemSettings(prev => ({
                                                        ...prev,
                                                        currency: defaultCurrency as CurrencyType,
                                                        dateFormat: defaultDateFormat as DateFormatType
                                                    }));
                                                    setHasChanges(true);
                                                    toast.success(`Active region changed to ${newRegion === 'global' ? 'Global' : newRegion}`);
                                                }}
                                                className={`w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] ${autoDetect ? 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed' : 'bg-white'}`}
                                            >
                                                <option value="global">🌐 Global (Worldwide)</option>
                                                <option value="IE">🇮🇪 Ireland</option>
                                                <option value="GB">🇬🇧 United Kingdom</option>
                                                <option value="US">🇺🇸 United States</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#1F2937] mb-2">Date Format</label>
                                            <select
                                                value={systemSettings.dateFormat}
                                                onChange={(e) => {
                                                    setSystemSettings({ ...systemSettings, dateFormat: e.target.value as DateFormatType });
                                                    setHasChanges(true);
                                                }}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            >
                                                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#1F2937] mb-2">Time Format</label>
                                            <select
                                                value={systemSettings.timeFormat}
                                                onChange={(e) => {
                                                    setSystemSettings({ ...systemSettings, timeFormat: e.target.value as TimeFormatType });
                                                    setHasChanges(true);
                                                }}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            >
                                                <option value="24-hour">24-hour</option>
                                                <option value="12-hour">12-hour (AM/PM)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Financial Settings */}
                                <div className="mb-6 pb-6 border-b border-[#E5E7EB]">
                                    <h4 className="text-sm font-medium text-[#1F2937] mb-4">Financial Settings</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#1F2937] mb-2">
                                                Currency {autoDetect && <span className="text-[10px] text-[#10B981] font-semibold ml-1 bg-[#ECFDF5] px-1.5 py-0.5 rounded-full">Auto-Locked</span>}
                                            </label>
                                            <select
                                                disabled={autoDetect}
                                                value={systemSettings.currency}
                                                onChange={(e) => {
                                                    setSystemSettings({ ...systemSettings, currency: e.target.value as CurrencyType });
                                                    setHasChanges(true);
                                                }}
                                                className={`w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] ${autoDetect ? 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed' : 'bg-white'}`}
                                            >
                                                <option value="EUR">EUR (€)</option>
                                                <option value="GBP">GBP (£)</option>
                                                <option value="USD">USD ($)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#1F2937] mb-2">Fiscal Year Start</label>
                                            <select
                                                value={systemSettings.fiscalYearStart}
                                                onChange={(e) => {
                                                    setSystemSettings({ ...systemSettings, fiscalYearStart: e.target.value });
                                                    setHasChanges(true);
                                                }}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            >
                                                <option value="January">January</option>
                                                <option value="April">April</option>
                                                <option value="July">July</option>
                                                <option value="October">October</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Backup Settings */}
                                <div className="mb-6 pb-6 border-b border-[#E5E7EB]">
                                    <h4 className="text-sm font-medium text-[#1F2937] mb-4">Backup & Data</h4>
                                    <div className="space-y-4">
                                        <label className="flex items-center justify-between py-2 cursor-pointer">
                                            <span className="text-sm text-[#1F2937]">Enable automatic backups</span>
                                            <input
                                                type="checkbox"
                                                checked={systemSettings.autoBackup}
                                                onChange={(e) => {
                                                    setSystemSettings({ ...systemSettings, autoBackup: e.target.checked });
                                                    setHasChanges(true);
                                                }}
                                                className="w-5 h-5 text-[#10B981] border-[#E5E7EB] rounded"
                                            />
                                        </label>
                                        {systemSettings.autoBackup && (
                                            <div>
                                                <label className="block text-sm font-medium text-[#1F2937] mb-2">Backup Frequency</label>
                                                <select
                                                    value={systemSettings.backupFrequency}
                                                    onChange={(e) => {
                                                        setSystemSettings({ ...systemSettings, backupFrequency: e.target.value });
                                                        setHasChanges(true);
                                                    }}
                                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                                >
                                                    <option value="daily">Daily</option>
                                                    <option value="weekly">Weekly</option>
                                                    <option value="monthly">Monthly</option>
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Data Retention */}
                                <div>
                                    <h4 className="text-sm font-medium text-[#1F2937] mb-4">Data Retention</h4>
                                    <div>
                                        <label className="block text-sm font-medium text-[#1F2937] mb-2">Retention Period (days)</label>
                                        <select
                                            value={systemSettings.dataRetention}
                                            onChange={(e) => {
                                                setSystemSettings({ ...systemSettings, dataRetention: e.target.value });
                                                setHasChanges(true);
                                            }}
                                            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                        >
                                            <option value="90">90 days</option>
                                            <option value="180">180 days</option>
                                            <option value="365">1 year</option>
                                            <option value="730">2 years</option>
                                            <option value="unlimited">Unlimited</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Integrations Settings */}
                        {activeTab === 'integrations' && (
                            <div className="p-6">
                                <div className="mb-6 flex items-start justify-between">
                                    <div>
                                        <h3 className="text-[#1F2937] mb-1">Integrations</h3>
                                        <p className="text-sm text-[#6B7280]">Connect with third-party services</p>
                                    </div>
                                    <button
                                        onClick={() => setShowAddIntegrationDialog(true)}
                                        className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Integration
                                    </button>
                                </div>

                                {/* How to Connect an Integration/Service Guide */}
                                <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-[#3B82F6]/5 via-white to-transparent border border-[#E5E7EB] shadow-sm">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-[#EFF6FF] rounded-xl flex items-center justify-center text-[#3B82F6] flex-shrink-0">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-[#1F2937] text-sm mb-2" style={{ fontWeight: 700 }}>How to Connect New Integrations & Services</h4>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3">
                                                <div className="p-3 bg-[#F9FAFB] rounded-lg border border-[#F3F4F6]">
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <span className="w-5 h-5 bg-[#3B82F6]/10 text-[#3B82F6] rounded-full flex items-center justify-center text-xs font-bold">1</span>
                                                        <span className="text-xs font-semibold text-[#1F2937]">Get Credentials</span>
                                                    </div>
                                                    <p className="text-[11px] text-[#6B7280] leading-relaxed">
                                                        Obtain API keys, webhooks, or OAuth secrets from your provider console (e.g. Google Developer Console, Twilio, Slack App Directory).
                                                    </p>
                                                </div>

                                                <div className="p-3 bg-[#F9FAFB] rounded-lg border border-[#F3F4F6]">
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <span className="w-5 h-5 bg-[#10B981]/10 text-[#10B981] rounded-full flex items-center justify-center text-xs font-bold">2</span>
                                                        <span className="text-xs font-semibold text-[#1F2937]">Trigger Setup</span>
                                                    </div>
                                                    <p className="text-[11px] text-[#6B7280] leading-relaxed">
                                                        Click the <strong className="text-[#10B981]">"Connect"</strong> button on any service listing below to open its secure credential configuration modal.
                                                    </p>
                                                </div>

                                                <div className="p-3 bg-[#F9FAFB] rounded-lg border border-[#F3F4F6]">
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <span className="w-5 h-5 bg-[#F59E0B]/10 text-[#F59E0B] rounded-full flex items-center justify-center text-xs font-bold">3</span>
                                                        <span className="text-xs font-semibold text-[#1F2937]">Insert Keys</span>
                                                    </div>
                                                    <p className="text-[11px] text-[#6B7280] leading-relaxed">
                                                        Enter your token parameters, client secrets, or endpoint URLs safely into the form fields and click save to persist them securely.
                                                    </p>
                                                </div>

                                                <div className="p-3 bg-[#F9FAFB] rounded-lg border border-[#F3F4F6]">
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <span className="w-5 h-5 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded-full flex items-center justify-center text-xs font-bold">4</span>
                                                        <span className="text-xs font-semibold text-[#1F2937]">Run Test Sync</span>
                                                    </div>
                                                    <p className="text-[11px] text-[#6B7280] leading-relaxed">
                                                        Click <strong className="text-[#8B5CF6]">"Configure"</strong> and run a diagnostic test to confirm your endpoint transmits live data flows correctly.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* Calendar Integration */}
                                    <div className="p-4 border border-[#E5E7EB] rounded-xl">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-[#DBEAFE] rounded-lg flex items-center justify-center">
                                                    <Calendar className="w-6 h-6 text-[#3B82F6]" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-[#1F2937]">Google Calendar</h4>
                                                    <p className="text-xs text-[#6B7280]">Sync shifts with your calendar</p>
                                                </div>
                                            </div>
                                            <button className="px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg hover:bg-[#F9FAFB] text-sm">
                                                Connect
                                            </button>
                                        </div>
                                    </div>

                                    {/* Email Integration */}
                                    <div className="p-4 border border-[#E5E7EB] rounded-xl">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-[#FEE2E2] rounded-lg flex items-center justify-center">
                                                    <Mail className="w-6 h-6 text-[#EF4444]" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-[#1F2937]">Email Service (SMTP)</h4>
                                                    <p className="text-xs text-[#6B7280]">Configure email notifications</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-1 bg-[#D1FAE5] text-[#059669] rounded text-xs flex items-center gap-1">
                                                    <Check className="w-3 h-3" />
                                                    Connected
                                                </span>
                                                <button className="px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg hover:bg-[#F9FAFB] text-sm">
                                                    Configure
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Integration */}
                                    <div className="p-4 border border-[#E5E7EB] rounded-xl">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-[#D1FAE5] rounded-lg flex items-center justify-center">
                                                    <DollarSign className="w-6 h-6 text-[#10B981]" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-[#1F2937]">Payment Gateway</h4>
                                                    <p className="text-xs text-[#6B7280]">Process payments and invoices</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-1 bg-[#D1FAE5] text-[#059669] rounded text-xs flex items-center gap-1">
                                                    <Check className="w-3 h-3" />
                                                    Connected
                                                </span>
                                                <button className="px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg hover:bg-[#F9FAFB] text-sm">
                                                    Configure
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SMS Integration */}
                                    <div className="p-4 border border-[#E5E7EB] rounded-xl">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-[#FEF3C7] rounded-lg flex items-center justify-center">
                                                    <Smartphone className="w-6 h-6 text-[#D97706]" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-[#1F2937]">SMS Gateway</h4>
                                                    <p className="text-xs text-[#6B7280]">Send SMS notifications to locums</p>
                                                </div>
                                            </div>
                                            <button className="px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg hover:bg-[#F9FAFB] text-sm">
                                                Connect
                                            </button>
                                        </div>
                                    </div>

                                    {/* HR System Integration */}
                                    <div className="p-4 border border-[#E5E7EB] rounded-xl">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-[#E0E7FF] rounded-lg flex items-center justify-center">
                                                    <Building2 className="w-6 h-6 text-[#6366F1]" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-[#1F2937]">HR Management System</h4>
                                                    <p className="text-xs text-[#6B7280]">Sync with your HR platform</p>
                                                </div>
                                            </div>
                                            <button className="px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg hover:bg-[#F9FAFB] text-sm">
                                                Connect
                                            </button>
                                        </div>
                                    </div>

                                    {/* Custom Dynamically Added Integrations */}
                                    {customIntegrations.map((integration) => {
                                        const isConnected = integration.status === 'connected';
                                        return (
                                            <div key={integration.id} className="p-4 border border-[#E5E7EB] rounded-xl hover:border-[#3B82F6]/30 hover:shadow-sm transition-all bg-gradient-to-r from-transparent to-white font-sans">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-[#EFF6FF] rounded-lg flex items-center justify-center">
                                                            <Globe className="w-6 h-6 text-[#3B82F6]" />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <h4 className="font-semibold text-sm text-[#1F2937]">{integration.name}</h4>
                                                                <span className="px-1.5 py-0.2 bg-[#E0E7FF] text-[#3B82F6] text-[9px] font-bold rounded-full uppercase tracking-wider">
                                                                    {integration.provider}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-[#6B7280]">{integration.description}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {isConnected ? (
                                                            <>
                                                                <span className="px-2 py-1 bg-[#D1FAE5] text-[#059669] rounded text-xs flex items-center gap-1 font-medium">
                                                                    <Check className="w-3 h-3" />
                                                                    Connected
                                                                </span>
                                                                <button 
                                                                    onClick={() => toast.info(`Configuring ${integration.name} custom parameters...`)}
                                                                    className="px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg hover:bg-[#F9FAFB] text-sm"
                                                                >
                                                                    Configure
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <button 
                                                                onClick={() => {
                                                                    const updated = customIntegrations.map(item => item.id === integration.id ? {...item, status: 'connected'} : item);
                                                                    setCustomIntegrations(updated);
                                                                    toast.success(`${integration.name} connected successfully!`);
                                                                }}
                                                                className="px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg hover:bg-[#F9FAFB] text-sm font-medium"
                                                            >
                                                                Connect
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Access Settings */}
                        {activeTab === 'access' && (
                            <div className="p-6">
                                <div className="mb-6 flex items-start justify-between">
                                    <div>
                                        <h3 className="text-[#1F2937] mb-1">Access Control</h3>
                                        <p className="text-sm text-[#6B7280]">Manage user roles and permissions</p>
                                    </div>
                                    <button
                                        onClick={() => setShowAddStaffDialog(true)}
                                        className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] text-sm flex items-center gap-2"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        Add Staff
                                    </button>
                                </div>

                                {/* Current Role Selection */}
                                <div className="mb-6 pb-6 border-b border-[#E5E7EB]">
                                    <h4 className="text-sm font-medium text-[#1F2937] mb-4">Current User Role</h4>
                                    <p className="text-xs text-[#6B7280] mb-4">
                                        Switch between roles to test different permission levels. In a production environment, roles would be assigned by administrators.
                                    </p>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 p-4 border border-[#E5E7EB] rounded-lg cursor-pointer hover:bg-[#F9FAFB] transition-colors">
                                            <input
                                                type="radio"
                                                name="role"
                                                value="admin"
                                                checked={role === 'admin'}
                                                onChange={(e) => {
                                                    setRole(e.target.value as UserRole);
                                                    setHasChanges(true);
                                                }}
                                                className="w-5 h-5 text-[#10B981] border-[#E5E7EB]"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <Shield className="w-5 h-5 text-[#10B981]" />
                                                    <span className="font-medium text-[#1F2937]">System Administrator</span>
                                                </div>
                                                <p className="text-xs text-[#6B7280] mt-1">Full access to all features and settings</p>
                                            </div>
                                        </label>

                                        <label className="flex items-center gap-3 p-4 border border-[#E5E7EB] rounded-lg cursor-pointer hover:bg-[#F9FAFB] transition-colors">
                                            <input
                                                type="radio"
                                                name="role"
                                                value="staff"
                                                checked={role === 'staff'}
                                                onChange={(e) => {
                                                    setRole(e.target.value as UserRole);
                                                    setHasChanges(true);
                                                }}
                                                className="w-5 h-5 text-[#10B981] border-[#E5E7EB]"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-5 h-5 text-[#6B7280]" />
                                                    <span className="font-medium text-[#1F2937]">Staff Worker</span>
                                                </div>
                                                <p className="text-xs text-[#6B7280] mt-1">Limited access to view locums and appointments only</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* User Permission Management */}
                                <div>
                                    <h4 className="text-sm font-medium text-[#1F2937] mb-4">Manage User Permissions</h4>
                                    <p className="text-xs text-[#6B7280] mb-4">
                                        Grant or revoke specific permissions for individual users.
                                    </p>

                                    {/* Select User */}
                                    <div className="mb-6 pb-6 border-b border-[#E5E7EB]">
                                        <label className="block text-sm font-medium text-[#1F2937] mb-2">Select User</label>
                                        <select
                                            value={selectedUser}
                                            onChange={(e) => {
                                                setSelectedUser(e.target.value);
                                                setHasChanges(true);
                                            }}
                                            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                        >
                                            <option value="user-001">Sarah O'Connor - Staff Worker</option>
                                            <option value="user-002">James Murphy - Staff Worker</option>
                                            <option value="user-003">Emma Kelly - Staff Worker</option>
                                            <option value="user-004">Liam Walsh - Staff Worker</option>
                                        </select>
                                        <p className="text-xs text-[#6B7280] mt-2">Select a user to customize their access permissions</p>
                                    </div>

                                    {/* Page Access Permissions */}
                                    <div className="mb-6 pb-6 border-b border-[#E5E7EB]">
                                        <h5 className="text-sm font-medium text-[#1F2937] mb-3">Page Access</h5>
                                        <div className="space-y-3">
                                            <label className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-lg cursor-pointer hover:bg-[#F9FAFB]">
                                                <div>
                                                    <p className="text-sm font-medium text-[#1F2937]">View Compliance</p>
                                                    <p className="text-xs text-[#6B7280]">Access to compliance tracking and documents</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={userPermissions.canViewCompliance}
                                                    onChange={(e) => {
                                                        setUserPermissions({ ...userPermissions, canViewCompliance: e.target.checked });
                                                        setHasChanges(true);
                                                    }}
                                                    className="w-5 h-5 text-[#10B981] border-[#E5E7EB] rounded"
                                                />
                                            </label>

                                            <label className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-lg cursor-pointer hover:bg-[#F9FAFB]">
                                                <div>
                                                    <p className="text-sm font-medium text-[#1F2937]">View Transactions</p>
                                                    <p className="text-xs text-[#6B7280]">Access to payment and financial data</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={userPermissions.canViewTransactions}
                                                    onChange={(e) => {
                                                        setUserPermissions({ ...userPermissions, canViewTransactions: e.target.checked });
                                                        setHasChanges(true);
                                                    }}
                                                    className="w-5 h-5 text-[#10B981] border-[#E5E7EB] rounded"
                                                />
                                            </label>

                                            <label className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-lg cursor-pointer hover:bg-[#F9FAFB]">
                                                <div>
                                                    <p className="text-sm font-medium text-[#1F2937]">View Reports</p>
                                                    <p className="text-xs text-[#6B7280]">Access to analytics and reporting</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={userPermissions.canViewReports}
                                                    onChange={(e) => {
                                                        setUserPermissions({ ...userPermissions, canViewReports: e.target.checked });
                                                        setHasChanges(true);
                                                    }}
                                                    className="w-5 h-5 text-[#10B981] border-[#E5E7EB] rounded"
                                                />
                                            </label>

                                            <label className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-lg cursor-pointer hover:bg-[#F9FAFB]">
                                                <div>
                                                    <p className="text-sm font-medium text-[#1F2937]">View Notifications</p>
                                                    <p className="text-xs text-[#6B7280]">Access to system notifications panel</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={userPermissions.canViewNotifications}
                                                    onChange={(e) => {
                                                        setUserPermissions({ ...userPermissions, canViewNotifications: e.target.checked });
                                                        setHasChanges(true);
                                                    }}
                                                    className="w-5 h-5 text-[#10B981] border-[#E5E7EB] rounded"
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    {/* Action Permissions */}
                                    <div className="mb-6 pb-6 border-b border-[#E5E7EB]">
                                        <h5 className="text-sm font-medium text-[#1F2937] mb-3">Actions</h5>
                                        <div className="space-y-3">
                                            <label className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-lg cursor-pointer hover:bg-[#F9FAFB]">
                                                <div>
                                                    <p className="text-sm font-medium text-[#1F2937]">Create Entities</p>
                                                    <p className="text-xs text-[#6B7280]">Create new locums, shifts, appointments</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={userPermissions.canCreateEntities}
                                                    onChange={(e) => {
                                                        setUserPermissions({ ...userPermissions, canCreateEntities: e.target.checked });
                                                        setHasChanges(true);
                                                    }}
                                                    className="w-5 h-5 text-[#10B981] border-[#E5E7EB] rounded"
                                                />
                                            </label>

                                            <label className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-lg cursor-pointer hover:bg-[#F9FAFB]">
                                                <div>
                                                    <p className="text-sm font-medium text-[#1F2937]">Edit Entities</p>
                                                    <p className="text-xs text-[#6B7280]">Modify existing records and information</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={userPermissions.canEditEntities}
                                                    onChange={(e) => {
                                                        setUserPermissions({ ...userPermissions, canEditEntities: e.target.checked });
                                                        setHasChanges(true);
                                                    }}
                                                    className="w-5 h-5 text-[#10B981] border-[#E5E7EB] rounded"
                                                />
                                            </label>

                                            <label className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-lg cursor-pointer hover:bg-[#F9FAFB]">
                                                <div>
                                                    <p className="text-sm font-medium text-[#1F2937]">Delete Entities</p>
                                                    <p className="text-xs text-[#6B7280]">Remove records from the system</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={userPermissions.canDeleteEntities}
                                                    onChange={(e) => {
                                                        setUserPermissions({ ...userPermissions, canDeleteEntities: e.target.checked });
                                                        setHasChanges(true);
                                                    }}
                                                    className="w-5 h-5 text-[#10B981] border-[#E5E7EB] rounded"
                                                />
                                            </label>

                                            <label className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-lg cursor-pointer hover:bg-[#F9FAFB]">
                                                <div>
                                                    <p className="text-sm font-medium text-[#1F2937]">Export Data</p>
                                                    <p className="text-xs text-[#6B7280]">Download data as CSV or other formats</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={userPermissions.canExportData}
                                                    onChange={(e) => {
                                                        setUserPermissions({ ...userPermissions, canExportData: e.target.checked });
                                                        setHasChanges(true);
                                                    }}
                                                    className="w-5 h-5 text-[#10B981] border-[#E5E7EB] rounded"
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    {/* Administrative Permissions */}
                                    <div className="mb-6 pb-6">
                                        <h5 className="text-sm font-medium text-[#1F2937] mb-3">Administrative</h5>
                                        <div className="space-y-3">
                                            <label className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-lg cursor-pointer hover:bg-[#F9FAFB]">
                                                <div>
                                                    <p className="text-sm font-medium text-[#1F2937]">Manage Users</p>
                                                    <p className="text-xs text-[#6B7280]">Create, edit, and manage user accounts</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={userPermissions.canManageUsers}
                                                    onChange={(e) => {
                                                        setUserPermissions({ ...userPermissions, canManageUsers: e.target.checked });
                                                        setHasChanges(true);
                                                    }}
                                                    className="w-5 h-5 text-[#10B981] border-[#E5E7EB] rounded"
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
                                        {/* Table Header */}
                                        <div className="grid grid-cols-3 bg-[#F9FAFB] border-b border-[#E5E7EB]">
                                            <div className="p-3 text-sm font-medium text-[#1F2937]">Permission</div>
                                            <div className="p-3 text-sm font-medium text-[#1F2937] text-center border-l border-[#E5E7EB]">Admin</div>
                                            <div className="p-3 text-sm font-medium text-[#1F2937] text-center border-l border-[#E5E7EB]">Staff</div>
                                        </div>

                                        {/* Permission Rows */}
                                        <div className="grid grid-cols-3 border-b border-[#E5E7EB]">
                                            <div className="p-3 text-sm text-[#1F2937]">View Dashboard</div>
                                            <div className="p-3 text-center border-l border-[#E5E7EB]">
                                                <Check className="w-5 h-5 text-[#10B981] mx-auto" />
                                            </div>
                                            <div className="p-3 text-center border-l border-[#E5E7EB]">
                                                <Check className="w-5 h-5 text-[#10B981] mx-auto" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 border-b border-[#E5E7EB] bg-[#F9FAFB]">
                                            <div className="p-3 text-sm text-[#1F2937]">View Locums</div>
                                            <div className="p-3 text-center border-l border-[#E5E7EB]">
                                                <Check className="w-5 h-5 text-[#10B981] mx-auto" />
                                            </div>
                                            <div className="p-3 text-center border-l border-[#E5E7EB]">
                                                <Check className="w-5 h-5 text-[#10B981] mx-auto" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 border-b border-[#E5E7EB]">
                                            <div className="p-3 text-sm text-[#1F2937]">View Appointments</div>
                                            <div className="p-3 text-center border-l border-[#E5E7EB]">
                                                <Check className="w-5 h-5 text-[#10B981] mx-auto" />
                                            </div>
                                            <div className="p-3 text-center border-l border-[#E5E7EB]">
                                                <Check className="w-5 h-5 text-[#10B981] mx-auto" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 border-b border-[#E5E7EB] bg-[#F9FAFB]">
                                            <div className="p-3 text-sm text-[#1F2937]">View Compliance</div>
                                            <div className="p-3 text-center border-l border-[#E5E7EB]">
                                                <Check className="w-5 h-5 text-[#10B981] mx-auto" />
                                            </div>
                                            <div className="p-3 text-center border-l border-[#E5E7EB]">
                                                <X className="w-5 h-5 text-[#EF4444] mx-auto" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 border-b border-[#E5E7EB]">
                                            <div className="p-3 text-sm text-[#1F2937]">View Transactions</div>
                                            <div className="p-3 text-center border-l border-[#E5E7EB]">
                                                <Check className="w-5 h-5 text-[#10B981] mx-auto" />
                                            </div>
                                            <div className="p-3 text-center border-l border-[#E5E7EB]">
                                                <X className="w-5 h-5 text-[#EF4444] mx-auto" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 border-b border-[#E5E7EB] bg-[#F9FAFB]">
                                            <div className="p-3 text-sm text-[#1F2937]">View Reports</div>
                                            <div className="p-3 text-center border-l border-[#E5E7EB]">
                                                <Check className="w-5 h-5 text-[#10B981] mx-auto" />
                                            </div>
                                            <div className="p-3 text-center border-l border-[#E5E7EB]">
                                                <X className="w-5 h-5 text-[#EF4444] mx-auto" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 border-b border-[#E5E7EB]">
                                            <div className="p-3 text-sm text-[#1F2937]">View Notifications</div>
                                            <div className="p-3 text-center border-l border-[#E5E7EB]">
                                                <Check className="w-5 h-5 text-[#10B981] mx-auto" />
                                            </div>
                                            <div className="p-3 text-center border-l border-[#E5E7EB]">
                                                <X className="w-5 h-5 text-[#EF4444] mx-auto" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 border-b border-[#E5E7EB]">
                                            <div className="p-3 text-sm text-[#1F2937]">Create Entities</div>
                                            <div className="p-3 text-center border-l border-[#E5E7EB]">
                                                <Check className="w-5 h-5 text-[#10B981] mx-auto" />
                                            </div>
                                            <div className="p-3 text-center border-l border-[#E5E7EB]">
                                                <X className="w-5 h-5 text-[#EF4444] mx-auto" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 border-b border-[#E5E7EB]">
                                            <div className="p-3 text-sm text-[#1F2937]">Edit Entities</div>
                                            <div className="p-3 text-center border-l border-[#E5E7EB]">
                                                <Check className="w-5 h-5 text-[#10B981] mx-auto" />
                                            </div>
                                            <div className="p-3 text-center border-l border-[#E5E7EB]">
                                                <X className="w-5 h-5 text-[#EF4444] mx-auto" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 border-b border-[#E5E7EB] bg-[#F9FAFB]">
                                            <div className="p-3 text-sm text-[#1F2937]">Delete Entities</div>
                                            <div className="p-3 text-center border-l border-[#E5E7EB]">
                                                <Check className="w-5 h-5 text-[#10B981] mx-auto" />
                                            </div>
                                            <div className="p-3 text-center border-l border-[#E5E7EB]">
                                                <X className="w-5 h-5 text-[#EF4444] mx-auto" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3">
                                            <div className="p-3 text-sm text-[#1F2937]">Export Data</div>
                                            <div className="p-3 text-center border-l border-[#E5E7EB]">
                                                <Check className="w-5 h-5 text-[#10B981] mx-auto" />
                                            </div>
                                            <div className="p-3 text-center border-l border-[#E5E7EB]">
                                                <X className="w-5 h-5 text-[#EF4444] mx-auto" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Save/Cancel Footer */}
                        {hasChanges && (
                            <div className="p-4 border-t border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-between rounded-b-xl">
                                <p className="text-sm text-[#6B7280]">You have unsaved changes</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCancel}
                                        className="px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg hover:bg-white text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] text-sm flex items-center gap-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Staff Dialog */}
            {showAddStaffDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
                        {/* Dialog Header */}
                        <div className="p-6 border-b border-[#E5E7EB]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#D1FAE5] rounded-lg flex items-center justify-center">
                                        <UserPlus className="w-5 h-5 text-[#10B981]" />
                                    </div>
                                    <div>
                                        <h3 className="text-[#1F2937]">Add New Staff Member</h3>
                                        <p className="text-xs text-[#6B7280]">Create a new user account</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowAddStaffDialog(false)}
                                    className="text-[#6B7280] hover:text-[#1F2937]"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Dialog Content */}
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#1F2937] mb-2">
                                    Full Name <span className="text-[#EF4444]">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newStaffData.fullName}
                                    onChange={(e) => setNewStaffData({ ...newStaffData, fullName: e.target.value })}
                                    placeholder="e.g., John Murphy"
                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1F2937] mb-2">
                                    Email Address <span className="text-[#EF4444]">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={newStaffData.email}
                                    onChange={(e) => setNewStaffData({ ...newStaffData, email: e.target.value })}
                                    placeholder="e.g., john.murphy@mployus.ie"
                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1F2937] mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={newStaffData.phone}
                                    onChange={(e) => setNewStaffData({ ...newStaffData, phone: e.target.value })}
                                    placeholder="e.g., +353 1 234 5678"
                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1F2937] mb-2">
                                        Role <span className="text-[#EF4444]">*</span>
                                    </label>
                                    <select
                                        value={newStaffData.role}
                                        onChange={(e) => setNewStaffData({ ...newStaffData, role: e.target.value as UserRole })}
                                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                    >
                                        <option value="staff">Staff Worker</option>
                                        <option value="admin">Administrator</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#1F2937] mb-2">
                                        Department
                                    </label>
                                    <select
                                        value={newStaffData.department}
                                        onChange={(e) => setNewStaffData({ ...newStaffData, department: e.target.value })}
                                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                    >
                                        <option>Operations</option>
                                        <option>Finance</option>
                                        <option>Human Resources</option>
                                        <option>Administration</option>
                                    </select>
                                </div>
                            </div>

                            <div className="p-4 bg-[#FEF3C7] border border-[#FDE68A] rounded-lg">
                                <p className="text-xs text-[#92400E]">
                                    <strong>Note:</strong> A temporary password will be sent to the user's email address. They will be required to change it on first login.
                                </p>
                            </div>
                        </div>

                        {/* Dialog Footer */}
                        <div className="p-6 border-t border-[#E5E7EB] bg-[#F9FAFB] rounded-b-xl flex justify-end gap-3">
                            <button
                                onClick={() => setShowAddStaffDialog(false)}
                                className="px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg hover:bg-white text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddStaff}
                                disabled={!newStaffData.fullName || !newStaffData.email}
                                className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] text-sm flex items-center gap-2 disabled:bg-[#D1D5DB] disabled:cursor-not-allowed"
                            >
                                <UserPlus className="w-4 h-4" />
                                Add Staff Member
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Integration Dialog */}
            {showAddIntegrationDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 font-sans">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
                        {/* Dialog Header */}
                        <div className="p-6 border-b border-[#E5E7EB]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#EFF6FF] rounded-lg flex items-center justify-center">
                                        <Plus className="w-5 h-5 text-[#3B82F6]" />
                                    </div>
                                    <div>
                                        <h3 className="text-[#1F2937] font-bold text-lg" style={{ fontWeight: 700 }}>Add New Integration</h3>
                                        <p className="text-xs text-[#6B7280]">Connect a new custom third-party service</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowAddIntegrationDialog(false)}
                                    className="text-[#6B7280] hover:text-[#1F2937]"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Dialog Content */}
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#1F2937] mb-2">
                                    Integration Name <span className="text-[#EF4444]">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newIntegrationData.name}
                                    onChange={(e) => setNewIntegrationData({ ...newIntegrationData, name: e.target.value })}
                                    placeholder="e.g., Slack Webhook, Zapier Sync"
                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1F2937] mb-2">
                                    Description <span className="text-[#EF4444]">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newIntegrationData.description}
                                    onChange={(e) => setNewIntegrationData({ ...newIntegrationData, description: e.target.value })}
                                    placeholder="e.g., Broadcast emergency unfilled shift alerts to team channels"
                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1F2937] mb-2">
                                        Provider Type <span className="text-[#EF4444]">*</span>
                                    </label>
                                    <select
                                        value={newIntegrationData.provider}
                                        onChange={(e) => setNewIntegrationData({ ...newIntegrationData, provider: e.target.value })}
                                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-sm"
                                    >
                                        <option value="Webhook">Webhook Integration</option>
                                        <option value="Slack">Slack Webhook</option>
                                        <option value="Stripe">Stripe API</option>
                                        <option value="Zapier">Zapier Automation</option>
                                        <option value="Twilio">Twilio API</option>
                                        <option value="Airtable">Airtable Integration</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#1F2937] mb-2">
                                        API Key / Webhook URL
                                    </label>
                                    <input
                                        type="password"
                                        value={newIntegrationData.apiKey}
                                        onChange={(e) => setNewIntegrationData({ ...newIntegrationData, apiKey: e.target.value })}
                                        placeholder="••••••••••••••••"
                                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1F2937] mb-2">
                                    Webhook Endpoint (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={newIntegrationData.webhookUrl}
                                    onChange={(e) => setNewIntegrationData({ ...newIntegrationData, webhookUrl: e.target.value })}
                                    placeholder="https://api.yourdomain.com/v1/webhook"
                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-sm"
                                />
                            </div>
                        </div>

                        {/* Dialog Footer */}
                        <div className="p-6 border-t border-[#E5E7EB] bg-[#F9FAFB] rounded-b-xl flex justify-end gap-3">
                            <button
                                onClick={() => setShowAddIntegrationDialog(false)}
                                className="px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg hover:bg-white text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    const newInt = {
                                        id: `int-${Date.now()}`,
                                        name: newIntegrationData.name,
                                        description: newIntegrationData.description,
                                        provider: newIntegrationData.provider,
                                        status: 'connected'
                                    };
                                    setCustomIntegrations([newInt, ...customIntegrations]);
                                    setShowAddIntegrationDialog(false);
                                    setNewIntegrationData({
                                        name: '',
                                        description: '',
                                        provider: 'Webhook',
                                        apiKey: '',
                                        webhookUrl: ''
                                    });
                                    toast.success(`${newInt.name} added and connected successfully!`);
                                }}
                                disabled={!newIntegrationData.name || !newIntegrationData.description}
                                className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] text-sm flex items-center gap-2 disabled:bg-[#D1D5DB] disabled:cursor-not-allowed font-medium"
                            >
                                <Plus className="w-4 h-4" />
                                Add Integration
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}