'use client'

import { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { Terminal, ArrowRight, ShieldCheck, ExternalLink, ArrowLeft } from 'lucide-react'
import { playSound, preloadSounds } from './useSoundEffects'
import SoundLink from './SoundLink'
import GeminiChat from './GeminiChat'

const projects = [
  {
    id: 'M-01',
    title: 'Gamified Learning Platform',
    tech: ['React.js', 'Node.js', 'MongoDB', 'Supabase', 'Tailwind CSS'],
    desc: (
      <>
        A <span className="text-white font-medium">gamified web platform</span> designed to improve learning outcomes in <span className="text-white font-medium">rural schools</span>. Features <span className="text-white font-medium">interactive quizzes</span>, reward-based challenges, <span className="text-white font-medium">real-time progress tracking</span>, and personalized learning paths.
      </>
    ),
    img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800',
    carouselImages: [
      '/gamified learning platform/Home.jpg',
      '/gamified learning platform/Live class.jpg',
      '/gamified learning platform/Realtime quiz.jpg',
      '/gamified learning platform/Student Pov.png'
    ],
    link: 'https://ignite-vidya.vercel.app'
  },
  {
    id: 'M-02',
    title: 'QuizVerse',
    tech: ['Next.js', 'Tailwind CSS', 'Firebase', 'Zustand', 'TypeScript'],
    desc: (
      <>
        A <span className="text-white font-medium">trivia quiz app</span> featuring multiple categories, <span className="text-white font-medium">multiplayer mode</span>, and <span className="text-white font-medium">PWA support</span>. Implemented <span className="text-white font-medium">leaderboard system</span> and <span className="text-white font-medium">offline support</span> for seamless user experience.
      </>
    ),
    img: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=800',
    carouselImages: [
      '/quizverse/quizverse1.jpg',
      '/quizverse/quizverse2.jpg'
    ],
    link: 'https://trivia-quiz-sigma.vercel.app'
  },
  {
    id: 'M-03',
    title: 'VTU Vault',
    tech: ['Next.js', 'TypeScript'],
    desc: (
      <>
        A comprehensive <span className="text-white font-medium">academic companion app</span> for VTU students featuring <span className="text-white font-medium">study materials</span>, <span className="text-white font-medium">CGPA calculator</span>, project ideas, <span className="text-white font-medium">AI chat assistant</span>, and smart search.
      </>
    ),
    img: 'https://images.unsplash.com/photo-1510511459019-5dee997ddfdf?q=80&w=800',
    carouselImages: [
      '/vtu vault/vtuvault1.jpg',
      '/vtu vault/vtuvault2.jpg'
    ],
    link: 'https://vtu-vault.vercel.app'
  }
]

const pixelFont = { fontFamily: '"Press Start 2P", cursive' }
const appleFont = { fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif' }

const Projects = () => {
  const containerRef = useRef(null)
  const navRef = useRef(null)
  const imageContainerRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [imageClicked, setImageClicked] = useState(false)

  useEffect(() => {
    setMounted(true)
    preloadSounds()
  }, [])

  // Carousel effect for projects with carousel images
  useEffect(() => {
    if (!mounted) return
    
    const currentProject = projects[activeIndex]
    if (!currentProject.carouselImages) return

    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % currentProject.carouselImages.length)
    }, 2500)

    return () => clearInterval(interval)
  }, [activeIndex, mounted])

  // Reset grayscale on scroll
  useEffect(() => {
    const handleScroll = () => {
      setImageClicked(false)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useLayoutEffect(() => {
    if (!mounted) return

    // Check if animations already played this session
    const hasAnimated = sessionStorage.getItem('projectsAnimated')
    
    if (hasAnimated) {
      // Skip animations, just show everything
      gsap.set(navRef.current, { opacity: 1, y: 0 })
      gsap.set('.projects-header', { opacity: 1, y: 0 })
      gsap.set('.project-card', { opacity: 1, x: 0 })
      gsap.set('.project-preview', { opacity: 1, scale: 1 })
      // Still run border animations
      gsap.to('.project-border-top', {
        left: '100%',
        duration: 3,
        repeat: -1,
        ease: 'none',
      })
      gsap.to('.project-border-right', {
        top: '100%',
        duration: 3,
        repeat: -1,
        ease: 'none',
        delay: 0.75,
      })
      gsap.to('.project-border-bottom', {
        right: '100%',
        duration: 3,
        repeat: -1,
        ease: 'none',
        delay: 1.5,
      })
      gsap.to('.project-border-left', {
        bottom: '100%',
        duration: 3,
        repeat: -1,
        ease: 'none',
        delay: 2.25,
      })
      return
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

      tl.fromTo(navRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
      tl.fromTo('.projects-header', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
      tl.fromTo('.project-card', { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 0.6, stagger: 0.15 }, '-=0.4')
      tl.fromTo('.project-preview', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1 }, '-=0.8')
      
      // Mark animations as complete
      sessionStorage.setItem('projectsAnimated', 'true')
    }, containerRef)

    // Red border animation - outside context
    gsap.to('.project-border-top', {
      left: '100%',
      duration: 3,
      repeat: -1,
      ease: 'none',
    })
    gsap.to('.project-border-right', {
      top: '100%',
      duration: 3,
      repeat: -1,
      ease: 'none',
      delay: 0.75,
    })
    gsap.to('.project-border-bottom', {
      right: '100%',
      duration: 3,
      repeat: -1,
      ease: 'none',
      delay: 1.5,
    })
    gsap.to('.project-border-left', {
      bottom: '100%',
      duration: 3,
      repeat: -1,
      ease: 'none',
      delay: 2.25,
    })

    return () => ctx.revert()
  }, [mounted])

  return (
    <div ref={containerRef} className="bg-[#050505] min-h-screen lg:h-screen lg:overflow-hidden text-white">
      {/* Navigation */}
      <nav ref={navRef} className="w-full fixed top-0 left-0 z-[100] px-4 md:px-12 py-6 flex items-center justify-between backdrop-blur-sm bg-black/20 opacity-0">
        <SoundLink href="/" style={pixelFont} className="text-[10px] md:text-xs tracking-tighter text-white flex items-center gap-2 hover:text-red-500 transition-colors">
          <ArrowLeft size={14} /> AFZAL<span className="text-red-600">.SYS</span>
        </SoundLink>
        <div className="flex items-center gap-3 md:gap-8">
          {[
            { name: 'Home', href: '/', hidden: true },
            { name: 'Projects', href: '/projects' },
            { name: 'Achievements', href: '/achievements' },
            { name: 'Rate Me', href: '/ratings' }
          ].map((item) => (
            <SoundLink key={item.name} href={item.href} style={pixelFont} className={`nav-item text-[6px] md:text-[9px] uppercase tracking-widest transition-colors duration-300 relative group ${item.name === 'Projects' ? 'text-red-500' : 'text-zinc-500 hover:text-red-500'} ${item.hidden ? 'hidden' : ''}`}>
              {item.name}
              <span className={`absolute -bottom-1 left-0 h-[1px] bg-red-600 transition-all duration-300 ${item.name === 'Projects' ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </SoundLink>
          ))}
        </div>
      </nav>

      <section id="projects" className="min-h-screen pt-16 md:pt-32 pb-10 md:pb-20">
        <div className="container mx-auto px-4 md:px-12 lg:px-24">
        <div className="projects-header mb-6 md:mb-16">
          <div
            style={pixelFont}
            className="text-zinc-600 text-[8px] md:text-[10px] tracking-widest mb-2 md:mb-4 uppercase flex items-center gap-2"
          >
            <Terminal size={12} className="md:w-[14px] md:h-[14px]" /> Mission_Archive / {projects.length} Files
          </div>
          <h2 style={appleFont} className="text-2xl md:text-4xl lg:text-5xl font-bold text-white">
            Projects
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-12 items-start">
          {/* Project List */}
          <div className="w-full lg:w-1/2 space-y-1 md:space-y-4">
            {projects.map((proj, i) => (
              <div
                key={proj.id}
                onClick={() => { playSound('select', 0.3); setActiveIndex(i); setImageClicked(false); }}
                onMouseEnter={() => { playSound('select', 0.3); setActiveIndex(i); }}
                className={`project-card p-2 md:p-6 border-l-4 transition-all duration-300 cursor-pointer ${
                  activeIndex === i
                    ? 'bg-zinc-900/40 border-red-600'
                    : 'bg-transparent border-zinc-900 hover:border-zinc-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5 md:space-y-2">
                    <div
                      style={pixelFont}
                      className={`text-[5px] md:text-[8px] ${activeIndex === i ? 'text-red-500' : 'text-zinc-600'}`}
                    >
                      {proj.id}
                    </div>
                    <h3 style={appleFont} className="text-xs md:text-2xl font-black tracking-tighter uppercase text-white">
                      {proj.title}
                    </h3>
                    <div className="flex gap-0.5 md:gap-2 flex-wrap">
                      {proj.tech.map((t) => (
                        <span
                          key={t}
                          style={pixelFont}
                          className="text-[4px] md:text-[6px] bg-zinc-800 text-zinc-400 px-1 md:px-2 py-0.5 md:py-1"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ArrowRight
                    size={16}
                    className={`text-white transition-all duration-500 hidden md:block ${
                      activeIndex === i ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Project Preview */}
          <div className="w-full lg:w-1/2 project-preview lg:sticky lg:top-32 space-y-2 md:space-y-8">
            <div 
              ref={imageContainerRef} 
              className="relative aspect-video border border-white/5 shadow-2xl bg-zinc-900 group overflow-hidden cursor-pointer"
              onClick={() => setImageClicked(!imageClicked)}
            >
              {/* Red moving border */}
              <div className="absolute inset-0 pointer-events-none z-20">
                <div className="project-border-top absolute top-0 left-[-100%] w-full h-[3px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
                <div className="project-border-right absolute top-[-100%] right-0 w-[3px] h-full bg-gradient-to-b from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
                <div className="project-border-bottom absolute bottom-0 right-[-100%] w-full h-[3px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
                <div className="project-border-left absolute bottom-[-100%] left-0 w-[3px] h-full bg-gradient-to-b from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
              </div>
              
              <img
                src={projects[activeIndex].carouselImages ? projects[activeIndex].carouselImages[carouselIndex] : projects[activeIndex].img}
                alt={projects[activeIndex].title}
                className={`w-full h-full object-cover transition-all duration-1000 ${
                  imageClicked ? 'grayscale-0 brightness-100' : 'grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100'
                }`}
              />
              <div
                className="absolute top-2 md:top-4 right-2 md:right-4 text-[6px] md:text-[8px] bg-black/80 p-1 md:p-2 border border-red-900/30 text-red-600"
                style={pixelFont}
              >
                STATUS: SECURE
              </div>
            </div>

            <div className="space-y-2 md:space-y-6">
              <div style={pixelFont} className="text-[8px] md:text-[10px] text-red-600 flex items-center gap-2">
                <ShieldCheck size={12} className="md:w-[14px] md:h-[14px]" /> MISSION_BRIEF
              </div>
              <p style={appleFont} className="text-zinc-400 text-xs md:text-lg font-light leading-relaxed">
                {projects[activeIndex].desc}
              </p>
              <div className="flex gap-4">
                <a
                  href={projects[activeIndex].link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={pixelFont}
                  className="flex items-center gap-2 md:gap-3 bg-white text-black px-3 md:px-6 py-2 md:py-4 text-[8px] md:text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all"
                >
                  ACCESS_LINK <ExternalLink size={12} className="md:w-[14px] md:h-[14px]" />
                </a>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>
      <GeminiChat />
    </div>
  )
}

export default Projects
