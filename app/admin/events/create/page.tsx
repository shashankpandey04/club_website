'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateEventPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    event_date: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch('/api/events/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Something went wrong')
      setLoading(false)
      return
    }

    router.push('/admin/events')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl p-8">

        <h1 className="text-2xl font-semibold mb-6">
          Create Event
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-sm text-neutral-400">Title</label>
            <input
              name="title"
              required
              value={form.title}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700"
            />
          </div>

          <div>
            <label className="text-sm text-neutral-400">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700"
            />
          </div>

          <div>
            <label className="text-sm text-neutral-400">Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700"
            />
          </div>
          
          <div>
            <label className="text-sm text-neutral-400">Event Date</label>
            <input
              type="datetime-local"
              name="event_date"
              required
              value={form.event_date}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700"
            />
          </div>
          
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-orange-500 hover:bg-orange-600 rounded-lg"
          >
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  )
}