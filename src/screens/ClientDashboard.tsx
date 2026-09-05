import { useState, useEffect, type ReactNode, type CSSProperties } from 'react'
import logoFull from '@/imports/20260723_170707.png'
import logoIcon from '@/imports/20260723_164632.png'
import { supabase } from '../lib/supabaseClient'
import {
  getCurrentProfile, getDashboardOverview, getAllCareRequests, getBeneficiariesFull,
  getAllNotifications, markNotificationRead, markAllNotificationsRead,
  getPaymentsData, getMyReviews, getMyAgents, getMyConversations, getConversationMessages,
  sendMessage, getMySupportTickets, createSupportTicket,
} from '../lib/api'
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

// Relative time for real timestamps (notification/message created_at).
function formatRelTime(iso: string | null | undefined): string {
  if (!iso) return ''
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return iso
  const minutes = Math.round((Date.now() - then) / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} hr${hours===1?'':'s'} ago`
  const days = Math.round(hours / 24)
  if (days < 7) return `${days} day${days===1?'':'s'} ago`
  return new Date(iso).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })
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
const NAV_ITEMS: { key: DashPage; label: string; icon: ReactNode }[] = [
  { key:'overview',       label:'Dashboard',         icon: I.dashboard },
  { key:'requests',       label:'Care Requests',      icon: I.requests },
  { key:'beneficiaries',  label:'Beneficiaries',      icon: I.beneficiaries },
  { key:'agents',         label:'Care Agents',        icon: I.agents },
  { key:'messages',       label:'Messages',           icon: I.messages },
  { key:'notifications',  label:'Notifications',      icon: I.notifications },
  { key:'payments',       label:'Payments',           icon: I.payments },
  { key:'reviews',        label:'Reviews',            icon: I.reviews },
  { key:'support',        label:'Support',            icon: I.support },
  { key:'settings',       label:'Settings',           icon: I.settings },
]

// Real, derived badge counts only — 'requests' is open/in-flight requests,
// 'messages' is conversations whose latest message is unread and from the
// other participant, 'notifications' is unread notifications. No fabricated
// counts (e.g. there is no per-user "unread message" column, so a global
// message count is never shown as a badge).
type NavBadges = { requests: number; messages: number; notifications: number }

function Sidebar({ active, setActive, collapsed, setCollapsed, badges, profileName, avatarUrl, onLogout, loggingOut }: {
  active: DashPage; setActive: (p: DashPage) => void; collapsed: boolean; setCollapsed: (v: boolean) => void
  badges: NavBadges; profileName: string; avatarUrl?: string | null; onLogout: () => void; loggingOut: boolean
}) {
  const w = collapsed ? 64 : 228
  const badgeFor = (key: DashPage): number => (badges as any)[key] ?? 0

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
          const badge = badgeFor(item.key)
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
              {!collapsed && badge > 0 && (
                <span style={{ background: isActive ? C.primary : C.muted, color:'#fff', fontSize:10, fontWeight:800, borderRadius:999, padding:'1px 6px', minWidth:18, textAlign:'center' }}>{badge}</span>
              )}
              {collapsed && badge > 0 && (
                <span style={{ position:'absolute', top:6, right:6, width:8, height:8, borderRadius:'50%', background:C.accent, border:`2px solid ${C.surface}` }} />
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom: profile + logout */}
      <div style={{ borderTop:`1px solid ${C.border}`, padding: collapsed ? '12px 8px' : '12px 12px', display:'flex', alignItems:'center', gap:10 }}>
        <Avatar name={profileName} src={avatarUrl ?? undefined} size={34} />
        {!collapsed && (
          <div style={{ flex:1, overflow:'hidden' }}>
            <p style={{ fontSize:12, fontWeight:700, color:C.type, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{profileName}</p>
            <p style={{ fontSize:11, color:C.muted }}>Family Member</p>
          </div>
        )}
        {!collapsed && (
          <button onClick={onLogout} disabled={loggingOut} title="Log out"
            style={{ background:'none', border:'none', cursor: loggingOut ? 'not-allowed' : 'pointer', color:C.muted, display:'flex', flexShrink:0, opacity: loggingOut ? 0.5 : 1 }}>{I.logout}</button>
        )}
      </div>
    </aside>
  )
}

// ─── Top Nav ─────────────────────────────────────────────────────────────────
function TopNav({ page, onMenuClick, notifCount, msgCount, onNotif, onMsg, onNewRequest, profileName, avatarUrl }: {
  page: DashPage; onMenuClick: () => void; notifCount: number; msgCount: number
  onNotif: () => void; onMsg: () => void; onNewRequest: () => void
  profileName: string; avatarUrl?: string | null
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
      <button onClick={onNewRequest} style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:10, border:'none', background:C.primary, cursor:'pointer', color:'#fff', fontSize:12, fontWeight:700, fontFamily:'Manrope,sans-serif', boxShadow:`0 2px 8px ${C.primary}30` }}>
        {I.plus} New Request
      </button>

      {/* Avatar */}
      <Avatar name={profileName} src={avatarUrl ?? undefined} size={32} />
    </header>
  )
}

// ─── Mobile Bottom Nav ────────────────────────────────────────────────────────
function MobileNav({ active, setActive, badges, onFab }: { active: DashPage; setActive: (p: DashPage) => void; badges: NavBadges; onFab: () => void }) {
  const items: { key: DashPage; label: string; icon: ReactNode }[] = [
    { key:'overview',      label:'Home',    icon: I.home },
    { key:'requests',      label:'Requests', icon: I.requests },
    { key:'messages',      label:'Messages', icon: I.messages },
    { key:'notifications', label:'Alerts',   icon: I.bell },
    { key:'settings',      label:'Profile',  icon: I.user },
  ]
  return (
    <nav style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:50, background: C.surface, borderTop:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-around', padding:'8px 0', height:60 }} className="lg:hidden">
      {items.map(item => {
        const isActive = active === item.key
        const badge = (badges as any)[item.key] ?? 0
        return (
          <button key={item.key} onClick={() => setActive(item.key)} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3, background:'none', border:'none', cursor:'pointer', flex:1, position:'relative', color: isActive ? C.primary : C.muted, fontFamily:'Manrope,sans-serif' }}>
            <span style={{ display:'flex', position:'relative' }}>
              {item.icon}
              {badge > 0 && <span style={{ position:'absolute', top:-4, right:-5, minWidth:14, height:14, borderRadius:999, background:C.error, color:'#fff', fontSize:8, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 2px' }}>{badge}</span>}
            </span>
            <span style={{ fontSize:10, fontWeight: isActive ? 700 : 500 }}>{item.label}</span>
          </button>
        )
      })}
      {/* FAB — fully lifted above the bar so its bottom edge clears the icon row, and offset off-center so it doesn't sit directly over any single nav item */}
      <div style={{ position:'absolute', bottom:64, left:'50%', transform:'translateX(-50%)' }}>
        <button onClick={onFab} style={{ width:48, height:48, borderRadius:'50%', background:`linear-gradient(135deg,${C.primary},#00959E)`, border:'none', cursor:'pointer', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 4px 16px ${C.primary}40` }}>
          {I.plus}
        </button>
      </div>
    </nav>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD OVERVIEW
// ═══════════════════════════════════════════════════════════════════════════════
function OverviewPage({ overview, people, paymentsData, myAgents, conversations, clientId, onNav, onMarkNotifRead }: {
  overview: any; people: any[]; paymentsData: any; myAgents: any[]; conversations: any[]; clientId: string
  onNav: (p: DashPage) => void; onMarkNotifRead: (id: string) => void
}) {
  const navigate = useNavigate()
  const todayLabel = new Date().toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' })

  const unreadConvos = conversations.filter(c => c.lastMessage && c.lastMessage.sender_id !== clientId && c.lastMessage.status !== 'read')

  const summaryCards = [
    { label:'Upcoming Visits',      value:String(overview.counts.upcomingVisits), sub: overview.upcomingVisits[0] ? `Next: ${overview.upcomingVisits[0].date}${overview.upcomingVisits[0].time?' · '+overview.upcomingVisits[0].time:''}` : 'None scheduled', color:C.primary, icon:I.calendar },
    { label:'Active Care Requests', value:String(overview.counts.activeRequests), sub: overview.counts.activeRequests>0 ? 'In progress' : 'None right now', color:C.accent, icon:I.requests },
    { label:'Unread Messages',      value:String(unreadConvos.length), sub: unreadConvos.length>0 ? `${unreadConvos.length} conversation${unreadConvos.length===1?'':'s'}` : 'All caught up', color:'#3B82F6', icon:I.messages },
    { label:'Pending Payments',     value:`LKR ${paymentsData.summary.outstanding.toLocaleString()}`, sub: paymentsData.summary.openInvoices>0 ? `${paymentsData.summary.openInvoices} invoice${paymentsData.summary.openInvoices===1?'':'s'}` : 'Nothing due', color:C.warning, icon:I.payments },
    { label:'Beneficiaries',        value:String(people.length), sub: people.length>0 ? 'In your care' : 'None added yet', color:C.success, icon:I.beneficiaries },
  ]

  const quickActions = [
    { label:'Create Care Request',  icon:I.requests,      color:C.primary,  onClick:()=>navigate('/request/new') },
    { label:'Manage Beneficiaries', icon:I.beneficiaries, color:'#8B5CF6',  onClick:()=>navigate('/beneficiaries') },
    { label:'Find Care Agents',     icon:I.agents,        color:C.accent,   onClick:()=>navigate('/browse-agents') },
    { label:'View Care Requests',   icon:I.check,         color:C.success,  onClick:()=>onNav('requests') },
    { label:'View Payments',        icon:I.payments,      color:C.warning,  onClick:()=>onNav('payments') },
    { label:'Contact Support',      icon:I.support,       color:'#3B82F6',  onClick:()=>onNav('support') },
  ]

  const requests = overview.requests

  const [visitDay, setVisitDay] = useState<'today'|'tomorrow'|'week'>('today')
  const now = new Date()
  const todayIso = now.toISOString().slice(0,10)
  const tomorrowIso = new Date(now.getTime()+86400000).toISOString().slice(0,10)
  const weekAheadIso = new Date(now.getTime()+7*86400000).toISOString().slice(0,10)
  const visitsForDay = (overview.upcomingVisits as any[]).filter(v => {
    if (!v.date) return false
    if (visitDay==='today') return v.date===todayIso
    if (visitDay==='tomorrow') return v.date===tomorrowIso
    return v.date>todayIso && v.date<=weekAheadIso
  })

  const notifications = overview.notifications

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
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.70)', fontWeight:600, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>{todayLabel}</p>
            <h2 style={{ fontSize:26, fontWeight:900, color:'#fff', letterSpacing:'-0.02em', lineHeight:1.2, marginBottom:8 }}>
              Good Morning, {overview.fullName.split(' ')[0]}
            </h2>
            <p style={{ fontSize:14, color:'rgba(255,255,255,0.80)', lineHeight:1.6, maxWidth:400 }}>
              {people.length>0
                ? `Everything you need to manage ${people[0].name}${people.length>1?` and ${people.length-1} other${people.length>2?'s':''}`:''}'s care, right here.`
                : 'Add a beneficiary to start managing their care, right here.'}
            </p>
            <div style={{ display:'flex', gap:10, marginTop:20, flexWrap:'wrap' }}>
              <button onClick={()=>navigate('/request/new')} style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 18px', borderRadius:10, border:'none', background:'#fff', cursor:'pointer', color:C.primary, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', boxShadow:'0 2px 8px rgba(0,0,0,0.15)' }}>
                {I.plus} Create Care Request
              </button>
              <button onClick={()=>navigate('/browse-agents')} style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 18px', borderRadius:10, border:'1.5px solid rgba(255,255,255,0.40)', background:'rgba(255,255,255,0.12)', cursor:'pointer', color:'#fff', fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', backdropFilter:'blur(12px)' }}>
                {I.agents} Browse Care Agents
              </button>
            </div>
          </div>
          {/* Mini stats — real, per-client counts */}
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            {[
              { label:'Upcoming Visits', value:String(overview.counts.upcomingVisits) },
              { label:'Care Agents', value:String(myAgents.length) },
              { label:'Beneficiaries', value:String(people.length) },
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
            <button key={a.label} onClick={a.onClick} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, padding:'16px 8px', borderRadius:14, border:`1px solid ${C.border}`, background:'#FAFAFA', cursor:'pointer', transition:'all 0.15s', fontFamily:'Manrope,sans-serif' }}
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
            <button onClick={()=>onNav('requests')} style={{ fontSize:12, fontWeight:700, color:C.primary, background:'none', border:'none', cursor:'pointer', fontFamily:'Manrope,sans-serif' }}>View all {I.arrowR}</button>
          </div>
          <div>
            {requests.length===0 && (
              <p style={{ padding:'20px', fontSize:13, color:C.muted, textAlign:'center' }}>No care requests yet.</p>
            )}
            {requests.map((r: any, i: number) => (
              <div key={r.id} onClick={()=>navigate(`/negotiate/${r.id}`)} style={{ padding:'14px 20px', borderBottom: i < requests.length - 1 ? `1px solid ${C.border}` : 'none', display:'flex', alignItems:'center', gap:14, cursor:'pointer', transition:'background 0.15s' }}
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
                <span style={{ color:C.muted, flexShrink:0, display:'flex' }}>{I.chevronR}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Visits */}
        <Card style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'18px 20px', borderBottom:`1px solid ${C.border}` }}>
            <h3 style={{ fontSize:14, fontWeight:800, color:C.type }}>Upcoming Visits</h3>
          </div>
          {/* Day tabs */}
          <div style={{ display:'flex', borderBottom:`1px solid ${C.border}` }}>
            {([['today','Today'],['tomorrow','Tomorrow'],['week','This Week']] as const).map(([k,l]) => (
              <button key={k} onClick={()=>setVisitDay(k)} style={{ flex:1, padding:'9px 4px', border:'none', background: visitDay===k ? `${C.primary}0F` : 'transparent', color: visitDay===k ? C.primary : C.muted, fontSize:12, fontWeight: visitDay===k ? 700 : 500, cursor:'pointer', borderBottom: visitDay===k ? `2px solid ${C.primary}` : '2px solid transparent', fontFamily:'Manrope,sans-serif' }}>{l}</button>
            ))}
          </div>
          <div>
            {visitsForDay.length===0 && (
              <p style={{ padding:'20px', fontSize:13, color:C.muted, textAlign:'center' }}>No visits scheduled.</p>
            )}
            {visitsForDay.map((v: any, i: number) => (
              <div key={v.id} style={{ padding:'14px 20px', borderBottom: i<visitsForDay.length-1 ? `1px solid ${C.border}` : 'none', display:'flex', gap:12, alignItems:'flex-start' }}>
                <div style={{ textAlign:'center', width:54, flexShrink:0 }}>
                  <p style={{ fontSize:13, fontWeight:800, color:C.primary }}>{v.time || '—'}</p>
                  <div style={{ width:2, height:24, background:`${C.primary}30`, margin:'4px auto' }} />
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:3 }}>{v.title}</p>
                  <p style={{ fontSize:11, color:C.muted }}>{v.agent}</p>
                  <div style={{ display:'flex', gap:6, marginTop:6 }}>
                    <Badge label={v.status==='confirmed'?'Confirmed':'Assigned'} color={C.success} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 3-col: Activity + Notifications + Messages */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px 320px', gap:20 }} className="three-col-grid">
        {/* Activity timeline — no dedicated activity-log table exists yet
            (see Notifications for the closest real equivalent), so this
            stays an honest placeholder rather than fabricated events. */}
        <Card style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'18px 20px', borderBottom:`1px solid ${C.border}` }}>
            <h3 style={{ fontSize:14, fontWeight:800, color:C.type }}>Recent Activity</h3>
          </div>
          <div style={{ padding:'32px 20px', textAlign:'center' }}>
            <p style={{ fontSize:13, color:C.muted, lineHeight:1.6 }}>A detailed activity log isn't available yet. Check Notifications for recent updates.</p>
          </div>
        </Card>

        {/* Notifications */}
        <Card style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'18px 20px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <h3 style={{ fontSize:14, fontWeight:800, color:C.type }}>Notifications</h3>
            <button onClick={()=>onNav('notifications')} style={{ fontSize:12, fontWeight:700, color:C.primary, background:'none', border:'none', cursor:'pointer', fontFamily:'Manrope,sans-serif' }}>View all</button>
          </div>
          <div>
            {notifications.length===0 && (
              <p style={{ padding:'20px', fontSize:13, color:C.muted, textAlign:'center' }}>No notifications yet.</p>
            )}
            {notifications.map((n: any, i: number) => (
              <div key={n.id ?? i} onClick={()=>n.unread && n.id && onMarkNotifRead(n.id)} style={{ padding:'12px 16px', borderBottom: i < notifications.length-1 ? `1px solid ${C.border}` : 'none', background: n.unread ? `${n.color}05` : 'transparent', cursor: n.unread ? 'pointer' : 'default', transition:'background 0.15s' }}>
                <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                  {n.unread && <div style={{ width:7, height:7, borderRadius:'50%', background:n.color, marginTop:5, flexShrink:0 }} />}
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:12, fontWeight: n.unread ? 700 : 600, color:C.type, marginBottom:2 }}>{n.title}</p>
                    <p style={{ fontSize:11, color:C.muted, lineHeight:1.5 }}>{n.detail}</p>
                    <p style={{ fontSize:10, color:C.muted, marginTop:4 }}>{formatRelTime(n.time)}</p>
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
            <button onClick={()=>onNav('messages')} style={{ fontSize:12, fontWeight:700, color:C.primary, background:'none', border:'none', cursor:'pointer', fontFamily:'Manrope,sans-serif' }}>View all</button>
          </div>
          <div>
            {conversations.length===0 && (
              <p style={{ padding:'20px', fontSize:13, color:C.muted, textAlign:'center' }}>No conversations yet.</p>
            )}
            {conversations.slice(0,4).map((c, i, arr) => {
              const other = c.otherParticipants?.[0]
              const name = other?.preferred_name?.trim() || other?.full_name?.trim() || 'Conversation'
              const last = c.lastMessage ? (c.lastMessage.deleted ? 'Message deleted' : (c.lastMessage.text || 'Sent an attachment')) : 'No messages yet'
              const unread = c.lastMessage && c.lastMessage.sender_id !== clientId && c.lastMessage.status !== 'read'
              return (
                <div key={c.id} onClick={()=>onNav('messages')} style={{ padding:'12px 16px', borderBottom: i < arr.length-1 ? `1px solid ${C.border}` : 'none', cursor:'pointer', display:'flex', gap:10, alignItems:'flex-start', transition:'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <Avatar name={name} src={other?.avatar_url} size={36} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
                      <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{name}</p>
                      <span style={{ fontSize:10, color:C.muted }}>{formatRelTime(c.lastMessage?.created_at ?? c.created_at)}</span>
                    </div>
                    <p style={{ fontSize:11, color:C.muted, lineHeight:1.4, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{last}</p>
                  </div>
                  {unread && <span style={{ width:8, height:8, borderRadius:'50%', background:C.accent, flexShrink:0, marginTop:4 }} />}
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Your Care Agents (agents from confirmed/completed bookings — not a
          fabricated "recommendation", since there is no matching algorithm) */}
      <Card style={{ padding:0, overflow:'hidden' }}>
        <div style={{ padding:'18px 20px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <h3 style={{ fontSize:14, fontWeight:800, color:C.type }}>Your Care Agents</h3>
          <button onClick={()=>onNav('agents')} style={{ fontSize:12, fontWeight:700, color:C.primary, background:'none', border:'none', cursor:'pointer', fontFamily:'Manrope,sans-serif' }}>View all</button>
        </div>
        {myAgents.length===0 ? (
          <div style={{ padding:'32px 20px', textAlign:'center' }}>
            <p style={{ fontSize:13, color:C.muted, marginBottom:12 }}>You haven't hired a care agent yet.</p>
            <button onClick={()=>navigate('/browse-agents')} style={{ padding:'8px 18px', borderRadius:10, border:`1.5px solid ${C.primary}`, background:'transparent', cursor:'pointer', color:C.primary, fontSize:12, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>Browse Care Agents</button>
          </div>
        ) : (
          <div style={{ padding:20, display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }} className="agents-grid">
            {myAgents.slice(0,4).map((a: any) => (
              <Card key={a.id} hover style={{ padding:18, border:`1px solid ${C.border}` }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                  <Avatar name={a.name} size={42} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:13, fontWeight:700, color:C.type, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{a.name}</p>
                    <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:2 }}>
                      {I.starFill}
                      <span style={{ fontSize:12, fontWeight:700, color:C.type }}>{a.rating || '—'}</span>
                      <span style={{ fontSize:11, color:C.muted }}>({a.jobs} jobs)</span>
                    </div>
                  </div>
                  <span style={{ width:8, height:8, borderRadius:'50%', background: a.avail ? C.success : C.muted, flexShrink:0 }} />
                </div>
                <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:12 }}>
                  {a.langs.map((l:string) => <Badge key={l} label={l} color={C.sub} bg="#F2F4F5" />)}
                </div>
                <button onClick={()=>navigate(`/agents/${a.id}`)} style={{ width:'100%', padding:'8px', borderRadius:10, border:`1.5px solid ${C.primary}`, background:'transparent', cursor:'pointer', color:C.primary, fontSize:12, fontWeight:700, fontFamily:'Manrope,sans-serif', transition:'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.primary; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.primary }}>
                  View Profile
                </button>
              </Card>
            ))}
          </div>
        )}
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
              { label:'Outstanding',   value:`LKR ${paymentsData.summary.outstanding.toLocaleString()}`, color:C.warning, icon:I.warning },
              { label:'Wallet Balance', value:`LKR ${paymentsData.summary.walletBalance.toLocaleString()}`, color:C.success, icon:I.wallet },
              { label:'Paid',          value:`LKR ${paymentsData.summary.paid.toLocaleString()}`, color:C.primary, icon:I.check },
              { label:'Open Invoices', value:String(paymentsData.summary.openInvoices), color:'#3B82F6', icon:I.doc },
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
            <button onClick={()=>onNav('payments')} style={{ width:'100%', padding:'9px', borderRadius:10, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', color:C.sub, fontSize:12, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>View Payment History →</button>
          </div>
        </Card>

        {/* Support */}
        <Card style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'18px 20px', borderBottom:`1px solid ${C.border}` }}>
            <h3 style={{ fontSize:14, fontWeight:800, color:C.type }}>Support</h3>
          </div>
          <div style={{ padding:20, display:'flex', flexDirection:'column', gap:10 }}>
            {([
              { icon:I.chat,      label:'Live Chat',        sub:'Open a support ticket',  color:C.primary,  onClick:()=>onNav('support') },
              { icon:I.support,   label:'Help Centre',      sub:'Open the Support tab',   color:'#3B82F6',  onClick:()=>onNav('support') },
              { icon:I.doc,       label:'My Tickets',       sub:'View ticket status',     color:C.accent,   onClick:()=>onNav('support') },
            ]).map(s => (
              <button key={s.label} onClick={s.onClick} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderRadius:12, border:`1px solid ${C.border}`, background:'#FAFAFA', cursor:'pointer', transition:'all 0.15s', width:'100%', textAlign:'left', fontFamily:'Manrope,sans-serif' }}
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
            <a href="tel:+94112345678" style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderRadius:12, border:`1px solid ${C.border}`, background:'#FAFAFA', transition:'all 0.15s', width:'100%', textAlign:'left', fontFamily:'Manrope,sans-serif', textDecoration:'none', boxSizing:'border-box' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.error; e.currentTarget.style.background = `${C.error}06` }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = '#FAFAFA' }}>
              <div style={{ width:36, height:36, borderRadius:10, background:`${C.error}12`, display:'flex', alignItems:'center', justifyContent:'center', color:C.error, flexShrink:0 }}>{I.phone}</div>
              <div>
                <p style={{ fontSize:13, fontWeight:700, color:C.type }}>Emergency Hotline</p>
                <p style={{ fontSize:11, color:C.muted }}>+94 11 234 5678</p>
              </div>
              <span style={{ marginLeft:'auto', color:C.muted }}>{I.arrowR}</span>
            </a>
          </div>
        </Card>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// CARE REQUESTS PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function RequestsPage({ allRequests, loading }: { allRequests: any[]; loading: boolean }) {
  const navigate = useNavigate()
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
        <button onClick={() => navigate('/request/new')} style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 18px', borderRadius:12, border:'none', background:C.primary, cursor:'pointer', color:'#fff', fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', boxShadow:`0 2px 8px ${C.primary}30` }}>
          {I.plus} Create Request
        </button>
      </div>

      {loading ? (
        <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:14 }}>
          {[1,2,3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <>
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

          {filtered.length > 0 && (
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
                      <tr key={r.id} onClick={() => navigate(`/negotiate/${r.id}`)} style={{ borderBottom: i < filtered.length-1 ? `1px solid ${C.border}` : 'none', cursor:'pointer', transition:'background 0.15s' }}
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
                          <button onClick={e => { e.stopPropagation(); navigate(`/negotiate/${r.id}`) }} style={{ padding:'5px 12px', borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', fontSize:12, fontWeight:600, color:C.sub, fontFamily:'Manrope,sans-serif' }}>View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Empty state */}
          {filtered.length === 0 && (
            <Card style={{ padding:60, textAlign:'center' }}>
              <div style={{ width:72, height:72, borderRadius:'50%', background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', color:C.primary }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="4" y="4" width="24" height="24" rx="4" stroke="currentColor" strokeWidth="1.8"/><path d="M16 10v12M10 16h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              </div>
              <h3 style={{ fontSize:16, fontWeight:800, color:C.type, marginBottom:6 }}>{allRequests.length===0 ? 'No care requests yet' : 'No requests found'}</h3>
              <p style={{ fontSize:13, color:C.muted, marginBottom:20 }}>{allRequests.length===0 ? 'Create your first care request to get started.' : 'No care requests match the selected filter.'}</p>
              {allRequests.length===0 ? (
                <button onClick={() => navigate('/request/new')} style={{ padding:'9px 18px', borderRadius:10, border:'none', background:C.primary, cursor:'pointer', fontSize:13, fontWeight:700, color:'#fff', fontFamily:'Manrope,sans-serif' }}>Create Care Request</button>
              ) : (
                <button onClick={() => setFilter('all')} style={{ padding:'9px 18px', borderRadius:10, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', fontSize:13, fontWeight:700, color:C.sub, fontFamily:'Manrope,sans-serif' }}>Clear filter</button>
              )}
            </Card>
          )}
        </>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// BENEFICIARIES PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function BeneficiariesPage({ people, loading }: { people: any[]; loading: boolean }) {
  const navigate = useNavigate()
  // careStatus is a real value computed by getBeneficiariesFull() from the
  // beneficiary's bookings — there is no separate "health" column/status.
  const careStatusColor: Record<string,string> = { 'In Progress':C.primary, 'Completed':C.success, 'Cancelled':C.error, 'Open Request':C.muted }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:900, color:C.type, letterSpacing:'-0.02em' }}>Beneficiaries</h2>
          <p style={{ fontSize:13, color:C.muted, marginTop:2 }}>Manage elderly parents and loved ones in your care</p>
        </div>
        <button onClick={() => navigate('/beneficiaries?add=1')} style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 18px', borderRadius:12, border:'none', background:C.primary, cursor:'pointer', color:'#fff', fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>
          {I.plus} Add Beneficiary
        </button>
      </div>

      {loading ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:18 }} className="bene-grid">
          {[1,2,3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:18 }} className="bene-grid">
          {people.map(p => (
            <Card key={p.id} hover style={{ padding:0, overflow:'hidden' }}>
              <div style={{ height:6, background: p.status === 'active' ? `linear-gradient(90deg,${C.primary},#00959E)` : C.border }} />
              <div style={{ padding:22 }}>
                <div style={{ display:'flex', gap:14, alignItems:'flex-start', marginBottom:16 }}>
                  <Avatar name={p.name} size={52} />
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:15, fontWeight:800, color:C.type }}>{p.name}</p>
                    <p style={{ fontSize:12, color:C.muted, marginTop:2 }}>Age {p.age || '—'} · {p.city || '—'}</p>
                    <div style={{ marginTop:6 }}>
                      <Badge label={p.careStatus} color={careStatusColor[p.careStatus] ?? C.muted} />
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
                    <span style={{ fontSize:12, color:C.muted, lineHeight:1.5 }}>{p.medNotes || 'No notes yet'}</span>
                  </div>
                </div>
                <button onClick={() => navigate(`/beneficiaries?id=${p.id}`)} style={{ width:'100%', padding:'8px', borderRadius:10, border:'none', background:`${C.primary}10`, cursor:'pointer', color:C.primary, fontSize:12, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>View Details</button>
              </div>
            </Card>
          ))}

          {/* Empty add card */}
          <Card hover onClick={() => navigate('/beneficiaries?add=1')} style={{ padding:40, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', border:`1.5px dashed ${C.border}`, cursor:'pointer' }}>
            <div style={{ width:48, height:48, borderRadius:'50%', background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary, marginBottom:12 }}>{I.plus}</div>
            <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:4 }}>Add Beneficiary</p>
            <p style={{ fontSize:12, color:C.muted }}>Register another loved one</p>
          </Card>
        </div>
      )}
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
// Real conversation display fields, derived from the shape getMyConversations()
// actually returns (id, otherParticipants[], lastMessage, created_at) — the
// conversations table itself has no per-conversation display name/time/role
// for a direct chat, so these must be computed rather than read directly.
function convoName(c: any): string {
  const other = c.otherParticipants?.[0]
  return other?.preferred_name?.trim() || other?.full_name?.trim() || c.name || 'Conversation'
}
function convoRole(c: any): string {
  const role = c.otherParticipants?.[0]?.role
  return role === 'agent' ? 'Care Agent' : role === 'admin' ? 'Support' : role || ''
}
function convoLastText(c: any): string {
  const m = c.lastMessage
  if (!m) return 'No messages yet'
  if (m.deleted) return 'Message deleted'
  return m.text || 'Sent an attachment'
}

function MessagesPage({ conversations, clientId }: { conversations: any[]; clientId: string }) {
  const [active, setActive] = useState(0)
  const [msg, setMsg] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [sendError, setSendError] = useState('')
  const filtered = search.trim()
    ? conversations.filter(c => convoName(c).toLowerCase().includes(search.trim().toLowerCase()))
    : conversations
  const convo = filtered[active] ?? filtered[0]

  useEffect(() => {
    if (!convo) { setMessages([]); return }
    getConversationMessages(convo.id).then(setMessages).catch(console.error)
  }, [convo?.id])

  const handleSend = async () => {
    if (!msg.trim() || !convo) return
    const text = msg
    setMsg('')
    setSendError('')
    try {
      await sendMessage(convo.id, text)
      const updated = await getConversationMessages(convo.id)
      setMessages(updated)
    } catch (err: any) {
      console.error('Failed to send message:', err)
      setSendError(err?.message || "Couldn't send your message. Please try again.")
      setMsg(text)
    }
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
            <input value={search} onChange={e => { setSearch(e.target.value); setActive(0) }} placeholder="Search messages" style={{ width:'100%', padding:'8px 12px 8px 30px', borderRadius:10, border:`1px solid ${C.border}`, fontSize:13, fontFamily:'Manrope,sans-serif', color:C.type, outline:'none', background:'#FAFAFA' }} />
          </div>
        </div>
        {filtered.length === 0 && <p style={{ padding:20, fontSize:12, color:C.muted, textAlign:'center' }}>No matching conversations.</p>}
        {filtered.map((c, i) => {
          const other = c.otherParticipants?.[0]
          const unread = c.lastMessage && c.lastMessage.sender_id !== clientId && c.lastMessage.status !== 'read'
          return (
            <button key={c.id} onClick={() => setActive(i)} style={{ display:'flex', gap:12, padding:'14px 16px', borderBottom:`1px solid ${C.border}`, background: active===i ? `${C.primary}08` : 'transparent', cursor:'pointer', border:'none', borderLeft: active===i ? `3px solid ${C.primary}` : '3px solid transparent', textAlign:'left', transition:'all 0.15s' }}>
              <Avatar name={convoName(c)} src={other?.avatar_url} size={38} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                  <span style={{ fontSize:13, fontWeight:700, color:C.type }}>{convoName(c)}</span>
                  <span style={{ fontSize:10, color:C.muted }}>{formatRelTime(c.lastMessage?.created_at ?? c.created_at)}</span>
                </div>
                <p style={{ fontSize:12, color:C.muted, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{convoLastText(c)}</p>
              </div>
              {unread && <span style={{ width:8, height:8, borderRadius:'50%', background:C.accent, flexShrink:0, marginTop:5 }} />}
            </button>
          )
        })}
      </div>
      {convo ? (
        <div style={{ flex:1, display:'flex', flexDirection:'column' }}>
          <div style={{ padding:'14px 20px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:12 }}>
            <Avatar name={convoName(convo)} src={convo.otherParticipants?.[0]?.avatar_url} size={36} />
            <div><p style={{ fontSize:14, fontWeight:800, color:C.type }}>{convoName(convo)}</p><p style={{ fontSize:11, color:C.muted }}>{convoRole(convo)}</p></div>
          </div>
          <div style={{ flex:1, overflowY:'auto', padding:20, display:'flex', flexDirection:'column', gap:12 }}>
            {messages.length === 0 && <p style={{ textAlign:'center', color:C.muted, fontSize:13 }}>No messages yet — say hello!</p>}
            {messages.map((m: any) => {
              const mine = m.sender_id === clientId
              return (
                <div key={m.id} style={{ display:'flex', justifyContent: mine ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth:'70%', padding:'10px 14px', borderRadius: mine ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: mine ? C.primary : '#F2F4F5', color: mine ? '#fff' : C.type }}>
                    <p style={{ fontSize:13, lineHeight:1.55, fontFamily:'Manrope,sans-serif' }}>{m.deleted ? 'Message deleted' : m.text}</p>
                    <p style={{ fontSize:10, marginTop:4, opacity:0.65, textAlign:'right' }}>{m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }) : ''}</p>
                  </div>
                </div>
              )
            })}
          </div>
          <div style={{ padding:'12px 20px', borderTop:`1px solid ${C.border}` }}>
            {sendError && <p style={{ fontSize:11, color:C.error, marginBottom:8 }}>{sendError}</p>}
            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
              <input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Type a message…"
                onKeyDown={e => { if (e.key === 'Enter' && msg.trim()) handleSend() }}
                style={{ flex:1, padding:'10px 14px', borderRadius:12, border:`1.5px solid ${C.border}`, fontSize:13, fontFamily:'Manrope,sans-serif', color:C.type, outline:'none' }} />
              <button onClick={handleSend} disabled={!msg.trim()} style={{ width:40, height:40, borderRadius:12, border:'none', background:C.primary, cursor: msg.trim() ? 'pointer' : 'not-allowed', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', opacity: msg.trim() ? 1 : 0.5 }}>{I.send}</button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', color:C.muted, fontSize:13 }}>Select a conversation</div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// NOTIFICATIONS PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function NotificationsPage({ notifs, loading, onMarkRead, onMarkAllRead }: { notifs: any[]; loading: boolean; onMarkRead:(id:string)=>void; onMarkAllRead:()=>void }) {
  const typeColor: Record<string,string> = { request:C.primary, visit:C.accent, payment:C.warning, review:C.info, task:C.success, system:C.muted }
  const hasUnread = notifs.some(n => n.unread)

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:900, color:C.type, letterSpacing:'-0.02em' }}>Notifications</h2>
          <p style={{ fontSize:13, color:C.muted, marginTop:2 }}>Stay up to date with care activity</p>
        </div>
        <button onClick={onMarkAllRead} disabled={!hasUnread} style={{ fontSize:12, fontWeight:700, color: hasUnread ? C.primary : C.muted, background:'none', border:'none', cursor: hasUnread ? 'pointer' : 'default', fontFamily:'Manrope,sans-serif' }}>Mark all as read</button>
      </div>
      {loading ? (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>{[1,2,3].map(i => <SkeletonCard key={i} />)}</div>
      ) : (
        <Card style={{ padding:0, overflow:'hidden' }}>
          {notifs.length === 0 && (
            <div style={{ padding:'40px 20px', textAlign:'center', color:C.muted, fontSize:13 }}>
              No notifications yet.
            </div>
          )}
          {notifs.map((n, i) => (
            <div key={n.id ?? i} onClick={() => n.unread && n.id && onMarkRead(n.id)} style={{ display:'flex', gap:12, padding:'16px 20px', borderBottom: i < notifs.length-1 ? `1px solid ${C.border}` : 'none', background: n.unread ? `${typeColor[n.type]}04` : 'transparent', cursor: n.unread ? 'pointer' : 'default', transition:'background 0.15s' }}
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
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENTS PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function AgentsPage({ agents, loading }: { agents: any[]; loading: boolean }) {
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

      {loading ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {[1,2,3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns: view==='grid' ? 'repeat(3,1fr)' : '1fr', gap:16 }} className="agents-grid-page">
          {agents.length === 0 && (
            <div style={{ gridColumn:'1/-1', padding:'40px 20px', textAlign:'center', color:C.muted, fontSize:13 }}>
              No agents yet — hire someone through a care request to see them here.
            </div>
          )}
          {agents.map((a: any) => (
            <Card key={a.id} hover style={{ padding:20 }}>
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
                  <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:C.muted }}>{I.pin} {a.loc}</span>
                </div>
                {a.avail && <Badge label="Available" color={C.success} />}
              </div>
              <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:12 }}>
                {a.langs.map((l: any) => <Badge key={l} label={l} color={C.sub} bg="#F2F4F5" />)}
                {a.services.slice(0,2).map((s: any) => <Badge key={s} label={s} color={C.primary} />)}
              </div>
              <button onClick={() => navigate(`/agents/${a.id}`)} style={{ width:'100%', padding:'8px', borderRadius:10, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', color:C.type, fontSize:12, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>View Profile</button>
            </Card>
          ))}
        </div>
      )}
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
// SUPPORT PAGE
// ═══════════════════════════════════════════════════════════════════════════════
// Real support_tickets rows for the authenticated user (getMySupportTickets),
// and real ticket creation (createSupportTicket) — both already backed by
// the support_tickets table used elsewhere in the app.
function SupportPage({ tickets, loading, loadError, onTicketCreated }: {
  tickets: any[]; loading: boolean; loadError: string; onTicketCreated: (t: any) => void
}) {
  const [subject, setSubject] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const ticketStatusMeta: Record<string,{label:string;color:string}> = {
    open:        { label:'Open',        color:C.info },
    in_progress: { label:'In Progress', color:C.warning },
    resolved:    { label:'Resolved',    color:C.success },
    closed:      { label:'Closed',      color:C.muted },
  }

  const submit = async () => {
    if (!subject.trim() || submitting) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const ticket = await createSupportTicket(subject.trim())
      onTicketCreated(ticket)
      setSubject('')
    } catch (err: any) {
      console.error('Failed to create support ticket:', err)
      setSubmitError(err?.message || "Couldn't submit your ticket. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, letterSpacing:'-0.02em' }}>Support</h2>
        <p style={{ fontSize:13, color:C.muted, marginTop:2 }}>Get help or track your support requests</p>
      </div>

      <Card style={{ padding:22 }}>
        <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:12 }}>New Support Ticket</h3>
        <textarea value={subject} onChange={e => setSubject(e.target.value)} rows={3} placeholder="Describe what you need help with…"
          style={{ width:'100%', padding:'10px 14px', borderRadius:12, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, outline:'none', resize:'vertical', background:'#FAFAFA', boxSizing:'border-box' }} />
        {submitError && <p style={{ fontSize:11, color:C.error, marginTop:8 }}>{submitError}</p>}
        <div style={{ marginTop:12 }}>
          <button onClick={submit} disabled={!subject.trim() || submitting} style={{ padding:'9px 18px', borderRadius:10, border:'none', background: subject.trim() && !submitting ? C.primary : '#C8D0D4', cursor: subject.trim() && !submitting ? 'pointer' : 'not-allowed', color:'#fff', fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>
            {submitting ? 'Submitting…' : 'Submit Ticket'}
          </button>
        </div>
      </Card>

      <Card style={{ padding:0, overflow:'hidden' }}>
        <div style={{ padding:'18px 20px', borderBottom:`1px solid ${C.border}` }}>
          <h3 style={{ fontSize:14, fontWeight:800, color:C.type }}>Your Tickets</h3>
        </div>
        {loading ? (
          <div style={{ padding:20, display:'flex', flexDirection:'column', gap:10 }}>{[1,2].map(i => <SkeletonCard key={i} />)}</div>
        ) : loadError ? (
          <p style={{ padding:'20px 20px', fontSize:13, color:C.error }}>{loadError}</p>
        ) : tickets.length === 0 ? (
          <p style={{ padding:'40px 20px', textAlign:'center', color:C.muted, fontSize:13 }}>No support tickets yet.</p>
        ) : (
          tickets.map((t: any, i: number) => {
            const meta = ticketStatusMeta[t.status] ?? { label: t.status, color: C.muted }
            return (
              <div key={t.id} style={{ padding:'14px 20px', borderBottom: i < tickets.length-1 ? `1px solid ${C.border}` : 'none' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, marginBottom:4 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{t.subject}</p>
                  <Badge label={meta.label} color={meta.color} />
                </div>
                <p style={{ fontSize:11, color:C.muted }}>{t.created_at ? new Date(t.created_at).toLocaleString() : ''}</p>
              </div>
            )
          })
        )}
      </Card>

      <Card style={{ padding:22 }}>
        <a href="tel:+94112345678" style={{ display:'flex', alignItems:'center', gap:12, textDecoration:'none' }}>
          <div style={{ width:36, height:36, borderRadius:10, background:`${C.error}12`, display:'flex', alignItems:'center', justifyContent:'center', color:C.error, flexShrink:0 }}>{I.phone}</div>
          <div>
            <p style={{ fontSize:13, fontWeight:700, color:C.type }}>Emergency Hotline</p>
            <p style={{ fontSize:11, color:C.muted }}>+94 11 234 5678</p>
          </div>
        </a>
      </Card>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function ClientDashboard() {
  const navigate = useNavigate()
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
  const [profile, setProfile] = useState<any>(null)
  const [supportTickets, setSupportTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [loggingOut, setLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState('')

  useEffect(() => {
    let cancelled = false
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        if (!cancelled) setLoading(false)
        return
      }
      if (cancelled) return
      setClientId(data.user.id)
      const results = await Promise.allSettled([
        getCurrentProfile(),
        getDashboardOverview(data.user.id),
        getAllCareRequests(data.user.id),
        getBeneficiariesFull(data.user.id),
        getAllNotifications(data.user.id),
        getPaymentsData(data.user.id),
        getMyReviews(data.user.id),
        getMyAgents(data.user.id),
        getMyConversations(),
        getMySupportTickets(),
      ])
      if (cancelled) return
      const [profileR, overviewR, requestsR, peopleR, notifsR, paymentsR, reviewsR, agentsR, convosR, ticketsR] = results
      if (profileR.status === 'fulfilled') setProfile(profileR.value)
      if (overviewR.status === 'fulfilled') setOverview(overviewR.value)
      if (requestsR.status === 'fulfilled') setAllRequests(requestsR.value)
      if (peopleR.status === 'fulfilled') setPeople((peopleR.value as any[]).filter((p: any) => p.status !== 'archived'))
      if (notifsR.status === 'fulfilled') setNotifs(notifsR.value)
      if (paymentsR.status === 'fulfilled') setPaymentsData(paymentsR.value)
      if (reviewsR.status === 'fulfilled') setReviews(reviewsR.value)
      if (agentsR.status === 'fulfilled') setMyAgents(agentsR.value)
      if (convosR.status === 'fulfilled') setConversations(convosR.value)
      if (ticketsR.status === 'fulfilled') setSupportTickets(ticketsR.value)
      const failed = results.filter(r => r.status === 'rejected') as PromiseRejectedResult[]
      if (failed.length > 0) {
        failed.forEach(r => console.error('Dashboard data load failed:', r.reason))
        setLoadError("Some information couldn't be loaded. Try refreshing the page.")
      }
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [])

  const setPage2 = (p: DashPage) => { setPage(p); setMobileNav(false); window.scrollTo({ top:0, behavior:'smooth' }) }

  const markNotifRead = async (id: string) => {
    const target = notifs.find((n: any) => n.id === id)
    if (!target || !target.unread) return
    setNotifs(list => list.map((n: any) => n.id === id ? { ...n, unread:false } : n))
    setOverview((o: any) => o ? { ...o, notifications: o.notifications.map((n: any) => n.id === id ? { ...n, unread:false } : n) } : o)
    try {
      await markNotificationRead(id)
    } catch (err) {
      console.error('Failed to mark notification as read:', err)
      setNotifs(list => list.map((n: any) => n.id === id ? { ...n, unread:true } : n))
      setOverview((o: any) => o ? { ...o, notifications: o.notifications.map((n: any) => n.id === id ? { ...n, unread:true } : n) } : o)
    }
  }

  const markAllNotifsRead = async () => {
    if (!notifs.some((n: any) => n.unread)) return
    const prevNotifs = notifs
    const prevOverview = overview
    setNotifs(list => list.map((n: any) => ({ ...n, unread:false })))
    setOverview((o: any) => o ? { ...o, notifications: o.notifications.map((n: any) => ({ ...n, unread:false })) } : o)
    try {
      await markAllNotificationsRead()
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err)
      setNotifs(prevNotifs)
      setOverview(prevOverview)
    }
  }

  const handleLogout = async () => {
    if (loggingOut) return
    setLoggingOut(true)
    setLogoutError('')
    const { error } = await supabase.auth.signOut()
    if (error) {
      setLoggingOut(false)
      setLogoutError(error.message || "Couldn't log out. Please try again.")
      return
    }
    navigate('/auth?mode=login', { replace: true })
  }

  const unreadConvoCount = conversations.filter((c: any) => c.lastMessage && c.lastMessage.sender_id !== clientId && c.lastMessage.status !== 'read').length
  const unreadNotifCount = notifs.filter((n: any) => n.unread).length
  const navBadges: NavBadges = {
    requests: overview?.counts?.activeRequests ?? 0,
    messages: unreadConvoCount,
    notifications: unreadNotifCount,
  }
  const profileName = profile?.full_name?.trim() || 'Client'

  const renderPage = () => {
    switch (page) {
      case 'overview':
        return overview ? (
          <OverviewPage overview={overview} people={people} paymentsData={paymentsData} myAgents={myAgents}
            conversations={conversations} clientId={clientId} onNav={setPage2} onMarkNotifRead={markNotifRead} />
        ) : loading ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>{[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}</div>
        ) : (
          <p style={{ padding:32, color:C.muted, fontSize:13 }}>We couldn't load your dashboard. Please try refreshing the page.</p>
        )
      case 'requests':      return <RequestsPage allRequests={allRequests} loading={loading} />
      case 'beneficiaries': return <BeneficiariesPage people={people} loading={loading} />
      case 'agents':        return <AgentsPage agents={myAgents} loading={loading} />
      case 'messages':      return <MessagesPage conversations={conversations} clientId={clientId} />
      case 'notifications': return <NotificationsPage notifs={notifs} loading={loading} onMarkRead={markNotifRead} onMarkAllRead={markAllNotifsRead} />
      case 'payments':      return <PaymentsPage data={paymentsData} />
      case 'reviews':       return <ReviewsPage reviews={reviews} />
      case 'support':       return <SupportPage tickets={supportTickets} loading={loading} loadError={loadError} onTicketCreated={t => setSupportTickets(list => [t, ...list])} />
      case 'settings':      return <AccountSettings embedded onProfileUpdated={fields => setProfile((p: any) => ({ ...p, ...fields }))} />
      default:              return <PlaceholderPage page={page} />
    }
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:C.bg, fontFamily:'Manrope,sans-serif' }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar active={page} setActive={setPage2} collapsed={collapsed} setCollapsed={setCollapsed}
          badges={navBadges} profileName={profileName} avatarUrl={profile?.avatar_url} onLogout={handleLogout} loggingOut={loggingOut} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileNav && (
        <div style={{ position:'fixed', inset:0, zIndex:100 }}>
          <div onClick={() => setMobileNav(false)} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.40)', backdropFilter:'blur(2px)' }} />
          <div style={{ position:'absolute', left:0, top:0, bottom:0, width:240, zIndex:101 }}>
            <Sidebar active={page} setActive={setPage2} collapsed={false} setCollapsed={() => setMobileNav(false)}
              badges={navBadges} profileName={profileName} avatarUrl={profile?.avatar_url} onLogout={handleLogout} loggingOut={loggingOut} />
          </div>
        </div>
      )}

      {/* Main */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        <TopNav page={page} onMenuClick={() => setMobileNav(true)} notifCount={unreadNotifCount} msgCount={unreadConvoCount}
          onNotif={() => setPage2('notifications')} onMsg={() => setPage2('messages')} onNewRequest={() => navigate('/request/new')}
          profileName={profileName} avatarUrl={profile?.avatar_url} />
        <main style={{ flex:1, padding:'24px 24px 80px', maxWidth:1400, width:'100%', margin:'0 auto', boxSizing:'border-box' }}>
          {logoutError && <p style={{ fontSize:12, color:C.error, marginBottom:12 }}>{logoutError}</p>}
          {loadError && (
            <div style={{ padding:'10px 16px', borderRadius:10, background:`${C.warning}10`, border:`1px solid ${C.warning}30`, marginBottom:16, fontSize:12, color:C.warning, fontWeight:600 }}>
              {loadError}
            </div>
          )}
          <div key={page} className="page-enter">
            {renderPage()}
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav active={page} setActive={setPage2} badges={navBadges} onFab={() => navigate('/request/new')} />
    </div>
  )
}
