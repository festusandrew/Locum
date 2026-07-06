import { useState } from 'react';
import {
    LayoutDashboard, Users, Calendar, Building2, FileText,
    Clock, Wallet, ShieldCheck, MessageCircle, Star, BarChart3,
    Settings, AlertTriangle, Sparkles, ChevronDown, ChevronRight,
    ChevronLeft, LogOut
} from 'lucide-react';
import { useUserRole } from '../contexts/UserRoleContext';
import { useSystemSettings } from '../contexts/SystemSettingsContext';
import logoImg from '../logo.png';

interface SidebarProps {
    currentPage: string;
    onNavigate: (page: string) => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    mobileOpen?: boolean;
    onCloseMobile?: () => void;
}

interface NavGroup {
    label: string;
    items: NavItem[];
}

interface NavItem {
    id: string;
    label: string;
    icon: any;
    badge?: string;
    badgeColor?: string;
}

export function Sidebar({ currentPage, onNavigate, isCollapsed, onToggleCollapse, mobileOpen, onCloseMobile }: SidebarProps) {
    const { role, setRole } = useUserRole();
    const { brandingLogo, brandingName, brandingColor, isWhitelabelActive } = useSystemSettings();
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

    const adminNavGroups: NavGroup[] = [
        {
            label: 'MAIN',
            items: [
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            ]
        },
        {
            label: 'MANAGEMENT',
            items: [
                { id: 'locums', label: 'Locum Professionals', icon: Users },
                { id: 'clients', label: 'Clients & Facilities', icon: Building2 },
                { id: 'shifts', label: 'Shifts & Booking', icon: Calendar, badge: '3', badgeColor: 'bg-[#EF4444]' },
            ]
        },
        {
            label: 'OPERATIONS',
            items: [
                { id: 'timesheets', label: 'Timesheets', icon: Clock, badge: '5', badgeColor: 'bg-[#F59E0B]' },
                { id: 'payroll', label: 'Payroll & Invoicing', icon: Wallet },
                { id: 'compliance', label: 'Compliance', icon: ShieldCheck, badge: '2', badgeColor: 'bg-[#EF4444]' },
            ]
        },
        {
            label: 'ENGAGEMENT',
            items: [
                { id: 'communications', label: 'Communications', icon: MessageCircle },
                { id: 'performance', label: 'Performance', icon: Star },
            ]
        },
        {
            label: 'INSIGHTS',
            items: [
                { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
                { id: 'alerts', label: 'Alerts & Risk', icon: AlertTriangle, badge: '4', badgeColor: 'bg-[#EF4444]' },
                { id: 'ai', label: 'AI & Automation', icon: Sparkles },
            ]
        },
        {
            label: 'SYSTEM',
            items: [
                { id: 'settings', label: 'Settings', icon: Settings },
            ]
        },
    ];

    const clientNavGroups: NavGroup[] = [
        {
            label: 'FACILITY PORTAL',
            items: [
                { id: 'dashboard', label: 'Facility Dashboard', icon: LayoutDashboard },
                { id: 'shifts', label: 'Shift Bookings', icon: Calendar, badge: '3', badgeColor: 'bg-[#EF4444]' },
            ]
        },
        {
            label: 'STAFFING & OPERATIONS',
            items: [
                { id: 'locums', label: 'Placed Locums', icon: Users },
                { id: 'timesheets', label: 'Roster Timesheets', icon: Clock, badge: '5', badgeColor: 'bg-[#F59E0B]' },
                { id: 'payroll', label: 'Invoices & Billing', icon: Wallet },
            ]
        },
        {
            label: 'PREFERENCES',
            items: [
                { id: 'settings', label: 'Facility Settings', icon: Settings },
            ]
        },
    ];

    const navGroups = isWhitelabelActive ? clientNavGroups : adminNavGroups;

    const toggleGroup = (label: string) => {
        setCollapsed(prev => ({ ...prev, [label]: !prev[label] }));
    };

    return (
        <>
            {/* Mobile Sidebar Overlay Backdrop */}
            {mobileOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 z-30 md:hidden"
                    onClick={onCloseMobile}
                />
            )}
            <div className={`bg-white h-screen fixed top-0 flex flex-col border-r border-[#E5E7EB] z-40 transition-all duration-300 ease-in-out ${
                isCollapsed ? 'md:w-[72px]' : 'md:w-[240px]'
            } ${
                mobileOpen ? 'left-0 w-[240px]' : '-left-full md:left-0'
            }`}>
                
                {/* Collapse/Expand Toggle Button */}
                <button
                    onClick={onToggleCollapse}
                    className="absolute top-6 -right-3 w-6 h-6 bg-white border border-[#E5E7EB] rounded-full hidden md:flex items-center justify-center shadow-md text-[#6B7280] hover:text-[#10B981] z-50 transition-transform hover:scale-110"
                    title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                    {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
                </button>
 
            {/* Logo area */}
            <div className={`border-b border-[#E5E7EB] flex items-center justify-center transition-all duration-300 ${isCollapsed ? 'px-2 py-5 h-[76px]' : 'px-5 py-4 h-[97px]'}`}>
                <div className="flex flex-col items-center justify-center overflow-hidden text-center">
                    {isWhitelabelActive && brandingLogo ? (
                        <>
                            <img 
                                src={brandingLogo} 
                                alt={brandingName || "Portal"} 
                                className={`object-contain rounded transition-all duration-300 ${isCollapsed ? 'h-8 w-8' : 'h-11 max-w-[140px] mb-1'}`} 
                            />
                            {!isCollapsed && (
                                <span className="text-[10px] text-[#6B7280] tracking-wider uppercase font-bold block truncate max-w-[180px]">
                                    {brandingName || "Facility Portal"}
                                </span>
                            )}
                        </>
                    ) : (
                        <img 
                            src={logoImg} 
                            alt="MployUs" 
                            className={`object-contain transition-all duration-300 ${isCollapsed ? 'h-7 w-7' : 'h-14 w-auto'}`} 
                        />
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-2 overflow-y-auto scrollbar-thin">
                {navGroups.map((group, idx) => (
                    <div key={group.label} className="mb-1">
                        {isCollapsed ? (
                            idx > 0 && <div className="border-t border-[#F3F4F6] my-2 mx-4 animate-in fade-in duration-300" />
                        ) : (
                            <button
                                onClick={() => toggleGroup(group.label)}
                                className="w-full flex items-center justify-between px-5 py-2 text-[10px] tracking-wider text-[#9CA3AF] hover:text-[#6B7280]"
                            >
                                <span>{group.label}</span>
                                {collapsed[group.label] ? (
                                    <ChevronRight className="w-3.5 h-3.5" />
                                ) : (
                                    <ChevronDown className="w-3.5 h-3.5" />
                                )}
                            </button>
                        )}
                        
                        {(!isCollapsed && !collapsed[group.label]) ? (
                            <div className="space-y-0.5 px-3">
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = currentPage === item.id ||
                                        (item.id === 'locums' && currentPage === 'locumProfile') ||
                                        (item.id === 'clients' && currentPage === 'facilityProfile');
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => onNavigate(item.id)}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-150 ${isActive
                                                    ? 'text-white shadow-sm'
                                                    : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#1F2937]'
                                                }`}
                                            style={isActive ? { backgroundColor: isWhitelabelActive ? brandingColor : '#10B981' } : undefined}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <Icon className="w-[18px] h-[18px]" />
                                                <span style={{ fontSize: '13px' }}>{item.label}</span>
                                            </div>
                                            {item.badge && (
                                                <span 
                                                    className={`text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${isActive ? 'bg-white/25 text-white' : item.badgeColor || 'bg-[#10B981]'}`}
                                                    style={!isActive ? { backgroundColor: isWhitelabelActive ? brandingColor : '#10B981' } : undefined}
                                                >
                                                    {item.badge}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : isCollapsed ? (
                            <div className="space-y-1.5 px-2">
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = currentPage === item.id ||
                                        (item.id === 'locums' && currentPage === 'locumProfile') ||
                                        (item.id === 'clients' && currentPage === 'facilityProfile');
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => onNavigate(item.id)}
                                            className={`w-10 h-10 mx-auto flex items-center justify-center rounded-lg transition-all duration-150 relative group ${isActive
                                                    ? 'text-white shadow-sm'
                                                    : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#1F2937]'
                                                }`}
                                            style={isActive ? { backgroundColor: isWhitelabelActive ? brandingColor : '#10B981' } : undefined}
                                        >
                                            <Icon className="w-[18px] h-[18px]" />
                                            {item.badge && (
                                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full ring-2 ring-white" />
                                            )}
                                            
                                            {/* Premium Floating Tooltip on Hover */}
                                            <div className="absolute left-14 pl-1 hidden group-hover:block z-50">
                                                <div className="bg-[#1F2937] text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg shadow-xl whitespace-nowrap flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-150">
                                                    {item.label}
                                                    {item.badge && (
                                                        <span className={`${item.badgeColor || 'bg-[#10B981]'} text-white text-[9px] px-1.5 py-0.5 rounded-full`}>
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : null}
                    </div>
                ))}
            </nav>

            {/* User Profile */}
            <div className="px-3 pb-4 border-t border-[#E5E7EB] pt-4">
                {isCollapsed ? (
                    <div className="relative group flex items-center justify-center">
                        <div 
                            className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:ring-2 transition-all"
                            style={{ 
                                backgroundColor: isWhitelabelActive ? brandingColor : '#10B981',
                                boxShadow: `0 0 0 2px ${isWhitelabelActive ? brandingColor + '20' : '#10B98120'}`
                            }}
                        >
                            <span className="text-white text-xs font-semibold">OM</span>
                        </div>
                        
                        {/* Premium Tooltip with Profile Details & Quick Actions */}
                        <div className="absolute left-14 bottom-0 pl-1 hidden group-hover:block z-50">
                            <div className="bg-white border border-[#E5E7EB] rounded-xl p-3 shadow-xl min-w-[160px] animate-in fade-in slide-in-from-left-2 duration-150">
                                <p className="text-xs text-[#1F2937] font-semibold">Omar Murphy</p>
                                <p className="text-[10px] text-[#9CA3AF] mb-2">{role === 'admin' ? 'Admin' : 'Staff Worker'}</p>
                                <div className="border-t border-[#F3F4F6] pt-2">
                                    <button 
                                        className="w-full flex items-center gap-2 text-left text-xs text-[#EF4444] hover:bg-[#FEF2F2] p-1.5 rounded-lg transition-colors"
                                        onClick={() => console.log('Logged out')}
                                    >
                                        <LogOut className="w-3.5 h-3.5" />
                                        <span>Log Out</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2.5 px-2">
                        <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: isWhitelabelActive ? brandingColor : '#10B981' }}
                        >
                            <span className="text-white text-xs font-semibold">OM</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-[#1F2937] truncate" style={{ fontWeight: 600 }}>Omar Murphy</p>
                            <p className="text-[11px] text-[#9CA3AF] truncate">
                                {role === 'admin' ? 'Admin' : 'Staff Worker'}
                            </p>
                        </div>
                        <button className="p-1 text-[#9CA3AF] hover:text-[#EF4444] rounded transition-colors">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    </>
);
}