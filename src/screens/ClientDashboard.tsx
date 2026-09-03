import { useState, useRef, useEffect, type ReactNode, type CSSProperties } from 'react'
import logoFull from '@/imports/20260723_170707.png'
import logoIcon from '@/imports/20260723_164632.png'
import logoWhite from '@/imports/20260723_165045.png'
import { supabase } from '../lib/supabaseClient'
import { getDashboardOverview, getAllCareRequests, getBeneficiaries, getAllNotifications, getPaymentsData, getMyReviews, getMyAgents, getMyConversations, getConversationMessages, sendMessage } from '../lib/api'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AccountSettings from './AccountSettings'

// ─── Colours ──────────────────────────────────────────────────────────────────
const C = {
  primary:  '#00737A',
  accent:   '#EE8153',
  type:     '#2C3E43',
  sub:      '#6B7E85',
  muted:    '#9AAAB0',
  border:   '#E4E8EA',
  bg:       '#F2F4F5',
  surface:  '#FFFFFF',
  success:  '#22C55E',
  warning:  '#F59E0B',
  error:    '#EF4444',
  info:     '#3B82F6',
}

// ─── SVG icon library ─────────────────────────────────────────────────────────
const I = {
  dashboard:    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1.5" y="1.5" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="10" y="1.5" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="1.5" y="10" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="10" y="10" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.4"/></svg>,
  requests:     <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M14 9.5H4.5A2 2 0 0 0 2.5 11.5v3A2 2 0 0 0 4.5 16.5H14a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2z" stroke="currentColor" strokeWidth="1.4"/><path d="M5.5 9.5V6a3.5 3.5 0 1 1 7 0v3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  beneficiaries:<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.4"/><path d="M3 16c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  agents:       <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="7" cy="6" r="3" stroke="currentColor" strokeWidth="1.4"/><path d="M1.5 16c0-2.76 2.46-5 5.5-5M12 11l1.5 1.5 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><circle cx="13" cy="11" r="4" stroke="currentColor" strokeWidth="1.4"/></svg>,
  messages:     <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M15.5 12a2 2 0 0 1-2 2H5l-3 3V3.5A2 2 0 0 1 4 1.5h9.5a2 2 0 0 1 2 2V12z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  notifications:<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2a5.5 5.5 0 0 0-5.5 5.5v2.5l-1.5 3H16l-1.5-3V7.5A5.5 5.5 0 0 0 9 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M7 14.5a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  payments:     <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1.5" y="4" width="15" height="10" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M1.5 7.5h15M5 11h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  reviews:      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1.5l2.2 4.5 5 .7-3.6 3.5.85 4.9L9 12.85l-4.45 2.25.85-4.9L1.8 6.7l5-.7L9 1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  support:      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.4"/><path d="M9 6a2.5 2.5 0 0 1 1.5 4.5c-.5.4-.5.8-.5 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="9" cy="14" r=".8" fill="currentColor"/></svg>,
  settings:     <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.4"/><path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.7 3.7l1.4 1.4M12.9 12.9l1.4 1.4M3.7 14.3l1.4-1.4M12.9 5.1l1.4-1.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  logout:       <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M7 15.5H3.5A1.5 1.5 0 0 1 2 14V4A1.5 1.5 0 0 1 3.5 2.5H7M12 12.5l3.5-3.5L12 5.5M15.5 9H7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  search:       <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4"/><path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  bell:         <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2a5.5 5.5 0 0 0-5.5 5.5v2.5l-1.5 3H16l-1.5-3V7.5A5.5 5.5 0 0 0 9 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M7 14.5a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  menu:         <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2.5 5h13M2.5 9h13M2.5 13h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  close:        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  chevronL:     <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevronR:     <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevronD:     <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  plus:         <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  calendar:     <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M1.5 7h13M5 1.5V4M11 1.5V4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  check:        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5 7-7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  clock:        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4"/><path d="M7 4v3.5l2 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  pin:          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5A3.5 3.5 0 0 1 10.5 5c0 3-3.5 7.5-3.5 7.5S3.5 8 3.5 5A3.5 3.5 0 0 1 7 1.5z" stroke="currentColor" strokeWidth="1.4"/><circle cx="7" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.4"/></svg>,
  star:         <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5l1.7 3.5 3.8.55-2.75 2.7.65 3.8L7 10.3l-3.4 1.75.65-3.8L1.5 5.55l3.8-.55L7 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  starFill:     <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1l1.5 3 3.5.5-2.5 2.5.6 3.5L6 9 2.9 10.5l.6-3.5L1 4.5 4.5 4z" fill="#F59E0B"/></svg>,
  arrowR:       <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  phone:        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4.5 1.5h5a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.4"/><circle cx="7" cy="10.5" r=".7" fill="currentColor"/></svg>,
  doc:          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8.5 1.5H4A1.5 1.5 0 0 0 2.5 3v8A1.5 1.5 0 0 0 4 12.5h6A1.5 1.5 0 0 0 11.5 11V4.5L8.5 1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M8.5 1.5V4.5h3M5 7.5h4M5 9.5h2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  warning:      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2L1.5 13.5h13L8 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M8 7v3M8 11.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  refresh:      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 8a5 5 0 1 1-1.46-3.54" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M13 3v2.5H10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  home:         <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2.5 9L9 2.5 15.5 9v7.5H11v-5H7v5H2.5V9z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  globe:        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/><path d="M8 1.5C8 1.5 6 4.5 6 8s2 6.5 2 6.5M8 1.5C8 1.5 10 4.5 10 8s-2 6.5-2 6.5M1.5 8h13" stroke="currentColor" strokeWidth="1.3"/></svg>,
  shield:       <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5l5 2v4c0 3.5-2.5 5.5-5 6-2.5-.5-5-2.5-5-6v-4l5-2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  send:         <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M12.5 1.5L6.5 7.5M12.5 1.5L8.5 12.5l-2-5-5-2 11-4z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  wallet:       <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="4" width="13" height="9.5" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M11.5 4V3A1.5 1.5 0 0 0 10 1.5H4A1.5 1.5 0 0 0 2.5 3v1" stroke="currentColor" strokeWidth="1.4"/><circle cx="12" cy="8.5" r="1" fill="currentColor"/></svg>,
  chat:         <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 10a1.5 1.5 0 0 1-1.5 1.5H4.5L2 14V3.5A1.5 1.5 0 0 1 3.5 2h9A1.5 1.5 0 0 1 14 3.5V10z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  user:         <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.4"/><path d="M2 14c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  darkmode:     <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.5 10.5A6.5 6.5 0 0 1 5.5 2.5a6.5 6.5 0 1 0 8 8z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  filter:       <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M4.5 8h7M7 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  moreH:        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="4" cy="8" r="1.2" fill="currentColor"/><circle cx="8" cy="8" r="1.2" fill="currentColor"/><circle cx="12" cy="8" r="1.2" fill="currentColor"/></svg>,
  hospital:     <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="1.5" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M7 4v6M4 7h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  heartbeat:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1.5 7h2.5l1.5-2.5 2 5 1.5-2.5H12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  trending:     <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1.5 10.5L5 7l3 2.5 4.5-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M9.5 3.5h3v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
}

// ─── Dashboard sub-pages ──────────────────────────────────────────────────────
type DashPage = 'overview'|'requests'|'beneficiaries'|'agents'|'messages'|'notifications'|'payments'|'reviews'|'support'|'settings'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function glass(extra: CSSProperties = {}): CSSProperties {
  return {
    background: 'rgba(255,255,255,0.70)',
    backdropFilter: 'blur(20px) saturate(1.8)',
    WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
    border: `1px solid ${C.border}`,
    ...extra,
  }
}

function Card({ children, style = {}, hover = false, onClick }: { children: ReactNode; style?: CSSProperties; hover?: boolean; onClick?: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: C.surface, borderRadius:16, border:`1px solid ${C.border}`,
        boxShadow: hov && hover ? '0 8px 28px rgba(44,62,67,0.12)' : '0 1px 4px rgba(44,62,67,0.06)',
        transition: 'box-shadow 0.2s, transform 0.2s',
        transform: hov && hover ? 'translateY(-2px)' : undefined,
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}>
      {children}
    </div>
  )
}

function Badge({ label, color = C.primary, bg }: { label: string; color?: string; bg?: string }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', padding:'3px 10px', borderRadius:999, fontSize:11, fontWeight:700, background: bg ?? `${color}14`, color, letterSpacing:'0.02em' }}>{label}</span>
  )
}

