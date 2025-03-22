import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[]; // Add tags to the props
  role: 'supplier' | 'venue_manager' | 'event_planner' | null; // Add role to the props
}

const Card: React.FC<CardProps> = ({ id, title, description, image,  role }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Use role-specific route
    const basePath = role === 'supplier' ? '/Supplier-Dashboard' : role === 'event_planner' ? '/Event-Planner-Dashboard' : '/Venue-Manager-Dashboard';
    navigate(`${basePath}/UpdateEvents/${id}`);
  };

  return (
    <div
    key={id}
    className="relative h-[20em] w-full border-2 border-[rgba(30,59,133,0.5)] rounded-[1.5em] text-white font-nunito p-[1.5em] flex justify-center items-left flex-col gap-[1em] backdrop-blur-[12px] hover:shadow-2xl hover:shadow-sky-500/30 transition-all duration-500 group/card hover:-translate-y-1"
    style={{
      backgroundImage: `url(${image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 rounded-[1.5em]"></div>

    {/* Hover effect */}
    <div className="absolute inset-0 bg-gradient-to-b from-sky-500/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-[1.5em]"></div>

    {/* Pulse effect */}
    <div className="absolute inset-0 group-hover/card:animate-pulse"></div>

    {/* Dots */}
    <div className="absolute top-4 right-4 flex gap-2 cursor-pointer" onClick={handleClick} >
      <div className="w-2 h-2 rounded-full bg-sky-300/50"></div>
      <div className="w-2 h-2 rounded-full bg-sky-300/30"></div>
      <div className="w-2 h-2 rounded-full bg-sky-300/10"></div>
    </div>

    {/* Content */}
    <div className="relative z-10 transition-transform duration-300 group-hover/card:translate-y-[-2px] space-y-3">
      <h1 className="text-[2.2em] font-bold bg-gradient-to-r from-white via-sky-100 to-sky-200 bg-clip-text text-transparent">
        {title}
      </h1>
      <p className="text-[0.9em] text-sky-100/90 leading-relaxed font-light">
        {description || 'No description available'}
      </p>
    </div>

    {/* Button */}
    <button
      className="relative h-fit w-fit px-[1.4em] py-[0.7em] mt-2 border-[1px] border-sky-300/30 rounded-full flex justify-center items-center gap-[0.7em] overflow-hidden group/btn hover:border-sky-300/50 hover:shadow-lg hover:shadow-sky-500/20 active:scale-95 transition-all duration-300 backdrop-blur-[12px] bg-sky-500/10"
      onClick={() => navigate(`/Event-Planner-Dashboard/Events/${id}/attendees`)}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-sky-600/40 via-sky-400/50 to-sky-600/40 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
      <p className="relative z-10 font-medium tracking-wide">Manage Attendees</p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        className="relative z-10 w-5 h-5 group-hover/btn:translate-x-[10%] transition-transform duration-300"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
        ></path>
      </svg>
    </button>

    {/* Bottom glow */}
    <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-gradient-to-br from-sky-400/20 to-transparent blur-sm group-hover/card:animate-pulse"></div>
  </div>
  );
};

export default Card;