import { useState, type ReactNode, type CSSProperties } from 'react'

// ─── Brand ────────────────────────────────────────────────────────────────────
const C = {
  primary:'#00737A', accent:'#EE8153', type:'#2C3E43', sub:'#6B7E85',
  muted:'#9AAAB0', border:'#E4E8EA', bg:'#F2F4F5', surface:'#FFFFFF',
  success:'#22C55E', warning:'#F59E0B', error:'#EF4444', info:'#3B82F6',
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const I: Record<string, ReactNode> = {
  pin:       <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1A3.5 3.5 0 0 1 10.5 4.5C10.5 7.5 7 12 7 12S3.5 7.5 3.5 4.5A3.5 3.5 0 0 1 7 1z" stroke="currentColor" strokeWidth="1.3"/><circle cx="7" cy="4.5" r="1.2" stroke="currentColor" strokeWidth="1.2"/></svg>,
  star:      <svg width="13" height="13" viewBox="0 0 13 13" fill="#F59E0B"><path d="M6.5 1l1.6 3.2 3.5.5-2.55 2.48.6 3.5L6.5 9l-3.15 1.68.6-3.5L1.4 4.7l3.5-.5z"/></svg>,
  check:     <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l2.8 3L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  shield:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1l4.5 1.6v3.5C11 9.5 9 11.5 6.5 12.5 4 11.5 2 9.5 2 6.1V2.6L6.5 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  medal:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="8.5" r="4" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 4.8 3 1.5h7l-1.5 3.3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  heart:     <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 12.5s-5.5-3.5-5.5-7A3.5 3.5 0 0 1 7.5 3.7a3.5 3.5 0 0 1 5.5 1.8c0 3.5-5.5 7-5.5 7z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  heartFill: <svg width="15" height="15" viewBox="0 0 15 15" fill={C.error}><path d="M7.5 12.5s-5.5-3.5-5.5-7A3.5 3.5 0 0 1 7.5 3.7a3.5 3.5 0 0 1 5.5 1.8c0 3.5-5.5 7-5.5 7z"/></svg>,
  share:     <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="10.5" cy="3" r="1.8" stroke="currentColor" strokeWidth="1.2"/><circle cx="10.5" cy="11" r="1.8" stroke="currentColor" strokeWidth="1.2"/><circle cx="3.5" cy="7" r="1.8" stroke="currentColor" strokeWidth="1.2"/><path d="M5.2 6.1l3.6-2M5.2 7.9l3.6 2" stroke="currentColor" strokeWidth="1.2"/></svg>,
  compare:   <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M9 4l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  clock:     <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3"/><path d="M7 4.5V7.5l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  briefcase: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1.5" y="4.5" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 4.5V3A1.5 1.5 0 0 1 6 1.5h1A1.5 1.5 0 0 1 8.5 3v1.5M1.5 8h10" stroke="currentColor" strokeWidth="1.2"/></svg>,
  lang:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M6.5 1.5c0 0-2 2-2 5s2 5 2 5M6.5 1.5c0 0 2 2 2 5s-2 5-2 5M1.5 6.5h10" stroke="currentColor" strokeWidth="1.1"/></svg>,
  bolt:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M7.5 1.5L3.5 7.5h4.5l-2 4 6-7H7.5l1-3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  car:       <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 7.5l1-3h8l1 3v2h-10v-2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><circle cx="3.5" cy="9.5" r="1" stroke="currentColor" strokeWidth="1"/><circle cx="9.5" cy="9.5" r="1" stroke="currentColor" strokeWidth="1"/></svg>,
  doc:       <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8.5 1.5H3.5A1.5 1.5 0 0 0 2 3v8a1.5 1.5 0 0 0 1.5 1.5h7A1.5 1.5 0 0 0 12 11V5L8.5 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M8.5 1.5V5H12M5 7.5h4M5 9.5h2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  chevronD:  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevronR:  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l5 4-5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevronL:  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3l-5 4 5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  close:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 2l9 9M11 2L2 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  eye:       <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1.5 7S3.5 3 7 3s5.5 4 5.5 4-2 4-5.5 4-5.5-4-5.5-4z" stroke="currentColor" strokeWidth="1.3"/><circle cx="7" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.2"/></svg>,
  download:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 10v1.5A1.5 1.5 0 0 0 4 13h5a1.5 1.5 0 0 0 1.5-1.5V10M6.5 2v7M4.5 6.5L6.5 9l2-2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  mail:      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="3" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M1.5 5l6 4 6-4" stroke="currentColor" strokeWidth="1.3"/></svg>,
  phone:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M3 1.5h4a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.2"/></svg>,
  ai:        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1l1.3 2.6L11 5l-2.7 1.3L7 9 5.7 6.3 3 5l2.7-1.4L7 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M11 9l.8 1.6 1.7.9-1.7.9L11 14l-.8-1.6L8.5 11.5l1.7-.9L11 9z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/></svg>,
  info:      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3"/><path d="M7 6v4M7 4.5V5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  plus:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2v9M2 6.5h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  user:      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5" r="2.8" stroke="currentColor" strokeWidth="1.3"/><path d="M1.5 13c0-3 2.5-5.5 5.5-5.5S12.5 10 12.5 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  calendar:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1.5" y="2.5" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 6h10M4.5 1.5V3M8.5 1.5V3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  award:     <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.3"/><path d="M5 9l-1.5 4.5 3.5-2 3.5 2L9 9" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  zap:       <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M7.5 1.5L3.5 7.5h4.5l-2 4 6-7H7.5l1-3z" fill="currentColor" opacity=".85"/></svg>,
}

// ─── Primitives ───────────────────────────────────────────────────────────────
function Card({ children, style={}, hover=false }: { children:ReactNode; style?:CSSProperties; hover?:boolean }) {
  const [h, setH] = useState(false)
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ background:C.surface, borderRadius:16, border:`1px solid ${C.border}`, boxShadow:h&&hover?'0 8px 28px rgba(44,62,67,0.12)':'0 1px 4px rgba(44,62,67,0.06)', transition:'all 0.2s', transform:h&&hover?'translateY(-2px)':undefined, ...style }}>
      {children}
    </div>
  )
}

function Bdg({ label, icon, color=C.primary, bg }: { label:string; icon?:ReactNode; color?:string; bg?:string }) {
  return <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 9px', borderRadius:999, fontSize:11, fontWeight:700, background:bg??`${color}14`, color, whiteSpace:'nowrap', fontFamily:'Manrope,sans-serif' }}>{icon&&<span style={{display:'flex'}}>{icon}</span>}{label}</span>
}

function VBdg({ label, on, icon }: { label:string; on:boolean; icon:ReactNode }) {
  return <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'4px 10px', borderRadius:999, fontSize:11, fontWeight:700, background:on?`${C.success}10`:`${C.muted}09`, color:on?C.success:C.muted, border:`1px solid ${on?C.success+'25':C.border}`, whiteSpace:'nowrap' }}><span style={{display:'flex'}}>{icon}</span>{label}</span>
}

function Stars({ rating, n=5 }: { rating:number; n?:number }) {
  return (
    <div style={{ display:'flex', gap:1 }}>
      {Array.from({length:n}).map((_,i)=>(
        <svg key={i} width="13" height="13" viewBox="0 0 13 13">
          <path d="M6.5 1l1.6 3.2 3.5.5-2.55 2.48.6 3.5L6.5 9l-3.15 1.68.6-3.5L1.4 4.7l3.5-.5z" fill={i<Math.round(rating)?'#F59E0B':'#E4E8EA'}/>
        </svg>
      ))}
    </div>
  )
}

