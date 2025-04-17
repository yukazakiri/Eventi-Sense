// CardSuppliers.tsx
import React, { useState } from 'react';
import Card from './cardDesign';
import { useNavigate } from 'react-router-dom';
import useSuppliers, { SupplierWithCompanyProfile } from '../../../hooks/Supplier/useSupplier';
import { SupplierFilters } from '../../../hooks/Supplier/supplierFilter';
import { HoverButton4 } from '../../../components/Button/button-hover';

type CardSuppliersProps = {
  limit?: number;
  filters?: SupplierFilters;
  showAll?: boolean;
  handleViewLess?: () => void;
  loading?: boolean;  // Added loading prop
};

const CardSuppliers: React.FC<CardSuppliersProps> = ({ limit, filters = { searchQuery: '' }, showAll, handleViewLess, loading: externalLoading }) => {
  const { suppliers, loading: internalLoading, error } = useSuppliers(filters);
  const navigate = useNavigate();

  // Use either external or internal loading state
  const isLoading = externalLoading ?? internalLoading;

  const handleCardClick = (supplierId: string) => {
    navigate(`/supplier/${supplierId}`);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const suppliersPerPage = 9;

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(limit || 9)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
            {/* Image skeleton */}
            <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
            
            {/* Supplier name skeleton */}
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            
            {/* Company name skeleton */}
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            
            {/* Services skeleton */}
            <div className="flex gap-2 mb-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-16"></div>
              ))}
            </div>
            
            {/* Location and rating skeleton */}
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (error) return <div>Error: {error.message}</div>;

  let displayedSuppliers: SupplierWithCompanyProfile[] = suppliers;

  if (showAll) {
    const startIndex = (currentPage - 1) * suppliersPerPage;
    const endIndex = startIndex + suppliersPerPage;
    displayedSuppliers = suppliers.slice(startIndex, endIndex);
  } else if (limit) {
    displayedSuppliers = suppliers.slice(0, limit);
  }

  const totalPages = Math.ceil(suppliers.length / suppliersPerPage);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {displayedSuppliers.map(({ supplier, companyProfile, services }, index) => (
        <div key={index} onClick={() => handleCardClick(supplier.id)}>
          <Card
            SupplierName={supplier.name}
            Services={services} // Use the services property here
            CompanyName={companyProfile?.company_name || 'Company Name Not Found'}
            image={supplier.cover_image_url}
            rating={supplier.rating || 0}
            Location={supplier.address_city}
          />
        </div>
      ))}

      {showAll && totalPages > 1 && (
        <div className="mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              disabled={currentPage === pageNumber}
              className={`mx-1 px-3 py-1 rounded ${currentPage === pageNumber ? 'bg-gray-300' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {pageNumber}
            </button>
          ))}
        </div>
      )}

      {showAll && totalPages > 1 && (
        <div className="flex justify-center mt-16">
          <HoverButton4 onClick={handleViewLess}>View less</HoverButton4>
        </div>
      )}
    </div>
  );
};

export default CardSuppliers;