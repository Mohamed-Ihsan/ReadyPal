import { useState, type ReactNode, type CSSProperties } from 'react'

// ─── Brand ────────────────────────────────────────────────────────────────────
const C = {
  primary:'#00737A', accent:'#EE8153', type:'#2C3E43', sub:'#6B7E85',
  muted:'#9AAAB0', border:'#E4E8EA', bg:'#F2F4F5', surface:'#FFFFFF',
  success:'#22C55E', warning:'#F59E0B', error:'#EF4444', info:'#3B82F6',
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const I: Record<string, ReactNode> = {
  star:     <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.3 4.3 12.3l.7-4.1-3-2.9 4.2-.7L8 1z"/></svg>,
  starO:    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.3 4.3 12.3l.7-4.1-3-2.9 4.2-.7L8 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  chevL:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3l-5 4 5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevR:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l5 4-5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  check:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5l3 3 6-6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  plus:     <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  edit:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M9.5 1.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  search:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.3"/><path d="M9 9l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  image:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="2.5" width="11" height="9" rx="2" stroke="currentColor" strokeWidth="1.2"/><circle cx="4.5" cy="5.5" r="1.2" stroke="currentColor" strokeWidth="1"/><path d="M1.5 9.5l3.5-3 2.5 2.5 2-1.5 2.5 2.5" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/></svg>,
  mic:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="4" y="1.5" width="5" height="7" rx="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M2 7c0 2.5 2 4 4.5 4s4.5-1.5 4.5-4M6.5 11v1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  thumb:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M4.5 11.5H2.5V6h2m0 5.5V6m0 5.5h5a1 1 0 0 0 .95-.68L11.5 8a1 1 0 0 0-.95-1.32H8V4a1.5 1.5 0 0 0-3 0v2H4.5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  flag:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 1.5v10M2.5 1.5h7l-1.5 3 1.5 3h-7V1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  verified: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1L8 2.5l2-.5 1 1.8-.5 2 1 1.7-1 1.7.5 2-1.8 1-2-.5-1.7 1-1.7-1-2 .5-1-1.8.5-2-1-1.7 1-1.7-.5-2 1.8-1 2 .5L6.5 1z" stroke={C.success} strokeWidth="1.1" fill={`${C.success}15`}/><path d="M4.5 6.5l1.5 1.5 2.5-3" stroke={C.success} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  trophy:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M4 1.5h5v4a2.5 2.5 0 0 1-5 0V1.5z" stroke="currentColor" strokeWidth="1.2"/><path d="M4 3.5H2.5A1 1 0 0 0 1.5 4.5v1A2 2 0 0 0 3.5 7.5M9 3.5h1.5a1 1 0 0 1 1 1v1A2 2 0 0 1 9.5 7.5M6.5 8v3M4 11h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  repeat:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 4h9M2 9h9M10 2l2 2-2 2M3 7l-2 2 2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  camera:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1.5" y="3.5" width="10" height="7.5" rx="2" stroke="currentColor" strokeWidth="1.2"/><circle cx="6.5" cy="7.25" r="2" stroke="currentColor" strokeWidth="1.1"/><path d="M4.5 3.5l.7-1.5h2.6l.7 1.5" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/></svg>,
  close:    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  confetti: <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="8" cy="8" r="3" fill="#EE8153"/><circle cx="32" cy="6" r="2.5" fill="#00737A"/><circle cx="6" cy="28" r="2" fill="#F59E0B"/><circle cx="34" cy="30" r="3" fill="#3B82F6"/><rect x="16" y="2" width="4" height="4" rx="1" fill="#22C55E" transform="rotate(20 16 2)"/><rect x="24" y="24" width="4" height="4" rx="1" fill="#EE8153" transform="rotate(-15 24 24)"/><rect x="2" y="18" width="3" height="6" rx="1" fill="#8B5CF6" transform="rotate(30 2 18)"/><rect x="30" y="16" width="3" height="6" rx="1" fill="#F59E0B" transform="rotate(-25 30 16)"/></svg>,
  trending: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 10l4-4 3 3 5-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  lock:     <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="2" y="5.5" width="8" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  eye:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 6.5C3 4 4.6 2.5 6.5 2.5S10 4 11.5 6.5C10 9 8.4 10.5 6.5 10.5S3 9 1.5 6.5z" stroke="currentColor" strokeWidth="1.2"/><circle cx="6.5" cy="6.5" r="1.8" stroke="currentColor" strokeWidth="1.1"/></svg>,
  eyeOff:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 1.5l10 10M5.5 4.3A4.3 4.3 0 0 1 6.5 4c1.9 0 3.5 1.5 5 2.5C10.5 8 9.2 9.2 7.7 9.7M4.5 4.8C3 5.5 2 6.2 1.5 6.5 3 8 4.6 9.5 6.5 9.5c.7 0 1.4-.2 2-.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  bell:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5v.8M6.5 1.5a4 4 0 0 1 4 4v3l1 1.5H2l1-1.5v-3a4 4 0 0 1 4-4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M5 10.5a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.2"/></svg>,
  download: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2v6M4 6l2.5 2.5L9 6M2 11h9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
}

// ─── Primitives ───────────────────────────────────────────────────────────────
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
  const vs: Record<string,CSSProperties> = {
    primary:   { background:disabled?'#C8D0D4':h?'#005D63':C.primary, color:'#fff', border:'none', boxShadow:disabled?'none':h?`0 4px 16px ${C.primary}50`:`0 2px 8px ${C.primary}30` },
    secondary: { background:h?'#EEF5F5':'#fff', color:C.primary, border:`1.5px solid ${h?C.primary:C.border}` },
    ghost:     { background:h?'#F2F4F5':'transparent', color:C.sub, border:'none' },
    danger:    { background:h?'#DC2626':C.error, color:'#fff', border:'none' },
    accent:    { background:h?'#D9703E':C.accent, color:'#fff', border:'none', boxShadow:h?`0 4px 16px ${C.accent}50`:`0 2px 8px ${C.accent}30` },
  }
  return (
    <button onClick={disabled?undefined:onClick} disabled={disabled} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:small?'6px 14px':'10px 20px', borderRadius:10, cursor:disabled?'not-allowed':'pointer', fontFamily:'Manrope,sans-serif', fontSize:small?12:13, fontWeight:700, transition:'all 0.15s', ...vs[variant] }}>
      {icon&&<span style={{display:'flex'}}>{icon}</span>}{label}
    </button>
  )
}

function Avatar({ name, size=40 }: { name:string; size?:number }) {
  const cols = ['#00737A','#EE8153','#3B82F6','#8B5CF6','#22C55E','#F59E0B']
  const c = cols[name.charCodeAt(0)%cols.length]
  const init = name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
  return <div style={{ width:size, height:size, borderRadius:'50%', background:`${c}14`, color:c, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:size*0.33, fontFamily:'Manrope,sans-serif', border:`2px solid ${c}28`, flexShrink:0 }}>{init}</div>
}

function Bdg({ label, color=C.primary, bg }: { label:string; color?:string; bg?:string }) {
  return <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 9px', borderRadius:999, fontSize:11, fontWeight:700, background:bg??`${color}12`, color }}>{label}</span>
}

