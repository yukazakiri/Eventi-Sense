import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import supabase from '../../api/supabaseClient';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { GoHeartFill } from "react-icons/go";
import { MdAccessTime, MdLocationOn } from 'react-icons/md';
import { IoDownloadOutline } from "react-icons/io5";
import confetti from 'canvas-confetti'; // Import canvas-confetti

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  category: string;
}

interface Ticket {
  id: string;
  event_id: string;
  user_id: string;
  quantity: number;
  status: string;
  purchase_date: string;
}

interface Profile {
  id: string;
first_name: string;
  last_name: string;
  avatar_url: string;
  // Add other profile fields as needed
}

const TicketPage: React.FC = () => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);


  // Theme colors
  const navyBlue = "#0a2342";
  const cream = '#F9F7F2';

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const { data: ticketData, error: ticketError } = await supabase
          .from('tickets')
          .select('*')
          .eq('id', ticketId)
          .single();

        if (ticketError) throw ticketError;
        if (!ticketData) throw new Error('Ticket not found');
          // Verify ticket ownership
          const { data: { user } } = await supabase.auth.getUser();
          if (ticketData.user_id !== user?.id) {
            throw new Error('Unauthorized access to ticket');
          }
        setTicket(ticketData);

        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('id', ticketData.event_id)
          .single();

        if (eventError) throw eventError;
        setEvent(eventData);

        // Fetch profile using user_id from the ticket
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', ticketData.user_id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketData();
  }, [ticketId]);

  const handleDownload = async () => {
    const ticketElement = document.getElementById('ticket');
    if (!ticketElement) return;
  
    try {
      const canvas = await html2canvas(ticketElement, {
        useCORS: true,
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = `${event?.name}-ticket-${ticketId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
  
      // Trigger confetti using the default global canvas
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error('Error generating ticket image:', err);
    }
  };
  

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-t-gold border-navy-600 rounded-full animate-spin mb-4"></div>
        <p className="text-navy-600 font-medium">Loading your premium ticket...</p>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="max-w-lg mx-auto mt-8 p-6 bg-red-50 rounded-lg shadow">
        <h2 className="text-xl font-bold text-red-700 mb-4">Error</h2>
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-blue-800 text-white bg-red-800/80 rounded hover:bg-blue-900"
        >
          View My Tickets
        </button>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-stone-600/40 py-8 px-4 sm:py-12 flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto">
        {/* Ticket Container */}
        <div className="relative" id="ticket">
          {/* Actual ticket */}
          <div className="bg-white shadow-2xl overflow-hidden relative z-10 flex flex-col md:flex-row border-[1px] border-gray-100" 
               style={{ 
                 backgroundColor: cream,
                 boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)" 
               }}>
            
            {/* Left Section - Ticket Details */}
            <div className="w-full md:w-3/4">
              <section className='border-[1px] border-navy-blue-3/50 m-4 sm:m-6 flex sm:flex-row flex-col '>
                {/* Left sidebar */}
                <div className="block sm:w-16 w-full sm:h-auto h-16 md:w-20 bg-navy-blue-3/90">
                  <div className="h-full flex flex-col items-center justify-center">
                    <div className="transform sm:-rotate-90 -rotate-50 whitespace-nowrap">
                      <span className="text-xs md:text-sm font-sofia tracking-[10px] uppercase font-medium text-white">
                        {event?.name.substring(0, 10) || "Event"} Ticket
                      </span>
                    </div>
                  </div>
                </div>

                <section className='w-full'>
                  {/* Header */}
                  <div className="flex flex-row border-b-[1px] border-navy-blue-3/50 w-full items-center"> 
                    <div className='flex flex-col justify-center p-4 w-auto flex-auto'> 
                      <h1 className="text-xl sm:text-2xl md:text-4xl font-bonanova font-bold tracking-wide uppercase text-yellow-600/50">
                        {event?.name || "TBA"}
                      </h1>
                      <h2 className="text-xl sm:text-2xl md:text-4xl font-bonanova font-bold tracking-wide uppercase text-navy-blue-3/90">
                        {event?.category || "TBA"}
                      </h2>
                    </div>
                    <div className="relative flex justify-center items-center w-20 h-20 sm:mr-4 m-4 ">
                {/* VERIFIED BADGE */}
                <div className="absolute inset-0 w-full h-full animate-spin-slow ">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path 
                      id="textPath" 
                      d="M50,10 a40,40 0 1,1 -0.1,0" 
                      fill="none" 
                    />
                    <text className="text-xs fill-yellow-600/70">
                      <textPath href="#textPath" startOffset="0%">
                        VERIFIED • ES • VERIFIED • ES • VERIFIED • ES •
                      </textPath>
                    </text>
                  </svg>
                </div>
                
                {/* Badge container with dashed outline */}
                <div className="flex justify-center items-center  w-14 h-14">
                  <div className="outline-3 outline-offset-2 outline-double outline-yellow-600/60 rounded-full p-2 ">
                    <RiVerifiedBadgeFill className="text-3xl text-yellow-600/50 rotate-12" />
                  </div>
                </div>
              </div>
                  </div>

                  {/* Date section */}
                  <div className="flex flex-col sm:flex-row w-full border-b-[1px] border-navy-blue-3/50">
                    {/* Date Box */}
                    <div className="flex justify-center items-center border-b sm:border-b-0 sm:border-r-[1px] border-navy-blue-3/50">
                      <div className="p-4 flex flex-col items-center">
                        <div className="text-sm uppercase tracking-widest text-navy-blue-3/90 font-sofia font-semibold">
                          {new Date(event?.date || 'TBA').toLocaleString('default', { month: 'long' })}
                        </div>
                        <div className="text-3xl sm:text-4xl text-yellow-600/50 font-bold font-bonanova">
                          {new Date(event?.date || 'TBA').getDate().toString().padStart(2, '0')}
                        </div>
                      </div>
                    </div>

                    {/* Time & Location */}
                    <div className="flex-grow p-4 font-sofia">
                      <div className="text-xs uppercase tracking-wider text-gray-600 font-sofia mb-1">Time & Location</div>
                      <div className="flex items-center mb-2">
                        <MdAccessTime className="h-4 w-4 mr-1 text-yellow-600/50" />
                        <div className="text-sm font-medium" style={{ color: navyBlue }}>
                          {new Date(event?.date || 'TBA').toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <MdLocationOn className="h-4 w-4 mr-1 text-yellow-600/50" />
                        <div className="text-sm font-medium" style={{ color: navyBlue }}>
                          {event?.location || "TBA"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ticket holder info */}
                  <div className="flex flex-col sm:flex-row border-b-[1px] border-navy-blue-3/50 w-full">
                    <div className="flex flex-col flex-grow p-4 justify-center">
                      <div className="text-xs uppercase tracking-wider text-gray-600 font-sofia mb-1">Ticket Holder</div>
                      <div className="text-lg font-semibold tracking-widest uppercase text-navy-blue-3/90 font-sofia">
                        {profile?.first_name || "John"} {profile?.last_name || "Doe"}
                      </div>
                    </div>
                    <div className='p-4 flex flex-col justify-center items-center border-t sm:border-t-0 sm:border-l-[1px] border-navy-blue-3/50'>
                      <div className="text-xs uppercase tracking-wider text-gray-600 font-sofia mb-1">Quantity</div>
                      <div className="text-xl font-bold tracking-widest uppercase text-navy-blue-3/90 font-sofia">
                        {ticket?.quantity || "TBA"}
                      </div>
                      <div className="text-sm font-semibold tracking-widest uppercase text-navy-blue-3/90 font-sofia">
                        only
                      </div>
                    </div>
                  </div>

                  {/* Ticket details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 border-b-[1px] border-navy-blue-3/50">
                    <div className='p-4 sm:border-r border-navy-blue-3/50'>
                      <div className="text-xs uppercase tracking-wider text-gray-600 font-sofia mb-1">Ticket ID</div>
                      <div className="text-sm font-medium font-sofia" style={{ color: navyBlue }}>
                        {ticket?.id?.slice(0, 12) || "TBA"}
                      </div>
                    </div>
                    
                    <div className='p-4'>
                      <div className="text-xs uppercase tracking-wider text-gray-600 font-sofia mb-1">Purchased</div>
                      <div className="text-sm font-medium font-sofia" style={{ color: navyBlue }}>
                        {new Date(ticket?.purchase_date || 'TBA').toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Fine print */}
                  <div className="p-4 font-sofia tracking-wide text-xs text-gray-500 text-center">
                    This ticket is non-transferable and must be presented at entrance. ID may be required.
                  </div>
                </section>
              </section>
            </div>

            {/* Right Section - QR Code */}
            <div className="w-full md:w-1/4 flex flex-col items-center justify-center p-4 sm:p-6 border-t-2 md:border-t-0 md:border-l-[3px] border-yellow-600/50 border-dashed">
              <div className="text-center mb-2">
                <div className="text-2xl md:text-3xl font-bonanova font-bold tracking-wide uppercase text-navy-blue-3/90">RSVP</div>
                <div className="p-2 font-sofia tracking-wide text-xs text-gray-500">Scan to check in</div>
              </div>
              
              <QRCodeSVG
                value={ticket?.id || 'TBA'} 
                size={window.innerWidth < 768 ? 100 : 120}
                level="H"
                bgColor={cream}
                fgColor={navyBlue}
              />
              
              <div className="w-16 h-16 mt-2 flex justify-center items-center">
                <div className="outline-1 outline-offset-2 outline-dotted outline-yellow-600/60 rounded-full p-2">
                  <GoHeartFill className='text-yellow-500/60'/>
                </div>
              </div>
              
              <div className="text-xs text-center font-sofia uppercase mt-2" style={{ color: navyBlue }}>
                Official
              </div>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="mt-8 sm:mt-12 flex justify-center">
          <button
            onClick={handleDownload}
            className="px-6 py-2 sm:px-8 sm:py-3 rounded-sm flex items-center gap-2 transition-all transform hover:translate-y-px shadow-lg bg-navy-blue-3 text-white font-sofia text-sm sm:text-base"
          >
            <IoDownloadOutline className="text-yellow-500/80 text-xl sm:text-2xl" />
            Download Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketPage;