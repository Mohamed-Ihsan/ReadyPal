import { useState, useEffect, useRef, type ReactNode, type CSSProperties } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  getMyProfile,
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getMyActiveBooking,
  getBookingById,
  getVisitLog,
  startVisit as apiStartVisit,
  updateVisitStatus,
  updateVisitChecklist,
  updateVisitMedication,
  updateVisitVitals,
  updateVisitNotes,
  submitIncidentReport,
  endVisit as apiEndVisit,
  getOrCreateBookingConversation,
  type VisitStatus,
} from '../lib/api'

// ─── Brand ────────────────────────────────────────────────────────────────────
const C = {
  primary:'#00737A', accent:'#EE8153', type:'#2C3E43', sub:'#6B7E85',
  muted:'#9AAAB0', border:'#E4E8EA', bg:'#F2F4F5', surface:'#FFFFFF',
  success:'#22C55E', warning:'#F59E0B', error:'#EF4444', info:'#3B82F6',
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const I: Record<string,ReactNode> = {
  check:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7l3.5 3.5 5.5-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  clock:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.3"/><path d="M6.5 4.5V7l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  pin:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1a3.5 3.5 0 0 1 3.5 3.5c0 2.5-3.5 7-3.5 7S3 7 3 4.5A3.5 3.5 0 0 1 6.5 1z" stroke="currentColor" strokeWidth="1.3"/><circle cx="6.5" cy="4.5" r="1.3" fill="currentColor"/></svg>,
  phone:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 2.5l2-1 1.5 2.5-1 1a7 7 0 0 0 3.5 3.5l1-1 2.5 1.5-1 2C8 12 1 5 2 2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  camera:   <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="3" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.3"/><circle cx="7" cy="7.5" r="2.2" stroke="currentColor" strokeWidth="1.3"/><path d="M4.5 3l1-2h3l1 2" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  doc:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M3 1.5h5l3 3v7.5H3V1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M8 1.5V4.5H11" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M5 7h4M5 9h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  alert:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5L1 12.5h12L7 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M7 6v2.5M7 10v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  nav:      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5L12.5 12.5 7 9.5l-5.5 3L7 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  mic:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="4" y="1" width="5" height="8" rx="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M2 6.5A4.5 4.5 0 0 0 6.5 11m0 0A4.5 4.5 0 0 0 11 6.5M6.5 11v1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  note:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="2" y="1.5" width="9" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M4.5 5h4M4.5 7h4M4.5 9h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  pulse:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h2l2-4.5 2.5 9 2-4.5 1.5 2H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  pill:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="2" y="5" width="9" height="3" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M6.5 5v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  refresh:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M11 6.5a4.5 4.5 0 1 1-1-2.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M11 3v2.5H8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevR:    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  close:    <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1 1l9 9M10 1L1 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  sos:      <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="9.5" stroke="currentColor" strokeWidth="2.5"/><text x="11" y="15" textAnchor="middle" fill="currentColor" fontSize="9" fontWeight="900" fontFamily="Manrope,sans-serif">SOS</text></svg>,
  star:     <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M6 1l1.5 3 3.3.5-2.4 2.3.6 3.3L6 8.8 3 10.1l.6-3.3L1.2 4.5l3.3-.5L6 1z"/></svg>,
  upload:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 9V2M4 4.5L6.5 2 9 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M1.5 10.5h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  download: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2v7M4 6.5L6.5 9 9 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M1.5 10.5h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  shield:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5l4.5 1.7v3.5C11 9.8 9 12 6.5 13 4 12 2 9.8 2 6.7V3.2L6.5 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  pen:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M9.5 1.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  msg:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M11.5 2H1.5a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h1.7l2.3 2 2.3-2h3.7a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  chevL:    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
}

// ─── Primitives ───────────────────────────────────────────────────────────────
function Card({ children, style={}, hover=false, onClick }:{ children:ReactNode; style?:CSSProperties; hover?:boolean; onClick?:()=>void }) {
  const [h,setH] = useState(false)
  return (
    <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ background:C.surface, borderRadius:16, border:`1px solid ${h&&hover?C.primary+'40':C.border}`, boxShadow:h&&hover?'0 8px 28px rgba(44,62,67,0.11)':'0 1px 4px rgba(44,62,67,0.06)', transition:'all 0.18s', cursor:onClick?'pointer':undefined, ...style }}>
      {children}
    </div>
  )
}

function Btn({ label, icon, onClick, variant='primary', small=false, disabled=false, full=false }:{
  label:string; icon?:ReactNode; onClick?:()=>void
  variant?:'primary'|'secondary'|'ghost'|'danger'|'accent'|'success'|'emergency'
  small?:boolean; disabled?:boolean; full?:boolean
}) {
  const [h,setH] = useState(false)
  const vs: Record<string,CSSProperties> = {
    primary:   { background:disabled?'#C8D0D4':h?'#005D63':C.primary, color:'#fff', border:'none', boxShadow:disabled?'none':h?`0 4px 16px ${C.primary}50`:`0 2px 8px ${C.primary}30` },
    secondary: { background:h?'#EEF5F5':'#fff', color:C.primary, border:`1.5px solid ${h?C.primary:C.border}` },
    ghost:     { background:h?C.bg:'transparent', color:C.sub, border:'none' },
    danger:    { background:h?'#DC2626':C.error, color:'#fff', border:'none', boxShadow:`0 2px 8px ${C.error}30` },
    accent:    { background:h?'#D4663D':C.accent, color:'#fff', border:'none', boxShadow:`0 2px 8px ${C.accent}30` },
    success:   { background:h?'#16A34A':C.success, color:'#fff', border:'none', boxShadow:`0 2px 8px ${C.success}30` },
    emergency: { background:h?'#B91C1C':C.error, color:'#fff', border:'none', boxShadow:`0 4px 20px ${C.error}60`, transform:'scale(1.02)' },
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

function Toast({ msg }:{ msg:string }) {
  return (
    <div style={{ position:'fixed', bottom:28, left:'50%', transform:'translateX(-50%)', zIndex:999, display:'flex', alignItems:'center', gap:10, padding:'12px 22px', borderRadius:14, background:C.type, color:'#fff', fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:700, boxShadow:'0 8px 28px rgba(0,0,0,0.22)', pointerEvents:'none', whiteSpace:'nowrap' as const }}>
      <span style={{display:'flex',color:C.success}}>{I.check}</span>{msg}
    </div>
  )
}

function Shimmer({ w='100%', h=16 }:{ w?:string; h?:number }) {
  return <div style={{ width:w, height:h, borderRadius:8, background:'linear-gradient(90deg,#E4E8EA 25%,#F2F4F5 50%,#E4E8EA 75%)', backgroundSize:'200% 100%', animation:'shimmer 1.6s ease-in-out infinite' }} />
}

// ─── Live clock + elapsed ─────────────────────────────────────────────────────
function useLiveClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => { const t = setInterval(()=>setNow(new Date()),1000); return ()=>clearInterval(t) },[])
  return now
}

function ElapsedTimer({ startMs }:{ startMs:number }) {
  const [elapsed, setElapsed] = useState(Date.now()-startMs)
  useEffect(()=>{ const t=setInterval(()=>setElapsed(Date.now()-startMs),1000); return ()=>clearInterval(t) },[startMs])
  const s = Math.floor(elapsed/1000)
  const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sc = s%60
  return <span>{String(h).padStart(2,'0')}:{String(m).padStart(2,'0')}:{String(sc).padStart(2,'0')}</span>
}

// ─── Status config ────────────────────────────────────────────────────────────
// Mirrors visit_logs.status exactly — that column only accepts these six
// values, so no other status is ever shown as selectable or written back.
const STATUS: Record<VisitStatus,{color:string;label:string;emoji:string}> = {
  not_started: { color:C.muted,   label:'Not Started',      emoji:'⏳' },
  en_route:    { color:C.warning, label:'En Route',         emoji:'🚗' },
  checked_in:  { color:C.info,    label:'Checked In',       emoji:'✅' },
  in_progress: { color:C.success, label:'Care In Progress', emoji:'💊' },
  checked_out: { color:C.accent,  label:'Checked Out',      emoji:'📍' },
  completed:   { color:C.success, label:'Completed',        emoji:'🎉' },
}

type LiveStatus = VisitStatus

// ─── Real data shapes ─────────────────────────────────────────────────────────
// These mirror the confirmed Supabase schema exactly. jsonb columns
// (checklist/medication_log/vitals) have no fixed shape in the database —
// the item shapes below are an application-level convention we control.
type ChecklistItem = { id:string; label:string; done:boolean; note?:string }
type MedicationItem = { id:string; name:string; quantity:string; pharmacy:string; purchased:boolean; collected:boolean }
type VisitVitals = { bp?:string; hr?:string; temp?:string; o2?:string; sugar?:string; weight?:string; recorded_at?:string }

type CareRequestInfo = {
  id:string; title:string|null; service_type:string|null; duration:string|null
  tasks:string[]|null; address1:string|null; address2:string|null; city:string|null; province:string|null
} | null

type ActiveBooking = {
  id:string; status:string; scheduled_date:string|null; scheduled_time:string|null
  duration:string|null; payment_amount:number|null; location:string|null
  care_request:CareRequestInfo
  client:{ id:string; full_name:string|null; avatar_url:string|null; phone:string|null } | null
  beneficiary:{ id:string; name:string|null; preferred_name:string|null; age:number|null } | null
}

type VisitLog = {
  id:string; booking_id:string; status:VisitStatus
  check_in_time:string|null; check_out_time:string|null
  gps_lat:number|null; gps_lng:number|null
  checklist:ChecklistItem[]|null; medication_log:MedicationItem[]|null; vitals:VisitVitals|null
  notes:string|null; media_urls:string[]|null; incident_report:string|null; client_signature_url:string|null
}

// ─── Real-data formatting helpers ──────────────────────────────────────────────
// Never fabricate a value here — every branch either shows real data or an
// honest "not recorded"/"not provided" label.
function initials(name?:string|null):string {
  if(!name) return '—'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if(parts.length===0) return '—'
  return (parts[0][0] + (parts[1]?.[0]??'')).toUpperCase()
}

function beneficiaryLabel(b:ActiveBooking['beneficiary']):string {
  if(!b) return 'Beneficiary not provided'
  const name = b.preferred_name || b.name
  if(!name) return 'Beneficiary not provided'
  return b.age!=null ? `${name} (${b.age})` : name
}

function clientLabel(c:ActiveBooking['client']):string {
  return c?.full_name || 'Client not provided'
}

function serviceLabel(cr:CareRequestInfo):string {
  return cr?.title || cr?.service_type || 'Service not specified'
}

function locationLabel(b:ActiveBooking|null):string {
  if(!b) return 'Location not provided'
  if(b.location) return b.location
  const cr = b.care_request
  const parts = [cr?.address1, cr?.address2, cr?.city, cr?.province].filter(Boolean)
  return parts.length ? parts.join(', ') : 'Location not provided'
}

function formatClockTime(iso?:string|null):string {
  if(!iso) return 'Not recorded'
  const d = new Date(iso)
  if(Number.isNaN(d.getTime())) return 'Not recorded'
  return d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})
}

function formatDurationBetween(startIso?:string|null, endIso?:string|null):string {
  if(!startIso || !endIso) return 'Not available'
  const start = new Date(startIso).getTime(), end = new Date(endIso).getTime()
  if(Number.isNaN(start) || Number.isNaN(end) || end<start) return 'Not available'
  const totalMin = Math.round((end-start)/60000)
  const h = Math.floor(totalMin/60), m = totalMin%60
  return h>0 ? `${h}h ${m}m` : `${m}m`
}

// ─── Sub-view type ────────────────────────────────────────────────────────────
type SubView = 'dashboard'|'startVisit'|'liveStatus'|'gps'|'timeline'|'checklist'|'medication'|'vitals'|'notes'|'media'|'documents'|'incident'|'emergency'|'clientUpdates'|'signature'|'endVisit'|'summary'|'followup'|'notifications'|'statusBadges'|'empty'|'loading'|'error'|'success'

const NAV_ITEMS: { k:SubView; l:string; icon:ReactNode; group:string }[] = [
  { k:'dashboard',     l:'Live Dashboard',     icon:I.pulse,    group:'Live Session'  },
  { k:'startVisit',    l:'Start Visit',        icon:I.pin,      group:'Live Session'  },
  { k:'liveStatus',    l:'Live Status',        icon:I.alert,    group:'Live Session'  },
  { k:'gps',           l:'GPS Tracking',       icon:I.nav,      group:'Live Session'  },
  { k:'timeline',      l:'Live Timeline',      icon:I.clock,    group:'Live Session'  },
  { k:'checklist',     l:'Task Checklist',     icon:I.check,    group:'Tasks'         },
  { k:'medication',    l:'Medication Tracker', icon:I.pill,     group:'Tasks'         },
  { k:'vitals',        l:'Vital Signs',        icon:I.pulse,    group:'Tasks'         },
  { k:'notes',         l:'Care Notes',         icon:I.note,     group:'Tasks'         },
  { k:'media',         l:'Photo & Media',      icon:I.camera,   group:'Tasks'         },
  { k:'documents',     l:'Documents',          icon:I.doc,      group:'Tasks'         },
  { k:'incident',      l:'Incident Report',    icon:I.alert,    group:'Management'    },
  { k:'emergency',     l:'Emergency Mode',     icon:I.sos,      group:'Management'    },
  { k:'clientUpdates', l:'Client Updates',     icon:I.phone,    group:'Management'    },
  { k:'signature',     l:'Digital Signature',  icon:I.pen,      group:'Management'    },
  { k:'endVisit',      l:'End Visit',          icon:I.check,    group:'Completion'    },
  { k:'summary',       l:'Visit Summary',      icon:I.star,     group:'Completion'    },
  { k:'followup',      l:'Follow-up',          icon:I.refresh,  group:'Completion'    },
  { k:'notifications', l:'Notifications',      icon:I.alert,    group:'Dev'           },
  { k:'statusBadges',  l:'Status Badges',      icon:I.shield,   group:'Dev'           },
  { k:'empty',         l:'Empty States',       icon:I.close,    group:'Dev'           },
  { k:'loading',       l:'Loading States',     icon:I.refresh,  group:'Dev'           },
  { k:'error',         l:'Error States',       icon:I.alert,    group:'Dev'           },
  { k:'success',       l:'Success States',     icon:I.check,    group:'Dev'           },
]

