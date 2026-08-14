import { useState, useEffect, type ReactNode, type CSSProperties } from 'react'

// ─── Brand ────────────────────────────────────────────────────────────────────
const C = {
  primary:'#00737A', accent:'#EE8153', type:'#2C3E43', sub:'#6B7E85',
  muted:'#9AAAB0', border:'#E4E8EA', bg:'#F2F4F5', surface:'#FFFFFF',
  success:'#22C55E', warning:'#F59E0B', error:'#EF4444', info:'#3B82F6',
}

// ─── Icons ─────────────────────────────────────────────────────────────────────
const I: Record<string,ReactNode> = {
  check:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5l3 3 6-6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  close:    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  chevL:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3l-5 4 5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevR:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l5 4-5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevD:    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 4.5l3.5 4 3.5-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  star:     <svg width="12" height="12" viewBox="0 0 13 13" fill="#F59E0B"><path d="M6.5 1l1.6 3.2 3.5.5-2.55 2.48.6 3.5L6.5 9l-3.15 1.68.6-3.5L1.4 4.7l3.5-.5z"/></svg>,
  pin:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1A3.5 3.5 0 0 1 10 4.5C10 7.5 6.5 12 6.5 12S3 7.5 3 4.5A3.5 3.5 0 0 1 6.5 1z" stroke="currentColor" strokeWidth="1.2"/><circle cx="6.5" cy="4.5" r="1.2" stroke="currentColor" strokeWidth="1.1"/></svg>,
  clock:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M6.5 4V7l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  calendar: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1.5" y="2.5" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 6h10M4.5 1.5V3M8.5 1.5V3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  user:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 12c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  bolt:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M7.5 1.5L3.5 7.5h4.5l-2 4 6-7H7.5l1-3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  car:      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 9h12M4 12h8M3 9l1.5-4h7L13 9" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><circle cx="5" cy="12" r="1.2" fill="currentColor"/><circle cx="11" cy="12" r="1.2" fill="currentColor"/></svg>,
  phone:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 2.5A1 1 0 0 1 3 1.5h2l1.5 3.5-1.5 1A7.5 7.5 0 0 0 8 9l1-1.5L12.5 9v2a1 1 0 0 1-1 1C4.5 12.5 1 9 1 3.5A1 1 0 0 1 2 2.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  camera:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="3.5" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="6.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 3.5l.7-1.5h2.6l.7 1.5" stroke="currentColor" strokeWidth="1.1"/></svg>,
  doc:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M7.5 1.5H3A1.5 1.5 0 0 0 1.5 3v7A1.5 1.5 0 0 0 3 11.5h7A1.5 1.5 0 0 0 11.5 10V5L7.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M7.5 1.5V5H11.5M4.5 7h4M4.5 9h2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  activity: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 6.5h2.5l2-4 2.5 7 2-3h1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  refresh:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M11.5 6.5a5 5 0 1 1-1.1-3.1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M11.5 3v2.5H9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  gps:      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1.5"/><path d="M8 2v1.5M8 12.5V14M2 8h1.5M12.5 8H14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  warning:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2L1.5 11h10L6.5 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M6.5 6v2M6.5 10v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  bell:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5A3.5 3.5 0 0 0 3 5v3l-1.5 2h10L10 8V5A3.5 3.5 0 0 0 6.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M5.5 10.5a1 1 0 0 0 2 0" stroke="currentColor" strokeWidth="1.1"/></svg>,
  repeat:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 4h9M9 2l2 2-2 2M11 9H2M4 7l-2 2 2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  report:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1.5" y="1.5" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M4 5h5M4 7.5h5M4 10h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  sos:      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/><path d="M8 5v3.5M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  photo:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="2" width="11" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="6.5" cy="6.5" r="2" stroke="currentColor" strokeWidth="1.2"/><circle cx="9.5" cy="3.5" r="0.8" fill="currentColor"/></svg>,
  plus:     <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  history:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5a4.5 4.5 0 1 0 .9-2.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M2 3.5V6.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  hospital: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="2" y="2" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M6.5 4v5M4 6.5h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  pill:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="2.5" y="5.5" width="8" height="2" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M6.5 5.5v2" stroke="currentColor" strokeWidth="1.2"/></svg>,
  check2:   <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M6 10l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  mapPin:   <svg width="20" height="28" viewBox="0 0 20 28" fill={C.primary}><path d="M10 0A10 10 0 0 0 0 10c0 7 10 18 10 18s10-11 10-18A10 10 0 0 0 10 0z"/><circle cx="10" cy="10" r="4" fill="#fff"/></svg>,
  mapAgent: <svg width="22" height="28" viewBox="0 0 22 28" fill={C.accent}><path d="M11 0A11 11 0 0 0 0 11c0 7.5 11 17 11 17s11-9.5 11-17A11 11 0 0 0 11 0z"/><circle cx="11" cy="11" r="4.5" fill="#fff"/></svg>,
}

// ─── Shared ────────────────────────────────────────────────────────────────────
function Card({ children, style={}, hover=false, onClick }: { children:ReactNode; style?:CSSProperties; hover?:boolean; onClick?:()=>void }) {
  const [h, setH] = useState(false)
  return (
    <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ background:C.surface, borderRadius:16, border:`1px solid ${h&&hover?C.primary+'40':C.border}`, boxShadow:h&&hover?'0 8px 28px rgba(44,62,67,0.12)':'0 1px 4px rgba(44,62,67,0.06)', transition:'all 0.2s', transform:h&&hover?'translateY(-2px)':undefined, cursor:onClick?'pointer':undefined, ...style }}>
      {children}
    </div>
  )
}

function Btn({ label, icon, onClick, variant='primary', small=false }: { label:string; icon?:ReactNode; onClick?:()=>void; variant?:'primary'|'secondary'|'ghost'|'danger'|'accent'; small?:boolean }) {
  const [h, setH] = useState(false)
  const s: Record<string,CSSProperties> = {
    primary:   { background:h?'#005D63':C.primary, color:'#fff', border:'none', boxShadow:h?`0 4px 16px ${C.primary}50`:`0 2px 8px ${C.primary}30` },
    secondary: { background:h?'#EEF5F5':'#fff', color:C.primary, border:`1.5px solid ${h?C.primary:C.border}` },
    ghost:     { background:h?'#F2F4F5':'transparent', color:C.sub, border:'none' },
    danger:    { background:h?'#DC2626':C.error, color:'#fff', border:'none' },
    accent:    { background:h?'#D9703E':C.accent, color:'#fff', border:'none', boxShadow:h?`0 4px 16px ${C.accent}50`:`0 2px 8px ${C.accent}30` },
  }
  return (
    <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:small?'6px 14px':'10px 20px', borderRadius:10, cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:small?12:13, fontWeight:700, transition:'all 0.15s', ...s[variant] }}>
      {icon&&<span style={{display:'flex'}}>{icon}</span>}{label}
    </button>
  )
}

function Avatar({ name, size=40, online=false }: { name:string; size?:number; online?:boolean }) {
  const cols = ['#00737A','#EE8153','#3B82F6','#8B5CF6','#22C55E','#F59E0B']
  const c = cols[name.charCodeAt(0)%cols.length]
  const init = name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
  return (
    <div style={{ position:'relative', flexShrink:0 }}>
      <div style={{ width:size, height:size, borderRadius:'50%', background:`${c}16`, color:c, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:size*0.33, fontFamily:'Manrope,sans-serif', border:`2px solid ${c}28` }}>{init}</div>
      {online && <span style={{ position:'absolute', bottom:1, right:1, width:12, height:12, borderRadius:'50%', background:C.success, border:'2px solid #fff' }} />}
    </div>
  )
}

function Bdg({ label, color=C.primary, bg }: { label:string; color?:string; bg?:string }) {
  return <span style={{ display:'inline-flex', alignItems:'center', padding:'3px 9px', borderRadius:999, fontSize:11, fontWeight:700, background:bg??`${color}14`, color, fontFamily:'Manrope,sans-serif', whiteSpace:'nowrap' }}>{label}</span>
}

const STATUS_META: Record<string,{color:string;bg:string;dot?:boolean}> = {
  Scheduled:   {color:C.info,    bg:`${C.info}12`},
  Accepted:    {color:C.primary, bg:`${C.primary}12`},
  Travelling:  {color:C.accent,  bg:`${C.accent}12`, dot:true},
  Arrived:     {color:C.success, bg:`${C.success}10`},
  'In Progress':{color:C.primary,bg:`${C.primary}14`,dot:true},
  Waiting:     {color:C.warning, bg:`${C.warning}12`},
  Completed:   {color:C.success, bg:`${C.success}10`},
  Cancelled:   {color:C.muted,   bg:`${C.muted}10`},
  Delayed:     {color:C.warning, bg:`${C.warning}12`},
  Emergency:   {color:C.error,   bg:`${C.error}10`, dot:true},
}
function StatusBdg({ s }: { s:string }) {
  const m = STATUS_META[s]??{color:C.muted, bg:'#F2F4F5'}
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:999, fontSize:11, fontWeight:800, background:m.bg, color:m.color, letterSpacing:'0.01em' }}>
      {m.dot && <span style={{ width:6, height:6, borderRadius:'50%', background:m.color, display:'inline-block', boxShadow:`0 0 0 2px ${m.color}40` }} />}
      {s}
    </span>
  )
}

