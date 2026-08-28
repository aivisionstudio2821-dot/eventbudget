import {
  CategoryInfo,
  FoodItem,
  FoodPackage,
  DecorTheme,
  DecorItem,
  EntertainmentItem,
  PhotographyItem,
  VenueType,
  VenueAddon,
  MiscItem
} from '../types';

export const CATEGORIES_INFO: CategoryInfo[] = [
  { key: 'food', name: 'Food & Catering', iconName: 'Utensils', color: '#f59e0b', description: 'Starters, main course, live counters & drinks' },
  { key: 'venue', name: 'Venue & Spaces', iconName: 'Building', color: '#3b82f6', description: 'Halls, lawns, plots & facility amenities' },
  { key: 'decoration', name: 'Decoration & Theme', iconName: 'Sparkles', color: '#ec4899', description: 'Backdrops, floral, lighting & aesthetic setups' },
  { key: 'dj', name: 'DJ & Entertainment', iconName: 'Music', color: '#a855f7', description: 'Sound systems, DJ, dhol, singers & live performers' },
  { key: 'photography', name: 'Photography & Film', iconName: 'Camera', color: '#06b6d4', description: 'Candid, traditional, drone & cinematic reels' },
  { key: 'misc', name: 'Misc & Essentials', iconName: 'Gift', color: '#10b981', description: 'Cake, staff, permissions, gifts & logistics' },
  { key: 'buffer', name: 'Emergency Buffer', iconName: 'ShieldAlert', color: '#6366f1', description: 'Safety net for unexpected on-day expenses' },
];

