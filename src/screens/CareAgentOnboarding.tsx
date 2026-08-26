import { useState,useEffect, type ReactNode,useRef, type CSSProperties } from 'react'
import { 
  updateMyProfile,
  uploadProfilePhoto,
  saveMyAgentDetails,
  getMyProfile,
  getMyAgentDetails,
  saveMyAgentSkills,
  getMyAgentSkills,
  saveMyCertification,
  getMyCertifications,
  deleteMyCertification,
  saveMyIdentityDocument,
  getMyIdentityDocuments,
  getMyBankAccount,
  saveMyBankAccount,
  getMyAvailability,
  saveMyAvailability,
  getMyEquipmentTransport,
  saveMyEquipmentTransport,
  getMyReferences,
  saveMyReferences,
  getMyRecommendationLetter,
  saveMyRecommendationLetter,
  deleteMyRecommendationLetter,
  getMyAgreements,
  saveMyAgreements,
  submitMyCareAgentApplication
} from '../lib/api'

// ─── Brand ────────────────────────────────────────────────────────────────────
const C = {
  primary:'#00737A', accent:'#EE8153', type:'#2C3E43', sub:'#6B7E85',
  muted:'#9AAAB0', border:'#E4E8EA', bg:'#F2F4F5', surface:'#FFFFFF',
  success:'#22C55E', warning:'#F59E0B', error:'#EF4444', info:'#3B82F6',
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const I: Record<string, ReactNode> = {
  check:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5l3 3 6-6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevR:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l5 4-5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevL:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3l-5 4 5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  upload:   <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 11V4M5 7l3-3 3 3M3 13h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  file:     <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 1.5h5.5L12 5v7.5H3V1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M8.5 1.5V5H12" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  user:     <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="5" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M2 13c0-3.04 2.46-5.5 5.5-5.5S13 9.96 13 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  camera:   <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="3.5" width="11" height="8.5" rx="2" stroke="currentColor" strokeWidth="1.2"/><circle cx="7" cy="7.75" r="2.2" stroke="currentColor" strokeWidth="1.1"/><path d="M5 3.5l.7-1.5h2.6l.7 1.5" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/></svg>,
  star:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1l1.6 3.3L12 5l-2.75 2.68.65 3.79L6.5 9.82 3.1 11.47l.65-3.79L1 5l3.9-.7L6.5 1z" fill="currentColor"/></svg>,
  shield:   <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 1.5l5 1.8v4C12.5 11 10 13.5 7.5 14.5 5 13.5 2.5 11 2.5 7.3v-4L7.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  bank:     <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M1.5 6h12M7.5 2l6 4H1.5l6-4zM3 6v5.5M7.5 6v5.5M12 6v5.5M1.5 11.5h12" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  calendar: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="2.5" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 6h11M5 1.5v2M9 1.5v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  truck:    <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M1.5 3h8v7H1.5V3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M9.5 5.5h2.5l1.5 2.5v2H9.5V5.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><circle cx="4" cy="10.5" r="1.2" stroke="currentColor" strokeWidth="1.1"/><circle cx="11.5" cy="10.5" r="1.2" stroke="currentColor" strokeWidth="1.1"/></svg>,
  people:   <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="5.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 13c0-2.49 2.02-4.5 4.5-4.5S10 10.51 10 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="11" cy="5" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M12.5 13c0-1.77-.9-3.33-2.25-4.25" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  doc:      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 1.5h5.5L12 5v7.5H3V1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M8.5 1.5V5H12M5 7.5h4M5 9.5h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  lock:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="2" y="5.5" width="9" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 5.5V4a2.5 2.5 0 0 1 5 0v1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  warning:  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5L1.5 12h11L7 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M7 6v2.5M7 10.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  sparkle:  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1l1.5 5H15l-4.5 3.3 1.7 5.2L8 11.5l-4.2 3L5.5 9.3 1 6h5.5L8 1z" fill="currentColor" opacity=".9"/></svg>,
  close:    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  plus:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2v9M2 6.5h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  trash:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 3.5h9M5 3.5V2.5h3V3.5M3.5 3.5l.7 7.5h4.6l.7-7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  edit:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M9.5 1.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  info:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M6.5 6v4M6.5 4v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  time:     <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/><path d="M7 4.5v2.8l1.8 1.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  refresh:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M11.5 6.5a5 5 0 1 1-1.1-3.1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M11.5 3v2.5H9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  wifi:     <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1.5 5.5a8 8 0 0 1 11 0M3.5 7.5a5 5 0 0 1 7 0M5.5 9.5a2.5 2.5 0 0 1 3 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="7" cy="12" r="1" fill="currentColor"/></svg>,
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

function Btn({ label, icon, onClick, variant='primary', small=false, disabled=false }:{ label:string; icon?:ReactNode; onClick?:()=>void; variant?:'primary'|'secondary'|'ghost'|'danger'|'accent'; small?:boolean; disabled?:boolean }) {
  const [h,setH] = useState(false)
  const vs: Record<string,CSSProperties> = {
    primary:   { background:disabled?'#C8D0D4':h?'#005D63':C.primary, color:'#fff', border:'none', boxShadow:disabled?'none':h?`0 4px 16px ${C.primary}50`:`0 2px 8px ${C.primary}30` },
    secondary: { background:h?'#EEF5F5':'#fff', color:C.primary, border:`1.5px solid ${h?C.primary:C.border}` },
    ghost:     { background:h?C.bg:'transparent', color:C.sub, border:'none' },
    danger:    { background:h?'#DC2626':C.error, color:'#fff', border:'none' },
    accent:    { background:h?'#D4663D':C.accent, color:'#fff', border:'none', boxShadow:h?`0 4px 16px ${C.accent}50`:`0 2px 8px ${C.accent}30` },
  }
  return (
    <button onClick={disabled?undefined:onClick} disabled={disabled} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:small?'7px 16px':'11px 22px', borderRadius:10, cursor:disabled?'not-allowed':'pointer', fontFamily:'Manrope,sans-serif', fontSize:small?12:13, fontWeight:700, transition:'all 0.15s', ...vs[variant] }}>
      {icon&&<span style={{display:'flex'}}>{icon}</span>}{label}
    </button>
  )
}

function Toggle({ on, onToggle }:{ on:boolean; onToggle:()=>void }) {
  return (
    <button onClick={onToggle} style={{ width:46, height:26, borderRadius:99, border:'none', cursor:'pointer', background:on?C.primary:C.border, position:'relative', transition:'background 0.2s', flexShrink:0 }}>
      <div style={{ width:20, height:20, borderRadius:'50%', background:'#fff', position:'absolute', top:3, left:on?23:3, transition:'left 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.18)' }} />
    </button>
  )
}

function Bdg({ label, color=C.primary }:{ label:string; color?:string }) {
  return <span style={{ display:'inline-flex', alignItems:'center', padding:'3px 10px', borderRadius:999, fontSize:11, fontWeight:700, background:`${color}12`, color }}>{label}</span>
}

