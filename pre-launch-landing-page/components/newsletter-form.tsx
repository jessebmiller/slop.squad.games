"use client"

import type React from "react"

import { useState } from "react"
import { subscribeToNewsletter } from "@/app/actions"
import { Loader2 } from "lucide-react"

export default function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")

    try {
      await subscribeToNewsletter(email)
      setStatus("success")
      setMessage("You're in! Welcome to the Slop Squad.")
      setEmail("")
    } catch (error) {
      setStatus("error")
      setMessage("Something went wrong. Please try again.")
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="bg-black border-2 border-white px-4 py-3 flex-grow placeholder-gray-500 focus:outline-none focus:border-[#00ff66]"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-[#00ff66] hover:bg-[#00ff88] text-black px-6 py-3 font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {status === "loading" ? <Loader2 className="animate-spin" size={20} /> : "JOIN NOW"}
          </button>
        </div>
      </form>

      {status !== "idle" && (
        <div
          className={`mt-4 p-3 ${
            status === "success"
              ? "bg-[#00ff6620] text-[#00ff66]"
              : status === "error"
                ? "bg-[#ff2d5520] text-[#ff2d55]"
                : ""
          }`}
        >
          {message}
        </div>
      )}
    </div>
  )
}
