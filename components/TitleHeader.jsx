'use client'

const TitleHeader = ({ title, sub }) => {
  return (
    <div className="flex flex-col items-center gap-5 mb-10">
      {sub && (
        <div className="hero-badge">
          <p>{sub}</p>
        </div>
      )}
      {title && (
        <h2 className="font-semibold md:text-5xl text-3xl text-center text-white">
          {title}
        </h2>
      )}
    </div>
  )
}

export default TitleHeader
