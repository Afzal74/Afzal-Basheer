'use client'

import Link from 'next/link'
import { playSound } from './useSoundEffects'

const SoundLink = ({ href, children, className, style, onClick, ...props }) => {
  const handleClick = (e) => {
    playSound('navigate', 0.4)
    if (onClick) onClick(e)
  }

  return (
    <Link href={href} className={className} style={style} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}

export default SoundLink
