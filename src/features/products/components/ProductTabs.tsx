import { useState } from 'react';

interface ProductTab {
  title: string;
  content: React.ReactNode;
  defaultOpen?: boolean;
}

interface ProductTabsProps {
  tabs: ProductTab[];
}

const ProductTabItem: React.FC<ProductTab> = ({ title, content, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-gray-200 dark:border-gray-700">
      <details className="group py-4" open={isOpen}>
        <summary
          className="flex cursor-pointer list-none items-center justify-between font-medium text-gray-900 dark:text-white"
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(!isOpen);
          }}
        >
          <span className="text-base">{title}</span>
          <span className="transition-transform group-open:rotate-180">
            <span className="material-symbols-outlined text-base text-gray-500 dark:text-gray-400">
              expand_more
            </span>
          </span>
        </summary>
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {content}
        </div>
      </details>
    </div>
  );
};

export const ProductTabs: React.FC<ProductTabsProps> = ({ tabs }) => {
  return (
    <div className="py-16">
      {tabs.map((tab, index) => (
        <ProductTabItem
          key={index}
          title={tab.title}
          content={tab.content}
          defaultOpen={tab.defaultOpen}
        />
      ))}
    </div>
  );
};

export default ProductTabs;
