import { Tilt_Neon, Special_Elite } from "next/font/google"
import NewsletterForm from "@/components/newsletter-form"
import FeatureCard from "@/components/feature-card"
import GlitchText from "@/components/glitch-text"
import { ArrowDown, Github, Zap } from "lucide-react"
import Link from "next/link"

const tiltNeon = Tilt_Neon({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-tilt-neon",
})

const specialElite = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-special-elite",
})

export default function Home() {
  return (
    <main className={`min-h-screen bg-black text-white ${tiltNeon.variable} ${specialElite.variable}`}>
      {/* Noise overlay */}
      <div className="fixed inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none z-10"></div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Bold glitch texture background */}
        <div className="absolute inset-0 bg-black"></div>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90 z-0"
          style={{
            backgroundImage: "url('/glitch-texture.png')",
            backgroundRepeat: "repeat",
          }}
        ></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ff2d5580_0%,transparent_50%)] opacity-30 mix-blend-color-dodge"></div>
        <div className="container mx-auto px-4 pt-20 pb-16 relative z-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block rotate-[-2deg] mb-6">
              <div className="bg-[#ff2d55] text-black px-4 py-2 font-special-elite text-xl tracking-wider">
                RECLAIMING THE SLOP
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl font-tilt-neon mb-6 leading-none">
              <GlitchText>SLOP SQUAD</GlitchText>
              <span className="block text-[#00ff66] mt-2">GAMES</span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 font-special-elite max-w-2xl mx-auto leading-relaxed">
              A punk collective for indie devs making weird, wild, and wonderful games. Host, collaborate, and sell your
              digital experiments.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="#join"
                className="bg-[#ff2d55] hover:bg-[#ff4d75] text-black px-8 py-3 text-lg font-bold transition-all duration-300 transform hover:translate-y-[-2px] hover:rotate-[-1deg]"
              >
                JOIN THE SQUAD
              </Link>
              <Link
                href="#about"
                className="border-2 border-white hover:border-[#00ff66] hover:text-[#00ff66] px-8 py-3 text-lg font-bold transition-all duration-300 transform hover:translate-y-[-2px] hover:rotate-[1deg]"
              >
                LEARN MORE
              </Link>
            </div>

            <div className="animate-bounce">
              <ArrowDown className="mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#00ff6640_0%,transparent_50%)] opacity-30"></div>
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-tilt-neon mb-8 text-[#00ff66]">
              WHAT IS <span className="text-white">SLOP SQUAD?</span>
            </h2>

            <div className="space-y-6 font-special-elite text-lg">
              <p>
                Remember the wild west days of Flash games? When anyone could make anything, and some of it was
                terrible, but all of it was <span className="text-[#00ff66]">interesting</span>?
              </p>

              <p>
                Slop Squad Games is reclaiming the term "slop game" as a{" "}
                <span className="text-[#ff2d55]">punk indie dev identity</span>. We're building a platform where
                experimental, weird, unpolished games can thrive.
              </p>

              <p>
                Host your games for free. Collaborate with other devs. Mod each other's creations. Share revenue through
                our radical licensing system. Build the future of indie games together.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Zap size={32} />}
                title="FREE HOSTING"
                description="Host your games for free if they're on GitHub. No gatekeepers, no barriers."
                color="#ff2d55"
              />
              <FeatureCard
                icon={<Github size={32} />}
                title="SOCIAL CODING"
                description="Collaborate, fork, and mod each other's games. Build on each other's ideas."
                color="#00ff66"
              />
              <FeatureCard
                icon={<div className="text-3xl">💰</div>}
                title="REVENUE SHARING"
                description="Radical licensing for ad hoc collections of games, mods, and content."
                color="#ffcc00"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section id="join" className="py-16 relative">
        <div className="absolute inset-0 bg-[url('/glitch-texture.png')] opacity-10 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-2xl mx-auto bg-black border-2 border-white p-8 relative">
            <div className="absolute -top-4 -left-4 bg-[#ff2d55] text-black px-4 py-2 font-special-elite text-xl tracking-wider">
              JOIN THE SQUAD
            </div>

            <h2 className="text-3xl md:text-4xl font-tilt-neon mb-6 mt-4">
              BE PART OF THE <span className="text-[#00ff66]">REVOLUTION</span>
            </h2>

            <p className="font-special-elite mb-8">
              Sign up to get updates on the Slop Squad Games platform launch, early access, and opportunities to
              collaborate.
            </p>

            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="font-special-elite">© {new Date().getFullYear()} Slop Squad Games</p>
            </div>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-[#00ff66] transition-colors">
                <Github size={24} />
              </Link>
              <Link href="#" className="hover:text-[#00ff66] transition-colors">
                Twitter
              </Link>
              <Link href="#" className="hover:text-[#00ff66] transition-colors">
                Discord
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