// ─── Star Rating Component ────────────────────────────────────────────────────
function StarRow({ value, onChange, size=24, readonly=false }: { value:number; onChange?:(v:number)=>void; size?:number; readonly?:boolean }) {
  const [hover, setHover] = useState(0)
  const display = readonly ? value : (hover || value)
  return (
    <div style={{ display:'flex', gap:3 }}>
      {[1,2,3,4,5].map(s=>{
        const full = display >= s
        const half = !full && display >= s - 0.5
        return (
          <button key={s} disabled={readonly} onMouseEnter={()=>!readonly&&setHover(s)} onMouseLeave={()=>!readonly&&setHover(0)} onClick={()=>onChange&&onChange(s)}
            style={{ width:size, height:size, background:'none', border:'none', cursor:readonly?'default':'pointer', padding:0, color:full||half?'#F59E0B':C.border, display:'flex', alignItems:'center', justifyContent:'center', transition:'transform 0.12s, color 0.12s', transform:!readonly&&hover>=s?'scale(1.25)':'scale(1)' }}>
            <svg width={size} height={size} viewBox="0 0 16 16" fill={full?'currentColor':'none'}>
              <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.3 4.3 12.3l.7-4.1-3-2.9 4.2-.7L8 1z" stroke={full||half?'#F59E0B':C.border} strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
          </button>
        )
      })}
    </div>
  )
}

