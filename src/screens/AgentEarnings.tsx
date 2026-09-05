import { useState, useEffect, useMemo, type ReactNode, type CSSProperties } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  getMyProfile,
  getMyCompletedBookings,
  getMyTransactions,
  getMyPayouts,
  getMyBankAccount,
  saveMyBankAccount,
} from '../lib/api'

// ─── Brand ────────────────────────────────────────────────────────────────────
const C = {
  primary:'#00737A', accent:'#EE8153', type:'#2C3E43', sub:'#6B7E85',
  muted:'#9AAAB0', border:'#E4E8EA', bg:'#F2F4F5', surface:'#FFFFFF',
  success:'#22C55E', warning:'#F59E0B', error:'#EF4444', info:'#3B82F6',
}
// LKR is the only currency assumed for bookings.payment_amount and
// payouts.amount (neither table has a currency column, and the rest of the
// app already assumes LKR). transactions.amount DOES have a real currency
// column, so transaction-specific views use fmtCurrency instead.
const fmt = (n:number) => `LKR ${Math.round(n).toLocaleString()}`
const fmtCurrency = (n:number, currency?:string|null) => `${currency || 'LKR'} ${Math.round(n).toLocaleString()}`

// ─── Icons ────────────────────────────────────────────────────────────────────
const I: Record<string,ReactNode> = {
  chevL:     <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  wallet:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="3" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M1 6h12" stroke="currentColor" strokeWidth="1.3"/><circle cx="10.5" cy="8.5" r="1" fill="currentColor"/></svg>,
  trending:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 10l3.5-3.5 3 3L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8.5 4H11v2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  download:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2v7M4 6.5L6.5 9 9 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M1.5 10.5h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  bank:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 5.5l5.5-4 5.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><rect x="2" y="5.5" width="9" height="5" stroke="currentColor" strokeWidth="1.3"/><path d="M1 10.5h11M4 5.5v5M7 5.5v5M10 5.5v5" stroke="currentColor" strokeWidth="1.1"/></svg>,
  gift:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="5" width="11" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M6.5 5V12M1 7.5h11" stroke="currentColor" strokeWidth="1.1"/><path d="M4.5 5C4.5 3.5 6.5 2.5 6.5 5M8.5 5C8.5 3.5 6.5 2.5 6.5 5" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/></svg>,
  target:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.3"/><circle cx="6.5" cy="6.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/><circle cx="6.5" cy="6.5" r="0.8" fill="currentColor"/></svg>,
  star:      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M6 1l1.5 3 3.3.5-2.4 2.3.6 3.3L6 8.8 3 10.1l.6-3.3L1.2 4.5l3.3-.5L6 1z"/></svg>,
  chevR:     <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  check:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 6.5l3 3.5 5-6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  refresh:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M11 6.5a4.5 4.5 0 1 1-1-2.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M11 3v2.5H8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  alert:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5L1 12h11L6.5 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M6.5 5.5v3M6.5 10v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  copy:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M1 9V2.5A1.5 1.5 0 0 1 2.5 1H9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  share:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="10.5" cy="2.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="2.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="10.5" cy="10.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 5.5l5-2.5M4 7.5l5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  edit:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M9.5 1.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  trash:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 3.5h9M5 3.5V2h3v1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M3.5 3.5l.5 7.5h5l.5-7.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  people:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5" cy="4" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M1 11c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="10" cy="4.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M12 11c0-1.66-1.34-3-3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
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
  variant?:'primary'|'secondary'|'ghost'|'danger'|'accent'|'success'
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

// ─── SVG Bar Chart ────────────────────────────────────────────────────────────
function BarChart({ data, color=C.primary, height=120 }:{ data:{label:string;value:number}[]; color?:string; height?:number }) {
  const max = Math.max(...data.map(d=>d.value), 1)
  const w = 560, pad = 32
  const bw = (w - pad*2) / data.length
  return (
    <svg viewBox={`0 0 ${w} ${height+32}`} style={{ width:'100%', overflow:'visible' }}>
      {data.map((d,i)=>{
        const bh = (d.value/max)*(height-8)
        const x = pad + i*bw + bw*0.15
        const bwActual = bw*0.7
        return (
          <g key={i}>
            <rect x={x} y={height-bh} width={bwActual} height={bh} rx={5} fill={`${color}30`}/>
            <rect x={x} y={height-bh} width={bwActual} height={Math.min(bh,6)} rx={5} fill={color} opacity={0.9}/>
            {bh>6&&<rect x={x} y={height-bh+4} width={bwActual} height={bh-6} fill={`${color}18`}/>}
            <text x={x+bwActual/2} y={height+20} textAnchor="middle" fontSize={9} fill={C.muted} fontFamily="Manrope,sans-serif">{d.label}</text>
          </g>
        )
      })}
    </svg>
  )
}

function LineChart({ data, color=C.primary, height=100 }:{ data:{label:string;value:number}[]; color?:string; height?:number }) {
  const max = Math.max(...data.map(d=>d.value), 1)
  const w = 560, pad = 28
  const step = (w-pad*2)/(data.length-1)
  const pts = data.map((d,i)=>({ x:pad+i*step, y:height-(d.value/max)*(height-12)+4 }))
  const pathD = pts.map((p,i)=>i===0?`M${p.x},${p.y}`:`L${p.x},${p.y}`).join(' ')
  const areaD = `${pathD} L${pts[pts.length-1].x},${height} L${pts[0].x},${height} Z`
  return (
    <svg viewBox={`0 0 ${w} ${height+28}`} style={{ width:'100%', overflow:'visible' }}>
      <defs>
        <linearGradient id={`lg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.01"/>
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#lg-${color.replace('#','')})`}/>
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

// ─── Status config ────────────────────────────────────────────────────────────
// A convenience color/label palette for status strings we've actually seen
// or reasonably expect. It is never treated as the exhaustive set of valid
// values — statusMeta() falls back gracefully for anything not listed here,
// since real transactions/payouts status values are used exactly as
// returned by Supabase.
const PAY_STATUS: Record<string,{color:string;label:string}> = {
  pending:    { color:C.warning, label:'Pending'    },
  processing: { color:C.info,    label:'Processing' },
  paid:       { color:C.success, label:'Paid'       },
  completed:  { color:C.success, label:'Completed'  },
  scheduled:  { color:C.primary, label:'Scheduled'  },
  failed:     { color:C.error,   label:'Failed'     },
  cancelled:  { color:C.muted,   label:'Cancelled'  },
}
function statusMeta(status?:string|null):{color:string;label:string} {
  if(!status) return { color:C.muted, label:'Unknown' }
  const known = PAY_STATUS[status.toLowerCase()]
  if(known) return known
  return { color:C.muted, label: status.charAt(0).toUpperCase()+status.slice(1).replace(/_/g,' ') }
}

// ─── Real data shapes ─────────────────────────────────────────────────────────
// These mirror the confirmed Supabase schema. bookings.payment_amount
// (status = 'completed') is the source of truth for gross earnings —
// transactions is a separate, supplementary payment-record table.
type CompletedBooking = {
  id:string; payment_amount:number|null; status:string
  scheduled_date:string|null; scheduled_time:string|null; duration:string|null
  location:string|null; created_at:string
  care_request:{ id:string; title:string|null; service_type:string|null } | null
  client:{ id:string; full_name:string|null } | null
}

type TransactionRow = {
  id:string; booking_id:string|null; amount:number|null; currency:string|null
  method:string|null; type:string|null; status:string|null; invoice_url:string|null
  created_at:string
  booking:{ id:string; scheduled_date:string|null; care_request:{ title:string|null; service_type:string|null } | null } | null
  client:{ id:string; full_name:string|null } | null
}

type PayoutRow = {
  id:string; agent_id:string; amount:number|null; status:string
  bank_account_id:string|null; requested_at:string|null; paid_at:string|null
}

type BankAccount = {
  id:string; agent_id:string; bank_name:string|null; branch:string|null
  account_name:string|null; account_number:string|null; swift_code:string|null
  payout_preference:string|null; is_default:boolean|null
  verification_status:string|null; verified_at:string|null
}

// ─── Date / formatting helpers ─────────────────────────────────────────────────
// The earnings date for a booking is scheduled_date when present, falling
// back to created_at's calendar date — never fabricated.
function bookingDateStr(b:CompletedBooking):string|null {
  return b.scheduled_date ?? b.created_at?.slice(0,10) ?? null
}
function bookingLabel(b:CompletedBooking):string {
  return b.care_request?.title || b.care_request?.service_type || 'Service'
}
function bookingClientName(b:CompletedBooking):string {
  return b.client?.full_name || 'Client not provided'
}
function hasAmount(b:CompletedBooking):boolean {
  return typeof b.payment_amount === 'number'
}
function bookingAmount(b:CompletedBooking):number {
  return hasAmount(b) ? (b.payment_amount as number) : 0
}
function isoDate(d:Date):string {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}
function startOfWeek(d:Date):Date {
  const copy = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const day = copy.getDay()
  copy.setDate(copy.getDate() + (day===0?-6:1-day)) // Monday as week start
  return copy
}
function sumBookings(bookings:CompletedBooking[], predicate:(dateStr:string)=>boolean):number {
  return bookings.reduce((sum,b)=>{
    const ds = bookingDateStr(b)
    if(!ds || !hasAmount(b)) return sum
    return predicate(ds) ? sum+bookingAmount(b) : sum
  }, 0)
}
function formatDateLabel(dateStr?:string|null):string {
  if(!dateStr) return 'Not recorded'
  const d = new Date(dateStr.length<=10 ? `${dateStr}T00:00:00` : dateStr)
  if(Number.isNaN(d.getTime())) return 'Not recorded'
  return d.toLocaleDateString('en-GB',{ day:'numeric', month:'short', year:'numeric' })
}
function formatDateTimeLabel(iso?:string|null):string {
  if(!iso) return 'Not recorded'
  const d = new Date(iso)
  if(Number.isNaN(d.getTime())) return 'Not recorded'
  return d.toLocaleString('en-GB',{ day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })
}
function maskAccountNumber(num?:string|null):string {
  if(!num || num.length<4) return 'Not provided'
  return `•••• •••• •••• ${num.slice(-4)}`
}

// ─── Earnings aggregation ──────────────────────────────────────────────────────
// All figures below are derived only from real completed bookings — nothing
// here is invented, and periods with no data simply total 0.
type EarningsSummary = {
  today:number; yesterday:number
  week:number; prevWeek:number; weekCount:number
  month:number; prevMonth:number
  year:number; prevYear:number
  total:number; completedCount:number
  weeklyChart:{label:string;value:number}[]
  monthlyChart:{label:string;value:number}[]
  bestDay:{label:string;value:number}|null
  dailyAvgThisWeek:number
}
function computeEarningsSummary(bookings:CompletedBooking[], now:Date):EarningsSummary {
  const inRange = (ds:string, from:Date, to:Date) => ds>=isoDate(from) && ds<=isoDate(to)
  const todayStr = isoDate(now)
  const yestDate = new Date(now); yestDate.setDate(yestDate.getDate()-1)

  const weekStart = startOfWeek(now)
  const weekEnd = new Date(weekStart); weekEnd.setDate(weekEnd.getDate()+6)
  const prevWeekStart = new Date(weekStart); prevWeekStart.setDate(prevWeekStart.getDate()-7)
  const prevWeekEnd = new Date(weekStart); prevWeekEnd.setDate(prevWeekEnd.getDate()-1)

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthEnd = new Date(now.getFullYear(), now.getMonth()+1, 0)
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth()-1, 1)
  const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

  const yearStart = new Date(now.getFullYear(), 0, 1)
  const yearEnd = new Date(now.getFullYear(), 11, 31)
  const prevYearStart = new Date(now.getFullYear()-1, 0, 1)
  const prevYearEnd = new Date(now.getFullYear()-1, 11, 31)

  const dayLabels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  const weeklyChart = dayLabels.map((label,i)=>{
    const d = new Date(weekStart); d.setDate(d.getDate()+i)
    const ds = isoDate(d)
    return { label, value: sumBookings(bookings, x=>x===ds) }
  })
  const bestDay = weeklyChart.reduce<{label:string;value:number}|null>((best,d)=>(!best||d.value>best.value)?d:best, null)

  const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const monthlyChart = monthLabels.map((label,i)=>{
    const from = new Date(now.getFullYear(), i, 1)
    const to = new Date(now.getFullYear(), i+1, 0)
    return { label, value: sumBookings(bookings, ds=>inRange(ds, from, to)) }
  })

  const daysElapsedThisWeek = Math.min(7, Math.floor((now.getTime()-weekStart.getTime())/86400000)+1)
  const week = sumBookings(bookings, ds=>inRange(ds, weekStart, weekEnd))
  const weekCount = bookings.filter(b=>{ const ds = bookingDateStr(b); return ds ? inRange(ds, weekStart, weekEnd) : false }).length

  return {
    today: sumBookings(bookings, ds=>ds===todayStr),
    yesterday: sumBookings(bookings, ds=>ds===isoDate(yestDate)),
    week, weekCount,
    prevWeek: sumBookings(bookings, ds=>inRange(ds, prevWeekStart, prevWeekEnd)),
    month: sumBookings(bookings, ds=>inRange(ds, monthStart, monthEnd)),
    prevMonth: sumBookings(bookings, ds=>inRange(ds, prevMonthStart, prevMonthEnd)),
    year: sumBookings(bookings, ds=>inRange(ds, yearStart, yearEnd)),
    prevYear: sumBookings(bookings, ds=>inRange(ds, prevYearStart, prevYearEnd)),
    total: sumBookings(bookings, ()=>true),
    completedCount: bookings.length,
    weeklyChart, monthlyChart, bestDay,
    dailyAvgThisWeek: daysElapsedThisWeek>0 ? week/daysElapsedThisWeek : 0,
  }
}
// Only shown when there is a real, non-zero prior period to compare
// against — never a fabricated trend.
function trendPct(current:number, previous:number):number|null {
  if(previous<=0) return null
  return Math.round(((current-previous)/previous)*100)
}
function computeServiceBreakdown(bookings:CompletedBooking[]):{label:string;value:number;pct:number}[] {
  const totals = new Map<string,number>()
  bookings.forEach(b=>{
    if(!hasAmount(b)) return
    const key = bookingLabel(b)
    totals.set(key, (totals.get(key)??0)+bookingAmount(b))
  })
  const grand = Array.from(totals.values()).reduce((a,b)=>a+b,0)
  return Array.from(totals.entries())
    .map(([label,value])=>({ label, value, pct: grand>0?Math.round((value/grand)*100):0 }))
    .sort((a,b)=>b.value-a.value)
}
function timeBucket(timeStr:string):string {
  const hour = Number(timeStr.split(':')[0])
  if(Number.isNaN(hour)) return 'Unspecified'
  if(hour<12) return 'Morning (before 12PM)'
  if(hour<18) return 'Afternoon (12–6PM)'
  return 'Evening (after 6PM)'
}
function computeTimeOfDayBreakdown(bookings:CompletedBooking[]):{label:string;value:number;pct:number}[] {
  const buckets = new Map<string,number>()
  bookings.forEach(b=>{
    if(!hasAmount(b)) return
    const key = b.scheduled_time ? timeBucket(b.scheduled_time) : 'Unspecified'
    buckets.set(key, (buckets.get(key)??0)+bookingAmount(b))
  })
  const grand = Array.from(buckets.values()).reduce((a,b)=>a+b,0)
  return Array.from(buckets.entries())
    .map(([label,value])=>({ label, value, pct: grand>0?Math.round((value/grand)*100):0 }))
    .sort((a,b)=>b.value-a.value)
}

// ─── Earnings Dashboard ───────────────────────────────────────────────────────
function EarningsDashboard({ profile, completedBookings, transactions, payouts, onNav }:{
  profile:{ full_name:string|null }|null
  completedBookings:CompletedBooking[]; transactions:TransactionRow[]; payouts:PayoutRow[]
  onNav:(s:SubView)=>void
}) {
  const summary = useMemo(()=>computeEarningsSummary(completedBookings, new Date()), [completedBookings])
  const pendingPayouts = payouts.filter(p=>!p.paid_at)
  const pendingPayoutTotal = pendingPayouts.reduce((sum,p)=>sum+(p.amount??0),0)
  const mostRecentPayout = payouts[0] ?? null

  const stats = [
    { l:"Today's Earnings",   v:summary.today, color:C.primary, trend:trendPct(summary.today, summary.yesterday) },
    { l:'This Week Earnings', v:summary.week,  color:C.success, trend:trendPct(summary.week, summary.prevWeek) },
    { l:'This Month Earnings',v:summary.month, color:C.info,    trend:trendPct(summary.month, summary.prevMonth) },
    { l:'This Year Earnings', v:summary.year,  color:C.accent,  trend:trendPct(summary.year, summary.prevYear) },
  ]
  const quickActions = [
    {e:'💸', l:'Withdraw',      cb:()=>onNav('withdraw')},
    {e:'📊', l:'Analytics',     cb:()=>onNav('analytics')},
    {e:'🏦', l:'Bank Accounts', cb:()=>onNav('bankAccounts')},
    {e:'🎁', l:'Bonuses',       cb:()=>onNav('bonuses')},
    {e:'📋', l:'Reports',       cb:()=>onNav('reports')},
    {e:'🎯', l:'Goals',         cb:()=>onNav('goals')},
  ]
  return (
    <div style={{ padding:'24px 28px 60px' }}>
      {/* Hero earnings card */}
      <Card style={{ padding:'26px 28px', marginBottom:20, background:`linear-gradient(135deg,${C.primary},#005D63)`, border:'none', boxShadow:`0 10px 36px ${C.primary}35`, position:'relative' as const, overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-20%', right:'-4%', width:220, height:220, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }} />
        <div style={{ position:'absolute', bottom:'-30%', left:'10%', width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,0.04)' }} />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap' as const, gap:16 }}>
          <div>
            <p style={{ fontSize:12, color:'rgba(255,255,255,0.65)', marginBottom:4 }}>Total Gross Earnings · {profile?.full_name || 'Agent'}</p>
            <p style={{ fontSize:38, fontWeight:900, color:'#fff', fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:8 }}>{fmt(summary.total)}</p>
            <div style={{ display:'flex', gap:16, flexWrap:'wrap' as const }}>
              {[
                {l:'Completed Jobs',v:String(summary.completedCount)},
                {l:'This Month',v:fmt(summary.month)},
                {l:'Pending Payouts',v: pendingPayouts.length ? fmt(pendingPayoutTotal) : 'None'},
              ].map((s,i)=>(
                <div key={i}>
                  <p style={{ fontSize:10, color:'rgba(255,255,255,0.55)', marginBottom:2 }}>{s.l}</p>
                  <p style={{ fontSize:14, fontWeight:700, color:'#fff', fontFamily:'Manrope,sans-serif' }}>{s.v}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <Btn label="Withdraw Funds" variant="secondary" icon={I.wallet} onClick={()=>onNav('withdraw')} />
            <Btn label="View Payouts" variant="ghost" small onClick={()=>onNav('payouts')} />
          </div>
        </div>
      </Card>

      {/* KPI grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }} className="ew-4col">
        {stats.map((s,i)=>(
          <Card key={i} style={{ padding:20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
              <div style={{ width:38, height:38, borderRadius:12, background:`${s.color}12`, display:'flex', alignItems:'center', justifyContent:'center', color:s.color }}>
                <span style={{display:'flex'}}>{I.trending}</span>
              </div>
              {s.trend!=null&&<span style={{ fontSize:11, fontWeight:700, color:s.trend>=0?C.success:C.error, background:`${s.trend>=0?C.success:C.error}10`, padding:'2px 8px', borderRadius:99 }}>{s.trend>=0?'+':''}{s.trend}%</span>}
            </div>
            <p style={{ fontSize:11, color:C.muted, marginBottom:4 }}>{s.l}</p>
            <p style={{ fontSize:s.v>999999?18:22, fontWeight:900, color:s.color, fontFamily:'Manrope,sans-serif', lineHeight:1 }}>{fmt(s.v)}</p>
          </Card>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:18, marginBottom:18 }} className="ew-main-split">
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Weekly chart */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="This Week" action="Analytics" onAction={()=>onNav('analytics')} />
            <BarChart data={summary.weeklyChart} color={C.primary} height={110} />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginTop:12 }}>
              {[
                {l:'Daily Avg',v:fmt(summary.dailyAvgThisWeek)},
                {l:'Best Day',v:summary.bestDay&&summary.bestDay.value>0?`${summary.bestDay.label} ${fmt(summary.bestDay.value)}`:'No data'},
                {l:'Jobs This Week',v:String(summary.weekCount)},
              ].map((s,i)=>(
                <div key={i} style={{ textAlign:'center' as const, padding:'8px', borderRadius:10, background:C.bg }}>
                  <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{s.v}</p>
                  <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
                </div>
              ))}
            </div>
          </Card>
          {/* Recent transactions */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Recent Transactions" action="View All" onAction={()=>onNav('transactions')} />
            {transactions.length===0 ? (
              <p style={{ fontSize:12, color:C.muted }}>No transactions yet.</p>
            ) : transactions.slice(0,4).map(t=>{
              const st = statusMeta(t.status)
              const label = t.booking?.care_request?.title || t.booking?.care_request?.service_type || 'Payment'
              return (
                <div key={t.id} style={{ display:'flex', gap:12, alignItems:'center', padding:'10px 0', borderBottom:`1px solid ${C.border}` }}>
                  <div style={{ width:38, height:38, borderRadius:12, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, flexShrink:0 }}>💳</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:12, fontWeight:700, color:C.type, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as const }}>{label}</p>
                    <p style={{ fontSize:11, color:C.muted }}>{formatDateLabel(t.created_at)}{t.client?.full_name?` · ${t.client.full_name}`:''}</p>
                  </div>
                  <div style={{ textAlign:'right' as const, flexShrink:0 }}>
                    <p style={{ fontSize:13, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{typeof t.amount==='number'?fmtCurrency(t.amount,t.currency):'—'}</p>
                    <Bdg label={st.label} color={st.color} />
                  </div>
                </div>
              )
            })}
          </Card>
        </div>

        {/* Right */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Quick actions */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Quick Actions" />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
              {quickActions.map((a,i)=>(
                <button key={i} onClick={a.cb}
                  style={{ padding:'14px 6px', borderRadius:13, border:`1.5px solid ${C.border}`, background:'#FAFAFA', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:6, fontFamily:'Manrope,sans-serif', fontSize:10, fontWeight:700, color:C.sub, transition:'all 0.12s' }}
                  onMouseOver={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor=C.primary;(e.currentTarget as HTMLButtonElement).style.color=C.primary}}
                  onMouseOut={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor=C.border;(e.currentTarget as HTMLButtonElement).style.color=C.sub}}>
                  <p style={{ fontSize:22 }}>{a.e}</p>{a.l}
                </button>
              ))}
            </div>
          </Card>
          {/* Payout info */}
          <Card style={{ padding:22, background:`linear-gradient(135deg,${C.success}08,${C.surface})`, border:`1.5px solid ${C.success}20` }}>
            <SectionTitle title="Payouts" />
            {mostRecentPayout ? (
              <>
                <div style={{ textAlign:'center' as const, marginBottom:14 }}>
                  <p style={{ fontSize:11, color:C.muted, marginBottom:4 }}>Most recent payout request</p>
                  <p style={{ fontSize:22, fontWeight:900, color:C.success, fontFamily:'Manrope,sans-serif', marginBottom:2 }}>{typeof mostRecentPayout.amount==='number'?fmt(mostRecentPayout.amount):'—'}</p>
                  <Bdg label={statusMeta(mostRecentPayout.status).label} color={statusMeta(mostRecentPayout.status).color} dot />
                </div>
                <div style={{ padding:'12px', borderRadius:12, background:`${C.success}08`, border:`1px solid ${C.success}20`, marginBottom:12 }}>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <p style={{ fontSize:12, color:C.sub }}>{mostRecentPayout.paid_at?'Paid on':'Requested on'}</p>
                    <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{formatDateLabel(mostRecentPayout.paid_at ?? mostRecentPayout.requested_at)}</p>
                  </div>
                </div>
              </>
            ) : (
              <p style={{ fontSize:12, color:C.muted, marginBottom:14 }}>No payouts requested yet.</p>
            )}
            <Btn label="View Payout Center" variant="secondary" small full onClick={()=>onNav('payouts')} />
          </Card>
          {/* Pending payouts */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Pending Payouts" />
            {pendingPayouts.length===0 ? (
              <p style={{ fontSize:12, color:C.muted }}>No pending payouts.</p>
            ) : pendingPayouts.map(p=>(
              <div key={p.id} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:`1px solid ${C.border}` }}>
                <div>
                  <p style={{ fontSize:12, color:C.type, fontWeight:600 }}>Requested {formatDateLabel(p.requested_at)}</p>
                </div>
                <div style={{ textAlign:'right' as const }}>
                  <p style={{ fontSize:13, fontWeight:700, color:C.warning, fontFamily:'Manrope,sans-serif' }}>{typeof p.amount==='number'?fmt(p.amount):'—'}</p>
                  <Bdg label={statusMeta(p.status).label} color={statusMeta(p.status).color} />
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}

// ─── Earnings Analytics ───────────────────────────────────────────────────────
// Every figure here is derived from real completed bookings. Metrics with no
// safe real source (avg hourly rate, YoY growth without a prior-year
// baseline) are replaced with honestly-derivable equivalents rather than
// removed outright, to keep the layout intact.
function EarningsAnalytics({ completedBookings }:{ completedBookings:CompletedBooking[] }) {
  const [period, setPeriod] = useState<'week'|'month'|'year'>('month')
  const now = new Date()
  const summary = useMemo(()=>computeEarningsSummary(completedBookings, now), [completedBookings])

  const weeksInMonth = useMemo(()=>{
    const buckets = [0,0,0,0,0]
    completedBookings.forEach(b=>{
      const ds = bookingDateStr(b)
      if(!ds || !hasAmount(b)) return
      const d = new Date(`${ds}T00:00:00`)
      if(d.getFullYear()!==now.getFullYear()||d.getMonth()!==now.getMonth()) return
      const weekIdx = Math.min(4, Math.floor((d.getDate()-1)/7))
      buckets[weekIdx]+=bookingAmount(b)
    })
    return buckets.map((value,i)=>({ label:`W${i+1}`, value }))
  }, [completedBookings])

  const chartData = period==='week' ? summary.weeklyChart : period==='year' ? summary.monthlyChart : weeksInMonth
  const serviceBreakdown = useMemo(()=>computeServiceBreakdown(completedBookings), [completedBookings])
  const timeBreakdown = useMemo(()=>computeTimeOfDayBreakdown(completedBookings), [completedBookings])
  const avgPerJob = summary.completedCount>0 ? summary.total/summary.completedCount : 0
  const bestMonth = summary.monthlyChart.reduce<{label:string;value:number}|null>((best,m)=>(!best||m.value>best.value)?m:best, null)

  return (
    <div style={{ padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Earnings Analytics</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }} className="ew-4col">
        {[
          {l:'Avg Per Completed Job',v: summary.completedCount>0 ? fmt(avgPerJob) : 'No data', c:C.primary},
          {l:'Completed Jobs (Year)',v: String(summary.completedCount), c:C.info},
          {l:'Best Month',v: bestMonth&&bestMonth.value>0?`${bestMonth.label} — ${fmt(bestMonth.value)}`:'No data', c:C.success},
          {l:'This Year Total',v: fmt(summary.year), c:C.accent},
        ].map((s,i)=>(
          <Card key={i} style={{ padding:20, textAlign:'center' as const }}>
            <p style={{ fontSize:22, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{s.v}</p>
            <p style={{ fontSize:11, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      <Card style={{ padding:22, marginBottom:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
          <h3 style={{ fontSize:15, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Earnings Trend</h3>
          <div style={{ display:'flex', gap:4, border:`1px solid ${C.border}`, borderRadius:10, overflow:'hidden' }}>
            {(['week','month','year'] as const).map(p=>(
              <button key={p} onClick={()=>setPeriod(p)} style={{ padding:'6px 14px', border:'none', cursor:'pointer', background:period===p?C.primary:'#FAFAFA', color:period===p?'#fff':C.sub, fontFamily:'Manrope,sans-serif', fontSize:11, fontWeight:700, transition:'all 0.12s' }}>
                {p.charAt(0).toUpperCase()+p.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <LineChart data={chartData} color={C.primary} height={120} />
      </Card>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="ew-2col">
        <Card style={{ padding:22 }}>
          <SectionTitle title="By Service Type" />
          {serviceBreakdown.length===0 ? (
            <p style={{ fontSize:12, color:C.muted }}>No data available.</p>
          ) : serviceBreakdown.map((s,i)=>(
            <div key={i} style={{ marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                <p style={{ fontSize:12, color:C.type }}>{s.label}</p>
                <p style={{ fontSize:12, fontWeight:700, color:C.primary }}>{fmt(s.value)}</p>
              </div>
              <div style={{ height:6, borderRadius:99, background:`${C.primary}15` }}>
                <div style={{ width:`${s.pct}%`, height:'100%', background:C.primary, borderRadius:99 }} />
              </div>
            </div>
          ))}
        </Card>
        <Card style={{ padding:22 }}>
          <SectionTitle title="Time-of-Day Breakdown" />
          {timeBreakdown.length===0 ? (
            <p style={{ fontSize:12, color:C.muted }}>No data available.</p>
          ) : timeBreakdown.map((s,i)=>(
            <div key={i} style={{ marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                <p style={{ fontSize:12, color:C.type }}>{s.label}</p>
                <p style={{ fontSize:12, fontWeight:700, color:C.warning }}>{fmt(s.value)}</p>
              </div>
              <div style={{ height:6, borderRadius:99, background:`${C.warning}15` }}>
                <div style={{ width:`${s.pct}%`, height:'100%', background:C.warning, borderRadius:99 }} />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

// ─── Job Earnings ─────────────────────────────────────────────────────────────
// Gross amount comes from bookings.payment_amount only — no tips, bonus,
// platform fee, tax, or net income are shown since none of those have a
// real backing field or business rule. When a matching transaction exists
// for the booking, its payment method/status/invoice are shown as
// supplementary real information.
function JobEarnings({ completedBookings, transactions }:{ completedBookings:CompletedBooking[]; transactions:TransactionRow[] }) {
  const txnByBooking = useMemo(()=>{
    const map = new Map<string,TransactionRow>()
    transactions.forEach(t=>{ if(t.booking_id) map.set(t.booking_id, t) })
    return map
  }, [transactions])

  if(completedBookings.length===0) {
    return (
      <div style={{ padding:'24px 28px 60px' }}>
        <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Job Earnings</h2>
        <Card style={{ padding:40, textAlign:'center' as const }}>
          <p style={{ fontSize:13, color:C.muted }}>No completed jobs yet.</p>
        </Card>
      </div>
    )
  }

  return (
    <div style={{ padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Job Earnings</h2>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {completedBookings.map(b=>{
          const txn = txnByBooking.get(b.id)
          return (
            <Card key={b.id} hover style={{ padding:22 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                  <div style={{ width:44, height:44, borderRadius:14, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>💼</div>
                  <div>
                    <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:3 }}>{bookingLabel(b)}</p>
                    <p style={{ fontSize:12, color:C.muted }}>{bookingClientName(b)} · {formatDateLabel(bookingDateStr(b))}</p>
                    <div style={{ marginTop:5, display:'flex', gap:6 }}>
                      <Bdg label="Completed" color={C.success} dot />
                      {txn&&<Bdg label={statusMeta(txn.status).label} color={statusMeta(txn.status).color} />}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign:'right' as const }}>
                  <p style={{ fontSize:22, fontWeight:900, color:hasAmount(b)?C.success:C.muted, fontFamily:'Manrope,sans-serif', lineHeight:1 }}>{hasAmount(b)?fmt(bookingAmount(b)):'Not recorded'}</p>
                  <p style={{ fontSize:10, color:C.muted, marginTop:2 }}>Gross Job Amount</p>
                </div>
              </div>
              {txn&&(
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, paddingTop:14, borderTop:`1px solid ${C.border}` }} className="ew-5col">
                  {[
                    {l:'Payment Method',v:txn.method||'Not recorded'},
                    {l:'Payment Status',v:statusMeta(txn.status).label},
                    {l:'Recorded',v:formatDateLabel(txn.created_at)},
                  ].map((s,i)=>(
                    <div key={i} style={{ textAlign:'center' as const, padding:'8px', borderRadius:10, background:C.bg }}>
                      <p style={{ fontSize:11, fontWeight:700, color:C.type }}>{s.v}</p>
                      <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
                    </div>
                  ))}
                </div>
              )}
              {txn?.invoice_url&&(
                <div style={{ marginTop:10, display:'flex', gap:8 }}>
                  <a href={txn.invoice_url} target="_blank" rel="noreferrer" style={{ textDecoration:'none' }}>
                    <Btn label="View Invoice" variant="ghost" small icon={I.download} />
                  </a>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// ─── Transaction History ──────────────────────────────────────────────────────
function TransactionHistory({ transactions, onSelect }:{ transactions:TransactionRow[]; onSelect:(t:TransactionRow)=>void }) {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<string>('all')
  const statusOptions = useMemo(()=>['all', ...Array.from(new Set(transactions.map(t=>t.status).filter(Boolean) as string[]))], [transactions])
  const filtered = transactions.filter(t=>{
    const label = t.booking?.care_request?.title || t.booking?.care_request?.service_type || ''
    const client = t.client?.full_name || ''
    const matchesQuery = q.trim()==='' || label.toLowerCase().includes(q.toLowerCase()) || client.toLowerCase().includes(q.toLowerCase())
    return (filter==='all'||t.status===filter) && matchesQuery
  })
  return (
    <div style={{ padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Transaction History</h2>
      {transactions.length===0 ? (
        <Card style={{ padding:40, textAlign:'center' as const }}>
          <p style={{ fontSize:32, marginBottom:12 }}>💳</p>
          <p style={{ fontSize:14, fontWeight:700, color:C.type, marginBottom:6 }}>No transactions yet</p>
          <p style={{ fontSize:12, color:C.muted }}>Transaction records will appear here once payments are recorded.</p>
        </Card>
      ) : (
        <>
          {/* Search + filter */}
          <Card style={{ padding:18, marginBottom:18 }}>
            <div style={{ display:'flex', gap:12, alignItems:'center', flexWrap:'wrap' as const }}>
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by service or client…"
                style={{ flex:1, minWidth:200, padding:'10px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, background:'#FAFAFA', outline:'none' }} />
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' as const }}>
                {statusOptions.map(f=>(
                  <button key={f} onClick={()=>setFilter(f)}
                    style={{ padding:'6px 14px', borderRadius:99, border:`1.5px solid ${filter===f?C.primary:C.border}`, background:filter===f?`${C.primary}08`:'#FAFAFA', cursor:'pointer', fontSize:11, fontWeight:700, color:filter===f?C.primary:C.muted, fontFamily:'Manrope,sans-serif', transition:'all 0.1s' }}>
                    {f==='all'?'All':statusMeta(f).label}
                  </button>
                ))}
              </div>
            </div>
          </Card>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {filtered.map(t=>{
              const st = statusMeta(t.status)
              const label = t.booking?.care_request?.title || t.booking?.care_request?.service_type || 'Payment'
              return (
                <Card key={t.id} hover onClick={()=>onSelect(t)} style={{ padding:18 }}>
                  <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                    <div style={{ width:42, height:42, borderRadius:12, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>💳</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:2 }}>
                        <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{label}</p>
                        <Bdg label={st.label} color={st.color} />
                      </div>
                      <p style={{ fontSize:11, color:C.muted }}>{formatDateLabel(t.created_at)}{t.client?.full_name?` · ${t.client.full_name}`:''}{t.method?` · ${t.method}`:''}</p>
                    </div>
                    <div style={{ textAlign:'right' as const, flexShrink:0 }}>
                      <p style={{ fontSize:15, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>{typeof t.amount==='number'?fmtCurrency(t.amount,t.currency):'—'}</p>
                      {t.invoice_url&&<a href={t.invoice_url} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{ color:C.muted, display:'flex', marginLeft:'auto', marginTop:4 }}><span style={{display:'flex'}}>{I.download}</span></a>}
                    </div>
                  </div>
                </Card>
              )
            })}
            {filtered.length===0&&(
              <div style={{ textAlign:'center' as const, padding:'60px 0' }}>
                <p style={{ fontSize:32, marginBottom:12 }}>🔍</p>
                <p style={{ fontSize:14, fontWeight:700, color:C.type }}>No transactions found</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Transaction Details ──────────────────────────────────────────────────────
// Only real transaction fields are shown. No fabricated payment timeline,
// settlement timestamps, reference numbers, taxes, platform fee, tips,
// bonus, net income, or generated receipts.
function TransactionDetails({ t, onBack }:{ t:TransactionRow; onBack:()=>void }) {
  const st = statusMeta(t.status)
  const label = t.booking?.care_request?.title || t.booking?.care_request?.service_type || 'Payment'
  return (
    <div style={{ maxWidth:680, margin:'0 auto', padding:'24px 28px 60px' }}>
      <button onClick={onBack} style={{ display:'flex', gap:5, alignItems:'center', background:'none', border:'none', cursor:'pointer', color:C.muted, fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:700, marginBottom:18, padding:0 }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Back
      </button>
      <Card style={{ padding:24, marginBottom:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
          <div>
            <Bdg label={st.label} color={st.color} dot />
            <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', margin:'8px 0 4px' }}>{label}</h2>
            <p style={{ fontSize:12, color:C.muted }}>{formatDateTimeLabel(t.created_at)}{t.client?.full_name?` · ${t.client.full_name}`:''}</p>
          </div>
          <p style={{ fontSize:28, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', lineHeight:1 }}>{typeof t.amount==='number'?fmtCurrency(t.amount,t.currency):'—'}</p>
        </div>
        <div style={{ borderRadius:14, overflow:'hidden', border:`1px solid ${C.border}` }}>
          {[
            {l:'Amount',v:typeof t.amount==='number'?fmtCurrency(t.amount,t.currency):'Not recorded'},
            {l:'Method',v:t.method||'Not recorded'},
            {l:'Type',v:t.type||'Not recorded'},
            {l:'Status',v:st.label},
            {l:'Booking Date',v:formatDateLabel(t.booking?.scheduled_date)},
            {l:'Recorded At',v:formatDateTimeLabel(t.created_at)},
          ].map((r,i,arr)=>(
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'11px 16px', background:i%2===0?'#FAFAFA':C.surface, borderBottom:i<arr.length-1?`1px solid ${C.border}`:'none' }}>
              <p style={{ fontSize:12, color:C.sub }}>{r.l}</p>
              <p style={{ fontSize:12, fontWeight:600, color:C.type }}>{r.v}</p>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:8, marginTop:16 }}>
          {t.invoice_url ? (
            <a href={t.invoice_url} target="_blank" rel="noreferrer" style={{ textDecoration:'none' }}>
              <Btn label="View Invoice" icon={I.download} />
            </a>
          ) : (
            <p style={{ fontSize:12, color:C.muted }}>No invoice available for this transaction.</p>
          )}
        </div>
      </Card>
    </div>
  )
}

// ─── Payout Center ────────────────────────────────────────────────────────────
// Summary cards use paid_at (a real timestamp) rather than guessing which
// status strings mean "paid" — paid_at present is unambiguous, unlike
// assuming a fixed status vocabulary that hasn't been fully confirmed.
function PayoutCenter({ payouts, bankAccount, onNav }:{ payouts:PayoutRow[]; bankAccount:BankAccount|null; onNav:(s:SubView)=>void }) {
  const paid = payouts.filter(p=>p.paid_at)
  const notYetPaid = payouts.filter(p=>!p.paid_at)
  const totalPaid = paid.reduce((sum,p)=>sum+(p.amount??0),0)
  const totalPending = notYetPaid.reduce((sum,p)=>sum+(p.amount??0),0)
  const totalRequested = payouts.reduce((sum,p)=>sum+(p.amount??0),0)

  const sections = [
    { l:'Total Requested', v:totalRequested, c:C.primary, e:'📥' },
    { l:'Paid Out',        v:totalPaid,      c:C.success, e:'✅' },
    { l:'Not Yet Paid',    v:totalPending,   c:C.warning, e:'⏳' },
  ]

  return (
    <div style={{ padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Payout Center</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:20 }} className="ew-3col">
        {sections.map((s,i)=>(
          <Card key={i} hover style={{ padding:22, border:`1.5px solid ${s.c}20`, background:`${s.c}04` }}>
            <p style={{ fontSize:28, marginBottom:10 }}>{s.e}</p>
            <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:4 }}>{s.l}</p>
            <p style={{ fontSize:22, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1 }}>{fmt(s.v)}</p>
          </Card>
        ))}
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:20 }}>
        <Btn label="Withdraw Funds" icon={I.wallet} onClick={()=>onNav('withdraw')} />
        <Btn label="View Transactions" variant="secondary" onClick={()=>onNav('transactions')} />
      </div>
      <Card style={{ padding:22, marginBottom:16 }}>
        <SectionTitle title="Payout History" />
        {payouts.length===0 ? (
          <p style={{ fontSize:13, color:C.muted }}>No payouts requested yet.</p>
        ) : payouts.map((p,i)=>{
          const st = statusMeta(p.status)
          const isSameBank = bankAccount && p.bank_account_id===bankAccount.id
          return (
            <div key={p.id} style={{ display:'flex', gap:12, alignItems:'center', padding:'12px 0', borderBottom:i<payouts.length-1?`1px solid ${C.border}`:'none' }}>
              <div style={{ width:38, height:38, borderRadius:12, background:`${st.color}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>💳</div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{typeof p.amount==='number'?fmt(p.amount):'Amount not recorded'}</p>
                <p style={{ fontSize:11, color:C.muted }}>
                  Requested {formatDateLabel(p.requested_at)}{p.paid_at?` · Paid ${formatDateLabel(p.paid_at)}`:''}{isSameBank&&bankAccount?.bank_name?` · ${bankAccount.bank_name}`:''}
                </p>
              </div>
              <Bdg label={st.label} color={st.color} dot />
            </div>
          )
        })}
      </Card>
    </div>
  )
}

// ─── Withdraw Funds ───────────────────────────────────────────────────────────
// There is no proven formula anywhere in this codebase for available
// wallet balance, platform fee, payout min/max, transfer fee, processing
// time, or an automatic payout schedule — so none of those are invented
// here. Submission is intentionally disabled until that business rule
// exists; the real bank account is still shown for context.
function WithdrawFunds({ bankAccount, onNav }:{ bankAccount:BankAccount|null; onNav:(s:SubView)=>void }) {
  return (
    <div style={{ maxWidth:580, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:24 }}>Withdraw Funds</h2>
      <Card style={{ padding:24, marginBottom:16, border:`1.5px solid ${C.warning}30`, background:`${C.warning}06` }}>
        <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
          <span style={{ fontSize:22 }}>⚠️</span>
          <div>
            <p style={{ fontSize:13, fontWeight:800, color:C.type, marginBottom:4 }}>Payout requests are temporarily unavailable</p>
            <p style={{ fontSize:12, color:C.sub, lineHeight:1.6 }}>This feature requires payout rules (available balance, minimum/maximum amount, processing time) to be configured before requests can be submitted.</p>
          </div>
        </div>
      </Card>
      <Card style={{ padding:22, marginBottom:16 }}>
        <SectionTitle title="Payout Bank Account" />
        {bankAccount ? (
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <div style={{ width:44, height:44, borderRadius:14, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>🏦</div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:3 }}>
                <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{bankAccount.bank_name || 'Bank account'}</p>
                {bankAccount.verification_status&&<Bdg label={statusMeta(bankAccount.verification_status).label} color={statusMeta(bankAccount.verification_status).color} />}
              </div>
              <p style={{ fontSize:11, color:C.muted }}>{bankAccount.branch || 'Branch not provided'} · {maskAccountNumber(bankAccount.account_number)}</p>
            </div>
          </div>
        ) : (
          <p style={{ fontSize:12, color:C.muted }}>No bank account on file yet. Add one in Bank Accounts before requesting a payout.</p>
        )}
      </Card>
      <div style={{ display:'flex', gap:8 }}>
        <Btn label="View Payout History" variant="secondary" onClick={()=>onNav('payouts')} />
        <Btn label="Bank Accounts" variant="ghost" onClick={()=>onNav('bankAccounts')} />
      </div>
    </div>
  )
}

// ─── Bank Account ─────────────────────────────────────────────────────────────
// The real API (getMyBankAccount/saveMyBankAccount) is shaped around a
// single default account per agent — there is no set-default/remove
// capability, so this view shows and edits that one real account rather
// than a fabricated multi-account list.
function BankAccounts({ bankAccount, onSaved, onToast }:{
  bankAccount:BankAccount|null; onSaved:(acc:BankAccount)=>void; onToast:(m:string)=>void
}) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    bank_name: bankAccount?.bank_name ?? '',
    branch: bankAccount?.branch ?? '',
    account_name: bankAccount?.account_name ?? '',
    swift_code: bankAccount?.swift_code ?? '',
    payout_preference: bankAccount?.payout_preference ?? '',
  })
  useEffect(()=>{
    setForm({
      bank_name: bankAccount?.bank_name ?? '',
      branch: bankAccount?.branch ?? '',
      account_name: bankAccount?.account_name ?? '',
      swift_code: bankAccount?.swift_code ?? '',
      payout_preference: bankAccount?.payout_preference ?? '',
    })
  }, [bankAccount?.id])
  // Never pre-filled from the saved account — this only ever holds a
  // NEW account number the user has typed. An existing number is never
  // loaded into it, so it can never be displayed or accidentally
  // re-submitted in plain text.
  const [accountNumberInput, setAccountNumberInput] = useState('')
  const [saving, setSaving] = useState(false)

  function openEditing() {
    setAccountNumberInput('')
    setEditing(true)
  }

  async function save() {
    const newAccountNumber = accountNumberInput.trim()
    // Blank input means "keep the existing number" — only a non-blank
    // entry replaces it.
    const resolvedAccountNumber = newAccountNumber || bankAccount?.account_number || ''

    if(!form.bank_name.trim()||!form.branch.trim()||!form.account_name.trim()||!resolvedAccountNumber) {
      onToast('Bank name, branch, account name and account number are required')
      return
    }
    setSaving(true)
    try {
      const saved = await saveMyBankAccount({
        bank_name: form.bank_name.trim(),
        branch: form.branch.trim(),
        account_name: form.account_name.trim(),
        account_number: resolvedAccountNumber,
        swift_code: form.swift_code.trim() || undefined,
        payout_preference: form.payout_preference.trim() || undefined,
      })
      onSaved(saved as BankAccount)
      onToast('Bank account saved')
      setAccountNumberInput('')
      setEditing(false)
    } catch(e:any) {
      onToast(e?.message || 'Could not save bank account')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth:680, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Bank Account</h2>

      {!editing&&bankAccount&&(
        <Card style={{ padding:22, marginBottom:14, border:`1.5px solid ${C.primary}30`, background:`${C.primary}03` }}>
          <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
            <div style={{ width:52, height:52, borderRadius:16, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>🏦</div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:4 }}>
                <p style={{ fontSize:14, fontWeight:800, color:C.type }}>{bankAccount.bank_name || 'Bank account'}</p>
                {bankAccount.verification_status&&<Bdg label={statusMeta(bankAccount.verification_status).label} color={statusMeta(bankAccount.verification_status).color} />}
              </div>
              <p style={{ fontSize:12, color:C.muted, marginBottom:3 }}>{bankAccount.branch || 'Branch not provided'} · Account {maskAccountNumber(bankAccount.account_number)}</p>
              <p style={{ fontSize:12, color:C.muted, marginBottom:12 }}>Account holder: {bankAccount.account_name || 'Not provided'}</p>
              <Btn label="Edit" variant="ghost" small icon={I.edit} onClick={openEditing} />
            </div>
          </div>
        </Card>
      )}

      {!editing&&!bankAccount&&(
        <Card style={{ padding:40, textAlign:'center' as const, marginBottom:14 }}>
          <p style={{ fontSize:13, color:C.muted, marginBottom:14 }}>No bank account added yet.</p>
          <Btn label="Add Bank Account" icon={I.bank} onClick={openEditing} />
        </Card>
      )}

      {editing&&(
        <Card style={{ padding:24 }}>
          <h3 style={{ fontSize:16, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:16 }}>{bankAccount?'Edit Bank Account':'Add Bank Account'}</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }} className="ew-2col">
            {([
              {k:'bank_name', l:'Bank Name'},
              {k:'branch', l:'Branch'},
              {k:'account_name', l:'Account Holder Name'},
              {k:'swift_code', l:'SWIFT Code (optional)'},
              {k:'payout_preference', l:'Payout Preference (optional)'},
            ] as const).map(f=>(
              <div key={f.k}>
                <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:5 }}>{f.l}</p>
                <input value={form[f.k]} onChange={e=>setForm(s=>({...s,[f.k]:e.target.value}))}
                  style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, background:'#FAFAFA', outline:'none', boxSizing:'border-box' as const }} />
              </div>
            ))}
            <div>
              <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:5 }}>
                {bankAccount ? 'New Account Number (leave blank to keep current)' : 'Account Number'}
              </p>
              {bankAccount&&(
                <p style={{ fontSize:11, color:C.muted, marginBottom:5 }}>
                  Current: {maskAccountNumber(bankAccount.account_number)}
                </p>
              )}
              <input value={accountNumberInput} onChange={e=>setAccountNumberInput(e.target.value)}
                placeholder={bankAccount ? maskAccountNumber(bankAccount.account_number) : 'e.g. 1234567890'}
                style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, background:'#FAFAFA', outline:'none', boxSizing:'border-box' as const }} />
            </div>
          </div>
          <div style={{ display:'flex', gap:8, marginTop:16 }}>
            {bankAccount&&<Btn label="Cancel" variant="ghost" small onClick={()=>setEditing(false)} />}
            <Btn label={saving?'Saving…':'Save Bank Account'} disabled={saving} onClick={save} />
          </div>
        </Card>
      )}
    </div>
  )
}

// ─── Not configured ─────────────────────────────────────────────────────────
// Shared honest placeholder for subviews with no real backing schema or
// business rule (bonuses, incentives, performance ratings, referrals,
// goals). No fabricated values, no invented zeros implying the feature is
// implemented.
function NotConfigured({ title, message }:{ title:string; message:string }) {
  return (
    <div style={{ padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>{title}</h2>
      <Card style={{ padding:48, textAlign:'center' as const }}>
        <p style={{ fontSize:36, marginBottom:14 }}>🚧</p>
        <p style={{ fontSize:14, fontWeight:700, color:C.type, marginBottom:8 }}>Not configured yet</p>
        <p style={{ fontSize:12, color:C.muted, lineHeight:1.6, maxWidth:420, margin:'0 auto' }}>{message}</p>
      </Card>
    </div>
  )
}

// ─── Bonuses & Incentives ─────────────────────────────────────────────────────
function BonusesIncentives() {
  return <NotConfigured title="Bonuses & Incentives" message="This feature requires bonus and incentive rules to be configured. No bonus data currently exists." />
}

// ─── Performance vs Earnings ──────────────────────────────────────────────────
function PerformanceEarnings() {
  return <NotConfigured title="Performance vs Earnings" message="Performance metrics (rating, acceptance rate, response time) are not yet tracked in this account." />
}

// ─── Financial Reports ────────────────────────────────────────────────────────
// Report generation (PDF/CSV) is not implemented — buttons are disabled
// with an honest message. The chart reuses the same real monthly earnings
// data computed elsewhere on this screen.
function FinancialReports({ monthlyChart, onToast }:{ monthlyChart:{label:string;value:number}[]; onToast:(m:string)=>void }) {
  const reports = [
    {e:'📋', l:'Monthly Statement',  sub:'Report generation not available yet'},
    {e:'📊', l:'Annual Summary',     sub:'Report generation not available yet'},
    {e:'💰', l:'Income Report',      sub:'Report generation not available yet'},
    {e:'🏥', l:'Service Breakdown',  sub:'Report generation not available yet'},
  ]
  return (
    <div style={{ maxWidth:700, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Financial Reports</h2>
      {reports.map((r,i)=>(
        <Card key={i} style={{ padding:22, marginBottom:12 }}>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <div style={{ width:52, height:52, borderRadius:16, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0 }}>{r.e}</div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:14, fontWeight:700, color:C.type, marginBottom:3 }}>{r.l}</p>
              <p style={{ fontSize:12, color:C.muted }}>{r.sub}</p>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <Btn label="PDF" variant="secondary" small disabled icon={I.download} onClick={()=>onToast('Report generation is not available yet.')} />
              <Btn label="CSV" variant="ghost" small disabled icon={I.download} onClick={()=>onToast('Report generation is not available yet.')} />
            </div>
          </div>
        </Card>
      ))}
      <Card style={{ padding:22, marginTop:8 }}>
        <SectionTitle title="This Year — Monthly Earnings" />
        <BarChart data={monthlyChart} color={C.primary} height={100} />
      </Card>
    </div>
  )
}

// ─── Tax Center ───────────────────────────────────────────────────────────────
// Annual income is real (this year's completed-booking gross earnings).
// Estimated tax, filing status, and report generation have no real backing
// rule and are shown as such rather than invented.
function TaxCenter({ annualIncome, monthlyChart, onToast }:{ annualIncome:number; monthlyChart:{label:string;value:number}[]; onToast:(m:string)=>void }) {
  const year = new Date().getFullYear()
  return (
    <div style={{ maxWidth:700, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:8 }}>Tax Center</h2>
      <p style={{ fontSize:13, color:C.muted, marginBottom:22 }}>Future-ready. Consult a tax professional for Sri Lankan income tax guidance.</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:18 }} className="ew-2col">
        {[{l:'Annual Income',v:fmt(annualIncome),c:C.type},{l:'Estimated Tax',v:'Not configured',c:C.warning},{l:'Tax Year',v:String(year),c:C.primary},{l:'Filing Status',v:'Self-employed',c:C.info}].map((s,i)=>(
          <Card key={i} style={{ padding:20, textAlign:'center' as const }}>
            <p style={{ fontSize:20, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{s.v}</p>
            <p style={{ fontSize:11, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      <Card style={{ padding:22 }}>
        <SectionTitle title="Income History (This Year)" />
        <LineChart data={monthlyChart} color={C.primary} height={100} />
        <div style={{ marginTop:14 }}>
          <Btn label="Download Tax Report" icon={I.download} variant="secondary" disabled onClick={()=>onToast('Tax report generation is not available yet.')} />
        </div>
      </Card>
    </div>
  )
}

// ─── Referrals ────────────────────────────────────────────────────────────────
function Referrals() {
  return <NotConfigured title="Referral Program" message="The referral program has not been set up for this account yet. No referral data currently exists." />
}

// ─── Goals ────────────────────────────────────────────────────────────────────
function Goals() {
  return <NotConfigured title="Goals" message="Earnings and visit targets have not been configured for this account. No goal data currently exists." />
}

// ─── Sub-view type ────────────────────────────────────────────────────────────
type SubView = 'dashboard'|'analytics'|'jobEarnings'|'transactions'|'txnDetail'|'payouts'|'withdraw'|'bankAccounts'|'bonuses'|'performance'|'reports'|'tax'|'referrals'|'goals'

const NAV: { k:SubView; l:string; icon:ReactNode; group:string }[] = [
  { k:'dashboard',   l:'Earnings Overview',  icon:I.wallet,   group:'Earnings'    },
  { k:'analytics',   l:'Analytics',          icon:I.trending, group:'Earnings'    },
  { k:'jobEarnings', l:'Job Earnings',        icon:I.star,     group:'Earnings'    },
  { k:'transactions',l:'Transactions',        icon:I.download, group:'Earnings'    },
  { k:'payouts',     l:'Payout Center',       icon:I.bank,     group:'Payouts'     },
  { k:'withdraw',    l:'Withdraw Funds',      icon:I.wallet,   group:'Payouts'     },
  { k:'bankAccounts',l:'Bank Accounts',       icon:I.bank,     group:'Payouts'     },
  { k:'bonuses',     l:'Bonuses',             icon:I.gift,     group:'Incentives'  },
  { k:'performance', l:'Performance',         icon:I.star,     group:'Incentives'  },
  { k:'goals',       l:'Goals',               icon:I.target,   group:'Incentives'  },
  { k:'referrals',   l:'Referrals',           icon:I.people,   group:'Incentives'  },
  { k:'reports',     l:'Financial Reports',   icon:I.download, group:'Reports'     },
  { k:'tax',         l:'Tax Center',          icon:I.alert,    group:'Reports'     },
]

// ─── Root ─────────────────────────────────────────────────────────────────────
const VALID_SUBVIEWS: SubView[] = ['dashboard','analytics','jobEarnings','transactions','txnDetail','payouts','withdraw','bankAccounts','bonuses','performance','reports','tax','referrals','goals']

export default function AgentEarnings() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const requestedTab = searchParams.get('tab') as SubView | null
  // Lets other agent screens deep-link straight into a specific tab here —
  // e.g. the dashboard's "Manage Bank Account" action lands on bankAccounts
  // instead of the generic overview.
  const [sub, setSub] = useState<SubView>(requestedTab && VALID_SUBVIEWS.includes(requestedTab) ? requestedTab : 'dashboard')
  const [selectedTxn, setSelectedTxn] = useState<TransactionRow|null>(null)
  const [toast, setToast] = useState<string|null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [profile, setProfile] = useState<{ full_name:string|null }|null>(null)
  const [completedBookings, setCompletedBookings] = useState<CompletedBooking[]>([])
  const [transactions, setTransactions] = useState<TransactionRow[]>([])
  const [payouts, setPayouts] = useState<PayoutRow[]>([])
  const [bankAccount, setBankAccount] = useState<BankAccount|null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string|null>(null)

  const showToast = (m:string) => { setToast(m); setTimeout(()=>setToast(null),2800) }
  const groups = [...new Set(NAV.map(n=>n.group))]

  // Loads real profile/earnings/transaction/payout/bank data once on
  // mount. Nothing here is mocked — a failure surfaces as loadError rather
  // than falling back to demo content.
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [profileData, bookingsData, txnData, payoutData, bankData] = await Promise.all([
          getMyProfile(),
          getMyCompletedBookings(),
          getMyTransactions(),
          getMyPayouts(),
          getMyBankAccount(),
        ])
        if(cancelled) return
        setProfile(profileData)
        setCompletedBookings(bookingsData as unknown as CompletedBooking[])
        setTransactions(txnData as unknown as TransactionRow[])
        setPayouts(payoutData as PayoutRow[])
        setBankAccount(bankData as BankAccount|null)
      } catch(e:any) {
        if(!cancelled) setLoadError(e?.message || 'Failed to load earnings data')
      } finally {
        if(!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const summary = useMemo(()=>computeEarningsSummary(completedBookings, new Date()), [completedBookings])

  const renderMain = () => {
    if(loading) {
      return <div style={{ padding:'24px 28px 60px' }}><p style={{ fontSize:13, color:C.muted }}>Loading your earnings…</p></div>
    }
    if(loadError) {
      return <div style={{ padding:'24px 28px 60px' }}><p style={{ fontSize:13, color:C.error }}>{loadError}</p></div>
    }
    if (sub==='txnDetail'&&selectedTxn) {
      return <TransactionDetails t={selectedTxn} onBack={()=>setSub('transactions')} />
    }
    switch(sub) {
      case 'dashboard':    return <EarningsDashboard profile={profile} completedBookings={completedBookings} transactions={transactions} payouts={payouts} onNav={setSub} />
      case 'analytics':    return <EarningsAnalytics completedBookings={completedBookings} />
      case 'jobEarnings':  return <JobEarnings completedBookings={completedBookings} transactions={transactions} />
      case 'transactions': return <TransactionHistory transactions={transactions} onSelect={t=>{ setSelectedTxn(t); setSub('txnDetail') }} />
      case 'payouts':      return <PayoutCenter payouts={payouts} bankAccount={bankAccount} onNav={setSub} />
      case 'withdraw':     return <WithdrawFunds bankAccount={bankAccount} onNav={setSub} />
      case 'bankAccounts': return <BankAccounts bankAccount={bankAccount} onSaved={setBankAccount} onToast={showToast} />
      case 'bonuses':      return <BonusesIncentives />
      case 'performance':  return <PerformanceEarnings />
      case 'reports':      return <FinancialReports monthlyChart={summary.monthlyChart} onToast={showToast} />
      case 'tax':          return <TaxCenter annualIncome={summary.year} monthlyChart={summary.monthlyChart} onToast={showToast} />
      case 'referrals':    return <Referrals />
      case 'goals':        return <Goals />
      default: return null
    }
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:C.bg, fontFamily:'Manrope,sans-serif' }}>
      {/* Sidebar */}
      <div className="ew-sidebar" style={{ width:218, background:C.surface, borderRight:`1px solid ${C.border}`, display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh', overflowY:'auto', flexShrink:0 }}>
        <button onClick={()=>navigate('/agent/agentdashboard')}
          style={{ display:'flex', gap:7, alignItems:'center', padding:'12px 18px', border:'none', borderBottom:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:700, color:C.sub, textAlign:'left' as const }}>
          <span style={{ display:'flex' }}>{I.chevL}</span> Back to Dashboard
        </button>
        <div style={{ padding:'16px 18px 14px', borderBottom:`1px solid ${C.border}` }}>
          <p style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.08em', marginBottom:4 }}>Earnings & Wallet</p>
          <p style={{ fontSize:20, fontWeight:900, color:C.success, fontFamily:'Manrope,sans-serif' }}>{fmt(summary.total)}</p>
          <p style={{ fontSize:11, color:C.muted }}>Total gross earnings</p>
        </div>
        {groups.map(group=>(
          <div key={group}>
            <p style={{ fontSize:9, fontWeight:800, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.09em', padding:'10px 18px 4px' }}>{group}</p>
            {NAV.filter(n=>n.group===group).map(n=>{
              const active = (sub===n.k)||(sub==='txnDetail'&&n.k==='transactions')
              return (
                <button key={n.k} onClick={()=>{ setSub(n.k); setSidebarOpen(false) }}
                  style={{ width:'100%', display:'flex', gap:9, alignItems:'center', padding:'9px 18px', border:'none', background:active?`${C.primary}08`:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:active?700:500, color:active?C.primary:C.type, textAlign:'left' as const, borderLeft:active?`3px solid ${C.primary}`:'3px solid transparent', transition:'all 0.12s' }}>
                  <span style={{ display:'flex', color:active?C.primary:C.muted }}>{n.icon}</span>
                  {n.l}
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
              <p style={{ fontSize:13, fontWeight:800, color:C.type }}>Earnings & Wallet</p>
            </div>
            {NAV.map(n=>(
              <button key={n.k} onClick={()=>{ setSub(n.k); setSidebarOpen(false) }}
                style={{ width:'100%', display:'flex', gap:9, alignItems:'center', padding:'10px 18px', border:'none', background:sub===n.k?`${C.primary}08`:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:sub===n.k?700:500, color:sub===n.k?C.primary:C.type, textAlign:'left' as const }}>
                <span style={{ display:'flex', color:sub===n.k?C.primary:C.muted }}>{n.icon}</span>{n.l}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile top bar */}
      <div className="ew-mobile-nav" style={{ display:'none', position:'fixed', top:0, left:0, right:0, zIndex:40, background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'12px 18px', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <p style={{ fontSize:13, fontWeight:800, color:C.type }}>{NAV.find(n=>n.k===sub)?.l??'Earnings'}</p>
          <p style={{ fontSize:11, fontWeight:700, color:C.success }}>{fmt(summary.total)}</p>
        </div>
        <button onClick={()=>setSidebarOpen(v=>!v)} style={{ background:'none', border:'none', cursor:'pointer', color:C.type, fontSize:12, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>Menu</button>
      </div>

      {/* Main */}
      <div style={{ flex:1, overflowY:'auto' }} className="ew-main">
        {renderMain()}
      </div>

      {toast&&<Toast msg={toast} />}
    </div>
  )
}
