import { useState, type ReactNode, type CSSProperties } from 'react'

// ─── Brand ────────────────────────────────────────────────────────────────────
const C = {
  primary:'#00737A', accent:'#EE8153', type:'#2C3E43', sub:'#6B7E85',
  muted:'#9AAAB0', border:'#E4E8EA', bg:'#F2F4F5', surface:'#FFFFFF',
  success:'#22C55E', warning:'#F59E0B', error:'#EF4444', info:'#3B82F6',
  dark:'#1A2A30',
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const I: Record<string,ReactNode> = {
  home:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 5.5l5.5-4.5 5.5 4.5V12H8.5V8.5h-4V12H1V5.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  users:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="4.5" cy="4" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M1 11c0-2 1.8-3.5 3.5-3.5S8 9 8 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="9.5" cy="4.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M12 11c0-1.66-1.12-3-2.5-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  search:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.3"/><path d="M8.5 8.5L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  filter:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 2h11l-4 5v4l-3-1V7L1 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  shield:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1L1.5 3v4c0 3 5 4.5 5 4.5s5-1.5 5-4.5V3L6.5 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M4 6.5l2 2 3.5-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  roles:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="1" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><rect x="7" y="1" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><rect x="1" y="7" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><rect x="7" y="7" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.2"/></svg>,
  lock:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="2" y="5.5" width="9" height="6.5" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M4 5.5V4a2.5 2.5 0 0 1 5 0v1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="6.5" cy="8.5" r="1" fill="currentColor"/></svg>,
  audit:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="2" y="1" width="9" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 4.5h4M4.5 7h4M4.5 9.5h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  verify:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5L2 3.5v4c0 2.8 4.5 5 4.5 5s4.5-2.2 4.5-5v-4L6.5 1.5z" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 6.5l1.5 2 3-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  imperson:<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 12c0-2.76 2.46-5 5.5-5s5.5 2.24 5.5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M10.5 7l1.5 1-1.5 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  doc:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M3 1h5l3 3v8H3V1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M8 1v3h3" stroke="currentColor" strokeWidth="1.1"/><path d="M5 6h3M5 8h3M5 10h2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  check:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 6.5l3 3.5 5-6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  edit:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M9.5 1.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  trash:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 3.5h9M5 3.5V2h3v1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M3.5 3.5l.5 7.5h5l.5-7.5" stroke="currentColor" strokeWidth="1.2"/></svg>,
  chevR:   <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M3.5 2l3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  refresh: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M11 6.5a4.5 4.5 0 1 1-1-2.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M11 3v2.5H8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  plus:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2v9M2 6.5h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  eye:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 6.5C1 6.5 3 3.5 6.5 3.5S12 6.5 12 6.5 10 9.5 6.5 9.5 1 6.5 1 6.5z" stroke="currentColor" strokeWidth="1.2"/><circle cx="6.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/></svg>,
  copy:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 9V2.5A1.5 1.5 0 0 1 2.5 1H9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  download:<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2v7M4 6.5L6.5 9 9 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M1.5 10.5h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  alert:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5L1 12h11L6.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M6.5 5.5v3M6.5 10v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  bell:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5c-2.5 0-4 1.8-4 4v2.5L1 9.5h11l-1.5-1.5V5.5c0-2.2-1.5-4-4-4z" stroke="currentColor" strokeWidth="1.2"/><path d="M5 9.5c0 .83.67 1.5 1.5 1.5S8 10.33 8 9.5" stroke="currentColor" strokeWidth="1.1"/></svg>,
  toggle:  <svg width="28" height="16" viewBox="0 0 28 16" fill="none"><rect width="28" height="16" rx="8" fill="currentColor" opacity="0.15"/><circle cx="20" cy="8" r="6" fill="currentColor"/></svg>,
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const USERS = [
  { id:'USR-0001', name:'Mohamed Ihsan',       role:'Client',              email:'m.ihsan@email.com',  phone:'+94 77 123 4567', status:'active',    verified:true,  risk:'low',  rating:null, login:'2 min ago',   created:'Jan 10, 2025' },
  { id:'USR-0002', name:'Kasun Perera',         role:'Care Agent',          email:'kasun.p@email.com',  phone:'+94 71 987 6543', status:'active',    verified:true,  risk:'low',  rating:4.9,  login:'8 min ago',   created:'Mar 5, 2024'  },
  { id:'USR-0003', name:'Nimal Perera',         role:'Client',              email:'nimal.p@email.com',  phone:'+94 76 234 5678', status:'pending',   verified:false, risk:'low',  rating:null, login:'1 day ago',   created:'Jan 20, 2025' },
  { id:'USR-0004', name:'Priya Fernando',       role:'Client',              email:'priya.f@email.com',  phone:'+94 77 345 6789', status:'suspended', verified:true,  risk:'high', rating:null, login:'3 days ago',  created:'Oct 15, 2024' },
  { id:'USR-0005', name:'Dilshan Ratnayake',    role:'Care Agent',          email:'dilshan.r@email.com',phone:'+94 70 456 7890', status:'pending',   verified:false, risk:'low',  rating:null, login:'Never',       created:'Jan 22, 2025' },
  { id:'USR-0006', name:'Chamari Wickrama',     role:'Client',              email:'chamari.w@email.com',phone:'+94 71 567 8901', status:'active',    verified:true,  risk:'low',  rating:null, login:'30 min ago',  created:'Nov 3, 2024'  },
  { id:'USR-0007', name:'Amara Silva',          role:'Support Executive',   email:'amara.s@email.com',  phone:'+94 77 678 9012', status:'active',    verified:true,  risk:'low',  rating:null, login:'1 hr ago',    created:'Feb 14, 2024' },
  { id:'USR-0008', name:'Ranjith Bandara',      role:'Verification Officer',email:'ranjith.b@email.com',phone:'+94 76 789 0123', status:'active',    verified:true,  risk:'low',  rating:null, login:'4 hrs ago',   created:'Jan 8, 2024'  },
  { id:'USR-0009', name:'Thilina Senanayake',   role:'Operations Manager',  email:'thilina.s@email.com',phone:'+94 71 890 1234', status:'active',    verified:true,  risk:'low',  rating:null, login:'Yesterday',   created:'Jul 1, 2023'  },
  { id:'USR-0010', name:'Nirosha Jayasena',     role:'Finance Manager',     email:'nirosha.j@email.com',phone:'+94 77 901 2345', status:'active',    verified:true,  risk:'low',  rating:null, login:'2 days ago',  created:'Jul 1, 2023'  },
]

const STATUS_COLOR: Record<string,string> = { active:C.success, pending:C.warning, suspended:C.error, locked:C.error, inactive:C.muted }
const RISK_COLOR: Record<string,string> = { low:C.success, medium:C.warning, high:C.error }

const ROLES = [
  { name:'Super Admin',          desc:'Full unrestricted platform access',   users:2,  perms:48, color:C.error  },
  { name:'Platform Admin',       desc:'Platform configuration and oversight', users:4,  perms:42, color:C.primary},
  { name:'Operations Manager',   desc:'Booking and live operations control',  users:8,  perms:28, color:C.info   },
  { name:'Finance Manager',      desc:'Revenue, payouts and billing access',  users:5,  perms:22, color:C.success},
  { name:'Support Manager',      desc:'Support ticket and escalation access', users:12, perms:18, color:C.accent },
  { name:'Verification Officer', desc:'Document and identity verification',   users:6,  perms:14, color:C.warning},
  { name:'Content Manager',      desc:'CMS and communications management',    users:4,  perms:12, color:C.muted  },
  { name:'Customer Support',     desc:'Front-line client support access',     users:18, perms:10, color:C.sub    },
  { name:'Care Agent',           desc:'Care delivery and scheduling access',  users:684,perms:8,  color:C.primary},
  { name:'Client',               desc:'Booking and profile access',           users:2856,perms:5, color:C.info   },
]

const MODULES = ['Dashboard','Bookings','Payments','Clients','Care Agents','Reports','CMS','Support','Analytics','Settings']
const PERMS   = ['View','Create','Edit','Delete','Approve','Export','Assign','Bulk']

// ─── Primitives ───────────────────────────────────────────────────────────────
function Card({ children, style={}, hover=false, onClick }:{ children:ReactNode; style?:CSSProperties; hover?:boolean; onClick?:()=>void }) {
  const [h,setH] = useState(false)
  return (
    <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ background:C.surface, borderRadius:14, border:`1px solid ${h&&hover?C.primary+'40':C.border}`, boxShadow:h&&hover?'0 8px 24px rgba(44,62,67,0.10)':'0 1px 4px rgba(44,62,67,0.06)', transition:'all 0.18s', cursor:onClick?'pointer':undefined, ...style }}>
      {children}
    </div>
  )
}

function Btn({ label, icon, onClick, variant='primary', small=false, full=false, disabled=false }:{
  label:string; icon?:ReactNode; onClick?:()=>void
  variant?:'primary'|'secondary'|'ghost'|'danger'|'warning'|'success'
  small?:boolean; full?:boolean; disabled?:boolean
}) {
  const [h,setH] = useState(false)
  const vs: Record<string,CSSProperties> = {
    primary: { background:disabled?'#C8D0D4':h?'#005D63':C.primary, color:'#fff', border:'none', boxShadow:disabled?'none':h?`0 4px 16px ${C.primary}50`:`0 2px 8px ${C.primary}30` },
    secondary:{ background:h?'#EEF5F5':'#fff', color:C.primary, border:`1.5px solid ${h?C.primary:C.border}` },
    ghost:   { background:h?C.bg:'transparent', color:C.sub, border:'none' },
    danger:  { background:h?'#DC2626':C.error, color:'#fff', border:'none' },
    warning: { background:h?'#D97706':C.warning, color:'#fff', border:'none' },
    success: { background:h?'#16A34A':C.success, color:'#fff', border:'none' },
  }
  return (
    <button onClick={disabled?undefined:onClick} disabled={disabled}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:small?'6px 13px':'10px 18px', borderRadius:9, cursor:disabled?'not-allowed':'pointer', fontFamily:'Manrope,sans-serif', fontSize:small?11:13, fontWeight:700, transition:'all 0.15s', width:full?'100%':undefined, ...vs[variant] }}>
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

// ─── User Avatar ──────────────────────────────────────────────────────────────
function UA({ name, size=36, color=C.primary }:{ name:string; size?:number; color?:string }) {
  const initials = name.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase()
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', color, fontFamily:'Manrope,sans-serif', fontWeight:900, fontSize:size*0.3, flexShrink:0 }}>
      {initials}
    </div>
  )
}

// ─── Sub-view type ────────────────────────────────────────────────────────────
type SubView = 'home'|'search'|'filters'|'directory'|'userProfile'|'clients'|'agentMgmt'|'adminMgmt'|'roles'|'permissions'|'roleEditor'|'accountActions'|'bulkActions'|'impersonation'|'activityLog'|'auditLog'|'security'|'verification'|'docViewer'|'notifications'|'statusBadges'|'empty'|'loading'|'error'|'success'

const NAV: { k:SubView; l:string; icon:ReactNode; group:string; badge?:number }[] = [
  { k:'home',          l:'Overview',             icon:I.home,     group:'Management' },
  { k:'directory',     l:'User Directory',       icon:I.users,    group:'Management' },
  { k:'search',        l:'Global Search',        icon:I.search,   group:'Management' },
  { k:'userProfile',   l:'User Profile',         icon:I.eye,      group:'Management' },
  { k:'clients',       l:'Clients',              icon:I.users,    group:'User Types' },
  { k:'agentMgmt',     l:'Care Agents',          icon:I.verify,   group:'User Types' },
  { k:'adminMgmt',     l:'Admins & Staff',       icon:I.shield,   group:'User Types' },
  { k:'roles',         l:'Roles',                icon:I.roles,    group:'Roles & Permissions' },
  { k:'permissions',   l:'Permission Matrix',    icon:I.lock,     group:'Roles & Permissions' },
  { k:'roleEditor',    l:'Role Editor',          icon:I.edit,     group:'Roles & Permissions' },
  { k:'accountActions',l:'Account Actions',      icon:I.toggle,   group:'Administration' },
  { k:'bulkActions',   l:'Bulk Actions',         icon:I.check,    group:'Administration' },
  { k:'impersonation', l:'User Impersonation',   icon:I.imperson, group:'Administration' },
  { k:'activityLog',   l:'Activity Log',         icon:I.audit,    group:'Logs' },
  { k:'auditLog',      l:'Audit Log',            icon:I.audit,    group:'Logs' },
  { k:'security',      l:'Security Center',      icon:I.lock,     group:'Logs' },
  { k:'verification',  l:'Verification Center',  icon:I.verify,   group:'Logs', badge:18 },
  { k:'docViewer',     l:'Document Viewer',      icon:I.doc,      group:'Logs' },
  { k:'notifications', l:'Notifications',        icon:I.bell,     group:'Dev' },
  { k:'statusBadges',  l:'Status Badges',        icon:I.check,    group:'Dev' },
  { k:'empty',         l:'Empty States',         icon:I.alert,    group:'Dev' },
  { k:'loading',       l:'Loading States',       icon:I.refresh,  group:'Dev' },
  { k:'error',         l:'Error States',         icon:I.alert,    group:'Dev' },
  { k:'success',       l:'Success States',       icon:I.check,    group:'Dev' },
]

