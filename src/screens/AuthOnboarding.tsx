import {
  useState, useRef, useEffect, useCallback,
  type ReactNode, type CSSProperties, type KeyboardEvent,
} from 'react'

import { signInUser, signUpUser, getMyProfile, getMyAgentDetails, updateMyProfile } from "../lib/api"

import logoFull from '@/imports/20260723_170707.png'
import logoWhite from '@/imports/20260723_165045.png'
import logoIcon from '@/imports/20260723_164632.png'

// ─── Types ────────────────────────────────────────────────────────────────────
type AuthScreen =
  | 'welcome' | 'login' | 'role-select'
  | 'client-1' | 'client-2' | 'client-3' | 'client-4' | 'client-5'
  | 'agent-1' | 'agent-2' | 'agent-3' | 'agent-4' | 'agent-5' | 'agent-6' | 'agent-7' | 'agent-8'
  | 'forgot-1' | 'forgot-2' | 'forgot-3'
  | 'otp' | 'email-verify' | 'reset-password'
  | 'agent-pending' | 'agent-rejected' | 'agent-approved'

// ─── Inline SVG icon library (same style as DesignSystem.tsx) ─────────────────
const Ico = {
  mail:    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M1.5 5.5l6.5 4 6.5-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  lock:    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="3.5" y="7" width="9" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M5 7V5.5a3 3 0 0 1 6 0V7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  eye:     <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/></svg>,
  eyeOff:  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 1l14 14M6.5 6.6A2 2 0 0 0 9.4 9.5M4 4.2C2.4 5.3 1 8 1 8s2.5 5 7 5c1.5 0 2.8-.4 3.9-1M7 3.1C7.3 3 7.7 3 8 3c4.5 0 7 5 7 5s-.6 1.2-1.7 2.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  user:    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.4"/><path d="M2 14c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  phone:   <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5.5 2h5a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="12" r=".7" fill="currentColor"/></svg>,
  globe:   <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/><path d="M8 1.5C8 1.5 6 4.5 6 8s2 6.5 2 6.5M8 1.5C8 1.5 10 4.5 10 8s-2 6.5-2 6.5M1.5 8h13" stroke="currentColor" strokeWidth="1.4"/></svg>,
  arrowL:  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  arrowR:  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  check:   <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2.5 8.5l4 4 7-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  checkCircle: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.4"/><path d="M5.5 10.5l3 3 6-7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  x:       <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2.5 2.5l11 11M13.5 2.5l-11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  upload:  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 10V3M5 6l3-3 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 11v1.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  calendar:<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M1.5 7h13M5 1.5V4M11 1.5V4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  shield:  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5l5.5 2v4c0 3-2.5 5.5-5.5 6.5C5 13 2.5 10.5 2.5 7.5v-4L8 1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M5.5 8.5l1.5 1.5 3.5-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  doc:     <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 1.5H4.5A1.5 1.5 0 0 0 3 3v10a1.5 1.5 0 0 0 1.5 1.5h7A1.5 1.5 0 0 0 13 13V5.5L10 1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M10 1.5V5.5H13M6 8.5h4M6 11h4M6 6h1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  pin:     <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5a4.5 4.5 0 0 1 4.5 4.5c0 3-4.5 8.5-4.5 8.5S3.5 9 3.5 6A4.5 4.5 0 0 1 8 1.5z" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.4"/></svg>,
  clock:   <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/><path d="M8 4.5V8l2.5 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  refresh: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 8a5 5 0 1 1-1.46-3.54" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M13 3v2.5H10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  camera:  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 2.5h4l1.5 2H13a1.5 1.5 0 0 1 1.5 1.5v6A1.5 1.5 0 0 1 13 13.5H3A1.5 1.5 0 0 1 1.5 12V6A1.5 1.5 0 0 1 3 4.5h1.5L6 2.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><circle cx="8" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.4"/></svg>,
  bank:    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1.5 14.5h13M2.5 6.5h11M8 2l6.5 4h-13L8 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M4 6.5v5.5M8 6.5v5.5M12 6.5v5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  google:  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14.5 8.16c0-.49-.04-.96-.12-1.41H8v2.67h3.65a3.12 3.12 0 0 1-1.35 2.05v1.7h2.18c1.28-1.18 2.02-2.91 2.02-5.01z" fill="#4285F4"/><path d="M8 15c1.83 0 3.36-.61 4.48-1.63l-2.18-1.7c-.61.41-1.38.65-2.3.65-1.77 0-3.27-1.19-3.8-2.8H1.95v1.75A7 7 0 0 0 8 15z" fill="#34A853"/><path d="M4.2 9.52a4.22 4.22 0 0 1 0-2.69V5.08H1.95a7 7 0 0 0 0 6.19l2.25-1.75z" fill="#FBBC05"/><path d="M8 3.97c1 0 1.9.34 2.6 1.01l1.95-1.95A7 7 0 0 0 1.95 5.08L4.2 6.83C4.73 5.22 6.23 3.97 8 3.97z" fill="#EA4335"/></svg>,
  apple:   <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10.5 1.5c.1 1.1-.3 2.1-.9 2.9-.6.8-1.5 1.4-2.4 1.3-.1-1 .4-2 .9-2.7.6-.8 1.6-1.4 2.4-1.5zm2 4.3c-1.4-.8-2.6-.7-3.4-.5-.6.2-1.1.5-1.1.5s-.5-.3-1.3-.5c-1.1-.2-2.4.2-3.2 1.4C2 8.3 2.1 11.2 3.6 13.1c.7.9 1.6 1.9 2.7 1.9.9 0 1.4-.5 2.4-.5s1.4.5 2.4.5c1.1 0 1.9-1 2.6-2 .6-.8 1-1.8 1.1-2.7-1.3-.5-2.2-1.8-2.3-3.5z" fill="currentColor"/></svg>,
  briefcase:<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="5.5" width="13" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M5.5 5.5V4a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1.5M1.5 9.5h13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  home:    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8l6-6 6 6v7H10V10H6v5H2V8z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  warning: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2L1.5 13.5h13L8 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M8 7v3M8 12v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  info:    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/><path d="M8 7.5v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  face:    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/><circle cx="5.5" cy="7" r="1" fill="currentColor"/><circle cx="10.5" cy="7" r="1" fill="currentColor"/><path d="M5 10.5a3.5 3.5 0 0 0 6 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  star:    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5l2 4 4.5.6-3.25 3.2.8 4.5L8 11.6l-4.05 2.2.8-4.5L1.5 6.1 6 5.5l2-4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  mail2:   <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="4.5" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M2 7l8 5 8-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
}

// ─── Colour / spacing constants ───────────────────────────────────────────────
const C = {
  primary: '#00737A',
  accent:  '#EE8153',
  type:    '#2C3E43',
  sub:     '#6B7E85',
  muted:   '#9AAAB0',
  border:  '#E4E8EA',
  bg:      '#F9F9F9',
  error:   '#EF4444',
  success: '#22C55E',
  warning: '#F59E0B',
}

// ─── Glass helper ─────────────────────────────────────────────────────────────
function glass(extra: CSSProperties = {}): CSSProperties {
  return {
    background: 'rgba(255,255,255,0.65)',
    backdropFilter: 'blur(24px) saturate(1.9)',
    WebkitBackdropFilter: 'blur(24px) saturate(1.9)',
    border: '1px solid rgba(255,255,255,0.78)',
    boxShadow: '0 4px 24px rgba(44,62,67,0.08), inset 0 1px 0 rgba(255,255,255,0.95)',
    ...extra,
  }
}

