import { useParams, Navigate, useNavigate } from 'react-router-dom';
import supabase from '../../api/supabaseClient';
import { useState, useEffect } from 'react';
import Button from '../../components/Button/button';
import { Supplier, SupplierServices } from '../../types/supplier';
import MainNavbar from '../../layout/components/MainNavbar';
import { motion, AnimatePresence } from 'framer-motion';
import { MoonLoader } from 'react-spinners';

const BookSupplier: React.FC = () => {
    const navigate = useNavigate();
    const { supplierId } = useParams<{ supplierId: string }>();
    const [supplier, setSupplier] = useState<Supplier | null>(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showConflictModal, setShowConflictModal] = useState(false);
    const [bookingStartDate, setBookingStartDate] = useState<Date | null>(null);
    const [bookingEndDate, setBookingEndDate] = useState<Date | null>(null);
    const [loading, setLoading] = useState(true);
    const [redirectLoading, setRedirectLoading] = useState(false);
    const [startTime, setStartTime] = useState<string | null>(null);
    const [endTime, setEndTime] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [service, setService] = useState('');
    const [user, setUser] = useState<any | null>(null);
    const [services, setServices] = useState<SupplierServices[]>([]);
    const [userLoading, setUserLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!supplierId) return;

            try {
                setLoading(true);
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);
                setUserLoading(false);

                const [
                    { data: supplierData, error: supplierError },
                    { data: servicesData, error: servicesError }
                ] = await Promise.all([
                    supabase.from('supplier').select('*').eq('id', supplierId).single(),
                    supabase.from('suppliers_services').select('*').eq('supplier_id', supplierId)
                ]);

                if (supplierError) throw supplierError;
                if (servicesError) throw servicesError;

                setSupplier(supplierData);
                setServices(servicesData || []);

            } catch (err) {
                console.error('Error fetching data:', err);
                setError('An error occurred while fetching data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [supplierId]);

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

            // Fetch sender's profile
            const { data: senderProfile, error: profileError } = await supabase
                .from('profiles')
                .select('first_name, last_name')
                .eq('id', userId)
                .single();

            if (profileError) throw profileError;
            const senderName = senderProfile ? `${senderProfile.first_name} ${senderProfile.last_name}` : name;

            // Create booking
            const { error: bookingError } = await supabase
                .from('supplier_bookings')
                .insert([{
                    supplier_id: supplierId,
                    user_id: userId,
                    start_date: startDateTime.toISOString(),
                    end_date: endDateTime.toISOString(),
                    name: name,
                    email: email,
                    phone: phone,
                    service_id: service,
                    message: message,
                    status: 'pending',
                }]);

            if (bookingError) {
                console.error("Error creating booking:", bookingError);
                if (bookingError.code === "23P01") {
                    setShowConflictModal(true);
                    setTimeout(() => setShowConflictModal(false), 5000);
                } else {
                    setError(bookingError.message);
                }
            } else {
                setSuccessMessage("Booking created successfully!");
                const notificationMessage = `${senderName} has requested to book ${supplier?.name}`;

                // Create notifications
                await Promise.all([
                    supabase.from('notifications').insert([{
                        user_id: supplier?.company_id,
                        sender_id: userId,
                        type: "booking_request",
                        message: notificationMessage,
                        link: `/Supplier-Manager-Dashboard/Booking-List`,
                        is_read: false
                    }]),
                    supabase.from('notifications').insert([{
                        user_id: userId,
                        sender_id: supplier?.company_id,
                        type: "booking_confirmation",
                        message: `You have requested to book ${supplier?.name}. Please wait for confirmation.`,
                        link: `/profile`,
                        is_read: false
                    }])
                ]);

                // Clear form
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

                // Redirect
                setTimeout(() => {
                    setRedirectLoading(true);
                    setTimeout(() => navigate('/profile'), 1000);
                }, 2000);
            }
        } catch (err) {
            console.error("Error during booking:", err);
            setError("An error occurred during booking.");
        }
    };

    // Update animation variants to match VenueBooking.tsx
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

    if (loading || userLoading) return (
        <div className="h-screen w-full flex justify-center items-center bg-[#2F4157]">
            <MoonLoader color="#ffffff" size={60} />
        </div>
    );

    if (error && !supplier) return <div>{error}</div>;
    if (!user) return <Navigate to="/register" />;
    if (!supplier) return <div>Supplier not found.</div>;

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
                                src={supplier.cover_image_url}
                                alt={supplier.name}
                                className="h-[300px] w-full object-cover"
                                variants={imageVariants}
                                whileHover={{ scale: 1.03 }}
                            />
                            <motion.h2 
                                className="font-bonanova gradient-text text-3xl lg:text-4xl xl:text-5xl leading-tight mt-2"
                                variants={itemVariants}
                            >
                                {supplier.name}
                            </motion.h2>
                            <motion.p 
                                className="text-white mt-2 md:mt-4 font-sofia max-w-[40rem]"
                                variants={itemVariants}
                            >
                                {supplier.description}
                            </motion.p>
                            <motion.ul 
                                className="flex mt-4 bg-sky-600/20 rounded-full py-1 w-fit"
                                variants={itemVariants}
                            >
                                {services.map(service => (
                                    <motion.li 
                                        key={service.id}
                                        className="text-sky-500 px-2"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        {service.service_name} •
                                    </motion.li>
                                ))}
                            </motion.ul>
                            <motion.p 
                                className='bg-green-600/20 text-green-500 py-1 w-fit rounded-full px-2 my-4'
                                variants={itemVariants}
                            >
                                Price Range: PHP {supplier.price_range}
                            </motion.p>
                        </motion.div>

                        <motion.div 
                            className="flex flex-col p-6 m-4 bg-white shadow-2xl rounded-xl"
                            variants={containerVariants}
                        >
                            {/* Form elements with animations */}
                            {error && <motion.p className="text-red-500 mb-2" variants={itemVariants}>{error}</motion.p>}
                            {successMessage && <motion.p className="text-green-500 mb-2" variants={itemVariants}>{successMessage}</motion.p>}

                            <motion.div className="grid grid-cols-2 gap-4" variants={containerVariants}>
                                {/* Form fields with enhanced animations */}
                                {[
                                    { label: 'Name', type: 'text', value: name, setter: setName, placeholder: 'John Doe' },
                                    { label: 'Email', type: 'email', value: email, setter: setEmail, placeholder: 'example@gmail.com' },
                                    { label: 'Phone Number', type: 'tel', value: phone, setter: setPhone, placeholder: '123-456-7890' },
                                ].map((field, index) => (
                                    <motion.div key={index} variants={formControlVariants}>
                                        <label className="block mb-2 text-md font-medium text-gray-800">{field.label}</label>
                                        <motion.input
                                            type={field.type}
                                            className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder={field.placeholder}
                                            value={field.value}
                                            onChange={(e) => field.setter(e.target.value)}
                                            whileFocus={{ scale: 1.01 }}
                                        />
                                    </motion.div>
                                ))}

                                <motion.div variants={formControlVariants}>
                                    <label className="block mb-2 text-md font-medium text-gray-800">Service</label>
                                    <motion.select
                                        className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={service}
                                        onChange={(e) => setService(e.target.value)}
                                        whileFocus={{ scale: 1.01 }}
                                    >
                                        <option value="">Select a service</option>
                                        {services.map(service => (
                                            <option key={service.id} value={service.id}>
                                                {service.service_name}
                                            </option>
                                        ))}
                                    </motion.select>
                                </motion.div>

                                {/* Date and Time inputs with enhanced styling */}
                                {[
                                    { label: 'Start Date', type: 'date', date: bookingStartDate, setDate: setBookingStartDate },
                                    { label: 'Start Time', type: 'time', time: startTime, setTime: setStartTime },
                                    { label: 'End Date', type: 'date', date: bookingEndDate, setDate: setBookingEndDate },
                                    { label: 'End Time', type: 'time', time: endTime, setTime: setEndTime },
                                ].map((field, index) => (
                                    <motion.div key={index} variants={formControlVariants}>
                                        <label className="block mb-2 text-md font-medium text-gray-800">{field.label}</label>
                                        <motion.input
                                            type={field.type}
                                            className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={field.type === 'date' ? 
                                                (field.date?.toISOString().split('T')[0] || '') : 
                                                (field.time || '')}
                                            onChange={(e) => field.type === 'date' ? 
                                                field.setDate?.(e.target.value ? new Date(e.target.value) : null) :
                                                field.setTime?.(e.target.value)}
                                            whileFocus={{ scale: 1.01 }}
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>

                            <motion.textarea
                                className="form-textarea w-full px-4 py-2 my-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={4}
                                placeholder="Additional information"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                variants={formControlVariants}
                                whileFocus={{ scale: 1.01 }}
                            />

                            <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }}>
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

            {/* Keep existing modals */}
            <AnimatePresence>
                {successMessage && (
                    <SuccessModal redirectLoading={redirectLoading} />
                )}
                {showConflictModal && (
                    <ConflictModal onClose={() => setShowConflictModal(false)} />
                )}
            </AnimatePresence>
        </>
    );
};

// Reusable Modal Components
const SuccessModal = ({ redirectLoading }: { redirectLoading: boolean }) => (
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
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Redirecting...</h3>
                <p className="text-gray-600">Taking you to your profile page</p>
            </>
        )}
    </motion.div>
</motion.div>
);

const ConflictModal = ({ onClose }: { onClose: () => void }) => (
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
            onClick={onClose}
        >
            Choose Different Time
        </motion.button>
    </motion.div>
</motion.div>
);

export default BookSupplier;