import { useState, useEffect } from 'react';
import { UserRoleProvider, useUserRole } from './contexts/UserRoleContext';
import { SystemSettingsProvider, useSystemSettings, RegionType } from './contexts/SystemSettingsContext';
import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { LocumManagement } from './components/LocumManagement';
import { ClientManagement } from './components/ClientManagement';
import { ShiftBooking } from './components/ShiftBooking';
import { TimesheetsAttendance } from './components/TimesheetsAttendance';
import { PayrollInvoicing } from './components/PayrollInvoicing';
import { Compliance } from './components/Compliance';
import { Communications } from './components/Communications';
import { PerformanceRatings } from './components/PerformanceRatings';
import { Reports } from './components/Reports';
import { AlertsRisk } from './components/AlertsRisk';
import { AIAutomation } from './components/AIAutomation';
import { Settings } from './components/Settings';
import { NoPermission } from './components/NoPermission';
import { CreateDialog } from './components/CreateDialog';
import { LocumProfilePage } from './components/LocumProfilePage';
import { FacilityProfilePage } from './components/FacilityProfilePage';
import { ShiftDetailPage } from './components/ShiftDetailPage';
import { TimesheetDetailPage } from './components/TimesheetDetailPage';
import { ComplianceDetailPage } from './components/ComplianceDetailPage';
import { Mail, Bell, Search, Plus, ChevronRight, Globe, ChevronDown, Menu } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

const pageLabels: Record<string, string> = {
    dashboard: 'Dashboard',
    locums: 'Locum Professionals',
    clients: 'Clients & Facilities',
    shifts: 'Shifts & Booking',
    timesheets: 'Timesheets & Attendance',
    payroll: 'Payroll & Invoicing',
    compliance: 'Compliance & Credentialing',
    communications: 'Communications',
    performance: 'Performance & Ratings',
    reports: 'Reports & Analytics',
    alerts: 'Alerts & Risk Management',
    ai: 'AI & Automation',
    settings: 'System Settings',
    locumProfile: 'Locum Profile',
    facilityProfile: 'Facility Profile',
    shiftDetail: 'Shift Details',
    timesheetDetail: 'Timesheet Details',
    complianceDetail: 'Compliance Details',
};

const parseUrl = () => {
    let path = window.location.pathname.replace(/^\/|\/$/g, '');
    const validPages = [
        'dashboard', 'locums', 'clients', 'shifts', 'timesheets', 'payroll',
        'compliance', 'communications', 'performance', 'reports', 'alerts',
        'ai', 'settings', 'locumProfile', 'facilityProfile', 'shiftDetail',
        'timesheetDetail', 'complianceDetail'
    ];
    if (!validPages.includes(path)) {
        path = 'dashboard';
    }
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id') || '';
    return { page: path, id };
};

