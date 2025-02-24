import React from 'react';

type CardProps = {
  VenueName: string;
  PlaceName: string;
  Guests: string;
  image: string;
  rating: number; // Rating out of 5
};

const Card: React.FC<CardProps> = ({ VenueName, PlaceName, Guests, image, rating }) => {

  return (
    <div className="gradient-background overflow-hidden group cursor-pointer rounded-[20px] w-full group">
      {/* Image */}
      <img
        className="w-full h-[300px] object-cover transform transition-transform duration-300 group-hover:scale-110"
        src={image}
        alt={VenueName}
      />

      {/* Content */}
      <div className="px-4 py-6">
        <div>
          <div className="flex flex-wrap gap-x-4 text-[1rem] mb-2 font-montserrat">
            <h1 className="text-gray-300">{VenueName},</h1>
            <h1 className="font-semibold text-white uppercase gradient-text">{PlaceName}</h1>
          </div>
        </div>

        <p className="text-gray-500 text-base">{Guests}</p>

        {/* Star Rating */}
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