// ─── Shared Btn ───────────────────────────────────────────────────────────────
function Btn({
  variant = 'primary', size = 'md', onClick, fullWidth, loading, disabled, icon, children,
}: {
  variant?: 'primary'|'secondary'|'outline'|'ghost'|'accent'|'glass'
  size?: 'sm'|'md'|'lg'; onClick?: () => void; fullWidth?: boolean
  loading?: boolean; disabled?: boolean; icon?: ReactNode; children: ReactNode
}) {
  const sz = { sm:'px-4 py-2 text-sm gap-1.5', md:'px-5 py-2.5 text-sm gap-2', lg:'px-7 py-3.5 text-base gap-2' }[size]
  const v: Record<string, CSSProperties> = {
    primary:   { background: disabled ? '#C8D0D4' : C.primary, color:'#fff', border:`1.5px solid ${disabled ? '#C8D0D4' : C.primary}`, boxShadow: disabled ? 'none' : '0 2px 8px rgba(0,115,122,0.28), inset 0 1px 0 rgba(255,255,255,0.12)' },
    secondary: { background:'#F2F4F5', color:C.type, border:'1.5px solid #E4E8EA' },
    outline:   { background:'transparent', color:C.primary, border:`1.5px solid ${C.primary}` },
    ghost:     { background:'transparent', color:C.primary, border:'1.5px solid transparent' },
    accent:    { background:C.accent, color:'#fff', border:`1.5px solid ${C.accent}`, boxShadow:'0 2px 8px rgba(238,129,83,0.28)' },
    glass:     { background:'rgba(255,255,255,0.55)', color:C.type, border:'1px solid rgba(255,255,255,0.80)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)' },
  }
  const Spinner = () => (
    <svg className="animate-spin-slow" width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25"/>
      <path d="M7 1.5A5.5 5.5 0 0 1 12.5 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
  return (
    <button onClick={onClick} disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-700 rounded-xl transition-all duration-150 select-none hover:brightness-105 active:scale-[0.97] ${sz} ${fullWidth ? 'w-full' : ''}`}
      style={{ fontFamily:'Manrope,sans-serif', cursor: disabled || loading ? 'not-allowed' : 'pointer', ...v[variant] }}>
      {loading ? <Spinner /> : icon ? <span style={{ width:16, height:16, display:'flex', alignItems:'center', justifyContent:'center' }}>{icon}</span> : null}
      {children}
    </button>
  )
}

// ─── Floating-label Input ─────────────────────────────────────────────────────
function FloatInput({
  label, type = 'text', value, onChange, icon, iconRight, onIconRight, error, hint, disabled,
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void
  icon?: ReactNode; iconRight?: ReactNode; onIconRight?: () => void
  error?: string; hint?: string; disabled?: boolean
}) {
  const [focused, setFocused] = useState(false)
  const lifted = focused || value.length > 0
  return (
    <div style={{ position:'relative', marginBottom: error || hint ? 0 : 0 }}>
      <div style={{ position:'relative' }}>
        {icon && (
          <span style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color: focused ? C.primary : C.muted, pointerEvents:'none', zIndex:1, display:'flex', transition:'color 0.15s' }}>
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          placeholder={lifted ? '' : undefined}
          style={{
            width:'100%', padding: icon ? '18px 14px 7px 40px' : '18px 14px 7px 14px',
            paddingRight: iconRight ? 44 : 14,
            borderRadius:12, border: `1.5px solid ${error ? C.error : focused ? C.primary : C.border}`,
            background: disabled ? '#F2F4F5' : '#fff',
            fontSize:14, fontFamily:'Manrope,sans-serif', color:C.type, outline:'none',
            transition:'border-color 0.15s',
            boxShadow: focused ? `0 0 0 3px ${C.primary}18` : 'none',
          }}
        />
        <label style={{
          position:'absolute', left: icon ? 40 : 14,
          top: lifted ? 7 : '50%',
          transform: lifted ? 'none' : 'translateY(-50%)',
          fontSize: lifted ? 10 : 14,
          fontWeight: lifted ? 600 : 400,
          color: error ? C.error : focused ? C.primary : C.muted,
          pointerEvents:'none', transition:'all 0.15s', fontFamily:'Manrope,sans-serif',
          letterSpacing: lifted ? '0.03em' : 'normal',
        }}>{label}</label>
        {iconRight && (
          <button onClick={onIconRight} type="button" tabIndex={-1} style={{
            position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
            background:'none', border:'none', cursor:'pointer', color:C.muted,
            display:'flex', alignItems:'center', padding:2,
          }}>{iconRight}</button>
        )}
      </div>
      {error && <p style={{ fontSize:11, color:C.error, marginTop:4, fontFamily:'Manrope,sans-serif', fontWeight:500 }}>{error}</p>}
      {hint && !error && <p style={{ fontSize:11, color:C.muted, marginTop:4, fontFamily:'Manrope,sans-serif' }}>{hint}</p>}
    </div>
  )
}

// ─── Select ───────────────────────────────────────────────────────────────────
function Select({ label, value, onChange, options, icon }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; icon?: ReactNode
}) {
  return (
    <div style={{ position:'relative' }}>
      {icon && <span style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:C.muted, pointerEvents:'none', zIndex:1, display:'flex' }}>{icon}</span>}
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{
          width:'100%', padding: value ? (icon ? '18px 14px 7px 40px' : '18px 14px 7px 14px') : '14px',
          paddingLeft: icon ? 40 : 14,
          borderRadius:12, border:`1.5px solid ${C.border}`, background:'#fff',
          fontSize:14, fontFamily:'Manrope,sans-serif', color: value ? C.type : C.muted,
          outline:'none', appearance:'none', cursor:'pointer',
        }}>
        <option value="" disabled>{label}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <svg style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:C.muted }} width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
      {value && (
        <label style={{ position:'absolute', left: icon ? 40 : 14, top:7, fontSize:10, fontWeight:600, color:C.muted, pointerEvents:'none', fontFamily:'Manrope,sans-serif', letterSpacing:'0.03em' }}>{label}</label>
      )}
    </div>
  )
}

// ─── Password strength ────────────────────────────────────────────────────────
function PasswordStrength({ value }: { value: string }) {
  if (!value) return null
  const score = [/[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/, /.{8,}/].filter(r => r.test(value)).length
  const labels = ['Weak', 'Fair', 'Good', 'Strong']
  const colors = ['#EF4444', '#F59E0B', '#3B82F6', '#22C55E']
  return (
    <div style={{ marginTop:6 }}>
      <div style={{ display:'flex', gap:4, marginBottom:4 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ flex:1, height:3, borderRadius:2, background: i < score ? colors[score-1] : C.border, transition:'background 0.25s' }} />
        ))}
      </div>
      <p style={{ fontSize:11, color: colors[score-1] ?? C.muted, fontFamily:'Manrope,sans-serif', fontWeight:600 }}>{labels[score-1] ?? 'Too short'}</p>
    </div>
  )
}

// ─── Step progress bar ────────────────────────────────────────────────────────
function StepBar({ current, total, label }: { current: number; total: number; label: string }) {
  return (
    <div style={{ marginBottom:28 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
        <span style={{ fontSize:12, fontWeight:700, color:C.primary, fontFamily:'Manrope,sans-serif' }}>Step {current} of {total}</span>
        <span style={{ fontSize:12, color:C.muted, fontFamily:'Manrope,sans-serif' }}>{label}</span>
      </div>
      <div style={{ height:4, borderRadius:4, background:C.border, overflow:'hidden' }}>
        <div style={{ height:'100%', borderRadius:4, background:`linear-gradient(90deg,${C.primary},#00959E)`, width:`${(current/total)*100}%`, transition:'width 0.4s cubic-bezier(0.4,0,0.2,1)' }} />
      </div>
    </div>
  )
}

// ─── Toggle chip ──────────────────────────────────────────────────────────────
function ToggleChip({ label, selected, onToggle, icon }: { label: string; selected: boolean; onToggle: () => void; icon?: ReactNode }) {
  return (
    <button onClick={onToggle} style={{
      display:'inline-flex', alignItems:'center', gap:7, padding:'8px 14px',
      borderRadius:10, border:`1.5px solid ${selected ? C.primary : C.border}`,
      background: selected ? `${C.primary}10` : '#fff',
      color: selected ? C.primary : C.sub, cursor:'pointer',
      fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:600,
      transition:'all 0.15s',
    }}>
      {icon && <span style={{ width:14, height:14, display:'flex', alignItems:'center', justifyContent:'center' }}>{icon}</span>}
      {label}
      {selected && <span style={{ width:14, height:14, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary }}>{Ico.check}</span>}
    </button>
  )
}

// ─── OTP Input ────────────────────────────────────────────────────────────────
function OTPInput({ value, onChange, error }: { value: string[]; onChange: (v: string[]) => void; error?: boolean }) {
  const refs = useRef<(HTMLInputElement|null)[]>([])
  const onKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) refs.current[i-1]?.focus()
  }
  const onInput = (i: number, v: string) => {
    const d = v.replace(/\D/g,'').slice(-1)
    const next = [...value]; next[i] = d
    onChange(next)
    if (d && i < 5) refs.current[i+1]?.focus()
  }
  const onPaste = (e: React.ClipboardEvent) => {
    const t = e.clipboardData.getData('text').replace(/\D/g,'').slice(0,6)
    const next = [...value]
    t.split('').forEach((c, i) => { next[i] = c })
    onChange(next)
    refs.current[Math.min(t.length, 5)]?.focus()
  }
  return (
    <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
      {[0,1,2,3,4,5].map(i => (
        <input key={i} ref={el => { refs.current[i] = el }}
          maxLength={1} value={value[i] ?? ''} inputMode="numeric"
          onChange={e => onInput(i, e.target.value)}
          onKeyDown={e => onKey(i, e)} onPaste={onPaste}
          style={{
            width:52, height:58, textAlign:'center', borderRadius:14,
            border:`1.5px solid ${error ? C.error : value[i] ? C.primary : C.border}`,
            fontSize:24, fontWeight:800, fontFamily:'Manrope,sans-serif', color:C.type,
            background: value[i] ? `${C.primary}08` : '#fff',
            outline:'none', boxShadow: value[i] ? `0 0 0 3px ${C.primary}15` : 'none',
            transition:'all 0.15s',
          }}
        />
      ))}
    </div>
  )
}

// ─── Countdown ────────────────────────────────────────────────────────────────
function Countdown({ seconds: init, onDone }: { seconds: number; onDone: () => void }) {
  const [s, setS] = useState(init)
  useEffect(() => {
    if (s <= 0) { onDone(); return }
    const t = setTimeout(() => setS(v => v - 1), 1000)
    return () => clearTimeout(t)
  }, [s])
  const mm = String(Math.floor(s / 60)).padStart(2,'0')
  const ss = String(s % 60).padStart(2,'0')
  return <span style={{ fontWeight:700, color: s < 30 ? C.error : C.primary, fontFamily:'Manrope,sans-serif' }}>{mm}:{ss}</span>
}

// ─── Upload zone ──────────────────────────────────────────────────────────────
function UploadZone({ label, uploaded, onUpload }: { label: string; uploaded: boolean; onUpload: () => void }) {
  const [drag, setDrag] = useState(false)
  return (
    <button onClick={onUpload} onDragOver={() => setDrag(true)} onDragLeave={() => setDrag(false)}
      style={{
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10,
        padding:'28px 16px', borderRadius:16,
        border:`1.5px dashed ${uploaded ? C.primary : drag ? C.primary : C.border}`,
        background: uploaded ? `${C.primary}06` : drag ? `${C.primary}04` : '#FAFAFA',
        cursor:'pointer', width:'100%', transition:'all 0.15s',
      }}>
      <span style={{ width:40, height:40, borderRadius:12, background: uploaded ? `${C.primary}12` : '#F2F4F5', display:'flex', alignItems:'center', justifyContent:'center', color: uploaded ? C.primary : C.muted }}>
        {uploaded ? Ico.check : Ico.upload}
      </span>
      <div style={{ textAlign:'center' }}>
        <p style={{ fontSize:13, fontWeight:700, color: uploaded ? C.primary : C.type, fontFamily:'Manrope,sans-serif' }}>
          {uploaded ? 'Uploaded' : label}
        </p>
        {!uploaded && <p style={{ fontSize:11, color:C.muted, fontFamily:'Manrope,sans-serif', marginTop:2 }}>Click to upload or drag & drop</p>}
      </div>
    </button>
  )
}

