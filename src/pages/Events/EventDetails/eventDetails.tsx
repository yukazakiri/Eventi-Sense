import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEventDetails } from './hooks/useEventDetails';
import TicketReservationModal from './components/ticketmodal';
import EventContent from './eventContent';
import EventSidebar from './eventSidebar';
import HeroSection from './heroSection';

const EventDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { event, loading, error, eventTags, organizer, companyProfile } = useEventDetails(id ?? ''); // Destructure companyProfile
    const [quantity, setQuantity] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (loading) return <div className="loader">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!event) return <div className="error">Event not found</div>;

    return (
        <div>
            {/* Main Content */}
            <HeroSection event={event} onOpenModal={() => setIsModalOpen(true)} />
            <div className='mx-auto max-w-screen-xl '>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_250px] lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_400px] gap-2">
                    {/* Pass companyProfile as a prop to EventContent */}
                    <EventContent
                        event={event}
                        eventTags={eventTags}
                        organizer={organizer}
                        companyProfile={companyProfile} // Pass companyProfile here
                        onOpenModal={() => setIsModalOpen(true)}
                    />

                    {/* Sidebar */}
                    <div className='top-0 sticky'>
                        <EventSidebar
                            event={event}
                            eventTags={eventTags}
                            onOpenModal={() => setIsModalOpen(true)}
                        />
                    </div>
                </div>
            </div>
            {/* Modal */}
            <TicketReservationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                event={event}
                quantity={quantity}
                setQuantity={setQuantity}
                onReserve={() => console.log('Reserve button clicked')}
            />
        </div>
    );
};

export default EventDetails;