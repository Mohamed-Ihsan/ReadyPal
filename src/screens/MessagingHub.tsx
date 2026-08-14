import { useState, useEffect, useRef, type ReactNode, type CSSProperties } from 'react'

// ─── Brand ─────────────────────────────────────────────────────────────────────
const C = {
  primary:'#00737A', accent:'#EE8153', type:'#2C3E43', sub:'#6B7E85',
  muted:'#9AAAB0', border:'#E4E8EA', bg:'#F2F4F5', surface:'#FFFFFF',
  success:'#22C55E', warning:'#F59E0B', error:'#EF4444', info:'#3B82F6',
}

// ─── Icons ─────────────────────────────────────────────────────────────────────
const I: Record<string, ReactNode> = {
  search:   <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3"/><path d="M9.5 9.5l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  send:     <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 2L2 7.5l5 1.5m7-7l-4.5 11.5L7 9m7-7L7 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  attach:   <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M12.5 7.5l-5.5 5.5a4 4 0 0 1-5.66-5.66l5.5-5.5a2.5 2.5 0 0 1 3.54 3.54l-5.5 5.5a1 1 0 0 1-1.41-1.41l5-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  camera:   <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="3" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.3"/><circle cx="7" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M5 3l.6-1.5h2.8L9 3" stroke="currentColor" strokeWidth="1.1"/></svg>,
  mic:      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="4.5" y="1" width="5" height="7" rx="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M2 7a5 5 0 0 0 10 0M7 12v1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  emoji:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3"/><path d="M4.5 8.5S5.5 10 7 10s2.5-1.5 2.5-1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="5" cy="5.5" r="0.8" fill="currentColor"/><circle cx="9" cy="5.5" r="0.8" fill="currentColor"/></svg>,
  phone:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2.5A1 1 0 0 1 3 1.5h2l1.5 3.5-1.5 1A7.5 7.5 0 0 0 8.5 9.5l1-1.5L13 9.5v2a1 1 0 0 1-1 1C5 12.5 1.5 9 1.5 3.5A1 1 0 0 1 2 2.5z" stroke="currentColor" strokeWidth="1.2"/></svg>,
  video:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="3.5" width="8.5" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M9.5 6l3.5-2v6l-3.5-2" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  info:     <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3"/><path d="M7 6.5v4M7 5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  more:     <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="3" r="1" fill="currentColor"/><circle cx="7" cy="7" r="1" fill="currentColor"/><circle cx="7" cy="11" r="1" fill="currentColor"/></svg>,
  pin:      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 1l3 3-1.5 1.5L8 4l-3 3 1.5 1.5-1 1L4 8l-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  star:     <svg width="12" height="12" viewBox="0 0 13 13" fill="none"><path d="M6.5 1l1.6 3.2 3.5.5-2.55 2.48.6 3.5L6.5 9l-3.15 1.68.6-3.5L1.4 4.7l3.5-.5z" stroke="currentColor" strokeWidth="1.2"/></svg>,
  starFill: <svg width="12" height="12" viewBox="0 0 13 13" fill="#F59E0B"><path d="M6.5 1l1.6 3.2 3.5.5-2.55 2.48.6 3.5L6.5 9l-3.15 1.68.6-3.5L1.4 4.7l3.5-.5z"/></svg>,
  doc:      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8 1.5H3.5A1.5 1.5 0 0 0 2 3v8a1.5 1.5 0 0 0 1.5 1.5h7A1.5 1.5 0 0 0 12 11V5.5L8 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M8 1.5V5.5H12M5 8h4M5 10h2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  image:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="2" width="11" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/><circle cx="5" cy="5.5" r="1.2" fill="currentColor" opacity="0.4"/><path d="M1.5 9.5l3-3 3 3 2-2 2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  check:    <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1.5 5.5l3 3 5-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  checks:   <svg width="14" height="11" viewBox="0 0 14 11" fill="none"><path d="M1.5 5.5l3 3 5-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M6.5 5.5l3 3 5-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  close:    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  chevL:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3l-5 4 5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevR:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l5 4-5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  archive:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1.5" y="1.5" width="10" height="3" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M2.5 4.5v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6M5.5 7.5h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  bell:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5A3.5 3.5 0 0 0 3 5v3l-1.5 2h10L10 8V5A3.5 3.5 0 0 0 6.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M5.5 10.5a1 1 0 0 0 2 0" stroke="currentColor" strokeWidth="1.1"/></svg>,
  warning:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2L1.5 11h10L6.5 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M6.5 6v2M6.5 10v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  task:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1.5" y="1.5" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M4 6.5l2 2 3.5-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  user:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 12c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  users:    <svg width="14" height="13" viewBox="0 0 14 13" fill="none"><circle cx="5.5" cy="4" r="2" stroke="currentColor" strokeWidth="1.2"/><circle cx="9.5" cy="4" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M1 12c0-2.5 2-4.5 4.5-4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M7.5 12c0-2.5 2-4.5 4.5-4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  sos:      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/><path d="M7 4.5v3.5M7 9.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  location: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1A3.5 3.5 0 0 1 10 4.5C10 7.5 6.5 12 6.5 12S3 7.5 3 4.5A3.5 3.5 0 0 1 6.5 1z" stroke="currentColor" strokeWidth="1.2"/><circle cx="6.5" cy="4.5" r="1.2" stroke="currentColor" strokeWidth="1.1"/></svg>,
  play:     <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 2l7 4-7 4z" fill="currentColor"/></svg>,
  pause:    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="2.5" y="2" width="2.5" height="8" rx="1" fill="currentColor"/><rect x="7" y="2" width="2.5" height="8" rx="1" fill="currentColor"/></svg>,
  download: <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1.5v6M3.5 5.5L6 8l2.5-2.5M2 10h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  edit:     <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8.5 1.5l2 2L4 10H2V8l6.5-6.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  trash:    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 3h8M4.5 3V2h3V3M3 3l.7 7h4.6l.7-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  reply:    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 2.5L1.5 5.5l3 3M1.5 5.5h6a3 3 0 0 1 3 3v1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  forward:  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 2.5l3 3-3 3M10.5 5.5h-6a3 3 0 0 0-3 3v1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  plus:     <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  mute:     <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4H4L7 1.5v9L4 8H2V4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M9.5 4.5l2 2m0-2l-2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  refresh:  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M10.5 6a4.5 4.5 0 1 1-1-2.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M10.5 3v2H8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
}

