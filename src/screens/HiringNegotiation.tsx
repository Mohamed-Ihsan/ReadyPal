import { useState, useEffect, type ReactNode, type CSSProperties } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { getCareRequestDetail, getApplicationsForRequest, updateApplicationStatus, hireApplication } from '../lib/api'

// ─── Brand ────────────────────────────────────────────────────────────────────
const C = {
  primary:'#00737A', accent:'#EE8153', type:'#2C3E43', sub:'#6B7E85',
  muted:'#9AAAB0', border:'#E4E8EA', bg:'#F2F4F5', surface:'#FFFFFF',
  success:'#22C55E', warning:'#F59E0B', error:'#EF4444', info:'#3B82F6',
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const I: Record<string, ReactNode> = {
  check:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5l3 3 6-6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  close:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 2l9 9M11 2L2 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  chevronR:  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l5 4-5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevronL:  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3l-5 4 5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevronD:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M3 5l3.5 4L10 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  star:      <svg width="13" height="13" viewBox="0 0 13 13" fill="#F59E0B"><path d="M6.5 1l1.6 3.2 3.5.5-2.55 2.48.6 3.5L6.5 9l-3.15 1.68.6-3.5L1.4 4.7l3.5-.5z"/></svg>,
  shield:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1l4.5 1.6v3.5C11 9.5 9 11.5 6.5 12.5 4 11.5 2 9.5 2 6.1V2.6L6.5 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  medal:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="8.5" r="4" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 4.8 3 1.5h7l-1.5 3.3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  pin:       <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1A3.5 3.5 0 0 1 10 4.5C10 7.5 6.5 12 6.5 12S3 7.5 3 4.5A3.5 3.5 0 0 1 6.5 1z" stroke="currentColor" strokeWidth="1.2"/><circle cx="6.5" cy="4.5" r="1.2" stroke="currentColor" strokeWidth="1.1"/></svg>,
  clock:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M6.5 4V7l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  bolt:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M7.5 1.5L3.5 7.5h4.5l-2 4 6-7H7.5l1-3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  briefcase: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1.5" y="4.5" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 4.5V3A1.5 1.5 0 0 1 6 1.5h1A1.5 1.5 0 0 1 8.5 3v1.5M1.5 8h10" stroke="currentColor" strokeWidth="1.2"/></svg>,
  lang:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M6.5 1.5s-2 2-2 5 2 5 2 5M6.5 1.5s2 2 2 5-2 5-2 5M1.5 6.5h10" stroke="currentColor" strokeWidth="1"/></svg>,
  heart:     <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 12.5s-5.5-3.5-5.5-7A3.5 3.5 0 0 1 7 3.2 3.5 3.5 0 0 1 12.5 5c0 3.5-5.5 7-5.5 7z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  heartFill: <svg width="14" height="14" viewBox="0 0 14 14" fill={C.error}><path d="M7 12.5s-5.5-3.5-5.5-7A3.5 3.5 0 0 1 7 3.2 3.5 3.5 0 0 1 12.5 5c0 3.5-5.5 7-5.5 7z"/></svg>,
  compare:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5h9M8 4l3 2.5L8 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  send:      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M12.5 1.5L1.5 6l5 1.5m6-6L7.5 12.5 6.5 7.5m6-6L6.5 7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  mail:      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="3" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M1.5 5l6 4 6-4" stroke="currentColor" strokeWidth="1.3"/></svg>,
  doc:       <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M7.5 1.5H3A1.5 1.5 0 0 0 1.5 3v7A1.5 1.5 0 0 0 3 11.5h7A1.5 1.5 0 0 0 11.5 10V5L7.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M7.5 1.5V5H11.5M4.5 7h4M4.5 9h2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  calendar:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1.5" y="2.5" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 6h10M4.5 1.5V3M8.5 1.5V3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  ai:        <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1l1.2 2.4L10.5 5l-2.8 1.3L6.5 9 5.3 6.3 2.5 5l2.8-1.4L6.5 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  info:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M6.5 6v3.5M6.5 4.5V5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  warning:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2L1.5 11h10L6.5 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M6.5 6v2M6.5 10v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  refresh:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M11.5 6.5a5 5 0 1 1-1.1-3.1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M11.5 3v2.5H9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  user:      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5" r="2.8" stroke="currentColor" strokeWidth="1.3"/><path d="M1.5 13c0-3 2.5-5.5 5.5-5.5S12.5 10 12.5 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  award:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 8l-1.5 4.5 3.5-2 3.5 2L8.5 8" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/></svg>,
  tag:       <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 1.5h5.5l5 5-5.5 5.5-5-5V1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><circle cx="4" cy="4" r="1" fill="currentColor"/></svg>,
  trash:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 3.5h9M5 3.5V2.5h3V3.5M3.5 3.5l.7 7.5h4.6l.7-7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  plus:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2v9M2 6.5h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  confetti:  <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="8" cy="8" r="2" fill="#EE8153"/><circle cx="24" cy="6" r="1.5" fill="#00737A"/><circle cx="6" cy="22" r="1.5" fill="#F59E0B"/><circle cx="26" cy="24" r="2" fill="#3B82F6"/><rect x="13" y="4" width="3" height="3" rx="1" fill="#22C55E" transform="rotate(20 13 4)"/><rect x="20" y="20" width="3" height="3" rx="1" fill="#EE8153" transform="rotate(-15 20 20)"/><rect x="4" y="14" width="2" height="4" rx="1" fill="#8B5CF6" transform="rotate(30 4 14)"/><rect x="25" y="13" width="2" height="4" rx="1" fill="#F59E0B" transform="rotate(-25 25 13)"/></svg>,
}

// ─── Shared ───────────────────────────────────────────────────────────────────
function Card({ children, style={}, hover=false, onClick }: { children:ReactNode; style?:CSSProperties; hover?:boolean; onClick?:()=>void }) {
  const [h, setH] = useState(false)
  return (
    <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ background:C.surface, borderRadius:16, border:`1px solid ${h&&hover?C.primary+'40':C.border}`, boxShadow:h&&hover?'0 8px 28px rgba(44,62,67,0.11)':'0 1px 4px rgba(44,62,67,0.06)', transition:'all 0.2s', transform:h&&hover?'translateY(-2px)':undefined, cursor:onClick?'pointer':undefined, ...style }}>
      {children}
    </div>
  )
}

function Btn({ label, icon, onClick, variant='primary', small=false, disabled=false }: { label:string; icon?:ReactNode; onClick?:()=>void; variant?:'primary'|'secondary'|'ghost'|'danger'|'accent'; small?:boolean; disabled?:boolean }) {
  const [h, setH] = useState(false)
  const s: Record<string,CSSProperties> = {
    primary:   { background:disabled?'#C8D0D4':h?'#005D63':C.primary, color:'#fff', border:'none', boxShadow:disabled?'none':h?`0 4px 16px ${C.primary}50`:`0 2px 8px ${C.primary}30` },
    secondary: { background:h?'#EEF5F5':'#fff', color:C.primary, border:`1.5px solid ${h?C.primary:C.border}` },
    ghost:     { background:h?'#F2F4F5':'transparent', color:C.sub, border:'none' },
    danger:    { background:h?'#DC2626':C.error, color:'#fff', border:'none' },
    accent:    { background:h?'#D9703E':C.accent, color:'#fff', border:'none', boxShadow:h?`0 4px 16px ${C.accent}50`:`0 2px 8px ${C.accent}30` },
  }
  return (
    <button onClick={disabled?undefined:onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} disabled={disabled}
      style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:small?'6px 14px':'10px 20px', borderRadius:10, cursor:disabled?'not-allowed':'pointer', fontFamily:'Manrope,sans-serif', fontSize:small?12:13, fontWeight:700, transition:'all 0.15s', ...s[variant] }}>
      {icon&&<span style={{display:'flex'}}>{icon}</span>}{label}
    </button>
  )
}

function Bdg({ label, color=C.primary, bg, icon }: { label:string; color?:string; bg?:string; icon?:ReactNode }) {
  return <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 9px', borderRadius:999, fontSize:11, fontWeight:700, background:bg??`${color}14`, color, whiteSpace:'nowrap', fontFamily:'Manrope,sans-serif' }}>{icon&&<span style={{display:'flex'}}>{icon}</span>}{label}</span>
}

function Avatar({ name, size=44 }: { name:string; size?:number }) {
  const cols = ['#00737A','#EE8153','#3B82F6','#8B5CF6','#22C55E','#F59E0B']
  const c = cols[name.charCodeAt(0)%cols.length]
  const init = name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
  return <div style={{ width:size, height:size, borderRadius:'50%', background:`${c}16`, color:c, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:size*0.33, flexShrink:0, fontFamily:'Manrope,sans-serif', border:`2px solid ${c}28` }}>{init}</div>
}

function Stars({ r }: { r:number }) {
  return <div style={{display:'flex',gap:1}}>{[1,2,3,4,5].map(i=><svg key={i} width="11" height="11" viewBox="0 0 13 13"><path d="M6.5 1l1.6 3.2 3.5.5-2.55 2.48.6 3.5L6.5 9l-3.15 1.68.6-3.5L1.4 4.7l3.5-.5z" fill={i<=Math.round(r)?'#F59E0B':'#E4E8EA'}/></svg>)}</div>
}

function VBdg({ label, on, icon }: { label:string; on:boolean; icon:ReactNode }) {
  return <span style={{ display:'inline-flex', alignItems:'center', gap:3, padding:'3px 8px', borderRadius:999, fontSize:10, fontWeight:700, background:on?`${C.success}10`:`${C.muted}09`, color:on?C.success:C.muted, border:`1px solid ${on?C.success+'25':C.border}` }}><span style={{display:'flex'}}>{icon}</span>{label}</span>
}

