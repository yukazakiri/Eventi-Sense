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
};

const CardSuppliers: React.FC<CardSuppliersProps> = ({ limit, filters = { searchQuery: '' }, showAll, handleViewLess }) => {
  const { suppliers, loading, error } = useSuppliers(filters);
  const navigate = useNavigate();

  const handleCardClick = (supplierId: string) => {
    navigate(`/supplier/${supplierId}`);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const suppliersPerPage = 9;

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <div>Loading suppliers...</div>;
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