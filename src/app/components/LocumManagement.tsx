import { Search, SlidersHorizontal, Download, Plus, Eye, MapPin, Phone, Mail, X, Grid3x3, List, Star, ChevronRight, Clock, CheckCircle, FileText, Calendar, UserPlus, Filter, ChevronLeft, Info, Pencil, Archive, User, Briefcase, CreditCard, ArrowRight, UserCheck, ArrowDown, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useUserRole } from '../contexts/UserRoleContext';
import { toast } from 'sonner';
import { ShiftSlotStatus, ShiftType, ShiftSlot, DaySchedule, LocumWeekSchedule, Locum, Applicant } from '../types';
import { locumService } from '../services/locumService';

const stageConfig: Record<string, { color: string; bg: string; border: string }> = {
    new: { color: '#3B82F6', bg: '#DBEAFE', border: '#BFDBFE' },
    interview: { color: '#D97706', bg: '#FEF3C7', border: '#FDE68A' },
    verification: { color: '#8B5CF6', bg: '#EDE9FE', border: '#DDD6FE' },
    onboarding: { color: '#10B981', bg: '#D1FAE5', border: '#A7F3D0' },
};

// ============ Multi-Shift Availability Types ============

const shiftTypeLabels: Record<ShiftType, { label: string; abbr: string; time: string }> = {
    morning: { label: 'Morning', abbr: 'AM', time: '07:00 - 15:00' },
    afternoon: { label: 'Afternoon', abbr: 'PM', time: '15:00 - 23:00' },
    night: { label: 'Night', abbr: 'NT', time: '23:00 - 07:00' },
};

const shiftStatusConfig: Record<ShiftSlotStatus, { label: string; color: string; bg: string; border: string }> = {
    available: { label: 'Available', color: '#065F46', bg: '#D1FAE5', border: '#A7F3D0' },
    booked: { label: 'Booked', color: '#1E40AF', bg: '#DBEAFE', border: '#BFDBFE' },
    leave: { label: 'Leave', color: '#92400E', bg: '#FEF3C7', border: '#FDE68A' },
    blocked: { label: 'Blocked', color: '#6B7280', bg: '#F3F4F6', border: '#E5E7EB' },
    off: { label: 'Off', color: '#9CA3AF', bg: 'transparent', border: 'transparent' },
};

// Rich multi-shift schedule data showing locums with 1, 2, or 3 shifts per day
const weekSchedules: LocumWeekSchedule[] = [
    {
        locumId: '#GS234FS', // Dr. Sarah Mitchell - General Surgery, very busy
        days: [
            { shifts: [{ type: 'morning', status: 'booked', facility: "St. James's Hospital, Dublin", shiftId: 'SH-2041', time: '07:00 - 15:00' }, { type: 'afternoon', status: 'booked', facility: "Mater Misericordiae, Dublin", shiftId: 'SH-2042', time: '15:00 - 23:00' }, { type: 'night', status: 'off' }] },
            { shifts: [{ type: 'morning', status: 'booked', facility: "St. James's Hospital, Dublin", shiftId: 'SH-2043', time: '07:00 - 15:00' }, { type: 'afternoon', status: 'available' }, { type: 'night', status: 'off' }] },
            { shifts: [{ type: 'morning', status: 'booked', facility: "Beaumont Hospital, Dublin", shiftId: 'SH-2044', time: '07:00 - 15:00' }, { type: 'afternoon', status: 'booked', facility: "St. Vincent's University Hospital", shiftId: 'SH-2045', time: '15:00 - 23:00' }, { type: 'night', status: 'booked', facility: "Mater Misericordiae, Dublin", shiftId: 'SH-2046', time: '23:00 - 07:00' }] },
            { shifts: [{ type: 'morning', status: 'available' }, { type: 'afternoon', status: 'available' }, { type: 'night', status: 'off' }] },
            { shifts: [{ type: 'morning', status: 'booked', facility: "St. James's Hospital, Dublin", shiftId: 'SH-2047', time: '07:00 - 15:00' }, { type: 'afternoon', status: 'available' }, { type: 'night', status: 'off' }] },
            { shifts: [{ type: 'morning', status: 'available' }, { type: 'afternoon', status: 'off' }, { type: 'night', status: 'off' }] },
            { shifts: [{ type: 'morning', status: 'off' }, { type: 'afternoon', status: 'off' }, { type: 'night', status: 'off' }] },
        ],
    },
    {
        locumId: '#EC0125D', // Dr. James Harrison - Cardiology
        days: [
            { shifts: [{ type: 'morning', status: 'booked', facility: "Cork University Hospital", shiftId: 'SH-2050', time: '07:00 - 15:00' }, { type: 'afternoon', status: 'available' }, { type: 'night', status: 'off' }] },
            { shifts: [{ type: 'morning', status: 'booked', facility: "Cork University Hospital", shiftId: 'SH-2051', time: '07:00 - 15:00' }, { type: 'afternoon', status: 'booked', facility: "Cork University Hospital", shiftId: 'SH-2052', time: '15:00 - 23:00' }, { type: 'night', status: 'off' }] },
            { shifts: [{ type: 'morning', status: 'available' }, { type: 'afternoon', status: 'available' }, { type: 'night', status: 'available' }] },
            { shifts: [{ type: 'morning', status: 'booked', facility: "Cork University Hospital", shiftId: 'SH-2053', time: '07:00 - 15:00' }, { type: 'afternoon', status: 'booked', facility: "Cork University Hospital", shiftId: 'SH-2054', time: '15:00 - 23:00' }, { type: 'night', status: 'booked', facility: "Cork University Hospital", shiftId: 'SH-2055', time: '23:00 - 07:00' }] },
            { shifts: [{ type: 'morning', status: 'leave' }, { type: 'afternoon', status: 'leave' }, { type: 'night', status: 'leave' }] },
            { shifts: [{ type: 'morning', status: 'leave' }, { type: 'afternoon', status: 'leave' }, { type: 'night', status: 'off' }] },
            { shifts: [{ type: 'morning', status: 'off' }, { type: 'afternoon', status: 'off' }, { type: 'night', status: 'off' }] },
        ],
    },
    {
        locumId: '#MK4521A', // Dr. Emily Chen - Anesthesiology, night-shift specialist
        days: [
            { shifts: [{ type: 'morning', status: 'available' }, { type: 'afternoon', status: 'booked', facility: "University Hospital Galway", shiftId: 'SH-2060', time: '15:00 - 23:00' }, { type: 'night', status: 'booked', facility: "University Hospital Galway", shiftId: 'SH-2061', time: '23:00 - 07:00' }] },
            { shifts: [{ type: 'morning', status: 'off' }, { type: 'afternoon', status: 'available' }, { type: 'night', status: 'booked', facility: "University Hospital Galway", shiftId: 'SH-2062', time: '23:00 - 07:00' }] },
            { shifts: [{ type: 'morning', status: 'off' }, { type: 'afternoon', status: 'off' }, { type: 'night', status: 'booked', facility: "University Hospital Galway", shiftId: 'SH-2063', time: '23:00 - 07:00' }] },
            { shifts: [{ type: 'morning', status: 'booked', facility: "University Hospital Galway", shiftId: 'SH-2064', time: '07:00 - 15:00' }, { type: 'afternoon', status: 'booked', facility: "University Hospital Galway", shiftId: 'SH-2065', time: '15:00 - 23:00' }, { type: 'night', status: 'off' }] },
            { shifts: [{ type: 'morning', status: 'available' }, { type: 'afternoon', status: 'available' }, { type: 'night', status: 'available' }] },
            { shifts: [{ type: 'morning', status: 'available' }, { type: 'afternoon', status: 'off' }, { type: 'night', status: 'off' }] },
            { shifts: [{ type: 'morning', status: 'off' }, { type: 'afternoon', status: 'off' }, { type: 'night', status: 'off' }] },
        ],
    },
    {
        locumId: '#LW9872P', // Dr. Michael Brooks - Emergency Medicine, heavy shifts
        days: [
            { shifts: [{ type: 'morning', status: 'off' }, { type: 'afternoon', status: 'off' }, { type: 'night', status: 'off' }] },
            { shifts: [{ type: 'morning', status: 'booked', facility: "University Hospital Limerick", shiftId: 'SH-2070', time: '07:00 - 15:00' }, { type: 'afternoon', status: 'booked', facility: "University Hospital Limerick", shiftId: 'SH-2071', time: '15:00 - 23:00' }, { type: 'night', status: 'booked', facility: "University Hospital Limerick", shiftId: 'SH-2072', time: '23:00 - 07:00' }] },
            { shifts: [{ type: 'morning', status: 'booked', facility: "University Hospital Limerick", shiftId: 'SH-2073', time: '07:00 - 15:00' }, { type: 'afternoon', status: 'available' }, { type: 'night', status: 'off' }] },
            { shifts: [{ type: 'morning', status: 'available' }, { type: 'afternoon', status: 'available' }, { type: 'night', status: 'off' }] },
            { shifts: [{ type: 'morning', status: 'booked', facility: "University Hospital Limerick", shiftId: 'SH-2074', time: '07:00 - 15:00' }, { type: 'afternoon', status: 'booked', facility: "University Hospital Limerick", shiftId: 'SH-2075', time: '15:00 - 23:00' }, { type: 'night', status: 'off' }] },
            { shifts: [{ type: 'morning', status: 'available' }, { type: 'afternoon', status: 'off' }, { type: 'night', status: 'off' }] },
            { shifts: [{ type: 'morning', status: 'off' }, { type: 'afternoon', status: 'off' }, { type: 'night', status: 'off' }] },
        ],
    },
    {
        locumId: '#PM6543K', // Dr. Rachel Martinez
        days: [
            { shifts: [{ type: 'morning', status: 'booked', facility: "St. James's Hospital, Dublin", shiftId: 'SH-2080', time: '07:00 - 15:00' }, { type: 'afternoon', status: 'booked', facility: "St. James's Hospital, Dublin", shiftId: 'SH-2081', time: '15:00 - 23:00' }, { type: 'night', status: 'off' }] },
            { shifts: [{ type: 'morning', status: 'booked', facility: "St. James's Hospital, Dublin", shiftId: 'SH-2082', time: '07:00 - 15:00' }, { type: 'afternoon', status: 'available' }, { type: 'night', status: 'off' }] },
            { shifts: [{ type: 'morning', status: 'available' }, { type: 'afternoon', status: 'available' }, { type: 'night', status: 'off' }] },
            { shifts: [{ type: 'morning', status: 'booked', facility: "St. James's Hospital, Dublin", shiftId: 'SH-2083', time: '07:00 - 15:00' }, { type: 'afternoon', status: 'available' }, { type: 'night', status: 'off' }] },
            { shifts: [{ type: 'morning', status: 'leave' }, { type: 'afternoon', status: 'leave' }, { type: 'night', status: 'leave' }] },
            { shifts: [{ type: 'morning', status: 'leave' }, { type: 'afternoon', status: 'leave' }, { type: 'night', status: 'off' }] },
            { shifts: [{ type: 'morning', status: 'off' }, { type: 'afternoon', status: 'off' }, { type: 'night', status: 'off' }] },
        ],
    },
    {
        locumId: '#RT8765N', // Dr. David Thompson
        days: [
            { shifts: [{ type: 'morning', status: 'available' }, { type: 'afternoon', status: 'available' }, { type: 'night', status: 'off' }] },
            { shifts: [{ type: 'morning', status: 'booked', facility: "Waterford University Hospital", shiftId: 'SH-2090', time: '07:00 - 15:00' }, { type: 'afternoon', status: 'booked', facility: "Waterford University Hospital", shiftId: 'SH-2091', time: '15:00 - 23:00' }, { type: 'night', status: 'off' }] },
            { shifts: [{ type: 'morning', status: 'booked', facility: "Waterford University Hospital", shiftId: 'SH-2092', time: '07:00 - 15:00' }, { type: 'afternoon', status: 'available' }, { type: 'night', status: 'off' }] },
            { shifts: [{ type: 'morning', status: 'available' }, { type: 'afternoon', status: 'available' }, { type: 'night', status: 'off' }] },
            { shifts: [{ type: 'morning', status: 'off' }, { type: 'afternoon', status: 'off' }, { type: 'night', status: 'off' }] },
            { shifts: [{ type: 'morning', status: 'off' }, { type: 'afternoon', status: 'off' }, { type: 'night', status: 'off' }] },
            { shifts: [{ type: 'morning', status: 'off' }, { type: 'afternoon', status: 'off' }, { type: 'night', status: 'off' }] },
        ],
    },
];

const getDayOfWeekIndex = (date: Date) => {
    const day = date.getDay(); // 0 = Sun, 1 = Mon...
    return day === 0 ? 6 : day - 1;
};

const getMonthDays = (anchorDate: Date) => {
    const year = anchorDate.getFullYear();
    const month = anchorDate.getMonth();
    
    // First day of current month
    const firstDay = new Date(year, month, 1);
    const dayOfWeek = firstDay.getDay(); // 0 = Sun, 1 = Mon...
    // Mon-start prefix count
    const prefixCount = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    const days = [];
    
    // Previous month padding
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = prefixCount - 1; i >= 0; i--) {
        days.push({
            date: new Date(year, month - 1, prevMonthLastDay - i),
            isCurrentMonth: false
        });
    }
    
    // Current month days
    const totalDays = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= totalDays; d++) {
        days.push({
            date: new Date(year, month, d),
            isCurrentMonth: true
        });
    }
    
    // Suffix padding
    const totalCells = days.length <= 35 ? 35 : 42;
    const suffixCount = totalCells - days.length;
    for (let d = 1; d <= suffixCount; d++) {
        days.push({
            date: new Date(year, month + 1, d),
            isCurrentMonth: false
        });
    }
    
    return days;
};

