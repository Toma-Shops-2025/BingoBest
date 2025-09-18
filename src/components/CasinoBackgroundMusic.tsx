import React, { useState, useEffect, useRef } from 'react';

interface CasinoBackgroundMusicProps {
  enabled?: boolean;
}

const CasinoBackgroundMusic: React.FC<CasinoBackgroundMusicProps> = ({ enabled = true }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume] = useState(0.3);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isAttemptingToStart, setIsAttemptingToStart] = useState(false);
  const [shuffleOrder, setShuffleOrder] = useState<number[]>([]);
  const [shuffleIndex, setShuffleIndex] = useState(0);

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

  // Create shuffled playlist
  const createShuffleOrder = () => {
    const order = Array.from({ length: tracks.length }, (_, i) => i);
    // Fisher-Yates shuffle algorithm
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
  };

  // Initialize shuffle order on component mount
  useEffect(() => {
    if (shuffleOrder.length === 0) {
      setShuffleOrder(createShuffleOrder());
    }
  }, []);

  const startMusic = () => {
    if (!enabled || isPlaying) return;
    
    setIsAttemptingToStart(true);
    
    try {
      if (!audioRef.current) {
        // Get current track from shuffle order
        const trackIndex = shuffleOrder.length > 0 ? shuffleOrder[shuffleIndex] : currentTrack;
        audioRef.current = new Audio(tracks[trackIndex]);
        audioRef.current.loop = false; // Don't loop individual tracks
        audioRef.current.volume = volume;
        audioRef.current.preload = 'auto';
        
        // Handle track end - move to next track in shuffle order
        audioRef.current.addEventListener('ended', () => {
          console.log('🎵 Track ended, moving to next track in shuffle');
          playNextTrack();
        });
        
        // Handle errors
        audioRef.current.addEventListener('error', (e) => {
          console.warn('Audio error:', e);
          setIsAttemptingToStart(false);
          // Try next track
          playNextTrack();
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
            playNextTrack();
          }, 1000);
        });
      }
    } catch (error) {
      console.warn('Error starting music:', error);
      setIsAttemptingToStart(false);
    }
  };

  // Play next track in shuffle order
  const playNextTrack = () => {
    if (!audioRef.current) return;
    
    try {
      // Move to next track in shuffle order
      let nextShuffleIndex = (shuffleIndex + 1) % shuffleOrder.length;
      let currentShuffleOrder = shuffleOrder;
      
      // If we've played all tracks, create a new shuffle order
      if (nextShuffleIndex === 0) {
        console.log('🎵 Played all tracks, creating new shuffle order');
        currentShuffleOrder = createShuffleOrder();
        setShuffleOrder(currentShuffleOrder);
        setShuffleIndex(0);
        nextShuffleIndex = 0;
      } else {
        setShuffleIndex(nextShuffleIndex);
      }
      
      // Get the next track from the shuffle order
      const nextTrackIndex = currentShuffleOrder[nextShuffleIndex];
      setCurrentTrack(nextTrackIndex);
      
      // Update the audio source
      audioRef.current.src = tracks[nextTrackIndex];
      audioRef.current.currentTime = 0;
      
      // Play the next track
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log(`🎵 Playing track ${nextTrackIndex + 1}/${tracks.length}: ${tracks[nextTrackIndex]}`);
        }).catch((error) => {
          console.warn('Failed to play next track:', error);
          // Try the track after that
          setTimeout(() => playNextTrack(), 1000);
        });
      }
    } catch (error) {
      console.warn('Error playing next track:', error);
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
      const trackIndex = shuffleOrder.length > 0 ? shuffleOrder[shuffleIndex] : currentTrack;
      audioRef.current.src = tracks[trackIndex];
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        console.warn('Failed to play new track:', error);
      });
    }
  }, [currentTrack, shuffleIndex, shuffleOrder, isPlaying]);

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

  // Return null - no visible controls
  return null;
};

export default CasinoBackgroundMusic;
