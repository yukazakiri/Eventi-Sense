// cardDesign.tsx
import React from 'react';
import imagefallback from '../../../assets/images/fallback.png';

type CardProps = {
    VenueName: string;
    PlaceName: string;
    capacity: string;
    image: string;
    rating: number;
    Price: number | null;
    venueType: string[];
};

const Card: React.FC<CardProps> = ({ VenueName, PlaceName, capacity, image, rating, Price, venueType }) => {
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = imagefallback;
    };

    return (
        <div className="relative group border border-gray-400/20 overflow-hidden cursor-pointer bg-[#2F4157] w-full h-[500px] flex flex-col">
            <span
                className="absolute inset-0 bg-gradient-to-r from-navy-blue-5 to-navy-blue-5 
                                  transform -translate-y-full group-hover:translate-y-0 
                                  transition-transform duration-500 ease-in-out z-0"
            />

            {/* Image container with fixed height */}
            <div className="relative z-10 h-[250px] flex-shrink-0">
                <img
                    className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110 ease-in-out"
                    src={image || imagefallback}
                    alt={VenueName}
                    onError={handleImageError}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black  bg-opacity-20 opacity-0 transform group-hover:scale-110 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                    <span className="text-white text-lg font-sofia tracking-wide  py-2 px-4 ">View Details</span>
                </div>
            </div>

            {/* Content container with flex-grow to fill remaining space */}
            <div className="px-4 py-6 relative z-10 flex-grow flex flex-col justify-between">
                <div>
                    <div className="flex flex-wrap gap-x-4 text-[1rem] mb-2 font-sofia tracking-wide">
                        <h1 className="text-gray-500 text-xl gradient-text transition-colors duration-300 font-sofia">{VenueName},</h1>
                        <h1 className="text-white uppercase mt-1">{PlaceName}</h1>
                    </div>

                    <p className="text-gray-500 font-sofia tracking-wide text-sm group-hover:text-white transition-colors duration-300">Capacity: {capacity || 'N/A'}</p>
                    <p className="text-gray-500 font-sofia tracking-wide text-sm group-hover:text-white transition-colors duration-300 mt-2">Price-Range: {Price !== null ? Price : 'N/A'}</p>
                </div>

                <div className="mt-auto">
                    <p className="text-gray-500 font-sofia tracking-wide text-sm group-hover:text-white transition-colors duration-300 mt-2">
                        {venueType.length > 0 ? (venueType.length > 3 ? venueType.slice(0, 3).map((type, index) => (
                            <span key={index} className="inline-block group-hover:bg-yellow-600/20 border-[1px] border-gray-500 rounded-full px-3 py-1 text-sm font-thin group-hover:text-yellow-400 mr-2 mb-2">
                                {type}
                            </span>
                        )).concat(<span key="ellipsis" className="inline-block group-hover:bg-yellow-600/20  rounded-full px-3 py-1 text-sm font-semibold group-hover:text-yellow-400 mr-2 mb-2">...</span>) : venueType.map((type, index) => (
                            <span key={index} className="inline-block group-hover:bg-yellow-600/20  rounded-full px-3 py-1 text-sm font-semibold group-hover:text-yellow-400 mr-2 mb-2">
                                {type}
                            </span>
                        ))) : 'N/A'}
                    </p>

                    <div className="flex items-center mt-2">
                        {Array.from({ length: 5 }, (_, i) => (
                            <svg
                                key={i}
                                xmlns="http://www.w3.org/2000/svg"
                                fill={i < rating ? "gold" : "gray"}
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                                />
                            </svg>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;