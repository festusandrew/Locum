import { useState, useEffect } from 'react';
import { UserRoleProvider, useUserRole } from './contexts/UserRoleContext';
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
import { Mail, Bell, Search, Plus, ChevronRight } from 'lucide-react';
import { Toaster } from './components/ui/sonner';

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
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [globalSearch, setGlobalSearch] = useState('');
    const [selectedProfileId, setSelectedProfileId] = useState<string>(initialUrl.id);
    const { permissions, role } = useUserRole();

    const setCurrentPage = (page: string) => {
        const detailPages = ['locumProfile', 'facilityProfile', 'shiftDetail', 'timesheetDetail', 'complianceDetail'];
        if (!detailPages.includes(page)) {
            setSelectedProfileId('');
        }
        setCurrentPageState(page);
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
                return <ShiftDetailPage shiftId={selectedProfileId} onBack={() => setCurrentPage('shifts')} />;
            case 'timesheetDetail':
                return <TimesheetDetailPage timesheetId={selectedProfileId} onBack={() => setCurrentPage('timesheets')} />;
            case 'complianceDetail':
                return <ComplianceDetailPage locumId={selectedProfileId} onBack={() => setCurrentPage('compliance')} />;
            default:
                return <DashboardOverview onNavigate={setCurrentPage} />;
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5F5]">
            <Sidebar 
                currentPage={currentPage} 
                onNavigate={setCurrentPage} 
                isCollapsed={sidebarCollapsed} 
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
            />

            <div className={`transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'ml-[72px]' : 'ml-[240px]'}`}>
                {/* Top Header */}
                <div className="bg-white border-b border-[#E5E7EB] px-6 py-3 sticky top-0 z-30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <nav className="flex items-center gap-1 text-sm">
                                <button onClick={() => setCurrentPage('dashboard')} className="text-[#9CA3AF] hover:text-[#6B7280]">Home</button>
                                <ChevronRight className="w-3.5 h-3.5 text-[#D1D5DB]" />
                                {currentPage === 'locumProfile' && (
                                    <>
                                        <button onClick={() => setCurrentPage('locums')} className="text-[#9CA3AF] hover:text-[#6B7280]">Locum Professionals</button>
                                        <ChevronRight className="w-3.5 h-3.5 text-[#D1D5DB]" />
                                    </>
                                )}
                                {currentPage === 'facilityProfile' && (
                                    <>
                                        <button onClick={() => setCurrentPage('clients')} className="text-[#9CA3AF] hover:text-[#6B7280]">Clients & Facilities</button>
                                        <ChevronRight className="w-3.5 h-3.5 text-[#D1D5DB]" />
                                    </>
                                )}
                                {currentPage === 'shiftDetail' && (
                                    <>
                                        <button onClick={() => setCurrentPage('shifts')} className="text-[#9CA3AF] hover:text-[#6B7280]">Shifts & Booking</button>
                                        <ChevronRight className="w-3.5 h-3.5 text-[#D1D5DB]" />
                                    </>
                                )}
                                {currentPage === 'timesheetDetail' && (
                                    <>
                                        <button onClick={() => setCurrentPage('timesheets')} className="text-[#9CA3AF] hover:text-[#6B7280]">Timesheets & Attendance</button>
                                        <ChevronRight className="w-3.5 h-3.5 text-[#D1D5DB]" />
                                    </>
                                )}
                                {currentPage === 'complianceDetail' && (
                                    <>
                                        <button onClick={() => setCurrentPage('compliance')} className="text-[#9CA3AF] hover:text-[#6B7280]">Compliance & Credentialing</button>
                                        <ChevronRight className="w-3.5 h-3.5 text-[#D1D5DB]" />
                                    </>
                                )}
                                <span className="text-[#1F2937]" style={{ fontWeight: 500 }}>{pageLabels[currentPage] || 'Dashboard'}</span>
                            </nav>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Global Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                                <input
                                    type="text"
                                    placeholder="Search anything..."
                                    value={globalSearch}
                                    onChange={(e) => setGlobalSearch(e.target.value)}
                                    className="pl-9 pr-4 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] w-64 bg-[#F9FAFB]"
                                />
                            </div>
                            <button className="relative w-9 h-9 bg-white border border-[#E5E7EB] rounded-lg flex items-center justify-center hover:bg-[#F9FAFB] transition-colors">
                                <Mail className="w-4 h-4 text-[#6B7280]" />
                            </button>
                            <button className="relative w-9 h-9 bg-white border border-[#E5E7EB] rounded-lg flex items-center justify-center hover:bg-[#F9FAFB] transition-colors">
                                <Bell className="w-4 h-4 text-[#6B7280]" />
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#EF4444] text-white text-[9px] rounded-full flex items-center justify-center">4</span>
                            </button>
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
        <UserRoleProvider>
            <AppContent />
        </UserRoleProvider>
    );
}