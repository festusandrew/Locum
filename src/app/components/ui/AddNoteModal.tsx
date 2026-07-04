import React, { useState, useEffect } from 'react';
import { X, MessageSquare } from 'lucide-react';

interface Note {
    id?: string;
    date?: string;
    author: string;
    content: string;
    isArchived?: boolean;
}

interface AddNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddNote: (note: Note) => void;
    defaultAuthor?: string;
    title?: string;
    placeholder?: string;
    noteToEdit?: Note | null;
}

export function AddNoteModal({
    isOpen,
    onClose,
    onAddNote,
    defaultAuthor = 'System Admin',
    title = 'Add Internal Note',
    placeholder = 'Type note content here...',
    noteToEdit = null
}: AddNoteModalProps) {
    const [author, setAuthor] = useState(defaultAuthor);
    const [content, setContent] = useState('');

    useEffect(() => {
        if (noteToEdit) {
            setAuthor(noteToEdit.author);
            setContent(noteToEdit.content);
        } else {
            setAuthor(defaultAuthor);
            setContent('');
        }
    }, [noteToEdit, isOpen, defaultAuthor]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        onAddNote({
            id: noteToEdit?.id || Math.random().toString(36).substring(2, 11),
            date: noteToEdit?.date || new Date().toISOString().split('T')[0],
            author: author.trim() || defaultAuthor,
            content: content.trim(),
            isArchived: noteToEdit?.isArchived || false
        });
        setContent('');
        onClose();
    };

    const modalTitle = noteToEdit ? (title.startsWith('Add') ? title.replace('Add', 'Edit') : 'Edit Note') : title;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-[#10B981]" />
                        <h3 className="text-lg font-semibold text-[#1F2937]">{modalTitle}</h3>
                    </div>
                    <button 
                        type="button"
                        onClick={onClose} 
                        className="text-[#9CA3AF] hover:text-[#6B7280] p-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-xs text-[#6B7280] font-medium mb-1">Author Name</label>
                            <input
                                type="text"
                                placeholder={defaultAuthor}
                                value={author}
                                onChange={e => setAuthor(e.target.value)}
                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-[#6B7280] font-medium mb-1">Note Content</label>
                            <textarea
                                required
                                rows={4}
                                placeholder={placeholder}
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white text-[#1F2937]"
                            />
                        </div>
                    </div>
                    <div className="p-4 border-t border-[#E5E7EB] bg-[#F9FAFB] flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#4B5563] bg-white hover:bg-[#F9FAFB] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            {noteToEdit ? 'Save Changes' : 'Save Note'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
