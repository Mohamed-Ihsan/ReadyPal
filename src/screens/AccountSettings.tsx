import { getCurrentProfile, updateProfile } from '../lib/api'
import { useState, useEffect, type ReactNode, type CSSProperties } from 'react'

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

function Field({ label, value, type='text', onSave, hint, verified=false }: { label:string; value:string; type?:string; onSave?:(v:string)=>void; hint?:string; verified?:boolean }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(value)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    onSave?.(val)
    setEditing(false)
    setSaved(true)
    setTimeout(()=>setSaved(false), 2000)
  }

  return (
    <div style={{ padding:'14px 0', borderBottom:`1px solid ${C.border}` }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:editing?10:4 }}>
        <p style={{ fontSize:12, fontWeight:700, color:C.muted }}>{label}</p>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          {verified && <span style={{ display:'inline-flex', alignItems:'center', gap:3, fontSize:11, fontWeight:700, color:C.success, padding:'2px 8px', borderRadius:99, background:`${C.success}10` }}><span style={{display:'flex',transform:'scale(0.85)'}}>{I.check}</span>Verified</span>}
          {saved && <span style={{ fontSize:11, fontWeight:700, color:C.success }}>Saved ✓</span>}
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

function SuccessToast({ msg }:{ msg:string }) {
  return (
    <div style={{ position:'fixed', bottom:28, left:'50%', transform:'translateX(-50%)', zIndex:999, display:'flex', alignItems:'center', gap:10, padding:'12px 22px', borderRadius:14, background:C.type, color:'#fff', fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:700, boxShadow:'0 8px 28px rgba(0,0,0,0.22)', pointerEvents:'none' }}>
      <span style={{ display:'flex', color:C.success }}>{I.check}</span>{msg}
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
  return <div style={{ padding:'28px 32px 60px', display:'flex', flexDirection:'column', gap:24, maxWidth:760, ...style }}>{children}</div>
}

// ──────────────────────────────────────────────────────────────────────────────
// ACCOUNT HOME
// ──────────────────────────────────────────────────────────────────────────────
function AccountHome({ onNav }: { onNav:(s:Section)=>void }) {
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
          <div style={{ width:80, height:80, borderRadius:'50%', background:`${C.primary}18`, border:`4px solid ${C.surface}`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:28, color:C.primary, fontFamily:'Manrope,sans-serif', marginTop:-40, marginBottom:12 }}>MI</div>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
            <div>
              <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Mohamed Ihsan</h2>
                <Bdg label="Verified" color={C.success} />
                <Bdg label="Member" color={C.primary} />
              </div>
              <p style={{ fontSize:13, color:C.muted }}>ihsan.m@gmail.com · Sri Lanka · Member since Jan 2024</p>
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
            <Bdg label="2 active" color={C.primary} />
          </div>
          {[{l:'MacBook Pro · Chrome',ic:I.device},{l:'iPhone 14 · Safari',ic:I.phone}].map((d,i)=>(
            <div key={i} style={{ display:'flex', gap:9, alignItems:'center', padding:'7px 0' }}>
              <span style={{ color:C.primary, display:'flex' }}>{d.ic}</span>
              <p style={{ fontSize:12, color:C.type, flex:1 }}>{d.l}</p>
              {i===0&&<Bdg label="Current" color={C.success} />}
            </div>
          ))}
          <button onClick={()=>onNav('devices')} style={{ marginTop:8, fontSize:12, fontWeight:700, color:C.primary, background:'none', border:'none', cursor:'pointer', fontFamily:'Manrope,sans-serif' }}>Manage devices →</button>
        </Card>

        <Card style={{ padding:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
            <h3 style={{ fontSize:13, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>Notification Summary</h3>
          </div>
          {[{l:'Care Updates',on:true},{l:'Payment Alerts',on:true},{l:'Messages',on:true},{l:'Marketing',on:false}].map((n,i)=>(
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'5px 0' }}>
              <p style={{ fontSize:12, color:C.type }}>{n.l}</p>
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
function Profile({ profile, onSave }: { profile:any; onSave:(f:Record<string,any>)=>void }) {
  return (
    <Page>
      <SectionHeader title="Profile" desc="Your public-facing identity on ReadyPal." />
      <Card style={{ padding:0, overflow:'hidden' }}>
        <div style={{ height:120, background:`linear-gradient(135deg,${C.primary},#00959E)`, position:'relative', cursor:'pointer' }}>
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0)', transition:'background 0.2s' }} onMouseOver={e=>{(e.currentTarget as HTMLElement).style.background='rgba(0,0,0,0.18)'}} onMouseOut={e=>{(e.currentTarget as HTMLElement).style.background='rgba(0,0,0,0)'}}>
            <span style={{ color:'rgba(255,255,255,0.75)', display:'flex', transform:'scale(1.4)' }}>{I.camera}</span>
          </div>
          <p style={{ position:'absolute', bottom:8, right:12, fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.6)' }}>Click to change cover</p>
        </div>
        <div style={{ padding:'0 28px 28px', position:'relative' }}>
          <div style={{ position:'relative', width:88, marginTop:-44, marginBottom:16, display:'inline-block' }}>
            <div style={{ width:88, height:88, borderRadius:'50%', background:`${C.primary}18`, border:`4px solid #fff`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:30, color:C.primary, fontFamily:'Manrope,sans-serif', boxShadow:'0 4px 16px rgba(44,62,67,0.14)' }}>
              {(profile.full_name || '?').split(' ').map((n:string)=>n[0]).join('').slice(0,2).toUpperCase()}
            </div>
            <button style={{ position:'absolute', bottom:2, right:2, width:26, height:26, borderRadius:'50%', background:C.primary, border:`2px solid #fff`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#fff' }}>
              <span style={{ display:'flex', transform:'scale(0.75)' }}>{I.camera}</span>
            </button>
          </div>
          <Field label="Full Name"       value={profile.full_name || ''}     onSave={v=>onSave({full_name:v})} />
          <Field label="Preferred Name"  value={profile.preferred_name || ''} onSave={v=>onSave({preferred_name:v})} />
          <Field label="Email Address"   value={profile.email || ''}          verified onSave={v=>onSave({email:v})} />
          <Field label="Phone Number"    value={profile.phone || ''}          verified onSave={v=>onSave({phone:v})} />
          <Field label="Country"         value={profile.nationality || ''}    onSave={v=>onSave({nationality:v})} />
          <div style={{ padding:'14px 0' }}>
            <p style={{ fontSize:12, fontWeight:700, color:C.muted, marginBottom:4 }}>Member Since</p>
            <p style={{ fontSize:14, color:C.type }}>{profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-US',{month:'long',year:'numeric'}) : '—'}</p>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center', marginTop:4 }}>
            <Bdg label="Verified Account" color={C.success} />
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
function Security({ onToast }: { onToast:(m:string)=>void }) {
  const [show, setShow] = useState(false)
  const [tfa, setTfa] = useState(false)
  const [loginAlerts, setLoginAlerts] = useState(true)

  const strength = 82
  const strengthColor = strength>=80?C.success:strength>=50?C.warning:C.error
  const strengthLabel = strength>=80?'Strong':strength>=50?'Fair':'Weak'

  return (
    <Page>
      <SectionHeader title="Security" desc="Keep your account safe and in your control." />

      {/* Password */}
      <Card style={{ padding:24 }}>
        <h3 style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:16 }}>Password</h3>
        <div style={{ display:'flex', gap:10, marginBottom:12 }}>
          <div style={{ flex:1, position:'relative' }}>
            <input type={show?'text':'password'} value="••••••••••••" readOnly style={{ width:'100%', padding:'10px 40px 10px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:14, color:C.type, background:'#FAFAFA', boxSizing:'border-box' as const, outline:'none' }} />
            <button onClick={()=>setShow(v=>!v)} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:C.muted, display:'flex' }}>{show?I.eyeOff:I.eye}</button>
          </div>
          <Btn label="Change" variant="secondary" small onClick={()=>onToast('Password updated successfully')} />
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
          <div style={{ flex:1, height:6, borderRadius:99, background:C.bg, overflow:'hidden' }}>
            <div style={{ width:`${strength}%`, height:'100%', background:strengthColor, borderRadius:99, transition:'width 0.4s' }} />
          </div>
          <p style={{ fontSize:12, fontWeight:700, color:strengthColor, minWidth:40 }}>{strengthLabel}</p>
        </div>
        <p style={{ fontSize:11, color:C.muted }}>Last changed 2 hours ago</p>
      </Card>

      {/* 2FA */}
      <Card style={{ padding:24 }}>
        <h3 style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:16 }}>Two-Factor Authentication</h3>
        {[
          { label:'Authenticator App', desc:'Use Google Authenticator or Authy', icon:I.key, enabled:tfa, onToggle:()=>{ setTfa(v=>!v); onToast(tfa?'Authenticator app removed':'Authenticator app enabled') } },
          { label:'SMS Verification',  desc:'+94 77 123 4567', icon:I.phone, enabled:true, onToggle:()=>onToast('SMS 2FA updated') },
          { label:'Email Verification',desc:'ihsan.m@gmail.com', icon:I.mail, enabled:true, onToggle:()=>{} },
          { label:'Biometric (coming soon)', desc:'Face ID / Fingerprint placeholder', icon:I.lock, enabled:false, disabled:true, onToggle:()=>{} },
        ].map(m=>(
          <div key={m.label} style={{ display:'flex', gap:14, alignItems:'center', padding:'12px 0', borderBottom:`1px solid ${C.border}` }}>
            <div style={{ width:40, height:40, borderRadius:13, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary, flexShrink:0 }}>
              <span style={{ display:'flex' }}>{m.icon}</span>
            </div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:13, fontWeight:700, color:(m as any).disabled?C.muted:C.type }}>{m.label}</p>
              <p style={{ fontSize:11, color:C.muted }}>{m.desc}</p>
            </div>
            <Toggle on={(m as any).disabled?false:m.enabled} onToggle={(m as any).disabled?()=>{}:m.onToggle} />
          </div>
        ))}
      </Card>

      {/* Recovery + Alerts */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }} className="as-2col">
        <Card style={{ padding:22 }}>
          <h3 style={{ fontSize:13, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:12 }}>Recovery Codes</h3>
          <p style={{ fontSize:12, color:C.muted, marginBottom:14, lineHeight:1.6 }}>Store these codes safely. Each can be used once to recover your account if you lose 2FA access.</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:14 }}>
            {['A1B2-C3D4','E5F6-G7H8','I9J0-K1L2','M3N4-O5P6'].map(c=>(
              <div key={c} style={{ padding:'7px 10px', borderRadius:8, background:C.bg, border:`1px solid ${C.border}`, fontFamily:'monospace', fontSize:12, fontWeight:700, color:C.type, textAlign:'center' as const }}>{c}</div>
            ))}
          </div>
          <Btn label="Generate New Codes" variant="secondary" small icon={I.refresh} onClick={()=>onToast('New recovery codes generated')} />
        </Card>
        <Card style={{ padding:22 }}>
          <h3 style={{ fontSize:13, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:12 }}>Login Alerts</h3>
          <p style={{ fontSize:12, color:C.muted, marginBottom:14, lineHeight:1.6 }}>Get notified when a new device signs into your account from an unrecognised location.</p>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <p style={{ fontSize:13, fontWeight:600, color:C.type }}>Email & SMS alerts</p>
            <Toggle on={loginAlerts} onToggle={()=>{ setLoginAlerts(v=>!v); onToast('Login alert preference saved') }} />
          </div>
        </Card>
      </div>
    </Page>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// LOGIN HISTORY
// ──────────────────────────────────────────────────────────────────────────────
function LoginHistory({ onToast }: { onToast:(m:string)=>void }) {
  const logins = [
    { browser:'Chrome 120', device:'MacBook Pro', location:'Colombo, Sri Lanka', ip:'203.xx.xx.12', date:'14 Jan 2025 · 9:20 AM', current:true },
    { browser:'Safari 17',  device:'iPhone 14',   location:'Colombo, Sri Lanka', ip:'203.xx.xx.14', date:'13 Jan 2025 · 8:14 AM', current:false },
    { browser:'Chrome 119', device:'MacBook Pro', location:'Kandy, Sri Lanka',   ip:'110.xx.xx.55', date:'10 Jan 2025 · 11:05 AM',current:false },
    { browser:'Firefox 121',device:'Windows PC',  location:'Colombo, Sri Lanka', ip:'203.xx.xx.99', date:'5 Jan 2025 · 7:30 PM', current:false },
  ]
  return (
    <Page>
      <SectionHeader title="Login History" desc="Recent sign-in activity across all your devices." />
      <div style={{ display:'flex', justifyContent:'flex-end' }}>
        <Btn label="Logout All Other Devices" variant="danger" small icon={I.trash} onClick={()=>onToast('All other devices logged out')} />
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {logins.map((l,i)=>(
          <Card key={i} style={{ padding:20 }}>
            <div style={{ display:'flex', gap:14, alignItems:'center' }}>
              <div style={{ width:42, height:42, borderRadius:13, background:l.current?`${C.success}10`:C.bg, display:'flex', alignItems:'center', justifyContent:'center', color:l.current?C.success:C.muted, flexShrink:0 }}>
                <span style={{ display:'flex', transform:'scale(1.2)' }}>{I.device}</span>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:3 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{l.browser} · {l.device}</p>
                  {l.current && <Bdg label="Current Session" color={C.success} />}
                </div>
                <p style={{ fontSize:12, color:C.muted }}>{l.location} · {l.ip} · {l.date}</p>
              </div>
              {!l.current && <Btn label="Logout" variant="ghost" small onClick={()=>onToast('Device logged out')} />}
            </div>
          </Card>
        ))}
      </div>
    </Page>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// CONNECTED DEVICES
// ──────────────────────────────────────────────────────────────────────────────
function Devices({ onToast }: { onToast:(m:string)=>void }) {
  const [devs, setDevs] = useState([
    { name:'MacBook Pro 14"', type:'desktop', browser:'Chrome 120', last:'Just now',     current:true },
    { name:'iPhone 14 Pro',   type:'mobile',  browser:'Safari 17',  last:'13 Jan · 8:14',current:false },
  ])
  return (
    <Page>
      <SectionHeader title="Connected Devices" desc="Devices currently signed into your ReadyPal account." />
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {devs.map((d,i)=>(
          <Card key={i} style={{ padding:22 }}>
            <div style={{ display:'flex', gap:16, alignItems:'center' }}>
              <div style={{ width:52, height:52, borderRadius:16, background:d.current?`${C.primary}10`:C.bg, border:`1.5px solid ${d.current?C.primary+'30':C.border}`, display:'flex', alignItems:'center', justifyContent:'center', color:d.current?C.primary:C.muted, flexShrink:0 }}>
                <span style={{ display:'flex', transform:'scale(1.4)' }}>{d.type==='mobile'?I.phone:I.device}</span>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                  <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{d.name}</p>
                  {d.current && <Bdg label="This Device" color={C.success} />}
                </div>
                <p style={{ fontSize:12, color:C.muted }}>{d.browser} · Last active {d.last}</p>
              </div>
              {!d.current && (
                <Btn label="Remove" variant="danger" small icon={I.trash} onClick={()=>{ setDevs(p=>p.filter((_,j)=>j!==i)); onToast('Device removed') }} />
              )}
            </div>
          </Card>
        ))}
        {devs.length===0&&(
          <Card style={{ padding:'48px', textAlign:'center' as const }}>
            <p style={{ fontSize:36, marginBottom:10 }}>📱</p>
            <p style={{ fontSize:15, fontWeight:800, color:C.type, marginBottom:6, fontFamily:'Manrope,sans-serif' }}>No other devices</p>
            <p style={{ fontSize:13, color:C.muted }}>You are only signed in on this device.</p>
          </Card>
        )}
      </div>
    </Page>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// LINKED ACCOUNTS
// ──────────────────────────────────────────────────────────────────────────────
function LinkedAccounts({ onToast }: { onToast:(m:string)=>void }) {
  const [linked, setLinked] = useState({ google:true, apple:false, facebook:false, microsoft:false, linkedin:false })
  const providers = [
    { key:'google',    label:'Google',    icon:I.google,  email:'ihsan.m@gmail.com' },
    { key:'apple',     label:'Apple',     icon:I.apple,   email:null },
    { key:'facebook',  label:'Facebook',  icon:<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="#1877F2"/><path d="M10 5H9a1 1 0 0 0-1 1v1.5h2l-.3 2H8V14H6V9.5H4.5v-2H6V6a2.5 2.5 0 0 1 2.5-2.5H10V5z" fill="white"/></svg>, email:null },
    { key:'microsoft', label:'Microsoft', icon:<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6.5" height="6.5" fill="#F25022"/><rect x="8.5" y="1" width="6.5" height="6.5" fill="#7FBA00"/><rect x="1" y="8.5" width="6.5" height="6.5" fill="#00A4EF"/><rect x="8.5" y="8.5" width="6.5" height="6.5" fill="#FFB900"/></svg>, email:null },
    { key:'linkedin',  label:'LinkedIn',  icon:<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="#0A66C2"/><path d="M5 6.5v5M5 4.5v.5M8 11.5v-3a1.5 1.5 0 0 1 3 0v3M8 6.5v5" stroke="white" strokeWidth="1.2" strokeLinecap="round"/></svg>, email:null },
  ]
  return (
    <Page>
      <SectionHeader title="Linked Accounts" desc="Connect third-party accounts for faster sign-in." />
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {providers.map(p=>{
          const isLinked = linked[p.key as keyof typeof linked]
          return (
            <Card key={p.key} style={{ padding:20 }}>
              <div style={{ display:'flex', gap:14, alignItems:'center' }}>
                <div style={{ width:44, height:44, borderRadius:14, background:C.bg, border:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <span style={{ display:'flex' }}>{p.icon}</span>
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{p.label}</p>
                  <p style={{ fontSize:12, color:C.muted }}>{isLinked&&p.email?p.email:isLinked?'Connected':'Not connected'}</p>
                </div>
                <Btn
                  label={isLinked?'Disconnect':'Connect'}
                  variant={isLinked?'ghost':'secondary'}
                  small
                  onClick={()=>{ setLinked(l=>({...l,[p.key]:!isLinked})); onToast(isLinked?`${p.label} disconnected`:`${p.label} connected`) }}
                />
              </div>
            </Card>
          )
        })}
      </div>
    </Page>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS
// ──────────────────────────────────────────────────────────────────────────────
function NotificationSettings({ onToast }: { onToast:(m:string)=>void }) {
  const groups = [
    { group:'Care',      items:['Care Updates','Task Updates','Emergency Alerts'] },
    { group:'Financial', items:['Payment Alerts','Invoice Ready','Refund Updates'] },
    { group:'Social',    items:['Messages','Review Reminders','Agent Replies'] },
    { group:'Platform',  items:['Marketing & Offers','App Updates','Feature Announcements'] },
  ]

  const [prefs, setPrefs] = useState<Record<string,{push:boolean;email:boolean;sms:boolean}>>({
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
  })

  const toggle = (item:string, ch:'push'|'email'|'sms') => {
    setPrefs(p=>({...p,[item]:{...p[item],[ch]:!p[item][ch]}}))
    onToast('Notification preference saved')
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
function Privacy({ onToast }: { onToast:(m:string)=>void }) {
  const [settings, setSettings] = useState({
    profileVisible:true, activityVisible:false, reviewVisible:true,
    searchVisible:true,  dataSharing:false,     marketing:false, cookies:'essential',
  })
  const toggle = (k:keyof typeof settings) => { setSettings(p=>({...p,[k]:!p[k as keyof typeof settings]})); onToast('Privacy setting saved') }

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
            <Toggle on={settings[item.k] as boolean} onToggle={()=>toggle(item.k)} />
          </div>
        ))}
      </Card>

      {/* Cookie preferences */}
      <Card style={{ padding:22 }}>
        <h3 style={{ fontSize:13, fontWeight:800, color:C.type, marginBottom:14, fontFamily:'Manrope,sans-serif' }}>Cookie Preferences</h3>
        {[{k:'essential',l:'Essential',d:'Required for core functionality'},{k:'analytics',l:'Analytics',d:'Help us understand usage patterns'},{k:'marketing',l:'Marketing',d:'Enable personalised advertising'}].map(c=>(
          <button key={c.k} onClick={()=>{ setSettings(p=>({...p,cookies:c.k})); onToast('Cookie preference saved') }}
            style={{ width:'100%', display:'flex', gap:12, alignItems:'center', padding:'11px 12px', borderRadius:10, border:`1.5px solid ${settings.cookies===c.k?C.primary:C.border}`, background:settings.cookies===c.k?`${C.primary}06`:'transparent', cursor:'pointer', marginBottom:8, textAlign:'left' as const }}>
            <div style={{ width:18, height:18, borderRadius:'50%', border:`2px solid ${settings.cookies===c.k?C.primary:C.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              {settings.cookies===c.k&&<div style={{ width:9, height:9, borderRadius:'50%', background:C.primary }} />}
            </div>
            <div>
              <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{c.l}{c.k==='essential'&&<span style={{ fontSize:11, color:C.muted }}> (always on)</span>}</p>
              <p style={{ fontSize:11, color:C.muted }}>{c.d}</p>
            </div>
          </button>
        ))}
      </Card>

      <Btn label="Download My Data" variant="secondary" icon={I.download} onClick={()=>onToast('Data export requested — email in 24 hrs')} />
    </Page>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// ACCESSIBILITY
// ──────────────────────────────────────────────────────────────────────────────
function Accessibility({ onToast }: { onToast:(m:string)=>void }) {
  const [fontSize, setFontSize] = useState<'sm'|'md'|'lg'>('md')
  const [contrast, setContrast] = useState<'normal'|'high'>('normal')
  const [toggles, setToggles] = useState({ motion:false, screenReader:false, keyboard:true, colorBlind:false, largeTargets:false })
  const tog = (k:keyof typeof toggles) => { setToggles(p=>({...p,[k]:!p[k]})); onToast('Accessibility setting saved') }

  return (
    <Page>
      <SectionHeader title="Accessibility" desc="Make ReadyPal work the way you need it to." />
      <Card style={{ padding:22 }}>
        <h3 style={{ fontSize:13, fontWeight:800, color:C.type, marginBottom:14, fontFamily:'Manrope,sans-serif' }}>Font Size</h3>
        <div style={{ display:'flex', gap:10 }}>
          {([['sm','Small'],['md','Default'],['lg','Large']] as const).map(([k,l])=>(
            <button key={k} onClick={()=>{ setFontSize(k); onToast('Font size updated') }}
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
            <button key={k} onClick={()=>{ setContrast(k); onToast('Contrast updated') }}
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
function LanguageRegion({ onToast }: { onToast:(m:string)=>void }) {
  const selStyle = (active:boolean):CSSProperties => ({ flex:1, padding:'9px 0', borderRadius:9, border:`1.5px solid ${active?C.primary:C.border}`, background:active?`${C.primary}08`:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:active?800:500, color:active?C.primary:C.sub, textAlign:'center' as const })
  const [lang, setLang] = useState('English')
  const [currency, setCurrency] = useState('LKR')
  const [tz, setTz] = useState('Asia/Colombo')
  const [dateFmt, setDateFmt] = useState('DD/MM/YYYY')
  const [timeFmt, setTimeFmt] = useState('12h')

  return (
    <Page>
      <SectionHeader title="Language & Region" desc="Localise your ReadyPal experience." />
      {[
        { label:'Preferred Language', options:['English','Sinhala','Tamil'], val:lang, set:setLang },
        { label:'Currency', options:['LKR','USD','GBP','EUR'], val:currency, set:setCurrency },
      ].map(f=>(
        <Card key={f.label} style={{ padding:22 }}>
          <p style={{ fontSize:12, fontWeight:700, color:C.muted, marginBottom:12 }}>{f.label}</p>
          <div style={{ display:'flex', gap:8 }}>
            {f.options.map(o=><button key={o} onClick={()=>{ f.set(o); onToast('Setting saved') }} style={selStyle(f.val===o)}>{o}</button>)}
          </div>
        </Card>
      ))}
      <Card style={{ padding:'8px 24px 24px' }}>
        <Field label="Time Zone"   value={tz}       onSave={v=>{ setTz(v); onToast('Saved') }} />
        <Field label="Date Format" value={dateFmt}  onSave={v=>{ setDateFmt(v); onToast('Saved') }} hint="e.g. DD/MM/YYYY or MM-DD-YYYY" />
      </Card>
      <Card style={{ padding:22 }}>
        <p style={{ fontSize:12, fontWeight:700, color:C.muted, marginBottom:12 }}>Time Format</p>
        <div style={{ display:'flex', gap:8 }}>
          {[['12h','12-hour (1:30 PM)'],['24h','24-hour (13:30)']].map(([k,l])=>(
            <button key={k} onClick={()=>{ setTimeFmt(k); onToast('Saved') }} style={selStyle(timeFmt===k)}>{l}</button>
          ))}
        </div>
      </Card>
    </Page>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// APPEARANCE
// ──────────────────────────────────────────────────────────────────────────────
function Appearance({ onToast }: { onToast:(m:string)=>void }) {
  const [theme, setTheme] = useState<'light'|'dark'|'system'>('light')
  const [density, setDensity] = useState<'comfortable'|'compact'>('comfortable')

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
            <button key={k} onClick={()=>{ setTheme(k); onToast(`Theme set to ${l}`) }}
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
            <button key={k} onClick={()=>{ setDensity(k); onToast('Density preference saved') }}
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
function Downloads({ onToast }: { onToast:(m:string)=>void }) {
  const items = [
    { label:'Invoices',          count:5,  size:'~2.4 MB', icon:'🧾' },
    { label:'Receipts',          count:5,  size:'~1.8 MB', icon:'📄' },
    { label:'Care Reports',      count:3,  size:'~5.1 MB', icon:'📋' },
    { label:'Medical Documents', count:2,  size:'~8.3 MB', icon:'🏥' },
    { label:'Full Care History', count:12, size:'~12 MB',  icon:'📁' },
    { label:'Data Export (ZIP)', count:1,  size:'~28 MB',  icon:'📦' },
  ]
  return (
    <Page>
      <SectionHeader title="Download Center" desc="Export your ReadyPal data at any time." />
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {items.map((item,i)=>(
          <Card key={i} hover style={{ padding:20 }}>
            <div style={{ display:'flex', gap:14, alignItems:'center' }}>
              <div style={{ width:46, height:46, borderRadius:14, background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{item.icon}</div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{item.label}</p>
                <p style={{ fontSize:12, color:C.muted }}>{item.count} file{item.count!==1?'s':''} · {item.size}</p>
              </div>
              <Btn label="Download" variant="secondary" small icon={I.download} onClick={()=>onToast(`${item.label} download started`)} />
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
function ActivityLog() {
  const events = [
    { icon:'🔒', type:'Security Updated',  detail:'Two-factor authentication preference updated',   time:'14 Jan 2025 · 10:30 AM', color:C.warning },
    { icon:'✅', type:'Review Submitted',   detail:'Review for Kasun Perera — Hospital Companion',   time:'14 Jan 2025 · 9:30 AM',  color:C.success },
    { icon:'💳', type:'Payment Completed',  detail:'LKR 6,037 · Hospital Companion · INV-1047',      time:'14 Jan 2025 · 9:29 AM',  color:C.primary },
    { icon:'📱', type:'Device Added',       detail:'iPhone 14 Pro · Safari 17 · Colombo',           time:'13 Jan 2025 · 8:14 AM',  color:C.info },
    { icon:'🔑', type:'Password Changed',   detail:'Password updated from Colombo, Sri Lanka',       time:'10 Jan 2025 · 9:00 AM',  color:C.warning },
    { icon:'👤', type:'Profile Updated',    detail:'Phone number verified',                          time:'5 Jan 2025 · 3:45 PM',   color:C.primary },
    { icon:'🔐', type:'Login',              detail:'Chrome 120 · MacBook Pro · Colombo',            time:'5 Jan 2025 · 3:40 PM',   color:C.muted },
    { icon:'📝', type:'Profile Updated',    detail:'Preferred name set to "Ihsan"',                  time:'2 Jan 2025 · 11:00 AM',  color:C.primary },
  ]

  return (
    <Page>
      <SectionHeader title="Activity Log" desc="A complete timeline of account changes and events." />
      <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
        {events.map((e,i)=>(
          <div key={i} style={{ display:'flex', gap:14 }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
              <div style={{ width:38, height:38, borderRadius:12, background:`${e.color}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>{e.icon}</div>
              {i<events.length-1&&<div style={{ width:2, flex:1, background:C.border, margin:'4px 0' }} />}
            </div>
            <div style={{ paddingBottom:i<events.length-1?18:0, paddingTop:2 }}>
              <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:2 }}>{e.type}</p>
              <p style={{ fontSize:12, color:C.muted, marginBottom:2 }}>{e.detail}</p>
              <p style={{ fontSize:11, color:C.muted }}>{e.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Page>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// SUPPORT
// ──────────────────────────────────────────────────────────────────────────────
function Support({ onToast }: { onToast:(m:string)=>void }) {
  const [bugDesc, setBugDesc] = useState('')
  return (
    <Page>
      <SectionHeader title="Support" desc="We're here to help." />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14 }} className="as-2col">
        {[
          { icon:'📚', title:'Help Center',     desc:'Browse guides, tutorials and FAQs', cta:'Open Help Center' },
          { icon:'💬', title:'Live Chat',        desc:'Chat with our support team (Mon–Fri 8am–8pm)', cta:'Start Chat (Soon)', disabled:true },
          { icon:'✉️',  title:'Contact Support', desc:'Email our team — response within 24 hours', cta:'Send Email' },
          { icon:'🗺️', title:'FAQ',             desc:'Quick answers to common questions', cta:'Browse FAQs' },
        ].map((s,i)=>(
          <Card key={i} hover style={{ padding:22 }}>
            <div style={{ fontSize:28, marginBottom:10 }}>{s.icon}</div>
            <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:5 }}>{s.title}</p>
            <p style={{ fontSize:12, color:C.muted, lineHeight:1.6, marginBottom:14 }}>{s.desc}</p>
            <Btn label={s.cta} variant="secondary" small disabled={(s as any).disabled} onClick={()=>onToast(`${s.title} opened`)} />
          </Card>
        ))}
      </div>

      {/* Bug report */}
      <Card style={{ padding:22 }}>
        <h3 style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:14 }}>Report a Bug</h3>
        <textarea value={bugDesc} onChange={e=>setBugDesc(e.target.value)} rows={4} placeholder="Describe what happened, what you expected, and steps to reproduce…" style={{ width:'100%', padding:'12px 14px', borderRadius:12, border:`1.5px solid ${bugDesc?C.primary:C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, outline:'none', resize:'none' as const, background:'#FAFAFA', boxSizing:'border-box' as const, lineHeight:1.65 }} />
        <div style={{ display:'flex', gap:10, marginTop:12 }}>
          <Btn label="Submit Bug Report" variant="primary" disabled={bugDesc.length<10} onClick={()=>{ onToast('Bug report submitted — thank you!'); setBugDesc('') }} />
          <Btn label="Feature Request" variant="secondary" onClick={()=>onToast('Feature request sent!')} />
        </div>
      </Card>
    </Page>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// DELETE ACCOUNT
// ──────────────────────────────────────────────────────────────────────────────
function DeleteAccount({ onToast }: { onToast:(m:string)=>void }) {
  const [step, setStep] = useState<1|2|3>(1)
  const [reason, setReason] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)

  const reasons = ['No longer need care services','Found a better alternative','Privacy concerns','Too expensive','Technical issues','Other']

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
              <Btn label="Download My Data" variant="secondary" icon={I.download} onClick={()=>onToast('Data export requested — emailed within 24 hrs')} />
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
          <Btn label="Permanently Delete My Account" variant="danger" disabled={password.length<6} onClick={()=>onToast('Account deletion requested — confirmation email sent')} />
        </Card>
      )}
    </Page>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// ROOT
// ──────────────────────────────────────────────────────────────────────────────
export default function AccountSettings() {
  const [section, setSection] = useState<Section>('home')
  const [toast, setToast] = useState<string|null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    getCurrentProfile().then(setProfile).catch(console.error)
  }, [])

  const showToast = (msg:string) => {
    setToast(msg)
    setTimeout(()=>setToast(null), 2800)
  }

  const save = async (fields: Record<string, any>) => {
    await updateProfile(fields)
    setProfile((p: any) => ({ ...p, ...fields }))
    showToast('Saved')
  }

  const groups = [...new Set(NAV_ITEMS.map(n=>n.group))]

  if (!profile) return <p style={{ padding: 40 }}>Loading...</p>

  const renderSection = () => {
    switch(section) {
      case 'home':          return <AccountHome onNav={s=>setSection(s)} />
      case 'profile':       return <Profile profile={profile} onSave={save} />
      case 'personal':      return <PersonalInfo profile={profile} onSave={save} />
      case 'contact':       return <ContactInfo profile={profile} onSave={save} />
      case 'security':      return <Security onToast={showToast} />
      case 'loginHistory':  return <LoginHistory onToast={showToast} />
      case 'devices':       return <Devices onToast={showToast} />
      case 'linkedAccounts':return <LinkedAccounts onToast={showToast} />
      case 'notifications': return <NotificationSettings onToast={showToast} />
      case 'privacy':       return <Privacy onToast={showToast} />
      case 'accessibility': return <Accessibility onToast={showToast} />
      case 'language':      return <LanguageRegion onToast={showToast} />
      case 'appearance':    return <Appearance onToast={showToast} />
      case 'downloads':     return <Downloads onToast={showToast} />
      case 'activity':      return <ActivityLog />
      case 'support':       return <Support onToast={showToast} />
      case 'deleteAccount': return <DeleteAccount onToast={showToast} />
      default:              return <AccountHome onNav={s=>setSection(s)} />
    }
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:C.bg, fontFamily:'Manrope,sans-serif' }}>

      {/* Sidebar */}
      <div className="as-sidebar" style={{ width:232, background:C.surface, borderRight:`1px solid ${C.border}`, display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh', overflowY:'auto', flexShrink:0 }}>
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
          </div>
        </div>
      )}

      {/* Main content */}
      <div style={{ flex:1, overflowY:'auto' }} className="as-main">
        {renderSection()}
      </div>

      {toast && <SuccessToast msg={toast} />}
    </div>
  )
}
