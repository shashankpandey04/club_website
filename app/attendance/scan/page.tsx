'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { Camera, CircleCheck, CircleX, QrCode, ScanLine } from 'lucide-react'

type AttendanceStatus = 'checkin' | 'checkout' | 'breakin' | 'breakout'

const STATUS_OPTIONS: Array<{ value: AttendanceStatus; label: string }> = [
  { value: 'checkin', label: 'Check In' },
  { value: 'checkout', label: 'Check Out' },
  { value: 'breakin', label: 'Break In' },
  { value: 'breakout', label: 'Break Out' },
]

type Feedback = {
  type: 'success' | 'error' | 'info'
  text: string
}

function parseUserId(decodedText: string): string | null {
  try {
    const parsed = JSON.parse(decodedText)

    if (typeof parsed?.user_id === 'string' && parsed.user_id.length > 0) {
      return parsed.user_id
    }
  } catch {
    if (decodedText.trim().length > 0) {
      return decodedText.trim()
    }
  }

  return null
}

export default function AttendancePage() {
  const [status, setStatus] = useState<AttendanceStatus>('checkin')
  const [isScannerReady, setIsScannerReady] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastScannedUserId, setLastScannedUserId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Feedback>({
    type: 'info',
    text: 'Scanner initializing. Point camera at attendee QR code.',
  })
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const mountedRef = useRef(true)
  const statusRef = useRef<AttendanceStatus>('checkin')
  const isProcessingRef = useRef(false)
  const lastDecodedRef = useRef<{ value: string; at: number } | null>(null)

  useEffect(() => {
    statusRef.current = status
  }, [status])

  useEffect(() => {
    mountedRef.current = true

    const initScanner = async () => {
      const scanner = new Html5Qrcode('reader')
      scannerRef.current = scanner

      try {
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: 260 },
          async (decodedText) => {
            const now = Date.now()

            if (
              lastDecodedRef.current &&
              lastDecodedRef.current.value === decodedText &&
              now - lastDecodedRef.current.at < 2000
            ) {
              return
            }

            if (isProcessingRef.current) {
              return
            }

            const userId = parseUserId(decodedText)

            if (!userId) {
              setFeedback({ type: 'error', text: 'Invalid QR payload. Try another code.' })
              return
            }

            lastDecodedRef.current = { value: decodedText, at: now }
            isProcessingRef.current = true
            setIsSubmitting(true)
            setFeedback({ type: 'info', text: 'Submitting attendance...' })

            try {
              const response = await fetch('/api/attendance/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  user_id: userId,
                  status: statusRef.current,
                }),
              })

              const result = await response.json().catch(() => ({}))

              if (!response.ok) {
                setFeedback({
                  type: 'error',
                  text: result.error || 'Unable to mark attendance',
                })
              } else {
                setLastScannedUserId(userId)
                setFeedback({
                  type: 'success',
                  text: `${statusRef.current} marked successfully`,
                })
              }
            } catch {
              setFeedback({ type: 'error', text: 'Network error while marking attendance' })
            } finally {
              isProcessingRef.current = false
              if (mountedRef.current) {
                setIsSubmitting(false)
              }
            }
          },
          () => {}
        )

        if (mountedRef.current) {
          setIsScannerReady(true)
          setFeedback({ type: 'info', text: 'Scanner ready. Align QR inside the frame.' })
        }
      } catch {
        if (mountedRef.current) {
          setFeedback({
            type: 'error',
            text: 'Unable to start camera. Check permissions and try refreshing the page.',
          })
        }
      }
    }

    initScanner()

    return () => {
      mountedRef.current = false

      const scanner = scannerRef.current
      scannerRef.current = null

      if (scanner) {
        const safeClear = () => {
          try {
            const clearResult = (scanner as { clear: () => void | Promise<void> }).clear()

            if (clearResult && typeof (clearResult as Promise<void>).catch === 'function') {
              ;(clearResult as Promise<void>).catch(() => {})
            }
          } catch {
            // ignore cleanup failures
          }
        }

        const state = (scanner as { getState?: () => number }).getState?.()
        const isRunningOrPaused = state === 2 || state === 3

        if (isRunningOrPaused) {
          const stopResult = scanner.stop()

          if (stopResult && typeof stopResult.then === 'function') {
            stopResult.then(() => safeClear()).catch(() => safeClear())
          } else {
            safeClear()
          }
        } else {
          safeClear()
        }
      }
    }
  }, [])

  const isSuccess = feedback.type === 'success'
  const isError = feedback.type === 'error'

  return (
    <div className="relative min-h-screen overflow-hidden px-4 pb-12 pt-28 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,229,255,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,165,0,0.12),transparent_24%),linear-gradient(135deg,#071225_0%,#0B1D3A_45%,#132E59_100%)]" />
      <div className="absolute inset-0 opacity-40 bg-[linear-gradient(0deg,transparent_24%,rgba(14,165,233,0.08)_25%,rgba(14,165,233,0.08)_26%,transparent_27%,transparent_74%,rgba(14,165,233,0.08)_75%,rgba(14,165,233,0.08)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(14,165,233,0.08)_25%,rgba(14,165,233,0.08)_26%,transparent_27%,transparent_74%,rgba(14,165,233,0.08)_75%,rgba(14,165,233,0.08)_76%,transparent_77%,transparent)] bg-size-[56px_56px]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-blue-950/55 px-4 py-2 text-xs font-mono uppercase tracking-[0.28em] text-cyan-200">
              <ScanLine size={14} />
              Attendance scanner
            </div>
            <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">Scan Attendance</h1>
            <p className="mt-2 text-blue-100/80">
              Select scan mode and point camera at member QR code.
            </p>
          </div>

          <Link
            href="/attendance/my"
            className="inline-flex h-10 items-center rounded-xl border border-cyan-400/25 bg-blue-950/60 px-4 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300"
          >
            Back to My Attendance
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-cyan-400/20 bg-[#08192F]/85 p-6 shadow-[0_24px_80px_rgba(2,10,24,0.5)] backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2 text-cyan-300">
              <QrCode size={18} />
              <p className="text-sm font-mono uppercase tracking-[0.24em]">Scan mode</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {STATUS_OPTIONS.map((item) => {
                const active = status === item.value

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setStatus(item.value)}
                    className={`h-11 rounded-xl border px-3 text-sm font-semibold transition ${active ? 'border-cyan-300 bg-cyan-400/15 text-cyan-100' : 'border-cyan-400/20 bg-blue-950/55 text-blue-100/80 hover:border-cyan-300/60'}`}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <div className="rounded-xl border border-cyan-400/15 bg-blue-950/50 px-4 py-3 text-blue-100/80">
                Active status: <span className="font-semibold capitalize text-cyan-200">{status}</span>
              </div>
              <div className="rounded-xl border border-cyan-400/15 bg-blue-950/50 px-4 py-3 text-blue-100/80">
                Scanner: <span className="font-semibold text-cyan-200">{isScannerReady ? 'Ready' : 'Starting...'}</span>
              </div>
              {lastScannedUserId && (
                <div className="rounded-xl border border-cyan-400/15 bg-blue-950/50 px-4 py-3 text-blue-100/80 break-all">
                  Last scanned user: <span className="font-semibold text-cyan-200">{lastScannedUserId}</span>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-[#08192F]/85 p-6 shadow-[0_24px_80px_rgba(2,10,24,0.5)] backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2 text-cyan-300">
              <Camera size={18} />
              <p className="text-sm font-mono uppercase tracking-[0.24em]">Camera view</p>
            </div>

            <div className="rounded-2xl border border-cyan-400/20 bg-blue-950/50 p-3">
              <div id="reader" className="mx-auto w-full max-w-md overflow-hidden rounded-xl" />
            </div>

            <div className={`mt-4 rounded-xl border px-4 py-3 text-sm ${isSuccess ? 'border-emerald-400/25 bg-emerald-500/10 text-emerald-200' : isError ? 'border-red-400/25 bg-red-500/10 text-red-200' : 'border-cyan-400/20 bg-blue-950/50 text-blue-100/80'}`}>
              <div className="flex items-start gap-2">
                {isSuccess ? <CircleCheck size={18} className="mt-0.5" /> : null}
                {isError ? <CircleX size={18} className="mt-0.5" /> : null}
                {!isSuccess && !isError ? <ScanLine size={18} className="mt-0.5" /> : null}
                <span>{isSubmitting ? 'Processing scan...' : feedback.text}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}