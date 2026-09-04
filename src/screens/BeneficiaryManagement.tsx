import { useState, useEffect, useRef, type ReactNode, type CSSProperties, type ChangeEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import {
  getBeneficiariesFull, getBeneficiaryById, createBeneficiary, updateBeneficiary,
  getBeneficiaryDocuments, uploadBeneficiaryDocument, getBeneficiaryDocumentUrl,
  replaceBeneficiaryDocument, deleteBeneficiaryDocument,
} from '../lib/api'
import logoFull from '@/imports/20260723_170707.png'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import '../lib/leafletSetup'
import { createBeneficiary } from '../lib/api'

type GeocodeResult = { lat:string; lon:string; display_name:string }

async function searchAddress(query: string): Promise<GeocodeResult[]> {
  if (!query.trim()) return []
  const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&countrycodes=lk&q=${encodeURIComponent(query)}`)
  if (!response.ok) throw new Error('Address search failed')
  return response.json()
}

async function reverseGeocode(lat: number, lng: number): Promise<GeocodeResult | null> {
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
  if (!response.ok) throw new Error('Reverse geocoding failed')
  return response.json()
}

function LocationPicker({ onSelect }: { onSelect: (lat:number, lng:number) => void }) {
  useMapEvents({ click: event => onSelect(event.latlng.lat, event.latlng.lng) })
  return null
}

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

// ─── Beneficiary data ─────────────────────────────────────────────────────────
// medications/conditions/prefLang are plain string lists and emergencyContacts
// use {name,relationship,phone,email?} — matching the real, defensively-
// normalized shape api.ts now returns (see toStringList/toContactList in
// getBeneficiariesFull/getBeneficiaryById), not a speculative structured shape.
type Beneficiary = {
  id:string; name:string; preferred:string; dob:string; age:number; gender:string; relationship:string
  nic:string; province:string; city:string; address:string; postalCode:string; landmark:string
  bloodGroup:string; allergies:string; conditions:string[]; medications:string[]
  doctor:string; hospital:string; mobility:string; vision:string; hearing:string; memory:string; medNotes:string
  emergencyContacts:{name?:string;relationship?:string;phone?:string;email?:string}[]
  prefLang:string[]; prefGender:string; dietary:string; religious:string; visitTimes:string; commPref:string; specialReq:string
  documents:{id:string;name:string;type:string;date:string;expiry?:string;url?:string}[]
  careHistory:{date:string;service:string;agent:string;cost:string}[]
  notes:{id:string;title:string;body:string;pinned:boolean;private:boolean;date:string}[]
  status:'active'|'pending'|'archived'
  careStatus:string; assignedAgent:string; nextVisit:string; rating:number
  lat?:number; lng?:number
  createdAt?:string|null
}

// ─── Types ─────────────────────────────────────────────────────────────────────
type View = 'dashboard' | 'profile' | 'add-wizard' | 'edit-wizard'
type ProfileTab = 'overview'|'medical'|'documents'|'care-history'|'emergency'|'notes'|'timeline'

// ══════════════════════════════════════════════════════════════════════════════
// BENEFICIARY DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
function Dashboard({ onView, onAdd, onEdit, onArchive, onRestore, onNewRequest, beneficiaries, loading, error }: {
  onView:(id:string)=>void; onAdd:()=>void; onEdit:(id:string)=>void; onArchive:(id:string)=>void; onRestore:(id:string)=>void; onNewRequest:()=>void
  beneficiaries: Beneficiary[]; loading:boolean; error:string
}) {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('Alphabetical')
  const [filterDrawer, setFilterDrawer] = useState(false)
  const [genderFilter, setGenderFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [moreMenuId, setMoreMenuId] = useState<string|null>(null)
  const [showArchived, setShowArchived] = useState(false)

  const archivedCount = beneficiaries.filter(b => b.status === 'archived').length
  const visible = beneficiaries.filter(b => showArchived ? b.status === 'archived' : b.status !== 'archived')

  const filtered = visible.filter(b => {
    const q = search.toLowerCase()
    const matchSearch = !q || b.name.toLowerCase().includes(q) || b.city.toLowerCase().includes(q) || b.relationship.toLowerCase().includes(q) || b.conditions.join(' ').toLowerCase().includes(q)
    const matchGender = !genderFilter || b.gender === genderFilter
    const matchStatus = !statusFilter || b.careStatus === statusFilter
    return matchSearch && matchGender && matchStatus
  }).sort((a,b) => sort==='Alphabetical' ? a.name.localeCompare(b.name) : sort==='Oldest' ? a.age - b.age : b.age - a.age)

  // Every value here is derived from the real beneficiaries already loaded
  // from Supabase (careStatus itself comes from real bookings) — no fetched
  // or fabricated counts for unrelated entities like care requests/documents.
  const activeTotal = beneficiaries.filter(b => b.status !== 'archived').length
  const summaryStats = [
    { label:'Total Beneficiaries', value:activeTotal, color:C.primary, icon:I.users },
    { label:'In Active Care',      value:beneficiaries.filter(b => b.status!=='archived' && b.careStatus==='In Progress').length, color:C.accent, icon:I.requests },
    { label:'Open Requests',       value:beneficiaries.filter(b => b.status!=='archived' && b.careStatus==='Open Request').length, color:C.info, icon:I.calendar },
    { label:'Archived',            value:archivedCount, color:C.warning, icon:I.archive },
  ]

  if (loading) {
    return (
      <div style={{ display:'flex', flexDirection:'column', gap:24, padding:'28px 28px 60px' }}>
        <h1 style={{ fontSize:24, fontWeight:900, color:C.type, letterSpacing:'-0.025em', fontFamily:'Manrope,sans-serif' }}>Beneficiaries</h1>
        <p style={{ fontSize:13, color:C.muted }}>Loading your beneficiaries…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ display:'flex', flexDirection:'column', gap:24, padding:'28px 28px 60px' }}>
        <h1 style={{ fontSize:24, fontWeight:900, color:C.type, letterSpacing:'-0.025em', fontFamily:'Manrope,sans-serif' }}>Beneficiaries</h1>
        <p style={{ fontSize:13, color:C.error }}>{error}</p>
      </div>
    )
  }

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
        {archivedCount>0 && (
          <button onClick={()=>setShowArchived(v=>!v)} style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 14px', borderRadius:10, border:`1.5px solid ${showArchived?C.primary:C.border}`, background:showArchived?`${C.primary}08`:'transparent', cursor:'pointer', fontSize:12, fontWeight:700, color:showArchived?C.primary:C.sub, fontFamily:'Manrope,sans-serif' }}>
            {I.archive} {showArchived?'Viewing Archived':`Archived (${archivedCount})`}
          </button>
        )}
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
            {visible.length === 0 ? (
              <>
                <h3 style={{ fontSize:16, fontWeight:800, color:C.type, marginBottom:6 }}>{showArchived ? 'No archived beneficiaries' : 'No beneficiaries yet'}</h3>
                <p style={{ fontSize:13, color:C.muted, marginBottom:20 }}>{showArchived ? '' : 'Add the first person you\'d like to arrange care for.'}</p>
                {!showArchived && <Btn label="Add Beneficiary" variant="primary" icon={I.plus} onClick={onAdd} />}
              </>
            ) : (
              <>
                <h3 style={{ fontSize:16, fontWeight:800, color:C.type, marginBottom:6 }}>No beneficiaries found</h3>
                <p style={{ fontSize:13, color:C.muted, marginBottom:20 }}>Try adjusting your search or filters.</p>
                <Btn label="Clear Search" variant="secondary" onClick={()=>setSearch('')} />
              </>
            )}
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
                        <div style={{ position:'absolute',top:34,right:0,background:'#fff',borderRadius:12,border:`1px solid ${C.border}`,boxShadow:'0 8px 24px rgba(0,0,0,0.10)',zIndex:50,minWidth:170,padding:6 }} onClick={e=>e.stopPropagation()}>
                          {(b.status==='archived'
                            ? [{icon:I.eye,label:'View Profile',fn:()=>onView(b.id)},{icon:I.archive,label:'Restore',fn:()=>onRestore(b.id)}]
                            : [{icon:I.eye,label:'View Profile',fn:()=>onView(b.id)},{icon:I.edit,label:'Edit',fn:()=>onEdit(b.id)},{icon:I.requests,label:'Create Request',fn:onNewRequest},{icon:I.archive,label:'Archive',fn:()=>onArchive(b.id),danger:true}]
                          ).map(item=>(
                            <button key={item.label} onClick={()=>{item.fn();setMoreMenuId(null)}} style={{ width:'100%',display:'flex',alignItems:'center',gap:10,padding:'9px 12px',borderRadius:8,border:'none',background:'transparent',cursor:'pointer',fontSize:13,fontWeight:600,color:(item as any).danger?C.error:C.type,fontFamily:'Manrope,sans-serif',textAlign:'left' as const }}>
                              <span style={{color:(item as any).danger?C.error:C.muted,display:'flex'}}>{item.icon}</span>{item.label}
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
                      {b.status==='archived' ? (
                        <button onClick={()=>onRestore(b.id)} style={{ flex:1, padding:'8px', borderRadius:10, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', color:C.sub, fontSize:12, fontWeight:700, fontFamily:'Manrope,sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}>
                          {I.archive} Restore
                        </button>
                      ) : (
                        <button onClick={onNewRequest} style={{ flex:1, padding:'8px', borderRadius:10, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', color:C.sub, fontSize:12, fontWeight:700, fontFamily:'Manrope,sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}>
                          {I.requests} New Request
                        </button>
                      )}
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
function Profile({ b, onBack, onEdit, onArchive, onRestore, onNewRequest, documents, documentsLoading, documentsError, onDocumentUploaded }: {
  b:Beneficiary; onBack:()=>void; onEdit:()=>void; onArchive:()=>Promise<void>; onRestore:()=>void; onNewRequest:()=>void
  documents:Beneficiary['documents']; documentsLoading:boolean; documentsError:string; onDocumentUploaded:()=>void
}) {
  const [tab, setTab] = useState<ProfileTab>('overview')
  const [showDelete, setShowDelete] = useState(false)
  const [archiving, setArchiving] = useState(false)

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
            {b.status==='archived' ? (
              <button onClick={onRestore} style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:10, border:'1.5px solid rgba(255,255,255,0.28)', background:'rgba(255,255,255,0.12)', cursor:'pointer', color:'#fff', fontSize:12, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>{I.archive} Restore</button>
            ) : (
              <>
                <button onClick={onEdit} style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:10, border:'1.5px solid rgba(255,255,255,0.28)', background:'rgba(255,255,255,0.12)', cursor:'pointer', color:'#fff', fontSize:12, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>{I.edit} Edit</button>
                <button onClick={onNewRequest} style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:10, border:'1.5px solid rgba(255,255,255,0.28)', background:'rgba(255,255,255,0.12)', cursor:'pointer', color:'#fff', fontSize:12, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>{I.requests} New Request</button>
                <button onClick={()=>setShowDelete(true)} style={{ width:34, height:34, borderRadius:10, border:'1.5px solid rgba(255,255,255,0.28)', background:'rgba(239,68,68,0.20)', cursor:'pointer', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>{I.archive}</button>
              </>
            )}
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
        {tab==='medical'     && <MedicalTab b={b} onEdit={onEdit} />}
        {tab==='documents'   && <DocumentsTab beneficiaryId={b.id} documents={documents} loading={documentsLoading} error={documentsError} onUploaded={onDocumentUploaded} />}
        {tab==='care-history'&& <CareHistoryTab b={b} />}
        {tab==='emergency'   && <EmergencyTab b={b} onEdit={onEdit} />}
        {tab==='notes'       && <NotesTab b={b} />}
        {tab==='timeline'    && <TimelineTab b={b} />}
      </div>

      {/* Archive confirmation modal — this app has no verified-safe hard
          delete for beneficiaries (they may be referenced by care_requests/
          bookings), so "Delete" archives via the real beneficiaries.status
          column instead of removing the row. */}
      {showDelete && (
        <div style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div onClick={()=>!archiving && setShowDelete(false)} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.40)', backdropFilter:'blur(3px)' }} />
          <Card style={{ padding:32, maxWidth:420, width:'90%', position:'relative', zIndex:1 }}>
            <div style={{ width:52, height:52, borderRadius:'50%', background:`${C.error}10`, display:'flex', alignItems:'center', justifyContent:'center', color:C.error, margin:'0 auto 16px' }}>{I.archive}</div>
            <h3 style={{ fontSize:18, fontWeight:900, color:C.type, textAlign:'center', fontFamily:'Manrope,sans-serif', marginBottom:8 }}>Archive Beneficiary?</h3>
            <p style={{ fontSize:13, color:C.muted, textAlign:'center', lineHeight:1.6, marginBottom:24 }}><strong>{b.name}</strong> will be removed from your active beneficiaries list. Their profile, medical records, and care history are kept and can be restored later from Archived.</p>
            <div style={{ display:'flex', gap:10 }}>
              <Btn label="Cancel" variant="secondary" onClick={()=>setShowDelete(false)} disabled={archiving} />
              <button onClick={async ()=>{ setArchiving(true); await onArchive(); setArchiving(false); setShowDelete(false) }} disabled={archiving}
                style={{ flex:1, padding:'10px', borderRadius:10, border:'none', background:C.error, cursor:archiving?'not-allowed':'pointer', color:'#fff', fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', opacity:archiving?0.7:1 }}>
                {archiving?'Archiving…':'Archive Beneficiary'}
              </button>
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
        <div style={{ borderRadius:12, overflow:'hidden', height:140, border:`1px solid ${C.border}`, marginTop:12 }}>
          <MapContainer center={[b.lat ?? 6.9271, b.lng ?? 79.8612]} zoom={13} style={{ height:'100%', width:'100%' }} scrollWheelZoom={false}>
            <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[b.lat ?? 6.9271, b.lng ?? 79.8612]} />
          </MapContainer>
        </div>
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
function MedicalTab({ b, onEdit }: { b:Beneficiary; onEdit:()=>void }) {
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
            <button onClick={onEdit} style={{ background:'none', border:'none', cursor:'pointer', color:C.primary, display:'flex', alignItems:'center', gap:4, fontSize:12, fontWeight:700 }}>{I.edit} Edit</button>
          </div>
          {b.conditions.length===0 ? (
            <p style={{ fontSize:13, color:C.muted }}>No conditions on file.</p>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {b.conditions.map((c,i)=>(
                <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', borderRadius:10, background:`${C.error}06`, border:`1px solid ${C.error}18` }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:C.error, flexShrink:0 }} />
                  <p style={{ fontSize:13, fontWeight:600, color:C.type }}>{c}</p>
                </div>
              ))}
            </div>
          )}
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
            <button onClick={onEdit} style={{ background:'none', border:'none', cursor:'pointer', color:C.primary, display:'flex', alignItems:'center', gap:4, fontSize:12, fontWeight:700 }}>{I.edit} Edit</button>
          </div>
          {b.medications.length===0 ? (
            <p style={{ fontSize:13, color:C.muted }}>No medications on file.</p>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {b.medications.map((m,i)=>(
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:10, background:'#F9FAFB', border:`1px solid ${C.border}` }}>
                  <div style={{ width:32, height:32, borderRadius:8, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary, flexShrink:0 }}>{I.pill}</div>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{m}</p>
                </div>
              ))}
            </div>
          )}
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
// Real read (getBeneficiaryDocuments) and real write (uploadBeneficiaryDocument)
// against the confirmed "beneficiary-documents" private Storage bucket +
// beneficiary_documents table. Because the bucket is private, file_url is a
// storage path, never a usable href directly — "Open" resolves it to a
// short-lived signed URL at click time via getBeneficiaryDocumentUrl().
// Delete/replace aren't offered here: this tab has no per-type slot concept
// (multiple documents of the same type can exist), unlike the Edit wizard's
// Documents step, which enforces one row per type and offers Replace/Delete
// there. Storage + table DELETE policies for the owning client ARE confirmed
// (see deleteBeneficiaryDocument in api.ts) — this is a scope choice, not a
// missing-policy limitation.
const DOCUMENT_TYPE_OPTIONS = ['NIC', 'Medical', 'Prescription', 'Insurance', 'Doctor Recommendation', 'Other']

function DocumentsTab({ beneficiaryId, documents, loading, error, onUploaded }: {
  beneficiaryId:string; documents:Beneficiary['documents']; loading:boolean; error:string; onUploaded:()=>void
}) {
  const typeColor: Record<string,string> = { NIC:C.primary, Medical:C.error, Prescription:C.accent, Insurance:C.success, 'Doctor Recommendation':C.info, Other:C.muted }
  const today = new Date()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [docType, setDocType] = useState('NIC')
  const [expiryDate, setExpiryDate] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [openingId, setOpeningId] = useState<string | null>(null)
  const [openError, setOpenError] = useState('')

  const validateFile = (file: File): string | null => {
    if (!['application/pdf','image/jpeg','image/png'].includes(file.type)) return 'Only PDF, JPG and PNG files are allowed'
    if (file.size > 10 * 1024 * 1024) return 'File must be smaller than 10MB'
    return null
  }

  const onFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const err = validateFile(file)
    setUploadError(err || '')
    setPendingFile(err ? null : file)
  }

  const confirmUpload = async () => {
    if (!pendingFile || uploading) return
    setUploading(true)
    setUploadError('')
    try {
      await uploadBeneficiaryDocument(beneficiaryId, pendingFile, docType, expiryDate || undefined)
      setPendingFile(null)
      setExpiryDate('')
      onUploaded()
    } catch (err: any) {
      console.error('Failed to upload beneficiary document:', err)
      setUploadError(err?.message || "Couldn't upload this document. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const openDocument = async (d: Beneficiary['documents'][number]) => {
    if (!d.url) return
    setOpeningId(d.id)
    setOpenError('')
    try {
      const signedUrl = await getBeneficiaryDocumentUrl(d.url)
      window.open(signedUrl, '_blank', 'noopener,noreferrer')
    } catch (err: any) {
      console.error('Failed to open beneficiary document:', err)
      setOpenError(`Couldn't open "${d.name || 'this document'}". Please try again.`)
    } finally {
      setOpeningId(null)
    }
  }

  if (loading) return <p style={{ fontSize:13, color:C.muted }}>Loading documents…</p>
  if (error) return <p style={{ fontSize:13, color:C.error }}>{error}</p>

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" onChange={onFileSelected} style={{ display:'none' }} />

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <p style={{ fontSize:14, color:C.muted }}>{documents.length} document{documents.length!==1?'s':''}</p>
        <Btn label="Upload Document" variant="primary" icon={I.upload} small onClick={()=>fileInputRef.current?.click()} />
      </div>

      {/* Pending upload confirmation */}
      {pendingFile && (
        <Card style={{ padding:18 }}>
          <div style={{ display:'flex', gap:12, alignItems:'flex-start', marginBottom:14 }}>
            <div style={{ width:40, height:40, borderRadius:10, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary, flexShrink:0 }}>{I.doc}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{pendingFile.name}</p>
              <p style={{ fontSize:11, color:C.muted }}>{(pendingFile.size/1024/1024).toFixed(2)} MB · Ready to upload</p>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }} className="bm-2col">
            <SelectField label="Document Type" value={docType} onChange={setDocType} options={DOCUMENT_TYPE_OPTIONS} />
            <FloatInput label="Expiry Date (optional)" value={expiryDate} onChange={setExpiryDate} type="date" />
          </div>
          {uploadError && <p style={{ fontSize:12, color:C.error, marginBottom:10 }}>{uploadError}</p>}
          <div style={{ display:'flex', gap:8 }}>
            <Btn label={uploading?'Uploading…':'Upload'} variant="primary" icon={I.upload} small disabled={uploading} onClick={confirmUpload} />
            <Btn label="Cancel" variant="secondary" small disabled={uploading} onClick={()=>{ setPendingFile(null); setUploadError('') }} />
          </div>
        </Card>
      )}
      {!pendingFile && uploadError && <p style={{ fontSize:12, color:C.error }}>{uploadError}</p>}
      {openError && <p style={{ fontSize:12, color:C.error }}>{openError}</p>}

      {documents.length === 0
        ? (
          <Card style={{ padding:60, textAlign:'center' }}>
            <div style={{ width:64, height:64, borderRadius:'50%', background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px', color:C.primary }}>{I.doc}</div>
            <h3 style={{ fontSize:15, fontWeight:800, color:C.type, marginBottom:6 }}>No documents yet</h3>
            <p style={{ fontSize:13, color:C.muted }}>Upload medical reports, prescriptions, or insurance documents.</p>
          </Card>
        )
        : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14 }} className="bm-2col">
            {documents.map((d)=>{
              const cc = typeColor[d.type]??C.muted
              const expiring = d.expiry ? (new Date(d.expiry) < new Date(today.getTime()+60*24*3600000)) : false
              return (
                <Card key={d.id} hover style={{ padding:18 }}>
                  <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                    <div style={{ width:44, height:44, borderRadius:12, background:`${cc}12`, display:'flex', alignItems:'center', justifyContent:'center', color:cc, flexShrink:0 }}>{I.doc}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontSize:13, fontWeight:800, color:C.type, marginBottom:3, fontFamily:'Manrope,sans-serif' }}>{d.name||'Untitled document'}</p>
                      <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:6 }}>
                        {d.type && <Badge label={d.type} color={cc} />}
                        {d.date && <span style={{ fontSize:11, color:C.muted }}>Added {d.date}</span>}
                      </div>
                      {d.expiry && (
                        <div style={{ display:'flex', alignItems:'center', gap:5, padding:'3px 8px', borderRadius:6, background:expiring?`${C.warning}10`:`${C.success}08`, border:`1px solid ${expiring?C.warning:C.success}20` }}>
                          <span style={{ color:expiring?C.warning:C.success, display:'flex' }}>{expiring?I.warning:I.check}</span>
                          <p style={{ fontSize:11, fontWeight:700, color:expiring?C.warning:C.success }}>Expires {d.expiry}</p>
                        </div>
                      )}
                    </div>
                    <div style={{ display:'flex', gap:4, flexShrink:0 }}>
                      {d.url
                        ? <button onClick={()=>openDocument(d)} disabled={openingId===d.id} title="Open" style={{ width:30, height:30, borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', cursor:openingId===d.id?'wait':'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.muted }}>{I.download}</button>
                        : <span title="No file available" style={{ width:30, height:30, borderRadius:8, border:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', color:C.border }}>{I.download}</span>
                      }
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )
      }
    </div>
  )
}

