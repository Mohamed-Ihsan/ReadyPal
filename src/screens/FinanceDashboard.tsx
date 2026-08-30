import { useState, useEffect, type ReactNode, type CSSProperties } from 'react'
import { supabase } from '../lib/supabaseClient'

// ─── Brand ────────────────────────────────────────────────────────────────────
const C = {
  primary:'#00737A', accent:'#EE8153', type:'#2C3E43', sub:'#6B7E85',
  muted:'#9AAAB0', border:'#E4E8EA', bg:'#F2F4F5', surface:'#FFFFFF',
  success:'#22C55E', warning:'#F59E0B', error:'#EF4444', info:'#3B82F6',
  dark:'#1A2A30', darkSub:'rgba(255,255,255,0.08)',
}

const fmt = (n:number) => `LKR ${n.toLocaleString()}`

// ─── Status ───────────────────────────────────────────────────────────────────
const PSTATUS: Record<string,{color:string;label:string}> = {
  paid:        {color:C.success,  label:'Paid'        },
  pending:     {color:C.warning,  label:'Pending'     },
  failed:      {color:C.error,    label:'Failed'      },
  refunded:    {color:C.info,     label:'Refunded'    },
  disputed:    {color:'#F97316',  label:'Disputed'    },
  processing:  {color:C.primary,  label:'Processing'  },
  completed:   {color:C.success,  label:'Completed'   },
  scheduled:   {color:C.primary,  label:'Scheduled'   },
  overdue:     {color:'#DC2626',  label:'Overdue'     },
  reconciled:  {color:'#10B981',  label:'Reconciled'  },
  cancelled:   {color:C.muted,    label:'Cancelled'   },
  approved:    {color:C.success,  label:'Approved'    },
  rejected:    {color:C.error,    label:'Rejected'    },
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const INVOICES = [
  { id:'INV-2026-00284', client:'Mohamed Ihsan',  date:'22 Jan 2026', due:'01 Feb 2026', paid:'-',           amount:8500,  status:'paid'     },
  { id:'INV-2026-00283', client:'Priya Fernando', date:'22 Jan 2026', due:'01 Feb 2026', paid:'-',           amount:6200,  status:'paid'     },
  { id:'INV-2026-00282', client:'Chamara K.',     date:'21 Jan 2026', due:'31 Jan 2026', paid:'-',           amount:12000, status:'pending'  },
  { id:'INV-2026-00281', client:'Sampath J.',     date:'20 Jan 2026', due:'30 Jan 2026', paid:'-',           amount:9800,  status:'overdue'  },
  { id:'INV-2026-00278', client:'Nirosha J.',     date:'15 Jan 2026', due:'25 Jan 2026', paid:'25 Jan 2026', amount:7400,  status:'paid'     },
]

const REFUNDS = [
  { id:'REF-2026-00041', booking:'RP-2026-000179', client:'Mohamed Ihsan',  reason:'Service not delivered as described',  amount:8500,  status:'approved',   date:'20 Jan 2026' },
  { id:'REF-2026-00040', booking:'RP-2026-000174', client:'Priya Fernando', reason:'Agent no-show — appointment cancelled',amount:6200,  status:'processing', date:'18 Jan 2026' },
  { id:'REF-2026-00039', booking:'RP-2026-000168', client:'Sampath J.',     reason:'Client cancelled within policy window', amount:4900,  status:'pending',    date:'16 Jan 2026' },
]

const DISPUTES = [
  { id:'DSP-2026-00018', booking:'RP-2026-000178', payment:'TXN-2026-001841', client:'Priya Fernando', agent:'Dilshan R.', reason:'Service quality dispute',  officer:'Amara S.',   status:'pending',  raised:'18 Jan 2026' },
  { id:'DSP-2026-00017', booking:'RP-2026-000162', payment:'TXN-2026-001827', client:'Chamara K.',    agent:'Ayesha M.', reason:'Overcharge — hours mismatch', officer:'Thilina S.', status:'resolved', raised:'12 Jan 2026' },
]

// ─── Icons ────────────────────────────────────────────────────────────────────
const I: Record<string,ReactNode> = {
  home:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 5.5l5.5-4.5 5.5 4.5V12H8.5V8.5h-4V12H1V5.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  money:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="3" width="11" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="6.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/><path d="M1 5.5h1.5M10.5 5.5H12M1 7.5h1.5M10.5 7.5H12" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  payments: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="3" width="11" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 6h11" stroke="currentColor" strokeWidth="1.2"/><path d="M4 8.5h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  invoice:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M3 1h5l3 3v8H3V1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M8 1v3h3" stroke="currentColor" strokeWidth="1.1"/><path d="M5 6h3M5 8h3M5 10h1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  payout:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 11c0-1.93 1.57-3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M9 7.5v4M7 9.5l2 2 2-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  workflow: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="2.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/><circle cx="10.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/><circle cx="6.5" cy="2.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/><path d="M4 6.5H9M6.5 4v1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  refund:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M11 6.5a4.5 4.5 0 1 1-1-2.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M11 3v2.5H8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  dispute:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5L1 12h11L6.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M6.5 5v3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="6.5" cy="10" r=".7" fill="currentColor"/></svg>,
  wallet:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="3" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M9 7a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0" fill="currentColor"/><path d="M9 2.5l-7 .5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  commission:<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M3 10L10 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><circle cx="3.5" cy="3.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/><circle cx="9.5" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/></svg>,
  reconcile:<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 4.5h4M2 6.5h4M2 8.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M8 5l1.5 1.5L12 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 9l1.5 1.5L12 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  tax:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="2" y="1.5" width="9" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 5h1.5M7 5h1.5M4.5 7h4M4.5 9h4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  chart:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="1" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 9V7M6.5 9V5M9 9V3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  export:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2v7M4 6.5L6.5 9 9 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M1.5 10.5h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  bank:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 5h11M6.5 1.5L1 4.5h11L6.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M3 5.5v4.5M6.5 5.5v4.5M10 5.5v4.5M1 11h11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  calendar: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="2" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 5.5h11M4 1v3M9 1v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  bell:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5c-2.5 0-4 1.8-4 4v2.5L1 9.5h11l-1.5-1.5V5.5c0-2.2-1.5-4-4-4z" stroke="currentColor" strokeWidth="1.2"/><path d="M5 9.5c0 .83.67 1.5 1.5 1.5S8 10.33 8 9.5" stroke="currentColor" strokeWidth="1.1"/></svg>,
  report:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="1" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 9V7M6.5 9V5M9 9V3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  badge:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1L1.5 3v4c0 3 5 4.5 5 4.5s5-1.5 5-4.5V3L6.5 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M4 6.5l2 2 3.5-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  check:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 6.5l3 3.5 5-6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  eye:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 6.5C1 6.5 3 3.5 6.5 3.5S12 6.5 12 6.5 10 9.5 6.5 9.5 1 6.5 1 6.5z" stroke="currentColor" strokeWidth="1.2"/><circle cx="6.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/></svg>,
  alert:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5L1 12h11L6.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M6.5 5.5v3M6.5 10v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  plus:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2v9M2 6.5h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  chevR:    <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M3.5 2l3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  refresh:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M11 6.5a4.5 4.5 0 1 1-1-2.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M11 3v2.5H8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  kpi:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 9l3-4 3 2 3.5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 4h2.5v2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  shield:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1L1.5 3v4c0 3 5 4.5 5 4.5s5-1.5 5-4.5V3L6.5 1z" stroke="currentColor" strokeWidth="1.2"/></svg>,
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

const BTN_BASE: Record<string,{background:string; color:string; border:string}> = {
  primary:  { background:C.primary,  color:'#fff', border:'none' },
  secondary:{ background:'#fff',     color:C.primary, border:`1.5px solid ${C.border}` },
  ghost:    { background:'transparent', color:C.sub, border:'none' },
  danger:   { background:C.error,    color:'#fff', border:'none' },
  warning:  { background:C.warning,  color:'#fff', border:'none' },
  success:  { background:C.success,  color:'#fff', border:'none' },
  dark:     { background:C.dark,     color:'#fff', border:'none' },
}
const BTN_HOVER_BG: Record<string,string> = {
  primary:'#005D63', secondary:'#EEF5F5', ghost:C.bg,
  danger:'#DC2626', warning:'#D97706', success:'#16A34A', dark:'#243840',
}

function Btn({ label, icon, onClick, variant='primary', small=false, full=false }:{
  label:string; icon?:ReactNode; onClick?:()=>void
  variant?:'primary'|'secondary'|'ghost'|'danger'|'warning'|'success'|'dark'
  small?:boolean; full?:boolean
}) {
  return (
    <button onClick={onClick}
      onMouseEnter={e=>{ (e.currentTarget as HTMLButtonElement).style.background=BTN_HOVER_BG[variant] }}
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

function PSBdg({ status }:{ status:string }) {
  const s = PSTATUS[status] || { color:C.muted, label:status }
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

// ─── Mini SVG chart ───────────────────────────────────────────────────────────
function Sparkline({ data, color=C.primary, h=36 }:{ data:number[]; color?:string; h?:number }) {
  const w = 80
  const max = Math.max(...data), min = Math.min(...data)
  const pts = data.map((v,i)=>`${(i/(data.length-1))*w},${h-((v-min)/(max-min||1))*(h-6)-2}`)
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" opacity="0.85"/>
    </svg>
  )
}

// ─── Sub-view type ────────────────────────────────────────────────────────────
type SubView = 'home'|'kpis'|'payments'|'paymentDetail'|'invoices'|'payouts'|'payoutWorkflow'|'refunds'|'disputes'|'wallets'|'commission'|'reconciliation'|'tax'|'analytics'|'export'|'banking'|'schedule'|'notifications'|'reports'|'statusBadges'|'empty'|'loading'|'error'|'success'

const NAV: { k:SubView; l:string; icon:ReactNode; group:string; badge?:number }[] = [
  { k:'home',          l:'Finance Dashboard',   icon:I.home,       group:'Overview'    },
  { k:'kpis',          l:'Financial KPIs',      icon:I.kpi,        group:'Overview'    },
  { k:'payments',      l:'Payment Directory',   icon:I.payments,   group:'Payments',  badge:4 },
  { k:'paymentDetail', l:'Payment Details',     icon:I.money,      group:'Payments'    },
  { k:'invoices',      l:'Client Invoices',     icon:I.invoice,    group:'Payments',  badge:2 },
  { k:'payouts',       l:'Agent Payouts',       icon:I.payout,     group:'Payouts',   badge:3 },
  { k:'payoutWorkflow',l:'Payout Workflow',     icon:I.workflow,   group:'Payouts'     },
  { k:'refunds',       l:'Refund Management',   icon:I.refund,     group:'Operations' },
  { k:'disputes',      l:'Dispute Center',      icon:I.dispute,    group:'Operations', badge:1 },
  { k:'wallets',       l:'Wallet Management',   icon:I.wallet,     group:'Operations' },
  { k:'commission',    l:'Commission Mgmt',     icon:I.commission, group:'Finance'    },
  { k:'reconciliation',l:'Reconciliation',      icon:I.reconcile,  group:'Finance'    },
  { k:'tax',           l:'Tax Center',          icon:I.tax,        group:'Finance'    },
  { k:'analytics',     l:'Financial Analytics', icon:I.chart,      group:'Finance'    },
  { k:'export',        l:'Export Center',       icon:I.export,     group:'Reports'    },
  { k:'banking',       l:'Bank & Gateways',     icon:I.bank,       group:'Reports'    },
  { k:'schedule',      l:'Scheduled Payouts',   icon:I.calendar,   group:'Reports'    },
  { k:'notifications', l:'Notifications',       icon:I.bell,       group:'Dev'         },
  { k:'reports',       l:'Reports',             icon:I.report,     group:'Dev'         },
  { k:'statusBadges',  l:'Status Badges',       icon:I.badge,      group:'Dev'         },
  { k:'empty',         l:'Empty States',        icon:I.money,      group:'Dev'         },
  { k:'loading',       l:'Loading States',      icon:I.refresh,    group:'Dev'         },
  { k:'error',         l:'Error States',        icon:I.alert,      group:'Dev'         },
  { k:'success',       l:'Success States',      icon:I.check,      group:'Dev'         },
]

// ─── Finance Home — module-level data ─────────────────────────────────────────
const HOME_KPIS = [
  { l:"Today's Revenue",   v:'LKR 126,500',    trend:'+8.4%',  up:true,  spark:[80,92,78,96,88,110,126], c:C.success },
  { l:'Monthly Revenue',   v:'LKR 12,450,000', trend:'+12.1%', up:true,  spark:[90,95,88,102,98,115,124], c:C.primary },
  { l:'Annual Revenue',    v:'LKR 148,400,000',trend:'+18.6%', up:true,  spark:[70,80,85,90,95,100,110],  c:C.primary },
  { l:'Pending Payments',  v:'LKR 21,200',     trend:'-3.2%',  up:false, spark:[30,42,28,35,22,18,21],    c:C.warning },
  { l:'Pending Payouts',   v:'LKR 845,000',    trend:'+4.1%',  up:false, spark:[60,70,65,80,75,82,84],    c:C.warning },
  { l:'Completed Payouts', v:'LKR 8,420,000',  trend:'+9.8%',  up:true,  spark:[60,70,72,80,78,82,84],    c:C.success },
  { l:'Refund Requests',   v:'LKR 29,500',     trend:'-1.2%',  up:true,  spark:[40,36,42,38,32,30,29],    c:C.info    },
  { l:'Platform Commission',v:'LKR 1,245,000', trend:'+12.1%', up:true,  spark:[80,88,92,100,108,116,124], c:C.accent  },
]
const HOME_REV_TREND = [920,980,1050,1120,1180,1220,1245]
const HOME_REV_MAX = Math.max(...HOME_REV_TREND)

function FinanceHome({ onNav, onToast, TRANSACTIONS }:{ onNav:(s:SubView)=>void; onToast:(m:string)=>void; TRANSACTIONS:any[] }) {
  const kpis = HOME_KPIS
  const recentTxns = TRANSACTIONS.slice(0,5)
  const revTrend = HOME_REV_TREND
  const maxR = HOME_REV_MAX
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      {/* Chargeback alert */}
      <div style={{ padding:'13px 20px', borderRadius:12, background:`${C.warning}08`, border:`1.5px solid ${C.warning}30`, marginBottom:18, display:'flex', gap:12, alignItems:'center' }}>
        <div style={{ width:8, height:8, borderRadius:'50%', background:C.warning, animation:'pulse-dot 1s ease-in-out infinite', flexShrink:0 }}/>
        <p style={{ flex:1, fontSize:12, fontWeight:700, color:C.warning, fontFamily:'Manrope,sans-serif' }}>1 chargeback alert · 1 active payment dispute · 2 overdue invoices requiring attention</p>
        <Btn label="Review" variant="warning" small onClick={()=>onNav('disputes')} />
      </div>
      {/* KPI grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }} className="fin-4col">
        {kpis.map((k,i)=>(
          <Card key={i} hover style={{ padding:18 }}>
            <p style={{ fontSize:10, color:C.muted, marginBottom:8 }}>{k.l}</p>
            <p style={{ fontSize:k.v.length>12?14:18, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', lineHeight:1.2, marginBottom:6 }}>{k.v}</p>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
              <div style={{ display:'flex', alignItems:'center', gap:3 }}>
                <div style={{ width:0, height:0, borderLeft:'4px solid transparent', borderRight:'4px solid transparent', [k.up?'borderBottom':'borderTop']:`5px solid ${k.up?C.success:C.error}` }}/>
                <p style={{ fontSize:10, fontWeight:700, color:k.up?C.success:C.error }}>{k.trend}</p>
              </div>
              <Sparkline data={k.spark} color={k.c} />
            </div>
          </Card>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:16 }} className="fin-main-split">
        {/* Revenue trend chart */}
        <Card style={{ padding:22 }}>
          <SectionTitle title="Monthly Revenue — Jan 2026" action="Full Analytics" onAction={()=>onNav('analytics')} />
          <p style={{ fontSize:24, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>LKR 12,450,000</p>
          <p style={{ fontSize:11, color:C.success, fontWeight:700, marginBottom:16 }}>+12.1% vs last month</p>
          <svg width="100%" height="140" viewBox="0 0 400 140" preserveAspectRatio="none">
            <defs>
              <linearGradient id="finRevGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.primary} stopOpacity="0.18"/>
                <stop offset="100%" stopColor={C.primary} stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d={`M${revTrend.map((v,i)=>`${i*(400/6)},${130-((v/maxR)*110)}`).join('L')} L400,130 L0,130 Z`} fill="url(#finRevGrad)"/>
            <polyline points={revTrend.map((v,i)=>`${i*(400/6)},${130-((v/maxR)*110)}`).join(' ')} fill="none" stroke={C.primary} strokeWidth="2.5" strokeLinejoin="round"/>
            {revTrend.map((v,i)=>(
              <circle key={i} cx={i*(400/6)} cy={130-((v/maxR)*110)} r="4" fill={C.surface} stroke={C.primary} strokeWidth="2"/>
            ))}
          </svg>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:8 }}>
            {['W1','W2','W3','W4','W5','W6','W7'].map(w=>(
              <p key={w} style={{ fontSize:9, color:C.muted }}>{w}</p>
            ))}
          </div>
        </Card>
        {/* Right column */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {/* Revenue split */}
          <Card style={{ padding:20 }}>
            <SectionTitle title="Revenue Breakdown" />
            {[{l:'Gross Revenue',v:'12,450,000',c:C.primary,pct:100},{l:'Platform Fees (10%)',v:'1,245,000',c:C.accent,pct:10},{l:'Care Agent Payouts',v:'8,420,000',c:C.success,pct:68},{l:'Tax Collected',v:'1,120,500',c:C.info,pct:9}].map((r,i)=>(
              <div key={i} style={{ marginBottom:10 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <p style={{ fontSize:11, color:C.muted }}>{r.l}</p>
                  <p style={{ fontSize:11, fontWeight:700, color:r.c }}>LKR {r.v}</p>
                </div>
                <div style={{ height:4, borderRadius:99, background:`${r.c}12` }}>
                  <div style={{ width:`${r.pct}%`, height:'100%', background:r.c, borderRadius:99 }}/>
                </div>
              </div>
            ))}
          </Card>
          {/* Quick actions */}
          <Card style={{ padding:20 }}>
            <SectionTitle title="Quick Actions" />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {[{l:'All Payments',cb:()=>onNav('payments')},{l:'Run Payouts',cb:()=>onToast('Payout batch initiated')},{l:'New Invoice',cb:()=>onToast('Creating invoice…')},{l:'Reports',cb:()=>onNav('reports')},{l:'Reconcile',cb:()=>onNav('reconciliation')},{l:'Export',cb:()=>onNav('export')}].map((a,i)=>(
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
      {/* Recent transactions */}
      <Card style={{ marginTop:16, overflow:'hidden' }}>
        <div style={{ padding:'16px 20px', borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h3 style={{ fontSize:14, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Recent Transactions</h3>
          <Btn label="View All" variant="ghost" small icon={I.chevR} onClick={()=>onNav('payments')} />
        </div>
        <div style={{ overflowX:'auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'140px 130px 150px 130px 100px 90px 80px 80px 90px', padding:'9px 16px', background:'#FAFAFA', borderBottom:`1px solid ${C.border}`, minWidth:900 }}>
            {['Transaction','Booking','Client','Agent','Method','Gross','Fee','Net','Status'].map((h,i)=>(
              <p key={i} style={{ fontSize:9, fontWeight:800, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.06em', paddingInline:4 }}>{h}</p>
            ))}
          </div>
          {recentTxns.map((t,i)=>(
            <div key={t.id}
              onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='#FAFBFB'}
              onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}
              style={{ display:'grid', gridTemplateColumns:'140px 130px 150px 130px 100px 90px 80px 80px 90px', padding:'10px 16px', borderBottom:i<recentTxns.length-1?`1px solid ${C.border}`:'none', transition:'background 0.12s', minWidth:900 }}>
              <p style={{ fontSize:11, fontWeight:700, color:C.primary, paddingInline:4, display:'flex', alignItems:'center' }}>{t.id.split('-').slice(-1)[0]}</p>
              <p style={{ fontSize:10, color:C.sub, paddingInline:4, display:'flex', alignItems:'center' }}>{t.booking}</p>
              <div style={{ paddingInline:4, display:'flex', alignItems:'center', gap:6 }}><UA name={t.client} size={22} color={C.primary}/><p style={{ fontSize:11, color:C.type }}>{t.client}</p></div>
              <p style={{ fontSize:11, color:C.sub, paddingInline:4, display:'flex', alignItems:'center' }}>{t.agent}</p>
              <div style={{ paddingInline:4, display:'flex', alignItems:'center' }}><Bdg label={t.method} color={C.info} /></div>
              <p style={{ fontSize:11, fontWeight:700, color:C.type, paddingInline:4, display:'flex', alignItems:'center' }}>{fmt(t.gross)}</p>
              <p style={{ fontSize:10, color:C.muted, paddingInline:4, display:'flex', alignItems:'center' }}>{fmt(t.fee)}</p>
              <p style={{ fontSize:11, fontWeight:700, color:C.success, paddingInline:4, display:'flex', alignItems:'center' }}>{fmt(t.net)}</p>
              <div style={{ paddingInline:4, display:'flex', alignItems:'center' }}><PSBdg status={t.status} /></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Financial KPIs ───────────────────────────────────────────────────────────
function FinancialKPIs() {
  const kpis = [
    { l:'Gross Revenue',        v:'LKR 12,450,000', sub:'Jan 2026',       pct:100, c:C.primary, trend:'+12.1%', up:true },
    { l:'Net Revenue',          v:'LKR 9,084,500',  sub:'After payouts',  pct:73,  c:C.success, trend:'+10.4%', up:true },
    { l:'Platform Fees',        v:'LKR 1,245,000',  sub:'10% of gross',   pct:10,  c:C.accent,  trend:'+12.1%', up:true },
    { l:'Taxes Collected',      v:'LKR 1,120,500',  sub:'VAT + income',   pct:9,   c:C.info,    trend:'+11.8%', up:true },
    { l:'Successful Payments',  v:'1,284',          sub:'Jan 2026',       pct:96,  c:C.success, trend:'+8.2%',  up:true },
    { l:'Failed Payments',      v:'52',             sub:'4.1% fail rate',  pct:4,   c:C.error,   trend:'-1.4%',  up:true },
    { l:'Chargebacks',          v:'3',              sub:'0.23% rate',      pct:1,   c:'#DC2626', trend:'+0.1%',  up:false },
    { l:'Average Booking Value',v:'LKR 8,420',      sub:'Per transaction', pct:0,   c:C.primary, trend:'+3.8%',  up:true },
    { l:'Revenue Growth',       v:'+12.1%',         sub:'vs Dec 2025',    pct:12,  c:C.success, trend:'',       up:true },
  ]
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>Financial KPI Cards</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }} className="fin-3col">
        {kpis.map((k,i)=>(
          <Card key={i} style={{ padding:22 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
              <p style={{ fontSize:11, color:C.muted }}>{k.l}</p>
              {k.trend&&(
                <div style={{ display:'flex', alignItems:'center', gap:3 }}>
                  <div style={{ width:0, height:0, borderLeft:'4px solid transparent', borderRight:'4px solid transparent', [k.up?'borderBottom':'borderTop']:`5px solid ${k.up?C.success:C.error}` }}/>
                  <p style={{ fontSize:10, fontWeight:700, color:k.up?C.success:C.error }}>{k.trend}</p>
                </div>
              )}
            </div>
            <p style={{ fontSize:k.v.length>12?18:26, fontWeight:900, color:k.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:6 }}>{k.v}</p>
            <p style={{ fontSize:10, color:C.muted, marginBottom:k.pct?10:0 }}>{k.sub}</p>
            {k.pct>0&&(
              <div style={{ height:4, borderRadius:99, background:`${k.c}12` }}>
                <div style={{ width:`${k.pct}%`, height:'100%', background:k.c, borderRadius:99 }}/>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Payment Directory ────────────────────────────────────────────────────────
function PaymentDirectory({ onNav, onToast, TRANSACTIONS }:{ onNav:(s:SubView)=>void; onToast:(m:string)=>void; TRANSACTIONS:any[] }) {  const [q, setQ] = useState('')
  const [sf, setSf] = useState('all')
  const filtered = TRANSACTIONS.filter(t=>
    (sf==='all'||t.status===sf)&&
    (t.id.includes(q)||t.client.toLowerCase().includes(q.toLowerCase())||t.booking.includes(q))
  )
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Payment Directory</h2>
        <div style={{ display:'flex', gap:8 }}>
          <Btn label="Export" variant="secondary" small icon={I.export} onClick={()=>onToast('Exporting…')} />
          <Btn label="Manual Entry" variant="primary" small icon={I.plus} onClick={()=>onToast('Opening payment form…')} />
        </div>
      </div>
      {/* Filters */}
      <Card style={{ padding:14, marginBottom:14 }}>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' as const, alignItems:'center' }}>
          <div style={{ display:'flex', gap:8, alignItems:'center', flex:1, minWidth:180, padding:'8px 12px', borderRadius:9, border:`1px solid ${C.border}`, background:'#FAFAFA' }}>
            <span style={{ display:'flex', color:C.muted }}>{I.eye}</span>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by transaction ID, booking, or client…" style={{ border:'none', background:'transparent', fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, outline:'none', flex:1 }} />
          </div>
          <div style={{ display:'flex', gap:5, flexWrap:'wrap' as const }}>
            {['all','paid','pending','processing','failed','refunded','disputed'].map(f=>(
              <button key={f} onClick={()=>setSf(f)}
                style={{ padding:'6px 12px', borderRadius:99, border:`1.5px solid ${sf===f?C.primary:C.border}`, background:sf===f?`${C.primary}08`:'#FAFAFA', cursor:'pointer', fontSize:10, fontWeight:700, color:sf===f?C.primary:C.muted, fontFamily:'Manrope,sans-serif' }}>
                {PSTATUS[f]?.label||'All'}
              </button>
            ))}
          </div>
        </div>
      </Card>
      <Card style={{ overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'140px 130px 150px 130px 100px 90px 80px 80px 80px 90px 120px 110px', padding:'10px 14px', background:'#FAFAFA', borderBottom:`1px solid ${C.border}`, minWidth:1200 }}>
          {['Txn ID','Booking','Client','Agent','Method','Gross','Fee','Net','Tax','Status','Date','Actions'].map((h,i)=>(
            <p key={i} style={{ fontSize:9, fontWeight:800, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.06em', paddingInline:4 }}>{h}</p>
          ))}
        </div>
        <div style={{ overflowX:'auto' }}>
          {filtered.map((t,i)=>(
            <div key={t.id}
              onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='#FAFBFB'}
              onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}
              style={{ display:'grid', gridTemplateColumns:'140px 130px 150px 130px 100px 90px 80px 80px 80px 90px 120px 110px', padding:'10px 14px', borderBottom:i<filtered.length-1?`1px solid ${C.border}`:'none', transition:'background 0.12s', minWidth:1200 }}>
              <p style={{ fontSize:11, fontWeight:700, color:C.primary, paddingInline:4, display:'flex', alignItems:'center' }}>{t.id.split('-').slice(-1)[0]}</p>
              <p style={{ fontSize:10, color:C.sub, paddingInline:4, display:'flex', alignItems:'center' }}>{t.booking}</p>
              <div style={{ paddingInline:4, display:'flex', alignItems:'center', gap:6 }}><UA name={t.client} size={22} color={C.primary}/><p style={{ fontSize:11, color:C.type, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as const }}>{t.client}</p></div>
              <p style={{ fontSize:11, color:C.sub, paddingInline:4, display:'flex', alignItems:'center', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as const }}>{t.agent}</p>
              <div style={{ paddingInline:4, display:'flex', alignItems:'center' }}><Bdg label={t.method} color={C.info} /></div>
              <p style={{ fontSize:11, fontWeight:700, color:C.type, paddingInline:4, display:'flex', alignItems:'center' }}>{fmt(t.gross)}</p>
              <p style={{ fontSize:10, color:C.muted, paddingInline:4, display:'flex', alignItems:'center' }}>{fmt(t.fee)}</p>
              <p style={{ fontSize:11, fontWeight:700, color:C.success, paddingInline:4, display:'flex', alignItems:'center' }}>{fmt(t.net)}</p>
              <p style={{ fontSize:10, color:C.muted, paddingInline:4, display:'flex', alignItems:'center' }}>{fmt(t.tax)}</p>
              <div style={{ paddingInline:4, display:'flex', alignItems:'center' }}><PSBdg status={t.status} /></div>
              <p style={{ fontSize:10, color:C.muted, paddingInline:4, display:'flex', alignItems:'center' }}>{t.date}</p>
              <div style={{ paddingInline:4, display:'flex', gap:4, alignItems:'center' }}>
                <button onClick={()=>{ onNav('paymentDetail'); onToast(`Viewing ${t.id}`) }} style={{ background:'none', border:'none', cursor:'pointer', color:C.primary, display:'flex', padding:3 }}>{I.eye}</button>
                {t.status==='paid'&&<button onClick={()=>onToast(`Refunding ${t.id}`)} style={{ background:'none', border:'none', cursor:'pointer', color:C.warning, display:'flex', padding:3 }}>{I.refund}</button>}
                <button onClick={()=>onToast(`Downloading receipt…`)} style={{ background:'none', border:'none', cursor:'pointer', color:C.success, display:'flex', padding:3 }}>{I.export}</button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Payment Details ──────────────────────────────────────────────────────────
function PaymentDetails({ onToast, TRANSACTIONS }:{ onToast:(m:string)=>void; TRANSACTIONS:any[] }) {
  const txn = TRANSACTIONS[0]
  const timeline = [
    { l:'Payment Initiated',   d:'Client Mohamed Ihsan initiated payment',         time:'22 Jan 10:45', done:true  },
    { l:'Gateway Processing',  d:'Payment sent to gateway for authorization',       time:'22 Jan 10:45', done:true  },
    { l:'Payment Authorized',  d:'Card authorization successful — Bank approved',   time:'22 Jan 10:46', done:true  },
    { l:'Payment Captured',    d:'Funds captured from client account',              time:'22 Jan 10:46', done:true  },
    { l:'Platform Fee Deducted',d:'LKR 850 platform fee deducted (10%)',           time:'22 Jan 10:46', done:true  },
    { l:'Agent Payout Queued', d:'LKR 7,650 queued for Kasun Perera payout',      time:'22 Jan 10:47', done:true  },
    { l:'Invoice Generated',   d:'Invoice INV-2026-00284 created and sent',        time:'22 Jan 10:47', done:true  },
  ]
  return (
    <div style={{ maxWidth:920, margin:'0 auto', padding:'20px 24px 60px' }}>
      <Card style={{ padding:24, marginBottom:16, background:`linear-gradient(135deg,${C.success}06,${C.primary}04)`, border:`1.5px solid ${C.success}20` }}>
        <div style={{ display:'flex', gap:18, alignItems:'flex-start', flexWrap:'wrap' as const }}>
          <div style={{ flex:1, minWidth:200 }}>
            <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:6 }}>
              <h2 style={{ fontSize:18, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>{txn.id}</h2>
              <PSBdg status={txn.status} />
            </div>
            <p style={{ fontSize:11, color:C.muted, marginBottom:12 }}>Booking {txn.booking} · {txn.date}</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
              {[{l:'Client',v:txn.client},{l:'Beneficiary',v:txn.beneficiary},{l:'Care Agent',v:txn.agent},{l:'Method',v:txn.method},{l:'Gross Amount',v:fmt(txn.gross)},{l:'Net Payout',v:fmt(txn.net)}].map((r,i)=>(
                <div key={i}>
                  <p style={{ fontSize:9, color:C.muted }}>{r.l}</p>
                  <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{r.v}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <Btn label="Download Receipt" icon={I.export} variant="primary" onClick={()=>onToast('Downloading receipt…')} />
            <Btn label="Issue Refund" icon={I.refund} variant="secondary" onClick={()=>onToast('Opening refund dialog…')} />
          </div>
        </div>
      </Card>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }} className="fin-2col">
        {/* Financial breakdown */}
        <Card style={{ padding:22 }}>
          <SectionTitle title="Financial Breakdown" />
          {[{l:'Gross Amount',v:fmt(txn.gross),c:C.type,bold:true},{l:'Platform Fee (10%)',v:`- ${fmt(txn.fee)}`,c:C.accent},{l:'Tax Collected (9%)',v:`- ${fmt(txn.tax)}`,c:C.info},{l:'Net Payout to Agent',v:fmt(txn.net),c:C.success,bold:true,border:true}].map((r,i)=>(
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderTop:r.border?`2px solid ${C.border}`:'none', borderBottom:i<3?`1px solid ${C.border}`:'none' }}>
              <p style={{ fontSize:12, color:C.muted }}>{r.l}</p>
              <p style={{ fontSize:12, fontWeight:r.bold?900:600, color:r.c }}>{r.v}</p>
            </div>
          ))}
        </Card>
        {/* Invoice */}
        <Card style={{ padding:22 }}>
          <SectionTitle title="Invoice" />
          <div style={{ padding:'14px 16px', borderRadius:10, border:`1.5px solid ${C.border}`, marginBottom:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
              <div>
                <p style={{ fontSize:14, fontWeight:900, color:C.primary, fontFamily:'Manrope,sans-serif' }}>INV-2026-00284</p>
                <p style={{ fontSize:10, color:C.muted }}>Issued 22 Jan 2026 · Due 01 Feb 2026</p>
              </div>
              <Bdg label="Paid" color={C.success} dot />
            </div>
            {[{l:'Hospital Appointment Assistance',v:fmt(txn.gross)},{l:'Platform Service Fee',v:`(${fmt(txn.fee)})`},{l:'Tax',v:fmt(txn.tax)}].map((r,i)=>(
              <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'4px 0', borderBottom:i<2?`1px dashed ${C.border}`:'none' }}>
                <p style={{ fontSize:11, color:C.muted }}>{r.l}</p>
                <p style={{ fontSize:11, fontWeight:600, color:C.type }}>{r.v}</p>
              </div>
            ))}
          </div>
          <Btn label="Download PDF" variant="secondary" icon={I.export} full onClick={()=>onToast('Downloading invoice…')} />
        </Card>
      </div>
      {/* Timeline */}
      <Card style={{ padding:22 }}>
        <SectionTitle title="Payment Timeline" />
        <div style={{ position:'relative' as const, paddingLeft:30 }}>
          <div style={{ position:'absolute', left:9, top:0, bottom:0, width:2, background:C.border }}/>
          {timeline.map((s,i)=>(
            <div key={i} style={{ position:'relative' as const, marginBottom:i<timeline.length-1?14:0 }}>
              <div style={{ position:'absolute', left:-21, width:16, height:16, borderRadius:'50%', background:s.done?C.success:C.border, top:2, border:`2px solid ${C.surface}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {s.done&&<span style={{ display:'flex', color:'white', transform:'scale(0.55)' }}>{I.check}</span>}
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div>
                  <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{s.l}</p>
                  <p style={{ fontSize:11, color:C.muted }}>{s.d}</p>
                </div>
                <p style={{ fontSize:9, color:C.muted, flexShrink:0, marginLeft:12 }}>{s.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Client Invoices ──────────────────────────────────────────────────────────
function ClientInvoices({ onToast }:{ onToast:(m:string)=>void }) {
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Client Invoices</h2>
        <div style={{ display:'flex', gap:8 }}>
          <Btn label="Export All" variant="secondary" small icon={I.export} onClick={()=>onToast('Exporting…')} />
          <Btn label="Generate Invoice" variant="primary" small icon={I.plus} onClick={()=>onToast('Invoice created')} />
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }} className="fin-4col">
        {[{l:'Total Invoiced',v:'LKR 12,450,000',c:C.primary},{l:'Paid',v:'LKR 11,820,000',c:C.success},{l:'Pending',v:'LKR 430,000',c:C.warning},{l:'Overdue',v:'LKR 200,000',c:C.error}].map((s,i)=>(
          <Card key={i} style={{ padding:16, textAlign:'center' as const }}>
            <p style={{ fontSize:20, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{s.v}</p>
            <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      <Card style={{ overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'140px 180px 120px 120px 120px 110px 90px 140px', padding:'10px 16px', background:'#FAFAFA', borderBottom:`1px solid ${C.border}` }}>
          {['Invoice #','Client','Issued','Due','Paid','Amount','Status','Actions'].map((h,i)=>(
            <p key={i} style={{ fontSize:9, fontWeight:800, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.06em', paddingInline:4 }}>{h}</p>
          ))}
        </div>
        {INVOICES.map((inv,i)=>(
          <div key={inv.id}
            onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='#FAFBFB'}
            onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}
            style={{ display:'grid', gridTemplateColumns:'140px 180px 120px 120px 120px 110px 90px 140px', padding:'11px 16px', borderBottom:i<INVOICES.length-1?`1px solid ${C.border}`:'none', transition:'background 0.12s' }}>
            <p style={{ fontSize:11, fontWeight:700, color:C.primary, paddingInline:4, display:'flex', alignItems:'center' }}>{inv.id}</p>
            <div style={{ paddingInline:4, display:'flex', alignItems:'center', gap:6 }}><UA name={inv.client} size={22} color={C.primary}/><p style={{ fontSize:11, color:C.type }}>{inv.client}</p></div>
            <p style={{ fontSize:10, color:C.muted, paddingInline:4, display:'flex', alignItems:'center' }}>{inv.date}</p>
            <p style={{ fontSize:10, color:inv.status==='overdue'?C.error:C.muted, paddingInline:4, display:'flex', alignItems:'center', fontWeight:inv.status==='overdue'?700:400 }}>{inv.due}</p>
            <p style={{ fontSize:10, color:C.muted, paddingInline:4, display:'flex', alignItems:'center' }}>{inv.paid}</p>
            <p style={{ fontSize:12, fontWeight:700, color:C.type, paddingInline:4, display:'flex', alignItems:'center' }}>{fmt(inv.amount)}</p>
            <div style={{ paddingInline:4, display:'flex', alignItems:'center' }}><PSBdg status={inv.status} /></div>
            <div style={{ paddingInline:4, display:'flex', gap:5, alignItems:'center' }}>
              <Btn label="PDF" variant="ghost" small icon={I.export} onClick={()=>onToast('Downloading…')} />
              {inv.status!=='paid'&&<Btn label="Remind" variant="warning" small onClick={()=>onToast('Reminder sent')} />}
              {inv.status==='pending'&&<Btn label="Mark Paid" variant="success" small onClick={()=>onToast('Marked as paid')} />}
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── Agent Payouts ────────────────────────────────────────────────────────────
function AgentPayouts({ onNav, onToast, AGENTS_PAYOUTS }:{ onNav:(s:SubView)=>void; onToast:(m:string)=>void; AGENTS_PAYOUTS:any[] }) {
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Care Agent Payouts</h2>
        <div style={{ display:'flex', gap:8 }}>
          <Btn label="Run Batch Payout" variant="primary" icon={I.payout} small onClick={()=>onToast('Batch payout initiated…')} />
          <Btn label="Workflow" variant="secondary" small icon={I.workflow} onClick={()=>onNav('payoutWorkflow')} />
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }} className="fin-4col">
        {[{l:'Total Available',v:'LKR 184,670',c:C.success},{l:'Pending Review',v:'LKR 21,800',c:C.warning},{l:'Batch Scheduled',v:'LKR 108,850',c:C.primary},{l:'Completed This Month',v:'LKR 8,420,000',c:C.success}].map((s,i)=>(
          <Card key={i} style={{ padding:16, textAlign:'center' as const }}>
            <p style={{ fontSize:18, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{s.v}</p>
            <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      {AGENTS_PAYOUTS.map((ag,i)=>(
        <Card key={i} hover style={{ padding:22, marginBottom:10 }}>
          <div style={{ display:'flex', gap:16, alignItems:'center', flexWrap:'wrap' as const }}>
            <UA name={ag.name} size={48} color={C.primary} />
            <div style={{ flex:1, minWidth:160 }}>
              <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:2 }}>{ag.name}</p>
              <p style={{ fontSize:11, color:C.muted }}>{ag.bank}</p>
            </div>
            {[{l:'Available',v:fmt(ag.available),c:C.success},{l:'Pending',v:fmt(ag.pending),c:C.warning},{l:'Scheduled',v:ag.scheduled>0?fmt(ag.scheduled):'—',c:C.primary},{l:'Completed',v:fmt(ag.completed),c:C.type}].map((s,j)=>(
              <div key={j} style={{ textAlign:'center' as const, minWidth:80 }}>
                <p style={{ fontSize:9, color:C.muted, marginBottom:3 }}>{s.l}</p>
                <p style={{ fontSize:13, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif' }}>{s.v}</p>
              </div>
            ))}
            <div style={{ display:'flex', flexDirection:'column', gap:6, alignItems:'flex-end' }}>
              <PSBdg status={ag.status} />
              {ag.available>0&&<Btn label="Approve Payout" variant="success" small onClick={()=>onToast(`Payout approved for ${ag.name}`)} />}
              {ag.pending>0&&<Btn label="Review" variant="secondary" small onClick={()=>onToast('Opening review…')} />}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Payout Workflow ──────────────────────────────────────────────────────────
function PayoutWorkflow({ onToast }:{ onToast:(m:string)=>void }) {
  const stages = [
    {l:'Requested',   n:12, c:C.info    },
    {l:'Under Review',n:5,  c:C.warning },
    {l:'Approved',    n:8,  c:C.primary },
    {l:'Scheduled',   n:3,  c:'#8B5CF6' },
    {l:'Processing',  n:2,  c:C.accent  },
    {l:'Completed',   n:847,c:C.success },
    {l:'Failed',      n:4,  c:C.error   },
    {l:'Cancelled',   n:18, c:C.muted   },
  ]
  const maxN = Math.max(...stages.map(s=>s.n))
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>Payout Workflow</h2>
      <Card style={{ padding:24, marginBottom:16 }}>
        <SectionTitle title="Payout Pipeline" />
        <div style={{ display:'flex', alignItems:'flex-end', gap:10, height:130, marginBottom:8 }}>
          {stages.map((s,i)=>{
            const h = Math.max(16,(s.n/maxN)*110)
            return (
              <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                <p style={{ fontSize:11, fontWeight:700, color:s.c }}>{s.n}</p>
                <div style={{ width:'100%', height:h, borderRadius:'6px 6px 0 0', background:`${s.c}20`, border:`1.5px solid ${s.c}40` }}/>
              </div>
            )
          })}
        </div>
        <div style={{ display:'flex', gap:10 }}>
          {stages.map((s,i)=>(
            <div key={i} style={{ flex:1, textAlign:'center' as const }}>
              <p style={{ fontSize:8, color:C.muted, lineHeight:1.3 }}>{s.l}</p>
            </div>
          ))}
        </div>
      </Card>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }} className="fin-4col">
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

// ─── Refund Management ────────────────────────────────────────────────────────
function RefundManagement({ onToast }:{ onToast:(m:string)=>void }) {
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Refund Management</h2>
        <Bdg label={`LKR ${(REFUNDS.reduce((a,r)=>a+r.amount,0)).toLocaleString()} total`} color={C.info} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }} className="fin-4col">
        {[{l:'Total Refund Value',v:'LKR 19,600',c:C.info},{l:'Approved',v:'1',c:C.success},{l:'Processing',v:'1',c:C.primary},{l:'Pending',v:'1',c:C.warning}].map((s,i)=>(
          <Card key={i} style={{ padding:16, textAlign:'center' as const }}>
            <p style={{ fontSize:20, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{s.v}</p>
            <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      {REFUNDS.map((r,i)=>(
        <Card key={i} hover style={{ padding:22, marginBottom:10 }}>
          <div style={{ display:'flex', gap:14, alignItems:'flex-start', flexWrap:'wrap' as const }}>
            <div style={{ flex:1, minWidth:160 }}>
              <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                <p style={{ fontSize:13, fontWeight:700, color:C.primary }}>{r.id}</p>
                <PSBdg status={r.status} />
              </div>
              <p style={{ fontSize:11, color:C.type, marginBottom:2 }}>Booking: <strong>{r.booking}</strong> · Client: <strong>{r.client}</strong></p>
              <p style={{ fontSize:11, color:C.muted, marginBottom:4 }}>Reason: {r.reason}</p>
              <p style={{ fontSize:10, color:C.muted }}>Filed: {r.date}</p>
            </div>
            <div style={{ textAlign:'right' as const }}>
              <p style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:8 }}>{fmt(r.amount)}</p>
              {r.status==='pending'&&(
                <div style={{ display:'flex', gap:6 }}>
                  <Btn label="Approve" variant="success" small icon={I.check} onClick={()=>onToast(`Refund ${r.id} approved`)} />
                  <Btn label="Reject" variant="danger" small onClick={()=>onToast(`Refund ${r.id} rejected`)} />
                </div>
              )}
              {r.status==='processing'&&<Bdg label="Processing — 1-3 days" color={C.primary} />}
              {r.status==='approved'&&<Bdg label="Refunded to Card" color={C.success} dot />}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Dispute Center ───────────────────────────────────────────────────────────
function DisputeCenter({ onToast }:{ onToast:(m:string)=>void }) {
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Dispute Center</h2>
        <Bdg label={`${DISPUTES.filter(d=>d.status!=='resolved').length} open`} color={C.error} dot />
      </div>
      {DISPUTES.map((d,i)=>(
        <Card key={i} hover style={{ padding:22, marginBottom:12, border:`1.5px solid ${d.status==='pending'?C.warning+'40':C.border}` }}>
          <div style={{ display:'flex', gap:14, flexWrap:'wrap' as const }}>
            <div style={{ flex:1, minWidth:180 }}>
              <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:6 }}>
                <p style={{ fontSize:13, fontWeight:700, color:C.primary }}>{d.id}</p>
                <Bdg label={d.status==='pending'?'Open':'Resolved'} color={d.status==='pending'?C.warning:C.success} dot />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
                {[{l:'Booking',v:d.booking},{l:'Payment',v:d.payment},{l:'Client',v:d.client},{l:'Agent',v:d.agent},{l:'Officer',v:d.officer},{l:'Raised',v:d.raised}].map((r,j)=>(
                  <div key={j}>
                    <p style={{ fontSize:9, color:C.muted }}>{r.l}</p>
                    <p style={{ fontSize:11, fontWeight:600, color:C.type }}>{r.v}</p>
                  </div>
                ))}
              </div>
              <div style={{ padding:'10px 14px', borderRadius:10, background:`${C.warning}06`, border:`1px solid ${C.warning}20` }}>
                <p style={{ fontSize:11, color:C.sub }}>Reason: {d.reason}</p>
              </div>
            </div>
            {d.status==='pending'&&(
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <Btn label="Investigate" variant="primary" small icon={I.eye} onClick={()=>onToast(`Opening ${d.id}`)} />
                <Btn label="Resolve — Client" variant="success" small onClick={()=>onToast('Resolved in favor of client')} />
                <Btn label="Resolve — Agent" variant="secondary" small onClick={()=>onToast('Resolved in favor of agent')} />
                <Btn label="Escalate" variant="danger" small icon={I.alert} onClick={()=>onToast('Case escalated')} />
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Wallet Management ────────────────────────────────────────────────────────
function WalletManagement({ onToast }:{ onToast:(m:string)=>void }) {
  const wallets = [
    { name:'Mohamed Ihsan',   type:'Client', balance:12500, credits:1200,  pending:0,     color:C.info    },
    { name:'Priya Fernando',  type:'Client', balance:8400,  credits:500,   pending:0,     color:C.info    },
    { name:'Kasun Perera',    type:'Agent',  balance:47650, credits:0,     pending:8500,  color:C.success },
    { name:'Dilshan R.',      type:'Agent',  balance:38420, credits:0,     pending:6200,  color:C.success },
    { name:'Platform Wallet', type:'Platform',balance:2184500,credits:0,   pending:21200, color:C.primary },
  ]
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Wallet Management</h2>
        <Btn label="Manual Transaction" variant="primary" small icon={I.plus} onClick={()=>onToast('Opening transaction form…')} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:18 }} className="fin-3col">
        {[{l:'Client Wallets Total',v:'LKR 20,900',c:C.info},{l:'Agent Wallets Total',v:'LKR 86,070',c:C.success},{l:'Platform Wallet',v:'LKR 2,184,500',c:C.primary}].map((s,i)=>(
          <Card key={i} style={{ padding:18, textAlign:'center' as const }}>
            <p style={{ fontSize:18, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{s.v}</p>
            <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      {wallets.map((w,i)=>(
        <Card key={i} hover style={{ padding:20, marginBottom:8 }}>
          <div style={{ display:'flex', gap:12, alignItems:'center', flexWrap:'wrap' as const }}>
            <UA name={w.name} size={40} color={w.color} />
            <div style={{ flex:1, minWidth:120 }}>
              <p style={{ fontSize:13, fontWeight:700, color:C.type, fontFamily:'Manrope,sans-serif' }}>{w.name}</p>
              <Bdg label={w.type} color={w.color} />
            </div>
            {[{l:'Balance',v:fmt(w.balance),c:w.color},{l:'Credits',v:w.credits?fmt(w.credits):'—',c:C.accent},{l:'Pending',v:w.pending?fmt(w.pending):'—',c:C.warning}].map((s,j)=>(
              <div key={j} style={{ textAlign:'center' as const, minWidth:80 }}>
                <p style={{ fontSize:9, color:C.muted, marginBottom:3 }}>{s.l}</p>
                <p style={{ fontSize:13, fontWeight:900, color:s.c }}>{s.v}</p>
              </div>
            ))}
            <div style={{ display:'flex', gap:6 }}>
              <Btn label="Adjust" variant="secondary" small onClick={()=>onToast(`Opening ${w.name} wallet`)} />
              <Btn label="History" variant="ghost" small icon={I.report} onClick={()=>onToast('Loading history…')} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Commission Management ────────────────────────────────────────────────────
function CommissionMgmt({ onToast }:{ onToast:(m:string)=>void }) {
  const rules = [
    { service:'Hospital Appointment Assistance', rate:'10%', min:500,   max:2500,  status:'active' },
    { service:'Dementia Care',                   rate:'12%', min:800,   max:4000,  status:'active' },
    { service:'Post-Surgery Recovery',           rate:'10%', min:600,   max:3000,  status:'active' },
    { service:'Physiotherapy Assistance',        rate:'8%',  min:400,   max:2000,  status:'active' },
    { service:'Elderly Companionship',           rate:'8%',  min:300,   max:1500,  status:'active' },
    { service:'First Booking Promo',             rate:'5%',  min:0,     max:500,   status:'promotional' },
    { service:'Referral Reward',                 rate:'LKR 250 flat', min:250, max:250, status:'referral' },
  ]
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Commission Management</h2>
        <Btn label="Add Rule" variant="primary" small icon={I.plus} onClick={()=>onToast('Opening rule builder…')} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:18 }} className="fin-3col">
        {[{l:'Avg Commission Rate',v:'10%',c:C.accent},{l:'Jan Commission',v:'LKR 1,245,000',c:C.accent},{l:'Active Rules',v:'7',c:C.primary}].map((s,i)=>(
          <Card key={i} style={{ padding:16, textAlign:'center' as const }}>
            <p style={{ fontSize:22, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{s.v}</p>
            <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      <Card style={{ overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 80px 100px 100px 120px 100px', padding:'10px 18px', background:'#FAFAFA', borderBottom:`1px solid ${C.border}` }}>
          {['Service / Rule','Rate','Min Cap','Max Cap','Type','Actions'].map((h,i)=>(
            <p key={i} style={{ fontSize:9, fontWeight:800, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.06em' }}>{h}</p>
          ))}
        </div>
        {rules.map((r,i)=>(
          <div key={i}
            onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='#FAFBFB'}
            onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}
            style={{ display:'grid', gridTemplateColumns:'1fr 80px 100px 100px 120px 100px', padding:'11px 18px', borderBottom:i<rules.length-1?`1px solid ${C.border}`:'none', transition:'background 0.12s' }}>
            <p style={{ fontSize:12, fontWeight:600, color:C.type }}>{r.service}</p>
            <p style={{ fontSize:12, fontWeight:700, color:C.accent }}>{r.rate}</p>
            <p style={{ fontSize:11, color:C.muted }}>LKR {r.min}</p>
            <p style={{ fontSize:11, color:C.muted }}>LKR {r.max}</p>
            <Bdg label={r.status} color={r.status==='active'?C.success:r.status==='promotional'?C.accent:'#8B5CF6'} dot />
            <div style={{ display:'flex', gap:4 }}>
              <button onClick={()=>onToast(`Editing ${r.service}`)} style={{ background:'none', border:'none', cursor:'pointer', color:C.primary, display:'flex', padding:3 }}>{I.eye}</button>
              <button onClick={()=>onToast(`Rule paused`)} style={{ background:'none', border:'none', cursor:'pointer', color:C.warning, display:'flex', padding:3 }}>{I.alert}</button>
            </div>
          </div>
        ))}
      </Card>
      <div style={{ marginTop:14, padding:'16px 20px', borderRadius:12, background:`${C.muted}08`, border:`1px dashed ${C.border}`, textAlign:'center' as const }}>
        <p style={{ fontSize:12, color:C.muted, fontWeight:600 }}>Rule Builder — Advanced commission logic and conditional rules coming soon</p>
      </div>
    </div>
  )
}

// ─── Reconciliation Center ────────────────────────────────────────────────────
function ReconciliationCenter({ onToast }:{ onToast:(m:string)=>void }) {
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>Reconciliation Center</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }} className="fin-4col">
        {[{l:'Expected Revenue',v:'LKR 12,500,000',c:C.primary},{l:'Received Revenue',v:'LKR 12,450,000',c:C.success},{l:'Outstanding',v:'LKR 50,000',c:C.warning},{l:'Exceptions',v:'3',c:C.error}].map((s,i)=>(
          <Card key={i} style={{ padding:16, textAlign:'center' as const, border:`1.5px solid ${s.c}15` }}>
            <p style={{ fontSize:16, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{s.v}</p>
            <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="fin-2col">
        <Card style={{ padding:22 }}>
          <SectionTitle title="Daily Reconciliation" />
          {[{d:'22 Jan',exp:'LKR 126,500',rcv:'LKR 126,500',status:'reconciled'},{d:'21 Jan',exp:'LKR 142,200',rcv:'LKR 138,000',status:'pending'},{d:'20 Jan',exp:'LKR 118,400',rcv:'LKR 118,400',status:'reconciled'},{d:'19 Jan',exp:'LKR 104,600',rcv:'LKR 104,600',status:'reconciled'},{d:'18 Jan',exp:'LKR 96,200',rcv:'LKR 88,000',status:'pending'}].map((r,i)=>(
            <div key={i} style={{ display:'flex', gap:8, padding:'9px 0', borderBottom:i<4?`1px solid ${C.border}`:'none', alignItems:'center' }}>
              <p style={{ fontSize:11, fontWeight:700, color:C.type, width:60, flexShrink:0 }}>{r.d}</p>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <p style={{ fontSize:10, color:C.muted }}>Expected</p>
                  <p style={{ fontSize:10, fontWeight:600, color:C.type }}>{r.exp}</p>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <p style={{ fontSize:10, color:C.muted }}>Received</p>
                  <p style={{ fontSize:10, fontWeight:600, color:r.status==='reconciled'?C.success:C.warning }}>{r.rcv}</p>
                </div>
              </div>
              <PSBdg status={r.status} />
            </div>
          ))}
        </Card>
        <Card style={{ padding:22 }}>
          <SectionTitle title="Exceptions" />
          {[{id:'EXC-2026-003',desc:'Payment TXN-2026-001843 gateway mismatch — LKR 4,200 discrepancy',c:C.error},{id:'EXC-2026-002',desc:'Settlement delayed — ComBank processing window exceeded',c:C.warning},{id:'EXC-2026-001',desc:'Agent payout reconciliation — manual adjustment required',c:C.warning}].map((ex,i)=>(
            <div key={i} style={{ padding:'12px 0', borderBottom:i<2?`1px solid ${C.border}`:'none' }}>
              <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:4 }}>
                <p style={{ fontSize:11, fontWeight:700, color:ex.c }}>{ex.id}</p>
                <Bdg label="Exception" color={ex.c} />
              </div>
              <p style={{ fontSize:11, color:C.muted, lineHeight:1.5, marginBottom:6 }}>{ex.desc}</p>
              <Btn label="Resolve" variant="secondary" small onClick={()=>onToast(`Resolving ${ex.id}`)} />
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

// ─── Tax Center ───────────────────────────────────────────────────────────────
function TaxCenter({ onToast }:{ onToast:(m:string)=>void }) {
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>Tax Center</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:18 }} className="fin-3col">
        {[{l:'Tax Collected Jan',v:'LKR 1,120,500',c:C.info},{l:'VAT (Placeholder)',v:'TBD',c:C.muted},{l:'Income Tax (Placeholder)',v:'TBD',c:C.muted}].map((s,i)=>(
          <Card key={i} style={{ padding:18, textAlign:'center' as const }}>
            <p style={{ fontSize:18, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{s.v}</p>
            <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="fin-2col">
        <Card style={{ padding:22 }}>
          <SectionTitle title="Tax Summary — Jan 2026" />
          {[{l:'Gross Revenue',v:'LKR 12,450,000'},{l:'Taxable Amount',v:'LKR 12,450,000'},{l:'Tax Rate Applied',v:'9%'},{l:'Tax Collected',v:'LKR 1,120,500'},{l:'Tax Remitted',v:'Placeholder — regulatory integration pending'}].map((r,i)=>(
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:i<4?`1px solid ${C.border}`:'none' }}>
              <p style={{ fontSize:11, color:C.muted }}>{r.l}</p>
              <p style={{ fontSize:11, fontWeight:600, color:i===3?C.info:C.type }}>{r.v}</p>
            </div>
          ))}
        </Card>
        <Card style={{ padding:22 }}>
          <SectionTitle title="Tax Reports" />
          {[{t:'Monthly Tax Report',d:'Jan 2026 — LKR 1,120,500 collected'},{t:'Quarterly Report',d:'Q4 2025 — LKR 3,241,200 collected'},{t:'Annual Tax Report',d:'2025 — LKR 13,642,000 collected'}].map((r,i)=>(
            <div key={i} style={{ padding:'12px 0', borderBottom:i<2?`1px solid ${C.border}`:'none' }}>
              <p style={{ fontSize:12, fontWeight:700, color:C.type, marginBottom:3 }}>{r.t}</p>
              <p style={{ fontSize:11, color:C.muted, marginBottom:8 }}>{r.d}</p>
              <div style={{ display:'flex', gap:6 }}>
                <Btn label="Export PDF" variant="secondary" small icon={I.export} onClick={()=>onToast('Exporting…')} />
                <Btn label="Export Excel" variant="ghost" small icon={I.export} onClick={()=>onToast('Exporting…')} />
              </div>
            </div>
          ))}
          <div style={{ marginTop:12, padding:'12px', borderRadius:10, background:`${C.muted}08`, border:`1px dashed ${C.border}` }}>
            <p style={{ fontSize:11, color:C.muted, textAlign:'center' as const }}>VAT & Income Tax Integration — Regulatory API pending</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

// ─── Financial Analytics — module-level data ─────────────────────────────────
const ANAL_MONTHLY = [8420,9180,9640,10200,10840,11200,11450,11820,12050,12180,12340,12450]
const ANAL_MONTHS  = ['Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan']
const ANAL_MAX_M   = Math.max(...ANAL_MONTHLY)
const ANAL_SUCCESS = [94,95,93,96,96,97,95,96,96,97,96,96]
const ANAL_COMM    = [842,918,964,1020,1084,1120,1145,1182,1205,1218,1234,1245]
const ANAL_MAX_C   = Math.max(...ANAL_COMM)

function FinancialAnalytics() {
  const monthly = ANAL_MONTHLY
  const months = ANAL_MONTHS
  const maxM = ANAL_MAX_M
  const successRate = ANAL_SUCCESS
  const commissions = ANAL_COMM
  const maxC = ANAL_MAX_C
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>Financial Analytics</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }} className="fin-2col">
        {/* Revenue Trend */}
        <Card style={{ padding:22 }}>
          <SectionTitle title="Revenue Trend (12 months)" />
          <p style={{ fontSize:11, color:C.muted, marginBottom:12 }}>LKR thousands</p>
          <svg width="100%" height="140" viewBox="0 0 320 140" preserveAspectRatio="none">
            <defs>
              <linearGradient id="finAnalGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.primary} stopOpacity="0.15"/>
                <stop offset="100%" stopColor={C.primary} stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d={`M${monthly.map((v,i)=>`${i*(320/11)},${130-((v/maxM)*110)}`).join('L')} L320,130 L0,130 Z`} fill="url(#finAnalGrad)"/>
            <polyline points={monthly.map((v,i)=>`${i*(320/11)},${130-((v/maxM)*110)}`).join(' ')} fill="none" stroke={C.primary} strokeWidth="2.5" strokeLinejoin="round"/>
          </svg>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:4 }}>
            {months.map(m=><p key={m} style={{ fontSize:7, color:C.muted }}>{m}</p>)}
          </div>
        </Card>
        {/* Payment Success Rate */}
        <Card style={{ padding:22 }}>
          <SectionTitle title="Payment Success Rate (%)" />
          <div style={{ display:'flex', alignItems:'flex-end', gap:6, height:110, marginBottom:8, marginTop:8 }}>
            {successRate.map((v,i)=>(
              <div key={i} style={{ flex:1, height:`${((v-90)/10)*100}%`, background:`${C.success}${Math.round((v-90)/10*255).toString(16).padStart(2,'0')}`, borderRadius:'4px 4px 0 0', display:'flex', alignItems:'flex-start', justifyContent:'center' }}>
                <p style={{ fontSize:7, color:C.success, paddingTop:2 }}>{v}</p>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            {months.map(m=><p key={m} style={{ fontSize:7, color:C.muted }}>{m}</p>)}
          </div>
        </Card>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }} className="fin-3col">
        {/* Commission Trend */}
        <Card style={{ padding:22 }}>
          <SectionTitle title="Commission Trend" />
          <svg width="100%" height="80" viewBox="0 0 200 80" preserveAspectRatio="none">
            <polyline points={commissions.map((v,i)=>`${i*(200/11)},${75-((v/maxC)*65)}`).join(' ')} fill="none" stroke={C.accent} strokeWidth="2.5" strokeLinejoin="round"/>
          </svg>
          <p style={{ fontSize:12, fontWeight:700, color:C.accent, marginTop:6 }}>LKR 1,245,000 Jan</p>
        </Card>
        {/* Top Services */}
        <Card style={{ padding:22 }}>
          <SectionTitle title="Top Services by Revenue" />
          {[{s:'Hospital Appointment',v:'LKR 4,240,000',pct:34},{s:'Dementia Care',v:'LKR 3,112,000',pct:25},{s:'Post-Surgery Recovery',v:'LKR 2,490,000',pct:20},{s:'Physiotherapy',v:'LKR 1,494,000',pct:12}].map((s,i)=>(
            <div key={i} style={{ marginBottom:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                <p style={{ fontSize:10, color:C.muted }}>{s.s}</p>
                <p style={{ fontSize:10, fontWeight:700, color:C.type }}>{s.pct}%</p>
              </div>
              <div style={{ height:4, borderRadius:99, background:`${C.primary}10` }}>
                <div style={{ width:`${s.pct}%`, height:'100%', background:C.primary, borderRadius:99 }}/>
              </div>
            </div>
          ))}
        </Card>
        {/* Top Cities */}
        <Card style={{ padding:22 }}>
          <SectionTitle title="Revenue by City" />
          {[{c:'Colombo',v:'LKR 6,225,000',pct:50},{c:'Kandy',v:'LKR 2,490,000',pct:20},{c:'Galle',v:'LKR 1,494,000',pct:12},{c:'Negombo',v:'LKR 996,000',pct:8},{c:'Jaffna',v:'LKR 747,000',pct:6}].map((c,i)=>(
            <div key={i} style={{ display:'flex', gap:8, padding:'6px 0', borderBottom:i<4?`1px solid ${C.border}`:'none', alignItems:'center' }}>
              <p style={{ fontSize:11, color:C.type, flex:1 }}>{c.c}</p>
              <p style={{ fontSize:10, color:C.muted }}>{c.v}</p>
              <p style={{ fontSize:10, fontWeight:700, color:C.primary }}>{c.pct}%</p>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

// ─── Export Center ────────────────────────────────────────────────────────────
function ExportCenter({ onToast }:{ onToast:(m:string)=>void }) {
  const exports = [
    { t:'Financial Statements',    d:'Complete P&L and balance — Jan 2026'   },
    { t:'Revenue Report',          d:'Gross, net, and platform fees — Jan 2026' },
    { t:'Commission Report',       d:'All service commissions and referral rewards' },
    { t:'Payout Report',           d:'All agent payout transactions — Jan 2026' },
    { t:'Refund Report',           d:'All refund requests and resolutions'    },
    { t:'Dispute Report',          d:'Disputes filed, resolved, and pending'  },
    { t:'Tax Report',              d:'Tax collected and tax summary — Jan 2026' },
    { t:'Accounting Export',       d:'QuickBooks / Xero compatible export format' },
  ]
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>Export Center</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        {exports.map((ex,i)=>(
          <Card key={i} hover style={{ padding:22 }}>
            <div style={{ display:'flex', gap:14 }}>
              <div style={{ width:44, height:44, borderRadius:14, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ display:'flex', color:C.primary, transform:'scale(1.2)' }}>{I.export}</span>
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:4 }}>{ex.t}</p>
                <p style={{ fontSize:11, color:C.muted, lineHeight:1.5, marginBottom:12 }}>{ex.d}</p>
                <div style={{ display:'flex', gap:6 }}>
                  <Btn label="PDF" variant="secondary" small icon={I.export} onClick={()=>onToast(`Exporting ${ex.t} PDF…`)} />
                  <Btn label="Excel" variant="secondary" small icon={I.export} onClick={()=>onToast(`Exporting ${ex.t} Excel…`)} />
                  <Btn label="CSV" variant="ghost" small icon={I.export} onClick={()=>onToast(`Exporting ${ex.t} CSV…`)} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Bank & Gateway Management ────────────────────────────────────────────────
function BankGatewayMgmt({ onToast }:{ onToast:(m:string)=>void }) {
  const gateways = [
    { name:'Stripe Gateway',  type:'Card Processing', status:'operational', txns:1284, vol:'LKR 11,206,000', uptime:'99.98%' },
    { name:'PayHere',         type:'Local Cards/Bank', status:'operational', txns:284,  vol:'LKR 2,412,000',  uptime:'99.85%' },
    { name:'ComBank POS',     type:'Bank Transfer',    status:'degraded',   txns:42,   vol:'LKR 504,000',    uptime:'94.20%' },
  ]
  const banks = [
    { name:'Commercial Bank Account',      acc:'LKR **8812', status:'connected', balance:'LKR 8,420,000' },
    { name:'HNB Operating Account',        acc:'LKR **2241', status:'connected', balance:'LKR 4,210,000' },
    { name:'Agent Payout Pool (BOC)',       acc:'LKR **5571', status:'connected', balance:'LKR 2,184,500' },
  ]
  const sc = (s:string) => s==='operational'?C.success:s==='degraded'?C.warning:C.error
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>Bank & Gateway Management</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="fin-2col">
        <div>
          <SectionTitle title="Payment Gateways" />
          {gateways.map((g,i)=>(
            <Card key={i} style={{ padding:20, marginBottom:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                <div>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{g.name}</p>
                  <p style={{ fontSize:10, color:C.muted }}>{g.type}</p>
                </div>
                <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:sc(g.status) }}/>
                  <p style={{ fontSize:10, fontWeight:700, color:sc(g.status) }}>{g.status.charAt(0).toUpperCase()+g.status.slice(1)}</p>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
                {[{l:'Transactions',v:g.txns.toLocaleString()},{l:'Volume',v:g.vol},{l:'Uptime',v:g.uptime}].map((s,j)=>(
                  <div key={j}>
                    <p style={{ fontSize:9, color:C.muted }}>{s.l}</p>
                    <p style={{ fontSize:11, fontWeight:700, color:C.type }}>{s.v}</p>
                  </div>
                ))}
              </div>
              {g.status==='degraded'&&<div style={{ marginTop:10, padding:'6px 10px', borderRadius:8, background:`${C.warning}10`, border:`1px solid ${C.warning}20` }}><p style={{ fontSize:10, color:C.warning, fontWeight:700 }}>Gateway degraded — monitoring settlement delays</p></div>}
            </Card>
          ))}
        </div>
        <div>
          <SectionTitle title="Connected Bank Accounts" />
          {banks.map((b,i)=>(
            <Card key={i} style={{ padding:20, marginBottom:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                <div>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{b.name}</p>
                  <p style={{ fontSize:10, color:C.muted }}>{b.acc}</p>
                </div>
                <Bdg label="Connected" color={C.success} dot />
              </div>
              <p style={{ fontSize:18, fontWeight:900, color:C.primary, fontFamily:'Manrope,sans-serif', marginBottom:10 }}>{b.balance}</p>
              <Btn label="View Statement" variant="ghost" small icon={I.report} onClick={()=>onToast('Loading statement…')} />
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Scheduled Payouts Calendar ───────────────────────────────────────────────
function ScheduledPayouts({ onToast }:{ onToast:(m:string)=>void }) {
  const days = Array.from({length:31},(_,i)=>i+1)
  const events: Record<number,{type:string;v:string;c:string}[]> = {
    24: [{type:'Payout',v:'LKR 184,670',c:C.success}],
    25: [{type:'Payout',v:'LKR 108,850',c:C.primary}],
    26: [{type:'Bank Holiday',v:'National Day',c:C.muted}],
    28: [{type:'Settlement',v:'LKR 12,450,000',c:C.accent}],
    31: [{type:'Monthly Close',v:'End of Jan',c:C.info}],
  }
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Scheduled Payouts — January 2026</h2>
        <Btn label="Schedule Payout" variant="primary" small icon={I.plus} onClick={()=>onToast('Opening payout scheduler…')} />
      </div>
      <Card style={{ padding:22 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4, marginBottom:4 }}>
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=>(
            <p key={d} style={{ fontSize:10, fontWeight:700, color:C.muted, textAlign:'center' as const, padding:'4px 0' }}>{d}</p>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4 }}>
          {/* Jan 2026 starts Wednesday — offset 2 cells */}
          {[...Array(2)].map((_,i)=><div key={`off${i}`}/>)}
          {days.map(d=>{
            const evts = events[d]
            const isPast = d <= 22
            return (
              <div key={d}
                onMouseEnter={e=>{ if(evts)(e.currentTarget as HTMLDivElement).style.borderColor=C.primary }}
                onMouseLeave={e=>{ if(evts)(e.currentTarget as HTMLDivElement).style.borderColor=evts?evts[0].c+'40':C.border }}
                onClick={()=>evts&&onToast(`${evts[0].type}: ${evts[0].v}`)}
                style={{ minHeight:58, padding:6, borderRadius:8, border:`1.5px solid ${evts?evts[0].c+'40':C.border}`, background:isPast?'#FAFAFA':'#fff', cursor:evts?'pointer':'default', transition:'all 0.12s' }}>
                <p style={{ fontSize:11, fontWeight:d===22?900:400, color:d===22?C.primary:isPast?C.muted:C.type, marginBottom:2 }}>{d}</p>
                {evts&&evts.map((ev,j)=>(
                  <div key={j} style={{ padding:'1px 4px', borderRadius:4, background:`${ev.c}15`, marginBottom:2 }}>
                    <p style={{ fontSize:8, fontWeight:700, color:ev.c, lineHeight:1.4 }}>{ev.type}</p>
                    <p style={{ fontSize:7, color:ev.c }}>{ev.v}</p>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

// ─── Notifications ────────────────────────────────────────────────────────────
function FinNotifications() {
  const items = [
    { t:'Payment Received',     b:'Mohamed Ihsan — LKR 8,500 received for RP-2026-000184.',c:C.success, read:false },
    { t:'Payment Failed',       b:'Nirosha J. — LKR 7,400 payment failed. Gateway timeout.',c:C.error,  read:false },
    { t:'Refund Requested',     b:'Mohamed Ihsan — Refund request REF-2026-00041 submitted.',c:C.warning,read:false },
    { t:'Chargeback Alert',     b:'Priya Fernando — Chargeback filed. DSP-2026-00018 raised.',c:'#DC2626',read:false },
    { t:'Payout Completed',     b:'Kasun Perera — LKR 47,650 payout batch completed.',       c:C.success,read:true  },
    { t:'Settlement Failed',    b:'ComBank gateway — January 21 settlement delayed.',         c:C.error,  read:true  },
    { t:'Invoice Overdue',      b:'INV-2026-00281 — Sampath J. overdue. Reminder not sent.', c:'#F97316',read:true  },
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
function FinReports({ onToast }:{ onToast:(m:string)=>void }) {
  const reports = [
    {t:'Daily Revenue Report',    d:'22 Jan 2026 — LKR 126,500 total'     },
    {t:'Monthly Revenue Report',  d:'Jan 2026 — LKR 12,450,000 total'     },
    {t:'Payout Report',           d:'All agent payouts — Jan 2026'         },
    {t:'Refund Report',           d:'3 refunds totalling LKR 19,600'       },
    {t:'Dispute Report',          d:'2 disputes — 1 open, 1 resolved'     },
    {t:'Tax Report',              d:'LKR 1,120,500 collected — Jan 2026'  },
    {t:'Commission Report',       d:'LKR 1,245,000 platform fees — Jan 2026'},
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
                <p style={{ fontSize:11, color:C.muted, marginBottom:10 }}>{r.d}</p>
                <div style={{ display:'flex', gap:6 }}>
                  <Btn label="View" variant="ghost" small icon={I.eye} onClick={()=>onToast(`Opening ${r.t}…`)} />
                  <Btn label="PDF" variant="secondary" small icon={I.export} onClick={()=>onToast('Exporting…')} />
                  <Btn label="Excel" variant="secondary" small icon={I.export} onClick={()=>onToast('Exporting…')} />
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
        {Object.entries(PSTATUS).map(([k,s],i)=>(
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
        {[{t:'No Payments',d:'No payment transactions have been recorded yet.'},{t:'No Refunds',d:'No refund requests have been submitted.'},{t:'No Disputes',d:'No active payment disputes at this time.'},{t:'No Reports',d:'No financial reports have been generated.'}].map((s,i)=>(
          <Card key={i} style={{ padding:'38px 22px', textAlign:'center' as const }}>
            <div style={{ width:48, height:48, borderRadius:16, background:`${C.primary}08`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
              <span style={{ display:'flex', color:`${C.primary}60`, transform:'scale(1.3)' }}>{I.money}</span>
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
        {['Loading Payments','Loading Revenue','Loading Analytics','Loading Reports'].map((l,i)=>(
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
      {[{t:'Payment Error',         d:'Payment could not be processed. Check gateway status.',c:C.error},{t:'Gateway Error',          d:'Payment gateway is unreachable. ComBank connection failed.',c:C.error},{t:'Reconciliation Error',    d:'Reconciliation data could not load. Try again.',c:C.warning}].map((er,i)=>(
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
      {[{t:'Refund Approved',      d:'REF-2026-00041 — LKR 8,500 refunded to Mohamed Ihsan.',  c:C.success},{t:'Payout Completed',     d:'Kasun Perera — LKR 47,650 payout batch completed.',       c:C.success},{t:'Invoice Generated',    d:'INV-2026-00285 generated and sent to Mohamed Ihsan.',      c:C.primary},{t:'Settlement Complete',  d:'January 22 daily settlement — LKR 126,500 reconciled.',   c:C.success}].map((s,i)=>(
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

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function FinanceDashboard() {
    const [TRANSACTIONS, setTRANSACTIONS] = useState<any[]>([])
  const [AGENTS_PAYOUTS, setAGENTS_PAYOUTS] = useState<any[]>([])

  useEffect(() => {
    async function loadTransactions() {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          id, amount, method, status, created_at,
          client:profiles!client_id(full_name),
          agent:profiles!agent_id(full_name)
        `)
      if (error) { console.error(error); return }
      const statusMap: Record<string, string> = {
        pending: 'pending', completed: 'paid', failed: 'failed', refunded: 'refunded',
      }
      const mapped = (data || []).map((t: any) => ({
        id: t.id,
        booking: 'N/A',
        client: t.client?.full_name || 'Unknown',
        beneficiary: 'N/A',
        agent: t.agent?.full_name || 'Unassigned',
        method: t.method || 'N/A',
        gross: t.amount,
        fee: 0,
        net: t.amount,
        tax: 0,
        status: statusMap[t.status] || t.status,
        date: t.created_at ? new Date(t.created_at).toLocaleDateString() : 'N/A',
      }))
      setTRANSACTIONS(mapped)
    }
    async function loadPayouts() {
      const { data, error } = await supabase
        .from('payouts')
        .select(`
          amount, status,
          agent:profiles!agent_id(full_name)
        `)
      if (error) { console.error(error); return }
      const mapped = (data || []).map((p: any) => ({
        name: p.agent?.full_name || 'Unknown',
        available: p.status === 'pending' ? p.amount : 0,
        pending: p.status === 'pending' ? p.amount : 0,
        scheduled: p.status === 'processing' ? p.amount : 0,
        completed: p.status === 'paid' ? p.amount : 0,
        bank: 'N/A',
        status: p.status === 'paid' ? 'approved' : 'pending',
      }))
      setAGENTS_PAYOUTS(mapped)
    }
    loadTransactions()
    loadPayouts()
  }, [])

  const [sub, setSub] = useState<SubView>('home')
  const [toast, setToast] = useState<string|null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const showToast = (m:string) => { setToast(m); setTimeout(()=>setToast(null),2800) }
  const groups = [...new Set(NAV.map(n=>n.group))]

  const renderMain = () => {
    switch(sub) {
      case 'home':           return <FinanceHome onNav={setSub} onToast={showToast} TRANSACTIONS={TRANSACTIONS} />
      case 'kpis':           return <FinancialKPIs />
      case 'payments':       return <PaymentDirectory onNav={setSub} onToast={showToast} TRANSACTIONS={TRANSACTIONS} />
      case 'paymentDetail':  return <PaymentDetails onToast={showToast} TRANSACTIONS={TRANSACTIONS} />
      case 'invoices':       return <ClientInvoices onToast={showToast} />
      case 'payouts':        return <AgentPayouts onNav={setSub} onToast={showToast} AGENTS_PAYOUTS={AGENTS_PAYOUTS} />
      case 'payoutWorkflow': return <PayoutWorkflow onToast={showToast} />
      case 'refunds':        return <RefundManagement onToast={showToast} />
      case 'disputes':       return <DisputeCenter onToast={showToast} />
      case 'wallets':        return <WalletManagement onToast={showToast} />
      case 'commission':     return <CommissionMgmt onToast={showToast} />
      case 'reconciliation': return <ReconciliationCenter onToast={showToast} />
      case 'tax':            return <TaxCenter onToast={showToast} />
      case 'analytics':      return <FinancialAnalytics />
      case 'export':         return <ExportCenter onToast={showToast} />
      case 'banking':        return <BankGatewayMgmt onToast={showToast} />
      case 'schedule':       return <ScheduledPayouts onToast={showToast} />
      case 'notifications':  return <FinNotifications />
      case 'reports':        return <FinReports onToast={showToast} />
      case 'statusBadges':   return <StatusBadgesView />
      case 'empty':          return <EmptyStates />
      case 'loading':        return <LoadingStates />
      case 'error':          return <ErrorStates onToast={showToast} />
      case 'success':        return <SuccessStates />
      default: return null
    }
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:C.bg, fontFamily:'Manrope,sans-serif' }}>
      {/* Dark sidebar */}
      <div className="fin-sidebar" style={{ width:216, background:C.dark, display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh', overflowY:'auto', flexShrink:0 }}>
        <div style={{ padding:'16px 18px 14px', borderBottom:`1px solid ${C.darkSub}` }}>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <div style={{ width:30, height:30, borderRadius:9, background:`linear-gradient(135deg,${C.accent},#D45F2A)`, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ display:'flex', color:'white', transform:'scale(0.9)' }}>{I.money}</span>
            </div>
            <div>
              <p style={{ fontSize:13, fontWeight:900, color:'rgba(255,255,255,0.95)', fontFamily:'Manrope,sans-serif', lineHeight:1 }}>ReadyPal</p>
              <p style={{ fontSize:9, color:'rgba(255,255,255,0.4)', fontWeight:700, textTransform:'uppercase' as const, letterSpacing:'0.08em' }}>Finance</p>
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
                  style={{ width:'100%', display:'flex', gap:9, alignItems:'center', padding:'9px 18px', border:'none', background:active?`${C.accent}22`:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:active?700:400, color:active?'rgba(255,255,255,0.95)':'rgba(255,255,255,0.5)', textAlign:'left' as const, borderLeft:active?`3px solid ${C.accent}`:'3px solid transparent', transition:'all 0.12s' }}>
                  <span style={{ display:'flex', color:active?C.accent:'rgba(255,255,255,0.32)', flexShrink:0 }}>{n.icon}</span>
                  <span style={{ flex:1 }}>{n.l}</span>
                  {n.badge&&n.badge>0&&(
                    <div style={{ minWidth:18, height:18, borderRadius:99, background:C.accent, color:'#fff', fontSize:9, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 5px' }}>{n.badge}</div>
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
              <p style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.9)' }}>Finance</p>
            </div>
            {NAV.map(n=>(
              <button key={n.k} onClick={()=>{ setSub(n.k); setSidebarOpen(false) }}
                style={{ width:'100%', display:'flex', gap:9, alignItems:'center', padding:'10px 18px', border:'none', background:sub===n.k?`${C.accent}22`:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:sub===n.k?700:400, color:sub===n.k?'rgba(255,255,255,0.95)':'rgba(255,255,255,0.5)', textAlign:'left' as const }}>
                <span style={{ display:'flex', color:sub===n.k?C.accent:'rgba(255,255,255,0.32)' }}>{n.icon}</span>{n.l}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        {/* Header */}
        <div style={{ height:52, background:C.surface, borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', paddingInline:20, gap:12, position:'sticky', top:0, zIndex:30, flexShrink:0 }}>
          <button className="fin-menu-btn" onClick={()=>setSidebarOpen(v=>!v)}
            style={{ background:'none', border:'none', cursor:'pointer', color:C.type, padding:4, display:'none' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
          <div style={{ flex:1, display:'flex', gap:8, alignItems:'center', maxWidth:360, padding:'7px 12px', borderRadius:9, border:`1px solid ${C.border}`, background:'#FAFAFA' }}>
            <span style={{ display:'flex', color:C.muted }}>{I.eye}</span>
            <input placeholder="Search transactions, invoices, agents…" style={{ border:'none', background:'transparent', fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, outline:'none', flex:1 }} onFocus={()=>setSub('payments')} />
          </div>
          <div style={{ marginLeft:'auto', display:'flex', gap:6, alignItems:'center' }}>
            <div style={{ display:'flex', gap:5, alignItems:'center', padding:'4px 10px', borderRadius:99, background:`${C.success}12`, border:`1px solid ${C.success}25` }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:C.success }}/>
              <p style={{ fontSize:10, fontWeight:700, color:C.success }}>LKR 12.45M</p>
            </div>
            <Bdg label="1 dispute" color={C.warning} dot />
          </div>
        </div>
        <div style={{ flex:1, overflowY:'auto' }}>
          {renderMain()}
        </div>
      </div>

      {toast&&<Toast msg={toast} />}
    </div>
  )
}
