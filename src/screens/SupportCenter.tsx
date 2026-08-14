import { useState, type ReactNode, type CSSProperties } from 'react'

const C = {
  primary:'#00737A', accent:'#EE8153', type:'#2C3E43', sub:'#6B7E85',
  muted:'#9AAAB0', border:'#E4E8EA', bg:'#F2F4F5', surface:'#FFFFFF',
  success:'#22C55E', warning:'#F59E0B', error:'#EF4444', info:'#3B82F6',
  dark:'#1A2A30', darkSub:'rgba(255,255,255,0.08)',
}

const TSTATUS: Record<string,{color:string;label:string}> = {
  open:       {color:C.primary,  label:'Open'          },
  pending:    {color:C.warning,  label:'Pending'       },
  assigned:   {color:C.info,     label:'Assigned'      },
  waiting:    {color:'#F97316',  label:'Waiting Reply' },
  escalated:  {color:'#DC2626',  label:'Escalated'     },
  resolved:   {color:C.success,  label:'Resolved'      },
  closed:     {color:C.muted,    label:'Closed'        },
  high:       {color:C.error,    label:'High Priority' },
  low:        {color:C.muted,    label:'Low Priority'  },
}

// ─── Module-level data ────────────────────────────────────────────────────────
const TICKETS = [
  { id:'SUP-2026-00481', subject:'Agent arrived late — rescheduling assistance needed', client:'Mohamed Ihsan',   agent:'Kasun Perera',    cat:'Booking Assistance', priority:'high',   assignee:'Amara S.',   status:'waiting',   sla:'breach',   created:'22 Jan 09:15', updated:'22 Jan 14:30' },
  { id:'SUP-2026-00480', subject:'Payment deducted but booking not confirmed',          client:'Priya Fernando',  agent:'Dilshan R.',      cat:'Payment Issue',      priority:'urgent', assignee:'Thilina S.', status:'escalated', sla:'breach',   created:'21 Jan 18:42', updated:'22 Jan 11:00' },
  { id:'SUP-2026-00479', subject:'Care agent behaviour complaint',                      client:'Sampath J.',      agent:'Ayesha M.',       cat:'Complaint',          priority:'high',   assignee:'Ranjith B.', status:'open',      sla:'ok',       created:'21 Jan 14:10', updated:'21 Jan 16:20' },
  { id:'SUP-2026-00478', subject:'How do I add a second beneficiary?',                  client:'Chamara K.',      agent:'-',               cat:'How-to Query',       priority:'low',    assignee:'Amara S.',   status:'resolved',  sla:'ok',       created:'20 Jan 10:30', updated:'20 Jan 11:45' },
  { id:'SUP-2026-00477', subject:'Refund request — service cancelled by agent',         client:'Nirosha J.',      agent:'Chamara W.',      cat:'Refund',             priority:'medium', assignee:'Thilina S.', status:'pending',   sla:'warning',  created:'20 Jan 08:00', updated:'21 Jan 09:30' },
  { id:'SUP-2026-00476', subject:'App crash during live tracking',                      client:'Mohamed Ihsan',   agent:'Kasun Perera',    cat:'Technical',          priority:'medium', assignee:'Unassigned', status:'open',      sla:'ok',       created:'19 Jan 15:20', updated:'19 Jan 15:20' },
]

const COMPLAINTS = [
  { id:'CMP-2026-00041', booking:'RP-2026-000178', client:'Priya Fernando',  cat:'Agent Conduct',       severity:'high',   officer:'Ranjith B.',   status:'open',     raised:'18 Jan 2026' },
  { id:'CMP-2026-00040', booking:'RP-2026-000162', client:'Chamara K.',     cat:'Service Quality',     severity:'medium', officer:'Amara S.',     status:'resolved', raised:'12 Jan 2026' },
  { id:'CMP-2026-00039', booking:'RP-2026-000155', client:'Sampath J.',     cat:'Billing Discrepancy', severity:'low',    officer:'Thilina S.',   status:'open',     raised:'10 Jan 2026' },
]

const AGENTS_PERF = [
  { name:'Amara Subasinghe',  tickets:84, resolved:78, avgTime:'4.2h', csat:4.8, score:96, workload:62 },
  { name:'Thilina Senanayake',tickets:67, resolved:61, avgTime:'5.1h', csat:4.6, score:88, workload:74 },
  { name:'Ranjith Bandara',   tickets:42, resolved:40, avgTime:'3.8h', csat:4.9, score:98, workload:45 },
]

const TEMPLATES = [
  { name:'Welcome Message',       channel:'Email', audience:'Clients',     status:'active' },
  { name:'Booking Confirmation',  channel:'SMS',   audience:'Clients',     status:'active' },
  { name:'Appointment Reminder',  channel:'Push',  audience:'Clients',     status:'active' },
  { name:'Refund Update',         channel:'Email', audience:'Clients',     status:'active' },
  { name:'Verification Update',   channel:'Email', audience:'Agents',      status:'active' },
  { name:'Emergency Alert',       channel:'SMS',   audience:'All',         status:'active' },
  { name:'Monthly Promotion',     channel:'Email', audience:'Clients',     status:'draft'  },
]

const KB_ARTICLES = [
  { title:'How to book a care agent',          cat:'Getting Started', views:1284, status:'published' },
  { title:'Payment methods accepted',          cat:'Payments',        views:842,  status:'published' },
  { title:'How to cancel a booking',           cat:'Bookings',        views:634,  status:'published' },
  { title:'Adding a beneficiary',              cat:'Account',         views:521,  status:'published' },
  { title:'Care agent verification process',   cat:'Agents',          views:418,  status:'published' },
  { title:'Refund policy and timeline',        cat:'Payments',        views:312,  status:'published' },
  { title:'Emergency escalation procedure',   cat:'Safety',          views:0,    status:'draft'     },
]

const ANNOUNCEMENTS_DATA = [
  { title:'App Maintenance — 25 Jan 02:00–04:00',       audience:'All',     priority:'high',   status:'scheduled', published:'25 Jan 2026', expires:'26 Jan 2026' },
  { title:'New Cancellation Policy Effective Feb 2026',  audience:'Clients', priority:'medium', status:'published', published:'20 Jan 2026', expires:'01 Feb 2026' },
  { title:'Care Agent Certification Reminder',           audience:'Agents',  priority:'medium', status:'published', published:'15 Jan 2026', expires:'15 Feb 2026' },
  { title:'Festive Season Service Hours',                audience:'All',     priority:'low',    status:'expired',   published:'20 Dec 2025', expires:'10 Jan 2026' },
]

// ─── Icons ────────────────────────────────────────────────────────────────────
const I: Record<string,ReactNode> = {
  home:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 5.5l5.5-4.5 5.5 4.5V12H8.5V8.5h-4V12H1V5.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  ticket:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="1" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 4.5h5M4 7h3M4 9.5h4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  chat:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 2h10v7.5H7.5L4.5 12V9.5H1.5V2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M4 5.5h5M4 7.5h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  crm:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 11.5c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  complaint:<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5L1 12h11L6.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M6.5 5v3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="6.5" cy="10" r=".7" fill="currentColor"/></svg>,
  escalate: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2v8M3.5 4.5L6.5 2l3 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M1.5 10.5h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  comms:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 2h11v7H7l-2 3V9H1V2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  announce: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 4.5h7l2-2v7l-2-2H2v-3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M4 7.5v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  kb:       <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="2" y="1" width="9" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 4.5h4M4.5 7h4M4.5 9.5h2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  activity: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 7l2.5-4 2.5 3 2-2.5 2.5 4L13 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  sla:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M6.5 3.5V7h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  perf:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="1" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 9V7M6.5 9V5M9 9V3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  feedback: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5l1.2 3.4H11L8.4 7l1 3.2-2.9-2-2.9 2 1-3.2L2 4.9h3.3L6.5 1.5z" stroke="currentColor" strokeWidth="1.1"/></svg>,
  auto:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5c0-2.5 2-4.5 4.5-4.5S11 4 11 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M5.5 10l1 1.5 1-1.5M6.5 8v3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  template: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="1" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 4.5h5M4 7h5M4 9.5h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  broadcast:<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M3.5 3.5a4.24 4.24 0 0 0 0 6M9.5 3.5a4.24 4.24 0 0 1 0 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M1.5 1.5a7 7 0 0 0 0 10M11.5 1.5a7 7 0 0 1 0 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  report:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="1" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 9V7M6.5 9V5M9 9V3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  bell:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5c-2.5 0-4 1.8-4 4v2.5L1 9.5h11l-1.5-1.5V5.5c0-2.2-1.5-4-4-4z" stroke="currentColor" strokeWidth="1.2"/><path d="M5 9.5c0 .83.67 1.5 1.5 1.5S8 10.33 8 9.5" stroke="currentColor" strokeWidth="1.1"/></svg>,
  badge:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1L1.5 3v4c0 3 5 4.5 5 4.5s5-1.5 5-4.5V3L6.5 1z" stroke="currentColor" strokeWidth="1.2"/><path d="M4 6.5l2 2 3.5-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  check:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 6.5l3 3.5 5-6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  eye:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 6.5C1 6.5 3 3.5 6.5 3.5S12 6.5 12 6.5 10 9.5 6.5 9.5 1 6.5 1 6.5z" stroke="currentColor" strokeWidth="1.2"/><circle cx="6.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/></svg>,
  alert:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5L1 12h11L6.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M6.5 5.5v3M6.5 10v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  plus:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2v9M2 6.5h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  send:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M11 6.5L2 2l2 4.5-2 4.5 9-4.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M4 6.5h4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  attach:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M10 5.5L5.5 10A3 3 0 0 1 1.5 6l5-5a2 2 0 1 1 2.83 2.83L4 9a1 1 0 1 1-1.41-1.41L7.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  chevR:    <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M3.5 2l3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  refresh:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M11 6.5a4.5 4.5 0 1 1-1-2.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M11 3v2.5H8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  export:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2v7M4 6.5L6.5 9 9 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M1.5 10.5h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  edit:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M9.5 1.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  search:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="3.5" stroke="currentColor" strokeWidth="1.2"/><path d="M8.5 8.5L11 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
}

// ─── Primitives ───────────────────────────────────────────────────────────────
function Card({ children, style={}, hover=false, onClick }:{ children:ReactNode; style?:CSSProperties; hover?:boolean; onClick?:()=>void }) {
  return (
    <div onClick={onClick}
      onMouseEnter={e=>{ if(hover){const el=e.currentTarget as HTMLDivElement;el.style.borderColor=C.primary+'50';el.style.boxShadow='0 8px 24px rgba(44,62,67,0.10)'}}}
      onMouseLeave={e=>{ if(hover){const el=e.currentTarget as HTMLDivElement;el.style.borderColor=C.border;el.style.boxShadow='0 1px 4px rgba(44,62,67,0.06)'}}}
      style={{ background:C.surface, borderRadius:14, border:`1px solid ${C.border}`, boxShadow:'0 1px 4px rgba(44,62,67,0.06)', transition:'all 0.18s', cursor:onClick?'pointer':undefined, ...style }}>
      {children}
    </div>
  )
}

const BTN_BASE: Record<string,{background:string;color:string;border:string}> = {
  primary:  { background:C.primary,  color:'#fff', border:'none' },
  secondary:{ background:'#fff',     color:C.primary, border:`1.5px solid ${C.border}` },
  ghost:    { background:'transparent', color:C.sub, border:'none' },
  danger:   { background:C.error,    color:'#fff', border:'none' },
  warning:  { background:C.warning,  color:'#fff', border:'none' },
  success:  { background:C.success,  color:'#fff', border:'none' },
}
const BTN_HBG: Record<string,string> = {
  primary:'#005D63', secondary:'#EEF5F5', ghost:C.bg,
  danger:'#DC2626', warning:'#D97706', success:'#16A34A',
}

