import React, { useState, useEffect, useRef } from 'react';

interface CasinoBackgroundMusicProps {
  enabled?: boolean;
}

const CasinoBackgroundMusic: React.FC<CasinoBackgroundMusicProps> = ({ enabled = true }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume] = useState(0.3);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startMusic = async () => {
    if (!enabled || isPlaying) {
      return;
    }
    
    try {
      // Clean up any existing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      // Create a simple audio context for ambient casino sounds
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Resume audio context if suspended
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      // Create a simple ambient tone
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3 note
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume * 0.3, audioContext.currentTime + 0.5);
      
      oscillator.start();
      
      // Store reference for cleanup
      audioRef.current = {
        pause: () => {
          oscillator.stop();
          audioContext.close();
        },
        volume: volume
      } as any;
      
      setIsPlaying(true);
      console.log('🎵 Background music started (synthetic ambient)');
      
    } catch (error) {
      console.warn('Error starting music:', error);
      setIsPlaying(false);
    }
  };

  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
  };

  // Auto-start music when component mounts (if enabled)
  useEffect(() => {
    if (enabled && !isPlaying) {
      console.log('🎵 Attempting to start background music automatically');
      
      // Try to start immediately
      startMusic().catch(console.error);
      
      // If that fails, try again after user interaction
      const handleUserInteraction = () => {
        if (!isPlaying && enabled) {
          console.log('🎵 Starting music after user interaction');
          startMusic().catch(console.error);
        }
      };
      
      // Add event listeners for user interaction
      document.addEventListener('click', handleUserInteraction, { once: true });
      document.addEventListener('keydown', handleUserInteraction, { once: true });
      document.addEventListener('touchstart', handleUserInteraction, { once: true });
      
      return () => {
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('keydown', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
      };
    }
  }, [enabled, isPlaying]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return null; // This component doesn't render anything
};

export default CasinoBackgroundMusic;