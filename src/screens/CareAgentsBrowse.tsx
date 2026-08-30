import { useState, useEffect, type ReactNode, type CSSProperties } from 'react'
import { getAgentsForBrowse } from '../lib/api'

// ─── Brand ────────────────────────────────────────────────────────────────────
const C = {
  primary:'#00737A', accent:'#EE8153', type:'#2C3E43', sub:'#6B7E85',
  muted:'#9AAAB0', border:'#E4E8EA', bg:'#F2F4F5', surface:'#FFFFFF',
  success:'#22C55E', warning:'#F59E0B', error:'#EF4444', info:'#3B82F6',
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const I: Record<string, ReactNode> = {
  search:    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.4"/><path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  filter:    <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M1.5 4h12M4 7.5h7M6.5 11h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  sort:      <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M1.5 4h12M3 7.5h9M5 11h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  map:       <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M1.5 3.5l3.5 1 4-2 4.5 2v7.5l-4.5-2-4 2-3.5-1V3.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M5 4.5v8M9 2.5v8" stroke="currentColor" strokeWidth="1.2"/></svg>,
  grid:      <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1.5" y="1.5" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="8.5" y="1.5" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="1.5" y="8.5" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="8.5" y="8.5" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/></svg>,
  list:      <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M3 4h10M3 7.5h10M3 11h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="1.5" cy="4" r="1" fill="currentColor"/><circle cx="1.5" cy="7.5" r="1" fill="currentColor"/><circle cx="1.5" cy="11" r="1" fill="currentColor"/></svg>,
  pin:       <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1A3.5 3.5 0 0 1 10.5 4.5C10.5 7.5 7 12 7 12S3.5 7.5 3.5 4.5A3.5 3.5 0 0 1 7 1z" stroke="currentColor" strokeWidth="1.3"/><circle cx="7" cy="4.5" r="1.2" stroke="currentColor" strokeWidth="1.2"/></svg>,
  star:      <svg width="13" height="13" viewBox="0 0 13 13" fill="#F59E0B"><path d="M6.5 1l1.6 3.2 3.5.5-2.55 2.48.6 3.5L6.5 9l-3.15 1.68.6-3.5L1.4 4.7l3.5-.5z"/></svg>,
  starEmpty: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1l1.6 3.2 3.5.5-2.55 2.48.6 3.5L6.5 9l-3.15 1.68.6-3.5L1.4 4.7l3.5-.5z" stroke="#E4E8EA" strokeWidth="1.2"/></svg>,
  heart:     <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 12.5s-5.5-3.5-5.5-7A3.5 3.5 0 0 1 7.5 3.7a3.5 3.5 0 0 1 5.5 1.8c0 3.5-5.5 7-5.5 7z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  heartFill: <svg width="15" height="15" viewBox="0 0 15 15" fill={C.error}><path d="M7.5 12.5s-5.5-3.5-5.5-7A3.5 3.5 0 0 1 7.5 3.7a3.5 3.5 0 0 1 5.5 1.8c0 3.5-5.5 7-5.5 7z"/></svg>,
  compare:   <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M9 4l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  eye:       <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1.5 7S3.5 3 7 3s5.5 4 5.5 4-2 4-5.5 4-5.5-4-5.5-4z" stroke="currentColor" strokeWidth="1.3"/><circle cx="7" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.2"/></svg>,
  check:     <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l2.8 3L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  close:     <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  chevronR:  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l5 4-5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevronD:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M3 5l3.5 4L10 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  shield:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1l4.5 1.6v3.5C11 9.5 9 11.5 6.5 12.5 4 11.5 2 9.5 2 6.1V2.6L6.5 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  clock:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M6.5 4v3l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  lang:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M6.5 1.5c0 0-2 2-2 5s2 5 2 5M6.5 1.5c0 0 2 2 2 5s-2 5-2 5M1.5 6.5h10" stroke="currentColor" strokeWidth="1"/></svg>,
  briefcase: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1.5" y="4.5" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 4.5V3A1.5 1.5 0 0 1 6 1.5h1A1.5 1.5 0 0 1 8.5 3v1.5M1.5 8h10" stroke="currentColor" strokeWidth="1.2"/></svg>,
  phone:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M3 1.5h4a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.2"/></svg>,
  ai:        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1l1.3 2.6L11 5l-2.7 1.3L7 9 5.7 6.3 3 5l2.7-1.4L7 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M11 9l.8 1.6 1.7.9-1.7.9L11 14l-.8-1.6L8.5 11.5l1.7-.9L11 9z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/></svg>,
  refresh:   <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M12 7a5 5 0 1 1-1.2-3.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M12 3v2.5H9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  plus:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2v9M2 6.5h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  trash:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 3.5h9M5 3.5V2.5h3V3.5M3.5 3.5l.7 7.5h4.6l.7-7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  user:      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5" r="2.8" stroke="currentColor" strokeWidth="1.3"/><path d="M1.5 13c0-3 2.5-5.5 5.5-5.5S12.5 10 12.5 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  mic:       <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="4.5" y="1.5" width="5" height="7" rx="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M2 7.5a5 5 0 0 0 10 0M7 12.5v1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  bolt:      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7 1L3 7h4l-2 4 6-6H7l2-4z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/></svg>,
  medal:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="8.5" r="4" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 4.8 3 1.5h7l-1.5 3.3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  car:       <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 7.5l1-3h8l1 3v2h-10v-2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><circle cx="3.5" cy="9.5" r="1" stroke="currentColor" strokeWidth="1"/><circle cx="9.5" cy="9.5" r="1" stroke="currentColor" strokeWidth="1"/></svg>,
  save:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 1.5h7.5L12 4v7.5A1.5 1.5 0 0 1 10.5 13H2.5A1.5 1.5 0 0 1 1 11.5V3A1.5 1.5 0 0 1 2 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M4 1.5V5h5V1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
}

// ─── Agent data ───────────────────────────────────────────────────────────────
type Agent = {
  id:string; name:string; age:number; gender:string
  city:string; province:string; district:string
  rating:number; reviews:number; jobs:number; responseTime:string
  experience:number; hourlyRate:number; maxRate:number
  languages:string[]; skills:string[]
  verified:boolean; policeCleared:boolean; medCertified:boolean; vehicleAvail:boolean; emergencyReady:boolean
  availability:'Available Now'|'Available Today'|'Available Tomorrow'|'Booked'
  lastActive:string; bio:string; education:string
  badges:string[]; matchScore:number
  lat:number; lng:number
}

const AGENTS: Agent[] = [
  {
    id:'a1', name:'Chamari Dissanayake', age:34, gender:'Female',
    city:'Colombo 07', province:'Western', district:'Colombo',
    rating:4.97, reviews:184, jobs:312, responseTime:'< 15 min',
    experience:7, hourlyRate:3500, maxRate:5000,
    languages:['Sinhala','English'], skills:['Home Visits','Medication Collection','Wound Care','Hospital Companion'],
    verified:true, policeCleared:true, medCertified:true, vehicleAvail:true, emergencyReady:true,
    availability:'Available Now', lastActive:'Just now',
    bio:'Dedicated care professional with 7 years of experience supporting elderly patients across Colombo. Former nursing assistant at Nawaloka Hospital. Passionate about dignified, compassionate care.',
    education:'Diploma in Nursing Assistance — SLNC 2018',
    badges:['Top Rated','Fast Response','Emergency Ready','Police Cleared'],
    matchScore:98, lat:6.90, lng:79.86,
  },
  {
    id:'a2', name:'Kasun Perera', age:29, gender:'Male',
    city:'Kandy', province:'Central', district:'Kandy',
    rating:4.89, reviews:97, jobs:156, responseTime:'< 30 min',
    experience:4, hourlyRate:3000, maxRate:4500,
    languages:['Sinhala','English','Tamil'], skills:['Hospital Companion','Medication Collection','Transport','Personal Care'],
    verified:true, policeCleared:true, medCertified:true, vehicleAvail:true, emergencyReady:false,
    availability:'Available Today', lastActive:'2 hours ago',
    bio:'Bilingual caregiver based in Kandy with strong hospital escort experience. Worked with Kandy General Hospital volunteers for 3 years. Reliable, punctual, and respectful.',
    education:'Certificate in Elderly Care — NAITA 2021',
    badges:['Verified','Police Cleared','Medical Certified'],
    matchScore:92, lat:7.29, lng:80.63,
  },
  {
    id:'a3', name:'Nadeesha Silva', age:41, gender:'Female',
    city:'Galle', province:'Southern', district:'Galle',
    rating:4.95, reviews:213, jobs:401, responseTime:'< 20 min',
    experience:12, hourlyRate:4000, maxRate:6000,
    languages:['Sinhala','English'], skills:['Dementia Care','Medication Management','Physiotherapy Assist','Hospital Companion','Emergency Support'],
    verified:true, policeCleared:true, medCertified:true, vehicleAvail:false, emergencyReady:true,
    availability:'Available Now', lastActive:'5 min ago',
    bio:'Highly experienced caregiver specialising in dementia and Alzheimer care. Over 12 years working with elderly patients across the Southern Province. Trusted by more than 80 families.',
    education:'BSc Nursing — University of Ruhuna 2013',
    badges:['Top Rated','Most Trusted','Emergency Ready','Experienced'],
    matchScore:96, lat:6.03, lng:80.22,
  },
  {
    id:'a4', name:'Ruwan Jayasinghe', age:36, gender:'Male',
    city:'Negombo', province:'Western', district:'Gampaha',
    rating:4.81, reviews:64, jobs:102, responseTime:'< 1 hour',
    experience:5, hourlyRate:2800, maxRate:4000,
    languages:['Sinhala','English'], skills:['Transport','Medication Collection','Home Visits','Grocery Runs'],
    verified:true, policeCleared:true, medCertified:false, vehicleAvail:true, emergencyReady:false,
    availability:'Available Tomorrow', lastActive:'Yesterday',
    bio:'Reliable care agent based in Negombo with own vehicle. Specialises in transport-based services including hospital runs, pharmacy trips, and day-to-day errands for elderly clients.',
    education:'Certificate in First Aid — SLRC 2020',
    badges:['Verified','Vehicle Available'],
    matchScore:79, lat:7.21, lng:79.84,
  },
  {
    id:'a5', name:'Priya Senanayake', age:38, gender:'Female',
    city:'Kurunegala', province:'North Western', district:'Kurunegala',
    rating:4.92, reviews:118, jobs:229, responseTime:'< 25 min',
    experience:9, hourlyRate:3200, maxRate:5500,
    languages:['Sinhala','Tamil'], skills:['Medication Management','Wound Care','Palliative Care','Home Visits','Personal Care'],
    verified:true, policeCleared:true, medCertified:true, vehicleAvail:false, emergencyReady:true,
    availability:'Available Now', lastActive:'10 min ago',
    bio:'Compassionate palliative care specialist serving Kurunegala and surrounding areas. Strong background in medication management and end-of-life support for elderly patients.',
    education:'Diploma in Palliative Care — WHO Sri Lanka Certified 2016',
    badges:['Top Rated','Emergency Ready','Police Cleared','Medical Certified'],
    matchScore:94, lat:7.49, lng:80.36,
  },
  {
    id:'a6', name:'Dinesh Bandara', age:27, gender:'Male',
    city:'Colombo 03', province:'Western', district:'Colombo',
    rating:4.72, reviews:41, jobs:68, responseTime:'< 45 min',
    experience:2, hourlyRate:2500, maxRate:3500,
    languages:['Sinhala','English'], skills:['Hospital Companion','Medication Collection','Transport'],
    verified:true, policeCleared:true, medCertified:false, vehicleAvail:true, emergencyReady:false,
    availability:'Available Today', lastActive:'3 hours ago',
    bio:'Recently qualified caregiver based in central Colombo. Enthusiastic, detail-oriented and eager to build a long-term career in elder care. Currently working towards medical certification.',
    education:'Certificate in Home Care — SLNC 2023',
    badges:['Verified','Recently Joined'],
    matchScore:71, lat:6.88, lng:79.85,
  },
  {
    id:'a7', name:'Anoma Wickramasinghe', age:52, gender:'Female',
    city:'Matara', province:'Southern', district:'Matara',
    rating:4.88, reviews:156, jobs:278, responseTime:'< 30 min',
    experience:14, hourlyRate:3500, maxRate:5000,
    languages:['Sinhala'], skills:['Dementia Care','Home Visits','Palliative Care','Personal Care','Medication Management'],
    verified:true, policeCleared:true, medCertified:true, vehicleAvail:false, emergencyReady:true,
    availability:'Available Now', lastActive:'30 min ago',
    bio:'Veteran caregiver with 14 years of experience in the Southern Province. Specialises in dementia, stroke recovery, and post-hospital care. Known for patience and a deeply personal approach.',
    education:'Advanced Certificate in Elderly Care — NAITA 2010',
    badges:['Top Rated','Emergency Ready','Most Trusted','Experienced'],
    matchScore:91, lat:5.95, lng:80.54,
  },
  {
    id:'a8', name:'Saman Kumara', age:44, gender:'Male',
    city:'Colombo 06', province:'Western', district:'Colombo',
    rating:4.76, reviews:73, jobs:134, responseTime:'< 20 min',
    experience:8, hourlyRate:3800, maxRate:5500,
    languages:['Sinhala','English'], skills:['Wheelchair Assistance','Hospital Companion','Physiotherapy Assist','Emergency Support'],
    verified:true, policeCleared:true, medCertified:true, vehicleAvail:true, emergencyReady:true,
    availability:'Booked', lastActive:'1 hour ago',
    bio:'Specialist in mobility and rehabilitation support. Extensive experience assisting patients recovering from hip replacements and strokes. Works closely with physiotherapists at Lanka Hospitals.',
    education:'BSc Physiotherapy Assistance — University of Kelaniya 2017',
    badges:['Verified','Emergency Ready','Medical Certified','Vehicle Available'],
    matchScore:85, lat:6.84, lng:79.87,
  },
]

// ─── Shared UI ────────────────────────────────────────────────────────────────
function Card({ children, style={}, hover=false, onClick }: { children:ReactNode; style?:CSSProperties; hover?:boolean; onClick?:()=>void }) {
  const [h, setH] = useState(false)
  return (
    <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ background:C.surface, borderRadius:16, border:`1px solid ${C.border}`, boxShadow: h&&hover?'0 8px 28px rgba(44,62,67,0.12)':'0 1px 4px rgba(44,62,67,0.06)', transition:'all 0.2s', transform:h&&hover?'translateY(-2px)':undefined, cursor:onClick?'pointer':undefined, ...style }}>
      {children}
    </div>
  )
}