// ─── Live Dashboard ───────────────────────────────────────────────────────────
function LiveDashboard({ booking, visitLog, onNav, onToast, onSaveNotes, onMessageClient, messagingClient }:{
  booking:ActiveBooking|null; visitLog:VisitLog|null; onNav:(s:SubView)=>void; onToast:(m:string)=>void
  onSaveNotes:(notes:string)=>Promise<void>
  onMessageClient:()=>void; messagingClient:boolean
}) {
  const status:LiveStatus = visitLog?.status ?? 'not_started'
  const st = STATUS[status]
  const [note, setNote] = useState(visitLog?.notes ?? '')
  useEffect(()=>{ setNote(visitLog?.notes ?? '') }, [visitLog?.notes])

  const checklist = visitLog?.checklist ?? []
  const done = checklist.filter(t=>t.done).length
  const pct = checklist.length ? Math.round((done/checklist.length)*100) : 0
  const meds = visitLog?.medication_log ?? []

  if(!booking) {
    return (
      <div style={{ padding:'24px 28px 60px' }}>
        <Card style={{ padding:40, textAlign:'center' as const }}>
          <p style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:8 }}>No Active Booking</p>
          <p style={{ fontSize:13, color:C.muted }}>You don't have an assigned, confirmed, or in-progress booking right now.</p>
        </Card>
      </div>
    )
  }

  return (
    <div style={{ padding:'24px 28px 60px' }}>
      {/* Header hero */}
      <Card style={{ padding:'22px 26px', marginBottom:20, background:`linear-gradient(135deg,${C.primary},#00959E)`, border:'none', boxShadow:`0 10px 32px ${C.primary}35`, position:'relative' as const, overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-30%', right:'-5%', width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }} />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap' as const, gap:14 }}>
          <div>
            <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:10 }}>
              <div style={{ padding:'5px 12px', borderRadius:999, background:'rgba(255,255,255,0.18)', fontSize:11, fontWeight:700, color:'#fff', display:'flex', alignItems:'center', gap:6 }}>
                <div style={{ width:7, height:7, borderRadius:'50%', background:st.color, boxShadow:`0 0 0 3px ${st.color}40`, animation:'pulse-dot 2s ease-in-out infinite' }} />
                {st.emoji} {st.label}
              </div>
            </div>
            <h2 style={{ fontSize:22, fontWeight:900, color:'#fff', fontFamily:'Manrope,sans-serif', marginBottom:4 }}>{serviceLabel(booking.care_request)}</h2>
            <p style={{ fontSize:12, color:'rgba(255,255,255,0.75)', marginBottom:10 }}>{beneficiaryLabel(booking.beneficiary)} · {locationLabel(booking)}</p>
            <div style={{ display:'flex', gap:18, flexWrap:'wrap' as const }}>
              {[
                {l:'Elapsed',  v: visitLog?.check_in_time ? <ElapsedTimer startMs={new Date(visitLog.check_in_time).getTime()}/> : '—'},
                {l:'Duration', v: booking.duration || 'Not specified'},
                {l:'Tasks',    v: checklist.length ? `${done}/${checklist.length}` : '—'},
              ].map((s,i)=>(
                <div key={i}>
                  <p style={{ fontSize:10, color:'rgba(255,255,255,0.6)', marginBottom:2 }}>{s.l}</p>
                  <p style={{ fontSize:20, fontWeight:900, color:'#fff', fontFamily:'Manrope,sans-serif', lineHeight:1 }}>{s.v}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={onMessageClient} disabled={messagingClient}
              style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5, padding:'14px 16px', borderRadius:16, background:'rgba(255,255,255,0.16)', border:'2px solid rgba(255,255,255,0.3)', cursor:messagingClient?'default':'pointer', opacity:messagingClient?0.7:1, transition:'all 0.15s' }}>
              <span style={{ color:'#fff', display:'flex' }}>{I.msg}</span>
              <p style={{ fontSize:9, fontWeight:900, color:'#fff', letterSpacing:'0.08em' }}>{messagingClient?'OPENING…':'MESSAGE'}</p>
            </button>
            <button onClick={()=>onNav('emergency')}
              style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5, padding:'14px 16px', borderRadius:16, background:'rgba(239,68,68,0.85)', border:'2px solid rgba(239,68,68,0.5)', cursor:'pointer', transition:'all 0.15s' }}>
              <span style={{ color:'#fff', display:'flex' }}>{I.sos}</span>
              <p style={{ fontSize:9, fontWeight:900, color:'#fff', letterSpacing:'0.08em' }}>EMERGENCY</p>
            </button>
          </div>
        </div>
        {/* progress bar */}
        <div style={{ marginTop:16 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.7)' }}>Task Progress</p>
            <p style={{ fontSize:11, fontWeight:700, color:'#fff' }}>{pct}%</p>
          </div>
          <div style={{ height:8, borderRadius:99, background:'rgba(255,255,255,0.2)', overflow:'hidden' }}>
            <div style={{ width:`${pct}%`, height:'100%', background:'linear-gradient(90deg,rgba(255,255,255,0.8),rgba(255,255,255,0.5))', borderRadius:99, transition:'width 0.4s' }} />
          </div>
        </div>
      </Card>

      {/* KPIs — real data only */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }} className="lce-4col">
        {[
          {e:'🕐', l:'Checked In', v: formatClockTime(visitLog?.check_in_time), c:C.primary},
          {e:'📋', l:'Tasks Done', v: checklist.length ? `${done}/${checklist.length}` : 'No tasks yet', c:C.success},
          {e:'💊', l:'Medication', v: meds.length ? `${meds.length} item${meds.length===1?'':'s'}` : 'None logged', c:C.accent},
          {e:'📌', l:'Status',     v: st.label, c:st.color},
        ].map((k,i)=>(
          <Card key={i} style={{ padding:18 }}>
            <p style={{ fontSize:22, marginBottom:6 }}>{k.e}</p>
            <p style={{ fontSize:16, fontWeight:900, color:k.c, fontFamily:'Manrope,sans-serif', lineHeight:1.2, marginBottom:3 }}>{k.v}</p>
            <p style={{ fontSize:11, color:C.muted }}>{k.l}</p>
          </Card>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:18 }} className="lce-main-split">
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Task checklist preview — real */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Task Checklist" action="Full List" onAction={()=>onNav('checklist')} />
            {checklist.length===0 ? (
              <p style={{ fontSize:12, color:C.muted }}>No tasks recorded for this visit yet.</p>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
                {checklist.slice(0,6).map(t=>(
                  <div key={t.id} style={{ display:'flex', gap:10, alignItems:'center', padding:'9px 12px', borderRadius:10, background:t.done?`${C.success}08`:C.bg, border:`1.5px solid ${t.done?C.success+'30':C.border}` }}>
                    <div style={{ width:22, height:22, borderRadius:7, background:t.done?C.success:`${C.primary}10`, border:`2px solid ${t.done?C.success:C.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      {t.done&&<span style={{display:'flex',color:'#fff',transform:'scale(0.7)'}}>{I.check}</span>}
                    </div>
                    <p style={{ fontSize:12, fontWeight:t.done?500:600, color:t.done?C.muted:C.type, textDecoration:t.done?'line-through':undefined }}>{t.label}</p>
                  </div>
                ))}
              </div>
            )}
            {checklist.length>6&&<button onClick={()=>onNav('checklist')} style={{ width:'100%', marginTop:8, padding:'8px', borderRadius:10, border:`1px dashed ${C.border}`, background:'transparent', cursor:'pointer', fontSize:11, fontWeight:700, color:C.muted, fontFamily:'Manrope,sans-serif' }}>+{checklist.length-6} more tasks</button>}
          </Card>

          {/* GPS map mini — left as-is: no route-history/ETA/traffic backend exists */}
          <Card style={{ overflow:'hidden' }}>
            <div style={{ height:160, background:`linear-gradient(135deg,${C.bg},#DCE8EA)`, position:'relative' as const, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.08 }} preserveAspectRatio="none"><defs><pattern id="g" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M 28 0 L 0 0 0 28" fill="none" stroke={C.primary} strokeWidth="0.6"/></pattern></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>
              <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} viewBox="0 0 400 160" preserveAspectRatio="none">
                <path d="M 60 130 C 100 110 160 90 200 70 C 240 50 300 40 340 30" stroke={C.primary} strokeWidth="3" fill="none" strokeDasharray="0" opacity="0.5"/>
                <path d="M 60 130 C 100 110 160 90 220 60" stroke={C.success} strokeWidth="3.5" fill="none" opacity="0.9"/>
              </svg>
              <div style={{ position:'absolute', left:'15%', bottom:'20%' }}>
                <div style={{ width:14, height:14, borderRadius:'50%', background:C.success, border:'3px solid #fff', boxShadow:`0 0 0 5px ${C.success}30` }} />
              </div>
              <div style={{ position:'absolute', right:'15%', top:'20%' }}>
                <div style={{ background:C.primary, color:'#fff', borderRadius:'6px 6px 2px 2px', padding:'4px 8px', fontSize:9, fontWeight:800, boxShadow:`0 3px 10px ${C.primary}50` }}>NHC</div>
                <div style={{ width:6, height:6, background:C.primary, transform:'rotate(45deg)', margin:'-3px auto 0', borderRadius:1 }} />
              </div>
              <div style={{ position:'relative', background:'rgba(255,255,255,0.9)', borderRadius:8, padding:'5px 12px', fontSize:11, fontWeight:700, color:C.primary }}>ETA 22 min · 2.1 km</div>
            </div>
            <div style={{ padding:'12px 18px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <p style={{ fontSize:12, fontWeight:700, color:C.type }}>National Hospital, Colombo</p>
                <p style={{ fontSize:11, color:C.muted }}>GPS accurate · Traffic: Moderate</p>
              </div>
              <Btn label="Navigate" variant="primary" small icon={I.nav} onClick={()=>onNav('gps')} />
            </div>
          </Card>
        </div>

        {/* Right col */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Quick notes — real, bound to visit_logs.notes */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Quick Notes" action="Full Notes" onAction={()=>onNav('notes')} />
            <textarea value={note} onChange={e=>setNote(e.target.value)} rows={3} placeholder="Add a quick note about the current visit…"
              disabled={!visitLog}
              style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, background:'#FAFAFA', outline:'none', resize:'none', boxSizing:'border-box' as const, lineHeight:1.6, marginBottom:8 }} />
            <Btn label="Save Note" variant="secondary" small full disabled={!visitLog} onClick={()=>{ onSaveNotes(note).catch(()=>{}) }} />
            {!visitLog&&<p style={{ fontSize:11, color:C.muted, marginTop:6 }}>Start the visit to add notes.</p>}
          </Card>

          {/* Medication — real, bound to visit_logs.medication_log */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Medication" action="Tracker" onAction={()=>onNav('medication')} />
            {meds.length===0
              ? <p style={{ fontSize:12, color:C.muted }}>No medication recorded for this visit.</p>
              : meds.map((m,i)=>(
                <div key={m.id} style={{ display:'flex', gap:10, alignItems:'center', padding:'9px 0', borderBottom:i<meds.length-1?`1px solid ${C.border}`:'none' }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:m.collected?C.success:C.warning, flexShrink:0 }} />
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{m.name}</p>
                    <p style={{ fontSize:11, color:C.muted }}>{m.quantity}</p>
                  </div>
                  <Bdg label={m.collected?'Collected':m.purchased?'Purchased':'Pending'} color={m.collected?C.success:m.purchased?C.primary:C.warning} />
                </div>
              ))}
          </Card>

          {/* Live updates */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Client Updates" action="View All" onAction={()=>onNav('clientUpdates')} />
            {[{e:'📍',t:'Arrived at hospital',time:'10:02 AM',col:C.primary},{e:'💊',t:'Medication purchased',time:'10:18 AM',col:C.success}].map((u,i)=>(
              <div key={i} style={{ display:'flex', gap:10, alignItems:'center', padding:'8px 0', borderBottom:i===0?`1px solid ${C.border}`:'none' }}>
                <div style={{ width:32, height:32, borderRadius:10, background:`${u.col}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{u.e}</div>
                <div>
                  <p style={{ fontSize:12, color:C.type }}>{u.t}</p>
                  <p style={{ fontSize:10, color:C.muted }}>{u.time}</p>
                </div>
              </div>
            ))}
            <div style={{ marginTop:10 }}>
              <Btn label="Send Update to Client" variant="accent" small full onClick={()=>onToast('Update sent to Mohamed Ihsan')} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ─── Start Visit ──────────────────────────────────────────────────────────────
function requestGpsPosition(): Promise<{lat:number;lng:number}> {
  return new Promise((resolve, reject) => {
    if(!('geolocation' in navigator)) { reject(new Error('Geolocation is not supported on this device')); return }
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err => reject(new Error(err.message || 'Could not get your location')),
      { enableHighAccuracy:true, timeout:10000 }
    )
  })
}

function StartVisit({ booking, visitLog, profile, starting, onStart, onNav }:{
  booking:ActiveBooking|null; visitLog:VisitLog|null; profile:{ full_name:string|null }|null
  starting:boolean; onStart:(gps:{lat:number;lng:number}|null)=>Promise<void>
  onNav:(s:SubView)=>void
}) {
  const [step, setStep] = useState<'arriving'|'arrived'|'confirm'>('arriving')
  const [gpsCoords, setGpsCoords] = useState<{lat:number;lng:number}|null>(null)
  const [gpsChecking, setGpsChecking] = useState(false)
  const [gpsError, setGpsError] = useState<string|null>(null)
  const [skipGps, setSkipGps] = useState(false)
  const now = useLiveClock()

  if(!booking) {
    return (
      <div style={{ maxWidth:600, margin:'0 auto', padding:'24px 28px 60px' }}>
        <Card style={{ padding:40, textAlign:'center' as const }}>
          <p style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:8 }}>No Active Booking</p>
          <p style={{ fontSize:13, color:C.muted }}>There is no assigned or confirmed booking to start right now.</p>
        </Card>
      </div>
    )
  }

  if(visitLog?.status === 'completed') {
    return (
      <div style={{ maxWidth:600, margin:'0 auto', padding:'24px 28px 60px' }}>
        <Card style={{ padding:40, textAlign:'center' as const }}>
          <p style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:8 }}>Visit Already Completed</p>
          <p style={{ fontSize:13, color:C.muted, marginBottom:16 }}>This visit was completed at {formatClockTime(visitLog.check_out_time)}.</p>
          <Btn label="Go to Dashboard" onClick={()=>onNav('dashboard')} />
        </Card>
      </div>
    )
  }

  if(visitLog) {
    return (
      <div style={{ maxWidth:600, margin:'0 auto', padding:'24px 28px 60px' }}>
        <Card style={{ padding:40, textAlign:'center' as const }}>
          <p style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:8 }}>Visit Already Started</p>
          <p style={{ fontSize:13, color:C.muted, marginBottom:16 }}>This visit was checked in at {formatClockTime(visitLog.check_in_time)}.</p>
          <Btn label="Go to Dashboard" onClick={()=>onNav('dashboard')} />
        </Card>
      </div>
    )
  }

  async function handleVerifyGps() {
    setGpsChecking(true); setGpsError(null)
    try {
      const coords = await requestGpsPosition()
      setGpsCoords(coords)
    } catch(e:any) {
      setGpsError(e?.message || 'Could not get your location')
    } finally {
      setGpsChecking(false)
    }
  }

  const gpsResolved = gpsCoords!=null || skipGps

  return (
    <div style={{ maxWidth:600, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Start Visit</h2>
      <p style={{ fontSize:13, color:C.muted, marginBottom:24 }}>{serviceLabel(booking.care_request)} · {beneficiaryLabel(booking.beneficiary)} · {locationLabel(booking)}</p>

      {/* Steps */}
      <div style={{ display:'flex', gap:0, marginBottom:24 }}>
        {(['arriving','arrived','confirm'] as const).map((s,i)=>{
          const done = step==='arrived'&&i<2 || step==='confirm'&&i<3 || (step==='arriving'&&i<1)
          const active = step===s
          return (
            <div key={s} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', position:'relative' as const }}>
              {i>0&&<div style={{ position:'absolute', left:'-50%', right:'50%', top:16, height:3, background:done?C.primary:C.border, zIndex:0 }}/>}
              <div style={{ width:34, height:34, borderRadius:'50%', background:done?C.primary:active?`${C.primary}15`:C.bg, border:`2.5px solid ${done||active?C.primary:C.border}`, display:'flex', alignItems:'center', justifyContent:'center', zIndex:1 }}>
                {done?<span style={{display:'flex',color:'#fff',transform:'scale(0.85)'}}>{I.check}</span>:<p style={{ fontSize:12, fontWeight:800, color:active?C.primary:C.muted }}>{i+1}</p>}
              </div>
              <p style={{ fontSize:10, fontWeight:700, color:active?C.primary:C.muted, marginTop:6, textAlign:'center' as const }}>{['Travelling','Arrived','Confirm'][i]}</p>
            </div>
          )
        })}
      </div>

      {step==='arriving'&&(
        <Card style={{ padding:24 }}>
          <h3 style={{ fontSize:16, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:16 }}>On Your Way</h3>
          <div style={{ padding:'16px', borderRadius:12, background:`${C.info}08`, border:`1.5px solid ${C.info}20`, marginBottom:18 }}>
            <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
              <span style={{ fontSize:20 }}>🗺️</span>
              <div>
                <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:3 }}>Navigate to {locationLabel(booking)}</p>
              </div>
            </div>
          </div>
          <Btn label="I've Arrived" variant="primary" full onClick={()=>setStep('arrived')} />
        </Card>
      )}

      {step==='arrived'&&(
        <Card style={{ padding:24 }}>
          <h3 style={{ fontSize:16, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:16 }}>Confirm Arrival</h3>
          <div style={{ display:'flex', gap:10, alignItems:'center', padding:'14px', borderRadius:12, background:`${C.success}08`, border:`1.5px solid ${C.success}20`, marginBottom:16 }}>
            <span style={{ color:C.success, display:'flex', transform:'scale(1.3)' }}>{I.check}</span>
            <div>
              <p style={{ fontSize:12, fontWeight:700, color:C.type }}>Current Time</p>
              <p style={{ fontSize:18, fontWeight:900, color:C.success, fontFamily:'Manrope,sans-serif' }}>{now.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}</p>
            </div>
          </div>
          {/* GPS — real navigator.geolocation, no faked success */}
          <div style={{ padding:'14px', borderRadius:12, background:gpsCoords?`${C.success}08`:gpsError?`${C.error}08`:C.bg, border:`1.5px solid ${gpsCoords?C.success+'30':gpsError?C.error+'30':C.border}`, marginBottom:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <span style={{ color:gpsCoords?C.success:gpsError?C.error:C.muted, display:'flex' }}>{I.pin}</span>
                <div>
                  <p style={{ fontSize:12, fontWeight:700, color:C.type }}>GPS Check-in</p>
                  <p style={{ fontSize:11, color:C.muted }}>
                    {gpsChecking?'Requesting location…':gpsCoords?'Location captured':gpsError?gpsError:'Not yet requested'}
                  </p>
                </div>
              </div>
              <Btn label={gpsCoords?'Captured ✓':gpsChecking?'Requesting…':'Get Location'} variant={gpsCoords?'success':'secondary'} small disabled={gpsChecking} onClick={handleVerifyGps} />
            </div>
            {gpsError&&!skipGps&&(
              <div style={{ marginTop:10 }}>
                <Btn label="Continue Without GPS" variant="ghost" small onClick={()=>setSkipGps(true)} />
              </div>
            )}
          </div>
          {/* Selfie placeholder — no camera/upload pipeline exists yet */}
          <div style={{ padding:'16px', borderRadius:12, background:C.bg, border:`2px dashed ${C.border}`, marginBottom:16, textAlign:'center' as const }}>
            <p style={{ fontSize:24, marginBottom:8 }}>📷</p>
            <p style={{ fontSize:12, fontWeight:700, color:C.type, marginBottom:4 }}>Selfie Verification</p>
            <p style={{ fontSize:11, color:C.muted }}>Camera feature coming soon</p>
          </div>
          <Btn label="Confirm & Proceed" variant="primary" full disabled={!gpsResolved} onClick={()=>setStep('confirm')} />
        </Card>
      )}

      {step==='confirm'&&(
        <Card style={{ padding:24 }}>
          <div style={{ textAlign:'center' as const, paddingBottom:16, borderBottom:`1px solid ${C.border}`, marginBottom:16 }}>
            <div style={{ fontSize:52, marginBottom:10 }}>🏥</div>
            <h3 style={{ fontSize:18, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>Ready to Begin</h3>
            <p style={{ fontSize:13, color:C.muted }}>You are about to check in at {locationLabel(booking)}</p>
          </div>
          {[
            {l:'Agent',v:profile?.full_name || 'Not provided'},
            {l:'Beneficiary',v:beneficiaryLabel(booking.beneficiary)},
            {l:'Client',v:clientLabel(booking.client)},
            {l:'Start Time',v:now.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})},
            {l:'Service',v:serviceLabel(booking.care_request)},
            {l:'Duration',v:booking.duration || 'Not specified'},
          ].map((r,i)=>(
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:`1px solid ${C.border}` }}>
              <p style={{ fontSize:12, color:C.muted }}>{r.l}</p>
              <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{r.v}</p>
            </div>
          ))}
          <div style={{ marginTop:16 }}>
            <Btn label={starting?'Starting…':'Start Visit Now'} variant="success" full disabled={starting} onClick={()=>onStart(gpsCoords)} />
          </div>
        </Card>
      )}
    </div>
  )
}

// ─── Live Status ──────────────────────────────────────────────────────────────
// "completed" is intentionally excluded from this grid — it is only ever
// set by the End Visit flow (handleEndVisit), which validates checklist
// completion and also sets check_out_time and booking.status together.
// Exposing it here would let it be set without any of that, so a completed
// visit's status can no longer be changed from this screen at all.
function LiveStatusView({ visitLog, onSetStatus }:{
  visitLog:VisitLog|null; onSetStatus:(s:VisitStatus)=>Promise<void>
}) {
  if(!visitLog) {
    return (
      <div style={{ maxWidth:700, margin:'0 auto', padding:'24px 28px 60px' }}>
        <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Live Status</h2>
        <Card style={{ padding:40, textAlign:'center' as const }}>
          <p style={{ fontSize:13, color:C.muted }}>Start the visit before setting a live status.</p>
        </Card>
      </div>
    )
  }

  const current = visitLog.status
  const isCompleted = current === 'completed'
  const selectableStatuses = (Object.keys(STATUS) as VisitStatus[]).filter(k => k !== 'completed')

  return (
    <div style={{ maxWidth:700, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Live Status</h2>
      <p style={{ fontSize:13, color:C.muted, marginBottom:22 }}>
        {isCompleted ? 'This visit is completed — its status can no longer be changed here.' : 'Sets visit_logs.status for this visit.'}
      </p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }} className="lce-3col">
        {selectableStatuses.map(k=>{
          const s = STATUS[k]
          return (
            <Card key={k} hover={!isCompleted} style={{ padding:20, border:`2px solid ${current===k?s.color+'50':C.border}`, background:current===k?`${s.color}08`:C.surface, opacity:isCompleted?0.5:1, cursor:isCompleted?'not-allowed':'pointer' }}
              onClick={()=>{ if(isCompleted) return; onSetStatus(k).catch(()=>{}) }}>
              <div style={{ display:'flex', gap:3, marginBottom:8, alignItems:'center' }}>
                <div style={{ width:10, height:10, borderRadius:'50%', background:s.color, flexShrink:0, boxShadow:current===k?`0 0 0 4px ${s.color}25`:undefined }} />
                {current===k&&<Bdg label="Active" color={s.color} />}
              </div>
              <p style={{ fontSize:20, marginBottom:6 }}>{s.emoji}</p>
              <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{s.label}</p>
            </Card>
          )
        })}
      </div>
      {isCompleted&&(
        <Card style={{ padding:16, marginTop:14, background:`${C.success}08`, border:`1.5px solid ${C.success}20` }}>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <div style={{ width:10, height:10, borderRadius:'50%', background:STATUS.completed.color }} />
            <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{STATUS.completed.emoji} {STATUS.completed.label}</p>
          </div>
        </Card>
      )}
    </div>
  )
}

// ─── GPS Tracking ─────────────────────────────────────────────────────────────
function GPSTracking({ onToast }:{ onToast:(m:string)=>void }) {
  const [accuracy, setAccuracy] = useState<'high'|'medium'|'low'>('high')
  return (
    <div style={{ maxWidth:780, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>GPS Tracking</h2>
      <Card style={{ overflow:'hidden', marginBottom:18 }}>
        {/* Map */}
        <div style={{ height:300, background:`linear-gradient(135deg,${C.bg},#D0E8EA)`, position:'relative' as const, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.07 }} preserveAspectRatio="none"><defs><pattern id="gps-g" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M 32 0 L 0 0 0 32" fill="none" stroke={C.primary} strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#gps-g)"/></svg>
          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} viewBox="0 0 600 300" preserveAspectRatio="none">
            {/* Visited route */}
            <path d="M 80 230 C 130 200 200 170 270 130" stroke={C.success} strokeWidth="4" fill="none" opacity="0.85" strokeLinecap="round"/>
            {/* Remaining route */}
            <path d="M 270 130 C 340 95 410 70 480 50" stroke={C.primary} strokeWidth="3" fill="none" strokeDasharray="10 5" opacity="0.6" strokeLinecap="round"/>
            {/* Travel radius */}
            <circle cx="80" cy="230" r="40" stroke={C.success} strokeWidth="1.5" fill={`${C.success}06`} strokeDasharray="4 3"/>
          </svg>
          {/* Current location */}
          <div style={{ position:'absolute', left:'14%', bottom:'25%' }}>
            <div style={{ width:18, height:18, borderRadius:'50%', background:C.success, border:'3px solid #fff', boxShadow:`0 0 0 7px ${C.success}25, 0 4px 14px ${C.success}60` }} />
          </div>
          {/* Destination */}
          <div style={{ position:'absolute', right:'18%', top:'15%' }}>
            <div style={{ background:C.primary, color:'#fff', borderRadius:'8px 8px 3px 3px', padding:'6px 11px', fontSize:10, fontWeight:800, boxShadow:`0 3px 14px ${C.primary}60`, whiteSpace:'nowrap' as const }}>🏥 National Hospital</div>
            <div style={{ width:8, height:8, background:C.primary, transform:'rotate(45deg)', margin:'-4px auto 0', borderRadius:2 }} />
          </div>
          {/* GPS accuracy badge */}
          <div style={{ position:'absolute', top:12, left:12, display:'flex', gap:5, alignItems:'center', background:'rgba(255,255,255,0.92)', borderRadius:8, padding:'5px 10px', boxShadow:'0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ width:7, height:7, borderRadius:'50%', background:accuracy==='high'?C.success:accuracy==='medium'?C.warning:C.error }} />
            <p style={{ fontSize:10, fontWeight:700, color:C.type }}>GPS: {accuracy==='high'?'High':'Medium'} accuracy</p>
          </div>
          {/* Refresh */}
          <button onClick={()=>{ setAccuracy('high'); onToast('GPS refreshed') }} style={{ position:'absolute', top:12, right:12, width:34, height:34, borderRadius:9, background:'rgba(255,255,255,0.9)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.primary, boxShadow:'0 2px 8px rgba(0,0,0,0.12)' }}>
            <span style={{display:'flex'}}>{I.refresh}</span>
          </button>
        </div>
        {/* Info strip */}
        <div style={{ padding:20 }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 }} className="lce-4col">
            {[{l:'Distance',v:'2.1 km',c:C.primary},{l:'ETA',v:'22 min',c:C.info},{l:'Traffic',v:'Moderate',c:C.warning},{l:'Speed',v:'32 km/h',c:C.success}].map((s,i)=>(
              <div key={i} style={{ textAlign:'center' as const, padding:'10px 8px', borderRadius:12, background:C.bg }}>
                <p style={{ fontSize:17, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:3 }}>{s.v}</p>
                <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
              </div>
            ))}
          </div>
          <div style={{ padding:'12px', borderRadius:12, background:`${C.info}08`, border:`1px solid ${C.info}20`, marginBottom:14 }}>
            <p style={{ fontSize:12, fontWeight:700, color:C.type, marginBottom:2 }}>Destination</p>
            <p style={{ fontSize:13, color:C.type }}>National Hospital — Regent St, Colombo 10</p>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <Btn label="Open Navigation" icon={I.nav} onClick={()=>onToast('Opening maps…')} full />
            <Btn label="Share Location" variant="secondary" small onClick={()=>onToast('Location shared with Mohamed Ihsan')} />
          </div>
        </div>
      </Card>
    </div>
  )
}

// ─── Live Timeline ────────────────────────────────────────────────────────────
function LiveTimeline() {
  const events = [
    { l:'Accepted',           done:true,  t:'18 Jan, 11:00 AM', loc:'Home',                    note:'Job confirmed',                         emoji:'✅' },
    { l:'Travelling',         done:true,  t:'Today, 9:05 AM',   loc:'En route',                note:'Left home on time',                     emoji:'🚗' },
    { l:'Arrived',            done:true,  t:'Today, 9:32 AM',   loc:'National Hospital',       note:'GPS check-in completed',                emoji:'📍' },
    { l:'Checked In',         done:true,  t:'Today, 9:35 AM',   loc:'National Hospital OPD',   note:'Nimal Perera confirmed',                emoji:'🏥' },
    { l:'Medication Purchased',done:false,t:'Today, ~10:15 AM', loc:'Osusala Pharmacy',        note:'Paracetamol + Amoxicillin',             emoji:'💊' },
    { l:'Hospital Arrived',   done:false, t:'Today, ~10:30 AM', loc:'OPD, Room 4B',            note:'Doctor Silva appointment',             emoji:'🏥' },
    { l:'Doctor Consultation',done:false, t:'Today, ~10:45 AM', loc:'Room 4B',                 note:'Review medications and reports',        emoji:'👨‍⚕️' },
    { l:'Report Collected',   done:false, t:'Today, ~11:30 AM', loc:'Reception',               note:'Collect lab results',                  emoji:'📄' },
    { l:'Returning',          done:false, t:'Today, ~12:00 PM', loc:'En route home',           note:'Return Nimal safely',                  emoji:'🏠' },
    { l:'Completed',          done:false, t:'Today, ~12:30 PM', loc:'Home — Dehiwela',         note:'End visit and upload summary',         emoji:'🎉' },
  ]
  return (
    <div style={{ maxWidth:700, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Live Timeline</h2>
      <Card style={{ padding:24 }}>
        <div style={{ display:'flex', flexDirection:'column' }}>
          {events.map((ev,i,arr)=>(
            <div key={i} style={{ display:'flex', gap:14 }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                <div style={{ width:42, height:42, borderRadius:14, background:ev.done?`${C.success}10`:`${C.primary}08`, border:`2px solid ${ev.done?C.success:i===events.findIndex(e=>!e.done)?C.primary:C.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, transition:'all 0.2s' }}>
                  {ev.done?<span style={{fontSize:16}}>{ev.emoji}</span>:<span style={{ display:'flex', color:i===events.findIndex(e=>!e.done)?C.primary:C.muted }}>{I.clock}</span>}
                </div>
                {i<arr.length-1&&<div style={{ width:2, flex:1, background:ev.done?`${C.success}40`:C.border, margin:'5px 0', minHeight:16 }}/>}
              </div>
              <div style={{ paddingBottom:i<arr.length-1?18:0, paddingTop:4, flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap' as const, gap:4 }}>
                  <p style={{ fontSize:13, fontWeight:ev.done?700:600, color:ev.done?C.type:i===events.findIndex(e=>!e.done)?C.primary:C.muted }}>{ev.l}</p>
                  {ev.done&&<Bdg label="Done" color={C.success} />}
                  {!ev.done&&i===events.findIndex(e=>!e.done)&&<Bdg label="Next" color={C.primary} dot />}
                </div>
                <p style={{ fontSize:11, color:C.muted, marginBottom:3 }}>{ev.t} · {ev.loc}</p>
                <p style={{ fontSize:12, color:C.sub, lineHeight:1.5 }}>{ev.note}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Task Checklist ───────────────────────────────────────────────────────────
// Loads visit_logs.checklist if it already has entries; otherwise seeds a
// draft checklist from the real care_request.tasks array. Never falls back
// to a fabricated task list.
function initChecklist(booking:ActiveBooking|null, visitLog:VisitLog|null):ChecklistItem[] {
  if(visitLog?.checklist && visitLog.checklist.length) return visitLog.checklist
  const tasks = booking?.care_request?.tasks
  if(tasks && tasks.length) return tasks.map((label,i)=>({ id:String(i), label, done:false }))
  return []
}

function TaskChecklist({ booking, visitLog, onSaveChecklist }:{
  booking:ActiveBooking|null; visitLog:VisitLog|null
  onSaveChecklist:(checklist:ChecklistItem[], successMessage?:string)=>Promise<void>
}) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(()=>initChecklist(booking, visitLog))
  useEffect(()=>{ setChecklist(initChecklist(booking, visitLog)) }, [visitLog?.id])
  const [expand, setExpand] = useState<string|null>(null)
  const [noteDraft, setNoteDraft] = useState<Record<string,string>>({})

  if(!visitLog) {
    return (
      <div style={{ maxWidth:720, margin:'0 auto', padding:'24px 28px 60px' }}>
        <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Task Checklist</h2>
        <Card style={{ padding:40, textAlign:'center' as const }}>
          <p style={{ fontSize:13, color:C.muted, marginBottom:checklist.length?16:0 }}>Start the visit to begin tracking tasks.</p>
          {checklist.length>0&&(
            <div style={{ display:'flex', flexDirection:'column', gap:6, textAlign:'left' as const }}>
              {checklist.map(t=><p key={t.id} style={{ fontSize:12, color:C.type }}>• {t.label}</p>)}
            </div>
          )}
        </Card>
      </div>
    )
  }

  const done = checklist.filter(t=>t.done).length
  const pct = checklist.length ? Math.round((done/checklist.length)*100) : 0

  async function persist(next:ChecklistItem[], successMessage?:string) {
    const prev = checklist
    setChecklist(next)
    try {
      await onSaveChecklist(next, successMessage)
    } catch(e) {
      setChecklist(prev)
      throw e
    }
  }

  async function toggle(id:string) {
    const next = checklist.map(t=>t.id===id?{...t, done:!t.done}:t)
    const item = next.find(t=>t.id===id)
    try {
      await persist(next, item?.done ? `✓ ${item.label}` : undefined)
    } catch {
      // error toast already shown by root; local state already reverted by persist
    }
  }

  async function saveNote(id:string) {
    const next = checklist.map(t=>t.id===id?{...t, note:noteDraft[id]??t.note}:t)
    try {
      await persist(next, 'Note saved')
      setExpand(null)
    } catch {
      // keep the note editor open so the agent can retry
    }
  }

  return (
    <div style={{ maxWidth:720, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Task Checklist</h2>
      {checklist.length===0 ? (
        <Card style={{ padding:40, textAlign:'center' as const }}>
          <p style={{ fontSize:13, color:C.muted }}>No tasks have been defined for this care request yet.</p>
        </Card>
      ) : (
        <>
          <Card style={{ padding:22, marginBottom:18, background:`linear-gradient(135deg,${C.primary}05,${C.surface})`, border:`1.5px solid ${C.primary}20` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
              <p style={{ fontSize:13, fontWeight:700, color:C.type }}>Overall Progress</p>
              <p style={{ fontSize:24, fontWeight:900, color:pct===100?C.success:C.primary, fontFamily:'Manrope,sans-serif' }}>{pct}%</p>
            </div>
            <div style={{ height:10, borderRadius:99, background:`${C.primary}10`, overflow:'hidden', marginBottom:6 }}>
              <div style={{ width:`${pct}%`, height:'100%', background:`linear-gradient(90deg,${C.primary},${C.success})`, borderRadius:99, transition:'width 0.5s' }} />
            </div>
            <p style={{ fontSize:11, color:C.muted }}>{done} of {checklist.length} tasks complete</p>
          </Card>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {checklist.map(t=>(
              <Card key={t.id} style={{ border:`1.5px solid ${t.done?C.success+'30':C.border}`, background:t.done?`${C.success}05`:C.surface }}>
                <div style={{ padding:'14px 16px' }}>
                  <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                    <button onClick={()=>toggle(t.id)}
                      style={{ width:28, height:28, borderRadius:9, background:t.done?C.success:`${C.success}15`, border:`2px solid ${t.done?C.success:C.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, cursor:'pointer', transition:'all 0.15s', marginTop:2 }}>
                      {t.done&&<span style={{display:'flex',color:'#fff',transform:'scale(0.8)'}}>{I.check}</span>}
                    </button>
                    <div style={{ flex:1 }}>
                      <p style={{ fontSize:13, fontWeight:t.done?500:700, color:t.done?C.muted:C.type, textDecoration:t.done?'line-through':undefined }}>{t.label}</p>
                      {t.note&&<p style={{ fontSize:11, color:C.muted, marginTop:3 }}>{t.note}</p>}
                    </div>
                    <button onClick={()=>{ setExpand(expand===t.id?null:t.id); setNoteDraft(d=>({...d,[t.id]:t.note??''})) }} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, display:'flex', padding:4 }}>
                      <span style={{ display:'flex', transform:expand===t.id?'rotate(90deg)':'none', transition:'transform 0.15s' }}>{I.chevR}</span>
                    </button>
                  </div>
                  {expand===t.id&&(
                    <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${C.border}` }}>
                      <textarea value={noteDraft[t.id]??''} onChange={e=>setNoteDraft(d=>({...d,[t.id]:e.target.value}))} rows={2}
                        placeholder="Add notes for this task…"
                        style={{ width:'100%', padding:'8px 12px', borderRadius:9, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, background:C.bg, outline:'none', resize:'none', boxSizing:'border-box' as const }} />
                      <div style={{ display:'flex', gap:6, marginTop:8 }}>
                        <Btn label="Save" variant="secondary" small onClick={()=>saveNote(t.id)} />
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Medication Tracker ───────────────────────────────────────────────────────
// Backed entirely by visit_logs.medication_log — there is no source of real
// prescribed-medication names, so every entry is one the agent adds here.
function MedicationTracker({ visitLog, onSaveMedication }:{
  visitLog:VisitLog|null; onSaveMedication:(meds:MedicationItem[], successMessage?:string)=>Promise<void>
}) {
  const [meds, setMeds] = useState<MedicationItem[]>(visitLog?.medication_log ?? [])
  useEffect(()=>{ setMeds(visitLog?.medication_log ?? []) }, [visitLog?.id])
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [pharmacy, setPharmacy] = useState('')

  if(!visitLog) {
    return (
      <div style={{ maxWidth:720, margin:'0 auto', padding:'24px 28px 60px' }}>
        <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Medication Tracker</h2>
        <Card style={{ padding:40, textAlign:'center' as const }}>
          <p style={{ fontSize:13, color:C.muted }}>Start the visit to begin tracking medication.</p>
        </Card>
      </div>
    )
  }

  async function persist(next:MedicationItem[], successMessage?:string) {
    const prev = meds
    setMeds(next)
    try {
      await onSaveMedication(next, successMessage)
    } catch(e) {
      setMeds(prev)
      throw e
    }
  }

  async function addMedication() {
    if(!name.trim()) return
    const item:MedicationItem = { id:`${Date.now()}`, name:name.trim(), quantity:quantity.trim(), pharmacy:pharmacy.trim(), purchased:false, collected:false }
    try {
      await persist([...meds, item], 'Medication added')
      setName(''); setQuantity(''); setPharmacy('')
    } catch {
      // error toast already shown by root; local state already reverted by persist
    }
  }

  async function toggleFlag(id:string, field:'purchased'|'collected') {
    try {
      await persist(meds.map(m=>m.id===id?{ ...m, [field]:!m[field] }:m))
    } catch {
      // error toast already shown by root; local state already reverted by persist
    }
  }

  return (
    <div style={{ maxWidth:720, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Medication Tracker</h2>

      <Card style={{ padding:22, marginBottom:18 }}>
        <SectionTitle title="Add Medication" />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:12 }} className="lce-3col">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Medication name"
            style={{ padding:'10px 12px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, background:'#FAFAFA', outline:'none' }} />
          <input value={quantity} onChange={e=>setQuantity(e.target.value)} placeholder="Quantity"
            style={{ padding:'10px 12px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, background:'#FAFAFA', outline:'none' }} />
          <input value={pharmacy} onChange={e=>setPharmacy(e.target.value)} placeholder="Pharmacy"
            style={{ padding:'10px 12px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, background:'#FAFAFA', outline:'none' }} />
        </div>
        <Btn label="Add Medication" onClick={addMedication} disabled={!name.trim()} />
      </Card>

      {meds.length===0 ? (
        <Card style={{ padding:40, textAlign:'center' as const }}>
          <p style={{ fontSize:13, color:C.muted }}>No medication recorded for this visit.</p>
        </Card>
      ) : meds.map(m=>(
        <Card key={m.id} style={{ padding:22, marginBottom:14 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
            <div>
              <p style={{ fontSize:15, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>{m.name}</p>
              <p style={{ fontSize:12, color:C.muted }}>{[m.quantity, m.pharmacy].filter(Boolean).join(' · ') || 'No further details'}</p>
            </div>
            <Bdg label={m.collected?'Collected':m.purchased?'Purchased':'Pending'} color={m.collected?C.success:m.purchased?C.primary:C.warning} dot />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8 }}>
            {[{l:'Purchased',done:m.purchased,field:'purchased' as const},{l:'Collected',done:m.collected,field:'collected' as const}].map(s=>(
              <button key={s.l} onClick={()=>toggleFlag(m.id, s.field)} style={{ textAlign:'center' as const, padding:'10px 8px', borderRadius:10, background:s.done?`${C.success}08`:C.bg, border:`1px solid ${s.done?C.success+'30':C.border}`, cursor:'pointer' }}>
                <div style={{ width:22, height:22, borderRadius:8, background:s.done?C.success:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 6px' }}>
                  {s.done?<span style={{display:'flex',color:'#fff',transform:'scale(0.7)'}}>{I.check}</span>:<div style={{width:6,height:6,borderRadius:2,background:C.border}}/>}
                </div>
                <p style={{ fontSize:10, fontWeight:700, color:s.done?C.success:C.muted }}>{s.l}</p>
              </button>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Vital Signs ──────────────────────────────────────────────────────────────
// Backed by visit_logs.vitals — no demo defaults; every field starts empty
// unless it was actually saved.
const VITAL_FIELDS: { k:keyof VisitVitals; l:string; unit:string; icon:string; normal:string }[] = [
  {k:'bp',     l:'Blood Pressure',    unit:'mmHg',  icon:'❤️', normal:'120/80'},
  {k:'hr',     l:'Heart Rate',        unit:'bpm',   icon:'💓', normal:'60-100'},
  {k:'temp',   l:'Temperature',       unit:'°C',    icon:'🌡️', normal:'36.1-37.2'},
  {k:'o2',     l:'Oxygen Saturation', unit:'%',     icon:'💨', normal:'95-100'},
  {k:'sugar',  l:'Blood Sugar',       unit:'mg/dL', icon:'🩸', normal:'70-140'},
  {k:'weight', l:'Weight',            unit:'kg',    icon:'⚖️', normal:'—'},
]

function VitalSigns({ booking, visitLog, onSaveVitals }:{
  booking:ActiveBooking|null; visitLog:VisitLog|null; onSaveVitals:(vitals:VisitVitals)=>Promise<void>
}) {
  const [reading, setReading] = useState<VisitVitals>(visitLog?.vitals ?? {})
  useEffect(()=>{ setReading(visitLog?.vitals ?? {}) }, [visitLog?.id])

  if(!visitLog) {
    return (
      <div style={{ maxWidth:720, margin:'0 auto', padding:'24px 28px 60px' }}>
        <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Vital Signs</h2>
        <Card style={{ padding:40, textAlign:'center' as const }}>
          <p style={{ fontSize:13, color:C.muted }}>Start the visit to begin recording vitals.</p>
        </Card>
      </div>
    )
  }

  async function save() {
    try {
      await onSaveVitals({ ...reading, recorded_at:new Date().toISOString() })
    } catch {
      // error toast already shown by root
    }
  }

  return (
    <div style={{ maxWidth:720, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:8 }}>Vital Signs</h2>
      <p style={{ fontSize:13, color:C.muted, marginBottom:22 }}>Manual entry · {beneficiaryLabel(booking?.beneficiary ?? null)} · {visitLog.vitals?.recorded_at ? `Recorded ${formatClockTime(visitLog.vitals.recorded_at)}` : 'Not yet recorded'}</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14, marginBottom:18 }} className="lce-3col">
        {VITAL_FIELDS.map(v=>{
          const val = reading[v.k]
          return (
            <Card key={v.k} style={{ padding:18 }}>
              <p style={{ fontSize:22, marginBottom:8 }}>{v.icon}</p>
              <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:4 }}>{v.l}</p>
              {val
                ? <p style={{ fontSize:22, fontWeight:900, color:C.success, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:3 }}>{val}<span style={{ fontSize:11, fontWeight:500, color:C.muted }}> {v.unit}</span></p>
                : <p style={{ fontSize:13, color:C.muted, fontStyle:'italic' as const, marginBottom:3 }}>Not recorded</p>
              }
              <p style={{ fontSize:10, color:C.muted }}>Normal: {v.normal}</p>
            </Card>
          )
        })}
      </div>
      <Card style={{ padding:22 }}>
        <SectionTitle title="Manual Entry" />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }} className="lce-2col">
          {VITAL_FIELDS.map(f=>(
            <div key={f.k}>
              <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:5 }}>{f.l} ({f.unit})</p>
              <input value={reading[f.k]??''} onChange={e=>setReading(r=>({...r,[f.k]:e.target.value}))}
                style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, background:'#FAFAFA', outline:'none', boxSizing:'border-box' as const }} />
            </div>
          ))}
        </div>
        <div style={{ marginTop:14, display:'flex', gap:8 }}>
          <Btn label="Save Readings" onClick={save} />
        </div>
      </Card>
    </div>
  )
}

// ─── Care Notes ───────────────────────────────────────────────────────────────
// visit_logs.notes is a single text column — one editable field, no
// fabricated note history. Template buttons just insert canned text locally.
function CareNotes({ visitLog, onSaveNotes }:{
  visitLog:VisitLog|null; onSaveNotes:(notes:string)=>Promise<void>
}) {
  const [note, setNote] = useState(visitLog?.notes ?? '')
  useEffect(()=>{ setNote(visitLog?.notes ?? '') }, [visitLog?.id])
  const templates = ['Beneficiary is comfortable and cooperative.','Medication administered as prescribed.','Patient showed mild discomfort, will monitor.','All tasks completed without incident.']

  if(!visitLog) {
    return (
      <div style={{ maxWidth:720, margin:'0 auto', padding:'24px 28px 60px' }}>
        <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Care Notes</h2>
        <Card style={{ padding:40, textAlign:'center' as const }}>
          <p style={{ fontSize:13, color:C.muted }}>Start the visit to begin adding notes.</p>
        </Card>
      </div>
    )
  }

  return (
    <div style={{ maxWidth:720, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Care Notes</h2>
      <Card style={{ padding:22 }}>
        <SectionTitle title="Visit Notes" />
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' as const, marginBottom:12 }}>
          {templates.map((t,i)=>(
            <button key={i} onClick={()=>setNote(n=>n?`${n}\n${t}`:t)}
              style={{ padding:'5px 11px', borderRadius:99, border:`1px solid ${C.border}`, background:C.bg, cursor:'pointer', fontSize:11, fontWeight:600, color:C.sub, fontFamily:'Manrope,sans-serif', textAlign:'left' as const }}>
              {t.substring(0,30)}…
            </button>
          ))}
        </div>
        <textarea value={note} onChange={e=>setNote(e.target.value)} rows={10}
          placeholder="Write care notes here. Be specific — families read these updates."
          style={{ width:'100%', padding:'12px 14px', borderRadius:12, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, background:'#FAFAFA', outline:'none', resize:'vertical' as const, boxSizing:'border-box' as const, lineHeight:1.7, marginBottom:12 }} />
        <Btn label="Save Note" onClick={()=>{ onSaveNotes(note).catch(()=>{}) }} />
      </Card>
    </div>
  )
}

// ─── Photo & Media ────────────────────────────────────────────────────────────
function PhotoMedia({ onToast }:{ onToast:(m:string)=>void }) {
  const mediaItems = [
    {e:'📋',l:'Care Instructions — Nimal Perera.pdf', cat:'doc',  t:'9:30 AM'},
    {e:'💊',l:'Prescription photo',                   cat:'photo',t:'9:35 AM'},
    {e:'🧪',l:'Lab results — Jan 2025.pdf',           cat:'doc',  t:'9:36 AM'},
    {e:'📸',l:'Arrival selfie at NHC',                cat:'photo',t:'9:32 AM'},
    {e:'🧾',l:'Osusala Pharmacy receipt',              cat:'photo',t:'10:18 AM'},
  ]
  return (
    <div style={{ maxWidth:720, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Photo & Media</h2>
      {/* Upload cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:18 }} className="lce-4col">
        {[{e:'📷',l:'Photo',sub:'Camera'},{e:'🎥',l:'Video',sub:'Coming soon'},{e:'🎤',l:'Audio',sub:'Record'},{e:'📄',l:'Document',sub:'Upload'}].map((a,i)=>(
          <button key={i} onClick={()=>onToast(a.sub==='Coming soon'?`${a.l} coming soon`:`Opening ${a.l}…`)}
            style={{ padding:'20px 8px', borderRadius:14, border:`2px dashed ${C.border}`, background:C.bg, cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:6, fontFamily:'Manrope,sans-serif', transition:'all 0.12s' }}
            onMouseOver={e=>(e.currentTarget as HTMLButtonElement).style.borderColor=C.primary}
            onMouseOut={e=>(e.currentTarget as HTMLButtonElement).style.borderColor=C.border}>
            <p style={{ fontSize:28 }}>{a.e}</p>
            <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{a.l}</p>
            <p style={{ fontSize:10, color:C.muted }}>{a.sub}</p>
          </button>
        ))}
      </div>
      {/* Gallery */}
      <Card style={{ padding:22 }}>
        <SectionTitle title={`Gallery (${mediaItems.length} items)`} action="View All" onAction={()=>{}} />
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {mediaItems.map((m,i)=>(
            <div key={i} style={{ display:'flex', gap:12, alignItems:'center', padding:'10px 12px', borderRadius:12, background:C.bg }}>
              <div style={{ width:44, height:44, borderRadius:12, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{m.e}</div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{m.l}</p>
                <p style={{ fontSize:10, color:C.muted }}>{m.t} · {m.cat==='photo'?'Photo':'Document'}</p>
              </div>
              <button onClick={()=>onToast('Opening preview…')} style={{ padding:'5px 10px', borderRadius:8, border:`1px solid ${C.border}`, background:'#fff', cursor:'pointer', fontSize:11, fontWeight:700, color:C.sub, fontFamily:'Manrope,sans-serif' }}>Preview</button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Document Center ──────────────────────────────────────────────────────────
function DocumentCenter({ onToast }:{ onToast:(m:string)=>void }) {
  const cats = [
    {l:'Hospital Reports',       items:['Lab Results — Jan 2025.pdf','X-Ray Report — NHC.pdf']},
    {l:'Prescriptions',          items:['Prescription — Dr. K. Silva.pdf']},
    {l:'Invoices',               items:['Hospital Bill — Jan 2025.pdf','Pharmacy Invoice — Osusala.pdf']},
    {l:'Receipts',               items:['Pharmacy Receipt — LKR 1,350.jpg']},
    {l:'Medical Certificates',   items:['Fitness Certificate — Jan 2025.pdf']},
    {l:'Referral Letters',       items:['Referral to Cardiologist — Dr. Silva.pdf']},
  ]
  return (
    <div style={{ maxWidth:700, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Document Center</h2>
      {cats.map((cat,ci)=>(
        <div key={ci} style={{ marginBottom:20 }}>
          <p style={{ fontSize:11, fontWeight:800, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.07em', marginBottom:8 }}>{cat.l}</p>
          {cat.items.map((doc,di)=>(
            <Card key={di} hover style={{ padding:16, marginBottom:8 }}>
              <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                <div style={{ width:40, height:40, borderRadius:12, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>📄</div>
                <p style={{ flex:1, fontSize:13, fontWeight:600, color:C.type }}>{doc}</p>
                <div style={{ display:'flex', gap:6 }}>
                  <button onClick={()=>onToast('Previewing…')} style={{ padding:'5px 10px', borderRadius:8, border:`1px solid ${C.border}`, background:'#FAFAFA', cursor:'pointer', fontSize:11, fontWeight:700, color:C.sub, fontFamily:'Manrope,sans-serif' }}>View</button>
                  <button onClick={()=>onToast('Downloading…')} style={{ width:30, height:30, borderRadius:8, background:`${C.primary}10`, border:'none', cursor:'pointer', color:C.primary, display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{display:'flex'}}>{I.download}</span></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ))}
    </div>
  )
}

// ─── Incident Reporting ───────────────────────────────────────────────────────
// visit_logs.incident_report is a single text column — type and severity
// have no columns of their own, so the selection is folded into the saved
// text as a "[SEVERITY - TYPE]" prefix rather than invented as new columns.
function IncidentReporting({ booking, visitLog, onSubmitIncident }:{
  booking:ActiveBooking|null; visitLog:VisitLog|null; onSubmitIncident:(text:string)=>Promise<void>
}) {
  const [selected, setSelected] = useState<string|null>(null)
  const [severity, setSeverity] = useState<'low'|'medium'|'high'>('medium')
  const [desc, setDesc] = useState('')
  const types = [
    {k:'minor',     l:'Minor Incident',          e:'⚠️', col:C.warning},
    {k:'major',     l:'Major Incident',           e:'🚨', col:C.error},
    {k:'medication',l:'Medication Issue',          e:'💊', col:C.accent},
    {k:'condition', l:'Patient Condition Change',  e:'🏥', col:C.primary},
    {k:'missed',    l:'Missed Appointment',        e:'📅', col:C.muted},
    {k:'traffic',   l:'Traffic Delay',             e:'🚗', col:C.info},
    {k:'other',     l:'Other',                     e:'📝', col:C.sub},
  ]

  if(!visitLog) {
    return (
      <div style={{ maxWidth:700, margin:'0 auto', padding:'24px 28px 60px' }}>
        <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Incident Report</h2>
        <Card style={{ padding:40, textAlign:'center' as const }}>
          <p style={{ fontSize:13, color:C.muted }}>Start the visit to file an incident report.</p>
        </Card>
      </div>
    )
  }

  async function submit() {
    if(!selected || !desc) return
    const typeLabel = types.find(t=>t.k===selected)?.l ?? 'Other'
    try {
      await onSubmitIncident(`[${severity.toUpperCase()} - ${typeLabel.toUpperCase()}] ${desc}`)
      setSelected(null); setDesc('')
    } catch {
      // error toast already shown by root; keep the form open so the agent can retry
    }
  }

  return (
    <div style={{ maxWidth:700, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Incident Report</h2>
      <p style={{ fontSize:13, color:C.muted, marginBottom:22 }}>This report is saved with the visit record.</p>
      {visitLog.incident_report&&(
        <Card style={{ padding:18, marginBottom:18, background:`${C.warning}06`, border:`1.5px solid ${C.warning}20` }}>
          <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:6 }}>Current report on file</p>
          <p style={{ fontSize:12, color:C.type, lineHeight:1.6 }}>{visitLog.incident_report}</p>
        </Card>
      )}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:18 }} className="lce-4col">
        {types.map(t=>(
          <button key={t.k} onClick={()=>setSelected(t.k)}
            style={{ padding:'16px 8px', borderRadius:14, border:`2px solid ${selected===t.k?t.col:C.border}`, background:selected===t.k?`${t.col}08`:C.bg, cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:6, fontFamily:'Manrope,sans-serif', transition:'all 0.12s' }}>
            <p style={{ fontSize:24 }}>{t.e}</p>
            <p style={{ fontSize:10, fontWeight:700, color:selected===t.k?t.col:C.type, textAlign:'center' as const, lineHeight:1.3 }}>{t.l}</p>
          </button>
        ))}
      </div>
      {selected&&(
        <Card style={{ padding:24 }}>
          <h3 style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:16 }}>
            {types.find(t=>t.k===selected)?.e} {types.find(t=>t.k===selected)?.l}
          </h3>
          {/* Severity */}
          <div style={{ marginBottom:16 }}>
            <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:8 }}>Severity</p>
            <div style={{ display:'flex', gap:8 }}>
              {(['low','medium','high'] as const).map(s=>(
                <button key={s} onClick={()=>setSeverity(s)}
                  style={{ flex:1, padding:'8px', borderRadius:9, border:`2px solid ${severity===s?(s==='high'?C.error:s==='medium'?C.warning:C.success):C.border}`, background:severity===s?`${s==='high'?C.error:s==='medium'?C.warning:C.success}08`:'#FAFAFA', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:700, color:severity===s?(s==='high'?C.error:s==='medium'?C.warning:C.success):C.muted }}>
                  {s.charAt(0).toUpperCase()+s.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {/* Description */}
          <div style={{ marginBottom:14 }}>
            <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:6 }}>Description</p>
            <textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={3}
              placeholder="Describe what happened, when, and what action you took…"
              style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, background:'#FAFAFA', outline:'none', resize:'vertical' as const, boxSizing:'border-box' as const, lineHeight:1.6 }} />
          </div>
          <div style={{ fontSize:11, color:C.muted, display:'flex', alignItems:'center', gap:4, marginBottom:16 }}>
            <span style={{display:'flex'}}>{I.pin}</span>
            {locationLabel(booking)} · {new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}
          </div>
          <Btn label="Submit Report" variant="danger" full disabled={!desc} onClick={submit} />
        </Card>
      )}
    </div>
  )
}

// ─── Emergency Mode ───────────────────────────────────────────────────────────
function EmergencyMode({ onToast }:{ onToast:(m:string)=>void }) {
  const [active, setActive] = useState(false)
  const [notes, setNotes] = useState('')
  return (
    <div style={{ maxWidth:620, margin:'0 auto', padding:'24px 28px 60px' }}>
      <div style={{ padding:'18px 22px', borderRadius:16, background:`${C.error}08`, border:`2px solid ${C.error}30`, marginBottom:22, display:'flex', gap:10, alignItems:'center' }}>
        <span style={{ fontSize:24 }}>🚨</span>
        <div>
          <p style={{ fontSize:13, fontWeight:800, color:C.error }}>Emergency Mode</p>
          <p style={{ fontSize:12, color:C.muted }}>Activating SOS will alert ReadyPal Support and Mohamed Ihsan immediately.</p>
        </div>
      </div>

      {/* Big SOS */}
      <div style={{ display:'flex', justifyContent:'center', marginBottom:28 }}>
        <button onClick={()=>{ setActive(v=>!v); onToast(active?'SOS cancelled':'🚨 SOS activated — help is on the way!') }}
          style={{ width:140, height:140, borderRadius:'50%', background:active?C.error:`${C.error}12`, border:`4px solid ${active?'#fff':C.error}`, cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6, boxShadow:active?`0 0 0 12px ${C.error}25, 0 8px 36px ${C.error}50`:`0 0 0 6px ${C.error}12`, transition:'all 0.3s', animation:active?'pulse-dot 1.5s ease-in-out infinite':undefined }}>
          <span style={{ display:'flex', color:active?'#fff':C.error, transform:'scale(1.6)' }}>{I.sos}</span>
          <p style={{ fontSize:11, fontWeight:900, color:active?'#fff':C.error, letterSpacing:'0.12em' }}>{active?'ACTIVE':'PRESS'}</p>
        </button>
      </div>

      {/* Quick actions */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:18 }} className="lce-2col">
        {[
          {e:'🚑', l:'Call Ambulance',        sub:'Placeholder',                col:C.error},
          {e:'📞', l:'Call Client',           sub:'+94 77 123 4567',            col:C.primary},
          {e:'👨‍👩‍👦',l:'Emergency Contact',    sub:'Kumari Perera (+94 77 345 6789)', col:C.accent},
          {e:'🆘', l:'Call ReadyPal Support', sub:'+94 11 234 5678',            col:C.warning},
          {e:'📍', l:'Share Live Location',   sub:'Colombo 10, National Hospital',col:C.info},
          {e:'💬', l:'Send Alert Message',    sub:'Notify all contacts',         col:C.success},
        ].map((a,i)=>(
          <button key={i} onClick={()=>onToast(`${a.l}…`)}
            style={{ display:'flex', gap:12, alignItems:'center', padding:'16px', borderRadius:14, border:`1.5px solid ${a.col}20`, background:`${a.col}06`, cursor:'pointer', textAlign:'left' as const, transition:'all 0.12s' }}>
            <div style={{ width:44, height:44, borderRadius:14, background:`${a.col}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{a.e}</div>
            <div>
              <p style={{ fontSize:12, fontWeight:700, color:C.type, fontFamily:'Manrope,sans-serif' }}>{a.l}</p>
              <p style={{ fontSize:10, color:C.muted }}>{a.sub}</p>
            </div>
          </button>
        ))}
      </div>
      <Card style={{ padding:20 }}>
        <p style={{ fontSize:12, fontWeight:700, color:C.type, marginBottom:8 }}>Incident Notes</p>
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={3} placeholder="Describe the emergency situation…"
          style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, background:'#FAFAFA', outline:'none', resize:'none', boxSizing:'border-box' as const, lineHeight:1.6 }} />
      </Card>
    </div>
  )
}

// ─── Client Live Updates ──────────────────────────────────────────────────────
function ClientLiveUpdates({ onToast }:{ onToast:(m:string)=>void }) {
  const updates = [
    {e:'📍', t:'Arrived at Hospital',          time:'9:32 AM', body:'Kasun and Nimal have arrived at National Hospital, Colombo.',         col:C.primary, photo:true },
    {e:'💊', t:'Medication Purchased',          time:'10:18 AM',body:'Paracetamol 500mg and Amoxicillin 250mg purchased from Osusala Pharmacy.', col:C.success, photo:true },
    {e:'👨‍⚕️',t:'Doctor Consultation Started', time:'10:45 AM',body:'Meeting Dr. K. Silva in Room 4B, OPD.',                              col:C.info,    photo:false},
    {e:'📄', t:'Reports Collected',             time:'11:30 AM',body:'Lab results and consultation notes collected from reception.',        col:C.accent,  photo:true },
    {e:'🏠', t:'Returning Home',                time:'12:05 PM',body:"Nimal is comfortable and on the way home.",                          col:C.warning, photo:false},
  ]
  const quickUpdates = ['Arrived safely','Medication purchased','Consultation complete','Returning home now','Visit completed']
  return (
    <div style={{ maxWidth:700, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Client Live Updates</h2>
      <p style={{ fontSize:13, color:C.muted, marginBottom:22 }}>Sent to Mohamed Ihsan in real time.</p>

      {/* Quick send */}
      <Card style={{ padding:22, marginBottom:18 }}>
        <SectionTitle title="Quick Update" />
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' as const, marginBottom:12 }}>
          {quickUpdates.map((q,i)=>(
            <button key={i} onClick={()=>onToast(`Update sent: "${q}"`)}
              style={{ padding:'6px 14px', borderRadius:99, border:`1.5px solid ${C.border}`, background:C.bg, cursor:'pointer', fontSize:12, fontWeight:700, color:C.sub, fontFamily:'Manrope,sans-serif' }}>
              {q}
            </button>
          ))}
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <Btn label="Send Custom Update" variant="primary" small icon={I.msg} onClick={()=>onToast('Update sent to Mohamed Ihsan')} />
          <Btn label="Add Photo" variant="ghost" small icon={I.camera} onClick={()=>onToast('Camera opening…')} />
        </div>
      </Card>

      {/* Timeline */}
      <Card style={{ padding:22 }}>
        <SectionTitle title="Update History" />
        <div style={{ display:'flex', flexDirection:'column' }}>
          {updates.map((u,i,arr)=>(
            <div key={i} style={{ display:'flex', gap:12 }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                <div style={{ width:40, height:40, borderRadius:13, background:`${u.col}12`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{u.e}</div>
                {i<arr.length-1&&<div style={{ width:2, flex:1, background:C.border, margin:'4px 0' }}/>}
              </div>
              <div style={{ paddingBottom:i<arr.length-1?16:0, paddingTop:3, flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{u.t}</p>
                  <p style={{ fontSize:11, color:C.muted }}>{u.time}</p>
                </div>
                <p style={{ fontSize:12, color:C.sub, lineHeight:1.5, marginBottom:u.photo?8:0 }}>{u.body}</p>
                {u.photo&&<div style={{ width:64, height:48, borderRadius:8, background:`${u.col}10`, border:`1px solid ${u.col}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>📸</div>}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Digital Signature ────────────────────────────────────────────────────────
function DigitalSignature({ onToast }:{ onToast:(m:string)=>void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [drawing, setDrawing] = useState(false)
  const [agentSigned, setAgentSigned] = useState(false)
  const [benefiSigned, setBenefiSigned] = useState(false)

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true)
    const canvas = canvasRef.current; if(!canvas) return
    const ctx = canvas.getContext('2d'); if(!ctx) return
    const r = canvas.getBoundingClientRect()
    ctx.beginPath(); ctx.moveTo(e.clientX-r.left, e.clientY-r.top)
  }
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if(!drawing) return
    const canvas = canvasRef.current; if(!canvas) return
    const ctx = canvas.getContext('2d'); if(!ctx) return
    const r = canvas.getBoundingClientRect()
    ctx.lineTo(e.clientX-r.left, e.clientY-r.top)
    ctx.strokeStyle=C.type; ctx.lineWidth=2; ctx.lineCap='round'; ctx.stroke()
  }
  const clear = () => { const canvas=canvasRef.current; if(!canvas) return; canvas.getContext('2d')?.clearRect(0,0,canvas.width,canvas.height) }

  return (
    <div style={{ maxWidth:660, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Digital Signature</h2>
      {/* Summary */}
      <Card style={{ padding:22, marginBottom:18 }}>
        <SectionTitle title="Visit Confirmation" />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
          {[{l:'Service',v:'Hospital Appointment Assistance'},{l:'Agent',v:'Kasun Perera'},{l:'Beneficiary',v:'Nimal Perera'},{l:'Date',v:'Mon 20 Jan, 9:32 AM – 12:30 PM'},{l:'Duration',v:'2h 58m'},{l:'Location',v:'National Hospital, Colombo'}].map((r,i)=>(
            <div key={i} style={{ padding:'9px 12px', borderRadius:10, background:C.bg }}>
              <p style={{ fontSize:10, fontWeight:700, color:C.muted, marginBottom:2 }}>{r.l}</p>
              <p style={{ fontSize:12, color:C.type }}>{r.v}</p>
            </div>
          ))}
        </div>
      </Card>
      {/* Beneficiary signature */}
      <Card style={{ padding:22, marginBottom:14 }}>
        <SectionTitle title="Beneficiary Signature" />
        <p style={{ fontSize:12, color:C.muted, marginBottom:12 }}>Nimal Perera — confirms care was received</p>
        <div style={{ borderRadius:12, border:`2px dashed ${benefiSigned?C.success:C.border}`, background:benefiSigned?`${C.success}04`:C.bg, padding:16, marginBottom:10, display:'flex', alignItems:'center', justifyContent:'center', height:80 }}>
          {benefiSigned
            ? <p style={{ fontSize:20, fontFamily:'cursive', color:C.success }}>Nimal Perera</p>
            : <p style={{ fontSize:12, color:C.muted }}>Beneficiary signature pending</p>
          }
        </div>
        {!benefiSigned&&<Btn label="Capture Signature" variant="secondary" small full onClick={()=>{ setBenefiSigned(true); onToast('Beneficiary signature captured') }} />}
      </Card>
      {/* Agent signature */}
      <Card style={{ padding:22, marginBottom:14 }}>
        <SectionTitle title="Care Agent Signature" />
        <p style={{ fontSize:12, color:C.muted, marginBottom:12 }}>Kasun Perera — sign in the box below</p>
        <div style={{ borderRadius:12, border:`2px solid ${C.border}`, background:C.bg, overflow:'hidden', marginBottom:8 }}>
          <canvas ref={canvasRef} width={560} height={100} style={{ display:'block', width:'100%', height:100, cursor:'crosshair', touchAction:'none' }}
            onMouseDown={startDraw} onMouseMove={draw} onMouseUp={()=>setDrawing(false)} onMouseLeave={()=>setDrawing(false)} />
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <Btn label="Clear" variant="ghost" small onClick={clear} />
          <Btn label="Confirm Signature" variant="primary" small disabled={agentSigned} onClick={()=>{ setAgentSigned(true); onToast('Agent signature recorded') }} />
          {agentSigned&&<Bdg label="✓ Signed" color={C.success} />}
        </div>
      </Card>
      {/* Client confirmation placeholder */}
      <Card style={{ padding:22, background:`${C.info}06`, border:`1.5px solid ${C.info}20` }}>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <span style={{ fontSize:24 }}>📱</span>
          <div>
            <p style={{ fontSize:13, fontWeight:700, color:C.type }}>Client Confirmation</p>
            <p style={{ fontSize:12, color:C.muted }}>Mohamed Ihsan will receive a notification to confirm via the ReadyPal app.</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

// ─── End Visit ────────────────────────────────────────────────────────────────
// Readiness is driven by the real visit_logs.checklist state — no fabricated
// six-step meta-checklist and no fake GPS-checkout confirmation. The
// care_request.tasks count is the source of truth: a visit with real tasks
// is only ready once the checklist has exactly that many items and every
// one of them is done — a checklist that is empty, short, or partially
// loaded is never treated as "nothing to do".
function EndVisit({ booking, visitLog, ending, onEndVisit }:{
  booking:ActiveBooking|null; visitLog:VisitLog|null; ending:boolean; onEndVisit:()=>void
}) {
  if(!visitLog) {
    return (
      <div style={{ maxWidth:640, margin:'0 auto', padding:'24px 28px 60px' }}>
        <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>End Visit</h2>
        <Card style={{ padding:40, textAlign:'center' as const }}>
          <p style={{ fontSize:13, color:C.muted }}>The visit has not been started yet.</p>
        </Card>
      </div>
    )
  }

  if(visitLog.status === 'completed') {
    return (
      <div style={{ maxWidth:640, margin:'0 auto', padding:'24px 28px 60px' }}>
        <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>End Visit</h2>
        <Card style={{ padding:40, textAlign:'center' as const }}>
          <p style={{ fontSize:13, color:C.muted }}>This visit was already completed at {formatClockTime(visitLog.check_out_time)}.</p>
        </Card>
      </div>
    )
  }

  const expectedTasks = booking?.care_request?.tasks?.length ?? 0
  const checklist = visitLog.checklist ?? []
  const done = checklist.filter(t=>t.done).length
  const hasRealTasks = expectedTasks > 0
  const ready = hasRealTasks
    ? (checklist.length === expectedTasks && done === expectedTasks)
    : true

  return (
    <div style={{ maxWidth:640, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>End Visit</h2>
      <Card style={{ padding:22, marginBottom:18 }}>
        <SectionTitle title="Checklist Status" />
        {!hasRealTasks ? (
          <p style={{ fontSize:13, color:C.muted, marginBottom:16 }}>No tasks were defined for this visit — nothing to complete.</p>
        ) : checklist.length!==expectedTasks ? (
          <p style={{ fontSize:13, color:C.warning, marginBottom:16 }}>
            Task Checklist has {checklist.length} of {expectedTasks} care request tasks loaded. Open Task Checklist to load and complete all {expectedTasks} tasks before finishing.
          </p>
        ) : (
          <>
            <div style={{ height:10, borderRadius:99, background:`${C.primary}10`, overflow:'hidden', marginBottom:8 }}>
              <div style={{ width:`${Math.round((done/expectedTasks)*100)}%`, height:'100%', background:`linear-gradient(90deg,${C.primary},${C.success})`, borderRadius:99 }} />
            </div>
            <p style={{ fontSize:12, color:C.muted, marginBottom:16 }}>{done} of {expectedTasks} tasks complete</p>
          </>
        )}
        <div style={{ padding:'12px', borderRadius:12, background:C.bg, display:'flex', gap:12, alignItems:'center', marginBottom:16 }}>
          <span style={{ fontSize:22 }}>🕐</span>
          <div>
            <p style={{ fontSize:11, fontWeight:700, color:C.muted }}>Checked In</p>
            <p style={{ fontSize:12, color:C.type }}>{formatClockTime(visitLog.check_in_time)}</p>
          </div>
        </div>
        <Btn label={ending?'Finishing…':ready?'Finish Visit':'Complete All Tasks First'} variant={ready?'success':'secondary'} full disabled={!ready||ending}
          onClick={onEndVisit} />
      </Card>
    </div>
  )
}

// ─── Visit Summary ────────────────────────────────────────────────────────────
// Built entirely from real booking/visit_logs fields. No distance, no fee
// percentage, no invented net-pay math — payment_amount is shown as-is or
// not at all.
function VisitSummary({ booking, visitLog, profile, onNav, onToast }:{
  booking:ActiveBooking|null; visitLog:VisitLog|null; profile:{ full_name:string|null }|null
  onNav:(s:SubView)=>void; onToast:(m:string)=>void
}) {
  if(!visitLog) {
    return (
      <div style={{ maxWidth:740, margin:'0 auto', padding:'24px 28px 60px' }}>
        <Card style={{ padding:40, textAlign:'center' as const }}>
          <p style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:8 }}>No Visit Data Available</p>
          <p style={{ fontSize:13, color:C.muted }}>This visit hasn't been started or completed yet.</p>
        </Card>
      </div>
    )
  }

  const checklist = visitLog.checklist ?? []
  const done = checklist.filter(t=>t.done).length
  const meds = visitLog.medication_log ?? []
  const mediaCount = visitLog.media_urls?.length ?? 0
  const durationStr = formatDurationBetween(visitLog.check_in_time, visitLog.check_out_time)
  const pctComplete = checklist.length ? `${Math.round((done/checklist.length)*100)}%` : '—'

  return (
    <div style={{ maxWidth:740, margin:'0 auto', padding:'24px 28px 60px' }}>
      {/* Hero */}
      <Card style={{ padding:'28px 28px', marginBottom:20, background:`linear-gradient(135deg,${C.success},#16A34A)`, border:'none', boxShadow:`0 8px 28px ${C.success}30` }}>
        <div style={{ textAlign:'center' as const }}>
          <div style={{ fontSize:60, marginBottom:10 }}>🎉</div>
          <h2 style={{ fontSize:26, fontWeight:900, color:'#fff', fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Visit Completed!</h2>
          <p style={{ fontSize:14, color:'rgba(255,255,255,0.8)', marginBottom:20 }}>{serviceLabel(booking?.care_request ?? null)} · {beneficiaryLabel(booking?.beneficiary ?? null)}</p>
          <div style={{ display:'flex', justifyContent:'center', gap:28 }}>
            {[
              {v:durationStr, l:'Duration'},
              {v: checklist.length ? `${done}/${checklist.length}` : '—', l:'Tasks'},
              {v: String(mediaCount), l:'Media'},
              {v:pctComplete, l:'Complete'},
            ].map((s,i)=>(
              <div key={i} style={{ textAlign:'center' as const }}>
                <p style={{ fontSize:24, fontWeight:900, color:'#fff', fontFamily:'Manrope,sans-serif', lineHeight:1 }}>{s.v}</p>
                <p style={{ fontSize:10, color:'rgba(255,255,255,0.65)' }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }} className="lce-2col">
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <Card style={{ padding:22 }}>
            <SectionTitle title="Service Summary" />
            {[
              {l:'Agent',v:profile?.full_name || 'Not provided'},
              {l:'Beneficiary',v:beneficiaryLabel(booking?.beneficiary ?? null)},
              {l:'Client',v:clientLabel(booking?.client ?? null)},
              {l:'Service',v:serviceLabel(booking?.care_request ?? null)},
              {l:'Location',v:locationLabel(booking)},
              {l:'Started',v:formatClockTime(visitLog.check_in_time)},
              {l:'Completed',v:formatClockTime(visitLog.check_out_time)},
              {l:'Duration',v:durationStr},
            ].map((r,i)=>(
              <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:`1px solid ${C.border}` }}>
                <p style={{ fontSize:12, color:C.muted }}>{r.l}</p>
                <p style={{ fontSize:12, fontWeight:600, color:C.type }}>{r.v}</p>
              </div>
            ))}
          </Card>
          <Card style={{ padding:22 }}>
            <SectionTitle title="Medication Summary" />
            {meds.length===0
              ? <p style={{ fontSize:12, color:C.muted }}>No medication recorded.</p>
              : meds.map((m,i)=>(
                <div key={m.id} style={{ display:'flex', gap:8, alignItems:'center', padding:'8px 0', borderBottom:i<meds.length-1?`1px solid ${C.border}`:'none' }}>
                  <div style={{ width:7, height:7, borderRadius:'50%', background:m.collected?C.success:C.warning }} />
                  <p style={{ flex:1, fontSize:12, color:C.type }}>{m.name}</p>
                  <Bdg label={m.collected?'Collected':m.purchased?'Purchased':'Pending'} color={m.collected?C.success:m.purchased?C.primary:C.warning} />
                </div>
              ))}
          </Card>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <Card style={{ padding:22 }}>
            <SectionTitle title="Tasks Completed" />
            {checklist.filter(t=>t.done).length===0
              ? <p style={{ fontSize:12, color:C.muted }}>No completed tasks recorded.</p>
              : checklist.filter(t=>t.done).map(t=>(
                <div key={t.id} style={{ display:'flex', gap:8, padding:'6px 0' }}>
                  <span style={{ display:'flex', color:C.success, flexShrink:0, marginTop:1 }}>{I.check}</span>
                  <p style={{ fontSize:12, color:C.type }}>{t.label}</p>
                </div>
              ))}
          </Card>
          <Card style={{ padding:22 }}>
            <SectionTitle title="Payment" />
            {booking?.payment_amount!=null
              ? (
                <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 0' }}>
                  <p style={{ fontSize:12, color:C.sub }}>Payment Amount</p>
                  <p style={{ fontSize:14, fontWeight:900, color:C.success, fontFamily:'Manrope,sans-serif' }}>{booking.payment_amount}</p>
                </div>
              )
              : <p style={{ fontSize:12, color:C.muted }}>Not available.</p>}
          </Card>
          <Card style={{ padding:22, background:`${C.warning}06`, border:`1.5px solid ${C.warning}20` }}>
            <SectionTitle title="Incident Summary" />
            {visitLog.incident_report
              ? <p style={{ fontSize:12, color:C.type, lineHeight:1.6 }}>{visitLog.incident_report}</p>
              : (
                <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                  <span style={{ fontSize:22 }}>✅</span>
                  <p style={{ fontSize:12, color:C.type }}>No incidents reported during this visit.</p>
                </div>
              )}
          </Card>
        </div>
      </div>

      <div style={{ display:'flex', gap:10, marginTop:18, flexWrap:'wrap' as const }}>
        <Btn label="View Follow-up" onClick={()=>onNav('followup')} />
        <Btn label="Download Report" variant="secondary" icon={I.download} onClick={()=>onToast('Generating PDF…')} />
        <Btn label="Rate Visit" variant="ghost" icon={I.star} onClick={()=>onToast('Opening rating…')} />
      </div>
    </div>
  )
}

// ─── Follow-up ────────────────────────────────────────────────────────────────
function Followup({ onToast }:{ onToast:(m:string)=>void }) {
  const cards = [
    {e:'📅',t:'Schedule Next Visit',   d:'Book Nimal Perera for his follow-up appointment on Mon 3 Feb.', col:C.primary, cta:'Schedule'},
    {e:'💊',t:'Recommend Service',     d:"Suggest a weekly Medication Collection service for Nimal's prescriptions.", col:C.accent, cta:'Recommend'},
    {e:'🔁',t:'Set Up Recurring Care', d:'Convert to a weekly recurring service — every Monday at 9:30 AM.', col:C.info, cta:'Set Up'},
    {e:'🔔',t:'Set Reminder',          d:'Remind Kasun 7 days before next appointment.', col:C.warning, cta:'Remind'},
  ]
  return (
    <div style={{ maxWidth:720, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Follow-up Recommendations</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="lce-2col">
        {cards.map((c,i)=>(
          <Card key={i} hover style={{ padding:24 }}>
            <div style={{ width:52, height:52, borderRadius:16, background:`${c.col}12`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, marginBottom:14 }}>{c.e}</div>
            <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:8 }}>{c.t}</p>
            <p style={{ fontSize:12, color:C.muted, lineHeight:1.6, marginBottom:16 }}>{c.d}</p>
            <Btn label={c.cta} variant="secondary" small onClick={()=>onToast(`${c.t} initiated`)} />
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Notifications ────────────────────────────────────────────────────────────
// Backed by getMyNotifications() / markNotificationRead() / markAllNotificationsRead().
type NotificationRow = { id:string; type:string|null; title:string|null; body:string|null; read:boolean; action_url:string|null; created_at:string }

function Notifications({ notifications, onMarkRead, onMarkAllRead }:{
  notifications:NotificationRow[]|null; onMarkRead:(id:string)=>void; onMarkAllRead:()=>void
}) {
  if(notifications===null) {
    return (
      <div style={{ maxWidth:660, margin:'0 auto', padding:'24px 28px 60px' }}>
        <p style={{ fontSize:13, color:C.muted }}>Loading notifications…</p>
      </div>
    )
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
            <Card key={n.id} hover onClick={()=>{ if(!n.read) onMarkRead(n.id) }} style={{ padding:18, background:n.read?C.surface:`${C.primary}04`, border:`1px solid ${n.read?C.border:C.primary+'25'}` }}>
              <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                <div style={{ width:42, height:42, borderRadius:12, background:`${C.primary}12`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>🔔</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3, gap:8 }}>
                    <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                      <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{n.title || 'Notification'}</p>
                      {!n.read&&<div style={{ width:7, height:7, borderRadius:'50%', background:C.primary }}/>}
                    </div>
                    <p style={{ fontSize:10, color:C.muted, whiteSpace:'nowrap' as const }}>{formatClockTime(n.created_at)}</p>
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

// ─── Status Badges ────────────────────────────────────────────────────────────
function StatusBadgesView() {
  return (
    <div style={{ maxWidth:700, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Status Badges</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        {(Object.entries(STATUS) as [VisitStatus, typeof STATUS[VisitStatus]][]).map(([k,s])=>(
          <Card key={k} style={{ padding:20 }}>
            <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:10 }}>
              <div style={{ width:10, height:10, borderRadius:'50%', background:s.color }} />
              <p style={{ fontSize:22 }}>{s.emoji}</p>
              <p style={{ fontSize:14, fontWeight:800, color:C.type }}>{s.label}</p>
            </div>
            <Bdg label={s.label} color={s.color} dot />
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Empty / Loading / Error / Success ────────────────────────────────────────
function EmptyStates() {
  return (
    <div style={{ padding:'28px 28px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:20 }}>Empty States</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        {[{e:'📸',t:'No Photos',     d:'No photos have been captured yet during this visit.'},{e:'📁',t:'No Documents',  d:'No documents have been uploaded.'},{e:'📝',t:'No Notes',      d:"You haven't added any care notes yet."},{e:'⚠️',t:'No Incidents',  d:'No incidents reported during this visit.'}].map((s,i)=>(
          <Card key={i} style={{ padding:'40px 24px', textAlign:'center' as const }}>
            <div style={{ fontSize:48, marginBottom:14 }}>{s.e}</div>
            <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:8 }}>{s.t}</p>
            <p style={{ fontSize:12, color:C.muted, lineHeight:1.7 }}>{s.d}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

function LoadingStates() {
  return (
    <div style={{ padding:'28px 28px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:20 }}>Loading States</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        {['Loading GPS','Loading Timeline','Uploading Photo','Saving Notes'].map((l,i)=>(
          <Card key={i} style={{ padding:22 }}>
            <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:14 }}>{l}</p>
            <Shimmer h={160} /><div style={{height:10}}/>
            {[...Array(3)].map((_,j)=>(
              <div key={j} style={{ display:'flex', gap:10, marginBottom:10 }}>
                <Shimmer w="40px" h={40}/><div style={{flex:1}}><Shimmer h={12} w="65%"/><div style={{height:4}}/><Shimmer h={10} w="40%"/></div>
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
      {[{e:'📡',t:'GPS Lost',         d:'Location signal lost. Your last known position is National Hospital, Colombo.',col:C.error},{e:'📤',t:'Upload Failed',   d:'Photo could not be uploaded. Please retry when back online.',             col:C.warning},{e:'📶',t:'Network Lost',   d:'You are offline. Changes will sync when connection is restored.',           col:C.muted},{e:'💾',t:'Unable to Save',  d:'Care notes could not be saved. Please try again.',                         col:C.warning}].map((er,i)=>(
        <Card key={i} style={{ padding:22, marginBottom:12, border:`1.5px solid ${er.col}30`, background:`${er.col}04` }}>
          <div style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
            <div style={{ width:44, height:44, borderRadius:14, background:`${er.col}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{er.e}</div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:13, fontWeight:800, color:er.col, marginBottom:4 }}>{er.t}</p>
              <p style={{ fontSize:12, color:C.sub, lineHeight:1.6, marginBottom:10 }}>{er.d}</p>
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
      {[{e:'🏥',t:'Visit Started',       d:'Check-in confirmed at National Hospital. Mohamed Ihsan notified.',col:C.success},{e:'✅',t:'Checklist Updated',  d:'Purchase Medication marked complete.',                          col:C.primary},{e:'💊',t:'Medication Logged',  d:'Paracetamol 500mg marked as purchased and collected.',          col:C.accent},{e:'📸',t:'Photo Uploaded',    d:'Hospital receipt uploaded to Document Center.',                col:C.info},{e:'📋',t:'Report Submitted',   d:'Lab results uploaded and shared with Mohamed Ihsan.',           col:C.warning},{e:'🎉',t:'Visit Completed',    d:'Hospital Appointment Assistance for Nimal Perera — done!',      col:C.success}].map((s,i)=>(
        <Card key={i} style={{ padding:20, marginBottom:10, border:`1.5px solid ${s.col}30`, background:`${s.col}04` }}>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <div style={{ width:44, height:44, borderRadius:14, background:`${s.col}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{s.e}</div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:13, fontWeight:700, color:s.col, marginBottom:2 }}>{s.t}</p>
              <p style={{ fontSize:12, color:C.sub }}>{s.d}</p>
            </div>
            <span style={{ color:s.col, display:'flex', transform:'scale(1.2)' }}>{I.check}</span>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function CareExecution() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const requestedBookingId = searchParams.get('bookingId')

  const [sub, setSub] = useState<SubView>('dashboard')
  const [toast, setToast] = useState<string|null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [profile, setProfile] = useState<{ full_name:string|null }|null>(null)
  const [booking, setBooking] = useState<ActiveBooking|null>(null)
  const [visitLog, setVisitLog] = useState<VisitLog|null>(null)
  const [notifications, setNotifications] = useState<NotificationRow[]|null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string|null>(null)
  const [starting, setStarting] = useState(false)
  const [ending, setEnding] = useState(false)
  const [messagingClient, setMessagingClient] = useState(false)

  const showToast = (m:string) => { setToast(m); setTimeout(()=>setToast(null),2800) }

  const handleMessageClient = async () => {
    if(!booking || messagingClient) return
    setMessagingClient(true)
    try {
      const conversationId = await getOrCreateBookingConversation(booking.id)
      navigate(`/agent/messaginghub?conversationId=${conversationId}`)
    } catch(e:any) {
      showToast(e?.message || "Couldn't open messages. Please try again.")
    } finally {
      setMessagingClient(false)
    }
  }

  // Loads real profile/booking/visit-log/notification data once on mount.
  // A specific ?bookingId= (from a booking/task card elsewhere in the app)
  // loads that exact booking; otherwise falls back to the agent's single
  // auto-picked "most relevant" active booking. Nothing here is mocked — a
  // failure surfaces as loadError rather than falling back to demo content.
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [profileData, bookingData, notifData] = await Promise.all([
          getMyProfile(),
          requestedBookingId ? getBookingById(requestedBookingId) : getMyActiveBooking(),
          getMyNotifications(),
        ])
        if(cancelled) return
        setProfile(profileData)
        setBooking(bookingData as ActiveBooking|null)
        setNotifications(notifData as NotificationRow[])
        if(bookingData) {
          const v = await getVisitLog(bookingData.id)
          if(!cancelled) setVisitLog(v as VisitLog|null)
        }
      } catch(e:any) {
        if(!cancelled) setLoadError(e?.message || 'Failed to load visit data')
      } finally {
        if(!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [requestedBookingId])

  async function handleStartVisit(gps:{lat:number;lng:number}|null) {
    if(!booking) return
    setStarting(true)
    try {
      const v = await apiStartVisit(booking.id, gps)
      setVisitLog(v as VisitLog)
      setBooking(b => b ? { ...b, status:'in_progress' } : b)
      showToast('Visit started')
      setSub('dashboard')
    } catch(e:any) {
      showToast(e?.message || 'Could not start visit')
    } finally {
      setStarting(false)
    }
  }

  // The six handlers below own ALL success/error feedback for their
  // operation: on success they update visitLog state and show a toast; on
  // failure they show an error toast and rethrow, so a component that
  // awaits the call never runs its own "it worked" logic after a failed
  // write.
  async function handleSetStatus(status:VisitStatus) {
    if(!visitLog) return
    try {
      const v = await updateVisitStatus(visitLog.id, status)
      setVisitLog(v as VisitLog)
      showToast(`Status updated to ${STATUS[status].label}`)
    } catch(e:any) {
      showToast(e?.message || 'Could not update status')
      throw e
    }
  }

  async function handleSaveChecklist(checklist:ChecklistItem[], successMessage?:string) {
    if(!visitLog) return
    try {
      const v = await updateVisitChecklist(visitLog.id, checklist)
      setVisitLog(v as VisitLog)
      if(successMessage) showToast(successMessage)
    } catch(e:any) {
      showToast(e?.message || 'Could not save checklist')
      throw e
    }
  }

  async function handleSaveMedication(meds:MedicationItem[], successMessage?:string) {
    if(!visitLog) return
    try {
      const v = await updateVisitMedication(visitLog.id, meds)
      setVisitLog(v as VisitLog)
      if(successMessage) showToast(successMessage)
    } catch(e:any) {
      showToast(e?.message || 'Could not save medication')
      throw e
    }
  }

  async function handleSaveVitals(vitals:VisitVitals) {
    if(!visitLog) return
    try {
      const v = await updateVisitVitals(visitLog.id, vitals)
      setVisitLog(v as VisitLog)
      showToast('Vital signs recorded')
    } catch(e:any) {
      showToast(e?.message || 'Could not save vitals')
      throw e
    }
  }

  async function handleSaveNotes(notes:string) {
    if(!visitLog) return
    try {
      const v = await updateVisitNotes(visitLog.id, notes)
      setVisitLog(v as VisitLog)
      showToast('Note saved')
    } catch(e:any) {
      showToast(e?.message || 'Could not save notes')
      throw e
    }
  }

  async function handleSubmitIncident(text:string) {
    if(!visitLog) return
    try {
      const v = await submitIncidentReport(visitLog.id, text)
      setVisitLog(v as VisitLog)
      showToast('Incident report submitted')
    } catch(e:any) {
      showToast(e?.message || 'Could not submit report')
      throw e
    }
  }

  async function handleEndVisit() {
    if(!visitLog || visitLog.status === 'completed') return
    setEnding(true)
    try {
      const v = await apiEndVisit(visitLog.id, booking?.id)
      setVisitLog(v as VisitLog)
      setBooking(b => b ? { ...b, status:'completed' } : b)
      showToast('Visit completed')
      setSub('summary')
    } catch(e:any) {
      showToast(e?.message || 'Could not end visit')
    } finally {
      setEnding(false)
    }
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

  const currentStatus:LiveStatus = visitLog?.status ?? 'not_started'
  const unreadCount = notifications?.filter(n=>!n.read).length ?? 0
  const groups = [...new Set(NAV_ITEMS.map(n=>n.group))]
  const msg: Record<string,string> = {
    dashboard:'Live Dashboard', startVisit:'Start Visit', liveStatus:'Live Status', gps:'GPS Tracking',
    timeline:'Live Timeline', checklist:'Task Checklist', medication:'Medication Tracker', vitals:'Vital Signs',
    notes:'Care Notes', media:'Photo & Media', documents:'Documents', incident:'Incident Report',
    emergency:'Emergency Mode', clientUpdates:'Client Updates', signature:'Digital Signature',
    endVisit:'End Visit', summary:'Visit Summary', followup:'Follow-up',
    notifications:'Notifications', statusBadges:'Status Badges',
    empty:'Empty States', loading:'Loading States', error:'Error States', success:'Success States',
  }

  const renderContent = () => {
    if(loading) {
      return <div style={{ padding:'24px 28px 60px' }}><p style={{ fontSize:13, color:C.muted }}>Loading your visit…</p></div>
    }
    if(loadError) {
      return <div style={{ padding:'24px 28px 60px' }}><p style={{ fontSize:13, color:C.error }}>{loadError}</p></div>
    }
    switch(sub) {
      case 'dashboard':     return <LiveDashboard booking={booking} visitLog={visitLog} onNav={setSub} onToast={showToast} onSaveNotes={handleSaveNotes} onMessageClient={handleMessageClient} messagingClient={messagingClient} />
      case 'startVisit':    return <StartVisit booking={booking} visitLog={visitLog} profile={profile} starting={starting} onStart={handleStartVisit} onNav={setSub} />
      case 'liveStatus':    return <LiveStatusView visitLog={visitLog} onSetStatus={handleSetStatus} />
      case 'gps':           return <GPSTracking onToast={showToast} />
      case 'timeline':      return <LiveTimeline />
      case 'checklist':     return <TaskChecklist booking={booking} visitLog={visitLog} onSaveChecklist={handleSaveChecklist} />
      case 'medication':    return <MedicationTracker visitLog={visitLog} onSaveMedication={handleSaveMedication} />
      case 'vitals':        return <VitalSigns booking={booking} visitLog={visitLog} onSaveVitals={handleSaveVitals} />
      case 'notes':         return <CareNotes visitLog={visitLog} onSaveNotes={handleSaveNotes} />
      case 'media':         return <PhotoMedia onToast={showToast} />
      case 'documents':     return <DocumentCenter onToast={showToast} />
      case 'incident':      return <IncidentReporting booking={booking} visitLog={visitLog} onSubmitIncident={handleSubmitIncident} />
      case 'emergency':     return <EmergencyMode onToast={showToast} />
      case 'clientUpdates': return <ClientLiveUpdates onToast={showToast} />
      case 'signature':     return <DigitalSignature onToast={showToast} />
      case 'endVisit':      return <EndVisit booking={booking} visitLog={visitLog} ending={ending} onEndVisit={handleEndVisit} />
      case 'summary':       return <VisitSummary booking={booking} visitLog={visitLog} profile={profile} onNav={setSub} onToast={showToast} />
      case 'followup':      return <Followup onToast={showToast} />
      case 'notifications': return <Notifications notifications={notifications} onMarkRead={handleMarkRead} onMarkAllRead={handleMarkAllRead} />
      case 'statusBadges':  return <StatusBadgesView />
      case 'empty':         return <EmptyStates />
      case 'loading':       return <LoadingStates />
      case 'error':         return <ErrorStates onToast={showToast} />
      case 'success':       return <SuccessStates onToast={showToast} />
      default: return null
    }
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:C.bg, fontFamily:'Manrope,sans-serif' }}>
      {/* Sidebar */}
      <div className="lce-sidebar" style={{ width:224, background:C.surface, borderRight:`1px solid ${C.border}`, display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh', overflowY:'auto', flexShrink:0 }}>
        <button onClick={()=>navigate('/agent/agentdashboard')}
          style={{ display:'flex', gap:7, alignItems:'center', padding:'12px 18px', border:'none', borderBottom:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:700, color:C.sub, textAlign:'left' as const }}>
          <span style={{ display:'flex' }}>{I.chevL}</span> Back to Dashboard
        </button>
        <div style={{ padding:'16px 18px 14px', borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <Avatar initials={initials(profile?.full_name)} size={36} />
            <div>
              <p style={{ fontSize:13, fontWeight:800, color:C.type }}>{profile?.full_name || 'Agent'}</p>
              <div style={{ display:'flex', gap:5, alignItems:'center' }}>
                <div style={{ width:7, height:7, borderRadius:'50%', background:STATUS[currentStatus].color, animation:'pulse-dot 2s ease-in-out infinite' }} />
                <p style={{ fontSize:11, fontWeight:700, color:STATUS[currentStatus].color }}>{STATUS[currentStatus].emoji} {STATUS[currentStatus].label}</p>
              </div>
            </div>
          </div>
        </div>
        {groups.map(group=>(
          <div key={group}>
            <p style={{ fontSize:9, fontWeight:800, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.09em', padding:'10px 18px 4px' }}>{group}</p>
            {NAV_ITEMS.filter(n=>n.group===group).map(n=>{
              const active = sub===n.k
              return (
                <button key={n.k} onClick={()=>{ setSub(n.k); setSidebarOpen(false) }}
                  style={{ width:'100%', display:'flex', gap:9, alignItems:'center', padding:'9px 18px', border:'none', background:active?`${n.k==='emergency'?C.error:C.primary}08`:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:active?700:500, color:active?(n.k==='emergency'?C.error:C.primary):C.type, textAlign:'left' as const, borderLeft:active?`3px solid ${n.k==='emergency'?C.error:C.primary}`:'3px solid transparent', transition:'all 0.12s' }}>
                  <span style={{ display:'flex', color:active?(n.k==='emergency'?C.error:C.primary):C.muted }}>{n.icon}</span>
                  {n.l}
                  {n.k==='notifications'&&unreadCount>0&&<div style={{ marginLeft:'auto', minWidth:18, height:18, borderRadius:99, background:C.error, color:'#fff', fontSize:9, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 5px' }}>{unreadCount}</div>}
                  {n.k==='emergency'&&<div style={{ marginLeft:'auto', width:8, height:8, borderRadius:'50%', background:C.error, animation:'pulse-dot 1.5s ease-in-out infinite' }}/>}
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
              <p style={{ fontSize:13, fontWeight:800, color:C.type }}>Care Execution</p>
            </div>
            {NAV_ITEMS.map(n=>(
              <button key={n.k} onClick={()=>{ setSub(n.k); setSidebarOpen(false) }}
                style={{ width:'100%', display:'flex', gap:9, alignItems:'center', padding:'10px 18px', border:'none', background:sub===n.k?`${C.primary}08`:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:sub===n.k?700:500, color:sub===n.k?C.primary:C.type, textAlign:'left' as const }}>
                <span style={{ display:'flex', color:sub===n.k?C.primary:C.muted }}>{n.icon}</span>{n.l}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile top bar */}
      <div className="lce-mobile-nav" style={{ display:'none', position:'fixed', top:0, left:0, right:0, zIndex:40, background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'12px 18px', alignItems:'center', justifyContent:'space-between' }}>
        <p style={{ fontSize:13, fontWeight:800, color:C.type }}>{msg[sub]??'Care Execution'}</p>
        <button onClick={()=>setSidebarOpen(v=>!v)} style={{ background:'none', border:'none', cursor:'pointer', color:C.type, fontSize:12, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>Menu</button>
      </div>

      {/* Main */}
      <div style={{ flex:1, overflowY:'auto' }} className="lce-main">
        {renderContent()}
      </div>

      {toast&&<Toast msg={toast} />}
    </div>
  )
}
