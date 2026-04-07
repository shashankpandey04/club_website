'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type EditEventFormProps = {
  event: {
    id: string
    title: string
    description: string | null
    location: string | null
    event_date: string
  }
}

export default function EditEventForm({ event }: EditEventFormProps) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: event.title,
    description: event.description || '',
    location: event.location || '',
    event_date: event.event_date ? event.event_date.slice(0, 16) : '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/events/${event.id}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Unable to update event')
        setLoading(false)
        return
      }

      router.push('/admin/events')
      router.refresh()
    } catch {
      setError('Network error')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm text-cyan-200/80">Title</label>
        <input
          name="title"
          required
          value={form.title}
          onChange={handleChange}
          className="mt-1 w-full rounded-xl border border-cyan-400/20 bg-blue-950/70 px-3 py-2 text-cyan-100 outline-none focus:border-cyan-300"
        />
      </div>

      <div>
        <label className="text-sm text-cyan-200/80">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="mt-1 w-full rounded-xl border border-cyan-400/20 bg-blue-950/70 px-3 py-2 text-cyan-100 outline-none focus:border-cyan-300"
        />
      </div>

      <div>
        <label className="text-sm text-cyan-200/80">Location</label>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          className="mt-1 w-full rounded-xl border border-cyan-400/20 bg-blue-950/70 px-3 py-2 text-cyan-100 outline-none focus:border-cyan-300"
        />
      </div>

      <div>
        <label className="text-sm text-cyan-200/80">Event Date</label>
        <input
          type="datetime-local"
          name="event_date"
          required
          value={form.event_date}
          onChange={handleChange}
          className="mt-1 w-full rounded-xl border border-cyan-400/20 bg-blue-950/70 px-3 py-2 text-cyan-100 outline-none focus:border-cyan-300"
        />
      </div>

      {error && <p className="rounded-xl border border-red-400/25 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="h-11 rounded-xl bg-linear-to-r from-cyan-400 to-sky-300 px-5 text-sm font-semibold text-[#08192F] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  )
}
