import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LoginPage from '@/components/LoginPage'

export default async function Home(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const code = searchParams.code

  // If Supabase redirected back to root with a code (fallback), forward it to the callback handler
  if (code && typeof code === 'string') {
    redirect(`/auth/callback?code=${code}`)
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return <LoginPage />
}