function Btn({ label, icon, onClick, variant='primary', small=false, full=false }:{
  label:string; icon?:ReactNode; onClick?:()=>void
  variant?:'primary'|'secondary'|'ghost'|'danger'|'warning'|'success'
  small?:boolean; full?:boolean
}) {
  return (
    <button onClick={onClick}
      onMouseEnter={e=>{ (e.currentTarget as HTMLButtonElement).style.background=BTN_HBG[variant] }}
      onMouseLeave={e=>{ (e.currentTarget as HTMLButtonElement).style.background=BTN_BASE[variant].background }}
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

function TSBdg({ status }:{ status:string }) {
  const s = TSTATUS[status] || {color:C.muted, label:status}
  return <Bdg label={s.label} color={s.color} dot />
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

function UA({ name, size=36, color=C.primary }:{ name:string; size?:number; color?:string }) {
  const ini = name.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase()
  return <div style={{ width:size, height:size, borderRadius:'50%', background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', color, fontFamily:'Manrope,sans-serif', fontWeight:900, fontSize:size*0.3, flexShrink:0 }}>{ini}</div>
}

function PriBdg({ p }:{ p:string }) {
  const c = p==='urgent'?'#DC2626':p==='high'?C.error:p==='medium'?C.warning:C.muted
  return <Bdg label={p.toUpperCase()} color={c} />
}

function SlaBdg({ s }:{ s:string }) {
  const c = s==='breach'?C.error:s==='warning'?C.warning:C.success
  const l = s==='breach'?'SLA Breach':s==='warning'?'SLA Warning':'SLA OK'
  return <Bdg label={l} color={c} dot />
}

// ─── Support Dashboard ────────────────────────────────────────────────────────
const DASH_KPIS = [
  { l:'Open Tickets',       v:'38',     c:C.primary, sub:'Awaiting action'    },
  { l:'Pending',            v:'14',     c:C.warning, sub:'Customer reply needed'},
  { l:'Resolved Today',     v:'22',     c:C.success, sub:'Closed this session' },
  { l:'Avg Response Time',  v:'6 min',  c:C.primary, sub:'vs 9 min last week'  },
  { l:'SLA Compliance',     v:'94.2%',  c:C.success, sub:'Target > 95%'        },
  { l:'Live Chats',         v:'7',      c:C.info,    sub:'Active right now'    },
  { l:'Complaints',         v:'3',      c:'#F97316', sub:'1 high severity'     },
  { l:'CSAT Score',         v:'4.8',    c:C.success, sub:'Out of 5.0'          },
]

function SupportHome({ onNav, onToast }:{ onNav:(s:SubView)=>void; onToast:(m:string)=>void }) {
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      {/* SLA breach alert */}
      <div style={{ padding:'13px 20px', borderRadius:12, background:`${C.error}06`, border:`1.5px solid ${C.error}30`, marginBottom:18, display:'flex', gap:12, alignItems:'center' }}>
        <div style={{ width:8, height:8, borderRadius:'50%', background:C.error, animation:'pulse-dot 1s ease-in-out infinite', flexShrink:0 }}/>
        <p style={{ flex:1, fontSize:12, fontWeight:700, color:C.error, fontFamily:'Manrope,sans-serif' }}>2 SLA breaches — SUP-2026-00481, SUP-2026-00480 require immediate attention</p>
        <Btn label="View Tickets" variant="danger" small onClick={()=>onNav('tickets')} />
      </div>
      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }} className="sup-4col">
        {DASH_KPIS.map((k,i)=>(
          <Card key={i} hover style={{ padding:18 }}>
            <p style={{ fontSize:10, color:C.muted, marginBottom:8 }}>{k.l}</p>
            <p style={{ fontSize:26, fontWeight:900, color:k.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{k.v}</p>
            <p style={{ fontSize:10, color:C.muted }}>{k.sub}</p>
          </Card>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:16 }} className="sup-main-split">
        {/* Recent tickets */}
        <Card style={{ padding:20 }}>
          <SectionTitle title="Recent Tickets" action="View All" onAction={()=>onNav('tickets')} />
          {TICKETS.slice(0,5).map((t,i)=>(
            <div key={t.id}
              onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='#FAFBFB'}
              onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}
              onClick={()=>{ onNav('ticketDetail'); onToast(`Opening ${t.id}`) }}
              style={{ display:'flex', gap:10, padding:'10px 0', borderBottom:i<4?`1px solid ${C.border}`:'none', cursor:'pointer', transition:'background 0.12s' }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:TSTATUS[t.status]?.color||C.muted, flexShrink:0, marginTop:5 }}/>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:1 }}>
                  <p style={{ fontSize:11, fontWeight:700, color:C.primary }}>{t.id}</p>
                  <PriBdg p={t.priority} />
                </div>
                <p style={{ fontSize:11, color:C.type, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as const }}>{t.subject}</p>
                <p style={{ fontSize:9, color:C.muted }}>{t.client} · {t.assignee} · {t.updated}</p>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:4, alignItems:'flex-end', flexShrink:0 }}>
                <TSBdg status={t.status} />
                <SlaBdg s={t.sla} />
              </div>
            </div>
          ))}
        </Card>
        {/* Right column */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {/* Agent workload */}
          <Card style={{ padding:20 }}>
            <SectionTitle title="Agent Workload" action="Performance" onAction={()=>onNav('agentPerf')} />
            {AGENTS_PERF.map((a,i)=>(
              <div key={i} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom:i<AGENTS_PERF.length-1?`1px solid ${C.border}`:'none', alignItems:'center' }}>
                <UA name={a.name} size={30} color={C.primary} />
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:11, fontWeight:700, color:C.type }}>{a.name.split(' ')[0]}</p>
                  <div style={{ height:4, borderRadius:99, background:`${C.primary}12`, marginTop:4 }}>
                    <div style={{ width:`${a.workload}%`, height:'100%', background:a.workload>80?C.error:a.workload>60?C.warning:C.primary, borderRadius:99 }}/>
                  </div>
                </div>
                <p style={{ fontSize:10, fontWeight:700, color:a.workload>80?C.error:a.workload>60?C.warning:C.primary }}>{a.workload}%</p>
              </div>
            ))}
          </Card>
          {/* Quick actions */}
          <Card style={{ padding:20 }}>
            <SectionTitle title="Quick Actions" />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {[{l:'New Ticket',cb:()=>onToast('Opening ticket form…')},{l:'Start Chat',cb:()=>onNav('chat')},{l:'Broadcast',cb:()=>onNav('broadcast')},{l:'Announcement',cb:()=>onNav('announcements')},{l:'SLA Report',cb:()=>onNav('sla')},{l:'Knowledge Base',cb:()=>onNav('kb')}].map((a,i)=>(
                <button key={i} onClick={a.cb}
                  style={{ padding:'10px 4px', borderRadius:10, border:`1px solid ${C.border}`, background:'#FAFAFA', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:10, fontWeight:700, color:C.sub, transition:'all 0.12s' }}
                  onMouseEnter={e=>{ const b=e.currentTarget as HTMLButtonElement; b.style.borderColor=C.primary; b.style.color=C.primary }}
                  onMouseLeave={e=>{ const b=e.currentTarget as HTMLButtonElement; b.style.borderColor=C.border; b.style.color=C.sub }}>
                  {a.l}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ─── Ticket Directory ─────────────────────────────────────────────────────────
function TicketDirectory({ onNav, onToast }:{ onNav:(s:SubView)=>void; onToast:(m:string)=>void }) {
  const [q, setQ] = useState('')
  const [sf, setSf] = useState('all')
  const filtered = TICKETS.filter(t =>
    (sf==='all'||t.status===sf) &&
    (t.id.includes(q)||t.subject.toLowerCase().includes(q.toLowerCase())||t.client.toLowerCase().includes(q.toLowerCase()))
  )
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Support Ticket Directory</h2>
        <div style={{ display:'flex', gap:8 }}>
          <Btn label="Export" variant="secondary" small icon={I.export} onClick={()=>onToast('Exporting…')} />
          <Btn label="New Ticket" variant="primary" small icon={I.plus} onClick={()=>onToast('Opening form…')} />
        </div>
      </div>
      <Card style={{ padding:14, marginBottom:14 }}>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' as const, alignItems:'center' }}>
          <div style={{ display:'flex', gap:8, alignItems:'center', flex:1, minWidth:180, padding:'8px 12px', borderRadius:9, border:`1px solid ${C.border}`, background:'#FAFAFA' }}>
            <span style={{ display:'flex', color:C.muted }}>{I.search}</span>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by ID, subject or client…" style={{ border:'none', background:'transparent', fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, outline:'none', flex:1 }} />
          </div>
          <div style={{ display:'flex', gap:5, flexWrap:'wrap' as const }}>
            {['all','open','pending','waiting','escalated','resolved','closed'].map(f=>(
              <button key={f} onClick={()=>setSf(f)}
                style={{ padding:'6px 12px', borderRadius:99, border:`1.5px solid ${sf===f?C.primary:C.border}`, background:sf===f?`${C.primary}08`:'#FAFAFA', cursor:'pointer', fontSize:10, fontWeight:700, color:sf===f?C.primary:C.muted, fontFamily:'Manrope,sans-serif' }}>
                {TSTATUS[f]?.label||'All'}
              </button>
            ))}
          </div>
        </div>
      </Card>
      <Card style={{ overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'120px 1fr 130px 130px 120px 80px 110px 90px 80px 100px', padding:'10px 14px', background:'#FAFAFA', borderBottom:`1px solid ${C.border}`, minWidth:1100 }}>
          {['Ticket ID','Subject','Client','Agent','Category','Priority','Assignee','Status','SLA','Actions'].map((h,i)=>(
            <p key={i} style={{ fontSize:9, fontWeight:800, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.06em', paddingInline:4 }}>{h}</p>
          ))}
        </div>
        <div style={{ overflowX:'auto' }}>
          {filtered.map((t,i)=>(
            <div key={t.id}
              onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='#FAFBFB'}
              onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}
              style={{ display:'grid', gridTemplateColumns:'120px 1fr 130px 130px 120px 80px 110px 90px 80px 100px', padding:'10px 14px', borderBottom:i<filtered.length-1?`1px solid ${C.border}`:'none', transition:'background 0.12s', minWidth:1100 }}>
              <p style={{ fontSize:11, fontWeight:700, color:C.primary, paddingInline:4, display:'flex', alignItems:'center' }}>{t.id.split('-').slice(-1)}</p>
              <p style={{ fontSize:11, color:C.type, paddingInline:4, display:'flex', alignItems:'center', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as const }}>{t.subject}</p>
              <div style={{ paddingInline:4, display:'flex', alignItems:'center', gap:5 }}><UA name={t.client} size={22}/><p style={{ fontSize:10, color:C.sub, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as const }}>{t.client}</p></div>
              <p style={{ fontSize:10, color:C.muted, paddingInline:4, display:'flex', alignItems:'center' }}>{t.agent}</p>
              <div style={{ paddingInline:4, display:'flex', alignItems:'center' }}><Bdg label={t.cat} color={C.info} /></div>
              <div style={{ paddingInline:4, display:'flex', alignItems:'center' }}><PriBdg p={t.priority} /></div>
              <p style={{ fontSize:10, color:C.muted, paddingInline:4, display:'flex', alignItems:'center' }}>{t.assignee}</p>
              <div style={{ paddingInline:4, display:'flex', alignItems:'center' }}><TSBdg status={t.status} /></div>
              <div style={{ paddingInline:4, display:'flex', alignItems:'center' }}><SlaBdg s={t.sla} /></div>
              <div style={{ paddingInline:4, display:'flex', gap:4, alignItems:'center' }}>
                <button onClick={()=>{ onNav('ticketDetail'); onToast(`Viewing ${t.id}`) }} style={{ background:'none', border:'none', cursor:'pointer', color:C.primary, display:'flex', padding:3 }}>{I.eye}</button>
                <button onClick={()=>onToast(`Assigning ${t.id}`)} style={{ background:'none', border:'none', cursor:'pointer', color:C.info, display:'flex', padding:3 }}>{I.crm}</button>
                <button onClick={()=>onToast('Reply window open')} style={{ background:'none', border:'none', cursor:'pointer', color:C.success, display:'flex', padding:3 }}>{I.send}</button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Ticket Details ───────────────────────────────────────────────────────────
function TicketDetails({ onToast }:{ onToast:(m:string)=>void }) {
  const t = TICKETS[0]
  const [reply, setReply] = useState('')
  const [note, setNote] = useState('')
  const msgs = [
    { from:'Mohamed Ihsan', body:'The care agent was supposed to arrive at 9am but only showed up at 11:30am. This caused me to miss the hospital appointment. I need a refund and rescheduling.', time:'22 Jan 09:15', type:'customer' },
    { from:'Amara Subasinghe', body:"I'm sorry to hear about this experience, Mr. Ihsan. I'm looking into the booking now and will get back to you within 30 minutes with a resolution.", time:'22 Jan 09:21', type:'agent'    },
    { from:'Mohamed Ihsan', body:'Thank you. Please note the hospital appointment cannot be rescheduled until next week. I want this resolved urgently.', time:'22 Jan 09:45', type:'customer' },
    { from:'System', body:'Ticket escalated to high priority. SLA counter reset.', time:'22 Jan 10:00', type:'system'   },
  ]
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:14, padding:'20px 24px 60px', minHeight:'calc(100vh - 52px)' }} className="sup-ticket-wrap">
      {/* Left: conversation */}
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <Card style={{ padding:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap' as const, gap:10 }}>
            <div>
              <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                <h2 style={{ fontSize:16, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>{t.id}</h2>
                <PriBdg p={t.priority} />
                <TSBdg status={t.status} />
                <SlaBdg s={t.sla} />
              </div>
              <p style={{ fontSize:13, color:C.sub }}>{t.subject}</p>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <Btn label="Assign" variant="secondary" small onClick={()=>onToast('Opening assign dialog…')} />
              <Btn label="Resolve" variant="success" small icon={I.check} onClick={()=>onToast('Ticket resolved!')} />
              <Btn label="Close" variant="ghost" small onClick={()=>onToast('Ticket closed')} />
            </div>
          </div>
        </Card>
        {/* Messages */}
        <Card style={{ padding:20, flex:1 }}>
          <SectionTitle title="Conversation" />
          <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:16 }}>
            {msgs.map((m,i)=>(
              <div key={i} style={{ display:'flex', gap:10, flexDirection:m.type==='agent'?'row-reverse':'row', alignItems:'flex-start' }}>
                {m.type!=='system'&&<UA name={m.from} size={32} color={m.type==='agent'?C.primary:C.accent} />}
                <div style={{ maxWidth:'75%', ...(m.type==='system'?{width:'100%'}:{}) }}>
                  {m.type==='system'
                    ? <div style={{ padding:'6px 14px', borderRadius:8, background:`${C.info}08`, border:`1px solid ${C.info}20`, textAlign:'center' as const }}><p style={{ fontSize:10, color:C.info, fontWeight:600 }}>{m.body}</p></div>
                    : <div style={{ padding:'10px 14px', borderRadius:m.type==='agent'?'12px 12px 0 12px':'12px 12px 12px 0', background:m.type==='agent'?`${C.primary}10`:'#F4F6F7', border:`1px solid ${m.type==='agent'?C.primary+'25':C.border}` }}>
                        <p style={{ fontSize:11, color:C.type, lineHeight:1.6 }}>{m.body}</p>
                      </div>
                  }
                  {m.type!=='system'&&<p style={{ fontSize:9, color:C.muted, marginTop:3, textAlign:m.type==='agent'?'right' as const:'left' as const }}>{m.from} · {m.time}</p>}
                </div>
              </div>
            ))}
          </div>
          {/* Reply box */}
          <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:14 }}>
            <div style={{ display:'flex', gap:8, marginBottom:8 }}>
              {['Public Reply','Internal Note'].map((tab,i)=>(
                <button key={tab}
                  style={{ padding:'5px 12px', borderRadius:7, border:`1.5px solid ${i===0?C.primary:C.border}`, background:i===0?`${C.primary}08`:'transparent', fontSize:10, fontWeight:700, color:i===0?C.primary:C.muted, cursor:'pointer', fontFamily:'Manrope,sans-serif' }}>
                  {tab}
                </button>
              ))}
            </div>
            <textarea value={reply} onChange={e=>setReply(e.target.value)} placeholder="Write your reply…" rows={3}
              style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, background:'#FAFAFA', outline:'none', resize:'none', boxSizing:'border-box' as const, marginBottom:8 }} />
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ display:'flex', gap:6 }}>
                <button style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, display:'flex' }}>{I.attach}</button>
              </div>
              <Btn label="Send Reply" icon={I.send} onClick={()=>{ if(reply.trim()){ onToast('Reply sent'); setReply('') }}} />
            </div>
          </div>
        </Card>
        {/* Internal note */}
        <Card style={{ padding:20 }}>
          <SectionTitle title="Internal Note" />
          <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Add a private note visible only to support staff…" rows={2}
            style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, background:`${C.warning}06`, outline:'none', resize:'none', boxSizing:'border-box' as const, marginBottom:8 }} />
          <Btn label="Save Note" variant="warning" small onClick={()=>{ if(note.trim()){ onToast('Note saved'); setNote('') }}} />
        </Card>
      </div>
      {/* Right sidebar */}
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        <Card style={{ padding:20 }}>
          <SectionTitle title="Customer Profile" />
          <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:14 }}>
            <UA name={t.client} size={44} color={C.accent} />
            <div>
              <p style={{ fontSize:13, fontWeight:800, color:C.type }}>{t.client}</p>
              <p style={{ fontSize:10, color:C.muted }}>Client · Colombo</p>
            </div>
          </div>
          {[{l:'Phone',v:'+94 71 234 5678'},{l:'Email',v:'m.ihsan@mail.com'},{l:'Member Since',v:'Mar 2025'},{l:'Total Bookings',v:'8'},{l:'Lifetime Value',v:'LKR 68,000'}].map((r,i)=>(
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:i<4?`1px solid ${C.border}`:'none' }}>
              <p style={{ fontSize:10, color:C.muted }}>{r.l}</p>
              <p style={{ fontSize:11, fontWeight:600, color:C.type }}>{r.v}</p>
            </div>
          ))}
          <div style={{ marginTop:10 }}><Btn label="Open CRM" variant="ghost" small full icon={I.crm} onClick={()=>onToast('Opening CRM…')} /></div>
        </Card>
        <Card style={{ padding:20 }}>
          <SectionTitle title="Related Booking" />
          {[{l:'Booking',v:'RP-2026-000184'},{l:'Service',v:'Hospital Appointment'},{l:'Date',v:'22 Jan 2026'},{l:'Agent',v:t.agent},{l:'Status',v:'In Progress'},{l:'Amount',v:'LKR 8,500'}].map((r,i)=>(
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:i<5?`1px solid ${C.border}`:'none' }}>
              <p style={{ fontSize:10, color:C.muted }}>{r.l}</p>
              <p style={{ fontSize:11, fontWeight:600, color:C.type }}>{r.v}</p>
            </div>
          ))}
        </Card>
        <Card style={{ padding:20 }}>
          <SectionTitle title="Ticket Info" />
          {[{l:'Category',v:t.cat},{l:'Priority',v:t.priority},{l:'Assignee',v:t.assignee},{l:'Created',v:t.created},{l:'Last Updated',v:t.updated}].map((r,i)=>(
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:i<4?`1px solid ${C.border}`:'none' }}>
              <p style={{ fontSize:10, color:C.muted }}>{r.l}</p>
              <p style={{ fontSize:11, fontWeight:600, color:C.type }}>{r.v}</p>
            </div>
          ))}
          <div style={{ marginTop:10, display:'flex', flexDirection:'column', gap:6 }}>
            <Btn label="Escalate" variant="danger" small full icon={I.escalate} onClick={()=>onToast('Ticket escalated')} />
          </div>
        </Card>
      </div>
    </div>
  )
}

