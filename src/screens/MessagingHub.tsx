import { useState, useEffect, useRef, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  getMyConversations, getConversationMessages, sendMessage, editMessage, deleteMessage,
  toggleMessageStar, toggleMessagePin, updateConversationPreferences, getMyBookings,
  getOrCreateBookingConversation, getCurrentUser,
} from '../lib/api'

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
  phone:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2.5A1 1 0 0 1 3 1.5h2l1.5 3.5-1.5 1A7.5 7.5 0 0 0 8.5 9.5l1-1.5L13 9.5v2a1 1 0 0 1-1 1C5 12.5 1.5 9 1.5 3.5A1 1 0 0 1 2 2.5z" stroke="currentColor" strokeWidth="1.2"/></svg>,
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
  bell:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5A3.5 3.5 0 0 0 3 5v3l-1.5 2h10L10 8V5A3.5 3.5 0 0 0 6.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M5.5 10.5a1 1 0 0 0 2 0" stroke="currentColor" strokeWidth="1.1"/></svg>,
  warning:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2L1.5 11h10L6.5 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M6.5 6v2M6.5 10v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  task:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1.5" y="1.5" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M4 6.5l2 2 3.5-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  sos:      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/><path d="M7 4.5v3.5M7 9.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  location: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1A3.5 3.5 0 0 1 10 4.5C10 7.5 6.5 12 6.5 12S3 7.5 3 4.5A3.5 3.5 0 0 1 6.5 1z" stroke="currentColor" strokeWidth="1.2"/><circle cx="6.5" cy="4.5" r="1.2" stroke="currentColor" strokeWidth="1.1"/></svg>,
  edit:     <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8.5 1.5l2 2L4 10H2V8l6.5-6.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  trash:    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 3h8M4.5 3V2h3V3M3 3l.7 7h4.6l.7-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  plus:     <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  mute:     <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4H4L7 1.5v9L4 8H2V4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M9.5 4.5l2 2m0-2l-2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
}

