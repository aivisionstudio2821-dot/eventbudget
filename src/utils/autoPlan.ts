import { CategoryAllocations, EventType, Priority } from '../types';

import {
  FOOD_ITEMS,
  FOOD_PACKAGES,
  DECOR_THEMES,
  DECOR_ITEMS,
  ENTERTAINMENT_ITEMS,
  PHOTOGRAPHY_ITEMS,
  VENUE_TYPES,
  VENUE_ADDONS,
} from '../data/initialData';

interface AutoPlanInput {
  eventType: EventType;
  guestCount: number;
  priority: Priority;
  allocations: CategoryAllocations;
}

/*
 * EventBudget Smart Auto Planner
 *
 * Converts category allocations into a realistic recommended event plan.
 * It never intentionally spends more than the allocated category budget.
 */

export const autoSelectEventPlan = ({
  eventType,
  guestCount,
  priority,
  allocations,
}: AutoPlanInput) => {

  /* =====================================================
     FOOD
     ===================================================== */

  const selectedFoodItems: Record<string, boolean> = {};
  const customFoodPrices: Record<string, number> = {};

  let selectedFoodPackageId: string | undefined;

  const affordablePackages = [...FOOD_PACKAGES]
    .filter(
      (pkg) =>
        pkg.pricePerPerson * guestCount <= allocations.food
    )
    .sort(
      (a, b) =>
        b.pricePerPerson - a.pricePerPerson
    );

  const selectedPackage = affordablePackages[0];

  if (selectedPackage) {
    selectedFoodPackageId = selectedPackage.id;

    selectedPackage.itemIds.forEach((id) => {
      const item = FOOD_ITEMS.find(
        (foodItem) => foodItem.id === id
      );

      if (item) {
        selectedFoodItems[id] = true;
        customFoodPrices[id] = item.defaultPrice;
      }
    });
  } else {
    /*
     * If no complete package fits,
     * build a basic affordable menu manually.
     */

    const perPersonBudget =
      guestCount > 0
        ? allocations.food / guestCount
        : 0;

    const wantedCategories = [
      'main_course',
      'starters',
      'drinks',
      'desserts',
    ];

    let runningPrice = 0;

    wantedCategories.forEach((category) => {
      const options = FOOD_ITEMS
        .filter((item) => item.category === category)
        .sort(
          (a, b) =>
            a.defaultPrice - b.defaultPrice
        );

      const item = options.find(
        (option) =>
          runningPrice + option.defaultPrice <=
          perPersonBudget
      );

      if (item) {
        selectedFoodItems[item.id] = true;
        customFoodPrices[item.id] =
          item.defaultPrice;

        runningPrice += item.defaultPrice;
      }
    });
  }


  /* =====================================================
     DECOR THEME
     ===================================================== */

  const themeMap: Partial<
    Record<EventType, string>
  > = {
    Birthday: 'theme_birthday',
    Wedding: 'theme_royal',
    Engagement: 'theme_floral',
    Anniversary: 'theme_pastel',
    Garba: 'theme_garba',
    'School / College Event': 'theme_bollywood',
    'Corporate Event': 'theme_corporate',
    'House Party': 'theme_minimal',
    'Baby Shower': 'theme_pastel',
    Other: 'theme_custom',
  };

  let selectedThemeId =
    themeMap[eventType] || 'theme_minimal';

  const selectedTheme =
    DECOR_THEMES.find(
      (theme) => theme.id === selectedThemeId
    ) || DECOR_THEMES[0];

  selectedThemeId = selectedTheme.id;


  /* =====================================================
     DECOR ITEMS
     ===================================================== */

  const selectedDecorItems: Record<string, boolean> = {};
  const customDecorPrices: Record<string, number> = {};

  let decorSpent = 0;

  selectedTheme.suggestedItemIds.forEach((id) => {
    const item = DECOR_ITEMS.find(
      (decorItem) => decorItem.id === id
    );

    if (
      item &&
      decorSpent + item.defaultPrice <=
        allocations.decoration
    ) {
      selectedDecorItems[item.id] = true;
      customDecorPrices[item.id] =
        item.defaultPrice;

      decorSpent += item.defaultPrice;
    }
  });


  /* =====================================================
     ENTERTAINMENT / DJ
     ===================================================== */

  const selectedEntertainment: Record<
    string,
    boolean
  > = {};

  const customEntertainmentPrices: Record<
    string,
    number
  > = {};

  const mainEntertainment =
    [...ENTERTAINMENT_ITEMS]
      .filter(
        (item) =>
          !item.isAdditional &&
          item.defaultPrice <= allocations.dj
      )
      .sort(
        (a, b) =>
          b.defaultPrice - a.defaultPrice
      )[0];

  let entertainmentSpent = 0;

  if (mainEntertainment) {
    selectedEntertainment[
      mainEntertainment.id
    ] = true;

    customEntertainmentPrices[
      mainEntertainment.id
    ] = mainEntertainment.defaultPrice;

    entertainmentSpent =
      mainEntertainment.defaultPrice;
  }

  /*
   * Add useful extras if money remains.
   */

  const entertainmentExtras =
    [...ENTERTAINMENT_ITEMS]
      .filter((item) => item.isAdditional)
      .sort(
        (a, b) =>
          a.defaultPrice - b.defaultPrice
      );

  entertainmentExtras.forEach((item) => {
    if (
      entertainmentSpent +
        item.defaultPrice <=
      allocations.dj
    ) {
      selectedEntertainment[item.id] = true;

      customEntertainmentPrices[item.id] =
        item.defaultPrice;

      entertainmentSpent +=
        item.defaultPrice;
    }
  });


  /* =====================================================
     PHOTOGRAPHY
     ===================================================== */

  const selectedPhotography: Record<
    string,
    boolean
  > = {};

  const customPhotographyPrices: Record<
    string,
    number
  > = {};

  const photographyOption =
    [...PHOTOGRAPHY_ITEMS]
      .filter(
        (item) =>
          item.defaultPrice <=
          allocations.photography
      )
      .sort(
        (a, b) =>
          b.defaultPrice - a.defaultPrice
      )[0];

  if (photographyOption) {
    selectedPhotography[
      photographyOption.id
    ] = true;

    customPhotographyPrices[
      photographyOption.id
    ] = photographyOption.defaultPrice;
  }


  /* =====================================================
     VENUE
     ===================================================== */

  let venueCandidates =
    [...VENUE_TYPES].filter(
      (venue) =>
        venue.defaultPrice <= allocations.venue
    );

  /*
   * Prefer sensible venue types based on guest count.
   */

  if (guestCount > 200) {
    const largeVenueIds = [
      'venue_banquet_hall',
      'venue_farm_plot',
      'venue_hotel_ballroom',
    ];

    const largeVenues =
      venueCandidates.filter((venue) =>
        largeVenueIds.includes(venue.id)
      );

    if (largeVenues.length > 0) {
      venueCandidates = largeVenues;
    }
  }

  if (
    eventType === 'House Party' &&
    guestCount <= 120
  ) {
    const houseVenue =
      venueCandidates.find(
        (venue) =>
          venue.id === 'venue_society_hall'
      ) ||
      venueCandidates.find(
        (venue) =>
          venue.id === 'venue_home'
      );

    if (houseVenue) {
      venueCandidates = [houseVenue];
    }
  }

  const selectedVenue =
    venueCandidates.sort(
      (a, b) =>
        b.defaultPrice - a.defaultPrice
    )[0] ||
    VENUE_TYPES.find(
      (venue) => venue.id === 'venue_home'
    ) ||
    VENUE_TYPES[0];

  const selectedVenueId =
    selectedVenue.id;

  const customVenuePrice =
    selectedVenue.defaultPrice;


  /* =====================================================
     VENUE ADD-ONS
     ===================================================== */

  const selectedVenueAddons: Record<
    string,
    boolean
  > = {};

  const customVenueAddonPrices: Record<
    string,
    number
  > = {};

  let venueSpent =
    selectedVenue.defaultPrice;

  const preferredAddons = [
    'addon_cleaning',
    'addon_parking',
    'addon_ac',
    'addon_stage',
    'addon_generator',
    'addon_security',
  ];

  preferredAddons.forEach((id) => {
    const addon =
      VENUE_ADDONS.find(
        (venueAddon) =>
          venueAddon.id === id
      );

    if (
      addon &&
      venueSpent + addon.defaultPrice <=
        allocations.venue
    ) {
      selectedVenueAddons[id] = true;

      customVenueAddonPrices[id] =
        addon.defaultPrice;

      venueSpent += addon.defaultPrice;
    }
  });


  /* =====================================================
     PRIORITY BOOST

     Priority affects allocations already.
     This planner therefore protects that category
     rather than forcing artificial extra spending.
     ===================================================== */

  void priority;


  /* =====================================================
     RETURN COMPLETE AUTO PLAN
     ===================================================== */

  return {
    selectedFoodItems,
    customFoodPrices,
    selectedFoodPackageId,

    selectedThemeId,
    selectedDecorItems,
    customDecorPrices,

    selectedEntertainment,
    customEntertainmentPrices,

    selectedPhotography,
    customPhotographyPrices,

    selectedVenueId,
    customVenuePrice,
    selectedVenueAddons,
    customVenueAddonPrices,
  };
};