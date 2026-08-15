import {
  useState, useEffect, useRef, useCallback,
  type ReactNode, type CSSProperties, type PointerEvent as RE,
} from 'react'
import logoFull from '@/imports/20260723_170707.png'
import logoIcon from '@/imports/20260723_164632.png'
import logoWhite from '@/imports/20260723_165045.png'

// ─── Icon map (inline SVGs, no emoji) ────────────────────────────────────────
const MWI: Record<string, ReactNode> = {
  hospital:   <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="2" y="2" width="18" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M11 6v10M6 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  pill:       <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="7" y="2" width="8" height="12" rx="4" stroke="currentColor" strokeWidth="1.5"/><path d="M7 8h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M11 14v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  home:       <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 11l8-8 8 8v9.5H14v-6H8v6H3V11z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  cart:       <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M2 2h2.5l3 10.5A2 2 0 0 0 9.4 14H17a2 2 0 0 0 1.94-1.52L20.5 7H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="18.5" r="1.5" stroke="currentColor" strokeWidth="1.5"/><circle cx="17" cy="18.5" r="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>,
  doc:        <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M13 2H6.5A2.5 2.5 0 0 0 4 4.5v13A2.5 2.5 0 0 0 6.5 20h9a2.5 2.5 0 0 0 2.5-2.5V7L13 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M13 2v5h5M8 12h6M8 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  alert:      <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2L2 20h18L11 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M11 9v5M11 16v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  car:        <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4 15V9l3-5h8l3 5v6H4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><circle cx="7.5" cy="16.5" r="1.5" stroke="currentColor" strokeWidth="1.5"/><circle cx="14.5" cy="16.5" r="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M4 11h14" stroke="currentColor" strokeWidth="1.5"/></svg>,
  sun:        <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M11 2v2M11 18v2M2 11h2M18 11h2M4.93 4.93l1.41 1.41M15.66 15.66l1.41 1.41M4.93 17.07l1.41-1.41M15.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  heart:      <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 18.5s-8-5-8-10.5a5 5 0 0 1 8-4 5 5 0 0 1 8 4c0 5.5-8 10.5-8 10.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  shield:     <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2l8 3v5c0 4.5-3.5 8.5-8 10C6.5 18.5 3 14.5 3 10V5l8-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M7.5 11l2.5 2.5 5-5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  check:      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9.5l4.5 4.5 8-9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  lock:       <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="3.5" y="8" width="11" height="7.5" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M6 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  star:       <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1.5l2.2 4.5 5 .7-3.6 3.5.85 4.9L9 12.8l-4.45 2.3.85-4.9L1.8 6.7l5-.7L9 1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  globe:      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5"/><path d="M9 1.5C9 1.5 7 5 7 9s2 7.5 2 7.5M9 1.5C9 1.5 11 5 11 9s-2 7.5-2 7.5M1.5 9h15" stroke="currentColor" strokeWidth="1.4"/></svg>,
  phone:      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M6 2h6a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.5"/><circle cx="9" cy="13.5" r=".8" fill="currentColor"/></svg>,
  chat:       <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M15.5 12a2 2 0 0 1-2 2H5l-3 3V4a2 2 0 0 1 2-2h9.5a2 2 0 0 1 2 2v8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  card:       <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1.5" y="4.5" width="15" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M1.5 8h15" stroke="currentColor" strokeWidth="1.5"/></svg>,
  id:         <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1.5" y="4" width="15" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><circle cx="6" cy="9" r="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M9.5 7.5h4M9.5 10.5h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  search:     <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5"/><path d="M12 12l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  clock:      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5"/><path d="M9 5v5l3 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  pencil:     <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 12.5L12.5 3l2.5 2.5L5.5 15H3v-2.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  calendar:   <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1.5" y="3.5" width="15" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M1.5 8h15M6 2v3M12 2v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  pin:        <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2a6 6 0 0 1 6 6c0 4.5-6 12-6 12S5 12.5 5 8a6 6 0 0 1 6-6z" stroke="currentColor" strokeWidth="1.5"/><circle cx="11" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/></svg>,
  verified:   <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2l7 3v6c0 5-4 8-7 9-3-1-7-4-7-9V5l7-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M7.5 11l2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  target:     <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5"/><circle cx="9" cy="9" r="4" stroke="currentColor" strokeWidth="1.5"/><circle cx="9" cy="9" r="1.5" fill="currentColor"/></svg>,
  sparkles:   <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1.5L10.5 7 16 8.5 10.5 10 9 15.5 7.5 10 2 8.5 7.5 7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  money:      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1.5" y="4.5" width="15" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/><circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.4"/><path d="M4 4.5V14M14 4.5V14" stroke="currentColor" strokeWidth="1.4"/></svg>,
  plant:      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 16V9M9 9C9 5 5 2 2 3c1 3 3 6 7 6zM9 9c0-4 4-7 7-6-1 3-3 6-7 6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  mail:       <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1.5" y="4" width="15" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M1.5 6.5l7.5 5 7.5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  people:     <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="8" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5"/><path d="M2 19c0-3.87 2.69-6 6-6s6 2.13 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="15" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M17 13c2.3.8 4 2.8 4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
}

// ─── Photo helpers ────────────────────────────────────────────────────────────
const UP = (id: string, w = 900, h = 600) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`

const PHOTOS = {
  hero:       UP('photo-1773227055624-07b515ba87c5', 1200, 900),
  careHands:  UP('photo-1762955911431-4c44c7c3f408', 800, 600),
  agent1:     UP('photo-1592834448691-79fed8f0aae5', 400, 500),
  agent2:     UP('photo-1658314755707-1fbdf7c40145', 400, 500),
  agent3:     UP('photo-1691139601099-932c01ec198b', 400, 500),
  nurse:      UP('photo-1595023986775-e3e9ce35ca2f', 600, 700),
  team1:      UP('photo-1484863137850-59afcfe05386', 320, 320),
  team2:      UP('photo-1622253694238-3b22139576c6', 320, 320),
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Page = 'home'|'about'|'how-it-works'|'become-agent'|'services'|'contact'|'pricing'|'faq'|'privacy'|'terms'|'404'

// ─── Hooks ────────────────────────────────────────────────────────────────────
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

function useInView(threshold = 0.25) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

function useCountUp(target: number, active: boolean, duration = 1800) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    const start = Date.now()
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(eased * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, active, duration])
  return val
}

// ─── Interactive Glass Card ───────────────────────────────────────────────────
function IGCard({
  children, className = '', style = {}, tilt = false, hover = false, dark = false, accent = false,
}: {
  children: ReactNode; className?: string; style?: CSSProperties
  tilt?: boolean; hover?: boolean; dark?: boolean; accent?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [glow, setGlow] = useState({ x: 50, y: 50 })
  const [tiltXY, setTiltXY] = useState({ x: 0, y: 0 })
  const [hov, setHov] = useState(false)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current!.getBoundingClientRect()
    const rx = (e.clientX - r.left) / r.width
    const ry = (e.clientY - r.top) / r.height
    setGlow({ x: rx * 100, y: ry * 100 })
    if (tilt) setTiltXY({ x: (ry - 0.5) * -12, y: (rx - 0.5) * 12 })
  }
  const onLeave = () => { setHov(false); setTiltXY({ x: 0, y: 0 }) }

  const baseStyle: CSSProperties = dark ? {
    background: 'rgba(13,22,25,0.58)',
    backdropFilter: 'blur(28px) saturate(1.6)',
    WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
    border: '1px solid rgba(255,255,255,0.10)',
  } : accent ? {
    background: 'rgba(238,129,83,0.12)',
    backdropFilter: 'blur(24px) saturate(2)',
    WebkitBackdropFilter: 'blur(24px) saturate(2)',
    border: '1px solid rgba(238,129,83,0.28)',
  } : {
    background: 'rgba(255,255,255,0.62)',
    backdropFilter: 'blur(24px) saturate(1.9)',
    WebkitBackdropFilter: 'blur(24px) saturate(1.9)',
    border: '1px solid rgba(255,255,255,0.78)',
  }

  const liftShadow = dark
    ? '0 16px 48px rgba(0,0,0,0.35)'
    : '0 16px 44px rgba(44,62,67,0.14), inset 0 1px 0 rgba(255,255,255,0.95)'
  const restShadow = dark
    ? '0 8px 32px rgba(0,0,0,0.28)'
    : '0 4px 24px rgba(44,62,67,0.08), inset 0 1px 0 rgba(255,255,255,0.92)'

  const isMoving = tiltXY.x !== 0 || tiltXY.y !== 0

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={onLeave}
      className={`relative overflow-hidden ${className}`}
      style={{
        ...baseStyle,
        transform: tilt
          ? `perspective(900px) rotateX(${tiltXY.x}deg) rotateY(${tiltXY.y}deg)${hover && hov ? ' translateY(-6px)' : ''}`
          : hover && hov ? 'translateY(-5px)' : undefined,
        transition: isMoving ? 'transform 0.08s linear' : 'transform 0.5s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s',
        boxShadow: hov && hover ? liftShadow : restShadow,
        ...style,
      }}
    >
      {/* cursor glow */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', zIndex: 1,
        background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(255,255,255,${dark ? 0.10 : 0.28}) 0%, transparent 58%)`,
        opacity: hov ? 1 : 0,
        transition: 'opacity 0.35s',
      }} />
      {/* top specular */}
      <div aria-hidden style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1, borderRadius: 'inherit',
        background: 'linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.80) 40%,rgba(255,255,255,0.40) 70%,transparent 100%)',
        pointerEvents: 'none', zIndex: 1,
      }} />
      <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
    </div>
  )
}

// ─── Shared micro-components ──────────────────────────────────────────────────
function Btn({
  variant = 'primary', size = 'md', onClick, fullWidth, icon, children,
}: {
  variant?: 'primary'|'secondary'|'ghost'|'outline'|'accent'|'glass'|'glass-dark'
  size?: 'sm'|'md'|'lg'|'xl'; onClick?: () => void; fullWidth?: boolean
  icon?: ReactNode; children: ReactNode
}) {
  const sz = { sm:'px-4 py-2 text-sm gap-1.5', md:'px-5 py-2.5 text-sm gap-2', lg:'px-7 py-3.5 text-base gap-2', xl:'px-9 py-4 text-base gap-2.5' }[size]
  const vs: Record<string, CSSProperties> = {
    primary:     { background:'#00737A', color:'#fff', border:'1.5px solid #00737A', boxShadow:'0 2px 8px rgba(0,115,122,0.30), inset 0 1px 0 rgba(255,255,255,0.12)' },
    secondary:   { background:'#F2F4F5', color:'#2C3E43', border:'1.5px solid #E4E8EA' },
    ghost:       { background:'transparent', color:'#00737A', border:'1.5px solid transparent' },
    outline:     { background:'transparent', color:'#00737A', border:'1.5px solid #00737A' },
    accent:      { background:'#EE8153', color:'#fff', border:'1.5px solid #EE8153', boxShadow:'0 2px 8px rgba(238,129,83,0.30)' },
    glass:       { background:'rgba(255,255,255,0.55)', color:'#2C3E43', border:'1px solid rgba(255,255,255,0.80)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', boxShadow:'0 2px 12px rgba(44,62,67,0.08)' },
    'glass-dark':{ background:'rgba(255,255,255,0.12)', color:'#fff', border:'1px solid rgba(255,255,255,0.22)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)' },
  }
  return (
    <button onClick={onClick} className={`inline-flex items-center justify-center font-700 rounded-xl transition-all duration-150 select-none hover:brightness-105 active:scale-[0.97] ${sz} ${fullWidth ? 'w-full' : ''}`}
      style={{ fontFamily:'Manrope,sans-serif', cursor:'pointer', ...vs[variant] }}>
      {icon && <span style={{ width:18, height:18, display:'flex', alignItems:'center', justifyContent:'center' }}>{icon}</span>}
      {children}
    </button>
  )
}