// ─── Data ──────────────────────────────────────────────────────────────────────
const TASK = {
  id:'RP-T-20259', title:'Hospital Appointment & Medication Collection',
  service:'Hospital Companion', beneficiary:'Nimal Perera', beneficiaryAge:68,
  beneficiaryCity:'Kandy', agent:'Kasun Perera', agentRating:4.89, agentJobs:156,
  location:'Kandy National Hospital · Ward 3', date:'14 Jan 2025',
  scheduledTime:'9:00 AM', eta:'9 minutes', distance:'3.4 km',
  estimatedDuration:'3 hrs', actualDuration:'2 hrs 47 min',
  status:'Travelling', budget:'LKR 3,000/hr', notes:"Nimal has hypertension. Please ensure he takes his morning medication before leaving. Dr. Sumedha Ranasinghe appointment is at 10:30 AM. Collect reports from the laboratory on the 2nd floor.",
}

const CHECKLIST_ITEMS = [
  { id:'c1', task:'Pick up Nimal from home', status:'done',    time:'9:14 AM', note:'Arrived on time' },
  { id:'c2', task:'Morning medication confirmed', status:'done', time:'9:20 AM', note:'Metformin + Amlodipine taken' },
  { id:'c3', task:'Travel to Kandy National Hospital', status:'active', time:null, note:'' },
  { id:'c4', task:'Doctor consultation — Dr. Sumedha Ranasinghe', status:'pending', time:null, note:'' },
  { id:'c5', task:'Collect medical reports from lab', status:'pending', time:null, note:'' },
  { id:'c6', task:'Purchase prescribed medication', status:'pending', time:null, note:'' },
  { id:'c7', task:'Return home safely', status:'pending', time:null, note:'' },
  { id:'c8', task:'Upload photos & receipts', status:'pending', time:null, note:'' },
  { id:'c9', task:'Submit visit report', status:'pending', time:null, note:'' },
]

const TIMELINE = [
  { time:'8:45 AM', event:'Task Accepted', icon:'check',     done:true,  note:'Kasun confirmed the task' },
  { time:'8:50 AM', event:'Agent Assigned', icon:'user',     done:true,  note:'Kasun Perera assigned by ReadyPal' },
  { time:'9:05 AM', event:'Journey Started', icon:'car',     done:true,  note:'Departed Kandy 06' },
  { time:'9:14 AM', event:'Arrived at Home', icon:'pin',     done:true,  note:'Picked up Nimal Perera' },
  { time:'9:20 AM', event:'Medication Confirmed', icon:'pill', done:true, note:'Morning medications verified' },
  { time:'9:25 AM', event:'En Route to Hospital', icon:'car', done:true,  note:'Current — ETA 9 min' },
  { time:'~9:34 AM',event:'Arrival at Hospital', icon:'hospital',done:false,note:'Estimated' },
  { time:'10:30 AM',event:'Doctor Consultation', icon:'user', done:false,  note:'Dr. Sumedha Ranasinghe' },
  { time:'~12:00 PM',event:'Care Completed',    icon:'check', done:false, note:'Estimated' },
  { time:'TBD',      event:'Report Submitted',  icon:'report',done:false,  note:'' },
  { time:'TBD',      event:'Review Pending',    icon:'star',  done:false,  note:'' },
]

const FEED = [
  { time:'9:25 AM', msg:'Kasun is now en route to Kandy National Hospital.', type:'location', icon:'car' },
  { time:'9:20 AM', msg:'Morning medications confirmed — Metformin (500mg) and Amlodipine (5mg) administered.', type:'med', icon:'pill' },
  { time:'9:14 AM', msg:'Kasun arrived at Nimal\'s residence and picked him up.', type:'arrival', icon:'pin' },
  { time:'9:05 AM', msg:'Journey started. Kasun departed from Kandy 06.', type:'start', icon:'bolt' },
  { time:'8:50 AM', msg:'Kasun Perera has been assigned to this task.', type:'system', icon:'user' },
  { time:'8:45 AM', msg:'Task accepted and confirmed by ReadyPal.', type:'system', icon:'check' },
]

const PHOTOS: { label:string; type:string; time:string; color:string }[] = [
  { label:'Prescription Photo',    type:'Document',  time:'9:22 AM', color:'#3B82F6' },
  { label:'Medication Receipt',    type:'Receipt',   time:'—',       color:'#22C55E' },
  { label:'Hospital Report',       type:'Report',    time:'—',       color:'#8B5CF6' },
  { label:'Visit Photo',           type:'Photo',     time:'—',       color:'#EE8153' },
]

const HISTORY = [
  { id:'RP-T-20247', title:'Medication Collection — Colombo',    date:'8 Jan 2025',  status:'Completed', agent:'Chamari Dissanayake', price:'LKR 3,500' },
  { id:'RP-T-20231', title:'Emergency Companion — Night',        date:'2 Jan 2025',  status:'Completed', agent:'Kasun Perera',         price:'LKR 4,200' },
  { id:'RP-T-20218', title:'Hospital Appointment — Eye Clinic',  date:'28 Dec 2024', status:'Completed', agent:'Nadeesha Silva',        price:'LKR 3,800' },
  { id:'RP-T-20199', title:'Physiotherapy Session Escort',       date:'20 Dec 2024', status:'Cancelled', agent:'Priya Senanayake',      price:'LKR 0' },
  { id:'RP-T-20188', title:'General Check-up Companion',        date:'12 Dec 2024', status:'Completed', agent:'Kasun Perera',          price:'LKR 3,200' },
]

type SubView = 'dashboard'|'detail'|'tracking'|'timeline'|'checklist'|'log'|'photos'|'feed'|'report'|'followup'|'emergency'|'history'|'reschedule'|'cancel'

