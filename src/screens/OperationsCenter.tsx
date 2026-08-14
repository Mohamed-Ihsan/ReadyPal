import { useState, type ReactNode, type CSSProperties } from 'react'

// ─── Brand ────────────────────────────────────────────────────────────────────
const C = {
  primary:'#00737A', accent:'#EE8153', type:'#2C3E43', sub:'#6B7E85',
  muted:'#9AAAB0', border:'#E4E8EA', bg:'#F2F4F5', surface:'#FFFFFF',
  success:'#22C55E', warning:'#F59E0B', error:'#EF4444', info:'#3B82F6',
  dark:'#1A2A30',
}

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS: Record<string,{ color:string; label:string }> = {
  pending:    { color:C.muted,    label:'Pending'    },
  assigned:   { color:C.info,     label:'Assigned'   },
  accepted:   { color:C.primary,  label:'Accepted'   },
  travelling: { color:'#8B5CF6',  label:'Travelling' },
  checkin:    { color:'#06B6D4',  label:'Checked In' },
  inprogress: { color:C.warning,  label:'In Progress'},
  completed:  { color:C.success,  label:'Completed'  },
  delayed:    { color:C.error,    label:'Delayed'    },
  cancelled:  { color:C.error,    label:'Cancelled'  },
  emergency:  { color:'#DC2626',  label:'Emergency'  },
  slarisk:    { color:'#F97316',  label:'SLA Risk'   },
}

const PRIORITY: Record<string,string> = { high:C.error, medium:C.warning, low:C.success, urgent:'#DC2626' }

// ─── Icons ────────────────────────────────────────────────────────────────────
const I: Record<string,ReactNode> = {
  home:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 5.5l5.5-4.5 5.5 4.5V12H8.5V8.5h-4V12H1V5.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  book:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1.5" y="1" width="10" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 4.5h5M4 7h5M4 9.5h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  dispatch:<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M6.5 4v2.5l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  map:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M4.5 1L1 3v9l3.5-2 4 2 4-2V1L9 3l-4.5-2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M4.5 1v9M8.5 3v9" stroke="currentColor" strokeWidth="1.1"/></svg>,
  cal:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="2" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 5.5h11M4 1v2M9 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  alert:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5L1 12h11L6.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M6.5 5.5v3M6.5 10v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  assign: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5" cy="4" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 11.5c0-1.93 1.57-3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M10 7l2 2-2 2M12 9H8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  sla:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M6.5 3.5V7h2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  cancel: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 4l5 5M9 4L4 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  doc:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M3 1h5l3 3v8H3V1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M8 1v3h3" stroke="currentColor" strokeWidth="1.1"/><path d="M5 6h3M5 8h3M5 10h2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  msg:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 1h11v8H7.5L5 11l-1-2H1V1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  report: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="1" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 9V7M6.5 9V5M9 9V3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  bell:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5c-2.5 0-4 1.8-4 4v2.5L1 9.5h11l-1.5-1.5V5.5c0-2.2-1.5-4-4-4z" stroke="currentColor" strokeWidth="1.2"/><path d="M5 9.5c0 .83.67 1.5 1.5 1.5S8 10.33 8 9.5" stroke="currentColor" strokeWidth="1.1"/></svg>,
  check:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 6.5l3 3.5 5-6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  eye:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 6.5C1 6.5 3 3.5 6.5 3.5S12 6.5 12 6.5 10 9.5 6.5 9.5 1 6.5 1 6.5z" stroke="currentColor" strokeWidth="1.2"/><circle cx="6.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/></svg>,
  edit:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M9.5 1.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  refresh:<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M11 6.5a4.5 4.5 0 1 1-1-2.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M11 3v2.5H8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  plus:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2v9M2 6.5h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  chevR:  <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M3.5 2l3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  phone:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M4 1.5H2.5A1.5 1.5 0 0 0 1 3c0 5 4 9 9 9a1.5 1.5 0 0 0 1.5-1.5V9l-2.5-1L8 9.5A7.5 7.5 0 0 1 3.5 5l1.5-1L4 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  pin:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1C4.5 1 3 2.6 3 4.5c0 3 3.5 7.5 3.5 7.5S10 7.5 10 4.5C10 2.6 8.5 1 6.5 1z" stroke="currentColor" strokeWidth="1.2"/><circle cx="6.5" cy="4.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/></svg>,
  download:<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2v7M4 6.5L6.5 9 9 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M1.5 10.5h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  reschedule:<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="2" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 5.5h11M4 1v2M9 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M7 7.5l1 1-1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  pulse:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 6.5h2L4.5 4l2 5 1.5-3L9 6.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  star:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5l1.2 3.4H11L8.4 7l1 3.2-2.9-2-2.9 2 1-3.2L2 4.9h3.3l1.2-3.4z" stroke="currentColor" strokeWidth="1.1" fill="currentColor"/></svg>,
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const BOOKINGS = [
  { id:'RP-2026-000184', client:'Mohamed Ihsan', beneficiary:'Nimal Perera',   agent:'Kasun Perera',    service:'Hospital Appointment Assistance', date:'22 Jan 2026', time:'09:00 – 13:00', location:'Colombo 03', status:'inprogress', priority:'high',   payment:'paid',    sla:'ok'    },
  { id:'RP-2026-000185', client:'Priya Fernando', beneficiary:'Ananda F.',     agent:'Unassigned',      service:'Elderly Daily Care',              date:'22 Jan 2026', time:'10:00 – 14:00', location:'Kandy',      status:'pending',   priority:'medium', payment:'paid',    sla:'risk'  },
  { id:'RP-2026-000186', client:'Chamari W.',     beneficiary:'Ruwan W.',      agent:'Dilshan R.',      service:'Post-Surgery Support',            date:'22 Jan 2026', time:'08:00 – 12:00', location:'Gampaha',    status:'travelling',priority:'high',   payment:'paid',    sla:'ok'    },
  { id:'RP-2026-000187', client:'Suresh P.',      beneficiary:'Malini P.',     agent:'Unassigned',      service:'Therapy Assistance',              date:'22 Jan 2026', time:'14:00 – 16:00', location:'Colombo 07', status:'pending',   priority:'low',    payment:'pending', sla:'risk'  },
  { id:'RP-2026-000188', client:'Dilrukshi N.',   beneficiary:'Sarath N.',     agent:'Ayesha M.',       service:'Companion Care',                  date:'22 Jan 2026', time:'11:00 – 15:00', location:'Nugegoda',   status:'accepted',  priority:'medium', payment:'paid',    sla:'ok'    },
  { id:'RP-2026-000183', client:'Ranjith B.',     beneficiary:'Soma B.',       agent:'Amara S.',         service:'Medication Assistance',           date:'22 Jan 2026', time:'07:30 – 09:30', location:'Moratuwa',   status:'completed', priority:'low',    payment:'paid',    sla:'ok'    },
  { id:'RP-2026-000180', client:'Thilina S.',     beneficiary:'Karuna S.',     agent:'Kasun Perera',    service:'Hospital Visit',                  date:'21 Jan 2026', time:'09:00 – 13:00', location:'Colombo 10', status:'delayed',   priority:'urgent', payment:'paid',    sla:'breach'},
]

const AGENTS = [
  { name:'Kasun Perera',    avail:true,  dist:'1.2 km', score:97, travel:'8 min',  status:'busy',    rating:4.9 },
  { name:'Dilshan R.',      avail:true,  dist:'2.8 km', score:89, travel:'14 min', status:'online',  rating:4.7 },
  { name:'Ayesha M.',       avail:true,  dist:'3.1 km', score:85, travel:'17 min', status:'online',  rating:4.8 },
  { name:'Amara S.',        avail:false, dist:'4.5 km', score:72, travel:'22 min', status:'offline', rating:4.6 },
  { name:'Chamara K.',      avail:true,  dist:'5.2 km', score:68, travel:'26 min', status:'online',  rating:4.5 },
]

// ─── Primitives ───────────────────────────────────────────────────────────────
function Card({ children, style={}, hover=false, onClick }:{ children:ReactNode; style?:CSSProperties; hover?:boolean; onClick?:()=>void }) {
  return (
    <div onClick={onClick}
      onMouseEnter={e=>{ if(hover){ const el=e.currentTarget as HTMLDivElement; el.style.borderColor=C.primary+'50'; el.style.boxShadow='0 8px 24px rgba(44,62,67,0.10)' }}}
      onMouseLeave={e=>{ if(hover){ const el=e.currentTarget as HTMLDivElement; el.style.borderColor=(style as CSSProperties & {borderColor?:string}).borderColor||C.border; el.style.boxShadow='0 1px 4px rgba(44,62,67,0.06)' }}}
      style={{ background:C.surface, borderRadius:14, border:`1px solid ${C.border}`, boxShadow:'0 1px 4px rgba(44,62,67,0.06)', transition:'all 0.18s', cursor:onClick?'pointer':undefined, ...style }}>
      {children}
    </div>
  )
}

const BTN_BASE: Record<string,CSSProperties> = {
  primary:  { background:C.primary,  color:'#fff', border:'none', boxShadow:`0 2px 8px ${C.primary}30` },
  secondary:{ background:'#fff',     color:C.primary, border:`1.5px solid ${C.border}` },
  ghost:    { background:'transparent', color:C.sub, border:'none' },
  danger:   { background:C.error,    color:'#fff', border:'none' },
  warning:  { background:C.warning,  color:'#fff', border:'none' },
  success:  { background:C.success,  color:'#fff', border:'none' },
}
const BTN_HOVER: Record<string,Partial<CSSProperties>> = {
  primary:  { background:'#005D63',  boxShadow:`0 4px 16px ${C.primary}50` },
  secondary:{ background:'#EEF5F5', borderColor:C.primary },
  ghost:    { background:C.bg },
  danger:   { background:'#DC2626' },
  warning:  { background:'#D97706' },
  success:  { background:'#16A34A' },
}

function Btn({ label, icon, onClick, variant='primary', small=false, full=false }:{
  label:string; icon?:ReactNode; onClick?:()=>void
  variant?:'primary'|'secondary'|'ghost'|'danger'|'warning'|'success'
  small?:boolean; full?:boolean
}) {
  const applyHover = (el:HTMLButtonElement, on:boolean) => {
    const h = BTN_HOVER[variant]
    if(on) Object.assign(el.style, h)
    else Object.assign(el.style, { background:(BTN_BASE[variant] as {background:string}).background, boxShadow:(BTN_BASE[variant] as {boxShadow?:string}).boxShadow||'', borderColor:'' })
  }
  return (
    <button onClick={onClick}
      onMouseEnter={e=>applyHover(e.currentTarget as HTMLButtonElement, true)}
      onMouseLeave={e=>applyHover(e.currentTarget as HTMLButtonElement, false)}
      style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:small?'6px 13px':'10px 18px', borderRadius:9, cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:small?11:13, fontWeight:700, transition:'all 0.15s', width:full?'100%':undefined, ...BTN_BASE[variant] }}>
      {icon&&<span style={{display:'flex'}}>{icon}</span>}{label}
    </button>
  )
}

function Bdg({ label, color=C.primary, dot=false }:{ label:string; color?:string; dot?:boolean }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:dot?5:0, padding:'3px 9px', borderRadius:999, fontSize:10, fontWeight:700, background:`${color}15`, color, whiteSpace:'nowrap' as const }}>
      {dot&&<div style={{width:6,height:6,borderRadius:'50%',background:color,flexShrink:0}}/>}{label}
    </span>
  )
}