function Input({ label, placeholder='', value, onChange, type='text', hint, required=false }:{ label:string; placeholder?:string; value:string; onChange:(v:string)=>void; type?:string; hint?:string; required?:boolean }) {
  const [focus,setFocus] = useState(false)
  return (
    <div>
      <label style={{ display:'block', fontSize:12, fontWeight:700, color:C.muted, marginBottom:5 }}>{label}{required&&<span style={{color:C.accent}}> *</span>}</label>
      <input type={type} placeholder={placeholder} value={value} onChange={e=>onChange(e.target.value)} onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
        style={{ width:'100%', padding:'10px 13px', borderRadius:10, border:`1.5px solid ${focus?C.primary:C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, background:'#FAFAFA', outline:'none', boxSizing:'border-box' as const, transition:'border 0.15s' }} />
      {hint&&<p style={{fontSize:11,color:C.muted,marginTop:4}}>{hint}</p>}
    </div>
  )
}

function Textarea({ label, placeholder='', value, onChange, rows=3, hint }:{ label:string; placeholder?:string; value:string; onChange:(v:string)=>void; rows?:number; hint?:string }) {
  const [focus,setFocus] = useState(false)
  return (
    <div>
      <label style={{ display:'block', fontSize:12, fontWeight:700, color:C.muted, marginBottom:5 }}>{label}</label>
      <textarea placeholder={placeholder} value={value} onChange={e=>onChange(e.target.value)} rows={rows} onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
        style={{ width:'100%', padding:'10px 13px', borderRadius:10, border:`1.5px solid ${focus?C.primary:C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, background:'#FAFAFA', outline:'none', resize:'none' as const, boxSizing:'border-box' as const, lineHeight:1.65, transition:'border 0.15s' }} />
      {hint&&<p style={{fontSize:11,color:C.muted,marginTop:4}}>{hint}</p>}
    </div>
  )
}

function Select({ label, options, value, onChange, hint }:{ label:string; options:string[]; value:string; onChange:(v:string)=>void; hint?:string }) {
  return (
    <div>
      <label style={{ display:'block', fontSize:12, fontWeight:700, color:C.muted, marginBottom:5 }}>{label}</label>
      <select value={value} onChange={e=>onChange(e.target.value)}
        style={{ width:'100%', padding:'10px 13px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, color:value?C.type:C.muted, background:'#FAFAFA', outline:'none', appearance:'none' as const, boxSizing:'border-box' as const, cursor:'pointer' }}>
        <option value="">Select…</option>
        {options.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
      {hint&&<p style={{fontSize:11,color:C.muted,marginTop:4}}>{hint}</p>}
    </div>
  )
}

function FormSection({ title, children }:{ title:string; children:ReactNode }) {
  return (
    <div style={{ marginBottom:28 }}>
      <p style={{ fontSize:12, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:14 }}>{title}</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="cao-2col">
        {children}
      </div>
    </div>
  )
}

function FormFull({ children }:{ children:ReactNode }) {
  return <div style={{ gridColumn:'1 / -1' }}>{children}</div>
}

// ─── Steps definition ─────────────────────────────────────────────────────────
const STEPS = [
  { n:1,  title:'Personal Information', icon:I.user },
  { n:2,  title:'Professional Profile', icon:I.star },
  { n:3,  title:'Skills & Services',    icon:I.sparkle },
  { n:4,  title:'Certifications',       icon:I.doc },
  { n:5,  title:'Identity Verification',icon:I.shield },
  { n:6,  title:'Banking & Payouts',    icon:I.bank },
  { n:7,  title:'Availability',         icon:I.calendar },
  { n:8,  title:'Equipment & Transport',icon:I.truck },
  { n:9,  title:'References',           icon:I.people },
  { n:10, title:'Agreements',           icon:I.lock },
  { n:11, title:'Review & Submit',      icon:I.check },
]

// ─── Progress sidebar ─────────────────────────────────────────────────────────
function ProgressSidebar({ current, onGoto, completed }:{ current:number; onGoto:(n:number)=>void; completed:Set<number> }) {
  const REGISTRATION_STEPS = 10
  const pct = Math.min(
    100,
    Math.round(
      (completed.size / REGISTRATION_STEPS) * 100
    )
  )
  return (
    <div className="cao-sidebar" style={{ width:256, background:C.surface, borderRight:`1px solid ${C.border}`, padding:'28px 0', display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh', overflowY:'auto', flexShrink:0 }}>
      <div style={{ padding:'0 20px 20px' }}>
        <p style={{ fontSize:12, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>Registration Progress</p>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
          <p style={{ fontSize:11, color:C.muted }}>Completion</p>
          <p style={{ fontSize:14, fontWeight:900, color:pct===100?C.success:C.primary, fontFamily:'Manrope,sans-serif' }}>{pct}%</p>
        </div>
        <div style={{ height:6, borderRadius:99, background:C.bg, overflow:'hidden' }}>
          <div style={{ width:`${pct}%`, height:'100%', background:`linear-gradient(90deg,${C.primary},${C.success})`, borderRadius:99, transition:'width 0.5s' }} />
        </div>
      </div>
      {STEPS.map(s=>{
        const done = completed.has(s.n)
        const active = current===s.n
        return (
          <button key={s.n} onClick={()=>onGoto(s.n)}
            style={{ display:'flex', gap:10, alignItems:'center', padding:'10px 20px', border:'none', background:active?`${C.primary}08`:'transparent', cursor:'pointer', borderLeft:active?`3px solid ${C.primary}`:'3px solid transparent', transition:'all 0.12s', textAlign:'left' as const }}>
            <div style={{ width:26, height:26, borderRadius:'50%', background:done?C.success:active?C.primary:C.bg, border:`2px solid ${done?C.success:active?C.primary:C.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:done||active?'#fff':C.muted, transition:'all 0.18s' }}>
              {done?<span style={{display:'flex',transform:'scale(0.7)'}}>{I.check}</span>:<span style={{fontSize:11,fontWeight:800,fontFamily:'Manrope,sans-serif'}}>{s.n}</span>}
            </div>
            <div>
              <p style={{ fontSize:12, fontWeight:active?800:500, color:active?C.primary:done?C.type:C.sub, lineHeight:1.3 }}>{s.title}</p>
            </div>
          </button>
        )
      })}
      <div style={{ padding:'16px 20px', marginTop:'auto' }}>
        <p style={{ fontSize:11, color:C.muted, lineHeight:1.6 }}>Your progress is saved automatically. You can return anytime to complete your registration.</p>
      </div>
    </div>
  )
}

// ─── Onboarding Home ──────────────────────────────────────────────────────────
type HomeStatus =
  | { kind:'new' }
  | { kind:'incomplete'; percent:number }
  | { kind:'ready' }
  | { kind:'submitted'; applicationStatus:string; submittedAt:string|null }

const formatStatusLabel = (value:string) =>
  value.replace(/_/g,' ').replace(/\b\w/g, char => char.toUpperCase())

const APPLICATION_STATUS_COLOR:Record<string,string> = {
  submitted:C.info,
  under_review:C.primary,
  approved:C.success,
  rejected:C.error,
}

function OnboardingHome({ status, onPrimary }:{ status:HomeStatus; onPrimary:()=>void }) {
  const benefits = [
    { icon:'💰', title:'Earn LKR 800–2,500/hr',    desc:'Set your own rates and get paid weekly' },
    { icon:'🕐', title:'Flexible Schedule',          desc:'Choose when and where you work' },
    { icon:'🏥', title:'Hospital Network',           desc:'Access verified hospital and care facility partnerships' },
    { icon:'📱', title:'Smart Job Matching',         desc:'AI-powered matching connects you to ideal clients' },
    { icon:'🛡️', title:'Insurance Coverage',         desc:'ReadyPal covers you with professional liability insurance' },
    { icon:'⭐', title:'Build Your Reputation',      desc:'Earn ratings, badges and featured placement' },
  ]
  const reqs = [
    { done:false, label:'Valid NIC / National ID' },
    { done:false, label:'Police Clearance Certificate (within 6 months)' },
    { done:false, label:'Medical Fitness Certificate' },
    { done:false, label:'Relevant qualification or 1+ year experience' },
    { done:false, label:'Bank account for payouts' },
    { done:false, label:'Smartphone with internet access' },
  ]
  const statusTitle =
    status.kind==='new'        ? 'Registration not started' :
    status.kind==='incomplete' ? 'Registration in progress' :
    status.kind==='ready'      ? 'Ready to submit' :
    formatStatusLabel(status.applicationStatus)

  const statusColor =
    status.kind==='new'        ? C.muted :
    status.kind==='incomplete' ? C.primary :
    status.kind==='ready'      ? C.accent :
    APPLICATION_STATUS_COLOR[status.applicationStatus] ?? C.primary

  const buttonLabel =
    status.kind==='new'        ? 'Start Registration' :
    status.kind==='incomplete' ? 'Continue Registration' :
    status.kind==='ready'      ? 'Review & Submit' :
    'View Application Status'

  const formattedSubmittedDate =
    status.kind==='submitted' && status.submittedAt
      ? new Date(status.submittedAt).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })
      : null

  return (
    <PageContainer maxWidth={1080} style={{ padding:'40px 36px 80px' }}>
      {/* Hero */}
      <div style={{ textAlign:'center' as const, marginBottom:48 }}>
        <div style={{ width:72, height:72, borderRadius:24, background:`linear-gradient(135deg,${C.primary},#00959E)`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', boxShadow:`0 12px 32px ${C.primary}30` }}>
          <span style={{ fontSize:32 }}>🩺</span>
        </div>
        <h1 style={{ fontSize:36, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:12, lineHeight:1.2 }}>Become a ReadyPal Care Agent</h1>
        <p style={{ fontSize:16, color:C.sub, maxWidth:540, margin:'0 auto', lineHeight:1.7 }}>Join Sri Lanka's most trusted care platform. Help families. Build your career. Earn on your terms.</p>
        <div style={{ display:'flex', gap:16, justifyContent:'center', marginTop:20, flexWrap:'wrap' as const }}>
          <div style={{ display:'flex', gap:6, alignItems:'center' }}>
            <span style={{ color:C.primary, display:'flex' }}>{I.time}</span>
            <p style={{ fontSize:13, color:C.sub }}>~25 min to complete</p>
          </div>
          <div style={{ display:'flex', gap:6, alignItems:'center' }}>
            <span style={{ color:C.success, display:'flex' }}>{I.shield}</span>
            <p style={{ fontSize:13, color:C.sub }}>Safe & secure</p>
          </div>
          <div style={{ display:'flex', gap:6, alignItems:'center' }}>
            <span style={{ color:C.accent, display:'flex' }}>{I.refresh}</span>
            <p style={{ fontSize:13, color:C.sub }}>Save & continue later</p>
          </div>
        </div>
      </div>

      {/* Application status */}
      <Card style={{ padding:24, marginBottom:32, background:`linear-gradient(135deg,${statusColor}08,${statusColor}02)`, border:`1px solid ${statusColor}20` }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:20, flexWrap:'wrap' as const }}>
          <div>
            <p style={{ fontSize:11, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>Application Status</p>
            <p style={{ fontSize:20, fontWeight:900, color:statusColor, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>{statusTitle}</p>
            {status.kind==='incomplete' && <p style={{ fontSize:13, color:C.muted }}>{status.percent}% complete</p>}
            {status.kind==='submitted' && formattedSubmittedDate && <p style={{ fontSize:13, color:C.muted }}>Submitted {formattedSubmittedDate}</p>}
          </div>
          <Btn label={buttonLabel} onClick={onPrimary} />
        </div>
        {status.kind==='incomplete' && (
          <div style={{ height:8, borderRadius:99, background:C.bg, overflow:'hidden', marginTop:18 }}>
            <div style={{ width:`${status.percent}%`, height:'100%', background:`linear-gradient(90deg,${C.primary},${C.success})`, borderRadius:99, transition:'width 0.5s' }} />
          </div>
        )}
      </Card>

      {/* Benefits + Requirements */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, marginBottom:32 }} className="cao-2col">
        <div>
          <h2 style={{ fontSize:16, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:16 }}>Why Join ReadyPal?</h2>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {benefits.map((b,i)=>(
              <Card key={i} hover style={{ padding:16 }}>
                <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                  <div style={{ width:40, height:40, borderRadius:13, background:`${C.primary}08`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{b.icon}</div>
                  <div>
                    <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:2 }}>{b.title}</p>
                    <p style={{ fontSize:12, color:C.muted, lineHeight:1.5 }}>{b.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <h2 style={{ fontSize:16, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:16 }}>Requirements Checklist</h2>
          <Card style={{ padding:22 }}>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {reqs.map((r,i)=>(
                <div key={i} style={{ display:'flex', gap:10, alignItems:'center' }}>
                  <div style={{ width:22, height:22, borderRadius:'50%', background:r.done?C.success:C.bg, border:`2px solid ${r.done?C.success:C.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    {r.done&&<span style={{color:'#fff',display:'flex',transform:'scale(0.7)'}}>{I.check}</span>}
                  </div>
                  <p style={{ fontSize:13, color:C.type }}>{r.label}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card style={{ padding:22, marginTop:16, background:`linear-gradient(135deg,${C.primary}08,${C.primary}02)`, border:`1px solid ${C.primary}20` }}>
            <div style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:12 }}>
              <span style={{ fontSize:24 }}>💡</span>
              <div>
                <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:4 }}>Tip: Have your documents ready</p>
                <p style={{ fontSize:12, color:C.muted, lineHeight:1.6 }}>Gathering your NIC, police clearance, and qualifications before starting will make registration much faster.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}

// ─── Reusable responsive page container ────────────────────────────────────
function PageContainer({ children, maxWidth=880, style={} }:{ children:ReactNode; maxWidth?:number; style?:CSSProperties }) {
  return (
    <div className="cao-container" style={{ maxWidth, margin:'0 auto', width:'100%', ...style }}>
      {children}
    </div>
  )
}

// ─── Step wrapper ─────────────────────────────────────────────────────────────
function StepWrap({
  step,
  total,
  title,
  desc,
  children,
  onBack,
  onNext,
  nextLabel='Save & Continue',
  nextDisabled=false,
  maxWidth=880
}:{
  step:number
  total:number
  title:string
  desc:string
  children:ReactNode
  onBack:()=>void
  onNext:()=>void
  nextLabel?:string
  nextDisabled?:boolean
  maxWidth?:number
})
{
  return (
    <div style={{ flex:1, overflowY:'auto', padding:'32px 0 80px' }}>
      <PageContainer maxWidth={maxWidth}>
        {/* Step header */}
        <div style={{ marginBottom:28 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
            <Bdg label={`Step ${step} of ${total}`} color={C.muted} />
          </div>
          <h2 style={{ fontSize:24, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>{title}</h2>
          <p style={{ fontSize:14, color:C.muted }}>{desc}</p>
        </div>
        {children}
        {/* Nav */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:32, paddingTop:24, borderTop:`1px solid ${C.border}` }}>
          <Btn label="Back" variant="ghost" icon={I.chevL} onClick={onBack} />
          <Btn label={nextLabel} icon={I.chevR} onClick={onNext} disabled={nextDisabled}/>
        </div>
      </PageContainer>
    </div>
  )
}

// ─── Step 1: Personal Information ─────────────────────────────────────────────
// ─── Step 1: Personal Information ─────────────────────────────────────────────
function Step1({
  onBack,
  onNext
}:{
  onBack:()=>void
  onNext:()=>void
}) {

  const [photoUrl, setPhotoUrl] = useState('')
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null)
  const [photoUploading, setPhotoUploading] = useState(false)
  const [photoError, setPhotoError] = useState('')

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    preferred: '',
    nic: '',
    dob: '',
    gender: '',
    nationality: '',
    email: '',
    phone: '',
    emergency: '',
    address: '',
    province: '',
    district: '',
    city: '',
    postal: ''
  })

  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  // Used to detect whether the user changed saved data
  const [initialData, setInitialData] = useState('')
  const [hasSavedData, setHasSavedData] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)

  const f = (key:string) => (value:string) => {
    setForm(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // Current editable values
  // For a newly selected photo we use the file metadata instead of
  // the temporary browser object URL.
  const currentData = JSON.stringify({
    form,
    photo: selectedPhoto
      ? {
          name: selectedPhoto.name,
          size: selectedPhoto.size,
          type: selectedPhoto.type,
          lastModified: selectedPhoto.lastModified
        }
      : photoUrl
  })

  const hasChanges =
    initialData !== '' &&
    currentData !== initialData

  // First-time user → can save.
  // Existing saved data → must change something first.
  const canSave =
    !loadingProfile &&
    (!hasSavedData || hasChanges)

  // ────────────────────────────────────────────────────────────────────────────
  // Load saved Personal Information
  // ────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoadingProfile(true)

        const profile = await getMyProfile()

        if (!profile) {
          setHasSavedData(false)
          return
        }

        const nameParts =
          (profile.full_name || '')
            .trim()
            .split(' ')
            .filter(Boolean)

        const firstName = nameParts[0] || ''
        const lastName = nameParts.slice(1).join(' ')

        const loadedForm = {
          firstName,
          lastName,
          preferred: profile.preferred_name || '',
          nic: profile.nic || '',
          dob: profile.date_of_birth || '',
          gender: profile.gender || '',
          nationality: profile.nationality || '',
          email: profile.email || '',
          phone: profile.phone || '',
          emergency: profile.emergency_contact || '',
          address: profile.address || '',
          province: profile.province || '',
          district: profile.district || '',
          city: profile.city || '',
          postal: profile.postal_code || ''
        }

        const loadedPhotoUrl =
          profile.avatar_url || ''

        setForm(loadedForm)
        setPhotoUrl(loadedPhotoUrl)
        setSelectedPhoto(null)

        // Consider it saved only when Step 1 actually contains data.
        const profileHasData =
          Boolean(profile.full_name) ||
          Boolean(profile.nic) ||
          Boolean(profile.date_of_birth) ||
          Boolean(profile.phone) ||
          Boolean(profile.address)

        setHasSavedData(profileHasData)

        setInitialData(
          JSON.stringify({
            form: loadedForm,
            photo: loadedPhotoUrl
          })
        )

      } catch (error) {
        console.error(
          'Failed to load personal information:',
          error
        )

        setSaveError(
          'Failed to load saved personal information'
        )

      } finally {
        setLoadingProfile(false)
      }
    }

    loadProfile()
  }, [])

  // ────────────────────────────────────────────────────────────────────────────
  // Select / Change profile photo
  // ────────────────────────────────────────────────────────────────────────────
  const handlePhotoUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError(
        'Image must be smaller than 5MB'
      )
      return
    }

    setPhotoError('')
    setSaveError('')
    setSelectedPhoto(file)

    const previewUrl =
      URL.createObjectURL(file)

    setPhotoUrl(previewUrl)

    // Allows selecting the same file again later.
    event.target.value = ''
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Save Step 1
  // ────────────────────────────────────────────────────────────────────────────
  const handleSaveAndContinue = async () => {
    try {
      if (!canSave || saving) {
        return
      }

      setSaving(true)
      setSaveError('')
      setPhotoError('')

      // Required field validation
      if (!form.firstName.trim()) {
        throw new Error(
          'First name is required'
        )
      }

      if (!form.lastName.trim()) {
        throw new Error(
          'Last name is required'
        )
      }

      if (!form.nic.trim()) {
        throw new Error(
          'NIC is required'
        )
      }

      if (!form.dob) {
        throw new Error(
          'Date of birth is required'
        )
      }

      if (!form.email.trim()) {
        throw new Error(
          'Email is required'
        )
      }

      if (!form.phone.trim()) {
        throw new Error(
          'Phone number is required'
        )
      }

      if (!form.address.trim()) {
        throw new Error(
          'Address is required'
        )
      }

      if (!form.city.trim()) {
        throw new Error(
          'City is required'
        )
      }

      let finalPhotoUrl = photoUrl
      let uploadedAvatarUrl:
        string | undefined

      // Upload only when user selected a new photo
      if (selectedPhoto) {
        setPhotoUploading(true)

        const photoResult =
          await uploadProfilePhoto(selectedPhoto)

        uploadedAvatarUrl =
          photoResult.avatarUrl

        finalPhotoUrl =
          uploadedAvatarUrl

        setPhotoUrl(
          uploadedAvatarUrl
        )
      }

      await updateMyProfile({
        full_name:
          `${form.firstName.trim()} ${form.lastName.trim()}`,

        preferred_name:
          form.preferred.trim(),

        nic:
          form.nic.trim(),

        date_of_birth:
          form.dob,

        gender:
          form.gender,

        nationality:
          form.nationality,

        email:
          form.email.trim(),

        phone:
          form.phone.trim(),

        emergency_contact:
          form.emergency.trim(),

        address:
          form.address.trim(),

        province:
          form.province,

        district:
          form.district,

        city:
          form.city.trim(),

        postal_code:
          form.postal.trim(),

        ...(uploadedAvatarUrl && {
          avatar_url:
            uploadedAvatarUrl
        })
      })

      // Reset dirty state after successful save
      setSelectedPhoto(null)
      setHasSavedData(true)

      setInitialData(
        JSON.stringify({
          form,
          photo: finalPhotoUrl
        })
      )

      // Parent decides:
      // normal onboarding → Step 2
      // review edit mode → Step 11
      onNext()

    } catch (error) {
      console.error(
        'Failed to save personal information:',
        error
      )

      if (error instanceof Error) {
        setSaveError(
          error.message
        )
      } else {
        setSaveError(
          'Failed to save personal information'
        )
      }

    } finally {
      setSaving(false)
      setPhotoUploading(false)
    }
  }

  return (
    <StepWrap
      step={1}
      total={11}
      title="Personal Information"
      desc="Tell us about yourself. This information will be verified against your official documents."
      onBack={onBack}
      onNext={handleSaveAndContinue}
      nextLabel={
        saving
          ? 'Saving...'
          : 'Save & Continue'
      }
      nextDisabled={
        !canSave ||
        saving ||
        photoUploading
      }
    >

      {/* Profile Photo */}
      <Card
        style={{
          padding:20,
          marginBottom:24
        }}
      >
        <p
          style={{
            fontSize:12,
            fontWeight:800,
            color:C.muted,
            textTransform:'uppercase',
            letterSpacing:'0.08em',
            marginBottom:14
          }}
        >
          Profile Photo
        </p>

        <div
          style={{
            display:'flex',
            gap:16,
            alignItems:'center'
          }}
        >
          <div
            style={{
              width:80,
              height:80,
              borderRadius:'50%',
              background:`${C.primary}10`,
              border:`3px solid ${
                photoUrl
                  ? C.success
                  : C.border
              }`,
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              flexShrink:0,
              overflow:'hidden'
            }}
          >
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Profile"
                style={{
                  width:'100%',
                  height:'100%',
                  objectFit:'cover'
                }}
              />
            ) : (
              <span
                style={{
                  color:C.muted,
                  display:'flex',
                  transform:'scale(1.3)'
                }}
              >
                {I.camera}
              </span>
            )}
          </div>

          <div style={{ flex:1 }}>
            <p
              style={{
                fontSize:13,
                fontWeight:700,
                color:C.type,
                marginBottom:4
              }}
            >
              Upload a professional photo
            </p>

            <p
              style={{
                fontSize:12,
                color:C.muted,
                lineHeight:1.6
              }}
            >
              Clear face photo, plain background preferred.
              Min 400×400px, max 5MB.
            </p>

            <label
              style={{
                display:'inline-block',
                marginTop:8,
                fontSize:12,
                fontWeight:700,
                color:C.primary,
                cursor:
                  photoUploading
                    ? 'not-allowed'
                    : 'pointer'
              }}
            >
              {photoUploading
                ? 'Uploading...'
                : photoUrl
                  ? 'Change Photo'
                  : 'Upload Photo'}

              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={photoUploading}
                style={{
                  display:'none'
                }}
              />
            </label>

            {selectedPhoto && (
              <p
                style={{
                  marginTop:6,
                  fontSize:11,
                  color:C.primary,
                  fontWeight:600
                }}
              >
                New photo selected — save changes to update it.
              </p>
            )}

            {photoError && (
              <p
                style={{
                  marginTop:6,
                  fontSize:11,
                  color:C.error
                }}
              >
                {photoError}
              </p>
            )}
          </div>

          {photoUrl && (
            <Bdg
              label={
                selectedPhoto
                  ? 'New Photo Selected'
                  : 'Photo Uploaded'
              }
              color={
                selectedPhoto
                  ? C.info
                  : C.success
              }
            />
          )}
        </div>
      </Card>

      {/* Personal Information */}
      <Card
        style={{
          padding:'4px 20px 20px',
          marginBottom:20
        }}
      >

        {/* Full Name */}
        <FormSection title="Full Name">

          <Input
            label="First Name"
            value={form.firstName}
            onChange={f('firstName')}
            required
          />

          <Input
            label="Last Name"
            value={form.lastName}
            onChange={f('lastName')}
            required
          />

          <Input
            label="Preferred Name"
            value={form.preferred}
            onChange={f('preferred')}
            hint="Name shown to clients"
          />

          <Input
            label="NIC / National ID"
            value={form.nic}
            onChange={f('nic')}
            required
          />

        </FormSection>

        {/* Personal Details */}
        <FormSection title="Personal Details">

          <Input
            label="Date of Birth"
            type="date"
            value={form.dob}
            onChange={f('dob')}
            required
          />

          <Select
            label="Gender"
            options={[
              'Male',
              'Female',
              'Prefer not to say'
            ]}
            value={form.gender}
            onChange={f('gender')}
          />

          <Select
            label="Nationality"
            options={[
              'Sri Lankan',
              'Other'
            ]}
            value={form.nationality}
            onChange={f('nationality')}
          />

        </FormSection>

        {/* Contact */}
        <FormSection title="Contact">

          <Input
            label="Email Address"
            type="email"
            value={form.email}
            onChange={f('email')}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            value={form.phone}
            onChange={f('phone')}
            required
          />

          <FormFull>
            <Input
              label="Emergency Contact"
              value={form.emergency}
              onChange={f('emergency')}
              hint="Name and phone number"
            />
          </FormFull>

        </FormSection>

        {/* Address */}
        <FormSection title="Residential Address">

          <FormFull>
            <Input
              label="Address"
              value={form.address}
              onChange={f('address')}
              required
            />
          </FormFull>

          <Select
            label="Province"
            options={[
              'Western Province',
              'Central Province',
              'Southern Province',
              'Northern Province',
              'Eastern Province',
              'North Western Province',
              'North Central Province',
              'Uva Province',
              'Sabaragamuwa Province'
            ]}
            value={form.province}
            onChange={f('province')}
          />

          <Select
            label="District"
            options={[
              'Colombo',
              'Gampaha',
              'Kalutara',
              'Kandy',
              'Matale',
              'Nuwara Eliya',
              'Galle',
              'Matara',
              'Hambantota'
            ]}
            value={form.district}
            onChange={f('district')}
          />

          <Input
            label="City"
            value={form.city}
            onChange={f('city')}
            required
          />

          <Input
            label="Postal Code"
            value={form.postal}
            onChange={f('postal')}
          />

        </FormSection>

        {/* Save Error */}
        {saveError && (
          <div
            style={{
              padding:'12px 14px',
              marginBottom:16,
              borderRadius:10,
              background:`${C.error}08`,
              border:`1px solid ${C.error}30`,
              color:C.error,
              fontSize:12,
              fontWeight:600
            }}
          >
            {saveError}
          </div>
        )}

      </Card>

    </StepWrap>
  )
}

// ─── Step 2: Professional Profile ─────────────────────────────────────────────
function Step2({
  onBack,
  onNext
}:{
  onBack:()=>void
  onNext:()=>void
}) {

  const emptyForm = {
    headline:'',
    bio:'',
    years:'',
    employment:'',
    prevEmployment:'',
    edu:'',
    hourlyRate:'',
    maxRate:'',
    areas:''
  }

  const [form, setForm] = useState(emptyForm)

  const [langs, setLangs] =
    useState<string[]>([])

  const [saving, setSaving] =
    useState(false)

  const [saveError, setSaveError] =
    useState('')

  const [loadingDetails, setLoadingDetails] =
    useState(true)

  // Dirty-state tracking
  const [initialData, setInitialData] =
    useState('')

  const [hasSavedData, setHasSavedData] =
    useState(false)

  // ─────────────────────────────────────────────
  // Form field update
  // ─────────────────────────────────────────────
  const f =
    (key:keyof typeof form) =>
    (value:string) => {

      setForm(prev => ({
        ...prev,
        [key]:value
      }))

      setSaveError('')
    }

  // ─────────────────────────────────────────────
  // Language toggle
  // ─────────────────────────────────────────────
  const toggleLanguage = (
    language:string
  ) => {

    setLangs(prev =>
      prev.includes(language)
        ? prev.filter(
            item =>
              item !== language
          )
        : [
            ...prev,
            language
          ]
    )

    setSaveError('')
  }

  // ─────────────────────────────────────────────
  // Experience helpers
  // ─────────────────────────────────────────────
  const convertExperienceToYears = (
    value:string
  ) => {

    switch (value) {

      case 'Less than 1 year':
        return 0

      case '1–2 years':
        return 1

      case '3–5 years':
        return 3

      case '5–8 years':
        return 5

      case '8–10 years':
        return 8

      case '10+ years':
        return 10

      default:
        return 0
    }
  }

  const convertYearsToOption = (
    years:number | null | undefined
  ) => {

    if (
      years === null ||
      years === undefined
    ) {
      return ''
    }

    if (years < 1) {
      return 'Less than 1 year'
    }

    if (years <= 2) {
      return '1–2 years'
    }

    if (years <= 5) {
      return '3–5 years'
    }

    if (years <= 8) {
      return '5–8 years'
    }

    if (years <= 10) {
      return '8–10 years'
    }

    return '10+ years'
  }

  // ─────────────────────────────────────────────
  // Dirty-state snapshot
  // ─────────────────────────────────────────────
  const createSnapshot = (
    formData:typeof form,
    languages:string[]
  ) => {

    return JSON.stringify({
      form:formData,
      langs:[
        ...languages
      ].sort()
    })
  }

  const currentData =
    createSnapshot(
      form,
      langs
    )

  const hasChanges =
    initialData !== '' &&
    currentData !== initialData

  // First-time user:
  // Save enabled after loading.
  //
  // Existing saved user:
  // Save enabled only when something changes.
  const canSave =
    !loadingDetails &&
    (
      !hasSavedData ||
      hasChanges
    )

  // ─────────────────────────────────────────────
  // Load saved Step 2 data
  // ─────────────────────────────────────────────
  useEffect(() => {

    let cancelled = false

    const loadAgentDetails =
      async () => {

        try {

          setLoadingDetails(true)
          setSaveError('')

          const details =
            await getMyAgentDetails()

          if (cancelled) return

          // ─────────────────────────────
          // NEW USER
          // No agent_details row yet.
          // This is NOT an error.
          // ─────────────────────────────
          if (!details) {

            setForm(
              emptyForm
            )

            setLangs(
              []
            )

            setHasSavedData(
              false
            )

            setInitialData(
              createSnapshot(
                emptyForm,
                []
              )
            )

            return
          }

          // ─────────────────────────────
          // EXISTING USER
          // Load saved details
          // ─────────────────────────────
          const loadedForm = {

            headline:
              details.professional_headline ||
              '',

            bio:
              details.bio ||
              '',

            years:
              convertYearsToOption(
                details.experience_years
              ),

            employment:
              details.current_employer ||
              '',

            prevEmployment:
              details.previous_employment ||
              '',

            edu:
              details.education ||
              '',

            hourlyRate:
              details.hourly_rate
                ?.toString() ||
              '',

            maxRate:
              details.max_rate
                ?.toString() ||
              '',

            areas:
              Array.isArray(
                details.service_areas
              )
                ? details
                    .service_areas
                    .join(', ')
                : ''
          }

          const loadedLangs =
            Array.isArray(
              details.languages
            )
              ? details.languages
              : []

          setForm(
            loadedForm
          )

          setLangs(
            loadedLangs
          )

          const detailsHaveData =
            Boolean(
              details.professional_headline
            ) ||
            Boolean(
              details.bio
            ) ||
            details.experience_years !== null ||
            (
              Array.isArray(
                details.languages
              ) &&
              details.languages.length > 0
            )

          setHasSavedData(
            detailsHaveData
          )

          setInitialData(
            createSnapshot(
              loadedForm,
              loadedLangs
            )
          )

        } catch (error:any) {

          if (cancelled) return

          console.error(
            'Failed to load professional profile:',
            error
          )

          // ─────────────────────────────
          // Supabase "no rows found"
          // should be treated as a new user,
          // not as a visible error.
          // ─────────────────────────────
          const isNoRowError =
            error?.code === 'PGRST116' ||
            error?.status === 406 ||
            String(
              error?.message || ''
            )
              .toLowerCase()
              .includes(
                '0 rows'
              ) ||
            String(
              error?.message || ''
            )
              .toLowerCase()
              .includes(
                'no rows'
              ) ||
            String(
              error?.message || ''
            )
              .toLowerCase()
              .includes(
                'multiple (or no) rows returned'
              )

          if (isNoRowError) {

            setForm(
              emptyForm
            )

            setLangs(
              []
            )

            setHasSavedData(
              false
            )

            setInitialData(
              createSnapshot(
                emptyForm,
                []
              )
            )

            // IMPORTANT:
            // Do NOT show red error message
            setSaveError('')

            return
          }

          // Real database / network / RLS error
          setSaveError(
            'Failed to load saved professional profile'
          )

        } finally {

          if (!cancelled) {
            setLoadingDetails(
              false
            )
          }

        }
      }

    loadAgentDetails()

    return () => {
      cancelled = true
    }

  }, [])

  // ─────────────────────────────────────────────
  // Save Step 2
  // ─────────────────────────────────────────────
  const handleSaveAndContinue =
    async () => {

      try {

        if (
          !canSave ||
          saving
        ) {
          return
        }

        setSaveError('')

        // Required validation
        if (
          !form.headline.trim()
        ) {
          throw new Error(
            'Professional headline is required'
          )
        }

        if (
          form.bio
            .trim()
            .length < 100
        ) {
          throw new Error(
            'Biography must be at least 100 characters'
          )
        }

        if (
          !form.years
        ) {
          throw new Error(
            'Please select your years of experience'
          )
        }

        if (
          langs.length === 0
        ) {
          throw new Error(
            'Please select at least one language'
          )
        }

        // Optional validation
        if (
          form.hourlyRate &&
          Number(
            form.hourlyRate
          ) < 0
        ) {
          throw new Error(
            'Hourly rate cannot be negative'
          )
        }

        if (
          form.maxRate &&
          Number(
            form.maxRate
          ) < 0
        ) {
          throw new Error(
            'Maximum rate cannot be negative'
          )
        }

        if (
          form.hourlyRate &&
          form.maxRate &&
          Number(
            form.maxRate
          ) <
          Number(
            form.hourlyRate
          )
        ) {
          throw new Error(
            'Maximum rate cannot be lower than hourly rate'
          )
        }

        setSaving(
          true
        )

        const serviceAreas =
          form.areas
            .split(',')
            .map(
              area =>
                area.trim()
            )
            .filter(Boolean)

        await saveMyAgentDetails({

          professional_headline:
            form.headline.trim(),

          bio:
            form.bio.trim(),

          education:
            form.edu.trim(),

          experience_years:
            convertExperienceToYears(
              form.years
            ),

          hourly_rate:
            form.hourlyRate
              ? Number(
                  form.hourlyRate
                )
              : undefined,

          max_rate:
            form.maxRate
              ? Number(
                  form.maxRate
                )
              : undefined,

          languages:
            langs,

          current_employer:
            form.employment.trim(),

          previous_employment:
            form.prevEmployment.trim(),

          service_areas:
            serviceAreas
        })

        // Normalize local state
        // to exactly match what was saved.
        const savedForm = {

          ...form,

          headline:
            form.headline.trim(),

          bio:
            form.bio.trim(),

          employment:
            form.employment.trim(),

          prevEmployment:
            form.prevEmployment.trim(),

          edu:
            form.edu.trim(),

          areas:
            serviceAreas.join(', ')
        }

        setForm(
          savedForm
        )

        setHasSavedData(
          true
        )

        setInitialData(
          createSnapshot(
            savedForm,
            langs
          )
        )

        // Normal onboarding:
        // Step 2 → Step 3
        //
        // Review edit mode:
        // Step 2 → Step 11
        onNext()

      } catch (error) {

        console.error(
          'Failed to save professional profile:',
          error
        )

        if (
          error instanceof Error
        ) {
          setSaveError(
            error.message
          )
        } else {
          setSaveError(
            'Failed to save professional profile'
          )
        }

      } finally {

        setSaving(
          false
        )

      }
    }

  // ─────────────────────────────────────────────
  // Loading UI
  // ─────────────────────────────────────────────
  if (loadingDetails) {

    return (
      <StepWrap
        step={2}
        total={11}
        title="Professional Profile"
        desc="Showcase your expertise to attract the right clients."
        onBack={onBack}
        onNext={() => {}}
        nextDisabled={true}
      >

        <Card
          style={{
            padding:30,
            textAlign:
              'center' as const
          }}
        >
          <p
            style={{
              fontSize:13,
              color:C.muted
            }}
          >
            Loading professional profile...
          </p>
        </Card>

      </StepWrap>
    )
  }

  return (
    <StepWrap
      step={2}
      total={11}
      title="Professional Profile"
      desc="Showcase your expertise to attract the right clients."
      onBack={onBack}
      onNext={
        handleSaveAndContinue
      }
      nextLabel={
        saving
          ? 'Saving...'
          : 'Save & Continue'
      }
      nextDisabled={
        !canSave ||
        saving
      }
    >

      {/* Main Professional Profile */}
      <Card
        style={{
          padding:
            '4px 20px 20px',

          marginBottom:20
        }}
      >

        {/* Headline & Bio */}
        <FormSection title="Headline & Bio">

          <FormFull>
            <Input
              label="Professional Headline"

              value={
                form.headline
              }

              onChange={
                f('headline')
              }

              hint="One sentence that sums up your expertise"

              required
            />
          </FormFull>

          <FormFull>
            <Textarea
              label="Biography"

              value={
                form.bio
              }

              onChange={
                f('bio')
              }

              rows={5}

              hint="Write in first person. Minimum 100 characters."
            />
          </FormFull>

        </FormSection>

        {/* Experience */}
        <FormSection title="Experience">

          <Select
            label="Years of Experience"

            options={[
              'Less than 1 year',
              '1–2 years',
              '3–5 years',
              '5–8 years',
              '8–10 years',
              '10+ years'
            ]}

            value={
              form.years
            }

            onChange={
              f('years')
            }
          />

          <Input
            label="Current Employer / Organisation"

            value={
              form.employment
            }

            onChange={
              f('employment')
            }

            hint="Hospital, clinic, or self-employed"
          />

          <FormFull>
            <Input
              label="Previous Employment"

              value={
                form.prevEmployment
              }

              onChange={
                f('prevEmployment')
              }

              hint="Most recent previous employer and dates"
            />
          </FormFull>

          <FormFull>
            <Input
              label="Education / Qualifications"

              value={
                form.edu
              }

              onChange={
                f('edu')
              }
            />
          </FormFull>

          <FormFull>
            <Input
              label="Hourly Rate (LKR)"

              type="number"

              value={
                form.hourlyRate
              }

              onChange={
                f('hourlyRate')
              }

              hint="Your standard hourly rate"
            />
          </FormFull>

          <FormFull>
            <Input
              label="Maximum Rate (LKR)"

              type="number"

              value={
                form.maxRate
              }

              onChange={
                f('maxRate')
              }

              hint="Maximum hourly rate for complex or urgent care"
            />
          </FormFull>

        </FormSection>

      </Card>

      {/* Languages */}
      <Card
        style={{
          padding:20,
          marginBottom:14
        }}
      >

        <p
          style={{
            fontSize:12,
            fontWeight:800,
            color:C.muted,

            textTransform:
              'uppercase',

            letterSpacing:
              '0.08em',

            marginBottom:12
          }}
        >
          Languages Spoken *
        </p>

        <div
          style={{
            display:'flex',
            gap:8,

            flexWrap:
              'wrap' as const,

            marginBottom:10
          }}
        >

          {[
            'English',
            'Sinhala',
            'Tamil',
            'Hindi'
          ].map(
            language => (

              <button
                type="button"

                key={
                  language
                }

                onClick={() =>
                  toggleLanguage(
                    language
                  )
                }

                style={{
                  padding:
                    '7px 14px',

                  borderRadius:99,

                  border:
                    `1.5px solid ${
                      langs.includes(
                        language
                      )
                        ? C.primary
                        : C.border
                    }`,

                  background:
                    langs.includes(
                      language
                    )
                      ? `${C.primary}08`
                      : 'transparent',

                  cursor:'pointer',

                  fontFamily:
                    'Manrope,sans-serif',

                  fontSize:12,

                  fontWeight:
                    langs.includes(
                      language
                    )
                      ? 700
                      : 500,

                  color:
                    langs.includes(
                      language
                    )
                      ? C.primary
                      : C.sub,

                  transition:
                    'all 0.12s'
                }}
              >

                {langs.includes(
                  language
                ) && (
                  <span
                    style={{
                      marginRight:5
                    }}
                  >
                    ✓
                  </span>
                )}

                {language}

              </button>

            )
          )}

        </div>

      </Card>

      {/* Preferred Working Areas */}
      <Card
        style={{
          padding:20
        }}
      >

        <p
          style={{
            fontSize:12,
            fontWeight:800,
            color:C.muted,

            textTransform:
              'uppercase',

            letterSpacing:
              '0.08em',

            marginBottom:12
          }}
        >
          Preferred Working Areas
        </p>

        <Input
          label="Preferred Working Areas"

          value={
            form.areas
          }

          onChange={
            f('areas')
          }

          hint="e.g. Colombo, Dehiwela, Moratuwa"
        />

      </Card>

      {/* Error */}
      {saveError && (
        <div
          style={{
            padding:'12px 14px',
            marginTop:16,
            borderRadius:10,

            background:
              `${C.error}08`,

            border:
              `1px solid ${C.error}30`,

            color:C.error,

            fontSize:12,
            fontWeight:600
          }}
        >
          {saveError}
        </div>
      )}

    </StepWrap>
  )
}


// ─── Step 3: Skills & Services ────────────────────────────────────────────────
function Step3({
  onBack,
  onNext
}:{
  onBack:()=>void
  onNext:()=>void
}) {

  type SkillData = {
    level:string
    years:string
    certified:boolean
  }

  const services = [
    'Hospital Companion',
    'Medication Collection',
    'Home Care',
    'Transportation Assistance',
    'Wheelchair Assistance',
    'Post-Surgery Care',
    'Stroke Care',
    'Dementia Care',
    'First Aid',
    'CPR',
    'Mental Health Support',
    'Shopping Assistance',
    'Bill Payments'
  ]

  const [selected, setSelected] = useState<
    Record<string, SkillData>
  >({})

  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [loadingSkills, setLoadingSkills] = useState(true)

  // Dirty-state tracking
  const [initialData, setInitialData] = useState('')
  const [hasSavedData, setHasSavedData] = useState(false)

  // ────────────────────────────────────────────────────────────────────────────
  // Normalize selected skills before comparing
  // ────────────────────────────────────────────────────────────────────────────
  const normalizeSelected = (
    data:Record<string, SkillData>
  ) => {
    return Object.keys(data)
      .sort()
      .map(serviceName => ({
        service_name:serviceName,
        level:data[serviceName].level,
        years:data[serviceName].years,
        certified:data[serviceName].certified
      }))
  }

  const currentData = JSON.stringify(
    normalizeSelected(selected)
  )

  const hasChanges =
    initialData !== '' &&
    currentData !== initialData

  // First-time user → Save available
  // Previously saved Step 3 → change required first
  const canSave =
    !loadingSkills &&
    (!hasSavedData || hasChanges)

  // ────────────────────────────────────────────────────────────────────────────
  // Select / remove service
  // ────────────────────────────────────────────────────────────────────────────
  const toggle = (service:string) => {
    setSaveError('')

    if (selected[service]) {
      setSelected(prev => {
        const updated = { ...prev }

        delete updated[service]

        return updated
      })
    } else {
      setSelected(prev => ({
        ...prev,

        [service]:{
          level:'Beginner',
          years:'Less than 1',
          certified:false
        }
      }))
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Update skill level
  // ────────────────────────────────────────────────────────────────────────────
  const updateSkillLevel = (
    service:string,
    value:string
  ) => {
    setSelected(prev => ({
      ...prev,

      [service]:{
        ...prev[service],
        level:value
      }
    }))

    setSaveError('')
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Update years of experience
  // ────────────────────────────────────────────────────────────────────────────
  const updateSkillYears = (
    service:string,
    value:string
  ) => {
    setSelected(prev => ({
      ...prev,

      [service]:{
        ...prev[service],
        years:value
      }
    }))

    setSaveError('')
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Toggle certification
  // ────────────────────────────────────────────────────────────────────────────
  const toggleCertification = (
    service:string
  ) => {
    setSelected(prev => ({
      ...prev,

      [service]:{
        ...prev[service],
        certified:
          !prev[service].certified
      }
    }))

    setSaveError('')
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Load previously saved Step 3 data
  // ────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const loadSkills = async () => {
      try {
        setLoadingSkills(true)

        const skills =
          await getMyAgentSkills()

        if (
          !skills ||
          skills.length === 0
        ) {
          setHasSavedData(false)

          setInitialData(
            JSON.stringify([])
          )

          return
        }

        const loadedSkills:Record<
          string,
          SkillData
        > = {}

        skills.forEach(skill => {
          loadedSkills[
            skill.service_name
          ] = {
            level:
              skill.skill_level ||
              'Beginner',

            years:
              skill.experience_years ||
              'Less than 1',

            certified:
              skill.certified ?? false
          }
        })

        setSelected(loadedSkills)
        setHasSavedData(true)

        setInitialData(
          JSON.stringify(
            normalizeSelected(
              loadedSkills
            )
          )
        )

      } catch (error) {
        console.error(
          'Failed to load skills and services:',
          error
        )

        setSaveError(
          'Failed to load saved skills and services'
        )

      } finally {
        setLoadingSkills(false)
      }
    }

    loadSkills()
  }, [])

  // ────────────────────────────────────────────────────────────────────────────
  // Save Step 3
  // ────────────────────────────────────────────────────────────────────────────
  const handleSaveAndContinue = async () => {
    try {
      if (!canSave || saving) {
        return
      }

      setSaveError('')
      setSaving(true)

      const selectedEntries =
        Object.entries(selected)

      if (
        selectedEntries.length === 0
      ) {
        throw new Error(
          'Please select at least one service'
        )
      }

      const skills =
        selectedEntries.map(
          ([serviceName, data]) => ({
            service_name:serviceName,
            skill_level:data.level,
            experience_years:data.years,
            certified:data.certified
          })
        )

      await saveMyAgentSkills(
        skills
      )

      // Reset dirty state after successful save
      setHasSavedData(true)

      setInitialData(
        JSON.stringify(
          normalizeSelected(
            selected
          )
        )
      )

      // Parent decides destination:
      // normal flow → Step 4
      // review edit mode → Step 11
      onNext()

    } catch (error) {
      console.error(
        'Failed to save skills and services:',
        error
      )

      if (
        error instanceof Error
      ) {
        setSaveError(
          error.message
        )
      } else {
        setSaveError(
          'Failed to save skills and services'
        )
      }

    } finally {
      setSaving(false)
    }
  }

  return (
    <StepWrap
      step={3}
      total={11}
      title="Skills & Services"
      desc="Select the services you offer and rate your proficiency."
      onBack={onBack}
      onNext={handleSaveAndContinue}
      nextLabel={
        saving
          ? 'Saving...'
          : 'Save & Continue'
      }
      nextDisabled={
        !canSave ||
        saving
      }
    >

      <p
        style={{
          fontSize:13,
          color:C.muted,
          marginBottom:20
        }}
      >
        Click a service to add it, then set your experience level
        and certification status.
      </p>

      {/* Service selector */}
      <div
        style={{
          display:'flex',
          gap:8,
          flexWrap:'wrap' as const,
          marginBottom:24
        }}
      >
        {services.map(service => (
          <button
            type="button"
            key={service}
            onClick={() =>
              toggle(service)
            }
            style={{
              padding:'8px 16px',
              borderRadius:99,

              border:`1.5px solid ${
                selected[service]
                  ? C.primary
                  : C.border
              }`,

              background:
                selected[service]
                  ? `${C.primary}08`
                  : 'transparent',

              cursor:'pointer',

              fontFamily:
                'Manrope,sans-serif',

              fontSize:12,

              fontWeight:
                selected[service]
                  ? 700
                  : 500,

              color:
                selected[service]
                  ? C.primary
                  : C.sub,

              transition:
                'all 0.12s'
            }}
          >
            {selected[service] && (
              <span
                style={{
                  marginRight:4
                }}
              >
                ✓
              </span>
            )}

            {service}
          </button>
        ))}
      </div>

      {/* Selected skill cards */}
      {Object.keys(selected).length > 0 && (
        <div
          style={{
            display:'flex',
            flexDirection:'column',
            gap:12
          }}
        >
          {Object.entries(selected).map(
            ([service, data]) => (
              <Card
                key={service}
                style={{
                  padding:20
                }}
              >

                {/* Card header */}
                <div
                  style={{
                    display:'flex',
                    justifyContent:
                      'space-between',
                    alignItems:
                      'flex-start',
                    marginBottom:14
                  }}
                >
                  <p
                    style={{
                      fontSize:14,
                      fontWeight:800,
                      color:C.type,
                      fontFamily:
                        'Manrope,sans-serif'
                    }}
                  >
                    {service}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      toggle(service)
                    }
                    style={{
                      width:26,
                      height:26,
                      borderRadius:'50%',

                      border:
                        `1px solid ${C.border}`,

                      background:
                        'transparent',

                      cursor:'pointer',
                      color:C.muted,

                      display:'flex',
                      alignItems:'center',
                      justifyContent:
                        'center'
                    }}
                  >
                    <span
                      style={{
                        display:'flex',
                        transform:
                          'scale(0.8)'
                      }}
                    >
                      {I.close}
                    </span>
                  </button>
                </div>

                {/* Skill settings */}
                <div
                  style={{
                    display:'grid',

                    gridTemplateColumns:
                      '1fr 1fr',

                    gap:12
                  }}
                  className="cao-2col"
                >

                  <Select
                    label="Skill Level"
                    options={[
                      'Beginner',
                      'Intermediate',
                      'Advanced',
                      'Expert'
                    ]}
                    value={data.level}
                    onChange={value =>
                      updateSkillLevel(
                        service,
                        value
                      )
                    }
                  />

                  <Select
                    label="Years of Experience"
                    options={[
                      'Less than 1',
                      '1–2 years',
                      '3–5 years',
                      '5–8 years',
                      '8+ years'
                    ]}
                    value={data.years}
                    onChange={value =>
                      updateSkillYears(
                        service,
                        value
                      )
                    }
                  />

                  {/* Certification */}
                  <div
                    style={{
                      display:'flex',
                      alignItems:'center',
                      gap:10
                    }}
                  >
                    <Toggle
                      on={
                        data.certified
                      }
                      onToggle={() =>
                        toggleCertification(
                          service
                        )
                      }
                    />

                    <div>
                      <p
                        style={{
                          fontSize:12,
                          fontWeight:700,
                          color:C.type
                        }}
                      >
                        Certification Available
                      </p>

                      <p
                        style={{
                          fontSize:11,
                          color:C.muted
                        }}
                      >
                        I have a document to prove this
                      </p>
                    </div>
                  </div>

                </div>
              </Card>
            )
          )}
        </div>
      )}

      {/* Empty state */}
      {Object.keys(selected).length === 0 && (
        <Card
          style={{
            padding:'40px 20px',
            textAlign:
              'center' as const
          }}
        >
          <p
            style={{
              fontSize:32,
              marginBottom:10
            }}
          >
            🩺
          </p>

          <p
            style={{
              fontSize:14,
              fontWeight:700,
              color:C.type
            }}
          >
            No services selected yet
          </p>

          <p
            style={{
              fontSize:12,
              color:C.muted
            }}
          >
            Select at least one service above to continue.
          </p>
        </Card>
      )}

      {/* Error */}
      {saveError && (
        <div
          style={{
            padding:'12px 14px',
            marginTop:16,
            borderRadius:10,

            background:
              `${C.error}08`,

            border:
              `1px solid ${C.error}30`,

            color:C.error,
            fontSize:12,
            fontWeight:600
          }}
        >
          {saveError}
        </div>
      )}

    </StepWrap>
  )
}



// ─── Step 4: Certifications ───────────────────────────────────────────────────
function Step4({
  onBack,
  onNext
}:{
  onBack:()=>void
  onNext:()=>void
}) {

  type CertData = {
    file: File | null
    fileName: string

    // Original filename saved in Supabase.
    // Useful when cancelling a newly selected replacement file.
    savedFileName: string

    existing: boolean
    removed: boolean
    issued: string
    expiry: string
  }

  const certificateNames = [
    'Caregiving Certificate',
    'First Aid Certificate',
    'CPR Certificate',
    'Nursing Qualification',
    'Medical Training Certificate',
    'Other Certification'
  ]

  const createEmptyDocs = () => {
    const initial: Record<string, CertData> = {}

    certificateNames.forEach(name => {
      initial[name] = {
        file:null,
        fileName:'',
        savedFileName:'',
        existing:false,
        removed:false,
        issued:'',
        expiry:''
      }
    })

    return initial
  }

  const [docs, setDocs] = useState<
    Record<string, CertData>
  >(() => createEmptyDocs())

  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [loadingCertifications, setLoadingCertifications] =
    useState(true)

  // Dirty-state tracking
  const [initialData, setInitialData] = useState('')
  const [hasSavedData, setHasSavedData] = useState(false)

  const slugToName:Record<string,string> = {
    'caregiving-certificate':
      'Caregiving Certificate',

    'first-aid-certificate':
      'First Aid Certificate',

    'cpr-certificate':
      'CPR Certificate',

    'nursing-qualification':
      'Nursing Qualification',

    'medical-training-certificate':
      'Medical Training Certificate',

    'other-certification':
      'Other Certification'
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Convert certificate name to database doc_type
  // ────────────────────────────────────────────────────────────────────────────
  const certificateToSlug = (
    certificateName:string
  ) => {
    return certificateName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Normalize docs for dirty-state comparison
  //
  // We don't JSON stringify the File object itself.
  // Instead we compare useful file metadata.
  // ────────────────────────────────────────────────────────────────────────────
  const normalizeDocs = (
    source:Record<string, CertData>
  ) => {
    return certificateNames.map(name => {
      const data = source[name]

      return {
        certificate:name,

        file:data.file
          ? {
              name:data.file.name,
              size:data.file.size,
              type:data.file.type,
              lastModified:data.file.lastModified
            }
          : null,

        fileName:data.fileName,
        savedFileName:data.savedFileName,
        existing:data.existing,
        removed:data.removed,
        issued:data.issued,
        expiry:data.expiry
      }
    })
  }

  const currentData = JSON.stringify(
    normalizeDocs(docs)
  )

  const hasChanges =
    initialData !== '' &&
    currentData !== initialData

  // First-time Step 4:
  // Save is enabled so validation can tell user to add a certificate.
  //
  // Previously saved Step 4:
  // Save only enables after something changes.
  const canSave =
    !loadingCertifications &&
    (!hasSavedData || hasChanges)

  // ────────────────────────────────────────────────────────────────────────────
  // Load certificates already saved in Supabase
  // ────────────────────────────────────────────────────────────────────────────
  useEffect(() => {

    const loadCertifications = async () => {
      try {
        setLoadingCertifications(true)

        const savedDocs =
          await getMyCertifications()

        const loadedDocs =
          createEmptyDocs()

        if (
          savedDocs &&
          savedDocs.length > 0
        ) {

          savedDocs.forEach(doc => {

            const name =
              slugToName[doc.doc_type]

            if (!name) return

            const storedFileName =
              doc.file_url
                ? doc.file_url
                    .split('/')
                    .pop() || name
                : name

            loadedDocs[name] = {
              ...loadedDocs[name],

              file:null,

              fileName:
                storedFileName,

              savedFileName:
                storedFileName,

              existing:true,
              removed:false,

              issued:
                doc.issue_date || '',

              expiry:
                doc.expiry_date || ''
            }
          })

          setHasSavedData(true)

        } else {
          setHasSavedData(false)
        }

        setDocs(loadedDocs)

        setInitialData(
          JSON.stringify(
            normalizeDocs(
              loadedDocs
            )
          )
        )

      } catch (error) {

        console.error(
          'Failed to load certifications:',
          error
        )

        setSaveError(
          'Failed to load saved certifications'
        )

      } finally {
        setLoadingCertifications(false)
      }
    }

    loadCertifications()

  }, [])

  // ────────────────────────────────────────────────────────────────────────────
  // Select / Change certificate file
  // ────────────────────────────────────────────────────────────────────────────
  const handleFileSelect = (
    certificateName:string,
    event:React.ChangeEvent<HTMLInputElement>
  ) => {

    const file =
      event.target.files?.[0]

    if (!file) return

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png'
    ]

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setSaveError(
        'Only PDF, JPG and PNG files are allowed'
      )

      event.target.value = ''
      return
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      setSaveError(
        'File must be smaller than 10MB'
      )

      event.target.value = ''
      return
    }

    setSaveError('')

    setDocs(prev => ({
      ...prev,

      [certificateName]:{
        ...prev[certificateName],

        file,
        fileName:file.name,

        // If user had marked existing document for removal
        // and then selected another file, cancel removal.
        removed:false
      }
    }))

    // Allows selecting the same file again later
    event.target.value = ''
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Remove / Cancel certificate
  // ────────────────────────────────────────────────────────────────────────────
  const handleRemove = (
    certificateName:string
  ) => {

    setSaveError('')

    setDocs(prev => {

      const current =
        prev[certificateName]

      // -------------------------------------------------
      // CASE 1
      // Existing Supabase certificate + new replacement
      // selected but not saved yet.
      //
      // Remove button should cancel the new replacement,
      // NOT delete the old saved certificate.
      // -------------------------------------------------
      if (
        current.file &&
        current.existing
      ) {
        return {
          ...prev,

          [certificateName]:{
            ...current,

            file:null,

            fileName:
              current.savedFileName,

            removed:false
          }
        }
      }

      // -------------------------------------------------
      // CASE 2
      // Completely new unsaved certificate.
      //
      // Clear it locally only.
      // -------------------------------------------------
      if (
        current.file &&
        !current.existing
      ) {
        return {
          ...prev,

          [certificateName]:{
            ...current,

            file:null,
            fileName:'',
            savedFileName:'',
            removed:false,
            issued:'',
            expiry:''
          }
        }
      }

      // -------------------------------------------------
      // CASE 3
      // Certificate already saved in Supabase.
      //
      // Mark it for deletion.
      // Actual Storage + DB delete happens on Save.
      // -------------------------------------------------
      if (current.existing) {
        return {
          ...prev,

          [certificateName]:{
            ...current,

            file:null,
            fileName:'',

            existing:false,
            removed:true,

            issued:'',
            expiry:''
          }
        }
      }

      return prev
    })
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Update issue date
  // ────────────────────────────────────────────────────────────────────────────
  const updateIssueDate = (
    certificateName:string,
    value:string
  ) => {

    setDocs(prev => ({
      ...prev,

      [certificateName]:{
        ...prev[certificateName],
        issued:value
      }
    }))

    setSaveError('')
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Update expiry date
  // ────────────────────────────────────────────────────────────────────────────
  const updateExpiryDate = (
    certificateName:string,
    value:string
  ) => {

    setDocs(prev => ({
      ...prev,

      [certificateName]:{
        ...prev[certificateName],
        expiry:value
      }
    }))

    setSaveError('')
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Save Step 4
  // ────────────────────────────────────────────────────────────────────────────
  const handleSaveAndContinue = async () => {

    try {

      if (
        !canSave ||
        saving
      ) {
        return
      }

      setSaveError('')
      setSaving(true)

      // -------------------------------------------------
      // 1. First validate final certificate state
      // -------------------------------------------------
      const selectedCertificates =
        Object.entries(docs)
          .filter(([, data]) =>
            !data.removed &&
            (
              data.file ||
              data.existing
            )
          )

      if (
        selectedCertificates.length === 0
      ) {
        throw new Error(
          'Please upload at least one certification'
        )
      }

      // -------------------------------------------------
      // 2. Delete saved certificates marked for removal
      // -------------------------------------------------
      for (
        const [
          certificateName,
          data
        ] of Object.entries(docs)
      ) {

        if (data.removed) {

          const docType =
            certificateToSlug(
              certificateName
            )

          await deleteMyCertification(
            docType
          )
        }
      }

      // -------------------------------------------------
      // 3. Upload new/replacement files OR
      // update dates on existing certificates
      // -------------------------------------------------
      for (
        const [
          certificateName,
          data
        ] of selectedCertificates
      ) {

        await saveMyCertification(
          certificateName,
          data.file,
          data.issued,
          data.expiry
        )
      }

      // Mark this step as saved
      setHasSavedData(true)

      // Parent handles destination:
      //
      // Normal onboarding:
      // Step 4 → Step 5
      //
      // Step 11 Review Edit:
      // Step 4 → Step 11
      onNext()

    } catch (error) {

      console.error(
        'Failed to save certifications:',
        error
      )

      if (
        error instanceof Error
      ) {
        setSaveError(
          error.message
        )
      } else {
        setSaveError(
          'Failed to save certifications'
        )
      }

    } finally {
      setSaving(false)
    }
  }

  return (
    <StepWrap
      step={4}
      total={11}
      title="Certifications"
      desc="Upload your professional certifications. Supported: PDF, JPG, PNG up to 10MB."
      onBack={onBack}
      onNext={handleSaveAndContinue}
      nextLabel={
        saving
          ? 'Saving...'
          : 'Save & Continue'
      }
      nextDisabled={
        !canSave ||
        saving
      }
    >

      <div
        style={{
          display:'flex',
          flexDirection:'column',
          gap:16
        }}
      >

        {certificateNames.map(cert => {

          const data =
            docs[cert]

          return (
            <Card
              key={cert}
              style={{
                padding:22
              }}
            >

              {/* Certificate header */}
              <div
                style={{
                  display:'flex',
                  justifyContent:'space-between',
                  alignItems:'center',
                  marginBottom:14
                }}
              >
                <div
                  style={{
                    display:'flex',
                    gap:8,
                    alignItems:'center'
                  }}
                >
                  <p
                    style={{
                      fontSize:13,
                      fontWeight:700,
                      color:C.type
                    }}
                  >
                    {cert}
                  </p>

                  {data.removed && (
                    <Bdg
                      label="Will be removed"
                      color={C.error}
                    />
                  )}

                  {!data.removed &&
                    (
                      data.file ||
                      data.existing
                    ) && (
                    <Bdg
                      label={
                        data.file
                          ? data.existing
                            ? 'Replacement Selected'
                            : 'Ready to Save'
                          : 'Saved'
                      }
                      color={
                        data.file
                          ? C.info
                          : C.success
                      }
                    />
                  )}

                </div>
              </div>

              {/* Upload area */}
              {!data.removed && (
                <label
                  style={{
                    display:'block',
                    padding:'20px',
                    borderRadius:14,

                    border:`2px dashed ${
                      data.file ||
                      data.existing
                        ? C.success
                        : C.border
                    }`,

                    background:
                      data.file ||
                      data.existing
                        ? `${C.success}06`
                        : C.bg,

                    cursor:'pointer',

                    textAlign:
                      'center' as const
                  }}
                >

                  <div
                    style={{
                      width:40,
                      height:40,
                      borderRadius:13,

                      background:
                        `${C.primary}10`,

                      display:'flex',
                      alignItems:'center',
                      justifyContent:'center',

                      color:C.primary,

                      margin:
                        '0 auto 10px'
                    }}
                  >
                    {I.upload}
                  </div>

                  <p
                    style={{
                      fontSize:13,
                      fontWeight:700,
                      color:C.type
                    }}
                  >
                    {data.file
                      ? data.fileName

                      : data.existing
                        ? 'Change Certificate'

                        : `Upload ${cert}`}
                  </p>

                  <p
                    style={{
                      fontSize:11,
                      color:C.muted,
                      marginTop:4
                    }}
                  >
                    PDF, JPG or PNG · Max 10MB
                  </p>

                  <input
                    type="file"
                    accept=".pdf,image/jpeg,image/png"
                    onChange={event =>
                      handleFileSelect(
                        cert,
                        event
                      )
                    }
                    style={{
                      display:'none'
                    }}
                  />
                </label>
              )}

              {/* Removed state */}
              {data.removed && (
                <div
                  style={{
                    padding:16,
                    borderRadius:12,
                    border:
                      `1px solid ${C.error}25`,
                    background:
                      `${C.error}05`
                  }}
                >
                  <p
                    style={{
                      fontSize:12,
                      color:C.error,
                      fontWeight:700
                    }}
                  >
                    This certificate will be deleted when you save changes.
                  </p>

                  <button
                    type="button"
                    onClick={() => {

                      setDocs(prev => ({
                        ...prev,

                        [cert]:{
                          ...prev[cert],

                          file:null,

                          fileName:
                            prev[cert]
                              .savedFileName,

                          existing:true,
                          removed:false
                        }
                      }))

                      setSaveError('')
                    }}
                    style={{
                      marginTop:8,
                      background:'none',
                      border:'none',
                      padding:0,
                      color:C.primary,
                      fontSize:12,
                      fontWeight:700,
                      cursor:'pointer'
                    }}
                  >
                    Undo Remove
                  </button>
                </div>
              )}

              {/* Remove / cancel button */}
              {!data.removed &&
                (
                  data.file ||
                  data.existing
                ) && (
                <button
                  type="button"
                  onClick={() =>
                    handleRemove(cert)
                  }
                  style={{
                    marginTop:10,
                    background:'none',
                    border:'none',
                    color:C.error,
                    fontSize:12,
                    fontWeight:700,
                    cursor:'pointer'
                  }}
                >
                  {data.file && data.existing
                    ? 'Cancel New File'
                    : 'Remove file'}
                </button>
              )}

              {/* Dates */}
              {!data.removed &&
                (
                  data.file ||
                  data.existing
                ) && (
                <div
                  style={{
                    display:'grid',
                    gridTemplateColumns:
                      '1fr 1fr',
                    gap:12,
                    marginTop:14
                  }}
                  className="cao-2col"
                >

                  <Input
                    label="Issue Date"
                    type="date"
                    value={data.issued}
                    onChange={value =>
                      updateIssueDate(
                        cert,
                        value
                      )
                    }
                  />

                  <Input
                    label="Expiry Date"
                    type="date"
                    value={data.expiry}
                    onChange={value =>
                      updateExpiryDate(
                        cert,
                        value
                      )
                    }
                  />

                </div>
              )}

            </Card>
          )
        })}
      </div>

      {/* Save error */}
      {saveError && (
        <div
          style={{
            padding:'12px 14px',
            marginTop:16,
            borderRadius:10,

            background:
              `${C.error}08`,

            border:
              `1px solid ${C.error}30`,

            color:C.error,
            fontSize:12,
            fontWeight:600
          }}
        >
          {saveError}
        </div>
      )}

    </StepWrap>
  )
}



// ─── Step 5: Identity Verification ───────────────────────────────────────────
function Step5({
  onBack,
  onNext
}:{
  onBack:()=>void
  onNext:()=>void
}) {

  type IdentityDocData = {
    file: File | null
    fileName: string

    // Previously saved filename.
    // Used when cancelling a replacement.
    savedFileName: string

    existing: boolean
    removed: boolean
  }

  const documentNames = [
    'NIC Front',
    'NIC Back',
    'Police Clearance Certificate',
    'Medical Fitness Certificate',
    'Passport (Optional)',
    'Driving Licence (Optional)'
  ]

  const requiredDocuments = [
    'NIC Front',
    'NIC Back',
    'Police Clearance Certificate',
    'Medical Fitness Certificate'
  ]

  const createEmptyDocs = () => {
    const initial:Record<
      string,
      IdentityDocData
    > = {}

    documentNames.forEach(name => {
      initial[name] = {
        file:null,
        fileName:'',
        savedFileName:'',
        existing:false,
        removed:false
      }
    })

    return initial
  }

  const [docs, setDocs] = useState<
    Record<string, IdentityDocData>
  >(() => createEmptyDocs())

  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const [
    loadingDocuments,
    setLoadingDocuments
  ] = useState(true)

  // Dirty-state tracking
  const [initialData, setInitialData] =
    useState('')

  const [
    hasSavedData,
    setHasSavedData
  ] = useState(false)

  const slugToName:Record<string,string> = {
    'nic-front':
      'NIC Front',

    'nic-back':
      'NIC Back',

    'police-clearance-certificate':
      'Police Clearance Certificate',

    'medical-fitness-certificate':
      'Medical Fitness Certificate',

    'passport':
      'Passport (Optional)',

    'driving-licence':
      'Driving Licence (Optional)'
  }

  // ─────────────────────────────────────────────
  // Document name → doc_type
  // ─────────────────────────────────────────────
  const documentToSlug = (
    documentName:string
  ) => {
    return documentName
      .replace(' (Optional)', '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  // ─────────────────────────────────────────────
  // Normalize state for change detection
  // ─────────────────────────────────────────────
  const normalizeDocs = (
    source:Record<
      string,
      IdentityDocData
    >
  ) => {

    return documentNames.map(name => {
      const data = source[name]

      return {
        document:name,

        file:data.file
          ? {
              name:data.file.name,
              size:data.file.size,
              type:data.file.type,
              lastModified:
                data.file.lastModified
            }
          : null,

        fileName:
          data.fileName,

        savedFileName:
          data.savedFileName,

        existing:
          data.existing,

        removed:
          data.removed
      }
    })
  }

  const currentData =
    JSON.stringify(
      normalizeDocs(docs)
    )

  const hasChanges =
    initialData !== '' &&
    currentData !== initialData

  const canSave =
    !loadingDocuments &&
    (
      !hasSavedData ||
      hasChanges
    )

  // ─────────────────────────────────────────────
  // Load saved identity documents
  // ─────────────────────────────────────────────
  useEffect(() => {

    const loadIdentityDocuments =
      async () => {

        try {
          setLoadingDocuments(true)

          const savedDocs =
            await getMyIdentityDocuments()

          const loadedDocs =
            createEmptyDocs()

          if (
            savedDocs &&
            savedDocs.length > 0
          ) {

            savedDocs.forEach(doc => {

              const name =
                slugToName[
                  doc.doc_type
                ]

              if (!name) return

              const storedFileName =
                doc.file_url
                  ? doc.file_url
                      .split('/')
                      .pop() || name
                  : name

              loadedDocs[name] = {
                ...loadedDocs[name],

                file:null,

                fileName:
                  storedFileName,

                savedFileName:
                  storedFileName,

                existing:true,
                removed:false
              }
            })

            setHasSavedData(true)

          } else {
            setHasSavedData(false)
          }

          setDocs(
            loadedDocs
          )

          setInitialData(
            JSON.stringify(
              normalizeDocs(
                loadedDocs
              )
            )
          )

        } catch (error) {

          console.error(
            'Failed to load identity documents:',
            error
          )

          setSaveError(
            'Failed to load saved identity documents'
          )

        } finally {
          setLoadingDocuments(false)
        }
      }

    loadIdentityDocuments()

  }, [])

  // ─────────────────────────────────────────────
  // Select / replace file
  // ─────────────────────────────────────────────
  const handleFileSelect = (
    documentName:string,
    event:
      React.ChangeEvent<HTMLInputElement>
  ) => {

    const file =
      event.target.files?.[0]

    if (!file) return

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png'
    ]

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {

      setSaveError(
        'Only PDF, JPG and PNG files are allowed'
      )

      event.target.value = ''
      return
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {

      setSaveError(
        'File must be smaller than 10MB'
      )

      event.target.value = ''
      return
    }

    setSaveError('')

    setDocs(prev => ({
      ...prev,

      [documentName]:{
        ...prev[documentName],

        file,
        fileName:file.name,

        // If document was marked for removal,
        // selecting a file cancels the removal.
        removed:false
      }
    }))

    // Allows same file to be selected later
    event.target.value = ''
  }

  // ─────────────────────────────────────────────
  // Remove / cancel selected file
  // ─────────────────────────────────────────────
  const handleRemove = (
    documentName:string
  ) => {

    setSaveError('')

    setDocs(prev => {

      const current =
        prev[documentName]

      // ─────────────────────────────
      // Existing saved document +
      // new replacement selected.
      //
      // Cancel replacement only.
      // Keep original saved file.
      // ─────────────────────────────
      if (
        current.file &&
        current.existing
      ) {

        return {
          ...prev,

          [documentName]:{
            ...current,

            file:null,

            fileName:
              current.savedFileName,

            removed:false
          }
        }
      }

      // ─────────────────────────────
      // Completely new unsaved file.
      // Clear local selection only.
      // ─────────────────────────────
      if (
        current.file &&
        !current.existing
      ) {

        return {
          ...prev,

          [documentName]:{
            ...current,

            file:null,
            fileName:'',
            savedFileName:'',
            removed:false
          }
        }
      }

      // ─────────────────────────────
      // Existing Supabase document.
      // Mark for deletion on Save.
      // ─────────────────────────────
      if (current.existing) {

        return {
          ...prev,

          [documentName]:{
            ...current,

            file:null,
            fileName:'',

            existing:false,
            removed:true
          }
        }
      }

      return prev
    })
  }

  // ─────────────────────────────────────────────
  // Undo removal
  // ─────────────────────────────────────────────
  const handleUndoRemove = (
    documentName:string
  ) => {

    setSaveError('')

    setDocs(prev => ({
      ...prev,

      [documentName]:{
        ...prev[documentName],

        file:null,

        fileName:
          prev[documentName]
            .savedFileName,

        existing:true,
        removed:false
      }
    }))
  }

  // ─────────────────────────────────────────────
  // Save Step 5
  // ─────────────────────────────────────────────
  const handleSaveAndContinue =
    async () => {

      try {

        if (
          !canSave ||
          saving
        ) {
          return
        }

        setSaveError('')

        // IMPORTANT:
        // Validate BEFORE deleting anything.
        for (
          const requiredDoc
          of requiredDocuments
        ) {

          const data =
            docs[requiredDoc]

          if (
            data.removed ||
            (
              !data.file &&
              !data.existing
            )
          ) {

            throw new Error(
              `${requiredDoc} is required`
            )
          }
        }

        setSaving(true)

        // 1. Delete documents marked for removal
        for (
          const [
            documentName,
            data
          ] of Object.entries(docs)
        ) {

          if (data.removed) {

            const docType =
              documentToSlug(
                documentName
              )

            await deleteMyCertification(
              docType
            )
          }
        }

        // 2. Upload new / replacement files
        for (
          const [
            documentName,
            data
          ] of Object.entries(docs)
        ) {

          if (
            !data.removed &&
            data.file
          ) {

            await saveMyIdentityDocument(
              documentName,
              data.file
            )
          }
        }

        setHasSavedData(true)

        // Parent decides navigation:
        //
        // Normal onboarding:
        // Step 5 → Step 6
        //
        // Review Edit mode:
        // Step 5 → Step 11
        onNext()

      } catch (error) {

        console.error(
          'Failed to save identity documents:',
          error
        )

        if (
          error instanceof Error
        ) {
          setSaveError(
            error.message
          )
        } else {
          setSaveError(
            'Failed to save identity documents'
          )
        }

      } finally {
        setSaving(false)
      }
    }

  // ─────────────────────────────────────────────
  // Progress
  // ─────────────────────────────────────────────
  const done =
    Object.values(docs).filter(
      data =>
        !data.removed &&
        (
          data.file ||
          data.existing
        )
    ).length

  const total =
    documentNames.length

  const tips = [
    'Ensure all text is clearly legible',
    'Use good lighting — avoid shadows and glare',
    'Photograph the full document with all four corners visible',
    'Avoid blurry images — hold the camera steady'
  ]

  return (
    <StepWrap
      step={5}
      total={11}
      title="Identity Verification"
      desc="KYC verification protects clients and ensures platform integrity."
      onBack={onBack}
      onNext={
        handleSaveAndContinue
      }
      nextLabel={
        saving
          ? 'Saving...'
          : 'Save & Continue'
      }
      nextDisabled={
        !canSave ||
        saving
      }
    >

      {/* Document progress */}
      <Card
        style={{
          padding:20,
          marginBottom:20,

          background:
            `linear-gradient(
              135deg,
              ${C.primary}06,
              ${C.primary}02
            )`,

          border:
            `1px solid ${C.primary}20`
        }}
      >

        <div
          style={{
            display:'flex',
            alignItems:'center',
            justifyContent:
              'space-between',
            marginBottom:10
          }}
        >

          <p
            style={{
              fontSize:13,
              fontWeight:800,
              color:C.type,

              fontFamily:
                'Manrope,sans-serif'
            }}
          >
            Document Upload Progress
          </p>

          <span
            style={{
              fontSize:18,
              fontWeight:900,
              color:C.success,

              fontFamily:
                'Manrope,sans-serif'
            }}
          >
            {Math.round(
              (done / total) *
              100
            )}%
          </span>

        </div>

        <div
          style={{
            height:8,
            borderRadius:99,

            background:
              'rgba(0,115,122,0.1)',

            overflow:'hidden'
          }}
        >
          <div
            style={{
              width:
                `${(done / total) * 100}%`,

              height:'100%',

              background:
                `linear-gradient(
                  90deg,
                  ${C.primary},
                  ${C.success}
                )`,

              borderRadius:99,

              transition:
                'width 0.5s'
            }}
          />
        </div>

        <p
          style={{
            fontSize:11,
            color:C.muted,
            marginTop:8
          }}
        >
          {done} of {total} documents uploaded
        </p>

      </Card>

      {/* Documents */}
      <div
        style={{
          display:'grid',
          gridTemplateColumns:
            '1fr 1fr',
          gap:14,
          marginBottom:20
        }}
        className="cao-2col"
      >

        {documentNames.map(
          documentName => {

            const data =
              docs[documentName]

            const required =
              requiredDocuments.includes(
                documentName
              )

            return (
              <Card
                key={documentName}
                style={{
                  padding:18
                }}
              >

                {/* Document title */}
                <div
                  style={{
                    display:'flex',
                    gap:7,
                    alignItems:'center',
                    marginBottom:10,
                    flexWrap:'wrap'
                  }}
                >
                  <p
                    style={{
                      fontSize:12,
                      fontWeight:800,
                      color:C.type
                    }}
                  >
                    {documentName}
                  </p>

                  {required && (
                    <span
                      style={{
                        color:C.error,
                        fontWeight:800
                      }}
                    >
                      *
                    </span>
                  )}

                  {data.removed && (
                    <Bdg
                      label="Will be removed"
                      color={C.error}
                    />
                  )}

                  {!data.removed &&
                    (
                      data.file ||
                      data.existing
                    ) && (
                    <Bdg
                      label={
                        data.file
                          ? data.existing
                            ? 'Replacement Selected'
                            : 'Ready to Save'
                          : 'Saved'
                      }
                      color={
                        data.file
                          ? C.info
                          : C.success
                      }
                    />
                  )}
                </div>

                {/* Upload area */}
                {!data.removed && (
                  <label
                    style={{
                      display:'block',
                      padding:'18px',
                      borderRadius:14,

                      border:
                        `2px dashed ${
                          data.file ||
                          data.existing
                            ? C.success
                            : C.border
                        }`,

                      background:
                        data.file ||
                        data.existing
                          ? `${C.success}06`
                          : C.bg,

                      cursor:'pointer',

                      textAlign:
                        'center' as const
                    }}
                  >

                    <div
                      style={{
                        width:40,
                        height:40,
                        borderRadius:13,

                        background:
                          `${C.primary}10`,

                        display:'flex',
                        alignItems:'center',
                        justifyContent:
                          'center',

                        color:C.primary,

                        margin:
                          '0 auto 10px'
                      }}
                    >
                      {I.upload}
                    </div>

                    <p
                      style={{
                        fontSize:13,
                        fontWeight:700,
                        color:C.type
                      }}
                    >
                      {data.file
                        ? data.fileName

                        : data.existing
                          ? `Change ${documentName}`

                          : documentName}
                    </p>

                    <p
                      style={{
                        fontSize:11,
                        color:C.muted,
                        marginTop:4
                      }}
                    >
                      JPG, PNG or PDF · Max 10MB
                    </p>

                    <input
                      type="file"

                      accept=
                        ".pdf,image/jpeg,image/png"

                      onChange={event =>
                        handleFileSelect(
                          documentName,
                          event
                        )
                      }

                      style={{
                        display:'none'
                      }}
                    />

                  </label>
                )}

                {/* Pending removal */}
                {data.removed && (
                  <div
                    style={{
                      padding:14,
                      borderRadius:12,

                      background:
                        `${C.error}05`,

                      border:
                        `1px solid ${C.error}25`
                    }}
                  >

                    <p
                      style={{
                        fontSize:11,
                        color:C.error,
                        fontWeight:700,
                        lineHeight:1.5
                      }}
                    >
                      This document will be deleted when you save changes.
                    </p>

                    <button
                      type="button"

                      onClick={() =>
                        handleUndoRemove(
                          documentName
                        )
                      }

                      style={{
                        marginTop:8,
                        padding:0,
                        background:'none',
                        border:'none',

                        color:C.primary,

                        fontSize:12,
                        fontWeight:700,
                        cursor:'pointer'
                      }}
                    >
                      Undo Remove
                    </button>

                  </div>
                )}

                {/* Remove / cancel replacement */}
                {!data.removed &&
                  (
                    data.file ||
                    data.existing
                  ) && (
                  <button
                    type="button"

                    onClick={() =>
                      handleRemove(
                        documentName
                      )
                    }

                    style={{
                      marginTop:10,

                      background:'none',
                      border:'none',

                      color:C.error,

                      fontSize:12,
                      fontWeight:700,
                      cursor:'pointer'
                    }}
                  >
                    {data.file &&
                    data.existing
                      ? 'Cancel New File'
                      : 'Remove file'}
                  </button>
                )}

              </Card>
            )
          }
        )}

      </div>

      {/* Error */}
      {saveError && (
        <div
          style={{
            padding:'12px 14px',
            marginBottom:16,
            borderRadius:10,

            background:
              `${C.error}08`,

            border:
              `1px solid ${C.error}30`,

            color:C.error,
            fontSize:12,
            fontWeight:600
          }}
        >
          {saveError}
        </div>
      )}

      {/* Verification tips */}
      <Card
        style={{
          padding:20
        }}
      >

        <p
          style={{
            fontSize:12,
            fontWeight:800,
            color:C.muted,

            textTransform:
              'uppercase',

            letterSpacing:
              '0.08em',

            marginBottom:12
          }}
        >
          Verification Tips
        </p>

        {tips.map((tip, index) => (
          <div
            key={index}

            style={{
              display:'flex',
              gap:8,
              alignItems:
                'flex-start',

              marginBottom:8
            }}
          >

            <div
              style={{
                width:20,
                height:20,
                borderRadius:'50%',

                background:
                  `${C.info}10`,

                display:'flex',
                alignItems:'center',
                justifyContent:
                  'center',

                color:C.info,
                flexShrink:0,

                fontSize:11,
                fontWeight:800,

                fontFamily:
                  'Manrope,sans-serif'
              }}
            >
              {index + 1}
            </div>

            <p
              style={{
                fontSize:12,
                color:C.sub,
                lineHeight:1.6
              }}
            >
              {tip}
            </p>

          </div>
        ))}

      </Card>

    </StepWrap>
  )
}


// ─── Step 6: Banking & Payouts ────────────────────────────────────────────────
function Step6({
  onBack,
  onNext
}:{
  onBack:()=>void
  onNext:()=>void
}) {

  const [form, setForm] = useState({
    bankName: '',
    branch: '',
    accountName: '',
    accountNumber: '',
    swiftCode: '',
    payoutPreference: 'Bank Transfer'
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  // Dirty-state tracking
  const [initialData, setInitialData] = useState('')
  const [hasSavedData, setHasSavedData] = useState(false)

  // ─────────────────────────────────────────────
  // Update form field
  // ─────────────────────────────────────────────
  const f =
    (key:keyof typeof form) =>
    (value:string) => {

      setForm(prev => ({
        ...prev,
        [key]:value
      }))

      setSaveError('')
    }

  // ─────────────────────────────────────────────
  // Dirty-state comparison
  // ─────────────────────────────────────────────
  const currentData =
    JSON.stringify(form)

  const hasChanges =
    initialData !== '' &&
    currentData !== initialData

  // First-time Step 6:
  // Save is available.
  //
  // Existing saved bank details:
  // Save is available only after a change.
  const canSave =
    !loading &&
    (
      !hasSavedData ||
      hasChanges
    )

  // ─────────────────────────────────────────────
  // Load previously saved bank account
  // ─────────────────────────────────────────────
  useEffect(() => {

    const loadBankAccount = async () => {

      try {
        setLoading(true)

        const account =
          await getMyBankAccount()

        if (!account) {

          setHasSavedData(false)

          const emptyForm = {
            bankName:'',
            branch:'',
            accountName:'',
            accountNumber:'',
            swiftCode:'',
            payoutPreference:
              'Bank Transfer'
          }

          setForm(emptyForm)

          setInitialData(
            JSON.stringify(
              emptyForm
            )
          )

          return
        }

        const loadedForm = {
          bankName:
            account.bank_name || '',

          branch:
            account.branch || '',

          accountName:
            account.account_name || '',

          accountNumber:
            account.account_number || '',

          swiftCode:
            account.swift_code || '',

          payoutPreference:
            account.payout_preference ||
            'Bank Transfer'
        }

        setForm(
          loadedForm
        )

        // Treat it as previously saved
        // only when meaningful bank details exist.
        const accountHasData =
          Boolean(account.bank_name) ||
          Boolean(account.branch) ||
          Boolean(account.account_name) ||
          Boolean(account.account_number)

        setHasSavedData(
          accountHasData
        )

        // Store original state for comparison
        setInitialData(
          JSON.stringify(
            loadedForm
          )
        )

      } catch (error) {

        console.error(
          'Failed to load bank account:',
          error
        )

        setSaveError(
          'Failed to load saved bank details'
        )

      } finally {
        setLoading(false)
      }
    }

    loadBankAccount()

  }, [])

  // ─────────────────────────────────────────────
  // Save Step 6
  // ─────────────────────────────────────────────
  const handleSaveAndContinue =
    async () => {

      try {

        if (
          !canSave ||
          saving
        ) {
          return
        }

        setSaveError('')

        // Required validation
        if (
          !form.bankName.trim()
        ) {
          throw new Error(
            'Bank name is required'
          )
        }

        if (
          !form.branch.trim()
        ) {
          throw new Error(
            'Branch is required'
          )
        }

        if (
          !form.accountName.trim()
        ) {
          throw new Error(
            'Account holder name is required'
          )
        }

        if (
          !form.accountNumber.trim()
        ) {
          throw new Error(
            'Account number is required'
          )
        }

        setSaving(true)

        // Normalize final saved values
        const savedForm = {
          bankName:
            form.bankName.trim(),

          branch:
            form.branch.trim(),

          accountName:
            form.accountName.trim(),

          accountNumber:
            form.accountNumber.trim(),

          swiftCode:
            form.swiftCode.trim(),

          payoutPreference:
            form.payoutPreference
        }

        await saveMyBankAccount({
          bank_name:
            savedForm.bankName,

          branch:
            savedForm.branch,

          account_name:
            savedForm.accountName,

          account_number:
            savedForm.accountNumber,

          swift_code:
            savedForm.swiftCode,

          payout_preference:
            savedForm.payoutPreference
        })

        // Keep local state exactly the same
        // as the normalized values saved to Supabase.
        setForm(
          savedForm
        )

        setHasSavedData(true)

        setInitialData(
          JSON.stringify(
            savedForm
          )
        )

        // Parent navigation decides:
        //
        // Normal onboarding:
        // Step 6 → Step 7
        //
        // Step 11 Review Edit:
        // Step 6 → Step 11
        onNext()

      } catch (error) {

        console.error(
          'Failed to save bank account:',
          error
        )

        if (
          error instanceof Error
        ) {
          setSaveError(
            error.message
          )
        } else {
          setSaveError(
            'Failed to save bank details'
          )
        }

      } finally {
        setSaving(false)
      }
    }

  // ─────────────────────────────────────────────
  // Loading UI
  // ─────────────────────────────────────────────
  if (loading) {

    return (
      <StepWrap
        step={6}
        total={11}
        title="Banking & Payouts"
        desc="Add your bank account details for future payouts."
        onBack={onBack}
        onNext={() => {}}
        nextDisabled={true}
      >

        <Card
          style={{
            padding:30,
            textAlign:
              'center' as const
          }}
        >

          <p
            style={{
              fontSize:13,
              color:C.muted
            }}
          >
            Loading bank details...
          </p>

        </Card>

      </StepWrap>
    )
  }

  return (
    <StepWrap
      step={6}
      total={11}
      title="Banking & Payouts"
      desc="Add your bank account details for future payouts."
      onBack={onBack}
      onNext={
        handleSaveAndContinue
      }
      nextLabel={
        saving
          ? 'Saving...'
          : 'Save & Continue'
      }
      nextDisabled={
        !canSave ||
        saving
      }
    >

      {/* Bank Account Details */}
      <Card
        style={{
          padding:22,
          marginBottom:18
        }}
      >

        <FormSection title="Bank Account Details">

          <FormFull>
            <Input
              label="Bank Name"
              value={form.bankName}
              onChange={f('bankName')}
              hint="Enter the name of your bank"
              required
            />
          </FormFull>

          <FormFull>
            <Input
              label="Branch"
              value={form.branch}
              onChange={f('branch')}
              hint="Enter your bank branch"
              required
            />
          </FormFull>

          <FormFull>
            <Input
              label="Account Holder Name"
              value={form.accountName}
              onChange={f('accountName')}
              hint="Name exactly as shown on the bank account"
              required
            />
          </FormFull>

          <FormFull>
            <Input
              label="Account Number"
              value={form.accountNumber}
              onChange={f('accountNumber')}
              hint="Enter your bank account number"
              required
            />
          </FormFull>

          <FormFull>
            <Input
              label="SWIFT / BIC Code"
              value={form.swiftCode}
              onChange={f('swiftCode')}
              hint="Optional for local transfers"
            />
          </FormFull>

        </FormSection>

      </Card>

      {/* Payout Preference */}
      <Card
        style={{
          padding:22,
          marginBottom:18
        }}
      >

        <FormSection title="Payout Preference">

          <FormFull>
            <Select
              label="Preferred Payout Method"
              options={[
                'Bank Transfer'
              ]}
              value={
                form.payoutPreference
              }
              onChange={
                f('payoutPreference')
              }
            />
          </FormFull>

        </FormSection>

      </Card>

      {/* Security notice */}
      <Card
        style={{
          padding:'14px 16px',
          marginBottom:18,
          background:`${C.info}05`,
          border:`1px solid ${C.info}20`
        }}
      >

        <div
          style={{
            display:'flex',
            gap:10,
            alignItems:'flex-start'
          }}
        >

          <span
            style={{
              color:C.info,
              display:'flex'
            }}
          >
            {I.shield}
          </span>

          <div>

            <p
              style={{
                fontSize:12,
                fontWeight:700,
                color:C.info,
                marginBottom:3
              }}
            >
              Your banking information is protected
            </p>

            <p
              style={{
                fontSize:11,
                color:C.muted,
                lineHeight:1.6
              }}
            >
              Bank account details are used for ReadyPal payouts
              and will be reviewed securely after your application
              is submitted.
            </p>

          </div>

        </div>

      </Card>

      {/* Save error */}
      {saveError && (
        <div
          style={{
            padding:'12px 14px',
            marginBottom:16,
            borderRadius:10,

            background:
              `${C.error}08`,

            border:
              `1px solid ${C.error}30`,

            color:C.error,
            fontSize:12,
            fontWeight:600
          }}
        >
          {saveError}
        </div>
      )}

    </StepWrap>
  )
}



// ─── Step 7: Availability ─────────────────────────────────────────────────────
function Step7({
  onBack,
  onNext
}:{
  onBack:()=>void
  onNext:()=>void
}) {

  type ShiftType =
    | 'morning'
    | 'afternoon'
    | 'evening'
    | 'night'

  const days = [
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun'
  ]

  const shifts = [
    {
      k:'morning' as const,
      l:'Morning',
      t:'6 AM – 12 PM'
    },
    {
      k:'afternoon' as const,
      l:'Afternoon',
      t:'12 PM – 6 PM'
    },
    {
      k:'evening' as const,
      l:'Evening',
      t:'6 PM – 10 PM'
    },
    {
      k:'night' as const,
      l:'Night',
      t:'10 PM – 6 AM'
    }
  ]

  const [activeDays, setActiveDays] =
    useState<Set<string>>(
      new Set()
    )

  const [shift, setShift] =
    useState<ShiftType>(
      'morning'
    )

  const [emergency, setEmergency] =
    useState(false)

  const [holiday, setHoliday] =
    useState(false)

  const [maxHours, setMaxHours] =
    useState(40)

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [saveError, setSaveError] =
    useState('')

  // Dirty-state tracking
  const [initialData, setInitialData] =
    useState('')

  const [hasSavedData, setHasSavedData] =
    useState(false)

  // ─────────────────────────────────────────────
  // Normalize Availability data
  // ─────────────────────────────────────────────
  const createSnapshot = (
    workingDays:Set<string>,
    selectedShift:ShiftType,
    emergencyAvailable:boolean,
    holidayAvailable:boolean,
    weeklyHours:number
  ) => {

    return JSON.stringify({
      workingDays:
        Array.from(workingDays)
          .sort(),

      shift:
        selectedShift,

      emergency:
        emergencyAvailable,

      holiday:
        holidayAvailable,

      maxHours:
        weeklyHours
    })
  }

  const currentData =
    createSnapshot(
      activeDays,
      shift,
      emergency,
      holiday,
      maxHours
    )

  const hasChanges =
    initialData !== '' &&
    currentData !== initialData

  // First time user → can save
  // Existing saved data → must change first
  const canSave =
    !loading &&
    (
      !hasSavedData ||
      hasChanges
    )

  // ─────────────────────────────────────────────
  // Load saved Availability
  // ─────────────────────────────────────────────
  useEffect(() => {

    const loadAvailability =
      async () => {

        try {
          setLoading(true)

          const data =
            await getMyAvailability()

          if (!data) {

            setHasSavedData(false)

            const emptyDays =
              new Set<string>()

            setActiveDays(
              emptyDays
            )

            setShift(
              'morning'
            )

            setEmergency(
              false
            )

            setHoliday(
              false
            )

            setMaxHours(
              40
            )

            setInitialData(
              createSnapshot(
                emptyDays,
                'morning',
                false,
                false,
                40
              )
            )

            return
          }

          const loadedDays =
            new Set<string>(
              Array.isArray(
                data.working_days
              )
                ? data.working_days
                : []
            )

          const loadedShift =
            (
              data.preferred_shift ||
              'morning'
            ) as ShiftType

          const loadedEmergency =
            data.emergency_available ??
            false

          const loadedHoliday =
            data.holiday_available ??
            false

          const loadedMaxHours =
            data.max_weekly_hours ??
            40

          setActiveDays(
            loadedDays
          )

          setShift(
            loadedShift
          )

          setEmergency(
            loadedEmergency
          )

          setHoliday(
            loadedHoliday
          )

          setMaxHours(
            loadedMaxHours
          )

          // Determine whether Step 7
          // has meaningful saved data
          const availabilityHasData =
            loadedDays.size > 0 ||
            Boolean(
              data.preferred_shift
            ) ||
            data.max_weekly_hours != null

          setHasSavedData(
            availabilityHasData
          )

          setInitialData(
            createSnapshot(
              loadedDays,
              loadedShift,
              loadedEmergency,
              loadedHoliday,
              loadedMaxHours
            )
          )

        } catch (error) {

          console.error(
            'Failed to load availability:',
            error
          )

          setSaveError(
            'Failed to load saved availability'
          )

        } finally {
          setLoading(false)
        }
      }

    loadAvailability()

  }, [])

  // ─────────────────────────────────────────────
  // Toggle working day
  // ─────────────────────────────────────────────
  const toggleDay = (
    day:string
  ) => {

    setActiveDays(prev => {

      const updated =
        new Set(prev)

      if (
        updated.has(day)
      ) {
        updated.delete(day)
      } else {
        updated.add(day)
      }

      return updated
    })

    setSaveError('')
  }

  // ─────────────────────────────────────────────
  // Change preferred shift
  // ─────────────────────────────────────────────
  const handleShiftChange = (
    newShift:ShiftType
  ) => {

    setShift(
      newShift
    )

    setSaveError('')
  }

  // ─────────────────────────────────────────────
  // Emergency toggle
  // ─────────────────────────────────────────────
  const toggleEmergency = () => {

    setEmergency(prev =>
      !prev
    )

    setSaveError('')
  }

  // ─────────────────────────────────────────────
  // Holiday toggle
  // ─────────────────────────────────────────────
  const toggleHoliday = () => {

    setHoliday(prev =>
      !prev
    )

    setSaveError('')
  }

  // ─────────────────────────────────────────────
  // Save Step 7
  // ─────────────────────────────────────────────
  const handleSaveAndContinue =
    async () => {

      try {

        if (
          !canSave ||
          saving
        ) {
          return
        }

        setSaveError('')

        // Required validation
        if (
          activeDays.size === 0
        ) {
          throw new Error(
            'Please select at least one working day'
          )
        }

        if (!shift) {
          throw new Error(
            'Please select a preferred shift'
          )
        }

        if (
          !maxHours ||
          maxHours < 10
        ) {
          throw new Error(
            'Please select maximum weekly hours'
          )
        }

        setSaving(true)

        const savedDays =
          Array.from(
            activeDays
          )

        await saveMyAvailability({
          working_days:
            savedDays,

          preferred_shift:
            shift,

          emergency_available:
            emergency,

          holiday_available:
            holiday,

          max_weekly_hours:
            maxHours
        })

        setHasSavedData(
          true
        )

        // Reset dirty state
        setInitialData(
          createSnapshot(
            activeDays,
            shift,
            emergency,
            holiday,
            maxHours
          )
        )

        // Parent handles navigation:
        //
        // Normal:
        // Step 7 → Step 8
        //
        // Review Edit:
        // Step 7 → Step 11
        onNext()

      } catch (error) {

        console.error(
          'Failed to save availability:',
          error
        )

        if (
          error instanceof Error
        ) {
          setSaveError(
            error.message
          )
        } else {
          setSaveError(
            'Failed to save availability'
          )
        }

      } finally {
        setSaving(false)
      }
    }

  // ─────────────────────────────────────────────
  // Loading UI
  // ─────────────────────────────────────────────
  if (loading) {

    return (
      <StepWrap
        step={7}
        total={11}
        title="Availability"
        desc="Tell us when you're available so we can match you with the right clients."
        onBack={onBack}
        onNext={() => {}}
        nextDisabled={true}
      >

        <Card
          style={{
            padding:30,
            textAlign:
              'center' as const
          }}
        >
          <p
            style={{
              fontSize:13,
              color:C.muted
            }}
          >
            Loading availability...
          </p>
        </Card>

      </StepWrap>
    )
  }

  return (
    <StepWrap
      step={7}
      total={11}
      title="Availability"
      desc="Tell us when you're available so we can match you with the right clients."
      onBack={onBack}
      onNext={
        handleSaveAndContinue
      }
      nextLabel={
        saving
          ? 'Saving...'
          : 'Save & Continue'
      }
      nextDisabled={
        !canSave ||
        saving
      }
    >

      {/* Working Days */}
      <Card
        style={{
          padding:22,
          marginBottom:14
        }}
      >
        <p
          style={{
            fontSize:12,
            fontWeight:800,
            color:C.muted,
            textTransform:'uppercase',
            letterSpacing:'0.08em',
            marginBottom:14
          }}
        >
          Working Days{' '}
          <span
            style={{
              color:C.error
            }}
          >
            *
          </span>
        </p>

        <div
          style={{
            display:'flex',
            gap:8
          }}
        >
          {days.map(day => (

            <button
              type="button"
              key={day}
              onClick={() =>
                toggleDay(day)
              }
              style={{
                flex:1,

                paddingTop:10,
                paddingBottom:10,

                borderRadius:12,

                border:`2px solid ${
                  activeDays.has(day)
                    ? C.primary
                    : C.border
                }`,

                background:
                  activeDays.has(day)
                    ? `${C.primary}08`
                    : 'transparent',

                cursor:'pointer',

                fontFamily:
                  'Manrope,sans-serif',

                fontSize:12,

                fontWeight:
                  activeDays.has(day)
                    ? 800
                    : 500,

                color:
                  activeDays.has(day)
                    ? C.primary
                    : C.sub
              }}
            >
              {day}
            </button>

          ))}
        </div>
      </Card>

      {/* Preferred Shift */}
      <Card
        style={{
          padding:22,
          marginBottom:14
        }}
      >
        <p
          style={{
            fontSize:12,
            fontWeight:800,
            color:C.muted,
            textTransform:'uppercase',
            letterSpacing:'0.08em',
            marginBottom:14
          }}
        >
          Preferred Shift{' '}
          <span
            style={{
              color:C.error
            }}
          >
            *
          </span>
        </p>

        <div
          style={{
            display:'grid',
            gridTemplateColumns:
              'repeat(2,1fr)',
            gap:10
          }}
          className="cao-2col"
        >
          {shifts.map(item => (

            <button
              type="button"
              key={item.k}

              onClick={() =>
                handleShiftChange(
                  item.k
                )
              }

              style={{
                padding:'14px 16px',
                borderRadius:13,

                border:`2px solid ${
                  shift === item.k
                    ? C.primary
                    : C.border
                }`,

                background:
                  shift === item.k
                    ? `${C.primary}06`
                    : 'transparent',

                cursor:'pointer',

                textAlign:
                  'left' as const
              }}
            >

              <p
                style={{
                  fontSize:13,
                  fontWeight:800,

                  color:
                    shift === item.k
                      ? C.primary
                      : C.type,

                  marginBottom:2,

                  fontFamily:
                    'Manrope,sans-serif'
                }}
              >
                {item.l}
              </p>

              <p
                style={{
                  fontSize:11,
                  color:C.muted
                }}
              >
                {item.t}
              </p>

              {shift === item.k && (
                <span
                  style={{
                    marginTop:8,
                    display:'inline-flex',

                    background:
                      `${C.primary}15`,

                    color:C.primary,

                    padding:'2px 8px',
                    borderRadius:99,

                    fontSize:10,
                    fontWeight:700
                  }}
                >
                  Selected
                </span>
              )}

            </button>

          ))}
        </div>
      </Card>

      {/* Availability Settings */}
      <Card
        style={{
          padding:22
        }}
      >

        {/* Emergency Availability */}
        <div
          style={{
            display:'flex',
            justifyContent:
              'space-between',
            alignItems:'center',

            padding:'12px 0',

            borderBottom:
              `1px solid ${C.border}`
          }}
        >
          <div>

            <p
              style={{
                fontSize:13,
                fontWeight:700,
                color:C.type
              }}
            >
              Emergency Availability
            </p>

            <p
              style={{
                fontSize:11,
                color:C.muted
              }}
            >
              Available for urgent same-day requests
            </p>

          </div>

          <Toggle
            on={emergency}
            onToggle={
              toggleEmergency
            }
          />

        </div>

        {/* Holiday Availability */}
        <div
          style={{
            display:'flex',
            justifyContent:
              'space-between',
            alignItems:'center',

            padding:'12px 0',

            borderBottom:
              `1px solid ${C.border}`
          }}
        >
          <div>

            <p
              style={{
                fontSize:13,
                fontWeight:700,
                color:C.type
              }}
            >
              Holiday Availability
            </p>

            <p
              style={{
                fontSize:11,
                color:C.muted
              }}
            >
              Available on Poya days and public holidays
            </p>

          </div>

          <Toggle
            on={holiday}
            onToggle={
              toggleHoliday
            }
          />

        </div>

        {/* Maximum Weekly Hours */}
        <div
          style={{
            padding:'16px 0 8px'
          }}
        >
          <div
            style={{
              display:'flex',
              justifyContent:
                'space-between',
              marginBottom:8
            }}
          >

            <p
              style={{
                fontSize:12,
                fontWeight:700,
                color:C.muted
              }}
            >
              Maximum Weekly Hours{' '}
              <span
                style={{
                  color:C.error
                }}
              >
                *
              </span>
            </p>

            <span
              style={{
                fontSize:13,
                fontWeight:800,
                color:C.primary,

                fontFamily:
                  'Manrope,sans-serif'
              }}
            >
              {maxHours} hrs
            </span>

          </div>

          <input
            type="range"
            min={10}
            max={80}
            step={5}

            value={maxHours}

            onChange={event => {
              setMaxHours(
                +event.target.value
              )

              setSaveError('')
            }}

            style={{
              width:'100%',
              accentColor:C.primary,
              cursor:'pointer'
            }}
          />
        </div>

      </Card>

      {/* Error */}
      {saveError && (
        <div
          style={{
            padding:'12px 14px',
            marginTop:16,
            borderRadius:10,

            background:
              `${C.error}08`,

            border:
              `1px solid ${C.error}30`,

            color:C.error,
            fontSize:12,
            fontWeight:600
          }}
        >
          {saveError}
        </div>
      )}

    </StepWrap>
  )
}



// ─── Step 8: Equipment & Transport ────────────────────────────────────────────
function Step8({
  onBack,
  onNext
}:{
  onBack:()=>void
  onNext:()=>void
}) {

  const [toggles, setToggles] = useState({
    car:false,
    motorbike:false,
    threeWheeler:false,
    publicTransport:false,
    wheelchair:false,
    medEquipment:false,
    smartphone:false,
    internet:false
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  // Dirty-state tracking
  const [initialData, setInitialData] = useState('')
  const [hasSavedData, setHasSavedData] = useState(false)

  const items = [
    {
      k:'car' as const,
      icon:'🚗',
      l:'Car',
      d:'Own vehicle for transporting clients'
    },
    {
      k:'motorbike' as const,
      icon:'🏍️',
      l:'Motorbike',
      d:'For quick local trips'
    },
    {
      k:'threeWheeler' as const,
      icon:'🛺',
      l:'Three-Wheeler',
      d:'Tuk-tuk for short distances'
    },
    {
      k:'publicTransport' as const,
      icon:'🚌',
      l:'Public Transport',
      d:'Bus, train, or other public transport'
    },
    {
      k:'wheelchair' as const,
      icon:'♿',
      l:'Wheelchair Equipment',
      d:'Manual or electric wheelchair equipment'
    },
    {
      k:'medEquipment' as const,
      icon:'🩺',
      l:'Medical Equipment',
      d:'Blood pressure monitor, glucose monitor, etc.'
    },
    {
      k:'smartphone' as const,
      icon:'📱',
      l:'Smartphone',
      d:'Required for the ReadyPal app',
      required:true
    },
    {
      k:'internet' as const,
      icon:'📶',
      l:'Internet Access',
      d:'Mobile data or home broadband',
      required:true
    }
  ]

  // ─────────────────────────────────────────────
  // Dirty-state comparison
  // ─────────────────────────────────────────────
  const currentData = JSON.stringify(toggles)

  const hasChanges =
    initialData !== '' &&
    currentData !== initialData

  const canSave =
    !loading &&
    (
      !hasSavedData ||
      hasChanges
    )

  // ─────────────────────────────────────────────
  // Toggle item
  // ─────────────────────────────────────────────
  const tog = (
    key:keyof typeof toggles
  ) => {

    setToggles(prev => ({
      ...prev,
      [key]:!prev[key]
    }))

    setSaveError('')
  }

  // ─────────────────────────────────────────────
  // Load saved Step 8 data
  // ─────────────────────────────────────────────
  useEffect(() => {

    const loadEquipmentTransport =
      async () => {

        try {
          setLoading(true)

          const data =
            await getMyEquipmentTransport()

          if (!data) {

            const emptyState = {
              car:false,
              motorbike:false,
              threeWheeler:false,
              publicTransport:false,
              wheelchair:false,
              medEquipment:false,
              smartphone:false,
              internet:false
            }

            setToggles(emptyState)
            setHasSavedData(false)

            setInitialData(
              JSON.stringify(
                emptyState
              )
            )

            return
          }

          const loadedState = {
            car:
              data.has_car ?? false,

            motorbike:
              data.has_motorbike ?? false,

            threeWheeler:
              data.has_three_wheeler ?? false,

            publicTransport:
              data.uses_public_transport ?? false,

            wheelchair:
              data.has_wheelchair_equipment ?? false,

            medEquipment:
              data.has_medical_equipment ?? false,

            smartphone:
              data.has_smartphone ?? false,

            internet:
              data.has_internet_access ?? false
          }

          setToggles(
            loadedState
          )

          setHasSavedData(true)

          setInitialData(
            JSON.stringify(
              loadedState
            )
          )

        } catch (error) {

          console.error(
            'Failed to load equipment and transport:',
            error
          )

          setSaveError(
            'Failed to load saved equipment and transport details'
          )

        } finally {
          setLoading(false)
        }
      }

    loadEquipmentTransport()

  }, [])

  // ─────────────────────────────────────────────
  // Save Step 8
  // ─────────────────────────────────────────────
  const handleSaveAndContinue =
    async () => {

      try {

        if (
          !canSave ||
          saving
        ) {
          return
        }

        setSaveError('')

        // Required validation
        if (!toggles.smartphone) {
          throw new Error(
            'Smartphone is required'
          )
        }

        if (!toggles.internet) {
          throw new Error(
            'Internet Access is required'
          )
        }

        setSaving(true)

        await saveMyEquipmentTransport({
          has_car:
            toggles.car,

          has_motorbike:
            toggles.motorbike,

          has_three_wheeler:
            toggles.threeWheeler,

          uses_public_transport:
            toggles.publicTransport,

          has_wheelchair_equipment:
            toggles.wheelchair,

          has_medical_equipment:
            toggles.medEquipment,

          has_smartphone:
            toggles.smartphone,

          has_internet_access:
            toggles.internet
        })

        setHasSavedData(true)

        // Reset dirty state
        setInitialData(
          JSON.stringify(
            toggles
          )
        )

        // Parent handles navigation:
        //
        // Normal onboarding:
        // Step 8 → Step 9
        //
        // Review Edit:
        // Step 8 → Step 11
        onNext()

      } catch (error) {

        console.error(
          'Failed to save equipment and transport:',
          error
        )

        if (
          error instanceof Error
        ) {
          setSaveError(
            error.message
          )
        } else {
          setSaveError(
            'Failed to save equipment and transport'
          )
        }

      } finally {
        setSaving(false)
      }
    }

  // ─────────────────────────────────────────────
  // Loading
  // ─────────────────────────────────────────────
  if (loading) {

    return (
      <StepWrap
        step={8}
        total={11}
        title="Equipment & Transport"
        desc="Let clients know how you can travel and what equipment you have available."
        onBack={onBack}
        onNext={() => {}}
        nextDisabled={true}
      >

        <Card
          style={{
            padding:30,
            textAlign:'center' as const
          }}
        >
          <p
            style={{
              fontSize:13,
              color:C.muted
            }}
          >
            Loading equipment and transport...
          </p>
        </Card>

      </StepWrap>
    )
  }

  return (
    <StepWrap
      step={8}
      total={11}
      title="Equipment & Transport"
      desc="Let clients know how you can travel and what equipment you have available."
      onBack={onBack}
      onNext={handleSaveAndContinue}
      nextLabel={
        saving
          ? 'Saving...'
          : 'Save & Continue'
      }
      nextDisabled={
        !canSave ||
        saving
      }
    >

      {/* Required notice */}
      <Card
        style={{
          padding:'14px 16px',
          marginBottom:16,
          background:`${C.info}05`,
          border:`1px solid ${C.info}20`
        }}
      >
        <p
          style={{
            fontSize:12,
            fontWeight:700,
            color:C.info,
            marginBottom:3
          }}
        >
          Smartphone and Internet Access are required
        </p>

        <p
          style={{
            fontSize:11,
            color:C.muted,
            lineHeight:1.6
          }}
        >
          Care Agents need a smartphone and internet connection
          to use ReadyPal and receive service updates.
        </p>
      </Card>

      {/* Equipment / Transport cards */}
      <div
        style={{
          display:'grid',
          gridTemplateColumns:'1fr 1fr',
          gap:12
        }}
        className="cao-2col"
      >

        {items.map(item => (

          <Card
            key={item.k}
            style={{
              padding:18,

              border:`1.5px solid ${
                toggles[item.k]
                  ? C.primary + '30'
                  : C.border
              }`,

              background:
                toggles[item.k]
                  ? `${C.primary}04`
                  : C.surface
            }}
          >

            <div
              style={{
                display:'flex',
                gap:12,
                alignItems:'center'
              }}
            >

              <div
                style={{
                  width:38,
                  height:38,
                  borderRadius:12,

                  background:
                    `${C.primary}08`,

                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',

                  fontSize:20,
                  flexShrink:0
                }}
              >
                {item.icon}
              </div>

              <div
                style={{
                  flex:1
                }}
              >

                <p
                  style={{
                    fontSize:13,
                    fontWeight:700,
                    color:C.type
                  }}
                >
                  {item.l}

                  {'required' in item &&
                    item.required && (
                    <span
                      style={{
                        color:C.error,
                        marginLeft:4
                      }}
                    >
                      *
                    </span>
                  )}
                </p>

                <p
                  style={{
                    fontSize:11,
                    color:C.muted,
                    lineHeight:1.4
                  }}
                >
                  {item.d}
                </p>

              </div>

              <Toggle
                on={
                  toggles[item.k]
                }
                onToggle={() =>
                  tog(item.k)
                }
              />

            </div>

          </Card>

        ))}

      </div>

      {/* Validation status */}
      {(
        !toggles.smartphone ||
        !toggles.internet
      ) && (
        <div
          style={{
            padding:'12px 14px',
            marginTop:16,
            borderRadius:10,

            background:
              `${C.warning}08`,

            border:
              `1px solid ${C.warning}30`,

            color:C.warning,
            fontSize:12,
            fontWeight:600
          }}
        >
          Please enable Smartphone and Internet Access before saving.
        </div>
      )}

      {/* Save error */}
      {saveError && (
        <div
          style={{
            padding:'12px 14px',
            marginTop:16,
            borderRadius:10,

            background:
              `${C.error}08`,

            border:
              `1px solid ${C.error}30`,

            color:C.error,
            fontSize:12,
            fontWeight:600
          }}
        >
          {saveError}
        </div>
      )}

    </StepWrap>
  )
}



// ─── Step 9: References ───────────────────────────────────────────────────────
function Step9({
  onBack,
  onNext
}:{
  onBack:()=>void
  onNext:()=>void
}) {

  type Ref = {
    name:string
    org:string
    type:string
    phone:string
    email:string
  }

  const emptyReference = ():Ref => ({
    name:'',
    org:'',
    type:'',
    phone:'',
    email:''
  })

  const [refs, setRefs] = useState<Ref[]>([
    emptyReference(),
    emptyReference()
  ])

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [saveError, setSaveError] =
    useState('')

  // Dirty state
  const [initialData, setInitialData] =
    useState('')

  const [hasSavedData, setHasSavedData] =
    useState(false)

  // ─────────────────────────────────────────────
  // Recommendation Letter
  // ─────────────────────────────────────────────

  const [letterFile, setLetterFile] =
    useState<File | null>(null)

  const [letterFileName, setLetterFileName] =
    useState('')

  const [savedLetterFileName, setSavedLetterFileName] =
    useState('')

  const [letterExisting, setLetterExisting] =
    useState(false)

  const [letterRemoved, setLetterRemoved] =
    useState(false)

  const [letterUploading, setLetterUploading] =
    useState(false)

  const letterInputRef =
    useRef<HTMLInputElement | null>(null)

  // ─────────────────────────────────────────────
  // Normalize
  // ─────────────────────────────────────────────

  const normalizeRefs = (
    source:Ref[]
  ) => {
    return source.map(ref => ({
      name:ref.name,
      org:ref.org,
      type:ref.type,
      phone:ref.phone,
      email:ref.email
    }))
  }

  const createSnapshot = (
    references:Ref[],
    letter:{
      existing:boolean
      removed:boolean
      fileName:string
      file:File | null
    }
  ) => {
    return JSON.stringify({
      refs:normalizeRefs(
        references
      ),

      letter:{
        existing:
          letter.existing,

        removed:
          letter.removed,

        fileName:
          letter.fileName,

        file:
          letter.file
            ? {
                name:letter.file.name,
                size:letter.file.size,
                type:letter.file.type,
                lastModified:
                  letter.file.lastModified
              }
            : null
      }
    })
  }

  const currentData =
    createSnapshot(
      refs,
      {
        existing:
          letterExisting,

        removed:
          letterRemoved,

        fileName:
          letterFileName,

        file:
          letterFile
      }
    )

  const hasChanges =
    initialData !== '' &&
    currentData !== initialData

  const canSave =
    !loading &&
    (
      !hasSavedData ||
      hasChanges
    )

  // ─────────────────────────────────────────────
  // Load saved references + recommendation letter
  // ─────────────────────────────────────────────

  useEffect(() => {

    let cancelled = false

    const loadStep9 = async () => {

      try {

        setLoading(true)
        setSaveError('')

        const [
          savedRefs,
          savedLetter
        ] = await Promise.all([
          getMyReferences(),
          getMyRecommendationLetter()
        ])

        if (cancelled) return

        let loadedRefs:Ref[] = []

        if (
          savedRefs &&
          savedRefs.length > 0
        ) {
          loadedRefs =
            savedRefs.map(ref => ({
              name:
                ref.full_name || '',

              org:
                ref.organisation || '',

              type:
                ref.relationship || '',

              phone:
                ref.phone || '',

              email:
                ref.email || ''
            }))
        }

        while (
          loadedRefs.length < 2
        ) {
          loadedRefs.push(
            emptyReference()
          )
        }

        setRefs(
          loadedRefs
        )

        let loadedLetterName = ''

        if (savedLetter) {

          loadedLetterName =
            savedLetter.file_url
              ?.split('/')
              .pop() ||
            'Recommendation Letter'

          setLetterExisting(true)
          setLetterRemoved(false)
          setLetterFile(null)

          setLetterFileName(
            loadedLetterName
          )

          setSavedLetterFileName(
            loadedLetterName
          )

        } else {

          setLetterExisting(false)
          setLetterRemoved(false)
          setLetterFile(null)

          setLetterFileName('')
          setSavedLetterFileName('')
        }

        const savedDataExists =
          (
            savedRefs &&
            savedRefs.length > 0
          ) ||
          Boolean(savedLetter)

        setHasSavedData(
          savedDataExists
        )

        setInitialData(
          createSnapshot(
            loadedRefs,
            {
              existing:
                Boolean(savedLetter),

              removed:false,

              fileName:
                loadedLetterName,

              file:null
            }
          )
        )

      } catch (error) {

        console.error(
          'Failed to load references:',
          error
        )

        setSaveError(
          'Failed to load saved references'
        )

      } finally {

        if (!cancelled) {
          setLoading(false)
        }

      }
    }

    loadStep9()

    return () => {
      cancelled = true
    }

  }, [])

  // ─────────────────────────────────────────────
  // References
  // ─────────────────────────────────────────────

  const updateRef = (
    index:number,
    key:keyof Ref,
    value:string
  ) => {

    setRefs(prev =>
      prev.map(
        (ref, i) =>
          i === index
            ? {
                ...ref,
                [key]:value
              }
            : ref
      )
    )

    setSaveError('')
  }

  const addRef = () => {

    setRefs(prev => [
      ...prev,
      emptyReference()
    ])

    setSaveError('')
  }

  const removeRef = (
    index:number
  ) => {

    if (
      refs.length <= 2
    ) {
      setSaveError(
        'At least two professional references are required'
      )

      return
    }

    setRefs(prev =>
      prev.filter(
        (_, i) =>
          i !== index
      )
    )

    setSaveError('')
  }

  const isValidEmail = (
    email:string
  ) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email
    )
  }

  // ─────────────────────────────────────────────
  // Recommendation Letter file picker
  // ─────────────────────────────────────────────

  const handleLetterClick = () => {
    letterInputRef.current?.click()
  }

  const handleLetterSelect = (
    event:
      React.ChangeEvent<HTMLInputElement>
  ) => {

    const file =
      event.target.files?.[0]

    if (!file) return

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setSaveError(
        'Recommendation Letter must be PDF, DOC or DOCX'
      )

      event.target.value = ''
      return
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      setSaveError(
        'Recommendation Letter must be smaller than 10MB'
      )

      event.target.value = ''
      return
    }

    setLetterFile(
      file
    )

    setLetterFileName(
      file.name
    )

    setLetterRemoved(
      false
    )

    setSaveError('')

    // Let user select same file later
    event.target.value = ''
  }

  const handleRemoveLetter = () => {

    setSaveError('')

    // Existing saved letter + new replacement selected:
    // cancel replacement only.
    if (
      letterFile &&
      letterExisting
    ) {

      setLetterFile(
        null
      )

      setLetterFileName(
        savedLetterFileName
      )

      setLetterRemoved(
        false
      )

      return
    }

    // New unsaved letter only
    if (
      letterFile &&
      !letterExisting
    ) {

      setLetterFile(
        null
      )

      setLetterFileName('')
      setLetterRemoved(false)

      return
    }

    // Existing Supabase letter
    if (letterExisting) {

      setLetterFile(
        null
      )

      setLetterFileName('')

      setLetterExisting(
        false
      )

      setLetterRemoved(
        true
      )
    }
  }

  const handleUndoLetterRemove = () => {

    setLetterFile(
      null
    )

    setLetterFileName(
      savedLetterFileName
    )

    setLetterExisting(
      true
    )

    setLetterRemoved(
      false
    )

    setSaveError('')
  }

  // ─────────────────────────────────────────────
  // Save Step 9
  // ─────────────────────────────────────────────

  const handleSaveAndContinue =
    async () => {

      try {

        if (
          !canSave ||
          saving
        ) {
          return
        }

        setSaveError('')

        const referencesToSave =
          refs.filter(ref =>
            ref.name.trim() ||
            ref.org.trim() ||
            ref.type.trim() ||
            ref.phone.trim() ||
            ref.email.trim()
          )

        if (
          referencesToSave.length < 2
        ) {
          throw new Error(
            'Please provide at least two professional references'
          )
        }

        for (
          let i = 0;
          i < referencesToSave.length;
          i++
        ) {

          const ref =
            referencesToSave[i]

          if (
            !ref.name.trim()
          ) {
            throw new Error(
              `Reference ${i + 1}: Full Name is required`
            )
          }

          if (
            !ref.org.trim()
          ) {
            throw new Error(
              `Reference ${i + 1}: Organisation / Hospital is required`
            )
          }

          if (
            !ref.type.trim()
          ) {
            throw new Error(
              `Reference ${i + 1}: Relationship is required`
            )
          }

          if (
            !ref.phone.trim() &&
            !ref.email.trim()
          ) {
            throw new Error(
              `Reference ${i + 1}: Phone Number or Email Address is required`
            )
          }

          if (
            ref.email.trim() &&
            !isValidEmail(
              ref.email.trim()
            )
          ) {
            throw new Error(
              `Reference ${i + 1}: Please enter a valid email address`
            )
          }
        }

        setSaving(true)

        const cleanedReferences =
          referencesToSave.map(
            ref => ({
              full_name:
                ref.name.trim(),

              organisation:
                ref.org.trim(),

              relationship:
                ref.type.trim(),

              phone:
                ref.phone.trim(),

              email:
                ref.email.trim()
            })
          )

        await saveMyReferences(
          cleanedReferences
        )

        // Delete existing recommendation letter
        if (
          letterRemoved
        ) {
          await deleteMyRecommendationLetter()
        }

        // Upload new / replacement recommendation letter
        if (
          letterFile
        ) {

          setLetterUploading(
            true
          )

          await saveMyRecommendationLetter(
            letterFile
          )
        }

        const savedLocalRefs:Ref[] =
          cleanedReferences.map(
            ref => ({
              name:
                ref.full_name,

              org:
                ref.organisation,

              type:
                ref.relationship,

              phone:
                ref.phone,

              email:
                ref.email
            })
          )

        setRefs(
          savedLocalRefs
        )

        let finalLetterExisting =
          letterExisting

        let finalLetterName =
          letterFileName

        if (letterRemoved) {
          finalLetterExisting =
            false

          finalLetterName =
            ''
        }

        if (letterFile) {
          finalLetterExisting =
            true

          finalLetterName =
            letterFile.name
        }

        setLetterExisting(
          finalLetterExisting
        )

        setLetterRemoved(
          false
        )

        setLetterFile(
          null
        )

        setLetterFileName(
          finalLetterName
        )

        setSavedLetterFileName(
          finalLetterName
        )

        setHasSavedData(
          true
        )

        setInitialData(
          createSnapshot(
            savedLocalRefs,
            {
              existing:
                finalLetterExisting,

              removed:false,

              fileName:
                finalLetterName,

              file:null
            }
          )
        )

        onNext()

      } catch (error) {

        console.error(
          'Failed to save references:',
          error
        )

        if (
          error instanceof Error
        ) {
          setSaveError(
            error.message
          )
        } else {
          setSaveError(
            'Failed to save references'
          )
        }

      } finally {

        setSaving(
          false
        )

        setLetterUploading(
          false
        )

      }
    }

  // ─────────────────────────────────────────────
  // Loading
  // ─────────────────────────────────────────────

  if (loading) {

    return (
      <StepWrap
        step={9}
        total={11}
        title="References"
        desc="Provide at least two professional references who can verify your experience."
        onBack={onBack}
        onNext={() => {}}
        nextDisabled={true}
      >

        <Card
          style={{
            padding:30,
            textAlign:
              'center' as const
          }}
        >

          <p
            style={{
              fontSize:13,
              color:C.muted
            }}
          >
            Loading references...
          </p>

        </Card>

      </StepWrap>
    )
  }

  return (
    <StepWrap
      step={9}
      total={11}
      title="References"
      desc="Provide at least two professional references who can verify your experience."
      onBack={onBack}
      onNext={
        handleSaveAndContinue
      }
      nextLabel={
        saving
          ? 'Saving...'
          : 'Save & Continue'
      }
      nextDisabled={
        !canSave ||
        saving ||
        letterUploading
      }
    >

      {/* References */}
      <div
        style={{
          display:'flex',
          flexDirection:'column',
          gap:16,
          marginBottom:20
        }}
      >

        {refs.map(
          (ref, index) => (

            <Card
              key={index}
              style={{
                padding:22
              }}
            >

              <div
                style={{
                  display:'flex',
                  justifyContent:'space-between',
                  alignItems:'center',
                  marginBottom:14
                }}
              >

                <div>

                  <p
                    style={{
                      fontSize:13,
                      fontWeight:800,
                      color:C.type,
                      fontFamily:'Manrope,sans-serif'
                    }}
                  >
                    Reference {index + 1}
                  </p>

                  {index < 2 && (
                    <p
                      style={{
                        fontSize:10,
                        color:C.muted,
                        marginTop:2
                      }}
                    >
                      Required
                    </p>
                  )}

                </div>

                {refs.length > 2 && (
                  <button
                    type="button"

                    onClick={() =>
                      removeRef(
                        index
                      )
                    }

                    style={{
                      width:30,
                      height:30,
                      borderRadius:8,
                      background:`${C.error}05`,
                      border:`1px solid ${C.error}15`,
                      cursor:'pointer',
                      color:C.error,
                      display:'flex',
                      alignItems:'center',
                      justifyContent:'center'
                    }}
                  >
                    {I.trash}
                  </button>
                )}

              </div>

              <div
                style={{
                  display:'grid',
                  gridTemplateColumns:'1fr 1fr',
                  gap:12
                }}
                className="cao-2col"
              >

                <Input
                  label="Full Name"
                  value={ref.name}
                  onChange={value =>
                    updateRef(
                      index,
                      'name',
                      value
                    )
                  }
                  required
                />

                <Input
                  label="Organisation / Hospital"
                  value={ref.org}
                  onChange={value =>
                    updateRef(
                      index,
                      'org',
                      value
                    )
                  }
                  required
                />

                <Select
                  label="Relationship"
                  options={[
                    'Employer',
                    'Hospital',
                    'Doctor',
                    'Previous Client',
                    'Colleague',
                    'Other'
                  ]}
                  value={ref.type}
                  onChange={value =>
                    updateRef(
                      index,
                      'type',
                      value
                    )
                  }
                />

                <Input
                  label="Phone Number"
                  value={ref.phone}
                  onChange={value =>
                    updateRef(
                      index,
                      'phone',
                      value
                    )
                  }
                  hint="Phone or email required"
                />

                <Input
                  label="Email Address"
                  type="email"
                  value={ref.email}
                  onChange={value =>
                    updateRef(
                      index,
                      'email',
                      value
                    )
                  }
                  hint="Phone or email required"
                />

              </div>

            </Card>

          )
        )}

      </div>

      {/* Add another reference */}
      <button
        type="button"
        onClick={addRef}

        style={{
          width:'100%',
          padding:'14px',
          borderRadius:12,
          border:`2px dashed ${C.border}`,
          background:'transparent',
          cursor:'pointer',
          display:'flex',
          gap:8,
          justifyContent:'center',
          alignItems:'center',
          fontFamily:'Manrope,sans-serif',
          fontSize:13,
          fontWeight:700,
          color:C.primary
        }}
      >

        <span
          style={{
            display:'flex'
          }}
        >
          {I.plus}
        </span>

        Add Another Reference

      </button>

      {/* Recommendation Letter */}
      <Card
        style={{
          padding:20,
          marginTop:16
        }}
      >

        <p
          style={{
            fontSize:12,
            fontWeight:800,
            color:C.muted,
            textTransform:'uppercase',
            letterSpacing:'0.08em',
            marginBottom:12
          }}
        >
          Recommendation Letter (Optional)
        </p>

        {/* Hidden real file input */}
        <input
          ref={letterInputRef}
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={
            handleLetterSelect
          }
          style={{
            display:'none'
          }}
        />

        {/* Upload / selected state */}
        {!letterRemoved && (
          <div
            onClick={
              handleLetterClick
            }
            style={{
              padding:'20px',
              borderRadius:14,

              border:
                `2px dashed ${
                  letterFile ||
                  letterExisting
                    ? C.success
                    : C.border
                }`,

              background:
                letterFile ||
                letterExisting
                  ? `${C.success}06`
                  : C.bg,

              cursor:'pointer',

              textAlign:
                'center' as const
            }}
          >

            {letterUploading ? (

              <p
                style={{
                  fontSize:13,
                  fontWeight:700,
                  color:C.info
                }}
              >
                Uploading...
              </p>

            ) : letterFile ? (

              <>
                <p
                  style={{
                    fontSize:13,
                    fontWeight:700,
                    color:C.success
                  }}
                >
                  ✓ {letterFile.name}
                </p>

                <p
                  style={{
                    fontSize:11,
                    color:C.info,
                    marginTop:4
                  }}
                >
                  {letterExisting
                    ? 'Replacement selected — save changes to upload'
                    : 'Ready to upload — save changes to continue'}
                </p>
              </>

            ) : letterExisting ? (

              <>
                <p
                  style={{
                    fontSize:13,
                    fontWeight:700,
                    color:C.success
                  }}
                >
                  ✓ {letterFileName}
                </p>

                <p
                  style={{
                    fontSize:11,
                    color:C.primary,
                    marginTop:4
                  }}
                >
                  Click to replace
                </p>
              </>

            ) : (

              <>
                <div
                  style={{
                    width:40,
                    height:40,
                    borderRadius:13,
                    background:`${C.primary}10`,
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    color:C.primary,
                    margin:'0 auto 10px'
                  }}
                >
                  {I.upload}
                </div>

                <p
                  style={{
                    fontSize:13,
                    fontWeight:700,
                    color:C.type
                  }}
                >
                  Upload Recommendation Letter
                </p>

                <p
                  style={{
                    fontSize:11,
                    color:C.muted,
                    marginTop:4
                  }}
                >
                  PDF, DOC or DOCX · Max 10MB
                </p>

                <p
                  style={{
                    fontSize:11,
                    color:C.primary,
                    fontWeight:700,
                    marginTop:8
                  }}
                >
                  Click to select file
                </p>
              </>

            )}

          </div>
        )}

        {/* Pending deletion */}
        {letterRemoved && (
          <div
            style={{
              padding:16,
              borderRadius:12,
              background:`${C.error}05`,
              border:`1px solid ${C.error}25`
            }}
          >

            <p
              style={{
                fontSize:12,
                fontWeight:700,
                color:C.error
              }}
            >
              Recommendation Letter will be deleted when you save changes.
            </p>

            <button
              type="button"
              onClick={
                handleUndoLetterRemove
              }
              style={{
                marginTop:8,
                padding:0,
                border:'none',
                background:'none',
                color:C.primary,
                fontSize:12,
                fontWeight:700,
                cursor:'pointer'
              }}
            >
              Undo Remove
            </button>

          </div>
        )}

        {/* Remove / cancel */}
        {!letterRemoved &&
          (
            letterFile ||
            letterExisting
          ) && (

          <button
            type="button"

            onClick={
              handleRemoveLetter
            }

            style={{
              marginTop:10,
              padding:0,
              border:'none',
              background:'none',
              color:C.error,
              fontSize:12,
              fontWeight:700,
              cursor:'pointer'
            }}
          >
            {letterFile &&
            letterExisting
              ? 'Cancel New File'
              : 'Remove Recommendation Letter'}
          </button>

        )}

        <p
          style={{
            marginTop:8,
            fontSize:10,
            color:C.muted,
            lineHeight:1.5
          }}
        >
          Recommendation Letter is optional and is not included
          in the required reference validation.
        </p>

      </Card>

      {/* Error */}
      {saveError && (
        <div
          style={{
            padding:'12px 14px',
            marginTop:16,
            borderRadius:10,
            background:`${C.error}08`,
            border:`1px solid ${C.error}30`,
            color:C.error,
            fontSize:12,
            fontWeight:600
          }}
        >
          {saveError}
        </div>
      )}

    </StepWrap>
  )
}



// ─── Step 10: Agreements & Consent ────────────────────────────────────────────
function Step10({
  onBack,
  onNext
}:{
  onBack:()=>void
  onNext:()=>void
}) {

  type AgreementKey =
    | 'terms'
    | 'privacy'
    | 'conduct'
    | 'care'
    | 'background'

  type AgreementState =
    Record<AgreementKey, boolean>

  const emptyAgreements:AgreementState = {
    terms:false,
    privacy:false,
    conduct:false,
    care:false,
    background:false
  }

  const emptyReadState:AgreementState = {
    terms:false,
    privacy:false,
    conduct:false,
    care:false,
    background:false
  }

  // Accepted / ticked state
  const [agreed, setAgreed] =
    useState<AgreementState>(
      emptyAgreements
    )

  // Has the user actually read/opened the document?
  const [readDocuments, setReadDocuments] =
    useState<AgreementState>(
      emptyReadState
    )

  const [
    selectedDocument,
    setSelectedDocument
  ] = useState<AgreementKey | null>(
    null
  )

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [saveError, setSaveError] =
    useState('')

  // Dirty-state tracking
  const [initialData, setInitialData] =
    useState('')

  const [
    hasSavedData,
    setHasSavedData
  ] = useState(false)

  // ─────────────────────────────────────────────
  // Agreement list
  // ─────────────────────────────────────────────
  const docs = [
    {
      k:'terms' as const,

      title:
        'Terms & Conditions',

      desc:
        'Governs your use of the ReadyPal platform, payment terms, and agent obligations.'
    },

    {
      k:'privacy' as const,

      title:
        'Privacy Policy',

      desc:
        'How we collect, use, and protect your personal and professional data.'
    },

    {
      k:'conduct' as const,

      title:
        'Code of Conduct',

      desc:
        'Professional behaviour standards expected of all ReadyPal Care Agents.'
    },

    {
      k:'care' as const,

      title:
        'Care Standards',

      desc:
        'Minimum quality standards for all care services delivered through ReadyPal.'
    },

    {
      k:'background' as const,

      title:
        'Background Check Consent',

      desc:
        'You consent to identity verification and police record checks.'
    }
  ]

  // ─────────────────────────────────────────────
  // Full readable documents
  // ─────────────────────────────────────────────
  const documentContent:Record<
    AgreementKey,
    {
      title:string
      intro:string
      sections:{
        heading:string
        text:string
      }[]
    }
  > = {

    // ═══════════════════════════════════════
    // TERMS
    // ═══════════════════════════════════════
    terms:{
      title:
        'Terms & Conditions',

      intro:
        'These Terms & Conditions explain the responsibilities of Care Agents who use the ReadyPal platform.',

      sections:[
        {
          heading:
            '1. Care Agent Responsibilities',

          text:
            'You must provide accurate personal, professional, availability and verification information. You must perform accepted care services responsibly, professionally and respectfully.'
        },

        {
          heading:
            '2. Platform Use',

          text:
            'ReadyPal may be used only for legitimate care-related activities. You must not misuse client information, platform features or communication channels.'
        },

        {
          heading:
            '3. Service Commitments',

          text:
            'Once you accept a confirmed care request, you are expected to arrive on time, follow the agreed service requirements and communicate promptly if an unexpected issue occurs.'
        },

        {
          heading:
            '4. Payments & Payouts',

          text:
            'Payments for completed services will be handled according to ReadyPal payout rules. Your payout information must be accurate and may require verification before funds are transferred.'
        },

        {
          heading:
            '5. Account Suspension',

          text:
            'ReadyPal may restrict or suspend an account if there is suspected fraud, unsafe behaviour, serious policy violations or repeated service complaints.'
        }
      ]
    },

    // ═══════════════════════════════════════
    // PRIVACY
    // ═══════════════════════════════════════
    privacy:{
      title:
        'Privacy Policy',

      intro:
        'This Privacy Policy explains how ReadyPal handles personal and professional information provided by Care Agents.',

      sections:[
        {
          heading:
            '1. Information We Collect',

          text:
            'ReadyPal may collect your name, contact details, address, identification documents, professional qualifications, references, bank information and service availability.'
        },

        {
          heading:
            '2. Why We Collect Information',

          text:
            'Information is used for account creation, identity verification, background checks, client matching, payouts, platform safety and customer support.'
        },

        {
          heading:
            '3. Information Sharing',

          text:
            'Only appropriate profile information is shown to clients. Sensitive documents, identification numbers and banking details are not displayed publicly.'
        },

        {
          heading:
            '4. Data Protection',

          text:
            'ReadyPal takes reasonable technical and organisational measures to protect stored information against unauthorised access, misuse or loss.'
        },

        {
          heading:
            '5. Data Updates',

          text:
            'You are responsible for keeping your personal and professional information accurate and up to date.'
        }
      ]
    },

    // ═══════════════════════════════════════
    // CONDUCT
    // ═══════════════════════════════════════
    conduct:{
      title:
        'Code of Conduct',

      intro:
        'All ReadyPal Care Agents are expected to maintain professional behaviour when interacting with clients, beneficiaries and families.',

      sections:[
        {
          heading:
            '1. Respect & Dignity',

          text:
            'Treat every beneficiary with dignity, patience, respect and compassion regardless of age, gender, background or personal circumstances.'
        },

        {
          heading:
            '2. Professional Behaviour',

          text:
            'Use respectful language, maintain appropriate boundaries and behave professionally during all ReadyPal services.'
        },

        {
          heading:
            '3. Confidentiality',

          text:
            'Do not disclose private client, beneficiary or family information unless required for service delivery, safety or legal reasons.'
        },

        {
          heading:
            '4. Safety',

          text:
            'Do not perform procedures or tasks outside your qualifications. Report emergencies, unsafe conditions or serious concerns immediately.'
        },

        {
          heading:
            '5. Prohibited Conduct',

          text:
            'Harassment, discrimination, theft, fraud, abuse, intoxication during service and misuse of client property are prohibited.'
        }
      ]
    },

    // ═══════════════════════════════════════
    // CARE
    // ═══════════════════════════════════════
    care:{
      title:
        'Care Standards',

      intro:
        'These standards describe the minimum quality expected from services delivered through ReadyPal.',

      sections:[
        {
          heading:
            '1. Reliability',

          text:
            'Arrive at the agreed location and time and notify the client as early as possible if you are delayed.'
        },

        {
          heading:
            '2. Service Quality',

          text:
            'Follow the care request instructions carefully and provide only services that you are qualified and authorised to perform.'
        },

        {
          heading:
            '3. Medication Support',

          text:
            'Medication-related assistance must remain within the approved task and your level of competence. Never change medication instructions independently.'
        },

        {
          heading:
            '4. Hygiene & Infection Prevention',

          text:
            'Maintain appropriate personal hygiene and follow reasonable infection-control practices when assisting beneficiaries.'
        },

        {
          heading:
            '5. Emergency Response',

          text:
            'In an emergency, prioritise the beneficiary’s immediate safety and contact the appropriate emergency service, family member or ReadyPal support when necessary.'
        }
      ]
    },

    // ═══════════════════════════════════════
    // BACKGROUND CHECK
    // ═══════════════════════════════════════
    background:{
      title:
        'Background Check Consent',

      intro:
        'By accepting this consent, you authorise ReadyPal to review information required to assess your suitability as a Care Agent.',

      sections:[
        {
          heading:
            '1. Identity Verification',

          text:
            'ReadyPal may verify the identity information and documents you provide, including your NIC or other approved identification.'
        },

        {
          heading:
            '2. Police Clearance',

          text:
            'ReadyPal may review submitted police clearance information and may request updated documentation when necessary.'
        },

        {
          heading:
            '3. Professional Verification',

          text:
            'Your qualifications, certificates, employment history and references may be reviewed or confirmed.'
        },

        {
          heading:
            '4. Reference Checks',

          text:
            'ReadyPal may contact the professional references you provide in order to verify your experience, conduct or work history.'
        },

        {
          heading:
            '5. Consent',

          text:
            'You confirm that the information provided is accurate and that ReadyPal may use it for legitimate verification and platform safety purposes.'
        }
      ]
    }
  }

  // ─────────────────────────────────────────────
  // Status calculations
  // ─────────────────────────────────────────────

  const acceptedCount =
    Object.values(
      agreed
    ).filter(Boolean).length

  const readCount =
    Object.values(
      readDocuments
    ).filter(Boolean).length

  const allRead =
    readCount === 5

  const allAgreed =
    acceptedCount === 5

  // ─────────────────────────────────────────────
  // Dirty state
  // ─────────────────────────────────────────────

  const currentData =
    JSON.stringify(
      agreed
    )

  const hasChanges =
    initialData !== '' &&
    currentData !== initialData

  const canSave =
    !loading &&
    allAgreed &&
    (
      !hasSavedData ||
      hasChanges
    )

  // ─────────────────────────────────────────────
  // Load saved agreements
  // ─────────────────────────────────────────────

  useEffect(() => {

    const loadAgreements =
      async () => {

        try {

          setLoading(true)
          setSaveError('')

          const data =
            await getMyAgreements()

          if (!data) {

            setAgreed(
              emptyAgreements
            )

            setReadDocuments(
              emptyReadState
            )

            setHasSavedData(
              false
            )

            setInitialData(
              JSON.stringify(
                emptyAgreements
              )
            )

            return
          }

          const loadedAgreements:AgreementState = {

            terms:
              data.terms_accepted ??
              false,

            privacy:
              data.privacy_accepted ??
              false,

            conduct:
              data.conduct_accepted ??
              false,

            care:
              data.care_standards_accepted ??
              false,

            background:
              data.background_check_accepted ??
              false
          }

          setAgreed(
            loadedAgreements
          )

          /*
           * If an agreement was already saved as accepted,
           * treat it as previously read.
           *
           * Otherwise an existing user would have to read
           * everything again just to edit Step 10.
           */
          setReadDocuments({
            terms:
              loadedAgreements.terms,

            privacy:
              loadedAgreements.privacy,

            conduct:
              loadedAgreements.conduct,

            care:
              loadedAgreements.care,

            background:
              loadedAgreements.background
          })

          setHasSavedData(
            Object.values(
              loadedAgreements
            ).some(Boolean)
          )

          setInitialData(
            JSON.stringify(
              loadedAgreements
            )
          )

        } catch (error) {

          console.error(
            'Failed to load agreements:',
            error
          )

          setSaveError(
            'Failed to load saved agreements'
          )

        } finally {

          setLoading(false)

        }
      }

    loadAgreements()

  }, [])

  // ─────────────────────────────────────────────
  // Tick / untick
  // ─────────────────────────────────────────────

  const toggleAgreement = (
    key:AgreementKey
  ) => {

    /*
     * CRITICAL CONDITION:
     * User cannot tick agreement until
     * the corresponding document is read.
     */
    if (
      !readDocuments[key]
    ) {
      setSaveError(
        'Please read this document before agreeing to it.'
      )

      return
    }

    setAgreed(prev => ({
      ...prev,
      [key]:
        !prev[key]
    }))

    setSaveError('')
  }

  // ─────────────────────────────────────────────
  // Mark selected document as read
  // ─────────────────────────────────────────────

  const markDocumentAsRead = (
    key:AgreementKey
  ) => {

    setReadDocuments(
      prev => ({
        ...prev,
        [key]:true
      })
    )

    setSelectedDocument(
      null
    )

    setSaveError('')
  }

  // ─────────────────────────────────────────────
  // Accept all
  // ─────────────────────────────────────────────

  const acceptAll = () => {

    if (!allRead) {

      setSaveError(
        'Please read all five documents before accepting all agreements.'
      )

      return
    }

    setAgreed({
      terms:true,
      privacy:true,
      conduct:true,
      care:true,
      background:true
    })

    setSaveError('')
  }

  // ─────────────────────────────────────────────
  // Save
  // ─────────────────────────────────────────────

  const handleSaveAndContinue =
    async () => {

      try {

        if (
          !canSave ||
          saving
        ) {
          return
        }

        setSaveError('')

        if (!allRead) {
          throw new Error(
            'Please read all agreements before continuing'
          )
        }

        if (!allAgreed) {
          throw new Error(
            'Please agree to all documents before continuing'
          )
        }

        setSaving(true)

        await saveMyAgreements({

          terms_accepted:
            agreed.terms,

          privacy_accepted:
            agreed.privacy,

          conduct_accepted:
            agreed.conduct,

          care_standards_accepted:
            agreed.care,

          background_check_accepted:
            agreed.background
        })

        setHasSavedData(
          true
        )

        setInitialData(
          JSON.stringify(
            agreed
          )
        )

        // Normal flow → Step 11
        // Review edit → Step 11
        onNext()

      } catch (error) {

        console.error(
          'Failed to save agreements:',
          error
        )

        if (
          error instanceof Error
        ) {
          setSaveError(
            error.message
          )
        } else {
          setSaveError(
            'Failed to save agreements'
          )
        }

      } finally {

        setSaving(false)

      }
    }

  // ─────────────────────────────────────────────
  // Loading
  // ─────────────────────────────────────────────

  if (loading) {

    return (
      <StepWrap
        step={10}
        total={11}
        title="Agreements & Consent"
        desc="Please read and agree to all documents before submitting your application."
        onBack={onBack}
        onNext={() => {}}
        nextDisabled={true}
      >

        <Card
          style={{
            padding:30,
            textAlign:
              'center' as const
          }}
        >

          <p
            style={{
              fontSize:13,
              color:C.muted
            }}
          >
            Loading agreements...
          </p>

        </Card>

      </StepWrap>
    )
  }

  return (
    <>

      <StepWrap
        step={10}
        total={11}
        title="Agreements & Consent"
        desc="Please read and agree to all documents before submitting your application."
        onBack={onBack}
        onNext={
          handleSaveAndContinue
        }
        nextLabel={
          saving
            ? 'Saving...'

            : !allRead
              ? 'Read All Documents First'

              : !allAgreed
                ? 'Agree to All First'

                : 'Save & Continue'
        }
        nextDisabled={
          !canSave ||
          saving
        }
      >

        {/* ─────────────────────────────
            INFO
        ───────────────────────────── */}
        <Card
          style={{
            padding:'14px 16px',
            marginBottom:16,

            background:
              `${C.info}05`,

            border:
              `1px solid ${C.info}20`
          }}
        >

          <p
            style={{
              fontSize:12,
              fontWeight:700,
              color:C.info,
              marginBottom:3
            }}
          >
            Please review all documents carefully
          </p>

          <p
            style={{
              fontSize:11,
              color:C.muted,
              lineHeight:1.6
            }}
          >
            You must read each document before its agreement checkbox becomes available.
          </p>

        </Card>

        {/* ─────────────────────────────
            AGREEMENT CARDS
        ───────────────────────────── */}
        <div
          style={{
            display:'flex',
            flexDirection:'column',
            gap:12,
            marginBottom:20
          }}
        >

          {docs.map(doc => {

            const hasRead =
              readDocuments[
                doc.k
              ]

            const hasAgreed =
              agreed[
                doc.k
              ]

            return (

              <Card
                key={
                  doc.k
                }

                style={{
                  padding:20,

                  border:
                    `1.5px solid ${
                      hasAgreed
                        ? C.success + '40'
                        : hasRead
                          ? C.primary + '25'
                          : C.border
                    }`,

                  background:
                    hasAgreed
                      ? `${C.success}04`
                      : C.surface
                }}
              >

                <div
                  style={{
                    display:'flex',
                    gap:14,
                    alignItems:
                      'flex-start'
                  }}
                >

                  {/* CHECKBOX */}
                  <button
                    type="button"

                    onClick={() =>
                      toggleAgreement(
                        doc.k
                      )
                    }

                    disabled={
                      !hasRead
                    }

                    title={
                      !hasRead
                        ? 'Read this document first'
                        : hasAgreed
                          ? 'Remove agreement'
                          : 'Agree to this document'
                    }

                    style={{
                      width:22,
                      height:22,

                      borderRadius:6,

                      background:
                        hasAgreed
                          ? C.primary
                          : 'transparent',

                      border:
                        `2px solid ${
                          hasAgreed
                            ? C.primary
                            : hasRead
                              ? C.primary
                              : C.border
                        }`,

                      cursor:
                        hasRead
                          ? 'pointer'
                          : 'not-allowed',

                      opacity:
                        hasRead
                          ? 1
                          : 0.45,

                      display:'flex',
                      alignItems:'center',
                      justifyContent:
                        'center',

                      flexShrink:0,
                      marginTop:1,

                      transition:
                        'all 0.15s'
                    }}
                  >

                    {hasAgreed && (

                      <span
                        style={{
                          color:'#fff',
                          display:'flex',

                          transform:
                            'scale(0.75)'
                        }}
                      >
                        {I.check}
                      </span>

                    )}

                  </button>

                  {/* CONTENT */}
                  <div
                    style={{
                      flex:1
                    }}
                  >

                    <div
                      style={{
                        display:'flex',
                        gap:8,
                        alignItems:'center',
                        marginBottom:4,

                        flexWrap:'wrap'
                      }}
                    >

                      <p
                        style={{
                          fontSize:13,
                          fontWeight:700,
                          color:C.type
                        }}
                      >
                        {doc.title}
                      </p>

                      <span
                        style={{
                          color:C.error,
                          fontWeight:800
                        }}
                      >
                        *
                      </span>

                      {/* READ BUTTON */}
                      <button
                        type="button"

                        onClick={() =>
                          setSelectedDocument(
                            doc.k
                          )
                        }

                        style={{
                          fontSize:11,
                          fontWeight:700,

                          color:C.primary,

                          background:'none',
                          border:'none',
                          padding:0,

                          cursor:'pointer',

                          fontFamily:
                            'Manrope,sans-serif'
                        }}
                      >
                        {hasRead
                          ? 'Read Again →'
                          : 'Read →'}
                      </button>

                      {/* READ STATUS */}
                      {hasRead && (

                        <Bdg
                          label="Read"
                          color={C.info}
                        />

                      )}

                    </div>

                    <p
                      style={{
                        fontSize:12,
                        color:C.muted,
                        lineHeight:1.6
                      }}
                    >
                      {doc.desc}
                    </p>

                    {!hasRead && (

                      <p
                        style={{
                          fontSize:10,
                          color:C.warning,
                          fontWeight:700,
                          marginTop:6
                        }}
                      >
                        Read this document to unlock the checkbox
                      </p>

                    )}

                    {hasRead &&
                    !hasAgreed && (

                      <p
                        style={{
                          fontSize:10,
                          color:C.info,
                          fontWeight:700,
                          marginTop:6
                        }}
                      >
                        ✓ Read — you can now agree
                      </p>

                    )}

                    {hasAgreed && (

                      <p
                        style={{
                          fontSize:10,
                          color:C.success,
                          fontWeight:700,
                          marginTop:6
                        }}
                      >
                        ✓ Read & Accepted
                      </p>

                    )}

                  </div>

                </div>

              </Card>

            )
          })}

        </div>

        {/* ─────────────────────────────
            ACCEPT ALL
        ───────────────────────────── */}
        <button
          type="button"

          onClick={
            acceptAll
          }

          disabled={
            !allRead ||
            allAgreed
          }

          title={
            !allRead
              ? 'Read all documents first'
              : ''
          }

          style={{
            width:'100%',
            padding:'12px',

            borderRadius:12,

            border:
              `1.5px solid ${
                allAgreed
                  ? C.success
                  : C.border
              }`,

            background:
              allAgreed
                ? `${C.success}04`
                : 'transparent',

            cursor:
              !allRead ||
              allAgreed
                ? 'not-allowed'
                : 'pointer',

            opacity:
              !allRead
                ? 0.5
                : 1,

            fontFamily:
              'Manrope,sans-serif',

            fontSize:13,
            fontWeight:700,

            color:
              allAgreed
                ? C.success
                : C.sub,

            marginBottom:16
          }}
        >

          {!allRead
            ? `Read All Documents (${readCount}/5)`

            : allAgreed
              ? '✓ All Agreements Accepted'

              : 'Accept All Agreements'}

        </button>

        {/* ─────────────────────────────
            PROGRESS
        ───────────────────────────── */}
        <Card
          style={{
            padding:'16px',
            marginBottom:16
          }}
        >

          <div
            style={{
              display:'grid',
              gridTemplateColumns:
                '1fr 1fr',
              gap:16
            }}
            className="cao-2col"
          >

            {/* READ PROGRESS */}
            <div>

              <p
                style={{
                  fontSize:11,
                  color:C.muted,
                  marginBottom:4
                }}
              >
                Documents Read
              </p>

              <p
                style={{
                  fontSize:18,
                  fontWeight:900,
                  color:
                    allRead
                      ? C.success
                      : C.primary
                }}
              >
                {readCount}/5
              </p>

            </div>

            {/* ACCEPTED PROGRESS */}
            <div>

              <p
                style={{
                  fontSize:11,
                  color:C.muted,
                  marginBottom:4
                }}
              >
                Agreements Accepted
              </p>

              <p
                style={{
                  fontSize:18,
                  fontWeight:900,

                  color:
                    allAgreed
                      ? C.success
                      : C.primary
                }}
              >
                {acceptedCount}/5
              </p>

            </div>

          </div>

        </Card>

        {/* ERROR */}
        {saveError && (

          <div
            style={{
              padding:'12px 14px',
              marginTop:16,

              borderRadius:10,

              background:
                `${C.error}08`,

              border:
                `1px solid ${C.error}30`,

              color:C.error,

              fontSize:12,
              fontWeight:600
            }}
          >
            {saveError}
          </div>

        )}

      </StepWrap>

      {/* ═══════════════════════════════════════════
          DOCUMENT MODAL
      ═══════════════════════════════════════════ */}
      {selectedDocument && (

        <div
          onClick={() =>
            setSelectedDocument(
              null
            )
          }

          style={{
            position:'fixed',
            inset:0,

            zIndex:9999,

            background:
              'rgba(15, 23, 42, 0.55)',

            display:'flex',
            alignItems:'center',
            justifyContent:'center',

            padding:20
          }}
        >

          <div
            onClick={event =>
              event.stopPropagation()
            }

            style={{
              width:'100%',
              maxWidth:720,

              maxHeight:'85vh',

              background:C.surface,

              borderRadius:18,

              boxShadow:
                '0 24px 80px rgba(0,0,0,0.25)',

              overflow:'hidden'
            }}
          >

            {/* MODAL HEADER */}
            <div
              style={{
                padding:'20px 22px',

                borderBottom:
                  `1px solid ${C.border}`,

                display:'flex',
                justifyContent:
                  'space-between',

                alignItems:'center',
                gap:16
              }}
            >

              <div>

                <p
                  style={{
                    fontSize:18,
                    fontWeight:900,
                    color:C.type,

                    fontFamily:
                      'Manrope,sans-serif'
                  }}
                >
                  {
                    documentContent[
                      selectedDocument
                    ].title
                  }
                </p>

                <p
                  style={{
                    fontSize:11,
                    color:C.muted,
                    marginTop:3
                  }}
                >
                  ReadyPal Care Agent Agreement
                </p>

              </div>

              <button
                type="button"

                onClick={() =>
                  setSelectedDocument(
                    null
                  )
                }

                style={{
                  width:34,
                  height:34,

                  borderRadius:10,

                  border:
                    `1px solid ${C.border}`,

                  background:C.bg,

                  cursor:'pointer',

                  color:C.muted,
                  fontSize:20
                }}
              >
                ×
              </button>

            </div>

            {/* MODAL CONTENT */}
            <div
              style={{
                padding:22,

                maxHeight:
                  'calc(85vh - 160px)',

                overflowY:'auto'
              }}
            >

              <p
                style={{
                  fontSize:13,
                  color:C.sub,
                  lineHeight:1.75,
                  marginBottom:20
                }}
              >
                {
                  documentContent[
                    selectedDocument
                  ].intro
                }
              </p>

              {
                documentContent[
                  selectedDocument
                ].sections.map(
                  (
                    section,
                    index
                  ) => (

                    <div
                      key={
                        index
                      }

                      style={{
                        marginBottom:20
                      }}
                    >

                      <p
                        style={{
                          fontSize:13,
                          fontWeight:800,
                          color:C.type,
                          marginBottom:6
                        }}
                      >
                        {section.heading}
                      </p>

                      <p
                        style={{
                          fontSize:12,
                          color:C.muted,
                          lineHeight:1.75
                        }}
                      >
                        {section.text}
                      </p>

                    </div>

                  )
                )
              }

            </div>

            {/* MODAL FOOTER */}
            <div
              style={{
                padding:'14px 22px',

                borderTop:
                  `1px solid ${C.border}`,

                display:'flex',

                justifyContent:
                  'flex-end',

                gap:10
              }}
            >

              <button
                type="button"

                onClick={() =>
                  setSelectedDocument(
                    null
                  )
                }

                style={{
                  padding:'9px 16px',

                  borderRadius:10,

                  border:
                    `1px solid ${C.border}`,

                  background:C.surface,

                  color:C.sub,

                  cursor:'pointer',

                  fontSize:12,
                  fontWeight:700
                }}
              >
                Close
              </button>

              {/* IMPORTANT:
                  This marks READ only.
                  It does NOT agree/tick automatically.
              */}
              <button
                type="button"

                onClick={() =>
                  markDocumentAsRead(
                    selectedDocument
                  )
                }

                style={{
                  padding:'9px 16px',

                  borderRadius:10,

                  border:'none',

                  background:C.primary,

                  color:'#fff',

                  cursor:'pointer',

                  fontSize:12,
                  fontWeight:700
                }}
              >
                I Have Read
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  )
}



// ─── Step 11: Review & Submit ─────────────────────────────────────────────────
function Step11({
  onBack,
  onSubmit,
  onGoto
}:{
  onBack:()=>void
  onSubmit:()=>void
  onGoto:(step:number)=>void
}) {

  type ReviewSection = {
    step:number
    title:string
    complete:boolean
    items:string[]
    missing:string[]
  }

  const [sections, setSections] =
    useState<ReviewSection[]>([])

  const [loading, setLoading] =
    useState(true)

  const [submitting, setSubmitting] =
    useState(false)

  const [errorMessage, setErrorMessage] =
    useState('')

  // ─────────────────────────────────────────────
  // Small display helpers
  // ─────────────────────────────────────────────
  const formatLabel = (
    value:string
  ) => {
    return value
      .replace(/-/g, ' ')
      .replace(/\b\w/g, char =>
        char.toUpperCase()
      )
  }

  const formatDocumentType = (
    value:string
  ) => {

    const labels:Record<string,string> = {
      'caregiving-certificate':
        'Caregiving Certificate',

      'first-aid-certificate':
        'First Aid Certificate',

      'cpr-certificate':
        'CPR Certificate',

      'nursing-qualification':
        'Nursing Qualification',

      'medical-training-certificate':
        'Medical Training Certificate',

      'other-certification':
        'Other Certification'
    }

    return (
      labels[value] ||
      formatLabel(value)
    )
  }

  // ─────────────────────────────────────────────
  // Load full application review
  // ─────────────────────────────────────────────
  useEffect(() => {

    let cancelled = false

    const loadReview = async () => {

      try {

        setLoading(true)
        setErrorMessage('')

        const [
          profile,
          agentDetails,
          skills,
          certifications,
          identityDocs,
          bankAccount,
          availability,
          equipment,
          references,
          agreements
        ] = await Promise.all([

          getMyProfile(),

          getMyAgentDetails(),

          getMyAgentSkills(),

          getMyCertifications(),

          getMyIdentityDocuments(),

          getMyBankAccount(),

          getMyAvailability(),

          getMyEquipmentTransport(),

          getMyReferences(),

          getMyAgreements()

        ])

        if (cancelled) return

        // ════════════════════════════════════════
        // STEP 1 — PERSONAL INFORMATION
        // ════════════════════════════════════════

        const personalMissing:string[] = []

        if (
          !profile?.full_name?.trim()
        ) {
          personalMissing.push(
            'Full Name'
          )
        }

        if (
          !profile?.nic?.trim()
        ) {
          personalMissing.push(
            'NIC'
          )
        }

        if (
          !profile?.date_of_birth
        ) {
          personalMissing.push(
            'Date of Birth'
          )
        }

        if (
          !profile?.email?.trim()
        ) {
          personalMissing.push(
            'Email'
          )
        }

        if (
          !profile?.phone?.trim()
        ) {
          personalMissing.push(
            'Phone'
          )
        }

        if (
          !profile?.address?.trim()
        ) {
          personalMissing.push(
            'Address'
          )
        }

        if (
          !profile?.city?.trim()
        ) {
          personalMissing.push(
            'City'
          )
        }

        // ════════════════════════════════════════
        // STEP 2 — PROFESSIONAL PROFILE
        // ════════════════════════════════════════

        const professionalMissing:string[] = []

        if (
          !agentDetails
            ?.professional_headline
            ?.trim()
        ) {
          professionalMissing.push(
            'Professional Headline'
          )
        }

        if (
          !agentDetails
            ?.bio
            ?.trim()
        ) {
          professionalMissing.push(
            'Biography'
          )
        }

        if (
          agentDetails
            ?.experience_years == null
        ) {
          professionalMissing.push(
            'Experience'
          )
        }

        if (
          !Array.isArray(
            agentDetails?.languages
          ) ||
          agentDetails.languages.length === 0
        ) {
          professionalMissing.push(
            'Languages'
          )
        }

        // ════════════════════════════════════════
        // STEP 3 — SKILLS & SERVICES
        // ════════════════════════════════════════

        const skillsMissing:string[] = []

        if (
          !skills ||
          skills.length === 0
        ) {
          skillsMissing.push(
            'At least one skill / service'
          )
        }

        // ════════════════════════════════════════
        // STEP 4 — CERTIFICATIONS
        // ════════════════════════════════════════

        const certificationMissing:string[] = []

        if (
          !certifications ||
          certifications.length === 0
        ) {
          certificationMissing.push(
            'At least one certification'
          )
        }

        // ════════════════════════════════════════
        // STEP 5 — IDENTITY VERIFICATION
        // ════════════════════════════════════════

        const requiredIdentityTypes = [
          'nic-front',
          'nic-back',
          'police-clearance-certificate',
          'medical-fitness-certificate'
        ]

        const identityTypes =
          identityDocs?.map(
            (
              doc:{
                doc_type:string
              }
            ) =>
              doc.doc_type
          ) || []

        const identityMissing =
          requiredIdentityTypes
            .filter(
              type =>
                !identityTypes.includes(
                  type
                )
            )
            .map(type => {

              switch (type) {

                case 'nic-front':
                  return 'NIC Front'

                case 'nic-back':
                  return 'NIC Back'

                case 'police-clearance-certificate':
                  return 'Police Clearance Certificate'

                case 'medical-fitness-certificate':
                  return 'Medical Fitness Certificate'

                default:
                  return type
              }
            })

        // ════════════════════════════════════════
        // STEP 6 — BANKING
        // ════════════════════════════════════════

        const bankingMissing:string[] = []

        if (
          !bankAccount
            ?.bank_name
            ?.trim()
        ) {
          bankingMissing.push(
            'Bank Name'
          )
        }

        if (
          !bankAccount
            ?.branch
            ?.trim()
        ) {
          bankingMissing.push(
            'Branch'
          )
        }

        if (
          !bankAccount
            ?.account_name
            ?.trim()
        ) {
          bankingMissing.push(
            'Account Holder Name'
          )
        }

        if (
          !bankAccount
            ?.account_number
            ?.trim()
        ) {
          bankingMissing.push(
            'Account Number'
          )
        }

        // IMPORTANT:
        // verification_status does NOT affect
        // Step 6 completion.
        //
        // Bank verification happens later
        // during admin review.

        // ════════════════════════════════════════
        // STEP 7 — AVAILABILITY
        // ════════════════════════════════════════

        const availabilityMissing:string[] = []

        if (
          !Array.isArray(
            availability?.working_days
          ) ||
          availability.working_days.length === 0
        ) {
          availabilityMissing.push(
            'Working Days'
          )
        }

        if (
          !availability
            ?.preferred_shift
        ) {
          availabilityMissing.push(
            'Preferred Shift'
          )
        }

        if (
          availability
            ?.max_weekly_hours == null ||
          availability.max_weekly_hours < 10
        ) {
          availabilityMissing.push(
            'Maximum Weekly Hours'
          )
        }

        // ════════════════════════════════════════
        // STEP 8 — EQUIPMENT & TRANSPORT
        // ════════════════════════════════════════

        const equipmentMissing:string[] = []

        if (
          !equipment
            ?.has_smartphone
        ) {
          equipmentMissing.push(
            'Smartphone'
          )
        }

        if (
          !equipment
            ?.has_internet_access
        ) {
          equipmentMissing.push(
            'Internet Access'
          )
        }

        // ════════════════════════════════════════
        // STEP 9 — REFERENCES
        // ════════════════════════════════════════

        const referencesMissing:string[] = []

        if (
          !references ||
          references.length < 2
        ) {
          referencesMissing.push(
            'At least two professional references'
          )
        }

        // Validate saved reference content too
        if (
          references &&
          references.length >= 2
        ) {

          references.forEach(
            (
              reference:{
                full_name?:string
                organisation?:string
                relationship?:string
                phone?:string
                email?:string
              },
              index:number
            ) => {

              if (
                !reference
                  .full_name
                  ?.trim()
              ) {
                referencesMissing.push(
                  `Reference ${index + 1} Full Name`
                )
              }

              if (
                !reference
                  .organisation
                  ?.trim()
              ) {
                referencesMissing.push(
                  `Reference ${index + 1} Organisation`
                )
              }

              if (
                !reference
                  .relationship
                  ?.trim()
              ) {
                referencesMissing.push(
                  `Reference ${index + 1} Relationship`
                )
              }

              if (
                !reference
                  .phone
                  ?.trim() &&
                !reference
                  .email
                  ?.trim()
              ) {
                referencesMissing.push(
                  `Reference ${index + 1} Contact`
                )
              }

            }
          )
        }

        // ════════════════════════════════════════
        // STEP 10 — AGREEMENTS
        // ════════════════════════════════════════

        const agreementsMissing:string[] = []

        if (
          !agreements
            ?.terms_accepted
        ) {
          agreementsMissing.push(
            'Terms & Conditions'
          )
        }

        if (
          !agreements
            ?.privacy_accepted
        ) {
          agreementsMissing.push(
            'Privacy Policy'
          )
        }

        if (
          !agreements
            ?.conduct_accepted
        ) {
          agreementsMissing.push(
            'Code of Conduct'
          )
        }

        if (
          !agreements
            ?.care_standards_accepted
        ) {
          agreementsMissing.push(
            'Care Standards'
          )
        }

        if (
          !agreements
            ?.background_check_accepted
        ) {
          agreementsMissing.push(
            'Background Check Consent'
          )
        }

        // ════════════════════════════════════════
        // BUILD REVIEW SECTIONS
        // ════════════════════════════════════════

        const reviewSections:ReviewSection[] = [

          // ─────────────────────
          // STEP 1
          // ─────────────────────
          {
            step:1,

            title:
              'Personal Information',

            complete:
              personalMissing.length === 0,

            missing:
              personalMissing,

            items:[
              profile?.full_name
                || 'Name not provided',

              profile?.email
                || 'Email not provided',

              profile?.phone
                || 'Phone not provided',

              profile?.nic
                ? `NIC: ${profile.nic}`
                : '',

              [
                profile?.address,
                profile?.city,
                profile?.district
              ]
                .filter(Boolean)
                .join(', ')
            ].filter(Boolean)
          },

          // ─────────────────────
          // STEP 2
          // ─────────────────────
          {
            step:2,

            title:
              'Professional Profile',

            complete:
              professionalMissing.length === 0,

            missing:
              professionalMissing,

            items:[
              agentDetails
                ?.professional_headline
                || 'Headline not provided',

              agentDetails
                ?.experience_years != null
                ? `${agentDetails.experience_years} years experience`
                : 'Experience not provided',

              Array.isArray(
                agentDetails?.languages
              )
                ? agentDetails.languages.join(', ')
                : ''
            ].filter(Boolean)
          },

          // ─────────────────────
          // STEP 3
          // ─────────────────────
          {
            step:3,

            title:
              'Skills & Services',

            complete:
              skillsMissing.length === 0,

            missing:
              skillsMissing,

            items:
              skills?.map(
                (
                  skill:{
                    service_name?:string
                    skill_level?:string
                    experience_years?:string
                    certified?:boolean
                  }
                ) => {

                  const service =
                    skill.service_name ||
                    'Service'

                  const level =
                    skill.skill_level
                      ? ` · ${skill.skill_level}`
                      : ''

                  const certified =
                    skill.certified
                      ? ' · Certified'
                      : ''

                  return (
                    `${service}${level}${certified}`
                  )
                }
              ) || []
          },

          // ─────────────────────
          // STEP 4
          // ─────────────────────
          {
            step:4,

            title:
              'Certifications',

            complete:
              certificationMissing.length === 0,

            missing:
              certificationMissing,

            items:
              certifications?.map(
                (
                  cert:{
                    doc_type:string
                    issue_date?:string
                    expiry_date?:string
                  }
                ) => {

                  const name =
                    formatDocumentType(
                      cert.doc_type
                    )

                  return `${name} ✓`
                }
              ) || []
          },

          // ─────────────────────
          // STEP 5
          // ─────────────────────
          {
            step:5,

            title:
              'Identity Verification',

            complete:
              identityMissing.length === 0,

            missing:
              identityMissing,

            items:
              requiredIdentityTypes.map(
                type => {

                  const exists =
                    identityTypes.includes(
                      type
                    )

                  const label =
                    type === 'nic-front'
                      ? 'NIC Front'

                      : type === 'nic-back'
                        ? 'NIC Back'

                        : type ===
                          'police-clearance-certificate'
                          ? 'Police Clearance'

                          : 'Medical Certificate'

                  return (
                    `${label} ${
                      exists
                        ? '✓'
                        : '– Missing'
                    }`
                  )
                }
              )
          },

          // ─────────────────────
          // STEP 6
          // ─────────────────────
          {
            step:6,

            title:
              'Banking & Payouts',

            complete:
              bankingMissing.length === 0,

            missing:
              bankingMissing,

            items:[
              bankAccount?.bank_name
                || 'Bank not provided',

              bankAccount?.branch
                ? `Branch: ${bankAccount.branch}`
                : '',

              bankAccount?.account_name
                || '',

              bankAccount?.account_number
                ? `Account: ••••${String(
                    bankAccount.account_number
                  ).slice(-4)}`
                : '',

              bankAccount
                ?.payout_preference
                || '',

              bankAccount
                ?.verification_status
                ? `Verification: ${
                    formatLabel(
                      bankAccount
                        .verification_status
                    )
                  }`
                : ''
            ].filter(Boolean)
          },

          // ─────────────────────
          // STEP 7
          // ─────────────────────
          {
            step:7,

            title:
              'Availability',

            complete:
              availabilityMissing.length === 0,

            missing:
              availabilityMissing,

            items:[
              Array.isArray(
                availability?.working_days
              )
                ? availability
                    .working_days
                    .join(', ')
                : '',

              availability
                ?.preferred_shift
                ? `${
                    formatLabel(
                      availability
                        .preferred_shift
                    )
                  } Shift`
                : '',

              availability
                ?.max_weekly_hours
                ? `${availability.max_weekly_hours} hrs/week max`
                : '',

              availability
                ?.emergency_available
                ? 'Emergency Available'
                : '',

              availability
                ?.holiday_available
                ? 'Holiday Available'
                : ''
            ].filter(Boolean)
          },

          // ─────────────────────
          // STEP 8
          // ─────────────────────
          {
            step:8,

            title:
              'Equipment & Transport',

            complete:
              equipmentMissing.length === 0,

            missing:
              equipmentMissing,

            items:[
              equipment?.has_car
                ? 'Car'
                : '',

              equipment?.has_motorbike
                ? 'Motorbike'
                : '',

              equipment?.has_three_wheeler
                ? 'Three-Wheeler'
                : '',

              equipment?.uses_public_transport
                ? 'Public Transport'
                : '',

              equipment
                ?.has_wheelchair_equipment
                ? 'Wheelchair Equipment'
                : '',

              equipment
                ?.has_medical_equipment
                ? 'Medical Equipment'
                : '',

              equipment
                ?.has_smartphone
                ? 'Smartphone ✓'
                : 'Smartphone – Missing',

              equipment
                ?.has_internet_access
                ? 'Internet Access ✓'
                : 'Internet Access – Missing'
            ].filter(Boolean)
          },

          // ─────────────────────
          // STEP 9
          // ─────────────────────
          {
            step:9,

            title:
              'References',

            complete:
              referencesMissing.length === 0,

            missing:
              referencesMissing,

            items:
              references?.map(
                (
                  reference:{
                    full_name?:string
                    organisation?:string
                  }
                ) => {

                  const name =
                    reference.full_name ||
                    'Unnamed Reference'

                  const org =
                    reference.organisation
                      ? ` – ${reference.organisation}`
                      : ''

                  return (
                    `${name}${org}`
                  )
                }
              ) || []
          },

          // ─────────────────────
          // STEP 10
          // ─────────────────────
          {
            step:10,

            title:
              'Agreements',

            complete:
              agreementsMissing.length === 0,

            missing:
              agreementsMissing,

            items:[
              `Terms & Conditions ${
                agreements?.terms_accepted
                  ? '✓'
                  : '– Pending'
              }`,

              `Privacy Policy ${
                agreements?.privacy_accepted
                  ? '✓'
                  : '– Pending'
              }`,

              `Code of Conduct ${
                agreements?.conduct_accepted
                  ? '✓'
                  : '– Pending'
              }`,

              `Care Standards ${
                agreements
                  ?.care_standards_accepted
                  ? '✓'
                  : '– Pending'
              }`,

              `Background Check Consent ${
                agreements
                  ?.background_check_accepted
                  ? '✓'
                  : '– Pending'
              }`
            ]
          }

        ]

        setSections(
          reviewSections
        )

      } catch (error) {

        console.error(
          'Failed to load application review:',
          error
        )

        if (!cancelled) {
          setErrorMessage(
            'Failed to load your application review'
          )
        }

      } finally {

        if (!cancelled) {
          setLoading(false)
        }

      }
    }

    loadReview()

    return () => {
      cancelled = true
    }

  }, [])

  // ─────────────────────────────────────────────
  // Completion score
  // ─────────────────────────────────────────────

  const completedCount =
    sections.filter(
      section =>
        section.complete
    ).length

  const score =
    sections.length > 0
      ? Math.round(
          (
            completedCount /
            sections.length
          ) * 100
        )
      : 0

  const allComplete =
    sections.length === 10 &&
    sections.every(
      section =>
        section.complete
    )

  const incompleteSections =
    sections.filter(
      section =>
        !section.complete
    )

  // ─────────────────────────────────────────────
  // Final submit
  // ─────────────────────────────────────────────
  const handleSubmit =
    async () => {

      try {

        if (
          submitting
        ) {
          return
        }

        setErrorMessage('')

        if (
          !allComplete
        ) {
          throw new Error(
            'Please complete all required sections before submitting your application'
          )
        }

        setSubmitting(
          true
        )

        await submitMyCareAgentApplication()

        onSubmit()

      } catch (error) {

        console.error(
          'Failed to submit application:',
          error
        )

        if (
          error instanceof Error
        ) {
          setErrorMessage(
            error.message
          )
        } else {
          setErrorMessage(
            'Failed to submit application'
          )
        }

      } finally {

        setSubmitting(
          false
        )

      }
    }

  // ─────────────────────────────────────────────
  // Loading
  // ─────────────────────────────────────────────
  if (loading) {

    return (
      <StepWrap
        step={11}
        total={11}
        title="Review & Submit"
        desc="Review your application before submitting. You can edit any section."
        onBack={onBack}
        onNext={() => {}}
        nextDisabled={true}
        maxWidth={1040}
      >

        <Card
          style={{
            padding:30,
            textAlign:
              'center' as const
          }}
        >

          <p
            style={{
              fontSize:13,
              color:C.muted
            }}
          >
            Loading your application...
          </p>

        </Card>

      </StepWrap>
    )
  }

  return (
    <StepWrap
      step={11}
      total={11}
      title="Review & Submit"
      desc="Review your application before submitting. You can edit any section."
      onBack={onBack}
      onNext={handleSubmit}
      nextLabel={
        submitting
          ? 'Submitting...'

          : allComplete
            ? 'Submit Application →'

            : 'Complete Required Sections'
      }
      nextDisabled={
        !allComplete ||
        submitting
      }
      maxWidth={1040}
    >

      {/* Application Score */}
      <Card
        style={{
          padding:24,
          marginBottom:20,

          background:
            `linear-gradient(
              135deg,
              ${C.primary}06,
              ${C.primary}02
            )`,

          border:
            `1px solid ${C.primary}20`
        }}
      >

        <div
          style={{
            display:'flex',
            justifyContent:
              'space-between',
            alignItems:'center',
            marginBottom:12,
            gap:20
          }}
        >

          <div>

            <p
              style={{
                fontSize:16,
                fontWeight:900,
                color:C.type,

                fontFamily:
                  'Manrope,sans-serif',

                marginBottom:4
              }}
            >
              Application Score
            </p>

            <p
              style={{
                fontSize:12,
                color:C.muted
              }}
            >
              {completedCount} of {sections.length} sections complete
            </p>

          </div>

          <div
            style={{
              textAlign:
                'center' as const
            }}
          >

            <p
              style={{
                fontSize:40,
                fontWeight:900,

                color:
                  allComplete
                    ? C.success
                    : C.warning,

                fontFamily:
                  'Manrope,sans-serif',

                lineHeight:1,
                marginBottom:6
              }}
            >
              {score}%
            </p>

            <Bdg
              label={
                allComplete
                  ? 'Ready to Submit'
                  : `${incompleteSections.length} Need Attention`
              }

              color={
                allComplete
                  ? C.success
                  : C.warning
              }
            />

          </div>

        </div>

        {/* Progress */}
        <div
          style={{
            height:8,
            borderRadius:99,

            background:
              'rgba(0,115,122,0.1)',

            overflow:'hidden'
          }}
        >
          <div
            style={{
              width:
                `${score}%`,

              height:'100%',

              background:
                `linear-gradient(
                  90deg,
                  ${C.primary},
                  ${C.success}
                )`,

              borderRadius:99,

              transition:
                'width 0.4s'
            }}
          />
        </div>

      </Card>

      {/* Ready */}
      {allComplete && (
        <Card
          style={{
            padding:18,
            marginBottom:20,

            border:
              `1.5px solid ${C.success}35`,

            background:
              `${C.success}05`
          }}
        >

          <div
            style={{
              display:'flex',
              gap:10,
              alignItems:
                'flex-start'
            }}
          >

            <span
              style={{
                color:C.success,
                display:'flex'
              }}
            >
              {I.check}
            </span>

            <div>

              <p
                style={{
                  fontSize:13,
                  fontWeight:800,
                  color:C.success
                }}
              >
                Your application is ready
              </p>

              <p
                style={{
                  fontSize:12,
                  color:C.muted,
                  lineHeight:1.6,
                  marginTop:3
                }}
              >
                All required onboarding sections are complete.
                You can now submit your application for ReadyPal review.
              </p>

            </div>

          </div>

        </Card>
      )}

      {/* Action Required */}
      {!allComplete &&
        incompleteSections.length > 0 && (

        <Card
          style={{
            padding:18,
            marginBottom:20,

            border:
              `1.5px solid ${C.warning}40`,

            background:
              `${C.warning}05`
          }}
        >

          <div
            style={{
              display:'flex',
              gap:10,
              alignItems:
                'flex-start'
            }}
          >

            <span
              style={{
                color:C.warning,
                display:'flex',
                marginTop:1
              }}
            >
              {I.warning}
            </span>

            <div>

              <p
                style={{
                  fontSize:13,
                  fontWeight:700,
                  color:C.warning
                }}
              >
                Action Required
              </p>

              <p
                style={{
                  fontSize:12,
                  color:C.muted,
                  marginTop:3,
                  lineHeight:1.6
                }}
              >
                Please complete the following sections before submitting:
              </p>

              <div
                style={{
                  display:'flex',
                  flexWrap:'wrap',
                  gap:6,
                  marginTop:8
                }}
              >

                {incompleteSections.map(
                  section => (

                    <button
                      type="button"

                      key={
                        section.step
                      }

                      onClick={() =>
                        onGoto(
                          section.step
                        )
                      }

                      style={{
                        padding:'5px 9px',
                        borderRadius:8,

                        border:
                          `1px solid ${C.warning}30`,

                        background:
                          `${C.warning}05`,

                        color:C.warning,

                        cursor:'pointer',

                        fontSize:11,
                        fontWeight:700,

                        fontFamily:
                          'Manrope,sans-serif'
                      }}
                    >
                      Step {section.step}:{' '}
                      {section.title}
                    </button>

                  )
                )}

              </div>

            </div>

          </div>

        </Card>
      )}

      {/* Review sections */}
      <div
        style={{
          display:'flex',
          flexDirection:'column',
          gap:12
        }}
      >

        {sections.map(
          section => (

            <Card
              key={
                section.step
              }

              style={{
                padding:18,

                border:
                  `1.5px solid ${
                    section.complete
                      ? C.border
                      : C.warning + '35'
                  }`,

                background:
                  section.complete
                    ? C.surface
                    : `${C.warning}02`
              }}
            >

              <div
                style={{
                  display:'flex',
                  gap:12,
                  alignItems:
                    'flex-start'
                }}
              >

                {/* Status */}
                <div
                  style={{
                    width:26,
                    height:26,

                    borderRadius:'50%',

                    border:
                      `1.5px solid ${
                        section.complete
                          ? C.success
                          : C.warning
                      }`,

                    display:'flex',
                    alignItems:'center',
                    justifyContent:
                      'center',

                    color:
                      section.complete
                        ? C.success
                        : C.warning,

                    flexShrink:0
                  }}
                >

                  {section.complete
                    ? I.check
                    : '!'}

                </div>

                <div
                  style={{
                    flex:1,
                    minWidth:0
                  }}
                >

                  {/* Heading */}
                  <div
                    style={{
                      display:'flex',
                      justifyContent:
                        'space-between',
                      alignItems:'center',
                      gap:12,
                      marginBottom:8
                    }}
                  >

                    <div>

                      <p
                        style={{
                          fontSize:13,
                          fontWeight:800,
                          color:C.type
                        }}
                      >
                        {section.title}
                      </p>

                      <p
                        style={{
                          fontSize:10,

                          color:
                            section.complete
                              ? C.success
                              : C.warning,

                          fontWeight:700,
                          marginTop:2
                        }}
                      >
                        {section.complete
                          ? 'Complete'
                          : 'Needs Attention'}
                      </p>

                    </div>

                    <button
                      type="button"

                      onClick={() =>
                        onGoto(
                          section.step
                        )
                      }

                      style={{
                        padding:'6px 10px',
                        borderRadius:8,

                        background:
                          `${C.primary}05`,

                        border:
                          `1px solid ${C.primary}15`,

                        color:C.primary,

                        cursor:'pointer',

                        fontSize:12,
                        fontWeight:700,

                        fontFamily:
                          'Manrope,sans-serif'
                      }}
                    >
                      Edit
                    </button>

                  </div>

                  {/* Saved items */}
                  {section.items.length > 0 && (
                    <div
                      style={{
                        display:'flex',
                        flexWrap:'wrap',
                        gap:6
                      }}
                    >

                      {section.items.map(
                        (
                          item,
                          index
                        ) => (

                          <span
                            key={index}

                            style={{
                              padding:
                                '4px 8px',

                              borderRadius:7,

                              background:C.bg,

                              color:C.muted,

                              fontSize:11,
                              lineHeight:1.4
                            }}
                          >
                            {item}
                          </span>

                        )
                      )}

                    </div>
                  )}

                  {/* Missing */}
                  {!section.complete && (
                    <div
                      style={{
                        marginTop:10,
                        padding:'8px 10px',

                        background:
                          `${C.error}04`,

                        borderRadius:8
                      }}
                    >

                      <p
                        style={{
                          fontSize:10,
                          fontWeight:800,
                          color:C.error,
                          marginBottom:4,

                          textTransform:
                            'uppercase',

                          letterSpacing:
                            '0.05em'
                        }}
                      >
                        Missing
                      </p>

                      {section.missing.map(
                        (
                          item,
                          index
                        ) => (

                          <p
                            key={index}

                            style={{
                              fontSize:11,
                              color:C.error,

                              marginTop:
                                index === 0
                                  ? 0
                                  : 3
                            }}
                          >
                            • {item}
                          </p>

                        )
                      )}

                    </div>
                  )}

                </div>

              </div>

            </Card>

          )
        )}

      </div>

      {/* Final submit information */}
      <Card
        style={{
          padding:18,
          marginTop:20,

          background:
            `${C.info}04`,

          border:
            `1px solid ${C.info}18`
        }}
      >

        <p
          style={{
            fontSize:12,
            fontWeight:800,
            color:C.type,
            marginBottom:5
          }}
        >
          What happens after submission?
        </p>

        <p
          style={{
            fontSize:11,
            color:C.muted,
            lineHeight:1.7
          }}
        >
          Your application will move to Under Review.
          ReadyPal administrators can then review your identity
          documents, certifications, bank details, references,
          and other verification information. Completing this
          application does not mean those documents are already verified.
        </p>

      </Card>

      {/* Submit error */}
      {errorMessage && (
        <div
          style={{
            padding:'12px 14px',
            marginTop:16,

            borderRadius:10,

            background:
              `${C.error}08`,

            border:
              `1px solid ${C.error}30`,

            color:C.error,

            fontSize:12,
            fontWeight:600
          }}
        >
          {errorMessage}
        </div>
      )}

    </StepWrap>
  )
}



// ─── Application Submitted ────────────────────────────────────────────────────
function ApplicationSubmitted({ onStatus }:{ onStatus:()=>void }) {
  return (
    <PageContainer maxWidth={760} style={{ padding:'60px 36px', textAlign:'center' as const }}>
      <div style={{ width:80, height:80, borderRadius:'50%', background:`${C.success}10`, border:`3px solid ${C.success}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', fontSize:40 }}>🎉</div>
      <h1 style={{ fontSize:28, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:10 }}>Application Submitted!</h1>
      <p style={{ fontSize:15, color:C.muted, lineHeight:1.7, marginBottom:32 }}>Congratulations, Kasun! Your application has been received and is under review by the ReadyPal verification team.</p>

      <Card style={{ padding:22, marginBottom:20, textAlign:'left' as const }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
          <p style={{ fontSize:12, fontWeight:700, color:C.muted }}>Application Reference</p>
          <p style={{ fontSize:13, fontWeight:800, fontFamily:'monospace', color:C.primary }}>RP-AGT-2025-08741</p>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
          <p style={{ fontSize:12, fontWeight:700, color:C.muted }}>Submitted</p>
          <p style={{ fontSize:13, color:C.type }}>14 January 2025</p>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between' }}>
          <p style={{ fontSize:12, fontWeight:700, color:C.muted }}>Estimated Review</p>
          <p style={{ fontSize:13, color:C.type }}>3–5 working days</p>
        </div>
      </Card>

      {/* Timeline */}
      <Card style={{ padding:22, marginBottom:24, textAlign:'left' as const }}>
        <p style={{ fontSize:13, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:16 }}>Approval Process</p>
        {[
          { icon:'📋', l:'Application Received',    t:'Completed',   color:C.success },
          { icon:'🔍', l:'Document Verification',   t:'In Progress', color:C.primary },
          { icon:'🏛️', l:'Background Check',        t:'Pending',     color:C.muted },
          { icon:'📞', l:'Reference Check',          t:'Pending',     color:C.muted },
          { icon:'✅', l:'Final Approval',           t:'Pending',     color:C.muted },
        ].map((step,i,arr)=>(
          <div key={i} style={{ display:'flex', gap:14 }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
              <div style={{ width:36, height:36, borderRadius:11, background:`${step.color}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>{step.icon}</div>
              {i<arr.length-1&&<div style={{ width:2, flex:1, background:C.border, margin:'3px 0' }} />}
            </div>
            <div style={{ paddingBottom:i<arr.length-1?14:0, paddingTop:4 }}>
              <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{step.l}</p>
              <p style={{ fontSize:11, fontWeight:700, color:step.color }}>{step.t}</p>
            </div>
          </div>
        ))}
      </Card>

      <Card style={{ padding:20, marginBottom:24, background:`${C.primary}06`, border:`1px solid ${C.primary}20`, textAlign:'left' as const }}>
        <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:6 }}>Next Steps</p>
        <ul style={{ paddingLeft:18, margin:0 }}>
          {['We will email you at kasun.p@email.lk within 3–5 days','If additional documents are needed, you will be notified via SMS','Once approved, you can set up your public profile and start accepting requests'].map((s,i)=>(
            <li key={i} style={{ fontSize:12, color:C.sub, lineHeight:1.75 }}>{s}</li>
          ))}
        </ul>
      </Card>

      <p style={{ fontSize:12, color:C.muted, marginBottom:20 }}>Questions? Contact support at agents@readypal.lk or call +94 11 234 5678.</p>
      <Btn label="View Application Status" onClick={onStatus} />
    </PageContainer>
  )
}

// ─── Application Status ───────────────────────────────────────────────────────
const SUBMITTED_APPLICATION_STATUSES = ['submitted','under_review','approved','rejected']

const APPLICATION_STATUS_META:Record<string,{ title:string; message:string; icon:string }> = {
  submitted: {
    title:'Application Submitted',
    message:'Your application has been received successfully and is waiting to enter the review process.',
    icon:'📤',
  },
  under_review: {
    title:'Application Under Review',
    message:'The ReadyPal team is currently reviewing your application and verification documents.',
    icon:'🔍',
  },
  approved: {
    title:'Application Approved',
    message:'Your Care Agent application has been approved.',
    icon:'✅',
  },
  rejected: {
    title:'Application Needs Attention',
    message:'Your application was not approved at this time.',
    icon:'⚠️',
  },
}

type TimelineStageState = 'done'|'active'|'pending'

function applicationTimeline(status:string):{ label:string; state:TimelineStageState }[] {
  if (status === 'approved') {
    return [
      { label:'Registration Completed', state:'done' },
      { label:'Application Submitted',  state:'done' },
      { label:'Application Review',     state:'done' },
      { label:'Approved',               state:'done' },
    ]
  }
  if (status === 'rejected') {
    return [
      { label:'Registration Completed', state:'done' },
      { label:'Application Submitted',  state:'done' },
      { label:'Application Review',     state:'done' },
      { label:'Decision Issued',        state:'active' },
    ]
  }
  if (status === 'under_review') {
    return [
      { label:'Registration Completed', state:'done' },
      { label:'Application Submitted',  state:'done' },
      { label:'Application Review',     state:'active' },
      { label:'Final Decision',         state:'pending' },
    ]
  }
  // submitted
  return [
    { label:'Registration Completed', state:'done' },
    { label:'Application Submitted',  state:'done' },
    { label:'Application Review',     state:'pending' },
    { label:'Final Decision',         state:'pending' },
  ]
}

function applicationNextSteps(status:string):string {
  if (status === 'approved') {
    return "Congratulations! Our team will reach out with the next steps to get you started on the ReadyPal platform."
  }
  if (status === 'rejected') {
    return "Your application was not approved at this time. If you have questions about this decision, please contact ReadyPal support."
  }
  return "Your application is being processed by our verification team. We'll update this page as soon as a decision has been made — no action is needed from you right now."
}

function formatApplicationDate(value:string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })
}

function TimelineStageIcon({ state }:{ state:TimelineStageState }) {
  if (state === 'done') {
    return (
      <div style={{ width:26, height:26, borderRadius:'50%', background:C.success, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:'#fff' }}>
        <span style={{ display:'flex', transform:'scale(0.7)' }}>{I.check}</span>
      </div>
    )
  }
  if (state === 'active') {
    return (
      <div style={{ width:26, height:26, borderRadius:'50%', background:C.primary, border:`2px solid ${C.primary}`, flexShrink:0 }} />
    )
  }
  return (
    <div style={{ width:26, height:26, borderRadius:'50%', background:C.bg, border:`2px solid ${C.border}`, flexShrink:0 }} />
  )
}

function ApplicationStatus({ onHome }:{ onHome:()=>void }) {
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [agentDetails, setAgentDetails] = useState<any>(null)

  useEffect(() => {
    let cancelled = false

    const loadApplicationStatus = async () => {
      try {
        setLoading(true)
        setErrorMessage('')

        const details = await getMyAgentDetails()

        if (cancelled) return

        setAgentDetails(details)

      } catch (error) {
        if (cancelled) return

        console.error('Failed to load application status:', error)
        setErrorMessage('We couldn\'t load your application status. Please try again.')

      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadApplicationStatus()

    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <PageContainer maxWidth={920} style={{ padding:'32px 36px 80px' }}>
        <Card style={{ padding:30, textAlign:'center' as const }}>
          <p style={{ fontSize:13, color:C.muted }}>Loading your application status...</p>
        </Card>
      </PageContainer>
    )
  }

  if (errorMessage) {
    return (
      <PageContainer maxWidth={920} style={{ padding:'32px 36px 80px' }}>
        <Card style={{ padding:30, textAlign:'center' as const }}>
          <p style={{ fontSize:13, fontWeight:700, color:C.error, marginBottom:6 }}>{errorMessage}</p>
          <p style={{ fontSize:12, color:C.muted, marginBottom:18 }}>Please check your connection and try again.</p>
          <Btn label="Back to Onboarding Home" variant="secondary" onClick={onHome} />
        </Card>
      </PageContainer>
    )
  }

  const status:string|undefined = agentDetails?.application_status

  if (!status || !SUBMITTED_APPLICATION_STATUSES.includes(status)) {
    return (
      <PageContainer maxWidth={920} style={{ padding:'32px 36px 80px' }}>
        <Card style={{ padding:30, textAlign:'center' as const }}>
          <p style={{ fontSize:15, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>No submitted application yet</p>
          <p style={{ fontSize:13, color:C.muted, marginBottom:18 }}>You haven't submitted your Care Agent application yet. Complete your registration to submit it for review.</p>
          <Btn label="Back to Onboarding Home" onClick={onHome} />
        </Card>
      </PageContainer>
    )
  }

  const meta = APPLICATION_STATUS_META[status]
  const color = APPLICATION_STATUS_COLOR[status] ?? C.primary
  const submittedAt:string|null = agentDetails?.submitted_at ?? null
  const rejectionReason:string|null = agentDetails?.rejection_reason ?? null
  const timeline = applicationTimeline(status)

  return (
    <PageContainer maxWidth={920} style={{ padding:'32px 36px 80px' }}>
      <div style={{ marginBottom:28 }}>
        <h2 style={{ fontSize:24, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Application Status</h2>
        <p style={{ fontSize:14, color:C.muted }}>Track the progress of your Care Agent application.</p>
      </div>

      {/* Current status */}
      <Card style={{ padding:24, marginBottom:20, background:`linear-gradient(135deg,${color}08,${color}02)`, border:`1px solid ${color}20` }}>
        <div style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
          <div style={{ width:52, height:52, borderRadius:16, background:`${color}12`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0 }}>{meta.icon}</div>
          <div>
            <p style={{ fontSize:11, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>{formatStatusLabel(status)}</p>
            <p style={{ fontSize:19, fontWeight:900, color, fontFamily:'Manrope,sans-serif', marginBottom:8 }}>{meta.title}</p>
            <p style={{ fontSize:13, color:C.sub, lineHeight:1.6 }}>{meta.message}</p>
            {status === 'rejected' && rejectionReason && (
              <p style={{ fontSize:13, color:C.type, lineHeight:1.6, marginTop:10, padding:'10px 12px', borderRadius:10, background:`${C.error}08` }}>{rejectionReason}</p>
            )}
            {submittedAt && (
              <p style={{ fontSize:12, color:C.muted, marginTop:10 }}>Submitted {formatApplicationDate(submittedAt)}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Timeline */}
      <Card style={{ padding:24, marginBottom:20 }}>
        <p style={{ fontSize:13, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:16 }}>Application Progress</p>
        {timeline.map((stage,i)=>(
          <div key={stage.label} style={{ display:'flex', gap:14 }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
              <TimelineStageIcon state={stage.state} />
              {i<timeline.length-1&&<div style={{ width:2, flex:1, background:C.border, margin:'3px 0' }} />}
            </div>
            <div style={{ paddingBottom:i<timeline.length-1?18:0, paddingTop:3 }}>
              <p style={{ fontSize:13, fontWeight:700, color:stage.state==='pending'?C.muted:C.type }}>{stage.label}</p>
            </div>
          </div>
        ))}
      </Card>

      {/* Application details */}
      <Card style={{ padding:22, marginBottom:20 }}>
        <p style={{ fontSize:12, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:14 }}>Application Details</p>
        <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:`1px solid ${C.border}` }}>
          <p style={{ fontSize:13, color:C.muted }}>Application Status</p>
          <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{formatStatusLabel(status)}</p>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 0' }}>
          <p style={{ fontSize:13, color:C.muted }}>Submitted Date</p>
          <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{submittedAt ? formatApplicationDate(submittedAt) : '—'}</p>
        </div>
      </Card>

      {/* Next steps */}
      <Card style={{ padding:22, marginBottom:24, background:`${C.primary}05`, border:`1px solid ${C.primary}15` }}>
        <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:6 }}>What happens next?</p>
        <p style={{ fontSize:12, color:C.sub, lineHeight:1.7 }}>{applicationNextSteps(status)}</p>
      </Card>

      <Btn label="Back to Onboarding Home" variant="secondary" onClick={onHome} />
    </PageContainer>
  )
}

// ─── Sub-view nav ─────────────────────────────────────────────────────────────
type SubView = 'home'|'wizard'|'status'

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function CareAgentOnboarding() {
  const [sub, setSub] = useState<SubView>('home')
  const [step, setStep] = useState(1)
  const [completed, setCompleted] = useState(new Set<number>())
  const [editingFromReview, setEditingFromReview] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [progressLoading, setProgressLoading] = useState(true)
  const [homeStatus, setHomeStatus] = useState<HomeStatus>({ kind:'new' })

  useEffect(() => {
    let cancelled = false
    const loadRegistrationProgress = async () => {
      try {
        setProgressLoading(true)
        const [
          profile,
          agentDetails,
          skills,
          certifications,
          identityDocs,
          bankAccount,
          availability,
          equipment,
          references,
          agreements
        ] = await Promise.all([

          getMyProfile(),
          getMyAgentDetails(),
          getMyAgentSkills(),
          getMyCertifications(),
          getMyIdentityDocuments(),
          getMyBankAccount(),
          getMyAvailability(),
          getMyEquipmentTransport(),
          getMyReferences(),
          getMyAgreements()
        ])

        if (cancelled) return

        // ─────────────────────────────
        // Already-submitted applications
        // ─────────────────────────────
        // The user still always lands on Onboarding Home — this only
        // determines what that home screen shows and where its
        // primary button routes to. `submitted` (session state) must
        // stay false here — it only means "just submitted this session".
        const applicationAlreadySubmitted =
          agentDetails?.application_status === 'submitted' ||
          agentDetails?.application_status === 'under_review' ||
          agentDetails?.application_status === 'approved' ||
          agentDetails?.application_status === 'rejected'

        const restoredCompleted =
          new Set<number>()

        // ─────────────────────────────
        // STEP 1 — Personal Information
        // ─────────────────────────────
        const step1Complete =
          Boolean(profile?.full_name?.trim()) &&
          Boolean(profile?.nic?.trim()) &&
          Boolean(profile?.date_of_birth) &&
          Boolean(profile?.email?.trim()) &&
          Boolean(profile?.phone?.trim()) &&
          Boolean(profile?.address?.trim()) &&
          Boolean(profile?.city?.trim())

        if (step1Complete) {
          restoredCompleted.add(1)
        }

        // ─────────────────────────────
        // STEP 2 — Professional Profile
        // ─────────────────────────────
        const step2Complete =
          Boolean(
            agentDetails
              ?.professional_headline
              ?.trim()
          ) &&
          Boolean(
            agentDetails
              ?.bio
              ?.trim()
          ) &&
          agentDetails
            ?.experience_years != null &&
          Array.isArray(
            agentDetails?.languages
          ) &&
          agentDetails.languages.length > 0

        if (step2Complete) {
          restoredCompleted.add(2)
        }

        // ─────────────────────────────
        // STEP 3 — Skills & Services
        // ─────────────────────────────
        const step3Complete =
          Array.isArray(skills) &&
          skills.length > 0

        if (step3Complete) {
          restoredCompleted.add(3)
        }

        // ─────────────────────────────
        // STEP 4 — Certifications
        // ─────────────────────────────
        const step4Complete =
          Array.isArray(certifications) &&
          certifications.length > 0

        if (step4Complete) {
          restoredCompleted.add(4)
        }

        // ─────────────────────────────
        // STEP 5 — Identity Verification
        // ─────────────────────────────
        const identityTypes =
          Array.isArray(identityDocs)
            ? identityDocs.map(
                (doc:any) =>
                  doc.doc_type
              )
            : []

        const requiredIdentityTypes = [
          'nic-front',
          'nic-back',
          'police-clearance-certificate',
          'medical-fitness-certificate'
        ]

        const step5Complete =
          requiredIdentityTypes.every(
            type =>
              identityTypes.includes(type)
          )

        if (step5Complete) {
          restoredCompleted.add(5)
        }

        // ─────────────────────────────
        // STEP 6 — Banking & Payouts
        // ─────────────────────────────
        const step6Complete =
          Boolean(
            bankAccount
              ?.bank_name
              ?.trim()
          ) &&
          Boolean(
            bankAccount
              ?.branch
              ?.trim()
          ) &&
          Boolean(
            bankAccount
              ?.account_name
              ?.trim()
          ) &&
          Boolean(
            bankAccount
              ?.account_number
              ?.trim()
          )

        if (step6Complete) {
          restoredCompleted.add(6)
        }

        // ─────────────────────────────
        // STEP 7 — Availability
        // ─────────────────────────────
        const step7Complete =
          Array.isArray(
            availability?.working_days
          ) &&
          availability.working_days.length > 0 &&
          Boolean(
            availability?.preferred_shift
          ) &&
          availability
            ?.max_weekly_hours != null &&
          availability.max_weekly_hours >= 10

        if (step7Complete) {
          restoredCompleted.add(7)
        }

        // ─────────────────────────────
        // STEP 8 — Equipment & Transport
        // ─────────────────────────────
        const step8Complete =
          equipment?.has_smartphone === true &&
          equipment?.has_internet_access === true

        if (step8Complete) {
          restoredCompleted.add(8)
        }

        // ─────────────────────────────
        // STEP 9 — References
        // ─────────────────────────────
        const validReferences =
          Array.isArray(references)
            ? references.filter(
                (reference:any) =>
                  Boolean(
                    reference
                      ?.full_name
                      ?.trim()
                  ) &&
                  Boolean(
                    reference
                      ?.organisation
                      ?.trim()
                  ) &&
                  Boolean(
                    reference
                      ?.relationship
                      ?.trim()
                  ) &&
                  (
                    Boolean(
                      reference
                        ?.phone
                        ?.trim()
                    ) ||
                    Boolean(
                      reference
                        ?.email
                        ?.trim()
                    )
                  )
              )
            : []

        const step9Complete =
          validReferences.length >= 2

        if (step9Complete) {
          restoredCompleted.add(9)
        }

        // ─────────────────────────────
        // STEP 10 — Agreements
        // ─────────────────────────────
        const step10Complete =
          agreements?.terms_accepted === true &&
          agreements?.privacy_accepted === true &&
          agreements?.conduct_accepted === true &&
          agreements?.care_standards_accepted === true &&
          agreements?.background_check_accepted === true

        if (step10Complete) {
          restoredCompleted.add(10)
        }

        setCompleted(
          restoredCompleted
        )

        const firstIncompleteStep = [
          1,2,3,4,5,6,7,8,9,10
        ].find(
          stepNumber =>
            !restoredCompleted.has(stepNumber)
        )

        if (firstIncompleteStep) {
          setStep(firstIncompleteStep)
        } else {
          setStep(11)
        }

        // ─────────────────────────────
        // Onboarding Home status
        // ─────────────────────────────
        // Onboarding Home is always shown on load; this decides which
        // of the four status cards it renders and where its primary
        // button routes to (the wizard `step` above is already set
        // correctly for cases A/B/C).
        if (applicationAlreadySubmitted) {
          setHomeStatus({
            kind:'submitted',
            applicationStatus: agentDetails?.application_status ?? 'submitted',
            submittedAt: agentDetails?.submitted_at ?? null
          })
        } else if (!firstIncompleteStep) {
          setHomeStatus({ kind:'ready' })
        } else if (restoredCompleted.size > 0) {
          setHomeStatus({
            kind:'incomplete',
            percent: Math.round((restoredCompleted.size / 10) * 100)
          })
        } else {
          setHomeStatus({ kind:'new' })
        }

      } catch (error) {

        console.error(
          'Failed to restore registration progress:',
          error
        )

        // Progress load fail unath
        // onboarding page eka block karanne naha.

      } finally {

        if (!cancelled) {
          setProgressLoading(false)
        }

      }
    }

    loadRegistrationProgress()

    return () => {
      cancelled = true
    }

  }, [])

  const advance = (n:number) => {
    setCompleted(p => new Set([...p, n]))

    if (editingFromReview) {
      setEditingFromReview(false)
      setStep(11)
      return
    }

    setStep(n + 1 < 12 ? n + 1 : 11)
  }

  const goTo = (n:number) => {
    setEditingFromReview(false)
    setStep(n)
  }

  const editFromReview = (n:number) => {
    setEditingFromReview(true)
    setStep(n)
  }

  // `step` is already restored to the right place (1, the first
  // incomplete step, or 11) by loadRegistrationProgress — this just
  // decides which sub-view Home's primary button opens.
  const handleHomePrimaryAction = () => {
    if (homeStatus.kind==='submitted') {
      setSub('status')
    } else {
      setSub('wizard')
    }
  }

  const renderStep = () => {
    if (submitted) return <ApplicationSubmitted onStatus={()=>setSub('status')} />
    switch(step) {
      case 1:  return <Step1 onBack={()=>setSub('home')} onNext={()=>advance(1)} />
      case 2:  return <Step2 onBack={()=>setStep(1)} onNext={()=>advance(2)} />
      case 3:  return <Step3 onBack={()=>setStep(2)} onNext={()=>advance(3)} />
      case 4:  return <Step4 onBack={()=>setStep(3)} onNext={()=>advance(4)} />
      case 5:  return <Step5 onBack={()=>setStep(4)} onNext={()=>advance(5)} />
      case 6:  return <Step6 onBack={()=>setStep(5)} onNext={()=>advance(6)} />
      case 7:  return <Step7 onBack={()=>setStep(6)} onNext={()=>advance(7)} />
      case 8:  return <Step8 onBack={()=>setStep(7)} onNext={()=>advance(8)} />
      case 9:  return <Step9 onBack={()=>setStep(8)} onNext={()=>advance(9)} />
      case 10: return <Step10 onBack={()=>setStep(9)} onNext={()=>advance(10)} />
      case 11: return (<Step11 onBack={() => setStep(10)} onGoto={editFromReview} onSubmit={() => setSubmitted(true)}/>)
      default: return <Step1 onBack={()=>setSub('home')} onNext={()=>advance(1)} />
    }
  }

  if (progressLoading) {
    return (
      <div
        style={{
          minHeight:'100vh',
          display:'flex',
          alignItems:'center',
          justifyContent:'center'
        }}
      >
        <p style={{ color:C.muted }}>
          Loading your registration...
        </p>
      </div>
    )
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:C.bg, fontFamily:'Manrope,sans-serif' }}>
      {/* Progress sidebar (wizard only) */}
      {sub==='wizard'&&!submitted&&(
        <ProgressSidebar current={step} onGoto={goTo} completed={completed} />
      )}

      {/* Main content */}
      <div style={{ flex:1, overflowY:'auto' }}>
        {sub==='home'   && <OnboardingHome status={homeStatus} onPrimary={handleHomePrimaryAction} />}
        {sub==='wizard' && renderStep()}
        {sub==='status' && <ApplicationStatus onHome={()=>setSub('home')} />}
      </div>
    </div>
  )
}
