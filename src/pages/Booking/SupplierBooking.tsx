import { useParams, Navigate } from 'react-router-dom';
import supabase from '../../api/supabaseClient';
import { useState, useEffect } from 'react';
import Button from '../../components/Button/button';
import { Supplier,SupplierServices } from '../../types/supplier';
import MainNavbar from '../../layout/components/MainNavbar';

interface User {
    id: string;
    email: string;
    // Add other user properties here
}



const BookSupplier: React.FC = () => {
    const { supplierId } = useParams<{ supplierId: string }>();
    const [supplier, setSupplier] = useState<Supplier | null>(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [bookingStartDate, setBookingStartDate] = useState<Date | null>(null);
    const [bookingEndDate, setBookingEndDate] = useState<Date | null>(null);
    const [loading, setLoading] = useState(true);
    const [startTime, setStartTime] = useState<string | null>(null);
    const [endTime, setEndTime] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [service, setService] = useState('');
    const [user, setUser] = useState<User | null>(null);
    const [userLoading, setUserLoading] = useState(true);
    const [services, setServices] = useState<SupplierServices[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!supplierId) {
                setError("Supplier ID is missing.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                // Fetch the authenticated user
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user as User | null);
                setUserLoading(false);

                // Fetch the supplier details
                const { data: supplierData, error: supplierError } = await supabase
                    .from('supplier')
                    .select('*')
                    .eq('id', supplierId)
                    .single();

                if (supplierError) throw supplierError;
                setSupplier(supplierData);

                // Fetch the services for the supplier
                const { data: servicesData, error: servicesError } = await supabase
                    .from('suppliers_services')
                    .select('*')
                    .eq('supplier_id', supplierId);

                if (servicesError) throw servicesError;
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

            const { error: bookingError } = await supabase
                .from('supplier_bookings')
                .insert([
                    {
                        supplier_id: supplierId,
                        user_id: userId,
                        start_date: startDateTime.toISOString(),
                        end_date: endDateTime.toISOString(),
                        name: name,
                        email: email,
                        phone: phone,
                        service_id: service, // Use the selected service ID
                        message: message,
                        status: 'pending',
                    },
                ]);

            if (bookingError) {
                console.error("Error creating booking:", bookingError);
                setError(bookingError.message);
            } else {
                setSuccessMessage("Booking created successfully!");
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
            }
        } catch (err) {
            console.error("Error during booking:", err);
            setError("An error occurred during booking.");
        }
    };

    if (loading || userLoading) return <div>Loading...</div>;
    if (error && !supplier) return <div>{error}</div>;
    if (!user) return <Navigate to="/register" />;
    if (!supplier) return <div>Supplier not found.</div>;

    return (
        <>
            <MainNavbar />
            <div className="overflow-hidden bg-slate-50 font-sofia shadow-2xl ">
                <div className="noise-bg max-w-[90rem] mx-auto my-[2rem] md:my-[10rem] rounded-2xl shadow-lg">
                    <div className="grid md:grid-cols-2">
                        <div className='m-4'>
                            <img
                                src={supplier.cover_image_url}
                                alt={supplier.name}
                                className="h-[300px] w-full object-cover "
                            />
                            <h2 className="font-bonanova gradient-text text-3xl lg:text-4xl xl:text-5xl leading-tight">
                                {supplier?.name}
                            </h2>
                            <p className="text-white mt-2 md:mt-4 font-sofia max-w-[40rem]">
                                {supplier?.description}
                            </p>
                            <p className='bg-green-100 text-green-700 py-1 w-fit rounded-full px-2 my-4'>PHP {supplier?.price_range}</p>
                        </div>

                        <div className="flex flex-col p-6 m-4 bg-white shadow-2xl rounded-xl">
                            {error && <p className="text-red-500 mb-2">{error}</p>}
                            {successMessage && <p className="text-green-500 mb-2">{successMessage}</p>}

                            <div className="grid grid-cols-2 gap-4 ">
                                <div>
                                    <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Name</label>
                                    <input
                                        type="text"
                                        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Email</label>
                                    <input
                                        type="email"
                                        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="example@gmail.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="123-456-7890"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Service</label>
                                    <select
                                        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={service}
                                        onChange={(e) => setService(e.target.value)}
                                    >
                                        <option value="">Select a service</option>
                                        {services.map((service) => (
                                            <option key={service.id} value={service.id}>
                                                {service.service_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Start Date</label>
                                    <input
                                        type="date"
                                        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={bookingStartDate ? bookingStartDate.toISOString().split('T')[0] : ''}
                                        onChange={(e) => setBookingStartDate(e.target.value ? new Date(e.target.value) : null)}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Start Time</label>
                                    <input
                                        type="time"
                                        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={startTime || ''}
                                        onChange={(e) => setStartTime(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">End Date</label>
                                    <input
                                        type="date"
                                        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={bookingEndDate ? bookingEndDate.toISOString().split('T')[0] : ''}
                                        onChange={(e) => setBookingEndDate(e.target.value ? new Date(e.target.value) : null)}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">End Time</label>
                                    <input
                                        type="time"
                                        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={endTime || ''}
                                        onChange={(e) => setEndTime(e.target.value)}
                                    />
                                </div>
                            </div>

                            <textarea
                                className="bg-white border my-4 border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                rows={4}
                                placeholder="Enter any additional information"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />

                            <Button
                                label="Request Booking"
                                gradientText={true}
                                variant="secondary"
                                onClick={handleBooking}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookSupplier;