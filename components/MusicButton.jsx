'use client'

import { Music, Volume2 } from 'lucide-react'
import { useAudio } from './AudioProvider'
import { playSound } from './useSoundEffects'

const MusicButton = () => {
  const { isPlaying, toggleAudio } = useAudio()

  const handleClick = () => {
    playSound('click', 0.3)
    toggleAudio()
  }

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 p-3 md:p-4 rounded-full bg-zinc-900/80 border border-zinc-800 hover:border-red-600 hover:bg-zinc-800 transition-all active:scale-90 backdrop-blur-sm"
      title={isPlaying ? 'Pause Music' : 'Play Music'}
    >
      {isPlaying ? (
        <Volume2 className="w-5 h-5 md:w-6 md:h-6 text-red-600 animate-pulse" />
      ) : (
        <Music className="w-5 h-5 md:w-6 md:h-6 text-zinc-500 hover:text-red-500 transition-colors" />
      )}
    </button>
  )
}

export default MusicButton