// ─── Auth panel shell ─────────────────────────────────────────────────────────
// Desktop: left teal illustration panel + right white form panel
// Mobile: stacked
function AuthShell({ left, children }: { left: ReactNode; children: ReactNode }) {
  return (
    <div style={{ minHeight:'100vh', display:'flex', background:C.bg, fontFamily:'Manrope,sans-serif' }}>
      {/* Left panel — hidden on small screens */}
      <div className="hidden md:flex" style={{
        width:420, flexShrink:0, background:'linear-gradient(160deg,#005D63 0%,#00737A 55%,#00959E 100%)',
        flexDirection:'column', position:'relative', overflow:'hidden', padding:'48px 40px',
      }}>
        {/* mesh blobs */}
        <div aria-hidden style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
          <div style={{ position:'absolute', top:-80, right:-80, width:320, height:320, borderRadius:'50%', background:'radial-gradient(circle,rgba(255,255,255,0.10) 0%,transparent 65%)' }} />
          <div style={{ position:'absolute', bottom:-60, left:-60, width:280, height:280, borderRadius:'50%', background:'radial-gradient(circle,rgba(238,129,83,0.18) 0%,transparent 65%)' }} />
          <div aria-hidden className="bg-grid" style={{ position:'absolute', inset:0, opacity:0.06 }} />
        </div>
        <img src={logoWhite} alt="ReadyPal" style={{ height:84, objectFit:'contain', objectPosition:'left', filter:'brightness(0) invert(1)', position:'relative', zIndex:1, marginBottom:'auto' }} />
        <div style={{ position:'relative', zIndex:1 }}>{left}</div>
        <div style={{ position:'relative', zIndex:1, marginTop:48, fontSize:11, color:'rgba(255,255,255,0.40)' }}>© 2025 ReadyPal · Privacy · Terms</div>
      </div>

      {/* Right panel */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 24px', overflowY:'auto' }}>
        {/* Mobile logo */}
        <div className="md:hidden" style={{ marginBottom:28 }}>
          <img src={logoFull} alt="ReadyPal" style={{ height:84, objectFit:'contain' }} />
        </div>
        <div style={{ width:'100%', maxWidth:440 }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── Left panel content (illustration area) ────────────────────────────────────
function LeftPanel({ icon, title, desc, facts }: { icon: ReactNode; title: string; desc: string; facts?: string[] }) {
  return (
    <div>
      {/* Illustration-style icon */}
      <div style={{ width:72, height:72, borderRadius:24, background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.20)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:28, color:'#fff' }}>
        <span style={{ width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center' }}>{icon}</span>
      </div>
      <h2 style={{ fontSize:26, fontWeight:900, color:'#fff', lineHeight:1.2, letterSpacing:'-0.02em', marginBottom:12 }}>{title}</h2>
      <p style={{ fontSize:14, color:'rgba(255,255,255,0.68)', lineHeight:1.7, marginBottom: facts ? 28 : 0 }}>{desc}</p>
      {facts && (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {facts.map(f => (
            <div key={f} style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ width:22, height:22, borderRadius:8, background:'rgba(255,255,255,0.14)', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.80)', flexShrink:0 }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5.5l2.5 2.5 5-5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              <span style={{ fontSize:13, color:'rgba(255,255,255,0.75)', fontWeight:500 }}>{f}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Alert inline ─────────────────────────────────────────────────────────────
function InlineAlert({ type, message }: { type:'error'|'warning'|'success'; message: string }) {
  const t = { error:{ bg:'#FEF2F2', border:'#FECACA', color:C.error, icon:Ico.x }, warning:{ bg:'#FFFBEB', border:'#FDE68A', color:C.warning, icon:Ico.warning }, success:{ bg:'#F0FDF4', border:'#BBF7D0', color:C.success, icon:Ico.check } }[type]
  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'10px 14px', borderRadius:10, background:t.bg, border:`1px solid ${t.border}`, marginBottom:8 }}>
      <span style={{ color:t.color, flexShrink:0, marginTop:1 }}>{t.icon}</span>
      <p style={{ fontSize:13, color:t.color, fontFamily:'Manrope,sans-serif', lineHeight:1.5 }}>{message}</p>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREENS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Welcome ──────────────────────────────────────────────────────────────────
function WelcomeScreen({ go }: { go: (s: AuthScreen) => void }) {
  const [lang, setLang] = useState<'en'|'si'|'ta'>('en')
  const langs: [string, typeof lang][] = [['English','en'],['සිංහල','si'],['தமிழ்','ta']]
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'linear-gradient(160deg,#F0F7F8 0%,#F9F6F3 60%,#F5EDE8 100%)', padding:'32px 24px', fontFamily:'Manrope,sans-serif', position:'relative', overflow:'hidden' }}>
      {/* blobs */}
      <div aria-hidden style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
        <div style={{ position:'absolute', top:-100, left:-60, width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(0,115,122,0.12) 0%,transparent 70%)' }} />
        <div style={{ position:'absolute', bottom:-80, right:-40, width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(238,129,83,0.10) 0%,transparent 70%)' }} />
      </div>

      <div style={{ width:'100%', maxWidth:420, position:'relative', zIndex:1 }}>
        {/* Language switcher */}
        <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:32, gap:6 }}>
          {langs.map(([l, k]) => (
            <button key={k} onClick={() => setLang(k)} style={{
              padding:'5px 12px', borderRadius:8, border:'none', cursor:'pointer', fontSize:12, fontWeight:600,
              background: lang === k ? C.primary : 'rgba(255,255,255,0.70)',
              color: lang === k ? '#fff' : C.sub, fontFamily:'Manrope,sans-serif', transition:'all 0.15s',
            }}>{l}</button>
          ))}
        </div>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <img src={logoFull} alt="ReadyPal" style={{ height:84, objectFit:'contain', marginBottom:24 }} />

          {/* Illustration */}
          <div style={{ width:220, height:220, margin:'0 auto 24px', borderRadius:'50%', background:'rgba(0,115,122,0.06)', border:'2px solid rgba(0,115,122,0.10)', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
            {/* Family illustration using shapes */}
            <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
              {/* Elderly person */}
              <circle cx="55" cy="42" r="16" fill="#E6F4F5" stroke="#00737A" strokeWidth="1.5"/>
              <path d="M55 58c-12 0-22 10-22 22v10h44V80c0-12-10-22-22-22z" fill="#C2E5E7" stroke="#00737A" strokeWidth="1.5"/>
              {/* Caregiver */}
              <circle cx="95" cy="38" r="14" fill="#FDE0CC" stroke="#EE8153" strokeWidth="1.5"/>
              <path d="M95 52c-10 0-19 9-19 20v10h38V72c0-11-9-20-19-20z" fill="#FACCAA" stroke="#EE8153" strokeWidth="1.5"/>
              {/* Hands clasped */}
              <path d="M67 76 Q71 70 75 76" stroke="#00737A" strokeWidth="2" strokeLinecap="round" fill="none"/>
              {/* Heart */}
              <path d="M70 108 Q70 108 65 104 Q62 100 65 97 Q68 94 70 97 Q72 94 75 97 Q78 100 75 104 Q70 108 70 108z" fill="#EE8153" opacity="0.7"/>
              {/* Remote connection dots */}
              <circle cx="20" cy="20" r="4" fill="#00737A" opacity="0.3"/>
              <circle cx="30" cy="20" r="4" fill="#00737A" opacity="0.5"/>
              <circle cx="40" cy="20" r="4" fill="#00737A" opacity="0.8"/>
              <circle cx="120" cy="20" r="3" fill="#EE8153" opacity="0.5"/>
            </svg>
          </div>

          <h1 style={{ fontSize:26, fontWeight:900, color:C.type, letterSpacing:'-0.02em', lineHeight:1.2, marginBottom:10 }}>
            Care that feels close,<br />from anywhere.
          </h1>
          <p style={{ fontSize:15, color:C.sub, lineHeight:1.65, maxWidth:340, margin:'0 auto' }}>
            Trusted care agents for your elderly parents back home in Sri Lanka.
          </p>
        </div>

        {/* CTAs */}
        <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:20 }}>
          <Btn variant="primary" size="lg" fullWidth onClick={() => go('login')}>Log In to Your Account</Btn>
          <Btn variant="outline" size="lg" fullWidth onClick={() => go('role-select')}>Create a Free Account</Btn>
          <Btn variant="ghost" size="md" fullWidth onClick={() => go('login')}>Continue as Guest</Btn>
        </div>

        {/* Trust row */}
        <div style={{ display:'flex', justifyContent:'center', gap:20, flexWrap:'wrap' }}>
          {[
            { icon: Ico.shield, label:'Verified Agents' },
            { icon: Ico.lock,   label:'Secure Payments' },
            { icon: Ico.star,   label:'4.9 / 5 Rating' },
          ].map(t => (
            <div key={t.label} style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ color:C.primary }}>{t.icon}</span>
              <span style={{ fontSize:12, fontWeight:600, color:C.sub }}>{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ position:'absolute', bottom:20, left:0, right:0, textAlign:'center', fontSize:11, color:C.muted }}>
        <button onClick={() => {}} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, fontFamily:'Manrope,sans-serif', fontSize:11 }}>Privacy</button>
        &nbsp;·&nbsp;
        <button onClick={() => {}} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, fontFamily:'Manrope,sans-serif', fontSize:11 }}>Terms</button>
        &nbsp;·&nbsp;
        <button onClick={() => {}} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, fontFamily:'Manrope,sans-serif', fontSize:11 }}>Support</button>
      </div>
    </div>
  )
}

// ─── Login ────────────────────────────────────────────────────────────────────
function LoginScreen({ go }: { go: (s: AuthScreen) => void }) {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [show, setShow] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    if (!email || !pass) {
      setError('Please fill in all fields.')
      return
    }

    try {
      setError('')
      setLoading(true)

      const result = await signInUser(email, pass)

      console.log('Supabase login successful:', result)

      // Route by the real, stored role/application state — never by
      // anything decided client-side at signup time. A stale/older
      // account without a role recorded yet falls back to onboarding,
      // matching this app's previous unconditional behaviour.
      let destination = '/agent/onboarding'

      try {
        const profile = await getMyProfile()

        if (profile?.role === 'client') {
          destination = '/dashboard'
        } else if (profile?.role === 'agent') {
          const agentDetails = await getMyAgentDetails().catch(() => null)
          destination = agentDetails?.application_status === 'approved'
            ? '/agent/agentdashboard'
            : '/agent/onboarding'
        }
        // role === 'admin' (or unset/unrecognised) keeps the existing
        // pre-role-selection behaviour — admin routing is untouched here.
      } catch (routingError) {
        console.error('Failed to resolve role for post-login routing:', routingError)
      }

      window.location.href = destination
    } catch (err) {
      console.error('Supabase login failed:', err)

      if (err instanceof Error) {
        setError(err.message)
      } else {
      setError('Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell left={
      <LeftPanel
        icon={<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="10" r="6" stroke="white" strokeWidth="1.8"/><path d="M4 28c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="white" strokeWidth="1.8" strokeLinecap="round"/></svg>}
        title="Welcome back."
        desc="Log in to manage your loved one's care from anywhere in the world."
        facts={['Real-time visit updates', 'Verified care agents', '24/7 platform access']}
      />
    }>
      {/* Back */}
      <button onClick={() => go('welcome')} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:C.sub, fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:600, marginBottom:24, padding:0 }}>
        {Ico.arrowL} Back
      </button>

      <h1 style={{ fontSize:26, fontWeight:900, color:C.type, letterSpacing:'-0.02em', marginBottom:6 }}>Log In</h1>
      <p style={{ fontSize:14, color:C.sub, marginBottom:28 }}>Don't have an account? <button onClick={() => go('role-select')} style={{ color:C.primary, fontWeight:700, background:'none', border:'none', cursor:'pointer', fontFamily:'Manrope,sans-serif' }}>Sign up free</button></p>

      {error && <InlineAlert type="error" message={error} />}

      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <FloatInput label="Email address" type="email" value={email} onChange={setEmail} icon={Ico.mail} />
        <FloatInput label="Password" type={show ? 'text' : 'password'} value={pass} onChange={setPass}
          icon={Ico.lock} iconRight={show ? Ico.eyeOff : Ico.eye} onIconRight={() => setShow(v => !v)} />

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
            <div onClick={() => setRemember(v => !v)} style={{
              width:18, height:18, borderRadius:5, border:`1.5px solid ${remember ? C.primary : C.border}`,
              background: remember ? C.primary : '#fff', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all 0.15s', flexShrink:0,
            }}>
              {remember && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <span style={{ fontSize:13, color:C.sub, fontFamily:'Manrope,sans-serif' }}>Remember me</span>
          </label>
          <button onClick={() => go('forgot-1')} style={{ background:'none', border:'none', cursor:'pointer', fontSize:13, fontWeight:600, color:C.primary, fontFamily:'Manrope,sans-serif' }}>Forgot password?</button>
        </div>

        <Btn variant="primary" size="lg" fullWidth onClick={submit} loading={loading}>Continue</Btn>
      </div>

      {/* Divider */}
      <div style={{ display:'flex', alignItems:'center', gap:12, margin:'20px 0' }}>
        <div style={{ flex:1, height:1, background:C.border }} />
        <span style={{ fontSize:12, color:C.muted, fontWeight:600 }}>OR</span>
        <div style={{ flex:1, height:1, background:C.border }} />
      </div>

      {/* Social */}
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        <button style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, padding:'11px 16px', borderRadius:12, border:`1.5px solid ${C.border}`, background:'#fff', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:14, fontWeight:600, color:C.type, transition:'all 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#C8D0D4'}
          onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
          {Ico.google} Continue with Google
        </button>
        <button style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, padding:'11px 16px', borderRadius:12, border:`1.5px solid ${C.border}`, background:'#fff', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:14, fontWeight:600, color:C.type, transition:'all 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#C8D0D4'}
          onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
          {Ico.apple} Continue with Apple
        </button>
      </div>
    </AuthShell>
  )
}