// ─── Care History Tab ─────────────────────────────────────────────────────────
// Derived from this beneficiary's real completed bookings (getBeneficiaryById)
// — no per-visit rating or notes are shown since neither is reliably
// derivable from the confirmed schema (bookings has no notes column, and
// linking reviews to a specific visit wasn't verified).
function CareHistoryTab({ b }: { b:Beneficiary }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <p style={{ fontSize:14, color:C.muted }}>{b.careHistory.length} visit{b.careHistory.length!==1?'s':''} recorded</p>

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
                  {h.cost && <Badge label={h.cost} color={C.success} />}
                </div>
                <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                  <span style={{ fontSize:12, color:C.muted, display:'flex', alignItems:'center', gap:4 }}>{I.user} {h.agent}</span>
                  <span style={{ fontSize:12, color:C.muted, display:'flex', alignItems:'center', gap:4 }}>{I.calendar} {h.date}</span>
                </div>
              </div>
            </div>
          </Card>
        ))
      }
    </div>
  )
}

// ─── Emergency Contacts Tab ───────────────────────────────────────────────────
function EmergencyTab({ b, onEdit }: { b:Beneficiary; onEdit:()=>void }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <p style={{ fontSize:14, color:C.muted }}>{b.emergencyContacts.length} contact{b.emergencyContacts.length!==1?'s':''}</p>
        <Btn label="Edit Contacts" variant="primary" icon={I.edit} small onClick={onEdit} />
      </div>

      {b.emergencyContacts.length === 0
        ? (
          <Card style={{ padding:60, textAlign:'center' }}>
            <div style={{ width:64, height:64, borderRadius:'50%', background:`${C.error}10`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px', color:C.error }}>{I.phone}</div>
            <h3 style={{ fontSize:15, fontWeight:800, color:C.type, marginBottom:6 }}>No emergency contacts</h3>
            <p style={{ fontSize:13, color:C.muted, marginBottom:16 }}>Add contacts who should be reached in an emergency.</p>
            <Btn label="Add Contact" variant="primary" icon={I.plus} onClick={onEdit} />
          </Card>
        )
        : b.emergencyContacts.map((ec,i)=>(
          <Card key={i} style={{ padding:22 }}>
            <div style={{ display:'flex', gap:14, alignItems:'center' }}>
              <Avatar name={ec.name||'?'} size={52} bg={i===0?`${C.error}14`:undefined} />
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:2 }}>
                  <p style={{ fontSize:15, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{ec.name||'Not provided'}</p>
                  {i===0&&<Badge label="Primary" color={C.error} />}
                </div>
                <p style={{ fontSize:13, color:C.muted, marginBottom:8 }}>{ec.relationship||'—'}</p>
                <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
                  {ec.phone && <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:C.type, fontWeight:600 }}>{I.phone} {ec.phone}</span>}
                  {ec.email && <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:C.type, fontWeight:600 }}>{I.mail} {ec.email}</span>}
                </div>
              </div>
              <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                {ec.phone && <a href={`tel:${ec.phone}`} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:10, border:'none', background:`${C.success}10`, textDecoration:'none', color:C.success, fontSize:12, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>{I.phone} Call</a>}
                <button onClick={onEdit} style={{ width:34, height:34, borderRadius:10, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.muted }}>{I.edit}</button>
              </div>
            </div>
          </Card>
        ))
      }
    </div>
  )
}

