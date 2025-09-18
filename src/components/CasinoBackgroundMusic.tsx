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
    if (!enabled || isPlaying || isAttemptingToStart) {
      console.log('🎵 Music start blocked - enabled:', enabled, 'isPlaying:', isPlaying, 'isAttemptingToStart:', isAttemptingToStart);
      return;
    }
    
    setIsAttemptingToStart(true);
    console.log('🎵 Starting music - single instance');
    
    try {
      // Clean up any existing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      // Get current track from shuffle order
      const trackIndex = shuffleOrder.length > 0 ? shuffleOrder[shuffleIndex] : currentTrack;
      const audioUrl = tracks[trackIndex];
      console.log('🎵 Loading audio:', audioUrl);
      
      audioRef.current = new Audio(audioUrl);
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
        console.warn('Failed to load audio file:', audioUrl);
        setIsAttemptingToStart(false);
        setIsPlaying(false);
        // Don't automatically try next track to avoid loops
      });
      
      // Handle successful load
      audioRef.current.addEventListener('canplaythrough', () => {
        console.log('🎵 Audio file loaded successfully:', audioUrl);
      });
      
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
          setIsPlaying(false);
          // Don't automatically try next track to avoid loops
        });
      }
    } catch (error) {
      console.warn('Error starting music:', error);
      setIsAttemptingToStart(false);
      setIsPlaying(false);
    }
  };

  // Play next track in shuffle order
  const playNextTrack = () => {
    if (!audioRef.current || isAttemptingToStart) {
      console.log('🎵 Cannot play next track - no audio ref or already attempting to start');
      return;
    }
    
    try {
      console.log('🎵 Playing next track in shuffle order');
      
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
      
      // Create a new audio element to avoid conflicts
      const newAudio = new Audio(tracks[nextTrackIndex]);
      newAudio.loop = false;
      newAudio.volume = volume;
      newAudio.preload = 'auto';
      
      // Clean up old audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      // Set new audio reference
      audioRef.current = newAudio;
      
      // Add event listeners
      audioRef.current.addEventListener('ended', () => {
        console.log('🎵 Track ended, moving to next track in shuffle');
        playNextTrack();
      });
      
      audioRef.current.addEventListener('error', (e) => {
        console.warn('Audio error:', e);
        console.warn('Failed to load audio file:', tracks[nextTrackIndex]);
        // Try to continue with next track
        setTimeout(() => playNextTrack(), 1000);
      });
      
      // Play the next track
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log(`🎵 Playing track ${nextTrackIndex + 1}/${tracks.length}: ${tracks[nextTrackIndex]}`);
        }).catch((error) => {
          console.warn('Failed to play next track:', error);
          // Try to continue with next track
          setTimeout(() => playNextTrack(), 1000);
        });
      }
    } catch (error) {
      console.warn('Error playing next track:', error);
      // Try to continue with next track
      setTimeout(() => playNextTrack(), 1000);
    }
  };


  // Auto-start music when component mounts (if enabled)
  useEffect(() => {
    if (enabled && !isPlaying && !isAttemptingToStart) {
      console.log('🎵 Attempting to start background music automatically');
      
      // Try to start immediately
      startMusic();
      
      // If that fails, try again after a short delay
      const timer = setTimeout(() => {
        if (!isPlaying && !isAttemptingToStart) {
          console.log('🎵 Retrying background music start');
          startMusic();
        }
      }, 500);
      
      // Also try after user interaction (click anywhere)
      const handleUserInteraction = () => {
        if (!isPlaying && !isAttemptingToStart && enabled) {
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
  }, [enabled, isPlaying, isAttemptingToStart]);

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
    if (enabled && !isPlaying && !isAttemptingToStart) {
      const handleAnyInteraction = () => {
        if (!isPlaying && !isAttemptingToStart && enabled) {
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
  }, [enabled, isPlaying, isAttemptingToStart]);

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