function AppContent() {
    const initialUrl = parseUrl();
    const [currentPage, setCurrentPageState] = useState(initialUrl.page);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [globalSearch, setGlobalSearch] = useState('');
    const [selectedProfileId, setSelectedProfileId] = useState<string>(initialUrl.id);
    const { permissions, role } = useUserRole();
    const { 
        region, setRegion, autoDetect, setAutoDetect, detectedInfo, isDetecting,
        isWhitelabelActive, brandingName, brandingColor, brandingLogo, setIsWhitelabelActive, setBrandingFacilityId 
    } = useSystemSettings();
    const [showRegionDropdown, setShowRegionDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Compliance Expired', message: 'Garda Vetting for Emily Chen has expired.', time: '10m ago', unread: true, type: 'critical' },
        { id: 2, title: 'Urgent Shift Unfilled', message: 'Night shift at Beaumont Hospital remains unfilled.', time: '1h ago', unread: true, type: 'warning' },
        { id: 3, title: 'Timesheet Submitted', message: 'Sarah Mitchell submitted timesheet TS-2026-001.', time: '3h ago', unread: true, type: 'info' },
        { id: 4, title: 'Compliance Expiring', message: 'Medical License for David Thompson expires in 3 days.', time: '5h ago', unread: true, type: 'warning' },
    ]);

    // Automatically route to facility dashboard if an administrator enters whitelabel portal view from an invalid client page
    useEffect(() => {
        if (isWhitelabelActive) {
            const allowedPages = ['dashboard', 'shifts', 'locums', 'timesheets', 'payroll', 'settings', 'shiftDetail', 'timesheetDetail'];
            if (!allowedPages.includes(currentPage)) {
                setCurrentPageState('dashboard');
            }
        }
    }, [isWhitelabelActive]);

    const setCurrentPage = (page: string) => {
        const detailPages = ['locumProfile', 'facilityProfile', 'shiftDetail', 'timesheetDetail', 'complianceDetail'];
        if (!detailPages.includes(page)) {
            setSelectedProfileId('');
        }
        setCurrentPageState(page);
        setMobileSidebarOpen(false);
    };

    // Synchronize local state with URL
    useEffect(() => {
        const syncUrlWithState = () => {
            const { page, id } = parseUrl();
            if (page !== currentPage || id !== selectedProfileId) {
                let url = `/${currentPage}`;
                if (selectedProfileId) {
                    url += `?id=${selectedProfileId}`;
                }
                window.history.pushState({ page: currentPage, id: selectedProfileId }, '', url);
            }
        };
        syncUrlWithState();
    }, [currentPage, selectedProfileId]);

    // Handle back/forward popstate
    useEffect(() => {
        const handlePopState = () => {
            const { page, id } = parseUrl();
            setCurrentPageState(page);
            setSelectedProfileId(id);
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const handleViewLocumProfile = (id: string) => {
        setSelectedProfileId(id);
        setCurrentPage('locumProfile');
    };

    const handleViewFacilityProfile = (id: string) => {
        setSelectedProfileId(id);
        setCurrentPage('facilityProfile');
    };

    const handleViewShiftDetail = (id: string) => {
        setSelectedProfileId(id);
        setCurrentPage('shiftDetail');
    };

    const handleViewTimesheetDetail = (id: string) => {
        setSelectedProfileId(id);
        setCurrentPage('timesheetDetail');
    };

    const handleViewComplianceDetail = (id: string) => {
        setSelectedProfileId(id);
        setCurrentPage('complianceDetail');
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <DashboardOverview onNavigate={setCurrentPage} />;
            case 'locums':
                return <LocumManagement onViewProfile={handleViewLocumProfile} />;
            case 'clients':
                return <ClientManagement onViewProfile={handleViewFacilityProfile} />;
            case 'shifts':
                return <ShiftBooking onViewShiftDetail={handleViewShiftDetail} />;
            case 'timesheets':
                return <TimesheetsAttendance onViewTimesheetDetail={handleViewTimesheetDetail} />;
            case 'payroll':
                return permissions.canViewTransactions ? <PayrollInvoicing /> : <NoPermission />;
            case 'compliance':
                return permissions.canViewCompliance ? <Compliance onViewComplianceDetail={handleViewComplianceDetail} /> : <NoPermission />;
            case 'communications':
                return <Communications />;
            case 'performance':
                return <PerformanceRatings />;
            case 'reports':
                return permissions.canViewReports ? <Reports /> : <NoPermission />;
            case 'alerts':
                return <AlertsRisk />;
            case 'ai':
                return <AIAutomation />;
            case 'settings':
                return <Settings />;
            case 'locumProfile':
                return <LocumProfilePage locumId={selectedProfileId} onBack={() => setCurrentPage('locums')} />;
            case 'facilityProfile':
                return <FacilityProfilePage facilityId={selectedProfileId} onBack={() => setCurrentPage('clients')} />;
            case 'shiftDetail':
                return (
                    <ShiftDetailPage 
                        shiftId={selectedProfileId} 
                        onBack={() => setCurrentPage('shifts')} 
                        onViewLocumProfile={handleViewLocumProfile}
                    />
                );
            case 'timesheetDetail':
                return (
                    <TimesheetDetailPage 
                        timesheetId={selectedProfileId} 
                        onBack={() => setCurrentPage('timesheets')} 
                        onViewLocumProfile={handleViewLocumProfile}
                        onViewFacilityProfile={handleViewFacilityProfile}
                    />
                );
            case 'complianceDetail':
                return <ComplianceDetailPage locumId={selectedProfileId} onBack={() => setCurrentPage('compliance')} />;
            default:
                return <DashboardOverview onNavigate={setCurrentPage} />;
        }
    };

    const getPageTitle = () => {
        if (isWhitelabelActive) {
            const clientLabels: Record<string, string> = {
                dashboard: 'Facility Dashboard',
                shifts: 'Shift Bookings',
                locums: 'Placed Locums',
                timesheets: 'Roster Timesheets',
                payroll: 'Invoices & Billing',
                settings: 'Facility Settings',
                shiftDetail: 'Shift Details',
                timesheetDetail: 'Timesheet Details',
            };
            return clientLabels[currentPage] || pageLabels[currentPage] || 'Dashboard';
        }
        return pageLabels[currentPage] || 'Dashboard';
    };

    const handleExitPreview = () => {
        setIsWhitelabelActive(false);
        setBrandingFacilityId(null);
        toast.success("Exited client portal preview. Returned to Agency admin mode.");
    };

    return (
        <div className="min-h-screen bg-[#F5F5F5]">
            <Sidebar 
                currentPage={currentPage} 
                onNavigate={setCurrentPage} 
                isCollapsed={sidebarCollapsed} 
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
                mobileOpen={mobileSidebarOpen}
                onCloseMobile={() => setMobileSidebarOpen(false)}
            />

            <div className={`transition-all duration-300 ease-in-out ml-0 ${sidebarCollapsed ? 'md:ml-[72px]' : 'md:ml-[240px]'}`}>
                {/* Active Client Preview Banner */}
                {isWhitelabelActive && (
                    <div className="px-6 py-2.5 bg-[#FEF3C7] border-b border-[#F59E0B] flex items-center justify-between text-xs font-semibold animate-in slide-in-from-top duration-300">
                        <div className="flex items-center gap-2.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: brandingColor || '#10B981' }}></span>
                                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: brandingColor || '#10B981' }}></span>
                            </span>
                            <span className="text-[#92400E]">
                                PREVIEW PORTAL ACTIVE: Viewing as <strong className="font-extrabold text-[#78350F]">{brandingName || "Healthcare Client"}</strong>
                            </span>
                            <span className="text-[#D97706] font-normal">|</span>
                            <span className="text-[#B45309] font-medium">Co-branded styles, custom assets, and facility-focused side navigation active.</span>
                        </div>
                        <button 
                            onClick={handleExitPreview}
                            className="px-3 py-1.5 text-xs font-bold text-white rounded bg-[#D97706] hover:bg-[#B45309] shadow-sm transition-all hover:scale-105 active:scale-95"
                        >
                            Exit Preview Mode
                        </button>
                    </div>
                )}

                {/* Top Header */}
                <div className="bg-white border-b border-[#E5E7EB] px-4 md:px-6 py-3 sticky top-0 z-30">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                            <button
                                onClick={() => setMobileSidebarOpen(true)}
                                className="p-1.5 rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB] md:hidden mr-1 flex-shrink-0"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <nav className="flex items-center gap-1 text-sm overflow-x-auto whitespace-nowrap scrollbar-none pr-2">
                                <button onClick={() => setCurrentPage('dashboard')} className="text-[#9CA3AF] hover:text-[#6B7280]">Home</button>
                                <ChevronRight className="w-3.5 h-3.5 text-[#D1D5DB] flex-shrink-0" />
                                {currentPage === 'locumProfile' && (
                                    <>
                                        <button onClick={() => setCurrentPage('locums')} className="text-[#9CA3AF] hover:text-[#6B7280]">Locum Professionals</button>
                                        <ChevronRight className="w-3.5 h-3.5 text-[#D1D5DB] flex-shrink-0" />
                                    </>
                                )}
                                {currentPage === 'facilityProfile' && (
                                    <>
                                        <button onClick={() => setCurrentPage('clients')} className="text-[#9CA3AF] hover:text-[#6B7280]">Clients & Facilities</button>
                                        <ChevronRight className="w-3.5 h-3.5 text-[#D1D5DB] flex-shrink-0" />
                                    </>
                                )}
                                {currentPage === 'shiftDetail' && (
                                    <>
                                        <button onClick={() => setCurrentPage('shifts')} className="text-[#9CA3AF] hover:text-[#6B7280]">Shifts & Booking</button>
                                        <ChevronRight className="w-3.5 h-3.5 text-[#D1D5DB] flex-shrink-0" />
                                    </>
                                )}
                                {currentPage === 'timesheetDetail' && (
                                    <>
                                        <button onClick={() => setCurrentPage('timesheets')} className="text-[#9CA3AF] hover:text-[#6B7280]">Timesheets & Attendance</button>
                                        <ChevronRight className="w-3.5 h-3.5 text-[#D1D5DB] flex-shrink-0" />
                                    </>
                                )}
                                {currentPage === 'complianceDetail' && (
                                    <>
                                        <button onClick={() => setCurrentPage('compliance')} className="text-[#9CA3AF] hover:text-[#6B7280]">Compliance & Credentialing</button>
                                        <ChevronRight className="w-3.5 h-3.5 text-[#D1D5DB] flex-shrink-0" />
                                    </>
                                )}
                                <span className="text-[#1F2937] truncate" style={{ fontWeight: 500 }}>{getPageTitle()}</span>
                            </nav>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                            {/* Global Search */}
                            <div className="relative hidden sm:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                                <input
                                    type="text"
                                    placeholder="Search anything..."
                                    value={globalSearch}
                                    onChange={(e) => setGlobalSearch(e.target.value)}
                                    className="pl-9 pr-4 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] w-48 lg:w-64 bg-[#F9FAFB]"
                                />
                            </div>
                            
                            <button className="relative w-9 h-9 bg-white border border-[#E5E7EB] rounded-lg flex items-center justify-center hover:bg-[#F9FAFB] transition-colors">
                                <Mail className="w-4 h-4 text-[#6B7280]" />
                            </button>
                            <div className="relative">
                                <button 
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative w-9 h-9 bg-white border border-[#E5E7EB] rounded-lg flex items-center justify-center hover:bg-[#F9FAFB] transition-colors"
                                >
                                    <Bell className="w-4 h-4 text-[#6B7280]" />
                                    {notifications.filter(n => n.unread).length > 0 && (
                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#EF4444] text-white text-[9px] rounded-full flex items-center justify-center">
                                            {notifications.filter(n => n.unread).length}
                                        </span>
                                    )}
                                </button>
                                
                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-50 overflow-hidden">
                                        <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F9FAFB]">
                                            <h4 className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>Notifications</h4>
                                            {notifications.some(n => n.unread) && (
                                                <button 
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setNotifications(notifications.map(n => ({ ...n, unread: false })));
                                                        toast.success("All notifications marked as read");
                                                    }}
                                                    className="text-xs text-[#10B981] hover:text-[#059669]"
                                                    style={{ fontWeight: 500 }}
                                                >
                                                    Mark all read
                                                </button>
                                            )}
                                        </div>
                                        <div className="divide-y divide-[#E5E7EB] max-h-[300px] overflow-y-auto">
                                            {notifications.map(n => (
                                                <div 
                                                    key={n.id} 
                                                    onClick={() => {
                                                        setNotifications(notifications.map(item => item.id === n.id ? { ...item, unread: false } : item));
                                                        setShowNotifications(false);
                                                        setCurrentPage('communications');
                                                    }}
                                                    className={`p-3 hover:bg-[#F9FAFB] transition-colors cursor-pointer flex gap-3 text-left ${n.unread ? 'bg-[#ECFDF5]/60' : ''}`}
                                                >
                                                    <div className="flex-shrink-0 mt-1">
                                                        <div className={`w-2 h-2 rounded-full ${
                                                            n.type === 'critical' ? 'bg-[#EF4444]' : 
                                                            n.type === 'warning' ? 'bg-[#F59E0B]' : 'bg-[#3B82F6]'
                                                        }`} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs text-[#1F2937]" style={{ fontWeight: n.unread ? 600 : 400 }}>{n.title}</p>
                                                        <p className="text-[11px] text-[#6B7280] mt-0.5 leading-relaxed">{n.message}</p>
                                                        <p className="text-[9px] text-[#9CA3AF] mt-1">{n.time}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-3 border-t border-[#E5E7EB] text-center bg-[#F9FAFB]">
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    setShowNotifications(false);
                                                    setCurrentPage('communications');
                                                }}
                                                className="text-xs text-[#10B981] hover:text-[#059669]"
                                                style={{ fontWeight: 500 }}
                                            >
                                                View all notifications
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {permissions.canCreateEntities && (
                                <button
                                    onClick={() => setShowCreateDialog(true)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-[#10B981] text-white rounded-lg text-sm hover:bg-[#059669] transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Create New
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                {renderPage()}
            </div>

            {/* Create Dialog */}
            {permissions.canCreateEntities && (
                <CreateDialog
                    isOpen={showCreateDialog}
                    onClose={() => setShowCreateDialog(false)}
                    onNavigate={setCurrentPage}
                />
            )}
            <Toaster />
        </div>
    );
}

export default function App() {
    console.log("App rendered");
    return (
        <SystemSettingsProvider>
            <UserRoleProvider>
                <AppContent />
            </UserRoleProvider>
        </SystemSettingsProvider>
    );
}