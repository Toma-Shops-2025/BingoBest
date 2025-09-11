import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, Home } from 'lucide-react';

interface BackToTopButtonProps {
  onGoHome?: () => void;
}

const BackToTopButton: React.FC<BackToTopButtonProps> = ({ onGoHome }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col gap-2">
      <Button
        onClick={scrollToTop}
        size="sm"
        className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
        title="Back to Top"
      >
        <ArrowUp className="w-4 h-4" />
      </Button>
      
      {onGoHome && (
        <Button
          onClick={onGoHome}
          size="sm"
          variant="outline"
          className="bg-white hover:bg-gray-50 text-purple-600 border-purple-200 shadow-lg"
          title="Go to Home"
        >
          <Home className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default BackToTopButton;
