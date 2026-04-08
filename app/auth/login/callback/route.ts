import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error_description') || searchParams.get('error')

  if (error) {
    return NextResponse.redirect(new URL('/auth/login?error=oauth_failed', request.url))
  }

  if (code) {
    const supabase = await createSupabaseServerClient()

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      return NextResponse.redirect(new URL('/auth/login?error=oauth_exchange_failed', request.url))
    }
  }

  return NextResponse.redirect(new URL('/dashboard', request.url))
}