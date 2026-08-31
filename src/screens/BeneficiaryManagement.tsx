import { useState, useEffect, type ReactNode, type CSSProperties } from 'react'
import { supabase } from '../lib/supabaseClient'
import { getBeneficiariesFull } from '../lib/api'
import logoFull from '@/imports/20260723_170707.png'

// ─── Brand ────────────────────────────────────────────────────────────────────
const C = {
  primary:'#00737A', accent:'#EE8153', type:'#2C3E43', sub:'#6B7E85',
  muted:'#9AAAB0', border:'#E4E8EA', bg:'#F2F4F5', surface:'#FFFFFF',
  success:'#22C55E', warning:'#F59E0B', error:'#EF4444', info:'#3B82F6',
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const I: Record<string, ReactNode> = {
  user:      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.4"/><path d="M2 14c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  users:     <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M1 13c0-2.76 2.24-5 5-5M11 7a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM15 13c0-2.76-1.79-5-4-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  plus:      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  search:    <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.4"/><path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  filter:    <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M1.5 4h12M4 7.5h7M6.5 11h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  check:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5l3 3 6-6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevronR:  <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M5.5 3l5 4.5-5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevronL:  <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M9.5 3l-5 4.5 5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevronD:  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  close:     <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 2l11 11M13 2L2 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  edit:      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9.5 2l2.5 2.5L4.5 12H2v-2.5L9.5 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  trash:     <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3.5h10M5.5 3.5V2h3v1.5M4 3.5l.7 8h4.6l.7-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  archive:   <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="2" width="11" height="3" rx="1" stroke="currentColor" strokeWidth="1.3"/><path d="M2.5 5v6.5A1 1 0 0 0 3.5 12.5h7a1 1 0 0 0 1-1V5M5.5 8h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  pin:       <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1A3.5 3.5 0 0 1 10.5 4.5C10.5 7.5 7 12 7 12S3.5 7.5 3.5 4.5A3.5 3.5 0 0 1 7 1z" stroke="currentColor" strokeWidth="1.3"/><circle cx="7" cy="4.5" r="1.2" stroke="currentColor" strokeWidth="1.2"/></svg>,
  calendar:  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="2.5" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M1.5 6h11M4.5 1.5V3M9.5 1.5V3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  heart:     <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 12s-5.5-3.5-5.5-7A3.5 3.5 0 0 1 7 3.2 3.5 3.5 0 0 1 12.5 5c0 3.5-5.5 7-5.5 7z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  pill:      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2.5" y="5.5" width="9" height="3" rx="1.5" stroke="currentColor" strokeWidth="1.3" transform="rotate(-45 7 7)"/><path d="M5 9l4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  doc:       <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8.5 1.5H3.5A1.5 1.5 0 0 0 2 3v8a1.5 1.5 0 0 0 1.5 1.5h7A1.5 1.5 0 0 0 12 11V5L8.5 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M8.5 1.5V5H12M5 7.5h4M5 9.5h2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  upload:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 10v1.5A1.5 1.5 0 0 0 4 13h6a1.5 1.5 0 0 0 1.5-1.5V10M7 2v7M4.5 4.5L7 2l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  download:  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 10v1.5A1.5 1.5 0 0 0 4 13h6a1.5 1.5 0 0 0 1.5-1.5V10M7 2v7M4.5 6.5L7 9l2.5-2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  phone:     <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 1.5h4a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.3"/><circle cx="5.5" cy="10" r=".6" fill="currentColor"/></svg>,
  mail:      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="3" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M1.5 5l6 4 6-4" stroke="currentColor" strokeWidth="1.3"/></svg>,
  shield:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5l5 1.8v4C12 10 9.5 12 7 13c-2.5-1-5-3-5-5.7v-4L7 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  clock:     <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3"/><path d="M7 4.5V7.5l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  heartbeat: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1.5 7h3L6 5l2 4 1.5-2H12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  info:      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3"/><path d="M7 6v4M7 4.5V5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  warning:   <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2L1.5 12h11L7 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M7 6.5v2.5M7 10.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  note:      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h7A1.5 1.5 0 0 1 12 3.5v7l-3.5 2.5H3.5A1.5 1.5 0 0 1 2 11.5V3.5z" stroke="currentColor" strokeWidth="1.3"/><path d="M5 5.5h4M5 7.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  star:      <svg width="12" height="12" viewBox="0 0 12 12" fill="#F59E0B"><path d="M6 1l1.5 3 3.5.5-2.5 2.5.6 3.5L6 9 2.9 10.5l.6-3.5L1 4.5 4.5 4z"/></svg>,
  moreV:     <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="3" r="1.2" fill="currentColor"/><circle cx="7" cy="7" r="1.2" fill="currentColor"/><circle cx="7" cy="11" r="1.2" fill="currentColor"/></svg>,
  eye:       <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1.5 7S3.5 3 7 3s5.5 4 5.5 4-2 4-5.5 4-5.5-4-5.5-4z" stroke="currentColor" strokeWidth="1.3"/><circle cx="7" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.2"/></svg>,
  save:      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 2h7.5L12.5 4v8A1.5 1.5 0 0 1 11 13.5H3A1.5 1.5 0 0 1 1.5 12V3.5A1.5 1.5 0 0 1 2.5 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M4.5 2v3.5h5V2M7 8v3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  globe:     <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3"/><path d="M7 1.5c0 0-2 2-2 5.5s2 5.5 2 5.5M7 1.5c0 0 2 2 2 5.5s-2 5.5-2 5.5M1.5 7h11" stroke="currentColor" strokeWidth="1.1"/></svg>,
  refresh:   <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M12 7a5 5 0 1 1-1.17-3.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M12 3v2.5H9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  requests:  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11 7.5H3.5A1.5 1.5 0 0 0 2 9v2.5A1.5 1.5 0 0 0 3.5 13H11a1.5 1.5 0 0 0 1.5-1.5V9A1.5 1.5 0 0 0 11 7.5z" stroke="currentColor" strokeWidth="1.3"/><path d="M4.5 7.5V5A2.5 2.5 0 0 1 9.5 5v2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
}

// ─── Shared primitives ─────────────────────────────────────────────────────────
function Card({ children, style={}, hover=false, onClick }: { children:ReactNode; style?:CSSProperties; hover?:boolean; onClick?:()=>void }) {
  const [h, setH] = useState(false)
  return (
    <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ background:C.surface, borderRadius:16, border:`1px solid ${C.border}`, boxShadow: h&&hover ? '0 8px 28px rgba(44,62,67,0.12)':'0 1px 4px rgba(44,62,67,0.06)', transition:'all 0.2s', transform: h&&hover?'translateY(-2px)':undefined, cursor:onClick?'pointer':undefined, ...style }}>
      {children}
    </div>
  )
}

function Btn({ label, onClick, variant='primary', icon, disabled=false, small=false }: {
  label:string; onClick?:()=>void; variant?:'primary'|'secondary'|'ghost'|'danger'|'accent'; icon?:ReactNode; disabled?:boolean; small?:boolean
}) {
  const [h, setH] = useState(false)
  const s: Record<string,CSSProperties> = {
    primary:   { background: disabled?'#B0BEC5': h?'#005D63':C.primary, color:'#fff', border:'none', boxShadow: disabled?'none': h?`0 4px 14px ${C.primary}50`:`0 2px 8px ${C.primary}30` },
    secondary: { background: h?'#F0F5F5':'#fff', color:C.primary, border:`1.5px solid ${h?C.primary:C.border}` },
    ghost:     { background: h?'#F2F4F5':'transparent', color:C.sub, border:'none' },
    danger:    { background: h?'#DC2626':C.error, color:'#fff', border:'none' },
    accent:    { background: h?'#D9703E':C.accent, color:'#fff', border:'none' },
  }
  return (
    <button onClick={disabled?undefined:onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} disabled={disabled}
      style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding: small?'6px 14px':'10px 20px', borderRadius:10, cursor:disabled?'not-allowed':'pointer', fontFamily:'Manrope,sans-serif', fontSize: small?12:13, fontWeight:700, transition:'all 0.15s', ...s[variant] }}>
      {icon&&<span style={{display:'flex'}}>{icon}</span>}
      {label}
    </button>
  )
}

function Badge({ label, color=C.primary, bg }: { label:string; color?:string; bg?:string }) {
  return <span style={{ display:'inline-flex', alignItems:'center', padding:'3px 10px', borderRadius:999, fontSize:11, fontWeight:700, background:bg??`${color}14`, color, letterSpacing:'0.02em', whiteSpace:'nowrap' }}>{label}</span>
}

function Avatar({ name, size=40, bg }: { name:string; size?:number; bg?:string }) {
  const initials = name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:bg??`${C.primary}18`, color:C.primary, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:size*0.34, flexShrink:0, fontFamily:'Manrope,sans-serif' }}>{initials}</div>
  )
}

function FloatInput({ label, value, onChange, type='text', icon, hint, error, required=false, multiline=false, rows=3 }: {
  label:string; value:string; onChange:(v:string)=>void; type?:string; icon?:ReactNode; hint?:string; error?:string; required?:boolean; multiline?:boolean; rows?:number
}) {
  const [f, setF] = useState(false)
  const lifted = f || value.length > 0
  const bc = error?C.error:f?C.primary:C.border
  const shared: CSSProperties = { width:'100%', padding: icon?'20px 14px 8px 38px':'20px 14px 8px 14px', borderRadius:12, border:`1.5px solid ${bc}`, fontFamily:'Manrope,sans-serif', fontSize:14, color:C.type, outline:'none', background:'#FAFAFA', transition:'border-color 0.15s, box-shadow 0.15s', resize:'none' as const, boxShadow: f?`0 0 0 3px ${error?C.error:C.primary}18`:'none', boxSizing:'border-box' as const }
  return (
    <div style={{ position:'relative' }}>
      {icon&&<span style={{ position:'absolute', left:12, top: multiline?14:'50%', transform: multiline?'none':'translateY(-50%)', color:f?C.primary:C.muted, display:'flex', pointerEvents:'none', zIndex:1 }}>{icon}</span>}
      <label style={{ position:'absolute', left:icon?38:14, top:lifted?7:'50%', transform:lifted?'none':'translateY(-50%)', fontSize:lifted?11:14, fontWeight:lifted?700:400, color:f?C.primary:C.muted, pointerEvents:'none', transition:'all 0.15s', zIndex:1, fontFamily:'Manrope,sans-serif', lineHeight:1 }}>{label}{required&&' *'}</label>
      {multiline
        ? <textarea value={value} onChange={e=>onChange(e.target.value)} rows={rows} onFocus={()=>setF(true)} onBlur={()=>setF(false)} style={{...shared,paddingTop:24,paddingBottom:10}} />
        : <input type={type} value={value} onChange={e=>onChange(e.target.value)} onFocus={()=>setF(true)} onBlur={()=>setF(false)} style={shared} />
      }
      {(error||hint)&&<p style={{ fontSize:11, marginTop:3, color:error?C.error:C.muted, paddingLeft:4 }}>{error??hint}</p>}
    </div>
  )
}

