import type { Metadata } from 'next'
import { Special_Elite, Rubik_Spray_Paint, Rubik_Glitch, Rubik_Microbe } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"

const specialElite = Special_Elite({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-special-elite',
  display: 'swap',
})

const rubikSprayPaint = Rubik_Spray_Paint({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-rubik-spray-paint',
  display: 'swap',
})

const rubikGlitch = Rubik_Glitch({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-rubik-glitch',
  display: 'swap',
})

const rubikMicrobe = Rubik_Microbe({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-rubik-microbe',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Slop Squad',
  description: 'slop slop slop',
  generator: 'v0.dev',
  openGraph: {
    title: 'Slop Squad',
    description: 'slop slop slop',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Slop Squad Games',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Slop Squad',
    description: 'slop slop slop',
    images: ['/images/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${specialElite.variable} ${rubikSprayPaint.variable} ${rubikGlitch.variable} ${rubikMicrobe.variable}`}>
      <body className="min-h-screen bg-background antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
