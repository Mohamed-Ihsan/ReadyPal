import { useState, type ReactNode, type CSSProperties } from 'react'

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

function Toast({ msg }:{ msg:string }) {
  return (
    <div style={{ position:'fixed', bottom:28, left:'50%', transform:'translateX(-50%)', zIndex:999, display:'flex', alignItems:'center', gap:10, padding:'12px 22px', borderRadius:14, background:C.type, color:'#fff', fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:700, boxShadow:'0 8px 28px rgba(0,0,0,0.22)', pointerEvents:'none', whiteSpace:'nowrap' as const }}>
      <span style={{display:'flex',color:C.success}}>{I.check}</span>{msg}
    </div>
  )
}

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS: Record<string,{color:string;label:string}> = {
  assigned:    { color:C.info,    label:'Assigned'    },
  confirmed:   { color:C.primary, label:'Confirmed'   },
  preparing:   { color:C.accent,  label:'Preparing'   },
  ready:       { color:'#8B5CF6', label:'Ready'       },
  travelling:  { color:C.warning, label:'Travelling'  },
  arrived:     { color:C.success, label:'Arrived'     },
  cancelled:   { color:C.error,   label:'Cancelled'   },
  rescheduled: { color:C.muted,   label:'Rescheduled' },
}

// ─── Assignment data ──────────────────────────────────────────────────────────
interface Assignment {
  id:string; service:string; client:string; beneficiary:string; beneficiaryAge:number
  date:string; time:string; duration:string; location:string; distance:string
  payment:number; status:keyof typeof STATUS; priority:'high'|'medium'|'low'
  recurring:boolean; confirmed:boolean
}

const ASSIGNMENTS: Assignment[] = [
  { id:'ASN-001', service:'Hospital Appointment Assistance', client:'Mohamed Ihsan',      beneficiary:'Nimal Perera',        beneficiaryAge:74, date:'Mon 20 Jan', time:'9:30 AM',  duration:'3 hrs',   location:'National Hospital, Colombo', distance:'3.2 km', payment:6000,  status:'confirmed',  priority:'high',   recurring:false, confirmed:true  },
  { id:'ASN-002', service:'Home Wellness Visit',             client:'Priya Fernando',     beneficiary:'Rukmini Fernando',    beneficiaryAge:68, date:'Tue 21 Jan', time:'10:00 AM', duration:'4 hrs',   location:'Dehiwela',                  distance:'8.9 km', payment:7000,  status:'assigned',   priority:'medium', recurring:true,  confirmed:false },
  { id:'ASN-003', service:'Medication Collection',           client:'Arjuna Wijesinghe',  beneficiary:'Lalitha Wijesinghe',  beneficiaryAge:71, date:'Tue 21 Jan', time:'3:00 PM',  duration:'1.5 hrs', location:'Liberty Plaza, Col 03',     distance:'4.8 km', payment:3500,  status:'assigned',   priority:'low',    recurring:false, confirmed:false },
  { id:'ASN-004', service:'Post-Surgery Care',               client:'Chamari Dissanayake',beneficiary:'Siripala Dissanayake',beneficiaryAge:79, date:'Wed 22 Jan', time:'9:00 AM',  duration:'6 hrs',   location:'Malay Street, Col 02',      distance:'6.1 km', payment:9500,  status:'confirmed',  priority:'high',   recurring:false, confirmed:true  },
  { id:'ASN-005', service:'Physiotherapy Support',           client:'Nirosha Jayawardena',beneficiary:'Dayaratne Jayawardena',beneficiaryAge:77,date:'Sun 26 Jan', time:'11:00 AM', duration:'2 hrs',   location:'Galle Face Area, Galle',    distance:'120 km', payment:4500,  status:'rescheduled',priority:'medium', recurring:true,  confirmed:false },
  { id:'ASN-006', service:'Night Care Assistance',           client:'Suresh Perera',      beneficiary:'Indrani Perera',      beneficiaryAge:85, date:'Sat 18 Jan', time:'8:00 PM',  duration:'10 hrs',  location:'Borella, Col 08',           distance:'5.5 km', payment:12000, status:'cancelled',  priority:'high',   recurring:false, confirmed:false },
]

