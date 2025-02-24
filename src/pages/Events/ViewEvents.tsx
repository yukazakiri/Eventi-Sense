import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../../api/supabaseClient';
import { RiMegaphoneFill } from 'react-icons/ri';
import { IoIosTimer } from "react-icons/io";
import { TiLocation } from 'react-icons/ti';
import { IoPeopleSharp } from "react-icons/io5";
import { BiCategoryAlt } from "react-icons/bi";

const EventDetails: React.FC = () => {
    const { id } = useParams(); // Get the event ID from the URL
    const [event, setEvent] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const { data, error } = await supabase
                    .from('events')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                setEvent(data);
            } catch (error) {
                console.error('Error fetching event details:', error);
                setError('Failed to load event details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEventDetails();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                {error}
            </div>
        );
    }

    if (!event) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-700">
                Event not found.
            </div>
        );
    }

    // Calculate date-related values only after `event` is defined
    const eventDate = new Date(event.date);
    const day = eventDate.getDate(); // Get the day
    const month = eventDate.toLocaleString('default', { month: 'long' }); // Get the month name
    const year = eventDate.getFullYear(); // Get the year
    const time = eventDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

    // Function to format date in Philippines time
    const formatDateInPHTime = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            timeZone: 'Asia/Manila', // Set timezone to Philippines
        }).format(date);
    };

    return (
        <div className='bg-navy-blue-3'>
        <div className="overflow-hidden  font-sofia">
            <div className="max-w-[80rem] mx-auto my-[2rem] md:my-[10rem] pb-[2rem] md:pb-[10rem] rounded-2xl">
                {/* Hero Section */}
                <div
                    className="relative h-96 rounded-2xl shadow-lg overflow-hidden"
                    style={{
                        backgroundImage: `url(${event.image_url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white p-6">
                        <h1 className="text-5xl font-bold mb-4">{event.name}</h1>
                        <p className="text-xl">
                            {formatDateInPHTime(event.date)} • {event.location}
                        </p>
                        <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
                            Get Tickets
                        </button>
                    </div>
                </div>

                {/* Event Details Section */}
                <div className="mx-auto mt-8 flex">
                    {/* Main Content Section */}
                    <main className="flex-1 pr-4 text-slate-50">
                    <div className='flex gap-2 '>
                        <div className="inline-block my-4 shrink-0 rounded-full border border-pink-300/10 bg-pink-400/20 dark:border-pink-300/10 dark:bg-pink-400/10">
                            <div className="flex justify-center text-pink-400">
                                <RiMegaphoneFill className="mt-[6px] ml-2" />
                                <h2 className="p-1 px-2">Sales End Soon</h2>
                            </div>
                        </div>
                        <div>
                            <div className="inline-block my-4 shrink-0 rounded-full border border-indigo-300/10 bg-indigo-400/20 dark:border-indigo-300/10 dark:bg-indigo-400/10">
                                <div className="flex justify-center text-indigo-400">
                             
                                    <h2 className="p-1 px-4">{event.status}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                        <div className="text-md mb-4">
                            <p className="tracking-wide">
                                {formatDateInPHTime(event.date)}
                            </p>
                            <h1 className="text-5xl font-bold font-bonanova py-1 text-orange-100 mb-8">
                                {event.name}
                            </h1>
                            <p className=''>
                                Make new friends and have fun at{' '}
                                <span className="text-orange-100">{event.name}</span>.
                            </p>
                        </div>
                    <div className="relative group my-2">
                        <div className="max-w-max  bg-slate-50 py-3 px-4 rounded-lg transition duration-300 ease-in-out hover:scale-105"> {/* Consistent padding */}
                            <div className="flex items-center space-x-2">
                                <div className="text-navy-blue-3 flex flex-col items-center">
                                    <h1 className='border-b-2 border-gray-300 text-md font-semibold tracking-wide'>Event Date</h1>
                                 
                                    <div className="rounded-full py-2 px-3 my-2 text-white bg-blue-600 text-md font-medium transition duration-300 ease-in-out group-hover:bg-blue-700"> {month}, {day}</div>
                                    <div className="text-lg text-gray-400">{year}</div>
                                    <div className="text-lg text-gray-500">{time}</div>
                                </div>
                            </div>
                        </div>  
                        <div className='absolute -top-4 -left-3  bg-pink-800/60 rounded-full border-pink-300/10 transition duration-300 ease-in-out group-hover:scale-110'> 
                            <IoIosTimer className='text-[2rem]  p-2 transition duration-300 ease-in-out group-hover:animate-pulse'/> 
                        </div>          
                    </div>
                    <div className=" max-w-max mt-6   ">
                        <h3 className="text-3xl font-semibold font-bonanova p-2 text-orange-100">Location</h3>
                        <div className='pb-6 px-6'>
                        <div className="flex items-center space-x-2">
                            <TiLocation className="text-slate-50" />
                            <p className="text-slate-50 ml-3">{event.location}</p>
                        </div>
                        <a
                            href={`https://maps.google.com/?q=${event.location}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-500 hover:underline pl-6"
                        >
                            View on Map
                        </a>
                        </div>
                    </div>
                    <div className=" max-w-max mb-6   ">
                        <h3 className="text-3xl font-semibold font-bonanova p-2 text-orange-100">About this Event</h3>
                        <div className='pb-6 px-6'>
                        <div className="flex items-center space-x-2">
                  
                            <p className="text-slate-50 ml-3">{event. description}</p>
                        </div>
                      
                        </div>
                    </div>
                    <div className="flex gap-6">
                        <div className='flex flex-col justify-center items-center shadow-2xl max-w-max p-4 '>
                        <div className="flex justify-center items-center w-10 h-10 rounded-full bg-indigo-400/20 p-2">
                            <IoPeopleSharp className="text-indigo-500 text-[2rem] " />
                        </div>
                        <div className='pb-4 px-8 '>
                            <p className="text-orange-50 font-bonanova text-2xl font-semibold ">
                                Capacity
                            </p>  
                            <p className='flex justify-center items-center'>
                                {event.capacity} 
                            </p>
                         </div>
                        </div>
                        <div className='flex flex-col justify-center items-center shadow-2xl max-w-max p-4 '>
                        <div className="flex justify-center items-center w-10 h-10 rounded-full bg-indigo-400/20 p-2">
                            <BiCategoryAlt className="text-indigo-500 text-[2rem] " />
                        </div>
                        <div className='pb-4 px-8 '>
                            <p className="text-orange-50 font-bonanova text-2xl font-semibold ">
                            Category
                            </p>  
                            <p className='flex justify-center items-center'>
                            {event.category}
                            </p>
                         </div>
                        </div>
                     
                    </div>
                    </main>

                    {/* Sidebar Section */}
                    <aside className="w-1/4 pl-4  sticky top-0">
                        <div className="flex flex-col gap-6 mt-8 sticky top-0"> 
                            <div className="p-6 rounded-2xl hover:shadow-md border-[1px] border-gray-300 w-full transition duration-300 ease-in-out hover:scale-105">
                                <h3 className="text-2xl mb-2 font-bonanova text-orange-100 ">Ticket Price</h3>
                                <p className="text-slate-50">PHP {event.ticket_price}</p>
                                <button className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
                                    Get Tickets
                                </button>
                            </div>
                      
                           
                        </div>
                    </aside>
                </div>
            </div>
        </div>
        </div>
    );
};

export default EventDetails;