export function LocumManagement({ onViewProfile }: { onViewProfile?: (id: string) => void }) {
    const [locumsList, setLocumsList] = useState<Locum[]>([]);
    const [applicantsList, setApplicantsList] = useState<Applicant[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showArchiveDialog, setShowArchiveDialog] = useState(false);
    const [selectedLocum, setSelectedLocum] = useState<any>(null);
    const [editTab, setEditTab] = useState<'personal' | 'professional' | 'financial'>('personal');
    const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
    const [targetStage, setTargetStage] = useState<string>('');
    const [showApplicantView, setShowApplicantView] = useState(false);
    const [showAdvanceStage, setShowAdvanceStage] = useState(false);
    const [showAddApplicantDialog, setShowAddApplicantDialog] = useState(false);
    const [customSpecialtyActive, setCustomSpecialtyActive] = useState(false);
    const [customLocationActive, setCustomLocationActive] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const [specialtyFilter, setSpecialtyFilter] = useState('all');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [activeTab, setActiveTab] = useState<'directory' | 'recruitment' | 'availability'>('directory');
    const { permissions } = useUserRole();

    // Edit Form State Variables
    const [editName, setEditName] = useState<string>('');
    const [editStatus, setEditStatus] = useState<string>('available');

    // Personal
    const [editDob, setEditDob] = useState<string>('');
    const [editNationality, setEditNationality] = useState<string>('');
    const [editGender, setEditGender] = useState<string>('');
    const [editAddress, setEditAddress] = useState<string>('');
    const [editMobile, setEditMobile] = useState<string>('');
    const [editPhone, setEditPhone] = useState<string>('');
    const [editEmail, setEditEmail] = useState<string>('');
    const [editPpsn, setEditPpsn] = useState<string>('');
    const [editEircode, setEditEircode] = useState<string>('');
    const [editEmergencyContact, setEditEmergencyContact] = useState<string>('');
    const [editEmergencyPhone, setEditEmergencyPhone] = useState<string>('');

    // Professional
    const [editSpecialty, setEditSpecialty] = useState<string>('');
    const [editSubSpecialty, setEditSubSpecialty] = useState<string>('');
    const [editExperience, setEditExperience] = useState<string>('');
    const [editGrade, setEditGrade] = useState<string>('Consultant');
    const [editImcNumber, setEditImcNumber] = useState<string>('');
    const [editImcExpiry, setEditImcExpiry] = useState<string>('');
    const [editGmcNumber, setEditGmcNumber] = useState<string>('');
    const [editGmcExpiry, setEditGmcExpiry] = useState<string>('');
    const [editSpecialistRegister, setEditSpecialistRegister] = useState<string>('');
    const [editLanguages, setEditLanguages] = useState<string>('');
    const [editMaxWeeklyHours, setEditMaxWeeklyHours] = useState<number>(48);
    const [editPreferredLocations, setEditPreferredLocations] = useState<string>('');
    const [editPreferredShifts, setEditPreferredShifts] = useState<string[]>([]);
    const [editQualifications, setEditQualifications] = useState<string>('');

    // Financial
    const [editTaxStatus, setEditTaxStatus] = useState<string>('');
    const [editRevenueRegistered, setEditRevenueRegistered] = useState<boolean>(false);
    const [editVatRegistered, setEditVatRegistered] = useState<boolean>(false);
    const [editStandardDayRate, setEditStandardDayRate] = useState<number>(0);
    const [editStandardNightRate, setEditStandardNightRate] = useState<number>(0);
    const [editWeekendRate, setEditWeekendRate] = useState<number>(0);
    const [editOncallRate, setEditOncallRate] = useState<number>(0);
    const [editBankName, setEditBankName] = useState<string>('');
    const [editIban, setEditIban] = useState<string>('');
    const [editBic, setEditBic] = useState<string>('');

    // Populate edit form fields when edit dialog opens
    useEffect(() => {
      if (showEditDialog && selectedLocum) {
        let nameToEdit = selectedLocum.name || '';
        if (nameToEdit.startsWith('Dr. ')) {
            nameToEdit = nameToEdit.substring(4);
        }
        setEditName(nameToEdit);
        setEditStatus(selectedLocum.status || 'available');

        // Personal
        setEditDob(selectedLocum.dob || '1984-06-15');
        setEditNationality(selectedLocum.nationality || 'Irish');
        setEditGender(selectedLocum.gender || 'Female');
        setEditAddress(selectedLocum.address || '42 Pembroke Road, Ballsbridge, Dublin 4');
        setEditMobile(selectedLocum.phone || '');
        setEditPhone(selectedLocum.phone || '');
        setEditEmail(selectedLocum.email || '');
        setEditPpsn(selectedLocum.ppsn || '1234567T');
        setEditEircode(selectedLocum.eircode || 'D04 X5K2');
        setEditEmergencyContact(selectedLocum.emergencyContact || 'John Mitchell (Spouse)');
        setEditEmergencyPhone(selectedLocum.emergencyPhone || '');

        // Professional
        setEditSpecialty(selectedLocum.specialty || '');
        setEditSubSpecialty(selectedLocum.subSpecialty || '');
        setEditExperience(selectedLocum.experience ? (parseInt(selectedLocum.experience) || 0).toString() : '0');
        setEditGrade(selectedLocum.grade || 'Consultant');
        setEditImcNumber(selectedLocum.imcNumber || '');
        setEditImcExpiry(selectedLocum.imcExpiry || '2027-03-31');
        setEditGmcNumber(selectedLocum.gmcNumber || '');
        setEditGmcExpiry(selectedLocum.gmcExpiry || '2027-06-30');
        setEditSpecialistRegister(selectedLocum.specialistRegister || 'Yes - General Surgery Division');
        setEditLanguages(selectedLocum.languages ? selectedLocum.languages.join(', ') : 'English');
        setEditMaxWeeklyHours(selectedLocum.maxWeeklyHours || 48);
        setEditPreferredLocations(selectedLocum.preferredLocations ? selectedLocum.preferredLocations.join(', ') : 'Dublin');
        setEditPreferredShifts(selectedLocum.preferredShifts || ['Day', 'On-Call']);
        setEditQualifications(selectedLocum.qualifications ? (Array.isArray(selectedLocum.qualifications) ? selectedLocum.qualifications.join(', ') : selectedLocum.qualifications) : '');

        // Financial
        const fin = selectedLocum.financial || {};
        setEditTaxStatus(fin.taxStatus || 'Self-Employed (Sole Trader)');
        setEditRevenueRegistered(!!fin.revenueRegistered);
        setEditVatRegistered(!!fin.vatRegistered);
        setEditStandardDayRate(fin.standardDayRate ?? 0);
        setEditStandardNightRate(fin.standardNightRate ?? 0);
        setEditWeekendRate(fin.weekendRate ?? 0);
        setEditOncallRate(fin.oncallRate ?? 0);
        setEditBankName(fin.bankName || '');
        setEditIban(fin.iban || '');
        setEditBic(fin.bic || '');
      } else {
        // Reset fields when dialog closes
        setEditName('');
        setEditStatus('available');
        setEditDob('');
        setEditNationality('');
        setEditGender('');
        setEditAddress('');
        setEditMobile('');
        setEditPhone('');
        setEditEmail('');
        setEditPpsn('');
        setEditEircode('');
        setEditEmergencyContact('');
        setEditEmergencyPhone('');
        setEditSpecialty('');
        setEditSubSpecialty('');
        setEditExperience('');
        setEditGrade('Consultant');
        setEditImcNumber('');
        setEditImcExpiry('');
        setEditGmcNumber('');
        setEditGmcExpiry('');
        setEditSpecialistRegister('');
        setEditLanguages('');
        setEditMaxWeeklyHours(48);
        setEditPreferredLocations('');
        setEditPreferredShifts([]);
        setEditQualifications('');
        setEditTaxStatus('');
        setEditRevenueRegistered(false);
        setEditVatRegistered(false);
        setEditStandardDayRate(0);
        setEditStandardNightRate(0);
        setEditWeekendRate(0);
        setEditOncallRate(0);
        setEditBankName('');
        setEditIban('');
        setEditBic('');
      }
    }, [showEditDialog, selectedLocum]);

    // Fetch locums and applicants on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                const locumsData = await locumService.getAllLocums();
                const applicantsData = await locumService.getAllApplicants();
                setLocumsList(locumsData);
                setApplicantsList(applicantsData);
            } catch (err) {
                toast.error('Failed to load directories');
            }
        };
        loadData();
    }, []);

    const handleAddLocumSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const specialty = formData.get('specialty') as string;
        const department = formData.get('department') as string;
        const location = formData.get('location') as string;
        const phone = formData.get('phone') as string;
        const email = formData.get('email') as string;
        const experience = formData.get('experience') as string;

        const newLocumId = `#LC${Math.floor(10000 + Math.random() * 90000)}`;
        const fullName = `${firstName} ${lastName}`;
        const avatarLetters = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() || 'LP';

        const newLocum: Locum = {
            id: newLocumId,
            name: fullName,
            avatar: avatarLetters,
            specialty: specialty || 'General Practice',
            department: department || 'Internal Medicine',
            location: location || 'Dublin, Ireland',
            phone: phone || '+353 1 123 4567',
            email: email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
            status: 'available',
            shifts: 0,
            rating: 5.0,
            compliance: 100,
            experience: `${experience || 1} years`,
            qualifications: ['MB BCh BAO'],
            joinDate: new Date().toISOString().split('T')[0]
        };

        try {
            await locumService.createLocum(newLocum);
            const updated = await locumService.getAllLocums();
            setLocumsList(updated);
            toast.success(`${fullName} added successfully`);
            setShowAddDialog(false);
        } catch (err) {
            toast.error('Failed to create locum profile');
        }
    };

    const handleAddApplicantSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        
        let specialty = formData.get('specialty') as string;
        if (specialty === 'other') {
            specialty = formData.get('customSpecialty') as string || 'General Practice';
        }
        
        const department = formData.get('department') as string;

        let location = formData.get('location') as string;
        if (location === 'other') {
            location = formData.get('customLocation') as string || 'Dublin';
        }

        const phone = formData.get('phone') as string;
        const email = formData.get('email') as string;

        const newAppId = `APP-${Math.floor(100 + Math.random() * 900)}`;
        const fullName = `${firstName} ${lastName}`;

        const newApplicant: Applicant = {
            id: newAppId,
            name: fullName,
            specialty: specialty || 'General Practice',
            department: department || undefined,
            location: location || 'Dublin',
            status: 'new',
            appliedDate: new Date().toISOString().split('T')[0],
            stage: 'New Application',
            phone: phone || undefined,
            email: email || undefined
        };

        try {
            await locumService.createApplicant(newApplicant);
            const updated = await locumService.getAllApplicants();
            setApplicantsList(updated);
            toast.success(`${fullName} added to recruitment pipeline`);
            setShowAddApplicantDialog(false);
        } catch (err) {
            toast.error('Failed to add applicant');
        }
    };

    const handleEditLocumSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        let cleanedName = editName;
        if (cleanedName.startsWith('Dr. ')) {
            cleanedName = cleanedName.substring(4);
        }

        const avatarLetters = cleanedName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'LP';

        const updatedLocum: Locum = {
            ...selectedLocum,
            name: cleanedName,
            avatar: avatarLetters,
            status: editStatus as any,
            phone: editPhone || editMobile,
            email: editEmail,
            dob: editDob,
            gender: editGender,
            nationality: editNationality,
            ppsn: editPpsn,
            address: editAddress,
            eircode: editEircode,
            emergencyContact: editEmergencyContact,
            emergencyPhone: editEmergencyPhone,
            specialty: editSpecialty || selectedLocum.specialty,
            subSpecialty: editSubSpecialty || selectedLocum.subSpecialty,
            experience: editExperience ? `${editExperience} years` : selectedLocum.experience,
            grade: editGrade || selectedLocum.grade,
            imcNumber: editImcNumber || selectedLocum.imcNumber,
            gmcNumber: editGmcNumber || selectedLocum.gmcNumber,
            languages: editLanguages.split(',').map(s => s.trim()).filter(Boolean),
            maxWeeklyHours: Number(editMaxWeeklyHours),
            preferredLocations: editPreferredLocations.split(',').map(s => s.trim()).filter(Boolean),
            preferredShifts: editPreferredShifts,
            imcExpiry: editImcExpiry,
            gmcExpiry: editGmcExpiry,
            specialistRegister: editSpecialistRegister,
            qualifications: editQualifications ? editQualifications.split(',').map(q => q.trim()).filter(Boolean) : selectedLocum.qualifications,
            financial: {
                ...selectedLocum.financial,
                taxStatus: editTaxStatus,
                revenueRegistered: editRevenueRegistered,
                vatRegistered: editVatRegistered,
                standardDayRate: Number(editStandardDayRate),
                standardNightRate: Number(editStandardNightRate),
                weekendRate: Number(editWeekendRate),
                oncallRate: Number(editOncallRate),
                bankName: editBankName,
                iban: editIban,
                bic: editBic,
            }
        };

        try {
            await locumService.updateLocum(updatedLocum);
            const updated = await locumService.getAllLocums();
            setLocumsList(updated);
            toast.success(`Profile updated for ${cleanedName}`);
            setShowEditDialog(false);
        } catch (err) {
            toast.error('Failed to save profile changes');
        }
    };

    // Availability tab state
    const [availWeekOffset, setAvailWeekOffset] = useState(0);
    const [availSubView, setAvailSubView] = useState<'month' | 'week' | 'day'>('week');
    const [availAnchorDate, setAvailAnchorDate] = useState<Date>(new Date(2026, 1, 10)); // Feb 10, 2026 (Tuesday)
    const [selectedLocumIdForMonth, setSelectedLocumIdForMonth] = useState<string>('all');
    const [hoveredMonthSummary, setHoveredMonthSummary] = useState<{ date: Date; x: number; y: number } | null>(null);
    const [availShiftFilter, setAvailShiftFilter] = useState<'all' | ShiftType>('all');
    const [availStatusFilter, setAvailStatusFilter] = useState<'all' | ShiftSlotStatus>('all');
    const [hoveredSlot, setHoveredSlot] = useState<{ locumIdx: number; dayIdx: number; shiftIdx: number; isMonthView?: boolean; monthDate?: Date } | null>(null);
    const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const tableRef = useRef<HTMLDivElement>(null);

    const filteredLocums = locumsList.filter(locum => {
        const matchesSearch = locum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            locum.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            locum.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
            locum.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || locum.status === statusFilter;
        const matchesSpecialty = specialtyFilter === 'all' || locum.specialty === specialtyFilter;
        const matchesDepartment = departmentFilter === 'all' || locum.department === departmentFilter;
        return matchesSearch && matchesStatus && matchesSpecialty && matchesDepartment;
    });

    const handleExport = () => {
        const csvContent = [
            ['ID', 'Name', 'Specialty', 'Department', 'Location', 'Phone', 'Email', 'Status', 'Shifts', 'Rating', 'Compliance'],
            ...locumsList.map(locum => [locum.id, locum.name, locum.specialty, locum.department || 'N/A', locum.location, locum.phone, locum.email, locum.status, locum.shifts, locum.rating, locum.compliance])
        ].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `locums-${new Date().toISOString().split('T')[0]}.csv`; a.click();
    };

    const specialties = [...new Set(locumsList.map(l => l.specialty))];
    const departments = [...new Set(locumsList.map(l => l.department).filter(Boolean))];

    // Compute week dates based on offset
    const getWeekDates = (anchor: Date) => {
        const today = new Date(2026, 1, 10); // Feb 10, 2026 (Tuesday)
        const startOfWeek = new Date(anchor);
        const day = anchor.getDay();
        const diff = anchor.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);
        const days = [];
        const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        for (let i = 0; i < 7; i++) {
            const d = new Date(startOfWeek);
            d.setDate(startOfWeek.getDate() + i);
            days.push({
                name: dayNames[i],
                date: d.getDate(),
                month: d.toLocaleString('en-IE', { month: 'short' }),
                full: d.toLocaleDateString('en-IE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
                isToday: d.toDateString() === today.toDateString(),
                isWeekend: i >= 5,
                rawDate: d,
            });
        }
        return days;
    };

    const weekDates = getWeekDates(availAnchorDate);

    // Get week summary stats
    const getWeekStats = () => {
        let totalShifts = 0;
        let bookedShifts = 0;
        let availableSlots = 0;
        let tripleShiftDays = 0;
        let doubleShiftDays = 0;

        weekSchedules.forEach(schedule => {
            schedule.days.forEach(day => {
                const booked = day.shifts.filter(s => s.status === 'booked').length;
                const available = day.shifts.filter(s => s.status === 'available').length;
                totalShifts += booked;
                bookedShifts += booked;
                availableSlots += available;
                if (booked >= 3) tripleShiftDays++;
                else if (booked >= 2) doubleShiftDays++;
            });
        });

        return { totalShifts, bookedShifts, availableSlots, tripleShiftDays, doubleShiftDays };
    };

    const weekStats = getWeekStats();

    // Get locum's weekly shift count
    const getLocumWeekShiftCount = (schedule: LocumWeekSchedule) => {
        return schedule.days.reduce((sum, day) => sum + day.shifts.filter(s => s.status === 'booked').length, 0);
    };

    // Get locum's max shifts in a single day
    const getLocumMaxDailyShifts = (schedule: LocumWeekSchedule) => {
        return Math.max(...schedule.days.map(day => day.shifts.filter(s => s.status === 'booked').length));
    };

    // Handle tooltip positioning
    const handleSlotHover = (e: React.MouseEvent, locumIdx: number, dayIdx: number, shiftIdx: number) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const containerRect = tableRef.current?.getBoundingClientRect();
        if (containerRect) {
            setTooltipPos({
                x: rect.left - containerRect.left + rect.width / 2,
                y: rect.top - containerRect.top - 8,
            });
        }
        setHoveredSlot({ locumIdx, dayIdx, shiftIdx });
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="text-[#1F2937] mb-1">Locum Professionals</h2>
                <p className="text-sm text-[#6B7280]">Manage locum directory, recruitment pipeline, and availability</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-5 gap-4">
                {[
                    { label: 'Total Locums', value: '1,247', sub: '+12% from last month', color: '#10B981' },
                    { label: 'Available Now', value: '892', sub: '71% availability rate', color: '#3B82F6' },
                    { label: 'Currently Booked', value: '234', sub: 'Active this week', color: '#8B5CF6' },
                    { label: 'New Applicants', value: '5', sub: 'Pending review', color: '#F59E0B' },
                    { label: 'Avg. Compliance', value: '94.8%', sub: '+3% improvement', color: '#10B981' },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
                        <p className="text-xs text-[#9CA3AF]">{s.label}</p>
                        <p className="text-xl text-[#1F2937] mt-1" style={{ fontWeight: 700 }}>{s.value}</p>
                        <p className="text-xs mt-0.5" style={{ color: s.color }}>{s.sub}</p>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-[#E5E7EB]">
                <div className="border-b border-[#E5E7EB] px-5 flex items-center justify-between">
                    <div className="flex gap-6">
                        {[
                            { id: 'directory' as const, label: 'Locum Directory' },
                            { id: 'recruitment' as const, label: 'Recruitment Pipeline', badge: 5 },
                            { id: 'availability' as const, label: 'Availability Management' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-3 text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === tab.id ? 'border-[#10B981] text-[#10B981]' : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'}`}
                                style={{ fontWeight: activeTab === tab.id ? 600 : 400 }}
                            >
                                {tab.label}
                                {tab.badge && <span className="bg-[#F59E0B] text-white text-[10px] px-1.5 py-0.5 rounded-full">{tab.badge}</span>}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        {activeTab === 'directory' && (
                            <>
                                <div className="flex items-center border border-[#E5E7EB] rounded-lg overflow-hidden">
                                    <button className={`px-2.5 py-1.5 ${viewMode === 'grid' ? 'bg-[#10B981] text-white' : 'bg-white text-[#6B7280]'}`} onClick={() => setViewMode('grid')}><Grid3x3 className="w-4 h-4" /></button>
                                    <button className={`px-2.5 py-1.5 ${viewMode === 'list' ? 'bg-[#10B981] text-white' : 'bg-white text-[#6B7280]'}`} onClick={() => setViewMode('list')}><List className="w-4 h-4" /></button>
                                </div>
                                {permissions.canExportData && (
                                    <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]"><Download className="w-4 h-4" /> Export</button>
                                )}
                                {permissions.canCreateEntities && (
                                    <button onClick={() => setShowAddDialog(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-[#10B981] text-white rounded-lg hover:bg-[#059669]"><Plus className="w-4 h-4" /> Add Locum</button>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Toolbar */}
                {activeTab === 'directory' && (
                    <div className="p-4 border-b border-[#E5E7EB] flex items-center gap-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search by name, ID, specialty, or location..." className="w-full pl-9 pr-4 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]" />
                        </div>
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white">
                            <option value="all">All Status</option>
                            <option value="available">Available</option>
                            <option value="booked">Booked</option>
                            <option value="unavailable">Unavailable</option>
                        </select>
                        <select value={specialtyFilter} onChange={e => setSpecialtyFilter(e.target.value)} className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white">
                            <option value="all">All Specialties</option>
                            {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)} className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white">
                            <option value="all">All Departments</option>
                            {departments.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                )}

                {/* Directory - List View */}
                {activeTab === 'directory' && viewMode === 'list' && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#E5E7EB]">
                                    {['Locum', 'Specialty', 'Department', 'Location', 'Experience', 'Shifts', 'Rating', 'Compliance', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="px-4 py-2.5 text-left text-xs text-[#9CA3AF]" style={{ fontWeight: 500 }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLocums.map(locum => (
                                    <tr key={locum.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] cursor-pointer group" onClick={() => onViewProfile?.(locum.id)}>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-9 h-9 bg-[#10B981] rounded-full flex items-center justify-center text-white text-xs">{locum.avatar}</div>
                                                <div>
                                                    <p className="text-sm text-[#1F2937]">{locum.name}</p>
                                                    <p className="text-[11px] text-[#9CA3AF]">{locum.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-[#6B7280]">{locum.specialty}</td>
                                        <td className="px-4 py-3 text-xs text-[#6B7280]">{locum.department}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#9CA3AF]" /><span className="text-xs text-[#6B7280]">{locum.location}</span></div>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-[#6B7280]">{locum.experience}</td>
                                        <td className="px-4 py-3 text-sm text-[#1F2937]" style={{ fontWeight: 500 }}>{locum.shifts}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                                                <span className="text-xs text-[#1F2937]">{locum.rating}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-10 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full ${locum.compliance === 100 ? 'bg-[#10B981]' : locum.compliance >= 75 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`} style={{ width: `${locum.compliance}%` }} />
                                                </div>
                                                <span className="text-xs text-[#1F2937]">{locum.compliance}%</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-[11px] border ${locum.status === 'available' ? 'bg-[#D1FAE5] text-[#059669] border-[#A7F3D0]' :
                                                    locum.status === 'booked' ? 'bg-[#DBEAFE] text-[#1D4ED8] border-[#BFDBFE]' :
                                                        'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]'
                                                }`}>
                                                {locum.status.charAt(0).toUpperCase() + locum.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => { setSelectedLocum(locum); setEditTab('personal'); setShowEditDialog(true); }} className="p-1.5 text-[#6B7280] hover:text-[#10B981] hover:bg-[#ECFDF5] rounded-lg transition-colors" title="Edit">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => { setSelectedLocum(locum); setShowArchiveDialog(true); }} className="p-1.5 text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition-colors" title="Archive">
                                                    <Archive className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Directory - Grid View */}
                {activeTab === 'directory' && viewMode === 'grid' && (
                    <div className="grid grid-cols-3 gap-4 p-5">
                        {filteredLocums.map(locum => (
                            <div key={locum.id} className="border border-[#E5E7EB] rounded-xl p-4 hover:shadow-sm transition-shadow cursor-pointer group" onClick={() => onViewProfile?.(locum.id)}>
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-10 h-10 bg-[#10B981] rounded-full flex items-center justify-center text-white text-xs">{locum.avatar}</div>
                                        <div>
                                            <p className="text-sm text-[#1F2937]">{locum.name}</p>
                                            <p className="text-[11px] text-[#9CA3AF]">{locum.specialty}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] border ${locum.status === 'available' ? 'bg-[#D1FAE5] text-[#059669] border-[#A7F3D0]' :
                                            locum.status === 'booked' ? 'bg-[#DBEAFE] text-[#1D4ED8] border-[#BFDBFE]' :
                                                'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]'
                                        }`}>
                                        {locum.status.charAt(0).toUpperCase() + locum.status.slice(1)}
                                    </span>
                                </div>
                                <div className="space-y-1.5 mb-3">
                                    <div className="flex items-center gap-1.5 text-xs text-[#6B7280]"><MapPin className="w-3 h-3" />{locum.location}</div>
                                    <div className="flex items-center gap-1.5 text-xs text-[#6B7280]"><Phone className="w-3 h-3" />{locum.phone}</div>
                                    <div className="flex items-center gap-1.5 text-xs text-[#6B7280]"><Mail className="w-3 h-3" /><span className="truncate">{locum.email}</span></div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mb-3 pt-3 border-t border-[#E5E7EB]">
                                    <div><p className="text-[10px] text-[#9CA3AF]">Shifts</p><p className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>{locum.shifts}</p></div>
                                    <div><p className="text-[10px] text-[#9CA3AF]">Rating</p><p className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>{locum.rating}</p></div>
                                    <div><p className="text-[10px] text-[#9CA3AF]">Compliance</p><p className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>{locum.compliance}%</p></div>
                                </div>
                                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                    <button onClick={() => { setSelectedLocum(locum); setEditTab('personal'); setShowEditDialog(true); }} className="flex-1 py-2 text-xs border border-[#E5E7EB] rounded-lg hover:bg-[#ECFDF5] hover:text-[#10B981] hover:border-[#10B981] flex items-center justify-center gap-1.5 transition-colors">
                                        <Pencil className="w-3.5 h-3.5" /> Edit
                                    </button>
                                    <button onClick={() => { setSelectedLocum(locum); setShowArchiveDialog(true); }} className="flex-1 py-2 text-xs border border-[#E5E7EB] rounded-lg hover:bg-[#FEF2F2] hover:text-[#EF4444] hover:border-[#EF4444] flex items-center justify-center gap-1.5 transition-colors">
                                        <Archive className="w-3.5 h-3.5" /> Archive
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Recruitment Pipeline Tab */}
                {activeTab === 'recruitment' && (
                    <div className="p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[#1F2937]">Recruitment Pipeline</h4>
                            <button onClick={() => setShowAddApplicantDialog(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-[#10B981] text-white rounded-lg hover:bg-[#059669]"><UserPlus className="w-4 h-4" /> Add Applicant</button>
                        </div>
                        <div className="grid grid-cols-4 gap-4 mb-4">
                            {[
                                { label: 'New Applications', value: applicantsList.filter(a => a.status === 'new').length, color: '#3B82F6' },
                                { label: 'Interview Stage', value: applicantsList.filter(a => a.status === 'interview').length, color: '#F59E0B' },
                                { label: 'Credential Verification', value: applicantsList.filter(a => a.status === 'verification').length, color: '#8B5CF6' },
                                { label: 'Onboarding', value: applicantsList.filter(a => a.status === 'onboarding').length, color: '#10B981' },
                            ].map(s => (
                                <div key={s.label} className="p-3 rounded-lg border border-[#E5E7EB]">
                                    <p className="text-xs text-[#9CA3AF]">{s.label}</p>
                                    <p className="text-xl mt-1" style={{ fontWeight: 700, color: s.color }}>{s.value}</p>
                                </div>
                            ))}
                        </div>
                        <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                                        {['Applicant', 'Specialty', 'Department', 'Location', 'Applied Date', 'Stage', 'Actions'].map(h => (
                                            <th key={h} className="px-4 py-2.5 text-left text-xs text-[#9CA3AF]" style={{ fontWeight: 500 }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {applicantsList.map(a => {
                                        const sc = stageConfig[a.status];
                                        return (
                                            <tr key={a.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                                                <td className="px-4 py-3">
                                                    <p className="text-sm text-[#1F2937]">{a.name}</p>
                                                    <p className="text-[11px] text-[#9CA3AF]">{a.id}</p>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-[#6B7280]">{a.specialty}</td>
                                                <td className="px-4 py-3 text-xs text-[#6B7280]">{a.department || '-'}</td>
                                                <td className="px-4 py-3 text-xs text-[#6B7280]">{a.location}</td>
                                                <td className="px-4 py-3 text-xs text-[#6B7280]">{a.appliedDate}</td>
                                                <td className="px-4 py-3">
                                                    <span className="px-2 py-1 rounded-full text-[11px] border" style={{ backgroundColor: sc.bg, color: sc.color, borderColor: sc.border }}>{a.stage}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedApplicant(a);
                                                                const nextId = a.status === 'new' ? 'interview' : a.status === 'interview' ? 'verification' : 'onboarding';
                                                                setTargetStage(nextId);
                                                                setShowAdvanceStage(true);
                                                            }}
                                                            className="flex items-center gap-1 px-2.5 py-1 text-[11px] text-[#10B981] bg-[#ECFDF5] border border-[#10B981] rounded hover:bg-[#D1FAE5] transition-colors"
                                                        >
                                                            <ArrowRight className="w-3 h-3" /> Advance
                                                        </button>
                                                        <button
                                                            onClick={() => { setSelectedApplicant(a); setShowApplicantView(true); }}
                                                            className="flex items-center gap-1 px-2.5 py-1 text-[11px] text-[#6B7280] bg-white border border-[#E5E7EB] rounded hover:bg-[#F9FAFB] transition-colors"
                                                        >
                                                            <Eye className="w-3 h-3" /> View
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ============ AVAILABILITY MANAGEMENT TAB ============ */}
                {activeTab === 'availability' && (
                    <div className="p-5 space-y-4">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-5 gap-3">
                            <div className="p-3 bg-[#F0FDF4] rounded-lg border border-[#A7F3D0]">
                                <p className="text-[10px] text-[#065F46]" style={{ fontWeight: 500 }}>Available Slots</p>
                                <p className="text-xl text-[#065F46] mt-0.5" style={{ fontWeight: 700 }}>{weekStats.availableSlots}</p>
                                <p className="text-[10px] text-[#065F46] opacity-70">Open this week</p>
                            </div>
                            <div className="p-3 bg-[#EFF6FF] rounded-lg border border-[#BFDBFE]">
                                <p className="text-[10px] text-[#1E40AF]" style={{ fontWeight: 500 }}>Booked Shifts</p>
                                <p className="text-xl text-[#1E40AF] mt-0.5" style={{ fontWeight: 700 }}>{weekStats.bookedShifts}</p>
                                <p className="text-[10px] text-[#1E40AF] opacity-70">Confirmed this week</p>
                            </div>
                            <div className="p-3 bg-[#FEF3C7] rounded-lg border border-[#FDE68A]">
                                <p className="text-[10px] text-[#92400E]" style={{ fontWeight: 500 }}>Double Shifts</p>
                                <p className="text-xl text-[#92400E] mt-0.5" style={{ fontWeight: 700 }}>{weekStats.doubleShiftDays}</p>
                                <p className="text-[10px] text-[#92400E] opacity-70">2 shifts/day instances</p>
                            </div>
                            <div className="p-3 bg-[#FEE2E2] rounded-lg border border-[#FECACA]">
                                <p className="text-[10px] text-[#991B1B]" style={{ fontWeight: 500 }}>Triple Shifts</p>
                                <p className="text-xl text-[#991B1B] mt-0.5" style={{ fontWeight: 700 }}>{weekStats.tripleShiftDays}</p>
                                <p className="text-[10px] text-[#991B1B] opacity-70">3 shifts/day — review WTD</p>
                            </div>
                            <div className="p-3 bg-[#F5F3FF] rounded-lg border border-[#DDD6FE]">
                                <p className="text-[10px] text-[#5B21B6]" style={{ fontWeight: 500 }}>Total Booked</p>
                                <p className="text-xl text-[#5B21B6] mt-0.5" style={{ fontWeight: 700 }}>{weekStats.totalShifts}</p>
                                <p className="text-[10px] text-[#5B21B6] opacity-70">Shifts this week</p>
                            </div>
                        </div>

                        {/* Month / Week / Day Navigation & Filters */}
                        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-2">
                                {/* Sub View Switcher */}
                                <div className="flex items-center gap-1 bg-white border border-[#E5E7EB] rounded-lg p-1 mr-2">
                                    {(['month', 'week', 'day'] as const).map(view => (
                                        <button
                                            key={view}
                                            type="button"
                                            onClick={() => setAvailSubView(view)}
                                            className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-all ${
                                                availSubView === view
                                                    ? 'bg-[#10B981] text-white shadow-sm'
                                                    : 'text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F3F4F6]'
                                            }`}
                                        >
                                            {view}
                                        </button>
                                    ))}
                                </div>

                                {/* Navigation Chevrons */}
                                <button
                                    onClick={() => {
                                        if (availSubView === 'week') {
                                            setAvailAnchorDate(prev => {
                                                const d = new Date(prev);
                                                d.setDate(d.getDate() - 7);
                                                return d;
                                            });
                                        } else if (availSubView === 'month') {
                                            setAvailAnchorDate(prev => {
                                                const d = new Date(prev);
                                                d.setMonth(d.getMonth() - 1);
                                                return d;
                                            });
                                        } else {
                                            setAvailAnchorDate(prev => {
                                                const d = new Date(prev);
                                                d.setDate(d.getDate() - 1);
                                                return d;
                                            });
                                        }
                                    }}
                                    className="p-1.5 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]"
                                >
                                    <ChevronLeft className="w-4 h-4 text-[#6B7280]" />
                                </button>
                                <button
                                    onClick={() => {
                                        setAvailAnchorDate(new Date(2026, 1, 10));
                                    }}
                                    className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                                        availAnchorDate.toDateString() === new Date(2026, 1, 10).toDateString()
                                            ? 'bg-[#10B981] text-white border-[#10B981]'
                                            : 'border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]'
                                    }`}
                                >
                                    {availSubView === 'week' ? 'This Week' : availSubView === 'month' ? 'This Month' : 'Today'}
                                </button>
                                <button
                                    onClick={() => {
                                        if (availSubView === 'week') {
                                            setAvailAnchorDate(prev => {
                                                const d = new Date(prev);
                                                d.setDate(d.getDate() + 7);
                                                return d;
                                            });
                                        } else if (availSubView === 'month') {
                                            setAvailAnchorDate(prev => {
                                                const d = new Date(prev);
                                                d.setMonth(d.getMonth() + 1);
                                                return d;
                                            });
                                        } else {
                                            setAvailAnchorDate(prev => {
                                                const d = new Date(prev);
                                                d.setDate(d.getDate() + 1);
                                                return d;
                                            });
                                        }
                                    }}
                                    className="p-1.5 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]"
                                >
                                    <ChevronRight className="w-4 h-4 text-[#6B7280]" />
                                </button>
                                <span className="text-sm text-[#1F2937] ml-2" style={{ fontWeight: 500 }}>
                                    {availSubView === 'week' ? (
                                        `${weekDates[0].date} ${weekDates[0].month} – ${weekDates[6].date} ${weekDates[6].month} 2026`
                                    ) : availSubView === 'month' ? (
                                        availAnchorDate.toLocaleString('en-IE', { month: 'long', year: 'numeric' })
                                    ) : (
                                        availAnchorDate.toLocaleDateString('en-IE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                                    )}
                                </span>
                            </div>

                            {/* Filters & Month Locum Selector */}
                            <div className="flex items-center gap-2">
                                {availSubView === 'month' && (
                                    <div className="flex items-center gap-1.5 mr-2">
                                        <span className="text-xs text-[#6B7280]">Show Locum:</span>
                                        <select
                                            value={selectedLocumIdForMonth}
                                            onChange={e => setSelectedLocumIdForMonth(e.target.value)}
                                            className="px-2.5 py-1.5 text-xs border border-[#E5E7EB] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#10B981]"
                                        >
                                            <option value="all">All Locums Summary</option>
                                            {locumsList.map(l => (
                                                <option key={l.id} value={l.id}>{l.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                <select
                                    value={availShiftFilter}
                                    onChange={e => setAvailShiftFilter(e.target.value as 'all' | ShiftType)}
                                    className="px-2.5 py-1.5 text-xs border border-[#E5E7EB] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#10B981]"
                                >
                                    <option value="all">All Shifts</option>
                                    <option value="morning">Morning (07-15)</option>
                                    <option value="afternoon">Afternoon (15-23)</option>
                                    <option value="night">Night (23-07)</option>
                                </select>
                                <select
                                    value={availStatusFilter}
                                    onChange={e => setAvailStatusFilter(e.target.value as 'all' | ShiftSlotStatus)}
                                    className="px-2.5 py-1.5 text-xs border border-[#E5E7EB] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#10B981]"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="available">Available</option>
                                    <option value="booked">Booked</option>
                                    <option value="leave">On Leave</option>
                                </select>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-4 text-[10px]">
                            <span className="text-[#9CA3AF]" style={{ fontWeight: 500 }}>LEGEND:</span>
                            {(['available', 'booked', 'leave', 'off'] as ShiftSlotStatus[]).map(status => (
                                <div key={status} className="flex items-center gap-1.5">
                                    <div
                                        className="w-3 h-3 rounded-sm border"
                                        style={{
                                            backgroundColor: shiftStatusConfig[status].bg === 'transparent' ? '#F9FAFB' : shiftStatusConfig[status].bg,
                                            borderColor: shiftStatusConfig[status].border === 'transparent' ? '#E5E7EB' : shiftStatusConfig[status].border,
                                        }}
                                    />
                                    <span className="text-[#6B7280]">{shiftStatusConfig[status].label}</span>
                                </div>
                            ))}
                            <div className="ml-2 flex items-center gap-1.5 text-[#9CA3AF]">
                                <span>|</span>
                                <span>AM = 07:00-15:00</span>
                                <span className="px-0.5">&#183;</span>
                                <span>PM = 15:00-23:00</span>
                                <span className="px-0.5">&#183;</span>
                                <span>NT = 23:00-07:00</span>
                            </div>
                        </div>

                        {/* Rendering different subviews */}
                        {availSubView === 'week' && (
                            <div className="border border-[#E5E7EB] rounded-lg overflow-hidden relative" ref={tableRef}>
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                                            <th className="px-3 py-2 text-left text-xs text-[#9CA3AF] w-[180px] min-w-[180px]" style={{ fontWeight: 500 }}>Locum</th>
                                            <th className="px-1 py-2 text-center text-xs text-[#9CA3AF] w-[60px]" style={{ fontWeight: 500 }}>Wk Total</th>
                                            {weekDates.map((day, idx) => (
                                                <th
                                                    key={idx}
                                                    className={`px-1 py-2 text-center text-xs min-w-[100px] ${day.isToday ? 'bg-[#F0FDF4]' : day.isWeekend ? 'bg-[#F9FAFB]' : ''}`}
                                                    style={{ fontWeight: day.isToday ? 600 : 500 }}
                                                >
                                                    <span className={day.isToday ? 'text-[#10B981]' : 'text-[#9CA3AF]'}>{day.name}</span>
                                                    <br />
                                                    <span className={`text-[11px] ${day.isToday ? 'text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded-full inline-block' : 'text-[#6B7280]'}`}>
                                                        {day.date}
                                                    </span>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {weekSchedules.map((schedule, locumIdx) => {
                                            const locum = locumsList.find(l => l.id === schedule.locumId);
                                            if (!locum) return null;
                                            const weekTotal = getLocumWeekShiftCount(schedule);
                                            const maxDaily = getLocumMaxDailyShifts(schedule);

                                            return (
                                                <tr key={schedule.locumId} className="border-b border-[#F3F4F6] hover:bg-[#FAFBFC]">
                                                    <td className="px-3 py-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-7 h-7 bg-[#10B981] rounded-full flex items-center justify-center text-white text-[10px] flex-shrink-0">{locum.avatar}</div>
                                                            <div className="min-w-0">
                                                                <p className="text-xs text-[#1F2937] truncate" style={{ fontWeight: 500 }}>{locum.name}</p>
                                                                <p className="text-[10px] text-[#9CA3AF] truncate">{locum.specialty}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-1 py-2 text-center">
                                                        <div className="flex flex-col items-center">
                                                            <span className="text-sm text-[#1F2937]" style={{ fontWeight: 600 }}>{weekTotal}</span>
                                                            <span className="text-[9px] text-[#9CA3AF]">shifts</span>
                                                            {maxDaily >= 3 && (
                                                                <span className="text-[8px] px-1 py-0.5 bg-[#FEE2E2] text-[#DC2626] rounded mt-0.5" style={{ fontWeight: 500 }}>
                                                                    3/day
                                                                </span>
                                                            )}
                                                            {maxDaily === 2 && (
                                                                <span className="text-[8px] px-1 py-0.5 bg-[#FEF3C7] text-[#92400E] rounded mt-0.5" style={{ fontWeight: 500 }}>
                                                                    2/day
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    {schedule.days.map((day, dayIdx) => {
                                                        const bookedCount = day.shifts.filter(s => s.status === 'booked').length;
                                                        const filteredShifts = day.shifts.filter(s => {
                                                            const matchesShift = availShiftFilter === 'all' || s.type === availShiftFilter;
                                                            const matchesStatus = availStatusFilter === 'all' || s.status === availStatusFilter;
                                                            return matchesShift && matchesStatus;
                                                        });

                                                        return (
                                                            <td
                                                                key={dayIdx}
                                                                className={`px-0.5 py-1.5 ${weekDates[dayIdx]?.isToday ? 'bg-[#F0FDF4]/50' : weekDates[dayIdx]?.isWeekend ? 'bg-[#F9FAFB]/50' : ''}`}
                                                            >
                                                                <div className="flex flex-col gap-[2px] px-0.5">
                                                                    {filteredShifts.map((shift, shiftIdx) => {
                                                                        if (shift.status === 'off') {
                                                                            return (
                                                                                <div
                                                                                    key={shiftIdx}
                                                                                    className="h-[18px] rounded-sm flex items-center justify-center border border-dashed border-[#E5E7EB]"
                                                                                >
                                                                                    <span className="text-[8px] text-[#D1D5DB]">{shiftTypeLabels[shift.type].abbr}</span>
                                                                                </div>
                                                                            );
                                                                        }
                                                                        const cfg = shiftStatusConfig[shift.status];
                                                                        return (
                                                                            <div
                                                                                key={shiftIdx}
                                                                                className="h-[18px] rounded-sm flex items-center justify-center cursor-pointer transition-all hover:ring-1 hover:ring-offset-0 relative"
                                                                                style={{
                                                                                    backgroundColor: cfg.bg,
                                                                                    border: `1px solid ${cfg.border}`,
                                                                                }}
                                                                                onMouseEnter={(e) => handleSlotHover(e, locumIdx, dayIdx, shiftIdx)}
                                                                                onMouseLeave={() => setHoveredSlot(null)}
                                                                            >
                                                                                <span className="text-[8px]" style={{ color: cfg.color, fontWeight: 500 }}>
                                                                                    {shiftTypeLabels[shift.type].abbr}
                                                                                    {shift.status === 'booked' && (
                                                                                        <span className="ml-0.5 opacity-70">&#9679;</span>
                                                                                    )}
                                                                                </span>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                    {filteredShifts.length === 0 && (
                                                                        <div className="h-[18px] flex items-center justify-center">
                                                                            <span className="text-[8px] text-[#D1D5DB]">--</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {bookedCount >= 2 && availShiftFilter === 'all' && availStatusFilter === 'all' && (
                                                                    <div className="text-center mt-0.5">
                                                                        <span className={`text-[7px] px-1 py-px rounded ${bookedCount >= 3 ? 'bg-[#FEE2E2] text-[#DC2626]' : 'bg-[#FEF3C7] text-[#92400E]'}`} style={{ fontWeight: 600 }}>
                                                                            {bookedCount}x
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                                {/* Hover Tooltip for Week View */}
                                {hoveredSlot && !hoveredSlot.isMonthView && (() => {
                                    const schedule = weekSchedules[hoveredSlot.locumIdx];
                                    if (!schedule) return null;
                                    const day = schedule.days[hoveredSlot.dayIdx];
                                    if (!day) return null;
                                    const filteredShifts = day.shifts.filter(s => {
                                        const matchesShift = availShiftFilter === 'all' || s.type === availShiftFilter;
                                        const matchesStatus = availStatusFilter === 'all' || s.status === availStatusFilter;
                                        return matchesShift && matchesStatus;
                                    });
                                    const shift = filteredShifts[hoveredSlot.shiftIdx];
                                    if (!shift || shift.status === 'off') return null;
                                    const locum = locumsList.find(l => l.id === schedule.locumId);
                                    const dayInfo = weekDates[hoveredSlot.dayIdx];
                                    const cfg = shiftStatusConfig[shift.status];

                                    return (
                                        <div
                                            className="absolute z-30 bg-white rounded-lg shadow-lg border border-[#E5E7EB] p-3 pointer-events-none"
                                            style={{
                                                left: Math.min(Math.max(tooltipPos.x, 120), 900),
                                                top: tooltipPos.y,
                                                transform: 'translate(-50%, -100%)',
                                                minWidth: 240,
                                            }}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <div
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: cfg.color }}
                                                />
                                                <span className="text-xs text-[#1F2937]" style={{ fontWeight: 600 }}>
                                                    {shiftTypeLabels[shift.type].label} Shift
                                                </span>
                                                <span
                                                    className="text-[10px] px-1.5 py-0.5 rounded-full border ml-auto"
                                                    style={{ backgroundColor: cfg.bg, color: cfg.color, borderColor: cfg.border }}
                                                >
                                                    {cfg.label}
                                                </span>
                                            </div>
                                            <div className="space-y-1 text-[10px]">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[#9CA3AF]">Locum</span>
                                                    <span className="text-[#1F2937]" style={{ fontWeight: 500 }}>{locum?.name}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[#9CA3AF]">Date</span>
                                                    <span className="text-[#1F2937]">{dayInfo?.full}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[#9CA3AF]">Time</span>
                                                    <span className="text-[#1F2937]">{shift.time || shiftTypeLabels[shift.type].time}</span>
                                                </div>
                                                {shift.facility && (
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[#9CA3AF]">Facility</span>
                                                        <span className="text-[#1F2937] text-right max-w-[160px]" style={{ fontWeight: 500 }}>{shift.facility}</span>
                                                    </div>
                                                )}
                                                {shift.shiftId && (
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[#9CA3AF]">Shift ID</span>
                                                        <span className="text-[#3B82F6]">{shift.shiftId}</span>
                                                    </div>
                                                )}
                                            </div>
                                            {day.shifts.filter(s => s.status === 'booked').length >= 2 && (
                                                <div className="mt-2 pt-2 border-t border-[#F3F4F6]">
                                                    <div className="flex items-center gap-1">
                                                        <Info className="w-3 h-3 text-[#F59E0B] flex-shrink-0" />
                                                        <span className="text-[9px] text-[#92400E]" style={{ fontWeight: 500 }}>
                                                            {day.shifts.filter(s => s.status === 'booked').length} shifts booked this day — check WTD compliance
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        )}

                        {/* Month View Component */}
                        {availSubView === 'month' && (
                            <div className="border border-[#E5E7EB] rounded-lg overflow-hidden relative" ref={tableRef}>
                                <div className="bg-white border-b border-[#E5E7EB] grid grid-cols-7 text-center">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                        <div key={day} className="py-2.5 text-xs font-semibold text-[#6B7280]">
                                            {day}
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 divide-y divide-x divide-[#E5E7EB] bg-white">
                                    {getMonthDays(availAnchorDate).map((cell, idx) => {
                                        const isToday = cell.date.toDateString() === new Date(2026, 1, 10).toDateString();
                                        const isSelectedMonth = cell.date.getMonth() === availAnchorDate.getMonth();
                                        const weekdayIdx = getDayOfWeekIndex(cell.date);

                                        let totalAvail = 0;
                                        let totalBooked = 0;
                                        let totalLeave = 0;

                                        weekSchedules.forEach(schedule => {
                                            const daySch = schedule.days[weekdayIdx];
                                            if (daySch) {
                                                daySch.shifts.forEach(s => {
                                                    const matchesShift = availShiftFilter === 'all' || s.type === availShiftFilter;
                                                    const matchesStatus = availStatusFilter === 'all' || s.status === availStatusFilter;
                                                    if (matchesShift && matchesStatus) {
                                                        if (s.status === 'booked') totalBooked++;
                                                        else if (s.status === 'available') totalAvail++;
                                                        else if (s.status === 'leave') totalLeave++;
                                                    }
                                                });
                                            }
                                        });

                                        return (
                                            <div
                                                key={idx}
                                                className={`min-h-[100px] p-2 flex flex-col justify-between transition-all ${
                                                    isSelectedMonth ? 'bg-white' : 'bg-[#F9FAFB]/60'
                                                } ${isToday ? 'bg-[#F0FDF4]/30 font-semibold' : ''}`}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span
                                                        className={`text-[11px] font-semibold flex items-center justify-center w-5 h-5 rounded-full ${
                                                            isToday
                                                                ? 'bg-[#10B981] text-white'
                                                                : isSelectedMonth
                                                                    ? 'text-[#1F2937]'
                                                                    : 'text-[#9CA3AF]'
                                                        }`}
                                                    >
                                                        {cell.date.getDate()}
                                                    </span>
                                                    {isToday && <span className="text-[9px] text-[#10B981] font-semibold">Today</span>}
                                                </div>

                                                <div className="flex-1 flex flex-col justify-end gap-1 mt-1">
                                                    {selectedLocumIdForMonth === 'all' ? (
                                                        <div
                                                            className="cursor-pointer space-y-1"
                                                            onMouseEnter={(e) => {
                                                                const rect = e.currentTarget.getBoundingClientRect();
                                                                const containerRect = tableRef.current?.getBoundingClientRect();
                                                                if (containerRect) {
                                                                    setTooltipPos({
                                                                        x: rect.left - containerRect.left + rect.width / 2,
                                                                        y: rect.top - containerRect.top - 8,
                                                                    });
                                                                }
                                                                setHoveredMonthSummary({ date: cell.date, x: rect.left, y: rect.top });
                                                            }}
                                                            onMouseLeave={() => setHoveredMonthSummary(null)}
                                                        >
                                                            {totalAvail > 0 && (
                                                                <div className="flex items-center gap-1 text-[9px] text-[#059669] bg-[#E6FDF5] px-1.5 py-0.5 rounded border border-[#A7F3D0]">
                                                                    <span className="w-1 h-1 rounded-full bg-[#10B981]" />
                                                                    <span>{totalAvail} Avail</span>
                                                                </div>
                                                            )}
                                                            {totalBooked > 0 && (
                                                                <div className="flex items-center gap-1 text-[9px] text-[#1E40AF] bg-[#EFF6FF] px-1.5 py-0.5 rounded border border-[#BFDBFE]">
                                                                    <span className="w-1 h-1 rounded-full bg-[#3B82F6]" />
                                                                    <span>{totalBooked} Booked</span>
                                                                </div>
                                                            )}
                                                            {totalLeave > 0 && (
                                                                <div className="flex items-center gap-1 text-[9px] text-[#92400E] bg-[#FEF3C7] px-1.5 py-0.5 rounded border border-[#FDE68A]">
                                                                    <span className="w-1 h-1 rounded-full bg-[#F59E0B]" />
                                                                    <span>{totalLeave} Leave</span>
                                                                </div>
                                                            )}
                                                            {totalAvail === 0 && totalBooked === 0 && totalLeave === 0 && (
                                                                <span className="text-[9px] text-[#D1D5DB] italic block text-center">--</span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        (() => {
                                                            const scheduleIdx = weekSchedules.findIndex(s => s.locumId === selectedLocumIdForMonth);
                                                            const schedule = weekSchedules[scheduleIdx];
                                                            if (!schedule) return null;
                                                            const daySch = schedule.days[weekdayIdx];
                                                            if (!daySch) return null;
                                                            const shifts = daySch.shifts.filter(s => {
                                                                const matchesShift = availShiftFilter === 'all' || s.type === availShiftFilter;
                                                                const matchesStatus = availStatusFilter === 'all' || s.status === availStatusFilter;
                                                                return matchesShift && matchesStatus;
                                                            });

                                                            return (
                                                                <div className="space-y-[2px]">
                                                                    {shifts.map((shift, shiftIdx) => {
                                                                        if (shift.status === 'off') {
                                                                            return (
                                                                                <div key={shiftIdx} className="h-4 rounded-sm flex items-center justify-center border border-dashed border-[#E5E7EB]">
                                                                                    <span className="text-[8px] text-[#D1D5DB]">{shiftTypeLabels[shift.type].abbr}</span>
                                                                                </div>
                                                                            );
                                                                        }
                                                                        const cfg = shiftStatusConfig[shift.status];
                                                                        return (
                                                                            <div
                                                                                key={shiftIdx}
                                                                                className="h-4 rounded-sm flex items-center justify-center cursor-pointer transition-all hover:ring-1 hover:ring-offset-0 relative"
                                                                                style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}
                                                                                onMouseEnter={(e) => {
                                                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                                                    const containerRect = tableRef.current?.getBoundingClientRect();
                                                                                    if (containerRect) {
                                                                                        setTooltipPos({
                                                                                            x: rect.left - containerRect.left + rect.width / 2,
                                                                                            y: rect.top - containerRect.top - 8,
                                                                                        });
                                                                                    }
                                                                                    setHoveredSlot({
                                                                                        locumIdx: scheduleIdx,
                                                                                        dayIdx: weekdayIdx,
                                                                                        shiftIdx: shiftIdx,
                                                                                        isMonthView: true,
                                                                                        monthDate: cell.date
                                                                                    });
                                                                                }}
                                                                                onMouseLeave={() => setHoveredSlot(null)}
                                                                            >
                                                                                <span className="text-[8px] flex items-center" style={{ color: cfg.color, fontWeight: 600 }}>
                                                                                    {shiftTypeLabels[shift.type].abbr}
                                                                                    {shift.status === 'booked' && <span className="ml-0.5 opacity-75">&#9679;</span>}
                                                                                </span>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                    {shifts.length === 0 && <span className="text-[9px] text-[#D1D5DB] italic block text-center">--</span>}
                                                                </div>
                                                            );
                                                        })()
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Month View Summary Hover Tooltip */}
                                {hoveredMonthSummary && (() => {
                                    const date = hoveredMonthSummary.date;
                                    const weekdayIdx = getDayOfWeekIndex(date);

                                    return (
                                        <div
                                            className="absolute z-30 bg-white rounded-xl shadow-xl border border-[#E5E7EB] p-3 pointer-events-none"
                                            style={{
                                                left: Math.min(Math.max(tooltipPos.x, 150), 850),
                                                top: tooltipPos.y,
                                                transform: 'translate(-50%, -100%)',
                                                width: 280,
                                            }}
                                        >
                                            <div className="border-b border-[#F3F4F6] pb-2 mb-2 flex items-center justify-between">
                                                <span className="text-xs font-semibold text-[#1F2937]">Locums Availability Summary</span>
                                                <span className="text-[10px] text-[#6B7280]">
                                                    {date.toLocaleDateString('en-IE', { weekday: 'short', day: 'numeric', month: 'short' })}
                                                </span>
                                            </div>
                                            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                                                {weekSchedules.map(schedule => {
                                                    const locum = locumsList.find(l => l.id === schedule.locumId);
                                                    if (!locum) return null;
                                                    const daySchedule = schedule.days[weekdayIdx];
                                                    const shifts = daySchedule ? daySchedule.shifts.filter(s => {
                                                        const matchesShift = availShiftFilter === 'all' || s.type === availShiftFilter;
                                                        const matchesStatus = availStatusFilter === 'all' || s.status === availStatusFilter;
                                                        return matchesShift && matchesStatus;
                                                    }) : [];

                                                    return (
                                                        <div key={schedule.locumId} className="flex flex-col gap-1 text-[10px] bg-[#F9FAFB] rounded-lg p-1.5">
                                                            <div className="flex items-center justify-between">
                                                                <span className="font-semibold text-[#1F2937]">{locum.name}</span>
                                                                <span className="text-[9px] text-[#9CA3AF]">{locum.specialty}</span>
                                                            </div>
                                                            <div className="flex flex-wrap gap-1 mt-0.5">
                                                                {shifts.map((s, sIdx) => {
                                                                    const cfg = shiftStatusConfig[s.status];
                                                                    return (
                                                                        <span
                                                                            key={sIdx}
                                                                            className="px-1.5 py-0.5 rounded text-[8px] border"
                                                                            style={{ backgroundColor: cfg.bg, color: cfg.color, borderColor: cfg.border }}
                                                                        >
                                                                            {shiftTypeLabels[s.type].abbr}: {cfg.label}
                                                                            {s.facility && ` (${s.facility.split(',')[0]})`}
                                                                        </span>
                                                                    );
                                                                })}
                                                                {shifts.length === 0 && <span className="text-[8px] text-[#D1D5DB]">No shifts match filters</span>}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Month View Single Slot Tooltip */}
                                {hoveredSlot && hoveredSlot.isMonthView && hoveredSlot.monthDate && (() => {
                                    const schedule = weekSchedules[hoveredSlot.locumIdx];
                                    if (!schedule) return null;
                                    const day = schedule.days[hoveredSlot.dayIdx];
                                    if (!day) return null;
                                    const filteredShifts = day.shifts.filter(s => {
                                        const matchesShift = availShiftFilter === 'all' || s.type === availShiftFilter;
                                        const matchesStatus = availStatusFilter === 'all' || s.status === availStatusFilter;
                                        return matchesShift && matchesStatus;
                                    });
                                    const shift = filteredShifts[hoveredSlot.shiftIdx];
                                    if (!shift || shift.status === 'off') return null;
                                    const locum = locumsList.find(l => l.id === schedule.locumId);
                                    const cfg = shiftStatusConfig[shift.status];

                                    return (
                                        <div
                                            className="absolute z-30 bg-white rounded-lg shadow-lg border border-[#E5E7EB] p-3 pointer-events-none"
                                            style={{
                                                left: Math.min(Math.max(tooltipPos.x, 120), 900),
                                                top: tooltipPos.y,
                                                transform: 'translate(-50%, -100%)',
                                                minWidth: 240,
                                            }}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <div
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: cfg.color }}
                                                />
                                                <span className="text-xs text-[#1F2937]" style={{ fontWeight: 600 }}>
                                                    {shiftTypeLabels[shift.type].label} Shift
                                                </span>
                                                <span
                                                    className="text-[10px] px-1.5 py-0.5 rounded-full border ml-auto"
                                                    style={{ backgroundColor: cfg.bg, color: cfg.color, borderColor: cfg.border }}
                                                >
                                                    {cfg.label}
                                                </span>
                                            </div>
                                            <div className="space-y-1 text-[10px]">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[#9CA3AF]">Locum</span>
                                                    <span className="text-[#1F2937]" style={{ fontWeight: 500 }}>{locum?.name}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[#9CA3AF]">Date</span>
                                                    <span className="text-[#1F2937]">
                                                        {hoveredSlot.monthDate?.toLocaleDateString('en-IE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[#9CA3AF]">Time</span>
                                                    <span className="text-[#1F2937]">{shift.time || shiftTypeLabels[shift.type].time}</span>
                                                </div>
                                                {shift.facility && (
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[#9CA3AF]">Facility</span>
                                                        <span className="text-[#1F2937] text-right max-w-[160px]" style={{ fontWeight: 500 }}>{shift.facility}</span>
                                                    </div>
                                                )}
                                                {shift.shiftId && (
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[#9CA3AF]">Shift ID</span>
                                                        <span className="text-[#3B82F6]">{shift.shiftId}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}

                        {/* Day View Component */}
                        {availSubView === 'day' && (
                            <div className="space-y-3">
                                {filteredLocums.map((locum) => {
                                    const schedule = weekSchedules.find(s => s.locumId === locum.id);
                                    if (!schedule) return null;
                                    const weekdayIdx = getDayOfWeekIndex(availAnchorDate);
                                    const daySchedule = schedule.days[weekdayIdx];
                                    if (!daySchedule) return null;

                                    const shifts = daySchedule.shifts.filter(s => {
                                        const matchesShift = availShiftFilter === 'all' || s.type === availShiftFilter;
                                        const matchesStatus = availStatusFilter === 'all' || s.status === availStatusFilter;
                                        return matchesShift && matchesStatus;
                                    });

                                    return (
                                        <div key={locum.id} className="bg-white rounded-xl border border-[#E5E7EB] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-sm transition-all">
                                            <div className="flex items-center gap-3 w-[220px] shrink-0">
                                                <div className="w-9 h-9 bg-[#10B981] rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                                    {locum.avatar}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="text-sm font-semibold text-[#1F2937] truncate">{locum.name}</h4>
                                                    <p className="text-xs text-[#6B7280] truncate">{locum.specialty}</p>
                                                    <span className="text-[10px] text-[#9CA3AF] font-medium">{locum.id}</span>
                                                </div>
                                            </div>

                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                                                {shifts.map((shift, shiftIdx) => {
                                                    const cfg = shiftStatusConfig[shift.status];
                                                    const labelInfo = shiftTypeLabels[shift.type];
                                                    return (
                                                        <div
                                                            key={shiftIdx}
                                                            className="border rounded-lg p-3 flex flex-col justify-between min-h-[90px] transition-all hover:bg-[#FAFBFC]"
                                                            style={{ borderColor: shift.status === 'off' ? '#E5E7EB' : cfg.border }}
                                                        >
                                                            <div className="flex items-center justify-between mb-1.5">
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="text-xs font-semibold text-[#1F2937]">{labelInfo.label}</span>
                                                                    <span className="text-[10px] text-[#9CA3AF]">({shift.time || labelInfo.time})</span>
                                                                </div>
                                                                <span
                                                                    className="text-[9px] px-1.5 py-0.5 rounded-full border font-medium"
                                                                    style={{ backgroundColor: cfg.bg, color: cfg.color, borderColor: cfg.border }}
                                                                >
                                                                    {cfg.label}
                                                                </span>
                                                            </div>
                                                            <div className="mt-auto">
                                                                {shift.status === 'booked' ? (
                                                                    <div className="space-y-0.5">
                                                                        <p className="text-[11px] font-semibold text-[#1F2937] truncate">{shift.facility}</p>
                                                                        <p className="text-[9px] text-[#3B82F6] font-medium">ID: {shift.shiftId}</p>
                                                                    </div>
                                                                ) : shift.status === 'available' ? (
                                                                    <p className="text-[10px] text-[#059669] font-medium">🟢 Open for assignment</p>
                                                                ) : shift.status === 'leave' ? (
                                                                    <p className="text-[10px] text-[#92400E] font-medium">🟡 Scheduled on leave</p>
                                                                ) : (
                                                                    <p className="text-[10px] text-[#9CA3AF] italic">Off-duty</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                {shifts.length === 0 && (
                                                    <div className="col-span-3 py-6 text-center border border-dashed border-[#E5E7EB] rounded-lg bg-[#F9FAFB]">
                                                        <p className="text-xs text-[#9CA3AF]">No shifts match the current filters</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Working Time Directive Alerts */}
                        {(() => {
                            const alerts: { locum: string; day: string; count: number; locumId: string }[] = [];
                            weekSchedules.forEach(schedule => {
                                const locum = locumsList.find(l => l.id === schedule.locumId);
                                schedule.days.forEach((day, dayIdx) => {
                                    const bookedCount = day.shifts.filter(s => s.status === 'booked').length;
                                    if (bookedCount >= 3) {
                                        alerts.push({
                                            locum: locum?.name || '',
                                            day: `${weekDates[dayIdx]?.name} ${weekDates[dayIdx]?.date} ${weekDates[dayIdx]?.month}`,
                                            count: bookedCount,
                                            locumId: schedule.locumId,
                                        });
                                    }
                                });
                            });

                            if (alerts.length === 0) return null;

                            return (
                                <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-5 h-5 bg-[#DC2626] rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-white text-[10px]" style={{ fontWeight: 700 }}>!</span>
                                        </div>
                                        <span className="text-xs text-[#991B1B]" style={{ fontWeight: 600 }}>
                                            Working Time Directive Alert — Triple Shift Days Detected
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-[#991B1B] mb-2 opacity-80">
                                        The following locums have 3 shifts booked in a single day. Under the Organisation of Working Time Act 1997 (Ireland) and EU Working Time Directive, ensure adequate rest periods (minimum 11 consecutive hours in any 24-hour period).
                                    </p>
                                    <div className="space-y-1.5">
                                        {alerts.map((alert, idx) => (
                                            <div key={idx} className="flex items-center justify-between bg-white/60 rounded px-3 py-1.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-[#1F2937]" style={{ fontWeight: 500 }}>{alert.locum}</span>
                                                    <span className="text-[10px] text-[#6B7280]">&#183;</span>
                                                    <span className="text-[10px] text-[#6B7280]">{alert.day}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] px-1.5 py-0.5 bg-[#FEE2E2] text-[#DC2626] rounded" style={{ fontWeight: 600 }}>
                                                        {alert.count} shifts / 24hrs
                                                    </span>
                                                    <button className="text-[10px] text-[#DC2626] hover:underline" style={{ fontWeight: 500 }}>Review</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Daily Breakdown Summary */}
                        <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
                            <div className="bg-[#F9FAFB] px-4 py-2.5 border-b border-[#E5E7EB]">
                                <span className="text-xs text-[#1F2937]" style={{ fontWeight: 600 }}>Daily Shift Distribution</span>
                            </div>
                            <div className="grid grid-cols-7 divide-x divide-[#E5E7EB]">
                                {weekDates.map((day, dayIdx) => {
                                    let morningBooked = 0, afternoonBooked = 0, nightBooked = 0;
                                    let morningAvail = 0, afternoonAvail = 0, nightAvail = 0;

                                    weekSchedules.forEach(schedule => {
                                        const d = schedule.days[dayIdx];
                                        if (!d) return;
                                        d.shifts.forEach(s => {
                                            if (s.status === 'booked') {
                                                if (s.type === 'morning') morningBooked++;
                                                else if (s.type === 'afternoon') afternoonBooked++;
                                                else nightBooked++;
                                            } else if (s.status === 'available') {
                                                if (s.type === 'morning') morningAvail++;
                                                else if (s.type === 'afternoon') afternoonAvail++;
                                                else nightAvail++;
                                            }
                                        });
                                    });

                                    const totalBooked = morningBooked + afternoonBooked + nightBooked;
                                    const totalAvail = morningAvail + afternoonAvail + nightAvail;

                                    return (
                                        <div key={dayIdx} className={`p-3 ${day.isToday ? 'bg-[#F0FDF4]/50' : ''}`}>
                                            <p className={`text-[10px] text-center mb-2 ${day.isToday ? 'text-[#10B981]' : 'text-[#9CA3AF]'}`} style={{ fontWeight: 600 }}>
                                                {day.name} {day.date}
                                            </p>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[9px] text-[#9CA3AF]">AM</span>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-[9px] text-[#1E40AF]" style={{ fontWeight: 500 }}>{morningBooked}B</span>
                                                        <span className="text-[9px] text-[#D1D5DB]">/</span>
                                                        <span className="text-[9px] text-[#059669]" style={{ fontWeight: 500 }}>{morningAvail}A</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[9px] text-[#9CA3AF]">PM</span>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-[9px] text-[#1E40AF]" style={{ fontWeight: 500 }}>{afternoonBooked}B</span>
                                                        <span className="text-[9px] text-[#D1D5DB]">/</span>
                                                        <span className="text-[9px] text-[#059669]" style={{ fontWeight: 500 }}>{afternoonAvail}A</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[9px] text-[#9CA3AF]">NT</span>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-[9px] text-[#1E40AF]" style={{ fontWeight: 500 }}>{nightBooked}B</span>
                                                        <span className="text-[9px] text-[#D1D5DB]">/</span>
                                                        <span className="text-[9px] text-[#059669]" style={{ fontWeight: 500 }}>{nightAvail}A</span>
                                                    </div>
                                                </div>
                                                <div className="pt-1.5 mt-1.5 border-t border-[#E5E7EB]">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[9px] text-[#6B7280]" style={{ fontWeight: 500 }}>Total</span>
                                                        <span className="text-[10px] text-[#1F2937]" style={{ fontWeight: 600 }}>{totalBooked}B / {totalAvail}A</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Locum Dialog */}
            {showAddDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <form onSubmit={handleAddLocumSubmit} className="bg-white rounded-xl p-6 w-[480px]">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-[#1F2937]">Add New Locum</h3>
                            <button type="button" onClick={() => setShowAddDialog(false)} className="p-1 hover:bg-[#F3F4F6] rounded-lg"><X className="w-5 h-5 text-[#6B7280]" /></button>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-xs text-[#6B7280] block mb-1">First Name</label><input name="firstName" required className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]" /></div>
                                <div><label className="text-xs text-[#6B7280] block mb-1">Last Name</label><input name="lastName" required className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]" /></div>
                            </div>
                            <div><label className="text-xs text-[#6B7280] block mb-1">Specialty</label>
                                <select name="specialty" className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]">
                                    <option value="">Select specialty...</option>
                                    {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div><label className="text-xs text-[#6B7280] block mb-1">Department</label>
                                <select name="department" className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]">
                                    <option value="">Select department...</option>
                                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div><label className="text-xs text-[#6B7280] block mb-1">Location</label><input name="location" className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]" placeholder="e.g., Dublin, Ireland" /></div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-xs text-[#6B7280] block mb-1">Phone</label><input name="phone" className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]" placeholder="+353" /></div>
                                <div><label className="text-xs text-[#6B7280] block mb-1">Email</label><input type="email" name="email" className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]" /></div>
                            </div>
                            <div><label className="text-xs text-[#6B7280] block mb-1">Years of Experience</label><input type="number" name="experience" className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]" /></div>
                        </div>
                        <div className="flex gap-2 mt-5 justify-end">
                            <button type="button" onClick={() => setShowAddDialog(false)} className="px-4 py-2 text-sm border border-[#E5E7EB] text-[#6B7280] rounded-lg hover:bg-[#F9FAFB]">Cancel</button>
                            <button type="submit" className="px-4 py-2 text-sm bg-[#10B981] text-white rounded-lg hover:bg-[#059669]">Add Locum</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Edit Locum Dialog */}
            {showEditDialog && selectedLocum && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
                    <form onSubmit={handleEditLocumSubmit} className="bg-white rounded-xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between flex-shrink-0">
                            <div>
                                <h3 className="text-lg text-[#1F2937]" style={{ fontWeight: 600 }}>Edit Locum Profile</h3>
                                <p className="text-xs text-[#9CA3AF]">Modify contact, registration, and rates for {selectedLocum.id}</p>
                            </div>
                            <button type="button" onClick={() => setShowEditDialog(false)} className="p-2 hover:bg-[#F3F4F6] rounded-lg">
                                <X className="w-5 h-5 text-[#6B7280]" />
                            </button>
                        </div>

                        {/* Modal Sub-navigation Tabs */}
                        <div className="flex border-b border-[#E5E7EB] bg-[#F9FAFB] px-4 flex-shrink-0">
                            {(['personal', 'professional', 'financial'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setEditTab(tab)}
                                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${
                                        editTab === tab
                                            ? 'border-[#10B981] text-[#10B981]'
                                            : 'border-transparent text-[#6B7280] hover:text-[#1F2937] hover:border-[#E5E7EB]'
                                    }`}
                                >
                                    {tab} Details
                                </button>
                            ))}
                        </div>
                        
                        <div className="p-6 space-y-5 overflow-y-auto flex-1 bg-white">
                            {/* PERSONAL DETAILS TAB */}
                            {editTab === 'personal' && (
                                <div className="space-y-4">
                                    <h4 className="text-xs font-semibold text-[#374151] uppercase tracking-wider border-b border-[#F3F4F6] pb-1">Core Account Information</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Full Name</label>
                                            <input 
                                                type="text" 
                                                value={editName}
                                                onChange={e => setEditName(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Availability Status</label>
                                            <select 
                                                value={editStatus}
                                                onChange={e => setEditStatus(e.target.value as any)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            >
                                                <option value="available">Available</option>
                                                <option value="booked">Booked</option>
                                                <option value="unavailable">Unavailable</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Date of Birth</label>
                                            <input 
                                                type="date" 
                                                value={editDob}
                                                onChange={e => setEditDob(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Nationality</label>
                                            <input 
                                                type="text" 
                                                value={editNationality}
                                                onChange={e => setEditNationality(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Gender</label>
                                            <select 
                                                value={editGender}
                                                onChange={e => setEditGender(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Female">Female</option>
                                                <option value="Male">Male</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <h4 className="text-xs font-semibold text-[#374151] uppercase tracking-wider border-b border-[#F3F4F6] pb-1 pt-2">Contact & Location</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Mobile Number</label>
                                            <input 
                                                type="text" 
                                                value={editMobile}
                                                onChange={e => setEditMobile(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Landline Phone</label>
                                            <input 
                                                type="text" 
                                                value={editPhone}
                                                onChange={e => setEditPhone(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Email Address</label>
                                            <input 
                                                type="email" 
                                                value={editEmail}
                                                onChange={e => setEditEmail(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Postal Address</label>
                                            <input 
                                                type="text" 
                                                value={editAddress}
                                                onChange={e => setEditAddress(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Eircode / Postcode</label>
                                            <input 
                                                type="text" 
                                                value={editEircode}
                                                onChange={e => setEditEircode(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">PPS Number</label>
                                            <input 
                                                type="text" 
                                                value={editPpsn}
                                                onChange={e => setEditPpsn(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Emergency Contact Name</label>
                                            <input 
                                                type="text" 
                                                value={editEmergencyContact}
                                                onChange={e => setEditEmergencyContact(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Emergency Phone</label>
                                            <input 
                                                type="text" 
                                                value={editEmergencyPhone}
                                                onChange={e => setEditEmergencyPhone(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* PROFESSIONAL DETAILS TAB */}
                            {editTab === 'professional' && (
                                <div className="space-y-4">
                                    <h4 className="text-xs font-semibold text-[#374151] uppercase tracking-wider border-b border-[#F3F4F6] pb-1">Specialization & Experience</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Primary Specialty</label>
                                            <input 
                                                type="text" 
                                                value={editSpecialty}
                                                onChange={e => setEditSpecialty(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Sub-Specialty</label>
                                            <input 
                                                type="text" 
                                                value={editSubSpecialty}
                                                onChange={e => setEditSubSpecialty(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Staff Grade</label>
                                            <input 
                                                type="text" 
                                                value={editGrade}
                                                onChange={e => setEditGrade(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Total Experience (Years)</label>
                                            <input 
                                                type="text" 
                                                value={editExperience}
                                                onChange={e => setEditExperience(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                    </div>

                                    <h4 className="text-xs font-semibold text-[#374151] uppercase tracking-wider border-b border-[#F3F4F6] pb-1 pt-2">Work Preferences & Capabilities</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Languages Spoken (comma-separated)</label>
                                            <input 
                                                type="text" 
                                                value={editLanguages}
                                                onChange={e => setEditLanguages(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                                placeholder="e.g. English, Spanish"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">EWTD Max Hours (weekly)</label>
                                            <input 
                                                type="number" 
                                                value={editMaxWeeklyHours}
                                                onChange={e => setEditMaxWeeklyHours(Number(e.target.value))}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs text-[#4B5563] mb-1 font-medium">Preferred Locations (comma-separated)</label>
                                        <input 
                                            type="text" 
                                            value={editPreferredLocations}
                                            onChange={e => setEditPreferredLocations(e.target.value)}
                                            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            placeholder="e.g. Dublin, Galway, Cork"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs text-[#4B5563] mb-2 font-medium">Preferred Shifts</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['Day', 'Night', 'Weekend', 'On-Call'].map(shift => {
                                                const isSelected = editPreferredShifts.includes(shift);
                                                return (
                                                    <button
                                                        key={shift}
                                                        type="button"
                                                        onClick={() => {
                                                            if (isSelected) {
                                                                setEditPreferredShifts(editPreferredShifts.filter(s => s !== shift));
                                                            } else {
                                                                setEditPreferredShifts([...editPreferredShifts, shift]);
                                                            }
                                                        }}
                                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                                            isSelected 
                                                                ? 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]'
                                                                : 'bg-[#F9FAFB] text-[#4B5563] border-[#E5E7EB] hover:bg-[#F3F4F6]'
                                                        }`}
                                                    >
                                                        {shift}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <h4 className="text-xs font-semibold text-[#374151] uppercase tracking-wider border-b border-[#F3F4F6] pb-1 pt-2">Qualifications</h4>
                                    <div>
                                        <label className="block text-xs text-[#4B5563] mb-1 font-medium">Qualifications (comma-separated)</label>
                                        <input 
                                            type="text" 
                                            value={editQualifications}
                                            onChange={e => setEditQualifications(e.target.value)}
                                            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            placeholder="e.g. MRCPI, FRCS, MD"
                                        />
                                    </div>

                                    <h4 className="text-xs font-semibold text-[#374151] uppercase tracking-wider border-b border-[#F3F4F6] pb-1 pt-2">Medical Board Registrations</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">IMC Number (Ireland)</label>
                                            <input 
                                                type="text" 
                                                value={editImcNumber}
                                                onChange={e => setEditImcNumber(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">IMC Expiry Date</label>
                                            <input 
                                                type="date" 
                                                value={editImcExpiry}
                                                onChange={e => setEditImcExpiry(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">GMC Number (UK)</label>
                                            <input 
                                                type="text" 
                                                value={editGmcNumber}
                                                onChange={e => setEditGmcNumber(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">GMC Expiry Date</label>
                                            <input 
                                                type="date" 
                                                value={editGmcExpiry}
                                                onChange={e => setEditGmcExpiry(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs text-[#4B5563] mb-1 font-medium">Specialist Register Details</label>
                                        <input 
                                            type="text" 
                                            value={editSpecialistRegister}
                                            onChange={e => setEditSpecialistRegister(e.target.value)}
                                            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* FINANCIAL DETAILS TAB */}
                            {editTab === 'financial' && (
                                <div className="space-y-4">
                                    <h4 className="text-xs font-semibold text-[#374151] uppercase tracking-wider border-b border-[#F3F4F6] pb-1">Tax & Payment Setup</h4>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Tax Classification Status</label>
                                            <input 
                                                type="text" 
                                                value={editTaxStatus}
                                                onChange={e => setEditTaxStatus(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                                placeholder="e.g. Self-Employed (Sole Trader)"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-1">
                                        <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl">
                                            <input 
                                                type="checkbox"
                                                id="editRevenueRegistered"
                                                checked={editRevenueRegistered}
                                                onChange={e => setEditRevenueRegistered(e.target.checked)}
                                                className="w-4 h-4 text-[#10B981] focus:ring-[#10B981] border-[#E5E7EB] rounded"
                                            />
                                            <label htmlFor="editRevenueRegistered" className="text-xs text-[#374151] font-semibold cursor-pointer select-none">
                                                Revenue Registered Status
                                            </label>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl">
                                            <input 
                                                type="checkbox"
                                                id="editVatRegistered"
                                                checked={editVatRegistered}
                                                onChange={e => setEditVatRegistered(e.target.checked)}
                                                className="w-4 h-4 text-[#10B981] focus:ring-[#10B981] border-[#E5E7EB] rounded"
                                            />
                                            <label htmlFor="editVatRegistered" className="text-xs text-[#374151] font-semibold cursor-pointer select-none">
                                                VAT Registered Status
                                            </label>
                                        </div>
                                    </div>

                                    <h4 className="text-xs font-semibold text-[#374151] uppercase tracking-wider border-b border-[#F3F4F6] pb-1 pt-2">Default Shift Rates (€)</h4>
                                    <div className="grid grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Standard Day Rate</label>
                                            <input 
                                                type="number" 
                                                value={editStandardDayRate}
                                                onChange={e => setEditStandardDayRate(Number(e.target.value))}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Standard Night Rate</label>
                                            <input 
                                                type="number" 
                                                value={editStandardNightRate}
                                                onChange={e => setEditStandardNightRate(Number(e.target.value))}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">Weekend Rate</label>
                                            <input 
                                                type="number" 
                                                value={editWeekendRate}
                                                onChange={e => setEditWeekendRate(Number(e.target.value))}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">On-Call Rate</label>
                                            <input 
                                                type="number" 
                                                value={editOncallRate}
                                                onChange={e => setEditOncallRate(Number(e.target.value))}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                    </div>

                                    <h4 className="text-xs font-semibold text-[#374151] uppercase tracking-wider border-b border-[#F3F4F6] pb-1 pt-2">Bank Routing & Coordinates</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium font-medium">Bank Name</label>
                                            <input 
                                                type="text" 
                                                value={editBankName}
                                                onChange={e => setEditBankName(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#4B5563] mb-1 font-medium">BIC (SWIFT)</label>
                                            <input 
                                                type="text" 
                                                value={editBic}
                                                onChange={e => setEditBic(e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs text-[#4B5563] mb-1 font-medium">IBAN Number</label>
                                        <input 
                                            type="text" 
                                            value={editIban}
                                            onChange={e => setEditIban(e.target.value)}
                                            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-5 border-t border-[#E5E7EB] flex justify-end gap-2 bg-[#F9FAFB] flex-shrink-0">
                            <button 
                                type="button" 
                                onClick={() => setShowEditDialog(false)}
                                className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#4B5563] bg-white hover:bg-[#F3F4F6]"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg text-sm flex items-center gap-1.5"
                                style={{ fontWeight: 500 }}
                            >
                                <CheckCircle className="w-4 h-4" /> Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Archive Locum Dialog */}
            {showArchiveDialog && selectedLocum && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-[400px] text-center">
                        <div className="w-12 h-12 bg-[#FEF2F2] text-[#EF4444] rounded-full flex items-center justify-center mx-auto mb-4">
                            <Archive className="w-6 h-6" />
                        </div>
                        <h3 className="text-[#1F2937] mb-2">Archive Locum?</h3>
                        <p className="text-sm text-[#6B7280] mb-6">Are you sure you want to archive <strong>{selectedLocum.name}</strong>? This will remove them from the active directory and cancel any pending availability.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowArchiveDialog(false)} className="flex-1 px-4 py-2 text-sm border border-[#E5E7EB] text-[#6B7280] rounded-lg hover:bg-[#F9FAFB]">Cancel</button>
                             <button type="button" className="flex-1 px-4 py-2 text-sm bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626]" onClick={async () => {
                                try {
                                    await locumService.archiveLocum(selectedLocum.id);
                                    const updated = await locumService.getAllLocums();
                                    setLocumsList(updated);
                                    toast.success(`${selectedLocum.name} has been archived`);
                                    setShowArchiveDialog(false);
                                } catch (err) {
                                    toast.error('Failed to archive locum');
                                }
                            }}>Confirm Archive</button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Applicant Dialog */}
            {showApplicantView && selectedApplicant && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F9FAFB]">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center text-white text-lg font-bold">
                                    {selectedApplicant.name.split(' ').map((n: string) => n[0]).join('')}
                                </div>
                                <div>
                                    <h3 className="text-[#1F2937] text-lg font-bold">{selectedApplicant.name}</h3>
                                    <p className="text-xs text-[#6B7280]">Application ID: {selectedApplicant.id}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowApplicantView(false)} className="p-2 hover:bg-[#E5E7EB] rounded-full">
                                <X className="w-5 h-5 text-[#6B7280]" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] text-[#9CA3AF] uppercase font-semibold tracking-wider">Specialty</p>
                                        <p className="text-sm text-[#1F2937] font-medium mt-1">{selectedApplicant.specialty}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-[#9CA3AF] uppercase font-semibold tracking-wider">Location</p>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <MapPin className="w-3.5 h-3.5 text-[#6B7280]" />
                                            <p className="text-sm text-[#1F2937] font-medium">{selectedApplicant.location}, Ireland</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-[#9CA3AF] uppercase font-semibold tracking-wider">Applied Date</p>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                            <p className="text-sm text-[#1F2937] font-medium">{selectedApplicant.appliedDate}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] text-[#9CA3AF] uppercase font-semibold tracking-wider">Current Stage</p>
                                        <div className="mt-1">
                                            <span className="px-2 py-1 rounded-full text-[11px] border font-semibold"
                                                style={{
                                                    backgroundColor: stageConfig[selectedApplicant.status]?.bg,
                                                    color: stageConfig[selectedApplicant.status]?.color,
                                                    borderColor: stageConfig[selectedApplicant.status]?.border
                                                }}>
                                                {selectedApplicant.stage}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-[#9CA3AF] uppercase font-semibold tracking-wider">Contact Details</p>
                                        <div className="space-y-1.5 mt-1">
                                            <div className="flex items-center gap-1.5 text-sm text-[#6B7280]"><Phone className="w-3.5 h-3.5" /> {selectedApplicant.phone || `+353 87 234 ${selectedApplicant.id.slice(-4)}`}</div>
                                            <div className="flex items-center gap-1.5 text-sm text-[#6B7280]"><Mail className="w-3.5 h-3.5" /> {selectedApplicant.email || `${selectedApplicant.name.toLowerCase().replace(/\s+/g, '.')}@email.com`}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-[#E5E7EB]">
                                <p className="text-[10px] text-[#9CA3AF] uppercase font-semibold tracking-wider mb-3">Documents Provided</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {['Curriculum Vitae', 'Medical Council Reg', 'Professional Indemnity', 'Garda Vetting'].map(doc => (
                                        <div key={doc} className="flex items-center justify-between p-2 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-3.5 h-3.5 text-[#10B981]" />
                                                <span className="text-xs text-[#1F2937]">{doc}</span>
                                            </div>
                                            <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-[#E5E7EB] bg-[#F9FAFB] flex justify-end gap-3">
                            <button onClick={() => setShowApplicantView(false)} className="px-4 py-2 text-sm text-[#6B7280] font-medium hover:text-[#1F2937]">Close</button>
                            <button
                                onClick={() => {
                                    setShowApplicantView(false);
                                    const nextId = selectedApplicant.status === 'new' ? 'interview' : selectedApplicant.status === 'interview' ? 'verification' : 'onboarding';
                                    setTargetStage(nextId);
                                    setShowAdvanceStage(true);
                                }}
                                className="px-4 py-2 text-sm bg-[#10B981] text-white rounded-lg font-bold hover:bg-[#059669] flex items-center gap-2"
                            >
                                Progress Application <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Advance Stage Dialog */}
            {showAdvanceStage && selectedApplicant && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-[420px] shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
                        <div className="w-14 h-14 bg-[#ECFDF5] text-[#10B981] rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-[#D1FAE5]">
                            <ArrowDown className="w-7 h-7" />
                        </div>
                        <h3 className="text-[#1F2937] text-lg font-bold text-center mb-1">Update Application Stage</h3>
                        <p className="text-sm text-[#6B7280] text-center mb-6">
                            Update the recruitment progress for <strong>{selectedApplicant.name}</strong>.
                        </p>

                        <div className="space-y-4 mb-6">
                            <div className="p-3 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB]">
                                <p className="text-[10px] text-[#9CA3AF] font-bold mb-1">CURRENT STAGE</p>
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded-full text-[10px] border font-semibold"
                                        style={{
                                            backgroundColor: stageConfig[selectedApplicant.status]?.bg,
                                            color: stageConfig[selectedApplicant.status]?.color,
                                            borderColor: stageConfig[selectedApplicant.status]?.border
                                        }}>
                                        {selectedApplicant.stage}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <ArrowDown className="w-5 h-5 text-[#9CA3AF]" />
                            </div>

                            <div>
                                <label className="text-[10px] text-[#10B981] font-bold block mb-1.5 uppercase tracking-wider">Target Recruitment Stage</label>
                                <div className="relative">
                                    <select
                                        value={targetStage}
                                        onChange={(e) => setTargetStage(e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white font-medium appearance-none"
                                    >
                                        <option value="new">New Application</option>
                                        <option value="interview">Interview Scheduled</option>
                                        <option value="verification">Credential Verification</option>
                                        <option value="onboarding">Onboarding Checklist</option>
                                        <option value="hired">Hired / Active Directory</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#FFFBEB] border border-[#FEF3C7] p-3 rounded-lg flex gap-3">
                                <Info className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                                <p className="text-xs text-[#92400E]">Moving the applicant will trigger the appropriate status updates and notifications in their portal.</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setShowAdvanceStage(false)} className="flex-1 px-4 py-2 text-sm border border-[#E5E7EB] text-[#6B7280] rounded-lg font-medium hover:bg-[#F9FAFB] transition-colors">Cancel</button>
                            <button
                                type="button"
                                className="flex-1 px-4 py-2 text-sm bg-[#10B981] text-white rounded-lg font-bold hover:bg-[#059669] flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
                                onClick={async () => {
                                    const targetLabel = targetStage === 'new' ? 'New Application' :
                                        targetStage === 'interview' ? 'Interview Scheduled' :
                                            targetStage === 'verification' ? 'Credential Verification' :
                                                targetStage === 'onboarding' ? 'Onboarding Checklist' : 'Hired';
                                    
                                    try {
                                        if (targetStage === 'hired') {
                                            await locumService.hireApplicant(selectedApplicant.id);
                                            const updatedLocums = await locumService.getAllLocums();
                                            const updatedApplicants = await locumService.getAllApplicants();
                                            setLocumsList(updatedLocums);
                                            setApplicantsList(updatedApplicants);
                                            toast.success(`${selectedApplicant.name} has been successfully hired and added to the Locum Directory!`);
                                        } else {
                                            await locumService.updateApplicantStage(selectedApplicant.id, targetLabel, targetStage as any);
                                            const updatedApplicants = await locumService.getAllApplicants();
                                            setApplicantsList(updatedApplicants);
                                            toast.success(`${selectedApplicant.name} updated to ${targetLabel} stage`);
                                        }
                                    } catch (err) {
                                        toast.error('Failed to update applicant stage');
                                    }
                                    setShowAdvanceStage(false);
                                }}
                            >
                                <UserCheck className="w-4 h-4" /> Confirm Update
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Applicant Dialog */}
            {showAddApplicantDialog && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <form 
                        onSubmit={handleAddApplicantSubmit} 
                        className="bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F9FAFB]">
                            <div>
                                <h3 className="text-[#1F2937] text-lg font-bold" style={{ fontWeight: 700 }}>Add New Applicant</h3>
                                <p className="text-xs text-[#6B7280]">Enter applicant details to add them to the recruitment pipeline</p>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => {
                                    setShowAddApplicantDialog(false);
                                    setCustomSpecialtyActive(false);
                                    setCustomLocationActive(false);
                                }} 
                                className="p-2 hover:bg-[#E5E7EB] rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-[#6B7280]" />
                            </button>
                        </div>

                        {/* Form Fields */}
                        <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-[#6B7280] block mb-1.5 font-semibold">First Name <span className="text-[#EF4444]">*</span></label>
                                    <input 
                                        name="firstName" 
                                        required 
                                        placeholder="e.g., Jane"
                                        className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all" 
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-[#6B7280] block mb-1.5 font-semibold">Last Name <span className="text-[#EF4444]">*</span></label>
                                    <input 
                                        name="lastName" 
                                        required 
                                        placeholder="e.g., Doe"
                                        className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all" 
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-[#6B7280] block mb-1.5 font-semibold">Phone Number</label>
                                    <input 
                                        name="phone" 
                                        placeholder="e.g., +353 87 123 4567"
                                        className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all" 
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-[#6B7280] block mb-1.5 font-semibold">Email Address</label>
                                    <input 
                                        type="email"
                                        name="email" 
                                        placeholder="e.g., jane.doe@email.com"
                                        className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all" 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-[#6B7280] block mb-1.5 font-semibold">Specialty <span className="text-[#EF4444]">*</span></label>
                                <select 
                                    name="specialty" 
                                    required
                                    onChange={(e) => setCustomSpecialtyActive(e.target.value === 'other')}
                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all bg-white"
                                >
                                    <option value="">Select specialty...</option>
                                    <option value="Cardiology">Cardiology</option>
                                    <option value="General Surgery">General Surgery</option>
                                    <option value="Anesthesiology">Anesthesiology</option>
                                    <option value="Emergency Medicine">Emergency Medicine</option>
                                    <option value="Pediatrics">Pediatrics</option>
                                    <option value="Orthopedics">Orthopedics</option>
                                    <option value="Dermatology">Dermatology</option>
                                    <option value="General Practice">General Practice</option>
                                    <option value="Psychiatry">Psychiatry</option>
                                    <option value="Radiology">Radiology</option>
                                    <option value="Oncology">Oncology</option>
                                    <option value="other">Other / Custom specialty...</option>
                                </select>
                            </div>

                            {customSpecialtyActive && (
                                <div className="animate-in slide-in-from-top-2 duration-200">
                                    <label className="text-xs text-[#10B981] block mb-1.5 font-semibold">Custom Specialty <span className="text-[#EF4444]">*</span></label>
                                    <input 
                                        name="customSpecialty" 
                                        required 
                                        placeholder="Enter custom specialty (e.g., Neurology)"
                                        className="w-full px-3 py-2 text-sm border border-[#10B981] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all" 
                                    />
                                </div>
                            )}

                            <div>
                                <label className="text-xs text-[#6B7280] block mb-1.5 font-semibold">Department <span className="text-[#EF4444]">*</span></label>
                                <select 
                                    name="department" 
                                    required
                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all bg-white"
                                >
                                    <option value="">Select department...</option>
                                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs text-[#6B7280] block mb-1.5 font-semibold">Location <span className="text-[#EF4444]">*</span></label>
                                <select 
                                    name="location" 
                                    required
                                    onChange={(e) => setCustomLocationActive(e.target.value === 'other')}
                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all bg-white"
                                >
                                    <option value="">Select location...</option>
                                    <option value="Dublin">Dublin</option>
                                    <option value="Cork">Cork</option>
                                    <option value="Galway">Galway</option>
                                    <option value="Limerick">Limerick</option>
                                    <option value="Waterford">Waterford</option>
                                    <option value="Kilkenny">Kilkenny</option>
                                    <option value="other">Other / Custom location...</option>
                                </select>
                            </div>

                            {customLocationActive && (
                                <div className="animate-in slide-in-from-top-2 duration-200">
                                    <label className="text-xs text-[#10B981] block mb-1.5 font-semibold">Custom Location <span className="text-[#EF4444]">*</span></label>
                                    <input 
                                        name="customLocation" 
                                        required 
                                        placeholder="Enter custom location (e.g., Wexford)"
                                        className="w-full px-3 py-2 text-sm border border-[#10B981] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all" 
                                    />
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-[#E5E7EB] bg-[#F9FAFB] flex justify-end gap-3">
                            <button 
                                type="button" 
                                onClick={() => {
                                    setShowAddApplicantDialog(false);
                                    setCustomSpecialtyActive(false);
                                    setCustomLocationActive(false);
                                }} 
                                className="px-5 py-2.5 text-sm border border-[#E5E7EB] text-[#6B7280] rounded-xl hover:bg-white transition-colors"
                                style={{ fontWeight: 500 }}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="px-5 py-2.5 text-sm bg-[#10B981] text-white rounded-xl hover:bg-[#059669] shadow-md transition-all active:scale-95"
                                style={{ fontWeight: 600 }}
                            >
                                Add to Pipeline
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