// ─── Shared atoms ─────────────────────────────────────────────────────────────
function Avatar({ name, size=40 }: { name:string; size?:number }) {
  const cols = ['#00737A','#EE8153','#3B82F6','#8B5CF6','#22C55E','#F59E0B','#EC4899']
  const c = cols[(name.charCodeAt(0)||0)%cols.length]
  const init = name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() || '?'
  return (
    <div style={{ position:'relative', flexShrink:0 }}>
      <div style={{ width:size, height:size, borderRadius:'50%', background:`${c}18`, color:c, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:size*0.32, fontFamily:'Manrope,sans-serif', border:`2px solid ${c}28` }}>{init}</div>
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

function MsgStatus({ s }: { s:MessageStatus }) {
  if (s==='sending')   return <span style={{ color:C.muted, display:'flex' }}><svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.2"/><path d="M5 3v2.5l1.5 1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg></span>
  if (s==='sent')      return <span style={{ color:C.muted, display:'flex' }}>{I.check}</span>
  if (s==='delivered') return <span style={{ color:C.muted, display:'flex' }}>{I.checks}</span>
  if (s==='read')      return <span style={{ color:C.info, display:'flex' }}>{I.checks}</span>
  return <span style={{ color:C.error, display:'flex' }}>{I.warning}</span>
}

function Toast({ msg, kind, onDone }: { msg:string; kind:'success'|'error'; onDone:()=>void }) {
  useEffect(() => { const t = setTimeout(onDone, 3200); return () => clearTimeout(t) }, [onDone])
  const color = kind === 'error' ? C.error : C.success
  return (
    <div style={{ position:'fixed', bottom:20, left:'50%', transform:'translateX(-50%)', zIndex:300, background:C.surface, border:`1.5px solid ${color}40`, borderRadius:12, padding:'10px 16px', boxShadow:'0 8px 24px rgba(0,0,0,0.15)', display:'flex', alignItems:'center', gap:8 }}>
      <span style={{ color, display:'flex' }}>{kind==='error'?I.warning:I.check}</span>
      <p style={{ fontSize:13, fontWeight:600, color:C.type, fontFamily:'Manrope,sans-serif' }}>{msg}</p>
    </div>
  )
}

// ─── Types (mirroring real Supabase enums) ────────────────────────────────────
type MessageType = 'text'|'image'|'document'|'voice'|'location'|'task_update'|'system'|'checklist'
type MessageStatus = 'sending'|'sent'|'delivered'|'read'|'failed'

interface SenderProfile {
  id:string; full_name?:string|null; preferred_name?:string|null; avatar_url?:string|null
}

interface Message {
  id:string; conversation_id:string; sender_id:string; type:MessageType
  text:string|null; attachment:any; status:MessageStatus
  starred:boolean; pinned:boolean; edited:boolean; deleted:boolean
  created_at:string; sender?:SenderProfile|null
}

interface OtherParticipant {
  id:string; full_name?:string|null; preferred_name?:string|null; avatar_url?:string|null; phone?:string|null; role?:string|null
}

interface BookingContext {
  id:string; status:string; scheduled_date?:string|null; scheduled_time?:string|null
  duration?:string|number|null; location?:string|null; priority?:string|null
  care_request?: { title?:string|null; service_type?:string|null } | null
  beneficiary?: { name?:string|null; preferred_name?:string|null } | null
}

interface Conversation {
  id:string; booking_id:string|null; name:string|null
  type:'direct'|'group'|'support'; category:'care'|'task'|'completed'|'support'
  is_emergency:boolean; created_at:string
  pinned:boolean; muted:boolean
  otherParticipants: OtherParticipant[]
  lastMessage: { id:string; sender_id:string; type:MessageType; text:string|null; deleted:boolean; created_at:string } | null
  booking?: BookingContext | null
}

function displayName(conv: Conversation): string {
  if (conv.name) return conv.name
  if (conv.type === 'group') return conv.otherParticipants.map(p => p.preferred_name || p.full_name || 'Member').join(', ') || 'Group'
  const other = conv.otherParticipants[0]
  return other?.preferred_name || other?.full_name || 'Conversation'
}

function formatTime(iso:string|null|undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  const now = new Date()
  const sameDay = d.toDateString() === now.toDateString()
  if (sameDay) return d.toLocaleTimeString([], { hour:'numeric', minute:'2-digit' })
  const yesterday = new Date(now); yesterday.setDate(now.getDate()-1)
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString([], { month:'short', day:'numeric' })
}

function lastMessagePreview(conv: Conversation): string {
  const m = conv.lastMessage
  if (!m) return 'No messages yet'
  if (m.deleted) return 'Message deleted'
  if (m.type === 'text') return m.text ?? ''
  if (m.type === 'image') return 'Photo'
  if (m.type === 'document') return 'Document'
  if (m.type === 'voice') return 'Voice message'
  if (m.type === 'location') return 'Location'
  if (m.type === 'system') return 'System update'
  if (m.type === 'task_update') return 'Task update'
  if (m.type === 'checklist') return 'Checklist update'
  return ''
}

// ─── Chat window ──────────────────────────────────────────────────────────────
function ChatWindow({
  conv, currentUserId, onBack, showPanel, onTogglePanel, onConversationUpdate, onToast,
}: {
  conv:Conversation; currentUserId:string; onBack:()=>void; showPanel:boolean
  onTogglePanel:()=>void; onConversationUpdate:()=>void
  onToast:(msg:string, kind?:'success'|'error')=>void
}) {
  const [text, setText] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string|null>(null)
  const [sending, setSending] = useState(false)
  const [ctxMenu, setCtxMenu] = useState<{id:string;x:number;y:number}|null>(null)
  const [editingId, setEditingId] = useState<string|null>(null)
  const [editText, setEditText] = useState('')
  const [searchMsg, setSearchMsg] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  const name = displayName(conv)
  const other = conv.otherParticipants[0]

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setLoadError(null)
    getConversationMessages(conv.id)
      .then(data => { if (!cancelled) setMessages(data as unknown as Message[]) })
      .catch(err => { if (!cancelled) setLoadError(err instanceof Error ? err.message : 'Failed to load messages') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [conv.id])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages])

  const sendMsg = async () => {
    const trimmed = text.trim()
    if (!trimmed || sending) return
    setSending(true)
    try {
      const created = await sendMessage(conv.id, trimmed)
      setMessages(p => [...p, created as unknown as Message])
      setText('')
      onConversationUpdate()
    } catch (err) {
      onToast(err instanceof Error ? err.message : 'Failed to send message', 'error')
    } finally {
      setSending(false)
    }
  }

  const startEdit = (m:Message) => { setEditingId(m.id); setEditText(m.text ?? ''); setCtxMenu(null) }

  const submitEdit = async () => {
    if (!editingId) return
    const trimmed = editText.trim()
    if (!trimmed) { setEditingId(null); return }
    try {
      const updated = await editMessage(editingId, trimmed)
      setMessages(p => p.map(m => m.id === editingId ? (updated as unknown as Message) : m))
      setEditingId(null)
    } catch (err) {
      onToast(err instanceof Error ? err.message : 'Failed to edit message', 'error')
    }
  }

  const removeMsg = async (id:string) => {
    setCtxMenu(null)
    try {
      const updated = await deleteMessage(id)
      setMessages(p => p.map(m => m.id === id ? (updated as unknown as Message) : m))
      onConversationUpdate()
    } catch (err) {
      onToast(err instanceof Error ? err.message : 'Failed to delete message', 'error')
    }
  }

  const starMsg = async (m:Message) => {
    setCtxMenu(null)
    try {
      const updated = await toggleMessageStar(m.id, !m.starred)
      setMessages(p => p.map(x => x.id === m.id ? (updated as unknown as Message) : x))
    } catch (err) {
      onToast(err instanceof Error ? err.message : 'Failed to update message', 'error')
    }
  }

  const pinMsg = async (m:Message) => {
    setCtxMenu(null)
    try {
      const updated = await toggleMessagePin(m.id, !m.pinned)
      setMessages(p => p.map(x => x.id === m.id ? (updated as unknown as Message) : x))
    } catch (err) {
      onToast(err instanceof Error ? err.message : 'Failed to update message', 'error')
    }
  }

  const filtered = searchMsg ? messages.filter(m => (m.text ?? '').toLowerCase().includes(searchMsg.toLowerCase())) : messages

  const renderBubble = (m:Message) => {
    const isMe = m.sender_id === currentUserId
    const senderName = m.sender?.preferred_name || m.sender?.full_name || name

    if (m.type === 'system' || m.type === 'task_update') {
      return (
        <div key={m.id} style={{ display:'flex', justifyContent:'center', marginBottom:10 }}>
          <div style={{ display:'flex', gap:8, alignItems:'center', padding:'8px 14px', borderRadius:12, background:`${C.primary}08`, border:`1px solid ${C.primary}18`, maxWidth:380 }}>
            <span style={{ color:C.primary, display:'flex' }}>{I.task}</span>
            <p style={{ fontSize:12, fontWeight:700, color:C.primary }}>{m.text ?? (m.type === 'task_update' ? 'Task updated' : 'System update')}</p>
          </div>
        </div>
      )
    }

    if (editingId === m.id) {
      return (
        <div key={m.id} style={{ display:'flex', justifyContent:'flex-end', marginBottom:6 }}>
          <div style={{ maxWidth:'72%', display:'flex', flexDirection:'column', gap:6 }}>
            <textarea value={editText} onChange={e=>setEditText(e.target.value)} rows={2}
              style={{ padding:'8px 12px', borderRadius:12, border:`1.5px solid ${C.primary}`, fontFamily:'Manrope,sans-serif', fontSize:13, resize:'none', outline:'none' }} />
            <div style={{ display:'flex', gap:6, justifyContent:'flex-end' }}>
              <button onClick={()=>setEditingId(null)} style={{ padding:'5px 12px', borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', fontSize:12, fontWeight:600, color:C.sub }}>Cancel</button>
              <button onClick={submitEdit} style={{ padding:'5px 12px', borderRadius:8, border:'none', background:C.primary, cursor:'pointer', fontSize:12, fontWeight:700, color:'#fff' }}>Save</button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div key={m.id} style={{ display:'flex', justifyContent:isMe?'flex-end':'flex-start', marginBottom:6, paddingRight:isMe?0:8, paddingLeft:isMe?8:0 }}>
        {!isMe && <div style={{ marginRight:7, marginTop:'auto', flexShrink:0 }}><Avatar name={senderName} size={28} /></div>}
        <div style={{ maxWidth:'72%', position:'relative' }}
          onContextMenu={e=>{ if (!isMe || m.deleted) return; e.preventDefault(); setCtxMenu({id:m.id, x:e.clientX, y:e.clientY}) }}
        >
          {m.pinned && <div style={{ display:'flex', alignItems:'center', gap:3, marginBottom:2, color:C.warning }}><span style={{ display:'flex', transform:'scale(0.8)' }}>{I.pin}</span><p style={{ fontSize:10, fontWeight:700 }}>Pinned</p></div>}
          {m.starred && <div style={{ position:'absolute', top:4, right:4, zIndex:1 }}><span style={{ display:'flex' }}>{I.starFill}</span></div>}

          {m.deleted ? (
            <div style={{ padding:'8px 14px', borderRadius:16, background:'#F2F4F5', fontStyle:'italic', color:C.muted, fontSize:12 }}>Message deleted</div>
          ) : m.type==='text' ? (
            <div onContextMenu={e=>{ if (!isMe) return; e.preventDefault(); setCtxMenu({id:m.id, x:e.clientX, y:e.clientY}) }}
              style={{ padding:'10px 14px', borderRadius:isMe?'16px 4px 16px 16px':'4px 16px 16px 16px', background:isMe?`linear-gradient(135deg,${C.primary},#00959E)`:C.surface, color:isMe?'#fff':C.type, fontSize:13, lineHeight:1.6, boxShadow:'0 1px 4px rgba(44,62,67,0.10)', border:isMe?'none':`1px solid ${C.border}` }}>
              {m.text}
              {m.edited && <span style={{ fontSize:10, opacity:0.6, marginLeft:6 }}>edited</span>}
            </div>
          ) : (
            <div style={{ padding:'10px 14px', borderRadius:14, background:C.surface, border:`1px solid ${C.border}`, display:'flex', gap:8, alignItems:'center', color:C.muted, fontSize:12, fontStyle:'italic' }}>
              <span style={{ display:'flex' }}>{m.type==='image'?I.image:m.type==='document'?I.doc:m.type==='location'?I.location:I.mic}</span>
              {m.type === 'checklist' && m.text ? m.text : `${m.type.charAt(0).toUpperCase()+m.type.slice(1)} messages aren't supported yet`}
            </div>
          )}

          <div style={{ display:'flex', justifyContent:isMe?'flex-end':'flex-start', alignItems:'center', gap:4, marginTop:2, paddingLeft:2, paddingRight:2 }}>
            <p style={{ fontSize:10, color:C.muted }}>{formatTime(m.created_at)}</p>
            {isMe && <MsgStatus s={m.status} />}
          </div>
        </div>
      </div>
    )
  }

  const ctxMessage = ctxMenu ? messages.find(m => m.id === ctxMenu.id) : null

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', height:'100%', overflow:'hidden' }}>
      {/* Header */}
      <div style={{ padding:'12px 18px', background:C.surface, borderBottom:`1px solid ${C.border}`, display:'flex', gap:12, alignItems:'center', flexShrink:0 }}>
        <button onClick={onBack} className="msg-back-btn" style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, display:'flex', padding:4 }}>{I.chevL}</button>
        {conv.type==='group' ? <GroupAvatar names={conv.otherParticipants.map(p=>p.preferred_name||p.full_name||'')} /> : <Avatar name={name} size={40} />}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{name}</p>
            {conv.is_emergency && <Bdg label="Emergency" color={C.error} dot />}
            {conv.pinned && <span style={{ color:C.warning, display:'flex' }}>{I.pin}</span>}
          </div>
          <p style={{ fontSize:11, color:C.muted, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {other?.role ? other.role.charAt(0).toUpperCase()+other.role.slice(1) : conv.type==='support' ? 'Support' : conv.type==='group' ? `Group · ${conv.otherParticipants.length+1} members` : ''}
          </p>
        </div>
        <div style={{ display:'flex', gap:4 }}>
          {showSearch
            ? <input autoFocus value={searchMsg} onChange={e=>setSearchMsg(e.target.value)} placeholder="Search messages…"
                style={{ padding:'6px 10px', borderRadius:9, border:`1.5px solid ${C.primary}`, fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, outline:'none', width:180 }}
                onBlur={()=>{ if(!searchMsg) setShowSearch(false) }} />
            : <button onClick={()=>setShowSearch(true)} style={{ width:32, height:32, borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.sub }}>{I.search}</button>
          }
          {other?.phone
            ? <a href={`tel:${other.phone}`} title="Call" style={{ width:32, height:32, borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.sub, textDecoration:'none' }}>{I.phone}</a>
            : null}
          <button onClick={onTogglePanel} style={{ width:32, height:32, borderRadius:9, border:`1px solid ${showPanel?C.primary:C.border}`, background:showPanel?`${C.primary}08`:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:showPanel?C.primary:C.sub }}>{I.info}</button>
        </div>
      </div>

      {/* Task context bar */}
      {conv.booking && (
        <div style={{ padding:'7px 18px', background:`${C.primary}06`, borderBottom:`1px solid ${C.primary}14`, display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
          <span style={{ color:C.primary, display:'flex' }}>{I.task}</span>
          <p style={{ fontSize:11, fontWeight:700, color:C.primary, flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {conv.booking.care_request?.title ?? 'Care Task'}
          </p>
          <Bdg label={conv.booking.status} color={C.primary} />
        </div>
      )}

      {/* Messages area */}
      <div style={{ flex:1, overflowY:'auto', padding:'16px 12px', display:'flex', flexDirection:'column', background:'#F8FAFA' }} onClick={()=>setCtxMenu(null)}>
        {loading ? (
          <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}><p style={{ fontSize:13, color:C.muted }}>Loading messages…</p></div>
        ) : loadError ? (
          <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8 }}>
            <p style={{ fontSize:13, color:C.error }}>{loadError}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <p style={{ fontSize:13, color:C.muted }}>{searchMsg ? 'No messages match your search.' : 'No messages yet. Say hello!'}</p>
          </div>
        ) : (
          filtered.map(renderBubble)
        )}
        <div ref={endRef} />
      </div>

      {/* Composer */}
      <div style={{ padding:'10px 12px', background:C.surface, borderTop:`1px solid ${C.border}`, flexShrink:0 }}>
        <div style={{ display:'flex', gap:8, alignItems:'flex-end' }}>
          <div style={{ display:'flex', gap:4 }}>
            <button disabled title="Attachments aren't available yet" style={{ width:34, height:34, borderRadius:10, border:`1px solid ${C.border}`, background:'transparent', cursor:'not-allowed', display:'flex', alignItems:'center', justifyContent:'center', color:C.muted, opacity:0.5 }}>{I.attach}</button>
            <button disabled title="Camera isn't available yet" style={{ width:34, height:34, borderRadius:10, border:`1px solid ${C.border}`, background:'transparent', cursor:'not-allowed', display:'flex', alignItems:'center', justifyContent:'center', color:C.muted, opacity:0.5 }}>{I.camera}</button>
          </div>
          <div style={{ flex:1, display:'flex', flexDirection:'column', borderRadius:14, border:`1.5px solid ${text.length?C.primary:C.border}`, background:'#FAFAFA', overflow:'hidden', transition:'border-color 0.15s' }}>
            <textarea value={text} onChange={e=>setText(e.target.value)}
              onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); sendMsg() } }}
              placeholder="Type a message…" rows={1}
              style={{ padding:'9px 12px', border:'none', background:'transparent', fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, resize:'none', outline:'none', maxHeight:100 }} />
            <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', padding:'4px 8px' }}>
              {text.length>0 && <p style={{ fontSize:10, color:C.muted }}>{text.length}/500</p>}
            </div>
          </div>
          {text.trim() ? (
            <button onClick={sendMsg} disabled={sending} style={{ width:40, height:40, borderRadius:12, border:'none', background:`linear-gradient(135deg,${C.primary},#00959E)`, cursor:sending?'default':'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', boxShadow:`0 4px 14px ${C.primary}40`, opacity:sending?0.7:1 }}>{I.send}</button>
          ) : (
            <button disabled title="Voice messages aren't available yet" style={{ width:40, height:40, borderRadius:12, border:`1.5px solid ${C.border}`, background:'transparent', cursor:'not-allowed', display:'flex', alignItems:'center', justifyContent:'center', color:C.muted, opacity:0.5 }}>{I.mic}</button>
          )}
        </div>
      </div>

      {/* Context menu */}
      {ctxMenu && ctxMessage && (
        <div style={{ position:'fixed', left:ctxMenu.x, top:ctxMenu.y, zIndex:100, background:C.surface, borderRadius:12, boxShadow:'0 8px 28px rgba(44,62,67,0.16)', border:`1px solid ${C.border}`, overflow:'hidden', minWidth:160 }}>
          {[
            { icon:ctxMessage.starred?I.starFill:I.star, label:ctxMessage.starred?'Unstar':'Star', action:()=>starMsg(ctxMessage) },
            { icon:I.pin, label:ctxMessage.pinned?'Unpin':'Pin Message', action:()=>pinMsg(ctxMessage) },
            ...(ctxMessage.type==='text' ? [{ icon:I.edit, label:'Edit', action:()=>startEdit(ctxMessage) }] : []),
            { icon:I.trash, label:'Delete', action:()=>removeMsg(ctxMessage.id) },
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
function Inbox({ conversations, activeId, onSelect, onTogglePin, onToggleMute, onNewConversation, onBack }: {
  conversations:Conversation[]; activeId:string|null; onSelect:(id:string)=>void
  onTogglePin:(c:Conversation)=>void; onToggleMute:(c:Conversation)=>void
  onNewConversation:()=>void; onBack:()=>void
}) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'All'|'Pinned'>('All')
  const [tab, setTab] = useState<'all'|'care'|'task'|'completed'|'support'>('all')
  const cats: Array<{label:string; key:typeof tab}> = [
    { label:'All', key:'all' }, { label:'Care', key:'care' }, { label:'Tasks', key:'task' },
    { label:'Completed', key:'completed' }, { label:'Support', key:'support' },
  ]

  const filteredConvs = conversations.filter(c=>{
    const name = displayName(c).toLowerCase()
    const preview = lastMessagePreview(c).toLowerCase()
    const matchSearch = !search || name.includes(search.toLowerCase()) || preview.includes(search.toLowerCase())
    const matchTab = tab==='all' || c.category===tab
    const matchFilter = filter==='All' || (filter==='Pinned' && c.pinned)
    return matchSearch && matchTab && matchFilter
  })

  const pinned = filteredConvs.filter(c=>c.pinned)
  const rest   = filteredConvs.filter(c=>!c.pinned)

  const renderCard = (c:Conversation) => {
    const name = displayName(c)
    return (
      <div key={c.id} style={{ position:'relative' }}
        onContextMenu={e=>{ e.preventDefault() }}>
        <button onClick={()=>onSelect(c.id)}
          style={{ width:'100%', padding:'12px 14px', border:'none', background:activeId===c.id?`${C.primary}08`:'transparent', cursor:'pointer', textAlign:'left' as const, borderLeft: activeId===c.id?`3px solid ${C.primary}`:'3px solid transparent', transition:'all 0.15s' }}
          onMouseOver={e=>{ if(activeId!==c.id)(e.currentTarget as HTMLButtonElement).style.background='#F2F4F5' }}
          onMouseOut={e=>{ if(activeId!==c.id)(e.currentTarget as HTMLButtonElement).style.background='transparent' }}>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            {c.type==='group' ? <GroupAvatar names={c.otherParticipants.map(p=>p.preferred_name||p.full_name||'')} /> : <Avatar name={name} size={44} />}
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:2 }}>
                <div style={{ display:'flex', gap:5, alignItems:'center', minWidth:0 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type, fontFamily:'Manrope,sans-serif', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{name}</p>
                  {c.is_emergency && <span style={{ color:C.error, display:'flex', flexShrink:0 }}>{I.sos}</span>}
                  {c.pinned && <span style={{ color:C.warning, display:'flex', transform:'scale(0.8)', flexShrink:0 }}>{I.pin}</span>}
                  {c.muted && <span style={{ color:C.muted, display:'flex', transform:'scale(0.8)', flexShrink:0 }}>{I.mute}</span>}
                </div>
                <p style={{ fontSize:10, color:C.muted, flexShrink:0 }}>{formatTime(c.lastMessage?.created_at ?? c.created_at)}</p>
              </div>
              <p style={{ fontSize:12, color:C.muted, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{lastMessagePreview(c)}</p>
            </div>
          </div>
        </button>
        <div style={{ position:'absolute', top:10, right:10, display:'flex', gap:2, background:C.surface, borderRadius:6 }}>
          <button onClick={(e)=>{ e.stopPropagation(); onTogglePin(c) }} title={c.pinned?'Unpin':'Pin'} style={{ width:20, height:20, borderRadius:6, border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:c.pinned?C.warning:C.muted }}>{I.pin}</button>
          <button onClick={(e)=>{ e.stopPropagation(); onToggleMute(c) }} title={c.muted?'Unmute':'Mute'} style={{ width:20, height:20, borderRadius:6, border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:c.muted?C.primary:C.muted }}>{I.mute}</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ width:300, flexShrink:0, borderRight:`1px solid ${C.border}`, background:C.surface, display:'flex', flexDirection:'column', height:'100%', overflow:'hidden' }}>
      {/* Header */}
      <div style={{ padding:'16px 14px 10px', borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <button onClick={onBack} title="Back" style={{ width:26, height:26, borderRadius:8, border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.sub }}>{I.chevL}</button>
            <h2 style={{ fontSize:17, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Messages</h2>
          </div>
          <button onClick={onNewConversation} title="Start a conversation from a booking" style={{ width:30, height:30, borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.sub }}>{I.plus}</button>
        </div>
        {/* Search */}
        <div style={{ position:'relative' }}>
          <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:C.muted, display:'flex' }}>{I.search}</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search conversations…"
            style={{ width:'100%', padding:'8px 10px 8px 30px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, outline:'none', background:'#F8FAFA', boxSizing:'border-box' as const }} />
        </div>
        {/* Filters */}
        <div style={{ display:'flex', gap:5, marginTop:8 }}>
          {(['All','Pinned'] as const).map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{ padding:'4px 10px', borderRadius:999, border:`1px solid ${filter===f?C.primary:C.border}`, background:filter===f?`${C.primary}10`:'transparent', cursor:'pointer', fontSize:11, fontWeight:700, color:filter===f?C.primary:C.sub, fontFamily:'Manrope,sans-serif' }}>{f}</button>
          ))}
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ display:'flex', borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        {cats.map(ct=>(
          <button key={ct.key} onClick={()=>setTab(ct.key)} style={{ flex:1, padding:'8px 2px', border:'none', background:'transparent', cursor:'pointer', fontSize:11, fontWeight:tab===ct.key?800:500, color:tab===ct.key?C.primary:C.muted, borderBottom:tab===ct.key?`2px solid ${C.primary}`:'2px solid transparent', fontFamily:'Manrope,sans-serif', whiteSpace:'nowrap' }}>{ct.label}</button>
        ))}
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
        {!filteredConvs.length && (
          <div style={{ padding:'40px 20px', textAlign:'center' }}>
            <p style={{ fontSize:13, color:C.muted }}>{conversations.length ? 'No conversations found.' : 'No conversations yet.'}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Task context panel ────────────────────────────────────────────────────────
function TaskPanel({ conv, onTogglePin, onToggleMute }: {
  conv:Conversation; onTogglePin:()=>void; onToggleMute:()=>void
}) {
  const navigate = useNavigate()
  const name = displayName(conv)
  const other = conv.otherParticipants[0]
  const booking = conv.booking

  return (
    <div style={{ width:260, flexShrink:0, borderLeft:`1px solid ${C.border}`, background:'#FAFAFA', display:'flex', flexDirection:'column', height:'100%', overflow:'hidden' }}>
      <div style={{ padding:'14px 16px', borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        <p style={{ fontSize:12, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.06em' }}>Conversation Info</p>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'14px 16px', display:'flex', flexDirection:'column', gap:14 }}>
        {/* Participant */}
        {other && (
          <div>
            <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:8 }}>{conv.type==='support'?'SUPPORT':'CONTACT'}</p>
            <div style={{ display:'flex', gap:9, alignItems:'center' }}>
              <Avatar name={other.preferred_name||other.full_name||name} size={38} />
              <div>
                <p style={{ fontSize:13, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{other.preferred_name||other.full_name}</p>
                {other.role && <p style={{ fontSize:11, color:C.muted, textTransform:'capitalize' }}>{other.role}</p>}
              </div>
            </div>
          </div>
        )}
        {/* Task */}
        {booking && (
          <div style={{ padding:'12px 13px', borderRadius:12, background:`${C.primary}07`, border:`1px solid ${C.primary}16` }}>
            <div style={{ display:'flex', gap:6, alignItems:'flex-start', marginBottom:6 }}>
              <span style={{ color:C.primary, display:'flex', marginTop:1 }}>{I.task}</span>
              <p style={{ fontSize:12, fontWeight:700, color:C.type, lineHeight:1.4 }}>{booking.care_request?.title ?? 'Care Task'}</p>
            </div>
            {booking.care_request?.service_type && <Bdg label={booking.care_request.service_type} color={C.primary} />}
            <div style={{ marginTop:8, display:'flex', flexDirection:'column', gap:4 }}>
              {booking.beneficiary && (
                <p style={{ fontSize:11, color:C.sub }}>For: {booking.beneficiary.preferred_name || booking.beneficiary.name}</p>
              )}
              {booking.scheduled_date && (
                <p style={{ fontSize:11, color:C.sub }}>Scheduled: {booking.scheduled_date}{booking.scheduled_time ? ` · ${booking.scheduled_time}` : ''}</p>
              )}
              {booking.location && (
                <p style={{ fontSize:11, color:C.sub }}>Location: {booking.location}</p>
              )}
            </div>
          </div>
        )}
        {/* Status */}
        {booking && (
          <div>
            <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:8 }}>STATUS</p>
            <Bdg label={booking.status.charAt(0).toUpperCase()+booking.status.slice(1)} color={C.primary} />
          </div>
        )}
        {/* Quick actions */}
        <div>
          <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:8 }}>QUICK ACTIONS</p>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {booking && (
              <button onClick={()=>navigate('/agent/careexecution')} style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 10px', borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:600, color:C.type, textAlign:'left' as const }}>
                <span style={{ color:C.primary, display:'flex' }}>{I.task}</span>Open Task in Care Execution
              </button>
            )}
            {other?.phone && (
              <a href={`tel:${other.phone}`} style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 10px', borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:600, color:C.type, textAlign:'left' as const, textDecoration:'none' }}>
                <span style={{ color:C.primary, display:'flex' }}>{I.phone}</span>Call {other.preferred_name||other.full_name}
              </a>
            )}
            <button onClick={onTogglePin} style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 10px', borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:600, color:C.type, textAlign:'left' as const }}>
              <span style={{ color:C.primary, display:'flex' }}>{I.pin}</span>{conv.pinned ? 'Unpin Conversation' : 'Pin Conversation'}
            </button>
            <button onClick={onToggleMute} style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 10px', borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:600, color:C.type, textAlign:'left' as const }}>
              <span style={{ color:C.primary, display:'flex' }}>{I.mute}</span>{conv.muted ? 'Unmute Conversation' : 'Mute Conversation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Empty states ───────────────────────────────────────────────────────────────
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

function NoConversationsState({ onNewConversation, onBack }: { onNewConversation:()=>void; onBack:()=>void }) {
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:14, background:'#F8FAFA', position:'relative' as const }}>
      <button onClick={onBack} style={{ position:'absolute' as const, top:18, left:18, display:'flex', gap:6, alignItems:'center', background:'none', border:'none', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:700, color:C.sub }}>{I.chevL} Back</button>
      <div style={{ width:80, height:80, borderRadius:'50%', background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M4 6h28a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H10l-8 6V8a2 2 0 0 1 2-2z" stroke={C.primary} strokeWidth="1.5" strokeLinejoin="round"/><path d="M12 14h12M12 19h8" stroke={C.primary} strokeWidth="1.4" strokeLinecap="round"/></svg>
      </div>
      <div style={{ textAlign:'center' }}>
        <p style={{ fontSize:16, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>No conversations yet</p>
        <p style={{ fontSize:13, color:C.muted, maxWidth:280, marginBottom:14 }}>Start a conversation with your client from one of your confirmed bookings.</p>
        <button onClick={onNewConversation} style={{ padding:'9px 18px', borderRadius:10, border:'none', background:C.primary, cursor:'pointer', fontSize:13, fontWeight:700, color:'#fff', fontFamily:'Manrope,sans-serif' }}>New Conversation</button>
      </div>
    </div>
  )
}

// ─── New conversation modal (booking-scoped, no random-user picker) ──────────
function NewConversationModal({ onClose, onCreated, onToast }: {
  onClose:()=>void; onCreated:(conversationId:string)=>void; onToast:(msg:string, kind?:'success'|'error')=>void
}) {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string|null>(null)
  const [creatingId, setCreatingId] = useState<string|null>(null)

  useEffect(() => {
    let cancelled = false
    getMyBookings()
      .then(data => {
        if (cancelled) return
        const eligible = (data as any[]).filter(b => b.status === 'confirmed' || b.status === 'in_progress' || b.status === 'completed')
        setBookings(eligible)
      })
      .catch(err => { if (!cancelled) setLoadError(err instanceof Error ? err.message : 'Failed to load bookings') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const startConversation = async (bookingId:string) => {
    setCreatingId(bookingId)
    try {
      const conversationId = await getOrCreateBookingConversation(bookingId)
      onCreated(conversationId)
    } catch (err) {
      onToast(err instanceof Error ? err.message : 'Failed to start conversation', 'error')
    } finally {
      setCreatingId(null)
    }
  }

  return (
    <div style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.3)', backdropFilter:'blur(4px)' }} />
      <div style={{ position:'relative', zIndex:1, background:C.surface, borderRadius:20, padding:24, maxWidth:420, width:'100%', maxHeight:'70vh', display:'flex', flexDirection:'column', boxShadow:'0 20px 60px rgba(0,0,0,0.15)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexShrink:0 }}>
          <h3 style={{ fontSize:16, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>New Conversation</h3>
          <button onClick={onClose} style={{ width:30, height:30, borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.muted }}>{I.close}</button>
        </div>
        <p style={{ fontSize:12, color:C.muted, marginBottom:12, flexShrink:0 }}>Pick a booking to message its client about.</p>
        <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:8 }}>
          {loading ? (
            <p style={{ fontSize:13, color:C.muted }}>Loading your bookings…</p>
          ) : loadError ? (
            <p style={{ fontSize:13, color:C.error }}>{loadError}</p>
          ) : bookings.length === 0 ? (
            <p style={{ fontSize:13, color:C.muted }}>No eligible bookings found. You need a confirmed, in-progress, or completed booking to start a conversation.</p>
          ) : bookings.map(b => (
            <button key={b.id} onClick={()=>startConversation(b.id)} disabled={creatingId===b.id}
              style={{ display:'flex', flexDirection:'column', gap:2, padding:'10px 12px', borderRadius:10, border:`1px solid ${C.border}`, background:'transparent', cursor:creatingId===b.id?'default':'pointer', textAlign:'left' as const, opacity:creatingId===b.id?0.6:1 }}>
              <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{b.care_request?.title ?? 'Care Task'}</p>
              <p style={{ fontSize:11, color:C.muted }}>{b.scheduled_date} · {b.status}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function MessagingHub() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string|null>(null)
  const [activeId, setActiveId] = useState<string|null>(null)
  const [showPanel, setShowPanel] = useState(true)
  const [showNewConv, setShowNewConv] = useState(false)
  const [mobileView, setMobileView] = useState<'inbox'|'chat'>('inbox')
  const [currentUserId, setCurrentUserId] = useState<string|null>(null)
  const [toast, setToast] = useState<{msg:string; kind:'success'|'error'}|null>(null)
  const appliedDeepLink = useRef(false)

  const showToast = (msg:string, kind:'success'|'error'='success') => setToast({ msg, kind })

  const loadConversations = async () => {
    try {
      const data = await getMyConversations()
      setConversations(data as unknown as Conversation[])
      setLoadError(null)
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load conversations')
    }
  }

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    ;(async () => {
      const user = await getCurrentUser()
      if (cancelled) return
      setCurrentUserId(user?.id ?? null)
      await loadConversations()
      if (!cancelled) setLoading(false)
    })()
    return () => { cancelled = true }
  }, [])

  // Auto-open the conversation named by ?conversationId=… (e.g. from the
  // "Send Message" action on the negotiation screen). Only applied once, so
  // it doesn't fight with the user picking a different conversation later.
  useEffect(() => {
    if (appliedDeepLink.current) return
    const conversationId = searchParams.get('conversationId')
    if (!conversationId || conversations.length === 0) return
    appliedDeepLink.current = true
    if (conversations.some(c => c.id === conversationId)) {
      setActiveId(conversationId)
      setMobileView('chat')
    } else {
      showToast("Couldn't find that conversation", 'error')
    }
  }, [conversations, searchParams])

  const activeConv = conversations.find(c=>c.id===activeId) ?? null

  const handleSelect = (id:string) => { setActiveId(id); setMobileView('chat') }
  const handleBack   = () => setMobileView('inbox')

  const togglePin = async (c:Conversation) => {
    try {
      await updateConversationPreferences(c.id, { pinned: !c.pinned })
      setConversations(p => p.map(x => x.id === c.id ? { ...x, pinned: !c.pinned } : x))
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to update conversation', 'error')
    }
  }

  const toggleMute = async (c:Conversation) => {
    try {
      await updateConversationPreferences(c.id, { muted: !c.muted })
      setConversations(p => p.map(x => x.id === c.id ? { ...x, muted: !c.muted } : x))
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to update conversation', 'error')
    }
  }

  const handleConversationCreated = async (conversationId:string) => {
    setShowNewConv(false)
    await loadConversations()
    setActiveId(conversationId)
    setMobileView('chat')
    showToast('Conversation started')
  }

  const renderMain = () => {
    if (loading) {
      return (
        <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <p style={{ fontSize:13, color:C.muted }}>Loading conversations…</p>
        </div>
      )
    }
    if (loadError) {
      return (
        <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10 }}>
          <p style={{ fontSize:13, color:C.error }}>{loadError}</p>
          <button onClick={()=>{ setLoading(true); loadConversations().finally(()=>setLoading(false)) }} style={{ padding:'8px 16px', borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', fontSize:12, fontWeight:700, color:C.primary }}>Retry</button>
        </div>
      )
    }
    if (conversations.length === 0) {
      return <NoConversationsState onNewConversation={()=>setShowNewConv(true)} onBack={()=>navigate(-1)} />
    }
    return (
      <>
        <div className={`msg-inbox${mobileView==='chat'?' msg-hide':''}`} style={{ display:'flex' }}>
          <Inbox conversations={conversations} activeId={activeId} onSelect={handleSelect}
            onTogglePin={togglePin} onToggleMute={toggleMute} onNewConversation={()=>setShowNewConv(true)} onBack={()=>navigate(-1)} />
        </div>
        <div className={`msg-chat${mobileView==='inbox'?' msg-hide':''}`} style={{ flex:1, display:'flex', overflow:'hidden', minWidth:0 }}>
          {activeConv && currentUserId
            ? <ChatWindow conv={activeConv} currentUserId={currentUserId} onBack={handleBack}
                showPanel={showPanel} onTogglePanel={()=>setShowPanel(v=>!v)}
                onConversationUpdate={loadConversations} onToast={showToast} />
            : <EmptyState />
          }
          {activeConv && showPanel && (
            <div className="msg-panel">
              <TaskPanel conv={activeConv} onTogglePin={()=>togglePin(activeConv)} onToggleMute={()=>toggleMute(activeConv)} />
            </div>
          )}
        </div>
      </>
    )
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', background:C.bg, fontFamily:'Manrope,sans-serif' }}>
      {/* Top bar */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'10px 20px', display:'flex', alignItems:'center', gap:12, flexShrink:0, zIndex:20 }}>
        <h1 style={{ fontSize:15, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', flex:1 }}>Messaging Hub</h1>
        <button disabled title="Notification settings aren't available yet" style={{ width:32, height:32, borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', cursor:'not-allowed', display:'flex', alignItems:'center', justifyContent:'center', color:C.muted, opacity:0.5 }}>{I.bell}</button>
      </div>

      {/* Main layout */}
      <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
        {renderMain()}
      </div>

      {showNewConv && (
        <NewConversationModal onClose={()=>setShowNewConv(false)} onCreated={handleConversationCreated} onToast={showToast} />
      )}
      {toast && <Toast msg={toast.msg} kind={toast.kind} onDone={()=>setToast(null)} />}
    </div>
  )
}
