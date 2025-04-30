import type { Metadata } from 'next'
import { Tilt_Neon, Special_Elite } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"

const tiltNeon = Tilt_Neon({
  subsets: ['latin'],
  variable: '--font-tilt-neon',
  display: 'swap',
})

const specialElite = Special_Elite({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-special-elite',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${tiltNeon.variable} ${specialElite.variable}`}>
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
