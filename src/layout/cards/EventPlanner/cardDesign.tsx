import React from 'react';
import { useNavigate } from 'react-router-dom';

type CardProps = {
  id: string;
  name: string | null;
  specialization: string | null;
  avatar: string | null;
  is_public: boolean;
};

const Card: React.FC<CardProps> = ({ id, name, avatar, is_public}) => {
  const navigate = useNavigate();

  const avatarFallback = '/images/istockphoto-1207942331-612x612.jpg'; 

  const handleClick = () => {
    navigate(`/Event-Planner/${id}/Profile`);
  };

  // Function to limit specialization to 8 words with ellipsis

  return (
/* From Uiverse.io by Javierrocadev */ 
<div onClick={handleClick} className="group shadow-2xl cursor-pointer before:hover:scale-95 before:hover:h-96 before:hover:w-80 before:transition-all before:duration-500 before:content-[''] before:w-80 before:h-36
 before:bg-gradient-to-bl from-[#152131] via-[#1a2940] to-[#0f1825] before:absolute before:top-0 w-80 h-96 relative bg-gray-100 flex flex-col items-center justify-center gap-2 text-center overflow-hidden">
  <div className="w-28 h-28 mt-8 rounded-full border-4 border-gradient-gray z-10 group-hover:scale-150 group-hover:-translate-x-24  group-hover:-translate-y-24 transition-all duration-500">
    <img
      className="w-full h-full object-cover rounded-full bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600"
      src={avatar || avatarFallback}
      alt={name || 'Event Planner'}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.onerror = null;
        target.src = avatarFallback;
      }}
    />
  </div>
  <div className="z-10  group-hover:-translate-y-10 transition-all duration-500 font-sofia">
    <span className="text-2xl font-semibold text-gray-500 group-hover:bg-gradient-to-r group-hover:from-[#bf953f] group-hover:via-[#fcf6ba] group-hover:to-[#aa771c] group-hover:bg-clip-text group-hover:text-transparent transform transition-colors ease-in-out duration-700 font-bonanova">{name}</span>
    <p className='text-gray-400'>{is_public ? 'Public' : 'Private'}</p>
  </div>
  <a className="bg-blue-700 px-4 py-1 text-slate-400  z-10 hover:scale-125 transition-all duration-500 hover:bg-sky-400/40 w-auto font-sofia group-hover:text-white" >Visit</a>
</div>
  );
};

export default Card;