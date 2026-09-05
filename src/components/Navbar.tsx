import { useState, useEffect, type ReactNode, type CSSProperties } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'
import { getCurrentProfile, onProfileUpdate, resolveAvatarUrl } from '../lib/api'
import logoFull from '@/imports/20260723_170707.png'

// Extracted from MarketingWebsite.tsx so it can be rendered once, globally,
// above every public route instead of being re-created inside the marketing
// page itself. It has no props: it drives navigation and reads the active
// link entirely off the URL (the `?page=` search param on `/`), so it works
// correctly no matter which public route it's mounted above.
export type Page =
  | 'home' | 'about' | 'how-it-works' | 'become-agent' | 'services' | 'contact'
  | 'pricing' | 'faq' | 'privacy' | 'terms' | '404'

// The navbar's height at rest (scrollY 0): an 84px logo plus 18px of
// vertical padding on each side (see the `lerp(18,10,scrollP)` padding
// below, evaluated at scrollP=0). Exported so any screen that hard-codes
// `height:'100vh'` for its own full-viewport app shell (a dashboard sidebar,
// for instance) can reserve this much space instead via
// `calc(100vh - ${NAVBAR_HEIGHT}px)` — those shells never actually see the
// navbar "shrink" (their own content scrolls in an inner pane, not the
// window), so this rest-state value is the one that's always accurate there.
export const NAVBAR_HEIGHT = 120

const MARKETING_LINKS: [string, Page][] = [
  ['How It Works', 'how-it-works'], ['Services', 'services'],
  ['Become an Agent', 'become-agent'], ['Pricing', 'pricing'], ['FAQ', 'faq'], ['Contact', 'contact'],
]

// Signed-in users still see the marketing nav (so the same "How It Works /
// Services / Pricing / FAQ / Contact" links work everywhere) — just without
// "Become an Agent", since they already have an account either way.
const AUTHED_MARKETING_LINKS = MARKETING_LINKS.filter(([, page]) => page !== 'become-agent')

// Real app destinations live inside the profile dropdown (not the main nav)
// once signed in — role-specific where the label is the same but the
// destination differs (Dashboard, Settings), literal where it isn't (Find
// Care is the same browse-agents route regardless of role).
function profileMenuItems(role: string | undefined): [string, string][] {
  const isAgent = role === 'agent'
  return [
    ['Dashboard', isAgent ? '/agent/agentdashboard' : '/dashboard'],
    ['Find Care', '/browse-agents'],
    ['Settings', isAgent ? '/agent/agentprofilemgmt' : '/dashboard?tab=settings'],
  ]
}

function useScrollProgress(range = 120) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const h = () => setProgress(Math.min(window.scrollY / range, 1))
    window.addEventListener('scroll', h, { passive: true })
    h()
    return () => window.removeEventListener('scroll', h)
  }, [range])
  return progress
}

// Live auth state — not just a one-off getSession() check — so logging in
// or out anywhere in the app (another tab included) swaps the navbar
// immediately without a full reload. Also loads the profile row (role,
// name, avatar) once a session exists, for the app links and avatar.
function useAuthedProfile() {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    let cancelled = false
    supabase.auth.getSession().then(({ data }) => { if (!cancelled) setSession(data.session) })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })
    return () => { cancelled = true; subscription.unsubscribe() }
  }, [])

  useEffect(() => {
    if (!session) { setProfile(null); return }
    let cancelled = false
    getCurrentProfile()
      .then(p => { if (!cancelled) setProfile(p) })
      .catch(err => { console.error('Navbar: failed to load profile:', err); if (!cancelled) setProfile(null) })
    return () => { cancelled = true }
  }, [session])

  // Picks up an avatar (or other profile field) changed elsewhere — e.g. the
  // account settings screen — without waiting for a remount/re-fetch, since
  // the Navbar stays mounted across route changes on the public pages it renders on.
  useEffect(() => {
    return onProfileUpdate(patch => {
      setProfile((p: any) => p ? { ...p, ...patch } : p)
    })
  }, [])

  return { session, profile }
}

function Btn({
  variant = 'primary', size = 'md', onClick, fullWidth, children,
}: {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md'; onClick?: () => void; fullWidth?: boolean; children: ReactNode
}) {
  const sz = { sm: 'px-4 py-2 text-sm gap-1.5', md: 'px-5 py-2.5 text-sm gap-2' }[size]
  const vs: Record<string, CSSProperties> = {
    primary: { background: '#00737A', color: '#fff', border: '1.5px solid #00737A', boxShadow: '0 2px 8px rgba(0,115,122,0.30), inset 0 1px 0 rgba(255,255,255,0.12)' },
    secondary: { background: '#F2F4F5', color: '#2C3E43', border: '1.5px solid #E4E8EA' },
    ghost: { background: 'transparent', color: '#00737A', border: '1.5px solid transparent' },
  }
  return (
    <button onClick={onClick} className={`inline-flex items-center justify-center font-700 rounded-xl transition-all duration-150 select-none hover:brightness-105 active:scale-[0.97] ${sz} ${fullWidth ? 'w-full' : ''}`}
      style={{ fontFamily: 'Manrope,sans-serif', cursor: 'pointer', ...vs[variant] }}>
      {children}
    </button>
  )
}

