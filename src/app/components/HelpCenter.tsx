import {
    BookOpen,
    Search,
    FileText,
    Video,
    HelpCircle,
    ChevronRight,
    Star,
    ThumbsUp,
    ThumbsDown,
    ExternalLink,
    Download,
    Play,
    Clock,
    MessageCircle,
    Mail,
    Phone,
    CheckCircle,
    AlertCircle,
    Users,
    Settings,
    CreditCard,
    Calendar,
    Shield
} from 'lucide-react';
import { useState } from 'react';

interface Article {
    id: string;
    title: string;
    description: string;
    category: string;
    views: number;
    helpful: number;
    lastUpdated: string;
}

interface Category {
    id: string;
    name: string;
    icon: any;
    articleCount: number;
    description: string;
}

interface Tutorial {
    id: string;
    title: string;
    duration: string;
    thumbnail: string;
    category: string;
}

const categories: Category[] = [
    {
        id: 'getting-started',
        name: 'Getting Started',
        icon: BookOpen,
        articleCount: 12,
        description: 'Learn the basics and get up to speed quickly'
    },
    {
        id: 'locum-management',
        name: 'Locum Management',
        icon: Users,
        articleCount: 18,
        description: 'Managing locum profiles, schedules, and assignments'
    },
    {
        id: 'scheduling',
        name: 'Scheduling & Shifts',
        icon: Calendar,
        articleCount: 15,
        description: 'Creating and managing shifts and appointments'
    },
    {
        id: 'compliance',
        name: 'Compliance & Documents',
        icon: Shield,
        articleCount: 10,
        description: 'Document verification and compliance tracking'
    },
    {
        id: 'billing',
        name: 'Billing & Payments',
        icon: CreditCard,
        articleCount: 14,
        description: 'Payment processing and financial management'
    },
    {
        id: 'settings',
        name: 'Settings & Configuration',
        icon: Settings,
        articleCount: 8,
        description: 'System settings and customization options'
    }
];

const popularArticles: Article[] = [
    {
        id: '1',
        title: 'How to add a new locum to the system',
        description: 'Step-by-step guide to registering new locum doctors',
        category: 'Locum Management',
        views: 1847,
        helpful: 142,
        lastUpdated: '2024-12-05'
    },
    {
        id: '2',
        title: 'Creating and assigning shifts',
        description: 'Learn how to create shifts and assign them to locums',
        category: 'Scheduling',
        views: 1623,
        helpful: 128,
        lastUpdated: '2024-12-08'
    },
    {
        id: '3',
        title: 'Uploading compliance documents',
        description: 'Guide to uploading and verifying compliance documents',
        category: 'Compliance',
        views: 1501,
        helpful: 115,
        lastUpdated: '2024-12-03'
    },
    {
        id: '4',
        title: 'Processing payments for completed shifts',
        description: 'How to review and process payments to locums',
        category: 'Billing',
        views: 1342,
        helpful: 98,
        lastUpdated: '2024-12-10'
    },
    {
        id: '5',
        title: 'Setting up email notifications',
        description: 'Configure email alerts and notification preferences',
        category: 'Settings',
        views: 1156,
        helpful: 87,
        lastUpdated: '2024-12-01'
    }
];

const videoTutorials: Tutorial[] = [
    {
        id: '1',
        title: 'Platform Overview & Dashboard Tour',
        duration: '8:30',
        thumbnail: '🎥',
        category: 'Getting Started'
    },
    {
        id: '2',
        title: 'Managing Locum Profiles',
        duration: '12:45',
        thumbnail: '🎥',
        category: 'Locum Management'
    },
    {
        id: '3',
        title: 'Shift Scheduling Best Practices',
        duration: '15:20',
        thumbnail: '🎥',
        category: 'Scheduling'
    },
    {
        id: '4',
        title: 'Compliance Document Verification',
        duration: '10:15',
        thumbnail: '🎥',
        category: 'Compliance'
    }
];