// ─── Role select ──────────────────────────────────────────────────────────────
function RoleSelectScreen({ go }: { go: (s: AuthScreen) => void }) {
  const [role, setRole] = useState<'client'|'agent'|null>(null)
  const roles = [
    {
      key: 'client' as const,
      icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="14" cy="10" r="5" stroke="currentColor" strokeWidth="1.8"/><path d="M3 26c0-6 4.5-10 11-10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M22 20l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="23" cy="21" r="7" stroke="currentColor" strokeWidth="1.4"/></svg>,
      title:'I need care services',
      desc:'Find trusted Care Agents for yourself or your family.',
      benefits:['Post care requests', 'View verified agents', 'Real-time updates'],
      color: C.primary,
    },
    {
      key: 'agent' as const,
      icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="10" r="5" stroke="currentColor" strokeWidth="1.8"/><path d="M6 26c0-5.52 4.48-10 10-10s10 4.48 10 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M23 2l1.5 3.1 3.5.5-2.5 2.3.6 3.2-3.1-1.6-3.1 1.6.6-3.2-2.5-2.3 3.5-.5L23 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>,
      title:'I want to become a Care Agent',
      desc:'Provide care services and find available care jobs.',
      benefits:['Flexible hours', 'Reliable income', 'Meaningful work'],
      color: C.accent,
    },
  ]
  return (
    <AuthShell left={
      <LeftPanel
        icon={<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M6 16C6 10.477 10.477 6 16 6s10 4.477 10 10-4.477 10-10 10S6 21.523 6 16z" stroke="white" strokeWidth="1.8"/><path d="M16 10v6l4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round"/></svg>}
        title="Let's get you set up."
        desc="Tell us who you are so we can personalise your ReadyPal experience."
      />
    }>
      <button onClick={() => go('welcome')} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:C.sub, fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:600, marginBottom:24, padding:0 }}>
        {Ico.arrowL} Back
      </button>
      <h1 style={{ fontSize:26, fontWeight:900, color:C.type, letterSpacing:'-0.02em', marginBottom:6 }}>How would you like to use ReadyPal?</h1>
      <p style={{ fontSize:14, color:C.sub, marginBottom:28 }}>Select the option that best describes you.</p>

      <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:28 }}>
        {roles.map(r => (
          <button key={r.key} onClick={() => setRole(r.key)} style={{
            display:'flex', alignItems:'flex-start', gap:16, padding:'20px', borderRadius:18, textAlign:'left',
            border:`2px solid ${role === r.key ? r.color : C.border}`,
            background: role === r.key ? `${r.color}07` : '#fff',
            cursor:'pointer', transition:'all 0.18s', width:'100%',
            boxShadow: role === r.key ? `0 4px 16px ${r.color}18` : 'none',
          }}>
            <span style={{ width:52, height:52, borderRadius:16, background: role === r.key ? `${r.color}14` : '#F2F4F5', display:'flex', alignItems:'center', justifyContent:'center', color: role === r.key ? r.color : C.muted, flexShrink:0, transition:'all 0.18s' }}>{r.icon}</span>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:16, fontWeight:800, color:C.type, marginBottom:4, fontFamily:'Manrope,sans-serif' }}>{r.title}</p>
              <p style={{ fontSize:13, color:C.sub, lineHeight:1.55, marginBottom:10, fontFamily:'Manrope,sans-serif' }}>{r.desc}</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {r.benefits.map(b => (
                  <span key={b} style={{ fontSize:11, fontWeight:600, padding:'3px 8px', borderRadius:6, background: role === r.key ? `${r.color}12` : '#F2F4F5', color: role === r.key ? r.color : C.muted }}>{b}</span>
                ))}
              </div>
            </div>
            <div style={{ width:20, height:20, borderRadius:'50%', border:`2px solid ${role === r.key ? r.color : C.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 }}>
              {role === r.key && <div style={{ width:10, height:10, borderRadius:'50%', background:r.color }} />}
            </div>
          </button>
        ))}
      </div>

      <Btn variant="primary" size="lg" fullWidth disabled={!role} onClick={() => role && go(role === 'client' ? 'client-1' : 'agent-1')}>
        Continue {Ico.arrowR}
      </Btn>
    </AuthShell>
  )
}

// ─── Client Step 1 — Personal Info ───────────────────────────────────────────
function ClientStep1({ go }: { go: (s: AuthScreen) => void }) {
  const [f, setF] = useState({ firstName:'', lastName:'', email:'', phone:'', country:'', password:'', confirm:'' })
  const [showP, setShowP] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const up = (k: keyof typeof f) => (v: string) => setF(prev => ({ ...prev, [k]: v }))
  const countries = ['Australia','United Kingdom','Canada','United States','New Zealand','Germany','France','UAE','Singapore','Malaysia']

  const submit = async () => {
    if (!f.firstName.trim() || !f.lastName.trim() || !f.email.trim() || !f.password) {
      setError('Please fill in all required fields.')
      return
    }

    if (f.password !== f.confirm) {
      setError('Passwords do not match.')
      return
    }

    try {
      setError('')
      setSubmitting(true)

      // role is only ever this literal — 'client' — never state threaded
      // in from elsewhere. public.profiles.role is set server-side by the
      // handle_new_user() trigger from this signup metadata; no follow-up
      // client-side write is needed or permitted.
      const { session } = await signUpUser(
        f.email.trim(), f.password, `${f.firstName.trim()} ${f.lastName.trim()}`, 'client'
      )

      if (session) {
        window.location.href = '/dashboard'
      } else {
        // Email confirmation is required — no session yet. Account
        // creation still succeeded; this is not a failure.
        go('email-verify')
      }
    } catch (err) {
      console.error('Client signup failed:', err)
      setError(err instanceof Error ? err.message : 'Signup failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell left={<LeftPanel icon={Ico.user} title="Tell us about yourself." desc="Your details help us personalise your experience and keep your account secure." facts={['Secure & encrypted','Never shared with third parties','GDPR compliant']} />}>
      <button onClick={() => go('role-select')} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:C.sub, fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:600, marginBottom:24, padding:0 }}>{Ico.arrowL} Back</button>
      <StepBar current={1} total={5} label="Personal Information" />
      <h1 style={{ fontSize:22, fontWeight:900, color:C.type, letterSpacing:'-0.02em', marginBottom:20 }}>Personal Information</h1>
      {error && <InlineAlert type="error" message={error} />}
      <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <FloatInput label="First Name" value={f.firstName} onChange={up('firstName')} />
          <FloatInput label="Last Name" value={f.lastName} onChange={up('lastName')} />
        </div>
        <FloatInput label="Email Address" type="email" value={f.email} onChange={up('email')} icon={Ico.mail} hint="We'll send a verification email." />
        <FloatInput label="Phone Number" type="tel" value={f.phone} onChange={up('phone')} icon={Ico.phone} hint="+61 for Australia, +44 for UK…" />
        <Select label="Country of Residence" value={f.country} onChange={up('country')} options={countries} icon={Ico.globe} />
        <FloatInput label="Password" type={showP ? 'text' : 'password'} value={f.password} onChange={up('password')} icon={Ico.lock} iconRight={showP ? Ico.eyeOff : Ico.eye} onIconRight={() => setShowP(v => !v)} />
        <PasswordStrength value={f.password} />
        <FloatInput label="Confirm Password" type={showP ? 'text' : 'password'} value={f.confirm} onChange={up('confirm')}
          icon={Ico.lock}
          error={f.confirm && f.confirm !== f.password ? 'Passwords do not match.' : undefined} />
        <Btn variant="primary" size="lg" fullWidth onClick={submit} loading={submitting}>Continue {Ico.arrowR}</Btn>
      </div>
    </AuthShell>
  )
}

// ─── Client Step 2 — Communication Preferences ────────────────────────────────
function ClientStep2({ go }: { go: (s: AuthScreen) => void }) {
  const [prefs, setPrefs] = useState({ email:true, sms:true, push:false })
  const [lang, setLang] = useState('')
  const [tz, setTz] = useState('')
  const toggle = (k: keyof typeof prefs) => setPrefs(p => ({ ...p, [k]: !p[k] }))
  const channels: [keyof typeof prefs, string, ReactNode][] = [
    ['email', 'Email Notifications', Ico.mail],
    ['sms',   'SMS Alerts',          Ico.phone],
    ['push',  'Push Notifications',  Ico.info],
  ]
  return (
    <AuthShell left={<LeftPanel icon={Ico.globe} title="Stay connected." desc="Customise how and when we reach you with care updates for your loved one." />}>
      <button onClick={() => go('client-1')} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:C.sub, fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:600, marginBottom:24, padding:0 }}>{Ico.arrowL} Back</button>
      <StepBar current={2} total={5} label="Communication Preferences" />
      <h1 style={{ fontSize:22, fontWeight:900, color:C.type, letterSpacing:'-0.02em', marginBottom:20 }}>Communication Preferences</h1>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <p style={{ fontSize:13, fontWeight:600, color:C.sub, marginBottom:4 }}>How should we notify you?</p>
        {channels.map(([k, label, icon]) => (
          <button key={k} onClick={() => toggle(k)} style={{
            display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px',
            borderRadius:14, border:`1.5px solid ${prefs[k] ? C.primary : C.border}`,
            background: prefs[k] ? `${C.primary}07` : '#fff', cursor:'pointer', transition:'all 0.15s',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <span style={{ color: prefs[k] ? C.primary : C.muted }}>{icon}</span>
              <span style={{ fontSize:14, fontWeight:600, color:C.type, fontFamily:'Manrope,sans-serif' }}>{label}</span>
            </div>
            {/* Toggle */}
            <div style={{ width:38, height:22, borderRadius:11, background: prefs[k] ? C.primary : C.border, position:'relative', transition:'background 0.2s', flexShrink:0 }}>
              <div style={{ position:'absolute', top:3, left: prefs[k] ? 19 : 3, width:16, height:16, borderRadius:'50%', background:'#fff', transition:'left 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.15)' }} />
            </div>
          </button>
        ))}
        <div style={{ marginTop:8 }}>
          <p style={{ fontSize:13, fontWeight:600, color:C.sub, marginBottom:10 }}>Language & Timezone</p>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <Select label="Preferred Language" value={lang} onChange={setLang} options={['English','සිංහල (Sinhala)','தமிழ் (Tamil)']} icon={Ico.globe} />
            <Select label="Time Zone" value={tz} onChange={setTz} options={['AEST (GMT+10) — Sydney','BST (GMT+1) — London','EST (GMT-5) — Toronto','PST (GMT-8) — Vancouver','IST (GMT+5:30) — India','SGT (GMT+8) — Singapore']} icon={Ico.clock} />
          </div>
        </div>
        <Btn variant="primary" size="lg" fullWidth onClick={() => go('client-3')}>Continue {Ico.arrowR}</Btn>
      </div>
    </AuthShell>
  )
}

// ─── Client Step 3 — Emergency Contact ───────────────────────────────────────
function ClientStep3({ go }: { go: (s: AuthScreen) => void }) {
  const [f, setF] = useState({ name:'', relationship:'', phone:'', email:'' })
  const up = (k: keyof typeof f) => (v: string) => setF(p => ({ ...p, [k]: v }))
  return (
    <AuthShell left={<LeftPanel icon={Ico.phone} title="Who do we call in an emergency?" desc="We'll contact this person if we cannot reach you and there's a care issue with your loved one." />}>
      <button onClick={() => go('client-2')} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:C.sub, fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:600, marginBottom:24, padding:0 }}>{Ico.arrowL} Back</button>
      <StepBar current={3} total={5} label="Emergency Contact" />
      <h1 style={{ fontSize:22, fontWeight:900, color:C.type, letterSpacing:'-0.02em', marginBottom:6 }}>Emergency Contact</h1>
      <p style={{ fontSize:14, color:C.sub, marginBottom:20 }}>This information is only used in genuine emergencies.</p>
      <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
        <FloatInput label="Full Name" value={f.name} onChange={up('name')} icon={Ico.user} hint="e.g. Nimal Perera" />
        <Select label="Relationship" value={f.relationship} onChange={up('relationship')} options={['Spouse / Partner','Sibling','Son / Daughter','Friend','Colleague','Other']} />
        <FloatInput label="Phone Number" type="tel" value={f.phone} onChange={up('phone')} icon={Ico.phone} />
        <FloatInput label="Email Address (Optional)" type="email" value={f.email} onChange={up('email')} icon={Ico.mail} />
        <Btn variant="primary" size="lg" fullWidth onClick={() => go('client-4')}>Continue {Ico.arrowR}</Btn>
        <Btn variant="ghost" size="md" fullWidth onClick={() => go('client-4')}>Skip for now</Btn>
      </div>
    </AuthShell>
  )
}

// ─── Client Step 4 — OTP Verification ────────────────────────────────────────
function ClientStep4({ go }: { go: (s: AuthScreen) => void }) {
  const [otp, setOtp] = useState(['','','','','',''])
  const [expired, setExpired] = useState(false)
  const [error, setError] = useState('')
  const filled = otp.every(v => v !== '')
  const verify = () => {
    if (otp.join('') === '000000') { setError('Incorrect OTP. Please try again.'); return }
    go('client-5')
  }
  return (
    <AuthShell left={<LeftPanel icon={Ico.shield} title="One last check." desc="We've sent a 6-digit code to your mobile number to confirm it's really you." />}>
      <button onClick={() => go('client-3')} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:C.sub, fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:600, marginBottom:24, padding:0 }}>{Ico.arrowL} Back</button>
      <StepBar current={4} total={5} label="Verification" />
      <h1 style={{ fontSize:22, fontWeight:900, color:C.type, letterSpacing:'-0.02em', marginBottom:6 }}>Enter Verification Code</h1>
      <p style={{ fontSize:14, color:C.sub, marginBottom:28 }}>Sent to <strong>+61 4XX XXX XXX</strong>. Check your messages.</p>
      {error && <InlineAlert type="error" message={error} />}
      <div style={{ marginBottom:28 }}>
        <OTPInput value={otp} onChange={setOtp} error={!!error} />
      </div>
      <div style={{ textAlign:'center', marginBottom:24 }}>
        {expired ? (
          <button onClick={() => setExpired(false)} style={{ display:'inline-flex', alignItems:'center', gap:6, color:C.primary, fontWeight:700, background:'none', border:'none', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:13 }}>
            {Ico.refresh} Resend code
          </button>
        ) : (
          <p style={{ fontSize:13, color:C.sub, fontFamily:'Manrope,sans-serif' }}>
            Code expires in <Countdown seconds={120} onDone={() => setExpired(true)} />
          </p>
        )}
      </div>
      <Btn variant="primary" size="lg" fullWidth disabled={!filled} onClick={verify}>Verify & Continue</Btn>
      <p style={{ textAlign:'center', fontSize:12, color:C.muted, marginTop:16 }}>
        Prefer a call?&nbsp;
        <button style={{ color:C.primary, fontWeight:700, background:'none', border:'none', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12 }}>Request voice call</button>
      </p>
    </AuthShell>
  )
}

// ─── Client Step 5 — Welcome / Success ───────────────────────────────────────
function ClientStep5({ go }: { go: (s: AuthScreen) => void }) {
  return (
    <AuthShell left={<LeftPanel icon={Ico.checkCircle} title="You're all set!" desc="Your ReadyPal family account is ready. Post your first care request in minutes." facts={['Browse 2,400+ verified agents','Real-time visit reports','Secure escrow payments']} />}>
      <div style={{ textAlign:'center', padding:'20px 0' }}>
        {/* Animated check */}
        <div style={{ width:88, height:88, borderRadius:'50%', background:'#F0FDF4', border:'3px solid #BBF7D0', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 28px', color:C.success }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M6 21l9 9 19-20" stroke={C.success} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h1 style={{ fontSize:26, fontWeight:900, color:C.type, letterSpacing:'-0.02em', marginBottom:10 }}>Welcome to ReadyPal!</h1>
        <p style={{ fontSize:15, color:C.sub, lineHeight:1.7, marginBottom:32 }}>
          Your account has been created. You can now post your first care request and connect with a verified care agent in Sri Lanka.
        </p>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <Btn variant="primary" size="lg" fullWidth onClick={() => go('welcome')}>Go to Dashboard</Btn>
          <Btn variant="ghost" size="md" fullWidth onClick={() => go('welcome')}>Explore the platform first</Btn>
        </div>
      </div>
    </AuthShell>
  )
}

// ─── Agent Step 1 — Personal Info ────────────────────────────────────────────
function AgentStep1({ go }: { go: (s: AuthScreen) => void }) {
  const [f, setF] = useState({ name:'', email:'', password:'', confirm:'' })
  const [showP, setShowP] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const up = (k: keyof typeof f) => (v: string) => setF(p => ({ ...p, [k]: v }))

  const submit = async () => {
    if (!f.name.trim() || !f.email.trim() || !f.password) {
      setError('Please fill in all required fields.')
      return
    }

    if (f.password !== f.confirm) {
      setError('Passwords do not match.')
      return
    }

    try {
      setError('')
      setSubmitting(true)

      // role is only ever this literal — 'agent' — never state threaded
      // in from elsewhere. public.profiles.role is set server-side by the
      // handle_new_user() trigger from this signup metadata; no follow-up
      // client-side write is needed or permitted. Detailed application
      // data (NIC, DOB, address, etc.) is collected once, for real, in
      // CareAgentOnboarding.tsx, which this redirects straight into —
      // not duplicated here.
      const { session } = await signUpUser(f.email.trim(), f.password, f.name.trim(), 'agent')

      if (session) {
        window.location.href = '/agent/onboarding'
      } else {
        // Email confirmation is required — no session yet. Account
        // creation still succeeded; this is not a failure.
        go('email-verify')
      }
    } catch (err) {
      console.error('Agent signup failed:', err)
      setError(err instanceof Error ? err.message : 'Signup failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell left={<LeftPanel icon={Ico.user} title="Start your application." desc="Join 2,400+ verified ReadyPal care agents and build a meaningful career helping Sri Lankan families." facts={['Free to apply','Verification in 3–5 days','Earn LKR 35,000–120,000/month']} />}>
      <button onClick={() => go('role-select')} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:C.sub, fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:600, marginBottom:24, padding:0 }}>{Ico.arrowL} Back</button>
      <h1 style={{ fontSize:22, fontWeight:900, color:C.type, letterSpacing:'-0.02em', marginBottom:20 }}>Personal Information</h1>
      {error && <InlineAlert type="error" message={error} />}
      <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
        <FloatInput label="Full Name" value={f.name} onChange={up('name')} icon={Ico.user} hint="e.g. Chamari Dissanayake" />
        <FloatInput label="Email Address" type="email" value={f.email} onChange={up('email')} icon={Ico.mail} />
        <FloatInput label="Password" type={showP ? 'text' : 'password'} value={f.password} onChange={up('password')} icon={Ico.lock} iconRight={showP ? Ico.eyeOff : Ico.eye} onIconRight={() => setShowP(v => !v)} />
        <PasswordStrength value={f.password} />
        <FloatInput label="Confirm Password" type={showP ? 'text' : 'password'} value={f.confirm} onChange={up('confirm')}
          icon={Ico.lock}
          error={f.confirm && f.confirm !== f.password ? 'Passwords do not match.' : undefined} />
        <Btn variant="primary" size="lg" fullWidth onClick={submit} loading={submitting}>Continue {Ico.arrowR}</Btn>
      </div>
    </AuthShell>
  )
}

// ─── Agent Step 2 — Professional Details ─────────────────────────────────────
function AgentStep2({ go }: { go: (s: AuthScreen) => void }) {
  const [occ, setOcc] = useState('')
  const [exp, setExp] = useState('')
  const [edu, setEdu] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [langs, setLangs] = useState<string[]>([])
  const skillList = ['First Aid','Elderly Care','Medication Management','Physical Therapy Assist','Cooking','Driving','Sign Language','Wound Care']
  const langList = ['Sinhala','Tamil','English','Malay','Hindi']
  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v])
  return (
    <AuthShell left={<LeftPanel icon={Ico.briefcase} title="Your professional profile." desc="Families choose agents based on skills, experience, and languages. The more detail the better." />}>
      <button onClick={() => go('agent-1')} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:C.sub, fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:600, marginBottom:24, padding:0 }}>{Ico.arrowL} Back</button>
      <StepBar current={2} total={8} label="Professional Details" />
      <h1 style={{ fontSize:22, fontWeight:900, color:C.type, letterSpacing:'-0.02em', marginBottom:20 }}>Professional Details</h1>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <Select label="Current Occupation" value={occ} onChange={setOcc} options={['Full-time Caregiver','Nurse / Healthcare Worker','Domestic Worker','Driver','Social Worker','Retired','Student','Other']} icon={Ico.briefcase} />
        <Select label="Years of Experience" value={exp} onChange={setExp} options={['Less than 1 year','1–2 years','3–5 years','6–10 years','10+ years']} icon={Ico.clock} />
        <Select label="Highest Education" value={edu} onChange={setEdu} options={["O/L (Ordinary Level)","A/L (Advanced Level)","Diploma","Bachelor's Degree","Master's Degree","Other"]} icon={Ico.doc} />
        <div>
          <p style={{ fontSize:13, fontWeight:600, color:C.sub, marginBottom:10, fontFamily:'Manrope,sans-serif' }}>Skills <span style={{ color:C.muted, fontWeight:400 }}>(select all that apply)</span></p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {skillList.map(s => <ToggleChip key={s} label={s} selected={skills.includes(s)} onToggle={() => toggle(skills, setSkills, s)} />)}
          </div>
        </div>
        <div>
          <p style={{ fontSize:13, fontWeight:600, color:C.sub, marginBottom:10, fontFamily:'Manrope,sans-serif' }}>Languages</p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {langList.map(l => <ToggleChip key={l} label={l} selected={langs.includes(l)} onToggle={() => toggle(langs, setLangs, l)} icon={Ico.globe} />)}
          </div>
        </div>
        <Btn variant="primary" size="lg" fullWidth onClick={() => go('agent-3')}>Continue {Ico.arrowR}</Btn>
      </div>
    </AuthShell>
  )
}

// ─── Agent Step 3 — Services Offered ─────────────────────────────────────────
function AgentStep3({ go }: { go: (s: AuthScreen) => void }) {
  const services = [
    { key:'hospital', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1.5" y="1.5" width="15" height="15" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M9 5v8M5 9h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>, label:'Hospital Companion' },
    { key:'medical',  icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1.5l1.8 3.8 4.2.6-3 3 .7 4.1-3.7-2-3.7 2 .7-4.1-3-3 4.2-.6L9 1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>, label:'Medical Appointments' },
    { key:'meds',     icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="6" y="1.5" width="6" height="9" rx="3" stroke="currentColor" strokeWidth="1.4"/><path d="M6 10.5c0 1.66 1.34 3 3 3s3-1.34 3-3" stroke="currentColor" strokeWidth="1.4"/><path d="M6 6h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>, label:'Medication Collection' },
    { key:'transport',icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 12V7l2-4h8l2 4v5H3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><circle cx="6" cy="13" r="1.5" stroke="currentColor" strokeWidth="1.4"/><circle cx="12" cy="13" r="1.5" stroke="currentColor" strokeWidth="1.4"/></svg>, label:'Transportation' },
    { key:'home',     icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 9l7-7 7 7v7.5H12v-5H6v5H2V9z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>, label:'Home Visits' },
    { key:'shopping', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 2h2l2.4 8.6A1.5 1.5 0 0 0 7.8 12H14a1.5 1.5 0 0 0 1.45-1.11L16.5 6H4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><circle cx="8" cy="15" r="1.5" stroke="currentColor" strokeWidth="1.4"/><circle cx="14" cy="15" r="1.5" stroke="currentColor" strokeWidth="1.4"/></svg>, label:'Shopping Assistance' },
    { key:'bills',    icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M2 7.5h14M6 11h2M10 11h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>, label:'Bill Payments' },
    { key:'emergency',icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1L2 16h14L9 1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M9 7v4M9 12.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>, label:'Emergency Visits' },
  ]
  const [selected, setSelected] = useState<string[]>([])
  const toggle = (k: string) => setSelected(s => s.includes(k) ? s.filter(x => x !== k) : [...s, k])
  return (
    <AuthShell left={<LeftPanel icon={Ico.checkCircle} title="What services do you offer?" desc="Select the care services you're comfortable providing. You can update these later." />}>
      <button onClick={() => go('agent-2')} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:C.sub, fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:600, marginBottom:24, padding:0 }}>{Ico.arrowL} Back</button>
      <StepBar current={3} total={8} label="Services Offered" />
      <h1 style={{ fontSize:22, fontWeight:900, color:C.type, letterSpacing:'-0.02em', marginBottom:6 }}>Services Offered</h1>
      <p style={{ fontSize:14, color:C.sub, marginBottom:20 }}>Select all services you're able to provide. <span style={{ fontWeight:600, color:C.primary }}>{selected.length}</span> selected.</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
        {services.map(s => {
          const on = selected.includes(s.key)
          return (
            <button key={s.key} onClick={() => toggle(s.key)} style={{
              display:'flex', alignItems:'center', gap:10, padding:'13px 14px', borderRadius:14, textAlign:'left',
              border:`1.5px solid ${on ? C.primary : C.border}`,
              background: on ? `${C.primary}08` : '#fff', cursor:'pointer', transition:'all 0.15s',
            }}>
              <span style={{ color: on ? C.primary : C.muted, flexShrink:0 }}>{s.icon}</span>
              <span style={{ fontSize:13, fontWeight:600, color: on ? C.primary : C.type, fontFamily:'Manrope,sans-serif', lineHeight:1.3 }}>{s.label}</span>
              {on && <span style={{ marginLeft:'auto', color:C.primary, flexShrink:0 }}><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5 7-7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>}
            </button>
          )
        })}
      </div>
      <Btn variant="primary" size="lg" fullWidth disabled={selected.length === 0} onClick={() => go('agent-4')}>Continue {Ico.arrowR}</Btn>
    </AuthShell>
  )
}

// ─── Agent Step 4 — Service Coverage ─────────────────────────────────────────
function AgentStep4({ go }: { go: (s: AuthScreen) => void }) {
  const [district, setDistrict] = useState('')
  const [city, setCity] = useState('')
  const [radius, setRadius] = useState('10')
  const [avail, setAvail] = useState<string[]>([])
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  const toggleDay = (d: string) => setAvail(a => a.includes(d) ? a.filter(x => x !== d) : [...a, d])
  const districts = ['Colombo','Gampaha','Kalutara','Kandy','Matale','Nuwara Eliya','Galle','Matara','Hambantota','Jaffna','Kilinochchi','Mannar','Vavuniya','Trincomalee','Batticaloa','Ampara','Kurunegala','Puttalam','Anuradhapura','Polonnaruwa','Badulla','Moneragala','Ratnapura','Kegalle']
  return (
    <AuthShell left={<LeftPanel icon={Ico.pin} title="Where do you work?" desc="Families search for agents near their parent's home. Setting your coverage area increases your visibility." />}>
      <button onClick={() => go('agent-3')} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:C.sub, fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:600, marginBottom:24, padding:0 }}>{Ico.arrowL} Back</button>
      <StepBar current={4} total={8} label="Service Coverage" />
      <h1 style={{ fontSize:22, fontWeight:900, color:C.type, letterSpacing:'-0.02em', marginBottom:20 }}>Service Coverage & Availability</h1>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <Select label="District" value={district} onChange={setDistrict} options={districts} icon={Ico.pin} />
        <FloatInput label="City / Town" value={city} onChange={setCity} icon={Ico.pin} hint="e.g. Nugegoda, Kandy, Galle" />
        <div>
          <p style={{ fontSize:13, fontWeight:600, color:C.sub, marginBottom:8, fontFamily:'Manrope,sans-serif' }}>Travel Radius: <strong style={{ color:C.primary }}>{radius} km</strong></p>
          <input type="range" min="2" max="50" value={radius} onChange={e => setRadius(e.target.value)} style={{ width:'100%', accentColor:C.primary }} />
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:C.muted, fontFamily:'Manrope,sans-serif', marginTop:4 }}>
            <span>2 km</span><span>50 km</span>
          </div>
        </div>

        {/* Map placeholder */}
        <div style={{ borderRadius:16, overflow:'hidden', height:160, background:'linear-gradient(135deg,#E6F4F5,#C2E5E7)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:8, border:`1px solid ${C.border}` }}>
          <span style={{ color:C.primary }}>{Ico.pin}</span>
          <p style={{ fontSize:13, fontWeight:600, color:C.primary, fontFamily:'Manrope,sans-serif' }}>{district || 'Select district'}{city ? `, ${city}` : ''}</p>
          <p style={{ fontSize:11, color:C.sub, fontFamily:'Manrope,sans-serif' }}>Interactive map — {radius} km radius</p>
        </div>

        <div>
          <p style={{ fontSize:13, fontWeight:600, color:C.sub, marginBottom:10, fontFamily:'Manrope,sans-serif' }}>Available days</p>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {days.map(d => (
              <button key={d} onClick={() => toggleDay(d)} style={{
                width:46, height:46, borderRadius:12, border:`1.5px solid ${avail.includes(d) ? C.primary : C.border}`,
                background: avail.includes(d) ? `${C.primary}10` : '#fff', cursor:'pointer',
                fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:700,
                color: avail.includes(d) ? C.primary : C.sub, transition:'all 0.15s',
              }}>{d}</button>
            ))}
          </div>
        </div>
        <Btn variant="primary" size="lg" fullWidth onClick={() => go('agent-5')}>Continue {Ico.arrowR}</Btn>
      </div>
    </AuthShell>
  )
}

// ─── Agent Step 5 — Document Upload ──────────────────────────────────────────
function AgentStep5({ go }: { go: (s: AuthScreen) => void }) {
  const [uploads, setUploads] = useState<Record<string, boolean>>({})
  const toggle = (k: string) => setUploads(u => ({ ...u, [k]: !u[k] }))
  const docs = [
    { key:'nic_f',    label:'NIC — Front',           required:true },
    { key:'nic_b',    label:'NIC — Back',            required:true },
    { key:'police',   label:'Police Clearance',      required:true },
    { key:'medical',  label:'Medical Certificate',   required:false },
    { key:'certs',    label:'Professional Certificates', required:false },
    { key:'photo',    label:'Profile Photo',         required:true },
    { key:'selfie',   label:'Selfie Verification',   required:true },
  ]
  const required = docs.filter(d => d.required)
  const uploadedRequired = required.filter(d => uploads[d.key]).length
  return (
    <AuthShell left={<LeftPanel icon={Ico.doc} title="Upload your documents." desc="All documents are encrypted and only visible to our verification team. This keeps both you and families safe." />}>
      <button onClick={() => go('agent-4')} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:C.sub, fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:600, marginBottom:24, padding:0 }}>{Ico.arrowL} Back</button>
      <StepBar current={5} total={8} label="Document Upload" />
      <h1 style={{ fontSize:22, fontWeight:900, color:C.type, letterSpacing:'-0.02em', marginBottom:6 }}>Upload Documents</h1>
      <p style={{ fontSize:13, color:C.sub, marginBottom:4 }}>Required: <strong style={{ color:C.primary }}>{uploadedRequired}/{required.length}</strong></p>
      <div style={{ height:4, borderRadius:4, background:C.border, overflow:'hidden', marginBottom:20 }}>
        <div style={{ height:'100%', background:`linear-gradient(90deg,${C.primary},#00959E)`, width:`${(uploadedRequired/required.length)*100}%`, transition:'width 0.4s' }} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
        {docs.map(d => (
          <UploadZone key={d.key} label={`${d.label}${d.required ? '*' : ''}`} uploaded={!!uploads[d.key]} onUpload={() => toggle(d.key)} />
        ))}
      </div>
      <Btn variant="primary" size="lg" fullWidth disabled={uploadedRequired < required.length} onClick={() => go('agent-6')}>Continue {Ico.arrowR}</Btn>
    </AuthShell>
  )
}

// ─── Agent Step 6 — Bank Details ──────────────────────────────────────────────
function AgentStep6({ go }: { go: (s: AuthScreen) => void }) {
  const [f, setF] = useState({ holder:'', bank:'', branch:'', account:'' })
  const up = (k: keyof typeof f) => (v: string) => setF(p => ({ ...p, [k]: v }))
  const banks = ['Bank of Ceylon','Peoples Bank','Commercial Bank','Sampath Bank','HNB — Hatton National Bank','NSB — National Savings Bank','Seylan Bank','NDB Bank','Pan Asia Banking','DFCC Bank']
  return (
    <AuthShell left={<LeftPanel icon={Ico.bank} title="Where should we send your earnings?" desc="ReadyPal pays agents every Friday. We need your bank details to set this up securely." />}>
      <button onClick={() => go('agent-5')} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:C.sub, fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:600, marginBottom:24, padding:0 }}>{Ico.arrowL} Back</button>
      <StepBar current={6} total={8} label="Bank Details" />
      <h1 style={{ fontSize:22, fontWeight:900, color:C.type, letterSpacing:'-0.02em', marginBottom:6 }}>Bank Details</h1>
      <p style={{ fontSize:14, color:C.sub, marginBottom:20 }}>Used only for weekly salary deposits. Never shared.</p>
      <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
        <FloatInput label="Account Holder Name" value={f.holder} onChange={up('holder')} icon={Ico.user} hint="Exactly as on your bank account" />
        <Select label="Bank" value={f.bank} onChange={up('bank')} options={banks} icon={Ico.bank} />
        <FloatInput label="Branch" value={f.branch} onChange={up('branch')} icon={Ico.pin} hint="e.g. Nugegoda, Kandy City" />
        <FloatInput label="Account Number" value={f.account} onChange={up('account')} icon={Ico.doc} />

        {/* Stripe placeholder */}
        <div style={{ borderRadius:14, padding:'16px', border:`1px solid ${C.border}`, background:'#F9FAFB', display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:12, background:'#635BFF20', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M9 6.5c0-.83.67-1.5 1.5-1.5C11.33 5 12 5.67 12 6.5c0 .57-.31 1.06-.77 1.33L10 9.5V11H9V9.5l1.23-1.67A.5.5 0 0 0 10.5 7a.5.5 0 0 0-.5.5H9zM9 13h2v2H9z" fill="#635BFF"/></svg>
          </div>
          <div>
            <p style={{ fontSize:13, fontWeight:700, color:C.type, fontFamily:'Manrope,sans-serif' }}>Stripe Payouts</p>
            <p style={{ fontSize:12, color:C.sub, fontFamily:'Manrope,sans-serif' }}>Coming soon — faster direct payouts</p>
          </div>
          <span style={{ marginLeft:'auto', fontSize:11, fontWeight:700, color:'#635BFF', background:'#635BFF12', padding:'3px 8px', borderRadius:6 }}>Soon</span>
        </div>

        <Btn variant="primary" size="lg" fullWidth onClick={() => go('agent-7')}>Continue {Ico.arrowR}</Btn>
      </div>
    </AuthShell>
  )
}

// ─── Agent Step 7 — Identity Verification ────────────────────────────────────
function AgentStep7({ go }: { go: (s: AuthScreen) => void }) {
  const [step, setStep] = useState<'idle'|'face'|'id'|'done'>('idle')
  return (
    <AuthShell left={<LeftPanel icon={Ico.face} title="Final identity check." desc="A quick face scan and ID match is the last step before your profile goes live." />}>
      <button onClick={() => go('agent-6')} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:C.sub, fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:600, marginBottom:24, padding:0 }}>{Ico.arrowL} Back</button>
      <StepBar current={7} total={8} label="Identity Verification" />
      <h1 style={{ fontSize:22, fontWeight:900, color:C.type, letterSpacing:'-0.02em', marginBottom:6 }}>Identity Verification</h1>
      <p style={{ fontSize:14, color:C.sub, marginBottom:24 }}>We use secure facial recognition to confirm your identity matches your documents.</p>

      {/* Status timeline */}
      <div style={{ display:'flex', flexDirection:'column', gap:0, marginBottom:28 }}>
        {[
          { key:'idle', label:'Face Scan', desc:'Hold your device steady and look at the camera.', idx:0 },
          { key:'face', label:'Government ID Scan', desc:'Hold your NIC card up to the camera.', idx:1 },
          { key:'id',   label:'Identity Match', desc:'We compare your face to your NIC photo.', idx:2 },
          { key:'done', label:'Verification Complete', desc:'Your identity has been confirmed.', idx:3 },
        ].map((s, i) => {
          const steps = ['idle','face','id','done']
          const done = steps.indexOf(step) > i
          const active = step === s.key
          return (
            <div key={s.key} style={{ display:'flex', gap:14 }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:28, flexShrink:0 }}>
                <div style={{ width:28, height:28, borderRadius:'50%', border:`2px solid ${done ? C.success : active ? C.primary : C.border}`, background: done ? C.success : active ? `${C.primary}12` : '#fff', display:'flex', alignItems:'center', justifyContent:'center', color: done ? '#fff' : active ? C.primary : C.muted, flexShrink:0 }}>
                  {done ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg> : <span style={{ fontSize:11, fontWeight:800 }}>{i+1}</span>}
                </div>
                {i < 3 && <div style={{ width:2, height:24, background: done ? C.success : C.border, marginTop:4, transition:'background 0.3s' }} />}
              </div>
              <div style={{ flex:1, paddingBottom:20 }}>
                <p style={{ fontSize:14, fontWeight:700, color: active ? C.primary : done ? C.success : C.type, fontFamily:'Manrope,sans-serif' }}>{s.label}</p>
                {active && <p style={{ fontSize:12, color:C.sub, marginTop:2 }}>{s.desc}</p>}
              </div>
            </div>
          )
        })}
      </div>

      {step === 'idle' && (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <div style={{ borderRadius:20, overflow:'hidden', height:180, background:'#1A2A2F', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:12 }}>
            <div style={{ width:60, height:60, borderRadius:'50%', border:'2px solid rgba(255,255,255,0.30)', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.60)' }}>{Ico.camera}</div>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.50)', fontFamily:'Manrope,sans-serif' }}>Camera preview</p>
          </div>
          <Btn variant="primary" size="lg" fullWidth onClick={() => setStep('face')}>Start Face Scan</Btn>
        </div>
      )}
      {step === 'face' && (
        <Btn variant="primary" size="lg" fullWidth onClick={() => setStep('id')}>Scan Government ID</Btn>
      )}
      {step === 'id' && (
        <Btn variant="primary" size="lg" fullWidth onClick={() => setStep('done')}>Complete Verification</Btn>
      )}
      {step === 'done' && (
        <Btn variant="primary" size="lg" fullWidth onClick={() => go('agent-8')}>Continue to Submit {Ico.arrowR}</Btn>
      )}
    </AuthShell>
  )
}

