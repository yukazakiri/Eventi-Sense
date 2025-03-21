// src/utils/eventPlannerFilter.ts
import { EventPlannerWithDetails } from "./useEventPlanners";

// src/utils/eventPlannerFilters.ts
export type EventPlannerFilters = {
    searchQuery: string;
    serviceType?: string;
    location?: string;
    minExperience?: number;
  };
  
  export const filterEventPlanners = (eventPlanners: EventPlannerWithDetails[], filters: EventPlannerFilters) => {
    return eventPlanners.filter(({ planner, services }) => {
      const searchQuery = filters.searchQuery.toLowerCase().trim();
      const matchesSearch =
        !searchQuery ||
        planner.company_name?.toLowerCase().includes(searchQuery) ||
        planner.city?.toLowerCase().includes(searchQuery) ||
        services?.toLowerCase().includes(searchQuery) ||
        planner.bio?.toLowerCase().includes(searchQuery);
  
      const matchesLocation =
        !filters.location ||
        planner.city?.toLowerCase() === filters.location.toLowerCase();
  
      const matchesExperience =
        !filters.minExperience || 
        (planner.experience_years || 0) >= filters.minExperience;
  
      const filterService = filters.serviceType?.toLowerCase();
      const serviceList = (services?.toLowerCase() || '').split(/,\s*/);
      const matchesServiceType =
        !filterService ||
        serviceList.some(service => 
          service.includes(filterService) || 
          filterService.includes(service)
        );
  
      return matchesSearch && matchesLocation && matchesServiceType && matchesExperience;
    });
  };