const faqs = [
    {
        id: '1',
        question: 'How do I reset a locum\'s password?',
        answer: 'Navigate to Locum Management, select the locum profile, click on the Actions menu, and select "Reset Password". An email will be sent to the locum with instructions to create a new password.'
    },
    {
        id: '2',
        question: 'Can I export shift data to Excel?',
        answer: 'Yes, you can export shift data from the Appointments page. Click the "Export" button in the top right corner and select your preferred format (CSV or Excel). You can filter the data before exporting.'
    },
    {
        id: '3',
        question: 'How long are compliance documents valid?',
        answer: 'Document validity periods vary: Medical Council registration (annual), Garda Vetting (3 years), Professional Indemnity Insurance (annual), and Hepatitis B immunity (lifetime). The system automatically sends reminders 30 days before expiration.'
    },
    {
        id: '4',
        question: 'What payment methods are supported?',
        answer: 'Mployus supports bank transfers (SEPA) and direct deposits to Irish bank accounts. Payments are processed within 3-5 business days after shift completion and approval.'
    },
    {
        id: '5',
        question: 'How do I integrate with our existing HR system?',
        answer: 'Go to Settings > Interoperability to configure integrations. We support FHIR, HL7, and REST API connections. Contact support for assistance with custom integrations.'
    }
];