function initialsOf(profile: any, fallbackEmail?: string | null): string {
  const name: string = profile?.full_name || profile?.preferred_name || ''
  if (name.trim()) return name.trim().split(/\s+/).map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
  return (fallbackEmail || '?').slice(0, 1).toUpperCase()
}

function Avatar({ profile, email, size = 36 }: { profile: any; email?: string | null; size?: number }) {
  const initials = initialsOf(profile, email)
  // Wrapped again here (not just at the getCurrentProfile/getMyProfile fetch
  // site) so this component renders correctly no matter what shape of
  // profile object a future caller hands it — a raw storage path resolves
  // to a public URL, an already-full URL passes through unchanged.
  const resolvedUrl = resolveAvatarUrl(profile?.avatar_url)
  const [broken, setBroken] = useState(false)
  useEffect(() => { setBroken(false) }, [resolvedUrl])
  const showImage = !!resolvedUrl && !broken
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
      background: showImage ? undefined : 'rgba(0,115,122,0.14)',
      color: '#00737A', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Manrope,sans-serif', fontWeight: 800, fontSize: size * 0.38,
      border: '1.5px solid rgba(0,115,122,0.25)',
    }}>
      {showImage
        ? <img src={resolvedUrl as string} alt={profile.full_name || 'Profile'} onError={() => setBroken(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : initials}
    </div>
  )
}