// ─── Agent Step 8 — Application Submitted ────────────────────────────────────
function AgentStep8({ go }: { go: (s: AuthScreen) => void }) {
  return (
    <AuthShell left={<LeftPanel icon={Ico.checkCircle} title="Application received." desc="Our verification team will review your application within 3–5 business days." />}>
      <StepBar current={8} total={8} label="Application Submitted" />
      <div style={{ textAlign:'center', padding:'12px 0' }}>
        <div style={{ width:80, height:80, borderRadius:'50%', background:`${C.primary}12`, border:`3px solid ${C.primary}30`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', color:C.primary }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M4 18l9 9 19-20" stroke={C.primary} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h1 style={{ fontSize:24, fontWeight:900, color:C.type, letterSpacing:'-0.02em', marginBottom:10 }}>Application Submitted!</h1>
        <p style={{ fontSize:14, color:C.sub, lineHeight:1.7, marginBottom:28 }}>
          Thank you, we've received your application. Our team will review your documents and be in touch within 3–5 business days.
        </p>

        {/* Review timeline */}
        <div style={{ textAlign:'left', marginBottom:28 }}>
          {[
            { label:'Application Received', note:'Just now', done:true },
            { label:'Document Review',      note:'1–2 business days', done:false },
            { label:'Background Check',     note:'2–3 business days', done:false },
            { label:'Decision & Notification', note:'3–5 business days', done:false },
          ].map((step, i) => (
            <div key={step.label} style={{ display:'flex', gap:12, marginBottom: i < 3 ? 0 : 0 }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:20, flexShrink:0 }}>
                <div style={{ width:20, height:20, borderRadius:'50%', background: step.done ? C.primary : C.border, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {step.done ? <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> : <div style={{ width:6, height:6, borderRadius:'50%', background:'#fff' }} />}
                </div>
                {i < 3 && <div style={{ width:2, flex:1, background:C.border, minHeight:24, marginTop:4 }} />}
              </div>
              <div style={{ flex:1, paddingBottom:16 }}>
                <p style={{ fontSize:13, fontWeight:700, color: step.done ? C.primary : C.type, fontFamily:'Manrope,sans-serif' }}>{step.label}</p>
                <p style={{ fontSize:11, color:C.muted, fontFamily:'Manrope,sans-serif' }}>{step.note}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <Btn variant="primary" size="lg" fullWidth onClick={() => go('agent-pending')}>View Application Status</Btn>
          <Btn variant="ghost" size="md" fullWidth onClick={() => {}}>Contact Support</Btn>
        </div>
      </div>
    </AuthShell>
  )
}

// ─── Forgot Password ──────────────────────────────────────────────────────────
function ForgotStep1({ go }: { go: (s: AuthScreen) => void }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  return (
    <AuthShell left={<LeftPanel icon={Ico.lock} title="Reset your password." desc="Enter your email and we'll send you a verification code to reset your password." />}>
      <button onClick={() => go('login')} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:C.sub, fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:600, marginBottom:24, padding:0 }}>{Ico.arrowL} Back to Login</button>
      <h1 style={{ fontSize:26, fontWeight:900, color:C.type, letterSpacing:'-0.02em', marginBottom:6 }}>Forgot Password?</h1>
      <p style={{ fontSize:14, color:C.sub, marginBottom:28 }}>Enter your account email address and we'll send you a reset code.</p>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <FloatInput label="Email Address" type="email" value={email} onChange={setEmail} icon={Ico.mail} />
        <Btn variant="primary" size="lg" fullWidth loading={loading}
          onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); go('forgot-2') }, 1000) }}>
          Send Reset Code
        </Btn>
      </div>
    </AuthShell>
  )
}