const STATUS_META: Record<string,{color:string;bg:string}> = {
  Applied:     {color:C.info,    bg:`${C.info}12`},
  Shortlisted: {color:C.primary, bg:`${C.primary}12`},
  Invited:     {color:C.accent,  bg:`${C.accent}12`},
  Negotiating: {color:C.warning, bg:`${C.warning}12`},
  Accepted:    {color:C.success, bg:`${C.success}12`},
  Rejected:    {color:C.error,   bg:`${C.error}10`},
  Hired:       {color:C.primary, bg:`${C.primary}18`},
  Expired:     {color:C.muted,   bg:`${C.muted}10`},
  Withdrawn:   {color:C.muted,   bg:`${C.muted}10`},
}
function StatusBdg({ s }: { s:string }) {
  const m = STATUS_META[s]??{color:C.muted,bg:'#F2F4F5'}
  return <span style={{ display:'inline-flex', alignItems:'center', padding:'3px 10px', borderRadius:999, fontSize:11, fontWeight:800, background:m.bg, color:m.color, letterSpacing:'0.01em' }}>{s}</span>
}

// ─── Application data ─────────────────────────────────────────────────────────
type Application = {
  id:string; name:string; city:string; rating:number; reviews:number; jobs:number
  experience:number; price:number; originalPrice:number; duration:string
  languages:string[]; skills:string[]
  verified:boolean; policeCleared:boolean; medCertified:boolean
  responseTime:string; distance:string; appliedDate:string
  status: keyof typeof STATUS_META
  trustScore:number; coverLetter:string; notes:string; repeatClients:number
  recommendation?:string; matchScore:number
}

const APPLICATIONS: Application[] = [
  {
    id:'ap1', name:'Chamari Dissanayake', city:'Colombo 07', rating:4.97, reviews:327, jobs:684,
    experience:8, price:3500, originalPrice:3500, duration:'3 months',
    languages:['Sinhala','English'], skills:['Hospital Companion','Medication Collection','Stroke Care','Wound Care'],
    verified:true, policeCleared:true, medCertified:true,
    responseTime:'8 min', distance:'2.1 km', appliedDate:'13 Jan 2025 · 9:42 AM',
    status:'Shortlisted', trustScore:96, repeatClients:47,
    coverLetter:"I am very interested in caring for your mother and believe my 8 years of clinical experience, particularly in hospital companion and medication management, align perfectly with her needs. I worked at Nawaloka Hospital for 3 years before joining ReadyPal, and I have cared for 47 repeat clients — many with diabetes and hypertension. I am available to start immediately and would love to speak with you on WhatsApp.",
    notes:'Has extensive dementia care experience. Highly responsive.',
    recommendation:'Best Overall', matchScore:98,
  },
  {
    id:'ap2', name:'Nadeesha Silva', city:'Galle', rating:4.95, reviews:213, jobs:401,
    experience:12, price:4000, originalPrice:4500, duration:'6 weeks',
    languages:['Sinhala','English'], skills:['Dementia Care','Hospital Companion','Physiotherapy Assist','Emergency Support'],
    verified:true, policeCleared:true, medCertified:true,
    responseTime:'18 min', distance:'122 km', appliedDate:'13 Jan 2025 · 11:05 AM',
    status:'Applied', trustScore:94, repeatClients:38,
    coverLetter:"With 12 years in elder care and a nursing degree from the University of Ruhuna, I have supported many clients with conditions similar to your loved one's. I am currently based in Galle but am willing to travel to Colombo for the right arrangement. I offer a discounted rate of LKR 4,000 for this placement. I have availability from 14 January.",
    notes:'Would need accommodation or travel allowance.',
    recommendation:'Most Experienced', matchScore:91,
  },
  {
    id:'ap3', name:'Priya Senanayake', city:'Kurunegala', rating:4.92, reviews:118, jobs:229,
    experience:9, price:3200, originalPrice:3200, duration:'2 months',
    languages:['Sinhala','Tamil'], skills:['Medication Management','Palliative Care','Home Visits','Personal Care'],
    verified:true, policeCleared:true, medCertified:true,
    responseTime:'22 min', distance:'96 km', appliedDate:'13 Jan 2025 · 2:18 PM',
    status:'Applied', trustScore:92, repeatClients:29,
    coverLetter:"I am a palliative care specialist based in Kurunegala with strong medication management skills. My Tamil language skills may be especially useful if your loved one is more comfortable in Tamil. I charge LKR 3,200/hr which is below the standard rate for my experience level. Happy to discuss a travel arrangement.",
    notes:'Strong Tamil speaker. Good palliative background.',
    recommendation:'Best Value', matchScore:88,
  },
  {
    id:'ap4', name:'Kasun Perera', city:'Kandy', rating:4.89, reviews:97, jobs:156,
    experience:4, price:3000, originalPrice:3000, duration:'1 month',
    languages:['Sinhala','English','Tamil'], skills:['Hospital Companion','Medication Collection','Transport','Personal Care'],
    verified:true, policeCleared:true, medCertified:true,
    responseTime:'28 min', distance:'116 km', appliedDate:'14 Jan 2025 · 8:30 AM',
    status:'Applied', trustScore:86, repeatClients:14,
    coverLetter:"I am based in Kandy and have completed 156 verified care assignments over 4 years. I am trilingual — Sinhala, English, and Tamil — which I find valuable when working with diverse families. I offer LKR 3,000/hr and have a flexible schedule. I am willing to travel to Colombo for a 4-week placement.",
    notes:'Younger agent but great reviews. Trilingual.',
    recommendation:'Fastest Response', matchScore:82,
  },
]

let CARE_REQUEST = {
  title:'Home Wellness Care — Amara Fernando',
  service:'Hospital Companion + Medication Management',
  beneficiary:'Amara Fernando, 74 · Colombo 07',
  budget:'LKR 3,000–5,000/hr',
  dates:'From 15 Jan 2025 · Ongoing',
  status:'Open',
  posted:'13 Jan 2025',
  views:28, applications:4, shortlisted:1,
}

// ─── Sub-view types ───────────────────────────────────────────────────────────
type SubView = 'dashboard'|'list'|'proposal'|'shortlist'|'compare'|'negotiate'|'invitations'|'success'

