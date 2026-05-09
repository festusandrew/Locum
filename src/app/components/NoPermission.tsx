import { ShieldAlert } from 'lucide-react';

export function NoPermission() {
    return (
        <div className="p-6">
            <div className="flex items-center justify-center min-h-[500px]">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-[#FEE2E2] rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldAlert className="w-10 h-10 text-[#EF4444]" />
                    </div>
                    <h3 className="text-[#1F2937] mb-2">Access Denied</h3>
                    <p className="text-sm text-[#6B7280] mb-6">
                        You don't have permission to access this page. Please contact your system administrator if you believe this is an error.
                    </p>
                    <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
                        <p className="text-xs text-[#6B7280]">
                            Your current role has limited access to certain features of the platform. If you need access to additional features, please speak with your administrator about upgrading your permissions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