function Avatar({ src, name, size = 36 }: { src?: string; name: string; size?: number }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()
  return src ? (
    <img src={src} alt={name} style={{ width:size, height:size, borderRadius:'50%', objectFit:'cover', flexShrink:0 }} />
  ) : (
    <div style={{ width:size, height:size, borderRadius:'50%', background:`${C.primary}18`, color:C.primary, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:size*0.35, flexShrink:0, fontFamily:'Manrope,sans-serif' }}>{initials}</div>
  )
}

function SkeletonLine({ w = '100%', h = 14, radius = 6 }: { w?: string|number; h?: number; radius?: number }) {
  return <div className="animate-shimmer" style={{ width:w, height:h, borderRadius:radius }} />
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label:string; color:string; bg:string }> = {
    'open':        { label:'Open',         color:'#3B82F6', bg:'#EFF6FF' },
    'applied':     { label:'Applied',      color:C.warning, bg:'#FFFBEB' },
    'in-progress': { label:'In Progress',  color:C.primary, bg:`${C.primary}12` },
    'completed':   { label:'Completed',    color:C.success, bg:'#F0FDF4' },
    'cancelled':   { label:'Cancelled',    color:C.error,   bg:'#FEF2F2' },
    'pending':     { label:'Pending',      color:C.warning, bg:'#FFFBEB' },
  }
  const t = map[status] ?? { label: status, color: C.muted, bg: '#F2F4F5' }
  return <Badge label={t.label} color={t.color} bg={t.bg} />
}

// ─── Skeleton cards ───────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <Card style={{ padding:20 }}>
      <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
        <div className="animate-shimmer" style={{ width:44, height:44, borderRadius:12, flexShrink:0 }} />
        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:8 }}>
          <SkeletonLine w="60%" h={13} />
          <SkeletonLine w="80%" h={20} />
          <SkeletonLine w="40%" h={11} />
        </div>
      </div>
    </Card>
  )
}

// ─── Left Sidebar ─────────────────────────────────────────────────────────────
const NAV_ITEMS: { key: DashPage; label: string; icon: ReactNode; badge?: number }[] = [
  { key:'overview',       label:'Dashboard',         icon: I.dashboard },
  { key:'requests',       label:'Care Requests',      icon: I.requests,       badge: 3 },
  { key:'beneficiaries',  label:'Beneficiaries',      icon: I.beneficiaries },
  { key:'agents',         label:'Care Agents',        icon: I.agents },
  { key:'messages',       label:'Messages',           icon: I.messages,       badge: 5 },
  { key:'notifications',  label:'Notifications',      icon: I.notifications,  badge: 2 },
  { key:'payments',       label:'Payments',           icon: I.payments },
  { key:'reviews',        label:'Reviews',            icon: I.reviews },
  { key:'support',        label:'Support',            icon: I.support },
  { key:'settings',       label:'Settings',           icon: I.settings },
]

function Sidebar({ active, setActive, collapsed, setCollapsed }: {
  active: DashPage; setActive: (p: DashPage) => void; collapsed: boolean; setCollapsed: (v: boolean) => void
}) {
  const w = collapsed ? 64 : 228

  return (
    <aside style={{
      width: w, flexShrink: 0,
      height: '100vh', position: 'sticky', top: 0,
      display: 'flex', flexDirection: 'column',
      background: C.surface, borderRight: `1px solid ${C.border}`,
      transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
      overflow: 'hidden', zIndex: 30,
    }}>
      {/* Logo row */}
      <div style={{ padding: collapsed ? '20px 0' : '20px 20px', display:'flex', alignItems:'center', justifyContent: collapsed ? 'center' : 'space-between', borderBottom:`1px solid ${C.border}`, gap:8, minHeight:100 }}>
        {collapsed
          ? <img src={logoIcon} alt="ReadyPal" style={{ height:52, width:52, objectFit:'contain' }} />
          : <img src={logoFull} alt="ReadyPal" style={{ height:84, objectFit:'contain', maxWidth:180 }} />
        }
        {!collapsed && (
          <button onClick={() => setCollapsed(true)} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, padding:4, borderRadius:8, display:'flex', flexShrink:0 }}>
            {I.chevronL}
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex:1, padding:'12px 8px', overflowY:'auto', display:'flex', flexDirection:'column', gap:2 }}>
        {collapsed && (
          <button onClick={() => setCollapsed(false)} style={{ width:'100%', height:40, display:'flex', alignItems:'center', justifyContent:'center', background:'none', border:'none', cursor:'pointer', color:C.muted, borderRadius:10, marginBottom:4 }}>
            {I.menu}
          </button>
        )}
        {NAV_ITEMS.map(item => {
          const isActive = active === item.key
          return (
            <button key={item.key} onClick={() => setActive(item.key)}
              title={collapsed ? item.label : undefined}
              style={{
                display:'flex', alignItems:'center', gap:collapsed ? 0 : 10,
                padding: collapsed ? '10px' : '10px 12px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius:10, border:'none', cursor:'pointer',
                background: isActive ? `${C.primary}0F` : 'transparent',
                color: isActive ? C.primary : C.sub,
                fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight: isActive ? 700 : 500,
                transition:'all 0.15s', position:'relative', width:'100%', textAlign:'left',
              }}>
              <span style={{ flexShrink:0, display:'flex' }}>{item.icon}</span>
              {!collapsed && <span style={{ flex:1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.label}</span>}
              {!collapsed && item.badge && (
                <span style={{ background: isActive ? C.primary : C.muted, color:'#fff', fontSize:10, fontWeight:800, borderRadius:999, padding:'1px 6px', minWidth:18, textAlign:'center' }}>{item.badge}</span>
              )}
              {collapsed && item.badge && (
                <span style={{ position:'absolute', top:6, right:6, width:8, height:8, borderRadius:'50%', background:C.accent, border:`2px solid ${C.surface}` }} />
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom: profile + logout */}
      <div style={{ borderTop:`1px solid ${C.border}`, padding: collapsed ? '12px 8px' : '12px 12px', display:'flex', alignItems:'center', gap:10 }}>
        <Avatar name="Mohamed Ihsan" size={34} />
        {!collapsed && (
          <div style={{ flex:1, overflow:'hidden' }}>
            <p style={{ fontSize:12, fontWeight:700, color:C.type, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>Mohamed Ihsan</p>
            <p style={{ fontSize:11, color:C.muted }}>Family Member</p>
          </div>
        )}
        {!collapsed && (
          <button style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, display:'flex', flexShrink:0 }}>{I.logout}</button>
        )}
      </div>
    </aside>
  )
}

// ─── Top Nav ─────────────────────────────────────────────────────────────────
function TopNav({ page, onMenuClick, notifCount, msgCount, onNotif, onMsg }: {
  page: DashPage; onMenuClick: () => void; notifCount: number; msgCount: number
  onNotif: () => void; onMsg: () => void
}) {
  const [search, setSearch] = useState('')
  const [searchFocus, setSearchFocus] = useState(false)

  const titles: Record<DashPage, string> = {
    overview:'Dashboard', requests:'Care Requests', beneficiaries:'Beneficiaries',
    agents:'Care Agents', messages:'Messages', notifications:'Notifications',
    payments:'Payments', reviews:'Reviews', support:'Support', settings:'Settings',
  }

  return (
    <header style={{ height:60, borderBottom:`1px solid ${C.border}`, background:C.surface, display:'flex', alignItems:'center', gap:12, padding:'0 20px', position:'sticky', top:0, zIndex:20, flexShrink:0 }}>
      {/* Mobile menu */}
      <button className="lg:hidden" onClick={onMenuClick} style={{ background:'none', border:'none', cursor:'pointer', color:C.type, display:'flex', padding:4 }}>{I.menu}</button>

      <h1 style={{ fontSize:16, fontWeight:800, color:C.type, marginRight:'auto', fontFamily:'Manrope,sans-serif', whiteSpace:'nowrap' }}>{titles[page]}</h1>

      {/* Search */}
      <div style={{ position:'relative', flex:'0 1 260px' }}>
        <span style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:C.muted, display:'flex' }}>{I.search}</span>
        <input value={search} onChange={e => setSearch(e.target.value)}
          onFocus={() => setSearchFocus(true)} onBlur={() => setSearchFocus(false)}
          placeholder="Search everything…"
          style={{ width:'100%', padding:'7px 12px 7px 32px', borderRadius:10, border:`1.5px solid ${searchFocus ? C.primary : C.border}`, fontSize:13, fontFamily:'Manrope,sans-serif', color:C.type, background:'#F9FAFB', outline:'none', transition:'border-color 0.15s', boxShadow: searchFocus ? `0 0 0 3px ${C.primary}14` : 'none' }} />
      </div>

      {/* Language */}
      <button style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 10px', borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', fontSize:12, fontWeight:600, color:C.sub, fontFamily:'Manrope,sans-serif' }}>
        {I.globe} EN
      </button>

      {/* Dark mode placeholder */}
      <button style={{ width:34, height:34, borderRadius:10, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.muted }}>
        {I.darkmode}
      </button>

      {/* Messages */}
      <button onClick={onMsg} style={{ position:'relative', width:34, height:34, borderRadius:10, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.sub }}>
        {I.messages}
        {msgCount > 0 && <span style={{ position:'absolute', top:5, right:5, width:8, height:8, borderRadius:'50%', background:C.accent, border:`2px solid ${C.surface}` }} />}
      </button>

      {/* Notifications */}
      <button onClick={onNotif} style={{ position:'relative', width:34, height:34, borderRadius:10, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.sub }}>
        {I.bell}
        {notifCount > 0 && (
          <span style={{ position:'absolute', top:4, right:4, minWidth:16, height:16, borderRadius:999, background:C.error, color:'#fff', fontSize:9, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', border:`2px solid ${C.surface}`, padding:'0 3px' }}>{notifCount}</span>
        )}
      </button>

      {/* Quick add */}
      <button style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:10, border:'none', background:C.primary, cursor:'pointer', color:'#fff', fontSize:12, fontWeight:700, fontFamily:'Manrope,sans-serif', boxShadow:`0 2px 8px ${C.primary}30` }}>
        {I.plus} New Request
      </button>

      {/* Avatar */}
      <Avatar name="Mohamed Ihsan" size={32} />
    </header>
  )
}

