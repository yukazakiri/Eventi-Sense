import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import supabase from '../../api/supabaseClient'; // Adjust path as needed
import { FaHeart, FaStar } from 'react-icons/fa';

interface EventReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    eventId: string;
    currentUserId: string;
    eventName?: string;
}

const EventReviewModal: React.FC<EventReviewModalProps> = ({
    isOpen,
    onClose,
    eventId,
    currentUserId,
    eventName = 'this event'
}) => {
    const [rating, setRating] = useState<number>(0);
    const [review, setReview] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setRating(0);
            setReview('');
            setError('');
            setSuccess(false);
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!eventId) return;
        
        setLoading(true);
        setError('');

        try {
            const { error } = await supabase.from('reviews').insert({
                subject_type: 'event',
                subject_id: eventId,
                reviewer_profile_id: currentUserId,
                rating,
                review,
            });

            if (error) throw error;

            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000); // Close modal after 2 seconds
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    const modalVariants = {
        hidden: { 
            opacity: 0, 
            scale: 0.9,
            x: "-50%", 
            y: "-50%" 
        },
        visible: { 
            opacity: 1, 
            scale: 1,
            x: "-50%",
            y: "-50%",
            transition: { 
                type: "spring", 
                stiffness: 300, 
                damping: 25 
            } 
        },
        exit: { 
            opacity: 0, 
            scale: 0.9,
            transition: { duration: 0.2 } 
        }
    };

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    const successVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } },
        exit: { opacity: 0, transition: { duration: 0.5 } }
    };

    const quickComments = [
        "Great event! Would definitely attend again!",
        "Well organized and enjoyable experience",
        "Amazing atmosphere and friendly people",
        "Good value for money",
        "Excellent service and venue",
        "Good event, but needs some improvements in organization"
    ];

    // Add after other state declarations
    const [hasReviewed, setHasReviewed] = useState<boolean>(false);

    // Add after the existing useEffect
    useEffect(() => {
        if (isOpen && eventId && currentUserId) {
            const checkExistingReview = async () => {
                const { data, error } = await supabase
                    .from('reviews')
                    .select('id')
                    .eq('subject_type', 'event')
                    .eq('subject_id', eventId)
                    .eq('reviewer_profile_id', currentUserId)
                    .maybeSingle(); // Changed to maybeSingle
    
                if (error) {
                    console.error('Error checking review:', error);
                    return;
                }
    
                setHasReviewed(!!data);
            };
    
            checkExistingReview();
        }
    }, [isOpen, eventId, currentUserId]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/40 backdrop-blur-md z-40"
                        onClick={onClose}
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    />

                    <motion.div
                        className="fixed left-1/2 top-1/2 z-50 w-full max-w-xl"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div className="border border-gray-700/50 shadow-2xl rounded-2xl p-8 backdrop-blur-xl bg-opacity-95 font-sofia" style={{
                            background: `
                                linear-gradient(#152131, #152131) padding-box,
                                linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) border-box
                            `,
                            border: '1px solid transparent',
                            borderRadius: '0.75rem'
                        }}>
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-bold font-bonanova capitalize tracking-tight text-white">Review <span className='gradient-text uppercase text-2xl'>{eventName}</span></h3>
                                <button 
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-full"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <AnimatePresence>
                                {success ? (
                                    <motion.div 
                                        className="text-center py-12"
                                        variants={successVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                    >
                                        <div className="flex items-center justify-center gap-4 mb-8">
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.2 }}
                                                className="p-3 rounded-full bg-pink-500/20"
                                            >
                                                <FaHeart className="h-8 w-8 text-pink-500" />
                                            </motion.div>
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.3 }}
                                                className="p-3 rounded-full bg-green-500/20"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </motion.div>
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.4 }}
                                                className="p-3 rounded-full bg-yellow-500/20"
                                            >
                                                <FaStar className="h-8 w-8 text-yellow-500" />
                                            </motion.div>
                                        </div>
                                        <motion.h4 
                                            className="text-2xl font-semibold text-white mb-3"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            Awesome! Thank You! 🎉
                                        </motion.h4>
                                        <motion.p 
                                            className="text-gray-300 text-lg"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6 }}
                                        >
                                            Your valuable feedback helps make our events even better! 
                                            <span className="block mt-2 text-pink-400">We appreciate you taking the time!</span>
                                        </motion.p>
                                    </motion.div>
                                ) : hasReviewed ? (
                                    <motion.div
                                        key="already-reviewed"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="text-center space-y-6 py-8"
                                    >
                                        <div className="flex justify-center">
                                            <div className="p-4 rounded-full bg-green-500/20">
                                                <svg 
                                                    xmlns="http://www.w3.org/2000/svg" 
                                                    className="h-12 w-12 text-green-400" 
                                                    fill="none" 
                                                    viewBox="0 0 24 24" 
                                                    stroke="currentColor"
                                                >
                                                    <path 
                                                        strokeLinecap="round" 
                                                        strokeLinejoin="round" 
                                                        strokeWidth={2} 
                                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        <h4 className="text-xl font-semibold text-white">
                                            Review Already Submitted!
                                        </h4>
                                        <p className="text-gray-300">
                                            You've already shared your feedback for {eventName}.<br />
                                            Thank you for helping us improve! 💖
                                        </p>
                                        <button
                                            onClick={onClose}
                                            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors font-medium"
                                        >
                                            Close Window
                                        </button>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        {/* User comment added here */}
                                        <div className="text-center space-y-2 mb-6">
                                            <p className="text-lg text-gray-200">
                                                How was your experience at <span className="gradient-text font-semibold">{eventName}</span>? 
                                            </p>
                                            <p className="text-gray-400 text-sm">
                                                Your feedback means a lot to us and helps create even better events! ✨
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-gray-300 text-sm font-medium mb-4">Your Rating</label>
                                            <div className="flex justify-center gap-4">
                                                {Array.from({ length: 5 }, (_, i) => i + 1).map((num) => (
                                                    <motion.button
                                                        key={num}
                                                        type="button"
                                                        onClick={() => setRating(num)}
                                                        initial={{ scale: 0.8 }}
                                                        animate={{ scale: 1 }}
                                                        exit={{ scale: 0.8 }}
                                                        className={`h-14 w-14 rounded-xl flex items-center justify-center ${
                                                            rating >= num ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-gray-300'
                                                        } hover:bg-yellow-400 hover:text-gray-900 transition-all transform hover:scale-105 text-lg font-medium shadow-lg`}
                                                        aria-label={`Rate ${num} stars`}
                                                    >
                                                        {num}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-gray-300 text-sm font-medium mb-3">Quick Comments</label>
                                            <div className="flex flex-wrap gap-2 mb-4 ">
                                                {quickComments.map((comment, index) => (
                                                    <motion.button
                                                        key={index}
                                                        type="button"
                                                        onClick={() => setReview(comment)}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className={`px-3 py-1.5 rounded-lg text-xs ${
                                                            review === comment 
                                                                ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' 
                                                                : 'bg-gray-800/50 text-gray-300 border border-gray-700/30 hover:bg-gray-800'
                                                        } transition-all duration-200`}
                                                    >
                                                        {comment}
                                                    </motion.button>
                                                ))}
                                            </div>
                                            <textarea
                                                value={review}
                                                onChange={(e) => setReview(e.target.value)}
                                                className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow shadow-sm hover:shadow-md resize-none"
                                                rows={4}
                                                placeholder="Or write your own review..."
                                                required
                                            />
                                        </div>

                                        {error && <p className="text-red-400 text-center py-2 bg-red-400/10 rounded-lg">{error}</p>}

                                        <div className="flex gap-4 pt-4">
                                            <motion.button
                                                type="button"
                                                onClick={onClose}
                                                className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-all transform hover:scale-[1.02] font-medium"
                                            >
                                                Cancel
                                            </motion.button>
                                            <motion.button
                                                type="submit"
                                                disabled={loading || rating === 0}
                                                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-medium"
                                            >
                                                {loading ? 'Submitting...' : 'Submit Review'}
                                            </motion.button>
                                        </div>
                                    </form>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default EventReviewModal;