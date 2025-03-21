import React from 'react';
import { MdPeople, MdOutlineAccessTimeFilled } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";
import { HoverButton2 } from '../../../components/Button/button-hover';
import { formatDateInPHTime } from './components/dateUtils';

interface HeroSectionProps {
  event: {
    image_url: string;
    name: string;
    description: string;
    date: string;
    location: string;
    capacity: string;
    ticket_price: number;
  };
  onOpenModal: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ event, onOpenModal }) => {
  return (
    <div className="relative h-[40vh] xs:h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[75vh]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${event.image_url})` }}
      />
      <div className="absolute inset-0 bg-gray-900/60"></div>
      <div className="absolute inset-2 sm:inset-4 md:inset-6 border border-white/20 pointer-events-none"></div>

      {/* Main Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl xl:max-w-4xl">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-semibold text-white mb-3 sm:mb-4 md:mb-6 font-bonanova uppercase leading-tight">
              {event.name}
            </h1>
            <p className="text-sm xs:text-md sm:text-lg text-white leading-relaxed mb-4 sm:mb-6 md:mb-8 max-w-2xl font-sofia tracking-widest">
              {event.description}
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <HoverButton2 
                className="text-xs xs:text-sm sm:text-base px-4 py-2 xs:px-6 xs:py-3"
                onClick={onOpenModal}
              >
                {event.ticket_price === 0 ? 'Reserve Now' : 'Get Tickets'}
              </HoverButton2>
            </div>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="absolute -bottom-14 xs:-bottom-16 sm:-bottom-20 md:-bottom-12 left-0 right-0 backdrop-blur-sm py-3 sm:py-4 md:py-6 max-w-7xl mx-auto font-sofia tracking-widest text-xxs xs:text-xs sm:text-sm shadow-lg shadow-black/30 bg-navy-blue-5/95">
        <div className="absolute inset-2 sm:inset-3 border border-white/20 pointer-events-none"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 items-center">
            <InfoItem 
              icon={<MdOutlineAccessTimeFilled className="text-yellow-500/60 m-2 sm:m-3 text-lg sm:text-xl" />}
              text={formatDateInPHTime(event.date)}
            />
            <InfoItem
              icon={<IoLocationSharp className="text-yellow-500/60 m-2 sm:m-3 text-lg sm:text-xl" />}
              text={event.location}
            />
            <InfoItem
              icon={<MdPeople className="text-yellow-500/60 m-2 sm:m-3 text-lg sm:text-xl" />}
              text={event.capacity}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <div className="w-full md:w-auto relative font-sofia tracking-widest">
    <div className="flex flex-row xs:flex-row md:flex-col gap-1 xs:gap-2 items-center justify-start md:justify-center w-full py-1 sm:py-1 px-2 xs:px-4">
      <div className="border-yellow-500/40 border-[1px] rounded-full">
        {icon}
      </div>
      <p className="flex justify-center items-center w-auto ml-0 xs:ml-2 text-center xs:text-left md:text-center text-white text-xxs text-xs sm:text-sm truncate">
        {text}
      </p>
    </div>
  </div>
);

export default HeroSection;