// ─── Agent data ───────────────────────────────────────────────────────────────
const AGENT = {
  name:'Chamari Dissanayake', age:34, gender:'Female',
  title:'Senior Care Agent · Hospital Specialist',
  city:'Colombo 07', province:'Western', district:'Colombo',
  rating:4.97, reviews:327, jobs:684, responseTime:'8 min',
  experience:8, hourlyRate:3500, dailyRate:8500,
  languages:['Sinhala','English','Tamil'],
  skills:['Hospital Companion','Medication Collection','Stroke Care','First Aid','Emergency Support','Wheelchair Assistance','Elderly Wellness','Post-Surgery Care','Dementia Care','Home Visits'],
  verified:true, policeCleared:true, medCertified:true, vehicleAvail:true, emergencyReady:true,
  availability:'Available Now', lastActive:'Just now',
  joinedDate:'March 2018', repeatClients:47, trustScore:96,
  bio:"I've dedicated the last 8 years of my life to supporting elderly individuals and their families across Colombo with compassion, reliability, and professional care. I began my journey as a nursing assistant at Nawaloka Hospital, where I developed deep clinical knowledge and earned the trust of more than 80 families. I believe every elderly person deserves dignified, patient-centred care — and I bring that philosophy to every single visit.",
  carePhilosophy:"Dignity first. Every elderly person has a lifetime of stories, wisdom, and worth. My role is to support — never to impose. I adapt to each person's rhythm, culture, and values.",
  mission:"To bridge the distance between families abroad and their loved ones at home by providing the same quality of care that a daughter or son would give — with professionalism, warmth, and consistency.",
  travelRadius:'15 km',
  workingHours:'7:00 AM – 7:00 PM',
  badges:['Top Rated','Fast Response','Emergency Ready','Police Cleared','Community Choice','Most Trusted'],
  education:[
    { deg:'Diploma in Nursing Assistance', inst:'Sri Lanka Nursing Council (SLNC)', year:'2017', grade:'Distinction' },
    { deg:'Certificate in Elderly Care', inst:'NAITA', year:'2016', grade:'Pass with Merit' },
    { deg:'Certificate in First Aid & CPR', inst:'Red Cross Sri Lanka', year:'2018', grade:'Pass' },
  ],
}

const EXPERIENCE = [
  { org:'Nawaloka Hospital, Colombo', role:'Nursing Assistant', period:'Jan 2017 – Mar 2020', years:3, type:'Hospital', tasks:['Assisted 6–8 patients daily in post-operative ward','Administered medications under doctor supervision','Coordinated discharge planning with families','Trained 4 junior nursing assistants'], achievement:'Employee of the Quarter — Q2 2019' },
  { org:'ReadyPal — Freelance Care Agent', role:'Senior Care Agent', period:'Mar 2020 – Present', years:5, type:'Platform', tasks:['Completed 684 care assignments across Colombo & WP','Achieved 4.97 average rating across 327 verified reviews','Specialised in hospital companion and stroke recovery care','Developed client-specific care plans for 47 repeat clients'], achievement:'Top Rated Agent 2021, 2022, 2023, 2024' },
  { org:'Colombo 7 Elderly Volunteer Network', role:'Volunteer Caregiver', period:'Jun 2016 – Dec 2016', years:0.5, type:'Volunteer', tasks:['Weekly wellness visits to 12 homebound elderly residents','Coordinated with community health workers','Led awareness sessions on medication safety'], achievement:'Best Volunteer Award 2016' },
]

const CERTS = [
  { name:'Diploma in Nursing Assistance', issuer:'Sri Lanka Nursing Council', issued:'Oct 2017', expiry:'Oct 2027', status:'verified', id:'SLNC-2017-4821' },
  { name:'Certificate in First Aid & CPR', issuer:'Red Cross Sri Lanka', issued:'Feb 2018', expiry:'Feb 2026', status:'verified', id:'RC-LK-2018-0034' },
  { name:'Elderly Care Certificate', issuer:'NAITA Sri Lanka', issued:'Aug 2016', expiry:'Lifetime', status:'verified', id:'NAITA-EC-2016-0112' },
  { name:'Stroke Care & Rehabilitation Assist', issuer:'WHO Sri Lanka', issued:'May 2021', expiry:'May 2026', status:'verified', id:'WHO-SCR-2021-0067' },
  { name:'Dementia Care Certificate', issuer:'Alzheimer Lanka Foundation', issued:'Nov 2022', expiry:'Nov 2025', status:'expiring', id:'ALF-2022-0089' },
]

const REVIEWS = [
  { name:'Rohan Perera', location:'London, UK', rating:5, date:'12 Jan 2025', body:"Chamari has been a godsend for our family. My father is 81 and lives alone in Colombo. She manages his medications, accompanies him to Nawaloka for check-ups, and calls us on WhatsApp after every visit. We've never felt more at ease living abroad.", helpful:34, verified:true, service:'Hospital Companion' },
  { name:'Anjali Jayasinghe', location:'Sydney, AU', rating:5, date:'10 Jan 2025', body:"Exceptional. My grandmother had a stroke last year and Chamari stepped in with exactly the right skills. Patient, knowledgeable, and genuinely caring. She knew exactly when to push, when to rest, and when to call the doctor.", helpful:28, verified:true, service:'Stroke Care' },
  { name:'Pradeep Fernando', location:'Toronto, CA', rating:5, date:'8 Jan 2025', body:"5 stars aren't enough. Chamari managed my mother's diabetes care plan, coordinated with the doctor, and kept us updated daily. She's more reliable than any service we've tried before.", helpful:21, verified:true, service:'Medication Collection' },
  { name:'Dilshan Wickramasinghe', location:'Dubai, UAE', rating:5, date:'4 Jan 2025', body:"Hired Chamari for 3 months to support my father post-surgery. She arrived on time every single day, never missed a medication, and treated him like family. We're renewing for another 3 months.", helpful:19, verified:true, service:'Post-Surgery Care' },
  { name:'Meena Thirunavukarasu', location:'Melbourne, AU', rating:4, date:'2 Jan 2025', body:"Chamari is wonderful with my Tamil-speaking mother. The multilingual capability is rare and incredibly valuable. Docked one star only because there was a scheduling conflict in December — she was very apologetic and sorted it quickly.", helpful:11, verified:true, service:'Home Visits' },
]

const PRICING = [
  { service:'Standard Home Visit', rate:'LKR 3,500', unit:'per hour', note:'Min 2 hours', popular:false },
  { service:'Hospital Companion', rate:'LKR 4,000', unit:'per visit', note:'Up to 4 hours', popular:true },
  { service:'Full Day Care', rate:'LKR 8,500', unit:'per day', note:'Up to 10 hours', popular:false },
  { service:'Medication Collection', rate:'LKR 1,200', unit:'per trip', note:'Colombo only', popular:false },
  { service:'Emergency Call-Out', rate:'LKR 6,000', unit:'per visit', note:'Available 24/7', popular:false },
  { service:'Night Care', rate:'LKR 10,500', unit:'per night', note:'9 PM – 7 AM', popular:false },
  { service:'Transportation Assist', rate:'LKR 2,000', unit:'per trip', note:'Up to 30 km', popular:false },
]

const DOCS = [
  { name:'National Identity Card', type:'NIC', status:'verified', expiry:'—', size:'1.2 MB' },
  { name:'Police Clearance Certificate', type:'Police', status:'verified', expiry:'Mar 2026', size:'0.9 MB' },
  { name:'Medical Fitness Certificate', type:'Medical', status:'verified', expiry:'Oct 2025', size:'1.1 MB' },
  { name:'SLNC Nursing Certificate', type:'Certificate', status:'verified', expiry:'Oct 2027', size:'2.3 MB' },
  { name:'First Aid Certificate', type:'Certificate', status:'verified', expiry:'Feb 2026', size:'1.5 MB' },
  { name:'Professional Insurance', type:'Insurance', status:'verified', expiry:'Dec 2025', size:'1.8 MB' },
]

