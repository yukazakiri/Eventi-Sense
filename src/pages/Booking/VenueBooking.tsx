import { useParams, Navigate, useNavigate } from 'react-router-dom';
import supabase from '../../api/supabaseClient';
import { useState, useEffect } from 'react';
import Button from '../../components/Button/button';
import { Venue } from '../../types/venue';
import { VenueAmenity, Amenity } from '../../types/venue';
import MainNavbar from '../../layout/components/MainNavbar';
import { motion, AnimatePresence } from 'framer-motion';
import { MoonLoader } from 'react-spinners';

const BookVenue: React.FC = () => {
    const navigate = useNavigate();
    const { venueId } = useParams<{ venueId: string }>();
    const [venue, setVenue] = useState<Venue | null>(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showConflictModal, setShowConflictModal] = useState(false);
    const [bookingStartDate, setBookingStartDate] = useState<Date | null>(null);
    const [bookingEndDate, setBookingEndDate] = useState<Date | null>(null);
    const [loading, setLoading] = useState(true);
    const [redirectLoading, setRedirectLoading] = useState(false); // New state for redirect loading
    const [startTime, setStartTime] = useState<string | null>(null);
    const [endTime, setEndTime] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [service, setService] = useState('');
    const [user, setUser] = useState<any | null>(null);
    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [_venueAmenities, setVenueAmenities] = useState<VenueAmenity[]>([]);
    const [userLoading, setUserLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!venueId) return;

            try {
                setLoading(true);
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);
                setUserLoading(false);

                const [{ data: venueData, error: venueError }, { data: venueAmenitiesData, error: venueAmenitiesError }, { data: amenitiesData, error: amenitiesError }] = await Promise.all([
                    supabase.from('venues').select('*').eq('id', venueId).single(),
                    supabase.from('venue_amenities').select('*').eq('venue_id', venueId),
                    supabase.from('amenities').select('id, name'),
                ]);

                if (venueError) throw venueError;
                if (venueAmenitiesError) throw venueAmenitiesError;
                if (amenitiesError) throw amenitiesError;

                setVenue(venueData);
                setVenueAmenities(venueAmenitiesData || []);
                setAmenities(amenitiesData || []);

            } catch (err) {
                console.error('Error fetching data:', err);
                setError('An error occurred while fetching data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [venueId]);

    const handleBooking = async () => {
        if (!name) { setError("Please enter your name."); return; }
        if (!email) { setError("Please enter your email."); return; }
        if (!phone) { setError("Please enter your phone number."); return; }
        if (!service) { setError("Please select a service."); return; }
        if (!bookingStartDate) { setError("Please select a start date."); return; }
        if (!bookingEndDate) { setError("Please select an end date."); return; }
        if (!startTime) { setError("Please select a start time."); return; }
        if (!endTime) { setError("Please select an end time."); return; }
    
        const startDateTime = new Date(bookingStartDate);
        startDateTime.setHours(parseInt(startTime.split(':')[0], 10));
        startDateTime.setMinutes(parseInt(startTime.split(':')[1], 10));
    
        const endDateTime = new Date(bookingEndDate);
        endDateTime.setHours(parseInt(endTime.split(':')[0], 10));
        endDateTime.setMinutes(parseInt(endTime.split(':')[1], 10));
    
        if (endDateTime <= startDateTime) { 
            setError("End date and time must be after start date and time."); 
            return; 
        }
    
        try {
            const userId = user?.id;
    
            if (!userId) {
                setError("You must be logged in to make a booking.");
                return;
            }
                // Fetch the sender's profile to get their name
                const { data: senderProfile, error: profileError } = await supabase
                .from('profiles')
                .select('first_name, last_name')
                .eq('id', userId)
                .single();

                if (profileError) {
                console.error("Error fetching sender's profile:", profileError);
                setError("An error occurred while fetching your profile.");
                return;
                }

                const senderName = senderProfile
                ? `${senderProfile.first_name}, ${senderProfile.last_name}`
                : name; // Fallback to the name from the form
    
            // Create the booking
            const { error: bookingError } = await supabase
                .from('bookings')
                .insert([
                    {
                        venue_id: venueId,
                        user_id: userId,
                        start_date: startDateTime.toISOString(),
                        end_date: endDateTime.toISOString(),
                        name: name,
                        email: email,
                        phone: phone,
                        service: service,
                        message: message,
                        status: 'pending',
                    },
                ]);
    
            // Modified error handling for booking conflicts
            if (bookingError) {
                console.error("Error creating booking:", bookingError);
                if (bookingError.code === "23P01" || 
                    (bookingError.message && bookingError.message.includes("exclusion constraint"))) {
                    setShowConflictModal(true);
                    setTimeout(() => {
                        setShowConflictModal(false);
                    }, 5000);
                } else {
                    setError(bookingError.message || "Error creating booking");
                }
            } else {
                setSuccessMessage("Booking created successfully!");
                const notificationMessage = `${senderName} has requested to book ${venue?.name}`;
                
                // Create notifications for both venue owner and sender
                const [ownerNotification, senderNotification] = await Promise.all([
                    // Notification for venue owner
                    supabase.from('notifications').insert([
                        {
                            user_id: venue?.company_id,
                            sender_id: userId,
                            type: "booking_request",
                            message: notificationMessage,
                            link: `/Venue-Manager-Dashboard/Booking-List`,
                            is_read: false
                        }
                    ]),
                    // Notification for sender
                    supabase.from('notifications').insert([
                        {
                            user_id: userId,
                            sender_id: venue?.company_id,
                            type: "booking_confirmation",
                            message: `You have requested to book ${venue?.name}. Please wait for the venue owner's confirmation.`,
                            link: `/profile`,
                            is_read: false
                        }
                    ])
                ]);
    
                if (ownerNotification.error) {
                    console.error("Error creating owner notification:", ownerNotification.error);
                }
    
                if (senderNotification.error) {
                    console.error("Error creating sender notification:", senderNotification.error);
                }
    
                // Clear form fields
                setBookingStartDate(null);
                setBookingEndDate(null);
                setStartTime(null);
                setEndTime(null);
                setName('');
                setEmail('');
                setPhone('');
                setService('');
                setMessage('');
                setError('');
                
                // Set loading state for redirection after 2 seconds
                setTimeout(() => {
                    setRedirectLoading(true);
                    
                    // Redirect to profile after loading animation (1 second)
                    setTimeout(() => {
                        navigate('/profile');
                    }, 1000);
                }, 2000);
            }
        } catch (err) {
            console.error("Error during booking:", err);
            setError("An error occurred during booking.");
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
    };

    const formControlVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.3 }
        }
    };

    const imageVariants = {
        hidden: { scale: 0.9, opacity: 0 },
        visible: { 
            scale: 1, 
            opacity: 1,
            transition: { 
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const fadeInVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } }
    };

    // Spinner animation variants
    const spinnerVariants = {
        animate: {
            rotate: 360,
            transition: {
                duration: 1,
                ease: "linear",
                repeat: Infinity
            }
        }
    };

    if (loading || userLoading) return (
        <div className="h-screen w-full flex justify-center items-center bg-[#2F4157]">
          <MoonLoader color="#ffffff" size={60} />
        </div>
      );
    
    if (error && !venue) return <div>{error}</div>;
    if (!user) return <Navigate to="/register" />;
    if (!venue) return <div>Venue not found.</div>;

    return (
        <>
            <MainNavbar />
            <motion.div 
                className="overflow-hidden bg-[#2F4157] font-sofia shadow-2xl h-screen"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div 
                    className="noise-bg max-w-[90rem] mx-auto my-[2rem] md:my-[10rem] rounded-2xl shadow-lg"
                    style={{
                        background: `
                            linear-gradient(#152131, #152131) padding-box,
                            linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) border-box
                        `,
                        border: '1px solid transparent',
                        borderRadius: '0.75rem'
                    }}
                    variants={fadeInVariants}
                >
                    <div className="grid md:grid-cols-2 p-6">
                        <motion.div className='m-4 flex flex-col gap-2' variants={containerVariants}>
                            <motion.img
                                src={venue.cover_image_url}
                                alt={venue.name}
                                className="h-[300px] w-full object-cover"
                                variants={imageVariants}
                                whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
                            />
                            <motion.h2 
                                className="font-bonanova gradient-text text-3xl lg:text-4xl xl:text-5xl leading-tight mt-2"
                                variants={itemVariants}
                            >
                                {venue?.name}
                            </motion.h2>
                            <motion.p 
                                className="text-white mt-2 md:mt-4 font-sofia max-w-[40rem]"
                                variants={itemVariants}
                            >
                                {venue?.description}
                            </motion.p>
                            <motion.ul 
                                className="flex mt-4 bg-sky-600/20 rounded-full py-1 w-fit"
                                variants={itemVariants}
                            >
                                {amenities.map((amenity) => (
                                    <motion.li 
                                        key={amenity.id} 
                                        className="text-sky-500 px-2"
                                        whileHover={{ scale: 1.05, color: "#38bdf8" }}
                                    >
                                        {amenity.name} ,
                                    </motion.li>
                                ))}
                            </motion.ul>
                            <motion.p 
                                className='bg-green-600/20 text-green-500 py-1 w-fit rounded a-full px-2 my-4'
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                            >
                                Starting Price: PHP {venue?.price}
                            </motion.p>
                        </motion.div>

                        <motion.div 
                            className="flex flex-col p-6 m-4 bg-white shadow-2xl rounded-xl"
                            variants={fadeInVariants}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            {error && (
                                <motion.p 
                                    className="text-red-500 mb-2"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {error}
                                </motion.p>
                            )}
                            {successMessage && (
                                <motion.p 
                                    className="text-green-500 mb-2"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {successMessage}
                                </motion.p>
                            )}

                            <motion.div className="grid grid-cols-2 gap-4" variants={containerVariants}>
                                <motion.div variants={formControlVariants}>
                                    <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Name</label>
                                    <motion.input
                                        type="text"
                                        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.3)" }}
                                    />
                                </motion.div>
                                <motion.div variants={formControlVariants}>
                                    <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Email</label>
                                    <motion.input
                                        type="email"
                                        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="example@gmail.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.3)" }}
                                    />
                                </motion.div>

                                <motion.div variants={formControlVariants}>
                                    <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Phone Number</label>
                                    <motion.input
                                        type="tel"
                                        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="123-456-7890"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.3)" }}
                                    />
                                </motion.div>
                                <motion.div variants={formControlVariants}>
                                    <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Event Type</label>
                                    <motion.input
                                        type="text"
                                        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Webinar"
                                        value={service}
                                        onChange={(e) => setService(e.target.value)}
                                        whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.3)" }}
                                    />
                                </motion.div>

                                <motion.div variants={formControlVariants}>
                                    <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Start Date</label>
                                    <motion.input
                                        type="date"
                                        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={bookingStartDate ? bookingStartDate.toISOString().split('T')[0] : ''}
                                        onChange={(e) => setBookingStartDate(e.target.value ? new Date(e.target.value) : null)}
                                        whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.3)" }}
                                    />
                                </motion.div>
                                <motion.div variants={formControlVariants}>
                                    <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Start Time</label>
                                    <motion.input
                                        type="time"
                                        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={startTime || ''}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.3)" }}
                                    />
                                </motion.div>

                                <motion.div variants={formControlVariants}>
                                    <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">End Date</label>
                                    <motion.input
                                        type="date"
                                        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={bookingEndDate ? bookingEndDate.toISOString().split('T')[0] : ''}
                                        onChange={(e) => setBookingEndDate(e.target.value ? new Date(e.target.value) : null)}
                                        whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.3)" }}
                                    />
                                </motion.div>
                                <motion.div variants={formControlVariants}>
                                    <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">End Time</label>
                                    <motion.input
                                        type="time"
                                        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={endTime || ''}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.3)" }}
                                    />
                                </motion.div>
                            </motion.div>

                            <motion.textarea
                                className="bg-white border my-4 border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                rows={4}
                                placeholder="Enter any additional information"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                variants={formControlVariants}
                                whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.3)" }}
                            />

                            <motion.div
                                variants={itemVariants}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <Button
                                    label="Request Booking"
                                    gradientText={true}
                                    variant="secondary"
                                    onClick={handleBooking}
                                />
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Success Modal with Loading Animation */}
            <AnimatePresence>
                {successMessage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            className="bg-white rounded-lg p-8 max-w-md mx-4 text-center"
                        >
                            {!redirectLoading ? (
                                // Success message
                                <>
                                    <div className="text-green-500 mb-4">
                                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Booking Successful!</h3>
                                    <p className="text-gray-600 mb-6">Your booking request has been sent successfully. You will be redirected to your profile shortly.</p>
                                </>
                            ) : (
                                // Loading animation
                                <>
                                    <motion.div 
                                        className="w-16 h-16 mx-auto border-4 border-t-4 border-blue-500 border-t-transparent rounded-full mb-4"
                                        variants={spinnerVariants}
                                        animate="animate"
                                    />
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Redirecting...</h3>
                                    <p className="text-gray-600">Taking you to your profile page</p>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Conflict Modal */}
            <AnimatePresence>
                {showConflictModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            className="bg-white rounded-lg p-8 max-w-md mx-4 text-center"
                        >
                            <div className="text-amber-500 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Scheduling Conflict</h3>
                            <p className="text-gray-600 mb-6">
                                We noticed that there's already a booking for this venue during your selected time period. 
                                Please choose different dates or times for your event.
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                                onClick={() => setShowConflictModal(false)}
                            >
                                Choose Different Time
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default BookVenue;