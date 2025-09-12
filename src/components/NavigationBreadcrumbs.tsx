import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface NavigationBreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const NavigationBreadcrumbs: React.FC<NavigationBreadcrumbsProps> = ({ 
  items, 
  className = '' 
}) => {
  const handleItemClick = (item: BreadcrumbItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      window.location.href = item.href;
    }
  };

  return (
    <nav className={`flex items-center space-x-1 text-sm text-gray-600 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => window.location.href = '/'}
        className="p-1 h-auto text-gray-600 hover:text-purple-600"
      >
        <Home className="w-4 h-4" />
      </Button>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleItemClick(item)}
            className="p-1 h-auto text-gray-600 hover:text-purple-600"
            disabled={index === items.length - 1}
          >
            {item.label}
          </Button>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default NavigationBreadcrumbs;