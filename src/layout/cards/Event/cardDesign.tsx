import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

type CardProps = {
  id: string;
  title: string;
  description: string;
  image?: string;
  tags: string[];
};

const Card: React.FC<CardProps> = ({ id, title, description, image, tags }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/events/${id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden h-full group cursor-pointer w-full hover:bg-navy-blue-5 rounded-xl transition-all duration-300 shadow-2xl flex flex-col"
      onClick={handleClick}
    >
      {/* Image */}
      <motion.div 
        className="overflow-hidden rounded-t-xl flex-shrink-0"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <motion.img
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          className="w-full h-48 sm:h-56 md:h-64 object-cover"
          src={image}
          alt={title}
        />
      </motion.div>

      {/* Content */}
      <motion.div 
        className="px-4 py-4 flex flex-col flex-grow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.h3 
          className="font-bold text-xl mb-2 gradient-text font-serif capitalize"
          whileHover={{ scale: 1.01 }}
        >
          {title}
        </motion.h3>
        <motion.p 
          className="text-gray-500 text-base font-sofia capitalize mt-2 flex-grow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {description}
        </motion.p>
        {/* Display Tags */}
        <motion.div 
          className="mt-4 flex flex-wrap gap-2 font-sofia"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {tags.map((tag, index) => (
            <motion.span
              key={index}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(234, 179, 8, 0.2)' }}
              className="text-gray-700 text-sm font-medium px-4 py-1 rounded-full bg-gray-400/10 group-hover:text-yellow-400 group-hover:bg-yellow-500/30"
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Card;