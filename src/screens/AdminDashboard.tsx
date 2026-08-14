import { useState, useEffect, type ReactNode, type CSSProperties } from 'react'

// ─── Brand ────────────────────────────────────────────────────────────────────
const C = {
  primary:'#00737A', accent:'#EE8153', type:'#2C3E43', sub:'#6B7E85',
  muted:'#9AAAB0', border:'#E4E8EA', bg:'#F2F4F5', surface:'#FFFFFF',
  success:'#22C55E', warning:'#F59E0B', error:'#EF4444', info:'#3B82F6',
  dark:'#1A2A30', darkSub:'#2C3E43',
}
const fmt = (n:number) => n>=1000000?`LKR ${(n/1000000).toFixed(2)}M`:n>=1000?`LKR ${(n/1000).toFixed(0)}K`:`LKR ${n.toLocaleString()}`

// ─── Icons ────────────────────────────────────────────────────────────────────
const I: Record<string,ReactNode> = {
  home:     <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 6l6-5 6 5v7H9V9H5v4H1V6z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  users:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="5" cy="4.5" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M1 12c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="10.5" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M13 12c0-1.66-1.34-3-3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  agents:   <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M7 8v5M5 10h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M1 13c0-2.76 2.24-5 5-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  bookings: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="2.5" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M1 6h12M4.5 1v3M9.5 1v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  payments: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="3" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M1 6.5h12" stroke="currentColor" strokeWidth="1.2"/><circle cx="10.5" cy="9" r="1" fill="currentColor"/></svg>,
  analytics:<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 11l3.5-4 3 3L12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  verify:   <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L2 3v5c0 3.3 5 5 5 5s5-1.7 5-5V3L7 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M4.5 7l2 2L10 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  support:  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M3.4 3.4l1.8 1.8M8.8 8.8l1.8 1.8M10.6 3.4L8.8 5.2M5.2 8.8L3.4 10.6" stroke="currentColor" strokeWidth="1.1"/></svg>,
  reports:  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="1" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 5h4M5 7.5h4M5 10h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  settings: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M7 1.5v1.5M7 11v1.5M1.5 7H3M11 7h1.5M3.1 3.1l1.1 1.1M9.8 9.8l1.1 1.1M3.1 10.9l1.1-1.1M9.8 4.2l1.1-1.1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  alert:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5L1 13h12L7 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M7 5.5v3.5M7 10.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  bell:     <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5c-2.8 0-4.5 2-4.5 4.5v2.5L1 10h12l-1.5-1.5V6c0-2.5-1.7-4.5-4.5-4.5z" stroke="currentColor" strokeWidth="1.2"/><path d="M5.5 10c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5" stroke="currentColor" strokeWidth="1.2"/></svg>,
  search:   <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3"/><path d="M9 9l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  map:      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1C4.5 1 2.5 3 2.5 5.5c0 3.5 4.5 7.5 4.5 7.5s4.5-4 4.5-7.5C11.5 3 9.5 1 7 1z" stroke="currentColor" strokeWidth="1.2"/><circle cx="7" cy="5.5" r="1.3" stroke="currentColor" strokeWidth="1.1"/></svg>,
  sos:      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3"/><path d="M7 4v3.5M7 9v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  check:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 6.5l3 3.5 5-6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevR:    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  refresh:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M11 6.5a4.5 4.5 0 1 1-1-2.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M11 3v2.5H8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  download: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2v7M4 6.5L6.5 9 9 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M1.5 10.5h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  cms:      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="2" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M1 5.5h12" stroke="currentColor" strokeWidth="1.1"/><path d="M4 8.5h2.5M4 10.5h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  trending: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 10l3.5-3.5 3 3L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8.5 4H11v2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
}

// ─── Primitives ───────────────────────────────────────────────────────────────
function Card({ children, style={}, hover=false, onClick }:{ children:ReactNode; style?:CSSProperties; hover?:boolean; onClick?:()=>void }) {
  const [h,setH] = useState(false)
  return (
    <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ background:C.surface, borderRadius:14, border:`1px solid ${h&&hover?C.primary+'40':C.border}`, boxShadow:h&&hover?'0 8px 28px rgba(44,62,67,0.11)':'0 1px 4px rgba(44,62,67,0.06)', transition:'all 0.18s', cursor:onClick?'pointer':undefined, ...style }}>
      {children}
    </div>
  )
}

function Btn({ label, icon, onClick, variant='primary', small=false, full=false }:{
  label:string; icon?:ReactNode; onClick?:()=>void
  variant?:'primary'|'secondary'|'ghost'|'danger'|'warning'
  small?:boolean; full?:boolean
}) {
  const [h,setH] = useState(false)
  const vs: Record<string,CSSProperties> = {
    primary:   { background:h?'#005D63':C.primary, color:'#fff', border:'none', boxShadow:h?`0 4px 16px ${C.primary}50`:`0 2px 8px ${C.primary}30` },
    secondary: { background:h?'#EEF5F5':'#fff', color:C.primary, border:`1.5px solid ${h?C.primary:C.border}` },
    ghost:     { background:h?C.bg:'transparent', color:C.sub, border:'none' },
    danger:    { background:h?'#DC2626':C.error, color:'#fff', border:'none' },
    warning:   { background:h?'#D97706':C.warning, color:'#fff', border:'none' },
  }
  return (
    <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:small?'6px 13px':'10px 18px', borderRadius:9, cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:small?11:13, fontWeight:700, transition:'all 0.15s', width:full?'100%':undefined, ...vs[variant] }}>
      {icon&&<span style={{display:'flex'}}>{icon}</span>}{label}
    </button>
  )
}

function Bdg({ label, color=C.primary, dot=false }:{ label:string; color?:string; dot?:boolean }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:dot?5:0, padding:'3px 9px', borderRadius:999, fontSize:10, fontWeight:700, background:`${color}12`, color, whiteSpace:'nowrap' as const }}>
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

// ─── Mini bar chart ───────────────────────────────────────────────────────────
function SparkBar({ data, color=C.primary, h=36 }:{ data:number[]; color?:string; h?:number }) {
  const max = Math.max(...data, 1)
  const w = 90, bw = w/data.length - 2
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow:'visible' }}>
      {data.map((v,i)=>{
        const bh = (v/max)*(h-4)
        return <rect key={i} x={i*(bw+2)} y={h-bh} width={bw} height={bh} rx={2} fill={`${color}30`}/>
      })}
      {data.map((v,i)=>{
        const bh = (v/max)*(h-4)
        return <rect key={`t${i}`} x={i*(bw+2)} y={h-bh} width={bw} height={Math.min(bh,5)} rx={2} fill={color}/>
      })}
    </svg>
  )
}

function LineSpark({ data, color=C.primary, h=36, w=90 }:{ data:number[]; color?:string; h?:number; w?:number }) {
  const max = Math.max(...data, 1), step = w/(data.length-1)
  const pts = data.map((v,i)=>({ x:i*step, y:h-(v/max)*(h-4)+2 }))
  const d = pts.map((p,i)=>i===0?`M${p.x},${p.y}`:`L${p.x},${p.y}`).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path d={d} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={pts[pts.length-1].x} cy={pts[pts.length-1].y} r={3} fill={color} stroke="#fff" strokeWidth={1.5}/>
    </svg>
  )
}

// ─── Bigger bar chart ─────────────────────────────────────────────────────────
function BarChart({ data, color=C.primary, height=100 }:{ data:{label:string;value:number}[]; color?:string; height?:number }) {
  const max = Math.max(...data.map(d=>d.value), 1)
  const W = 560, pad = 30
  const bw = (W-pad*2)/data.length
  return (
    <svg viewBox={`0 0 ${W} ${height+28}`} style={{ width:'100%' }}>
      {data.map((d,i)=>{
        const bh=(d.value/max)*(height-8)
        const x=pad+i*bw+bw*0.15, bwA=bw*0.7
        return (
          <g key={i}>
            <rect x={x} y={height-bh} width={bwA} height={bh} rx={4} fill={`${color}20`}/>
            <rect x={x} y={height-bh} width={bwA} height={Math.min(bh,5)} rx={4} fill={color}/>
            {bh>5&&<rect x={x} y={height-bh+4} width={bwA} height={bh-5} fill={`${color}14`}/>}
            <text x={x+bwA/2} y={height+20} textAnchor="middle" fontSize={9} fill={C.muted} fontFamily="Manrope,sans-serif">{d.label}</text>
          </g>
        )
      })}
    </svg>
  )
}

