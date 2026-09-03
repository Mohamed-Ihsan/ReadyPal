import { useState, useEffect, type ReactNode, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import {
  getCurrentUser,
  getMyProfile,
  updateProfile,
  getMyAgentDetails,
  getMyAgentSkills,
  getMyCertifications,
  getMyIdentityDocuments,
  getMyBankAccount,
  getMyAvailability,
  saveMyAvailability,
  getMyEquipmentTransport,
  getMyReferences,
  getMyAgreements,
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getMyApplications,
} from '../lib/api'
import { computeOnboardingCompletion, type OnboardingStepStatus } from '../lib/onboardingCompletion'

// ─── Brand ────────────────────────────────────────────────────────────────────
const C = {
  primary:'#00737A', accent:'#EE8153', type:'#2C3E43', sub:'#6B7E85',
  muted:'#9AAAB0', border:'#E4E8EA', bg:'#F2F4F5', surface:'#FFFFFF',
  success:'#22C55E', warning:'#F59E0B', error:'#EF4444', info:'#3B82F6',
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const I: Record<string,ReactNode> = {
  bell:     <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v.8A5 5 0 0 1 13 7.8v3.5l1 1.7H2l1-1.7V7.8A5 5 0 0 1 8 2.8V2M6.5 13.5a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  msg:      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 2.5H3a1.5 1.5 0 0 0-1.5 1.5v7A1.5 1.5 0 0 0 3 12.5h2l3 2 3-2h2a1.5 1.5 0 0 0 1.5-1.5V4A1.5 1.5 0 0 0 13 2.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  check:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5l3 3 6-6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevR:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l5 4-5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  clock:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/><path d="M7 4.5V7.2l1.8 1.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  pin:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1a3.5 3.5 0 0 1 3.5 3.5c0 2.5-3.5 7-3.5 7S3 7 3 4.5A3.5 3.5 0 0 1 6.5 1z" stroke="currentColor" strokeWidth="1.2"/><circle cx="6.5" cy="4.5" r="1.2" fill="currentColor"/></svg>,
  star:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1l1.6 3.3L12 5l-2.75 2.68.65 3.79L6.5 9.82 3.1 11.47l.65-3.79L1 5l3.9-.7L6.5 1z" fill="currentColor"/></svg>,
  trending: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1.5 10l3.5-3.5 3 3L12 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M9.5 5h2.5v2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  wallet:   <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="3" width="12" height="9.5" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M1 6h12" stroke="currentColor" strokeWidth="1.2"/><circle cx="10.5" cy="8.5" r="1" fill="currentColor"/></svg>,
  calendar: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="2.5" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 6h11M5 1.5v2M9 1.5v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  user:     <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5" r="2.8" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 12c0-3.04 2.46-5.5 5.5-5.5S12.5 8.96 12.5 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  phone:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 2.5l2-1 1.5 2.5-1 1a7 7 0 0 0 3.5 3.5l1-1 2.5 1.5-1 2C8 12 1 5 2 2.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  map:      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1.5 2.5l4 1.5 3-2 4 2v7.5l-4-2-3 2-4-1.5V2.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M5.5 4V11M8.5 2.5v7" stroke="currentColor" strokeWidth="1.1"/></svg>,
  edit:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M9.5 1.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  play:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M3 2l9 4.5-9 4.5V2z" fill="currentColor"/></svg>,
  stop:     <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="2" y="2" width="8" height="8" rx="1.5" fill="currentColor"/></svg>,
  refresh:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M11.5 6.5a5 5 0 1 1-1.1-3.1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M11.5 3v2.5H9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  warning:  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5L1.5 12h11L7 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M7 6v2.5M7 10.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  sos:      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/><path d="M5.5 6.5a2.5 2 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5M8 12v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  close:    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  trophy:   <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 1.5h4v5a2 2 0 0 1-4 0v-5zM2 2.5h3v3a3 3 0 0 1-3-3zM12 2.5H9v3a3 3 0 0 0 3-3z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/><path d="M7 8.5v2.5M5 12.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  target:   <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.1"/><circle cx="7" cy="7" r=".8" fill="currentColor"/></svg>,
  shield:   <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5l5 1.8v3.8C12 10.8 9.5 13 7 14 4.5 13 2 10.8 2 7.1V3.3L7 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  settings: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M7 1.5v1.5M7 11v1.5M1.5 7h1.5M11 7h1.5M2.8 2.8l1.1 1.1M10.1 10.1l1.1 1.1M10.1 3.9L11.2 2.8M2.8 11.2l1.1-1.1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  logout:   <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M6 13H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 10.5L13.5 7 10 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.5 7H5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
}

// ─── Primitives ───────────────────────────────────────────────────────────────
function Card({ children, style={}, hover=false, onClick }:{ children:ReactNode; style?:CSSProperties; hover?:boolean; onClick?:()=>void }) {
  const [h,setH] = useState(false)
  return (
    <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ background:C.surface, borderRadius:16, border:`1px solid ${h&&hover?C.primary+'40':C.border}`, boxShadow:h&&hover?'0 8px 28px rgba(44,62,67,0.10)':'0 1px 4px rgba(44,62,67,0.06)', transition:'all 0.18s', transform:h&&hover?'translateY(-1px)':undefined, cursor:onClick?'pointer':undefined, ...style }}>
      {children}
    </div>
  )
}

function Btn({ label, icon, onClick, variant='primary', small=false, disabled=false }:{ label:string; icon?:ReactNode; onClick?:()=>void; variant?:'primary'|'secondary'|'ghost'|'danger'|'accent'|'success'; small?:boolean; disabled?:boolean }) {
  const [h,setH] = useState(false)
  const vs: Record<string,CSSProperties> = {
    primary:   { background:disabled?'#C8D0D4':h?'#005D63':C.primary, color:'#fff', border:'none', boxShadow:disabled?'none':h?`0 4px 16px ${C.primary}50`:`0 2px 8px ${C.primary}30` },
    secondary: { background:h?'#EEF5F5':'#fff', color:C.primary, border:`1.5px solid ${h?C.primary:C.border}` },
    ghost:     { background:h?C.bg:'transparent', color:C.sub, border:'none' },
    danger:    { background:h?'#DC2626':C.error, color:'#fff', border:'none' },
    accent:    { background:h?'#D4663D':C.accent, color:'#fff', border:'none', boxShadow:h?`0 4px 16px ${C.accent}50`:`0 2px 8px ${C.accent}30` },
    success:   { background:h?'#16A34A':C.success, color:'#fff', border:'none', boxShadow:h?`0 4px 16px ${C.success}50`:`0 2px 8px ${C.success}30` },
  }
  return (
    <button onClick={disabled?undefined:onClick} disabled={disabled} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:small?'7px 16px':'10px 20px', borderRadius:10, cursor:disabled?'not-allowed':'pointer', fontFamily:'Manrope,sans-serif', fontSize:small?12:13, fontWeight:700, transition:'all 0.15s', ...vs[variant] }}>
      {icon&&<span style={{display:'flex'}}>{icon}</span>}{label}
    </button>
  )
}

function Toggle({ on, onToggle, size='md' }:{ on:boolean; onToggle:()=>void; size?:'sm'|'md'|'lg' }) {
  const dims = { sm:{w:36,h:20,d:14,on:18,off:3}, md:{w:46,h:26,d:18,on:25,off:3}, lg:{w:56,h:32,d:24,on:29,off:4} }[size]
  return (
    <button onClick={onToggle} style={{ width:dims.w, height:dims.h, borderRadius:99, border:'none', cursor:'pointer', background:on?C.primary:C.border, position:'relative', transition:'background 0.2s', flexShrink:0 }}>
      <div style={{ width:dims.d, height:dims.d, borderRadius:'50%', background:'#fff', position:'absolute', top:(dims.h-dims.d)/2, left:on?dims.on:dims.off, transition:'left 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.2)' }} />
    </button>
  )
}

function Bdg({ label, color=C.primary, dot=false }:{ label:string; color?:string; dot?:boolean }) {
  return <span style={{ display:'inline-flex', alignItems:'center', gap:dot?5:0, padding:'3px 10px', borderRadius:999, fontSize:11, fontWeight:700, background:`${color}12`, color }}>
    {dot&&<div style={{width:6,height:6,borderRadius:'50%',background:color}}/>}{label}
  </span>
}

function Avatar({ initials='', color=C.primary, size=40 }:{ initials?:string; color?:string; size?:number }) {
  return <div style={{ width:size, height:size, borderRadius:'50%', background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:size*0.28, color, fontFamily:'Manrope,sans-serif', flexShrink:0 }}>{initials}</div>
}

// Derives display initials from a real full name — never a fabricated
// placeholder. "Kavindu Kavishka" -> "KK"; single-word names use their
// first two letters; empty/missing names return '' (safe neutral fallback,
// Avatar just renders a blank circle).
function getInitials(fullName?:string|null): string {
  const trimmed = (fullName ?? '').trim()
  if(!trimmed) return ''
  const parts = trimmed.split(/\s+/).filter(Boolean)
  if(parts.length === 1) return parts[0].slice(0,2).toUpperCase()
  return (parts[0][0] + parts[parts.length-1][0]).toUpperCase()
}

// Relative time for real notification timestamps (created_at), mirroring
// the same formatting already proven in BrowseJobs.tsx.
function formatRelativeTime(iso:string|null|undefined):string {
  if(!iso) return ''
  const then = new Date(iso).getTime()
  if(Number.isNaN(then)) return ''
  const minutes = Math.round((Date.now()-then)/60000)
  if(minutes<1) return 'Just now'
  if(minutes<60) return `${minutes} min ago`
  const hours = Math.round(minutes/60)
  if(hours<24) return `${hours} hr${hours===1?'':'s'} ago`
  const days = Math.round(hours/24)
  if(days<7) return `${days} day${days===1?'':'s'} ago`
  return new Date(iso).toLocaleDateString('en-GB',{ day:'numeric', month:'short', year:'numeric' })
}

// Best-effort icon/color per notification `type` — the real enum isn't
// confirmed against every possible value, so this stays a small map with a
// safe generic fallback rather than assuming, matching BrowseJobs.tsx.
const NOTIF_TYPE_META: Record<string,{ icon:string; color:string }> = {
  new_job:            { icon:'💼', color:C.accent },
  application_viewed: { icon:'👁', color:C.primary },
  shortlisted:        { icon:'🏆', color:C.warning },
  counter_offer:       { icon:'💰', color:C.info },
  application_accepted:{ icon:'✅', color:C.success },
  job_closed:          { icon:'❌', color:C.error },
}
function notifTypeMeta(type:string) {
  return NOTIF_TYPE_META[type] ?? { icon:'🔔', color:C.primary }
}

function KPICard({ label, value, sub, trend, icon, color=C.primary, accent=false }:{ label:string; value:string; sub?:string; trend?:string; icon:ReactNode; color?:string; accent?:boolean }) {
  const [h,setH] = useState(false)
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ background:accent?`linear-gradient(135deg,${color},${color}CC)`:C.surface, borderRadius:16, border:`1px solid ${h?color+'40':C.border}`, padding:'20px', boxShadow:h?'0 8px 28px rgba(44,62,67,0.12)':'0 1px 4px rgba(44,62,67,0.06)', transition:'all 0.18s', transform:h?'translateY(-2px)':undefined }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
        <p style={{ fontSize:12, fontWeight:700, color:accent?'rgba(255,255,255,0.7)':C.muted }}>{label}</p>
        <div style={{ width:34, height:34, borderRadius:10, background:accent?'rgba(255,255,255,0.2)':color+'12', display:'flex', alignItems:'center', justifyContent:'center', color:accent?'#fff':color }}>
          <span style={{display:'flex'}}>{icon}</span>
        </div>
      </div>
      <p style={{ fontSize:24, fontWeight:900, color:accent?'#fff':C.type, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:5 }}>{value}</p>
      {sub&&<p style={{ fontSize:11, color:accent?'rgba(255,255,255,0.65)':C.muted }}>{sub}</p>}
      {trend&&<p style={{ fontSize:11, fontWeight:700, color:accent?'rgba(255,255,255,0.85)':C.success, marginTop:4 }}>{trend}</p>}
    </div>
  )
}

