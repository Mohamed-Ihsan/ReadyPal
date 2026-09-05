import {
  getCurrentProfile, updateProfile, uploadProfilePhoto, getCurrentUser,
  logUserActivity, getUserActivityLog, deleteUserActivityLog,
  getMfaFactors, getLinkedIdentities, linkOAuthIdentity, unlinkOAuthIdentity,
  exportMyAccountData, requestAccountDeletion, createSupportTicket,
} from '../lib/api'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef, type ReactNode, type CSSProperties, type ChangeEvent } from 'react'

// ─── Brand ────────────────────────────────────────────────────────────────────
const C = {
  primary:'#00737A', accent:'#EE8153', type:'#2C3E43', sub:'#6B7E85',
  muted:'#9AAAB0', border:'#E4E8EA', bg:'#F2F4F5', surface:'#FFFFFF',
  success:'#22C55E', warning:'#F59E0B', error:'#EF4444', info:'#3B82F6',
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const I: Record<string, ReactNode> = {
  user:     <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="5" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M2 13c0-3.04 2.46-5.5 5.5-5.5S13 9.96 13 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  shield:   <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 1.5l5 1.8v4C12.5 11 10 13.5 7.5 14.5 5 13.5 2.5 11 2.5 7.3v-4L7.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  bell:     <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 2v.8A4.5 4.5 0 0 1 12 7.3v3.5l1 1.7H2l1-1.7V7.3A4.5 4.5 0 0 1 7.5 2.8V2M6 12.5a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  lock:     <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="2.5" y="6.5" width="10" height="7" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 6.5V5a3 3 0 0 1 6 0v1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="7.5" cy="10" r="1" fill="currentColor"/></svg>,
  eye:      <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M1.5 7.5C3.5 4.5 5.5 3 7.5 3s4 1.5 6 4.5C11.5 11 9.5 12.5 7.5 12.5s-4-1.5-6-5z" stroke="currentColor" strokeWidth="1.2"/><circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.1"/></svg>,
  eyeOff:   <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 2l11 11M6 4.5A4 4 0 0 1 7.5 4c2 0 4 1.5 6 4.5-.8 1.2-1.7 2.2-2.7 3M4 5.5C2.8 6.4 1.9 7.2 1.5 7.5 3.5 11 5.5 12.5 7.5 12.5c1 0 2-.3 2.9-.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  chevR:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l5 4-5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevL:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3l-5 4 5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  check:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5l3 3 6-6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  edit:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M9.5 1.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  camera:   <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="3.5" width="11" height="8.5" rx="2" stroke="currentColor" strokeWidth="1.2"/><circle cx="7" cy="7.75" r="2.2" stroke="currentColor" strokeWidth="1.1"/><path d="M5 3.5l.7-1.5h2.6l.7 1.5" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/></svg>,
  device:   <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="2" y="1.5" width="11" height="8.5" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M5.5 13h4M7.5 10v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  phone:    <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="4" y="1" width="7" height="13" rx="2" stroke="currentColor" strokeWidth="1.2"/><circle cx="7.5" cy="11.5" r=".8" fill="currentColor"/></svg>,
  link:     <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M6 8a3 3 0 0 0 4.24 0l1.76-1.76a3 3 0 0 0-4.24-4.24L6.5 3.25" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M8 6a3 3 0 0 0-4.24 0L2 7.76a3 3 0 0 0 4.24 4.24L7.5 10.75" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  globe:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/><path d="M7 1.5c-1.5 2-1.5 9 0 11M7 1.5c1.5 2 1.5 9 0 11M1.5 7h11" stroke="currentColor" strokeWidth="1.1"/></svg>,
  palette:  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="4.5" cy="5" r="1" fill={C.accent}/><circle cx="9.5" cy="5" r="1" fill={C.primary}/><circle cx="7" cy="9.5" r="1" fill={C.info}/></svg>,
  download: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2v6M4 6l2.5 2.5L9 6M2 11h9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  activity: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1.5 7h2.5l2-4 2.5 8 2-4H13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  support:  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.1"/><path d="M3.1 3.1l1.5 1.5M9.4 9.4l1.5 1.5M10.9 3.1L9.4 4.6M4.6 9.4L3.1 10.9" stroke="currentColor" strokeWidth="1.1"/></svg>,
  trash:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 3.5h9M5 3.5V2.5h3V3.5M3.5 3.5l.7 7.5h4.6l.7-7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  mail:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1.5" y="3" width="10" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 5l5 3.5L11.5 5" stroke="currentColor" strokeWidth="1.2"/></svg>,
  refresh:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M11.5 6.5a5 5 0 1 1-1.1-3.1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M11.5 3v2.5H9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  google:   <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14.5 8.2c0-.5 0-1-.1-1.5H8v2.8h3.6c-.2.9-.7 1.6-1.4 2.1v1.7h2.3c1.3-1.2 2-3 2-5.1z" fill="#4285F4"/><path d="M8 15c1.8 0 3.3-.6 4.4-1.6l-2.3-1.7c-.6.4-1.3.7-2.1.7-1.6 0-3-1.1-3.5-2.6H2.2v1.8C3.3 13.7 5.5 15 8 15z" fill="#34A853"/><path d="M4.5 9.8c-.1-.4-.2-.8-.2-1.2s.1-.8.2-1.2V5.6H2.2C1.8 6.5 1.5 7.2 1.5 8s.3 1.5.7 2.4l2.3-1.6z" fill="#FBBC05"/><path d="M8 4.2c.9 0 1.7.3 2.3.9l1.7-1.7C10.9 2.3 9.6 1.7 8 1.7 5.5 1.7 3.3 3 2.2 5l2.3 1.8C5 5.3 6.4 4.2 8 4.2z" fill="#EA4335"/></svg>,
  apple:    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12.5 8.5c0-2 1.3-2.7 1.3-2.7S12.4 4 10.6 4c-1.1 0-1.7.6-2.6.6C6.9 4.6 6.2 4 5.2 4 3.3 4 1.5 5.7 1.5 8.5c0 2.8 2 6.5 3.5 6.5.8 0 1.2-.6 2.2-.6s1.4.6 2.2.6c1.5 0 3.1-3.2 3.1-6.5z" fill="currentColor"/><path d="M10 1.5c.5-1 1.5-1.5 1.5-1.5s.3 1.2-.5 2.2c-.8.9-1.7.9-1.7.9s-.2-1 .7-1.6z" fill="currentColor"/></svg>,
  warning:  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5L1.5 12h11L7 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M7 6v2.5M7 10.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  key:      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="5.5" cy="5.5" r="3.5" stroke="currentColor" strokeWidth="1.2"/><path d="M8.5 8.5l4 4M10.5 8.5l1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  close:    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  info:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M6.5 6v4M6.5 4v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  sun:      <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="3" stroke="currentColor" strokeWidth="1.2"/><path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M3.2 3.2l1 1M10.8 10.8l1 1M10.8 3.2l-1 1M3.2 10.8l-1 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  moon:     <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M12.5 9.5A6 6 0 0 1 5.5 2.5a6 6 0 1 0 7 7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  monitor:  <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1.5" y="2" width="12" height="8.5" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 13.5h5M7.5 10.5v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  logout:   <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M6 13H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 10.5L13.5 7 10 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.5 7H5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
}

// ─── Primitives ───────────────────────────────────────────────────────────────
function Card({ children, style={}, hover=false, onClick }: { children:ReactNode; style?:CSSProperties; hover?:boolean; onClick?:()=>void }) {
  const [h, setH] = useState(false)
  return (
    <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ background:C.surface, borderRadius:16, border:`1px solid ${h&&hover?C.primary+'40':C.border}`, boxShadow:h&&hover?'0 8px 28px rgba(44,62,67,0.10)':'0 1px 4px rgba(44,62,67,0.06)', transition:'all 0.18s', transform:h&&hover?'translateY(-1px)':undefined, cursor:onClick?'pointer':undefined, ...style }}>
      {children}
    </div>
  )
}

function Btn({ label, icon, onClick, variant='primary', small=false, disabled=false }: { label:string; icon?:ReactNode; onClick?:()=>void; variant?:'primary'|'secondary'|'ghost'|'danger'; small?:boolean; disabled?:boolean }) {
  const [h, setH] = useState(false)
  const vs: Record<string,CSSProperties> = {
    primary:   { background:disabled?'#C8D0D4':h?'#005D63':C.primary, color:'#fff', border:'none', boxShadow:disabled?'none':h?`0 4px 16px ${C.primary}50`:`0 2px 8px ${C.primary}30` },
    secondary: { background:h?'#EEF5F5':'#fff', color:C.primary, border:`1.5px solid ${h?C.primary:C.border}` },
    ghost:     { background:h?C.bg:'transparent', color:C.sub, border:'none' },
    danger:    { background:h?'#DC2626':C.error, color:'#fff', border:'none' },
  }
  return (
    <button onClick={disabled?undefined:onClick} disabled={disabled} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:small?'6px 14px':'10px 20px', borderRadius:10, cursor:disabled?'not-allowed':'pointer', fontFamily:'Manrope,sans-serif', fontSize:small?12:13, fontWeight:700, transition:'all 0.15s', ...vs[variant] }}>
      {icon&&<span style={{display:'flex'}}>{icon}</span>}{label}
    </button>
  )
}

function Toggle({ on, onToggle }: { on:boolean; onToggle:()=>void }) {
  return (
    <button onClick={onToggle} style={{ width:46, height:26, borderRadius:99, border:'none', cursor:'pointer', background:on?C.primary:C.border, position:'relative', transition:'background 0.2s', flexShrink:0 }}>
      <div style={{ width:20, height:20, borderRadius:'50%', background:'#fff', position:'absolute', top:3, left:on?23:3, transition:'left 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.18)' }} />
    </button>
  )
}

function Field({ label, value, type='text', onSave, hint, verified=false }: { label:string; value:string; type?:string; onSave?:(v:string)=>void|Promise<void>; hint?:string; verified?:boolean }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(value)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setEditing(false)
    setSaving(true)
    try {
      await onSave?.(val)
      setSaved(true)
      setTimeout(()=>setSaved(false), 2000)
    } catch {
      // The caller already surfaces a toast for the failure — nothing more to do here.
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ padding:'14px 0', borderBottom:`1px solid ${C.border}` }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:editing?10:4 }}>
        <p style={{ fontSize:12, fontWeight:700, color:C.muted }}>{label}</p>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          {verified && <span style={{ display:'inline-flex', alignItems:'center', gap:3, fontSize:11, fontWeight:700, color:C.success, padding:'2px 8px', borderRadius:99, background:`${C.success}10` }}><span style={{display:'flex',transform:'scale(0.85)'}}>{I.check}</span>Verified</span>}
          {saving && <span style={{ fontSize:11, fontWeight:700, color:C.muted }}>Saving…</span>}
          {saved && !saving && <span style={{ fontSize:11, fontWeight:700, color:C.success }}>Saved ✓</span>}
          {onSave && <button onClick={()=>editing?handleSave():setEditing(true)} style={{ fontSize:12, fontWeight:700, color:editing?C.primary:C.muted, background:'none', border:'none', cursor:'pointer', fontFamily:'Manrope,sans-serif', display:'flex', alignItems:'center', gap:4 }}>{editing?'Save':<><span style={{display:'flex'}}>{I.edit}</span>Edit</>}</button>}
        </div>
      </div>
      {editing
        ? <input type={type} value={val} onChange={e=>setVal(e.target.value)} autoFocus onKeyDown={e=>e.key==='Enter'&&handleSave()} style={{ width:'100%', padding:'9px 12px', borderRadius:10, border:`1.5px solid ${C.primary}`, fontFamily:'Manrope,sans-serif', fontSize:14, color:C.type, outline:'none', background:'#FAFAFA', boxSizing:'border-box' as const }} />
        : <p style={{ fontSize:14, fontWeight:500, color:C.type }}>{val||<span style={{color:C.muted,fontStyle:'italic'}}>Not set</span>}</p>
      }
      {hint && <p style={{ fontSize:11, color:C.muted, marginTop:4 }}>{hint}</p>}
    </div>
  )
}

function SectionHeader({ title, desc }: { title:string; desc?:string }) {
  return (
    <div style={{ marginBottom:20 }}>
      <h2 style={{ fontSize:18, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:desc?4:0 }}>{title}</h2>
      {desc && <p style={{ fontSize:13, color:C.muted }}>{desc}</p>}
    </div>
  )
}

function Bdg({ label, color=C.primary }: { label:string; color?:string }) {
  return <span style={{ display:'inline-flex', alignItems:'center', padding:'3px 10px', borderRadius:999, fontSize:11, fontWeight:700, background:`${color}12`, color }}>{label}</span>
}

function SuccessToast({ msg, kind='success' }:{ msg:string; kind?:'success'|'error' }) {
  return (
    <div style={{ position:'fixed', bottom:28, left:'50%', transform:'translateX(-50%)', zIndex:999, display:'flex', alignItems:'center', gap:10, padding:'12px 22px', borderRadius:14, background:C.type, color:'#fff', fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:700, boxShadow:'0 8px 28px rgba(0,0,0,0.22)', pointerEvents:'none' }}>
      <span style={{ display:'flex', color:kind==='error'?C.error:C.success }}>{kind==='error'?I.warning:I.check}</span>{msg}
    </div>
  )
}

