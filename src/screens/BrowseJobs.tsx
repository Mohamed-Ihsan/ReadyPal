import { useState, useEffect, type ReactNode, type CSSProperties } from 'react'
import {
  getMyProfile,
  getOpenCareRequests,
  getMySavedCareRequests,
  saveCareRequest,
  unsaveCareRequest,
  applyToCareRequest,
  getMyApplications,
  getMyNotifications,
} from '../lib/api'

// ─── Brand ────────────────────────────────────────────────────────────────────
const C = {
  primary:'#00737A', accent:'#EE8153', type:'#2C3E43', sub:'#6B7E85',
  muted:'#9AAAB0', border:'#E4E8EA', bg:'#F2F4F5', surface:'#FFFFFF',
  success:'#22C55E', warning:'#F59E0B', error:'#EF4444', info:'#3B82F6',
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const I: Record<string,ReactNode> = {
  search:   <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.4"/><path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  filter:   <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1.5 3.5h11M4 7h6M6.5 10.5h1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  pin:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1a3.5 3.5 0 0 1 3.5 3.5c0 2.5-3.5 7-3.5 7S3 7 3 4.5A3.5 3.5 0 0 1 6.5 1z" stroke="currentColor" strokeWidth="1.2"/><circle cx="6.5" cy="4.5" r="1.2" fill="currentColor"/></svg>,
  clock:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M6.5 4.5V6.8l1.7 1.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  star:     <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1l1.5 3 3.3.5-2.4 2.3.6 3.3L6 8.8 3 10.1l.6-3.3L1.2 4.5l3.3-.5L6 1z" fill="currentColor"/></svg>,
  heart:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 12.5S1.5 9 1.5 5a3.5 3.5 0 0 1 5.5-2.9A3.5 3.5 0 0 1 12.5 5c0 4-5.5 7.5-5.5 7.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  heartFill:<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 12.5S1.5 9 1.5 5a3.5 3.5 0 0 1 5.5-2.9A3.5 3.5 0 0 1 12.5 5c0 4-5.5 7.5-5.5 7.5z" fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  map:      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1.5 2.5l4 1.5 3-2 4 2v7.5l-4-2-3 2-4-1.5V2.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M5.5 4V11M8.5 2.5v7" stroke="currentColor" strokeWidth="1.1"/></svg>,
  list:     <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 3.5h8M4 7h8M4 10.5h8M2 3.5h.01M2 7h.01M2 10.5h.01" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  chevR:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M4.5 2.5l5 4-5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevD:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 4.5l4 5 4-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  check:    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  close:    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  share:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="10.5" cy="2.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="10.5" cy="10.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="2.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 6l5-3M4 7l5 3" stroke="currentColor" strokeWidth="1.2"/></svg>,
  bell:     <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v.7A4.5 4.5 0 0 1 11.5 7v3.2l1 1.5H1.5l1-1.5V7A4.5 4.5 0 0 1 7 2.7V2M5.8 12a1.2 1.2 0 0 0 2.4 0" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  wallet:   <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="3" width="12" height="9.5" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M1 6h12" stroke="currentColor" strokeWidth="1.2"/><circle cx="10.5" cy="8.5" r="1" fill="currentColor"/></svg>,
  user:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 11c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  calendar: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="2" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 5.5h11M4.5 1v2M8.5 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  zap:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M7.5 1.5L2 7.5h4.5L5 11.5 11 5.5H6.5L7.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  refresh:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M11 6.5a4.5 4.5 0 1 1-1-2.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M11 3v2.5H8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  briefcase:<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="5" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 5V3.5a2 2 0 0 1 4 0V5" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 9h11" stroke="currentColor" strokeWidth="1.2"/></svg>,
  edit:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M9.5 1.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  shield:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5l4.5 1.7v3.5C11 9.8 9 12 6.5 13 4 12 2 9.8 2 6.7V3.2L6.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  trending: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1.5 10l3.5-3.5 3 3L12 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M9.5 5h2.5v2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
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

function Btn({ label, icon, onClick, variant='primary', small=false, disabled=false, full=false }:{ label:string; icon?:ReactNode; onClick?:()=>void; variant?:'primary'|'secondary'|'ghost'|'danger'|'accent'|'success'; small?:boolean; disabled?:boolean; full?:boolean }) {
  const [h,setH] = useState(false)
  const vs: Record<string,CSSProperties> = {
    primary:   { background:disabled?'#C8D0D4':h?'#005D63':C.primary, color:'#fff', border:'none', boxShadow:disabled?'none':h?`0 4px 16px ${C.primary}50`:`0 2px 8px ${C.primary}30` },
    secondary: { background:h?'#EEF5F5':'#fff', color:C.primary, border:`1.5px solid ${h?C.primary:C.border}` },
    ghost:     { background:h?C.bg:'transparent', color:C.sub, border:'none' },
    danger:    { background:h?'#DC2626':C.error, color:'#fff', border:'none' },
    accent:    { background:h?'#D4663D':C.accent, color:'#fff', border:'none', boxShadow:h?`0 4px 16px ${C.accent}50`:`0 2px 8px ${C.accent}30` },
    success:   { background:h?'#16A34A':C.success, color:'#fff', border:'none' },
  }
  return (
    <button onClick={disabled?undefined:onClick} disabled={disabled} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:small?'7px 14px':'10px 20px', borderRadius:10, cursor:disabled?'not-allowed':'pointer', fontFamily:'Manrope,sans-serif', fontSize:small?12:13, fontWeight:700, transition:'all 0.15s', width:full?'100%':undefined, ...vs[variant] }}>
      {icon&&<span style={{display:'flex'}}>{icon}</span>}{label}
    </button>
  )
}

function Bdg({ label, color=C.primary, dot=false, pill=false }:{ label:string; color?:string; dot?:boolean; pill?:boolean }) {
  return <span style={{ display:'inline-flex', alignItems:'center', gap:dot?5:0, padding:pill?'4px 10px':'3px 9px', borderRadius:999, fontSize:11, fontWeight:700, background:`${color}12`, color, whiteSpace:'nowrap' as const }}>
    {dot&&<div style={{width:6,height:6,borderRadius:'50%',background:color,flexShrink:0}}/>}{label}
  </span>
}