function LineChart({ data, color=C.primary, height=100 }:{ data:{label:string;value:number}[]; color?:string; height?:number }) {
  const max=Math.max(...data.map(d=>d.value),1), W=560, pad=28
  const step=(W-pad*2)/(data.length-1)
  const pts=data.map((d,i)=>({x:pad+i*step, y:height-(d.value/max)*(height-10)+4}))
  const pathD=pts.map((p,i)=>i===0?`M${p.x},${p.y}`:`L${p.x},${p.y}`).join(' ')
  const areaD=`${pathD} L${pts[pts.length-1].x},${height} L${pts[0].x},${height} Z`
  return (
    <svg viewBox={`0 0 ${W} ${height+28}`} style={{ width:'100%' }}>
      <defs><linearGradient id="admLg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.18"/><stop offset="100%" stopColor={color} stopOpacity="0.01"/></linearGradient></defs>
      <path d={areaD} fill="url(#admLg)"/>
      <path d={pathD} stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p,i)=>(
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={3.5} fill={color} stroke="#fff" strokeWidth={1.5}/>
          <text x={p.x} y={height+22} textAnchor="middle" fontSize={9} fill={C.muted} fontFamily="Manrope,sans-serif">{data[i].label}</text>
        </g>
      ))}
    </svg>
  )
}

// ─── Live clock ───────────────────────────────────────────────────────────────
function useClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => { const t=setInterval(()=>setNow(new Date()),1000); return ()=>clearInterval(t) },[])
  return now
}

// ─── Sub-view type ────────────────────────────────────────────────────────────
type SubView = 'home'|'kpis'|'liveMap'|'liveOps'|'revenue'|'bookingAnalytics'|'userOverview'|'agentOverview'|'platformHealth'|'emergency'|'notifications'|'quickActions'|'activity'|'announcements'|'calendar'|'reports'|'statusBadges'|'empty'|'loading'|'error'|'success'

const NAV: { k:SubView; l:string; icon:ReactNode; group:string; badge?:number }[] = [
  { k:'home',            l:'Dashboard',         icon:I.home,      group:'Main' },
  { k:'kpis',            l:'Platform KPIs',     icon:I.analytics, group:'Main' },
  { k:'liveMap',         l:'Live Map',          icon:I.map,       group:'Main' },
  { k:'liveOps',         l:'Live Operations',   icon:I.verify,    group:'Main' },
  { k:'emergency',       l:'Emergency Center',  icon:I.sos,       group:'Main', badge:2 },
  { k:'notifications',   l:'Notifications',     icon:I.bell,      group:'Main', badge:7 },
  { k:'revenue',         l:'Revenue',           icon:I.payments,  group:'Analytics' },
  { k:'bookingAnalytics',l:'Bookings',          icon:I.bookings,  group:'Analytics' },
  { k:'userOverview',    l:'Users',             icon:I.users,     group:'Analytics' },
  { k:'agentOverview',   l:'Care Agents',       icon:I.agents,    group:'Analytics' },
  { k:'platformHealth',  l:'Platform Health',   icon:I.support,   group:'Platform' },
  { k:'activity',        l:'Activity Feed',     icon:I.reports,   group:'Platform' },
  { k:'announcements',   l:'Announcements',     icon:I.bell,      group:'Platform' },
  { k:'calendar',        l:'Calendar',          icon:I.bookings,  group:'Platform' },
  { k:'reports',         l:'Reports',           icon:I.reports,   group:'Platform' },
  { k:'quickActions',    l:'Quick Actions',     icon:I.check,     group:'Platform' },
  { k:'statusBadges',    l:'Status Badges',     icon:I.check,     group:'Dev' },
  { k:'empty',           l:'Empty States',      icon:I.alert,     group:'Dev' },
  { k:'loading',         l:'Loading States',    icon:I.refresh,   group:'Dev' },
  { k:'error',           l:'Error States',      icon:I.alert,     group:'Dev' },
  { k:'success',         l:'Success States',    icon:I.check,     group:'Dev' },
]

