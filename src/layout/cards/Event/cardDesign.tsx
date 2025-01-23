import React from 'react';

type CardProps = {
  title: string;
  description: string;
  image: string;
  tags: string[];
};

const Card: React.FC<CardProps> = ({ title, description, image, tags }) => {
  return (
    <div className="overflow-hidden h-auto group cursor-pointer w-full hover:bg-navy-blue-5 rounded-xl transition-all duration-300  shadow-2xl">
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
        <h3 className="font-bold text-xl mb-6 gradient-text ">
          {title}
        </h3>
        <p className="text-gray-500 text-base">{description}</p>
      </div>

      {/* Tags */}
      <div className="px-4 pt-2 pb-4">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Card;