export const FOOD_ITEMS: FoodItem[] = [
  // STARTERS
  { id: 'starter_manchurian', name: 'Veg Manchurian', category: 'starters', priceMin: 40, priceMax: 70, defaultPrice: 55, unit: 'person', isVegetarian: true },
  { id: 'starter_paneer_tikka', name: 'Paneer Tikka', category: 'starters', priceMin: 80, priceMax: 140, defaultPrice: 100, unit: 'person', isVegetarian: true },
  { id: 'starter_french_fries', name: 'French Fries', category: 'starters', priceMin: 40, priceMax: 70, defaultPrice: 50, unit: 'person', isVegetarian: true },
  { id: 'starter_spring_rolls', name: 'Spring Rolls', category: 'starters', priceMin: 50, priceMax: 90, defaultPrice: 70, unit: 'person', isVegetarian: true },
  { id: 'starter_hara_bhara', name: 'Hara Bhara Kebab', category: 'starters', priceMin: 60, priceMax: 100, defaultPrice: 80, unit: 'person', isVegetarian: true },
  { id: 'starter_cheese_balls', name: 'Cheese Balls', category: 'starters', priceMin: 70, priceMax: 120, defaultPrice: 95, unit: 'person', isVegetarian: true },

  // MAIN COURSE
  { id: 'main_gujarati', name: 'Gujarati Thali / Meal', category: 'main_course', priceMin: 150, priceMax: 250, defaultPrice: 200, unit: 'person', isVegetarian: true },
  { id: 'main_punjabi', name: 'Punjabi Meal (Paneer, Dal Makhani, Naan, Rice)', category: 'main_course', priceMin: 180, priceMax: 300, defaultPrice: 250, unit: 'person', isVegetarian: true },
  { id: 'main_north_indian_buffet', name: 'North Indian Grand Buffet', category: 'main_course', priceMin: 250, priceMax: 450, defaultPrice: 350, unit: 'person', isVegetarian: true },
  { id: 'main_chinese', name: 'Chinese Combo Meal (Noodles, Fried Rice, Gravy)', category: 'main_course', priceMin: 180, priceMax: 300, defaultPrice: 230, unit: 'person', isVegetarian: true },
  { id: 'main_pav_bhaji', name: 'Pav Bhaji (Amul Butter)', category: 'main_course', priceMin: 100, priceMax: 180, defaultPrice: 140, unit: 'person', isVegetarian: true },
  { id: 'main_chole_bhature', name: 'Chole Bhature Platter', category: 'main_course', priceMin: 100, priceMax: 180, defaultPrice: 130, unit: 'person', isVegetarian: true },
  { id: 'main_dal_bati', name: 'Rajasthani Dal Bati Churma', category: 'main_course', priceMin: 180, priceMax: 300, defaultPrice: 240, unit: 'person', isVegetarian: true },

  // LIVE COUNTERS
  { id: 'live_pani_puri', name: 'Live Pani Puri / Golgappa Counter', category: 'live_counters', priceMin: 40, priceMax: 80, defaultPrice: 60, unit: 'person', isVegetarian: true },
  { id: 'live_dosa', name: 'Live South Indian Dosa Counter', category: 'live_counters', priceMin: 80, priceMax: 150, defaultPrice: 110, unit: 'person', isVegetarian: true },
  { id: 'live_pasta', name: 'Live Italian Pasta Station (Red / White)', category: 'live_counters', priceMin: 80, priceMax: 150, defaultPrice: 120, unit: 'person', isVegetarian: true },
  { id: 'live_pizza', name: 'Live Woodfire Pizza Counter', category: 'live_counters', priceMin: 100, priceMax: 200, defaultPrice: 150, unit: 'person', isVegetarian: true },
  { id: 'live_chaat', name: 'Live Delhi Chaat & Papdi Counter', category: 'live_counters', priceMin: 60, priceMax: 120, defaultPrice: 90, unit: 'person', isVegetarian: true },
  { id: 'live_sandwich', name: 'Live Grilled Sandwich Counter', category: 'live_counters', priceMin: 60, priceMax: 120, defaultPrice: 85, unit: 'person', isVegetarian: true },

  // DESSERTS
  { id: 'dessert_ice_cream', name: 'Premium Ice Cream (Multiple Flavours)', category: 'desserts', priceMin: 40, priceMax: 80, defaultPrice: 60, unit: 'person', isVegetarian: true },
  { id: 'dessert_gulab_jamun', name: 'Hot Gulab Jamun (2 Pcs)', category: 'desserts', priceMin: 25, priceMax: 50, defaultPrice: 35, unit: 'person', isVegetarian: true },
  { id: 'dessert_brownie_ice_cream', name: 'Sizzling Brownie with Ice Cream', category: 'desserts', priceMin: 80, priceMax: 150, defaultPrice: 110, unit: 'person', isVegetarian: true },
  { id: 'dessert_kulfi', name: 'Matka / Stick Rabdi Kulfi', category: 'desserts', priceMin: 40, priceMax: 80, defaultPrice: 55, unit: 'person', isVegetarian: true },
  { id: 'dessert_jalebi', name: 'Live Hot Jalebi with Fafda / Rabdi', category: 'desserts', priceMin: 30, priceMax: 60, defaultPrice: 45, unit: 'person', isVegetarian: true },

  // DRINKS
  { id: 'drink_soft_drinks', name: 'Chilled Soft Drinks (Coke/Sprite/ThumsUp)', category: 'drinks', priceMin: 30, priceMax: 60, defaultPrice: 40, unit: 'person', isVegetarian: true },
  { id: 'drink_mocktails', name: 'Signature Mocktails (Blue Lagoon, Mojito, Fruit Punch)', category: 'drinks', priceMin: 70, priceMax: 150, defaultPrice: 95, unit: 'person', isVegetarian: true },
  { id: 'drink_fresh_juice', name: 'Fresh Seasonal Fruit Juices', category: 'drinks', priceMin: 40, priceMax: 80, defaultPrice: 60, unit: 'person', isVegetarian: true },
  { id: 'drink_water_bottles', name: 'Packaged Drinking Water Bottles (250ml)', category: 'drinks', priceMin: 10, priceMax: 25, defaultPrice: 15, unit: 'person', isVegetarian: true },
];

