'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type AttendanceItem = {
  id: string
  status: 'checkin' | 'checkout' | 'breakin' | 'breakout'
  scanned_at: string
  events?: {
    id: string
    title: string
    event_date: string
    location: string | null
  } | null
}

type Role = 'member' | 'core' | 'admin'

export default function MyAttendancePage() {
  const [data, setData] = useState<AttendanceItem[]>([])
  const [role, setRole] = useState<Role>('member')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/attendance/my')
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          setError(res.error)
          setLoading(false)
          return
        }

        setData(res.attendance || [])
        setRole(res.role || 'member')
        setLoading(false)
      })
      .catch(() => {
        setError('Unable to load attendance')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <p className="p-6 text-white">Loading attendance...</p>
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 pb-12 pt-28 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,229,255,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,165,0,0.12),transparent_24%),linear-gradient(135deg,#071225_0%,#0B1D3A_45%,#132E59_100%)]" />
      <div className="absolute inset-0 opacity-40 bg-[linear-gradient(0deg,transparent_24%,rgba(14,165,233,0.08)_25%,rgba(14,165,233,0.08)_26%,transparent_27%,transparent_74%,rgba(14,165,233,0.08)_75%,rgba(14,165,233,0.08)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(14,165,233,0.08)_25%,rgba(14,165,233,0.08)_26%,transparent_27%,transparent_74%,rgba(14,165,233,0.08)_75%,rgba(14,165,233,0.08)_76%,transparent_77%,transparent)] bg-size-[56px_56px]" />

      <div className="relative mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">My Attendance</h1>
            <p className="mt-2 text-blue-100/80">Track your check-ins, check-outs, and event activity.</p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center rounded-xl border border-cyan-400/25 bg-blue-950/60 px-4 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300"
            >
              Dashboard
            </Link>

            {(role === 'core' || role === 'admin') && (
              <Link
                href="/attendance/scan"
                className="inline-flex h-10 items-center rounded-xl bg-linear-to-r from-cyan-400 to-sky-300 px-4 text-sm font-semibold text-[#08192F] transition hover:brightness-110"
              >
                Open Scanner
              </Link>
            )}
          </div>
        </div>

        {error && (
          <p className="mb-4 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}

        <div className="space-y-4">
          {data.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-cyan-400/20 bg-[#08192F]/85 p-5 shadow-[0_24px_80px_rgba(2,10,24,0.35)]"
            >
              <p className="text-xl font-semibold text-white">{item.events?.title || 'Untitled Event'}</p>
              <p className="mt-1 text-sm text-blue-100/75">{item.events?.location || 'Location TBA'}</p>
              {item.events?.event_date ? (
                <p className="mt-1 text-xs text-cyan-200/85">Event: {new Date(item.events.event_date).toLocaleString()}</p>
              ) : null}

              <p className="mt-3 text-sm">
                Status:{' '}
                <span className="text-orange-400 capitalize">
                  {item.status}
                </span>
              </p>

              <p className="mt-1 text-xs text-blue-100/55">
                Scanned: {new Date(item.scanned_at).toLocaleString()}
              </p>
            </div>
          ))}

          {!data.length && !error && (
            <p className="rounded-xl border border-cyan-400/20 bg-blue-950/50 px-4 py-6 text-blue-100/75">
              No attendance records found.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}