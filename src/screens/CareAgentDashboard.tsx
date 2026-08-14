import { useState, useEffect, type ReactNode, type CSSProperties } from 'react'

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

function Avatar({ initials='KP', color=C.primary, size=40 }:{ initials?:string; color?:string; size?:number }) {
  return <div style={{ width:size, height:size, borderRadius:'50%', background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:size*0.28, color, fontFamily:'Manrope,sans-serif', flexShrink:0 }}>{initials}</div>
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

// ─── JOBS DATA ────────────────────────────────────────────────────────────────
const JOBS = [
  { id:'J001', client:'Mohamed Ihsan',     beneficiary:'Nimal Perera',     service:'Hospital Appointment',  time:'9:00 AM', duration:'3 hrs', location:'Colombo National Hospital', status:'active',    amount:3750 },
  { id:'J002', client:'Priya Fernando',    beneficiary:'Rukmini Fernando',  service:'Home Care',             time:'2:00 PM', duration:'4 hrs', location:'Dehiwela',                  status:'upcoming',  amount:4800 },
  { id:'J003', client:'Arjuna Wijesinghe', beneficiary:'Lalitha Wijesinghe',service:'Medication Collection', time:'5:30 PM', duration:'1.5 hrs',location:'Liberty Plaza, Colombo 03',status:'upcoming',  amount:1500 },
]

const INVITATIONS = [
  { id:'I001', client:'Chamari Dissanayake', beneficiary:'Siripala Dissanayake', service:'Post-Surgery Care', date:'Tomorrow, 9 AM', location:'Malay Street, Colombo 02', amount:5500, distance:'3.2 km', timer:'2h 14m remaining' },
  { id:'I002', client:'Fathima Rasheed',     beneficiary:'Hassan Rasheed',       service:'Wheelchair Assistance',date:'Sat 18 Jan, 10 AM',location:'Lady Ridgeway Hospital',    amount:2800, distance:'5.8 km', timer:'18h remaining' },
]

const MESSAGES = [
  { name:'Mohamed Ihsan',     initials:'MI', msg:'Thank you for today! Will you be available next week?', time:'11:30 AM', unread:2 },
  { name:'Priya Fernando',    initials:'PF', msg:"Please arrive 10 minutes early if possible.",           time:'Yesterday', unread:0 },
  { name:'Arjuna Wijesinghe', initials:'AW', msg:"Job confirmed for 5:30 PM.",                           time:'Mon',       unread:0 },
]

const NOTIFS = [
  { icon:'💼', title:'New Job Invitation',    body:'Post-Surgery Care from Chamari Dissanayake',     time:'2 min ago',  color:C.accent,  read:false },
  { icon:'💰', title:'Payment Received',      body:'LKR 3,750 for Hospital Appointment — Ihsan',    time:'1 hr ago',   color:C.success, read:false },
  { icon:'⭐', title:'New Review',            body:'Mohamed Ihsan left you 5 stars',                 time:'3 hrs ago',  color:C.warning, read:false },
  { icon:'✅', title:'Certificate Approved',  body:'Your First Aid certificate has been verified',  time:'Yesterday',  color:C.primary, read:true  },
  { icon:'📋', title:'Task Reminder',         body:"Home Care for Rukmini at 2 PM today",            time:'9:00 AM',    color:C.info,    read:true  },
  { icon:'📢', title:'Platform Update',       body:'ReadyPal v2.3 is now available',                 time:'Mon',        color:C.muted,   read:true  },
]

// ─── Dashboard Home ───────────────────────────────────────────────────────────
function DashboardHome({ status, setStatus, onNav, onToast }:{ status:Status; setStatus:(s:Status)=>void; onNav:(s:SubView)=>void; onToast:(m:string)=>void }) {
  const [online, setOnline] = useState(true)
  const kpis = [
    { label:"Today's Jobs",     value:'3',         sub:'2 upcoming, 1 active',  trend:'↑ 1 vs yesterday', icon:I.calendar, color:C.primary, accent:true },
    { label:'Monthly Earnings', value:'LKR 145K',  sub:'LKR 24,500 this week',  trend:'↑ 12% vs last month',icon:I.wallet,  color:C.success },
    { label:'Average Rating',   value:'4.9★',      sub:'From 142 reviews',      trend:'↑ 0.1 this month', icon:I.star,     color:C.warning },
    { label:'Completion Rate',  value:'98%',       sub:'2 cancellations',       trend:'Top 5% of agents', icon:I.target,   color:C.info },
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
              <div style={{ width:52, height:52, borderRadius:'50%', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:20, color:'#fff', fontFamily:'Manrope,sans-serif' }}>KP</div>
              <div style={{ position:'absolute', bottom:1, right:1, width:13, height:13, borderRadius:'50%', background:online?C.success:C.muted, border:'2px solid #fff' }} />
            </div>
            <div>
              <p style={{ fontSize:13, color:'rgba(255,255,255,0.7)', marginBottom:2 }}>Good morning 👋</p>
              <h2 style={{ fontSize:20, fontWeight:900, color:'#fff', fontFamily:'Manrope,sans-serif', marginBottom:4 }}>Kasun Perera</h2>
              <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' as const }}>
                <span style={{ padding:'3px 10px', borderRadius:99, background:'rgba(255,255,255,0.2)', fontSize:11, fontWeight:700, color:'#fff' }}>{STATUS_CONFIG[status].label}</span>
                <span style={{ fontSize:11, color:'rgba(255,255,255,0.65)' }}>Hospital Companion · Colombo</span>
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
            <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
              {JOBS.map((job,i)=>{
                const col = job.status==='active'?C.primary:job.status==='upcoming'?C.info:C.success
                return (
                  <div key={job.id} style={{ display:'flex', gap:14, paddingBottom:i<JOBS.length-1?16:0 }}>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                      <div style={{ width:10, height:10, borderRadius:'50%', background:col, border:`2px solid ${col}`, marginTop:4 }} />
                      {i<JOBS.length-1&&<div style={{ width:2, flex:1, background:C.border, margin:'4px 0' }} />}
                    </div>
                    <div style={{ flex:1, paddingBottom:i<JOBS.length-1?6:0 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
                        <div>
                          <div style={{ display:'flex', gap:7, alignItems:'center', marginBottom:2 }}>
                            <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{job.service}</p>
                            {job.status==='active'&&<Bdg label="Active" color={C.primary} dot />}
                          </div>
                          <p style={{ fontSize:11, color:C.muted }}>{job.time} · {job.duration} · {job.client}</p>
                          <div style={{ display:'flex', gap:4, alignItems:'center', marginTop:2 }}>
                            <span style={{color:C.muted,display:'flex',transform:'scale(0.85)'}}>{I.pin}</span>
                            <p style={{ fontSize:11, color:C.muted }}>{job.location}</p>
                          </div>
                        </div>
                        <div style={{ textAlign:'right' as const, flexShrink:0 }}>
                          <p style={{ fontSize:12, fontWeight:800, color:C.success, fontFamily:'Manrope,sans-serif' }}>LKR {job.amount.toLocaleString()}</p>
                        </div>
                      </div>
                      <div style={{ display:'flex', gap:8 }}>
                        {job.status==='active'&&<Btn label="Continue Task" variant="primary" small icon={I.play} onClick={()=>onNav('activeTask')} />}
                        {job.status==='upcoming'&&<Btn label="View Details" variant="secondary" small onClick={()=>onNav('schedule')} />}
                        <Btn label="Navigate" variant="ghost" small icon={I.pin} onClick={()=>onToast('Opening maps…')} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Active task highlight */}
          <Card style={{ padding:22, background:`linear-gradient(135deg,${C.primary}06,${C.primary}02)`, border:`1.5px solid ${C.primary}20` }}>
            <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:14 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:C.primary, animation:'pulse-dot 1.5s ease-in-out infinite' }} />
              <p style={{ fontSize:12, fontWeight:800, color:C.primary, textTransform:'uppercase' as const, letterSpacing:'0.07em' }}>Active Task</p>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
              <div>
                <h3 style={{ fontSize:16, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>Hospital Appointment</h3>
                <p style={{ fontSize:12, color:C.muted }}>Nimal Perera · Colombo National Hospital</p>
              </div>
              <div style={{ textAlign:'right' as const }}>
                <p style={{ fontSize:11, color:C.muted }}>Time remaining</p>
                <p style={{ fontSize:18, fontWeight:900, color:C.primary, fontFamily:'Manrope,sans-serif' }}>1h 42m</p>
              </div>
            </div>
            {/* Checklist progress */}
            <div style={{ display:'flex', flexDirection:'column', gap:7, marginBottom:14 }}>
              {[{l:'Arrived at client location',done:true},{l:'Beneficiary collected',done:true},{l:'Arrived at hospital',done:true},{l:'Registration & waiting',done:false},{l:'Doctor consultation',done:false}].map((c,j)=>(
                <div key={j} style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <div style={{ width:18, height:18, borderRadius:'50%', background:c.done?C.success:`${C.primary}10`, border:`2px solid ${c.done?C.success:C.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    {c.done&&<span style={{color:'#fff',display:'flex',transform:'scale(0.7)'}}>{I.check}</span>}
                  </div>
                  <p style={{ fontSize:12, color:c.done?C.type:C.muted, fontWeight:c.done?600:400, textDecoration:c.done?'line-through':undefined }}>{c.l}</p>
                </div>
              ))}
            </div>
            <div style={{ marginBottom:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                <p style={{ fontSize:11, color:C.muted }}>3 of 5 tasks complete</p>
                <p style={{ fontSize:11, fontWeight:700, color:C.primary }}>60%</p>
              </div>
              <div style={{ height:6, borderRadius:99, background:`${C.primary}15`, overflow:'hidden' }}>
                <div style={{ width:'60%', height:'100%', background:`linear-gradient(90deg,${C.primary},${C.success})`, borderRadius:99 }} />
              </div>
            </div>
            <Btn label="Open Task" onClick={()=>onNav('activeTask')} />
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
          {NOTIFS.slice(0,4).map((n,i)=>(
            <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', padding:'8px 0', borderBottom:i<3?`1px solid ${C.border}`:'none' }}>
              <div style={{ width:32, height:32, borderRadius:10, background:`${n.color}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, flexShrink:0 }}>{n.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
                  <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{n.title}</p>
                  {!n.read&&<div style={{ width:7, height:7, borderRadius:'50%', background:n.color, marginTop:2, flexShrink:0 }} />}
                </div>
                <p style={{ fontSize:11, color:C.muted }}>{n.body}</p>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

// ─── Today's Schedule ─────────────────────────────────────────────────────────
function Schedule({ onToast }:{ onToast:(m:string)=>void }) {
  return (
    <div style={{ padding:'28px 32px 60px', maxWidth:800 }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Today's Schedule</h2>
      <p style={{ fontSize:13, color:C.muted, marginBottom:24 }}>Wednesday, 15 January 2025 · 3 jobs scheduled</p>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {JOBS.map((job,i)=>(
          <Card key={job.id} style={{ padding:24, border:`1.5px solid ${job.status==='active'?C.primary+'30':C.border}`, background:job.status==='active'?`${C.primary}04`:C.surface }}>
            <div style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
              <div style={{ flexShrink:0, textAlign:'center' as const, width:52 }}>
                <p style={{ fontSize:14, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>{job.time.split(' ')[0]}</p>
                <p style={{ fontSize:10, color:C.muted }}>{job.time.split(' ')[1]}</p>
              </div>
              <div style={{ width:1, alignSelf:'stretch', background:job.status==='active'?C.primary:C.border, flexShrink:0 }} />
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                  <div>
                    <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                      <h3 style={{ fontSize:15, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{job.service}</h3>
                      <Bdg label={job.status==='active'?'In Progress':job.status==='upcoming'?'Upcoming':'Completed'} color={job.status==='active'?C.primary:job.status==='upcoming'?C.info:C.success} dot />
                    </div>
                    <p style={{ fontSize:12, color:C.muted }}>{job.duration} · {job.client} → {job.beneficiary}</p>
                  </div>
                  <p style={{ fontSize:14, fontWeight:900, color:C.success, fontFamily:'Manrope,sans-serif' }}>LKR {job.amount.toLocaleString()}</p>
                </div>
                <div style={{ display:'flex', gap:14, marginBottom:14, flexWrap:'wrap' as const }}>
                  <div style={{ display:'flex', gap:5, alignItems:'center' }}>
                    <span style={{color:C.muted,display:'flex',transform:'scale(0.85)'}}>{I.pin}</span>
                    <p style={{ fontSize:12, color:C.sub }}>{job.location}</p>
                  </div>
                  <div style={{ display:'flex', gap:5, alignItems:'center' }}>
                    <span style={{color:C.muted,display:'flex'}}>{I.clock}</span>
                    <p style={{ fontSize:12, color:C.sub }}>{job.time}</p>
                  </div>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  {job.status==='active'&&<Btn label="Continue Task" variant="primary" small icon={I.play} onClick={()=>onToast('Opening task…')} />}
                  {job.status==='upcoming'&&<Btn label="View Details" variant="secondary" small />}
                  <Btn label="Navigate" variant="ghost" small icon={I.pin} onClick={()=>onToast('Opening navigation…')} />
                  <Btn label="Call Client" variant="ghost" small icon={I.phone} onClick={()=>onToast('Calling client…')} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
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
function CalendarView({ onToast }:{ onToast:(m:string)=>void }) {
  const [selectedDay, setSelectedDay] = useState(15)
  const [blocked, setBlocked] = useState(new Set([20,21]))
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  const month = Array.from({length:31},(_,i)=>i+1)
  const jobDays = new Set([13,14,15,16,17,18,22,23])
  return (
    <div style={{ padding:'28px 32px 60px', maxWidth:800 }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Calendar & Availability</h2>
      <p style={{ fontSize:13, color:C.muted, marginBottom:24 }}>January 2025 · Manage your schedule and availability</p>
      <div style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:20 }} className="cad-2col">
        <Card style={{ padding:24 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
            <h3 style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>January 2025</h3>
            <div style={{ display:'flex', gap:4 }}>
              <button style={{ width:28, height:28, borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.muted }}><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
              <button style={{ width:28, height:28, borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.muted }}><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2, marginBottom:4 }}>
            {days.map(d=><p key={d} style={{ fontSize:10, fontWeight:800, color:C.muted, textAlign:'center' as const, padding:'4px 0' }}>{d}</p>)}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:3 }}>
            {[...Array(2)].map((_,i)=><div key={`e${i}`} />)}
            {month.map(d=>{
              const isSelected = d===selectedDay
              const hasJob = jobDays.has(d)
              const isBlocked = blocked.has(d)
              const isToday = d===15
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
            <SectionTitle title={`Jan ${selectedDay} — Schedule`} />
            {selectedDay===15
              ? JOBS.map((job,i)=>(
                <div key={i} style={{ padding:'10px 0', borderBottom:i<JOBS.length-1?`1px solid ${C.border}`:'none' }}>
                  <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{job.time} · {job.service}</p>
                  <p style={{ fontSize:11, color:C.muted }}>{job.client} · {job.duration}</p>
                </div>
              ))
              : <p style={{ fontSize:13, color:C.muted }}>No jobs scheduled for this day.</p>
            }
          </Card>
          <Card style={{ padding:20 }}>
            <SectionTitle title="Block a Date" />
            <p style={{ fontSize:12, color:C.muted, marginBottom:12 }}>Block dates for leave or personal time. Blocked days won't receive invitations.</p>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' as const, marginBottom:12 }}>
              {[...blocked].map(d=>(
                <div key={d} style={{ display:'flex', gap:4, alignItems:'center', padding:'4px 10px', borderRadius:99, background:`${C.error}10`, border:`1px solid ${C.error}30` }}>
                  <p style={{ fontSize:11, fontWeight:700, color:C.error }}>Jan {d}</p>
                  <button onClick={()=>setBlocked(p=>{ const n=new Set(p); n.delete(d); return n })} style={{ background:'none', border:'none', cursor:'pointer', color:C.error, display:'flex', padding:0 }}><span style={{display:'flex',transform:'scale(0.75)'}}>{I.close}</span></button>
                </div>
              ))}
            </div>
            <Btn label={`Block Jan ${selectedDay}`} variant="secondary" small onClick={()=>{ setBlocked(p=>new Set([...p,selectedDay])); onToast(`Jan ${selectedDay} blocked`) }} />
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
function NotificationCenter() {
  return (
    <div style={{ padding:'28px 32px 60px', maxWidth:680 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>Notification Center</h2>
          <p style={{ fontSize:13, color:C.muted }}>{NOTIFS.filter(n=>!n.read).length} unread</p>
        </div>
        <Bdg label={`${NOTIFS.filter(n=>!n.read).length} new`} color={C.primary} dot />
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {NOTIFS.map((n,i)=>(
          <Card key={i} style={{ padding:18, background:n.read?C.surface:`${n.color}04`, border:`1px solid ${n.read?C.border:n.color+'20'}` }}>
            <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
              <div style={{ width:44, height:44, borderRadius:14, background:`${n.color}12`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{n.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                  <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                    <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{n.title}</p>
                    {!n.read&&<div style={{ width:7, height:7, borderRadius:'50%', background:n.color }} />}
                  </div>
                  <p style={{ fontSize:11, color:C.muted, whiteSpace:'nowrap' as const }}>{n.time}</p>
                </div>
                <p style={{ fontSize:12, color:C.sub, lineHeight:1.6 }}>{n.body}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
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
  const sections = [
    { l:'Personal Information',  pct:100, done:true  },
    { l:'Professional Profile',  pct:100, done:true  },
    { l:'Skills & Services',     pct:100, done:true  },
    { l:'Certifications',        pct:80,  done:false, missing:'Medical Training Certificate' },
    { l:'Identity Verification', pct:75,  done:false, missing:'Medical Fitness Certificate' },
    { l:'Banking & Payouts',     pct:100, done:true  },
    { l:'Availability',          pct:100, done:true  },
    { l:'References',            pct:100, done:true  },
    { l:'Agreements',            pct:40,  done:false, missing:'Code of Conduct, Care Standards' },
  ]
  const overall = Math.round(sections.reduce((a,s)=>a+s.pct,0)/sections.length)
  const strength = overall>=90?'Excellent':overall>=70?'Good':'Needs Work'
  const strengthColor = overall>=90?C.success:overall>=70?C.warning:C.error
  return (
    <div style={{ padding:'28px 32px 60px', maxWidth:680 }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:24 }}>Profile Completion</h2>
      <Card style={{ padding:24, marginBottom:20, background:`linear-gradient(135deg,${C.primary}06,${C.primary}02)`, border:`1.5px solid ${C.primary}20` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
          <div>
            <p style={{ fontSize:15, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>Profile Strength: <span style={{color:strengthColor}}>{strength}</span></p>
            <p style={{ fontSize:12, color:C.muted }}>A complete profile gets 3× more bookings</p>
          </div>
          <p style={{ fontSize:40, fontWeight:900, color:strengthColor, fontFamily:'Manrope,sans-serif', lineHeight:1 }}>{overall}%</p>
        </div>
        <div style={{ height:10, borderRadius:99, background:`${C.primary}12`, overflow:'hidden' }}>
          <div style={{ width:`${overall}%`, height:'100%', background:`linear-gradient(90deg,${C.primary},${C.success})`, borderRadius:99, transition:'width 0.6s' }} />
        </div>
        <div style={{ display:'flex', gap:10, marginTop:14 }}>
          <Btn label="Complete Profile" icon={I.edit} onClick={()=>onToast('Opening registration…')} />
        </div>
      </Card>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {sections.map((s,i)=>(
          <Card key={i} style={{ padding:18 }}>
            <div style={{ display:'flex', gap:12, alignItems:'center' }}>
              <div style={{ width:32, height:32, borderRadius:10, background:s.done?`${C.success}10`:`${C.warning}10`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:s.done?C.success:C.warning }}>
                {s.done?<span style={{display:'flex',transform:'scale(0.85)'}}>{I.check}</span>:<span style={{fontSize:12,fontWeight:900}}>!</span>}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{s.l}</p>
                  <p style={{ fontSize:11, fontWeight:800, color:s.done?C.success:C.warning }}>{s.pct}%</p>
                </div>
                <div style={{ height:4, borderRadius:99, background:C.bg, overflow:'hidden' }}>
                  <div style={{ width:`${s.pct}%`, height:'100%', background:s.done?C.success:C.warning, borderRadius:99 }} />
                </div>
                {s.missing&&<p style={{ fontSize:11, color:C.warning, marginTop:3 }}>Missing: {s.missing}</p>}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Service Areas ────────────────────────────────────────────────────────────
function ServiceAreas({ onToast }:{ onToast:(m:string)=>void }) {
  const [radius, setRadius] = useState(25)
  return (
    <div style={{ padding:'28px 32px 60px', maxWidth:700 }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:24 }}>Service Areas</h2>
      {/* Map placeholder */}
      <Card style={{ overflow:'hidden', marginBottom:20 }}>
        <div style={{ height:280, background:`linear-gradient(135deg,${C.bg},#E4EEF0)`, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:10, position:'relative' as const }}>
          <div style={{ position:'absolute', inset:0, backgroundImage:`radial-gradient(circle at 40% 50%, ${C.primary}15 0%, transparent 70%)` }} />
          {/* Coverage rings */}
          {[100,70,42].map((s,i)=>(
            <div key={i} style={{ position:'absolute', width:`${s}%`, height:`${s*0.7}%`, borderRadius:'50%', border:`2px dashed ${C.primary}${i===2?'40':'20'}`, top:'50%', left:'50%', transform:'translate(-50%,-50%)' }} />
          ))}
          <div style={{ width:16, height:16, borderRadius:'50%', background:C.primary, boxShadow:`0 0 0 6px ${C.primary}30`, zIndex:1 }} />
          <p style={{ fontSize:13, fontWeight:700, color:C.sub, zIndex:1, background:C.surface, padding:'4px 12px', borderRadius:8 }}>Colombo · Coverage: {radius} km</p>
          <p style={{ fontSize:11, color:C.muted }}>Interactive map — coming soon</p>
        </div>
        <div style={{ padding:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
            <p style={{ fontSize:12, fontWeight:700, color:C.muted }}>Travel Radius</p>
            <p style={{ fontSize:13, fontWeight:900, color:C.primary, fontFamily:'Manrope,sans-serif' }}>{radius} km</p>
          </div>
          <input type="range" min={5} max={100} step={5} value={radius} onChange={e=>setRadius(+e.target.value)} style={{ width:'100%', accentColor:C.primary, cursor:'pointer', marginBottom:14 }} />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
            {['Colombo','Dehiwela','Moratuwa','Mount Lavinia','Nugegoda','Maharagama'].map((city,i)=>(
              <div key={i} style={{ padding:'8px 10px', borderRadius:8, background:C.bg, display:'flex', gap:5, alignItems:'center' }}>
                <span style={{color:C.primary,display:'flex',transform:'scale(0.8)'}}>{I.pin}</span>
                <p style={{ fontSize:11, fontWeight:600, color:C.type }}>{city}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop:14 }}>
            <Btn label="Save Coverage Area" variant="primary" small onClick={()=>onToast('Service area updated')} />
          </div>
        </div>
      </Card>
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
function ActivityTimeline() {
  const events = [
    { icon:'💼', l:'Job Accepted',         d:'Post-Surgery Care · Chamari Dissanayake',          t:'Today, 2 min ago',    color:C.accent  },
    { icon:'💰', l:'Payment Received',     d:'LKR 3,750 for Hospital Appointment · Ihsan',       t:'Today, 1 hr ago',     color:C.success },
    { icon:'⭐', l:'Review Received',      d:'5 stars from Mohamed Ihsan',                       t:'Today, 1.5 hrs ago',  color:C.warning },
    { icon:'▶️', l:'Task Started',         d:'Hospital Appointment · Nimal Perera',              t:'Today, 9:00 AM',      color:C.primary },
    { icon:'✅', l:'Certificate Approved', d:'First Aid Certificate verified by ReadyPal',       t:'Yesterday, 3:00 PM',  color:C.success },
    { icon:'👤', l:'Profile Updated',      d:'Professional headline updated',                    t:'2 days ago',          color:C.primary },
    { icon:'💼', l:'Job Accepted',         d:'Home Care · Priya Fernando',                       t:'14 Jan, 8:00 AM',     color:C.accent  },
    { icon:'🔐', l:'Login',               d:'Chrome · MacBook · Colombo',                       t:'14 Jan, 7:55 AM',     color:C.muted   },
  ]
  return (
    <div style={{ padding:'28px 32px 60px', maxWidth:680 }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:24 }}>Activity Timeline</h2>
      <div style={{ display:'flex', flexDirection:'column' }}>
        {events.map((e,i,arr)=>(
          <div key={i} style={{ display:'flex', gap:14 }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:`${e.color}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{e.icon}</div>
              {i<arr.length-1&&<div style={{ width:2, flex:1, background:C.border, margin:'4px 0' }} />}
            </div>
            <div style={{ paddingBottom:i<arr.length-1?18:0, paddingTop:4 }}>
              <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:2 }}>{e.l}</p>
              <p style={{ fontSize:12, color:C.muted, marginBottom:2 }}>{e.d}</p>
              <p style={{ fontSize:11, color:C.muted }}>{e.t}</p>
            </div>
          </div>
        ))}
      </div>
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

// ─── Empty / Loading / Error / Success ────────────────────────────────────────
function EmptyStates() {
  const items = [
    { emoji:'💼', title:'No Active Jobs',    desc:"You don't have any active jobs right now. Check your invitations to get started.",  cta:'Browse Invitations' },
    { emoji:'📨', title:'No Invitations',    desc:'No new job invitations at the moment. Make sure your status is set to Online.',      cta:'Set Online' },
    { emoji:'🔔', title:'No Notifications',  desc:"You're all caught up — no new notifications.",                                       cta:'View Settings' },
    { emoji:'💬', title:'No Messages',       desc:'No messages yet. Once you accept a job, clients can message you here.',             cta:'View Schedule' },
    { emoji:'💳', title:'No Earnings Yet',   desc:'Complete your first job to start earning. Your payouts will appear here.',          cta:'Find Jobs' },
  ]
  return (
    <div style={{ padding:'28px 32px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:20 }}>Empty States</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }} className="cad-2col">
        {items.map((s,i)=>(
          <Card key={i} style={{ padding:'40px 24px', textAlign:'center' as const }}>
            <div style={{ fontSize:44, marginBottom:14 }}>{s.emoji}</div>
            <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:8 }}>{s.title}</p>
            <p style={{ fontSize:12, color:C.muted, lineHeight:1.7, marginBottom:18 }}>{s.desc}</p>
            <Btn label={s.cta} variant="secondary" small />
          </Card>
        ))}
      </div>
    </div>
  )
}

function LoadingStates() {
  function Shimmer({ style={} }:{ style?:CSSProperties }) {
    return <div style={{ borderRadius:10, background:'linear-gradient(90deg,#E4E8EA 25%,#F2F4F5 50%,#E4E8EA 75%)', backgroundSize:'200% 100%', animation:'shimmer 1.6s ease-in-out infinite', ...style }} />
  }
  return (
    <div style={{ padding:'28px 32px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:20 }}>Loading States</h2>
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        {['Loading Dashboard','Loading Schedule','Loading Calendar','Loading Analytics'].map((l,i)=>(
          <Card key={i} style={{ padding:22 }}>
            <p style={{ fontSize:12, fontWeight:700, color:C.muted, marginBottom:14 }}>{l}</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:14 }}>
              {[...Array(4)].map((_,j)=><Shimmer key={j} style={{ height:80, borderRadius:14 }} />)}
            </div>
            {[...Array(3)].map((_,j)=>(
              <div key={j} style={{ display:'flex', gap:12, marginBottom:10 }}>
                <Shimmer style={{ width:44, height:44, borderRadius:14, flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <Shimmer style={{ height:13, width:'60%', marginBottom:6 }} />
                  <Shimmer style={{ height:10, width:'40%' }} />
                </div>
              </div>
            ))}
          </Card>
        ))}
      </div>
    </div>
  )
}

function ErrorStates({ onToast }:{ onToast:(m:string)=>void }) {
  const errors = [
    { icon:'📊', title:'Unable to Load Dashboard', desc:'We could not retrieve your dashboard data. Please try again.', color:C.error },
    { icon:'📅', title:'Schedule Error',            desc:'Your schedule could not be loaded. Check your connection.',   color:C.warning },
    { icon:'📶', title:'Network Error',             desc:'You appear to be offline. Progress has been saved.',          color:C.muted },
  ]
  return (
    <div style={{ padding:'28px 32px 60px', maxWidth:680 }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:20 }}>Error States</h2>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {errors.map((e,i)=>(
          <Card key={i} style={{ padding:22, border:`1.5px solid ${e.color}30`, background:`${e.color}04` }}>
            <div style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
              <div style={{ width:44, height:44, borderRadius:14, background:`${e.color}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{e.icon}</div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:13, fontWeight:800, color:e.color, marginBottom:4 }}>{e.title}</p>
                <p style={{ fontSize:12, color:C.sub, lineHeight:1.6, marginBottom:12 }}>{e.desc}</p>
                <Btn label="Retry" variant="secondary" small icon={I.refresh} onClick={()=>onToast('Retrying…')} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function SuccessStates({ onToast }:{ onToast:(m:string)=>void }) {
  const items = [
    { icon:'🟢', title:'Availability Updated',  desc:'Your status is now Online. Clients can send you job invitations.',                 color:C.success },
    { icon:'✅', title:'Job Accepted',           desc:'Hospital Appointment accepted. Mohamed Ihsan has been notified.',                  color:C.success },
    { icon:'👤', title:'Profile Updated',        desc:'Your professional headline has been updated successfully.',                        color:C.success },
    { icon:'🏆', title:'Goal Achieved',          desc:"Congratulations! You've hit your weekly target of 8 jobs!",                       color:C.warning },
  ]
  return (
    <div style={{ padding:'28px 32px 60px', maxWidth:680 }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:20 }}>Success States</h2>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {items.map((s,i)=>(
          <Card key={i} style={{ padding:20, border:`1.5px solid ${s.color}30`, background:`${s.color}04` }}>
            <div style={{ display:'flex', gap:12, alignItems:'center' }}>
              <div style={{ width:44, height:44, borderRadius:14, background:`${s.color}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{s.icon}</div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:13, fontWeight:700, color:s.color, marginBottom:3 }}>{s.title}</p>
                <p style={{ fontSize:12, color:C.sub, lineHeight:1.5 }}>{s.desc}</p>
              </div>
              <span style={{ color:s.color, display:'flex', transform:'scale(1.3)' }}>{I.check}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Sub-view type ────────────────────────────────────────────────────────────
type SubView = 'home'|'schedule'|'activeTask'|'invitations'|'calendar'|'performance'|'earnings'|'notifications'|'messages'|'goals'|'profile'|'serviceAreas'|'statusCenter'|'timeline'|'emergency'|'empty'|'loading'|'error'|'success'

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
  { k:'emergency',   l:'Emergency Panel', icon:I.sos,       group:'Emergency' },
  { k:'empty',       l:'Empty States',    icon:I.warning,   group:'Dev' },
  { k:'loading',     l:'Loading States',  icon:I.refresh,   group:'Dev' },
  { k:'error',       l:'Error States',    icon:I.warning,   group:'Dev' },
  { k:'success',     l:'Success States',  icon:I.check,     group:'Dev' },
]

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function CareAgentDashboard() {
  const [sub, setSub] = useState<SubView>('home')
  const [status, setStatus] = useState<Status>('online')
  const [toast, setToast] = useState<string|null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const showToast = (msg:string) => { setToast(msg); setTimeout(()=>setToast(null),2800) }

  const groups = [...new Set(NAV_ITEMS.map(n=>n.group))]

  const renderSub = () => {
    switch(sub) {
      case 'home':        return <DashboardHome status={status} setStatus={setStatus} onNav={s=>setSub(s)} onToast={showToast} />
      case 'schedule':    return <Schedule onToast={showToast} />
      case 'activeTask':  return <ActiveTask onToast={showToast} />
      case 'invitations': return <Invitations onToast={showToast} />
      case 'calendar':    return <CalendarView onToast={showToast} />
      case 'performance': return <Performance />
      case 'earnings':    return <Earnings onToast={showToast} />
      case 'notifications':return <NotificationCenter />
      case 'messages':    return <MessagesPreview onToast={showToast} />
      case 'goals':       return <Goals onToast={showToast} />
      case 'profile':     return <ProfileCompletion onToast={showToast} />
      case 'serviceAreas':return <ServiceAreas onToast={showToast} />
      case 'statusCenter':return <StatusCenter status={status} setStatus={setStatus} onToast={showToast} />
      case 'timeline':    return <ActivityTimeline />
      case 'emergency':   return <EmergencyPanel onToast={showToast} />
      case 'empty':       return <EmptyStates />
      case 'loading':     return <LoadingStates />
      case 'error':       return <ErrorStates onToast={showToast} />
      case 'success':     return <SuccessStates onToast={showToast} />
      default:            return <DashboardHome status={status} setStatus={setStatus} onNav={s=>setSub(s)} onToast={showToast} />
    }
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:C.bg, fontFamily:'Manrope,sans-serif' }}>
      {/* Sidebar */}
      <div className="cad-sidebar" style={{ width:224, background:C.surface, borderRight:`1px solid ${C.border}`, display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh', overflowY:'auto', flexShrink:0 }}>
        {/* Agent mini-header */}
        <div style={{ padding:'18px 18px 12px', borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:8 }}>
            <div style={{ position:'relative' as const }}>
              <Avatar initials="KP" size={36} />
              <div style={{ position:'absolute', bottom:0, right:0, width:10, height:10, borderRadius:'50%', background:STATUS_CONFIG[status].color, border:'2px solid #fff' }} />
            </div>
            <div>
              <p style={{ fontSize:13, fontWeight:800, color:C.type }}>Kasun Perera</p>
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
                <div style={{ position:'absolute', top:-2, right:-2, width:8, height:8, borderRadius:'50%', background:C.error }} />
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
                  {n.k==='invitations'&&<div style={{ marginLeft:'auto', minWidth:18, height:18, borderRadius:99, background:C.error, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:900, color:'#fff', padding:'0 5px' }}>2</div>}
                  {n.k==='notifications'&&<div style={{ marginLeft:'auto', minWidth:18, height:18, borderRadius:99, background:C.error, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:900, color:'#fff', padding:'0 5px' }}>3</div>}
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
              <Avatar initials="KP" size={36} />
              <div>
                <p style={{ fontSize:13, fontWeight:800, color:C.type }}>Kasun Perera</p>
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