function Btn({ label, onClick, variant='primary', icon, small=false, disabled=false }: { label:string; onClick?:()=>void; variant?:'primary'|'secondary'|'ghost'|'danger'; icon?:ReactNode; small?:boolean; disabled?:boolean }) {
  const [h, setH] = useState(false)
  const s: Record<string,CSSProperties> = {
    primary:   { background:disabled?'#B0BEC5':h?'#005D63':C.primary, color:'#fff', border:'none', boxShadow:disabled?'none':h?`0 4px 14px ${C.primary}50`:`0 2px 8px ${C.primary}30` },
    secondary: { background:h?'#F0F5F5':'#fff', color:C.primary, border:`1.5px solid ${h?C.primary:C.border}` },
    ghost:     { background:h?'#F2F4F5':'transparent', color:C.sub, border:'none' },
    danger:    { background:h?'#DC2626':C.error, color:'#fff', border:'none' },
  }
  return (
    <button onClick={disabled?undefined:onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} disabled={disabled}
      style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:small?'6px 14px':'10px 20px', borderRadius:10, cursor:disabled?'not-allowed':'pointer', fontFamily:'Manrope,sans-serif', fontSize:small?12:13, fontWeight:700, transition:'all 0.15s', ...s[variant] }}>
      {icon&&<span style={{display:'flex'}}>{icon}</span>}{label}
    </button>
  )
}

function Badge({ label, icon, color=C.primary, bg }: { label:string; icon?:ReactNode; color?:string; bg?:string }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 9px', borderRadius:999, fontSize:11, fontWeight:700, background:bg??`${color}14`, color, letterSpacing:'0.01em', whiteSpace:'nowrap' }}>
      {icon&&<span style={{display:'flex'}}>{icon}</span>}{label}
    </span>
  )
}

function Avatar({ name, size=44, ring=false }: { name:string; size?:number; ring?:boolean }) {
  const initials = name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
  const colors = ['#00737A','#EE8153','#3B82F6','#8B5CF6','#22C55E','#F59E0B','#EC4899']
  const c = colors[name.charCodeAt(0)%colors.length]
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:`${c}18`, color:c, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:size*0.32, flexShrink:0, fontFamily:'Manrope,sans-serif', border:ring?`2.5px solid ${c}`:undefined, position:'relative' }}>{initials}</div>
  )
}

function Stars({ rating, small=false }: { rating:number; small?:boolean }) {
  const s = small ? 11 : 13
  return (
    <div style={{ display:'flex', gap:1, alignItems:'center' }}>
      {[1,2,3,4,5].map(i => {
        const fill = i <= Math.floor(rating) ? '#F59E0B' : i - 0.5 <= rating ? '#F59E0B' : '#E4E8EA'
        return <svg key={i} width={s} height={s} viewBox="0 0 13 13"><path d="M6.5 1l1.6 3.2 3.5.5-2.55 2.48.6 3.5L6.5 9l-3.15 1.68.6-3.5L1.4 4.7l3.5-.5z" fill={fill}/></svg>
      })}
    </div>
  )
}

const AVAIL_COLOR: Record<string,string> = { 'Available Now':C.success, 'Available Today':C.primary, 'Available Tomorrow':C.warning, 'Booked':C.muted }

function VerifyBadge({ label, on, icon }: { label:string; on:boolean; icon:ReactNode }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:3, padding:'2px 7px', borderRadius:999, fontSize:10, fontWeight:700, background:on?`${C.success}12`:`${C.muted}10`, color:on?C.success:C.muted }}>
      <span style={{display:'flex'}}>{icon}</span>{label}
    </span>
  )
}

