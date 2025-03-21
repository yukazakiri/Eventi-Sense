// Breadcrumbs.jsx
import { Link } from 'react-router-dom'; // If using React Router
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

interface BreadcrumbItem {
    icon?: JSX.Element;
    label: string;
    href: string;
    
}

const Breadcrumbs = ({ items }: { items: BreadcrumbItem[] }) => {
  return (
    <nav className="my-6 font-sofia flex items-center" aria-label="Breadcrumb ">
      <ol className="flex items-center font-sofia">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-2 ">
            {index > 0 && (
              <span className="text-gray-500 ml-2 "><MdOutlineKeyboardArrowRight /></span> // Separator
            )}
            {index === items.length - 1 ? (
              <span 
                className="text-gray-800 dark:text-gray-200 font-medium text-sm" 
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="text-gray-500 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-400 transition-colors flex text-sm"
              >
                <div className='mt-[1px]'>
                  {item.icon && item.icon} 
                </div>
              
           
                  <span >{item.label}</span>
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;