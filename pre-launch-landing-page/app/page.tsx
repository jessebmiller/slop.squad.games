import { Rock_3D, Special_Elite, Rubik_Spray_Paint, Rubik_Glitch, Rubik_Microbe, Palette_Mosaic } from "next/font/google"
import NewsletterForm from "@/components/newsletter-form"
import FeatureCard from "@/components/feature-card"
import GlitchText from "@/components/glitch-text"
import { ArrowDown, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const rock3D = Rock_3D({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-rock-3d",
})

const specialElite = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-special-elite",
})

const rubikSprayPaint = Rubik_Spray_Paint({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-rubik-spray-paint",
})

const rubikGlitch = Rubik_Glitch({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-rubik-glitch",
})

const rubikMicrobe = Rubik_Microbe({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-rubik-microbe",
})

const paletteMosaic = Palette_Mosaic({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-palette-mosaic",
})

export default function Home() {
  return (
    <div className={`${rock3D.variable} ${specialElite.variable} ${rubikSprayPaint.variable} ${rubikGlitch.variable} ${rubikMicrobe.variable} ${paletteMosaic.variable}`}>
      <main className="min-h-screen bg-black text-white relative">
        {/* Noise overlay */}
        <div className="fixed inset-0 bg-noise z-10"></div>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Bold glitch texture background */}
          <div className="absolute inset-0 bg-black"></div>
          <div className="absolute inset-0 bg-glitch-texture opacity-90 z-0"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ff00ff80_0%,transparent_50%)] opacity-30 mix-blend-color-dodge"></div>
          <div className="container mx-auto px-4 pt-20 pb-16 relative z-20">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block rotate-[-2deg] mb-6">
                <div className="bg-[#ff00ff] text-black px-4 py-2 font-special-elite text-xl tracking-wider">
                  JUMPING IN THE SLOP
                </div>
              </div>

              <h1 className="text-6xl md:text-8xl font-rubik-spray-paint mb-6 leading-none">
                <GlitchText>SLOP SQUAD GAMES</GlitchText>
              </h1>

              <p className="text-xl md:text-2xl mb-8 font-special-elite max-w-2xl mx-auto leading-relaxed">
                <span className="bg-black px-3 py-1">A collaboration platform for indie devs making weird, wild, and wonderful games. Host, mod, and sell your digital experiments.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link
                  href="#join"
                  className="bg-[#ff00ff] hover:bg-[#ff33ff] text-black px-8 py-3 text-lg font-special-elite transition-all duration-300 transform hover:translate-y-[-2px] hover:rotate-[-1deg] rounded-md"
                >
                  JOIN THE SQUAD
                </Link>
                <Link
                  href="#about"
                  className="bg-black border-2 border-white hover:border-[#00ffff] hover:text-[#00ffff] px-8 py-3 text-lg font-special-elite transition-all duration-300 transform hover:translate-y-[-2px] hover:rotate-[1deg]"
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
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#00ffff40_0%,transparent_50%)] opacity-30"></div>
          <div className="container mx-auto px-4 relative z-20">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-rock-3d mb-8 text-[#00ffff]">
                WHAT IS <span className="text-white">SLOP SQUAD?</span>
              </h2>

              <div className="space-y-6 font-special-elite text-lg max-w-3xl mx-auto">
                <p>
                  Remember the wild west days of Flash games? When anyone could make anything, and most of it was
                  terrible, but all of it was <span className="text-[#00ffff]">interesting</span>?
                </p>

                <p>
                  Slop Squad Games is a place for {" "}
                  <span className="text-[#ff00ff]">rebelious indie devs</span> to make and share experimental,
                  weird, unpolished games, and thrive doing it. Let's make a ton of slop!
                </p>

                <p>
                  Host your slop for free. Collaborate with other devs. Mod each other's creations. Share revenue through
                  our radical licensing system. Build the future of indie games together.
                </p>
              </div>

              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <FeatureCard
                  icon={<span className="text-3xl">💻</span>}
                  title="FREE HOSTING"
                  description="Host your games for free if they're on GitHub. No gatekeepers, no barriers."
                  color="#ff00ff"
                />
                <FeatureCard
                  icon={<span className="text-3xl">🎉</span>}
                  title="SOCIAL VIBING"
                  description="Remix, fork, and mod each other's games. Build weird games from weird games."
                  color="#00ffff"
                />
                <FeatureCard
                  icon={<span className="text-3xl">💸</span>}
                  title="REVENUE SHARING"
                  description="Radical licensing for ad hoc collaboration between designers, modders, and artists."
                  color="#ffcc00"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Join Section */}
        <section id="join" className="py-16 relative">
          <div className="absolute inset-0 bg-glitch-texture opacity-10 mix-blend-overlay"></div>
          <div className="container mx-auto px-4 relative z-20">
            <div className="max-w-2xl mx-auto bg-black border-2 border-white p-8 relative">
              <div className="absolute -top-4 -left-4 bg-[#ff00ff] text-black px-4 py-2 font-special-elite text-xl tracking-wider">
                JOIN THE SQUAD
              </div>

              <h2 className="text-3xl md:text-4xl font-palette-mosaic mb-6 mt-4 text-center">
                BE PART OF THE <span className="text-[#00ffff]">REVOLUTION</span>
              </h2>

              <p className="font-special-elite mb-8 text-center">
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
                <Link 
                  href="https://github.com/jessebmiller/slop.squad.games" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#00ffff] transition-colors"
                >
                  <Image src="/github-mark/github-mark-white.svg" alt="GitHub" width={24} height={24} />
                </Link>
                <Link 
                  href="https://discord.gg/BRf6T7RmVd" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#00ffff] transition-colors"
                >
                  <Image src="/Discord-Symbol-White.svg" alt="Discord" width={24} height={24} className="h-6 w-auto" />
                </Link>
                <Link 
                  href="https://bsky.app/profile/squad-games.bsky.social" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#00ffff] transition-colors"
                >
                  <Image src="/Bluesky_Logo.svg" alt="Bluesky" width={24} height={24} className="h-6 w-auto" />
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