export const FOOD_PACKAGES: FoodPackage[] = [
  {
    id: 'pkg_basic',
    name: 'Basic Budget Menu',
    pricePerPerson: 245,
    description: 'Crispy French Fries + Delicious Pav Bhaji + Soft Drinks + Ice Cream',
    popular: false,
    itemIds: ['starter_french_fries', 'main_pav_bhaji', 'drink_soft_drinks', 'dessert_ice_cream']
  },
  {
    id: 'pkg_standard',
    name: 'Standard Celebratory Menu',
    pricePerPerson: 385,
    description: 'Paneer Tikka + Rich Punjabi Meal + Soft Drinks + Hot Gulab Jamun',
    popular: true,
    itemIds: ['starter_paneer_tikka', 'main_punjabi', 'drink_soft_drinks', 'dessert_gulab_jamun']
  },
  {
    id: 'pkg_premium',
    name: 'Grand Royal Banquet Menu',
    pricePerPerson: 650,
    description: '2 Gourmet Starters + Grand North Indian Buffet + Live Pasta Counter + Signature Mocktails + Brownie with Ice Cream',
    popular: false,
    itemIds: ['starter_paneer_tikka', 'starter_cheese_balls', 'main_north_indian_buffet', 'live_pasta', 'drink_mocktails', 'dessert_brownie_ice_cream']
  }
];

export const DECOR_THEMES: DecorTheme[] = [
  { id: 'theme_birthday', name: 'Birthday Bash Theme', icon: '🎂', description: 'Vibrant balloons, custom name backdrop, welcoming selfie corner & LED lights', suggestedItemIds: ['decor_balloon', 'decor_backdrop', 'decor_welcome_board', 'decor_neon_sign'] },
  { id: 'theme_minimal', name: 'Minimal Elegant', icon: '✨', description: 'Clean lines, subtle ambient warm lighting, pastel drapes & sleek geometric arch', suggestedItemIds: ['decor_backdrop', 'decor_table', 'decor_welcome_board'] },
  { id: 'theme_floral', name: 'Floral Bloom Extravaganza', icon: '🌸', description: 'Fresh exotic floral arches, fragrant pathways, floral stage backdrop & photo wall', suggestedItemIds: ['decor_floral', 'decor_entrance', 'decor_photo_booth', 'decor_table'] },
  { id: 'theme_royal', name: 'Royal Heritage & Gold', icon: '👑', description: 'Majestic velvet drapes, royal brass props, grand chandelier lighting & palatial stage', suggestedItemIds: ['decor_premium_stage', 'decor_entrance', 'decor_ceiling', 'decor_floral'] },
  { id: 'theme_bollywood', name: 'Bollywood Retro Night', icon: '🎬', description: 'Glitz, neon signboards, cinema posters, disco spheres & dramatic lighting', suggestedItemIds: ['decor_theme_backdrop', 'decor_neon_sign', 'decor_photo_booth', 'decor_stage_basic'] },
  { id: 'theme_garba', name: 'Garba / Gujarati Cultural', icon: '🪘', description: 'Traditional Kutch mirrors, colorful umbrellas, earthen pots, marigold garlands & dandiya setup', suggestedItemIds: ['decor_theme_backdrop', 'decor_entrance', 'decor_floral', 'decor_stage_basic'] },
  { id: 'theme_kids', name: 'Kids Fun Wonderland', icon: '🎈', description: 'Cartoon cutouts, balloon arches, candy stall setup & interactive play backdrop', suggestedItemIds: ['decor_balloon', 'decor_theme_backdrop', 'decor_welcome_board', 'decor_photo_booth'] },
  { id: 'theme_corporate', name: 'Modern Corporate / Formal', icon: '💼', description: 'Branded backdrop, sleek stage podium, LED corporate lighting & executive table settings', suggestedItemIds: ['decor_stage_basic', 'decor_welcome_board', 'decor_table'] },
  { id: 'theme_pastel', name: 'Pastel Dream Aesthetic', icon: '🎨', description: 'Soft lilac, mint and blush tones with delicate macrame and floating lanterns', suggestedItemIds: ['decor_backdrop', 'decor_table', 'decor_neon_sign', 'decor_photo_booth'] },
  { id: 'theme_custom', name: 'Custom Personalized Setup', icon: '🛠️', description: 'Bespoke tailoring according to your exact moodboard and personalized requirements', suggestedItemIds: ['decor_balloon', 'decor_backdrop'] },
];