function Chip({ children, color = '#00737A', bg }: { children: ReactNode; color?: string; bg?: string }) {
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:5,
      padding:'4px 12px', borderRadius:999, fontSize:12, fontWeight:700, letterSpacing:'0.02em',
      background: bg ?? `${color}15`, color,
    }}>{children}</span>
  )
}

function StarRow({ value = 5 }: { value?: number }) {
  return (
    <div style={{ display:'flex', gap:2 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="13" height="13" viewBox="0 0 13 13" fill={i<=value?'#EE8153':'#E4E8EA'}>
          <path d="M6.5 1l1.5 3.1 3.4.5-2.5 2.3.6 3.2-3-1.6-3 1.6.6-3.2-2.5-2.3 3.4-.5L6.5 1z"/>
        </svg>
      ))}
    </div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ nav, cur }: { nav: (p: Page) => void; cur: Page }) {
  const scrollP = useScrollProgress(120)
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t
  const [mob, setMob] = useState(false)

  const links: [string, Page][] = [
    ['How It Works','how-it-works'],['Services','services'],
    ['Become an Agent','become-agent'],['About','about'],['Contact','contact'],
  ]

  return (
    <nav style={{
      position:'fixed', top:0, left:0, right:0, zIndex:100,
      padding: `${lerp(18,10,scrollP)}px 32px`,
      background: `rgba(255,255,255,${lerp(0.45,0.88,scrollP)})`,
      backdropFilter: `blur(${lerp(14,40,scrollP)}px) saturate(${lerp(1.5,2.2,scrollP)})`,
      WebkitBackdropFilter: `blur(${lerp(14,40,scrollP)}px) saturate(${lerp(1.5,2.2,scrollP)})`,
      borderBottom: `1px solid rgba(255,255,255,${lerp(0.38,0.72,scrollP)})`,
      boxShadow: `0 4px 32px rgba(44,62,67,${lerp(0,0.07,scrollP)})`,
      display:'flex', alignItems:'center', justifyContent:'space-between',
    }}>
      <button onClick={() => nav('home')} style={{ background:'none', border:'none', cursor:'pointer', padding:0, display:'flex', alignItems:'center', gap:10 }}>
        <img src={logoFull} alt="ReadyPal" style={{ height:84, objectFit:'contain' }} />
      </button>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-1">
        {links.map(([label, page]) => (
          <button key={page} onClick={() => nav(page)} style={{
            padding:'7px 14px', borderRadius:10, border:'none', cursor:'pointer',
            fontFamily:'Manrope,sans-serif', fontSize:14, fontWeight:500,
            background: cur === page ? 'rgba(0,115,122,0.08)' : 'transparent',
            color: cur === page ? '#00737A' : '#4A5E65',
            transition:'all 0.15s',
          }}>{label}</button>
        ))}
      </div>

      <div className="hidden md:flex items-center gap-2.5">
        <div style={{
          padding:'4px 10px', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer',
          background:'rgba(0,115,122,0.06)', color:'#00737A', border:'none',
          display:'flex', alignItems:'center', gap:5,
        }}>
          <span>🌐</span> EN
        </div>
        <Btn variant="ghost" size="sm" onClick={() => nav('home')}>Log in</Btn>
        <Btn variant="primary" size="sm" onClick={() => nav('home')}>Get Started</Btn>
      </div>

      {/* Mobile hamburger */}
      <button className="md:hidden" onClick={() => setMob(v => !v)}
        style={{ background:'none', border:'none', cursor:'pointer', color:'#2C3E43', padding:4 }}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d={mob ? 'M3 3l16 16M19 3L3 19' : 'M3 6h16M3 11h16M3 16h16'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </button>

      {mob && (
        <div style={{
          position:'absolute', top:'100%', left:0, right:0,
          background:'rgba(255,255,255,0.96)', backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)',
          borderBottom:'1px solid rgba(255,255,255,0.70)',
          padding:'12px 24px 20px', display:'flex', flexDirection:'column', gap:4,
          boxShadow:'0 8px 32px rgba(44,62,67,0.10)',
        }}>
          {links.map(([label, page]) => (
            <button key={page} onClick={() => { nav(page); setMob(false) }} style={{
              padding:'12px 4px', textAlign:'left', border:'none', background:'none', cursor:'pointer',
              fontFamily:'Manrope,sans-serif', fontSize:15, fontWeight:600, color:'#2C3E43',
              borderBottom:'1px solid #F2F4F5',
            }}>{label}</button>
          ))}
          <div style={{ marginTop:12, display:'flex', gap:10 }}>
            <Btn variant="secondary" size="md" fullWidth onClick={() => setMob(false)}>Log in</Btn>
            <Btn variant="primary" size="md" fullWidth onClick={() => setMob(false)}>Get Started</Btn>
          </div>
        </div>
      )}
    </nav>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ nav }: { nav: (p: Page) => void }) {
  const links: [string, Page[]][] = [
    ['Platform', ['how-it-works','services','pricing','faq']],
    ['Company',  ['about','become-agent','contact']],
    ['Legal',    ['privacy','terms']],
  ]
  const labels: Record<Page, string> = {
    'home':'Home','about':'About','how-it-works':'How It Works','become-agent':'Become an Agent',
    'services':'Services','contact':'Contact','pricing':'Pricing','faq':'FAQ',
    'privacy':'Privacy Policy','terms':'Terms & Conditions','404':'404',
  }

  return (
    <footer style={{
      background:'#1A2A2F', color:'rgba(255,255,255,0.7)',
      padding:'64px 32px 32px', fontFamily:'Manrope,sans-serif',
    }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:48, marginBottom:56 }}
          className="grid-responsive-footer">
          <div>
            <img src={logoFull} alt="ReadyPal" style={{ height:94, objectFit:'contain', marginBottom:16, filter:'brightness(0) invert(1)' }} />
            <p style={{ fontSize:14, lineHeight:1.7, maxWidth:300, color:'rgba(255,255,255,0.55)' }}>
              Connecting Sri Lankan families abroad with verified care agents — compassionate, trusted, always close.
            </p>
            <div style={{ display:'flex', gap:12, marginTop:20 }}>
              {['f','in','tw','yt'].map(s => (
                <div key={s} style={{
                  width:36, height:36, borderRadius:10, background:'rgba(255,255,255,0.08)',
                  border:'1px solid rgba(255,255,255,0.12)',
                  display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
                  color:'rgba(255,255,255,0.50)', fontSize:12, fontWeight:700,
                  transition:'all 0.15s',
                }}>{s.toUpperCase()}</div>
              ))}
            </div>
          </div>
          {links.map(([group, pages]) => (
            <div key={group}>
              <p style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.35)', letterSpacing:'0.10em', textTransform:'uppercase', marginBottom:16 }}>{group}</p>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {pages.map(p => (
                  <button key={p} onClick={() => nav(p)} style={{
                    background:'none', border:'none', cursor:'pointer', textAlign:'left',
                    fontFamily:'Manrope,sans-serif', fontSize:14, fontWeight:500,
                    color:'rgba(255,255,255,0.60)', padding:0, transition:'color 0.15s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.60)')}>
                    {labels[p]}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div>
            <p style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.35)', letterSpacing:'0.10em', textTransform:'uppercase', marginBottom:16 }}>Newsletter</p>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.50)', marginBottom:12 }}>Get care tips & ReadyPal news.</p>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              <input placeholder="your@email.com" style={{
                padding:'10px 14px', borderRadius:10, border:'1px solid rgba(255,255,255,0.15)',
                background:'rgba(255,255,255,0.08)', color:'#fff', fontSize:13,
                fontFamily:'Manrope,sans-serif', outline:'none',
              }} />
              <Btn variant="primary" size="sm" fullWidth>Subscribe</Btn>
            </div>
          </div>
        </div>
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:24, display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <p style={{ fontSize:13, color:'rgba(255,255,255,0.35)' }}>© 2025 ReadyPal Pvt Ltd. All rights reserved.</p>
          <div style={{ display:'flex', gap:20 }}>
            {(['privacy','terms'] as Page[]).map(p => (
              <button key={p} onClick={() => nav(p)} style={{
                background:'none', border:'none', cursor:'pointer',
                fontSize:13, color:'rgba(255,255,255,0.35)', fontFamily:'Manrope,sans-serif',
                transition:'color 0.15s',
              }}>{labels[p]}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  HOME PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function HomePage({ nav }: { nav: (p: Page) => void }) {
  // Parallax hero state
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLDivElement>(null)

  const onHeroMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = heroRef.current!.getBoundingClientRect()
    setMouse({
      x: ((e.clientX - r.left) / r.width - 0.5) * 20,
      y: ((e.clientY - r.top) / r.height - 0.5) * 20,
    })
  }

  // Stats counter
  const { ref: statsRef, inView: statsInView } = useInView()
  const c1 = useCountUp(2400, statsInView)
  const c2 = useCountUp(18500, statsInView)
  const c3 = useCountUp(3200, statsInView)
  const c4 = useCountUp(49, statsInView)

  // Testimonial carousel
  const [testIdx, setTestIdx] = useState(0)
  const testimonials = [
    { name:'Kamala Jayasuriya',  loc:'Melbourne, Australia', text:'"ReadyPal has given us complete peace of mind. Chamari visits our mother three times a week and sends detailed reports with photos. It honestly feels like we\'re right there with her."', rating:5, role:'Family in Melbourne' },
    { name:'Roshan Wijesekara', loc:'London, UK',           text:'"The verification process is thorough and the platform is easy to use. Priya has been exceptional with our father in Kandy. Real-time updates after every visit are a lifesaver."', rating:5, role:'Family in London' },
    { name:'Nadeeka Seneviratne',loc:'Toronto, Canada',      text:'"We found a wonderful care agent within two days. The secure messaging keeps us connected. I can\'t imagine managing Dad\'s care without ReadyPal."', rating:5, role:'Family in Toronto' },
    { name:'Suresh Amarasinghe', loc:'Sydney, Australia',    text:'"Transparent pricing, verified agents, real-time check-ins — ReadyPal has thought of everything. Our whole family feels so much calmer knowing Amma is in safe hands."', rating:5, role:'Family in Sydney' },
  ]

  // FAQ state
  const [faqOpen, setFaqOpen] = useState<number|null>(0)
  const faqs = [
    { q:'How are care agents verified?',       a:'Every agent undergoes a three-stage vetting: national ID check, police clearance certificate, and a video interview with our care coordinators. Only 1 in 5 applicants passes.' },
    { q:'How do I receive updates about care?', a:'After every visit, agents submit a care report with photos and structured notes. You receive a push notification and email instantly.' },
    { q:'What if I\'m not happy with my agent?', a:'We offer a 48-hour replacement guarantee. If you\'re unsatisfied with your first match, we\'ll find a new agent at zero extra cost.' },
    { q:'Are payments secure?',                a:'Yes. All payments are processed through PCI-DSS compliant gateways. Your card details are never stored on our servers.' },
    { q:'Can I schedule visits on short notice?', a:'Most of our agents accept requests 24 hours in advance. For emergency situations, we have on-call agents in Colombo, Kandy, and Galle.' },
  ]

  const services = [
    { icon:'hospital', label:'Hospital Companion',          desc:'We accompany your loved one to hospital visits and medical appointments.' },
    { icon:'pill',     label:'Medication Collection',       desc:'Agents collect prescriptions and ensure medications are taken on schedule.' },
    { icon:'home',     label:'Home Visits',                 desc:'Regular welfare check-ins and light household assistance.' },
    { icon:'cart',     label:'Grocery Assistance',          desc:'Weekly shopping runs with fresh produce and household essentials.' },
    { icon:'doc',      label:'Bill Payments',               desc:'Utility bills, government payments, and bank errands handled reliably.' },
    { icon:'alert',    label:'Emergency Assistance',        desc:'On-call support available for urgent situations.' },
    { icon:'car',      label:'Transportation',              desc:'Safe transport to appointments, family visits, and events.' },
    { icon:'sun',      label:'Daily Well-being Visits',     desc:'Companionship, light exercise, and morning routine support.' },
    { icon:'heart',    label:'Medical Appt. Assistance',    desc:'Appointment coordination, doctor briefings, and follow-up care.' },
  ]

  return (
    <div>
      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section ref={heroRef} onMouseMove={onHeroMove}
        style={{ minHeight:'100vh', display:'flex', alignItems:'center', paddingTop:100, paddingBottom:80, paddingLeft:32, paddingRight:32, position:'relative', overflow:'hidden', background:'linear-gradient(160deg,#F0F7F8 0%,#F9F6F3 60%,#F5EDE8 100%)' }}>
        {/* mesh blobs */}
        <div aria-hidden style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
          <div style={{ position:'absolute', top:-120, left:-80, width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle,rgba(0,149,158,0.18) 0%,transparent 70%)', filter:'blur(2px)' }} />
          <div style={{ position:'absolute', bottom:-100, right:-60, width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(238,129,83,0.14) 0%,transparent 70%)' }} />
        </div>

        <div style={{ maxWidth:1200, margin:'0 auto', width:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }} className="hero-grid">
          {/* Left */}
          <div>
            <div style={{ marginBottom:20 }}>
              <Chip>✦ Trusted by 3,200+ Sri Lankan families worldwide</Chip>
            </div>
            <h1 style={{ fontSize:'clamp(36px,5vw,60px)', fontWeight:900, color:'#2C3E43', lineHeight:1.1, letterSpacing:'-0.025em', marginBottom:20 }}>
              Care that feels like{' '}
              <span className="text-gradient">family,</span>
              <br />close to home.
            </h1>
            <p style={{ fontSize:18, color:'#4A5E65', lineHeight:1.7, maxWidth:480, marginBottom:32 }}>
              ReadyPal connects Sri Lankan families abroad with verified, compassionate care agents who look after your elderly parents — just as you would.
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:12, marginBottom:40 }}>
              <Btn variant="primary" size="lg" onClick={() => nav('how-it-works')}>Post a Care Request</Btn>
              <Btn variant="outline" size="lg" onClick={() => nav('how-it-works')}>See How It Works</Btn>
            </div>
            {/* Trust badges */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:16 }}>
              {[
                { icon:'check',  label:'Verified Agents' },
                { icon:'lock',   label:'Secure Payments' },
                { icon:'star',   label:'4.9 / 5 Rating' },
                { icon:'globe',  label:'24/7 Support' },
              ].map(t => (
                <div key={t.label} style={{ display:'flex', alignItems:'center', gap:7 }}>
                  <span style={{ width:22, height:22, borderRadius:6, background:'rgba(0,115,122,0.10)', display:'flex', alignItems:'center', justifyContent:'center', color:'#00737A' }}>{MWI[t.icon]}</span>
                  <span style={{ fontSize:13, fontWeight:600, color:'#4A5E65' }}>{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — photo + floating glass cards */}
          <div style={{ position:'relative', height:560 }}>
            {/* Main photo */}
            <div className="animate-float" style={{
              position:'absolute', right:0, top:20, width:'80%', height:460, borderRadius:28,
              overflow:'hidden', boxShadow:'0 24px 64px rgba(44,62,67,0.18)',
              transform:`translate(${mouse.x * 0.5}px, ${mouse.y * 0.4}px)`,
              transition:'transform 0.2s linear',
            }}>
              <img src={PHOTOS.hero} alt="Caregiver assisting elderly" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(44,62,67,0.25) 0%,transparent 60%)' }} />
            </div>

            {/* Rating float card */}
            <div className="animate-float2" style={{
              position:'absolute', top:40, left:0,
              transform:`translate(${mouse.x * -0.8}px, ${mouse.y * -0.6}px)`,
              transition:'transform 0.25s linear',
            }}>
              <IGCard style={{ padding:'14px 18px', borderRadius:18, minWidth:180 }} hover>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:40, height:40, borderRadius:12, overflow:'hidden', flexShrink:0 }}>
                    <img src={PHOTOS.agent1} alt="Agent" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  </div>
                  <div>
                    <div style={{ display:'flex', gap:2, marginBottom:2 }}>
                      <StarRow value={5} />
                    </div>
                    <p style={{ fontSize:12, fontWeight:700, color:'#2C3E43' }}>4.9 / 5.0 Rating</p>
                    <p style={{ fontSize:11, color:'#9AAAB0' }}>18,500+ reviews</p>
                  </div>
                </div>
              </IGCard>
            </div>

            {/* Visit completed card */}
            <div className="animate-float3" style={{
              position:'absolute', bottom:80, left:-10,
              transform:`translate(${mouse.x * -0.6}px, ${mouse.y * 0.5}px)`,
              transition:'transform 0.3s linear',
            }}>
              <IGCard style={{ padding:'12px 16px', borderRadius:16, minWidth:220 }} hover>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:'#F0FDF4', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>✓</div>
                  <div>
                    <p style={{ fontSize:13, fontWeight:700, color:'#2C3E43' }}>Visit Completed</p>
                    <p style={{ fontSize:11, color:'#9AAAB0' }}>Today · 9:00 AM · Chamari</p>
                  </div>
                </div>
              </IGCard>
            </div>

            {/* Verified badge */}
            <div style={{
              position:'absolute', top:200, right:-12,
              transform:`translate(${mouse.x * 0.7}px, ${mouse.y * 0.3}px)`,
              transition:'transform 0.2s linear',
            }}>
              <IGCard style={{ padding:'10px 14px', borderRadius:14 }} accent>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:20 }}>🛡️</span>
                  <div>
                    <p style={{ fontSize:12, fontWeight:700, color:'#D4663D' }}>Fully Verified</p>
                    <p style={{ fontSize:11, color:'#9AAAB0' }}>2,400+ agents</p>
                  </div>
                </div>
              </IGCard>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. STATS ─────────────────────────────────────────────────────── */}
      <section ref={statsRef} style={{ padding:'64px 32px', background:'#fff' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20 }} className="stats-grid">
          {[
            { label:'Verified Care Agents', val:c1, suffix:'+', icon:'verified' },
            { label:'Completed Care Visits', val:c2, suffix:'+', icon:'people' },
            { label:'Families Supported', val:c3, suffix:'+', icon:'heart' },
            { label:'Average Rating', val:c4 / 10, suffix:'/5', icon:'star', isFloat:true },
          ].map(s => (
            <IGCard key={s.label} style={{ borderRadius:20, padding:24 }} hover>
              <div style={{ color:'#00737A', marginBottom:8, display:'flex' }}>{MWI[s.icon]}</div>
              <div style={{ fontSize:40, fontWeight:900, color:'#00737A', letterSpacing:'-0.02em', lineHeight:1 }}>
                {s.isFloat ? (s.val as number).toFixed(1) : s.val.toLocaleString()}{s.suffix}
              </div>
              <p style={{ fontSize:14, fontWeight:500, color:'#6B7E85', marginTop:6 }}>{s.label}</p>
            </IGCard>
          ))}
        </div>
      </section>

      {/* ── 3. WHY CHOOSE ─────────────────────────────────────────────────── */}
      <section style={{ padding:'96px 32px', background:'#F9F9F9' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:64 }}>
            <Chip>Why ReadyPal</Chip>
            <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:900, color:'#2C3E43', marginTop:12, letterSpacing:'-0.02em' }}>
              Built for families who care deeply
            </h2>
            <p style={{ fontSize:17, color:'#6B7E85', maxWidth:520, margin:'16px auto 0', lineHeight:1.65 }}>
              Every feature is designed to give you confidence, clarity, and peace of mind from wherever you are in the world.
            </p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }} className="features-grid">
            {[
              { icon:'shield',    title:'Verified Care Agents',    desc:'Every agent passes police clearance, ID verification, and a video interview. Only trusted professionals reach your family.' },
              { icon:'money',     title:'Transparent Pricing',     desc:'No hidden fees. See exact agent rates upfront. Pay securely through the platform — no cash handovers.' },
              { icon:'phone',     title:'Real-time Updates',       desc:'Photo reports after every visit. Live notifications when agents check in and out. Always in the loop.' },
              { icon:'lock',      title:'Secure Payments',         desc:'PCI-DSS compliant payment processing. Escrow-style release means agents are paid only on completion.' },
              { icon:'doc',       title:'Task Tracking',           desc:'Set care tasks, track completions, leave notes for agents, and review care history at any time.' },
              { icon:'globe',     title:'Multilingual Support',    desc:'Platform available in English, Sinhala, and Tamil. Support team reachable across time zones 24/7.' },
            ].map(f => (
              <IGCard key={f.title} style={{ borderRadius:20, padding:28 }} tilt hover>
                <div style={{ width:52, height:52, borderRadius:16, background:'rgba(0,115,122,0.09)', display:'flex', alignItems:'center', justifyContent:'center', color:'#00737A', marginBottom:16 }}>{MWI[f.icon]}</div>
                <h3 style={{ fontSize:17, fontWeight:800, color:'#2C3E43', marginBottom:8 }}>{f.title}</h3>
                <p style={{ fontSize:14, color:'#6B7E85', lineHeight:1.65 }}>{f.desc}</p>
              </IGCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. HOW IT WORKS ─────────────────────────────────────────────── */}
      <section style={{ padding:'96px 32px', background:'#fff', overflow:'hidden' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:64 }}>
            <Chip>Process</Chip>
            <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:900, color:'#2C3E43', marginTop:12, letterSpacing:'-0.02em' }}>
              Care arranged in 5 simple steps
            </h2>
          </div>
          <div style={{ display:'flex', alignItems:'flex-start', gap:0, position:'relative' }}>
            <div style={{ position:'absolute', top:24, left:'10%', right:'10%', height:2, background:'linear-gradient(90deg,#00737A,#00959E 50%,#EE8153)', zIndex:0, opacity:0.35, borderRadius:1 }} />
            {[
              { n:1, icon:'pencil',   title:'Post a Request',      desc:'Describe your parent\'s care needs, location, and schedule.' },
              { n:2, icon:'chat',     title:'Receive Applications',desc:'Verified agents in your area apply to your request.' },
              { n:3, icon:'search',   title:'Choose an Agent',     desc:'Review profiles, ratings, and interview candidates.' },
              { n:4, icon:'pin',      title:'Track Progress',      desc:'Real-time check-ins, photo reports, and care logs.' },
              { n:5, icon:'star',     title:'Review & Rate',       desc:'Rate your experience and help other families choose.' },
            ].map((step, i) => (
              <div key={step.n} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', position:'relative', zIndex:1 }}>
                <IGCard style={{ width:56, height:56, borderRadius:18, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16, fontSize:24, flexShrink:0, padding:0 }}>
                  <span style={{ color:'#00737A', display:'flex' }}>{MWI[step.icon]}</span>
                </IGCard>
                <div style={{ width:22, height:22, borderRadius:'50%', background:'#00737A', color:'#fff', fontSize:11, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', position:'absolute', top:0, right:'calc(50% - 28px)', border:'2px solid #fff' }}>{step.n}</div>
                <h4 style={{ fontSize:14, fontWeight:800, color:'#2C3E43', marginBottom:6 }}>{step.title}</h4>
                <p style={{ fontSize:12, color:'#6B7E85', lineHeight:1.5, maxWidth:140 }}>{step.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign:'center', marginTop:48 }}>
            <Btn variant="primary" size="lg" onClick={() => nav('how-it-works')}>See the Full Process →</Btn>
          </div>
        </div>
      </section>

      {/* ── 5. SERVICES ─────────────────────────────────────────────────── */}
      <section style={{ padding:'96px 32px', background:'#F9F9F9' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:64 }}>
            <Chip>Services</Chip>
            <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:900, color:'#2C3E43', marginTop:12, letterSpacing:'-0.02em' }}>
              Every kind of care, covered
            </h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }} className="services-grid">
            {services.map(s => (
              <IGCard key={s.label} style={{ borderRadius:18, padding:'20px 22px' }} hover>
                <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
                  <div style={{ width:46, height:46, borderRadius:14, background:'rgba(0,115,122,0.09)', display:'flex', alignItems:'center', justifyContent:'center', color:'#00737A', flexShrink:0 }}>{MWI[s.icon]}</div>
                  <div>
                    <h4 style={{ fontSize:14, fontWeight:700, color:'#2C3E43', marginBottom:5 }}>{s.label}</h4>
                    <p style={{ fontSize:13, color:'#6B7E85', lineHeight:1.55, marginBottom:10 }}>{s.desc}</p>
                    <button onClick={() => nav('services')} style={{
                      background:'none', border:'none', cursor:'pointer', fontSize:12, fontWeight:700,
                      color:'#00737A', fontFamily:'Manrope,sans-serif', padding:0,
                      display:'flex', alignItems:'center', gap:4,
                    }}>Learn More →</button>
                  </div>
                </div>
              </IGCard>
            ))}
          </div>
          <div style={{ textAlign:'center', marginTop:40 }}>
            <Btn variant="outline" size="lg" onClick={() => nav('services')}>View All Services</Btn>
          </div>
        </div>
      </section>

      {/* ── 6. TRUST & SAFETY ──────────────────────────────────────────── */}
      <section style={{ padding:'96px 32px', background:'linear-gradient(160deg,#1A2A2F 0%,#0D1619 100%)', position:'relative', overflow:'hidden' }}>
        <div aria-hidden style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
          <div style={{ position:'absolute', top:-100, right:-100, width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(0,115,122,0.20) 0%,transparent 70%)' }} />
          <div style={{ position:'absolute', bottom:-80, left:-80, width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(238,129,83,0.12) 0%,transparent 70%)' }} />
        </div>
        <div style={{ maxWidth:1100, margin:'0 auto', position:'relative', zIndex:1 }}>
          <div style={{ textAlign:'center', marginBottom:64 }}>
            <Chip color="#EE8153" bg="rgba(238,129,83,0.15)">Trust & Safety</Chip>
            <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:900, color:'#fff', marginTop:12, letterSpacing:'-0.02em' }}>
              Your family's safety is our<br />
              <span className="text-gradient-warm">non-negotiable.</span>
            </h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }} className="trust-grid">
            {[
              { icon:'id',       title:'Identity Verification',    desc:'Government-issued ID checked against national registry databases.' },
              { icon:'search',   title:'Police Clearance',         desc:'Clean criminal record is mandatory. No exceptions.' },
              { icon:'star',     title:'Ratings & Reviews',        desc:'Transparent performance history visible to all families.' },
              { icon:'chat',     title:'Secure Messaging',         desc:'End-to-end encrypted chat. Your conversations stay private.' },
              { icon:'card',     title:'Encrypted Payments',       desc:'All transactions secured with 256-bit SSL encryption.' },
              { icon:'doc',      title:'Verified Documents',       desc:'Professional certifications and training records validated.' },
            ].map(t => (
              <IGCard key={t.title} dark style={{ borderRadius:18, padding:'22px 24px' }} hover>
                <div style={{ color:'rgba(255,255,255,0.80)', marginBottom:12, display:'flex' }}>{MWI[t.icon]}</div>
                <h4 style={{ fontSize:15, fontWeight:700, color:'#fff', marginBottom:6 }}>{t.title}</h4>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.55)', lineHeight:1.6 }}>{t.desc}</p>
              </IGCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. TESTIMONIALS ────────────────────────────────────────────── */}
      <section style={{ padding:'96px 32px', background:'#fff', overflow:'hidden' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <Chip>Testimonials</Chip>
            <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:900, color:'#2C3E43', marginTop:12, letterSpacing:'-0.02em' }}>
              Families trust ReadyPal
            </h2>
          </div>
          <div style={{ position:'relative' }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:20 }} className="testimonials-grid">
              {testimonials.map((t, i) => (
                <IGCard key={i} style={{ borderRadius:22, padding:28 }} hover>
                  <div style={{ display:'flex', gap:3, marginBottom:12 }}><StarRow value={t.rating} /></div>
                  <p style={{ fontSize:15, lineHeight:1.7, color:'#4A5E65', marginBottom:20, fontStyle:'italic' }}>{t.text}</p>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,#00737A,#00959E)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:16, fontWeight:800, flexShrink:0 }}>
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontSize:14, fontWeight:700, color:'#2C3E43' }}>{t.name}</p>
                      <p style={{ fontSize:12, color:'#9AAAB0' }}>{t.loc} · {t.role}</p>
                    </div>
                  </div>
                </IGCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. BECOME AN AGENT CTA ─────────────────────────────────────── */}
      <section style={{ padding:'96px 32px', background:'linear-gradient(135deg,#00737A 0%,#00959E 60%,#EE8153 100%)', position:'relative', overflow:'hidden' }}>
        <div aria-hidden style={{ position:'absolute', inset:0, pointerEvents:'none', opacity:0.15 }}>
          <div className="bg-grid" style={{ position:'absolute', inset:0 }} />
        </div>
        <div style={{ maxWidth:1000, margin:'0 auto', position:'relative', zIndex:1 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }} className="agent-grid">
            <div style={{ color:'#fff' }}>
              <Chip color="#fff" bg="rgba(255,255,255,0.18)">For Care Agents</Chip>
              <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:900, lineHeight:1.15, letterSpacing:'-0.02em', marginTop:16, marginBottom:16 }}>
                Turn compassion into a fulfilling career.
              </h2>
              <p style={{ fontSize:16, lineHeight:1.7, color:'rgba(255,255,255,0.82)', marginBottom:32 }}>
                Join 2,400+ verified care agents earning flexible income while making a real difference to families across Sri Lanka.
              </p>
              <Btn variant="glass-dark" size="lg" onClick={() => nav('become-agent')}>Become a Care Agent →</Btn>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              {[
                { icon:'calendar', title:'Flexible Schedule',  desc:'Work the hours that suit you.' },
                { icon:'money',    title:'Extra Income',       desc:'Reliable earnings paid weekly.' },
                { icon:'heart',    title:'Meaningful Work',    desc:'Make a real impact daily.' },
                { icon:'plant',    title:'Community Impact',   desc:'Support families in need.' },
              ].map(b => (
                <IGCard key={b.title} style={{ borderRadius:16, padding:'18px 16px' }} dark hover>
                  <div style={{ color:'rgba(255,255,255,0.80)', marginBottom:8, display:'flex' }}>{MWI[b.icon]}</div>
                  <p style={{ fontSize:14, fontWeight:700, color:'#fff', marginBottom:4 }}>{b.title}</p>
                  <p style={{ fontSize:12, color:'rgba(255,255,255,0.55)', lineHeight:1.5 }}>{b.desc}</p>
                </IGCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. FAQ ──────────────────────────────────────────────────────── */}
      <section style={{ padding:'96px 32px', background:'#F9F9F9' }}>
        <div style={{ maxWidth:780, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <Chip>FAQ</Chip>
            <h2 style={{ fontSize:'clamp(26px,4vw,40px)', fontWeight:900, color:'#2C3E43', marginTop:12, letterSpacing:'-0.02em' }}>
              Questions? We have answers.
            </h2>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {faqs.map((f, i) => (
              <IGCard key={i} style={{ borderRadius:16, overflow:'hidden', padding:0 }}>
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{
                  width:'100%', textAlign:'left', padding:'18px 22px', border:'none', cursor:'pointer',
                  background:'none', fontFamily:'Manrope,sans-serif', fontSize:15, fontWeight:700,
                  color: faqOpen === i ? '#00737A' : '#2C3E43',
                  display:'flex', justifyContent:'space-between', alignItems:'center',
                  transition:'color 0.15s',
                }}>
                  {f.q}
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink:0, transition:'transform 0.2s', transform: faqOpen === i ? 'rotate(180deg)' : 'none' }}>
                    <path d="M4 6l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                </button>
                {faqOpen === i && (
                  <p className="animate-fade-in" style={{ padding:'0 22px 18px', fontSize:14, lineHeight:1.7, color:'#4A5E65' }}>{f.a}</p>
                )}
              </IGCard>
            ))}
          </div>
          <div style={{ textAlign:'center', marginTop:40 }}>
            <button onClick={() => nav('faq')} style={{
              background:'none', border:'none', cursor:'pointer', fontSize:14, fontWeight:600,
              color:'#00737A', fontFamily:'Manrope,sans-serif',
            }}>View all FAQs →</button>
          </div>
        </div>
      </section>

      {/* ── 10. FINAL CTA ───────────────────────────────────────────────── */}
      <section style={{ padding:'120px 32px', background:'#fff', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div aria-hidden style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:700, height:700, borderRadius:'50%', background:'radial-gradient(circle,rgba(0,115,122,0.06) 0%,transparent 70%)' }} />
        </div>
        <div style={{ position:'relative', zIndex:1, maxWidth:600, margin:'0 auto' }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🤝</div>
          <h2 style={{ fontSize:'clamp(32px,5vw,56px)', fontWeight:900, color:'#2C3E43', lineHeight:1.1, letterSpacing:'-0.025em', marginBottom:16 }}>
            Give your loved ones<br />
            <span className="text-gradient">the care they deserve.</span>
          </h2>
          <p style={{ fontSize:17, color:'#6B7E85', lineHeight:1.7, marginBottom:40 }}>
            Join 3,200+ families who trust ReadyPal to care for their parents back home. Start your first care request in under 5 minutes.
          </p>
          <div style={{ display:'flex', justifyContent:'center', flexWrap:'wrap', gap:14 }}>
            <Btn variant="primary" size="xl" onClick={() => nav('how-it-works')}>Create Your First Care Request</Btn>
            <Btn variant="outline" size="xl" onClick={() => nav('how-it-works')}>Learn More</Btn>
          </div>
        </div>
      </section>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  ABOUT PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function AboutPage({ nav }: { nav: (p: Page) => void }) {
  return (
    <div style={{ paddingTop:90 }}>
      {/* Hero */}
      <section style={{ padding:'80px 32px 64px', background:'linear-gradient(160deg,#F0F7F8,#F9F6F3)', textAlign:'center' }}>
        <div style={{ maxWidth:720, margin:'0 auto' }}>
          <Chip>About ReadyPal</Chip>
          <h1 style={{ fontSize:'clamp(32px,5vw,52px)', fontWeight:900, color:'#2C3E43', marginTop:16, marginBottom:16, letterSpacing:'-0.025em', lineHeight:1.1 }}>
            Born from a real family<br /><span className="text-gradient">struggle.</span>
          </h1>
          <p style={{ fontSize:17, color:'#4A5E65', lineHeight:1.7, marginBottom:36 }}>
            ReadyPal began when our founder, living in London, couldn't find a trustworthy person to check in on his aging parents in Colombo. He spent months with no reliable way to ensure they were safe. That frustration became our mission.
          </p>
        </div>
        <div style={{ maxWidth:800, margin:'0 auto', borderRadius:28, overflow:'hidden', boxShadow:'0 24px 64px rgba(44,62,67,0.12)', height:420 }}>
          <img src={PHOTOS.careHands} alt="Caregiver with elderly family" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section style={{ padding:'80px 32px', background:'#fff' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }} className="mission-grid">
          {[
            { label:'Mission', icon:'target',   text:'To make trusted elderly care accessible to every Sri Lankan family abroad — removing distance as a barrier to love and safety.' },
            { label:'Vision',  icon:'sparkles', text:'A world where no family has to choose between their career abroad and the wellbeing of their parents back home.' },
            { label:'Values',  icon:'heart',    text:'Trust, transparency, compassion, and technology — these four values shape every decision we make at ReadyPal.' },
          ].map(m => (
            <IGCard key={m.label} style={{ borderRadius:20, padding:28 }} hover>
              <div style={{ width:52, height:52, borderRadius:16, background:'rgba(0,115,122,0.09)', display:'flex', alignItems:'center', justifyContent:'center', color:'#00737A', marginBottom:16 }}>{MWI[m.icon]}</div>
              <h3 style={{ fontSize:18, fontWeight:800, color:'#2C3E43', marginBottom:10 }}>{m.label}</h3>
              <p style={{ fontSize:14, color:'#6B7E85', lineHeight:1.7 }}>{m.text}</p>
            </IGCard>
          ))}
        </div>
      </section>

      {/* Team */}
      <section style={{ padding:'80px 32px', background:'#F9F9F9' }}>
        <div style={{ maxWidth:1000, margin:'0 auto', textAlign:'center', marginBottom:56 }}>
          <Chip>Leadership</Chip>
          <h2 style={{ fontSize:'clamp(26px,4vw,40px)', fontWeight:900, color:'#2C3E43', marginTop:12, letterSpacing:'-0.02em' }}>The people behind ReadyPal</h2>
        </div>
        <div style={{ maxWidth:1000, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }} className="team-grid">
          {[
            { name:'Dinesh Perera',   role:'CEO & Co-founder',   img:PHOTOS.agent2 },
            { name:'Nadeeka Jayawardena', role:'CTO',             img:PHOTOS.agent3 },
            { name:'Chamari Silva',   role:'Head of Operations',  img:PHOTOS.agent1 },
          ].map(p => (
            <IGCard key={p.name} style={{ borderRadius:20, padding:24, textAlign:'center' }} hover>
              <div style={{ width:100, height:100, borderRadius:'50%', overflow:'hidden', margin:'0 auto 16px', border:'3px solid rgba(0,115,122,0.20)' }}>
                <img src={p.img} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              </div>
              <p style={{ fontSize:16, fontWeight:800, color:'#2C3E43' }}>{p.name}</p>
              <p style={{ fontSize:13, color:'#9AAAB0', marginTop:4 }}>{p.role}</p>
            </IGCard>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding:'80px 32px', background:'#fff' }}>
        <div style={{ maxWidth:800, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <Chip>Our Journey</Chip>
            <h2 style={{ fontSize:'clamp(26px,4vw,40px)', fontWeight:900, color:'#2C3E43', marginTop:12, letterSpacing:'-0.02em' }}>ReadyPal timeline</h2>
          </div>
          {[
            { year:'2021', title:'The idea is born',         desc:'Dinesh spends 3 weeks trying to organise care for his father from London — and finds nothing he can trust.' },
            { year:'2022', title:'Research & validation',    desc:'50 families interviewed. The need is universal. ReadyPal begins as a prototype.' },
            { year:'2023', title:'Beta launch in Colombo',   desc:'120 verified agents. 300 families on waitlist. First 1,000 care visits completed.' },
            { year:'2024', title:'National expansion',       desc:'Live in 8 cities. Series A raised. 10,000+ visits completed. 4.9/5 average rating.' },
            { year:'2025', title:'International growth',     desc:'Partnerships with diaspora organisations in UK, Australia & Canada. 3,200+ families.' },
          ].map((e, i) => (
            <div key={e.year} style={{ display:'flex', gap:24, marginBottom: i < 4 ? 0 : 0 }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:60, flexShrink:0 }}>
                <div style={{ width:44, height:44, borderRadius:14, background:'linear-gradient(135deg,#00737A,#00959E)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:11, fontWeight:800, flexShrink:0 }}>{e.year}</div>
                {i < 4 && <div style={{ width:2, flex:1, background:'linear-gradient(180deg,#00737A30,transparent)', minHeight:40, marginTop:4 }} />}
              </div>
              <IGCard style={{ borderRadius:16, padding:'16px 20px', marginBottom:16, flex:1 }}>
                <p style={{ fontSize:15, fontWeight:700, color:'#2C3E43', marginBottom:4 }}>{e.title}</p>
                <p style={{ fontSize:13, color:'#6B7E85', lineHeight:1.6 }}>{e.desc}</p>
              </IGCard>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  HOW IT WORKS PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function HowItWorksPage({ nav }: { nav: (p: Page) => void }) {
  const [tab, setTab] = useState<'family'|'agent'>('family')
  return (
    <div style={{ paddingTop:90 }}>
      <section style={{ padding:'80px 32px 64px', background:'linear-gradient(160deg,#F0F7F8,#F9F9F9)', textAlign:'center' }}>
        <Chip>How It Works</Chip>
        <h1 style={{ fontSize:'clamp(32px,5vw,52px)', fontWeight:900, color:'#2C3E43', marginTop:16, marginBottom:16, letterSpacing:'-0.025em', lineHeight:1.1 }}>
          Simple, transparent, and <span className="text-gradient">trustworthy.</span>
        </h1>
        <p style={{ fontSize:17, color:'#4A5E65', lineHeight:1.7, maxWidth:520, margin:'0 auto 40px' }}>
          Whether you're a family seeking care or an agent offering your skills, the process is designed to be effortless.
        </p>
        {/* Tab switcher */}
        <div style={{ display:'inline-flex', gap:4, padding:6, borderRadius:18, background:'rgba(0,115,122,0.08)', border:'1px solid rgba(0,115,122,0.15)' }}>
          {(['family','agent'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding:'10px 28px', borderRadius:12, border:'none', cursor:'pointer',
              fontFamily:'Manrope,sans-serif', fontSize:14, fontWeight:700,
              background: tab === t ? '#00737A' : 'transparent',
              color: tab === t ? '#fff' : '#4A5E65',
              transition:'all 0.2s',
              boxShadow: tab === t ? '0 2px 8px rgba(0,115,122,0.25)' : 'none',
            }}>{t === 'family' ? 'For Families' : 'For Agents'}</button>
          ))}
        </div>
      </section>

      <section style={{ padding:'64px 32px', background:'#fff' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          {tab === 'family' ? (
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              {[
                { step:1, icon:'pencil',  title:'Create a care request',      desc:'Sign up free and describe your parent\'s needs — location, care type, frequency, any health notes. Takes 5 minutes.', sub:'No payment required at this stage.' },
                { step:2, icon:'chat',    title:'Receive agent applications', desc:'Verified agents in your area apply within hours. View full profiles, ratings, police clearance, and experience.', sub:'Average 4 applications in 24 hours.' },
                { step:3, icon:'search',  title:'Interview & choose',          desc:'Chat or video call candidates before deciding. No pressure to commit until you\'re fully comfortable.', sub:'Your ReadyPal coordinator is here to help.' },
                { step:4, icon:'pin',    title:'Visits begin',               desc:'Your agent checks in via the app on every visit. You get a photo report and care notes immediately after.', sub:'Real-time location confirmed on arrival.' },
                { step:5, icon:'card',   title:'Secure payment',             desc:'Pay only for completed visits. Funds are held in escrow and released automatically after visit confirmation.', sub:'Weekly or per-visit payment options.' },
                { step:6, icon:'star',   title:'Review & ongoing care',      desc:'Rate your agent, leave feedback, and continue the relationship. Adjust schedules any time through the platform.', sub:'Cancel or change agents with 24-hr notice.' },
              ].map(s => (
                <IGCard key={s.step} style={{ borderRadius:18, padding:'20px 24px' }} hover>
                  <div style={{ display:'flex', gap:18, alignItems:'flex-start' }}>
                    <div style={{ width:48, height:48, borderRadius:14, background:'rgba(0,115,122,0.09)', display:'flex', alignItems:'center', justifyContent:'center', color:'#00737A', flexShrink:0 }}>{MWI[s.icon]}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                        <span style={{ fontSize:11, fontWeight:800, color:'#00737A', background:'rgba(0,115,122,0.10)', padding:'2px 8px', borderRadius:6 }}>Step {s.step}</span>
                        <h3 style={{ fontSize:16, fontWeight:800, color:'#2C3E43' }}>{s.title}</h3>
                      </div>
                      <p style={{ fontSize:14, color:'#4A5E65', lineHeight:1.65, marginBottom:6 }}>{s.desc}</p>
                      <p style={{ fontSize:12, color:'#9AAAB0', fontWeight:600 }}>{s.sub}</p>
                    </div>
                  </div>
                </IGCard>
              ))}
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              {[
                { step:1, icon:'doc',      title:'Apply as a care agent',       desc:'Submit your application with ID, police clearance, certifications, and experience. Takes 10 minutes.', sub:'100% free to apply.' },
                { step:2, icon:'search',   title:'Verification process',        desc:'Our team verifies every document and conducts a video interview. Average 3-5 business days.', sub:'You\'ll receive guidance throughout.' },
                { step:3, icon:'shield',   title:'Get verified & go live',      desc:'Once verified, your profile is live. Families with care needs in your area can find and contact you.', sub:'Professional profile tips provided.' },
                { step:4, icon:'chat',     title:'Receive care requests',       desc:'Browse open requests, apply to those that match your skills and availability, and connect with families.', sub:'You choose which requests to apply to.' },
                { step:5, icon:'check',    title:'Complete visits',             desc:'Use the ReadyPal app to check in, complete care tasks, submit reports and photos, and check out.', sub:'In-app task checklists guide every visit.' },
                { step:6, icon:'money',    title:'Get paid reliably',           desc:'Earnings deposited every Friday. Track all payments in your dashboard. No cash handling needed.', sub:'LKR and bank transfer supported.' },
              ].map(s => (
                <IGCard key={s.step} style={{ borderRadius:18, padding:'20px 24px' }} hover>
                  <div style={{ display:'flex', gap:18, alignItems:'flex-start' }}>
                    <div style={{ width:48, height:48, borderRadius:14, background:'rgba(238,129,83,0.10)', display:'flex', alignItems:'center', justifyContent:'center', color:'#EE8153', flexShrink:0 }}>{MWI[s.icon]}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                        <span style={{ fontSize:11, fontWeight:800, color:'#EE8153', background:'rgba(238,129,83,0.10)', padding:'2px 8px', borderRadius:6 }}>Step {s.step}</span>
                        <h3 style={{ fontSize:16, fontWeight:800, color:'#2C3E43' }}>{s.title}</h3>
                      </div>
                      <p style={{ fontSize:14, color:'#4A5E65', lineHeight:1.65, marginBottom:6 }}>{s.desc}</p>
                      <p style={{ fontSize:12, color:'#9AAAB0', fontWeight:600 }}>{s.sub}</p>
                    </div>
                  </div>
                </IGCard>
              ))}
            </div>
          )}
        </div>
      </section>

      <section style={{ padding:'64px 32px', background:'#F9F9F9', textAlign:'center' }}>
        <Btn variant="primary" size="xl" onClick={() => nav(tab === 'family' ? 'home' : 'become-agent')}>
          {tab === 'family' ? 'Post Your First Care Request →' : 'Apply to Become an Agent →'}
        </Btn>
      </section>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  BECOME AN AGENT PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function BecomeAgentPage({ nav }: { nav: (p: Page) => void }) {
  return (
    <div style={{ paddingTop:90 }}>
      {/* Hero */}
      <section style={{ padding:'80px 32px 64px', background:'linear-gradient(135deg,#00737A 0%,#00959E 55%,#EE8153 100%)', position:'relative', overflow:'hidden' }}>
        <div aria-hidden style={{ position:'absolute', inset:0, opacity:0.12 }}>
          <div className="bg-grid" style={{ position:'absolute', inset:0 }} />
        </div>
        <div style={{ maxWidth:1000, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center', position:'relative', zIndex:1 }} className="agent-hero-grid">
          <div style={{ color:'#fff' }}>
            <Chip color="#fff" bg="rgba(255,255,255,0.18)">For Care Agents</Chip>
            <h1 style={{ fontSize:'clamp(32px,4vw,50px)', fontWeight:900, lineHeight:1.1, letterSpacing:'-0.025em', marginTop:16, marginBottom:20 }}>
              Do work that truly matters.
            </h1>
            <p style={{ fontSize:17, lineHeight:1.7, color:'rgba(255,255,255,0.85)', marginBottom:36 }}>
              Join 2,400+ verified ReadyPal agents across Sri Lanka. Flexible hours, reliable income, and the profound satisfaction of helping families stay connected.
            </p>
            <Btn variant="glass-dark" size="xl">Apply Now — It's Free</Btn>
          </div>
          <IGCard dark style={{ borderRadius:24, padding:32 }}>
            <p style={{ fontSize:14, fontWeight:600, color:'rgba(255,255,255,0.55)', marginBottom:16 }}>Monthly earnings snapshot</p>
            {[
              { label:'Part-time (10 visits)', earn:'LKR 35,000+' },
              { label:'Full-time (25 visits)', earn:'LKR 85,000+' },
              { label:'Specialist (medical)',  earn:'LKR 120,000+' },
            ].map(r => (
              <div key={r.label} style={{ display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontSize:14, color:'rgba(255,255,255,0.65)' }}>{r.label}</span>
                <span style={{ fontSize:15, fontWeight:800, color:'#EE8153' }}>{r.earn}</span>
              </div>
            ))}
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.30)', marginTop:12 }}>Indicative figures. Actual earnings vary by location and experience.</p>
          </IGCard>
        </div>
      </section>

      {/* Requirements */}
      <section style={{ padding:'80px 32px', background:'#fff' }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <Chip>Requirements</Chip>
            <h2 style={{ fontSize:'clamp(26px,4vw,40px)', fontWeight:900, color:'#2C3E43', marginTop:12, letterSpacing:'-0.02em' }}>What you need to apply</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }} className="req-grid">
            {[
              { icon:'id',      req:'Valid National ID',          note:'Sri Lanka NIC required.' },
              { icon:'search',  req:'Clean Criminal Record',      note:'Police clearance from your district.' },
              { icon:'phone',   req:'Smartphone',                 note:'Android or iOS for the agent app.' },
              { icon:'globe',   req:'Good Communication',         note:'English or Sinhala / Tamil.' },
              { icon:'heart',   req:'Genuine Compassion',         note:'A caring attitude above all else.' },
              { icon:'doc',     req:'Any Relevant Experience',    note:'Healthcare, domestic, or social work.' },
            ].map(r => (
              <IGCard key={r.req} style={{ borderRadius:18, padding:'20px 22px' }} hover>
                <div style={{ color:'#00737A', marginBottom:12, display:'flex' }}>{MWI[r.icon]}</div>
                <p style={{ fontSize:15, fontWeight:700, color:'#2C3E43', marginBottom:5 }}>{r.req}</p>
                <p style={{ fontSize:13, color:'#6B7E85' }}>{r.note}</p>
              </IGCard>
            ))}
          </div>
        </div>
      </section>

      {/* Application CTA */}
      <section style={{ padding:'80px 32px', background:'#F9F9F9', textAlign:'center' }}>
        <div style={{ maxWidth:600, margin:'0 auto' }}>
          <h2 style={{ fontSize:'clamp(26px,4vw,38px)', fontWeight:900, color:'#2C3E43', marginBottom:16, letterSpacing:'-0.02em' }}>
            Ready to apply?
          </h2>
          <p style={{ fontSize:16, color:'#6B7E85', lineHeight:1.7, marginBottom:32 }}>
            Applications take 10 minutes. Verification typically takes 3–5 business days. Our team guides you every step of the way.
          </p>
          <Btn variant="primary" size="xl">Start Your Application →</Btn>
        </div>
      </section>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  SERVICES PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function ServicesPage({ nav }: { nav: (p: Page) => void }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const services = [
    { icon:'hospital', cat:'Medical',     title:'Hospital Companion',        desc:'We accompany your loved one to hospital visits, handle paperwork, and liaise with medical staff.' },
    { icon:'shield',   cat:'Medical',     title:'Medical Appointment Assist', desc:'Schedule appointments, transport, doctor briefings, follow-up care management.' },
    { icon:'pill',     cat:'Medical',     title:'Medication Collection',      desc:'Collect prescriptions, confirm dosages with pharmacists, ensure medications are taken.' },
    { icon:'home',     cat:'Daily Care',  title:'Home Visits',                desc:'Regular welfare checks, light cleaning, and companionship in a familiar environment.' },
    { icon:'cart',     cat:'Daily Care',  title:'Grocery Assistance',         desc:'Weekly shopping with fresh produce and household essentials — your approved list.' },
    { icon:'doc',      cat:'Daily Care',  title:'Bill Payments',              desc:'Utility bills, government payments, and bank errands handled promptly.' },
    { icon:'alert',    cat:'Emergency',   title:'Emergency Assistance',       desc:'On-call agents available for urgent situations in Colombo, Kandy, and Galle.' },
    { icon:'car',      cat:'Transport',   title:'Transportation',             desc:'Safe, reliable transport to appointments, visits, and community events.' },
    { icon:'sun',      cat:'Daily Care',  title:'Daily Well-being Visits',    desc:'Morning routines, light exercise, companionship, and day-to-day emotional support.' },
  ]
  const cats = ['All', 'Medical', 'Daily Care', 'Emergency', 'Transport']
  const filtered = services.filter(s =>
    (filter === 'All' || s.cat === filter) &&
    (search === '' || s.title.toLowerCase().includes(search.toLowerCase()) || s.desc.toLowerCase().includes(search.toLowerCase()))
  )
  return (
    <div style={{ paddingTop:90 }}>
      <section style={{ padding:'80px 32px 48px', background:'linear-gradient(160deg,#F0F7F8,#F9F9F9)', textAlign:'center' }}>
        <Chip>Services</Chip>
        <h1 style={{ fontSize:'clamp(30px,5vw,50px)', fontWeight:900, color:'#2C3E43', marginTop:16, marginBottom:16, letterSpacing:'-0.025em', lineHeight:1.1 }}>
          Every type of care,<br /><span className="text-gradient">in one place.</span>
        </h1>
        {/* Search + filter */}
        <div style={{ maxWidth:600, margin:'32px auto 0', display:'flex', flexDirection:'column', gap:12 }}>
          <div style={{ position:'relative' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#9AAAB0' }}>
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4"/><path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search services…"
              style={{ width:'100%', padding:'12px 16px 12px 38px', borderRadius:14, border:'1.5px solid #E4E8EA', background:'#fff', fontSize:15, fontFamily:'Manrope,sans-serif', color:'#2C3E43', outline:'none' }} />
          </div>
          <div style={{ display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap' }}>
            {cats.map(c => (
              <button key={c} onClick={() => setFilter(c)} style={{
                padding:'6px 16px', borderRadius:999, border:'none', cursor:'pointer',
                fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:600,
                background: filter === c ? '#00737A' : 'rgba(0,115,122,0.08)',
                color: filter === c ? '#fff' : '#00737A',
                transition:'all 0.15s',
              }}>{c}</button>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding:'48px 32px 80px', background:'#fff' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }} className="services-grid">
          {filtered.map(s => (
            <IGCard key={s.title} style={{ borderRadius:20, padding:24 }} hover tilt>
              <div style={{ width:52, height:52, borderRadius:16, background:'rgba(0,115,122,0.09)', display:'flex', alignItems:'center', justifyContent:'center', color:'#00737A', marginBottom:16 }}>{MWI[s.icon]}</div>
              <Chip>{s.cat}</Chip>
              <h3 style={{ fontSize:16, fontWeight:800, color:'#2C3E43', margin:'10px 0 8px' }}>{s.title}</h3>
              <p style={{ fontSize:14, color:'#6B7E85', lineHeight:1.65, marginBottom:16 }}>{s.desc}</p>
              <Btn variant="outline" size="sm">Request This Service</Btn>
            </IGCard>
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn:'1/-1', textAlign:'center', padding:64, color:'#9AAAB0', fontSize:15 }}>
              No services match your search. <button onClick={() => { setSearch(''); setFilter('All') }} style={{ color:'#00737A', background:'none', border:'none', cursor:'pointer', fontWeight:700 }}>Clear filters</button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  CONTACT PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function ContactPage() {
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' })
  const [sent, setSent] = useState(false)
  return (
    <div style={{ paddingTop:90 }}>
      <section style={{ padding:'80px 32px 48px', background:'linear-gradient(160deg,#F0F7F8,#F9F9F9)', textAlign:'center' }}>
        <Chip>Contact</Chip>
        <h1 style={{ fontSize:'clamp(30px,5vw,50px)', fontWeight:900, color:'#2C3E43', marginTop:16, marginBottom:16, letterSpacing:'-0.025em' }}>
          We'd love to hear from you.
        </h1>
        <p style={{ fontSize:17, color:'#4A5E65', maxWidth:480, margin:'0 auto' }}>Reach our team through any of the channels below. We respond within 2 business hours.</p>
      </section>

      <section style={{ padding:'48px 32px 80px', background:'#fff' }}>
        <div style={{ maxWidth:1000, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:48 }} className="contact-grid">
          {/* Form */}
          <div>
            {sent ? (
              <IGCard style={{ borderRadius:20, padding:40, textAlign:'center' }}>
                <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
                <h3 style={{ fontSize:20, fontWeight:800, color:'#2C3E43', marginBottom:8 }}>Message sent!</h3>
                <p style={{ fontSize:14, color:'#6B7E85' }}>We'll get back to you at {form.email} within 2 hours.</p>
              </IGCard>
            ) : (
              <IGCard style={{ borderRadius:20, padding:32 }}>
                <h2 style={{ fontSize:20, fontWeight:800, color:'#2C3E43', marginBottom:24 }}>Send us a message</h2>
                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  {[
                    { label:'Full Name', key:'name', placeholder:'Nimal Jayawardena', type:'text' },
                    { label:'Email Address', key:'email', placeholder:'nimal@example.com', type:'email' },
                    { label:'Subject', key:'subject', placeholder:'Care request enquiry', type:'text' },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#2C3E43', marginBottom:6 }}>{f.label}</label>
                      <input type={f.type} placeholder={f.placeholder} value={(form as Record<string, string>)[f.key]}
                        onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
                        style={{ width:'100%', padding:'10px 14px', borderRadius:12, border:'1.5px solid #E4E8EA', fontSize:14, fontFamily:'Manrope,sans-serif', outline:'none', color:'#2C3E43', background:'#fff' }} />
                    </div>
                  ))}
                  <div>
                    <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#2C3E43', marginBottom:6 }}>Message</label>
                    <textarea rows={4} placeholder="Tell us how we can help…" value={form.message}
                      onChange={e => setForm(v => ({ ...v, message: e.target.value }))}
                      style={{ width:'100%', padding:'10px 14px', borderRadius:12, border:'1.5px solid #E4E8EA', fontSize:14, fontFamily:'Manrope,sans-serif', outline:'none', color:'#2C3E43', resize:'none', background:'#fff' }} />
                  </div>
                  <Btn variant="primary" size="lg" fullWidth onClick={() => setSent(true)}>Send Message</Btn>
                </div>
              </IGCard>
            )}
          </div>

          {/* Contact info */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {[
              { icon:'mail',  label:'Email',        val:'hello@readypal.com', sub:'General enquiries' },
              { icon:'phone', label:'Phone',         val:'+94 11 234 5678',    sub:'Mon–Fri, 8 AM – 8 PM' },
              { icon:'chat',  label:'Live Chat',     val:'Available in-app',  sub:'24/7 for active users' },
              { icon:'pin',   label:'Office',        val:'42 Galle Road, Colombo 03', sub:'Sri Lanka' },
            ].map(c => (
              <IGCard key={c.label} style={{ borderRadius:16, padding:'16px 20px' }} hover>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:'rgba(0,115,122,0.09)', display:'flex', alignItems:'center', justifyContent:'center', color:'#00737A', flexShrink:0 }}>{MWI[c.icon]}</div>
                  <div>
                    <p style={{ fontSize:12, fontWeight:600, color:'#9AAAB0' }}>{c.label}</p>
                    <p style={{ fontSize:14, fontWeight:700, color:'#2C3E43' }}>{c.val}</p>
                    <p style={{ fontSize:12, color:'#6B7E85' }}>{c.sub}</p>
                  </div>
                </div>
              </IGCard>
            ))}

            {/* Map placeholder */}
            <IGCard style={{ borderRadius:16, padding:0, overflow:'hidden', height:180 }}>
              <div style={{ width:'100%', height:'100%', background:'linear-gradient(135deg,#E6F4F5 0%,#C2E5E7 100%)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:8 }}>
                <div style={{ fontSize:32 }}>🗺️</div>
                <p style={{ fontSize:13, fontWeight:600, color:'#00737A' }}>42 Galle Road, Colombo 03</p>
                <p style={{ fontSize:12, color:'#6B7E85' }}>Interactive map coming soon</p>
              </div>
            </IGCard>
          </div>
        </div>
      </section>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PRICING PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function PricingPage({ nav }: { nav: (p: Page) => void }) {
  return (
    <div style={{ paddingTop:90 }}>
      <section style={{ padding:'80px 32px 48px', background:'linear-gradient(160deg,#F0F7F8,#F9F9F9)', textAlign:'center' }}>
        <Chip>Pricing</Chip>
        <h1 style={{ fontSize:'clamp(30px,5vw,50px)', fontWeight:900, color:'#2C3E43', marginTop:16, marginBottom:16, letterSpacing:'-0.025em' }}>
          Simple, transparent pricing.
        </h1>
        <p style={{ fontSize:17, color:'#4A5E65', maxWidth:500, margin:'0 auto' }}>No subscriptions, no hidden fees. You pay your care agent directly — ReadyPal charges a small platform fee only on completed visits.</p>
      </section>

      <section style={{ padding:'48px 32px 80px', background:'#fff' }}>
        <div style={{ maxWidth:1000, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24, marginBottom:48 }} className="pricing-grid">
          {[
            { title:'Family Account',  price:'Free',          note:'Always free to join', icon:'people',  features:['Post unlimited care requests','View agent profiles & ratings','Secure in-app messaging','Photo & visit reports','Escrow payment protection'], primary:false, cta:'Create Free Account' },
            { title:'Per-Visit Fee',   price:'8–12%',         note:'Platform fee on each visit', icon:'shield', features:['Verification & matching','Escrow payment handling','Real-time check-in tracking','24/7 dispute resolution','Dedicated family coordinator'], primary:true, cta:'Start a Care Request' },
            { title:'Enterprise',      price:'Coming Soon',   note:'For organisations & NGOs', icon:'doc',    features:['Bulk care coordination','Invoicing & reporting','Dedicated account manager','API access','Priority support'], primary:false, cta:'Join Waitlist' },
          ].map(p => (
            <div key={p.title} style={{ position:'relative' }}>
              {p.primary && (
                <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', background:'#00737A', color:'#fff', fontSize:11, fontWeight:700, padding:'4px 14px', borderRadius:999, zIndex:10, whiteSpace:'nowrap' }}>Most Popular</div>
              )}
              <IGCard style={{ borderRadius:22, padding:28, height:'100%', borderColor: p.primary ? 'rgba(0,115,122,0.35)' : undefined, boxShadow: p.primary ? '0 8px 32px rgba(0,115,122,0.14), inset 0 1px 0 rgba(255,255,255,0.92)' : undefined }}>
                <div style={{ color:'#00737A', marginBottom:16, display:'flex' }}>{MWI[p.icon]}</div>
                <p style={{ fontSize:13, fontWeight:700, color:'#9AAAB0', marginBottom:6 }}>{p.title}</p>
                <p style={{ fontSize:36, fontWeight:900, color:'#2C3E43', letterSpacing:'-0.02em', marginBottom:4 }}>{p.price}</p>
                <p style={{ fontSize:12, color:'#9AAAB0', marginBottom:24 }}>{p.note}</p>
                <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:28 }}>
                  {p.features.map(f => (
                    <div key={f} style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginTop:2, flexShrink:0 }}>
                        <circle cx="7" cy="7" r="7" fill={p.primary ? '#00737A' : '#E6F4F5'}/>
                        <path d="M4 7l2.5 2.5 4-4" stroke={p.primary ? '#fff' : '#00737A'} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span style={{ fontSize:13, color:'#4A5E65' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Btn variant={p.primary ? 'primary' : 'outline'} size="md" fullWidth>{p.cta}</Btn>
              </IGCard>
            </div>
          ))}
        </div>
        <p style={{ textAlign:'center', fontSize:13, color:'#9AAAB0', maxWidth:600, margin:'0 auto' }}>
          Platform fee is charged to the family and split with the care agent as per their agreement. Agent commission rates are set competitively by ReadyPal and reviewed quarterly.
        </p>
      </section>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  FAQ PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function FAQPage() {
  const [open, setOpen] = useState<number|null>(null)
  const groups = [
    {
      group:'For Families',
      items:[
        { q:'How do I post a care request?',             a:'Sign up for a free family account, click "Post a Care Request", describe your parent\'s needs, and submit. Our team reviews it within 1 hour.' },
        { q:'How long until I receive applications?',     a:'Most requests receive their first application within 4 hours. You\'ll be notified instantly via email and in-app.' },
        { q:'Can I interview an agent before hiring?',    a:'Absolutely. You can chat or schedule a video call with any applicant before making a decision. We encourage this.' },
        { q:'What happens if my agent doesn\'t show up?', a:'We have an emergency replacement policy. If your agent fails to check in, our team immediately contacts backup agents in your area.' },
        { q:'Is my personal information safe?',           a:'Yes. All personal data is encrypted and stored in compliance with GDPR and Sri Lankan data protection laws.' },
      ]
    },
    {
      group:'For Care Agents',
      items:[
        { q:'Is it free to apply as a care agent?',    a:'Yes, completely free. There is no registration fee or monthly charge for agents.' },
        { q:'How long does verification take?',         a:'Typically 3–5 business days after all documents are submitted. Our team guides you throughout.' },
        { q:'How do I get paid?',                       a:'Earnings are deposited every Friday via bank transfer (Sampath, Commercial, or People\'s Bank). No cash handling required.' },
        { q:'Can I choose my own working hours?',       a:'Yes. You set your availability in the app. Families only see you for time slots you\'ve marked as available.' },
      ]
    },
    {
      group:'Payments & Safety',
      items:[
        { q:'How does escrow payment work?',           a:'Families pay when booking. Funds are held securely and released to the agent automatically after visit completion confirmation.' },
        { q:'What currencies are supported?',          a:'Currently LKR and AUD, GBP, USD for family accounts abroad. We\'re adding CAD and SGD in Q3 2025.' },
        { q:'What if there\'s a dispute?',              a:'Our resolution team investigates all disputes within 48 hours. We review visit logs, reports, and both parties\' accounts before deciding.' },
      ]
    },
  ]
  let globalIdx = 0
  return (
    <div style={{ paddingTop:90 }}>
      <section style={{ padding:'80px 32px 48px', background:'linear-gradient(160deg,#F0F7F8,#F9F9F9)', textAlign:'center' }}>
        <Chip>FAQ</Chip>
        <h1 style={{ fontSize:'clamp(30px,5vw,50px)', fontWeight:900, color:'#2C3E43', marginTop:16, marginBottom:16, letterSpacing:'-0.025em' }}>Frequently asked questions</h1>
        <p style={{ fontSize:17, color:'#4A5E65', maxWidth:500, margin:'0 auto' }}>Can't find the answer you're looking for? <button onClick={() => {}} style={{ color:'#00737A', fontWeight:700, background:'none', border:'none', cursor:'pointer' }}>Contact our team.</button></p>
      </section>
      <section style={{ padding:'48px 32px 80px', background:'#fff' }}>
        <div style={{ maxWidth:780, margin:'0 auto', display:'flex', flexDirection:'column', gap:48 }}>
          {groups.map(g => (
            <div key={g.group}>
              <h2 style={{ fontSize:20, fontWeight:800, color:'#2C3E43', marginBottom:16, display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ width:4, height:20, borderRadius:2, background:'#00737A', display:'inline-block' }} />
                {g.group}
              </h2>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {g.items.map(item => {
                  const idx = globalIdx++
                  return (
                    <IGCard key={item.q} style={{ borderRadius:16, padding:0, overflow:'hidden' }}>
                      <button onClick={() => setOpen(open === idx ? null : idx)} style={{
                        width:'100%', textAlign:'left', padding:'16px 20px', border:'none', cursor:'pointer',
                        background:'none', fontFamily:'Manrope,sans-serif', fontSize:14, fontWeight:700,
                        color: open === idx ? '#00737A' : '#2C3E43',
                        display:'flex', justifyContent:'space-between', alignItems:'center', gap:16,
                        transition:'color 0.15s',
                      }}>
                        {item.q}
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink:0, transition:'transform 0.2s', transform: open === idx ? 'rotate(180deg)' : 'none' }}>
                          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </button>
                      {open === idx && (
                        <p className="animate-fade-in" style={{ padding:'0 20px 16px', fontSize:14, lineHeight:1.7, color:'#4A5E65' }}>{item.a}</p>
                      )}
                    </IGCard>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PRIVACY / TERMS (light)
// ═══════════════════════════════════════════════════════════════════════════════
function LegalPage({ title, sections }: { title: string; sections: { heading: string; body: string }[] }) {
  return (
    <div style={{ paddingTop:90 }}>
      <section style={{ padding:'60px 32px 32px', background:'#F9F9F9', textAlign:'center' }}>
        <h1 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:900, color:'#2C3E43', letterSpacing:'-0.02em' }}>{title}</h1>
        <p style={{ fontSize:14, color:'#9AAAB0', marginTop:8 }}>Last updated: 1 January 2025</p>
      </section>
      <section style={{ padding:'48px 32px 80px', background:'#fff' }}>
        <div style={{ maxWidth:760, margin:'0 auto', display:'flex', flexDirection:'column', gap:32 }}>
          {sections.map(s => (
            <div key={s.heading}>
              <h2 style={{ fontSize:18, fontWeight:800, color:'#2C3E43', marginBottom:10 }}>{s.heading}</h2>
              <p style={{ fontSize:14, color:'#4A5E65', lineHeight:1.8 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  404 PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function NotFoundPage({ nav }: { nav: (p: Page) => void }) {
  return (
    <div style={{ paddingTop:90, minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(160deg,#F0F7F8,#F9F6F3)' }}>
      <div style={{ textAlign:'center', padding:'0 32px' }}>
        <div style={{ fontSize:80, marginBottom:16 }}>🌿</div>
        <h1 style={{ fontSize:'clamp(60px,10vw,120px)', fontWeight:900, color:'#00737A', letterSpacing:'-0.04em', lineHeight:0.9, marginBottom:12 }}>404</h1>
        <h2 style={{ fontSize:24, fontWeight:700, color:'#2C3E43', marginBottom:12 }}>Page not found</h2>
        <p style={{ fontSize:16, color:'#6B7E85', maxWidth:400, margin:'0 auto 36px', lineHeight:1.65 }}>
          The page you're looking for has moved or doesn't exist. Let's get you back on track.
        </p>
        <div style={{ display:'flex', justifyContent:'center', gap:12, flexWrap:'wrap' }}>
          <Btn variant="primary" size="lg" onClick={() => nav('home')}>Go Home</Btn>
          <Btn variant="outline" size="lg" onClick={() => nav('contact')}>Contact Support</Btn>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN MARKETING WEBSITE ROUTER
// ═══════════════════════════════════════════════════════════════════════════════
export default function MarketingWebsite() {
  const [page, setPage] = useState<Page>('home')

  const nav = useCallback((p: Page) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const privacySections = [
    { heading:'1. Information We Collect', body:'We collect information you provide directly, such as name, email, phone number, and address when you create an account. We also collect usage data, device information, and location data only when you opt in for visit tracking.' },
    { heading:'2. How We Use Your Information', body:'We use your information to match families with verified care agents, process payments, send care visit notifications, improve our platform, and provide customer support. We never sell your data to third parties.' },
    { heading:'3. Data Security', body:'All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Payment card data is handled by PCI-DSS compliant processors — ReadyPal never stores card numbers directly.' },
    { heading:'4. Your Rights', body:'You have the right to access, correct, or delete your personal data at any time. Submit a request to privacy@readypal.com and we will respond within 72 hours.' },
    { heading:'5. Cookies', body:'We use essential cookies for authentication and preference storage. Analytics cookies are optional and can be declined. We do not use advertising cookies.' },
  ]
  const termsSections = [
    { heading:'1. Acceptance of Terms', body:'By creating a ReadyPal account, you agree to these Terms & Conditions. If you do not agree, please do not use the platform.' },
    { heading:'2. Platform Role', body:'ReadyPal is a marketplace that facilitates connections between families and care agents. We are not the employer of care agents. Each engagement is between the family and the agent.' },
    { heading:'3. Verified Agent Programme', body:'While ReadyPal vets all agents rigorously, we cannot guarantee outcomes. Families are encouraged to review profiles, ratings, and conduct their own interviews.' },
    { heading:'4. Payment & Fees', body:'Families pay a platform fee of 8–12% on completed visits. This fee covers payment processing, escrow management, dispute resolution, and platform maintenance.' },
    { heading:'5. Cancellation Policy', body:'Families may cancel a booked visit with no charge up to 24 hours before the scheduled time. Late cancellations incur a 50% fee. No-shows are charged in full.' },
  ]

  const renderPage = () => {
    switch (page) {
      case 'home':          return <HomePage nav={nav} />
      case 'about':         return <AboutPage nav={nav} />
      case 'how-it-works':  return <HowItWorksPage nav={nav} />
      case 'become-agent':  return <BecomeAgentPage nav={nav} />
      case 'services':      return <ServicesPage nav={nav} />
      case 'contact':       return <ContactPage />
      case 'pricing':       return <PricingPage nav={nav} />
      case 'faq':           return <FAQPage />
      case 'privacy':       return <LegalPage title="Privacy Policy" sections={privacySections} />
      case 'terms':         return <LegalPage title="Terms & Conditions" sections={termsSections} />
      case '404':           return <NotFoundPage nav={nav} />
      default:              return <NotFoundPage nav={nav} />
    }
  }

  return (
    <div style={{ fontFamily:'Manrope,sans-serif', background:'#FAFAF9', minHeight:'100vh' }}>
      {page !== '404' && <Navbar nav={nav} cur={page} />}
      <div key={page} className="page-enter">
        {renderPage()}
      </div>
      {page !== '404' && <Footer nav={nav} />}
    </div>
  )
}