// ─── Header ───────────────────────────────────────────────────────────────────
function AdminHeader({ sub, onToast, onToggleSidebar }:{ sub:SubView; onToast:(m:string)=>void; onToggleSidebar:()=>void }) {
  const now = useClock()
  const dateStr = now.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short',year:'numeric'})
  const timeStr = now.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'})
  return (
    <div style={{ height:56, background:C.surface, borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', paddingInline:'18px', gap:14, position:'sticky', top:0, zIndex:30, flexShrink:0 }}>
      <button className="adm-menu-btn" onClick={onToggleSidebar} style={{ display:'none', background:'none', border:'none', cursor:'pointer', color:C.type, padding:4 }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
      </button>
      <div style={{ flex:1, display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 12px', borderRadius:9, border:`1px solid ${C.border}`, background:'#FAFAFA', maxWidth:320, flex:1 }}>
          <span style={{ display:'flex', color:C.muted }}>{I.search}</span>
          <input placeholder="Search users, agents, bookings…" style={{ border:'none', background:'transparent', fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, outline:'none', flex:1 }} />
        </div>
      </div>
      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
        <div style={{ display:'flex', gap:3, alignItems:'center', padding:'5px 10px', borderRadius:8, background:`${C.success}10`, border:`1px solid ${C.success}20` }}>
          <div style={{ width:7, height:7, borderRadius:'50%', background:C.success, animation:'pulse-dot 2s infinite' }}/>
          <p style={{ fontSize:11, fontWeight:700, color:C.success }}>All Systems Operational</p>
        </div>
        <p style={{ fontSize:11, color:C.muted, fontFamily:'Manrope,sans-serif', whiteSpace:'nowrap' as const }}>{dateStr}</p>
        <p style={{ fontSize:11, fontWeight:700, color:C.type, fontFamily:'Manrope,sans-serif', minWidth:68 }}>{timeStr}</p>
        {[{icon:I.bell,badge:7},{icon:I.users,badge:0}].map((h,i)=>(
          <button key={i} onClick={()=>onToast('Opening panel…')}
            style={{ position:'relative' as const, width:36, height:36, borderRadius:9, border:`1px solid ${C.border}`, background:'#FAFAFA', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.sub }}>
            <span style={{display:'flex'}}>{h.icon}</span>
            {h.badge>0&&<div style={{ position:'absolute', top:4, right:4, width:8, height:8, borderRadius:'50%', background:C.error, border:'1.5px solid white' }}/>}
          </button>
        ))}
        <div style={{ display:'flex', gap:8, alignItems:'center', padding:'6px 10px', borderRadius:9, border:`1px solid ${C.border}`, cursor:'pointer', background:'#FAFAFA' }} onClick={()=>onToast('Admin profile')}>
          <div style={{ width:28, height:28, borderRadius:'50%', background:`linear-gradient(135deg,${C.dark},#2C3E43)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:10, fontWeight:900, fontFamily:'Manrope,sans-serif' }}>SA</div>
          <div>
            <p style={{ fontSize:11, fontWeight:800, color:C.type, lineHeight:1 }}>Super Admin</p>
            <p style={{ fontSize:9, color:C.muted }}>ReadyPal HQ</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Dashboard Home ───────────────────────────────────────────────────────────
function DashboardHome({ onNav, onToast }:{ onNav:(s:SubView)=>void; onToast:(m:string)=>void }) {
  const kpis = [
    { l:'Active Sessions',  v:42,     spark:[30,38,42,35,40,42], trend:'+8%',  c:C.primary,  icon:'🟢' },
    { l:"Today's Bookings", v:128,    spark:[90,105,115,120,122,128], trend:'+12%', c:C.success, icon:'📅' },
    { l:'Monthly Revenue',  v:'12.45M',spark:[10,10.8,11.2,11.9,12.1,12.45], trend:'+18%', c:C.info,    icon:'💰' },
    { l:'Verified Agents',  v:684,    spark:[600,620,640,660,675,684], trend:'+4%',  c:C.accent,  icon:'👤' },
    { l:'Registered Clients',v:2856,  spark:[2400,2550,2660,2730,2800,2856], trend:'+22%', c:C.warning, icon:'👥' },
    { l:'Pending Verify',   v:18,     spark:[22,20,21,19,20,18], trend:'−10%', c:C.warning, icon:'⏳' },
    { l:'Support Tickets',  v:11,     spark:[14,12,13,11,12,11], trend:'−8%',  c:C.muted,   icon:'🎫' },
    { l:'Emergency Alerts', v:2,      spark:[1,0,2,1,0,2], trend:'⚠',       c:C.error,   icon:'🚨' },
  ]

  const recentAlerts = [
    { t:'Emergency SOS', d:'Kasun Perera · Active visit · Colombo 5', time:'2 min ago', c:C.error },
    { t:'Verification Due', d:'3 agents awaiting document approval', time:'8 min ago', c:C.warning },
    { t:'Payment Held', d:'LKR 45,000 pending release · TXN-0892', time:'12 min ago', c:C.warning },
    { t:'High Ticket Volume', d:'Support queue above threshold (11)', time:'18 min ago', c:C.info },
  ]

  return (
    <div style={{ padding:'20px 24px 60px' }}>
      {/* KPI grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }} className="adm-4col">
        {kpis.map((k,i)=>(
          <Card key={i} hover style={{ padding:18, border:k.c===C.error?`1.5px solid ${C.error}25`:undefined, background:k.c===C.error?`${C.error}03`:C.surface }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
              <p style={{ fontSize:11, color:C.muted, lineHeight:1.4 }}>{k.l}</p>
              <span style={{ fontSize:16 }}>{k.icon}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
              <p style={{ fontSize:26, fontWeight:900, color:k.c, fontFamily:'Manrope,sans-serif', lineHeight:1 }}>
                {typeof k.v==='string'?`LKR ${k.v}`:k.v}
              </p>
              <SparkBar data={k.spark} color={k.c} h={36} />
            </div>
            <div style={{ marginTop:8 }}>
              <Bdg label={k.trend} color={k.trend.startsWith('−')||k.trend==='⚠'?k.c===C.error?C.error:C.warning:C.success} />
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:16, marginBottom:16 }} className="adm-main-split">
        {/* Live ops snapshot */}
        <Card style={{ padding:20 }}>
          <SectionTitle title="Live Platform Activity" action="Full View" onAction={()=>onNav('liveOps')} />
          {/* Live session list */}
          {[{agent:'Kasun Perera',  client:'Mohamed Ihsan',  service:'Hospital Companion',   status:'careInProgress', dur:'1h 22m', dist:'Colombo 5'},
            {agent:'Nimal Siripala', client:'Priya Fernando', service:'Post-Surgery Care',     status:'arrived',        dur:'45m',    dist:'Dehiwala'},
            {agent:'Kumari Perera', client:'Chamari D.',      service:'Home Wellness Visit',   status:'travelling',     dur:'18m',    dist:'Nugegoda'},
            {agent:'Ravi Fernando', client:'Suresh P.',       service:'Medication Collection', status:'completed',      dur:'Done',   dist:'Colombo 3'},
          ].map((s,i)=>{
            const sc: Record<string,{c:string;l:string}> = {careInProgress:{c:C.primary,l:'In Progress'},arrived:{c:C.info,l:'Arrived'},travelling:{c:C.warning,l:'Travelling'},completed:{c:C.success,l:'Completed'}}
            const st=sc[s.status]
            return (
              <div key={i} style={{ display:'flex', gap:12, alignItems:'center', padding:'10px 0', borderBottom:i<3?`1px solid ${C.border}`:'none' }}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:`${C.primary}12`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary, fontWeight:900, fontSize:11, fontFamily:'Manrope,sans-serif', flexShrink:0 }}>
                  {s.agent.split(' ').map(x=>x[0]).join('')}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:12, fontWeight:700, color:C.type, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as const }}>{s.agent} → {s.client}</p>
                  <p style={{ fontSize:10, color:C.muted }}>{s.service} · {s.dist}</p>
                </div>
                <div style={{ textAlign:'right' as const, flexShrink:0 }}>
                  <Bdg label={st.l} color={st.c} dot />
                  <p style={{ fontSize:10, color:C.muted, marginTop:2 }}>{s.dur}</p>
                </div>
              </div>
            )
          })}
        </Card>

        {/* Right col */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {/* Alerts */}
          <Card style={{ padding:18 }}>
            <SectionTitle title="Recent Alerts" action="View All" onAction={()=>onNav('notifications')} />
            {recentAlerts.map((a,i)=>(
              <div key={i} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom:i<recentAlerts.length-1?`1px solid ${C.border}`:'none' }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:a.c, marginTop:4, flexShrink:0 }}/>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:11, fontWeight:700, color:C.type }}>{a.t}</p>
                  <p style={{ fontSize:10, color:C.muted, lineHeight:1.4 }}>{a.d}</p>
                </div>
                <p style={{ fontSize:9, color:C.muted, flexShrink:0 }}>{a.time}</p>
              </div>
            ))}
          </Card>
          {/* Emergency banner */}
          <Card style={{ padding:18, border:`2px solid ${C.error}40`, background:`${C.error}04` }}>
            <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
              <div style={{ width:40, height:40, borderRadius:12, background:`${C.error}12`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>🚨</div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:13, fontWeight:800, color:C.error, marginBottom:3 }}>2 Active Emergency Alerts</p>
                <p style={{ fontSize:11, color:C.sub, marginBottom:10 }}>Immediate attention required · Colombo</p>
                <Btn label="View Emergencies" variant="danger" small full onClick={()=>onNav('emergency')} />
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }} className="adm-3col">
        {/* Revenue snapshot */}
        <Card style={{ padding:18 }}>
          <SectionTitle title="Revenue Today" action="Full Report" onAction={()=>onNav('revenue')} />
          <p style={{ fontSize:28, fontWeight:900, color:C.success, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:6 }}>LKR 412K</p>
          <LineSpark data={[280,320,350,380,395,412]} color={C.success} h={40} w={120}/>
          <div style={{ marginTop:10, display:'flex', gap:10 }}>
            <div style={{ flex:1, textAlign:'center' as const, padding:'7px', borderRadius:8, background:C.bg }}>
              <p style={{ fontSize:11, fontWeight:700, color:C.primary }}>LKR 2.8M</p>
              <p style={{ fontSize:9, color:C.muted }}>Weekly</p>
            </div>
            <div style={{ flex:1, textAlign:'center' as const, padding:'7px', borderRadius:8, background:C.bg }}>
              <p style={{ fontSize:11, fontWeight:700, color:C.primary }}>LKR 12.45M</p>
              <p style={{ fontSize:9, color:C.muted }}>Monthly</p>
            </div>
          </div>
        </Card>
        {/* Quick actions */}
        <Card style={{ padding:18 }}>
          <SectionTitle title="Quick Actions" />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {[{e:'✅',l:'Approve Agents',cb:()=>onToast('Opening approvals')},{e:'🚨',l:'Emergencies',  cb:()=>onNav('emergency')},{e:'👥',l:'Users',         cb:()=>onNav('userOverview')},{e:'📊',l:'Reports',      cb:()=>onNav('reports')},{e:'🎫',l:'Support',      cb:()=>onToast('Opening support')},{e:'⚙️',l:'Settings',     cb:()=>onToast('Opening settings')}].map((a,i)=>(
              <button key={i} onClick={a.cb}
                style={{ padding:'10px 4px', borderRadius:10, border:`1px solid ${C.border}`, background:'#FAFAFA', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:4, fontFamily:'Manrope,sans-serif', fontSize:10, fontWeight:700, color:C.sub, transition:'all 0.12s' }}
                onMouseOver={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor=C.primary;(e.currentTarget as HTMLButtonElement).style.color=C.primary}}
                onMouseOut={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor=C.border;(e.currentTarget as HTMLButtonElement).style.color=C.sub}}>
                <p style={{ fontSize:20 }}>{a.e}</p>{a.l}
              </button>
            ))}
          </div>
        </Card>
        {/* Announcements */}
        <Card style={{ padding:18 }}>
          <SectionTitle title="Announcements" action="New" onAction={()=>onToast('Create announcement')} />
          {[{t:'v2.4 Release',d:'New availability management features deployed.',time:'Today',pin:true},{t:'Scheduled Maintenance',d:'Payment gateway maintenance Sunday 2–4 AM.',time:'Jan 26',pin:false},{t:'Policy Update',d:'Updated cancellation policy effective Feb 1.',time:'Jan 22',pin:false}].map((a,i)=>(
            <div key={i} style={{ padding:'8px 0', borderBottom:i<2?`1px solid ${C.border}`:'none' }}>
              <div style={{ display:'flex', gap:5, alignItems:'center', marginBottom:2 }}>
                {a.pin&&<div style={{ width:6, height:6, borderRadius:'50%', background:C.primary }}/>}
                <p style={{ fontSize:11, fontWeight:700, color:C.type }}>{a.t}</p>
              </div>
              <p style={{ fontSize:10, color:C.muted, lineHeight:1.5 }}>{a.d}</p>
              <p style={{ fontSize:9, color:C.muted }}>{a.time}</p>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

// ─── Platform KPIs ────────────────────────────────────────────────────────────
function PlatformKPIs() {
  const rows = [
    { group:'Bookings',   items:[{l:'Today',v:128,c:C.primary},{l:'This Week',v:891,c:C.success},{l:'This Month',v:3648,c:C.info},{l:'Cancellation Rate',v:'6.2%',c:C.warning}] },
    { group:'Revenue',    items:[{l:'Today',v:'LKR 412K',c:C.success},{l:'Weekly',v:'LKR 2.8M',c:C.success},{l:'Monthly',v:'LKR 12.45M',c:C.success},{l:'Platform Fees',v:'LKR 995K',c:C.primary}] },
    { group:'Users',      items:[{l:'Total Clients',v:2856,c:C.primary},{l:'Active',v:1924,c:C.success},{l:'New This Month',v:312,c:C.info},{l:'Growth',v:'+12.3%',c:C.success}] },
    { group:'Care Agents',items:[{l:'Verified',v:684,c:C.primary},{l:'Online Now',v:87,c:C.success},{l:'Pending Approval',v:18,c:C.warning},{l:'Avg Rating',v:'4.76★',c:C.warning}] },
    { group:'Platform',   items:[{l:'Active Sessions',v:42,c:C.primary},{l:'Delayed Services',v:3,c:C.warning},{l:'Support Tickets',v:11,c:C.muted},{l:'Emergency Alerts',v:2,c:C.error}] },
  ]
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:20 }}>Platform KPIs</h2>
      {rows.map((r,i)=>(
        <div key={i} style={{ marginBottom:16 }}>
          <p style={{ fontSize:11, fontWeight:800, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.08em', marginBottom:8 }}>{r.group}</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }} className="adm-4col">
            {r.items.map((s,j)=>(
              <Card key={j} style={{ padding:18 }}>
                <p style={{ fontSize:10, color:C.muted, marginBottom:6 }}>{s.l}</p>
                <p style={{ fontSize:24, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1 }}>{s.v}</p>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Live Map ─────────────────────────────────────────────────────────────────
function LiveMap() {
  const pins = [
    {x:255,y:108,c:C.primary,  l:'Kasun P. · In Progress'},
    {x:235,y:125,c:C.info,     l:'Nimal S. · Arrived'},
    {x:270,y:95, c:C.warning,  l:'Kumari P. · Travelling'},
    {x:245,y:140,c:C.success,  l:'Ravi F. · Completed'},
    {x:280,y:118,c:C.error,    l:'SOS Alert · Colombo 5'},
  ]
  const [hovered, setHovered] = useState<number|null>(null)
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Live Platform Map</h2>
        <div style={{ display:'flex', gap:8 }}>
          {[{c:C.primary,l:'In Progress'},{c:C.warning,l:'Travelling'},{c:C.success,l:'Completed'},{c:C.error,l:'Emergency'}].map((lg,i)=>(
            <div key={i} style={{ display:'flex', gap:5, alignItems:'center' }}><div style={{ width:8, height:8, borderRadius:'50%', background:lg.c }}/><p style={{ fontSize:10, color:C.sub }}>{lg.l}</p></div>
          ))}
        </div>
      </div>
      <Card style={{ overflow:'hidden', marginBottom:14 }}>
        <div style={{ position:'relative' as const, height:400, background:'#EBF5F6' }}>
          <svg viewBox="0 0 500 400" style={{ width:'100%', height:'100%' }}>
            {/* Grid */}
            {[...Array(21)].map((_,i)=><line key={`h${i}`} x1="0" y1={i*20} x2="500" y2={i*20} stroke="#D0E8EA" strokeWidth="0.5"/>)}
            {[...Array(26)].map((_,i)=><line key={`v${i}`} x1={i*20} y1="0" x2={i*20} y2="400" stroke="#D0E8EA" strokeWidth="0.5"/>)}
            {/* Sri Lanka shape */}
            <ellipse cx="255" cy="155" rx="65" ry="120" fill={`${C.primary}10`} stroke={C.primary} strokeWidth="1.5" opacity="0.6"/>
            {/* Colombo coverage area */}
            <circle cx="250" cy="110" r="80" fill={`${C.primary}06`} stroke={C.primary} strokeWidth="1" strokeDasharray="6 4" opacity="0.6"/>
            {/* Heatmap dots */}
            {[{x:252,y:108,r:30},{x:242,y:120,r:24},{x:262,y:100,r:20}].map((h,i)=>(
              <circle key={i} cx={h.x} cy={h.y} r={h.r} fill={`${C.primary}08`}/>
            ))}
            {/* Live pins */}
            {pins.map((p,i)=>(
              <g key={i} style={{ cursor:'pointer' }} onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(null)}>
                <circle cx={p.x} cy={p.y} r={p.c===C.error?16:12} fill={`${p.c}20`}/>
                <circle cx={p.x} cy={p.y} r={p.c===C.error?10:7} fill={p.c} stroke="white" strokeWidth={1.5}/>
                {p.c===C.error&&(
                  <text x={p.x} y={p.y+4} textAnchor="middle" fontSize={8} fontWeight="bold" fill="white" fontFamily="Manrope,sans-serif">SOS</text>
                )}
                {hovered===i&&(
                  <g>
                    <rect x={p.x-60} y={p.y-36} width={120} height={22} rx={6} fill="rgba(44,62,67,0.92)"/>
                    <text x={p.x} y={p.y-22} textAnchor="middle" fontSize={9} fill="white" fontFamily="Manrope,sans-serif">{p.l}</text>
                  </g>
                )}
              </g>
            ))}
            <text x="10" y="20" fontSize="11" fontWeight="700" fill={C.primary} fontFamily="Manrope,sans-serif">ReadyPal Live · Colombo Region</text>
          </svg>
          <div style={{ position:'absolute', bottom:12, right:12, background:'rgba(255,255,255,0.94)', borderRadius:10, padding:'10px 14px', backdropFilter:'blur(8px)' }}>
            <p style={{ fontSize:10, fontWeight:800, color:C.type, marginBottom:5 }}>LIVE</p>
            {[{c:C.primary,v:'42',l:'Active'},{c:C.warning,v:'3',l:'Travelling'},{c:C.error,v:'2',l:'Emergency'}].map((s,i)=>(
              <div key={i} style={{ display:'flex', gap:6, alignItems:'center', marginBottom:3 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:s.c }}/>
                <p style={{ fontSize:10, fontWeight:700, color:s.c }}>{s.v}</p>
                <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}

// ─── Live Operations ──────────────────────────────────────────────────────────
function LiveOperations({ onToast }:{ onToast:(m:string)=>void }) {
  const sessions = [
    {agent:'Kasun Perera',   client:'Mohamed Ihsan',  service:'Hospital Companion',   status:'careInProgress', dur:'1h 22m', loc:'Colombo 5', priority:false},
    {agent:'Nimal Siripala', client:'Priya Fernando', service:'Post-Surgery Care',     status:'arrived',        dur:'45m',    loc:'Dehiwala',  priority:false},
    {agent:'Kumari Perera',  client:'Chamari D.',     service:'Home Wellness Visit',   status:'travelling',     dur:'18m',    loc:'Nugegoda',  priority:false},
    {agent:'Sajith Bandara', client:'Thilina S.',     service:'Dementia Care',         status:'emergency',      dur:'2h 5m',  loc:'Colombo 3', priority:true},
    {agent:'Ravi Fernando',  client:'Suresh P.',      service:'Medication Collection', status:'completed',      dur:'Done',   loc:'Colombo 3', priority:false},
  ]
  const sc: Record<string,{c:string;l:string}> = { careInProgress:{c:C.primary,l:'In Progress'}, arrived:{c:C.info,l:'Arrived'}, travelling:{c:C.warning,l:'Travelling'}, emergency:{c:C.error,l:'Emergency'}, completed:{c:C.success,l:'Completed'} }
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Live Operations</h2>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <div style={{ display:'flex', gap:5, alignItems:'center', padding:'5px 10px', borderRadius:8, background:`${C.success}10`, border:`1px solid ${C.success}20` }}>
            <div style={{ width:7, height:7, borderRadius:'50%', background:C.success, animation:'pulse-dot 2s infinite' }}/>
            <p style={{ fontSize:11, fontWeight:700, color:C.success }}>Live</p>
          </div>
          <Btn label="Refresh" variant="ghost" small icon={I.refresh} onClick={()=>onToast('Refreshed')} />
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 }} className="adm-4col">
        {[{l:'Active Visits',v:'42',c:C.primary},{l:'Travelling',v:'8',c:C.warning},{l:'Delayed',v:'3',c:C.error},{l:'Completed Today',v:'86',c:C.success}].map((s,i)=>(
          <Card key={i} style={{ padding:16, textAlign:'center' as const }}>
            <p style={{ fontSize:26, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{s.v}</p>
            <p style={{ fontSize:11, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      <Card>
        <div style={{ padding:'16px 20px', borderBottom:`1px solid ${C.border}`, display:'flex', gap:12, alignItems:'center' }}>
          <p style={{ fontSize:13, fontWeight:800, color:C.type, flex:1 }}>All Active Sessions</p>
          {['All','In Progress','Travelling','Emergency','Completed'].map((f,i)=>(
            <button key={i} style={{ padding:'5px 12px', borderRadius:99, border:`1px solid ${C.border}`, background:i===0?C.primary:'#FAFAFA', color:i===0?'#fff':C.sub, cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:10, fontWeight:700, transition:'all 0.1s' }}>{f}</button>
          ))}
        </div>
        {sessions.map((s,i)=>{
          const st=sc[s.status]
          return (
            <div key={i} style={{ display:'flex', gap:14, alignItems:'center', padding:'14px 20px', borderBottom:i<sessions.length-1?`1px solid ${C.border}`:'none', background:s.priority?`${C.error}03`:undefined }}>
              <div style={{ width:40, height:40, borderRadius:'50%', background:`${C.primary}12`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary, fontWeight:900, fontSize:11, fontFamily:'Manrope,sans-serif', flexShrink:0 }}>
                {s.agent.split(' ').map(x=>x[0]).join('')}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:2 }}>
                  <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{s.agent}</p>
                  {s.priority&&<Bdg label="Priority" color={C.error} />}
                  <span style={{ fontSize:10, color:C.muted }}>→ {s.client}</span>
                </div>
                <p style={{ fontSize:10, color:C.muted }}>{s.service} · {s.loc}</p>
              </div>
              <div style={{ textAlign:'right' as const }}>
                <Bdg label={st.l} color={st.c} dot />
                <p style={{ fontSize:10, color:C.muted, marginTop:2 }}>{s.dur}</p>
              </div>
              <Btn label="Monitor" variant="ghost" small onClick={()=>onToast(`Monitoring ${s.agent}`)} />
            </div>
          )
        })}
      </Card>
    </div>
  )
}

// ─── Revenue Overview ─────────────────────────────────────────────────────────
function RevenueOverview() {
  const [period, setPeriod] = useState<'week'|'month'|'year'>('month')
  const monthly = [{label:'Jul',value:9800000},{label:'Aug',value:10200000},{label:'Sep',value:9500000},{label:'Oct',value:11000000},{label:'Nov',value:10800000},{label:'Dec',value:9200000},{label:'Jan',value:12450000}]
  const weekly = [{label:'Mon',value:1800000},{label:'Tue',value:2100000},{label:'Wed',value:1900000},{label:'Thu',value:2400000},{label:'Fri',value:2200000},{label:'Sat',value:1600000},{label:'Sun',value:450000}]
  const chartData = period==='month'?monthly:period==='week'?weekly:[{label:'2021',value:68},{label:'2022',value:95},{label:'2023',value:124},{label:'2024',value:148},{label:'2025',value:12.45}].map(d=>({...d,value:d.value*1000000}))
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>Revenue Overview</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }} className="adm-4col">
        {[{l:"Today's Revenue",v:'LKR 412,000',c:C.success,trend:'+8%'},{l:'Weekly Revenue',v:'LKR 2.8M',c:C.success,trend:'+14%'},{l:'Monthly Revenue',v:'LKR 12.45M',c:C.success,trend:'+18%'},{l:'Annual Revenue',v:'LKR 148M',c:C.info,trend:'+22%'},{l:'Platform Fees',v:'LKR 995K',c:C.primary,trend:'+18%'},{l:'Pending Payouts',v:'LKR 1.82M',c:C.warning,trend:'+5%'},{l:'Refunds (Month)',v:'LKR 84K',c:C.error,trend:'+2%'},{l:'Revenue Growth',v:'+18.2%',c:C.success,trend:'YoY'}].map((s,i)=>(
          <Card key={i} style={{ padding:18 }}>
            <p style={{ fontSize:10, color:C.muted, marginBottom:6 }}>{s.l}</p>
            <p style={{ fontSize:18, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:6 }}>{s.v}</p>
            <Bdg label={s.trend} color={s.c===C.error?C.error:C.success} />
          </Card>
        ))}
      </div>
      <Card style={{ padding:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <h3 style={{ fontSize:14, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Revenue Trend</h3>
          <div style={{ display:'flex', gap:3, border:`1px solid ${C.border}`, borderRadius:9, overflow:'hidden' }}>
            {(['week','month','year'] as const).map(p=>(
              <button key={p} onClick={()=>setPeriod(p)} style={{ padding:'5px 13px', border:'none', cursor:'pointer', background:period===p?C.primary:'#FAFAFA', color:period===p?'#fff':C.sub, fontFamily:'Manrope,sans-serif', fontSize:11, fontWeight:700, transition:'all 0.1s' }}>
                {p.charAt(0).toUpperCase()+p.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <LineChart data={chartData.map(d=>({label:d.label,value:d.value/1000000}))} color={C.success} height={120} />
      </Card>
    </div>
  )
}

// ─── Booking Analytics ────────────────────────────────────────────────────────
function BookingAnalytics() {
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>Booking Analytics</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 }} className="adm-4col">
        {[{l:'Daily Avg',v:'128',c:C.primary},{l:'Weekly Total',v:'891',c:C.success},{l:'Monthly Total',v:'3,648',c:C.info},{l:'Cancellation Rate',v:'6.2%',c:C.warning}].map((s,i)=>(
          <Card key={i} style={{ padding:18, textAlign:'center' as const }}>
            <p style={{ fontSize:26, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{s.v}</p>
            <p style={{ fontSize:11, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:14 }} className="adm-main-split">
        <Card style={{ padding:20 }}>
          <SectionTitle title="Daily Booking Trend (This Week)" />
          <BarChart data={[{label:'Mon',value:98},{label:'Tue',value:115},{label:'Wed',value:102},{label:'Thu',value:134},{label:'Fri',value:128},{label:'Sat',value:87},{label:'Sun',value:42}]} color={C.primary} height={120} />
        </Card>
        <Card style={{ padding:20 }}>
          <SectionTitle title="By Service Category" />
          {[{l:'Hospital Companion',pct:38,v:'1,386'},{l:'Home Care',pct:28,v:'1,021'},{l:'Post-Surgery',pct:16,v:'584'},{l:'Medication',pct:12,v:'438'},{l:'Other',pct:6,v:'219'}].map((s,i)=>(
            <div key={i} style={{ marginBottom:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                <p style={{ fontSize:11, color:C.sub }}>{s.l}</p>
                <p style={{ fontSize:11, fontWeight:700, color:C.primary }}>{s.v}</p>
              </div>
              <div style={{ height:5, borderRadius:99, background:`${C.primary}12` }}>
                <div style={{ width:`${s.pct}%`, height:'100%', background:C.primary, borderRadius:99 }} />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

// ─── User Overview ────────────────────────────────────────────────────────────
function UserOverview() {
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>User Overview</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12, marginBottom:16 }} className="adm-5col">
        {[{l:'Total Clients',v:'2,856',c:C.primary},{l:'Active Clients',v:'1,924',c:C.success},{l:'New This Month',v:'312',c:C.info},{l:'Returning',v:'1,612',c:C.accent},{l:'Growth',v:'+12.3%',c:C.success}].map((s,i)=>(
          <Card key={i} style={{ padding:18, textAlign:'center' as const }}>
            <p style={{ fontSize:24, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{s.v}</p>
            <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <Card style={{ padding:20 }}>
          <SectionTitle title="Monthly Client Growth" />
          <LineChart data={[{label:'Jul',value:2200},{label:'Aug',value:2350},{label:'Sep',value:2480},{label:'Oct',value:2580},{label:'Nov',value:2700},{label:'Dec',value:2750},{label:'Jan',value:2856}]} color={C.primary} height={110} />
        </Card>
        <Card style={{ padding:20 }}>
          <SectionTitle title="Client Segments" />
          {[{l:'Post-Surgery Recovery',pct:34,c:C.primary},{l:'Elderly Companionship',pct:28,c:C.success},{l:'Medical Appointments',pct:22,c:C.info},{l:'Home Care',pct:16,c:C.accent}].map((s,i)=>(
            <div key={i} style={{ marginBottom:11 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                <p style={{ fontSize:11, color:C.sub }}>{s.l}</p>
                <p style={{ fontSize:11, fontWeight:700, color:s.c }}>{s.pct}%</p>
              </div>
              <div style={{ height:5, borderRadius:99, background:`${s.c}15` }}>
                <div style={{ width:`${s.pct}%`, height:'100%', background:s.c, borderRadius:99 }} />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

// ─── Care Agent Overview ──────────────────────────────────────────────────────
function AgentOverview({ onToast }:{ onToast:(m:string)=>void }) {
  const statuses = [{l:'Online',v:87,c:C.success},{l:'Busy',v:42,c:C.primary},{l:'Offline',v:555,c:C.muted},{l:'Pending Approval',v:18,c:C.warning}]
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>Care Agent Overview</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 }} className="adm-4col">
        {[{l:'Verified Agents',v:'684',c:C.primary},{l:'Top Rated (4.8+)',v:'312',c:C.success},{l:'Average Rating',v:'4.76★',c:C.warning},{l:'Avg Response',v:'4.2 min',c:C.info}].map((s,i)=>(
          <Card key={i} style={{ padding:18 }}>
            <p style={{ fontSize:10, color:C.muted, marginBottom:6 }}>{s.l}</p>
            <p style={{ fontSize:24, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1 }}>{s.v}</p>
          </Card>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
        <Card style={{ padding:20 }}>
          <SectionTitle title="Agent Status Distribution" />
          {statuses.map((s,i)=>(
            <div key={i} style={{ marginBottom:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:s.c }}/>
                  <p style={{ fontSize:11, color:C.sub }}>{s.l}</p>
                </div>
                <p style={{ fontSize:12, fontWeight:700, color:s.c }}>{s.v}</p>
              </div>
              <div style={{ height:5, borderRadius:99, background:`${s.c}15` }}>
                <div style={{ width:`${(s.v/684)*100}%`, height:'100%', background:s.c, borderRadius:99 }} />
              </div>
            </div>
          ))}
        </Card>
        <Card style={{ padding:20 }}>
          <SectionTitle title="Pending Approvals" action="Review All" onAction={()=>onToast('Opening approvals')} />
          {[{name:'Dilshan Ratnayake', sub:'Documents submitted · Jan 20'},{name:'Ayesha Malik',       sub:'Background check pending · Jan 19'},{name:'Sampath Jayawardena',sub:'Medical cert expired · Jan 18'}].map((a,i)=>(
            <div key={i} style={{ display:'flex', gap:10, alignItems:'center', padding:'9px 0', borderBottom:i<2?`1px solid ${C.border}`:'none' }}>
              <div style={{ width:34, height:34, borderRadius:'50%', background:`${C.warning}15`, display:'flex', alignItems:'center', justifyContent:'center', color:C.warning, fontWeight:900, fontSize:11, flexShrink:0 }}>
                {a.name.split(' ').map(x=>x[0]).join('').slice(0,2)}
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:11, fontWeight:700, color:C.type }}>{a.name}</p>
                <p style={{ fontSize:10, color:C.muted }}>{a.sub}</p>
              </div>
              <Btn label="Review" variant="secondary" small onClick={()=>onToast(`Reviewing ${a.name}`)} />
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

// ─── Platform Health ──────────────────────────────────────────────────────────
function PlatformHealth() {
  const services = [
    {l:'Web Application',    status:'healthy', uptime:'99.98%', latency:'124ms'},
    {l:'API Gateway',        status:'healthy', uptime:'99.95%', latency:'68ms'},
    {l:'Payment Gateway',    status:'healthy', uptime:'99.92%', latency:'210ms'},
    {l:'Notification Queue', status:'healthy', uptime:'100%',   latency:'42ms'},
    {l:'Storage (S3)',        status:'healthy', uptime:'100%',   latency:'28ms'},
    {l:'Email Service',      status:'warning', uptime:'99.1%',  latency:'480ms'},
  ]
  const sc: Record<string,{c:string;l:string}> = { healthy:{c:C.success,l:'Healthy'}, warning:{c:C.warning,l:'Degraded'}, error:{c:C.error,l:'Down'} }
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:8 }}>Platform Health</h2>
      <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:18, padding:'12px 16px', borderRadius:12, background:`${C.success}08`, border:`1.5px solid ${C.success}20` }}>
        <div style={{ width:10, height:10, borderRadius:'50%', background:C.success, animation:'pulse-dot 2s infinite' }}/>
        <p style={{ fontSize:13, fontWeight:700, color:C.success }}>All Systems Operational</p>
        <p style={{ fontSize:11, color:C.muted }}>Last checked: just now</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
        {services.map((s,i)=>{
          const st=sc[s.status]
          return (
            <Card key={i} style={{ padding:18, border:`1.5px solid ${st.c}20` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{s.l}</p>
                <Bdg label={st.l} color={st.c} dot />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                <div style={{ textAlign:'center' as const, padding:'7px', borderRadius:8, background:C.bg }}>
                  <p style={{ fontSize:13, fontWeight:900, color:st.c, fontFamily:'Manrope,sans-serif' }}>{s.uptime}</p>
                  <p style={{ fontSize:9, color:C.muted }}>Uptime</p>
                </div>
                <div style={{ textAlign:'center' as const, padding:'7px', borderRadius:8, background:C.bg }}>
                  <p style={{ fontSize:13, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>{s.latency}</p>
                  <p style={{ fontSize:9, color:C.muted }}>Latency</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
      <Card style={{ padding:20 }}>
        <SectionTitle title="System Uptime (30 days)" />
        <BarChart data={[...Array(30)].map((_,i)=>({label:'',value:98+Math.random()*2}))} color={C.success} height={60} />
        <p style={{ fontSize:10, color:C.muted, marginTop:8, textAlign:'center' as const }}>30-day avg: 99.94% · SLA target: 99.9%</p>
      </Card>
    </div>
  )
}

// ─── Emergency Center ─────────────────────────────────────────────────────────
function EmergencyCenter({ onToast }:{ onToast:(m:string)=>void }) {
  const cases = [
    { id:'EMG-001', agent:'Kasun Perera',   client:'Mohamed Ihsan',  type:'Medical SOS',      loc:'Colombo 5', time:'2 min ago', priority:'critical', status:'active' },
    { id:'EMG-002', agent:'Sajith Bandara', client:'Thilina S.',     type:'Client Unresponsive',loc:'Colombo 3',time:'8 min ago', priority:'high',     status:'escalated' },
  ]
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:18 }}>
        <div style={{ width:42, height:42, borderRadius:14, background:`${C.error}12`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>🚨</div>
        <div>
          <h2 style={{ fontSize:20, fontWeight:900, color:C.error, fontFamily:'Manrope,sans-serif', lineHeight:1 }}>Emergency Center</h2>
          <p style={{ fontSize:12, color:C.muted }}>2 active cases requiring immediate attention</p>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }} className="adm-4col">
        {[{l:'Active SOS',v:'2',c:C.error},{l:'Priority Queue',v:'2',c:C.warning},{l:'Escalated',v:'1',c:C.error},{l:'Resolved Today',v:'3',c:C.success}].map((s,i)=>(
          <Card key={i} style={{ padding:16, textAlign:'center' as const, border:`1.5px solid ${s.c}25`, background:`${s.c}04` }}>
            <p style={{ fontSize:28, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{s.v}</p>
            <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      {cases.map((c,i)=>(
        <Card key={i} style={{ padding:20, marginBottom:12, border:`2px solid ${C.error}40`, background:`${C.error}03` }}>
          <div style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
            <div style={{ width:48, height:48, borderRadius:14, background:`${C.error}12`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>🚨</div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                <p style={{ fontSize:14, fontWeight:900, color:C.error, fontFamily:'Manrope,sans-serif' }}>{c.type}</p>
                <Bdg label={c.priority.toUpperCase()} color={C.error} dot />
                <Bdg label={c.status==='active'?'Active':'Escalated'} color={C.warning} dot />
              </div>
              <p style={{ fontSize:12, color:C.type, marginBottom:2 }}><strong>Agent:</strong> {c.agent} → <strong>Client:</strong> {c.client}</p>
              <p style={{ fontSize:11, color:C.muted }}>📍 {c.loc} · {c.time} · Ref: {c.id}</p>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <Btn label="Respond" variant="danger" small onClick={()=>onToast(`Responding to ${c.id}`)} />
              <Btn label="Escalate" variant="warning" small onClick={()=>onToast(`Escalating ${c.id}`)} />
            </div>
          </div>
        </Card>
      ))}
      <Card style={{ padding:20 }}>
        <SectionTitle title="Emergency Contacts" />
        {[{org:'Colombo National Hospital',phone:'+94 11 269 1111',type:'Hospital'},{org:'Police Emergency',phone:'119',type:'Police'},{org:'Ambulance Service',phone:'110',type:'Ambulance'}].map((ec,i)=>(
          <div key={i} style={{ display:'flex', gap:12, alignItems:'center', padding:'10px 0', borderBottom:i<2?`1px solid ${C.border}`:'none' }}>
            <div style={{ width:38, height:38, borderRadius:12, background:`${C.error}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{['🏥','🚔','🚑'][i]}</div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{ec.org}</p>
              <p style={{ fontSize:11, color:C.primary, fontWeight:700 }}>{ec.phone}</p>
            </div>
            <Bdg label={ec.type} color={C.error} />
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── Notification Center ──────────────────────────────────────────────────────
function NotificationCenter({ onToast }:{ onToast:(m:string)=>void }) {
  const items = [
    { e:'🚨', t:'Emergency Alert',     b:'Active SOS from Kasun Perera — Colombo 5. Immediate response needed.',   c:C.error,   read:false },
    { e:'👤', t:'New Registration',    b:'Dilshan Ratnayake submitted care agent application for review.',          c:C.info,    read:false },
    { e:'✅', t:'Verification Pending',b:'3 care agents awaiting document approval. Oldest: 2 days pending.',       c:C.warning, read:false },
    { e:'💰', t:'Payment Received',    b:'LKR 45,000 platform fee received · TXN-0892 · Nimal Siripala.',          c:C.success, read:false },
    { e:'🎫', t:'Support Ticket',      b:'Priority support ticket opened by client Priya Fernando — unresponsive app.', c:C.warning, read:true  },
    { e:'⚙️', t:'System Alert',        b:'Email delivery latency above threshold (480ms). Investigating.',           c:C.warning, read:true  },
    { e:'📋', t:'New Booking',         b:'128 bookings processed today — all-time daily record!',                   c:C.primary, read:true  },
  ]
  return (
    <div style={{ maxWidth:720, margin:'0 auto', padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Notification Center</h2>
        <div style={{ display:'flex', gap:8 }}>
          <Bdg label={`${items.filter(n=>!n.read).length} unread`} color={C.error} dot />
          <Btn label="Mark All Read" variant="ghost" small onClick={()=>onToast('All marked read')} />
        </div>
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
            {n.c===C.error&&<Btn label="Act" variant="danger" small onClick={()=>onToast('Responding…')} />}
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Activity Feed ────────────────────────────────────────────────────────────
function ActivityFeed() {
  const events = [
    {e:'👤',t:'New Client Registered',   d:'Chamari Wickrama, Colombo 7',      time:'2 min ago', c:C.info},
    {e:'✅',t:'Care Agent Approved',     d:'Dilshan Ratnayake — all docs verified', time:'8 min ago', c:C.success},
    {e:'📅',t:'Booking Completed',       d:'Kasun Perera · Hospital Companion · LKR 6,000', time:'12 min ago', c:C.primary},
    {e:'💳',t:'Payment Processed',       d:'LKR 45,000 released to Nimal Siripala',time:'18 min ago', c:C.success},
    {e:'↩️',t:'Refund Issued',           d:'LKR 3,500 · Cancelled booking #BK-9921', time:'24 min ago', c:C.error},
    {e:'⭐',t:'Review Submitted',        d:'5★ from Mohamed Ihsan for Kasun Perera',time:'31 min ago', c:C.warning},
    {e:'🚨',t:'Emergency Resolved',      d:'EMG-003 · Resolved in 14 min',     time:'42 min ago', c:C.error},
    {e:'🔔',t:'New Support Ticket',      d:'#TKT-0221 · App crash report · High priority', time:'56 min ago', c:C.warning},
  ]
  return (
    <div style={{ maxWidth:720, margin:'0 auto', padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>Recent Activity</h2>
      <div style={{ position:'relative' as const, paddingLeft:26 }}>
        <div style={{ position:'absolute', left:10, top:6, bottom:6, width:2, background:`${C.primary}15`, borderRadius:99 }}/>
        {events.map((ev,i)=>(
          <div key={i} style={{ display:'flex', gap:14, marginBottom:14, position:'relative' as const }}>
            <div style={{ position:'absolute', left:-18, top:8, width:12, height:12, borderRadius:'50%', background:`${ev.c}15`, border:`2px solid ${ev.c}`, flexShrink:0 }}/>
            <Card style={{ flex:1, padding:14 }}>
              <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                <div style={{ width:36, height:36, borderRadius:10, background:`${ev.c}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, flexShrink:0 }}>{ev.e}</div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{ev.t}</p>
                  <p style={{ fontSize:11, color:C.sub }}>{ev.d}</p>
                </div>
                <p style={{ fontSize:10, color:C.muted, flexShrink:0 }}>{ev.time}</p>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Announcements ────────────────────────────────────────────────────────────
function Announcements({ onToast }:{ onToast:(m:string)=>void }) {
  const items = [
    {e:'🚀',t:'v2.4 Release — Availability Manager',  body:'New weekly schedule management UI for care agents rolled out. See release notes for full changelog.',               type:'release',    date:'Today'},
    {e:'🔧',t:'Scheduled Maintenance',                 body:'Payment gateway scheduled maintenance Sunday 26 Jan, 2:00–4:00 AM. Payout processing will be paused.',            type:'maintenance', date:'Jan 24'},
    {e:'📋',t:'Cancellation Policy Update',            body:'Updated cancellation policy effective Feb 1. Care agents now receive 50% payment for same-day cancellations.',     type:'policy',      date:'Jan 22'},
    {e:'📊',t:'Monthly Performance Report',            body:'January platform performance report now available. Revenue up 18%, bookings up 12%, NPS improved to 72.',          type:'report',      date:'Jan 21'},
  ]
  const tc: Record<string,string> = { release:C.primary, maintenance:C.warning, policy:C.info, report:C.success }
  return (
    <div style={{ maxWidth:720, margin:'0 auto', padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Announcements</h2>
        <Btn label="New Announcement" small onClick={()=>onToast('Opening composer…')} />
      </div>
      {items.map((a,i)=>(
        <Card key={i} hover style={{ padding:20, marginBottom:12, border:`1.5px solid ${tc[a.type]}20` }}>
          <div style={{ display:'flex', gap:14 }}>
            <div style={{ width:48, height:48, borderRadius:14, background:`${tc[a.type]}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>{a.e}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                <p style={{ fontSize:14, fontWeight:800, color:C.type }}>{a.t}</p>
                <Bdg label={a.type.charAt(0).toUpperCase()+a.type.slice(1)} color={tc[a.type]} />
              </div>
              <p style={{ fontSize:12, color:C.sub, lineHeight:1.7, marginBottom:6 }}>{a.body}</p>
              <p style={{ fontSize:10, color:C.muted }}>{a.date}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Calendar ─────────────────────────────────────────────────────────────────
function CalendarOverview() {
  const today = 22
  const days = [...Array(31)].map((_,i)=>i+1)
  const events: Record<number,{l:string;c:string}[]> = {
    22:[{l:'128 Bookings',c:C.primary},{l:'SOS Active',c:C.error}],
    24:[{l:'Maintenance',c:C.warning}],
    26:[{l:'Payout Run',c:C.success}],
    28:[{l:'Policy Live',c:C.info}],
    31:[{l:'Month End',c:C.accent}],
  }
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>Calendar Overview</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:16 }} className="adm-main-split">
        <Card style={{ padding:20 }}>
          <SectionTitle title="January 2025" />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4, marginBottom:8 }}>
            {['S','M','T','W','T','F','S'].map((d,i)=>(
              <p key={i} style={{ textAlign:'center' as const, fontSize:10, fontWeight:700, color:C.muted }}>{d}</p>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4 }}>
            {[...Array(2)].map((_,i)=><div key={`e${i}`}/>)}
            {days.map(d=>(
              <div key={d} style={{ aspectRatio:'1', borderRadius:8, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:d===today?C.primary:events[d]?`${Object.values(events[d]||[])[0]?.c}10`:'transparent', border:d===today?'none':undefined, cursor:'pointer', transition:'all 0.1s' }}>
                <p style={{ fontSize:11, fontWeight:d===today?900:400, color:d===today?'#fff':events[d]?C.type:C.muted }}>{d}</p>
                {events[d]&&d!==today&&<div style={{ width:5, height:5, borderRadius:'50%', background:events[d][0].c, marginTop:1 }}/>}
              </div>
            ))}
          </div>
        </Card>
        <Card style={{ padding:20 }}>
          <SectionTitle title="Upcoming Events" />
          {[{e:'📅',d:'Today Jan 22',t:'128 bookings · 2 emergencies',c:C.primary},{e:'🔧',d:'Sun Jan 26 2–4 AM',t:'Payment gateway maintenance',c:C.warning},{e:'💸',d:'Fri Jan 24 5 PM',t:'Payout run · LKR 1.82M',c:C.success},{e:'📋',d:'Sat Feb 1',t:'New cancellation policy live',c:C.info},{e:'📊',d:'Fri Jan 31',t:'Monthly report deadline',c:C.accent}].map((ev,i)=>(
            <div key={i} style={{ display:'flex', gap:10, padding:'9px 0', borderBottom:i<4?`1px solid ${C.border}`:'none' }}>
              <span style={{ fontSize:18 }}>{ev.e}</span>
              <div>
                <p style={{ fontSize:11, fontWeight:700, color:ev.c }}>{ev.d}</p>
                <p style={{ fontSize:11, color:C.sub }}>{ev.t}</p>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

// ─── Reports Snapshot ─────────────────────────────────────────────────────────
function ReportsSnapshot({ onToast }:{ onToast:(m:string)=>void }) {
  const rpts = [
    {e:'💰',l:'Revenue Report',   sub:'January 2025 · LKR 12.45M total revenue'},
    {e:'📅',l:'Booking Report',   sub:'3,648 bookings · 6.2% cancellation rate'},
    {e:'👤',l:'Agent Performance',sub:'684 verified agents · Avg rating 4.76★'},
    {e:'📈',l:'Client Growth',    sub:'2,856 total clients · +12.3% month-on-month'},
  ]
  return (
    <div style={{ maxWidth:720, margin:'0 auto', padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>Reports Snapshot</h2>
      {rpts.map((r,i)=>(
        <Card key={i} hover style={{ padding:20, marginBottom:12 }}>
          <div style={{ display:'flex', gap:14, alignItems:'center' }}>
            <div style={{ width:50, height:50, borderRadius:14, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>{r.e}</div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:14, fontWeight:700, color:C.type, marginBottom:3 }}>{r.l}</p>
              <p style={{ fontSize:11, color:C.muted }}>{r.sub}</p>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <Btn label="PDF" variant="secondary" small icon={I.download} onClick={()=>onToast('Generating PDF…')} />
              <Btn label="CSV" variant="ghost" small icon={I.download} onClick={()=>onToast('Exporting CSV…')} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Quick Actions ────────────────────────────────────────────────────────────
function QuickActions({ onNav, onToast }:{ onNav:(s:SubView)=>void; onToast:(m:string)=>void }) {
  const actions = [
    {e:'✅',l:'Approve Care Agents',  sub:'18 applications pending review',        c:C.warning, cb:()=>onToast('Opening agent approvals')},
    {e:'🚨',l:'View Emergencies',     sub:'2 active cases requiring attention',     c:C.error,   cb:()=>onNav('emergency')},
    {e:'👥',l:'Manage Users',         sub:'2,856 registered clients',              c:C.primary, cb:()=>onNav('userOverview')},
    {e:'📊',l:'View Reports',         sub:'Monthly performance reports',           c:C.info,    cb:()=>onNav('reports')},
    {e:'🎫',l:'Open Support',         sub:'11 tickets awaiting response',          c:C.muted,   cb:()=>onToast('Opening support tickets')},
    {e:'⚙️',l:'Platform Settings',    sub:'Configuration and system management',    c:C.sub,     cb:()=>onToast('Opening settings')},
  ]
  return (
    <div style={{ maxWidth:760, margin:'0 auto', padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>Quick Actions</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }} className="adm-3col">
        {actions.map((a,i)=>(
          <Card key={i} hover onClick={a.cb} style={{ padding:22 }}>
            <div style={{ width:52, height:52, borderRadius:16, background:`${a.c}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, marginBottom:12 }}>{a.e}</div>
            <p style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:4 }}>{a.l}</p>
            <p style={{ fontSize:11, color:C.muted, lineHeight:1.5 }}>{a.sub}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Status Badges ────────────────────────────────────────────────────────────
function StatusBadgesView() {
  const badges = [{l:'Healthy',c:C.success},{l:'Warning',c:C.warning},{l:'Critical',c:C.error},{l:'Online',c:C.success},{l:'Offline',c:C.muted},{l:'Emergency',c:C.error},{l:'Pending',c:C.warning},{l:'Verified',c:C.primary}]
  return (
    <div style={{ maxWidth:700, margin:'0 auto', padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>Status Badges</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }} className="adm-4col">
        {badges.map((b,i)=>(
          <Card key={i} style={{ padding:22, textAlign:'center' as const }}>
            <div style={{ width:10, height:10, borderRadius:'50%', background:b.c, margin:'0 auto 10px' }}/>
            <Bdg label={b.l} color={b.c} dot />
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
        {[{e:'🔔',t:'No Alerts',         d:'No active alerts at this time. The platform is operating normally.'},{e:'🚨',t:'No Emergencies',   d:'No emergency cases are currently active. All agents are operating safely.'},{e:'📭',t:'No Notifications', d:'You are all caught up. No new notifications at this time.'},{e:'📋',t:'No Activity',       d:'No recent platform activity to display.'}].map((s,i)=>(
          <Card key={i} style={{ padding:'38px 22px', textAlign:'center' as const }}>
            <p style={{ fontSize:48, marginBottom:14 }}>{s.e}</p>
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
        {['Loading Dashboard','Loading Analytics','Loading Map','Loading Reports'].map((l,i)=>(
          <Card key={i} style={{ padding:22 }}>
            <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:14 }}>{l}</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:10, marginBottom:14 }}>
              {[...Array(4)].map((_,j)=><div key={j} style={{ height:62, borderRadius:10, background:'#E4E8EA' }}/>)}
            </div>
            {[...Array(4)].map((_,j)=><div key={j} style={{marginBottom:8}}><Shimmer h={14} w={`${55+j*11}%`}/></div>)}
          </Card>
        ))}
      </div>
    </div>
  )
}

function ErrorStates({ onToast }:{ onToast:(m:string)=>void }) {
  return (
    <div style={{ maxWidth:600, margin:'0 auto', padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:16 }}>Error States</h2>
      {[{e:'📊',t:'Unable to Load Dashboard',d:'Failed to fetch platform data. Please check your connection and retry.',c:C.error},{e:'📈',t:'Analytics Error',d:'Analytics data temporarily unavailable. Our team has been notified.',c:C.warning},{e:'🗺️',t:'Map Error',d:'Live map data could not be loaded. GPS tracking paused.',c:C.error},{e:'🖥️',t:'Server Error',d:'An unexpected server error occurred. Reference: ERR-500.',c:C.error}].map((er,i)=>(
        <Card key={i} style={{ padding:20, marginBottom:12, border:`1.5px solid ${er.c}30`, background:`${er.c}04` }}>
          <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
            <div style={{ width:42, height:42, borderRadius:12, background:`${er.c}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{er.e}</div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:13, fontWeight:800, color:er.c, marginBottom:4 }}>{er.t}</p>
              <p style={{ fontSize:11, color:C.sub, lineHeight:1.6, marginBottom:10 }}>{er.d}</p>
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
    <div style={{ maxWidth:600, margin:'0 auto', padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:16 }}>Success States</h2>
      {[{e:'✅',t:'Dashboard Updated',     d:'All platform data refreshed. Last updated just now.',c:C.success},{e:'📄',t:'Report Generated',     d:'January 2025 revenue report is ready for download.',c:C.primary},{e:'📢',t:'Announcement Published',d:'v2.4 release notes have been published to all agents.',c:C.accent}].map((s,i)=>(
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
export default function AdminDashboard() {
  const [sub, setSub] = useState<SubView>('home')
  const [toast, setToast] = useState<string|null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const showToast = (m:string) => { setToast(m); setTimeout(()=>setToast(null),2800) }
  const groups = [...new Set(NAV.map(n=>n.group))]

  const renderMain = () => {
    switch(sub) {
      case 'home':            return <DashboardHome onNav={setSub} onToast={showToast} />
      case 'kpis':            return <PlatformKPIs />
      case 'liveMap':         return <LiveMap />
      case 'liveOps':         return <LiveOperations onToast={showToast} />
      case 'revenue':         return <RevenueOverview />
      case 'bookingAnalytics':return <BookingAnalytics />
      case 'userOverview':    return <UserOverview />
      case 'agentOverview':   return <AgentOverview onToast={showToast} />
      case 'platformHealth':  return <PlatformHealth />
      case 'emergency':       return <EmergencyCenter onToast={showToast} />
      case 'notifications':   return <NotificationCenter onToast={showToast} />
      case 'activity':        return <ActivityFeed />
      case 'announcements':   return <Announcements onToast={showToast} />
      case 'calendar':        return <CalendarOverview />
      case 'reports':         return <ReportsSnapshot onToast={showToast} />
      case 'quickActions':    return <QuickActions onNav={setSub} onToast={showToast} />
      case 'statusBadges':    return <StatusBadgesView />
      case 'empty':           return <EmptyStates />
      case 'loading':         return <LoadingStates />
      case 'error':           return <ErrorStates onToast={showToast} />
      case 'success':         return <SuccessStates />
      default: return null
    }
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:C.bg, fontFamily:'Manrope,sans-serif' }}>
      {/* Dark sidebar */}
      <div className="adm-sidebar" style={{ width:210, background:C.dark, display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh', overflowY:'auto', flexShrink:0 }}>
        {/* Logo */}
        <div style={{ padding:'16px 18px 14px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <div style={{ width:30, height:30, borderRadius:9, background:`linear-gradient(135deg,${C.primary},#005D63)`, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2C5 2 2 4.5 2 8s3 6 6 6 6-2.5 6-6-3-6-6-6z" fill="rgba(255,255,255,0.9)"/><path d="M8 5v3l2 2" stroke={C.primary} strokeWidth="1.4" strokeLinecap="round"/></svg>
            </div>
            <div>
              <p style={{ fontSize:13, fontWeight:900, color:'rgba(255,255,255,0.95)', fontFamily:'Manrope,sans-serif', lineHeight:1 }}>ReadyPal</p>
              <p style={{ fontSize:9, color:'rgba(255,255,255,0.4)', fontWeight:700, textTransform:'uppercase' as const, letterSpacing:'0.08em' }}>Admin Console</p>
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
                  {n.badge&&n.badge>0&&<div style={{ minWidth:18, height:18, borderRadius:99, background:n.k==='emergency'?C.error:C.warning, color:'#fff', fontSize:9, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 5px' }}>{n.badge}</div>}
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
              <p style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.9)' }}>Admin Console</p>
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

      {/* Right column: header + content */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        <AdminHeader sub={sub} onToast={showToast} onToggleSidebar={()=>setSidebarOpen(v=>!v)} />
        <div style={{ flex:1, overflowY:'auto' }} className="adm-main">
          {renderMain()}
        </div>
      </div>

      {toast&&<Toast msg={toast} />}
    </div>
  )
}
