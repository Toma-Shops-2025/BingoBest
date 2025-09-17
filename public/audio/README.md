# Bingo Audio Files

## Voice Audio Files Needed

To enable voice calling of bingo numbers, you need to add MP3 files for each number (1-75) in the following directory:

```
public/audio/numbers/
```

### File Naming Convention

Name the files as follows:
- `bingo-1.mp3` (for number 1)
- `bingo-2.mp3` (for number 2)
- ...
- `bingo-75.mp3` (for number 75)

### Fallback Audio

If specific number audio files are not found, the app will fall back to:
- `public/audio/beep.mp3` (generic beep sound)

### Getting Audio Files from GitHub

If you have the 75 MP3 files in another GitHub repository, you can:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/your-other-repo.git
   ```

2. **Copy the audio files:**
   ```bash
   cp your-other-repo/audio/numbers/*.mp3 public/audio/numbers/
   ```

3. **Or download directly from GitHub:**
   - Go to the repository on GitHub
   - Navigate to the audio files
   - Download each file individually
   - Place them in `public/audio/numbers/`

### Audio Requirements

- **Format:** MP3
- **Quality:** Clear, professional voice
- **Duration:** 1-3 seconds per number
- **Volume:** Consistent across all files
- **Content:** Should say the number clearly (e.g., "B-7", "I-23", "N-35", etc.)

### Testing

Once you add the audio files, the bingo game will automatically:
- Call numbers every 2 seconds
- Play the corresponding voice audio
- Fall back to beep if voice audio is missing
