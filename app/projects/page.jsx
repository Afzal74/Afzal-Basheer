import Projects from '@/components/Projects'

export const metadata = {
  title: 'Projects | Afzal Basheer',
  description: 'Mission Archive - My project portfolio'
}

export default function ProjectsPage() {
  return (
    <main className="bg-[#050505] min-h-screen">
      <Projects />
    </main>
  )
}