// ─── Mobile Bottom Nav ────────────────────────────────────────────────────────
function MobileNav({ active, setActive }: { active: DashPage; setActive: (p: DashPage) => void }) {
  const items: { key: DashPage; label: string; icon: ReactNode; badge?: number }[] = [
    { key:'overview',      label:'Home',    icon: I.home },
    { key:'requests',      label:'Requests', icon: I.requests, badge: 3 },
    { key:'messages',      label:'Messages', icon: I.messages, badge: 5 },
    { key:'notifications', label:'Alerts',   icon: I.bell,     badge: 2 },
    { key:'settings',      label:'Profile',  icon: I.user },
  ]
  return (
    <nav style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:50, background: C.surface, borderTop:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-around', padding:'8px 0', height:60 }} className="lg:hidden">
      {items.map(item => {
        const isActive = active === item.key
        return (
          <button key={item.key} onClick={() => setActive(item.key)} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3, background:'none', border:'none', cursor:'pointer', flex:1, position:'relative', color: isActive ? C.primary : C.muted, fontFamily:'Manrope,sans-serif' }}>
            <span style={{ display:'flex', position:'relative' }}>
              {item.icon}
              {item.badge && <span style={{ position:'absolute', top:-4, right:-5, minWidth:14, height:14, borderRadius:999, background:C.error, color:'#fff', fontSize:8, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 2px' }}>{item.badge}</span>}
            </span>
            <span style={{ fontSize:10, fontWeight: isActive ? 700 : 500 }}>{item.label}</span>
          </button>
        )
      })}
      {/* FAB */}
      <div style={{ position:'absolute', top:-24, left:'50%', transform:'translateX(-50%)' }}>
        <button style={{ width:48, height:48, borderRadius:'50%', background:`linear-gradient(135deg,${C.primary},#00959E)`, border:'none', cursor:'pointer', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 4px 16px ${C.primary}40` }}>
          {I.plus}
        </button>
      </div>
    </nav>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD OVERVIEW
// ═══════════════════════════════════════════════════════════════════════════════
function OverviewPage({ overview }: { overview: any }) {
  // Animated counter
  const [count, setCount] = useState(0)
  useEffect(() => {
    const target = 18500
    const start = Date.now()
    const duration = 1600
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(Math.round(eased * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [])

  const summaryCards = [
    { label:'Upcoming Visits',          value:String(overview.counts.upcomingVisits),    sub:'Next: Today 9:00 AM',      color:C.primary, icon:I.calendar,  trend:'+1 this week' },
    { label:'Active Care Requests',     value:String(overview.counts.activeRequests),    sub:'1 awaiting confirmation',   color:C.accent,  icon:I.requests,  trend:'Needs attention' },
    { label:'Unread Messages',          value:'5',    sub:'From 3 agents',             color:'#3B82F6', icon:I.messages,  trend:'2 new today' },
    { label:'Pending Payments',         value:'LKR 4,500', sub:'Due in 3 days',        color:C.warning, icon:I.payments,  trend:'1 invoice' },
    { label:'Agents Applied',           value:'4',    sub:'For Home Visit request',    color:C.success, icon:I.agents,    trend:'Review now' },
  ]

  const quickActions = [
    { label:'Create Care Request', icon:I.requests,      color:C.primary },
    { label:'Manage Beneficiaries', icon:I.beneficiaries, color:'#8B5CF6' },
    { label:'Find Care Agents',    icon:I.agents,        color:C.accent },
    { label:'Track Current Task',  icon:I.check,         color:C.success },
    { label:'Make Payment',        icon:I.payments,      color:C.warning },
    { label:'Contact Support',     icon:I.support,       color:'#3B82F6' },
  ]

  const requests = overview.requests 

  const visits = [
    { time:'09:00 AM', title:'Home Wellness Visit',     agent:'Chamari Dissanayake', beneficiary:'Amara Fernando', status:'today' },
    { time:'02:00 PM', title:'Medication Collection',   agent:'Priya Senanayake',    beneficiary:'Amara Fernando', status:'today' },
    { time:'10:30 AM', title:'Hospital Companion',      agent:'Nimal Perera',        beneficiary:'Amara Fernando', status:'tomorrow' },
    { time:'09:00 AM', title:'Weekly Home Visit',       agent:'Chamari Dissanayake', beneficiary:'Amara Fernando', status:'this-week' },
  ]

  const activity = [
    { icon:I.check,      color:C.success, label:'Visit completed',          detail:'Chamari visited Amara · 9 AM',     time:'2h ago' },
    { icon:I.send,       color:'#3B82F6', label:'Application received',     detail:'Nimal Perera applied to CR-002',    time:'3h ago' },
    { icon:I.payments,   color:C.warning, label:'Payment processed',        detail:'LKR 2,250 — Home Visit #12',        time:'Yesterday' },
    { icon:I.reviews,    color:C.accent,  label:'Review submitted',         detail:'You rated Chamari 5 stars',         time:'2 days ago' },
    { icon:I.notifications,color:C.primary,label:'New care request created',detail:'Hospital Appointment Escort',       time:'3 days ago' },
  ]

  const notifications = overview.notifications 

  const convos = [
    { name:'Chamari Dissanayake', role:'Care Agent', last:"I'm on my way, should arrive by 8:50.", time:'8:45 AM',  unread:2, typing:false },
    { name:'Priya Senanayake',    role:'Care Agent', last:"Could you confirm the address for today?",   time:'Yesterday', unread:0, typing:true  },
    { name:'ReadyPal Support',    role:'Support',    last:"Your account has been verified successfully.", time:'Mon',     unread:0, typing:false },
  ]

  const agents = [
    { name:'Chamari Dissanayake', rating:4.9, jobs:48, langs:['Sinhala','English'], dist:'3.2 km', avail:true,  avatar: undefined },
    { name:'Priya Senanayake',    rating:4.7, jobs:31, langs:['Tamil','English'],  dist:'5.1 km', avail:true,  avatar: undefined },
    { name:'Nimal Perera',        rating:4.8, jobs:62, langs:['Sinhala'],          dist:'7.8 km', avail:false, avatar: undefined },
    { name:'Ruwan Fernando',      rating:4.6, jobs:19, langs:['Sinhala','English'], dist:'4.4 km', avail:true, avatar: undefined },
  ]

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      {/* Greeting + hero */}
      <div style={{ borderRadius:20, overflow:'hidden', background:`linear-gradient(135deg,${C.primary} 0%,#00959E 60%,#EE8153 100%)`, padding:'32px 32px', position:'relative', minHeight:160 }}>
        <div aria-hidden style={{ position:'absolute', inset:0, opacity:0.07 }}>
          <div style={{ position:'absolute', top:-40, right:-40, width:280, height:280, borderRadius:'50%', background:'rgba(255,255,255,0.2)' }} />
          <div style={{ position:'absolute', bottom:-60, left:-30, width:220, height:220, borderRadius:'50%', background:'rgba(255,255,255,0.15)' }} />
        </div>
        <div style={{ position:'relative', zIndex:1, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:24 }}>
          <div>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.70)', fontWeight:600, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>Monday, 13 January 2025</p>
            <h2 style={{ fontSize:26, fontWeight:900, color:'#fff', letterSpacing:'-0.02em', lineHeight:1.2, marginBottom:8 }}>
              Good Morning, {overview.fullName.split(' ')[0]}
            </h2>
            <p style={{ fontSize:14, color:'rgba(255,255,255,0.80)', lineHeight:1.6, maxWidth:400 }}>
              Everything you need to manage Amara's care, right here.
            </p>
            <div style={{ display:'flex', gap:10, marginTop:20, flexWrap:'wrap' }}>
              <button style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 18px', borderRadius:10, border:'none', background:'#fff', cursor:'pointer', color:C.primary, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', boxShadow:'0 2px 8px rgba(0,0,0,0.15)' }}>
                {I.plus} Create Care Request
              </button>
              <button style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 18px', borderRadius:10, border:'1.5px solid rgba(255,255,255,0.40)', background:'rgba(255,255,255,0.12)', cursor:'pointer', color:'#fff', fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', backdropFilter:'blur(12px)' }}>
                {I.agents} Browse Care Agents
              </button>
            </div>
          </div>
          {/* Mini stats */}
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            {[
              { label:'Visits done', value:count.toLocaleString() },
              { label:'Active agents', value:'2,400+' },
              { label:'Your rating', value:'4.9 / 5' },
            ].map(s => (
              <div key={s.label} style={{ background:'rgba(255,255,255,0.15)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.22)', borderRadius:14, padding:'12px 18px', textAlign:'center' }}>
                <p style={{ fontSize:20, fontWeight:900, color:'#fff', letterSpacing:'-0.02em' }}>{s.value}</p>
                <p style={{ fontSize:11, color:'rgba(255,255,255,0.65)', fontWeight:600 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:14 }} className="summary-grid">
        {summaryCards.map(s => (
          <Card key={s.label} hover style={{ padding:18 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:`${s.color}12`, display:'flex', alignItems:'center', justifyContent:'center', color:s.color }}>{s.icon}</div>
              <span style={{ fontSize:11, fontWeight:600, color:s.color, background:`${s.color}10`, padding:'2px 8px', borderRadius:6 }}>{s.trend}</span>
            </div>
            <p style={{ fontSize:22, fontWeight:900, color:C.type, letterSpacing:'-0.02em', marginBottom:2 }}>{s.value}</p>
            <p style={{ fontSize:12, fontWeight:700, color:C.type, marginBottom:2 }}>{s.label}</p>
            <p style={{ fontSize:11, color:C.muted }}>{s.sub}</p>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card style={{ padding:20 }}>
        <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:16 }}>Quick Actions</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:10 }} className="quick-actions-grid">
          {quickActions.map(a => (
            <button key={a.label} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, padding:'16px 8px', borderRadius:14, border:`1px solid ${C.border}`, background:'#FAFAFA', cursor:'pointer', transition:'all 0.15s', fontFamily:'Manrope,sans-serif' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.background = `${a.color}07` }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = '#FAFAFA' }}>
              <div style={{ width:40, height:40, borderRadius:12, background:`${a.color}12`, display:'flex', alignItems:'center', justifyContent:'center', color:a.color }}>{a.icon}</div>
              <span style={{ fontSize:11, fontWeight:700, color:C.type, textAlign:'center', lineHeight:1.3 }}>{a.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* 2-col: Requests + Visits */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:20 }} className="two-col-grid">
        {/* Care Requests */}
        <Card style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'18px 20px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <h3 style={{ fontSize:14, fontWeight:800, color:C.type }}>Care Requests</h3>
            <div style={{ display:'flex', gap:8 }}>
              <button style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 10px', borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', fontSize:12, fontWeight:600, color:C.sub, fontFamily:'Manrope,sans-serif' }}>{I.filter} Filter</button>
              <button style={{ fontSize:12, fontWeight:700, color:C.primary, background:'none', border:'none', cursor:'pointer', fontFamily:'Manrope,sans-serif' }}>View all {I.arrowR}</button>
            </div>
          </div>
          <div>
            {requests.map((r: any, i: number) => (
              <div key={r.id} style={{ padding:'14px 20px', borderBottom: i < requests.length - 1 ? `1px solid ${C.border}` : 'none', display:'flex', alignItems:'center', gap:14, cursor:'pointer', transition:'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div style={{ width:36, height:36, borderRadius:10, background:`${C.primary}0D`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary, flexShrink:0 }}>{I.hospital}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <p style={{ fontSize:13, fontWeight:700, color:C.type, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{r.title}</p>
                    <StatusBadge status={r.status} />
                  </div>
                  <div style={{ display:'flex', gap:12 }}>
                    <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:C.muted }}>{I.user} {r.agent}</span>
                    <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:C.muted }}>{I.pin} {r.location}</span>
                    <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:C.muted }}>{I.calendar} {r.date}</span>
                  </div>
                  {r.progress > 0 && r.progress < 100 && (
                    <div style={{ marginTop:6, height:3, borderRadius:2, background:C.border, overflow:'hidden', width:'60%' }}>
                      <div style={{ height:'100%', borderRadius:2, background:`linear-gradient(90deg,${C.primary},#00959E)`, width:`${r.progress}%`, transition:'width 0.6s' }} />
                    </div>
                  )}
                </div>
                <button style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, flexShrink:0 }}>{I.moreH}</button>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Visits */}
        <Card style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'18px 20px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <h3 style={{ fontSize:14, fontWeight:800, color:C.type }}>Upcoming Visits</h3>
            <button style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, fontWeight:700, color:C.primary, background:'none', border:'none', cursor:'pointer', fontFamily:'Manrope,sans-serif' }}>{I.calendar} Calendar</button>
          </div>
          {/* Day tabs */}
          <div style={{ display:'flex', borderBottom:`1px solid ${C.border}` }}>
            {['Today','Tomorrow','This Week'].map((d, i) => (
              <button key={d} style={{ flex:1, padding:'9px 4px', border:'none', background: i===0 ? `${C.primary}0F` : 'transparent', color: i===0 ? C.primary : C.muted, fontSize:12, fontWeight: i===0 ? 700 : 500, cursor:'pointer', borderBottom: i===0 ? `2px solid ${C.primary}` : '2px solid transparent', fontFamily:'Manrope,sans-serif' }}>{d}</button>
            ))}
          </div>
          <div>
            {visits.filter(v => v.status === 'today').map((v, i) => (
              <div key={i} style={{ padding:'14px 20px', borderBottom:`1px solid ${C.border}`, display:'flex', gap:12, alignItems:'flex-start' }}>
                <div style={{ textAlign:'center', width:54, flexShrink:0 }}>
                  <p style={{ fontSize:13, fontWeight:800, color:C.primary }}>{v.time}</p>
                  <div style={{ width:2, height:24, background:`${C.primary}30`, margin:'4px auto' }} />
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:3 }}>{v.title}</p>
                  <p style={{ fontSize:11, color:C.muted }}>{v.agent}</p>
                  <div style={{ display:'flex', gap:6, marginTop:6 }}>
                    <Badge label="Confirmed" color={C.success} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 3-col: Activity + Notifications + Messages */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px 320px', gap:20 }} className="three-col-grid">
        {/* Activity timeline */}
        <Card style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'18px 20px', borderBottom:`1px solid ${C.border}` }}>
            <h3 style={{ fontSize:14, fontWeight:800, color:C.type }}>Recent Activity</h3>
          </div>
          <div style={{ padding:'8px 0' }}>
            {activity.map((a, i) => (
              <div key={i} style={{ display:'flex', gap:12, padding:'12px 20px', alignItems:'flex-start' }}>
                <div style={{ width:32, height:32, borderRadius:10, background:`${a.color}12`, display:'flex', alignItems:'center', justifyContent:'center', color:a.color, flexShrink:0 }}>{a.icon}</div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{a.label}</p>
                  <p style={{ fontSize:11, color:C.muted, marginTop:1 }}>{a.detail}</p>
                </div>
                <span style={{ fontSize:10, color:C.muted, whiteSpace:'nowrap', flexShrink:0, marginTop:2 }}>{a.time}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Notifications */}
        <Card style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'18px 20px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <h3 style={{ fontSize:14, fontWeight:800, color:C.type }}>Notifications</h3>
            <button style={{ fontSize:12, fontWeight:700, color:C.primary, background:'none', border:'none', cursor:'pointer', fontFamily:'Manrope,sans-serif' }}>View all</button>
          </div>
          <div>
            {notifications.map((n: any, i: number) => (
              <div key={i} style={{ padding:'12px 16px', borderBottom: i < notifications.length-1 ? `1px solid ${C.border}` : 'none', background: n.unread ? `${n.color}05` : 'transparent', cursor:'pointer', transition:'background 0.15s' }}>
                <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                  {n.unread && <div style={{ width:7, height:7, borderRadius:'50%', background:n.color, marginTop:5, flexShrink:0 }} />}
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:12, fontWeight: n.unread ? 700 : 600, color:C.type, marginBottom:2 }}>{n.title}</p>
                    <p style={{ fontSize:11, color:C.muted, lineHeight:1.5 }}>{n.detail}</p>
                    <p style={{ fontSize:10, color:C.muted, marginTop:4 }}>{n.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Messages */}
        <Card style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'18px 20px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <h3 style={{ fontSize:14, fontWeight:800, color:C.type }}>Messages</h3>
            <button style={{ fontSize:12, fontWeight:700, color:C.primary, background:'none', border:'none', cursor:'pointer', fontFamily:'Manrope,sans-serif' }}>View all</button>
          </div>
          <div>
            {convos.map((c, i) => (
              <div key={i} style={{ padding:'12px 16px', borderBottom: i < convos.length-1 ? `1px solid ${C.border}` : 'none', cursor:'pointer', display:'flex', gap:10, alignItems:'flex-start', transition:'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <Avatar name={c.name} size={36} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
                    <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{c.name}</p>
                    <span style={{ fontSize:10, color:C.muted }}>{c.time}</span>
                  </div>
                  <p style={{ fontSize:11, color: c.typing ? C.primary : C.muted, lineHeight:1.4, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', fontStyle: c.typing ? 'italic' : 'normal' }}>
                    {c.typing ? 'Typing…' : c.last}
                  </p>
                </div>
                {c.unread > 0 && (
                  <span style={{ minWidth:18, height:18, borderRadius:999, background:C.accent, color:'#fff', fontSize:10, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{c.unread}</span>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recommended agents */}
      <Card style={{ padding:0, overflow:'hidden' }}>
        <div style={{ padding:'18px 20px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <h3 style={{ fontSize:14, fontWeight:800, color:C.type }}>Recommended Care Agents</h3>
          <div style={{ display:'flex', gap:8 }}>
            <button style={{ width:28, height:28, borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.muted }}>{I.chevronL}</button>
            <button style={{ width:28, height:28, borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.muted }}>{I.chevronR}</button>
          </div>
        </div>
        <div style={{ padding:20, display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }} className="agents-grid">
          {agents.map(a => (
            <Card key={a.name} hover style={{ padding:18, border:`1px solid ${C.border}` }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                <Avatar name={a.name} size={42} />
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{a.name}</p>
                  <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:2 }}>
                    {I.starFill}
                    <span style={{ fontSize:12, fontWeight:700, color:C.type }}>{a.rating}</span>
                    <span style={{ fontSize:11, color:C.muted }}>({a.jobs} jobs)</span>
                  </div>
                </div>
                <span style={{ width:8, height:8, borderRadius:'50%', background: a.avail ? C.success : C.muted, flexShrink:0 }} />
              </div>
              <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:12 }}>
                {a.langs.map(l => <Badge key={l} label={l} color={C.sub} bg="#F2F4F5" />)}
                <Badge label={a.dist} color={C.primary} />
              </div>
              <button style={{ width:'100%', padding:'8px', borderRadius:10, border:`1.5px solid ${C.primary}`, background:'transparent', cursor:'pointer', color:C.primary, fontSize:12, fontWeight:700, fontFamily:'Manrope,sans-serif', transition:'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = C.primary; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.primary }}>
                Book Now
              </button>
            </Card>
          ))}
        </div>
      </Card>

      {/* Payments + Support */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }} className="two-col-grid">
        {/* Payment summary */}
        <Card style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'18px 20px', borderBottom:`1px solid ${C.border}` }}>
            <h3 style={{ fontSize:14, fontWeight:800, color:C.type }}>Payment Summary</h3>
          </div>
          <div style={{ padding:20, display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {[
              { label:'Outstanding',  value:'LKR 4,500',  color:C.warning, icon:I.warning },
              { label:'Wallet Balance', value:'LKR 12,000', color:C.success, icon:I.wallet },
              { label:'Paid (Jan)',   value:'LKR 18,750', color:C.primary, icon:I.check },
              { label:'Invoices',     value:'3',          color:'#3B82F6', icon:I.doc },
            ].map(p => (
              <div key={p.label} style={{ padding:16, borderRadius:14, background:`${p.color}08`, border:`1px solid ${p.color}20` }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                  <span style={{ color:p.color }}>{p.icon}</span>
                  <span style={{ fontSize:11, fontWeight:600, color:p.color }}>{p.label}</span>
                </div>
                <p style={{ fontSize:18, fontWeight:900, color:C.type, letterSpacing:'-0.02em' }}>{p.value}</p>
              </div>
            ))}
          </div>
          <div style={{ padding:'0 20px 20px' }}>
            <button style={{ width:'100%', padding:'9px', borderRadius:10, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', color:C.sub, fontSize:12, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>View Payment History →</button>
          </div>
        </Card>

        {/* Support */}
        <Card style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'18px 20px', borderBottom:`1px solid ${C.border}` }}>
            <h3 style={{ fontSize:14, fontWeight:800, color:C.type }}>Support</h3>
          </div>
          <div style={{ padding:20, display:'flex', flexDirection:'column', gap:10 }}>
            {[
              { icon:I.chat,      label:'Live Chat',        sub:'Avg. reply in 2 min',   color:C.primary },
              { icon:I.support,   label:'Help Centre',      sub:'Browse 200+ articles',  color:'#3B82F6' },
              { icon:I.phone,     label:'Emergency Hotline', sub:'+94 11 234 5678',       color:C.error   },
              { icon:I.doc,       label:'FAQs',             sub:'Quick answers',         color:C.accent  },
            ].map(s => (
              <button key={s.label} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderRadius:12, border:`1px solid ${C.border}`, background:'#FAFAFA', cursor:'pointer', transition:'all 0.15s', width:'100%', textAlign:'left', fontFamily:'Manrope,sans-serif' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.background = `${s.color}06` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = '#FAFAFA' }}>
                <div style={{ width:36, height:36, borderRadius:10, background:`${s.color}12`, display:'flex', alignItems:'center', justifyContent:'center', color:s.color, flexShrink:0 }}>{s.icon}</div>
                <div>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{s.label}</p>
                  <p style={{ fontSize:11, color:C.muted }}>{s.sub}</p>
                </div>
                <span style={{ marginLeft:'auto', color:C.muted }}>{I.arrowR}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// CARE REQUESTS PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function RequestsPage({ allRequests }: { allRequests: any[] }) {
  const [filter, setFilter] = useState('all')
  const tabs = ['all','open','applied','in-progress','completed','cancelled']
  const filtered = filter === 'all' ? allRequests : allRequests.filter(r => r.status === filter)

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:900, color:C.type, letterSpacing:'-0.02em' }}>Care Requests</h2>
          <p style={{ fontSize:13, color:C.muted, marginTop:2 }}>Manage all care requests for your beneficiaries</p>
        </div>
        <button style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 18px', borderRadius:12, border:'none', background:C.primary, cursor:'pointer', color:'#fff', fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', boxShadow:`0 2px 8px ${C.primary}30` }}>
          {I.plus} Create Request
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            padding:'6px 14px', borderRadius:999, border:'none', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:700, textTransform:'capitalize',
            background: filter === t ? C.primary : '#F2F4F5',
            color: filter === t ? '#fff' : C.sub,
            transition:'all 0.15s',
          }}>{t === 'all' ? `All (${allRequests.length})` : t.replace('-', ' ')}</button>
        ))}
      </div>

      {/* Requests table */}
      <Card style={{ padding:0, overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:'Manrope,sans-serif' }}>
            <thead>
              <tr style={{ borderBottom:`1px solid ${C.border}` }}>
                {['Request','Status','Agent','Location','Date','Budget',''].map(h => (
                  <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:11, fontWeight:700, color:C.muted, letterSpacing:'0.05em', textTransform:'uppercase', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id} style={{ borderBottom: i < filtered.length-1 ? `1px solid ${C.border}` : 'none', cursor:'pointer', transition:'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#FAFAFA')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding:'14px 16px' }}>
                    <div>
                      <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{r.title}</p>
                      <p style={{ fontSize:11, color:C.muted, marginTop:2 }}>{r.id}</p>
                    </div>
                  </td>
                  <td style={{ padding:'14px 16px' }}><StatusBadge status={r.status} /></td>
                  <td style={{ padding:'14px 16px', fontSize:13, color:C.type }}>{r.agent}</td>
                  <td style={{ padding:'14px 16px' }}><span style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, color:C.sub }}>{I.pin}{r.loc}</span></td>
                  <td style={{ padding:'14px 16px', fontSize:12, color:C.muted, whiteSpace:'nowrap' }}>{r.date}</td>
                  <td style={{ padding:'14px 16px', fontSize:13, fontWeight:700, color:C.type }}>{r.budget}</td>
                  <td style={{ padding:'14px 16px' }}>
                    <button style={{ padding:'5px 12px', borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', fontSize:12, fontWeight:600, color:C.sub, fontFamily:'Manrope,sans-serif' }}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Empty state */}
      {filtered.length === 0 && (
        <Card style={{ padding:60, textAlign:'center' }}>
          <div style={{ width:72, height:72, borderRadius:'50%', background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', color:C.primary }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="4" y="4" width="24" height="24" rx="4" stroke="currentColor" strokeWidth="1.8"/><path d="M16 10v12M10 16h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </div>
          <h3 style={{ fontSize:16, fontWeight:800, color:C.type, marginBottom:6 }}>No requests found</h3>
          <p style={{ fontSize:13, color:C.muted, marginBottom:20 }}>No care requests match the selected filter.</p>
          <button onClick={() => setFilter('all')} style={{ padding:'9px 18px', borderRadius:10, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', fontSize:13, fontWeight:700, color:C.sub, fontFamily:'Manrope,sans-serif' }}>Clear filter</button>
        </Card>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// BENEFICIARIES PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function BeneficiariesPage({ people }: { people: any[] }) {
  const healthColor = { 'Stable':'#22C55E', 'Good':'#3B82F6', 'Needs Attention':'#F59E0B' }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:900, color:C.type, letterSpacing:'-0.02em' }}>Beneficiaries</h2>
          <p style={{ fontSize:13, color:C.muted, marginTop:2 }}>Manage elderly parents and loved ones in your care</p>
        </div>
        <button style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 18px', borderRadius:12, border:'none', background:C.primary, cursor:'pointer', color:'#fff', fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>
          {I.plus} Add Beneficiary
        </button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:18 }} className="bene-grid">
        {people.map(p => (
          <Card key={p.name} hover style={{ padding:0, overflow:'hidden' }}>
            <div style={{ height:6, background: p.status === 'active' ? `linear-gradient(90deg,${C.primary},#00959E)` : C.border }} />
            <div style={{ padding:22 }}>
              <div style={{ display:'flex', gap:14, alignItems:'flex-start', marginBottom:16 }}>
                <Avatar name={p.name} size={52} />
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:15, fontWeight:800, color:C.type }}>{p.name}</p>
                  <p style={{ fontSize:12, color:C.muted, marginTop:2 }}>Age {p.age || '—'} · {p.city || '—'}</p>
                  <div style={{ marginTop:6 }}>
                    <Badge label={p.health} color={(healthColor as Record<string,string>)[p.health] ?? C.muted} />
                  </div>
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:16 }}>
                <div style={{ display:'flex', gap:8 }}>
                  <span style={{ color:C.muted, flexShrink:0 }}>{I.agents}</span>
                  <span style={{ fontSize:12, color:C.type, fontWeight:600 }}>{p.relationship || 'Beneficiary'}</span>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <span style={{ color:C.muted, flexShrink:0 }}>{I.doc}</span>
                  <span style={{ fontSize:12, color:C.muted, lineHeight:1.5 }}>{p.med_notes || 'No notes yet'}</span>
                </div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button style={{ flex:1, padding:'8px', borderRadius:10, border:'none', background:`${C.primary}10`, cursor:'pointer', color:C.primary, fontSize:12, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>View Details</button>
                <button style={{ width:36, height:36, borderRadius:10, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', color:C.muted, display:'flex', alignItems:'center', justifyContent:'center' }}>{I.moreH}</button>
              </div>
            </div>
          </Card>
        ))}

        {/* Empty add card */}
        <Card hover style={{ padding:40, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', border:`1.5px dashed ${C.border}`, cursor:'pointer' }}>
          <div style={{ width:48, height:48, borderRadius:'50%', background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary, marginBottom:12 }}>{I.plus}</div>
          <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:4 }}>Add Beneficiary</p>
          <p style={{ fontSize:12, color:C.muted }}>Register another loved one</p>
        </Card>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAYMENTS PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function PaymentsPage({ data }: { data: any }) {
  const history = data.history
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, letterSpacing:'-0.02em' }}>Payments</h2>
        <p style={{ fontSize:13, color:C.muted, marginTop:2 }}>Manage invoices, wallet, and payment history</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }} className="pay-summary-grid">
        {[
          { label:'Wallet Balance', value:`LKR ${data.summary.walletBalance.toLocaleString()}`, color:C.success, icon:I.wallet },
          { label:'Outstanding',    value:`LKR ${data.summary.outstanding.toLocaleString()}`,  color:C.warning, icon:I.warning },
          { label:'Paid',           value:`LKR ${data.summary.paid.toLocaleString()}`, color:C.primary, icon:I.check },
          { label:'Open Invoices',  value:String(data.summary.openInvoices),          color:'#3B82F6', icon:I.doc },
        ].map(p => (
          <Card key={p.label} hover style={{ padding:20 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:`${p.color}12`, display:'flex', alignItems:'center', justifyContent:'center', color:p.color }}>{p.icon}</div>
              <span style={{ fontSize:12, fontWeight:600, color:C.muted }}>{p.label}</span>
            </div>
            <p style={{ fontSize:22, fontWeight:900, color:C.type, letterSpacing:'-0.02em' }}>{p.value}</p>
          </Card>
        ))}
      </div>
      <Card style={{ padding:0, overflow:'hidden' }}>
        <div style={{ padding:'18px 20px', borderBottom:`1px solid ${C.border}` }}>
          <h3 style={{ fontSize:14, fontWeight:800, color:C.type }}>Payment History</h3>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:'Manrope,sans-serif' }}>
            <thead>
              <tr style={{ borderBottom:`1px solid ${C.border}` }}>
                {['Reference','Description','Date','Amount','Status'].map(h => (
                  <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:11, fontWeight:700, color:C.muted, letterSpacing:'0.05em', textTransform:'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.length === 0 && (
                <tr><td colSpan={5} style={{ padding:'40px 16px', textAlign:'center', color:C.muted, fontSize:13 }}>No payment history yet.</td></tr>
              )}
              {history.map((h: any, i: number) => (
                <tr key={h.id} style={{ borderBottom: i < history.length-1 ? `1px solid ${C.border}` : 'none' }}>
                  <td style={{ padding:'14px 16px', fontSize:12, color:C.muted }}>{h.id}</td>
                  <td style={{ padding:'14px 16px', fontSize:13, fontWeight:600, color:C.type }}>{h.desc}</td>
                  <td style={{ padding:'14px 16px', fontSize:12, color:C.muted }}>{h.date}</td>
                  <td style={{ padding:'14px 16px', fontSize:13, fontWeight:700, color:C.type }}>{h.amount}</td>
                  <td style={{ padding:'14px 16px' }}><StatusBadge status={h.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// REVIEWS PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function ReviewsPage({ reviews }: { reviews: any[] }) {
  const avgRating = reviews.length ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length) : 0
  const Stars = ({ n }: { n: number }) => (
    <div style={{ display:'flex', gap:2 }}>
      {[1,2,3,4,5].map(i => <svg key={i} width="13" height="13" viewBox="0 0 12 12" fill={i<=n?'#F59E0B':'#E4E8EA'}><path d="M6 1l1.5 3 3.5.5-2.5 2.5.6 3.5L6 9 2.9 10.5l.6-3.5L1 4.5 4.5 4z"/></svg>)}
    </div>
  )
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:900, color:C.type, letterSpacing:'-0.02em' }}>Reviews</h2>
          <p style={{ fontSize:13, color:C.muted, marginTop:2 }}>Your care agent reviews and ratings</p>
        </div>
      </div>
      {/* Average */}
      <Card style={{ padding:24 }}>
        <div style={{ display:'flex', gap:24, alignItems:'center' }}>
          <div style={{ textAlign:'center' }}>
            <p style={{ fontSize:52, fontWeight:900, color:C.type, letterSpacing:'-0.04em', lineHeight:1 }}>{reviews.length ? avgRating.toFixed(1) : '—'}</p>
            <Stars n={Math.round(avgRating)} />
            <p style={{ fontSize:12, color:C.muted, marginTop:4 }}>{reviews.length} reviews</p>
          </div>
          <div style={{ flex:1 }}>
            {[5,4,3,2,1].map(n => {
              const count = reviews.filter(r => r.rating === n).length
              return (
                <div key={n} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                  <span style={{ fontSize:12, color:C.muted, width:8 }}>{n}</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="#F59E0B"><path d="M6 1l1.5 3 3.5.5-2.5 2.5.6 3.5L6 9 2.9 10.5l.6-3.5L1 4.5 4.5 4z"/></svg>
                  <div style={{ flex:1, height:6, borderRadius:3, background:C.border, overflow:'hidden' }}>
                    <div style={{ height:'100%', background:'#F59E0B', width:`${reviews.length ? (count/reviews.length)*100 : 0}%`, borderRadius:3 }} />
                  </div>
                  <span style={{ fontSize:11, color:C.muted, width:14 }}>{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </Card>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {reviews.length === 0 && (
          <div style={{ padding:'30px 20px', textAlign:'center', color:C.muted, fontSize:13 }}>You haven't left any reviews yet.</div>
        )}
        {reviews.map((r: any) => (
          <Card key={r.agent} hover style={{ padding:22 }}>
            <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
              <Avatar name={r.agent} size={42} />
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                  <p style={{ fontSize:14, fontWeight:800, color:C.type }}>{r.agent}</p>
                  <Badge label={r.service} color={C.primary} />
                  <span style={{ fontSize:11, color:C.muted, marginLeft:'auto' }}>{r.date}</span>
                </div>
                <Stars n={r.rating} />
                <p style={{ fontSize:13, color:C.sub, lineHeight:1.65, marginTop:8, fontStyle:'italic' }}>"{r.text}"</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MESSAGES PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function MessagesPage({ conversations, clientId }: { conversations: any[]; clientId: string }) {
  const [active, setActive] = useState(0)
  const [msg, setMsg] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const convo = conversations[active]

  useEffect(() => {
    if (!convo) { setMessages([]); return }
    getConversationMessages(convo.id).then(setMessages).catch(console.error)
  }, [convo?.id])

  const handleSend = async () => {
    if (!msg.trim() || !convo) return
    const text = msg
    setMsg('')
    try {
      await sendMessage(convo.id, clientId, text)
      const updated = await getConversationMessages(convo.id)
      setMessages(updated)
    } catch (err) { console.error(err) }
  }

  if (!conversations.length) {
    return <div style={{ padding:60, textAlign:'center', color:C.muted, fontSize:13 }}>No conversations yet. Once you hire an agent, your conversation will appear here.</div>
  }

  return (
    <div style={{ display:'flex', height:'calc(100vh - 108px)', background:C.surface, borderRadius:16, border:`1px solid ${C.border}`, overflow:'hidden' }}>
      <div style={{ width:280, flexShrink:0, borderRight:`1px solid ${C.border}`, display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'16px 16px 12px', borderBottom:`1px solid ${C.border}` }}>
          <div style={{ position:'relative' }}>
            <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:C.muted, display:'flex' }}>{I.search}</span>
            <input placeholder="Search messages" style={{ width:'100%', padding:'8px 12px 8px 30px', borderRadius:10, border:`1px solid ${C.border}`, fontSize:13, fontFamily:'Manrope,sans-serif', color:C.type, outline:'none', background:'#FAFAFA' }} />
          </div>
        </div>
        {conversations.map((c, i) => (
          <button key={c.id} onClick={() => setActive(i)} style={{ display:'flex', gap:12, padding:'14px 16px', borderBottom:`1px solid ${C.border}`, background: active===i ? `${C.primary}08` : 'transparent', cursor:'pointer', border:'none', borderLeft: active===i ? `3px solid ${C.primary}` : '3px solid transparent', textAlign:'left', transition:'all 0.15s' }}>
            <Avatar name={c.name} size={38} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                <span style={{ fontSize:13, fontWeight:700, color:C.type }}>{c.name}</span>
                <span style={{ fontSize:10, color:C.muted }}>{c.time}</span>
              </div>
              <p style={{ fontSize:12, color:C.muted, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.last}</p>
            </div>
          </button>
        ))}
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'14px 20px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:12 }}>
          <Avatar name={convo.name} size={36} />
          <div><p style={{ fontSize:14, fontWeight:800, color:C.type }}>{convo.name}</p><p style={{ fontSize:11, color:C.muted }}>{convo.role}</p></div>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:20, display:'flex', flexDirection:'column', gap:12 }}>
          {messages.length === 0 && <p style={{ textAlign:'center', color:C.muted, fontSize:13 }}>No messages yet — say hello!</p>}
          {messages.map((m: any) => {
            const mine = m.sender_id === clientId
            return (
              <div key={m.id} style={{ display:'flex', justifyContent: mine ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth:'70%', padding:'10px 14px', borderRadius: mine ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: mine ? C.primary : '#F2F4F5', color: mine ? '#fff' : C.type }}>
                  <p style={{ fontSize:13, lineHeight:1.55, fontFamily:'Manrope,sans-serif' }}>{m.text}</p>
                  <p style={{ fontSize:10, marginTop:4, opacity:0.65, textAlign:'right' }}>{m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }) : ''}</p>
                </div>
              </div>
            )
          })}
        </div>
        <div style={{ padding:'12px 20px', borderTop:`1px solid ${C.border}`, display:'flex', gap:10, alignItems:'center' }}>
          <input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Type a message…"
            onKeyDown={e => { if (e.key === 'Enter' && msg.trim()) handleSend() }}
            style={{ flex:1, padding:'10px 14px', borderRadius:12, border:`1.5px solid ${C.border}`, fontSize:13, fontFamily:'Manrope,sans-serif', color:C.type, outline:'none' }} />
          <button onClick={handleSend} style={{ width:40, height:40, borderRadius:12, border:'none', background:C.primary, cursor:'pointer', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', opacity: msg.trim() ? 1 : 0.5 }}>{I.send}</button>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// NOTIFICATIONS PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function NotificationsPage({ notifs }: { notifs: any[] }) {
  const typeColor: Record<string,string> = { request:C.primary, visit:C.accent, payment:C.warning, review:C.info, task:C.success, system:C.muted }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:900, color:C.type, letterSpacing:'-0.02em' }}>Notifications</h2>
          <p style={{ fontSize:13, color:C.muted, marginTop:2 }}>Stay up to date with care activity</p>
        </div>
        <button style={{ fontSize:12, fontWeight:700, color:C.primary, background:'none', border:'none', cursor:'pointer', fontFamily:'Manrope,sans-serif' }}>Mark all as read</button>
      </div>
      <Card style={{ padding:0, overflow:'hidden' }}>
        {notifs.length === 0 && (
          <div style={{ padding:'40px 20px', textAlign:'center', color:C.muted, fontSize:13 }}>
            No notifications yet.
          </div>
        )}
        {notifs.map((n, i) => (
          <div key={i} style={{ display:'flex', gap:12, padding:'16px 20px', borderBottom: i < notifs.length-1 ? `1px solid ${C.border}` : 'none', background: n.unread ? `${typeColor[n.type]}04` : 'transparent', cursor:'pointer', transition:'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
            onMouseLeave={e => e.currentTarget.style.background = n.unread ? `${typeColor[n.type]}04` : 'transparent'}>
            <div style={{ width:36, height:36, borderRadius:10, background:`${typeColor[n.type]}12`, display:'flex', alignItems:'center', justifyContent:'center', color:typeColor[n.type], flexShrink:0 }}>
              {n.type === 'request' ? I.requests : n.type === 'visit' ? I.calendar : n.type === 'payment' ? I.payments : n.type === 'review' ? I.reviews : n.type === 'task' ? I.check : I.bell}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                <p style={{ fontSize:13, fontWeight: n.unread ? 700 : 600, color:C.type }}>{n.title}</p>
                {n.unread && <span style={{ width:7, height:7, borderRadius:'50%', background:typeColor[n.type], flexShrink:0 }} />}
                <span style={{ fontSize:11, color:C.muted, marginLeft:'auto' }}>{n.time}</span>
              </div>
              <p style={{ fontSize:12, color:C.muted, lineHeight:1.5 }}>{n.detail}</p>
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENTS PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function AgentsPage({ agents }: { agents: any[] }) {
  const [view, setView] = useState<'grid'|'list'>('grid')
  const navigate = useNavigate()
  const Stars = ({ n }: { n: number }) => (
    <div style={{ display:'flex', gap:2 }}>
      {[1,2,3,4,5].map(i => <svg key={i} width="11" height="11" viewBox="0 0 12 12" fill={i<=Math.round(n)?'#F59E0B':'#E4E8EA'}><path d="M6 1l1.5 3 3.5.5-2.5 2.5.6 3.5L6 9 2.9 10.5l.6-3.5L1 4.5 4.5 4z"/></svg>)}
    </div>
  )

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:900, color:C.type, letterSpacing:'-0.02em' }}>Care Agents</h2>
          <p style={{ fontSize:13, color:C.muted, marginTop:2 }}>Browse and manage your verified care agents</p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={() => setView('grid')} style={{ width:34, height:34, borderRadius:8, border:`1px solid ${view==='grid' ? C.primary : C.border}`, background: view==='grid' ? `${C.primary}10` : 'transparent', cursor:'pointer', color: view==='grid' ? C.primary : C.muted, display:'flex', alignItems:'center', justifyContent:'center' }}>{I.dashboard}</button>
          <button onClick={() => setView('list')} style={{ width:34, height:34, borderRadius:8, border:`1px solid ${view==='list' ? C.primary : C.border}`, background: view==='list' ? `${C.primary}10` : 'transparent', cursor:'pointer', color: view==='list' ? C.primary : C.muted, display:'flex', alignItems:'center', justifyContent:'center' }}>{I.filter}</button>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns: view==='grid' ? 'repeat(3,1fr)' : '1fr', gap:16 }} className="agents-grid-page">
        {agents.length === 0 && (
          <div style={{ gridColumn:'1/-1', padding:'40px 20px', textAlign:'center', color:C.muted, fontSize:13 }}>
            No agents yet — hire someone through a care request to see them here.
          </div>
        )}
        {agents.map((a: any) => (
          <Card key={a.name} hover style={{ padding:20 }}>
            <div style={{ display:'flex', gap:12, alignItems:'flex-start', marginBottom:14 }}>
              <Avatar name={a.name} size={48} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2 }}>
                  <p style={{ fontSize:14, fontWeight:800, color:C.type, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{a.name}</p>
                  <span style={{ width:8, height:8, borderRadius:'50%', background: a.avail ? C.success : C.muted, flexShrink:0 }} />
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
                  <Stars n={a.rating} />
                  <span style={{ fontSize:12, fontWeight:700, color:C.type }}>{a.rating}</span>
                  <span style={{ fontSize:11, color:C.muted }}>({a.jobs} jobs)</span>
                </div>
                <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:C.muted }}>{I.pin} {a.loc} · {a.dist}</span>
              </div>
              {a.avail && <Badge label="Available" color={C.success} />}
            </div>
            <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:12 }}>
              {a.langs.map((l: any) => <Badge key={l} label={l} color={C.sub} bg="#F2F4F5" />)}
              {a.services.slice(0,2).map((s: any) => <Badge key={s} label={s} color={C.primary} />)}
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button style={{ flex:1, padding:'8px', borderRadius:10, border:'none', background:C.primary, cursor:'pointer', color:'#fff', fontSize:12, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>Book Now</button>
              <button onClick={() => navigate(`/agents/${a.id}`)} style={{ flex:1, padding:'8px', borderRadius:10, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', color:C.type, fontSize:12, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>View Profile</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Generic placeholder for other pages ─────────────────────────────────────
function PlaceholderPage({ page }: { page: DashPage }) {
  const labels: Partial<Record<DashPage, string>> = { support:'Support' }
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, letterSpacing:'-0.02em', textTransform:'capitalize' }}>{labels[page] ?? page}</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
        {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function ClientDashboard() {
  const [searchParams] = useSearchParams()
  const requestedTab = searchParams.get('tab') as DashPage | null
  const [page, setPage] = useState<DashPage>(
    requestedTab && NAV_ITEMS.some(n => n.key === requestedTab) ? requestedTab : 'overview'
  )
  const [collapsed, setCollapsed] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const [allRequests, setAllRequests] = useState<any[]>([])
  const [overview, setOverview] = useState<any>(null)
  const [people, setPeople] = useState<any[]>([])
  const [notifs, setNotifs] = useState<any[]>([])
  const [paymentsData, setPaymentsData] = useState<any>({ summary:{walletBalance:0,outstanding:0,paid:0,openInvoices:0}, history:[] })
  const [reviews, setReviews] = useState<any[]>([])
  const [myAgents, setMyAgents] = useState<any[]>([])
  const [clientId, setClientId] = useState('')
const [conversations, setConversations] = useState<any[]>([])

useEffect(() => {
  supabase.auth.getUser().then(({ data }) => {
    if (data.user) {
      setClientId(data.user.id)
      getDashboardOverview(data.user.id).then(setOverview).catch(console.error)
      getAllCareRequests(data.user.id).then(setAllRequests).catch(console.error)
      getBeneficiaries(data.user.id).then(setPeople).catch(console.error)
      getAllNotifications(data.user.id).then(setNotifs).catch(console.error)
      getPaymentsData(data.user.id).then(setPaymentsData).catch(console.error)
      getMyReviews(data.user.id).then(setReviews).catch(console.error)
      getMyAgents(data.user.id).then(setMyAgents).catch(console.error)
      getMyConversations(data.user.id).then(setConversations).catch(console.error)
    }
  })
}, [])

  const setPage2 = (p: DashPage) => { setPage(p); setMobileNav(false); window.scrollTo({ top:0, behavior:'smooth' }) }

  const renderPage = () => {
    switch (page) {
      case 'overview':      return overview ? <OverviewPage overview={overview} /> : <p style={{padding:32}}>Loading...</p>
      case 'requests': return <RequestsPage allRequests={allRequests} />
      case 'beneficiaries': return <BeneficiariesPage people={people} />
      case 'agents': return <AgentsPage agents={myAgents} />
      case 'messages': return <MessagesPage conversations={conversations} clientId={clientId} />
      case 'notifications': return <NotificationsPage notifs={notifs} />
      case 'payments': return <PaymentsPage data={paymentsData} />
      case 'reviews': return <ReviewsPage reviews={reviews} />
      case 'settings':      return <AccountSettings embedded />
      default:              return <PlaceholderPage page={page} />
    }
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:C.bg, fontFamily:'Manrope,sans-serif' }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar active={page} setActive={setPage2} collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileNav && (
        <div style={{ position:'fixed', inset:0, zIndex:100 }}>
          <div onClick={() => setMobileNav(false)} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.40)', backdropFilter:'blur(2px)' }} />
          <div style={{ position:'absolute', left:0, top:0, bottom:0, width:240, zIndex:101 }}>
            <Sidebar active={page} setActive={setPage2} collapsed={false} setCollapsed={() => setMobileNav(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        <TopNav page={page} onMenuClick={() => setMobileNav(true)} notifCount={2} msgCount={5} onNotif={() => setPage2('notifications')} onMsg={() => setPage2('messages')} />
        <main style={{ flex:1, padding:'24px 24px 80px', maxWidth:1400, width:'100%', margin:'0 auto', boxSizing:'border-box' }}>
          <div key={page} className="page-enter">
            {renderPage()}
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav active={page} setActive={setPage2} />
    </div>
  )
}
