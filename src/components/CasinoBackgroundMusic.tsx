import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface CasinoBackgroundMusicProps {
  enabled?: boolean;
}

const CasinoBackgroundMusic: React.FC<CasinoBackgroundMusicProps> = ({ enabled = true }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Create casino-style ambient music using Web Audio API
  const createCasinoAmbience = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      // Create multiple oscillators for rich casino sound
      const oscillators: OscillatorNode[] = [];
      const gainNodes: GainNode[] = [];

      // Base ambient tone (low frequency)
      const baseOsc = audioContext.createOscillator();
      const baseGain = audioContext.createGain();
      baseOsc.type = 'sine';
      baseOsc.frequency.setValueAtTime(60, audioContext.currentTime); // Low C
      baseGain.gain.setValueAtTime(volume * 0.1, audioContext.currentTime);
      baseOsc.connect(baseGain);
      baseGain.connect(audioContext.destination);
      oscillators.push(baseOsc);
      gainNodes.push(baseGain);

      // Mid-range ambient tone
      const midOsc = audioContext.createOscillator();
      const midGain = audioContext.createGain();
      midOsc.type = 'triangle';
      midOsc.frequency.setValueAtTime(220, audioContext.currentTime); // A3
      midGain.gain.setValueAtTime(volume * 0.05, audioContext.currentTime);
      midOsc.connect(midGain);
      midGain.connect(audioContext.destination);
      oscillators.push(midOsc);
      gainNodes.push(midGain);

      // High-frequency sparkle
      const sparkleOsc = audioContext.createOscillator();
      const sparkleGain = audioContext.createGain();
      sparkleOsc.type = 'sawtooth';
      sparkleOsc.frequency.setValueAtTime(880, audioContext.currentTime); // A5
      sparkleGain.gain.setValueAtTime(volume * 0.03, audioContext.currentTime);
      sparkleOsc.connect(sparkleGain);
      sparkleGain.connect(audioContext.destination);
      oscillators.push(sparkleOsc);
      gainNodes.push(sparkleGain);

      // Add subtle modulation for casino atmosphere
      const lfo = audioContext.createOscillator();
      const lfoGain = audioContext.createGain();
      lfo.frequency.setValueAtTime(0.1, audioContext.currentTime); // Very slow modulation
      lfoGain.gain.setValueAtTime(5, audioContext.currentTime);
      
      lfo.connect(lfoGain);
      lfoGain.connect(baseOsc.frequency);
      lfoGain.connect(midOsc.frequency);

      // Start all oscillators
      oscillators.forEach(osc => osc.start());
      lfo.start();
      
      // Store cleanup function for proper disposal
      (audioContext as any).cleanup = () => {
        oscillators.forEach(osc => {
          try {
            osc.stop();
            osc.disconnect();
          } catch (e) {
            // Already stopped
          }
        });
        gainNodes.forEach(gain => {
          try {
            gain.disconnect();
          } catch (e) {
            // Already disconnected
          }
        });
        try {
          lfo.stop();
          lfo.disconnect();
          lfoGain.disconnect();
        } catch (e) {
          // Already stopped
        }
      };

      oscillatorRef.current = oscillators[0]; // Store reference for cleanup
      gainNodeRef.current = gainNodes[0];

      return () => {
        oscillators.forEach(osc => {
          try {
            osc.stop();
          } catch (e) {
            // Oscillator might already be stopped
          }
        });
        try {
          lfo.stop();
        } catch (e) {
          // LFO might already be stopped
        }
      };
    } catch (error) {
      console.warn('Audio not available:', error);
      return () => {};
    }
  };

  const startMusic = () => {
    if (!enabled || isPlaying) return;
    
    const cleanup = createCasinoAmbience();
    setIsPlaying(true);
    
    // Store cleanup function
    (audioContextRef.current as any).cleanup = cleanup;
  };

  const stopMusic = () => {
    if (!isPlaying) return;
    
    try {
      if (audioContextRef.current && (audioContextRef.current as any).cleanup) {
        (audioContextRef.current as any).cleanup();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    } catch (error) {
      console.warn('Error stopping audio:', error);
    }
    
    setIsPlaying(false);
    audioContextRef.current = null;
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
    if (enabled) {
      // Don't auto-start music to avoid AudioContext issues
      // Music will start when user clicks the button
      return () => {
        stopMusic();
      };
    }
  }, [enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMusic();
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={toggleMusic}
        variant={isPlaying ? "default" : "outline"}
        size="sm"
        className="bg-black/80 text-white hover:bg-black/90 border-white/20"
      >
        {isPlaying ? "🎵 Music On" : "🎵 Music Off"}
      </Button>
    </div>
  );
};

export default CasinoBackgroundMusic;