function Avatar({ initials='', color=C.primary, size=38 }:{ initials?:string; color?:string; size?:number }) {
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

// ─── Real loading / empty / error states for marketplace pages ────────────────
function LoadingCard({ label }:{ label:string }) {
  return (
    <div style={{ padding:'60px 28px', textAlign:'center' as const }}>
      <p style={{ fontSize:13, color:C.muted }}>{label}</p>
    </div>
  )
}

function ErrorCard({ message, onRetry }:{ message:string; onRetry?:()=>void }) {
  return (
    <div style={{ padding:'60px 28px', textAlign:'center' as const, maxWidth:480, margin:'0 auto' }}>
      <p style={{ fontSize:13, fontWeight:700, color:C.error, marginBottom:6 }}>{message}</p>
      {onRetry&&<Btn label="Retry" variant="secondary" small icon={I.refresh} onClick={onRetry} />}
    </div>
  )
}

function EmptyCard({ emoji, title, desc }:{ emoji:string; title:string; desc:string }) {
  return (
    <div style={{ padding:'60px 28px', textAlign:'center' as const, maxWidth:480, margin:'0 auto' }}>
      <div style={{ fontSize:52, marginBottom:16 }}>{emoji}</div>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:8 }}>{title}</h2>
      <p style={{ fontSize:13, color:C.muted, lineHeight:1.7 }}>{desc}</p>
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

// ─── Job data ─────────────────────────────────────────────────────────────────
// A `Job` is a UI-shaped projection of a real `care_requests` row (see
// careRequestToJob below). Fields with no backing column in the current
// schema are optional and simply omitted from the row — never faked.
interface Job {
  id:string; title:string; service:string; client:string; clientRating?:number; clientJobs?:number; clientVerified?:boolean
  beneficiary?:string; beneficiaryAge?:number; location:string; district:string
  date:string; duration:string; budget:number; budgetMin?:number; currency:string; negotiable?:boolean
  urgent:boolean; featured:boolean; status:string
  requirements:string[]; languages:string[]; tasks:string[]; notes:string; posted:string; createdAt:string; match?:number
}

function formatRelativeTime(iso:string|null|undefined):string {
  if(!iso) return ''
  const then = new Date(iso).getTime()
  if(Number.isNaN(then)) return ''
  const minutes = Math.round((Date.now()-then)/60000)
  if(minutes<1) return 'Just now'
  if(minutes<60) return `${minutes} min ago`
  const hours = Math.round(minutes/60)
  if(hours<24) return `${hours} hr${hours===1?'':'s'} ago`
  const days = Math.round(hours/24)
  if(days<7) return `${days} day${days===1?'':'s'} ago`
  return new Date(iso).toLocaleDateString('en-GB',{ day:'numeric', month:'short', year:'numeric' })
}

function formatScheduleLabel(row:any):string {
  const datePart = row.scheduled_date
    ? new Date(row.scheduled_date).toLocaleDateString('en-GB',{ weekday:'short', day:'numeric', month:'short' })
    : ''
  const base = [datePart, row.scheduled_time].filter(Boolean).join(', ') || 'Schedule to be confirmed'
  return row.recurring ? `${base} · Recurring${row.frequency?` (${row.frequency})`:''}` : base
}

function formatLocationLabel(row:any):string {
  const line = [row.address1, row.address2].filter(Boolean).join(', ')
  return line || row.city || row.province || 'Location to be confirmed'
}

// Maps a raw `care_requests` row (with embedded `client` profile and
// `beneficiary` record) into the shape the existing Browse Jobs UI already
// expects. Only non-sensitive beneficiary fields (preferred_name/name, age)
// are surfaced — no NIC, medical notes, medications, emergency contacts, or
// address. Fields with no source column (clientRating, clientJobs,
// clientVerified, match) are intentionally left undefined — see the summary.
function careRequestToJob(row:any): Job {
  return {
    id: row.id,
    title: row.title,
    service: row.service_type,
    client: row.client?.full_name ?? 'Client',
    beneficiary: row.beneficiary?.preferred_name ?? row.beneficiary?.name ?? undefined,
    beneficiaryAge: row.beneficiary?.age ?? undefined,
    location: formatLocationLabel(row),
    district: row.city ?? row.province ?? '',
    date: formatScheduleLabel(row),
    duration: row.duration ?? '',
    budget: row.budget_max ?? row.budget_min ?? 0,
    budgetMin: row.budget_min ?? undefined,
    currency: row.currency ?? 'LKR',
    negotiable: row.negotiable ?? false,
    urgent: !!row.urgent,
    featured: !!row.featured,
    status: row.status,
    requirements: row.required_skills ?? [],
    languages: row.languages ?? [],
    tasks: row.tasks ?? [],
    notes: row.instructions ?? '',
    posted: formatRelativeTime(row.created_at),
    createdAt: row.created_at,
  }
}

function formatStatusLabel(status:string):string {
  return status.replace(/_/g,' ').replace(/\b\w/g, c=>c.toUpperCase())
}

function formatBudget(job:Job):string {
  if(job.budgetMin!=null && job.budgetMin!==job.budget) {
    return `${job.currency} ${job.budgetMin.toLocaleString()}–${job.budget.toLocaleString()}`
  }
  return `${job.currency} ${job.budget.toLocaleString()}`
}

const STATUS_COLORS: Record<string,string> = {
  open:'#22C55E', published:'#22C55E', applied:C.primary, shortlisted:C.warning, closed:C.muted, filled:'#8B5CF6', expired:C.error, urgent:C.error, featured:C.accent
}

// ─── Job Card ─────────────────────────────────────────────────────────────────
function JobCard({ job, saved, onSave, onView, onApply, compact=false }:{
  job:Job; saved:boolean; onSave:()=>void; onView:()=>void; onApply:()=>void; compact?:boolean
}) {
  const [h,setH] = useState(false)
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ background:C.surface, borderRadius:16, border:`1px solid ${h?C.primary+'40':C.border}`, boxShadow:h?'0 8px 28px rgba(44,62,67,0.11)':'0 1px 4px rgba(44,62,67,0.06)', transition:'all 0.18s', transform:h?'translateY(-2px)':undefined, overflow:'hidden', position:'relative' as const }}>
      {/* Featured stripe */}
      {job.featured&&<div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${C.primary},${C.accent})` }} />}
      <div style={{ padding:compact?'16px':' 20px 20px' }}>
        {/* Top row */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
          <div style={{ flex:1, marginRight:12 }}>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' as const, marginBottom:6 }}>
              {job.urgent&&<Bdg label="Urgent" color={C.error} dot />}
              {job.featured&&<Bdg label="Featured" color={C.accent} />}
              {job.match!=null&&<Bdg label={`${job.match}% match`} color={job.match>=90?C.success:job.match>=75?C.primary:C.warning} />}
            </div>
            <h3 onClick={onView} style={{ fontSize:compact?13:15, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', cursor:'pointer', marginBottom:3, lineHeight:1.3 }}
              onMouseOver={e=>(e.currentTarget.style.color=C.primary)} onMouseOut={e=>(e.currentTarget.style.color=C.type)}>{job.title}</h3>
            <p style={{ fontSize:12, color:C.muted }}>{job.service}{job.beneficiaryAge!=null&&` · ${job.beneficiaryAge}yr beneficiary`}</p>
          </div>
          <div style={{ display:'flex', gap:6, alignItems:'center', flexShrink:0 }}>
            <button onClick={onSave} style={{ width:32, height:32, borderRadius:9, border:`1.5px solid ${saved?C.error:C.border}`, background:saved?`${C.error}08`:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:saved?C.error:C.muted, transition:'all 0.15s' }}>
              {saved?<span style={{display:'flex',transform:'scale(0.9)'}}>{I.heartFill}</span>:<span style={{display:'flex',transform:'scale(0.9)'}}>{I.heart}</span>}
            </button>
          </div>
        </div>

        {/* Meta info */}
        <div style={{ display:'flex', gap:16, flexWrap:'wrap' as const, marginBottom:10 }}>
          {[
            { icon:I.pin,      v:job.location.split(',')[0] },
            { icon:I.clock,    v:`${job.duration}` },
            { icon:I.calendar, v:job.date },
          ].map((m,i)=>(
            <div key={i} style={{ display:'flex', gap:4, alignItems:'center' }}>
              <span style={{ color:C.muted, display:'flex', transform:'scale(0.9)' }}>{m.icon}</span>
              <p style={{ fontSize:11, color:C.sub }}>{m.v}</p>
            </div>
          ))}
        </div>

        {/* Requirements chips */}
        {!compact&&(
          <div style={{ display:'flex', gap:5, flexWrap:'wrap' as const, marginBottom:12 }}>
            {job.requirements.map((r,i)=>(
              <span key={i} style={{ padding:'3px 9px', borderRadius:99, fontSize:10, fontWeight:600, background:C.bg, color:C.sub, border:`1px solid ${C.border}` }}>{r}</span>
            ))}
            {job.languages.map((l,i)=>(
              <span key={i} style={{ padding:'3px 9px', borderRadius:99, fontSize:10, fontWeight:600, background:`${C.info}10`, color:C.info }}>{l}</span>
            ))}
          </div>
        )}

        {/* Bottom */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:12, borderTop:`1px solid ${C.border}` }}>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <div>
              <p style={{ fontSize:16, fontWeight:900, color:C.success, fontFamily:'Manrope,sans-serif', lineHeight:1 }}>{formatBudget(job)}</p>
              <p style={{ fontSize:10, color:C.muted }}>{job.posted}</p>
            </div>
            {job.clientVerified&&<span style={{ display:'flex', color:C.primary, transform:'scale(0.9)' }}>{I.shield}</span>}
          </div>
          <div style={{ display:'flex', gap:6 }}>
            <Btn label="View" variant="secondary" small onClick={onView} />
            <Btn label="Apply" variant="primary" small onClick={onApply} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Filter Panel ─────────────────────────────────────────────────────────────
function FilterPanel({ open, onClose, filters, setFilters }:{
  open:boolean; onClose:()=>void;
  filters:FilterState; setFilters:(f:FilterState)=>void
}) {
  const [local, setLocal] = useState<FilterState>(filters)
  if (!open) return null

  const serviceTypes = ['Hospital Companion','Home Care','Errand & Delivery','Night Care','Physiotherapy Support','Wellness Visit','Medical Escort']
  const districts = ['Colombo','Kandy','Galle','Negombo','Matara','Kurunegala']
  const schedules = ["Today's Jobs","Tomorrow","This Week","Recurring","One-Time"]

  function toggle(arr:string[], v:string): string[] {
    return arr.includes(v) ? arr.filter(x=>x!==v) : [...arr,v]
  }

  return (
    <div style={{ position:'fixed', inset:0, zIndex:60, display:'flex' }}>
      <div style={{ flex:1, background:'rgba(0,0,0,0.4)' }} onClick={onClose} />
      <div style={{ width:340, height:'100%', background:C.surface, overflowY:'auto', boxShadow:'-8px 0 32px rgba(0,0,0,0.12)', display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'20px 24px 16px', borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, background:C.surface, zIndex:1 }}>
          <h3 style={{ fontSize:15, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Filters</h3>
          <div style={{ display:'flex', gap:8 }}>
            <Btn label="Clear All" variant="ghost" small onClick={()=>setLocal({ services:[], districts:[], schedules:[], radius:50, minBudget:0, maxBudget:20000, urgent:false })} />
            <button onClick={onClose} style={{ width:28, height:28, borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.muted }}><span style={{display:'flex'}}>{I.close}</span></button>
          </div>
        </div>

        <div style={{ padding:'0 24px 100px', flex:1 }}>
          {/* Service Type */}
          <div style={{ padding:'18px 0', borderBottom:`1px solid ${C.border}` }}>
            <p style={{ fontSize:12, fontWeight:800, color:C.type, marginBottom:10 }}>Service Type</p>
            <div style={{ display:'flex', flexWrap:'wrap' as const, gap:6 }}>
              {serviceTypes.map(s=>{
                const sel = local.services.includes(s)
                return <button key={s} onClick={()=>setLocal(f=>({...f,services:toggle(f.services,s)}))}
                  style={{ padding:'6px 12px', borderRadius:99, fontSize:11, fontWeight:700, cursor:'pointer', background:sel?C.primary:`${C.bg}`, color:sel?'#fff':C.sub, border:`1.5px solid ${sel?C.primary:C.border}`, transition:'all 0.12s' }}>{s}</button>
              })}
            </div>
          </div>

          {/* Schedule */}
          <div style={{ padding:'18px 0', borderBottom:`1px solid ${C.border}` }}>
            <p style={{ fontSize:12, fontWeight:800, color:C.type, marginBottom:10 }}>Schedule</p>
            <div style={{ display:'flex', flexWrap:'wrap' as const, gap:6 }}>
              {schedules.map(s=>{
                const sel = local.schedules.includes(s)
                return <button key={s} onClick={()=>setLocal(f=>({...f,schedules:toggle(f.schedules,s)}))}
                  style={{ padding:'6px 12px', borderRadius:99, fontSize:11, fontWeight:700, cursor:'pointer', background:sel?C.primary:`${C.bg}`, color:sel?'#fff':C.sub, border:`1.5px solid ${sel?C.primary:C.border}`, transition:'all 0.12s' }}>{s}</button>
              })}
            </div>
          </div>

          {/* District */}
          <div style={{ padding:'18px 0', borderBottom:`1px solid ${C.border}` }}>
            <p style={{ fontSize:12, fontWeight:800, color:C.type, marginBottom:10 }}>District</p>
            <div style={{ display:'flex', flexWrap:'wrap' as const, gap:6 }}>
              {districts.map(d=>{
                const sel = local.districts.includes(d)
                return <button key={d} onClick={()=>setLocal(f=>({...f,districts:toggle(f.districts,d)}))}
                  style={{ padding:'6px 12px', borderRadius:99, fontSize:11, fontWeight:700, cursor:'pointer', background:sel?C.primary:`${C.bg}`, color:sel?'#fff':C.sub, border:`1.5px solid ${sel?C.primary:C.border}`, transition:'all 0.12s' }}>{d}</button>
              })}
            </div>
          </div>

          {/* Budget */}
          <div style={{ padding:'18px 0', borderBottom:`1px solid ${C.border}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <p style={{ fontSize:12, fontWeight:800, color:C.type }}>Budget Range</p>
              <p style={{ fontSize:11, fontWeight:700, color:C.primary }}>LKR {local.minBudget.toLocaleString()} – {local.maxBudget.toLocaleString()}</p>
            </div>
            <input type="range" min={0} max={20000} step={500} value={local.maxBudget} onChange={e=>setLocal(f=>({...f,maxBudget:+e.target.value}))} style={{ width:'100%', accentColor:C.primary, cursor:'pointer' }} />
          </div>

          {/* Travel Radius — UI/local state only; not yet backed by
              location coordinates in care_requests, so it does not
              filter results against real data yet. Pending DB support
              (see Maximum Travel Distance follow-up on onboarding). */}
          <div style={{ padding:'18px 0', borderBottom:`1px solid ${C.border}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <p style={{ fontSize:12, fontWeight:800, color:C.type }}>Travel Radius</p>
              <p style={{ fontSize:11, fontWeight:700, color:C.primary }}>{local.radius} km</p>
            </div>
            <input type="range" min={5} max={200} step={5} value={local.radius} onChange={e=>setLocal(f=>({...f,radius:+e.target.value}))} style={{ width:'100%', accentColor:C.primary, cursor:'pointer' }} />
          </div>

          {/* Toggles */}
          <div style={{ padding:'18px 0' }}>
            {[
              { l:'Emergency Requests',    k:'urgent' as const },
            ].map(t=>(
              <div key={t.k} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                <p style={{ fontSize:13, color:C.type }}>{t.l}</p>
                <button onClick={()=>setLocal(f=>({...f,[t.k]:!f[t.k]}))}
                  style={{ width:42, height:24, borderRadius:99, border:'none', cursor:'pointer', background:local[t.k]?C.primary:C.border, position:'relative' as const, transition:'background 0.2s' }}>
                  <div style={{ width:18, height:18, borderRadius:'50%', background:'#fff', position:'absolute', top:3, left:local[t.k]?21:3, transition:'left 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.2)' }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position:'sticky', bottom:0, padding:'16px 24px', borderTop:`1px solid ${C.border}`, background:C.surface }}>
          <Btn label="Apply Filters" full onClick={()=>{ setFilters(local); onClose() }} />
        </div>
      </div>
    </div>
  )
}

// ─── Map View ─────────────────────────────────────────────────────────────────
// care_requests has no location coordinates yet, so individual job pins
// can't be plotted truthfully. This keeps the map chrome/toggle in place
// as a clearly-labelled placeholder rather than faking pin positions.
function MapView({ jobs }:{ jobs:Job[] }) {
  return (
    <div style={{ position:'relative', width:'100%', height:'100%', background:`linear-gradient(135deg,${C.bg},#DCE8EA)`, borderRadius:0, overflow:'hidden' }}>
      {/* Decorative grid */}
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.08 }} preserveAspectRatio="none">
        <defs><pattern id="mgrid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke={C.primary} strokeWidth="0.5"/></pattern></defs>
        <rect width="100%" height="100%" fill="url(#mgrid)"/>
      </svg>
      {/* Coverage ring */}
      <div style={{ position:'absolute', top:'50%', left:'50%', width:'60%', height:'60%', borderRadius:'50%', border:`2px dashed ${C.primary}30`, transform:'translate(-50%,-50%)', pointerEvents:'none' }} />
      {/* Current location */}
      <div style={{ position:'absolute', top:'48%', left:'45%', transform:'translate(-50%,-50%)', zIndex:5 }}>
        <div style={{ width:16, height:16, borderRadius:'50%', background:C.primary, boxShadow:`0 0 0 6px ${C.primary}30` }} />
      </div>
      {/* Placeholder message */}
      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', padding:24, zIndex:6 }}>
        <div style={{ textAlign:'center' as const, background:'rgba(255,255,255,0.92)', borderRadius:14, padding:'20px 24px', backdropFilter:'blur(8px)', border:`1px solid ${C.border}`, maxWidth:280 }}>
          <p style={{ fontSize:13, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Map view coming soon</p>
          <p style={{ fontSize:11, color:C.muted, lineHeight:1.6 }}>Location coordinates aren't part of the current job data yet, so pins can't be plotted. Use the list on the right to browse {jobs.length} job{jobs.length===1?'':'s'}.</p>
        </div>
      </div>
      <div style={{ position:'absolute', top:14, right:14, background:'rgba(255,255,255,0.92)', borderRadius:8, padding:'6px 12px', backdropFilter:'blur(8px)', border:`1px solid ${C.border}` }}>
        <p style={{ fontSize:11, color:C.muted }}>Interactive map · Coming soon</p>
      </div>
    </div>
  )
}

// ─── Job Details ──────────────────────────────────────────────────────────────
function JobDetails({ job, saved, onSave, onApply, onBack }:{ job:Job; saved:boolean; onSave:()=>void; onApply:()=>void; onBack:()=>void }) {
  const [clientOpen, setClientOpen] = useState(false)
  return (
    <div style={{ maxWidth:780, margin:'0 auto', padding:'24px 28px 80px' }}>
      {/* Back */}
      <button onClick={onBack} style={{ display:'flex', gap:6, alignItems:'center', background:'none', border:'none', cursor:'pointer', color:C.muted, fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:700, marginBottom:18, padding:0 }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Back to Browse
      </button>

      {/* Header card */}
      <Card style={{ padding:'24px 28px', marginBottom:18, background:`linear-gradient(135deg,${C.surface},${C.bg}22)` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap' as const, gap:14 }}>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' as const, marginBottom:10 }}>
              {job.urgent&&<Bdg label="Urgent" color={C.error} dot />}
              {job.featured&&<Bdg label="Featured" color={C.accent} />}
              <Bdg label={formatStatusLabel(job.status)} color={STATUS_COLORS[job.status] ?? C.primary} dot />
              {job.match!=null&&<Bdg label={`${job.match}% match`} color={job.match>=90?C.success:C.primary} />}
            </div>
            <h1 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6, lineHeight:1.2 }}>{job.title}</h1>
            <p style={{ fontSize:13, color:C.muted, marginBottom:12 }}>{job.service} · Posted {job.posted} · Ref: {job.id}</p>
            <div style={{ display:'flex', gap:16, flexWrap:'wrap' as const }}>
              {[{i:I.pin,v:job.location},{i:I.clock,v:job.duration},{i:I.calendar,v:job.date}].map((m,i)=>(
                <div key={i} style={{ display:'flex', gap:5, alignItems:'center' }}>
                  <span style={{ color:C.muted, display:'flex' }}>{m.i}</span>
                  <p style={{ fontSize:12, color:C.sub }}>{m.v}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ textAlign:'right' as const, flexShrink:0 }}>
            <p style={{ fontSize:28, fontWeight:900, color:C.success, fontFamily:'Manrope,sans-serif', lineHeight:1 }}>{formatBudget(job)}</p>
            {job.negotiable&&<p style={{ fontSize:11, color:C.muted, marginBottom:10 }}>Negotiable</p>}
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
              <button onClick={onSave} style={{ padding:'8px 14px', borderRadius:10, border:`1.5px solid ${saved?C.error:C.border}`, background:saved?`${C.error}08`:'transparent', cursor:'pointer', color:saved?C.error:C.muted, display:'flex', gap:5, alignItems:'center', fontSize:12, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>
                {saved?I.heartFill:I.heart}{saved?'Saved':'Save'}
              </button>
              <button style={{ padding:'8px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, background:'transparent', cursor:'pointer', color:C.muted, display:'flex', gap:5, alignItems:'center', fontSize:12, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>{I.share}Share</button>
            </div>
          </div>
        </div>
      </Card>

      <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:16, marginBottom:16 }} className="bjb-split">
        {/* Main column */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Service overview */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Service Overview" />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {[
                {l:'Service',v:job.service},{l:'Duration',v:job.duration},
                {l:'Date',v:job.date},{l:'Location',v:job.district},
              ].map((r,i)=>(
                <div key={i}>
                  <p style={{ fontSize:10, fontWeight:800, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.06em', marginBottom:3 }}>{r.l}</p>
                  <p style={{ fontSize:13, fontWeight:600, color:C.type }}>{r.v}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Expected tasks */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Expected Tasks" />
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {job.tasks.map((t,i)=>(
                <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                  <div style={{ width:22, height:22, borderRadius:7, background:`${C.primary}10`, border:`1.5px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary, flexShrink:0, fontSize:11, fontWeight:800 }}>{i+1}</div>
                  <p style={{ fontSize:13, color:C.type, paddingTop:2 }}>{t}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Medical Notes */}
          <Card style={{ padding:22, border:`1.5px solid ${C.warning}20`, background:`${C.warning}04` }}>
            <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:10 }}>
              <div style={{ width:28, height:28, borderRadius:9, background:`${C.warning}15`, display:'flex', alignItems:'center', justifyContent:'center', color:C.warning }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5L1 11h11L6.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M6.5 6v2M6.5 9.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
              </div>
              <p style={{ fontSize:12, fontWeight:800, color:C.warning }}>Notes from Client</p>
            </div>
            <p style={{ fontSize:13, color:C.type, lineHeight:1.7 }}>{job.notes}</p>
          </Card>
        </div>

        {/* Side column */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Budget breakdown */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Budget Breakdown" />
            <div style={{ marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:`1px solid ${C.border}` }}>
                <p style={{ fontSize:12, color:C.sub }}>Service fee</p>
                <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{job.currency} {Math.round(job.budget * 0.92).toLocaleString()}</p>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:`1px solid ${C.border}` }}>
                <p style={{ fontSize:12, color:C.sub }}>Platform fee (8%)</p>
                <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{job.currency} {Math.round(job.budget * 0.08).toLocaleString()}</p>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', padding:'10px 0 0' }}>
                <p style={{ fontSize:13, fontWeight:800, color:C.type }}>You receive</p>
                <p style={{ fontSize:15, fontWeight:900, color:C.success, fontFamily:'Manrope,sans-serif' }}>{job.currency} {Math.round(job.budget * 0.92).toLocaleString()}</p>
              </div>
            </div>
          </Card>

          {/* Requirements */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Requirements" />
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {job.requirements.map((r,i)=>(
                <div key={i} style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <div style={{ width:20, height:20, borderRadius:'50%', background:`${C.success}10`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <span style={{display:'flex',color:C.success,transform:'scale(0.7)'}}>{I.check}</span>
                  </div>
                  <p style={{ fontSize:12, color:C.type }}>{r}</p>
                </div>
              ))}
              <div style={{ marginTop:6 }}>
                <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:5 }}>Languages</p>
                <div style={{ display:'flex', gap:5, flexWrap:'wrap' as const }}>
                  {job.languages.map((l,i)=><Bdg key={i} label={l} color={C.info} />)}
                </div>
              </div>
            </div>
          </Card>

          {/* Client profile */}
          <Card style={{ padding:22 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <h3 style={{ fontSize:13, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>Client</h3>
              <button onClick={()=>setClientOpen(v=>!v)} style={{ background:'none', border:'none', cursor:'pointer', color:C.primary, display:'flex', fontSize:11, fontWeight:700, fontFamily:'Manrope,sans-serif', gap:3, alignItems:'center' }}>
                {clientOpen?'Hide':'View Profile'}<span style={{display:'flex',transform:clientOpen?'rotate(90deg)':undefined,transition:'0.15s'}}>{I.chevR}</span>
              </button>
            </div>
            <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:clientOpen?14:0 }}>
              <Avatar initials={job.client.split(' ').map(x=>x[0]).join('')} size={40} />
              <div>
                <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:2 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{job.client}</p>
                  {job.clientVerified&&<span style={{ color:C.primary, display:'flex', transform:'scale(0.85)' }}>{I.shield}</span>}
                </div>
                {job.clientRating!=null&&(
                  <div style={{ display:'flex', gap:4, alignItems:'center' }}>
                    <span style={{ color:C.warning, display:'flex', transform:'scale(0.9)' }}>{I.star}</span>
                    <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{job.clientRating}</p>
                    {job.clientJobs!=null&&<p style={{ fontSize:11, color:C.muted }}>· {job.clientJobs} jobs posted</p>}
                  </div>
                )}
              </div>
            </div>
            {clientOpen&&(
              <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:12 }}>
                {[
                  {l:'Location',v:job.district || '—'}
                ].map((r,i)=>(
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <p style={{ fontSize:11, color:C.muted }}>{r.l}</p>
                    <p style={{ fontSize:11, fontWeight:700, color:C.type }}>{r.v}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Beneficiary — hidden until the beneficiaries table/fields
              are confirmed (see summary); job.beneficiary is currently
              never populated by careRequestToJob. */}
          {job.beneficiary&&(
            <Card style={{ padding:22 }}>
              <SectionTitle title="Beneficiary Summary" />
              <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                <div style={{ width:40, height:40, borderRadius:'50%', background:`${C.accent}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>👴</div>
                <div>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{job.beneficiary}</p>
                  <p style={{ fontSize:11, color:C.muted }}>{job.beneficiaryAge!=null&&`Age ${job.beneficiaryAge} · `}{job.district}</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* CTA bar */}
      <div style={{ position:'fixed', bottom:0, left:0, right:0, background:C.surface, borderTop:`1px solid ${C.border}`, padding:'14px 28px', display:'flex', gap:12, justifyContent:'center', zIndex:20 }}>
        <button onClick={onSave} style={{ padding:'11px 20px', borderRadius:12, border:`1.5px solid ${saved?C.error:C.border}`, background:saved?`${C.error}08`:'transparent', cursor:'pointer', color:saved?C.error:C.muted, display:'flex', gap:6, alignItems:'center', fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>
          {saved?I.heartFill:I.heart}{saved?'Saved':'Save Job'}
        </button>
        <Btn label="Apply Now" icon={I.briefcase} onClick={onApply} />
      </div>
    </div>
  )
}

// ─── Application Wizard ───────────────────────────────────────────────────────
interface FilterState { services:string[]; districts:string[]; schedules:string[]; radius:number; minBudget:number; maxBudget:number; urgent:boolean }

function AppWizard({ job, onSuccess, onCancel }:{ job:Job; onSuccess:(applicationId:string)=>void; onCancel:()=>void }) {
  const [step, setStep] = useState(1)
  const [cover, setCover] = useState('')
  const [availability, setAvailability] = useState(true)
  const [priceMode, setPriceMode] = useState<'accept'|'counter'>('accept')
  const [counter, setCounter] = useState(job.budget.toString())
  const TOTAL = 5
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const careRecipient = job.beneficiary ?? 'the person in your care'
  const templates = [
    "Dear "+job.client+", I am an experienced care professional and would be honoured to support "+careRecipient+" with this "+job.service.toLowerCase()+" request. My approach is patient, gentle, and reassuring.",
    "I am a verified ReadyPal Care Agent with a proven track record in "+job.service.toLowerCase()+" services. I look forward to supporting "+careRecipient+" with this request.",
  ]
  const steps = ['Introduction','Availability','Pricing','Experience','Review']

  return (
    <div style={{ maxWidth:680, margin:'0 auto', padding:'24px 28px 80px' }}>
      {/* Header */}
      <button onClick={onCancel} style={{ display:'flex', gap:6, alignItems:'center', background:'none', border:'none', cursor:'pointer', color:C.muted, fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:700, marginBottom:20, padding:0 }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Back to Job
      </button>

      <div style={{ marginBottom:24 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
          <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Apply — {job.title}</h2>
          <p style={{ fontSize:12, fontWeight:700, color:C.muted }}>Step {step} of {TOTAL}</p>
        </div>
        {/* Progress bar */}
        <div style={{ height:5, borderRadius:99, background:C.bg, overflow:'hidden' }}>
          <div style={{ width:`${(step/TOTAL)*100}%`, height:'100%', background:`linear-gradient(90deg,${C.primary},${C.success})`, borderRadius:99, transition:'width 0.4s' }} />
        </div>
        {/* Step labels */}
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:8 }}>
          {steps.map((s,i)=>(
            <p key={i} style={{ fontSize:9, fontWeight:700, color:i+1===step?C.primary:i+1<step?C.success:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.05em', textAlign:'center' as const, flex:1 }}>{s}</p>
          ))}
        </div>
      </div>

      {/* Step panels */}
      {step===1&&(
        <Card style={{ padding:24 }}>
          <h3 style={{ fontSize:15, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Professional Introduction</h3>
          <p style={{ fontSize:12, color:C.muted, marginBottom:16 }}>Write a personalised cover letter for {job.client}. Be specific about why you are a great fit.</p>
          <div style={{ marginBottom:12 }}>
            <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:8 }}>Suggested Templates</p>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {templates.map((t,i)=>(
                <button key={i} onClick={()=>setCover(t)}
                  style={{ padding:'10px 14px', borderRadius:10, border:`1.5px solid ${cover===t?C.primary:C.border}`, background:cover===t?`${C.primary}04`:C.bg, cursor:'pointer', textAlign:'left' as const, fontFamily:'Manrope,sans-serif', fontSize:11, color:C.sub, lineHeight:1.6, transition:'all 0.12s' }}>
                  {t.slice(0,120)}…
                </button>
              ))}
            </div>
          </div>
          <textarea value={cover} onChange={e=>setCover(e.target.value)} placeholder="Or write your own introduction…" rows={6}
            style={{ width:'100%', padding:'12px 14px', borderRadius:12, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, background:'#FAFAFA', outline:'none', resize:'vertical' as const, boxSizing:'border-box' as const, lineHeight:1.7 }} />
          <p style={{ fontSize:11, color:C.muted, marginTop:6 }}>{cover.length} / 1000 characters</p>
        </Card>
      )}
      {step===2&&(
        <Card style={{ padding:24 }}>
          <h3 style={{ fontSize:15, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Confirm Availability</h3>
          <p style={{ fontSize:12, color:C.muted, marginBottom:18 }}>Confirm you can attend: {job.date} for {job.duration}</p>
          <div style={{ padding:'16px', borderRadius:12, border:`2px solid ${availability?C.success:C.border}`, background:availability?`${C.success}06`:C.bg, marginBottom:16, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{job.date}</p>
              <p style={{ fontSize:12, color:C.muted }}>{job.duration} · {job.location}</p>
            </div>
            <button onClick={()=>setAvailability(v=>!v)}
              style={{ width:46, height:26, borderRadius:99, border:'none', cursor:'pointer', background:availability?C.success:C.border, position:'relative' as const, transition:'background 0.2s' }}>
              <div style={{ width:20, height:20, borderRadius:'50%', background:'#fff', position:'absolute', top:3, left:availability?23:3, transition:'left 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.2)' }} />
            </button>
          </div>
          <div style={{ padding:'14px', borderRadius:12, background:C.bg, border:`1px solid ${C.border}` }}>
            <p style={{ fontSize:12, fontWeight:700, color:C.muted, marginBottom:6 }}>Location</p>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <span style={{color:C.primary,display:'flex'}}>{I.pin}</span>
              <p style={{ fontSize:13, color:C.type }}>{job.location}</p>
            </div>
          </div>
        </Card>
      )}
      {step===3&&(
        <Card style={{ padding:24 }}>
          <h3 style={{ fontSize:15, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Pricing</h3>
          <p style={{ fontSize:12, color:C.muted, marginBottom:18 }}>Client offered: <strong style={{color:C.success}}>{formatBudget(job)}</strong></p>
          <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:18 }}>
            {(['accept','counter'] as const).map(m=>(
              <button key={m} onClick={()=>setPriceMode(m)}
                style={{ padding:'14px 18px', borderRadius:12, border:`2px solid ${priceMode===m?C.primary:C.border}`, background:priceMode===m?`${C.primary}06`:C.bg, cursor:'pointer', display:'flex', gap:12, alignItems:'center', textAlign:'left' as const, transition:'all 0.12s' }}>
                <div style={{ width:18, height:18, borderRadius:'50%', border:`2px solid ${priceMode===m?C.primary:C.border}`, background:priceMode===m?C.primary:'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {priceMode===m&&<div style={{ width:7, height:7, borderRadius:'50%', background:'#fff' }} />}
                </div>
                <div>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{m==='accept'?`Accept ${formatBudget(job)}`:'Submit Counter Offer'}</p>
                  <p style={{ fontSize:11, color:C.muted }}>{m==='accept'?'Proceed at the offered amount':'Propose a different amount'}</p>
                </div>
              </button>
            ))}
          </div>
          {priceMode==='counter'&&(
            <div style={{ padding:'16px', borderRadius:12, border:`1.5px solid ${C.border}`, background:C.bg }}>
              <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:8 }}>Your Counter Offer ({job.currency})</p>
              <input type="number" value={counter} onChange={e=>setCounter(e.target.value)}
                style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:14, fontWeight:700, color:C.type, background:'#fff', outline:'none', boxSizing:'border-box' as const }} />
              <p style={{ fontSize:11, color:C.muted, marginTop:6 }}>Client may accept, negotiate, or decline your counter offer.</p>
            </div>
          )}
        </Card>
      )}
      {step===4&&(
        <Card style={{ padding:24 }}>
          <h3 style={{ fontSize:15, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Supporting Information</h3>
          <p style={{ fontSize:12, color:C.muted, marginBottom:18 }}>Highlight what makes you ideal for this specific job.</p>
          {[
            { l:'Relevant Experience', ph:"Describe your experience with similar jobs…", rows:3 },
            { l:'Notes for Client', ph:"Any relevant info the client should know…", rows:2 },
          ].map((f,i)=>(
            <div key={i} style={{ marginBottom:14 }}>
              <p style={{ fontSize:11, fontWeight:700, color:C.type, marginBottom:6 }}>{f.l}</p>
              <textarea placeholder={f.ph} rows={f.rows}
                style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, background:'#FAFAFA', outline:'none', resize:'vertical' as const, boxSizing:'border-box' as const, lineHeight:1.6 }} />
            </div>
          ))}
        </Card>
      )}
      {step===5&&(
        <Card style={{ padding:24 }}>
          <h3 style={{ fontSize:15, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:16 }}>Review & Submit</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:20 }}>
            {[
              {l:'Job',v:job.title},{l:'Client',v:job.client},{l:'Date',v:job.date},
              {l:'Duration',v:job.duration},{l:'Your Rate',v:priceMode==='accept'?formatBudget(job):`${job.currency} ${(parseInt(counter)||0).toLocaleString()}`},
              {l:'Cover Letter',v:cover?'Written ✓':'Not provided ⚠'},
            ].map((r,i)=>(
              <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:i<5?`1px solid ${C.border}`:'none' }}>
                <p style={{ fontSize:12, color:C.muted }}>{r.l}</p>
                <p style={{ fontSize:12, fontWeight:700, color:C.type, maxWidth:'55%', textAlign:'right' as const }}>{r.v}</p>
              </div>
            ))}
          </div>
          {submitError&&(
            <div style={{ padding:'12px 14px', borderRadius:10, background:`${C.error}08`, border:`1px solid ${C.error}30`, color:C.error, fontSize:12, fontWeight:600, marginBottom:16 }}>
              {submitError}
            </div>
          )}
        </Card>
      )}

      {/* Navigation */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:20 }}>
        <Btn label={step===1?'Cancel':'Back'} variant="ghost" onClick={()=>step===1?onCancel():setStep(s=>s-1)} disabled={submitting} />
        <Btn
          label={step===TOTAL?(submitting?'Submitting...':'Submit Application'):'Continue'}
          icon={step===TOTAL?I.check:undefined}
          disabled={(step===1&&cover.length<20)||submitting}
          onClick={async ()=>{
            if(step!==TOTAL){ setStep(s=>s+1); return }
            try {
              setSubmitting(true)
              setSubmitError('')
              const price = priceMode==='accept' ? job.budget : (parseInt(counter)||0)
              const created = await applyToCareRequest({
                care_request_id: job.id,
                price,
                original_price: job.budget,
                duration: job.duration,
                cover_letter: cover || null,
                notes: null,
              })
              onSuccess(created.id)
            } catch(error) {
              console.error('Failed to submit application:', error)
              setSubmitError(error instanceof Error ? error.message : 'Failed to submit application. Please try again.')
            } finally {
              setSubmitting(false)
            }
          }}
        />
      </div>
    </div>
  )
}

// ─── Application Success ──────────────────────────────────────────────────────
function AppSuccess({ job, applicationId, onBack }:{ job:Job; applicationId?:string; onBack:()=>void }) {
  return (
    <div style={{ maxWidth:580, margin:'0 auto', padding:'60px 28px', textAlign:'center' as const }}>
      <div style={{ width:80, height:80, borderRadius:'50%', background:`linear-gradient(135deg,${C.success},${C.primary})`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', boxShadow:`0 12px 36px ${C.success}40` }}>
        <span style={{ display:'flex', color:'#fff', transform:'scale(2)' }}>{I.check}</span>
      </div>
      <h1 style={{ fontSize:28, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:8 }}>Application Submitted!</h1>
      <p style={{ fontSize:14, color:C.muted, marginBottom:28, lineHeight:1.7 }}>Your application for <strong style={{color:C.type}}>{job.title}</strong> has been sent to {job.client}.</p>
      <Card style={{ padding:24, marginBottom:24, textAlign:'left' as const }}>
        {[
          ...(applicationId ? [{l:'Reference Number', v:applicationId.slice(0,8).toUpperCase(), accent:true}] : []),
          {l:'Job',v:job.title},{l:'Client',v:job.client},
        ].map((r,i,arr)=>(
          <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:i<arr.length-1?`1px solid ${C.border}`:'none' }}>
            <p style={{ fontSize:12, color:C.muted }}>{r.l}</p>
            <p style={{ fontSize:12, fontWeight:800, color:(r as any).accent?C.primary:C.type }}>{r.v}</p>
          </div>
        ))}
      </Card>
      <Card style={{ padding:20, marginBottom:24, textAlign:'left' as const, background:`${C.info}04`, border:`1.5px solid ${C.info}20` }}>
        <p style={{ fontSize:12, fontWeight:700, color:C.info, marginBottom:10 }}>What happens next</p>
        {['Client reviews your application','ReadyPal notifies you of the decision','Confirm final schedule if accepted','Complete the job and earn '+job.currency+' '+Math.round(job.budget*.92).toLocaleString()].map((s,i)=>(
          <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:8 }}>
            <div style={{ width:20, height:20, borderRadius:'50%', background:`${C.info}12`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:900, color:C.info, flexShrink:0 }}>{i+1}</div>
            <p style={{ fontSize:12, color:C.sub, paddingTop:2 }}>{s}</p>
          </div>
        ))}
      </Card>
      <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
        <Btn label="Browse More Jobs" variant="secondary" onClick={onBack} />
        <Btn label="View My Applications" variant="primary" icon={I.briefcase} onClick={onBack} />
      </div>
    </div>
  )
}

// ─── Saved Jobs ───────────────────────────────────────────────────────────────
function SavedJobs({ jobs, loading, error, saved, onSave, onView, onApply }:{
  jobs:Job[]; loading:boolean; error:string; saved:Set<string>; onSave:(id:string)=>void; onView:(id:string)=>void; onApply:(id:string)=>void
}) {
  if(loading) return <LoadingCard label="Loading your saved jobs…" />
  if(error) return <ErrorCard message={error} />
  if(jobs.length===0) return <EmptyCard emoji="🔖" title="No Saved Jobs" desc="Tap the heart icon on any job to save it for later. Your shortlist will appear here." />
  return (
    <div style={{ padding:'28px 28px 60px', maxWidth:760, margin:'0 auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Saved Jobs</h2>
        <Bdg label={`${jobs.length} saved`} color={C.primary} />
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {jobs.map(j=><JobCard key={j.id} job={j} saved={saved.has(j.id)} onSave={()=>onSave(j.id)} onView={()=>onView(j.id)} onApply={()=>onApply(j.id)} />)}
      </div>
    </div>
  )
}

// ─── Application History ──────────────────────────────────────────────────────
const HIST_STATUS: Record<string,{color:string;label:string}> = {
  accepted:   {color:C.success, label:'Accepted'},
  shortlisted:{color:C.warning, label:'Shortlisted'},
  applied:    {color:C.primary, label:'Applied'},
  rejected:   {color:C.error,   label:'Rejected'},
  withdrawn:  {color:C.muted,   label:'Withdrawn'},
  negotiating:{color:C.accent,  label:'Negotiating'},
}
// Fallback for any applications.status value not in HIST_STATUS above —
// keeps this resilient if the real status enum differs.
function histStatusMeta(status:string) {
  return HIST_STATUS[status] ?? { color:C.muted, label:formatStatusLabel(status) }
}

function AppHistory() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await getMyApplications()
        if(!cancelled) setItems(data ?? [])
      } catch(err) {
        if(cancelled) return
        console.error('Failed to load applications:', err)
        setError("We couldn't load your applications. Please try again.")
      } finally {
        if(!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  if(loading) return <LoadingCard label="Loading your applications…" />
  if(error) return <ErrorCard message={error} />
  if(items.length===0) return <EmptyCard emoji="📋" title="No Applications Yet" desc="You have not applied to any jobs. Start browsing to find your next opportunity." />

  return (
    <div style={{ padding:'28px 28px 60px', maxWidth:700, margin:'0 auto' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Application History</h2>
      <p style={{ fontSize:13, color:C.muted, marginBottom:22 }}>{items.length} application{items.length===1?'':'s'} · Track your job application pipeline</p>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {items.map((a:any)=>{
          const meta = histStatusMeta(a.status)
          const amount = a.price ?? a.original_price
          return (
            <Card key={a.id} style={{ padding:20 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap' as const, gap:10 }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:5 }}>
                    <h3 style={{ fontSize:13, fontWeight:700, color:C.type, fontFamily:'Manrope,sans-serif' }}>{a.care_request?.title ?? 'Care request'}</h3>
                    <Bdg label={meta.label} color={meta.color} dot />
                  </div>
                  <p style={{ fontSize:11, color:C.muted, marginBottom:4 }}>{a.care_request?.client?.full_name ?? 'Client'}{a.applied_at&&` · ${formatRelativeTime(a.applied_at)}`}</p>
                  <p style={{ fontSize:10, color:C.muted }}>Ref: {String(a.id).slice(0,8).toUpperCase()}</p>
                </div>
                {amount!=null&&<p style={{ fontSize:14, fontWeight:900, color:C.success, fontFamily:'Manrope,sans-serif' }}>{a.care_request?.currency ?? 'LKR'} {Number(amount).toLocaleString()}</p>}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// ─── Recommendations ──────────────────────────────────────────────────────────
function Recommendations({ jobs, loading, error, saved, onSave, onView, onApply }:{
  jobs:Job[]; loading:boolean; error:string; saved:Set<string>; onSave:(id:string)=>void; onView:(id:string)=>void; onApply:(id:string)=>void
}) {
  if(loading) return <LoadingCard label="Loading recommendations…" />
  if(error) return <ErrorCard message={error} />
  if(jobs.length===0) return <EmptyCard emoji="💼" title="No Jobs Available" desc="There are no open care requests right now. Check back soon." />

  // Real, non-fabricated categories only — no invented match %/distance.
  const cats = [
    { label:'Featured',          jobs:jobs.filter(j=>j.featured) },
    { label:'Highest Paying',    jobs:[...jobs].sort((a,b)=>b.budget-a.budget).slice(0,3) },
    { label:'Urgent',            jobs:jobs.filter(j=>j.urgent) },
  ]
  return (
    <div style={{ padding:'28px 28px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Recommended for You</h2>
      {cats.filter(c=>c.jobs.length>0).map((cat,i)=>(
        <div key={i} style={{ marginBottom:28 }}>
          <SectionTitle title={cat.label} />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 }}>
            {cat.jobs.slice(0,3).map(j=><JobCard key={j.id} job={j} saved={saved.has(j.id)} onSave={()=>onSave(j.id)} onView={()=>onView(j.id)} onApply={()=>onApply(j.id)} compact />)}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Notifications ────────────────────────────────────────────────────────────
// `type` values aren't confirmed against the live enum, so icon/color use a
// small best-effort map with a safe generic fallback rather than assuming.
const NOTIF_TYPE_META: Record<string,{ icon:string; color:string }> = {
  new_job:            { icon:'💼', color:C.accent },
  application_viewed: { icon:'👁', color:C.primary },
  shortlisted:         { icon:'🏆', color:C.warning },
  counter_offer:       { icon:'💰', color:C.info },
  application_accepted:{ icon:'✅', color:C.success },
  job_closed:          { icon:'❌', color:C.error },
}
function notifTypeMeta(type:string) {
  return NOTIF_TYPE_META[type] ?? { icon:'🔔', color:C.primary }
}

function NotifView() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await getMyNotifications()
        if(!cancelled) setItems(data ?? [])
      } catch(err) {
        if(cancelled) return
        console.error('Failed to load notifications:', err)
        setError("We couldn't load your notifications. Please try again.")
      } finally {
        if(!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  if(loading) return <LoadingCard label="Loading your notifications…" />
  if(error) return <ErrorCard message={error} />
  if(items.length===0) return <EmptyCard emoji="🔔" title="No Notifications" desc="You're all caught up. Updates about your applications will appear here." />

  return (
    <div style={{ padding:'28px 28px 60px', maxWidth:660, margin:'0 auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Notifications</h2>
        <Bdg label={`${items.filter((n:any)=>!n.read).length} new`} color={C.primary} dot />
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
        {items.map((n:any)=>{
          const meta = notifTypeMeta(n.type)
          return (
            <Card key={n.id} style={{ padding:18, background:n.read?C.surface:`${meta.color}04`, border:`1px solid ${n.read?C.border:meta.color+'20'}` }}>
              <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                <div style={{ width:42, height:42, borderRadius:12, background:`${meta.color}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{meta.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                    <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                      <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{n.title}</p>
                      {!n.read&&<div style={{ width:7, height:7, borderRadius:'50%', background:meta.color }} />}
                    </div>
                    <p style={{ fontSize:11, color:C.muted, whiteSpace:'nowrap' as const }}>{formatRelativeTime(n.created_at)}</p>
                  </div>
                  <p style={{ fontSize:12, color:C.sub, lineHeight:1.5 }}>{n.body}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// ─── Marketplace ──────────────────────────────────────────────────────────────
type SortKey = 'recommended'|'highest_pay'|'newest'|'urgent'
function Marketplace({ jobs, loading, error, saved, onSave, onView, onApply }:{
  jobs:Job[]; loading:boolean; error:string; saved:Set<string>; onSave:(id:string)=>void; onView:(id:string)=>void; onApply:(id:string)=>void
}) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('recommended')
  const [viewMode, setViewMode] = useState<'list'|'map'>('list')
  const [filterOpen, setFilterOpen] = useState(false)
  // radius is preserved for a future Travel Radius / Maximum Travel Distance
  // integration — it is not yet backed by real location/distance data, so
  // it is not applied to `filtered` below and is excluded from activeFiltersCount.
  const [filters, setFilters] = useState<FilterState>({ services:[], districts:[], schedules:[], radius:50, minBudget:0, maxBudget:20000, urgent:false })
  const [activeTab, setActiveTab] = useState<'all'|'recommended'|'urgent'>('all')

  const sortLabels: {k:SortKey;l:string}[] = [
    {k:'recommended',l:'Recommended'},{k:'highest_pay',l:'Highest Pay'},{k:'newest',l:'Newest'},{k:'urgent',l:'Urgent'},
  ]
  const filtered = jobs
    .filter(j=>!query||(j.title.toLowerCase().includes(query.toLowerCase())||j.location.toLowerCase().includes(query.toLowerCase())||j.service.toLowerCase().includes(query.toLowerCase())))
    .filter(j=>!filters.urgent||j.urgent)
    .filter(j=>filters.districts.length===0||filters.districts.includes(j.district))
    .filter(j=>filters.services.length===0||filters.services.includes(j.service))
    .filter(j=>j.budget>=filters.minBudget&&j.budget<=filters.maxBudget)
    .filter(j=>activeTab==='all'||
      (activeTab==='recommended'&&j.featured)||
      (activeTab==='urgent'&&j.urgent)
    )
    .sort((a,b)=>{
      if(sort==='highest_pay') return b.budget-a.budget
      if(sort==='newest') return new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime()
      if(sort==='urgent') return (b.urgent?1:0)-(a.urgent?1:0)
      // recommended: featured first, otherwise keep the fetched (newest-first) order
      return (b.featured?1:0)-(a.featured?1:0)
    })

  const activeFiltersCount = filters.services.length+filters.districts.length+filters.schedules.length+(filters.urgent?1:0)+(filters.maxBudget<20000?1:0)

  if(loading) return <LoadingCard label="Loading open jobs…" />
  if(error) return <ErrorCard message={error} />
  if(jobs.length===0) return <EmptyCard emoji="💼" title="No Jobs Available" desc="There are no open care requests right now. Check back soon." />

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', overflow:'hidden' }}>
      {/* Search header */}
      <div style={{ padding:'16px 24px', borderBottom:`1px solid ${C.border}`, background:C.surface, flexShrink:0 }}>
        <div style={{ display:'flex', gap:10, marginBottom:12 }}>
          <div style={{ flex:1, display:'flex', gap:8, alignItems:'center', padding:'10px 16px', borderRadius:12, border:`1.5px solid ${C.border}`, background:'#FAFAFA' }}>
            <span style={{ color:C.muted, display:'flex' }}>{I.search}</span>
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by service, location, client…"
              style={{ flex:1, border:'none', background:'transparent', fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, outline:'none' }} />
            {query&&<button onClick={()=>setQuery('')} style={{ color:C.muted, background:'none', border:'none', cursor:'pointer', display:'flex' }}><span style={{display:'flex'}}>{I.close}</span></button>}
          </div>
          <button onClick={()=>setFilterOpen(true)}
            style={{ display:'flex', gap:6, alignItems:'center', padding:'10px 16px', borderRadius:12, border:`1.5px solid ${activeFiltersCount>0?C.primary:C.border}`, background:activeFiltersCount>0?`${C.primary}06`:'#FAFAFA', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:700, color:activeFiltersCount>0?C.primary:C.sub, position:'relative' as const }}>
            <span style={{display:'flex'}}>{I.filter}</span>Filters
            {activeFiltersCount>0&&<span style={{ marginLeft:2, minWidth:18, height:18, borderRadius:99, background:C.primary, color:'#fff', fontSize:9, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 5px' }}>{activeFiltersCount}</span>}
          </button>
          {/* View toggle */}
          <div style={{ display:'flex', borderRadius:12, border:`1.5px solid ${C.border}`, overflow:'hidden' }}>
            {(['list','map'] as const).map(v=>(
              <button key={v} onClick={()=>setViewMode(v)} style={{ padding:'10px 14px', border:'none', cursor:'pointer', background:viewMode===v?C.primary:'#FAFAFA', color:viewMode===v?'#fff':C.muted, transition:'all 0.15s', display:'flex', gap:5, alignItems:'center', fontSize:12, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>
                <span style={{display:'flex'}}>{v==='list'?I.list:I.map}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:4 }}>
          {(['all','recommended','urgent'] as const).map(tab=>(
            <button key={tab} onClick={()=>setActiveTab(tab)}
              style={{ padding:'6px 14px', borderRadius:99, border:'none', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:11, fontWeight:700, background:activeTab===tab?C.primary:`${C.bg}`, color:activeTab===tab?'#fff':C.sub, transition:'all 0.12s' }}>
              {tab.charAt(0).toUpperCase()+tab.slice(1)}
            </button>
          ))}
          <div style={{ marginLeft:'auto', display:'flex', gap:4, alignItems:'center' }}>
            <p style={{ fontSize:11, color:C.muted, marginRight:4 }}>Sort:</p>
            <select value={sort} onChange={e=>setSort(e.target.value as SortKey)}
              style={{ padding:'5px 10px', borderRadius:8, border:`1px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:11, fontWeight:700, color:C.type, background:'#FAFAFA', cursor:'pointer', outline:'none' }}>
              {sortLabels.map(s=><option key={s.k} value={s.k}>{s.l}</option>)}
            </select>
          </div>
        </div>
      </div>

      {viewMode==='map' ? (
        <div style={{ flex:1, display:'flex', position:'relative' as const, overflow:'hidden' }}>
          <div style={{ flex:1 }}>
            <MapView jobs={filtered} />
          </div>
          {/* Map side panel — pin-based selection needs job coordinates,
              which aren't in the current schema, so this always shows
              the list of jobs in view. */}
          <div style={{ width:320, height:'100%', background:C.surface, borderLeft:`1px solid ${C.border}`, overflowY:'auto', flexShrink:0 }}>
            <div style={{ padding:18 }}>
              <p style={{ fontSize:12, fontWeight:700, color:C.muted, marginBottom:12 }}>{filtered.length} jobs found</p>
              {filtered.map(j=>(
                <div key={j.id} onClick={()=>onView(j.id)} style={{ padding:'12px 0', borderBottom:`1px solid ${C.border}`, cursor:'pointer' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                    <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{j.title}</p>
                    <p style={{ fontSize:12, fontWeight:800, color:C.success }}>{formatBudget(j)}</p>
                  </div>
                  <p style={{ fontSize:11, color:C.muted }}>{j.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ flex:1, overflowY:'auto', padding:'20px 24px 60px' }}>
          {/* Result count + chips */}
          <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:16, flexWrap:'wrap' as const }}>
            <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{filtered.length} jobs found</p>
            {activeFiltersCount>0&&filters.districts.map(d=>(
              <span key={d} style={{ display:'flex', gap:4, alignItems:'center', padding:'3px 10px', borderRadius:99, background:`${C.primary}10`, fontSize:11, fontWeight:700, color:C.primary }}>
                {d}<button onClick={()=>setFilters(f=>({...f,districts:f.districts.filter(x=>x!==d)}))} style={{ background:'none', border:'none', cursor:'pointer', color:C.primary, display:'flex', padding:0, marginLeft:2 }}><span style={{display:'flex',transform:'scale(0.75)'}}>{I.close}</span></button>
              </span>
            ))}
            {filters.urgent&&<span style={{ display:'flex', gap:4, alignItems:'center', padding:'3px 10px', borderRadius:99, background:`${C.error}10`, fontSize:11, fontWeight:700, color:C.error }}>
              Urgent Only<button onClick={()=>setFilters(f=>({...f,urgent:false}))} style={{ background:'none', border:'none', cursor:'pointer', color:C.error, display:'flex', padding:0, marginLeft:2 }}><span style={{display:'flex',transform:'scale(0.75)'}}>{I.close}</span></button>
            </span>}
          </div>

          {filtered.length===0 ? (
            <div style={{ textAlign:'center' as const, paddingTop:60 }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
              <p style={{ fontSize:15, fontWeight:700, color:C.type, marginBottom:8 }}>No jobs found</p>
              <p style={{ fontSize:13, color:C.muted }}>Try adjusting your search or filters</p>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:14 }} className="bjb-cards">
              {filtered.map(j=>(
                <JobCard key={j.id} job={j} saved={saved.has(j.id)} onSave={()=>onSave(j.id)} onView={()=>onView(j.id)} onApply={()=>onApply(j.id)} />
              ))}
            </div>
          )}
        </div>
      )}
      <FilterPanel open={filterOpen} onClose={()=>setFilterOpen(false)} filters={filters} setFilters={setFilters} />
    </div>
  )
}

// ─── Sub-view ─────────────────────────────────────────────────────────────────
type SubView = 'marketplace'|'saved'|'history'|'recommendations'|'notifications'

const NAV_ITEMS: { k:SubView; l:string; icon:ReactNode }[] = [
  { k:'marketplace',     l:'Browse Jobs',      icon:I.search },
  { k:'recommendations', l:'Recommended',      icon:I.trending },
  { k:'saved',           l:'Saved Jobs',       icon:I.heart },
  { k:'history',         l:'Applications',     icon:I.briefcase },
  { k:'notifications',   l:'Notifications',    icon:I.bell },
]

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function BrowseJobs() {
  const [sub, setSub] = useState<SubView>('marketplace')
  const [viewingId, setViewingId] = useState<string|null>(null)
  const [applyId, setApplyId] = useState<string|null>(null)
  const [completedApplication, setCompletedApplication] = useState<{ jobId:string; applicationId:string }|null>(null)
  const [toast, setToast] = useState<string|null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [profile, setProfile] = useState<any>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [jobsLoading, setJobsLoading] = useState(true)
  const [jobsError, setJobsError] = useState('')
  const [savedJobs, setSavedJobs] = useState<Job[]>([])
  const [savedLoading, setSavedLoading] = useState(true)
  const [savedError, setSavedError] = useState('')
  const [unreadNotifCount, setUnreadNotifCount] = useState(0)

  const saved = new Set(savedJobs.map(j=>j.id))

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        setJobsLoading(true); setJobsError('')
        setSavedLoading(true); setSavedError('')
        const [profileData, openRows, savedRows] = await Promise.all([
          getMyProfile().catch(()=>null),
          getOpenCareRequests(),
          getMySavedCareRequests(),
        ])
        if(cancelled) return
        setProfile(profileData)
        setJobs((openRows ?? []).map(careRequestToJob))
        setSavedJobs((savedRows ?? []).map((r:any)=>r.care_request).filter(Boolean).map(careRequestToJob))
      } catch(err) {
        if(cancelled) return
        console.error('Failed to load marketplace data:', err)
        setJobsError("We couldn't load open jobs. Please try again.")
        setSavedError("We couldn't load your saved jobs. Please try again.")
      } finally {
        if(!cancelled) { setJobsLoading(false); setSavedLoading(false) }
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  // Best-effort, non-blocking: just for the sidebar unread badge.
  useEffect(() => {
    let cancelled = false
    getMyNotifications()
      .then(rows => { if(!cancelled) setUnreadNotifCount((rows ?? []).filter((n:any)=>!n.read).length) })
      .catch(err => console.error('Failed to load notification count:', err))
    return () => { cancelled = true }
  }, [])

  const showToast = (m:string) => { setToast(m); setTimeout(()=>setToast(null),2800) }

  const toggleSave = async (id:string) => {
    const isSaved = saved.has(id)
    // Optimistic update
    if(isSaved) {
      setSavedJobs(list => list.filter(j=>j.id!==id))
    } else {
      const job = jobs.find(j=>j.id===id) ?? savedJobs.find(j=>j.id===id)
      if(job) setSavedJobs(list => [job, ...list])
    }
    try {
      if(isSaved) await unsaveCareRequest(id)
      else await saveCareRequest(id)
      showToast(isSaved?'Removed from saved':'Job saved!')
    } catch(err) {
      console.error('Failed to update saved job:', err)
      showToast("Couldn't update saved job")
      try {
        const fresh = await getMySavedCareRequests()
        setSavedJobs((fresh ?? []).map((r:any)=>r.care_request).filter(Boolean).map(careRequestToJob))
      } catch(refetchErr) {
        console.error('Failed to refresh saved jobs:', refetchErr)
      }
    }
  }

  const viewJob = jobs.find(j=>j.id===viewingId) ?? savedJobs.find(j=>j.id===viewingId)
  const applyJob = jobs.find(j=>j.id===applyId) ?? savedJobs.find(j=>j.id===applyId)

  const renderMain = () => {
    if(completedApplication?.jobId===applyId && applyJob) {
      return <div style={{flex:1,overflowY:'auto'}}><AppSuccess job={applyJob} applicationId={completedApplication.applicationId} onBack={()=>{ setApplyId(null); setCompletedApplication(null); setSub('marketplace') }} /></div>
    }
    if(applyJob) {
      return <div style={{flex:1,overflowY:'auto'}}><AppWizard job={applyJob} onSuccess={(applicationId)=>{ setCompletedApplication({ jobId:applyJob.id, applicationId }); showToast('Application submitted! 🎉') }} onCancel={()=>setApplyId(null)} /></div>
    }
    if(viewJob) {
      return <div style={{flex:1,overflowY:'auto'}}><JobDetails job={viewJob} saved={saved.has(viewJob.id)} onSave={()=>toggleSave(viewJob.id)} onApply={()=>setApplyId(viewJob.id)} onBack={()=>setViewingId(null)} /></div>
    }
    switch(sub) {
      case 'marketplace':     return <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}><Marketplace jobs={jobs} loading={jobsLoading} error={jobsError} saved={saved} onSave={toggleSave} onView={setViewingId} onApply={setApplyId} /></div>
      case 'saved':           return <div style={{flex:1,overflowY:'auto'}}><SavedJobs jobs={savedJobs} loading={savedLoading} error={savedError} saved={saved} onSave={toggleSave} onView={setViewingId} onApply={setApplyId} /></div>
      case 'history':         return <div style={{flex:1,overflowY:'auto'}}><AppHistory /></div>
      case 'recommendations': return <div style={{flex:1,overflowY:'auto'}}><Recommendations jobs={jobs} loading={jobsLoading} error={jobsError} saved={saved} onSave={toggleSave} onView={setViewingId} onApply={setApplyId} /></div>
      case 'notifications':   return <div style={{flex:1,overflowY:'auto'}}><NotifView /></div>
      default: return null
    }
  }

  const initials = (profile?.full_name ?? '')
    .split(' ').filter(Boolean).map((x:string)=>x[0]).slice(0,2).join('').toUpperCase() || '?'

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:C.bg, fontFamily:'Manrope,sans-serif' }}>
      {/* Sidebar */}
      <div className="bjb-sidebar" style={{ width:216, background:C.surface, borderRight:`1px solid ${C.border}`, display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh', overflowY:'auto', flexShrink:0 }}>
        <div style={{ padding:'18px 18px 14px', borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:`${C.primary}18`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:14, color:C.primary, fontFamily:'Manrope,sans-serif' }}>{initials}</div>
            <div>
              <p style={{ fontSize:13, fontWeight:800, color:C.type }}>{profile?.full_name ?? 'Care Agent'}</p>
              <p style={{ fontSize:11, color:C.success, fontWeight:700 }}>● Online</p>
            </div>
          </div>
        </div>
        <div style={{ padding:'10px 0' }}>
          <p style={{ fontSize:9, fontWeight:800, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.09em', padding:'6px 18px 4px' }}>Marketplace</p>
          {NAV_ITEMS.map(n=>{
            const active = sub===n.k && !viewingId && !applyId
            return (
              <button key={n.k} onClick={()=>{ setSub(n.k); setViewingId(null); setApplyId(null); setSidebarOpen(false) }}
                style={{ width:'100%', display:'flex', gap:9, alignItems:'center', padding:'9px 18px', border:'none', background:active?`${C.primary}08`:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:active?700:500, color:active?C.primary:C.type, textAlign:'left' as const, borderLeft:active?`3px solid ${C.primary}`:'3px solid transparent', transition:'all 0.12s' }}>
                <span style={{ display:'flex', color:active?C.primary:C.muted }}>{n.icon}</span>
                {n.l}
                {n.k==='saved'&&savedJobs.length>0&&<span style={{ marginLeft:'auto', minWidth:18, height:18, borderRadius:99, background:C.primary, color:'#fff', fontSize:9, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 5px' }}>{savedJobs.length}</span>}
                {n.k==='notifications'&&unreadNotifCount>0&&<span style={{ marginLeft:'auto', minWidth:18, height:18, borderRadius:99, background:C.error, color:'#fff', fontSize:9, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 5px' }}>{unreadNotifCount}</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Mobile overlay sidebar */}
      {sidebarOpen&&(
        <div style={{ position:'fixed', inset:0, zIndex:50, background:'rgba(0,0,0,0.4)' }} onClick={()=>setSidebarOpen(false)}>
          <div onClick={e=>e.stopPropagation()} style={{ width:240, height:'100%', background:C.surface, overflowY:'auto' }}>
            <div style={{ padding:'16px 18px', borderBottom:`1px solid ${C.border}` }}>
              <p style={{ fontSize:13, fontWeight:800, color:C.type }}>Browse Jobs</p>
            </div>
            {NAV_ITEMS.map(n=>(
              <button key={n.k} onClick={()=>{ setSub(n.k); setViewingId(null); setApplyId(null); setSidebarOpen(false) }}
                style={{ width:'100%', display:'flex', gap:9, alignItems:'center', padding:'10px 18px', border:'none', background:sub===n.k?`${C.primary}08`:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:sub===n.k?700:500, color:sub===n.k?C.primary:C.type, textAlign:'left' as const }}>
                <span style={{ display:'flex', color:sub===n.k?C.primary:C.muted }}>{n.icon}</span>{n.l}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile top bar */}
      <div className="bjb-mobile-nav" style={{ display:'none', position:'fixed', top:0, left:0, right:0, zIndex:40, background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'12px 18px', alignItems:'center', justifyContent:'space-between' }}>
        <p style={{ fontSize:13, fontWeight:800, color:C.type }}>
          {applyId ? 'Apply' : viewingId ? 'Job Details' : NAV_ITEMS.find(n=>n.k===sub)?.l ?? 'Browse Jobs'}
        </p>
        <button onClick={()=>setSidebarOpen(v=>!v)} style={{ background:'none', border:'none', cursor:'pointer', color:C.type, fontSize:12, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>Menu</button>
      </div>

      {/* Main */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }} className="bjb-main">
        {renderMain()}
      </div>

      {toast&&<SuccessToast msg={toast} />}
    </div>
  )
}
