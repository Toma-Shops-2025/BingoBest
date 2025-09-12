import React, { createContext, useContext, useEffect, useState } from 'react';

interface SoundContextType {
  playSound: (soundName: string) => void;
  setSoundEnabled: (enabled: boolean) => void;
  isSoundEnabled: boolean;
}

const SoundContext = createContext<SoundContextType>({
  playSound: () => {},
  setSoundEnabled: () => {},
  isSoundEnabled: true
});

export const useGameSounds = () => useContext(SoundContext);

interface GameSoundsProps {
  children: React.ReactNode;
}

const GameSounds: React.FC<GameSoundsProps> = ({ children }) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  // Load sound preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('game-sounds-enabled');
    if (saved !== null) {
      setIsSoundEnabled(JSON.parse(saved));
    }
  }, []);

  const setSoundEnabled = (enabled: boolean) => {
    setIsSoundEnabled(enabled);
    localStorage.setItem('game-sounds-enabled', JSON.stringify(enabled));
  };

  const playSound = (soundName: string) => {
    if (!isSoundEnabled) return;

    try {
      // Create audio context for web audio
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Generate different sounds based on the sound name
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different frequencies for different sounds
      const frequencies = {
        'number-called': 440, // A4
        'bingo-win': 880, // A5
        'game-start': 660, // E5
        'game-end': 330, // E4
        'button-click': 220, // A3
        'error': 150, // Low frequency
        'success': 550, // C#5
        'notification': 770 // G5
      };
      
      const frequency = frequencies[soundName as keyof typeof frequencies] || 440;
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Audio not supported or disabled');
    }
  };

  const value = {
    playSound,
    setSoundEnabled,
    isSoundEnabled
  };

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
};

export default GameSounds;