// ─── Assignment Card ──────────────────────────────────────────────────────────
function AssignmentCard({ a, onView, compact=false }:{ a:Assignment; onView:()=>void; compact?:boolean }) {
  const st = STATUS[a.status]
  const priColor = a.priority==='high'?C.error:a.priority==='medium'?C.warning:C.muted
  return (
    <Card hover style={{ overflow:'hidden', position:'relative' as const }} onClick={onView}>
      {a.recurring&&<div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${C.primary},${C.accent})` }}/>}
      <div style={{ padding:compact?'16px':'20px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
          <div style={{ flex:1, marginRight:10 }}>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' as const, marginBottom:6 }}>
              <Bdg label={st.label} color={st.color} dot />
              {a.priority==='high'&&<Bdg label="Priority" color={priColor} />}
              {a.recurring&&<Bdg label="Recurring" color={C.primary} />}
            </div>
            <h3 style={{ fontSize:compact?12:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:3, lineHeight:1.3 }}>{a.service}</h3>
            <p style={{ fontSize:11, color:C.muted }}>{a.beneficiary}, {a.beneficiaryAge}yr · {a.client}</p>
          </div>
          <div style={{ textAlign:'right' as const, flexShrink:0 }}>
            <p style={{ fontSize:15, fontWeight:900, color:C.success, fontFamily:'Manrope,sans-serif', lineHeight:1.1 }}>LKR {a.payment.toLocaleString()}</p>
            <p style={{ fontSize:10, color:C.muted }}>{a.distance}</p>
          </div>
        </div>
        <div style={{ display:'flex', gap:14, flexWrap:'wrap' as const, marginBottom:compact?0:10 }}>
          {[{i:I.calendar,v:`${a.date} · ${a.time}`},{i:I.clock,v:a.duration},{i:I.pin,v:a.location.split(',')[0]}].map((m,i)=>(
            <div key={i} style={{ display:'flex', gap:4, alignItems:'center' }}>
              <span style={{color:C.muted,display:'flex',transform:'scale(0.9)'}}>{m.i}</span>
              <p style={{ fontSize:11, color:C.sub }}>{m.v}</p>
            </div>
          ))}
        </div>
        {!compact&&(
          <div style={{ display:'flex', gap:8, paddingTop:10, borderTop:`1px solid ${C.border}` }}>
            <Btn label="View Details" variant="secondary" small onClick={()=>onView()} />
            <Btn label="Navigate" variant="ghost" small icon={I.nav} />
          </div>
        )}
      </div>
    </Card>
  )
}

// ─── Assignment Dashboard ─────────────────────────────────────────────────────
function Dashboard({ onNav, onView, onToast }:{ onNav:(s:SubView)=>void; onView:(id:string)=>void; onToast:(m:string)=>void }) {
  const today = ASSIGNMENTS.filter(a=>a.date.includes('20 Jan')&&a.status!=='cancelled')
  const upcoming = ASSIGNMENTS.filter(a=>!a.date.includes('20 Jan')&&a.status!=='cancelled'&&a.status!=='rescheduled')
  const pending = ASSIGNMENTS.filter(a=>!a.confirmed&&a.status!=='cancelled')
  const cancelled = ASSIGNMENTS.filter(a=>a.status==='cancelled'||a.status==='rescheduled')

  const quickActions = [
    {icon:I.nav,  label:'Navigate',       cb:()=>onNav('route')},
    {icon:I.msg,  label:'Message Client',  cb:()=>onToast('Opening messages…')},
    {icon:I.phone,label:'Call Client',     cb:()=>onToast('Calling Mohamed Ihsan…')},
    {icon:I.user, label:'Beneficiary',     cb:()=>onNav('beneficiary')},
    {icon:I.doc,  label:'Documents',       cb:()=>onNav('documents')},
    {icon:I.alert,label:'Report Issue',    cb:()=>onToast('Opening report…')},
  ]

  return (
    <div style={{ padding:'24px 28px 60px' }}>
      {/* Header card */}
      <Card style={{ padding:'20px 24px', marginBottom:20, background:`linear-gradient(135deg,${C.primary},#00959E)`, border:'none', boxShadow:`0 8px 28px ${C.primary}30` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap' as const, gap:14 }}>
          <div>
            <p style={{ fontSize:12, color:'rgba(255,255,255,0.7)', marginBottom:4 }}>Monday, 20 January 2025</p>
            <h2 style={{ fontSize:22, fontWeight:900, color:'#fff', fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Good morning, Kasun 👋</h2>
            <div style={{ display:'flex', gap:14, flexWrap:'wrap' as const }}>
              {[{v:today.length,l:'Today'},{v:upcoming.length,l:'Upcoming'},{v:pending.length,l:'Pending'}].map((s,i)=>(
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
          {label:"Today's Jobs",    value:today.length.toString(),              sub:'1 confirmed, 0 pending', color:C.primary},
          {label:'This Week',       value:'6',                                   sub:'4 confirmed',            color:C.info},
          {label:'Weekly Earnings', value:'LKR 42,500',                          sub:'Projected',              color:C.success},
          {label:'Completion Rate', value:'98%',                                 sub:'All time',               color:C.warning},
        ].map((k,i)=>(
          <Card key={i} style={{ padding:18 }}>
            <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:8 }}>{k.label}</p>
            <p style={{ fontSize:22, fontWeight:900, color:k.color, fontFamily:'Manrope,sans-serif', marginBottom:3, lineHeight:1 }}>{k.value}</p>
            <p style={{ fontSize:11, color:C.muted }}>{k.sub}</p>
          </Card>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:18, marginBottom:18 }} className="jm-main-split">
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Today */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Today's Assignments" action="See All" onAction={()=>onNav('calendar')} />
            {today.length===0
              ? <p style={{ fontSize:13, color:C.muted }}>No assignments today.</p>
              : today.map(a=>(
                <div key={a.id} style={{ marginBottom:14 }}>
                  <AssignmentCard a={a} onView={()=>onView(a.id)} />
                </div>
              ))
            }
          </Card>

          {/* Upcoming */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Upcoming Visits" action={`View All (${upcoming.length})`} onAction={()=>onNav('calendar')} />
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {upcoming.slice(0,3).map(a=><AssignmentCard key={a.id} a={a} onView={()=>onView(a.id)} compact />)}
            </div>
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
            {pending.length===0
              ? <p style={{ fontSize:12, color:C.muted }}>All assignments confirmed.</p>
              : pending.slice(0,3).map(a=>(
                <div key={a.id} style={{ padding:'10px 0', borderBottom:`1px solid ${C.border}` }}>
                  <p style={{ fontSize:12, fontWeight:700, color:C.type, marginBottom:3 }}>{a.service}</p>
                  <p style={{ fontSize:11, color:C.muted, marginBottom:6 }}>{a.date} · {a.time}</p>
                  <div style={{ display:'flex', gap:6 }}>
                    <Btn label="Confirm" variant="success" small onClick={()=>onToast('Assignment confirmed!')} />
                    <Btn label="Reschedule" variant="ghost" small onClick={()=>onNav('schedule')} />
                  </div>
                </div>
              ))
            }
          </Card>

          {/* Cancelled / rescheduled */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Recent Updates" />
            {cancelled.map(a=>(
              <div key={a.id} style={{ display:'flex', gap:10, alignItems:'center', padding:'8px 0', borderBottom:`1px solid ${C.border}` }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:STATUS[a.status].color, flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:12, fontWeight:600, color:C.type }}>{a.service}</p>
                  <p style={{ fontSize:11, color:C.muted }}>{STATUS[a.status].label} · {a.date}</p>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* Activity feed preview */}
      <Card style={{ padding:22 }}>
        <SectionTitle title="Recent Activity" action="Full Feed" onAction={()=>onNav('activity')} />
        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
          {[
            {icon:'✅',txt:'Hospital Appointment confirmed by Mohamed Ihsan',time:'2 hrs ago',col:C.success},
            {icon:'📅',txt:'Home Wellness Visit rescheduled to Tue 21 Jan',time:'4 hrs ago',col:C.warning},
            {icon:'📄',txt:'Medical report uploaded for Nimal Perera',time:'Yesterday',col:C.primary},
            {icon:'💬',txt:'Message from Mohamed Ihsan: "Please be on time"',time:'Yesterday',col:C.info},
          ].map((ev,i,arr)=>(
            <div key={i} style={{ display:'flex', gap:12, paddingBottom:i<arr.length-1?12:0 }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                <div style={{ width:32, height:32, borderRadius:10, background:`${ev.col}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>{ev.icon}</div>
                {i<arr.length-1&&<div style={{ width:2, flex:1, background:C.border, margin:'4px 0' }} />}
              </div>
              <div style={{ paddingTop:4 }}>
                <p style={{ fontSize:12, color:C.type, marginBottom:2 }}>{ev.txt}</p>
                <p style={{ fontSize:11, color:C.muted }}>{ev.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Job Details ──────────────────────────────────────────────────────────────
function JobDetails({ a, onBack, onNav, onToast }:{ a:Assignment; onBack:()=>void; onNav:(s:SubView)=>void; onToast:(m:string)=>void }) {
  const [docOpen, setDocOpen] = useState(false)
  const st = STATUS[a.status]
  const timeline = [
    {l:'Assignment Confirmed',  done:true,  t:'18 Jan, 11:00 AM'},
    {l:'Agent Accepted',        done:true,  t:'18 Jan, 11:15 AM'},
    {l:'Visit Scheduled',       done:true,  t:'20 Jan, 9:30 AM'},
    {l:'Reminder Sent',         done:true,  t:'19 Jan, 8:00 PM'},
    {l:'Agent Ready',           done:false, t:'Today, 9:00 AM'},
    {l:'Travel Starts',         done:false, t:'Today, 9:00 AM'},
    {l:'Arrival',               done:false, t:'Today, ~9:30 AM'},
    {l:'Care Starts',           done:false, t:'Today, 9:30 AM'},
  ]
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
              {a.priority==='high'&&<Bdg label="High Priority" color={C.error} />}
              {a.recurring&&<Bdg label="Recurring" color={C.primary} />}
            </div>
            <h1 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:5, lineHeight:1.2 }}>{a.service}</h1>
            <p style={{ fontSize:12, color:C.muted, marginBottom:12 }}>Ref: {a.id} · Assigned to Kasun Perera</p>
            <div style={{ display:'flex', gap:16, flexWrap:'wrap' as const }}>
              {[{i:I.calendar,v:`${a.date}, ${a.time}`},{i:I.clock,v:a.duration},{i:I.pin,v:a.location}].map((m,i)=>(
                <div key={i} style={{ display:'flex', gap:5, alignItems:'center' }}>
                  <span style={{color:C.muted,display:'flex'}}>{m.i}</span>
                  <p style={{ fontSize:12, color:C.sub }}>{m.v}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ textAlign:'right' as const }}>
            <p style={{ fontSize:26, fontWeight:900, color:C.success, fontFamily:'Manrope,sans-serif', lineHeight:1 }}>LKR {a.payment.toLocaleString()}</p>
            <p style={{ fontSize:11, color:C.muted, marginBottom:12 }}>{a.distance} from you</p>
          </div>
        </div>
        <div style={{ display:'flex', gap:8, marginTop:16, paddingTop:16, borderTop:`1px solid ${C.border}`, flexWrap:'wrap' as const }}>
          <Btn label="Open Navigation" icon={I.nav} onClick={()=>onNav('route')} />
          <Btn label="Visit Preparation" variant="secondary" icon={I.check} onClick={()=>onNav('preparation')} />
          <Btn label="Message Client" variant="ghost" small icon={I.msg} onClick={()=>onToast('Opening messages…')} />
          <Btn label="Call" variant="ghost" small icon={I.phone} onClick={()=>onToast('Calling…')} />
        </div>
      </Card>

      <div style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:16 }} className="jm-split">
        {/* Left */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Beneficiary */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Beneficiary Information" action="Full Profile" onAction={()=>onNav('beneficiary')} />
            <div style={{ display:'flex', gap:12, alignItems:'flex-start', marginBottom:14 }}>
              <div style={{ width:48, height:48, borderRadius:'50%', background:`${C.accent}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>👴</div>
              <div>
                <p style={{ fontSize:15, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{a.beneficiary}</p>
                <p style={{ fontSize:12, color:C.muted }}>Age {a.beneficiaryAge} · Male · Sinhala</p>
                <Bdg label="Mobility Aid Required" color={C.warning} />
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
              {[{l:'Medical Condition',v:'Type 2 Diabetes'},{l:'Mobility',v:'Walking Aid'},{l:'Allergies',v:'Penicillin'},{l:'Language',v:'Sinhala / English'}].map((r,i)=>(
                <div key={i} style={{ padding:'10px 12px', borderRadius:10, background:C.bg }}>
                  <p style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.06em', marginBottom:3 }}>{r.l}</p>
                  <p style={{ fontSize:12, fontWeight:600, color:C.type }}>{r.v}</p>
                </div>
              ))}
            </div>
            <div style={{ padding:'12px', borderRadius:12, background:`${C.warning}08`, border:`1.5px solid ${C.warning}20` }}>
              <p style={{ fontSize:11, fontWeight:800, color:C.warning, marginBottom:4 }}>Special Instructions</p>
              <p style={{ fontSize:12, color:C.type, lineHeight:1.7 }}>Moves slowly — allow extra time. Prefers window seat at hospital. Bring biscuits for blood sugar.</p>
            </div>
          </Card>

          {/* Client */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Client Information" />
            <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:14 }}>
              <Avatar initials="MI" size={44} />
              <div>
                <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:2 }}>
                  <p style={{ fontSize:14, fontWeight:700, color:C.type }}>{a.client}</p>
                  <span style={{ color:C.primary, display:'flex', transform:'scale(0.9)' }}>{I.shield}</span>
                </div>
                <div style={{ display:'flex', gap:4, alignItems:'center' }}>
                  <span style={{ color:C.warning, display:'flex' }}>{I.star}</span>
                  <p style={{ fontSize:12, fontWeight:700, color:C.type }}>4.8</p>
                  <p style={{ fontSize:11, color:C.muted }}>· 12 jobs · Verified</p>
                </div>
              </div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <Btn label="Message" variant="secondary" small icon={I.msg} full onClick={()=>onToast('Opening messages…')} />
              <Btn label="Call" variant="ghost" small icon={I.phone} full onClick={()=>onToast('Calling…')} />
            </div>
          </Card>

          {/* Emergency contacts */}
          <Card style={{ padding:22, border:`1.5px solid ${C.error}20`, background:`${C.error}04` }}>
            <SectionTitle title="Emergency Contacts" />
            {[{name:'Kumari Perera',rel:'Daughter',phone:'+94 77 345 6789'},{name:'Saman Perera',rel:'Son',phone:'+94 71 234 5678'}].map((ec,i)=>(
              <div key={i} style={{ display:'flex', gap:10, alignItems:'center', padding:'8px 0', borderBottom:i===0?`1px solid ${C.border}`:'none' }}>
                <Avatar initials={ec.name.split(' ').map(x=>x[0]).join('')} color={C.error} size={36} />
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{ec.name}</p>
                  <p style={{ fontSize:11, color:C.muted }}>{ec.rel} · {ec.phone}</p>
                </div>
                <button onClick={()=>onToast(`Calling ${ec.name}…`)} style={{ width:30, height:30, borderRadius:9, background:`${C.error}10`, border:'none', cursor:'pointer', color:C.error, display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{display:'flex'}}>{I.phone}</span></button>
              </div>
            ))}
          </Card>
        </div>

        {/* Right */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Visit timeline */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Visit Timeline" />
            <div style={{ display:'flex', flexDirection:'column' }}>
              {timeline.map((t,i)=>(
                <div key={i} style={{ display:'flex', gap:12 }}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                    <div style={{ width:22, height:22, borderRadius:'50%', background:t.done?C.success:`${C.primary}10`, border:`2px solid ${t.done?C.success:C.border}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {t.done&&<span style={{display:'flex',color:'#fff',transform:'scale(0.65)'}}>{I.check}</span>}
                    </div>
                    {i<timeline.length-1&&<div style={{ width:2, flex:1, background:t.done?`${C.success}40`:C.border, margin:'3px 0' }} />}
                  </div>
                  <div style={{ paddingBottom:i<timeline.length-1?10:0 }}>
                    <p style={{ fontSize:12, fontWeight:t.done?700:500, color:t.done?C.type:C.muted }}>{t.l}</p>
                    <p style={{ fontSize:10, color:C.muted }}>{t.t}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Documents */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Documents" action="View All" onAction={()=>setDocOpen(v=>!v)} />
            {['Care Instructions.pdf','Prescription — Dr. Silva.pdf','Hospital Letter.pdf'].map((doc,i)=>(
              <div key={i} style={{ display:'flex', gap:10, alignItems:'center', padding:'8px 0', borderBottom:i<2?`1px solid ${C.border}`:'none' }}>
                <div style={{ width:32, height:32, borderRadius:9, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary }}>
                  <span style={{display:'flex'}}>{I.doc}</span>
                </div>
                <p style={{ flex:1, fontSize:12, color:C.type }}>{doc}</p>
                <button onClick={()=>onToast('Downloading…')} style={{ color:C.muted, background:'none', border:'none', cursor:'pointer', display:'flex' }}><span style={{display:'flex'}}>{I.download}</span></button>
              </div>
            ))}
          </Card>

          {/* Budget */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Payment" />
            {[{l:'Agreed service fee',v:`LKR ${Math.round(a.payment*.92).toLocaleString()}`},{l:'Platform fee (8%)',v:`LKR ${Math.round(a.payment*.08).toLocaleString()}`},{l:'Your net pay',v:`LKR ${Math.round(a.payment*.92).toLocaleString()}`,bold:true}].map((r,i)=>(
              <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:i<2?`1px solid ${C.border}`:'none' }}>
                <p style={{ fontSize:12, color:C.sub }}>{r.l}</p>
                <p style={{ fontSize:12, fontWeight:(r as any).bold?900:700, color:(r as any).bold?C.success:C.type, fontFamily:(r as any).bold?'Manrope,sans-serif':undefined }}>{r.v}</p>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}

// ─── Visit Preparation ────────────────────────────────────────────────────────
function Preparation({ a, onToast }:{ a:Assignment; onToast:(m:string)=>void }) {
  const items = [
    {l:'Review beneficiary care notes',         cat:'planning'},
    {l:'Confirm route to National Hospital',     cat:'travel'},
    {l:'Charge phone to 100%',                   cat:'equipment'},
    {l:'Bring walking aid support equipment',    cat:'equipment'},
    {l:'Confirm appointment time with client',   cat:'communication'},
    {l:'Review medication list for Nimal',       cat:'medical'},
    {l:'Prepare consent and ID documents',       cat:'documentation'},
    {l:'Set navigation to National Hospital',    cat:'travel'},
    {l:'Check weather and traffic',              cat:'travel'},
    {l:'Prepare snacks for blood sugar support', cat:'medical'},
  ]
  const [checked, setChecked] = useState<Set<number>>(new Set([0,1,2]))
  const pct = Math.round((checked.size/items.length)*100)
  const catColors: Record<string,string> = { planning:C.info, travel:C.primary, equipment:C.accent, communication:C.success, medical:C.error, documentation:C.warning }

  return (
    <div style={{ maxWidth:680, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>Visit Preparation</h2>
      <p style={{ fontSize:13, color:C.muted, marginBottom:22 }}>{a.service} · {a.date}, {a.time}</p>

      {/* Progress */}
      <Card style={{ padding:22, marginBottom:18, background:`linear-gradient(135deg,${C.primary}06,${C.surface})`, border:`1.5px solid ${C.primary}20` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <p style={{ fontSize:13, fontWeight:700, color:C.type }}>Preparation Progress</p>
          <p style={{ fontSize:22, fontWeight:900, color:pct===100?C.success:C.primary, fontFamily:'Manrope,sans-serif' }}>{pct}%</p>
        </div>
        <div style={{ height:10, borderRadius:99, background:`${C.primary}12`, overflow:'hidden', marginBottom:8 }}>
          <div style={{ width:`${pct}%`, height:'100%', background:`linear-gradient(90deg,${C.primary},${C.success})`, borderRadius:99, transition:'width 0.4s' }} />
        </div>
        <p style={{ fontSize:11, color:C.muted }}>{checked.size} of {items.length} tasks complete</p>
        {pct===100&&(
          <div style={{ marginTop:12, display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:20 }}>🎉</span>
            <p style={{ fontSize:13, fontWeight:700, color:C.success }}>All done! You are ready for today's visit.</p>
          </div>
        )}
      </Card>

      <Card style={{ padding:22 }}>
        <SectionTitle title="Checklist" action="Mark All Done" onAction={()=>{ setChecked(new Set(items.map((_,i)=>i))); onToast('All tasks marked complete!') }} />
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
function CalendarView({ onToast }:{ onToast:(m:string)=>void }) {
  const [view, setView] = useState<'daily'|'weekly'|'monthly'>('weekly')
  const [selected, setSelected] = useState(20)
  const days = ['Mon 20','Tue 21','Wed 22','Thu 23','Fri 24','Sat 25','Sun 26']
  const jobDays: Record<number,Assignment[]> = {
    20:[ASSIGNMENTS[0]], 21:[ASSIGNMENTS[1],ASSIGNMENTS[2]], 22:[ASSIGNMENTS[3]], 26:[ASSIGNMENTS[4]]
  }
  const month = Array.from({length:31},(_,i)=>i+1)

  return (
    <div style={{ padding:'28px 32px 60px', maxWidth:900 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
        <div>
          <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>Schedule</h2>
          <p style={{ fontSize:13, color:C.muted }}>January 2025 · {ASSIGNMENTS.filter(a=>a.status!=='cancelled').length} assignments</p>
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
          {days.map((d,i)=>{
            const dayNum = 20+i
            const jobs = jobDays[dayNum]||[]
            const isSel = dayNum===selected
            return (
              <div key={d} onClick={()=>setSelected(dayNum)} style={{ cursor:'pointer', borderRadius:14, border:`2px solid ${isSel?C.primary:C.border}`, background:isSel?`${C.primary}06`:C.surface, padding:12, minHeight:120, transition:'all 0.15s' }}>
                <p style={{ fontSize:10, fontWeight:800, color:isSel?C.primary:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.06em', marginBottom:4 }}>{d.split(' ')[0]}</p>
                <p style={{ fontSize:18, fontWeight:900, color:isSel?C.primary:C.type, fontFamily:'Manrope,sans-serif', marginBottom:8 }}>{d.split(' ')[1]}</p>
                {jobs.map((j,ji)=>(
                  <div key={ji} style={{ padding:'4px 7px', borderRadius:6, background:`${STATUS[j.status].color}15`, marginBottom:4 }}>
                    <p style={{ fontSize:9, fontWeight:700, color:STATUS[j.status].color, lineHeight:1.3 }}>{j.time} {j.service.split(' ')[0]}</p>
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
            {[...Array(2)].map((_,i)=><div key={`e${i}`}/>)}
            {month.map(d=>{
              const hasJob = d in jobDays
              const isSel = d===selected
              return (
                <button key={d} onClick={()=>setSelected(d)} style={{ aspectRatio:'1', borderRadius:10, border:`1.5px solid ${isSel?C.primary:hasJob?`${C.primary}20`:'transparent'}`, background:isSel?C.primary:hasJob?`${C.primary}06`:'transparent', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2 }}>
                  <p style={{ fontSize:12, fontWeight:isSel||hasJob?800:400, color:isSel?'#fff':hasJob?C.primary:C.type }}>{d}</p>
                  {hasJob&&<div style={{ width:4, height:4, borderRadius:'50%', background:isSel?'rgba(255,255,255,0.8)':C.primary }}/>}
                </button>
              )
            })}
          </div>
        </Card>
      )}

      {view==='daily'&&(
        <Card style={{ padding:22 }}>
          <SectionTitle title={`Mon 20 Jan — Day View`} />
          {[{time:'9:00 AM',label:'Preparation'},{time:'9:30 AM',label:'Hospital Appointment — Nimal Perera'},{time:'12:30 PM',label:'Task Complete / Return'},{time:'2:00 PM',label:'Free'}].map((s,i)=>(
            <div key={i} style={{ display:'flex', gap:14, paddingBottom:14 }}>
              <p style={{ fontSize:11, fontWeight:700, color:C.muted, width:60, flexShrink:0 }}>{s.time}</p>
              <div style={{ flex:1, padding:'10px 14px', borderRadius:10, background:s.label.includes('Appointment')?`${C.primary}08`:C.bg, border:`1px solid ${s.label.includes('Appointment')?`${C.primary}20`:C.border}` }}>
                <p style={{ fontSize:12, fontWeight:600, color:C.type }}>{s.label}</p>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* Selected day detail */}
      {selected in jobDays&&(
        <div style={{ marginTop:18 }}>
          <p style={{ fontSize:13, fontWeight:700, color:C.muted, marginBottom:10 }}>Jan {selected} — {(jobDays[selected]||[]).length} assignment(s)</p>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {(jobDays[selected]||[]).map(a=><AssignmentCard key={a.id} a={a} onView={()=>{}} compact />)}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Route Planning ───────────────────────────────────────────────────────────
function RoutePlanning({ a, onToast }:{ a:Assignment; onToast:(m:string)=>void }) {
  return (
    <div style={{ maxWidth:700, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Route Planning</h2>
      {/* Map placeholder */}
      <Card style={{ overflow:'hidden', marginBottom:18 }}>
        <div style={{ height:260, background:`linear-gradient(135deg,${C.bg},#DCE8EA)`, position:'relative' as const, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:8 }}>
          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.07 }} preserveAspectRatio="none"><defs><pattern id="rg" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M 36 0 L 0 0 0 36" fill="none" stroke={C.primary} strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#rg)"/></svg>
          {/* Route line */}
          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} viewBox="0 0 400 260" preserveAspectRatio="none">
            <path d="M 80 200 C 120 180 160 140 200 120 C 240 100 280 90 320 80" stroke={C.primary} strokeWidth="3" fill="none" strokeDasharray="8 4" opacity="0.6"/>
          </svg>
          {/* Origin pin */}
          <div style={{ position:'absolute', bottom:50, left:'20%', transform:'translate(-50%,0)' }}>
            <div style={{ width:12, height:12, borderRadius:'50%', background:C.success, boxShadow:`0 0 0 5px ${C.success}30` }} />
            <p style={{ fontSize:9, fontWeight:800, color:C.success, marginTop:4, whiteSpace:'nowrap' as const }}>You</p>
          </div>
          {/* Destination pin */}
          <div style={{ position:'absolute', top:60, right:'20%', transform:'translate(50%,0)', zIndex:2 }}>
            <div style={{ background:C.primary, color:'#fff', borderRadius:'8px 8px 2px 2px', padding:'5px 9px', fontSize:10, fontWeight:800, boxShadow:`0 3px 12px ${C.primary}60`, whiteSpace:'nowrap' as const }}>National Hospital</div>
            <div style={{ width:8, height:8, background:C.primary, transform:'rotate(45deg)', margin:'-4px auto 0', borderRadius:2 }} />
          </div>
          <div style={{ position:'relative', zIndex:1 }}>
            <p style={{ fontSize:13, fontWeight:700, color:C.sub, background:'rgba(255,255,255,0.9)', padding:'5px 14px', borderRadius:8 }}>Route preview · Interactive map coming soon</p>
          </div>
        </div>
        <div style={{ padding:22 }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:18 }}>
            {[{l:'Distance',v:'3.2 km'},{l:'Travel Time',v:'~18 min'},{l:'Traffic',v:'Moderate'}].map((s,i)=>(
              <div key={i} style={{ textAlign:'center' as const, padding:'12px', borderRadius:12, background:C.bg }}>
                <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:4 }}>{s.l}</p>
                <p style={{ fontSize:15, fontWeight:900, color:i===2?C.warning:C.primary, fontFamily:'Manrope,sans-serif' }}>{s.v}</p>
              </div>
            ))}
          </div>
          <div style={{ marginBottom:16 }}>
            <p style={{ fontSize:12, fontWeight:700, color:C.muted, marginBottom:8 }}>Destination</p>
            <div style={{ display:'flex', gap:8, alignItems:'flex-start', padding:'12px', borderRadius:12, background:C.bg }}>
              <span style={{ color:C.primary, display:'flex', marginTop:2 }}>{I.pin}</span>
              <div>
                <p style={{ fontSize:13, fontWeight:700, color:C.type }}>National Hospital, Colombo</p>
                <p style={{ fontSize:11, color:C.muted }}>Regent Street, Colombo 10</p>
              </div>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
            {[{e:'🏥',l:'Nearest Hospital',v:'National Hospital — 0.0 km'},{e:'💊',l:'Nearest Pharmacy',v:'Osusala Pharmacy — 0.4 km'},{e:'🅿️',l:'Parking',v:'Hospital car park · LKR 80/hr'},{e:'🌦️',l:'Weather',v:'28°C, Partly cloudy'}].map((r,i)=>(
              <div key={i} style={{ padding:'10px 12px', borderRadius:10, background:C.bg, display:'flex', gap:8, alignItems:'flex-start' }}>
                <span style={{ fontSize:18 }}>{r.e}</span>
                <div>
                  <p style={{ fontSize:10, fontWeight:700, color:C.muted }}>{r.l}</p>
                  <p style={{ fontSize:11, color:C.type }}>{r.v}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <Btn label="Open Navigation" icon={I.nav} onClick={()=>onToast('Opening maps…')} full />
            <Btn label="Share Location" variant="secondary" small onClick={()=>onToast('Sharing location…')} />
          </div>
        </div>
      </Card>
    </div>
  )
}

// ─── Beneficiary Profile ──────────────────────────────────────────────────────
function BeneficiaryProfile() {
  const sections = [
    {title:'Care Preferences', items:['Window seat at hospital','Gentle pace — no rushing','Prefers male caregivers','Sinhala primary language']},
    {title:'Medical Notes',    items:['Type 2 Diabetes — check blood sugar','Mild hypertension — BP medication daily','Post-fracture right hip — walking aid required','Penicillin allergy — critical']},
  ]
  return (
    <div style={{ maxWidth:720, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Beneficiary Profile</h2>
      <Card style={{ padding:24, marginBottom:16 }}>
        <div style={{ display:'flex', gap:16, alignItems:'flex-start', marginBottom:20 }}>
          <div style={{ width:72, height:72, borderRadius:'50%', background:`${C.accent}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, flexShrink:0 }}>👴</div>
          <div>
            <h3 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>Nimal Perera</h3>
            <p style={{ fontSize:13, color:C.muted, marginBottom:8 }}>Age 74 · Male · Sinhala / English</p>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' as const }}>
              <Bdg label="Mobility Aid" color={C.warning} />
              <Bdg label="Diabetic" color={C.error} />
              <Bdg label="Hypertension" color={C.accent} />
            </div>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }} className="jm-4col">
          {[{l:'Age',v:'74'},{l:'Gender',v:'Male'},{l:'Language',v:'Sinhala'},{l:'Mobility',v:'Walking Aid'}].map((s,i)=>(
            <div key={i} style={{ padding:'10px 12px', borderRadius:12, background:C.bg, textAlign:'center' as const }}>
              <p style={{ fontSize:10, fontWeight:700, color:C.muted, marginBottom:4 }}>{s.l}</p>
              <p style={{ fontSize:13, fontWeight:800, color:C.type }}>{s.v}</p>
            </div>
          ))}
        </div>
      </Card>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="jm-2col">
        {sections.map((sec,i)=>(
          <Card key={i} style={{ padding:22 }}>
            <SectionTitle title={sec.title} />
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {sec.items.map((item,j)=>(
                <div key={j} style={{ display:'flex', gap:9, alignItems:'flex-start' }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:i===1?C.error:C.primary, marginTop:5, flexShrink:0 }} />
                  <p style={{ fontSize:12, color:C.type, lineHeight:1.5 }}>{item}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
      <Card style={{ padding:22, marginTop:14, border:`1.5px solid ${C.error}20`, background:`${C.error}04` }}>
        <SectionTitle title="Emergency Contacts" />
        {[{name:'Kumari Perera',rel:'Daughter',phone:'+94 77 345 6789'},{name:'Saman Perera',rel:'Son',phone:'+94 71 234 5678'}].map((ec,i)=>(
          <div key={i} style={{ display:'flex', gap:10, alignItems:'center', padding:'8px 0', borderBottom:i===0?`1px solid ${C.border}`:'none' }}>
            <Avatar initials={ec.name.split(' ').map(x=>x[0]).join('')} color={C.error} size={36} />
            <div style={{ flex:1 }}>
              <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{ec.name} · {ec.rel}</p>
              <p style={{ fontSize:11, color:C.muted }}>{ec.phone}</p>
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── Document Center ──────────────────────────────────────────────────────────
function DocumentCenter({ onToast }:{ onToast:(m:string)=>void }) {
  const docs = [
    {cat:'Care Instructions',      name:'Care Plan — Nimal Perera.pdf',         size:'124 KB', date:'15 Jan',  icon:'📋'},
    {cat:'Prescriptions',          name:'Prescription — Dr. K. Silva.pdf',       size:'88 KB',  date:'12 Jan',  icon:'💊'},
    {cat:'Hospital Appointments',  name:'Appointment Letter — NHC.pdf',           size:'52 KB',  date:'10 Jan',  icon:'🏥'},
    {cat:'Medical Reports',        name:'Blood Test Results — Jan 2025.pdf',      size:'210 KB', date:'8 Jan',   icon:'🧪'},
    {cat:'Consent Forms',          name:'Care Consent — Mohamed Ihsan.pdf',       size:'96 KB',  date:'5 Jan',   icon:'✍️'},
    {cat:'Care Instructions',      name:'Post-Hospital Instructions.pdf',         size:'64 KB',  date:'18 Jan',  icon:'📋'},
  ]
  const cats = [...new Set(docs.map(d=>d.cat))]
  return (
    <div style={{ maxWidth:700, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Document Center</h2>
      {cats.map(cat=>(
        <div key={cat} style={{ marginBottom:20 }}>
          <p style={{ fontSize:12, fontWeight:800, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.07em', marginBottom:10 }}>{cat}</p>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {docs.filter(d=>d.cat===cat).map((doc,i)=>(
              <Card key={i} hover style={{ padding:16 }}>
                <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{doc.icon}</div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:2 }}>{doc.name}</p>
                    <p style={{ fontSize:11, color:C.muted }}>{doc.size} · Added {doc.date}</p>
                  </div>
                  <div style={{ display:'flex', gap:6 }}>
                    <button onClick={()=>onToast('Opening preview…')} style={{ padding:'6px 12px', borderRadius:8, border:`1px solid ${C.border}`, background:'#FAFAFA', cursor:'pointer', fontSize:11, fontWeight:700, color:C.sub, fontFamily:'Manrope,sans-serif' }}>Preview</button>
                    <button onClick={()=>onToast('Downloading…')} style={{ padding:'6px 10px', borderRadius:8, border:`1px solid ${C.border}`, background:`${C.primary}10`, cursor:'pointer', color:C.primary, display:'flex', alignItems:'center' }}><span style={{display:'flex'}}>{I.download}</span></button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Schedule Management ──────────────────────────────────────────────────────
function ScheduleManagement({ a, onToast }:{ a:Assignment; onToast:(m:string)=>void }) {
  const [mode, setMode] = useState<'view'|'reschedule'|'suggest'>('view')
  const [reason, setReason] = useState('')
  return (
    <div style={{ maxWidth:640, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Schedule Management</h2>
      <Card style={{ padding:24, marginBottom:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18 }}>
          <div>
            <p style={{ fontSize:13, fontWeight:800, color:C.type, marginBottom:4 }}>Current Schedule</p>
            <p style={{ fontSize:15, fontWeight:900, color:C.primary, fontFamily:'Manrope,sans-serif' }}>{a.date}, {a.time}</p>
            <p style={{ fontSize:12, color:C.muted }}>{a.duration} · {a.location}</p>
          </div>
          <Bdg label={STATUS[a.status].label} color={STATUS[a.status].color} dot />
        </div>
        <div style={{ display:'flex', gap:8 }}>
          {(['reschedule','suggest'] as const).map(m=>(
            <button key={m} onClick={()=>setMode(m)}
              style={{ padding:'9px 16px', borderRadius:10, border:`1.5px solid ${mode===m?C.primary:C.border}`, background:mode===m?`${C.primary}06`:'#FAFAFA', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:700, color:mode===m?C.primary:C.sub, transition:'all 0.12s' }}>
              {m==='reschedule'?'Request Reschedule':'Suggest Alternative'}
            </button>
          ))}
        </div>
      </Card>
      {(mode==='reschedule'||mode==='suggest')&&(
        <Card style={{ padding:24 }}>
          <h3 style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:16 }}>
            {mode==='reschedule'?'Request Reschedule':'Suggest Alternative Time'}
          </h3>
          <div style={{ marginBottom:14 }}>
            <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:6 }}>New Date & Time</p>
            <input type="datetime-local" style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, background:'#FAFAFA', outline:'none', boxSizing:'border-box' as const }} />
          </div>
          <div style={{ marginBottom:16 }}>
            <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:6 }}>Reason</p>
            <textarea value={reason} onChange={e=>setReason(e.target.value)} rows={3} placeholder="Please explain why you need to change the schedule…"
              style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, background:'#FAFAFA', outline:'none', resize:'vertical' as const, boxSizing:'border-box' as const, lineHeight:1.6 }} />
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <Btn label="Send Request" onClick={()=>{ onToast('Reschedule request sent to client'); setMode('view') }} />
            <Btn label="Cancel" variant="ghost" onClick={()=>setMode('view')} />
          </div>
        </Card>
      )}
    </div>
  )
}

// ─── Cancellation Management ──────────────────────────────────────────────────
function CancellationManagement({ onToast }:{ onToast:(m:string)=>void }) {
  const [reason, setReason] = useState('')
  const cancelled = ASSIGNMENTS.find(a=>a.status==='cancelled')!
  return (
    <div style={{ maxWidth:640, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Cancellation Management</h2>
      <Card style={{ padding:22, marginBottom:16, border:`1.5px solid ${C.error}30`, background:`${C.error}04` }}>
        <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:12 }}>
          <div style={{ width:36, height:36, borderRadius:12, background:`${C.error}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>❌</div>
          <div>
            <p style={{ fontSize:13, fontWeight:800, color:C.error }}>Assignment Cancelled</p>
            <p style={{ fontSize:11, color:C.muted }}>Ref: {cancelled.id} · {cancelled.date}</p>
          </div>
        </div>
        <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:4 }}>{cancelled.service}</p>
        <p style={{ fontSize:12, color:C.muted }}>{cancelled.client} → {cancelled.beneficiary}</p>
      </Card>
      {/* Timeline */}
      <Card style={{ padding:22, marginBottom:16 }}>
        <SectionTitle title="Cancellation Timeline" />
        {[{l:'Assignment Confirmed',t:'18 Jan, 11 AM',done:true},{l:'Cancellation Requested by Client',t:'19 Jan, 3:00 PM',done:true},{l:'Agent Notified',t:'19 Jan, 3:05 PM',done:true},{l:'Refund Processed (Policy)',t:'20 Jan (auto)',done:false}].map((t,i,arr)=>(
          <div key={i} style={{ display:'flex', gap:12 }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
              <div style={{ width:20, height:20, borderRadius:'50%', background:t.done?C.error:`${C.error}10`, border:`2px solid ${t.done?C.error:C.border}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {t.done&&<span style={{display:'flex',color:'#fff',transform:'scale(0.65)'}}>{I.check}</span>}
              </div>
              {i<arr.length-1&&<div style={{ width:2, flex:1, background:C.border, margin:'3px 0' }}/>}
            </div>
            <div style={{ paddingBottom:i<arr.length-1?10:0 }}>
              <p style={{ fontSize:12, fontWeight:600, color:t.done?C.type:C.muted }}>{t.l}</p>
              <p style={{ fontSize:10, color:C.muted }}>{t.t}</p>
            </div>
          </div>
        ))}
      </Card>
      <Card style={{ padding:22 }}>
        <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:12 }}>Report an Issue with this Cancellation</p>
        <textarea value={reason} onChange={e=>setReason(e.target.value)} rows={3} placeholder="Describe any issues or request a review…"
          style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, background:'#FAFAFA', outline:'none', resize:'vertical' as const, boxSizing:'border-box' as const, lineHeight:1.6, marginBottom:12 }} />
        <Btn label="Submit Report" variant="danger" onClick={()=>onToast('Report submitted')} />
      </Card>
    </div>
  )
}

// ─── Reminders ────────────────────────────────────────────────────────────────
function Reminders({ onToast }:{ onToast:(m:string)=>void }) {
  const [dismissed, setDismissed] = useState<Set<number>>(new Set())
  const reminders = [
    {icon:'📅', title:'Visit Tomorrow',             body:'Hospital Appointment with Nimal Perera — 9:30 AM at National Hospital',    color:C.primary, urgent:false},
    {icon:'🚗', title:'Leave in 30 Minutes',         body:'Head off by 9:00 AM to arrive on time. Traffic is moderate.',              color:C.warning, urgent:true },
    {icon:'💊', title:'Bring Medication List',       body:"Nimal's prescription list is required for the pharmacist today.",          color:C.error,   urgent:true },
    {icon:'🏥', title:'Hospital Appointment',        body:'Confirm Dr. Silva appointment: Room 4B, OPD, National Hospital Colombo.', color:C.accent,  urgent:false},
    {icon:'📄', title:'Document Reminder',           body:'Bring signed consent form and ID proof for hospital registration.',        color:C.info,    urgent:false},
  ]
  return (
    <div style={{ maxWidth:660, margin:'0 auto', padding:'24px 28px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
        <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Reminders</h2>
        <Bdg label={`${reminders.length-dismissed.size} active`} color={C.primary} dot />
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {reminders.map((r,i)=>dismissed.has(i)?null:(
          <Card key={i} style={{ padding:20, border:`1.5px solid ${r.urgent?r.color+'40':C.border}`, background:r.urgent?`${r.color}06`:C.surface }}>
            <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
              <div style={{ width:44, height:44, borderRadius:14, background:`${r.color}12`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{r.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:4 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{r.title}</p>
                  {r.urgent&&<Bdg label="Urgent" color={r.color} dot />}
                </div>
                <p style={{ fontSize:12, color:C.sub, lineHeight:1.6, marginBottom:10 }}>{r.body}</p>
                <div style={{ display:'flex', gap:6 }}>
                  <Btn label="Acknowledge" variant="secondary" small onClick={()=>{ setDismissed(s=>new Set([...s,i])); onToast('Reminder acknowledged') }} />
                  <Btn label="Dismiss" variant="ghost" small onClick={()=>setDismissed(s=>new Set([...s,i]))} />
                </div>
              </div>
            </div>
          </Card>
        ))}
        {dismissed.size===reminders.length&&(
          <div style={{ textAlign:'center' as const, padding:'60px 20px' }}>
            <div style={{ fontSize:48, marginBottom:14 }}>✅</div>
            <p style={{ fontSize:15, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>All caught up!</p>
            <p style={{ fontSize:13, color:C.muted }}>No active reminders.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Status Center ────────────────────────────────────────────────────────────
function StatusCenter({ onToast }:{ onToast:(m:string)=>void }) {
  const [current, setCurrent] = useState<keyof typeof STATUS>('confirmed')
  return (
    <div style={{ maxWidth:660, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Status Center</h2>
      <p style={{ fontSize:13, color:C.muted, marginBottom:22 }}>Update your current assignment status. Clients see this in real time.</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }} className="jm-2col">
        {(Object.entries(STATUS) as [keyof typeof STATUS, {color:string;label:string}][]).map(([k,s])=>(
          <Card key={k} hover style={{ padding:20, border:`2px solid ${current===k?s.color+'50':C.border}`, background:current===k?`${s.color}06`:C.surface }}
            onClick={()=>{ setCurrent(k); onToast(`Status updated to ${s.label}`) }}>
            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
              <div style={{ width:12, height:12, borderRadius:'50%', background:s.color, boxShadow:current===k?`0 0 0 5px ${s.color}25`:undefined }} />
              <div>
                <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{s.label}</p>
                {current===k&&<Bdg label="Current" color={s.color} />}
              </div>
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
    {icon:'✅', l:'Assignment Confirmed',  d:'Hospital Appointment confirmed by Mohamed Ihsan',       t:'Today, 8:30 AM',  col:C.success},
    {icon:'📅', l:'Schedule Updated',      d:'Reminder set for 8:00 PM tonight',                      t:'Today, 8:00 AM',  col:C.primary},
    {icon:'💬', l:'Client Message',        d:'Mohamed Ihsan: "Please be on time, we need to register early"', t:'Yesterday, 6 PM', col:C.info},
    {icon:'📄', l:'Document Uploaded',     d:'Care Instructions updated by Mohamed Ihsan',            t:'18 Jan, 3:00 PM', col:C.accent},
    {icon:'🔔', l:'Reminder Sent',         d:'System reminder: Visit tomorrow at 9:30 AM',            t:'18 Jan, 8:00 PM', col:C.warning},
    {icon:'📋', l:'Visit Modified',        d:'Duration updated from 2.5 hrs to 3 hrs',               t:'18 Jan, 11:30 AM',col:C.muted},
    {icon:'👤', l:'Beneficiary Updated',   d:"Nimal Perera's care notes updated by client",           t:'17 Jan, 2:00 PM', col:C.primary},
    {icon:'💰', l:'Payment Confirmed',     d:'LKR 6,000 confirmed for this assignment',              t:'15 Jan, 4:00 PM', col:C.success},
  ]
  return (
    <div style={{ maxWidth:660, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Activity Feed</h2>
      <div style={{ display:'flex', flexDirection:'column' }}>
        {feed.map((ev,i,arr)=>(
          <div key={i} style={{ display:'flex', gap:14 }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:`${ev.col}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{ev.icon}</div>
              {i<arr.length-1&&<div style={{ width:2, flex:1, background:C.border, margin:'4px 0' }}/>}
            </div>
            <div style={{ paddingBottom:i<arr.length-1?16:0, paddingTop:4 }}>
              <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:2 }}>{ev.l}</p>
              <p style={{ fontSize:12, color:C.sub, marginBottom:2, lineHeight:1.5 }}>{ev.d}</p>
              <p style={{ fontSize:11, color:C.muted }}>{ev.t}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Notifications ────────────────────────────────────────────────────────────
function Notifications() {
  const items = [
    {icon:'✅', title:'Assignment Confirmed',  body:'Hospital Appointment confirmed by Mohamed Ihsan for Mon 20 Jan', time:'2 hrs ago',  col:C.success, read:false},
    {icon:'📅', title:'Schedule Changed',      body:'Home Wellness Visit moved to Tue 21 Jan at 10:00 AM',           time:'4 hrs ago',  col:C.warning, read:false},
    {icon:'🔔', title:'Reminder',             body:'Hospital Appointment tomorrow at 9:30 AM — prepare now',        time:'Yesterday',  col:C.primary, read:false},
    {icon:'📄', title:'Document Added',        body:'Mohamed Ihsan uploaded a new care instruction',                 time:'2 days ago', col:C.accent,  read:true },
    {icon:'👤', title:'Beneficiary Updated',   body:"Nimal Perera's medical notes have been updated",               time:'2 days ago', col:C.info,    read:true },
    {icon:'💬', title:'Client Message',        body:'New message from Mohamed Ihsan',                               time:'3 days ago', col:C.primary, read:true },
  ]
  return (
    <div style={{ maxWidth:660, margin:'0 auto', padding:'24px 28px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
        <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Notifications</h2>
        <Bdg label={`${items.filter(n=>!n.read).length} new`} color={C.primary} dot />
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
        {items.map((n,i)=>(
          <Card key={i} style={{ padding:18, background:n.read?C.surface:`${n.col}04`, border:`1px solid ${n.read?C.border:n.col+'20'}` }}>
            <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
              <div style={{ width:42, height:42, borderRadius:12, background:`${n.col}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{n.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                  <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                    <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{n.title}</p>
                    {!n.read&&<div style={{ width:7, height:7, borderRadius:'50%', background:n.col }}/>}
                  </div>
                  <p style={{ fontSize:11, color:C.muted, whiteSpace:'nowrap' as const }}>{n.time}</p>
                </div>
                <p style={{ fontSize:12, color:C.sub, lineHeight:1.5 }}>{n.body}</p>
              </div>
            </div>
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
        {e:'✅', t:'Preparation Completed',  d:'All 10 preparation tasks are complete. You are ready for the visit!', col:C.success},
        {e:'📅', t:'Schedule Updated',       d:'Reschedule request sent to Mohamed Ihsan. Awaiting confirmation.',    col:C.primary},
        {e:'🔔', t:'Reminder Acknowledged',  d:'Hospital Appointment reminder dismissed. See you there!',            col:C.accent},
        {e:'💼', t:'Assignment Confirmed',   d:'Hospital Appointment on Mon 20 Jan is confirmed. All set!',          col:C.success},
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
type SubView = 'dashboard'|'calendar'|'preparation'|'route'|'beneficiary'|'documents'|'schedule'|'cancellation'|'reminders'|'status'|'activity'|'notifications'|'empty'|'loading'|'error'|'success'

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
  { k:'status',        l:'Status Center',      icon:I.shield,    group:'Management'     },
  { k:'activity',      l:'Activity Feed',      icon:I.clock,     group:'Management'     },
  { k:'notifications', l:'Notifications',      icon:I.bell,      group:'Management'     },
  { k:'empty',         l:'Empty States',       icon:I.alert,     group:'Dev'            },
  { k:'loading',       l:'Loading States',     icon:I.refresh,   group:'Dev'            },
  { k:'error',         l:'Error States',       icon:I.alert,     group:'Dev'            },
  { k:'success',       l:'Success States',     icon:I.check,     group:'Dev'            },
]

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function JobManagement() {
  const [sub, setSub] = useState<SubView>('dashboard')
  const [viewingId, setViewingId] = useState<string|null>(null)
  const [toast, setToast] = useState<string|null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const showToast = (m:string) => { setToast(m); setTimeout(()=>setToast(null),2800) }
  const primaryJob = ASSIGNMENTS[0]
  const groups = [...new Set(NAV.map(n=>n.group))]

  const renderMain = () => {
    if (viewingId) {
      const a = ASSIGNMENTS.find(x=>x.id===viewingId)!
      return <div style={{flex:1,overflowY:'auto'}}><JobDetails a={a} onBack={()=>setViewingId(null)} onNav={s=>{setSub(s);setViewingId(null)}} onToast={showToast} /></div>
    }
    switch(sub) {
      case 'dashboard':    return <div style={{flex:1,overflowY:'auto'}}><Dashboard onNav={s=>{setSub(s)}} onView={setViewingId} onToast={showToast} /></div>
      case 'calendar':     return <div style={{flex:1,overflowY:'auto'}}><CalendarView onToast={showToast} /></div>
      case 'preparation':  return <div style={{flex:1,overflowY:'auto'}}><Preparation a={primaryJob} onToast={showToast} /></div>
      case 'route':        return <div style={{flex:1,overflowY:'auto'}}><RoutePlanning a={primaryJob} onToast={showToast} /></div>
      case 'beneficiary':  return <div style={{flex:1,overflowY:'auto'}}><BeneficiaryProfile /></div>
      case 'documents':    return <div style={{flex:1,overflowY:'auto'}}><DocumentCenter onToast={showToast} /></div>
      case 'schedule':     return <div style={{flex:1,overflowY:'auto'}}><ScheduleManagement a={primaryJob} onToast={showToast} /></div>
      case 'cancellation': return <div style={{flex:1,overflowY:'auto'}}><CancellationManagement onToast={showToast} /></div>
      case 'reminders':    return <div style={{flex:1,overflowY:'auto'}}><Reminders onToast={showToast} /></div>
      case 'status':       return <div style={{flex:1,overflowY:'auto'}}><StatusCenter onToast={showToast} /></div>
      case 'activity':     return <div style={{flex:1,overflowY:'auto'}}><ActivityFeed /></div>
      case 'notifications':return <div style={{flex:1,overflowY:'auto'}}><Notifications /></div>
      case 'empty':        return <div style={{flex:1,overflowY:'auto'}}><EmptyStates /></div>
      case 'loading':      return <div style={{flex:1,overflowY:'auto'}}><LoadingStates /></div>
      case 'error':        return <div style={{flex:1,overflowY:'auto'}}><ErrorStates onToast={showToast} /></div>
      case 'success':      return <div style={{flex:1,overflowY:'auto'}}><SuccessStates onToast={showToast} /></div>
      default: return null
    }
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:C.bg, fontFamily:'Manrope,sans-serif' }}>
      {/* Sidebar */}
      <div className="jm-sidebar" style={{ width:220, background:C.surface, borderRight:`1px solid ${C.border}`, display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh', overflowY:'auto', flexShrink:0 }}>
        <div style={{ padding:'18px 18px 14px', borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <Avatar initials="KP" size={36} />
            <div>
              <p style={{ fontSize:13, fontWeight:800, color:C.type }}>Kasun Perera</p>
              <div style={{ display:'flex', gap:4, alignItems:'center' }}>
                <div style={{ width:6, height:6, borderRadius:'50%', background:C.success }} />
                <p style={{ fontSize:11, color:C.success, fontWeight:700 }}>Online</p>
              </div>
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
                  {n.k==='reminders'&&<div style={{ marginLeft:'auto', minWidth:18, height:18, borderRadius:99, background:C.warning, color:'#fff', fontSize:9, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 5px' }}>2</div>}
                  {n.k==='notifications'&&<div style={{ marginLeft:'auto', minWidth:18, height:18, borderRadius:99, background:C.error, color:'#fff', fontSize:9, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 5px' }}>3</div>}
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
        {renderMain()}
      </div>

      {toast&&<Toast msg={toast} />}
    </div>
  )
}