function SelectField({ label, value, onChange, options, icon }: { label:string; value:string; onChange:(v:string)=>void; options:string[]; icon?:ReactNode }) {
  const [f,setF]=useState(false)
  const lifted=f||value.length>0
  return (
    <div style={{position:'relative'}}>
      {icon&&<span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:f?C.primary:C.muted,display:'flex',pointerEvents:'none',zIndex:1}}>{icon}</span>}
      <label style={{position:'absolute',left:icon?38:14,top:lifted?7:'50%',transform:lifted?'none':'translateY(-50%)',fontSize:lifted?11:14,fontWeight:lifted?700:400,color:f?C.primary:C.muted,pointerEvents:'none',transition:'all 0.15s',zIndex:1,fontFamily:'Manrope,sans-serif',lineHeight:1}}>{label}</label>
      <select value={value} onChange={e=>onChange(e.target.value)} onFocus={()=>setF(true)} onBlur={()=>setF(false)}
        style={{width:'100%',padding:icon?'20px 14px 8px 38px':'20px 14px 8px 14px',borderRadius:12,border:`1.5px solid ${f?C.primary:C.border}`,fontFamily:'Manrope,sans-serif',fontSize:14,color:value?C.type:C.muted,outline:'none',background:'#FAFAFA',appearance:'none',cursor:'pointer',boxShadow:f?`0 0 0 3px ${C.primary}18`:'none',transition:'all 0.15s',boxSizing:'border-box' as const}}>
        <option value="" disabled />
        {options.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
      <span style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',color:C.muted,pointerEvents:'none',display:'flex'}}>{I.chevronD}</span>
    </div>
  )
}

function Toggle({ label, sub, on, set }: { label:string; sub?:string; on:boolean; set:()=>void }) {
  return (
    <div onClick={set} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 14px', borderRadius:12, border:`1px solid ${on?C.primary:C.border}`, background:on?`${C.primary}06`:'#FAFAFA', cursor:'pointer', transition:'all 0.18s' }}>
      <div><p style={{fontSize:13,fontWeight:700,color:C.type,fontFamily:'Manrope,sans-serif'}}>{label}</p>{sub&&<p style={{fontSize:11,color:C.muted,marginTop:1}}>{sub}</p>}</div>
      <div style={{width:40,height:22,borderRadius:11,background:on?C.primary:C.border,position:'relative',flexShrink:0,transition:'background 0.18s',marginLeft:12}}>
        <div style={{position:'absolute',top:3,left:on?21:3,width:16,height:16,borderRadius:'50%',background:'#fff',transition:'left 0.18s',boxShadow:'0 1px 3px rgba(0,0,0,0.15)'}} />
      </div>
    </div>
  )
}

// ─── Status helpers ───────────────────────────────────────────────────────────
const HEALTH_COLOR: Record<string,string> = { 'Stable':'#22C55E','Good':'#3B82F6','Needs Attention':'#F59E0B','Critical':'#EF4444','Unknown':C.muted }
function HealthBadge({ s }: { s:string }) {
  const c = HEALTH_COLOR[s]??C.muted
  return <Badge label={s} color={c} />
}

// ─── Beneficiary data ─────────────────────────────────────────────────────────
type Beneficiary = {
  id:string; name:string; preferred:string; dob:string; age:number; gender:string; relationship:string
  nic:string; province:string; city:string; address:string; postalCode:string; landmark:string
  bloodGroup:string; allergies:string; conditions:string[]; medications:{name:string;dose:string;freq:string}[]
  doctor:string; hospital:string; mobility:string; vision:string; hearing:string; memory:string; medNotes:string
  emergencyContacts:{name:string;rel:string;phone:string;email:string;preferred:string}[]
  prefLang:string[]; prefGender:string; dietary:string; religious:string; visitTimes:string; commPref:string; specialReq:string
  documents:{name:string;type:string;date:string;expiry?:string;size:string}[]
  careHistory:{date:string;service:string;agent:string;rating:number;notes:string;cost:string}[]
  notes:{id:string;title:string;body:string;pinned:boolean;private:boolean;date:string}[]
  status:'active'|'pending'|'archived'
  careStatus:string; assignedAgent:string; nextVisit:string; rating:number
}

const BENEFICIARIES: Beneficiary[] = [
  {
    id:'b1', name:'Amara Fernando', preferred:'Amara', dob:'12 Mar 1951', age:74, gender:'Female', relationship:'Mother',
    nic:'512xxx', province:'Western', city:'Colombo 07', address:'14/3 Temple Road', postalCode:'00700', landmark:'Near Cargills FoodCity',
    bloodGroup:'B+', allergies:'Penicillin', conditions:['Type 2 Diabetes','Hypertension','Mild Arthritis'],
    medications:[{name:'Metformin',dose:'500mg',freq:'Twice daily'},{name:'Amlodipine',dose:'5mg',freq:'Once daily'},{name:'Losartan',dose:'50mg',freq:'Once daily'}],
    doctor:'Dr. Priyantha Senanayake', hospital:'Nawaloka Hospital, Colombo', mobility:'Independent with walking stick', vision:'Reading glasses required', hearing:'Normal', memory:'Mild forgetfulness',
    medNotes:'Annual HbA1c check due in March. Allergic to Penicillin — carry medical alert card.',
    emergencyContacts:[{name:'Mohamed Ihsan',rel:'Son',phone:'+61 412 345 678',email:'m.ihsan@email.com',preferred:'Phone'},{name:'Fathima Ihsan',rel:'Daughter-in-law',phone:'+61 412 345 679',email:'f.ihsan@email.com',preferred:'Email'}],
    prefLang:['Sinhala','English'], prefGender:'Female', dietary:'Diabetic-friendly', religious:'Buddhist — avoid beef', visitTimes:'Morning (8–11 AM)', commPref:'WhatsApp',
    specialReq:'Prefers female caregivers. Enjoys conversation.',
    documents:[{name:'National Identity Card',type:'NIC',date:'Jan 2024',size:'1.2 MB'},{name:'Nawaloka Medical Report',type:'Medical',date:'Nov 2024',expiry:'Nov 2025',size:'3.4 MB'},{name:'Metformin Prescription',type:'Prescription',date:'Dec 2024',expiry:'Mar 2025',size:'0.8 MB'},{name:'Insurance Policy',type:'Insurance',date:'Jul 2023',expiry:'Jul 2025',size:'2.1 MB'}],
    careHistory:[{date:'12 Jan 2025',service:'Home Wellness Visit',agent:'Chamari Dissanayake',rating:5,notes:'Great visit. Blood pressure checked, medication dispensed correctly.',cost:'LKR 2,250'},{date:'10 Jan 2025',service:'Hospital Companion',agent:'Nimal Perera',rating:5,notes:'Nawaloka check-up went smoothly. Doctor satisfied with progress.',cost:'LKR 3,000'},{date:'5 Jan 2025',service:'Medication Collection',agent:'Priya Senanayake',rating:4,notes:'Collected 3 medications on time. All correct.',cost:'LKR 1,200'}],
    notes:[{id:'n1',title:'Morning routine',body:"Amara prefers tea before any activity. Always ring the bell twice — she moves slowly to the door.",pinned:true,private:false,date:'10 Jan 2025'},{id:'n2',title:'Doctor visit summary',body:'Dr. Senanayake recommends reducing salt intake and walking 15 mins daily.',pinned:false,private:false,date:'11 Jan 2025'}],
    status:'active', careStatus:'In Progress', assignedAgent:'Chamari Dissanayake', nextVisit:'15 Jan 2025 · 9:00 AM', rating:4.9,
  },
  {
    id:'b2', name:'Nimal Perera', preferred:'Nimal', dob:'3 Jun 1944', age:81, gender:'Male', relationship:'Father',
    nic:'443xxx', province:'Central', city:'Kandy', address:'78 Kandy Road, Peradeniya', postalCode:'20400', landmark:'Near Peradeniya University',
    bloodGroup:'O+', allergies:'Sulfonamides', conditions:['Cataracts (post-surgery)','Hypertension','Arthritis'],
    medications:[{name:'Amlodipine',dose:'10mg',freq:'Once daily'},{name:'Timolol Eye Drops',dose:'0.5%',freq:'Twice daily'}],
    doctor:'Dr. Kamal Jayawardena', hospital:'Kandy General Hospital', mobility:'Needs support on stairs', vision:'Post-cataract surgery — improving', hearing:'Mild loss left ear', memory:'Normal',
    medNotes:'Post-cataract recovery ongoing. Next ophthalmologist follow-up 20 Jan 2025.',
    emergencyContacts:[{name:'Rohan Perera',rel:'Son',phone:'+44 77 1234 5678',email:'r.perera@email.com',preferred:'Phone'}],
    prefLang:['Sinhala'], prefGender:'No Preference', dietary:'Low sodium', religious:'Buddhist', visitTimes:'Late morning (10 AM–12 PM)', commPref:'Phone call',
    specialReq:'Needs help with eye drops twice daily.',
    documents:[{name:'National Identity Card',type:'NIC',date:'Feb 2024',size:'1.0 MB'},{name:'Kandy Hospital Eye Report',type:'Medical',date:'Dec 2024',expiry:'Dec 2025',size:'2.2 MB'}],
    careHistory:[{date:'10 Jan 2025',service:'Hospital Companion',agent:'Nimal Perera (agent)',rating:5,notes:'Ophthalmologist visit at Kandy General. Eye healing well.',cost:'LKR 3,000'}],
    notes:[{id:'n3',title:'Eye drop reminder',body:'Eye drops must be administered at 8 AM and 8 PM exactly. Store in cool, dark place.',pinned:true,private:false,date:'5 Jan 2025'}],
    status:'active', careStatus:'Open Request', assignedAgent:'—', nextVisit:'20 Jan 2025 · 10:30 AM', rating:4.7,
  },
  {
    id:'b3', name:'Kamala Fernando', preferred:'Kamala', dob:'18 Aug 1957', age:68, gender:'Female', relationship:'Aunt',
    nic:'574xxx', province:'Southern', city:'Galle', address:'32 Fort Road', postalCode:'80000', landmark:'Opposite Dutch Fort entrance',
    bloodGroup:'A+', allergies:'None known', conditions:['Mild Arthritis'],
    medications:[{name:'Ibuprofen',dose:'400mg',freq:'As needed'}],
    doctor:'Dr. Sunita Herath', hospital:'Karapitiya Teaching Hospital', mobility:'Fully independent', vision:'Normal', hearing:'Normal', memory:'Excellent',
    medNotes:'Very active and independent. Needs transport only.',
    emergencyContacts:[{name:'Dilshan Fernando',rel:'Nephew',phone:'+1 647 555 0123',email:'d.fernando@email.com',preferred:'WhatsApp'}],
    prefLang:['Sinhala','English'], prefGender:'No Preference', dietary:'Vegetarian', religious:'Buddhist', visitTimes:'Flexible', commPref:'WhatsApp',
    specialReq:'Occasionally needs grocery runs and transport to temple on Poya days.',
    documents:[{name:'National Identity Card',type:'NIC',date:'Mar 2024',size:'0.9 MB'}],
    careHistory:[{date:'8 Jan 2025',service:'Transportation',agent:'Ruwan Fernando',rating:4,notes:'Transport to Karapitiya Hospital. Punctual and helpful.',cost:'LKR 1,800'}],
    notes:[],
    status:'active', careStatus:'Completed', assignedAgent:'Ruwan Fernando', nextVisit:'—', rating:4.6,
  },
  {
    id:'b4', name:'Sunil Jayasinghe', preferred:'Sunil', dob:'27 Nov 1947', age:78, gender:'Male', relationship:'Grandfather',
    nic:'475xxx', province:'North Western', city:'Kurunegala', address:'5 Rajapihilla Rd', postalCode:'60000', landmark:'Near Kurunegala Lake',
    bloodGroup:'AB+', allergies:'Aspirin', conditions:['Heart Disease','Type 2 Diabetes','Hypertension','Mild Dementia'],
    medications:[{name:'Warfarin',dose:'5mg',freq:'Once daily'},{name:'Metformin',dose:'1000mg',freq:'Twice daily'},{name:'Atenolol',dose:'50mg',freq:'Once daily'}],
    doctor:'Dr. Asanka Wijetunge', hospital:'Kurunegala Teaching Hospital', mobility:'Uses wheelchair outdoors', vision:'Thick glasses', hearing:'Hearing aid right ear', memory:'Moderate dementia — familiar faces recognised',
    medNotes:'Warfarin dosage requires INR monitoring monthly. Do not give Aspirin or NSAIDs.',
    emergencyContacts:[{name:'Anjali Jayasinghe',rel:'Granddaughter',phone:'+61 433 777 888',email:'a.jaya@email.com',preferred:'Phone'},{name:'Pradeep Jayasinghe',rel:'Son',phone:'+61 411 222 333',email:'p.jaya@email.com',preferred:'Email'}],
    prefLang:['Sinhala'], prefGender:'Male', dietary:'Diabetic, low salt, no spicy', religious:'Buddhist — strict observance', visitTimes:'Morning only (7–10 AM)', commPref:'Phone call',
    specialReq:'Responds well to familiar faces. Introduce yourself calmly. Medication must be given in correct order.',
    documents:[{name:'National Identity Card',type:'NIC',date:'Jan 2024',size:'1.1 MB'},{name:'Cardiology Report',type:'Medical',date:'Oct 2024',expiry:'Oct 2025',size:'4.2 MB'},{name:'Warfarin INR Record',type:'Medical',date:'Dec 2024',size:'0.5 MB'}],
    careHistory:[{date:'7 Jan 2025',service:'Daily Check-in',agent:'Suresh Kumara',rating:5,notes:'Morning check-in. Medications given, BP checked, short walk taken.',cost:'LKR 800'}],
    notes:[{id:'n4',title:'Medication protocol',body:'IMPORTANT: Warfarin must be given after breakfast. Never on empty stomach. Record time in log book.',pinned:true,private:false,date:'3 Jan 2025'},{id:'n5',title:'Dementia notes',body:'Responds well to his favourite Baila music. Gets anxious near 5 PM (sundowning). Keep lights on.',pinned:true,private:true,date:'5 Jan 2025'}],
    status:'active', careStatus:'In Progress', assignedAgent:'Suresh Kumara', nextVisit:'14 Jan 2025 · 7:30 AM', rating:4.8,
  },
]

