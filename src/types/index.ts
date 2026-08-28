export type EventType =
  | 'Birthday'
  | 'Wedding'
  | 'Engagement'
  | 'Anniversary'
  | 'Garba'
  | 'School / College Event'
  | 'Corporate Event'
  | 'House Party'
  | 'Baby Shower'
  | 'Other';

export type Priority =
  | 'Balanced'
  | 'Food'
  | 'Venue'
  | 'Decoration'
  | 'DJ / Music'
  | 'Photography';

export type CategoryKey =
  | 'food'
  | 'venue'
  | 'decoration'
  | 'dj'
  | 'photography'
  | 'misc'
  | 'buffer';

export interface CategoryInfo {
  key: CategoryKey;
  name: string;
  iconName: string;
  color: string;
  description: string;
}

export type CategoryAllocations = Record<CategoryKey, number>;

export interface FoodItem {
  id: string;
  name: string;
  category: 'starters' | 'main_course' | 'live_counters' | 'desserts' | 'drinks';
  priceMin: number;
  priceMax: number;
  defaultPrice: number;
  unit: 'person' | 'item' | 'plate' | 'package';
  selected?: boolean;
  isVegetarian?: boolean;
}

export interface FoodPackage {
  id: string;
  name: string;
  pricePerPerson: number;
  description: string;
  popular?: boolean;
  itemIds: string[];
}

export interface DecorTheme {
  id: string;
  name: string;
  icon: string;
  description: string;
  suggestedItemIds: string[];
}

export interface DecorItem {
  id: string;
  name: string;
  tier: 'basic' | 'premium';
  priceMin: number;
  priceMax: number;
  defaultPrice: number;
  unit: string;
  selected?: boolean;
  quantity?: number;
}

export interface EntertainmentItem {
  id: string;
  name: string;
  priceMin: number;
  priceMax: number;
  defaultPrice: number;
  type: 'dj' | 'live' | 'performer' | 'sfx';
  selected?: boolean;
  isAdditional?: boolean;
}

export interface PhotographyItem {
  id: string;
  name: string;
  priceMin: number;
  priceMax: number;
  defaultPrice: number;
  deliverables: string;
  selected?: boolean;
}

export interface VenueType {
  id: string;
  name: string;
  priceMin: number;
  priceMax: number;
  defaultPrice: number;
  capacity: string;
  description: string;
  isFoodBasedPricing?: boolean;
}

export interface VenueAddon {
  id: string;
  name: string;
  priceMin: number;
  priceMax: number;
  defaultPrice: number;
  selected?: boolean;
}

export interface MiscItem {
  id: string;
  name: string;
  price: number;
  isCustom?: boolean;
  selected?: boolean;
}

export type VendorCategory =
  | 'ALL'
  | 'DJ'
  | 'CATERING'
  | 'EVENT MANAGEMENT'
  | 'DECORATION'
  | 'PHOTOGRAPHY'
  | 'VENUE';

export interface Vendor {
  id: string;
  name: string;
  category: 'DJ' | 'CATERING' | 'EVENT MANAGEMENT' | 'DECORATION' | 'PHOTOGRAPHY' | 'VENUE';
  categoryKey: CategoryKey;
  area: string;
  city: string;
  phone: string;
  whatsapp: string;
  description: string;
  tags: string[];
  verified?: boolean;
  rating?: number;
}

export interface VendorQuote {
  id: string;
  vendorId?: string;
  vendorName: string;
  categoryKey: CategoryKey;
  categoryName: string;
  quotedAmount: number;
  notes?: string;
  date: string;
  applied: boolean;
}

export interface HealthScoreBreakdown {
  overallScore: number;
  status: 'Healthy' | 'Tight' | 'High Risk';
  statusColor: string;
  budgetControl: number;
  emergencyBuffer: number;
  foodPlanning: number;
  priorityProtection: number;
  flexibility: number;
  explanations: string[];
  recommendations: string[];
}

export interface EventState {
  id: string;
  title: string;
  eventType: EventType;
  totalBudget: number;
  guestCount: number;
  city: string;
  eventDate: string;
  priority: Priority;
  
  allocations: CategoryAllocations;
  
  // Custom manual allocations override flag
  isCustomAllocation?: boolean;

  // Selected items & configurations
  selectedFoodItems: Record<string, boolean>; // itemId -> boolean
  customFoodPrices: Record<string, number>;    // itemId -> price
  selectedFoodPackageId?: string;

  selectedThemeId: string;
  selectedDecorItems: Record<string, boolean>;
  customDecorPrices: Record<string, number>;

  selectedEntertainment: Record<string, boolean>;
  customEntertainmentPrices: Record<string, number>;

  selectedPhotography: Record<string, boolean>;
  customPhotographyPrices: Record<string, number>;

  selectedVenueId: string;
  customVenuePrice?: number;
  selectedVenueAddons: Record<string, boolean>;
  customVenueAddonPrices: Record<string, number>;

  miscItems: MiscItem[];

  // Real vendor quotes
  quotes: VendorQuote[];
  appliedQuoteIds: Record<CategoryKey, string | undefined>; // categoryKey -> quoteId

  savedAt?: string;
}