// ─── Sidebar nav items ────────────────────────────────────────────────────────
type Section = 'home'|'profile'|'personal'|'contact'|'security'|'loginHistory'|'devices'|'linkedAccounts'|'notifications'|'privacy'|'accessibility'|'language'|'appearance'|'downloads'|'activity'|'support'|'deleteAccount'

const NAV_ITEMS: { key:Section; label:string; icon:ReactNode; group?:string }[] = [
  { key:'home',          label:'Account Home',    icon:I.user,     group:'Overview' },
  { key:'profile',       label:'Profile',         icon:I.camera,   group:'Overview' },
  { key:'personal',      label:'Personal Info',   icon:I.user,     group:'Overview' },
  { key:'contact',       label:'Contact Info',    icon:I.mail,     group:'Overview' },
  { key:'security',      label:'Security',        icon:I.shield,   group:'Security' },
  { key:'loginHistory',  label:'Login History',   icon:I.activity, group:'Security' },
  { key:'devices',       label:'Devices',         icon:I.device,   group:'Security' },
  { key:'linkedAccounts',label:'Linked Accounts', icon:I.link,     group:'Security' },
  { key:'notifications', label:'Notifications',   icon:I.bell,     group:'Preferences' },
  { key:'privacy',       label:'Privacy',         icon:I.eye,      group:'Preferences' },
  { key:'accessibility', label:'Accessibility',   icon:I.support,  group:'Preferences' },
  { key:'language',      label:'Language & Region',icon:I.globe,   group:'Preferences' },
  { key:'appearance',    label:'Appearance',      icon:I.palette,  group:'Preferences' },
  { key:'downloads',     label:'Download Center', icon:I.download, group:'Data' },
  { key:'activity',      label:'Activity Log',    icon:I.activity, group:'Data' },
  { key:'support',       label:'Support',         icon:I.support,  group:'Help' },
  { key:'deleteAccount', label:'Delete Account',  icon:I.trash,    group:'Help' },
]

// ─── Shared page wrapper ──────────────────────────────────────────────────────
function Page({ children, style={} }: { children:ReactNode; style?:CSSProperties }) {
  return <div className="as-page" style={{ padding:'28px 32px 60px', display:'flex', flexDirection:'column', gap:24, maxWidth:760, ...style }}>{children}</div>
}