export default function Navbar() {
  const scrollP = useScrollProgress(120)
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t
  const [mob, setMob] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { session, profile } = useAuthedProfile()
  const isAuthed = !!session

  // Active-link state and navigation both live on the URL — `?page=` on
  // `/` — so this stays correct however it's reached (a Link, a browser
  // refresh, or a "back" navigation), with no local/lifted state needed.
  const cur = (searchParams.get('page') as Page) || 'home'
  const goTo = (page: Page) => {
    setMob(false)
    navigate(page === 'home' ? '/' : `/?page=${page}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToApp = (href: string) => {
    setMob(false)
    navigate(href)
  }

  const handleLogout = async () => {
    setMob(false)
    setProfileMenuOpen(false)
    await supabase.auth.signOut()
    navigate('/')
  }

  const menuItems = profileMenuItems(profile?.role)
  const centerLinks = isAuthed ? AUTHED_MARKETING_LINKS : MARKETING_LINKS

  return (
    <nav style={{
      // Sticky, not fixed: at rest it sits in normal document flow like any
      // other header, so it reserves its own space and pushes every page's
      // content down automatically — no per-page top padding needed, and no
      // gap/seam above full-bleed layouts (a fixed overlay would leave one).
      // Once the page scrolls past it, the browser sticks it to the
      // viewport top natively — no JS-driven position swap, so no layout
      // jump/flicker the way toggling fixed/relative by hand would cause.
      position: 'sticky', top: 0, zIndex: 100,
      padding: `${lerp(18, 10, scrollP)}px 32px`,
      background: `rgba(255,255,255,${lerp(0.45, 0.88, scrollP)})`,
      backdropFilter: `blur(${lerp(14, 40, scrollP)}px) saturate(${lerp(1.5, 2.2, scrollP)})`,
      WebkitBackdropFilter: `blur(${lerp(14, 40, scrollP)}px) saturate(${lerp(1.5, 2.2, scrollP)})`,
      borderBottom: `1px solid rgba(255,255,255,${lerp(0.38, 0.72, scrollP)})`,
      boxShadow: `0 4px 32px rgba(44,62,67,${lerp(0, 0.07, scrollP)})`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      {/* Always the marketing home — "Dashboard" (the app home for a signed-in
          user) lives in the profile dropdown instead, so the two "homes"
          stay distinct rather than the logo silently skipping the marketing
          nav it sits right above. */}
      <button onClick={() => goTo('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src={logoFull} alt="ReadyPal" style={{ height: 84, objectFit: 'contain' }} />
      </button>

      {/* Desktop links — same marketing nav whether signed in or not, just
          without "Become an Agent" once authed (real app links live in the
          profile dropdown instead, not up here). */}
      <div className="hidden md:flex items-center gap-1">
        {centerLinks.map(([label, page]) => (
          <button key={page} onClick={() => goTo(page)} style={{
            padding: '7px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
            fontFamily: 'Manrope,sans-serif', fontSize: 14, fontWeight: 500,
            background: cur === page ? 'rgba(0,115,122,0.08)' : 'transparent',
            color: cur === page ? '#00737A' : '#4A5E65',
            transition: 'all 0.15s',
          }}>{label}</button>
        ))}
      </div>

      <div className="hidden md:flex items-center gap-2.5">
        <div style={{
          padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
          background: 'rgba(0,115,122,0.06)', color: '#00737A', border: 'none',
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <span>🌐</span> EN
        </div>
        {isAuthed ? (
          <div style={{ position: 'relative' }}>
            <button onClick={() => setProfileMenuOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Avatar profile={profile} email={session?.user?.email} />
            </button>
            {profileMenuOpen && (
              <div style={{
                position: 'absolute', top: '100%', right: 0, marginTop: 10, width: 220,
                background: '#fff', borderRadius: 14, border: '1px solid #E4E8EA',
                boxShadow: '0 12px 32px rgba(44,62,67,0.16)', overflow: 'hidden', zIndex: 1,
              }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid #F2F4F5' }}>
                  <p style={{ fontFamily: 'Manrope,sans-serif', fontSize: 13, fontWeight: 800, color: '#2C3E43', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {profile?.full_name || 'Your Account'}
                  </p>
                  <p style={{ fontFamily: 'Manrope,sans-serif', fontSize: 12, color: '#9AAAB0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {profile?.email || session?.user?.email || ''}
                  </p>
                </div>
                <div style={{ padding: '6px 0', borderBottom: '1px solid #F2F4F5' }}>
                  {menuItems.map(([label, href]) => (
                    <button key={href} onClick={() => goToApp(href)} style={{
                      width: '100%', padding: '9px 16px', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer',
                      fontFamily: 'Manrope,sans-serif', fontSize: 13, fontWeight: 600, color: '#2C3E43',
                    }}>{label}</button>
                  ))}
                </div>
                <button onClick={handleLogout} style={{
                  width: '100%', padding: '12px 16px', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer',
                  fontFamily: 'Manrope,sans-serif', fontSize: 13, fontWeight: 700, color: '#EF4444',
                }}>Log Out</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Btn variant="ghost" size="sm" onClick={() => navigate('/auth?mode=login')}>Log in</Btn>
            <Btn variant="primary" size="sm" onClick={() => navigate('/auth?mode=signup')}>Get Started</Btn>
          </>
        )}
      </div>

      {/* Mobile hamburger */}
      <button className="md:hidden" onClick={() => setMob(v => !v)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2C3E43', padding: 4 }}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d={mob ? 'M3 3l16 16M19 3L3 19' : 'M3 6h16M3 11h16M3 16h16'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>

      {mob && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255,255,255,0.70)',
          padding: '12px 24px 20px', display: 'flex', flexDirection: 'column', gap: 4,
          boxShadow: '0 8px 32px rgba(44,62,67,0.10)',
        }}>
          {isAuthed && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 4px 12px' }}>
                <Avatar profile={profile} email={session?.user?.email} size={40} />
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontFamily: 'Manrope,sans-serif', fontSize: 13, fontWeight: 800, color: '#2C3E43', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {profile?.full_name || 'Your Account'}
                  </p>
                  <p style={{ fontFamily: 'Manrope,sans-serif', fontSize: 12, color: '#9AAAB0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {profile?.email || session?.user?.email || ''}
                  </p>
                </div>
              </div>
              {menuItems.map(([label, href]) => (
                <button key={href} onClick={() => goToApp(href)} style={{
                  padding: '10px 4px', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer',
                  fontFamily: 'Manrope,sans-serif', fontSize: 14, fontWeight: 600, color: '#00737A',
                }}>{label}</button>
              ))}
              <div style={{ borderBottom: '1px solid #F2F4F5', margin: '8px 0' }} />
            </>
          )}

          {centerLinks.map(([label, page]) => (
            <button key={page} onClick={() => goTo(page)} style={{
              padding: '12px 4px', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer',
              fontFamily: 'Manrope,sans-serif', fontSize: 15, fontWeight: 600, color: '#2C3E43',
              borderBottom: '1px solid #F2F4F5',
            }}>{label}</button>
          ))}

          <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
            {isAuthed ? (
              <Btn variant="secondary" size="md" fullWidth onClick={handleLogout}>Log Out</Btn>
            ) : (
              <>
                <Btn variant="secondary" size="md" fullWidth onClick={() => { setMob(false); navigate('/auth?mode=login') }}>Log in</Btn>
                <Btn variant="primary" size="md" fullWidth onClick={() => { setMob(false); navigate('/auth?mode=signup') }}>Get Started</Btn>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
