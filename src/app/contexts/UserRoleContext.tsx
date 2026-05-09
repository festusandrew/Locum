import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'staff';

export interface Permission {
    canViewTransactions: boolean;
    canViewCompliance: boolean;
    canViewNotifications: boolean;
    canViewReports: boolean;
    canCreateEntities: boolean;
    canEditEntities: boolean;
    canDeleteEntities: boolean;
    canExportData: boolean;
    canManageUsers: boolean;
}

interface UserRoleContextType {
    role: UserRole;
    setRole: (role: UserRole) => void;
    permissions: Permission;
    hasPermission: (permission: keyof Permission) => boolean;
}

const rolePermissions: Record<UserRole, Permission> = {
    admin: {
        canViewTransactions: true,
        canViewCompliance: true,
        canViewNotifications: true,
        canViewReports: true,
        canCreateEntities: true,
        canEditEntities: true,
        canDeleteEntities: true,
        canExportData: true,
        canManageUsers: true,
    },
    staff: {
        canViewTransactions: false,
        canViewCompliance: false,
        canViewNotifications: false,
        canViewReports: false,
        canCreateEntities: false,
        canEditEntities: false,
        canDeleteEntities: false,
        canExportData: false,
        canManageUsers: false,
    },
};

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: ReactNode }) {
    const [role, setRole] = useState<UserRole>('admin'); // Default to admin

    const permissions = rolePermissions[role];

    const hasPermission = (permission: keyof Permission) => {
        return permissions[permission];
    };

    return (
        <UserRoleContext.Provider value={{ role, setRole, permissions, hasPermission }}>
            {children}
        </UserRoleContext.Provider>
    );
}

export function useUserRole() {
    const context = useContext(UserRoleContext);
    if (context === undefined) {
        throw new Error('useUserRole must be used within a UserRoleProvider');
    }
    return context;
}
