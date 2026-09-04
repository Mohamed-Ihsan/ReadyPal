import { useState, useRef, useCallback, type ReactNode, type CSSProperties, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logoFull from '@/imports/20260723_170707.png'
import { supabase } from '../lib/supabaseClient'
import { createCareRequestFromWizard, uploadCareRequestAttachment, validateCareRequestAttachmentFile, type CareRequestAttachmentType } from '../lib/api'
import { getBeneficiaries, createBeneficiary } from '../lib/api'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import '../lib/leafletSetup'

// ─── Brand ───────────────────────────────────────────────────────────────────
const C = {
  primary: '#00737A', accent: '#EE8153', type: '#2C3E43', sub: '#6B7E85',
  muted: '#9AAAB0', border: '#E4E8EA', bg: '#F2F4F5', surface: '#FFFFFF',
  success: '#22C55E', warning: '#F59E0B', error: '#EF4444', info: '#3B82F6',
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const I: Record<string, ReactNode> = {
  check:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5 7-7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevronR: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevronL: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevronD: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  close:    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  plus:     <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  search:   <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.4"/><path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  user:     <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.4"/><path d="M3 16c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  hospital: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M9 5.5v7M5.5 9h7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  pill:     <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="3" y="7" width="12" height="4" rx="2" stroke="currentColor" strokeWidth="1.4" transform="rotate(-45 9 9)"/><path d="M6.5 11.5l5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  home:     <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2.5 9L9 2.5 15.5 9v7.5H11v-5H7v5H2.5V9z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  heart:    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 15s-7-4.35-7-9a4 4 0 0 1 7-2.65A4 4 0 0 1 16 6c0 4.65-7 9-7 9z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  alert:    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2.5L1.5 15.5h15L9 2.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M9 8v3.5M9 13.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  car:      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 10l1.5-4h9L15 10v4H3v-4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><circle cx="5.5" cy="13" r="1.2" stroke="currentColor" strokeWidth="1.2"/><circle cx="12.5" cy="13" r="1.2" stroke="currentColor" strokeWidth="1.2"/></svg>,
  cart:     <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M1.5 1.5h2l2.5 9h7.5l2-6H5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><circle cx="7.5" cy="15" r="1.5" stroke="currentColor" strokeWidth="1.3"/><circle cx="13" cy="15" r="1.5" stroke="currentColor" strokeWidth="1.3"/></svg>,
  receipt:  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3.5 2h11v14l-2-1.5-1.5 1.5-2-1.5-2 1.5L5.5 14.5 3.5 16V2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M6.5 7h5M6.5 9.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  phone:    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 2h5a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.4"/><circle cx="6.5" cy="11" r=".7" fill="currentColor"/></svg>,
  mail:     <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M1.5 5.5l6.5 4.5 6.5-4.5" stroke="currentColor" strokeWidth="1.4"/></svg>,
  pin:      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5A4 4 0 0 1 12 5.5c0 3.5-4 9-4 9s-4-5.5-4-9a4 4 0 0 1 4-4z" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.3"/></svg>,
  calendar: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M1.5 7h13M5 1.5V4M11 1.5V4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  clock:    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/><path d="M8 5v3.5l2 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  refresh:  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M12 7a5 5 0 1 1-1.34-3.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M12 3v2.5H9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  globe:    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/><path d="M8 1.5c0 0-2 2.5-2 6.5s2 6.5 2 6.5M8 1.5c0 0 2 2.5 2 6.5s-2 6.5-2 6.5M1.5 8h13" stroke="currentColor" strokeWidth="1.3"/></svg>,
  upload:   <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 12.5v2A1.5 1.5 0 0 0 4.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-2M9 2v9M5.5 5l3.5-3.5L12.5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  doc:      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M9.5 1.5H4A1.5 1.5 0 0 0 2.5 3v10A1.5 1.5 0 0 0 4 14.5h8A1.5 1.5 0 0 0 13.5 13V5.5L9.5 1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M9.5 1.5V5.5h4M5.5 8.5h5M5.5 11h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  mic:      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="5.5" y="1.5" width="5" height="8" rx="2.5" stroke="currentColor" strokeWidth="1.4"/><path d="M3 8a5 5 0 0 0 10 0M8 13v2M6 15h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  info:     <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/><path d="M8 7v4.5M8 5.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  shield:   <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5l5.5 2v4.5C13.5 12 10.5 14.5 8 15.5 5.5 14.5 2.5 12 2.5 8V3.5L8 1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  save:     <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 2.5h8.5L14 5v8.5A1.5 1.5 0 0 1 12.5 15H3.5A1.5 1.5 0 0 1 2 13.5V4A1.5 1.5 0 0 1 3 2.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M5 2.5v4h6v-4M8 8.5v5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  star:     <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5l1.9 4 4.3.6-3.1 3 .73 4.3L8 11.2l-3.83 2.2.73-4.3-3.1-3 4.3-.6L8 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  warning:  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2L1.5 13.5h13L8 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M8 7v3M8 11.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  confetti: <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="12" cy="10" r="3" fill="#EE8153"/><circle cx="36" cy="8" r="2" fill="#00737A"/><circle cx="40" cy="24" r="2.5" fill="#EE8153"/><circle cx="8" cy="32" r="2" fill="#22C55E"/><circle cx="28" cy="40" r="3" fill="#3B82F6"/><path d="M20 4l2 6M42 16l-5 3M6 18l4 2M38 36l-3-4M14 38l1-5" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  trash:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3.5h10M5.5 3.5v-2h3v2M4 3.5l.7 8h4.6l.7-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  edit:     <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  heartbeat:<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1.5 8h3l1.5-2.5 2 5L9.5 8H14.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
}

// ─── Shared primitives ────────────────────────────────────────────────────────
function Btn({ label, onClick, variant = 'primary', icon, disabled = false, full = false }: {
  label: string; onClick?: () => void; variant?: 'primary'|'secondary'|'ghost'|'danger'|'accent'; icon?: ReactNode; disabled?: boolean; full?: boolean
}) {
  const [hov, setHov] = useState(false)
  const styles: Record<string, CSSProperties> = {
    primary:   { background: disabled ? '#B0BEC5' : hov ? '#005D63' : C.primary, color: '#fff', border: 'none', boxShadow: disabled ? 'none' : hov ? `0 4px 14px ${C.primary}50` : `0 2px 8px ${C.primary}30` },
    secondary: { background: hov ? '#F0F5F5' : '#fff', color: C.primary, border: `1.5px solid ${hov ? C.primary : C.border}` },
    ghost:     { background: hov ? '#F2F4F5' : 'transparent', color: C.sub, border: 'none' },
    danger:    { background: hov ? '#DC2626' : C.error, color: '#fff', border: 'none' },
    accent:    { background: hov ? '#D9703E' : C.accent, color: '#fff', border: 'none', boxShadow: hov ? `0 4px 14px ${C.accent}50` : `0 2px 8px ${C.accent}30` },
  }
  return (
    <button onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      disabled={disabled}
      style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'11px 22px', borderRadius:12, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily:'Manrope,sans-serif', fontSize:14, fontWeight:700, transition:'all 0.15s', width: full ? '100%' : undefined, ...styles[variant] }}>
      {icon && <span style={{ display:'flex' }}>{icon}</span>}
      {label}
    </button>
  )
}

function FloatInput({ label, value, onChange, type = 'text', icon, error, hint, required = false, multiline = false, rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; icon?: ReactNode
  error?: string; hint?: string; required?: boolean; multiline?: boolean; rows?: number
}) {
  const [focused, setFocused] = useState(false)
  const lifted = focused || value.length > 0
  const borderColor = error ? C.error : focused ? C.primary : C.border

  const shared: CSSProperties = {
    width: '100%', padding: icon ? '20px 14px 8px 40px' : '20px 14px 8px 14px', borderRadius: 12,
    border: `1.5px solid ${borderColor}`, fontFamily: 'Manrope,sans-serif', fontSize: 14,
    color: C.type, outline: 'none', background: '#FAFAFA', transition: 'border-color 0.15s, box-shadow 0.15s', resize: 'none',
    boxShadow: focused ? `0 0 0 3px ${error ? C.error : C.primary}18` : 'none',
  }

  return (
    <div style={{ position: 'relative' }}>
      {icon && (
        <span style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color: focused ? C.primary : C.muted, display:'flex', pointerEvents:'none', zIndex:1 }}>{icon}</span>
      )}
      <label style={{ position:'absolute', left: icon ? 40 : 14, top: lifted ? 7 : '50%', transform: lifted ? 'none' : 'translateY(-50%)', fontSize: lifted ? 11 : 14, fontWeight: lifted ? 700 : 400, color: focused ? C.primary : C.muted, pointerEvents:'none', transition:'all 0.15s', zIndex:1, fontFamily:'Manrope,sans-serif', lineHeight:1 }}>
        {label}{required && ' *'}
      </label>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={{ ...shared, paddingTop: 24, paddingBottom: 10 }} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={shared} />
      }
      {(error || hint) && <p style={{ fontSize:11, marginTop:4, color: error ? C.error : C.muted, paddingLeft:4 }}>{error ?? hint}</p>}
    </div>
  )
}

