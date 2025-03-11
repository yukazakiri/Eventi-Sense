// src/utils/venueFilters.ts
export type VenueFilters = {
    searchQuery: string;
    price: string;
    capacity: string;
    venueType: string;
  };
  
  export const filterVenues = (venues: any[], filters: VenueFilters) => {
    // Add this at the top of your filterVenues function
console.log("Filtering venues:", venues.length);
console.log("With filters:", filters);
    return venues.filter(venue => {
      // Search filter - check if search query is empty first
      const searchQuery = filters.searchQuery.toLowerCase().trim();
      const matchesSearch = !searchQuery || 
        (venue.name?.toLowerCase().includes(searchQuery) || 
         venue.location?.toLowerCase().includes(searchQuery) ||
         venue.capacity?.toString().includes(searchQuery) ||
         venue.price?.toString().includes(searchQuery));
  
      // Price filter
      let matchesPrice = true;
      if (filters.price) {
        const [minPrice, maxPrice] = filters.price.split('-').map(Number);
        
        // Special case for "10000+" price range
        if (filters.price === "10000+") {
          matchesPrice = venue.price != null && venue.price >= 10000;
        } else {
          // For other price ranges, ensure venue has a price and it's in range
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
        const [minCap, maxCap] = filters.capacity.split('-').map(Number);
        
        // Special case for "300+" capacity
        if (filters.capacity === "300+") {
          matchesCapacity = venue.capacity != null && venue.capacity >= 300;
        } else {
          // For other capacity ranges, ensure venue has capacity and it's in range
          matchesCapacity = 
            venue.capacity != null && 
            !isNaN(venue.capacity) &&
            venue.capacity >= (minCap || 0) && 
            venue.capacity <= (maxCap || Infinity);
        }
      }
  
      // Venue type filter
      const matchesType = !filters.venueType || 
        venue.type === filters.venueType;
  
      return matchesSearch && matchesPrice && matchesCapacity && matchesType;
    });
  };