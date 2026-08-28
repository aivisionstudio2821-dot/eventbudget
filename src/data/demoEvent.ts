import { EventState } from '../types';
import { calculateSmartAllocations } from '../utils/budgetCalculations';

export function createDemoEvent(): EventState {
  // Generate a date 30 days from now in YYYY-MM-DD
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 30);
  const eventDate = futureDate.toISOString().split('T')[0];

  const totalBudget = 50000;
  const guestCount = 50;
  const allocations = calculateSmartAllocations('Birthday', totalBudget, guestCount, 'Food');

  // Fine-tuned allocations matching the demo showcase
  // Food ₹22,000, Venue ₹6,000, Decor ₹7,000, DJ ₹6,000, Photo ₹5,000, Misc ₹2,000, Buffer ₹2,000
  const demoAllocations = {
    food: 22000,
    venue: 6000,
    decoration: 7000,
    dj: 6000,
    photography: 5000,
    misc: 2000,
    buffer: 2000,
  };

  return {
    id: 'demo_birthday_50k',
    title: '50th Grand Birthday Celebration in Ahmedabad',
    eventType: 'Birthday',
    totalBudget,
    guestCount,
    city: 'Ahmedabad',
    eventDate,
    priority: 'Food',
    allocations: demoAllocations,
    isCustomAllocation: true,

    // Food selections: Starter (Paneer Tikka) + Punjabi Meal + Soft Drinks + Ice Cream = ₹440/person * 50 = ₹22,000
    selectedFoodItems: {
      starter_paneer_tikka: true,
      main_punjabi: true,
      drink_soft_drinks: true,
      dessert_ice_cream: true,
    },
    customFoodPrices: {
      starter_paneer_tikka: 100,
      main_punjabi: 250,
      drink_soft_drinks: 40,
      dessert_ice_cream: 50,
    },
    selectedFoodPackageId: 'pkg_standard',

    // Decor: Balloon + Simple Backdrop + Welcome Board = 2500 + 3500 + 1000 = ₹7,000
    selectedThemeId: 'theme_birthday',
    selectedDecorItems: {
      decor_balloon: true,
      decor_backdrop: true,
      decor_welcome_board: true,
    },
    customDecorPrices: {
      decor_balloon: 2500,
      decor_backdrop: 3500,
      decor_welcome_board: 1000,
    },

    // DJ: Basic DJ = ₹6,000
    selectedEntertainment: {
      ent_basic_dj: true,
    },
    customEntertainmentPrices: {
      ent_basic_dj: 6000,
    },

    // Photography: Basic Photographer = ₹5,000
    selectedPhotography: {
      photo_basic: true,
    },
    customPhotographyPrices: {
      photo_basic: 5000,
    },

    // Venue: Society Hall ₹5,000 + Cleaning addon ₹1,000 = ₹6,000
    selectedVenueId: 'venue_society_hall',
    customVenuePrice: 5000,
    selectedVenueAddons: {
      addon_cleaning: true,
    },
    customVenueAddonPrices: {
      addon_cleaning: 1000,
    },

    // Misc: Designer Cake = ₹2,000
    miscItems: [
      { id: 'misc_cake', name: 'Designer Fondant Birthday Cake (2 Kg)', price: 2000, selected: true },
      { id: 'misc_invitations', name: 'Digital Video Invitations & WhatsApp RSVP', price: 0, selected: false },
    ],

    // Quotes for comparison
    quotes: [
      {
        id: 'quote_dj_prans_1',
        vendorId: 'vendor_dj_prans',
        vendorName: 'DJ PRANS',
        categoryKey: 'dj',
        categoryName: 'DJ & Entertainment',
        quotedAmount: 5500,
        notes: 'Includes 2 top speakers, console and DJ playlist for 4 hours.',
        date: new Date().toISOString().split('T')[0],
        applied: false,
      },
      {
        id: 'quote_vinayak_catering_1',
        vendorId: 'vendor_vinayak_caterers',
        vendorName: 'Vinayak Caterers',
        categoryKey: 'food',
        categoryName: 'Food & Catering',
        quotedAmount: 21500,
        notes: '₹430/plate inclusive of live service boys, cutlery and warmers.',
        date: new Date().toISOString().split('T')[0],
        applied: false,
      }
    ],
    appliedQuoteIds: {
      food: undefined,
      venue: undefined,
      decoration: undefined,
      dj: undefined,
      photography: undefined,
      misc: undefined,
      buffer: undefined,
    },
    savedAt: new Date().toISOString(),
  };
}