function ForgotStep2({ go }: { go: (s: AuthScreen) => void }) {
  const [otp, setOtp] = useState(['','','','','',''])
  const [expired, setExpired] = useState(false)
  return (
    <AuthShell left={<LeftPanel icon={Ico.mail2} title="Check your inbox." desc="We've sent a 6-digit code to your email address. It expires in 10 minutes." />}>
      <button onClick={() => go('forgot-1')} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:C.sub, fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:600, marginBottom:24, padding:0 }}>{Ico.arrowL} Back</button>
      <h1 style={{ fontSize:26, fontWeight:900, color:C.type, letterSpacing:'-0.02em', marginBottom:6 }}>Enter Reset Code</h1>
      <p style={{ fontSize:14, color:C.sub, marginBottom:28 }}>Sent to your registered email address.</p>
      <OTPInput value={otp} onChange={setOtp} />
      <div style={{ textAlign:'center', margin:'20px 0' }}>
        {expired ? (
          <button onClick={() => setExpired(false)} style={{ display:'inline-flex', alignItems:'center', gap:6, color:C.primary, fontWeight:700, background:'none', border:'none', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:13 }}>{Ico.refresh} Resend code</button>
        ) : (
          <p style={{ fontSize:13, color:C.sub }}>Code expires in <Countdown seconds={600} onDone={() => setExpired(true)} /></p>
        )}
      </div>
      <Btn variant="primary" size="lg" fullWidth disabled={!otp.every(v => v !== '')} onClick={() => go('forgot-3')}>Verify Code</Btn>
    </AuthShell>
  )
}