function SelectField({ label, value, onChange, options, icon }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; icon?: ReactNode
}) {
  const [focused, setFocused] = useState(false)
  const lifted = focused || value.length > 0
  return (
    <div style={{ position:'relative' }}>
      {icon && <span style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color: focused ? C.primary : C.muted, display:'flex', pointerEvents:'none', zIndex:1 }}>{icon}</span>}
      <label style={{ position:'absolute', left: icon ? 40 : 14, top: lifted ? 7 : '50%', transform: lifted ? 'none' : 'translateY(-50%)', fontSize: lifted ? 11 : 14, fontWeight: lifted ? 700 : 400, color: focused ? C.primary : C.muted, pointerEvents:'none', transition:'all 0.15s', zIndex:1, fontFamily:'Manrope,sans-serif', lineHeight:1 }}>
        {label}
      </label>
      <select value={value} onChange={e => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ width:'100%', padding: icon ? '20px 14px 8px 40px' : '20px 14px 8px 14px', borderRadius:12, border:`1.5px solid ${focused ? C.primary : C.border}`, fontFamily:'Manrope,sans-serif', fontSize:14, color: value ? C.type : C.muted, outline:'none', background:'#FAFAFA', appearance:'none', cursor:'pointer', boxShadow: focused ? `0 0 0 3px ${C.primary}18` : 'none', transition:'all 0.15s' }}>
        <option value="" disabled />
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <span style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', color:C.muted, pointerEvents:'none', display:'flex' }}>{I.chevronD}</span>
    </div>
  )
}

function Toggle({ label, sub, on, set }: { label: string; sub?: string; on: boolean; set: () => void }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', borderRadius:12, border:`1px solid ${on ? C.primary : C.border}`, background: on ? `${C.primary}06` : '#FAFAFA', transition:'all 0.2s', cursor:'pointer' }} onClick={set}>
      <div>
        <p style={{ fontSize:14, fontWeight:700, color:C.type, fontFamily:'Manrope,sans-serif' }}>{label}</p>
        {sub && <p style={{ fontSize:12, color:C.muted, marginTop:1 }}>{sub}</p>}
      </div>
      <div style={{ width:44, height:24, borderRadius:12, background: on ? C.primary : C.border, position:'relative', flexShrink:0, transition:'background 0.2s', marginLeft:16 }}>
        <div style={{ position:'absolute', top:3, left: on ? 23 : 3, width:18, height:18, borderRadius:'50%', background:'#fff', transition:'left 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.15)' }} />
      </div>
    </div>
  )
}

function UploadZone({ label, accept, onFile, file, icon, error }: {
  label: string; accept: string; onFile: (file: File) => void; file: File | null; icon?: ReactNode
  error?: string
}) {
  const [drag, setDrag] = useState(false)
  const hasError = !!error
  const borderColor = drag ? C.primary : hasError ? C.error : file ? C.success : C.border
  return (
    <div>
      <div onDragOver={e => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) onFile(f) }}
        style={{ border:`2px dashed ${borderColor}`, borderRadius:14, padding:'24px 20px', textAlign:'center', background: drag ? `${C.primary}05` : hasError ? `${C.error}05` : file ? `${C.success}05` : '#FAFAFA', transition:'all 0.2s', cursor:'pointer' }}
        onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = accept; i.onchange = (e: Event) => { const t = e.target as HTMLInputElement; if (t.files?.[0]) onFile(t.files[0]) }; i.click() }}>
        <div style={{ width:44, height:44, borderRadius:12, background: hasError ? `${C.error}12` : file ? `${C.success}12` : `${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px', color: hasError ? C.error : file ? C.success : C.primary }}>
          {icon ?? I.upload}
        </div>
        {file
          ? <p style={{ fontSize:13, fontWeight:700, color: hasError ? C.error : C.success, fontFamily:'Manrope,sans-serif', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{file.name}</p>
          : <>
              <p style={{ fontSize:13, fontWeight:700, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:3 }}>{label}</p>
              <p style={{ fontSize:11, color:C.muted }}>Drag & drop or click · Max 10 MB</p>
            </>
        }
      </div>
      {hasError && <p style={{ fontSize:11, color:C.error, marginTop:6, textAlign:'center' }}>{error}</p>}
    </div>
  )
}

function InlineAlert({ type, msg }: { type: 'error'|'warning'|'info'|'success'; msg: string }) {
  const map = { error:{c:C.error,i:I.warning}, warning:{c:C.warning,i:I.warning}, info:{c:C.info,i:I.info}, success:{c:C.success,i:I.check} }
  const { c, i } = map[type]
  return (
    <div style={{ display:'flex', gap:10, alignItems:'flex-start', padding:'12px 14px', borderRadius:10, background:`${c}0F`, border:`1px solid ${c}30` }}>
      <span style={{ color:c, display:'flex', flexShrink:0, marginTop:1 }}>{i}</span>
      <p style={{ fontSize:13, color:C.type, fontFamily:'Manrope,sans-serif', lineHeight:1.5 }}>{msg}</p>
    </div>
  )
}

function HelpCard({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ border:`1px solid ${C.border}`, borderRadius:12, overflow:'hidden', background:'#FAFAFA' }}>
      <button onClick={() => setOpen(o => !o)} style={{ width:'100%', padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'none', border:'none', cursor:'pointer', fontFamily:'Manrope,sans-serif', textAlign:'left' }}>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <span style={{ color:C.primary, display:'flex' }}>{I.info}</span>
          <span style={{ fontSize:13, fontWeight:600, color:C.type }}>{q}</span>
        </div>
        <span style={{ color:C.muted, transform: open ? 'rotate(180deg)' : 'none', transition:'transform 0.2s', display:'flex' }}>{I.chevronD}</span>
      </button>
      {open && <div style={{ padding:'0 16px 14px', borderTop:`1px solid ${C.border}` }}><p style={{ fontSize:13, color:C.muted, lineHeight:1.6, paddingTop:10 }}>{a}</p></div>}
    </div>
  )
}

function LocationPicker({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({ click(e) { onSelect(e.latlng.lat, e.latlng.lng) } })
  return null
}

async function searchAddress(query: string) {
  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=lk&q=${encodeURIComponent(query)}`)
  return res.json()
}

async function reverseGeocode(lat: number, lng: number) {
  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
  return res.json()
}

// ─── Wizard Steps Config ──────────────────────────────────────────────────────
const STEPS = [
  { n:1, label:'Beneficiary',     sub:'Who needs care?' },
  { n:2, label:'Service',         sub:'What help is needed?' },
  { n:3, label:'Schedule',        sub:'When is it needed?' },
  { n:4, label:'Location',        sub:'Where will care happen?' },
  { n:5, label:'Budget',          sub:'How much can you spend?' },
  { n:6, label:'Extra Info',      sub:'Helpful details' },
  { n:7, label:'Review',          sub:'Check everything' },
  { n:8, label:'Confirmation',    sub:'Done!' },
]

// ─── Left Progress Panel ──────────────────────────────────────────────────────
function WizardSidebar({ step }: { step: number }) {
  return (
    <aside style={{ width:280, flexShrink:0, background:`linear-gradient(160deg,#00737A 0%,#005D63 60%,#003035 100%)`, display:'flex', flexDirection:'column', padding:'32px 0', position:'relative', overflow:'hidden' }}>
      {/* decorative blobs */}
      <div aria-hidden style={{ position:'absolute', top:-80, right:-80, width:300, height:300, borderRadius:'50%', background:'rgba(255,255,255,0.06)', pointerEvents:'none' }} />
      <div aria-hidden style={{ position:'absolute', bottom:-60, left:-60, width:240, height:240, borderRadius:'50%', background:'rgba(238,129,83,0.12)', pointerEvents:'none' }} />

      {/* Logo */}
      <div style={{ padding:'0 28px 32px' }}>
        <img src={logoFull} alt="ReadyPal" style={{ height:84, objectFit:'contain', objectPosition:'left', filter:'brightness(0) invert(1)' }} />
      </div>

      {/* Title */}
      <div style={{ padding:'0 28px 28px', borderBottom:'1px solid rgba(255,255,255,0.12)' }}>
        <p style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.55)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:4 }}>Care Request Wizard</p>
        <p style={{ fontSize:18, fontWeight:800, color:'#fff', lineHeight:1.3 }}>Let's arrange care for your loved one.</p>
      </div>

      {/* Steps list */}
      <nav style={{ flex:1, padding:'24px 20px', overflowY:'auto', display:'flex', flexDirection:'column', gap:4 }}>
        {STEPS.map(s => {
          const done = s.n < step
          const active = s.n === step
          return (
            <div key={s.n} style={{ display:'flex', gap:12, alignItems:'center', padding:'10px 10px', borderRadius:12, background: active ? 'rgba(255,255,255,0.12)' : 'transparent', transition:'background 0.2s' }}>
              <div style={{ width:28, height:28, borderRadius:'50%', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', background: done ? C.success : active ? '#fff' : 'rgba(255,255,255,0.14)', border: active ? 'none' : done ? 'none' : '1.5px solid rgba(255,255,255,0.22)', transition:'all 0.2s' }}>
                {done
                  ? <span style={{ color:'#fff', display:'flex' }}>{I.check}</span>
                  : <span style={{ fontSize:12, fontWeight:800, color: active ? C.primary : 'rgba(255,255,255,0.6)', fontFamily:'Manrope,sans-serif' }}>{s.n}</span>
                }
              </div>
              <div>
                <p style={{ fontSize:13, fontWeight: active ? 800 : 600, color: active ? '#fff' : done ? 'rgba(255,255,255,0.70)' : 'rgba(255,255,255,0.45)', fontFamily:'Manrope,sans-serif', lineHeight:1.2 }}>{s.label}</p>
                {active && <p style={{ fontSize:11, color:'rgba(255,255,255,0.55)', marginTop:1 }}>{s.sub}</p>}
              </div>
            </div>
          )
        })}
      </nav>

      {/* Progress bar */}
      <div style={{ padding:'16px 28px 0' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
          <span style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.55)', fontFamily:'Manrope,sans-serif' }}>Progress</span>
          <span style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.80)', fontFamily:'Manrope,sans-serif' }}>{Math.round(((step - 1) / 7) * 100)}%</span>
        </div>
        <div style={{ height:4, borderRadius:2, background:'rgba(255,255,255,0.15)', overflow:'hidden' }}>
          <div style={{ height:'100%', background:'linear-gradient(90deg,#EE8153,#F5A67A)', borderRadius:2, width:`${((step - 1) / 7) * 100}%`, transition:'width 0.5s cubic-bezier(0.4,0,0.2,1)' }} />
        </div>
      </div>
    </aside>
  )
}

