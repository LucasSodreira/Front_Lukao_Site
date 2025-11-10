import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex flex-wrap gap-2 pb-8">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.href ? (
            <Link
              to={item.href}
              className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-800 dark:text-white text-sm font-medium leading-normal">
              {item.label}
            </span>
          )}
          {index < items.length - 1 && (
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">/</span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
