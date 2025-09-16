import { useRef } from 'react';

interface SoundEffects {
  playDiceRoll: () => void;
  playWin: () => void;
  playButtonClick: () => void;
  playCardFlip: () => void;
  playJackpot: () => void;
  playRandom: () => void;
}

export const useSoundEffects = (): SoundEffects => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const playSound = (effectNumber: number) => {
    if (audioRef.current) {
      const effectPath = `/audio/effects/casino-sound-${effectNumber.toString().padStart(2, '0')}.mp3`;
      audioRef.current.src = effectPath;
      audioRef.current.volume = 0.3; // 30% volume for effects
      audioRef.current.play().catch(console.log);
    }
  };

  const playRandomEffect = () => {
    const randomEffect = Math.floor(Math.random() * 15) + 1; // 15 total effects
    playSound(randomEffect);
  };

  return {
    playDiceRoll: () => playSound(1), // Use first few effects for dice
    playWin: () => playSound(5), // Use middle effects for wins
    playButtonClick: () => playSound(3), // Use early effects for clicks
    playCardFlip: () => playSound(7), // Use middle effects for card flips
    playJackpot: () => playSound(15), // Use last effects for jackpots
    playRandom: playRandomEffect,
  };
};

// Create a global audio element for sound effects
export const createSoundEffectsAudio = () => {
  if (typeof window !== 'undefined') {
    const audio = document.createElement('audio');
    audio.preload = 'none';
    document.body.appendChild(audio);
    return audio;
  }
  return null;
};