function ForgotStep3({ go }: { go: (s: AuthScreen) => void }) {
  const [pass, setPass] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [done, setDone] = useState(false)
  if (done) return (
    <AuthShell left={<LeftPanel icon={Ico.checkCircle} title="Password changed!" desc="Your account password has been updated. You can now log in with your new password." />}>
      <div style={{ textAlign:'center', padding:'20px 0' }}>
        <div style={{ width:72, height:72, borderRadius:'50%', background:'#F0FDF4', border:'3px solid #BBF7D0', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', color:C.success }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M5 17l7 7 15-16" stroke={C.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h1 style={{ fontSize:24, fontWeight:900, color:C.type, marginBottom:10, letterSpacing:'-0.02em' }}>Password Changed!</h1>
        <p style={{ fontSize:14, color:C.sub, lineHeight:1.65, marginBottom:28 }}>Your password has been updated successfully.</p>
        <Btn variant="primary" size="lg" fullWidth onClick={() => go('login')}>Back to Login</Btn>
      </div>
    </AuthShell>
  )
  return (
    <AuthShell left={<LeftPanel icon={Ico.lock} title="Create a new password." desc="Choose a strong password with at least 8 characters, including uppercase, numbers, and symbols." />}>
      <button onClick={() => go('forgot-2')} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:C.sub, fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:600, marginBottom:24, padding:0 }}>{Ico.arrowL} Back</button>
      <h1 style={{ fontSize:26, fontWeight:900, color:C.type, letterSpacing:'-0.02em', marginBottom:20 }}>New Password</h1>
      <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
        <FloatInput label="New Password" type={show ? 'text' : 'password'} value={pass} onChange={setPass} icon={Ico.lock} iconRight={show ? Ico.eyeOff : Ico.eye} onIconRight={() => setShow(v => !v)} />
        <PasswordStrength value={pass} />
        <FloatInput label="Confirm New Password" type={show ? 'text' : 'password'} value={confirm} onChange={setConfirm} icon={Ico.lock}
          error={confirm && confirm !== pass ? 'Passwords do not match.' : undefined} />
        <Btn variant="primary" size="lg" fullWidth disabled={!pass || pass !== confirm} onClick={() => setDone(true)}>Set New Password</Btn>
      </div>
    </AuthShell>
  )
}

