import { useState, type ReactNode, type CSSProperties } from 'react'

// ─── Brand ────────────────────────────────────────────────────────────────────
const C = {
  primary:'#00737A', accent:'#EE8153', type:'#2C3E43', sub:'#6B7E85',
  muted:'#9AAAB0', border:'#E4E8EA', bg:'#F2F4F5', surface:'#FFFFFF',
  success:'#22C55E', warning:'#F59E0B', error:'#EF4444', info:'#3B82F6',
  dark:'#1A2A30', darkSub:'rgba(255,255,255,0.08)',
}

// ─── Status config ────────────────────────────────────────────────────────────
const VSTATUS: Record<string,{ color:string; label:string }> = {
  verified:     { color:C.success,  label:'Verified'          },
  pending:      { color:C.warning,  label:'Pending Review'    },
  awaiting:     { color:C.info,     label:'Awaiting Documents'},
  approved:     { color:C.success,  label:'Approved'          },
  rejected:     { color:C.error,    label:'Rejected'          },
  expired:      { color:C.error,    label:'Expired'           },
  escalated:    { color:'#F97316',  label:'Escalated'         },
  highrisk:     { color:C.error,    label:'High Risk'         },
  lowrisk:      { color:C.success,  label:'Low Risk'          },
  fraud:        { color:'#DC2626',  label:'Fraud Alert'       },
  underreview:  { color:C.primary,  label:'Under Review'      },
  archived:     { color:C.muted,    label:'Archived'          },
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const QUEUE = [
  { id:'RP-VER-2026-00142', name:'Kasun Perera',       type:'Care Agent', submitted:'20 Jan 2026', stage:'Document Review',    priority:'high',   risk:12,  reviewer:'Ranjith B.', status:'underreview' },
  { id:'RP-VER-2026-00143', name:'Dilshan Ratnayake',  type:'Care Agent', submitted:'21 Jan 2026', stage:'Identity Check',     priority:'medium', risk:18,  reviewer:'Unassigned', status:'pending'     },
  { id:'RP-VER-2026-00144', name:'Ayesha Malik',       type:'Care Agent', submitted:'21 Jan 2026', stage:'Background Check',   priority:'high',   risk:24,  reviewer:'Ranjith B.', status:'awaiting'    },
  { id:'RP-VER-2026-00138', name:'Sampath Jayawardena',type:'Care Agent', submitted:'18 Jan 2026', stage:'Final Review',       priority:'urgent', risk:42,  reviewer:'Thilina S.', status:'escalated'   },
  { id:'RP-VER-2026-00135', name:'Chamara Kumarasinghe',type:'Care Agent',submitted:'16 Jan 2026', stage:'Awaiting Documents', priority:'medium', risk:8,   reviewer:'Amara S.',   status:'awaiting'    },
  { id:'RP-VER-2026-00129', name:'Nirosha Jayasena',   type:'Support',    submitted:'14 Jan 2026', stage:'Approved',           priority:'low',    risk:5,   reviewer:'Ranjith B.', status:'approved'    },
]

const CERTS = [
  { name:'Kasun Perera',    cert:'Medical Certificate',    issued:'15 Jul 2025', expiry:'15 Mar 2026', daysLeft:52,  status:'expiring' },
  { name:'Dilshan R.',      cert:'Caregiving Certificate', issued:'01 Jan 2025', expiry:'01 Feb 2026', daysLeft:10,  status:'urgent'   },
  { name:'Ayesha M.',       cert:'CPR Certificate',        issued:'10 Mar 2025', expiry:'10 Mar 2026', daysLeft:47,  status:'expiring' },
  { name:'Chamara K.',      cert:'Police Clearance',       issued:'05 Dec 2024', expiry:'05 Dec 2025', daysLeft:-48, status:'expired'  },
  { name:'Sampath J.',      cert:'First Aid Certificate',  issued:'20 Aug 2025', expiry:'20 Aug 2026', daysLeft:210, status:'valid'    },
]

// ─── Icons ────────────────────────────────────────────────────────────────────
const I: Record<string,ReactNode> = {
  home:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 5.5l5.5-4.5 5.5 4.5V12H8.5V8.5h-4V12H1V5.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  shield:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1L1.5 3v4c0 3 5 4.5 5 4.5s5-1.5 5-4.5V3L6.5 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M4 6.5l2 2 3.5-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  queue:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="1" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 4.5h5M4 7h3M4 9.5h4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  doc:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M3 1h5l3 3v8H3V1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M8 1v3h3" stroke="currentColor" strokeWidth="1.1"/><path d="M5 6h3M5 8h3M5 10h2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  id:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="2.5" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="4.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/><path d="M7 5.5h3M7 7.5h2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  check:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 6.5l3 3.5 5-6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  cert:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1l1.2 3.4H11L8.4 7l1 3.2-2.9-2-2.9 2 1-3.2L2 4.9h3.3L6.5 1z" stroke="currentColor" strokeWidth="1.1"/></svg>,
  alert:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5L1 12h11L6.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M6.5 5.5v3M6.5 10v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  fraud:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 4l5 5M9 4L4 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  clock:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M6.5 3.5V7h2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  audit:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="2" y="1" width="9" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 4.5h4M4.5 7h4M4.5 9.5h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  appeal:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1L1.5 3v4c0 3 5 4.5 5 4.5s5-1.5 5-4.5V3L6.5 1z" stroke="currentColor" strokeWidth="1.2"/><path d="M6.5 4v3M6.5 9v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  report:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="1" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 9V7M6.5 9V5M9 9V3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  bell:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5c-2.5 0-4 1.8-4 4v2.5L1 9.5h11l-1.5-1.5V5.5c0-2.2-1.5-4-4-4z" stroke="currentColor" strokeWidth="1.2"/><path d="M5 9.5c0 .83.67 1.5 1.5 1.5S8 10.33 8 9.5" stroke="currentColor" strokeWidth="1.1"/></svg>,
  eye:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 6.5C1 6.5 3 3.5 6.5 3.5S12 6.5 12 6.5 10 9.5 6.5 9.5 1 6.5 1 6.5z" stroke="currentColor" strokeWidth="1.2"/><circle cx="6.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/></svg>,
  edit:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M9.5 1.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  download:<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2v7M4 6.5L6.5 9 9 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M1.5 10.5h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  plus:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2v9M2 6.5h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  chevR:   <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M3.5 2l3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  refresh: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M11 6.5a4.5 4.5 0 1 1-1-2.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M11 3v2.5H8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  bg:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5" cy="4.5" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 11c0-1.93 1.57-3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M9 8l1.5 1.5L13 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  trust:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1L1.5 3v4c0 3 5 4.5 5 4.5s5-1.5 5-4.5V3L6.5 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  incident:<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5L1 12h11L6.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M6.5 5v3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="6.5" cy="10" r=".7" fill="currentColor"/></svg>,
  qa:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 6.5c0-1 .75-1.5 1.5-1.5S8 6 8 6.5c0 .75-.5 1.25-1.5 1.5V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="6.5" cy="10.5" r=".6" fill="currentColor"/></svg>,
  workflow:<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="2.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/><circle cx="10.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/><circle cx="6.5" cy="2.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/><path d="M4 6.5H9M6.5 4v1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
}

// ─── Hover-free Card / Btn ────────────────────────────────────────────────────
function Card({ children, style={}, hover=false, onClick }:{ children:ReactNode; style?:CSSProperties; hover?:boolean; onClick?:()=>void }) {
  return (
    <div onClick={onClick}
      onMouseEnter={e=>{ if(hover){ const el=e.currentTarget as HTMLDivElement; el.style.borderColor=C.primary+'50'; el.style.boxShadow='0 8px 24px rgba(44,62,67,0.10)' }}}
      onMouseLeave={e=>{ if(hover){ const el=e.currentTarget as HTMLDivElement; el.style.borderColor=C.border; el.style.boxShadow='0 1px 4px rgba(44,62,67,0.06)' }}}
      style={{ background:C.surface, borderRadius:14, border:`1px solid ${C.border}`, boxShadow:'0 1px 4px rgba(44,62,67,0.06)', transition:'all 0.18s', cursor:onClick?'pointer':undefined, ...style }}>
      {children}
    </div>
  )
}

const BTN_BASE: Record<string,CSSProperties> = {
  primary:  { background:C.primary,  color:'#fff', border:'none' },
  secondary:{ background:'#fff',     color:C.primary, border:`1.5px solid ${C.border}` },
  ghost:    { background:'transparent', color:C.sub, border:'none' },
  danger:   { background:C.error,    color:'#fff', border:'none' },
  warning:  { background:C.warning,  color:'#fff', border:'none' },
  success:  { background:C.success,  color:'#fff', border:'none' },
}
const BTN_HOVER: Record<string,Partial<CSSProperties>> = {
  primary:'#005D63' as unknown as Partial<CSSProperties>,
  secondary:'#EEF5F5' as unknown as Partial<CSSProperties>,
  ghost:C.bg as unknown as Partial<CSSProperties>,
  danger:'#DC2626' as unknown as Partial<CSSProperties>,
  warning:'#D97706' as unknown as Partial<CSSProperties>,
  success:'#16A34A' as unknown as Partial<CSSProperties>,
}

function Btn({ label, icon, onClick, variant='primary', small=false, full=false }:{
  label:string; icon?:ReactNode; onClick?:()=>void
  variant?:'primary'|'secondary'|'ghost'|'danger'|'warning'|'success'
  small?:boolean; full?:boolean
}) {
  return (
    <button onClick={onClick}
      onMouseEnter={e=>{ (e.currentTarget as HTMLButtonElement).style.background=BTN_HOVER[variant] as string }}
      onMouseLeave={e=>{ (e.currentTarget as HTMLButtonElement).style.background=(BTN_BASE[variant] as {background:string}).background }}
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

function VSBdg({ status }:{ status:string }) {
  const s = VSTATUS[status] || { color:C.muted, label:status }
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
  const initials = name.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase()
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', color, fontFamily:'Manrope,sans-serif', fontWeight:900, fontSize:size*0.3, flexShrink:0 }}>{initials}</div>
  )
}

// ─── Trust Score Ring ─────────────────────────────────────────────────────────
function TrustRing({ score, size=120, label='Trust Score' }:{ score:number; size?:number; label?:string }) {
  const r = (size/2) - 10
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  const color = score >= 80 ? C.success : score >= 60 ? C.warning : C.error
  return (
    <div style={{ position:'relative' as const, width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`${color}18`} strokeWidth={10}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`} style={{ transition:'stroke-dasharray 0.6s ease' }}/>
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <p style={{ fontSize:size*0.22, fontWeight:900, color, fontFamily:'Manrope,sans-serif', lineHeight:1 }}>{score}</p>
        <p style={{ fontSize:size*0.09, color:C.muted, textAlign:'center' as const }}>{label}</p>
      </div>
    </div>
  )
}

// ─── Sub-view type ────────────────────────────────────────────────────────────
type SubView = 'home'|'queue'|'appDetail'|'docReview'|'identity'|'background'|'certs'|'compliance'|'fraud'|'trustScore'|'workflow'|'reviewer'|'expiry'|'auditTrail'|'appeals'|'incidents'|'qa'|'notifications'|'reports'|'statusBadges'|'empty'|'loading'|'error'|'success'

const NAV: { k:SubView; l:string; icon:ReactNode; group:string; badge?:number }[] = [
  { k:'home',          l:'Trust Center',          icon:I.trust,    group:'Overview'    },
  { k:'queue',         l:'Verification Queue',    icon:I.queue,    group:'Overview',  badge:18 },
  { k:'appDetail',     l:'Application Details',   icon:I.id,       group:'Overview'    },
  { k:'docReview',     l:'Document Review',       icon:I.doc,      group:'Verification'},
  { k:'identity',      l:'Identity Verification', icon:I.id,       group:'Verification'},
  { k:'background',    l:'Background Checks',     icon:I.bg,       group:'Verification'},
  { k:'certs',         l:'Certification Mgmt',    icon:I.cert,     group:'Verification'},
  { k:'compliance',    l:'Compliance Dashboard',  icon:I.shield,   group:'Compliance'  },
  { k:'fraud',         l:'Fraud Detection',       icon:I.fraud,    group:'Compliance', badge:3 },
  { k:'trustScore',    l:'Trust Score',           icon:I.trust,    group:'Compliance'  },
  { k:'workflow',      l:'Review Workflow',       icon:I.workflow, group:'Operations'  },
  { k:'reviewer',      l:'Reviewer Workspace',    icon:I.edit,     group:'Operations'  },
  { k:'expiry',        l:'Document Expiry',       icon:I.clock,    group:'Operations', badge:7 },
  { k:'auditTrail',    l:'Audit Trail',           icon:I.audit,    group:'Logs'        },
  { k:'appeals',       l:'Appeals Management',    icon:I.appeal,   group:'Logs',      badge:2 },
  { k:'incidents',     l:'Trust & Safety',        icon:I.incident, group:'Logs'        },
  { k:'qa',            l:'Quality Assurance',     icon:I.qa,       group:'Logs'        },
  { k:'notifications', l:'Notifications',         icon:I.bell,     group:'Dev'         },
  { k:'reports',       l:'Reports',               icon:I.report,   group:'Dev'         },
  { k:'statusBadges',  l:'Status Badges',         icon:I.check,    group:'Dev'         },
  { k:'empty',         l:'Empty States',          icon:I.fraud,    group:'Dev'         },
  { k:'loading',       l:'Loading States',        icon:I.refresh,  group:'Dev'         },
  { k:'error',         l:'Error States',          icon:I.alert,    group:'Dev'         },
  { k:'success',       l:'Success States',        icon:I.check,    group:'Dev'         },
]

// ─── Trust Center Home ────────────────────────────────────────────────────────
function TrustHome({ onNav, onToast }:{ onNav:(s:SubView)=>void; onToast:(m:string)=>void }) {
  const kpis = [
    { l:'Pending Identity',   v:'18', c:C.warning,  sub:'Awaiting review'     },
    { l:'Document Reviews',   v:'12', c:C.info,     sub:'In progress'         },
    { l:'Approved Today',     v:'7',  c:C.success,  sub:'Fully verified'      },
    { l:'Rejected Today',     v:'2',  c:C.error,    sub:'Documents declined'  },
    { l:'Expiring Certs',     v:'7',  c:'#F97316',  sub:'Within 60 days'      },
    { l:'Fraud Alerts',       v:'3',  c:'#DC2626',  sub:'Requires action'     },
    { l:'Compliance Violations',v:'1',c:C.error,    sub:'Critical'            },
    { l:'Avg Review Time',    v:'4.2h',c:C.primary, sub:'Last 7 days'         },
  ]
  const recentDecisions = [
    { id:'RP-VER-2026-00141', name:'Nirosha J.',      action:'Approved',          reviewer:'Ranjith B.', time:'12 min ago', c:C.success },
    { id:'RP-VER-2026-00140', name:'Priya Fernando',  action:'Rejected — Expired NIC', reviewer:'Amara S.',   time:'34 min ago', c:C.error   },
    { id:'RP-VER-2026-00139', name:'Suresh Perera',   action:'Escalated — Risk 42',    reviewer:'Thilina S.', time:'1 hr ago',   c:'#F97316' },
    { id:'RP-VER-2026-00138', name:'Sampath J.',      action:'Requested resubmission', reviewer:'Ranjith B.', time:'2 hrs ago',  c:C.warning },
    { id:'RP-VER-2026-00137', name:'Chamari W.',      action:'Under review assigned',  reviewer:'Amara S.',   time:'3 hrs ago',  c:C.primary },
  ]
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      {/* Fraud banner */}
      <div style={{ padding:'13px 20px', borderRadius:12, background:`#DC262608`, border:`1.5px solid #DC262630`, marginBottom:18, display:'flex', gap:12, alignItems:'center' }}>
        <div style={{ width:8, height:8, borderRadius:'50%', background:'#DC2626', animation:'pulse-dot 1s ease-in-out infinite', flexShrink:0 }}/>
        <div style={{ flex:1 }}>
          <p style={{ fontSize:13, fontWeight:800, color:'#DC2626', fontFamily:'Manrope,sans-serif' }}>3 Fraud Alerts Detected — Immediate Review Required</p>
          <p style={{ fontSize:11, color:C.sub }}>Duplicate account detected · Suspicious document submission · Location mismatch flagged</p>
        </div>
        <Btn label="View Alerts" variant="danger" small onClick={()=>onNav('fraud')} />
      </div>
      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }} className="tc-4col">
        {kpis.map((k,i)=>(
          <Card key={i} hover style={{ padding:18 }}>
            <p style={{ fontSize:10, color:C.muted, marginBottom:8 }}>{k.l}</p>
            <p style={{ fontSize:28, fontWeight:900, color:k.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{k.v}</p>
            <p style={{ fontSize:10, color:C.muted }}>{k.sub}</p>
          </Card>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:16 }} className="tc-main-split">
        {/* Recent decisions */}
        <Card style={{ padding:20 }}>
          <SectionTitle title="Recent Decisions" action="Full Queue" onAction={()=>onNav('queue')} />
          {recentDecisions.map((d,i)=>(
            <div key={i} style={{ display:'flex', gap:12, padding:'9px 0', borderBottom:i<recentDecisions.length-1?`1px solid ${C.border}`:'none' }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:d.c, flexShrink:0, marginTop:4 }}/>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:1 }}>
                  <p style={{ fontSize:11, fontWeight:700, color:C.type }}>{d.id}</p>
                  <p style={{ fontSize:10, color:C.muted }}>· {d.name}</p>
                </div>
                <p style={{ fontSize:11, color:d.c, fontWeight:600 }}>{d.action}</p>
                <p style={{ fontSize:9, color:C.muted }}>by {d.reviewer} · {d.time}</p>
              </div>
            </div>
          ))}
        </Card>
        {/* Right */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {/* Trust summary ring */}
          <Card style={{ padding:20, display:'flex', gap:16, alignItems:'center' }}>
            <TrustRing score={94} size={90} label="Platform" />
            <div>
              <p style={{ fontSize:13, fontWeight:800, color:C.type, marginBottom:6 }}>Platform Trust Score</p>
              {[{l:'Verified agents',v:'94.3%',c:C.success},{l:'Active fraud flags',v:'0.08%',c:C.error},{l:'SLA compliance',v:'97.1%',c:C.primary}].map((s,i)=>(
                <div key={i} style={{ display:'flex', justifyContent:'space-between', gap:16, marginBottom:4 }}>
                  <p style={{ fontSize:11, color:C.muted }}>{s.l}</p>
                  <p style={{ fontSize:11, fontWeight:700, color:s.c }}>{s.v}</p>
                </div>
              ))}
            </div>
          </Card>
          {/* Quick actions */}
          <Card style={{ padding:20 }}>
            <SectionTitle title="Quick Actions" />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {[{l:'Review Queue',cb:()=>onNav('queue')},{l:'Fraud Center',cb:()=>onNav('fraud')},{l:'Doc Review',cb:()=>onNav('docReview')},{l:'Expiry List',cb:()=>onNav('expiry')},{l:'Compliance',cb:()=>onNav('compliance')},{l:'Reports',cb:()=>onNav('reports')}].map((a,i)=>(
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

// ─── Verification Queue ───────────────────────────────────────────────────────
function VerificationQueue({ onNav, onToast }:{ onNav:(s:SubView)=>void; onToast:(m:string)=>void }) {
  const [q, setQ] = useState('')
  const [stageF, setStageF] = useState('all')
  const filtered = QUEUE.filter(r =>
    (stageF==='all'||r.status===stageF) &&
    (r.name.toLowerCase().includes(q.toLowerCase())||r.id.includes(q))
  )
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Verification Queue</h2>
        <div style={{ display:'flex', gap:8 }}>
          <Btn label="Auto-Assign" variant="secondary" small onClick={()=>onToast('Auto-assigning reviewers…')} />
          <Btn label="Export" variant="secondary" small icon={I.download} onClick={()=>onToast('Exporting…')} />
        </div>
      </div>
      <Card style={{ padding:14, marginBottom:14 }}>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' as const, alignItems:'center' }}>
          <div style={{ display:'flex', gap:8, alignItems:'center', flex:1, minWidth:180, padding:'8px 12px', borderRadius:9, border:`1px solid ${C.border}`, background:'#FAFAFA' }}>
            <span style={{ display:'flex', color:C.muted }}>{I.eye}</span>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name or application ID…" style={{ border:'none', background:'transparent', fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, outline:'none', flex:1 }} />
          </div>
          <div style={{ display:'flex', gap:5, flexWrap:'wrap' as const }}>
            {['all','pending','underreview','awaiting','escalated','approved'].map(f=>(
              <button key={f} onClick={()=>setStageF(f)}
                style={{ padding:'6px 12px', borderRadius:99, border:`1.5px solid ${stageF===f?C.primary:C.border}`, background:stageF===f?`${C.primary}08`:'#FAFAFA', cursor:'pointer', fontSize:10, fontWeight:700, color:stageF===f?C.primary:C.muted, fontFamily:'Manrope,sans-serif' }}>
                {VSTATUS[f]?.label||'All'}
              </button>
            ))}
          </div>
        </div>
      </Card>
      <Card style={{ overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'130px 160px 100px 120px 130px 80px 80px 110px 100px 130px', padding:'10px 14px', background:'#FAFAFA', borderBottom:`1px solid ${C.border}`, minWidth:1000 }}>
          {['App ID','Applicant','Type','Submitted','Stage','Priority','Risk','Reviewer','Status','Actions'].map((h,i)=>(
            <p key={i} style={{ fontSize:9, fontWeight:800, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.06em', paddingInline:4 }}>{h}</p>
          ))}
        </div>
        <div style={{ overflowX:'auto' }}>
          {filtered.map((r,i)=>(
            <div key={r.id}
              onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='#FAFBFB'}
              onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}
              style={{ display:'grid', gridTemplateColumns:'130px 160px 100px 120px 130px 80px 80px 110px 100px 130px', padding:'11px 14px', borderBottom:i<filtered.length-1?`1px solid ${C.border}`:'none', transition:'background 0.12s', minWidth:1000 }}>
              <p style={{ fontSize:11, fontWeight:700, color:C.primary, paddingInline:4, display:'flex', alignItems:'center' }}>{r.id.split('-').slice(-1)[0]}</p>
              <div style={{ paddingInline:4, display:'flex', alignItems:'center', gap:8 }}>
                <UA name={r.name} size={26} color={C.primary} />
                <p style={{ fontSize:11, color:C.type, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as const }}>{r.name}</p>
              </div>
              <div style={{ paddingInline:4, display:'flex', alignItems:'center' }}><Bdg label={r.type} color={C.accent} /></div>
              <p style={{ fontSize:10, color:C.muted, paddingInline:4, display:'flex', alignItems:'center' }}>{r.submitted}</p>
              <p style={{ fontSize:10, color:C.sub, paddingInline:4, display:'flex', alignItems:'center' }}>{r.stage}</p>
              <div style={{ paddingInline:4, display:'flex', alignItems:'center' }}>
                <Bdg label={r.priority.toUpperCase()} color={r.priority==='urgent'?'#DC2626':r.priority==='high'?C.error:r.priority==='medium'?C.warning:C.success} />
              </div>
              <div style={{ paddingInline:4, display:'flex', alignItems:'center' }}>
                <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                  <div style={{ width:28, height:5, borderRadius:99, background:C.border, overflow:'hidden' }}>
                    <div style={{ width:`${r.risk}%`, height:'100%', background:r.risk>35?C.error:r.risk>20?C.warning:C.success, borderRadius:99 }}/>
                  </div>
                  <p style={{ fontSize:9, fontWeight:700, color:r.risk>35?C.error:r.risk>20?C.warning:C.success }}>{r.risk}</p>
                </div>
              </div>
              <p style={{ fontSize:10, color:C.sub, paddingInline:4, display:'flex', alignItems:'center' }}>{r.reviewer}</p>
              <div style={{ paddingInline:4, display:'flex', alignItems:'center' }}><VSBdg status={r.status} /></div>
              <div style={{ paddingInline:4, display:'flex', gap:4, alignItems:'center' }}>
                <button onClick={()=>{ onNav('appDetail'); onToast(`Reviewing ${r.id}`) }} style={{ background:'none', border:'none', cursor:'pointer', color:C.primary, display:'flex', padding:3 }}>{I.eye}</button>
                {r.status!=='approved'&&<button onClick={()=>onToast(`Approving ${r.id}`)} style={{ background:'none', border:'none', cursor:'pointer', color:C.success, display:'flex', padding:3 }}>{I.check}</button>}
                {r.status!=='rejected'&&<button onClick={()=>onToast(`Rejecting ${r.id}`)} style={{ background:'none', border:'none', cursor:'pointer', color:C.error, display:'flex', padding:3 }}>{I.fraud}</button>}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Application Details ──────────────────────────────────────────────────────
function ApplicationDetails({ onToast }:{ onToast:(m:string)=>void }) {
  const app = QUEUE[0]
  const timeline = [
    { l:'Application Submitted', d:'Kasun Perera applied as Care Agent',     time:'20 Jan 09:12', done:true  },
    { l:'Reviewer Assigned',     d:'Ranjith Bandara assigned',                time:'20 Jan 10:00', done:true  },
    { l:'Identity Check',        d:'NIC matched · OCR confidence 98.4%',     time:'20 Jan 11:30', done:true  },
    { l:'Document Review',       d:'3 of 5 documents approved',              time:'20 Jan 14:15', done:true  },
    { l:'Background Check',      d:'Police clearance valid · Medical pending',time:'21 Jan 09:00', done:true  },
    { l:'Final Review',          d:'Pending reviewer decision',               time:'Now',          done:false },
    { l:'Decision',              d:'Awaiting',                               time:'-',            done:false },
  ]
  return (
    <div style={{ maxWidth:920, margin:'0 auto', padding:'20px 24px 60px' }}>
      {/* Hero */}
      <Card style={{ padding:24, marginBottom:16, background:`linear-gradient(135deg,${C.primary}08,${C.primary}02)`, border:`1.5px solid ${C.primary}20` }}>
        <div style={{ display:'flex', gap:18, alignItems:'flex-start' }}>
          <UA name={app.name} size={64} color={C.primary} />
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:6, flexWrap:'wrap' as const }}>
              <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>{app.name}</h2>
              <VSBdg status={app.status} />
              <Bdg label={app.priority.toUpperCase()} color={app.priority==='urgent'?'#DC2626':C.error} />
            </div>
            <p style={{ fontSize:12, color:C.primary, fontWeight:700, marginBottom:4 }}>{app.id}</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginTop:10 }}>
              {[{l:'Type',v:app.type},{l:'Submitted',v:app.submitted},{l:'Stage',v:app.stage},{l:'Reviewer',v:app.reviewer}].map((r,i)=>(
                <div key={i}>
                  <p style={{ fontSize:9, color:C.muted, marginBottom:2 }}>{r.l}</p>
                  <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{r.v}</p>
                </div>
              ))}
            </div>
          </div>
          <TrustRing score={88} size={80} label="Trust" />
        </div>
      </Card>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }} className="tc-2col">
        {/* Identity details */}
        <Card style={{ padding:20 }}>
          <SectionTitle title="Identity Details" />
          {[{l:'Full Name',v:'Kasun Indika Perera'},{l:'NIC Number',v:'9823XXXX1234V'},{l:'Date of Birth',v:'15 Mar 1988'},{l:'Address',v:'45/A Galle Road, Colombo 06'},{l:'Phone',v:'+94 71 987 6543'},{l:'Email',v:'kasun.p@email.com'}].map((r,i)=>(
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:i<5?`1px solid ${C.border}`:'none' }}>
              <p style={{ fontSize:11, color:C.muted }}>{r.l}</p>
              <p style={{ fontSize:11, fontWeight:600, color:C.type }}>{r.v}</p>
            </div>
          ))}
        </Card>
        {/* Risk assessment */}
        <Card style={{ padding:20 }}>
          <SectionTitle title="Risk Assessment" />
          {[{l:'Identity Match',v:'98.4%',c:C.success},{l:'Document Quality',v:'94.1%',c:C.success},{l:'Background Score',v:'Clear',c:C.success},{l:'Fraud Probability',v:'Low (2.1%)',c:C.success},{l:'Overall Risk',v:'Low (8/100)',c:C.success}].map((s,i)=>(
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:i<4?`1px solid ${C.border}`:'none' }}>
              <p style={{ fontSize:11, color:C.muted }}>{s.l}</p>
              <p style={{ fontSize:11, fontWeight:700, color:s.c }}>{s.v}</p>
            </div>
          ))}
        </Card>
      </div>
      {/* Timeline */}
      <Card style={{ padding:22, marginBottom:14 }}>
        <SectionTitle title="Verification Timeline" />
        <div style={{ position:'relative' as const, paddingLeft:28 }}>
          <div style={{ position:'absolute', left:9, top:0, bottom:0, width:2, background:C.border }}/>
          {timeline.map((s,i)=>(
            <div key={i} style={{ position:'relative' as const, marginBottom:i<timeline.length-1?16:0, display:'flex', gap:12 }}>
              <div style={{ position:'absolute', left:-19, width:16, height:16, borderRadius:'50%', background:s.done?C.success:C.border, display:'flex', alignItems:'center', justifyContent:'center', top:2, border:`2px solid ${C.surface}` }}>
                {s.done&&<span style={{ display:'flex', color:'white', transform:'scale(0.6)' }}>{I.check}</span>}
              </div>
              <div>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <p style={{ fontSize:12, fontWeight:700, color:s.done?C.type:C.muted }}>{s.l}</p>
                  <p style={{ fontSize:9, color:C.muted }}>{s.time}</p>
                </div>
                <p style={{ fontSize:11, color:C.muted }}>{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
      {/* Decision panel */}
      <Card style={{ padding:22, border:`1.5px solid ${C.primary}20`, background:`${C.primary}03` }}>
        <SectionTitle title="Decision Panel" />
        <textarea placeholder="Reviewer notes — document your decision rationale…" rows={3}
          style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, background:'#FAFAFA', outline:'none', resize:'none', boxSizing:'border-box' as const, marginBottom:12 }} />
        <div style={{ display:'flex', gap:8 }}>
          <Btn label="Approve Application" variant="success" icon={I.check} onClick={()=>onToast('Application approved!')} />
          <Btn label="Reject Application" variant="danger" icon={I.fraud} onClick={()=>onToast('Application rejected')} />
          <Btn label="Request Documents" variant="warning" onClick={()=>onToast('Document request sent')} />
          <Btn label="Escalate" variant="secondary" icon={I.alert} onClick={()=>onToast('Case escalated')} />
        </div>
      </Card>
    </div>
  )
}

// ─── Document Review Center ───────────────────────────────────────────────────
function DocumentReview({ onToast }:{ onToast:(m:string)=>void }) {
  const docs = [
    { t:'NIC Front',              status:'approved', quality:96, note:'Clear scan, data readable' },
    { t:'NIC Back',               status:'approved', quality:94, note:'Clear scan, all fields visible' },
    { t:'Police Clearance',       status:'approved', quality:98, note:'Issued 15 Jan 2026, valid' },
    { t:'Medical Certificate',    status:'pending',  quality:88, note:'Awaiting lab signature verification' },
    { t:'Caregiving Certificate', status:'approved', quality:92, note:'SLNCP certified, valid 2 yrs' },
    { t:'CPR Certificate',        status:'pending',  quality:82, note:'Expiry date partially obscured' },
    { t:'First Aid Certificate',  status:'rejected', quality:45, note:'Low resolution — resubmission required' },
    { t:'Professional Reference', status:'awaiting', quality:0,  note:'Not yet submitted' },
  ]
  const statusColor = (s:string) => s==='approved'?C.success:s==='rejected'?C.error:s==='pending'?C.warning:C.muted
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Document Review Center</h2>
        <p style={{ fontSize:12, color:C.muted }}>RP-VER-2026-00142 — Kasun Perera</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }} className="tc-3col">
        {docs.map((d,i)=>(
          <Card key={i} style={{ padding:0, overflow:'hidden', border:`1.5px solid ${statusColor(d.status)}25` }}>
            {/* Document preview area */}
            <div style={{ height:120, background:`linear-gradient(135deg,${statusColor(d.status)}08,${C.bg})`, display:'flex', alignItems:'center', justifyContent:'center', borderBottom:`1px solid ${C.border}`, position:'relative' as const }}>
              <span style={{ display:'flex', color:`${statusColor(d.status)}60`, transform:'scale(3)' }}>{I.doc}</span>
              <div style={{ position:'absolute', top:8, right:8 }}>
                <Bdg label={d.status.charAt(0).toUpperCase()+d.status.slice(1)} color={statusColor(d.status)} dot />
              </div>
              {d.quality>0&&(
                <div style={{ position:'absolute', bottom:8, left:8, display:'flex', gap:4, alignItems:'center', padding:'3px 8px', borderRadius:8, background:'rgba(0,0,0,0.5)' }}>
                  <p style={{ fontSize:9, color:'white', fontWeight:700 }}>Quality: {d.quality}%</p>
                </div>
              )}
            </div>
            <div style={{ padding:14 }}>
              <p style={{ fontSize:12, fontWeight:700, color:C.type, marginBottom:4 }}>{d.t}</p>
              <p style={{ fontSize:10, color:C.muted, lineHeight:1.5, marginBottom:10 }}>{d.note}</p>
              {d.quality>0&&(
                <div style={{ height:4, borderRadius:99, background:`${statusColor(d.status)}15`, marginBottom:10 }}>
                  <div style={{ width:`${d.quality}%`, height:'100%', background:statusColor(d.status), borderRadius:99 }}/>
                </div>
              )}
              <div style={{ display:'flex', gap:5, flexWrap:'wrap' as const }}>
                {d.status!=='awaiting'&&<Btn label="Preview" variant="ghost" small icon={I.eye} onClick={()=>onToast(`Previewing ${d.t}…`)} />}
                {d.status==='pending'&&<Btn label="Approve" variant="success" small onClick={()=>onToast(`${d.t} approved`)} />}
                {d.status==='pending'&&<Btn label="Reject" variant="danger" small onClick={()=>onToast(`${d.t} rejected`)} />}
                {d.status==='rejected'&&<Btn label="Request Resubmission" variant="warning" small onClick={()=>onToast('Resubmission requested')} />}
                {d.status==='approved'&&<Btn label="Download" variant="secondary" small icon={I.download} onClick={()=>onToast('Downloading…')} />}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Identity Verification ────────────────────────────────────────────────────
function IdentityVerification({ onToast }:{ onToast:(m:string)=>void }) {
  const fields = [
    { l:'Full Name',   extracted:'Kasun Indika Perera',  match:true  },
    { l:'NIC Number',  extracted:'982319301234V',         match:true  },
    { l:'DOB',         extracted:'15-03-1988',            match:true  },
    { l:'Address',     extracted:'Colombo 06',            match:true  },
    { l:'Expiry',      extracted:'15-03-2028',            match:true  },
  ]
  return (
    <div style={{ maxWidth:860, margin:'0 auto', padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>Identity Verification</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14, marginBottom:18 }} className="tc-3col">
        {[{t:'Identity Match',   v:'98.4%', c:C.success, sub:'NIC data matched'},{t:'Face Match',       v:'Placeholder', c:C.muted,   sub:'Biometric not required'},{t:'Confidence Score', v:'High', c:C.success, sub:'OCR + manual verified'}].map((s,i)=>(
          <Card key={i} style={{ padding:20, textAlign:'center' as const }}>
            <p style={{ fontSize:24, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:6 }}>{s.v}</p>
            <p style={{ fontSize:12, fontWeight:700, color:C.type, marginBottom:3 }}>{s.t}</p>
            <p style={{ fontSize:10, color:C.muted }}>{s.sub}</p>
          </Card>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="tc-2col">
        {/* OCR extracted data */}
        <Card style={{ padding:22 }}>
          <SectionTitle title="OCR Extracted Data" />
          {fields.map((f,i)=>(
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:i<fields.length-1?`1px solid ${C.border}`:'none' }}>
              <p style={{ fontSize:11, color:C.muted }}>{f.l}</p>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <p style={{ fontSize:11, fontWeight:600, color:C.type }}>{f.extracted}</p>
                <span style={{ color:f.match?C.success:C.error, display:'flex', transform:'scale(0.85)' }}>{f.match?I.check:I.fraud}</span>
              </div>
            </div>
          ))}
        </Card>
        {/* Manual review */}
        <Card style={{ padding:22 }}>
          <SectionTitle title="Manual Review" />
          <div style={{ padding:'12px 16px', borderRadius:10, background:`${C.success}06`, border:`1px solid ${C.success}20`, marginBottom:14 }}>
            <p style={{ fontSize:11, fontWeight:700, color:C.success, marginBottom:4 }}>Identity Confirmed</p>
            <p style={{ fontSize:11, color:C.sub }}>Ranjith Bandara · 20 Jan 2026 14:15 · Physical NIC cross-verified against uploaded scan. All data fields match.</p>
          </div>
          <SectionTitle title="Verification Timeline" />
          {[{l:'OCR Scan Complete',t:'20 Jan 11:20',c:C.success},{l:'Database Cross-Check',t:'20 Jan 11:21',c:C.success},{l:'Manual Spot Check',t:'20 Jan 14:15',c:C.success}].map((ev,i)=>(
            <div key={i} style={{ display:'flex', gap:8, padding:'6px 0', borderBottom:i<2?`1px solid ${C.border}`:'none' }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:ev.c, flexShrink:0, marginTop:5 }}/>
              <div>
                <p style={{ fontSize:11, fontWeight:600, color:C.type }}>{ev.l}</p>
                <p style={{ fontSize:9, color:C.muted }}>{ev.t}</p>
              </div>
            </div>
          ))}
          <div style={{ marginTop:14 }}>
            <Btn label="Override Manually" variant="secondary" small full onClick={()=>onToast('Manual override panel…')} />
          </div>
        </Card>
      </div>
    </div>
  )
}

// ─── Background Checks ────────────────────────────────────────────────────────
function BackgroundChecks({ onToast }:{ onToast:(m:string)=>void }) {
  const checks = [
    { l:'Police Clearance',           status:'clear',   issued:'15 Jan 2026', expiry:'15 Jan 2027', note:'No criminal record on file'         },
    { l:'Medical Fitness',            status:'clear',   issued:'10 Jan 2026', expiry:'10 Jul 2026',  note:'Fit for caregiving duties'          },
    { l:'Professional Reference 1',   status:'clear',   issued:'05 Jan 2026', expiry:'N/A',          note:'Dr. Perera, NHSL — positive ref'    },
    { l:'Professional Reference 2',   status:'pending', issued:'-',           expiry:'-',            note:'Awaiting response from referee'     },
    { l:'Employment Verification',    status:'clear',   issued:'08 Jan 2026', expiry:'N/A',          note:'3 years at Colombo Care Services'   },
    { l:'Certification Verification', status:'clear',   issued:'01 Jan 2026', expiry:'N/A',          note:'SLNCP registration confirmed valid' },
  ]
  const sc = (s:string) => s==='clear'?C.success:s==='pending'?C.warning:C.error
  return (
    <div style={{ maxWidth:780, margin:'0 auto', padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Background Checks</h2>
        <Bdg label="Kasun Perera — RP-VER-2026-00142" color={C.primary} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:18 }}>
        {[{l:'Checks Cleared',v:'5/6',c:C.success},{l:'Pending',v:'1',c:C.warning},{l:'Overall Status',v:'Conditional',c:C.warning}].map((s,i)=>(
          <Card key={i} style={{ padding:16, textAlign:'center' as const }}>
            <p style={{ fontSize:24, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{s.v}</p>
            <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      <Card style={{ padding:0, overflow:'hidden' }}>
        {checks.map((ch,i)=>(
          <div key={i} style={{ display:'flex', gap:14, padding:'14px 20px', borderBottom:i<checks.length-1?`1px solid ${C.border}`:'none', alignItems:'flex-start' }}>
            <div style={{ width:32, height:32, borderRadius:10, background:`${sc(ch.status)}12`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ display:'flex', color:sc(ch.status), transform:'scale(0.85)' }}>{ch.status==='clear'?I.check:ch.status==='pending'?I.clock:I.fraud}</span>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:3 }}>
                <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{ch.l}</p>
                <Bdg label={ch.status.charAt(0).toUpperCase()+ch.status.slice(1)} color={sc(ch.status)} dot />
              </div>
              <p style={{ fontSize:11, color:C.muted, marginBottom:2 }}>{ch.note}</p>
              {ch.issued!=='-'&&<p style={{ fontSize:10, color:C.muted }}>Issued: {ch.issued}{ch.expiry!=='N/A'?` · Expires: ${ch.expiry}`:''}</p>}
            </div>
            {ch.status==='pending'&&<Btn label="Follow Up" variant="warning" small onClick={()=>onToast('Following up…')} />}
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── Certification Management ─────────────────────────────────────────────────
function CertificationMgmt({ onToast }:{ onToast:(m:string)=>void }) {
  const sc = (s:string) => s==='valid'?C.success:s==='expiring'?C.warning:s==='urgent'?C.error:C.error
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Certification Management</h2>
        <Btn label="Send All Reminders" variant="warning" small onClick={()=>onToast('Reminders sent to all expiring agents')} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }} className="tc-4col">
        {[{l:'Valid',v:'847',c:C.success},{l:'Expiring 30d',v:'5',c:C.warning},{l:'Expiring 60d',v:'12',c:'#F97316'},{l:'Expired',v:'3',c:C.error}].map((s,i)=>(
          <Card key={i} style={{ padding:16, textAlign:'center' as const }}>
            <p style={{ fontSize:26, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{s.v}</p>
            <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      <Card style={{ overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'160px 200px 120px 120px 90px 90px 120px', padding:'10px 16px', background:'#FAFAFA', borderBottom:`1px solid ${C.border}` }}>
          {['Agent','Certificate','Issued','Expiry','Days Left','Status','Actions'].map((h,i)=>(
            <p key={i} style={{ fontSize:9, fontWeight:800, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.06em', paddingInline:4 }}>{h}</p>
          ))}
        </div>
        {CERTS.map((c,i)=>(
          <div key={i}
            onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='#FAFBFB'}
            onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}
            style={{ display:'grid', gridTemplateColumns:'160px 200px 120px 120px 90px 90px 120px', padding:'11px 16px', borderBottom:i<CERTS.length-1?`1px solid ${C.border}`:'none', transition:'background 0.12s' }}>
            <p style={{ fontSize:11, fontWeight:700, color:C.type, paddingInline:4, display:'flex', alignItems:'center' }}>{c.name}</p>
            <p style={{ fontSize:11, color:C.sub, paddingInline:4, display:'flex', alignItems:'center' }}>{c.cert}</p>
            <p style={{ fontSize:10, color:C.muted, paddingInline:4, display:'flex', alignItems:'center' }}>{c.issued}</p>
            <p style={{ fontSize:10, color:C.muted, paddingInline:4, display:'flex', alignItems:'center' }}>{c.expiry}</p>
            <div style={{ paddingInline:4, display:'flex', alignItems:'center' }}>
              <p style={{ fontSize:11, fontWeight:700, color:sc(c.status) }}>{c.daysLeft<0?`${Math.abs(c.daysLeft)}d ago`:`${c.daysLeft}d`}</p>
            </div>
            <div style={{ paddingInline:4, display:'flex', alignItems:'center' }}>
              <Bdg label={c.status.charAt(0).toUpperCase()+c.status.slice(1)} color={sc(c.status)} dot />
            </div>
            <div style={{ paddingInline:4, display:'flex', gap:4, alignItems:'center' }}>
              {c.status!=='valid'&&<Btn label="Remind" variant="warning" small onClick={()=>onToast(`Reminder sent to ${c.name}`)} />}
              {c.status==='expired'&&<Btn label="Suspend" variant="danger" small onClick={()=>onToast(`${c.name} suspended`)} />}
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── Compliance Dashboard ─────────────────────────────────────────────────────
function ComplianceDashboard() {
  const metrics = [
    { l:'Overall Compliance Score',   v:'94.7%', target:'> 98%', pct:95, c:C.warning },
    { l:'Verification Approval Rate', v:'87.3%', target:'> 90%', pct:87, c:C.warning },
    { l:'Avg Verification Time',      v:'4.2 hrs',target:'< 6 hrs',pct:70,c:C.success},
    { l:'Document Quality Avg',       v:'91.4%', target:'> 85%', pct:91, c:C.success },
    { l:'Expired Documents',          v:'3',     target:'0',      pct:10, c:C.error   },
    { l:'Pending Renewals',           v:'12',    target:'< 5',    pct:40, c:C.warning },
  ]
  const trend = [82,85,87,88,91,93,94,95,93,94,94,95]
  const maxT = Math.max(...trend)
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>Compliance Dashboard</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:18 }} className="tc-3col">
        {[{l:'Compliance Score',v:'94.7%',c:C.warning},{l:'Violations',v:'1',c:C.error},{l:'Rejected Apps',v:'7',c:C.error}].map((s,i)=>(
          <Card key={i} style={{ padding:18, textAlign:'center' as const }}>
            <p style={{ fontSize:28, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{s.v}</p>
            <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:14 }} className="tc-main-split">
        <Card style={{ padding:22 }}>
          <SectionTitle title="Compliance Metrics" />
          {metrics.map((m,i)=>(
            <div key={i} style={{ marginBottom:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                <p style={{ fontSize:11, fontWeight:600, color:C.type }}>{m.l}</p>
                <div style={{ display:'flex', gap:8 }}>
                  <p style={{ fontSize:12, fontWeight:900, color:m.c }}>{m.v}</p>
                  <p style={{ fontSize:10, color:C.muted }}>Target {m.target}</p>
                </div>
              </div>
              <div style={{ height:6, borderRadius:99, background:`${m.c}12` }}>
                <div style={{ width:`${m.pct}%`, height:'100%', background:m.c, borderRadius:99 }}/>
              </div>
            </div>
          ))}
        </Card>
        <Card style={{ padding:22 }}>
          <SectionTitle title="Compliance Trend (12 months)" />
          <svg width="100%" height="140" viewBox="0 0 280 140" preserveAspectRatio="none">
            <defs>
              <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.primary} stopOpacity="0.15"/>
                <stop offset="100%" stopColor={C.primary} stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d={`M${trend.map((v,i)=>`${i*(280/11)},${130-((v/maxT)*110)}`).join('L')} L${280},130 L0,130 Z`} fill="url(#compGrad)"/>
            <polyline points={trend.map((v,i)=>`${i*(280/11)},${130-((v/maxT)*110)}`).join(' ')} fill="none" stroke={C.primary} strokeWidth="2.5" strokeLinejoin="round"/>
            {trend.map((v,i)=>(
              <circle key={i} cx={i*(280/11)} cy={130-((v/maxT)*110)} r="3" fill={C.primary}/>
            ))}
          </svg>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:8 }}>
            <p style={{ fontSize:9, color:C.muted }}>Jan 2025</p>
            <p style={{ fontSize:9, color:C.muted }}>Jan 2026</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

// ─── Fraud Detection ──────────────────────────────────────────────────────────
function FraudDetection({ onToast }:{ onToast:(m:string)=>void }) {
  const alerts = [
    { type:'Duplicate Account',      user:'Suresh Perera / Suresh P.',   risk:88, desc:'Same NIC submitted under two different names. Registration IPs match.',        status:'open'      },
    { type:'Suspicious Document',    user:'Priya Fernando',               risk:72, desc:'Police clearance shows signs of digital alteration on the date field.',        status:'open'      },
    { type:'Multiple Failed Attempts',user:'Unknown applicant',           risk:65, desc:'6 failed verification attempts in 2 hours from IP 196.44.x.x.',               status:'monitoring'},
  ]
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Fraud Detection Center</h2>
        <Bdg label={`${alerts.length} active alerts`} color='#DC2626' dot />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }} className="tc-4col">
        {[{l:'Duplicate Accounts',v:'1',c:'#DC2626'},{l:'Suspicious Docs',v:'1',c:C.error},{l:'Failed Attempts',v:'1',c:C.warning},{l:'High Risk Users',v:'3',c:C.error}].map((s,i)=>(
          <Card key={i} style={{ padding:16, textAlign:'center' as const, border:`1.5px solid ${s.c}25` }}>
            <p style={{ fontSize:24, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{s.v}</p>
            <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      {alerts.map((a,i)=>(
        <Card key={i} style={{ padding:22, marginBottom:12, border:`1.5px solid ${a.risk>80?'#DC2626':'#F9731630'}`, background:a.risk>80?'#DC262604':'#F9731603' }}>
          <div style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
            <div style={{ width:44, height:44, borderRadius:14, background:`${a.risk>80?'#DC2626':C.warning}12`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ display:'flex', color:a.risk>80?'#DC2626':C.warning, transform:'scale(1.3)' }}>{I.fraud}</span>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                <p style={{ fontSize:13, fontWeight:800, color:C.type }}>{a.type}</p>
                <div style={{ display:'flex', alignItems:'center', gap:4, padding:'2px 8px', borderRadius:99, background:`${a.risk>80?'#DC2626':C.warning}15` }}>
                  <p style={{ fontSize:10, fontWeight:700, color:a.risk>80?'#DC2626':C.warning }}>Risk {a.risk}/100</p>
                </div>
                <Bdg label={a.status.charAt(0).toUpperCase()+a.status.slice(1)} color={a.status==='open'?'#DC2626':C.warning} dot />
              </div>
              <p style={{ fontSize:11, color:C.sub, marginBottom:6 }}>User: <strong style={{color:C.type}}>{a.user}</strong></p>
              <p style={{ fontSize:11, color:C.muted, lineHeight:1.6 }}>{a.desc}</p>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              <Btn label="Investigate" variant="danger" small onClick={()=>onToast('Opening investigation…')} />
              <Btn label="Dismiss" variant="ghost" small onClick={()=>onToast('Alert dismissed')} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Trust Score ──────────────────────────────────────────────────────────────
function TrustScoreView() {
  const scores = [
    { l:'Identity Score',    v:98, c:C.success, note:'NIC verified, face match passed' },
    { l:'Document Score',    v:92, c:C.success, note:'6/7 documents approved'          },
    { l:'Background Score',  v:96, c:C.success, note:'Police clearance clear'           },
    { l:'Experience Score',  v:94, c:C.success, note:'3 yrs professional experience'   },
    { l:'Review Score',      v:100,c:C.success, note:'No complaints on record'         },
  ]
  const overall = Math.round(scores.reduce((a,s)=>a+s.v,0)/scores.length)
  return (
    <div style={{ maxWidth:720, margin:'0 auto', padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Trust Score</h2>
      <p style={{ fontSize:12, color:C.muted, marginBottom:20 }}>Kasun Perera — RP-VER-2026-00142</p>
      <Card style={{ padding:28, display:'flex', gap:28, alignItems:'center', marginBottom:16, background:`linear-gradient(135deg,${C.success}06,${C.primary}04)`, border:`1.5px solid ${C.success}25` }}>
        <TrustRing score={overall} size={140} label="Overall" />
        <div style={{ flex:1 }}>
          <p style={{ fontSize:28, fontWeight:900, color:C.success, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>{overall}/100</p>
          <p style={{ fontSize:14, fontWeight:700, color:C.type, marginBottom:8 }}>Low Risk — Trusted Care Agent</p>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' as const }}>
            <Bdg label="Identity Verified" color={C.success} />
            <Bdg label="Background Clear" color={C.success} />
            <Bdg label="Low Risk" color={C.success} />
            <Bdg label="Certified" color={C.primary} />
          </div>
        </div>
      </Card>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:14 }} className="tc-3col">
        {scores.slice(0,3).map((s,i)=>(
          <Card key={i} style={{ padding:18 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
              <p style={{ fontSize:11, color:C.muted }}>{s.l}</p>
              <p style={{ fontSize:18, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif' }}>{s.v}</p>
            </div>
            <div style={{ height:5, borderRadius:99, background:`${s.c}15`, marginBottom:6 }}>
              <div style={{ width:`${s.v}%`, height:'100%', background:s.c, borderRadius:99 }}/>
            </div>
            <p style={{ fontSize:10, color:C.muted }}>{s.note}</p>
          </Card>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        {scores.slice(3).map((s,i)=>(
          <Card key={i} style={{ padding:18 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
              <p style={{ fontSize:11, color:C.muted }}>{s.l}</p>
              <p style={{ fontSize:18, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif' }}>{s.v}</p>
            </div>
            <div style={{ height:5, borderRadius:99, background:`${s.c}15`, marginBottom:6 }}>
              <div style={{ width:`${s.v}%`, height:'100%', background:s.c, borderRadius:99 }}/>
            </div>
            <p style={{ fontSize:10, color:C.muted }}>{s.note}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Review Workflow ──────────────────────────────────────────────────────────
function ReviewWorkflow({ onToast }:{ onToast:(m:string)=>void }) {
  const stages = [
    { l:'Assigned',           n:42, c:C.primary },
    { l:'Under Review',       n:18, c:C.info    },
    { l:'Awaiting Documents', n:12, c:C.warning },
    { l:'Escalated',          n:3,  c:'#F97316' },
    { l:'Approved',           n:847,c:C.success },
    { l:'Rejected',           n:64, c:C.error   },
    { l:'Archived',           n:212,c:C.muted   },
  ]
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>Review Workflow</h2>
      {/* Stage funnel */}
      <Card style={{ padding:22, marginBottom:16 }}>
        <SectionTitle title="Workflow Pipeline" />
        <div style={{ display:'flex', alignItems:'flex-end', gap:8, height:120, marginBottom:8 }}>
          {stages.map((s,i)=>{
            const maxN = Math.max(...stages.map(x=>x.n))
            const h = Math.max(20,(s.n/maxN)*100)
            return (
              <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                <p style={{ fontSize:10, fontWeight:700, color:s.c }}>{s.n}</p>
                <div style={{ width:'100%', height:h, borderRadius:'6px 6px 0 0', background:`${s.c}20`, border:`1.5px solid ${s.c}40`, display:'flex', alignItems:'flex-end', justifyContent:'center', padding:'0 0 4px' }}/>
              </div>
            )
          })}
        </div>
        <div style={{ display:'flex', gap:8 }}>
          {stages.map((s,i)=>(
            <div key={i} style={{ flex:1, textAlign:'center' as const }}>
              <p style={{ fontSize:8, color:C.muted, lineHeight:1.3 }}>{s.l}</p>
            </div>
          ))}
        </div>
      </Card>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }} className="tc-4col">
        {stages.slice(0,4).map((s,i)=>(
          <Card key={i} hover style={{ padding:18, cursor:'pointer' }} onClick={()=>onToast(`Filtering by ${s.l}`)}>
            <p style={{ fontSize:10, color:C.muted, marginBottom:6 }}>{s.l}</p>
            <p style={{ fontSize:28, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1 }}>{s.n}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Reviewer Workspace ───────────────────────────────────────────────────────
function ReviewerWorkspace({ onToast }:{ onToast:(m:string)=>void }) {
  const [notes, setNotes] = useState('')
  const checklist = [
    { l:'Identity document quality acceptable', done:true  },
    { l:'NIC data matches application form',    done:true  },
    { l:'Face photo matches selfie',            done:true  },
    { l:'Police clearance valid and recent',    done:true  },
    { l:'All required certifications submitted',done:false },
    { l:'Professional references verified',     done:false },
    { l:'No fraud indicators detected',         done:true  },
  ]
  const [checks, setChecks] = useState(checklist)
  return (
    <div style={{ maxWidth:760, margin:'0 auto', padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:20 }}>Reviewer Workspace</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="tc-2col">
        <Card style={{ padding:22 }}>
          <SectionTitle title="Review Checklist" />
          <div style={{ marginBottom:10 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <p style={{ fontSize:10, color:C.muted }}>{checks.filter(c=>c.done).length}/{checks.length} items complete</p>
            </div>
            <div style={{ height:5, borderRadius:99, background:`${C.primary}12`, marginBottom:12 }}>
              <div style={{ width:`${(checks.filter(c=>c.done).length/checks.length)*100}%`, height:'100%', background:C.primary, borderRadius:99, transition:'width 0.3s' }}/>
            </div>
          </div>
          {checks.map((ch,i)=>(
            <div key={i} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom:i<checks.length-1?`1px solid ${C.border}`:'none', alignItems:'center', cursor:'pointer' }}
              onClick={()=>{ const next=[...checks]; next[i]={...next[i],done:!next[i].done}; setChecks(next) }}>
              <div style={{ width:20, height:20, borderRadius:6, border:`2px solid ${ch.done?C.success:C.border}`, background:ch.done?C.success:'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                {ch.done&&<span style={{ display:'flex', color:'white', transform:'scale(0.6)' }}>{I.check}</span>}
              </div>
              <p style={{ fontSize:11, color:ch.done?C.type:C.muted }}>{ch.l}</p>
            </div>
          ))}
        </Card>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <Card style={{ padding:22 }}>
            <SectionTitle title="Decision Notes" />
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Document your review rationale, observations and decision basis…" rows={5}
              style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, background:'#FAFAFA', outline:'none', resize:'none', boxSizing:'border-box' as const }} />
          </Card>
          <Card style={{ padding:22 }}>
            <SectionTitle title="Case Management" />
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              <Btn label="Approve Application" variant="success" icon={I.check} full onClick={()=>onToast('Application approved!')} />
              <Btn label="Reject Application" variant="danger" icon={I.fraud} full onClick={()=>onToast('Application rejected')} />
              <Btn label="Escalate Case" variant="warning" icon={I.alert} full onClick={()=>onToast('Case escalated to senior reviewer')} />
              <Btn label="Assign to Another Reviewer" variant="secondary" full onClick={()=>onToast('Reassigning…')} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ─── Document Expiry Center ───────────────────────────────────────────────────
function DocumentExpiry({ onToast }:{ onToast:(m:string)=>void }) {
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Document Expiry Center</h2>
        <Btn label="Send All Reminders" variant="warning" small onClick={()=>onToast('Bulk reminders sent')} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }} className="tc-4col">
        {[{l:'Expiring 30 Days',v:'5',c:C.error},{l:'Expiring 60 Days',v:'12',c:C.warning},{l:'Expired',v:'3',c:'#DC2626'},{l:'Renewed This Month',v:'8',c:C.success}].map((s,i)=>(
          <Card key={i} style={{ padding:16, textAlign:'center' as const, border:`1.5px solid ${s.c}20` }}>
            <p style={{ fontSize:24, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{s.v}</p>
            <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      {[{heading:'Expiring Within 30 Days',items:CERTS.filter(c=>c.daysLeft>0&&c.daysLeft<=52).slice(0,3),c:C.error},{heading:'Expired',items:CERTS.filter(c=>c.daysLeft<0),c:'#DC2626'}].map((group,gi)=>(
        group.items.length>0&&(
          <Card key={gi} style={{ padding:20, marginBottom:14 }}>
            <SectionTitle title={group.heading} />
            {group.items.map((cert,i)=>(
              <div key={i} style={{ display:'flex', gap:12, padding:'10px 0', borderBottom:i<group.items.length-1?`1px solid ${C.border}`:'none', alignItems:'center' }}>
                <div style={{ width:36, height:36, borderRadius:10, background:`${group.c}10`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <span style={{ display:'flex', color:group.c }}>{I.cert}</span>
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{cert.name}</p>
                  <p style={{ fontSize:11, color:C.muted }}>{cert.cert} · Expires {cert.expiry}</p>
                </div>
                <Bdg label={cert.daysLeft<0?'Expired':`${cert.daysLeft}d left`} color={group.c} dot />
                <div style={{ display:'flex', gap:6 }}>
                  <Btn label="Send Reminder" variant="warning" small onClick={()=>onToast(`Reminder sent to ${cert.name}`)} />
                  {cert.daysLeft<0&&<Btn label="Suspend" variant="danger" small onClick={()=>onToast(`${cert.name} suspended`)} />}
                </div>
              </div>
            ))}
          </Card>
        )
      ))}
    </div>
  )
}

// ─── Audit Trail ─────────────────────────────────────────────────────────────
function AuditTrailView() {
  const entries = [
    { l:'Application Submitted', d:'Kasun Perera submitted RP-VER-2026-00142',  actor:'Applicant',    time:'20 Jan 09:12', c:C.info    },
    { l:'Reviewer Assigned',     d:'Ranjith Bandara assigned by system',         actor:'System',       time:'20 Jan 10:00', c:C.primary },
    { l:'Identity Check Run',    d:'Automated OCR + database match',             actor:'System',       time:'20 Jan 11:20', c:C.primary },
    { l:'Document Approved',     d:'NIC Front approved by Ranjith Bandara',      actor:'Ranjith B.',   time:'20 Jan 14:15', c:C.success },
    { l:'Document Approved',     d:'Police Clearance approved',                  actor:'Ranjith B.',   time:'20 Jan 14:22', c:C.success },
    { l:'Document Rejected',     d:'First Aid Certificate — low resolution',     actor:'Ranjith B.',   time:'20 Jan 14:35', c:C.error   },
    { l:'Resubmission Requested',d:'Agent notified via email and in-app',        actor:'System',       time:'20 Jan 14:36', c:C.warning },
    { l:'Background Check',      d:'Police clearance cross-verified externally', actor:'External API', time:'21 Jan 08:50', c:C.info    },
  ]
  return (
    <div style={{ maxWidth:780, margin:'0 auto', padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:20 }}>Audit Trail</h2>
      <Card style={{ padding:24 }}>
        <div style={{ position:'relative' as const, paddingLeft:30 }}>
          <div style={{ position:'absolute', left:9, top:0, bottom:0, width:2, background:C.border }}/>
          {entries.map((ev,i)=>(
            <div key={i} style={{ position:'relative' as const, marginBottom:i<entries.length-1?18:0 }}>
              <div style={{ position:'absolute', left:-21, width:16, height:16, borderRadius:'50%', background:ev.c, top:2, border:`2px solid ${C.surface}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <div style={{ width:5, height:5, borderRadius:'50%', background:'white' }}/>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div>
                  <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{ev.l}</p>
                  <p style={{ fontSize:11, color:C.muted }}>{ev.d}</p>
                  <p style={{ fontSize:9, color:C.muted, marginTop:2 }}>by {ev.actor}</p>
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

// ─── Appeals Management ───────────────────────────────────────────────────────
function AppealsMgmt({ onToast }:{ onToast:(m:string)=>void }) {
  const appeals = [
    { id:'APP-2026-00018', appId:'RP-VER-2026-00133', name:'Suresh Perera',    reason:'Documents were valid but system flagged incorrectly', status:'pending',  reviewer:'Unassigned', filed:'19 Jan 2026' },
    { id:'APP-2026-00017', appId:'RP-VER-2026-00129', name:'Priya Fernando',   reason:'Medical certificate from approved hospital',          status:'underreview',reviewer:'Thilina S.', filed:'18 Jan 2026' },
  ]
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Appeals Management</h2>
        <Bdg label={`${appeals.length} open appeals`} color={C.warning} dot />
      </div>
      {appeals.map((a,i)=>(
        <Card key={i} hover style={{ padding:22, marginBottom:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
            <div>
              <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:3 }}>
                <p style={{ fontSize:13, fontWeight:700, color:C.primary }}>{a.id}</p>
                <VSBdg status={a.status} />
              </div>
              <p style={{ fontSize:11, color:C.muted }}>{a.appId} · Filed {a.filed}</p>
            </div>
            <UA name={a.name} size={38} color={C.primary} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
            {[{l:'Appellant',v:a.name},{l:'Reviewer',v:a.reviewer}].map((r,j)=>(
              <div key={j}>
                <p style={{ fontSize:9, color:C.muted }}>{r.l}</p>
                <p style={{ fontSize:11, fontWeight:600, color:C.type }}>{r.v}</p>
              </div>
            ))}
          </div>
          <div style={{ padding:'10px 14px', borderRadius:10, background:`${C.info}06`, border:`1px solid ${C.info}18`, marginBottom:12 }}>
            <p style={{ fontSize:11, color:C.sub, lineHeight:1.6 }}>Reason: {a.reason}</p>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <Btn label="Review Appeal" variant="primary" small icon={I.eye} onClick={()=>onToast(`Reviewing ${a.id}`)} />
            <Btn label="Uphold Rejection" variant="danger" small onClick={()=>onToast('Rejection upheld')} />
            <Btn label="Overturn — Approve" variant="success" small onClick={()=>onToast('Appeal granted — application approved!')} />
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Trust & Safety Incidents ─────────────────────────────────────────────────
function TrustSafetyIncidents({ onToast }:{ onToast:(m:string)=>void }) {
  const incidents = [
    { id:'INC-2026-00041', user:'Priya Fernando',    type:'Fraudulent Document',    severity:'high',   reporter:'System',    status:'open',       investigator:'Ranjith B.' },
    { id:'INC-2026-00040', user:'Unknown (IP flag)', type:'Brute Force Attempt',    severity:'medium', reporter:'System',    status:'monitoring', investigator:'System'     },
    { id:'INC-2026-00039', user:'Dilshan R.',        type:'Duplicate Submission',   severity:'medium', reporter:'Amara S.',  status:'closed',     investigator:'Amara S.'   },
  ]
  const sc = (s:string) => s==='high'?'#DC2626':s==='medium'?C.warning:C.muted
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Trust & Safety Incidents</h2>
        <Btn label="Report Incident" variant="secondary" small icon={I.plus} onClick={()=>onToast('Opening incident form…')} />
      </div>
      {incidents.map((inc,i)=>(
        <Card key={i} hover style={{ padding:20, marginBottom:10, border:`1.5px solid ${sc(inc.severity)}20` }}>
          <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
            <div style={{ width:40, height:40, borderRadius:12, background:`${sc(inc.severity)}10`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ display:'flex', color:sc(inc.severity), transform:'scale(1.1)' }}>{I.incident}</span>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                <p style={{ fontSize:12, fontWeight:700, color:C.primary }}>{inc.id}</p>
                <Bdg label={inc.type} color={sc(inc.severity)} />
                <Bdg label={inc.severity.toUpperCase()} color={sc(inc.severity)} />
                <VSBdg status={inc.status==='closed'?'archived':inc.status==='monitoring'?'underreview':'pending'} />
              </div>
              <p style={{ fontSize:11, color:C.type, marginBottom:2 }}>Reported user: <strong>{inc.user}</strong></p>
              <p style={{ fontSize:10, color:C.muted }}>Reporter: {inc.reporter} · Investigator: {inc.investigator}</p>
            </div>
            <Btn label="Investigate" variant={inc.status==='closed'?'ghost':'secondary'} small onClick={()=>onToast(`Opening ${inc.id}`)} />
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Quality Assurance ────────────────────────────────────────────────────────
function QualityAssurance({ onToast }:{ onToast:(m:string)=>void }) {
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>Quality Assurance</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }} className="tc-4col">
        {[{l:'QA Pass Rate',v:'96.4%',c:C.success},{l:'Manual Reviews',v:'34',c:C.primary},{l:'Escalation Queue',v:'3',c:C.warning},{l:'Reviewer Accuracy',v:'98.1%',c:C.success}].map((s,i)=>(
          <Card key={i} style={{ padding:16, textAlign:'center' as const }}>
            <p style={{ fontSize:24, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{s.v}</p>
            <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="tc-2col">
        <Card style={{ padding:22 }}>
          <SectionTitle title="Random Audits This Month" />
          {[{id:'RP-VER-2026-00121',reviewer:'Ranjith B.',result:'Pass',score:97},{id:'RP-VER-2026-00115',reviewer:'Amara S.',result:'Pass',score:94},{id:'RP-VER-2026-00108',reviewer:'Thilina S.',result:'Fail',score:61},{id:'RP-VER-2026-00099',reviewer:'Ranjith B.',result:'Pass',score:99}].map((a,i)=>(
            <div key={i} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom:i<3?`1px solid ${C.border}`:'none', alignItems:'center' }}>
              <p style={{ fontSize:11, fontWeight:700, color:C.primary, flex:1 }}>{a.id}</p>
              <p style={{ fontSize:10, color:C.muted }}>{a.reviewer}</p>
              <Bdg label={a.result} color={a.result==='Pass'?C.success:C.error} />
              <p style={{ fontSize:11, fontWeight:700, color:a.result==='Pass'?C.success:C.error }}>{a.score}</p>
            </div>
          ))}
        </Card>
        <Card style={{ padding:22 }}>
          <SectionTitle title="Reviewer Performance" />
          {[{name:'Ranjith Bandara',cases:84,accuracy:98.1,avg:'3.8h'},{name:'Amara S.',cases:67,accuracy:97.3,avg:'4.2h'},{name:'Thilina S.',cases:42,accuracy:94.1,avg:'5.1h'}].map((r,i)=>(
            <div key={i} style={{ padding:'10px 0', borderBottom:i<2?`1px solid ${C.border}`:'none' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <UA name={r.name} size={28} color={C.primary} />
                  <p style={{ fontSize:11, fontWeight:700, color:C.type }}>{r.name}</p>
                </div>
                <p style={{ fontSize:11, fontWeight:700, color:C.success }}>{r.accuracy}%</p>
              </div>
              <p style={{ fontSize:10, color:C.muted }}>{r.cases} cases reviewed · Avg {r.avg}</p>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

// ─── Notifications ────────────────────────────────────────────────────────────
function TCNotifications() {
  const items = [
    { t:'New Verification Application', b:'Dilshan Ratnayake submitted RP-VER-2026-00143. Priority: Medium.', c:C.info,   read:false },
    { t:'Document Expiring in 10 Days', b:'Dilshan R. — Caregiving Certificate expires 01 Feb 2026.',        c:C.error,  read:false },
    { t:'Appeal Submitted',             b:'Suresh Perera filed appeal APP-2026-00018 against rejection.',    c:C.warning,read:false },
    { t:'Fraud Alert Detected',         b:'Duplicate account flagged — Suresh Perera / Suresh P.',           c:'#DC2626',read:false },
    { t:'Compliance Warning',           b:'Platform compliance score below 95% threshold.',                  c:'#F97316',read:true  },
    { t:'Reviewer Assignment',          b:'RP-VER-2026-00144 assigned to Ranjith Bandara for review.',       c:C.primary,read:true  },
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
function TCReports({ onToast }:{ onToast:(m:string)=>void }) {
  const reports = [
    { t:'Verification Report',   d:'Monthly verification outcomes, approval rates, timelines — Jan 2026'   },
    { t:'Compliance Report',     d:'Platform compliance score, violations, expired documents — Jan 2026'   },
    { t:'Fraud Report',          d:'Fraud alerts, duplicate accounts, suspicious document analysis'         },
    { t:'Appeals Report',        d:'Appeals filed, overturn rate, resolution time — Jan 2026'              },
    { t:'Reviewer Performance',  d:'Individual reviewer metrics, accuracy, throughput — Jan 2026'          },
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
                <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:4 }}>{r.t}</p>
                <p style={{ fontSize:11, color:C.muted, lineHeight:1.5, marginBottom:12 }}>{r.d}</p>
                <div style={{ display:'flex', gap:6 }}>
                  <Btn label="View" variant="ghost" small icon={I.eye} onClick={()=>onToast(`Opening ${r.t}…`)} />
                  <Btn label="Export PDF" variant="secondary" small icon={I.download} onClick={()=>onToast('Exporting PDF…')} />
                  <Btn label="Export Excel" variant="secondary" small icon={I.download} onClick={()=>onToast('Exporting XLSX…')} />
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
        {Object.entries(VSTATUS).map(([k,s],i)=>(
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
        {[{t:'No Pending Reviews',    d:'All verification applications have been processed.'},{t:'No Fraud Alerts',      d:'No fraud indicators detected across the platform.'},{t:'No Appeals',           d:'No open appeal cases at this time.'},{t:'No Expired Documents', d:'All agent certifications are current and valid.'}].map((s,i)=>(
          <Card key={i} style={{ padding:'38px 22px', textAlign:'center' as const }}>
            <div style={{ width:48, height:48, borderRadius:16, background:`${C.primary}08`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
              <span style={{ display:'flex', color:`${C.primary}60`, transform:'scale(1.3)' }}>{I.shield}</span>
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
        {['Loading Queue','Loading Documents','Loading Reports','Loading Trust Score'].map((l,i)=>(
          <Card key={i} style={{ padding:22 }}>
            <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:14 }}>{l}</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:14 }}>
              {[...Array(4)].map((_,j)=><div key={j} style={{ height:56, borderRadius:10, background:'#F2F4F5' }}/>)}
            </div>
            {[...Array(3)].map((_,j)=>(
              <div key={j} style={{ display:'flex', gap:10, padding:'10px 0', borderBottom:j<2?`1px solid ${C.border}`:'none' }}>
                <div style={{ width:34, height:34, borderRadius:'50%', background:'#E4E8EA', flexShrink:0 }}/>
                <div style={{ flex:1 }}><Shimmer h={11} w="65%"/><div style={{height:6}}/><Shimmer h={9} w="40%"/></div>
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
      {[{t:'Unable to Load Verification',d:'Verification data unavailable. Check permissions and retry.',c:C.error},{t:'Document Error',              d:'Document could not be loaded. File may be corrupted or access denied.',c:C.warning},{t:'Compliance Error',            d:'Compliance data sync failed. Data may be stale.',c:C.muted}].map((er,i)=>(
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
      {[{t:'Verification Approved',   d:'Kasun Perera fully verified. Care Agent status activated.',           c:C.success},{t:'Verification Rejected',   d:'Application RP-VER-2026-00133 rejected. Applicant notified.',        c:C.error},{t:'Documents Updated',      d:'Medical Certificate resubmission received and approved.',              c:C.success},{t:'Appeal Closed',          d:'APP-2026-00017 resolved. Rejection overturned — application approved.',  c:C.primary},{t:'Certificate Renewed',    d:'Kasun Perera — CPR Certificate renewed and valid until Mar 2027.',      c:C.success}].map((s,i)=>(
        <Card key={i} style={{ padding:18, marginBottom:10, border:`1.5px solid ${s.c}30`, background:`${s.c}04` }}>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <div style={{ width:40, height:40, borderRadius:12, background:`${s.c}12`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ display:'flex', color:s.c, transform:'scale(1.1)' }}>{s.c===C.error?I.fraud:I.check}</span>
            </div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:13, fontWeight:700, color:s.c, marginBottom:2 }}>{s.t}</p>
              <p style={{ fontSize:11, color:C.sub }}>{s.d}</p>
            </div>
            <span style={{ color:s.c, display:'flex' }}>{I.check}</span>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function TrustCenter() {
  const [sub, setSub] = useState<SubView>('home')
  const [toast, setToast] = useState<string|null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const showToast = (m:string) => { setToast(m); setTimeout(()=>setToast(null),2800) }
  const groups = [...new Set(NAV.map(n=>n.group))]

  const renderMain = () => {
    switch(sub) {
      case 'home':         return <TrustHome onNav={setSub} onToast={showToast} />
      case 'queue':        return <VerificationQueue onNav={setSub} onToast={showToast} />
      case 'appDetail':    return <ApplicationDetails onToast={showToast} />
      case 'docReview':    return <DocumentReview onToast={showToast} />
      case 'identity':     return <IdentityVerification onToast={showToast} />
      case 'background':   return <BackgroundChecks onToast={showToast} />
      case 'certs':        return <CertificationMgmt onToast={showToast} />
      case 'compliance':   return <ComplianceDashboard />
      case 'fraud':        return <FraudDetection onToast={showToast} />
      case 'trustScore':   return <TrustScoreView />
      case 'workflow':     return <ReviewWorkflow onToast={showToast} />
      case 'reviewer':     return <ReviewerWorkspace onToast={showToast} />
      case 'expiry':       return <DocumentExpiry onToast={showToast} />
      case 'auditTrail':   return <AuditTrailView />
      case 'appeals':      return <AppealsMgmt onToast={showToast} />
      case 'incidents':    return <TrustSafetyIncidents onToast={showToast} />
      case 'qa':           return <QualityAssurance onToast={showToast} />
      case 'notifications':return <TCNotifications />
      case 'reports':      return <TCReports onToast={showToast} />
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
      <div className="tc-sidebar" style={{ width:216, background:C.dark, display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh', overflowY:'auto', flexShrink:0 }}>
        <div style={{ padding:'16px 18px 14px', borderBottom:`1px solid ${C.darkSub}` }}>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <div style={{ width:30, height:30, borderRadius:9, background:`linear-gradient(135deg,${C.primary},#005D63)`, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ display:'flex', color:'white', transform:'scale(0.9)' }}>{I.shield}</span>
            </div>
            <div>
              <p style={{ fontSize:13, fontWeight:900, color:'rgba(255,255,255,0.95)', fontFamily:'Manrope,sans-serif', lineHeight:1 }}>ReadyPal</p>
              <p style={{ fontSize:9, color:'rgba(255,255,255,0.4)', fontWeight:700, textTransform:'uppercase' as const, letterSpacing:'0.08em' }}>Trust Center</p>
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
                  style={{ width:'100%', display:'flex', gap:9, alignItems:'center', padding:'9px 18px', border:'none', background:active?`${C.primary}25`:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:active?700:400, color:active?'rgba(255,255,255,0.95)':'rgba(255,255,255,0.5)', textAlign:'left' as const, borderLeft:active?`3px solid ${C.primary}`:'3px solid transparent', transition:'all 0.12s' }}>
                  <span style={{ display:'flex', color:active?C.primary:'rgba(255,255,255,0.32)', flexShrink:0 }}>{n.icon}</span>
                  <span style={{ flex:1 }}>{n.l}</span>
                  {n.badge&&n.badge>0&&(
                    <div style={{ minWidth:18, height:18, borderRadius:99, background:n.badge>=3?'#DC2626':C.warning, color:'#fff', fontSize:9, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 5px' }}>{n.badge}</div>
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
              <p style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.9)' }}>Trust Center</p>
            </div>
            {NAV.map(n=>(
              <button key={n.k} onClick={()=>{ setSub(n.k); setSidebarOpen(false) }}
                style={{ width:'100%', display:'flex', gap:9, alignItems:'center', padding:'10px 18px', border:'none', background:sub===n.k?`${C.primary}25`:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:sub===n.k?700:400, color:sub===n.k?'rgba(255,255,255,0.95)':'rgba(255,255,255,0.5)', textAlign:'left' as const }}>
                <span style={{ display:'flex', color:sub===n.k?C.primary:'rgba(255,255,255,0.32)' }}>{n.icon}</span>{n.l}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main column */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        {/* Header */}
        <div style={{ height:52, background:C.surface, borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', paddingInline:20, gap:12, position:'sticky', top:0, zIndex:30, flexShrink:0 }}>
          <button className="tc-menu-btn" onClick={()=>setSidebarOpen(v=>!v)}
            style={{ background:'none', border:'none', cursor:'pointer', color:C.type, padding:4, display:'none' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
          <div style={{ flex:1, display:'flex', gap:8, alignItems:'center', maxWidth:360, padding:'7px 12px', borderRadius:9, border:`1px solid ${C.border}`, background:'#FAFAFA' }}>
            <span style={{ display:'flex', color:C.muted }}>{I.eye}</span>
            <input placeholder="Search applications, agents, flags…" style={{ border:'none', background:'transparent', fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, outline:'none', flex:1 }} onFocus={()=>setSub('queue')} />
          </div>
          <div style={{ marginLeft:'auto', display:'flex', gap:6, alignItems:'center' }}>
            <div style={{ display:'flex', gap:5, alignItems:'center', padding:'4px 10px', borderRadius:99, background:`${C.warning}12`, border:`1px solid ${C.warning}25` }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:C.warning }}/>
              <p style={{ fontSize:10, fontWeight:700, color:C.warning }}>18 PENDING</p>
            </div>
            <Bdg label="3 fraud alerts" color="#DC2626" dot />
          </div>
        </div>
        <div style={{ flex:1, overflowY:'auto' }} className="tc-main">
          {renderMain()}
        </div>
      </div>

      {toast&&<Toast msg={toast} />}
    </div>
  )
}
