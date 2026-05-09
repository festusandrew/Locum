import { useState } from 'react';
import { X, Users, Calendar, Building2, FileText, Clock, Pill } from 'lucide-react';

interface CreateDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate?: (page: string) => void;
}

type CreateOption = {
    id: string;
    title: string;
    description: string;
    icon: any;
    color: string;
    page?: string;
};

export function CreateDialog({ isOpen, onClose, onNavigate }: CreateDialogProps) {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const createOptions: CreateOption[] = [
        {
            id: 'locum',
            title: 'New Locum',
            description: 'Register a new locum professional',
            icon: Users,
            color: '#10B981',
            page: 'locums'
        },
        {
            id: 'shift',
            title: 'New Shift',
            description: 'Create a new shift posting',
            icon: Clock,
            color: '#3B82F6',
            page: 'shifts'
        },
        {
            id: 'facility',
            title: 'New Client / Facility',
            description: 'Add a new healthcare facility',
            icon: Building2,
            color: '#8B5CF6',
            page: 'clients'
        },
        {
            id: 'invoice',
            title: 'New Invoice',
            description: 'Generate a client invoice',
            icon: FileText,
            color: '#F59E0B',
            page: 'payroll'
        },
        {
            id: 'compliance',
            title: 'Compliance Document',
            description: 'Upload compliance documentation',
            icon: FileText,
            color: '#EF4444',
            page: 'compliance'
        },
        {
            id: 'broadcast',
            title: 'Send Broadcast',
            description: 'Send a message to locums or clients',
            icon: Calendar,
            color: '#06B6D4',
            page: 'communications'
        }
    ];

    const handleOptionClick = (option: CreateOption) => {
        setSelectedOption(option.id);

        // Navigate to the relevant page if specified
        if (option.page && onNavigate) {
            setTimeout(() => {
                onNavigate(option.page!);
                onClose();
                setSelectedOption(null);
            }, 300);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
                    <div>
                        <h2 className="text-[#1F2937]">Create New</h2>
                        <p className="text-sm text-[#6B7280] mt-1">Choose what you'd like to create</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F9FAFB] transition-colors"
                    >
                        <X className="w-5 h-5 text-[#6B7280]" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                    <div className="grid grid-cols-2 gap-4">
                        {createOptions.map((option) => {
                            const Icon = option.icon;
                            const isSelected = selectedOption === option.id;

                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleOptionClick(option)}
                                    className={`p-4 rounded-lg text-left transition-all hover:shadow-sm ${isSelected
                                            ? 'bg-[#10B981]/5 shadow-sm'
                                            : 'bg-white hover:bg-[#F9FAFB]'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                            style={{ backgroundColor: `${option.color}15` }}
                                        >
                                            <Icon className="w-5 h-5" style={{ color: option.color }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-[#1F2937] mb-1">{option.title}</h3>
                                            <p className="text-sm text-[#6B7280] leading-relaxed">
                                                {option.description}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Quick Actions Section */}
                    <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
                        <h3 className="text-sm text-[#6B7280] mb-3">Quick Actions</h3>
                        <div className="flex flex-wrap gap-2">
                            <button className="px-4 py-2 bg-[#F9FAFB] text-[#6B7280] rounded-lg text-sm hover:bg-[#F3F4F6] transition-colors">
                                Import from CSV
                            </button>
                            <button className="px-4 py-2 bg-[#F9FAFB] text-[#6B7280] rounded-lg text-sm hover:bg-[#F3F4F6] transition-colors">
                                Bulk Create
                            </button>
                            <button className="px-4 py-2 bg-[#F9FAFB] text-[#6B7280] rounded-lg text-sm hover:bg-[#F3F4F6] transition-colors">
                                Use Template
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E5E7EB] bg-[#F9FAFB]">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-[#6B7280] hover:text-[#1F2937] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={!selectedOption}
                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${selectedOption
                                ? 'bg-[#10B981] text-white hover:bg-[#059669]'
                                : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                            }`}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}