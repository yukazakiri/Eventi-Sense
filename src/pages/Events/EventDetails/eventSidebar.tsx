// EventSidebar.tsx
import React from 'react';
interface EventContentProps {
    event: any; // assuming event is already typed
    eventTags: string[];
    onOpenModal: () => void;
  }
  const EventSidebar: React.FC<EventContentProps> = ({ event, onOpenModal }) => {
    return (
        <aside className="mt-16 top-0 sticky py-2 group">
        <div className="bg-gray-100/20 backdrop-blur-lg border border-white/50 shadow-xl shadow-sky-400/30 rounded-xl flex flex-col justify-center items-center p-4 space-y-3 transition-all hover:bg-gray-100/50 hover:backdrop-blur-xl">
          <h3 className='text-white   text-xl font-bonanova font-semibold uppercase tracking-wider border-b border-gray-300/50 pb-2'>
            Ticket Price
          </h3>
          <p className="text-green-400/80 group-hover:text-green-500 font-bold text-2xl ">
            {event.ticket_price === 0 ? 'FREE' : `₱${event.ticket_price}`}
          </p>
          <button 
            onClick={onOpenModal}
            className="px-6 py-2.5 bg-green-400/90 text-white rounded-full border border-white/80 shadow-md hover:bg-green-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-medium"
          >
            {event.ticket_price === 0 ? 'Reserve Now' : 'Purchase Tickets'}
          </button>
        </div>
      </aside>
    );
};

export default EventSidebar;