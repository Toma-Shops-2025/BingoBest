import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, ChevronRight } from 'lucide-react';

interface NavigationBreadcrumbsProps {
  currentPage: string;
  onGoHome: () => void;
  onGoBack?: () => void;
}

const NavigationBreadcrumbs: React.FC<NavigationBreadcrumbsProps> = ({
  currentPage,
  onGoHome,
  onGoBack
}) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={onGoHome}
        className="flex items-center gap-1 text-purple-600 hover:text-purple-700"
      >
        <Home className="w-4 h-4" />
        Home
      </Button>
      
      <ChevronRight className="w-4 h-4" />
      
      <span className="text-gray-800 font-medium">{currentPage}</span>
      
      {onGoBack && (
        <>
          <ChevronRight className="w-4 h-4" />
          <Button
            variant="ghost"
            size="sm"
            onClick={onGoBack}
            className="text-blue-600 hover:text-blue-700"
          >
            ← Back
          </Button>
        </>
      )}
    </nav>
  );
};

export default NavigationBreadcrumbs;
