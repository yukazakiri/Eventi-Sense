import { SupplierWithCompanyProfile } from "./useSupplier";

// src/utils/supplierFilters.ts
export type SupplierFilters = {
  searchQuery: string;
  serviceType?: string;
  location?: string;
  minRating?: number;
};

export const filterSuppliers = (suppliers: SupplierWithCompanyProfile[], filters: SupplierFilters) => {
  return suppliers.filter(({ supplier, companyProfile, services }) => {
    const searchQuery = filters.searchQuery.toLowerCase().trim();
    const matchesSearch =
      !searchQuery ||
      supplier.name?.toLowerCase().includes(searchQuery) ||
      supplier.address_city?.toLowerCase().includes(searchQuery) ||
      services?.toLowerCase().includes(searchQuery) || // Search in services
      companyProfile?.company_name?.toLowerCase().includes(searchQuery);

    const matchesLocation =
      !filters.location ||
      supplier.address_city?.toLowerCase() === filters.location.toLowerCase();


    const matchesRating =
      !filters.minRating || (supplier.rating || 0) >= filters.minRating;
      const filterService = filters.serviceType?.toLowerCase();
    const serviceList = (services?.toLowerCase() || '').split(/,\s*/); // Split services into array
    const matchesServiceType =
      !filterService ||
      serviceList.some(service => 
        service.includes(filterService) || 
        filterService.includes(service)
      );


    return matchesSearch && matchesLocation && matchesServiceType && matchesRating;
  });
};