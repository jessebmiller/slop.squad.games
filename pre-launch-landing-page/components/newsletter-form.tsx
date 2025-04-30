"use client"

import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('fields[email]', email)
      formData.append('ml-submit', '1')
      formData.append('anticsrf', 'true')

      const response = await fetch('https://assets.mailerlite.com/jsonp/1489858/forms/153134171279066945/subscribe', {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      })

      // Since we're using no-cors mode, we can't check response.ok
      // If we get here without an error, we'll assume it worked
      setIsSuccess(true)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center p-4">
        <h4 className="text-2xl font-rubik-spray-paint mb-4 text-[#ff33ff]">WELCOME!</h4>
        <p className="font-special-elite">You're in! We'll keep you posted on the latest news and updates.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full bg-black border-2 border-white text-white px-4 py-3 font-special-elite focus:border-[#00ffff] focus:outline-none transition-all duration-300"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#00ffff] hover:bg-[#33ffff] text-black px-8 py-3 text-lg font-special-elite transition-all duration-300 transform hover:translate-y-[-2px] hover:rotate-[-1deg] rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
            <span>JOINING...</span>
          </div>
        ) : (
          'JOIN NOW'
        )}
      </button>
    </form>
  )
}
