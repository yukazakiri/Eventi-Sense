import React from 'react';
import { useNavigate } from 'react-router-dom';

type CardProps = {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[]; // Add tags to the props
  role: 'supplier' | 'venue_manager' | null; // Add role to the props
};

const Card: React.FC<CardProps> = ({ id, title, description, image, tags, role }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Use role-specific route
    const basePath = role === 'supplier' ? '/Supplier-Dashboard' : '/Venue-Dashboard';
    navigate(`${basePath}/UpdateEvents/${id}`);
  };

  return (
    <div
      className="overflow-hidden h-auto group cursor-pointer w-full hover:bg-navy-blue-5 rounded-xl transition-all duration-300 shadow-2xl"
      onClick={handleClick}
    >
      {/* Image */}
      <div className="overflow-hidden rounded-t-xl">
        <img
          className="w-full h-48 sm:h-56 md:h-64 object-cover transform transition-transform duration-300 group-hover:scale-110"
          src={image}
          alt={title}
        />
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        <h3 className="font-bold text-xl mb-6 gradient-text">
          {title}
        </h3>
        <p className="text-gray-500 text-base">{description}</p>
        {/* Display Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Card;