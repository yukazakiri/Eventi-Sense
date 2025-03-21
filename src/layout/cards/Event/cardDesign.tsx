import React from 'react';
import { useNavigate } from 'react-router-dom';

type CardProps = {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
};

const Card: React.FC<CardProps> = ({ id, title, description, image, tags }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/events/${id}`);
  };

  return (
    <div
      className="overflow-hidden h-full group cursor-pointer w-full hover:bg-navy-blue-5 rounded-xl transition-all duration-300 shadow-2xl flex flex-col"
      onClick={handleClick}
    >
      {/* Image */}
      <div className="overflow-hidden rounded-t-xl flex-shrink-0">
        <img
          className="w-full h-48 sm:h-56 md:h-64 object-cover transform transition-transform duration-300 group-hover:scale-110"
          src={image}
          alt={title}
        />
      </div>

      {/* Content */}
      <div className="px-4 py-4 flex flex-col flex-grow">
        <h3 className="font-bold text-xl mb-2 gradient-text font-serif capitalize">
          {title}
        </h3>
        <p className="text-gray-500 text-base font-sofia capitalize mt-2 flex-grow">
          {description}
        </p>
        {/* Display Tags */}
        <div className="mt-4 flex flex-wrap gap-2 font-sofia">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="text-gray-700 text-sm font-medium px-4 py-1 rounded-full bg-gray-400/10 group-hover:text-yellow-400 group-hover:bg-yellow-500/30"
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