import { useState, useEffect, type ReactNode, type CSSProperties } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getMyApplications } from '../lib/api'

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
type SubView = 'dashboard'|'detail'|'tracking'|'timeline'|'checklist'|'log'|'photos'|'feed'|'report'|'followup'|'emergency'|'history'|'reschedule'|'cancel'

// ──────────────────────────────────────────────────────────────────────────────
// REAL TASK DATA (Phase 1A) — sourced from getMyApplications() (applications
// joined to care_requests/beneficiaries/client). Values are used exactly as
// persisted; no lifecycle status is invented beyond what the API returns.
// ──────────────────────────────────────────────────────────────────────────────
type RealTask = {
  id: string
  status: string | null
  price: number | null
  original_price: number | null
  duration: string | null
  notes: string | null
  cover_letter: string | null
  applied_at: string | null
  care_request: {
    title: string | null
    service_type: string | null
    currency: string | null
    status: string | null
    scheduled_date: string | null
    scheduled_time: string | null
    duration: string | null
    address1: string | null
    address2: string | null
    city: string | null
    client: { full_name: string | null } | null
    beneficiary: { name: string | null; preferred_name: string | null; age: number | null } | null
  } | null
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

function taskLabel(t: RealTask): string {
  return t.care_request?.title || t.care_request?.service_type || 'Untitled Task'
}

function taskLocation(t: RealTask): string {
  const cr = t.care_request
  if (!cr) return 'Not provided'
  const parts = [cr.address1, cr.address2, cr.city].filter(Boolean)
  return parts.length ? parts.join(', ') : 'Not provided'
}

function taskBeneficiary(t: RealTask): string {
  const b = t.care_request?.beneficiary
  return b?.preferred_name || b?.name || 'Not provided'
}

// Raw persisted status only — never a status not actually returned by the API.
function taskStatus(t: RealTask): string {
  return t.status || t.care_request?.status || 'unknown'
}

// Cosmetic formatting of the real status string (e.g. "applied" -> "Applied").
// Does not introduce any new lifecycle state.
function statusLabel(raw: string): string {
  return raw.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function formatTimeLabel(time: string): string {
  const [hStr, mStr] = time.split(':')
  const h = Number(hStr)
  if (Number.isNaN(h)) return time
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${(mStr ?? '00').slice(0, 2)} ${period}`
}

function formatDateLabel(date: string): string {
  const parsed = new Date(`${date}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return date
  return parsed.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatScheduled(t: RealTask): string {
  const d = t.care_request?.scheduled_date
  if (!d) return 'Not provided'
  const time = t.care_request?.scheduled_time
  return time ? `${formatDateLabel(d)} · ${formatTimeLabel(time)}` : formatDateLabel(d)
}

function formatBudget(t: RealTask): string {
  const currency = t.care_request?.currency
  const amount = t.price ?? t.original_price
  if (amount == null) return 'Not provided'
  return currency ? `${currency} ${amount}` : String(amount)
}

function taskSortKey(t: RealTask): string {
  const d = t.care_request?.scheduled_date ?? ''
  const time = t.care_request?.scheduled_time ?? ''
  return `${d}T${time}`
}

// Nearest scheduled task by scheduled_date/scheduled_time only. No status is
// used to exclude records, since no completed/cancelled status has been
// observed in the actual data.
function pickCurrentTask(tasks: RealTask[]): RealTask | null {
  if (!tasks.length) return null
  const today = todayISO()
  const withDate = tasks.filter(t => t.care_request?.scheduled_date)
  const upcoming = withDate
    .filter(t => (t.care_request!.scheduled_date as string) >= today)
    .sort((a, b) => taskSortKey(a).localeCompare(taskSortKey(b)))
  if (upcoming.length) return upcoming[0]
  const past = [...withDate].sort((a, b) => taskSortKey(b).localeCompare(taskSortKey(a)))
  if (past.length) return past[0]
  return tasks[0]
}

// ──────────────────────────────────────────────────────────────────────────────
// TASK DASHBOARD
// ──────────────────────────────────────────────────────────────────────────────
function Dashboard({ tasks, currentTask, loading, error, onView }: {
  tasks: RealTask[]
  currentTask: RealTask | null
  loading: boolean
  error: string
  onView: (v:SubView) => void
}) {
  if (loading) {
    return <div style={{ padding:'24px 28px 60px' }}><p style={{ fontSize:13, color:C.muted }}>Loading your tasks…</p></div>
  }
  if (error) {
    return <div style={{ padding:'24px 28px 60px' }}><p style={{ fontSize:13, color:C.error }}>{error}</p></div>
  }

  const today = todayISO()
  const todaysTasks = tasks.filter(t => t.care_request?.scheduled_date === today)
  const upcomingCount = tasks.filter(t => (t.care_request?.scheduled_date ?? '') > today).length
  // Status breakdown is built dynamically from whatever raw status values are
  // actually present — never a fixed Active/Completed/Cancelled assumption.
  const statusCounts = tasks.reduce<Record<string, number>>((acc, t) => {
    const s = taskStatus(t)
    acc[s] = (acc[s] ?? 0) + 1
    return acc
  }, {})
  const topStatus = Object.entries(statusCounts).sort((a, b) => b[1] - a[1])[0]

  const stats = [
    { v:String(tasks.length), l:'Total Tasks', c:C.primary },
    { v:String(todaysTasks.length), l:'Today', c:C.accent },
    { v:String(upcomingCount), l:'Upcoming', c:C.info },
    { v:topStatus ? String(topStatus[1]) : '0', l:topStatus ? statusLabel(topStatus[0]) : 'Status', c:C.muted },
  ]

  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', flexDirection:'column', gap:22 }}>
      {/* Current task hero */}
      <Card style={{ padding:0, overflow:'hidden' }}>
        {currentTask ? (
          <div style={{ background:`linear-gradient(135deg,${C.primary} 0%,#005D63 50%,#003C40 100%)`, padding:'24px 26px 22px', position:'relative', overflow:'hidden' }}>
            {/* decorative circles */}
            <div style={{ position:'absolute', top:-30, right:-30, width:140, height:140, borderRadius:'50%', background:'rgba(255,255,255,0.04)' }} />
            <div style={{ position:'absolute', bottom:-40, right:60, width:100, height:100, borderRadius:'50%', background:'rgba(255,255,255,0.03)' }} />
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
              <div>
                <p style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.55)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>Current Task · {currentTask.id}</p>
                <h2 style={{ fontSize:20, fontWeight:900, color:'#fff', fontFamily:'Manrope,sans-serif', letterSpacing:'-0.01em', maxWidth:360, lineHeight:1.25, marginBottom:8 }}>{taskLabel(currentTask)}</h2>
              </div>
              <StatusBdg s={statusLabel(taskStatus(currentTask))} />
            </div>
            <div style={{ display:'flex', gap:18, flexWrap:'wrap', marginBottom:18 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, color:'rgba(255,255,255,0.75)', fontSize:13 }}><span style={{display:'flex',opacity:0.7}}>{I.user}</span>{taskBeneficiary(currentTask)}</div>
              <div style={{ display:'flex', alignItems:'center', gap:6, color:'rgba(255,255,255,0.75)', fontSize:13 }}><span style={{display:'flex',opacity:0.7}}>{I.pin}</span>{taskLocation(currentTask)}</div>
              <div style={{ display:'flex', alignItems:'center', gap:6, color:'rgba(255,255,255,0.75)', fontSize:13 }}><span style={{display:'flex',opacity:0.7}}>{I.calendar}</span>{formatScheduled(currentTask)}</div>
            </div>
            <div style={{ display:'flex', gap:8, marginTop:14 }}>
              <button onClick={()=>onView('detail')} style={{ flex:1, padding:'10px', borderRadius:10, border:'none', background:C.accent, cursor:'pointer', fontSize:13, fontWeight:800, color:'#fff', fontFamily:'Manrope,sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>View Task Details</button>
            </div>
          </div>
        ) : (
          <div style={{ padding:'40px 26px', textAlign:'center' as const }}>
            <p style={{ fontSize:14, fontWeight:700, color:C.type, marginBottom:4 }}>No tasks yet</p>
            <p style={{ fontSize:13, color:C.muted }}>Your assigned bookings will appear here once you have one.</p>
          </div>
        )}
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
          {/* Today's schedule — real scheduled_date/scheduled_time only */}
          <Card style={{ padding:22 }}>
            <p style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:14, fontFamily:'Manrope,sans-serif' }}>Today's Schedule</p>
            {todaysTasks.length === 0 && <p style={{ fontSize:13, color:C.muted }}>No tasks scheduled for today.</p>}
            {todaysTasks.map((t,i)=>(
              <div key={t.id} style={{ display:'flex', gap:12, alignItems:'center', padding:'10px 0', borderBottom:i<todaysTasks.length-1?`1px solid ${C.border}`:'none' }}>
                <div style={{ width:36, height:36, borderRadius:10, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary, flexShrink:0 }}>{I.calendar}</div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{taskLabel(t)}</p>
                  <p style={{ fontSize:11, color:C.muted }}>{t.care_request?.scheduled_time ? formatTimeLabel(t.care_request.scheduled_time) : 'Not provided'}</p>
                </div>
                <StatusBdg s={statusLabel(taskStatus(t))} />
              </div>
            ))}
          </Card>
        </div>

        {/* Right sidebar — only genuinely connected Phase-1A navigation */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <Card style={{ padding:20 }}>
            <p style={{ fontSize:13, fontWeight:800, color:C.type, marginBottom:12, fontFamily:'Manrope,sans-serif' }}>Quick Actions</p>
            <button onClick={()=>onView('history')} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'9px 10px', borderRadius:9, border:'none', background:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:600, color:C.type, transition:'background 0.15s' }} onMouseOver={e=>{(e.currentTarget as HTMLButtonElement).style.background='#F2F4F5'}} onMouseOut={e=>{(e.currentTarget as HTMLButtonElement).style.background='transparent'}}>
              <span style={{ color:C.sub, display:'flex' }}>{I.history}</span>Task History<span style={{ marginLeft:'auto', color:C.muted, display:'flex' }}>{I.chevR}</span>
            </button>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// TASK DETAILS
// ──────────────────────────────────────────────────────────────────────────────
function TaskDetail({ task, loading, error, onBack }: {
  task: RealTask | null
  loading: boolean
  error: string
  onBack: () => void
}) {
  const backBtn = (
    <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', marginBottom:16 }}>{I.chevL} Dashboard</button>
  )

  if (loading) {
    return <div style={{ padding:'24px 28px 60px' }}>{backBtn}<p style={{ fontSize:13, color:C.muted }}>Loading task details…</p></div>
  }
  if (error) {
    return <div style={{ padding:'24px 28px 60px' }}>{backBtn}<p style={{ fontSize:13, color:C.error }}>{error}</p></div>
  }
  if (!task) {
    return <div style={{ padding:'24px 28px 60px' }}>{backBtn}<p style={{ fontSize:13, color:C.muted }}>No task selected yet.</p></div>
  }

  const cr = task.care_request
  const status = statusLabel(taskStatus(task))
  const duration = cr?.duration ?? task.duration ?? 'Not provided'
  const budget = formatBudget(task)
  const clientName = cr?.client?.full_name ?? 'Not provided'
  const instructionsText = task.notes || task.cover_letter || null

  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', gap:24, alignItems:'start', flexWrap:'wrap' }}>
      <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:18 }}>
        <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', alignSelf:'flex-start' }}>{I.chevL} Dashboard</button>

        <Card style={{ padding:0, overflow:'hidden' }}>
          <div style={{ height:4, background:`linear-gradient(90deg,${C.primary},#00959E,${C.accent})` }} />
          <div style={{ padding:'22px 24px' }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:10, marginBottom:6 }}>
              <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>{taskLabel(task)}</h2>
              <StatusBdg s={status} />
            </div>
            <p style={{ fontSize:12, color:C.muted, marginBottom:16 }}>Ref: {task.id}</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }} className="tm-2col">
              {[
                {l:'Beneficiary',  v:taskBeneficiary(task), i:I.user},
                {l:'Location',     v:taskLocation(task), i:I.pin},
                {l:'Scheduled',    v:formatScheduled(task), i:I.calendar},
                {l:'Duration',     v:duration, i:I.clock},
                {l:'Service Type', v:cr?.service_type ?? 'Not provided', i:I.hospital},
                {l:'Budget',       v:budget, i:I.doc},
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

        {instructionsText && (
          <Card style={{ padding:22 }}>
            <p style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:10, fontFamily:'Manrope,sans-serif' }}>Notes</p>
            <p style={{ fontSize:13, color:C.sub, lineHeight:1.75 }}>{instructionsText}</p>
          </Card>
        )}
      </div>

      {/* Sidebar */}
      <div style={{ width:270, flexShrink:0, display:'flex', flexDirection:'column', gap:14, position:'sticky', top:24 }}>
        <Card style={{ padding:22 }}>
          <p style={{ fontSize:12, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:12 }}>Client</p>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            {clientName !== 'Not provided' ? (
              <Avatar name={clientName} size={52} />
            ) : (
              <div style={{ width:52, height:52, borderRadius:'50%', background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', color:C.muted, flexShrink:0 }}>{I.user}</div>
            )}
            <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{clientName}</p>
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
  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', flexDirection:'column', gap:18 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>{I.chevL}</button>
        <h2 style={{ fontSize:18, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Live Tracking</h2>
      </div>
      <Card style={{ padding:40, textAlign:'center' as const }}>
        <p style={{ fontSize:14, fontWeight:700, color:C.type, marginBottom:6 }}>Live tracking isn't available yet</p>
        <p style={{ fontSize:13, color:C.muted }}>Location tracking isn't connected to a data source yet.</p>
      </Card>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// TIMELINE
// ──────────────────────────────────────────────────────────────────────────────
function Timeline({ onBack }: { onBack:()=>void }) {
  return (
    <div style={{ padding:'24px 28px 60px' }}>
      <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>{I.chevL} Dashboard</button>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>Task Timeline</h2>
      <Card style={{ padding:40, textAlign:'center' as const }}>
        <p style={{ fontSize:14, fontWeight:700, color:C.type, marginBottom:6 }}>Task timeline isn't available yet</p>
        <p style={{ fontSize:13, color:C.muted }}>Event-by-event task history isn't connected to a data source yet.</p>
      </Card>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// CHECKLIST
// ──────────────────────────────────────────────────────────────────────────────
function Checklist({ onBack }: { onBack:()=>void }) {
  return (
    <div style={{ padding:'24px 28px 60px' }}>
      <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>{I.chevL} Dashboard</button>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:3 }}>Task Checklist</h2>
      <Card style={{ padding:40, textAlign:'center' as const }}>
        <p style={{ fontSize:14, fontWeight:700, color:C.type, marginBottom:6 }}>Checklist isn't available yet</p>
        <p style={{ fontSize:13, color:C.muted }}>Task checklists aren't connected to a data source yet.</p>
      </Card>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// VISIT LOG
// ──────────────────────────────────────────────────────────────────────────────
function VisitLog({ onBack }: { onBack:()=>void }) {
  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', flexDirection:'column', gap:18 }}>
      <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', alignSelf:'flex-start' }}>{I.chevL} Dashboard</button>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Visit Log</h2>
      <Card style={{ padding:40, textAlign:'center' as const }}>
        <p style={{ fontSize:14, fontWeight:700, color:C.type, marginBottom:6 }}>Visit log isn't available yet</p>
        <p style={{ fontSize:13, color:C.muted }}>Vitals and visit-location tracking aren't connected to a data source yet.</p>
      </Card>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// PHOTOS & DOCS
// ──────────────────────────────────────────────────────────────────────────────
function PhotoGallery({ onBack }: { onBack:()=>void }) {
  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', flexDirection:'column', gap:18 }}>
      <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', alignSelf:'flex-start' }}>{I.chevL} Dashboard</button>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Photos & Documents</h2>
      <Card style={{ padding:40, textAlign:'center' as const }}>
        <p style={{ fontSize:14, fontWeight:700, color:C.type, marginBottom:6 }}>Photos & documents aren't available yet</p>
        <p style={{ fontSize:13, color:C.muted }}>Per-task attachments aren't connected to a data source yet.</p>
      </Card>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// ACTIVITY FEED
// ──────────────────────────────────────────────────────────────────────────────
function ActivityFeed({ onBack }: { onBack:()=>void }) {
  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', flexDirection:'column', gap:18 }}>
      <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', alignSelf:'flex-start' }}>{I.chevL} Dashboard</button>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Activity Feed</h2>
      <Card style={{ padding:40, textAlign:'center' as const }}>
        <p style={{ fontSize:14, fontWeight:700, color:C.type, marginBottom:6 }}>Activity feed isn't available yet</p>
        <p style={{ fontSize:13, color:C.muted }}>A live activity log isn't connected to a data source yet.</p>
      </Card>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// REPORT SUMMARY
// ──────────────────────────────────────────────────────────────────────────────
function ReportSummary({ onBack }: { onBack:()=>void }) {
  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', flexDirection:'column', gap:18 }}>
      <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', alignSelf:'flex-start' }}>{I.chevL} Dashboard</button>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Care Report</h2>
      <Card style={{ padding:40, textAlign:'center' as const }}>
        <p style={{ fontSize:14, fontWeight:700, color:C.type, marginBottom:6 }}>Care reports aren't available yet</p>
        <p style={{ fontSize:13, color:C.muted }}>Visit reports and doctor notes aren't connected to a data source yet.</p>
      </Card>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// FOLLOW-UP CARE
// ──────────────────────────────────────────────────────────────────────────────
function FollowupCare({ onBack }: { onBack:()=>void }) {
  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', flexDirection:'column', gap:18 }}>
      <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', alignSelf:'flex-start' }}>{I.chevL} Dashboard</button>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Follow-up Care</h2>
      <Card style={{ padding:40, textAlign:'center' as const }}>
        <p style={{ fontSize:14, fontWeight:700, color:C.type, marginBottom:6 }}>Follow-up care isn't available yet</p>
        <p style={{ fontSize:13, color:C.muted }}>Follow-up recommendations aren't connected to a data source yet.</p>
      </Card>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// EMERGENCY PANEL
// ──────────────────────────────────────────────────────────────────────────────
function Emergency({ onBack }: { onBack:()=>void }) {
  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', flexDirection:'column', gap:18 }}>
      <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', alignSelf:'flex-start' }}>{I.chevL} Dashboard</button>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Emergency</h2>
      <Card style={{ padding:40, textAlign:'center' as const }}>
        <p style={{ fontSize:14, fontWeight:700, color:C.type, marginBottom:6 }}>Emergency actions aren't available yet</p>
        <p style={{ fontSize:13, color:C.muted }}>SOS alerts and emergency contacts aren't connected to a data source yet.</p>
      </Card>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// TASK HISTORY
// ──────────────────────────────────────────────────────────────────────────────
function TaskHistory({ tasks, loading, error, onBack }: {
  tasks: RealTask[]
  loading: boolean
  error: string
  onBack: () => void
}) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  // Filter chips are built only from raw status values actually present —
  // never a fixed Completed/Cancelled assumption.
  const statuses = Array.from(new Set(tasks.map(t => taskStatus(t))))
  const filterOptions = ['All', ...statuses]

  const filtered = tasks.filter(t => {
    const matchesFilter = filter === 'All' || taskStatus(t) === filter
    const q = search.toLowerCase()
    const matchesSearch = !q ||
      taskLabel(t).toLowerCase().includes(q) ||
      taskBeneficiary(t).toLowerCase().includes(q) ||
      (t.care_request?.client?.full_name ?? '').toLowerCase().includes(q)
    return matchesFilter && matchesSearch
  })

  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', flexDirection:'column', gap:18 }}>
      <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', alignSelf:'flex-start' }}>{I.chevL} Dashboard</button>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Task History</h2>

      {loading && <p style={{ fontSize:13, color:C.muted }}>Loading your tasks…</p>}
      {error && <p style={{ fontSize:13, color:C.error }}>{error}</p>}

      {!loading && !error && (
        <>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tasks…" style={{ flex:1, minWidth:180, padding:'9px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, outline:'none', background:'#FAFAFA', boxSizing:'border-box' as const }} />
            {filterOptions.map(f=>(
              <button key={f} onClick={()=>setFilter(f)} style={{ padding:'8px 14px', borderRadius:9, border:`1.5px solid ${filter===f?C.primary:C.border}`, background:filter===f?`${C.primary}08`:'transparent', cursor:'pointer', fontSize:12, fontWeight:700, color:filter===f?C.primary:C.sub, fontFamily:'Manrope,sans-serif' }}>{f==='All'?'All':statusLabel(f)}</button>
            ))}
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {filtered.map(t=>(
              <Card key={t.id} hover style={{ padding:'16px 20px' }}>
                <div style={{ display:'flex', gap:14, alignItems:'center', flexWrap:'wrap' }}>
                  <div style={{ flex:1, minWidth:180 }}>
                    <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap', marginBottom:4 }}>
                      <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{taskLabel(t)}</p>
                      <StatusBdg s={statusLabel(taskStatus(t))} />
                    </div>
                    <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                      <span style={{ fontSize:12, color:C.muted }}>{t.care_request?.client?.full_name ?? taskBeneficiary(t)}</span>
                      <span style={{ fontSize:12, color:C.muted }}>{t.care_request?.scheduled_date ? formatDateLabel(t.care_request.scheduled_date) : 'Not provided'}</span>
                      <span style={{ fontSize:12, color:C.muted }}>{t.id}</span>
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:8, alignItems:'center', flexShrink:0 }}>
                    <p style={{ fontSize:14, fontWeight:800, color:C.type }}>{formatBudget(t)}</p>
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
        </>
      )}
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
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const requestedTaskId = searchParams.get('taskId')
  const [subView, setSubView] = useState<SubView>('dashboard')
  const [showReschedule, setShowReschedule] = useState(false)
  const [showCancel, setShowCancel] = useState(false)

  // Real task/booking data (Phase 1A) — the authenticated Care Agent's own
  // applications, scoped server-side by getMyApplications() (agent_id = current
  // user), so no other agent's data can reach this screen.
  const [tasks, setTasks] = useState<RealTask[]>([])
  const [tasksLoading, setTasksLoading] = useState(true)
  const [tasksError, setTasksError] = useState('')

  useEffect(() => {
    let cancelled = false
    const loadTasks = async () => {
      try {
        setTasksLoading(true)
        setTasksError('')
        const data = await getMyApplications()
        if (!cancelled) setTasks((data ?? []) as RealTask[])
      } catch (err) {
        if (cancelled) return
        console.error('Failed to load tasks:', err)
        setTasksError("We couldn't load your tasks. Please try again.")
      } finally {
        if (!cancelled) setTasksLoading(false)
      }
    }
    loadTasks()
    return () => { cancelled = true }
  }, [])

  // A specific ?taskId= (from a task/job card elsewhere in the app) selects
  // that exact application; otherwise falls back to the auto-picked "most
  // relevant" one.
  const currentTask = (requestedTaskId ? tasks.find(t => t.id === requestedTaskId) : null) ?? pickCurrentTask(tasks)

  const NAV: {key:SubView; label:string}[] = [
    {key:'dashboard', label:'Dashboard'},
    {key:'tracking',  label:'Live Track'},
    {key:'timeline',  label:'Timeline'},
    {key:'checklist', label:'Checklist'},
    {key:'log',       label:'Visit Log'},
    {key:'feed',      label:'Activity'},
    {key:'photos',    label:'Photos & Docs'},
    {key:'report',    label:'Report'},
    {key:'followup',  label:'Follow-up'},
    {key:'emergency', label:'Emergency'},
    {key:'history',   label:'History'},
  ]

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:C.bg, fontFamily:'Manrope,sans-serif' }}>
      {/* Header nav */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'0 28px', position:'sticky', top:0, zIndex:30 }}>
        <div style={{ padding:'12px 0 0', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12 }}>
          <div>
            <p style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:4 }}>Task Management</p>
            <p style={{ fontSize:15, fontWeight:900, color:C.type, marginBottom:0, fontFamily:'Manrope,sans-serif' }}>{currentTask ? taskLabel(currentTask) : 'Task Management'}</p>
          </div>
          <button onClick={()=>navigate('/agent/agentdashboard')}
            style={{ display:'flex', gap:6, alignItems:'center', padding:'7px 12px', borderRadius:9, border:`1.5px solid ${C.border}`, background:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:700, color:C.sub, flexShrink:0 }}>
            <span style={{ display:'flex' }}>{I.chevL}</span> Back to Dashboard
          </button>
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
        {subView==='dashboard'  && <Dashboard tasks={tasks} currentTask={currentTask} loading={tasksLoading} error={tasksError} onView={setSubView} />}
        {subView==='detail'     && <TaskDetail task={currentTask} loading={tasksLoading} error={tasksError} onBack={()=>setSubView('dashboard')} />}
        {subView==='tracking'   && <LiveTracking onBack={()=>setSubView('dashboard')} />}
        {subView==='timeline'   && <Timeline onBack={()=>setSubView('dashboard')} />}
        {subView==='checklist'  && <Checklist onBack={()=>setSubView('dashboard')} />}
        {subView==='log'        && <VisitLog onBack={()=>setSubView('dashboard')} />}
        {subView==='photos'     && <PhotoGallery onBack={()=>setSubView('dashboard')} />}
        {subView==='feed'       && <ActivityFeed onBack={()=>setSubView('dashboard')} />}
        {subView==='report'     && <ReportSummary onBack={()=>setSubView('dashboard')} />}
        {subView==='followup'   && <FollowupCare onBack={()=>setSubView('dashboard')} />}
        {subView==='emergency'  && <Emergency onBack={()=>setSubView('dashboard')} />}
        {subView==='history'    && <TaskHistory tasks={tasks} loading={tasksLoading} error={tasksError} onBack={()=>setSubView('dashboard')} />}
        {subView==='reschedule' && <div style={{padding:28}}><Btn label="Back" variant="ghost" icon={I.chevL} onClick={()=>setSubView('detail')} /></div>}
        {subView==='cancel'     && <div style={{padding:28}}><Btn label="Back" variant="ghost" icon={I.chevL} onClick={()=>setSubView('detail')} /></div>}
      </div>

      {showReschedule && <RescheduleModal onClose={()=>setShowReschedule(false)} onConfirm={()=>{ setShowReschedule(false); setSubView('dashboard') }} />}
      {showCancel     && <CancelModal     onClose={()=>setShowCancel(false)}     onConfirm={()=>{ setShowCancel(false); setSubView('history') }} />}
    </div>
  )
}
