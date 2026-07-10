import {
    MessageCircle,
    Send,
    Paperclip,
    Search,
    Phone,
    Mail,
    Clock,
    CheckCircle,
    AlertCircle,
    User,
    X,
    MoreVertical,
    Star,
    Archive,
    Trash2,
    Video,
    Smile
} from 'lucide-react';
import { useState } from 'react';

interface Conversation {
    id: string;
    user: string;
    lastMessage: string;
    timestamp: string;
    unread: number;
    status: 'online' | 'offline' | 'away';
    avatar?: string;
}

interface Message {
    id: string;
    sender: 'user' | 'agent';
    content: string;
    timestamp: string;
    type: 'text' | 'file';
    fileName?: string;
}

interface Ticket {
    id: string;
    subject: string;
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: string;
    created: string;
    assignee: string;
}

const conversations: Conversation[] = [
    {
        id: '1',
        user: 'Sarah Mitchell',
        lastMessage: 'Thanks for the quick response!',
        timestamp: '2 min ago',
        unread: 0,
        status: 'online'
    },
    {
        id: '2',
        user: 'James Harrison',
        lastMessage: 'I need help with my shift schedule',
        timestamp: '15 min ago',
        unread: 3,
        status: 'online'
    },
    {
        id: '3',
        user: 'Emily Chen',
        lastMessage: 'When will the payment be processed?',
        timestamp: '1 hour ago',
        unread: 1,
        status: 'away'
    },
    {
        id: '4',
        user: 'Michael Brooks',
        lastMessage: 'My compliance documents are uploaded',
        timestamp: '3 hours ago',
        unread: 0,
        status: 'offline'
    },
    {
        id: '5',
        user: 'Rachel Martinez',
        lastMessage: 'Thank you for your assistance',
        timestamp: 'Yesterday',
        unread: 0,
        status: 'offline'
    }
];

const currentMessages: Message[] = [
    {
        id: '1',
        sender: 'user',
        content: 'Hi, I need help with my shift schedule for next week.',
        timestamp: '10:30 AM',
        type: 'text'
    },
    {
        id: '2',
        sender: 'agent',
        content: 'Hello James Harrison! I\'d be happy to help you with your shift schedule. What specific issue are you experiencing?',
        timestamp: '10:31 AM',
        type: 'text'
    },
    {
        id: '3',
        sender: 'user',
        content: 'I can\'t see my shifts for Thursday and Friday at St. James\'s Hospital.',
        timestamp: '10:32 AM',
        type: 'text'
    },
    {
        id: '4',
        sender: 'agent',
        content: 'Let me check that for you. Can you please confirm your employee ID?',
        timestamp: '10:33 AM',
        type: 'text'
    },
    {
        id: '5',
        sender: 'user',
        content: 'Sure, it\'s MPLS-2847',
        timestamp: '10:34 AM',
        type: 'text'
    },
    {
        id: '6',
        sender: 'agent',
        content: 'Thank you! I can see the issue. Your shifts are scheduled but there was a sync delay. I\'m refreshing your schedule now.',
        timestamp: '10:35 AM',
        type: 'text'
    }
];

const tickets: Ticket[] = [
    {
        id: 'TICK-1247',
        subject: 'Payment not received for November shifts',
        status: 'in-progress',
        priority: 'high',
        category: 'Billing',
        created: '2024-12-10',
        assignee: 'Sarah Murphy'
    },
    {
        id: 'TICK-1246',
        subject: 'Unable to upload compliance documents',
        status: 'open',
        priority: 'urgent',
        category: 'Technical',
        created: '2024-12-11',
        assignee: 'Unassigned'
    },
    {
        id: 'TICK-1245',
        subject: 'Shift calendar not syncing with Google Calendar',
        status: 'resolved',
        priority: 'medium',
        category: 'Integration',
        created: '2024-12-09',
        assignee: 'John O\'Brien'
    },
    {
        id: 'TICK-1244',
        subject: 'Request for additional shifts in Cork',
        status: 'in-progress',
        priority: 'low',
        category: 'Scheduling',
        created: '2024-12-08',
        assignee: 'Emma Walsh'
    }
];

