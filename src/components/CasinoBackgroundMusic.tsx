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
    
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(tracks[currentTrack]);
        audioRef.current.loop = true;
        audioRef.current.volume = volume;
        
        // Handle track end - move to next track
        audioRef.current.addEventListener('ended', () => {
          setCurrentTrack((prev) => (prev + 1) % tracks.length);
        });
        
        // Handle errors
        audioRef.current.addEventListener('error', (e) => {
          console.warn('Audio error:', e);
          // Try next track
          setCurrentTrack((prev) => (prev + 1) % tracks.length);
        });
      }
      
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.warn('Failed to play audio:', error);
        // Try next track
        setCurrentTrack((prev) => (prev + 1) % tracks.length);
      });
    } catch (error) {
      console.warn('Error starting music:', error);
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
      >
        {isPlaying ? "🎵 Music On" : "🎵 Music Off"}
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