// ─── Management Home ──────────────────────────────────────────────────────────
function MgmtHome({ onNav, onToast }:{ onNav:(s:SubView)=>void; onToast:(m:string)=>void }) {
  const stats = [
    {l:'Total Users', v:'3,584', c:C.primary, e:'👥', sub:'+42 this week'},
    {l:'New This Week',v:'42',   c:C.info,    e:'🆕', sub:'Since Monday'},
    {l:'Pending Approval',v:'18',c:C.warning, e:'⏳', sub:'Requires review'},
    {l:'Suspended',   v:'7',     c:C.error,   e:'🚫', sub:'Access blocked'},
    {l:'Inactive 30d',v:'124',   c:C.muted,   e:'💤', sub:'No recent login'},
    {l:'Verified',    v:'3,251', c:C.success, e:'✅', sub:'91% of total'},
  ]
  const roleDistrib = [
    {l:'Clients',     v:2856, pct:80, c:C.primary},
    {l:'Care Agents', v:684,  pct:19, c:C.success},
    {l:'Staff',       v:44,   pct:1,  c:C.accent},
  ]
  const recent = [
    {e:'👤',t:'Nimal Perera registered',       d:'New client · Awaiting verification', time:'2 min ago', c:C.info},
    {e:'✅',t:'Dilshan Ratnayake approved',     d:'Care agent · Documents verified',    time:'8 min ago', c:C.success},
    {e:'🚫',t:'Priya Fernando suspended',       d:'High-risk flag · Admin action',      time:'15 min ago',c:C.error},
    {e:'🔑',t:'Thilina Senanayake role updated',d:'Operations Manager → Platform Admin',time:'1 hr ago',  c:C.primary},
    {e:'🔒',t:'Account auto-locked',            d:'5 failed logins · IP: 192.168.x.x',  time:'2 hrs ago', c:C.warning},
  ]
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:18 }} className="um-3col">
        {stats.map((s,i)=>(
          <Card key={i} hover style={{ padding:18, border:s.c===C.error?`1.5px solid ${C.error}25`:undefined, background:s.c===C.error?`${C.error}03`:C.surface }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
              <p style={{ fontSize:11, color:C.muted }}>{s.l}</p>
              <span style={{ fontSize:20 }}>{s.e}</span>
            </div>
            <p style={{ fontSize:28, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{s.v}</p>
            <p style={{ fontSize:10, color:C.muted }}>{s.sub}</p>
          </Card>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:16, marginBottom:16 }} className="um-main-split">
        {/* Recent activity */}
        <Card style={{ padding:20 }}>
          <SectionTitle title="Recent Activity" action="Full Log" onAction={()=>onNav('activityLog')} />
          {recent.map((r,i)=>(
            <div key={i} style={{ display:'flex', gap:12, padding:'9px 0', borderBottom:i<recent.length-1?`1px solid ${C.border}`:'none' }}>
              <div style={{ width:34, height:34, borderRadius:10, background:`${r.c}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{r.e}</div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{r.t}</p>
                <p style={{ fontSize:10, color:C.muted }}>{r.d}</p>
              </div>
              <p style={{ fontSize:9, color:C.muted, flexShrink:0, marginTop:2 }}>{r.time}</p>
            </div>
          ))}
        </Card>
        {/* Right */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <Card style={{ padding:20 }}>
            <SectionTitle title="Role Distribution" />
            {roleDistrib.map((r,i)=>(
              <div key={i} style={{ marginBottom:10 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                  <p style={{ fontSize:11, color:C.sub }}>{r.l}</p>
                  <p style={{ fontSize:11, fontWeight:700, color:r.c }}>{r.v.toLocaleString()}</p>
                </div>
                <div style={{ height:6, borderRadius:99, background:`${r.c}12` }}>
                  <div style={{ width:`${r.pct}%`, height:'100%', background:r.c, borderRadius:99 }} />
                </div>
              </div>
            ))}
          </Card>
          {/* Quick actions */}
          <Card style={{ padding:20 }}>
            <SectionTitle title="Quick Actions" />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {[{e:'➕',l:'Add User',       cb:()=>onToast('Add user form')},{e:'✅',l:'Approve Agents', cb:()=>onNav('verification')},{e:'🔑',l:'Manage Roles',   cb:()=>onNav('roles')},{e:'📋',l:'Audit Log',      cb:()=>onNav('auditLog')},{e:'🔒',l:'Security',       cb:()=>onNav('security')},{e:'📊',l:'Export All',    cb:()=>onToast('Exporting CSV…')}].map((a,i)=>(
                <button key={i} onClick={a.cb}
                  style={{ padding:'12px 4px', borderRadius:10, border:`1px solid ${C.border}`, background:'#FAFAFA', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:4, fontFamily:'Manrope,sans-serif', fontSize:10, fontWeight:700, color:C.sub, transition:'all 0.12s' }}
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

// ─── Global Search ────────────────────────────────────────────────────────────
function GlobalSearch({ onNav, onToast }:{ onNav:(s:SubView)=>void; onToast:(m:string)=>void }) {
  const [q, setQ] = useState('')
  const results = q.length > 1 ? USERS.filter(u => u.name.toLowerCase().includes(q.toLowerCase()) || u.email.includes(q.toLowerCase()) || u.id.includes(q)) : []
  return (
    <div style={{ maxWidth:740, margin:'0 auto', padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:20 }}>Global Search</h2>
      <Card style={{ padding:20, marginBottom:16 }}>
        <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:16 }}>
          <span style={{ display:'flex', color:C.muted, flexShrink:0 }}>{I.search}</span>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name, email, NIC, phone, user ID, booking ID…"
            style={{ flex:1, border:'none', background:'transparent', fontFamily:'Manrope,sans-serif', fontSize:15, color:C.type, outline:'none' }} autoFocus />
          {q&&<button onClick={()=>setQ('')} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, fontFamily:'Manrope,sans-serif', fontSize:12 }}>Clear</button>}
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' as const }}>
          {['Name','Email','NIC','Phone','User ID','Booking ID','Agent ID','Client ID'].map((f,i)=>(
            <button key={i} style={{ padding:'4px 12px', borderRadius:99, border:`1px solid ${C.border}`, background:'#FAFAFA', cursor:'pointer', fontSize:10, fontWeight:700, color:C.muted, fontFamily:'Manrope,sans-serif' }}>
              {f}
            </button>
          ))}
        </div>
      </Card>
      {q.length>1&&(
        <div>
          <p style={{ fontSize:11, color:C.muted, marginBottom:12, fontWeight:700 }}>{results.length} result{results.length!==1?'s':''} for "{q}"</p>
          {results.length===0?(
            <Card style={{ padding:'40px', textAlign:'center' as const }}>
              <p style={{ fontSize:28, marginBottom:10 }}>🔍</p>
              <p style={{ fontSize:14, fontWeight:700, color:C.type, marginBottom:6 }}>No results found</p>
              <p style={{ fontSize:12, color:C.muted }}>Try a different name, email, or ID</p>
            </Card>
          ):(
            results.map(u=>(
              <Card key={u.id} hover style={{ padding:16, marginBottom:8 }} onClick={()=>{ onNav('userProfile'); onToast(`Viewing ${u.name}`) }}>
                <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                  <UA name={u.name} size={42} color={C.primary} />
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:2 }}>
                      <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{u.name}</p>
                      <Bdg label={u.role} color={C.primary} />
                      <Bdg label={u.status.charAt(0).toUpperCase()+u.status.slice(1)} color={STATUS_COLOR[u.status]} dot />
                    </div>
                    <p style={{ fontSize:11, color:C.muted }}>{u.id} · {u.email} · {u.phone}</p>
                  </div>
                  <span style={{ display:'flex', color:C.primary }}>{I.chevR}</span>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
      {q.length<=1&&(
        <Card style={{ padding:'40px', textAlign:'center' as const }}>
          <p style={{ fontSize:36, marginBottom:12 }}>🔍</p>
          <p style={{ fontSize:14, fontWeight:700, color:C.type, marginBottom:6 }}>Search all platform users</p>
          <p style={{ fontSize:12, color:C.muted }}>Type a name, email, phone number, or any identifier to find any account instantly</p>
        </Card>
      )}
    </div>
  )
}

// ─── User Directory ───────────────────────────────────────────────────────────
function UserDirectory({ onNav, onToast }:{ onNav:(s:SubView)=>void; onToast:(m:string)=>void }) {
  const [selected, setSelected] = useState<string[]>([])
  const [q, setQ] = useState('')
  const [statusF, setStatusF] = useState('all')
  const filtered = USERS.filter(u =>
    (statusF==='all'||u.status===statusF) &&
    (u.name.toLowerCase().includes(q.toLowerCase())||u.role.toLowerCase().includes(q.toLowerCase()))
  )
  const toggle = (id:string) => setSelected(s => s.includes(id)?s.filter(x=>x!==id):[...s,id])
  const allSel = filtered.length>0 && filtered.every(u=>selected.includes(u.id))

  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>User Directory</h2>
        <div style={{ display:'flex', gap:8 }}>
          {selected.length>0&&<Btn label={`Bulk Actions (${selected.length})`} variant="warning" small onClick={()=>onNav('bulkActions')} />}
          <Btn label="Add User" small icon={I.plus} onClick={()=>onToast('Opening add user form…')} />
          <Btn label="Export" variant="secondary" small icon={I.download} onClick={()=>onToast('Exporting CSV…')} />
        </div>
      </div>
      {/* Toolbar */}
      <Card style={{ padding:16, marginBottom:14 }}>
        <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' as const }}>
          <div style={{ display:'flex', gap:8, alignItems:'center', flex:1, minWidth:180, padding:'8px 12px', borderRadius:9, border:`1px solid ${C.border}`, background:'#FAFAFA' }}>
            <span style={{ display:'flex', color:C.muted }}>{I.search}</span>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search users…" style={{ border:'none', background:'transparent', fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, outline:'none', flex:1 }} />
          </div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' as const }}>
            {['all','active','pending','suspended'].map(f=>(
              <button key={f} onClick={()=>setStatusF(f)}
                style={{ padding:'6px 13px', borderRadius:99, border:`1.5px solid ${statusF===f?C.primary:C.border}`, background:statusF===f?`${C.primary}08`:'#FAFAFA', cursor:'pointer', fontSize:11, fontWeight:700, color:statusF===f?C.primary:C.muted, fontFamily:'Manrope,sans-serif' }}>
                {f.charAt(0).toUpperCase()+f.slice(1)}
              </button>
            ))}
          </div>
          <p style={{ fontSize:11, color:C.muted, whiteSpace:'nowrap' as const }}>{filtered.length} users</p>
        </div>
      </Card>
      {/* Table */}
      <Card style={{ overflow:'hidden' }}>
        {/* Header */}
        <div style={{ display:'grid', gridTemplateColumns:'40px 2fr 1fr 1.5fr 1fr 1fr 1fr 120px', gap:0, padding:'10px 16px', background:'#FAFAFA', borderBottom:`1px solid ${C.border}` }} className="um-table-row">
          <input type="checkbox" checked={allSel} onChange={()=>allSel?setSelected([]):setSelected(filtered.map(u=>u.id))} style={{ margin:'0 auto', cursor:'pointer', accentColor:C.primary }} />
          {['User','Role','Email','Status','Verification','Last Login','Actions'].map((h,i)=>(
            <p key={i} style={{ fontSize:10, fontWeight:800, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.07em', paddingInline:8 }}>{h}</p>
          ))}
        </div>
        {filtered.map((u,i)=>(
          <div key={u.id} style={{ display:'grid', gridTemplateColumns:'40px 2fr 1fr 1.5fr 1fr 1fr 1fr 120px', gap:0, padding:'12px 16px', borderBottom:i<filtered.length-1?`1px solid ${C.border}`:'none', background:selected.includes(u.id)?`${C.primary}04`:undefined, transition:'background 0.12s' }} className="um-table-row">
            <input type="checkbox" checked={selected.includes(u.id)} onChange={()=>toggle(u.id)} style={{ margin:'0 auto', cursor:'pointer', accentColor:C.primary }} />
            {/* User */}
            <div style={{ display:'flex', gap:10, alignItems:'center', paddingInline:8 }}>
              <UA name={u.name} size={32} color={u.role==='Care Agent'?C.success:u.role.includes('Manager')||u.role.includes('Officer')||u.role.includes('Admin')||u.role.includes('Executive')?C.accent:C.primary} />
              <div>
                <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{u.name}</p>
                <p style={{ fontSize:10, color:C.muted }}>{u.id}</p>
              </div>
            </div>
            <div style={{ paddingInline:8, display:'flex', alignItems:'center' }}>
              <Bdg label={u.role} color={u.role==='Care Agent'?C.success:u.role.includes('Manager')||u.role.includes('Officer')||u.role.includes('Admin')||u.role.includes('Executive')?C.accent:C.info} />
            </div>
            <p style={{ fontSize:11, color:C.sub, paddingInline:8, display:'flex', alignItems:'center', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as const }}>{u.email}</p>
            <div style={{ paddingInline:8, display:'flex', alignItems:'center' }}>
              <Bdg label={u.status.charAt(0).toUpperCase()+u.status.slice(1)} color={STATUS_COLOR[u.status]} dot />
            </div>
            <div style={{ paddingInline:8, display:'flex', alignItems:'center' }}>
              {u.verified?<Bdg label="Verified" color={C.success} />:<Bdg label="Pending" color={C.warning} />}
            </div>
            <p style={{ fontSize:11, color:C.muted, paddingInline:8, display:'flex', alignItems:'center' }}>{u.login}</p>
            {/* Actions */}
            <div style={{ paddingInline:8, display:'flex', gap:4, alignItems:'center' }}>
              <button onClick={()=>{ onNav('userProfile'); onToast(`Viewing ${u.name}`) }} style={{ background:'none', border:'none', cursor:'pointer', color:C.primary, display:'flex', padding:4 }}><span style={{display:'flex'}}>{I.eye}</span></button>
              <button onClick={()=>onToast(`Editing ${u.name}`)} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, display:'flex', padding:4 }}><span style={{display:'flex'}}>{I.edit}</span></button>
              <button onClick={()=>onToast(`Suspending ${u.name}…`)} style={{ background:'none', border:'none', cursor:'pointer', color:u.status==='suspended'?C.success:C.error, display:'flex', padding:4 }}><span style={{display:'flex'}}>{I.lock}</span></button>
            </div>
          </div>
        ))}
      </Card>
      {/* Pagination stub */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:14 }}>
        <p style={{ fontSize:11, color:C.muted }}>Showing {filtered.length} of {USERS.length} users</p>
        <div style={{ display:'flex', gap:4 }}>
          {[1,2,3,'...',48].map((p,i)=>(
            <button key={i} style={{ width:28, height:28, borderRadius:7, border:`1px solid ${i===0?C.primary:C.border}`, background:i===0?C.primary:'#FAFAFA', color:i===0?'#fff':C.sub, cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:11, fontWeight:700 }}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── User Profile ─────────────────────────────────────────────────────────────
function UserProfile({ onToast }:{ onToast:(m:string)=>void }) {
  const u = USERS[0]
  return (
    <div style={{ maxWidth:800, margin:'0 auto', padding:'20px 24px 60px' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="um-2col">
        {/* Left */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <Card style={{ padding:22 }}>
            <div style={{ display:'flex', gap:14, alignItems:'flex-start', marginBottom:16 }}>
              <UA name={u.name} size={60} color={C.primary} />
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:4, flexWrap:'wrap' as const }}>
                  <h3 style={{ fontSize:17, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>{u.name}</h3>
                  <Bdg label={u.status.charAt(0).toUpperCase()+u.status.slice(1)} color={STATUS_COLOR[u.status]} dot />
                  {u.verified&&<Bdg label="Verified" color={C.success} />}
                </div>
                <Bdg label={u.role} color={C.primary} />
                <p style={{ fontSize:10, color:C.muted, marginTop:5 }}>{u.id} · Joined {u.created}</p>
              </div>
              <Btn label="Edit" small icon={I.edit} onClick={()=>onToast('Opening edit…')} />
            </div>
            {[{l:'Email',    v:u.email},{l:'Phone',    v:u.phone},{l:'Last Login', v:u.login},{l:'Risk Level', v:u.risk.toUpperCase()}].map((r,i)=>(
              <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:i<3?`1px solid ${C.border}`:'none' }}>
                <p style={{ fontSize:11, color:C.muted }}>{r.l}</p>
                <p style={{ fontSize:11, fontWeight:600, color:r.l==='Risk Level'?RISK_COLOR[u.risk]:C.type }}>{r.v}</p>
              </div>
            ))}
          </Card>
          <Card style={{ padding:22 }}>
            <SectionTitle title="Activity Summary" />
            {[{l:'Total Bookings', v:'12'},{l:'Completed',v:'10'},{l:'Cancelled',v:'2'},{l:'Total Spent',v:'LKR 68,500'}].map((s,i)=>(
              <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:i<3?`1px solid ${C.border}`:'none' }}>
                <p style={{ fontSize:11, color:C.muted }}>{s.l}</p>
                <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{s.v}</p>
              </div>
            ))}
          </Card>
        </div>
        {/* Right */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <Card style={{ padding:22 }}>
            <SectionTitle title="Account Actions" />
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {[{l:'Reset Password',  v:'secondary'},{l:'Force Logout',    v:'warning'},{l:'Enable MFA',      v:'secondary'},{l:'Suspend Account', v:'danger'}].map((a,i)=>(
                <Btn key={i} label={a.l} variant={a.v as 'secondary'|'warning'|'danger'} small full onClick={()=>onToast(`${a.l}…`)} />
              ))}
            </div>
          </Card>
          <Card style={{ padding:22 }}>
            <SectionTitle title="Recent Timeline" />
            {[{e:'🔑',t:'Logged in',d:'Chrome · Colombo',time:'2 min ago'},{e:'💳',t:'Payment processed',d:'LKR 6,000 · Hospital visit',time:'Yesterday'},{e:'📅',t:'Booking completed',d:'Kasun Perera · Jan 20',time:'3 days ago'}].map((ev,i)=>(
              <div key={i} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom:i<2?`1px solid ${C.border}`:'none' }}>
                <span style={{ fontSize:16 }}>{ev.e}</span>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:11, fontWeight:700, color:C.type }}>{ev.t}</p>
                  <p style={{ fontSize:10, color:C.muted }}>{ev.d}</p>
                </div>
                <p style={{ fontSize:9, color:C.muted }}>{ev.time}</p>
              </div>
            ))}
          </Card>
          <Card style={{ padding:22 }}>
            <SectionTitle title="Admin Notes" action="Add Note" onAction={()=>onToast('Add note')} />
            <div style={{ padding:'10px 12px', borderRadius:10, background:`${C.warning}06`, border:`1px solid ${C.warning}20`, fontSize:12, color:C.sub, lineHeight:1.6 }}>
              No active risk flags. Account in good standing. Verified Jan 10, 2025 by Ranjith Bandara.
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ─── Role Management ──────────────────────────────────────────────────────────
function RoleManagement({ onNav, onToast }:{ onNav:(s:SubView)=>void; onToast:(m:string)=>void }) {
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Role Management</h2>
        <div style={{ display:'flex', gap:8 }}>
          <Btn label="Permission Matrix" variant="secondary" small onClick={()=>onNav('permissions')} />
          <Btn label="New Role" small icon={I.plus} onClick={()=>onToast('Opening role creator…')} />
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }} className="um-3col">
        {ROLES.map((r,i)=>(
          <Card key={i} hover style={{ padding:20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
              <div style={{ width:44, height:44, borderRadius:14, background:`${r.color}12`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ fontSize:20 }}>{['👑','🛡️','⚙️','💰','🎫','🔍','📝','📣','💬','👤','👥','👁️'][i]||'👤'}</span>
              </div>
              <div style={{ display:'flex', gap:4 }}>
                <button onClick={()=>{ onNav('roleEditor'); onToast(`Editing ${r.name}`) }} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, display:'flex' }}><span style={{display:'flex'}}>{I.edit}</span></button>
              </div>
            </div>
            <p style={{ fontSize:13, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:3 }}>{r.name}</p>
            <p style={{ fontSize:11, color:C.muted, lineHeight:1.5, marginBottom:10 }}>{r.desc}</p>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <Bdg label={`${r.users.toLocaleString()} users`} color={r.color} />
              <Bdg label={`${r.perms} perms`} color={C.muted} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Permission Matrix ────────────────────────────────────────────────────────
function PermissionMatrix({ onToast }:{ onToast:(m:string)=>void }) {
  const selectedRole = 'Operations Manager'
  // Simple on/off matrix — first 4 roles, 6 modules
  const initMatrix: Record<string,Record<string,Record<string,boolean>>> = {}
  const displayRoles = ['Super Admin','Platform Admin','Operations Manager','Support Manager']
  const displayModules = MODULES.slice(0,6)
  const displayPerms = PERMS.slice(0,6)
  displayRoles.forEach(role=>{
    initMatrix[role]={}
    displayModules.forEach(mod=>{
      initMatrix[role][mod]={}
      displayPerms.forEach((perm,pi)=>{
        initMatrix[role][mod][perm] = role==='Super Admin' || (role==='Platform Admin'&&pi<5) || (role==='Operations Manager'&&pi<3&&(mod==='Dashboard'||mod==='Bookings'||mod==='Clients'||mod==='Care Agents')) || (role==='Support Manager'&&pi<2&&(mod==='Support'||mod==='Clients'))
      })
    })
  })
  const [matrix, setMatrix] = useState(initMatrix)
  const toggle = (role:string,mod:string,perm:string) => {
    if(role==='Super Admin') { onToast('Super Admin permissions cannot be changed'); return }
    setMatrix(m=>({...m,[role]:{...m[role],[mod]:{...m[role][mod],[perm]:!m[role][mod][perm]}}}))
    onToast('Permission updated')
  }
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Permission Matrix</h2>
        <Btn label="Save Changes" onClick={()=>onToast('Permissions saved!')} />
      </div>
      <Card style={{ overflow:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' as const, minWidth:700 }}>
          <thead>
            <tr style={{ background:'#FAFAFA' }}>
              <th style={{ padding:'12px 16px', textAlign:'left' as const, fontSize:11, fontWeight:800, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.06em', width:160, borderBottom:`1px solid ${C.border}` }}>Module / Role</th>
              {displayRoles.map(r=>(
                <th key={r} style={{ padding:'12px 16px', textAlign:'center' as const, fontSize:11, fontWeight:800, color:C.type, borderBottom:`1px solid ${C.border}`, minWidth:130 }}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                    <Bdg label={r.split(' ')[0]} color={r==='Super Admin'?C.error:r==='Platform Admin'?C.primary:r==='Operations Manager'?C.info:C.accent} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayModules.map((mod,mi)=>(
              displayPerms.map((perm,pi)=>(
                <tr key={`${mod}-${perm}`} style={{ borderBottom:`1px solid ${C.border}`, background:pi===0?'#FAFAFA':C.surface }}>
                  <td style={{ padding:'8px 16px' }}>
                    {pi===0&&<p style={{ fontSize:11, fontWeight:800, color:C.type }}>{mod}</p>}
                    <p style={{ fontSize:10, color:C.muted, paddingLeft:pi===0?0:4 }}>{perm}</p>
                  </td>
                  {displayRoles.map(role=>(
                    <td key={role} style={{ padding:'8px 16px', textAlign:'center' as const }}>
                      <button onClick={()=>toggle(role,mod,perm)}
                        style={{ width:24, height:24, borderRadius:6, border:`2px solid ${matrix[role]?.[mod]?.[perm]?C.success:C.border}`, background:matrix[role]?.[mod]?.[perm]?`${C.success}15`:'transparent', cursor:role==='Super Admin'?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto', transition:'all 0.12s' }}>
                        {matrix[role]?.[mod]?.[perm]&&<span style={{ display:'flex', color:C.success, transform:'scale(0.7)' }}>{I.check}</span>}
                      </button>
                    </td>
                  ))}
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

// ─── Role Editor ──────────────────────────────────────────────────────────────
function RoleEditor({ onToast }:{ onToast:(m:string)=>void }) {
  const [name, setName] = useState('Operations Manager')
  const [desc, setDesc] = useState('Booking and live operations control')
  const [toggles, setToggles] = useState<Record<string,boolean>>({
    'View Bookings':true,'Manage Bookings':true,'View Clients':true,'Manage Clients':false,
    'View Reports':true,'Export Reports':false,'Manage Staff':false,'Access Finance':false,
    'Emergency Override':false,'Platform Settings':false,
  })
  return (
    <div style={{ maxWidth:680, margin:'0 auto', padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Role Editor</h2>
        <div style={{ display:'flex', gap:8 }}>
          <Btn label="Clone Role" variant="secondary" small icon={I.copy} onClick={()=>onToast('Role cloned!')} />
          <Btn label="Delete Role" variant="danger" small icon={I.trash} onClick={()=>onToast('Are you sure?')} />
          <Btn label="Save Changes" small icon={I.check} onClick={()=>onToast('Role saved!')} />
        </div>
      </div>
      <Card style={{ padding:22, marginBottom:14 }}>
        <SectionTitle title="Role Details" />
        <div style={{ marginBottom:14 }}>
          <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:6 }}>Role Name</p>
          <input value={name} onChange={e=>setName(e.target.value)} style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:14, fontWeight:700, color:C.type, background:'#FAFAFA', outline:'none', boxSizing:'border-box' as const }} />
        </div>
        <div>
          <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:6 }}>Description</p>
          <textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={2} style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, background:'#FAFAFA', outline:'none', resize:'none', boxSizing:'border-box' as const }} />
        </div>
      </Card>
      <Card style={{ padding:22 }}>
        <SectionTitle title="Feature Toggles" />
        <p style={{ fontSize:11, color:C.muted, marginBottom:14 }}>Toggle individual permissions for this role. Changes take effect immediately after saving.</p>
        {Object.entries(toggles).map(([k,v],i)=>(
          <div key={k} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:i<Object.keys(toggles).length-1?`1px solid ${C.border}`:'none' }}>
            <div>
              <p style={{ fontSize:12, fontWeight:600, color:C.type }}>{k}</p>
            </div>
            <button onClick={()=>{ setToggles(t=>({...t,[k]:!t[k]})); onToast(`${k} ${!v?'enabled':'disabled'}`) }}
              style={{ width:46, height:25, borderRadius:99, background:v?C.primary:'#D0D9DD', border:'none', cursor:'pointer', position:'relative' as const, transition:'all 0.18s' }}>
              <div style={{ position:'absolute', top:2.5, left:v?24:2.5, width:20, height:20, borderRadius:'50%', background:'white', transition:'left 0.18s' }}/>
            </button>
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── Account Actions ──────────────────────────────────────────────────────────
function AccountActions({ onToast }:{ onToast:(m:string)=>void }) {
  const actions = [
    {e:'✅',l:'Activate',          c:C.success, confirm:false},{e:'🚫',l:'Deactivate',        c:C.muted,   confirm:true},
    {e:'🔒',l:'Suspend',           c:C.error,   confirm:true}, {e:'🔓',l:'Unsuspend',          c:C.success, confirm:false},
    {e:'🔑',l:'Reset Password',    c:C.primary, confirm:false},{e:'🚪',l:'Force Logout',       c:C.warning, confirm:true},
    {e:'⚠️',l:'Require PW Reset',  c:C.warning, confirm:false},{e:'📱',l:'Enable MFA',         c:C.success, confirm:false},
    {e:'🚫',l:'Disable MFA',       c:C.error,   confirm:true}, {e:'🔐',l:'Lock Account',       c:C.error,   confirm:true},
    {e:'🔓',l:'Unlock Account',    c:C.success, confirm:false},{e:'👤',l:'Impersonate User',   c:C.info,    confirm:true},
  ]
  return (
    <div style={{ maxWidth:760, margin:'0 auto', padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:8 }}>Account Actions</h2>
      <p style={{ fontSize:12, color:C.muted, marginBottom:20 }}>All account actions are logged in the Audit Log with timestamp, admin identity, and IP address.</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }} className="um-4col">
        {actions.map((a,i)=>(
          <Card key={i} hover onClick={()=>onToast(`${a.l}…`)} style={{ padding:20, textAlign:'center' as const, border:`1.5px solid ${a.c}15` }}>
            <p style={{ fontSize:30, marginBottom:8 }}>{a.e}</p>
            <p style={{ fontSize:12, fontWeight:800, color:a.c, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>{a.l}</p>
            {a.confirm&&<p style={{ fontSize:9, color:C.muted }}>Requires confirmation</p>}
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Bulk Actions ─────────────────────────────────────────────────────────────
function BulkActions({ onToast }:{ onToast:(m:string)=>void }) {
  const [sel, setSel] = useState([USERS[2].id, USERS[4].id])
  const selected = USERS.filter(u=>sel.includes(u.id))
  return (
    <div style={{ maxWidth:760, margin:'0 auto', padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:20 }}>Bulk Actions</h2>
      <Card style={{ padding:20, marginBottom:14 }}>
        <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:14 }}>
          <Bdg label={`${selected.length} users selected`} color={C.primary} dot />
          <button onClick={()=>setSel([])} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, fontFamily:'Manrope,sans-serif', fontSize:11 }}>Clear selection</button>
        </div>
        {selected.map(u=>(
          <div key={u.id} style={{ display:'flex', gap:10, alignItems:'center', padding:'8px 0', borderBottom:`1px solid ${C.border}` }}>
            <UA name={u.name} size={32} color={C.primary} />
            <div style={{ flex:1 }}>
              <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{u.name}</p>
              <p style={{ fontSize:10, color:C.muted }}>{u.role} · {u.id}</p>
            </div>
            <Bdg label={u.status.charAt(0).toUpperCase()+u.status.slice(1)} color={STATUS_COLOR[u.status]} dot />
            <button onClick={()=>setSel(s=>s.filter(x=>x!==u.id))} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, fontFamily:'Manrope,sans-serif', fontSize:11 }}>Remove</button>
          </div>
        ))}
      </Card>
      <SectionTitle title="Apply Bulk Action" />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
        {[{e:'🔑',l:'Assign Role',      v:'secondary'},{e:'🚫',l:'Suspend All',    v:'danger'},{e:'✅',l:'Activate All',   v:'success'},{e:'📧',l:'Send Notification',v:'secondary'},{e:'📥',l:'Export Selected',v:'secondary'},{e:'🗑️',l:'Delete (Placeholder)',v:'ghost'}].map((a,i)=>(
          <Btn key={i} label={a.l} variant={a.v as 'secondary'|'danger'|'success'|'ghost'} full onClick={()=>onToast(`${a.l}…`)} />
        ))}
      </div>
    </div>
  )
}

// ─── User Impersonation ───────────────────────────────────────────────────────
function UserImpersonation({ onToast }:{ onToast:(m:string)=>void }) {
  const [active, setActive] = useState(false)
  return (
    <div style={{ maxWidth:680, margin:'0 auto', padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:20 }}>User Impersonation</h2>
      {active&&(
        <div style={{ padding:'14px 18px', borderRadius:12, background:`${C.warning}10`, border:`2px solid ${C.warning}40`, marginBottom:18, display:'flex', gap:12, alignItems:'center' }}>
          <span style={{ fontSize:22 }}>⚠️</span>
          <div style={{ flex:1 }}>
            <p style={{ fontSize:13, fontWeight:800, color:C.warning }}>Support Mode Active — You are viewing as Mohamed Ihsan</p>
            <p style={{ fontSize:11, color:C.sub }}>All actions are logged. This session is recorded. End impersonation when done.</p>
          </div>
          <Btn label="End Session" variant="danger" small onClick={()=>{ setActive(false); onToast('Impersonation session ended') }} />
        </div>
      )}
      <Card style={{ padding:22, marginBottom:14 }}>
        <SectionTitle title="Start Impersonation Session" />
        <p style={{ fontSize:12, color:C.muted, marginBottom:16 }}>Impersonating a user allows you to experience the platform exactly as they do. Use for support troubleshooting only. All actions are logged with an audit record.</p>
        <div style={{ display:'flex', gap:12, alignItems:'center', padding:'12px 16px', borderRadius:12, border:`1px solid ${C.border}`, background:'#FAFAFA', marginBottom:14 }}>
          <UA name="Mohamed Ihsan" size={44} color={C.primary} />
          <div>
            <p style={{ fontSize:13, fontWeight:700, color:C.type }}>Mohamed Ihsan</p>
            <p style={{ fontSize:11, color:C.muted }}>USR-0001 · Client · Active</p>
          </div>
        </div>
        <div style={{ padding:'12px 16px', borderRadius:10, background:`${C.error}06`, border:`1px solid ${C.error}20`, marginBottom:16 }}>
          <p style={{ fontSize:11, fontWeight:700, color:C.error, marginBottom:4 }}>Before you proceed</p>
          <ul style={{ margin:0, paddingLeft:16, fontSize:11, color:C.sub, lineHeight:1.8 }}>
            <li>This session will be recorded in the Audit Log</li>
            <li>Your identity (Super Admin) will be associated with all actions</li>
            <li>Do not perform any transactions or changes on the user's behalf</li>
          </ul>
        </div>
        <Btn label={active?'End Impersonation':'Start Impersonation — Mohamed Ihsan'} variant={active?'danger':'warning'} full onClick={()=>{ setActive(v=>!v); onToast(active?'Session ended':'Impersonation started — all actions logged') }} />
      </Card>
    </div>
  )
}

// ─── Audit Log ────────────────────────────────────────────────────────────────
function AuditLog({ onToast }:{ onToast:(m:string)=>void }) {
  const entries = [
    { ts:'22 Jan 14:32:15', admin:'Thilina S.',   user:'Priya Fernando',    action:'Account Suspended',    module:'User Mgmt', ip:'10.0.0.12', status:'success' },
    { ts:'22 Jan 13:18:42', admin:'Ranjith B.',   user:'Dilshan Ratnayake', action:'Verification Approved', module:'Verification',ip:'10.0.0.8',status:'success' },
    { ts:'22 Jan 11:04:07', admin:'Amara S.',      user:'Nimal Perera',      action:'Role Assigned: Client', module:'Roles',     ip:'10.0.0.15',status:'success' },
    { ts:'22 Jan 09:55:31', admin:'Super Admin',   user:'Thilina S.',        action:'Role: Ops→Platform Admin',module:'Roles',   ip:'10.0.0.1', status:'success' },
    { ts:'21 Jan 18:22:09', admin:'Ranjith B.',   user:'Kasun Perera',       action:'Document Approved',    module:'Verification',ip:'10.0.0.8',status:'success' },
    { ts:'21 Jan 16:11:48', admin:'Super Admin',  user:'N/A',                action:'Permission Matrix Updated',module:'Roles', ip:'10.0.0.1', status:'success' },
    { ts:'21 Jan 14:03:22', admin:'Amara S.',      user:'Chamari W.',         action:'Password Reset Sent',  module:'User Mgmt', ip:'10.0.0.15',status:'success' },
    { ts:'20 Jan 11:45:00', admin:'Super Admin',  user:'N/A',                action:'Impersonation Session',module:'Security',   ip:'10.0.0.1', status:'warning' },
  ]
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Audit Log</h2>
        <Btn label="Export Log" variant="secondary" small icon={I.download} onClick={()=>onToast('Exporting audit log…')} />
      </div>
      <Card style={{ overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'130px 100px 120px 180px 110px 80px 70px', padding:'10px 16px', background:'#FAFAFA', borderBottom:`1px solid ${C.border}`, gap:0 }} className="um-audit-row">
          {['Timestamp','Admin','Affected User','Action','Module','IP','Status'].map((h,i)=>(
            <p key={i} style={{ fontSize:10, fontWeight:800, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.06em', paddingInline:6 }}>{h}</p>
          ))}
        </div>
        {entries.map((e,i)=>(
          <div key={i} style={{ display:'grid', gridTemplateColumns:'130px 100px 120px 180px 110px 80px 70px', padding:'11px 16px', borderBottom:i<entries.length-1?`1px solid ${C.border}`:'none', gap:0 }} className="um-audit-row">
            <p style={{ fontSize:10, color:C.muted, paddingInline:6, fontFamily:'monospace' }}>{e.ts}</p>
            <p style={{ fontSize:11, fontWeight:700, color:C.type, paddingInline:6 }}>{e.admin}</p>
            <p style={{ fontSize:11, color:C.sub, paddingInline:6 }}>{e.user}</p>
            <p style={{ fontSize:11, color:C.type, paddingInline:6 }}>{e.action}</p>
            <Bdg label={e.module} color={C.primary} />
            <p style={{ fontSize:10, color:C.muted, paddingInline:6, fontFamily:'monospace' }}>{e.ip}</p>
            <div style={{ paddingInline:6 }}><Bdg label={e.status.charAt(0).toUpperCase()+e.status.slice(1)} color={e.status==='warning'?C.warning:C.success} dot /></div>
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── Security Center ──────────────────────────────────────────────────────────
function SecurityCenter({ onToast }:{ onToast:(m:string)=>void }) {
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>Security Center</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:18 }} className="um-3col">
        {[{e:'🔒',l:'Locked Accounts',      v:'3',  c:C.error},{e:'⚠️',l:'Suspicious Activity', v:'2',  c:C.warning},{e:'🔑',l:'Failed Logins (24h)',  v:'18', c:C.warning},{e:'📱',l:'MFA Adoption',           v:'72%',c:C.success},{e:'⏳',l:'PW Expiry < 7 days',   v:'14', c:C.muted},{e:'🛡️',l:'High Risk Accounts',    v:'5',  c:C.error}].map((s,i)=>(
          <Card key={i} style={{ padding:18, textAlign:'center' as const, border:`1.5px solid ${s.c}20`, background:`${s.c}04` }}>
            <p style={{ fontSize:26, marginBottom:6 }}>{s.e}</p>
            <p style={{ fontSize:24, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{s.v}</p>
            <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      <Card style={{ padding:22, marginBottom:14 }}>
        <SectionTitle title="Recent Security Events" />
        {[{e:'🔒',t:'Account auto-locked',d:'Suresh P. — 5 failed login attempts · IP: 192.168.1.44',time:'2 hrs ago',c:C.error},{e:'⚠️',t:'Suspicious login',d:'Chamari W. — Unknown device · Colombo, different network',time:'5 hrs ago',c:C.warning},{e:'🔑',t:'Password reset',d:'Priya Fernando — Requested via email',time:'Yesterday',c:C.info},{e:'📱',t:'MFA bypass attempt',d:'Unknown user — Blocked at gateway',time:'2 days ago',c:C.error}].map((ev,i)=>(
          <div key={i} style={{ display:'flex', gap:12, padding:'10px 0', borderBottom:i<3?`1px solid ${C.border}`:'none' }}>
            <div style={{ width:38, height:38, borderRadius:10, background:`${ev.c}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{ev.e}</div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{ev.t}</p>
              <p style={{ fontSize:11, color:C.muted }}>{ev.d}</p>
            </div>
            <p style={{ fontSize:9, color:C.muted, flexShrink:0 }}>{ev.time}</p>
          </div>
        ))}
      </Card>
      <Card style={{ padding:22 }}>
        <SectionTitle title="Locked Accounts" action="Unlock All" onAction={()=>onToast('Batch unlock…')} />
        {[{name:'Suresh P.',     reason:'5 failed logins',   time:'2 hrs ago'},{name:'Unknown User 2',reason:'MFA bypass attempt','time':'5 hrs ago'},{name:'Expired Session',reason:'Stale auth token','time':'Yesterday'}].map((a,i)=>(
          <div key={i} style={{ display:'flex', gap:10, alignItems:'center', padding:'8px 0', borderBottom:i<2?`1px solid ${C.border}`:'none' }}>
            <span style={{ fontSize:22 }}>🔒</span>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{a.name}</p>
              <p style={{ fontSize:10, color:C.muted }}>{a.reason} · {a.time}</p>
            </div>
            <Btn label="Unlock" variant="success" small onClick={()=>onToast(`Unlocking ${a.name}`)} />
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── Verification Center ──────────────────────────────────────────────────────
function VerificationCenter({ onToast }:{ onToast:(m:string)=>void }) {
  const pending = [
    { name:'Dilshan Ratnayake', type:'Care Agent', docs:['NIC','Police Clearance','Nursing Certificate'], submitted:'Jan 22', urgency:'normal' },
    { name:'Ayesha Malik',       type:'Care Agent', docs:['NIC','Medical Certificate'],                   submitted:'Jan 19', urgency:'urgent' },
    { name:'Sampath Jayawardena',type:'Care Agent', docs:['NIC (Expired)','New Cert'],                    submitted:'Jan 18', urgency:'urgent' },
  ]
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>Verification Center</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }} className="um-4col">
        {[{l:'Pending Identity',v:'18',c:C.warning},{l:'Rejected Docs',v:'3',c:C.error},{l:'Expired Certs',v:'7',c:C.error},{l:'BG Checks',v:'12',c:C.info}].map((s,i)=>(
          <Card key={i} style={{ padding:16, textAlign:'center' as const }}>
            <p style={{ fontSize:26, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{s.v}</p>
            <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      {pending.map((p,i)=>(
        <Card key={i} style={{ padding:20, marginBottom:12, border:p.urgency==='urgent'?`1.5px solid ${C.warning}40`:undefined }}>
          <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
            <UA name={p.name} size={48} color={C.primary} />
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:4 }}>
                <p style={{ fontSize:14, fontWeight:700, color:C.type }}>{p.name}</p>
                <Bdg label={p.type} color={C.primary} />
                {p.urgency==='urgent'&&<Bdg label="Urgent" color={C.warning} dot />}
              </div>
              <p style={{ fontSize:11, color:C.muted, marginBottom:8 }}>Submitted: {p.submitted}</p>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' as const }}>
                {p.docs.map((d,j)=>(
                  <div key={j} style={{ display:'flex', gap:5, alignItems:'center', padding:'4px 10px', borderRadius:8, border:`1px solid ${C.border}`, background:'#FAFAFA' }}>
                    <span style={{ display:'flex', color:C.muted, transform:'scale(0.85)' }}>{I.doc}</span>
                    <p style={{ fontSize:10, color:C.sub }}>{d}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <Btn label="Approve" variant="success" small icon={I.check} onClick={()=>onToast(`${p.name} approved`)} />
              <Btn label="Reject" variant="danger" small onClick={()=>onToast(`${p.name} rejected`)} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Notifications ────────────────────────────────────────────────────────────
function UMNotifications() {
  const items = [
    {e:'👤',t:'New User Registered',   b:'Nimal Perera registered as a new client. Awaiting verification.',        c:C.info,    read:false},
    {e:'🔑',t:'Role Changed',           b:'Thilina Senanayake promoted from Operations Manager to Platform Admin.',  c:C.primary, read:false},
    {e:'🚫',t:'Account Suspended',      b:'Priya Fernando suspended following high-risk flag detection.',            c:C.error,   read:false},
    {e:'✅',t:'Verification Approved',  b:'Kasun Perera — all documents verified by Ranjith Bandara.',              c:C.success, read:true },
    {e:'🔒',t:'Password Reset',         b:'Chamari Wickrama requested a password reset via email.',                  c:C.warning, read:true },
    {e:'⚠️',t:'Security Alert',        b:'5 failed login attempts detected on Suresh P. Account locked automatically.',c:C.error,read:true },
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

// ─── Status Badges ────────────────────────────────────────────────────────────
function StatusBadgesView() {
  const badges = [{l:'Verified',c:C.success},{l:'Pending',c:C.warning},{l:'Rejected',c:C.error},{l:'Active',c:C.success},{l:'Inactive',c:C.muted},{l:'Suspended',c:C.error},{l:'Locked',c:C.error},{l:'High Risk',c:C.error},{l:'Low Risk',c:C.success}]
  return (
    <div style={{ maxWidth:700, margin:'0 auto', padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>Status Badges</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
        {badges.map((b,i)=>(
          <Card key={i} style={{ padding:20, textAlign:'center' as const, display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
            <div style={{ width:10, height:10, borderRadius:'50%', background:b.c }}/>
            <Bdg label={b.l} color={b.c} dot />
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Empty/Loading/Error/Success ──────────────────────────────────────────────
function EmptyStates() {
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:16 }}>Empty States</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        {[{e:'👥',t:'No Users',           d:'No users match the current filters. Try adjusting your search criteria.'},{e:'🔍',t:'No Results',          d:'No users found for this search. Try a different name, email, or ID.'},{e:'📋',t:'No Activity',          d:'No recent account activity to display for this user.'},{e:'📒',t:'No Audit Records',     d:'No audit log entries found for the selected time range.'}].map((s,i)=>(
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

function LoadingStates() {
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:16 }}>Loading States</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        {['Loading Users','Loading Permissions','Loading Audit Log','Loading Documents'].map((l,i)=>(
          <Card key={i} style={{ padding:22 }}>
            <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:14 }}>{l}</p>
            {/* Table skeleton */}
            <div style={{ borderRadius:8, overflow:'hidden', border:`1px solid ${C.border}` }}>
              <div style={{ height:36, background:'#F7F9FA', borderBottom:`1px solid ${C.border}` }}/>
              {[...Array(4)].map((_,j)=>(
                <div key={j} style={{ padding:'12px 16px', borderBottom:j<3?`1px solid ${C.border}`:'none', display:'flex', gap:12, alignItems:'center' }}>
                  <div style={{ width:32, height:32, borderRadius:'50%', background:'#E4E8EA', flexShrink:0 }}/>
                  <div style={{ flex:1 }}><Shimmer h={12} w="60%"/><div style={{height:6}}/><Shimmer h={10} w="40%"/></div>
                  <Shimmer h={18} w="60px"/>
                </div>
              ))}
            </div>
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
      {[{e:'👥',t:'Unable to Load Users',  d:'User data could not be retrieved. Check your permissions and retry.',c:C.error},{e:'🔒',t:'Permission Error',     d:"You don't have permission to perform this action. Contact Super Admin.",c:C.warning},{e:'📶',t:'Network Error',        d:'Connection lost. Check your network and try again.',c:C.muted}].map((er,i)=>(
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
      {[{e:'🔑',t:'Role Updated',          d:'Operations Manager role saved. Changes applied to 8 users immediately.',c:C.primary},{e:'✅',t:'Permissions Saved',    d:'Permission matrix updated. All affected sessions will refresh automatically.',c:C.success},{e:'👤',t:'User Activated',       d:'Nimal Perera account activated. Email confirmation sent.',c:C.success},{e:'🚫',t:'Account Suspended',   d:'Priya Fernando suspended. Access revoked and user notified.',c:C.error},{e:'🔍',t:'Verification Approved',d:'Kasun Perera — all documents verified. Care agent status activated.',c:C.success}].map((s,i)=>(
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

// ─── Generic list views ───────────────────────────────────────────────────────
function ClientList({ onToast }:{ onToast:(m:string)=>void }) {
  const clients = USERS.filter(u=>u.role==='Client')
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Client Management</h2>
        <Btn label="Export" variant="secondary" small icon={I.download} onClick={()=>onToast('Exporting…')} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }} className="um-4col">
        {[{l:'Total Clients',v:'2,856',c:C.primary},{l:'Active',v:'1,924',c:C.success},{l:'Pending',v:'14',c:C.warning},{l:'Suspended',v:'4',c:C.error}].map((s,i)=>(
          <Card key={i} style={{ padding:18, textAlign:'center' as const }}>
            <p style={{ fontSize:24, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{s.v}</p>
            <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      {clients.map(u=>(
        <Card key={u.id} hover style={{ padding:18, marginBottom:8 }}>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <UA name={u.name} size={42} color={C.primary} />
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:2 }}>
                <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{u.name}</p>
                <Bdg label={u.status.charAt(0).toUpperCase()+u.status.slice(1)} color={STATUS_COLOR[u.status]} dot />
                {u.verified&&<Bdg label="Verified" color={C.success} />}
                <Bdg label={`Risk: ${u.risk.toUpperCase()}`} color={RISK_COLOR[u.risk]} />
              </div>
              <p style={{ fontSize:11, color:C.muted }}>{u.id} · {u.email} · Last login: {u.login}</p>
            </div>
            <div style={{ display:'flex', gap:6 }}>
              <Btn label="View" variant="ghost" small icon={I.eye} onClick={()=>onToast(`Viewing ${u.name}`)} />
              <Btn label="Edit" variant="ghost" small icon={I.edit} onClick={()=>onToast(`Editing ${u.name}`)} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

function AgentMgmtList({ onToast }:{ onToast:(m:string)=>void }) {
  const agents = USERS.filter(u=>u.role==='Care Agent')
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Care Agent Management</h2>
        <Btn label="Export" variant="secondary" small icon={I.download} onClick={()=>onToast('Exporting…')} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }} className="um-4col">
        {[{l:'Verified Agents',v:'684',c:C.primary},{l:'Online Now',v:'87',c:C.success},{l:'Pending Approval',v:'18',c:C.warning},{l:'Avg Rating',v:'4.76★',c:C.warning}].map((s,i)=>(
          <Card key={i} style={{ padding:18, textAlign:'center' as const }}>
            <p style={{ fontSize:24, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{s.v}</p>
            <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      {agents.map(u=>(
        <Card key={u.id} hover style={{ padding:18, marginBottom:8 }}>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <UA name={u.name} size={42} color={C.success} />
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:2 }}>
                <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{u.name}</p>
                <Bdg label={u.status.charAt(0).toUpperCase()+u.status.slice(1)} color={STATUS_COLOR[u.status]} dot />
                {u.verified&&<Bdg label="Verified" color={C.success} />}
                {u.rating&&<Bdg label={`${u.rating}★`} color={C.warning} />}
              </div>
              <p style={{ fontSize:11, color:C.muted }}>{u.id} · {u.email} · Last login: {u.login}</p>
            </div>
            <div style={{ display:'flex', gap:6 }}>
              <Btn label="View" variant="ghost" small icon={I.eye} onClick={()=>onToast(`Viewing ${u.name}`)} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

function AdminMgmtList({ onToast }:{ onToast:(m:string)=>void }) {
  const staff = USERS.filter(u=>u.role!=='Client'&&u.role!=='Care Agent')
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Admins & Staff</h2>
        <Btn label="Invite Staff" small icon={I.plus} onClick={()=>onToast('Opening invite form…')} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:18 }}>
        {[{l:'Total Staff',v:'44',c:C.primary},{l:'MFA Enabled',v:'38',c:C.success},{l:'Active Today',v:'12',c:C.info}].map((s,i)=>(
          <Card key={i} style={{ padding:18, textAlign:'center' as const }}>
            <p style={{ fontSize:26, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{s.v}</p>
            <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      {staff.map(u=>(
        <Card key={u.id} hover style={{ padding:18, marginBottom:8 }}>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <UA name={u.name} size={42} color={C.accent} />
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:2 }}>
                <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{u.name}</p>
                <Bdg label={u.role} color={C.accent} />
                <Bdg label={u.status.charAt(0).toUpperCase()+u.status.slice(1)} color={STATUS_COLOR[u.status]} dot />
              </div>
              <p style={{ fontSize:11, color:C.muted }}>{u.id} · {u.email} · Last: {u.login}</p>
            </div>
            <div style={{ display:'flex', gap:6 }}>
              <Btn label="Edit" variant="ghost" small icon={I.edit} onClick={()=>onToast(`Editing ${u.name}`)} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function UserManagement() {
  const [sub, setSub] = useState<SubView>('home')
  const [toast, setToast] = useState<string|null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const showToast = (m:string) => { setToast(m); setTimeout(()=>setToast(null),2800) }
  const groups = [...new Set(NAV.map(n=>n.group))]

  const renderMain = () => {
    switch(sub) {
      case 'home':          return <MgmtHome onNav={setSub} onToast={showToast} />
      case 'search':        return <GlobalSearch onNav={setSub} onToast={showToast} />
      case 'filters':       return <UserDirectory onNav={setSub} onToast={showToast} />
      case 'directory':     return <UserDirectory onNav={setSub} onToast={showToast} />
      case 'userProfile':   return <UserProfile onToast={showToast} />
      case 'clients':       return <ClientList onToast={showToast} />
      case 'agentMgmt':     return <AgentMgmtList onToast={showToast} />
      case 'adminMgmt':     return <AdminMgmtList onToast={showToast} />
      case 'roles':         return <RoleManagement onNav={setSub} onToast={showToast} />
      case 'permissions':   return <PermissionMatrix onToast={showToast} />
      case 'roleEditor':    return <RoleEditor onToast={showToast} />
      case 'accountActions':return <AccountActions onToast={showToast} />
      case 'bulkActions':   return <BulkActions onToast={showToast} />
      case 'impersonation': return <UserImpersonation onToast={showToast} />
      case 'activityLog':   return <AuditLog onToast={showToast} />
      case 'auditLog':      return <AuditLog onToast={showToast} />
      case 'security':      return <SecurityCenter onToast={showToast} />
      case 'verification':  return <VerificationCenter onToast={showToast} />
      case 'docViewer':     return <VerificationCenter onToast={showToast} />
      case 'notifications': return <UMNotifications />
      case 'statusBadges':  return <StatusBadgesView />
      case 'empty':         return <EmptyStates />
      case 'loading':       return <LoadingStates />
      case 'error':         return <ErrorStates onToast={showToast} />
      case 'success':       return <SuccessStates />
      default: return null
    }
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:C.bg, fontFamily:'Manrope,sans-serif' }}>
      {/* Dark sidebar */}
      <div className="um-sidebar" style={{ width:214, background:C.dark, display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh', overflowY:'auto', flexShrink:0 }}>
        <div style={{ padding:'16px 18px 14px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <div style={{ width:30, height:30, borderRadius:9, background:`linear-gradient(135deg,${C.primary},#005D63)`, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ color:'white', fontSize:14 }}>👥</span>
            </div>
            <div>
              <p style={{ fontSize:13, fontWeight:900, color:'rgba(255,255,255,0.95)', fontFamily:'Manrope,sans-serif', lineHeight:1 }}>ReadyPal</p>
              <p style={{ fontSize:9, color:'rgba(255,255,255,0.4)', fontWeight:700, textTransform:'uppercase' as const, letterSpacing:'0.08em' }}>User Management</p>
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
                  {n.badge&&n.badge>0&&<div style={{ minWidth:18, height:18, borderRadius:99, background:C.warning, color:'#fff', fontSize:9, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 5px' }}>{n.badge}</div>}
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
              <p style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.9)' }}>User Management</p>
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

      {/* Top bar + main */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        {/* Header */}
        <div style={{ height:52, background:C.surface, borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', paddingInline:20, gap:12, position:'sticky', top:0, zIndex:30, flexShrink:0 }}>
          <button className="um-menu-btn" onClick={()=>setSidebarOpen(v=>!v)} style={{ background:'none', border:'none', cursor:'pointer', color:C.type, padding:4, display:'none' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
          <div style={{ flex:1, display:'flex', gap:8, alignItems:'center', maxWidth:360, padding:'7px 12px', borderRadius:9, border:`1px solid ${C.border}`, background:'#FAFAFA' }}>
            <span style={{ display:'flex', color:C.muted }}>{I.search}</span>
            <input placeholder="Search users, IDs, emails…" style={{ border:'none', background:'transparent', fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, outline:'none', flex:1 }} onFocus={()=>setSub('search')} />
          </div>
          <div style={{ marginLeft:'auto', display:'flex', gap:6, alignItems:'center' }}>
            <Bdg label="3,584 total users" color={C.primary} />
            <Bdg label="18 pending" color={C.warning} dot />
          </div>
        </div>
        <div style={{ flex:1, overflowY:'auto' }} className="um-main">
          {renderMain()}
        </div>
      </div>

      {toast&&<Toast msg={toast} />}
    </div>
  )
}
