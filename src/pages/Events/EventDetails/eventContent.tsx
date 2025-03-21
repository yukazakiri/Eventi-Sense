import React from 'react';
import { RiMegaphoneFill } from 'react-icons/ri';
import { IoIosTimer } from "react-icons/io";
import { TiLocation } from 'react-icons/ti';
import { LuPartyPopper } from 'react-icons/lu';
import EventTags from './components/eventTags';
import { getTimeComponents } from './components/dateUtils';
import { IoPeopleSharp } from "react-icons/io5";
import { BiCategoryAlt } from "react-icons/bi";


interface EventTag {
    id: string;
    name: string;
    type: 'venue' | 'supplier';
}

interface EventContentProps {
    event: any;
    eventTags: EventTag[];  // Changed from string[] to EventTag[]
    organizer: any;
    companyProfile: any; // Add companyProfile to the props
    onOpenModal: () => void;
}

const cream = '#F9F7F2';

const EventContent: React.FC<EventContentProps> = ({ event, eventTags, organizer, companyProfile }) => {
    const { month, day, year, time } = getTimeComponents(event.date);
    const fallbackAvatarUrl = '/images/istockphoto-1207942331-612x612.jpg';
    return (
        <div style={{ backgroundColor: cream }} className="lg:pr-4">
            <main className="flex-1 px-6 md:px-8 lg:pr-4 text-slate-50">
                {/* Featured Venues Section */}
                <div className="py-12 md:py-20 mt-8 md:mt-18">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-gray-600 text-left font-sofia tracking-wide">
                            <div className='flex flex-wrap gap-2'>
                                <div className="inline-block my-4 shrink-0 rounded-full border border-pink-300/10 bg-pink-400/20">
                                    <div className="flex justify-center text-pink-400">
                                        <RiMegaphoneFill className="mt-[6px] ml-2" />
                                        <h2 className="p-1 px-2 text-sm md:text-base">Sales End Soon</h2>
                                    </div>
                                </div>
                                <div>
                                    <div className="inline-block my-4 shrink-0 rounded-full border border-indigo-300/10 bg-indigo-400/20">
                                        <div className="flex justify-center text-indigo-400 px-4 py-1">
                                            <LuPartyPopper className='mt-[2px]' />
                                            <h2 className="ml-2 text-sm md:text-base">{event.status}</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-semibold tracking-wide uppercase text-yellow-600/50 mb-2 text-left font-bonanova">
                            {event.name}
                        </h2>

                        <p className='text-gray-700 font-sofia text-base md:text-lg'>
                            Make new friends and have fun at{' '}
                            <span className="text-yellow-600/50 capitalize">{event.name}</span>.
                        </p>

                        <div className="relative group my-6 font-sofia">
                            <div className="inline-block bg-slate-50 shadow-xl py-3 px-4 transition duration-300 ease-in-out hover:scale-105 w-full md:w-auto">
                                <div className="flex items-center justify-center md:justify-start space-x-2 p-4">
                                    <div className="text-navy-blue-3 flex flex-col items-center font-medium">
                                        <h1 className='border-b-[1px] border-yellow-700/30 text-yellow-600/50 text-md font-semibold tracking-wide font-bonanova uppercase'>
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

                        <div className="w-full mt-4 font-sofia">
                            <h3 className="text-2xl md:text-3xl font-semibold font-bonanova p-2 text-yellow-600/50">Location</h3>
                            <div className='pb-6 px-2 md:px-6'>
                                <div className="flex items-center space-x-2">
                                    <TiLocation className="text-gray-700" />
                                    <p className="text-gray-700 ml-3 capitalize tracking-widest text-base md:text-lg">{event.location}</p>
                                </div>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sky-500 text-sm md:text-md hover:underline pl-6"
                                >
                                    View on Map
                                </a>
                            </div>
                        </div>

                        <div className="w-full mb-2">
                            <h3 className="text-2xl md:text-3xl font-semibold font-bonanova p-2 text-yellow-600/50">About this Event</h3>
                            <div className='pb-6 px-2 md:px-6'>
                                <p className="text-gray-700 ml-3 text-base md:text-lg">{event.description}</p>
                            </div>
                        </div>
{/* Conditionally Render Organizer Section */}
{event.organizer_type === 'event_planner' && organizer && (
  <a href={`/Event-Planner/${organizer.profile_id}/Profile`} className="w-full mb-6 cursor-pointer block">
    <div className="w-full">
      <h3 className="text-2xl md:text-3xl font-semibold font-bonanova p-2 text-yellow-600/50">Organizer</h3>
      <div className='pb-6 px-2 md:px-6 text-gray-700 '>
        <div className="group before:hover:scale-95 shadow-xl before:hover:w-80 before:hover:h-72 before:hover:rounded-b-2xl before:transition-all before:duration-500 before:content-[''] before:w-80 before:h-24 before:rounded-t-2xl before:bg-gradient-to-bl from-sky-200 via-orange-200 to-orange-700 before:absolute before:top-0 w-80 h-72 relative bg-slate-50 flex flex-col items-center justify-center gap-2 text-center rounded-2xl overflow-hidden">
          <div className="w-28 h-28 mt-8 rounded-full border-4 border-slate-50 z-10 group-hover:scale-150 group-hover:-translate-x-24 group-hover:-translate-y-20 transition-all duration-500 overflow-hidden">
            <img
              src={organizer.avatar_url || fallbackAvatarUrl}
              alt="Organizer Avatar"
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).onerror = null;
                (e.target as HTMLImageElement).src = fallbackAvatarUrl;
              }}
            />
          </div>
          <div className="z-10 group-hover:-translate-y-10 transition-all duration-500">
            <span className="text-2xl font-semibold ">{organizer.company_name}</span>
            <p>Support Specialist</p>
          </div>
          <a href={`/eventplanner/${organizer.id}`} className="bg-blue-700 px-4 py-1 text-slate-50 group-hover:text-sky-400 z-10 group-hover:scale-125 transition-all duration-500 hover:bg-sky-500/20">Visit</a>
        </div>
      </div>
    </div>
  </a>
)}

