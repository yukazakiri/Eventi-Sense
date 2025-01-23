import React from 'react';
import Card from './cardDesign'; // Import the Card component
type CardSuppliersProps = {
  limit?: number; // Optional prop to limit the number of cards
};

const CardSuppliers: React.FC<CardSuppliersProps> = ({ limit }) => {
  const cardData = [
    {
      SupplierName: "John Doe",
      CompanyName: "ABC Suppliers",
      Services: "Event Planning, Catering",
      image:
        "https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      rating: 4, // Rating out of 5
    },
    {
      SupplierName: "Jane Smith",
      CompanyName: "XYZ Suppliers",
      Services: "Decorations, Lighting",
      image:
        "https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      rating: 5,
    },
    {
      SupplierName: "Bob Johnson",
      CompanyName: "DEF Suppliers",
      Services: "Audio Visual, Photography",
      image:
        "https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      rating: 3,
    },
    {
      SupplierName: "Alice Brown",
      CompanyName: "GHI Suppliers",
      Services: "Floral Arrangements",
      image:
        "https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      rating: 4,
    },
    {
      SupplierName: "Charlie Davis",
      CompanyName: "JKL Suppliers",
      Services: "Entertainment, DJ",
      image:
        "https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      rating: 5,
    },
  ];

  // If a limit is provided, slice the cardData array; otherwise, show all cards
  const displayedCardData = limit ? cardData.slice(0, limit) : cardData;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {displayedCardData.map((data, index) => (
        <div key={index}>
          <Card
            SupplierName={data.SupplierName}
            Services={data.Services}
            CompanyName={data.CompanyName}
            image={data.image}
            rating={data.rating} // Pass the rating
          />
        </div>
      ))}
    </div>
  );
};

export default CardSuppliers;