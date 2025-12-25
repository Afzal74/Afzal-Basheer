'use client'

import { useRef, useState, useEffect } from 'react'
import { Terminal, ArrowRight, ShieldCheck, ExternalLink } from 'lucide-react'
import { playSound } from './useSoundEffects'

const projects = [
  {
    id: 'M-01',
    title: 'Gamified Learning Platform',
    tech: ['React.js', 'Node.js', 'MongoDB', 'Supabase', 'Tailwind CSS'],
    desc: 'A gamified web platform designed to improve learning outcomes in rural schools through engagement and accessibility. Features interactive quizzes, reward-based challenges, real-time progress tracking, and personalized learning paths for students.',
    img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800',
    carouselImages: [
      '/gamified learning platform/Home.jpg',
      '/gamified learning platform/Live class.jpg',
      '/gamified learning platform/Realtime quiz.jpg',
      '/gamified learning platform/Student Pov.png'
    ],
    link: '#'
  },
  {
    id: 'M-02',
    title: 'QuizVerse',
    tech: ['Next.js', 'Tailwind CSS', 'Firebase', 'Zustand', 'TypeScript'],
    desc: 'A trivia quiz app featuring multiple categories, multiplayer mode, and PWA support. Implemented multiplayer functionality, leaderboard system, and offline support for seamless user experience.',
    img: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=800',
    carouselImages: [
      '/QuizVerse/quizverse.jpg',
      '/QuizVerse/Realtime.jpg'
    ],
    link: '#'
  },
  {
    id: 'M-03',
    title: 'Autocorrect Tool',
    tech: ['Java'],
    desc: 'A Java package for easy integration of autocorrect features in applications. Imports a dictionary and suggests closely matching words based on user input for improved text accuracy.',
    img: 'https://images.unsplash.com/photo-1510511459019-5dee997ddfdf?q=80&w=800',
    link: '#'
  }
]

const pixelFont = { fontFamily: '"Press Start 2P", cursive' }
const appleFont = { fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif' }

const HomeProjects = () => {
  const imageContainerRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [carouselIndex, setCarouselIndex] = useState(0)

  useEffect(() => {
    const currentProject = projects[activeIndex]
    if (!currentProject.carouselImages) return

    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % currentProject.carouselImages.length)
    }, 2500)

    return () => clearInterval(interval)
  }, [activeIndex])

  return (
    <section className="block md:hidden py-6 relative z-10">
      <div className="px-4 md:px-12 lg:px-24">
        <div className="mb-4 md:mb-16">
          <div
            style={pixelFont}
            className="text-zinc-600 text-[7px] md:text-[10px] tracking-widest mb-2 md:mb-4 uppercase flex items-center gap-2"
          >
            <Terminal size={10} className="md:w-[14px] md:h-[14px]" /> Mission_Archive / {projects.length} Files
          </div>
          <h2 style={appleFont} className="text-xl md:text-4xl lg:text-5xl font-bold text-white">
            Projects
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-12 items-start">
          {/* Project List */}
          <div className="w-full lg:w-1/2 space-y-1 md:space-y-4">
            {projects.map((proj, i) => (
              <div
                key={proj.id}
                onClick={() => { playSound('select', 0.3); setActiveIndex(i); }}
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
          <div className="w-full lg:w-1/2 space-y-2 md:space-y-8">
            <div ref={imageContainerRef} className="relative aspect-video border border-white/5 shadow-2xl bg-zinc-900 group overflow-hidden">
              <img
                src={projects[activeIndex].carouselImages ? projects[activeIndex].carouselImages[carouselIndex] : projects[activeIndex].img}
                alt={projects[activeIndex].title}
                className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
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
  )
}

export default HomeProjects