// ─── Step Wrapper ─────────────────────────────────────────────────────────────
function StepShell({ title, sub, children, step, total, onBack, onNext, onSaveDraft, nextLabel = 'Continue', nextDisabled = false, onClose }: {
  title: string; sub: string; children: ReactNode; step: number; total: number
  onBack?: () => void; onNext: () => void; onSaveDraft?: () => void
  nextLabel?: string; nextDisabled?: boolean; onClose: () => void
}) {
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', minHeight:0 }}>
      {/* Top bar */}
      <div style={{ height:60, borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', padding:'0 32px', gap:16, flexShrink:0 }}>
        <div style={{ flex:1 }}>
          <p style={{ fontSize:11, fontWeight:700, color:C.muted, letterSpacing:'0.06em', textTransform:'uppercase', fontFamily:'Manrope,sans-serif' }}>Step {step} of {total}</p>
        </div>
        {onSaveDraft && (
          <button onClick={onSaveDraft} style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', fontSize:12, fontWeight:700, color:C.sub, fontFamily:'Manrope,sans-serif' }}>
            {I.save} Save Draft
          </button>
        )}
        <button onClick={onClose} style={{ width:32, height:32, borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.muted }}>
          {I.close}
        </button>
      </div>

      {/* Mobile step dots */}
      <div style={{ padding:'12px 20px 0', display:'flex', gap:6, alignItems:'center' }} className="wizard-mobile-dots">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{ height:3, flex: i === step - 1 ? 2 : 1, borderRadius:2, background: i < step - 1 ? C.success : i === step - 1 ? C.primary : C.border, transition:'all 0.3s' }} />
        ))}
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:'auto', padding:'32px 32px 0' }}>
        <div style={{ maxWidth:680, marginBottom:28 }}>
          <h2 style={{ fontSize:26, fontWeight:900, color:C.type, letterSpacing:'-0.025em', lineHeight:1.2, marginBottom:6, fontFamily:'Manrope,sans-serif' }}>{title}</h2>
          <p style={{ fontSize:14, color:C.muted, lineHeight:1.6 }}>{sub}</p>
        </div>
        <div style={{ maxWidth:680 }}>
          {children}
        </div>
        <div style={{ height:32 }} />
      </div>

      {/* Bottom nav */}
      <div style={{ borderTop:`1px solid ${C.border}`, padding:'16px 32px', display:'flex', alignItems:'center', gap:12, flexShrink:0, background:C.surface }}>
        {onBack
          ? <Btn label="Back" variant="secondary" icon={I.chevronL} onClick={onBack} />
          : <div />
        }
        <div style={{ flex:1 }} />
        <Btn label={nextLabel} variant="primary" icon={I.chevronR} onClick={onNext} disabled={nextDisabled} />
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// STEP 1 — SELECT BENEFICIARY
// ══════════════════════════════════════════════════════════════════════════════
function Step1({ data, setData, onNext, onClose, clientId }: { data: WizardData; setData: SetData; onNext: ()=>void; onClose: ()=>void; clientId: string }) {
  const [search, setSearch] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('')
  const [newAge, setNewAge] = useState('')
  const [newRel, setNewRel] = useState('')
  const [newLoc, setNewLoc] = useState('')
  const [beneficiaries, setBeneficiaries] = useState<any[]>([])

  useEffect(() => {
    if (!clientId) return
    getBeneficiaries(clientId).then(setBeneficiaries).catch(console.error)
  }, [clientId])

  const healthColor: Record<string,string> = { 'active':'#22C55E', 'pending':'#F59E0B', 'archived':'#9AAAB0' }
  const filtered = beneficiaries.filter(b => (b.name||'').toLowerCase().includes(search.toLowerCase()))

  const handleAdd = async () => {
    if (!newName) return
    const row = await createBeneficiary({ name: newName, age: newAge ? Number(newAge) : null, relationship: newRel, city: newLoc }, clientId)
    setBeneficiaries(prev => [...prev, row])
    setData(d => ({ ...d, beneficiaryId: row.id, beneficiaryName: row.name }))
    setShowNew(false)
    setNewName(''); setNewAge(''); setNewRel(''); setNewLoc('')
  }

  return (
    <StepShell title="Who needs care?" sub="Select the person who will receive care, or add a new beneficiary." step={1} total={7} onNext={onNext} onSaveDraft={() => {}} nextDisabled={!data.beneficiaryId} onClose={onClose}>
      <div style={{ position:'relative', marginBottom:20 }}>
        <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:C.muted, display:'flex' }}>{I.search}</span>
        <input placeholder="Search beneficiaries…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ width:'100%', padding:'11px 14px 11px 36px', borderRadius:12, border:`1.5px solid ${C.border}`, fontSize:14, fontFamily:'Manrope,sans-serif', color:C.type, outline:'none', background:'#FAFAFA', boxSizing:'border-box' }} />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:20 }} className="bene-2col">
        {filtered.map(b => {
          const selected = data.beneficiaryId === b.id
          return (
            <div key={b.id} onClick={() => setData(d => ({ ...d, beneficiaryId: b.id, beneficiaryName: b.name }))}
              style={{ padding:20, borderRadius:16, border:`2px solid ${selected ? C.primary : C.border}`, background: selected ? `${C.primary}06` : '#FAFAFA', cursor:'pointer', transition:'all 0.18s', position:'relative' }}>
              {selected && (
                <div style={{ position:'absolute', top:12, right:12, width:22, height:22, borderRadius:'50%', background:C.primary, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>{I.check}</div>
              )}
              <div style={{ display:'flex', gap:12, alignItems:'flex-start', marginBottom:12 }}>
                <div style={{ width:48, height:48, borderRadius:'50%', background:`${C.primary}14`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary, fontWeight:900, fontSize:18, fontFamily:'Manrope,sans-serif', flexShrink:0 }}>
                  {(b.name||'?').split(' ').map((w:string) => w[0]).join('').slice(0,2)}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:15, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{b.name}</p>
                  <p style={{ fontSize:12, color:C.muted }}>{b.relationship || 'Beneficiary'}</p>
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
                <span style={{ display:'flex', color:C.muted }}>{I.pin}</span>
                <span style={{ fontSize:12, color:C.sub }}>{b.city || '—'}</span>
              </div>
              <div style={{ display:'flex', gap:6 }}>
                <span style={{ padding:'3px 10px', borderRadius:999, fontSize:11, fontWeight:700, background:`${healthColor[b.status]||'#9AAAB0'}14`, color:healthColor[b.status]||'#9AAAB0' }}>{b.status || 'active'}</span>
              </div>
            </div>
          )
        })}

        <div onClick={() => setShowNew(true)} style={{ padding:20, borderRadius:16, border:`2px dashed ${C.border}`, cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, minHeight:140 }}>
          <div style={{ width:44, height:44, borderRadius:'50%', background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary }}>{I.plus}</div>
          <p style={{ fontSize:13, fontWeight:700, color:C.type, fontFamily:'Manrope,sans-serif' }}>Add Beneficiary</p>
          <p style={{ fontSize:12, color:C.muted, textAlign:'center' }}>Register a new person to receive care</p>
        </div>
      </div>

      {showNew && (
        <div style={{ padding:24, borderRadius:16, border:`1.5px solid ${C.border}`, background:'#FAFAFA', marginBottom:20 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
            <p style={{ fontSize:15, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>New Beneficiary</p>
            <button onClick={() => setShowNew(false)} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted }}>{I.close}</button>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="bene-2col">
            <FloatInput label="Full Name" value={newName} onChange={setNewName} icon={I.user} required />
            <FloatInput label="Age" value={newAge} onChange={setNewAge} type="number" />
            <SelectField label="Relationship" value={newRel} onChange={setNewRel} options={['Mother','Father','Grandparent','Aunt','Uncle','Other']} />
            <SelectField label="City / Town" value={newLoc} onChange={setNewLoc} options={['Colombo','Kandy','Galle','Negombo','Kurunegala','Jaffna','Batticaloa']} icon={I.pin} />
          </div>
          <div style={{ marginTop:14 }}>
            <Btn label="Add Beneficiary" variant="primary" onClick={handleAdd} />
          </div>
        </div>
      )}

      {!data.beneficiaryId && (
        <InlineAlert type="info" msg="Please select or add a beneficiary to continue." />
      )}

      <div style={{ marginTop:20 }}>
        <HelpCard q="Why do I need to select a beneficiary?" a="Selecting a beneficiary helps ReadyPal match the right care agent based on their location, health needs, and language preference. This ensures the best possible care experience for your loved one." />
      </div>
    </StepShell>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// STEP 2 — SERVICE SELECTION
// ══════════════════════════════════════════════════════════════════════════════
function Step2({ data, setData, onNext, onBack, onClose }: { data: WizardData; setData: SetData; onNext: ()=>void; onBack: ()=>void; onClose: ()=>void }) {
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('All')

  const services = [
    { id:'hospital',   label:'Hospital Companion',            icon:I.hospital, cat:'Medical',  duration:'2–6 hrs', range:'LKR 3,500–6,000', desc:'A dedicated companion for hospital visits, consultations, and medical procedures.' },
    { id:'med-assist', label:'Medical Appointment Assistance', icon:I.heartbeat, cat:'Medical',  duration:'1–4 hrs', range:'LKR 2,500–5,000', desc:'Help attending GP visits, specialist consultations, and follow-up appointments.' },
    { id:'medication', label:'Medication Collection',          icon:I.pill,     cat:'Medical',  duration:'1–2 hrs', range:'LKR 1,200–2,500', desc:'Collect prescribed medications from pharmacies and ensure correct dispensing.' },
    { id:'wellness',   label:'Home Wellness Visit',            icon:I.home,     cat:'Wellness', duration:'2–4 hrs', range:'LKR 1,800–4,000', desc:'A comprehensive in-home visit including vital checks, companionship, and light assistance.' },
    { id:'checkin',    label:'Daily Check-in',                 icon:I.heart,    cat:'Wellness', duration:'30–60 min', range:'LKR 500–1,200', desc:'Regular wellbeing calls and short visits to ensure your loved one is safe and comfortable.' },
    { id:'emergency',  label:'Emergency Assistance',           icon:I.alert,    cat:'Emergency',duration:'Immediate',range:'LKR 5,000+',    desc:'Urgent care support available around the clock for unexpected medical or personal emergencies.' },
    { id:'transport',  label:'Transportation',                 icon:I.car,      cat:'Practical',duration:'Varies',  range:'LKR 1,500–4,000', desc:'Safe and comfortable transportation to hospitals, markets, places of worship, and more.' },
    { id:'bills',      label:'Bill Payments',                  icon:I.receipt,  cat:'Practical',duration:'1–2 hrs', range:'LKR 800–1,500',  desc:'Assistance with utility bills, banking visits, and government office errands.' },
    { id:'shopping',   label:'Shopping Assistance',            icon:I.cart,     cat:'Practical',duration:'1–3 hrs', range:'LKR 1,000–2,500', desc:'Grocery shopping, pharmacy runs, and household essentials procurement.' },
  ]

  const cats = ['All','Medical','Wellness','Practical','Emergency']
  const catColorMap: Record<string,string> = { Medical:C.primary, Wellness:C.success, Practical:C.accent, Emergency:C.error }
  const filtered = services.filter(s => (cat === 'All' || s.cat === cat) && s.label.toLowerCase().includes(search.toLowerCase()))
  const toggleService = (id: string) => setData(d => ({ ...d, services: d.services.includes(id) ? d.services.filter(s => s !== id) : [...d.services, id] }))

  return (
    <StepShell title="What help is needed?" sub="Select one or more services. You can mix and match." step={2} total={7} onBack={onBack} onNext={onNext} onSaveDraft={() => {}} nextDisabled={data.services.length === 0} onClose={onClose}>
      {/* Search + filter */}
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:'1 1 200px' }}>
          <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:C.muted, display:'flex' }}>{I.search}</span>
          <input placeholder="Search services…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ width:'100%', padding:'10px 14px 10px 36px', borderRadius:10, border:`1.5px solid ${C.border}`, fontSize:13, fontFamily:'Manrope,sans-serif', color:C.type, outline:'none', background:'#FAFAFA', boxSizing:'border-box' }} />
        </div>
        {cats.map(c => (
          <button key={c} onClick={() => setCat(c)} style={{ padding:'8px 16px', borderRadius:999, border:'none', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:700, background: cat === c ? C.primary : '#F2F4F5', color: cat === c ? '#fff' : C.sub, transition:'all 0.15s' }}>{c}</button>
        ))}
      </div>

      {data.services.length > 0 && (
        <div style={{ marginBottom:16 }}>
          <InlineAlert type="success" msg={`${data.services.length} service${data.services.length > 1 ? 's' : ''} selected. Continue to schedule.`} />
        </div>
      )}

      {/* Service grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="bene-2col">
        {filtered.map(s => {
          const selected = data.services.includes(s.id)
          const cc = catColorMap[s.cat] ?? C.primary
          return (
            <div key={s.id} onClick={() => toggleService(s.id)}
              style={{ padding:20, borderRadius:16, border:`2px solid ${selected ? cc : C.border}`, background: selected ? `${cc}06` : '#FAFAFA', cursor:'pointer', transition:'all 0.18s', position:'relative' }}>
              {selected && (
                <div style={{ position:'absolute', top:12, right:12, width:22, height:22, borderRadius:'50%', background:cc, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>{I.check}</div>
              )}
              <div style={{ width:44, height:44, borderRadius:12, background:`${cc}12`, display:'flex', alignItems:'center', justifyContent:'center', color:cc, marginBottom:12 }}>{s.icon}</div>
              <p style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:4, fontFamily:'Manrope,sans-serif' }}>{s.label}</p>
              <p style={{ fontSize:12, color:C.muted, lineHeight:1.5, marginBottom:10 }}>{s.desc}</p>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, fontWeight:600, color:C.sub }}>{I.clock} {s.duration}</span>
                <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, fontWeight:600, color:cc }}>{s.range}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop:20 }}>
        <HelpCard q="Not sure which service to choose?" a="For hospital visits, choose Hospital Companion. For day-to-day support at home, try Home Wellness Visit or Daily Check-in. You can select multiple services in a single request — our care agents are trained to handle multiple tasks in one visit." />
      </div>
    </StepShell>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// STEP 3 — SCHEDULE
// ══════════════════════════════════════════════════════════════════════════════
function Step3({ data, setData, onNext, onBack, onClose }: { data: WizardData; setData: SetData; onNext: ()=>void; onBack: ()=>void; onClose: ()=>void }) {
  const [calMonth, setCalMonth] = useState(new Date(2025, 0, 1))

  const daysInMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 0).getDate()
  const firstDay = new Date(calMonth.getFullYear(), calMonth.getMonth(), 1).getDay()
  const today = new Date(2025, 0, 13)
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']

  const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2,'0')}:00`)

  return (
    <StepShell title="When is care needed?" sub="Pick a date and time that suits your loved one." step={3} total={7} onBack={onBack} onNext={onNext} onSaveDraft={() => {}} nextDisabled={!data.date} onClose={onClose}>
      <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:24, alignItems:'start' }} className="schedule-grid">
        {/* Calendar */}
        <div style={{ background:'#FAFAFA', border:`1px solid ${C.border}`, borderRadius:16, padding:20, width:300 }}>
          {/* Month nav */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <button onClick={() => setCalMonth(m => new Date(m.getFullYear(), m.getMonth()-1,1))} style={{ width:32, height:32, borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.muted }}>{I.chevronL}</button>
            <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{monthNames[calMonth.getMonth()]} {calMonth.getFullYear()}</p>
            <button onClick={() => setCalMonth(m => new Date(m.getFullYear(), m.getMonth()+1,1))} style={{ width:32, height:32, borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.muted }}>{I.chevronR}</button>
          </div>
          {/* Day labels */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', marginBottom:4 }}>
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
              <p key={d} style={{ textAlign:'center', fontSize:11, fontWeight:700, color:C.muted, padding:'4px 0', fontFamily:'Manrope,sans-serif' }}>{d}</p>
            ))}
          </div>
          {/* Days grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2 }}>
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
              const date = `${calMonth.getFullYear()}-${String(calMonth.getMonth()+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
              const isPast = new Date(calMonth.getFullYear(), calMonth.getMonth(), d) < today
              const isSelected = data.date === date
              const isToday = d === 13 && calMonth.getMonth() === 0
              return (
                <button key={d} disabled={isPast} onClick={() => setData(s => ({ ...s, date }))}
                  style={{ height:34, borderRadius:8, border:'none', cursor: isPast ? 'not-allowed' : 'pointer', fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight: isSelected ? 800 : 500, background: isSelected ? C.primary : isToday ? `${C.primary}14` : 'transparent', color: isSelected ? '#fff' : isPast ? '#D0D8DC' : isToday ? C.primary : C.type, transition:'all 0.12s' }}>
                  {d}
                </button>
              )
            })}
          </div>
        </div>

        {/* Right side: time + toggles */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {data.date && (
            <div style={{ padding:14, borderRadius:12, background:`${C.primary}08`, border:`1px solid ${C.primary}20` }}>
              <p style={{ fontSize:13, fontWeight:700, color:C.primary, fontFamily:'Manrope,sans-serif' }}>
                Selected: {data.date}
              </p>
            </div>
          )}

          <SelectField label="Preferred Time" value={data.time} onChange={v => setData(d => ({ ...d, time:v }))} options={hours} icon={I.clock} />

          <SelectField label="Estimated Duration" value={data.duration} onChange={v => setData(d => ({ ...d, duration:v }))} options={['30 minutes','1 hour','2 hours','3 hours','4 hours','6 hours','Full Day','Flexible']} icon={I.clock} />

          <Toggle label="Flexible Schedule" sub="Allow care agent to suggest an alternative time within ±2 hours" on={data.flexible} set={() => setData(d => ({ ...d, flexible:!d.flexible }))} />

          <Toggle label="Recurring Service" sub="Repeat this request on a regular schedule" on={data.recurring} set={() => setData(d => ({ ...d, recurring:!d.recurring }))} />

          {data.recurring && (
            <div style={{ padding:16, borderRadius:12, border:`1px solid ${C.border}`, background:'#FAFAFA', display:'flex', flexDirection:'column', gap:10 }}>
              <p style={{ fontSize:13, fontWeight:700, color:C.type, fontFamily:'Manrope,sans-serif' }}>Frequency</p>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {['Daily','Weekly','Fortnightly','Monthly'].map(f => (
                  <button key={f} onClick={() => setData(d => ({ ...d, frequency:f }))}
                    style={{ padding:'7px 16px', borderRadius:999, border:`1.5px solid ${data.frequency === f ? C.primary : C.border}`, background: data.frequency === f ? `${C.primary}10` : 'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:700, color: data.frequency === f ? C.primary : C.sub, transition:'all 0.15s' }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ padding:12, borderRadius:10, background:'#F2F4F5', display:'flex', gap:8 }}>
            <span style={{ color:C.muted, flexShrink:0 }}>{I.globe}</span>
            <p style={{ fontSize:12, color:C.muted, lineHeight:1.5 }}>All times are in <strong>Sri Lanka Standard Time (UTC+5:30)</strong>. Your care agent operates in this timezone.</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop:24 }}>
        <HelpCard q="Can I schedule recurring visits?" a="Yes — enable the Recurring Service toggle and choose your preferred frequency. Recurring bookings lock in the same care agent across all visits, ensuring continuity of care for your loved one." />
      </div>
    </StepShell>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// STEP 4 — LOCATION
// ══════════════════════════════════════════════════════════════════════════════
function Step4({ data, setData, onNext, onBack, onClose }: { data: WizardData; setData: SetData; onNext: ()=>void; onBack: ()=>void; onClose: ()=>void }) {
  const provinces = ['Western','Central','Southern','Northern','Eastern','North Western','North Central','Uva','Sabaragamuwa']
  const cities: Record<string,string[]> = {
    Western: ['Colombo','Gampaha','Kalutara'], Central: ['Kandy','Matale','Nuwara Eliya'],
    Southern: ['Galle','Matara','Hambantota'], 'North Western': ['Kurunegala','Puttalam'], Eastern: ['Batticaloa','Ampara','Trincomalee'],
    Northern: ['Jaffna','Kilinochchi','Mullaitivu'], Uva: ['Badulla','Monaragala'], Sabaragamuwa: ['Ratnapura','Kegalle'],
  }
  const savedAddresses = [
    { label:"Amara's Home",   addr:'14/3 Temple Road, Colombo 07', city:'Colombo' },
    { label:"Nimal's House",  addr:'78 Kandy Road, Peradeniya',    city:'Kandy'   },
  ]

  return (
    <StepShell title="Where will care happen?" sub="Provide the exact location so your care agent can find your loved one." step={4} total={7} onBack={onBack} onNext={onNext} onSaveDraft={() => {}} nextDisabled={!data.address1 || !data.city} onClose={onClose}>
      {/* Real map — search + click to drop pin */}
      <div style={{ marginBottom:16 }}>
        <input
          placeholder="Search for an address in Sri Lanka…"
          onKeyDown={async e => {
            if (e.key === 'Enter') {
              const results = await searchAddress((e.target as HTMLInputElement).value)
              if (results[0]) {
                const { lat, lon, display_name } = results[0]
                setData(d => ({ ...d, lat: parseFloat(lat), lng: parseFloat(lon), address1: display_name }))
              }
            }
          }}
          style={{ width:'100%', padding:'11px 14px', borderRadius:12, border:`1.5px solid ${C.border}`, fontSize:14, fontFamily:'Manrope,sans-serif', color:C.type, outline:'none', background:'#FAFAFA', boxSizing:'border-box' }} />
      </div>
      <div style={{ borderRadius:16, overflow:'hidden', marginBottom:24, height:260, border:`1px solid ${C.border}` }}>
        <MapContainer center={[data.lat, data.lng]} zoom={13} style={{ height:'100%', width:'100%' }}>
          <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[data.lat, data.lng]} />
          <LocationPicker onSelect={async (lat, lng) => {
            setData(d => ({ ...d, lat, lng }))
            const result = await reverseGeocode(lat, lng)
            if (result?.display_name) {
              setData(d => ({ ...d, address1: result.display_name, city: result.address?.city || result.address?.town || d.city }))
            }
          }} />
        </MapContainer>
      </div>
      <p style={{ fontSize:12, color:C.muted, marginTop:-16, marginBottom:20 }}>Search above, or click anywhere on the map to drop a pin — your address will fill in automatically.</p>

      {/* Saved addresses */}
      {savedAddresses.length > 0 && (
        <div style={{ marginBottom:20 }}>
          <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:10, fontFamily:'Manrope,sans-serif' }}>Saved Addresses</p>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            {savedAddresses.map(a => (
              <button key={a.label} onClick={() => setData(d => ({ ...d, address1:a.addr, city:a.city }))}
                style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 14px', borderRadius:10, border:`1.5px solid ${data.address1 === a.addr ? C.primary : C.border}`, background: data.address1 === a.addr ? `${C.primary}08` : '#FAFAFA', cursor:'pointer', fontFamily:'Manrope,sans-serif' }}>
                <span style={{ color:C.primary, display:'flex' }}>{I.pin}</span>
                <div style={{ textAlign:'left' }}>
                  <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{a.label}</p>
                  <p style={{ fontSize:11, color:C.muted }}>{a.addr}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Form */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="bene-2col">
        <SelectField label="Province" value={data.province} onChange={v => setData(d => ({ ...d, province:v, city:'' }))} options={provinces} />
        <SelectField label="City / Town" value={data.city} onChange={v => setData(d => ({ ...d, city:v }))} options={data.province ? (cities[data.province] ?? []) : []} icon={I.pin} />
        <div style={{ gridColumn:'span 2' }}>
          <FloatInput label="Address Line 1" value={data.address1} onChange={v => setData(d => ({ ...d, address1:v }))} icon={I.pin} required />
        </div>
        <div style={{ gridColumn:'span 2' }}>
          <FloatInput label="Address Line 2 (optional)" value={data.address2} onChange={v => setData(d => ({ ...d, address2:v }))} />
        </div>
        <FloatInput label="Postal Code" value={data.postalCode} onChange={v => setData(d => ({ ...d, postalCode:v }))} />
        <FloatInput label="Landmarks (optional)" value={data.landmarks} onChange={v => setData(d => ({ ...d, landmarks:v }))} hint="e.g. Near Cargills FoodCity, opposite the temple" />
        <div style={{ gridColumn:'span 2' }}>
          <FloatInput label="Accessibility Notes (optional)" value={data.accessNotes} onChange={v => setData(d => ({ ...d, accessNotes:v }))} multiline rows={2} hint="e.g. Ground floor only, uses a wheelchair, elevator available" />
        </div>
      </div>

      <div style={{ marginTop:20 }}>
        <HelpCard q="Why is a precise address important?" a="An exact address helps your care agent arrive on time, especially for morning hospital appointments. Including landmarks helps in areas where GPS may be unreliable. For apartment buildings, building access instructions are especially helpful." />
      </div>
    </StepShell>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// STEP 5 — BUDGET
// ══════════════════════════════════════════════════════════════════════════════
function Step5({ data, setData, onNext, onBack, onClose }: { data: WizardData; setData: SetData; onNext: ()=>void; onBack: ()=>void; onClose: ()=>void }) {
  const min = 500, max = 15000
  const pct = ((data.budget - min) / (max - min)) * 100
  const platformFee = Math.round(data.budget * 0.10)
  const total = data.budget + platformFee

  const presets = [
    { label:'Basic', value:2000, sub:'Simple check-in or errand' },
    { label:'Standard', value:4500, sub:'Home visit or med collection' },
    { label:'Premium', value:8500, sub:'Hospital escort or specialist' },
  ]

  return (
    <StepShell title="What is your budget?" sub="Set a comfortable budget. Care agents may negotiate — toggle below if you're open to it." step={5} total={7} onBack={onBack} onNext={onNext} onSaveDraft={() => {}} onClose={onClose}>
      {/* Preset chips */}
      <div style={{ display:'flex', gap:10, marginBottom:24 }}>
        {presets.map(p => (
          <button key={p.label} onClick={() => setData(d => ({ ...d, budget:p.value }))}
            style={{ flex:1, padding:'14px 12px', borderRadius:14, border:`2px solid ${data.budget === p.value ? C.primary : C.border}`, background: data.budget === p.value ? `${C.primary}08` : '#FAFAFA', cursor:'pointer', textAlign:'center', fontFamily:'Manrope,sans-serif', transition:'all 0.15s' }}>
            <p style={{ fontSize:13, fontWeight:800, color: data.budget === p.value ? C.primary : C.type }}>{p.label}</p>
            <p style={{ fontSize:12, fontWeight:700, color: data.budget === p.value ? C.primary : C.type, marginTop:2 }}>LKR {p.value.toLocaleString()}</p>
            <p style={{ fontSize:11, color:C.muted, marginTop:2 }}>{p.sub}</p>
          </button>
        ))}
      </div>

      {/* Slider */}
      <div style={{ padding:24, borderRadius:16, border:`1px solid ${C.border}`, background:'#FAFAFA', marginBottom:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <p style={{ fontSize:14, fontWeight:700, color:C.type, fontFamily:'Manrope,sans-serif' }}>Custom Amount</p>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:12, fontWeight:700, color:C.muted, fontFamily:'Manrope,sans-serif' }}>LKR</span>
            <input type="number" value={data.budget} onChange={e => setData(d => ({ ...d, budget: Math.max(min, Math.min(max, Number(e.target.value))) }))}
              style={{ width:90, padding:'6px 10px', borderRadius:8, border:`1.5px solid ${C.border}`, fontSize:16, fontWeight:800, fontFamily:'Manrope,sans-serif', color:C.primary, textAlign:'center', outline:'none' }} />
          </div>
        </div>

        {/* Custom styled range slider */}
        <div style={{ position:'relative', height:24, display:'flex', alignItems:'center' }}>
          <div style={{ position:'absolute', left:0, right:0, height:4, borderRadius:2, background:C.border }} />
          <div style={{ position:'absolute', left:0, height:4, borderRadius:2, background:`linear-gradient(90deg,${C.primary},#00959E)`, width:`${pct}%`, transition:'width 0.1s' }} />
          <input type="range" min={min} max={max} step={100} value={data.budget} onChange={e => setData(d => ({ ...d, budget: Number(e.target.value) }))}
            style={{ position:'absolute', left:0, right:0, width:'100%', opacity:0, cursor:'pointer', height:24 }} />
          <div style={{ position:'absolute', left:`${pct}%`, width:20, height:20, borderRadius:'50%', background:'#fff', border:`3px solid ${C.primary}`, boxShadow:`0 2px 8px ${C.primary}30`, transform:'translateX(-50%)', transition:'left 0.1s', pointerEvents:'none' }} />
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
          <span style={{ fontSize:11, color:C.muted }}>LKR {min.toLocaleString()}</span>
          <span style={{ fontSize:11, color:C.muted }}>LKR {max.toLocaleString()}</span>
        </div>
      </div>

      {/* Budget breakdown */}
      <div style={{ padding:20, borderRadius:16, border:`1px solid ${C.border}`, marginBottom:20 }}>
        <p style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:14, fontFamily:'Manrope,sans-serif' }}>Budget Breakdown</p>
        {[
          { label:'Your budget',      value:`LKR ${data.budget.toLocaleString()}`, bold:false },
          { label:'Platform fee (10%)', value:`LKR ${platformFee.toLocaleString()}`, bold:false, note:'Covers secure matching, support & guarantees' },
        ].map(r => (
          <div key={r.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', padding:'10px 0', borderBottom:`1px solid ${C.border}` }}>
            <div>
              <p style={{ fontSize:13, fontWeight: r.bold ? 800 : 600, color:C.type, fontFamily:'Manrope,sans-serif' }}>{r.label}</p>
              {r.note && <p style={{ fontSize:11, color:C.muted }}>{r.note}</p>}
            </div>
            <p style={{ fontSize:14, fontWeight:700, color:C.type, fontFamily:'Manrope,sans-serif' }}>{r.value}</p>
          </div>
        ))}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:12 }}>
          <p style={{ fontSize:15, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Estimated Total</p>
          <p style={{ fontSize:20, fontWeight:900, color:C.primary, fontFamily:'Manrope,sans-serif', letterSpacing:'-0.02em' }}>LKR {total.toLocaleString()}</p>
        </div>
      </div>

      <div style={{ marginBottom:20 }}>
        <Toggle label="Open to Negotiation" sub="Allow care agents to propose a different rate and discuss with you" on={data.negotiable} set={() => setData(d => ({ ...d, negotiable: !d.negotiable }))} />
      </div>

      <SelectField label="Preferred Currency" value={data.currency} onChange={v => setData(d => ({ ...d, currency:v }))} options={['LKR – Sri Lankan Rupee','AUD – Australian Dollar','USD – US Dollar','GBP – British Pound','EUR – Euro','CAD – Canadian Dollar']} icon={I.globe} />

      <div style={{ marginTop:20 }}>
        <HelpCard q="Need help estimating a budget?" a="For a standard home wellness visit (2–3 hours), LKR 3,500–5,000 is a typical range. Hospital escorts for full-day procedures may run LKR 6,000–10,000. The platform fee (10%) covers ReadyPal's secure matching, real-time communication, and payment guarantee. All rates are transparent — no hidden charges." />
      </div>
    </StepShell>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// STEP 6 — ADDITIONAL INFO
// ══════════════════════════════════════════════════════════════════════════════
function Step6({ data, setData, attachments, setAttachments, onNext, onBack, onClose }: {
  data: WizardData; setData: SetData; attachments: CareRequestAttachments; setAttachments: SetAttachments
  onNext: ()=>void; onBack: ()=>void; onClose: ()=>void
}) {
  const [attachmentErrors, setAttachmentErrors] = useState<{ photo:string; medical:string; voice:string }>({ photo:'', medical:'', voice:'' })

  // Reselecting a file for a slot replaces the queued File object — never
  // queues a second one. Validated against the exact same rules
  // uploadCareRequestAttachment() enforces server-side, so a bad file is
  // rejected here with a visible error instead of silently uploading later.
  const selectAttachment = (slot: keyof CareRequestAttachments, type: CareRequestAttachmentType, file: File) => {
    const error = validateCareRequestAttachmentFile(type, file)
    if (error) {
      setAttachmentErrors(e => ({ ...e, [slot]: error }))
      return
    }
    setAttachmentErrors(e => ({ ...e, [slot]: '' }))
    setAttachments(a => ({ ...a, [slot]: file }))
  }

  const languages = ['Sinhala','Tamil','English','Malay','Burgher']
  const genders = ['No Preference','Female','Male']
  const skills = ['Nursing Assistance','Medication Management','Mobility Support','Dementia Care','Post-Surgery Care','Palliative Care','First Aid Certified','Driver Licence']

  return (
    <StepShell title="Any helpful details?" sub="The more your care agent knows, the better they can serve your loved one." step={6} total={7} onBack={onBack} onNext={onNext} onSaveDraft={() => {}} nextLabel="Review Request" onClose={onClose}>
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <FloatInput label="Detailed Instructions" value={data.instructions} onChange={v => setData(d => ({ ...d, instructions:v }))} multiline rows={4} hint="e.g. Please call Amara 10 minutes before arriving. She prefers her morning tea before any activity." />

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="bene-2col">
          <FloatInput label="Medical Conditions" value={data.medConditions} onChange={v => setData(d => ({ ...d, medConditions:v }))} hint="e.g. Type 2 diabetes, hypertension, cataracts" />
          <FloatInput label="Mobility Information" value={data.mobility} onChange={v => setData(d => ({ ...d, mobility:v }))} hint="e.g. Uses a walking frame, can manage stairs slowly" />
        </div>

        {/* Languages */}
        <div>
          <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:10, fontFamily:'Manrope,sans-serif' }}>Languages Spoken</p>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {languages.map(l => {
              const on = data.languages.includes(l)
              return (
                <button key={l} onClick={() => setData(d => ({ ...d, languages: on ? d.languages.filter(x=>x!==l) : [...d.languages,l] }))}
                  style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:999, border:`1.5px solid ${on ? C.primary : C.border}`, background: on ? `${C.primary}10` : 'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:700, color: on ? C.primary : C.sub, transition:'all 0.15s' }}>
                  {on && <span style={{ display:'flex', color:C.primary }}>{I.check}</span>}
                  {l}
                </button>
              )
            })}
          </div>
        </div>

        {/* Agent gender preference */}
        <div>
          <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:10, fontFamily:'Manrope,sans-serif' }}>Preferred Care Agent Gender</p>
          <div style={{ display:'flex', gap:8 }}>
            {genders.map(g => (
              <button key={g} onClick={() => setData(d => ({ ...d, agentGender:g }))}
                style={{ flex:1, padding:'10px', borderRadius:12, border:`2px solid ${data.agentGender===g ? C.primary : C.border}`, background: data.agentGender===g ? `${C.primary}08` : '#FAFAFA', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:700, color: data.agentGender===g ? C.primary : C.sub, transition:'all 0.15s' }}>
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Required skills */}
        <div>
          <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:10, fontFamily:'Manrope,sans-serif' }}>Required Skills</p>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {skills.map(sk => {
              const on = data.requiredSkills.includes(sk)
              return (
                <button key={sk} onClick={() => setData(d => ({ ...d, requiredSkills: on ? d.requiredSkills.filter(x=>x!==sk) : [...d.requiredSkills,sk] }))}
                  style={{ display:'flex', alignItems:'center', gap:5, padding:'7px 12px', borderRadius:8, border:`1.5px solid ${on ? C.primary : C.border}`, background: on ? `${C.primary}10` : 'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:600, color: on ? C.primary : C.sub, transition:'all 0.15s' }}>
                  {on && <span style={{ display:'flex', color:C.primary }}>{I.check}</span>}
                  {sk}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="bene-2col">
          <FloatInput label="Emergency Contact Name" value={data.emergencyName} onChange={v => setData(d => ({ ...d, emergencyName:v }))} icon={I.user} />
          <FloatInput label="Emergency Contact Phone" value={data.emergencyPhone} onChange={v => setData(d => ({ ...d, emergencyPhone:v }))} icon={I.phone} type="tel" />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="bene-2col">
          <FloatInput label="Household Notes" value={data.householdNotes} onChange={v => setData(d => ({ ...d, householdNotes:v }))} hint="e.g. Ring bell twice, enter from side gate" />
          <FloatInput label="Parking & Access" value={data.parkingNotes} onChange={v => setData(d => ({ ...d, parkingNotes:v }))} hint="e.g. Free street parking on Temple Rd" />
        </div>

        <div style={{ display:'flex', gap:14 }}>
          <Toggle label="Pets at Home" sub="Let the care agent know" on={data.hasPets} set={() => setData(d => ({ ...d, hasPets:!d.hasPets }))} />
          <Toggle label="Parking Available" on={data.parkingAvail} set={() => setData(d => ({ ...d, parkingAvail:!d.parkingAvail }))} />
        </div>

        {/* File uploads */}
        <div>
          <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:12, fontFamily:'Manrope,sans-serif' }}>Attachments</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }} className="upload-3col">
            <UploadZone label="Photo of Home / Person" accept=".jpg,.jpeg,.png,image/jpeg,image/png" onFile={f=>selectAttachment('photo','Photo',f)} file={attachments.photo} error={attachmentErrors.photo} />
            <UploadZone label="Medical Documents" accept=".pdf,.jpg,.jpeg,.png" onFile={f=>selectAttachment('medical','Medical',f)} file={attachments.medical} icon={I.doc} error={attachmentErrors.medical} />
            <UploadZone label="Voice Note" accept=".mp3,.m4a,.wav,.webm,audio/mpeg,audio/mp4,audio/wav,audio/webm" onFile={f=>selectAttachment('voice','Voice',f)} file={attachments.voice} icon={I.mic} error={attachmentErrors.voice} />
          </div>
        </div>
      </div>
    </StepShell>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// STEP 7 — REVIEW
// ══════════════════════════════════════════════════════════════════════════════
function Step7({ data, setData, onNext, onBack, goTo, onClose, submitting }: { data: WizardData; setData: SetData; onNext: ()=>void; onBack: ()=>void; goTo: (n:number)=>void; onClose: ()=>void; submitting?: boolean }) {
  const [agreed, setAgreed] = useState(false)
  const [privacy, setPrivacy] = useState(false)

  const services: Record<string,string> = { hospital:'Hospital Companion', 'med-assist':'Medical Appointment Assistance', medication:'Medication Collection', wellness:'Home Wellness Visit', checkin:'Daily Check-in', emergency:'Emergency Assistance', transport:'Transportation', bills:'Bill Payments', shopping:'Shopping Assistance' }

  const Section = ({ title, step, children }: { title: string; step: number; children: ReactNode }) => (
    <div style={{ padding:20, borderRadius:16, border:`1px solid ${C.border}`, background:'#FAFAFA' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
        <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{title}</p>
        <button onClick={() => goTo(step)} style={{ display:'flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', fontSize:12, fontWeight:700, color:C.primary, fontFamily:'Manrope,sans-serif' }}>
          {I.edit} Edit
        </button>
      </div>
      {children}
    </div>
  )

  const Row = ({ label, val }: { label: string; val: string }) => (
    <div style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:`1px solid ${C.border}` }}>
      <p style={{ fontSize:13, color:C.muted, fontFamily:'Manrope,sans-serif' }}>{label}</p>
      <p style={{ fontSize:13, fontWeight:700, color:C.type, fontFamily:'Manrope,sans-serif', textAlign:'right', maxWidth:'60%' }}>{val || '—'}</p>
    </div>
  )

  const platformFee = Math.round(data.budget * 0.10)

  return (
    <StepShell title="Review your request" sub="Double-check everything before submitting. You can edit any section." step={7} total={7} onBack={onBack} onNext={onNext} onSaveDraft={() => {}} nextLabel={submitting ? 'Submitting...' : 'Submit Request'} nextDisabled={!agreed || !privacy || submitting} onClose={onClose}>
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <Section title="Beneficiary" step={1}>
          <Row label="Name" val={data.beneficiaryName} />
        </Section>

        <Section title="Services" step={2}>
          {data.services.length > 0
            ? data.services.map(s => <Row key={s} label="" val={services[s] ?? s} />)
            : <p style={{ fontSize:13, color:C.muted }}>No services selected</p>
          }
        </Section>

        <Section title="Schedule" step={3}>
          <Row label="Date" val={data.date} />
          <Row label="Time" val={data.time} />
          <Row label="Duration" val={data.duration} />
          <Row label="Recurring" val={data.recurring ? `Yes — ${data.frequency}` : 'No'} />
        </Section>

        <Section title="Location" step={4}>
          <Row label="Address" val={[data.address1, data.address2].filter(Boolean).join(', ')} />
          <Row label="City" val={data.city} />
          <Row label="Province" val={data.province} />
          <Row label="Postal Code" val={data.postalCode} />
          {data.landmarks && <Row label="Landmarks" val={data.landmarks} />}
        </Section>

        <Section title="Budget" step={5}>
          <Row label="Your Budget" val={`LKR ${data.budget.toLocaleString()}`} />
          <Row label="Platform Fee" val={`LKR ${platformFee.toLocaleString()}`} />
          <Row label="Estimated Total" val={`LKR ${(data.budget + platformFee).toLocaleString()}`} />
          <Row label="Negotiable" val={data.negotiable ? 'Yes' : 'No'} />
          <Row label="Currency" val={data.currency} />
        </Section>

        {(data.instructions || data.medConditions || data.languages.length > 0) && (
          <Section title="Additional Information" step={6}>
            {data.instructions && <Row label="Instructions" val={data.instructions} />}
            {data.medConditions && <Row label="Medical Conditions" val={data.medConditions} />}
            {data.mobility && <Row label="Mobility" val={data.mobility} />}
            {data.languages.length > 0 && <Row label="Languages" val={data.languages.join(', ')} />}
            {data.agentGender && <Row label="Agent Gender" val={data.agentGender} />}
            {data.emergencyName && <Row label="Emergency Contact" val={`${data.emergencyName} · ${data.emergencyPhone}`} />}
          </Section>
        )}

        {/* Agreements */}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {[
            { on: agreed, set: () => setAgreed(a => !a), label: 'I accept the ReadyPal Terms & Conditions and agree to the care request process.' },
            { on: privacy, set: () => setPrivacy(p => !p), label: 'I consent to ReadyPal processing the personal information provided in this request for matching purposes, in accordance with the Privacy Policy.' },
          ].map((item, i) => (
            <div key={i} onClick={item.set} style={{ display:'flex', gap:12, alignItems:'flex-start', padding:'14px 16px', borderRadius:12, border:`1.5px solid ${item.on ? C.primary : C.border}`, background: item.on ? `${C.primary}06` : '#FAFAFA', cursor:'pointer', transition:'all 0.15s' }}>
              <div style={{ width:20, height:20, borderRadius:6, border:`2px solid ${item.on ? C.primary : C.border}`, background: item.on ? C.primary : '#fff', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', flexShrink:0, marginTop:1, transition:'all 0.15s' }}>
                {item.on && I.check}
              </div>
              <p style={{ fontSize:13, color:C.sub, lineHeight:1.55, fontFamily:'Manrope,sans-serif' }}>{item.label}</p>
            </div>
          ))}
        </div>

        {(!agreed || !privacy) && (
          <InlineAlert type="warning" msg="Please accept both the Terms & Conditions and Privacy Policy to submit your request." />
        )}

        <div style={{ padding:14, borderRadius:12, background:`${C.primary}08`, border:`1px solid ${C.primary}20`, display:'flex', gap:10 }}>
          <span style={{ color:C.primary, display:'flex', flexShrink:0 }}>{I.shield}</span>
          <p style={{ fontSize:13, color:C.sub, lineHeight:1.55 }}>Your information is encrypted and only shared with the matched care agent after you confirm their application. ReadyPal never shares your data with third parties.</p>
        </div>
      </div>
    </StepShell>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// STEP 8 — CONFIRMATION
// ══════════════════════════════════════════════════════════════════════════════
function Step8({ onDashboard, onViewRequests, attachmentWarning }: { onDashboard: ()=>void; onViewRequests: ()=>void; attachmentWarning?: string }) {
  const refNo = 'CR-2025-' + String(Math.floor(Math.random() * 9000) + 1000)

  const timeline = [
    { title:'Request Published',       sub:'Your request is now live for care agents to view',   done:true },
    { title:'Agents Apply',            sub:'Verified agents in your area will apply (usually 1–4 hours)',  done:false },
    { title:'Review Applications',     sub:'Compare profiles, ratings, and proposed rates',      done:false },
    { title:'Confirm Your Agent',      sub:'Approve your preferred agent and secure the booking', done:false },
    { title:'Care Visit Happens',      sub:'Your agent attends and submits a detailed report',    done:false },
    { title:'Review & Pay',            sub:'Rate the experience and complete payment securely',   done:false },
  ]

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 32px', textAlign:'center', overflowY:'auto' }}>
      {/* Confetti decoration */}
      <div style={{ position:'relative', marginBottom:24 }}>
        <div style={{ width:96, height:96, borderRadius:'50%', background:`linear-gradient(135deg,${C.primary},#00959E)`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto', boxShadow:`0 8px 32px ${C.primary}30` }}>
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none"><path d="M6 22l10 10 22-22" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        {/* Confetti dots */}
        {[
          { x:-50, y:-30, r:8, c:C.accent }, { x:50, y:-20, r:6, c:C.success }, { x:-40, y:40, r:5, c:'#3B82F6' },
          { x:55, y:35, r:7, c:C.warning }, { x:-20, y:-50, r:5, c:C.primary }, { x:30, y:-55, r:6, c:C.accent },
        ].map((d, i) => (
          <div key={i} style={{ position:'absolute', width:d.r*2, height:d.r*2, borderRadius:'50%', background:d.c, top:`calc(50% + ${d.y}px)`, left:`calc(50% + ${d.x}px)`, opacity:0.7 }} />
        ))}
      </div>

      <h2 style={{ fontSize:32, fontWeight:900, color:C.type, letterSpacing:'-0.03em', marginBottom:8, fontFamily:'Manrope,sans-serif' }}>Request Submitted!</h2>
      <p style={{ fontSize:16, color:C.muted, maxWidth:440, lineHeight:1.6, marginBottom:8 }}>Your care request has been published. Verified care agents in the area will apply shortly.</p>

      <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'10px 20px', borderRadius:12, background:`${C.primary}10`, border:`1px solid ${C.primary}20`, marginBottom: attachmentWarning ? 16 : 32 }}>
        <span style={{ color:C.primary, display:'flex' }}>{I.doc}</span>
        <p style={{ fontSize:14, fontWeight:800, color:C.primary, fontFamily:'Manrope,sans-serif' }}>Reference: {refNo}</p>
      </div>

      {attachmentWarning && (
        <div style={{ width:'100%', maxWidth:500, marginBottom:32 }}>
          <InlineAlert type="warning" msg={attachmentWarning} />
        </div>
      )}

      {/* Estimated matching */}
      <div style={{ width:'100%', maxWidth:500, padding:20, borderRadius:16, border:`1px solid ${C.border}`, background:'#FAFAFA', marginBottom:24, display:'flex', gap:14, alignItems:'center', textAlign:'left' }}>
        <div style={{ width:44, height:44, borderRadius:12, background:`${C.accent}12`, display:'flex', alignItems:'center', justifyContent:'center', color:C.accent, flexShrink:0 }}>{I.clock}</div>
        <div>
          <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>Estimated Matching Time</p>
          <p style={{ fontSize:13, color:C.muted, marginTop:2 }}>Typically 1–4 hours. You will receive an SMS and email when agents apply.</p>
        </div>
      </div>

      {/* Next steps timeline */}
      <div style={{ width:'100%', maxWidth:500, textAlign:'left', marginBottom:32 }}>
        <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:14, fontFamily:'Manrope,sans-serif' }}>What happens next</p>
        {timeline.map((t, i) => (
          <div key={i} style={{ display:'flex', gap:12, marginBottom: i < timeline.length-1 ? 14 : 0 }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
              <div style={{ width:28, height:28, borderRadius:'50%', background: t.done ? C.success : i === 0 ? C.primary : '#F2F4F5', display:'flex', alignItems:'center', justifyContent:'center', color: t.done || i===0 ? '#fff' : C.muted, flexShrink:0 }}>
                {t.done ? I.check : <span style={{ fontSize:11, fontWeight:800, fontFamily:'Manrope,sans-serif' }}>{i+1}</span>}
              </div>
              {i < timeline.length-1 && <div style={{ width:2, flex:1, background: t.done ? C.success : C.border, minHeight:14, marginTop:2 }} />}
            </div>
            <div style={{ paddingBottom: i < timeline.length-1 ? 14 : 0 }}>
              <p style={{ fontSize:13, fontWeight: i===0 ? 800 : 600, color: i===0 ? C.primary : C.type, fontFamily:'Manrope,sans-serif' }}>{t.title}</p>
              <p style={{ fontSize:12, color:C.muted, lineHeight:1.5 }}>{t.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
        <Btn label="View My Care Requests" variant="primary" icon={I.chevronR} onClick={onViewRequests} />
        <Btn label="Return to Dashboard" variant="secondary" onClick={onDashboard} />
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// WIZARD DATA
// ══════════════════════════════════════════════════════════════════════════════
type WizardData = {
  beneficiaryId: string; beneficiaryName: string
  services: string[]
  date: string; time: string; duration: string; flexible: boolean; recurring: boolean; frequency: string
  province: string; city: string; address1: string; address2: string; postalCode: string; landmarks: string; accessNotes: string
  lat: number; lng: number
  budget: number; negotiable: boolean; currency: string
  instructions: string; medConditions: string; mobility: string; languages: string[]; agentGender: string
  requiredSkills: string[]; emergencyName: string; emergencyPhone: string
  householdNotes: string; parkingNotes: string; hasPets: boolean; parkingAvail: boolean
}

const defaultData: WizardData = {
  beneficiaryId:'', beneficiaryName:'',
  services:[],
  date:'', time:'09:00', duration:'2 hours', flexible:false, recurring:false, frequency:'Weekly',
  province:'Western', city:'', address1:'', address2:'', postalCode:'', landmarks:'', accessNotes:'',
  lat: 6.9271, lng: 79.8612, // default: Colombo
  budget:4500, negotiable:false, currency:'LKR – Sri Lankan Rupee',
  instructions:'', medConditions:'', mobility:'', languages:[], agentGender:'No Preference',
  requiredSkills:[], emergencyName:'', emergencyPhone:'',
  householdNotes:'', parkingNotes:'', hasPets:false, parkingAvail:true,
}

type SetData = React.Dispatch<React.SetStateAction<WizardData>>

// Attachment File objects live at the root wizard level (not inside Step6's
// own state, and not inside WizardData/care_requests fields) so they survive
// Step 6 → Step 7 → Back → Step 6 navigation, which remounts each step
// component. Real upload only happens at final submit, once a real
// care_request id exists.
type CareRequestAttachments = {
  photo: File | null
  medical: File | null
  voice: File | null
}

const defaultAttachments: CareRequestAttachments = { photo: null, medical: null, voice: null }

type SetAttachments = React.Dispatch<React.SetStateAction<CareRequestAttachments>>

// ══════════════════════════════════════════════════════════════════════════════
// ROOT COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
export default function CareRequestWizard({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<WizardData>(defaultData)
  const [attachments, setAttachments] = useState<CareRequestAttachments>(defaultAttachments)
  const [draftSaved, setDraftSaved] = useState(false)

  const next = () => setStep(s => Math.min(s + 1, 8))
  const back = () => setStep(s => Math.max(s - 1, 1))
  const goTo = (n: number) => setStep(n)
  const handleClose = onClose ?? (() => {})

  const saveDraft = () => { setDraftSaved(true); setTimeout(() => setDraftSaved(false), 2500) }

  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [attachmentWarning, setAttachmentWarning] = useState('')

  const submitRequest = async () => {
    if (submitting) return
    setSubmitError('')
    setAttachmentWarning('')
    setSubmitting(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSubmitError('You must be logged in.'); setSubmitting(false); return }
    try {
      // The request must exist before any attachment upload — Storage paths
      // and care_request_attachments rows both need the real id.
      const created = await createCareRequestFromWizard(data, user.id)

      const slots: { key: keyof CareRequestAttachments; type: CareRequestAttachmentType; label: string }[] = [
        { key:'photo', type:'Photo', label:'Photo of Home / Person' },
        { key:'medical', type:'Medical', label:'Medical Documents' },
        { key:'voice', type:'Voice', label:'Voice Note' },
      ]

      // Uploaded one at a time, each fully awaited — never fired without
      // awaiting. The care request already exists at this point, so a
      // failed attachment doesn't block success, but it's never silently
      // reported as if it succeeded either.
      const failed: string[] = []
      for (const slot of slots) {
        const file = attachments[slot.key]
        if (!file) continue
        try {
          await uploadCareRequestAttachment(created.id, slot.type, file)
        } catch (err: any) {
          console.error(`Failed to upload ${slot.type} attachment:`, err)
          failed.push(slot.label)
        }
      }

      if (failed.length > 0) {
        setAttachmentWarning(`Your care request was submitted, but ${failed.length === 1 ? 'this attachment' : 'these attachments'} didn't upload: ${failed.join(', ')}. You can try adding them again later.`)
      }

      next()
    } catch (err: any) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const [clientId, setClientId] = useState('')
  useEffect(() => {
  supabase.auth.getUser().then(({ data }) => setClientId(data.user?.id || ''))
  }, [])

  const stepProps = { data, setData, attachments, setAttachments, onNext: next, onBack: back, onClose: handleClose, onSaveDraft: saveDraft, clientId }

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', fontFamily:'Manrope,sans-serif', background:C.bg }}>
      {/* Sidebar — hidden on mobile */}
      <div className="wizard-sidebar-hide">
        <WizardSidebar step={step} />
      </div>

      {/* Main content */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, background:C.surface, overflow:'hidden' }}>
        {step < 8
          ? (
            <>
              {step === 1 && <Step1 {...stepProps} />}
              {step === 2 && <Step2 {...stepProps} />}
              {step === 3 && <Step3 {...stepProps} />}
              {step === 4 && <Step4 {...stepProps} />}
              {step === 5 && <Step5 {...stepProps} />}
              {step === 6 && <Step6 {...stepProps} />}
              {step === 7 && <Step7 {...stepProps} onNext={submitRequest} goTo={goTo} submitting={submitting} />}
            </>
          )
          : <Step8 onDashboard={() => navigate('/dashboard')} onViewRequests={() => navigate('/dashboard?tab=requests')} attachmentWarning={attachmentWarning} />
        }
      </div>

      {/* Draft saved toast */}
      {draftSaved && (
        <div style={{ position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)', background:C.success, color:'#fff', padding:'10px 20px', borderRadius:12, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', boxShadow:'0 4px 16px rgba(0,0,0,0.15)', display:'flex', alignItems:'center', gap:8, zIndex:1000 }}>
          {I.check} Draft saved successfully
        </div>
      )}

      {/* Error toast */}
      {submitError && (
        <div style={{ position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)', background:C.error, color:'#fff', padding:'10px 20px', borderRadius:12, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', boxShadow:'0 4px 16px rgba(0,0,0,0.15)', display:'flex', alignItems:'center', gap:8, zIndex:1000 }}>
          {I.alert} {submitError}
        </div>
      )}
    </div>
  )
}
