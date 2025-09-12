import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, Home } from 'lucide-react';

const BackToTopButton: React.FC = () => {
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

  const goHome = () => {
    window.location.href = '/';
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col gap-2">
      <Button
        onClick={scrollToTop}
        size="sm"
        className="rounded-full w-12 h-12 shadow-lg bg-purple-600 hover:bg-purple-700"
        title="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </Button>
      <Button
        onClick={goHome}
        size="sm"
        variant="outline"
        className="rounded-full w-12 h-12 shadow-lg bg-white hover:bg-gray-50"
        title="Go home"
      >
        <Home className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default BackToTopButton;