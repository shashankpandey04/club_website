import Link from 'next/link'
import { CalendarDays, MapPin } from 'lucide-react'
import { supabaseAdmin } from '@/lib/supabase/admin'

export default async function EventsPage() {
  const { data: events } = await supabaseAdmin
    .from('events')
    .select('id, title, description, location, event_date')
    .order('event_date', { ascending: true })

  return (
    <div className="relative min-h-screen overflow-hidden px-4 pb-12 pt-28 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,229,255,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,165,0,0.12),transparent_24%),linear-gradient(135deg,#071225_0%,#0B1D3A_45%,#132E59_100%)]" />
      <div className="absolute inset-0 opacity-40 bg-[linear-gradient(0deg,transparent_24%,rgba(14,165,233,0.08)_25%,rgba(14,165,233,0.08)_26%,transparent_27%,transparent_74%,rgba(14,165,233,0.08)_75%,rgba(14,165,233,0.08)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(14,165,233,0.08)_25%,rgba(14,165,233,0.08)_26%,transparent_27%,transparent_74%,rgba(14,165,233,0.08)_75%,rgba(14,165,233,0.08)_76%,transparent_77%,transparent)] bg-size-[56px_56px]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Upcoming Events</h1>
          <p className="mt-3 max-w-3xl text-blue-100/80">
            Discover workshops, sessions, and club meetups. Join the community and build your cloud journey.
          </p>
        </div>

        <div className="grid gap-5">
          {(events ?? []).map((event) => (
            <article key={event.id} className="rounded-3xl border border-cyan-400/20 bg-[#08192F]/85 p-6 shadow-[0_24px_80px_rgba(2,10,24,0.5)] backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white">{event.title}</h2>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-cyan-200/85">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={16} />
                  {new Date(event.event_date).toLocaleString()}
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin size={16} />
                  {event.location || 'Location to be announced'}
                </span>
              </div>
              {event.description ? (
                <p className="mt-4 leading-7 text-blue-100/80">{event.description}</p>
              ) : null}
            </article>
          ))}

          {!events?.length && (
            <div className="rounded-2xl border border-cyan-400/20 bg-blue-950/50 px-6 py-8 text-blue-100/80">
              No events published yet.
            </div>
          )}
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-xl border border-cyan-400/30 bg-blue-950/60 px-4 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
