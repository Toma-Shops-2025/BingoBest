import React, { useState, useEffect, useRef } from 'react';

interface CasinoBackgroundMusicProps {
  enabled?: boolean;
}

const CasinoBackgroundMusic: React.FC<CasinoBackgroundMusicProps> = ({ enabled = true }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume] = useState(0.27); // Decreased by 10% (was 0.3)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
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
    if (!enabled || isPlaying || !hasUserInteracted) {
      return;
    }
    
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
        // Try to continue with next track
        setTimeout(() => playNextTrack(), 1000);
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
        }).catch((error) => {
          console.warn('Failed to play audio (autoplay blocked):', error);
          setIsPlaying(false);
          // Try to continue with next track
          setTimeout(() => playNextTrack(), 2000);
        });
      }
      
    } catch (error) {
      console.warn('Error starting music:', error);
      setIsPlaying(false);
    }
  };

  // Play next track in shuffle order
  const playNextTrack = () => {
    if (!enabled || !hasUserInteracted) {
      console.log('🎵 Cannot play next track - music disabled or no user interaction');
      return;
    }
    
    try {
      console.log('🎵 Playing next track in shuffle order');
      
      // Clean up any existing audio first
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('ended', playNextTrack);
        audioRef.current.removeEventListener('error', () => {});
        audioRef.current = null;
      }
      
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
      
      // Create a new audio element
      const newAudio = new Audio(tracks[nextTrackIndex]);
      newAudio.loop = false;
      newAudio.volume = volume;
      newAudio.preload = 'auto';
      
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
          setIsPlaying(true);
        }).catch((error) => {
          console.warn('Failed to play next track:', error);
          setIsPlaying(false);
          // Try to continue with next track
          setTimeout(() => playNextTrack(), 2000);
        });
      }
    } catch (error) {
      console.warn('Error playing next track:', error);
      setIsPlaying(false);
      // Try to continue with next track
      setTimeout(() => playNextTrack(), 2000);
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