// ─── Review Badge Component ───────────────────────────────────────────────────
const REVIEW_BADGES: Record<string,{color:string;icon:ReactNode;label:string}> = {
  verified:    { color:C.success, icon:I.verified, label:'Verified Service' },
  top:         { color:'#F59E0B', icon:I.trophy,   label:'Top Reviewer' },
  repeat:      { color:C.primary, icon:I.repeat,   label:'Repeat Client' },
  photos:      { color:C.info,    icon:I.camera,   label:'With Photos' },
  voice:       { color:C.accent,  icon:I.mic,      label:'With Voice Note' },
  public:      { color:C.primary, icon:I.eye,      label:'Public Review' },
  private:     { color:C.muted,   icon:I.lock,     label:'Private Feedback' },
}
function ReviewBdg({ type }: { type:keyof typeof REVIEW_BADGES }) {
  const b = REVIEW_BADGES[type]
  return <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 9px', borderRadius:999, fontSize:11, fontWeight:700, background:`${b.color}12`, color:b.color }}><span style={{display:'flex',transform:'scale(0.9)'}}>{b.icon}</span>{b.label}</span>
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const REVIEWS = [
  {
    id:'rv1', reviewer:'Mohamed Ihsan', date:'14 Jan 2025', rating:5, agent:'Kasun Perera',
    beneficiary:'Nimal Perera', service:'Hospital Companion', task:'RP-T-20259',
    text:"Kasun was punctual, compassionate and kept us informed throughout the hospital visit. We felt reassured despite being overseas. He handled the doctors' questions confidently and ensured Thaththi was comfortable the entire time.",
    categories:{ Professionalism:5, Punctuality:5, Communication:5, Compassion:5, CareQuality:4, ProblemSolving:5 },
    helpful:24, notHelpful:0, badges:['verified','repeat','photos'] as const,
    agentReply:"Thank you so much for your kind words. It was my honour to support Nimal Aiyya during his visit. I will always strive to give my best.",
    agentReplyDate:'15 Jan 2025',
    photos:['Photo 1','Photo 2'],
  },
  {
    id:'rv2', reviewer:'Preethi Fernando', date:'8 Jan 2025', rating:5, agent:'Chamari Dissanayake',
    beneficiary:'Amara Fernando', service:'Medication Collection', task:'RP-T-20247',
    text:"Chamari collected and delivered all medications correctly and even double-checked the dosages with the pharmacy. Very professional and trustworthy.",
    categories:{ Professionalism:5, Punctuality:4, Communication:5, Compassion:5, CareQuality:5, Reliability:5 },
    helpful:11, notHelpful:0, badges:['verified','public'] as const,
    agentReply:null, agentReplyDate:null, photos:[],
  },
  {
    id:'rv3', reviewer:'Ruwan Jayasinghe', date:'2 Jan 2025', rating:4, agent:'Nadeesha Silva',
    beneficiary:'Sunil Jayasinghe', service:'Home Wellness Visit', task:'RP-T-20218',
    text:"Overall a good experience. Nadeesha was caring and patient with my father. Could improve on proactive updates but handled everything well.",
    categories:{ Professionalism:4, Punctuality:4, Communication:3, Compassion:5, Appearance:5, Respect:5 },
    helpful:8, notHelpful:1, badges:['verified'] as const,
    agentReply:"Thank you for the feedback Ruwan. I have noted the communication suggestion and will make sure to send regular updates on future visits.",
    agentReplyDate:'3 Jan 2025', photos:[],
  },
]

const CATEGORIES = ['Professionalism','Punctuality','Communication','Compassion','Care Quality','Problem Solving','Reliability','Knowledge','Respect','Appearance']
const SENTIMENTS = [
  { emoji:'😢', label:'Terrible',    min:0,   max:1.9, color:C.error },
  { emoji:'😞', label:'Poor',        min:2,   max:2.9, color:'#F97316' },
  { emoji:'😐', label:'Average',     min:3,   max:3.4, color:C.warning },
  { emoji:'😊', label:'Good',        min:3.5, max:4.4, color:C.info },
  { emoji:'🌟', label:'Excellent',   min:4.5, max:5,   color:C.success },
]
function getSentiment(r:number) { return SENTIMENTS.find(s=>r>=s.min&&r<=s.max)??SENTIMENTS[4] }

// ─── Review Card ──────────────────────────────────────────────────────────────
function ReviewCard({ review, onExpand }: { review:typeof REVIEWS[0]; onExpand?:()=>void }) {
  const [helpful, setHelpful] = useState(review.helpful)
  const [voted, setVoted] = useState<'up'|'down'|null>(null)
  const [showReport, setShowReport] = useState(false)

  return (
    <Card hover={!!onExpand} onClick={onExpand} style={{ padding:24 }}>
      <div style={{ display:'flex', gap:14, marginBottom:14 }}>
        <Avatar name={review.reviewer} size={44} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:4 }}>
            <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{review.reviewer}</p>
            {review.badges.map(b=><ReviewBdg key={b} type={b} />)}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
            <StarRow value={review.rating} readonly size={16} />
            <p style={{ fontSize:12, color:C.muted }}>{review.date}</p>
            <span style={{ fontSize:12, color:C.muted }}>·</span>
            <p style={{ fontSize:12, color:C.sub }}>{review.service} — {review.beneficiary}</p>
          </div>
        </div>
        <p style={{ fontSize:22, fontWeight:900, color:C.warning, fontFamily:'Manrope,sans-serif', flexShrink:0 }}>{review.rating}.0</p>
      </div>

      <p style={{ fontSize:14, color:C.type, lineHeight:1.75, marginBottom:14 }}>{review.text}</p>

      {/* Category scores mini */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:14 }}>
        {Object.entries(review.categories).slice(0,4).map(([k,v])=>(
          <div key={k} style={{ display:'flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:99, background:C.bg, border:`1px solid ${C.border}` }}>
            <p style={{ fontSize:11, color:C.sub }}>{k}</p>
            <span style={{ color:'#F59E0B', display:'flex', transform:'scale(0.8)' }}>{I.star}</span>
            <p style={{ fontSize:11, fontWeight:700, color:C.type }}>{v}</p>
          </div>
        ))}
      </div>

      {/* Photos */}
      {review.photos.length>0 && (
        <div style={{ display:'flex', gap:8, marginBottom:14 }}>
          {review.photos.map((p,i)=>(
            <div key={i} style={{ width:72, height:72, borderRadius:12, background:`${C.primary}10`, border:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', color:C.muted, fontSize:11, fontWeight:700, flexDirection:'column', gap:4 }}>
              <span style={{ color:C.muted, display:'flex' }}>{I.image}</span>
              {p}
            </div>
          ))}
        </div>
      )}

      {/* Agent reply */}
      {review.agentReply && (
        <div style={{ padding:'14px 16px', borderRadius:12, background:`${C.primary}04`, border:`1px solid ${C.primary}20`, marginBottom:14 }}>
          <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:8 }}>
            <Avatar name={review.agent} size={30} />
            <div>
              <p style={{ fontSize:12, fontWeight:800, color:C.primary }}>{review.agent} replied</p>
              <p style={{ fontSize:11, color:C.muted }}>{review.agentReplyDate}</p>
            </div>
            <Bdg label="Agent Response" color={C.primary} />
          </div>
          <p style={{ fontSize:13, color:C.type, lineHeight:1.7, fontStyle:'italic' }}>"{review.agentReply}"</p>
        </div>
      )}

      {/* Helpful row */}
      <div style={{ display:'flex', gap:8, alignItems:'center', paddingTop:10, borderTop:`1px solid ${C.border}` }}>
        <p style={{ fontSize:12, color:C.muted, marginRight:4 }}>Was this helpful?</p>
        <button onClick={e=>{ e.stopPropagation(); if(voted!=='up'){ setHelpful(h=>h+1); setVoted('up') } }} style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 12px', borderRadius:99, border:`1.5px solid ${voted==='up'?C.success:C.border}`, background:voted==='up'?`${C.success}08`:'transparent', cursor:'pointer', fontSize:12, fontWeight:700, color:voted==='up'?C.success:C.sub, fontFamily:'Manrope,sans-serif' }}>
          <span style={{ display:'flex' }}>{I.thumb}</span> {helpful}
        </button>
        <button onClick={e=>{ e.stopPropagation(); if(voted!=='down'){ setVoted('down') } }} style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 12px', borderRadius:99, border:`1.5px solid ${voted==='down'?C.error:C.border}`, background:voted==='down'?`${C.error}06`:'transparent', cursor:'pointer', fontSize:12, fontWeight:700, color:voted==='down'?C.error:C.sub, fontFamily:'Manrope,sans-serif' }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M8.5 1.5H10.5V7h-2m0-5.5V7m0-5.5h-5a1 1 0 0 0-.95.68L1.5 5a1 1 0 0 0 .95 1.32H5V9a1.5 1.5 0 0 0 3 0V7h.5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
          Not helpful
        </button>
        <button onClick={e=>{ e.stopPropagation(); setShowReport(v=>!v) }} style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:4, padding:'5px 10px', borderRadius:99, border:'none', background:'transparent', cursor:'pointer', fontSize:12, color:C.muted, fontFamily:'Manrope,sans-serif' }}>
          <span style={{ display:'flex' }}>{I.flag}</span> Report
        </button>
        {showReport && (
          <div onClick={e=>e.stopPropagation()} style={{ position:'absolute', right:24, marginTop:80, zIndex:20, background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, boxShadow:'0 8px 24px rgba(44,62,67,0.14)', padding:16, minWidth:200 }}>
            <p style={{ fontSize:12, fontWeight:800, color:C.type, marginBottom:10 }}>Report Review</p>
            {['Inappropriate content','Spam','Fake review','Offensive language'].map(r=>(
              <button key={r} onClick={()=>setShowReport(false)} style={{ width:'100%', padding:'7px 10px', borderRadius:8, border:'none', background:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, textAlign:'left' as const }} onMouseOver={e=>{(e.currentTarget as HTMLButtonElement).style.background=C.bg}} onMouseOut={e=>{(e.currentTarget as HTMLButtonElement).style.background='transparent'}}>{r}</button>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

// ─── Sub-views ────────────────────────────────────────────────────────────────
type SubView = 'dashboard'|'wizard'|'public'|'analytics'|'search'|'private'|'success'|'notifications'|'badges'|'empty'|'loading'|'error'

// ──────────────────────────────────────────────────────────────────────────────
// REVIEWS DASHBOARD
// ──────────────────────────────────────────────────────────────────────────────
function Dashboard({ onNav }: { onNav:(v:SubView)=>void }) {
  const pending = [
    { agent:'Priya Senanayake', service:'Physiotherapy Escort', date:'20 Dec 2024', task:'RP-T-20199', due:'3 days left' },
    { agent:'Kasun Perera',     service:'Hospital Companion',   date:'2 Jan 2025',  task:'RP-T-20231', due:'Overdue' },
  ]

  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', flexDirection:'column', gap:22 }}>
      {/* Hero */}
      <Card style={{ padding:0, overflow:'hidden' }}>
        <div style={{ background:`linear-gradient(135deg,${C.primary} 0%,#005D63 55%,#003C40 100%)`, padding:'28px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-30, right:-30, width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,0.04)' }} />
          <p style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.55)', textTransform:'uppercase', letterSpacing:'0.09em', marginBottom:8 }}>Reviews & Feedback</p>
          <div style={{ display:'flex', alignItems:'flex-end', gap:14, marginBottom:4 }}>
            <p style={{ fontSize:42, fontWeight:900, color:'#fff', fontFamily:'Manrope,sans-serif', letterSpacing:'-0.03em', lineHeight:1 }}>4.9</p>
            <div style={{ marginBottom:6 }}>
              <StarRow value={4.9} readonly size={22} />
              <p style={{ fontSize:13, color:'rgba(255,255,255,0.6)', marginTop:4 }}>Average rating given · 12 reviews</p>
            </div>
          </div>
          <div style={{ display:'flex', gap:10, marginTop:16 }}>
            <button onClick={()=>onNav('wizard')} style={{ padding:'10px 20px', borderRadius:10, border:'none', background:C.accent, cursor:'pointer', fontSize:13, fontWeight:800, color:'#fff', fontFamily:'Manrope,sans-serif', boxShadow:`0 4px 14px ${C.accent}50` }}>Leave a Review</button>
            <button onClick={()=>onNav('analytics')} style={{ padding:'10px 20px', borderRadius:10, border:'1.5px solid rgba(255,255,255,0.25)', background:'rgba(255,255,255,0.10)', cursor:'pointer', fontSize:13, fontWeight:700, color:'#fff', fontFamily:'Manrope,sans-serif' }}>Analytics</button>
            <button onClick={()=>onNav('search')} style={{ padding:'10px 20px', borderRadius:10, border:'1.5px solid rgba(255,255,255,0.25)', background:'rgba(255,255,255,0.10)', cursor:'pointer', fontSize:13, fontWeight:700, color:'#fff', fontFamily:'Manrope,sans-serif' }}>Search Reviews</button>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', borderTop:`1px solid ${C.border}` }} className="rr-4col">
          {[{v:'12',l:'Total Reviews',c:C.primary},{v:'2',l:'Pending Reviews',c:C.warning},{v:'4.9★',l:'Avg Rating Given',c:'#F59E0B'},{v:'92%',l:'Would Recommend',c:C.success}].map((m,i)=>(
            <div key={m.l} style={{ padding:'16px 18px', borderRight:i<3?`1px solid ${C.border}`:'none' }}>
              <p style={{ fontSize:20, fontWeight:900, color:m.c, fontFamily:'Manrope,sans-serif', letterSpacing:'-0.02em', marginBottom:3 }}>{m.v}</p>
              <p style={{ fontSize:12, color:C.muted }}>{m.l}</p>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:22 }} className="rr-dash-grid">
        <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
          {/* Pending reviews */}
          {pending.length>0&&(
            <Card style={{ padding:22 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                <h3 style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>Pending Reviews</h3>
                <Bdg label={`${pending.length} awaiting`} color={C.warning} />
              </div>
              {pending.map((p,i)=>(
                <div key={i} style={{ display:'flex', gap:12, alignItems:'center', padding:'12px 0', borderBottom:i<pending.length-1?`1px solid ${C.border}`:'none' }}>
                  <Avatar name={p.agent} size={42} />
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:2 }}>{p.service}</p>
                    <p style={{ fontSize:12, color:C.muted }}>{p.agent} · {p.date}</p>
                  </div>
                  <div style={{ textAlign:'right' as const, flexShrink:0 }}>
                    <p style={{ fontSize:11, fontWeight:700, color:p.due==='Overdue'?C.error:C.warning, marginBottom:4 }}>{p.due}</p>
                    <Btn label="Review Now" variant="accent" small onClick={()=>onNav('wizard')} />
                  </div>
                </div>
              ))}
            </Card>
          )}

          {/* Recent reviews */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {REVIEWS.map(r=>(
              <div key={r.id} style={{ position:'relative' }}>
                <ReviewCard review={r} onExpand={()=>onNav('public')} />
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Rating breakdown */}
          <Card style={{ padding:22 }}>
            <h3 style={{ fontSize:13, fontWeight:800, color:C.type, marginBottom:14, fontFamily:'Manrope,sans-serif' }}>Rating Breakdown</h3>
            {[5,4,3,2,1].map(s=>{
              const count = REVIEWS.filter(r=>Math.round(r.rating)===s).length
              const pct = (count/REVIEWS.length)*100
              return (
                <div key={s} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                  <p style={{ fontSize:12, fontWeight:700, color:C.type, width:10 }}>{s}</p>
                  <span style={{ color:'#F59E0B', display:'flex', transform:'scale(0.8)' }}>{I.star}</span>
                  <div style={{ flex:1, height:7, borderRadius:99, background:C.bg, overflow:'hidden' }}>
                    <div style={{ width:`${pct}%`, height:'100%', background:s>=4?C.success:s===3?C.warning:C.error, borderRadius:99, transition:'width 0.4s' }} />
                  </div>
                  <p style={{ fontSize:12, color:C.muted, width:18, textAlign:'right' as const }}>{count}</p>
                </div>
              )
            })}
          </Card>

          {/* Quick actions */}
          <Card style={{ padding:20 }}>
            <h3 style={{ fontSize:13, fontWeight:800, color:C.type, marginBottom:12, fontFamily:'Manrope,sans-serif' }}>Quick Actions</h3>
            {[
              {icon:I.edit,     l:'Leave a Review',    v:'wizard'    as SubView},
              {icon:I.trending, l:'Rating Analytics',  v:'analytics' as SubView},
              {icon:I.search,   l:'Search Reviews',    v:'search'    as SubView},
              {icon:I.lock,     l:'Private Feedback',  v:'private'   as SubView},
            ].map(a=>(
              <button key={a.l} onClick={()=>onNav(a.v)} style={{ width:'100%', display:'flex', alignItems:'center', gap:9, padding:'9px 10px', borderRadius:9, border:'none', background:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:600, color:C.type, textAlign:'left' as const, transition:'background 0.15s' }} onMouseOver={e=>{(e.currentTarget as HTMLButtonElement).style.background='#F2F4F5'}} onMouseOut={e=>{(e.currentTarget as HTMLButtonElement).style.background='transparent'}}>
                <span style={{ color:C.primary, display:'flex' }}>{a.icon}</span>{a.l}
                <span style={{ marginLeft:'auto', color:C.muted, display:'flex' }}>{I.chevR}</span>
              </button>
            ))}
          </Card>

          {/* Top compliments */}
          <Card style={{ padding:20 }}>
            <h3 style={{ fontSize:13, fontWeight:800, color:C.type, marginBottom:12, fontFamily:'Manrope,sans-serif' }}>Top Compliments Given</h3>
            {[{l:'Compassionate',n:9},{l:'Punctual',n:8},{l:'Professional',n:11},{l:'Communicative',n:7}].map(c=>(
              <div key={c.l} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:`1px solid ${C.border}` }}>
                <p style={{ fontSize:12, color:C.type }}>{c.l}</p>
                <p style={{ fontSize:12, fontWeight:700, color:C.primary }}>{c.n}×</p>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// LEAVE REVIEW WIZARD (6 Steps)
// ──────────────────────────────────────────────────────────────────────────────
function LeaveReview({ onBack, onSuccess }: { onBack:()=>void; onSuccess:()=>void }) {
  const [step, setStep] = useState(1)
  const [overall, setOverall] = useState(0)
  const [hoverStar, setHoverStar] = useState(0)
  const [catRatings, setCatRatings] = useState<Record<string,number>>({})
  const [feedback, setFeedback] = useState('')
  const [recommend, setRecommend] = useState<'yes'|'maybe'|'no'|null>(null)
  const [isPublic, setIsPublic] = useState(true)
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [chips, setChips] = useState<string[]>([])

  const displayStar = hoverStar || overall
  const sentiment = overall ? getSentiment(overall) : null

  const CHIPS = ['Excellent care','Very punctual','Great communicator','Highly professional','Compassionate','Reliable','Went above and beyond','Would hire again']
  const PROMPTS = ['What impressed you most about this care visit?','What could Kasun improve for future visits?','Would you recommend Kasun to other families?','How did this visit make you and your family feel?']

  const STEPS = ['Overall','Categories','Feedback','Media','Recommend','Summary']
  const canNext = step===1?overall>0:step===2?true:step===3?feedback.length>=10:true

  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', flexDirection:'column', gap:20, maxWidth:720, margin:'0 auto' }}>
      <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', alignSelf:'flex-start' }}>{I.chevL} Reviews Dashboard</button>

      {/* Agent card */}
      <Card style={{ padding:20 }}>
        <div style={{ display:'flex', gap:14, alignItems:'center' }}>
          <Avatar name="Kasun Perera" size={52} />
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', gap:7, alignItems:'center', marginBottom:4 }}>
              <p style={{ fontSize:16, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>Kasun Perera</p>
              <ReviewBdg type="verified" />
            </div>
            <p style={{ fontSize:12, color:C.muted }}>Hospital Companion · Nimal Perera · 14 Jan 2025</p>
          </div>
          <p style={{ fontSize:12, fontWeight:700, color:C.primary }}>RP-T-20259</p>
        </div>
      </Card>

      {/* Progress steps */}
      <div style={{ display:'flex', alignItems:'center', gap:0 }}>
        {STEPS.map((s,i)=>{
          const done = step>i+1
          const active = step===i+1
          return (
            <div key={s} style={{ flex:1, display:'flex', alignItems:'center' }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                <div style={{ width:28, height:28, borderRadius:'50%', background:done?C.success:active?C.primary:C.bg, border:`2px solid ${done?C.success:active?C.primary:C.border}`, display:'flex', alignItems:'center', justifyContent:'center', color:done||active?'#fff':C.muted, transition:'all 0.2s' }}>
                  {done?<span style={{display:'flex',transform:'scale(0.8)'}}>{I.check}</span>:<p style={{fontSize:11,fontWeight:800}}>{i+1}</p>}
                </div>
                <p style={{ fontSize:9, fontWeight:700, color:active?C.primary:done?C.success:C.muted, textAlign:'center' as const, whiteSpace:'nowrap' as const }}>{s}</p>
              </div>
              {i<STEPS.length-1&&<div style={{ flex:1, height:2, background:done?C.success:C.border, margin:'0 4px 18px 4px', transition:'background 0.2s' }} />}
            </div>
          )
        })}
      </div>

      {/* Step content */}
      {step===1&&(
        <Card style={{ padding:32 }}>
          <h2 style={{ fontSize:18, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:8, textAlign:'center' as const }}>How was the care experience?</h2>
          <p style={{ fontSize:13, color:C.muted, textAlign:'center' as const, marginBottom:28 }}>Tap a star to rate Kasun's service</p>

          {/* Big star rating */}
          <div style={{ display:'flex', justifyContent:'center', marginBottom:16 }}>
            <div style={{ display:'flex', gap:8 }}>
              {[1,2,3,4,5].map(s=>(
                <button key={s} onMouseEnter={()=>setHoverStar(s)} onMouseLeave={()=>setHoverStar(0)} onClick={()=>setOverall(s)}
                  style={{ width:56, height:56, background:'none', border:'none', cursor:'pointer', padding:0, color:displayStar>=s?'#F59E0B':C.border, transition:'transform 0.15s, color 0.15s', transform:hoverStar>=s?'scale(1.3)':'scale(1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width="52" height="52" viewBox="0 0 16 16" fill={displayStar>=s?'currentColor':'none'} style={{transition:'fill 0.15s'}}>
                    <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.3 4.3 12.3l.7-4.1-3-2.9 4.2-.7L8 1z" stroke={displayStar>=s?'#F59E0B':C.border} strokeWidth="1.2" strokeLinejoin="round"/>
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Sentiment */}
          {overall>0&&sentiment&&(
            <div style={{ textAlign:'center' as const, marginBottom:24 }}>
              <p style={{ fontSize:40, marginBottom:4 }}>{sentiment.emoji}</p>
              <p style={{ fontSize:18, fontWeight:800, color:sentiment.color, fontFamily:'Manrope,sans-serif' }}>{sentiment.label}</p>
            </div>
          )}

          {/* Quick reaction chips */}
          <p style={{ fontSize:12, fontWeight:700, color:C.muted, marginBottom:10, textAlign:'center' as const }}>Quick reactions (optional)</p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center' }}>
            {CHIPS.map(ch=>{
              const sel = chips.includes(ch)
              return <button key={ch} onClick={()=>setChips(p=>sel?p.filter(x=>x!==ch):[...p,ch])} style={{ padding:'7px 14px', borderRadius:99, border:`1.5px solid ${sel?C.primary:C.border}`, background:sel?`${C.primary}08`:'transparent', cursor:'pointer', fontSize:12, fontWeight:700, color:sel?C.primary:C.sub, fontFamily:'Manrope,sans-serif', transition:'all 0.15s' }}>{ch}</button>
            })}
          </div>
        </Card>
      )}

      {step===2&&(
        <Card style={{ padding:24 }}>
          <h2 style={{ fontSize:16, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>Rate specific qualities</h2>
          <p style={{ fontSize:12, color:C.muted, marginBottom:20 }}>Help future families with detailed scores</p>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {CATEGORIES.map(cat=>(
              <div key={cat} style={{ display:'flex', gap:14, alignItems:'center' }}>
                <p style={{ fontSize:13, fontWeight:600, color:C.type, width:120, flexShrink:0 }}>{cat}</p>
                <StarRow value={catRatings[cat]??0} onChange={v=>setCatRatings(p=>({...p,[cat]:v}))} size={22} />
                {catRatings[cat]&&<p style={{ fontSize:13, fontWeight:700, color:'#F59E0B', minWidth:14 }}>{catRatings[cat]}</p>}
                {!catRatings[cat]&&<p style={{ fontSize:11, color:C.muted }}>Tap to rate</p>}
              </div>
            ))}
          </div>
        </Card>
      )}

      {step===3&&(
        <Card style={{ padding:24 }}>
          <h2 style={{ fontSize:16, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>Share your experience</h2>
          <p style={{ fontSize:12, color:C.muted, marginBottom:16 }}>Detailed feedback helps future families make better decisions</p>
          <div style={{ marginBottom:14 }}>
            <p style={{ fontSize:12, fontWeight:700, color:C.muted, marginBottom:8 }}>Suggested prompts</p>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {PROMPTS.map((p,i)=>(
                <button key={i} onClick={()=>setFeedback(prev=>prev?prev+'\n\n'+p:p)} style={{ padding:'8px 12px', borderRadius:10, border:`1px solid ${C.border}`, background:'#F9FAFB', cursor:'pointer', fontSize:12, color:C.sub, fontFamily:'Manrope,sans-serif', textAlign:'left' as const }}>
                  <span style={{ color:C.primary, marginRight:4 }}>+</span>{p}
                </button>
              ))}
            </div>
          </div>
          <textarea value={feedback} onChange={e=>setFeedback(e.target.value)} rows={6} placeholder="Share your honest experience…" style={{ width:'100%', padding:'14px', borderRadius:12, border:`1.5px solid ${feedback.length>10?C.primary:C.border}`, fontFamily:'Manrope,sans-serif', fontSize:14, color:C.type, outline:'none', resize:'vertical' as const, lineHeight:1.7, boxSizing:'border-box' as const, background:'#FAFAFA' }} />
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
            <p style={{ fontSize:11, color:feedback.length<10?C.error:C.success }}>Minimum 10 characters</p>
            <p style={{ fontSize:11, color:C.muted }}>{feedback.length} / 2000</p>
          </div>
        </Card>
      )}

      {step===4&&(
        <Card style={{ padding:24 }}>
          <h2 style={{ fontSize:16, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>Add media (optional)</h2>
          <p style={{ fontSize:12, color:C.muted, marginBottom:20 }}>Photos and documents help build trust</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:16 }}>
            <button style={{ aspectRatio:'1', borderRadius:14, border:`2px dashed ${C.primary}40`, background:`${C.primary}04`, cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, color:C.primary, fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:700 }}>
              <span style={{ display:'flex', transform:'scale(1.5)' }}>{I.camera}</span>
              Add Photo
            </button>
            {[1,2].map(n=>(
              <div key={n} style={{ aspectRatio:'1', borderRadius:14, background:`${C.primary}08`, border:`1px solid ${C.primary}20`, display:'flex', alignItems:'center', justifyContent:'center', color:C.muted, flexDirection:'column', gap:4, fontSize:11, fontWeight:700, position:'relative' as const }}>
                <span style={{ display:'flex', transform:'scale(1.4)' }}>{I.image}</span>
                Photo {n}
                <button style={{ position:'absolute', top:6, right:6, width:20, height:20, borderRadius:'50%', background:C.error, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 1l6 6M7 1L1 7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </button>
              </div>
            ))}
          </div>

          {/* Voice feedback */}
          <div style={{ padding:'16px', borderRadius:14, border:`1.5px dashed ${C.border}`, background:'#FAFAFA', display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:44, height:44, borderRadius:14, background:`${C.accent}10`, display:'flex', alignItems:'center', justifyContent:'center', color:C.accent, flexShrink:0 }}>
              <span style={{ display:'flex', transform:'scale(1.4)' }}>{I.mic}</span>
            </div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:13, fontWeight:700, color:C.type }}>Optional Voice Feedback</p>
              <p style={{ fontSize:11, color:C.muted }}>Record a short voice note (max 2 mins)</p>
            </div>
            <Btn label="Record" variant="secondary" small icon={I.mic} />
          </div>
        </Card>
      )}

      {step===5&&(
        <Card style={{ padding:24 }}>
          <h2 style={{ fontSize:16, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:20 }}>Final preferences</h2>

          {/* Rehire */}
          <div style={{ marginBottom:20 }}>
            <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:10 }}>Would you hire Kasun again?</p>
            <div style={{ display:'flex', gap:10 }}>
              {(['yes','maybe','no'] as const).map(v=>{
                const cols = {yes:C.success,maybe:C.warning,no:C.error}
                const sel = recommend===v
                return <button key={v} onClick={()=>setRecommend(v)} style={{ flex:1, padding:'10px', borderRadius:12, border:`2px solid ${sel?cols[v]:C.border}`, background:sel?`${cols[v]}08`:'transparent', cursor:'pointer', fontSize:13, fontWeight:800, color:sel?cols[v]:C.sub, fontFamily:'Manrope,sans-serif', textTransform:'capitalize' as const, transition:'all 0.15s' }}>{v==='yes'?'Yes ✓':v==='maybe'?'Maybe →':'No ✗'}</button>
              })}
            </div>
          </div>

          {/* Toggles */}
          {[
            {l:'Make this review public',d:'Visible to all families on ReadyPal',v:isPublic,set:setIsPublic,icon:I.eye},
            {l:'Submit anonymously',d:'Your name will be hidden from the review',v:isAnonymous,set:setIsAnonymous,icon:I.eyeOff},
          ].map(t=>(
            <div key={t.l} style={{ display:'flex', gap:12, alignItems:'center', padding:'14px 0', borderBottom:`1px solid ${C.border}` }}>
              <div style={{ width:40, height:40, borderRadius:12, background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary, flexShrink:0 }}>
                <span style={{ display:'flex' }}>{t.icon}</span>
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{t.l}</p>
                <p style={{ fontSize:11, color:C.muted }}>{t.d}</p>
              </div>
              <button onClick={()=>t.set((v:boolean)=>!v)} style={{ width:44, height:26, borderRadius:99, border:'none', cursor:'pointer', background:t.v?C.primary:C.border, position:'relative' as const, transition:'background 0.2s', flexShrink:0 }}>
                <div style={{ width:20, height:20, borderRadius:'50%', background:'#fff', position:'absolute', top:3, left:t.v?21:3, transition:'left 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.18)' }} />
              </button>
            </div>
          ))}

          {/* Private feedback to ReadyPal */}
          <div style={{ marginTop:16, padding:'14px', borderRadius:12, background:`${C.info}06`, border:`1px solid ${C.info}20` }}>
            <p style={{ fontSize:13, fontWeight:700, color:C.info, marginBottom:6 }}>Private Feedback to ReadyPal (optional)</p>
            <textarea rows={3} placeholder="Share any concerns about the platform, payment or matching experience — this is private and only seen by the ReadyPal team." style={{ width:'100%', padding:'10px 12px', borderRadius:10, border:`1px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, outline:'none', resize:'none' as const, boxSizing:'border-box' as const, background:'#FAFAFA' }} />
          </div>
        </Card>
      )}

      {step===6&&(
        <Card style={{ padding:24 }}>
          <h2 style={{ fontSize:16, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:20 }}>Review Summary</h2>

          <div style={{ display:'flex', gap:14, alignItems:'center', padding:'14px', borderRadius:14, background:C.bg, marginBottom:16 }}>
            <Avatar name="Kasun Perera" size={48} />
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                <p style={{ fontSize:15, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>Kasun Perera</p>
                {overall&&sentiment&&<span style={{ fontSize:22 }}>{sentiment.emoji}</span>}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <StarRow value={overall} readonly size={18} />
                <p style={{ fontSize:14, fontWeight:800, color:'#F59E0B' }}>{overall}.0</p>
              </div>
            </div>
            <button onClick={()=>setStep(1)} style={{ padding:'6px 12px', borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', fontSize:12, fontWeight:700, color:C.sub, fontFamily:'Manrope,sans-serif', display:'flex', gap:4, alignItems:'center' }}>{I.edit} Edit</button>
          </div>

          {chips.length>0&&(
            <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:14 }}>
              {chips.map(ch=><Bdg key={ch} label={ch} color={C.primary} />)}
            </div>
          )}

          {feedback&&<div style={{ padding:'14px', borderRadius:12, background:'#FAFAFA', border:`1px solid ${C.border}`, marginBottom:14 }}>
            <p style={{ fontSize:13, color:C.type, lineHeight:1.75, fontStyle:'italic' }}>"{feedback.slice(0,200)}{feedback.length>200?'…':''}"</p>
          </div>}

          <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:16 }}>
            {recommend&&<Bdg label={recommend==='yes'?'Would hire again':recommend==='maybe'?'Maybe again':'Would not rehire'} color={recommend==='yes'?C.success:recommend==='maybe'?C.warning:C.error} />}
            {isPublic?<ReviewBdg type="public" />:<ReviewBdg type="private" />}
            {isAnonymous&&<Bdg label="Anonymous" color={C.muted} />}
          </div>

          <div style={{ padding:'12px 14px', borderRadius:12, background:`${C.success}06`, border:`1px solid ${C.success}20`, display:'flex', gap:8, alignItems:'center', marginBottom:20 }}>
            <span style={{ color:C.success, display:'flex' }}>{I.check}</span>
            <p style={{ fontSize:12, color:C.success, fontWeight:700 }}>Your review looks great. Ready to submit!</p>
          </div>

          <Btn label="Submit Review" variant="primary" onClick={onSuccess} />
        </Card>
      )}

      {/* Nav */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        {step>1?<Btn label="Back" variant="secondary" icon={I.chevL} onClick={()=>setStep(s=>s-1)} />:<div/>}
        {step<6
          ? <Btn label={step===5?"Review Summary":"Next"} variant="primary" icon={I.chevR} onClick={()=>setStep(s=>s+1)} disabled={!canNext} />
          : <div/>
        }
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// PUBLIC REVIEW PAGE
// ──────────────────────────────────────────────────────────────────────────────
function PublicReviews({ onBack }: { onBack:()=>void }) {
  const [filter, setFilter] = useState('Newest')
  const [search, setSearch] = useState('')
  const [ratingFilter, setRatingFilter] = useState(0)

  const filtered = REVIEWS.filter(r=>{
    const q = search.toLowerCase()
    return (!q||r.text.toLowerCase().includes(q)||r.reviewer.toLowerCase().includes(q)||r.agent.toLowerCase().includes(q))&&(!ratingFilter||Math.round(r.rating)===ratingFilter)
  })

  const catAvgs: Record<string,number[]> = {}
  REVIEWS.forEach(r=>Object.entries(r.categories).forEach(([k,v])=>{ if(!catAvgs[k]) catAvgs[k]=[]; catAvgs[k].push(v) }))

  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', gap:22, alignItems:'start', flexWrap:'wrap' }}>
      <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:18 }}>
        <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', alignSelf:'flex-start' }}>{I.chevL} Dashboard</button>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Reviews for Kasun Perera</h2>

        {/* Filters */}
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          <div style={{ position:'relative', flex:1, minWidth:200 }}>
            <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:C.muted, display:'flex' }}>{I.search}</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search reviews…" style={{ width:'100%', padding:'9px 10px 9px 30px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, outline:'none', background:'#FAFAFA', boxSizing:'border-box' as const }} />
          </div>
          <div style={{ display:'flex', gap:6 }}>
            {['Newest','Oldest','Highest','Lowest','Photos'].map(f=>(
              <button key={f} onClick={()=>setFilter(f)} style={{ padding:'8px 12px', borderRadius:9, border:`1.5px solid ${filter===f?C.primary:C.border}`, background:filter===f?`${C.primary}08`:'transparent', cursor:'pointer', fontSize:12, fontWeight:700, color:filter===f?C.primary:C.sub, fontFamily:'Manrope,sans-serif' }}>{f}</button>
            ))}
          </div>
        </div>

        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {[0,5,4,3,2,1].map(s=>(
            <button key={s} onClick={()=>setRatingFilter(s)} style={{ display:'flex', alignItems:'center', gap:4, padding:'6px 12px', borderRadius:99, border:`1.5px solid ${ratingFilter===s?C.primary:C.border}`, background:ratingFilter===s?`${C.primary}08`:'transparent', cursor:'pointer', fontSize:12, fontWeight:700, color:ratingFilter===s?C.primary:C.sub, fontFamily:'Manrope,sans-serif' }}>
              {s===0?'All':<><span style={{color:'#F59E0B',display:'flex',transform:'scale(0.85)'}}>{I.star}</span>{s}</>}
            </button>
          ))}
        </div>

        {filtered.map(r=>(
          <div key={r.id} style={{ position:'relative' }}>
            <ReviewCard review={r} />
          </div>
        ))}
      </div>

      {/* Category sidebar */}
      <div style={{ width:260, flexShrink:0, position:'sticky', top:24, display:'flex', flexDirection:'column', gap:14 }}>
        <Card style={{ padding:22 }}>
          <p style={{ fontSize:12, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:14 }}>Category Averages</p>
          {Object.entries(catAvgs).map(([cat,vals])=>{
            const avg = vals.reduce((a,b)=>a+b,0)/vals.length
            return (
              <div key={cat} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                <p style={{ fontSize:12, flex:1, color:C.type }}>{cat}</p>
                <div style={{ width:60, height:5, borderRadius:99, background:C.bg, overflow:'hidden' }}>
                  <div style={{ width:`${(avg/5)*100}%`, height:'100%', background:`${C.success}`, borderRadius:99 }} />
                </div>
                <p style={{ fontSize:12, fontWeight:700, color:'#F59E0B' }}>{avg.toFixed(1)}</p>
              </div>
            )
          })}
        </Card>
        <Card style={{ padding:22 }}>
          <p style={{ fontSize:12, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:10 }}>Badges</p>
          {(['verified','top','repeat','photos','public'] as const).map(b=>(
            <div key={b} style={{ marginBottom:6 }}><ReviewBdg type={b} /></div>
          ))}
        </Card>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// RATING ANALYTICS
// ──────────────────────────────────────────────────────────────────────────────
function RatingAnalytics({ onBack }: { onBack:()=>void }) {
  const months = ['Aug','Sep','Oct','Nov','Dec','Jan']
  const trend  = [4.5, 4.7, 4.6, 4.8, 4.9, 4.9]
  const maxT   = 5

  const compliments = [
    {l:'Compassionate',pct:92},{l:'Professional',pct:88},{l:'Punctual',pct:83},{l:'Reliable',pct:79},{l:'Communicative',pct:75},
  ]

  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', flexDirection:'column', gap:22 }}>
      <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', alignSelf:'flex-start' }}>{I.chevL} Dashboard</button>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Rating Analytics</h2>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }} className="rr-3col">
        {[{v:'4.9★',l:'Average Rating',c:'#F59E0B'},{v:'12',l:'Total Reviews',c:C.primary},{v:'92%',l:'Recommend Rate',c:C.success}].map(s=>(
          <Card key={s.l} style={{ padding:'18px 20px' }}>
            <p style={{ fontSize:26, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', letterSpacing:'-0.02em', marginBottom:4 }}>{s.v}</p>
            <p style={{ fontSize:12, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>

      {/* Trend chart */}
      <Card style={{ padding:24 }}>
        <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:20, fontFamily:'Manrope,sans-serif' }}>Rating Trend (6 months)</h3>
        <div style={{ display:'flex', gap:12, alignItems:'flex-end', height:120 }}>
          {trend.map((v,i)=>{
            const pct = v/maxT
            const isLast = i===trend.length-1
            return (
              <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
                <p style={{ fontSize:10, fontWeight:700, color:isLast?C.primary:C.muted }}>{v}</p>
                <div style={{ width:'100%', height:pct*90+10, borderRadius:8, background:isLast?`linear-gradient(180deg,${C.primary},${C.primary}80)`:i===trend.length-2?`${C.primary}40`:`${C.primary}18`, border:isLast?'none':`1px solid ${C.border}`, transition:'all 0.3s', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {isLast&&<span style={{color:'#fff',display:'flex',transform:'scale(0.7)'}}>{I.star}</span>}
                </div>
                <p style={{ fontSize:10, color:isLast?C.type:C.muted, fontWeight:isLast?700:400 }}>{months[i]}</p>
              </div>
            )
          })}
        </div>
      </Card>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:22 }} className="rr-2col">
        {/* Compliments */}
        <Card style={{ padding:24 }}>
          <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:16, fontFamily:'Manrope,sans-serif' }}>Most Frequent Compliments</h3>
          {compliments.map(c=>(
            <div key={c.l} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
              <p style={{ fontSize:13, flex:1, color:C.type }}>{c.l}</p>
              <div style={{ width:100, height:7, borderRadius:99, background:C.bg, overflow:'hidden' }}>
                <div style={{ width:`${c.pct}%`, height:'100%', background:`linear-gradient(90deg,${C.primary},${C.success})`, borderRadius:99 }} />
              </div>
              <p style={{ fontSize:12, fontWeight:700, color:C.primary, width:34, textAlign:'right' as const }}>{c.pct}%</p>
            </div>
          ))}
        </Card>

        {/* Category breakdown donut-style */}
        <Card style={{ padding:24 }}>
          <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:16, fontFamily:'Manrope,sans-serif' }}>Category Scores</h3>
          {[{l:'Professionalism',v:5},{l:'Communication',v:5},{l:'Compassion',v:4.8},{l:'Punctuality',v:4.6},{l:'Care Quality',v:4.7}].map(cat=>(
            <div key={cat.l} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
              <p style={{ fontSize:12, flex:1, color:C.type }}>{cat.l}</p>
              <StarRow value={cat.v} readonly size={14} />
              <p style={{ fontSize:12, fontWeight:700, color:'#F59E0B', width:24, textAlign:'right' as const }}>{cat.v}</p>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// REVIEW SEARCH
// ──────────────────────────────────────────────────────────────────────────────
function ReviewSearch({ onBack }: { onBack:()=>void }) {
  const [q, setQ] = useState('')
  const [agent, setAgent] = useState('')
  const [rating, setRating] = useState(0)

  const results = REVIEWS.filter(r=>{
    const qMatch = !q||r.text.toLowerCase().includes(q.toLowerCase())||r.reviewer.toLowerCase().includes(q.toLowerCase())
    const aMatch = !agent||r.agent.toLowerCase().includes(agent.toLowerCase())
    const rMatch = !rating||Math.round(r.rating)===rating
    return qMatch&&aMatch&&rMatch
  })

  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', flexDirection:'column', gap:18 }}>
      <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', alignSelf:'flex-start' }}>{I.chevL} Dashboard</button>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Search Reviews</h2>

      <Card style={{ padding:22 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }} className="rr-3col">
          {[
            {l:'Keyword',ph:'e.g. punctual, hospital…',v:q,set:setQ},
            {l:'Care Agent',ph:'e.g. Kasun Perera',v:agent,set:setAgent},
          ].map(f=>(
            <div key={f.l}>
              <p style={{ fontSize:12, fontWeight:700, color:C.muted, marginBottom:5 }}>{f.l}</p>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:C.muted, display:'flex' }}>{I.search}</span>
                <input value={f.v} onChange={e=>f.set(e.target.value)} placeholder={f.ph} style={{ width:'100%', padding:'9px 10px 9px 30px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, outline:'none', background:'#FAFAFA', boxSizing:'border-box' as const }} />
              </div>
            </div>
          ))}
          <div>
            <p style={{ fontSize:12, fontWeight:700, color:C.muted, marginBottom:5 }}>Min Rating</p>
            <div style={{ display:'flex', gap:5 }}>
              {[0,3,4,5].map(s=>(
                <button key={s} onClick={()=>setRating(s)} style={{ flex:1, padding:'8px 0', borderRadius:9, border:`1.5px solid ${rating===s?C.primary:C.border}`, background:rating===s?`${C.primary}08`:'transparent', cursor:'pointer', fontSize:11, fontWeight:700, color:rating===s?C.primary:C.sub, fontFamily:'Manrope,sans-serif' }}>{s===0?'All':`${s}★`}</button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <p style={{ fontSize:13, fontWeight:700, color:C.muted }}>{results.length} result{results.length!==1?'s':''}</p>
      {results.map(r=>(
        <div key={r.id} style={{ position:'relative' }}>
          <ReviewCard review={r} />
        </div>
      ))}
      {!results.length && (
        <Card style={{ padding:'48px', textAlign:'center' as const }}>
          <p style={{ fontSize:36, marginBottom:12 }}>🔍</p>
          <p style={{ fontSize:16, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>No reviews found</p>
          <p style={{ fontSize:13, color:C.muted }}>Try different keywords or filters</p>
        </Card>
      )}
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// PRIVATE FEEDBACK
// ──────────────────────────────────────────────────────────────────────────────
function PrivateFeedback({ onBack }: { onBack:()=>void }) {
  const [submitted, setSubmitted] = useState(false)
  const sections = ['Platform Experience','Matching Quality','Payment Experience','Support Team','Suggestions','Bug Report']

  if (submitted) return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:48, textAlign:'center', gap:12 }}>
      <div style={{ width:80, height:80, borderRadius:'50%', background:`${C.success}10`, display:'flex', alignItems:'center', justifyContent:'center', border:`3px solid ${C.success}30` }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M8 20l8 8 16-16" stroke={C.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Thank You!</h2>
      <p style={{ fontSize:13, color:C.muted, maxWidth:340, lineHeight:1.7 }}>Your private feedback has been sent to the ReadyPal team. We read every message and use it to improve the platform.</p>
      <Btn label="Back to Dashboard" variant="primary" onClick={onBack} />
    </div>
  )

  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', flexDirection:'column', gap:18, maxWidth:720, margin:'0 auto' }}>
      <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', alignSelf:'flex-start' }}>{I.chevL} Dashboard</button>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Private Feedback</h2>
        <Bdg label="Confidential" color={C.muted} />
      </div>
      <p style={{ fontSize:13, color:C.muted }}>This feedback is private and only seen by the ReadyPal support team. It does not affect your reviews or agent ratings.</p>

      {sections.map(s=>(
        <Card key={s} style={{ padding:22 }}>
          <p style={{ fontSize:13, fontWeight:800, color:C.type, marginBottom:10 }}>{s}</p>
          <textarea rows={3} placeholder={`Share your thoughts on ${s.toLowerCase()}…`} style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, outline:'none', resize:'none' as const, background:'#FAFAFA', boxSizing:'border-box' as const }} />
        </Card>
      ))}

      <Btn label="Send Private Feedback" variant="primary" icon={I.lock} onClick={()=>setSubmitted(true)} />
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// REVIEW SUCCESS
// ──────────────────────────────────────────────────────────────────────────────
function ReviewSuccess({ onBack }: { onBack:()=>void }) {
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'48px 28px', textAlign:'center' as const, gap:8 }}>
      <div style={{ position:'relative', marginBottom:16 }}>
        {[{top:-44,left:-44},{top:-34,right:-54},{top:-8,left:64},{top:12,right:64}].map((p,i)=>(
          <div key={i} style={{ position:'absolute', ...(p as CSSProperties) }}>{I.confetti}</div>
        ))}
        <div style={{ width:96, height:96, borderRadius:'50%', background:`linear-gradient(135deg,${C.success},#16A34A)`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto', boxShadow:`0 12px 40px ${C.success}40` }}>
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none"><path d="M12 26l10 10 18-20" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>
      <h1 style={{ fontSize:30, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', letterSpacing:'-0.02em' }}>Review Submitted!</h1>
      <p style={{ fontSize:14, color:C.muted, maxWidth:380, lineHeight:1.75 }}>Thank you for rating <strong style={{color:C.type}}>Kasun Perera</strong>. Your review helps future families make better decisions.</p>

      {/* Reward points */}
      <div style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'12px 22px', borderRadius:16, background:`linear-gradient(135deg,${C.accent}10,${C.accent}20)`, border:`1px solid ${C.accent}25`, margin:'10px 0 6px' }}>
        <span style={{ fontSize:24 }}>⭐</span>
        <div>
          <p style={{ fontSize:16, fontWeight:900, color:C.accent, fontFamily:'Manrope,sans-serif' }}>+50 Reward Points</p>
          <p style={{ fontSize:11, color:C.sub }}>Added to your ReadyPal account</p>
        </div>
      </div>

      <div style={{ display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center', marginTop:8 }}>
        {[
          {l:'View Review',v:'public' as SubView},
          {l:'Browse Care Agents',v:null},
          {l:'Book Next Visit',v:null},
        ].map((a,i)=>(
          <button key={i} onClick={()=>a.v?onBack():onBack()} style={{ padding:'10px 20px', borderRadius:10, border:`1.5px solid ${i===0?C.primary:C.border}`, background:i===0?`${C.primary}08`:'transparent', cursor:'pointer', fontSize:13, fontWeight:700, color:i===0?C.primary:C.sub, fontFamily:'Manrope,sans-serif' }}>{a.l}</button>
        ))}
      </div>
      <button onClick={onBack} style={{ marginTop:12, fontSize:12, fontWeight:700, color:C.muted, background:'none', border:'none', cursor:'pointer', fontFamily:'Manrope,sans-serif' }}>Back to Dashboard</button>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// ROOT
// ──────────────────────────────────────────────────────────────────────────────
export default function ReviewsFeedback() {
  const [view, setView] = useState<SubView>('dashboard')

  const NAV: {key:SubView;label:string}[] = [
    {key:'dashboard', label:'Overview'},
    {key:'wizard',    label:'Leave Review'},
    {key:'public',    label:'All Reviews'},
    {key:'analytics', label:'Analytics'},
    {key:'search',    label:'Search'},
    {key:'private',   label:'Private Feedback'},
  ]

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:C.bg, fontFamily:'Manrope,sans-serif' }}>
      {/* Header */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'0 28px', position:'sticky', top:0, zIndex:30 }}>
        <div style={{ padding:'12px 0 0' }}>
          <p style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:0 }}>Reviews & Feedback</p>
        </div>
        <div style={{ display:'flex', gap:0, overflowX:'auto' }}>
          {NAV.map(n=>(
            <button key={n.key} onClick={()=>setView(n.key)} style={{ padding:'12px 14px', border:'none', background:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:view===n.key?800:500, color:view===n.key?C.primary:C.sub, borderBottom:view===n.key?`2px solid ${C.primary}`:'2px solid transparent', transition:'all 0.15s', whiteSpace:'nowrap' as const }}>
              {n.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflowY:'auto' }}>
        {view==='dashboard' && <Dashboard onNav={setView} />}
        {view==='wizard'    && <LeaveReview onBack={()=>setView('dashboard')} onSuccess={()=>setView('success')} />}
        {view==='public'    && <PublicReviews onBack={()=>setView('dashboard')} />}
        {view==='analytics' && <RatingAnalytics onBack={()=>setView('dashboard')} />}
        {view==='search'    && <ReviewSearch onBack={()=>setView('dashboard')} />}
        {view==='private'   && <PrivateFeedback onBack={()=>setView('dashboard')} />}
        {view==='success'   && <ReviewSuccess onBack={()=>setView('dashboard')} />}
      </div>
    </div>
  )
}
