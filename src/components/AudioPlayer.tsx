import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Music, Zap } from 'lucide-react';

interface AudioPlayerProps {
  className?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(1);
  const [volume, setVolume] = useState(0.3); // 30% volume by default
  const [showControls, setShowControls] = useState(false);
  const [playlist, setPlaylist] = useState<number[]>([]);
  const [playlistIndex, setPlaylistIndex] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const soundEffectsRef = useRef<HTMLAudioElement>(null);
  
  const totalTracks = 16; // You have 16 casino-ambient tracks
  const totalEffects = 15; // You have 15 casino-sound effects

  // Generate track and effect file paths
  const getTrackPath = (trackNumber: number) => `/audio/music/casino-ambient-${trackNumber.toString().padStart(2, '0')}.mp3`;
  const getEffectPath = (effectNumber: number) => `/audio/effects/casino-sound-${effectNumber.toString().padStart(2, '0')}.mp3`;

  // Create shuffled playlist
  const createShuffledPlaylist = () => {
    const tracks = Array.from({ length: totalTracks }, (_, i) => i + 1);
    const shuffled = [...tracks].sort(() => Math.random() - 0.5);
    setPlaylist(shuffled);
    setPlaylistIndex(0);
    return shuffled[0];
  };

  // Initialize playlist on component mount
  useEffect(() => {
    const firstTrack = createShuffledPlaylist();
    setCurrentTrack(firstTrack);
  }, []);

  // Initialize audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.loop = false; // Don't loop individual tracks
    }
    if (soundEffectsRef.current) {
      soundEffectsRef.current.volume = volume * 0.5; // Effects at 50% of music volume
    }
  }, [volume]);

  // Handle track loading
  useEffect(() => {
    if (audioRef.current) {
      const trackPath = getTrackPath(currentTrack);
      audioRef.current.src = trackPath;
      audioRef.current.loop = false; // Ensure no looping
      
      audioRef.current.addEventListener('loadeddata', () => {
        if (isPlaying) {
          audioRef.current?.play();
        }
      });

      audioRef.current.addEventListener('error', () => {
        console.log(`Failed to load track ${currentTrack}, trying next...`);
        // Try next track if current one fails
        nextTrack();
      });
    }
  }, [currentTrack, isPlaying]);

  // Play/pause toggle
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Mute/unmute toggle
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Next track (from shuffled playlist)
  const nextTrack = () => {
    if (playlist.length === 0) return;
    
    const nextIndex = (playlistIndex + 1) % playlist.length;
    setPlaylistIndex(nextIndex);
    setCurrentTrack(playlist[nextIndex]);
    
    // If we've reached the end of the playlist, create a new shuffled one
    if (nextIndex === 0 && playlistIndex === playlist.length - 1) {
      setTimeout(() => {
        createShuffledPlaylist();
      }, 1000); // Small delay to avoid immediate reshuffle
    }
  };

  // Previous track (from shuffled playlist)
  const prevTrack = () => {
    if (playlist.length === 0) return;
    
    const prevIndex = playlistIndex === 0 ? playlist.length - 1 : playlistIndex - 1;
    setPlaylistIndex(prevIndex);
    setCurrentTrack(playlist[prevIndex]);
  };

  // Play random track (shuffle playlist and play first track)
  const playRandomTrack = () => {
    const firstTrack = createShuffledPlaylist();
    setCurrentTrack(firstTrack);
  };

  // Play sound effect
  const playSoundEffect = (effectNumber: number) => {
    if (soundEffectsRef.current && !isMuted) {
      soundEffectsRef.current.src = getEffectPath(effectNumber);
      soundEffectsRef.current.play().catch(console.log);
    }
  };

  // Play random sound effect
  const playRandomEffect = () => {
    const randomEffect = Math.floor(Math.random() * totalEffects) + 1;
    playSoundEffect(randomEffect);
  };

  // Volume change
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (soundEffectsRef.current) {
      soundEffectsRef.current.volume = newVolume * 0.5;
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Main Audio Controls */}
      <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-white/20">
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePlayPause}
            className="text-white hover:bg-white/20"
          >
            {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowControls(!showControls)}
            className="text-white hover:bg-white/20"
          >
            <Music className="w-4 h-4" />
          </Button>
        </div>

        {/* Extended Controls */}
        {showControls && (
          <div className="space-y-2">
            <div className="text-xs text-white/80">
              Track {playlistIndex + 1}/{playlist.length} (Shuffled)
            </div>
            
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={prevTrack}
                className="text-white hover:bg-white/20 text-xs"
              >
                ⏮
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextTrack}
                className="text-white hover:bg-white/20 text-xs"
              >
                ⏭
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={playRandomTrack}
                className="text-white hover:bg-white/20 text-xs"
              >
                🎲
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="text-white hover:bg-white/20 text-xs"
              >
                {isMuted ? '🔇' : '🔊'}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-white/80">Vol:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs text-white/80">{Math.round(volume * 100)}%</span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={playRandomEffect}
              className="text-white hover:bg-white/20 text-xs w-full"
            >
              <Zap className="w-3 h-3 mr-1" />
              Test Sound
            </Button>
          </div>
        )}
      </div>

      {/* Audio Elements */}
      <audio
        ref={audioRef}
        preload="metadata"
        loop={false}
        onEnded={() => {
          // Auto-play next track from shuffled playlist when current ends
          nextTrack();
        }}
      />
      <audio ref={soundEffectsRef} preload="none" />
    </div>
  );
};

export default AudioPlayer;
