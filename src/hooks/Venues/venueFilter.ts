// src/utils/venueFilters.ts
export type VenueFilters = {
  searchQuery: string;
  price: string;
  capacity: string;
  venueType: string;
};

export const filterVenues = (venues: any[], filters: VenueFilters) => {
  console.log("Filtering venues:", venues.length);
  console.log("With filters:", filters);

  return venues.filter((venue) => {
      // Search filter
      const searchQuery = filters.searchQuery.toLowerCase().trim();
      const matchesSearch =
      !searchQuery ||
      venue.name?.toLowerCase().includes(searchQuery) ||
      venue.location?.toLowerCase().includes(searchQuery) ||
      venue.capacity?.toString().includes(searchQuery) ||
      venue.price?.toString().includes(searchQuery) ||
      // Fixed venue type search
      venue.venues_venue_types?.some((vvt: any) => 
        vvt.venue_types?.name.toLowerCase().includes(searchQuery)
      );
      // Price filter
      let matchesPrice = true;
      if (filters.price) {
          if (filters.price === "10000+") {
              matchesPrice = venue.price != null && venue.price >= 10000;
          } else {
              const [minPrice, maxPrice] = filters.price.split('-').map(Number);
              matchesPrice =
                  venue.price != null &&
                  !isNaN(venue.price) &&
                  venue.price >= (minPrice || 0) &&
                  venue.price <= (maxPrice || Infinity);
          }
      }

      // Capacity filter
      let matchesCapacity = true;
      if (filters.capacity) {
          if (filters.capacity === "300+") {
              matchesCapacity = venue.capacity != null && venue.capacity >= 300;
          } else {
              const [minCap, maxCap] = filters.capacity.split('-').map(Number);
              matchesCapacity =
                  venue.capacity != null &&
                  !isNaN(venue.capacity) &&
                  venue.capacity >= (minCap || 0) &&
                  venue.capacity <= (maxCap || Infinity);
          }
      }

      // Venue type filter
      let matchesVenueType = true;
 // Update the venue type filter
if (filters.venueType) {
  matchesVenueType = venue.venues_venue_types?.some(
      (vvt: any) => vvt.venue_types?.name.toLowerCase() === filters.venueType.toLowerCase()
  ) || false;
}

      return matchesSearch && matchesPrice && matchesCapacity && matchesVenueType;
  });
};