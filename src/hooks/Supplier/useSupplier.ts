// src/api/hooks/useSuppliers.ts
import { useEffect, useState, useRef } from 'react';
import supabase from '../../api/supabaseClient';
import { SupplierFilters, filterSuppliers } from './supplierFilter';

export type SupplierWithCompanyProfile = {
  supplier: any;
  companyProfile: any | null;
  services: string;
};

const useSuppliers = (filters: SupplierFilters) => {
  const [allSuppliers, setAllSuppliers] = useState<SupplierWithCompanyProfile[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<SupplierWithCompanyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const prevFilters = useRef<SupplierFilters>(filters);
  const prevAllSuppliers = useRef<SupplierWithCompanyProfile[]>(allSuppliers);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const { data, error } = await supabase
          .from('supplier')
          .select(`
            *,
            suppliers_services (
              service_name
            ),
            company_profiles (
              *
            )
          `);

        if (error) throw error;

        const formattedData = data?.map((supplier) => ({
          supplier,
          companyProfile: supplier.company_profiles?.[0] || null,
          services: supplier.suppliers_services
            ? supplier.suppliers_services.map((service: any) => service.service_name).join(', ')
            : 'No services listed',
        })) || [];

        setAllSuppliers(formattedData);
        setFilteredSuppliers(filterSuppliers(formattedData, filters));
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (
      JSON.stringify(prevFilters.current) !== JSON.stringify(filters) ||
      JSON.stringify(prevAllSuppliers.current) !== JSON.stringify(allSuppliers)
    ) {
      setFilteredSuppliers(filterSuppliers(allSuppliers, filters));
      prevFilters.current = filters;
      prevAllSuppliers.current = allSuppliers;
    }
  }, [filters, allSuppliers]);

  return { suppliers: filteredSuppliers, loading, error };
};

export default useSuppliers;