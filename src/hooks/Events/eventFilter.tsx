// src/utils/eventFilter.ts
import { EventWithDetails } from "./useEvents";

export type EventFilters = {
  searchQuery: string;
  category?: string;
  location?: string;
  minTicketPrice?: number;
  maxTicketPrice?: number;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
};

export const filterEvents = (events: EventWithDetails[], filters: EventFilters) => {
  return events.filter(({ event, tags }) => {
    const searchQuery = filters.searchQuery.toLowerCase().trim();
    const matchesSearch =
    !searchQuery ||
    event.name?.toLowerCase().includes(searchQuery) ||
    event.location?.toLowerCase().includes(searchQuery) ||
    (Array.isArray(tags) ? tags.join(', ').toLowerCase() : String(tags).toLowerCase()).includes(searchQuery) ||
    event.description?.toLowerCase().includes(searchQuery);
  

    const matchesLocation =
      !filters.location ||
      event.location?.toLowerCase() === filters.location.toLowerCase();

    const matchesCategory =
      !filters.category ||
      event.category?.toLowerCase() === filters.category.toLowerCase();

    const matchesTicketPrice =
      (!filters.minTicketPrice || event.ticket_price >= filters.minTicketPrice) &&
      (!filters.maxTicketPrice || event.ticket_price <= filters.maxTicketPrice);

    const matchesDateRange =
      !filters.dateRange ||
      (new Date(event.date) >= new Date(filters.dateRange.startDate) &&
       new Date(event.date) <= new Date(filters.dateRange.endDate));

    return matchesSearch && matchesLocation && matchesCategory && matchesTicketPrice && matchesDateRange;
  });
};