function SectionTitle({ title, action, onAction }:{ title:string; action?:string; onAction?:()=>void }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
      <h3 style={{ fontSize:14, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>{title}</h3>
      {action&&<button onClick={onAction} style={{ fontSize:11, fontWeight:700, color:C.primary, background:'none', border:'none', cursor:'pointer', fontFamily:'Manrope,sans-serif', display:'flex', alignItems:'center', gap:3 }}>{action}<span style={{display:'flex'}}>{I.chevR}</span></button>}
    </div>
  )
}

function Toast({ msg }:{ msg:string }) {
  return (
    <div style={{ position:'fixed', bottom:28, left:'50%', transform:'translateX(-50%)', zIndex:999, display:'flex', alignItems:'center', gap:10, padding:'12px 22px', borderRadius:14, background:C.dark, color:'#fff', fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:700, boxShadow:'0 8px 28px rgba(0,0,0,0.25)', pointerEvents:'none', whiteSpace:'nowrap' as const }}>
      <span style={{display:'flex',color:C.success}}>{I.check}</span>{msg}
    </div>
  )
}

function Shimmer({ w='100%', h=14 }:{ w?:string; h?:number }) {
  return <div style={{ width:w, height:h, borderRadius:7, background:'linear-gradient(90deg,#E4E8EA 25%,#F2F4F5 50%,#E4E8EA 75%)', backgroundSize:'200% 100%', animation:'shimmer 1.6s ease-in-out infinite' }} />
}

function StatusBdg({ status }:{ status:string }) {
  const s = STATUS[status] || { color:C.muted, label:status }
  return <Bdg label={s.label} color={s.color} dot />
}

function UA({ name, size=36, color=C.primary }:{ name:string; size?:number; color?:string }) {
  const initials = name.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase()
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', color, fontFamily:'Manrope,sans-serif', fontWeight:900, fontSize:size*0.3, flexShrink:0 }}>{initials}</div>
  )
}

// ─── Sub-view type ────────────────────────────────────────────────────────────
type SubView = 'dashboard'|'directory'|'bookingDetail'|'liveMonitor'|'dispatch'|'assignments'|'scheduling'|'conflicts'|'liveMap'|'emergency'|'timeline'|'checklist'|'sla'|'cancellation'|'reschedule'|'communication'|'documents'|'activityFeed'|'notifications'|'reports'|'statusBadges'|'empty'|'loading'|'error'|'success'

const NAV: { k:SubView; l:string; icon:ReactNode; group:string; badge?:number }[] = [
  { k:'dashboard',     l:'Operations Dashboard', icon:I.home,     group:'Overview' },
  { k:'directory',     l:'Booking Directory',    icon:I.book,     group:'Overview' },
  { k:'bookingDetail', l:'Booking Details',      icon:I.eye,      group:'Overview' },
  { k:'liveMonitor',   l:'Live Service Monitor', icon:I.pulse,    group:'Live Ops', badge:3 },
  { k:'dispatch',      l:'Dispatch Center',      icon:I.dispatch, group:'Live Ops', badge:5 },
  { k:'assignments',   l:'Assignment Mgmt',      icon:I.assign,   group:'Live Ops' },
  { k:'liveMap',       l:'Live Map',             icon:I.map,      group:'Live Ops' },
  { k:'emergency',     l:'Emergency Operations', icon:I.alert,    group:'Live Ops', badge:2 },
  { k:'scheduling',    l:'Scheduling Center',    icon:I.cal,      group:'Scheduling' },
  { k:'conflicts',     l:'Calendar Conflicts',   icon:I.cancel,   group:'Scheduling', badge:4 },
  { k:'reschedule',    l:'Rescheduling Center',  icon:I.reschedule,group:'Scheduling' },
  { k:'timeline',      l:'Service Timeline',     icon:I.sla,      group:'Service' },
  { k:'checklist',     l:'Service Checklist',    icon:I.check,    group:'Service' },
  { k:'sla',           l:'SLA Monitoring',       icon:I.sla,      group:'Service' },
  { k:'cancellation',  l:'Cancellation Mgmt',    icon:I.cancel,   group:'Service' },
  { k:'communication', l:'Communication',        icon:I.msg,      group:'Communication' },
  { k:'documents',     l:'Document Center',      icon:I.doc,      group:'Communication' },
  { k:'activityFeed',  l:'Activity Feed',        icon:I.pulse,    group:'Logs' },
  { k:'notifications', l:'Notifications',        icon:I.bell,     group:'Logs' },
  { k:'reports',       l:'Reports',              icon:I.report,   group:'Logs' },
  { k:'statusBadges',  l:'Status Badges',        icon:I.check,    group:'Dev' },
  { k:'empty',         l:'Empty States',         icon:I.cancel,   group:'Dev' },
  { k:'loading',       l:'Loading States',       icon:I.refresh,  group:'Dev' },
  { k:'error',         l:'Error States',         icon:I.alert,    group:'Dev' },
  { k:'success',       l:'Success States',       icon:I.check,    group:'Dev' },
]

