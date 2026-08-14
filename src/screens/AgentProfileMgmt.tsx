import { useState, type ReactNode, type CSSProperties } from 'react'

// ─── Brand ────────────────────────────────────────────────────────────────────
const C = {
  primary:'#00737A', accent:'#EE8153', type:'#2C3E43', sub:'#6B7E85',
  muted:'#9AAAB0', border:'#E4E8EA', bg:'#F2F4F5', surface:'#FFFFFF',
  success:'#22C55E', warning:'#F59E0B', error:'#EF4444', info:'#3B82F6',
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const I: Record<string,ReactNode> = {
  user:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M1.5 11.5c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  star:     <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M6 1l1.5 3 3.3.5-2.4 2.3.6 3.3L6 8.8 3 10.1l.6-3.3L1.2 4.5l3.3-.5L6 1z"/></svg>,
  check:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 6.5l3 3.5 5-6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  edit:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M9.5 1.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  calendar: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="2.5" width="11" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M1 6h11M4 1v3M9 1v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  map:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1C4.3 1 2.5 2.8 2.5 5c0 3.2 4 7 4 7s4-3.8 4-7c0-2.2-1.8-4-4-4z" stroke="currentColor" strokeWidth="1.3"/><circle cx="6.5" cy="5" r="1.2" stroke="currentColor" strokeWidth="1.2"/></svg>,
  award:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.3"/><path d="M4 9.5L3 12l3.5-1.5L10 12 9 9.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  book:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 2h5a2 2 0 0 1 2 2v7a2 2 0 0 0-2-2H2V2z" stroke="currentColor" strokeWidth="1.3"/><path d="M7 2h2a2 2 0 0 1 2 2v7a2 2 0 0 0-2-2H7" stroke="currentColor" strokeWidth="1.3"/></svg>,
  shield:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1L1.5 3v4c0 3 5 5 5 5s5-2 5-5V3L6.5 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M4 6.5l2 2 3-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevR:    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  upload:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 9V2M4 4.5L6.5 2 9 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M1.5 10.5h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  eye:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 6.5C1 6.5 3 3 6.5 3s5.5 3.5 5.5 3.5S10 10 6.5 10 1 6.5 1 6.5z" stroke="currentColor" strokeWidth="1.3"/><circle cx="6.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/></svg>,
  bolt:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M7.5 1.5l-5 6.5H7L5.5 12l5-6.5H6l1.5-4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  settings: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M6.5 1v1.5M6.5 10.5V12M1 6.5h1.5M10.5 6.5H12M2.64 2.64l1.06 1.06M9.3 9.3l1.06 1.06M9.3 3.7L8.24 4.76M3.7 9.3L2.64 10.36" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  refresh:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M11 6.5a4.5 4.5 0 1 1-1-2.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M11 3v2.5H8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  camera:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="4" width="11" height="8" rx="2" stroke="currentColor" strokeWidth="1.2"/><circle cx="6.5" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 4V3l1-2h2l1 2v1" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  trending: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 10l3.5-3.5 3 3L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8.5 4H11v2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  lang:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M6.5 1.5c0 0-2.5 2.2-2.5 5s2.5 5 2.5 5M6.5 1.5c0 0 2.5 2.2 2.5 5s-2.5 5-2.5 5M1.5 6.5h10" stroke="currentColor" strokeWidth="1.1"/></svg>,
  trash:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 3.5h9M5 3.5V2h3v1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M3.5 3.5l.5 7.5h5l.5-7.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  plus:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2v9M2 6.5h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
}

// ─── Primitives ───────────────────────────────────────────────────────────────
function Card({ children, style={}, hover=false, onClick }:{ children:ReactNode; style?:CSSProperties; hover?:boolean; onClick?:()=>void }) {
  const [h,setH] = useState(false)
  return (
    <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ background:C.surface, borderRadius:16, border:`1px solid ${h&&hover?C.primary+'40':C.border}`, boxShadow:h&&hover?'0 8px 28px rgba(44,62,67,0.10)':'0 1px 4px rgba(44,62,67,0.06)', transition:'all 0.18s', cursor:onClick?'pointer':undefined, ...style }}>
      {children}
    </div>
  )
}

function Btn({ label, icon, onClick, variant='primary', small=false, disabled=false, full=false }:{
  label:string; icon?:ReactNode; onClick?:()=>void
  variant?:'primary'|'secondary'|'ghost'|'danger'|'accent'
  small?:boolean; disabled?:boolean; full?:boolean
}) {
  const [h,setH] = useState(false)
  const vs: Record<string,CSSProperties> = {
    primary:   { background:disabled?'#C8D0D4':h?'#005D63':C.primary, color:'#fff', border:'none', boxShadow:disabled?'none':h?`0 4px 16px ${C.primary}50`:`0 2px 8px ${C.primary}30` },
    secondary: { background:h?'#EEF5F5':'#fff', color:C.primary, border:`1.5px solid ${h?C.primary:C.border}` },
    ghost:     { background:h?C.bg:'transparent', color:C.sub, border:'none' },
    danger:    { background:h?'#DC2626':C.error, color:'#fff', border:'none', boxShadow:`0 2px 8px ${C.error}30` },
    accent:    { background:h?'#D4663D':C.accent, color:'#fff', border:'none', boxShadow:`0 2px 8px ${C.accent}30` },
  }
  return (
    <button onClick={disabled?undefined:onClick} disabled={disabled}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:small?'7px 14px':'10px 20px', borderRadius:10, cursor:disabled?'not-allowed':'pointer', fontFamily:'Manrope,sans-serif', fontSize:small?12:13, fontWeight:700, transition:'all 0.15s', width:full?'100%':undefined, ...vs[variant] }}>
      {icon&&<span style={{display:'flex'}}>{icon}</span>}{label}
    </button>
  )
}

function Bdg({ label, color=C.primary, dot=false }:{ label:string; color?:string; dot?:boolean }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:dot?5:0, padding:'3px 10px', borderRadius:999, fontSize:11, fontWeight:700, background:`${color}12`, color, whiteSpace:'nowrap' as const }}>
      {dot&&<div style={{width:6,height:6,borderRadius:'50%',background:color,flexShrink:0}}/>}{label}
    </span>
  )
}

