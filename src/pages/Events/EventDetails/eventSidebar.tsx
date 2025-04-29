import React from 'react';
import { motion } from 'framer-motion';


interface EventSidebarProps {
    event: any;
    eventTags: string[];
    onOpenModal: () => void;
    hasTicket?: boolean;
    eventStatus: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | null;
}

const EventSidebar: React.FC<EventSidebarProps> = ({ 
    event, 
    onOpenModal, 
    hasTicket = false,
    eventStatus
}) => {
    const sidebarVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    const buttonVariants = {
        hover: {
            scale: 1.05,
            transition: {
                type: "spring",
                stiffness: 250,
                damping: 20
            }
        },
        tap: {
            scale: 0.95
        }
    };

  console.log('Event Status:', eventStatus);

    const getButtonContent = () => {
        if (eventStatus === 'cancelled') {
            return {
                text: 'Event Cancelled',
                className: 'bg-gray-600 cursor-not-allowed opacity-60',
                disabled: true
            };
        }
        
        if (hasTicket && eventStatus === 'completed') {
            return {
                text: 'Write a Review',
                className: 'bg-yellow-500 hover:bg-yellow-600',
                disabled: false
            };
        }
        
        if (eventStatus === 'completed' && !hasTicket) {
            return {
                text: 'Event Ended',
                className: 'bg-gray-600 cursor-not-allowed opacity-60',
                disabled: true
            };
        }

        if (hasTicket) {
            return {
                text: 'View Ticket',
                className: 'bg-sky-500 hover:bg-sky-600',
                disabled: false
            };
        }

        return {
            text: event.ticket_price === 0 ? 'Reserve Now' : 'Purchase Tickets',
            className: 'bg-green-400/90 hover:bg-green-500',
            disabled: false
        };
    };

    const buttonContent = getButtonContent();
  

    const isButtonDisabled = eventStatus === 'cancelled';



    return (
        <motion.aside
            className="mt-16 top-0 sticky py-2"
            initial="hidden"
            animate="visible"
            variants={sidebarVariants}
        >
            <motion.div
                className="border shadow-xl rounded-xl flex flex-col justify-center items-center p-4 space-y-3"
                style={{
                    background: `
                        linear-gradient(#152131, #152131) padding-box,
                        linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) border-box
                    `,
                    border: '1px solid transparent',
                    borderRadius: '0.75rem'
                }}
                whileHover={{
                    scale: 1.02,
                    backgroundColor: 'rgba(243, 244, 246, 0.5)', // Tailwind gray-100/50
                    backdropFilter: 'blur(12px)'
                }}
                transition={{
                    duration: 0.4,
                    ease: 'easeOut'
                }}
            >
                <motion.h3
                    className='gradient-text text-xl font-bonanova font-semibold uppercase tracking-wider border-b border-gray-300/50 pb-2'
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {hasTicket ? 'Ticket Purchased' : 'Ticket Price'}
                </motion.h3>
                
                <motion.p
                    className={`font-bold text-2xl ${isButtonDisabled ? 'text-gray-400' : 'text-green-400/80'}`}
                    whileHover={!isButtonDisabled ? { color: '#4ade80' } : {}}
                    transition={{ duration: 0.3 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
              
                >
                    {hasTicket 
                        ? '✓ Confirmed' 
                        : (event.ticket_price === 0 ? 'FREE' : `₱${event.ticket_price}`)}
                </motion.p>
                <motion.button
                    onClick={buttonContent.disabled ? undefined : onOpenModal}
                    className={`px-6 py-2.5 text-white rounded-full border border-white/80 shadow-md font-medium ${buttonContent.className}`}
                    variants={!buttonContent.disabled ? buttonVariants : {}}
                    whileHover={!buttonContent.disabled ? "hover" : {}}
                    whileTap={!buttonContent.disabled ? "tap" : {}}
                    disabled={buttonContent.disabled} // Correct disabled state
                >
                    {buttonContent.text}
                </motion.button>
            </motion.div>
        </motion.aside>
    );
};

export default EventSidebar;
