import { redirect } from 'next/navigation'
import { createClientServer } from '@/lib/supabase/server'
import AccountContent from './AccountContent'

export default async function AccountPage() {
  const supabase = await createClientServer()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) redirect('/login')

  return <AccountContent />
}