function SectionTitle({ title, action, onAction }:{ title:string; action?:string; onAction?:()=>void }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
      <h3 style={{ fontSize:15, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>{title}</h3>
      {action&&<button onClick={onAction} style={{ fontSize:12, fontWeight:700, color:C.primary, background:'none', border:'none', cursor:'pointer', fontFamily:'Manrope,sans-serif', display:'flex', alignItems:'center', gap:3 }}>{action}<span style={{display:'flex'}}>{I.chevR}</span></button>}
    </div>
  )
}

function SuccessToast({ msg }:{ msg:string }) {
  return (
    <div style={{ position:'fixed', bottom:28, left:'50%', transform:'translateX(-50%)', zIndex:999, display:'flex', alignItems:'center', gap:10, padding:'12px 22px', borderRadius:14, background:C.type, color:'#fff', fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:700, boxShadow:'0 8px 28px rgba(0,0,0,0.22)', pointerEvents:'none', whiteSpace:'nowrap' as const }}>
      <span style={{display:'flex',color:C.success}}>{I.check}</span>{msg}
    </div>
  )
}

// ─── Live clock ───────────────────────────────────────────────────────────────
function LiveClock() {
  const [now,setNow] = useState(new Date())
  useEffect(()=>{ const t=setInterval(()=>setNow(new Date()),1000); return ()=>clearInterval(t) },[])
  const time = now.toLocaleTimeString('en-LK',{hour:'2-digit',minute:'2-digit'})
  const date = now.toLocaleDateString('en-LK',{weekday:'long',day:'numeric',month:'long'})
  return (
    <div style={{ textAlign:'right' as const }}>
      <p style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', lineHeight:1 }}>{time}</p>
      <p style={{ fontSize:11, color:C.muted }}>{date}</p>
    </div>
  )
}

// ─── Status badge pill ────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  online:    { color:C.success, label:'Online',    dot:true },
  offline:   { color:C.muted,   label:'Offline',   dot:true },
  busy:      { color:C.warning, label:'Busy',      dot:true },
  break:     { color:C.accent,  label:'On Break',  dot:true },
  emergency: { color:C.error,   label:'Emergency', dot:true },
  vacation:  { color:C.info,    label:'Vacation',  dot:true },
} as const
type Status = keyof typeof STATUS_CONFIG

// ─── Scheduled jobs (real data) ────────────────────────────────────────────────
// A `ScheduledJob` is a UI-shaped projection of a real `applications` row
// joined to its `care_requests` row (see getMyApplications in lib/api.ts).
// There is no `active`/`upcoming` application-status distinction in the
// database yet, so a job is only ever labelled by its scheduled date
// (Today / Upcoming / Date to be confirmed) — never a fabricated progress
// state.
type ScheduledJob = {
  id: string
  title: string
  service: string
  client: string
  beneficiary: string
  time: string
  duration: string
  location: string
  amount: number | null
  currency: string
  scheduledDate: string | null
}

function formatTimeLabel(time?: string | null): string {
  if(!time) return ''
  const [hStr, mStr] = time.split(':')
  const h = Number(hStr)
  if(Number.isNaN(h)) return time
  const period = h>=12 ? 'PM' : 'AM'
  const h12 = h%12===0 ? 12 : h%12
  return `${h12}:${(mStr??'00').slice(0,2)} ${period}`
}

function scheduledJobFromApplication(a:any): ScheduledJob {
  const cr = a.care_request ?? {}
  const amount = a.price ?? a.original_price ?? null
  return {
    id: a.id,
    title: cr.title ?? cr.service_type ?? 'Care job',
    service: cr.service_type ?? cr.title ?? 'Care Service',
    client: cr.client?.full_name ?? 'Client',
    beneficiary: cr.beneficiary?.preferred_name ?? cr.beneficiary?.name ?? '',
    time: formatTimeLabel(cr.scheduled_time),
    duration: cr.duration ?? a.duration ?? '',
    location: [cr.address1, cr.address2].filter(Boolean).join(', ') || cr.city || '',
    amount,
    currency: cr.currency ?? 'LKR',
    scheduledDate: cr.scheduled_date ?? null,
  }
}

function isSameDate(iso: string | null, date: Date): boolean {
  if(!iso) return false
  const d = new Date(iso)
  return d.getFullYear()===date.getFullYear() && d.getMonth()===date.getMonth() && d.getDate()===date.getDate()
}

const INVITATIONS = [
  { id:'I001', client:'Chamari Dissanayake', beneficiary:'Siripala Dissanayake', service:'Post-Surgery Care', date:'Tomorrow, 9 AM', location:'Malay Street, Colombo 02', amount:5500, distance:'3.2 km', timer:'2h 14m remaining' },
  { id:'I002', client:'Fathima Rasheed',     beneficiary:'Hassan Rasheed',       service:'Wheelchair Assistance',date:'Sat 18 Jan, 10 AM',location:'Lady Ridgeway Hospital',    amount:2800, distance:'5.8 km', timer:'18h remaining' },
]

const MESSAGES = [
  { name:'Mohamed Ihsan',     initials:'MI', msg:'Thank you for today! Will you be available next week?', time:'11:30 AM', unread:2 },
  { name:'Priya Fernando',    initials:'PF', msg:"Please arrive 10 minutes early if possible.",           time:'Yesterday', unread:0 },
  { name:'Arjuna Wijesinghe', initials:'AW', msg:"Job confirmed for 5:30 PM.",                           time:'Mon',       unread:0 },
]

