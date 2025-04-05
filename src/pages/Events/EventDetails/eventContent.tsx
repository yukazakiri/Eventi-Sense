import React from 'react';

// Icon imports - grouped by source
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { RiMegaphoneFill } from 'react-icons/ri';
import { IoIosTimer } from 'react-icons/io';
import { LuPartyPopper } from 'react-icons/lu';
import { getTimeComponents } from './components/dateUtils';
import OrganizerCard from './components/organizerCard';
import { Event, Organizer, CompanyProfile } from './types';

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
    companyProfile 
}) => {
    const { month, day, year, time } = getTimeComponents(event.date);
    const fallbackAvatarUrl = '/images/istockphoto-1207942331-612x612.jpg';

    return (
        <div className="lg:pr-4">
            <main className="flex-1 px-6 md:px-8 lg:pr-4 text-slate-50">
                <div className="py-6">
                    <div className="max-w-6xl mx-auto">
                        {/* Status Badges Section */}
                        <div className="text-gray-600 text-left font-sofia tracking-wide">
                            <div className="flex flex-wrap gap-2">
                                <div className="inline-block my-4 shrink-0 rounded-full border border-pink-300/10 bg-pink-400/20">
                                    <div className="flex justify-center text-pink-400">
                                        <RiMegaphoneFill className="mt-[6px] ml-2" />
                                        <h2 className="p-1 px-2 text-sm md:text-base">Sales End Soon</h2>
                                    </div>
                                </div>
                                <div className="inline-block my-4 shrink-0 rounded-full border border-indigo-300/10 bg-indigo-400/20">
                                    <div className="flex justify-center text-indigo-400 px-4 py-1">
                                        <LuPartyPopper className="mt-[2px]" />
                                        <h2 className="ml-2 text-sm md:text-base">{event.status}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* About Event Section */}
                        <section 
                            className="shadow-2xl p-8 rounded-2xl text-gray-200 font-sofia"
                            style={{ background: 'linear-gradient(135deg, #014871 0%, #D7EDE2 100%)' }}
                        >
                            <div className="w-full mb-2">
                                <h3 className="text-2xl md:text-4xl font-semibold font-bonanova mb-4 text-white">
                                    About this Event
                                </h3>
                                <div className="pb-4">
                                    <p className="text-base md:text-lg">{event.description}</p>
                                </div>
                            </div>

                            <p className="font-sofia text-base md:text-lg text-white">
                                Make new friends and have fun at{' '}
                                <span className="text-pink-400 capitalize">{event.name}</span>.
                            </p>

                            {/* Event Date Display */}
                            <div className="relative group my-6 font-sofia">
                                <div className="inline-block bg-slate-100 shadow-xl py-3 px-4 transition duration-300 ease-in-out hover:scale-105 w-full md:w-auto">
                                    <div className="flex items-center justify-center md:justify-start space-x-2 p-4">
                                        <div className="text-navy-blue-3 flex flex-col items-center font-medium">
                                            <h1 className='border-b-[1px] border-yellow-700/30 text-gray-600 text-md font-semibold tracking-wide font-bonanova uppercase'>
                                                Event Date
                                            </h1>
                                            <div className="py-2 px-3 my-2 text-indigo-600/80 border-[1px] border-indigo-600/20 bg-indigo-600/10 text-lg font-medium transition duration-300 ease-in-out group-hover:bg-blue-700">
                                                {month}, {day}
                                            </div>
                                            <div className="text-lg text-gray-700">
                                                {year}
                                            </div>
                                            <div className="text-lg text-gray-700">
                                                {time}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='absolute -top-4 -left-3 bg-pink-700/20 rounded-full text-pink-400 border-pink-300/10 transition duration-300 ease-in-out group-hover:scale-110'>
                                    <IoIosTimer className='text-[2rem] p-2 transition duration-300 ease-in-out group-hover:animate-pulse' />
                                </div>
                            </div>
                        </section>

                        {/* Event Information Section */}
                        <section className="bg-white/10 mt-8 p-8 bg-gray-400 rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100">
                            <h2 className="text-2xl font-bold mb-6">Event Information</h2>
                            
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <Calendar className="h-8 w-8 text-pink-400  rounded-full bg-pink-400/30 p-2" />
                                    <div>
                                        <h3 className="font-medium text-lg">Date</h3>
                                        <p className="text-gray-200">{month} {day}, {year}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <Clock className="h-8 w-8 text-pink-400  rounded-full bg-pink-400/30 p-2" />
                                    <div>
                                        <h3 className="font-medium text-lg">Time</h3>
                                        <p className="text-gray-200">{time}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <MapPin className="h-8 w-8 text-pink-400  rounded-full bg-pink-400/30 p-2"  />
                                    <div>
                                        <h3 className="font-medium text-lg">Location</h3>
                                        <p className="capitalize tracking-widest text-base">{event.location}</p>
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sky-300 text-sm md:text-md hover:underline"
                                        >
                                            View on Map
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <Users className="h-8 w-8 text-pink-400  rounded-full bg-pink-400/30 p-2"  />
                                    <div>
                                        <h3 className="font-medium text-lg">Capacity</h3>
                                        <p className="text-gray-200">{event.capacity}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Tags Section */}
                        <div className="flex flex-col justify-center items-center border-[1px] border-white w-full rounded-2xl shadow-2xl mt-8 p-4 text-gray-200">
                            <div className="pb-4 px-4 md:px-8">
                                <p className="text-white font-serif text-lg font-semibold uppercase text-center">
                                    Tags
                                </p>
                                <div className="flex flex-wrap gap-2 mt-2 justify-center">
                                    {eventTags && eventTags.length > 0 ? (
                                        eventTags.map((tag) => (
                                            <span 
                                                key={tag.id} 
                                                className={`text-xs px-3 py-1 rounded-full ${
                                                    tag.type === 'venue' 
                                                        ? 'bg-blue-100 text-blue-800' 
                                                        : 'bg-green-100 text-green-800'
                                                }`}
                                            >
                                                {tag.name}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-200 italic">No tags available</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Organizer Sections - Event Planner */}
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
        </div>
    );
};

export default EventContent;