// ─── Email Verification ───────────────────────────────────────────────────────
function EmailVerifyScreen({ go }: { go: (s: AuthScreen) => void }) {
  const [resent, setResent] = useState(false)
  return (
    <AuthShell left={<LeftPanel icon={Ico.mail2} title="Check your email." desc="Click the verification link we sent to confirm your email address and activate your account." />}>
      <div style={{ textAlign:'center', padding:'12px 0' }}>
        <div style={{ width:80, height:80, borderRadius:24, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', color:C.primary }}>
          <span style={{ width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center' }}>{Ico.mail2}</span>
        </div>
        <h1 style={{ fontSize:24, fontWeight:900, color:C.type, letterSpacing:'-0.02em', marginBottom:10 }}>Verify your email</h1>
        <p style={{ fontSize:14, color:C.sub, lineHeight:1.7, marginBottom:28 }}>
          We've sent a verification link to your email. Click it to activate your ReadyPal account.
        </p>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <Btn variant="primary" size="lg" fullWidth onClick={() => {}}>Open Email App</Btn>
          <Btn variant="secondary" size="md" fullWidth onClick={() => setResent(true)}>
            {Ico.refresh} Resend Email
          </Btn>
          {resent && <InlineAlert type="success" message="Verification email resent successfully." />}
          <Btn variant="ghost" size="md" fullWidth onClick={() => go('login')}>Back to Login</Btn>
        </div>
      </div>
    </AuthShell>
  )
}

// ─── Agent Pending ────────────────────────────────────────────────────────────
function AgentPendingScreen({ go }: { go: (s: AuthScreen) => void }) {
  return (
    <AuthShell left={<LeftPanel icon={Ico.clock} title="Hang tight." desc="Our verification team reviews every agent application carefully to protect families." />}>
      <div style={{ textAlign:'center', padding:'12px 0' }}>
        <div style={{ width:80, height:80, borderRadius:'50%', background:'#FFFBEB', border:'3px solid #FDE68A', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', color:C.warning }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="16" stroke={C.warning} strokeWidth="2"/><path d="M18 10v10l6 6" stroke={C.warning} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'4px 12px', borderRadius:99, background:'#FFFBEB', border:'1px solid #FDE68A', marginBottom:16 }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4.5" fill={C.warning}/></svg>
          <span style={{ fontSize:12, fontWeight:700, color:C.warning, fontFamily:'Manrope,sans-serif' }}>Under Review</span>
        </div>
        <h1 style={{ fontSize:24, fontWeight:900, color:C.type, letterSpacing:'-0.02em', marginBottom:10 }}>Application Under Review</h1>
        <p style={{ fontSize:14, color:C.sub, lineHeight:1.7, marginBottom:28 }}>
          Your application is being reviewed. This typically takes 3–5 business days. We'll email you as soon as a decision is made.
        </p>
        <div style={{ textAlign:'left', marginBottom:24 }}>
          {[
            { label:'Application Received', status:'done' },
            { label:'Document Verification', status:'active' },
            { label:'Background Check', status:'pending' },
            { label:'Final Decision', status:'pending' },
          ].map((s, i) => (
            <div key={s.label} style={{ display:'flex', gap:12 }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:20, flexShrink:0 }}>
                <div style={{ width:20, height:20, borderRadius:'50%', background: s.status === 'done' ? C.success : s.status === 'active' ? C.warning : C.border, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {s.status === 'done' && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  {s.status === 'active' && <div style={{ width:6, height:6, borderRadius:'50%', background:'#fff' }} />}
                  {s.status === 'pending' && <div style={{ width:6, height:6, borderRadius:'50%', background:'rgba(255,255,255,0.6)' }} />}
                </div>
                {i < 3 && <div style={{ width:2, height:20, background: s.status === 'done' ? C.success : C.border, marginTop:2 }} />}
              </div>
              <p style={{ fontSize:13, fontWeight:600, color: s.status === 'done' ? C.success : s.status === 'active' ? C.warning : C.muted, paddingBottom:16, fontFamily:'Manrope,sans-serif' }}>{s.label}</p>
            </div>
          ))}
        </div>
        <Btn variant="secondary" size="md" fullWidth onClick={() => {}}>Contact Support</Btn>
      </div>
    </AuthShell>
  )
}

// ─── Agent Rejected ───────────────────────────────────────────────────────────
function AgentRejectedScreen({ go }: { go: (s: AuthScreen) => void }) {
  const [uploads, setUploads] = useState<Record<string, boolean>>({})
  return (
    <AuthShell left={<LeftPanel icon={Ico.warning} title="We're sorry." desc="Your application wasn't approved this time, but you can reapply by uploading the required documents." />}>
      <div>
        <div style={{ width:72, height:72, borderRadius:'50%', background:'#FEF2F2', border:'3px solid #FECACA', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', color:C.error }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M6 6l20 20M26 6L6 26" stroke={C.error} strokeWidth="2.5" strokeLinecap="round"/></svg>
        </div>
        <h1 style={{ fontSize:22, fontWeight:900, color:C.type, letterSpacing:'-0.02em', marginBottom:8, textAlign:'center' }}>Application Not Approved</h1>
        <div style={{ borderRadius:14, padding:'14px 16px', background:'#FEF2F2', border:`1px solid #FECACA`, marginBottom:20 }}>
          <p style={{ fontSize:13, fontWeight:700, color:C.error, marginBottom:4, fontFamily:'Manrope,sans-serif' }}>Reason for rejection:</p>
          <p style={{ fontSize:13, color:'#7F1D1D', lineHeight:1.6, fontFamily:'Manrope,sans-serif' }}>Police clearance certificate is expired (issued more than 3 months ago). Please obtain a fresh clearance from your local police station.</p>
        </div>
        <p style={{ fontSize:14, fontWeight:600, color:C.sub, marginBottom:12, fontFamily:'Manrope,sans-serif' }}>Re-upload required documents:</p>
        <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:20 }}>
          {[
            { key:'police', label:'Police Clearance (new)' },
            { key:'nic',    label:'NIC — Front & Back' },
          ].map(d => (
            <UploadZone key={d.key} label={d.label} uploaded={!!uploads[d.key]} onUpload={() => setUploads(u => ({ ...u, [d.key]: !u[d.key] }))} />
          ))}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <Btn variant="primary" size="lg" fullWidth onClick={() => go('agent-pending')}>Resubmit Application</Btn>
          <Btn variant="ghost" size="md" fullWidth onClick={() => {}}>Contact Support</Btn>
        </div>
      </div>
    </AuthShell>
  )
}

// ─── Agent Approved ───────────────────────────────────────────────────────────
function AgentApprovedScreen({ go }: { go: (s: AuthScreen) => void }) {
  return (
    <AuthShell left={<LeftPanel icon={Ico.shield} title="You're verified!" desc="Your ReadyPal agent profile is now live. Families in your area can already find you." />}>
      <div style={{ textAlign:'center', padding:'12px 0' }}>
        <div style={{ width:80, height:80, borderRadius:'50%', background:'#F0FDF4', border:'3px solid #BBF7D0', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', color:C.success }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M18 4L26 8v8c0 8-8 14-8 14S10 24 10 16V8L18 4z" fill="#F0FDF4" stroke={C.success} strokeWidth="2" strokeLinejoin="round"/><path d="M12 18l5 5 8-9" stroke={C.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'4px 12px', borderRadius:99, background:'#F0FDF4', border:'1px solid #BBF7D0', marginBottom:16 }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4.5" fill={C.success}/></svg>
          <span style={{ fontSize:12, fontWeight:700, color:C.success, fontFamily:'Manrope,sans-serif' }}>Verified Agent</span>
        </div>
        <h1 style={{ fontSize:24, fontWeight:900, color:C.type, letterSpacing:'-0.02em', marginBottom:10 }}>Congratulations!</h1>
        <p style={{ fontSize:14, color:C.sub, lineHeight:1.7, marginBottom:32 }}>
          Your application has been approved. Your profile is now live on ReadyPal. Families in your area can discover and contact you.
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:28 }}>
          {[
            { icon:Ico.star, label:'Profile Live', sub:'Visible to families' },
            { icon:Ico.phone, label:'Ready to receive', sub:'Care requests' },
            { icon:Ico.bank, label:'Payouts set up', sub:'Paid every Friday' },
            { icon:Ico.shield, label:'Verified Badge', sub:'On your profile' },
          ].map(i => (
            <div key={i.label} style={{ padding:'14px', borderRadius:14, background:C.bg, border:`1px solid ${C.border}`, textAlign:'center' }}>
              <span style={{ color:C.primary }}>{i.icon}</span>
              <p style={{ fontSize:12, fontWeight:700, color:C.type, marginTop:6, fontFamily:'Manrope,sans-serif' }}>{i.label}</p>
              <p style={{ fontSize:11, color:C.muted, fontFamily:'Manrope,sans-serif' }}>{i.sub}</p>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <Btn variant="primary" size="lg" fullWidth onClick={() => go('welcome')}>Start Exploring</Btn>
          <Btn variant="ghost" size="md" fullWidth onClick={() => go('welcome')}>Go to Dashboard</Btn>
        </div>
      </div>
    </AuthShell>
  )
}

// ─── Empty / Error states ─────────────────────────────────────────────────────
type StateKey = 'no-internet'|'expired-otp'|'invalid-link'|'account-locked'|'session-expired'|'maintenance'|'wrong-password'|'email-exists'|'weak-password'|'upload-failed'|'server-error'

function StateScreen({ type, go }: { type: StateKey; go: (s: AuthScreen) => void }) {
  const config: Record<StateKey, { icon: ReactNode; title: string; desc: string; action: string; actionTarget: AuthScreen; iconBg: string; iconColor: string }> = {
    'no-internet':    { icon:<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M2 14C2 7.37 7.37 2 14 2s12 5.37 12 12-5.37 12-12 12S2 20.63 2 14z" stroke="currentColor" strokeWidth="1.6"/><path d="M2 14h6M20 14h6M14 2v6M14 20v6M5 5l4 4M19 5l-4 4M5 23l4-4M19 23l-4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M8 14h12M14 8v12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>, title:'No Internet Connection', desc:"It looks like you're offline. Check your Wi-Fi or mobile data and try again.", action:'Retry Connection', actionTarget:'welcome', iconBg:'#FEF2F2', iconColor:C.error },
    'expired-otp':    { icon:Ico.clock, title:'Verification Code Expired', desc:'Your OTP has expired. Request a new one and try again.', action:'Resend Code', actionTarget:'client-4', iconBg:'#FFFBEB', iconColor:C.warning },
    'invalid-link':   { icon:Ico.warning, title:'Invalid or Expired Link', desc:'This verification link is no longer valid. Links expire after 24 hours.', action:'Request New Link', actionTarget:'forgot-1', iconBg:'#FFFBEB', iconColor:C.warning },
    'account-locked': { icon:Ico.lock, title:'Account Locked', desc:'Too many failed login attempts. Your account has been temporarily locked for 30 minutes.', action:'Contact Support', actionTarget:'login', iconBg:'#FEF2F2', iconColor:C.error },
    'session-expired':{ icon:Ico.clock, title:'Session Expired', desc:'Your session has timed out for security reasons. Please log in again.', action:'Log In Again', actionTarget:'login', iconBg:'#EFF6FF', iconColor:'#3B82F6' },
    'maintenance':    { icon:<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M14 4a10 10 0 1 0 0 20A10 10 0 0 0 14 4z" stroke="currentColor" strokeWidth="1.6"/><path d="M14 9v6l4 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>, title:'Scheduled Maintenance', desc:"We're improving ReadyPal right now. We'll be back in approximately 2 hours.", action:'Notify Me When Done', actionTarget:'welcome', iconBg:'#FFFBEB', iconColor:C.warning },
    'wrong-password': { icon:Ico.x, title:'Incorrect Password', desc:'The password you entered is incorrect. Check caps lock and try again.', action:'Try Again', actionTarget:'login', iconBg:'#FEF2F2', iconColor:C.error },
    'email-exists':   { icon:Ico.warning, title:'Email Already Registered', desc:'An account with this email already exists. Try logging in instead.', action:'Go to Login', actionTarget:'login', iconBg:'#FFFBEB', iconColor:C.warning },
    'weak-password':  { icon:Ico.warning, title:'Password Too Weak', desc:'Your password must be at least 8 characters with uppercase, numbers, and symbols.', action:'Choose a Stronger Password', actionTarget:'client-1', iconBg:'#FFFBEB', iconColor:C.warning },
    'upload-failed':  { icon:Ico.warning, title:'Upload Failed', desc:'We could not process your file. Make sure it is under 5 MB and in PDF or JPG format.', action:'Try Again', actionTarget:'agent-5', iconBg:'#FEF2F2', iconColor:C.error },
    'server-error':   { icon:<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="4" y="4" width="20" height="8" rx="2" stroke="currentColor" strokeWidth="1.6"/><rect x="4" y="16" width="20" height="8" rx="2" stroke="currentColor" strokeWidth="1.6"/><circle cx="21" cy="8" r="1.5" fill="currentColor"/><circle cx="21" cy="20" r="1.5" fill="currentColor"/></svg>, title:'Server Error', desc:'Something went wrong on our end. Our team has been notified and is working on a fix.', action:'Reload Page', actionTarget:'welcome', iconBg:'#FEF2F2', iconColor:C.error },
  }
  const c = config[type]
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(160deg,#F0F7F8,#F9F9F9)', padding:24, fontFamily:'Manrope,sans-serif' }}>
      <div style={{ maxWidth:400, width:'100%', textAlign:'center' }}>
        <div style={{ width:88, height:88, borderRadius:'50%', background:c.iconBg, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', color:c.iconColor }}>
          {c.icon}
        </div>
        <h1 style={{ fontSize:22, fontWeight:900, color:C.type, letterSpacing:'-0.02em', marginBottom:10 }}>{c.title}</h1>
        <p style={{ fontSize:14, color:C.sub, lineHeight:1.7, marginBottom:32 }}>{c.desc}</p>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <Btn variant="primary" size="lg" fullWidth onClick={() => go(c.actionTarget)}>{c.action}</Btn>
          <Btn variant="ghost" size="md" fullWidth onClick={() => go('welcome')}>Go Home</Btn>
        </div>
      </div>
    </div>
  )
}

// ─── Navigation menu (dev only) ───────────────────────────────────────────────
function DevNav({ current, go }: { current: AuthScreen; go: (s: AuthScreen) => void }) {
  const [open, setOpen] = useState(false)
  const screens: [string, AuthScreen][] = [
    ['Welcome','welcome'],['Login','login'],['Role Select','role-select'],
    ['Client 1 — Info','client-1'],['Client 2 — Prefs','client-2'],['Client 3 — Emergency','client-3'],
    ['Client 4 — OTP','client-4'],['Client 5 — Done','client-5'],
    ['Agent 1 — Info','agent-1'],['Agent 2 — Pro','agent-2'],['Agent 3 — Services','agent-3'],
    ['Agent 4 — Coverage','agent-4'],['Agent 5 — Docs','agent-5'],['Agent 6 — Bank','agent-6'],
    ['Agent 7 — ID','agent-7'],['Agent 8 — Submitted','agent-8'],
    ['Forgot 1','forgot-1'],['Forgot 2','forgot-2'],['Forgot 3','forgot-3'],
    ['Email Verify','email-verify'],
    ['Agent Pending','agent-pending'],['Agent Rejected','agent-rejected'],['Agent Approved','agent-approved'],
  ]
  return (
    <div style={{ position:'fixed', bottom:16, right:16, zIndex:200 }}>
      {open && (
        <div style={{ position:'absolute', bottom:52, right:0, width:240, borderRadius:16, overflow:'hidden', background:'rgba(26,42,47,0.96)', backdropFilter:'blur(16px)', boxShadow:'0 8px 32px rgba(0,0,0,0.30)', border:'1px solid rgba(255,255,255,0.10)', maxHeight:400, overflowY:'auto' }}>
          {screens.map(([label, s]) => (
            <button key={s} onClick={() => { go(s); setOpen(false) }} style={{
              display:'block', width:'100%', textAlign:'left', padding:'10px 16px', border:'none', cursor:'pointer',
              fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight: s === current ? 700 : 500,
              background: s === current ? 'rgba(0,115,122,0.25)' : 'transparent',
              color: s === current ? '#00D4DB' : 'rgba(255,255,255,0.70)',
              borderBottom:'1px solid rgba(255,255,255,0.05)',
              transition:'background 0.1s',
            }}>{label}</button>
          ))}
        </div>
      )}
      <button onClick={() => setOpen(v => !v)} style={{
        width:44, height:44, borderRadius:'50%', background:'#00737A', border:'none', cursor:'pointer',
        display:'flex', alignItems:'center', justifyContent:'center', color:'#fff',
        boxShadow:'0 4px 16px rgba(0,115,122,0.35)',
      }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 5h12M3 9h12M3 13h12" stroke="white" strokeWidth="1.6" strokeLinecap="round"/></svg>
      </button>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function AuthOnboarding() {
  const [screen, setScreen] = useState<AuthScreen>('welcome')
  const go = useCallback((s: AuthScreen) => {
    setScreen(s)
    window.scrollTo({ top:0, behavior:'smooth' })
  }, [])

  const render = () => {
    switch (screen) {
      case 'welcome':         return <WelcomeScreen go={go} />
      case 'login':           return <LoginScreen go={go} />
      case 'role-select':     return <RoleSelectScreen go={go} />
      case 'client-1':        return <ClientStep1 go={go} />
      case 'client-2':        return <ClientStep2 go={go} />
      case 'client-3':        return <ClientStep3 go={go} />
      case 'client-4':        return <ClientStep4 go={go} />
      case 'client-5':        return <ClientStep5 go={go} />
      case 'agent-1':         return <AgentStep1 go={go} />
      case 'agent-2':         return <AgentStep2 go={go} />
      case 'agent-3':         return <AgentStep3 go={go} />
      case 'agent-4':         return <AgentStep4 go={go} />
      case 'agent-5':         return <AgentStep5 go={go} />
      case 'agent-6':         return <AgentStep6 go={go} />
      case 'agent-7':         return <AgentStep7 go={go} />
      case 'agent-8':         return <AgentStep8 go={go} />
      case 'forgot-1':        return <ForgotStep1 go={go} />
      case 'forgot-2':        return <ForgotStep2 go={go} />
      case 'forgot-3':        return <ForgotStep3 go={go} />
      case 'email-verify':    return <EmailVerifyScreen go={go} />
      case 'agent-pending':   return <AgentPendingScreen go={go} />
      case 'agent-rejected':  return <AgentRejectedScreen go={go} />
      case 'agent-approved':  return <AgentApprovedScreen go={go} />
      default:                return <StateScreen type="server-error" go={go} />
    }
  }

  return (
    <div key={screen} className="page-enter" style={{ fontFamily:'Manrope,sans-serif' }}>
      {render()}
      <DevNav current={screen} go={go} />
    </div>
  )
}
