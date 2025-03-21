import React from 'react';
import { useNavigate } from 'react-router-dom';

type CardProps = {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[]; // Add tags to the props
};

const Card: React.FC<CardProps> = ({ id, title, description, image }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/events/${id}`);
  };

  return (
<section 
  className="relative isolate flex flex-col  overflow-hidden rounded-2xl px-8 pb-8 pt-40   group cursor-pointer h-[300px] w-full" 
  onClick={handleClick}
>
  {/* Background Image - fixed size and position */}
  <div className='h-full w-full'>
    <img 
      src={image} 
      alt={title}
      className="absolute inset-0 h-full w-full object-cover transform transition-transform duration-300 group-hover:scale-110 ease-in-out " 
    />
  </div>
  <div   className="absolute inset-0 
                                      transform translate-y-full group-hover:translate-y-0 
                                      transition-transform duration-500 ease-in-out z-0">
  {/* Gradient Overlay (Only visible on hover) */}
  <div className="absolute inset-0 bg-gradient-to-t from-green-900/70 via-teal-700/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out pointer-events-none"></div>
  
  {/* Title and Description Container */}
  <div className="z-10 flex flex-col h-auto absolute bottom-0 p-4">
    {/* Title - always visible but no vertical movement */}
    <h3 className="text-3xl font-bold text-white mb-2 transition-all duration-500 capitalize">{title}</h3>
    
    {/* Description (Only visible on hover) */}
    <div className="overflow-hidden text-sm leading-6 text-gray-300 opacity-0 group-hover:opacity-100 max-h-0 group-hover:max-h-40 transition-all duration-500 ease-in-out">
      {description}
    </div>
  </div>
  </div>
</section>
  );
};

export default Card;