export function ChatSupport() {
    const [selectedView, setSelectedView] = useState<'chat' | 'tickets'>('chat');
    const [selectedConversation, setSelectedConversation] = useState(conversations[1]);
    const [messageText, setMessageText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showNewTicket, setShowNewTicket] = useState(false);
    const [categorySelect, setCategorySelect] = useState('');
    const [customCategory, setCustomCategory] = useState('');

    const handleSendMessage = () => {
        if (messageText.trim()) {
            alert(`Message sent: ${messageText}`);
            setMessageText('');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open':
                return 'bg-[#DBEAFE] text-[#3B82F6]';
            case 'in-progress':
                return 'bg-[#FEF3C7] text-[#D97706]';
            case 'resolved':
                return 'bg-[#D1FAE5] text-[#059669]';
            case 'closed':
                return 'bg-[#F3F4F6] text-[#6B7280]';
            default:
                return 'bg-[#F3F4F6] text-[#6B7280]';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent':
                return 'bg-[#FEE2E2] text-[#DC2626]';
            case 'high':
                return 'bg-[#FED7AA] text-[#C2410C]';
            case 'medium':
                return 'bg-[#FEF3C7] text-[#D97706]';
            case 'low':
                return 'bg-[#E0E7FF] text-[#6366F1]';
            default:
                return 'bg-[#F3F4F6] text-[#6B7280]';
        }
    };

    return (
        <div className="p-6">
            {/* Page Title */}
            <div className="mb-6">
                <h2 className="text-[#1F2937] mb-1">Chat & Support</h2>
                <p className="text-sm text-[#6B7280]">Communicate with locums and manage support tickets</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-5 mb-6">
                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-[#DBEAFE] rounded-lg flex items-center justify-center">
                            <MessageCircle className="w-5 h-5 text-[#3B82F6]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#1F2937]">24</p>
                        </div>
                    </div>
                    <p className="text-xs text-[#6B7280]">Active Conversations</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-[#FEF3C7] rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-[#D97706]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#1F2937]">12</p>
                        </div>
                    </div>
                    <p className="text-xs text-[#6B7280]">Pending Tickets</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-[#D1FAE5] rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-[#10B981]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#1F2937]">4.8</p>
                        </div>
                    </div>
                    <p className="text-xs text-[#6B7280]">Avg Response Time (min)</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-[#D1FAE5] rounded-lg flex items-center justify-center">
                            <Star className="w-5 h-5 text-[#F59E0B]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#1F2937]">96%</p>
                        </div>
                    </div>
                    <p className="text-xs text-[#6B7280]">Satisfaction Rate</p>
                </div>
            </div>

            {/* View Toggle */}
            <div className="mb-6 flex items-center gap-2">
                <button
                    onClick={() => setSelectedView('chat')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedView === 'chat'
                        ? 'bg-[#10B981] text-white'
                        : 'bg-white text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB]'
                        }`}
                >
                    <MessageCircle className="w-4 h-4 inline mr-2" />
                    Live Chat
                </button>
                <button
                    onClick={() => setSelectedView('tickets')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedView === 'tickets'
                        ? 'bg-[#10B981] text-white'
                        : 'bg-white text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB]'
                        }`}
                >
                    <AlertCircle className="w-4 h-4 inline mr-2" />
                    Support Tickets
                </button>
            </div>

            {/* Live Chat View */}
            {selectedView === 'chat' && (
                <div className="bg-white rounded-xl border border-[#E5E7EB] h-[600px] flex">
                    {/* Conversations List */}
                    <div className="w-80 border-r border-[#E5E7EB] flex flex-col">
                        {/* Search */}
                        <div className="p-4 border-b border-[#E5E7EB]">
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search conversations..."
                                    className="w-full pl-10 pr-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                />
                            </div>
                        </div>

                        {/* Conversation List */}
                        <div className="flex-1 overflow-y-auto">
                            {conversations.map((conversation) => (
                                <button
                                    key={conversation.id}
                                    onClick={() => setSelectedConversation(conversation)}
                                    className={`w-full p-4 border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors text-left ${selectedConversation.id === conversation.id ? 'bg-[#F0FDF4]' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="relative">
                                            <div className="w-10 h-10 bg-[#F3F4F6] rounded-full flex items-center justify-center text-sm">
                                                {conversation.user.charAt(0)}
                                            </div>
                                            <div className={`w-3 h-3 rounded-full border-2 border-white absolute bottom-0 right-0 ${conversation.status === 'online' ? 'bg-[#10B981]' :
                                                conversation.status === 'away' ? 'bg-[#F59E0B]' :
                                                    'bg-[#6B7280]'
                                                }`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-sm font-medium text-[#1F2937] truncate">{conversation.user}</p>
                                                <span className="text-xs text-[#6B7280]">{conversation.timestamp}</span>
                                            </div>
                                            <p className="text-xs text-[#6B7280] truncate">{conversation.lastMessage}</p>
                                        </div>
                                        {conversation.unread > 0 && (
                                            <div className="w-5 h-5 bg-[#10B981] rounded-full flex items-center justify-center text-xs text-white">
                                                {conversation.unread}
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col">
                        {/* Chat Header */}
                        <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 bg-[#F3F4F6] rounded-full flex items-center justify-center">
                                        {selectedConversation.user.charAt(0)}
                                    </div>
                                    <div className={`w-3 h-3 rounded-full border-2 border-white absolute bottom-0 right-0 ${selectedConversation.status === 'online' ? 'bg-[#10B981]' :
                                        selectedConversation.status === 'away' ? 'bg-[#F59E0B]' :
                                            'bg-[#6B7280]'
                                        }`} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[#1F2937]">{selectedConversation.user}</p>
                                    <p className="text-xs text-[#6B7280]">
                                        {selectedConversation.status === 'online' ? 'Active now' :
                                            selectedConversation.status === 'away' ? 'Away' :
                                                'Offline'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-[#F9FAFB] rounded-lg">
                                    <Phone className="w-5 h-5 text-[#6B7280]" />
                                </button>
                                <button className="p-2 hover:bg-[#F9FAFB] rounded-lg">
                                    <Video className="w-5 h-5 text-[#6B7280]" />
                                </button>
                                <button className="p-2 hover:bg-[#F9FAFB] rounded-lg">
                                    <MoreVertical className="w-5 h-5 text-[#6B7280]" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {currentMessages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[70%] ${message.sender === 'agent' ? 'order-2' : 'order-1'}`}>
                                        <div className={`rounded-2xl px-4 py-2 ${message.sender === 'agent'
                                            ? 'bg-[#10B981] text-white'
                                            : 'bg-[#F3F4F6] text-[#1F2937]'
                                            }`}>
                                            <p className="text-sm">{message.content}</p>
                                        </div>
                                        <p className="text-xs text-[#6B7280] mt-1 px-2">{message.timestamp}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Message Input */}
                        <div className="p-4 border-t border-[#E5E7EB]">
                            <div className="flex items-end gap-2">
                                <button className="p-2 hover:bg-[#F9FAFB] rounded-lg">
                                    <Paperclip className="w-5 h-5 text-[#6B7280]" />
                                </button>
                                <button className="p-2 hover:bg-[#F9FAFB] rounded-lg">
                                    <Smile className="w-5 h-5 text-[#6B7280]" />
                                </button>
                                <div className="flex-1">
                                    <textarea
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        placeholder="Type your message..."
                                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] resize-none"
                                        rows={1}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                    />
                                </div>
                                <button
                                    onClick={handleSendMessage}
                                    className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] flex items-center gap-2"
                                >
                                    <Send className="w-4 h-4" />
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Support Tickets View */}
            {selectedView === 'tickets' && (
                <div className="bg-white rounded-xl border border-[#E5E7EB]">
                    <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
                        <div>
                            <h3 className="text-[#1F2937]">Support Tickets</h3>
                            <p className="text-sm text-[#6B7280]">Manage and track support requests</p>
                        </div>
                        <button
                            onClick={() => setShowNewTicket(true)}
                            className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] text-sm"
                        >
                            + New Ticket
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="p-5 border-b border-[#E5E7EB] flex items-center gap-3">
                        <select className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]">
                            <option>All Status</option>
                            <option>Open</option>
                            <option>In Progress</option>
                            <option>Resolved</option>
                            <option>Closed</option>
                        </select>
                        <select className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]">
                            <option>All Priorities</option>
                            <option>Urgent</option>
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>
                        <select className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]">
                            <option>All Categories</option>
                            <option>Billing</option>
                            <option>Technical</option>
                            <option>Integration</option>
                            <option>Scheduling</option>
                        </select>
                        <div className="flex-1" />
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" />
                            <input
                                type="text"
                                placeholder="Search tickets..."
                                className="pl-10 pr-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                            />
                        </div>
                    </div>

                    {/* Tickets Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#E5E7EB]">
                                    <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Ticket ID</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Subject</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Status</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Priority</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Category</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Assignee</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Created</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map((ticket) => (
                                    <tr key={ticket.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                                        <td className="px-5 py-4">
                                            <span className="text-sm font-medium text-[#1F2937]">{ticket.id}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="text-sm text-[#1F2937]">{ticket.subject}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                                                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).replace('-', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-sm text-[#6B7280]">{ticket.category}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-sm text-[#1F2937]">{ticket.assignee}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-sm text-[#6B7280]">
                                                {new Date(ticket.created).toLocaleDateString('en-IE')}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-1">
                                                <button className="p-1 hover:bg-[#E5E7EB] rounded text-[#6B7280]" title="View">
                                                    <User className="w-4 h-4" />
                                                </button>
                                                <button className="p-1 hover:bg-[#E5E7EB] rounded text-[#6B7280]" title="Archive">
                                                    <Archive className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* New Ticket Dialog */}
            {showNewTicket && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-[600px]">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-[#1F2937]">Create New Ticket</h3>
                                <p className="text-sm text-[#6B7280]">Submit a new support request</p>
                            </div>
                            <button
                                onClick={() => setShowNewTicket(false)}
                                className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#1F2937] mb-2">Subject</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                    placeholder="Brief description of the issue"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1F2937] mb-2">Category</label>
                                    <select 
                                        value={categorySelect}
                                        onChange={e => setCategorySelect(e.target.value)}
                                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                    >
                                        <option value="">Select category...</option>
                                        <option value="Billing">Billing</option>
                                        <option value="Technical">Technical</option>
                                        <option value="Integration">Integration</option>
                                        <option value="Scheduling">Scheduling</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {categorySelect === 'Other' && (
                                        <input
                                            type="text"
                                            value={customCategory}
                                            onChange={e => setCustomCategory(e.target.value)}
                                            placeholder="Specify category"
                                            className="w-full mt-2 px-3 py-2 border border-[#10B981] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981] animate-in slide-in-from-top-1 duration-150"
                                            required
                                        />
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1F2937] mb-2">Priority</label>
                                    <select className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]">
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                        <option>Urgent</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1F2937] mb-2">Description</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] resize-none"
                                    rows={5}
                                    placeholder="Provide detailed information about your issue..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1F2937] mb-2">Attachments (Optional)</label>
                                <div className="border-2 border-dashed border-[#E5E7EB] rounded-lg p-4 text-center hover:bg-[#F9FAFB] cursor-pointer">
                                    <Paperclip className="w-6 h-6 text-[#6B7280] mx-auto mb-2" />
                                    <p className="text-sm text-[#6B7280]">Click to upload or drag and drop</p>
                                    <p className="text-xs text-[#9CA3AF]">PNG, JPG, PDF up to 10MB</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-2">
                            <button
                                onClick={() => setShowNewTicket(false)}
                                className="flex-1 px-4 py-2 border border-[#E5E7EB] text-[#1F2937] rounded-lg hover:bg-[#F9FAFB]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    alert('Ticket created successfully!');
                                    setShowNewTicket(false);
                                }}
                                className="flex-1 px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669]"
                            >
                                Create Ticket
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
