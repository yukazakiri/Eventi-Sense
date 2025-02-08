// Breadcrumbs.jsx
import { Link } from 'react-router-dom'; // If using React Router

interface BreadcrumbItem {
    icon?: JSX.Element;
    label: string;
    href: string;
    
}

const Breadcrumbs = ({ items }: { items: BreadcrumbItem[] }) => {
  return (
    <nav className="mb-8 font-sofia flex items-center" aria-label="Breadcrumb ">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center">
            {index > 0 && (
              <span className="text-gray-400 mx-2">&#62;</span> // Separator
            )}
            {index === items.length - 1 ? (
              <span 
                className="text-gray-600 font-medium text-[1rem]" 
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="text-indigo-600 hover:text-indigo-800 transition-colors flex text-[1rem]"
              >
                <div className='mt-[2px] text-[2rem]'>
                  {item.icon && item.icon} 
                </div>
              
           
             <span>{item.label}</span>
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;