import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
}

export function Pagination({
    currentPage,
    totalItems,
    pageSize,
    onPageChange,
}: PaginationProps) {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    
    const startIdx = (currentPage - 1) * pageSize + 1;
    const endIdx = Math.min(currentPage * pageSize, totalItems);

    const handlePrev = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const getPageNumbers = () => {
        const pages: number[] = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            let start = Math.max(1, currentPage - 2);
            let end = Math.min(totalPages, currentPage + 2);

            if (currentPage <= 3) {
                end = 5;
            } else if (currentPage >= totalPages - 2) {
                start = totalPages - 4;
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
        }
        return pages;
    };

    if (totalItems === 0) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-[#E5E7EB] bg-white">
            <div className="text-xs text-[#6B7280]">
                Showing <span className="font-semibold text-[#1F2937]">{startIdx}</span> to{' '}
                <span className="font-semibold text-[#1F2937]">{endIdx}</span> of{' '}
                <span className="font-semibold text-[#1F2937]">{totalItems}</span> entries
            </div>
            
            <div className="flex items-center gap-1">
                <button
                    type="button"
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className="p-2 border border-[#E5E7EB] rounded-lg text-[#6B7280] hover:bg-[#F9FAFB] disabled:opacity-50 disabled:hover:bg-transparent transition-colors cursor-pointer"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {getPageNumbers().map((page) => (
                    <button
                        key={page}
                        type="button"
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-1.5 border rounded-lg text-xs transition-colors cursor-pointer ${
                            currentPage === page
                                ? 'bg-[#10B981] text-white border-[#10B981] font-semibold'
                                : 'border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]'
                        }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    type="button"
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-[#E5E7EB] rounded-lg text-[#6B7280] hover:bg-[#F9FAFB] disabled:opacity-50 disabled:hover:bg-transparent transition-colors cursor-pointer"
                    aria-label="Next page"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