// ──────────────────────────────────────────────────────────────────────────────
// ACCOUNT HOME
// ──────────────────────────────────────────────────────────────────────────────
function AccountHome({ profile, onNav }: { profile:any; onNav:(s:Section)=>void }) {
  const initials = (profile.full_name || '?').split(' ').map((n:string)=>n[0]).join('').slice(0,2).toUpperCase()
  const memberSince = profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-US',{month:'short',year:'numeric'}) : '—'

  const [devices, setDevices] = useState<GroupedDevice[]|null>(null)
  useEffect(() => {
    getUserActivityLog(100)
      .then(rows => setDevices(groupDevicesFromLogs(rows)))
      .catch(err => { console.error('Failed to load devices:', err); setDevices([]) })
  }, [])

  const notifPrefs = profile.notification_preferences && typeof profile.notification_preferences === 'object'
    ? { ...DEFAULT_NOTIFICATION_PREFS, ...profile.notification_preferences }
    : DEFAULT_NOTIFICATION_PREFS
  const notifSummary = [
    { label:'Care Updates',   key:'Care Updates' },
    { label:'Payment Alerts', key:'Payment Alerts' },
    { label:'Messages',       key:'Messages' },
    { label:'Marketing',      key:'Marketing & Offers' },
  ].map(({ label, key }) => {
    const p = notifPrefs[key]
    return { label, on: !!(p?.push || p?.email || p?.sms) }
  })

  const completionItems = [
    { label:'Profile photo', done:true },
    { label:'Verified email', done:true },
    { label:'Phone number', done:true },
    { label:'2FA enabled', done:false },
    { label:'Emergency contact', done:false },
  ]
  const pct = Math.round((completionItems.filter(i=>i.done).length/completionItems.length)*100)

  const quickActions = [
    { icon:I.edit,    label:'Edit Profile',    s:'profile'       as Section },
    { icon:I.shield,  label:'Security',        s:'security'      as Section },
    { icon:I.bell,    label:'Notifications',   s:'notifications' as Section },
    { icon:I.eye,     label:'Privacy',         s:'privacy'       as Section },
    { icon:I.download,label:'Downloads',       s:'downloads'     as Section },
    { icon:I.activity,label:'Activity Log',    s:'activity'      as Section },
  ]

  const recentActivity = [
    { icon:'🔑', label:'Password changed',       time:'2 hours ago',  color:C.warning },
    { icon:'✅', label:'Review submitted',        time:'14 Jan · 9:30',color:C.success },
    { icon:'💳', label:'Payment of LKR 6,037',   time:'14 Jan · 9:29',color:C.primary },
    { icon:'📱', label:'New device signed in',    time:'13 Jan · 8:14',color:C.info },
    { icon:'🔒', label:'2FA reminder sent',       time:'10 Jan · 9:00',color:C.muted },
  ]

  return (
    <Page>
      {/* Profile hero */}
      <Card style={{ padding:0, overflow:'hidden' }}>
        <div style={{ height:90, background:`linear-gradient(135deg,${C.primary},#00959E,#007A82)`, position:'relative' }}>
          <div style={{ position:'absolute', top:-20, right:-20, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }} />
        </div>
        <div style={{ padding:'0 28px 24px', position:'relative' }}>
          <div style={{ width:80, height:80, borderRadius:'50%', background:profile.avatar_url?undefined:`${C.primary}18`, border:`4px solid ${C.surface}`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:28, color:C.primary, fontFamily:'Manrope,sans-serif', marginTop:-40, marginBottom:12, overflow:'hidden' }}>
            {profile.avatar_url ? <img src={profile.avatar_url} alt={profile.full_name || 'Profile photo'} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : initials}
          </div>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
            <div>
              <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>{profile.full_name || 'Your Account'}</h2>
                <Bdg label="Member" color={C.primary} />
              </div>
              <p style={{ fontSize:13, color:C.muted }}>{profile.email || '—'}{profile.city ? ` · ${profile.city}` : ''} · Member since {memberSince}</p>
            </div>
            <Btn label="Edit Profile" variant="secondary" icon={I.edit} small onClick={()=>onNav('profile')} />
          </div>
        </div>
      </Card>

      {/* Completion + Quick Actions */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }} className="as-2col">
        {/* Account completion */}
        <Card style={{ padding:22 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <h3 style={{ fontSize:13, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>Account Completion</h3>
            <span style={{ fontSize:18, fontWeight:900, color:pct>=80?C.success:C.warning, fontFamily:'Manrope,sans-serif' }}>{pct}%</span>
          </div>
          <div style={{ height:6, borderRadius:99, background:C.bg, overflow:'hidden', marginBottom:16 }}>
            <div style={{ width:`${pct}%`, height:'100%', background:`linear-gradient(90deg,${C.primary},${C.success})`, borderRadius:99, transition:'width 0.5s' }} />
          </div>
          {completionItems.map(item=>(
            <div key={item.label} style={{ display:'flex', alignItems:'center', gap:9, padding:'6px 0' }}>
              <div style={{ width:18, height:18, borderRadius:'50%', background:item.done?C.success:C.bg, border:`2px solid ${item.done?C.success:C.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                {item.done && <span style={{ color:'#fff', display:'flex', transform:'scale(0.7)' }}>{I.check}</span>}
              </div>
              <p style={{ fontSize:12, color:item.done?C.type:C.muted, fontWeight:item.done?600:400 }}>{item.label}</p>
            </div>
          ))}
        </Card>

        {/* Security status */}
        <Card style={{ padding:22 }}>
          <h3 style={{ fontSize:13, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:14 }}>Security Status</h3>
          {[
            { label:'Password strength', value:'Strong', color:C.success },
            { label:'Two-factor auth',   value:'Not set', color:C.error },
            { label:'Login alerts',      value:'On',     color:C.success },
            { label:'Trusted devices',   value:'2',      color:C.primary },
            { label:'Recovery codes',    value:'Ready',  color:C.success },
          ].map(r=>(
            <div key={r.label} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:`1px solid ${C.border}` }}>
              <p style={{ fontSize:12, color:C.muted }}>{r.label}</p>
              <p style={{ fontSize:12, fontWeight:700, color:r.color }}>{r.value}</p>
            </div>
          ))}
          <button onClick={()=>onNav('security')} style={{ marginTop:12, fontSize:12, fontWeight:700, color:C.primary, background:'none', border:'none', cursor:'pointer', fontFamily:'Manrope,sans-serif', display:'flex', alignItems:'center', gap:4 }}>Manage Security {I.chevR}</button>
        </Card>
      </div>

      {/* Quick actions */}
      <Card style={{ padding:22 }}>
        <h3 style={{ fontSize:13, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:14 }}>Quick Actions</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }} className="as-3col">
          {quickActions.map(a=>(
            <button key={a.label} onClick={()=>onNav(a.s)} style={{ padding:'14px 12px', borderRadius:13, border:`1.5px solid ${C.border}`, background:'#FAFAFA', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:8, fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:700, color:C.type, transition:'all 0.15s' }}
              onMouseOver={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor=C.primary;(e.currentTarget as HTMLButtonElement).style.background=`${C.primary}06`}}
              onMouseOut={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor=C.border;(e.currentTarget as HTMLButtonElement).style.background='#FAFAFA'}}>
              <div style={{ width:36, height:36, borderRadius:11, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary }}>
                <span style={{ display:'flex', transform:'scale(1.1)' }}>{a.icon}</span>
              </div>
              {a.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Recent activity */}
      <Card style={{ padding:22 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
          <h3 style={{ fontSize:13, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>Recent Activity</h3>
          <button onClick={()=>onNav('activity')} style={{ fontSize:12, fontWeight:700, color:C.primary, background:'none', border:'none', cursor:'pointer', fontFamily:'Manrope,sans-serif', display:'flex', alignItems:'center', gap:3 }}>View All {I.chevR}</button>
        </div>
        {recentActivity.map((a,i)=>(
          <div key={i} style={{ display:'flex', gap:12, alignItems:'center', padding:'9px 0', borderBottom:i<recentActivity.length-1?`1px solid ${C.border}`:'none' }}>
            <div style={{ width:36, height:36, borderRadius:11, background:`${a.color}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{a.icon}</div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:13, fontWeight:600, color:C.type }}>{a.label}</p>
            </div>
            <p style={{ fontSize:11, color:C.muted, whiteSpace:'nowrap' as const }}>{a.time}</p>
          </div>
        ))}
      </Card>

      {/* Connected devices mini */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }} className="as-2col">
        <Card style={{ padding:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
            <h3 style={{ fontSize:13, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>Devices</h3>
            {devices && <Bdg label={`${devices.length} active`} color={C.primary} />}
          </div>
          {devices === null ? (
            <p style={{ fontSize:12, color:C.muted, padding:'7px 0' }}>Loading devices…</p>
          ) : devices.length === 0 ? (
            <p style={{ fontSize:12, color:C.muted, padding:'7px 0' }}>No devices recorded yet.</p>
          ) : devices.map(d=>(
            <div key={d.key} style={{ display:'flex', gap:9, alignItems:'center', padding:'7px 0' }}>
              <span style={{ color:C.primary, display:'flex' }}>{d.isMobile?I.phone:I.device}</span>
              <p style={{ fontSize:12, color:C.type, flex:1 }}>{d.browser} on {d.os}</p>
              {d.isCurrent && <Bdg label="Current" color={C.success} />}
            </div>
          ))}
          <button onClick={()=>onNav('devices')} style={{ marginTop:8, fontSize:12, fontWeight:700, color:C.primary, background:'none', border:'none', cursor:'pointer', fontFamily:'Manrope,sans-serif' }}>Manage devices →</button>
        </Card>

        <Card style={{ padding:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
            <h3 style={{ fontSize:13, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>Notification Summary</h3>
          </div>
          {notifSummary.map(n=>(
            <div key={n.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'5px 0' }}>
              <p style={{ fontSize:12, color:C.type }}>{n.label}</p>
              <span style={{ fontSize:11, fontWeight:700, color:n.on?C.success:C.muted }}>{n.on?'On':'Off'}</span>
            </div>
          ))}
          <button onClick={()=>onNav('notifications')} style={{ marginTop:8, fontSize:12, fontWeight:700, color:C.primary, background:'none', border:'none', cursor:'pointer', fontFamily:'Manrope,sans-serif' }}>Manage notifications →</button>
        </Card>
      </div>
    </Page>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// PROFILE
// ──────────────────────────────────────────────────────────────────────────────
function Profile({ profile, onSave, onUploadAvatar, uploadingAvatar }: {
  profile:any; onSave:(f:Record<string,any>)=>void
  onUploadAvatar:(file:File)=>void; uploadingAvatar:boolean
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const initials = (profile.full_name || '?').split(' ').map((n:string)=>n[0]).join('').slice(0,2).toUpperCase()

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onUploadAvatar(file)
    e.target.value = ''
  }

  return (
    <Page>
      <SectionHeader title="Profile" desc="Your public-facing identity on ReadyPal." />
      <Card style={{ padding:0, overflow:'hidden' }}>
        <div style={{ height:120, background:`linear-gradient(135deg,${C.primary},#00959E)`, position:'relative' }} />
        <div style={{ padding:'0 28px 28px', position:'relative' }}>
          <div style={{ position:'relative', width:88, marginTop:-44, marginBottom:16, display:'inline-block' }}>
            <div style={{ width:88, height:88, borderRadius:'50%', background:profile.avatar_url?undefined:`${C.primary}18`, border:`4px solid #fff`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:30, color:C.primary, fontFamily:'Manrope,sans-serif', boxShadow:'0 4px 16px rgba(44,62,67,0.14)', overflow:'hidden', opacity:uploadingAvatar?0.5:1 }}>
              {profile.avatar_url
                ? <img src={profile.avatar_url} alt={profile.full_name || 'Profile photo'} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                : initials}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display:'none' }} />
            <button onClick={()=>fileInputRef.current?.click()} disabled={uploadingAvatar} style={{ position:'absolute', bottom:2, right:2, width:26, height:26, borderRadius:'50%', background:C.primary, border:`2px solid #fff`, display:'flex', alignItems:'center', justifyContent:'center', cursor:uploadingAvatar?'default':'pointer', color:'#fff', opacity:uploadingAvatar?0.7:1 }}>
              <span style={{ display:'flex', transform:'scale(0.75)' }}>{I.camera}</span>
            </button>
          </div>
          {uploadingAvatar && <p style={{ fontSize:12, color:C.muted, marginBottom:8 }}>Uploading photo…</p>}
          <Field label="Full Name"       value={profile.full_name || ''}     onSave={v=>onSave({full_name:v})} />
          <Field label="Preferred Name"  value={profile.preferred_name || ''} onSave={v=>onSave({preferred_name:v})} />
          <Field label="Email Address"   value={profile.email || ''}          verified onSave={v=>onSave({email:v})} hint="Changing this updates your login email — you'll get a confirmation link at the new address." />
          <Field label="Phone Number"    value={profile.phone || ''}          verified onSave={v=>onSave({phone:v})} />
          <Field label="Country"         value={profile.nationality || ''}    onSave={v=>onSave({nationality:v})} />
          <div style={{ padding:'14px 0' }}>
            <p style={{ fontSize:12, fontWeight:700, color:C.muted, marginBottom:4 }}>Member Since</p>
            <p style={{ fontSize:14, color:C.type }}>{profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-US',{month:'long',year:'numeric'}) : '—'}</p>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center', marginTop:4 }}>
            <Bdg label="Active Member" color={C.primary} />
          </div>
        </div>
      </Card>
    </Page>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// PERSONAL INFORMATION
// ──────────────────────────────────────────────────────────────────────────────
function PersonalInfo({ profile, onSave }: { profile:any; onSave:(f:Record<string,any>)=>void }) {
  return (
    <Page>
      <SectionHeader title="Personal Information" desc="Used to personalise your care experience." />
      <Card style={{ padding:'8px 24px 24px' }}>
        <Field label="Full Name"                    value={profile.full_name || ''}   onSave={v=>onSave({full_name:v})} />
        <Field label="Date of Birth"                 value={profile.date_of_birth || ''}          onSave={v=>onSave({date_of_birth:v})} />
        <Field label="Gender"                        value={profile.gender || ''}       onSave={v=>onSave({gender:v})} />
        <Field label="Nationality"                   value={profile.nationality || ''} onSave={v=>onSave({nationality:v})} />
        <Field label="NIC"                            value={profile.nic || ''}          onSave={v=>onSave({nic:v})} />
        <Field label="Emergency Contact"              value={profile.emergency_contact ? `${profile.emergency_contact.name} · ${profile.emergency_contact.phone}` : ''} onSave={v=>onSave({emergency_contact:{name:v.split('·')[0]?.trim(), phone:v.split('·')[1]?.trim()}})} />
      </Card>
    </Page>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// CONTACT INFORMATION
// ──────────────────────────────────────────────────────────────────────────────
function ContactInfo({ profile, onSave }: { profile:any; onSave:(f:Record<string,any>)=>void }) {
  return (
    <Page>
      <SectionHeader title="Contact Information" desc="How we and your care agents can reach you." />
      <Card style={{ padding:'8px 24px 24px' }}>
        <Field label="Primary Email"   value={profile.email || ''}        verified onSave={v=>onSave({email:v})} hint="Used for login and important account notices." />
        <Field label="Primary Phone"   value={profile.phone || ''}        verified onSave={v=>onSave({phone:v})} hint="Used for SMS alerts and 2FA." />
        <Field label="Full Address"    value={profile.address || ''} onSave={v=>onSave({address:v})} />
        <Field label="City"            value={profile.city || ''}         onSave={v=>onSave({city:v})} />
        <Field label="Postal Code"     value={profile.postal_code || ''}  onSave={v=>onSave({postal_code:v})} />
      </Card>
    </Page>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// SECURITY
// ──────────────────────────────────────────────────────────────────────────────
function passwordStrength(pw: string): { pct:number; label:string; color:string } {
  if (!pw) return { pct:0, label:'', color:C.border }
  let score = 0
  if (pw.length >= 8) score += 40
  if (pw.length >= 12) score += 15
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 20
  if (/[0-9]/.test(pw)) score += 15
  if (/[^A-Za-z0-9]/.test(pw)) score += 10
  const pct = Math.min(score, 100)
  const color = pct>=80?C.success:pct>=50?C.warning:C.error
  const label = pct>=80?'Strong':pct>=50?'Fair':'Weak'
  return { pct, label, color }
}

function Security({ profile, onSave, onToast }: {
  profile:any; onSave:(f:Record<string,any>)=>void
  onToast:(m:string, kind?:'success'|'error')=>void
}) {
  const [show, setShow] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  const [emailConfirmedAt, setEmailConfirmedAt] = useState<string|null|undefined>(undefined)
  const [factorsLoading, setFactorsLoading] = useState(true)
  const [totpFactor, setTotpFactor] = useState<{ id:string }|null>(null)
  const [enrollData, setEnrollData] = useState<{ factorId:string; qrCode:string; secret:string }|null>(null)
  const [verifyCode, setVerifyCode] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [mfaBusy, setMfaBusy] = useState(false)
  const [signingOutOthers, setSigningOutOthers] = useState(false)
  const loginAlerts = profile.notification_preferences?.loginAlerts ?? true

  const loadSecurityStatus = () => {
    setFactorsLoading(true)
    Promise.all([getMfaFactors(), getCurrentUser()])
      .then(([factors, user]) => {
        setTotpFactor(factors.totp.find(f => f.status === 'verified') ?? null)
        setEmailConfirmedAt(user?.email_confirmed_at ?? null)
      })
      .catch(err => console.error('Failed to load security status:', err))
      .finally(() => setFactorsLoading(false))
  }
  useEffect(() => { loadSecurityStatus() }, [])

  const strength = passwordStrength(newPassword)

  const handleChangePassword = async () => {
    if (changingPassword) return
    if (newPassword.length < 6) {
      onToast('Password must be at least 6 characters', 'error')
      return
    }
    if (newPassword !== confirmPassword) {
      onToast("Passwords don't match", 'error')
      return
    }
    setChangingPassword(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      setNewPassword('')
      setConfirmPassword('')
      logUserActivity('password_changed', 'Password updated from Account Settings')
      onToast('Password updated successfully')
    } catch (err) {
      onToast(err instanceof Error ? err.message : "Couldn't update your password. Please try again.", 'error')
    } finally {
      setChangingPassword(false)
    }
  }

  const startEnroll = async () => {
    setMfaBusy(true)
    try {
      const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' })
      if (error) throw error
      setEnrollData({ factorId: data.id, qrCode: data.totp.qr_code, secret: data.totp.secret })
    } catch (err) {
      onToast(err instanceof Error ? err.message : "Couldn't start authenticator setup.", 'error')
      setMfaBusy(false)
    }
  }

  const cancelEnroll = async () => {
    if (enrollData) {
      try { await supabase.auth.mfa.unenroll({ factorId: enrollData.factorId }) } catch { /* best-effort cleanup */ }
    }
    setEnrollData(null)
    setVerifyCode('')
    setMfaBusy(false)
  }

  const confirmEnroll = async () => {
    if (!enrollData || verifying) return
    setVerifying(true)
    try {
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: enrollData.factorId })
      if (challengeError) throw challengeError
      const { error: verifyError } = await supabase.auth.mfa.verify({ factorId: enrollData.factorId, challengeId: challenge.id, code: verifyCode })
      if (verifyError) throw verifyError
      setEnrollData(null)
      setVerifyCode('')
      setMfaBusy(false)
      logUserActivity('mfa_enabled', 'Authenticator app enabled')
      onToast('Authenticator app enabled')
      loadSecurityStatus()
    } catch (err) {
      onToast(err instanceof Error ? err.message : 'Invalid code. Please try again.', 'error')
    } finally {
      setVerifying(false)
    }
  }

  const disableTotp = async () => {
    if (!totpFactor || mfaBusy) return
    setMfaBusy(true)
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId: totpFactor.id })
      if (error) throw error
      logUserActivity('mfa_disabled', 'Authenticator app disabled')
      onToast('Authenticator app disabled')
      loadSecurityStatus()
    } catch (err) {
      onToast(err instanceof Error ? err.message : "Couldn't disable the authenticator app.", 'error')
    } finally {
      setMfaBusy(false)
    }
  }

  const handleSignOutOthers = async () => {
    if (signingOutOthers) return
    setSigningOutOthers(true)
    try {
      const { error } = await supabase.auth.signOut({ scope: 'others' })
      if (error) throw error
      onToast('Signed out of all other sessions')
    } catch (err) {
      onToast(err instanceof Error ? err.message : "Couldn't sign out other sessions.", 'error')
    } finally {
      setSigningOutOthers(false)
    }
  }

  return (
    <Page>
      <SectionHeader title="Security" desc="Keep your account safe and in your control." />

      {/* Password */}
      <Card style={{ padding:24 }}>
        <h3 style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:16 }}>Change Password</h3>
        <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:12 }}>
          <div style={{ position:'relative' }}>
            <input type={show?'text':'password'} value={newPassword} onChange={e=>setNewPassword(e.target.value)} placeholder="New password" disabled={changingPassword}
              style={{ width:'100%', padding:'10px 40px 10px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:14, color:C.type, background:'#FAFAFA', boxSizing:'border-box' as const, outline:'none' }} />
            <button onClick={()=>setShow(v=>!v)} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:C.muted, display:'flex' }}>{show?I.eyeOff:I.eye}</button>
          </div>
          <input type={show?'text':'password'} value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} placeholder="Confirm new password" disabled={changingPassword} onKeyDown={e=>e.key==='Enter'&&handleChangePassword()}
            style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:14, color:C.type, background:'#FAFAFA', boxSizing:'border-box' as const, outline:'none' }} />
          <Btn label={changingPassword?'Updating…':'Update Password'} variant="secondary" small disabled={changingPassword || !newPassword} onClick={handleChangePassword} />
        </div>
        {newPassword && (
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ flex:1, height:6, borderRadius:99, background:C.bg, overflow:'hidden' }}>
              <div style={{ width:`${strength.pct}%`, height:'100%', background:strength.color, borderRadius:99, transition:'width 0.4s' }} />
            </div>
            <p style={{ fontSize:12, fontWeight:700, color:strength.color, minWidth:40 }}>{strength.label}</p>
          </div>
        )}
      </Card>

      {/* 2FA — real Supabase MFA (TOTP) */}
      <Card style={{ padding:24 }}>
        <h3 style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:16 }}>Two-Factor Authentication</h3>
        {factorsLoading ? (
          <p style={{ fontSize:13, color:C.muted }}>Checking your security status…</p>
        ) : (
          <>
            <div style={{ display:'flex', gap:14, alignItems:'center', padding:'12px 0', borderBottom:`1px solid ${C.border}` }}>
              <div style={{ width:40, height:40, borderRadius:13, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary, flexShrink:0 }}>
                <span style={{ display:'flex' }}>{I.key}</span>
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:13, fontWeight:700, color:C.type }}>Authenticator App</p>
                <p style={{ fontSize:11, color:C.muted }}>{totpFactor ? 'Enabled via TOTP' : 'Use Google Authenticator, Authy, or similar'}</p>
              </div>
              {totpFactor
                ? <Btn label="Disable" variant="danger" small disabled={mfaBusy} onClick={disableTotp} />
                : <Btn label="Enable" variant="secondary" small disabled={mfaBusy} onClick={startEnroll} />}
            </div>
            <div style={{ display:'flex', gap:14, alignItems:'center', padding:'12px 0' }}>
              <div style={{ width:40, height:40, borderRadius:13, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary, flexShrink:0 }}>
                <span style={{ display:'flex' }}>{I.mail}</span>
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:13, fontWeight:700, color:C.type }}>Email Verification</p>
                <p style={{ fontSize:11, color:C.muted }}>{profile.email || ''}</p>
              </div>
              <Bdg label={emailConfirmedAt ? 'Verified' : 'Unverified'} color={emailConfirmedAt ? C.success : C.warning} />
            </div>

            {enrollData && (
              <div style={{ marginTop:14, padding:18, borderRadius:14, background:'#FAFAFA', border:`1px solid ${C.border}` }}>
                <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:10 }}>Scan this QR code with your authenticator app</p>
                <img src={enrollData.qrCode} alt="Authenticator QR code" style={{ width:160, height:160, display:'block', margin:'0 auto 10px', background:'#fff', borderRadius:8, border:`1px solid ${C.border}` }} />
                <p style={{ fontSize:11, color:C.muted, textAlign:'center' as const, marginBottom:14 }}>Or enter this key manually: <span style={{ fontFamily:'monospace', fontWeight:700 }}>{enrollData.secret}</span></p>
                <div style={{ display:'flex', gap:10 }}>
                  <input value={verifyCode} onChange={e=>setVerifyCode(e.target.value)} placeholder="6-digit code" maxLength={6} disabled={verifying}
                    style={{ flex:1, padding:'10px 14px', borderRadius:10, border:`1.5px solid ${C.primary}`, fontFamily:'Manrope,sans-serif', fontSize:14, color:C.type, background:'#fff', boxSizing:'border-box' as const, outline:'none', letterSpacing:'0.2em' }} />
                  <Btn label={verifying?'Verifying…':'Verify & Enable'} variant="primary" small disabled={verifying || verifyCode.length<6} onClick={confirmEnroll} />
                  <Btn label="Cancel" variant="ghost" small disabled={verifying} onClick={cancelEnroll} />
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Sessions + Alerts */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }} className="as-2col">
        <Card style={{ padding:22 }}>
          <h3 style={{ fontSize:13, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:12 }}>Other Sessions</h3>
          <p style={{ fontSize:12, color:C.muted, marginBottom:14, lineHeight:1.6 }}>Sign out of ReadyPal everywhere else — every other browser and device stays signed in until you do this.</p>
          <Btn label={signingOutOthers?'Signing out…':'Sign Out Other Sessions'} variant="danger" small icon={I.logout} disabled={signingOutOthers} onClick={handleSignOutOthers} />
        </Card>
        <Card style={{ padding:22 }}>
          <h3 style={{ fontSize:13, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:12 }}>Login Alerts</h3>
          <p style={{ fontSize:12, color:C.muted, marginBottom:14, lineHeight:1.6 }}>Saved to your notification preferences — delivery for this alert type is on our roadmap.</p>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <p style={{ fontSize:13, fontWeight:600, color:C.type }}>Email & SMS alerts</p>
            <Toggle on={loginAlerts} onToggle={()=>onSave({ notification_preferences: { ...profile.notification_preferences, loginAlerts: !loginAlerts } })} />
          </div>
        </Card>
      </div>
    </Page>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// LOGIN HISTORY