// ─── Types ─────────────────────────────────────────────────────────────────────
type View = 'dashboard' | 'profile' | 'add-wizard'
type ProfileTab = 'overview'|'medical'|'documents'|'care-history'|'emergency'|'notes'|'timeline'

// ══════════════════════════════════════════════════════════════════════════════
// BENEFICIARY DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
function Dashboard({ onView, onAdd, beneficiaries }: { onView:(id:string)=>void; onAdd:()=>void; beneficiaries: Beneficiary[] }) {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('Alphabetical')
  const [filterDrawer, setFilterDrawer] = useState(false)
  const [genderFilter, setGenderFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [moreMenuId, setMoreMenuId] = useState<string|null>(null)

  const filtered = beneficiaries.filter(b => {
    const q = search.toLowerCase()
    const matchSearch = !q || b.name.toLowerCase().includes(q) || b.city.toLowerCase().includes(q) || b.relationship.toLowerCase().includes(q) || b.conditions.join(' ').toLowerCase().includes(q)
    const matchGender = !genderFilter || b.gender === genderFilter
    const matchStatus = !statusFilter || b.careStatus === statusFilter
    return matchSearch && matchGender && matchStatus
  }).sort((a,b) => sort==='Alphabetical' ? a.name.localeCompare(b.name) : sort==='Oldest' ? a.age - b.age : b.age - a.age)

  const summaryStats = [
    { label:'Total Beneficiaries', value:beneficiaries.length, color:C.primary, icon:I.users },
    { label:'Active Care Requests', value:2, color:C.accent, icon:I.requests },
    { label:'Upcoming Visits', value:3, color:C.info, icon:I.calendar },
    { label:'Pending Documents', value:1, color:C.warning, icon:I.doc },
  ]

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24, padding:'28px 28px 60px' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:24, fontWeight:900, color:C.type, letterSpacing:'-0.025em', fontFamily:'Manrope,sans-serif' }}>Beneficiaries</h1>
          <p style={{ fontSize:14, color:C.muted, marginTop:3 }}>Manage care recipients and their health profiles</p>
        </div>
        <Btn label="Add Beneficiary" variant="primary" icon={I.plus} onClick={onAdd} />
      </div>

      {/* Summary stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }} className="bm-stats-grid">
        {summaryStats.map(s => (
          <Card key={s.label} hover style={{ padding:18 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:`${s.color}12`, display:'flex', alignItems:'center', justifyContent:'center', color:s.color }}>{s.icon}</div>
            </div>
            <p style={{ fontSize:26, fontWeight:900, color:C.type, letterSpacing:'-0.03em', lineHeight:1, marginBottom:4 }}>{s.value}</p>
            <p style={{ fontSize:12, fontWeight:600, color:C.muted, fontFamily:'Manrope,sans-serif' }}>{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Search + Filter toolbar */}
      <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:'1 1 240px' }}>
          <span style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:C.muted, display:'flex' }}>{I.search}</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, condition, location…"
            style={{ width:'100%', padding:'10px 14px 10px 34px', borderRadius:10, border:`1.5px solid ${C.border}`, fontSize:13, fontFamily:'Manrope,sans-serif', color:C.type, outline:'none', background:'#FAFAFA', boxSizing:'border-box' as const }} />
        </div>
        <button onClick={()=>setFilterDrawer(v=>!v)} style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 14px', borderRadius:10, border:`1.5px solid ${filterDrawer?C.primary:C.border}`, background:filterDrawer?`${C.primary}08`:'transparent', cursor:'pointer', fontSize:12, fontWeight:700, color:filterDrawer?C.primary:C.sub, fontFamily:'Manrope,sans-serif' }}>
          {I.filter} Filters {(genderFilter||statusFilter)?<span style={{width:7,height:7,borderRadius:'50%',background:C.accent,flexShrink:0}} />:null}
        </button>
        <select value={sort} onChange={e=>setSort(e.target.value)} style={{ padding:'10px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, fontSize:12, fontWeight:700, color:C.sub, fontFamily:'Manrope,sans-serif', background:'transparent', cursor:'pointer', outline:'none' }}>
          {['Alphabetical','Newest','Oldest'].map(o=><option key={o}>{o}</option>)}
        </select>
      </div>

      {/* Filter drawer */}
      {filterDrawer && (
        <Card style={{ padding:20 }}>
          <div style={{ display:'flex', gap:20, flexWrap:'wrap', alignItems:'flex-end' }}>
            <div style={{ minWidth:160 }}>
              <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:8, textTransform:'uppercase', letterSpacing:'0.06em', fontFamily:'Manrope,sans-serif' }}>Gender</p>
              <div style={{ display:'flex', gap:6 }}>
                {['All','Male','Female'].map(g=>(
                  <button key={g} onClick={()=>setGenderFilter(g==='All'?'':g)} style={{ padding:'6px 12px', borderRadius:8, border:`1.5px solid ${genderFilter===(g==='All'?'':g)?C.primary:C.border}`, background:genderFilter===(g==='All'?'':g)?`${C.primary}10`:'transparent', cursor:'pointer', fontSize:12, fontWeight:700, color:genderFilter===(g==='All'?'':g)?C.primary:C.sub, fontFamily:'Manrope,sans-serif' }}>{g}</button>
                ))}
              </div>
            </div>
            <div style={{ minWidth:200 }}>
              <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:8, textTransform:'uppercase', letterSpacing:'0.06em', fontFamily:'Manrope,sans-serif' }}>Care Status</p>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {['','In Progress','Open Request','Completed'].map(s=>(
                  <button key={s} onClick={()=>setStatusFilter(s)} style={{ padding:'6px 12px', borderRadius:8, border:`1.5px solid ${statusFilter===s?C.primary:C.border}`, background:statusFilter===s?`${C.primary}10`:'transparent', cursor:'pointer', fontSize:12, fontWeight:700, color:statusFilter===s?C.primary:C.sub, fontFamily:'Manrope,sans-serif' }}>{s||'All'}</button>
                ))}
              </div>
            </div>
            <button onClick={()=>{setGenderFilter('');setStatusFilter('');setFilterDrawer(false)}} style={{ padding:'8px 14px', borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', fontSize:12, fontWeight:700, color:C.error, fontFamily:'Manrope,sans-serif' }}>Clear Filters</button>
          </div>
        </Card>
      )}

      {/* Beneficiary grid */}
      {filtered.length === 0
        ? (
          <Card style={{ padding:60, textAlign:'center' }}>
            <div style={{ width:72, height:72, borderRadius:'50%', background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', color:C.primary }}>
              {I.users}
            </div>
            <h3 style={{ fontSize:16, fontWeight:800, color:C.type, marginBottom:6 }}>No beneficiaries found</h3>
            <p style={{ fontSize:13, color:C.muted, marginBottom:20 }}>Try adjusting your search or filters.</p>
            <Btn label="Clear Search" variant="secondary" onClick={()=>setSearch('')} />
          </Card>
        )
        : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:18 }} className="bm-card-grid">
            {filtered.map(b => {
              const careColor = {  'In Progress':C.primary, 'Open Request':C.info, 'Completed':C.success, 'Pending':C.warning }
              const cc = (careColor as Record<string,string>)[b.careStatus]??C.muted
              return (
                <Card key={b.id} hover style={{ overflow:'hidden', padding:0, position:'relative' }}>
                  {/* top accent */}
                  <div style={{ height:5, background:`linear-gradient(90deg,${C.primary},#00959E)` }} />
                  <div style={{ padding:22 }}>
                    {/* More menu */}
                    <div style={{ position:'absolute', top:16, right:16 }}>
                      <button onClick={e=>{e.stopPropagation();setMoreMenuId(moreMenuId===b.id?null:b.id)}} style={{ width:30,height:30,borderRadius:8,border:`1px solid ${C.border}`,background:'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:C.muted }}>{I.moreV}</button>
                      {moreMenuId===b.id && (
                        <div style={{ position:'absolute',top:34,right:0,background:'#fff',borderRadius:12,border:`1px solid ${C.border}`,boxShadow:'0 8px 24px rgba(0,0,0,0.10)',zIndex:50,minWidth:160,padding:6 }} onClick={e=>e.stopPropagation()}>
                          {[{icon:I.eye,label:'View Profile',fn:()=>onView(b.id)},{icon:I.edit,label:'Edit',fn:()=>{}},{icon:I.requests,label:'Create Request',fn:()=>{}},{icon:I.archive,label:'Archive',fn:()=>{}},{icon:I.trash,label:'Delete',fn:()=>{},danger:true}].map(item=>(
                            <button key={item.label} onClick={()=>{item.fn();setMoreMenuId(null)}} style={{ width:'100%',display:'flex',alignItems:'center',gap:10,padding:'9px 12px',borderRadius:8,border:'none',background:'transparent',cursor:'pointer',fontSize:13,fontWeight:600,color:item.danger?C.error:C.type,fontFamily:'Manrope,sans-serif',textAlign:'left' as const }}>
                              <span style={{color:item.danger?C.error:C.muted,display:'flex'}}>{item.icon}</span>{item.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Header */}
                    <div style={{ display:'flex', gap:14, alignItems:'flex-start', marginBottom:14 }}>
                      <Avatar name={b.name} size={56} />
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontSize:16, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:2 }}>{b.name}</p>
                        <p style={{ fontSize:12, color:C.muted }}>Age {b.age} · {b.gender} · {b.relationship}</p>
                        <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:6 }}>
                          <span style={{ display:'flex', color:C.muted }}>{I.pin}</span>
                          <span style={{ fontSize:12, color:C.sub }}>{b.city}</span>
                        </div>
                      </div>
                    </div>

                    {/* Health tags */}
                    <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:14 }}>
                      {b.conditions.slice(0,2).map(c=><Badge key={c} label={c} color={C.sub} bg="#F2F4F5" />)}
                      {b.conditions.length>2 && <Badge label={`+${b.conditions.length-2}`} color={C.muted} bg="#F2F4F5" />}
                    </div>

                    {/* Care info */}
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
                      <div style={{ padding:'10px 12px', borderRadius:10, background:'#F9FAFB', border:`1px solid ${C.border}` }}>
                        <p style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:3 }}>Care Status</p>
                        <p style={{ fontSize:12, fontWeight:700, color:cc }}>{b.careStatus}</p>
                      </div>
                      <div style={{ padding:'10px 12px', borderRadius:10, background:'#F9FAFB', border:`1px solid ${C.border}` }}>
                        <p style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:3 }}>Next Visit</p>
                        <p style={{ fontSize:11, fontWeight:600, color:C.type }}>{b.nextVisit}</p>
                      </div>
                    </div>

                    {/* Agent + rating */}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:14, borderTop:`1px solid ${C.border}` }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <Avatar name={b.assignedAgent==='—'?'?':b.assignedAgent} size={28} />
                        <p style={{ fontSize:12, color:C.sub, fontFamily:'Manrope,sans-serif' }}>{b.assignedAgent}</p>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                        {I.star}
                        <span style={{ fontSize:13, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{b.rating}</span>
                      </div>
                    </div>

                    {/* Quick actions */}
                    <div style={{ display:'flex', gap:8, marginTop:14 }}>
                      <button onClick={()=>onView(b.id)} style={{ flex:1, padding:'8px', borderRadius:10, border:'none', background:`${C.primary}10`, cursor:'pointer', color:C.primary, fontSize:12, fontWeight:700, fontFamily:'Manrope,sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}>
                        {I.eye} View Profile
                      </button>
                      <button style={{ flex:1, padding:'8px', borderRadius:10, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', color:C.sub, fontSize:12, fontWeight:700, fontFamily:'Manrope,sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}>
                        {I.requests} New Request
                      </button>
                    </div>
                  </div>
                </Card>
              )
            })}

            {/* Add new card */}
            <Card hover onClick={onAdd} style={{ padding:40, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', border:`2px dashed ${C.border}`, cursor:'pointer' }}>
              <div style={{ width:52, height:52, borderRadius:'50%', background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary, marginBottom:14 }}>{I.plus}</div>
              <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>Add Beneficiary</p>
              <p style={{ fontSize:12, color:C.muted }}>Register a new care recipient</p>
            </Card>
          </div>
        )
      }
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// BENEFICIARY PROFILE
// ══════════════════════════════════════════════════════════════════════════════
function Profile({ b, onBack }: { b:Beneficiary; onBack:()=>void }) {
  const [tab, setTab] = useState<ProfileTab>('overview')
  const [showDelete, setShowDelete] = useState(false)

  const tabs: {key:ProfileTab;label:string;icon:ReactNode}[] = [
    {key:'overview',     label:'Overview',         icon:I.users},
    {key:'medical',      label:'Medical',          icon:I.heartbeat},
    {key:'documents',    label:'Documents',        icon:I.doc},
    {key:'care-history', label:'Care History',     icon:I.calendar},
    {key:'emergency',    label:'Emergency',        icon:I.warning},
    {key:'notes',        label:'Notes',            icon:I.note},
    {key:'timeline',     label:'Timeline',         icon:I.clock},
  ]

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100%' }}>
      {/* Cover card */}
      <div style={{ background:`linear-gradient(135deg,${C.primary} 0%,#00959E 60%,${C.accent} 100%)`, padding:'28px 28px 0', position:'relative', overflow:'hidden' }}>
        <div aria-hidden style={{ position:'absolute', top:-60, right:-60, width:260, height:260, borderRadius:'50%', background:'rgba(255,255,255,0.07)', pointerEvents:'none' }} />

        {/* Back + actions */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, position:'relative', zIndex:1 }}>
          <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:7, padding:'7px 14px', borderRadius:10, border:'1.5px solid rgba(255,255,255,0.28)', background:'rgba(255,255,255,0.12)', cursor:'pointer', color:'#fff', fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', backdropFilter:'blur(8px)' }}>
            {I.chevronL} Beneficiaries
          </button>
          <div style={{ display:'flex', gap:8 }}>
            <button style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:10, border:'1.5px solid rgba(255,255,255,0.28)', background:'rgba(255,255,255,0.12)', cursor:'pointer', color:'#fff', fontSize:12, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>{I.edit} Edit</button>
            <button style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:10, border:'1.5px solid rgba(255,255,255,0.28)', background:'rgba(255,255,255,0.12)', cursor:'pointer', color:'#fff', fontSize:12, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>{I.requests} New Request</button>
            <button onClick={()=>setShowDelete(true)} style={{ width:34, height:34, borderRadius:10, border:'1.5px solid rgba(255,255,255,0.28)', background:'rgba(239,68,68,0.20)', cursor:'pointer', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>{I.trash}</button>
          </div>
        </div>

        {/* Profile hero */}
        <div style={{ display:'flex', gap:20, alignItems:'flex-end', position:'relative', zIndex:1 }}>
          <div style={{ width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,0.20)', border:'3px solid rgba(255,255,255,0.40)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, fontWeight:900, color:'#fff', fontFamily:'Manrope,sans-serif', flexShrink:0 }}>
            {b.name.split(' ').map(w=>w[0]).join('').slice(0,2)}
          </div>
          <div style={{ paddingBottom:20 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
              <h2 style={{ fontSize:26, fontWeight:900, color:'#fff', letterSpacing:'-0.02em', fontFamily:'Manrope,sans-serif' }}>{b.name}</h2>
              <span style={{ padding:'3px 10px', borderRadius:999, background:'rgba(255,255,255,0.18)', fontSize:12, fontWeight:700, color:'#fff', border:'1px solid rgba(255,255,255,0.30)' }}>{b.status.toUpperCase()}</span>
            </div>
            <p style={{ fontSize:14, color:'rgba(255,255,255,0.75)', marginTop:3 }}>Age {b.age} · {b.gender} · {b.relationship} · {b.city}</p>
            <div style={{ display:'flex', gap:8, marginTop:8, flexWrap:'wrap' }}>
              {b.conditions.map(c=><span key={c} style={{ padding:'3px 10px', borderRadius:999, background:'rgba(255,255,255,0.14)', fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.85)', border:'1px solid rgba(255,255,255,0.20)' }}>{c}</span>)}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:0, marginTop:4, overflowX:'auto' }}>
          {tabs.map(t=>(
            <button key={t.key} onClick={()=>setTab(t.key)} style={{ display:'flex', alignItems:'center', gap:6, padding:'12px 18px', border:'none', background:'transparent', cursor:'pointer', color: tab===t.key?'#fff':'rgba(255,255,255,0.55)', fontSize:13, fontWeight: tab===t.key?800:500, fontFamily:'Manrope,sans-serif', borderBottom: tab===t.key?'2px solid #fff':'2px solid transparent', transition:'all 0.15s', whiteSpace:'nowrap' }}>
              <span style={{display:'flex',flexShrink:0}}>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div style={{ flex:1, padding:'24px 28px 60px', background:C.bg, overflowY:'auto' }}>
        {tab==='overview'    && <OverviewTab b={b} />}
        {tab==='medical'     && <MedicalTab b={b} />}
        {tab==='documents'   && <DocumentsTab b={b} />}
        {tab==='care-history'&& <CareHistoryTab b={b} />}
        {tab==='emergency'   && <EmergencyTab b={b} />}
        {tab==='notes'       && <NotesTab b={b} />}
        {tab==='timeline'    && <TimelineTab b={b} />}
      </div>

      {/* Delete modal */}
      {showDelete && (
        <div style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div onClick={()=>setShowDelete(false)} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.40)', backdropFilter:'blur(3px)' }} />
          <Card style={{ padding:32, maxWidth:420, width:'90%', position:'relative', zIndex:1 }}>
            <div style={{ width:52, height:52, borderRadius:'50%', background:`${C.error}10`, display:'flex', alignItems:'center', justifyContent:'center', color:C.error, margin:'0 auto 16px' }}>{I.trash}</div>
            <h3 style={{ fontSize:18, fontWeight:900, color:C.type, textAlign:'center', fontFamily:'Manrope,sans-serif', marginBottom:8 }}>Delete Beneficiary?</h3>
            <p style={{ fontSize:13, color:C.muted, textAlign:'center', lineHeight:1.6, marginBottom:24 }}>This will permanently delete <strong>{b.name}'s</strong> profile, including all medical records, care history, and documents. This cannot be undone.</p>
            <div style={{ marginBottom:16 }}>
              <SelectField label="Reason for deletion" value="" onChange={()=>{}} options={['Beneficiary passed away','No longer requires care','Duplicate profile','Other']} />
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <Btn label="Cancel" variant="secondary" onClick={()=>setShowDelete(false)} />
              <button style={{ flex:1, padding:'10px', borderRadius:10, border:'none', background:C.error, cursor:'pointer', color:'#fff', fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>Delete Permanently</button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab({ b }: { b:Beneficiary }) {
  const InfoRow = ({label,val,icon}:{label:string;val:string;icon?:ReactNode}) => (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', padding:'10px 0', borderBottom:`1px solid ${C.border}` }}>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        {icon&&<span style={{color:C.muted,display:'flex',flexShrink:0}}>{icon}</span>}
        <p style={{ fontSize:13, color:C.muted, fontFamily:'Manrope,sans-serif' }}>{label}</p>
      </div>
      <p style={{ fontSize:13, fontWeight:700, color:C.type, fontFamily:'Manrope,sans-serif', textAlign:'right', maxWidth:'60%' }}>{val||'—'}</p>
    </div>
  )

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, alignItems:'start' }} className="bm-2col">
      {/* Personal info */}
      <Card style={{ padding:22 }}>
        <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:14, fontFamily:'Manrope,sans-serif' }}>Personal Information</h3>
        <InfoRow label="Full Name" val={b.name} icon={I.user} />
        <InfoRow label="Preferred Name" val={b.preferred} />
        <InfoRow label="Date of Birth" val={b.dob} icon={I.calendar} />
        <InfoRow label="Gender" val={b.gender} />
        <InfoRow label="Relationship" val={b.relationship} />
        <InfoRow label="NIC" val={b.nic} />
        <InfoRow label="Blood Group" val={b.bloodGroup} icon={I.heart} />
      </Card>

      {/* Address */}
      <Card style={{ padding:22 }}>
        <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:14, fontFamily:'Manrope,sans-serif' }}>Address</h3>
        <InfoRow label="Address" val={b.address} icon={I.pin} />
        <InfoRow label="City" val={b.city} />
        <InfoRow label="Province" val={b.province} />
        <InfoRow label="Postal Code" val={b.postalCode} />
        <InfoRow label="Landmark" val={b.landmark} />
      </Card>

      {/* Current care */}
      <Card style={{ padding:22 }}>
        <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:14, fontFamily:'Manrope,sans-serif' }}>Current Care</h3>
        <InfoRow label="Care Status" val={b.careStatus} />
        <InfoRow label="Assigned Agent" val={b.assignedAgent} icon={I.user} />
        <InfoRow label="Next Visit" val={b.nextVisit} icon={I.calendar} />
        <InfoRow label="Overall Rating" val={`${b.rating} / 5`} />
      </Card>

      {/* Care preferences */}
      <Card style={{ padding:22 }}>
        <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:14, fontFamily:'Manrope,sans-serif' }}>Care Preferences</h3>
        <InfoRow label="Language(s)" val={b.prefLang.join(', ')} icon={I.globe} />
        <InfoRow label="Agent Gender" val={b.prefGender} />
        <InfoRow label="Dietary" val={b.dietary} />
        <InfoRow label="Religious" val={b.religious} />
        <InfoRow label="Visit Times" val={b.visitTimes} icon={I.clock} />
        <InfoRow label="Communication" val={b.commPref} />
        {b.specialReq && <div style={{ marginTop:10, padding:12, borderRadius:10, background:`${C.accent}08`, border:`1px solid ${C.accent}20` }}><p style={{ fontSize:12, color:C.sub, lineHeight:1.6 }}><strong>Special Requests:</strong> {b.specialReq}</p></div>}
      </Card>
    </div>
  )
}

// ─── Medical Tab ──────────────────────────────────────────────────────────────
function MedicalTab({ b }: { b:Beneficiary }) {
  const healthItems = [
    { label:'Mobility',  val:b.mobility  },
    { label:'Vision',    val:b.vision    },
    { label:'Hearing',   val:b.hearing   },
    { label:'Memory',    val:b.memory    },
  ]
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {/* Health summary bar */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }} className="bm-4col">
        {healthItems.map(h=>(
          <Card key={h.label} style={{ padding:16 }}>
            <p style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6, fontFamily:'Manrope,sans-serif' }}>{h.label}</p>
            <p style={{ fontSize:13, fontWeight:700, color:C.type, lineHeight:1.4 }}>{h.val}</p>
          </Card>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }} className="bm-2col">
        {/* Conditions */}
        <Card style={{ padding:22 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            <h3 style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>Conditions</h3>
            <button style={{ background:'none', border:'none', cursor:'pointer', color:C.primary, display:'flex', alignItems:'center', gap:4, fontSize:12, fontWeight:700 }}>{I.plus} Add</button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {b.conditions.map((c,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', borderRadius:10, background:`${C.error}06`, border:`1px solid ${C.error}18` }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:C.error, flexShrink:0 }} />
                  <p style={{ fontSize:13, fontWeight:600, color:C.type }}>{c}</p>
                </div>
                <button style={{ background:'none', border:'none', cursor:'pointer', color:C.muted }}>{I.edit}</button>
              </div>
            ))}
          </div>
        </Card>

        {/* Allergies */}
        <Card style={{ padding:22 }}>
          <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:14, fontFamily:'Manrope,sans-serif' }}>Allergies</h3>
          <div style={{ padding:'12px 14px', borderRadius:10, background:`${C.warning}08`, border:`1px solid ${C.warning}22`, display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ color:C.warning, display:'flex' }}>{I.warning}</span>
            <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{b.allergies||'None known'}</p>
          </div>
          <div style={{ marginTop:14 }}>
            <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:10, fontFamily:'Manrope,sans-serif' }}>Doctor & Hospital</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              <div style={{ padding:'10px 14px', borderRadius:10, background:'#F9FAFB', border:`1px solid ${C.border}` }}>
                <p style={{ fontSize:11, color:C.muted, fontWeight:700, marginBottom:2 }}>Physician</p>
                <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{b.doctor}</p>
              </div>
              <div style={{ padding:'10px 14px', borderRadius:10, background:'#F9FAFB', border:`1px solid ${C.border}` }}>
                <p style={{ fontSize:11, color:C.muted, fontWeight:700, marginBottom:2 }}>Hospital</p>
                <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{b.hospital}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Medications */}
        <div style={{ padding:22, gridColumn:'span 2', background:'#fff', borderRadius:16, border:`1px solid ${C.border}`, boxShadow:'0 1px 4px rgba(44,62,67,0.06)' }} className="bm-full-col">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            <h3 style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>Medications</h3>
            <button style={{ background:'none', border:'none', cursor:'pointer', color:C.primary, display:'flex', alignItems:'center', gap:4, fontSize:12, fontWeight:700 }}>{I.plus} Add Medication</button>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:'Manrope,sans-serif' }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${C.border}` }}>
                  {['Medication','Dosage','Frequency',''].map(h=><th key={h} style={{ padding:'10px 12px', textAlign:'left', fontSize:11, fontWeight:700, color:C.muted, textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {b.medications.map((m,i)=>(
                  <tr key={i} style={{ borderBottom:`1px solid ${C.border}` }}>
                    <td style={{ padding:'12px', display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:32, height:32, borderRadius:8, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary }}>{I.pill}</div>
                      <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{m.name}</p>
                    </td>
                    <td style={{ padding:'12px', fontSize:13, color:C.type, fontWeight:600 }}>{m.dose}</td>
                    <td style={{ padding:'12px' }}><Badge label={m.freq} color={C.primary} /></td>
                    <td style={{ padding:'12px' }}>
                      <button style={{ background:'none', border:'none', cursor:'pointer', color:C.muted }}>{I.edit}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {b.medNotes && (
            <div style={{ marginTop:14, padding:14, borderRadius:12, background:`${C.info}06`, border:`1px solid ${C.info}18`, display:'flex', gap:10 }}>
              <span style={{ color:C.info, flexShrink:0, display:'flex' }}>{I.info}</span>
              <p style={{ fontSize:13, color:C.sub, lineHeight:1.55 }}>{b.medNotes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Documents Tab ────────────────────────────────────────────────────────────
function DocumentsTab({ b }: { b:Beneficiary }) {
  const typeColor: Record<string,string> = { NIC:C.primary, Medical:C.error, Prescription:C.accent, Insurance:C.success, Other:C.muted }
  const today = new Date('2025-01-13')

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <p style={{ fontSize:14, color:C.muted }}>{b.documents.length} document{b.documents.length!==1?'s':''}</p>
        <Btn label="Upload Document" variant="primary" icon={I.upload} small />
      </div>

      {b.documents.length === 0
        ? (
          <Card style={{ padding:60, textAlign:'center' }}>
            <div style={{ width:64, height:64, borderRadius:'50%', background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px', color:C.primary }}>{I.doc}</div>
            <h3 style={{ fontSize:15, fontWeight:800, color:C.type, marginBottom:6 }}>No documents yet</h3>
            <p style={{ fontSize:13, color:C.muted }}>Upload medical reports, prescriptions, or insurance documents.</p>
          </Card>
        )
        : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14 }} className="bm-2col">
            {b.documents.map((d,i)=>{
              const cc = typeColor[d.type]??C.muted
              const expiring = d.expiry ? (new Date(d.expiry+' 2025') < new Date(today.getTime()+60*24*3600000)) : false
              return (
                <Card key={i} hover style={{ padding:18 }}>
                  <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                    <div style={{ width:44, height:44, borderRadius:12, background:`${cc}12`, display:'flex', alignItems:'center', justifyContent:'center', color:cc, flexShrink:0 }}>{I.doc}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontSize:13, fontWeight:800, color:C.type, marginBottom:3, fontFamily:'Manrope,sans-serif' }}>{d.name}</p>
                      <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:6 }}>
                        <Badge label={d.type} color={cc} />
                        <span style={{ fontSize:11, color:C.muted }}>{d.size}</span>
                        <span style={{ fontSize:11, color:C.muted }}>Added {d.date}</span>
                      </div>
                      {d.expiry && (
                        <div style={{ display:'flex', alignItems:'center', gap:5, padding:'3px 8px', borderRadius:6, background:expiring?`${C.warning}10`:`${C.success}08`, border:`1px solid ${expiring?C.warning:C.success}20` }}>
                          <span style={{ color:expiring?C.warning:C.success, display:'flex' }}>{expiring?I.warning:I.check}</span>
                          <p style={{ fontSize:11, fontWeight:700, color:expiring?C.warning:C.success }}>Expires {d.expiry}</p>
                        </div>
                      )}
                    </div>
                    <div style={{ display:'flex', gap:4, flexShrink:0 }}>
                      <button style={{ width:30, height:30, borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.muted }}>{I.eye}</button>
                      <button style={{ width:30, height:30, borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.muted }}>{I.download}</button>
                      <button style={{ width:30, height:30, borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.muted }}>{I.trash}</button>
                    </div>
                  </div>
                </Card>
              )
            })}
            {/* Upload zone */}
            <Card hover style={{ padding:32, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', border:`2px dashed ${C.border}`, cursor:'pointer' }}>
              <div style={{ width:44, height:44, borderRadius:12, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary, marginBottom:10 }}>{I.upload}</div>
              <p style={{ fontSize:13, fontWeight:700, color:C.type }}>Upload New</p>
              <p style={{ fontSize:11, color:C.muted, marginTop:3 }}>PDF, JPG, PNG · Max 10 MB</p>
            </Card>
          </div>
        )
      }
    </div>
  )
}

// ─── Care History Tab ─────────────────────────────────────────────────────────
function CareHistoryTab({ b }: { b:Beneficiary }) {
  const Stars = ({ n }:{n:number}) => <div style={{display:'flex',gap:2}}>{[1,2,3,4,5].map(i=><svg key={i} width="11" height="11" viewBox="0 0 12 12" fill={i<=n?'#F59E0B':'#E4E8EA'}><path d="M6 1l1.5 3 3.5.5-2.5 2.5.6 3.5L6 9 2.9 10.5l.6-3.5L1 4.5 4.5 4z"/></svg>)}</div>

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <p style={{ fontSize:14, color:C.muted }}>{b.careHistory.length} visit{b.careHistory.length!==1?'s':''} recorded</p>
        <div style={{ display:'flex', gap:8 }}>
          <button style={{ padding:'7px 14px', borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', fontSize:12, fontWeight:700, color:C.sub, fontFamily:'Manrope,sans-serif' }}>Export CSV</button>
        </div>
      </div>

      {b.careHistory.length === 0
        ? (
          <Card style={{ padding:60, textAlign:'center' }}>
            <div style={{ width:64, height:64, borderRadius:'50%', background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px', color:C.primary }}>{I.calendar}</div>
            <h3 style={{ fontSize:15, fontWeight:800, color:C.type, marginBottom:6 }}>No care history yet</h3>
            <p style={{ fontSize:13, color:C.muted }}>Completed visits will appear here.</p>
          </Card>
        )
        : b.careHistory.map((h,i)=>(
          <Card key={i} style={{ padding:20 }}>
            <div style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
              <div style={{ width:44, height:44, borderRadius:12, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary, flexShrink:0 }}>{I.calendar}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8, marginBottom:4 }}>
                  <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{h.service}</p>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <Stars n={h.rating} />
                    <Badge label={h.cost} color={C.success} />
                  </div>
                </div>
                <div style={{ display:'flex', gap:12, marginBottom:8, flexWrap:'wrap' }}>
                  <span style={{ fontSize:12, color:C.muted, display:'flex', alignItems:'center', gap:4 }}>{I.user} {h.agent}</span>
                  <span style={{ fontSize:12, color:C.muted, display:'flex', alignItems:'center', gap:4 }}>{I.calendar} {h.date}</span>
                </div>
                <p style={{ fontSize:13, color:C.sub, lineHeight:1.55 }}>{h.notes}</p>
              </div>
            </div>
          </Card>
        ))
      }
    </div>
  )
}

// ─── Emergency Contacts Tab ───────────────────────────────────────────────────
function EmergencyTab({ b }: { b:Beneficiary }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <p style={{ fontSize:14, color:C.muted }}>{b.emergencyContacts.length} contact{b.emergencyContacts.length!==1?'s':''}</p>
        <Btn label="Add Contact" variant="primary" icon={I.plus} small />
      </div>

      {b.emergencyContacts.length === 0
        ? (
          <Card style={{ padding:60, textAlign:'center' }}>
            <div style={{ width:64, height:64, borderRadius:'50%', background:`${C.error}10`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px', color:C.error }}>{I.phone}</div>
            <h3 style={{ fontSize:15, fontWeight:800, color:C.type, marginBottom:6 }}>No emergency contacts</h3>
            <p style={{ fontSize:13, color:C.muted, marginBottom:16 }}>Add contacts who should be reached in an emergency.</p>
            <Btn label="Add Contact" variant="primary" icon={I.plus} />
          </Card>
        )
        : b.emergencyContacts.map((ec,i)=>(
          <Card key={i} style={{ padding:22 }}>
            <div style={{ display:'flex', gap:14, alignItems:'center' }}>
              <Avatar name={ec.name} size={52} bg={i===0?`${C.error}14`:undefined} />
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:2 }}>
                  <p style={{ fontSize:15, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{ec.name}</p>
                  {i===0&&<Badge label="Primary" color={C.error} />}
                </div>
                <p style={{ fontSize:13, color:C.muted, marginBottom:8 }}>{ec.rel}</p>
                <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
                  <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:C.type, fontWeight:600 }}>{I.phone} {ec.phone}</span>
                  <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:C.type, fontWeight:600 }}>{I.mail} {ec.email}</span>
                  <Badge label={`Prefers: ${ec.preferred}`} color={C.primary} />
                </div>
              </div>
              <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                <button style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:10, border:'none', background:`${C.success}10`, cursor:'pointer', color:C.success, fontSize:12, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>{I.phone} Call</button>
                <button style={{ width:34, height:34, borderRadius:10, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.muted }}>{I.edit}</button>
              </div>
            </div>
          </Card>
        ))
      }
    </div>
  )
}

// ─── Notes Tab ────────────────────────────────────────────────────────────────
function NotesTab({ b }: { b:Beneficiary }) {
  const [newNote, setNewNote] = useState('')
  const [noteTitle, setNoteTitle] = useState('')

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      {/* Add note */}
      <Card style={{ padding:20 }}>
        <p style={{ fontSize:13, fontWeight:800, color:C.type, marginBottom:12, fontFamily:'Manrope,sans-serif' }}>New Note</p>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <FloatInput label="Title" value={noteTitle} onChange={setNoteTitle} />
          <FloatInput label="Write a note…" value={newNote} onChange={setNewNote} multiline rows={3} />
          <div style={{ display:'flex', gap:8 }}>
            <Btn label="Save Note" variant="primary" icon={I.save} small onClick={()=>{setNewNote('');setNoteTitle('')}} />
          </div>
        </div>
      </Card>

      {b.notes.length === 0
        ? (
          <Card style={{ padding:50, textAlign:'center' }}>
            <div style={{ width:52, height:52, borderRadius:'50%', background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px', color:C.primary }}>{I.note}</div>
            <h3 style={{ fontSize:15, fontWeight:800, color:C.type, marginBottom:6 }}>No notes yet</h3>
            <p style={{ fontSize:13, color:C.muted }}>Add notes about preferences, routines, or observations.</p>
          </Card>
        )
        : b.notes.map(n => (
          <Card key={n.id} style={{ padding:20 }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:8 }}>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{n.title}</p>
                {n.pinned && <Badge label="Pinned" color={C.accent} />}
                {n.private && <Badge label="Private" color={C.muted} bg="#F2F4F5" />}
              </div>
              <div style={{ display:'flex', gap:4 }}>
                <button style={{ width:28, height:28, borderRadius:7, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.muted }}>{I.edit}</button>
                <button style={{ width:28, height:28, borderRadius:7, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.muted }}>{I.trash}</button>
              </div>
            </div>
            <p style={{ fontSize:13, color:C.sub, lineHeight:1.65 }}>{n.body}</p>
            <p style={{ fontSize:11, color:C.muted, marginTop:8 }}>{n.date}</p>
          </Card>
        ))
      }
    </div>
  )
}

// ─── Timeline Tab ─────────────────────────────────────────────────────────────
function TimelineTab({ b }: { b:Beneficiary }) {
  const events = [
    { date:'13 Jan 2025', title:'Care Request Created',      detail:'Home Wellness Visit scheduled for 15 Jan', icon:I.requests, color:C.primary },
    { date:'12 Jan 2025', title:'Care Visit Completed',      detail:'Home Wellness Visit by Chamari Dissanayake', icon:I.check, color:C.success },
    { date:'10 Jan 2025', title:'Care Visit Completed',      detail:'Hospital Companion — Nawaloka Hospital', icon:I.check, color:C.success },
    { date:'8 Jan 2025',  title:'Medical Record Updated',    detail:'Medications updated: Losartan dosage adjusted', icon:I.pill, color:C.accent },
    { date:'5 Jan 2025',  title:'Document Uploaded',         detail:'Metformin Prescription uploaded', icon:I.doc, color:C.info },
    { date:'1 Jan 2025',  title:'Care Request Created',      detail:'Hospital Companion request submitted', icon:I.requests, color:C.primary },
    { date:'15 Dec 2024', title:'Emergency Contact Updated', detail:'Secondary contact added: Fathima Ihsan', icon:I.phone, color:C.warning },
    { date:'5 Nov 2024',  title:'Beneficiary Profile Created',detail:`${b.name} added to ReadyPal`, icon:I.user, color:C.primary },
  ]

  return (
    <Card style={{ padding:24 }}>
      <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:20, fontFamily:'Manrope,sans-serif' }}>Activity Timeline</h3>
      <div style={{ display:'flex', flexDirection:'column' }}>
        {events.map((e,i)=>(
          <div key={i} style={{ display:'flex', gap:14 }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
              <div style={{ width:32, height:32, borderRadius:'50%', background:`${e.color}12`, display:'flex', alignItems:'center', justifyContent:'center', color:e.color, flexShrink:0 }}>{e.icon}</div>
              {i<events.length-1 && <div style={{ width:2, flex:1, minHeight:16, background:C.border, margin:'4px 0' }} />}
            </div>
            <div style={{ paddingBottom: i<events.length-1?20:0, flex:1 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:2 }}>
                <p style={{ fontSize:13, fontWeight:700, color:C.type, fontFamily:'Manrope,sans-serif' }}>{e.title}</p>
                <span style={{ fontSize:11, color:C.muted, flexShrink:0, marginLeft:8 }}>{e.date}</span>
              </div>
              <p style={{ fontSize:12, color:C.muted, lineHeight:1.5 }}>{e.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// ADD BENEFICIARY WIZARD
// ══════════════════════════════════════════════════════════════════════════════
type AddData = {
  name:string; preferred:string; dob:string; gender:string; nic:string; relationship:string
  province:string; city:string; address:string; postalCode:string; landmark:string
  bloodGroup:string; allergies:string; conditions:string; medications:string; doctor:string; hospital:string
  mobility:string; vision:string; hearing:string; memory:string; medNotes:string
  ec1Name:string; ec1Rel:string; ec1Phone:string; ec1Email:string
  ec2Name:string; ec2Rel:string; ec2Phone:string; ec2Email:string
  prefLang:string[]; prefGender:string; dietary:string; religious:string; visitTimes:string; commPref:string; specialReq:string
}
const defaultAdd: AddData = {
  name:'',preferred:'',dob:'',gender:'',nic:'',relationship:'',
  province:'',city:'',address:'',postalCode:'',landmark:'',
  bloodGroup:'',allergies:'',conditions:'',medications:'',doctor:'',hospital:'',
  mobility:'',vision:'',hearing:'',memory:'',medNotes:'',
  ec1Name:'',ec1Rel:'',ec1Phone:'',ec1Email:'',
  ec2Name:'',ec2Rel:'',ec2Phone:'',ec2Email:'',
  prefLang:[],prefGender:'No Preference',dietary:'',religious:'',visitTimes:'',commPref:'',specialReq:'',
}

const ADD_STEPS = [
  {n:1,label:'Personal Info'},
  {n:2,label:'Address'},
  {n:3,label:'Medical'},
  {n:4,label:'Emergency Contacts'},
  {n:5,label:'Care Preferences'},
  {n:6,label:'Documents'},
  {n:7,label:'Review'},
]

function AddWizard({ onBack, onDone }: { onBack:()=>void; onDone:()=>void }) {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<AddData>(defaultAdd)
  const [done, setDone] = useState(false)

  const provinces = ['Western','Central','Southern','Northern','Eastern','North Western','North Central','Uva','Sabaragamuwa']
  const cities: Record<string,string[]> = { Western:['Colombo','Gampaha','Kalutara'], Central:['Kandy','Matale','Nuwara Eliya'], Southern:['Galle','Matara','Hambantota'], 'North Western':['Kurunegala','Puttalam'] }
  const langs = ['Sinhala','Tamil','English','Malay']
  const genders = ['No Preference','Female','Male']

  const total = 7
  const next = () => step<total ? setStep(s=>s+1) : setDone(true)
  const back = () => step>1 ? setStep(s=>s-1) : onBack()

  if (done) {
    return (
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:40, textAlign:'center' }}>
        <div style={{ width:80, height:80, borderRadius:'50%', background:`linear-gradient(135deg,${C.primary},#00959E)`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', boxShadow:`0 8px 28px ${C.primary}30` }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M6 18l8 8 16-18" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h2 style={{ fontSize:28, fontWeight:900, color:C.type, letterSpacing:'-0.02em', marginBottom:8, fontFamily:'Manrope,sans-serif' }}>Beneficiary Added!</h2>
        <p style={{ fontSize:15, color:C.muted, maxWidth:400, lineHeight:1.6, marginBottom:32 }}><strong>{data.name||'The beneficiary'}</strong> has been added to your ReadyPal account. You can now create care requests for them.</p>
        <div style={{ display:'flex', gap:12 }}>
          <Btn label="View Profile" variant="primary" icon={I.eye} onClick={onDone} />
          <Btn label="Back to Beneficiaries" variant="secondary" onClick={onBack} />
        </div>
      </div>
    )
  }

  const Shell = ({ title, sub, canNext=true, children }: { title:string; sub:string; canNext?:boolean; children:ReactNode }) => (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      {/* Top bar */}
      <div style={{ height:58, borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', padding:'0 28px', gap:12, flexShrink:0 }}>
        <p style={{ fontSize:11, fontWeight:700, color:C.muted, letterSpacing:'0.06em', textTransform:'uppercase', fontFamily:'Manrope,sans-serif', flex:1 }}>Step {step} of {total}</p>
        <div style={{ display:'flex', gap:4, flex:2 }}>
          {ADD_STEPS.map(s=>(
            <div key={s.n} style={{ flex:1, height:3, borderRadius:2, background: s.n<step?C.success:s.n===step?C.primary:C.border, transition:'all 0.3s' }} />
          ))}
        </div>
        <button onClick={onBack} style={{ width:30,height:30,borderRadius:8,border:`1px solid ${C.border}`,background:'transparent',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:C.muted }}>{I.close}</button>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'28px 28px 0' }}>
        <div style={{ maxWidth:640 }}>
          <h2 style={{ fontSize:22, fontWeight:900, color:C.type, letterSpacing:'-0.02em', marginBottom:5, fontFamily:'Manrope,sans-serif' }}>{title}</h2>
          <p style={{ fontSize:13, color:C.muted, marginBottom:24, lineHeight:1.6 }}>{sub}</p>
          {children}
          <div style={{ height:28 }} />
        </div>
      </div>
      <div style={{ borderTop:`1px solid ${C.border}`, padding:'14px 28px', display:'flex', gap:10, background:C.surface, flexShrink:0 }}>
        <Btn label={step===1?'Cancel':'Back'} variant="secondary" icon={I.chevronL} onClick={back} />
        <div style={{ flex:1 }} />
        <Btn label={step===total?'Save Beneficiary':'Continue'} variant="primary" icon={step===total?I.save:I.chevronR} onClick={next} disabled={!canNext} />
      </div>
    </div>
  )

  const G2 = ({children}:{children:ReactNode}) => <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}} className="bm-2col">{children}</div>

  return (
    <>
      {step===1 && (
        <Shell title="Personal Information" sub="Tell us about the person who will receive care." canNext={!!data.name}>
          <G2>
            <FloatInput label="Full Name" value={data.name} onChange={v=>setData(d=>({...d,name:v}))} icon={I.user} required />
            <FloatInput label="Preferred Name" value={data.preferred} onChange={v=>setData(d=>({...d,preferred:v}))} hint="Nickname or short name" />
            <FloatInput label="Date of Birth" value={data.dob} onChange={v=>setData(d=>({...d,dob:v}))} type="date" icon={I.calendar} required />
            <SelectField label="Gender" value={data.gender} onChange={v=>setData(d=>({...d,gender:v}))} options={['Female','Male','Other','Prefer not to say']} />
            <SelectField label="Relationship to You" value={data.relationship} onChange={v=>setData(d=>({...d,relationship:v}))} options={['Mother','Father','Grandmother','Grandfather','Aunt','Uncle','Sibling','Other']} />
            <FloatInput label="NIC Number (optional)" value={data.nic} onChange={v=>setData(d=>({...d,nic:v}))} />
          </G2>
        </Shell>
      )}

      {step===2 && (
        <Shell title="Address" sub="Where does this person live? This helps us match nearby care agents." canNext={!!data.address&&!!data.city}>
          <G2>
            <SelectField label="Province" value={data.province} onChange={v=>setData(d=>({...d,province:v,city:''}))} options={provinces} />
            <SelectField label="City / Town" value={data.city} onChange={v=>setData(d=>({...d,city:v}))} options={data.province?(cities[data.province]??[]):['Colombo','Kandy','Galle','Negombo','Kurunegala']} icon={I.pin} />
            <div style={{gridColumn:'span 2'}}><FloatInput label="Street Address" value={data.address} onChange={v=>setData(d=>({...d,address:v}))} icon={I.pin} required /></div>
            <FloatInput label="Postal Code" value={data.postalCode} onChange={v=>setData(d=>({...d,postalCode:v}))} />
            <FloatInput label="Nearby Landmark" value={data.landmark} onChange={v=>setData(d=>({...d,landmark:v}))} hint="e.g. Near Cargills, opposite temple" />
          </G2>
          <div style={{ marginTop:14, borderRadius:14, overflow:'hidden', height:140, background:`linear-gradient(135deg,${C.primary}10,${C.accent}06)`, border:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', gap:10, color:C.primary }}>
            {I.pin}<p style={{ fontSize:13, fontWeight:700, color:C.type }}>Map preview will appear after saving</p>
          </div>
        </Shell>
      )}

      {step===3 && (
        <Shell title="Medical Information" sub="Help care agents understand health needs and medication routines.">
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <G2>
              <SelectField label="Blood Group" value={data.bloodGroup} onChange={v=>setData(d=>({...d,bloodGroup:v}))} options={['A+','A-','B+','B-','AB+','AB-','O+','O-','Unknown']} />
              <FloatInput label="Known Allergies" value={data.allergies} onChange={v=>setData(d=>({...d,allergies:v}))} hint="e.g. Penicillin, latex, nuts" />
            </G2>
            <FloatInput label="Medical Conditions" value={data.conditions} onChange={v=>setData(d=>({...d,conditions:v}))} multiline rows={2} hint="e.g. Type 2 Diabetes, Hypertension, Arthritis" />
            <FloatInput label="Current Medications" value={data.medications} onChange={v=>setData(d=>({...d,medications:v}))} multiline rows={2} hint="e.g. Metformin 500mg twice daily, Amlodipine 5mg once daily" />
            <G2>
              <FloatInput label="Family Doctor" value={data.doctor} onChange={v=>setData(d=>({...d,doctor:v}))} icon={I.user} />
              <FloatInput label="Hospital / Clinic" value={data.hospital} onChange={v=>setData(d=>({...d,hospital:v}))} />
              <SelectField label="Mobility" value={data.mobility} onChange={v=>setData(d=>({...d,mobility:v}))} options={['Fully Independent','Uses Walking Stick','Uses Walker','Uses Wheelchair','Bedridden']} />
              <SelectField label="Vision" value={data.vision} onChange={v=>setData(d=>({...d,vision:v}))} options={['Normal','Reading Glasses','Bifocals','Partially Impaired','Severely Impaired']} />
              <SelectField label="Hearing" value={data.hearing} onChange={v=>setData(d=>({...d,hearing:v}))} options={['Normal','Mild Loss','Moderate Loss','Hearing Aid','Severely Impaired']} />
              <SelectField label="Memory / Cognition" value={data.memory} onChange={v=>setData(d=>({...d,memory:v}))} options={['Normal','Mild Forgetfulness','Mild Dementia','Moderate Dementia','Severe Dementia']} />
            </G2>
            <FloatInput label="Special Medical Notes" value={data.medNotes} onChange={v=>setData(d=>({...d,medNotes:v}))} multiline rows={3} hint="e.g. Medication must be given after meals. Carry allergy alert card." />
          </div>
        </Shell>
      )}

      {step===4 && (
        <Shell title="Emergency Contacts" sub="Who should we contact in an emergency?" canNext={!!data.ec1Name&&!!data.ec1Phone}>
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <div style={{ padding:20, borderRadius:16, border:`1.5px solid ${C.border}`, background:'#FAFAFA' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
                <Badge label="Primary Contact" color={C.error} />
              </div>
              <G2>
                <FloatInput label="Full Name" value={data.ec1Name} onChange={v=>setData(d=>({...d,ec1Name:v}))} icon={I.user} required />
                <SelectField label="Relationship" value={data.ec1Rel} onChange={v=>setData(d=>({...d,ec1Rel:v}))} options={['Son','Daughter','Spouse','Sibling','Friend','Other']} />
                <FloatInput label="Phone Number" value={data.ec1Phone} onChange={v=>setData(d=>({...d,ec1Phone:v}))} icon={I.phone} type="tel" required />
                <FloatInput label="Email Address" value={data.ec1Email} onChange={v=>setData(d=>({...d,ec1Email:v}))} icon={I.mail} type="email" />
              </G2>
            </div>
            <div style={{ padding:20, borderRadius:16, border:`1px solid ${C.border}`, background:'#FAFAFA' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
                <Badge label="Secondary Contact" color={C.muted} bg="#F2F4F5" />
                <span style={{ fontSize:12, color:C.muted }}>(optional)</span>
              </div>
              <G2>
                <FloatInput label="Full Name" value={data.ec2Name} onChange={v=>setData(d=>({...d,ec2Name:v}))} icon={I.user} />
                <SelectField label="Relationship" value={data.ec2Rel} onChange={v=>setData(d=>({...d,ec2Rel:v}))} options={['Son','Daughter','Spouse','Sibling','Friend','Other']} />
                <FloatInput label="Phone Number" value={data.ec2Phone} onChange={v=>setData(d=>({...d,ec2Phone:v}))} icon={I.phone} type="tel" />
                <FloatInput label="Email Address" value={data.ec2Email} onChange={v=>setData(d=>({...d,ec2Email:v}))} icon={I.mail} type="email" />
              </G2>
            </div>
          </div>
        </Shell>
      )}

      {step===5 && (
        <Shell title="Care Preferences" sub="These preferences help us match the right care agent for your loved one.">
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div>
              <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:10, fontFamily:'Manrope,sans-serif' }}>Languages Spoken</p>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {langs.map(l=>{
                  const on=data.prefLang.includes(l)
                  return <button key={l} onClick={()=>setData(d=>({...d,prefLang:on?d.prefLang.filter(x=>x!==l):[...d.prefLang,l]}))} style={{ display:'flex',alignItems:'center',gap:6,padding:'8px 16px',borderRadius:999,border:`1.5px solid ${on?C.primary:C.border}`,background:on?`${C.primary}10`:'transparent',cursor:'pointer',fontFamily:'Manrope,sans-serif',fontSize:13,fontWeight:700,color:on?C.primary:C.sub,transition:'all 0.15s' }}>{on&&<span style={{display:'flex',color:C.primary}}>{I.check}</span>}{l}</button>
                })}
              </div>
            </div>
            <div>
              <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:10, fontFamily:'Manrope,sans-serif' }}>Preferred Agent Gender</p>
              <div style={{ display:'flex', gap:8 }}>
                {genders.map(g=><button key={g} onClick={()=>setData(d=>({...d,prefGender:g}))} style={{ flex:1,padding:'10px',borderRadius:12,border:`2px solid ${data.prefGender===g?C.primary:C.border}`,background:data.prefGender===g?`${C.primary}08`:'#FAFAFA',cursor:'pointer',fontFamily:'Manrope,sans-serif',fontSize:13,fontWeight:700,color:data.prefGender===g?C.primary:C.sub,transition:'all 0.15s' }}>{g}</button>)}
              </div>
            </div>
            <G2>
              <FloatInput label="Dietary Restrictions" value={data.dietary} onChange={v=>setData(d=>({...d,dietary:v}))} hint="e.g. Diabetic-friendly, vegetarian" />
              <FloatInput label="Religious Requirements" value={data.religious} onChange={v=>setData(d=>({...d,religious:v}))} hint="e.g. Buddhist, avoid beef" />
              <SelectField label="Preferred Visit Times" value={data.visitTimes} onChange={v=>setData(d=>({...d,visitTimes:v}))} options={['Early Morning (6–8 AM)','Morning (8–11 AM)','Late Morning (10 AM–12 PM)','Afternoon (12–4 PM)','Evening (4–7 PM)','Flexible']} icon={I.clock} />
              <SelectField label="Communication Preference" value={data.commPref} onChange={v=>setData(d=>({...d,commPref:v}))} options={['WhatsApp','Phone Call','SMS','Email','In-App Chat']} />
            </G2>
            <FloatInput label="Special Requests" value={data.specialReq} onChange={v=>setData(d=>({...d,specialReq:v}))} multiline rows={3} hint="Any additional notes for care agents" />
          </div>
        </Shell>
      )}

      {step===6 && (
        <Shell title="Documents" sub="Upload key documents now, or add them later from the profile.">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="bm-2col">
            {['National Identity Card (NIC)','Medical Reports','Prescriptions','Insurance Documents','Hospital Letters','Other'].map(name=>(
              <div key={name} style={{ border:`2px dashed ${C.border}`, borderRadius:14, padding:'22px 18px', textAlign:'center', cursor:'pointer', background:'#FAFAFA', transition:'all 0.18s' }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.primary;e.currentTarget.style.background=`${C.primary}04`}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background='#FAFAFA'}}>
                <div style={{ width:36,height:36,borderRadius:10,background:`${C.primary}10`,display:'flex',alignItems:'center',justifyContent:'center',color:C.primary,margin:'0 auto 8px' }}>{I.upload}</div>
                <p style={{ fontSize:12,fontWeight:700,color:C.type,fontFamily:'Manrope,sans-serif',marginBottom:3 }}>{name}</p>
                <p style={{ fontSize:11,color:C.muted }}>PDF, JPG, PNG · Max 10 MB</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize:12, color:C.muted, marginTop:16, textAlign:'center' }}>You can skip this step and upload documents later from the beneficiary profile.</p>
        </Shell>
      )}

      {step===7 && (
        <Shell title="Review & Save" sub="Review the details before saving the beneficiary profile.">
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {[
              { title:'Personal', rows:[['Name',data.name],['Preferred',data.preferred],['DOB',data.dob],['Gender',data.gender],['Relationship',data.relationship]] },
              { title:'Address', rows:[['Address',data.address],['City',data.city],['Province',data.province]] },
              { title:'Medical', rows:[['Blood Group',data.bloodGroup],['Allergies',data.allergies],['Conditions',data.conditions],['Medications',data.medications],['Doctor',data.doctor]] },
              { title:'Emergency Contact', rows:[['Name',data.ec1Name],['Phone',data.ec1Phone],['Relationship',data.ec1Rel]] },
              { title:'Preferences', rows:[['Languages',data.prefLang.join(', ')],['Agent Gender',data.prefGender],['Dietary',data.dietary]] },
            ].map(section=>(
              <Card key={section.title} style={{ padding:18 }}>
                <p style={{ fontSize:13,fontWeight:800,color:C.type,marginBottom:12,fontFamily:'Manrope,sans-serif' }}>{section.title}</p>
                {section.rows.filter(([,v])=>v).map(([k,v])=>(
                  <div key={k} style={{ display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:`1px solid ${C.border}` }}>
                    <p style={{ fontSize:12,color:C.muted }}>{k}</p>
                    <p style={{ fontSize:12,fontWeight:700,color:C.type,maxWidth:'60%',textAlign:'right' as const }}>{v}</p>
                  </div>
                ))}
              </Card>
            ))}
          </div>
        </Shell>
      )}
    </>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function BeneficiaryManagement() {
  const [view, setView] = useState<View>('dashboard')
  const [selectedId, setSelectedId] = useState<string>('')
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) getBeneficiariesFull(data.user.id).then(setBeneficiaries).catch(console.error)
    })
  }, [])

  const selectedBene = beneficiaries.find(b=>b.id===selectedId)

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:C.bg, fontFamily:'Manrope,sans-serif' }}>
      <div style={{ height:60, background:C.surface, borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', padding:'0 28px', gap:12, flexShrink:0, position:'sticky', top:0, zIndex:20 }}>
        <img src={logoFull} alt="ReadyPal" style={{ height:84, objectFit:'contain' }} />
        <div style={{ flex:1 }} />
        <div style={{ display:'flex', gap:4 }}>
          {(['dashboard','add-wizard'] as const).map(v=>(
            <button key={v} onClick={()=>setView(v)} style={{ padding:'6px 14px',borderRadius:8,border:'none',cursor:'pointer',fontFamily:'Manrope,sans-serif',fontSize:12,fontWeight:700,background:view===v?C.primary:'transparent',color:view===v?'#fff':C.muted,transition:'all 0.15s' }}>
              {v==='dashboard'?'Beneficiaries':'+ Add New'}
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column' }}>
        {view==='dashboard' && <Dashboard onView={id=>{setSelectedId(id);setView('profile')}} onAdd={()=>setView('add-wizard')} beneficiaries={beneficiaries} />}
        {view==='profile' && selectedBene && <Profile b={selectedBene} onBack={()=>setView('dashboard')} />}
        {view==='add-wizard' && (
          <div style={{ flex:1, display:'flex', flexDirection:'column', background:C.surface, overflow:'hidden' }}>
            <AddWizard onBack={()=>setView('dashboard')} onDone={()=>setView('dashboard')} />
          </div>
        )}
      </div>
    </div>
  )
}
