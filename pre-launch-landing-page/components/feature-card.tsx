import type { ReactNode } from "react"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  color: string
}

export default function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  return (
    <div className="border-2 border-white p-6 relative group hover:border-opacity-0 transition-all duration-300">
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ backgroundColor: `${color}20` }}
      ></div>

      <div className="relative z-10">
        <div className="mb-4 inline-block p-3 rounded-full" style={{ color }}>
          {icon}
        </div>

        <h3 className={`text-xl font-special-elite mb-2`} style={{ color }}>
          {title}
        </h3>

        <p className="font-special-elite">{description}</p>
      </div>
    </div>
  )
}
