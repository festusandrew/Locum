
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type RegionType = 'global' | 'IE' | 'GB' | 'US';
export type CurrencyType = 'USD' | 'EUR' | 'GBP';
export type DateFormatType = 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
export type TimeFormatType = '24-hour' | '12-hour';

export interface LocalizationTerms {
    nationalVetting: string;
    nationalVettingShort: string;
    medicalCouncil: string;
    medicalLicense: string;
    taxIdName: string;
    taxIdPlaceholder: string;
    bankName: string;
    bankPlaceholder: string;
    hospitals: string[];
}

export interface GeolocationInfo {
    city?: string;
    country?: string;
    ip?: string;
    source: 'API' | 'Browser Timezone' | 'Default Fallback';
}

interface SystemSettingsContextType {
    region: RegionType;
    currency: CurrencyType;
    dateFormat: DateFormatType;
    timeFormat: TimeFormatType;
    autoDetect: boolean;
    detectedInfo: GeolocationInfo | null;
    isDetecting: boolean;
    brandingFacilityId: string | null;
    isWhitelabelActive: boolean;
    brandingLogo: string | null;
    brandingName: string | null;
    brandingColor: string;
    setRegion: (region: RegionType) => void;
    setCurrency: (currency: CurrencyType) => void;
    setDateFormat: (dateFormat: DateFormatType) => void;
    setTimeFormat: (timeFormat: TimeFormatType) => void;
    setAutoDetect: (autoDetect: boolean) => void;
    setBrandingFacilityId: (id: string | null) => void;
    setIsWhitelabelActive: (active: boolean) => void;
    t: (key: keyof LocalizationTerms) => string;
    getHospitals: () => string[];
    formatCurrency: (amount: number, minimumFractionDigits?: number) => string;
    formatDate: (date: Date | string) => string;
}

const localizationData: Record<RegionType, LocalizationTerms> = {
    global: {
        nationalVetting: 'Criminal Record Clearance',
        nationalVettingShort: 'Background Screening',
        medicalCouncil: 'Medical Licensing Board',
        medicalLicense: 'Medical License Registration',
        taxIdName: 'National Tax ID',
        taxIdPlaceholder: 'e.g., TAX-123456',
        bankName: 'Global Bank Name',
        bankPlaceholder: 'e.g., International Bank Co.',
        hospitals: [
            'General Medical Center',
            'City Care Hospital',
            'Mercy Health Clinic',
            'St. Jude\'s Hospital',
            'International Clinical Center',
            'Metro General Hospital',
            'Amity Medical Center'
        ]
    },
    IE: {
        nationalVetting: 'Garda Vetting (NVB)',
        nationalVettingShort: 'Garda Vetting',
        medicalCouncil: 'Medical Council of Ireland (IMC)',
        medicalLicense: 'Medical Council of Ireland License',
        taxIdName: 'PPSN (Ireland)',
        taxIdPlaceholder: 'e.g., 1234567FA',
        bankName: 'Bank of Ireland',
        bankPlaceholder: 'e.g., Bank of Ireland, AIB',
        hospitals: [
            'St. James\'s Hospital',
            'Cork University Hospital',
            'Beaumont Hospital',
            'University Hospital Galway',
            'Mater Misericordiae University Hospital',
            'Waterford University Hospital',
            'University Hospital Limerick'
        ]
    },
    GB: {
        nationalVetting: 'DBS Criminal Record Check',
        nationalVettingShort: 'DBS Clearance',
        medicalCouncil: 'General Medical Council (GMC)',
        medicalLicense: 'GMC Registration & Licence',
        taxIdName: 'National Insurance Number (NINO)',
        taxIdPlaceholder: 'e.g., QQ 12 34 56 A',
        bankName: 'Barclays Bank',
        bankPlaceholder: 'e.g., HSBC, Barclays, Lloyds',
        hospitals: [
            'St Thomas\' Hospital',
            'Royal Infirmary of Edinburgh',
            'King\'s College Hospital',
            'Queen Elizabeth Hospital',
            'Manchester Royal Infirmary',
            'St George\'s Hospital',
            'Bristol Royal Infirmary'
        ]
    },
    US: {
        nationalVetting: 'Federal & State Background Check',
        nationalVettingShort: 'Background Check',
        medicalCouncil: 'State Medical Licensing Board',
        medicalLicense: 'State Medical License',
        taxIdName: 'Social Security Number (SSN)',
        taxIdPlaceholder: 'e.g., 123-45-6789',
        bankName: 'Chase Bank',
        bankPlaceholder: 'e.g., Chase, Bank of America, Wells Fargo',
        hospitals: [
            'Johns Hopkins Hospital',
            'Mayo Clinic',
            'Cleveland Clinic',
            'Massachusetts General Hospital',
            'UCSF Medical Center',
            'Mount Sinai Hospital',
            'Stanford Health Care'
        ]
    }
};