const FAQS = [
  { q:'Do you provide overnight care?', a:"Yes, I offer overnight care from 9 PM to 7 AM at LKR 10,500 per night. I am familiar with dementia-related night behaviour, sleep pattern disruptions, and nighttime medication needs." },
  { q:'Can you travel outside Colombo?', a:"I typically work within a 15 km radius of Colombo 07. For special assignments in the Greater Colombo area (e.g. Nugegoda, Rajagiriya, Maharagama), I can arrange travel at an additional LKR 500 fee." },
  { q:'Do you have first aid certification?', a:"Yes — I hold a current Red Cross First Aid & CPR certificate (renewed Feb 2024, valid until Feb 2026) and a WHO Stroke Care certificate valid until 2026." },
  { q:'What languages do you speak?', a:"I am fluent in Sinhala and English, and conversational in Tamil. This allows me to communicate clearly with a wide range of elderly clients and family members abroad." },
  { q:"What is your cancellation policy?", a:"I request at least 4 hours' notice for cancellations. Late cancellations (under 4 hours) may incur a 50% service charge to compensate for the reserved time." },
  { q:'How do you handle medical emergencies?', a:"I am trained in First Aid and CPR. In an emergency, I immediately contact the family, the doctor, and if required, emergency services. I never leave the client unattended during a crisis." },
  { q:'Do you work with Alzheimer and dementia patients?', a:"Yes. I have specific training in dementia care (Alzheimer Lanka Foundation, 2022) and have worked with several dementia patients. I use validated techniques like reminiscence therapy and familiar routine maintenance." },
]

const TIMELINE_EVENTS = [
  { date:'Mar 2018', event:'Joined ReadyPal', detail:'Created verified profile, passed identity checks', icon:I.user, color:C.primary },
  { date:'Apr 2018', event:'Identity Verified', detail:'NIC and address verified by ReadyPal team', icon:I.check, color:C.success },
  { date:'Jun 2018', event:'Police Clearance Approved', detail:'Certificate issued by Sri Lanka Police', icon:I.shield, color:C.success },
  { date:'Aug 2018', event:'First Job Completed', detail:'Hospital companion visit — rated 5 stars', icon:I.briefcase, color:C.primary },
  { date:'Feb 2019', event:'100th Job', detail:'Milestone reached with 4.95 average rating', icon:I.award, color:C.accent },
  { date:'Jan 2021', event:'Top Rated Badge', detail:'Awarded for consistently high ratings and response times', icon:I.zap, color:C.warning },
  { date:'Sep 2022', event:'500th Job', detail:'Became one of ReadyPal\'s most experienced agents', icon:I.medal, color:C.accent },
  { date:'Jan 2025', event:'684 Jobs · 4.97 Rating', detail:'Continuing to set the standard for care excellence', icon:I.star, color:C.primary },
]

const SIMILAR_AGENTS = [
  { name:'Priya Senanayake', city:'Kurunegala', rating:4.92, jobs:229, rate:3200, avail:'Available Now', skills:['Medication','Palliative Care'] },
  { name:'Nadeesha Silva', city:'Galle', rating:4.95, jobs:401, rate:4000, avail:'Available Now', skills:['Dementia Care','Hospital Companion'] },
  { name:'Anoma Wickramasinghe', city:'Matara', rating:4.88, jobs:278, rate:3500, avail:'Available Now', skills:['Dementia Care','Palliative Care'] },
]

// ─── Tab type ─────────────────────────────────────────────────────────────────
type Tab = 'overview'|'experience'|'skills'|'certifications'|'portfolio'|'reviews'|'availability'|'pricing'|'documents'|'faq'

const TABS: {key:Tab;label:string}[] = [
  {key:'overview',label:'Overview'}, {key:'experience',label:'Experience'}, {key:'skills',label:'Skills'},
  {key:'certifications',label:'Certifications'}, {key:'portfolio',label:'Portfolio'}, {key:'reviews',label:'Reviews'},
  {key:'availability',label:'Availability'}, {key:'pricing',label:'Pricing'}, {key:'documents',label:'Documents'}, {key:'faq',label:'FAQ'},
]

// ──────────────────────────────────────────────────────────────────────────────
// TAB CONTENT
// ──────────────────────────────────────────────────────────────────────────────

function OverviewTab() {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, alignItems:'start' }} className="cap-2col">
      {/* Summary */}
      <div style={{ padding:24, gridColumn:'span 2', background:C.surface, borderRadius:16, border:`1px solid ${C.border}`, boxShadow:'0 1px 4px rgba(44,62,67,0.06)' }} className="cap-full">
        <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:12, fontFamily:'Manrope,sans-serif' }}>Professional Summary</h3>
        <p style={{ fontSize:14, color:C.sub, lineHeight:1.75 }}>{AGENT.bio}</p>
        <div style={{ marginTop:16, padding:16, borderRadius:12, background:`${C.primary}06`, border:`1px solid ${C.primary}14` }}>
          <p style={{ fontSize:12, fontWeight:800, color:C.primary, marginBottom:6, textTransform:'uppercase', letterSpacing:'0.06em' }}>Care Philosophy</p>
          <p style={{ fontSize:13, color:C.sub, lineHeight:1.65, fontStyle:'italic' }}>"{AGENT.carePhilosophy}"</p>
        </div>
      </div>

      {/* Services */}
      <Card style={{ padding:22 }}>
        <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:14, fontFamily:'Manrope,sans-serif' }}>Services Offered</h3>
        <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
          {AGENT.skills.map(s=>(
            <div key={s} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, background:'#F9FAFB', border:`1px solid ${C.border}` }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:C.success, flexShrink:0 }} />
              <p style={{ fontSize:13, fontWeight:600, color:C.type }}>{s}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick facts */}
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <Card style={{ padding:22 }}>
          <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:12, fontFamily:'Manrope,sans-serif' }}>Quick Facts</h3>
          {[
            {label:'Experience',     val:`${AGENT.experience} years`,        icon:I.briefcase},
            {label:'Travel Radius',  val:AGENT.travelRadius,                 icon:I.pin},
            {label:'Working Hours',  val:AGENT.workingHours,                 icon:I.clock},
            {label:'Response Time',  val:`~${AGENT.responseTime}`,           icon:I.bolt},
            {label:'Languages',      val:AGENT.languages.join(', '),         icon:I.lang},
            {label:'Emergency',      val:AGENT.emergencyReady?'Available':'N/A', icon:I.shield},
            {label:'Vehicle',        val:AGENT.vehicleAvail?'Own vehicle':'—', icon:I.car},
          ].map(r=>(
            <div key={r.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 0', borderBottom:`1px solid ${C.border}` }}>
              <span style={{ display:'flex', alignItems:'center', gap:7, fontSize:13, color:C.muted }}><span style={{display:'flex',color:C.muted}}>{r.icon}</span>{r.label}</span>
              <span style={{ fontSize:13, fontWeight:700, color:C.type, textAlign:'right' as const, maxWidth:'55%' }}>{r.val}</span>
            </div>
          ))}
        </Card>

        <Card style={{ padding:22 }}>
          <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:12, fontFamily:'Manrope,sans-serif' }}>Education</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {AGENT.education.map((e,i)=>(
              <div key={i} style={{ padding:'10px 12px', borderRadius:10, background:'#F9FAFB', border:`1px solid ${C.border}` }}>
                <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:2 }}>{e.deg}</p>
                <p style={{ fontSize:11, color:C.muted }}>{e.inst} · {e.year} · {e.grade}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

function ExperienceTab() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
      {EXPERIENCE.map((exp,i)=>(
        <div key={i} style={{ display:'flex', gap:20 }}>
          {/* Timeline line */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
            <div style={{ width:40, height:40, borderRadius:'50%', background: exp.type==='Hospital'?`${C.primary}12`:exp.type==='Platform'?`${C.accent}12`:`${C.success}12`, display:'flex', alignItems:'center', justifyContent:'center', color:exp.type==='Hospital'?C.primary:exp.type==='Platform'?C.accent:C.success, flexShrink:0 }}>{I.briefcase}</div>
            {i<EXPERIENCE.length-1 && <div style={{ width:2, flex:1, minHeight:20, background:C.border, margin:'6px 0' }} />}
          </div>
          <Card style={{ flex:1, padding:22, marginBottom:i<EXPERIENCE.length-1?16:0 }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:8, marginBottom:6 }}>
              <div>
                <p style={{ fontSize:15, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:2 }}>{exp.org}</p>
                <p style={{ fontSize:13, fontWeight:600, color:C.primary }}>{exp.role}</p>
              </div>
              <div style={{ textAlign:'right' as const }}>
                <Bdg label={exp.period} color={C.sub} bg="#F2F4F5" />
                {exp.years>0 && <p style={{ fontSize:11, color:C.muted, marginTop:3 }}>{exp.years} year{exp.years!==1?'s':''}</p>}
              </div>
            </div>
            <ul style={{ paddingLeft:18, margin:'10px 0', display:'flex', flexDirection:'column', gap:5 }}>
              {exp.tasks.map((t,j)=><li key={j} style={{ fontSize:13, color:C.sub, lineHeight:1.55 }}>{t}</li>)}
            </ul>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:10, padding:'8px 12px', borderRadius:9, background:`${C.success}06`, border:`1px solid ${C.success}18` }}>
              <span style={{ color:C.success, display:'flex' }}>{I.award}</span>
              <p style={{ fontSize:12, fontWeight:700, color:C.success }}>{exp.achievement}</p>
            </div>
          </Card>
        </div>
      ))}
    </div>
  )
}

