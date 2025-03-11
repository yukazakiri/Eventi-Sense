import React from 'react';

type CardProps = {
  SupplierName: string;
  CompanyName: string;
  Services: string;
  image: string;
  rating: number; // Rating out of 5
  Location: string;
};

const Card: React.FC<CardProps> = ({ SupplierName, CompanyName, Services, image, rating, Location }) => {
  return (
    <div className="relative group border border-gray-400/20 overflow-hidden cursor-pointer w-full">
      <span
        className="absolute inset-0 bg-gradient-to-r from-navy-blue-5 to-navy-blue-5 
                                      transform -translate-y-full group-hover:translate-y-0 
                                      transition-transform duration-500 ease-in-out z-0"
      />

      <div className="relative z-10 h-[300px]">
        <img
          className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110 ease-in-out"
          src={image}
          alt={SupplierName}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 transform group-hover:scale-110 group-hover:opacity-100 transition-opacity duration-300 ease-in-out ">
          <span className="text-white text-lg font-sofia tracking-wide">View Details</span>
        </div>
      </div>

      <div className="px-4 py-6 relative z-10">
        <div>
          <div className="flex flex-wrap gap-x-4 text-[1rem] mb-2 font-sofia tracking-wide">
            <h1 className="text-gray-500 group-hover:text-white transition-colors duration-300">{SupplierName},</h1>
            <h1 className="font-semibold text-white uppercase gradient-text ">{CompanyName}</h1>
            <h1 className="text-gray-500 group-hover:text-white transition-colors duration-300">{Location}</h1>
          </div>
        </div>

        <p className="text-gray-500 font-sofia tracking-wide text-sm group-hover:text-white transition-colors duration-300">{Services}</p>

        <div className="flex items-center mt-2">
          {Array.from({ length: 5 }, (_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              fill={i < rating ? "gold" : "gray"}
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              />
            </svg>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Card;