// ──────────────────────────────────────────────────────────────────────────────
// Minimal, dependency-free User-Agent parse — good enough to label "Chrome
// on macOS" style device rows without pulling in a UA-parsing library.
function parseUserAgent(ua: string): { browser:string; os:string; isMobile:boolean } {
  const browser =
    /Edg\//.test(ua) ? 'Edge' :
    /OPR\//.test(ua) ? 'Opera' :
    /Chrome\//.test(ua) ? 'Chrome' :
    /Firefox\//.test(ua) ? 'Firefox' :
    /Safari\//.test(ua) ? 'Safari' : 'Unknown Browser'
  const os =
    /Windows/.test(ua) ? 'Windows' :
    /Mac OS X/.test(ua) ? 'macOS' :
    /Android/.test(ua) ? 'Android' :
    /iPhone|iPad|iPod/.test(ua) ? 'iOS' :
    /Linux/.test(ua) ? 'Linux' : 'Unknown OS'
  const isMobile = /Mobi|Android|iPhone|iPad/.test(ua)
  return { browser, os, isMobile }
}

function formatLogDate(iso:string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('en-GB', { day:'numeric', month:'short', year:'numeric', hour:'numeric', minute:'2-digit' })
}

type GroupedDevice = { key:string; browser:string; os:string; isMobile:boolean; lastActive:string; isCurrent:boolean; logIds:string[] }

// Shared by the Devices tab and the Account Home "Devices" summary card —
// groups real user_activity_logs login rows by the browser/OS parsed from
// their stored User-Agent, so both views agree on what counts as "a device".
function groupDevicesFromLogs(rows:any[]): GroupedDevice[] {
  const currentUa = navigator.userAgent
  const logins = rows.filter(r => r.event_type === 'login' && r.metadata?.userAgent)
  const byUa = new Map<string, typeof logins>()
  for (const row of logins) {
    const ua = row.metadata.userAgent as string
    if (!byUa.has(ua)) byUa.set(ua, [])
    byUa.get(ua)!.push(row)
  }
  const grouped = Array.from(byUa.entries()).map(([ua, entries]) => {
    const { browser, os, isMobile } = parseUserAgent(ua)
    return {
      key: ua,
      browser, os, isMobile,
      lastActive: entries[0].created_at, // rows already ordered desc
      isCurrent: ua === currentUa,
      logIds: entries.map(e => e.id),
    }
  })
  grouped.sort((a,b) => (a.isCurrent === b.isCurrent) ? 0 : a.isCurrent ? -1 : 1)
  return grouped
}