export const DECOR_ITEMS: DecorItem[] = [
  // BASIC DECOR
  { id: 'decor_balloon', name: 'Balloon Decoration Setup (Arch / Garlands)', tier: 'basic', priceMin: 1500, priceMax: 5000, defaultPrice: 2500, unit: 'setup' },
  { id: 'decor_backdrop', name: 'Simple Aesthetic Backdrop & Drapes', tier: 'basic', priceMin: 2000, priceMax: 6000, defaultPrice: 3500, unit: 'setup' },
  { id: 'decor_welcome_board', name: 'Welcome Board with Easel Stand', tier: 'basic', priceMin: 500, priceMax: 1500, defaultPrice: 1000, unit: 'piece' },
  { id: 'decor_table', name: 'Guest & Buffet Table Centerpieces & Runners', tier: 'basic', priceMin: 500, priceMax: 2000, defaultPrice: 1200, unit: 'setup' },
  { id: 'decor_stage_basic', name: 'Basic Stage Decoration & Lighting', tier: 'basic', priceMin: 2000, priceMax: 6000, defaultPrice: 4000, unit: 'setup' },

  // PREMIUM DECOR
  { id: 'decor_theme_backdrop', name: 'Custom 3D Theme Backdrop with Props', tier: 'premium', priceMin: 5000, priceMax: 15000, defaultPrice: 8500, unit: 'setup' },
  { id: 'decor_floral', name: 'Fresh Exotic Floral Decoration Setup', tier: 'premium', priceMin: 8000, priceMax: 30000, defaultPrice: 15000, unit: 'setup' },
  { id: 'decor_neon_sign', name: 'LED Name / Custom Neon Signboard', tier: 'premium', priceMin: 1500, priceMax: 5000, defaultPrice: 3000, unit: 'piece' },
  { id: 'decor_entrance', name: 'Grand Entrance Arch & Pathway Lighting', tier: 'premium', priceMin: 3000, priceMax: 10000, defaultPrice: 6000, unit: 'setup' },
  { id: 'decor_ceiling', name: 'Fairytale Ceiling Drapes & Fairy Lights', tier: 'premium', priceMin: 5000, priceMax: 20000, defaultPrice: 10000, unit: 'setup' },
  { id: 'decor_photo_booth', name: 'Designer Photo Booth Corner with Props', tier: 'premium', priceMin: 3000, priceMax: 10000, defaultPrice: 5500, unit: 'setup' },
  { id: 'decor_premium_stage', name: 'Grand Royal Stage Decor with Floral Arch', tier: 'premium', priceMin: 8000, priceMax: 30000, defaultPrice: 18000, unit: 'setup' },
];

export const ENTERTAINMENT_ITEMS: EntertainmentItem[] = [
  { id: 'ent_basic_dj', name: 'Basic DJ (Console + 2 Speakers)', priceMin: 4000, priceMax: 8000, defaultPrice: 6000, type: 'dj' },
  { id: 'ent_dj_std_sound', name: 'DJ + Standard Sound System (4 Speakers + Subwoofer)', priceMin: 7000, priceMax: 15000, defaultPrice: 10000, type: 'dj' },
  { id: 'ent_dj_premium_sound', name: 'DJ + Premium Line-Array Concert Sound', priceMin: 12000, priceMax: 25000, defaultPrice: 18000, type: 'dj' },
  { id: 'ent_dj_lights', name: 'Intelligent Club Lights & Moving Heads Setup', priceMin: 3000, priceMax: 10000, defaultPrice: 5000, type: 'dj', isAdditional: true },
  { id: 'ent_dhol', name: 'Live Punjabi / Gujarati Dhol Players (2 Artists)', priceMin: 2000, priceMax: 6000, defaultPrice: 3500, type: 'live', isAdditional: true },
  { id: 'ent_live_singer', name: 'Live Acoustic Singer / Band Performance', priceMin: 8000, priceMax: 30000, defaultPrice: 16000, type: 'live', isAdditional: true },
  { id: 'ent_anchor_emcee', name: 'Professional Anchor / Emcee (Games & Hosting)', priceMin: 5000, priceMax: 20000, defaultPrice: 9000, type: 'performer', isAdditional: true },
  { id: 'ent_led_wall', name: 'P3 High-Definition LED Backdrop Wall (8x12 ft)', priceMin: 8000, priceMax: 30000, defaultPrice: 15000, type: 'sfx', isAdditional: true },
  { id: 'ent_cold_pyro', name: 'Cold Pyro Sparklers, Fog Machine & Co2 Jets', priceMin: 3000, priceMax: 15000, defaultPrice: 6000, type: 'sfx', isAdditional: true },
];

