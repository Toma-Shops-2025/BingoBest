import React, { useState, useEffect, useRef } from 'react';

interface CasinoBackgroundMusicProps {
  enabled?: boolean;
}

const CasinoBackgroundMusic: React.FC<CasinoBackgroundMusicProps> = ({ enabled = true }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume] = useState(0.3);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const startMusic = () => {
    if (!enabled || isPlaying || !hasUserInteracted) {
      return;
    }
    
    try {
      // Clean up any existing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      // Create a simple audio element with a data URL for a silent audio
      // This is a workaround for autoplay restrictions
      const silentAudio = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
      
      audioRef.current = new Audio(silentAudio);
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
      audioRef.current.muted = false;
      
      // Try to play the silent audio to unlock audio context
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('🎵 Audio context unlocked');
          // Now create a simple ambient sound using Web Audio API
          createAmbientSound();
        }).catch((error) => {
          console.warn('Failed to unlock audio context:', error);
          // Fallback: just try to create ambient sound anyway
          createAmbientSound();
        });
      }
      
    } catch (error) {
      console.warn('Error starting music:', error);
      setIsPlaying(false);
    }
  };

  const createAmbientSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create a simple ambient tone
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Create a more pleasant ambient sound
      oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3 note
      oscillator.type = 'sine';
      
      // Fade in slowly
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume * 0.1, audioContext.currentTime + 2);
      
      oscillator.start();
      
      // Store reference for cleanup
      if (audioRef.current) {
        audioRef.current.pause = () => {
          oscillator.stop();
          audioContext.close();
        };
      }
      
      setIsPlaying(true);
      console.log('🎵 Background music started (ambient tone)');
      
    } catch (error) {
      console.warn('Error creating ambient sound:', error);
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

  // Handle user interaction to unlock audio
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!hasUserInteracted) {
        setHasUserInteracted(true);
        console.log('🎵 User interaction detected - audio unlocked');
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
  }, [hasUserInteracted]);

  // Auto-start music when user has interacted
  useEffect(() => {
    if (enabled && hasUserInteracted && !isPlaying) {
      console.log('🎵 Starting background music after user interaction');
      startMusic();
    }
  }, [enabled, hasUserInteracted, isPlaying]);

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