// ─── Agent Card ───────────────────────────────────────────────────────────────
function AgentCard({ agent, isFav, onFav, onCompare, inCompare, onQuickView, listView=false }: {
  agent:Agent; isFav:boolean; onFav:()=>void; onCompare:()=>void; inCompare:boolean; onQuickView:()=>void; listView?:boolean
}) {
  const [h, setH] = useState(false)
  const ac = AVAIL_COLOR[agent.availability]

  if (listView) {
    return (
      <Card hover style={{ overflow:'hidden' }}>
        <div style={{ display:'flex', gap:16, padding:'18px 20px', alignItems:'center' }}>
          <div style={{ position:'relative', flexShrink:0 }}>
            <Avatar name={agent.name} size={56} ring />
            <span style={{ position:'absolute', bottom:1, right:1, width:12, height:12, borderRadius:'50%', background:agent.availability==='Available Now'?C.success:agent.availability==='Booked'?C.muted:C.warning, border:'2px solid #fff' }} />
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:3 }}>
              <p style={{ fontSize:15, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>{agent.name}</p>
              {agent.verified && <Badge label="Verified" icon={I.check} color={C.primary} />}
              <Badge label={agent.availability} color={ac} />
            </div>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:6 }}>
              <span style={{ fontSize:12, color:C.muted, display:'flex', alignItems:'center', gap:4 }}>{I.pin}{agent.city}</span>
              <span style={{ fontSize:12, color:C.muted, display:'flex', alignItems:'center', gap:4 }}>{I.briefcase}{agent.experience} yrs exp</span>
              <span style={{ fontSize:12, color:C.muted, display:'flex', alignItems:'center', gap:4 }}>{I.lang}{agent.languages.join(', ')}</span>
            </div>
            <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
              {agent.skills.slice(0,3).map(s=><Badge key={s} label={s} color={C.sub} bg="#F2F4F5" />)}
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8, flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <Stars rating={agent.rating} small />
              <span style={{ fontSize:13, fontWeight:800, color:C.type }}>{agent.rating}</span>
              <span style={{ fontSize:11, color:C.muted }}>({agent.reviews})</span>
            </div>
            <p style={{ fontSize:14, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>LKR {agent.hourlyRate.toLocaleString()} <span style={{fontSize:11,fontWeight:500,color:C.muted}}>/hr</span></p>
            <div style={{ display:'flex', gap:6 }}>
              <button onClick={onFav} style={{ width:32, height:32, borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:isFav?C.error:C.muted }}>{isFav?I.heartFill:I.heart}</button>
              <button onClick={onQuickView} style={{ width:32, height:32, borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.muted }}>{I.eye}</button>
              <button onClick={onCompare} style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 12px', borderRadius:9, border:`1.5px solid ${inCompare?C.primary:C.border}`, background:inCompare?`${C.primary}08`:'transparent', cursor:'pointer', fontSize:12, fontWeight:700, color:inCompare?C.primary:C.sub, fontFamily:'Manrope,sans-serif' }}>{I.compare}{inCompare?'Added':'Compare'}</button>
              <button onClick={onQuickView} style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 14px', borderRadius:9, border:'none', background:C.primary, cursor:'pointer', fontSize:12, fontWeight:700, color:'#fff', fontFamily:'Manrope,sans-serif' }}>View Profile</button>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ background:C.surface, borderRadius:20, border:`1px solid ${h?C.primary+'30':C.border}`, boxShadow:h?'0 12px 36px rgba(44,62,67,0.13)':'0 1px 4px rgba(44,62,67,0.07)', transition:'all 0.22s', transform:h?'translateY(-3px)':undefined, overflow:'hidden', display:'flex', flexDirection:'column' }}>
      {/* Header strip */}
      <div style={{ height:4, background: agent.matchScore>=95?`linear-gradient(90deg,${C.primary},#00959E)`: agent.matchScore>=90?`linear-gradient(90deg,${C.primary},${C.accent})`: `linear-gradient(90deg,${C.border},${C.border})` }} />

      {/* AI match badge */}
      {agent.matchScore >= 90 && (
        <div style={{ padding:'8px 16px 0', display:'flex', justifyContent:'flex-end' }}>
          <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 9px', borderRadius:999, fontSize:10, fontWeight:800, background:`linear-gradient(135deg,${C.primary}18,${C.accent}12)`, color:C.primary, border:`1px solid ${C.primary}20` }}>
            {I.ai} {agent.matchScore}% Match
          </span>
        </div>
      )}

      <div style={{ padding: agent.matchScore>=90 ? '10px 18px 18px' : '18px 18px 18px', flex:1 }}>
        {/* Profile row */}
        <div style={{ display:'flex', gap:13, alignItems:'flex-start', marginBottom:12 }}>
          <div style={{ position:'relative', flexShrink:0 }}>
            <Avatar name={agent.name} size={52} ring />
            <span style={{ position:'absolute', bottom:1, right:1, width:13, height:13, borderRadius:'50%', background:agent.availability==='Available Now'?C.success:agent.availability==='Booked'?C.muted:C.warning, border:'2px solid #fff' }} />
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ fontSize:15, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:2 }}>{agent.name}</p>
            <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:4 }}>
              <span style={{ fontSize:12, color:C.muted, display:'flex', alignItems:'center', gap:3 }}>{I.pin}{agent.city}</span>
              <span style={{ color:C.border }}>·</span>
              <span style={{ fontSize:12, color:C.muted }}>{agent.age}y</span>
              <span style={{ color:C.border }}>·</span>
              <span style={{ fontSize:12, color:C.muted }}>{agent.gender}</span>
            </div>
            <Badge label={agent.availability} color={ac} />
          </div>
          {/* Fav */}
          <button onClick={e=>{e.stopPropagation();onFav()}} style={{ width:32,height:32,borderRadius:9,border:`1px solid ${C.border}`,background:'transparent',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:isFav?C.error:C.muted,flexShrink:0,transition:'all 0.15s' }}>{isFav?I.heartFill:I.heart}</button>
        </div>

        {/* Rating + price */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <Stars rating={agent.rating} />
            <span style={{ fontSize:13, fontWeight:800, color:C.type }}>{agent.rating}</span>
            <span style={{ fontSize:11, color:C.muted }}>({agent.reviews} reviews)</span>
          </div>
          <p style={{ fontSize:14, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>LKR {agent.hourlyRate.toLocaleString()}<span style={{fontSize:10,fontWeight:500,color:C.muted}}>/hr</span></p>
        </div>

        {/* Stats row */}
        <div style={{ display:'flex', gap:10, marginBottom:12 }}>
          {[
            {icon:I.briefcase, val:`${agent.experience} yrs`},
            {icon:I.bolt, val:`${agent.jobs} jobs`},
            {icon:I.clock, val:agent.responseTime},
          ].map((s,i)=>(
            <div key={i} style={{ flex:1, padding:'7px 0', borderRadius:9, background:'#F9FAFB', border:`1px solid ${C.border}`, display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
              <span style={{ color:C.primary, display:'flex' }}>{s.icon}</span>
              <p style={{ fontSize:10, fontWeight:700, color:C.sub, fontFamily:'Manrope,sans-serif' }}>{s.val}</p>
            </div>
          ))}
        </div>

        {/* Languages */}
        <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:10 }}>
          {agent.languages.map(l=><Badge key={l} label={l} icon={I.lang} color={C.sub} bg="#F2F4F5" />)}
        </div>

        {/* Skills */}
        <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:14 }}>
          {agent.skills.slice(0,3).map(s=><Badge key={s} label={s} color={C.primary} />)}
          {agent.skills.length>3&&<Badge label={`+${agent.skills.length-3}`} color={C.muted} bg="#F2F4F5" />}
        </div>

        {/* Verify row */}
        <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:14 }}>
          <VerifyBadge label="ID Verified" on={agent.verified} icon={I.check} />
          <VerifyBadge label="Police Cleared" on={agent.policeCleared} icon={I.shield} />
          <VerifyBadge label="Med Cert" on={agent.medCertified} icon={I.medal} />
          {agent.vehicleAvail&&<VerifyBadge label="Vehicle" on icon={I.car} />}
        </div>

        {/* Actions */}
        <div style={{ display:'flex', gap:7 }}>
          <button onClick={onCompare} style={{ flex:1, padding:'8px', borderRadius:10, border:`1.5px solid ${inCompare?C.primary:C.border}`, background:inCompare?`${C.primary}08`:'transparent', cursor:'pointer', fontSize:12, fontWeight:700, color:inCompare?C.primary:C.sub, fontFamily:'Manrope,sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:5, transition:'all 0.15s' }}>
            {I.compare}{inCompare?'Added':'Compare'}
          </button>
          <button onClick={onQuickView} style={{ flex:1, padding:'8px', borderRadius:10, border:'none', background:`${C.primary}10`, cursor:'pointer', fontSize:12, fontWeight:700, color:C.primary, fontFamily:'Manrope,sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}>
            {I.eye} Quick View
          </button>
        </div>
        <button onClick={onQuickView} style={{ width:'100%', marginTop:7, padding:'9px', borderRadius:10, border:'none', background:C.primary, cursor:'pointer', fontSize:13, fontWeight:700, color:'#fff', fontFamily:'Manrope,sans-serif', transition:'background 0.15s' }}>
          View Full Profile
        </button>
      </div>
    </div>
  )
}

// ─── Quick View Slide-over ────────────────────────────────────────────────────
function QuickView({ agent, onClose, isFav, onFav }: { agent:Agent; onClose:()=>void; isFav:boolean; onFav:()=>void }) {
  const ac = AVAIL_COLOR[agent.availability]
  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.30)', backdropFilter:'blur(2px)', zIndex:90 }} />
      <div style={{ position:'fixed', right:0, top:0, bottom:0, width:420, background:C.surface, zIndex:91, display:'flex', flexDirection:'column', boxShadow:'-8px 0 48px rgba(44,62,67,0.14)', overflowY:'auto' }}>
        {/* Cover */}
        <div style={{ background:`linear-gradient(160deg,${C.primary} 0%,#00959E 55%,${C.accent} 100%)`, padding:'28px 24px 0', position:'relative' }}>
          <button onClick={onClose} style={{ position:'absolute', top:16, right:16, width:32, height:32, borderRadius:9, border:'1.5px solid rgba(255,255,255,0.30)', background:'rgba(255,255,255,0.14)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>{I.close}</button>
          <div style={{ display:'flex', gap:14, alignItems:'flex-end' }}>
            <div style={{ position:'relative' }}>
              <Avatar name={agent.name} size={72} ring />
              <span style={{ position:'absolute', bottom:2, right:2, width:16, height:16, borderRadius:'50%', background:agent.availability==='Available Now'?C.success:C.warning, border:'2px solid #fff' }} />
            </div>
            <div style={{ paddingBottom:18 }}>
              <p style={{ fontSize:20, fontWeight:900, color:'#fff', fontFamily:'Manrope,sans-serif', marginBottom:3 }}>{agent.name}</p>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                <span style={{ fontSize:12, color:'rgba(255,255,255,0.75)', display:'flex', alignItems:'center', gap:4 }}>{I.pin}{agent.city}</span>
                <Badge label={agent.availability} color={ac} />
              </div>
            </div>
          </div>
          {/* Tabs-ish stats */}
          <div style={{ display:'flex', gap:0, marginTop:16 }}>
            {[{v:agent.rating.toString(),l:'Rating'},{v:`${agent.reviews}`,l:'Reviews'},{v:`${agent.jobs}`,l:'Jobs'}].map(s=>(
              <div key={s.l} style={{ flex:1, padding:'12px 0', textAlign:'center', borderTop:'2px solid rgba(255,255,255,0.20)' }}>
                <p style={{ fontSize:18, fontWeight:900, color:'#fff', fontFamily:'Manrope,sans-serif' }}>{s.v}</p>
                <p style={{ fontSize:10, color:'rgba(255,255,255,0.65)' }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ flex:1, padding:'20px 24px', display:'flex', flexDirection:'column', gap:18 }}>
          {/* AI match */}
          {agent.matchScore>=90 && (
            <div style={{ padding:'10px 14px', borderRadius:12, background:`${C.primary}08`, border:`1px solid ${C.primary}18`, display:'flex', alignItems:'center', gap:10 }}>
              {I.ai}
              <div>
                <p style={{ fontSize:12, fontWeight:800, color:C.primary }}>{agent.matchScore}% Match for your beneficiaries</p>
                <p style={{ fontSize:11, color:C.muted }}>Based on location, skills, and care history</p>
              </div>
            </div>
          )}

          {/* Bio */}
          <div>
            <p style={{ fontSize:12, fontWeight:700, color:C.muted, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 }}>About</p>
            <p style={{ fontSize:13, color:C.sub, lineHeight:1.65 }}>{agent.bio}</p>
          </div>

          {/* Skills */}
          <div>
            <p style={{ fontSize:12, fontWeight:700, color:C.muted, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>Skills</p>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {agent.skills.map(s=><Badge key={s} label={s} color={C.primary} />)}
            </div>
          </div>

          {/* Details grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {[
              {label:'Experience',val:`${agent.experience} years`},
              {label:'Response',val:agent.responseTime},
              {label:'Rate',val:`LKR ${agent.hourlyRate.toLocaleString()}/hr`},
              {label:'Languages',val:agent.languages.join(', ')},
              {label:'Education',val:agent.education},
              {label:'Last Active',val:agent.lastActive},
            ].map(r=>(
              <div key={r.label} style={{ padding:'10px 12px', borderRadius:10, background:'#F9FAFB', border:`1px solid ${C.border}` }}>
                <p style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:'uppercase', marginBottom:3 }}>{r.label}</p>
                <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{r.val}</p>
              </div>
            ))}
          </div>

          {/* Verifications */}
          <div>
            <p style={{ fontSize:12, fontWeight:700, color:C.muted, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>Verifications</p>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              <VerifyBadge label="ID Verified" on={agent.verified} icon={I.check} />
              <VerifyBadge label="Police Cleared" on={agent.policeCleared} icon={I.shield} />
              <VerifyBadge label="Medical Cert" on={agent.medCertified} icon={I.medal} />
              <VerifyBadge label="Vehicle" on={agent.vehicleAvail} icon={I.car} />
              <VerifyBadge label="Emergency Ready" on={agent.emergencyReady} icon={I.bolt} />
            </div>
          </div>

          {/* Badges */}
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {agent.badges.map(b=><Badge key={b} label={b} color={C.accent} />)}
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding:'16px 24px', borderTop:`1px solid ${C.border}`, display:'flex', gap:10 }}>
          <button onClick={onFav} style={{ width:40, height:40, borderRadius:10, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:isFav?C.error:C.muted }}>{isFav?I.heartFill:I.heart}</button>
          <button style={{ flex:1, padding:'11px', borderRadius:10, border:`1.5px solid ${C.primary}`, background:'transparent', cursor:'pointer', fontSize:13, fontWeight:700, color:C.primary, fontFamily:'Manrope,sans-serif' }}>View Full Profile</button>
          <button style={{ flex:1, padding:'11px', borderRadius:10, border:'none', background:C.primary, cursor:'pointer', fontSize:13, fontWeight:700, color:'#fff', fontFamily:'Manrope,sans-serif' }}>Book Now</button>
        </div>
      </div>
    </>
  )
}

// ─── Filter Drawer ────────────────────────────────────────────────────────────
function FilterDrawer({ onClose, filters, setFilters }: { onClose:()=>void; filters:FilterState; setFilters:(f:FilterState)=>void }) {
  const [local, setLocal] = useState<FilterState>({...filters})
  const langs = ['Sinhala','Tamil','English','Malay']
  const avails = ['Available Now','Available Today','Available Tomorrow']
  const toggle = (arr:string[], v:string) => arr.includes(v) ? arr.filter(x=>x!==v) : [...arr,v]

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.25)', backdropFilter:'blur(2px)', zIndex:90 }} />
      <div style={{ position:'fixed', right:0, top:0, bottom:0, width:380, background:C.surface, zIndex:91, display:'flex', flexDirection:'column', boxShadow:'-8px 0 40px rgba(44,62,67,0.12)' }}>
        <div style={{ padding:'20px 24px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <p style={{ fontSize:16, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Filters</p>
          <button onClick={()=>setLocal({availability:[],gender:'',languages:[],minExp:0,maxRate:10000,minRating:0,verified:false,policeCleared:false,medCertified:false,vehicleAvail:false,emergencyReady:false,district:''})} style={{ fontSize:12, fontWeight:700, color:C.error, background:'none', border:'none', cursor:'pointer', fontFamily:'Manrope,sans-serif' }}>Clear All</button>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'20px 24px', display:'flex', flexDirection:'column', gap:22 }}>
          {/* Availability */}
          <Sect title="Availability">
            <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
              {avails.map(a=>{
                const on=local.availability.includes(a)
                return <label key={a} style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
                  <div onClick={()=>setLocal(l=>({...l,availability:toggle(l.availability,a)}))} style={{ width:18,height:18,borderRadius:5,border:`2px solid ${on?C.primary:C.border}`,background:on?C.primary:'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,cursor:'pointer' }}>{on&&<span style={{color:'#fff',display:'flex'}}>{I.check}</span>}</div>
                  <span style={{ fontSize:13, color:C.type, fontFamily:'Manrope,sans-serif' }}>{a}</span>
                </label>
              })}
            </div>
          </Sect>

          {/* Gender */}
          <Sect title="Gender">
            <div style={{ display:'flex', gap:7 }}>
              {['Any','Female','Male'].map(g=>{
                const on=local.gender===(g==='Any'?'':g)
                return <button key={g} onClick={()=>setLocal(l=>({...l,gender:g==='Any'?'':g}))} style={{ flex:1,padding:'8px',borderRadius:9,border:`1.5px solid ${on?C.primary:C.border}`,background:on?`${C.primary}08`:'transparent',cursor:'pointer',fontFamily:'Manrope,sans-serif',fontSize:12,fontWeight:700,color:on?C.primary:C.sub }}>{g}</button>
              })}
            </div>
          </Sect>

          {/* Languages */}
          <Sect title="Languages">
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {langs.map(l=>{
                const on=local.languages.includes(l)
                return <button key={l} onClick={()=>setLocal(ld=>({...ld,languages:toggle(ld.languages,l)}))} style={{ padding:'6px 14px',borderRadius:999,border:`1.5px solid ${on?C.primary:C.border}`,background:on?`${C.primary}08`:'transparent',cursor:'pointer',fontSize:12,fontWeight:700,color:on?C.primary:C.sub,fontFamily:'Manrope,sans-serif' }}>{l}</button>
              })}
            </div>
          </Sect>

          {/* Experience */}
          <Sect title="Minimum Experience">
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {[0,2,5,8,10].map(n=>{
                const on=local.minExp===n
                return <button key={n} onClick={()=>setLocal(l=>({...l,minExp:n}))} style={{ padding:'6px 14px',borderRadius:999,border:`1.5px solid ${on?C.primary:C.border}`,background:on?`${C.primary}08`:'transparent',cursor:'pointer',fontSize:12,fontWeight:700,color:on?C.primary:C.sub,fontFamily:'Manrope,sans-serif' }}>{n===0?'Any':`${n}+ yrs`}</button>
              })}
            </div>
          </Sect>

          {/* Rating */}
          <Sect title="Minimum Rating">
            <div style={{ display:'flex', gap:6 }}>
              {[0,3,4,4.5].map(n=>{
                const on=local.minRating===n
                return <button key={n} onClick={()=>setLocal(l=>({...l,minRating:n}))} style={{ flex:1,padding:'7px',borderRadius:9,border:`1.5px solid ${on?C.primary:C.border}`,background:on?`${C.primary}08`:'transparent',cursor:'pointer',fontSize:12,fontWeight:700,color:on?C.primary:C.sub,fontFamily:'Manrope,sans-serif' }}>{n===0?'Any':`${n}+`}</button>
              })}
            </div>
          </Sect>

          {/* Max rate */}
          <Sect title={`Max Hourly Rate: LKR ${local.maxRate.toLocaleString()}`}>
            <input type="range" min={2000} max={8000} step={500} value={local.maxRate} onChange={e=>setLocal(l=>({...l,maxRate:Number(e.target.value)}))}
              style={{ width:'100%', accentColor:C.primary }} />
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontSize:11, color:C.muted }}>LKR 2,000</span>
              <span style={{ fontSize:11, color:C.muted }}>LKR 8,000</span>
            </div>
          </Sect>

          {/* Verifications */}
          <Sect title="Verifications">
            <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
              {[
                {k:'verified' as const,label:'ID Verified'},{k:'policeCleared' as const,label:'Police Cleared'},
                {k:'medCertified' as const,label:'Medical Certified'},{k:'vehicleAvail' as const,label:'Vehicle Available'},
                {k:'emergencyReady' as const,label:'Emergency Ready'},
              ].map(item=>(
                <label key={item.k} style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
                  <div onClick={()=>setLocal(l=>({...l,[item.k]:!l[item.k]}))} style={{ width:18,height:18,borderRadius:5,border:`2px solid ${local[item.k]?C.primary:C.border}`,background:local[item.k]?C.primary:'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,cursor:'pointer' }}>{local[item.k]&&<span style={{color:'#fff',display:'flex'}}>{I.check}</span>}</div>
                  <span style={{ fontSize:13, color:C.type, fontFamily:'Manrope,sans-serif' }}>{item.label}</span>
                </label>
              ))}
            </div>
          </Sect>
        </div>
        <div style={{ padding:'16px 24px', borderTop:`1px solid ${C.border}`, display:'flex', gap:10 }}>
          <Btn label="Cancel" variant="secondary" onClick={onClose} />
          <button onClick={()=>{setFilters(local);onClose()}} style={{ flex:1, padding:'10px', borderRadius:10, border:'none', background:C.primary, cursor:'pointer', fontSize:13, fontWeight:700, color:'#fff', fontFamily:'Manrope,sans-serif' }}>Apply Filters</button>
        </div>
      </div>
    </>
  )
}

function Sect({ title, children }: { title:string; children:ReactNode }) {
  return (
    <div>
      <p style={{ fontSize:11, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:10, fontFamily:'Manrope,sans-serif' }}>{title}</p>
      {children}
    </div>
  )
}

// ─── Compare Table ────────────────────────────────────────────────────────────
function CompareTable({ agents, onRemove, onClose }: { agents:Agent[]; onRemove:(id:string)=>void; onClose:()=>void }) {
  const rows: {label:string; render:(a:Agent)=>ReactNode}[] = [
    { label:'Rating',          render:a=><div style={{display:'flex',alignItems:'center',gap:5}}><Stars rating={a.rating} small/><strong style={{fontSize:13,color:C.type}}>{a.rating}</strong></div> },
    { label:'Reviews',         render:a=><p style={{fontSize:13,fontWeight:700,color:C.type}}>{a.reviews}</p> },
    { label:'Jobs Completed',  render:a=><p style={{fontSize:13,fontWeight:700,color:C.type}}>{a.jobs}</p> },
    { label:'Experience',      render:a=><p style={{fontSize:13,fontWeight:700,color:C.type}}>{a.experience} years</p> },
    { label:'Hourly Rate',     render:a=><p style={{fontSize:13,fontWeight:900,color:C.type}}>LKR {a.hourlyRate.toLocaleString()}</p> },
    { label:'Response Time',   render:a=><p style={{fontSize:13,fontWeight:700,color:C.type}}>{a.responseTime}</p> },
    { label:'Languages',       render:a=><div style={{display:'flex',gap:4,flexWrap:'wrap'}}>{a.languages.map(l=><Badge key={l} label={l} color={C.sub} bg="#F2F4F5" />)}</div> },
    { label:'Skills',          render:a=><div style={{display:'flex',gap:4,flexWrap:'wrap'}}>{a.skills.slice(0,3).map(s=><Badge key={s} label={s} color={C.primary} />)}</div> },
    { label:'Location',        render:a=><p style={{fontSize:12,color:C.sub}}>{a.city}</p> },
    { label:'Availability',    render:a=><Badge label={a.availability} color={AVAIL_COLOR[a.availability]} /> },
    { label:'ID Verified',     render:a=><VerifyBadge label={a.verified?'Yes':'No'} on={a.verified} icon={I.check} /> },
    { label:'Police Cleared',  render:a=><VerifyBadge label={a.policeCleared?'Yes':'No'} on={a.policeCleared} icon={I.shield} /> },
    { label:'Medical Cert',    render:a=><VerifyBadge label={a.medCertified?'Yes':'No'} on={a.medCertified} icon={I.medal} /> },
    { label:'Vehicle',         render:a=><VerifyBadge label={a.vehicleAvail?'Yes':'No'} on={a.vehicleAvail} icon={I.car} /> },
    { label:'Emergency Ready', render:a=><VerifyBadge label={a.emergencyReady?'Yes':'No'} on={a.emergencyReady} icon={I.bolt} /> },
  ]

  return (
    <div style={{ flex:1, overflowY:'auto', padding:'24px 28px 60px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>Compare Agents</h2>
          <p style={{ fontSize:13, color:C.muted }}>{agents.length} of 4 agents selected</p>
        </div>
        <Btn label="Back to Browse" variant="secondary" icon={I.chevronR} onClick={onClose} />
      </div>

      {agents.length === 0 ? (
        <Card style={{ padding:80, textAlign:'center' }}>
          <div style={{ width:72, height:72, borderRadius:'50%', background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', color:C.primary }}>{I.compare}</div>
          <h3 style={{ fontSize:16, fontWeight:800, color:C.type, marginBottom:6 }}>No agents to compare</h3>
          <p style={{ fontSize:13, color:C.muted }}>Go back to browse and click "Compare" on up to 4 agents.</p>
        </Card>
      ) : (
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', minWidth:600 }}>
            <thead>
              <tr>
                <th style={{ width:160, padding:'12px 14px', textAlign:'left', fontSize:11, fontWeight:700, color:C.muted, background:'#F9FAFB', borderRadius:'12px 0 0 0' }}></th>
                {agents.map(a=>(
                  <th key={a.id} style={{ padding:'14px', textAlign:'center', verticalAlign:'top', background:'#F9FAFB', minWidth:180 }}>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                      <div style={{ position:'relative' }}>
                        <Avatar name={a.name} size={52} ring />
                        {a.matchScore>=90&&<span style={{ position:'absolute', top:-4, right:-4, width:18, height:18, borderRadius:'50%', background:`linear-gradient(135deg,${C.primary},${C.accent})`, display:'flex', alignItems:'center', justifyContent:'center' }}><svg width="9" height="9" viewBox="0 0 14 14" fill="none"><path d="M7 1l1.3 2.6L11 5l-2.7 1.3L7 9 5.7 6.3 3 5l2.7-1.4L7 1z" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/></svg></span>}
                      </div>
                      <p style={{ fontSize:13, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>{a.name}</p>
                      <p style={{ fontSize:11, color:C.muted }}>{a.city}</p>
                      <button onClick={()=>onRemove(a.id)} style={{ background:'none', border:'none', cursor:'pointer', color:C.error, display:'flex', alignItems:'center', gap:4, fontSize:11, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>{I.close} Remove</button>
                    </div>
                  </th>
                ))}
                {/* Empty slots */}
                {Array.from({length:4-agents.length}).map((_,i)=>(
                  <th key={`empty-${i}`} style={{ padding:'14px', textAlign:'center', background:'#F9FAFB', minWidth:160 }}>
                    <div style={{ border:`2px dashed ${C.border}`, borderRadius:12, padding:'20px 12px', display:'flex', flexDirection:'column', alignItems:'center', gap:8, color:C.muted }}>
                      {I.plus}<p style={{ fontSize:11, fontWeight:700 }}>Add Agent</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row,ri)=>(
                <tr key={row.label} style={{ background:ri%2===0?'#FAFAFA':C.surface }}>
                  <td style={{ padding:'12px 14px', fontSize:12, fontWeight:700, color:C.muted, fontFamily:'Manrope,sans-serif', borderRight:`1px solid ${C.border}` }}>{row.label}</td>
                  {agents.map(a=>(
                    <td key={a.id} style={{ padding:'12px 14px', textAlign:'center', verticalAlign:'middle', borderRight:`1px solid ${C.border}` }}>
                      {row.render(a)}
                    </td>
                  ))}
                  {Array.from({length:4-agents.length}).map((_,i)=>(
                    <td key={`ec-${i}`} style={{ padding:'12px', borderRight:`1px solid ${C.border}` }} />
                  ))}
                </tr>
              ))}
              <tr style={{ background:'#F9FAFB' }}>
                <td style={{ padding:'14px', borderRight:`1px solid ${C.border}` }} />
                {agents.map(a=>(
                  <td key={a.id} style={{ padding:'14px', textAlign:'center', borderRight:`1px solid ${C.border}` }}>
                    <button style={{ width:'100%', padding:'10px', borderRadius:10, border:'none', background:C.primary, cursor:'pointer', fontSize:13, fontWeight:700, color:'#fff', fontFamily:'Manrope,sans-serif' }}>Select {a.name.split(' ')[0]}</button>
                  </td>
                ))}
                {Array.from({length:4-agents.length}).map((_,i)=>(
                  <td key={`eb-${i}`} style={{ padding:'14px', borderRight:`1px solid ${C.border}` }} />
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─── Map View ─────────────────────────────────────────────────────────────────
function MapView({ agents, onCard }: { agents:Agent[]; onCard:(id:string)=>void }) {
  const [selected, setSelected] = useState<string|null>(null)
  const sel = agents.find(a=>a.id===selected)

  const LNG_RANGE = [79.7, 81.0]
  const LAT_RANGE = [5.9, 7.6]
  const toX = (lng:number) => ((lng-LNG_RANGE[0])/(LNG_RANGE[1]-LNG_RANGE[0]))*100
  const toY = (lat:number) => (1-(lat-LAT_RANGE[0])/(LAT_RANGE[1]-LAT_RANGE[0]))*100

  return (
    <div style={{ position:'relative', flex:1, overflow:'hidden', borderRadius:16, margin:'0 28px 28px', border:`1px solid ${C.border}` }}>
      {/* Map bg */}
      <div style={{ position:'absolute', inset:0, background:`linear-gradient(160deg,#e8f4f5 0%,#d0e8ea 40%,#c8dfe1 100%)` }} />
      {/* Grid lines */}
      {[20,40,60,80].map(p=>(
        <div key={p}>
          <div style={{ position:'absolute', left:0, right:0, top:`${p}%`, height:1, background:'rgba(0,115,122,0.06)' }} />
          <div style={{ position:'absolute', top:0, bottom:0, left:`${p}%`, width:1, background:'rgba(0,115,122,0.06)' }} />
        </div>
      ))}

      {/* Decorative island shape */}
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.12 }} viewBox="0 0 100 100" preserveAspectRatio="none">
        <ellipse cx="50" cy="50" rx="20" ry="35" fill="#00737A" />
      </svg>

      {/* Agent pins */}
      {agents.map(a=>{
        const x = toX(a.lng)
        const y = toY(a.lat)
        const ac = AVAIL_COLOR[a.availability]
        const isSel = selected===a.id
        return (
          <div key={a.id} onClick={()=>setSelected(isSel?null:a.id)}
            style={{ position:'absolute', left:`${x}%`, top:`${y}%`, transform:'translate(-50%,-100%)', cursor:'pointer', zIndex:isSel?10:5, transition:'transform 0.2s' }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
              <div style={{ padding:'4px 10px', borderRadius:20, background:isSel?C.primary:C.surface, border:`2px solid ${ac}`, boxShadow:isSel?`0 4px 16px ${C.primary}40`:'0 2px 8px rgba(0,0,0,0.12)', transform:isSel?'scale(1.1)':undefined, transition:'all 0.2s', display:'flex', alignItems:'center', gap:5, minWidth:80 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:ac, flexShrink:0 }} />
                <p style={{ fontSize:11, fontWeight:800, color:isSel?'#fff':C.type, fontFamily:'Manrope,sans-serif', whiteSpace:'nowrap' }}>LKR {a.hourlyRate.toLocaleString()}</p>
              </div>
              <div style={{ width:2, height:8, background:isSel?C.primary:ac }} />
              <div style={{ width:8, height:8, borderRadius:'50%', background:isSel?C.primary:ac }} />
            </div>
          </div>
        )
      })}

      {/* Selected agent card */}
      {sel && (
        <div style={{ position:'absolute', bottom:16, left:'50%', transform:'translateX(-50%)', width:340, background:C.surface, borderRadius:14, border:`1px solid ${C.border}`, boxShadow:'0 8px 28px rgba(44,62,67,0.14)', padding:16, display:'flex', gap:12, alignItems:'center' }}>
          <Avatar name={sel.name} size={48} ring />
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ fontSize:14, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:2 }}>{sel.name}</p>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
              <Stars rating={sel.rating} small />
              <span style={{ fontSize:11, color:C.muted }}>({sel.reviews})</span>
            </div>
            <div style={{ display:'flex', gap:6 }}>
              <Badge label={sel.availability} color={AVAIL_COLOR[sel.availability]} />
              <span style={{ fontSize:11, color:C.muted }}>LKR {sel.hourlyRate.toLocaleString()}/hr</span>
            </div>
          </div>
          <button onClick={()=>onCard(sel.id)} style={{ padding:'8px 14px', borderRadius:9, border:'none', background:C.primary, cursor:'pointer', fontSize:12, fontWeight:700, color:'#fff', fontFamily:'Manrope,sans-serif' }}>View</button>
        </div>
      )}

      {/* Legend */}
      <div style={{ position:'absolute', top:16, left:16, background:'rgba(255,255,255,0.88)', borderRadius:10, padding:'10px 14px', backdropFilter:'blur(8px)', border:`1px solid ${C.border}` }}>
        <p style={{ fontSize:10, fontWeight:800, color:C.muted, textTransform:'uppercase', marginBottom:6 }}>Map Legend</p>
        {Object.entries(AVAIL_COLOR).map(([k,v])=>(
          <div key={k} style={{ display:'flex', alignItems:'center', gap:6, marginBottom:3 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:v }} />
            <p style={{ fontSize:10, color:C.sub }}>{k}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Recommended carousel ─────────────────────────────────────────────────────
function RecommendedSection({ agents, favs, onFav, onQuickView }: { agents:Agent[]; favs:Set<string>; onFav:(id:string)=>void; onQuickView:(id:string)=>void }) {
  const categories = [
    { label:'Hospital Visits',   skill:'Hospital Companion', icon:I.briefcase },
    { label:'Medication',        skill:'Medication Collection', icon:I.check },
    { label:'Dementia Care',     skill:'Dementia Care', icon:I.heart },
    { label:'Emergency Support', skill:'Emergency Support', icon:I.bolt },
  ]

  return (
    <div style={{ padding:'0 28px 28px', display:'flex', flexDirection:'column', gap:28 }}>
      {categories.map(cat=>{
        const catAgents = agents.filter(a=>a.skills.some(s=>s.toLowerCase().includes(cat.skill.toLowerCase().split(' ')[0]))).slice(0,3)
        if (!catAgents.length) return null
        return (
          <div key={cat.label}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
              <div style={{ width:32, height:32, borderRadius:9, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary }}>{cat.icon}</div>
              <h3 style={{ fontSize:15, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>Best for {cat.label}</h3>
              <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'2px 8px', borderRadius:999, background:`${C.accent}12`, color:C.accent, fontSize:10, fontWeight:800 }}>{I.ai} AI Recommended</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }} className="ca-rec-grid">
              {catAgents.map(a=>(
                <AgentCard key={a.id} agent={a} isFav={favs.has(a.id)} onFav={()=>onFav(a.id)} onCompare={()=>{}} inCompare={false} onQuickView={()=>onQuickView(a.id)} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Featured section ─────────────────────────────────────────────────────────
function FeaturedSection({ agents, favs, onFav, onQuickView }: { agents:Agent[]; favs:Set<string>; onFav:(id:string)=>void; onQuickView:(id:string)=>void }) {
  const sections = [
    { label:'Top Rated', agents: agents.filter(a=>a.rating>=4.9) },
    { label:'Fast Responders', agents: agents.filter(a=>a.responseTime==='< 15 min'||a.responseTime==='< 20 min') },
    { label:'Most Trusted', agents: agents.filter(a=>a.policeCleared&&a.medCertified&&a.verified) },
    { label:'Emergency Ready', agents: agents.filter(a=>a.emergencyReady) },
  ]

  return (
    <div style={{ padding:'0 28px 28px', display:'flex', flexDirection:'column', gap:28 }}>
      {sections.map(s=>{
        if (!s.agents.length) return null
        return (
          <div key={s.label}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
              <div style={{ width:4, height:20, borderRadius:2, background:`linear-gradient(${C.primary},${C.accent})` }} />
              <h3 style={{ fontSize:15, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{s.label}</h3>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }} className="ca-feat-grid">
              {s.agents.slice(0,4).map(a=>(
                <AgentCard key={a.id} agent={a} isFav={favs.has(a.id)} onFav={()=>onFav(a.id)} onCompare={()=>{}} inCompare={false} onQuickView={()=>onQuickView(a.id)} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Recently Viewed ──────────────────────────────────────────────────────────
function RecentlyViewed({ agents, favs, onFav, onQuickView }: { agents:Agent[]; favs:Set<string>; onFav:(id:string)=>void; onQuickView:(id:string)=>void }) {
  const groups = [
    { label:'Viewed Today', agents: agents.slice(0,3) },
    { label:'Yesterday', agents: agents.slice(3,5) },
  ]
  return (
    <div style={{ padding:'0 28px 60px', display:'flex', flexDirection:'column', gap:24 }}>
      {groups.map(g=>(
        <div key={g.label}>
          <p style={{ fontSize:12, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:12, fontFamily:'Manrope,sans-serif' }}>{g.label}</p>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {g.agents.map(a=>(
              <AgentCard key={a.id} agent={a} isFav={favs.has(a.id)} onFav={()=>onFav(a.id)} onCompare={()=>{}} inCompare={false} onQuickView={()=>onQuickView(a.id)} listView />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Favorites ────────────────────────────────────────────────────────────────
function FavoritesView({ agents, favs, onFav, compareIds, onCompare, onQuickView }: { agents:Agent[]; favs:Set<string>; onFav:(id:string)=>void; compareIds:Set<string>; onCompare:(id:string)=>void; onQuickView:(id:string)=>void }) {
  const favAgents = agents.filter(a=>favs.has(a.id))
  if (!favAgents.length) return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:60 }}>
      <div style={{ width:80, height:80, borderRadius:'50%', background:`${C.error}10`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', color:C.error }}>{I.heartFill}</div>
      <h3 style={{ fontSize:18, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:8 }}>No favourites yet</h3>
      <p style={{ fontSize:14, color:C.muted, maxWidth:340, lineHeight:1.6 }}>Tap the heart icon on any agent card to save them here for easy access.</p>
    </div>
  )
  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', flexDirection:'column', gap:16 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
        <p style={{ fontSize:14, color:C.muted }}>{favAgents.length} agent{favAgents.length!==1?'s':''} saved</p>
        <button style={{ fontSize:12, fontWeight:700, color:C.error, background:'none', border:'none', cursor:'pointer', fontFamily:'Manrope,sans-serif' }}>Clear All</button>
      </div>
      {favAgents.map(a=>(
        <AgentCard key={a.id} agent={a} isFav onFav={()=>onFav(a.id)} onCompare={()=>onCompare(a.id)} inCompare={compareIds.has(a.id)} onQuickView={()=>onQuickView(a.id)} listView />
      ))}
    </div>
  )
}

// ─── Filter state ─────────────────────────────────────────────────────────────
type FilterState = {
  availability:string[]; gender:string; languages:string[]
  minExp:number; maxRate:number; minRating:number
  verified:boolean; policeCleared:boolean; medCertified:boolean
  vehicleAvail:boolean; emergencyReady:boolean; district:string
}
const defaultFilters: FilterState = { availability:[], gender:'', languages:[], minExp:0, maxRate:10000, minRating:0, verified:false, policeCleared:false, medCertified:false, vehicleAvail:false, emergencyReady:false, district:'' }

// ─── Main module ──────────────────────────────────────────────────────────────
type SubView = 'browse'|'recommended'|'featured'|'favorites'|'recent'|'compare'

const NAV_ITEMS: {key:SubView;label:string}[] = [
  {key:'browse',label:'Browse Agents'},
  {key:'recommended',label:'Recommended'},
  {key:'featured',label:'Featured'},
  {key:'favorites',label:'Favourites'},
  {key:'recent',label:'Recently Viewed'},
]

export default function CareAgentsBrowse() {
  const [subView, setSubView] = useState<SubView>('browse')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('Recommended')
  const [viewMode, setViewMode] = useState<'grid'|'list'|'map'>('grid')
  const [showFilter, setShowFilter] = useState(false)
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [favs, setFavs] = useState<Set<string>>(new Set(['a1','a3']))
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set())
  const [quickViewId, setQuickViewId] = useState<string|null>(null)
  const [showSortMenu, setShowSortMenu] = useState(false)

  const [agents, setAgents] = useState<Agent[]>([])

useEffect(() => {
  getAgentsForBrowse().then(setAgents).catch(console.error)
}, [])

  const sortOptions = ['Recommended','Highest Rated','Most Experienced','Nearest','Lowest Price','Highest Price','Fastest Response','Recently Active']

  const quickViewAgent = agents.find(a=>a.id===quickViewId)

  const filtered = agents.filter(a=>{
    const q = search.toLowerCase()
    const matchSearch = !q || a.name.toLowerCase().includes(q) || a.skills.join(' ').toLowerCase().includes(q) || a.city.toLowerCase().includes(q) || a.languages.join(' ').toLowerCase().includes(q)
    const matchAvail = !filters.availability.length || filters.availability.includes(a.availability)
    const matchGender = !filters.gender || a.gender===filters.gender
    const matchLang = !filters.languages.length || filters.languages.some(l=>a.languages.includes(l))
    const matchExp = a.experience >= filters.minExp
    const matchRate = a.hourlyRate <= filters.maxRate
    const matchRating = a.rating >= filters.minRating
    const matchVerif = (!filters.verified || a.verified) && (!filters.policeCleared || a.policeCleared) && (!filters.medCertified || a.medCertified) && (!filters.vehicleAvail || a.vehicleAvail) && (!filters.emergencyReady || a.emergencyReady)
    return matchSearch && matchAvail && matchGender && matchLang && matchExp && matchRate && matchRating && matchVerif
  }).sort((a,b) => {
    if (sort==='Highest Rated') return b.rating - a.rating
    if (sort==='Most Experienced') return b.experience - a.experience
    if (sort==='Lowest Price') return a.hourlyRate - b.hourlyRate
    if (sort==='Highest Price') return b.hourlyRate - a.hourlyRate
    if (sort==='Fastest Response') return a.responseTime.localeCompare(b.responseTime)
    return b.matchScore - a.matchScore
  })

  const activeFilterCount = [
    filters.availability.length > 0,
    !!filters.gender,
    filters.languages.length > 0,
    filters.minExp > 0,
    filters.maxRate < 10000,
    filters.minRating > 0,
    filters.verified, filters.policeCleared, filters.medCertified, filters.vehicleAvail, filters.emergencyReady,
  ].filter(Boolean).length

  const toggleFav = (id:string) => setFavs(prev=>{ const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n })
  const toggleCompare = (id:string) => {
    setCompareIds(prev=>{
      const n=new Set(prev)
      if (n.has(id)) { n.delete(id); return n }
      if (n.size >= 4) return prev
      n.add(id); return n
    })
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:C.bg, fontFamily:'Manrope,sans-serif', overflow:'hidden' }}>
      {/* Top bar */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, position:'sticky', top:0, zIndex:30 }}>
        {/* Primary nav */}
        <div style={{ padding:'0 28px', display:'flex', alignItems:'center', gap:0, borderBottom:`1px solid ${C.border}` }}>
          {NAV_ITEMS.map(item=>(
            <button key={item.key} onClick={()=>setSubView(item.key)} style={{ display:'flex', alignItems:'center', gap:6, padding:'14px 16px', border:'none', background:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight: subView===item.key?800:500, color: subView===item.key?C.primary:C.sub, borderBottom: subView===item.key?`2px solid ${C.primary}`:'2px solid transparent', transition:'all 0.15s', whiteSpace:'nowrap' }}>
              {item.label}
              {item.key==='favorites'&&favs.size>0&&<span style={{ width:18, height:18, borderRadius:'50%', background:C.error, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:900, color:'#fff' }}>{favs.size}</span>}
            </button>
          ))}
          {compareIds.size>0&&(
            <button onClick={()=>setSubView('compare')} style={{ display:'flex', alignItems:'center', gap:6, padding:'14px 16px', border:'none', background:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:subView==='compare'?800:500, color:subView==='compare'?C.primary:C.sub, borderBottom:subView==='compare'?`2px solid ${C.primary}`:'2px solid transparent' }}>
              Compare <span style={{ width:18, height:18, borderRadius:'50%', background:C.primary, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:900, color:'#fff' }}>{compareIds.size}</span>
            </button>
          )}
        </div>

        {/* Search + tools bar (only on browse) */}
        {subView==='browse' && (
          <div style={{ padding:'14px 28px', display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
            {/* Search */}
            <div style={{ position:'relative', flex:'1 1 300px' }}>
              <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:C.muted, display:'flex' }}>{I.search}</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, skill, language, city…"
                style={{ width:'100%', padding:'10px 40px 10px 36px', borderRadius:10, border:`1.5px solid ${search?C.primary:C.border}`, fontSize:13, fontFamily:'Manrope,sans-serif', color:C.type, outline:'none', background:'#FAFAFA', boxSizing:'border-box' as const, boxShadow:search?`0 0 0 3px ${C.primary}12`:'none', transition:'all 0.15s' }} />
              <button style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:C.muted, display:'flex' }}>{I.mic}</button>
            </div>

            {/* Filter */}
            <button onClick={()=>setShowFilter(true)} style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 16px', borderRadius:10, border:`1.5px solid ${activeFilterCount>0?C.primary:C.border}`, background:activeFilterCount>0?`${C.primary}08`:'transparent', cursor:'pointer', fontSize:12, fontWeight:700, color:activeFilterCount>0?C.primary:C.sub, fontFamily:'Manrope,sans-serif', position:'relative' }}>
              {I.filter} Filters
              {activeFilterCount>0&&<span style={{ width:16, height:16, borderRadius:'50%', background:C.primary, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:900, color:'#fff' }}>{activeFilterCount}</span>}
            </button>

            {/* Sort */}
            <div style={{ position:'relative' }}>
              <button onClick={()=>setShowSortMenu(v=>!v)} style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, background:'transparent', cursor:'pointer', fontSize:12, fontWeight:700, color:C.sub, fontFamily:'Manrope,sans-serif' }}>
                {I.sort} {sort} {I.chevronD}
              </button>
              {showSortMenu && (
                <div style={{ position:'absolute', top:44, right:0, background:C.surface, borderRadius:12, border:`1px solid ${C.border}`, boxShadow:'0 8px 24px rgba(0,0,0,0.10)', zIndex:50, minWidth:190, padding:6 }}>
                  {sortOptions.map(o=>(
                    <button key={o} onClick={()=>{setSort(o);setShowSortMenu(false)}} style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:'none', background:sort===o?`${C.primary}10`:'transparent', cursor:'pointer', fontSize:13, fontWeight: sort===o?700:500, color: sort===o?C.primary:C.type, fontFamily:'Manrope,sans-serif', textAlign:'left' as const, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      {o}{sort===o&&<span style={{color:C.primary,display:'flex'}}>{I.check}</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* View toggle */}
            <div style={{ display:'flex', gap:2, padding:'3px', borderRadius:9, border:`1px solid ${C.border}`, background:'#F9FAFB' }}>
              {([['grid',I.grid],['list',I.list],['map',I.map]] as const).map(([m,ico])=>(
                <button key={m} onClick={()=>setViewMode(m)} style={{ width:32, height:32, borderRadius:7, border:'none', background:viewMode===m?C.primary:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:viewMode===m?'#fff':C.muted, transition:'all 0.15s' }}>{ico}</button>
              ))}
            </div>

            {/* Results count */}
            <p style={{ fontSize:12, color:C.muted, flexShrink:0 }}>{filtered.length} agent{filtered.length!==1?'s':''}</p>
          </div>
        )}
      </div>

      {/* Compare bar */}
      {compareIds.size>0 && subView!=='compare' && (
        <div style={{ background:`linear-gradient(90deg,${C.primary},#00959E)`, padding:'10px 28px', display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontSize:13, fontWeight:700, color:'#fff', flex:1 }}>{compareIds.size} agent{compareIds.size>1?'s':''} selected for comparison</span>
          <button onClick={()=>setSubView('compare')} style={{ padding:'7px 16px', borderRadius:9, border:'1.5px solid rgba(255,255,255,0.40)', background:'rgba(255,255,255,0.18)', cursor:'pointer', fontSize:12, fontWeight:700, color:'#fff', fontFamily:'Manrope,sans-serif' }}>Compare Now</button>
          <button onClick={()=>setCompareIds(new Set())} style={{ width:28, height:28, borderRadius:8, border:'1.5px solid rgba(255,255,255,0.30)', background:'rgba(255,255,255,0.14)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>{I.close}</button>
        </div>
      )}

      {/* Content */}
      <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column' }}>
        {subView==='compare' && (
          <CompareTable agents={agents.filter(a=>compareIds.has(a.id))} onRemove={id=>setCompareIds(p=>{const n=new Set(p);n.delete(id);return n})} onClose={()=>setSubView('browse')} />
        )}
        {subView==='recommended' && (
          <div style={{ padding:'28px 28px 0' }}>
            <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>Recommended for You</h2>
            <p style={{ fontSize:13, color:C.muted, marginBottom:24 }}>AI-matched agents based on your beneficiaries' needs and location</p>
          </div>
        )}
        {subView==='recommended' && <RecommendedSection agents={agents} favs={favs} onFav={toggleFav} onQuickView={id=>setQuickViewId(id)} />}
        {subView==='featured' && (
          <div style={{ padding:'28px 28px 0' }}>
            <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>Featured Agents</h2>
            <p style={{ fontSize:13, color:C.muted, marginBottom:24 }}>Hand-picked top performers in their specialities</p>
          </div>
        )}
        {subView==='featured' && <FeaturedSection agents={agents} favs={favs} onFav={toggleFav} onQuickView={id=>setQuickViewId(id)} />}
        {subView==='favorites' && <FavoritesView agents={agents} favs={favs} onFav={toggleFav} compareIds={compareIds} onCompare={toggleCompare} onQuickView={id=>setQuickViewId(id)} />}
        {subView==='recent' && (
          <>
            <div style={{ padding:'24px 28px 0' }}>
              <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>Recently Viewed</h2>
              <p style={{ fontSize:13, color:C.muted, marginBottom:20 }}>Agents you've looked at recently</p>
            </div>
            <RecentlyViewed agents={agents} favs={favs} onFav={toggleFav} onQuickView={id=>setQuickViewId(id)} />
          </>
        )}

        {subView==='browse' && (
          <>
            {viewMode==='map' ? (
              <MapView agents={filtered} onCard={id=>setQuickViewId(id)} />
            ) : (
              <div style={{ padding:'20px 28px 60px' }}>
                {/* Active filter chips */}
                {activeFilterCount>0 && (
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:16 }}>
                    {filters.availability.map(a=>(
                      <button key={a} onClick={()=>setFilters(f=>({...f,availability:f.availability.filter(x=>x!==a)}))} style={{ display:'flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:999, border:`1px solid ${C.primary}30`, background:`${C.primary}08`, cursor:'pointer', fontSize:11, fontWeight:700, color:C.primary, fontFamily:'Manrope,sans-serif' }}>{a} {I.close}</button>
                    ))}
                    {filters.gender&&<button onClick={()=>setFilters(f=>({...f,gender:''}))} style={{ display:'flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:999, border:`1px solid ${C.primary}30`, background:`${C.primary}08`, cursor:'pointer', fontSize:11, fontWeight:700, color:C.primary, fontFamily:'Manrope,sans-serif' }}>{filters.gender} {I.close}</button>}
                    {filters.verified&&<button onClick={()=>setFilters(f=>({...f,verified:false}))} style={{ display:'flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:999, border:`1px solid ${C.primary}30`, background:`${C.primary}08`, cursor:'pointer', fontSize:11, fontWeight:700, color:C.primary, fontFamily:'Manrope,sans-serif' }}>ID Verified {I.close}</button>}
                    <button onClick={()=>setFilters(defaultFilters)} style={{ padding:'4px 10px', borderRadius:999, border:`1px solid ${C.error}20`, background:`${C.error}06`, cursor:'pointer', fontSize:11, fontWeight:700, color:C.error, fontFamily:'Manrope,sans-serif' }}>Clear All</button>
                  </div>
                )}

                {filtered.length===0 ? (
                  <Card style={{ padding:80, textAlign:'center', margin:'0 auto', maxWidth:480 }}>
                    <div style={{ width:72, height:72, borderRadius:'50%', background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', color:C.primary }}>{I.search}</div>
                    <h3 style={{ fontSize:17, fontWeight:900, color:C.type, marginBottom:8, fontFamily:'Manrope,sans-serif' }}>No agents found</h3>
                    <p style={{ fontSize:13, color:C.muted, lineHeight:1.6, marginBottom:20 }}>Try adjusting your search terms or filters to find more care agents.</p>
                    <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
                      <Btn label="Clear Search" variant="secondary" onClick={()=>setSearch('')} small />
                      <Btn label="Reset Filters" variant="primary" onClick={()=>setFilters(defaultFilters)} small />
                    </div>
                  </Card>
                ) : (
                  viewMode==='list' ? (
                    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                      {filtered.map(a=>(
                        <AgentCard key={a.id} agent={a} isFav={favs.has(a.id)} onFav={()=>toggleFav(a.id)} onCompare={()=>toggleCompare(a.id)} inCompare={compareIds.has(a.id)} onQuickView={()=>setQuickViewId(a.id)} listView />
                      ))}
                    </div>
                  ) : (
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }} className="ca-grid">
                      {filtered.map(a=>(
                        <AgentCard key={a.id} agent={a} isFav={favs.has(a.id)} onFav={()=>toggleFav(a.id)} onCompare={()=>toggleCompare(a.id)} inCompare={compareIds.has(a.id)} onQuickView={()=>setQuickViewId(a.id)} />
                      ))}
                    </div>
                  )
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Filter drawer */}
      {showFilter && <FilterDrawer onClose={()=>setShowFilter(false)} filters={filters} setFilters={setFilters} />}

      {/* Quick View panel */}
      {quickViewAgent && <QuickView agent={quickViewAgent} onClose={()=>setQuickViewId(null)} isFav={favs.has(quickViewAgent.id)} onFav={()=>toggleFav(quickViewAgent.id)} />}

      {/* Sort menu overlay */}
      {showSortMenu && <div onClick={()=>setShowSortMenu(false)} style={{ position:'fixed', inset:0, zIndex:40 }} />}
    </div>
  )
}
