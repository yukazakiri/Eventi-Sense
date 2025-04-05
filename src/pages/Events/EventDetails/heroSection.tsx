import React from 'react';

import { HoverButton2 } from '../../../components/Button/button-hover';


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
  const [imageError, setImageError] = React.useState(false);

  // Preload the image to check if it loads correctly
  React.useEffect(() => {
    const img = new Image();
    img.src = event.image_url;
    img.onerror = () => setImageError(true);
  }, [event.image_url]);
console.log(event.image_url);
  return (
    <div className="relative h-[50vh]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-gray-800"
        style={{ 
          backgroundImage: !imageError ? `url(${event.image_url})` : 'none',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <div className="absolute inset-0 bg-gray-900/10"></div>
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

    
    </div>
  );
};



export default HeroSection;