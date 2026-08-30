import { useState, useEffect, useMemo, type ReactNode, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getMyProfile,
  getMyBookings,
  getBeneficiaryDocuments,
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  createSupportTicket,
  confirmBooking,
} from '../lib/api'

// ─── Brand ────────────────────────────────────────────────────────────────────
const C = {
  primary:'#00737A', accent:'#EE8153', type:'#2C3E43', sub:'#6B7E85',
  muted:'#9AAAB0', border:'#E4E8EA', bg:'#F2F4F5', surface:'#FFFFFF',
  success:'#22C55E', warning:'#F59E0B', error:'#EF4444', info:'#3B82F6',
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const I: Record<string,ReactNode> = {
  check:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5l3.5 3.5 5.5-6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  clock:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M6.5 4.5V6.8l1.8 1.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  pin:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1a3.5 3.5 0 0 1 3.5 3.5c0 2.5-3.5 7-3.5 7S3 7 3 4.5A3.5 3.5 0 0 1 6.5 1z" stroke="currentColor" strokeWidth="1.2"/><circle cx="6.5" cy="4.5" r="1.2" fill="currentColor"/></svg>,
  calendar: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="2" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 5.5h11M4.5 1v2M8.5 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  user:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 11c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  phone:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 2.5l2-1 1.5 2.5-1 1a7 7 0 0 0 3.5 3.5l1-1 2.5 1.5-1 2C8 12 1 5 2 2.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  msg:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M11 2H2a1.5 1.5 0 0 0-1.5 1.5v5.5A1.5 1.5 0 0 0 2 10.5h2l2.5 2 2.5-2H11a1.5 1.5 0 0 0 1.5-1.5V3.5A1.5 1.5 0 0 0 11 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  map:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 2.5l4 1.5 3-2 4 2v7l-4-2-3 2-4-1.5V2.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M5 4V11M8 2.5v7" stroke="currentColor" strokeWidth="1.1"/></svg>,
  doc:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M3 1.5h5l3 3v7.5H3V1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M8 1.5V4.5H11" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M5 7h4M5 9h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  alert:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5L1 11h11L6.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M6.5 6v2M6.5 9.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  chevR:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M4.5 2.5l5 4-5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  edit:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M9.5 1.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  close:    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  star:     <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M6 1l1.5 3 3.3.5-2.4 2.3.6 3.3L6 8.8 3 10.1l.6-3.3L1.2 4.5l3.3-.5L6 1z"/></svg>,
  refresh:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M11 6.5a4.5 4.5 0 1 1-1-2.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M11 3v2.5H8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  bell:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2v.6A4 4 0 0 1 10.5 6.5v3l1 1.5H1.5l1-1.5V6.5A4 4 0 0 1 6.5 2.6V2M5.5 11a1 1 0 0 0 2 0" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  shield:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5l4.5 1.7v3.5C11 9.8 9 12 6.5 13 4 12 2 9.8 2 6.7V3.2L6.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  nav:      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5L12.5 12 7 9.5 1.5 12 7 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  download: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5v7M4 6l2.5 2.5L9 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M1.5 10.5h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  repeat:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 4.5h10M1.5 8.5h10M4 2l-2.5 2.5L4 7M9 6l2.5 2.5L9 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  trending: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 10l3.5-3.5 3 3L11 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M8.5 4H11v2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
}

// ─── Primitives ───────────────────────────────────────────────────────────────
function Card({ children, style={}, hover=false, onClick }:{ children:ReactNode; style?:CSSProperties; hover?:boolean; onClick?:()=>void }) {
  const [h,setH] = useState(false)
  return (
    <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ background:C.surface, borderRadius:16, border:`1px solid ${h&&hover?C.primary+'40':C.border}`, boxShadow:h&&hover?'0 8px 28px rgba(44,62,67,0.10)':'0 1px 4px rgba(44,62,67,0.06)', transition:'all 0.18s', transform:h&&hover?'translateY(-2px)':undefined, cursor:onClick?'pointer':undefined, ...style }}>
      {children}
    </div>
  )
}

function Btn({ label, icon, onClick, variant='primary', small=false, disabled=false, full=false }:{
  label:string; icon?:ReactNode; onClick?:()=>void
  variant?:'primary'|'secondary'|'ghost'|'danger'|'accent'|'success'
  small?:boolean; disabled?:boolean; full?:boolean
}) {
  const [h,setH] = useState(false)
  const vs: Record<string,CSSProperties> = {
    primary:   { background:disabled?'#C8D0D4':h?'#005D63':C.primary, color:'#fff', border:'none', boxShadow:disabled?'none':h?`0 4px 16px ${C.primary}50`:`0 2px 8px ${C.primary}30` },
    secondary: { background:h?'#EEF5F5':'#fff', color:C.primary, border:`1.5px solid ${h?C.primary:C.border}` },
    ghost:     { background:h?C.bg:'transparent', color:C.sub, border:'none' },
    danger:    { background:h?'#DC2626':C.error, color:'#fff', border:'none' },
    accent:    { background:h?'#D4663D':C.accent, color:'#fff', border:'none', boxShadow:`0 2px 8px ${C.accent}30` },
    success:   { background:h?'#16A34A':C.success, color:'#fff', border:'none', boxShadow:`0 2px 8px ${C.success}30` },
  }
  return (
    <button onClick={disabled?undefined:onClick} disabled={disabled}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:small?'7px 14px':'10px 20px', borderRadius:10, cursor:disabled?'not-allowed':'pointer', fontFamily:'Manrope,sans-serif', fontSize:small?12:13, fontWeight:700, transition:'all 0.15s', width:full?'100%':undefined, ...vs[variant] }}>
      {icon&&<span style={{display:'flex'}}>{icon}</span>}{label}
    </button>
  )
}

function Bdg({ label, color=C.primary, dot=false }:{ label:string; color?:string; dot?:boolean }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:dot?5:0, padding:'3px 10px', borderRadius:999, fontSize:11, fontWeight:700, background:`${color}12`, color, whiteSpace:'nowrap' as const }}>
      {dot&&<div style={{width:6,height:6,borderRadius:'50%',background:color,flexShrink:0}}/>}{label}
    </span>
  )
}

function Avatar({ initials='', color=C.primary, size=40 }:{ initials:string; color?:string; size?:number }) {
  return <div style={{ width:size, height:size, borderRadius:'50%', background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:size*0.28, color, fontFamily:'Manrope,sans-serif', flexShrink:0 }}>{initials}</div>
}