const SystemSettingsContext = createContext<SystemSettingsContextType | undefined>(undefined);

export function SystemSettingsProvider({ children }: { children: ReactNode }) {
    const [region, setRegionState] = useState<RegionType>(() => {
        return (localStorage.getItem('mployus_region') as RegionType) || 'global';
    });
    const [currency, setCurrencyState] = useState<CurrencyType>(() => {
        return (localStorage.getItem('mployus_currency') as CurrencyType) || 'USD';
    });
    const [dateFormat, setDateFormatState] = useState<DateFormatType>(() => {
        return (localStorage.getItem('mployus_date_format') as DateFormatType) || 'DD/MM/YYYY';
    });
    const [timeFormat, setTimeFormatState] = useState<TimeFormatType>(() => {
        return (localStorage.getItem('mployus_time_format') as TimeFormatType) || '24-hour';
    });

    const [autoDetect, setAutoDetectState] = useState<boolean>(() => {
        const stored = localStorage.getItem('mployus_auto_detect');
        return stored !== 'false'; // Default to true
    });
    const [detectedInfo, setDetectedInfo] = useState<GeolocationInfo | null>(null);
    const [isDetecting, setIsDetecting] = useState<boolean>(false);

    const [brandingFacilityId, setBrandingFacilityIdState] = useState<string | null>(() => {
        return localStorage.getItem('mployus_branding_facility_id') || null;
    });
    const [isWhitelabelActive, setIsWhitelabelActiveState] = useState<boolean>(() => {
        // Commented out whitelabeling features temporarily as requested:
        // return localStorage.getItem('mployus_whitelabel_active') === 'true';
        return false;
    });

    const [brandingLogo, setBrandingLogo] = useState<string | null>(null);
    const [brandingName, setBrandingName] = useState<string | null>(null);
    const [brandingColor, setBrandingColor] = useState<string>('#10B981');

    const setBrandingFacilityId = (id: string | null) => {
        setBrandingFacilityIdState(id);
        if (id) {
            localStorage.setItem('mployus_branding_facility_id', id);
        } else {
            localStorage.removeItem('mployus_branding_facility_id');
        }
    };

    const setIsWhitelabelActive = (active: boolean) => {
        // Commented out whitelabeling activations temporarily as requested:
        // setIsWhitelabelActiveState(active);
        // localStorage.setItem('mployus_whitelabel_active', String(active));
        setIsWhitelabelActiveState(false);
        localStorage.setItem('mployus_whitelabel_active', 'false');
    };

    useEffect(() => {
        if (!brandingFacilityId) {
            setBrandingLogo(null);
            setBrandingName(null);
            setBrandingColor('#10B981');
            return;
        }

        // Try to fetch custom profile
        const storedProfileStr = localStorage.getItem(`mployus_facility_profile_${brandingFacilityId}`);
        if (storedProfileStr) {
            try {
                const profile = JSON.parse(storedProfileStr);
                setBrandingLogo(profile.logo || null);
                setBrandingName(profile.name || null);
                setBrandingColor(profile.themeColor || '#10B981');
                return;
            } catch (e) {
                console.error(e);
            }
        }

        // Fallback to central client list lookups
        const storedClientsStr = localStorage.getItem('mployus_clients');
        if (storedClientsStr) {
            try {
                const clients = JSON.parse(storedClientsStr);
                const client = clients.find((c: any) => c.id === brandingFacilityId);
                if (client) {
                    setBrandingLogo(client.logo || null);
                    setBrandingName(client.name || null);
                    setBrandingColor(client.themeColor || '#10B981');
                }
            } catch (e) {
                console.error(e);
            }
        }
    }, [brandingFacilityId]);

    const setRegion = (newRegion: RegionType) => {
        setRegionState(newRegion);
        localStorage.setItem('mployus_region', newRegion);
        
        let defaultCurrency: CurrencyType = 'USD';
        let defaultDateFormat: DateFormatType = 'DD/MM/YYYY';
        
        if (newRegion === 'IE') {
            defaultCurrency = 'EUR';
            defaultDateFormat = 'DD/MM/YYYY';
        } else if (newRegion === 'GB') {
            defaultCurrency = 'GBP';
            defaultDateFormat = 'DD/MM/YYYY';
        } else if (newRegion === 'US') {
            defaultCurrency = 'USD';
            defaultDateFormat = 'MM/DD/YYYY';
        }
        
        setCurrencyState(defaultCurrency);
        localStorage.setItem('mployus_currency', defaultCurrency);
        setDateFormatState(defaultDateFormat);
        localStorage.setItem('mployus_date_format', defaultDateFormat);
    };

    const setCurrency = (newCurrency: CurrencyType) => {
        setCurrencyState(newCurrency);
        localStorage.setItem('mployus_currency', newCurrency);
    };

    const setDateFormat = (newFormat: DateFormatType) => {
        setDateFormatState(newFormat);
        localStorage.setItem('mployus_date_format', newFormat);
    };

    const setTimeFormat = (newFormat: TimeFormatType) => {
        setTimeFormatState(newFormat);
        localStorage.setItem('mployus_time_format', newFormat);
    };

    const setAutoDetect = (val: boolean) => {
        setAutoDetectState(val);
        localStorage.setItem('mployus_auto_detect', String(val));
    };

    // Auto-detect Geolocation Process
    useEffect(() => {
        if (!autoDetect) {
            setIsDetecting(false);
            return;
        }

        const detectLocation = async () => {
            setIsDetecting(true);
            try {
                const res = await fetch('https://ipapi.co/json/');
                if (!res.ok) throw new Error('API Request Failed');
                
                const data = await res.json();
                const countryCode = data.country_code; // e.g. "IE", "GB", "US"
                const city = data.city;
                const country = data.country_name;
                const ip = data.ip;

                let targetRegion: RegionType = 'global';
                if (['IE', 'GB', 'US'].includes(countryCode)) {
                    targetRegion = countryCode as RegionType;
                }

                setRegion(targetRegion);
                setDetectedInfo({
                    city,
                    country,
                    ip,
                    source: 'API'
                });
            } catch (error) {
                console.warn('Geolocation API lookup failed, running browser fallback...', error);
                
                const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
                const lang = navigator.language || '';
                
                let fallbackRegion: RegionType = 'global';
                let fallbackCountryName = 'Global';
                let fallbackCityName = 'Unknown City';

                if (tz.includes('Dublin') || lang === 'en-IE' || lang === 'ga-IE') {
                    fallbackRegion = 'IE';
                    fallbackCountryName = 'Ireland';
                    fallbackCityName = 'Dublin (Estimate)';
                } else if (tz.includes('London') || lang === 'en-GB') {
                    fallbackRegion = 'GB';
                    fallbackCountryName = 'United Kingdom';
                    fallbackCityName = 'London (Estimate)';
                } else if (
                    tz.includes('New_York') || tz.includes('Chicago') || tz.includes('Denver') || 
                    tz.includes('Los_Angeles') || tz.includes('America') || lang === 'en-US'
                ) {
                    fallbackRegion = 'US';
                    fallbackCountryName = 'United States';
                    fallbackCityName = 'New York (Estimate)';
                }

                setRegion(fallbackRegion);
                setDetectedInfo({
                    city: fallbackCityName,
                    country: fallbackCountryName,
                    ip: 'Local network IP',
                    source: 'Browser Timezone'
                });
            } finally {
                setIsDetecting(false);
            }
        };

        detectLocation();
    }, [autoDetect]);

    const t = (key: keyof LocalizationTerms): string => {
        return localizationData[region][key] as string;
    };

    const getHospitals = (): string[] => {
        return localizationData[region].hospitals;
    };

    const formatCurrency = (amount: number, minimumFractionDigits = 2): string => {
        const localeMap: Record<CurrencyType, string> = {
            USD: 'en-US',
            EUR: 'en-IE',
            GBP: 'en-GB'
        };
        return new Intl.NumberFormat(localeMap[currency], {
            style: 'currency',
            currency: currency,
            minimumFractionDigits
        }).format(amount);
    };

    const formatDate = (date: Date | string): string => {
        const d = typeof date === 'string' ? new Date(date) : date;
        if (isNaN(d.getTime())) return typeof date === 'string' ? date : '';

        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();

        if (dateFormat === 'MM/DD/YYYY') {
            return `${month}/${day}/${year}`;
        } else if (dateFormat === 'YYYY-MM-DD') {
            return `${year}-${month}-${day}`;
        }
        return `${day}/${month}/${year}`;
    };

    return (
        <SystemSettingsContext.Provider value={{
            region, currency, dateFormat, timeFormat,
            autoDetect, detectedInfo, isDetecting,
            brandingFacilityId, isWhitelabelActive, brandingLogo, brandingName, brandingColor,
            setRegion, setCurrency, setDateFormat, setTimeFormat, setAutoDetect,
            setBrandingFacilityId, setIsWhitelabelActive,
            t, getHospitals, formatCurrency, formatDate
        }}>
            {children}
        </SystemSettingsContext.Provider>
    );
}

export function useSystemSettings() {
    const context = useContext(SystemSettingsContext);
    if (context === undefined) {
        throw new Error('useSystemSettings must be used within a SystemSettingsProvider');
    }
    return context;
}
