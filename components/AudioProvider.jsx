'use client'

import { createContext, useContext, useRef, useState, useEffect } from 'react'

const AudioContext = createContext(null)

export const useAudio = () => {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider')
  }
  return context
}

export const AudioProvider = ({ children }) => {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if audio was playing before (persisted in sessionStorage)
    const wasPlaying = sessionStorage.getItem('audioPlaying') === 'true'
    if (wasPlaying && audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true)
      }).catch(() => {})
    }
  }, [])

  const toggleAudio = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      sessionStorage.setItem('audioPlaying', 'false')
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true)
        sessionStorage.setItem('audioPlaying', 'true')
      }).catch((error) => {
        console.error('Playback failed:', error)
        setIsPlaying(false)
      })
    }
  }

  return (
    <AudioContext.Provider value={{ isPlaying, toggleAudio, audioRef }}>
      {mounted && (
        <audio
          ref={audioRef}
          src="/Battle Cries of the Lost.mp3"
          loop
          preload="auto"
        />
      )}
      {children}
    </AudioContext.Provider>
  )
}