function SectionTitle({ title, action, onAction }:{ title:string; action?:string; onAction?:()=>void }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
      <h3 style={{ fontSize:15, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>{title}</h3>
      {action&&<button onClick={onAction} style={{ fontSize:12, fontWeight:700, color:C.primary, background:'none', border:'none', cursor:'pointer', fontFamily:'Manrope,sans-serif', display:'flex', alignItems:'center', gap:3 }}>{action}<span style={{display:'flex'}}>{I.chevR}</span></button>}
    </div>
  )
}

// kind defaults to 'success' so every existing call site keeps its current
// look; only call sites that pass 'error' get the distinct red/× styling.
function Toast({ msg, kind='success' }:{ msg:string; kind?:'success'|'error' }) {
  const isError = kind==='error'
  return (
    <div style={{ position:'fixed', bottom:28, left:'50%', transform:'translateX(-50%)', zIndex:999, display:'flex', alignItems:'center', gap:10, padding:'12px 22px', borderRadius:14, background:isError?C.error:C.type, color:'#fff', fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:700, boxShadow:isError?`0 8px 28px ${C.error}55`:'0 8px 28px rgba(0,0,0,0.22)', pointerEvents:'none', whiteSpace:'nowrap' as const }}>
      <span style={{display:'flex',color:isError?'#fff':C.success}}>{isError?I.close:I.check}</span>{msg}
    </div>
  )
}

function EmptyPage({ title, message }:{ title:string; message:string }) {
  return (
    <div style={{ maxWidth:640, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>{title}</h2>
      <Card style={{ padding:40, textAlign:'center' as const }}>
        <p style={{ fontSize:13, color:C.muted }}>{message}</p>
      </Card>
    </div>
  )
}

// ─── Status config ────────────────────────────────────────────────────────────
// Mirrors bookings.status exactly — that column only accepts these six
// values, so no other status is ever shown as selectable or written back.
const STATUS: Record<string,{color:string;label:string}> = {
  assigned:    { color:C.info,    label:'Assigned'    },
  confirmed:   { color:C.primary, label:'Confirmed'   },
  in_progress: { color:C.success, label:'In Progress' },
  completed:   { color:C.success, label:'Completed'   },
  cancelled:   { color:C.error,   label:'Cancelled'   },
  rescheduled: { color:C.muted,   label:'Rescheduled' },
}
function statusMeta(status?:string|null):{color:string;label:string} {
  if(!status) return { color:C.muted, label:'Unknown' }
  return STATUS[status] ?? { color:C.muted, label: status.charAt(0).toUpperCase()+status.slice(1).replace(/_/g,' ') }
}

// ─── Real data shapes ─────────────────────────────────────────────────────────
// These mirror the confirmed Supabase schema. jsonb/array fields on
// beneficiaries (allergies, conditions, medications, pref_languages,
// emergency_contacts) have no guaranteed shape, so they're read as
// `unknown` and rendered defensively via toStringList()/toContactList().
type CareRequestInfo = {
  id:string; title:string|null; service_type:string|null; tasks:string[]|null
  instructions:string|null; access_notes:string|null; household_notes:string|null; parking_notes:string|null
  urgent:boolean|null; address1:string|null; address2:string|null; city:string|null; province:string|null
  lat:number|null; lng:number|null
} | null

type ClientInfo = { id:string; full_name:string|null; avatar_url:string|null; phone:string|null } | null

type BeneficiaryInfo = {
  id:string; name:string|null; preferred_name:string|null; dob:string|null; age:number|null
  gender:string|null; relationship:string|null; address:string|null
  blood_group:string|null; allergies:unknown; conditions:unknown; medications:unknown
  doctor:string|null; hospital:string|null; mobility:string|null; vision:string|null; hearing:string|null; memory:string|null
  med_notes:string|null; emergency_contacts:unknown; pref_languages:unknown; dietary:string|null; special_req:string|null
} | null

type Booking = {
  id:string; care_request_id:string|null; application_id:string|null; client_id:string|null; beneficiary_id:string|null
  status:string; scheduled_date:string|null; scheduled_time:string|null; duration:string|null
  payment_amount:number|null; priority:string|null; recurring:boolean|null; confirmed:boolean|null
  location:string|null; created_at:string
  care_request:CareRequestInfo; client:ClientInfo; beneficiary:BeneficiaryInfo
}

type NotificationRow = { id:string; type:string|null; title:string|null; body:string|null; read:boolean; action_url:string|null; created_at:string }
type BeneficiaryDocument = { id:string; beneficiary_id:string; name:string|null; type:string|null; file_url:string|null; uploaded_at:string|null; expiry_date:string|null }

// ─── Formatting / defensive-rendering helpers ──────────────────────────────────
function initials(name?:string|null):string {
  if(!name) return '—'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if(!parts.length) return '—'
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase()
}
function serviceLabel(cr:CareRequestInfo):string { return cr?.title || cr?.service_type || 'Care Visit' }
function clientName(c:ClientInfo):string { return c?.full_name || 'Client not provided' }
function beneficiaryName(b:BeneficiaryInfo):string { return b?.preferred_name || b?.name || 'Beneficiary not provided' }
function locationLabel(b:Booking):string {
  if(b.location) return b.location
  const cr = b.care_request
  const parts = [cr?.address1, cr?.address2, cr?.city, cr?.province].filter(Boolean)
  return parts.length ? parts.join(', ') : 'Location not provided'
}
function formatDateLabel(dateStr?:string|null):string {
  if(!dateStr) return 'Not scheduled'
  const d = new Date(`${dateStr.slice(0,10)}T00:00:00`)
  if(Number.isNaN(d.getTime())) return 'Not scheduled'
  return d.toLocaleDateString('en-GB',{ weekday:'short', day:'numeric', month:'short' })
}
function formatTimeLabel(timeStr?:string|null):string {
  if(!timeStr) return ''
  const [hStr,mStr] = timeStr.split(':')
  const h = Number(hStr)
  if(Number.isNaN(h)) return timeStr
  const period = h>=12?'PM':'AM'
  const h12 = h%12===0?12:h%12
  return `${h12}:${(mStr??'00').slice(0,2)} ${period}`
}
function fmt(n?:number|null):string { return typeof n==='number' ? `LKR ${n.toLocaleString()}` : 'Not available' }
function computeAgeFromDob(dob:string):number|null {
  const d = new Date(dob)
  if(Number.isNaN(d.getTime())) return null
  return Math.floor((Date.now()-d.getTime())/(365.25*24*3600*1000))
}
// Renders an unknown array/JSON-string/object/scalar field as a clean list
// of strings — never crashes regardless of the actual stored shape.
function toStringList(value:unknown):string[] {
  if(value==null) return []
  if(Array.isArray(value)) return value.map(v=>typeof v==='string'?v:JSON.stringify(v)).filter(Boolean)
  if(typeof value==='string') {
    const trimmed = value.trim()
    if(!trimmed) return []
    try {
      const parsed = JSON.parse(trimmed)
      if(Array.isArray(parsed)) return parsed.map(v=>typeof v==='string'?v:JSON.stringify(v)).filter(Boolean)
    } catch { /* not JSON — treat as plain text below */ }
    return trimmed.split(',').map(s=>s.trim()).filter(Boolean)
  }
  if(typeof value==='object') return Object.values(value as Record<string,unknown>).map(v=>typeof v==='string'?v:JSON.stringify(v))
  return [String(value)]
}
type EmergencyContact = { name?:string; relationship?:string; phone?:string }
function toContactList(value:unknown):EmergencyContact[] {
  let arr:unknown[] = []
  if(Array.isArray(value)) arr = value
  else if(typeof value==='string') {
    try { const p = JSON.parse(value); if(Array.isArray(p)) arr = p } catch { /* not JSON */ }
  } else if(value && typeof value==='object') arr = [value]
  return arr.filter(x=>x && typeof x==='object').map(x=>x as EmergencyContact)
}
function todayISO():string { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }
function isoDate(d:Date):string { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }
function startOfWeek(d:Date):Date {
  const copy = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const day = copy.getDay()
  copy.setDate(copy.getDate() + (day===0?-6:1-day))
  return copy
}
function bookingSortKey(b:Booking):string { return `${b.scheduled_date??''}T${b.scheduled_time??''}` }
// Picks the single most relevant booking to default to when nothing has
// been explicitly selected yet: an in-progress visit first, otherwise the
// nearest upcoming assigned/confirmed booking, mirroring the same
// real-data-only pattern used elsewhere in this app.
function pickRelevantBooking(bookings:Booking[]):Booking|null {
  if(!bookings.length) return null
  const active = bookings.find(b=>b.status==='in_progress')
  if(active) return active
  const today = todayISO()
  const upcoming = bookings
    .filter(b=>(b.status==='assigned'||b.status==='confirmed')&&b.scheduled_date&&b.scheduled_date>=today)
    .sort((a,b)=>bookingSortKey(a).localeCompare(bookingSortKey(b)))
  if(upcoming.length) return upcoming[0]
  const anyOpen = bookings
    .filter(b=>b.status==='assigned'||b.status==='confirmed')
    .sort((a,b)=>bookingSortKey(a).localeCompare(bookingSortKey(b)))
  if(anyOpen.length) return anyOpen[0]
  return bookings[0]
}

// ─── Booking Card ─────────────────────────────────────────────────────────────
function BookingCard({ b, onView, compact=false }:{ b:Booking; onView:()=>void; compact?:boolean }) {
  const st = statusMeta(b.status)
  const priColor = b.priority==='high'?C.error:b.priority==='medium'?C.warning:C.muted
  return (
    <Card hover style={{ overflow:'hidden', position:'relative' as const }} onClick={onView}>
      {b.recurring&&<div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${C.primary},${C.accent})` }}/>}
      <div style={{ padding:compact?'16px':'20px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
          <div style={{ flex:1, marginRight:10 }}>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' as const, marginBottom:6 }}>
              <Bdg label={st.label} color={st.color} dot />
              {b.priority==='high'&&<Bdg label="Priority" color={priColor} />}
              {b.recurring&&<Bdg label="Recurring" color={C.primary} />}
              {b.care_request?.urgent&&<Bdg label="Urgent" color={C.error} />}
            </div>
            <h3 style={{ fontSize:compact?12:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:3, lineHeight:1.3 }}>{serviceLabel(b.care_request)}</h3>
            <p style={{ fontSize:11, color:C.muted }}>{beneficiaryName(b.beneficiary)} · {clientName(b.client)}</p>
          </div>
          <div style={{ textAlign:'right' as const, flexShrink:0 }}>
            <p style={{ fontSize:15, fontWeight:900, color:C.success, fontFamily:'Manrope,sans-serif', lineHeight:1.1 }}>{fmt(b.payment_amount)}</p>
          </div>
        </div>
        <div style={{ display:'flex', gap:14, flexWrap:'wrap' as const, marginBottom:compact?0:10 }}>
          {[
            {i:I.calendar, v:`${formatDateLabel(b.scheduled_date)}${b.scheduled_time?` · ${formatTimeLabel(b.scheduled_time)}`:''}`},
            {i:I.clock,    v:b.duration||'Duration not set'},
            {i:I.pin,      v:locationLabel(b).split(',')[0]},
          ].map((m,i)=>(
            <div key={i} style={{ display:'flex', gap:4, alignItems:'center' }}>
              <span style={{color:C.muted,display:'flex',transform:'scale(0.9)'}}>{m.i}</span>
              <p style={{ fontSize:11, color:C.sub }}>{m.v}</p>
            </div>
          ))}
        </div>
        {!compact&&(
          <div style={{ display:'flex', gap:8, paddingTop:10, borderTop:`1px solid ${C.border}` }}>
            <Btn label="View Details" variant="secondary" small onClick={onView} />
          </div>
        )}
      </div>
    </Card>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ profile, bookings, unreadCount, onNav, onView, onToast, onConfirm }:{
  profile:{ full_name:string|null; preferred_name?:string|null }|null
  bookings:Booking[]; unreadCount:number
  onNav:(s:SubView)=>void; onView:(id:string)=>void; onToast:(m:string)=>void
  onConfirm:(id:string)=>void
}) {
  const today = todayISO()
  const todayJobs = bookings.filter(b=>b.scheduled_date===today && b.status!=='cancelled')
  const upcomingJobs = bookings.filter(b=>(b.status==='assigned'||b.status==='confirmed') && b.scheduled_date && b.scheduled_date>today)
  const activeJobs = bookings.filter(b=>b.status==='in_progress')
  const completedJobs = bookings.filter(b=>b.status==='completed')
  const cancelledJobs = bookings.filter(b=>b.status==='cancelled')
  const rescheduledJobs = bookings.filter(b=>b.status==='rescheduled')
  const pendingConfirmation = bookings.filter(b=>b.status==='assigned')
  const relevant = pickRelevantBooking(bookings)

  const quickActions = [
    {icon:I.nav,  label:'Navigate',       cb: relevant ? ()=>{ onView(relevant.id); onNav('route') } : ()=>onToast('No job selected yet') },
    {icon:I.phone,label:'Call Client',    cb: relevant?.client?.phone ? ()=>{ window.location.href = `tel:${relevant.client!.phone}` } : ()=>onToast('Client phone number not provided') },
    {icon:I.msg,  label:'Message Client', cb:()=>onToast('Messaging is not available yet')},
    {icon:I.user, label:'Beneficiary',    cb:()=>onNav('beneficiary')},
    {icon:I.doc,  label:'Documents',      cb:()=>onNav('documents')},
    {icon:I.alert,label:'Report Issue',   cb:()=>onNav('reportIssue')},
  ]

  const dateLabel = new Date().toLocaleDateString('en-US',{ weekday:'long', day:'numeric', month:'long', year:'numeric' })
  const greetName = profile?.preferred_name || profile?.full_name || 'Agent'

  return (
    <div style={{ padding:'24px 28px 60px' }}>
      {/* Header card */}
      <Card style={{ padding:'20px 24px', marginBottom:20, background:`linear-gradient(135deg,${C.primary},#00959E)`, border:'none', boxShadow:`0 8px 28px ${C.primary}30` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap' as const, gap:14 }}>
          <div>
            <p style={{ fontSize:12, color:'rgba(255,255,255,0.7)', marginBottom:4 }}>{dateLabel}</p>
            <h2 style={{ fontSize:22, fontWeight:900, color:'#fff', fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Good day, {greetName}</h2>
            <div style={{ display:'flex', gap:14, flexWrap:'wrap' as const }}>
              {[{v:todayJobs.length,l:'Today'},{v:upcomingJobs.length,l:'Upcoming'},{v:activeJobs.length,l:'Active'}].map((s,i)=>(
                <div key={i} style={{ textAlign:'center' as const }}>
                  <p style={{ fontSize:22, fontWeight:900, color:'#fff', fontFamily:'Manrope,sans-serif', lineHeight:1 }}>{s.v}</p>
                  <p style={{ fontSize:10, color:'rgba(255,255,255,0.65)' }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <Btn label="View Calendar" variant="secondary" small icon={I.calendar} onClick={()=>onNav('calendar')} />
          </div>
        </div>
      </Card>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }} className="jm-4col">
        {[
          {label:"Today's Jobs",  value:todayJobs.length,     color:C.primary},
          {label:'Upcoming Jobs', value:upcomingJobs.length,  color:C.info},
          {label:'Active Jobs',   value:activeJobs.length,    color:C.success},
          {label:'Completed Jobs',value:completedJobs.length, color:C.warning},
        ].map((k,i)=>(
          <Card key={i} style={{ padding:18 }}>
            <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:8 }}>{k.label}</p>
            <p style={{ fontSize:22, fontWeight:900, color:k.color, fontFamily:'Manrope,sans-serif', marginBottom:3, lineHeight:1 }}>{k.value}</p>
          </Card>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:18, marginBottom:18 }} className="jm-main-split">
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Today */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Today's Assignments" action="See All" onAction={()=>onNav('calendar')} />
            {todayJobs.length===0
              ? <p style={{ fontSize:13, color:C.muted }}>No assignments today.</p>
              : todayJobs.map(b=>(
                <div key={b.id} style={{ marginBottom:14 }}>
                  <BookingCard b={b} onView={()=>onView(b.id)} />
                </div>
              ))
            }
          </Card>

          {/* Upcoming */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Upcoming Visits" action={`View All (${upcomingJobs.length})`} onAction={()=>onNav('calendar')} />
            {upcomingJobs.length===0
              ? <p style={{ fontSize:13, color:C.muted }}>No upcoming visits scheduled.</p>
              : (
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {upcomingJobs.slice(0,3).map(b=><BookingCard key={b.id} b={b} onView={()=>onView(b.id)} compact />)}
                </div>
              )
            }
          </Card>
        </div>

        {/* Right col */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Quick actions */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Quick Actions" />
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
              {quickActions.map((a,i)=>(
                <button key={i} onClick={a.cb}
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

          {/* Pending confirmations */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Pending Confirmations" />
            {pendingConfirmation.length===0
              ? <p style={{ fontSize:12, color:C.muted }}>All assignments confirmed.</p>
              : pendingConfirmation.slice(0,3).map(b=>(
                <div key={b.id} style={{ padding:'10px 0', borderBottom:`1px solid ${C.border}` }}>
                  <p style={{ fontSize:12, fontWeight:700, color:C.type, marginBottom:3 }}>{serviceLabel(b.care_request)}</p>
                  <p style={{ fontSize:11, color:C.muted, marginBottom:6 }}>{formatDateLabel(b.scheduled_date)}{b.scheduled_time?` · ${formatTimeLabel(b.scheduled_time)}`:''}</p>
                  <div style={{ display:'flex', gap:6 }}>
                    <Btn label="Confirm" variant="success" small onClick={()=>onConfirm(b.id)} />
                    <Btn label="Reschedule" variant="ghost" small onClick={()=>{ onView(b.id); onNav('schedule') }} />
                  </div>
                </div>
              ))
            }
          </Card>

          {/* Cancelled / rescheduled */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Recent Updates" />
            {[...cancelledJobs, ...rescheduledJobs].length===0
              ? <p style={{ fontSize:12, color:C.muted }}>No recent changes.</p>
              : [...cancelledJobs, ...rescheduledJobs].slice(0,5).map(b=>(
                <div key={b.id} style={{ display:'flex', gap:10, alignItems:'center', padding:'8px 0', borderBottom:`1px solid ${C.border}` }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:statusMeta(b.status).color, flexShrink:0 }} />
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:12, fontWeight:600, color:C.type }}>{serviceLabel(b.care_request)}</p>
                    <p style={{ fontSize:11, color:C.muted }}>{statusMeta(b.status).label} · {formatDateLabel(b.scheduled_date)}</p>
                  </div>
                </div>
              ))
            }
          </Card>
        </div>
      </div>

      {/* Activity summary */}
      <Card style={{ padding:22 }}>
        <SectionTitle title="Activity Summary" action="Full Summary" onAction={()=>onNav('activity')} />
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }} className="jm-4col">
          {[
            {l:'Completed',   v:completedJobs.length},
            {l:'Cancelled',   v:cancelledJobs.length},
            {l:'Rescheduled', v:rescheduledJobs.length},
            {l:'Unread Notifications', v:unreadCount},
          ].map((s,i)=>(
            <div key={i} style={{ textAlign:'center' as const, padding:'10px', borderRadius:10, background:C.bg }}>
              <p style={{ fontSize:16, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>{s.v}</p>
              <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Job Details ──────────────────────────────────────────────────────────────
function JobDetails({ b, documents, documentsLoading, onBack, onNav, onToast, onOpenCareExecution }:{
  b:Booking; documents:BeneficiaryDocument[]; documentsLoading:boolean
  onBack:()=>void; onNav:(s:SubView)=>void; onToast:(m:string)=>void; onOpenCareExecution:()=>void
}) {
  const st = statusMeta(b.status)
  const ben = b.beneficiary
  const canExecute = b.status==='assigned'||b.status==='confirmed'||b.status==='in_progress'
  const executeLabel = b.status==='in_progress' ? 'Continue Visit' : 'Start Visit'
  // Preparation is only meaningful before the visit starts — not once it's
  // in progress (Care Execution owns that), and not once it's finished or
  // cancelled. Rescheduled bookings are read-only until the new schedule
  // is confirmed, matching Schedule Management's own treatment.
  const canPrepare = b.status==='assigned'||b.status==='confirmed'
  const conditions = toStringList(ben?.conditions)
  const mobility = ben?.mobility
  const allergies = toStringList(ben?.allergies)
  const languages = toStringList(ben?.pref_languages)
  const contacts = toContactList(ben?.emergency_contacts)

  return (
    <div style={{ maxWidth:820, margin:'0 auto', padding:'24px 28px 80px' }}>
      <button onClick={onBack} style={{ display:'flex', gap:6, alignItems:'center', background:'none', border:'none', cursor:'pointer', color:C.muted, fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:700, marginBottom:18, padding:0 }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Back to Dashboard
      </button>

      {/* Header */}
      <Card style={{ padding:'22px 26px', marginBottom:18, background:`linear-gradient(135deg,${C.surface},${C.bg}30)` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap' as const, gap:14 }}>
          <div>
            <div style={{ display:'flex', gap:6, marginBottom:8, flexWrap:'wrap' as const }}>
              <Bdg label={st.label} color={st.color} dot />
              {b.priority==='high'&&<Bdg label="High Priority" color={C.error} />}
              {b.recurring&&<Bdg label="Recurring" color={C.primary} />}
              {b.care_request?.urgent&&<Bdg label="Urgent" color={C.error} />}
            </div>
            <h1 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:5, lineHeight:1.2 }}>{serviceLabel(b.care_request)}</h1>
            <div style={{ display:'flex', gap:16, flexWrap:'wrap' as const }}>
              {[
                {i:I.calendar, v:`${formatDateLabel(b.scheduled_date)}${b.scheduled_time?`, ${formatTimeLabel(b.scheduled_time)}`:''}`},
                {i:I.clock,    v:b.duration || 'Duration not set'},
                {i:I.pin,      v:locationLabel(b)},
              ].map((m,i)=>(
                <div key={i} style={{ display:'flex', gap:5, alignItems:'center' }}>
                  <span style={{color:C.muted,display:'flex'}}>{m.i}</span>
                  <p style={{ fontSize:12, color:C.sub }}>{m.v}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ textAlign:'right' as const }}>
            <p style={{ fontSize:26, fontWeight:900, color:C.success, fontFamily:'Manrope,sans-serif', lineHeight:1 }}>{fmt(b.payment_amount)}</p>
            <p style={{ fontSize:11, color:C.muted, marginBottom:12 }}>Gross Job Amount</p>
          </div>
        </div>
        <div style={{ display:'flex', gap:8, marginTop:16, paddingTop:16, borderTop:`1px solid ${C.border}`, flexWrap:'wrap' as const }}>
          {canExecute&&<Btn label={executeLabel} icon={I.nav} onClick={onOpenCareExecution} />}
          {canPrepare&&<Btn label="Visit Preparation" variant="secondary" icon={I.check} onClick={()=>onNav('preparation')} />}
          <Btn label="Open Route" variant="ghost" small icon={I.map} onClick={()=>onNav('route')} />
          <Btn label="Message Client" variant="ghost" small icon={I.msg} onClick={()=>onToast('Messaging is not available yet')} />
        </div>
      </Card>

      <div style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:16 }} className="jm-split">
        {/* Left */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Beneficiary */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Beneficiary Information" action="Full Profile" onAction={()=>onNav('beneficiary')} />
            <div style={{ display:'flex', gap:12, alignItems:'flex-start', marginBottom:14 }}>
              <div style={{ width:48, height:48, borderRadius:'50%', background:`${C.accent}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>👤</div>
              <div>
                <p style={{ fontSize:15, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{beneficiaryName(ben)}</p>
                <p style={{ fontSize:12, color:C.muted }}>
                  {ben?.age!=null ? `Age ${ben.age}` : ben?.dob ? `Age ${computeAgeFromDob(ben.dob) ?? 'Not provided'}` : 'Age not provided'} · {ben?.gender || 'Gender not provided'}
                </p>
                {mobility&&<Bdg label={mobility} color={C.warning} />}
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
              {[
                {l:'Medical Conditions', v: conditions.length ? conditions.join(', ') : 'Not provided'},
                {l:'Mobility',           v: mobility || 'Not provided'},
                {l:'Allergies',          v: allergies.length ? allergies.join(', ') : 'Not provided'},
                {l:'Preferred Languages',v: languages.length ? languages.join(', ') : 'Not provided'},
              ].map((r,i)=>(
                <div key={i} style={{ padding:'10px 12px', borderRadius:10, background:C.bg }}>
                  <p style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.06em', marginBottom:3 }}>{r.l}</p>
                  <p style={{ fontSize:12, fontWeight:600, color:C.type }}>{r.v}</p>
                </div>
              ))}
            </div>
            {(ben?.special_req||ben?.med_notes)&&(
              <div style={{ padding:'12px', borderRadius:12, background:`${C.warning}08`, border:`1.5px solid ${C.warning}20` }}>
                <p style={{ fontSize:11, fontWeight:800, color:C.warning, marginBottom:4 }}>Special Instructions</p>
                <p style={{ fontSize:12, color:C.type, lineHeight:1.7 }}>{ben?.special_req || ben?.med_notes}</p>
              </div>
            )}
          </Card>

          {/* Client */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Client Information" />
            <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:14 }}>
              <Avatar initials={initials(b.client?.full_name)} size={44} />
              <div>
                <p style={{ fontSize:14, fontWeight:700, color:C.type }}>{clientName(b.client)}</p>
                <p style={{ fontSize:11, color:C.muted }}>{b.client?.phone || 'Phone not provided'}</p>
              </div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <Btn label="Message" variant="secondary" small icon={I.msg} full onClick={()=>onToast('Messaging is not available yet')} />
              {b.client?.phone
                ? <a href={`tel:${b.client.phone}`} style={{ flex:1, textDecoration:'none' }}><Btn label="Call" variant="ghost" small icon={I.phone} full /></a>
                : <Btn label="Call" variant="ghost" small icon={I.phone} full disabled />
              }
            </div>
          </Card>

          {/* Emergency contacts */}
          <Card style={{ padding:22, border:`1.5px solid ${C.error}20`, background:`${C.error}04` }}>
            <SectionTitle title="Emergency Contacts" />
            {contacts.length===0
              ? <p style={{ fontSize:12, color:C.muted }}>No emergency contacts on file.</p>
              : contacts.map((ec,i)=>(
                <div key={i} style={{ display:'flex', gap:10, alignItems:'center', padding:'8px 0', borderBottom:i<contacts.length-1?`1px solid ${C.border}`:'none' }}>
                  <Avatar initials={initials(ec.name)} color={C.error} size={36} />
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{ec.name || 'Not provided'}{ec.relationship?` · ${ec.relationship}`:''}</p>
                    <p style={{ fontSize:11, color:C.muted }}>{ec.phone || 'Phone not provided'}</p>
                  </div>
                  {ec.phone&&<a href={`tel:${ec.phone}`} style={{ width:30, height:30, borderRadius:9, background:`${C.error}10`, color:C.error, display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{display:'flex'}}>{I.phone}</span></a>}
                </div>
              ))
            }
          </Card>
        </div>

        {/* Right */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Schedule details */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Schedule Details" />
            {[
              {l:'Date', v:formatDateLabel(b.scheduled_date)},
              {l:'Time', v:b.scheduled_time?formatTimeLabel(b.scheduled_time):'Not provided'},
              {l:'Duration', v:b.duration||'Not provided'},
              {l:'Recurring', v:b.recurring?'Yes':'No'},
              {l:'Confirmed', v:b.confirmed?'Yes':'No'},
            ].map((r,i)=>(
              <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:i<4?`1px solid ${C.border}`:'none' }}>
                <p style={{ fontSize:12, color:C.muted }}>{r.l}</p>
                <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{r.v}</p>
              </div>
            ))}
          </Card>

          {/* Documents */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Documents" action="View All" onAction={()=>onNav('documents')} />
            {documentsLoading
              ? <p style={{ fontSize:12, color:C.muted }}>Loading documents…</p>
              : documents.length===0
                ? <p style={{ fontSize:12, color:C.muted }}>No documents available.</p>
                : documents.slice(0,3).map(doc=>(
                  <div key={doc.id} style={{ display:'flex', gap:10, alignItems:'center', padding:'8px 0', borderBottom:`1px solid ${C.border}` }}>
                    <div style={{ width:32, height:32, borderRadius:9, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary }}>
                      <span style={{display:'flex'}}>{I.doc}</span>
                    </div>
                    <p style={{ flex:1, fontSize:12, color:C.type }}>{doc.name || doc.type || 'Untitled document'}</p>
                    {doc.file_url&&<a href={doc.file_url} target="_blank" rel="noreferrer" style={{ color:C.muted, display:'flex' }}><span style={{display:'flex'}}>{I.download}</span></a>}
                  </div>
                ))
            }
          </Card>

          {/* Payment */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Payment" />
            <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 0' }}>
              <p style={{ fontSize:12, color:C.sub }}>Gross Job Amount</p>
              <p style={{ fontSize:14, fontWeight:900, color:C.success, fontFamily:'Manrope,sans-serif' }}>{fmt(b.payment_amount)}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ─── Visit Preparation (local-only, not persisted) ─────────────────────────────
// Guarded by real booking status, independent of whether the "Visit
// Preparation" button was ever shown — reachable directly via the sidebar
// regardless of which job is currently selected.
function Preparation({ b, onOpenCareExecution }:{ b:Booking|null; onOpenCareExecution:()=>void }) {
  if(!b) return <EmptyPage title="Visit Preparation" message="Select a job from the Dashboard or Calendar to prepare for it." />

  if(b.status==='completed') {
    return <EmptyPage title="Visit Preparation" message="This visit has already been completed. Visit preparation is no longer available." />
  }
  if(b.status==='cancelled') {
    return <EmptyPage title="Visit Preparation" message="This booking was cancelled. Visit preparation is not available." />
  }
  if(b.status==='rescheduled') {
    return <EmptyPage title="Visit Preparation" message="This booking has been rescheduled. Review the updated schedule before preparing for the visit." />
  }
  if(b.status==='in_progress') {
    return (
      <div style={{ maxWidth:640, margin:'0 auto', padding:'24px 28px 60px' }}>
        <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Visit Preparation</h2>
        <Card style={{ padding:40, textAlign:'center' as const }}>
          <p style={{ fontSize:13, color:C.muted, marginBottom:16 }}>This visit is already in progress. Continue the visit in Care Execution.</p>
          <Btn label="Continue Visit" onClick={onOpenCareExecution} />
        </Card>
      </div>
    )
  }

  // Only assigned/confirmed bookings reach the editable checklist below.
  const loc = locationLabel(b)
  const items = [
    {l:'Review beneficiary care notes',              cat:'planning'},
    {l:`Confirm route to ${loc}`,                     cat:'travel'},
    {l:'Charge phone to 100%',                        cat:'equipment'},
    {l:'Bring required care equipment',               cat:'equipment'},
    {l:'Confirm appointment time with client',        cat:'communication'},
    {l:'Review medication list for the beneficiary',  cat:'medical'},
    {l:'Prepare consent and ID documents',            cat:'documentation'},
    {l:'Set navigation to destination',               cat:'travel'},
  ]
  const [checked, setChecked] = useState<Set<number>>(new Set())
  const pct = Math.round((checked.size/items.length)*100)
  const catColors: Record<string,string> = { planning:C.info, travel:C.primary, equipment:C.accent, communication:C.success, medical:C.error, documentation:C.warning }

  return (
    <div style={{ maxWidth:680, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>Visit Preparation</h2>
      <p style={{ fontSize:13, color:C.muted, marginBottom:6 }}>{serviceLabel(b.care_request)} · {formatDateLabel(b.scheduled_date)}{b.scheduled_time?`, ${formatTimeLabel(b.scheduled_time)}`:''}</p>
      <p style={{ fontSize:11, color:C.muted, marginBottom:22 }}>This checklist is local to your device for this session only — it isn't saved.</p>

      <Card style={{ padding:22, marginBottom:18, background:`linear-gradient(135deg,${C.primary}06,${C.surface})`, border:`1.5px solid ${C.primary}20` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <p style={{ fontSize:13, fontWeight:700, color:C.type }}>Preparation Progress</p>
          <p style={{ fontSize:22, fontWeight:900, color:pct===100?C.success:C.primary, fontFamily:'Manrope,sans-serif' }}>{pct}%</p>
        </div>
        <div style={{ height:10, borderRadius:99, background:`${C.primary}12`, overflow:'hidden', marginBottom:8 }}>
          <div style={{ width:`${pct}%`, height:'100%', background:`linear-gradient(90deg,${C.primary},${C.success})`, borderRadius:99, transition:'width 0.4s' }} />
        </div>
        <p style={{ fontSize:11, color:C.muted }}>{checked.size} of {items.length} tasks complete</p>
      </Card>

      <Card style={{ padding:22 }}>
        <SectionTitle title="Checklist" />
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {items.map((item,i)=>{
            const done = checked.has(i)
            const col = catColors[item.cat]
            return (
              <button key={i} onClick={()=>setChecked(s=>{ const n=new Set(s); done?n.delete(i):n.add(i); return n })}
                style={{ display:'flex', gap:12, alignItems:'center', padding:'12px 14px', borderRadius:12, border:`1.5px solid ${done?col+'30':C.border}`, background:done?`${col}06`:C.bg, cursor:'pointer', textAlign:'left' as const, transition:'all 0.15s' }}>
                <div style={{ width:24, height:24, borderRadius:8, background:done?col:`${col}15`, border:`2px solid ${done?col:C.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.15s' }}>
                  {done&&<span style={{display:'flex',color:'#fff',transform:'scale(0.7)'}}>{I.check}</span>}
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:13, color:done?C.muted:C.type, fontWeight:done?500:600, textDecoration:done?'line-through':undefined, fontFamily:'Manrope,sans-serif' }}>{item.l}</p>
                </div>
                <span style={{ padding:'2px 8px', borderRadius:99, fontSize:10, fontWeight:700, background:`${col}10`, color:col }}>{item.cat}</span>
              </button>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

// ─── Calendar ─────────────────────────────────────────────────────────────────
function CalendarView({ bookings, onView }:{ bookings:Booking[]; onView:(id:string)=>void }) {
  const [view, setView] = useState<'daily'|'weekly'|'monthly'>('weekly')
  const now = new Date()
  const [selectedDate, setSelectedDate] = useState(todayISO())

  const byDate = useMemo(()=>{
    const map = new Map<string,Booking[]>()
    bookings.forEach(b=>{
      if(!b.scheduled_date) return
      const arr = map.get(b.scheduled_date) ?? []
      arr.push(b)
      map.set(b.scheduled_date, arr)
    })
    return map
  }, [bookings])

  const weekStart = startOfWeek(now)
  const weekDays = Array.from({length:7},(_,i)=>{ const d = new Date(weekStart); d.setDate(d.getDate()+i); return d })

  const monthYear = now.getFullYear(), monthIdx = now.getMonth()
  const firstOfMonth = new Date(monthYear, monthIdx, 1)
  const daysInMonth = new Date(monthYear, monthIdx+1, 0).getDate()
  const leadingBlanks = (firstOfMonth.getDay()+6)%7
  const monthLabel = now.toLocaleDateString('en-US',{ month:'long', year:'numeric' })
  const selectedJobs = (byDate.get(selectedDate) ?? []).filter(b=>b.status!=='cancelled')

  return (
    <div style={{ padding:'28px 32px 60px', maxWidth:900 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
        <div>
          <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>Schedule</h2>
          <p style={{ fontSize:13, color:C.muted }}>{monthLabel} · {bookings.filter(b=>b.status!=='cancelled').length} bookings</p>
        </div>
        <div style={{ display:'flex', gap:4, borderRadius:12, border:`1.5px solid ${C.border}`, overflow:'hidden' }}>
          {(['daily','weekly','monthly'] as const).map(v=>(
            <button key={v} onClick={()=>setView(v)} style={{ padding:'8px 16px', border:'none', cursor:'pointer', background:view===v?C.primary:'#FAFAFA', color:view===v?'#fff':C.sub, fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:700, transition:'all 0.12s' }}>
              {v.charAt(0).toUpperCase()+v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {view==='weekly'&&(
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:10 }}>
          {weekDays.map(d=>{
            const ds = isoDate(d)
            const jobs = (byDate.get(ds)??[]).filter(b=>b.status!=='cancelled')
            const isSel = ds===selectedDate
            return (
              <div key={ds} onClick={()=>setSelectedDate(ds)} style={{ cursor:'pointer', borderRadius:14, border:`2px solid ${isSel?C.primary:C.border}`, background:isSel?`${C.primary}06`:C.surface, padding:12, minHeight:120, transition:'all 0.15s' }}>
                <p style={{ fontSize:10, fontWeight:800, color:isSel?C.primary:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.06em', marginBottom:4 }}>{d.toLocaleDateString('en-US',{weekday:'short'})}</p>
                <p style={{ fontSize:18, fontWeight:900, color:isSel?C.primary:C.type, fontFamily:'Manrope,sans-serif', marginBottom:8 }}>{d.getDate()}</p>
                {jobs.map(j=>(
                  <div key={j.id} onClick={e=>{ e.stopPropagation(); onView(j.id) }} style={{ padding:'4px 7px', borderRadius:6, background:`${statusMeta(j.status).color}15`, marginBottom:4, cursor:'pointer' }}>
                    <p style={{ fontSize:9, fontWeight:700, color:statusMeta(j.status).color, lineHeight:1.3 }}>{formatTimeLabel(j.scheduled_time)} {serviceLabel(j.care_request).split(' ')[0]}</p>
                  </div>
                ))}
                {jobs.length===0&&<p style={{ fontSize:10, color:C.muted }}>Free</p>}
              </div>
            )
          })}
        </div>
      )}

      {view==='monthly'&&(
        <Card style={{ padding:24 }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2, marginBottom:8 }}>
            {['M','T','W','T','F','S','S'].map((d,i)=><p key={i} style={{ fontSize:10, fontWeight:800, color:C.muted, textAlign:'center' as const, padding:'4px 0' }}>{d}</p>)}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4 }}>
            {Array.from({length:leadingBlanks}).map((_,i)=><div key={`e${i}`}/>)}
            {Array.from({length:daysInMonth},(_,i)=>i+1).map(dNum=>{
              const ds = `${monthYear}-${String(monthIdx+1).padStart(2,'0')}-${String(dNum).padStart(2,'0')}`
              const hasJob = byDate.has(ds)
              const isSel = ds===selectedDate
              return (
                <button key={ds} onClick={()=>setSelectedDate(ds)} style={{ aspectRatio:'1', borderRadius:10, border:`1.5px solid ${isSel?C.primary:hasJob?`${C.primary}20`:'transparent'}`, background:isSel?C.primary:hasJob?`${C.primary}06`:'transparent', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2 }}>
                  <p style={{ fontSize:12, fontWeight:isSel||hasJob?800:400, color:isSel?'#fff':hasJob?C.primary:C.type }}>{dNum}</p>
                  {hasJob&&<div style={{ width:4, height:4, borderRadius:'50%', background:isSel?'rgba(255,255,255,0.8)':C.primary }}/>}
                </button>
              )
            })}
          </div>
        </Card>
      )}

      {view==='daily'&&(
        <Card style={{ padding:22 }}>
          <SectionTitle title={`${formatDateLabel(selectedDate)} — Day View`} />
          {selectedJobs.length===0
            ? <p style={{ fontSize:13, color:C.muted }}>No jobs scheduled for this day.</p>
            : [...selectedJobs].sort((a,b)=>(a.scheduled_time??'').localeCompare(b.scheduled_time??'')).map(j=>(
              <div key={j.id} onClick={()=>onView(j.id)} style={{ display:'flex', gap:14, paddingBottom:14, cursor:'pointer' }}>
                <p style={{ fontSize:11, fontWeight:700, color:C.muted, width:70, flexShrink:0 }}>{formatTimeLabel(j.scheduled_time)||'Time TBD'}</p>
                <div style={{ flex:1, padding:'10px 14px', borderRadius:10, background:`${C.primary}08`, border:`1px solid ${C.primary}20` }}>
                  <p style={{ fontSize:12, fontWeight:600, color:C.type }}>{serviceLabel(j.care_request)} — {beneficiaryName(j.beneficiary)}</p>
                </div>
              </div>
            ))
          }
        </Card>
      )}

      {(view==='weekly'||view==='monthly')&&(
        <div style={{ marginTop:18 }}>
          <p style={{ fontSize:13, fontWeight:700, color:C.muted, marginBottom:10 }}>{formatDateLabel(selectedDate)} — {selectedJobs.length} assignment(s)</p>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {selectedJobs.length===0
              ? <p style={{ fontSize:12, color:C.muted }}>No jobs scheduled for this day.</p>
              : selectedJobs.map(b=><BookingCard key={b.id} b={b} onView={()=>onView(b.id)} compact />)
            }
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Route Planning ───────────────────────────────────────────────────────────
function RoutePlanning({ b }:{ b:Booking|null }) {
  if(!b) return <EmptyPage title="Route Planning" message="Select a job from the Dashboard or Calendar to view its destination." />
  const loc = locationLabel(b)
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc)}`
  return (
    <div style={{ maxWidth:700, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Route Planning</h2>
      <Card style={{ padding:22 }}>
        <SectionTitle title="Destination" />
        <div style={{ display:'flex', gap:8, alignItems:'flex-start', padding:'14px', borderRadius:12, background:C.bg, marginBottom:16 }}>
          <span style={{ color:C.primary, display:'flex', marginTop:2 }}>{I.pin}</span>
          <div>
            <p style={{ fontSize:14, fontWeight:700, color:C.type }}>{serviceLabel(b.care_request)}</p>
            <p style={{ fontSize:12, color:C.muted }}>{loc}</p>
          </div>
        </div>
        <p style={{ fontSize:11, color:C.muted, marginBottom:16 }}>Live distance, ETA, traffic and weather aren't available yet — open the destination directly in your maps app.</p>
        <a href={mapsUrl} target="_blank" rel="noreferrer" style={{ textDecoration:'none' }}>
          <Btn label="Open in Maps" icon={I.nav} full />
        </a>
      </Card>
    </div>
  )
}

// ─── Beneficiary Profile ──────────────────────────────────────────────────────
function BeneficiaryProfile({ b }:{ b:Booking|null }) {
  if(!b) return <EmptyPage title="Beneficiary Profile" message="Select a job from the Dashboard or Calendar to view its beneficiary profile." />
  const ben = b.beneficiary
  if(!ben) return <EmptyPage title="Beneficiary Profile" message="No beneficiary information is linked to this booking." />

  const age = ben.age ?? (ben.dob ? computeAgeFromDob(ben.dob) : null)
  const conditions = toStringList(ben.conditions)
  const medications = toStringList(ben.medications)
  const allergies = toStringList(ben.allergies)
  const languages = toStringList(ben.pref_languages)
  const contacts = toContactList(ben.emergency_contacts)

  return (
    <div style={{ maxWidth:720, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Beneficiary Profile</h2>
      <Card style={{ padding:24, marginBottom:16 }}>
        <div style={{ display:'flex', gap:16, alignItems:'flex-start', marginBottom:20 }}>
          <div style={{ width:72, height:72, borderRadius:'50%', background:`${C.accent}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, flexShrink:0 }}>👤</div>
          <div>
            <h3 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>{beneficiaryName(ben)}</h3>
            <p style={{ fontSize:13, color:C.muted, marginBottom:8 }}>
              {age!=null?`Age ${age}`:'Age not provided'} · {ben.gender||'Gender not provided'}{ben.relationship?` · ${ben.relationship}`:''}
            </p>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' as const }}>
              {ben.mobility&&<Bdg label={ben.mobility} color={C.warning} />}
              {ben.blood_group&&<Bdg label={`Blood: ${ben.blood_group}`} color={C.error} />}
            </div>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }} className="jm-4col">
          {[
            {l:'Age', v: age!=null?String(age):'Not provided'},
            {l:'Gender', v: ben.gender||'Not provided'},
            {l:'Relationship', v: ben.relationship||'Not provided'},
            {l:'Mobility', v: ben.mobility||'Not provided'},
          ].map((s,i)=>(
            <div key={i} style={{ padding:'10px 12px', borderRadius:12, background:C.bg, textAlign:'center' as const }}>
              <p style={{ fontSize:10, fontWeight:700, color:C.muted, marginBottom:4 }}>{s.l}</p>
              <p style={{ fontSize:13, fontWeight:800, color:C.type }}>{s.v}</p>
            </div>
          ))}
        </div>
      </Card>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="jm-2col">
        <Card style={{ padding:22 }}>
          <SectionTitle title="Medical Information" />
          {[
            {l:'Conditions', v: conditions.length?conditions.join(', '):'Not provided'},
            {l:'Medications', v: medications.length?medications.join(', '):'Not provided'},
            {l:'Allergies', v: allergies.length?allergies.join(', '):'Not provided'},
            {l:'Doctor', v: ben.doctor||'Not provided'},
            {l:'Hospital', v: ben.hospital||'Not provided'},
            {l:'Vision', v: ben.vision||'Not provided'},
            {l:'Hearing', v: ben.hearing||'Not provided'},
            {l:'Memory', v: ben.memory||'Not provided'},
            {l:'Medical Notes', v: ben.med_notes||'Not provided'},
          ].map((r,i)=>(
            <div key={i} style={{ display:'flex', gap:9, alignItems:'flex-start', marginBottom:10 }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:C.error, marginTop:5, flexShrink:0 }} />
              <p style={{ fontSize:12, color:C.type, lineHeight:1.5 }}><strong>{r.l}:</strong> {r.v}</p>
            </div>
          ))}
        </Card>
        <Card style={{ padding:22 }}>
          <SectionTitle title="Preferences" />
          {[
            {l:'Preferred Languages', v: languages.length?languages.join(', '):'Not provided'},
            {l:'Dietary', v: ben.dietary||'Not provided'},
            {l:'Special Requirements', v: ben.special_req||'Not provided'},
            {l:'Address', v: ben.address||'Not provided'},
          ].map((r,i)=>(
            <div key={i} style={{ display:'flex', gap:9, alignItems:'flex-start', marginBottom:10 }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:C.primary, marginTop:5, flexShrink:0 }} />
              <p style={{ fontSize:12, color:C.type, lineHeight:1.5 }}><strong>{r.l}:</strong> {r.v}</p>
            </div>
          ))}
        </Card>
      </div>
      <Card style={{ padding:22, marginTop:14, border:`1.5px solid ${C.error}20`, background:`${C.error}04` }}>
        <SectionTitle title="Emergency Contacts" />
        {contacts.length===0
          ? <p style={{ fontSize:12, color:C.muted }}>No emergency contacts on file.</p>
          : contacts.map((ec,i)=>(
            <div key={i} style={{ display:'flex', gap:10, alignItems:'center', padding:'8px 0', borderBottom:i<contacts.length-1?`1px solid ${C.border}`:'none' }}>
              <Avatar initials={initials(ec.name)} color={C.error} size={36} />
              <div style={{ flex:1 }}>
                <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{ec.name||'Not provided'}{ec.relationship?` · ${ec.relationship}`:''}</p>
                <p style={{ fontSize:11, color:C.muted }}>{ec.phone||'Phone not provided'}</p>
              </div>
            </div>
          ))
        }
      </Card>
    </div>
  )
}

// ─── Document Center ──────────────────────────────────────────────────────────
function DocumentCenter({ beneficiary, documents, loading, error }:{
  beneficiary:BeneficiaryInfo; documents:BeneficiaryDocument[]; loading:boolean; error:string|null
}) {
  if(!beneficiary) return <EmptyPage title="Document Center" message="Select a job from the Dashboard or Calendar to view its beneficiary's documents." />
  if(loading) return <div style={{ padding:'24px 28px 60px' }}><p style={{ fontSize:13, color:C.muted }}>Loading documents…</p></div>
  if(error) return <div style={{ padding:'24px 28px 60px' }}><p style={{ fontSize:13, color:C.error }}>{error}</p></div>

  const cats = [...new Set(documents.map(d=>d.type||'Other'))]

  return (
    <div style={{ maxWidth:700, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Document Center</h2>
      {documents.length===0 ? (
        <Card style={{ padding:40, textAlign:'center' as const }}>
          <p style={{ fontSize:13, color:C.muted }}>No documents available.</p>
        </Card>
      ) : cats.map(cat=>(
        <div key={cat} style={{ marginBottom:20 }}>
          <p style={{ fontSize:12, fontWeight:800, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.07em', marginBottom:10 }}>{cat}</p>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {documents.filter(d=>(d.type||'Other')===cat).map(doc=>(
              <Card key={doc.id} hover style={{ padding:16 }}>
                <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary }}>
                    <span style={{display:'flex'}}>{I.doc}</span>
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:2 }}>{doc.name || 'Untitled document'}</p>
                    <p style={{ fontSize:11, color:C.muted }}>
                      {doc.uploaded_at ? `Added ${formatDateLabel(doc.uploaded_at)}` : 'Upload date not recorded'}
                      {doc.expiry_date ? ` · Expires ${formatDateLabel(doc.expiry_date)}` : ''}
                    </p>
                  </div>
                  {doc.file_url
                    ? <a href={doc.file_url} target="_blank" rel="noreferrer" style={{ textDecoration:'none' }}><Btn label="Open" variant="secondary" small icon={I.download} /></a>
                    : <p style={{ fontSize:11, color:C.muted }}>File not available</p>
                  }
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Schedule Management (read-only; reschedule requests not supported) ───────
function ScheduleManagement({ b }:{ b:Booking|null }) {
  if(!b) return <EmptyPage title="Schedule Management" message="Select a job from the Dashboard or Calendar to view its schedule." />
  return (
    <div style={{ maxWidth:640, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Schedule Management</h2>
      <Card style={{ padding:24, marginBottom:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
          <div>
            <p style={{ fontSize:13, fontWeight:800, color:C.type, marginBottom:4 }}>Current Schedule</p>
            <p style={{ fontSize:15, fontWeight:900, color:C.primary, fontFamily:'Manrope,sans-serif' }}>{formatDateLabel(b.scheduled_date)}{b.scheduled_time?`, ${formatTimeLabel(b.scheduled_time)}`:''}</p>
            <p style={{ fontSize:12, color:C.muted }}>{b.duration||'Duration not set'} · {locationLabel(b)}</p>
          </div>
          <Bdg label={statusMeta(b.status).label} color={statusMeta(b.status).color} dot />
        </div>
      </Card>
      <Card style={{ padding:22, border:`1.5px solid ${C.warning}30`, background:`${C.warning}06` }}>
        <p style={{ fontSize:13, fontWeight:800, color:C.type, marginBottom:6 }}>Reschedule requests aren't available yet</p>
        <p style={{ fontSize:12, color:C.sub, lineHeight:1.6, marginBottom:14 }}>This workflow needs client approval and reschedule-history tracking that hasn't been built yet. Please contact the client or ReadyPal Support directly if the schedule needs to change.</p>
        <Btn label="Request Reschedule" disabled />
      </Card>
    </div>
  )
}

// ─── Cancellation Management ──────────────────────────────────────────────────
function CancellationManagement({ bookings, onSubmitReport, onToast }:{
  bookings:Booking[]; onSubmitReport:(subject:string)=>Promise<void>; onToast:(m:string, kind?:'success'|'error')=>void
}) {
  const cancelled = bookings.filter(b=>b.status==='cancelled')
  const [openId, setOpenId] = useState<string|null>(null)
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if(cancelled.length===0) return <EmptyPage title="Cancellations" message="You have no cancelled bookings." />

  async function submit(b:Booking) {
    const trimmed = reason.trim()
    if(!trimmed) { onToast('Please describe the issue', 'error'); return }
    setSubmitting(true)
    try {
      await onSubmitReport(`Cancelled booking issue — ${serviceLabel(b.care_request)} (${formatDateLabel(b.scheduled_date)}): ${trimmed}`)
      onToast('Report submitted successfully', 'success')
      setReason(''); setOpenId(null)
    } catch(e:any) {
      // Keep the reason text so the user can retry.
      onToast(e?.message || 'Could not submit report. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth:640, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Cancellations</h2>
      {cancelled.map(b=>(
        <Card key={b.id} style={{ padding:22, marginBottom:16, border:`1.5px solid ${C.error}30`, background:`${C.error}04` }}>
          <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:12 }}>
            <div style={{ width:36, height:36, borderRadius:12, background:`${C.error}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>❌</div>
            <div>
              <p style={{ fontSize:13, fontWeight:800, color:C.error }}>Booking Cancelled</p>
              <p style={{ fontSize:11, color:C.muted }}>{formatDateLabel(b.scheduled_date)}{b.scheduled_time?`, ${formatTimeLabel(b.scheduled_time)}`:''}</p>
            </div>
          </div>
          <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:4 }}>{serviceLabel(b.care_request)}</p>
          <p style={{ fontSize:12, color:C.muted, marginBottom:14 }}>{clientName(b.client)} → {beneficiaryName(b.beneficiary)}</p>
          {openId===b.id ? (
            <>
              <textarea value={reason} onChange={e=>setReason(e.target.value)} rows={3} placeholder="Describe any issues or request a review…"
                style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, background:'#FAFAFA', outline:'none', resize:'vertical' as const, boxSizing:'border-box' as const, lineHeight:1.6, marginBottom:12 }} />
              <div style={{ display:'flex', gap:8 }}>
                <Btn label={submitting?'Submitting…':'Submit Report'} variant="danger" onClick={()=>submit(b)} disabled={submitting} />
                <Btn label="Cancel" variant="ghost" onClick={()=>{ setOpenId(null); setReason('') }} />
              </div>
            </>
          ) : (
            <Btn label="Report an Issue" variant="secondary" small onClick={()=>setOpenId(b.id)} />
          )}
        </Card>
      ))}
    </div>
  )
}

// ─── Reminders (derived from real upcoming bookings, session-only dismiss) ────
function Reminders({ bookings }:{ bookings:Booking[] }) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const in3days = new Date(startOfToday); in3days.setDate(in3days.getDate()+3)

  const upcoming = bookings
    .filter(b=>{
      if(b.status!=='assigned'&&b.status!=='confirmed') return false
      if(!b.scheduled_date) return false
      const d = new Date(`${b.scheduled_date}T00:00:00`)
      return d>=startOfToday && d<=in3days
    })
    .sort((a,b)=>bookingSortKey(a).localeCompare(bookingSortKey(b)))

  const active = upcoming.filter(b=>!dismissed.has(b.id))

  return (
    <div style={{ maxWidth:660, margin:'0 auto', padding:'24px 28px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
        <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Reminders</h2>
        <Bdg label={`${active.length} active`} color={C.primary} dot />
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {active.length===0 ? (
          <div style={{ textAlign:'center' as const, padding:'60px 20px' }}>
            <div style={{ fontSize:48, marginBottom:14 }}>✅</div>
            <p style={{ fontSize:15, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>All caught up!</p>
            <p style={{ fontSize:13, color:C.muted }}>No upcoming visits in the next 3 days.</p>
          </div>
        ) : active.map(b=>(
          <Card key={b.id} style={{ padding:20 }}>
            <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
              <div style={{ width:44, height:44, borderRadius:14, background:`${C.primary}12`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>📅</div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:4 }}>Upcoming Visit</p>
                <p style={{ fontSize:12, color:C.sub, lineHeight:1.6, marginBottom:10 }}>{serviceLabel(b.care_request)} — {formatDateLabel(b.scheduled_date)}{b.scheduled_time?`, ${formatTimeLabel(b.scheduled_time)}`:''} at {locationLabel(b)}</p>
                <Btn label="Dismiss" variant="ghost" small onClick={()=>setDismissed(s=>new Set([...s,b.id]))} />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <p style={{ fontSize:11, color:C.muted, marginTop:14 }}>Dismissing a reminder only hides it for this session — it isn't saved.</p>
    </div>
  )
}

// ─── Status (read-only; real lifecycle is owned by Care Execution) ────────────
function StatusCenter({ b, onOpenCareExecution }:{ b:Booking|null; onOpenCareExecution:()=>void }) {
  if(!b) return <EmptyPage title="Status" message="Select a job from the Dashboard or Calendar to view its status." />
  const st = statusMeta(b.status)
  const canExecute = b.status==='assigned'||b.status==='confirmed'||b.status==='in_progress'
  return (
    <div style={{ maxWidth:660, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Status</h2>
      <p style={{ fontSize:13, color:C.muted, marginBottom:22 }}>Status changes automatically as the visit progresses in Care Execution — it isn't set manually here.</p>
      <Card style={{ padding:24 }}>
        <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:16 }}>
          <div style={{ width:14, height:14, borderRadius:'50%', background:st.color }} />
          <p style={{ fontSize:18, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>{st.label}</p>
        </div>
        <p style={{ fontSize:13, color:C.sub, marginBottom:canExecute?16:0 }}>{serviceLabel(b.care_request)} · {beneficiaryName(b.beneficiary)}</p>
        {canExecute&&<Btn label={b.status==='in_progress'?'Continue Visit':'Start Visit'} onClick={onOpenCareExecution} />}
      </Card>
    </div>
  )
}

// ─── Activity Feed (honest summary — no fabricated event log) ─────────────────
function ActivityFeed({ bookings }:{ bookings:Booking[] }) {
  const completed = bookings.filter(b=>b.status==='completed')
  const cancelled = bookings.filter(b=>b.status==='cancelled')
  const rescheduled = bookings.filter(b=>b.status==='rescheduled')
  const mostRecentCompleted = [...completed].sort((a,b)=>(b.scheduled_date??'').localeCompare(a.scheduled_date??''))[0]

  return (
    <div style={{ maxWidth:660, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Activity Feed</h2>
      <Card style={{ padding:22, marginBottom:14 }}>
        <SectionTitle title="Summary" />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
          {[
            {l:'Completed Jobs', v:completed.length},
            {l:'Cancelled Jobs', v:cancelled.length},
            {l:'Rescheduled Jobs', v:rescheduled.length},
          ].map((s,i)=>(
            <div key={i} style={{ textAlign:'center' as const, padding:'12px', borderRadius:12, background:C.bg }}>
              <p style={{ fontSize:18, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>{s.v}</p>
              <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
            </div>
          ))}
        </div>
        {mostRecentCompleted&&(
          <p style={{ fontSize:12, color:C.muted, marginTop:14 }}>Most recently completed: {serviceLabel(mostRecentCompleted.care_request)} on {formatDateLabel(mostRecentCompleted.scheduled_date)}.</p>
        )}
      </Card>
      <Card style={{ padding:22 }}>
        <p style={{ fontSize:13, color:C.muted }}>A detailed activity history isn't available yet.</p>
      </Card>
    </div>
  )
}

// ─── Report Issue ─────────────────────────────────────────────────────────────
function ReportIssue({ bookings, onSubmit, onToast }:{
  bookings:Booking[]; onSubmit:(subject:string)=>Promise<void>; onToast:(m:string, kind?:'success'|'error')=>void
}) {
  const [bookingId, setBookingId] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const relevant = bookings.filter(b=>b.status!=='cancelled')

  async function submit() {
    const trimmed = description.trim()
    if(!trimmed) { onToast('Please describe the issue', 'error'); return }
    const b = relevant.find(x=>x.id===bookingId)
    const context = b ? `${serviceLabel(b.care_request)} — ${formatDateLabel(b.scheduled_date)}` : 'General'
    setSubmitting(true)
    try {
      await onSubmit(`[${context}] ${trimmed}`)
      onToast('Report submitted successfully', 'success')
      setDescription(''); setBookingId('')
    } catch(e:any) {
      // Keep the description so the user can retry — do not clear the
      // form or imply the report was submitted.
      onToast(e?.message || 'Could not submit report. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth:640, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Report Issue</h2>
      <Card style={{ padding:24 }}>
        <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:6 }}>Related Job (optional)</p>
        <select value={bookingId} onChange={e=>setBookingId(e.target.value)}
          style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, background:'#FAFAFA', outline:'none', boxSizing:'border-box' as const, marginBottom:14 }}>
          <option value="">General / Not job-specific</option>
          {relevant.map(b=><option key={b.id} value={b.id}>{serviceLabel(b.care_request)} — {formatDateLabel(b.scheduled_date)}</option>)}
        </select>
        <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:6 }}>Description</p>
        <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={4} placeholder="Describe the issue…"
          style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, background:'#FAFAFA', outline:'none', resize:'vertical' as const, boxSizing:'border-box' as const, lineHeight:1.6, marginBottom:16 }} />
        <Btn label={submitting?'Submitting…':'Submit Report'} variant="danger" onClick={submit} disabled={submitting} />
      </Card>
    </div>
  )
}

// ─── Notifications ────────────────────────────────────────────────────────────
function Notifications({ notifications, onMarkRead, onMarkAllRead }:{
  notifications:NotificationRow[]|null; onMarkRead:(id:string)=>void; onMarkAllRead:()=>void
}) {
  if(notifications===null) {
    return <div style={{ maxWidth:660, margin:'0 auto', padding:'24px 28px 60px' }}><p style={{ fontSize:13, color:C.muted }}>Loading notifications…</p></div>
  }
  const unread = notifications.filter(n=>!n.read).length
  return (
    <div style={{ maxWidth:660, margin:'0 auto', padding:'24px 28px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
        <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Notifications</h2>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          {unread>0&&<Bdg label={`${unread} new`} color={C.primary} dot />}
          {unread>0&&<Btn label="Mark All Read" variant="ghost" small onClick={onMarkAllRead} />}
        </div>
      </div>
      {notifications.length===0 ? (
        <Card style={{ padding:40, textAlign:'center' as const }}>
          <p style={{ fontSize:13, color:C.muted }}>No notifications yet.</p>
        </Card>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
          {notifications.map(n=>(
            <Card key={n.id} hover onClick={()=>{ if(!n.read) onMarkRead(n.id) }} style={{ padding:18, background:n.read?C.surface:`${C.primary}04`, border:`1px solid ${n.read?C.border:C.primary+'20'}` }}>
              <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                <div style={{ width:42, height:42, borderRadius:12, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>🔔</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3, gap:8 }}>
                    <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                      <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{n.title || 'Notification'}</p>
                      {!n.read&&<div style={{ width:7, height:7, borderRadius:'50%', background:C.primary }}/>}
                    </div>
                    <p style={{ fontSize:11, color:C.muted, whiteSpace:'nowrap' as const }}>{formatDateLabel(n.created_at)}</p>
                  </div>
                  <p style={{ fontSize:12, color:C.sub, lineHeight:1.5 }}>{n.body || ''}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Empty / Loading / Error / Success (Dev showcase — untouched) ─────────────
function EmptyStates() {
  return (
    <div style={{ padding:'28px 28px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:20 }}>Empty States</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="jm-2col">
        {[
          {e:'📋',t:'No Assignments',      d:'You have no active assignments. Browse available care requests to get started.',   cta:'Browse Jobs'},
          {e:'📅',t:'No Upcoming Visits',  d:'No visits scheduled for the next 7 days. Your calendar is clear.',                cta:'View Calendar'},
          {e:'📁',t:'No Documents',        d:'No documents have been shared for this assignment yet.',                          cta:'Refresh'},
          {e:'🔔',t:'No Reminders',        d:"You're all caught up! No active reminders at this time.",                        cta:'View Schedule'},
        ].map((s,i)=>(
          <Card key={i} style={{ padding:'40px 24px', textAlign:'center' as const }}>
            <div style={{ fontSize:48, marginBottom:14 }}>{s.e}</div>
            <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:8 }}>{s.t}</p>
            <p style={{ fontSize:12, color:C.muted, lineHeight:1.7, marginBottom:18 }}>{s.d}</p>
            <Btn label={s.cta} variant="secondary" small />
          </Card>
        ))}
      </div>
    </div>
  )
}

function LoadingStates() {
  function Shimmer({ w='100%', h=16 }:{ w?:string; h?:number }) {
    return <div style={{ width:w, height:h, borderRadius:8, background:'linear-gradient(90deg,#E4E8EA 25%,#F2F4F5 50%,#E4E8EA 75%)', backgroundSize:'200% 100%', animation:'shimmer 1.6s ease-in-out infinite' }} />
  }
  return (
    <div style={{ padding:'28px 28px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:20 }}>Loading States</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="jm-2col">
        {['Loading Assignments','Loading Calendar','Loading Route','Loading Beneficiary'].map((l,i)=>(
          <Card key={i} style={{ padding:22 }}>
            <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:14 }}>{l}</p>
            <Shimmer h={180} /><div style={{height:10}}/>
            {[...Array(3)].map((_,j)=>(
              <div key={j} style={{ display:'flex', gap:10, marginBottom:10 }}>
                <Shimmer w="40px" h={40} /><div style={{ flex:1 }}><Shimmer h={12} w="65%"/><div style={{height:5}}/><Shimmer h={10} w="40%"/></div>
              </div>
            ))}
          </Card>
        ))}
      </div>
    </div>
  )
}

function ErrorStates({ onToast }:{ onToast:(m:string)=>void }) {
  return (
    <div style={{ maxWidth:600, margin:'0 auto', padding:'28px 28px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:20 }}>Error States</h2>
      {[
        {e:'📋',t:'Unable to Load Assignment', d:'We could not load this assignment. Check your connection and try again.',col:C.error},
        {e:'🗺️',t:'Route Error',              d:'Navigation data could not be loaded. Please open your maps app directly.',  col:C.warning},
        {e:'📅',t:'Schedule Error',            d:'Your schedule could not be updated. Changes have been saved locally.',      col:C.warning},
        {e:'📶',t:'Network Error',             d:'You appear to be offline. Some features may be limited.',                  col:C.muted},
      ].map((er,i)=>(
        <Card key={i} style={{ padding:22, marginBottom:12, border:`1.5px solid ${er.col}30`, background:`${er.col}04` }}>
          <div style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
            <div style={{ width:44, height:44, borderRadius:14, background:`${er.col}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{er.e}</div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:13, fontWeight:800, color:er.col, marginBottom:4 }}>{er.t}</p>
              <p style={{ fontSize:12, color:C.sub, lineHeight:1.6, marginBottom:12 }}>{er.d}</p>
              <Btn label="Retry" variant="secondary" small icon={I.refresh} onClick={()=>onToast('Retrying…')} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

function SuccessStates({ onToast }:{ onToast:(m:string)=>void }) {
  return (
    <div style={{ maxWidth:600, margin:'0 auto', padding:'28px 28px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:20 }}>Success States</h2>
      {[
        {e:'✅', t:'Preparation Completed',  d:'All preparation tasks are complete. You are ready for the visit!', col:C.success},
        {e:'📅', t:'Schedule Updated',       d:'Reschedule request sent to the client. Awaiting confirmation.',    col:C.primary},
        {e:'🔔', t:'Reminder Acknowledged',  d:'Visit reminder dismissed. See you there!',                        col:C.accent},
        {e:'💼', t:'Assignment Confirmed',   d:'The assignment has been confirmed. All set!',                     col:C.success},
      ].map((s,i)=>(
        <Card key={i} style={{ padding:20, marginBottom:10, border:`1.5px solid ${s.col}30`, background:`${s.col}04` }}>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <div style={{ width:44, height:44, borderRadius:14, background:`${s.col}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{s.e}</div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:13, fontWeight:700, color:s.col, marginBottom:3 }}>{s.t}</p>
              <p style={{ fontSize:12, color:C.sub }}>{s.d}</p>
            </div>
            <span style={{ color:s.col, display:'flex', transform:'scale(1.2)' }}>{I.check}</span>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Sub-view type ────────────────────────────────────────────────────────────
type SubView = 'dashboard'|'calendar'|'preparation'|'route'|'beneficiary'|'documents'|'schedule'|'cancellation'|'reminders'|'status'|'activity'|'notifications'|'reportIssue'|'empty'|'loading'|'error'|'success'

const NAV: { k:SubView; l:string; icon:ReactNode; group:string }[] = [
  { k:'dashboard',     l:'Dashboard',          icon:I.trending,  group:'Overview'       },
  { k:'calendar',      l:'Calendar',           icon:I.calendar,  group:'Overview'       },
  { k:'reminders',     l:'Reminders',          icon:I.bell,      group:'Overview'       },
  { k:'preparation',   l:'Visit Preparation',  icon:I.check,     group:'Visit'          },
  { k:'route',         l:'Route Planning',     icon:I.nav,       group:'Visit'          },
  { k:'beneficiary',   l:'Beneficiary Profile',icon:I.user,      group:'Visit'          },
  { k:'documents',     l:'Document Center',    icon:I.doc,       group:'Visit'          },
  { k:'schedule',      l:'Schedule Mgmt',      icon:I.edit,      group:'Management'     },
  { k:'cancellation',  l:'Cancellations',      icon:I.close,     group:'Management'     },
  { k:'status',        l:'Status',             icon:I.shield,    group:'Management'     },
  { k:'activity',      l:'Activity Feed',      icon:I.clock,     group:'Management'     },
  { k:'reportIssue',   l:'Report Issue',       icon:I.alert,     group:'Management'     },
  { k:'notifications', l:'Notifications',      icon:I.bell,      group:'Management'     },
  { k:'empty',         l:'Empty States',       icon:I.alert,     group:'Dev'            },
  { k:'loading',       l:'Loading States',     icon:I.refresh,   group:'Dev'            },
  { k:'error',         l:'Error States',       icon:I.alert,     group:'Dev'            },
  { k:'success',       l:'Success States',     icon:I.check,     group:'Dev'            },
]

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function JobManagement() {
  const navigate = useNavigate()
  const [sub, setSub] = useState<SubView>('dashboard')
  const [viewingId, setViewingId] = useState<string|null>(null)
  const [selectedId, setSelectedId] = useState<string|null>(null)
  const [toast, setToast] = useState<{msg:string;kind:'success'|'error'}|null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [profile, setProfile] = useState<{ full_name:string|null; preferred_name?:string|null }|null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [notifications, setNotifications] = useState<NotificationRow[]|null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string|null>(null)

  const [documents, setDocuments] = useState<BeneficiaryDocument[]>([])
  const [documentsLoading, setDocumentsLoading] = useState(false)
  const [documentsError, setDocumentsError] = useState<string|null>(null)

  const showToast = (m:string, kind:'success'|'error'='success') => { setToast({msg:m,kind}); setTimeout(()=>setToast(null),2800) }
  const groups = [...new Set(NAV.map(n=>n.group))]

  // Loads real profile/bookings/notifications once on mount. Nothing here
  // is mocked — a failure surfaces as loadError rather than falling back
  // to demo content.
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [profileData, bookingsData, notifData] = await Promise.all([
          getMyProfile(),
          getMyBookings(),
          getMyNotifications(),
        ])
        if(cancelled) return
        setProfile(profileData)
        setBookings(bookingsData as unknown as Booking[])
        setNotifications(notifData as NotificationRow[])
      } catch(e:any) {
        if(!cancelled) setLoadError(e?.message || 'Failed to load jobs')
      } finally {
        if(!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const selectedBooking = useMemo(()=>{
    if(selectedId) return bookings.find(b=>b.id===selectedId) ?? null
    return pickRelevantBooking(bookings)
  }, [bookings, selectedId])

  const viewingBooking = viewingId ? bookings.find(b=>b.id===viewingId) ?? null : null

  // Beneficiary documents for the currently selected booking's beneficiary.
  useEffect(() => {
    const benId = selectedBooking?.beneficiary_id
    if(!benId) { setDocuments([]); setDocumentsError(null); return }
    let cancelled = false
    setDocumentsLoading(true); setDocumentsError(null)
    getBeneficiaryDocuments(benId)
      .then(docs => { if(!cancelled) setDocuments(docs as unknown as BeneficiaryDocument[]) })
      .catch(e => { if(!cancelled) setDocumentsError(e?.message || 'Could not load documents') })
      .finally(() => { if(!cancelled) setDocumentsLoading(false) })
    return () => { cancelled = true }
  }, [selectedBooking?.beneficiary_id])

  function handleView(id:string) {
    setSelectedId(id)
    setViewingId(id)
  }

  async function handleConfirm(id:string) {
    try {
      const updated = await confirmBooking(id)
      // Reflect exactly what Supabase actually returned — never assume
      // both fields changed if the row didn't come back as expected.
      setBookings(bs => bs.map(b => b.id===id ? {
        ...b,
        status: (updated as any)?.status ?? b.status,
        confirmed: (updated as any)?.confirmed ?? b.confirmed,
      } : b))
      showToast('Assignment confirmed')
    } catch(e:any) {
      showToast(e?.message || 'Could not confirm assignment', 'error')
    }
  }

  async function handleSubmitTicket(subject:string) {
    await createSupportTicket(subject)
  }

  async function handleMarkRead(id:string) {
    try {
      await markNotificationRead(id)
      setNotifications(ns => ns ? ns.map(n=>n.id===id?{ ...n, read:true }:n) : ns)
    } catch(e:any) {
      showToast(e?.message || 'Could not update notification')
    }
  }
  async function handleMarkAllRead() {
    try {
      await markAllNotificationsRead()
      setNotifications(ns => ns ? ns.map(n=>({ ...n, read:true })) : ns)
    } catch(e:any) {
      showToast(e?.message || 'Could not update notifications')
    }
  }

  function openCareExecution() {
    navigate('/agent/careexecution')
  }

  const unreadCount = notifications?.filter(n=>!n.read).length ?? 0
  const remindersCount = useMemo(()=>{
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const in3days = new Date(startOfToday); in3days.setDate(in3days.getDate()+3)
    return bookings.filter(b=>{
      if(b.status!=='assigned'&&b.status!=='confirmed') return false
      if(!b.scheduled_date) return false
      const d = new Date(`${b.scheduled_date}T00:00:00`)
      return d>=startOfToday && d<=in3days
    }).length
  }, [bookings])

  const renderMain = () => {
    if(loading) {
      return <div style={{ padding:'24px 28px 60px' }}><p style={{ fontSize:13, color:C.muted }}>Loading your jobs…</p></div>
    }
    if(loadError) {
      return <div style={{ padding:'24px 28px 60px' }}><p style={{ fontSize:13, color:C.error }}>{loadError}</p></div>
    }
    if(viewingBooking) {
      return (
        <JobDetails
          b={viewingBooking}
          documents={documents}
          documentsLoading={documentsLoading}
          onBack={()=>setViewingId(null)}
          onNav={s=>{ setSub(s); setViewingId(null) }}
          onToast={showToast}
          onOpenCareExecution={openCareExecution}
        />
      )
    }
    switch(sub) {
      case 'dashboard':    return <Dashboard profile={profile} bookings={bookings} unreadCount={unreadCount} onNav={setSub} onView={handleView} onToast={showToast} onConfirm={handleConfirm} />
      case 'calendar':     return <CalendarView bookings={bookings} onView={handleView} />
      case 'preparation':  return <Preparation b={selectedBooking} onOpenCareExecution={openCareExecution} />
      case 'route':        return <RoutePlanning b={selectedBooking} />
      case 'beneficiary':  return <BeneficiaryProfile b={selectedBooking} />
      case 'documents':    return <DocumentCenter beneficiary={selectedBooking?.beneficiary ?? null} documents={documents} loading={documentsLoading} error={documentsError} />
      case 'schedule':     return <ScheduleManagement b={selectedBooking} />
      case 'cancellation': return <CancellationManagement bookings={bookings} onSubmitReport={handleSubmitTicket} onToast={showToast} />
      case 'reminders':    return <Reminders bookings={bookings} />
      case 'status':       return <StatusCenter b={selectedBooking} onOpenCareExecution={openCareExecution} />
      case 'activity':     return <ActivityFeed bookings={bookings} />
      case 'reportIssue':  return <ReportIssue bookings={bookings} onSubmit={handleSubmitTicket} onToast={showToast} />
      case 'notifications':return <Notifications notifications={notifications} onMarkRead={handleMarkRead} onMarkAllRead={handleMarkAllRead} />
      case 'empty':        return <EmptyStates />
      case 'loading':      return <LoadingStates />
      case 'error':        return <ErrorStates onToast={showToast} />
      case 'success':      return <SuccessStates onToast={showToast} />
      default: return null
    }
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:C.bg, fontFamily:'Manrope,sans-serif' }}>
      {/* Sidebar */}
      <div className="jm-sidebar" style={{ width:220, background:C.surface, borderRight:`1px solid ${C.border}`, display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh', overflowY:'auto', flexShrink:0 }}>
        <div style={{ padding:'18px 18px 14px', borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <Avatar initials={initials(profile?.preferred_name || profile?.full_name)} size={36} />
            <div>
              <p style={{ fontSize:13, fontWeight:800, color:C.type }}>{profile?.preferred_name || profile?.full_name || 'Agent'}</p>
            </div>
          </div>
        </div>
        {groups.map(group=>(
          <div key={group}>
            <p style={{ fontSize:9, fontWeight:800, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.09em', padding:'10px 18px 4px' }}>{group}</p>
            {NAV.filter(n=>n.group===group).map(n=>{
              const active = sub===n.k && !viewingId
              return (
                <button key={n.k} onClick={()=>{ setSub(n.k); setViewingId(null); setSidebarOpen(false) }}
                  style={{ width:'100%', display:'flex', gap:9, alignItems:'center', padding:'9px 18px', border:'none', background:active?`${C.primary}08`:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:active?700:500, color:active?C.primary:C.type, textAlign:'left' as const, borderLeft:active?`3px solid ${C.primary}`:'3px solid transparent', transition:'all 0.12s' }}>
                  <span style={{ display:'flex', color:active?C.primary:C.muted }}>{n.icon}</span>
                  {n.l}
                  {n.k==='reminders'&&remindersCount>0&&<div style={{ marginLeft:'auto', minWidth:18, height:18, borderRadius:99, background:C.warning, color:'#fff', fontSize:9, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 5px' }}>{remindersCount}</div>}
                  {n.k==='notifications'&&unreadCount>0&&<div style={{ marginLeft:'auto', minWidth:18, height:18, borderRadius:99, background:C.error, color:'#fff', fontSize:9, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 5px' }}>{unreadCount}</div>}
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
            <div style={{ padding:'16px 18px', borderBottom:`1px solid ${C.border}` }}>
              <p style={{ fontSize:13, fontWeight:800, color:C.type }}>Job Management</p>
            </div>
            {NAV.map(n=>(
              <button key={n.k} onClick={()=>{ setSub(n.k); setViewingId(null); setSidebarOpen(false) }}
                style={{ width:'100%', display:'flex', gap:9, alignItems:'center', padding:'10px 18px', border:'none', background:sub===n.k?`${C.primary}08`:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:sub===n.k?700:500, color:sub===n.k?C.primary:C.type, textAlign:'left' as const }}>
                <span style={{ display:'flex', color:sub===n.k?C.primary:C.muted }}>{n.icon}</span>{n.l}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile top bar */}
      <div className="jm-mobile-nav" style={{ display:'none', position:'fixed', top:0, left:0, right:0, zIndex:40, background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'12px 18px', alignItems:'center', justifyContent:'space-between' }}>
        <p style={{ fontSize:13, fontWeight:800, color:C.type }}>
          {viewingId ? 'Job Details' : NAV.find(n=>n.k===sub)?.l ?? 'Job Management'}
        </p>
        <button onClick={()=>setSidebarOpen(v=>!v)} style={{ background:'none', border:'none', cursor:'pointer', color:C.type, fontSize:12, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>Menu</button>
      </div>

      {/* Main */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }} className="jm-main">
        <div style={{ flex:1, overflowY:'auto' }}>
          {renderMain()}
        </div>
      </div>

      {toast&&<Toast msg={toast.msg} kind={toast.kind} />}
    </div>
  )
}