// ──────────────────────────────────────────────────────────────────────────────
// TASK DASHBOARD
// ──────────────────────────────────────────────────────────────────────────────
function Dashboard({ onView }: { onView:(v:SubView)=>void }) {
  const stats = [
    {v:'1', l:'Active',     c:C.accent},
    {v:'5', l:'Completed',  c:C.success},
    {v:'2', l:'Upcoming',   c:C.info},
    {v:'0', l:'Cancelled',  c:C.muted},
  ]

  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', flexDirection:'column', gap:22 }}>
      {/* Active task hero */}
      <Card style={{ padding:0, overflow:'hidden' }}>
        <div style={{ background:`linear-gradient(135deg,${C.primary} 0%,#005D63 50%,#003C40 100%)`, padding:'24px 26px 22px', position:'relative', overflow:'hidden' }}>
          {/* decorative circles */}
          <div style={{ position:'absolute', top:-30, right:-30, width:140, height:140, borderRadius:'50%', background:'rgba(255,255,255,0.04)' }} />
          <div style={{ position:'absolute', bottom:-40, right:60, width:100, height:100, borderRadius:'50%', background:'rgba(255,255,255,0.03)' }} />
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
            <div>
              <p style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.55)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>Active Task · {TASK.id}</p>
              <h2 style={{ fontSize:20, fontWeight:900, color:'#fff', fontFamily:'Manrope,sans-serif', letterSpacing:'-0.01em', maxWidth:360, lineHeight:1.25, marginBottom:8 }}>{TASK.title}</h2>
            </div>
            <StatusBdg s={TASK.status} />
          </div>
          <div style={{ display:'flex', gap:18, flexWrap:'wrap', marginBottom:18 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, color:'rgba(255,255,255,0.75)', fontSize:13 }}><span style={{display:'flex',opacity:0.7}}>{I.user}</span>{TASK.beneficiary}</div>
            <div style={{ display:'flex', alignItems:'center', gap:6, color:'rgba(255,255,255,0.75)', fontSize:13 }}><span style={{display:'flex',opacity:0.7}}>{I.pin}</span>{TASK.location}</div>
            <div style={{ display:'flex', alignItems:'center', gap:6, color:'rgba(255,255,255,0.75)', fontSize:13 }}><span style={{display:'flex',opacity:0.7}}>{I.calendar}</span>{TASK.date} · {TASK.scheduledTime}</div>
          </div>
          {/* Agent row */}
          <div style={{ display:'flex', gap:12, alignItems:'center', padding:'12px 14px', borderRadius:12, background:'rgba(255,255,255,0.10)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.14)' }}>
            <Avatar name={TASK.agent} size={42} online />
            <div style={{ flex:1 }}>
              <p style={{ fontSize:14, fontWeight:800, color:'#fff', fontFamily:'Manrope,sans-serif' }}>{TASK.agent}</p>
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.6)' }}>{TASK.agentJobs} jobs · {TASK.agentRating}★ · Active</p>
            </div>
            <div style={{ textAlign:'right' as const }}>
              <p style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.9)' }}>ETA {TASK.eta}</p>
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.5)' }}>{TASK.distance}</p>
            </div>
          </div>
          <div style={{ display:'flex', gap:8, marginTop:14 }}>
            <button onClick={()=>onView('tracking')} style={{ flex:1, padding:'10px', borderRadius:10, border:'none', background:C.accent, cursor:'pointer', fontSize:13, fontWeight:800, color:'#fff', fontFamily:'Manrope,sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>{I.gps} Track Live</button>
            <button onClick={()=>onView('detail')} style={{ padding:'10px 16px', borderRadius:10, border:'1.5px solid rgba(255,255,255,0.25)', background:'rgba(255,255,255,0.10)', cursor:'pointer', fontSize:13, fontWeight:700, color:'#fff', fontFamily:'Manrope,sans-serif' }}>Details</button>
            <button onClick={()=>onView('emergency')} style={{ width:42, height:42, borderRadius:10, border:'1.5px solid rgba(239,68,68,0.5)', background:'rgba(239,68,68,0.18)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>{I.sos}</button>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ padding:'14px 26px', borderTop:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:12 }}>
          <p style={{ fontSize:12, fontWeight:700, color:C.muted, flexShrink:0 }}>Task Progress</p>
          <div style={{ flex:1, height:6, borderRadius:99, background:C.bg, overflow:'hidden' }}>
            <div style={{ width:'38%', height:'100%', borderRadius:99, background:`linear-gradient(90deg,${C.primary},${C.accent})` }} />
          </div>
          <p style={{ fontSize:12, fontWeight:800, color:C.primary, flexShrink:0 }}>38%</p>
        </div>
      </Card>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }} className="tm-stat-grid">
        {stats.map(s=>(
          <Card key={s.l} hover style={{ padding:'16px 18px' }}>
            <p style={{ fontSize:28, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', letterSpacing:'-0.03em', marginBottom:3 }}>{s.v}</p>
            <p style={{ fontSize:12, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:22, alignItems:'start' }} className="tm-dash-grid">
        <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
          {/* Today's schedule */}
          <Card style={{ padding:22 }}>
            <p style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:14, fontFamily:'Manrope,sans-serif' }}>Today's Schedule</p>
            {[
              {time:'9:00 AM', title:'Hospital Appointment', status:'Travelling', icon:I.hospital},
              {time:'2:00 PM', title:'Medication Collection', status:'Scheduled', icon:I.pill},
              {time:'5:00 PM', title:'Return & Report',       status:'Scheduled', icon:I.report},
            ].map((s,i)=>(
              <div key={i} style={{ display:'flex', gap:12, alignItems:'center', padding:'10px 0', borderBottom:i<2?`1px solid ${C.border}`:'none' }}>
                <div style={{ width:36, height:36, borderRadius:10, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary, flexShrink:0 }}>{s.icon}</div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{s.title}</p>
                  <p style={{ fontSize:11, color:C.muted }}>{s.time}</p>
                </div>
                <StatusBdg s={s.status} />
              </div>
            ))}
          </Card>

          {/* Checklist preview */}
          <Card style={{ padding:22 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>Task Checklist</p>
              <button onClick={()=>onView('checklist')} style={{ fontSize:12, fontWeight:700, color:C.primary, background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:3, fontFamily:'Manrope,sans-serif' }}>View All {I.chevR}</button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {CHECKLIST_ITEMS.slice(0,5).map(c=>(
                <div key={c.id} style={{ display:'flex', gap:10, alignItems:'center', padding:'8px 10px', borderRadius:10, background:c.status==='active'?`${C.primary}06`:c.status==='done'?`${C.success}05`:'#FAFAFA' }}>
                  <div style={{ width:22, height:22, borderRadius:'50%', background:c.status==='done'?C.success:c.status==='active'?`${C.primary}14`:`${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    {c.status==='done'&&<span style={{color:'#fff',display:'flex',transform:'scale(0.85)'}}>{I.check}</span>}
                    {c.status==='active'&&<div style={{width:8,height:8,borderRadius:'50%',background:C.primary}} />}
                  </div>
                  <p style={{ fontSize:13, fontWeight:c.status==='pending'?400:600, color:c.status==='done'?C.muted:C.type, textDecoration:c.status==='done'?'line-through':'none', flex:1 }}>{c.task}</p>
                  {c.time&&<p style={{ fontSize:11, color:C.success }}>{c.time}</p>}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right sidebar */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Activity feed preview */}
          <Card style={{ padding:20 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
              <p style={{ fontSize:13, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>Live Activity</p>
              <button onClick={()=>onView('feed')} style={{ fontSize:11, fontWeight:700, color:C.primary, background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:2 }}>All {I.chevR}</button>
            </div>
            {FEED.slice(0,4).map((f,i)=>(
              <div key={i} style={{ display:'flex', gap:9, padding:'7px 0', borderBottom:i<3?`1px dashed ${C.border}`:'none' }}>
                <div style={{ width:24, height:24, borderRadius:'50%', background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary, flexShrink:0 }}><span style={{display:'flex',transform:'scale(0.85)'}}>{I[f.icon]}</span></div>
                <div>
                  <p style={{ fontSize:12, color:C.type, lineHeight:1.5 }}>{f.msg.slice(0,60)}…</p>
                  <p style={{ fontSize:10, color:C.muted }}>{f.time}</p>
                </div>
              </div>
            ))}
          </Card>

          {/* Quick actions */}
          <Card style={{ padding:20 }}>
            <p style={{ fontSize:13, fontWeight:800, color:C.type, marginBottom:12, fontFamily:'Manrope,sans-serif' }}>Quick Actions</p>
            {[
              {icon:I.gps, label:'Track Live',      v:'tracking' as SubView, c:C.accent},
              {icon:I.activity, label:'View Timeline',  v:'timeline' as SubView, c:C.primary},
              {icon:I.camera, label:'Photos & Docs',  v:'photos' as SubView, c:C.primary},
              {icon:I.report, label:'View Report',    v:'report' as SubView, c:C.primary},
              {icon:I.history, label:'Task History',   v:'history' as SubView, c:C.sub},
            ].map(a=>(
              <button key={a.label} onClick={()=>onView(a.v)} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'9px 10px', borderRadius:9, border:'none', background:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:600, color:C.type, transition:'background 0.15s' }} onMouseOver={e=>{(e.currentTarget as HTMLButtonElement).style.background='#F2F4F5'}} onMouseOut={e=>{(e.currentTarget as HTMLButtonElement).style.background='transparent'}}>
                <span style={{ color:a.c, display:'flex' }}>{a.icon}</span>{a.label}<span style={{ marginLeft:'auto', color:C.muted, display:'flex' }}>{I.chevR}</span>
              </button>
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// TASK DETAILS
// ──────────────────────────────────────────────────────────────────────────────
function TaskDetail({ onBack, onTrack, onReschedule, onCancel }: { onBack:()=>void; onTrack:()=>void; onReschedule:()=>void; onCancel:()=>void }) {
  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', gap:24, alignItems:'start', flexWrap:'wrap' }}>
      <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:18 }}>
        <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', alignSelf:'flex-start' }}>{I.chevL} Dashboard</button>

        <Card style={{ padding:0, overflow:'hidden' }}>
          <div style={{ height:4, background:`linear-gradient(90deg,${C.primary},#00959E,${C.accent})` }} />
          <div style={{ padding:'22px 24px' }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:10, marginBottom:6 }}>
              <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>{TASK.title}</h2>
              <StatusBdg s={TASK.status} />
            </div>
            <p style={{ fontSize:12, color:C.muted, marginBottom:16 }}>Ref: {TASK.id}</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }} className="tm-2col">
              {[
                {l:'Beneficiary', v:TASK.beneficiary, i:I.user},
                {l:'Location',    v:TASK.location, i:I.pin},
                {l:'Scheduled',   v:`${TASK.date} · ${TASK.scheduledTime}`, i:I.calendar},
                {l:'Est. Duration',v:TASK.estimatedDuration, i:I.clock},
                {l:'Service Type', v:TASK.service, i:I.hospital},
                {l:'Budget',       v:TASK.budget, i:I.doc},
              ].map(r=>(
                <div key={r.l} style={{ padding:'12px 14px', borderRadius:12, background:'#F9FAFB', border:`1px solid ${C.border}` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
                    <span style={{ color:C.muted, display:'flex' }}>{r.i}</span>
                    <p style={{ fontSize:11, fontWeight:700, color:C.muted }}>{r.l}</p>
                  </div>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{r.v}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card style={{ padding:22 }}>
          <p style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:10, fontFamily:'Manrope,sans-serif' }}>Instructions</p>
          <p style={{ fontSize:13, color:C.sub, lineHeight:1.75 }}>{TASK.notes}</p>
        </Card>

        <Card style={{ padding:22 }}>
          <p style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:14, fontFamily:'Manrope,sans-serif' }}>Attachments</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
            {PHOTOS.map((p,i)=>(
              <div key={i} style={{ padding:'12px 14px', borderRadius:12, background:'#F9FAFB', border:`1px solid ${C.border}`, display:'flex', gap:10, alignItems:'center', cursor:'pointer' }}>
                <div style={{ width:32, height:32, borderRadius:8, background:`${p.color}12`, display:'flex', alignItems:'center', justifyContent:'center', color:p.color, flexShrink:0 }}>{I.doc}</div>
                <div>
                  <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{p.label}</p>
                  <p style={{ fontSize:10, color:C.muted }}>{p.type} · {p.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Sidebar */}
      <div style={{ width:270, flexShrink:0, display:'flex', flexDirection:'column', gap:14, position:'sticky', top:24 }}>
        <Card style={{ padding:22 }}>
          <p style={{ fontSize:12, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:12 }}>Care Agent</p>
          <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:14 }}>
            <Avatar name={TASK.agent} size={52} online />
            <div>
              <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{TASK.agent}</p>
              <p style={{ fontSize:12, color:C.muted }}>{TASK.agentJobs} jobs · {TASK.agentRating}★</p>
            </div>
          </div>
          <Btn label="Track Live" variant="accent" icon={I.gps} onClick={onTrack} />
        </Card>

        <Card style={{ padding:22 }}>
          <p style={{ fontSize:12, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:12 }}>Task Actions</p>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <Btn label="Reschedule" variant="secondary" icon={I.calendar} onClick={onReschedule} />
            <Btn label="Cancel Task" variant="danger" icon={I.close} onClick={onCancel} />
          </div>
        </Card>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// LIVE TRACKING
// ──────────────────────────────────────────────────────────────────────────────
function LiveTracking({ onBack }: { onBack:()=>void }) {
  const [pct, setPct] = useState(62)
  const [lastUpd, setLastUpd] = useState('Just now')
  const [pulseOn, setPulseOn] = useState(true)

  useEffect(() => {
    const t = setInterval(()=>{ setPct(p=>Math.min(100,p+1)); setLastUpd('Just now') }, 4000)
    const p = setInterval(()=>setPulseOn(x=>!x), 1200)
    return ()=>{ clearInterval(t); clearInterval(p) }
  }, [])

  const agentX = 55 + (pct-62)*0.4
  const agentY = 45 - (pct-62)*0.2

  const roads = [
    {x1:'10%',y1:'70%',x2:'90%',y2:'35%',thick:3},
    {x1:'30%',y1:'10%',x2:'45%',y2:'80%',thick:2},
    {x1:'60%',y1:'20%',x2:'75%',y2:'90%',thick:2},
    {x1:'5%', y1:'45%',x2:'95%',y2:'60%',thick:1.5},
    {x1:'15%',y1:'85%',x2:'85%',y2:'20%',thick:1.5},
  ]
  const blocks = [
    {x:'12%',y:'18%',w:80,h:60},{x:'35%',y:'14%',w:65,h:48},{x:'62%',y:'22%',w:72,h:55},
    {x:'8%', y:'50%',w:55,h:45},{x:'45%',y:'52%',w:90,h:50},{x:'75%',y:'55%',w:50,h:40},
    {x:'20%',y:'72%',w:70,h:38},{x:'58%',y:'70%',w:60,h:42},
  ]
  const eta = Math.max(0, Math.round((100-pct)/10))

  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', flexDirection:'column', gap:18 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>{I.chevL}</button>
        <h2 style={{ fontSize:18, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Live Tracking</h2>
        <div style={{ display:'flex', alignItems:'center', gap:5, marginLeft:'auto', padding:'4px 10px', borderRadius:999, background:`${C.success}10`, border:`1px solid ${C.success}25` }}>
          <div style={{ width:7, height:7, borderRadius:'50%', background:C.success, boxShadow:pulseOn?`0 0 0 3px ${C.success}30`:'none', transition:'box-shadow 0.5s' }} />
          <p style={{ fontSize:11, fontWeight:700, color:C.success }}>GPS Active</p>
        </div>
      </div>

      {/* Map */}
      <Card style={{ padding:0, overflow:'hidden' }}>
        <div style={{ height:420, position:'relative', background:'#E8F0E9' }}>
          {/* SVG road network */}
          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
            {roads.map((r,i)=><line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke="#fff" strokeWidth={r.thick} opacity="0.85" />)}
            {roads.map((r,i)=><line key={`d${i}`} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke="#D0DDD4" strokeWidth={r.thick+0.5} opacity="0.3" />)}
          </svg>
          {/* City blocks */}
          {blocks.map((b,i)=>(
            <div key={i} style={{ position:'absolute', left:b.x, top:b.y, width:b.w, height:b.h, background:`rgba(180,200,185,0.35)`, borderRadius:4, border:'1px solid rgba(160,185,170,0.25)' }} />
          ))}
          {/* Grid */}
          {[20,40,60,80].map(p=>(
            <div key={p}>
              <div style={{ position:'absolute', left:0, right:0, top:`${p}%`, height:1, background:'rgba(0,115,122,0.05)' }} />
              <div style={{ position:'absolute', top:0, bottom:0, left:`${p}%`, width:1, background:'rgba(0,115,122,0.05)' }} />
            </div>
          ))}

          {/* Route line */}
          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
            <defs>
              <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={C.primary} stopOpacity="0.9"/>
                <stop offset="100%" stopColor={C.accent} stopOpacity="0.9"/>
              </linearGradient>
            </defs>
            <polyline points="25%,75% 35%,65% 45%,60% 55%,50% 65%,42% 75%,32%" fill="none" stroke="#E4E8EA" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 4" />
            <polyline
              points={`25%,75% 35%,65% ${Math.min(agentX,45)}%,${Math.max(agentY,60)}% ${Math.min(agentX,55)}%,${Math.max(agentY,50)}%`}
              fill="none" stroke="url(#rg)" strokeWidth="4" strokeLinecap="round"
            />
          </svg>

          {/* Destination pin */}
          <div style={{ position:'absolute', left:'73%', top:'30%', transform:'translate(-50%,-100%)' }}>
            <span style={{ display:'flex' }}>{I.mapPin}</span>
            <div style={{ marginTop:2, padding:'2px 7px', borderRadius:6, background:'rgba(0,115,122,0.9)', whiteSpace:'nowrap' }}>
              <p style={{ fontSize:10, fontWeight:700, color:'#fff' }}>Kandy National Hosp.</p>
            </div>
          </div>

          {/* Agent moving pin */}
          <div style={{ position:'absolute', left:`${agentX}%`, top:`${agentY}%`, transform:'translate(-50%,-100%)', transition:'left 2s ease, top 2s ease' }}>
            <span style={{ display:'flex' }}>{I.mapAgent}</span>
            <div style={{ marginTop:2, padding:'2px 7px', borderRadius:6, background:'rgba(238,129,83,0.92)', whiteSpace:'nowrap', textAlign:'center' as const }}>
              <p style={{ fontSize:10, fontWeight:700, color:'#fff' }}>Kasun</p>
            </div>
          </div>

          {/* Home pin */}
          <div style={{ position:'absolute', left:'24%', top:'74%', transform:'translate(-50%,-100%)' }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:'#fff', border:`3px solid ${C.sub}`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.15)' }}>
              <span style={{ color:C.sub, fontSize:11, display:'flex' }}>{I.user}</span>
            </div>
            <div style={{ marginTop:2, padding:'2px 7px', borderRadius:6, background:'rgba(107,126,133,0.9)', textAlign:'center' as const }}>
              <p style={{ fontSize:10, fontWeight:700, color:'#fff' }}>Home</p>
            </div>
          </div>

          {/* Map legend */}
          <div style={{ position:'absolute', top:12, right:12, padding:'10px 12px', borderRadius:10, background:'rgba(255,255,255,0.95)', backdropFilter:'blur(8px)', border:`1px solid ${C.border}`, display:'flex', flexDirection:'column', gap:5 }}>
            <div style={{ display:'flex', alignItems:'center', gap:5 }}><div style={{ width:10, height:10, borderRadius:'50%', background:C.accent }} /><p style={{ fontSize:10, fontWeight:600, color:C.type }}>Care Agent</p></div>
            <div style={{ display:'flex', alignItems:'center', gap:5 }}><div style={{ width:10, height:10, borderRadius:'50%', background:C.primary }} /><p style={{ fontSize:10, fontWeight:600, color:C.type }}>Destination</p></div>
            <div style={{ display:'flex', alignItems:'center', gap:5 }}><div style={{ width:10, height:10, borderRadius:'50%', background:C.sub }} /><p style={{ fontSize:10, fontWeight:600, color:C.type }}>Home</p></div>
          </div>

          {/* Refresh btn */}
          <button onClick={()=>{ setLastUpd('Just now') }} style={{ position:'absolute', bottom:12, right:12, width:36, height:36, borderRadius:10, border:`1px solid ${C.border}`, background:'rgba(255,255,255,0.9)', backdropFilter:'blur(6px)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.primary }}>
            {I.refresh}
          </button>
        </div>
      </Card>

      {/* ETA + stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }} className="tm-stat-grid">
        {[
          {v:`${eta} min`, l:'ETA', c:C.accent},
          {v:TASK.distance, l:'Distance', c:C.primary},
          {v:lastUpd, l:'Last Updated', c:C.success},
          {v:TASK.status, l:'Status', c:C.accent},
        ].map(s=>(
          <Card key={s.l} style={{ padding:'14px 16px' }}>
            <p style={{ fontSize:s.l==='Status'?13:20, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', letterSpacing:'-0.01em', marginBottom:3 }}>{s.v}</p>
            <p style={{ fontSize:11, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>

      {/* Arrival progress */}
      <Card style={{ padding:22 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>Arrival Progress</p>
          <p style={{ fontSize:13, fontWeight:800, color:C.primary }}>{pct}%</p>
        </div>
        <div style={{ height:10, borderRadius:99, background:C.bg, overflow:'hidden', marginBottom:8 }}>
          <div style={{ width:`${pct}%`, height:'100%', borderRadius:99, background:`linear-gradient(90deg,${C.primary},${C.accent})`, transition:'width 1s ease' }} />
        </div>
        <div style={{ display:'flex', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:5 }}><div style={{ width:8, height:8, borderRadius:'50%', background:C.sub }} /><p style={{ fontSize:11, color:C.muted }}>Nimal's Home</p></div>
          <div style={{ display:'flex', alignItems:'center', gap:5 }}><div style={{ width:8, height:8, borderRadius:'50%', background:C.primary }} /><p style={{ fontSize:11, color:C.muted }}>Kandy National Hospital</p></div>
        </div>
      </Card>

      {/* Current activity */}
      <Card style={{ padding:20 }}>
        <p style={{ fontSize:12, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:10 }}>Current Activity</p>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <div style={{ width:44, height:44, borderRadius:12, background:`${C.accent}12`, display:'flex', alignItems:'center', justifyContent:'center', color:C.accent }}>{I.car}</div>
          <div>
            <p style={{ fontSize:14, fontWeight:800, color:C.type }}>Travelling to Hospital</p>
            <p style={{ fontSize:12, color:C.muted }}>Kandy–Colombo Road · {TASK.distance} remaining</p>
          </div>
          <div style={{ marginLeft:'auto', display:'flex', gap:6 }}>
            <Btn label="Call Agent" variant="secondary" icon={I.phone} small />
            <button onClick={()=>{}} style={{ width:36, height:36, borderRadius:9, border:`1px solid ${C.error}30`, background:`${C.error}08`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.error }}>{I.sos}</button>
          </div>
        </div>
      </Card>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// TIMELINE
// ──────────────────────────────────────────────────────────────────────────────
function Timeline({ onBack }: { onBack:()=>void }) {
  const iconMap: Record<string,ReactNode> = {
    check:I.check, user:I.user, car:I.car, pin:I.pin, pill:I.pill, hospital:I.hospital, report:I.report, star:I.star
  }
  return (
    <div style={{ padding:'24px 28px 60px' }}>
      <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>{I.chevL} Dashboard</button>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>Task Timeline</h2>
      <p style={{ fontSize:13, color:C.muted, marginBottom:22 }}>{TASK.id} · {TASK.date}</p>

      <Card style={{ padding:'24px 28px' }}>
        {TIMELINE.map((ev,i)=>{
          const active = !ev.done && i === TIMELINE.findIndex(e=>!e.done)
          return (
            <div key={i} style={{ display:'flex', gap:16 }}>
              {/* Spine */}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:ev.done?C.primary:active?`${C.primary}14`:`${C.border}30`, border:active?`2px solid ${C.primary}`:ev.done?'none':'none', display:'flex', alignItems:'center', justifyContent:'center', color:ev.done?'#fff':active?C.primary:C.muted, transition:'all 0.3s', boxShadow:active?`0 0 0 4px ${C.primary}18`:'none' }}>
                  {ev.done ? <span style={{display:'flex',transform:'scale(0.9)'}}>{I.check}</span> : <span style={{display:'flex',transform:'scale(0.85)'}}>{iconMap[ev.icon]??I.bolt}</span>}
                </div>
                {i<TIMELINE.length-1&&<div style={{ width:2, flex:1, minHeight:20, margin:'4px 0', background:ev.done?C.primary:C.border, borderRadius:1 }} />}
              </div>
              {/* Content */}
              <div style={{ paddingBottom:i<TIMELINE.length-1?20:0, flex:1, paddingTop:4 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4, flexWrap:'wrap' }}>
                  <p style={{ fontSize:14, fontWeight:ev.done||active?800:600, color:ev.done?C.type:active?C.primary:C.muted }}>{ev.event}</p>
                  {active && <Bdg label="Current" color={C.primary} />}
                  {!ev.done && !active && <Bdg label="Upcoming" color={C.muted} bg="#F2F4F5" />}
                  <p style={{ fontSize:12, color:C.muted, marginLeft:'auto' }}>{ev.time}</p>
                </div>
                {ev.note && <p style={{ fontSize:12, color:C.sub, padding:'6px 10px', borderRadius:8, background:ev.done?`${C.success}06`:active?`${C.primary}05`:'#FAFAFA', display:'inline-block' }}>{ev.note}</p>}
              </div>
            </div>
          )
        })}
      </Card>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// CHECKLIST
// ──────────────────────────────────────────────────────────────────────────────
function Checklist({ onBack }: { onBack:()=>void }) {
  const [items, setItems] = useState(CHECKLIST_ITEMS)
  const done = items.filter(i=>i.status==='done').length
  const pct  = Math.round(done/items.length*100)

  return (
    <div style={{ padding:'24px 28px 60px' }}>
      <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>{I.chevL} Dashboard</button>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:3 }}>Task Checklist</h2>
          <p style={{ fontSize:13, color:C.muted }}>{done} of {items.length} completed</p>
        </div>
        <div style={{ textAlign:'right' as const }}>
          <p style={{ fontSize:28, fontWeight:900, color:C.primary, fontFamily:'Manrope,sans-serif', letterSpacing:'-0.03em' }}>{pct}%</p>
        </div>
      </div>

      <div style={{ height:8, borderRadius:99, background:C.bg, overflow:'hidden', marginBottom:22 }}>
        <div style={{ width:`${pct}%`, height:'100%', borderRadius:99, background:`linear-gradient(90deg,${C.primary},${C.accent})`, transition:'width 0.5s ease' }} />
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {items.map((item)=>{
          const isDone = item.status==='done'
          const isActive = item.status==='active'
          return (
            <Card key={item.id} style={{ padding:'16px 18px', borderLeft:`3px solid ${isDone?C.success:isActive?C.primary:C.border}` }}>
              <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                <button onClick={()=>setItems(prev=>prev.map(it=>it.id===item.id?{...it,status:isDone?'pending':'done',time:isDone?null:'Now'}:it))}
                  style={{ width:28, height:28, borderRadius:'50%', border:`2px solid ${isDone?C.success:isActive?C.primary:C.border}`, background:isDone?C.success:'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, cursor:'pointer' }}>
                  {isDone && <span style={{color:'#fff',display:'flex',transform:'scale(0.85)'}}>{I.check}</span>}
                  {isActive && <div style={{width:8,height:8,borderRadius:'50%',background:C.primary}} />}
                </button>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:14, fontWeight:isDone?500:700, color:isDone?C.muted:C.type, textDecoration:isDone?'line-through':'none' }}>{item.task}</p>
                  {item.note && <p style={{ fontSize:12, color:C.sub, marginTop:2 }}>{item.note}</p>}
                </div>
                <div style={{ flexShrink:0, textAlign:'right' as const }}>
                  {item.time && <p style={{ fontSize:12, fontWeight:700, color:C.success }}>{item.time}</p>}
                  {isActive && <Bdg label="Active" color={C.primary} />}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// VISIT LOG
// ──────────────────────────────────────────────────────────────────────────────
function VisitLog({ onBack }: { onBack:()=>void }) {
  const vitals = [{l:'Blood Pressure',v:'138 / 86 mmHg',c:C.warning},{l:'Heart Rate',v:'74 bpm',c:C.success},{l:'Temperature',v:'37.0°C',c:C.success},{l:'Oxygen Saturation',v:'97%',c:C.success}]
  const locations = ['Nimal\'s Home — 8 Saranankara Rd, Kandy','Kandy National Hospital — Ward 3','Hospital Pharmacy']

  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', flexDirection:'column', gap:18 }}>
      <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', alignSelf:'flex-start' }}>{I.chevL} Dashboard</button>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Visit Log</h2>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }} className="tm-2col">
        {[{l:'Arrival Time',v:'9:14 AM',c:C.primary},{l:'Departure Time',v:'In Progress',c:C.muted},{l:'Est. Duration',v:TASK.estimatedDuration,c:C.sub},{l:'Mileage',v:'12.8 km (est.)',c:C.sub}].map(r=>(
          <Card key={r.l} style={{ padding:'16px 18px' }}>
            <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:4 }}>{r.l}</p>
            <p style={{ fontSize:18, fontWeight:900, color:r.c, fontFamily:'Manrope,sans-serif' }}>{r.v}</p>
          </Card>
        ))}
      </div>

      <Card style={{ padding:22 }}>
        <p style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:12, fontFamily:'Manrope,sans-serif' }}>Visited Locations</p>
        {locations.map((l,i)=>(
          <div key={i} style={{ display:'flex', gap:10, alignItems:'center', padding:'10px 0', borderBottom:i<locations.length-1?`1px solid ${C.border}`:'none' }}>
            <div style={{ width:24, height:24, borderRadius:'50%', background:`${C.primary}12`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary, flexShrink:0, fontSize:12, fontWeight:800 }}>{i+1}</div>
            <p style={{ fontSize:13, color:C.type }}>{l}</p>
          </div>
        ))}
      </Card>

      <Card style={{ padding:22 }}>
        <p style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:14, fontFamily:'Manrope,sans-serif' }}>Vitals Observed</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
          {vitals.map(v=>(
            <div key={v.l} style={{ padding:'12px 14px', borderRadius:12, background:'#F9FAFB', border:`1px solid ${C.border}`, borderLeft:`3px solid ${v.c}` }}>
              <p style={{ fontSize:11, color:C.muted, marginBottom:4 }}>{v.l}</p>
              <p style={{ fontSize:16, fontWeight:800, color:v.c, fontFamily:'Manrope,sans-serif' }}>{v.v}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ padding:22 }}>
        <p style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:10, fontFamily:'Manrope,sans-serif' }}>Observations</p>
        <p style={{ fontSize:13, color:C.sub, lineHeight:1.75 }}>Nimal was in good spirits this morning. Blood pressure slightly elevated — likely white coat effect. He took his morning medication without issue. Requested we stop at the pharmacy after the hospital visit to collect his monthly supply of Metformin.</p>
      </Card>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// PHOTOS & DOCS
// ──────────────────────────────────────────────────────────────────────────────
function PhotoGallery({ onBack }: { onBack:()=>void }) {
  const [filter, setFilter] = useState('All')
  const types = ['All','Photos','Documents','Receipts','Reports']
  const docs = [
    ...PHOTOS,
    { label:'Doctor\'s Note',    type:'Document', time:'—', color:'#3B82F6' },
    { label:'Hospital Bill',     type:'Receipt',  time:'—', color:'#22C55E' },
    { label:'Blood Test Report', type:'Report',   time:'—', color:'#8B5CF6' },
    { label:'X-Ray Scan',        type:'Photo',    time:'—', color:'#EE8153' },
  ]
  const filtered = filter==='All' ? docs : docs.filter(d=>d.type===filter||d.type===filter.slice(0,-1))

  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', flexDirection:'column', gap:18 }}>
      <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', alignSelf:'flex-start' }}>{I.chevL} Dashboard</button>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Photos & Documents</h2>
        <button style={{ display:'flex', alignItems:'center', gap:5, padding:'8px 14px', borderRadius:9, border:`1.5px solid ${C.border}`, background:'transparent', cursor:'pointer', fontSize:12, fontWeight:700, color:C.primary, fontFamily:'Manrope,sans-serif' }}>{I.plus} Upload</button>
      </div>
      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
        {types.map(t=>(
          <button key={t} onClick={()=>setFilter(t)} style={{ padding:'6px 14px', borderRadius:999, border:`1.5px solid ${filter===t?C.primary:C.border}`, background:filter===t?`${C.primary}10`:'transparent', cursor:'pointer', fontSize:12, fontWeight:700, color:filter===t?C.primary:C.sub, fontFamily:'Manrope,sans-serif' }}>{t}</button>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }} className="tm-photo-grid">
        {filtered.map((d,i)=>(
          <Card key={i} hover style={{ padding:0, overflow:'hidden', cursor:'pointer' }}>
            <div style={{ height:110, background:`linear-gradient(135deg,${d.color}14,${d.color}28)`, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <div style={{ width:52, height:52, borderRadius:14, background:`${d.color}18`, display:'flex', alignItems:'center', justifyContent:'center', color:d.color }}>
                <span style={{ transform:'scale(1.6)', display:'flex' }}>{d.type==='Photo'?I.photo:I.doc}</span>
              </div>
            </div>
            <div style={{ padding:'12px 14px' }}>
              <p style={{ fontSize:12, fontWeight:700, color:C.type, marginBottom:2 }}>{d.label}</p>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <Bdg label={d.type} color={d.color} />
                <p style={{ fontSize:10, color:C.muted }}>{d.time}</p>
              </div>
            </div>
          </Card>
        ))}
        {/* Upload card */}
        <Card style={{ padding:0, overflow:'hidden', cursor:'pointer', border:`2px dashed ${C.border}` }}>
          <div style={{ height:110, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:6 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:`${C.primary}08`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary }}>{I.plus}</div>
            <p style={{ fontSize:12, fontWeight:700, color:C.muted }}>Upload New</p>
          </div>
          <div style={{ padding:'12px 14px' }}>
            <p style={{ fontSize:12, color:C.muted }}>Tap to add photo or document</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// ACTIVITY FEED
// ──────────────────────────────────────────────────────────────────────────────
function ActivityFeed({ onBack }: { onBack:()=>void }) {
  const iconMap: Record<string,ReactNode> = { car:I.car, pill:I.pill, pin:I.pin, bolt:I.bolt, user:I.user, check:I.check, camera:I.camera, warning:I.warning }
  const typeColor: Record<string,string> = { location:C.accent, med:C.success, arrival:C.primary, start:C.info, system:C.muted }

  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', flexDirection:'column', gap:18 }}>
      <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', alignSelf:'flex-start' }}>{I.chevL} Dashboard</button>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Activity Feed</h2>
        <div style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 10px', borderRadius:999, background:`${C.success}10`, border:`1px solid ${C.success}25` }}>
          <div style={{ width:7, height:7, borderRadius:'50%', background:C.success }} />
          <p style={{ fontSize:11, fontWeight:700, color:C.success }}>Live</p>
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {FEED.map((f,i)=>{
          const c = typeColor[f.type]??C.primary
          return (
            <Card key={i} style={{ padding:'14px 18px' }}>
              <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                <div style={{ width:38, height:38, borderRadius:12, background:`${c}12`, display:'flex', alignItems:'center', justifyContent:'center', color:c, flexShrink:0 }}>
                  <span style={{ display:'flex' }}>{iconMap[f.icon]??I.bolt}</span>
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:13, color:C.type, lineHeight:1.65 }}>{f.msg}</p>
                  <p style={{ fontSize:11, color:C.muted, marginTop:3 }}>{f.time}</p>
                </div>
                <Bdg label={f.type.charAt(0).toUpperCase()+f.type.slice(1)} color={c} />
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// REPORT SUMMARY
// ──────────────────────────────────────────────────────────────────────────────
function ReportSummary({ onBack, onFollowup }: { onBack:()=>void; onFollowup:()=>void }) {
  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', gap:22, alignItems:'start', flexWrap:'wrap' }}>
      <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:18 }}>
        <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', alignSelf:'flex-start' }}>{I.chevL} Dashboard</button>
        <div>
          <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:3 }}>Care Report</h2>
          <div style={{ display:'flex', gap:8 }}>
            <Bdg label="In Progress" color={C.accent} />
            <p style={{ fontSize:12, color:C.muted }}>{TASK.id}</p>
          </div>
        </div>

        <Card style={{ padding:22 }}>
          <p style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:14, fontFamily:'Manrope,sans-serif' }}>Summary</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }} className="tm-stat-grid">
            {[{l:'Tasks Completed',v:'2/9'},{l:'Time Spent',v:'47 min'},{l:'Locations Visited',v:'2'}].map(s=>(
              <div key={s.l} style={{ padding:'14px', borderRadius:12, background:`${C.primary}06`, border:`1px solid ${C.primary}12`, textAlign:'center' as const }}>
                <p style={{ fontSize:22, fontWeight:900, color:C.primary, fontFamily:'Manrope,sans-serif' }}>{s.v}</p>
                <p style={{ fontSize:11, color:C.muted }}>{s.l}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ padding:22 }}>
          <p style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:12, fontFamily:'Manrope,sans-serif' }}>Services Provided</p>
          {['Medication verification and administration','Safe transportation to Kandy National Hospital','Patient escort during doctor visit'].map((s,i)=>(
            <div key={i} style={{ display:'flex', gap:8, alignItems:'flex-start', padding:'8px 0', borderBottom:i<2?`1px solid ${C.border}`:'none' }}>
              <span style={{ color:C.success, display:'flex', marginTop:1, flexShrink:0 }}>{I.check}</span>
              <p style={{ fontSize:13, color:C.type }}>{s}</p>
            </div>
          ))}
        </Card>

        <Card style={{ padding:22 }}>
          <p style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:10, fontFamily:'Manrope,sans-serif' }}>Agent Notes</p>
          <p style={{ fontSize:13, color:C.sub, lineHeight:1.75 }}>Nimal was cooperative and in good spirits. Blood pressure was slightly elevated at 138/86 mmHg — recommend monitoring. Dr. Ranasinghe prescribed a medication adjustment; updated prescription collected from pharmacy. Will submit full report upon task completion.</p>
        </Card>

        <Card style={{ padding:22 }}>
          <p style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:12, fontFamily:'Manrope,sans-serif' }}>Recommendations</p>
          {['Schedule follow-up BP check within 7 days','Review Metformin dosage with GP','Consider adding daily walk routine'].map((r,i)=>(
            <div key={i} style={{ display:'flex', gap:8, padding:'9px 12px', borderRadius:10, background:i===0?`${C.warning}06`:`${C.info}05`, border:`1px solid ${i===0?C.warning+'20':C.info+'20'}`, marginBottom:7 }}>
              <span style={{ color:i===0?C.warning:C.info, display:'flex', flexShrink:0 }}>{I.warning}</span>
              <p style={{ fontSize:13, color:C.type }}>{r}</p>
            </div>
          ))}
        </Card>
      </div>

      {/* Sidebar */}
      <div style={{ width:270, flexShrink:0, display:'flex', flexDirection:'column', gap:14, position:'sticky', top:24 }}>
        <Card style={{ padding:22 }}>
          <p style={{ fontSize:12, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:12 }}>Doctor Notes</p>
          <div style={{ padding:'12px 14px', borderRadius:12, background:`${C.info}06`, border:`1px solid ${C.info}20` }}>
            <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:4 }}>Dr. Sumedha Ranasinghe</p>
            <p style={{ fontSize:12, color:C.sub, lineHeight:1.65, fontStyle:'italic' }}>"Adjust Amlodipine to 10mg daily. Review again in 3 weeks. Reduce salt intake."</p>
            <p style={{ fontSize:11, color:C.muted, marginTop:6 }}>Added post-consultation</p>
          </div>
        </Card>
        <Card style={{ padding:22 }}>
          <Btn label="Plan Follow-up Care" variant="primary" icon={I.calendar} onClick={onFollowup} />
        </Card>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// FOLLOW-UP CARE
// ──────────────────────────────────────────────────────────────────────────────
function FollowupCare({ onBack }: { onBack:()=>void }) {
  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', flexDirection:'column', gap:18 }}>
      <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', alignSelf:'flex-start' }}>{I.chevL} Report</button>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Follow-up Care</h2>

      <Card style={{ padding:22 }}>
        <p style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:14, fontFamily:'Manrope,sans-serif' }}>Recommended Next Visit</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }} className="tm-stat-grid">
          {[{d:'21 Jan 2025',l:'BP Follow-up'},{d:'28 Jan 2025',l:'Med Review'},{d:'4 Feb 2025',l:'GP Check-up'}].map(d=>(
            <div key={d.l} style={{ padding:'14px', borderRadius:12, background:'#F9FAFB', border:`1px solid ${C.border}`, textAlign:'center' as const, cursor:'pointer' }}>
              <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{d.d.slice(0,6)}</p>
              <p style={{ fontSize:11, color:C.muted, marginTop:2 }}>{d.l}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ padding:22 }}>
        <p style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:14, fontFamily:'Manrope,sans-serif' }}>Suggested Services</p>
        {['Hospital Companion — Blood Pressure Follow-up','Medication Collection — Monthly Refill','Emergency Companion — On-demand'].map((s,i)=>(
          <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 14px', borderRadius:12, background:'#F9FAFB', border:`1px solid ${C.border}`, marginBottom:8 }}>
            <p style={{ fontSize:13, fontWeight:600, color:C.type }}>{s}</p>
            <Btn label="Book" variant="secondary" small />
          </div>
        ))}
      </Card>

      <Card style={{ padding:22 }}>
        <p style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:12, fontFamily:'Manrope,sans-serif' }}>Recurring Care</p>
        <div style={{ display:'flex', gap:10, alignItems:'center', padding:'14px 16px', borderRadius:12, background:`${C.primary}06`, border:`1px solid ${C.primary}14` }}>
          <span style={{ color:C.primary, display:'flex' }}>{I.repeat}</span>
          <div style={{ flex:1 }}>
            <p style={{ fontSize:13, fontWeight:700, color:C.type }}>Set Recurring Appointment</p>
            <p style={{ fontSize:12, color:C.muted }}>Weekly · Fortnightly · Monthly</p>
          </div>
          <Btn label="Enable" variant="primary" small />
        </div>
      </Card>

      <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
        <Btn label="Book Again — Same Agent" variant="primary" icon={I.repeat} />
        <Btn label="Set Reminder" variant="secondary" icon={I.bell} />
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// EMERGENCY PANEL
// ──────────────────────────────────────────────────────────────────────────────
function Emergency({ onBack }: { onBack:()=>void }) {
  const [sos, setSos] = useState(false)
  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', flexDirection:'column', gap:18 }}>
      <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', alignSelf:'flex-start' }}>{I.chevL} Dashboard</button>

      {/* Warning banner */}
      <div style={{ padding:'16px 20px', borderRadius:14, background:`${C.error}06`, border:`1.5px solid ${C.error}25`, display:'flex', gap:12, alignItems:'center' }}>
        <div style={{ width:40, height:40, borderRadius:'50%', background:`${C.error}12`, display:'flex', alignItems:'center', justifyContent:'center', color:C.error, flexShrink:0 }}>{I.warning}</div>
        <div>
          <p style={{ fontSize:14, fontWeight:800, color:C.error, fontFamily:'Manrope,sans-serif' }}>Emergency Actions</p>
          <p style={{ fontSize:12, color:C.sub }}>Use only in genuine emergencies. These actions alert all parties immediately.</p>
        </div>
      </div>

      {/* SOS Button */}
      <Card style={{ padding:28, textAlign:'center' }}>
        <button onClick={()=>setSos(v=>!v)} style={{ width:120, height:120, borderRadius:'50%', border:`4px solid ${sos?C.error:C.error+'40'}`, background:sos?C.error:`${C.error}08`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px', boxShadow:sos?`0 0 0 12px ${C.error}20`:'none', transition:'all 0.3s' }}>
          <span style={{ display:'flex', color:sos?'#fff':C.error, transform:'scale(2.5)' }}>{I.sos}</span>
        </button>
        <p style={{ fontSize:16, fontWeight:900, color:sos?C.error:C.type, fontFamily:'Manrope,sans-serif' }}>{sos?'SOS Active — Help Alerted':'Hold to Activate SOS'}</p>
        <p style={{ fontSize:12, color:C.muted }}>Sends your location to emergency contacts and ReadyPal</p>
      </Card>

      {/* Quick contacts */}
      <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>Quick Contacts</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12 }} className="tm-2col">
        {[
          {l:'Call Care Agent', sub:TASK.agent, c:C.primary, icon:I.phone},
          {l:'Call Emergency Contact', sub:'Ruwan Perera (Son)', c:C.accent, icon:I.phone},
          {l:'Call Hospital', sub:'Kandy National Hospital', c:C.error, icon:I.hospital},
          {l:'Share Live Location', sub:'Share GPS with family', c:C.info, icon:I.gps},
        ].map(a=>(
          <button key={a.l} style={{ padding:'16px', borderRadius:14, border:`1.5px solid ${a.c}25`, background:`${a.c}06`, cursor:'pointer', textAlign:'left' as const, display:'flex', gap:10, alignItems:'center' }}>
            <div style={{ width:40, height:40, borderRadius:12, background:`${a.c}14`, display:'flex', alignItems:'center', justifyContent:'center', color:a.c, flexShrink:0 }}>{a.icon}</div>
            <div>
              <p style={{ fontSize:13, fontWeight:800, color:a.c, fontFamily:'Manrope,sans-serif' }}>{a.l}</p>
              <p style={{ fontSize:11, color:C.sub }}>{a.sub}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// TASK HISTORY
// ──────────────────────────────────────────────────────────────────────────────
function TaskHistory({ onBack }: { onBack:()=>void }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const filtered = HISTORY.filter(h=>(filter==='All'||h.status===filter)&&(h.title.toLowerCase().includes(search.toLowerCase())||h.agent.toLowerCase().includes(search.toLowerCase())))

  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', flexDirection:'column', gap:18 }}>
      <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', alignSelf:'flex-start' }}>{I.chevL} Dashboard</button>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Task History</h2>

      <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tasks…" style={{ flex:1, minWidth:180, padding:'9px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, outline:'none', background:'#FAFAFA', boxSizing:'border-box' as const }} />
        {['All','Completed','Cancelled'].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{ padding:'8px 14px', borderRadius:9, border:`1.5px solid ${filter===f?C.primary:C.border}`, background:filter===f?`${C.primary}08`:'transparent', cursor:'pointer', fontSize:12, fontWeight:700, color:filter===f?C.primary:C.sub, fontFamily:'Manrope,sans-serif' }}>{f}</button>
        ))}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {filtered.map(h=>(
          <Card key={h.id} hover style={{ padding:'16px 20px' }}>
            <div style={{ display:'flex', gap:14, alignItems:'center', flexWrap:'wrap' }}>
              <div style={{ flex:1, minWidth:180 }}>
                <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap', marginBottom:4 }}>
                  <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{h.title}</p>
                  <StatusBdg s={h.status} />
                </div>
                <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                  <span style={{ fontSize:12, color:C.muted }}>{h.agent}</span>
                  <span style={{ fontSize:12, color:C.muted }}>{h.date}</span>
                  <span style={{ fontSize:12, color:C.muted }}>{h.id}</span>
                </div>
              </div>
              <div style={{ display:'flex', gap:8, alignItems:'center', flexShrink:0 }}>
                <p style={{ fontSize:14, fontWeight:800, color:C.type }}>{h.price}</p>
                {h.status==='Completed' && <Btn label="Book Again" variant="secondary" small />}
              </div>
            </div>
          </Card>
        ))}
        {!filtered.length && (
          <div style={{ padding:'40px', textAlign:'center' as const }}>
            <p style={{ fontSize:14, color:C.muted }}>No tasks found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// RESCHEDULE MODAL
// ──────────────────────────────────────────────────────────────────────────────
function RescheduleModal({ onClose, onConfirm }: { onClose:()=>void; onConfirm:()=>void }) {
  const [date, setDate] = useState('2025-01-15')
  const [time, setTime] = useState('10:00')
  const [reason, setReason] = useState('')
  const reasons = ['Personal conflict','Medical appointment changed','Care agent unavailable','Family request','Other']

  return (
    <div style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.35)', backdropFilter:'blur(4px)' }} />
      <Card style={{ position:'relative', zIndex:1, padding:28, maxWidth:440, width:'100%' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
          <h3 style={{ fontSize:17, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Reschedule Task</h3>
          <button onClick={onClose} style={{ width:32,height:32,borderRadius:9,border:`1px solid ${C.border}`,background:'transparent',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:C.muted }}>{I.close}</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
          <div><p style={{ fontSize:12, fontWeight:700, color:C.muted, marginBottom:6 }}>New Date</p><input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{ width:'100%', padding:'10px 12px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, outline:'none', boxSizing:'border-box' as const }} /></div>
          <div><p style={{ fontSize:12, fontWeight:700, color:C.muted, marginBottom:6 }}>New Time</p><input type="time" value={time} onChange={e=>setTime(e.target.value)} style={{ width:'100%', padding:'10px 12px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, outline:'none', boxSizing:'border-box' as const }} /></div>
        </div>
        <p style={{ fontSize:12, fontWeight:700, color:C.muted, marginBottom:8 }}>Reason</p>
        <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:18 }}>
          {reasons.map(r=>(
            <button key={r} onClick={()=>setReason(r)} style={{ padding:'9px 14px', borderRadius:10, border:`1.5px solid ${reason===r?C.primary:C.border}`, background:reason===r?`${C.primary}06`:'transparent', cursor:'pointer', fontSize:13, fontWeight:600, color:reason===r?C.primary:C.type, fontFamily:'Manrope,sans-serif', textAlign:'left' as const, display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:16,height:16,borderRadius:'50%',border:`2px solid ${reason===r?C.primary:C.border}`,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center' }}>{reason===r&&<div style={{width:8,height:8,borderRadius:'50%',background:C.primary}} />}</div>
              {r}
            </button>
          ))}
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <Btn label="Cancel" variant="secondary" onClick={onClose} />
          <button onClick={onConfirm} style={{ flex:1,padding:'11px',borderRadius:10,border:'none',background:C.primary,cursor:'pointer',fontSize:13,fontWeight:800,color:'#fff',fontFamily:'Manrope,sans-serif' }}>Confirm Reschedule</button>
        </div>
      </Card>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// CANCEL MODAL
// ──────────────────────────────────────────────────────────────────────────────
function CancelModal({ onClose, onConfirm }: { onClose:()=>void; onConfirm:()=>void }) {
  const [reason, setReason] = useState('')
  const reasons = ['No longer needed','Found another service','Care agent unavailable','Changed schedule','Other']

  return (
    <div style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.35)', backdropFilter:'blur(4px)' }} />
      <Card style={{ position:'relative', zIndex:1, padding:28, maxWidth:420, width:'100%' }}>
        <div style={{ width:52,height:52,borderRadius:'50%',background:`${C.error}10`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',color:C.error, transform:'scale(1.2)' }}>{I.warning}</div>
        <h3 style={{ fontSize:17, fontWeight:900, color:C.type, textAlign:'center', marginBottom:6, fontFamily:'Manrope,sans-serif' }}>Cancel Task</h3>
        <p style={{ fontSize:13, color:C.muted, textAlign:'center', marginBottom:16, lineHeight:1.6 }}>Cancelling may incur a fee if less than 24 hours before scheduled time. This action cannot be undone.</p>

        <div style={{ padding:'12px 14px', borderRadius:12, background:`${C.warning}07`, border:`1px solid ${C.warning}20`, marginBottom:16 }}>
          <p style={{ fontSize:12, fontWeight:700, color:C.warning }}>Refund Policy: Full refund if cancelled 24+ hrs in advance. 50% refund within 24 hrs.</p>
        </div>

        <p style={{ fontSize:12, fontWeight:700, color:C.muted, marginBottom:8 }}>Reason</p>
        <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:18 }}>
          {reasons.map(r=>(
            <button key={r} onClick={()=>setReason(r)} style={{ padding:'9px 14px', borderRadius:10, border:`1.5px solid ${reason===r?C.error:C.border}`, background:reason===r?`${C.error}05`:'transparent', cursor:'pointer', fontSize:13, fontWeight:600, color:reason===r?C.error:C.type, fontFamily:'Manrope,sans-serif', textAlign:'left' as const, display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:16,height:16,borderRadius:'50%',border:`2px solid ${reason===r?C.error:C.border}`,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center' }}>{reason===r&&<div style={{width:8,height:8,borderRadius:'50%',background:C.error}} />}</div>
              {r}
            </button>
          ))}
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <Btn label="Keep Task" variant="secondary" onClick={onClose} />
          <button onClick={reason?onConfirm:undefined} style={{ flex:1,padding:'11px',borderRadius:10,border:'none',background:reason?C.error:'#C8D0D4',cursor:reason?'pointer':'not-allowed',fontSize:13,fontWeight:800,color:'#fff',fontFamily:'Manrope,sans-serif' }}>Cancel Task</button>
        </div>
      </Card>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// ROOT
// ──────────────────────────────────────────────────────────────────────────────
export default function TaskManagement() {
  const [subView, setSubView] = useState<SubView>('dashboard')
  const [showReschedule, setShowReschedule] = useState(false)
  const [showCancel, setShowCancel] = useState(false)

  const NAV: {key:SubView; label:string}[] = [
    {key:'dashboard', label:'Dashboard'},
    {key:'tracking',  label:'Live Track'},
    {key:'timeline',  label:'Timeline'},
    {key:'checklist', label:'Checklist'},
    {key:'feed',      label:'Activity'},
    {key:'photos',    label:'Photos & Docs'},
    {key:'report',    label:'Report'},
    {key:'history',   label:'History'},
  ]

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:C.bg, fontFamily:'Manrope,sans-serif' }}>
      {/* Header nav */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'0 28px', position:'sticky', top:0, zIndex:30 }}>
        <div style={{ padding:'12px 0 0' }}>
          <p style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:4 }}>Task Management</p>
          <p style={{ fontSize:15, fontWeight:900, color:C.type, marginBottom:0, fontFamily:'Manrope,sans-serif' }}>{TASK.title}</p>
        </div>
        <div style={{ display:'flex', gap:0, overflowX:'auto' }}>
          {NAV.map(n=>(
            <button key={n.key} onClick={()=>setSubView(n.key)} style={{ padding:'12px 14px', border:'none', background:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:subView===n.key?800:500, color:subView===n.key?C.primary:C.sub, borderBottom:subView===n.key?`2px solid ${C.primary}`:'2px solid transparent', transition:'all 0.15s', whiteSpace:'nowrap' as const }}>
              {n.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:'auto' }}>
        {subView==='dashboard'  && <Dashboard onView={setSubView} />}
        {subView==='detail'     && <TaskDetail onBack={()=>setSubView('dashboard')} onTrack={()=>setSubView('tracking')} onReschedule={()=>setShowReschedule(true)} onCancel={()=>setShowCancel(true)} />}
        {subView==='tracking'   && <LiveTracking onBack={()=>setSubView('dashboard')} />}
        {subView==='timeline'   && <Timeline onBack={()=>setSubView('dashboard')} />}
        {subView==='checklist'  && <Checklist onBack={()=>setSubView('dashboard')} />}
        {subView==='log'        && <VisitLog onBack={()=>setSubView('dashboard')} />}
        {subView==='photos'     && <PhotoGallery onBack={()=>setSubView('dashboard')} />}
        {subView==='feed'       && <ActivityFeed onBack={()=>setSubView('dashboard')} />}
        {subView==='report'     && <ReportSummary onBack={()=>setSubView('dashboard')} onFollowup={()=>setSubView('followup')} />}
        {subView==='followup'   && <FollowupCare onBack={()=>setSubView('report')} />}
        {subView==='emergency'  && <Emergency onBack={()=>setSubView('dashboard')} />}
        {subView==='history'    && <TaskHistory onBack={()=>setSubView('dashboard')} />}
        {subView==='reschedule' && <div style={{padding:28}}><Btn label="Back" variant="ghost" icon={I.chevL} onClick={()=>setSubView('detail')} /></div>}
        {subView==='cancel'     && <div style={{padding:28}}><Btn label="Back" variant="ghost" icon={I.chevL} onClick={()=>setSubView('detail')} /></div>}
      </div>

      {showReschedule && <RescheduleModal onClose={()=>setShowReschedule(false)} onConfirm={()=>{ setShowReschedule(false); setSubView('dashboard') }} />}
      {showCancel     && <CancelModal     onClose={()=>setShowCancel(false)}     onConfirm={()=>{ setShowCancel(false); setSubView('history') }} />}
    </div>
  )
}
