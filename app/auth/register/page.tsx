'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthShell } from '@/components/auth/AuthShell'
import { supabaseBrowser } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        const validationErrors = data.errors
          ? Object.values(data.errors).flat().filter(Boolean).join(', ')
          : ''

        setError(validationErrors || data.message || 'Something went wrong')
        setLoading(false)
        return
      }

      // ✅ Success message
      setSuccess('Account created successfully. You can now login.')

      // 🔁 Redirect after short delay
      setTimeout(() => {
        router.push('/auth/login')
      }, 1500)

    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true)
    setError(null)

    const redirectTo = `${window.location.origin}/auth/login/callback`

    const { error } = await supabaseBrowser.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    })

    if (error) {
      setError(error.message || 'Unable to continue with Google')
      setGoogleLoading(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Join the AWS Student Builder Group"
      title="Create your account"
      description="Register once to unlock event signups, community updates, and the member-only AWS Student Builder Group experience."
      footerText="Already registered?"
      footerHref="/auth/login"
      footerLinkLabel="Sign in"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-xs font-mono uppercase tracking-[0.24em] text-cyan-300/80">Full name</label>
          <input
            type="text"
            required
            className="w-full rounded-2xl border border-cyan-400/20 bg-blue-950/60 px-4 py-3 text-white placeholder:text-blue-100/35 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30"
            placeholder="Your name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-mono uppercase tracking-[0.24em] text-cyan-300/80">Email</label>
          <input
            type="email"
            required
            className="w-full rounded-2xl border border-cyan-400/20 bg-blue-950/60 px-4 py-3 text-white placeholder:text-blue-100/35 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30"
            placeholder="you@lpu.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-mono uppercase tracking-[0.24em] text-cyan-300/80">Password</label>
          <input
            type="password"
            minLength={6}
            required
            className="w-full rounded-2xl border border-cyan-400/20 bg-blue-950/60 px-4 py-3 text-white placeholder:text-blue-100/35 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}
        {success && <p className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-400 to-sky-300 px-4 py-3 font-semibold text-[#08192F] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Creating account...' : 'Create account'}
          {!loading && <span className="transition-transform group-hover:translate-x-0.5">→</span>}
        </button>

        <div className="relative py-1">
          <div className="h-px bg-cyan-400/20" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#08192F] px-3 text-xs uppercase tracking-[0.2em] text-blue-100/60">
            or
          </span>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={googleLoading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-cyan-400/25 bg-blue-950/55 px-4 py-3 font-semibold text-cyan-100 transition hover:border-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {googleLoading ? 'Redirecting...' : 'Continue with Google'}
        </button>
      </form>
    </AuthShell>
  )
}