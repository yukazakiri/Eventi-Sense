import React from 'react';


// Review card component
type ReviewCardProps = {
  name: string;
  rating: number;
  review: string;
};

const ReviewCard: React.FC<ReviewCardProps> = ({ name, rating, review }) => {
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-4">
        {/* User avatar */}
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
          {name[0]}
        </div>
        {/* User name and rating */}
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          <div className="flex items-center">
            {Array.from({ length: 5 }, (_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={i < rating ? "gold" : "gray"}
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
      {/* Review text */}
      <p className="text-gray-600">{review}</p>
    </div>
  );
};

// Review section component
const ReviewSection: React.FC = () => {
  const reviews = [
    {
      name: "John Doe",
      rating: 5,
      review: "Absolutely loved the service! The team was professional and delivered beyond my expectations.",
    },
    {
      name: "Jane Smith",
      rating: 4,
      review: "Great experience overall. The only downside was the slight delay in delivery, but the quality was top-notch.",
    },
    {
      name: "Alice Johnson",
      rating: 5,
      review: "Incredible attention to detail. I would highly recommend them to anyone looking for quality work.",
    },
    {
      name: "Bob Brown",
      rating: 3,
      review: "Good service, but I felt the pricing was a bit high for what was offered.",
    },
    {
      name: "Charlie Davis",
      rating: 5,
      review: "Fantastic experience from start to finish. Will definitely use their services again!",
    },
    {
      name: "Eve Wilson",
      rating: 4,
      review: "Very satisfied with the results. The team was responsive and easy to work with.",
    },
  ];

  return (
    <section className="pb-12">
      <div className="container mx-auto px-4">
        {/* Section title */}
        <h2 className="text-4xl font-bold text-center py-[5rem] gradient-text flex justify-center">
          What Our Customers Say
        </h2>
        {/* Review cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className={index >= 3 ? "hidden sm:block" : ""} // Hide cards 4-6 on small screens
            >
              <ReviewCard {...review} />
            </div>
          ))}
        </div>
       
      </div>
    </section>
  );
};

export default ReviewSection;