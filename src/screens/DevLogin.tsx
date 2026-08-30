import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function DevLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
    } else {
      window.location.href = '/admin/users'
    }
  }

  return (
    <div style={{ padding: 40, maxWidth: 320 }}>
      <h2>Dev Login (testing only)</h2>
      <input placeholder="email" value={email} onChange={e => setEmail(e.target.value)} style={{ display: 'block', marginBottom: 8, width: '100%' }} />
      <input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ display: 'block', marginBottom: 8, width: '100%' }} />
      <button onClick={handleLogin}>Log In</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}