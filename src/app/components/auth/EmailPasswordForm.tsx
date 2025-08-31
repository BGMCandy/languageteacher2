'use client'
import { useState } from 'react'
import { createClientBrowser } from '@/lib/supabase/clients'

export default function EmailPasswordForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const supabase = createClientBrowser()

  const signUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) alert(error.message)
    else alert('Check your email to confirm (if confirmations enabled).')
  }

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
  }

  return (
    <div className="space-y-2">
      <input className="border px-3 py-2 w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="border px-3 py-2 w-full" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <div className="flex gap-2">
        <button onClick={signIn} className="border px-4 py-2 rounded">Sign In</button>
        <button onClick={signUp} className="border px-4 py-2 rounded">Sign Up</button>
      </div>
    </div>
  )
}