// ─── Live Chat Center ─────────────────────────────────────────────────────────
const LIVE_CHATS = [
  { id:'CHT-001', name:'Priya Fernando',  preview:'I need help with my booking…',  wait:'2m', status:'active',  agent:'Amara S.'  },
  { id:'CHT-002', name:'Sampath J.',      preview:'Payment not received yet',       wait:'5m', status:'waiting', agent:'Unassigned' },
  { id:'CHT-003', name:'Chamara K.',      preview:'How do I cancel my booking?',    wait:'1m', status:'active',  agent:'Thilina S.' },
  { id:'CHT-004', name:'Nirosha J.',      preview:'My agent did not show up',       wait:'8m', status:'waiting', agent:'Unassigned' },
]
const CANNED = [
  'Thank you for contacting ReadyPal support. How can I help you today?',
  'I completely understand your concern. Let me look into this for you right away.',
  'I have escalated your case to our senior support team. You will receive an update within 2 hours.',
  'Your refund has been initiated and will reflect within 3-5 business days.',
]

function LiveChatCenter({ onToast }:{ onToast:(m:string)=>void }) {
  const [activeChat, setActiveChat] = useState(0)
  const [msg, setMsg] = useState('')
  const [showCanned, setShowCanned] = useState(false)
  const chat = LIVE_CHATS[activeChat]
  return (
    <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap:0, height:'calc(100vh - 52px)', background:C.bg }} className="sup-chat-wrap">
      {/* Chat list */}
      <div style={{ background:C.surface, borderRight:`1px solid ${C.border}`, display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'14px 16px', borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
            <h3 style={{ fontSize:13, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Live Chats</h3>
            <Bdg label={`${LIVE_CHATS.filter(c=>c.status==='waiting').length} waiting`} color={C.warning} dot />
          </div>
          <div style={{ display:'flex', gap:8, padding:'7px 10px', borderRadius:8, border:`1px solid ${C.border}`, background:'#FAFAFA' }}>
            <span style={{ display:'flex', color:C.muted }}>{I.search}</span>
            <input placeholder="Search chats…" style={{ border:'none', background:'transparent', fontSize:11, fontFamily:'Manrope,sans-serif', outline:'none', color:C.type, flex:1 }} />
          </div>
        </div>
        <div style={{ flex:1, overflowY:'auto' }}>
          {LIVE_CHATS.map((c,i)=>(
            <div key={c.id} onClick={()=>setActiveChat(i)}
              style={{ padding:'12px 16px', borderBottom:`1px solid ${C.border}`, cursor:'pointer', background:activeChat===i?`${C.primary}06`:'transparent', borderLeft:`3px solid ${activeChat===i?C.primary:'transparent'}`, transition:'all 0.12s' }}>
              <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                <div style={{ position:'relative' as const, flexShrink:0 }}>
                  <UA name={c.name} size={32} color={C.primary} />
                  <div style={{ position:'absolute', bottom:0, right:0, width:8, height:8, borderRadius:'50%', background:c.status==='active'?C.success:C.warning, border:`1.5px solid ${C.surface}` }}/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
                    <p style={{ fontSize:11, fontWeight:700, color:C.type }}>{c.name}</p>
                    <p style={{ fontSize:9, color:C.muted }}>{c.wait}</p>
                  </div>
                  <p style={{ fontSize:10, color:C.muted, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as const }}>{c.preview}</p>
                  <p style={{ fontSize:9, color:c.status==='waiting'?C.warning:C.success, fontWeight:600, marginTop:2 }}>{c.status==='waiting'?'Waiting for agent':c.agent}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Chat window */}
      <div style={{ display:'flex', flexDirection:'column', background:C.surface }}>
        {/* Header */}
        <div style={{ padding:'12px 20px', borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <UA name={chat.name} size={36} color={C.primary} />
            <div>
              <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{chat.name}</p>
              <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                <div style={{ width:6, height:6, borderRadius:'50%', background:chat.status==='active'?C.success:C.warning }}/>
                <p style={{ fontSize:10, color:C.muted }}>{chat.status==='active'?`Active · ${chat.agent}`:`Waiting ${chat.wait}`}</p>
              </div>
            </div>
          </div>
          <div style={{ display:'flex', gap:6 }}>
            <Btn label="Transfer" variant="secondary" small onClick={()=>onToast('Transfer dialog…')} />
            <Btn label="End Chat" variant="danger" small onClick={()=>onToast('Chat ended')} />
          </div>
        </div>
        {/* Messages area */}
        <div style={{ flex:1, padding:'20px', overflowY:'auto', display:'flex', flexDirection:'column', gap:12 }}>
          {[
            { from:chat.name, body:chat.preview, time:'Now', mine:false },
            { from:'Amara Subasinghe', body:'Thank you for contacting ReadyPal support. How can I help you today?', time:'just now', mine:true },
          ].map((m,i)=>(
            <div key={i} style={{ display:'flex', gap:10, justifyContent:m.mine?'flex-end':'flex-start', alignItems:'flex-end' }}>
              {!m.mine&&<UA name={m.from} size={28} color={C.accent} />}
              <div style={{ maxWidth:'65%' }}>
                <div style={{ padding:'10px 14px', borderRadius:m.mine?'12px 12px 0 12px':'12px 12px 12px 0', background:m.mine?`${C.primary}12`:'#F2F4F5', border:`1px solid ${m.mine?C.primary+'25':C.border}` }}>
                  <p style={{ fontSize:12, color:C.type, lineHeight:1.6 }}>{m.body}</p>
                </div>
                <p style={{ fontSize:9, color:C.muted, marginTop:3, textAlign:m.mine?'right' as const:'left' as const }}>{m.from} · {m.time}</p>
              </div>
              {m.mine&&<UA name={m.from} size={28} color={C.primary} />}
            </div>
          ))}
          {/* Typing indicator */}
          <div style={{ display:'flex', gap:10, alignItems:'flex-end' }}>
            <UA name={chat.name} size={28} color={C.accent} />
            <div style={{ padding:'10px 14px', borderRadius:'12px 12px 12px 0', background:'#F2F4F5', border:`1px solid ${C.border}`, display:'flex', gap:4, alignItems:'center' }}>
              {[0,1,2].map(j=>(
                <div key={j} style={{ width:6, height:6, borderRadius:'50%', background:C.muted, animation:`pulse-dot ${0.8+j*0.15}s ease-in-out infinite` }}/>
              ))}
            </div>
          </div>
        </div>
        {/* Input */}
        <div style={{ padding:'14px 20px', borderTop:`1px solid ${C.border}` }}>
          {showCanned&&(
            <div style={{ marginBottom:10, padding:'10px', borderRadius:10, border:`1px solid ${C.border}`, background:'#FAFAFA' }}>
              <p style={{ fontSize:9, fontWeight:700, color:C.muted, marginBottom:6, textTransform:'uppercase' as const, letterSpacing:'0.06em' }}>Canned Responses</p>
              {CANNED.map((c,i)=>(
                <div key={i} onClick={()=>{ setMsg(c); setShowCanned(false) }}
                  style={{ padding:'6px 8px', borderRadius:6, cursor:'pointer', fontSize:11, color:C.sub, lineHeight:1.5 }}
                  onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background=`${C.primary}08`}
                  onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}>
                  {c.slice(0,60)}…
                </div>
              ))}
            </div>
          )}
          <div style={{ display:'flex', gap:10, alignItems:'flex-end' }}>
            <div style={{ flex:1, padding:'8px 12px', borderRadius:10, border:`1.5px solid ${C.border}`, background:'#FAFAFA' }}>
              <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Type a message…" rows={2}
                style={{ width:'100%', border:'none', background:'transparent', fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, outline:'none', resize:'none' }} />
              <div style={{ display:'flex', gap:6, marginTop:4 }}>
                <button onClick={()=>setShowCanned(v=>!v)} style={{ background:'none', border:`1px solid ${C.border}`, borderRadius:6, cursor:'pointer', fontSize:9, fontWeight:700, color:C.muted, padding:'2px 6px', fontFamily:'Manrope,sans-serif' }}>Canned</button>
                <button style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, display:'flex' }}>{I.attach}</button>
              </div>
            </div>
            <Btn label="Send" icon={I.send} onClick={()=>{ if(msg.trim()){ onToast('Message sent'); setMsg('') }}} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── CRM Profile ─────────────────────────────────────────────────────────────
function CRMProfile({ onToast }:{ onToast:(m:string)=>void }) {
  const timeline = [
    { l:'Ticket SUP-2026-00481 opened',       d:'Booking assistance — Agent late arrival',   time:'22 Jan 09:15', c:C.error   },
    { l:'Booking RP-2026-000184 completed',   d:'Hospital Appointment · LKR 8,500',          time:'21 Jan 16:40', c:C.success },
    { l:'Review submitted',                   d:'5 stars · "Excellent service from Kasun"',  time:'21 Jan 17:10', c:C.accent  },
    { l:'Payment received',                   d:'LKR 8,500 via card — TXN-2026-001847',      time:'21 Jan 10:45', c:C.primary },
    { l:'Booking RP-2026-000179 refunded',    d:'LKR 8,500 — Service not delivered',         time:'20 Jan 14:30', c:C.warning },
    { l:'Account registered',                 d:'Client profile created — Colombo',          time:'Mar 2025',     c:C.info    },
  ]
  return (
    <div style={{ maxWidth:900, margin:'0 auto', padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:20 }}>CRM Profile</h2>
      <Card style={{ padding:24, marginBottom:14, background:`linear-gradient(135deg,${C.primary}06,${C.accent}03)`, border:`1.5px solid ${C.primary}20` }}>
        <div style={{ display:'flex', gap:18, alignItems:'flex-start', flexWrap:'wrap' as const }}>
          <UA name="Mohamed Ihsan" size={64} color={C.accent} />
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:6 }}>
              <h3 style={{ fontSize:18, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Mohamed Ihsan</h3>
              <Bdg label="Client" color={C.info} />
              <Bdg label="Verified" color={C.success} dot />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginTop:10 }}>
              {[{l:'Phone',v:'+94 71 234 5678'},{l:'Email',v:'m.ihsan@mail.com'},{l:'City',v:'Colombo 06'},{l:'Member Since',v:'Mar 2025'},{l:'Total Bookings',v:'8'},{l:'Lifetime Value',v:'LKR 68,000'},{l:'Risk Score',v:'Low (8/100)'},{l:'Support Tickets',v:'3 total'}].map((r,i)=>(
                <div key={i}>
                  <p style={{ fontSize:9, color:C.muted }}>{r.l}</p>
                  <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{r.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }} className="sup-2col">
        <Card style={{ padding:22 }}>
          <SectionTitle title="Recent Bookings" />
          {[{id:'RP-2026-000184',s:'Hospital Appointment',d:'22 Jan 2026',v:'LKR 8,500',st:'inprogress'},{id:'RP-2026-000179',s:'Hospital Appointment',d:'19 Jan 2026',v:'LKR 8,500',st:'refunded'},{id:'RP-2026-000162',s:'Dementia Care',d:'10 Jan 2026',v:'LKR 12,000',st:'completed'}].map((b,i)=>(
            <div key={i} style={{ display:'flex', gap:10, padding:'9px 0', borderBottom:i<2?`1px solid ${C.border}`:'none' }}>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:11, fontWeight:700, color:C.primary }}>{b.id}</p>
                <p style={{ fontSize:10, color:C.muted }}>{b.s} · {b.d}</p>
              </div>
              <div style={{ textAlign:'right' as const }}>
                <p style={{ fontSize:11, fontWeight:700, color:C.type }}>{b.v}</p>
                <Bdg label={b.st} color={b.st==='completed'?C.success:b.st==='refunded'?C.info:C.primary} />
              </div>
            </div>
          ))}
        </Card>
        <Card style={{ padding:22 }}>
          <SectionTitle title="Support History" />
          {TICKETS.filter(t=>t.client==='Mohamed Ihsan').concat(TICKETS.slice(4)).slice(0,3).map((t,i)=>(
            <div key={i} style={{ display:'flex', gap:10, padding:'9px 0', borderBottom:i<2?`1px solid ${C.border}`:'none' }}>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:11, fontWeight:700, color:C.primary }}>{t.id}</p>
                <p style={{ fontSize:10, color:C.muted, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as const }}>{t.subject}</p>
              </div>
              <TSBdg status={t.status} />
            </div>
          ))}
        </Card>
      </div>
      {/* Communication timeline */}
      <Card style={{ padding:22 }}>
        <SectionTitle title="Communication Timeline" />
        <div style={{ position:'relative' as const, paddingLeft:28 }}>
          <div style={{ position:'absolute', left:7, top:0, bottom:0, width:2, background:C.border }}/>
          {timeline.map((ev,i)=>(
            <div key={i} style={{ position:'relative' as const, marginBottom:i<timeline.length-1?16:0 }}>
              <div style={{ position:'absolute', left:-21, width:16, height:16, borderRadius:'50%', background:ev.c, top:2, border:`2px solid ${C.surface}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <div style={{ width:5, height:5, borderRadius:'50%', background:'white' }}/>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div>
                  <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{ev.l}</p>
                  <p style={{ fontSize:11, color:C.muted }}>{ev.d}</p>
                </div>
                <p style={{ fontSize:9, color:C.muted, flexShrink:0, marginLeft:12 }}>{ev.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Complaint Management ─────────────────────────────────────────────────────
function ComplaintManagement({ onToast }:{ onToast:(m:string)=>void }) {
  const sc = (s:string) => s==='high'?C.error:s==='medium'?C.warning:C.muted
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Complaint Management</h2>
        <Bdg label={`${COMPLAINTS.filter(c=>c.status==='open').length} open`} color={C.error} dot />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }} className="sup-4col">
        {[{l:'Open Complaints',v:'2',c:C.error},{l:'Under Investigation',v:'1',c:C.warning},{l:'Resolved This Month',v:'8',c:C.success},{l:'Avg Resolution Time',v:'3.2 days',c:C.primary}].map((s,i)=>(
          <Card key={i} style={{ padding:16, textAlign:'center' as const }}>
            <p style={{ fontSize:24, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{s.v}</p>
            <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      {COMPLAINTS.map((cmp,i)=>(
        <Card key={i} hover style={{ padding:22, marginBottom:10, border:`1.5px solid ${sc(cmp.severity)}20` }}>
          <div style={{ display:'flex', gap:14, alignItems:'flex-start', flexWrap:'wrap' as const }}>
            <div style={{ flex:1, minWidth:180 }}>
              <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                <p style={{ fontSize:13, fontWeight:700, color:C.primary }}>{cmp.id}</p>
                <Bdg label={cmp.severity.toUpperCase()} color={sc(cmp.severity)} />
                <Bdg label={cmp.status==='open'?'Open':'Resolved'} color={cmp.status==='open'?C.error:C.success} dot />
              </div>
              <p style={{ fontSize:12, color:C.type, marginBottom:3 }}>Category: <strong>{cmp.cat}</strong></p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginTop:8 }}>
                {[{l:'Booking',v:cmp.booking},{l:'Raised By',v:cmp.client},{l:'Officer',v:cmp.officer},{l:'Raised',v:cmp.raised}].map((r,j)=>(
                  <div key={j}>
                    <p style={{ fontSize:9, color:C.muted }}>{r.l}</p>
                    <p style={{ fontSize:11, fontWeight:600, color:C.type }}>{r.v}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              <Btn label="Investigate" variant="primary" small icon={I.eye} onClick={()=>onToast(`Opening ${cmp.id}`)} />
              {cmp.status==='open'&&<Btn label="Resolve" variant="success" small icon={I.check} onClick={()=>onToast('Complaint resolved')} />}
              <Btn label="Escalate" variant="danger" small icon={I.escalate} onClick={()=>onToast('Escalated to manager')} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Escalation Center ────────────────────────────────────────────────────────
function EscalationCenter({ onToast }:{ onToast:(m:string)=>void }) {
  const stages = [
    {l:'Level 1',          n:18, c:C.info,    desc:'Front-line support' },
    {l:'Level 2',          n:8,  c:C.warning, desc:'Senior support'    },
    {l:'Supervisor',       n:4,  c:'#F97316', desc:'Team lead'         },
    {l:'Ops Manager',      n:2,  c:C.error,   desc:'Operations Manager'},
    {l:'Exec Review',      n:1,  c:'#DC2626', desc:'Executive'         },
    {l:'Resolved',         n:142,c:C.success, desc:'Closed'            },
  ]
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>Escalation Center</h2>
      <Card style={{ padding:24, marginBottom:16 }}>
        <SectionTitle title="Escalation Funnel" />
        <div style={{ display:'flex', gap:12, alignItems:'flex-end', height:120, marginBottom:10 }}>
          {stages.map((s,i)=>{
            const maxN=142; const h=Math.max(14,(s.n/maxN)*100)
            return (
              <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                <p style={{ fontSize:11, fontWeight:700, color:s.c }}>{s.n}</p>
                <div style={{ width:'100%', height:h, borderRadius:'6px 6px 0 0', background:`${s.c}20`, border:`1.5px solid ${s.c}40` }}/>
              </div>
            )
          })}
        </div>
        <div style={{ display:'flex', gap:12 }}>
          {stages.map((s,i)=>(
            <div key={i} style={{ flex:1, textAlign:'center' as const }}>
              <p style={{ fontSize:9, color:C.muted, lineHeight:1.3 }}>{s.l}</p>
            </div>
          ))}
        </div>
      </Card>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }} className="sup-3col">
        {stages.slice(0,5).map((s,i)=>(
          <Card key={i} hover style={{ padding:18 }} onClick={()=>onToast(`Viewing ${s.l} escalations`)}>
            <p style={{ fontSize:10, color:C.muted, marginBottom:6 }}>{s.l}</p>
            <p style={{ fontSize:28, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:3 }}>{s.n}</p>
            <p style={{ fontSize:10, color:C.muted }}>{s.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Communication Hub ────────────────────────────────────────────────────────
function CommunicationHub({ onNav, onToast }:{ onNav:(s:SubView)=>void; onToast:(m:string)=>void }) {
  const channels = [
    {l:'Email',        sent:284, scheduled:12, c:C.primary },
    {l:'SMS',          sent:142, scheduled:4,  c:C.accent  },
    {l:'Push Notifications',sent:841, scheduled:8, c:C.success},
    {l:'In-App',       sent:1248,scheduled:24, c:C.info    },
    {l:'Broadcasts',   sent:18,  scheduled:2,  c:'#8B5CF6' },
  ]
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Communication Hub</h2>
        <div style={{ display:'flex', gap:8 }}>
          <Btn label="New Broadcast" variant="primary" small icon={I.broadcast} onClick={()=>onNav('broadcast')} />
          <Btn label="Templates" variant="secondary" small icon={I.template} onClick={()=>onNav('templates')} />
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10, marginBottom:18 }} className="sup-5col">
        {channels.map((ch,i)=>(
          <Card key={i} hover style={{ padding:18, textAlign:'center' as const }}>
            <p style={{ fontSize:22, fontWeight:900, color:ch.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{ch.sent.toLocaleString()}</p>
            <p style={{ fontSize:11, fontWeight:700, color:C.type, marginBottom:2 }}>{ch.l}</p>
            <p style={{ fontSize:9, color:C.muted }}>{ch.scheduled} scheduled</p>
          </Card>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="sup-2col">
        {/* Scheduled messages */}
        <Card style={{ padding:22 }}>
          <SectionTitle title="Scheduled Messages" />
          {[{title:'Maintenance Reminder',channel:'Push',time:'25 Jan 01:00',audience:'All Users'},{title:'Agent Renewal Reminder',channel:'Email',time:'26 Jan 09:00',audience:'Agents'},{title:'Monthly Newsletter',channel:'Email',time:'01 Feb 08:00',audience:'Clients'}].map((m,i)=>(
            <div key={i} style={{ display:'flex', gap:10, padding:'10px 0', borderBottom:i<2?`1px solid ${C.border}`:'none', alignItems:'center' }}>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:11, fontWeight:700, color:C.type }}>{m.title}</p>
                <p style={{ fontSize:10, color:C.muted }}>{m.channel} · {m.audience} · {m.time}</p>
              </div>
              <Bdg label="Scheduled" color={C.primary} />
              <button onClick={()=>onToast('Message cancelled')} style={{ background:'none', border:'none', cursor:'pointer', color:C.error, display:'flex', padding:3 }}>{I.alert}</button>
            </div>
          ))}
        </Card>
        {/* Recent activity */}
        <Card style={{ padding:22 }}>
          <SectionTitle title="Recent Sends" />
          {[{title:'Booking Confirmation',sent:'284 sent',open:'68%',c:C.success},{title:'Appointment Reminder',sent:'142 sent',open:'82%',c:C.success},{title:'Refund Update',sent:'18 sent',open:'94%',c:C.primary},{title:'Verification Update',sent:'34 sent',open:'76%',c:C.info}].map((m,i)=>(
            <div key={i} style={{ display:'flex', gap:10, padding:'10px 0', borderBottom:i<3?`1px solid ${C.border}`:'none', alignItems:'center' }}>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:11, fontWeight:700, color:C.type }}>{m.title}</p>
                <p style={{ fontSize:10, color:C.muted }}>{m.sent}</p>
              </div>
              <div style={{ textAlign:'right' as const }}>
                <p style={{ fontSize:10, color:C.muted }}>Open rate</p>
                <p style={{ fontSize:12, fontWeight:700, color:m.c }}>{m.open}</p>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

// ─── Announcements ────────────────────────────────────────────────────────────
function AnnouncementsView({ onToast }:{ onToast:(m:string)=>void }) {
  const sc = (p:string) => p==='high'?C.error:p==='medium'?C.warning:C.muted
  const ss = (s:string) => s==='published'?C.success:s==='scheduled'?C.primary:C.muted
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Announcements</h2>
        <Btn label="New Announcement" variant="primary" small icon={I.plus} onClick={()=>onToast('Opening announcement form…')} />
      </div>
      {ANNOUNCEMENTS_DATA.map((a,i)=>(
        <Card key={i} hover style={{ padding:22, marginBottom:10 }}>
          <div style={{ display:'flex', gap:14, alignItems:'flex-start', flexWrap:'wrap' as const }}>
            <div style={{ width:44, height:44, borderRadius:14, background:`${sc(a.priority)}10`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ display:'flex', color:sc(a.priority), transform:'scale(1.2)' }}>{I.announce}</span>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:5 }}>
                <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{a.title}</p>
                <Bdg label={a.priority.toUpperCase()} color={sc(a.priority)} />
                <Bdg label={a.status.charAt(0).toUpperCase()+a.status.slice(1)} color={ss(a.status)} dot />
              </div>
              <div style={{ display:'flex', gap:12 }}>
                {[{l:'Audience',v:a.audience},{l:'Published',v:a.published},{l:'Expires',v:a.expires}].map((r,j)=>(
                  <div key={j}>
                    <p style={{ fontSize:9, color:C.muted }}>{r.l}</p>
                    <p style={{ fontSize:10, fontWeight:600, color:C.type }}>{r.v}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display:'flex', gap:6 }}>
              {a.status==='scheduled'&&<Btn label="Edit" variant="secondary" small icon={I.edit} onClick={()=>onToast('Editing…')} />}
              {a.status==='scheduled'&&<Btn label="Publish Now" variant="success" small onClick={()=>onToast('Published!')} />}
              {a.status!=='expired'&&<Btn label="Preview" variant="ghost" small icon={I.eye} onClick={()=>onToast('Previewing…')} />}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Knowledge Base ───────────────────────────────────────────────────────────
function KnowledgeBase({ onToast }:{ onToast:(m:string)=>void }) {
  const [q, setQ] = useState('')
  const filtered = KB_ARTICLES.filter(a => a.title.toLowerCase().includes(q.toLowerCase()))
  const cats = [...new Set(KB_ARTICLES.map(a=>a.cat))]
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Knowledge Base</h2>
        <Btn label="New Article" variant="primary" small icon={I.plus} onClick={()=>onToast('Opening article editor…')} />
      </div>
      <div style={{ display:'flex', gap:8, padding:'9px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, background:C.surface, marginBottom:18, alignItems:'center' }}>
        <span style={{ display:'flex', color:C.muted }}>{I.search}</span>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search knowledge base…" style={{ border:'none', background:'transparent', fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, outline:'none', flex:1 }} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', gap:14 }} className="sup-kb-wrap">
        {/* Categories */}
        <Card style={{ padding:18, height:'fit-content' }}>
          <SectionTitle title="Categories" />
          {cats.map((cat,i)=>(
            <div key={i}
              onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background=`${C.primary}06`}
              onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}
              style={{ display:'flex', justifyContent:'space-between', padding:'8px 10px', borderRadius:8, cursor:'pointer', transition:'background 0.12s' }}>
              <p style={{ fontSize:12, color:C.type }}>{cat}</p>
              <p style={{ fontSize:11, fontWeight:700, color:C.primary }}>{KB_ARTICLES.filter(a=>a.cat===cat).length}</p>
            </div>
          ))}
        </Card>
        {/* Articles */}
        <Card style={{ overflow:'hidden' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 100px 80px 80px 100px', padding:'10px 18px', background:'#FAFAFA', borderBottom:`1px solid ${C.border}` }}>
            {['Article','Category','Views','Status','Actions'].map((h,i)=>(
              <p key={i} style={{ fontSize:9, fontWeight:800, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.06em' }}>{h}</p>
            ))}
          </div>
          {filtered.map((a,i)=>(
            <div key={i}
              onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='#FAFBFB'}
              onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}
              style={{ display:'grid', gridTemplateColumns:'1fr 100px 80px 80px 100px', padding:'11px 18px', borderBottom:i<filtered.length-1?`1px solid ${C.border}`:'none', transition:'background 0.12s' }}>
              <p style={{ fontSize:12, fontWeight:600, color:C.type }}>{a.title}</p>
              <Bdg label={a.cat} color={C.info} />
              <p style={{ fontSize:11, color:C.muted, display:'flex', alignItems:'center' }}>{a.views>0?a.views.toLocaleString():'—'}</p>
              <div style={{ display:'flex', alignItems:'center' }}><Bdg label={a.status} color={a.status==='published'?C.success:C.muted} dot /></div>
              <div style={{ display:'flex', gap:4, alignItems:'center' }}>
                <button onClick={()=>onToast(`Editing ${a.title}`)} style={{ background:'none', border:'none', cursor:'pointer', color:C.primary, display:'flex', padding:3 }}>{I.edit}</button>
                <button onClick={()=>onToast('Viewing article')} style={{ background:'none', border:'none', cursor:'pointer', color:C.success, display:'flex', padding:3 }}>{I.eye}</button>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

// ─── SLA Monitoring ───────────────────────────────────────────────────────────
function SLAMonitoring() {
  const slaData = [94,96,93,97,95,98,94]
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  const maxS = Math.max(...slaData)
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>SLA Monitoring</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }} className="sup-4col">
        {[{l:'First Response Time',v:'6 min',c:C.success,sub:'Target < 15 min'},{l:'Resolution Time',v:'4.2 hrs',c:C.success,sub:'Target < 8 hrs'},{l:'Overdue Tickets',v:'2',c:C.error,sub:'Needs action'},{l:'SLA Compliance',v:'94.2%',c:C.warning,sub:'Target > 95%'}].map((s,i)=>(
          <Card key={i} style={{ padding:18, textAlign:'center' as const }}>
            <p style={{ fontSize:24, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{s.v}</p>
            <p style={{ fontSize:11, fontWeight:700, color:C.type, marginBottom:2 }}>{s.l}</p>
            <p style={{ fontSize:9, color:C.muted }}>{s.sub}</p>
          </Card>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="sup-2col">
        <Card style={{ padding:22 }}>
          <SectionTitle title="Compliance Trend (7 days)" />
          <svg width="100%" height="120" viewBox="0 0 280 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="supSlaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.primary} stopOpacity="0.15"/>
                <stop offset="100%" stopColor={C.primary} stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d={`M${slaData.map((v,i)=>`${i*(280/6)},${110-((v/maxS)*90)}`).join('L')} L280,110 L0,110 Z`} fill="url(#supSlaGrad)"/>
            <polyline points={slaData.map((v,i)=>`${i*(280/6)},${110-((v/maxS)*90)}`).join(' ')} fill="none" stroke={C.primary} strokeWidth="2.5" strokeLinejoin="round"/>
            {slaData.map((v,i)=>(
              <circle key={i} cx={i*(280/6)} cy={110-((v/maxS)*90)} r="4" fill={C.surface} stroke={C.primary} strokeWidth="2"/>
            ))}
          </svg>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:4 }}>
            {days.map(d=><p key={d} style={{ fontSize:9, color:C.muted }}>{d}</p>)}
          </div>
        </Card>
        <Card style={{ padding:22 }}>
          <SectionTitle title="SLA Breaches" />
          {TICKETS.filter(t=>t.sla==='breach').map((t,i)=>(
            <div key={i} style={{ display:'flex', gap:10, padding:'10px 0', borderBottom:i<1?`1px solid ${C.border}`:'none', alignItems:'center' }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:C.error, flexShrink:0, animation:'pulse-dot 1s ease-in-out infinite' }}/>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:11, fontWeight:700, color:C.primary }}>{t.id}</p>
                <p style={{ fontSize:10, color:C.muted, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as const }}>{t.subject}</p>
              </div>
              <Bdg label="SLA BREACH" color={C.error} />
            </div>
          ))}
          <div style={{ marginTop:12, padding:'10px', borderRadius:8, background:`${C.warning}08`, border:`1px solid ${C.warning}20` }}>
            <p style={{ fontSize:11, color:C.warning, fontWeight:600 }}>1 ticket at SLA warning threshold</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

// ─── Agent Performance ────────────────────────────────────────────────────────
function AgentPerformance() {
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>Support Agent Performance</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }} className="sup-4col">
        {[{l:'Total Tickets Closed',v:'193',c:C.success},{l:'Avg Resolution Time',v:'4.4 hrs',c:C.primary},{l:'Team CSAT Score',v:'4.77',c:C.success},{l:'Avg Productivity',v:'94%',c:C.primary}].map((s,i)=>(
          <Card key={i} style={{ padding:16, textAlign:'center' as const }}>
            <p style={{ fontSize:22, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{s.v}</p>
            <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      {AGENTS_PERF.map((a,i)=>(
        <Card key={i} style={{ padding:24, marginBottom:12 }}>
          <div style={{ display:'flex', gap:16, alignItems:'center', flexWrap:'wrap' as const }}>
            <UA name={a.name} size={52} color={C.primary} />
            <div style={{ flex:1, minWidth:140 }}>
              <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>{a.name}</p>
              <div style={{ display:'flex', gap:5, flexWrap:'wrap' as const }}>
                <Bdg label="Support Agent" color={C.info} />
                <Bdg label={`Score ${a.score}`} color={a.score>=95?C.success:a.score>=85?C.warning:C.error} />
              </div>
            </div>
            {[{l:'Tickets',v:a.tickets.toString()},{l:'Resolved',v:a.resolved.toString()},{l:'Avg Time',v:a.avgTime},{l:'CSAT',v:a.csat.toFixed(1)}].map((s,j)=>(
              <div key={j} style={{ textAlign:'center' as const, minWidth:64 }}>
                <p style={{ fontSize:9, color:C.muted, marginBottom:3 }}>{s.l}</p>
                <p style={{ fontSize:16, fontWeight:900, color:j===3?C.success:C.type, fontFamily:'Manrope,sans-serif' }}>{s.v}</p>
              </div>
            ))}
            <div style={{ minWidth:120 }}>
              <p style={{ fontSize:9, color:C.muted, marginBottom:5 }}>Workload {a.workload}%</p>
              <div style={{ height:6, borderRadius:99, background:`${C.primary}12` }}>
                <div style={{ width:`${a.workload}%`, height:'100%', background:a.workload>80?C.error:a.workload>60?C.warning:C.primary, borderRadius:99 }}/>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Customer Feedback ────────────────────────────────────────────────────────
function CustomerFeedback() {
  const ratings = [
    { score:5, count:284, pct:72 },
    { score:4, count:68,  pct:17 },
    { score:3, count:28,  pct:7  },
    { score:2, count:12,  pct:3  },
    { score:1, count:4,   pct:1  },
  ]
  const comments = [
    { name:'Priya Fernando',  score:5, text:'Amara was incredibly helpful and resolved my issue within minutes. Excellent support!', time:'22 Jan 2026' },
    { name:'Sampath J.',      score:4, text:'Good service overall. Response time was fast but issue took a day to fully resolve.', time:'21 Jan 2026' },
    { name:'Chamara K.',      score:2, text:'Waited too long for a response. The issue is still not fully resolved after 3 days.', time:'20 Jan 2026' },
  ]
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>Customer Feedback</h2>
      <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap:16, marginBottom:16 }} className="sup-2col">
        <Card style={{ padding:24, textAlign:'center' as const }}>
          <p style={{ fontSize:52, fontWeight:900, color:C.success, fontFamily:'Manrope,sans-serif', lineHeight:1 }}>4.8</p>
          <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:4 }}>CSAT Score</p>
          <p style={{ fontSize:11, color:C.muted, marginBottom:18 }}>396 ratings this month</p>
          <Bdg label="NPS Score — Integration Pending" color={C.muted} />
        </Card>
        <Card style={{ padding:22 }}>
          <SectionTitle title="Rating Distribution" />
          {ratings.map((r,i)=>(
            <div key={i} style={{ display:'flex', gap:10, alignItems:'center', marginBottom:10 }}>
              <p style={{ fontSize:11, fontWeight:700, color:C.type, width:12 }}>{r.score}</p>
              <div style={{ flex:1, height:10, borderRadius:99, background:`${C.success}10`, overflow:'hidden' }}>
                <div style={{ width:`${r.pct}%`, height:'100%', background:r.score>=4?C.success:r.score===3?C.warning:C.error, borderRadius:99 }}/>
              </div>
              <p style={{ fontSize:10, fontWeight:700, color:C.muted, width:30, textAlign:'right' as const }}>{r.pct}%</p>
              <p style={{ fontSize:10, color:C.muted, width:30 }}>{r.count}</p>
            </div>
          ))}
        </Card>
      </div>
      <Card style={{ padding:22 }}>
        <SectionTitle title="Recent Comments" />
        {comments.map((c,i)=>(
          <div key={i} style={{ padding:'14px 0', borderBottom:i<comments.length-1?`1px solid ${C.border}`:'none' }}>
            <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:6 }}>
              <UA name={c.name} size={32} color={C.primary} />
              <div style={{ flex:1 }}>
                <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{c.name}</p>
                <p style={{ fontSize:10, color:C.muted }}>{c.time}</p>
              </div>
              <div style={{ display:'flex', gap:2 }}>
                {[1,2,3,4,5].map(s=>(
                  <div key={s} style={{ width:10, height:10, borderRadius:2, background:s<=c.score?C.warning:C.border }}/>
                ))}
              </div>
            </div>
            <p style={{ fontSize:12, color:C.sub, lineHeight:1.6, marginLeft:42 }}>{c.text}</p>
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── Automation Center ────────────────────────────────────────────────────────
function AutomationCenter({ onToast }:{ onToast:(m:string)=>void }) {
  const rules = [
    { name:'Auto-assign urgent tickets',    type:'Routing',   trigger:'Priority = Urgent',     action:'Assign to senior agent',    status:'active' },
    { name:'SLA breach escalation',         type:'Escalation',trigger:'SLA breached',           action:'Notify supervisor + escalate',status:'active' },
    { name:'Inactive ticket close',         type:'Macro',     trigger:'No reply for 7 days',    action:'Close ticket + send email', status:'active' },
    { name:'Night-time auto reply',         type:'Auto Reply', trigger:'Outside business hours', action:'Send canned response',      status:'active' },
    { name:'5-star CSAT trigger',           type:'Trigger',   trigger:'Rating = 5',             action:'Send thank you email',      status:'draft'  },
  ]
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Automation Center</h2>
        <Btn label="New Rule" variant="primary" small icon={I.plus} onClick={()=>onToast('Opening rule builder…')} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }} className="sup-4col">
        {[{l:'Active Rules',v:'4',c:C.success},{l:'Triggers Fired Today',v:'128',c:C.primary},{l:'Auto-Resolved',v:'22',c:C.success},{l:'Draft Rules',v:'1',c:C.muted}].map((s,i)=>(
          <Card key={i} style={{ padding:16, textAlign:'center' as const }}>
            <p style={{ fontSize:24, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{s.v}</p>
            <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      {rules.map((r,i)=>(
        <Card key={i} hover style={{ padding:20, marginBottom:8 }}>
          <div style={{ display:'flex', gap:14, alignItems:'center', flexWrap:'wrap' as const }}>
            <div style={{ width:40, height:40, borderRadius:12, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ display:'flex', color:C.primary, transform:'scale(1.1)' }}>{I.auto}</span>
            </div>
            <div style={{ flex:1, minWidth:120 }}>
              <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{r.name}</p>
                <Bdg label={r.type} color={C.info} />
                <Bdg label={r.status} color={r.status==='active'?C.success:C.muted} dot />
              </div>
              <p style={{ fontSize:11, color:C.muted }}>When: <strong style={{color:C.sub}}>{r.trigger}</strong> → Then: <strong style={{color:C.sub}}>{r.action}</strong></p>
            </div>
            <div style={{ display:'flex', gap:6 }}>
              <Btn label="Edit" variant="ghost" small icon={I.edit} onClick={()=>onToast(`Editing ${r.name}`)} />
              {r.status==='active'&&<Btn label="Pause" variant="warning" small onClick={()=>onToast('Rule paused')} />}
              {r.status==='draft'&&<Btn label="Activate" variant="success" small onClick={()=>onToast('Rule activated!')} />}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Message Templates ────────────────────────────────────────────────────────
function MessageTemplates({ onToast }:{ onToast:(m:string)=>void }) {
  const cc = (ch:string) => ch==='Email'?C.primary:ch==='SMS'?C.accent:ch==='Push'?C.success:C.info
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Message Templates</h2>
        <Btn label="New Template" variant="primary" small icon={I.plus} onClick={()=>onToast('Opening template editor…')} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        {TEMPLATES.map((t,i)=>(
          <Card key={i} hover style={{ padding:22 }}>
            <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
              <div style={{ width:40, height:40, borderRadius:12, background:`${cc(t.channel)}10`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ display:'flex', color:cc(t.channel), transform:'scale(1.1)' }}>{I.template}</span>
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:5 }}>{t.name}</p>
                <div style={{ display:'flex', gap:6, marginBottom:10 }}>
                  <Bdg label={t.channel} color={cc(t.channel)} />
                  <Bdg label={t.audience} color={C.sub} />
                  <Bdg label={t.status} color={t.status==='active'?C.success:C.muted} dot />
                </div>
                <div style={{ display:'flex', gap:6 }}>
                  <Btn label="Edit" variant="ghost" small icon={I.edit} onClick={()=>onToast(`Editing ${t.name}`)} />
                  <Btn label="Preview" variant="secondary" small icon={I.eye} onClick={()=>onToast(`Previewing ${t.name}`)} />
                  <Btn label="Use" variant="primary" small onClick={()=>onToast('Template selected')} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Broadcast Center ─────────────────────────────────────────────────────────
function BroadcastCenter({ onToast }:{ onToast:(m:string)=>void }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [audience, setAudience] = useState('all')
  const [channel, setChannel] = useState('push')
  return (
    <div style={{ maxWidth:760, margin:'0 auto', padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:20 }}>Broadcast Center</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="sup-2col">
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <Card style={{ padding:22 }}>
            <SectionTitle title="Compose Message" />
            <div style={{ marginBottom:10 }}>
              <p style={{ fontSize:10, color:C.muted, marginBottom:5 }}>Title</p>
              <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Announcement title…"
                style={{ width:'100%', padding:'9px 12px', borderRadius:9, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, background:'#FAFAFA', outline:'none', boxSizing:'border-box' as const }} />
            </div>
            <div style={{ marginBottom:14 }}>
              <p style={{ fontSize:10, color:C.muted, marginBottom:5 }}>Message</p>
              <textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="Write your broadcast message…" rows={4}
                style={{ width:'100%', padding:'9px 12px', borderRadius:9, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, background:'#FAFAFA', outline:'none', resize:'none', boxSizing:'border-box' as const }} />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <div>
                <p style={{ fontSize:10, color:C.muted, marginBottom:5 }}>Audience</p>
                <div style={{ display:'flex', gap:5, flexWrap:'wrap' as const }}>
                  {['all','clients','agents','admins'].map(a=>(
                    <button key={a} onClick={()=>setAudience(a)}
                      style={{ padding:'5px 10px', borderRadius:7, border:`1.5px solid ${audience===a?C.primary:C.border}`, background:audience===a?`${C.primary}08`:'transparent', cursor:'pointer', fontSize:10, fontWeight:700, color:audience===a?C.primary:C.muted, fontFamily:'Manrope,sans-serif' }}>
                      {a.charAt(0).toUpperCase()+a.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontSize:10, color:C.muted, marginBottom:5 }}>Channel</p>
                <div style={{ display:'flex', gap:5, flexWrap:'wrap' as const }}>
                  {['push','email','sms'].map(ch=>(
                    <button key={ch} onClick={()=>setChannel(ch)}
                      style={{ padding:'5px 10px', borderRadius:7, border:`1.5px solid ${channel===ch?C.primary:C.border}`, background:channel===ch?`${C.primary}08`:'transparent', cursor:'pointer', fontSize:10, fontWeight:700, color:channel===ch?C.primary:C.muted, fontFamily:'Manrope,sans-serif' }}>
                      {ch.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
          <div style={{ display:'flex', gap:8 }}>
            <Btn label="Send Now" variant="primary" icon={I.send} full onClick={()=>onToast('Broadcast sent!')} />
            <Btn label="Schedule" variant="secondary" icon={I.announce} full onClick={()=>onToast('Scheduled…')} />
          </div>
        </div>
        {/* Preview */}
        <Card style={{ padding:22 }}>
          <SectionTitle title="Preview" />
          <div style={{ padding:'16px', borderRadius:12, background:C.dark, color:'white', marginBottom:12 }}>
            <p style={{ fontSize:9, color:'rgba(255,255,255,0.4)', marginBottom:4 }}>ReadyPal · {channel.toUpperCase()}</p>
            <p style={{ fontSize:13, fontWeight:700, marginBottom:4 }}>{title||'Title will appear here'}</p>
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.7)', lineHeight:1.6 }}>{body||'Message body will appear here…'}</p>
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' as const }}>
            <Bdg label={`Audience: ${audience}`} color={C.primary} />
            <Bdg label={`Channel: ${channel.toUpperCase()}`} color={C.accent} />
          </div>
          <div style={{ marginTop:14, padding:'12px', borderRadius:10, background:`${C.primary}06`, border:`1px solid ${C.primary}15` }}>
            <p style={{ fontSize:10, color:C.sub }}>Estimated reach: <strong style={{color:C.type}}>{audience==='all'?'2,842':audience==='clients'?'1,948':audience==='agents'?'847':'47'} users</strong></p>
          </div>
        </Card>
      </div>
    </div>
  )
}

// ─── Live Customer Activity ───────────────────────────────────────────────────
function LiveActivity() {
  const events = [
    { type:'New Registration', user:'Chamari Wickramasinghe',  detail:'Colombo — Client account',          time:'2 min ago',  c:C.success },
    { type:'Booking Made',     user:'Mohamed Ihsan',            detail:'Hospital Appointment · LKR 8,500',  time:'4 min ago',  c:C.primary },
    { type:'Support Request',  user:'Priya Fernando',           detail:'CHT-004 · Payment issue',           time:'8 min ago',  c:C.warning },
    { type:'Payment Received', user:'Sampath Jayawardena',      detail:'TXN-2026-001845 · LKR 9,800',       time:'11 min ago', c:C.success },
    { type:'Review Submitted', user:'Nirosha Jayasena',         detail:'5 stars — Kasun Perera',            time:'15 min ago', c:C.accent  },
    { type:'Message Sent',     user:'Kasun Perera',             detail:'Booking RP-2026-000184 update',     time:'18 min ago', c:C.info    },
    { type:'Support Request',  user:'Chamara Kumarasinghe',     detail:'SUP-2026-00481 reply',              time:'22 min ago', c:C.warning },
    { type:'Booking Made',     user:'Dilshan Ratnayake',        detail:'Dementia Care · LKR 12,000',        time:'30 min ago', c:C.primary },
  ]
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Live Customer Activity</h2>
        <div style={{ display:'flex', gap:6, alignItems:'center' }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:C.success, animation:'pulse-dot 1s ease-in-out infinite' }}/>
          <p style={{ fontSize:11, fontWeight:700, color:C.success }}>Live</p>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:18 }} className="sup-3col">
        {[{l:'Active Users',v:'284',c:C.success},{l:'Active Bookings',v:'47',c:C.primary},{l:'Live Chats',v:'7',c:C.info}].map((s,i)=>(
          <Card key={i} style={{ padding:16, textAlign:'center' as const }}>
            <p style={{ fontSize:26, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{s.v}</p>
            <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      <Card style={{ padding:0, overflow:'hidden' }}>
        {events.map((ev,i)=>(
          <div key={i}
            onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='#FAFBFB'}
            onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}
            style={{ display:'flex', gap:14, padding:'12px 20px', borderBottom:i<events.length-1?`1px solid ${C.border}`:'none', alignItems:'center', transition:'background 0.12s' }}>
            <div style={{ width:32, height:32, borderRadius:10, background:`${ev.c}12`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:ev.c }}/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:1 }}>
                <Bdg label={ev.type} color={ev.c} />
                <p style={{ fontSize:11, fontWeight:700, color:C.type }}>{ev.user}</p>
              </div>
              <p style={{ fontSize:11, color:C.muted }}>{ev.detail}</p>
            </div>
            <p style={{ fontSize:10, color:C.muted, flexShrink:0 }}>{ev.time}</p>
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── Notifications ────────────────────────────────────────────────────────────
function SupportNotifications() {
  const items = [
    { t:'New Ticket',          b:'SUP-2026-00482 opened by Chamara Kumarasinghe — Booking cancellation.', c:C.primary, read:false },
    { t:'SLA Breach',          b:'SUP-2026-00480 has breached the 8-hour SLA threshold.',                 c:C.error,   read:false },
    { t:'Chat Started',        b:'Priya Fernando started a live chat — Waiting in queue.',                c:C.info,    read:false },
    { t:'Ticket Escalated',    b:'SUP-2026-00479 escalated to Operations Manager by Ranjith B.',         c:'#F97316', read:false },
    { t:'Complaint Filed',     b:'CMP-2026-00042 filed — Agent conduct complaint by Nirosha J.',         c:'#DC2626', read:false },
    { t:'Announcement Published',b:'New Cancellation Policy published to all clients.',                  c:C.success, read:true  },
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
            <div style={{ width:8, height:8, borderRadius:'50%', background:n.c, flexShrink:0, marginTop:4 }}/>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:3 }}>
                <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{n.t}</p>
                {!n.read&&<div style={{ width:6, height:6, borderRadius:'50%', background:n.c }}/>}
              </div>
              <p style={{ fontSize:11, color:C.sub, lineHeight:1.5 }}>{n.b}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Reports ─────────────────────────────────────────────────────────────────
function SupportReports({ onToast }:{ onToast:(m:string)=>void }) {
  const reports = [
    {t:'Support Report',           d:'All ticket metrics, resolution times — Jan 2026'  },
    {t:'Ticket Trends',            d:'Volume, categories, priority breakdown — Jan 2026' },
    {t:'Agent Performance Report', d:'Individual agent metrics — Jan 2026'              },
    {t:'Complaint Report',         d:'All complaints filed and resolution status'       },
    {t:'Communication Analytics',  d:'Email, SMS, push open and click rates'            },
    {t:'Knowledge Base Usage',     d:'Article views, searches, top topics — Jan 2026'  },
  ]
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>Reports</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        {reports.map((r,i)=>(
          <Card key={i} hover style={{ padding:22 }}>
            <div style={{ display:'flex', gap:14 }}>
              <div style={{ width:44, height:44, borderRadius:14, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ display:'flex', color:C.primary, transform:'scale(1.2)' }}>{I.report}</span>
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:3 }}>{r.t}</p>
                <p style={{ fontSize:11, color:C.muted, lineHeight:1.5, marginBottom:10 }}>{r.d}</p>
                <div style={{ display:'flex', gap:6 }}>
                  <Btn label="View" variant="ghost" small icon={I.eye} onClick={()=>onToast(`Opening ${r.t}…`)} />
                  <Btn label="Export PDF" variant="secondary" small icon={I.export} onClick={()=>onToast('Exporting…')} />
                  <Btn label="Export Excel" variant="secondary" small icon={I.export} onClick={()=>onToast('Exporting…')} />
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
function StatusBadgesView() {
  return (
    <div style={{ maxWidth:700, margin:'0 auto', padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>Status Badges</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
        {Object.entries(TSTATUS).map(([k,s],i)=>(
          <Card key={i} style={{ padding:18, display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
            <div style={{ width:10, height:10, borderRadius:'50%', background:s.color }}/>
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
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:16 }}>Empty States</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        {[{t:'No Tickets',d:'No open support tickets. All customer issues resolved.'},{t:'No Active Chats',d:'No live chats in queue right now.'},{t:'No Complaints',d:'No active complaints. Platform running smoothly.'},{t:'No Announcements',d:'No active announcements published.'}].map((s,i)=>(
          <Card key={i} style={{ padding:'38px 22px', textAlign:'center' as const }}>
            <div style={{ width:48, height:48, borderRadius:16, background:`${C.primary}08`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
              <span style={{ display:'flex', color:`${C.primary}60`, transform:'scale(1.3)' }}>{I.ticket}</span>
            </div>
            <p style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:8 }}>{s.t}</p>
            <p style={{ fontSize:12, color:C.muted, lineHeight:1.7 }}>{s.d}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

function LoadingStates() {
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:16 }}>Loading States</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        {['Loading Tickets','Loading Chat','Loading CRM','Loading Reports'].map((l,i)=>(
          <Card key={i} style={{ padding:22 }}>
            <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:14 }}>{l}</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:14 }}>
              {[...Array(4)].map((_,j)=><div key={j} style={{ height:56, borderRadius:10, background:'#F2F4F5' }}/>)}
            </div>
            {[...Array(3)].map((_,j)=>(
              <div key={j} style={{ display:'flex', gap:10, padding:'9px 0', borderBottom:j<2?`1px solid ${C.border}`:'none' }}>
                <div style={{ width:34, height:34, borderRadius:'50%', background:'#E4E8EA', flexShrink:0 }}/>
                <div style={{ flex:1 }}><Shimmer h={11} w="65%"/><div style={{height:5}}/><Shimmer h={9} w="40%"/></div>
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
    <div style={{ maxWidth:580, margin:'0 auto', padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:16 }}>Error States</h2>
      {[{t:'Unable to Load Ticket',  d:'Ticket data unavailable. Check your connection.',        c:C.error},{t:'Chat Error',              d:'Live chat connection lost. Attempting to reconnect.',  c:C.warning},{t:'CRM Error',               d:'Customer data could not be loaded.',                   c:C.muted}].map((er,i)=>(
        <Card key={i} style={{ padding:20, marginBottom:12, border:`1.5px solid ${er.c}30`, background:`${er.c}04` }}>
          <div style={{ display:'flex', gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:`${er.c}12`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ display:'flex', color:er.c, transform:'scale(1.1)' }}>{I.alert}</span>
            </div>
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

function SuccessStates() {
  return (
    <div style={{ maxWidth:580, margin:'0 auto', padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:16 }}>Success States</h2>
      {[{t:'Reply Sent',                d:'Your reply to SUP-2026-00481 has been delivered.',       c:C.success},{t:'Ticket Closed',            d:'SUP-2026-00478 has been resolved and closed.',          c:C.success},{t:'Announcement Published',  d:'Maintenance notice published to all users.',             c:C.primary},{t:'Broadcast Sent',          d:'Push notification sent to 1,948 clients.',               c:C.success},{t:'Article Published',       d:'"How to cancel a booking" is now live in the knowledge base.',c:C.accent}].map((s,i)=>(
        <Card key={i} style={{ padding:18, marginBottom:10, border:`1.5px solid ${s.c}30`, background:`${s.c}04` }}>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <div style={{ width:40, height:40, borderRadius:12, background:`${s.c}12`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ display:'flex', color:s.c, transform:'scale(1.1)' }}>{I.check}</span>
            </div>
            <div>
              <p style={{ fontSize:13, fontWeight:700, color:s.c, marginBottom:2 }}>{s.t}</p>
              <p style={{ fontSize:11, color:C.sub }}>{s.d}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Sub-view type ────────────────────────────────────────────────────────────
type SubView = 'home'|'tickets'|'ticketDetail'|'chat'|'crm'|'complaints'|'escalation'|'comms'|'announcements'|'kb'|'activity'|'sla'|'agentPerf'|'feedback'|'automation'|'templates'|'broadcast'|'reports'|'notifications'|'statusBadges'|'empty'|'loading'|'error'|'success'

const NAV: { k:SubView; l:string; icon:ReactNode; group:string; badge?:number }[] = [
  { k:'home',          l:'Support Dashboard',    icon:I.home,       group:'Overview'      },
  { k:'tickets',       l:'Ticket Directory',     icon:I.ticket,     group:'Overview',    badge:6 },
  { k:'ticketDetail',  l:'Ticket Details',       icon:I.eye,        group:'Overview'      },
  { k:'chat',          l:'Live Chat Center',     icon:I.chat,       group:'Support',     badge:2 },
  { k:'crm',           l:'CRM Profile',          icon:I.crm,        group:'Support'       },
  { k:'complaints',    l:'Complaint Management', icon:I.complaint,  group:'Support',     badge:2 },
  { k:'escalation',    l:'Escalation Center',    icon:I.escalate,   group:'Support'       },
  { k:'comms',         l:'Communication Hub',    icon:I.comms,      group:'Comms'         },
  { k:'announcements', l:'Announcements',        icon:I.announce,   group:'Comms'         },
  { k:'kb',            l:'Knowledge Base',       icon:I.kb,         group:'Comms'         },
  { k:'activity',      l:'Live Activity',        icon:I.activity,   group:'Comms'         },
  { k:'sla',           l:'SLA Monitoring',       icon:I.sla,        group:'Analytics'     },
  { k:'agentPerf',     l:'Agent Performance',    icon:I.perf,       group:'Analytics'     },
  { k:'feedback',      l:'Customer Feedback',    icon:I.feedback,   group:'Analytics'     },
  { k:'automation',    l:'Automation Center',    icon:I.auto,       group:'Analytics'     },
  { k:'templates',     l:'Message Templates',    icon:I.template,   group:'Tools'         },
  { k:'broadcast',     l:'Broadcast Center',     icon:I.broadcast,  group:'Tools'         },
  { k:'reports',       l:'Reports',              icon:I.report,     group:'Dev'           },
  { k:'notifications', l:'Notifications',        icon:I.bell,       group:'Dev'           },
  { k:'statusBadges',  l:'Status Badges',        icon:I.badge,      group:'Dev'           },
  { k:'empty',         l:'Empty States',         icon:I.ticket,     group:'Dev'           },
  { k:'loading',       l:'Loading States',       icon:I.refresh,    group:'Dev'           },
  { k:'error',         l:'Error States',         icon:I.alert,      group:'Dev'           },
  { k:'success',       l:'Success States',       icon:I.check,      group:'Dev'           },
]

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function SupportCenter() {
  const [sub, setSub] = useState<SubView>('home')
  const [toast, setToast] = useState<string|null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const showToast = (m:string) => { setToast(m); setTimeout(()=>setToast(null),2800) }
  const groups = [...new Set(NAV.map(n=>n.group))]

  const isFullHeight = sub==='chat'

  const renderMain = () => {
    switch(sub) {
      case 'home':         return <SupportHome onNav={setSub} onToast={showToast} />
      case 'tickets':      return <TicketDirectory onNav={setSub} onToast={showToast} />
      case 'ticketDetail': return <TicketDetails onToast={showToast} />
      case 'chat':         return <LiveChatCenter onToast={showToast} />
      case 'crm':          return <CRMProfile onToast={showToast} />
      case 'complaints':   return <ComplaintManagement onToast={showToast} />
      case 'escalation':   return <EscalationCenter onToast={showToast} />
      case 'comms':        return <CommunicationHub onNav={setSub} onToast={showToast} />
      case 'announcements':return <AnnouncementsView onToast={showToast} />
      case 'kb':           return <KnowledgeBase onToast={showToast} />
      case 'activity':     return <LiveActivity />
      case 'sla':          return <SLAMonitoring />
      case 'agentPerf':    return <AgentPerformance />
      case 'feedback':     return <CustomerFeedback />
      case 'automation':   return <AutomationCenter onToast={showToast} />
      case 'templates':    return <MessageTemplates onToast={showToast} />
      case 'broadcast':    return <BroadcastCenter onToast={showToast} />
      case 'reports':      return <SupportReports onToast={showToast} />
      case 'notifications':return <SupportNotifications />
      case 'statusBadges': return <StatusBadgesView />
      case 'empty':        return <EmptyStates />
      case 'loading':      return <LoadingStates />
      case 'error':        return <ErrorStates onToast={showToast} />
      case 'success':      return <SuccessStates />
      default: return null
    }
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:C.bg, fontFamily:'Manrope,sans-serif' }}>
      {/* Dark sidebar */}
      <div className="sup-sidebar" style={{ width:220, background:C.dark, display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh', overflowY:'auto', flexShrink:0 }}>
        <div style={{ padding:'16px 18px 14px', borderBottom:`1px solid ${C.darkSub}` }}>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <div style={{ width:30, height:30, borderRadius:9, background:`linear-gradient(135deg,${C.info},#1D6FA8)`, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ display:'flex', color:'white', transform:'scale(0.9)' }}>{I.chat}</span>
            </div>
            <div>
              <p style={{ fontSize:13, fontWeight:900, color:'rgba(255,255,255,0.95)', fontFamily:'Manrope,sans-serif', lineHeight:1 }}>ReadyPal</p>
              <p style={{ fontSize:9, color:'rgba(255,255,255,0.4)', fontWeight:700, textTransform:'uppercase' as const, letterSpacing:'0.08em' }}>Support Center</p>
            </div>
          </div>
        </div>
        {groups.map(group=>(
          <div key={group}>
            <p style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.28)', textTransform:'uppercase' as const, letterSpacing:'0.09em', padding:'10px 18px 4px' }}>{group}</p>
            {NAV.filter(n=>n.group===group).map(n=>{
              const active = sub===n.k
              return (
                <button key={n.k} onClick={()=>{ setSub(n.k); setSidebarOpen(false) }}
                  style={{ width:'100%', display:'flex', gap:9, alignItems:'center', padding:'9px 18px', border:'none', background:active?`${C.info}22`:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:active?700:400, color:active?'rgba(255,255,255,0.95)':'rgba(255,255,255,0.5)', textAlign:'left' as const, borderLeft:active?`3px solid ${C.info}`:'3px solid transparent', transition:'all 0.12s' }}>
                  <span style={{ display:'flex', color:active?C.info:'rgba(255,255,255,0.32)', flexShrink:0 }}>{n.icon}</span>
                  <span style={{ flex:1 }}>{n.l}</span>
                  {n.badge&&n.badge>0&&(
                    <div style={{ minWidth:18, height:18, borderRadius:99, background:n.badge>=5?C.error:C.warning, color:'#fff', fontSize:9, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 5px' }}>{n.badge}</div>
                  )}
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
            <div style={{ padding:'16px 18px', borderBottom:`1px solid ${C.darkSub}` }}>
              <p style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.9)' }}>Support Center</p>
            </div>
            {NAV.map(n=>(
              <button key={n.k} onClick={()=>{ setSub(n.k); setSidebarOpen(false) }}
                style={{ width:'100%', display:'flex', gap:9, alignItems:'center', padding:'10px 18px', border:'none', background:sub===n.k?`${C.info}22`:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:sub===n.k?700:400, color:sub===n.k?'rgba(255,255,255,0.95)':'rgba(255,255,255,0.5)', textAlign:'left' as const }}>
                <span style={{ display:'flex', color:sub===n.k?C.info:'rgba(255,255,255,0.32)' }}>{n.icon}</span>{n.l}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        <div style={{ height:52, background:C.surface, borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', paddingInline:20, gap:12, position:'sticky', top:0, zIndex:30, flexShrink:0 }}>
          <button className="sup-menu-btn" onClick={()=>setSidebarOpen(v=>!v)}
            style={{ background:'none', border:'none', cursor:'pointer', color:C.type, padding:4, display:'none' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
          <div style={{ flex:1, display:'flex', gap:8, alignItems:'center', maxWidth:360, padding:'7px 12px', borderRadius:9, border:`1px solid ${C.border}`, background:'#FAFAFA' }}>
            <span style={{ display:'flex', color:C.muted }}>{I.search}</span>
            <input placeholder="Search tickets, customers, articles…" style={{ border:'none', background:'transparent', fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, outline:'none', flex:1 }} onFocus={()=>setSub('tickets')} />
          </div>
          <div style={{ marginLeft:'auto', display:'flex', gap:6, alignItems:'center' }}>
            <div style={{ display:'flex', gap:5, alignItems:'center', padding:'4px 10px', borderRadius:99, background:`${C.error}12`, border:`1px solid ${C.error}25` }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:C.error, animation:'pulse-dot 1s ease-in-out infinite' }}/>
              <p style={{ fontSize:10, fontWeight:700, color:C.error }}>2 SLA BREACH</p>
            </div>
            <Bdg label="CSAT 4.8" color={C.success} dot />
          </div>
        </div>
        <div style={{ flex:1, overflowY:isFullHeight?'hidden':'auto' }}>
          {renderMain()}
        </div>
      </div>

      {toast&&<Toast msg={toast} />}
    </div>
  )
}
