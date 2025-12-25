'use client'

// Sound effect URLs - using base64 encoded short sounds for reliability
const sounds = {
  hover: '/sounds/hover.mp3',
  click: '/sounds/click.mp3', 
  success: '/sounds/success.mp3',
  navigate: '/sounds/navigate.mp3',
  select: '/sounds/select.mp3',
  typing: '/sounds/typing.mp3',
}

// Fallback to web URLs if local files don't exist
const fallbackSounds = {
  hover: 'https://www.soundjay.com/buttons/sounds/button-09a.mp3',
  click: 'https://www.soundjay.com/buttons/sounds/button-16.mp3',
  success: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
  navigate: 'https://www.soundjay.com/buttons/sounds/button-30.mp3',
  select: 'https://www.soundjay.com/buttons/sounds/button-21.mp3',
  typing: 'https://www.soundjay.com/mechanical/sounds/typewriter-key-1.mp3',
}

export const playSound = (soundName, volume = 0.3) => {
  if (typeof window === 'undefined') return
  
  try {
    const soundUrl = fallbackSounds[soundName] || sounds[soundName]
    if (!soundUrl) return

    const audio = new Audio(soundUrl)
    audio.volume = volume
    audio.play().catch(() => {
      // Try fallback if primary fails
      if (sounds[soundName] && fallbackSounds[soundName]) {
        const fallbackAudio = new Audio(fallbackSounds[soundName])
        fallbackAudio.volume = volume
        fallbackAudio.play().catch(() => {})
      }
    })
  } catch (e) {
    // Silently fail
  }
}

// Preload sounds
export const preloadSounds = () => {
  if (typeof window === 'undefined') return
  
  Object.values(fallbackSounds).forEach((url) => {
    const audio = new Audio()
    audio.preload = 'auto'
    audio.src = url
  })
}

export default { playSound, preloadSounds }
