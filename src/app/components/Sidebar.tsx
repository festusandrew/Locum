import { useState } from 'react';
import {
    LayoutDashboard, Users, Calendar, Building2, FileText,
    Clock, Wallet, ShieldCheck, MessageCircle, Star, BarChart3,
    Settings, AlertTriangle, Sparkles, ChevronDown, ChevronRight,
    LogOut
} from 'lucide-react';
import { useUserRole } from '../contexts/UserRoleContext';
import logoImg from '../logo.png';

interface SidebarProps {
    currentPage: string;
    onNavigate: (page: string) => void;
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

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
    const { role, setRole } = useUserRole();
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

    const navGroups: NavGroup[] = [
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

    const toggleGroup = (label: string) => {
        setCollapsed(prev => ({ ...prev, [label]: !prev[label] }));
    };

    return (
        <div className="w-[240px] bg-white h-screen fixed left-0 top-0 flex flex-col border-r border-[#E5E7EB] z-40">
            <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                    <img src={logoImg} alt="MployUs Locum Management" className="h-16 w-auto object-contain" />
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-2 overflow-y-auto">
                {navGroups.map((group) => (
                    <div key={group.label} className="mb-1">
                        <button
                            onClick={() => toggleGroup(group.label)}
                            className="w-full flex items-center justify-between px-5 py-2 text-[10px] tracking-wider text-[#9CA3AF] hover:text-[#6B7280]"
                        >
                            <span>{group.label}</span>
                            {collapsed[group.label] ? (
                                <ChevronRight className="w-3 h-3" />
                            ) : (
                                <ChevronDown className="w-3 h-3" />
                            )}
                        </button>
                        {!collapsed[group.label] && (
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
                                                    ? 'bg-[#10B981] text-white shadow-sm'
                                                    : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#1F2937]'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <Icon className="w-[18px] h-[18px]" />
                                                <span style={{ fontSize: '13px' }}>{item.label}</span>
                                            </div>
                                            {item.badge && (
                                                <span className={`${item.badgeColor || 'bg-[#10B981]'} text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${isActive ? 'bg-white/25 text-white' : ''}`}>
                                                    {item.badge}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            {/* User Profile */}
            <div className="px-3 pb-3 border-t border-[#E5E7EB] pt-3">
                <div className="flex items-center gap-2.5 px-2">
                    <div className="w-8 h-8 bg-[#10B981] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">OM</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#1F2937] truncate" style={{ fontWeight: 600 }}>Omar Murphy</p>
                        <p className="text-[11px] text-[#9CA3AF] truncate">
                            {role === 'admin' ? 'Admin' : 'Staff Worker'}
                        </p>
                    </div>
                    <button className="p-1 text-[#9CA3AF] hover:text-[#EF4444] rounded">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}