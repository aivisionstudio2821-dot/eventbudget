import { DEMO_VENDORS } from '../../data/demoVendors';
import { Vendor, VendorCategory, VendorStatus } from '../../types';

export const VENDOR_APPLICATION_STORAGE_KEY = 'eventbudget_vendor_applications_v1';

export interface VendorPackageDraft {
  name: string;
  price: number;
  description: string;
}

export interface VendorApplicationInput {
  id: string;
  businessName: string;
  ownerName: string;
  category: Exclude<VendorCategory, 'ALL'>;
  city: string;
  area: string;
  phone: string;
  whatsapp: string;
  email: string;
  description: string;
  startingPrice: number;
  packageName: string;
  packagePrice: number;
  packageDescription: string;
  websiteOrInstagram: string;
  isAccurate: boolean;
  status: VendorStatus;
  createdAt: string;
  source: 'submitted';
}

export const normalizeVendorCategory = (value: string): Exclude<VendorCategory, 'ALL'> => {
  const mapped: Record<string, Exclude<VendorCategory, 'ALL'>> = {
    DJ: 'DJ',
    CATERING: 'CATERING',
    'EVENT MANAGEMENT': 'EVENT MANAGEMENT',
    DECORATION: 'DECORATION',
    PHOTOGRAPHY: 'PHOTOGRAPHY',
    VENUE: 'VENUE',
  };

  return mapped[value] || 'DJ';
};

export const normalizeVendorCategoryKey = (category: Exclude<VendorCategory, 'ALL'>): Vendor['categoryKey'] => {
  const map: Record<Exclude<VendorCategory, 'ALL'>, Vendor['categoryKey']> = {
    DJ: 'dj',
    CATERING: 'food',
    'EVENT MANAGEMENT': 'misc',
    DECORATION: 'decoration',
    PHOTOGRAPHY: 'photography',
    VENUE: 'venue',
  };

  return map[category] || 'dj';
};

export const getStoredVendorApplications = (): VendorApplicationInput[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(VENDOR_APPLICATION_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to read vendor applications', error);
    return [];
  }
};

export const saveVendorApplications = (applications: VendorApplicationInput[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(VENDOR_APPLICATION_STORAGE_KEY, JSON.stringify(applications));
};

export const getApprovedMarketplaceVendors = (): Vendor[] => {
  const stored = getStoredVendorApplications();
  const approvedFromStorage: Vendor[] = stored
    .filter((entry) => entry.status === 'approved')
    .map((entry) => ({
      id: entry.id,
      name: entry.businessName,
      category: entry.category,
      categoryKey: normalizeVendorCategoryKey(entry.category),
      area: entry.area,
      city: entry.city,
      phone: entry.phone,
      whatsapp: entry.whatsapp,
      description: entry.description,
      tags: [entry.packageName, entry.websiteOrInstagram || 'Custom Package'],
      rating: 4.8,
      startingPrice: entry.startingPrice,
      packages: [
        {
          name: entry.packageName,
          price: entry.packagePrice,
          description: entry.packageDescription,
        },
      ],
      status: 'approved',
      isSample: false,
      source: 'submitted',
    }));

  return [
    ...DEMO_VENDORS.map((vendor) => ({
      ...vendor,
      status: 'demo' as VendorStatus,
      isSample: true,
      source: 'demo' as const,
      startingPrice: vendor.startingPrice ?? 0,
      packages: vendor.packages ?? [
        {
          name: 'Sample package',
          price: vendor.startingPrice ?? 0,
          description: 'Sample package for demo purposes.',
        },
      ],
    })),
    ...approvedFromStorage,
  ];
};