// ─── Operations Dashboard ─────────────────────────────────────────────────────
function OpsDashboard({ onNav, onToast }:{ onNav:(s:SubView)=>void; onToast:(m:string)=>void }) {
  const kpis = [
    { l:"Today's Bookings", v:'47', e:'📋', c:C.primary, sub:'+8 vs yesterday' },
    { l:'Active Services',  v:'12', e:'⚡', c:C.success, sub:'Live right now'  },
    { l:'Upcoming (2h)',    v:'9',  e:'🕐', c:C.info,    sub:'Next 2 hours'    },
    { l:'Delayed Visits',   v:'3',  e:'⏰', c:C.error,   sub:'Needs attention' },
    { l:'Pending Assignment',v:'5', e:'⏳', c:C.warning, sub:'Awaiting agent'  },
    { l:'Cancelled Today',  v:'2',  e:'🚫', c:C.muted,   sub:'Refunds pending' },
    { l:'Emergency Cases',  v:'2',  e:'🚨', c:'#DC2626', sub:'Critical'        },
    { l:'SLA Alerts',       v:'4',  e:'⚠️', c:'#F97316', sub:'At risk'         },
  ]
  const recentActivity = [
    { e:'⚡', t:'Kasun Perera checked in', d:'RP-2026-000184 · Colombo · 09:04', time:'6 min ago', c:C.success },
    { e:'⏳', t:'New booking assigned',    d:'RP-2026-000189 · Dilshan R. dispatched', time:'12 min ago', c:C.info },
    { e:'🚨', t:'Emergency raised',        d:'RP-2026-000180 · Thilina S. · Colombo 10', time:'18 min ago', c:'#DC2626' },
    { e:'⏰', t:'Visit delayed 25 min',    d:'RP-2026-000185 · Agent en route', time:'30 min ago', c:C.warning },
    { e:'✅', t:'Visit completed',         d:'RP-2026-000183 · Amara S. · Moratuwa', time:'47 min ago', c:C.success },
  ]
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      {/* Emergency banner */}
      <div style={{ padding:'14px 20px', borderRadius:12, background:`#DC262610`, border:`2px solid #DC262630`, marginBottom:18, display:'flex', gap:12, alignItems:'center' }}>
        <span style={{ fontSize:24 }}>🚨</span>
        <div style={{ flex:1 }}>
          <p style={{ fontSize:13, fontWeight:900, color:'#DC2626' }}>2 Active Emergencies — Immediate Response Required</p>
          <p style={{ fontSize:11, color:C.sub }}>RP-2026-000180 (Colombo 10) · RP-2026-000177 (Kandy) · Emergency contacts notified</p>
        </div>
        <Btn label="Emergency Center" variant="danger" small onClick={()=>onNav('emergency')} />
      </div>
      {/* KPI grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }} className="ops-4col">
        {kpis.map((k,i)=>(
          <Card key={i} hover style={{ padding:18, border:k.c==='#DC2626'?`1.5px solid ${k.c}30`:undefined, background:k.c==='#DC2626'?`${k.c}04`:C.surface }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
              <p style={{ fontSize:10, color:C.muted }}>{k.l}</p>
              <span style={{ fontSize:22 }}>{k.e}</span>
            </div>
            <p style={{ fontSize:30, fontWeight:900, color:k.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{k.v}</p>
            <p style={{ fontSize:10, color:C.muted }}>{k.sub}</p>
          </Card>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:16, marginBottom:16 }} className="ops-main-split">
        {/* Active services */}
        <Card style={{ padding:20 }}>
          <SectionTitle title="Active Services" action="Live Monitor" onAction={()=>onNav('liveMonitor')} />
          {BOOKINGS.filter(b=>b.status==='inprogress'||b.status==='travelling'||b.status==='checkin').slice(0,4).map((b,i)=>(
            <div key={i} style={{ display:'flex', gap:12, padding:'10px 0', borderBottom:i<2?`1px solid ${C.border}`:'none' }}>
              <div style={{ width:38, height:38, borderRadius:10, background:`${STATUS[b.status]?.color}15`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ fontSize:18 }}>{b.status==='inprogress'?'⚡':b.status==='travelling'?'🚗':'✅'}</span>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:2 }}>
                  <p style={{ fontSize:11, fontWeight:700, color:C.type }}>{b.id}</p>
                  <StatusBdg status={b.status} />
                  <Bdg label={b.priority.toUpperCase()} color={PRIORITY[b.priority]} />
                </div>
                <p style={{ fontSize:10, color:C.muted }}>{b.agent} → {b.beneficiary} · {b.location}</p>
              </div>
              <p style={{ fontSize:10, color:C.primary, fontWeight:700, whiteSpace:'nowrap' as const }}>{b.time.split('–')[0]}</p>
            </div>
          ))}
        </Card>
        {/* Right column */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <Card style={{ padding:20 }}>
            <SectionTitle title="Recent Activity" action="Full Feed" onAction={()=>onNav('activityFeed')} />
            {recentActivity.slice(0,4).map((r,i)=>(
              <div key={i} style={{ display:'flex', gap:10, padding:'7px 0', borderBottom:i<3?`1px solid ${C.border}`:'none' }}>
                <div style={{ width:28, height:28, borderRadius:8, background:`${r.c}12`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>{r.e}</div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:11, fontWeight:700, color:C.type }}>{r.t}</p>
                  <p style={{ fontSize:9, color:C.muted }}>{r.d}</p>
                </div>
                <p style={{ fontSize:9, color:C.muted, flexShrink:0 }}>{r.time}</p>
              </div>
            ))}
          </Card>
          <Card style={{ padding:20 }}>
            <SectionTitle title="Quick Actions" />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {[{e:'📋',l:'Directory',cb:()=>onNav('directory')},{e:'🚀',l:'Dispatch',cb:()=>onNav('dispatch')},{e:'📅',l:'Schedule',cb:()=>onNav('scheduling')},{e:'🗺️',l:'Live Map',cb:()=>onNav('liveMap')},{e:'📊',l:'SLA Report',cb:()=>onNav('sla')},{e:'🚨',l:'Emergency',cb:()=>onNav('emergency')}].map((a,i)=>(
                <button key={i} onClick={a.cb}
                  style={{ padding:'11px 4px', borderRadius:10, border:`1px solid ${C.border}`, background:'#FAFAFA', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:4, fontFamily:'Manrope,sans-serif', fontSize:10, fontWeight:700, color:C.sub, transition:'all 0.12s' }}
                  onMouseOver={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor=C.primary;(e.currentTarget as HTMLButtonElement).style.color=C.primary}}
                  onMouseOut={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor=C.border;(e.currentTarget as HTMLButtonElement).style.color=C.sub}}>
                  <span style={{ fontSize:18 }}>{a.e}</span>{a.l}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ─── Booking Directory ────────────────────────────────────────────────────────
function BookingDirectory({ onNav, onToast }:{ onNav:(s:SubView)=>void; onToast:(m:string)=>void }) {
  const [q, setQ] = useState('')
  const [statusF, setStatusF] = useState('all')
  const filtered = BOOKINGS.filter(b =>
    (statusF==='all'||b.status===statusF) &&
    (b.id.includes(q)||b.client.toLowerCase().includes(q.toLowerCase())||b.agent.toLowerCase().includes(q.toLowerCase()))
  )
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Booking Directory</h2>
        <div style={{ display:'flex', gap:8 }}>
          <Btn label="New Booking" small icon={I.plus} onClick={()=>onToast('Opening booking form…')} />
          <Btn label="Export" variant="secondary" small icon={I.download} onClick={()=>onToast('Exporting…')} />
        </div>
      </div>
      <Card style={{ padding:14, marginBottom:14 }}>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' as const, alignItems:'center' }}>
          <div style={{ display:'flex', gap:8, alignItems:'center', flex:1, minWidth:180, padding:'8px 12px', borderRadius:9, border:`1px solid ${C.border}`, background:'#FAFAFA' }}>
            <span style={{ display:'flex', color:C.muted }}>{I.eye}</span>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by booking ID, client, agent…" style={{ border:'none', background:'transparent', fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, outline:'none', flex:1 }} />
          </div>
          <div style={{ display:'flex', gap:5, flexWrap:'wrap' as const }}>
            {['all','inprogress','pending','travelling','completed','delayed'].map(f=>(
              <button key={f} onClick={()=>setStatusF(f)}
                style={{ padding:'6px 12px', borderRadius:99, border:`1.5px solid ${statusF===f?C.primary:C.border}`, background:statusF===f?`${C.primary}08`:'#FAFAFA', cursor:'pointer', fontSize:10, fontWeight:700, color:statusF===f?C.primary:C.muted, fontFamily:'Manrope,sans-serif' }}>
                {STATUS[f]?.label||'All'}
              </button>
            ))}
          </div>
        </div>
      </Card>
      <Card style={{ overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'110px 120px 110px 130px 1fr 110px 95px 75px 90px', padding:'10px 14px', background:'#FAFAFA', borderBottom:`1px solid ${C.border}` }} className="ops-table-row">
          {['Booking ID','Client','Beneficiary','Agent','Service','Visit Time','Status','Priority','Actions'].map((h,i)=>(
            <p key={i} style={{ fontSize:9, fontWeight:800, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.06em', paddingInline:4 }}>{h}</p>
          ))}
        </div>
        {filtered.map((b,i)=>(
          <div key={b.id} style={{ display:'grid', gridTemplateColumns:'110px 120px 110px 130px 1fr 110px 95px 75px 90px', padding:'11px 14px', borderBottom:i<filtered.length-1?`1px solid ${C.border}`:'none', transition:'background 0.12s' }}
            className="ops-table-row"
            onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='#FAFBFB'}
            onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}>
            <p style={{ fontSize:11, fontWeight:700, color:C.primary, paddingInline:4, display:'flex', alignItems:'center' }}>{b.id.split('-').pop()!.startsWith('0')?b.id.split('-').pop():b.id.slice(-6)}</p>
            <div style={{ paddingInline:4, display:'flex', alignItems:'center' }}>
              <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                <UA name={b.client} size={24} color={C.primary} />
                <p style={{ fontSize:11, color:C.type, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as const }}>{b.client}</p>
              </div>
            </div>
            <p style={{ fontSize:11, color:C.sub, paddingInline:4, display:'flex', alignItems:'center' }}>{b.beneficiary}</p>
            <div style={{ paddingInline:4, display:'flex', alignItems:'center' }}>
              {b.agent==='Unassigned'?<Bdg label="Unassigned" color={C.warning} />:<p style={{ fontSize:11, color:C.type }}>{b.agent}</p>}
            </div>
            <p style={{ fontSize:10, color:C.muted, paddingInline:4, display:'flex', alignItems:'center', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as const }}>{b.service}</p>
            <p style={{ fontSize:10, color:C.sub, paddingInline:4, display:'flex', alignItems:'center' }}>{b.time}</p>
            <div style={{ paddingInline:4, display:'flex', alignItems:'center' }}><StatusBdg status={b.status} /></div>
            <div style={{ paddingInline:4, display:'flex', alignItems:'center' }}><Bdg label={b.priority.toUpperCase()} color={PRIORITY[b.priority]} /></div>
            <div style={{ paddingInline:4, display:'flex', gap:3, alignItems:'center' }}>
              <button onClick={()=>{ onNav('bookingDetail'); onToast(`Viewing ${b.id}`) }} style={{ background:'none', border:'none', cursor:'pointer', color:C.primary, display:'flex', padding:3 }}><span style={{display:'flex'}}>{I.eye}</span></button>
              {b.agent==='Unassigned'&&<button onClick={()=>{ onNav('dispatch'); onToast('Opening dispatch…') }} style={{ background:'none', border:'none', cursor:'pointer', color:C.warning, display:'flex', padding:3 }}><span style={{display:'flex'}}>{I.assign}</span></button>}
              <button onClick={()=>onToast(`Cancelling ${b.id}`)} style={{ background:'none', border:'none', cursor:'pointer', color:C.error, display:'flex', padding:3 }}><span style={{display:'flex'}}>{I.cancel}</span></button>
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── Booking Details ──────────────────────────────────────────────────────────
function BookingDetails({ onToast }:{ onToast:(m:string)=>void }) {
  const b = BOOKINGS[0]
  const steps = [
    { l:'Booking Created',      d:'Mohamed Ihsan created booking', time:'22 Jan 08:15', done:true  },
    { l:'Payment Confirmed',    d:'LKR 6,200 · Credit card',       time:'22 Jan 08:17', done:true  },
    { l:'Agent Assigned',       d:'Kasun Perera selected',         time:'22 Jan 08:22', done:true  },
    { l:'Assignment Accepted',  d:'Kasun Perera accepted',         time:'22 Jan 08:45', done:true  },
    { l:'Visit Started',        d:'Check-in at Colombo 03',        time:'22 Jan 09:04', done:true  },
    { l:'Care In Progress',     d:'Hospital Appointment ongoing',   time:'Now',          done:true  },
    { l:'Visit Completed',      d:'Pending',                       time:'~13:00',       done:false },
    { l:'Feedback Submitted',   d:'Pending',                       time:'-',            done:false },
  ]
  return (
    <div style={{ maxWidth:900, margin:'0 auto', padding:'20px 24px 60px' }}>
      {/* Hero */}
      <Card style={{ padding:24, marginBottom:16, background:`linear-gradient(135deg,${C.primary}08,${C.primary}03)`, border:`1.5px solid ${C.primary}20` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
          <div>
            <p style={{ fontSize:11, color:C.muted, marginBottom:3 }}>Booking Reference</p>
            <p style={{ fontSize:24, fontWeight:900, color:C.primary, fontFamily:'Manrope,sans-serif' }}>{b.id}</p>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <StatusBdg status={b.status} />
            <Bdg label={b.priority.toUpperCase()+' PRIORITY'} color={PRIORITY[b.priority]} />
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }} className="ops-4col">
          {[{l:'Service',v:b.service},{l:'Date',v:b.date},{l:'Visit Time',v:b.time},{l:'Location',v:b.location}].map((r,i)=>(
            <div key={i}>
              <p style={{ fontSize:10, color:C.muted, marginBottom:3 }}>{r.l}</p>
              <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{r.v}</p>
            </div>
          ))}
        </div>
      </Card>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }} className="ops-2col">
        {/* Parties */}
        <Card style={{ padding:20 }}>
          <SectionTitle title="Parties" />
          {[{l:'Client',v:b.client,c:C.primary},{l:'Beneficiary',v:b.beneficiary,c:C.info},{l:'Care Agent',v:b.agent,c:C.success}].map((p,i)=>(
            <div key={i} style={{ display:'flex', gap:10, alignItems:'center', padding:'8px 0', borderBottom:i<2?`1px solid ${C.border}`:'none' }}>
              <UA name={p.v} size={36} color={p.c} />
              <div>
                <p style={{ fontSize:10, color:C.muted }}>{p.l}</p>
                <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{p.v}</p>
              </div>
            </div>
          ))}
          <div style={{ marginTop:12, display:'flex', gap:6 }}>
            <Btn label="Call Client" variant="secondary" small icon={I.phone} onClick={()=>onToast('Calling Mohamed Ihsan…')} />
            <Btn label="Message Agent" variant="secondary" small icon={I.msg} onClick={()=>onToast('Opening chat…')} />
          </div>
        </Card>
        {/* Care plan / medical notes */}
        <Card style={{ padding:20 }}>
          <SectionTitle title="Care Plan & Medical Notes" />
          <div style={{ padding:'10px 14px', borderRadius:10, background:`${C.info}06`, border:`1px solid ${C.info}20`, marginBottom:10 }}>
            <p style={{ fontSize:11, fontWeight:700, color:C.info, marginBottom:4 }}>Care Plan: Hospital Appointment Assistance</p>
            <ul style={{ margin:0, paddingLeft:14, fontSize:11, color:C.sub, lineHeight:1.8 }}>
              <li>Escort beneficiary to National Hospital Colombo</li>
              <li>Assist with registration and waiting procedures</li>
              <li>Monitor vitals if requested by medical staff</li>
              <li>Return escort after appointment</li>
            </ul>
          </div>
          <div style={{ padding:'10px 14px', borderRadius:10, background:`${C.warning}06`, border:`1px solid ${C.warning}20` }}>
            <p style={{ fontSize:11, fontWeight:700, color:C.warning, marginBottom:4 }}>⚠️ Medical Notes</p>
            <p style={{ fontSize:11, color:C.sub, lineHeight:1.6 }}>Nimal Perera — Diabetes Type 2, mobility limitations. Wheelchair required. Carries personal medication.</p>
          </div>
        </Card>
      </div>
      {/* Timeline */}
      <Card style={{ padding:22 }}>
        <SectionTitle title="Service Timeline" />
        <div style={{ position:'relative' as const, paddingLeft:30 }}>
          <div style={{ position:'absolute', left:11, top:0, bottom:0, width:2, background:`${C.border}` }}/>
          {steps.map((s,i)=>(
            <div key={i} style={{ position:'relative' as const, marginBottom:i<steps.length-1?16:0, display:'flex', gap:14, alignItems:'flex-start' }}>
              <div style={{ position:'absolute', left:-19, width:16, height:16, borderRadius:'50%', background:s.done?C.success:C.border, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, top:2, border:`2px solid ${C.surface}` }}>
                {s.done&&<span style={{ display:'flex', color:'white', transform:'scale(0.65)' }}>{I.check}</span>}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <p style={{ fontSize:12, fontWeight:700, color:s.done?C.type:C.muted }}>{s.l}</p>
                  <p style={{ fontSize:10, color:C.muted }}>{s.time}</p>
                </div>
                <p style={{ fontSize:11, color:C.muted }}>{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Live Service Monitor ─────────────────────────────────────────────────────
function LiveServiceMonitor({ onToast }:{ onToast:(m:string)=>void }) {
  const live = BOOKINGS.filter(b=>['inprogress','travelling','checkin'].includes(b.status))
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Live Service Monitor</h2>
          <div style={{ display:'flex', gap:6, alignItems:'center', padding:'4px 10px', borderRadius:99, background:`${C.success}12`, border:`1px solid ${C.success}30` }}>
            <div style={{ width:7, height:7, borderRadius:'50%', background:C.success, animation:'pulse-dot 1.5s ease-in-out infinite' }}/>
            <p style={{ fontSize:10, fontWeight:700, color:C.success }}>LIVE</p>
          </div>
        </div>
        <Btn label="Refresh" variant="secondary" small icon={I.refresh} onClick={()=>onToast('Refreshing…')} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }} className="ops-3col">
        {live.map((b,i)=>(
          <Card key={i} hover style={{ padding:20 }}>
            {/* Header */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
              <div>
                <p style={{ fontSize:11, fontWeight:700, color:C.primary }}>{b.id}</p>
                <p style={{ fontSize:10, color:C.muted }}>{b.service}</p>
              </div>
              <StatusBdg status={b.status} />
            </div>
            {/* Parties */}
            <div style={{ marginBottom:12 }}>
              {[{l:'Agent',v:b.agent,c:C.success},{l:'Beneficiary',v:b.beneficiary,c:C.info}].map((p,j)=>(
                <div key={j} style={{ display:'flex', gap:8, alignItems:'center', marginBottom:6 }}>
                  <UA name={p.v} size={26} color={p.c} />
                  <div>
                    <p style={{ fontSize:9, color:C.muted }}>{p.l}</p>
                    <p style={{ fontSize:11, fontWeight:700, color:C.type }}>{p.v}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Status tiles */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
              {[{l:'GPS',v:'Active',c:C.success},{l:'Check-In',v:'09:04 ✓',c:C.success},{l:'ETA',v:'~13:00',c:C.info},{l:'Tasks',v:'3/6 done',c:C.warning}].map((t,j)=>(
                <div key={j} style={{ padding:'7px 10px', borderRadius:9, background:`${t.c}08`, border:`1px solid ${t.c}20` }}>
                  <p style={{ fontSize:9, color:C.muted }}>{t.l}</p>
                  <p style={{ fontSize:11, fontWeight:700, color:t.c }}>{t.v}</p>
                </div>
              ))}
            </div>
            {/* Location */}
            <div style={{ display:'flex', gap:6, alignItems:'center', padding:'7px 10px', borderRadius:9, background:`${C.primary}06`, border:`1px solid ${C.primary}15` }}>
              <span style={{ display:'flex', color:C.primary }}>{I.pin}</span>
              <p style={{ fontSize:11, fontWeight:700, color:C.primary }}>{b.location}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Dispatch Center ──────────────────────────────────────────────────────────
function DispatchCenter({ onToast }:{ onToast:(m:string)=>void }) {
  const unassigned = BOOKINGS.filter(b=>b.agent==='Unassigned')
  const [selected, setSelected] = useState<string|null>(null)
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Dispatch Center</h2>
        <Btn label="Auto-Assign All" variant="warning" small icon={I.dispatch} onClick={()=>onToast('Auto-assign running…')} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }} className="ops-2col">
        {/* Unassigned bookings */}
        <Card style={{ padding:20 }}>
          <SectionTitle title={`Unassigned Bookings (${unassigned.length})`} />
          {unassigned.map((b,i)=>(
            <div key={i} onClick={()=>setSelected(b.id)}
              style={{ padding:'12px 14px', borderRadius:12, border:`2px solid ${selected===b.id?C.primary:C.border}`, marginBottom:10, cursor:'pointer', background:selected===b.id?`${C.primary}06`:'#FAFAFA', transition:'all 0.15s' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
                <p style={{ fontSize:12, fontWeight:700, color:C.primary }}>{b.id}</p>
                <Bdg label={b.priority.toUpperCase()} color={PRIORITY[b.priority]} />
              </div>
              <p style={{ fontSize:11, fontWeight:600, color:C.type, marginBottom:2 }}>{b.service}</p>
              <p style={{ fontSize:10, color:C.muted, marginBottom:6 }}>{b.client} → {b.beneficiary} · {b.location}</p>
              <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                <span style={{ display:'flex', color:C.muted, transform:'scale(0.85)' }}>{I.sla}</span>
                <p style={{ fontSize:10, color:C.muted }}>{b.time}</p>
                {b.sla==='risk'&&<Bdg label="SLA RISK" color={C.warning} />}
              </div>
            </div>
          ))}
        </Card>
        {/* Available agents */}
        <Card style={{ padding:20 }}>
          <SectionTitle title={`Available Care Agents${selected?' — Select for '+selected:''}`} />
          {AGENTS.map((a,i)=>(
            <div key={i} style={{ padding:'12px 14px', borderRadius:12, border:`1px solid ${C.border}`, marginBottom:8, background:a.avail?C.surface:'#FAFAFA', opacity:a.avail?1:0.5 }}>
              <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                <div style={{ position:'relative' as const }}>
                  <UA name={a.name} size={40} color={C.success} />
                  <div style={{ position:'absolute', bottom:0, right:0, width:10, height:10, borderRadius:'50%', background:a.status==='online'?C.success:a.status==='busy'?C.warning:C.muted, border:`2px solid white` }}/>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:2 }}>
                    <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{a.name}</p>
                    <Bdg label={`${a.rating}★`} color={C.warning} />
                  </div>
                  <div style={{ display:'flex', gap:10 }}>
                    <p style={{ fontSize:10, color:C.muted }}>📍 {a.dist}</p>
                    <p style={{ fontSize:10, color:C.muted }}>🚗 {a.travel}</p>
                    <p style={{ fontSize:10, color:C.primary, fontWeight:700 }}>Match: {a.score}%</p>
                  </div>
                </div>
                <Btn label="Assign" small variant={a.avail?'primary':'ghost'} onClick={()=>{
                  if(a.avail&&selected){ onToast(`${a.name} assigned to ${selected}`); setSelected(null) }
                  else if(!a.avail){ onToast('Agent unavailable') }
                  else { onToast('Select a booking first') }
                }} />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

// ─── Assignment Management ────────────────────────────────────────────────────
function AssignmentMgmt({ onToast }:{ onToast:(m:string)=>void }) {
  const statuses = [
    { k:'assigned',   l:'Assigned',   n:12, c:C.info    },
    { k:'pending',    l:'Pending',    n:5,  c:C.muted   },
    { k:'accepted',   l:'Accepted',   n:18, c:C.primary },
    { k:'rejected',   l:'Rejected',   n:2,  c:C.error   },
    { k:'reassigned', l:'Reassigned', n:3,  c:C.warning },
    { k:'expired',    l:'Expired',    n:1,  c:C.muted   },
  ]
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>Assignment Management</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:18 }} className="ops-3col">
        {statuses.map((s,i)=>(
          <Card key={i} style={{ padding:18, textAlign:'center' as const }}>
            <p style={{ fontSize:28, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{s.n}</p>
            <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      <Card style={{ padding:20 }}>
        <SectionTitle title="Assignment Timeline" />
        {BOOKINGS.slice(0,5).map((b,i)=>(
          <div key={i} style={{ display:'flex', gap:12, padding:'10px 0', borderBottom:i<4?`1px solid ${C.border}`:'none' }}>
            <div style={{ width:40, height:40, borderRadius:12, background:`${STATUS[b.status]?.color||C.muted}12`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:18 }}>
              {b.status==='inprogress'?'⚡':b.status==='pending'?'⏳':b.status==='completed'?'✅':b.status==='delayed'?'⏰':'📋'}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:2 }}>
                <p style={{ fontSize:12, fontWeight:700, color:C.primary }}>{b.id}</p>
                <StatusBdg status={b.status} />
              </div>
              <p style={{ fontSize:11, color:C.type }}>{b.agent==='Unassigned'?'⚠️ Awaiting assignment':b.agent+' — '+b.service}</p>
              <p style={{ fontSize:10, color:C.muted }}>{b.client} → {b.beneficiary} · {b.time}</p>
            </div>
            <div style={{ display:'flex', gap:6, alignItems:'center' }}>
              {b.agent==='Unassigned'?<Btn label="Assign" variant="warning" small onClick={()=>onToast('Opening dispatch…')} />:<Btn label="Reassign" variant="ghost" small onClick={()=>onToast('Reassigning…')} />}
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── Scheduling Center ────────────────────────────────────────────────────────
function SchedulingCenter({ onToast }:{ onToast:(m:string)=>void }) {
  const [view, setView] = useState<'daily'|'weekly'|'monthly'>('weekly')
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  const hours = [7,8,9,10,11,12,13,14,15,16,17,18]
  const slots: Record<string, { id:string; agent:string; c:string }[]> = {
    'Mon-09': [{ id:'000184', agent:'Kasun P.', c:C.primary }],
    'Mon-10': [{ id:'000186', agent:'Dilshan R.', c:C.success }],
    'Tue-08': [{ id:'000188', agent:'Ayesha M.', c:C.accent }],
    'Wed-14': [{ id:'000187', agent:'Unassigned', c:C.warning }],
    'Thu-11': [{ id:'000185', agent:'Unassigned', c:C.warning }],
    'Fri-09': [{ id:'000189', agent:'Chamara K.', c:C.info }],
    'Sat-10': [{ id:'000190', agent:'Kasun P.', c:C.primary }],
  }
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Scheduling Center</h2>
        <div style={{ display:'flex', gap:6 }}>
          {(['daily','weekly','monthly'] as const).map(v=>(
            <button key={v} onClick={()=>setView(v)} style={{ padding:'7px 16px', borderRadius:9, border:`1.5px solid ${view===v?C.primary:C.border}`, background:view===v?C.primary:'#FAFAFA', color:view===v?'#fff':C.muted, cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:11, fontWeight:700 }}>
              {v.charAt(0).toUpperCase()+v.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <Card style={{ overflow:'auto', padding:0 }}>
        {/* Weekly grid */}
        <div style={{ minWidth:700 }}>
          {/* Header */}
          <div style={{ display:'grid', gridTemplateColumns:'60px repeat(7,1fr)', borderBottom:`1px solid ${C.border}`, background:'#FAFAFA' }}>
            <div style={{ padding:'10px 8px', fontSize:9, fontWeight:800, color:C.muted }}></div>
            {days.map(d=>(
              <div key={d} style={{ padding:'10px 8px', textAlign:'center' as const, fontSize:11, fontWeight:800, color:C.type, borderLeft:`1px solid ${C.border}` }}>{d}</div>
            ))}
          </div>
          {/* Time slots */}
          {hours.map(h=>(
            <div key={h} style={{ display:'grid', gridTemplateColumns:'60px repeat(7,1fr)', borderBottom:`1px solid ${C.border}`, minHeight:42 }}>
              <div style={{ padding:'10px 8px', fontSize:9, color:C.muted, fontWeight:600, borderRight:`1px solid ${C.border}` }}>{h}:00</div>
              {days.map(d=>{
                const key=`${d}-${String(h).padStart(2,'0')}`
                const items=slots[key]||[]
                return (
                  <div key={d} style={{ borderLeft:`1px solid ${C.border}`, padding:'3px 4px', minHeight:42 }}>
                    {items.map((slot,j)=>(
                      <div key={j} onClick={()=>onToast(`Viewing ${slot.id}`)} style={{ padding:'3px 7px', borderRadius:6, background:`${slot.c}15`, border:`1px solid ${slot.c}30`, cursor:'pointer', marginBottom:2 }}>
                        <p style={{ fontSize:9, fontWeight:700, color:slot.c, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as const }}>{slot.id}</p>
                        <p style={{ fontSize:8, color:C.muted }}>{slot.agent}</p>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Calendar Conflicts ───────────────────────────────────────────────────────
function CalendarConflicts({ onToast }:{ onToast:(m:string)=>void }) {
  const conflicts = [
    { type:'Double Booking',    agent:'Kasun Perera',  desc:'RP-000184 & RP-000190 overlap at 09:00–13:00 on Sat', c:C.error,   sug:'Reassign RP-000190 to Chamara K.'  },
    { type:'Unavailable Agent', agent:'Dilshan R.',    desc:'On leave Jan 24–26, RP-000186 assigned',               c:C.warning, sug:'Reassign to Ayesha M. (2.8 km away)' },
    { type:'Travel Conflict',   agent:'Ayesha M.',     desc:'Back-to-back bookings 20 min apart, 18 km gap',        c:C.warning, sug:'Add 45 min buffer or reassign second' },
    { type:'Holiday Conflict',  agent:'All agents',    desc:'National Holiday Feb 4 — 12 bookings affected',        c:C.info,    sug:'Notify clients to reschedule'        },
  ]
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Calendar Conflicts</h2>
        <Bdg label={`${conflicts.length} conflicts`} color={C.error} dot />
      </div>
      {conflicts.map((c,i)=>(
        <Card key={i} style={{ padding:20, marginBottom:12, border:`1.5px solid ${c.c}30`, background:`${c.c}04` }}>
          <div style={{ display:'flex', gap:12 }}>
            <div style={{ width:42, height:42, borderRadius:12, background:`${c.c}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
              {c.type==='Double Booking'?'⚠️':c.type==='Unavailable Agent'?'🔒':c.type==='Travel Conflict'?'🚗':'📅'}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                <Bdg label={c.type} color={c.c} />
                <p style={{ fontSize:11, fontWeight:600, color:C.type }}>{c.agent}</p>
              </div>
              <p style={{ fontSize:11, color:C.sub, marginBottom:8 }}>{c.desc}</p>
              <div style={{ padding:'8px 12px', borderRadius:9, background:`${C.success}08`, border:`1px solid ${C.success}20` }}>
                <p style={{ fontSize:10, color:C.success, fontWeight:700 }}>💡 Suggested: {c.sug}</p>
              </div>
            </div>
            <div style={{ display:'flex', gap:6 }}>
              <Btn label="Resolve" variant="success" small onClick={()=>onToast('Resolving…')} />
              <Btn label="Ignore" variant="ghost" small onClick={()=>onToast('Flagged…')} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Live Map ─────────────────────────────────────────────────────────────────
function LiveMap({ onToast }:{ onToast:(m:string)=>void }) {
  type HoverPin = string|null
  const [hover, setHover] = useState<HoverPin>(null)
  const pins = [
    { id:'agent-kasun',    type:'agent',     label:'Kasun P.',      x:260, y:240, c:C.success, status:'inprogress' },
    { id:'agent-dilshan',  type:'agent',     label:'Dilshan R.',    x:320, y:210, c:C.success, status:'travelling' },
    { id:'agent-ayesha',   type:'agent',     label:'Ayesha M.',     x:220, y:290, c:C.success, status:'accepted'   },
    { id:'bene-nimal',     type:'bene',      label:'Nimal P.',      x:250, y:250, c:C.primary, status:''           },
    { id:'bene-ruwan',     type:'bene',      label:'Ruwan W.',      x:310, y:205, c:C.primary, status:''           },
    { id:'emergency',      type:'emergency', label:'EMERGENCY',     x:180, y:180, c:'#DC2626',  status:'emergency'  },
    { id:'upcoming',       type:'upcoming',  label:'RP-000187',     x:290, y:320, c:C.warning, status:'pending'    },
  ]
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Live Map</h2>
        <div style={{ display:'flex', gap:8 }}>
          {[{e:'⚡',l:'Active',c:C.success},{e:'🚗',l:'Travelling',c:'#8B5CF6'},{e:'🚨',l:'Emergency',c:'#DC2626'},{e:'⏳',l:'Upcoming',c:C.warning}].map((l,i)=>(
            <div key={i} style={{ display:'flex', gap:5, alignItems:'center' }}>
              <span style={{ fontSize:14 }}>{l.e}</span>
              <p style={{ fontSize:10, fontWeight:700, color:l.c }}>{l.l}</p>
            </div>
          ))}
        </div>
      </div>
      <Card style={{ overflow:'hidden', marginBottom:14 }}>
        <svg width="100%" viewBox="0 0 500 420" style={{ display:'block', background:'#EFF2E8' }}>
          {/* Grid */}
          {[...Array(10)].map((_,i)=>(
            <g key={i}>
              <line x1={i*50} y1={0} x2={i*50} y2={420} stroke="#D5DCC5" strokeWidth="0.5"/>
              <line x1={0} y1={i*42} x2={500} y2={i*42} stroke="#D5DCC5" strokeWidth="0.5"/>
            </g>
          ))}
          {/* Roads */}
          <path d="M100 210 Q200 180 300 200 Q400 220 480 200" stroke="#C8C8B4" strokeWidth="4" fill="none"/>
          <path d="M200 100 Q240 200 250 300 Q260 360 270 400" stroke="#C8C8B4" strokeWidth="3" fill="none"/>
          <path d="M50 280 Q150 260 250 300 Q350 340 450 310" stroke="#C8C8B4" strokeWidth="2.5" fill="none"/>
          {/* Sri Lanka silhouette */}
          <ellipse cx="250" cy="230" rx="130" ry="170" fill="#D8E4D0" stroke="#B8CCA8" strokeWidth="1.5"/>
          {/* Active routes (dashed) */}
          {[{ x1:260,y1:240, x2:250,y2:250, c:C.success },{ x1:320,y1:210, x2:310,y2:205, c:'#8B5CF6' }].map((r,i)=>(
            <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke={r.c} strokeWidth="2.5" strokeDasharray="6,3" opacity="0.7"/>
          ))}
          {/* Coverage circle */}
          <circle cx="250" cy="230" r="110" fill="none" stroke={C.primary} strokeWidth="1" strokeDasharray="8,4" opacity="0.35"/>
          {/* Pins */}
          {pins.map(p=>(
            <g key={p.id} onMouseEnter={()=>setHover(p.id)} onMouseLeave={()=>setHover(null)} style={{ cursor:'pointer' }}>
              <circle cx={p.x} cy={p.y} r="12" fill={p.c} opacity={0.9}/>
              <circle cx={p.x} cy={p.y} r="6" fill="white" opacity={0.9}/>
              {p.type==='emergency'&&<circle cx={p.x} cy={p.y} r="18" fill="#DC2626" opacity={0.2}/>}
              {hover===p.id&&(
                <g>
                  <rect x={p.x+14} y={p.y-14} width={80} height={30} rx="6" fill="rgba(26,42,48,0.9)"/>
                  <text x={p.x+19} y={p.y+2} fill="white" fontSize="10" fontFamily="Manrope,sans-serif" fontWeight="700">{p.label}</text>
                </g>
              )}
            </g>
          ))}
        </svg>
      </Card>
      {/* Legend / quick stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }} className="ops-4col">
        {[{l:'Agents Active',v:'12',c:C.success},{l:'Beneficiary Locations',v:'12',c:C.primary},{l:'Emergency Cases',v:'2',c:'#DC2626'},{l:'Coverage Radius',v:'25 km',c:C.primary}].map((s,i)=>(
          <Card key={i} style={{ padding:14, textAlign:'center' as const }}>
            <p style={{ fontSize:22, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:3 }}>{s.v}</p>
            <p style={{ fontSize:9, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Emergency Operations ─────────────────────────────────────────────────────
function EmergencyOps({ onToast }:{ onToast:(m:string)=>void }) {
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ padding:'14px 20px', borderRadius:12, background:`#DC262610`, border:`2px solid #DC262640`, marginBottom:18, display:'flex', gap:12, alignItems:'center' }}>
        <div style={{ width:8, height:8, borderRadius:'50%', background:'#DC2626', animation:'pulse-dot 1s ease-in-out infinite' }}/>
        <p style={{ fontSize:13, fontWeight:900, color:'#DC2626' }}>2 Active Emergency Cases — Immediate Response Required</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }} className="ops-4col">
        {[{l:'SOS Cases',v:'1',c:'#DC2626'},{l:'Medical Emergency',v:'1',c:C.error},{l:'Escalations',v:'0',c:C.muted},{l:'Avg Response',v:'4 min',c:C.warning}].map((s,i)=>(
          <Card key={i} style={{ padding:16, textAlign:'center' as const, border:`1.5px solid ${s.c}25`, background:`${s.c}04` }}>
            <p style={{ fontSize:26, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{s.v}</p>
            <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      {[
        { id:'RP-2026-000180', type:'🚨 SOS',              client:'Thilina S.',    agent:'Kasun Perera', loc:'Colombo 10', time:'18 min ago', note:'Beneficiary unresponsive. Agent requesting ambulance.' },
        { id:'RP-2026-000177', type:'⚕️ Medical Emergency', client:'Ranjith B.',   agent:'Dilshan R.',   loc:'Kandy',       time:'1 hr ago',   note:'Chest pain reported. Nearest hospital notified.' },
      ].map((e,i)=>(
        <Card key={i} style={{ padding:22, marginBottom:14, border:`2px solid #DC262635`, background:`#DC262604` }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
            <div>
              <p style={{ fontSize:18, fontWeight:900, color:'#DC2626', fontFamily:'Manrope,sans-serif', marginBottom:2 }}>{e.type}</p>
              <p style={{ fontSize:12, fontWeight:700, color:C.primary }}>{e.id}</p>
            </div>
            <Bdg label={e.time} color={'#DC2626'} dot />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
            {[{l:'Client',v:e.client},{l:'Agent',v:e.agent},{l:'Location',v:e.loc}].map((r,j)=>(
              <div key={j}>
                <p style={{ fontSize:9, color:C.muted }}>{r.l}</p>
                <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{r.v}</p>
              </div>
            ))}
          </div>
          <div style={{ padding:'10px 14px', borderRadius:10, background:`#DC262608`, border:`1px solid #DC262620`, marginBottom:12 }}>
            <p style={{ fontSize:11, color:C.type }}>{e.note}</p>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <Btn label="Respond" variant="danger" onClick={()=>onToast(`Responding to ${e.id}…`)} />
            <Btn label="Escalate" variant="warning" onClick={()=>onToast('Escalating…')} />
            <Btn label="Call Agent" variant="secondary" icon={I.phone} onClick={()=>onToast('Calling…')} />
            <Btn label="Mark Resolved" variant="success" onClick={()=>onToast('Resolved!')} />
          </div>
        </Card>
      ))}
      {/* Emergency contacts */}
      <Card style={{ padding:20 }}>
        <SectionTitle title="Emergency Contacts" />
        {[{n:'National Emergency Hotline',p:'119',t:'🚑'},{n:'Colombo National Hospital',p:'+94 11 269 1111',t:'🏥'},{n:'Kasun Perera (On-site Agent)',p:'+94 71 987 6543',t:'👤'}].map((c,i)=>(
          <div key={i} style={{ display:'flex', gap:12, padding:'9px 0', borderBottom:i<2?`1px solid ${C.border}`:'none', alignItems:'center' }}>
            <span style={{ fontSize:22 }}>{c.t}</span>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{c.n}</p>
              <p style={{ fontSize:11, color:C.muted }}>{c.p}</p>
            </div>
            <Btn label="Call" variant="secondary" small icon={I.phone} onClick={()=>onToast(`Calling ${c.n}…`)} />
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── Service Timeline ─────────────────────────────────────────────────────────
function ServiceTimeline() {
  const steps = [
    { l:'Booking Created',     d:'Mohamed Ihsan · Jan 22 08:15', done:true,  active:false },
    { l:'Payment Confirmed',   d:'LKR 6,200 via card · 08:17',    done:true,  active:false },
    { l:'Agent Assigned',      d:'Kasun Perera selected · 08:22', done:true,  active:false },
    { l:'Assignment Accepted', d:'Kasun confirmed · 08:45',       done:true,  active:false },
    { l:'Visit Started',       d:'Check-in Colombo · 09:04',      done:true,  active:false },
    { l:'Care In Progress',    d:'Hospital Appointment Assistance',done:true,  active:true  },
    { l:'Visit Completed',     d:'Pending — ETA ~13:00',          done:false, active:false },
    { l:'Feedback Submitted',  d:'Awaiting completion',           done:false, active:false },
  ]
  return (
    <div style={{ maxWidth:600, margin:'0 auto', padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Service Timeline</h2>
      <p style={{ fontSize:12, color:C.muted, marginBottom:20 }}>RP-2026-000184 · Hospital Appointment Assistance</p>
      <Card style={{ padding:28 }}>
        <div style={{ position:'relative' as const, paddingLeft:32 }}>
          <div style={{ position:'absolute', left:11, top:0, bottom:0, width:2, background:C.border }}/>
          {steps.map((s,i)=>(
            <div key={i} style={{ position:'relative' as const, marginBottom:i<steps.length-1?24:0, display:'flex', gap:16, alignItems:'flex-start' }}>
              <div style={{ position:'absolute', left:-21, width:20, height:20, borderRadius:'50%', background:s.done?C.success:s.active?C.warning:C.border, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, top:1, border:`3px solid ${C.surface}`, boxShadow:`0 0 0 2px ${s.done?C.success:s.active?C.warning:C.border}` }}>
                {s.done&&<span style={{ display:'flex', color:'white', transform:'scale(0.6)' }}>{I.check}</span>}
                {s.active&&!s.done&&<div style={{ width:6, height:6, borderRadius:'50%', background:'white' }}/>}
              </div>
              <div>
                <p style={{ fontSize:13, fontWeight:700, color:s.done||s.active?C.type:C.muted }}>{s.l}</p>
                <p style={{ fontSize:11, color:C.muted }}>{s.d}</p>
                {s.active&&<Bdg label="Active Now" color={C.warning} dot />}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Service Checklist ────────────────────────────────────────────────────────
function ServiceChecklist({ onToast }:{ onToast:(m:string)=>void }) {
  const [done, setDone] = useState<Record<string,boolean>>({'Booking Verified':true,'Payment Confirmed':true,'Documents Uploaded':true,'Care Agent Verified':true,'Beneficiary Confirmed':false,'Visit Completed':false,'Review Received':false})
  return (
    <div style={{ maxWidth:560, margin:'0 auto', padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Service Checklist</h2>
      <p style={{ fontSize:12, color:C.muted, marginBottom:20 }}>RP-2026-000184</p>
      <Card style={{ padding:22 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
          <p style={{ fontSize:11, color:C.muted }}>{Object.values(done).filter(Boolean).length}/{Object.keys(done).length} completed</p>
          <div style={{ height:8, flex:1, marginLeft:12, borderRadius:99, background:`${C.primary}12` }}>
            <div style={{ width:`${(Object.values(done).filter(Boolean).length/Object.keys(done).length)*100}%`, height:'100%', background:C.primary, borderRadius:99, transition:'width 0.3s' }}/>
          </div>
        </div>
        {Object.entries(done).map(([k,v],i)=>(
          <div key={k} style={{ display:'flex', gap:12, padding:'11px 0', borderBottom:i<Object.keys(done).length-1?`1px solid ${C.border}`:'none', alignItems:'center' }}>
            <button onClick={()=>{ setDone(d=>({...d,[k]:!d[k]})); onToast(v?`${k} unchecked`:`${k} completed!`) }}
              style={{ width:22, height:22, borderRadius:7, border:`2px solid ${v?C.success:C.border}`, background:v?C.success:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              {v&&<span style={{ display:'flex', color:'white', transform:'scale(0.7)' }}>{I.check}</span>}
            </button>
            <p style={{ fontSize:13, fontWeight:v?600:400, color:v?C.type:C.muted, textDecoration:v?undefined:undefined, flex:1 }}>{k}</p>
            {v&&<Bdg label="Done" color={C.success} />}
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── SLA Monitoring ───────────────────────────────────────────────────────────
function SLAMonitoring() {
  const metrics = [
    { l:'Avg Response Time',    v:'3.2 min', target:'<5 min',  pct:85, c:C.success },
    { l:'Avg Assignment Time',  v:'12 min',  target:'<15 min', pct:80, c:C.success },
    { l:'Avg Arrival Time',     v:'19 min',  target:'<20 min', pct:92, c:C.success },
    { l:'Avg Completion Rate',  v:'94.3%',   target:'>95%',    pct:94, c:C.warning },
    { l:'Late Visits Today',    v:'3',       target:'<2',      pct:25, c:C.error   },
    { l:'SLA Violations (MTD)', v:'7',       target:'<5',      pct:40, c:C.error   },
    { l:'SLA Compliance',       v:'94.7%',   target:'>98%',    pct:95, c:C.warning },
  ]
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>SLA Monitoring</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:18 }} className="ops-3col">
        {[{l:'SLA Compliance',v:'94.7%',c:C.warning},{l:'Violations MTD',v:'7',c:C.error},{l:'At Risk Today',v:'4',c:C.warning}].map((s,i)=>(
          <Card key={i} style={{ padding:18, textAlign:'center' as const }}>
            <p style={{ fontSize:28, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{s.v}</p>
            <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      <Card style={{ padding:22 }}>
        <SectionTitle title="SLA Metrics" />
        {metrics.map((m,i)=>(
          <div key={i} style={{ marginBottom:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
              <p style={{ fontSize:12, fontWeight:600, color:C.type }}>{m.l}</p>
              <div style={{ display:'flex', gap:8 }}>
                <p style={{ fontSize:12, fontWeight:900, color:m.c }}>{m.v}</p>
                <p style={{ fontSize:10, color:C.muted }}>Target {m.target}</p>
              </div>
            </div>
            <div style={{ height:8, borderRadius:99, background:`${m.c}12` }}>
              <div style={{ width:`${m.pct}%`, height:'100%', background:m.c, borderRadius:99, transition:'width 0.4s' }}/>
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── Cancellation Management ──────────────────────────────────────────────────
function CancellationMgmt({ onToast }:{ onToast:(m:string)=>void }) {
  return (
    <div style={{ maxWidth:780, margin:'0 auto', padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:20 }}>Cancellation Management</h2>
      <Card style={{ padding:22 }}>
        <SectionTitle title="Recent Cancellations" />
        {[{id:'RP-000182',reason:'Agent unavailable',by:'System',refund:'Pending LKR 4,500',replacement:'Ayesha M. offered',time:'2 hrs ago'},{id:'RP-000179',reason:'Client request',by:'Mohamed I.',refund:'LKR 3,200 refunded',replacement:'N/A',time:'Yesterday'}].map((c,i)=>(
          <Card key={i} hover style={{ padding:18, marginBottom:10 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
              <div>
                <p style={{ fontSize:12, fontWeight:700, color:C.primary }}>{c.id}</p>
                <p style={{ fontSize:10, color:C.muted }}>{c.time}</p>
              </div>
              <Bdg label="Cancelled" color={C.error} dot />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
              {[{l:'Reason',v:c.reason},{l:'Cancelled By',v:c.by},{l:'Refund Status',v:c.refund},{l:'Replacement',v:c.replacement}].map((r,j)=>(
                <div key={j}>
                  <p style={{ fontSize:9, color:C.muted }}>{r.l}</p>
                  <p style={{ fontSize:11, fontWeight:600, color:C.type }}>{r.v}</p>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <Btn label="Process Refund" variant="secondary" small onClick={()=>onToast('Processing refund…')} />
              <Btn label="Reschedule" variant="primary" small icon={I.reschedule} onClick={()=>onToast('Opening reschedule…')} />
            </div>
          </Card>
        ))}
      </Card>
    </div>
  )
}

// ─── Rescheduling Center ──────────────────────────────────────────────────────
function ReschedulingCenter({ onToast }:{ onToast:(m:string)=>void }) {
  const [step, setStep] = useState(1)
  const slots = ['Thu 23 Jan · 09:00','Thu 23 Jan · 14:00','Fri 24 Jan · 09:00','Fri 24 Jan · 11:00','Mon 27 Jan · 10:00']
  const [chosen, setChosen] = useState<string|null>(null)
  return (
    <div style={{ maxWidth:680, margin:'0 auto', padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:20 }}>Rescheduling Center</h2>
      {/* Stepper */}
      <div style={{ display:'flex', gap:0, marginBottom:24 }}>
        {['Select Booking','Choose Slot','Select Agent','Confirm'].map((s,i)=>(
          <div key={i} style={{ flex:1, display:'flex', alignItems:'center' }}>
            <div style={{ flex:1, textAlign:'center' as const }}>
              <div style={{ width:28, height:28, borderRadius:'50%', background:step>i?C.primary:step===i+1?`${C.primary}20`:C.border, margin:'0 auto 4px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                {step>i?<span style={{ display:'flex', color:'white', transform:'scale(0.7)' }}>{I.check}</span>:<p style={{ fontSize:11, fontWeight:800, color:step===i+1?C.primary:C.muted }}>{i+1}</p>}
              </div>
              <p style={{ fontSize:9, fontWeight:700, color:step===i+1?C.primary:C.muted }}>{s}</p>
            </div>
            {i<3&&<div style={{ width:40, height:2, background:step>i+1?C.primary:C.border }}/>}
          </div>
        ))}
      </div>
      {step===1&&(
        <Card style={{ padding:22 }}>
          <SectionTitle title="Current Booking" />
          <div style={{ padding:'14px 18px', borderRadius:12, border:`1.5px solid ${C.border}`, background:'#FAFAFA' }}>
            <p style={{ fontSize:14, fontWeight:800, color:C.primary, marginBottom:4 }}>RP-2026-000185</p>
            <p style={{ fontSize:12, color:C.type, marginBottom:2 }}>Therapy Assistance · Priya Fernando</p>
            <p style={{ fontSize:11, color:C.muted }}>Wed 22 Jan · 14:00 – 16:00 · Colombo 07 · Unassigned</p>
          </div>
          <div style={{ marginTop:16 }}>
            <Btn label="Continue to Slot Selection" full onClick={()=>setStep(2)} />
          </div>
        </Card>
      )}
      {step===2&&(
        <Card style={{ padding:22 }}>
          <SectionTitle title="Suggested Slots" />
          <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:16 }}>
            {slots.map((sl,i)=>(
              <button key={i} onClick={()=>setChosen(sl)}
                style={{ padding:'12px 16px', borderRadius:10, border:`1.5px solid ${chosen===sl?C.primary:C.border}`, background:chosen===sl?`${C.primary}08`:'#FAFAFA', cursor:'pointer', textAlign:'left' as const, fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:700, color:chosen===sl?C.primary:C.type }}>
                {sl}{i===0&&' — Recommended'}
              </button>
            ))}
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <Btn label="Back" variant="ghost" onClick={()=>setStep(1)} />
            <Btn label="Continue" full onClick={()=>chosen?setStep(3):onToast('Select a slot first')} />
          </div>
        </Card>
      )}
      {step===3&&(
        <Card style={{ padding:22 }}>
          <SectionTitle title="Available Agents" />
          {AGENTS.filter(a=>a.avail).slice(0,3).map((a,i)=>(
            <div key={i} style={{ display:'flex', gap:10, alignItems:'center', padding:'10px 0', borderBottom:i<2?`1px solid ${C.border}`:'none' }}>
              <UA name={a.name} size={36} color={C.success} />
              <div style={{ flex:1 }}>
                <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{a.name}</p>
                <p style={{ fontSize:10, color:C.muted }}>{a.dist} · {a.travel} · {a.rating}★</p>
              </div>
              <Btn label="Select" variant="secondary" small onClick={()=>setStep(4)} />
            </div>
          ))}
          <div style={{ marginTop:12 }}><Btn label="Back" variant="ghost" onClick={()=>setStep(2)} /></div>
        </Card>
      )}
      {step===4&&(
        <Card style={{ padding:22 }}>
          <SectionTitle title="Confirm Reschedule" />
          <div style={{ padding:'14px 18px', borderRadius:12, background:`${C.success}06`, border:`1px solid ${C.success}20`, marginBottom:16 }}>
            <p style={{ fontSize:12, fontWeight:700, color:C.success, marginBottom:8 }}>✅ Reschedule Summary</p>
            {[{l:'Booking',v:'RP-2026-000185'},{l:'New Slot',v:chosen||''},{l:'New Agent',v:'Dilshan R.'},{l:'Client Notified',v:'Via SMS & App'}].map((r,i)=>(
              <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'4px 0' }}>
                <p style={{ fontSize:11, color:C.muted }}>{r.l}</p>
                <p style={{ fontSize:11, fontWeight:700, color:C.type }}>{r.v}</p>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <Btn label="Back" variant="ghost" onClick={()=>setStep(3)} />
            <Btn label="Confirm Reschedule" full variant="success" icon={I.check} onClick={()=>onToast('Booking rescheduled successfully!')} />
          </div>
        </Card>
      )}
    </div>
  )
}

// ─── Communication ────────────────────────────────────────────────────────────
function Communication({ onToast }:{ onToast:(m:string)=>void }) {
  const [msg, setMsg] = useState('')
  const messages = [
    { from:'Kasun Perera', text:'Arrived at Colombo National Hospital. Beneficiary is stable.', time:'09:10', self:false },
    { from:'Operations',   text:'Copy. Keep us updated on the appointment progress.', time:'09:12', self:true },
    { from:'Kasun Perera', text:'Doctor has been assigned. Estimated 1.5 hrs for consult.', time:'09:45', self:false },
    { from:'Operations',   text:'Confirmed. Update after consult.', time:'09:46', self:true },
  ]
  return (
    <div style={{ maxWidth:780, margin:'0 auto', padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:20 }}>Communication</h2>
      <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap:14 }} className="ops-2col">
        {/* Contacts sidebar */}
        <Card style={{ padding:0, overflow:'hidden' }}>
          {['Kasun Perera · Agent','Mohamed Ihsan · Client','Operations Team','Emergency Broadcast'].map((c,i)=>(
            <div key={i} style={{ padding:'12px 14px', borderBottom:`1px solid ${C.border}`, cursor:'pointer', background:i===0?`${C.primary}06`:'transparent' }}>
              <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                <UA name={c.split('·')[0].trim()} size={34} color={i===0?C.success:i===1?C.primary:i===2?C.accent:'#DC2626'} />
                <div>
                  <p style={{ fontSize:11, fontWeight:700, color:C.type }}>{c.split('·')[0].trim()}</p>
                  <p style={{ fontSize:9, color:C.muted }}>{c.split('·')[1]?.trim()}</p>
                </div>
              </div>
            </div>
          ))}
        </Card>
        {/* Chat */}
        <Card style={{ padding:0, overflow:'hidden', display:'flex', flexDirection:'column' }}>
          <div style={{ padding:'14px 16px', borderBottom:`1px solid ${C.border}`, display:'flex', gap:10, alignItems:'center' }}>
            <UA name="Kasun Perera" size={34} color={C.success} />
            <div>
              <p style={{ fontSize:12, fontWeight:700, color:C.type }}>Kasun Perera — RP-2026-000184</p>
              <div style={{ display:'flex', gap:5, alignItems:'center' }}><div style={{ width:6, height:6, borderRadius:'50%', background:C.success }}/><p style={{ fontSize:10, color:C.success }}>Active on visit</p></div>
            </div>
          </div>
          <div style={{ flex:1, padding:'16px', overflowY:'auto', minHeight:220, display:'flex', flexDirection:'column', gap:10 }}>
            {messages.map((m,i)=>(
              <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:m.self?'flex-end':'flex-start' }}>
                <div style={{ maxWidth:'75%', padding:'10px 14px', borderRadius:12, background:m.self?C.primary:'#F2F4F5', color:m.self?'white':C.type, borderBottomRightRadius:m.self?4:12, borderBottomLeftRadius:m.self?12:4 }}>
                  {!m.self&&<p style={{ fontSize:9, fontWeight:700, color:C.primary, marginBottom:2 }}>{m.from}</p>}
                  <p style={{ fontSize:12 }}>{m.text}</p>
                </div>
                <p style={{ fontSize:9, color:C.muted, marginTop:2 }}>{m.time}</p>
              </div>
            ))}
          </div>
          <div style={{ padding:'12px 14px', borderTop:`1px solid ${C.border}`, display:'flex', gap:8 }}>
            <input value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Type a message…" style={{ flex:1, padding:'9px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, background:'#FAFAFA', outline:'none' }} onKeyDown={e=>e.key==='Enter'&&msg&&(onToast('Message sent'),setMsg(''))} />
            <Btn label="Send" onClick={()=>{ if(msg){ onToast('Message sent'); setMsg('') } }} />
          </div>
        </Card>
      </div>
    </div>
  )
}

// ─── Documents ────────────────────────────────────────────────────────────────
function DocumentCenter({ onToast }:{ onToast:(m:string)=>void }) {
  const docs = [
    { t:'Care Plan',        sub:'RP-2026-000184 · Kasun Perera',        e:'📋', c:C.primary, type:'care'    },
    { t:'Medical Report',   sub:'Nimal Perera · Dr. Sirisena · Jan 18',  e:'🏥', c:C.info,    type:'medical' },
    { t:'Consent Form',     sub:'Signed · Mohamed Ihsan · Jan 20',       e:'✍️', c:C.success, type:'consent' },
    { t:'Visit Report',     sub:'RP-2026-000183 · Completed',            e:'📝', c:C.accent,  type:'report'  },
    { t:'Invoice',          sub:'LKR 6,200 · Paid · Jan 22',            e:'🧾', c:C.warning, type:'invoice' },
    { t:'Receipt',          sub:'LKR 6,200 · Jan 22 08:17',             e:'🧾', c:C.muted,   type:'receipt' },
  ]
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>Document Center</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }} className="ops-3col">
        {docs.map((d,i)=>(
          <Card key={i} hover style={{ padding:20 }}>
            <div style={{ width:44, height:44, borderRadius:14, background:`${d.c}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, marginBottom:12 }}>{d.e}</div>
            <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:4 }}>{d.t}</p>
            <p style={{ fontSize:10, color:C.muted, lineHeight:1.5, marginBottom:12 }}>{d.sub}</p>
            <div style={{ display:'flex', gap:6 }}>
              <Btn label="Preview" variant="ghost" small icon={I.eye} onClick={()=>onToast(`Previewing ${d.t}…`)} />
              <Btn label="Download" variant="secondary" small icon={I.download} onClick={()=>onToast(`Downloading…`)} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Activity Feed ────────────────────────────────────────────────────────────
function ActivityFeed() {
  const feed = [
    { e:'📋', t:'Booking Created',      d:'RP-2026-000189 · Suresh P. → Therapy Assistance',        time:'5 min ago',  c:C.info    },
    { e:'🔄', t:'Assignment Updated',   d:'RP-2026-000186 · Dilshan R. accepted',                    time:'12 min ago', c:C.primary },
    { e:'✅', t:'Agent Checked In',     d:'RP-2026-000184 · Kasun Perera · Colombo 03 · 09:04',       time:'18 min ago', c:C.success },
    { e:'⏰', t:'Visit Delayed',        d:'RP-2026-000185 · Traffic · 25 min estimated delay',        time:'30 min ago', c:C.warning },
    { e:'🚨', t:'Emergency Raised',     d:'RP-2026-000180 · Thilina S. · SOS activated',             time:'45 min ago', c:'#DC2626' },
    { e:'💰', t:'Payment Confirmed',    d:'RP-2026-000188 · LKR 5,400 · Chamari W.',                 time:'1 hr ago',   c:C.success },
    { e:'📝', t:'Booking Completed',    d:'RP-2026-000183 · Amara S. · Rating: 4.8★',                time:'2 hrs ago',  c:C.success },
    { e:'⭐', t:'Review Submitted',     d:'RP-2026-000182 · Mohamed I. gave 5★ to Kasun Perera',     time:'3 hrs ago',  c:C.warning },
  ]
  return (
    <div style={{ maxWidth:740, margin:'0 auto', padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:20 }}>Activity Feed</h2>
      {feed.map((f,i)=>(
        <Card key={i} style={{ padding:16, marginBottom:8 }}>
          <div style={{ display:'flex', gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:`${f.c}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{f.e}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:3 }}>
                <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{f.t}</p>
                <p style={{ fontSize:9, color:C.muted }}>{f.time}</p>
              </div>
              <p style={{ fontSize:11, color:C.sub, lineHeight:1.5 }}>{f.d}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Notifications ────────────────────────────────────────────────────────────
function OpsNotifications() {
  const items = [
    { e:'📋', t:'New Booking',          b:'RP-2026-000189 requires agent assignment.',              c:C.info,    read:false },
    { e:'✅', t:'Assignment Accepted',  b:'Kasun Perera accepted RP-2026-000184.',                 c:C.success, read:false },
    { e:'⏰', t:'Service Delayed',      b:'RP-2026-000185 delayed by 25 min. ETA 14:25.',          c:C.warning, read:false },
    { e:'🚨', t:'Emergency Alert',      b:'SOS raised on RP-2026-000180. Immediate action needed.',c:'#DC2626', read:false },
    { e:'🚫', t:'Cancellation',         b:'RP-2026-000182 cancelled by client. Refund pending.',   c:C.error,   read:true  },
    { e:'📅', t:'Reschedule Request',   b:'RP-2026-000185 — Priya Fernando requesting reschedule.',c:C.primary, read:true  },
    { e:'⚠️', t:'SLA Warning',          b:'4 bookings approaching SLA breach threshold.',          c:'#F97316', read:true  },
  ]
  return (
    <div style={{ maxWidth:680, margin:'0 auto', padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Notifications</h2>
        <Bdg label={`${items.filter(n=>!n.read).length} unread`} color={C.error} dot />
      </div>
      {items.map((n,i)=>(
        <Card key={i} style={{ padding:16, marginBottom:8, background:n.read?C.surface:`${n.c}04`, border:`1px solid ${n.read?C.border:n.c+'30'}` }}>
          <div style={{ display:'flex', gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:`${n.c}12`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{n.e}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:3 }}>
                <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{n.t}</p>
                {!n.read&&<div style={{ width:7, height:7, borderRadius:'50%', background:n.c }}/>}
              </div>
              <p style={{ fontSize:11, color:C.sub, lineHeight:1.5 }}>{n.b}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Reports ──────────────────────────────────────────────────────────────────
function OpsReports({ onToast }:{ onToast:(m:string)=>void }) {
  const reports = [
    { t:'Daily Operations Report',      d:'22 Jan 2026 — Bookings, assignments, completions',      e:'📊' },
    { t:'Service Performance Report',   d:'Completion rates, ratings, response times',             e:'⚡' },
    { t:'Agent Utilization Report',     d:'Hours logged, services completed, availability',        e:'👤' },
    { t:'Cancellation Report',          d:'Reasons, refunds, trends — Jan 2026',                   e:'🚫' },
    { t:'Delay Analysis Report',        d:'Root causes, peak hours, agent correlation',            e:'⏰' },
    { t:'SLA Compliance Report',        d:'Monthly SLA metrics and violation analysis',            e:'🎯' },
  ]
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>Operational Reports</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12 }}>
        {reports.map((r,i)=>(
          <Card key={i} hover style={{ padding:22 }}>
            <div style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
              <div style={{ width:44, height:44, borderRadius:14, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{r.e}</div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:4 }}>{r.t}</p>
                <p style={{ fontSize:11, color:C.muted, lineHeight:1.5, marginBottom:12 }}>{r.d}</p>
                <div style={{ display:'flex', gap:6 }}>
                  <Btn label="View" variant="ghost" small icon={I.eye} onClick={()=>onToast(`Viewing ${r.t}…`)} />
                  <Btn label="Download" variant="secondary" small icon={I.download} onClick={()=>onToast('Downloading PDF…')} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Status Badges ────────────────────────────────────────────────────────────
function OpsStatusBadges() {
  return (
    <div style={{ maxWidth:700, margin:'0 auto', padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>Status Badges</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
        {Object.entries(STATUS).map(([k,s],i)=>(
          <Card key={i} style={{ padding:18, textAlign:'center' as const, display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
            <div style={{ width:10, height:10, borderRadius:'50%', background:s.color }}/>
            <StatusBdg status={k} />
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Empty / Loading / Error / Success ────────────────────────────────────────
function OpsEmpty() {
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:16 }}>Empty States</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        {[{e:'📋',t:'No Bookings',          d:'No bookings match the current filters.'},{e:'🚨',t:'No Emergencies',       d:'All clear — no active emergencies.'},{e:'⏰',t:'No Delays',             d:'All visits are running on schedule.'},{e:'📬',t:'No Pending Assignments',d:'All bookings have been assigned.'}].map((s,i)=>(
          <Card key={i} style={{ padding:'38px 22px', textAlign:'center' as const }}>
            <p style={{ fontSize:44, marginBottom:12 }}>{s.e}</p>
            <p style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:8 }}>{s.t}</p>
            <p style={{ fontSize:12, color:C.muted, lineHeight:1.7 }}>{s.d}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

function OpsLoading() {
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:16 }}>Loading States</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        {['Loading Dashboard','Loading Bookings','Loading Map','Loading Schedule'].map((l,i)=>(
          <Card key={i} style={{ padding:22 }}>
            <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:14 }}>{l}</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:14 }}>
              {[...Array(4)].map((_,j)=><div key={j} style={{ height:60, borderRadius:10, background:'#F2F4F5' }}/>)}
            </div>
            {[...Array(3)].map((_,j)=>(
              <div key={j} style={{ display:'flex', gap:10, padding:'10px 0', borderBottom:j<2?`1px solid ${C.border}`:'none' }}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:'#E4E8EA', flexShrink:0 }}/>
                <div style={{ flex:1 }}><Shimmer h={12} w="70%"/><div style={{height:6}}/><Shimmer h={10} w="45%"/></div>
              </div>
            ))}
          </Card>
        ))}
      </div>
    </div>
  )
}

function OpsError({ onToast }:{ onToast:(m:string)=>void }) {
  return (
    <div style={{ maxWidth:580, margin:'0 auto', padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:16 }}>Error States</h2>
      {[{e:'📋',t:'Unable to Load Operations',d:'Operations data could not be fetched. Check permissions.',c:C.error},{e:'🚀',t:'Dispatch Error',           d:'Agent assignment failed. Try again or assign manually.',c:C.warning},{e:'🗺️',t:'Map Error',               d:'Live map unavailable. GPS data will update when restored.',c:C.muted}].map((er,i)=>(
        <Card key={i} style={{ padding:20, marginBottom:12, border:`1.5px solid ${er.c}30`, background:`${er.c}04` }}>
          <div style={{ display:'flex', gap:12 }}>
            <div style={{ width:42, height:42, borderRadius:12, background:`${er.c}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{er.e}</div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:13, fontWeight:800, color:er.c, marginBottom:4 }}>{er.t}</p>
              <p style={{ fontSize:11, color:C.sub, marginBottom:10 }}>{er.d}</p>
              <Btn label="Retry" variant="secondary" small icon={I.refresh} onClick={()=>onToast('Retrying…')} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

function OpsSuccess() {
  return (
    <div style={{ maxWidth:580, margin:'0 auto', padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:16 }}>Success States</h2>
      {[{e:'🚀',t:'Booking Assigned',    d:'RP-2026-000185 assigned to Ayesha M. successfully.',   c:C.success},{e:'📅',t:'Schedule Updated',   d:'Rescheduled to Thu 23 Jan 14:00 with Dilshan R.',       c:C.primary},{e:'🚨',t:'Emergency Resolved', d:'RP-2026-000180 resolved. Agent debriefed. Incident logged.',c:C.success},{e:'✅',t:'Service Completed',  d:'RP-2026-000184 completed. Rating 4.9★ submitted.',         c:C.success}].map((s,i)=>(
        <Card key={i} style={{ padding:18, marginBottom:10, border:`1.5px solid ${s.c}30`, background:`${s.c}04` }}>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <div style={{ width:42, height:42, borderRadius:12, background:`${s.c}12`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{s.e}</div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:13, fontWeight:700, color:s.c, marginBottom:2 }}>{s.t}</p>
              <p style={{ fontSize:11, color:C.sub }}>{s.d}</p>
            </div>
            <span style={{ color:s.c, display:'flex', transform:'scale(1.2)' }}>{I.check}</span>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function OperationsCenter() {
  const [sub, setSub] = useState<SubView>('dashboard')
  const [toast, setToast] = useState<string|null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const showToast = (m:string) => { setToast(m); setTimeout(()=>setToast(null),2800) }
  const groups = [...new Set(NAV.map(n=>n.group))]

  const renderMain = () => {
    switch(sub) {
      case 'dashboard':     return <OpsDashboard onNav={setSub} onToast={showToast} />
      case 'directory':     return <BookingDirectory onNav={setSub} onToast={showToast} />
      case 'bookingDetail': return <BookingDetails onToast={showToast} />
      case 'liveMonitor':   return <LiveServiceMonitor onToast={showToast} />
      case 'dispatch':      return <DispatchCenter onToast={showToast} />
      case 'assignments':   return <AssignmentMgmt onToast={showToast} />
      case 'liveMap':       return <LiveMap onToast={showToast} />
      case 'emergency':     return <EmergencyOps onToast={showToast} />
      case 'scheduling':    return <SchedulingCenter onToast={showToast} />
      case 'conflicts':     return <CalendarConflicts onToast={showToast} />
      case 'reschedule':    return <ReschedulingCenter onToast={showToast} />
      case 'timeline':      return <ServiceTimeline />
      case 'checklist':     return <ServiceChecklist onToast={showToast} />
      case 'sla':           return <SLAMonitoring />
      case 'cancellation':  return <CancellationMgmt onToast={showToast} />
      case 'communication': return <Communication onToast={showToast} />
      case 'documents':     return <DocumentCenter onToast={showToast} />
      case 'activityFeed':  return <ActivityFeed />
      case 'notifications': return <OpsNotifications />
      case 'reports':       return <OpsReports onToast={showToast} />
      case 'statusBadges':  return <OpsStatusBadges />
      case 'empty':         return <OpsEmpty />
      case 'loading':       return <OpsLoading />
      case 'error':         return <OpsError onToast={showToast} />
      case 'success':       return <OpsSuccess />
      default: return null
    }
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:C.bg, fontFamily:'Manrope,sans-serif' }}>
      {/* Dark sidebar */}
      <div className="ops-sidebar" style={{ width:216, background:C.dark, display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh', overflowY:'auto', flexShrink:0 }}>
        <div style={{ padding:'16px 18px 14px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <div style={{ width:30, height:30, borderRadius:9, background:`linear-gradient(135deg,${C.primary},#005D63)`, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ color:'white', fontSize:14 }}>⚡</span>
            </div>
            <div>
              <p style={{ fontSize:13, fontWeight:900, color:'rgba(255,255,255,0.95)', fontFamily:'Manrope,sans-serif', lineHeight:1 }}>ReadyPal</p>
              <p style={{ fontSize:9, color:'rgba(255,255,255,0.4)', fontWeight:700, textTransform:'uppercase' as const, letterSpacing:'0.08em' }}>Operations Center</p>
            </div>
          </div>
        </div>
        {groups.map(group=>(
          <div key={group}>
            <p style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', textTransform:'uppercase' as const, letterSpacing:'0.09em', padding:'10px 18px 4px' }}>{group}</p>
            {NAV.filter(n=>n.group===group).map(n=>{
              const active=sub===n.k
              return (
                <button key={n.k} onClick={()=>{ setSub(n.k); setSidebarOpen(false) }}
                  style={{ width:'100%', display:'flex', gap:9, alignItems:'center', padding:'9px 18px', border:'none', background:active?`${C.primary}25`:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:active?700:400, color:active?'rgba(255,255,255,0.95)':'rgba(255,255,255,0.5)', textAlign:'left' as const, borderLeft:active?`3px solid ${C.primary}`:'3px solid transparent', transition:'all 0.12s' }}>
                  <span style={{ display:'flex', color:active?C.primary:'rgba(255,255,255,0.35)' }}>{n.icon}</span>
                  <span style={{ flex:1 }}>{n.l}</span>
                  {n.badge&&n.badge>0&&<div style={{ minWidth:18, height:18, borderRadius:99, background:n.badge>=2?'#DC2626':C.warning, color:'#fff', fontSize:9, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 5px' }}>{n.badge}</div>}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* Mobile overlay */}
      {sidebarOpen&&(
        <div style={{ position:'fixed', inset:0, zIndex:50, background:'rgba(0,0,0,0.5)' }} onClick={()=>setSidebarOpen(false)}>
          <div onClick={e=>e.stopPropagation()} style={{ width:240, height:'100%', background:C.dark, overflowY:'auto' }}>
            <div style={{ padding:'16px 18px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.9)' }}>Operations Center</p>
            </div>
            {NAV.map(n=>(
              <button key={n.k} onClick={()=>{ setSub(n.k); setSidebarOpen(false) }}
                style={{ width:'100%', display:'flex', gap:9, alignItems:'center', padding:'10px 18px', border:'none', background:sub===n.k?`${C.primary}25`:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:sub===n.k?700:400, color:sub===n.k?'rgba(255,255,255,0.95)':'rgba(255,255,255,0.5)', textAlign:'left' as const }}>
                <span style={{ display:'flex', color:sub===n.k?C.primary:'rgba(255,255,255,0.35)' }}>{n.icon}</span>{n.l}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        {/* Header */}
        <div style={{ height:52, background:C.surface, borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', paddingInline:20, gap:12, position:'sticky', top:0, zIndex:30, flexShrink:0 }}>
          <button className="ops-menu-btn" onClick={()=>setSidebarOpen(v=>!v)} style={{ background:'none', border:'none', cursor:'pointer', color:C.type, padding:4, display:'none' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
          <div style={{ flex:1, display:'flex', gap:8, alignItems:'center', maxWidth:360, padding:'7px 12px', borderRadius:9, border:`1px solid ${C.border}`, background:'#FAFAFA' }}>
            <span style={{ display:'flex', color:C.muted }}>{I.eye}</span>
            <input placeholder="Search bookings, agents, clients…" style={{ border:'none', background:'transparent', fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, outline:'none', flex:1 }} onFocus={()=>setSub('directory')} />
          </div>
          <div style={{ marginLeft:'auto', display:'flex', gap:6, alignItems:'center' }}>
            <div style={{ display:'flex', gap:5, alignItems:'center', padding:'4px 10px', borderRadius:99, background:`${C.success}12`, border:`1px solid ${C.success}30` }}>
              <div style={{ width:7, height:7, borderRadius:'50%', background:C.success, animation:'pulse-dot 1.5s ease-in-out infinite' }}/>
              <p style={{ fontSize:10, fontWeight:700, color:C.success }}>12 LIVE</p>
            </div>
            <Bdg label="2 emergencies" color="#DC2626" dot />
            <Bdg label="5 unassigned" color={C.warning} dot />
          </div>
        </div>
        <div style={{ flex:1, overflowY:'auto' }} className="ops-main">
          {renderMain()}
        </div>
      </div>

      {toast&&<Toast msg={toast} />}
    </div>
  )
}