// ─── Notes Tab ────────────────────────────────────────────────────────────────
// Notes have no backing table anywhere in this codebase (no
// beneficiary_notes table/API found) — the composer stays visible but
// disabled rather than silently discarding what's typed as if it saved.
function NotesTab({ b }: { b:Beneficiary }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <Card style={{ padding:20 }}>
        <p style={{ fontSize:13, fontWeight:800, color:C.type, marginBottom:12, fontFamily:'Manrope,sans-serif' }}>New Note</p>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <FloatInput label="Title" value="" onChange={()=>{}} />
          <FloatInput label="Write a note…" value="" onChange={()=>{}} multiline rows={3} />
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <Btn label="Save Note" variant="primary" icon={I.save} small disabled />
            <p style={{ fontSize:11, color:C.muted }}>Notes aren't saved yet — this feature isn't connected to a backend.</p>
          </div>
        </div>
      </Card>

      {b.notes.length === 0 && (
        <Card style={{ padding:50, textAlign:'center' }}>
          <div style={{ width:52, height:52, borderRadius:'50%', background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px', color:C.primary }}>{I.note}</div>
          <h3 style={{ fontSize:15, fontWeight:800, color:C.type, marginBottom:6 }}>No notes yet</h3>
          <p style={{ fontSize:13, color:C.muted }}>Care notes aren't available yet.</p>
        </Card>
      )}
    </div>
  )
}

// ─── Timeline Tab ─────────────────────────────────────────────────────────────
// No dedicated activity-log table exists for beneficiaries, so this shows
// only what can genuinely be derived: the real profile creation date and
// real completed-booking events — never fabricated document/medical-record
// events.
function TimelineTab({ b }: { b:Beneficiary }) {
  const events: { date:string; title:string; detail:string; icon:ReactNode; color:string }[] = []
  for (const h of b.careHistory) {
    events.push({ date:h.date, title:'Care Visit Completed', detail:`${h.service} — ${h.agent}`, icon:I.check, color:C.success })
  }
  if (b.createdAt) {
    events.push({ date:new Date(b.createdAt).toLocaleDateString('en-GB',{ day:'numeric', month:'short', year:'numeric' }), title:'Beneficiary Profile Created', detail:`${b.name} added to ReadyPal`, icon:I.user, color:C.primary })
  }

  return (
    <Card style={{ padding:24 }}>
      <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:20, fontFamily:'Manrope,sans-serif' }}>Activity Timeline</h3>
      {events.length === 0 ? (
        <p style={{ fontSize:13, color:C.muted }}>No activity recorded yet.</p>
      ) : (
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
      )}
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
  lat:number; lng:number
}
const defaultAdd: AddData = {
  name:'',preferred:'',dob:'',gender:'',nic:'',relationship:'',
  province:'',city:'',address:'',postalCode:'',landmark:'',
  bloodGroup:'',allergies:'',conditions:'',medications:'',doctor:'',hospital:'',
  mobility:'',vision:'',hearing:'',memory:'',medNotes:'',
  ec1Name:'',ec1Rel:'',ec1Phone:'',ec1Email:'',
  ec2Name:'',ec2Rel:'',ec2Phone:'',ec2Email:'',
  prefLang:[],prefGender:'No Preference',dietary:'',religious:'',visitTimes:'',commPref:'',specialReq:'',
  lat:6.9271, lng:79.8612,
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

// Turns the free-text "Medical Conditions" / "Current Medications" textareas
// into the string-array shape getBeneficiariesFull() reads back
// (conditions/medications), one entry per line or comma.
function splitList(text: string): string[] {
  return text.split(/\r?\n|,/).map(s => s.trim()).filter(Boolean)
}

// Maps a loaded Beneficiary (real, from getBeneficiaryById/getBeneficiariesFull)
// back into the wizard's flat AddData shape, so Edit reuses the exact same
// steps/UI as Add rather than a second form.
function beneficiaryToAddData(b: Beneficiary): AddData {
  const ec1 = b.emergencyContacts[0]
  const ec2 = b.emergencyContacts[1]
  return {
    name:b.name, preferred:b.preferred===b.name?'':b.preferred, dob:b.dob, gender:b.gender, nic:b.nic, relationship:b.relationship,
    province:b.province, city:b.city, address:b.address, postalCode:b.postalCode, landmark:b.landmark,
    bloodGroup:b.bloodGroup, allergies:b.allergies, conditions:b.conditions.join(', '), medications:b.medications.join(', '),
    doctor:b.doctor, hospital:b.hospital, mobility:b.mobility, vision:b.vision, hearing:b.hearing, memory:b.memory, medNotes:b.medNotes,
    ec1Name:ec1?.name||'', ec1Rel:ec1?.relationship||'', ec1Phone:ec1?.phone||'', ec1Email:ec1?.email||'',
    ec2Name:ec2?.name||'', ec2Rel:ec2?.relationship||'', ec2Phone:ec2?.phone||'', ec2Email:ec2?.email||'',
    prefLang:b.prefLang, prefGender:b.prefGender||'No Preference', dietary:b.dietary, religious:b.religious, visitTimes:b.visitTimes, commPref:b.commPref, specialReq:b.specialReq,
  }
}

// Module-scope (not declared inside AddWizard): defining these as inline
// functions inside AddWizard's render body would give them a new function
// identity on every re-render (i.e. every keystroke, since typing calls
// setData). React treats a changed component identity as a different
// component type and remounts the whole subtree — including the real
// <input>/<textarea> DOM nodes — which is what was destroying focus after
// every character. Keeping them at module scope keeps their identity
// stable across renders, so React only patches props/DOM instead of
// remounting.



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
        <button onClick={onClose} style={{ width:30,height:30,borderRadius:8,border:`1px solid ${C.border}`,background:'transparent',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:C.muted }}>{I.close}</button>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'28px 28px 0' }}>
        <div style={{ maxWidth:640 }}>
          <h2 style={{ fontSize:22, fontWeight:900, color:C.type, letterSpacing:'-0.02em', marginBottom:5, fontFamily:'Manrope,sans-serif' }}>{title}</h2>
          <p style={{ fontSize:13, color:C.muted, marginBottom:24, lineHeight:1.6 }}>{sub}</p>
          {children}
          <div style={{ height:28 }} />
        </div>
      </div>
      {step===total && saveError && (
        <div style={{ padding:'0 28px' }}>
          <p style={{ fontSize:12, color:C.error, marginBottom:8 }}>{saveError}</p>
        </div>
      )}
      <div style={{ borderTop:`1px solid ${C.border}`, padding:'14px 28px', display:'flex', gap:10, background:C.surface, flexShrink:0 }}>
        <Btn label={step===1?'Cancel':'Back'} variant="secondary" icon={I.chevronL} onClick={onBack} disabled={saving} />
        <div style={{ flex:1 }} />
        <Btn label={step===total?(saving?'Saving…':(saving?'Saving...':'Save Beneficiary')):'Continue'} variant="primary" icon={step===total?I.save:I.chevronR} onClick={onNext} disabled={!canNext || saving || (step===total && saving)} />
      </div>
    </div>
  )
}

