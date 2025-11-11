import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
  active?: boolean;
}

interface CheckoutBreadcrumbProps {
  items: BreadcrumbItem[];
}

export const CheckoutBreadcrumb: React.FC<CheckoutBreadcrumbProps> = ({ items }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.path ? (
            <Link
              to={item.path}
              className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-primary"
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={`text-sm font-${item.active ? 'bold' : 'medium'} ${
                item.active
                  ? 'text-[#0e121b] dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {item.label}
            </span>
          )}
          {index < items.length - 1 && (
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">/</span>
          )}
        </div>
      ))}
    </div>
  );
};