// ──────────────────────────────────────────────────────────────────────────────
// APPLICATION DASHBOARD
// ──────────────────────────────────────────────────────────────────────────────
function Dashboard({ onView, apps, shortlist, onSetView }: { onView:(id:string)=>void; apps:Application[]; shortlist:Set<string>; onSetView:(v:SubView)=>void }) {
  const timeline = [
    {date:'13 Jan, 9:00 AM', ev:'Care Request Published', done:true},
    {date:'13 Jan, 9:42 AM', ev:'First Application Received', done:true},
    {date:'13 Jan, 3:00 PM', ev:'4 Applications Received', done:true},
    {date:'14 Jan',          ev:'Review & Shortlist', done:false},
    {date:'15 Jan',          ev:'Negotiation Phase', done:false},
    {date:'TBD',             ev:'Hire Confirmed', done:false},
  ]
  const recBadges: Record<string,string> = { 'Best Overall':C.primary,'Most Experienced':C.accent,'Best Value':C.success,'Fastest Response':C.info }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:22, padding:'24px 28px 60px' }}>
      {/* Care Request summary */}
      <Card style={{ padding:0, overflow:'hidden' }}>
        <div style={{ height:4, background:`linear-gradient(90deg,${C.primary},#00959E,${C.accent})` }} />
        <div style={{ padding:'22px 24px', display:'flex', gap:20, alignItems:'flex-start', flexWrap:'wrap' }}>
          <div style={{ flex:1, minWidth:240 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
              <h2 style={{ fontSize:18, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>{CARE_REQUEST.title}</h2>
              <StatusBdg s={CARE_REQUEST.status} />
            </div>
            <p style={{ fontSize:13, color:C.muted, marginBottom:10 }}>{CARE_REQUEST.service}</p>
            <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
              <span style={{ fontSize:12, color:C.sub, display:'flex', alignItems:'center', gap:5 }}>{I.user}{CARE_REQUEST.beneficiary}</span>
              <span style={{ fontSize:12, color:C.sub, display:'flex', alignItems:'center', gap:5 }}>{I.tag}{CARE_REQUEST.budget}</span>
              <span style={{ fontSize:12, color:C.sub, display:'flex', alignItems:'center', gap:5 }}>{I.calendar}{CARE_REQUEST.dates}</span>
            </div>
          </div>
          <div style={{ display:'flex', gap:12 }}>
            {[{v:CARE_REQUEST.views,l:'Views'},{v:CARE_REQUEST.applications,l:'Applicants'},{v:CARE_REQUEST.shortlisted,l:'Shortlisted'}].map(s=>(
              <div key={s.l} style={{ textAlign:'center', padding:'12px 18px', borderRadius:12, background:'#F9FAFB', border:`1px solid ${C.border}` }}>
                <p style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', letterSpacing:'-0.02em' }}>{s.v}</p>
                <p style={{ fontSize:11, color:C.muted, fontFamily:'Manrope,sans-serif' }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:22, alignItems:'start' }} className="hn-dash-grid">
        <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
          {/* AI Recommendations */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
              <span style={{ color:C.primary, display:'flex' }}>{I.ai}</span>
              <h3 style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>ReadyPal Recommendations</h3>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12 }} className="hn-rec-grid">
              {apps.filter(a=>a.recommendation).map(a=>{
                const rc = recBadges[a.recommendation!]??C.primary
                return (
                  <Card key={a.id} hover onClick={()=>onView(a.id)} style={{ padding:16 }}>
                    <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:8 }}>
                      <Avatar name={a.name} size={40} />
                      <div>
                        <p style={{ fontSize:13, fontWeight:800, color:C.type }}>{a.name}</p>
                        <p style={{ fontSize:11, color:C.muted }}>{a.city}</p>
                      </div>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                        <Stars r={a.rating} /><span style={{ fontSize:12, fontWeight:700, color:C.type }}>{a.rating}</span>
                      </div>
                      <p style={{ fontSize:13, fontWeight:900, color:C.type }}>LKR {a.price.toLocaleString()}<span style={{fontSize:10,color:C.muted}}>/hr</span></p>
                    </div>
                    <Bdg label={a.recommendation!} color={rc} icon={I.ai} />
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Application List preview */}
          <div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
              <h3 style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>All Applications ({apps.length})</h3>
              <button onClick={()=>onSetView('list')} style={{ fontSize:12, fontWeight:700, color:C.primary, background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:4, fontFamily:'Manrope,sans-serif' }}>View All {I.chevronR}</button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {apps.slice(0,3).map(a=>(
                <Card key={a.id} hover onClick={()=>onView(a.id)} style={{ padding:'14px 18px' }}>
                  <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                    <Avatar name={a.name} size={44} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                        <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{a.name}</p>
                        <StatusBdg s={a.status} />
                        {a.recommendation && <Bdg label={a.recommendation} color={recBadges[a.recommendation]??C.primary} />}
                      </div>
                      <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                        <span style={{ fontSize:11, color:C.muted }}>{I.pin} {a.city}</span>
                        <span style={{ fontSize:11, color:C.muted }}>{a.rating}★ ({a.reviews})</span>
                        <span style={{ fontSize:11, color:C.muted }}>{a.experience} yrs exp</span>
                      </div>
                    </div>
                    <div style={{ textAlign:'right' as const, flexShrink:0 }}>
                      <p style={{ fontSize:15, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>LKR {a.price.toLocaleString()}</p>
                      <p style={{ fontSize:10, color:C.muted }}>/hr</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline sidebar */}
        <Card style={{ padding:22 }}>
          <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:16, fontFamily:'Manrope,sans-serif' }}>Application Timeline</h3>
          {timeline.map((ev,i)=>(
            <div key={i} style={{ display:'flex', gap:12 }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                <div style={{ width:24, height:24, borderRadius:'50%', background:ev.done?C.primary:`${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {ev.done ? <span style={{color:'#fff',display:'flex',transform:'scale(0.85)'}}>{I.check}</span> : <div style={{width:8,height:8,borderRadius:'50%',background:'#fff'}} />}
                </div>
                {i<timeline.length-1&&<div style={{ width:2, flex:1, minHeight:16, background:ev.done?C.primary:C.border, margin:'3px 0' }} />}
              </div>
              <div style={{ paddingBottom: i<timeline.length-1?14:0 }}>
                <p style={{ fontSize:12, fontWeight:700, color:ev.done?C.type:C.muted }}>{ev.ev}</p>
                <p style={{ fontSize:10, color:C.muted }}>{ev.date}</p>
              </div>
            </div>
          ))}
          <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${C.border}`, display:'flex', gap:8 }}>
            <Btn label="Compare All" variant="secondary" icon={I.compare} small onClick={()=>onSetView('compare')} />
            <Btn label="Invite Agent" variant="ghost" icon={I.send} small onClick={()=>onSetView('invitations')} />
          </div>
        </Card>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// APPLICATION LIST
// ──────────────────────────────────────────────────────────────────────────────
function AppList({ apps, shortlist, onShortlist, onView, onCompare, compareIds, onReject, onNegotiate, onHire }: {
  apps:Application[]; shortlist:Set<string>; onShortlist:(id:string)=>void
  onView:(id:string)=>void; onCompare:(id:string)=>void; compareIds:Set<string>
  onReject:(id:string)=>void; onNegotiate:(id:string)=>void; onHire:(id:string)=>void
}) {
  const [sort, setSort] = useState('Recommended')
  const sorts = ['Recommended','Highest Rated','Best Price','Fastest Response','Most Experienced']
  const sorted = [...apps].sort((a,b)=>
    sort==='Highest Rated'     ? b.rating-a.rating
    : sort==='Best Price'      ? a.price-b.price
    : sort==='Most Experienced'? b.experience-a.experience
    : b.matchScore-a.matchScore
  )

  return (
    <div style={{ padding:'24px 28px 60px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18, flexWrap:'wrap', gap:12 }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:2 }}>Applications</h2>
          <p style={{ fontSize:13, color:C.muted }}>{apps.length} agents applied to your care request</p>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <select value={sort} onChange={e=>setSort(e.target.value)} style={{ padding:'8px 12px', borderRadius:9, border:`1px solid ${C.border}`, fontSize:12, fontWeight:700, color:C.sub, fontFamily:'Manrope,sans-serif', background:'transparent', cursor:'pointer', outline:'none' }}>
            {sorts.map(s=><option key={s}>{s}</option>)}
          </select>
          {compareIds.size>0 && <Btn label={`Compare (${compareIds.size})`} variant="secondary" icon={I.compare} small />}
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {sorted.map(a=>{
          const isSl = shortlist.has(a.id)
          const isComp = compareIds.has(a.id)
          return (
            <Card key={a.id} hover style={{ padding:0, overflow:'hidden' }}>
              {a.recommendation && <div style={{ height:3, background:`linear-gradient(90deg,${C.primary},${C.accent})` }} />}
              <div style={{ padding:'20px 22px' }}>
                <div style={{ display:'flex', gap:16, alignItems:'flex-start', flexWrap:'wrap' }}>
                  {/* Avatar + online */}
                  <div style={{ position:'relative', flexShrink:0 }}>
                    <Avatar name={a.name} size={56} />
                    <span style={{ position:'absolute', bottom:2, right:2, width:13, height:13, borderRadius:'50%', background:C.success, border:'2px solid #fff' }} />
                  </div>

                  {/* Main info */}
                  <div style={{ flex:1, minWidth:220 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:4 }}>
                      <p style={{ fontSize:15, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>{a.name}</p>
                      <StatusBdg s={a.status} />
                      {a.recommendation && <Bdg label={a.recommendation} color={C.primary} icon={I.ai} />}
                      {a.matchScore>=90 && <Bdg label={`${a.matchScore}% Match`} color={C.accent} />}
                    </div>
                    <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:8 }}>
                      <span style={{ fontSize:12, color:C.muted, display:'flex', alignItems:'center', gap:4 }}>{I.pin}{a.city} · {a.distance}</span>
                      <span style={{ fontSize:12, color:C.muted, display:'flex', alignItems:'center', gap:4 }}>{I.briefcase}{a.experience} yrs</span>
                      <span style={{ fontSize:12, color:C.muted, display:'flex', alignItems:'center', gap:4 }}>{I.clock}{a.responseTime}</span>
                      <span style={{ fontSize:12, color:C.muted, display:'flex', alignItems:'center', gap:4 }}>{I.calendar}{a.appliedDate}</span>
                    </div>
                    <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:8 }}>
                      {a.skills.slice(0,3).map(s=><Bdg key={s} label={s} color={C.sub} bg="#F2F4F5" />)}
                    </div>
                    <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                      <VBdg label="Verified" on={a.verified} icon={I.check} />
                      <VBdg label="Police" on={a.policeCleared} icon={I.shield} />
                      <VBdg label="Med Cert" on={a.medCertified} icon={I.medal} />
                    </div>
                  </div>

                  {/* Stats + price */}
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8, flexShrink:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <Stars r={a.rating} /><span style={{ fontSize:13, fontWeight:800, color:C.type }}>{a.rating}</span><span style={{ fontSize:11, color:C.muted }}>({a.reviews})</span>
                    </div>
                    <div style={{ textAlign:'right' as const }}>
                      {a.price < a.originalPrice && <p style={{ fontSize:11, color:C.muted, textDecoration:'line-through' }}>LKR {a.originalPrice.toLocaleString()}</p>}
                      <p style={{ fontSize:18, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', letterSpacing:'-0.02em' }}>LKR {a.price.toLocaleString()}<span style={{ fontSize:11, fontWeight:500, color:C.muted }}>/hr</span></p>
                    </div>
                    <div style={{ padding:'6px 10px', borderRadius:8, background:`${C.primary}08`, border:`1px solid ${C.primary}18` }}>
                      <p style={{ fontSize:11, fontWeight:700, color:C.primary }}>Trust {a.trustScore}/100</p>
                    </div>
                  </div>
                </div>

                {/* Cover letter preview */}
                <div style={{ margin:'14px 0 14px', padding:'12px 14px', borderRadius:10, background:'#F9FAFB', border:`1px solid ${C.border}` }}>
                  <p style={{ fontSize:12, fontWeight:700, color:C.muted, marginBottom:4 }}>Cover Letter</p>
                  <p style={{ fontSize:13, color:C.sub, lineHeight:1.65 }}>{a.coverLetter.slice(0,180)}…</p>
                </div>

                {/* Actions */}
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  <button onClick={()=>onView(a.id)} style={{ display:'flex', alignItems:'center', gap:5, padding:'8px 14px', borderRadius:9, border:'none', background:C.primary, cursor:'pointer', fontSize:12, fontWeight:700, color:'#fff', fontFamily:'Manrope,sans-serif' }}>{I.doc} View Proposal</button>
                  <button onClick={()=>onShortlist(a.id)} style={{ display:'flex', alignItems:'center', gap:5, padding:'8px 14px', borderRadius:9, border:`1.5px solid ${isSl?C.primary:C.border}`, background:isSl?`${C.primary}08`:'transparent', cursor:'pointer', fontSize:12, fontWeight:700, color:isSl?C.primary:C.sub, fontFamily:'Manrope,sans-serif' }}>{isSl?I.heartFill:I.heart} {isSl?'Shortlisted':'Shortlist'}</button>
                  <button onClick={()=>onCompare(a.id)} style={{ display:'flex', alignItems:'center', gap:5, padding:'8px 14px', borderRadius:9, border:`1.5px solid ${isComp?C.primary:C.border}`, background:isComp?`${C.primary}08`:'transparent', cursor:'pointer', fontSize:12, fontWeight:700, color:isComp?C.primary:C.sub, fontFamily:'Manrope,sans-serif' }}>{I.compare} {isComp?'Added':'Compare'}</button>
                  <button onClick={()=>onNegotiate(a.id)} style={{ display:'flex', alignItems:'center', gap:5, padding:'8px 14px', borderRadius:9, border:`1.5px solid ${C.border}`, background:'transparent', cursor:'pointer', fontSize:12, fontWeight:700, color:C.sub, fontFamily:'Manrope,sans-serif' }}>{I.refresh} Negotiate</button>
                  <button onClick={()=>onHire(a.id)} style={{ display:'flex', alignItems:'center', gap:5, padding:'8px 16px', borderRadius:9, border:'none', background:C.accent, cursor:'pointer', fontSize:12, fontWeight:700, color:'#fff', fontFamily:'Manrope,sans-serif', marginLeft:'auto' }}>{I.bolt} Hire Now</button>
                  <button onClick={()=>onReject(a.id)} style={{ width:34, height:34, borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.error }}>{I.close}</button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// PROPOSAL DETAIL
// ──────────────────────────────────────────────────────────────────────────────
function ProposalDetail({ app, onBack, onNegotiate, onHire }: { app:Application; onBack:()=>void; onNegotiate:()=>void; onHire:()=>void }) {
  const carePlan = [
    { day:'Monday–Friday', tasks:['Morning medication check (8 AM)','Blood pressure monitoring','Hospital escort if required','Healthy meal reminder'] },
    { day:'Saturday', tasks:['Weekly pharmacy run','Personal care assistance','Family video call support'] },
    { day:'Sunday', tasks:['Rest day — emergency availability only'] },
  ]
  const prevJobs = [
    { title:'Hospital Companion — Nawaloka', date:'Dec 2024', rating:5, service:'Hospital Companion' },
    { title:'Medication Management — Weekly', date:'Nov–Dec 2024', rating:5, service:'Medication Collection' },
    { title:'Stroke Recovery Support', date:'Oct 2024', rating:5, service:'Stroke Care' },
  ]

  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', gap:24, alignItems:'start', flexWrap:'wrap' }}>
      <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:20 }}>
        {/* Back */}
        <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', alignSelf:'flex-start' }}>{I.chevronL} Back to Applications</button>

        {/* Agent hero */}
        <Card style={{ padding:24 }}>
          <div style={{ display:'flex', gap:16, alignItems:'flex-start', flexWrap:'wrap' }}>
            <Avatar name={app.name} size={64} />
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:4 }}>
                <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>{app.name}</h2>
                <StatusBdg s={app.status} />
                {app.recommendation&&<Bdg label={app.recommendation} color={C.primary} icon={I.ai} />}
              </div>
              <p style={{ fontSize:13, color:C.muted, marginBottom:8 }}>{app.city} · Applied {app.appliedDate}</p>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                <VBdg label="Verified" on={app.verified} icon={I.check} />
                <VBdg label="Police Cleared" on={app.policeCleared} icon={I.shield} />
                <VBdg label="Med Certified" on={app.medCertified} icon={I.medal} />
              </div>
            </div>
            <div style={{ display:'flex', gap:8, flexShrink:0 }}>
              <div style={{ textAlign:'right' as const }}>
                <p style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', letterSpacing:'-0.02em' }}>LKR {app.price.toLocaleString()}</p>
                <p style={{ fontSize:12, color:C.muted }}>per hour · {app.duration}</p>
              </div>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginTop:18 }} className="hn-stat-grid">
            {[{v:app.rating.toString(),l:'Rating'},{v:`${app.jobs}`,l:'Jobs'},{v:`${app.experience} yrs`,l:'Experience'},{v:`~${app.responseTime}`,l:'Response'}].map(s=>(
              <div key={s.l} style={{ padding:'10px', borderRadius:10, background:'#F9FAFB', border:`1px solid ${C.border}`, textAlign:'center' as const }}>
                <p style={{ fontSize:16, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>{s.v}</p>
                <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Cover letter */}
        <Card style={{ padding:24 }}>
          <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:12, fontFamily:'Manrope,sans-serif' }}>Cover Letter</h3>
          <p style={{ fontSize:14, color:C.sub, lineHeight:1.75 }}>{app.coverLetter}</p>
        </Card>

        {/* Proposed care plan */}
        <Card style={{ padding:24 }}>
          <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:14, fontFamily:'Manrope,sans-serif' }}>Proposed Care Plan</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {carePlan.map((day,i)=>(
              <div key={i} style={{ padding:'14px 16px', borderRadius:12, background:'#F9FAFB', border:`1px solid ${C.border}` }}>
                <p style={{ fontSize:13, fontWeight:800, color:C.primary, marginBottom:8 }}>{day.day}</p>
                <ul style={{ paddingLeft:16, margin:0, display:'flex', flexDirection:'column', gap:4 }}>
                  {day.tasks.map((t,j)=><li key={j} style={{ fontSize:13, color:C.sub }}>{t}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Card>

        {/* Pricing breakdown */}
        <Card style={{ padding:24 }}>
          <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:14, fontFamily:'Manrope,sans-serif' }}>Pricing Breakdown</h3>
          {[
            {label:'Hourly Rate',        val:`LKR ${app.price.toLocaleString()}/hr`},
            {label:'Estimated Hours/Week',val:'30 hrs'},
            {label:'Estimated Duration', val:app.duration},
            {label:'Travel Costs',       val:'Included (within 5 km)'},
            {label:'Platform Fee (15%)', val:`LKR ${Math.round(app.price*0.15*30).toLocaleString()}/week`},
          ].map(r=>(
            <div key={r.label} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:`1px solid ${C.border}` }}>
              <p style={{ fontSize:13, color:C.muted }}>{r.label}</p>
              <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{r.val}</p>
            </div>
          ))}
          <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 0 0', marginTop:2 }}>
            <p style={{ fontSize:14, fontWeight:800, color:C.type }}>Est. Weekly Total</p>
            <p style={{ fontSize:16, fontWeight:900, color:C.primary, fontFamily:'Manrope,sans-serif' }}>LKR {(app.price*30*1.15).toLocaleString()}</p>
          </div>
        </Card>

        {/* Previous similar jobs */}
        <Card style={{ padding:24 }}>
          <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:14, fontFamily:'Manrope,sans-serif' }}>Similar Past Jobs</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {prevJobs.map((j,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 14px', borderRadius:10, background:'#F9FAFB', border:`1px solid ${C.border}`, flexWrap:'wrap', gap:8 }}>
                <div>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{j.title}</p>
                  <p style={{ fontSize:11, color:C.muted }}>{j.date}</p>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <Bdg label={j.service} color={C.sub} bg="#E4E8EA" />
                  <Stars r={j.rating} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Sticky action sidebar */}
      <div style={{ width:280, flexShrink:0, display:'flex', flexDirection:'column', gap:16, position:'sticky', top:24 }}>
        <Card style={{ padding:22 }}>
          <p style={{ fontSize:13, fontWeight:800, color:C.type, marginBottom:14, fontFamily:'Manrope,sans-serif' }}>Take Action</p>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <button onClick={onHire} style={{ width:'100%', padding:'12px', borderRadius:10, border:'none', background:`linear-gradient(135deg,${C.primary},#00959E)`, cursor:'pointer', fontSize:13, fontWeight:800, color:'#fff', fontFamily:'Manrope,sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>{I.bolt} Hire {app.name.split(' ')[0]}</button>
            <button onClick={onNegotiate} style={{ width:'100%', padding:'10px', borderRadius:10, border:`1.5px solid ${C.border}`, background:'transparent', cursor:'pointer', fontSize:13, fontWeight:700, color:C.type, fontFamily:'Manrope,sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>{I.refresh} Negotiate Price</button>
            <button style={{ width:'100%', padding:'10px', borderRadius:10, border:`1.5px solid ${C.border}`, background:'transparent', cursor:'pointer', fontSize:13, fontWeight:700, color:C.sub, fontFamily:'Manrope,sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>{I.mail} Send Message</button>
          </div>
          <div style={{ marginTop:12, padding:'10px 12px', borderRadius:9, background:`${C.success}07`, border:`1px solid ${C.success}18` }}>
            <p style={{ fontSize:11, fontWeight:700, color:C.success }}>Usually responds in ~{app.responseTime}</p>
          </div>
        </Card>

        <Card style={{ padding:22 }}>
          <p style={{ fontSize:12, fontWeight:800, color:C.muted, marginBottom:10, textTransform:'uppercase', letterSpacing:'0.06em' }}>Trust Score</p>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
            <div style={{ width:44, height:44, borderRadius:'50%', background:`linear-gradient(135deg,${C.primary},${C.accent})`, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <p style={{ fontSize:14, fontWeight:900, color:'#fff', fontFamily:'Manrope,sans-serif' }}>{app.trustScore}</p>
            </div>
            <p style={{ fontSize:13, color:C.success, fontWeight:700 }}>Excellent · Top 5%</p>
          </div>
          {[{l:'ID Verified',v:true},{l:'Police Cleared',v:app.policeCleared},{l:'Med Certified',v:app.medCertified},{l:'Repeat Clients',v:app.repeatClients}].map(r=>(
            <div key={typeof r.v==='boolean'?r.l:r.l} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:`1px solid ${C.border}` }}>
              <p style={{ fontSize:12, color:C.muted }}>{r.l}</p>
              <p style={{ fontSize:12, fontWeight:700, color:typeof r.v==='boolean'?(r.v?C.success:C.muted):C.type }}>{typeof r.v==='boolean'?(r.v?'✓ Yes':'—'):r.v}</p>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// COMPARE APPLICANTS
// ──────────────────────────────────────────────────────────────────────────────
function CompareView({ apps, onRemove, onHire, onBack }: { apps:Application[]; onRemove:(id:string)=>void; onHire:(id:string)=>void; onBack:()=>void }) {
  const highlights: Record<string,string> = {}
  if (apps.length) {
    const best = [...apps].sort((a,b)=>b.rating-a.rating)[0]; highlights[best.id] = 'Highest Rated'
    const cheap = [...apps].sort((a,b)=>a.price-b.price)[0]; if(cheap.id!==best.id) highlights[cheap.id] = 'Best Value'
    const fast = [...apps].sort((a,b)=>a.responseTime.localeCompare(b.responseTime))[0]; if(!highlights[fast.id]) highlights[fast.id] = 'Fastest Response'
  }

  const rows: {label:string;key:keyof Application|'verif'|'police'|'med'}[] = [
    {label:'Rating',          key:'rating'},
    {label:'Reviews',         key:'reviews'},
    {label:'Jobs Completed',  key:'jobs'},
    {label:'Experience',      key:'experience'},
    {label:'Hourly Rate',     key:'price'},
    {label:'Response Time',   key:'responseTime'},
    {label:'Trust Score',     key:'trustScore'},
    {label:'Repeat Clients',  key:'repeatClients'},
    {label:'Distance',        key:'distance'},
    {label:'Languages',       key:'languages'},
    {label:'Skills',          key:'skills'},
    {label:'ID Verified',     key:'verif'},
    {label:'Police Cleared',  key:'police'},
    {label:'Med Certified',   key:'med'},
  ]

  const renderCell = (a:Application, key:typeof rows[number]['key']) => {
    if (key==='verif')    return <VBdg label={a.verified?'Yes':'No'} on={a.verified} icon={I.check} />
    if (key==='police')   return <VBdg label={a.policeCleared?'Yes':'No'} on={a.policeCleared} icon={I.shield} />
    if (key==='med')      return <VBdg label={a.medCertified?'Yes':'No'} on={a.medCertified} icon={I.medal} />
    if (key==='rating')   return <div style={{display:'flex',alignItems:'center',gap:5}}><Stars r={a.rating}/><strong style={{fontSize:13,color:C.type}}>{a.rating}</strong></div>
    if (key==='price')    return <p style={{fontSize:13,fontWeight:900,color:C.type}}>LKR {a.price.toLocaleString()}</p>
    if (key==='experience') return <p style={{fontSize:13,fontWeight:700,color:C.type}}>{a.experience} years</p>
    if (key==='languages') return <div style={{display:'flex',gap:3,flexWrap:'wrap'}}>{(a[key] as string[]).map(l=><Bdg key={l} label={l} color={C.sub} bg="#F2F4F5" />)}</div>
    if (key==='skills')   return <div style={{display:'flex',gap:3,flexWrap:'wrap'}}>{(a[key] as string[]).slice(0,2).map(s=><Bdg key={s} label={s} color={C.primary} />)}</div>
    return <p style={{fontSize:13,fontWeight:600,color:C.type}}>{String(a[key])}</p>
  }

  if (!apps.length) return (
    <div style={{ padding:'60px 28px', textAlign:'center' }}>
      <div style={{ width:72,height:72,borderRadius:'50%',background:`${C.primary}10`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',color:C.primary }}>{I.compare}</div>
      <h3 style={{ fontSize:16, fontWeight:800, color:C.type, marginBottom:6 }}>No agents selected</h3>
      <p style={{ fontSize:13, color:C.muted, marginBottom:20 }}>Go back and click "Compare" on up to 4 applications.</p>
      <Btn label="View Applications" variant="primary" onClick={onBack} />
    </div>
  )

  return (
    <div style={{ padding:'24px 28px 60px', overflowX:'auto' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:3 }}>Compare Applicants</h2>
          <p style={{ fontSize:13, color:C.muted }}>{apps.length} of 4 applicants selected</p>
        </div>
        <Btn label="Back" variant="secondary" icon={I.chevronL} onClick={onBack} small />
      </div>

      <table style={{ width:'100%', borderCollapse:'collapse', minWidth:500 }}>
        <thead>
          <tr>
            <th style={{ width:160, padding:'12px 14px', textAlign:'left' as const, fontSize:11, fontWeight:700, color:C.muted, background:'#F9FAFB', borderRadius:'12px 0 0 0' }}></th>
            {apps.map(a=>(
              <th key={a.id} style={{ padding:'16px 14px', textAlign:'center' as const, background:'#F9FAFB', minWidth:180, verticalAlign:'top' }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                  <div style={{ position:'relative' }}>
                    <Avatar name={a.name} size={48} />
                    {highlights[a.id] && <div style={{ position:'absolute', top:-8, right:-8, padding:'2px 6px', borderRadius:999, background:C.primary, fontSize:9, fontWeight:800, color:'#fff', whiteSpace:'nowrap' }}>{highlights[a.id]}</div>}
                  </div>
                  <p style={{ fontSize:13, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>{a.name}</p>
                  <p style={{ fontSize:11, color:C.muted }}>{a.city}</p>
                  <StatusBdg s={a.status} />
                  <button onClick={()=>onRemove(a.id)} style={{ background:'none', border:'none', cursor:'pointer', color:C.error, fontSize:11, fontWeight:700, display:'flex', alignItems:'center', gap:3, fontFamily:'Manrope,sans-serif' }}>{I.close} Remove</button>
                </div>
              </th>
            ))}
            {Array.from({length:4-apps.length}).map((_,i)=>(
              <th key={`e${i}`} style={{ padding:'16px', background:'#F9FAFB', minWidth:140 }}>
                <div style={{ border:`2px dashed ${C.border}`, borderRadius:12, padding:'20px 12px', textAlign:'center' as const, color:C.muted }}>{I.plus}<p style={{fontSize:11,fontWeight:700,marginTop:4}}>Add</p></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row,ri)=>(
            <tr key={row.label} style={{ background:ri%2===0?'#FAFAFA':C.surface }}>
              <td style={{ padding:'11px 14px', fontSize:12, fontWeight:700, color:C.muted, borderRight:`1px solid ${C.border}` }}>{row.label}</td>
              {apps.map(a=>(
                <td key={a.id} style={{ padding:'11px 14px', textAlign:'center' as const, borderRight:`1px solid ${C.border}`, verticalAlign:'middle' }}>
                  {renderCell(a, row.key)}
                </td>
              ))}
              {Array.from({length:4-apps.length}).map((_,i)=>(
                <td key={`ec${i}`} style={{ borderRight:`1px solid ${C.border}` }} />
              ))}
            </tr>
          ))}
          <tr style={{ background:'#F9FAFB' }}>
            <td style={{ padding:'14px', borderRight:`1px solid ${C.border}` }} />
            {apps.map(a=>(
              <td key={a.id} style={{ padding:'14px', textAlign:'center' as const, borderRight:`1px solid ${C.border}` }}>
                <button onClick={()=>onHire(a.id)} style={{ width:'100%', padding:'10px', borderRadius:10, border:'none', background:C.primary, cursor:'pointer', fontSize:13, fontWeight:700, color:'#fff', fontFamily:'Manrope,sans-serif' }}>Hire {a.name.split(' ')[0]}</button>
              </td>
            ))}
            {Array.from({length:4-apps.length}).map((_,i)=>(
              <td key={`eb${i}`} style={{ padding:'14px', borderRight:`1px solid ${C.border}` }} />
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// NEGOTIATION
// ──────────────────────────────────────────────────────────────────────────────
function Negotiation({ app, onBack, onAccept }: { app:Application; onBack:()=>void; onAccept:()=>void }) {
  const [counter, setCounter] = useState(String(Math.round(app.price*0.9/100)*100))
  const [msg, setMsg] = useState('')
  const [sent, setSent] = useState(false)

  const history = [
    { from:'Agent', price:app.originalPrice, date:'13 Jan · 11:05 AM', note:"I'd be happy to care for your mother.", status:'sent' },
    { from:'You',   price:app.price-200,      date:'13 Jan · 3:30 PM',  note:"Could you come down slightly? Budget is tight.", status:'countered' },
    { from:'Agent', price:app.price,          date:'13 Jan · 4:10 PM',  note:"LKR "+app.price.toLocaleString()+"/hr is my best rate — includes travel.", status:'accepted' },
  ]
  const pctSaving = Math.round((1 - Number(counter)/app.price)*100)

  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', gap:24, alignItems:'start', flexWrap:'wrap' }}>
      <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:20 }}>
        <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', alignSelf:'flex-start' }}>{I.chevronL} Back</button>

        <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
          <Avatar name={app.name} size={52} />
          <div>
            <h2 style={{ fontSize:18, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:3 }}>Negotiating with {app.name}</h2>
            <p style={{ fontSize:13, color:C.muted }}>{app.city} · {app.experience} yrs experience</p>
          </div>
          <div style={{ marginLeft:'auto' }}><StatusBdg s="Negotiating" /></div>
        </div>

        {/* Offer history */}
        <Card style={{ padding:22 }}>
          <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:14, fontFamily:'Manrope,sans-serif' }}>Offer History</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
            {history.map((h,i)=>(
              <div key={i} style={{ display:'flex', gap:14 }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                  <div style={{ width:28, height:28, borderRadius:'50%', background:h.from==='Agent'?`${C.primary}12`:`${C.accent}12`, display:'flex', alignItems:'center', justifyContent:'center', color:h.from==='Agent'?C.primary:C.accent, fontSize:10, fontWeight:800 }}>{h.from==='Agent'?'A':'Y'}</div>
                  {i<history.length-1&&<div style={{ width:2, flex:1, minHeight:12, background:C.border, margin:'3px 0' }} />}
                </div>
                <div style={{ paddingBottom: i<history.length-1?14:0, flex:1 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{h.from==='Agent'?app.name:'You'}</p>
                      <span style={{ fontSize:11, color:C.muted }}>{h.date}</span>
                    </div>
                    <p style={{ fontSize:15, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>LKR {h.price.toLocaleString()}<span style={{fontSize:10,fontWeight:500,color:C.muted}}>/hr</span></p>
                  </div>
                  <p style={{ fontSize:13, color:C.sub, lineHeight:1.6, padding:'8px 12px', borderRadius:9, background:h.from==='Agent'?'#F9FAFB':`${C.accent}06`, border:`1px solid ${h.from==='Agent'?C.border:C.accent+'20'}` }}>{h.note}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Counter offer */}
        {!sent ? (
          <Card style={{ padding:24 }}>
            <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:16, fontFamily:'Manrope,sans-serif' }}>Send Counter Offer</h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }} className="hn-stat-grid">
              <div style={{ padding:'14px 16px', borderRadius:12, background:'#F9FAFB', border:`1px solid ${C.border}` }}>
                <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:4 }}>Agent's Current Price</p>
                <p style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>LKR {app.price.toLocaleString()}<span style={{fontSize:11,color:C.muted}}>/hr</span></p>
              </div>
              <div style={{ padding:'14px 16px', borderRadius:12, background:`${C.primary}06`, border:`1px solid ${C.primary}20` }}>
                <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:4 }}>Your Counter Offer</p>
                <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                  <span style={{ fontSize:14, fontWeight:700, color:C.sub }}>LKR</span>
                  <input type="number" value={counter} onChange={e=>setCounter(e.target.value)} style={{ fontSize:20, fontWeight:900, color:C.primary, fontFamily:'Manrope,sans-serif', border:'none', background:'transparent', outline:'none', width:100 }} />
                </div>
                {Number(counter)<app.price && <p style={{ fontSize:11, color:C.success, fontWeight:700 }}>Saving {pctSaving}% · LKR {(app.price-Number(counter)).toLocaleString()}/hr less</p>}
              </div>
            </div>
            <div style={{ marginBottom:14 }}>
              <p style={{ fontSize:12, fontWeight:700, color:C.muted, marginBottom:6 }}>Message (optional)</p>
              <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Explain your counter offer…" rows={3}
                style={{ width:'100%', padding:'12px 14px', borderRadius:12, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, outline:'none', resize:'none' as const, boxSizing:'border-box' as const }} />
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <Btn label="Cancel" variant="ghost" onClick={onBack} />
              <Btn label="Send Counter Offer" variant="primary" icon={I.send} onClick={()=>setSent(true)} />
              <Btn label="Accept Current Offer" variant="accent" icon={I.check} onClick={onAccept} />
            </div>
          </Card>
        ) : (
          <Card style={{ padding:32, textAlign:'center' }}>
            <div style={{ width:56,height:56,borderRadius:'50%',background:`${C.success}12`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px',color:C.success }}>{I.check}</div>
            <h3 style={{ fontSize:16, fontWeight:900, color:C.type, marginBottom:6 }}>Counter Offer Sent!</h3>
            <p style={{ fontSize:13, color:C.muted, marginBottom:16 }}>You offered LKR {Number(counter).toLocaleString()}/hr · Awaiting {app.name.split(' ')[0]}'s response (~{app.responseTime})</p>
            <Bdg label="Awaiting Response" color={C.warning} />
          </Card>
        )}

        {/* Additional requests */}
        <Card style={{ padding:22 }}>
          <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:12, fontFamily:'Manrope,sans-serif' }}>Additional Requests</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {['Schedule adjustment — prefer morning slots (8–12 AM)','Include travel to Nawaloka Hospital monthly','Daily WhatsApp update to family group'].map((r,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'10px 12px', borderRadius:9, background:'#F9FAFB', border:`1px solid ${C.border}` }}>
                <span style={{ color:C.success, display:'flex', marginTop:1, flexShrink:0 }}>{I.check}</span>
                <p style={{ fontSize:13, color:C.sub }}>{r}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Sidebar */}
      <div style={{ width:260, flexShrink:0, display:'flex', flexDirection:'column', gap:14 }}>
        <Card style={{ padding:20 }}>
          <p style={{ fontSize:12, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:12 }}>Negotiation Status</p>
          <StatusBdg s="Negotiating" />
          <div style={{ marginTop:12 }}>
            {[{l:'Original Price',v:`LKR ${app.originalPrice.toLocaleString()}`},{l:'Current Offer',v:`LKR ${app.price.toLocaleString()}`},{l:'Your Counter',v:counter?`LKR ${Number(counter).toLocaleString()}`:'—'}].map(r=>(
              <div key={r.l} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:`1px solid ${C.border}` }}>
                <p style={{ fontSize:12, color:C.muted }}>{r.l}</p>
                <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{r.v}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card style={{ padding:20 }}>
          <p style={{ fontSize:12, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:10 }}>Quick Accept</p>
          <p style={{ fontSize:13, color:C.sub, marginBottom:12, lineHeight:1.5 }}>Accept the current offer at LKR {app.price.toLocaleString()}/hr.</p>
          <Btn label="Accept Offer" variant="primary" icon={I.check} onClick={onAccept} />
        </Card>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// SHORTLIST VIEW
// ──────────────────────────────────────────────────────────────────────────────
function ShortlistView({ apps, shortlist, onRemove, onView, onHire }: { apps:Application[]; shortlist:Set<string>; onRemove:(id:string)=>void; onView:(id:string)=>void; onHire:(id:string)=>void }) {
  const slApps = apps.filter(a=>shortlist.has(a.id))
  if (!slApps.length) return (
    <div style={{ padding:'60px 28px', textAlign:'center' }}>
      <div style={{ width:72,height:72,borderRadius:'50%',background:`${C.error}10`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',color:C.error }}>{I.heartFill}</div>
      <h3 style={{ fontSize:16,fontWeight:800,color:C.type,marginBottom:6 }}>No shortlisted agents</h3>
      <p style={{ fontSize:13,color:C.muted }}>Tap "Shortlist" on any application card to save agents here.</p>
    </div>
  )
  return (
    <div style={{ padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, marginBottom:4, fontFamily:'Manrope,sans-serif' }}>Shortlist</h2>
      <p style={{ fontSize:13, color:C.muted, marginBottom:18 }}>{slApps.length} agent{slApps.length!==1?'s':''} shortlisted</p>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {slApps.map(a=>(
          <Card key={a.id} hover style={{ padding:'18px 20px' }}>
            <div style={{ display:'flex', gap:14, alignItems:'center', flexWrap:'wrap' }}>
              <Avatar name={a.name} size={52} />
              <div style={{ flex:1, minWidth:180 }}>
                <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                  <p style={{ fontSize:15, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{a.name}</p>
                  <StatusBdg s={a.status} />
                </div>
                <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                  <span style={{ fontSize:12, color:C.muted }}>{a.city}</span>
                  <span style={{ fontSize:12, color:C.muted }}>{a.rating}★</span>
                  <span style={{ fontSize:12, color:C.muted }}>{a.experience} yrs</span>
                  <span style={{ fontSize:12, fontWeight:700, color:C.type }}>LKR {a.price.toLocaleString()}/hr</span>
                </div>
                <p style={{ fontSize:12, color:C.sub, marginTop:6, fontStyle:'italic' }}>{a.notes}</p>
              </div>
              <div style={{ display:'flex', gap:7, flexShrink:0 }}>
                <Btn label="View Proposal" variant="secondary" small onClick={()=>onView(a.id)} />
                <Btn label="Hire" variant="primary" small onClick={()=>onHire(a.id)} icon={I.bolt} />
                <button onClick={()=>onRemove(a.id)} style={{ width:32,height:32,borderRadius:9,border:`1px solid ${C.border}`,background:'transparent',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:C.error }}>{I.close}</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// INVITATIONS
// ──────────────────────────────────────────────────────────────────────────────
function InvitationsView() {
  const invites = [
    { name:'Anoma Wickramasinghe', city:'Matara', status:'Pending',  sent:'12 Jan 2025', rating:4.88 },
    { name:'Saman Kumara',         city:'Colombo 06', status:'Accepted', sent:'11 Jan 2025', rating:4.76 },
    { name:'Dinesh Bandara',       city:'Colombo 03', status:'Declined', sent:'10 Jan 2025', rating:4.72 },
    { name:'Ruwan Jayasinghe',     city:'Negombo',    status:'Expired',  sent:'8 Jan 2025',  rating:4.81 },
  ]
  const statCol: Record<string,string> = { Pending:C.warning, Accepted:C.success, Declined:C.error, Expired:C.muted }

  return (
    <div style={{ padding:'24px 28px 60px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:3 }}>Invitations Sent</h2>
          <p style={{ fontSize:13, color:C.muted }}>Agents you personally invited to apply</p>
        </div>
        <Btn label="Invite New Agent" variant="primary" icon={I.send} small />
      </div>

      {/* Search to invite */}
      <Card style={{ padding:20, marginBottom:20 }}>
        <p style={{ fontSize:13, fontWeight:800, color:C.type, marginBottom:12, fontFamily:'Manrope,sans-serif' }}>Invite by Search</p>
        <div style={{ display:'flex', gap:10 }}>
          <input placeholder="Search agent name, city, or skill…" style={{ flex:1, padding:'10px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, outline:'none', background:'#FAFAFA', boxSizing:'border-box' as const }} />
          <Btn label="Send Invite" variant="primary" icon={I.send} />
        </div>
      </Card>

      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {invites.map((inv,i)=>{
          const sc = statCol[inv.status]
          return (
            <Card key={i} style={{ padding:'16px 20px' }}>
              <div style={{ display:'flex', gap:12, alignItems:'center', flexWrap:'wrap' }}>
                <Avatar name={inv.name} size={44} />
                <div style={{ flex:1, minWidth:160 }}>
                  <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:3 }}>{inv.name}</p>
                  <div style={{ display:'flex', gap:8 }}>
                    <span style={{ fontSize:12, color:C.muted }}>{inv.city}</span>
                    <span style={{ fontSize:12, color:C.muted }}>{inv.rating}★</span>
                    <span style={{ fontSize:11, color:C.muted }}>Sent {inv.sent}</span>
                  </div>
                </div>
                <div style={{ display:'flex', gap:8, alignItems:'center', flexShrink:0 }}>
                  <span style={{ display:'inline-flex', padding:'4px 12px', borderRadius:999, fontSize:11, fontWeight:800, background:`${sc}14`, color:sc }}>{inv.status}</span>
                  {inv.status==='Pending' && <button style={{ padding:'6px 12px', borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', fontSize:11, fontWeight:700, color:C.error, fontFamily:'Manrope,sans-serif' }}>Withdraw</button>}
                  {inv.status==='Accepted' && <Btn label="View Application" variant="secondary" small />}
                  {inv.status==='Declined' && <Btn label="Invite Again" variant="ghost" small />}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// HIRE CONFIRMATION MODAL
// ──────────────────────────────────────────────────────────────────────────────
function HireConfirmModal({ app, onClose, onConfirm }: { app:Application; onClose:()=>void; onConfirm:()=>void }) {
  const [agreed, setAgreed] = useState(false)
  const weeklyHrs = 30
  const agentFee  = app.price * weeklyHrs
  const platFee   = Math.round(agentFee * 0.15)
  const total     = agentFee + platFee

  return (
    <div style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.40)', backdropFilter:'blur(4px)' }} />
      <div style={{ position:'relative', zIndex:1, background:C.surface, borderRadius:20, width:'100%', maxWidth:520, boxShadow:'0 24px 64px rgba(0,0,0,0.18)', overflow:'hidden' }}>
        <div style={{ height:4, background:`linear-gradient(90deg,${C.primary},#00959E,${C.accent})` }} />
        <div style={{ padding:'24px 28px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
            <h2 style={{ fontSize:18, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Confirm Hiring</h2>
            <button onClick={onClose} style={{ width:32,height:32,borderRadius:9,border:`1px solid ${C.border}`,background:'transparent',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:C.muted }}>{I.close}</button>
          </div>

          {/* Agent row */}
          <div style={{ display:'flex', gap:14, alignItems:'center', padding:'14px 16px', borderRadius:14, background:`${C.primary}06`, border:`1px solid ${C.primary}14`, marginBottom:20 }}>
            <Avatar name={app.name} size={52} />
            <div>
              <p style={{ fontSize:15, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:2 }}>{app.name}</p>
              <p style={{ fontSize:12, color:C.muted }}>{app.city} · {app.experience} yrs · {app.rating}★</p>
              <div style={{ display:'flex', gap:5, marginTop:4 }}>
                <VBdg label="Verified" on={app.verified} icon={I.check} />
                <VBdg label="Police Cleared" on={app.policeCleared} icon={I.shield} />
              </div>
            </div>
          </div>

          {/* Booking details */}
          {[
            {l:'Service',       v:CARE_REQUEST.service},
            {l:'Beneficiary',   v:CARE_REQUEST.beneficiary},
            {l:'Start Date',    v:'15 January 2025'},
            {l:'Duration',      v:app.duration},
            {l:'Schedule',      v:'Mon–Fri, 8 AM – 12 PM'},
            {l:'Hourly Rate',   v:`LKR ${app.price.toLocaleString()}`},
          ].map(r=>(
            <div key={r.l} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:`1px solid ${C.border}` }}>
              <p style={{ fontSize:13, color:C.muted }}>{r.l}</p>
              <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{r.v}</p>
            </div>
          ))}

          {/* Cost breakdown */}
          <div style={{ marginTop:16, padding:'14px 16px', borderRadius:12, background:'#F9FAFB', border:`1px solid ${C.border}` }}>
            {[
              {l:`Agent Fee (${weeklyHrs} hrs/week)`, v:`LKR ${agentFee.toLocaleString()}`},
              {l:'ReadyPal Platform Fee (15%)', v:`LKR ${platFee.toLocaleString()}`},
            ].map(r=>(
              <div key={r.l} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:`1px solid ${C.border}` }}>
                <p style={{ fontSize:12, color:C.muted }}>{r.l}</p>
                <p style={{ fontSize:12, fontWeight:600, color:C.type }}>{r.v}</p>
              </div>
            ))}
            <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 0 0' }}>
              <p style={{ fontSize:13, fontWeight:800, color:C.type }}>Weekly Total</p>
              <p style={{ fontSize:15, fontWeight:900, color:C.primary, fontFamily:'Manrope,sans-serif' }}>LKR {total.toLocaleString()}</p>
            </div>
          </div>

          {/* Terms */}
          <label style={{ display:'flex', gap:10, alignItems:'flex-start', marginTop:16, cursor:'pointer' }}>
            <div onClick={()=>setAgreed(v=>!v)} style={{ width:18,height:18,borderRadius:5,border:`2px solid ${agreed?C.primary:C.border}`,background:agreed?C.primary:'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1,cursor:'pointer' }}>{agreed&&<span style={{color:'#fff',display:'flex',transform:'scale(0.85)'}}>{I.check}</span>}</div>
            <p style={{ fontSize:12, color:C.sub, lineHeight:1.6 }}>I agree to ReadyPal's <span style={{color:C.primary,fontWeight:700}}>Terms of Service</span> and <span style={{color:C.primary,fontWeight:700}}>Cancellation Policy</span>. I understand a 24-hour cancellation notice is required.</p>
          </label>

          <div style={{ display:'flex', gap:10, marginTop:20 }}>
            <Btn label="Cancel" variant="secondary" onClick={onClose} />
            <button onClick={agreed?onConfirm:undefined} style={{ flex:1, padding:'12px', borderRadius:10, border:'none', background:agreed?`linear-gradient(135deg,${C.primary},#00959E)`:'#C8D0D4', cursor:agreed?'pointer':'not-allowed', fontSize:14, fontWeight:800, color:'#fff', fontFamily:'Manrope,sans-serif' }}>
              Confirm Hire
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// REJECT MODAL
// ──────────────────────────────────────────────────────────────────────────────
function RejectModal({ app, onClose, onConfirm }: { app:Application; onClose:()=>void; onConfirm:()=>void }) {
  const [reason, setReason] = useState('')
  const reasons = ['Already selected someone else','Price too high','Unavailable at required times','Different skills needed','Other']
  return (
    <div style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.35)', backdropFilter:'blur(3px)' }} />
      <Card style={{ position:'relative', zIndex:1, padding:28, maxWidth:420, width:'100%' }}>
        <div style={{ width:48,height:48,borderRadius:'50%',background:`${C.error}10`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px',color:C.error }}>{I.close}</div>
        <h3 style={{ fontSize:16,fontWeight:900,color:C.type,textAlign:'center',marginBottom:6,fontFamily:'Manrope,sans-serif' }}>Decline Application</h3>
        <p style={{ fontSize:13,color:C.muted,textAlign:'center',marginBottom:20,lineHeight:1.6 }}>Please let {app.name.split(' ')[0]} know why you're declining. This helps agents improve.</p>
        <div style={{ display:'flex', flexDirection:'column', gap:7, marginBottom:18 }}>
          {reasons.map(r=>(
            <button key={r} onClick={()=>setReason(r)} style={{ padding:'10px 14px', borderRadius:10, border:`1.5px solid ${reason===r?C.error:C.border}`, background:reason===r?`${C.error}06`:'transparent', cursor:'pointer', fontSize:13, fontWeight:600, color:reason===r?C.error:C.type, fontFamily:'Manrope,sans-serif', textAlign:'left' as const, display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:16,height:16,borderRadius:'50%',border:`2px solid ${reason===r?C.error:C.border}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>{reason===r&&<div style={{width:8,height:8,borderRadius:'50%',background:C.error}} />}</div>
              {r}
            </button>
          ))}
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <Btn label="Cancel" variant="secondary" onClick={onClose} />
          <button onClick={reason?onConfirm:undefined} style={{ flex:1,padding:'10px',borderRadius:10,border:'none',background:reason?C.error:'#C8D0D4',cursor:reason?'pointer':'not-allowed',fontSize:13,fontWeight:700,color:'#fff',fontFamily:'Manrope,sans-serif' }}>Decline Application</button>
        </div>
      </Card>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// SUCCESS SCREEN
// ──────────────────────────────────────────────────────────────────────────────
function SuccessScreen({ app, onDashboard }: { app:Application; onDashboard:()=>void }) {
  const ref = `RP-${Date.now().toString(36).toUpperCase().slice(-6)}`
  const steps = ['Care Request Confirmed','Agent Notified · Responds in ~'+app.responseTime,'Visit Scheduled for 15 Jan 2025 · 8:00 AM','Family Update Sent to Your Account']

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'48px 28px', textAlign:'center' }}>
      {/* Confetti scatter */}
      <div style={{ position:'relative', marginBottom:20 }}>
        {[{t:-40,l:-40},{t:-30,r:-50},{t:-10,l:60},{t:10,r:60}].map((pos,i)=>(
          <div key={i} aria-hidden style={{ position:'absolute', ...pos as CSSProperties, opacity:0.85 }}>{I.confetti}</div>
        ))}
        <div style={{ width:96,height:96,borderRadius:'50%',background:`linear-gradient(135deg,${C.primary},#00959E)`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto',boxShadow:`0 12px 40px ${C.primary}40` }}>
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none"><path d="M8 22l10 10 18-20" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>

      <h1 style={{ fontSize:32, fontWeight:900, color:C.type, letterSpacing:'-0.025em', fontFamily:'Manrope,sans-serif', marginBottom:8 }}>Care Agent Hired!</h1>
      <p style={{ fontSize:15, color:C.muted, maxWidth:440, lineHeight:1.7, marginBottom:8 }}>
        You've successfully hired <strong style={{color:C.type}}>{app.name}</strong> for <em>{CARE_REQUEST.beneficiary.split('·')[0].trim()}</em>. A confirmation has been sent to your account.
      </p>
      <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 16px', borderRadius:999, background:`${C.primary}10`, border:`1px solid ${C.primary}20`, marginBottom:32 }}>
        <span style={{ fontSize:11, fontWeight:700, color:C.muted }}>Reference:</span>
        <span style={{ fontSize:13, fontWeight:900, color:C.primary, fontFamily:'Manrope,sans-serif', letterSpacing:'0.05em' }}>{ref}</span>
      </div>

      {/* Agent card */}
      <div style={{ display:'flex', gap:16, alignItems:'center', padding:'18px 22px', borderRadius:16, background:C.surface, border:`1px solid ${C.border}`, boxShadow:'0 2px 12px rgba(44,62,67,0.07)', marginBottom:28, maxWidth:380, width:'100%' }}>
        <Avatar name={app.name} size={56} />
        <div style={{ flex:1, textAlign:'left' as const }}>
          <p style={{ fontSize:15, fontWeight:900, color:C.type, marginBottom:2, fontFamily:'Manrope,sans-serif' }}>{app.name}</p>
          <p style={{ fontSize:12, color:C.muted, marginBottom:4 }}>First visit: 15 Jan 2025 · 8:00 AM</p>
          <Bdg label="Hired" color={C.success} icon={I.check} />
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:4 }}><Stars r={app.rating} /><span style={{ fontSize:12, fontWeight:700, color:C.type }}>{app.rating}</span></div>
      </div>

      {/* Next steps */}
      <div style={{ maxWidth:420, width:'100%', marginBottom:32 }}>
        {steps.map((s,i)=>(
          <div key={i} style={{ display:'flex', gap:12, alignItems:'center', padding:'10px 0', borderBottom: i<steps.length-1?`1px solid ${C.border}`:'none' }}>
            <div style={{ width:26, height:26, borderRadius:'50%', background:`${C.primary}12`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary, flexShrink:0 }}>{I.check}</div>
            <p style={{ fontSize:13, color:C.sub, textAlign:'left' as const }}>{s}</p>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', gap:12 }}>
        <button onClick={onDashboard} style={{ padding:'12px 28px', borderRadius:12, border:'none', background:`linear-gradient(135deg,${C.primary},#00959E)`, cursor:'pointer', fontSize:14, fontWeight:800, color:'#fff', fontFamily:'Manrope,sans-serif' }}>
          Track Care Progress
        </button>
        <button style={{ padding:'12px 22px', borderRadius:12, border:`1.5px solid ${C.border}`, background:'transparent', cursor:'pointer', fontSize:13, fontWeight:700, color:C.type, fontFamily:'Manrope,sans-serif' }}>
          Message Care Agent
        </button>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// ROOT
// ──────────────────────────────────────────────────────────────────────────────
export default function HiringNegotiation() {
  const { id } = useParams()
  const [, forceUpdate] = useState(0)
  const [subView, setSubView]           = useState<SubView>('dashboard')
  const [selectedId, setSelectedId]     = useState<string>('')
  const [shortlist, setShortlist]       = useState<Set<string>>(new Set())
  const [compareIds, setCompareIds]     = useState<Set<string>>(new Set())
  const [showHireModal, setShowHireModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectId, setRejectId]         = useState<string>('')
  const [apps, setApps]                 = useState<Application[]>([])
  const [clientId, setClientId]         = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setClientId(data.user?.id || ''))
  }, [])

  useEffect(() => {
    if (!id) return
    getCareRequestDetail(id).then(real => {
      Object.assign(CARE_REQUEST, real)
      forceUpdate(n => n + 1)
    }).catch(console.error)
    getApplicationsForRequest(id).then(loaded => {
      setApps(loaded)
      if (loaded[0]) setSelectedId(loaded[0].id)
    }).catch(console.error)
  }, [id])

  const selected = apps.find(a=>a.id===selectedId) ?? apps[0]

  const toggleShortlist = (id:string) => setShortlist(p=>{ const n=new Set(p); n.has(id)?n.delete(id):n.add(id); return n })
  const toggleCompare   = (id:string) => setCompareIds(p=>{ const n=new Set(p); if(n.has(id)){n.delete(id)}else if(n.size<4){n.add(id)}; return n })

  const doHire = (id:string) => { setSelectedId(id); setShowHireModal(true) }
  const doReject = (id:string) => { setRejectId(id); setShowRejectModal(true) }
  const doNegotiate = (id:string) => { setSelectedId(id); setSubView('negotiate') }
  const viewProposal = (id:string) => { setSelectedId(id); setSubView('proposal') }

  const confirmHire = async () => {
    const app: any = apps.find(a => a.id === selectedId)
    if (!app || !id) return
    try {
      await hireApplication(selectedId, id, app.agentId, clientId, '')
      setShowHireModal(false)
      setSubView('success')
    } catch (err) {
      console.error(err)
    }
  }
  const confirmReject = async () => {
    await updateApplicationStatus(rejectId, 'declined')
    setApps(prev=>prev.map(a=>a.id===rejectId?{...a,status:'Rejected' as const}:a))
    setShowRejectModal(false)
  }

  const NAV: {key:SubView;label:string}[] = [
    {key:'dashboard',label:'Overview'},
    {key:'list',label:`Applications (${apps.length})`},
    {key:'shortlist',label:`Shortlist (${shortlist.size})`},
    {key:'compare',label:`Compare (${compareIds.size})`},
    {key:'invitations',label:'Invitations'},
  ]

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:C.bg, fontFamily:'Manrope,sans-serif' }}>
      {subView !== 'success' && (
        <>
          {/* Header */}
          <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'0 28px', position:'sticky', top:0, zIndex:30 }}>
            <div style={{ padding:'12px 0 0', marginBottom:0 }}>
              <p style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:4 }}>Hiring & Negotiation</p>
              <p style={{ fontSize:15, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:0 }}>{CARE_REQUEST.title}</p>
            </div>
            <div style={{ display:'flex', gap:0, overflowX:'auto' }}>
              {NAV.map(n=>(
                <button key={n.key} onClick={()=>setSubView(n.key)} style={{ padding:'12px 16px', border:'none', background:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:subView===n.key?800:500, color:subView===n.key?C.primary:C.sub, borderBottom:subView===n.key?`2px solid ${C.primary}`:'2px solid transparent', transition:'all 0.15s', whiteSpace:'nowrap' as const }}>
                  {n.label}
                </button>
              ))}
            </div>
          </div>

          {/* Compare bar */}
          {compareIds.size>0 && subView!=='compare' && (
            <div style={{ background:`linear-gradient(90deg,${C.primary},#00959E)`, padding:'9px 28px', display:'flex', alignItems:'center', gap:12 }}>
              <p style={{ fontSize:13, fontWeight:700, color:'#fff', flex:1 }}>{compareIds.size} applicant{compareIds.size!==1?'s':''} selected for comparison</p>
              <button onClick={()=>setSubView('compare')} style={{ padding:'6px 14px', borderRadius:8, border:'1.5px solid rgba(255,255,255,0.35)', background:'rgba(255,255,255,0.14)', cursor:'pointer', fontSize:12, fontWeight:700, color:'#fff', fontFamily:'Manrope,sans-serif' }}>Compare Now</button>
              <button onClick={()=>setCompareIds(new Set())} style={{ width:26,height:26,borderRadius:7,border:'1.5px solid rgba(255,255,255,0.25)',background:'rgba(255,255,255,0.10)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff' }}>{I.close}</button>
            </div>
          )}
        </>
      )}

      {/* Content */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflowY:'auto' }}>
        {subView==='dashboard' && <Dashboard onView={viewProposal} apps={apps} shortlist={shortlist} onSetView={setSubView} />}
        {subView==='list'      && <AppList apps={apps} shortlist={shortlist} onShortlist={toggleShortlist} onView={viewProposal} onCompare={toggleCompare} compareIds={compareIds} onReject={doReject} onNegotiate={doNegotiate} onHire={doHire} />}
        {subView==='proposal'  && <ProposalDetail app={selected} onBack={()=>setSubView('list')} onNegotiate={()=>doNegotiate(selected.id)} onHire={()=>doHire(selected.id)} />}
        {subView==='shortlist' && <ShortlistView apps={apps} shortlist={shortlist} onRemove={toggleShortlist} onView={viewProposal} onHire={doHire} />}
        {subView==='compare'   && <CompareView apps={apps.filter(a=>compareIds.has(a.id))} onRemove={toggleCompare} onHire={doHire} onBack={()=>setSubView('list')} />}
        {subView==='negotiate' && <Negotiation app={selected} onBack={()=>setSubView('proposal')} onAccept={()=>doHire(selected.id)} />}
        {subView==='invitations'&& <InvitationsView />}
        {subView==='success'   && <SuccessScreen app={selected} onDashboard={()=>setSubView('dashboard')} />}
      </div>

      {showHireModal && <HireConfirmModal app={selected} onClose={()=>setShowHireModal(false)} onConfirm={confirmHire} />}
      {showRejectModal && <RejectModal app={apps.find(a=>a.id===rejectId)??apps[0]} onClose={()=>setShowRejectModal(false)} onConfirm={confirmReject} />}
    </div>
  )
}