{/* Conditionally Render Company Profile Section (Venue Manager) */}
{event.organizer_type === 'venue_manager' && companyProfile && (
  <a href={`/Venue-Manager/${companyProfile.id}/Company-Profile`} className="w-full mb-6 cursor-pointer block">
    <div className="w-full">
      <h3 className="text-2xl md:text-3xl font-semibold font-bonanova p-2 text-yellow-600/50">Organizer</h3>
      <div className='pb-6 px-2 md:px-6 text-gray-700'>
        <div className="group before:hover:scale-95 shadow-xl before:hover:w-80 before:hover:h-72 before:hover:rounded-b-2xl before:transition-all before:duration-500 before:content-[''] before:w-80 before:h-24 before:rounded-t-2xl before:bg-gradient-to-bl from-sky-200 via-orange-200 to-orange-700 before:absolute before:top-0 w-80 h-72 relative bg-slate-50 flex flex-col items-center justify-center gap-2 text-center rounded-2xl overflow-hidden">
          <div className="w-28 h-28 mt-8 rounded-full border-4 border-slate-50 z-10 group-hover:scale-150 group-hover:-translate-x-24 group-hover:-translate-y-20 transition-all duration-500 overflow-hidden">
            <img
              src={companyProfile.company_logo_url || fallbackAvatarUrl}
              alt="Organizer Avatar"
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).onerror = null;
                (e.target as HTMLImageElement).src = fallbackAvatarUrl;
              }}
            />
          </div>
          <div className="z-10 group-hover:-translate-y-10 transition-all duration-500">
            <span className="text-2xl font-semibold ">{companyProfile.company_name}</span>
          </div>
          <a href={`/venue/${companyProfile.id}`} className="bg-blue-700 px-4 py-1 text-slate-50 group-hover:text-sky-400 z-10 group-hover:scale-125 transition-all duration-500 hover:bg-sky-500/20">Visit</a>
        </div>
      </div>
    </div>
  </a>
)}

{/* Conditionally Render Supplier Section */}
{event.organizer_type === 'supplier' && organizer && (
  <a href={`/supplier/${organizer.id}`} className="w-full mb-6 cursor-pointer block">
    <div className="w-full">
      <h3 className="text-2xl md:text-3xl font-semibold font-bonanova p-2 text-yellow-600/50">Organizer</h3>
      <div className='pb-6 px-2 md:px-6 text-gray-700'>
        <div className="group before:hover:scale-95 shadow-xl before:hover:w-80 before:hover:h-72 before:hover:rounded-b-2xl before:transition-all before:duration-500 before:content-[''] before:w-80 before:h-24 before:rounded-t-2xl before:bg-gradient-to-bl from-sky-200 via-orange-200 to-orange-700 before:absolute before:top-0 w-80 h-72 relative bg-slate-50 flex flex-col items-center justify-center gap-2 text-center rounded-2xl overflow-hidden">
          <div className="w-28 h-28 mt-8 rounded-full border-4 border-slate-50 z-10 group-hover:scale-150 group-hover:-translate-x-24 group-hover:-translate-y-20 transition-all duration-500 overflow-hidden">
            <img
              src={fallbackAvatarUrl}
              alt="Organizer Avatar"
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).onerror = null;
                (e.target as HTMLImageElement).src = fallbackAvatarUrl;
              }}
            />
          </div>
          <div className="z-10 group-hover:-translate-y-10 transition-all duration-500">
            <span className="text-2xl font-semibold ">{organizer.name}</span>

          </div>
          <a href={`/supplier/${organizer.id}`} className="bg-blue-700 px-4 py-1 text-slate-50 group-hover:text-sky-400 z-10 group-hover:scale-125 transition-all duration-500 hover:bg-sky-500/20">Visit</a>
        </div>
      </div>
    </div>
  </a>
)}



                        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                            <div className='w-full md:w-auto'>
                                <div className='flex flex-col justify-center items-center w-full p-4 border-[1px] border-yellow-500/20'>
                                    <div className="flex justify-center items-center p-2">
                                        <IoPeopleSharp className="text-yellow-500/40 text-2xl md:text-[2rem]" />
                                    </div>
                                    <div className='pb-4 px-4 md:px-8'>
                                        <p className="text-yellow-600/50 font-bonanova text-lg font-semibold uppercase">
                                            Capacity
                                        </p>
                                        <p className='flex justify-center items-center text-gray-700 text-base md:text-lg'>
                                            {event.capacity}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-col justify-center items-center border-[1px] border-yellow-500/20 w-full md:w-auto p-4'>
                                <div className="flex justify-center items-center p-2">
                                    <BiCategoryAlt className="text-yellow-500/40 text-2xl md:text-[2rem]" />
                                </div>
                                <div className='pb-4 px-4 md:px-8'>
                                    <p className="text-yellow-600/50 font-bonanova text-lg font-semibold uppercase">
                                        Category
                                    </p>
                                    <p className='flex justify-center items-center text-gray-700 text-base md:text-lg'>
                                        {event.category}
                                    </p>
                                </div>
                            </div>

                            <div className='flex flex-col justify-center items-center border-[1px] border-yellow-500/20 w-full md:w-auto p-4 text-gray-700'>
                                <EventTags eventTags={eventTags} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EventContent;