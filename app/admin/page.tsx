import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CalendarPlus2, ChartColumnBig, ShieldCheck, Users2 } from 'lucide-react'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function AdminHubPage() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: me } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (me?.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 pb-12 pt-28 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,229,255,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,165,0,0.12),transparent_24%),linear-gradient(135deg,#071225_0%,#0B1D3A_45%,#132E59_100%)]" />
      <div className="absolute inset-0 opacity-40 bg-[linear-gradient(0deg,transparent_24%,rgba(14,165,233,0.08)_25%,rgba(14,165,233,0.08)_26%,transparent_27%,transparent_74%,rgba(14,165,233,0.08)_75%,rgba(14,165,233,0.08)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(14,165,233,0.08)_25%,rgba(14,165,233,0.08)_26%,transparent_27%,transparent_74%,rgba(14,165,233,0.08)_75%,rgba(14,165,233,0.08)_76%,transparent_77%,transparent)] bg-size-[56px_56px]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-blue-950/55 px-4 py-2 text-xs font-mono uppercase tracking-[0.28em] text-cyan-200">
            <ShieldCheck size={14} />
            Admin only
          </div>
          <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">Management Hub</h1>
          <p className="mt-3 max-w-3xl text-blue-100/80">
            Central control panel for administrative workflows. Manage members, role permissions, and club event operations from here.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <Link
            href="/admin/users"
            className="group rounded-3xl border border-cyan-400/20 bg-[#08192F]/85 p-6 shadow-[0_24px_80px_rgba(2,10,24,0.5)] backdrop-blur-xl transition hover:border-cyan-300"
          >
            <div className="flex items-center gap-3 text-cyan-300">
              <Users2 size={20} />
              <p className="text-sm font-mono uppercase tracking-[0.24em]">User management</p>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-white">Manage User Roles</h2>
            <p className="mt-2 text-sm leading-6 text-blue-100/75">
              Search users and assign role levels: member, core, or admin.
            </p>
            <p className="mt-5 text-sm font-semibold text-cyan-200 group-hover:text-cyan-100">Open user controls</p>
          </Link>

          <Link
            href="/admin/events"
            className="group rounded-3xl border border-cyan-400/20 bg-[#08192F]/85 p-6 shadow-[0_24px_80px_rgba(2,10,24,0.5)] backdrop-blur-xl transition hover:border-cyan-300"
          >
            <div className="flex items-center gap-3 text-cyan-300">
              <CalendarPlus2 size={20} />
              <p className="text-sm font-mono uppercase tracking-[0.24em]">Event management</p>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-white">Manage Events</h2>
            <p className="mt-2 text-sm leading-6 text-blue-100/75">
              View all events, edit existing details, or create new event entries.
            </p>
            <p className="mt-5 text-sm font-semibold text-cyan-200 group-hover:text-cyan-100">Open event tools</p>
          </Link>

          <Link
            href="/admin/attendance"
            className="group rounded-3xl border border-cyan-400/20 bg-[#08192F]/85 p-6 shadow-[0_24px_80px_rgba(2,10,24,0.5)] backdrop-blur-xl transition hover:border-cyan-300"
          >
            <div className="flex items-center gap-3 text-cyan-300">
              <ChartColumnBig size={20} />
              <p className="text-sm font-mono uppercase tracking-[0.24em]">Attendance analytics</p>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-white">Analyze Attendance</h2>
            <p className="mt-2 text-sm leading-6 text-blue-100/75">
              View event-wise attendance stats and export CSV reports.
            </p>
            <p className="mt-5 text-sm font-semibold text-cyan-200 group-hover:text-cyan-100">Open analytics</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
