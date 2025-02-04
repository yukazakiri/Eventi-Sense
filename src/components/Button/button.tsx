import React from 'react';

interface ButtonProps {
  label: string; // The text displayed on the button
  onClick?: () => void; // The function to execute when the button is clicked
  disabled?: boolean; // Optional prop to disable the button
  variant?: 'primary' | 'secondary' | 'search'| 'simple' ; // Button style variant
  gradientText?: boolean; // Optional prop to enable gradient text
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  variant = 'primary',
  gradientText = false,
}) => {
  // Style mapping for button variants (background)
  const variantStyles = {
    primary:  'bg-light-blue font-semibold text-white border-[1px] border-yellow-300 border-blue rounded-full  transition duration-300 hover:bg-gray-700', // Default background
    secondary: 'hover:border-yellow-400 border-[1px] border-blue bg-gray-700  text-white rounded-[20px] ',
    simple: ' hover:bg-gray-300  rounded-[20px] ',
    search: 'px-6 py-3  text-[1.5rem] bg-gradient-to-r from-gray-400 via-gray-600 to-blue  rounded-lg shadow-md hover:scale-105 transition-transform duration-300  ',
  };

  // Conditionally apply gradient text or solid white text
  const textStyles = gradientText
    ? 'text-transparent bg-clip-text '
    : 'text-gray-600 text-[1rem] font-semibold ';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3  ${variantStyles[variant]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } flex items-center justify-center`}
    >
      {/* Conditionally apply gradient only to text */}
      <span
        className={textStyles}
        style={
          gradientText
            ? {
                background: 'linear-gradient(to right, #aa8328 7%, #b4ab6e 37%, #e0c67d 60%, #e9c152 85%)',
                backgroundClip: 'text', // This ensures the gradient is clipped to the text
              }
            : {}
        }
      >
        {label}
      </span>
    </button>
  );
};

export default Button;