function AddWizardG2({ children }: { children:ReactNode }) {
  return <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}} className="bm-2col">{children}</div>
}

// Same categories/types the standalone Documents tab uses, keyed by the real
// beneficiary_documents.type value the box represents.
const WIZARD_DOCUMENT_CATEGORIES: { type:string; label:string }[] = [
  { type:'NIC', label:'National Identity Card (NIC)' },
  { type:'Medical', label:'Medical Reports' },
  { type:'Prescription', label:'Prescriptions' },
  { type:'Insurance', label:'Insurance Documents' },
  { type:'Doctor Recommendation', label:'Doctor Recommendation' },
  { type:'Other', label:'Other' },
]

type WizardDocStatus = 'queued'|'uploading'|'uploaded'|'failed'
type WizardDocItem = { file:File; status:WizardDocStatus; error?:string }
type WizardExistingDoc = { id:string; name:string; type:string; uploaded_at:string; expiry_date:string|null; file_url:string }

function AddWizard({ onBack, onDone, clientId, existing }: { onBack:()=>void; onDone:()=>void; clientId:string; existing?:Beneficiary }) {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<AddData>(existing ? beneficiaryToAddData(existing) : defaultAdd)
  const [done, setDone] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const provinces = ['Western','Central','Southern','Northern','Eastern','North Western','North Central','Uva','Sabaragamuwa']
  const cities: Record<string,string[]> = { Western:['Colombo','Gampaha','Kalutara'], Central:['Kandy','Matale','Nuwara Eliya'], Southern:['Galle','Matara','Hambantota'], 'North Western':['Kurunegala','Puttalam'] }
  const langs = ['Sinhala','Tamil','English','Malay']
  const genders = ['No Preference','Female','Male']

  const total = 7

  // Documents step. In Add mode there's no real beneficiary id yet, so
  // selected files are queued here and only actually uploaded after
  // createBeneficiary returns a real id. In Edit mode (existing is set) a
  // real id already exists, so files upload immediately when selected.
  const [docQueue, setDocQueue] = useState<Record<string, WizardDocItem>>({})
  const [docUploadResults, setDocUploadResults] = useState<{ type:string; name:string; ok:boolean; error?:string }[]>([])
  const docFileInputRef = useRef<HTMLInputElement>(null)
  const pendingDocTypeRef = useRef<string>('')

  // Edit mode only: the real documents already on this beneficiary, keyed by
  // type (beneficiary_documents has a UNIQUE (beneficiary_id, type)
  // constraint, so there's at most one row per slot). Loaded once when the
  // wizard opens on an existing beneficiary so the Documents step shows real
  // uploaded state instead of empty "Upload" boxes.
  const [existingDocs, setExistingDocs] = useState<Record<string, WizardExistingDoc>>({})
  const [existingDocsLoading, setExistingDocsLoading] = useState(false)
  const [existingDocsError, setExistingDocsError] = useState('')
  const [openingType, setOpeningType] = useState<string | null>(null)
  const [openErrorType, setOpenErrorType] = useState<{ type:string; message:string } | null>(null)
  const [deletingType, setDeletingType] = useState<string | null>(null)
  const [deleteConfirmType, setDeleteConfirmType] = useState<string | null>(null)
  const [deleteErrorType, setDeleteErrorType] = useState<{ type:string; message:string } | null>(null)
  const [cleanupWarnings, setCleanupWarnings] = useState<Record<string, string>>({})

  const loadExistingDocs = () => {
    if (!existing) return
    setExistingDocsLoading(true)
    setExistingDocsError('')
    getBeneficiaryDocuments(existing.id)
      .then((docs: any[]) => {
        const byType: Record<string, WizardExistingDoc> = {}
        docs.forEach(d => { if (d.type) byType[d.type] = d })
        setExistingDocs(byType)
      })
      .catch(err => { console.error('Failed to load existing beneficiary documents:', err); setExistingDocsError("Couldn't load existing documents.") })
      .finally(() => setExistingDocsLoading(false))
  }

  useEffect(() => { loadExistingDocs() }, [existing?.id])

  const validateDocFile = (file: File): string | null => {
    if (!['application/pdf','image/jpeg','image/png'].includes(file.type)) return 'Only PDF, JPG and PNG files are allowed'
    if (file.size > 10 * 1024 * 1024) return 'File must be smaller than 10MB'
    return null
  }

  const triggerDocPicker = (type: string) => {
    pendingDocTypeRef.current = type
    docFileInputRef.current?.click()
  }

  // Uploads or replaces (never duplicates) the document for this type via
  // replaceBeneficiaryDocument — it UPDATEs the existing row for this slot
  // if one exists, otherwise INSERTs the first one. Once it resolves, the
  // real row becomes the source of truth (existingDocs) and the transient
  // docQueue entry is cleared.
  const uploadDocNow = async (type: string, file: File) => {
    if (!existing) return
    setDocQueue(q => ({ ...q, [type]: { file, status:'uploading' } }))
    try {
      const result = await replaceBeneficiaryDocument(existing.id, file, type)
      const { cleanupWarning, ...doc } = result as WizardExistingDoc & { cleanupWarning: string | null }
      setExistingDocs(d => ({ ...d, [type]: doc }))
      setDocQueue(q => { const next = { ...q }; delete next[type]; return next })
      setCleanupWarnings(w => {
        const next = { ...w }
        if (cleanupWarning) next[type] = cleanupWarning
        else delete next[type]
        return next
      })
    } catch (err: any) {
      console.error('Failed to upload beneficiary document:', err)
      setDocQueue(q => ({ ...q, [type]: { file, status:'failed', error: err?.message || 'Upload failed' } }))
    }
  }

  const openExistingDoc = async (type: string) => {
    const doc = existingDocs[type]
    if (!doc?.file_url) return
    setOpeningType(type)
    setOpenErrorType(null)
    try {
      const signedUrl = await getBeneficiaryDocumentUrl(doc.file_url)
      window.open(signedUrl, '_blank', 'noopener,noreferrer')
    } catch (err: any) {
      console.error('Failed to open beneficiary document:', err)
      setOpenErrorType({ type, message: `Couldn't open "${doc.name || 'this document'}". Please try again.` })
    } finally {
      setOpeningType(null)
    }
  }

  const requestDeleteDoc = (type: string) => { setDeleteErrorType(null); setDeleteConfirmType(type) }

  const confirmDeleteDoc = async () => {
    const type = deleteConfirmType
    const doc = type ? existingDocs[type] : undefined
    if (!type || !doc || !existing) { setDeleteConfirmType(null); return }
    setDeletingType(type)
    setDeleteErrorType(null)
    try {
      await deleteBeneficiaryDocument(existing.id, { id: doc.id, file_url: doc.file_url })
      setExistingDocs(d => { const next = { ...d }; delete next[type]; return next })
      setCleanupWarnings(w => { const next = { ...w }; delete next[type]; return next })
      setDeleteConfirmType(null)
    } catch (err: any) {
      console.error('Failed to delete beneficiary document:', err)
      setDeleteErrorType({ type, message: err?.message || "Couldn't delete this document. Please try again." })
    } finally {
      setDeletingType(null)
    }
  }

  const onDocFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    const type = pendingDocTypeRef.current
    if (!file || !type) return
    const validationError = validateDocFile(file)
    if (validationError) {
      setDocQueue(q => ({ ...q, [type]: { file, status:'failed', error: validationError } }))
      return
    }
    if (existing) {
      uploadDocNow(type, file)
    } else {
      setDocQueue(q => ({ ...q, [type]: { file, status:'queued' } }))
    }
  }

  const retryDocUpload = (type: string) => {
    const item = docQueue[type]
    if (!item) return
    if (existing) {
      uploadDocNow(type, item.file)
    } else {
      const validationError = validateDocFile(item.file)
      setDocQueue(q => ({ ...q, [type]: validationError ? { ...item, status:'failed', error:validationError } : { ...item, status:'queued', error:undefined } }))
    }
  }

  const clearDocQueue = (type: string) => setDocQueue(q => { const next = { ...q }; delete next[type]; return next })

  const saveBeneficiary = async () => {
    if (saving || !clientId) return
    setSaving(true)
    setSaveError('')
    try {
      const age = data.dob ? Math.max(0, Math.floor((Date.now() - new Date(data.dob).getTime()) / (365.25*24*3600*1000))) : null
      const emergencyContacts = [
        data.ec1Name ? { name: data.ec1Name, relationship: data.ec1Rel, phone: data.ec1Phone, email: data.ec1Email } : null,
        data.ec2Name ? { name: data.ec2Name, relationship: data.ec2Rel, phone: data.ec2Phone, email: data.ec2Email } : null,
      ].filter(Boolean)
      const fields = {
        name: data.name,
        preferred_name: data.preferred || null,
        dob: data.dob || null,
        age,
        gender: data.gender || null,
        relationship: data.relationship || null,
        nic: data.nic || null,
        province: data.province || null,
        city: data.city || null,
        address: data.address || null,
        postal_code: data.postalCode || null,
        landmark: data.landmark || null,
        blood_group: data.bloodGroup || null,
        allergies: data.allergies || null,
        conditions: splitList(data.conditions),
        medications: splitList(data.medications),
        doctor: data.doctor || null,
        hospital: data.hospital || null,
        mobility: data.mobility || null,
        vision: data.vision || null,
        hearing: data.hearing || null,
        memory: data.memory || null,
        med_notes: data.medNotes || null,
        emergency_contacts: emergencyContacts,
        pref_languages: data.prefLang,
        pref_gender: data.prefGender || null,
        dietary: data.dietary || null,
        religious: data.religious || null,
        visit_times: data.visitTimes || null,
        comm_pref: data.commPref || null,
        special_req: data.specialReq || null,
      }
      if (existing) {
        await updateBeneficiary(existing.id, fields, clientId)
        // Any documents in this step were already uploaded directly (a real
        // id already existed), so there's nothing queued to flush here.
      } else {
        const created = await createBeneficiary({ ...fields, status: 'active' }, clientId)
        // Only now does a real beneficiary id exist — upload any queued
        // documents against it. A failed document never blocks the
        // beneficiary itself from being reported as saved, but it is never
        // silently reported as succeeded either.
        const queued = Object.entries(docQueue).filter(([, item]) => item.status==='queued' || item.status==='failed')
        const results: { type:string; name:string; ok:boolean; error?:string }[] = []
        for (const [type, item] of queued) {
          setDocQueue(q => ({ ...q, [type]: { ...item, status:'uploading', error:undefined } }))
          try {
            await uploadBeneficiaryDocument(created.id, item.file, type)
            setDocQueue(q => ({ ...q, [type]: { ...item, status:'uploaded' } }))
            results.push({ type, name:item.file.name, ok:true })
          } catch (err: any) {
            console.error(`Failed to upload queued document (${type}):`, err)
            setDocQueue(q => ({ ...q, [type]: { ...item, status:'failed', error: err?.message || 'Upload failed' } }))
            results.push({ type, name:item.file.name, ok:false, error: err?.message || 'Upload failed' })
          }
        }
        setDocUploadResults(results)
      }
      setDone(true)
    } catch (err: any) {
      console.error('Failed to save beneficiary:', err)
      setSaveError(err?.message || "Couldn't save this beneficiary. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const next = () => step<total ? setStep(s=>s+1) : saveBeneficiary()
  const back = () => step>1 ? setStep(s=>s-1) : onBack()

  if (done) {
    const failedDocs = docUploadResults.filter(r => !r.ok)
    return (
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:40, textAlign:'center' }}>
        <div style={{ width:80, height:80, borderRadius:'50%', background:`linear-gradient(135deg,${C.primary},#00959E)`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', boxShadow:`0 8px 28px ${C.primary}30` }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M6 18l8 8 16-18" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h2 style={{ fontSize:28, fontWeight:900, color:C.type, letterSpacing:'-0.02em', marginBottom:8, fontFamily:'Manrope,sans-serif' }}>{existing?'Beneficiary Updated!':'Beneficiary Added!'}</h2>
        <p style={{ fontSize:15, color:C.muted, maxWidth:400, lineHeight:1.6, marginBottom: failedDocs.length ? 16 : 32 }}><strong>{data.name||'The beneficiary'}</strong> {existing?'has been updated.':'has been added to your ReadyPal account. You can now create care requests for them.'}</p>
        {failedDocs.length > 0 && (
          <div style={{ maxWidth:400, width:'100%', textAlign:'left' as const, padding:14, borderRadius:12, background:`${C.warning}08`, border:`1px solid ${C.warning}30`, marginBottom:24 }}>
            <p style={{ fontSize:12, fontWeight:800, color:C.warning, marginBottom:6 }}>{failedDocs.length} of {docUploadResults.length} document{docUploadResults.length!==1?'s':''} didn't upload</p>
            {failedDocs.map(d => (
              <p key={d.type} style={{ fontSize:11, color:C.sub, marginBottom:2 }}>{d.type} ({d.name}): {d.error}</p>
            ))}
            <p style={{ fontSize:11, color:C.muted, marginTop:6 }}>The beneficiary itself was saved. You can add these documents from their profile's Documents tab.</p>
          </div>
        )}
        <div style={{ display:'flex', gap:12 }}>
          <Btn label="View Profile" variant="primary" icon={I.eye} onClick={onDone} />
          <Btn label="Back to Beneficiaries" variant="secondary" onClick={onBack} />
        </div>
      </div>
    )
  }

  return (
    <>
      {step===1 && (
        <AddWizardShell title="Personal Information" sub="Tell us about the person who will receive care." canNext={!!data.name} step={step} total={total} saving={saving} saveError={saveError} onClose={onBack} onBack={back} onNext={next}>
          <AddWizardG2>
            <FloatInput label="Full Name" value={data.name} onChange={v=>setData(d=>({...d,name:v}))} icon={I.user} required />
            <FloatInput label="Preferred Name" value={data.preferred} onChange={v=>setData(d=>({...d,preferred:v}))} hint="Nickname or short name" />
            <FloatInput label="Date of Birth" value={data.dob} onChange={v=>setData(d=>({...d,dob:v}))} type="date" icon={I.calendar} required />
            <SelectField label="Gender" value={data.gender} onChange={v=>setData(d=>({...d,gender:v}))} options={['Female','Male','Other','Prefer not to say']} />
            <SelectField label="Relationship to You" value={data.relationship} onChange={v=>setData(d=>({...d,relationship:v}))} options={['Mother','Father','Grandmother','Grandfather','Aunt','Uncle','Sibling','Other']} />
            <FloatInput label="NIC Number (optional)" value={data.nic} onChange={v=>setData(d=>({...d,nic:v}))} />
          </AddWizardG2>
        </AddWizardShell>
      )}

      {step===2 && (
        <AddWizardShell title="Address" sub="Where does this person live? This helps us match nearby care agents." canNext={!!data.address&&!!data.city} step={step} total={total} saving={saving} saveError={saveError} onClose={onBack} onBack={back} onNext={next}>
          <AddWizardG2>
            <SelectField label="Province" value={data.province} onChange={v=>setData(d=>({...d,province:v,city:''}))} options={provinces} />
            <SelectField label="City / Town" value={data.city} onChange={v=>setData(d=>({...d,city:v}))} options={data.province?(cities[data.province]??[]):['Colombo','Kandy','Galle','Negombo','Kurunegala']} icon={I.pin} />
            <div style={{gridColumn:'span 2'}}><FloatInput label="Street Address" value={data.address} onChange={v=>setData(d=>({...d,address:v}))} icon={I.pin} required /></div>
            <FloatInput label="Postal Code" value={data.postalCode} onChange={v=>setData(d=>({...d,postalCode:v}))} />
            <FloatInput label="Nearby Landmark" value={data.landmark} onChange={v=>setData(d=>({...d,landmark:v}))} hint="e.g. Near Cargills, opposite temple" />
          </AddWizardG2>
          <div style={{ marginTop:14, marginBottom:10 }}>
            <input placeholder="Search for an address in Sri Lanka…"
              onKeyDown={async e => {
                if (e.key === 'Enter') {
                  const results = await searchAddress((e.target as HTMLInputElement).value)
                  if (results[0]) {
                    const { lat, lon, display_name } = results[0]
                    setData(d => ({ ...d, lat: parseFloat(lat), lng: parseFloat(lon), address: display_name }))
                  }
                }
              }}
              style={{ width:'100%', padding:'11px 14px', borderRadius:12, border:`1.5px solid ${C.border}`, fontSize:14, fontFamily:'Manrope,sans-serif', color:C.type, outline:'none', background:'#FAFAFA', boxSizing:'border-box' as const }} />
          </div>
          <div style={{ borderRadius:14, overflow:'hidden', height:180, border:`1px solid ${C.border}` }}>
            <MapContainer center={[data.lat, data.lng]} zoom={13} style={{ height:'100%', width:'100%' }}>
              <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[data.lat, data.lng]} />
              <LocationPicker onSelect={async (lat, lng) => {
                setData(d => ({ ...d, lat, lng }))
                const result = await reverseGeocode(lat, lng)
                if (result?.display_name) setData(d => ({ ...d, address: result.display_name }))
              }} />
            </MapContainer>
          </div>
          <p style={{ fontSize:11, color:C.muted, marginTop:6 }}>Search above or click the map to set the exact location.</p>
        </AddWizardShell>
      )}

      {step===3 && (
        <AddWizardShell title="Medical Information" sub="Help care agents understand health needs and medication routines." step={step} total={total} saving={saving} saveError={saveError} onClose={onBack} onBack={back} onNext={next}>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <AddWizardG2>
              <SelectField label="Blood Group" value={data.bloodGroup} onChange={v=>setData(d=>({...d,bloodGroup:v}))} options={['A+','A-','B+','B-','AB+','AB-','O+','O-','Unknown']} />
              <FloatInput label="Known Allergies" value={data.allergies} onChange={v=>setData(d=>({...d,allergies:v}))} hint="e.g. Penicillin, latex, nuts" />
            </AddWizardG2>
            <FloatInput label="Medical Conditions" value={data.conditions} onChange={v=>setData(d=>({...d,conditions:v}))} multiline rows={2} hint="e.g. Type 2 Diabetes, Hypertension, Arthritis" />
            <FloatInput label="Current Medications" value={data.medications} onChange={v=>setData(d=>({...d,medications:v}))} multiline rows={2} hint="e.g. Metformin 500mg twice daily, Amlodipine 5mg once daily" />
            <AddWizardG2>
              <FloatInput label="Family Doctor" value={data.doctor} onChange={v=>setData(d=>({...d,doctor:v}))} icon={I.user} />
              <FloatInput label="Hospital / Clinic" value={data.hospital} onChange={v=>setData(d=>({...d,hospital:v}))} />
              <SelectField label="Mobility" value={data.mobility} onChange={v=>setData(d=>({...d,mobility:v}))} options={['Fully Independent','Uses Walking Stick','Uses Walker','Uses Wheelchair','Bedridden']} />
              <SelectField label="Vision" value={data.vision} onChange={v=>setData(d=>({...d,vision:v}))} options={['Normal','Reading Glasses','Bifocals','Partially Impaired','Severely Impaired']} />
              <SelectField label="Hearing" value={data.hearing} onChange={v=>setData(d=>({...d,hearing:v}))} options={['Normal','Mild Loss','Moderate Loss','Hearing Aid','Severely Impaired']} />
              <SelectField label="Memory / Cognition" value={data.memory} onChange={v=>setData(d=>({...d,memory:v}))} options={['Normal','Mild Forgetfulness','Mild Dementia','Moderate Dementia','Severe Dementia']} />
            </AddWizardG2>
            <FloatInput label="Special Medical Notes" value={data.medNotes} onChange={v=>setData(d=>({...d,medNotes:v}))} multiline rows={3} hint="e.g. Medication must be given after meals. Carry allergy alert card." />
          </div>
        </AddWizardShell>
      )}

      {step===4 && (
        <AddWizardShell title="Emergency Contacts" sub="Who should we contact in an emergency?" canNext={!!data.ec1Name&&!!data.ec1Phone} step={step} total={total} saving={saving} saveError={saveError} onClose={onBack} onBack={back} onNext={next}>
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <div style={{ padding:20, borderRadius:16, border:`1.5px solid ${C.border}`, background:'#FAFAFA' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
                <Badge label="Primary Contact" color={C.error} />
              </div>
              <AddWizardG2>
                <FloatInput label="Full Name" value={data.ec1Name} onChange={v=>setData(d=>({...d,ec1Name:v}))} icon={I.user} required />
                <SelectField label="Relationship" value={data.ec1Rel} onChange={v=>setData(d=>({...d,ec1Rel:v}))} options={['Son','Daughter','Spouse','Sibling','Friend','Other']} />
                <FloatInput label="Phone Number" value={data.ec1Phone} onChange={v=>setData(d=>({...d,ec1Phone:v}))} icon={I.phone} type="tel" required />
                <FloatInput label="Email Address" value={data.ec1Email} onChange={v=>setData(d=>({...d,ec1Email:v}))} icon={I.mail} type="email" />
              </AddWizardG2>
            </div>
            <div style={{ padding:20, borderRadius:16, border:`1px solid ${C.border}`, background:'#FAFAFA' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
                <Badge label="Secondary Contact" color={C.muted} bg="#F2F4F5" />
                <span style={{ fontSize:12, color:C.muted }}>(optional)</span>
              </div>
              <AddWizardG2>
                <FloatInput label="Full Name" value={data.ec2Name} onChange={v=>setData(d=>({...d,ec2Name:v}))} icon={I.user} />
                <SelectField label="Relationship" value={data.ec2Rel} onChange={v=>setData(d=>({...d,ec2Rel:v}))} options={['Son','Daughter','Spouse','Sibling','Friend','Other']} />
                <FloatInput label="Phone Number" value={data.ec2Phone} onChange={v=>setData(d=>({...d,ec2Phone:v}))} icon={I.phone} type="tel" />
                <FloatInput label="Email Address" value={data.ec2Email} onChange={v=>setData(d=>({...d,ec2Email:v}))} icon={I.mail} type="email" />
              </AddWizardG2>
            </div>
          </div>
        </AddWizardShell>
      )}

      {step===5 && (
        <AddWizardShell title="Care Preferences" sub="These preferences help us match the right care agent for your loved one." step={step} total={total} saving={saving} saveError={saveError} onClose={onBack} onBack={back} onNext={next}>
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
            <AddWizardG2>
              <FloatInput label="Dietary Restrictions" value={data.dietary} onChange={v=>setData(d=>({...d,dietary:v}))} hint="e.g. Diabetic-friendly, vegetarian" />
              <FloatInput label="Religious Requirements" value={data.religious} onChange={v=>setData(d=>({...d,religious:v}))} hint="e.g. Buddhist, avoid beef" />
              <SelectField label="Preferred Visit Times" value={data.visitTimes} onChange={v=>setData(d=>({...d,visitTimes:v}))} options={['Early Morning (6–8 AM)','Morning (8–11 AM)','Late Morning (10 AM–12 PM)','Afternoon (12–4 PM)','Evening (4–7 PM)','Flexible']} icon={I.clock} />
              <SelectField label="Communication Preference" value={data.commPref} onChange={v=>setData(d=>({...d,commPref:v}))} options={['WhatsApp','Phone Call','SMS','Email','In-App Chat']} />
            </AddWizardG2>
            <FloatInput label="Special Requests" value={data.specialReq} onChange={v=>setData(d=>({...d,specialReq:v}))} multiline rows={3} hint="Any additional notes for care agents" />
          </div>
        </AddWizardShell>
      )}

      {step===6 && (
        <AddWizardShell title="Documents" sub={existing ? "Existing documents are shown below. Upload replaces them right away." : "Upload key documents now, or add them later from the profile."} step={step} total={total} saving={saving} saveError={saveError} onClose={onBack} onBack={back} onNext={next}>
          <input ref={docFileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" onChange={onDocFileSelected} style={{ display:'none' }} />
          {existing && existingDocsLoading && <p style={{ fontSize:12, color:C.muted, marginBottom:12 }}>Loading existing documents…</p>}
          {existing && existingDocsError && <p style={{ fontSize:12, color:C.error, marginBottom:12 }}>{existingDocsError}</p>}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="bm-2col">
            {WIZARD_DOCUMENT_CATEGORIES.map(cat=>{
              const item = docQueue[cat.type]
              const existingDoc = existing ? existingDocs[cat.type] : undefined
              const showExisting = !!existingDoc && !item
              const clickable = !showExisting && (!item || item.status==='failed')
              const borderColor = item?.status==='failed' ? C.error : (item?.status==='uploaded' || showExisting) ? C.success : C.border
              const isDeleting = deletingType===cat.type
              return (
                <div key={cat.type} onClick={()=>{ if (clickable) triggerDocPicker(cat.type) }}
                  style={{ border:`2px dashed ${borderColor}`, borderRadius:14, padding:'18px', textAlign:'center', cursor:clickable?'pointer':'default', background:'#FAFAFA', transition:'all 0.18s', position:'relative' }}
                  onMouseEnter={e=>{ if(clickable){ e.currentTarget.style.borderColor=C.primary; e.currentTarget.style.background=`${C.primary}04` } }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor=borderColor; e.currentTarget.style.background='#FAFAFA' }}>
                  <div style={{ width:36,height:36,borderRadius:10,background:`${item?.status==='uploaded'||showExisting?C.success:item?.status==='failed'?C.error:C.primary}10`,display:'flex',alignItems:'center',justifyContent:'center',color:item?.status==='uploaded'||showExisting?C.success:item?.status==='failed'?C.error:C.primary,margin:'0 auto 8px' }}>
                    {(item?.status==='uploaded' || showExisting) ? I.check : I.upload}
                  </div>
                  <p style={{ fontSize:12,fontWeight:700,color:C.type,fontFamily:'Manrope,sans-serif',marginBottom:3 }}>{cat.label}</p>
                  {!item && !showExisting && <p style={{ fontSize:11,color:C.muted }}>PDF, JPG, PNG · Max 10 MB</p>}

                  {showExisting && existingDoc && (
                    <div onClick={e=>e.stopPropagation()}>
                      <p style={{ fontSize:11, color:C.sub, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{existingDoc.name || 'Untitled document'}</p>
                      <p style={{ fontSize:11, fontWeight:700, marginTop:2, color:C.success }}>
                        Uploaded{existingDoc.uploaded_at ? ' ' + new Date(existingDoc.uploaded_at).toLocaleDateString('en-GB',{ day:'numeric', month:'short', year:'numeric' }) : ''}
                      </p>
                      {existingDoc.expiry_date && (
                        <p style={{ fontSize:11, color:C.muted, marginTop:2 }}>Expires {new Date(existingDoc.expiry_date).toLocaleDateString('en-GB',{ day:'numeric', month:'short', year:'numeric' })}</p>
                      )}
                      {cleanupWarnings[cat.type] && <p style={{ fontSize:10, color:C.warning, marginTop:4 }}>{cleanupWarnings[cat.type]}</p>}
                      {openErrorType?.type===cat.type && <p style={{ fontSize:10, color:C.error, marginTop:4 }}>{openErrorType.message}</p>}
                      {deleteErrorType?.type===cat.type && <p style={{ fontSize:10, color:C.error, marginTop:4 }}>{deleteErrorType.message}</p>}
                      <div style={{ display:'flex', gap:6, justifyContent:'center', marginTop:8, flexWrap:'wrap' }}>
                        <button onClick={()=>openExistingDoc(cat.type)} disabled={openingType===cat.type}
                          style={{ padding:'4px 10px', borderRadius:8, border:`1px solid ${C.border}`, background:'#fff', cursor:openingType===cat.type?'wait':'pointer', fontSize:11, fontWeight:700, color:C.sub, fontFamily:'Manrope,sans-serif' }}>
                          {openingType===cat.type ? 'Opening…' : 'Open'}
                        </button>
                        <button onClick={()=>triggerDocPicker(cat.type)} disabled={isDeleting}
                          style={{ padding:'4px 10px', borderRadius:8, border:`1px solid ${C.border}`, background:'#fff', cursor:isDeleting?'not-allowed':'pointer', fontSize:11, fontWeight:700, color:C.primary, fontFamily:'Manrope,sans-serif' }}>
                          Replace
                        </button>
                        <button onClick={()=>requestDeleteDoc(cat.type)} disabled={isDeleting}
                          style={{ padding:'4px 10px', borderRadius:8, border:`1px solid ${C.error}30`, background:'#fff', cursor:isDeleting?'wait':'pointer', fontSize:11, fontWeight:700, color:C.error, fontFamily:'Manrope,sans-serif' }}>
                          {isDeleting ? 'Removing…' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  )}

                  {item && (
                    <>
                      <p style={{ fontSize:11, color:C.sub, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.file.name}</p>
                      <p style={{ fontSize:11, fontWeight:700, marginTop:2, color: item.status==='uploaded'?C.success : item.status==='failed'?C.error : item.status==='uploading'?C.primary : C.muted }}>
                        {item.status==='uploaded' ? 'Uploaded' : item.status==='failed' ? (item.error || 'Upload failed') : item.status==='uploading' ? (existingDoc ? 'Replacing…' : 'Uploading…') : existing ? 'Uploading…' : 'Queued — uploads after Save'}
                      </p>
                      {item.status==='failed' && (
                        <button onClick={e=>{ e.stopPropagation(); retryDocUpload(cat.type) }} style={{ marginTop:6, background:'none', border:'none', cursor:'pointer', color:C.primary, fontSize:11, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>Retry</button>
                      )}
                      {/* Only offered before anything real has been written — clearing
                          an already-uploaded item would just hide it locally without
                          actually deleting the real row/file. A real, already-saved
                          document is removed via the Delete button above instead. */}
                      {(item.status==='queued' || item.status==='failed') && (
                        <button onClick={e=>{ e.stopPropagation(); clearDocQueue(cat.type) }} style={{ position:'absolute', top:8, right:8, width:20, height:20, borderRadius:6, border:'none', background:'transparent', cursor:'pointer', color:C.muted, display:'flex', alignItems:'center', justifyContent:'center' }} title="Remove">{I.close}</button>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>
          <p style={{ fontSize:12, color:C.muted, marginTop:16, textAlign:'center' }}>{existing ? 'Uploading a file for a slot that already has one replaces it — the old file is removed once the new one is saved.' : 'You can skip this step and upload documents later from the beneficiary profile.'}</p>

          {deleteConfirmType && (
            <div style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <div onClick={()=>{ if (!deletingType) setDeleteConfirmType(null) }} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.40)', backdropFilter:'blur(3px)' }} />
              <Card style={{ padding:28, maxWidth:380, width:'90%', position:'relative', zIndex:1 }}>
                <div style={{ width:48, height:48, borderRadius:'50%', background:`${C.error}10`, display:'flex', alignItems:'center', justifyContent:'center', color:C.error, margin:'0 auto 14px' }}>{I.close}</div>
                <h3 style={{ fontSize:16, fontWeight:900, color:C.type, textAlign:'center', fontFamily:'Manrope,sans-serif', marginBottom:8 }}>Delete this document?</h3>
                <p style={{ fontSize:13, color:C.muted, textAlign:'center', lineHeight:1.6, marginBottom:22 }}>
                  {WIZARD_DOCUMENT_CATEGORIES.find(c=>c.type===deleteConfirmType)?.label || deleteConfirmType} ({existingDocs[deleteConfirmType]?.name}) will be permanently removed. This can't be undone.
                </p>
                <div style={{ display:'flex', gap:10 }}>
                  <Btn label="Cancel" variant="secondary" onClick={()=>setDeleteConfirmType(null)} disabled={!!deletingType} />
                  <button onClick={confirmDeleteDoc} disabled={!!deletingType}
                    style={{ flex:1, padding:'10px', borderRadius:10, border:'none', background:C.error, cursor:deletingType?'not-allowed':'pointer', color:'#fff', fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', opacity:deletingType?0.7:1 }}>
                    {deletingType?'Deleting…':'Delete Document'}
                  </button>
                </div>
              </Card>
            </div>
          )}
        </AddWizardShell>
      )}

      {step===7 && (
        <AddWizardShell title="Review & Save" sub="Review the details before saving the beneficiary profile." step={step} total={total} saving={saving} saveError={saveError} onClose={onBack} onBack={back} onNext={next}>
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
          {saveError && <p style={{ marginTop:14, padding:12, borderRadius:10, background:`${C.error}08`, border:`1px solid ${C.error}30`, color:C.error, fontSize:13 }}>{saveError}</p>}
        </AddWizardShell>
      )}
    </>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function BeneficiaryManagement() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const requestedId = searchParams.get('id')
  const [view, setView] = useState<View>(searchParams.get('add') ? 'add-wizard' : requestedId ? 'profile' : 'dashboard')
  const [selectedId, setSelectedId] = useState<string>(requestedId || '')
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [listError, setListError] = useState('')
  const [clientId, setClientId] = useState('')

  // The detail view fetches its own beneficiary directly by id (rather than
  // only filtering the already-loaded list) so a page refresh or direct
  // /beneficiaries?id=... link always reads fresh from Supabase.
  const [profileBene, setProfileBene] = useState<Beneficiary | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [documents, setDocuments] = useState<Beneficiary['documents']>([])
  const [documentsLoading, setDocumentsLoading] = useState(false)
  const [documentsError, setDocumentsError] = useState('')

  const loadBeneficiaries = (id: string) => {
    setListLoading(true)
    setListError('')
    return getBeneficiariesFull(id)
      .then(setBeneficiaries)
      .catch(err => { console.error('Failed to load beneficiaries:', err); setListError("We couldn't load your beneficiaries. Please try again.") })
      .finally(() => setListLoading(false))
  }
  const [clientId, setClientId] = useState('')

  const refetch = () => { if (clientId) getBeneficiariesFull(clientId).then(setBeneficiaries).catch(console.error) }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setClientId(data.user.id)
        {
        setClientId(data.user.id)
        loadBeneficiaries(data.user.id)
      } else {
        setListLoading(false)
      }
      }
    })
  }, [])

  const loadDocuments = (id: string) => {
    setDocumentsLoading(true)
    setDocumentsError('')
    return getBeneficiaryDocuments(id)
      .then((docs: any[]) => setDocuments(docs.map(d => ({
        id: d.id, name: d.name || '', type: d.type || 'Other',
        date: d.uploaded_at ? new Date(d.uploaded_at).toLocaleDateString('en-GB',{ day:'numeric', month:'short', year:'numeric' }) : '',
        expiry: d.expiry_date || undefined, url: d.file_url || undefined,
      }))))
      .catch(err => { console.error('Failed to load documents:', err); setDocumentsError("Couldn't load documents.") })
      .finally(() => setDocumentsLoading(false))
  }

  const loadProfile = (id: string, cid: string) => {
    setProfileLoading(true)
    setProfileError('')
    getBeneficiaryById(id, cid)
      .then(b => setProfileBene(b as Beneficiary | null))
      .catch(err => { console.error('Failed to load beneficiary:', err); setProfileError("We couldn't load this beneficiary. Please try again.") })
      .finally(() => setProfileLoading(false))

    loadDocuments(id)
  }

  useEffect(() => {
    if (view==='profile' && selectedId && clientId) loadProfile(selectedId, clientId)
  }, [view, selectedId, clientId])

  const goToProfile = (id: string) => { setSelectedId(id); setView('profile') }

  const handleArchive = async (id: string) => {
    if (!clientId) return
    try {
      await updateBeneficiary(id, { status: 'archived' }, clientId)
      await loadBeneficiaries(clientId)
      if (view==='profile' && id===selectedId) loadProfile(id, clientId)
    } catch (err) {
      console.error('Failed to archive beneficiary:', err)
    }
  }
  const handleRestore = async (id: string) => {
    if (!clientId) return
    try {
      await updateBeneficiary(id, { status: 'active' }, clientId)
      await loadBeneficiaries(clientId)
      if (view==='profile' && id===selectedId) loadProfile(id, clientId)
    } catch (err) {
      console.error('Failed to restore beneficiary:', err)
    }
  }

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
        {view==='dashboard' && (
          <Dashboard
            onView={goToProfile}
            onAdd={()=>setView('add-wizard')}
            onEdit={id=>{ setSelectedId(id); setView('edit-wizard') }}
            onArchive={handleArchive}
            onRestore={handleRestore}
            onNewRequest={()=>navigate('/request/new')}
            beneficiaries={beneficiaries}
            loading={listLoading}
            error={listError}
          />
        )}
        {view==='profile' && profileBene && (
          <Profile
            b={profileBene}
            onBack={()=>{ setView('dashboard'); setProfileBene(null) }}
            onEdit={()=>setView('edit-wizard')}
            onArchive={async()=>{ await handleArchive(profileBene.id) }}
            onRestore={()=>handleRestore(profileBene.id)}
            onNewRequest={()=>navigate('/request/new')}
            documents={documents} documentsLoading={documentsLoading} documentsError={documentsError}
            onDocumentUploaded={()=>loadDocuments(profileBene.id)}
          />
        )}
        {view==='profile' && !profileBene && (
          <p style={{ padding:40, color: profileError?C.error:C.muted, fontSize:13 }}>{profileLoading ? 'Loading beneficiary…' : profileError || 'Beneficiary not found.'}</p>
        )}
        {view==='add-wizard' && (
          <div style={{ flex:1, display:'flex', flexDirection:'column', background:C.surface, overflow:'hidden' }}>
            <AddWizard onBack={()=>setView('dashboard')} onDone={()=>{ setView('dashboard'); if (clientId) loadBeneficiaries(clientId) }} clientId={clientId} clientId={clientId} onSaved={refetch} />
          </div>
        )}
        {view==='edit-wizard' && profileBene && (
          <div style={{ flex:1, display:'flex', flexDirection:'column', background:C.surface, overflow:'hidden' }}>
            <AddWizard existing={profileBene} onBack={()=>setView('profile')}
              onDone={()=>{ setView('profile'); if (clientId) { loadBeneficiaries(clientId); loadProfile(profileBene.id, clientId) } }}
              clientId={clientId} />
          </div>
        )}
        {view==='edit-wizard' && !profileBene && selectedId && (() => {
          const fromList = beneficiaries.find(b=>b.id===selectedId)
          return fromList
            ? (
              <div style={{ flex:1, display:'flex', flexDirection:'column', background:C.surface, overflow:'hidden' }}>
                <AddWizard existing={fromList} onBack={()=>setView('dashboard')}
                  onDone={()=>{ setView('dashboard'); if (clientId) loadBeneficiaries(clientId) }}
                  clientId={clientId} />
              </div>
            )
            : <p style={{ padding:40, color:C.muted, fontSize:13 }}>Loading beneficiary…</p>
        })()}
      </div>
    </div>
  )
}
