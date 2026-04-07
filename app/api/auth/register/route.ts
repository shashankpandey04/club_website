export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { signUpSchema } from '@/app/schemas/auth.schema'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const parsed = signUpSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid registration data',
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 422 }
      )
    }

    const { email, password, full_name } = parsed.data

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        ...(siteUrl
          ? { emailRedirectTo: `${siteUrl}/auth/login/callback` }
          : {}),
        data: {
          full_name,
        },
      },
    })

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message || 'Unable to create account',
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      user: data.user,
    }, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}