function SectionTitle({ title, action, onAction }:{ title:string; action?:string; onAction?:()=>void }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
      <h3 style={{ fontSize:15, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>{title}</h3>
      {action&&<button onClick={onAction} style={{ fontSize:12, fontWeight:700, color:C.primary, background:'none', border:'none', cursor:'pointer', fontFamily:'Manrope,sans-serif', display:'flex', alignItems:'center', gap:3 }}>{action}<span style={{display:'flex'}}>{I.chevR}</span></button>}
    </div>
  )
}

function Toast({ msg }:{ msg:string }) {
  return (
    <div style={{ position:'fixed', bottom:28, left:'50%', transform:'translateX(-50%)', zIndex:999, display:'flex', alignItems:'center', gap:10, padding:'12px 22px', borderRadius:14, background:C.type, color:'#fff', fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:700, boxShadow:'0 8px 28px rgba(0,0,0,0.22)', pointerEvents:'none', whiteSpace:'nowrap' as const }}>
      <span style={{display:'flex',color:C.success}}>{I.check}</span>{msg}
    </div>
  )
}

function Shimmer({ w='100%', h=16 }:{ w?:string; h?:number }) {
  return <div style={{ width:w, height:h, borderRadius:8, background:'linear-gradient(90deg,#E4E8EA 25%,#F2F4F5 50%,#E4E8EA 75%)', backgroundSize:'200% 100%', animation:'shimmer 1.6s ease-in-out infinite' }} />
}

function ProgressRing({ pct, color=C.primary, size=70, label='', sub='' }:{ pct:number; color?:string; size?:number; label?:string; sub?:string }) {
  const r=(size-10)/2, circ=2*Math.PI*r
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} stroke={`${color}15`} strokeWidth={6} fill="none"/>
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={6} fill="none"
          strokeDasharray={`${circ*pct/100} ${circ*(1-pct/100)}`}
          strokeDashoffset={circ*0.25} strokeLinecap="round"/>
        <text x={size/2} y={size/2+5} textAnchor="middle" fontSize={12} fontWeight={900} fill={color} fontFamily="Manrope,sans-serif">{pct}%</text>
      </svg>
      {label&&<p style={{ fontSize:11, fontWeight:700, color:C.type, textAlign:'center' as const }}>{label}</p>}
      {sub&&<p style={{ fontSize:10, color:C.muted, textAlign:'center' as const }}>{sub}</p>}
    </div>
  )
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function KasunAvatar({ size=52, ring=false }:{ size?:number; ring?:boolean }) {
  return (
    <div style={{ position:'relative' as const, display:'inline-flex', flexShrink:0 }}>
      <div style={{ width:size, height:size, borderRadius:'50%', background:`linear-gradient(135deg,${C.primary},#005D63)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontFamily:'Manrope,sans-serif', fontWeight:900, fontSize:size*0.32, border:ring?`3px solid ${C.primary}`:undefined, boxShadow:ring?`0 0 0 3px white, 0 4px 16px ${C.primary}40`:undefined }}>
        KP
      </div>
      {ring&&<div style={{ position:'absolute', bottom:2, right:2, width:12, height:12, borderRadius:'50%', background:C.success, border:'2px solid white' }}/>}
    </div>
  )
}

// ─── Sub-view type ────────────────────────────────────────────────────────────
type SubView = 'home'|'publicProfile'|'experience'|'services'|'skills'|'certifications'|'portfolio'|'reviews'|'availability'|'serviceAreas'|'pricing'|'languages'|'achievements'|'insights'|'learning'|'settings'|'preview'|'documents'|'notifications'|'statusBadges'|'empty'|'loading'|'error'|'success'

const NAV: { k:SubView; l:string; icon:ReactNode; group:string }[] = [
  { k:'home',          l:'Profile Home',        icon:I.user,      group:'Profile'      },
  { k:'publicProfile', l:'Public Profile',       icon:I.eye,       group:'Profile'      },
  { k:'experience',    l:'Experience',           icon:I.award,     group:'Profile'      },
  { k:'services',      l:'Services Offered',     icon:I.shield,    group:'Profile'      },
  { k:'skills',        l:'Skills',               icon:I.bolt,      group:'Profile'      },
  { k:'certifications',l:'Certifications',       icon:I.shield,    group:'Profile'      },
  { k:'portfolio',     l:'Portfolio',            icon:I.camera,    group:'Profile'      },
  { k:'reviews',       l:'Reviews',              icon:I.star,      group:'Profile'      },
  { k:'availability',  l:'Availability',         icon:I.calendar,  group:'Management'   },
  { k:'serviceAreas',  l:'Service Areas',        icon:I.map,       group:'Management'   },
  { k:'pricing',       l:'Pricing',              icon:I.trending,  group:'Management'   },
  { k:'languages',     l:'Languages',            icon:I.lang,      group:'Management'   },
  { k:'achievements',  l:'Achievements',         icon:I.award,     group:'Growth'       },
  { k:'insights',      l:'Career Insights',      icon:I.trending,  group:'Growth'       },
  { k:'learning',      l:'Learning & Dev',       icon:I.book,      group:'Growth'       },
  { k:'settings',      l:'Profile Settings',     icon:I.settings,  group:'Growth'       },
  { k:'preview',       l:'Profile Preview',      icon:I.eye,       group:'Growth'       },
  { k:'documents',     l:'Document Center',      icon:I.shield,    group:'Dev'          },
  { k:'notifications', l:'Notifications',        icon:I.bolt,      group:'Dev'          },
  { k:'statusBadges',  l:'Status Badges',        icon:I.check,     group:'Dev'          },
  { k:'empty',         l:'Empty States',         icon:I.trash,     group:'Dev'          },
  { k:'loading',       l:'Loading States',       icon:I.refresh,   group:'Dev'          },
  { k:'error',         l:'Error States',         icon:I.bolt,      group:'Dev'          },
  { k:'success',       l:'Success States',       icon:I.check,     group:'Dev'          },
]

// ─── Profile Home ──────────────────────────────────────────────────────────
function ProfileHome({ onNav, onToast }:{ onNav:(s:SubView)=>void; onToast:(m:string)=>void }) {
  const quickActions = [
    {e:'👤',l:'Edit Profile',         cb:()=>onNav('publicProfile')},
    {e:'📅',l:'Availability',          cb:()=>onNav('availability')},
    {e:'🗺️',l:'Service Areas',         cb:()=>onNav('serviceAreas')},
    {e:'📜',l:'Certifications',        cb:()=>onNav('certifications')},
    {e:'🏆',l:'Achievements',          cb:()=>onNav('achievements')},
    {e:'📊',l:'Insights',              cb:()=>onNav('insights')},
    {e:'📚',l:'Learning',              cb:()=>onNav('learning')},
    {e:'⚙️',l:'Settings',              cb:()=>onNav('settings')},
  ]
  return (
    <div style={{ padding:'24px 28px 60px' }}>
      {/* Hero */}
      <Card style={{ marginBottom:20, overflow:'hidden' }}>
        <div style={{ height:120, background:`linear-gradient(135deg,${C.primary},#004D52)`, position:'relative' as const }}>
          <div style={{ position:'absolute', top:'-20%', right:'-5%', width:240, height:240, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }}/>
          <button onClick={()=>onToast('Edit cover banner')} style={{ position:'absolute', top:10, right:10, background:'rgba(0,0,0,0.4)', border:'none', cursor:'pointer', borderRadius:8, padding:'6px 12px', color:'#fff', fontFamily:'Manrope,sans-serif', fontSize:11, fontWeight:700, display:'flex', gap:5, alignItems:'center' }}>
            <span style={{display:'flex'}}>{I.camera}</span>Edit Cover
          </button>
        </div>
        <div style={{ padding:'0 28px 24px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginTop:-32 }}>
            <div style={{ position:'relative' as const }}>
              <div style={{ width:80, height:80, borderRadius:'50%', background:`linear-gradient(135deg,${C.primary},#005D63)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontFamily:'Manrope,sans-serif', fontWeight:900, fontSize:26, border:'4px solid white', boxShadow:`0 4px 16px ${C.primary}40` }}>KP</div>
              <button onClick={()=>onToast('Upload photo')} style={{ position:'absolute', bottom:2, right:2, width:26, height:26, borderRadius:'50%', background:C.primary, border:'2px solid white', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#fff' }}>
                <span style={{display:'flex',transform:'scale(0.75)'}}>{I.camera}</span>
              </button>
            </div>
            <div style={{ display:'flex', gap:8, marginTop:16 }}>
              <Btn label="Preview Profile" variant="secondary" small icon={I.eye} onClick={()=>onNav('preview')} />
              <Btn label="Edit Profile" small icon={I.edit} onClick={()=>onNav('publicProfile')} />
            </div>
          </div>
          <div style={{ marginTop:12 }}>
            <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' as const, marginBottom:4 }}>
              <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', lineHeight:1 }}>Kasun Perera</h2>
              <Bdg label="Verified" color={C.primary} dot />
              <Bdg label="Top Rated" color={C.warning} dot />
              <Bdg label="Available Now" color={C.success} dot />
            </div>
            <p style={{ fontSize:13, color:C.sub, marginBottom:6 }}>Certified Elderly Care Specialist · Colombo</p>
            <div style={{ display:'flex', gap:16, flexWrap:'wrap' as const }}>
              {[{e:'⭐',v:'4.9',l:'Rating'},{e:'🎯',v:'652',l:'Services'},{e:'📅',v:'8 yrs',l:'Experience'},{e:'💬',v:'4 min',l:'Response'}].map((s,i)=>(
                <div key={i} style={{ display:'flex', gap:5, alignItems:'center' }}>
                  <span>{s.e}</span>
                  <span style={{ fontSize:13, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{s.v}</span>
                  <span style={{ fontSize:11, color:C.muted }}>{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* KPI row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }} className="ap-4col">
        {[{l:'Profile Completion',v:'87%',c:C.primary,prog:87},{l:'Profile Strength',v:'Strong',c:C.success,prog:82},{l:'Profile Views (30d)',v:'234',c:C.info,prog:null},{l:'Booking Requests',v:'18',c:C.accent,prog:null}].map((s,i)=>(
          <Card key={i} style={{ padding:20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
              <p style={{ fontSize:11, color:C.muted, lineHeight:1.4, maxWidth:80 }}>{s.l}</p>
              {s.prog!==null&&<ProgressRing pct={s.prog} color={s.c} size={52}/>}
            </div>
            {s.prog===null&&<p style={{ fontSize:28, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{s.v}</p>}
          </Card>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:18 }} className="ap-main-split">
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Completion checklist */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Complete Your Profile" action="Dismiss" />
            {[{l:'Add profile photo',         done:true, cb:()=>onToast('Navigate to photo')},{l:'Write professional bio',       done:true, cb:()=>onNav('publicProfile')},{l:'Add certifications',            done:true, cb:()=>onNav('certifications')},{l:'Set availability schedule',    done:false,cb:()=>onNav('availability')},{l:'Add service areas',             done:false,cb:()=>onNav('serviceAreas')},{l:'Set pricing preferences',      done:false,cb:()=>onNav('pricing')}].map((c,i)=>(
              <div key={i} onClick={c.cb} style={{ display:'flex', gap:10, alignItems:'center', padding:'10px 0', borderBottom:i<5?`1px solid ${C.border}`:'none', cursor:'pointer' }}>
                <div style={{ width:22, height:22, borderRadius:'50%', background:c.done?C.success:`${C.success}12`, border:`2px solid ${c.done?C.success:C.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {c.done&&<span style={{display:'flex',color:'#fff',transform:'scale(0.7)'}}>{I.check}</span>}
                </div>
                <p style={{ fontSize:12, color:c.done?C.muted:C.type, textDecoration:c.done?'line-through':'none' }}>{c.l}</p>
                {!c.done&&<span style={{ display:'flex', marginLeft:'auto', color:C.primary }}>{I.chevR}</span>}
              </div>
            ))}
          </Card>
          {/* Quick actions */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Quick Actions" />
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
              {quickActions.map((a,i)=>(
                <button key={i} onClick={a.cb}
                  style={{ padding:'14px 6px', borderRadius:13, border:`1.5px solid ${C.border}`, background:'#FAFAFA', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:6, fontFamily:'Manrope,sans-serif', fontSize:10, fontWeight:700, color:C.sub, transition:'all 0.12s' }}
                  onMouseOver={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor=C.primary;(e.currentTarget as HTMLButtonElement).style.color=C.primary}}
                  onMouseOut={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor=C.border;(e.currentTarget as HTMLButtonElement).style.color=C.sub}}>
                  <p style={{ fontSize:22 }}>{a.e}</p>{a.l}
                </button>
              ))}
            </div>
          </Card>
        </div>
        {/* Right */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <Card style={{ padding:22, background:`linear-gradient(135deg,${C.warning}08,${C.surface})`, border:`1.5px solid ${C.warning}20` }}>
            <SectionTitle title="Verification Status" />
            {[{l:'Identity (NIC)',   done:true},{l:'Police Clearance',  done:true},{l:'Medical Certificate',done:true},{l:'Qualifications',    done:false}].map((v,i)=>(
              <div key={i} style={{ display:'flex', gap:10, alignItems:'center', padding:'8px 0', borderBottom:i<3?`1px solid ${C.border}`:'none' }}>
                <div style={{ width:22, height:22, borderRadius:'50%', background:v.done?`${C.success}12`:`${C.warning}12`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <span style={{ display:'flex', color:v.done?C.success:C.warning, transform:'scale(0.8)' }}>{v.done?I.check:I.upload}</span>
                </div>
                <p style={{ fontSize:12, color:C.type }}>{v.l}</p>
                <Bdg label={v.done?'Verified':'Pending'} color={v.done?C.success:C.warning} />
              </div>
            ))}
          </Card>
          <Card style={{ padding:22 }}>
            <SectionTitle title="Profile Analytics (30d)" />
            {[{l:'Profile Views',v:'234',trend:'+18%',c:C.primary},{l:'Booking Requests',v:'18',trend:'+12%',c:C.success},{l:'Hiring Rate',v:'72%',trend:'+4%',c:C.info},{l:'Avg Response',v:'4 min',trend:'−1 min',c:C.accent}].map((s,i)=>(
              <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:i<3?`1px solid ${C.border}`:'none' }}>
                <p style={{ fontSize:12, color:C.sub }}>{s.l}</p>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <p style={{ fontSize:13, fontWeight:800, color:s.c, fontFamily:'Manrope,sans-serif' }}>{s.v}</p>
                  <Bdg label={s.trend} color={C.success} />
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}

// ─── Public Profile ───────────────────────────────────────────────────────────
function PublicProfile({ onToast }:{ onToast:(m:string)=>void }) {
  const [editing, setEditing] = useState<string|null>(null)
  return (
    <div style={{ padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Public Profile</h2>
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:18 }} className="ap-main-split">
        <div>
          {/* Profile card */}
          <Card style={{ marginBottom:16, overflow:'hidden' }}>
            <div style={{ height:100, background:`linear-gradient(135deg,${C.primary},#004D52)`, position:'relative' as const }}>
              <button onClick={()=>onToast('Edit banner')} style={{ position:'absolute', top:8, right:8, background:'rgba(0,0,0,0.35)', border:'none', cursor:'pointer', borderRadius:7, padding:'5px 10px', color:'#fff', fontFamily:'Manrope,sans-serif', fontSize:10, fontWeight:700 }}>Edit</button>
            </div>
            <div style={{ padding:'0 22px 22px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginTop:-28 }}>
                <div style={{ width:64, height:64, borderRadius:'50%', background:`linear-gradient(135deg,${C.primary},#005D63)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontFamily:'Manrope,sans-serif', fontWeight:900, fontSize:20, border:'3px solid white' }}>KP</div>
                <Btn label="Edit" small icon={I.edit} onClick={()=>setEditing('bio')} />
              </div>
              <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginTop:10, marginBottom:3 }}>Kasun Perera</h2>
              <p style={{ fontSize:13, fontWeight:700, color:C.sub, marginBottom:8 }}>Certified Elderly Care Specialist</p>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' as const, marginBottom:14 }}>
                <Bdg label="Verified" color={C.primary} dot />
                <Bdg label="Top Rated" color={C.warning} dot />
                <Bdg label="Premium Agent" color={C.accent} dot />
                <Bdg label="Available Now" color={C.success} dot />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:16 }}>
                {[{v:'4.9★',l:'Rating'},{v:'652',l:'Services'},{v:'8 yrs',l:'Experience'},{v:'4 min',l:'Response'}].map((s,i)=>(
                  <div key={i} style={{ textAlign:'center' as const, padding:'10px', borderRadius:10, background:C.bg }}>
                    <p style={{ fontSize:15, fontWeight:900, color:C.primary, fontFamily:'Manrope,sans-serif', lineHeight:1 }}>{s.v}</p>
                    <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
                  </div>
                ))}
              </div>
              <div style={{ padding:'14px', borderRadius:12, background:C.bg, marginBottom:14, position:'relative' as const }}>
                <p style={{ fontSize:12, color:C.type, lineHeight:1.7 }}>Dedicated and compassionate care professional with over 8 years of experience supporting elderly patients and individuals with special needs in Colombo and surrounding districts. Fluent in English, Sinhala, and Tamil. Specialised in post-surgical recovery, dementia support, and hospital accompaniment. Committed to delivering dignified, empathetic care to every client.</p>
                {editing==='bio'&&<button onClick={()=>setEditing(null)} style={{ marginTop:10, background:'none', border:'none', cursor:'pointer', color:C.primary, fontFamily:'Manrope,sans-serif', fontSize:11, fontWeight:700 }}>Save changes</button>}
              </div>
              {[{icon:I.map,v:'Colombo, Sri Lanka · 25 km radius'},{icon:I.lang,v:'English, Sinhala, Tamil'},{icon:I.calendar,v:'Available · Mon–Sat, 6 AM–8 PM'}].map((r,i)=>(
                <div key={i} style={{ display:'flex', gap:8, alignItems:'center', marginBottom:8 }}>
                  <span style={{ display:'flex', color:C.muted }}>{r.icon}</span>
                  <p style={{ fontSize:12, color:C.sub }}>{r.v}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <Card style={{ padding:22 }}>
            <SectionTitle title="Profile Strength" />
            <div style={{ display:'flex', justifyContent:'center', marginBottom:14 }}>
              <ProgressRing pct={87} color={C.success} size={90} label="Strong" sub="87 / 100 points" />
            </div>
            {[{l:'Basic Info',pct:100},{l:'Experience',pct:100},{l:'Skills',pct:80},{l:'Certifications',pct:90},{l:'Availability',pct:60}].map((s,i)=>(
              <div key={i} style={{ marginBottom:8 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                  <p style={{ fontSize:11, color:C.sub }}>{s.l}</p>
                  <p style={{ fontSize:11, fontWeight:700, color:s.pct<80?C.warning:C.success }}>{s.pct}%</p>
                </div>
                <div style={{ height:4, borderRadius:99, background:`${s.pct<80?C.warning:C.success}15` }}>
                  <div style={{ width:`${s.pct}%`, height:'100%', background:s.pct<80?C.warning:C.success, borderRadius:99 }} />
                </div>
              </div>
            ))}
          </Card>
          <Card style={{ padding:22 }}>
            <SectionTitle title="Social Links" />
            {[{e:'💼',l:'LinkedIn',v:'linkedin.com/in/kasun-perera'},{e:'🌐',l:'Website',v:'Not added'}].map((s,i)=>(
              <div key={i} style={{ display:'flex', gap:10, alignItems:'center', padding:'8px 0', borderBottom:i<1?`1px solid ${C.border}`:'none' }}>
                <span style={{ fontSize:18 }}>{s.e}</span>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:11, fontWeight:700, color:C.muted }}>{s.l}</p>
                  <p style={{ fontSize:11, color:C.sub }}>{s.v}</p>
                </div>
                <button onClick={()=>onToast('Opening edit…')} style={{ background:'none', border:'none', cursor:'pointer', color:C.primary, display:'flex' }}><span style={{display:'flex'}}>{I.edit}</span></button>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}

// ─── Professional Experience ──────────────────────────────────────────────────
function Experience({ onToast }:{ onToast:(m:string)=>void }) {
  const jobs = [
    { org:'Lanka Hospitals Corporation', role:'Senior Care Coordinator', period:'2020 – Present', type:'Current', highlight:'Led care delivery for 120+ elderly patients; achieved 4.95 avg satisfaction score', current:true },
    { org:'National Hospital Colombo',   role:'Patient Care Assistant',  period:'2018 – 2020',   type:'Past',    highlight:'Assisted surgical recovery ward, handling 40 patients per shift', current:false },
    { org:'Asiri Medical Hospital',      role:'Care Support Worker',     period:'2016 – 2018',   type:'Past',    highlight:'Home visit programme covering Colombo 3–7 districts', current:false },
  ]
  return (
    <div style={{ maxWidth:780, margin:'0 auto', padding:'24px 28px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
        <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Professional Experience</h2>
        <Btn label="Add Experience" small icon={I.plus} onClick={()=>onToast('Add experience form')} />
      </div>
      {jobs.map((j,i)=>(
        <Card key={i} style={{ padding:22, marginBottom:14, border:j.current?`1.5px solid ${C.primary}30`:undefined }}>
          <div style={{ display:'flex', gap:14 }}>
            <div style={{ width:52, height:52, borderRadius:14, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>🏥</div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
                <div>
                  <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:2 }}>
                    <p style={{ fontSize:15, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{j.role}</p>
                    {j.current&&<Bdg label="Current" color={C.success} dot />}
                  </div>
                  <p style={{ fontSize:13, fontWeight:600, color:C.primary }}>{j.org}</p>
                </div>
                <div style={{ display:'flex', gap:6 }}>
                  <button onClick={()=>onToast('Edit experience')} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, display:'flex' }}><span style={{display:'flex'}}>{I.edit}</span></button>
                  {!j.current&&<button onClick={()=>onToast('Delete experience')} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, display:'flex' }}><span style={{display:'flex'}}>{I.trash}</span></button>}
                </div>
              </div>
              <p style={{ fontSize:11, color:C.muted, marginBottom:8 }}>{j.period}</p>
              <p style={{ fontSize:12, color:C.sub, lineHeight:1.7 }}>{j.highlight}</p>
            </div>
          </div>
        </Card>
      ))}
      {/* Timeline summary */}
      <Card style={{ padding:22 }}>
        <SectionTitle title="Career Timeline" />
        <div style={{ position:'relative' as const, paddingLeft:24 }}>
          <div style={{ position:'absolute', left:8, top:6, bottom:6, width:2, background:`${C.primary}20`, borderRadius:99 }} />
          {[{y:'2024',e:'652nd service completed — Milestone achievement'},{y:'2022',e:'Earned Top Rated Care Agent badge'},{y:'2020',e:'Joined Lanka Hospitals as Senior Coordinator'},{y:'2018',e:'2 years at National Hospital Colombo complete'},{y:'2016',e:'Began care career at Asiri Medical Hospital'}].map((ev,i)=>(
            <div key={i} style={{ display:'flex', gap:12, marginBottom:12, position:'relative' as const }}>
              <div style={{ position:'absolute', left:-18, top:3, width:10, height:10, borderRadius:'50%', background:i===0?C.primary:`${C.primary}30`, border:`2px solid ${i===0?C.primary:C.border}`, flexShrink:0 }} />
              <div>
                <p style={{ fontSize:11, fontWeight:800, color:C.primary, marginBottom:2 }}>{ev.y}</p>
                <p style={{ fontSize:12, color:C.sub }}>{ev.e}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Services Offered ─────────────────────────────────────────────────────────
function ServicesOffered({ onToast }:{ onToast:(m:string)=>void }) {
  const services = [
    {e:'🏥',l:'Hospital Companion',        desc:'Accompanying clients to hospital appointments and providing support throughout medical visits.',        exp:'6 yrs', price:'LKR 3,000–6,000/visit',   avail:true },
    {e:'💊',l:'Medication Collection',     desc:'Collecting prescriptions and medications from pharmacies on behalf of clients.',                          exp:'8 yrs', price:'LKR 1,500–3,000/trip',    avail:true },
    {e:'🏠',l:'Home Care',                 desc:'Comprehensive in-home care including personal hygiene, meal preparation, and daily living assistance.',   exp:'7 yrs', price:'LKR 5,000–12,000/day',   avail:true },
    {e:'🚗',l:'Transportation Assistance', desc:'Safe transport for elderly or mobility-limited clients to medical and community appointments.',            exp:'4 yrs', price:'LKR 2,500–5,000/trip',   avail:true },
    {e:'♿',l:'Wheelchair Assistance',     desc:'Mobility support and wheelchair navigation in hospitals, malls, and public spaces.',                       exp:'5 yrs', price:'LKR 2,000–4,000/session', avail:true },
    {e:'🩺',l:'Post-Surgery Care',         desc:'Specialised recovery care following surgical procedures, including wound monitoring and physio support.',  exp:'5 yrs', price:'LKR 8,000–18,000/day',   avail:true },
    {e:'🧠',l:'Dementia Care',             desc:'Patient, specialised care for individuals with dementia, including memory activities and supervision.',    exp:'4 yrs', price:'LKR 9,000–20,000/day',   avail:false},
    {e:'🫀',l:'Stroke Care',               desc:'Dedicated stroke recovery support including physiotherapy assistance and cognitive stimulation.',          exp:'3 yrs', price:'LKR 10,000–22,000/day',  avail:false},
    {e:'🧘',l:'Mental Health Support',     desc:'Companionship and structured daily routine support for clients managing mental health conditions.',         exp:'2 yrs', price:'LKR 4,000–8,000/session', avail:true },
    {e:'🛒',l:'Shopping Assistance',       desc:'Grocery shopping, errands, and delivery for homebound clients.',                                           exp:'8 yrs', price:'LKR 1,000–2,500/trip',   avail:true },
    {e:'💳',l:'Bill Payments',             desc:'Handling utility and service bill payments on behalf of clients.',                                          exp:'8 yrs', price:'LKR 500–1,500/visit',    avail:true },
  ]
  return (
    <div style={{ padding:'24px 28px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
        <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Services Offered</h2>
        <Btn label="Add Service" small icon={I.plus} onClick={()=>onToast('Add service form')} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }} className="ap-3col">
        {services.map((s,i)=>(
          <Card key={i} hover style={{ padding:20, border:!s.avail?`1px solid ${C.border}`:undefined, opacity:s.avail?1:0.75 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
              <div style={{ width:48, height:48, borderRadius:14, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>{s.e}</div>
              <div style={{ display:'flex', gap:5, alignItems:'center' }}>
                <Bdg label={s.avail?'Active':'Paused'} color={s.avail?C.success:C.muted} dot />
                <button onClick={()=>onToast('Edit service')} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, display:'flex' }}><span style={{display:'flex'}}>{I.edit}</span></button>
              </div>
            </div>
            <p style={{ fontSize:13, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:5 }}>{s.l}</p>
            <p style={{ fontSize:11, color:C.sub, lineHeight:1.6, marginBottom:10 }}>{s.desc}</p>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:11 }}>
              <span style={{ color:C.muted }}>{s.exp} exp</span>
              <span style={{ color:C.primary, fontWeight:700 }}>{s.price}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Skills ───────────────────────────────────────────────────────────────────
function Skills({ onToast }:{ onToast:(m:string)=>void }) {
  const categories = [
    { cat:'Clinical', skills:[{l:'Patient Assessment',lvl:95,verified:true,yrs:8},{l:'Wound Care',lvl:85,verified:true,yrs:5},{l:'Medication Management',lvl:90,verified:true,yrs:8},{l:'Vital Signs Monitoring',lvl:88,verified:false,yrs:6}] },
    { cat:'Communication', skills:[{l:'Active Listening',lvl:98,verified:false,yrs:8},{l:'Family Communication',lvl:92,verified:false,yrs:7},{l:'Bilingual Care (Sinhala/Tamil)',lvl:95,verified:true,yrs:8}] },
    { cat:'Specialist', skills:[{l:'Dementia Care',lvl:82,verified:true,yrs:4},{l:'Post-Surgery Recovery',lvl:88,verified:true,yrs:5},{l:'Stroke Rehabilitation Support',lvl:75,verified:false,yrs:3}] },
  ]
  return (
    <div style={{ padding:'24px 28px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
        <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Skills</h2>
        <Btn label="Add Skill" small icon={I.plus} onClick={()=>onToast('Add skill form')} />
      </div>
      {categories.map((c,i)=>(
        <Card key={i} style={{ padding:22, marginBottom:14 }}>
          <SectionTitle title={c.cat} />
          {c.skills.map((s,j)=>(
            <div key={j} style={{ marginBottom:12, paddingBottom:12, borderBottom:j<c.skills.length-1?`1px solid ${C.border}`:'none' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{s.l}</p>
                  {s.verified&&<Bdg label="Verified" color={C.success} />}
                </div>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <p style={{ fontSize:11, color:C.muted }}>{s.yrs} yrs</p>
                  <p style={{ fontSize:12, fontWeight:800, color:C.primary }}>{s.lvl}%</p>
                </div>
              </div>
              <div style={{ height:6, borderRadius:99, background:`${C.primary}12` }}>
                <div style={{ width:`${s.lvl}%`, height:'100%', background:`linear-gradient(90deg,${C.primary},${C.accent})`, borderRadius:99 }} />
              </div>
            </div>
          ))}
        </Card>
      ))}
      <Card style={{ padding:22 }}>
        <SectionTitle title="Endorsements" action="Request Endorsement" />
        <div style={{ textAlign:'center' as const, padding:'28px 0' }}>
          <p style={{ fontSize:32, marginBottom:10 }}>🤝</p>
          <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:6 }}>Endorsements feature coming soon</p>
          <p style={{ fontSize:12, color:C.muted }}>Clients and colleagues will be able to endorse your skills directly from your profile.</p>
        </div>
      </Card>
    </div>
  )
}

// ─── Certifications ───────────────────────────────────────────────────────────
function Certifications({ onToast }:{ onToast:(m:string)=>void }) {
  const certs = [
    { name:'Registered Nurse (RN)', org:'Sri Lanka Nursing Council', issued:'Jan 2016', expiry:'Jan 2026', status:'active', daysLeft:180 },
    { name:'First Aid & CPR',        org:'Sri Lanka Red Cross',       issued:'Mar 2023', expiry:'Mar 2025', status:'expiring', daysLeft:45  },
    { name:'Dementia Care Specialist',org:'Alzheimer\'s Lanka Foundation', issued:'Jun 2020', expiry:'Jun 2025', status:'active', daysLeft:210 },
    { name:'Manual Handling',        org:'Occupational Health Lanka', issued:'Sep 2022', expiry:'Sep 2024', status:'expired', daysLeft:-90 },
  ]
  const statusColor = (s:string) => s==='active'?C.success:s==='expiring'?C.warning:C.error
  return (
    <div style={{ maxWidth:780, margin:'0 auto', padding:'24px 28px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
        <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Certifications</h2>
        <Btn label="Upload Certificate" small icon={I.upload} onClick={()=>onToast('Opening upload…')} />
      </div>
      {certs.map((c,i)=>(
        <Card key={i} style={{ padding:22, marginBottom:12, border:c.status==='expiring'?`1.5px solid ${C.warning}40`:c.status==='expired'?`1.5px solid ${C.error}30`:undefined }}>
          <div style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
            <div style={{ width:52, height:52, borderRadius:14, background:`${statusColor(c.status)}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>📜</div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
                <div>
                  <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:3 }}>
                    <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{c.name}</p>
                    <Bdg label={c.status==='active'?'Active':c.status==='expiring'?'Expiring Soon':'Expired'} color={statusColor(c.status)} dot />
                  </div>
                  <p style={{ fontSize:12, fontWeight:600, color:C.primary }}>{c.org}</p>
                  <p style={{ fontSize:11, color:C.muted, marginTop:2 }}>Issued: {c.issued} · Expires: {c.expiry}</p>
                </div>
                <div style={{ display:'flex', gap:6 }}>
                  {c.status!=='expired'&&<Btn label="View" variant="ghost" small onClick={()=>onToast('Viewing certificate')} />}
                  {c.status==='expired'&&<Btn label="Renew" variant="accent" small onClick={()=>onToast('Opening renewal form')} />}
                  <button onClick={()=>onToast('Delete certificate')} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, display:'flex' }}><span style={{display:'flex'}}>{I.trash}</span></button>
                </div>
              </div>
              {c.status==='expiring'&&(
                <div style={{ display:'flex', gap:6, alignItems:'center', marginTop:8, padding:'8px 12px', borderRadius:9, background:`${C.warning}10`, border:`1px solid ${C.warning}30` }}>
                  <span style={{ fontSize:14 }}>⚠️</span>
                  <p style={{ fontSize:11, color:C.warning, fontWeight:700 }}>Expires in {c.daysLeft} days — renew before {c.expiry}</p>
                  <Btn label="Renew Now" variant="accent" small onClick={()=>onToast('Opening renewal form')} />
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
      {/* Upload zone */}
      <button onClick={()=>onToast('Opening upload form…')}
        style={{ width:'100%', padding:'22px', borderRadius:14, border:`2px dashed ${C.border}`, background:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
        <span style={{ display:'flex', color:C.muted, transform:'scale(1.5)' }}>{I.upload}</span>
        <p style={{ fontSize:13, fontWeight:700, color:C.muted }}>Upload New Certificate</p>
        <p style={{ fontSize:11, color:C.muted }}>PDF or image · Max 10 MB</p>
      </button>
    </div>
  )
}

// ─── Portfolio ────────────────────────────────────────────────────────────────
function Portfolio({ onToast }:{ onToast:(m:string)=>void }) {
  const testimonials = [
    { name:'Mrs. Priya Fernando', text:"Kasun's care for my mother during her post-surgery recovery was exceptional. Always punctual, professional, and genuinely caring.", rating:5 },
    { name:'Mohamed Ihsan',       text:'Provided outstanding support throughout my father\'s hospital appointments. Highly recommend Kasun to any family needing compassionate care.', rating:5 },
    { name:'Chamari Wickrama',    text:'Kasun helped us navigate a very difficult time with patience and expertise. A true professional.', rating:5 },
  ]
  return (
    <div style={{ padding:'24px 28px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
        <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Portfolio</h2>
        <Btn label="Add" small icon={I.plus} onClick={()=>onToast('Add portfolio item')} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:20 }} className="ap-2col">
        <Card style={{ padding:22 }}>
          <SectionTitle title="Professional Highlights" />
          {[{e:'🏆',l:'652 Completed Services',sub:'Top 5% of all active agents'},{e:'⭐',l:'4.9 Average Rating',sub:'Based on 234 verified reviews'},{e:'🔄',l:'67% Repeat Clients',sub:'Above platform average of 45%'},{e:'📍',l:'25 km Service Radius',sub:'Colombo and suburbs'}].map((h,i)=>(
            <div key={i} style={{ display:'flex', gap:12, alignItems:'center', padding:'10px 0', borderBottom:i<3?`1px solid ${C.border}`:'none' }}>
              <span style={{ fontSize:22 }}>{h.e}</span>
              <div><p style={{ fontSize:12, fontWeight:700, color:C.type }}>{h.l}</p><p style={{ fontSize:11, color:C.muted }}>{h.sub}</p></div>
            </div>
          ))}
        </Card>
        <Card style={{ padding:22 }}>
          <SectionTitle title="Case Studies" action="Add Case Study" onAction={()=>onToast('Add case study form')} />
          <div style={{ textAlign:'center' as const, padding:'28px 0' }}>
            <p style={{ fontSize:36, marginBottom:10 }}>📋</p>
            <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:6 }}>Case Studies Placeholder</p>
            <p style={{ fontSize:12, color:C.muted }}>Share anonymised care scenarios to showcase your skills to potential clients.</p>
            <div style={{ marginTop:14 }}><Btn label="Add First Case Study" variant="secondary" small onClick={()=>onToast('Add case study')} /></div>
          </div>
        </Card>
      </div>
      {/* Photos */}
      <Card style={{ padding:22, marginBottom:14 }}>
        <SectionTitle title="Professional Photos" action="Upload" onAction={()=>onToast('Upload photo')} />
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:8 }}>
          {[...Array(4)].map((_,i)=>(
            <div key={i} style={{ aspectRatio:'1', borderRadius:12, background:`linear-gradient(135deg,${C.primary}${10+i*5},${C.bg})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28 }}>
              {['🏥','🧓','💊','🩺'][i]}
            </div>
          ))}
          <div onClick={()=>onToast('Upload photo')} style={{ aspectRatio:'1', borderRadius:12, border:`2px dashed ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
            <span style={{ display:'flex', color:C.muted }}>{I.plus}</span>
          </div>
        </div>
      </Card>
      {/* Testimonials */}
      <Card style={{ padding:22 }}>
        <SectionTitle title="Client Testimonials" />
        {testimonials.map((t,i)=>(
          <div key={i} style={{ padding:'14px', borderRadius:12, background:`${C.primary}04`, border:`1px solid ${C.primary}10`, marginBottom:10 }}>
            <div style={{ display:'flex', gap:2, marginBottom:8 }}>
              {[...Array(t.rating)].map((_,j)=>(
                <span key={j} style={{ color:C.warning, display:'flex' }}>{I.star}</span>
              ))}
            </div>
            <p style={{ fontSize:12, color:C.sub, lineHeight:1.7, marginBottom:8, fontStyle:'italic' }}>"{t.text}"</p>
            <p style={{ fontSize:11, fontWeight:700, color:C.type }}>— {t.name}</p>
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── Reviews Showcase ─────────────────────────────────────────────────────────
function Reviews() {
  const catRatings = [{l:'Professionalism',v:4.9},{l:'Communication',v:4.8},{l:'Punctuality',v:4.9},{l:'Care Quality',v:5.0},{l:'Reliability',v:4.8}]
  const recent = [
    { name:'Priya Fernando',   date:'20 Jan', rating:5, txt:'Excellent care during post-surgery period. Kasun was attentive, knowledgeable, and compassionate.' },
    { name:'Mohamed Ihsan',    date:'17 Jan', rating:5, txt:'Took my father to his cardiology appointment. Very professional and reassuring for the whole family.' },
    { name:'Chamari Wickrama', date:'12 Jan', rating:4, txt:'Good service for home wellness visit. Arrived on time and handled everything smoothly.' },
    { name:'Nirosha Jayasena', date:'8 Jan',  rating:5, txt:'Wonderful support with medication management. Clear communication and genuine kindness.' },
  ]
  return (
    <div style={{ padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Reviews Showcase</h2>
      <div style={{ display:'grid', gridTemplateColumns:'300px 1fr', gap:18, marginBottom:18 }} className="ap-main-split">
        <Card style={{ padding:24, textAlign:'center' as const }}>
          <p style={{ fontSize:56, fontWeight:900, color:C.warning, fontFamily:'Manrope,sans-serif', lineHeight:1 }}>4.9</p>
          <div style={{ display:'flex', justifyContent:'center', gap:3, marginBottom:10 }}>
            {[...Array(5)].map((_,i)=><span key={i} style={{ color:C.warning, display:'flex' }}>{I.star}</span>)}
          </div>
          <p style={{ fontSize:12, color:C.muted, marginBottom:18 }}>Based on 234 reviews</p>
          {catRatings.map((r,i)=>(
            <div key={i} style={{ marginBottom:8 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                <p style={{ fontSize:11, color:C.sub, textAlign:'left' as const }}>{r.l}</p>
                <p style={{ fontSize:11, fontWeight:700, color:C.warning }}>{r.v}</p>
              </div>
              <div style={{ height:4, borderRadius:99, background:`${C.warning}15` }}>
                <div style={{ width:`${(r.v/5)*100}%`, height:'100%', background:C.warning, borderRadius:99 }} />
              </div>
            </div>
          ))}
        </Card>
        <div>
          {recent.map((r,i)=>(
            <Card key={i} hover style={{ padding:20, marginBottom:10 }}>
              <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                <div style={{ width:40, height:40, borderRadius:'50%', background:`${C.primary}12`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary, fontWeight:900, fontSize:13, flexShrink:0 }}>
                  {r.name.split(' ').map(x=>x[0]).join('')}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                    <div>
                      <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{r.name}</p>
                      <div style={{ display:'flex', gap:2 }}>
                        {[...Array(r.rating)].map((_,j)=><span key={j} style={{ color:C.warning, display:'flex', transform:'scale(0.85)' }}>{I.star}</span>)}
                      </div>
                    </div>
                    <p style={{ fontSize:11, color:C.muted }}>{r.date}</p>
                  </div>
                  <p style={{ fontSize:12, color:C.sub, lineHeight:1.7 }}>{r.txt}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Availability ─────────────────────────────────────────────────────────────
function Availability({ onToast }:{ onToast:(m:string)=>void }) {
  const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  const [schedule, setSchedule] = useState<Record<string,{on:boolean;start:string;end:string}>>({
    Mon:{on:true,start:'06:00',end:'20:00'}, Tue:{on:true,start:'06:00',end:'20:00'}, Wed:{on:false,start:'09:00',end:'17:00'},
    Thu:{on:true,start:'06:00',end:'20:00'}, Fri:{on:true,start:'06:00',end:'20:00'}, Sat:{on:true,start:'08:00',end:'18:00'}, Sun:{on:false,start:'10:00',end:'16:00'},
  })
  const [vacMode, setVacMode] = useState(false)
  const [emergency, setEmergency] = useState(true)
  return (
    <div style={{ maxWidth:780, margin:'0 auto', padding:'24px 28px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
        <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Availability</h2>
        <Btn label="Save Schedule" onClick={()=>onToast('Availability saved!')} />
      </div>
      {/* Toggles */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:18 }}>
        {[{l:'Vacation Mode', sub:'Pause all new bookings', val:vacMode, set:setVacMode, c:C.warning},{l:'Emergency Availability',sub:'Accept urgent same-day requests', val:emergency, set:setEmergency, c:C.success}].map((t,i)=>(
          <Card key={i} style={{ padding:18, border:`1.5px solid ${t.val?t.c+'30':C.border}`, background:t.val?`${t.c}04`:C.surface }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{t.l}</p>
                <p style={{ fontSize:11, color:C.muted }}>{t.sub}</p>
              </div>
              <button onClick={()=>t.set((v:boolean)=>!v)}
                style={{ width:48, height:26, borderRadius:99, background:t.val?t.c:'#D0D9DD', border:'none', cursor:'pointer', position:'relative' as const, transition:'all 0.2s' }}>
                <div style={{ position:'absolute', top:3, left:t.val?24:3, width:20, height:20, borderRadius:'50%', background:'white', boxShadow:'0 1px 4px rgba(0,0,0,0.2)', transition:'left 0.2s' }}/>
              </button>
            </div>
          </Card>
        ))}
      </div>
      {/* Weekly schedule */}
      <Card style={{ padding:22, marginBottom:14 }}>
        <SectionTitle title="Weekly Schedule" />
        {DAYS.map(d=>{
          const s=schedule[d]
          return (
            <div key={d} style={{ display:'flex', gap:14, alignItems:'center', padding:'10px 0', borderBottom:d!=='Sun'?`1px solid ${C.border}`:'none' }}>
              <div style={{ width:44 }}>
                <button onClick={()=>setSchedule(prev=>({...prev,[d]:{...prev[d],on:!prev[d].on}}))}
                  style={{ width:44, height:24, borderRadius:99, background:s.on?C.success:'#D0D9DD', border:'none', cursor:'pointer', position:'relative' as const, transition:'all 0.18s' }}>
                  <div style={{ position:'absolute', top:2, left:s.on?22:2, width:20, height:20, borderRadius:'50%', background:'white', transition:'left 0.18s' }}/>
                </button>
              </div>
              <p style={{ width:36, fontSize:12, fontWeight:700, color:s.on?C.type:C.muted }}>{d}</p>
              {s.on ? (
                <div style={{ display:'flex', gap:8, alignItems:'center', flex:1 }}>
                  <input type="time" value={s.start} onChange={e=>setSchedule(prev=>({...prev,[d]:{...prev[d],start:e.target.value}}))}
                    style={{ padding:'5px 8px', borderRadius:8, border:`1px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, background:'#FAFAFA', outline:'none' }} />
                  <span style={{ color:C.muted, fontSize:11 }}>to</span>
                  <input type="time" value={s.end} onChange={e=>setSchedule(prev=>({...prev,[d]:{...prev[d],end:e.target.value}}))}
                    style={{ padding:'5px 8px', borderRadius:8, border:`1px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, background:'#FAFAFA', outline:'none' }} />
                  <Bdg label={`${parseInt(s.end.split(':')[0])-parseInt(s.start.split(':')[0])}h`} color={C.primary} />
                </div>
              ) : (
                <p style={{ fontSize:12, color:C.muted, flex:1 }}>Day off</p>
              )}
            </div>
          )
        })}
      </Card>
      {/* Time off */}
      <Card style={{ padding:22 }}>
        <SectionTitle title="Upcoming Time Off" action="Add Time Off" onAction={()=>onToast('Add time off')} />
        <div style={{ textAlign:'center' as const, padding:'22px 0' }}>
          <p style={{ fontSize:30, marginBottom:8 }}>📅</p>
          <p style={{ fontSize:12, color:C.muted }}>No time off scheduled. Add upcoming vacations or leave.</p>
        </div>
      </Card>
    </div>
  )
}

// ─── Service Areas ────────────────────────────────────────────────────────────
function ServiceAreas({ onToast }:{ onToast:(m:string)=>void }) {
  const districts = ['Colombo','Dehiwala-Mount Lavinia','Sri Jayawardenepura Kotte','Kaduwela','Maharagama']
  return (
    <div style={{ maxWidth:780, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Service Areas</h2>
      {/* SVG map placeholder */}
      <Card style={{ padding:22, marginBottom:18 }}>
        <SectionTitle title="Coverage Map" action="Edit" onAction={()=>onToast('Edit coverage area')} />
        <div style={{ position:'relative' as const, height:260, borderRadius:14, overflow:'hidden', background:'#E8F4F8' }}>
          <svg viewBox="0 0 500 260" style={{ width:'100%', height:'100%' }}>
            <rect width="500" height="260" fill="#EBF5F6"/>
            {[...Array(14)].map((_,i)=><line key={`h${i}`} x1="0" y1={i*20} x2="500" y2={i*20} stroke="#D0E8EA" strokeWidth="0.5"/>)}
            {[...Array(26)].map((_,i)=><line key={`v${i}`} x1={i*20} y1="0" x2={i*20} y2="260" stroke="#D0E8EA" strokeWidth="0.5"/>)}
            {/* Sri Lanka simplified coastline placeholder */}
            <ellipse cx="250" cy="130" rx="60" ry="100" fill={`${C.primary}15`} stroke={C.primary} strokeWidth="1.5"/>
            {/* Coverage radius */}
            <circle cx="255" cy="100" r="70" fill={`${C.primary}12`} stroke={C.primary} strokeWidth="1.5" strokeDasharray="6 4"/>
            {/* Agent pin */}
            <circle cx="255" cy="100" r="14" fill={C.primary}/>
            <text x="255" y="105" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white" fontFamily="Manrope,sans-serif">KP</text>
            {/* District dots */}
            {[{x:240,y:120},{x:270,y:90},{x:230,y:85},{x:265,y:115},{x:285,y:105}].map((p,i)=>(
              <circle key={i} cx={p.x} cy={p.y} r={5} fill={C.accent} opacity={0.7}/>
            ))}
          </svg>
          <div style={{ position:'absolute', bottom:12, left:12, background:'rgba(255,255,255,0.92)', borderRadius:10, padding:'8px 12px', fontSize:11, fontWeight:700, color:C.type, backdropFilter:'blur(6px)' }}>
            📍 Colombo · 25 km radius
          </div>
        </div>
      </Card>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <Card style={{ padding:22 }}>
          <SectionTitle title="Preferred Districts" action="Add District" onAction={()=>onToast('Add district')} />
          {districts.map((d,i)=>(
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:i<districts.length-1?`1px solid ${C.border}`:'none' }}>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <span style={{ display:'flex', color:C.primary }}>{I.map}</span>
                <p style={{ fontSize:12, color:C.type }}>{d}</p>
              </div>
              <button onClick={()=>onToast('Remove district')} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, display:'flex' }}><span style={{display:'flex'}}>{I.trash}</span></button>
            </div>
          ))}
        </Card>
        <Card style={{ padding:22 }}>
          <SectionTitle title="Travel Settings" />
          {[{l:'Travel Radius',v:'25 km'},{l:'Current Location',v:'Colombo 3'},{l:'Travel Charges',v:'LKR 50/km beyond 10 km'},{l:'Max Daily Travel',v:'50 km total'}].map((s,i)=>(
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:i<3?`1px solid ${C.border}`:'none' }}>
              <p style={{ fontSize:12, color:C.sub }}>{s.l}</p>
              <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{s.v}</p>
            </div>
          ))}
          <div style={{ marginTop:14 }}><Btn label="Edit Travel Settings" variant="secondary" small full onClick={()=>onToast('Edit travel settings')} /></div>
        </Card>
      </div>
    </div>
  )
}

// ─── Pricing Preferences ──────────────────────────────────────────────────────
function Pricing({ onToast }:{ onToast:(m:string)=>void }) {
  const rates = [
    {l:'Standard Hourly Rate',      v:'LKR 1,800/hr', icon:'⏰', c:C.primary},
    {l:'Full Day Rate',              v:'LKR 12,000/day',icon:'📅', c:C.success},
    {l:'Emergency / Same-Day Rate', v:'LKR 2,500/hr',  icon:'⚡', c:C.error},
    {l:'Weekend Rate',               v:'LKR 2,200/hr',  icon:'🗓️', c:C.info},
    {l:'Public Holiday Rate',        v:'LKR 2,800/hr',  icon:'🎉', c:C.accent},
    {l:'Travel Charges',             v:'LKR 50/km',     icon:'🚗', c:C.warning},
  ]
  return (
    <div style={{ maxWidth:700, margin:'0 auto', padding:'24px 28px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
        <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Pricing Preferences</h2>
        <Btn label="Save Pricing" onClick={()=>onToast('Pricing saved!')} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:18 }} className="ap-2col">
        {rates.map((r,i)=>(
          <Card key={i} hover style={{ padding:22 }}>
            <div style={{ display:'flex', gap:12, alignItems:'center' }}>
              <div style={{ width:48, height:48, borderRadius:14, background:`${r.c}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{r.icon}</div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:11, color:C.muted, marginBottom:2 }}>{r.l}</p>
                <p style={{ fontSize:16, fontWeight:900, color:r.c, fontFamily:'Manrope,sans-serif', lineHeight:1 }}>{r.v}</p>
              </div>
              <button onClick={()=>onToast('Edit rate')} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, display:'flex' }}><span style={{display:'flex'}}>{I.edit}</span></button>
            </div>
          </Card>
        ))}
      </div>
      <Card style={{ padding:22 }}>
        <SectionTitle title="Future Pricing Rules" action="Add Rule" onAction={()=>onToast('Add pricing rule')} />
        <div style={{ textAlign:'center' as const, padding:'22px 0' }}>
          <p style={{ fontSize:30, marginBottom:8 }}>⚙️</p>
          <p style={{ fontSize:12, color:C.muted }}>Advanced pricing rules (minimum booking duration, cancellation fees) coming soon.</p>
        </div>
      </Card>
    </div>
  )
}

// ─── Languages ────────────────────────────────────────────────────────────────
function Languages({ onToast }:{ onToast:(m:string)=>void }) {
  const langs = [{l:'English',flag:'🇬🇧',lvl:'Fluent',pct:92},{l:'Sinhala',flag:'🇱🇰',lvl:'Native',pct:100},{l:'Tamil',flag:'🇱🇰',lvl:'Proficient',pct:78}]
  return (
    <div style={{ maxWidth:580, margin:'0 auto', padding:'24px 28px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
        <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Languages</h2>
        <Btn label="Add Language" small icon={I.plus} onClick={()=>onToast('Add language')} />
      </div>
      {langs.map((lg,i)=>(
        <Card key={i} style={{ padding:22, marginBottom:12 }}>
          <div style={{ display:'flex', gap:14, alignItems:'center' }}>
            <div style={{ fontSize:38, flexShrink:0 }}>{lg.flag}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{lg.l}</p>
                <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                  <Bdg label={lg.lvl} color={C.primary} />
                  <button onClick={()=>onToast('Edit language')} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, display:'flex' }}><span style={{display:'flex'}}>{I.edit}</span></button>
                </div>
              </div>
              <div style={{ height:6, borderRadius:99, background:`${C.primary}12` }}>
                <div style={{ width:`${lg.pct}%`, height:'100%', background:`linear-gradient(90deg,${C.primary},${C.accent})`, borderRadius:99 }} />
              </div>
              <p style={{ fontSize:10, color:C.muted, marginTop:3 }}>{lg.pct}% proficiency</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Achievements ─────────────────────────────────────────────────────────────
function Achievements() {
  const badges = [
    {e:'⭐',l:'Top Rated',        sub:'Maintained 4.8+ rating for 6 months',      earned:true,  c:C.warning },
    {e:'⚡',l:'Fast Responder',   sub:'Average reply under 5 minutes',             earned:true,  c:C.info    },
    {e:'🛡️',l:'Verified Pro',     sub:'All documents verified by ReadyPal',         earned:true,  c:C.primary },
    {e:'💎',l:'Premium Agent',    sub:'Top 5% performance for 3 months',           earned:true,  c:C.accent  },
    {e:'🔄',l:'Loyal Clients',    sub:'50%+ repeat client booking rate',           earned:true,  c:C.success },
    {e:'🏆',l:'500 Services',     sub:'Completed 500 care visits',                 earned:true,  c:C.warning },
    {e:'🌟',l:'1000 Services',    sub:'Complete 1000 visits to unlock',            earned:false, c:C.muted   },
    {e:'🥇',l:'Elite Care Agent', sub:'Top 1% platform-wide for 1 year',          earned:false, c:C.muted   },
  ]
  return (
    <div style={{ padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Achievements</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:18 }} className="ap-4col">
        {badges.map((b,i)=>(
          <Card key={i} style={{ padding:22, textAlign:'center' as const, opacity:b.earned?1:0.55, border:b.earned?`1.5px solid ${b.c}25`:undefined }}>
            <div style={{ width:56, height:56, borderRadius:20, background:b.earned?`${b.c}12`:`${b.c}06`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, margin:'0 auto 10px' }}>{b.e}</div>
            <p style={{ fontSize:12, fontWeight:800, color:b.earned?b.c:C.muted, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>{b.l}</p>
            <p style={{ fontSize:10, color:C.muted, lineHeight:1.5 }}>{b.sub}</p>
            {b.earned&&<div style={{ marginTop:8, display:'flex', justifyContent:'center' }}><Bdg label="Earned" color={b.c} /></div>}
          </Card>
        ))}
      </div>
      {/* Milestones */}
      <Card style={{ padding:22 }}>
        <SectionTitle title="Service Milestones" />
        {[{v:652,target:1000,e:'🎯',l:'Total Services Completed'},{v:342,target:365,e:'📅',l:'Days Active on Platform'},{v:67,target:100,e:'🔄',l:'Repeat Client Rate (%)'}].map((m,i)=>(
          <div key={i} style={{ display:'flex', gap:12, alignItems:'center', padding:'12px 0', borderBottom:i<2?`1px solid ${C.border}`:'none' }}>
            <span style={{ fontSize:24 }}>{m.e}</span>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{m.l}</p>
                <p style={{ fontSize:12, fontWeight:700, color:C.primary }}>{m.v} / {m.target}</p>
              </div>
              <div style={{ height:6, borderRadius:99, background:`${C.primary}12` }}>
                <div style={{ width:`${Math.min((m.v/m.target)*100,100)}%`, height:'100%', background:C.primary, borderRadius:99 }} />
              </div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── Career Insights ──────────────────────────────────────────────────────────
function CareerInsights() {
  const metrics = [
    {l:'Profile Views',v:'234',trend:'+18%',c:C.primary},{l:'Hiring Rate',v:'72%',trend:'+4%',c:C.success},
    {l:'Booking Conversion',v:'58%',trend:'+8%',c:C.info},{l:'Avg Response Time',v:'4 min',trend:'−1 min',c:C.accent},
    {l:'Acceptance Rate',v:'94%',trend:'+2%',c:C.warning},{l:'Completion Rate',v:'98%',trend:'→',c:C.success},
  ]
  return (
    <div style={{ padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Career Insights</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:18 }} className="ap-3col">
        {metrics.map((m,i)=>(
          <Card key={i} style={{ padding:22, textAlign:'center' as const }}>
            <p style={{ fontSize:28, fontWeight:900, color:m.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{m.v}</p>
            <p style={{ fontSize:11, color:C.muted, marginBottom:8 }}>{m.l}</p>
            <Bdg label={m.trend} color={m.trend.startsWith('+')||m.trend==='→'?C.success:C.warning} />
          </Card>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <Card style={{ padding:22 }}>
          <SectionTitle title="Rating Trend (6 months)" />
          <svg viewBox="0 0 340 90" style={{ width:'100%' }}>
            {[{x:20,y:70},{x:70,y:55},{x:120,y:50},{x:170,y:60},{x:220,y:40},{x:290,y:30}].map((p,i,arr)=>
              i<arr.length-1?<line key={i} x1={p.x} y1={p.y} x2={arr[i+1].x} y2={arr[i+1].y} stroke={C.warning} strokeWidth="2.5" strokeLinecap="round"/>:null
            )}
            {[{x:20,y:70},{x:70,y:55},{x:120,y:50},{x:170,y:60},{x:220,y:40},{x:290,y:30}].map((p,i)=>(
              <circle key={i} cx={p.x} cy={p.y} r={4} fill={C.warning} stroke="#fff" strokeWidth={1.5}/>
            ))}
            {['Aug','Sep','Oct','Nov','Dec','Jan'].map((l,i)=>(
              <text key={i} x={[20,70,120,170,220,290][i]} y={85} textAnchor="middle" fontSize={9} fill={C.muted} fontFamily="Manrope,sans-serif">{l}</text>
            ))}
          </svg>
        </Card>
        <Card style={{ padding:22 }}>
          <SectionTitle title="Profile View Sources" />
          {[{l:'Search Results',pct:58,c:C.primary},{l:'Direct Link',pct:24,c:C.info},{l:'Recommended',pct:12,c:C.accent},{l:'Other',pct:6,c:C.muted}].map((s,i)=>(
            <div key={i} style={{ marginBottom:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                <p style={{ fontSize:11, color:C.sub }}>{s.l}</p>
                <p style={{ fontSize:11, fontWeight:700, color:s.c }}>{s.pct}%</p>
              </div>
              <div style={{ height:5, borderRadius:99, background:`${s.c}15` }}>
                <div style={{ width:`${s.pct}%`, height:'100%', background:s.c, borderRadius:99 }} />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

// ─── Learning & Development ───────────────────────────────────────────────────
function LearningDev({ onToast }:{ onToast:(m:string)=>void }) {
  const courses = [
    {e:'🧠',l:'Advanced Dementia Care',  org:'Alzheimer\'s Lanka Foundation', dur:'8 hrs', badge:true,  status:'recommended'},
    {e:'🩺',l:'Palliative Care Essentials',org:'Sri Lanka Hospice Alliance',  dur:'12 hrs',badge:true,  status:'upcoming'},
    {e:'💊',l:'Medication Safety Level 2', org:'Sri Lanka Medical Association', dur:'4 hrs', badge:false, status:'available'},
    {e:'🏃',l:'Basic Physiotherapy Support',org:'ReadyPal Academy',           dur:'6 hrs', badge:true,  status:'recommended'},
  ]
  return (
    <div style={{ padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Learning & Development</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:18 }} className="ap-3col">
        {[{e:'📚',l:'Courses Completed',v:'12'},{e:'🏅',l:'Badges Earned',v:'7'},{e:'⏱️',l:'Learning Hours',v:'84 hrs'}].map((s,i)=>(
          <Card key={i} style={{ padding:20, textAlign:'center' as const }}>
            <p style={{ fontSize:30, marginBottom:6 }}>{s.e}</p>
            <p style={{ fontSize:22, fontWeight:900, color:C.primary, fontFamily:'Manrope,sans-serif', lineHeight:1 }}>{s.v}</p>
            <p style={{ fontSize:11, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      {courses.map((c,i)=>(
        <Card key={i} hover style={{ padding:22, marginBottom:12, border:c.status==='upcoming'?`1.5px solid ${C.primary}30`:undefined }}>
          <div style={{ display:'flex', gap:14, alignItems:'center' }}>
            <div style={{ width:52, height:52, borderRadius:14, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0 }}>{c.e}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:3 }}>
                <p style={{ fontSize:13, fontWeight:800, color:C.type }}>{c.l}</p>
                {c.badge&&<Bdg label="Badge" color={C.accent} />}
                {c.status==='upcoming'&&<Bdg label="Upcoming" color={C.primary} dot />}
                {c.status==='recommended'&&<Bdg label="Recommended" color={C.info} dot />}
              </div>
              <p style={{ fontSize:11, color:C.muted }}>{c.org} · {c.dur}</p>
            </div>
            <Btn label={c.status==='upcoming'?'Register':'Enrol'} variant="secondary" small onClick={()=>onToast('Enrolled!')} />
          </div>
        </Card>
      ))}
      <Card style={{ padding:22 }}>
        <SectionTitle title="Certification Renewals Due" />
        {[{l:'First Aid & CPR Renewal',due:'Mar 2025',days:45},{l:'Manual Handling Refresher',due:'Sep 2024',days:-90}].map((r,i)=>(
          <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:i<1?`1px solid ${C.border}`:'none' }}>
            <div>
              <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{r.l}</p>
              <p style={{ fontSize:11, color:r.days<0?C.error:C.warning }}>{r.days<0?`Expired ${Math.abs(r.days)} days ago`:`Due in ${r.days} days · ${r.due}`}</p>
            </div>
            <Btn label="Renew" variant={r.days<0?'danger':'accent'} small onClick={()=>onToast('Opening renewal')} />
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── Profile Settings ─────────────────────────────────────────────────────────
function ProfileSettings({ onToast }:{ onToast:(m:string)=>void }) {
  const [settings, setSettings] = useState({
    publicProfile:true, showPhone:false, showEmail:false,
    instantBooking:true, requireApproval:false, notifications:true, weeklyDigest:true,
  })
  const toggle = (k:keyof typeof settings) => setSettings(s=>({...s,[k]:!s[k]}))
  const Toggle = ({ k, label, sub }:{ k:keyof typeof settings; label:string; sub:string }) => (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:`1px solid ${C.border}` }}>
      <div><p style={{ fontSize:13, fontWeight:600, color:C.type }}>{label}</p><p style={{ fontSize:11, color:C.muted }}>{sub}</p></div>
      <button onClick={()=>{ toggle(k); onToast(`${label} ${!settings[k]?'enabled':'disabled'}`) }}
        style={{ width:46, height:25, borderRadius:99, background:settings[k]?C.primary:'#D0D9DD', border:'none', cursor:'pointer', position:'relative' as const, transition:'all 0.18s' }}>
        <div style={{ position:'absolute', top:2.5, left:settings[k]?23:2.5, width:20, height:20, borderRadius:'50%', background:'white', transition:'left 0.18s' }}/>
      </button>
    </div>
  )
  return (
    <div style={{ maxWidth:680, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Profile Settings</h2>
      {[{ title:'Visibility', items:[{k:'publicProfile' as const,l:'Public Profile',s:'Visible to all clients on platform'},{k:'showPhone' as const,l:'Show Phone Number',s:'Display contact number on public profile'},{k:'showEmail' as const,l:'Show Email Address',s:'Display email on public profile'}] },{ title:'Booking Preferences', items:[{k:'instantBooking' as const,l:'Instant Booking',s:'Allow clients to book without approval'},{k:'requireApproval' as const,l:'Require Approval',s:'Review every booking request before accepting'}] },{ title:'Notifications', items:[{k:'notifications' as const,l:'Push Notifications',s:'New messages, bookings, and reviews'},{k:'weeklyDigest' as const,l:'Weekly Digest',s:'Summary of profile performance and earnings'}] }].map((sec,i)=>(
        <Card key={i} style={{ padding:22, marginBottom:14 }}>
          <SectionTitle title={sec.title} />
          {sec.items.map(item=><Toggle key={item.k} k={item.k} label={item.l} sub={item.s} />)}
        </Card>
      ))}
    </div>
  )
}

// ─── Profile Preview ──────────────────────────────────────────────────────────
function ProfilePreview() {
  const [device, setDevice] = useState<'desktop'|'tablet'|'mobile'>('desktop')
  const widths = { desktop:780, tablet:480, mobile:320 }
  return (
    <div style={{ padding:'24px 28px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
        <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Profile Preview</h2>
        <div style={{ display:'flex', gap:4, border:`1px solid ${C.border}`, borderRadius:10, overflow:'hidden' }}>
          {(['desktop','tablet','mobile'] as const).map(d=>(
            <button key={d} onClick={()=>setDevice(d)} style={{ padding:'7px 16px', border:'none', cursor:'pointer', background:device===d?C.primary:'#FAFAFA', color:device===d?'#fff':C.sub, fontFamily:'Manrope,sans-serif', fontSize:11, fontWeight:700, transition:'all 0.12s' }}>
              {d.charAt(0).toUpperCase()+d.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display:'flex', justifyContent:'center' }}>
        <div style={{ width:widths[device], border:`1px solid ${C.border}`, borderRadius:16, overflow:'hidden', boxShadow:'0 8px 32px rgba(44,62,67,0.12)', transition:'width 0.3s ease' }}>
          {/* Mini public profile render */}
          <div style={{ height:80, background:`linear-gradient(135deg,${C.primary},#004D52)` }}/>
          <div style={{ padding:'0 20px 20px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginTop:-22 }}>
              <div style={{ width:52, height:52, borderRadius:'50%', background:`linear-gradient(135deg,${C.primary},#005D63)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontFamily:'Manrope,sans-serif', fontWeight:900, fontSize:16, border:'3px solid white' }}>KP</div>
              <div style={{ padding:'5px 14px', background:C.primary, borderRadius:8, color:'#fff', fontFamily:'Manrope,sans-serif', fontSize:11, fontWeight:700, marginTop:14 }}>Book Now</div>
            </div>
            <h3 style={{ fontSize:16, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginTop:8, marginBottom:2 }}>Kasun Perera</h3>
            <p style={{ fontSize:12, color:C.sub, marginBottom:8 }}>Certified Elderly Care Specialist</p>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' as const, marginBottom:12 }}>
              <Bdg label="Verified" color={C.primary} dot />
              <Bdg label="Top Rated" color={C.warning} dot />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
              {[{v:'4.9★',l:'Rating'},{v:'652',l:'Services'},{v:'8 yrs',l:'Exp'},{v:'4 min',l:'Response'}].map((s,i)=>(
                <div key={i} style={{ textAlign:'center' as const, padding:'8px', borderRadius:8, background:C.bg }}>
                  <p style={{ fontSize:12, fontWeight:900, color:C.primary, fontFamily:'Manrope,sans-serif' }}>{s.v}</p>
                  <p style={{ fontSize:9, color:C.muted }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Document Center ──────────────────────────────────────────────────────────
function DocumentCenter({ onToast }:{ onToast:(m:string)=>void }) {
  const docs = [
    {e:'🪪',l:'National Identity Card',  sub:'NIC No: 901234567V',           status:'verified', expiry:null},
    {e:'🛡️',l:'Police Clearance Report', sub:'Issued: 15 Jun 2023',          status:'verified', expiry:'15 Jun 2026'},
    {e:'🏥',l:'Medical Certificate',      sub:'Fitness for care work confirmed',status:'verified', expiry:'1 Jan 2025'},
    {e:'🎓',l:'RN Certificate',           sub:'Sri Lanka Nursing Council',    status:'verified', expiry:'Jan 2026'},
    {e:'📄',l:'Driving Licence',          sub:'Category B · Exp 2028',        status:'verified', expiry:'2028'},
  ]
  return (
    <div style={{ maxWidth:700, margin:'0 auto', padding:'24px 28px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
        <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Document Center</h2>
        <Btn label="Upload Document" small icon={I.upload} onClick={()=>onToast('Opening upload…')} />
      </div>
      {docs.map((d,i)=>(
        <Card key={i} hover style={{ padding:20, marginBottom:10 }}>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <div style={{ width:50, height:50, borderRadius:14, background:`${C.success}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>{d.e}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:3 }}>
                <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{d.l}</p>
                <Bdg label="Verified" color={C.success} />
              </div>
              <p style={{ fontSize:11, color:C.muted }}>{d.sub}</p>
              {d.expiry&&<p style={{ fontSize:11, color:C.muted }}>Expires: {d.expiry}</p>}
            </div>
            <div style={{ display:'flex', gap:6 }}>
              <Btn label="View" variant="ghost" small onClick={()=>onToast('Viewing document')} />
              <button onClick={()=>onToast('Delete document')} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, display:'flex' }}><span style={{display:'flex'}}>{I.trash}</span></button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Notifications ────────────────────────────────────────────────────────────
function ProfileNotifications() {
  const items = [
    {e:'👀',t:'Profile Viewed',           b:'3 clients viewed your profile in the last 2 hours.',   c:C.info,    read:false},
    {e:'⭐',t:'New Review Received',       b:'Mohamed Ihsan left you a 5-star review.',               c:C.warning, read:false},
    {e:'⚠️',t:'Certificate Expiring',     b:'First Aid & CPR expires in 45 days. Renew now.',        c:C.warning, read:false},
    {e:'📊',t:'Profile Completion',       b:'Your profile is 87% complete. Add availability to reach 95%.', c:C.primary, read:true},
    {e:'🏆',t:'Achievement Unlocked',     b:"You've earned the 500 Services milestone badge!",       c:C.accent,  read:true},
  ]
  return (
    <div style={{ maxWidth:660, margin:'0 auto', padding:'24px 28px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
        <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Notifications</h2>
        <Bdg label={`${items.filter(n=>!n.read).length} new`} color={C.primary} dot />
      </div>
      {items.map((n,i)=>(
        <Card key={i} style={{ padding:18, marginBottom:8, background:n.read?C.surface:`${n.c}04`, border:`1px solid ${n.read?C.border:n.c+'25'}` }}>
          <div style={{ display:'flex', gap:12 }}>
            <div style={{ width:42, height:42, borderRadius:12, background:`${n.c}12`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{n.e}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:3 }}>
                <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{n.t}</p>
                {!n.read&&<div style={{ width:7, height:7, borderRadius:'50%', background:n.c }}/>}
              </div>
              <p style={{ fontSize:12, color:C.sub, lineHeight:1.5 }}>{n.b}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Status Badges ────────────────────────────────────────────────────────────
function StatusBadgesView() {
  const badges = [{l:'Verified',c:C.primary},{l:'Premium Agent',c:C.accent},{l:'Top Rated',c:C.warning},{l:'New Agent',c:C.info},{l:'Experienced',c:C.success},{l:'Available Now',c:C.success},{l:'Busy',c:C.warning},{l:'Vacation',c:C.muted}]
  return (
    <div style={{ maxWidth:700, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Status Badges</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }} className="ap-4col">
        {badges.map((b,i)=>(
          <Card key={i} style={{ padding:22, textAlign:'center' as const }}>
            <div style={{ width:12, height:12, borderRadius:'50%', background:b.c, margin:'0 auto 10px' }} />
            <Bdg label={b.l} color={b.c} dot />
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Empty / Loading / Error / Success ───────────────────────────────────────
function EmptyStates() {
  return (
    <div style={{ padding:'28px 28px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:20 }}>Empty States</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        {[{e:'⭐',t:'No Reviews',       d:"You haven't received any reviews yet. Complete your first job to get started."},{e:'🖼️',t:'No Portfolio',    d:'Add case studies, photos, and testimonials to showcase your expertise.'},{e:'📜',t:'No Certificates', d:'Upload your professional certificates to build client trust.'},{e:'⚡',t:'No Skills',       d:'Add your care skills to increase visibility in search results.'},{e:'🏆',t:'No Achievements', d:'Complete services and maintain high ratings to unlock achievement badges.'}].map((s,i)=>(
          <Card key={i} style={{ padding:'38px 22px', textAlign:'center' as const }}>
            <p style={{ fontSize:48, marginBottom:14 }}>{s.e}</p>
            <p style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:8 }}>{s.t}</p>
            <p style={{ fontSize:12, color:C.muted, lineHeight:1.7 }}>{s.d}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

function LoadingStates() {
  return (
    <div style={{ padding:'28px 28px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:20 }}>Loading States</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        {['Loading Profile','Loading Calendar','Loading Portfolio','Loading Insights'].map((l,i)=>(
          <Card key={i} style={{ padding:22 }}>
            <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:14 }}>{l}</p>
            <div style={{ display:'flex', gap:12, marginBottom:14 }}>
              <div style={{ width:52, height:52, borderRadius:'50%', background:'#E4E8EA', flexShrink:0 }} />
              <div style={{ flex:1 }}><Shimmer h={16} /><div style={{height:6}}/><Shimmer h={11} w="70%" /></div>
            </div>
            {[...Array(4)].map((_,j)=><div key={j} style={{marginBottom:9}}><Shimmer h={13} w={`${55+j*12}%`}/></div>)}
          </Card>
        ))}
      </div>
    </div>
  )
}

function ErrorStates({ onToast }:{ onToast:(m:string)=>void }) {
  return (
    <div style={{ maxWidth:600, margin:'0 auto', padding:'28px 28px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:20 }}>Error States</h2>
      {[{e:'📝',t:'Profile Update Failed', d:'Changes could not be saved. Please try again.',col:C.error},{e:'📁',t:'Upload Failed',          d:'File could not be uploaded. Check format and size (max 10 MB).',col:C.warning},{e:'📅',t:'Calendar Error',          d:'Availability could not be loaded. Please refresh.',col:C.error},{e:'📶',t:'Connection Lost',         d:'No internet connection. Check your network and retry.',col:C.muted}].map((er,i)=>(
        <Card key={i} style={{ padding:22, marginBottom:12, border:`1.5px solid ${er.col}30`, background:`${er.col}04` }}>
          <div style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
            <div style={{ width:44, height:44, borderRadius:14, background:`${er.col}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{er.e}</div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:13, fontWeight:800, color:er.col, marginBottom:4 }}>{er.t}</p>
              <p style={{ fontSize:12, color:C.sub, lineHeight:1.6, marginBottom:10 }}>{er.d}</p>
              <Btn label="Retry" variant="secondary" small icon={I.refresh} onClick={()=>onToast('Retrying…')} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

function SuccessStates({ onToast }:{ onToast:(m:string)=>void }) {
  void onToast
  return (
    <div style={{ maxWidth:600, margin:'0 auto', padding:'28px 28px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:20 }}>Success States</h2>
      {[{e:'✅',t:'Profile Updated',       d:'Your profile has been updated and is now visible to clients.',    col:C.success},{e:'📅',t:'Availability Saved',    d:'Your schedule has been updated. Clients can now see your availability.', col:C.primary},{e:'📜',t:'Certificate Uploaded', d:'Your certificate has been verified and added to your profile.',        col:C.success},{e:'🏆',t:'Achievement Unlocked!', d:"You've earned the 500 Services milestone badge. Congratulations!",    col:C.accent}].map((s,i)=>(
        <Card key={i} style={{ padding:20, marginBottom:10, border:`1.5px solid ${s.col}30`, background:`${s.col}04` }}>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <div style={{ width:44, height:44, borderRadius:14, background:`${s.col}12`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{s.e}</div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:13, fontWeight:700, color:s.col, marginBottom:2 }}>{s.t}</p>
              <p style={{ fontSize:12, color:C.sub }}>{s.d}</p>
            </div>
            <span style={{ color:s.col, display:'flex', transform:'scale(1.2)' }}>{I.check}</span>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function AgentProfileMgmt() {
  const [sub, setSub] = useState<SubView>('home')
  const [toast, setToast] = useState<string|null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const showToast = (m:string) => { setToast(m); setTimeout(()=>setToast(null),2800) }
  const groups = [...new Set(NAV.map(n=>n.group))]

  const renderMain = () => {
    switch(sub) {
      case 'home':          return <ProfileHome onNav={setSub} onToast={showToast} />
      case 'publicProfile': return <PublicProfile onToast={showToast} />
      case 'experience':    return <Experience onToast={showToast} />
      case 'services':      return <ServicesOffered onToast={showToast} />
      case 'skills':        return <Skills onToast={showToast} />
      case 'certifications':return <Certifications onToast={showToast} />
      case 'portfolio':     return <Portfolio onToast={showToast} />
      case 'reviews':       return <Reviews />
      case 'availability':  return <Availability onToast={showToast} />
      case 'serviceAreas':  return <ServiceAreas onToast={showToast} />
      case 'pricing':       return <Pricing onToast={showToast} />
      case 'languages':     return <Languages onToast={showToast} />
      case 'achievements':  return <Achievements />
      case 'insights':      return <CareerInsights />
      case 'learning':      return <LearningDev onToast={showToast} />
      case 'settings':      return <ProfileSettings onToast={showToast} />
      case 'preview':       return <ProfilePreview />
      case 'documents':     return <DocumentCenter onToast={showToast} />
      case 'notifications': return <ProfileNotifications />
      case 'statusBadges':  return <StatusBadgesView />
      case 'empty':         return <EmptyStates />
      case 'loading':       return <LoadingStates />
      case 'error':         return <ErrorStates onToast={showToast} />
      case 'success':       return <SuccessStates onToast={showToast} />
      default: return null
    }
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:C.bg, fontFamily:'Manrope,sans-serif' }}>
      {/* Sidebar */}
      <div className="ap-sidebar" style={{ width:218, background:C.surface, borderRight:`1px solid ${C.border}`, display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh', overflowY:'auto', flexShrink:0 }}>
        <div style={{ padding:'16px 18px 14px', borderBottom:`1px solid ${C.border}` }}>
          <KasunAvatar size={42} ring />
          <p style={{ fontSize:13, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginTop:10, marginBottom:2 }}>Kasun Perera</p>
          <p style={{ fontSize:11, color:C.muted }}>Certified Elderly Care Specialist</p>
        </div>
        {groups.map(group=>(
          <div key={group}>
            <p style={{ fontSize:9, fontWeight:800, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.09em', padding:'10px 18px 4px' }}>{group}</p>
            {NAV.filter(n=>n.group===group).map(n=>{
              const active=sub===n.k
              return (
                <button key={n.k} onClick={()=>{ setSub(n.k); setSidebarOpen(false) }}
                  style={{ width:'100%', display:'flex', gap:9, alignItems:'center', padding:'9px 18px', border:'none', background:active?`${C.primary}08`:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:active?700:500, color:active?C.primary:C.type, textAlign:'left' as const, borderLeft:active?`3px solid ${C.primary}`:'3px solid transparent', transition:'all 0.12s' }}>
                  <span style={{ display:'flex', color:active?C.primary:C.muted }}>{n.icon}</span>{n.l}
                  {n.k==='notifications'&&<div style={{ marginLeft:'auto', minWidth:18, height:18, borderRadius:99, background:C.error, color:'#fff', fontSize:9, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 5px' }}>3</div>}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* Mobile overlay */}
      {sidebarOpen&&(
        <div style={{ position:'fixed', inset:0, zIndex:50, background:'rgba(0,0,0,0.4)' }} onClick={()=>setSidebarOpen(false)}>
          <div onClick={e=>e.stopPropagation()} style={{ width:240, height:'100%', background:C.surface, overflowY:'auto' }}>
            <div style={{ padding:'16px 18px', borderBottom:`1px solid ${C.border}`, display:'flex', gap:10, alignItems:'center' }}>
              <KasunAvatar size={36} ring />
              <div><p style={{ fontSize:13, fontWeight:800, color:C.type }}>Kasun Perera</p><p style={{ fontSize:10, color:C.muted }}>Care Agent</p></div>
            </div>
            {NAV.map(n=>(
              <button key={n.k} onClick={()=>{ setSub(n.k); setSidebarOpen(false) }}
                style={{ width:'100%', display:'flex', gap:9, alignItems:'center', padding:'10px 18px', border:'none', background:sub===n.k?`${C.primary}08`:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:sub===n.k?700:500, color:sub===n.k?C.primary:C.type, textAlign:'left' as const }}>
                <span style={{ display:'flex', color:sub===n.k?C.primary:C.muted }}>{n.icon}</span>{n.l}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile top bar */}
      <div className="ap-mobile-nav" style={{ display:'none', position:'fixed', top:0, left:0, right:0, zIndex:40, background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'11px 18px', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <KasunAvatar size={30} />
          <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{NAV.find(n=>n.k===sub)?.l??'Profile'}</p>
        </div>
        <button onClick={()=>setSidebarOpen(v=>!v)} style={{ background:'none', border:'none', cursor:'pointer', color:C.type, fontSize:12, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>Menu</button>
      </div>

      {/* Main */}
      <div style={{ flex:1, overflowY:'auto' }} className="ap-main">
        {renderMain()}
      </div>

      {toast&&<Toast msg={toast} />}
    </div>
  )
}
