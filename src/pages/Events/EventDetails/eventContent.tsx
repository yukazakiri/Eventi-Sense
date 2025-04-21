
import { motion,  AnimatePresence, Variants } from 'framer-motion';

// Icon imports - grouped by source
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { RiMegaphoneFill } from 'react-icons/ri';
import { IoIosTimer } from 'react-icons/io';
import { LuPartyPopper } from 'react-icons/lu';
import { FaCheckCircle, FaHourglassHalf, FaCalendarAlt, FaTimesCircle } from 'react-icons/fa';
import { getTimeComponents } from './components/dateUtils';
import OrganizerCard from './components/organizerCard';
import { Event, Organizer, CompanyProfile } from './types';
import { useInView } from 'react-intersection-observer';

// Type definitions
interface EventTag {
    id: string;
    name: string;
    type: 'venue' | 'supplier';
}

interface EventContentProps {
    event: Event;
    eventTags: EventTag[];
    organizer?: Organizer;
    companyProfile?: CompanyProfile;
    onOpenModal: () => void;
}

const EventContent: React.FC<EventContentProps> = ({
    event,
    eventTags,
    organizer,
    companyProfile,
 
}) => {
    const { month, day, year, time } = getTimeComponents(event.date);
    const fallbackAvatarUrl = '/images/istockphoto-1207942331-612x612.jpg';
    
    // Create reusable intersection observer hooks for each section
    const [aboutRef, aboutInView] = useInView({ threshold: 0.1, triggerOnce: true });
    const [infoRef, infoInView] = useInView({ threshold: 0.1, triggerOnce: true });

    
    // Initial container animation
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.2,
                duration: 0.6,
                ease: [0.6, 0.05, 0.01, 0.9]
            }
        }
    };

    // Advanced section variants with custom transitions
    const sectionVariants: Variants = {
        hidden: { 
            opacity: 0,
            y: 40
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 100,
                duration: 0.8,
                ease: [0.6, 0.05, 0.01, 0.9]
            }
        }
    };

    // Badge variants with pop effect
    const badgeVariants: Variants = {
        hidden: { 
            scale: 0.8, 
            opacity: 0,
            y: 15
        },
        visible: (custom) => ({
            scale: 1,
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 15,
                delay: custom * 0.15,
                duration: 0.5
            }
        })
    };

    // List item variants with staggered appearance
    const listItemVariants: Variants = {
        hidden: { 
            opacity: 0, 
            x: -20,
            filter: "blur(8px)"
        },
        visible: (custom) => ({
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            transition: {
                delay: custom * 0.1,
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1.0]
            }
        })
    };

    // Tag animation variants with staggered and floating effect
    const tagVariants: Variants = {
        hidden: { 
            opacity: 0, 
            y: 20, 
            scale: 0.9 
        },
        visible: (custom) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                delay: custom * 0.05,
                duration: 0.4,
                ease: "easeOut"
            }
        }),
        hover: { 
            y: -5, 
            scale: 1.05,
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            transition: { 
                type: "spring", 
                stiffness: 400, 
                damping: 10 
            }
        }
    };

    // Date card variants with float effect
    const dateCardVariants: Variants = {
        hidden: { 
            opacity: 0, 
            rotateY: 15,
            scale: 0.95,
            y: 30
        },
        visible: {
            opacity: 1,
            rotateY: 0,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                duration: 0.7
            }
        },
        hover: {
            scale: 1.05,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            transition: { 
                type: "spring", 
                stiffness: 300, 
                damping: 10 
            }
        }
    };

    // Timer icon variants with pulse effect
    const timerIconVariants = {
        hidden: { opacity: 0, scale: 0, rotate: -45 },
        visible: { 
            opacity: 1, 
            scale: 1, 
            rotate: 0,
            transition: { 
                type: "spring", 
                stiffness: 200, 
                damping: 10, 
                delay: 0.3 
            }
        },
        hover: { 
            rotate: [0, 10, 0], 
            scale: 1.1,
            transition: { 
                rotate: {
                    repeat: Infinity,
                    repeatType: "mirror",
                    duration: 2
                }
            }
        }
    };

    // Icon animation for info section
    const iconVariants = {
        hidden: { opacity: 0, scale: 0, rotate: -30 },
        visible: (custom: number) => ({
            opacity: 1,
            scale: 1,
            rotate: 0,
            transition: {
                delay: custom * 0.1 + 0.3,
                type: "spring",
                stiffness: 300,
                damping: 15
            }
        }),
        hover: { 
            scale: 1.2, 
            rotate: 10,
            background: "rgba(236, 72, 153, 0.5)",
            transition: { 
                type: "spring", 
                stiffness: 400, 
                damping: 10 
            } 
        }
    };
    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'completed':
                return {
                    icon: <FaCheckCircle className="mt-[2px]" />,
                    borderColor: 'border-green-300/10',
                    bgColor: 'bg-green-400/20',
                    shadowColor: 'shadow-green-500/20',
                    textColor: 'text-green-400'
                };
            case 'ongoing':
                return {
                    icon: <FaHourglassHalf className="mt-[2px]" />,
                    borderColor: 'border-blue-300/10',
                    bgColor: 'bg-blue-400/20',
                    shadowColor: 'shadow-blue-500/20',
                    textColor: 'text-blue-400'
                };
            case 'upcoming':
                return {
                    icon: <FaCalendarAlt className="mt-[2px]" />,
                    borderColor: 'border-yellow-300/10',
                    bgColor: 'bg-yellow-400/20',
                    shadowColor: 'shadow-yellow-500/20',
                    textColor: 'text-yellow-400'
                };
            case 'cancelled':
                return {
                    icon: <FaTimesCircle className="mt-[2px]" />,
                    borderColor: 'border-red-300/10',
                    bgColor: 'bg-red-400/20',
                    shadowColor: 'shadow-red-500/20',
                    textColor: 'text-red-400'
                };
            default:
                return {
                    icon: <LuPartyPopper className="mt-[2px]" />,
                    borderColor: 'border-indigo-300/10',
                    bgColor: 'bg-indigo-400/20',
                    shadowColor: 'shadow-indigo-500/20',
                    textColor: 'text-indigo-400'
                };
        }
    };

    // In your JSX where the status badge is rendered
    const statusStyle = getStatusStyle(event.status);
  

    return (
        <motion.div
            className="lg:pr-4 overflow-hidden"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <main className="flex-1 px-6 md:px-8 lg:pr-4 text-slate-50">
                <div className="py-6">
                    <div className="max-w-6xl mx-auto">
                        {/* Status Badges Section */}
                        <motion.div
                            variants={sectionVariants}
                            className="text-gray-600 text-left font-sofia tracking-wide mb-6"
                        >
                            <div className="flex flex-wrap gap-3">
                                <AnimatePresence>
                                    <motion.div
                                     key="sales-badge"
                                        custom={0}
                                        variants={badgeVariants}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover={{ 
                                            scale: 1.05, 
                                            transition: { type: "spring", stiffness: 400, damping: 10 } 
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        className="inline-block my-4 shrink-0 rounded-full border border-pink-300/10 bg-pink-400/20 shadow-lg shadow-pink-500/20"
                                    >
                                        <div className="flex justify-center text-pink-400">
                                            <motion.div
                                                animate={{ 
                                                    rotate: [0, -10, 0, 10, 0],
                                                    scale: [1, 1.1, 1]
                                                }}
                                                transition={{ 
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    repeatType: "reverse",
                                                    ease: "easeInOut"
                                                }}
                                            >
                                                <RiMegaphoneFill className="mt-[6px] ml-2" />
                                            </motion.div>
                                            <h2 className="p-1 px-2 text-sm md:text-base">Sales End Soon</h2>
                                        </div>
                                    </motion.div>
                                    
                                 
                                
                                    <motion.div
                                        key="status-badge"
                                        custom={1}
                                        variants={badgeVariants}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover={{ 
                                            scale: 1.05, 
                                            transition: { type: "spring", stiffness: 400, damping: 10 } 
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`inline-block my-4 shrink-0 rounded-full border ${statusStyle.borderColor} ${statusStyle.bgColor} shadow-lg ${statusStyle.shadowColor}`}
                                    >
                                        <div className={`flex justify-center ${statusStyle.textColor} px-4 py-1`}>
                                            <motion.div
                                                animate={{ 
                                                    rotate: [0, 10, 0, -10, 0],
                                                    scale: [1, 1.1, 1]
                                                }}
                                                transition={{ 
                                                    duration: 2,
                                                    delay: 0.3,
                                                    repeat: Infinity,
                                                    repeatType: "reverse",
                                                    ease: "easeInOut"
                                                }}
                                            >
                                                {statusStyle.icon}
                                            </motion.div>
                                            <h2 className="ml-2 text-sm md:text-base capitalize">{event.status}</h2>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </motion.div>

                        {/* About Event Section */}
                        <motion.section
                            ref={aboutRef}  // Added ref
                            initial="hidden"
                            animate={aboutInView ? "visible" : "hidden"}
                            variants={sectionVariants}
                            className="bg-[#152131] rounded-lg p-6 mb-6 relative overflow-hidden"
                            style={{
                                background: `
                                linear-gradient(#152131, #152131) padding-box,
                                linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) border-box
                                `,
                                border: '1px solid transparent',
                                borderRadius: '0.75rem'
                            }}
                        >
                            <motion.div
                                className="absolute inset-0 rounded-lg opacity-20 pointer-events-none"
                                animate={{
                                    background: [
                                        "radial-gradient(circle at 20% 30%, rgba(191, 149, 63, 0.1) 0%, transparent 50%)",
                                        "radial-gradient(circle at 70% 60%, rgba(179, 135, 40, 0.15) 0%, transparent 50%)",
                                        "radial-gradient(circle at 40% 80%, rgba(251, 245, 183, 0.1) 0%, transparent 50%)",
                                        "radial-gradient(circle at 20% 30%, rgba(191, 149, 63, 0.1) 0%, transparent 50%)"
                                    ]
                                }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            />
                            
                            <motion.div 
                                className="w-full mb-2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <motion.h3 
                                    className="text-xl md:text-2xl font-bold mb-4 text-white"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                >
                                    About this Event
                                </motion.h3>
                                <motion.div 
                                    className="pb-4"
                                    initial={{ opacity: 0 }}
                                    animate={aboutInView ? { opacity: 1 } : { opacity: 0 }}
                                    transition={{ delay: 0.4, duration: 0.7 }}
                                >
                                    <p className="text-base md:text-lg leading-relaxed">{event.description}</p>
                                </motion.div>
                            </motion.div>

                            <motion.p 
                                className="font-sofia text-base md:text-lg text-white"
                                initial={{ opacity: 0, y: 10 }}
                                animate={aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                            >
                                Make new friends and have fun at{' '}
                                <motion.span 
                                    className="text-pink-400 capitalize"
                                    animate={{ 
                                        color: ["#ec4899", "#f472b6", "#ec4899"]
                                    }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    {event.name}
                                </motion.span>.
                            </motion.p>

                            {/* Event Date Display */}
                            <motion.div 
                                className="relative group my-8 font-sofia"
                                initial="hidden"
                                animate={aboutInView ? "visible" : "hidden"}
                                whileHover="hover"
                                variants={dateCardVariants}
                            >
                                <motion.div 
                                    className="inline-block shadow-xl py-3 px-4 w-full md:w-auto relative z-10 overflow-hidden"
                                    style={{
                                        background: `
                                        linear-gradient(#152131, #152131) padding-box,
                                        linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) border-box
                                        `,
                                        border: '1px solid transparent',
                                        borderRadius: '0.75rem'
                                    }}
                                >
                                    <motion.div
                                        className="absolute inset-0 rounded-lg opacity-30 pointer-events-none"
                                        animate={{
                                            background: [
                                                "linear-gradient(45deg, rgba(191, 149, 63, 0.1) 0%, rgba(251, 245, 183, 0.2) 50%, rgba(170, 119, 28, 0.1) 100%)",
                                                "linear-gradient(45deg, rgba(170, 119, 28, 0.1) 0%, rgba(191, 149, 63, 0.2) 50%, rgba(251, 245, 183, 0.1) 100%)"
                                            ]
                                        }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    />
                                    
                                    <div className="flex items-center justify-center md:justify-start space-x-2 p-4">
                                        <div className="flex flex-col items-center font-medium">
                                            <motion.h1 
                                                className='border-b-[1px] border-yellow-700/30 text-md font-bold tracking-wide uppercase'
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.6, duration: 0.5 }}
                                            >
                                                Event Date
                                            </motion.h1>
                                            <motion.div 
                                                className="py-2 px-3 my-2 text-pink-400/80 border-[1px] border-pink-600/20 bg-pink-600/10 text-lg font-medium"
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.7, duration: 0.5, type: "spring" }}
                                            >
                                                {month}, {day}
                                            </motion.div>
                                            <motion.div 
                                                className="text-lg text-gray-300"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.8, duration: 0.5 }}
                                            >
                                                {year}
                                            </motion.div>
                                            <motion.div 
                                                className="text-lg text-gray-300"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.9, duration: 0.5 }}
                                            >
                                                {time}
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>
                                <motion.div 
                                    className='absolute -top-4 -left-3 bg-pink-700/20 rounded-full text-pink-400 border-pink-300/10'
                                    variants={timerIconVariants}
                                    whileHover="hover"
                                >
                                    <IoIosTimer className='text-[2rem] p-2' />
                                </motion.div>
                            </motion.div>
                        </motion.section>

                        {/* Event Information Section */}
                        <motion.section
                            ref={infoRef}   // Added ref
                            initial="hidden"
                            animate={infoInView ? "visible" : "hidden"}
                            variants={sectionVariants}
                            className="bg-[#152131] rounded-lg p-6 mb-6 relative overflow-hidden"
                            style={{
                                background: `
                                linear-gradient(#152131, #152131) padding-box,
                                linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) border-box
                                `,
                                border: '1px solid transparent',
                                borderRadius: '0.75rem'
                            }}
                        >
                            <motion.div
                                className="absolute inset-0 rounded-lg opacity-20 pointer-events-none"
                                animate={{
                                    background: [
                                        "radial-gradient(circle at 70% 20%, rgba(191, 149, 63, 0.15) 0%, transparent 50%)",
                                        "radial-gradient(circle at 30% 50%, rgba(179, 135, 40, 0.1) 0%, transparent 50%)",
                                        "radial-gradient(circle at 60% 70%, rgba(251, 245, 183, 0.15) 0%, transparent 50%)",
                                        "radial-gradient(circle at 70% 20%, rgba(191, 149, 63, 0.15) 0%, transparent 50%)"
                                    ]
                                }}
                                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                            />
                            
                            <motion.h2 
                                className="text-2xl font-bold mb-8"
                                initial={{ opacity: 0, y: 10 }}
                                animate={infoInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                transition={{ duration: 0.5 }}
                            >
                                Event Information
                            </motion.h2>
                            
                            <div className="space-y-8">
                                <motion.div 
                                    className="flex items-center space-x-4"
                                    custom={0}
                                    variants={listItemVariants}
                                >
                                    <motion.div
                                        custom={0}
                                        variants={iconVariants}
                                        whileHover="hover"
                                    >
                                        <Calendar className="h-8 w-8 text-pink-400 rounded-full bg-pink-400/30 p-2" />
                                    </motion.div>
                                    <div>
                                        <motion.h3 
                                            className="font-medium text-lg"
                                            initial={{ opacity: 0 }}
                                            animate={infoInView ? { opacity: 1 } : { opacity: 0 }}
                                            transition={{ delay: 0.1, duration: 0.5 }}
                                        >
                                            Date
                                        </motion.h3>
                                        <motion.p 
                                            className="text-gray-200"
                                            initial={{ opacity: 0 }}
                                            animate={infoInView ? { opacity: 1 } : { opacity: 0 }}
                                            transition={{ delay: 0.2, duration: 0.5 }}
                                        >
                                            {month} {day}, {year}
                                        </motion.p>
                                    </div>
                                </motion.div>

                                <motion.div 
                                    className="flex items-center space-x-4"
                                    custom={1}
                                    variants={listItemVariants}
                                >
                                    <motion.div
                                        custom={1}
                                        variants={iconVariants}
                                        whileHover="hover"
                                    >
                                        <Clock className="h-8 w-8 text-pink-400 rounded-full bg-pink-400/30 p-2" />
                                    </motion.div>
                                    <div>
                                        <motion.h3 
                                            className="font-medium text-lg"
                                            initial={{ opacity: 0 }}
                                            animate={infoInView ? { opacity: 1 } : { opacity: 0 }}
                                            transition={{ delay: 0.2, duration: 0.5 }}
                                        >
                                            Time
                                        </motion.h3>
                                        <motion.p 
                                            className="text-gray-200"
                                            initial={{ opacity: 0 }}
                                            animate={infoInView ? { opacity: 1 } : { opacity: 0 }}
                                            transition={{ delay: 0.3, duration: 0.5 }}
                                        >
                                            {time}
                                        </motion.p>
                                    </div>
                                </motion.div>

                                <motion.div 
                                    className="flex items-center space-x-4"
                                    custom={2}
                                    variants={listItemVariants}
                                >
                                    <motion.div
                                        custom={2}
                                        variants={iconVariants}
                                        whileHover="hover"
                                    >
                                        <MapPin className="h-8 w-8 text-pink-400 rounded-full bg-pink-400/30 p-2" />
                                    </motion.div>
                                    <div>
                                        <motion.h3 
                                            className="font-medium text-lg"
                                            initial={{ opacity: 0 }}
                                            animate={infoInView ? { opacity: 1 } : { opacity: 0 }}
                                            transition={{ delay: 0.3, duration: 0.5 }}
                                        >
                                            Location
                                        </motion.h3>
                                        <motion.p 
                                            className="capitalize tracking-widest text-base"
                                            initial={{ opacity: 0 }}
                                            animate={infoInView ? { opacity: 1 } : { opacity: 0 }}
                                            transition={{ delay: 0.4, duration: 0.5 }}
                                        >
                                            {event.location}
                                        </motion.p>
                                        <motion.a
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={infoInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 5 }}
                                            transition={{ delay: 0.5, duration: 0.5 }}
                                            whileHover={{ 
                                                scale: 1.05,
                                                color: "#7dd3fc",
                                                textDecoration: "underline" 
                                            }}
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sky-300 text-sm md:text-md"
                                        >
                                            View on Map
                                        </motion.a>
                                    </div>
                                </motion.div>

                                <motion.div 
                                    className="flex items-center space-x-4"
                                    custom={3}
                                    variants={listItemVariants}
                                >
                                    <motion.div
                                        custom={3}
                                        variants={iconVariants}
                                        whileHover="hover"
                                    >
                                        <Users className="h-8 w-8 text-pink-400 rounded-full bg-pink-400/30 p-2" />
                                    </motion.div>
                                    <div>
                                        <motion.h3 
                                            className="font-medium text-lg"
                                            initial={{ opacity: 0 }}
                                            animate={infoInView ? { opacity: 1 } : { opacity: 0 }}
                                            transition={{ delay: 0.4, duration: 0.5 }}
                                        >
                                            Capacity
                                        </motion.h3>
                                        <motion.p 
                                            className="text-gray-200"
                                            initial={{ opacity: 0 }}
                                            animate={infoInView ? { opacity: 1 } : { opacity: 0 }}
                                            transition={{ delay: 0.5, duration: 0.5 }}
                                        >
                                            {event.capacity}
                                        </motion.p>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.section>

                        {/* Tags Section */}
                        <motion.div 
                            variants={listItemVariants}
                            className="bg-[#152131] rounded-lg p-4 border border-blue-500/50 mt-4"
                            style={{
                                background: `
                                linear-gradient(#152131, #152131) padding-box,
                                linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) border-box
                                `,
                                border: '1px solid transparent',
                                borderRadius: '0.75rem'
                            }}
                        >
                            <div className="pb-4 px-4 md:px-8">
                                <p className="text-white font-serif text-lg font-semibold uppercase text-center">
                                    Tags
                                </p>
                                {/* Inside the Tags Section */}
                                <div className="flex flex-wrap gap-2 mt-2 justify-center">
                                    {eventTags && eventTags.length > 0 ? (
                                        eventTags.map((tag, index) => (
                                            <motion.span 
                                                key={tag.id}
                                                custom={index}
                                                variants={tagVariants}
                                                initial="hidden"
                                                animate="visible"
                                                whileHover="hover"
                                                className={`text-xs px-3 py-1 rounded-full ${
                                                    tag.type === 'venue' 
                                                        ? 'bg-blue-100 text-blue-800' 
                                                        : 'bg-green-100 text-green-800'
                                                }`}
                                            >
                                                {tag.name}
                                            </motion.span>
                                        ))
                                    ) : (
                                        <span className="text-gray-200 italic">No tags available</span>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Organizer Sections - Event Planner */}
                                                      {/* Add this to the main container or any section you want to have the shimmer effect */}

              
                          {event.organizer_type === 'event_planner' && organizer && (
                            
                <OrganizerCard
                              title="Organizer"
                              name={organizer.company_name || ''}
                              imageUrl={organizer.avatar_url || fallbackAvatarUrl}
                              fallbackImageUrl={fallbackAvatarUrl}
                              subtitle={organizer.role}
                              profileUrl={`/Event-Planner/${organizer.profile_id}/Profile`}
                            />
                         
                          )}
 

                        {/* Venue Manager Organizer */}
                        {event.organizer_type === 'venue_manager' && companyProfile && (
                          <OrganizerCard
                            title="Organizer"
                            name={companyProfile.company_name}
                            imageUrl={companyProfile.company_logo_url || fallbackAvatarUrl}
                            fallbackImageUrl={fallbackAvatarUrl}
                            profileUrl={`/Venue-Manager/${companyProfile.id}/Company-Profile`}
                          />
                        )}

                        {/* Supplier Organizer */}
                        {event.organizer_type === 'supplier' && organizer && (
                            <OrganizerCard
                                title="Organizer"
                                name={organizer.company_name || ''} // ✅ correct field
                                imageUrl={organizer.company_logo_url || fallbackAvatarUrl} // ✅ correct field
                                fallbackImageUrl={fallbackAvatarUrl}
                                profileUrl={`/supplier/${organizer.id}`}
                            />
                            )}

                    </div>
                </div>
            </main>
        </motion.div>
    );
};

export default EventContent;
