import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface CasinoBackgroundMusicProps {
  enabled?: boolean;
}

const CasinoBackgroundMusic: React.FC<CasinoBackgroundMusicProps> = ({ enabled = true }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isAttemptingToStart, setIsAttemptingToStart] = useState(false);

  // Available casino ambient tracks
  const tracks = [
    '/audio/music/casino-ambient-01.mp3',
    '/audio/music/casino-ambient-02.mp3',
    '/audio/music/casino-ambient-03.mp3',
    '/audio/music/casino-ambient-04.mp3',
    '/audio/music/casino-ambient-05.mp3',
    '/audio/music/casino-ambient-06.mp3',
    '/audio/music/casino-ambient-07.mp3',
    '/audio/music/casino-ambient-08.mp3',
    '/audio/music/casino-ambient-09.mp3',
    '/audio/music/casino-ambient-10.mp3',
    '/audio/music/casino-ambient-11.mp3',
    '/audio/music/casino-ambient-12.mp3',
    '/audio/music/casino-ambient-13.mp3',
    '/audio/music/casino-ambient-14.mp3',
    '/audio/music/casino-ambient-15.mp3',
    '/audio/music/casino-ambient-16.mp3'
  ];

  const startMusic = () => {
    if (!enabled || isPlaying) return;
    
    setIsAttemptingToStart(true);
    
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(tracks[currentTrack]);
        audioRef.current.loop = true;
        audioRef.current.volume = volume;
        audioRef.current.preload = 'auto';
        
        // Handle track end - move to next track
        audioRef.current.addEventListener('ended', () => {
          setCurrentTrack((prev) => (prev + 1) % tracks.length);
        });
        
        // Handle errors
        audioRef.current.addEventListener('error', (e) => {
          console.warn('Audio error:', e);
          setIsAttemptingToStart(false);
          // Try next track
          setCurrentTrack((prev) => (prev + 1) % tracks.length);
        });
      }
      
      // Try to play immediately
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('🎵 Background music started successfully');
          setIsPlaying(true);
          setIsAttemptingToStart(false);
        }).catch((error) => {
          console.warn('Failed to play audio (autoplay blocked):', error);
          setIsAttemptingToStart(false);
          // Try next track after a short delay
          setTimeout(() => {
            setCurrentTrack((prev) => (prev + 1) % tracks.length);
          }, 1000);
        });
      }
    } catch (error) {
      console.warn('Error starting music:', error);
      setIsAttemptingToStart(false);
    }
  };

  const stopMusic = () => {
    if (!isPlaying || !audioRef.current) return;
    
    try {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } catch (error) {
      console.warn('Error stopping music:', error);
    }
  };

  const toggleMusic = () => {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  };

  // Auto-start music when component mounts (if enabled)
  useEffect(() => {
    if (enabled && !isPlaying) {
      console.log('🎵 Attempting to start background music automatically');
      
      // Try to start immediately
      startMusic();
      
      // If that fails, try again after a short delay
      const timer = setTimeout(() => {
        if (!isPlaying) {
          console.log('🎵 Retrying background music start');
          startMusic();
        }
      }, 500);
      
      // Also try after user interaction (click anywhere)
      const handleUserInteraction = () => {
        if (!isPlaying && enabled) {
          console.log('🎵 Starting music after user interaction');
          startMusic();
        }
      };
      
      // Add event listeners for user interaction
      document.addEventListener('click', handleUserInteraction, { once: true });
      document.addEventListener('keydown', handleUserInteraction, { once: true });
      document.addEventListener('touchstart', handleUserInteraction, { once: true });
      
      return () => {
        clearTimeout(timer);
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('keydown', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
      };
    }
  }, [enabled]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Change track when currentTrack changes
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.src = tracks[currentTrack];
      audioRef.current.play().catch((error) => {
        console.warn('Failed to play new track:', error);
      });
    }
  }, [currentTrack]);

  // Try to start music on any user interaction
  useEffect(() => {
    if (enabled && !isPlaying) {
      const handleAnyInteraction = () => {
        if (!isPlaying && enabled) {
          console.log('🎵 Starting music after any user interaction');
          startMusic();
        }
      };

      // Listen for any user interaction
      const events = ['click', 'keydown', 'touchstart', 'mousemove', 'scroll'];
      events.forEach(event => {
        document.addEventListener(event, handleAnyInteraction, { once: true, passive: true });
      });

      return () => {
        events.forEach(event => {
          document.removeEventListener(event, handleAnyInteraction);
        });
      };
    }
  }, [enabled, isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="fixed bottom-4 right-1 sm:right-4 z-50 flex flex-col gap-2">
      <Button
        onClick={toggleMusic}
        variant={isPlaying ? "default" : "outline"}
        size="sm"
        className="bg-black/80 text-white hover:bg-black/90 border-white/20"
        title={isPlaying ? "Background music is playing" : isAttemptingToStart ? "Starting music..." : "Click to start background music"}
        disabled={isAttemptingToStart}
      >
        {isPlaying ? "🎵 Music On" : isAttemptingToStart ? "🎵 Starting..." : "🎵 Music Off"}
      </Button>
      
      {isPlaying && (
        <div className="flex flex-col gap-1">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #10b981 0%, #10b981 ${volume * 100}%, #374151 ${volume * 100}%, #374151 100%)`
            }}
          />
          <button
            onClick={() => setCurrentTrack((prev) => (prev + 1) % tracks.length)}
            className="text-xs text-white/70 hover:text-white bg-black/50 px-2 py-1 rounded"
          >
            Next Track
          </button>
        </div>
      )}
    </div>
  );
};

export default CasinoBackgroundMusic;
