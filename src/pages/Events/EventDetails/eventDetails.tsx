import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useEventDetails } from './hooks/useEventDetails';
import TicketReservationModal from './components/ticketmodal';
import EventReviewModal from '../../../components/Reviews/ReviewEvent';
import EventContent from './eventContent';
import EventSidebar from './eventSidebar';
import HeroSection from './heroSection';
import { MoonLoader } from 'react-spinners';
import supabase from '../../../api/supabaseClient';
import EventReviewsCard from '../../../components/Reviews/EventReviewsCard';

const EventDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { event, loading, error, eventTags, organizer, companyProfile } = useEventDetails(id ?? '');
    const [quantity, setQuantity] = useState(1);
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [hasTicket, setHasTicket] = useState(false);
    const [checkingTicket, setCheckingTicket] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [eventStatus, setEventStatus] = useState<'upcoming' | 'ongoing' | 'completed' | null>(null);

    // Combined useEffect to handle ticket checking and event status
    useEffect(() => {
        const checkUserTicketsAndStatus = async () => {
            try {
                setCheckingTicket(true);
                
                // Get current user
                const { data: userData } = await supabase.auth.getUser();
                if (!userData?.user) {
                    setHasTicket(false);
                    return;
                }
                
                const userId = userData.user.id;
                setCurrentUserId(userId);
                
                // Get tickets with status = 'purchased' for this event for the current user
                const { data: ticketsData, error: ticketsError } = await supabase
                    .from('tickets')
                    .select('profiles(id)')
                    .eq('event_id', id)
                    .eq('status', 'purchased')
                    .eq('user_id', userId);
                
                if (ticketsError) {
                    console.error('Error fetching tickets:', ticketsError);
                    setHasTicket(false);
                    return;
                }
                
                // If tickets exist, user has purchased a ticket
                setHasTicket(ticketsData && ticketsData.length > 0);
            } catch (err) {
                console.error('Error checking tickets:', err);
                setHasTicket(false);
            } finally {
                setCheckingTicket(false);
            }
        };

        // Separate effect for event status
        const updateEventStatus = () => {
            if (event) {
                const now = new Date();
                const startDate = new Date(event.start_date);
                const endDate = new Date(event.end_date);

                if (now < startDate) {
                    setEventStatus('upcoming');
                } else if (now >= startDate && now <= endDate) {
                    setEventStatus('ongoing');
                } else {
                    setEventStatus('completed');
                }
                console.log('Event dates:', { now, startDate, endDate });
            }
        };
      
        if (id && event) {
            checkUserTicketsAndStatus();
            updateEventStatus(); // Call this separately
        }
    
    }, [id, event]);
  

    if (loading || checkingTicket) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <MoonLoader
                color="#ffffff"
                loading={true}
                size={50}
                aria-label="Loading Events"
            />
        </div>
    );
    
    if (error) return <div className="error">{error}</div>;
    if (!event) return <div className="error">Event not found</div>;

    // Handle button clicks based on ticket status
    const handleActionButtonClick = () => {
        if (hasTicket) {
            setIsReviewModalOpen(true);
        } else {
            setIsTicketModalOpen(true);
        }
    };

    return (
        <div>
            {/* Main Content */}
            <HeroSection 
                event={event} 
                onOpenModal={handleActionButtonClick}
            />
            <div className='mx-auto max-w-screen-xl'>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_250px] lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_400px] gap-2">
                    <div className="space-y-2 mb-6">
                        <EventContent
                            event={event}
                            eventTags={eventTags}
                            organizer={organizer}
                            companyProfile={companyProfile}
                            onOpenModal={handleActionButtonClick}
                        />
                        
                        {/* Add the Reviews Card here */}
                        <EventReviewsCard eventId={id ?? ''} />
                    </div>
                    
                    {/* Sidebar */}
                    <div className='top-0 sticky'>
                        <EventSidebar
                            event={event}
                            eventTags={eventTags}
                            onOpenModal={handleActionButtonClick}
                            hasTicket={hasTicket}
                            eventStatus={eventStatus}
                        />
                    </div>
                </div>
            </div>
            
            {/* Ticket Reservation Modal - only shown for users without tickets */}
            <TicketReservationModal
                isOpen={isTicketModalOpen}
                onClose={() => setIsTicketModalOpen(false)}
                event={event}
                quantity={quantity}
                setQuantity={setQuantity}
                onReserve={() => console.log('Reserve button clicked')}
            />
            
            {/* Review Modal - only shown for users with tickets */}
            {currentUserId && (
                <EventReviewModal
                    isOpen={isReviewModalOpen}
                    onClose={() => setIsReviewModalOpen(false)}
                    eventId={id ?? ''}
                    currentUserId={currentUserId}
                    eventName={event.name}
                />
            )}
        </div>
    );
};

export default EventDetails;