export const PHOTOGRAPHY_ITEMS: PhotographyItem[] = [
  { id: 'photo_basic', name: 'Basic Event Photography (1 Photographer)', priceMin: 4000, priceMax: 10000, defaultPrice: 6000, deliverables: 'All edited high-res digital photos (150+ shots)' },
  { id: 'photo_video_combo', name: 'Photography + Traditional Videography', priceMin: 8000, priceMax: 20000, defaultPrice: 14000, deliverables: 'Edited photos + 30-min full event video highlight' },
  { id: 'photo_candid', name: 'Premium Candid Photography Specialist', priceMin: 8000, priceMax: 25000, defaultPrice: 15000, deliverables: 'Cinematic candid portraits, mood shots & color grading' },
  { id: 'photo_traditional', name: 'Traditional Family & Stage Photography', priceMin: 5000, priceMax: 15000, defaultPrice: 8000, deliverables: 'Coverage of all guests, rituals and group portraits' },
  { id: 'photo_reels', name: 'Trendy Reels & Viral Short Videos Creator', priceMin: 3000, priceMax: 10000, defaultPrice: 5000, deliverables: '3-5 ready-to-post vertical Instagram reels delivered in 24h' },
  { id: 'photo_drone', name: '4K Drone Aerial Cinematic Coverage', priceMin: 5000, priceMax: 15000, defaultPrice: 8000, deliverables: 'Aerial 4K landscape and outdoor celebration clips' },
  { id: 'photo_instant_booth', name: 'Instant 360° Video Booth or Instant Print Photo Booth', priceMin: 5000, priceMax: 15000, defaultPrice: 9000, deliverables: 'Unlimited on-the-spot guest prints with custom branding' },
  { id: 'photo_full_pkg', name: 'Grand Full Event Cinematic Package (Complete Crew)', priceMin: 15000, priceMax: 50000, defaultPrice: 28000, deliverables: '2 Photographers + 1 Cinematographer + Drone + Teaser + Album' },
];

export const VENUE_TYPES: VenueType[] = [
  { id: 'venue_home', name: 'Home / Terrace / Private Backyard', priceMin: 0, priceMax: 0, defaultPrice: 0, capacity: 'Up to 40 Guests', description: 'Zero venue rental. Perfect for intimate family celebrations and house parties.' },
  { id: 'venue_society_hall', name: 'Residential Society Clubhouse / Community Hall', priceMin: 2000, priceMax: 10000, defaultPrice: 5000, capacity: '40–120 Guests', description: 'Budget-friendly community space with basic amenities, parking and seating.' },
  { id: 'venue_party_hall', name: 'Standalone AC Party Hall', priceMin: 8000, priceMax: 30000, defaultPrice: 15000, capacity: '50–200 Guests', description: 'Dedicated event venue with air conditioning, stage lighting and sound insulation.' },
  { id: 'venue_banquet_hall', name: 'Premium Banquet Hall', priceMin: 15000, priceMax: 100000, defaultPrice: 40000, capacity: '100–500 Guests', description: 'Luxurious ambience, high ceilings, bridal dressing rooms and dedicated staff.' },
  { id: 'venue_restaurant', name: 'Restaurant Private Dining / Rooftop Section', priceMin: 5000, priceMax: 25000, defaultPrice: 10000, capacity: '30–100 Guests', description: 'Often low hall rental with minimum food billing commitment.', isFoodBasedPricing: true },
  { id: 'venue_farm_plot', name: 'Open Air Farm / Party Plot / Lawn', priceMin: 20000, priceMax: 150000, defaultPrice: 55000, capacity: '200–1500 Guests', description: 'Sprawling lush green lawn under the stars for grand wedding and garba nights.' },
  { id: 'venue_hotel_ballroom', name: '5-Star Luxury Hotel Ballroom', priceMin: 30000, priceMax: 200000, defaultPrice: 85000, capacity: '150–800 Guests', description: 'Top-tier hospitality, valet parking, state-of-the-art acoustics and luxury decor.' },
];