// ─── Shared atoms ─────────────────────────────────────────────────────────────
function Avatar({ name, size=40, online=false, count=0 }: { name:string; size?:number; online?:boolean; count?:number }) {
  const cols = ['#00737A','#EE8153','#3B82F6','#8B5CF6','#22C55E','#F59E0B','#EC4899']
  const c = cols[name.charCodeAt(0)%cols.length]
  const init = name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
  return (
    <div style={{ position:'relative', flexShrink:0 }}>
      <div style={{ width:size, height:size, borderRadius:'50%', background:`${c}18`, color:c, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:size*0.32, fontFamily:'Manrope,sans-serif', border:`2px solid ${c}28` }}>{init}</div>
      {online && <span style={{ position:'absolute', bottom:1, right:1, width:11, height:11, borderRadius:'50%', background:C.success, border:'2px solid #fff' }} />}
      {count>0 && <span style={{ position:'absolute', top:-3, right:-3, minWidth:18, height:18, borderRadius:99, background:C.error, border:'2px solid #fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, color:'#fff', padding:'0 4px' }}>{count>9?'9+':count}</span>}
    </div>
  )
}

function GroupAvatar({ names }: { names:string[] }) {
  const cols = ['#00737A','#EE8153','#3B82F6']
  return (
    <div style={{ position:'relative', width:44, height:44, flexShrink:0 }}>
      {names.slice(0,3).map((n,i)=>{
        const c = cols[i%cols.length]
        const init = n.split(' ').map(w=>w[0]).join('').slice(0,1).toUpperCase()
        return (
          <div key={i} style={{ position:'absolute', width:26, height:26, borderRadius:'50%', background:`${c}18`, color:c, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:9, border:'2px solid #fff', left: i===0?0:i===1?14:7, top: i===0?0:i===1?4:16 }}>{init}</div>
        )
      })}
    </div>
  )
}

function Bdg({ label, color=C.primary, bg, dot=false }: { label:string; color?:string; bg?:string; dot?:boolean }) {
  return <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'2px 8px', borderRadius:999, fontSize:10, fontWeight:700, background:bg??`${color}12`, color, whiteSpace:'nowrap' }}>{dot&&<span style={{ width:5,height:5,borderRadius:'50%',background:color,display:'inline-block' }} />}{label}</span>
}

// ─── Message status icon ───────────────────────────────────────────────────────
function MsgStatus({ s }: { s:'sending'|'sent'|'delivered'|'read'|'failed' }) {
  if (s==='sending')   return <span style={{ color:C.muted, display:'flex' }}><svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.2"/><path d="M5 3v2.5l1.5 1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg></span>
  if (s==='sent')      return <span style={{ color:C.muted, display:'flex' }}>{I.check}</span>
  if (s==='delivered') return <span style={{ color:C.muted, display:'flex' }}>{I.checks}</span>
  if (s==='read')      return <span style={{ color:C.info, display:'flex' }}>{I.checks}</span>
  return <span style={{ color:C.error, display:'flex' }}>{I.warning}</span>
}

// ─── Data ─────────────────────────────────────────────────────────────────────
type MsgType = 'text'|'image'|'document'|'voice'|'location'|'task_update'|'system'|'checklist'
type MsgStatus = 'sending'|'sent'|'delivered'|'read'|'failed'

interface Message {
  id:string; from:'me'|'other'; text?:string; type:MsgType
  time:string; status:MsgStatus; starred?:boolean; pinned?:boolean
  edited?:boolean; deleted?:boolean
  doc?:{name:string;size:string;color:string}
  img?:{label:string;w:number;h:number;color:string}
  voice?:{dur:string}
  sys?:{title:string;sub:string;icon:string}
  loc?:{place:string}
  task?:{title:string;status:string}
}

interface Conversation {
  id:string; name:string; sub:string; task:string; taskRef:string
  lastMsg:string; lastTime:string; unread:number; online:boolean
  pinned?:boolean; muted?:boolean; emergency?:boolean; group?:boolean
  groupMembers?:string[]; category:'care'|'task'|'completed'|'support'
}

const CONVERSATIONS: Conversation[] = [
  { id:'c1', name:'Kasun Perera', sub:'Hospital Companion', task:'Hospital Appointment — Nimal Perera', taskRef:'RP-T-20259', lastMsg:'I am on my way, will arrive in ~9 minutes.', lastTime:'9:25 AM', unread:2, online:true, pinned:true, category:'task' },
  { id:'c2', name:'Chamari Dissanayake', sub:'Medication Management', task:'Home Wellness — Amara Fernando', taskRef:'RP-T-20231', lastMsg:'Prescription collected. Dropping off now.', lastTime:'Yesterday', unread:0, online:false, category:'care' },
  { id:'c3', name:'Care Team', sub:'Group · 3 members', task:'Hospital Appointment — Nimal Perera', taskRef:'RP-T-20259', lastMsg:'Kasun: All vitals stable, heading to hospital.', lastTime:'9:18 AM', unread:1, online:true, group:true, groupMembers:['Kasun Perera','Mohamed Ihsan','Ruwan Perera'], category:'task' },
  { id:'c4', name:'Nadeesha Silva', sub:'Dementia Care', task:'Daily Care — Sunil Jayasinghe', taskRef:'RP-T-20210', lastMsg:'Visit completed. Report attached.', lastTime:'Mon', unread:0, online:false, category:'completed' },
  { id:'c5', name:'ReadyPal Support', sub:'Support Team', task:'General Support', taskRef:'—', lastMsg:'Your issue has been resolved. Is there anything else?', lastTime:'Sun', unread:0, online:true, category:'support' },
  { id:'c6', name:'Emergency — Kasun', sub:'Emergency Contact', task:'Hospital Appointment — Nimal Perera', taskRef:'RP-T-20259', lastMsg:'Emergency line — tap to call', lastTime:'—', unread:0, online:true, emergency:true, category:'task' },
]

const MESSAGES: Message[] = [
  { id:'m1', from:'other', type:'system', time:'9:00 AM', status:'read', sys:{ title:'Task Started', sub:'Kasun Perera accepted your hospital appointment task · RP-T-20259', icon:'task' } },
  { id:'m2', from:'other', type:'text', text:"Good morning Mr. Ihsan! I have confirmed the task for Nimal's hospital appointment today. I will leave shortly.", time:'9:05 AM', status:'read' },
  { id:'m3', from:'me', type:'text', text:"Good morning Kasun! Please make sure he takes his blood pressure medication before you leave. The appointment is at 10:30 AM with Dr. Sumedha Ranasinghe.", time:'9:06 AM', status:'read' },
  { id:'m4', from:'other', type:'text', text:"Understood! I will confirm the medication before we head out. I will also remind him about the low-salt diet.", time:'9:07 AM', status:'read' },
  { id:'m5', from:'other', type:'checklist', time:'9:20 AM', status:'read', task:{ title:'Medication Confirmed ✓', status:'Metformin 500mg + Amlodipine 5mg administered' } },
  { id:'m6', from:'other', type:'image', time:'9:21 AM', status:'read', img:{ label:'Prescription Photo', w:260, h:160, color:'#3B82F6' } },
  { id:'m7', from:'other', type:'document', time:'9:22 AM', status:'read', doc:{ name:'Prescription_14Jan2025.pdf', size:'142 KB', color:'#EF4444' } },
  { id:'m8', from:'me', type:'text', text:"Great, thank you! Please keep me updated when you arrive at the hospital.", time:'9:23 AM', status:'read' },
  { id:'m9', from:'other', type:'voice', time:'9:24 AM', status:'read', voice:{ dur:'0:32' } },
  { id:'m10', from:'other', type:'text', text:"I am on my way, will arrive in ~9 minutes.", time:'9:25 AM', status:'delivered', pinned:true },
  { id:'m11', from:'other', type:'location', time:'9:25 AM', status:'delivered', loc:{ place:'Kandy–Colombo Road, near Peradeniya Junction' } },
]

const QUICK_REPLIES = ["Understood, thank you!", "Please send the report.", "How is Nimal doing?", "On my way 👍", "Please call me."]

// ─── Chat window ──────────────────────────────────────────────────────────────
function ChatWindow({ conv, onBack, showPanel, onTogglePanel }: {
  conv:Conversation; onBack:()=>void; showPanel:boolean; onTogglePanel:()=>void
}) {
  const [text, setText] = useState('')
  const [messages, setMessages] = useState<Message[]>(MESSAGES)
  const [typing, setTyping] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [ctxMenu, setCtxMenu] = useState<{id:string;x:number;y:number}|null>(null)
  const [starredIds, setStarredIds] = useState<Set<string>>(new Set(['m10']))
  const [recording, setRecording] = useState(false)
  const [recTime, setRecTime] = useState(0)
  const [searchMsg, setSearchMsg] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  // simulate typing when something is typed
  useEffect(() => {
    if (text.length > 0) { setTyping(true) }
    const t = setTimeout(()=>setTyping(false), 2000)
    return ()=>clearTimeout(t)
  }, [text])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages])

  useEffect(() => {
    if (!recording) { setRecTime(0); return }
    const t = setInterval(()=>setRecTime(p=>p+1), 1000)
    return ()=>clearInterval(t)
  }, [recording])

  const sendMsg = () => {
    if (!text.trim()) return
    const m: Message = { id:`m${Date.now()}`, from:'me', type:'text', text:text.trim(), time:'Now', status:'sending' }
    setMessages(p=>[...p, m])
    setText('')
    setShowQR(false)
    setTimeout(()=>setMessages(p=>p.map(x=>x.id===m.id?{...x,status:'sent'}:x)), 600)
    setTimeout(()=>setMessages(p=>p.map(x=>x.id===m.id?{...x,status:'delivered'}:x)), 1400)
    setTimeout(()=>setMessages(p=>p.map(x=>x.id===m.id?{...x,status:'read'}:x)), 2800)
  }

  const toggleStar = (id:string) => setStarredIds(p=>{ const n=new Set(p); n.has(id)?n.delete(id):n.add(id); return n })
  const deleteMsg  = (id:string) => setMessages(p=>p.map(m=>m.id===id?{...m,deleted:true,text:'Message deleted'}:m))

  const filtered = searchMsg ? messages.filter(m=>m.text?.toLowerCase().includes(searchMsg.toLowerCase())) : messages

  const renderBubble = (m:Message) => {
    if (m.type==='system') return (
      <div key={m.id} style={{ display:'flex', justifyContent:'center', marginBottom:10 }}>
        <div style={{ display:'flex', gap:8, alignItems:'center', padding:'8px 14px', borderRadius:12, background:`${C.primary}08`, border:`1px solid ${C.primary}18`, maxWidth:380 }}>
          <span style={{ color:C.primary, display:'flex' }}>{I.task}</span>
          <div>
            <p style={{ fontSize:12, fontWeight:800, color:C.primary }}>{m.sys!.title}</p>
            <p style={{ fontSize:11, color:C.sub }}>{m.sys!.sub}</p>
          </div>
        </div>
      </div>
    )

    const isMe = m.from==='me'
    const isStarred = starredIds.has(m.id)

    return (
      <div key={m.id} style={{ display:'flex', justifyContent:isMe?'flex-end':'flex-start', marginBottom:6, paddingRight:isMe?0:8, paddingLeft:isMe?8:0 }}>
        {!isMe && <div style={{ marginRight:7, marginTop:'auto', flexShrink:0 }}><Avatar name={conv.name} size={28} /></div>}
        <div style={{ maxWidth:'72%', position:'relative' }}
          onContextMenu={e=>{ e.preventDefault(); setCtxMenu({id:m.id, x:e.clientX, y:e.clientY}) }}
        >
          {m.pinned && <div style={{ display:'flex', alignItems:'center', gap:3, marginBottom:2, color:C.warning }}><span style={{ display:'flex', transform:'scale(0.8)' }}>{I.pin}</span><p style={{ fontSize:10, fontWeight:700 }}>Pinned</p></div>}
          {isStarred && <div style={{ position:'absolute', top:4, right:4, zIndex:1 }}><span style={{ display:'flex' }}>{I.starFill}</span></div>}

          {m.deleted ? (
            <div style={{ padding:'8px 14px', borderRadius:16, background:'#F2F4F5', fontStyle:'italic', color:C.muted, fontSize:12 }}>Message deleted</div>
          ) : m.type==='text' ? (
            <div style={{ padding:'10px 14px', borderRadius:isMe?'16px 4px 16px 16px':'4px 16px 16px 16px', background:isMe?`linear-gradient(135deg,${C.primary},#00959E)`:C.surface, color:isMe?'#fff':C.type, fontSize:13, lineHeight:1.6, boxShadow:'0 1px 4px rgba(44,62,67,0.10)', border:isMe?'none':`1px solid ${C.border}` }}>
              {m.text}
              {m.edited && <span style={{ fontSize:10, opacity:0.6, marginLeft:6 }}>edited</span>}
            </div>
          ) : m.type==='image' ? (
            <div style={{ borderRadius:14, overflow:'hidden', boxShadow:'0 2px 8px rgba(44,62,67,0.12)', cursor:'pointer', position:'relative' }}>
              <div style={{ width:m.img!.w, maxWidth:'100%', height:m.img!.h, background:`linear-gradient(135deg,${m.img!.color}20,${m.img!.color}40)`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ color:m.img!.color, display:'flex', transform:'scale(2.5)' }}>{I.image}</span>
              </div>
              <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'6px 10px', background:'linear-gradient(transparent,rgba(0,0,0,0.5))' }}>
                <p style={{ fontSize:11, fontWeight:600, color:'#fff' }}>{m.img!.label}</p>
              </div>
            </div>
          ) : m.type==='document' ? (
            <div style={{ padding:'12px 14px', borderRadius:14, background:isMe?`linear-gradient(135deg,${C.primary},#00959E)`:C.surface, border:isMe?'none':`1px solid ${C.border}`, display:'flex', gap:10, alignItems:'center', minWidth:220, boxShadow:'0 1px 4px rgba(44,62,67,0.08)' }}>
              <div style={{ width:38, height:38, borderRadius:10, background:`${m.doc!.color}18`, display:'flex', alignItems:'center', justifyContent:'center', color:m.doc!.color, flexShrink:0 }}>{I.doc}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:12, fontWeight:700, color:isMe?'#fff':C.type, marginBottom:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.doc!.name}</p>
                <p style={{ fontSize:11, color:isMe?'rgba(255,255,255,0.7)':C.muted }}>{m.doc!.size}</p>
              </div>
              <button style={{ background:'none', border:'none', cursor:'pointer', color:isMe?'rgba(255,255,255,0.85)':C.primary, display:'flex' }}>{I.download}</button>
            </div>
          ) : m.type==='voice' ? (
            <div style={{ padding:'10px 14px', borderRadius:14, background:isMe?`linear-gradient(135deg,${C.primary},#00959E)`:C.surface, border:isMe?'none':`1px solid ${C.border}`, display:'flex', gap:10, alignItems:'center', minWidth:200 }}>
              <button style={{ width:32, height:32, borderRadius:'50%', background:isMe?'rgba(255,255,255,0.2)':C.bg, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:isMe?'#fff':C.primary }}>{I.play}</button>
              {/* Waveform bars */}
              <div style={{ flex:1, display:'flex', alignItems:'center', gap:2, height:24 }}>
                {Array.from({length:28}).map((_,i)=>(
                  <div key={i} style={{ flex:1, borderRadius:2, background:isMe?'rgba(255,255,255,0.55)':C.primary+'40', height:`${20+Math.sin(i*0.8)*12}px` }} />
                ))}
              </div>
              <p style={{ fontSize:11, color:isMe?'rgba(255,255,255,0.8)':C.muted, flexShrink:0 }}>{m.voice!.dur}</p>
            </div>
          ) : m.type==='location' ? (
            <div style={{ borderRadius:14, overflow:'hidden', border:`1px solid ${C.border}`, cursor:'pointer', minWidth:220 }}>
              <div style={{ height:80, background:`linear-gradient(135deg,#E8F0E9,#D5E8DC)`, position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <div style={{ position:'absolute', inset:0, opacity:0.3 }}>
                  {[20,40,60,80].map(p=><div key={p} style={{ position:'absolute', left:0, right:0, top:`${p}%`, height:1, background:C.primary }} />)}
                  {[20,40,60,80].map(p=><div key={p} style={{ position:'absolute', top:0, bottom:0, left:`${p}%`, width:1, background:C.primary }} />)}
                </div>
                <span style={{ display:'flex', zIndex:1 }}>{I.location}</span>
              </div>
              <div style={{ padding:'8px 12px', background:C.surface }}>
                <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{I.location} Live Location</p>
                <p style={{ fontSize:11, color:C.muted, marginTop:2 }}>{m.loc!.place}</p>
              </div>
            </div>
          ) : m.type==='checklist' ? (
            <div style={{ padding:'10px 14px', borderRadius:14, background:`${C.success}08`, border:`1px solid ${C.success}25`, minWidth:200 }}>
              <div style={{ display:'flex', gap:7, alignItems:'center' }}>
                <div style={{ width:22, height:22, borderRadius:'50%', background:C.success, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <span style={{ color:'#fff', display:'flex', transform:'scale(0.8)' }}>{I.check}</span>
                </div>
                <div>
                  <p style={{ fontSize:12, fontWeight:800, color:C.success }}>{m.task!.title}</p>
                  <p style={{ fontSize:11, color:C.sub }}>{m.task!.status}</p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Timestamp + status */}
          <div style={{ display:'flex', justifyContent:isMe?'flex-end':'flex-start', alignItems:'center', gap:4, marginTop:2, paddingLeft:2, paddingRight:2 }}>
            <p style={{ fontSize:10, color:C.muted }}>{m.time}</p>
            {isMe && <MsgStatus s={m.status} />}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', height:'100%', overflow:'hidden' }}>
      {/* Header */}
      <div style={{ padding:'12px 18px', background:C.surface, borderBottom:`1px solid ${C.border}`, display:'flex', gap:12, alignItems:'center', flexShrink:0 }}>
        <button onClick={onBack} className="msg-back-btn" style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, display:'flex', padding:4 }}>{I.chevL}</button>
        {conv.group ? <GroupAvatar names={conv.groupMembers??[]} /> : <Avatar name={conv.name} size={40} online={conv.online} />}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{conv.name}</p>
            {conv.emergency && <Bdg label="Emergency" color={C.error} dot />}
            {conv.pinned && <span style={{ color:C.warning, display:'flex' }}>{I.pin}</span>}
          </div>
          <p style={{ fontSize:11, color:C.muted, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{typing?<span style={{ color:C.primary }}>typing…</span>:conv.online?'Online':conv.sub}</p>
        </div>
        <div style={{ display:'flex', gap:4 }}>
          {showSearch
            ? <input autoFocus value={searchMsg} onChange={e=>setSearchMsg(e.target.value)} placeholder="Search messages…"
                style={{ padding:'6px 10px', borderRadius:9, border:`1.5px solid ${C.primary}`, fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, outline:'none', width:180 }}
                onBlur={()=>{ if(!searchMsg) setShowSearch(false) }} />
            : <button onClick={()=>setShowSearch(true)} style={{ width:32, height:32, borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.sub }}>{I.search}</button>
          }
          <button style={{ width:32, height:32, borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.sub }}>{I.phone}</button>
          <button style={{ width:32, height:32, borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.sub }}>{I.video}</button>
          <button onClick={onTogglePanel} style={{ width:32, height:32, borderRadius:9, border:`1px solid ${showPanel?C.primary:C.border}`, background:showPanel?`${C.primary}08`:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:showPanel?C.primary:C.sub }}>{I.info}</button>
          <button style={{ width:32, height:32, borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.sub }}>{I.more}</button>
        </div>
      </div>

      {/* Task context bar */}
      <div style={{ padding:'7px 18px', background:`${C.primary}06`, borderBottom:`1px solid ${C.primary}14`, display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
        <span style={{ color:C.primary, display:'flex' }}>{I.task}</span>
        <p style={{ fontSize:11, fontWeight:700, color:C.primary, flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{conv.task}</p>
        <Bdg label={conv.taskRef} color={C.primary} />
      </div>

      {/* Messages area */}
      <div style={{ flex:1, overflowY:'auto', padding:'16px 12px', display:'flex', flexDirection:'column', background:'#F8FAFA' }} onClick={()=>setCtxMenu(null)}>
        {filtered.map(renderBubble)}
        {typing && (
          <div style={{ display:'flex', justifyContent:'flex-start', marginBottom:8 }}>
            <Avatar name={conv.name} size={28} />
            <div style={{ marginLeft:8, padding:'10px 14px', borderRadius:'4px 16px 16px 16px', background:C.surface, border:`1px solid ${C.border}`, display:'flex', gap:4, alignItems:'center' }}>
              {[0,0.2,0.4].map((d,i)=>(
                <div key={i} style={{ width:7, height:7, borderRadius:'50%', background:C.muted, animation:`bounce 1s ${d}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick replies */}
      {showQR && (
        <div style={{ padding:'8px 12px', borderTop:`1px solid ${C.border}`, background:C.surface, display:'flex', gap:6, overflowX:'auto', flexShrink:0 }}>
          {QUICK_REPLIES.map(r=>(
            <button key={r} onClick={()=>setText(r)} style={{ padding:'6px 12px', borderRadius:999, border:`1.5px solid ${C.primary}30`, background:`${C.primary}06`, cursor:'pointer', fontSize:12, fontWeight:600, color:C.primary, fontFamily:'Manrope,sans-serif', whiteSpace:'nowrap' }}>{r}</button>
          ))}
        </div>
      )}

      {/* Composer */}
      <div style={{ padding:'10px 12px', background:C.surface, borderTop:`1px solid ${C.border}`, flexShrink:0 }}>
        {recording ? (
          <div style={{ display:'flex', gap:10, alignItems:'center', padding:'10px 14px', borderRadius:14, background:`${C.error}06`, border:`1.5px solid ${C.error}25` }}>
            <div style={{ width:10, height:10, borderRadius:'50%', background:C.error, boxShadow:`0 0 0 3px ${C.error}30` }} />
            <p style={{ fontSize:13, fontWeight:700, color:C.error, flex:1 }}>Recording… {Math.floor(recTime/60)}:{String(recTime%60).padStart(2,'0')}</p>
            <div style={{ display:'flex', gap:6 }}>
              {Array.from({length:18}).map((_,i)=>(
                <div key={i} style={{ width:2, borderRadius:2, background:C.error+'60', height:`${8+Math.sin(i*0.9)*8}px` }} />
              ))}
            </div>
            <button onClick={()=>setRecording(false)} style={{ padding:'6px 12px', borderRadius:8, border:`1px solid ${C.error}30`, background:C.error, cursor:'pointer', fontSize:12, fontWeight:700, color:'#fff', fontFamily:'Manrope,sans-serif' }}>Send</button>
            <button onClick={()=>setRecording(false)} style={{ width:28, height:28, borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.muted }}>{I.close}</button>
          </div>
        ) : (
          <div style={{ display:'flex', gap:8, alignItems:'flex-end' }}>
            <div style={{ display:'flex', gap:4 }}>
              <button style={{ width:34, height:34, borderRadius:10, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.sub }}>{I.attach}</button>
              <button style={{ width:34, height:34, borderRadius:10, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.sub }}>{I.camera}</button>
            </div>
            <div style={{ flex:1, display:'flex', flexDirection:'column', borderRadius:14, border:`1.5px solid ${text.length?C.primary:C.border}`, background:'#FAFAFA', overflow:'hidden', transition:'border-color 0.15s' }}>
              <textarea value={text} onChange={e=>setText(e.target.value)}
                onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); sendMsg() } }}
                placeholder="Type a message…" rows={1}
                style={{ padding:'9px 12px', border:'none', background:'transparent', fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, resize:'none', outline:'none', maxHeight:100 }} />
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'4px 8px' }}>
                <div style={{ display:'flex', gap:2 }}>
                  <button onClick={()=>setShowQR(v=>!v)} style={{ width:26, height:26, borderRadius:7, border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:showQR?C.primary:C.muted }}>{I.reply}</button>
                  <button style={{ width:26, height:26, borderRadius:7, border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.muted }}>{I.emoji}</button>
                </div>
                {text.length>0 && <p style={{ fontSize:10, color:C.muted }}>{text.length}/500</p>}
              </div>
            </div>
            {text.trim() ? (
              <button onClick={sendMsg} style={{ width:40, height:40, borderRadius:12, border:'none', background:`linear-gradient(135deg,${C.primary},#00959E)`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', boxShadow:`0 4px 14px ${C.primary}40` }}>{I.send}</button>
            ) : (
              <button onClick={()=>setRecording(true)} style={{ width:40, height:40, borderRadius:12, border:`1.5px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.sub }}>{I.mic}</button>
            )}
          </div>
        )}
      </div>

      {/* Context menu */}
      {ctxMenu && (
        <div style={{ position:'fixed', left:ctxMenu.x, top:ctxMenu.y, zIndex:100, background:C.surface, borderRadius:12, boxShadow:'0 8px 28px rgba(44,62,67,0.16)', border:`1px solid ${C.border}`, overflow:'hidden', minWidth:160 }}>
          {[
            { icon:I.reply,   label:'Reply',      action:()=>setCtxMenu(null) },
            { icon:I.forward, label:'Forward',    action:()=>setCtxMenu(null) },
            { icon:starredIds.has(ctxMenu.id)?I.star:I.starFill, label:starredIds.has(ctxMenu.id)?'Unstar':'Star', action:()=>{ toggleStar(ctxMenu.id); setCtxMenu(null) } },
            { icon:I.pin,     label:'Pin Message',action:()=>setCtxMenu(null) },
            { icon:I.edit,    label:'Edit',       action:()=>setCtxMenu(null) },
            { icon:I.trash,   label:'Delete',     action:()=>{ deleteMsg(ctxMenu.id); setCtxMenu(null) } },
          ].map(a=>(
            <button key={a.label} onClick={a.action} style={{ width:'100%', padding:'10px 14px', border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', gap:9, fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:600, color:a.label==='Delete'?C.error:C.type, textAlign:'left' as const }} onMouseOver={e=>{(e.currentTarget as HTMLButtonElement).style.background='#F2F4F5'}} onMouseOut={e=>{(e.currentTarget as HTMLButtonElement).style.background='transparent'}}>
              <span style={{ color:a.label==='Delete'?C.error:C.muted, display:'flex' }}>{a.icon}</span>{a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Inbox sidebar ────────────────────────────────────────────────────────────
function Inbox({ activeId, onSelect }: { activeId:string|null; onSelect:(id:string)=>void }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [tab, setTab] = useState<'all'|'care'|'task'|'completed'|'support'>('all')
  const cats = ['All','Care','Tasks','Completed','Support']

  const filtered = CONVERSATIONS.filter(c=>{
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.lastMsg.toLowerCase().includes(search.toLowerCase())
    const matchTab = tab==='all' || c.category===tab || (tab==='care'&&c.category==='care') || (tab==='task'&&c.category==='task') || (tab==='completed'&&c.category==='completed') || (tab==='support'&&c.category==='support')
    const matchFilter = filter==='All' || (filter==='Unread'&&c.unread>0) || (filter==='Pinned'&&c.pinned)
    return matchSearch && matchTab && matchFilter
  })

  const pinned = filtered.filter(c=>c.pinned)
  const rest   = filtered.filter(c=>!c.pinned)

  const renderCard = (c:Conversation) => (
    <button key={c.id} onClick={()=>onSelect(c.id)}
      style={{ width:'100%', padding:'12px 14px', border:'none', background:activeId===c.id?`${C.primary}08`:'transparent', cursor:'pointer', textAlign:'left' as const, borderLeft: activeId===c.id?`3px solid ${C.primary}`:'3px solid transparent', transition:'all 0.15s' }}
      onMouseOver={e=>{ if(activeId!==c.id)(e.currentTarget as HTMLButtonElement).style.background='#F2F4F5' }}
      onMouseOut={e=>{ if(activeId!==c.id)(e.currentTarget as HTMLButtonElement).style.background='transparent' }}>
      <div style={{ display:'flex', gap:10, alignItems:'center' }}>
        {c.group ? <GroupAvatar names={c.groupMembers??[]} /> : <Avatar name={c.name} size={44} online={c.online} count={c.unread} />}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:2 }}>
            <div style={{ display:'flex', gap:5, alignItems:'center' }}>
              <p style={{ fontSize:13, fontWeight:c.unread>0?900:700, color:C.type, fontFamily:'Manrope,sans-serif' }}>{c.name}</p>
              {c.emergency && <span style={{ color:C.error, display:'flex' }}>{I.sos}</span>}
              {c.pinned && <span style={{ color:C.warning, display:'flex', transform:'scale(0.8)' }}>{I.pin}</span>}
              {c.muted && <span style={{ color:C.muted, display:'flex', transform:'scale(0.8)' }}>{I.mute}</span>}
            </div>
            <p style={{ fontSize:10, color:C.muted, flexShrink:0 }}>{c.lastTime}</p>
          </div>
          <p style={{ fontSize:12, color:c.unread>0?C.type:C.muted, fontWeight:c.unread>0?600:400, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.lastMsg}</p>
        </div>
      </div>
    </button>
  )

  return (
    <div style={{ width:300, flexShrink:0, borderRight:`1px solid ${C.border}`, background:C.surface, display:'flex', flexDirection:'column', height:'100%', overflow:'hidden' }}>
      {/* Header */}
      <div style={{ padding:'16px 14px 10px', borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
          <h2 style={{ fontSize:17, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Messages</h2>
          <div style={{ display:'flex', gap:4 }}>
            <button style={{ width:30, height:30, borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.sub }}>{I.edit}</button>
            <button style={{ width:30, height:30, borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.sub }}>{I.plus}</button>
          </div>
        </div>
        {/* Search */}
        <div style={{ position:'relative' }}>
          <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:C.muted, display:'flex' }}>{I.search}</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search conversations…"
            style={{ width:'100%', padding:'8px 10px 8px 30px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, outline:'none', background:'#F8FAFA', boxSizing:'border-box' as const }} />
        </div>
        {/* Filters */}
        <div style={{ display:'flex', gap:5, marginTop:8 }}>
          {['All','Unread','Pinned'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{ padding:'4px 10px', borderRadius:999, border:`1px solid ${filter===f?C.primary:C.border}`, background:filter===f?`${C.primary}10`:'transparent', cursor:'pointer', fontSize:11, fontWeight:700, color:filter===f?C.primary:C.sub, fontFamily:'Manrope,sans-serif' }}>{f}</button>
          ))}
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ display:'flex', borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        {cats.map(ct=>{
          const k = ct==='All'?'all':ct==='Care'?'care':ct==='Tasks'?'task':ct==='Completed'?'completed':'support'
          return (
            <button key={ct} onClick={()=>setTab(k as typeof tab)} style={{ flex:1, padding:'8px 2px', border:'none', background:'transparent', cursor:'pointer', fontSize:11, fontWeight:tab===k?800:500, color:tab===k?C.primary:C.muted, borderBottom:tab===k?`2px solid ${C.primary}`:'2px solid transparent', fontFamily:'Manrope,sans-serif', whiteSpace:'nowrap' }}>{ct}</button>
          )
        })}
      </div>

      {/* Conversation list */}
      <div style={{ flex:1, overflowY:'auto' }}>
        {pinned.length>0 && (
          <>
            <div style={{ padding:'8px 14px 4px', display:'flex', alignItems:'center', gap:5 }}>
              <span style={{ color:C.warning, display:'flex', transform:'scale(0.85)' }}>{I.pin}</span>
              <p style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:'uppercase', letterSpacing:'0.06em' }}>Pinned</p>
            </div>
            {pinned.map(renderCard)}
            <div style={{ height:1, background:C.border, margin:'4px 14px' }} />
          </>
        )}
        {rest.map(renderCard)}
        {!filtered.length && (
          <div style={{ padding:'40px 20px', textAlign:'center' }}>
            <p style={{ fontSize:13, color:C.muted }}>No conversations found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Task context panel ────────────────────────────────────────────────────────
function TaskPanel({ conv }: { conv:Conversation }) {
  const tlItems = [
    {e:'Task Accepted',   t:'9:00 AM', done:true},
    {e:'Journey Started', t:'9:05 AM', done:true},
    {e:'Arrived at Home', t:'9:14 AM', done:true},
    {e:'En Route to Hospital', t:'9:25 AM', done:true},
    {e:'Arrival at Hospital', t:'~9:34 AM', done:false},
    {e:'Care Completed',  t:'~12:00 PM', done:false},
  ]
  return (
    <div style={{ width:260, flexShrink:0, borderLeft:`1px solid ${C.border}`, background:'#FAFAFA', display:'flex', flexDirection:'column', height:'100%', overflow:'hidden' }}>
      <div style={{ padding:'14px 16px', borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        <p style={{ fontSize:12, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.06em' }}>Task Context</p>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'14px 16px', display:'flex', flexDirection:'column', gap:14 }}>
        {/* Agent */}
        <div>
          <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:8 }}>CARE AGENT</p>
          <div style={{ display:'flex', gap:9, alignItems:'center' }}>
            <Avatar name={conv.name} size={38} online={conv.online} />
            <div>
              <p style={{ fontSize:13, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{conv.name}</p>
              <p style={{ fontSize:11, color:C.muted }}>{conv.online?'Online':'Offline'}</p>
            </div>
          </div>
        </div>
        {/* Task */}
        <div style={{ padding:'12px 13px', borderRadius:12, background:`${C.primary}07`, border:`1px solid ${C.primary}16` }}>
          <div style={{ display:'flex', gap:6, alignItems:'flex-start', marginBottom:6 }}>
            <span style={{ color:C.primary, display:'flex', marginTop:1 }}>{I.task}</span>
            <p style={{ fontSize:12, fontWeight:700, color:C.type, lineHeight:1.4 }}>{conv.task}</p>
          </div>
          <Bdg label={conv.taskRef} color={C.primary} />
        </div>
        {/* Status */}
        <div>
          <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:8 }}>STATUS</p>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:C.accent, boxShadow:`0 0 0 3px ${C.accent}30` }} />
            <p style={{ fontSize:13, fontWeight:700, color:C.accent }}>Travelling</p>
          </div>
        </div>
        {/* Timeline */}
        <div>
          <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:8 }}>TIMELINE</p>
          {tlItems.map((ev,i)=>(
            <div key={i} style={{ display:'flex', gap:8 }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                <div style={{ width:16, height:16, borderRadius:'50%', background:ev.done?C.primary:`${C.border}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {ev.done && <span style={{ color:'#fff', display:'flex', transform:'scale(0.7)' }}>{I.check}</span>}
                </div>
                {i<tlItems.length-1 && <div style={{ width:1.5, flex:1, minHeight:8, background:ev.done?C.primary:C.border, margin:'2px 0' }} />}
              </div>
              <div style={{ paddingBottom: i<tlItems.length-1?8:0 }}>
                <p style={{ fontSize:11, fontWeight:ev.done?700:400, color:ev.done?C.type:C.muted }}>{ev.e}</p>
                <p style={{ fontSize:10, color:C.muted }}>{ev.t}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Quick actions */}
        <div>
          <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:8 }}>QUICK ACTIONS</p>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {[{icon:I.task, l:'View Full Task'},{icon:I.location, l:'Track Live'},{icon:I.phone, l:'Call Agent'},{icon:I.sos, l:'Emergency', c:C.error}].map(a=>(
              <button key={a.l} style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 10px', borderRadius:9, border:`1px solid ${a.c?C.error+'25':C.border}`, background:a.c?`${C.error}05`:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:600, color:a.c??C.type, textAlign:'left' as const }}>
                <span style={{ color:a.c??C.primary, display:'flex' }}>{a.icon}</span>{a.l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:14, background:'#F8FAFA' }}>
      <div style={{ width:80, height:80, borderRadius:'50%', background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M4 6h28a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H10l-8 6V8a2 2 0 0 1 2-2z" stroke={C.primary} strokeWidth="1.5" strokeLinejoin="round"/><path d="M12 14h12M12 19h8" stroke={C.primary} strokeWidth="1.4" strokeLinecap="round"/></svg>
      </div>
      <div style={{ textAlign:'center' }}>
        <p style={{ fontSize:16, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Select a conversation</p>
        <p style={{ fontSize:13, color:C.muted, maxWidth:260 }}>Choose a conversation from the list to start messaging.</p>
      </div>
    </div>
  )
}

// ─── Notification settings overlay ────────────────────────────────────────────
function NotifSettings({ onClose }: { onClose:()=>void }) {
  const [settings, setSettings] = useState({ push:true, email:false, sms:true, mute:false, mentions:true })
  const toggle = (k:keyof typeof settings) => setSettings(p=>({...p,[k]:!p[k]}))
  return (
    <div style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.3)', backdropFilter:'blur(4px)' }} />
      <div style={{ position:'relative', zIndex:1, background:C.surface, borderRadius:20, padding:28, maxWidth:380, width:'100%', boxShadow:'0 20px 60px rgba(0,0,0,0.15)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
          <h3 style={{ fontSize:16, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Notification Settings</h3>
          <button onClick={onClose} style={{ width:30, height:30, borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.muted }}>{I.close}</button>
        </div>
        {[
          {k:'push' as const, l:'Push Notifications', sub:'Real-time alerts on your device'},
          {k:'email' as const, l:'Email Notifications', sub:'Summary to your inbox'},
          {k:'sms' as const, l:'SMS Notifications', sub:'Text alerts for urgent messages'},
          {k:'mute' as const, l:'Mute This Conversation', sub:'No alerts until unmuted'},
          {k:'mentions' as const, l:'Mention Alerts', sub:'Notify when someone @mentions you'},
        ].map(s=>(
          <div key={s.k} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderBottom:`1px solid ${C.border}` }}>
            <div>
              <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{s.l}</p>
              <p style={{ fontSize:11, color:C.muted }}>{s.sub}</p>
            </div>
            <div onClick={()=>toggle(s.k)} style={{ width:44, height:24, borderRadius:12, background:settings[s.k]?C.primary:C.border, cursor:'pointer', position:'relative', transition:'background 0.2s', flexShrink:0 }}>
              <div style={{ position:'absolute', top:3, left:settings[s.k]?22:3, width:18, height:18, borderRadius:'50%', background:'#fff', transition:'left 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.2)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function MessagingHub() {
  const [activeId, setActiveId] = useState<string|null>('c1')
  const [showPanel, setShowPanel] = useState(true)
  const [showNotif, setShowNotif] = useState(false)
  const [mobileView, setMobileView] = useState<'inbox'|'chat'>('inbox')

  const activeConv = CONVERSATIONS.find(c=>c.id===activeId) ?? null

  const handleSelect = (id:string) => { setActiveId(id); setMobileView('chat') }
  const handleBack   = () => setMobileView('inbox')

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', background:C.bg, fontFamily:'Manrope,sans-serif' }}>
      {/* Top bar */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'10px 20px', display:'flex', alignItems:'center', gap:12, flexShrink:0, zIndex:20 }}>
        <h1 style={{ fontSize:15, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', flex:1 }}>Messaging Hub</h1>
        <div style={{ display:'flex', alignItems:'center', gap:4 }}>
          <div style={{ width:7, height:7, borderRadius:'50%', background:C.success, boxShadow:`0 0 0 2px ${C.success}30` }} />
          <p style={{ fontSize:11, fontWeight:700, color:C.success }}>Connected</p>
        </div>
        <button onClick={()=>setShowNotif(true)} style={{ width:32, height:32, borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.sub, position:'relative' }}>
          {I.bell}
          <span style={{ position:'absolute', top:4, right:4, width:7, height:7, borderRadius:'50%', background:C.error, border:'1.5px solid #fff' }} />
        </button>
        <button style={{ width:32, height:32, borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.sub }}>{I.archive}</button>
      </div>

      {/* Main layout */}
      <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
        {/* Inbox sidebar — hide on mobile when chat is open */}
        <div className={`msg-inbox${mobileView==='chat'?' msg-hide':''}`} style={{ display:'flex' }}>
          <Inbox activeId={activeId} onSelect={handleSelect} />
        </div>

        {/* Chat area + context panel */}
        <div className={`msg-chat${mobileView==='inbox'?' msg-hide':''}`} style={{ flex:1, display:'flex', overflow:'hidden', minWidth:0 }}>
          {activeConv
            ? <ChatWindow conv={activeConv} onBack={handleBack} showPanel={showPanel} onTogglePanel={()=>setShowPanel(v=>!v)} />
            : <EmptyState />
          }
          {activeConv && showPanel && (
            <div className="msg-panel">
              <TaskPanel conv={activeConv} />
            </div>
          )}
        </div>
      </div>

      {showNotif && <NotifSettings onClose={()=>setShowNotif(false)} />}
    </div>
  )
}
