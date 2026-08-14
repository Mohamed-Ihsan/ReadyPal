import { useState, useEffect, useRef, type ReactNode, type CSSProperties } from 'react'

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
const STATUS: Record<string,{color:string;label:string;emoji:string}> = {
  travelling:    { color:C.warning,  label:'Travelling',      emoji:'🚗' },
  arrived:       { color:C.primary,  label:'Arrived',         emoji:'📍' },
  checkedIn:     { color:C.info,     label:'Checked In',      emoji:'✅' },
  careInProgress:{ color:C.success,  label:'Care In Progress',emoji:'💊' },
  waiting:       { color:'#8B5CF6',  label:'Waiting',         emoji:'⏳' },
  completed:     { color:C.success,  label:'Completed',       emoji:'🎉' },
  paused:        { color:C.muted,    label:'Paused',          emoji:'⏸️' },
  emergency:     { color:C.error,    label:'Emergency',       emoji:'🚨' },
  offline:       { color:C.muted,    label:'Offline',         emoji:'📵' },
}

type LiveStatus = keyof typeof STATUS

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
function LiveDashboard({ status, onNav, onToast, startMs }:{ status:LiveStatus; onNav:(s:SubView)=>void; onToast:(m:string)=>void; startMs:number }) {
  const now = useLiveClock()
  const [progress, setProgress] = useState(35)
  const [note, setNote] = useState('')
  const st = STATUS[status]

  const tasks = [
    { l:'Meet Beneficiary',        done:true  },
    { l:'Confirm Identity',        done:true  },
    { l:'Review Care Plan',        done:true  },
    { l:'Purchase Medication',     done:false },
    { l:'Visit Hospital',          done:false },
    { l:'Meet Doctor',             done:false },
    { l:'Collect Reports',         done:false },
    { l:'Assist Mobility',         done:false },
    { l:'Return Home',             done:false },
    { l:'Review Medication',       done:false },
    { l:'Complete Documentation',  done:false },
  ]
  const done = tasks.filter(t=>t.done).length
  const pct = Math.round((done/tasks.length)*100)

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
            <h2 style={{ fontSize:22, fontWeight:900, color:'#fff', fontFamily:'Manrope,sans-serif', marginBottom:4 }}>Hospital Appointment Assistance</h2>
            <p style={{ fontSize:12, color:'rgba(255,255,255,0.75)', marginBottom:10 }}>Nimal Perera · National Hospital Colombo</p>
            <div style={{ display:'flex', gap:18, flexWrap:'wrap' as const }}>
              {[{l:'Elapsed',v:<ElapsedTimer startMs={startMs}/>},{l:'Remaining',v:'~1h 45m'},{l:'Tasks',v:`${done}/${tasks.length}`}].map((s,i)=>(
                <div key={i}>
                  <p style={{ fontSize:10, color:'rgba(255,255,255,0.6)', marginBottom:2 }}>{s.l}</p>
                  <p style={{ fontSize:20, fontWeight:900, color:'#fff', fontFamily:'Manrope,sans-serif', lineHeight:1 }}>{s.v}</p>
                </div>
              ))}
            </div>
          </div>
          <button onClick={()=>onNav('emergency')}
            style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5, padding:'14px 16px', borderRadius:16, background:'rgba(239,68,68,0.85)', border:'2px solid rgba(239,68,68,0.5)', cursor:'pointer', transition:'all 0.15s' }}>
            <span style={{ color:'#fff', display:'flex' }}>{I.sos}</span>
            <p style={{ fontSize:9, fontWeight:900, color:'#fff', letterSpacing:'0.08em' }}>EMERGENCY</p>
          </button>
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

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }} className="lce-4col">
        {[
          {e:'🕐', l:'Started',    v:'9:32 AM', c:C.primary},
          {e:'📍', l:'Distance',   v:'3.2 km',  c:C.info},
          {e:'📋', l:'Completed',  v:`${done}/${tasks.length}`, c:C.success},
          {e:'💊', l:'Medication', v:'2 items',  c:C.accent},
        ].map((k,i)=>(
          <Card key={i} style={{ padding:18 }}>
            <p style={{ fontSize:22, marginBottom:6 }}>{k.e}</p>
            <p style={{ fontSize:20, fontWeight:900, color:k.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:3 }}>{k.v}</p>
            <p style={{ fontSize:11, color:C.muted }}>{k.l}</p>
          </Card>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:18 }} className="lce-main-split">
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Task checklist preview */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Task Checklist" action="Full List" onAction={()=>onNav('checklist')} />
            <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
              {tasks.slice(0,6).map((t,i)=>(
                <div key={i} style={{ display:'flex', gap:10, alignItems:'center', padding:'9px 12px', borderRadius:10, background:t.done?`${C.success}08`:C.bg, border:`1.5px solid ${t.done?C.success+'30':C.border}` }}>
                  <div style={{ width:22, height:22, borderRadius:7, background:t.done?C.success:`${C.primary}10`, border:`2px solid ${t.done?C.success:C.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    {t.done&&<span style={{display:'flex',color:'#fff',transform:'scale(0.7)'}}>{I.check}</span>}
                  </div>
                  <p style={{ fontSize:12, fontWeight:t.done?500:600, color:t.done?C.muted:C.type, textDecoration:t.done?'line-through':undefined }}>{t.l}</p>
                  {i===done&&<Bdg label="Current" color={C.primary} />}
                </div>
              ))}
            </div>
            {tasks.length>6&&<button onClick={()=>onNav('checklist')} style={{ width:'100%', marginTop:8, padding:'8px', borderRadius:10, border:`1px dashed ${C.border}`, background:'transparent', cursor:'pointer', fontSize:11, fontWeight:700, color:C.muted, fontFamily:'Manrope,sans-serif' }}>+{tasks.length-6} more tasks</button>}
          </Card>

          {/* GPS map mini */}
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
          {/* Quick notes */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Quick Notes" action="Full Notes" onAction={()=>onNav('notes')} />
            <textarea value={note} onChange={e=>setNote(e.target.value)} rows={3} placeholder="Add a quick note about the current visit…"
              style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, background:'#FAFAFA', outline:'none', resize:'none', boxSizing:'border-box' as const, lineHeight:1.6, marginBottom:8 }} />
            <Btn label="Save Note" variant="secondary" small full onClick={()=>{ if(note) onToast('Note saved'); }} />
          </Card>

          {/* Medication */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Medication" action="Tracker" onAction={()=>onNav('medication')} />
            {[{n:'Paracetamol 500mg',qty:'2 tabs',done:true},{n:'Amoxicillin 250mg',qty:'1 pack',done:false}].map((m,i)=>(
              <div key={i} style={{ display:'flex', gap:10, alignItems:'center', padding:'9px 0', borderBottom:i===0?`1px solid ${C.border}`:'none' }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:m.done?C.success:C.warning, flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{m.n}</p>
                  <p style={{ fontSize:11, color:C.muted }}>{m.qty}</p>
                </div>
                <Bdg label={m.done?'Purchased':'Pending'} color={m.done?C.success:C.warning} />
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
function StartVisit({ onToast, onStatusChange }:{ onToast:(m:string)=>void; onStatusChange:(s:LiveStatus)=>void }) {
  const [step, setStep] = useState<'arriving'|'arrived'|'confirm'>('arriving')
  const [gpsOk, setGpsOk] = useState(false)
  const now = useLiveClock()

  return (
    <div style={{ maxWidth:600, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Start Visit</h2>
      <p style={{ fontSize:13, color:C.muted, marginBottom:24 }}>Hospital Appointment Assistance · Nimal Perera · National Hospital, Colombo</p>

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
                <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:3 }}>Navigate to National Hospital, Colombo</p>
                <p style={{ fontSize:12, color:C.muted }}>Regent Street, Colombo 10 · ETA 22 min</p>
              </div>
            </div>
          </div>
          <Btn label="I've Arrived" variant="primary" full onClick={()=>{ setStep('arrived'); onStatusChange('arrived') }} />
        </Card>
      )}

      {step==='arrived'&&(
        <Card style={{ padding:24 }}>
          <h3 style={{ fontSize:16, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:16 }}>Confirm Arrival</h3>
          <div style={{ display:'flex', gap:10, alignItems:'center', padding:'14px', borderRadius:12, background:`${C.success}08`, border:`1.5px solid ${C.success}20`, marginBottom:16 }}>
            <span style={{ color:C.success, display:'flex', transform:'scale(1.3)' }}>{I.check}</span>
            <div>
              <p style={{ fontSize:12, fontWeight:700, color:C.type }}>Arrival Time</p>
              <p style={{ fontSize:18, fontWeight:900, color:C.success, fontFamily:'Manrope,sans-serif' }}>{now.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}</p>
            </div>
          </div>
          {/* GPS */}
          <div style={{ padding:'14px', borderRadius:12, background:gpsOk?`${C.success}08`:C.bg, border:`1.5px solid ${gpsOk?C.success+'30':C.border}`, marginBottom:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <span style={{ color:gpsOk?C.success:C.muted, display:'flex' }}>{I.pin}</span>
                <div>
                  <p style={{ fontSize:12, fontWeight:700, color:C.type }}>GPS Check-in</p>
                  <p style={{ fontSize:11, color:C.muted }}>{gpsOk?'Location confirmed':'Verifying location…'}</p>
                </div>
              </div>
              <Btn label={gpsOk?'Verified ✓':'Verify'} variant={gpsOk?'success':'secondary'} small onClick={()=>setGpsOk(true)} />
            </div>
          </div>
          {/* Selfie placeholder */}
          <div style={{ padding:'16px', borderRadius:12, background:C.bg, border:`2px dashed ${C.border}`, marginBottom:16, textAlign:'center' as const }}>
            <p style={{ fontSize:24, marginBottom:8 }}>📷</p>
            <p style={{ fontSize:12, fontWeight:700, color:C.type, marginBottom:4 }}>Selfie Verification</p>
            <p style={{ fontSize:11, color:C.muted }}>Camera feature coming soon</p>
          </div>
          <Btn label="Confirm & Proceed" variant="primary" full disabled={!gpsOk} onClick={()=>setStep('confirm')} />
        </Card>
      )}

      {step==='confirm'&&(
        <Card style={{ padding:24 }}>
          <div style={{ textAlign:'center' as const, paddingBottom:16, borderBottom:`1px solid ${C.border}`, marginBottom:16 }}>
            <div style={{ fontSize:52, marginBottom:10 }}>🏥</div>
            <h3 style={{ fontSize:18, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>Ready to Begin</h3>
            <p style={{ fontSize:13, color:C.muted }}>You are checked in at National Hospital, Colombo</p>
          </div>
          {[{l:'Agent',v:'Kasun Perera'},{l:'Beneficiary',v:'Nimal Perera (74)'},{l:'Client',v:'Mohamed Ihsan'},{l:'Start Time',v:now.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})},{l:'Service',v:'Hospital Appointment Assistance'},{l:'Duration',v:'3 hours'}].map((r,i)=>(
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:`1px solid ${C.border}` }}>
              <p style={{ fontSize:12, color:C.muted }}>{r.l}</p>
              <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{r.v}</p>
            </div>
          ))}
          <div style={{ marginTop:16 }}>
            <Btn label="Start Visit Now" variant="success" full onClick={()=>{ onToast('Visit started! Mohamed Ihsan has been notified.'); onStatusChange('checkedIn') }} />
          </div>
        </Card>
      )}
    </div>
  )
}

// ─── Live Status ──────────────────────────────────────────────────────────────
function LiveStatusView({ current, onToast }:{ current:LiveStatus; onToast:(m:string)=>void }) {
  return (
    <div style={{ maxWidth:700, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Live Status</h2>
      <p style={{ fontSize:13, color:C.muted, marginBottom:22 }}>Current status is visible to Mohamed Ihsan in real time.</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }} className="lce-3col">
        {(Object.entries(STATUS) as [LiveStatus, typeof STATUS[LiveStatus]][]).map(([k,s])=>(
          <Card key={k} hover style={{ padding:20, border:`2px solid ${current===k?s.color+'50':C.border}`, background:current===k?`${s.color}08`:C.surface }}
            onClick={()=>onToast(`Status updated to ${s.label}`)}>
            <div style={{ display:'flex', gap:3, marginBottom:8, alignItems:'center' }}>
              <div style={{ width:10, height:10, borderRadius:'50%', background:s.color, flexShrink:0, boxShadow:current===k?`0 0 0 4px ${s.color}25`:undefined }} />
              {current===k&&<Bdg label="Active" color={s.color} />}
            </div>
            <p style={{ fontSize:20, marginBottom:6 }}>{s.emoji}</p>
            <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{s.label}</p>
          </Card>
        ))}
      </div>
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
function TaskChecklist({ onToast }:{ onToast:(m:string)=>void }) {
  const taskDefs = [
    { l:'Meet Beneficiary',       sub:'Greet Nimal Perera and confirm care plan',       cat:'prep'  },
    { l:'Confirm Identity',       sub:'Verify ID with Mohamed Ihsan',                   cat:'prep'  },
    { l:'Review Care Plan',       sub:'Review all instructions from client',             cat:'prep'  },
    { l:'Purchase Medication',    sub:'Paracetamol 500mg, Amoxicillin 250mg',           cat:'task'  },
    { l:'Visit Hospital',         sub:'Navigate to National Hospital OPD, Room 4B',     cat:'task'  },
    { l:'Meet Doctor',            sub:'Dr. K. Silva — Appointment at 10:45 AM',         cat:'task'  },
    { l:'Collect Reports',        sub:'Lab results from reception counter',              cat:'task'  },
    { l:'Assist Mobility',        sub:'Help Nimal navigate hospital corridors',          cat:'task'  },
    { l:'Return Home',            sub:"Safely return Nimal to his home",               cat:'travel'},
    { l:'Review Medication',      sub:'Confirm medication dosage and storage',          cat:'close' },
    { l:'Complete Documentation', sub:'Upload reports and complete visit notes',         cat:'close' },
  ]
  const [checked, setChecked] = useState<Set<number>>(new Set([0,1,2]))
  const [notes, setNotes] = useState<Record<number,string>>({})
  const [expand, setExpand] = useState<number|null>(null)
  const pct = Math.round((checked.size/taskDefs.length)*100)
  const catColor: Record<string,string> = { prep:C.info, task:C.primary, travel:C.accent, close:C.success }
  const catLabel: Record<string,string> = { prep:'Preparation', task:'Task', travel:'Travel', close:'Closeout' }

  return (
    <div style={{ maxWidth:720, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Task Checklist</h2>
      <Card style={{ padding:22, marginBottom:18, background:`linear-gradient(135deg,${C.primary}05,${C.surface})`, border:`1.5px solid ${C.primary}20` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <p style={{ fontSize:13, fontWeight:700, color:C.type }}>Overall Progress</p>
          <p style={{ fontSize:24, fontWeight:900, color:pct===100?C.success:C.primary, fontFamily:'Manrope,sans-serif' }}>{pct}%</p>
        </div>
        <div style={{ height:10, borderRadius:99, background:`${C.primary}10`, overflow:'hidden', marginBottom:6 }}>
          <div style={{ width:`${pct}%`, height:'100%', background:`linear-gradient(90deg,${C.primary},${C.success})`, borderRadius:99, transition:'width 0.5s' }} />
        </div>
        <p style={{ fontSize:11, color:C.muted }}>{checked.size} of {taskDefs.length} tasks complete</p>
      </Card>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {taskDefs.map((t,i)=>{
          const done = checked.has(i)
          const cur = !done && i===taskDefs.findIndex((_,j)=>!checked.has(j))
          const col = catColor[t.cat]
          return (
            <Card key={i} style={{ border:`1.5px solid ${done?col+'30':cur?C.primary+'30':C.border}`, background:done?`${col}05`:cur?`${C.primary}04`:C.surface }}>
              <div style={{ padding:'14px 16px' }}>
                <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                  <button onClick={()=>setChecked(s=>{ const n=new Set(s); done?n.delete(i):n.add(i); if(!done) onToast(`✓ ${t.l}`); return n })}
                    style={{ width:28, height:28, borderRadius:9, background:done?col:`${col}15`, border:`2px solid ${done?col:C.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, cursor:'pointer', transition:'all 0.15s', marginTop:2 }}>
                    {done&&<span style={{display:'flex',color:'#fff',transform:'scale(0.8)'}}>{I.check}</span>}
                  </button>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:3, flexWrap:'wrap' as const }}>
                      <p style={{ fontSize:13, fontWeight:done?500:700, color:done?C.muted:C.type, textDecoration:done?'line-through':undefined }}>{t.l}</p>
                      {cur&&<Bdg label="Current" color={C.primary} dot />}
                      <span style={{ fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:99, background:`${col}10`, color:col }}>{catLabel[t.cat]}</span>
                    </div>
                    <p style={{ fontSize:11, color:C.muted }}>{t.sub}</p>
                  </div>
                  <button onClick={()=>setExpand(expand===i?null:i)} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, display:'flex', padding:4 }}>
                    <span style={{ display:'flex', transform:expand===i?'rotate(90deg)':'none', transition:'transform 0.15s' }}>{I.chevR}</span>
                  </button>
                </div>
                {expand===i&&(
                  <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${C.border}` }}>
                    <textarea value={notes[i]||''} onChange={e=>setNotes(s=>({...s,[i]:e.target.value}))} rows={2}
                      placeholder="Add notes for this task…"
                      style={{ width:'100%', padding:'8px 12px', borderRadius:9, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, background:C.bg, outline:'none', resize:'none', boxSizing:'border-box' as const }} />
                    <div style={{ display:'flex', gap:6, marginTop:8 }}>
                      <Btn label="Add Photo" variant="ghost" small icon={I.camera} onClick={()=>onToast('Camera opening…')} />
                      <Btn label="Save" variant="secondary" small onClick={()=>{ onToast('Note saved'); setExpand(null) }} />
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// ─── Medication Tracker ───────────────────────────────────────────────────────
function MedicationTracker({ onToast }:{ onToast:(m:string)=>void }) {
  const meds = [
    { name:'Paracetamol 500mg', qty:'2 tablets', pharmacy:'Osusala Pharmacy, Col 03', purchased:true,  collected:true,  receipt:true,  prescription:true  },
    { name:'Amoxicillin 250mg', qty:'1 pack',    pharmacy:'Osusala Pharmacy, Col 03', purchased:false, collected:false, receipt:false, prescription:true  },
    { name:'Metformin 500mg',   qty:'1 strip',   pharmacy:'Nawaloka Pharmacy, Col 02',purchased:false, collected:false, receipt:false, prescription:false },
  ]
  return (
    <div style={{ maxWidth:720, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Medication Tracker</h2>
      {meds.map((m,i)=>(
        <Card key={i} style={{ padding:22, marginBottom:14 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
            <div>
              <p style={{ fontSize:15, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>{m.name}</p>
              <p style={{ fontSize:12, color:C.muted }}>{m.qty} · {m.pharmacy}</p>
            </div>
            <Bdg label={m.collected?'Collected':m.purchased?'Purchased':'Pending'} color={m.collected?C.success:m.purchased?C.primary:C.warning} dot />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:14 }}>
            {[{l:'Purchased',done:m.purchased},{l:'Collected',done:m.collected},{l:'Prescription',done:m.prescription},{l:'Receipt',done:m.receipt}].map((s,j)=>(
              <div key={j} style={{ textAlign:'center' as const, padding:'10px 8px', borderRadius:10, background:s.done?`${C.success}08`:C.bg, border:`1px solid ${s.done?C.success+'30':C.border}` }}>
                <div style={{ width:22, height:22, borderRadius:8, background:s.done?C.success:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 6px' }}>
                  {s.done?<span style={{display:'flex',color:'#fff',transform:'scale(0.7)'}}>{I.check}</span>:<div style={{width:6,height:6,borderRadius:2,background:C.border}}/>}
                </div>
                <p style={{ fontSize:10, fontWeight:700, color:s.done?C.success:C.muted }}>{s.l}</p>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:8 }}>
            {!m.purchased&&<Btn label="Mark Purchased" variant="primary" small onClick={()=>onToast(`${m.name} marked as purchased`)} />}
            {m.purchased&&!m.collected&&<Btn label="Mark Collected" variant="success" small onClick={()=>onToast(`${m.name} marked as collected`)} />}
            <Btn label="Upload Receipt" variant="ghost" small icon={I.upload} onClick={()=>onToast('Opening camera…')} />
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Vital Signs ──────────────────────────────────────────────────────────────
function VitalSigns({ onToast }:{ onToast:(m:string)=>void }) {
  const [reading, setReading] = useState({ bp:'120/80', hr:'78', temp:'36.8', o2:'97', sugar:'', weight:'' })
  const vitals = [
    {k:'bp',    l:'Blood Pressure',   unit:'mmHg',  val:reading.bp,    icon:'❤️', normal:'120/80',    col:C.success},
    {k:'hr',    l:'Heart Rate',       unit:'bpm',   val:reading.hr,    icon:'💓', normal:'60-100',    col:C.success},
    {k:'temp',  l:'Temperature',      unit:'°C',    val:reading.temp,  icon:'🌡️', normal:'36.1-37.2', col:C.success},
    {k:'o2',    l:'Oxygen Saturation',unit:'%',     val:reading.o2,    icon:'💨', normal:'95-100',    col:C.success},
    {k:'sugar', l:'Blood Sugar',      unit:'mg/dL', val:reading.sugar, icon:'🩸', normal:'70-140',    col:C.muted,  placeholder:true},
    {k:'weight',l:'Weight',           unit:'kg',    val:reading.weight,icon:'⚖️', normal:'—',         col:C.muted,  placeholder:true},
  ]
  return (
    <div style={{ maxWidth:720, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:8 }}>Vital Signs</h2>
      <p style={{ fontSize:13, color:C.muted, marginBottom:22 }}>Manual entry · Nimal Perera · Recorded today at 9:42 AM</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14, marginBottom:18 }} className="lce-3col">
        {vitals.map((v,i)=>(
          <Card key={i} style={{ padding:18, background:(v as any).placeholder?C.bg:C.surface, border:(v as any).placeholder?`1.5px dashed ${C.border}`:undefined }}>
            <p style={{ fontSize:22, marginBottom:8 }}>{v.icon}</p>
            <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:4 }}>{v.l}</p>
            {v.val
              ? <p style={{ fontSize:22, fontWeight:900, color:v.col, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:3 }}>{v.val}<span style={{ fontSize:11, fontWeight:500, color:C.muted }}> {v.unit}</span></p>
              : <p style={{ fontSize:13, color:C.muted, fontStyle:'italic' as const, marginBottom:3 }}>{(v as any).placeholder?'Coming soon':'Not recorded'}</p>
            }
            <p style={{ fontSize:10, color:C.muted }}>Normal: {v.normal}</p>
          </Card>
        ))}
      </div>
      <Card style={{ padding:22 }}>
        <SectionTitle title="Manual Entry" />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }} className="lce-2col">
          {[{k:'bp',l:'Blood Pressure (mmHg)'},{k:'hr',l:'Heart Rate (bpm)'},{k:'temp',l:'Temperature (°C)'},{k:'o2',l:'O₂ Saturation (%)'}].map(f=>(
            <div key={f.k}>
              <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:5 }}>{f.l}</p>
              <input value={(reading as any)[f.k]} onChange={e=>setReading(r=>({...r,[f.k]:e.target.value}))}
                style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, background:'#FAFAFA', outline:'none', boxSizing:'border-box' as const }} />
            </div>
          ))}
        </div>
        <div style={{ marginTop:14, display:'flex', gap:8 }}>
          <Btn label="Save Readings" onClick={()=>onToast('Vital signs recorded')} />
          <p style={{ fontSize:11, color:C.muted, alignSelf:'center' }}>{new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}</p>
        </div>
      </Card>
    </div>
  )
}

// ─── Care Notes ───────────────────────────────────────────────────────────────
function CareNotes({ onToast }:{ onToast:(m:string)=>void }) {
  const [note, setNote] = useState('')
  const [recording, setRecording] = useState(false)
  const [pinned, setPinned] = useState<string[]>(['Nimal moves slowly — always wait. Blood sugar biscuits in bag.','Dr. Silva room 4B, bring prescription file.'])
  const templates = ['Beneficiary is comfortable and cooperative.','Medication administered as prescribed.','Patient showed mild discomfort, will monitor.','All tasks completed without incident.']

  return (
    <div style={{ maxWidth:720, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Care Notes</h2>
      {/* Pinned */}
      <Card style={{ padding:22, marginBottom:18, border:`1.5px solid ${C.warning}30`, background:`${C.warning}04` }}>
        <SectionTitle title="📌 Pinned Notes" />
        {pinned.map((p,i)=>(
          <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', padding:'10px 12px', borderRadius:10, background:`${C.warning}08`, marginBottom:8 }}>
            <p style={{ flex:1, fontSize:12, color:C.type, lineHeight:1.6 }}>{p}</p>
            <button onClick={()=>setPinned(s=>s.filter((_,j)=>j!==i))} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, display:'flex', flexShrink:0 }}><span style={{display:'flex'}}>{I.close}</span></button>
          </div>
        ))}
      </Card>
      {/* Editor */}
      <Card style={{ padding:22, marginBottom:18 }}>
        <SectionTitle title="Add Note" />
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' as const, marginBottom:12 }}>
          {templates.map((t,i)=>(
            <button key={i} onClick={()=>setNote(t)}
              style={{ padding:'5px 11px', borderRadius:99, border:`1px solid ${C.border}`, background:C.bg, cursor:'pointer', fontSize:11, fontWeight:600, color:C.sub, fontFamily:'Manrope,sans-serif', textAlign:'left' as const }}>
              {t.substring(0,30)}…
            </button>
          ))}
        </div>
        <textarea value={note} onChange={e=>setNote(e.target.value)} rows={4}
          placeholder="Write care notes here. Be specific — families read these updates."
          style={{ width:'100%', padding:'12px 14px', borderRadius:12, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, background:'#FAFAFA', outline:'none', resize:'vertical' as const, boxSizing:'border-box' as const, lineHeight:1.7, marginBottom:12 }} />
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <Btn label="Save Note" onClick={()=>{ if(note){ onToast('Note saved'); setNote('') } }} />
          <Btn label="Pin Note" variant="secondary" small onClick={()=>{ if(note){ setPinned(s=>[...s,note]); setNote(''); onToast('Note pinned') } }} />
          <button onClick={()=>{ setRecording(v=>!v); onToast(recording?'Recording stopped':'Recording…') }}
            style={{ display:'flex', gap:5, alignItems:'center', padding:'8px 14px', borderRadius:10, border:`1.5px solid ${recording?C.error:C.border}`, background:recording?`${C.error}08`:C.bg, cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:700, color:recording?C.error:C.sub }}>
            <span style={{ display:'flex', color:recording?C.error:C.muted, animation:recording?'pulse-dot 1s ease-in-out infinite':undefined }}>{I.mic}</span>
            {recording?'Stop':'Voice'}
          </button>
          <Btn label="Important" variant="ghost" small icon={I.alert} onClick={()=>onToast('Flagged as important')} />
        </div>
      </Card>
      {/* Previous */}
      <Card style={{ padding:22 }}>
        <SectionTitle title="Previous Notes" />
        {[
          {t:'Nimal ate biscuits at 9:40 AM. Blood sugar stable.',time:'9:40 AM',flag:false},
          {t:'Confirmed OPD appointment — Room 4B with Dr. Silva.',time:'9:38 AM',flag:true},
          {t:'Arrived at National Hospital. GPS check-in done.',time:'9:32 AM',flag:false},
        ].map((n,i)=>(
          <div key={i} style={{ padding:'12px 0', borderBottom:i<2?`1px solid ${C.border}`:'none' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
              <p style={{ fontSize:11, color:C.muted }}>{n.time}</p>
              {n.flag&&<Bdg label="Important" color={C.error} />}
            </div>
            <p style={{ fontSize:12, color:C.type, lineHeight:1.6 }}>{n.t}</p>
          </div>
        ))}
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
function IncidentReporting({ onToast }:{ onToast:(m:string)=>void }) {
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
  return (
    <div style={{ maxWidth:700, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Incident Report</h2>
      <p style={{ fontSize:13, color:C.muted, marginBottom:22 }}>Reports are sent to Mohamed Ihsan and ReadyPal Support.</p>
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
          <div style={{ display:'flex', gap:8 }}>
            <Btn label="Add Photo" variant="secondary" small icon={I.camera} onClick={()=>onToast('Camera opening…')} />
            <div style={{ fontSize:11, color:C.muted, display:'flex', alignItems:'center', gap:4 }}>
              <span style={{display:'flex'}}>{I.pin}</span>
              National Hospital, Colombo · {new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}
            </div>
          </div>
          <div style={{ marginTop:16 }}>
            <Btn label="Submit Report" variant="danger" full disabled={!desc} onClick={()=>{ onToast('Incident report submitted'); setSelected(null); setDesc('') }} />
          </div>
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
function EndVisit({ onToast, onNav }:{ onToast:(m:string)=>void; onNav:(s:SubView)=>void }) {
  const [checks, setChecks] = useState<Set<number>>(new Set())
  const steps = ['All checklist tasks marked complete','Final photos uploaded','Hospital reports uploaded','Visit notes completed','Duration confirmed — 2h 58m','GPS checkout confirmed']
  const ready = checks.size === steps.length
  return (
    <div style={{ maxWidth:640, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>End Visit</h2>
      <Card style={{ padding:22, marginBottom:18 }}>
        <SectionTitle title="Pre-Completion Checklist" />
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {steps.map((s,i)=>(
            <button key={i} onClick={()=>setChecks(c=>{ const n=new Set(c); c.has(i)?n.delete(i):n.add(i); return n })}
              style={{ display:'flex', gap:12, alignItems:'center', padding:'12px 14px', borderRadius:12, border:`1.5px solid ${checks.has(i)?C.success+'40':C.border}`, background:checks.has(i)?`${C.success}06`:C.bg, cursor:'pointer', textAlign:'left' as const, transition:'all 0.15s' }}>
              <div style={{ width:24, height:24, borderRadius:8, background:checks.has(i)?C.success:`${C.success}15`, border:`2px solid ${checks.has(i)?C.success:C.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                {checks.has(i)&&<span style={{display:'flex',color:'#fff',transform:'scale(0.7)'}}>{I.check}</span>}
              </div>
              <p style={{ fontSize:12, fontWeight:checks.has(i)?500:600, color:checks.has(i)?C.muted:C.type, textDecoration:checks.has(i)?'line-through':undefined }}>{s}</p>
            </button>
          ))}
        </div>
        <div style={{ marginTop:18, padding:'12px', borderRadius:12, background:C.bg, display:'flex', gap:12, alignItems:'center', marginBottom:16 }}>
          <span style={{ fontSize:22 }}>📍</span>
          <div>
            <p style={{ fontSize:11, fontWeight:700, color:C.muted }}>GPS Checkout</p>
            <p style={{ fontSize:12, color:C.type }}>National Hospital, Colombo — 12:30 PM</p>
          </div>
          <Bdg label="Confirmed" color={C.success} />
        </div>
        <Btn label={ready?'Finish Visit':'Complete All Steps First'} variant={ready?'success':'secondary'} full disabled={!ready}
          onClick={()=>{ onToast('Visit completed! Summary generating…'); setTimeout(()=>onNav('summary'),800) }} />
      </Card>
    </div>
  )
}