function LoginHistory({ onToast }: { onToast:(m:string, kind?:'success'|'error')=>void }) {
  const [logins, setLogins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [signingOutOthers, setSigningOutOthers] = useState(false)
  const currentUa = navigator.userAgent

  const load = () => {
    setLoading(true)
    setLoadError('')
    getUserActivityLog(50)
      .then(rows => setLogins(rows.filter(r => r.event_type === 'login')))
      .catch(err => { console.error('Failed to load login history:', err); setLoadError("Couldn't load your login history.") })
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const forget = async (id:string) => {
    try {
      await deleteUserActivityLog(id)
      setLogins(p => p.filter(l => l.id !== id))
    } catch (err) {
      onToast(err instanceof Error ? err.message : "Couldn't remove that entry.", 'error')
    }
  }

  const handleSignOutOthers = async () => {
    if (signingOutOthers) return
    setSigningOutOthers(true)
    try {
      const { error } = await supabase.auth.signOut({ scope: 'others' })
      if (error) throw error
      onToast('Signed out of all other sessions')
    } catch (err) {
      onToast(err instanceof Error ? err.message : "Couldn't sign out other sessions.", 'error')
    } finally {
      setSigningOutOthers(false)
    }
  }

  return (
    <Page>
      <SectionHeader title="Login History" desc="Sign-ins recorded from your recent browsing sessions on this account." />
      <div style={{ display:'flex', justifyContent:'flex-end' }}>
        <Btn label={signingOutOthers?'Signing out…':'Sign Out All Other Sessions'} variant="danger" small icon={I.trash} disabled={signingOutOthers} onClick={handleSignOutOthers} />
      </div>
      {loading ? (
        <p style={{ fontSize:13, color:C.muted }}>Loading login history…</p>
      ) : loadError ? (
        <p style={{ fontSize:13, color:C.error }}>{loadError}</p>
      ) : logins.length === 0 ? (
        <Card style={{ padding:'40px', textAlign:'center' as const }}>
          <p style={{ fontSize:13, color:C.muted }}>No sign-ins recorded yet.</p>
        </Card>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {logins.map(l => {
            const ua = l.metadata?.userAgent || ''
            const { browser, os } = parseUserAgent(ua)
            const isCurrent = ua === currentUa
            return (
              <Card key={l.id} style={{ padding:20 }}>
                <div style={{ display:'flex', gap:14, alignItems:'center' }}>
                  <div style={{ width:42, height:42, borderRadius:13, background:isCurrent?`${C.success}10`:C.bg, display:'flex', alignItems:'center', justifyContent:'center', color:isCurrent?C.success:C.muted, flexShrink:0 }}>
                    <span style={{ display:'flex', transform:'scale(1.2)' }}>{I.device}</span>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:3 }}>
                      <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{browser} · {os}</p>
                      {isCurrent && <Bdg label="Current Session" color={C.success} />}
                    </div>
                    <p style={{ fontSize:12, color:C.muted }}>{formatLogDate(l.created_at)}</p>
                  </div>
                  {!isCurrent && <Btn label="Forget" variant="ghost" small onClick={()=>forget(l.id)} />}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </Page>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// CONNECTED DEVICES
// ──────────────────────────────────────────────────────────────────────────────
function Devices({ onToast }: { onToast:(m:string, kind?:'success'|'error')=>void }) {
  const [devices, setDevices] = useState<GroupedDevice[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const load = () => {
    setLoading(true)
    setLoadError('')
    getUserActivityLog(100)
      .then(rows => setDevices(groupDevicesFromLogs(rows)))
      .catch(err => { console.error('Failed to load devices:', err); setLoadError("Couldn't load your devices.") })
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const forget = async (device: typeof devices[number]) => {
    try {
      await Promise.all(device.logIds.map(id => deleteUserActivityLog(id)))
      setDevices(p => p.filter(d => d.key !== device.key))
    } catch (err) {
      onToast(err instanceof Error ? err.message : "Couldn't remove that device.", 'error')
    }
  }

  return (
    <Page>
      <SectionHeader title="Connected Devices" desc="Devices recorded from your recent sign-ins, based on browser and OS." />
      {loading ? (
        <p style={{ fontSize:13, color:C.muted }}>Loading devices…</p>
      ) : loadError ? (
        <p style={{ fontSize:13, color:C.error }}>{loadError}</p>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {devices.map(d=>(
            <Card key={d.key} style={{ padding:22 }}>
              <div style={{ display:'flex', gap:16, alignItems:'center' }}>
                <div style={{ width:52, height:52, borderRadius:16, background:d.isCurrent?`${C.primary}10`:C.bg, border:`1.5px solid ${d.isCurrent?C.primary+'30':C.border}`, display:'flex', alignItems:'center', justifyContent:'center', color:d.isCurrent?C.primary:C.muted, flexShrink:0 }}>
                  <span style={{ display:'flex', transform:'scale(1.4)' }}>{d.isMobile?I.phone:I.device}</span>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                    <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{d.browser} on {d.os}</p>
                    {d.isCurrent && <Bdg label="This Device" color={C.success} />}
                  </div>
                  <p style={{ fontSize:12, color:C.muted }}>Last active {formatLogDate(d.lastActive)}</p>
                </div>
                {!d.isCurrent && (
                  <Btn label="Forget" variant="danger" small icon={I.trash} onClick={()=>forget(d)} />
                )}
              </div>
            </Card>
          ))}
          {devices.length===0&&(
            <Card style={{ padding:'48px', textAlign:'center' as const }}>
              <p style={{ fontSize:36, marginBottom:10 }}>📱</p>
              <p style={{ fontSize:15, fontWeight:800, color:C.type, marginBottom:6, fontFamily:'Manrope,sans-serif' }}>No other devices</p>
              <p style={{ fontSize:13, color:C.muted }}>You are only signed in on this device.</p>
            </Card>
          )}
        </div>
      )}
    </Page>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// LINKED ACCOUNTS
// ──────────────────────────────────────────────────────────────────────────────
const OAUTH_PROVIDERS: { key:'google'|'apple'|'facebook'|'azure'|'linkedin_oidc'; label:string; icon:ReactNode }[] = [
  { key:'google',        label:'Google',    icon:I.google },
  { key:'apple',         label:'Apple',     icon:I.apple },
  { key:'facebook',      label:'Facebook',  icon:<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="#1877F2"/><path d="M10 5H9a1 1 0 0 0-1 1v1.5h2l-.3 2H8V14H6V9.5H4.5v-2H6V6a2.5 2.5 0 0 1 2.5-2.5H10V5z" fill="white"/></svg> },
  { key:'azure',         label:'Microsoft', icon:<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6.5" height="6.5" fill="#F25022"/><rect x="8.5" y="1" width="6.5" height="6.5" fill="#7FBA00"/><rect x="1" y="8.5" width="6.5" height="6.5" fill="#00A4EF"/><rect x="8.5" y="8.5" width="6.5" height="6.5" fill="#FFB900"/></svg> },
  { key:'linkedin_oidc', label:'LinkedIn',  icon:<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="#0A66C2"/><path d="M5 6.5v5M5 4.5v.5M8 11.5v-3a1.5 1.5 0 0 1 3 0v3M8 6.5v5" stroke="white" strokeWidth="1.2" strokeLinecap="round"/></svg> },
]

function LinkedAccounts({ onToast }: { onToast:(m:string, kind?:'success'|'error')=>void }) {
  const [identities, setIdentities] = useState<Awaited<ReturnType<typeof getLinkedIdentities>>>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [busyProvider, setBusyProvider] = useState<string|null>(null)

  const load = () => {
    setLoading(true)
    setLoadError('')
    getLinkedIdentities()
      .then(setIdentities)
      .catch(err => { console.error('Failed to load linked accounts:', err); setLoadError("Couldn't load your linked accounts.") })
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleConnect = async (provider: typeof OAUTH_PROVIDERS[number]['key']) => {
    setBusyProvider(provider)
    try {
      await linkOAuthIdentity(provider)
      // linkIdentity redirects the browser to the provider — nothing more to do here.
    } catch (err) {
      onToast(err instanceof Error ? err.message : `Couldn't connect ${provider}.`, 'error')
      setBusyProvider(null)
    }
  }

  const handleDisconnect = async (identity: Awaited<ReturnType<typeof getLinkedIdentities>>[number]) => {
    setBusyProvider(identity.provider)
    try {
      await unlinkOAuthIdentity(identity)
      onToast(`${identity.provider} disconnected`)
      load()
    } catch (err) {
      onToast(err instanceof Error ? err.message : `Couldn't disconnect ${identity.provider}.`, 'error')
    } finally {
      setBusyProvider(null)
    }
  }

  return (
    <Page>
      <SectionHeader title="Linked Accounts" desc="Connect third-party accounts for faster sign-in." />
      {loading ? (
        <p style={{ fontSize:13, color:C.muted }}>Loading linked accounts…</p>
      ) : loadError ? (
        <p style={{ fontSize:13, color:C.error }}>{loadError}</p>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {OAUTH_PROVIDERS.map(p=>{
            const identity = identities.find(i => i.provider === p.key)
            const busy = busyProvider === p.key
            return (
              <Card key={p.key} style={{ padding:20 }}>
                <div style={{ display:'flex', gap:14, alignItems:'center' }}>
                  <div style={{ width:44, height:44, borderRadius:14, background:C.bg, border:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <span style={{ display:'flex' }}>{p.icon}</span>
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{p.label}</p>
                    <p style={{ fontSize:12, color:C.muted }}>{identity ? ((identity.identity_data?.email as string) || 'Connected') : 'Not connected'}</p>
                  </div>
                  <Btn
                    label={busy ? 'Working…' : identity ? 'Disconnect' : 'Connect'}
                    variant={identity?'ghost':'secondary'}
                    small
                    disabled={busy}
                    onClick={()=>identity ? handleDisconnect(identity) : handleConnect(p.key)}
                  />
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </Page>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS
// ──────────────────────────────────────────────────────────────────────────────
const DEFAULT_NOTIFICATION_PREFS: Record<string,{push:boolean;email:boolean;sms:boolean}> = {
  'Care Updates':            {push:true, email:true, sms:true},
  'Task Updates':            {push:true, email:true, sms:false},
  'Emergency Alerts':        {push:true, email:true, sms:true},
  'Payment Alerts':          {push:true, email:true, sms:false},
  'Invoice Ready':           {push:false,email:true, sms:false},
  'Refund Updates':          {push:true, email:true, sms:false},
  'Messages':                {push:true, email:false,sms:false},
  'Review Reminders':        {push:true, email:true, sms:false},
  'Agent Replies':           {push:true, email:true, sms:false},
  'Marketing & Offers':      {push:false,email:false,sms:false},
  'App Updates':             {push:false,email:true, sms:false},
  'Feature Announcements':   {push:false,email:true, sms:false},
}

function NotificationSettings({ profile, onSave }: {
  profile:any; onSave:(f:Record<string,any>)=>void
}) {
  const groups = [
    { group:'Care',      items:['Care Updates','Task Updates','Emergency Alerts'] },
    { group:'Financial', items:['Payment Alerts','Invoice Ready','Refund Updates'] },
    { group:'Social',    items:['Messages','Review Reminders','Agent Replies'] },
    { group:'Platform',  items:['Marketing & Offers','App Updates','Feature Announcements'] },
  ]

  const [prefs, setPrefs] = useState<Record<string,{push:boolean;email:boolean;sms:boolean}>>(
    profile.notification_preferences && typeof profile.notification_preferences === 'object'
      ? { ...DEFAULT_NOTIFICATION_PREFS, ...profile.notification_preferences }
      : DEFAULT_NOTIFICATION_PREFS
  )

  const toggle = async (item:string, ch:'push'|'email'|'sms') => {
    const next = { ...prefs, [item]: { ...prefs[item], [ch]: !prefs[item][ch] } }
    setPrefs(next)
    try {
      await onSave({ notification_preferences: next })
    } catch {
      setPrefs(prefs) // revert the optimistic toggle — the caller already toasted the error
    }
  }

  return (
    <Page>
      <SectionHeader title="Notification Settings" desc="Choose how and when ReadyPal contacts you." />
      {groups.map(g=>(
        <Card key={g.group} style={{ padding:22 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
            <h3 style={{ fontSize:13, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{g.group}</h3>
            <div style={{ display:'flex', gap:20 }}>
              {['Push','Email','SMS'].map(ch=>(
                <p key={ch} style={{ fontSize:11, fontWeight:700, color:C.muted, width:36, textAlign:'center' as const }}>{ch}</p>
              ))}
            </div>
          </div>
          {g.items.map((item,i)=>(
            <div key={item} style={{ display:'flex', alignItems:'center', padding:'10px 0', borderTop:i===0?`1px solid ${C.border}`:undefined }}>
              <p style={{ fontSize:13, flex:1, color:C.type }}>{item}</p>
              <div style={{ display:'flex', gap:20 }}>
                {(['push','email','sms'] as const).map(ch=>(
                  <div key={ch} style={{ width:36, display:'flex', justifyContent:'center' }}>
                    <Toggle on={prefs[item]?.[ch]??false} onToggle={()=>toggle(item,ch)} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Card>
      ))}
    </Page>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// PRIVACY
// ──────────────────────────────────────────────────────────────────────────────
const DEFAULT_PRIVACY_SETTINGS = {
  profileVisible:true, activityVisible:false, reviewVisible:true,
  searchVisible:true,  dataSharing:false,     marketing:false,
}

function Privacy({ profile, onSave, onExportData }: {
  profile:any; onSave:(f:Record<string,any>)=>void; onExportData:()=>void
}) {
  const [settings, setSettings] = useState<typeof DEFAULT_PRIVACY_SETTINGS>(
    profile.privacy_settings && typeof profile.privacy_settings === 'object'
      ? { ...DEFAULT_PRIVACY_SETTINGS, ...profile.privacy_settings }
      : DEFAULT_PRIVACY_SETTINGS
  )
  const [cookies, setCookies] = useState<string>(() => localStorage.getItem('rp_cookie_pref') || 'essential')

  const toggle = async (k:keyof typeof settings) => {
    const next = { ...settings, [k]: !settings[k] }
    setSettings(next)
    try {
      await onSave({ privacy_settings: next })
    } catch {
      setSettings(settings) // the caller already toasted the error
    }
  }

  const setCookiePref = (k:string) => {
    setCookies(k)
    localStorage.setItem('rp_cookie_pref', k)
  }

  const items = [
    {k:'profileVisible' as const, l:'Profile Visibility',    d:'Allow care agents to view your profile when matched'},
    {k:'activityVisible'as const, l:'Activity Visibility',   d:'Show your recent activity to connected agents'},
    {k:'reviewVisible'  as const, l:'Review Visibility',     d:'Make your submitted reviews visible publicly'},
    {k:'searchVisible'  as const, l:'Search Visibility',     d:'Allow your profile to appear in agent search results'},
    {k:'dataSharing'    as const, l:'Data Sharing',          d:'Share anonymised data to improve ReadyPal services'},
    {k:'marketing'      as const, l:'Marketing Consent',     d:'Receive personalised offers and promotions'},
  ]

  return (
    <Page>
      <SectionHeader title="Privacy" desc="Control how your information is used and shared." />
      <Card style={{ padding:22 }}>
        {items.map((item,i)=>(
          <div key={item.k} style={{ display:'flex', gap:14, alignItems:'center', padding:'13px 0', borderBottom:i<items.length-1?`1px solid ${C.border}`:'none' }}>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{item.l}</p>
              <p style={{ fontSize:11, color:C.muted, marginTop:2 }}>{item.d}</p>
            </div>
            <Toggle on={settings[item.k]} onToggle={()=>toggle(item.k)} />
          </div>
        ))}
      </Card>

      {/* Cookie preferences — a browser-local choice, not tied to your account */}
      <Card style={{ padding:22 }}>
        <h3 style={{ fontSize:13, fontWeight:800, color:C.type, marginBottom:14, fontFamily:'Manrope,sans-serif' }}>Cookie Preferences</h3>
        {[{k:'essential',l:'Essential',d:'Required for core functionality'},{k:'analytics',l:'Analytics',d:'Help us understand usage patterns'},{k:'marketing',l:'Marketing',d:'Enable personalised advertising'}].map(c=>(
          <button key={c.k} onClick={()=>setCookiePref(c.k)}
            style={{ width:'100%', display:'flex', gap:12, alignItems:'center', padding:'11px 12px', borderRadius:10, border:`1.5px solid ${cookies===c.k?C.primary:C.border}`, background:cookies===c.k?`${C.primary}06`:'transparent', cursor:'pointer', marginBottom:8, textAlign:'left' as const }}>
            <div style={{ width:18, height:18, borderRadius:'50%', border:`2px solid ${cookies===c.k?C.primary:C.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              {cookies===c.k&&<div style={{ width:9, height:9, borderRadius:'50%', background:C.primary }} />}
            </div>
            <div>
              <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{c.l}{c.k==='essential'&&<span style={{ fontSize:11, color:C.muted }}> (always on)</span>}</p>
              <p style={{ fontSize:11, color:C.muted }}>{c.d}</p>
            </div>
          </button>
        ))}
      </Card>

      <Btn label="Download My Data" variant="secondary" icon={I.download} onClick={onExportData} />
    </Page>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// ACCESSIBILITY
// ──────────────────────────────────────────────────────────────────────────────
function readLocalPref<T>(key:string, fallback:T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw !== null ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeLocalPref<T>(key:string, value:T) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* private mode / quota — preference just won't persist */ }
}

function setRootClass(cls:string, on:boolean) {
  document.documentElement.classList.toggle(cls, on)
}

const FONT_SIZE_CLASSES = { sm:'rp-font-sm', md:'', lg:'rp-font-lg' } as const

function Accessibility({ onToast }: { onToast:(m:string)=>void }) {
  const [fontSize, setFontSizeState] = useState<'sm'|'md'|'lg'>(() => readLocalPref('rp_font_size', 'md' as const))
  const [contrast, setContrastState] = useState<'normal'|'high'>(() => readLocalPref('rp_contrast', 'normal' as const))
  const [toggles, setTogglesState] = useState(() => readLocalPref('rp_a11y_toggles', { motion:false, screenReader:false, keyboard:true, colorBlind:false, largeTargets:false }))

  // Apply real <html> classes on mount (so a refresh keeps the effect) and
  // whenever a preference changes.
  useEffect(() => {
    Object.values(FONT_SIZE_CLASSES).forEach(c => c && setRootClass(c, false))
    const cls = FONT_SIZE_CLASSES[fontSize]
    if (cls) setRootClass(cls, true)
  }, [fontSize])
  useEffect(() => { setRootClass('rp-high-contrast', contrast === 'high') }, [contrast])
  useEffect(() => { setRootClass('rp-reduced-motion', toggles.motion) }, [toggles.motion])
  useEffect(() => { setRootClass('rp-keyboard-nav', toggles.keyboard) }, [toggles.keyboard])
  useEffect(() => { setRootClass('rp-colorblind', toggles.colorBlind) }, [toggles.colorBlind])
  useEffect(() => { setRootClass('rp-large-targets', toggles.largeTargets) }, [toggles.largeTargets])

  const setFontSize = (v:'sm'|'md'|'lg') => { setFontSizeState(v); writeLocalPref('rp_font_size', v); onToast('Font size updated') }
  const setContrast = (v:'normal'|'high') => { setContrastState(v); writeLocalPref('rp_contrast', v); onToast('Contrast updated') }
  const tog = (k:keyof typeof toggles) => {
    setTogglesState(p => {
      const next = { ...p, [k]: !p[k] }
      writeLocalPref('rp_a11y_toggles', next)
      return next
    })
    onToast('Accessibility setting saved')
  }

  return (
    <Page>
      <SectionHeader title="Accessibility" desc="Make ReadyPal work the way you need it to." />
      <Card style={{ padding:22 }}>
        <h3 style={{ fontSize:13, fontWeight:800, color:C.type, marginBottom:14, fontFamily:'Manrope,sans-serif' }}>Font Size</h3>
        <div style={{ display:'flex', gap:10 }}>
          {([['sm','Small'],['md','Default'],['lg','Large']] as const).map(([k,l])=>(
            <button key={k} onClick={()=>setFontSize(k)}
              style={{ flex:1, padding:'10px', borderRadius:10, border:`2px solid ${fontSize===k?C.primary:C.border}`, background:fontSize===k?`${C.primary}08`:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:k==='sm'?11:k==='md'?13:16, fontWeight:fontSize===k?800:500, color:fontSize===k?C.primary:C.sub }}>
              {l}
            </button>
          ))}
        </div>
      </Card>
      <Card style={{ padding:22 }}>
        <h3 style={{ fontSize:13, fontWeight:800, color:C.type, marginBottom:14, fontFamily:'Manrope,sans-serif' }}>Contrast</h3>
        <div style={{ display:'flex', gap:10 }}>
          {([['normal','Normal'],['high','High Contrast']] as const).map(([k,l])=>(
            <button key={k} onClick={()=>setContrast(k)}
              style={{ flex:1, padding:'10px', borderRadius:10, border:`2px solid ${contrast===k?C.primary:C.border}`, background:contrast===k?`${C.primary}08`:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:contrast===k?800:500, color:contrast===k?C.primary:C.sub }}>
              {l}
            </button>
          ))}
        </div>
      </Card>
      <Card style={{ padding:22 }}>
        {([
          {k:'motion'     as const, l:'Reduced Motion',     d:'Disable animations and transitions'},
          {k:'screenReader'as const,l:'Screen Reader Mode', d:'Optimise layout for assistive technology'},
          {k:'keyboard'   as const, l:'Keyboard Navigation',d:'Enhance keyboard focus indicators'},
          {k:'colorBlind' as const, l:'Colour Blind Support',d:'Use colour-blind-safe palettes'},
          {k:'largeTargets'as const,l:'Large Touch Targets', d:'Increase tap area for buttons and controls'},
        ]).map((item,i,arr)=>(
          <div key={item.k} style={{ display:'flex', gap:12, alignItems:'center', padding:'13px 0', borderBottom:i<arr.length-1?`1px solid ${C.border}`:'none' }}>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{item.l}</p>
              <p style={{ fontSize:11, color:C.muted, marginTop:2 }}>{item.d}</p>
            </div>
            <Toggle on={toggles[item.k]} onToggle={()=>tog(item.k)} />
          </div>
        ))}
      </Card>
    </Page>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// LANGUAGE & REGION
// ──────────────────────────────────────────────────────────────────────────────
const DEFAULT_LANGUAGE_REGION = {
  language:'English', currency:'LKR', timeZone:'Asia/Colombo',
  dateFormat:'DD/MM/YYYY', timeFormat:'12h',
}

function LanguageRegion({ profile, onSave }: { profile:any; onSave:(f:Record<string,any>)=>void }) {
  const selStyle = (active:boolean):CSSProperties => ({ flex:1, padding:'9px 0', borderRadius:9, border:`1.5px solid ${active?C.primary:C.border}`, background:active?`${C.primary}08`:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:active?800:500, color:active?C.primary:C.sub, textAlign:'center' as const })
  const [region, setRegionState] = useState<typeof DEFAULT_LANGUAGE_REGION>(
    profile.language_region && typeof profile.language_region === 'object'
      ? { ...DEFAULT_LANGUAGE_REGION, ...profile.language_region }
      : DEFAULT_LANGUAGE_REGION
  )

  const setRegion = async (patch: Partial<typeof DEFAULT_LANGUAGE_REGION>) => {
    const next = { ...region, ...patch }
    setRegionState(next)
    try {
      await onSave({ language_region: next })
    } catch {
      setRegionState(region) // the caller already toasted the error
    }
  }

  return (
    <Page>
      <SectionHeader title="Language & Region" desc="Localise your ReadyPal experience." />
      {[
        { label:'Preferred Language', key:'language' as const,  options:['English','Sinhala','Tamil'] },
        { label:'Currency',           key:'currency' as const,  options:['LKR','USD','GBP','EUR'] },
      ].map(f=>(
        <Card key={f.label} style={{ padding:22 }}>
          <p style={{ fontSize:12, fontWeight:700, color:C.muted, marginBottom:12 }}>{f.label}</p>
          <div style={{ display:'flex', gap:8 }}>
            {f.options.map(o=><button key={o} onClick={()=>setRegion({ [f.key]: o })} style={selStyle(region[f.key]===o)}>{o}</button>)}
          </div>
        </Card>
      ))}
      <Card style={{ padding:'8px 24px 24px' }}>
        <Field label="Time Zone"   value={region.timeZone}   onSave={v=>setRegion({ timeZone:v })} />
        <Field label="Date Format" value={region.dateFormat} onSave={v=>setRegion({ dateFormat:v })} hint="e.g. DD/MM/YYYY or MM-DD-YYYY" />
      </Card>
      <Card style={{ padding:22 }}>
        <p style={{ fontSize:12, fontWeight:700, color:C.muted, marginBottom:12 }}>Time Format</p>
        <div style={{ display:'flex', gap:8 }}>
          {[['12h','12-hour (1:30 PM)'],['24h','24-hour (13:30)']].map(([k,l])=>(
            <button key={k} onClick={()=>setRegion({ timeFormat:k })} style={selStyle(region.timeFormat===k)}>{l}</button>
          ))}
        </div>
      </Card>
    </Page>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// APPEARANCE
// ──────────────────────────────────────────────────────────────────────────────
function applyTheme(theme:'light'|'dark'|'system') {
  document.documentElement.setAttribute('data-theme', theme === 'system' ? '' : theme)
  // A real, honest effect given the app's inline-styled components aren't
  // CSS-variable driven: this changes native form controls, scrollbars,
  // and other browser-chrome rendering per the chosen scheme.
  document.documentElement.style.colorScheme = theme === 'system' ? '' : theme
}

function Appearance({ onToast }: { onToast:(m:string)=>void }) {
  const [theme, setThemeState] = useState<'light'|'dark'|'system'>(() => readLocalPref('rp_theme', 'light' as const))
  const [density, setDensityState] = useState<'comfortable'|'compact'>(() => readLocalPref('rp_density', 'comfortable' as const))

  useEffect(() => { applyTheme(theme) }, [theme])
  useEffect(() => { setRootClass('rp-density-compact', density === 'compact') }, [density])

  const setTheme = (v:'light'|'dark'|'system') => { setThemeState(v); writeLocalPref('rp_theme', v); onToast(`Theme set to ${v}`) }
  const setDensity = (v:'comfortable'|'compact') => { setDensityState(v); writeLocalPref('rp_density', v); onToast('Density preference saved') }

  return (
    <Page>
      <SectionHeader title="Appearance" desc="Personalise how ReadyPal looks for you." />
      <Card style={{ padding:22 }}>
        <h3 style={{ fontSize:13, fontWeight:800, color:C.type, marginBottom:16, fontFamily:'Manrope,sans-serif' }}>Theme</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
          {([
            ['light',  'Light',  I.sun,     '#FAFAFA'],
            ['dark',   'Dark',   I.moon,    '#1A2530'],
            ['system', 'System', I.monitor, 'linear-gradient(135deg,#FAFAFA 50%,#1A2530 50%)'],
            ] as const).map(([k,l,icon,bg])=>(
            <button key={k} onClick={()=>setTheme(k)}
              style={{ padding:'20px 16px', borderRadius:14, border:`2px solid ${theme===k?C.primary:C.border}`, background:theme===k?`${C.primary}06`:'transparent', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:12, transition:'all 0.15s' }}>
              {/* Mini preview */}
              <div style={{ width:72, height:48, borderRadius:10, background:bg, border:`1px solid ${C.border}`, overflow:'hidden', display:'flex', flexDirection:'column', gap:4, padding:6, boxShadow:'0 2px 8px rgba(44,62,67,0.10)' }}>
                <div style={{ height:6, borderRadius:3, background:theme===k&&k==='dark'?'rgba(255,255,255,0.2)':'rgba(44,62,67,0.12)', width:'70%' }} />
                <div style={{ height:4, borderRadius:3, background:theme===k&&k==='dark'?'rgba(255,255,255,0.1)':'rgba(44,62,67,0.08)', width:'50%' }} />
              </div>
              <div style={{ display:'flex', gap:5, alignItems:'center', color:theme===k?C.primary:C.sub }}>
                <span style={{ display:'flex' }}>{icon}</span>
                <p style={{ fontSize:12, fontWeight:theme===k?800:600, fontFamily:'Manrope,sans-serif', color:theme===k?C.primary:C.sub }}>{l}</p>
              </div>
              {theme===k && <span style={{ width:20, height:20, borderRadius:'50%', background:C.primary, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}><span style={{transform:'scale(0.7)',display:'flex'}}>{I.check}</span></span>}
            </button>
          ))}
        </div>
      </Card>

      <Card style={{ padding:22 }}>
        <h3 style={{ fontSize:13, fontWeight:800, color:C.type, marginBottom:16, fontFamily:'Manrope,sans-serif' }}>Density</h3>
        <div style={{ display:'flex', gap:10 }}>
          {([['comfortable','Comfortable','More breathing room'],['compact','Compact','More content on screen']] as const).map(([k,l,d])=>(
            <button key={k} onClick={()=>setDensity(k)}
              style={{ flex:1, padding:'14px 16px', borderRadius:12, border:`2px solid ${density===k?C.primary:C.border}`, background:density===k?`${C.primary}06`:'transparent', cursor:'pointer', textAlign:'left' as const }}>
              <p style={{ fontSize:13, fontWeight:800, color:density===k?C.primary:C.type, marginBottom:3, fontFamily:'Manrope,sans-serif' }}>{l}</p>
              <p style={{ fontSize:11, color:C.muted }}>{d}</p>
            </button>
          ))}
        </div>
      </Card>

      <Card style={{ padding:22, opacity:0.65 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <p style={{ fontSize:13, fontWeight:700, color:C.type }}>Accent Color</p>
            <p style={{ fontSize:11, color:C.muted }}>Custom accent colors — coming soon</p>
          </div>
          <div style={{ display:'flex', gap:6 }}>
            {[C.primary,C.accent,C.info,'#8B5CF6','#22C55E'].map(col=>(
              <div key={col} style={{ width:24, height:24, borderRadius:'50%', background:col, border:`2px solid ${col===C.primary?C.primary:C.border}` }} />
            ))}
          </div>
        </div>
      </Card>
    </Page>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// DOWNLOAD CENTER
// ──────────────────────────────────────────────────────────────────────────────
function triggerDownload(filename:string, content:string, mimeType:string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function toCsvBlock(title:string, rows:Record<string, unknown>[]): string {
  if (rows.length === 0) return `${title}\n(no records)\n`
  const headers = Array.from(new Set(rows.flatMap(r => Object.keys(r))))
  const escape = (v:unknown) => {
    const s = v === null || v === undefined ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s
  }
  const lines = [headers.join(','), ...rows.map(r => headers.map(h => escape(r[h])).join(','))]
  return `${title}\n${lines.join('\n')}\n`
}

function Downloads({ onToast }: { onToast:(m:string, kind?:'success'|'error')=>void }) {
  const [exportingJson, setExportingJson] = useState(false)
  const [exportingCsv, setExportingCsv] = useState(false)

  const exportJson = async () => {
    if (exportingJson) return
    setExportingJson(true)
    try {
      const data = await exportMyAccountData()
      triggerDownload(`readypal-data-export-${Date.now()}.json`, JSON.stringify(data, null, 2), 'application/json')
      logUserActivity('data_exported', 'Downloaded account data (JSON)')
      onToast('Your data export has downloaded')
    } catch (err) {
      onToast(err instanceof Error ? err.message : "Couldn't export your data. Please try again.", 'error')
    } finally {
      setExportingJson(false)
    }
  }

  const exportCsv = async () => {
    if (exportingCsv) return
    setExportingCsv(true)
    try {
      const data = await exportMyAccountData()
      const csv = [
        toCsvBlock('Profile', data.profile ? [data.profile] : []),
        toCsvBlock('Care Requests', data.care_requests),
        toCsvBlock('Bookings', data.bookings),
      ].join('\n')
      triggerDownload(`readypal-data-export-${Date.now()}.csv`, csv, 'text/csv')
      logUserActivity('data_exported', 'Downloaded account data (CSV)')
      onToast('Your data export has downloaded')
    } catch (err) {
      onToast(err instanceof Error ? err.message : "Couldn't export your data. Please try again.", 'error')
    } finally {
      setExportingCsv(false)
    }
  }

  const items = [
    { label:'Full Data Export (JSON)', desc:'Your profile, care requests, and bookings in one file', icon:'📦', onClick:exportJson, busy:exportingJson },
    { label:'Full Data Export (CSV)',  desc:'Same data, spreadsheet-friendly',                        icon:'📊', onClick:exportCsv,  busy:exportingCsv },
  ]

  return (
    <Page>
      <SectionHeader title="Download Center" desc="Export your ReadyPal data at any time." />
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {items.map((item)=>(
          <Card key={item.label} hover style={{ padding:20 }}>
            <div style={{ display:'flex', gap:14, alignItems:'center' }}>
              <div style={{ width:46, height:46, borderRadius:14, background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{item.icon}</div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{item.label}</p>
                <p style={{ fontSize:12, color:C.muted }}>{item.desc}</p>
              </div>
              <Btn label={item.busy?'Preparing…':'Download'} variant="secondary" small icon={I.download} disabled={item.busy} onClick={item.onClick} />
            </div>
          </Card>
        ))}
      </div>
    </Page>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// ACTIVITY LOG
// ──────────────────────────────────────────────────────────────────────────────
const ACTIVITY_EVENT_META: Record<string, { icon:string; color:string }> = {
  login:              { icon:'🔐', color:C.muted },
  password_changed:   { icon:'🔑', color:C.warning },
  mfa_enabled:         { icon:'🔒', color:C.success },
  mfa_disabled:        { icon:'🔓', color:C.warning },
  profile_updated:     { icon:'👤', color:C.primary },
  data_exported:       { icon:'📦', color:C.info },
  account_deletion_requested: { icon:'⚠️', color:C.error },
}

function ActivityLog() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    getUserActivityLog(50)
      .then(setEvents)
      .catch(err => { console.error('Failed to load activity log:', err); setLoadError("Couldn't load your activity log.") })
      .finally(() => setLoading(false))
  }, [])

  return (
    <Page>
      <SectionHeader title="Activity Log" desc="A timeline of account changes and events, most recent first." />
      {loading ? (
        <p style={{ fontSize:13, color:C.muted }}>Loading activity…</p>
      ) : loadError ? (
        <p style={{ fontSize:13, color:C.error }}>{loadError}</p>
      ) : events.length === 0 ? (
        <Card style={{ padding:'40px', textAlign:'center' as const }}>
          <p style={{ fontSize:13, color:C.muted }}>No activity recorded yet.</p>
        </Card>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
          {events.map((e,i)=>{
            const meta = ACTIVITY_EVENT_META[e.event_type] ?? { icon:'•', color:C.muted }
            return (
              <div key={e.id} style={{ display:'flex', gap:14 }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                  <div style={{ width:38, height:38, borderRadius:12, background:`${meta.color}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>{meta.icon}</div>
                  {i<events.length-1&&<div style={{ width:2, flex:1, background:C.border, margin:'4px 0' }} />}
                </div>
                <div style={{ paddingBottom:i<events.length-1?18:0, paddingTop:2 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:2 }}>{e.event_type.replace(/_/g,' ').replace(/\b\w/g, (c:string)=>c.toUpperCase())}</p>
                  {e.description && <p style={{ fontSize:12, color:C.muted, marginBottom:2 }}>{e.description}</p>}
                  <p style={{ fontSize:11, color:C.muted }}>{formatLogDate(e.created_at)}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Page>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// SUPPORT
// ──────────────────────────────────────────────────────────────────────────────
function Support({ onToast }: { onToast:(m:string, kind?:'success'|'error')=>void }) {
  const [bugDesc, setBugDesc] = useState('')
  const [submittingBug, setSubmittingBug] = useState(false)
  const [submittingContact, setSubmittingContact] = useState(false)

  const submitTicket = async (subject:string, kind:'bug'|'contact') => {
    const setBusy = kind === 'bug' ? setSubmittingBug : setSubmittingContact
    setBusy(true)
    try {
      await createSupportTicket(subject)
      if (kind === 'bug') { onToast('Bug report submitted — thank you!'); setBugDesc('') }
      else onToast('Support request sent — we\'ll reply within 24 hours')
    } catch (err) {
      onToast(err instanceof Error ? err.message : "Couldn't submit your request. Please try again.", 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Page>
      <SectionHeader title="Support" desc="We're here to help." />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14 }} className="as-2col">
        {[
          { icon:'📚', title:'Help Center',     desc:'Browse guides, tutorials and FAQs — coming soon', cta:'Coming Soon', disabled:true },
          { icon:'💬', title:'Live Chat',        desc:'Chat with our support team (Mon–Fri 8am–8pm)', cta:'Coming Soon', disabled:true },
          { icon:'✉️',  title:'Contact Support', desc:'Send us a message — response within 24 hours', cta:submittingContact?'Sending…':'Send Message', disabled:submittingContact, onClick:()=>submitTicket('General support request from Account Settings', 'contact') },
          { icon:'🗺️', title:'FAQ',             desc:'Quick answers to common questions — coming soon', cta:'Coming Soon', disabled:true },
        ].map((s,i)=>(
          <Card key={i} hover style={{ padding:22 }}>
            <div style={{ fontSize:28, marginBottom:10 }}>{s.icon}</div>
            <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:5 }}>{s.title}</p>
            <p style={{ fontSize:12, color:C.muted, lineHeight:1.6, marginBottom:14 }}>{s.desc}</p>
            <Btn label={s.cta} variant="secondary" small disabled={s.disabled} onClick={s.onClick ?? (()=>{})} />
          </Card>
        ))}
      </div>

      {/* Bug report — files a real support ticket */}
      <Card style={{ padding:22 }}>
        <h3 style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:14 }}>Report a Bug</h3>
        <textarea value={bugDesc} onChange={e=>setBugDesc(e.target.value)} rows={4} placeholder="Describe what happened, what you expected, and steps to reproduce…" disabled={submittingBug}
          style={{ width:'100%', padding:'12px 14px', borderRadius:12, border:`1.5px solid ${bugDesc?C.primary:C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, outline:'none', resize:'none' as const, background:'#FAFAFA', boxSizing:'border-box' as const, lineHeight:1.65 }} />
        <div style={{ display:'flex', gap:10, marginTop:12 }}>
          <Btn label={submittingBug?'Submitting…':'Submit Bug Report'} variant="primary" disabled={bugDesc.length<10 || submittingBug} onClick={()=>submitTicket(`Bug report: ${bugDesc}`, 'bug')} />
        </div>
      </Card>
    </Page>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// DELETE ACCOUNT
// ──────────────────────────────────────────────────────────────────────────────
function DeleteAccount({ profile, onToast }: { profile:any; onToast:(m:string, kind?:'success'|'error')=>void }) {
  const navigate = useNavigate()
  const [step, setStep] = useState<1|2|3>(1)
  const [reason, setReason] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const reasons = ['No longer need care services','Found a better alternative','Privacy concerns','Too expensive','Technical issues','Other']

  const handleExport = async () => {
    if (exporting) return
    setExporting(true)
    try {
      const data = await exportMyAccountData()
      triggerDownload(`readypal-data-export-${Date.now()}.json`, JSON.stringify(data, null, 2), 'application/json')
      onToast('Your data export has downloaded')
    } catch (err) {
      onToast(err instanceof Error ? err.message : "Couldn't export your data.", 'error')
    } finally {
      setExporting(false)
    }
  }

  // Second, final confirmation gate — re-verifies the password against
  // Supabase Auth before anything is flagged, then marks the profile
  // deleted and signs the session out everywhere.
  const handleFinalConfirm = async () => {
    if (deleting) return
    setDeleting(true)
    setDeleteError('')
    try {
      if (!profile.email) throw new Error("We couldn't verify your account email. Please refresh and try again.")
      const { error: authError } = await supabase.auth.signInWithPassword({ email: profile.email, password })
      if (authError) throw new Error('Incorrect password.')
      await logUserActivity('account_deletion_requested', reason ? `Reason: ${reason}` : undefined)
      await requestAccountDeletion()
      await supabase.auth.signOut()
      navigate('/', { replace: true })
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Couldn't delete your account. Please try again.")
      setDeleting(false)
    }
  }

  return (
    <Page>
      <SectionHeader title="Delete Account" desc="Permanently remove your ReadyPal account and all associated data." />

      {/* Warning */}
      <Card style={{ padding:22, border:`1.5px solid ${C.error}30`, background:`${C.error}04` }}>
        <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
          <div style={{ width:40, height:40, borderRadius:13, background:`${C.error}10`, display:'flex', alignItems:'center', justifyContent:'center', color:C.error, flexShrink:0 }}>
            <span style={{ display:'flex', transform:'scale(1.2)' }}>{I.warning}</span>
          </div>
          <div>
            <p style={{ fontSize:13, fontWeight:800, color:C.error, marginBottom:6 }}>This action is permanent and cannot be undone.</p>
            {['All your care history and bookings will be deleted','All payment records and invoices will be removed','All reviews and feedback will be permanently erased','You will lose access to ReadyPal immediately'].map((c,i)=>(
              <div key={i} style={{ display:'flex', gap:7, alignItems:'center', marginBottom:4 }}>
                <div style={{ width:5, height:5, borderRadius:'50%', background:C.error, flexShrink:0 }} />
                <p style={{ fontSize:12, color:C.sub }}>{c}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Step 1: Reason */}
      {step>=1&&(
        <Card style={{ padding:22 }}>
          <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:14 }}>
            <div style={{ width:24, height:24, borderRadius:'50%', background:step>1?C.error:C.bg, border:`2px solid ${step>=1?C.error:C.border}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
              {step>1?<span style={{color:'#fff',display:'flex',transform:'scale(0.7)'}}>{I.check}</span>:<p style={{fontSize:11,fontWeight:800,color:C.error}}>1</p>}
            </div>
            <p style={{ fontSize:13, fontWeight:800, color:C.type }}>Tell us why you're leaving</p>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
            {reasons.map(r=>(
              <button key={r} onClick={()=>setReason(r)} disabled={step>1} style={{ padding:'9px 14px', borderRadius:10, border:`1.5px solid ${reason===r?C.error:C.border}`, background:reason===r?`${C.error}05`:'transparent', cursor:step>1?'default':'pointer', fontSize:13, fontWeight:600, color:reason===r?C.error:C.type, fontFamily:'Manrope,sans-serif', textAlign:'left' as const, display:'flex', gap:8, alignItems:'center' }}>
                <div style={{ width:16, height:16, borderRadius:'50%', border:`2px solid ${reason===r?C.error:C.border}`, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>{reason===r&&<div style={{width:8,height:8,borderRadius:'50%',background:C.error}}/>}</div>
                {r}
              </button>
            ))}
          </div>
          {step===1&&<div style={{ marginTop:14 }}><Btn label="Continue" variant="danger" disabled={!reason} onClick={()=>setStep(2)} /></div>}
        </Card>
      )}

      {/* Step 2: Export data */}
      {step>=2&&(
        <Card style={{ padding:22 }}>
          <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:14 }}>
            <div style={{ width:24, height:24, borderRadius:'50%', background:step>2?C.error:C.bg, border:`2px solid ${step>=2?C.error:C.border}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
              {step>2?<span style={{color:'#fff',display:'flex',transform:'scale(0.7)'}}>{I.check}</span>:<p style={{fontSize:11,fontWeight:800,color:C.error}}>2</p>}
            </div>
            <p style={{ fontSize:13, fontWeight:800, color:C.type }}>Export your data (optional)</p>
          </div>
          <p style={{ fontSize:13, color:C.muted, lineHeight:1.65, marginBottom:14 }}>Before you go, you can download a complete copy of your data including care history, invoices, and receipts.</p>
          {step===2&&(
            <div style={{ display:'flex', gap:10 }}>
              <Btn label={exporting?'Preparing…':'Download My Data'} variant="secondary" icon={I.download} disabled={exporting} onClick={handleExport} />
              <Btn label="Skip" variant="ghost" onClick={()=>setStep(3)} />
            </div>
          )}
        </Card>
      )}

      {/* Step 3: Confirm */}
      {step>=3&&(
        <Card style={{ padding:22, border:`1.5px solid ${C.error}40` }}>
          <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:14 }}>
            <div style={{ width:24, height:24, borderRadius:'50%', background:C.error, border:`2px solid ${C.error}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <p style={{fontSize:11,fontWeight:800,color:'#fff'}}>3</p>
            </div>
            <p style={{ fontSize:13, fontWeight:800, color:C.error }}>Confirm deletion</p>
          </div>
          <p style={{ fontSize:12, fontWeight:700, color:C.muted, marginBottom:8 }}>Enter your password to confirm</p>
          <div style={{ position:'relative', marginBottom:14 }}>
            <input type={showPw?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your current password" style={{ width:'100%', padding:'10px 40px 10px 14px', borderRadius:10, border:`1.5px solid ${C.error}60`, fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, outline:'none', background:`${C.error}04`, boxSizing:'border-box' as const }} />
            <button onClick={()=>setShowPw(v=>!v)} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:C.muted, display:'flex' }}>{showPw?I.eyeOff:I.eye}</button>
          </div>
          <Btn label="Permanently Delete My Account" variant="danger" disabled={password.length<6} onClick={()=>{ setDeleteError(''); setConfirming(true) }} />
        </Card>
      )}

      {/* Final double-confirmation modal — the actual irreversible trigger */}
      {confirming && (
        <div style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div onClick={()=>{ if(!deleting){ setConfirming(false) } }} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.4)' }} />
          <Card style={{ position:'relative', zIndex:1, padding:28, maxWidth:420, width:'100%', border:`1.5px solid ${C.error}40` }}>
            <div style={{ width:48,height:48,borderRadius:'50%',background:`${C.error}10`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px',color:C.error }}>{I.warning}</div>
            <h3 style={{ fontSize:16,fontWeight:900,color:C.error,textAlign:'center',marginBottom:8,fontFamily:'Manrope,sans-serif' }}>Are you absolutely sure?</h3>
            <p style={{ fontSize:13,color:C.muted,textAlign:'center',marginBottom:20,lineHeight:1.6 }}>This is your final confirmation. Your account will be marked for deletion and you'll be signed out immediately. This cannot be undone from the app.</p>
            {deleteError && <p style={{ fontSize:12, color:C.error, textAlign:'center', marginBottom:14 }}>{deleteError}</p>}
            <div style={{ display:'flex', gap:10 }}>
              <Btn label="Cancel" variant="secondary" onClick={()=>setConfirming(false)} disabled={deleting} />
              <Btn label={deleting?'Deleting…':'Yes, Delete My Account'} variant="danger" onClick={handleFinalConfirm} disabled={deleting} />
            </div>
          </Card>
        </div>
      )}
    </Page>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// ROOT
// ──────────────────────────────────────────────────────────────────────────────
export default function AccountSettings({ embedded = false, onProfileUpdated }: { embedded?: boolean; onProfileUpdated?: (fields: Record<string, any>) => void } = {}) {
  const navigate = useNavigate()
  const [section, setSection] = useState<Section>('home')
  const [toast, setToast] = useState<{msg:string; kind:'success'|'error'}|null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [profileError, setProfileError] = useState('')
  const [profileLoading, setProfileLoading] = useState(true)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState('')

  const loadProfile = () => {
    setProfileLoading(true)
    setProfileError('')
    getCurrentProfile()
      .then(setProfile)
      .catch(err => {
        console.error('Failed to load profile:', err)
        setProfileError(err instanceof Error ? err.message : "Couldn't load your account. Please try again.")
      })
      .finally(() => setProfileLoading(false))
  }

  useEffect(() => { loadProfile() }, [])

  // Re-apply persisted appearance/accessibility <html> classes whenever
  // Account Settings mounts — not just when the user is on those specific
  // tabs — so a fresh page load reflects prior preferences right away.
  useEffect(() => {
    applyTheme(readLocalPref<'light'|'dark'|'system'>('rp_theme', 'light'))
    setRootClass('rp-density-compact', readLocalPref<'comfortable'|'compact'>('rp_density', 'comfortable') === 'compact')
    const fontSize = readLocalPref<'sm'|'md'|'lg'>('rp_font_size', 'md')
    setRootClass('rp-font-sm', fontSize === 'sm')
    setRootClass('rp-font-lg', fontSize === 'lg')
    setRootClass('rp-high-contrast', readLocalPref<'normal'|'high'>('rp_contrast', 'normal') === 'high')
    const a11y = readLocalPref('rp_a11y_toggles', { motion:false, screenReader:false, keyboard:true, colorBlind:false, largeTargets:false })
    setRootClass('rp-reduced-motion', a11y.motion)
    setRootClass('rp-keyboard-nav', a11y.keyboard)
    setRootClass('rp-colorblind', a11y.colorBlind)
    setRootClass('rp-large-targets', a11y.largeTargets)
  }, [])

  // Best-effort, once per browser tab session: real sign-in logs aren't
  // readable via the client SDK, so this records the closest honest proxy —
  // this session being active — for Login History / Devices / Activity Log.
  useEffect(() => {
    if (!profile) return
    if (sessionStorage.getItem('rp_login_logged')) return
    sessionStorage.setItem('rp_login_logged', '1')
    logUserActivity('login', 'Session started', { userAgent: navigator.userAgent })
  }, [profile])

  const showToast = (msg:string, kind:'success'|'error'='success') => {
    setToast({ msg, kind })
    setTimeout(()=>setToast(null), 2800)
  }

  const handleLogout = async () => {
    if (loggingOut) return
    setLoggingOut(true)
    setLogoutError('')
    const { error } = await supabase.auth.signOut()
    if (error) {
      setLoggingOut(false)
      setLogoutError(error.message || "Couldn't log out. Please try again.")
      return
    }
    // Replace history so the authenticated dashboard/settings can't be
    // reached again via the browser's Back button after logging out.
    navigate('/auth?mode=login', { replace: true })
  }

  // Writes to the `profiles` row; when the email itself changes, the actual
  // Supabase Auth login email must be updated too (this triggers Supabase's
  // own confirmation-link email to the new address).
  const save = async (fields: Record<string, any>) => {
    try {
      await updateProfile(fields)
      if (fields.email) {
        const { error } = await supabase.auth.updateUser({ email: fields.email })
        if (error) throw error
      }
      setProfile((p: any) => ({ ...p, ...fields }))
      onProfileUpdated?.(fields)
      showToast(fields.email ? 'Saved — check your new email to confirm the change' : 'Saved')
      logUserActivity('profile_updated', `Updated: ${Object.keys(fields).join(', ')}`)
    } catch (err) {
      console.error('Failed to update profile:', err)
      showToast(err instanceof Error ? err.message : "Couldn't save changes. Please try again.", 'error')
      throw err
    }
  }

  const handleExportData = async () => {
    try {
      const data = await exportMyAccountData()
      triggerDownload(`readypal-data-export-${Date.now()}.json`, JSON.stringify(data, null, 2), 'application/json')
      logUserActivity('data_exported', 'Downloaded account data (JSON)')
      showToast('Your data export has downloaded')
    } catch (err) {
      console.error('Failed to export data:', err)
      showToast(err instanceof Error ? err.message : "Couldn't export your data. Please try again.", 'error')
    }
  }

  const handleUploadAvatar = async (file: File) => {
    if (uploadingAvatar) return
    setUploadingAvatar(true)
    try {
      const { avatarUrl } = await uploadProfilePhoto(file)
      setProfile((p: any) => ({ ...p, avatar_url: avatarUrl }))
      onProfileUpdated?.({ avatar_url: avatarUrl })
      showToast('Profile photo updated')
    } catch (err) {
      console.error('Failed to upload avatar:', err)
      showToast(err instanceof Error ? err.message : "Couldn't upload your photo. Please try again.", 'error')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const groups = [...new Set(NAV_ITEMS.map(n=>n.group))]

  if (profileLoading) return <p style={{ padding: 40, color:C.muted, fontFamily:'Manrope,sans-serif' }}>Loading your account…</p>

  if (profileError || !profile) {
    return (
      <div style={{ padding: 40, display:'flex', flexDirection:'column', gap:12, alignItems:'flex-start', fontFamily:'Manrope,sans-serif' }}>
        <p style={{ color:C.error, fontSize:14 }}>{profileError || "Couldn't load your account."}</p>
        <Btn label="Retry" variant="secondary" small icon={I.refresh} onClick={loadProfile} />
      </div>
    )
  }

  const renderSection = () => {
    switch(section) {
      case 'home':          return <AccountHome profile={profile} onNav={s=>setSection(s)} />
      case 'profile':       return <Profile profile={profile} onSave={save} onUploadAvatar={handleUploadAvatar} uploadingAvatar={uploadingAvatar} />
      case 'personal':      return <PersonalInfo profile={profile} onSave={save} />
      case 'contact':       return <ContactInfo profile={profile} onSave={save} />
      case 'security':      return <Security profile={profile} onSave={save} onToast={showToast} />
      case 'loginHistory':  return <LoginHistory onToast={showToast} />
      case 'devices':       return <Devices onToast={showToast} />
      case 'linkedAccounts':return <LinkedAccounts onToast={showToast} />
      case 'notifications': return <NotificationSettings profile={profile} onSave={save} />
      case 'privacy':       return <Privacy profile={profile} onSave={save} onExportData={handleExportData} />
      case 'accessibility': return <Accessibility onToast={showToast} />
      case 'language':      return <LanguageRegion profile={profile} onSave={save} />
      case 'appearance':    return <Appearance onToast={showToast} />
      case 'downloads':     return <Downloads onToast={showToast} />
      case 'activity':      return <ActivityLog />
      case 'support':       return <Support onToast={showToast} />
      case 'deleteAccount': return <DeleteAccount profile={profile} onToast={showToast} />
      default:              return <AccountHome profile={profile} onNav={s=>setSection(s)} />
    }
  }

  return (
    <div style={{ display:'flex', minHeight: embedded ? undefined : '100vh', background:C.bg, fontFamily:'Manrope,sans-serif' }}>

      {/* Sidebar */}
      <div className="as-sidebar" style={{ width:232, background:C.surface, borderRight:`1px solid ${C.border}`, display:'flex', flexDirection:'column', position: embedded ? 'relative' : 'sticky', top: embedded ? undefined : 0, height: embedded ? 'auto' : '100vh', overflowY: embedded ? 'visible' : 'auto', flexShrink:0 }}>
        <div style={{ padding:'20px 20px 10px' }}>
          <p style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:'uppercase', letterSpacing:'0.08em' }}>Account & Settings</p>
        </div>
        {groups.map(group=>(
          <div key={group} style={{ marginBottom:4 }}>
            <p style={{ fontSize:10, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.09em', padding:'8px 20px 4px' }}>{group}</p>
            {NAV_ITEMS.filter(n=>n.group===group).map(n=>{
              const active = section===n.key
              const isDanger = n.key==='deleteAccount'
              return (
                <button key={n.key} onClick={()=>{ setSection(n.key); setSidebarOpen(false) }}
                  style={{ width:'100%', display:'flex', gap:10, alignItems:'center', padding:'9px 20px', border:'none', background:active?`${isDanger?C.error:C.primary}08`:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:active?700:500, color:active?(isDanger?C.error:C.primary):isDanger?C.error:C.type, textAlign:'left' as const, borderRight:active?`3px solid ${isDanger?C.error:C.primary}`:'3px solid transparent', transition:'all 0.12s' }}>
                  <span style={{ display:'flex', color:active?(isDanger?C.error:C.primary):isDanger?C.error:C.muted, flexShrink:0 }}>{n.icon}</span>
                  {n.label}
                </button>
              )
            })}
          </div>
        ))}

        {/* Log out */}
        <div style={{ marginTop:'auto', padding:'12px 20px 20px', borderTop:`1px solid ${C.border}` }}>
          {logoutError && <p style={{ fontSize:11, color:C.error, marginBottom:8, fontFamily:'Manrope,sans-serif' }}>{logoutError}</p>}
          <button onClick={handleLogout} disabled={loggingOut}
            style={{ width:'100%', display:'flex', gap:10, alignItems:'center', justifyContent:'center', padding:'10px 12px', borderRadius:10, border:`1.5px solid ${C.error}30`, background:`${C.error}06`, cursor:loggingOut?'not-allowed':'pointer', fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:700, color:C.error, opacity:loggingOut?0.7:1, transition:'all 0.15s' }}>
            <span style={{ display:'flex', flexShrink:0 }}>{I.logout}</span>
            {loggingOut ? 'Logging out…' : 'Log Out'}
          </button>
        </div>
      </div>

      {/* Mobile top nav */}
      <div className="as-mobile-nav" style={{ display:'none', position:'fixed', top:0, left:0, right:0, zIndex:50, background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'12px 20px', alignItems:'center', justifyContent:'space-between' }}>
        <p style={{ fontSize:13, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{NAV_ITEMS.find(n=>n.key===section)?.label??'Settings'}</p>
        <button onClick={()=>setSidebarOpen(v=>!v)} style={{ background:'none', border:'none', cursor:'pointer', color:C.type, display:'flex', gap:4, alignItems:'center', fontSize:12, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>
          Menu {I.chevR}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen&&(
        <div style={{ position:'fixed', inset:0, zIndex:40, background:'rgba(0,0,0,0.35)' }} onClick={()=>setSidebarOpen(false)}>
          <div onClick={e=>e.stopPropagation()} style={{ width:260, height:'100%', background:C.surface, overflowY:'auto', paddingTop:60 }}>
            {groups.map(group=>(
              <div key={group} style={{ marginBottom:4 }}>
                <p style={{ fontSize:10, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.09em', padding:'8px 20px 4px' }}>{group}</p>
                {NAV_ITEMS.filter(n=>n.group===group).map(n=>(
                  <button key={n.key} onClick={()=>{ setSection(n.key); setSidebarOpen(false) }}
                    style={{ width:'100%', display:'flex', gap:10, alignItems:'center', padding:'10px 20px', border:'none', background:section===n.key?`${C.primary}08`:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:section===n.key?700:500, color:section===n.key?C.primary:C.type, textAlign:'left' as const }}>
                    <span style={{ display:'flex', color:section===n.key?C.primary:C.muted }}>{n.icon}</span>{n.label}
                  </button>
                ))}
              </div>
            ))}

            {/* Log out */}
            <div style={{ padding:'12px 20px 20px', borderTop:`1px solid ${C.border}`, marginTop:8 }}>
              {logoutError && <p style={{ fontSize:11, color:C.error, marginBottom:8, fontFamily:'Manrope,sans-serif' }}>{logoutError}</p>}
              <button onClick={handleLogout} disabled={loggingOut}
                style={{ width:'100%', display:'flex', gap:10, alignItems:'center', justifyContent:'center', padding:'10px 12px', borderRadius:10, border:`1.5px solid ${C.error}30`, background:`${C.error}06`, cursor:loggingOut?'not-allowed':'pointer', fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:700, color:C.error, opacity:loggingOut?0.7:1, transition:'all 0.15s' }}>
                <span style={{ display:'flex', flexShrink:0 }}>{I.logout}</span>
                {loggingOut ? 'Logging out…' : 'Log Out'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div style={{ flex:1, overflowY: embedded ? 'visible' : 'auto' }} className="as-main">
        {renderSection()}
      </div>

      {toast && <SuccessToast msg={toast.msg} kind={toast.kind} />}
    </div>
  )
}