// ─── Dashboard Home ───────────────────────────────────────────────────────────
function DashboardHome({ status, setStatus, onNav, onToast, agentName, agentInitials, agentSubtitle, notifications, notifLoading, notifError, onMarkNotifRead, todaysJobs, jobsLoading, jobsError }:{
  status:Status; setStatus:(s:Status)=>void; onNav:(s:SubView)=>void; onToast:(m:string)=>void
  agentName:string; agentInitials:string; agentSubtitle:string
  notifications:any[]; notifLoading:boolean; notifError:string; onMarkNotifRead:(id:string)=>void
  todaysJobs:ScheduledJob[]; jobsLoading:boolean; jobsError:string
}) {
  const [online, setOnline] = useState(true)
  // Monthly Earnings, Average Rating, and Completion Rate have no backing
  // Supabase table/status lifecycle yet (see Phase 1B audit) — rather than
  // fabricate numbers, those three KPI cards show an honest "coming soon"
  // placeholder. Today's Jobs is real, from getMyApplications().
  const kpis = [
    { label:"Today's Jobs",     value:jobsLoading?'…':String(todaysJobs.length), sub:jobsLoading?'Loading…':jobsError?'Could not load':`${todaysJobs.length} job${todaysJobs.length===1?'':'s'} scheduled`, icon:I.calendar, color:C.primary, accent:true },
    { label:'Monthly Earnings', value:'—', sub:'Earnings tracking coming soon', icon:I.wallet,  color:C.success },
    { label:'Average Rating',   value:'—', sub:'Reviews coming soon',           icon:I.star,     color:C.warning },
    { label:'Completion Rate',  value:'—', sub:'Coming soon',                   icon:I.target,   color:C.info },
  ]
  const quickActions = [
    { icon:I.calendar,label:'My Schedule',   k:'schedule'   as SubView },
    { icon:I.wallet,  label:'Earnings',      k:'earnings'   as SubView },
    { icon:I.map,     label:'Service Areas', k:'serviceAreas'as SubView },
    { icon:I.shield,  label:'Performance',   k:'performance'as SubView },
    { icon:I.user,    label:'Profile',       k:'profile'    as SubView },
    { icon:I.trophy,  label:'Achievements',  k:'goals'      as SubView },
  ]

  return (
    <div style={{ padding:'24px 28px 60px' }}>
      {/* Header */}
      <Card style={{ padding:'20px 24px', marginBottom:20, background:`linear-gradient(135deg,${C.primary},#00959E,#007A82)`, border:'none', boxShadow:`0 8px 28px ${C.primary}30` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap' as const, gap:16 }}>
          <div style={{ display:'flex', gap:14, alignItems:'center' }}>
            <div style={{ position:'relative' as const }}>
              <div style={{ width:52, height:52, borderRadius:'50%', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:20, color:'#fff', fontFamily:'Manrope,sans-serif' }}>{agentInitials}</div>
              <div style={{ position:'absolute', bottom:1, right:1, width:13, height:13, borderRadius:'50%', background:online?C.success:C.muted, border:'2px solid #fff' }} />
            </div>
            <div>
              <p style={{ fontSize:13, color:'rgba(255,255,255,0.7)', marginBottom:2 }}>Good morning 👋</p>
              <h2 style={{ fontSize:20, fontWeight:900, color:'#fff', fontFamily:'Manrope,sans-serif', marginBottom:4 }}>{agentName}</h2>
              <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' as const }}>
                <span style={{ padding:'3px 10px', borderRadius:99, background:'rgba(255,255,255,0.2)', fontSize:11, fontWeight:700, color:'#fff' }}>{STATUS_CONFIG[status].label}</span>
                <span style={{ fontSize:11, color:'rgba(255,255,255,0.65)' }}>{agentSubtitle}</span>
              </div>
            </div>
          </div>
          <div style={{ display:'flex', gap:16, alignItems:'center', flexWrap:'wrap' as const }}>
            <div>
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.6)', marginBottom:4, textAlign:'right' as const }}>Availability</p>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <p style={{ fontSize:12, fontWeight:700, color:online?'rgba(255,255,255,0.9)':'rgba(255,255,255,0.45)' }}>{online?'Online':'Offline'}</p>
                <Toggle on={online} onToggle={()=>{ setOnline(v=>!v); onToast(online?'Status set to Offline':'Status set to Online'); setStatus(online?'offline':'online') }} size="md" />
              </div>
            </div>
            <div style={{ textAlign:'right' as const }}>
              <LiveClock />
            </div>
          </div>
        </div>
      </Card>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }} className="cad-4col">
        {kpis.map((k,i)=><KPICard key={i} {...k} />)}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:18, marginBottom:18 }} className="cad-main-split">
        {/* Today's schedule */}
        <div>
          <Card style={{ padding:22, marginBottom:14 }}>
            <SectionTitle title="Today's Schedule" action="Full Calendar" onAction={()=>onNav('calendar')} />
            {jobsLoading ? (
              <p style={{ fontSize:12, color:C.muted, padding:'8px 0' }}>Loading today's schedule…</p>
            ) : jobsError ? (
              <p style={{ fontSize:12, color:C.error, padding:'8px 0' }}>{jobsError}</p>
            ) : todaysJobs.length===0 ? (
              <p style={{ fontSize:12, color:C.muted, padding:'8px 0' }}>No jobs scheduled for today.</p>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                {todaysJobs.map((job,i)=>(
                  <div key={job.id} style={{ display:'flex', gap:14, paddingBottom:i<todaysJobs.length-1?16:0 }}>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                      <div style={{ width:10, height:10, borderRadius:'50%', background:C.info, border:`2px solid ${C.info}`, marginTop:4 }} />
                      {i<todaysJobs.length-1&&<div style={{ width:2, flex:1, background:C.border, margin:'4px 0' }} />}
                    </div>
                    <div style={{ flex:1, paddingBottom:i<todaysJobs.length-1?6:0 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
                        <div>
                          <div style={{ display:'flex', gap:7, alignItems:'center', marginBottom:2 }}>
                            <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{job.service}</p>
                          </div>
                          <p style={{ fontSize:11, color:C.muted }}>{[job.time, job.duration, job.client].filter(Boolean).join(' · ')}</p>
                          {job.location&&<div style={{ display:'flex', gap:4, alignItems:'center', marginTop:2 }}>
                            <span style={{color:C.muted,display:'flex',transform:'scale(0.85)'}}>{I.pin}</span>
                            <p style={{ fontSize:11, color:C.muted }}>{job.location}</p>
                          </div>}
                        </div>
                        <div style={{ textAlign:'right' as const, flexShrink:0 }}>
                          {job.amount!=null&&<p style={{ fontSize:12, fontWeight:800, color:C.success, fontFamily:'Manrope,sans-serif' }}>{job.currency} {job.amount.toLocaleString()}</p>}
                        </div>
                      </div>
                      <div style={{ display:'flex', gap:8 }}>
                        <Btn label="View Details" variant="secondary" small onClick={()=>onNav('schedule')} />
                        <Btn label="Navigate" variant="ghost" small icon={I.pin} onClick={()=>onToast('Opening maps…')} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Active task tracking depends on an application-status lifecycle
              (accepted/in-progress/completed) that doesn't exist in the
              database yet — see Phase 1B audit. Rather than fabricate a
              live task/checklist, this stays an honest coming-soon note. */}
          <Card style={{ padding:22, background:`linear-gradient(135deg,${C.primary}06,${C.primary}02)`, border:`1.5px solid ${C.primary}20` }}>
            <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:10 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:C.muted }} />
              <p style={{ fontSize:12, fontWeight:800, color:C.primary, textTransform:'uppercase' as const, letterSpacing:'0.07em' }}>Active Task</p>
            </div>
            <p style={{ fontSize:13, color:C.sub, lineHeight:1.6 }}>Live task tracking (checklists, time remaining) will appear here once a job is in progress. This feature is coming soon.</p>
          </Card>
        </div>

        {/* Right column */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Invitations */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Job Invitations" action={`View All (${INVITATIONS.length})`} onAction={()=>onNav('invitations')} />
            {INVITATIONS.map((inv,i)=>(
              <div key={inv.id} style={{ padding:'14px 0', borderBottom:i<INVITATIONS.length-1?`1px solid ${C.border}`:'none' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <div>
                    <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:2 }}>{inv.service}</p>
                    <p style={{ fontSize:11, color:C.muted }}>{inv.client} · {inv.date}</p>
                  </div>
                  <div style={{ textAlign:'right' as const }}>
                    <p style={{ fontSize:13, fontWeight:900, color:C.success, fontFamily:'Manrope,sans-serif' }}>LKR {inv.amount.toLocaleString()}</p>
                    <p style={{ fontSize:10, color:C.muted }}>{inv.distance}</p>
                  </div>
                </div>
                <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:8 }}>
                  <span style={{ color:C.muted, display:'flex', transform:'scale(0.85)' }}>{I.clock}</span>
                  <p style={{ fontSize:11, color:C.warning, fontWeight:700 }}>{inv.timer}</p>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <Btn label="Accept" variant="success" small onClick={()=>onToast('Job accepted!')} />
                  <Btn label="Decline" variant="ghost" small onClick={()=>onToast('Invitation declined')} />
                </div>
              </div>
            ))}
          </Card>

          {/* Messages */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Messages" action="Open All" onAction={()=>onNav('messages')} />
            {MESSAGES.map((m,i)=>(
              <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', padding:'9px 0', borderBottom:i<MESSAGES.length-1?`1px solid ${C.border}`:'none', cursor:'pointer' }} onClick={()=>onNav('messages')}>
                <div style={{ position:'relative' as const }}>
                  <Avatar initials={m.initials} size={36} />
                  {m.unread>0&&<div style={{ position:'absolute', top:-2, right:-2, width:16, height:16, borderRadius:'50%', background:C.error, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:900, color:'#fff', fontFamily:'Manrope,sans-serif' }}>{m.unread}</div>}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
                    <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{m.name}</p>
                    <p style={{ fontSize:10, color:C.muted, whiteSpace:'nowrap' as const }}>{m.time}</p>
                  </div>
                  <p style={{ fontSize:11, color:C.muted, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as const }}>{m.msg}</p>
                </div>
              </div>
            ))}
          </Card>

          {/* Quick actions */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Quick Actions" />
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
              {quickActions.map(a=>(
                <button key={a.k} onClick={()=>onNav(a.k)}
                  style={{ padding:'12px 8px', borderRadius:12, border:`1.5px solid ${C.border}`, background:'#FAFAFA', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:6, fontFamily:'Manrope,sans-serif', fontSize:10, fontWeight:700, color:C.sub, transition:'all 0.12s' }}
                  onMouseOver={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor=C.primary;(e.currentTarget as HTMLButtonElement).style.color=C.primary}}
                  onMouseOut={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor=C.border;(e.currentTarget as HTMLButtonElement).style.color=C.sub}}>
                  <div style={{ width:32, height:32, borderRadius:10, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary }}>
                    <span style={{display:'flex'}}>{a.icon}</span>
                  </div>
                  {a.label}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Performance + Notifications row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }} className="cad-2col">
        <Card style={{ padding:22 }}>
          <SectionTitle title="Performance Snapshot" action="Full Analytics" onAction={()=>onNav('performance')} />
          {[
            { label:'Completion Rate', value:'98%',  bar:0.98, color:C.success },
            { label:'Response Time',   value:'8 min', bar:0.88, color:C.primary },
            { label:'Acceptance Rate', value:'92%',  bar:0.92, color:C.info },
            { label:'Repeat Clients',  value:'64%',  bar:0.64, color:C.accent },
          ].map((p,i)=>(
            <div key={i} style={{ marginBottom:i<3?12:0 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                <p style={{ fontSize:12, color:C.sub }}>{p.label}</p>
                <p style={{ fontSize:12, fontWeight:800, color:p.color }}>{p.value}</p>
              </div>
              <div style={{ height:5, borderRadius:99, background:C.bg, overflow:'hidden' }}>
                <div style={{ width:`${p.bar*100}%`, height:'100%', background:p.color, borderRadius:99, transition:'width 0.6s' }} />
              </div>
            </div>
          ))}
        </Card>

        <Card style={{ padding:22 }}>
          <SectionTitle title="Notifications" action="View All" onAction={()=>onNav('notifications')} />
          {notifLoading ? (
            <p style={{ fontSize:12, color:C.muted, padding:'8px 0' }}>Loading notifications…</p>
          ) : notifError ? (
            <p style={{ fontSize:12, color:C.error, padding:'8px 0' }}>{notifError}</p>
          ) : notifications.length===0 ? (
            <p style={{ fontSize:12, color:C.muted, padding:'8px 0' }}>You're all caught up — no notifications yet.</p>
          ) : notifications.slice(0,4).map((n:any,i:number,arr:any[])=>{
            const meta = notifTypeMeta(n.type)
            return (
              <div key={n.id} onClick={n.read?undefined:()=>onMarkNotifRead(n.id)} style={{ display:'flex', gap:10, alignItems:'flex-start', padding:'8px 0', borderBottom:i<arr.length-1?`1px solid ${C.border}`:'none', cursor:n.read?'default':'pointer' }}>
                <div style={{ width:32, height:32, borderRadius:10, background:`${meta.color}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, flexShrink:0 }}>{meta.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
                    <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{n.title}</p>
                    {!n.read&&<div style={{ width:7, height:7, borderRadius:'50%', background:meta.color, marginTop:2, flexShrink:0 }} />}
                  </div>
                  <p style={{ fontSize:11, color:C.muted }}>{n.body}</p>
                </div>
              </div>
            )
          })}
        </Card>
      </div>
    </div>
  )
}

// ─── Today's Schedule ─────────────────────────────────────────────────────────
function Schedule({ onToast, jobs, loading, error }:{ onToast:(m:string)=>void; jobs:ScheduledJob[]; loading:boolean; error:string }) {
  const todayLabel = new Date().toLocaleDateString('en-GB',{ weekday:'long', day:'numeric', month:'long', year:'numeric' })
  return (
    <div style={{ padding:'28px 32px 60px', maxWidth:800 }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Today's Schedule</h2>
      <p style={{ fontSize:13, color:C.muted, marginBottom:24 }}>{todayLabel} · {loading?'Loading…':`${jobs.length} job${jobs.length===1?'':'s'} scheduled`}</p>
      {loading ? (
        <p style={{ fontSize:13, color:C.muted }}>Loading your schedule…</p>
      ) : error ? (
        <p style={{ fontSize:13, color:C.error }}>{error}</p>
      ) : jobs.length===0 ? (
        <Card style={{ padding:'40px 24px', textAlign:'center' as const }}>
          <div style={{ fontSize:36, marginBottom:10 }}>📅</div>
          <p style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:6 }}>No Jobs Today</p>
          <p style={{ fontSize:12, color:C.muted }}>You have no jobs scheduled for today.</p>
        </Card>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {jobs.map((job)=>(
            <Card key={job.id} style={{ padding:24 }}>
              <div style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
                <div style={{ flexShrink:0, textAlign:'center' as const, width:52 }}>
                  <p style={{ fontSize:14, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>{job.time ? job.time.split(' ')[0] : '—'}</p>
                  <p style={{ fontSize:10, color:C.muted }}>{job.time.split(' ')[1] ?? ''}</p>
                </div>
                <div style={{ width:1, alignSelf:'stretch', background:C.border, flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                    <div>
                      <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                        <h3 style={{ fontSize:15, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{job.service}</h3>
                      </div>
                      <p style={{ fontSize:12, color:C.muted }}>{[job.duration, job.client, job.beneficiary].filter(Boolean).join(' · ')}</p>
                    </div>
                    {job.amount!=null&&<p style={{ fontSize:14, fontWeight:900, color:C.success, fontFamily:'Manrope,sans-serif' }}>{job.currency} {job.amount.toLocaleString()}</p>}
                  </div>
                  <div style={{ display:'flex', gap:14, marginBottom:14, flexWrap:'wrap' as const }}>
                    {job.location&&<div style={{ display:'flex', gap:5, alignItems:'center' }}>
                      <span style={{color:C.muted,display:'flex',transform:'scale(0.85)'}}>{I.pin}</span>
                      <p style={{ fontSize:12, color:C.sub }}>{job.location}</p>
                    </div>}
                    {job.time&&<div style={{ display:'flex', gap:5, alignItems:'center' }}>
                      <span style={{color:C.muted,display:'flex'}}>{I.clock}</span>
                      <p style={{ fontSize:12, color:C.sub }}>{job.time}</p>
                    </div>}
                  </div>
                  <div style={{ display:'flex', gap:8 }}>
                    <Btn label="Navigate" variant="ghost" small icon={I.pin} onClick={()=>onToast('Opening navigation…')} />
                    <Btn label="Call Client" variant="ghost" small icon={I.phone} onClick={()=>onToast('Calling client…')} />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Active Task ──────────────────────────────────────────────────────────────
function ActiveTask({ onToast }:{ onToast:(m:string)=>void }) {
  const [taskStep, setTaskStep] = useState<'ready'|'active'|'done'>('active')
  const checks = [
    { l:'Arrived at client home',         done:true },
    { l:'Beneficiary collected & seated', done:true },
    { l:'Arrived at Colombo National Hospital', done:true },
    { l:'Registration desk attended',     done:false },
    { l:'Doctor consultation complete',   done:false },
    { l:'Medication prescription collected', done:false },
    { l:'Client returned home safely',    done:false },
  ]
  const donePct = Math.round((checks.filter(c=>c.done).length/checks.length)*100)
  return (
    <div style={{ padding:'28px 32px 60px', maxWidth:700 }}>
      <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:20 }}>
        <div style={{ width:10, height:10, borderRadius:'50%', background:C.primary }} />
        <p style={{ fontSize:12, fontWeight:800, color:C.primary, textTransform:'uppercase' as const, letterSpacing:'0.07em' }}>Active Task · {taskStep==='done'?'Complete':'In Progress'}</p>
      </div>
      <Card style={{ padding:28, background:`linear-gradient(135deg,${C.primary}06,${C.surface})`, border:`2px solid ${C.primary}20`, marginBottom:18 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
          <div>
            <h2 style={{ fontSize:24, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Hospital Appointment</h2>
            <div style={{ display:'flex', gap:14, flexWrap:'wrap' as const }}>
              <p style={{ fontSize:13, color:C.muted }}>Beneficiary: <strong style={{color:C.type}}>Nimal Perera</strong></p>
              <p style={{ fontSize:13, color:C.muted }}>Client: <strong style={{color:C.type}}>Mohamed Ihsan</strong></p>
              <p style={{ fontSize:13, color:C.muted }}>Job #J001</p>
            </div>
          </div>
          {taskStep==='active'&&(
            <div style={{ textAlign:'right' as const }}>
              <p style={{ fontSize:11, color:C.muted }}>Time remaining</p>
              <p style={{ fontSize:32, fontWeight:900, color:C.primary, fontFamily:'Manrope,sans-serif', lineHeight:1 }}>1:42</p>
              <p style={{ fontSize:11, color:C.muted }}>hrs</p>
            </div>
          )}
        </div>
        <div style={{ marginBottom:16 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
            <p style={{ fontSize:12, fontWeight:700, color:C.muted }}>Task Progress</p>
            <p style={{ fontSize:13, fontWeight:900, color:C.primary, fontFamily:'Manrope,sans-serif' }}>{donePct}%</p>
          </div>
          <div style={{ height:8, borderRadius:99, background:`${C.primary}12`, overflow:'hidden' }}>
            <div style={{ width:`${donePct}%`, height:'100%', background:`linear-gradient(90deg,${C.primary},${C.success})`, borderRadius:99, transition:'width 0.5s' }} />
          </div>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          {taskStep==='active'&&<Btn label="Pause Task" variant="secondary" icon={I.stop} onClick={()=>{ setTaskStep('ready'); onToast('Task paused') }} />}
          {taskStep==='ready'&&<Btn label="Resume Task" variant="primary" icon={I.play} onClick={()=>{ setTaskStep('active'); onToast('Task resumed') }} />}
          {taskStep==='active'&&<Btn label="Complete Task" variant="success" onClick={()=>{ setTaskStep('done'); onToast('Task completed! 🎉') }} />}
          <Btn label="Call Client" variant="ghost" small icon={I.phone} onClick={()=>onToast('Calling Mohamed Ihsan…')} />
        </div>
      </Card>

      <Card style={{ padding:22 }}>
        <SectionTitle title="Checklist" />
        <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
          {checks.map((c,i)=>(
            <div key={i} style={{ display:'flex', gap:10, alignItems:'center' }}>
              <div style={{ width:22, height:22, borderRadius:7, background:c.done?C.success:`${C.primary}10`, border:`2px solid ${c.done?C.success:C.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.2s' }}>
                {c.done&&<span style={{color:'#fff',display:'flex',transform:'scale(0.7)'}}>{I.check}</span>}
              </div>
              <p style={{ fontSize:13, color:c.done?C.type:C.muted, fontWeight:c.done?600:400, textDecoration:c.done?'line-through':undefined }}>{c.l}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Job Invitations ──────────────────────────────────────────────────────────
function Invitations({ onToast }:{ onToast:(m:string)=>void }) {
  const [accepted, setAccepted] = useState<Set<string>>(new Set())
  const [declined, setDeclined] = useState<Set<string>>(new Set())
  return (
    <div style={{ padding:'28px 32px 60px', maxWidth:760 }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Job Invitations</h2>
      <p style={{ fontSize:13, color:C.muted, marginBottom:24 }}>{INVITATIONS.length} pending invitations · Respond quickly to maintain your acceptance rate</p>
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        {INVITATIONS.map((inv)=>{
          const isAccepted = accepted.has(inv.id)
          const isDeclined = declined.has(inv.id)
          return (
            <Card key={inv.id} style={{ padding:24, border:`1.5px solid ${isAccepted?C.success+'40':isDeclined?C.muted+'30':C.border}`, background:isAccepted?`${C.success}04`:isDeclined?`${C.bg}`:C.surface, opacity:isDeclined?0.6:1 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap' as const, gap:12 }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:6 }}>
                    <h3 style={{ fontSize:15, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{inv.service}</h3>
                    {isAccepted&&<Bdg label="Accepted" color={C.success} />}
                    {isDeclined&&<Bdg label="Declined" color={C.muted} />}
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px 20px', marginBottom:12 }} className="cad-inv-grid">
                    {([{label:'Client',value:inv.client},{label:'Beneficiary',value:inv.beneficiary},{label:'Date',value:inv.date},{label:'Distance',value:inv.distance}] as {label:string;value:string}[]).map((row,i)=>(
                      <div key={i}>
                        <p style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.06em' }}>{row.label}</p>
                        <p style={{ fontSize:12, color:C.type, fontWeight:600 }}>{row.value}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                    <span style={{color:C.warning,display:'flex'}}>{I.clock}</span>
                    <p style={{ fontSize:12, fontWeight:700, color:C.warning }}>{inv.timer}</p>
                    <span style={{color:C.muted,display:'flex',marginLeft:8}}>{I.pin}</span>
                    <p style={{ fontSize:12, color:C.muted }}>{inv.location}</p>
                  </div>
                </div>
                <div style={{ textAlign:'right' as const, flexShrink:0 }}>
                  <p style={{ fontSize:11, color:C.muted, marginBottom:2 }}>Offered amount</p>
                  <p style={{ fontSize:22, fontWeight:900, color:C.success, fontFamily:'Manrope,sans-serif' }}>LKR {inv.amount.toLocaleString()}</p>
                </div>
              </div>
              {!isAccepted&&!isDeclined&&(
                <div style={{ display:'flex', gap:10, marginTop:16, paddingTop:16, borderTop:`1px solid ${C.border}` }}>
                  <Btn label="Accept Job" variant="success" onClick={()=>{ setAccepted(p=>new Set([...p,inv.id])); onToast('Job accepted! Client notified.') }} />
                  <Btn label="Decline" variant="ghost" onClick={()=>{ setDeclined(p=>new Set([...p,inv.id])); onToast('Invitation declined') }} />
                  <Btn label="View Details" variant="secondary" small />
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// ─── Calendar ─────────────────────────────────────────────────────────────────
function CalendarView({ onToast, jobs, loading, error }:{ onToast:(m:string)=>void; jobs:ScheduledJob[]; loading:boolean; error:string }) {
  const now = new Date()
  const year = now.getFullYear()
  const monthIndex = now.getMonth()
  const today = now.getDate()
  const monthLabel = now.toLocaleDateString('en-GB',{ month:'long', year:'numeric' })
  const monthAbbr = now.toLocaleDateString('en-GB',{ month:'short' })

  const [selectedDay, setSelectedDay] = useState(today)
  const [blocked, setBlocked] = useState(new Set<number>())
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  const daysInMonth = new Date(year, monthIndex+1, 0).getDate()
  const month = Array.from({length:daysInMonth},(_,i)=>i+1)
  // Monday-first offset for the 1st of the month (JS getDay(): 0=Sun..6=Sat)
  const leadingBlanks = (new Date(year, monthIndex, 1).getDay() + 6) % 7

  // Real job dates for this month, derived from getMyApplications() —
  // Block a Date has no backing table yet, so it stays local-only (not
  // persisted) rather than a fabricated Supabase write.
  const jobDays = new Set<number>()
  jobs.forEach(job => {
    if(!job.scheduledDate) return
    const d = new Date(job.scheduledDate)
    if(d.getFullYear()===year && d.getMonth()===monthIndex) jobDays.add(d.getDate())
  })
  const daySchedule = jobs.filter(job => {
    if(!job.scheduledDate) return false
    const d = new Date(job.scheduledDate)
    return d.getFullYear()===year && d.getMonth()===monthIndex && d.getDate()===selectedDay
  })

  return (
    <div style={{ padding:'28px 32px 60px', maxWidth:800 }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Calendar & Availability</h2>
      <p style={{ fontSize:13, color:C.muted, marginBottom:24 }}>{monthLabel} · Manage your schedule and availability</p>
      <div style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:20 }} className="cad-2col">
        <Card style={{ padding:24 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
            <h3 style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{monthLabel}</h3>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2, marginBottom:4 }}>
            {days.map(d=><p key={d} style={{ fontSize:10, fontWeight:800, color:C.muted, textAlign:'center' as const, padding:'4px 0' }}>{d}</p>)}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:3 }}>
            {[...Array(leadingBlanks)].map((_,i)=><div key={`e${i}`} />)}
            {month.map(d=>{
              const isSelected = d===selectedDay
              const hasJob = jobDays.has(d)
              const isBlocked = blocked.has(d)
              const isToday = d===today
              return (
                <button key={d} onClick={()=>setSelectedDay(d)}
                  style={{ aspectRatio:'1', borderRadius:8, border:`1.5px solid ${isSelected?C.primary:isToday?`${C.primary}30`:'transparent'}`, background:isSelected?C.primary:isBlocked?`${C.error}10`:isToday?`${C.primary}08`:'transparent', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2, position:'relative' as const }}>
                  <p style={{ fontSize:11, fontWeight:isSelected||isToday?800:500, color:isSelected?'#fff':isToday?C.primary:C.type }}>{d}</p>
                  {hasJob&&!isBlocked&&<div style={{ width:4, height:4, borderRadius:'50%', background:isSelected?'rgba(255,255,255,0.8)':C.primary, flexShrink:0 }} />}
                  {isBlocked&&<div style={{ width:4, height:4, borderRadius:'50%', background:C.error, flexShrink:0 }} />}
                </button>
              )
            })}
          </div>
          <div style={{ display:'flex', gap:14, marginTop:14, flexWrap:'wrap' as const }}>
            {[{col:C.primary,l:'Jobs'},{col:C.error,l:'Blocked'},{col:`${C.primary}30`,l:'Today'}].map((leg,i)=>(
              <div key={i} style={{ display:'flex', gap:5, alignItems:'center' }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:leg.col }} />
                <p style={{ fontSize:11, color:C.muted }}>{leg.l}</p>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <Card style={{ padding:20 }}>
            <SectionTitle title={`${monthAbbr} ${selectedDay} — Schedule`} />
            {loading ? (
              <p style={{ fontSize:13, color:C.muted }}>Loading…</p>
            ) : error ? (
              <p style={{ fontSize:13, color:C.error }}>{error}</p>
            ) : daySchedule.length===0 ? (
              <p style={{ fontSize:13, color:C.muted }}>No jobs scheduled for this day.</p>
            ) : daySchedule.map((job,i)=>(
                <div key={job.id} style={{ padding:'10px 0', borderBottom:i<daySchedule.length-1?`1px solid ${C.border}`:'none' }}>
                  <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{[job.time, job.service].filter(Boolean).join(' · ')}</p>
                  <p style={{ fontSize:11, color:C.muted }}>{[job.client, job.duration].filter(Boolean).join(' · ')}</p>
                </div>
              ))
            }
          </Card>
          <Card style={{ padding:20 }}>
            <SectionTitle title="Block a Date" />
            <p style={{ fontSize:12, color:C.muted, marginBottom:12 }}>Block dates for leave or personal time. Blocked days won't receive invitations.</p>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' as const, marginBottom:12 }}>
              {[...blocked].map(d=>(
                <div key={d} style={{ display:'flex', gap:4, alignItems:'center', padding:'4px 10px', borderRadius:99, background:`${C.error}10`, border:`1px solid ${C.error}30` }}>
                  <p style={{ fontSize:11, fontWeight:700, color:C.error }}>{monthAbbr} {d}</p>
                  <button onClick={()=>setBlocked(p=>{ const n=new Set(p); n.delete(d); return n })} style={{ background:'none', border:'none', cursor:'pointer', color:C.error, display:'flex', padding:0 }}><span style={{display:'flex',transform:'scale(0.75)'}}>{I.close}</span></button>
                </div>
              ))}
            </div>
            <Btn label={`Block ${monthAbbr} ${selectedDay}`} variant="secondary" small onClick={()=>{ setBlocked(p=>new Set([...p,selectedDay])); onToast(`${monthAbbr} ${selectedDay} blocked (not saved — coming soon)`) }} />
          </Card>
        </div>
      </div>
    </div>
  )
}

// ─── Performance ──────────────────────────────────────────────────────────────
function Performance() {
  const months = ['Aug','Sep','Oct','Nov','Dec','Jan']
  const earnings = [82000,95000,110000,125000,138000,145000]
  const maxE = Math.max(...earnings)
  const metrics = [
    { label:'Average Rating',   value:'4.9 ★', sub:'142 reviews',     color:C.warning, pct:98 },
    { label:'Completion Rate',  value:'98%',   sub:'2 cancellations', color:C.success, pct:98 },
    { label:'Response Time',    value:'8 min', sub:'Avg first reply',  color:C.primary, pct:88 },
    { label:'Acceptance Rate',  value:'92%',   sub:'of invitations',  color:C.info,    pct:92 },
    { label:'Repeat Clients',   value:'64%',   sub:'book again',      color:C.accent,  pct:64 },
    { label:'Cancelled Jobs',   value:'2%',    sub:'This month',      color:C.error,   pct:2  },
  ]
  return (
    <div style={{ padding:'28px 32px 60px', maxWidth:800 }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:24 }}>Performance Analytics</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:24 }} className="cad-3col">
        {metrics.map((m,i)=>(
          <Card key={i} style={{ padding:20 }}>
            <p style={{ fontSize:12, fontWeight:700, color:C.muted, marginBottom:8 }}>{m.label}</p>
            <p style={{ fontSize:22, fontWeight:900, color:m.color, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>{m.value}</p>
            <p style={{ fontSize:11, color:C.muted, marginBottom:10 }}>{m.sub}</p>
            <div style={{ height:4, borderRadius:99, background:C.bg, overflow:'hidden' }}>
              <div style={{ width:`${m.pct}%`, height:'100%', background:m.color, borderRadius:99 }} />
            </div>
          </Card>
        ))}
      </div>

      {/* Monthly trend chart */}
      <Card style={{ padding:24 }}>
        <SectionTitle title="Monthly Earnings Trend (LKR)" />
        <div style={{ display:'flex', gap:8, alignItems:'flex-end', height:140 }}>
          {earnings.map((v,i)=>(
            <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
              <p style={{ fontSize:10, color:C.muted }}>{Math.round(v/1000)}K</p>
              <div style={{ width:'100%', borderRadius:'6px 6px 0 0', background:i===5?C.primary:`${C.primary}30`, height:`${(v/maxE)*100}%`, transition:'height 0.5s', minHeight:8 }} />
              <p style={{ fontSize:10, color:C.muted }}>{months[i]}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Earnings ─────────────────────────────────────────────────────────────────
function Earnings({ onToast }:{ onToast:(m:string)=>void }) {
  const txns = [
    { desc:'Hospital Appointment · Mohamed Ihsan',  date:'15 Jan · 12:30 PM', amount:3750,  type:'credit' },
    { desc:'Home Care · Priya Fernando',            date:'14 Jan · 7:00 PM',  amount:4800,  type:'credit' },
    { desc:'Medication Collection · Wijesinghe',    date:'14 Jan · 6:00 PM',  amount:1500,  type:'credit' },
    { desc:'Platform fee (5%)',                     date:'14 Jan',            amount:-508,  type:'debit'  },
    { desc:'Bank Transfer Payout',                  date:'13 Jan',            amount:-22000,type:'payout' },
  ]
  return (
    <div style={{ padding:'28px 32px 60px', maxWidth:760 }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:24 }}>Earnings Overview</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:24 }} className="cad-3col">
        <KPICard label="Today's Earnings"  value="LKR 3,750"   sub="1 job completed"    trend="↑ from LKR 0 yesterday" icon={I.wallet} color={C.primary} accent />
        <KPICard label="Weekly Earnings"   value="LKR 24,500"  sub="7 jobs this week"   trend="↑ 8% vs last week"       icon={I.trending} color={C.success} />
        <KPICard label="Monthly Earnings"  value="LKR 145,000" sub="38 jobs this month" trend="↑ 12% vs last month"      icon={I.star} color={C.warning} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:20 }} className="cad-2col">
        <Card style={{ padding:22 }}>
          <p style={{ fontSize:12, fontWeight:700, color:C.muted, marginBottom:4 }}>Pending Payout</p>
          <p style={{ fontSize:26, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>LKR 9,750</p>
          <p style={{ fontSize:11, color:C.muted, marginBottom:14 }}>Clears on Monday 20 Jan</p>
          <Btn label="View Wallet" variant="secondary" small icon={I.wallet} onClick={()=>onToast('Opening wallet…')} />
        </Card>
        <Card style={{ padding:22 }}>
          <p style={{ fontSize:12, fontWeight:700, color:C.muted, marginBottom:4 }}>Total Paid Out</p>
          <p style={{ fontSize:26, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>LKR 520,000</p>
          <p style={{ fontSize:11, color:C.muted, marginBottom:14 }}>All time · Commercial Bank</p>
          <Bdg label="Account Verified" color={C.success} />
        </Card>
      </div>
      <Card style={{ padding:22 }}>
        <SectionTitle title="Recent Transactions" />
        {txns.map((t,i)=>(
          <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:i<txns.length-1?`1px solid ${C.border}`:'none' }}>
            <div>
              <p style={{ fontSize:13, fontWeight:600, color:C.type, marginBottom:2 }}>{t.desc}</p>
              <p style={{ fontSize:11, color:C.muted }}>{t.date}</p>
            </div>
            <p style={{ fontSize:13, fontWeight:800, color:t.type==='credit'?C.success:t.type==='debit'?C.error:C.muted, fontFamily:'Manrope,sans-serif' }}>
              {t.amount>0?'+':''}{t.type==='payout'?'':''}LKR {Math.abs(t.amount).toLocaleString()}
            </p>
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── Notifications ────────────────────────────────────────────────────────────
function NotificationCenter({ notifications, loading, error, onMarkRead, onMarkAllRead }:{
  notifications:any[]; loading:boolean; error:string
  onMarkRead:(id:string)=>void; onMarkAllRead:()=>void
}) {
  const unreadCount = notifications.filter((n:any)=>!n.read).length

  if(loading) {
    return (
      <div style={{ padding:'28px 32px 60px', maxWidth:680 }}>
        <p style={{ fontSize:13, color:C.muted }}>Loading your notifications…</p>
      </div>
    )
  }

  if(error) {
    return (
      <div style={{ padding:'28px 32px 60px', maxWidth:680 }}>
        <p style={{ fontSize:13, color:C.error }}>{error}</p>
      </div>
    )
  }

  return (
    <div style={{ padding:'28px 32px 60px', maxWidth:680 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, gap:10, flexWrap:'wrap' as const }}>
        <div>
          <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>Notification Center</h2>
          <p style={{ fontSize:13, color:C.muted }}>{unreadCount} unread</p>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          {unreadCount>0&&<Btn label="Mark all as read" variant="ghost" small onClick={onMarkAllRead} />}
          <Bdg label={`${unreadCount} new`} color={C.primary} dot />
        </div>
      </div>
      {notifications.length===0 ? (
        <Card style={{ padding:'40px 24px', textAlign:'center' as const }}>
          <div style={{ fontSize:36, marginBottom:10 }}>🔔</div>
          <p style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:6 }}>No Notifications</p>
          <p style={{ fontSize:12, color:C.muted }}>You're all caught up — no new notifications.</p>
        </Card>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {notifications.map((n:any)=>{
            const meta = notifTypeMeta(n.type)
            return (
              <Card key={n.id} onClick={n.read?undefined:()=>onMarkRead(n.id)} style={{ padding:18, background:n.read?C.surface:`${meta.color}04`, border:`1px solid ${n.read?C.border:meta.color+'20'}`, cursor:n.read?'default':'pointer' }}>
                <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                  <div style={{ width:44, height:44, borderRadius:14, background:`${meta.color}12`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{meta.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                      <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                        <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{n.title}</p>
                        {!n.read&&<div style={{ width:7, height:7, borderRadius:'50%', background:meta.color }} />}
                      </div>
                      <p style={{ fontSize:11, color:C.muted, whiteSpace:'nowrap' as const }}>{formatRelativeTime(n.created_at)}</p>
                    </div>
                    <p style={{ fontSize:12, color:C.sub, lineHeight:1.6 }}>{n.body}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Messages Preview ─────────────────────────────────────────────────────────
function MessagesPreview({ onToast }:{ onToast:(m:string)=>void }) {
  const [reply, setReply] = useState('')
  return (
    <div style={{ padding:'28px 32px 60px', maxWidth:680 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Messages</h2>
        <Btn label="Open Full Chat" variant="secondary" small icon={I.msg} onClick={()=>onToast('Opening messaging…')} />
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {MESSAGES.map((m,i)=>(
          <Card key={i} hover style={{ padding:20 }}>
            <div style={{ display:'flex', gap:12, alignItems:'flex-start', marginBottom:m.unread>0?12:0 }}>
              <div style={{ position:'relative' as const }}>
                <Avatar initials={m.initials} size={44} />
                {m.unread>0&&<div style={{ position:'absolute', top:-3, right:-3, width:18, height:18, borderRadius:'50%', background:C.error, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:900, color:'#fff', fontFamily:'Manrope,sans-serif' }}>{m.unread}</div>}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{m.name}</p>
                  <p style={{ fontSize:11, color:C.muted }}>{m.time}</p>
                </div>
                <p style={{ fontSize:12, color:C.sub, lineHeight:1.5 }}>{m.msg}</p>
              </div>
            </div>
            {m.unread>0&&(
              <div style={{ display:'flex', gap:8, paddingTop:12, borderTop:`1px solid ${C.border}` }}>
                <input value={reply} onChange={e=>setReply(e.target.value)} placeholder="Quick reply…" style={{ flex:1, padding:'8px 12px', borderRadius:8, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, background:'#FAFAFA', outline:'none' }} />
                <Btn label="Send" variant="primary" small onClick={()=>{ onToast('Message sent'); setReply('') }} />
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Goals & Achievements ─────────────────────────────────────────────────────
function Goals({ onToast }:{ onToast:(m:string)=>void }) {
  const badges = [
    { icon:'⭐', name:'Top Rated',       desc:'Maintained 4.8+ for 3 months',     earned:true  },
    { icon:'🚀', name:'Fast Responder',  desc:'Average reply under 10 minutes',    earned:true  },
    { icon:'🔁', name:'Loyal Agent',     desc:'60%+ repeat client rate',           earned:true  },
    { icon:'💯', name:'Perfect Month',   desc:'100% completion in a month',        earned:false },
    { icon:'🏆', name:'Top 10 Agent',    desc:'Ranked top 10 in Western Province', earned:false },
    { icon:'💎', name:'Diamond Status',  desc:'Complete 500 lifetime jobs',        earned:false },
  ]
  return (
    <div style={{ padding:'28px 32px 60px', maxWidth:760 }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:24 }}>Goals & Achievements</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:24 }} className="cad-2col">
        {[
          { label:'Weekly Goal', current:8, target:12, unit:'jobs', color:C.primary },
          { label:'Monthly Goal', current:38, target:45, unit:'jobs', color:C.success },
          { label:'Earnings Goal', current:145000, target:180000, unit:'LKR', color:C.warning },
          { label:'Rating Goal', current:4.9, target:5.0, unit:'★', color:C.accent },
        ].map((g,i)=>(
          <Card key={i} style={{ padding:22 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{g.label}</p>
              <p style={{ fontSize:12, fontWeight:800, color:g.color }}>{g.unit==='LKR'?`LKR ${(g.current/1000).toFixed(0)}K`:`${g.current}${g.unit}`}</p>
            </div>
            <div style={{ height:8, borderRadius:99, background:C.bg, overflow:'hidden', marginBottom:6 }}>
              <div style={{ width:`${Math.min((g.current/g.target)*100,100)}%`, height:'100%', background:g.color, borderRadius:99, transition:'width 0.5s' }} />
            </div>
            <p style={{ fontSize:11, color:C.muted }}>Target: {g.unit==='LKR'?`LKR ${(g.target/1000).toFixed(0)}K`:`${g.target}${g.unit}`} · {Math.round((g.current/g.target)*100)}% complete</p>
          </Card>
        ))}
      </div>
      <Card style={{ padding:22 }}>
        <SectionTitle title="Achievement Badges" />
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }} className="cad-3col">
          {badges.map((b,i)=>(
            <div key={i} style={{ padding:'18px 14px', borderRadius:14, border:`1.5px solid ${b.earned?C.warning+'40':C.border}`, background:b.earned?`${C.warning}06`:'#FAFAFA', textAlign:'center' as const, opacity:b.earned?1:0.5 }}>
              <div style={{ fontSize:32, marginBottom:8 }}>{b.icon}</div>
              <p style={{ fontSize:12, fontWeight:800, color:b.earned?C.type:C.muted, marginBottom:4 }}>{b.name}</p>
              <p style={{ fontSize:11, color:C.muted, lineHeight:1.4 }}>{b.desc}</p>
              {b.earned&&<Bdg label="Earned" color={C.warning} />}
            </div>
          ))}
        </div>
        <div style={{ marginTop:16 }}>
          <p style={{ fontSize:12, fontWeight:700, color:C.muted, marginBottom:10 }}>Milestone Progress</p>
          {[{l:'Total Jobs Completed',current:247,target:500},{l:'5-Star Reviews',current:118,target:200},{l:'Unique Clients Served',current:84,target:100}].map((m,i)=>(
            <div key={i} style={{ marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                <p style={{ fontSize:12, color:C.sub }}>{m.l}</p>
                <p style={{ fontSize:11, fontWeight:700, color:C.primary }}>{m.current} / {m.target}</p>
              </div>
              <div style={{ height:5, borderRadius:99, background:C.bg, overflow:'hidden' }}>
                <div style={{ width:`${(m.current/m.target)*100}%`, height:'100%', background:`linear-gradient(90deg,${C.primary},${C.success})`, borderRadius:99 }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Profile Completion ───────────────────────────────────────────────────────
function ProfileCompletion({ onToast }:{ onToast:(m:string)=>void }) {
  const [steps, setSteps] = useState<OnboardingStepStatus[]|null>(null)
  const [percent, setPercent] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Uses the exact same step rules as CareAgentOnboarding's registration-
  // progress restore effect, via the shared computeOnboardingCompletion
  // helper (src/lib/onboardingCompletion.ts) — never a second, independent
  // notion of "complete" that could drift from onboarding.
  useEffect(() => {
    let cancelled = false
    const loadCompletion = async () => {
      try {
        setLoading(true)
        setError('')

        const [
          profileResult, agentDetailsResult, skillsResult, certificationsResult,
          identityDocsResult, bankAccountResult, availabilityResult,
          equipmentResult, referencesResult, agreementsResult,
        ] = await Promise.allSettled([
          getMyProfile(), getMyAgentDetails(), getMyAgentSkills(), getMyCertifications(),
          getMyIdentityDocuments(), getMyBankAccount(), getMyAvailability(),
          getMyEquipmentTransport(), getMyReferences(), getMyAgreements(),
        ])

        if(cancelled) return

        // Promise.allSettled: an individual fetch failing just makes that
        // step read as "incomplete" below (safe default) instead of
        // breaking the whole Profile Completion view.
        const completion = computeOnboardingCompletion({
          profile: profileResult.status==='fulfilled' ? profileResult.value : null,
          agentDetails: agentDetailsResult.status==='fulfilled' ? agentDetailsResult.value : null,
          skills: skillsResult.status==='fulfilled' ? skillsResult.value : null,
          certifications: certificationsResult.status==='fulfilled' ? certificationsResult.value : null,
          identityDocs: identityDocsResult.status==='fulfilled' ? identityDocsResult.value : null,
          bankAccount: bankAccountResult.status==='fulfilled' ? bankAccountResult.value : null,
          availability: availabilityResult.status==='fulfilled' ? availabilityResult.value : null,
          equipment: equipmentResult.status==='fulfilled' ? equipmentResult.value : null,
          references: referencesResult.status==='fulfilled' ? referencesResult.value : null,
          agreements: agreementsResult.status==='fulfilled' ? agreementsResult.value : null,
        })

        setSteps(completion.steps)
        setPercent(completion.percent)
      } catch (err) {
        if(cancelled) return
        console.error('Failed to compute profile completion:', err)
        setError("We couldn't load your profile completion status. Please try again.")
      } finally {
        if(!cancelled) setLoading(false)
      }
    }
    loadCompletion()
    return () => { cancelled = true }
  }, [])

  if(loading) {
    return (
      <div style={{ padding:'28px 32px 60px', maxWidth:680 }}>
        <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:24 }}>Profile Completion</h2>
        <p style={{ fontSize:13, color:C.muted }}>Loading your profile completion status…</p>
      </div>
    )
  }

  if(error || !steps) {
    return (
      <div style={{ padding:'28px 32px 60px', maxWidth:680 }}>
        <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:24 }}>Profile Completion</h2>
        <p style={{ fontSize:13, color:C.error }}>{error || "We couldn't load your profile completion status."}</p>
      </div>
    )
  }

  const strength = percent>=90?'Excellent':percent>=70?'Good':'Needs Work'
  const strengthColor = percent>=90?C.success:percent>=70?C.warning:C.error
  return (
    <div style={{ padding:'28px 32px 60px', maxWidth:680 }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:24 }}>Profile Completion</h2>
      <Card style={{ padding:24, marginBottom:20, background:`linear-gradient(135deg,${C.primary}06,${C.primary}02)`, border:`1.5px solid ${C.primary}20` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
          <div>
            <p style={{ fontSize:15, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>Profile Strength: <span style={{color:strengthColor}}>{strength}</span></p>
            <p style={{ fontSize:12, color:C.muted }}>A complete profile gets 3× more bookings</p>
          </div>
          <p style={{ fontSize:40, fontWeight:900, color:strengthColor, fontFamily:'Manrope,sans-serif', lineHeight:1 }}>{percent}%</p>
        </div>
        <div style={{ height:10, borderRadius:99, background:`${C.primary}12`, overflow:'hidden' }}>
          <div style={{ width:`${percent}%`, height:'100%', background:`linear-gradient(90deg,${C.primary},${C.success})`, borderRadius:99, transition:'width 0.6s' }} />
        </div>
        <div style={{ display:'flex', gap:10, marginTop:14 }}>
          <Btn label="Complete Profile" icon={I.edit} onClick={()=>onToast('Opening registration…')} />
        </div>
      </Card>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {steps.map((s)=>(
          <Card key={s.step} style={{ padding:18 }}>
            <div style={{ display:'flex', gap:12, alignItems:'center' }}>
              <div style={{ width:32, height:32, borderRadius:10, background:s.complete?`${C.success}10`:`${C.warning}10`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:s.complete?C.success:C.warning }}>
                {s.complete?<span style={{display:'flex',transform:'scale(0.85)'}}>{I.check}</span>:<span style={{fontSize:12,fontWeight:900}}>!</span>}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{s.label}</p>
                  <p style={{ fontSize:11, fontWeight:800, color:s.complete?C.success:C.warning }}>{s.complete?100:0}%</p>
                </div>
                <div style={{ height:4, borderRadius:99, background:C.bg, overflow:'hidden' }}>
                  <div style={{ width:s.complete?'100%':'0%', height:'100%', background:s.complete?C.success:C.warning, borderRadius:99 }} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Service Areas ────────────────────────────────────────────────────────────
// Service Areas reuses the same agent_availability.max_travel_distance_km
// / agent_details.service_areas columns the onboarding travel-radius step
// already persists (see Phase 1A) — this view was previously a disconnected
// local useState that never read or wrote that data.
function ServiceAreas({ onToast }:{ onToast:(m:string)=>void }) {
  const [availability, setAvailability] = useState<any>(null)
  const [serviceAreaCities, setServiceAreaCities] = useState<string[]>([])
  const [radius, setRadius] = useState<number|null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const [availabilityResult, agentDetailsResult] = await Promise.allSettled([
          getMyAvailability(),
          getMyAgentDetails(),
        ])
        if(cancelled) return
        const availabilityData = availabilityResult.status==='fulfilled' ? (availabilityResult.value as any) : null
        setAvailability(availabilityData)
        setRadius(availabilityData?.max_travel_distance_km ?? 25)
        const agentDetailsData = agentDetailsResult.status==='fulfilled' ? (agentDetailsResult.value as any) : null
        setServiceAreaCities(agentDetailsData?.service_areas ?? [])
      } catch(err) {
        if(cancelled) return
        console.error('Failed to load service area settings:', err)
        setError("We couldn't load your service area settings.")
      } finally {
        if(!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const handleSave = async () => {
    if(radius==null) return
    setSaving(true)
    try {
      const saved = await saveMyAvailability({
        working_days: availability?.working_days ?? [],
        preferred_shift: availability?.preferred_shift ?? 'morning',
        emergency_available: availability?.emergency_available ?? false,
        holiday_available: availability?.holiday_available ?? false,
        max_weekly_hours: availability?.max_weekly_hours ?? 40,
        max_travel_distance_km: radius,
      })
      setAvailability(saved)
      onToast('Service area updated')
    } catch(err) {
      console.error('Failed to save service area:', err)
      onToast("Couldn't save — please try again")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ padding:'28px 32px 60px', maxWidth:700 }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:24 }}>Service Areas</h2>
      {loading ? (
        <p style={{ fontSize:13, color:C.muted }}>Loading your service area…</p>
      ) : error ? (
        <p style={{ fontSize:13, color:C.error }}>{error}</p>
      ) : (
        <Card style={{ overflow:'hidden', marginBottom:20 }}>
          {/* Map placeholder */}
          <div style={{ height:280, background:`linear-gradient(135deg,${C.bg},#E4EEF0)`, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:10, position:'relative' as const }}>
            <div style={{ position:'absolute', inset:0, backgroundImage:`radial-gradient(circle at 40% 50%, ${C.primary}15 0%, transparent 70%)` }} />
            {/* Coverage rings */}
            {[100,70,42].map((s,i)=>(
              <div key={i} style={{ position:'absolute', width:`${s}%`, height:`${s*0.7}%`, borderRadius:'50%', border:`2px dashed ${C.primary}${i===2?'40':'20'}`, top:'50%', left:'50%', transform:'translate(-50%,-50%)' }} />
            ))}
            <div style={{ width:16, height:16, borderRadius:'50%', background:C.primary, boxShadow:`0 0 0 6px ${C.primary}30`, zIndex:1 }} />
            <p style={{ fontSize:13, fontWeight:700, color:C.sub, zIndex:1, background:C.surface, padding:'4px 12px', borderRadius:8 }}>Coverage: {radius} km</p>
            <p style={{ fontSize:11, color:C.muted }}>Interactive map — coming soon</p>
          </div>
          <div style={{ padding:20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <p style={{ fontSize:12, fontWeight:700, color:C.muted }}>Travel Radius</p>
              <p style={{ fontSize:13, fontWeight:900, color:C.primary, fontFamily:'Manrope,sans-serif' }}>{radius} km</p>
            </div>
            <input type="range" min={5} max={100} step={5} value={radius??25} onChange={e=>setRadius(+e.target.value)} style={{ width:'100%', accentColor:C.primary, cursor:'pointer', marginBottom:14 }} />
            {serviceAreaCities.length>0 ? (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
                {serviceAreaCities.map((city,i)=>(
                  <div key={i} style={{ padding:'8px 10px', borderRadius:8, background:C.bg, display:'flex', gap:5, alignItems:'center' }}>
                    <span style={{color:C.primary,display:'flex',transform:'scale(0.8)'}}>{I.pin}</span>
                    <p style={{ fontSize:11, fontWeight:600, color:C.type }}>{city}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize:12, color:C.muted }}>No service areas set yet — add cities during profile setup.</p>
            )}
            <div style={{ marginTop:14 }}>
              <Btn label={saving?'Saving…':'Save Coverage Area'} variant="primary" small disabled={saving} onClick={handleSave} />
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

// ─── Status Center ────────────────────────────────────────────────────────────
function StatusCenter({ status, setStatus, onToast }:{ status:Status; setStatus:(s:Status)=>void; onToast:(m:string)=>void }) {
  const statuses: { k:Status; l:string; d:string; icon:string }[] = [
    { k:'online',    l:'Online',           d:'Accepting new job invitations',      icon:'🟢' },
    { k:'offline',   l:'Offline',          d:'Not visible to clients',             icon:'⚫' },
    { k:'busy',      l:'Busy',             d:'On a job, limited availability',     icon:'🟡' },
    { k:'break',     l:'On Break',         d:'Short break, back soon',             icon:'🟠' },
    { k:'emergency', l:'Emergency Available', d:'For urgent requests only',        icon:'🔴' },
    { k:'vacation',  l:'Vacation Mode',    d:'Away — no invitations',              icon:'🔵' },
  ]
  return (
    <div style={{ padding:'28px 32px 60px', maxWidth:680 }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Status Center</h2>
      <p style={{ fontSize:13, color:C.muted, marginBottom:24 }}>Your current status is visible to clients and affects job matching.</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }} className="cad-2col">
        {statuses.map(s=>(
          <Card key={s.k} hover style={{ padding:20, border:`2px solid ${status===s.k?STATUS_CONFIG[s.k].color+'50':C.border}`, background:status===s.k?`${STATUS_CONFIG[s.k].color}06`:C.surface }} onClick={()=>{ setStatus(s.k); onToast(`Status set to ${s.l}`) }}>
            <div style={{ display:'flex', gap:12, alignItems:'center' }}>
              <span style={{ fontSize:24 }}>{s.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:3 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{s.l}</p>
                  {status===s.k&&<Bdg label="Active" color={STATUS_CONFIG[s.k].color} />}
                </div>
                <p style={{ fontSize:11, color:C.muted }}>{s.d}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Activity Timeline ────────────────────────────────────────────────────────
// Built from real notifications (getMyNotifications) — there is no separate
// activity_log table yet, so richer entries (payments, reviews, logins,
// task-in-progress events) aren't fabricated; they'll appear here once
// those subsystems exist and start writing notifications.
function ActivityTimeline({ notifications, loading, error }:{ notifications:any[]; loading:boolean; error:string }) {
  return (
    <div style={{ padding:'28px 32px 60px', maxWidth:680 }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:24 }}>Activity Timeline</h2>
      {loading ? (
        <p style={{ fontSize:13, color:C.muted }}>Loading your activity…</p>
      ) : error ? (
        <p style={{ fontSize:13, color:C.error }}>{error}</p>
      ) : notifications.length===0 ? (
        <Card style={{ padding:'40px 24px', textAlign:'center' as const }}>
          <div style={{ fontSize:36, marginBottom:10 }}>🕒</div>
          <p style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:6 }}>No Activity Yet</p>
          <p style={{ fontSize:12, color:C.muted }}>Your activity will show up here as things happen.</p>
        </Card>
      ) : (
        <div style={{ display:'flex', flexDirection:'column' }}>
          {notifications.map((n:any,i:number,arr:any[])=>{
            const meta = notifTypeMeta(n.type)
            return (
              <div key={n.id} style={{ display:'flex', gap:14 }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                  <div style={{ width:40, height:40, borderRadius:12, background:`${meta.color}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{meta.icon}</div>
                  {i<arr.length-1&&<div style={{ width:2, flex:1, background:C.border, margin:'4px 0' }} />}
                </div>
                <div style={{ paddingBottom:i<arr.length-1?18:0, paddingTop:4 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:2 }}>{n.title}</p>
                  <p style={{ fontSize:12, color:C.muted, marginBottom:2 }}>{n.body}</p>
                  <p style={{ fontSize:11, color:C.muted }}>{formatRelativeTime(n.created_at)}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Settings ─────────────────────────────────────────────────────────────────
// Account-level settings for Care Agents: identity fields already backed by
// the real `profiles` table, a real Supabase Auth password change, and
// logout. Deliberately separate from AgentProfileMgmt.tsx (professional/
// public profile — headline, bio, skills, services, experience): this view
// only covers account/security/preferences/logout, never professional
// profile data. Notification/app preferences have no backing table yet, so
// that section stays an honest placeholder instead of a toggle that quietly
// discards its value.
function AgentSettings({ onToast }:{ onToast:(m:string)=>void }) {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        setLoading(true)
        setLoadError('')
        const data = await getMyProfile()
        if(!cancelled) setProfile(data)
      } catch(err) {
        if(cancelled) return
        console.error('Failed to load account settings:', err)
        setLoadError("We couldn't load your account settings. Please try again.")
      } finally {
        if(!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  // ─── Account details (real, persisted via profiles.full_name / preferred_name) ───
  const [editingName, setEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState('')
  const [preferredDraft, setPreferredDraft] = useState('')
  const [savingName, setSavingName] = useState(false)
  const [nameError, setNameError] = useState('')

  const startEditingName = () => {
    setNameDraft(profile?.full_name ?? '')
    setPreferredDraft(profile?.preferred_name ?? '')
    setNameError('')
    setEditingName(true)
  }
  const saveName = async () => {
    setSavingName(true)
    setNameError('')
    try {
      const fields = { full_name: nameDraft.trim(), preferred_name: preferredDraft.trim() }
      await updateProfile(fields)
      setProfile((p:any)=>({ ...p, ...fields }))
      setEditingName(false)
      onToast('Account details saved')
    } catch(err) {
      console.error('Failed to save account details:', err)
      setNameError("Couldn't save your details. Please try again.")
    } finally {
      setSavingName(false)
    }
  }

  // ─── Password change (real, via supabase.auth.updateUser) ─────────────────
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  const changePassword = async () => {
    if(changingPassword) return
    setPasswordError('')
    setPasswordSuccess(false)
    if(newPassword.length < 6) { setPasswordError('Password must be at least 6 characters.'); return }
    if(newPassword !== confirmPassword) { setPasswordError('Passwords do not match.'); return }
    setChangingPassword(true)
    const { error: pwError } = await supabase.auth.updateUser({ password: newPassword })
    setChangingPassword(false)
    if(pwError) {
      setPasswordError(pwError.message || "Couldn't update your password. Please try again.")
      return
    }
    setNewPassword('')
    setConfirmPassword('')
    setPasswordSuccess(true)
    onToast('Password updated')
  }

  // ─── Logout ─────────────────────────────────────────────────────────────
  // Auth-only: signs out of Supabase and redirects. Never touches profile,
  // agent application/onboarding, or booking/job rows.
  const [loggingOut, setLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState('')

  const handleLogout = async () => {
    if(loggingOut) return
    setLoggingOut(true)
    setLogoutError('')
    const { error: logoutErr } = await supabase.auth.signOut()
    if(logoutErr) {
      setLoggingOut(false)
      setLogoutError(logoutErr.message || "Couldn't log out. Please try again.")
      return
    }
    // Replace history so the authenticated dashboard can't be reached again
    // via the browser's Back button after logging out.
    navigate('/auth?mode=login', { replace:true })
  }

  if(loading) {
    return (
      <div style={{ padding:'28px 32px 60px', maxWidth:680 }}>
        <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:24 }}>Settings</h2>
        <p style={{ fontSize:13, color:C.muted }}>Loading your settings…</p>
      </div>
    )
  }

  if(loadError) {
    return (
      <div style={{ padding:'28px 32px 60px', maxWidth:680 }}>
        <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:24 }}>Settings</h2>
        <p style={{ fontSize:13, color:C.error }}>{loadError}</p>
      </div>
    )
  }

  const inputStyle: CSSProperties = { width:'100%', padding:'9px 12px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, outline:'none', background:'#FAFAFA', boxSizing:'border-box' as const }

  return (
    <div style={{ padding:'28px 32px 60px', maxWidth:680 }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Settings</h2>
      <p style={{ fontSize:13, color:C.muted, marginBottom:24 }}>Manage your account, security, and sign-in — for your professional profile, skills, and services, go to Profile instead.</p>

      {/* Account */}
      <Card style={{ padding:24, marginBottom:16 }}>
        <SectionTitle title="Account" action={editingName?undefined:'Edit'} onAction={editingName?undefined:startEditingName} />
        {editingName ? (
          <div>
            <div style={{ marginBottom:12 }}>
              <p style={{ fontSize:12, fontWeight:700, color:C.muted, marginBottom:5 }}>Full Name</p>
              <input value={nameDraft} onChange={e=>setNameDraft(e.target.value)} style={{ ...inputStyle, border:`1.5px solid ${C.primary}` }} />
            </div>
            <div style={{ marginBottom:12 }}>
              <p style={{ fontSize:12, fontWeight:700, color:C.muted, marginBottom:5 }}>Preferred Name</p>
              <input value={preferredDraft} onChange={e=>setPreferredDraft(e.target.value)} style={{ ...inputStyle, border:`1.5px solid ${C.primary}` }} />
            </div>
            {nameError && <p style={{ fontSize:11, color:C.error, marginBottom:10 }}>{nameError}</p>}
            <div style={{ display:'flex', gap:8 }}>
              <Btn label={savingName?'Saving…':'Save'} small disabled={savingName} onClick={saveName} />
              <Btn label="Cancel" variant="ghost" small disabled={savingName} onClick={()=>{ setEditingName(false); setNameError('') }} />
            </div>
          </div>
        ) : (
          <div>
            <div style={{ padding:'10px 0', borderBottom:`1px solid ${C.border}` }}>
              <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:2 }}>Full Name</p>
              <p style={{ fontSize:13, color:C.type }}>{profile?.full_name?.trim() || <span style={{color:C.muted,fontStyle:'italic'}}>Not set</span>}</p>
            </div>
            <div style={{ padding:'10px 0', borderBottom:`1px solid ${C.border}` }}>
              <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:2 }}>Preferred Name</p>
              <p style={{ fontSize:13, color:C.type }}>{profile?.preferred_name?.trim() || <span style={{color:C.muted,fontStyle:'italic'}}>Not set</span>}</p>
            </div>
            <div style={{ padding:'10px 0', borderBottom:`1px solid ${C.border}` }}>
              <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:2 }}>Email</p>
              <p style={{ fontSize:13, color:C.type }}>{profile?.email || '—'}</p>
            </div>
            <div style={{ padding:'10px 0 0' }}>
              <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:2 }}>Phone</p>
              <p style={{ fontSize:13, color:C.type }}>{profile?.phone || <span style={{color:C.muted,fontStyle:'italic'}}>Not set</span>}</p>
            </div>
          </div>
        )}
      </Card>

      {/* Security */}
      <Card style={{ padding:24, marginBottom:16 }}>
        <SectionTitle title="Security" />
        <p style={{ fontSize:12, color:C.muted, marginBottom:14 }}>Change your password. You'll stay signed in on this device.</p>
        <div style={{ display:'flex', flexDirection:'column', gap:10, maxWidth:360 }}>
          <input type="password" placeholder="New password" value={newPassword} onChange={e=>{ setNewPassword(e.target.value); setPasswordSuccess(false) }} style={inputStyle} />
          <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={e=>{ setConfirmPassword(e.target.value); setPasswordSuccess(false) }} style={inputStyle} />
          {passwordError && <p style={{ fontSize:11, color:C.error }}>{passwordError}</p>}
          {passwordSuccess && <p style={{ fontSize:11, color:C.success, fontWeight:700 }}>Password updated successfully.</p>}
          <div>
            <Btn label={changingPassword?'Updating…':'Update Password'} variant="secondary" small disabled={changingPassword||!newPassword||!confirmPassword} onClick={changePassword} />
          </div>
        </div>
      </Card>

      {/* Preferences — no notification/preference columns exist yet, so this
          stays an honest placeholder rather than a toggle that silently
          discards its value. */}
      <Card style={{ padding:24, marginBottom:16 }}>
        <SectionTitle title="Preferences" />
        <p style={{ fontSize:12, color:C.muted }}>Notification and app preferences aren't available yet — this section is coming soon.</p>
      </Card>

      {/* Sign out */}
      <Card style={{ padding:24, border:`1.5px solid ${C.error}20` }}>
        <SectionTitle title="Sign Out" />
        <p style={{ fontSize:12, color:C.muted, marginBottom:14 }}>Sign out of your Care Agent account on this device.</p>
        {logoutError && <p style={{ fontSize:11, color:C.error, marginBottom:10 }}>{logoutError}</p>}
        <Btn label={loggingOut?'Logging out…':'Log Out'} variant="danger" icon={I.logout} disabled={loggingOut} onClick={handleLogout} />
      </Card>
    </div>
  )
}

// ─── Emergency Panel ──────────────────────────────────────────────────────────
function EmergencyPanel({ onToast }:{ onToast:(m:string)=>void }) {
  return (
    <div style={{ padding:'28px 32px 60px', maxWidth:680 }}>
      <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:20 }}>
        <div style={{ width:10, height:10, borderRadius:'50%', background:C.error, animation:'pulse-dot 1s ease-in-out infinite' }} />
        <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Emergency Panel</h2>
      </div>
      <Card style={{ padding:22, border:`2px solid ${C.error}30`, background:`${C.error}04`, marginBottom:16 }}>
        <p style={{ fontSize:13, fontWeight:700, color:C.error, marginBottom:8 }}>Quick Access — Active Job</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }} className="cad-2col">
          <Btn label="Call Client (Ihsan)" icon={I.phone} variant="primary" onClick={()=>onToast('Calling Mohamed Ihsan…')} />
          <Btn label="Call Emergency Contact" icon={I.phone} variant="secondary" onClick={()=>onToast('Calling emergency contact…')} />
        </div>
      </Card>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="cad-2col">
        <Card style={{ padding:22 }}>
          <p style={{ fontSize:13, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:14 }}>Client Contacts</p>
          {[{name:'Mohamed Ihsan',phone:'+94 77 123 4567',role:'Client'},{name:'Nimal Perera',phone:'+94 77 234 5678',role:'Beneficiary'}].map((c,i)=>(
            <div key={i} style={{ display:'flex', gap:10, alignItems:'center', marginBottom:10 }}>
              <Avatar initials={c.name.split(' ').map(x=>x[0]).join('')} size={36} />
              <div style={{ flex:1 }}>
                <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{c.name}</p>
                <p style={{ fontSize:11, color:C.muted }}>{c.role} · {c.phone}</p>
              </div>
              <button onClick={()=>onToast(`Calling ${c.name}…`)} style={{ width:32, height:32, borderRadius:10, background:`${C.primary}10`, border:'none', cursor:'pointer', color:C.primary, display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{display:'flex'}}>{I.phone}</span></button>
            </div>
          ))}
        </Card>
        <Card style={{ padding:22 }}>
          <p style={{ fontSize:13, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:14 }}>Platform Support</p>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <Btn label="ReadyPal Support" variant="secondary" small icon={I.phone} onClick={()=>onToast('Calling ReadyPal support…')} />
            <Btn label="Live Chat" variant="ghost" small icon={I.msg} onClick={()=>onToast('Opening chat…')} />
          </div>
        </Card>
      </div>
      {/* SOS placeholder */}
      <Card style={{ padding:22, marginTop:14, border:`2px solid ${C.error}20`, background:`${C.error}04`, opacity:0.75 }}>
        <div style={{ display:'flex', gap:14, alignItems:'center' }}>
          <div style={{ width:52, height:52, borderRadius:'50%', background:`${C.error}15`, border:`2px solid ${C.error}30`, display:'flex', alignItems:'center', justifyContent:'center', color:C.error }}>
            <span style={{display:'flex',transform:'scale(1.4)'}}>{I.sos}</span>
          </div>
          <div>
            <p style={{ fontSize:13, fontWeight:800, color:C.error }}>Emergency SOS <span style={{ fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:99, background:`${C.info}12`, color:C.info }}>Coming Soon</span></p>
            <p style={{ fontSize:12, color:C.muted, marginTop:2 }}>Instant emergency broadcast and location sharing for critical situations.</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

// ─── Sub-view type ────────────────────────────────────────────────────────────
type SubView = 'home'|'schedule'|'activeTask'|'invitations'|'calendar'|'performance'|'earnings'|'notifications'|'messages'|'goals'|'profile'|'serviceAreas'|'statusCenter'|'timeline'|'settings'|'emergency'

const NAV_ITEMS: { k:SubView; l:string; icon:ReactNode; group:string }[] = [
  { k:'home',        l:'Dashboard',       icon:I.target,    group:'Overview' },
  { k:'schedule',    l:'Today\'s Schedule',icon:I.calendar,  group:'Overview' },
  { k:'activeTask',  l:'Active Task',     icon:I.play,      group:'Overview' },
  { k:'invitations', l:'Job Invitations', icon:I.bell,      group:'Overview' },
  { k:'calendar',    l:'Calendar',        icon:I.calendar,  group:'Overview' },
  { k:'performance', l:'Performance',     icon:I.trending,  group:'Analytics' },
  { k:'earnings',    l:'Earnings',        icon:I.wallet,    group:'Analytics' },
  { k:'goals',       l:'Goals & Badges',  icon:I.trophy,    group:'Analytics' },
  { k:'notifications',l:'Notifications',  icon:I.bell,      group:'Communication' },
  { k:'messages',    l:'Messages',        icon:I.msg,       group:'Communication' },
  { k:'profile',     l:'Profile',         icon:I.user,      group:'Settings' },
  { k:'serviceAreas',l:'Service Areas',   icon:I.map,       group:'Settings' },
  { k:'statusCenter',l:'Status Center',   icon:I.shield,    group:'Settings' },
  { k:'timeline',    l:'Activity Log',    icon:I.clock,     group:'Settings' },
  { k:'settings',    l:'Settings',        icon:I.settings,  group:'Settings' },
  { k:'emergency',   l:'Emergency Panel', icon:I.sos,       group:'Emergency' },
]

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function CareAgentDashboard() {
  const navigate = useNavigate()
  const [sub, setSub] = useState<SubView>('home')
  const [status, setStatus] = useState<Status>('online')
  const [toast, setToast] = useState<string|null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // ─── Application-status guard ───────────────────────────────────────────
  // Only an approved agent may stay on this dashboard. 'checking' renders a
  // loading screen (never the real dashboard) until agent_details is known;
  // 'denied' redirects away and also renders nothing, so an unapproved or
  // signed-out visitor never sees a flash of dashboard content.
  const [accessState, setAccessState] = useState<'checking'|'allowed'|'denied'>('checking')
  const [profile, setProfile] = useState<any>(null)
  const [agentDetails, setAgentDetails] = useState<any>(null)

  useEffect(() => {
    let cancelled = false
    const checkAccess = async () => {
      const user = await getCurrentUser().catch(() => null)
      if(!user) {
        if(!cancelled) { setAccessState('denied'); navigate('/auth', { replace:true }) }
        return
      }

      const [profileResult, agentDetailsResult] = await Promise.allSettled([
        getMyProfile(),
        getMyAgentDetails(),
      ])
      if(cancelled) return

      setProfile(profileResult.status==='fulfilled' ? profileResult.value : null)
      const agentDetailsData = agentDetailsResult.status==='fulfilled' ? (agentDetailsResult.value as any) : null
      setAgentDetails(agentDetailsData)

      if(agentDetailsData?.application_status === 'approved') {
        setAccessState('allowed')
      } else {
        // Fail closed: any uncertainty (fetch failure, missing record, any
        // status other than 'approved') sends the agent back to onboarding
        // rather than granting access.
        setAccessState('denied')
        navigate('/agent/onboarding', { replace:true })
      }
    }
    checkAccess()
    return () => { cancelled = true }
  }, [navigate])

  // ─── Real agent identity ────────────────────────────────────────────────
  const agentName = profile?.full_name?.trim() || 'Care Agent'
  const agentInitials = getInitials(profile?.full_name)
  const agentSubtitle = [
    agentDetails?.professional_headline?.trim(),
    profile?.city?.trim() || profile?.district?.trim(),
  ].filter(Boolean).join(' · ') || 'Care Agent'

  // ─── Real notifications ─────────────────────────────────────────────────
  const [notifications, setNotifications] = useState<any[]>([])
  const [notifLoading, setNotifLoading] = useState(true)
  const [notifError, setNotifError] = useState('')

  useEffect(() => {
    if(accessState !== 'allowed') return
    let cancelled = false
    const loadNotifications = async () => {
      try {
        setNotifLoading(true)
        setNotifError('')
        const data = await getMyNotifications()
        if(!cancelled) setNotifications(data ?? [])
      } catch(err) {
        if(cancelled) return
        console.error('Failed to load notifications:', err)
        setNotifError("We couldn't load your notifications. Please try again.")
      } finally {
        if(!cancelled) setNotifLoading(false)
      }
    }
    loadNotifications()
    return () => { cancelled = true }
  }, [accessState])

  const unreadNotifCount = notifications.filter((n:any)=>!n.read).length

  // ─── Real applications / scheduled jobs ─────────────────────────────────
  const [applications, setApplications] = useState<any[]>([])
  const [jobsLoading, setJobsLoading] = useState(true)
  const [jobsError, setJobsError] = useState('')

  useEffect(() => {
    if(accessState !== 'allowed') return
    let cancelled = false
    const loadApplications = async () => {
      try {
        setJobsLoading(true)
        setJobsError('')
        const data = await getMyApplications()
        if(!cancelled) setApplications(data ?? [])
      } catch(err) {
        if(cancelled) return
        console.error('Failed to load applications:', err)
        setJobsError("We couldn't load your schedule. Please try again.")
      } finally {
        if(!cancelled) setJobsLoading(false)
      }
    }
    loadApplications()
    return () => { cancelled = true }
  }, [accessState])

  const scheduledJobs = applications
    .map(scheduledJobFromApplication)
    .sort((a,b) => {
      if(!a.scheduledDate && !b.scheduledDate) return 0
      if(!a.scheduledDate) return 1
      if(!b.scheduledDate) return -1
      return a.scheduledDate.localeCompare(b.scheduledDate)
    })
  const todaysJobs = scheduledJobs.filter(j => isSameDate(j.scheduledDate, new Date()))

  const markNotifRead = async (id:string) => {
    const target = notifications.find(n=>n.id===id)
    if(!target || target.read) return
    // Optimistic — small, low-risk update local to one row.
    setNotifications(list => list.map(n=>n.id===id?{...n,read:true}:n))
    try {
      await markNotificationRead(id)
    } catch(err) {
      console.error('Failed to mark notification as read:', err)
      setNotifications(list => list.map(n=>n.id===id?{...n,read:false}:n))
    }
  }

  const markAllNotifsRead = async () => {
    const unreadIds = notifications.filter(n=>!n.read).map(n=>n.id)
    if(unreadIds.length===0) return
    const previous = notifications
    setNotifications(list => list.map(n=>({...n,read:true})))
    try {
      await markAllNotificationsRead()
    } catch(err) {
      console.error('Failed to mark all notifications as read:', err)
      setNotifications(previous)
    }
  }

  const showToast = (msg:string) => { setToast(msg); setTimeout(()=>setToast(null),2800) }

  const groups = [...new Set(NAV_ITEMS.map(n=>n.group))]

  const renderSub = () => {
    switch(sub) {
      case 'home':        return <DashboardHome status={status} setStatus={setStatus} onNav={s=>setSub(s)} onToast={showToast}
                             agentName={agentName} agentInitials={agentInitials} agentSubtitle={agentSubtitle}
                             notifications={notifications} notifLoading={notifLoading} notifError={notifError} onMarkNotifRead={markNotifRead}
                             todaysJobs={todaysJobs} jobsLoading={jobsLoading} jobsError={jobsError} />
      case 'schedule':    return <Schedule onToast={showToast} jobs={todaysJobs} loading={jobsLoading} error={jobsError} />
      case 'activeTask':  return <ActiveTask onToast={showToast} />
      case 'invitations': return <Invitations onToast={showToast} />
      case 'calendar':    return <CalendarView onToast={showToast} jobs={scheduledJobs} loading={jobsLoading} error={jobsError} />
      case 'performance': return <Performance />
      case 'earnings':    return <Earnings onToast={showToast} />
      case 'notifications':return <NotificationCenter notifications={notifications} loading={notifLoading} error={notifError} onMarkRead={markNotifRead} onMarkAllRead={markAllNotifsRead} />
      case 'messages':    return <MessagesPreview onToast={showToast} />
      case 'goals':       return <Goals onToast={showToast} />
      case 'profile':     return <ProfileCompletion onToast={showToast} />
      case 'serviceAreas':return <ServiceAreas onToast={showToast} />
      case 'statusCenter':return <StatusCenter status={status} setStatus={setStatus} onToast={showToast} />
      case 'timeline':    return <ActivityTimeline notifications={notifications} loading={notifLoading} error={notifError} />
      case 'settings':    return <AgentSettings onToast={showToast} />
      case 'emergency':   return <EmergencyPanel onToast={showToast} />
      default:            return <DashboardHome status={status} setStatus={setStatus} onNav={s=>setSub(s)} onToast={showToast}
                             agentName={agentName} agentInitials={agentInitials} agentSubtitle={agentSubtitle}
                             notifications={notifications} notifLoading={notifLoading} notifError={notifError} onMarkNotifRead={markNotifRead}
                             todaysJobs={todaysJobs} jobsLoading={jobsLoading} jobsError={jobsError} />
    }
  }

  if(accessState !== 'allowed') {
    return (
      <div style={{ display:'flex', minHeight:'100vh', alignItems:'center', justifyContent:'center', background:C.bg, fontFamily:'Manrope,sans-serif' }}>
        {accessState==='checking' && <p style={{ fontSize:13, color:C.muted }}>Loading your dashboard…</p>}
      </div>
    )
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:C.bg, fontFamily:'Manrope,sans-serif' }}>
      {/* Sidebar */}
      <div className="cad-sidebar" style={{ width:224, background:C.surface, borderRight:`1px solid ${C.border}`, display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh', overflowY:'auto', flexShrink:0 }}>
        {/* Agent mini-header */}
        <div style={{ padding:'18px 18px 12px', borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:8 }}>
            <div style={{ position:'relative' as const }}>
              <Avatar initials={agentInitials} size={36} />
              <div style={{ position:'absolute', bottom:0, right:0, width:10, height:10, borderRadius:'50%', background:STATUS_CONFIG[status].color, border:'2px solid #fff' }} />
            </div>
            <div>
              <p style={{ fontSize:13, fontWeight:800, color:C.type }}>{agentName}</p>
              <div style={{ display:'flex', gap:4, alignItems:'center' }}>
                <div style={{ width:6, height:6, borderRadius:'50%', background:STATUS_CONFIG[status].color }} />
                <p style={{ fontSize:11, color:STATUS_CONFIG[status].color, fontWeight:700 }}>{STATUS_CONFIG[status].label}</p>
              </div>
            </div>
          </div>
          <div style={{ display:'flex', gap:10, justifyContent:'space-between', alignItems:'center' }}>
            <p style={{ fontSize:10, color:C.muted }}>4.9★ · 98% completion</p>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <button onClick={()=>setSub('notifications')} style={{ position:'relative' as const, background:'none', border:'none', cursor:'pointer', color:C.muted, display:'flex' }}>
                {I.bell}
                {unreadNotifCount>0&&<div style={{ position:'absolute', top:-2, right:-2, width:8, height:8, borderRadius:'50%', background:C.error }} />}
              </button>
              <button onClick={()=>setSub('messages')} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, display:'flex' }}>{I.msg}</button>
            </div>
          </div>
        </div>

        {groups.map(group=>(
          <div key={group} style={{ marginBottom:2 }}>
            <p style={{ fontSize:9, fontWeight:800, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.09em', padding:'10px 18px 4px' }}>{group}</p>
            {NAV_ITEMS.filter(n=>n.group===group).map(n=>{
              const active = sub===n.k
              const isEmerg = n.k==='emergency'
              return (
                <button key={n.k} onClick={()=>{ setSub(n.k); setSidebarOpen(false) }}
                  style={{ width:'100%', display:'flex', gap:9, alignItems:'center', padding:'9px 18px', border:'none', background:active?`${isEmerg?C.error:C.primary}08`:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:active?700:500, color:active?(isEmerg?C.error:C.primary):isEmerg?C.error:C.type, textAlign:'left' as const, borderLeft:active?`3px solid ${isEmerg?C.error:C.primary}`:'3px solid transparent', transition:'all 0.12s' }}>
                  <span style={{ display:'flex', color:active?(isEmerg?C.error:C.primary):isEmerg?`${C.error}80`:C.muted, flexShrink:0 }}>{n.icon}</span>
                  {n.l}
                  {n.k==='notifications'&&unreadNotifCount>0&&<div style={{ marginLeft:'auto', minWidth:18, height:18, borderRadius:99, background:C.error, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:900, color:'#fff', padding:'0 5px' }}>{unreadNotifCount}</div>}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* Mobile overlay */}
      {sidebarOpen&&(
        <div style={{ position:'fixed', inset:0, zIndex:50, background:'rgba(0,0,0,0.4)' }} onClick={()=>setSidebarOpen(false)}>
          <div onClick={e=>e.stopPropagation()} style={{ width:240, height:'100%', background:C.surface, overflowY:'auto' }}>
            <div style={{ padding:'16px 18px', borderBottom:`1px solid ${C.border}`, display:'flex', gap:10, alignItems:'center' }}>
              <Avatar initials={agentInitials} size={36} />
              <div>
                <p style={{ fontSize:13, fontWeight:800, color:C.type }}>{agentName}</p>
                <p style={{ fontSize:11, color:STATUS_CONFIG[status].color, fontWeight:700 }}>{STATUS_CONFIG[status].label}</p>
              </div>
            </div>
            {groups.map(group=>(
              <div key={group}>
                <p style={{ fontSize:9, fontWeight:800, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.09em', padding:'10px 18px 4px' }}>{group}</p>
                {NAV_ITEMS.filter(n=>n.group===group).map(n=>(
                  <button key={n.k} onClick={()=>{ setSub(n.k); setSidebarOpen(false) }}
                    style={{ width:'100%', display:'flex', gap:9, alignItems:'center', padding:'10px 18px', border:'none', background:sub===n.k?`${C.primary}08`:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:sub===n.k?700:500, color:sub===n.k?C.primary:C.type, textAlign:'left' as const }}>
                    <span style={{ display:'flex', color:sub===n.k?C.primary:C.muted }}>{n.icon}</span>{n.l}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile top bar */}
      <div className="cad-mobile-nav" style={{ display:'none', position:'fixed', top:0, left:0, right:0, zIndex:40, background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'12px 18px', alignItems:'center', justifyContent:'space-between' }}>
        <p style={{ fontSize:13, fontWeight:800, color:C.type }}>{NAV_ITEMS.find(n=>n.k===sub)?.l??'Dashboard'}</p>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <div style={{ display:'flex', gap:4, alignItems:'center' }}>
            <div style={{ width:7, height:7, borderRadius:'50%', background:STATUS_CONFIG[status].color }} />
            <p style={{ fontSize:11, fontWeight:700, color:STATUS_CONFIG[status].color }}>{STATUS_CONFIG[status].label}</p>
          </div>
          <button onClick={()=>setSidebarOpen(v=>!v)} style={{ background:'none', border:'none', cursor:'pointer', color:C.type, fontSize:12, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>Menu</button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, overflowY:'auto' }} className="cad-main">
        {renderSub()}
      </div>

      {toast&&<SuccessToast msg={toast} />}
    </div>
  )
}
