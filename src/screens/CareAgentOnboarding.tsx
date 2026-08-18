import { useState, type ReactNode, type CSSProperties } from 'react'
import { updateMyProfile,uploadProfilePhoto } from '../lib/api'

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

function UploadBox({ label, desc, file, onUpload, status='idle' }:{ label:string; desc?:string; file?:string; onUpload:()=>void; status?:'idle'|'uploading'|'done'|'error' }) {
  const [over,setOver] = useState(false)
  const colorMap = { idle:C.border, uploading:C.info, done:C.success, error:C.error }
  const bgMap    = { idle:C.bg, uploading:`${C.info}06`, done:`${C.success}06`, error:`${C.error}04` }
  return (
    <div onMouseOver={()=>setOver(true)} onMouseOut={()=>setOver(false)}
      onClick={onUpload}
      style={{ padding:'20px', borderRadius:14, border:`2px dashed ${over&&status==='idle'?C.primary:colorMap[status]}`, background:over&&status==='idle'?`${C.primary}04`:bgMap[status], cursor:'pointer', textAlign:'center' as const, transition:'all 0.15s' }}>
      {status==='done'&&file
        ? <div style={{display:'flex',gap:10,alignItems:'center',justifyContent:'center'}}>
            <span style={{color:C.success,display:'flex'}}>{I.check}</span>
            <p style={{fontSize:13,fontWeight:700,color:C.success}}>{file}</p>
            <Bdg label="Uploaded" color={C.success} />
          </div>
        : status==='uploading'
        ? <div style={{display:'flex',gap:8,alignItems:'center',justifyContent:'center'}}>
            <div style={{width:16,height:16,borderRadius:'50%',border:`2px solid ${C.info}`,borderTopColor:'transparent',animation:'spin 0.8s linear infinite'}}/>
            <p style={{fontSize:13,fontWeight:600,color:C.info}}>Uploading…</p>
          </div>
        : status==='error'
        ? <div>
            <p style={{fontSize:13,fontWeight:700,color:C.error}}>Upload failed</p>
            <p style={{fontSize:11,color:C.muted}}>Click to retry</p>
          </div>
        : <>
            <div style={{width:40,height:40,borderRadius:13,background:`${C.primary}10`,display:'flex',alignItems:'center',justifyContent:'center',color:C.primary,margin:'0 auto 10px'}}>
              <span style={{display:'flex',transform:'scale(1.3)'}}>{I.upload}</span>
            </div>
            <p style={{fontSize:13,fontWeight:700,color:C.type,marginBottom:3}}>{label}</p>
            {desc&&<p style={{fontSize:11,color:C.muted}}>{desc}</p>}
            <p style={{fontSize:11,color:C.primary,fontWeight:700,marginTop:8}}>Click to upload or drag & drop</p>
          </>
      }
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

function SuccessToast({ msg }:{ msg:string }) {
  return (
    <div style={{ position:'fixed', bottom:28, left:'50%', transform:'translateX(-50%)', zIndex:999, display:'flex', alignItems:'center', gap:10, padding:'12px 22px', borderRadius:14, background:C.type, color:'#fff', fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:700, boxShadow:'0 8px 28px rgba(0,0,0,0.22)', pointerEvents:'none', whiteSpace:'nowrap' as const }}>
      <span style={{display:'flex',color:C.success}}>{I.check}</span>{msg}
    </div>
  )
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
  const pct = Math.round((completed.size / STEPS.length) * 100)
  return (
    <div style={{ width:240, background:C.surface, borderRight:`1px solid ${C.border}`, padding:'28px 0', display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh', overflowY:'auto', flexShrink:0 }}>
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
function OnboardingHome({ onStart }:{ onStart:()=>void }) {
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
  return (
    <div style={{ maxWidth:900, margin:'0 auto', padding:'40px 32px 80px' }}>
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

      {/* Progress indicator */}
      <Card style={{ padding:24, marginBottom:32 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14, flexWrap:'wrap' as const, gap:10 }}>
          <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>11 Steps to Get Verified</p>
          <Bdg label="0% Complete" color={C.muted} />
        </div>
        <div style={{ display:'flex', gap:4 }}>
          {STEPS.map(s=>(
            <div key={s.n} title={s.title} style={{ flex:1, height:6, borderRadius:99, background:C.bg }} />
          ))}
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:10 }}>
          <p style={{ fontSize:11, color:C.muted }}>Step 1: Personal Information</p>
          <p style={{ fontSize:11, color:C.muted }}>Step 11: Review & Submit</p>
        </div>
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

          <div style={{ marginTop:24, display:'flex', flexDirection:'column', gap:10 }}>
            <Btn label="Start Registration" onClick={onStart} />
            <Btn label="Save & Continue Later" variant="ghost" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Step wrapper ─────────────────────────────────────────────────────────────
function StepWrap({ step, total, title, desc, children, onBack, onNext, nextLabel='Save & Continue' }:{ step:number; total:number; title:string; desc:string; children:ReactNode; onBack:()=>void; onNext:()=>void; nextLabel?:string }) {
  return (
    <div style={{ flex:1, overflowY:'auto', padding:'32px 36px 80px' }}>
      <div style={{ maxWidth:680 }}>
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
          <Btn label={nextLabel} icon={I.chevR} onClick={onNext} />
        </div>
      </div>
    </div>
  )
}

// ─── Step 1: Personal Information ─────────────────────────────────────────────
function Step1({ onBack, onNext }:{ onBack:()=>void; onNext:()=>void }) {
  const [photoUrl, setPhotoUrl] = useState('')
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

  const f = (k:string) => (v:string) =>
    setForm(p => ({ ...p, [k]: v }))

  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (!file) return

    try {
      setPhotoError('')
      setPhotoUploading(true)

      const result = await uploadProfilePhoto(file)

      setPhotoUrl(result.avatarUrl)
    } catch (error) {
      console.error('Profile photo upload failed:', error)

      if (error instanceof Error) {
        setPhotoError(error.message)
      } else {
        setPhotoError('Failed to upload profile photo')
      }
    } finally {
      setPhotoUploading(false)
    }
  }

  const handleSaveAndContinue = async () => {
    try {
      setSaving(true)
      setSaveError('')

      if (!form.firstName.trim()) {
        throw new Error('First name is required')
      }

      if (!form.lastName.trim()) {
        throw new Error('Last name is required')
      }

      if (!form.nic.trim()) {
        throw new Error('NIC is required')
      }

      if (!form.dob) {
        throw new Error('Date of birth is required')
      }

      if (!form.email.trim()) {
        throw new Error('Email is required')
      }

      if (!form.phone.trim()) {
        throw new Error('Phone number is required')
      }

      if (!form.address.trim()) {
        throw new Error('Address is required')
      }

      if (!form.city.trim()) {
        throw new Error('City is required')
      }

      await updateMyProfile({
        full_name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        preferred_name: form.preferred.trim(),
        nic: form.nic.trim(),
        date_of_birth: form.dob,
        gender: form.gender,
        nationality: form.nationality,
        email: form.email.trim(),
        phone: form.phone.trim(),
        emergency_contact: form.emergency.trim(),
        address: form.address.trim(),
        province: form.province,
        district: form.district,
        city: form.city.trim(),
        postal_code: form.postal.trim()
      })

      onNext()
    } catch (error) {
      console.error('Failed to save personal information:', error)

      if (error instanceof Error) {
        setSaveError(error.message)
      } else {
        setSaveError('Failed to save personal information')
      }
    } finally {
      setSaving(false)
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
      nextLabel={saving ? 'Saving...' : 'Save & Continue'}
    >
      {/* Photo */}
      <Card style={{ padding:20, marginBottom:24 }}>
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
              border:`3px solid ${photoUrl ? C.success : C.border}`,
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
                cursor:'pointer'
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
                style={{ display:'none' }}
              />
            </label>

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
              label="Photo Uploaded"
              color={C.success}
            />
          )}
        </div>
      </Card>

      <Card style={{
        padding:'4px 20px 20px',
        marginBottom:20
      }}>
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

        {saveError && (
          <div style={{
            padding:'12px 14px',
            marginBottom:16,
            borderRadius:10,
            background:`${C.error}08`,
            border:`1px solid ${C.error}30`,
            color:C.error,
            fontSize:12,
            fontWeight:600
          }}>
            {saveError}
          </div>
        )}

        {/* Live photo placeholder */}
        <div style={{
          padding:'14px 16px',
          borderRadius:12,
          background:`${C.info}06`,
          border:`1px solid ${C.info}20`,
          display:'flex',
          gap:10,
          alignItems:'center'
        }}>
          <span
            style={{
              color:C.info,
              display:'flex'
            }}
          >
            {I.camera}
          </span>

          <div>
            <p style={{
              fontSize:12,
              fontWeight:700,
              color:C.info
            }}>
              Live Verification Photo{' '}
              <Bdg
                label="Coming Soon"
                color={C.info}
              />
            </p>

            <p style={{
              fontSize:11,
              color:C.muted
            }}>
              Real-time selfie verification will be available
              in the next update.
            </p>
          </div>
        </div>
      </Card>
    </StepWrap>
  )
}

// ─── Step 2: Professional Profile ─────────────────────────────────────────────
function Step2({ onBack, onNext }:{ onBack:()=>void; onNext:()=>void }) {
  const [form, setForm] = useState({ headline:'Experienced Home Care & Hospital Companion Specialist', bio:'I am a dedicated care professional with 8 years of experience supporting elderly patients and individuals with disabilities across Colombo. I specialise in hospital accompaniment, medication management, and post-surgery recovery care. I am fluent in English, Sinhala, and Tamil, and hold a First Aid and CPR certification.', years:'8', employment:'Sri Lanka Red Cross Society', prevEmployment:'Nawaloka Hospital · 2015–2019', edu:'Diploma in Caregiving, National Institute of Social Development', areas:'Colombo, Dehiwela, Moratuwa' })
  const f = (k:string) => (v:string) => setForm(p=>({...p,[k]:v}))
  const [langs, setLangs] = useState(['English','Sinhala','Tamil'])
  const [radius, setRadius] = useState(20)
  const [specs, setSpecs] = useState(['Hospital Companion','Medication Collection','Home Care','First Aid'])
  const allSpecs = ['Hospital Companion','Medication Collection','Home Care','Transportation Assistance','Wheelchair Assistance','Post-Surgery Care','Stroke Care','Dementia Care','First Aid','CPR','Mental Health Support','Shopping Assistance','Bill Payments']

  return (
    <StepWrap step={2} total={11} title="Professional Profile" desc="Showcase your expertise to attract the right clients." onBack={onBack} onNext={onNext}>
      <Card style={{ padding:'4px 20px 20px', marginBottom:20 }}>
        <FormSection title="Headline & Bio">
          <FormFull><Input label="Professional Headline" value={form.headline} onChange={f('headline')} hint="One sentence that sums up your expertise" required /></FormFull>
          <FormFull><Textarea label="Biography" value={form.bio} onChange={f('bio')} rows={5} hint="Write in first person. Minimum 100 characters." /></FormFull>
        </FormSection>
        <FormSection title="Experience">
          <Select label="Years of Experience" options={['Less than 1 year','1–2 years','3–5 years','5–8 years','8–10 years','10+ years']} value={form.years==='8'?'5–8 years':form.years} onChange={f('years')} />
          <Input label="Current Employer / Organisation" value={form.employment} onChange={f('employment')} hint="Hospital, clinic, or self-employed" />
          <FormFull><Input label="Previous Employment" value={form.prevEmployment} onChange={f('prevEmployment')} hint="Most recent previous employer and dates" /></FormFull>
          <FormFull><Input label="Education / Qualifications" value={form.edu} onChange={f('edu')} /></FormFull>
        </FormSection>
      </Card>

      {/* Languages */}
      <Card style={{ padding:20, marginBottom:14 }}>
        <p style={{ fontSize:12, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>Languages Spoken</p>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' as const, marginBottom:10 }}>
          {['English','Sinhala','Tamil','Hindi'].map(l=>(
            <button key={l} onClick={()=>setLangs(p=>p.includes(l)?p.filter(x=>x!==l):[...p,l])}
              style={{ padding:'7px 14px', borderRadius:99, border:`1.5px solid ${langs.includes(l)?C.primary:C.border}`, background:langs.includes(l)?`${C.primary}08`:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:langs.includes(l)?700:500, color:langs.includes(l)?C.primary:C.sub, transition:'all 0.12s' }}>
              {l}
            </button>
          ))}
        </div>
      </Card>

      {/* Specialisations */}
      <Card style={{ padding:20, marginBottom:14 }}>
        <p style={{ fontSize:12, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>Specializations</p>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' as const }}>
          {allSpecs.map(s=>(
            <button key={s} onClick={()=>setSpecs(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s])}
              style={{ padding:'7px 14px', borderRadius:99, border:`1.5px solid ${specs.includes(s)?C.primary:C.border}`, background:specs.includes(s)?`${C.primary}08`:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:specs.includes(s)?700:500, color:specs.includes(s)?C.primary:C.sub, transition:'all 0.12s' }}>
              {specs.includes(s)&&<span style={{marginRight:4}}>✓</span>}{s}
            </button>
          ))}
        </div>
      </Card>

      {/* Travel radius */}
      <Card style={{ padding:20 }}>
        <p style={{ fontSize:12, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>Preferred Working Areas & Travel Radius</p>
        <Input label="Preferred Working Areas" value={form.areas} onChange={f('areas')} hint="e.g. Colombo, Dehiwela, Moratuwa" />
        <div style={{ marginTop:16 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
            <label style={{ fontSize:12, fontWeight:700, color:C.muted }}>Maximum Travel Distance</label>
            <span style={{ fontSize:13, fontWeight:800, color:C.primary, fontFamily:'Manrope,sans-serif' }}>{radius} km</span>
          </div>
          <input type="range" min={5} max={100} step={5} value={radius} onChange={e=>setRadius(+e.target.value)} style={{ width:'100%', accentColor:C.primary, cursor:'pointer' }} />
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:4 }}>
            <p style={{fontSize:11,color:C.muted}}>5 km</p>
            <p style={{fontSize:11,color:C.muted}}>100 km</p>
          </div>
        </div>
      </Card>
    </StepWrap>
  )
}

// ─── Step 3: Skills & Services ────────────────────────────────────────────────
function Step3({ onBack, onNext }:{ onBack:()=>void; onNext:()=>void }) {
  const services = ['Hospital Companion','Medication Collection','Home Care','Transportation Assistance','Wheelchair Assistance','Post-Surgery Care','Stroke Care','Dementia Care','First Aid','CPR','Mental Health Support','Shopping Assistance','Bill Payments']
  const [selected, setSelected] = useState<Record<string,{level:string;years:string;certified:boolean}>>({
    'Hospital Companion':  {level:'Expert',   years:'8', certified:true},
    'Medication Collection':{level:'Expert',  years:'8', certified:false},
    'Home Care':           {level:'Advanced', years:'5', certified:true},
    'First Aid':           {level:'Expert',   years:'8', certified:true},
    'CPR':                 {level:'Expert',   years:'8', certified:true},
  })
  const toggle = (s:string) => {
    if(selected[s]) {
      const n = {...selected}; delete n[s]; setSelected(n)
    } else {
      setSelected(p=>({...p,[s]:{level:'Beginner',years:'1',certified:false}}))
    }
  }
  return (
    <StepWrap step={3} total={11} title="Skills & Services" desc="Select the services you offer and rate your proficiency." onBack={onBack} onNext={onNext}>
      <p style={{ fontSize:13, color:C.muted, marginBottom:20 }}>Click a service to add it, then set your experience level and certification status.</p>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap' as const, marginBottom:24 }}>
        {services.map(s=>(
          <button key={s} onClick={()=>toggle(s)}
            style={{ padding:'8px 16px', borderRadius:99, border:`1.5px solid ${selected[s]?C.primary:C.border}`, background:selected[s]?`${C.primary}08`:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:selected[s]?700:500, color:selected[s]?C.primary:C.sub, transition:'all 0.12s' }}>
            {selected[s]&&<span style={{marginRight:4}}>✓</span>}{s}
          </button>
        ))}
      </div>
      {Object.keys(selected).length>0&&(
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {Object.entries(selected).map(([svc,data])=>(
            <Card key={svc} style={{ padding:20 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{svc}</p>
                <button onClick={()=>toggle(svc)} style={{ width:26, height:26, borderRadius:'50%', border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', color:C.muted, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{display:'flex',transform:'scale(0.8)'}}>{I.close}</span>
                </button>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }} className="cao-2col">
                <Select label="Skill Level" options={['Beginner','Intermediate','Advanced','Expert']} value={data.level} onChange={v=>setSelected(p=>({...p,[svc]:{...p[svc],level:v}}))} />
                <Select label="Years of Experience" options={['Less than 1','1–2 years','3–5 years','5–8 years','8+ years']} value={data.years==='1'?'Less than 1':data.years==='8'?'8+ years':'3–5 years'} onChange={v=>setSelected(p=>({...p,[svc]:{...p[svc],years:v}}))} />
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <Toggle on={data.certified} onToggle={()=>setSelected(p=>({...p,[svc]:{...p[svc],certified:!data.certified}}))} />
                  <div>
                    <p style={{ fontSize:12, fontWeight:700, color:C.type }}>Certification Available</p>
                    <p style={{ fontSize:11, color:C.muted }}>I have a document to prove this</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      {Object.keys(selected).length===0&&(
        <Card style={{ padding:'40px 20px', textAlign:'center' as const }}>
          <p style={{ fontSize:32, marginBottom:10 }}>🩺</p>
          <p style={{ fontSize:14, fontWeight:700, color:C.type }}>No services selected yet</p>
          <p style={{ fontSize:12, color:C.muted }}>Select at least one service above to continue.</p>
        </Card>
      )}
    </StepWrap>
  )
}

// ─── Step 4: Certifications ───────────────────────────────────────────────────
function Step4({ onBack, onNext }:{ onBack:()=>void; onNext:()=>void }) {
  type UpStatus = 'idle'|'uploading'|'done'|'error'
  const [docs, setDocs] = useState<Record<string,{status:UpStatus;issued:string;expiry:string}>>({
    'Caregiving Certificate':      {status:'done',    issued:'2018-03-10', expiry:'2028-03-09'},
    'First Aid Certificate':       {status:'done',    issued:'2023-06-01', expiry:'2025-06-01'},
    'CPR Certificate':             {status:'done',    issued:'2023-06-01', expiry:'2025-06-01'},
    'Nursing Qualification':       {status:'idle',    issued:'', expiry:''},
    'Medical Training Certificate':{status:'idle',    issued:'', expiry:''},
    'Other Certification':         {status:'idle',    issued:'', expiry:''},
  })
  const upload = (k:string) => {
    setDocs(p=>({...p,[k]:{...p[k],status:'uploading'}}))
    setTimeout(()=>setDocs(p=>({...p,[k]:{...p[k],status:'done'}})),1400)
  }
  return (
    <StepWrap step={4} total={11} title="Certifications" desc="Upload your professional certifications. Supported: PDF, JPG, PNG up to 10MB." onBack={onBack} onNext={onNext}>
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        {Object.entries(docs).map(([cert,data])=>(
          <Card key={cert} style={{ padding:22 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{cert}</p>
                {data.status==='done'&&<Bdg label="Uploaded" color={C.success} />}
                {cert.includes('First Aid')||cert.includes('CPR')
                  ? <Bdg label="Expiring Soon" color={C.warning} />
                  : null
                }
              </div>
            </div>
            <UploadBox label={`Upload ${cert}`} desc="PDF, JPG or PNG · Max 10MB" file={data.status==='done'?cert+'.pdf':undefined} status={data.status} onUpload={()=>upload(cert)} />
            {data.status==='done'&&(
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:14 }} className="cao-2col">
                <Input label="Issue Date" type="date" value={data.issued} onChange={v=>setDocs(p=>({...p,[cert]:{...p[cert],issued:v}}))} />
                <Input label="Expiry Date" type="date" value={data.expiry} onChange={v=>setDocs(p=>({...p,[cert]:{...p[cert],expiry:v}}))} />
              </div>
            )}
          </Card>
        ))}
      </div>
    </StepWrap>
  )
}

// ─── Step 5: Identity Verification ───────────────────────────────────────────
function Step5({ onBack, onNext }:{ onBack:()=>void; onNext:()=>void }) {
  type UpStatus = 'idle'|'uploading'|'done'|'error'
  const [docs, setDocs] = useState<Record<string,UpStatus>>({ 'NIC Front':'done','NIC Back':'done','Police Clearance Certificate':'done','Medical Fitness Certificate':'idle','Passport (Optional)':'idle','Driving Licence (Optional)':'idle' })
  const upload = (k:string) => {
    setDocs(p=>({...p,[k]:'uploading'}))
    setTimeout(()=>setDocs(p=>({...p,[k]:'done'})),1500)
  }
  const done = Object.values(docs).filter(v=>v==='done').length
  const total = Object.keys(docs).length

  const tips = ['Ensure all text is clearly legible','Use good lighting — avoid shadows and glare','Photograph the full document with all four corners visible','Avoid blurry images — hold the camera steady']

  return (
    <StepWrap step={5} total={11} title="Identity Verification" desc="KYC verification protects clients and ensures platform integrity." onBack={onBack} onNext={onNext}>
      {/* Quality indicator */}
      <Card style={{ padding:20, marginBottom:20, background:`linear-gradient(135deg,${C.primary}06,${C.primary}02)`, border:`1px solid ${C.primary}20` }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
          <p style={{ fontSize:13, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>Document Quality Score</p>
          <span style={{ fontSize:18, fontWeight:900, color:C.success, fontFamily:'Manrope,sans-serif' }}>{Math.round((done/total)*100)}%</span>
        </div>
        <div style={{ height:8, borderRadius:99, background:'rgba(0,115,122,0.1)', overflow:'hidden' }}>
          <div style={{ width:`${(done/total)*100}%`, height:'100%', background:`linear-gradient(90deg,${C.primary},${C.success})`, borderRadius:99, transition:'width 0.5s' }} />
        </div>
        <p style={{ fontSize:11, color:C.muted, marginTop:8 }}>{done} of {total} documents uploaded</p>
      </Card>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:20 }} className="cao-2col">
        {Object.entries(docs).map(([doc,status])=>(
          <UploadBox key={doc} label={doc} desc="JPG, PNG or PDF · Max 10MB" file={status==='done'?doc+'.jpg':undefined} status={status} onUpload={()=>upload(doc)} />
        ))}
      </div>

      {/* Verification tips */}
      <Card style={{ padding:20 }}>
        <p style={{ fontSize:12, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>Verification Tips</p>
        {tips.map((tip,i)=>(
          <div key={i} style={{ display:'flex', gap:8, alignItems:'flex-start', marginBottom:8 }}>
            <div style={{ width:20, height:20, borderRadius:'50%', background:`${C.info}10`, display:'flex', alignItems:'center', justifyContent:'center', color:C.info, flexShrink:0, fontSize:11, fontWeight:800, fontFamily:'Manrope,sans-serif' }}>{i+1}</div>
            <p style={{ fontSize:12, color:C.sub, lineHeight:1.6 }}>{tip}</p>
          </div>
        ))}
        {/* Selfie placeholder */}
        <div style={{ marginTop:14, padding:'14px 16px', borderRadius:12, background:`${C.info}06`, border:`1px solid ${C.info}20`, display:'flex', gap:10, alignItems:'center' }}>
          <span style={{color:C.info,display:'flex'}}>{I.camera}</span>
          <div>
            <p style={{fontSize:12,fontWeight:700,color:C.info}}>Selfie Verification <Bdg label="Coming Soon" color={C.info} /></p>
            <p style={{fontSize:11,color:C.muted}}>Real-time liveness check will be required in future updates.</p>
          </div>
        </div>
      </Card>
    </StepWrap>
  )
}

// ─── Step 6: Banking & Payouts ────────────────────────────────────────────────
function Step6({ onBack, onNext }:{ onBack:()=>void; onNext:()=>void }) {
  const [form, setForm] = useState({ bank:'Commercial Bank of Ceylon', branch:'Colombo 03', name:'Kasun Perera', number:'12345678901', swift:'CCEYLKLX', payout:'Weekly Bank Transfer' })
  const f = (k:string) => (v:string) => setForm(p=>({...p,[k]:v}))
  const [verified, setVerified] = useState(false)
  return (
    <StepWrap step={6} total={11} title="Banking & Payouts" desc="Your earnings will be transferred to this account after each completed job." onBack={onBack} onNext={onNext}>
      <Card style={{ padding:'4px 20px 20px', marginBottom:20 }}>
        <FormSection title="Bank Details">
          <Select label="Bank Name" options={['Commercial Bank of Ceylon','Bank of Ceylon','Peoples Bank','Hatton National Bank','Sampath Bank','Nations Trust Bank','DFCC Bank','Seylan Bank']} value={form.bank} onChange={f('bank')} />
          <Input label="Branch" value={form.branch} onChange={f('branch')} />
          <Input label="Account Holder Name" value={form.name} onChange={f('name')} required hint="Must match your NIC exactly" />
          <Input label="Account Number" value={form.number} onChange={f('number')} required />
          <Input label="SWIFT / BIC Code" value={form.swift} onChange={f('swift')} hint="Required for international transfers (optional)" />
        </FormSection>
        <FormSection title="Payout Preference">
          <Select label="Preferred Payout Method" options={['Weekly Bank Transfer','Bi-weekly Bank Transfer','Monthly Bank Transfer']} value={form.payout} onChange={f('payout')} />
        </FormSection>
      </Card>

      {/* Verification status */}
      <Card style={{ padding:20, border:`1.5px solid ${verified?C.success+'40':C.border}`, background:verified?`${C.success}04`:C.surface }}>
        <div style={{ display:'flex', gap:14, alignItems:'center' }}>
          <div style={{ width:44, height:44, borderRadius:14, background:verified?`${C.success}10`:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', color:verified?C.success:C.primary, flexShrink:0 }}>
            <span style={{display:'flex',transform:'scale(1.2)'}}>{I.bank}</span>
          </div>
          <div style={{ flex:1 }}>
            <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{verified?'Bank Account Verified':'Bank Verification Pending'}</p>
            <p style={{ fontSize:12, color:C.muted }}>{verified?'Your account details have been confirmed.':'A small test deposit will be sent to verify your account.'}</p>
          </div>
          {!verified&&<Btn label="Verify Now" variant="secondary" small onClick={()=>setVerified(true)} />}
          {verified&&<Bdg label="Verified" color={C.success} />}
        </div>
      </Card>
    </StepWrap>
  )
}

// ─── Step 7: Availability ─────────────────────────────────────────────────────
function Step7({ onBack, onNext }:{ onBack:()=>void; onNext:()=>void }) {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  const [activeDays, setActiveDays] = useState(new Set(['Mon','Tue','Wed','Thu','Fri']))
  const [shift, setShift] = useState<'morning'|'afternoon'|'evening'|'night'>('morning')
  const [emergency, setEmergency] = useState(true)
  const [holiday, setHoliday] = useState(false)
  const [maxHours, setMaxHours] = useState(40)
  const [maxDist, setMaxDist] = useState(20)
  const shifts = [
    {k:'morning'  as const, l:'Morning',   t:'6 AM – 12 PM'},
    {k:'afternoon'as const, l:'Afternoon', t:'12 PM – 6 PM'},
    {k:'evening'  as const, l:'Evening',   t:'6 PM – 10 PM'},
    {k:'night'    as const, l:'Night',     t:'10 PM – 6 AM'},
  ]
  return (
    <StepWrap step={7} total={11} title="Availability" desc="Tell us when you're available so we can match you with the right clients." onBack={onBack} onNext={onNext}>
      {/* Days */}
      <Card style={{ padding:22, marginBottom:14 }}>
        <p style={{ fontSize:12, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:14 }}>Working Days</p>
        <div style={{ display:'flex', gap:8 }}>
          {days.map(d=>(
            <button key={d} onClick={()=>setActiveDays(p=>{ const n=new Set(p); n.has(d)?n.delete(d):n.add(d); return n })}
              style={{ flex:1, paddingTop:10, paddingBottom:10, borderRadius:12, border:`2px solid ${activeDays.has(d)?C.primary:C.border}`, background:activeDays.has(d)?`${C.primary}08`:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:activeDays.has(d)?800:500, color:activeDays.has(d)?C.primary:C.sub, transition:'all 0.12s' }}>
              {d}
            </button>
          ))}
        </div>
      </Card>

      {/* Shifts */}
      <Card style={{ padding:22, marginBottom:14 }}>
        <p style={{ fontSize:12, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:14 }}>Preferred Shift</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }} className="cao-2col">
          {shifts.map(s=>(
            <button key={s.k} onClick={()=>setShift(s.k)}
              style={{ padding:'14px 16px', borderRadius:13, border:`2px solid ${shift===s.k?C.primary:C.border}`, background:shift===s.k?`${C.primary}06`:'transparent', cursor:'pointer', textAlign:'left' as const }}>
              <p style={{ fontSize:13, fontWeight:800, color:shift===s.k?C.primary:C.type, marginBottom:2, fontFamily:'Manrope,sans-serif' }}>{s.l}</p>
              <p style={{ fontSize:11, color:C.muted }}>{s.t}</p>
              {shift===s.k&&<span style={{marginTop:8,display:'inline-flex',background:`${C.primary}15`,color:C.primary,padding:'2px 8px',borderRadius:99,fontSize:10,fontWeight:700}}>Selected</span>}
            </button>
          ))}
        </div>
      </Card>

      {/* Toggles + sliders */}
      <Card style={{ padding:22 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:`1px solid ${C.border}` }}>
          <div>
            <p style={{ fontSize:13, fontWeight:700, color:C.type }}>Emergency Availability</p>
            <p style={{ fontSize:11, color:C.muted }}>Available for urgent same-day requests</p>
          </div>
          <Toggle on={emergency} onToggle={()=>setEmergency(v=>!v)} />
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:`1px solid ${C.border}` }}>
          <div>
            <p style={{ fontSize:13, fontWeight:700, color:C.type }}>Holiday Availability</p>
            <p style={{ fontSize:11, color:C.muted }}>Available on Poya days and public holidays</p>
          </div>
          <Toggle on={holiday} onToggle={()=>setHoliday(v=>!v)} />
        </div>
        <div style={{ padding:'16px 0 8px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
            <p style={{ fontSize:12, fontWeight:700, color:C.muted }}>Maximum Weekly Hours</p>
            <span style={{ fontSize:13, fontWeight:800, color:C.primary, fontFamily:'Manrope,sans-serif' }}>{maxHours} hrs</span>
          </div>
          <input type="range" min={10} max={80} step={5} value={maxHours} onChange={e=>setMaxHours(+e.target.value)} style={{ width:'100%', accentColor:C.primary, cursor:'pointer' }} />
        </div>
        <div style={{ padding:'8px 0' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
            <p style={{ fontSize:12, fontWeight:700, color:C.muted }}>Maximum Travel Distance</p>
            <span style={{ fontSize:13, fontWeight:800, color:C.primary, fontFamily:'Manrope,sans-serif' }}>{maxDist} km</span>
          </div>
          <input type="range" min={5} max={100} step={5} value={maxDist} onChange={e=>setMaxDist(+e.target.value)} style={{ width:'100%', accentColor:C.primary, cursor:'pointer' }} />
        </div>
      </Card>
    </StepWrap>
  )
}

// ─── Step 8: Equipment & Transport ────────────────────────────────────────────
function Step8({ onBack, onNext }:{ onBack:()=>void; onNext:()=>void }) {
  const [toggles, setToggles] = useState({ car:false, motorbike:false, threeWheeler:false, publicTransport:true, wheelchair:false, medEquipment:false, smartphone:true, internet:true })
  const tog = (k:keyof typeof toggles) => setToggles(p=>({...p,[k]:!p[k]}))
  const items = [
    { k:'car'           as const, icon:'🚗',  l:'Car',                     d:'Own vehicle for transporting clients' },
    { k:'motorbike'     as const, icon:'🏍️', l:'Motorbike',               d:'For quick local trips' },
    { k:'threeWheeler'  as const, icon:'🛺',  l:'Three-Wheeler',           d:'Tuk-tuk for short distances' },
    { k:'publicTransport'as const,icon:'🚌', l:'Public Transport',         d:'Bus, train, or metro' },
    { k:'wheelchair'    as const, icon:'♿', l:'Wheelchair Equipment',     d:'Manual or electric wheelchair' },
    { k:'medEquipment'  as const, icon:'🩺',  l:'Medical Equipment',       d:'Blood pressure, glucose monitor, etc.' },
    { k:'smartphone'    as const, icon:'📱',  l:'Smartphone',              d:'Required for the ReadyPal app' },
    { k:'internet'      as const, icon:'📶',  l:'Internet Access',         d:'Mobile data or home broadband' },
  ]
  return (
    <StepWrap step={8} total={11} title="Equipment & Transport" desc="Let clients know how you can travel and what equipment you have available." onBack={onBack} onNext={onNext}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }} className="cao-2col">
        {items.map(item=>(
          <Card key={item.k} style={{ padding:18, border:`1.5px solid ${toggles[item.k]?C.primary+'30':C.border}`, background:toggles[item.k]?`${C.primary}04`:C.surface }}>
            <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:6 }}>
              <div style={{ width:38, height:38, borderRadius:12, background:`${C.primary}08`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{item.icon}</div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{item.l}</p>
                <p style={{ fontSize:11, color:C.muted, lineHeight:1.4 }}>{item.d}</p>
              </div>
              <Toggle on={toggles[item.k]} onToggle={()=>tog(item.k)} />
            </div>
          </Card>
        ))}
      </div>
    </StepWrap>
  )
}

// ─── Step 9: References ───────────────────────────────────────────────────────
function Step9({ onBack, onNext }:{ onBack:()=>void; onNext:()=>void }) {
  type Ref = { name:string; org:string; type:string; phone:string; email:string }
  const [refs, setRefs] = useState<Ref[]>([
    { name:'Dr. Priya Fernando', org:'Nawaloka Hospital, Colombo', type:'Doctor / Employer', phone:'+94 11 544 4444', email:'p.fernando@nawaloka.lk' },
    { name:'Nimal Jayasinghe', org:'Sri Lanka Red Cross Society', type:'Employer', phone:'+94 11 269 1095', email:'n.jayasinghe@redcross.lk' },
  ])
  const [letterStatus, setLetterStatus] = useState<'idle'|'done'>('done')
  const addRef = () => setRefs(p=>[...p,{name:'',org:'',type:'',phone:'',email:''}])
  return (
    <StepWrap step={9} total={11} title="References" desc="Provide at least two professional references who can verify your experience." onBack={onBack} onNext={onNext}>
      <div style={{ display:'flex', flexDirection:'column', gap:16, marginBottom:20 }}>
        {refs.map((r,i)=>(
          <Card key={i} style={{ padding:22 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <p style={{ fontSize:13, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>Reference {i+1}</p>
              {refs.length>1&&<button onClick={()=>setRefs(p=>p.filter((_,j)=>j!==i))} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, display:'flex' }}>{I.trash}</button>}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }} className="cao-2col">
              <Input label="Full Name" value={r.name} onChange={v=>setRefs(p=>p.map((x,j)=>j===i?{...x,name:v}:x))} required />
              <Input label="Organisation / Hospital" value={r.org} onChange={v=>setRefs(p=>p.map((x,j)=>j===i?{...x,org:v}:x))} required />
              <Select label="Relationship" options={['Employer','Hospital','Doctor','Previous Client','Colleague','Other']} value={r.type} onChange={v=>setRefs(p=>p.map((x,j)=>j===i?{...x,type:v}:x))} />
              <Input label="Phone Number" value={r.phone} onChange={v=>setRefs(p=>p.map((x,j)=>j===i?{...x,phone:v}:x))} />
              <Input label="Email Address" type="email" value={r.email} onChange={v=>setRefs(p=>p.map((x,j)=>j===i?{...x,email:v}:x))} />
            </div>
          </Card>
        ))}
      </div>
      <button onClick={addRef} style={{ width:'100%', padding:'14px', borderRadius:12, border:`2px dashed ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', gap:8, justifyContent:'center', alignItems:'center', fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:700, color:C.primary }}>
        <span style={{display:'flex'}}>{I.plus}</span>Add Another Reference
      </button>

      <Card style={{ padding:20, marginTop:16 }}>
        <p style={{ fontSize:12, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>Recommendation Letter (Optional)</p>
        <UploadBox label="Upload Recommendation Letter" desc="PDF or Word document · Max 10MB" file={letterStatus==='done'?'Recommendation_Letter.pdf':undefined} status={letterStatus==='done'?'done':'idle'} onUpload={()=>setLetterStatus('done')} />
      </Card>
    </StepWrap>
  )
}

// ─── Step 10: Agreements ──────────────────────────────────────────────────────
function Step10({ onBack, onNext }:{ onBack:()=>void; onNext:()=>void }) {
  const [agreed, setAgreed] = useState({ terms:false, privacy:false, conduct:false, care:false, background:false })
  const all = Object.values(agreed).every(Boolean)
  const toggle = (k:keyof typeof agreed) => setAgreed(p=>({...p,[k]:!p[k]}))
  const docs = [
    { k:'terms'   as const, title:'Terms & Conditions',  desc:'Governs your use of the ReadyPal platform, payment terms, and agent obligations.' },
    { k:'privacy' as const, title:'Privacy Policy',      desc:'How we collect, use, and protect your personal and professional data.' },
    { k:'conduct' as const, title:'Code of Conduct',     desc:'Professional behaviour standards expected of all ReadyPal Care Agents.' },
    { k:'care'    as const, title:'Care Standards',      desc:'Minimum quality standards for all care services delivered through ReadyPal.' },
    { k:'background'as const,title:'Background Check Consent', desc:'You consent to identity verification and police record checks.' },
  ]
  return (
    <StepWrap step={10} total={11} title="Agreements & Consent" desc="Please read and agree to all documents before submitting your application." onBack={onBack} onNext={onNext} nextLabel={all?'Save & Continue':'Agree to All First'}>
      <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:20 }}>
        {docs.map(d=>(
          <Card key={d.k} style={{ padding:20, border:`1.5px solid ${agreed[d.k]?C.success+'40':C.border}`, background:agreed[d.k]?`${C.success}04`:C.surface }}>
            <div style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
              <button onClick={()=>toggle(d.k)} style={{ width:22, height:22, borderRadius:6, background:agreed[d.k]?C.primary:'transparent', border:`2px solid ${agreed[d.k]?C.primary:C.border}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1, transition:'all 0.15s' }}>
                {agreed[d.k]&&<span style={{color:'#fff',display:'flex',transform:'scale(0.75)'}}>{I.check}</span>}
              </button>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{d.title}</p>
                  <button style={{ fontSize:11, fontWeight:700, color:C.primary, background:'none', border:'none', cursor:'pointer', fontFamily:'Manrope,sans-serif' }}>Read →</button>
                </div>
                <p style={{ fontSize:12, color:C.muted, lineHeight:1.6 }}>{d.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <button onClick={()=>setAgreed({terms:true,privacy:true,conduct:true,care:true,background:true})} style={{ width:'100%', padding:'12px', borderRadius:12, border:`1.5px solid ${all?C.success:C.border}`, background:all?`${C.success}04`:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:700, color:all?C.success:C.sub, transition:'all 0.15s', marginBottom:16 }}>
        {all?'✓ All Agreements Accepted':'Accept All Agreements'}
      </button>

      {/* Digital signature placeholder */}
      <Card style={{ padding:22, opacity:0.7 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <p style={{ fontSize:13, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>Digital Signature</p>
          <Bdg label="Coming Soon" color={C.info} />
        </div>
        <div style={{ height:80, borderRadius:12, border:`2px dashed ${C.border}`, background:C.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <p style={{ fontSize:12, color:C.muted }}>Draw or type your signature (available in next release)</p>
        </div>
      </Card>
    </StepWrap>
  )
}

// ─── Step 11: Review & Submit ─────────────────────────────────────────────────
function Step11({ onBack, onSubmit }:{ onBack:()=>void; onSubmit:()=>void }) {
  const sections = [
    { title:'Personal Information', complete:true,  items:['Kasun Perera','kasun.p@email.lk','+94 77 234 5678','45 Galle Road, Colombo 03'] },
    { title:'Professional Profile', complete:true,  items:['Hospital Companion Specialist','8 years experience','English, Sinhala, Tamil','Western Province, Colombo District'] },
    { title:'Skills & Services',    complete:true,  items:['Hospital Companion (Expert)','First Aid (Expert)','CPR (Expert)','Home Care (Advanced)'] },
    { title:'Certifications',       complete:true,  items:['Caregiving Certificate ✓','First Aid Certificate ✓','CPR Certificate ✓'] },
    { title:'Identity Verification',complete:false, items:['NIC Front ✓','NIC Back ✓','Police Clearance ✓','Medical Certificate – Missing'] },
    { title:'Banking & Payouts',    complete:true,  items:['Commercial Bank of Ceylon','Account verified'] },
    { title:'Availability',         complete:true,  items:['Mon–Fri, Morning shift','Emergency availability: On','40 hrs/week max'] },
    { title:'Equipment & Transport',complete:true,  items:['Public Transport','Smartphone ✓','Internet Access ✓'] },
    { title:'References',           complete:true,  items:['Dr. Priya Fernando – Nawaloka Hospital','Nimal Jayasinghe – Red Cross'] },
    { title:'Agreements',           complete:false, items:['Terms & Conditions – Pending','Code of Conduct – Pending'] },
  ]
  const completedCount = sections.filter(s=>s.complete).length
  const score = Math.round((completedCount/sections.length)*100)

  return (
    <StepWrap step={11} total={11} title="Review & Submit" desc="Review your application before submitting. You can edit any section." onBack={onBack} onNext={onSubmit} nextLabel="Submit Application →">
      {/* Score */}
      <Card style={{ padding:24, marginBottom:20, background:`linear-gradient(135deg,${C.primary}06,${C.primary}02)`, border:`1px solid ${C.primary}20` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
          <div>
            <p style={{ fontSize:16, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>Application Score</p>
            <p style={{ fontSize:12, color:C.muted }}>{completedCount} of {sections.length} sections complete</p>
          </div>
          <div style={{ textAlign:'center' as const }}>
            <p style={{ fontSize:40, fontWeight:900, color:score>=80?C.success:C.warning, fontFamily:'Manrope,sans-serif', lineHeight:1 }}>{score}%</p>
            <Bdg label={score>=80?'Ready to Submit':'Almost There'} color={score>=80?C.success:C.warning} />
          </div>
        </div>
        <div style={{ height:8, borderRadius:99, background:'rgba(0,115,122,0.1)', overflow:'hidden' }}>
          <div style={{ width:`${score}%`, height:'100%', background:`linear-gradient(90deg,${C.primary},${C.success})`, borderRadius:99, transition:'width 0.5s' }} />
        </div>
      </Card>

      {/* Missing items alert */}
      {sections.some(s=>!s.complete)&&(
        <Card style={{ padding:18, marginBottom:20, border:`1.5px solid ${C.warning}40`, background:`${C.warning}05` }}>
          <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
            <span style={{color:C.warning,display:'flex',marginTop:1}}>{I.warning}</span>
            <div>
              <p style={{ fontSize:13, fontWeight:700, color:C.warning }}>Action Required</p>
              <p style={{ fontSize:12, color:C.sub }}>Please complete the following before submitting: Medical Certificate (Step 5), Agreements (Step 10).</p>
            </div>
          </div>
        </Card>
      )}

      {/* Sections */}
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {sections.map((s,i)=>(
          <Card key={i} style={{ padding:18 }}>
            <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
              <div style={{ width:26, height:26, borderRadius:'50%', background:s.complete?`${C.success}10`:`${C.warning}10`, border:`2px solid ${s.complete?C.success:C.warning}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:s.complete?C.success:C.warning }}>
                {s.complete?<span style={{display:'flex',transform:'scale(0.75)'}}>{I.check}</span>:<span style={{fontSize:11,fontWeight:900}}>!</span>}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{s.title}</p>
                  <button style={{ fontSize:12, fontWeight:700, color:C.primary, background:'none', border:'none', cursor:'pointer', fontFamily:'Manrope,sans-serif', display:'flex', gap:3, alignItems:'center' }}>
                    <span style={{display:'flex'}}>{I.edit}</span>Edit
                  </button>
                </div>
                <div style={{ display:'flex', flexWrap:'wrap' as const, gap:6 }}>
                  {s.items.map((item,j)=>(
                    <span key={j} style={{ fontSize:11, color:item.includes('Missing')||item.includes('Pending')?C.error:C.sub, background:item.includes('Missing')||item.includes('Pending')?`${C.error}08`:C.bg, padding:'3px 8px', borderRadius:6 }}>{item}</span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </StepWrap>
  )
}

// ─── Application Submitted ────────────────────────────────────────────────────
function ApplicationSubmitted({ onStatus }:{ onStatus:()=>void }) {
  return (
    <div style={{ maxWidth:600, margin:'0 auto', padding:'60px 32px', textAlign:'center' as const }}>
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
    </div>
  )
}

// ─── Application Status ───────────────────────────────────────────────────────
function ApplicationStatus() {
  const statuses = [
    { k:'Submitted',           color:C.info,    icon:'📤', desc:'Application received and queued for review.' },
    { k:'Under Review',        color:C.primary, icon:'🔍', desc:'Our team is reviewing your documents and profile.', active:true },
    { k:'Documents Requested', color:C.warning, icon:'📂', desc:'Additional documents have been requested from you.' },
    { k:'Approved',            color:C.success, icon:'✅', desc:'Congratulations! Your application has been approved.' },
    { k:'Rejected',            color:C.error,   icon:'❌', desc:'Your application did not meet current requirements.' },
    { k:'Draft',               color:C.muted,   icon:'✏️', desc:'Application started but not yet submitted.' },
    { k:'Incomplete',          color:C.warning, icon:'⚠️', desc:'Required information is missing from your application.' },
    { k:'Suspended',           color:C.error,   icon:'🚫', desc:'Your account has been temporarily suspended pending review.' },
  ]
  return (
    <div style={{ padding:'32px 36px 80px', maxWidth:680 }}>
      <div style={{ marginBottom:28 }}>
        <h2 style={{ fontSize:24, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Application Status</h2>
        <p style={{ fontSize:14, color:C.muted }}>Reference: <strong style={{color:C.primary}}>RP-AGT-2025-08741</strong></p>
      </div>
      {/* Current status highlight */}
      <Card style={{ padding:22, marginBottom:24, background:`linear-gradient(135deg,${C.primary}06,${C.primary}02)`, border:`1px solid ${C.primary}20` }}>
        <div style={{ display:'flex', gap:14, alignItems:'center' }}>
          <div style={{ width:52, height:52, borderRadius:16, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0 }}>🔍</div>
          <div>
            <p style={{ fontSize:11, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>Current Status</p>
            <p style={{ fontSize:18, fontWeight:900, color:C.primary, fontFamily:'Manrope,sans-serif' }}>Under Review</p>
            <p style={{ fontSize:12, color:C.muted }}>Submitted 14 Jan 2025 · Est. approval by 21 Jan 2025</p>
          </div>
        </div>
      </Card>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }} className="cao-2col">
        {statuses.map((s,i)=>(
          <Card key={i} style={{ padding:18, border:`1.5px solid ${(s as any).active?s.color+'40':C.border}`, background:(s as any).active?`${s.color}04`:C.surface }}>
            <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
              <span style={{ fontSize:22 }}>{s.icon}</span>
              <div>
                <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:4 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{s.k}</p>
                  {(s as any).active&&<Bdg label="Current" color={s.color} />}
                </div>
                <p style={{ fontSize:11, color:C.muted, lineHeight:1.5 }}>{s.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Document Center ──────────────────────────────────────────────────────────
function DocumentCenter() {
  const docs = [
    { name:'National ID (Front)',             status:'verified',  expiry:null,           icon:'🪪' },
    { name:'National ID (Back)',              status:'verified',  expiry:null,           icon:'🪪' },
    { name:'Police Clearance Certificate',    status:'verified',  expiry:'2025-06-30',   icon:'📋' },
    { name:'Caregiving Certificate',          status:'verified',  expiry:'2028-03-09',   icon:'📜' },
    { name:'First Aid Certificate',           status:'expiring',  expiry:'2025-06-01',   icon:'🩹' },
    { name:'CPR Certificate',                 status:'expiring',  expiry:'2025-06-01',   icon:'❤️' },
    { name:'Medical Fitness Certificate',     status:'pending',   expiry:null,           icon:'🏥' },
    { name:'Recommendation Letter',           status:'verified',  expiry:null,           icon:'✉️' },
  ]
  const statusColor = { verified:C.success, expiring:C.warning, pending:C.muted, missing:C.error } as const
  const statusLabel = { verified:'Verified', expiring:'Expiring Soon', pending:'Pending Review', missing:'Missing' } as const
  return (
    <div style={{ padding:'32px 36px 80px', maxWidth:680 }}>
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontSize:24, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Document Center</h2>
        <p style={{ fontSize:14, color:C.muted }}>Manage all your uploaded documents and certifications.</p>
      </div>
      {/* Expiry alerts */}
      <Card style={{ padding:18, marginBottom:20, border:`1.5px solid ${C.warning}40`, background:`${C.warning}05` }}>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <span style={{color:C.warning,display:'flex'}}>{I.warning}</span>
          <p style={{ fontSize:13, fontWeight:700, color:C.warning }}>2 documents expiring within 6 months — renew your First Aid and CPR certificates.</p>
        </div>
      </Card>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {docs.map((d,i)=>(
          <Card key={i} style={{ padding:18 }}>
            <div style={{ display:'flex', gap:12, alignItems:'center' }}>
              <div style={{ width:44, height:44, borderRadius:14, background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{d.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:3 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{d.name}</p>
                  <Bdg label={statusLabel[d.status as keyof typeof statusLabel]} color={statusColor[d.status as keyof typeof statusColor]} />
                </div>
                {d.expiry&&<p style={{ fontSize:11, color:d.status==='expiring'?C.warning:C.muted }}>Expires {d.expiry}</p>}
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <Btn label="View" variant="ghost" small />
                <Btn label="Replace" variant="secondary" small />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Verification Center ──────────────────────────────────────────────────────
function VerificationCenter() {
  const timeline = [
    { icon:'🪪', l:'Identity Submitted',          t:'14 Jan 2025 · 9:30 AM', done:true },
    { icon:'🔍', l:'Identity Verified',            t:'14 Jan 2025 · 2:15 PM', done:true },
    { icon:'🏛️', l:'Police Clearance Verified',   t:'15 Jan 2025 · 11:00 AM',done:true },
    { icon:'🏥', l:'Medical Certificate Verified', t:'Pending',               done:false },
    { icon:'📞', l:'References Checked',           t:'Pending',               done:false },
    { icon:'✅', l:'Final Approval',               t:'Estimated: 21 Jan 2025',done:false },
  ]
  return (
    <div style={{ padding:'32px 36px 80px', maxWidth:680 }}>
      <div style={{ marginBottom:28 }}>
        <h2 style={{ fontSize:24, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Verification Center</h2>
        <p style={{ fontSize:14, color:C.muted }}>Track the progress of your identity and background verification.</p>
      </div>
      <div style={{ display:'flex', flexDirection:'column' }}>
        {timeline.map((e,i,arr)=>(
          <div key={i} style={{ display:'flex', gap:16 }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
              <div style={{ width:44, height:44, borderRadius:14, background:e.done?`${C.success}10`:`${C.muted}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>{e.icon}</div>
              {i<arr.length-1&&<div style={{ width:2, flex:1, background:C.border, margin:'4px 0' }} />}
            </div>
            <div style={{ paddingBottom:i<arr.length-1?22:0, paddingTop:4 }}>
              <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:2 }}>
                <p style={{ fontSize:13, fontWeight:700, color:e.done?C.type:C.muted }}>{e.l}</p>
                {e.done&&<Bdg label="Complete" color={C.success} />}
              </div>
              <p style={{ fontSize:11, color:C.muted }}>{e.t}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Profile Completeness ─────────────────────────────────────────────────────
function ProfileCompleteness({ onGoto }:{ onGoto:(n:number)=>void }) {
  const sections = [
    { n:1,  l:'Personal Information',  pct:100 },
    { n:2,  l:'Professional Profile',  pct:100 },
    { n:3,  l:'Skills & Services',     pct:100 },
    { n:4,  l:'Certifications',        pct:80  },
    { n:5,  l:'Identity Verification', pct:75  },
    { n:6,  l:'Banking & Payouts',     pct:100 },
    { n:7,  l:'Availability',          pct:100 },
    { n:8,  l:'Equipment',             pct:100 },
    { n:9,  l:'References',            pct:100 },
    { n:10, l:'Agreements',            pct:40  },
  ]
  const overall = Math.round(sections.reduce((a,s)=>a+s.pct,0)/sections.length)
  return (
    <div style={{ padding:'32px 36px 80px', maxWidth:680 }}>
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontSize:24, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Profile Completeness</h2>
        <p style={{ fontSize:14, color:C.muted }}>A complete profile gets 3× more client matches.</p>
      </div>
      <Card style={{ padding:24, marginBottom:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
          <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>Overall Completion</p>
          <p style={{ fontSize:28, fontWeight:900, color:overall>=80?C.success:C.warning, fontFamily:'Manrope,sans-serif' }}>{overall}%</p>
        </div>
        <div style={{ height:10, borderRadius:99, background:C.bg, overflow:'hidden', marginBottom:10 }}>
          <div style={{ width:`${overall}%`, height:'100%', background:`linear-gradient(90deg,${C.primary},${C.success})`, borderRadius:99, transition:'width 0.6s' }} />
        </div>
        <p style={{ fontSize:12, color:C.muted }}>Complete all sections to maximise your visibility to clients.</p>
      </Card>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {sections.map(s=>(
          <Card key={s.n} hover style={{ padding:16 }} onClick={()=>onGoto(s.n)}>
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:36, height:36, borderRadius:11, background:s.pct===100?`${C.success}10`:`${C.warning}10`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <p style={{ fontSize:11, fontWeight:900, color:s.pct===100?C.success:C.warning, fontFamily:'Manrope,sans-serif' }}>{s.n}</p>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{s.l}</p>
                  <p style={{ fontSize:12, fontWeight:800, color:s.pct===100?C.success:C.warning }}>{s.pct}%</p>
                </div>
                <div style={{ height:4, borderRadius:99, background:C.bg, overflow:'hidden' }}>
                  <div style={{ width:`${s.pct}%`, height:'100%', background:s.pct===100?C.success:C.warning, borderRadius:99, transition:'width 0.4s' }} />
                </div>
              </div>
              {s.pct<100&&<span style={{ color:C.primary, display:'flex' }}>{I.chevR}</span>}
            </div>
          </Card>
        ))}
      </div>
      {/* Rewards placeholder */}
      <Card style={{ padding:20, marginTop:20, background:`${C.accent}06`, border:`1px solid ${C.accent}20`, opacity:0.75 }}>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <span style={{ fontSize:28 }}>🏆</span>
          <div>
            <p style={{ fontSize:13, fontWeight:700, color:C.type }}>Completion Rewards</p>
            <p style={{ fontSize:12, color:C.muted }}>Reach 100% to unlock featured placement and priority matching. <Bdg label="Coming Soon" color={C.accent} /></p>
          </div>
        </div>
      </Card>
    </div>
  )
}

// ─── Help Center ──────────────────────────────────────────────────────────────
function HelpCenter() {
  const faqs = [
    { q:'How long does verification take?',  a:'Document verification typically takes 3–5 working days. We may contact you if we need additional information.' },
    { q:'What documents do I need?',          a:'NIC (front & back), Police Clearance Certificate (within 6 months), Medical Fitness Certificate, and any relevant professional qualifications.' },
    { q:'Can I update my documents later?',   a:'Yes, you can replace any document at any time from the Document Center. Updated documents will be re-verified.' },
    { q:'How do I set my service rates?',      a:'After approval you can set your hourly rates from your Agent Dashboard. ReadyPal recommends competitive rates based on your experience level.' },
    { q:'When do I get paid?',                a:'Weekly transfers to your verified bank account every Monday for jobs completed the previous week.' },
  ]
  const [open, setOpen] = useState<number|null>(0)
  return (
    <div style={{ padding:'32px 36px 80px', maxWidth:680 }}>
      <h2 style={{ fontSize:24, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Help Center</h2>
      <p style={{ fontSize:14, color:C.muted, marginBottom:24 }}>Find answers to common questions about agent registration.</p>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:24 }} className="cao-2col">
        {[{icon:'📖',l:'Registration Guide'},{icon:'📄',l:'Document Requirements'},{icon:'💬',l:'Contact Support'},{icon:'🗨️',l:'Live Chat'}].map((s,i)=>(
          <Card key={i} hover style={{ padding:18, textAlign:'center' as const }}>
            <div style={{ fontSize:28, marginBottom:8 }}>{s.icon}</div>
            <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:6 }}>{s.l}</p>
            <Btn label={s.l==='Live Chat'?'Coming Soon':'Open'} variant="secondary" small disabled={s.l==='Live Chat'} />
          </Card>
        ))}
      </div>

      <h3 style={{ fontSize:15, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:14 }}>Frequently Asked Questions</h3>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {faqs.map((faq,i)=>(
          <Card key={i} style={{ padding:0, overflow:'hidden' }}>
            <button onClick={()=>setOpen(open===i?null:i)} style={{ width:'100%', padding:'16px 20px', background:'transparent', border:'none', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', fontFamily:'Manrope,sans-serif', textAlign:'left' as const }}>
              <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{faq.q}</p>
              <span style={{ color:C.muted, display:'flex', transform:open===i?'rotate(90deg)':'none', transition:'transform 0.2s', flexShrink:0 }}>{I.chevR}</span>
            </button>
            {open===i&&(
              <div style={{ padding:'0 20px 16px' }}>
                <p style={{ fontSize:13, color:C.sub, lineHeight:1.7 }}>{faq.a}</p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Notifications ────────────────────────────────────────────────────────────
function Notifications() {
  const items = [
    { icon:'📤', title:'Application Submitted',        body:'Your application RP-AGT-2025-08741 has been received.',          time:'Just now',          color:C.success, read:false },
    { icon:'🔍', title:'Verification in Progress',     body:'Our team has started reviewing your documents.',                  time:'2 hours ago',       color:C.primary, read:false },
    { icon:'📂', title:'Document Request',             body:'Please upload your Medical Fitness Certificate to continue.',     time:'Yesterday',         color:C.warning, read:false },
    { icon:'✅', title:'Reference Check Complete',     body:'Dr. Priya Fernando has confirmed your reference.',               time:'2 days ago',        color:C.success, read:true },
    { icon:'⏰', title:'Complete Your Registration',   body:"You're 85% complete. Just a few more steps remaining.",          time:'3 days ago',        color:C.accent,  read:true },
    { icon:'✅', title:'Approval Granted',             body:'Congratulations! You are now an approved ReadyPal Care Agent.',  time:'Coming soon',       color:C.success, read:true, preview:true },
  ]
  return (
    <div style={{ padding:'32px 36px 80px', maxWidth:680 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <h2 style={{ fontSize:24, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>Notifications</h2>
          <p style={{ fontSize:14, color:C.muted }}>Updates about your registration and verification.</p>
        </div>
        <Bdg label={`${items.filter(i=>!i.read).length} unread`} color={C.primary} />
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {items.map((n,i)=>(
          <Card key={i} style={{ padding:18, background:n.read?C.surface:`${n.color}04`, border:`1px solid ${n.read?C.border:n.color+'20'}`, opacity:n.preview?0.5:1 }}>
            <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
              <div style={{ width:42, height:42, borderRadius:13, background:`${n.color}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{n.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                  <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                    <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{n.title}</p>
                    {!n.read&&<div style={{ width:7, height:7, borderRadius:'50%', background:n.color }} />}
                    {n.preview&&<Bdg label="Preview" color={C.muted} />}
                  </div>
                  <p style={{ fontSize:11, color:C.muted, whiteSpace:'nowrap' as const }}>{n.time}</p>
                </div>
                <p style={{ fontSize:12, color:C.sub, lineHeight:1.6 }}>{n.body}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Empty States ─────────────────────────────────────────────────────────────
function EmptyStates() {
  const items = [
    { emoji:'📂', title:'No Documents',      desc:'No documents have been uploaded yet. Start your registration to add documents.',   cta:'Upload Documents' },
    { emoji:'👥', title:'No References',     desc:'You haven\'t added any professional references yet.',                               cta:'Add References' },
    { emoji:'📜', title:'No Certifications', desc:'No professional certifications have been uploaded.',                                cta:'Upload Certificates' },
    { emoji:'📅', title:'No Availability',   desc:'You haven\'t set your availability schedule yet.',                                 cta:'Set Availability' },
  ]
  return (
    <div style={{ padding:'32px 36px 80px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:20 }}>Empty States</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }} className="cao-2col">
        {items.map((s,i)=>(
          <Card key={i} style={{ padding:'40px 24px', textAlign:'center' as const }}>
            <div style={{ fontSize:44, marginBottom:14 }}>{s.emoji}</div>
            <p style={{ fontSize:15, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:8 }}>{s.title}</p>
            <p style={{ fontSize:12, color:C.muted, lineHeight:1.7, marginBottom:18 }}>{s.desc}</p>
            <Btn label={s.cta} variant="secondary" small />
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Loading States ───────────────────────────────────────────────────────────
function LoadingStates() {
  function Shimmer({ style={} }:{ style?:CSSProperties }) {
    return <div style={{ borderRadius:10, background:'linear-gradient(90deg,#E4E8EA 25%,#F2F4F5 50%,#E4E8EA 75%)', backgroundSize:'200% 100%', animation:'shimmer 1.6s ease-in-out infinite', ...style }} />
  }
  return (
    <div style={{ padding:'32px 36px 80px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:20 }}>Loading States</h2>
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        {[
          { label:'Loading Registration' },
          { label:'Uploading Documents' },
          { label:'Loading Verification' },
        ].map((s,i)=>(
          <Card key={i} style={{ padding:22 }}>
            <p style={{ fontSize:12, fontWeight:700, color:C.muted, marginBottom:14 }}>{s.label}</p>
            <div style={{ display:'flex', gap:14, alignItems:'center', marginBottom:14 }}>
              <Shimmer style={{ width:56, height:56, borderRadius:16, flexShrink:0 }} />
              <div style={{ flex:1 }}>
                <Shimmer style={{ height:14, width:'70%', marginBottom:8 }} />
                <Shimmer style={{ height:11, width:'50%' }} />
              </div>
            </div>
            {[...Array(3)].map((_,j)=>(
              <Shimmer key={j} style={{ height:48, marginBottom:10, borderRadius:12 }} />
            ))}
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Error States ─────────────────────────────────────────────────────────────
function ErrorStates({ onToast }:{ onToast:(m:string)=>void }) {
  const errors = [
    { icon:'📂', title:'Document Upload Failed',  desc:'The file could not be uploaded. Please check your connection and try again.', cta:'Retry Upload',     color:C.error },
    { icon:'🔍', title:'Verification Error',       desc:'We were unable to verify your document. Please ensure it is clear and fully visible.', cta:'Try Again', color:C.warning },
    { icon:'📤', title:'Submission Failed',        desc:'Your application could not be submitted. Please review your details and try again.', cta:'Retry',       color:C.error },
    { icon:'📶', title:'Connection Lost',          desc:'You appear to be offline. Your progress has been saved. Reconnect to continue.', cta:'Retry',            color:C.muted },
  ]
  return (
    <div style={{ padding:'32px 36px 80px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:20 }}>Error States</h2>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {errors.map((e,i)=>(
          <Card key={i} style={{ padding:22, border:`1.5px solid ${e.color}30`, background:`${e.color}04` }}>
            <div style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
              <div style={{ width:44, height:44, borderRadius:14, background:`${e.color}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{e.icon}</div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:13, fontWeight:800, color:e.color, marginBottom:4 }}>{e.title}</p>
                <p style={{ fontSize:12, color:C.sub, lineHeight:1.6, marginBottom:12 }}>{e.desc}</p>
                <Btn label={e.cta} variant="secondary" small icon={I.refresh} onClick={()=>onToast(`${e.cta} triggered`)} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Success States ───────────────────────────────────────────────────────────
function SuccessStates() {
  const items = [
    { icon:'📄', title:'Document Uploaded',    desc:'Your document has been successfully uploaded and is pending verification.', color:C.success },
    { icon:'🔐', title:'Identity Verified',    desc:'Your NIC and personal details have been verified successfully.', color:C.success },
    { icon:'🏦', title:'Bank Details Saved',   desc:'Your bank account has been verified and saved for payouts.', color:C.success },
    { icon:'🎉', title:'Application Submitted',desc:'Your application has been submitted and is now under review.', color:C.success },
  ]
  return (
    <div style={{ padding:'32px 36px 80px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:20 }}>Success States</h2>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {items.map((s,i)=>(
          <Card key={i} style={{ padding:20, border:`1.5px solid ${C.success}30`, background:`${C.success}04` }}>
            <div style={{ display:'flex', gap:12, alignItems:'center' }}>
              <div style={{ width:44, height:44, borderRadius:14, background:`${C.success}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{s.icon}</div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:13, fontWeight:700, color:C.success, marginBottom:3 }}>{s.title}</p>
                <p style={{ fontSize:12, color:C.sub, lineHeight:1.5 }}>{s.desc}</p>
              </div>
              <span style={{ color:C.success, display:'flex', transform:'scale(1.3)' }}>{I.check}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Sub-view nav ─────────────────────────────────────────────────────────────
type SubView = 'home'|'wizard'|'status'|'docs'|'verify'|'completeness'|'help'|'notifications'|'empty'|'loading'|'error'|'success'

const SUB_NAV: {k:SubView;l:string}[] = [
  {k:'home',          l:'Onboarding Home'},
  {k:'wizard',        l:'Registration Wizard'},
  {k:'status',        l:'Application Status'},
  {k:'docs',          l:'Document Center'},
  {k:'verify',        l:'Verification Center'},
  {k:'completeness',  l:'Profile Completeness'},
  {k:'help',          l:'Help Center'},
  {k:'notifications', l:'Notifications'},
  {k:'empty',         l:'Empty States'},
  {k:'loading',       l:'Loading States'},
  {k:'error',         l:'Error States'},
  {k:'success',       l:'Success States'},
]

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function CareAgentOnboarding() {
  const [sub, setSub] = useState<SubView>('home')
  const [step, setStep] = useState(1)
  const [completed, setCompleted] = useState(new Set<number>())
  const [submitted, setSubmitted] = useState(false)
  const [toast, setToast] = useState<string|null>(null)

  const showToast = (msg:string) => { setToast(msg); setTimeout(()=>setToast(null),2800) }

  const advance = (n:number) => { setCompleted(p=>new Set([...p,n])); setStep(n+1<12?n+1:11) }
  const goTo = (n:number) => setStep(n)

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
      case 11: return <Step11 onBack={()=>setStep(10)} onSubmit={()=>setSubmitted(true)} />
      default: return <Step1 onBack={()=>setSub('home')} onNext={()=>advance(1)} />
    }
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:C.bg, fontFamily:'Manrope,sans-serif' }}>
      {/* Top sub-nav */}
      <div style={{ position:'fixed', top:0, left:0, right:0, zIndex:40, background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'0 24px', display:'flex', gap:2, overflowX:'auto', height:48, alignItems:'center' }}>
        <p style={{ fontSize:11, fontWeight:800, color:C.muted, marginRight:12, whiteSpace:'nowrap' as const }}>16 Agent Onboarding</p>
        {SUB_NAV.map(n=>(
          <button key={n.k} onClick={()=>{ setSub(n.k); if(n.k==='home'){ setSubmitted(false) } }}
            style={{ padding:'6px 14px', borderRadius:8, border:'none', background:sub===n.k?`${C.primary}10`:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:sub===n.k?700:500, color:sub===n.k?C.primary:C.sub, whiteSpace:'nowrap' as const, flexShrink:0, borderBottom:sub===n.k?`2px solid ${C.primary}`:'2px solid transparent' }}>
            {n.l}
          </button>
        ))}
      </div>

      <div style={{ display:'flex', flex:1, marginTop:48 }}>
        {/* Progress sidebar (wizard only) */}
        {sub==='wizard'&&!submitted&&(
          <ProgressSidebar current={step} onGoto={goTo} completed={completed} />
        )}

        {/* Main content */}
        <div style={{ flex:1, overflowY:'auto' }}>
          {sub==='home'         && <OnboardingHome onStart={()=>{ setSub('wizard'); setStep(1) }} />}
          {sub==='wizard'       && renderStep()}
          {sub==='status'       && <ApplicationStatus />}
          {sub==='docs'         && <DocumentCenter />}
          {sub==='verify'       && <VerificationCenter />}
          {sub==='completeness' && <ProfileCompleteness onGoto={n=>{ setSub('wizard'); setStep(n); setSubmitted(false) }} />}
          {sub==='help'         && <HelpCenter />}
          {sub==='notifications'&& <Notifications />}
          {sub==='empty'        && <EmptyStates />}
          {sub==='loading'      && <LoadingStates />}
          {sub==='error'        && <ErrorStates onToast={showToast} />}
          {sub==='success'      && <SuccessStates />}
        </div>
      </div>

      {toast&&<SuccessToast msg={toast} />}
    </div>
  )
}