// ─── Visit Summary ────────────────────────────────────────────────────────────
function VisitSummary({ onNav, onToast }:{ onNav:(s:SubView)=>void; onToast:(m:string)=>void }) {
  return (
    <div style={{ maxWidth:740, margin:'0 auto', padding:'24px 28px 60px' }}>
      {/* Hero */}
      <Card style={{ padding:'28px 28px', marginBottom:20, background:`linear-gradient(135deg,${C.success},#16A34A)`, border:'none', boxShadow:`0 8px 28px ${C.success}30` }}>
        <div style={{ textAlign:'center' as const }}>
          <div style={{ fontSize:60, marginBottom:10 }}>🎉</div>
          <h2 style={{ fontSize:26, fontWeight:900, color:'#fff', fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Visit Completed!</h2>
          <p style={{ fontSize:14, color:'rgba(255,255,255,0.8)', marginBottom:20 }}>Hospital Appointment Assistance · Nimal Perera</p>
          <div style={{ display:'flex', justifyContent:'center', gap:28 }}>
            {[{v:'2h 58m',l:'Duration'},{v:'4',l:'Tasks'},{v:'3',l:'Docs'},{v:'100%',l:'Complete'}].map((s,i)=>(
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
            {[{l:'Agent',v:'Kasun Perera'},{l:'Beneficiary',v:'Nimal Perera, 74'},{l:'Client',v:'Mohamed Ihsan'},{l:'Service',v:'Hospital Appointment Assistance'},{l:'Location',v:'National Hospital, Colombo'},{l:'Started',v:'9:32 AM'},{l:'Completed',v:'12:30 PM'},{l:'Duration',v:'2h 58m'},{l:'Distance',v:'8.4 km round trip'}].map((r,i)=>(
              <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:`1px solid ${C.border}` }}>
                <p style={{ fontSize:12, color:C.muted }}>{r.l}</p>
                <p style={{ fontSize:12, fontWeight:600, color:C.type }}>{r.v}</p>
              </div>
            ))}
          </Card>
          <Card style={{ padding:22 }}>
            <SectionTitle title="Medication Summary" />
            {[{n:'Paracetamol 500mg',v:'Purchased & Delivered'},{n:'Amoxicillin 250mg',v:'Purchased & Delivered'}].map((m,i)=>(
              <div key={i} style={{ display:'flex', gap:8, alignItems:'center', padding:'8px 0', borderBottom:i===0?`1px solid ${C.border}`:'none' }}>
                <div style={{ width:7, height:7, borderRadius:'50%', background:C.success }} />
                <p style={{ flex:1, fontSize:12, color:C.type }}>{m.n}</p>
                <Bdg label={m.v} color={C.success} />
              </div>
            ))}
          </Card>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <Card style={{ padding:22 }}>
            <SectionTitle title="Tasks Completed" />
            {['Met & confirmed beneficiary identity','Purchased all medications','Hospital OPD visit completed','Met Dr. K. Silva — consultation done','Lab reports collected','Nimal returned home safely'].map((t,i)=>(
              <div key={i} style={{ display:'flex', gap:8, padding:'6px 0' }}>
                <span style={{ display:'flex', color:C.success, flexShrink:0, marginTop:1 }}>{I.check}</span>
                <p style={{ fontSize:12, color:C.type }}>{t}</p>
              </div>
            ))}
          </Card>
          <Card style={{ padding:22 }}>
            <SectionTitle title="Payment" />
            {[{l:'Service Fee',v:'LKR 6,000'},{l:'Platform Fee (8%)',v:'LKR 480'},{l:'Your Net Pay',v:'LKR 5,520',bold:true}].map((r,i)=>(
              <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:i<2?`1px solid ${C.border}`:'none' }}>
                <p style={{ fontSize:12, color:C.sub }}>{r.l}</p>
                <p style={{ fontSize:12, fontWeight:(r as any).bold?900:600, color:(r as any).bold?C.success:C.type, fontFamily:(r as any).bold?'Manrope,sans-serif':undefined }}>{r.v}</p>
              </div>
            ))}
          </Card>
          <Card style={{ padding:22, background:`${C.warning}06`, border:`1.5px solid ${C.warning}20` }}>
            <SectionTitle title="Incident Summary" />
            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
              <span style={{ fontSize:22 }}>✅</span>
              <p style={{ fontSize:12, color:C.type }}>No incidents reported during this visit.</p>
            </div>
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
function Notifications() {
  const items = [
    {e:'🔔', t:'Task Reminder',        b:'Purchase medication now — you are near Osusala Pharmacy.',          col:C.warning, read:false},
    {e:'💊', t:'Medication Reminder',  b:"Administer Paracetamol at 2:00 PM — don't forget Nimal's afternoon dose.", col:C.accent, read:false},
    {e:'💬', t:'Client Message',       b:'Mohamed Ihsan: "How is Nimal doing? Did you get the reports?"',   col:C.primary, read:false},
    {e:'🚨', t:'Emergency Alert',      b:'ReadyPal Support: Emergency protocol activated in your area.',    col:C.error,   read:true },
    {e:'📡', t:'GPS Signal Lost',      b:"Your GPS signal was lost for 2 minutes. Please reconnect.",       col:C.muted,   read:true },
    {e:'🔋', t:'Battery Low',          b:'Your phone battery is at 18%. Please charge soon.',               col:C.warning, read:true },
  ]
  return (
    <div style={{ maxWidth:660, margin:'0 auto', padding:'24px 28px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
        <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Notifications</h2>
        <Bdg label={`${items.filter(n=>!n.read).length} new`} color={C.primary} dot />
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
        {items.map((n,i)=>(
          <Card key={i} style={{ padding:18, background:n.read?C.surface:`${n.col}04`, border:`1px solid ${n.read?C.border:n.col+'25'}` }}>
            <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
              <div style={{ width:42, height:42, borderRadius:12, background:`${n.col}12`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{n.e}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                  <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                    <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{n.t}</p>
                    {!n.read&&<div style={{ width:7, height:7, borderRadius:'50%', background:n.col }}/>}
                  </div>
                </div>
                <p style={{ fontSize:12, color:C.sub, lineHeight:1.5 }}>{n.b}</p>
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
    <div style={{ maxWidth:700, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Status Badges</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        {(Object.entries(STATUS) as [string, typeof STATUS[string]][]).map(([k,s])=>(
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
  const [sub, setSub] = useState<SubView>('dashboard')
  const [liveStatus, setLiveStatus] = useState<LiveStatus>('checkedIn')
  const [toast, setToast] = useState<string|null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const startMs = useRef(Date.now() - 78 * 60 * 1000).current

  const showToast = (m:string) => { setToast(m); setTimeout(()=>setToast(null),2800) }
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
    switch(sub) {
      case 'dashboard':     return <LiveDashboard status={liveStatus} onNav={setSub} onToast={showToast} startMs={startMs} />
      case 'startVisit':    return <StartVisit onToast={showToast} onStatusChange={s=>{setLiveStatus(s);showToast(`Status → ${STATUS[s].label}`)}} />
      case 'liveStatus':    return <LiveStatusView current={liveStatus} onToast={showToast} />
      case 'gps':           return <GPSTracking onToast={showToast} />
      case 'timeline':      return <LiveTimeline />
      case 'checklist':     return <TaskChecklist onToast={showToast} />
      case 'medication':    return <MedicationTracker onToast={showToast} />
      case 'vitals':        return <VitalSigns onToast={showToast} />
      case 'notes':         return <CareNotes onToast={showToast} />
      case 'media':         return <PhotoMedia onToast={showToast} />
      case 'documents':     return <DocumentCenter onToast={showToast} />
      case 'incident':      return <IncidentReporting onToast={showToast} />
      case 'emergency':     return <EmergencyMode onToast={showToast} />
      case 'clientUpdates': return <ClientLiveUpdates onToast={showToast} />
      case 'signature':     return <DigitalSignature onToast={showToast} />
      case 'endVisit':      return <EndVisit onToast={showToast} onNav={setSub} />
      case 'summary':       return <VisitSummary onNav={setSub} onToast={showToast} />
      case 'followup':      return <Followup onToast={showToast} />
      case 'notifications': return <Notifications />
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
        <div style={{ padding:'16px 18px 14px', borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <Avatar initials="KP" size={36} />
            <div>
              <p style={{ fontSize:13, fontWeight:800, color:C.type }}>Kasun Perera</p>
              <div style={{ display:'flex', gap:5, alignItems:'center' }}>
                <div style={{ width:7, height:7, borderRadius:'50%', background:STATUS[liveStatus].color, animation:'pulse-dot 2s ease-in-out infinite' }} />
                <p style={{ fontSize:11, fontWeight:700, color:STATUS[liveStatus].color }}>{STATUS[liveStatus].emoji} {STATUS[liveStatus].label}</p>
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
                  {n.k==='notifications'&&<div style={{ marginLeft:'auto', minWidth:18, height:18, borderRadius:99, background:C.error, color:'#fff', fontSize:9, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 5px' }}>3</div>}
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
