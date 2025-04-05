// OrganizerCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface OrganizerCardProps {
  title: string;
  name: string;
  imageUrl: string;
  fallbackImageUrl: string;
  subtitle?: string;
  profileUrl: string;
}

const OrganizerCard: React.FC<OrganizerCardProps> = ({
  title,
  name,
  imageUrl,
  fallbackImageUrl,
  subtitle,
  profileUrl
}) => {
  return (
    <div>
    <Link to={profileUrl}>
     
    <div  className="w-full mb-6 cursor-pointer block mt-6">
      <div className="w-full">
        <h3 className="text-2xl md:text-3xl font-semibold font-bonanova p-2 text-white">
          {title}
        </h3>
        <div className='pb-6 px-2 md:px-6 text-gray-700'>
          <div className="group before:hover:scale-95 shadow-xl before:hover:w-80 before:hover:h-72 before:hover:rounded-b-2xl before:transition-all before:duration-500 before:content-[''] before:w-80 before:h-24 
          before:rounded-t-2xl before:bg-gradient-to-bl from-sky-200 via-sky-200 to-sky-700 before:absolute before:top-0 w-80 h-72 relative bg-slate-50 flex flex-col items-center justify-center 
          gap-2 text-center rounded-2xl overflow-hidden">
            <div className="w-28 h-28 mt-8 rounded-full border-4 border-slate-50 z-10 group-hover:scale-150 group-hover:-translate-x-24 group-hover:-translate-y-20 transition-all duration-500 overflow-hidden">
              <img
                src={imageUrl || fallbackImageUrl}
                alt="Organizer Avatar"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).onerror = null;
                  (e.target as HTMLImageElement).src = fallbackImageUrl;
                }}
              />
            </div>
            <div className="z-10 group-hover:-translate-y-10 transition-all duration-500">
              <span className="text-2xl font-semibold">{name}</span>
              {subtitle && <p>{subtitle}</p>}
            </div>
            <div>
            <button
           
              className="bg-blue-700 px-4 py-1 text-slate-50 group-hover:text-white-400 z-10 group-hover:scale-125 transition-all duration-500 hover:bg-sky-500/20"
            >
              Visit
            </button></div>
          </div>
        </div>
      </div>
    </div>
    </Link></div>
  );
};

export default OrganizerCard;