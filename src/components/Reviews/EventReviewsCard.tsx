import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import supabase from '../../api/supabaseClient';
import { FaStar, FaUserCircle, FaRegCalendarAlt, FaRegCommentDots } from 'react-icons/fa';
import { MdRateReview } from 'react-icons/md';

interface Review {
    id: string;
    rating: number;
    review: string;
    created_at: string;
    profiles: {
        first_name: string | null;
        last_name: string | null;
        avatar_url: string | null;
    } | null;
}

// Updated to match the actual Supabase response structure
interface SupabaseReview {
    id: string;
    rating: number;
    review: string;
    created_at: string;
    profiles: {
        first_name: string | null;
        last_name: string | null;
        avatar_url: string | null;
    } | null;
}

interface EventReviewsCardProps {
    eventId: string;
}

const EventReviewsCard: React.FC<EventReviewsCardProps> = ({ eventId }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data, error } = await supabase
                    .from('reviews')
                    .select(`
                        id,
                        rating,
                        review,
                        created_at,
                        profiles (
                            first_name,
                            last_name,
                            avatar_url
                        )
                    `)
                    .eq('subject_type', 'event')
                    .eq('subject_id', eventId)
                    .order('created_at', { ascending: false });
                console.log('Fetched reviews:', data);

                if (error) throw error;

                if (data) {
                    // No need for complex transformation, just use the data as is
                    const transformedData = (data as unknown) as SupabaseReview[];
                    setReviews(transformedData);
                    
                    // Calculate average rating if there are reviews
                    if (transformedData.length > 0) {
                        const avg = transformedData.reduce((acc, curr) => acc + curr.rating, 0) / transformedData.length;
                        setAverageRating(Number(avg.toFixed(1)) || 0);
                    }
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [eventId]);

    if (loading) return (
        <div className="animate-pulse bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 h-40" >
            <div className="h-6 bg-gray-800 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-800 rounded w-2/3"></div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 mx-4 border border-gray-800 shadow-xl "    style={{
                background: `
                linear-gradient(#152131, #152131) padding-box,
                linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) border-box
                `,
                border: '1px solid transparent',
                borderRadius: '0.75rem'
            }}
        >
            <div className="flex items-center gap-3 mb-6">
                <MdRateReview className="w-6 h-6 text-pink-500" />
                <h3 className="text-xl font-bold text-white">Event Reviews</h3>
                <div className="flex-1 border-b border-gray-800"></div>
                <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full">
                    <FaStar className="text-yellow-400 w-5 h-5" />
                    <span className="text-lg font-semibold text-white">{averageRating}</span>
                    <span className="text-gray-400">({reviews.length})</span>
                </div>
            </div>

            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <motion.div 
                        key="no-reviews" 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-12 bg-gray-800/30 rounded-xl border border-gray-800/50"
                    >
                        <FaRegCommentDots className="text-gray-400 w-12 h-12 mb-4" />
                        <p className="text-gray-200 font-medium mb-1">No reviews yet</p>
                        <p className="text-gray-400 text-sm text-center max-w-xs">
                            Be the first to share your experience at this event! ✨
                        </p>
                    </motion.div>
                ) : (
                    reviews.map((review) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-gray-800/30 rounded-xl p-4 border border-gray-800/50 hover:border-gray-700/50 transition-all"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-gray-800 overflow-hidden flex-shrink-0">
                                    {review.profiles && review.profiles.avatar_url ? (
                                        <img
                                            src={review.profiles.avatar_url}
                                            alt={review.profiles.first_name || 'User'}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FaUserCircle className="w-full h-full text-gray-600" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium text-white flex items-center gap-2">
                                            {review.profiles && review.profiles.first_name && review.profiles.last_name 
                                                ? `${review.profiles.first_name} ${review.profiles.last_name}`
                                                : 'Anonymous'}
                                        </h4>
                                        <div className="flex items-center gap-1 bg-gray-800/50 px-2 py-1 rounded-lg">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <FaStar
                                                    key={`${review.id}-star-${i}`}
                                                    className={`w-3.5 h-3.5 ${
                                                        i < review.rating ? 'text-yellow-400' : 'text-gray-600'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed">{review.review}</p>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <FaRegCalendarAlt className="w-4 h-4" />
                                        <span>
                                            {new Date(review.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
};

export default EventReviewsCard;