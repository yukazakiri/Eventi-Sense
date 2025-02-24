import React, { useState, useEffect } from 'react';
import Card from './cardDesign';
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
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: suppliersData, error: suppliersError } = await supabase
          .from('supplier')
          .select('*')
        console.log('id', suppliersData);

        if (suppliersError) {
          throw new Error(suppliersError.message);
        }

        const companyProfiles = await supabase
        .from('company_profiles')
        .select('*')
        .in('id', suppliersData.map(supplier => supplier.company_id));
      
      const suppliersWithCompanyProfiles = suppliersData.map(supplier => ({
        supplier,
        companyProfile: companyProfiles.data?.find(companyProfile => companyProfile.id === supplier.company_id),
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
  const handleCardClick = (supplierId: string) => { // Change to string
    console.log("Clicked supplier ID:", supplierId);
    navigate(`/supplier/${supplierId}`); // Keep as string
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
        console.log('ids',supplier.id)
        return (
          <div key={index} onClick={() => handleCardClick(supplier.id ?? '')}>
            <Card
              SupplierName={supplier.name}
              Services={supplier.address_city}
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
