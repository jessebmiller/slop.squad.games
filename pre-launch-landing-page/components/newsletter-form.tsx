"use client"

import type React from "react"
import { useState } from "react"
import { subscribeToNewsletter } from "@/app/actions"
import { UpdateIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await subscribeToNewsletter(email)
      setSuccess(true)
      setEmail("")
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className={cn(
              "bg-black border-2 border-white placeholder-gray-500 focus:border-[#00ff66]",
              "flex-grow",
              loading || success && "bg-[#00ff6620] text-[#00ff66]",
              error && "border-red-500"
            )}
            disabled={loading || success}
          />
          <Button
            type="submit"
            disabled={loading || success}
            className={cn(
              "bg-[#00ff66] hover:bg-[#00ff88] text-black font-bold",
              "transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
              "flex items-center justify-center"
            )}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <UpdateIcon className="w-4 h-4 animate-spin" />
                <span>Joining...</span>
              </div>
            ) : success ? (
              "You're in! Welcome to the Slop Squad."
            ) : (
              "JOIN NOW"
            )}
          </Button>
        </div>
      </form>

      {error && (
        <div
          className={cn(
            "mt-4 p-3 rounded-md",
            "bg-[#ff2d5520] text-[#ff2d55]"
          )}
        >
          {error}
        </div>
      )}
    </div>
  )
}
