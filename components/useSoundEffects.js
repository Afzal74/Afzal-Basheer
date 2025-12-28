'use client'

// Free sound effects from reliable CDNs
const fallbackSounds = {
  hover: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  navigate: 'https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3',
  select: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  typing: 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3',
  // Game sounds
  flap: 'https://assets.mixkit.co/active_storage/sfx/2073/2073-preview.mp3',
  score: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
  hit: 'https://assets.mixkit.co/active_storage/sfx/2001/2001-preview.mp3',
  // Rating sounds
  paste: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
  error: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
}

export const playSound = (soundName, volume = 0.3) => {
  if (typeof window === 'undefined') return
  
  try {
    const soundUrl = fallbackSounds[soundName]
    if (!soundUrl) return

    const audio = new Audio(soundUrl)
    audio.volume = volume
    audio.crossOrigin = 'anonymous'
    
    audio.play().catch(() => {
      // Silently fail - browser blocked autoplay or CORS issue
    })
  } catch (e) {
    // Silently fail
  }
}

// Preload sounds
export const preloadSounds = () => {
  if (typeof window === 'undefined') return
  
  Object.values(fallbackSounds).forEach((url) => {
    try {
      const audio = new Audio()
      audio.preload = 'auto'
      audio.crossOrigin = 'anonymous'
      audio.src = url
    } catch (e) {
      // Silently fail
    }
  })
}

export default { playSound, preloadSounds }