export function HelpCenter() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

    return (
        <div className="p-6">
            {/* Page Title */}
            <div className="mb-6">
                <h2 className="text-[#1F2937] mb-1">Help Center</h2>
                <p className="text-sm text-[#6B7280]">Find answers, tutorials, and resources</p>
            </div>

            {/* Search Section */}
            <div className="bg-gradient-to-r from-[#10B981] to-[#059669] rounded-xl p-8 mb-6">
                <div className="text-center mb-6">
                    <h3 className="text-white text-2xl mb-2">How can we help you today?</h3>
                    <p className="text-white text-sm opacity-90">Search our knowledge base or browse categories below</p>
                </div>
                <div className="max-w-2xl mx-auto">
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B7280]" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for articles, tutorials, or FAQs..."
                            className="w-full pl-12 pr-4 py-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-white shadow-lg"
                        />
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-5 mb-6">
                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-[#DBEAFE] rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-[#3B82F6]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#1F2937]">77</p>
                        </div>
                    </div>
                    <p className="text-xs text-[#6B7280]">Knowledge Base Articles</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-[#FEF3C7] rounded-lg flex items-center justify-center">
                            <Video className="w-5 h-5 text-[#D97706]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#1F2937]">24</p>
                        </div>
                    </div>
                    <p className="text-xs text-[#6B7280]">Video Tutorials</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-[#D1FAE5] rounded-lg flex items-center justify-center">
                            <HelpCircle className="w-5 h-5 text-[#10B981]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#1F2937]">45</p>
                        </div>
                    </div>
                    <p className="text-xs text-[#6B7280]">FAQs Answered</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-[#E0E7FF] rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-[#6366F1]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#1F2937]">&lt;2h</p>
                        </div>
                    </div>
                    <p className="text-xs text-[#6B7280]">Avg Response Time</p>
                </div>
            </div>

            {/* Browse Categories */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 mb-6">
                <h3 className="text-[#1F2937] mb-4">Browse by Category</h3>
                <div className="grid grid-cols-3 gap-4">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className="p-4 border border-[#E5E7EB] rounded-xl hover:shadow-md hover:border-[#10B981] transition-all text-left group"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 bg-[#F0FDF4] rounded-lg flex items-center justify-center group-hover:bg-[#D1FAE5] transition-colors">
                                        <Icon className="w-6 h-6 text-[#10B981]" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-[#1F2937] mb-1">{category.name}</h4>
                                        <p className="text-xs text-[#6B7280] mb-2">{category.description}</p>
                                        <span className="text-xs text-[#10B981]">{category.articleCount} articles</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-[#6B7280] group-hover:text-[#10B981]" />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Popular Articles */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] mb-6">
                <div className="p-5 border-b border-[#E5E7EB]">
                    <h3 className="text-[#1F2937]">Popular Articles</h3>
                    <p className="text-sm text-[#6B7280]">Most viewed and helpful resources</p>
                </div>
                <div className="p-5">
                    <div className="space-y-3">
                        {popularArticles.map((article) => (
                            <button
                                key={article.id}
                                className="w-full p-4 border border-[#E5E7EB] rounded-lg hover:shadow-md hover:border-[#10B981] transition-all text-left group"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <FileText className="w-4 h-4 text-[#6B7280]" />
                                            <h4 className="font-medium text-[#1F2937] group-hover:text-[#10B981]">{article.title}</h4>
                                        </div>
                                        <p className="text-sm text-[#6B7280] mb-2">{article.description}</p>
                                        <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                                            <span className="px-2 py-1 bg-[#F3F4F6] rounded">{article.category}</span>
                                            <span className="flex items-center gap-1">
                                                <Star className="w-3 h-3" />
                                                {article.views} views
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <ThumbsUp className="w-3 h-3" />
                                                {article.helpful} helpful
                                            </span>
                                            <span>Updated {new Date(article.lastUpdated).toLocaleDateString('en-IE')}</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-[#6B7280] group-hover:text-[#10B981] ml-4" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-5 mb-6">
                {/* Video Tutorials */}
                <div className="bg-white rounded-xl border border-[#E5E7EB]">
                    <div className="p-5 border-b border-[#E5E7EB]">
                        <h3 className="text-[#1F2937]">Video Tutorials</h3>
                        <p className="text-sm text-[#6B7280]">Watch and learn</p>
                    </div>
                    <div className="p-5 space-y-3">
                        {videoTutorials.map((tutorial) => (
                            <button
                                key={tutorial.id}
                                className="w-full p-3 border border-[#E5E7EB] rounded-lg hover:shadow-md hover:border-[#10B981] transition-all text-left group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-16 h-16 bg-[#F0FDF4] rounded-lg flex items-center justify-center relative group-hover:bg-[#D1FAE5]">
                                        <span className="text-2xl">{tutorial.thumbnail}</span>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-8 h-8 bg-[#10B981] rounded-full flex items-center justify-center">
                                                <Play className="w-4 h-4 text-white ml-0.5" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-[#1F2937] mb-1 group-hover:text-[#10B981]">
                                            {tutorial.title}
                                        </h4>
                                        <div className="flex items-center gap-3 text-xs text-[#6B7280]">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {tutorial.duration}
                                            </span>
                                            <span>{tutorial.category}</span>
                                        </div>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-[#6B7280] group-hover:text-[#10B981]" />
                                </div>
                            </button>
                        ))}
                    </div>
                    <div className="p-5 border-t border-[#E5E7EB]">
                        <button className="w-full py-2 text-sm text-[#10B981] hover:underline">
                            View All Tutorials →
                        </button>
                    </div>
                </div>

                {/* Quick Links & Resources */}
                <div className="bg-white rounded-xl border border-[#E5E7EB]">
                    <div className="p-5 border-b border-[#E5E7EB]">
                        <h3 className="text-[#1F2937]">Quick Links & Resources</h3>
                        <p className="text-sm text-[#6B7280]">Helpful downloads and guides</p>
                    </div>
                    <div className="p-5 space-y-2">
                        <button className="w-full p-3 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] text-left flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <Download className="w-4 h-4 text-[#6B7280]" />
                                <span className="text-sm text-[#1F2937]">User Guide (PDF)</span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-[#6B7280] group-hover:text-[#10B981]" />
                        </button>
                        <button className="w-full p-3 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] text-left flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <Download className="w-4 h-4 text-[#6B7280]" />
                                <span className="text-sm text-[#1F2937]">Quick Start Checklist</span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-[#6B7280] group-hover:text-[#10B981]" />
                        </button>
                        <button className="w-full p-3 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] text-left flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <FileText className="w-4 h-4 text-[#6B7280]" />
                                <span className="text-sm text-[#1F2937]">API Documentation</span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-[#6B7280] group-hover:text-[#10B981]" />
                        </button>
                        <button className="w-full p-3 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] text-left flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <Download className="w-4 h-4 text-[#6B7280]" />
                                <span className="text-sm text-[#1F2937]">Compliance Requirements Guide</span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-[#6B7280] group-hover:text-[#10B981]" />
                        </button>
                        <button className="w-full p-3 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] text-left flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <Video className="w-4 h-4 text-[#6B7280]" />
                                <span className="text-sm text-[#1F2937]">Onboarding Webinar</span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-[#6B7280] group-hover:text-[#10B981]" />
                        </button>
                        <button className="w-full p-3 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] text-left flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <FileText className="w-4 h-4 text-[#6B7280]" />
                                <span className="text-sm text-[#1F2937]">Release Notes</span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-[#6B7280] group-hover:text-[#10B981]" />
                        </button>
                    </div>
                </div>
            </div>

            {/* FAQs */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] mb-6">
                <div className="p-5 border-b border-[#E5E7EB]">
                    <h3 className="text-[#1F2937]">Frequently Asked Questions</h3>
                    <p className="text-sm text-[#6B7280]">Quick answers to common questions</p>
                </div>
                <div className="p-5">
                    <div className="space-y-2">
                        {faqs.map((faq) => (
                            <div key={faq.id} className="border border-[#E5E7EB] rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                                    className="w-full p-4 text-left flex items-center justify-between hover:bg-[#F9FAFB]"
                                >
                                    <div className="flex items-center gap-3">
                                        <HelpCircle className="w-5 h-5 text-[#10B981]" />
                                        <span className="font-medium text-[#1F2937]">{faq.question}</span>
                                    </div>
                                    <ChevronRight className={`w-5 h-5 text-[#6B7280] transition-transform ${expandedFaq === faq.id ? 'rotate-90' : ''
                                        }`} />
                                </button>
                                {expandedFaq === faq.id && (
                                    <div className="px-4 pb-4 pt-0">
                                        <div className="pl-8 text-sm text-[#6B7280] leading-relaxed">
                                            {faq.answer}
                                        </div>
                                        <div className="pl-8 mt-3 flex items-center gap-3">
                                            <span className="text-xs text-[#6B7280]">Was this helpful?</span>
                                            <button className="flex items-center gap-1 text-xs text-[#10B981] hover:underline">
                                                <ThumbsUp className="w-3 h-3" />
                                                Yes
                                            </button>
                                            <button className="flex items-center gap-1 text-xs text-[#6B7280] hover:underline">
                                                <ThumbsDown className="w-3 h-3" />
                                                No
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contact Support */}
            <div className="bg-gradient-to-r from-[#F0FDF4] to-[#D1FAE5] rounded-xl border border-[#10B981] p-6">
                <div className="text-center mb-6">
                    <h3 className="text-[#1F2937] text-xl mb-2">Still need help?</h3>
                    <p className="text-sm text-[#6B7280]">Our support team is here to assist you</p>
                </div>
                <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
                    <button className="p-4 bg-white rounded-xl border border-[#E5E7EB] hover:shadow-md transition-shadow">
                        <MessageCircle className="w-8 h-8 text-[#10B981] mx-auto mb-2" />
                        <p className="text-sm font-medium text-[#1F2937] mb-1">Live Chat</p>
                        <p className="text-xs text-[#6B7280]">Chat with our team</p>
                    </button>
                    <button className="p-4 bg-white rounded-xl border border-[#E5E7EB] hover:shadow-md transition-shadow">
                        <Mail className="w-8 h-8 text-[#10B981] mx-auto mb-2" />
                        <p className="text-sm font-medium text-[#1F2937] mb-1">Email Support</p>
                        <p className="text-xs text-[#6B7280]">support@mployus.ie</p>
                    </button>
                    <button className="p-4 bg-white rounded-xl border border-[#E5E7EB] hover:shadow-md transition-shadow">
                        <Phone className="w-8 h-8 text-[#10B981] mx-auto mb-2" />
                        <p className="text-sm font-medium text-[#1F2937] mb-1">Phone Support</p>
                        <p className="text-xs text-[#6B7280]">+353 1 234 5678</p>
                    </button>
                </div>
            </div>
        </div>
    );
}