function SkillsTab() {
  const proficiency: Record<string,number> = {
    'Hospital Companion':99,'Medication Collection':97,'Stroke Care':95,
    'First Aid':96,'Emergency Support':93,'Wheelchair Assistance':91,
    'Elderly Wellness':97,'Post-Surgery Care':90,'Dementia Care':88,'Home Visits':99,
  }
  const groups = [
    { title:'Clinical & Medical', skills:['Hospital Companion','Medication Collection','Stroke Care','First Aid','Emergency Support','Post-Surgery Care','Dementia Care'] },
    { title:'Personal Care', skills:['Wheelchair Assistance','Elderly Wellness','Home Visits'] },
    { title:'Language Skills', skills:AGENT.languages },
  ]
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      {groups.map(g=>(
        <Card key={g.title} style={{ padding:24 }}>
          <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:16, fontFamily:'Manrope,sans-serif' }}>{g.title}</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {g.skills.map(s=>{
              const pct = proficiency[s] ?? 85
              return (
                <div key={s}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                    <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{s}</p>
                    <p style={{ fontSize:12, fontWeight:700, color:C.primary }}>{pct}%</p>
                  </div>
                  <div style={{ height:6, borderRadius:3, background:C.border, overflow:'hidden' }}>
                    <div style={{ width:`${pct}%`, height:'100%', borderRadius:3, background:`linear-gradient(90deg,${C.primary},#00959E)`, transition:'width 0.8s ease' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      ))}

      {/* Skill cards grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }} className="cap-3col">
        {AGENT.skills.map(s=>(
          <Card key={s} hover style={{ padding:'16px 18px', display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary, flexShrink:0 }}>{I.briefcase}</div>
            <div>
              <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{s}</p>
              <p style={{ fontSize:11, color:C.muted }}>Verified skill</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function CertificationsTab() {
  const statusColor: Record<string,string> = { verified:C.success, expiring:C.warning, expired:C.error }
  const statusLabel: Record<string,string> = { verified:'Verified', expiring:'Expiring Soon', expired:'Expired' }

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }} className="cap-2col">
      {CERTS.map((cert,i)=>{
        const sc = statusColor[cert.status]
        return (
          <Card key={i} hover style={{ padding:22 }}>
            <div style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
              <div style={{ width:48, height:48, borderRadius:13, background:`${sc}10`, display:'flex', alignItems:'center', justifyContent:'center', color:sc, flexShrink:0 }}>{I.award}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:3, fontFamily:'Manrope,sans-serif' }}>{cert.name}</p>
                <p style={{ fontSize:12, color:C.muted, marginBottom:8 }}>{cert.issuer}</p>
                <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:8 }}>
                  <Bdg label={statusLabel[cert.status]} color={sc} />
                  <Bdg label={`Issued ${cert.issued}`} color={C.sub} bg="#F2F4F5" />
                  {cert.expiry!=='Lifetime' && <Bdg label={`Expires ${cert.expiry}`} color={cert.status==='expiring'?C.warning:C.sub} bg={cert.status==='expiring'?`${C.warning}10`:'#F2F4F5'} />}
                </div>
                <p style={{ fontSize:10, color:C.muted, fontFamily:'Manrope,sans-serif' }}>ID: {cert.id}</p>
              </div>
            </div>
            <div style={{ display:'flex', gap:7, marginTop:14 }}>
              <button style={{ flex:1, padding:'7px', borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', fontSize:11, fontWeight:700, color:C.sub, fontFamily:'Manrope,sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:4 }}>{I.eye} Preview</button>
              <button style={{ flex:1, padding:'7px', borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', fontSize:11, fontWeight:700, color:C.sub, fontFamily:'Manrope,sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:4 }}>{I.download} Download</button>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

function PortfolioTab() {
  const items = [
    { label:'Completed Assignments', value:'684', color:C.primary },
    { label:'Hospitals Visited', value:'8', color:C.info },
    { label:'Repeat Clients', value:'47', color:C.success },
    { label:'Years Experience', value:'8', color:C.accent },
  ]
  const posts = [
    { title:'Hospital Companion — Nawaloka', date:'Jan 2025', tags:['Hospital Companion','5★'], desc:'Accompanied elderly client through full-day cardiology consultation and post-procedure recovery.' },
    { title:'Stroke Recovery — Home Programme', date:'Dec 2024', tags:['Stroke Care','4 weeks'], desc:'Supported daily physiotherapy exercises, medication routine, and emotional wellbeing for stroke patient over 4-week programme.' },
    { title:'Medication Management — Kurunegala', date:'Nov 2024', tags:['Medication','Dementia Care'], desc:'Established morning and evening medication routine for dementia patient. Coordinated with pharmacist for refills.' },
    { title:'Post-Surgery Companion', date:'Oct 2024', tags:['Post-Surgery','Wheelchair'], desc:'Full care support after hip replacement surgery — mobility assistance, wound check, physiotherapy guidance.' },
    { title:'Community Volunteer Day', date:'Sep 2024', tags:['Volunteer','Community'], desc:'Participated in ReadyPal Community Care Day at Colombo 07 — provided free wellness checks to 23 elderly residents.' },
    { title:'Emergency Night Call-Out', date:'Aug 2024', tags:['Emergency','Night Care'], desc:'Responded to emergency call at 11 PM for client with high fever. Coordinated with doctor, administered first aid, arranged hospital transfer.' },
  ]
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }} className="cap-4col">
        {items.map(it=>(
          <Card key={it.label} style={{ padding:18, textAlign:'center' }}>
            <p style={{ fontSize:28, fontWeight:900, color:it.color, fontFamily:'Manrope,sans-serif', letterSpacing:'-0.03em', marginBottom:4 }}>{it.value}</p>
            <p style={{ fontSize:12, color:C.muted, fontFamily:'Manrope,sans-serif' }}>{it.label}</p>
          </Card>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="cap-2col">
        {posts.map((p,i)=>(
          <Card key={i} hover style={{ padding:20 }}>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:8 }}>
              {p.tags.map(t=><Bdg key={t} label={t} color={C.primary} />)}
            </div>
            <p style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:4, fontFamily:'Manrope,sans-serif' }}>{p.title}</p>
            <p style={{ fontSize:13, color:C.sub, lineHeight:1.6, marginBottom:8 }}>{p.desc}</p>
            <p style={{ fontSize:11, color:C.muted }}>{p.date}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ReviewsTab() {
  const [filter, setFilter] = useState(0)
  const ratingBreakdown = [{ n:5, pct:94 },{ n:4, pct:4 },{ n:3, pct:1 },{ n:2, pct:1 },{ n:1, pct:0 }]
  const displayed = filter>0 ? REVIEWS.filter(r=>r.rating===filter) : REVIEWS

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {/* Summary card */}
      <Card style={{ padding:24 }}>
        <div style={{ display:'flex', gap:32, alignItems:'flex-start', flexWrap:'wrap' }}>
          <div style={{ textAlign:'center', flexShrink:0 }}>
            <p style={{ fontSize:56, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', letterSpacing:'-0.04em', lineHeight:1 }}>{AGENT.rating}</p>
            <Stars rating={AGENT.rating} />
            <p style={{ fontSize:12, color:C.muted, marginTop:4 }}>{AGENT.reviews} reviews</p>
          </div>
          <div style={{ flex:1, minWidth:200 }}>
            {ratingBreakdown.map(r=>(
              <div key={r.n} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                <div style={{ display:'flex', alignItems:'center', gap:3, width:24, flexShrink:0 }}>
                  <span style={{ fontSize:12, fontWeight:700, color:C.type }}>{r.n}</span>
                  <svg width="11" height="11" viewBox="0 0 13 13" fill="#F59E0B"><path d="M6.5 1l1.6 3.2 3.5.5-2.55 2.48.6 3.5L6.5 9l-3.15 1.68.6-3.5L1.4 4.7l3.5-.5z"/></svg>
                </div>
                <div style={{ flex:1, height:8, borderRadius:4, background:C.border, overflow:'hidden' }}>
                  <div style={{ width:`${r.pct}%`, height:'100%', borderRadius:4, background:'#F59E0B' }} />
                </div>
                <span style={{ fontSize:12, color:C.muted, width:32, flexShrink:0, textAlign:'right' as const }}>{r.pct}%</span>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8, flexShrink:0 }}>
            {[{label:'Trustworthy',pct:98},{label:'Punctual',pct:97},{label:'Professional',pct:99},{label:'Communicative',pct:96}].map(q=>(
              <div key={q.label} style={{ display:'flex', justifyContent:'space-between', gap:20 }}>
                <p style={{ fontSize:12, color:C.muted }}>{q.label}</p>
                <p style={{ fontSize:12, fontWeight:800, color:C.primary }}>{q.pct}%</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Filter chips */}
      <div style={{ display:'flex', gap:7 }}>
        {[0,5,4,3].map(n=>(
          <button key={n} onClick={()=>setFilter(n)} style={{ padding:'6px 14px', borderRadius:999, border:`1.5px solid ${filter===n?C.primary:C.border}`, background:filter===n?`${C.primary}08`:'transparent', cursor:'pointer', fontSize:12, fontWeight:700, color:filter===n?C.primary:C.sub, fontFamily:'Manrope,sans-serif' }}>
            {n===0?'All Reviews':`${n} Stars`}
          </button>
        ))}
        <p style={{ fontSize:12, color:C.muted, marginLeft:'auto', alignSelf:'center' }}>{displayed.length} review{displayed.length!==1?'s':''}</p>
      </div>

      {/* Review cards */}
      {displayed.map((r,i)=>(
        <Card key={i} style={{ padding:22 }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:10, flexWrap:'wrap', gap:10 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:'50%', background:`${C.primary}14`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:14, color:C.primary, fontFamily:'Manrope,sans-serif' }}>{r.name.split(' ').map(w=>w[0]).join('')}</div>
              <div>
                <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{r.name}</p>
                <p style={{ fontSize:12, color:C.muted }}>{r.location}</p>
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
              <Stars rating={r.rating} />
              <p style={{ fontSize:11, color:C.muted }}>{r.date}</p>
            </div>
          </div>
          <p style={{ fontSize:13, color:C.sub, lineHeight:1.7, marginBottom:12 }}>{r.body}</p>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
            <div style={{ display:'flex', gap:6 }}>
              <Bdg label={r.service} color={C.primary} />
              {r.verified && <Bdg label="Verified Review" icon={I.check} color={C.success} />}
            </div>
            <p style={{ fontSize:11, color:C.muted }}>{r.helpful} people found this helpful</p>
          </div>
        </Card>
      ))}
    </div>
  )
}

function AvailabilityTab() {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  const hours = ['6 AM','8 AM','10 AM','12 PM','2 PM','4 PM','6 PM','8 PM']
  const avail: Record<string,string[]> = {
    Mon:['6 AM','8 AM','10 AM','12 PM','2 PM','4 PM'],
    Tue:['8 AM','10 AM','12 PM','2 PM','4 PM'],
    Wed:['6 AM','8 AM','10 AM','12 PM','2 PM','4 PM','6 PM'],
    Thu:['8 AM','10 AM','12 PM'],
    Fri:['6 AM','8 AM','10 AM','12 PM','2 PM','4 PM'],
    Sat:['8 AM','10 AM'],
    Sun:[],
  }

  const months = ['January 2025']
  const calDays = Array.from({length:31},(_,i)=>i+1)
  const busyDays = [7,8,16,17,22,23,24]
  const partialDays = [5,12,19,26]

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {/* Next available */}
      <Card style={{ padding:20, background:`linear-gradient(135deg,${C.primary}08,${C.accent}04)`, border:`1px solid ${C.primary}18` }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:48, height:48, borderRadius:12, background:`${C.success}12`, display:'flex', alignItems:'center', justifyContent:'center', color:C.success }}>{I.calendar}</div>
          <div>
            <p style={{ fontSize:12, fontWeight:700, color:C.muted, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:3 }}>Next Available Slot</p>
            <p style={{ fontSize:16, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Today · 2:00 PM – 6:00 PM</p>
            <p style={{ fontSize:12, color:C.success, fontWeight:700 }}>Available Now · Response ~{AGENT.responseTime}</p>
          </div>
        </div>
      </Card>

      {/* Weekly grid */}
      <Card style={{ padding:22, overflowX:'auto' }}>
        <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:16, fontFamily:'Manrope,sans-serif' }}>Weekly Schedule</h3>
        <div style={{ overflowX:'auto' }}>
          <table style={{ borderCollapse:'collapse', minWidth:500, width:'100%' }}>
            <thead>
              <tr>
                <th style={{ width:70, padding:'6px 8px', fontSize:11, fontWeight:700, color:C.muted, textAlign:'left' as const }}>Time</th>
                {days.map(d=><th key={d} style={{ padding:'6px 8px', fontSize:11, fontWeight:700, color:C.muted, textAlign:'center' as const, minWidth:60 }}>{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {hours.map(h=>(
                <tr key={h}>
                  <td style={{ padding:'5px 8px', fontSize:11, color:C.muted, whiteSpace:'nowrap' as const }}>{h}</td>
                  {days.map(d=>{
                    const on=avail[d]?.includes(h)
                    return <td key={d} style={{ padding:3, textAlign:'center' as const }}>
                      <div style={{ width:'100%', height:22, borderRadius:5, background:on?`${C.success}18`:d==='Sun'?`${C.muted}08`:'#F9FAFB', border:`1px solid ${on?C.success+'30':C.border}` }} />
                    </td>
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display:'flex', gap:16, marginTop:12 }}>
          {[{c:`${C.success}18`,b:`${C.success}30`,l:'Available'},{c:'#F9FAFB',b:C.border,l:'Unavailable'}].map(leg=>(
            <div key={leg.l} style={{ display:'flex', alignItems:'center', gap:6 }}>
              <div style={{ width:16, height:10, borderRadius:3, background:leg.c, border:`1px solid ${leg.b}` }} />
              <p style={{ fontSize:11, color:C.muted }}>{leg.l}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Calendar */}
      <Card style={{ padding:22 }}>
        <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:16, fontFamily:'Manrope,sans-serif' }}>Monthly Calendar — {months[0]}</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4 }}>
          {['M','T','W','T','F','S','S'].map((d,i)=><div key={i} style={{ textAlign:'center' as const, fontSize:11, fontWeight:700, color:C.muted, padding:'4px 0' }}>{d}</div>)}
          {Array.from({length:2}).map((_,i)=><div key={`p${i}`} />)}
          {calDays.map(d=>{
            const busy=busyDays.includes(d), partial=partialDays.includes(d), today=d===13
            const bg=busy?`${C.error}10`:partial?`${C.warning}10`:today?C.primary:`${C.success}10`
            const color=busy?C.error:partial?C.warning:today?'#fff':C.success
            return (
              <div key={d} style={{ aspectRatio:'1', borderRadius:8, background:bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:today?900:600, color, cursor:'pointer', border:today?`2px solid ${C.primary}`:'1px solid transparent', transition:'all 0.15s' }}>{d}</div>
            )
          })}
        </div>
        <div style={{ display:'flex', gap:14, marginTop:12, flexWrap:'wrap' }}>
          {[{c:`${C.success}10`,l:'Available'},{c:`${C.warning}10`,l:'Partial'},{c:`${C.error}10`,l:'Busy'},{c:C.primary,l:'Today',text:'#fff'}].map(leg=>(
            <div key={leg.l} style={{ display:'flex', alignItems:'center', gap:5 }}>
              <div style={{ width:14, height:14, borderRadius:4, background:leg.c }} />
              <p style={{ fontSize:11, color:C.muted }}>{leg.l}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function PricingTab() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      {/* Info banner */}
      <div style={{ padding:'12px 16px', borderRadius:12, background:`${C.info}08`, border:`1px solid ${C.info}18`, display:'flex', gap:10, alignItems:'center' }}>
        {I.info}
        <p style={{ fontSize:13, color:C.sub, lineHeight:1.5 }}>All rates are negotiable for long-term arrangements (4+ weeks). A <strong>15% ReadyPal platform fee</strong> is added at checkout. Emergency rates apply outside 7 AM – 7 PM.</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }} className="cap-3col">
        {PRICING.map((p,i)=>(
          <Card key={i} hover style={{ padding:20, border:p.popular?`2px solid ${C.primary}`:undefined, position:'relative', overflow:'hidden' }}>
            {p.popular && <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${C.primary},${C.accent})` }} />}
            {p.popular && (
              <div style={{ position:'absolute', top:12, right:12 }}>
                <Bdg label="Most Popular" color={C.primary} />
              </div>
            )}
            <p style={{ fontSize:13, fontWeight:700, color:C.muted, marginBottom:8, fontFamily:'Manrope,sans-serif' }}>{p.service}</p>
            <p style={{ fontSize:26, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', letterSpacing:'-0.025em', marginBottom:2 }}>{p.rate}</p>
            <p style={{ fontSize:12, color:C.muted, marginBottom:10 }}>{p.unit}</p>
            <p style={{ fontSize:11, color:C.muted, padding:'5px 8px', borderRadius:6, background:'#F2F4F5', display:'inline-block' }}>{p.note}</p>
          </Card>
        ))}
      </div>

      <Card style={{ padding:20 }}>
        <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:12, fontFamily:'Manrope,sans-serif' }}>Travel Charges</h3>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }} className="cap-3col">
          {[{zone:'Within 5 km',rate:'Free'},{zone:'5–10 km',rate:'LKR 300'},{zone:'10–15 km',rate:'LKR 600'}].map(z=>(
            <div key={z.zone} style={{ padding:'12px 14px', borderRadius:10, background:'#F9FAFB', border:`1px solid ${C.border}` }}>
              <p style={{ fontSize:12, color:C.muted, marginBottom:3 }}>{z.zone}</p>
              <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{z.rate}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function DocumentsTab() {
  const typeColor: Record<string,string> = { NIC:C.primary, Police:C.success, Medical:C.error, Certificate:C.accent, Insurance:C.info }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <div style={{ padding:'12px 16px', borderRadius:12, background:`${C.success}06`, border:`1px solid ${C.success}18`, display:'flex', gap:10, alignItems:'center' }}>
        <span style={{ color:C.success, display:'flex' }}>{I.check}</span>
        <p style={{ fontSize:13, color:C.sub }}>All verification documents are reviewed and approved by the ReadyPal Trust & Safety team.</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="cap-2col">
        {DOCS.map((d,i)=>{
          const cc = typeColor[d.type]??C.muted
          return (
            <Card key={i} style={{ padding:20 }}>
              <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                <div style={{ width:44, height:44, borderRadius:12, background:`${cc}12`, display:'flex', alignItems:'center', justifyContent:'center', color:cc, flexShrink:0 }}>{I.doc}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:13, fontWeight:800, color:C.type, marginBottom:4, fontFamily:'Manrope,sans-serif' }}>{d.name}</p>
                  <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:4 }}>
                    <Bdg label="Verified" icon={I.check} color={C.success} />
                    {d.expiry!=='—'&&<Bdg label={`Expires ${d.expiry}`} color={C.sub} bg="#F2F4F5" />}
                    <span style={{ fontSize:10, color:C.muted }}>{d.size}</span>
                  </div>
                </div>
                <div style={{ display:'flex', gap:4 }}>
                  <button style={{ width:30,height:30,borderRadius:8,border:`1px solid ${C.border}`,background:'transparent',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:C.muted }}>{I.eye}</button>
                  <button style={{ width:30,height:30,borderRadius:8,border:`1px solid ${C.border}`,background:'transparent',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:C.muted }}>{I.download}</button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function FAQTab() {
  const [open, setOpen] = useState<number|null>(0)
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8, maxWidth:720 }}>
      {FAQS.map((faq,i)=>(
        <Card key={i} style={{ overflow:'hidden' }}>
          <button onClick={()=>setOpen(open===i?null:i)} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', border:'none', background:'transparent', cursor:'pointer', textAlign:'left' as const }}>
            <p style={{ fontSize:14, fontWeight:700, color: open===i?C.primary:C.type, fontFamily:'Manrope,sans-serif', paddingRight:16 }}>{faq.q}</p>
            <span style={{ color:C.muted, display:'flex', transition:'transform 0.2s', transform: open===i?'rotate(180deg)':undefined, flexShrink:0 }}>{I.chevronD}</span>
          </button>
          {open===i && (
            <div style={{ padding:'0 20px 18px' }}>
              <p style={{ fontSize:13, color:C.sub, lineHeight:1.7 }}>{faq.a}</p>
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}

// ─── Trust Score Card ─────────────────────────────────────────────────────────
function TrustScoreCard() {
  const factors = [
    { label:'Identity Verified',   pct:100, on:true },
    { label:'Police Cleared',       pct:100, on:true },
    { label:'Medical Certified',    pct:100, on:true },
    { label:'Document Verified',    pct:100, on:true },
    { label:'Experience (8 yrs)',   pct:93,  on:true },
    { label:'Rating (4.97)',        pct:99,  on:true },
    { label:'Repeat Clients (47)',  pct:94,  on:true },
    { label:'Response Time (8 min)',pct:96,  on:true },
  ]
  return (
    <Card style={{ padding:22 }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
        <div style={{ width:52, height:52, borderRadius:'50%', background:`linear-gradient(135deg,${C.primary},${C.accent})`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <p style={{ fontSize:16, fontWeight:900, color:'#fff', fontFamily:'Manrope,sans-serif' }}>{AGENT.trustScore}</p>
        </div>
        <div>
          <p style={{ fontSize:15, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Trust Score</p>
          <p style={{ fontSize:12, color:C.success, fontWeight:700 }}>Exceptional · Top 2% of agents</p>
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
        {factors.map(f=>(
          <div key={f.label}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
              <p style={{ fontSize:12, color:C.sub, display:'flex', alignItems:'center', gap:5 }}>
                <span style={{ color:f.on?C.success:C.muted, display:'flex' }}>{I.check}</span>{f.label}
              </p>
              <p style={{ fontSize:11, fontWeight:700, color:f.pct===100?C.success:C.primary }}>{f.pct}%</p>
            </div>
            <div style={{ height:4, borderRadius:2, background:C.border, overflow:'hidden' }}>
              <div style={{ width:`${f.pct}%`, height:'100%', borderRadius:2, background:f.pct===100?C.success:C.primary }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ─── Contact card ─────────────────────────────────────────────────────────────
function ContactCard({ onHire }: { onHire:()=>void }) {
  return (
    <Card style={{ padding:22 }}>
      <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:14, fontFamily:'Manrope,sans-serif' }}>Get in Touch</h3>
      <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
        <button onClick={onHire} style={{ width:'100%', padding:'12px', borderRadius:11, border:'none', background:`linear-gradient(135deg,${C.primary},#00959E)`, cursor:'pointer', fontSize:14, fontWeight:800, color:'#fff', fontFamily:'Manrope,sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
          {I.bolt} Hire Chamari Now
        </button>
        <button style={{ width:'100%', padding:'11px', borderRadius:11, border:`1.5px solid ${C.border}`, background:'transparent', cursor:'pointer', fontSize:13, fontWeight:700, color:C.type, fontFamily:'Manrope,sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
          {I.mail} Send Inquiry
        </button>
        <button style={{ width:'100%', padding:'11px', borderRadius:11, border:`1.5px solid ${C.border}`, background:'transparent', cursor:'pointer', fontSize:13, fontWeight:700, color:C.type, fontFamily:'Manrope,sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
          {I.phone} Request Call
        </button>
        <button style={{ width:'100%', padding:'11px', borderRadius:11, border:`1.5px solid ${C.border}`, background:'transparent', cursor:'pointer', fontSize:13, fontWeight:700, color:C.sub, fontFamily:'Manrope,sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
          {I.share} Share Profile
        </button>
      </div>
      <div style={{ marginTop:14, padding:'10px 12px', borderRadius:10, background:`${C.success}07`, border:`1px solid ${C.success}18`, display:'flex', gap:8, alignItems:'center' }}>
        <span style={{ color:C.success, display:'flex' }}>{I.clock}</span>
        <p style={{ fontSize:12, color:C.success, fontWeight:700 }}>Usually responds in ~{AGENT.responseTime}</p>
      </div>
    </Card>
  )
}

// ─── Related agents ───────────────────────────────────────────────────────────
function RelatedAgents({ onBack }: { onBack:()=>void }) {
  return (
    <div style={{ padding:'28px 28px 0' }}>
      <h3 style={{ fontSize:16, fontWeight:800, color:C.type, marginBottom:14, fontFamily:'Manrope,sans-serif' }}>Similar Agents</h3>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }} className="cap-3col">
        {SIMILAR_AGENTS.map((a,i)=>(
          <Card key={i} hover style={{ padding:18 }}>
            <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:10 }}>
              <div style={{ width:44, height:44, borderRadius:'50%', background:`${C.primary}14`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:16, color:C.primary, fontFamily:'Manrope,sans-serif', flexShrink:0 }}>{a.name.split(' ').map(w=>w[0]).join('')}</div>
              <div>
                <p style={{ fontSize:13, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{a.name}</p>
                <p style={{ fontSize:11, color:C.muted }}>{a.city}</p>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:8 }}>
              <Stars rating={a.rating} />
              <span style={{ fontSize:12, fontWeight:700, color:C.type }}>{a.rating}</span>
              <span style={{ fontSize:11, color:C.muted }}>({a.jobs} jobs)</span>
            </div>
            <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:10 }}>
              {a.skills.map(s=><Bdg key={s} label={s} color={C.primary} />)}
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <p style={{ fontSize:13, fontWeight:900, color:C.type }}>LKR {a.rate.toLocaleString()}<span style={{fontSize:10,fontWeight:500,color:C.muted}}>/hr</span></p>
              <Bdg label={a.avail} color={C.success} />
            </div>
            <button onClick={onBack} style={{ width:'100%', marginTop:10, padding:'8px', borderRadius:9, border:'none', background:`${C.primary}10`, cursor:'pointer', fontSize:12, fontWeight:700, color:C.primary, fontFamily:'Manrope,sans-serif' }}>View Profile</button>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Timeline ─────────────────────────────────────────────────────────────────
function JourneyTimeline() {
  return (
    <Card style={{ padding:24 }}>
      <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:18, fontFamily:'Manrope,sans-serif' }}>Professional Journey</h3>
      <div style={{ display:'flex', flexDirection:'column' }}>
        {TIMELINE_EVENTS.map((ev,i)=>(
          <div key={i} style={{ display:'flex', gap:14 }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
              <div style={{ width:34, height:34, borderRadius:'50%', background:`${ev.color}12`, display:'flex', alignItems:'center', justifyContent:'center', color:ev.color, flexShrink:0 }}>{ev.icon}</div>
              {i<TIMELINE_EVENTS.length-1&&<div style={{ width:2, flex:1, minHeight:14, background:C.border, margin:'4px 0' }} />}
            </div>
            <div style={{ paddingBottom: i<TIMELINE_EVENTS.length-1?18:0, flex:1 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
                <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{ev.event}</p>
                <Bdg label={ev.date} color={C.muted} bg="#F2F4F5" />
              </div>
              <p style={{ fontSize:12, color:C.muted }}>{ev.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// ROOT
// ──────────────────────────────────────────────────────────────────────────────
export default function CareAgentProfile() {
  const [tab, setTab] = useState<Tab>('overview')
  const [fav, setFav] = useState(false)
  const [hired, setHired] = useState(false)

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:C.bg, fontFamily:'Manrope,sans-serif' }}>

      {/* ── HERO HEADER ── */}
      <div style={{ background:`linear-gradient(155deg,${C.type} 0%,#1A3038 45%,#00373B 100%)`, position:'relative', overflow:'hidden' }}>
        {/* BG decorations */}
        <div aria-hidden style={{ position:'absolute', top:-80, right:-80, width:320, height:320, borderRadius:'50%', background:`${C.primary}18`, pointerEvents:'none' }} />
        <div aria-hidden style={{ position:'absolute', bottom:-40, left:-40, width:200, height:200, borderRadius:'50%', background:`${C.accent}10`, pointerEvents:'none' }} />

        <div style={{ padding:'28px 28px 0', maxWidth:1200, margin:'0 auto', width:'100%', boxSizing:'border-box' as const }}>
          {/* Back */}
          <button style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', borderRadius:9, border:'1.5px solid rgba(255,255,255,0.20)', background:'rgba(255,255,255,0.08)', cursor:'pointer', color:'rgba(255,255,255,0.80)', fontSize:12, fontWeight:700, fontFamily:'Manrope,sans-serif', marginBottom:20, backdropFilter:'blur(8px)' }}>
            {I.chevronL} Back to Browse
          </button>

          <div style={{ display:'flex', gap:28, alignItems:'flex-start', flexWrap:'wrap' }} className="cap-hero-row">
            {/* Avatar block */}
            <div style={{ position:'relative', flexShrink:0 }}>
              <div style={{ width:120, height:120, borderRadius:'50%', background:`linear-gradient(135deg,${C.primary}40,${C.accent}30)`, border:'3px solid rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:42, fontWeight:900, color:'#fff', fontFamily:'Manrope,sans-serif' }}>
                CD
              </div>
              <div style={{ position:'absolute', bottom:4, right:4, width:20, height:20, borderRadius:'50%', background:C.success, border:'2.5px solid #1A3038' }} />
              <div style={{ position:'absolute', top:-4, right:-4, width:28, height:28, borderRadius:'50%', background:C.primary, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ color:'#fff', display:'flex', transform:'scale(0.9)' }}>{I.check}</span>
              </div>
            </div>

            {/* Info block */}
            <div style={{ flex:1, minWidth:280 }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:12, flexWrap:'wrap', marginBottom:6 }}>
                <h1 style={{ fontSize:32, fontWeight:900, color:'#fff', letterSpacing:'-0.025em', fontFamily:'Manrope,sans-serif', lineHeight:1 }}>{AGENT.name}</h1>
                <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'4px 10px', borderRadius:999, background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.22)', fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.85)', marginTop:6 }}>
                  {I.ai} 98% Match
                </span>
              </div>
              <p style={{ fontSize:14, color:'rgba(255,255,255,0.65)', marginBottom:12 }}>{AGENT.title}</p>

              {/* Stats row */}
              <div style={{ display:'flex', gap:20, flexWrap:'wrap', marginBottom:14 }}>
                {[
                  {v:AGENT.rating.toString(), l:'Rating', icon:I.star},
                  {v:AGENT.reviews.toString(), l:'Reviews'},
                  {v:AGENT.jobs.toString(), l:'Jobs'},
                  {v:`${AGENT.experience} yrs`, l:'Experience'},
                  {v:`~${AGENT.responseTime}`, l:'Response'},
                ].map(s=>(
                  <div key={s.l} style={{ display:'flex', flexDirection:'column', alignItems:'flex-start' }}>
                    <p style={{ fontSize:18, fontWeight:900, color:'#fff', fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:2 }}>{s.v}</p>
                    <p style={{ fontSize:10, color:'rgba(255,255,255,0.50)', textTransform:'uppercase', letterSpacing:'0.06em' }}>{s.l}</p>
                  </div>
                ))}
              </div>

              {/* Meta */}
              <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:14 }}>
                <span style={{ fontSize:12, color:'rgba(255,255,255,0.65)', display:'flex', alignItems:'center', gap:4 }}>{I.pin}{AGENT.city}</span>
                <span style={{ fontSize:12, color:'rgba(255,255,255,0.65)', display:'flex', alignItems:'center', gap:4 }}>{I.lang}{AGENT.languages.join(', ')}</span>
                <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 10px', borderRadius:999, background:'rgba(34,197,94,0.15)', border:'1px solid rgba(34,197,94,0.30)', fontSize:11, fontWeight:700, color:'#86EFAC' }}>
                  <div style={{ width:7, height:7, borderRadius:'50%', background:C.success }} />
                  {AGENT.availability}
                </span>
              </div>

              {/* Verification badges */}
              <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:18 }}>
                <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'4px 10px', borderRadius:999, background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.25)', fontSize:11, fontWeight:700, color:'#86EFAC' }}>{I.check} Identity Verified</span>
                <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'4px 10px', borderRadius:999, background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.25)', fontSize:11, fontWeight:700, color:'#86EFAC' }}>{I.shield} Police Cleared</span>
                <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'4px 10px', borderRadius:999, background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.25)', fontSize:11, fontWeight:700, color:'#86EFAC' }}>{I.medal} Med Certified</span>
                <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'4px 10px', borderRadius:999, background:'rgba(238,129,83,0.14)', border:'1px solid rgba(238,129,83,0.28)', fontSize:11, fontWeight:700, color:'#FDBA74' }}>{I.car} Own Vehicle</span>
              </div>

              {/* CTA buttons */}
              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                <button onClick={()=>setHired(true)} style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 24px', borderRadius:12, border:'none', background:`linear-gradient(135deg,${C.primary},#00959E)`, cursor:'pointer', fontSize:14, fontWeight:800, color:'#fff', fontFamily:'Manrope,sans-serif', boxShadow:`0 4px 20px ${C.primary}50`, transition:'all 0.15s' }}>
                  {I.bolt} Hire Now
                </button>
                <button style={{ display:'flex', alignItems:'center', gap:7, padding:'12px 20px', borderRadius:12, border:'1.5px solid rgba(255,255,255,0.25)', background:'rgba(255,255,255,0.10)', cursor:'pointer', fontSize:13, fontWeight:700, color:'#fff', fontFamily:'Manrope,sans-serif', backdropFilter:'blur(8px)' }}>
                  {I.mail} Send Inquiry
                </button>
                <button onClick={()=>setFav(v=>!v)} style={{ width:44, height:44, borderRadius:12, border:'1.5px solid rgba(255,255,255,0.20)', background:'rgba(255,255,255,0.10)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:fav?C.error:'rgba(255,255,255,0.80)', backdropFilter:'blur(8px)' }}>{fav?I.heartFill:I.heart}</button>
                <button style={{ width:44, height:44, borderRadius:12, border:'1.5px solid rgba(255,255,255,0.20)', background:'rgba(255,255,255,0.10)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.80)', backdropFilter:'blur(8px)' }}>{I.share}</button>
              </div>
            </div>

            {/* Price card */}
            <div style={{ flexShrink:0, width:180 }}>
              <div style={{ padding:'16px 18px', borderRadius:14, background:'rgba(255,255,255,0.10)', border:'1px solid rgba(255,255,255,0.18)', backdropFilter:'blur(12px)', textAlign:'center' as const }}>
                <p style={{ fontSize:11, color:'rgba(255,255,255,0.55)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>From</p>
                <p style={{ fontSize:28, fontWeight:900, color:'#fff', fontFamily:'Manrope,sans-serif', letterSpacing:'-0.02em', lineHeight:1 }}>LKR {AGENT.hourlyRate.toLocaleString()}</p>
                <p style={{ fontSize:12, color:'rgba(255,255,255,0.55)', marginBottom:12 }}>per hour</p>
                <p style={{ fontSize:22, fontWeight:900, color:'rgba(255,255,255,0.85)', fontFamily:'Manrope,sans-serif', letterSpacing:'-0.02em', lineHeight:1 }}>LKR {AGENT.dailyRate.toLocaleString()}</p>
                <p style={{ fontSize:12, color:'rgba(255,255,255,0.45)' }}>per day</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display:'flex', gap:0, marginTop:20, overflowX:'auto', scrollbarWidth:'none' as const }}>
            {TABS.map(t=>(
              <button key={t.key} onClick={()=>setTab(t.key)} style={{ padding:'12px 18px', border:'none', background:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:tab===t.key?800:500, color:tab===t.key?'#fff':'rgba(255,255,255,0.50)', borderBottom:tab===t.key?'2px solid #fff':'2px solid transparent', transition:'all 0.15s', whiteSpace:'nowrap' as const }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ flex:1, padding:'24px 28px 60px', maxWidth:1200, margin:'0 auto', width:'100%', boxSizing:'border-box' as const, display:'flex', gap:24, alignItems:'start' }}>
        {/* Main content */}
        <div style={{ flex:1, minWidth:0 }}>
          {tab==='overview'       && <OverviewTab />}
          {tab==='experience'     && <ExperienceTab />}
          {tab==='skills'         && <SkillsTab />}
          {tab==='certifications' && <CertificationsTab />}
          {tab==='portfolio'      && <PortfolioTab />}
          {tab==='reviews'        && <ReviewsTab />}
          {tab==='availability'   && <AvailabilityTab />}
          {tab==='pricing'        && <PricingTab />}
          {tab==='documents'      && <DocumentsTab />}
          {tab==='faq'            && <FAQTab />}
        </div>

        {/* Right sidebar */}
        <div style={{ width:280, flexShrink:0, display:'flex', flexDirection:'column', gap:18 }} className="cap-sidebar-hide">
          <ContactCard onHire={()=>setHired(true)} />
          <TrustScoreCard />
          <JourneyTimeline />
        </div>
      </div>

      {/* Related agents */}
      <RelatedAgents onBack={()=>{}} />
      <div style={{ height:48 }} />

      {/* Hire success toast */}
      {hired && (
        <div style={{ position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)', zIndex:200 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 20px', borderRadius:14, background:C.type, boxShadow:'0 8px 32px rgba(0,0,0,0.24)', border:'1px solid rgba(255,255,255,0.10)' }}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:`${C.success}20`, display:'flex', alignItems:'center', justifyContent:'center', color:C.success }}>{I.check}</div>
            <div>
              <p style={{ fontSize:13, fontWeight:800, color:'#fff', fontFamily:'Manrope,sans-serif' }}>Care Request Sent!</p>
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.55)' }}>Chamari will respond within ~{AGENT.responseTime}</p>
            </div>
            <button onClick={()=>setHired(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.40)', marginLeft:8, display:'flex' }}>{I.close}</button>
          </div>
        </div>
      )}
    </div>
  )
}