export const VENUE_ADDONS: VenueAddon[] = [
  { id: 'addon_ac', name: 'Full Hall AC Power & Cooling Charge', priceMin: 1500, priceMax: 5000, defaultPrice: 3000 },
  { id: 'addon_parking', name: 'Dedicated Valet & Managed Parking Staff', priceMin: 1000, priceMax: 4000, defaultPrice: 2000 },
  { id: 'addon_stage', name: 'Custom Stage Platform Setup (12x16 ft)', priceMin: 1500, priceMax: 5000, defaultPrice: 2500 },
  { id: 'addon_chairs', name: 'Cushioned Banquet Chairs with Covers (50 Pcs)', priceMin: 1000, priceMax: 3000, defaultPrice: 1800 },
  { id: 'addon_tables', name: 'Round Dining Tables with Silk Linens (10 Pcs)', priceMin: 1000, priceMax: 3500, defaultPrice: 2000 },
  { id: 'addon_generator', name: 'Silent Diesel Generator (DG Power Backup)', priceMin: 2500, priceMax: 7000, defaultPrice: 4000 },
  { id: 'addon_extra_hours', name: 'Extra Hall Rental Hours (After 11 PM)', priceMin: 2000, priceMax: 6000, defaultPrice: 3000 },
  { id: 'addon_cleaning', name: 'Deep Post-Event Waste Disposal & Cleaning', priceMin: 800, priceMax: 2500, defaultPrice: 1500 },
  { id: 'addon_security', name: 'Bouncers / Security Personnel (2 Guards)', priceMin: 1500, priceMax: 4500, defaultPrice: 2500 },
  { id: 'addon_projector', name: 'High-Lumen Projector + Motorized Screen', priceMin: 1500, priceMax: 4000, defaultPrice: 2200 },
];

export const MISC_OPTIONS: MiscItem[] = [
  { id: 'misc_cake', name: 'Designer Fondant Celebration Cake (2-3 Kg)', price: 2200 },
  { id: 'misc_invitations', name: 'Digital Animated Video Invitations + E-Cards', price: 1000 },
  { id: 'misc_return_gifts', name: 'Custom Return Gifts / Favors for Guests', price: 2500 },
  { id: 'misc_transport', name: 'Guest Pickup / Drop Shuttle Van Service', price: 3000 },
  { id: 'misc_security', name: 'Security Bouncers / Event Wardens', price: 2000 },
  { id: 'misc_generator', name: 'Secondary Backup Silent Generator', price: 3500 },
  { id: 'misc_permissions', name: 'Police / Music / Venue Sound Permissions', price: 1500 },
  { id: 'misc_cleaning', name: 'Dedicated Post-Event Sanitation Team', price: 1200 },
  { id: 'misc_staff', name: 'Hospitality Ushers & Service Boys (4 Staff)', price: 2800 },
  { id: 'misc_extra_chairs', name: 'Extra 30 Chairs for Surprise Guests', price: 1000 },
  { id: 'misc_extra_tables', name: 'Extra 5 Buffet Serving Tables', price: 1200 },
  { id: 'misc_water', name: 'Bulk Packaged Water Dispensers & Glasses', price: 800 },
  { id: 'misc_sfx', name: 'Special Celebration Sparkler Cannons & Ribbon Blasters', price: 1500 },
  { id: 'misc_emergency_purchases', name: 'Emergency Instant On-Day Purchases Petty Cash', price: 2000 },
];
