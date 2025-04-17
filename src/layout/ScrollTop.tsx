import { useState, useEffect } from 'react';
import { IoIosArrowUp } from 'react-icons/io'; // Import the arrow icon

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show the button when the user scrolls down 300px
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to the top of the page smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Add a scroll event listener when the component mounts
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-28 right-8 p-3 bg-navy-blue-1 hover:bg-yellow-500 text-white rounded-full shadow-lg transition-opacity duration-300 z-40 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-label="Scroll to top"
    >
      <IoIosArrowUp className="h-6 w-6 " /> {/* Use the arrow icon */}
    </button>
  );
};

export default ScrollToTopButton;