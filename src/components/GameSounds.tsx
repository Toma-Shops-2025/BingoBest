import React, { useEffect, useRef } from 'react';

interface GameSoundsProps {
  enabled: boolean;
  onNumberCalled?: () => void;
  onBingo?: () => void;
  onWin?: () => void;
  onButtonClick?: () => void;
  onError?: () => void;
}

const GameSounds: React.FC<GameSoundsProps> = ({
  enabled,
  onNumberCalled,
  onBingo,
  onWin,
  onButtonClick,
  onError
}) => {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (enabled && !audioContextRef.current) {
      // Initialize AudioContext on user interaction
      const initAudio = () => {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      };
      
      // Initialize on first user interaction
      document.addEventListener('click', initAudio, { once: true });
      document.addEventListener('keydown', initAudio, { once: true });
    }
  }, [enabled]);

  const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!enabled || !audioContextRef.current) return;

    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + duration);
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  };

  const playChord = (frequencies: number[], duration: number) => {
    if (!enabled || !audioContextRef.current) return;

    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        playTone(freq, duration);
      }, index * 50);
    });
  };

  // Sound effects
  const sounds = {
    numberCalled: () => {
      playTone(440, 0.2); // A4 note
      onNumberCalled?.();
    },
    
    bingo: () => {
      playChord([523, 659, 784], 0.5); // C-E-G chord
      onBingo?.();
    },
    
    win: () => {
      playChord([523, 659, 784, 1047], 1.0); // C-E-G-C octave
      onWin?.();
    },
    
    buttonClick: () => {
      playTone(800, 0.1, 'square');
      onButtonClick?.();
    },
    
    error: () => {
      playTone(200, 0.3, 'sawtooth');
      onError?.();
    },
    
    notification: () => {
      playTone(600, 0.2);
      playTone(800, 0.2);
    },
    
    powerUp: () => {
      playChord([440, 554, 659], 0.3); // A-C#-E chord
    },
    
    gameStart: () => {
      playChord([261, 329, 392, 523], 0.8); // C-E-G-C chord
    },
    
    gameEnd: () => {
      playChord([392, 330, 261], 1.0); // G-E-C descending
    }
  };

  // Expose sounds to parent components
  React.useImperativeHandle(React.forwardRef(() => null), () => sounds);

  return null; // This component doesn't render anything
};

export default GameSounds;
