import { DEMO_VENDORS } from '../data/demoVendors';
import { Vendor, VendorCategory, VendorStatus } from '../types';
import { getSupabaseClient } from './supabaseClient';

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

export interface VendorApplicationRow {
  id: string;
  business_name: string;
  contact_name: string;
  category: string;
  city: string;
  service_area: string;
  phone: string;
  whatsapp: string;
  email: string;
  description: string;
  packages: unknown;
  status: VendorStatus;
  is_visible: boolean;
  submitted_at: string;
  updated_at: string;
}

interface StoredPackage extends VendorPackageDraft {
  startingPrice?: number;
  websiteOrInstagram?: string;
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

const getStoredPackages = (value: unknown): StoredPackage[] => {
  if (!Array.isArray(value)) return [];

  return value.filter((entry): entry is StoredPackage => (
    typeof entry === 'object' && entry !== null &&
    typeof (entry as StoredPackage).name === 'string' &&
    typeof (entry as StoredPackage).price === 'number' &&
    typeof (entry as StoredPackage).description === 'string'
  ));
};

const mapRowToApplication = (row: VendorApplicationRow): VendorApplicationInput => {
  const packages = getStoredPackages(row.packages);
  const primaryPackage = packages[0] || { name: 'Custom Package', price: 0, description: '' };

  return {
    id: row.id,
    businessName: row.business_name,
    ownerName: row.contact_name,
    category: normalizeVendorCategory(row.category),
    city: row.city,
    area: row.service_area,
    phone: row.phone,
    whatsapp: row.whatsapp,
    email: row.email,
    description: row.description,
    startingPrice: primaryPackage.startingPrice ?? primaryPackage.price,
    packageName: primaryPackage.name,
    packagePrice: primaryPackage.price,
    packageDescription: primaryPackage.description,
    websiteOrInstagram: primaryPackage.websiteOrInstagram || '',
    isAccurate: true,
    status: row.status,
    createdAt: row.submitted_at,
    source: 'submitted',
  };
};

const mapRowToVendor = (row: VendorApplicationRow): Vendor => {
  const application = mapRowToApplication(row);

  return {
    id: application.id,
    name: application.businessName,
    category: application.category,
    categoryKey: normalizeVendorCategoryKey(application.category),
    area: application.area,
    city: application.city,
    phone: application.phone,
    whatsapp: application.whatsapp,
    description: application.description,
    tags: [application.packageName, application.websiteOrInstagram || 'Custom Package'],
    rating: 4.8,
    startingPrice: application.startingPrice,
    packages: [{
      name: application.packageName,
      price: application.packagePrice,
      description: application.packageDescription,
    }],
    status: 'approved',
    isSample: false,
    source: 'submitted',
  };
};

export const getDemoVendors = (): Vendor[] => DEMO_VENDORS.map((vendor) => ({
  ...vendor,
  status: 'demo' as VendorStatus,
  isSample: true,
  source: 'demo' as const,
  startingPrice: vendor.startingPrice ?? 0,
  packages: vendor.packages ?? [{
    name: 'Sample package',
    price: vendor.startingPrice ?? 0,
    description: 'Sample package for demo purposes.',
  }],
}));

export const submitVendorApplication = async (
  input: Omit<VendorApplicationInput, 'id' | 'status' | 'createdAt' | 'source'>
): Promise<void> => {
  const packages: StoredPackage[] = [{
    name: input.packageName,
    price: Number(input.packagePrice) || 0,
    description: input.packageDescription,
    startingPrice: Number(input.startingPrice) || 0,
    websiteOrInstagram: input.websiteOrInstagram,
  }];

  const { error } = await getSupabaseClient()
    .from('vendor_applications')
    .insert({
      business_name: input.businessName,
      contact_name: input.ownerName,
      category: input.category,
      city: input.city,
      service_area: input.area,
      phone: input.phone,
      whatsapp: input.whatsapp,
      email: input.email,
      description: input.description,
      packages,
      status: 'pending',
      is_visible: false,
    });

  if (error) {
    throw new Error(`Vendor application could not be submitted: ${error.message}`);
  }

};

export const getApprovedVendors = async (): Promise<Vendor[]> => {
  const { data, error } = await getSupabaseClient()
    .from('vendor_applications')
    .select('*')
    .eq('status', 'approved')
    .eq('is_visible', true)
    .order('submitted_at', { ascending: false });

  if (error) {
    throw new Error(`Approved vendors could not be loaded: ${error.message}`);
  }

  return [
    ...getDemoVendors(),
    ...(data as VendorApplicationRow[]).map(mapRowToVendor),
  ];
};

export const getApprovedMarketplaceVendors = getApprovedVendors;

export const getVendorApplications = async (): Promise<VendorApplicationRow[]> => {
  const { data, error } = await getSupabaseClient()
    .from('vendor_applications')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) {
    throw new Error(`Vendor applications could not be loaded: ${error.message}`);
  }

  return (data || []) as VendorApplicationRow[];
};

export const updateVendorApplicationModeration = async (
  id: string,
  updates: Pick<VendorApplicationRow, 'status' | 'is_visible'>,
): Promise<void> => {
  const { error } = await getSupabaseClient()
    .from('vendor_applications')
    .update(updates)
    .eq('id', id);

  if (error) {
    throw new Error(`Vendor application could not be updated: ${error.message}`);
  }
};

export interface VendorRepository {
  submitVendorApplication(input: Omit<VendorApplicationInput, 'id' | 'status' | 'createdAt' | 'source'>): Promise<void>;
  getApprovedVendors(): Promise<Vendor[]>;
}

export const vendorRepository: VendorRepository = {
  submitVendorApplication,
  getApprovedVendors,
};