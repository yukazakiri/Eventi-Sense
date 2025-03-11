import React, { useState, useEffect } from 'react';
import Card from './cardListDesignLanding';
import supabase from '../../../api/supabaseClient';
import { CompanyProfile, Supplier } from '../../../types/supplier';
import { useNavigate } from 'react-router-dom';

type CardSuppliersProps = {
  limit?: number;
};

const CardSuppliers: React.FC<CardSuppliersProps> = ({ limit }) => {
  const [cardData, setCardData] = useState<{ supplier: Supplier; companyProfile: CompanyProfile | null }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: suppliersData, error: suppliersError } = await supabase
          .from('supplier')
          .select(`
            *,
            suppliers_services (
              service_name
            )
          `);

        if (suppliersError) {
          throw new Error(suppliersError.message);
        }

        if (!suppliersData || suppliersData.length === 0) {
          setCardData([]);
          setLoading(false);
          return;
        }

        const companyProfilesResult = await supabase
          .from('company_profiles')
          .select('*')
          .in(
            'id',
            suppliersData.map((supplier) => supplier.company_id)
          );

        const companyProfiles = companyProfilesResult.data || [];

        const suppliersWithCompanyProfiles = suppliersData.map((supplier) => ({
          supplier,
          companyProfile: companyProfiles.find((companyProfile) => companyProfile.id === supplier.company_id) || null,
        }));

        setCardData(suppliersWithCompanyProfiles);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCardClick = (supplierId: string) => {
    navigate(`/supplier/${supplierId}`);
  };

  if (loading) {
    return <div>Loading suppliers...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const displayedCardData = limit ? cardData.slice(0, limit) : cardData;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {displayedCardData.map(({ supplier, companyProfile }, index) => {
        const servicesNames = Array.isArray(supplier.suppliers_services)
          ? supplier.suppliers_services.map((service) => service.service_name).join(', ')
          : 'No Services Listed';

        return (
          <div key={index} onClick={() => handleCardClick(supplier.id ?? '')}>
            <Card
              SupplierName={supplier.name}
              Location={supplier.address_city}
              Services={servicesNames}
              CompanyName={companyProfile ? companyProfile.company_name : 'Company Name Not Found'}
              image={supplier.cover_image_url}
              rating={supplier.rating || 0}
            />
          </div>
        );
      })}
    </div>
  );
};

export default CardSuppliers;