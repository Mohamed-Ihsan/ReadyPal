import { useState, type ReactNode, type CSSProperties } from 'react'

// ─── Brand ─────────────────────────────────────────────────────────────────────
const C = {
  primary:'#00737A', accent:'#EE8153', type:'#2C3E43', sub:'#6B7E85',
  muted:'#9AAAB0', border:'#E4E8EA', bg:'#F2F4F5', surface:'#FFFFFF',
  success:'#22C55E', warning:'#F59E0B', error:'#EF4444', info:'#3B82F6',
}

// ─── Icons ─────────────────────────────────────────────────────────────────────
const I: Record<string, ReactNode> = {
  card:     <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="3" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M1 6h12" stroke="currentColor" strokeWidth="1.3"/><path d="M4 9h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  wallet:   <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1.5 4.5A1.5 1.5 0 0 1 3 3h8a1.5 1.5 0 0 1 1.5 1.5v5A1.5 1.5 0 0 1 11 11H3A1.5 1.5 0 0 1 1.5 9.5V4.5z" stroke="currentColor" strokeWidth="1.3"/><circle cx="10" cy="7" r="1" fill="currentColor"/></svg>,
  invoice:  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8.5 1.5H3A1.5 1.5 0 0 0 1.5 3v8A1.5 1.5 0 0 0 3 12.5h8A1.5 1.5 0 0 0 12.5 11V5L8.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M8.5 1.5V5H12.5M4.5 7.5h5M4.5 9.5h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  receipt:  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 1.5v11l2-1.5 2 1.5 2-1.5 2 1.5 2-1.5V1.5L10 3 8 1.5 6 3 4 1.5 2 3V1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M4.5 6h5M4.5 8h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  download: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2v6M4 6l2.5 2.5L9 6M2 11h9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  check:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5l3 3 6-6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  close:    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  chevL:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3l-5 4 5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevR:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l5 4-5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  plus:     <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  shield:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1l4.5 1.6v3.5C11 9.5 9 11.5 6.5 12.5 4 11.5 2 9.5 2 6.1V2.6L6.5 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  tag:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 1.5h5.5l5 5-5.5 5.5-5-5V1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><circle cx="4" cy="4" r="1" fill="currentColor"/></svg>,
  refresh:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M11.5 6.5a5 5 0 1 1-1.1-3.1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M11.5 3v2.5H9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  warning:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2L1.5 11h10L6.5 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M6.5 6v2M6.5 10v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  trending: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1.5 10l4-4 3 3 5-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M9.5 3H13v3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  mail:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1.5" y="3" width="10" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 5l5 3.5L11.5 5" stroke="currentColor" strokeWidth="1.2"/></svg>,
  print:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="3" y="8.5" width="7" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M3 8.5V4h2V1.5h4V4h2v4.5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><circle cx="9.5" cy="6.5" r="0.8" fill="currentColor"/></svg>,
  share:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="10" cy="2.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="10" cy="10.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="3" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4.4 5.8l4.2-2.5M4.4 7.2l4.2 2.5" stroke="currentColor" strokeWidth="1.1"/></svg>,
  trash:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 3.5h9M5 3.5V2.5h3V3.5M3.5 3.5l.7 7.5h4.6l.7-7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  user:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 12c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  lock:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="2.5" y="6" width="8" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 6V4.5a2 2 0 0 1 4 0V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="6.5" cy="8.75" r="0.8" fill="currentColor"/></svg>,
  confetti: <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="8" cy="8" r="2.5" fill="#EE8153"/><circle cx="28" cy="6" r="2" fill="#00737A"/><circle cx="6" cy="24" r="1.8" fill="#F59E0B"/><circle cx="30" cy="26" r="2.5" fill="#3B82F6"/><rect x="15" y="3" width="3.5" height="3.5" rx="1" fill="#22C55E" transform="rotate(20 15 3)"/><rect x="22" y="22" width="3.5" height="3.5" rx="1" fill="#EE8153" transform="rotate(-15 22 22)"/><rect x="3" y="15" width="2.5" height="5" rx="1" fill="#8B5CF6" transform="rotate(30 3 15)"/><rect x="28" y="14" width="2.5" height="5" rx="1" fill="#F59E0B" transform="rotate(-25 28 14)"/></svg>,
  search:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.3"/><path d="M9 9l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  sort:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 4h9M3.5 7h6M5 10h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  apple:    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12.5 8.5c0-2 1.3-2.7 1.3-2.7S12.4 4 10.6 4c-1.1 0-1.7.6-2.6.6C6.9 4.6 6.2 4 5.2 4 3.3 4 1.5 5.7 1.5 8.5c0 2.8 2 6.5 3.5 6.5.8 0 1.2-.6 2.2-.6s1.4.6 2.2.6c1.5 0 3.1-3.2 3.1-6.5z" fill="currentColor"/><path d="M10 1.5c.5-1 1.5-1.5 1.5-1.5s.3 1.2-.5 2.2c-.8.9-1.7.9-1.7.9s-.2-1 .7-1.6z" fill="currentColor"/></svg>,
  google:   <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14.5 8.2c0-.5 0-1-.1-1.5H8v2.8h3.6c-.2.9-.7 1.6-1.4 2.1v1.7h2.3c1.3-1.2 2-3 2-5.1z" fill="#4285F4"/><path d="M8 15c1.8 0 3.3-.6 4.4-1.6l-2.3-1.7c-.6.4-1.3.7-2.1.7-1.6 0-3-1.1-3.5-2.6H2.2v1.8C3.3 13.7 5.5 15 8 15z" fill="#34A853"/><path d="M4.5 9.8c-.1-.4-.2-.8-.2-1.2s.1-.8.2-1.2V5.6H2.2C1.8 6.5 1.5 7.2 1.5 8s.3 1.5.7 2.4l2.3-1.6z" fill="#FBBC05"/><path d="M8 4.2c.9 0 1.7.3 2.3.9l1.7-1.7C10.9 2.3 9.6 1.7 8 1.7 5.5 1.7 3.3 3 2.2 5l2.3 1.8C5 5.3 6.4 4.2 8 4.2z" fill="#EA4335"/></svg>,
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

function Bdg({ label, color=C.primary, bg, dot=false }: { label:string; color?:string; bg?:string; dot?:boolean }) {
  return <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 9px', borderRadius:999, fontSize:11, fontWeight:700, background:bg??`${color}12`, color, whiteSpace:'nowrap' }}>{dot&&<span style={{ width:5,height:5,borderRadius:'50%',background:color,display:'inline-block' }} />}{label}</span>
}

const PAY_STATUS: Record<string,{color:string;bg:string}> = {
  Pending:    {color:C.warning, bg:`${C.warning}12`},
  Authorized: {color:C.info,    bg:`${C.info}12`},
  Paid:       {color:C.success, bg:`${C.success}10`},
  Refunded:   {color:C.accent,  bg:`${C.accent}12`},
  Cancelled:  {color:C.muted,   bg:`${C.muted}10`},
  Failed:     {color:C.error,   bg:`${C.error}10`},
  Processing: {color:C.primary, bg:`${C.primary}10`, },
}
function PayBdg({ s }: { s:string }) {
  const m = PAY_STATUS[s]??{color:C.muted,bg:'#F2F4F5'}
  return <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 10px', borderRadius:999, fontSize:11, fontWeight:800, background:m.bg, color:m.color }}><span style={{ width:5,height:5,borderRadius:'50%',background:m.color,display:'inline-block' }} />{s}</span>
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const TRANSACTIONS = [
  { id:'TXN-29841', ref:'INV-1047', date:'14 Jan 2025', agent:'Kasun Perera', beneficiary:'Nimal Perera', service:'Hospital Companion', amount:5250, fee:787, total:6037, method:'Visa •••• 4242', status:'Paid',       task:'RP-T-20259' },
  { id:'TXN-29820', ref:'INV-1043', date:'8 Jan 2025',  agent:'Chamari Dissanayake', beneficiary:'Amara Fernando', service:'Medication Collection', amount:3500, fee:525, total:4025, method:'Wallet', status:'Paid', task:'RP-T-20247' },
  { id:'TXN-29799', ref:'INV-1038', date:'2 Jan 2025',  agent:'Kasun Perera', beneficiary:'Nimal Perera', service:'Emergency Companion', amount:8000, fee:1200, total:9200, method:'Mastercard •••• 7766', status:'Refunded', task:'RP-T-20231' },
  { id:'TXN-29771', ref:'INV-1031', date:'28 Dec 2024', agent:'Nadeesha Silva', beneficiary:'Amara Fernando', service:'Home Wellness Visit', amount:5500, fee:825, total:6325, method:'Visa •••• 4242', status:'Paid', task:'RP-T-20218' },
  { id:'TXN-29750', ref:'INV-1025', date:'20 Dec 2024', agent:'Priya Senanayake', beneficiary:'Sunil Jayasinghe', service:'Physiotherapy Escort', amount:4200, fee:630, total:4830, method:'Wallet', status:'Cancelled', task:'RP-T-20199' },
  { id:'TXN-29720', ref:'INV-1018', date:'12 Dec 2024', agent:'Kasun Perera', beneficiary:'Nimal Perera', service:'Hospital Companion', amount:3500, fee:525, total:4025, method:'Visa •••• 4242', status:'Paid', task:'RP-T-20188' },
]

const INVOICES = [
  { num:'INV-1047', issued:'14 Jan 2025', due:'21 Jan 2025', amount:6037, beneficiary:'Nimal Perera', task:'Hospital Companion', status:'Paid' },
  { num:'INV-1043', issued:'8 Jan 2025',  due:'15 Jan 2025', amount:4025, beneficiary:'Amara Fernando', task:'Medication Collection', status:'Paid' },
  { num:'INV-1038', issued:'2 Jan 2025',  due:'9 Jan 2025',  amount:9200, beneficiary:'Nimal Perera', task:'Emergency Companion', status:'Refunded' },
  { num:'INV-1031', issued:'28 Dec 2024', due:'4 Jan 2025',  amount:6325, beneficiary:'Amara Fernando', task:'Home Wellness Visit', status:'Paid' },
  { num:'INV-1025', issued:'20 Dec 2024', due:'27 Dec 2024', amount:4830, beneficiary:'Sunil Jayasinghe', task:'Physiotherapy Escort', status:'Cancelled' },
]

const CARDS = [
  { id:'cd1', brand:'Visa',       last4:'4242', expiry:'08/27', holder:'Mohamed Ihsan', isDefault:true,  color:'#1A1F71' },
  { id:'cd2', brand:'Mastercard', last4:'7766', expiry:'03/26', holder:'Mohamed Ihsan', isDefault:false, color:'#EB001B' },
]

const COUPONS = [
  { code:'FIRST20', desc:'20% off first booking', discount:20, type:'%', expiry:'31 Jan 2025', used:false },
  { code:'CARE50',  desc:'LKR 500 off any care visit', discount:500, type:'LKR', expiry:'28 Feb 2025', used:false },
  { code:'SUMMER15',desc:'15% off this summer', discount:15, type:'%', expiry:'Expired', used:true },
]

// Monthly spend data (Jan = index 0)
const MONTHLY = [38000,42000,31500,55000,48000,62000,44000,39000,57000,71000,53000,66000]
const MONTHS  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

type SubView = 'dashboard'|'checkout'|'methods'|'history'|'detail'|'invoices'|'receipt'|'wallet'|'coupons'|'refunds'|'analytics'|'success'|'failed'

// ──────────────────────────────────────────────────────────────────────────────
// PAYMENT DASHBOARD
// ──────────────────────────────────────────────────────────────────────────────
function Dashboard({ onNav }: { onNav:(v:SubView)=>void }) {
  const metrics = [
    { v:'LKR 6,037', l:'Outstanding',    c:C.warning, sub:'Due 21 Jan' },
    { v:'LKR 34,412',l:'Paid This Month',c:C.success, sub:'↑ 14% vs last month' },
    { v:'LKR 9,200', l:'Refund Pending', c:C.accent,  sub:'TXN-29799' },
    { v:'LKR 12,500',l:'Wallet Balance', c:C.primary, sub:'Available' },
  ]

  const maxSpend = Math.max(...MONTHLY)

  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', flexDirection:'column', gap:22 }}>
      {/* Hero balance card */}
      <Card style={{ padding:0, overflow:'hidden' }}>
        <div style={{ background:`linear-gradient(135deg,${C.primary} 0%,#005D63 55%,#003C40 100%)`, padding:'28px 28px 24px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-30, right:-30, width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,0.04)' }} />
          <div style={{ position:'absolute', bottom:-40, right:80, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,0.03)' }} />
          <p style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.55)', textTransform:'uppercase', letterSpacing:'0.09em', marginBottom:8 }}>Total Spent · Jan 2025</p>
          <p style={{ fontSize:40, fontWeight:900, color:'#fff', fontFamily:'Manrope,sans-serif', letterSpacing:'-0.03em', marginBottom:4 }}>LKR 34,412</p>
          <p style={{ fontSize:13, color:'rgba(255,255,255,0.6)', marginBottom:20 }}>Across 4 care services · 3 beneficiaries</p>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={()=>onNav('checkout')} style={{ padding:'10px 20px', borderRadius:10, border:'none', background:C.accent, cursor:'pointer', fontSize:13, fontWeight:800, color:'#fff', fontFamily:'Manrope,sans-serif', boxShadow:`0 4px 14px ${C.accent}50` }}>Pay Now</button>
            <button onClick={()=>onNav('history')} style={{ padding:'10px 20px', borderRadius:10, border:'1.5px solid rgba(255,255,255,0.25)', background:'rgba(255,255,255,0.10)', cursor:'pointer', fontSize:13, fontWeight:700, color:'#fff', fontFamily:'Manrope,sans-serif' }}>View History</button>
            <button onClick={()=>onNav('wallet')} style={{ padding:'10px 20px', borderRadius:10, border:'1.5px solid rgba(255,255,255,0.25)', background:'rgba(255,255,255,0.10)', cursor:'pointer', fontSize:13, fontWeight:700, color:'#fff', fontFamily:'Manrope,sans-serif' }}>Wallet</button>
          </div>
        </div>
        {/* Stat row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', borderTop:`1px solid ${C.border}` }} className="pay-4col">
          {metrics.map((m,i)=>(
            <div key={m.l} style={{ padding:'16px 18px', borderRight: i<3?`1px solid ${C.border}`:'none' }}>
              <p style={{ fontSize:18, fontWeight:900, color:m.c, fontFamily:'Manrope,sans-serif', letterSpacing:'-0.02em', marginBottom:3 }}>{m.v}</p>
              <p style={{ fontSize:12, fontWeight:700, color:C.type, marginBottom:1 }}>{m.l}</p>
              <p style={{ fontSize:11, color:C.muted }}>{m.sub}</p>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:22, alignItems:'start' }} className="pay-dash-grid">
        <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
          {/* Spending chart */}
          <Card style={{ padding:24 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
              <div>
                <h3 style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>Monthly Spending</h3>
                <p style={{ fontSize:12, color:C.muted }}>2024–2025 · LKR</p>
              </div>
              <Bdg label="↑ 14% this month" color={C.success} />
            </div>
            <div style={{ display:'flex', gap:5, alignItems:'flex-end', height:110 }}>
              {MONTHLY.map((v,i)=>{
                const pct = v/maxSpend
                const isLast = i===MONTHLY.length-1
                return (
                  <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                    <div title={`LKR ${v.toLocaleString()}`} style={{ width:'100%', height:pct*90, borderRadius:6, background:isLast?`linear-gradient(180deg,${C.accent},${C.accent}90)`:i===MONTHLY.length-2?`linear-gradient(180deg,${C.primary},${C.primary}80)`:C.bg, border:isLast?'none':`1px solid ${C.border}`, transition:'all 0.3s', cursor:'pointer', minHeight:4 }} />
                    <p style={{ fontSize:9, color:i>=10?C.type:C.muted, fontWeight:i>=10?700:400 }}>{MONTHS[i]}</p>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Recent transactions */}
          <Card style={{ padding:22 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <h3 style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>Recent Transactions</h3>
              <button onClick={()=>onNav('history')} style={{ fontSize:12, fontWeight:700, color:C.primary, background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:3, fontFamily:'Manrope,sans-serif' }}>View All {I.chevR}</button>
            </div>
            {TRANSACTIONS.slice(0,4).map(t=>(
              <div key={t.id} style={{ display:'flex', gap:12, alignItems:'center', padding:'10px 0', borderBottom:`1px solid ${C.border}` }}>
                <Avatar name={t.agent} size={38} />
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:2 }}>{t.service}</p>
                  <p style={{ fontSize:11, color:C.muted }}>{t.agent} · {t.date}</p>
                </div>
                <div style={{ textAlign:'right' as const, flexShrink:0 }}>
                  <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>LKR {t.total.toLocaleString()}</p>
                  <PayBdg s={t.status} />
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Right sidebar */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Upcoming payments */}
          <Card style={{ padding:20 }}>
            <h3 style={{ fontSize:13, fontWeight:800, color:C.type, marginBottom:12, fontFamily:'Manrope,sans-serif' }}>Upcoming Payments</h3>
            {[
              { svc:'Hospital Companion', agent:'Kasun Perera', due:'21 Jan 2025', amt:6037 },
              { svc:'Medication Collection', agent:'Chamari D.', due:'28 Jan 2025', amt:4025 },
            ].map((u,i)=>(
              <div key={i} style={{ padding:'10px 12px', borderRadius:12, background:i===0?`${C.warning}06`:'#F9FAFB', border:`1px solid ${i===0?C.warning+'25':C.border}`, marginBottom:8 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                  <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{u.svc}</p>
                  <p style={{ fontSize:13, fontWeight:900, color:i===0?C.warning:C.type }}>LKR {u.amt.toLocaleString()}</p>
                </div>
                <p style={{ fontSize:11, color:C.muted }}>{u.agent} · Due {u.due}</p>
                {i===0 && <button onClick={()=>onNav('checkout')} style={{ marginTop:7, padding:'5px 12px', borderRadius:7, border:'none', background:C.warning, cursor:'pointer', fontSize:11, fontWeight:700, color:'#fff', fontFamily:'Manrope,sans-serif' }}>Pay Now</button>}
              </div>
            ))}
          </Card>

          {/* Quick actions */}
          <Card style={{ padding:20 }}>
            <h3 style={{ fontSize:13, fontWeight:800, color:C.type, marginBottom:12, fontFamily:'Manrope,sans-serif' }}>Quick Actions</h3>
            {[
              { icon:I.card,    l:'Payment Methods', v:'methods' as SubView },
              { icon:I.invoice, l:'Invoices',        v:'invoices' as SubView },
              { icon:I.wallet,  l:'Wallet',          v:'wallet' as SubView },
              { icon:I.refresh, l:'Refunds',         v:'refunds' as SubView },
              { icon:I.trending,l:'Analytics',       v:'analytics' as SubView },
              { icon:I.tag,     l:'Coupons',         v:'coupons' as SubView },
            ].map(a=>(
              <button key={a.l} onClick={()=>onNav(a.v)} style={{ width:'100%', display:'flex', alignItems:'center', gap:9, padding:'9px 10px', borderRadius:9, border:'none', background:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:600, color:C.type, textAlign:'left' as const, transition:'background 0.15s' }} onMouseOver={e=>{(e.currentTarget as HTMLButtonElement).style.background='#F2F4F5'}} onMouseOut={e=>{(e.currentTarget as HTMLButtonElement).style.background='transparent'}}>
                <span style={{ color:C.primary, display:'flex' }}>{a.icon}</span>{a.l}
                <span style={{ marginLeft:'auto', color:C.muted, display:'flex' }}>{I.chevR}</span>
              </button>
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// CHECKOUT
// ──────────────────────────────────────────────────────────────────────────────
function Checkout({ onBack, onSuccess, onFailed }: { onBack:()=>void; onSuccess:()=>void; onFailed:()=>void }) {
  const [selectedCard, setSelectedCard] = useState('cd1')
  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [step, setStep] = useState<'review'|'processing'>('review')

  const subtotal = 5250
  const platformFee = 787
  const discount = couponApplied ? 500 : 0
  const total = subtotal + platformFee - discount

  const handlePay = () => {
    setStep('processing')
    setTimeout(()=>onSuccess(), 2200)
  }

  if (step==='processing') return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:18, padding:40 }}>
      <div style={{ width:80, height:80, borderRadius:'50%', border:`4px solid ${C.primary}`, borderTopColor:'transparent', animation:'spin 0.9s linear infinite' }} />
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Processing Payment…</h2>
      <p style={{ fontSize:13, color:C.muted }}>Please do not close this window</p>
      <div style={{ display:'flex', gap:6, alignItems:'center', padding:'8px 16px', borderRadius:999, background:`${C.success}08`, border:`1px solid ${C.success}20` }}>
        <span style={{ color:C.success, display:'flex' }}>{I.lock}</span>
        <p style={{ fontSize:12, fontWeight:700, color:C.success }}>256-bit SSL Encrypted</p>
      </div>
    </div>
  )

  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', gap:26, alignItems:'start', flexWrap:'wrap' }}>
      <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:18 }}>
        <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', alignSelf:'flex-start' }}>{I.chevL} Dashboard</button>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Checkout</h2>

        {/* Service summary */}
        <Card style={{ padding:22 }}>
          <h3 style={{ fontSize:13, fontWeight:800, color:C.type, marginBottom:14, fontFamily:'Manrope,sans-serif' }}>Service Summary</h3>
          {[
            { l:'Service',      v:'Hospital Companion' },
            { l:'Care Agent',   v:'Kasun Perera' },
            { l:'Beneficiary',  v:'Nimal Perera · Kandy' },
            { l:'Schedule',     v:'14 Jan 2025 · 9:00 AM' },
            { l:'Duration',     v:'Approx. 3 hours' },
            { l:'Task Ref',     v:'RP-T-20259' },
          ].map(r=>(
            <div key={r.l} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:`1px solid ${C.border}` }}>
              <p style={{ fontSize:13, color:C.muted }}>{r.l}</p>
              <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{r.v}</p>
            </div>
          ))}
        </Card>

        {/* Payment methods */}
        <Card style={{ padding:22 }}>
          <h3 style={{ fontSize:13, fontWeight:800, color:C.type, marginBottom:14, fontFamily:'Manrope,sans-serif' }}>Payment Method</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:14 }}>
            {CARDS.map(card=>(
              <button key={card.id} onClick={()=>setSelectedCard(card.id)}
                style={{ display:'flex', gap:12, alignItems:'center', padding:'14px 16px', borderRadius:13, border:`2px solid ${selectedCard===card.id?C.primary:C.border}`, background:selectedCard===card.id?`${C.primary}06`:'transparent', cursor:'pointer', textAlign:'left' as const, transition:'all 0.15s' }}>
                <div style={{ width:46, height:30, borderRadius:8, background:`linear-gradient(135deg,${card.color},${card.color}99)`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <p style={{ fontSize:9, fontWeight:900, color:'#fff', letterSpacing:'0.05em' }}>{card.brand.toUpperCase()}</p>
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{card.brand} •••• {card.last4}</p>
                  <p style={{ fontSize:11, color:C.muted }}>Expires {card.expiry} · {card.holder}</p>
                </div>
                {card.isDefault && <Bdg label="Default" color={C.primary} />}
                <div style={{ width:18, height:18, borderRadius:'50%', border:`2px solid ${selectedCard===card.id?C.primary:C.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {selectedCard===card.id && <div style={{ width:9, height:9, borderRadius:'50%', background:C.primary }} />}
                </div>
              </button>
            ))}

            {/* Wallet option */}
            <button onClick={()=>setSelectedCard('wallet')} style={{ display:'flex', gap:12, alignItems:'center', padding:'14px 16px', borderRadius:13, border:`2px solid ${selectedCard==='wallet'?C.primary:C.border}`, background:selectedCard==='wallet'?`${C.primary}06`:'transparent', cursor:'pointer', textAlign:'left' as const }}>
              <div style={{ width:46, height:30, borderRadius:8, background:`linear-gradient(135deg,${C.primary},#00959E)`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ color:'#fff', display:'flex' }}>{I.wallet}</span>
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:13, fontWeight:700, color:C.type }}>ReadyPal Wallet</p>
                <p style={{ fontSize:11, color:C.muted }}>Balance: LKR 12,500</p>
              </div>
              <div style={{ width:18, height:18, borderRadius:'50%', border:`2px solid ${selectedCard==='wallet'?C.primary:C.border}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {selectedCard==='wallet' && <div style={{ width:9, height:9, borderRadius:'50%', background:C.primary }} />}
              </div>
            </button>

            {/* Apple/Google Pay placeholders */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {[{icon:I.apple, l:'Apple Pay'},{icon:I.google, l:'Google Pay'}].map(p=>(
                <button key={p.l} style={{ padding:'11px', borderRadius:12, border:`1.5px solid ${C.border}`, background:'#FAFAFA', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:7, fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:700, color:C.sub }}>
                  <span style={{ display:'flex' }}>{p.icon}</span>{p.l}
                </button>
              ))}
            </div>
          </div>
          <button style={{ width:'100%', padding:'10px', borderRadius:10, border:`1.5px dashed ${C.primary}40`, background:`${C.primary}04`, cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:700, color:C.primary, display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>{I.plus} Add New Card</button>
        </Card>

        {/* Coupon */}
        <Card style={{ padding:22 }}>
          <h3 style={{ fontSize:13, fontWeight:800, color:C.type, marginBottom:12, fontFamily:'Manrope,sans-serif' }}>Coupon</h3>
          <div style={{ display:'flex', gap:8 }}>
            <input value={coupon} onChange={e=>setCoupon(e.target.value.toUpperCase())} placeholder="Enter coupon code" disabled={couponApplied}
              style={{ flex:1, padding:'10px 14px', borderRadius:10, border:`1.5px solid ${couponApplied?C.success:C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, outline:'none', background:couponApplied?`${C.success}04`:'#FAFAFA', boxSizing:'border-box' as const }} />
            {couponApplied
              ? <Btn label="Remove" variant="danger" small onClick={()=>{ setCouponApplied(false); setCoupon('') }} />
              : <Btn label="Apply" variant="secondary" small onClick={()=>{ if(coupon==='CARE50'||coupon==='FIRST20') setCouponApplied(true) }} />
            }
          </div>
          {couponApplied && <p style={{ fontSize:12, color:C.success, marginTop:6, fontWeight:700 }}>✓ Coupon applied — LKR 500 discount</p>}
          <p style={{ fontSize:11, color:C.muted, marginTop:6 }}>Try: CARE50 or FIRST20</p>
        </Card>
      </div>

      {/* Order summary sidebar */}
      <div style={{ width:300, flexShrink:0, position:'sticky', top:24 }}>
        <Card style={{ padding:24 }}>
          <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:16, fontFamily:'Manrope,sans-serif' }}>Order Summary</h3>
          {[
            { l:'Care Service (3 hrs × LKR 1,750)', v:subtotal },
            { l:'ReadyPal Platform Fee (15%)', v:platformFee },
            ...(couponApplied?[{ l:'Coupon — CARE50', v:-discount }]:[]),
          ].map(r=>(
            <div key={r.l} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:`1px solid ${C.border}` }}>
              <p style={{ fontSize:13, color:C.muted }}>{r.l}</p>
              <p style={{ fontSize:13, fontWeight:700, color:r.v<0?C.success:C.type }}>{r.v<0?'-':''} LKR {Math.abs(r.v).toLocaleString()}</p>
            </div>
          ))}
          <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 0 16px' }}>
            <p style={{ fontSize:15, fontWeight:800, color:C.type }}>Grand Total</p>
            <p style={{ fontSize:20, fontWeight:900, color:C.primary, fontFamily:'Manrope,sans-serif', letterSpacing:'-0.02em' }}>LKR {total.toLocaleString()}</p>
          </div>
          <button onClick={handlePay} style={{ width:'100%', padding:'14px', borderRadius:12, border:'none', background:`linear-gradient(135deg,${C.primary},#00959E)`, cursor:'pointer', fontSize:14, fontWeight:800, color:'#fff', fontFamily:'Manrope,sans-serif', boxShadow:`0 6px 20px ${C.primary}40` }}>
            Confirm & Pay LKR {total.toLocaleString()}
          </button>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, marginTop:12 }}>
            <span style={{ color:C.success, display:'flex' }}>{I.lock}</span>
            <p style={{ fontSize:11, color:C.muted }}>256-bit SSL · Secured by Stripe</p>
          </div>
          <div style={{ display:'flex', gap:8, marginTop:10 }}>
            <Btn label="Change Method" variant="secondary" small onClick={()=>{}} />
            <button onClick={onFailed} style={{ padding:'6px 14px', borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', fontSize:11, fontWeight:700, color:C.muted, fontFamily:'Manrope,sans-serif' }}>Test Failure</button>
          </div>
        </Card>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// PAYMENT SUCCESS
// ──────────────────────────────────────────────────────────────────────────────
function PaymentSuccess({ onBack }: { onBack:()=>void }) {
  const ref = `TXN-${Math.floor(Math.random()*9000)+29000}`
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'48px 28px', textAlign:'center', gap:6 }}>
      <div style={{ position:'relative', marginBottom:16 }}>
        {[{t:-44,l:-44},{t:-34,r:-54},{t:-8,l:64},{t:12,r:64}].map((p,i)=>(
          <div key={i} style={{ position:'absolute', ...p as CSSProperties, opacity:0.9 }}>{I.confetti}</div>
        ))}
        <div style={{ width:96, height:96, borderRadius:'50%', background:`linear-gradient(135deg,${C.success},#16A34A)`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto', boxShadow:`0 12px 40px ${C.success}40` }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M10 24l10 10 18-20" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>
      <h1 style={{ fontSize:30, fontWeight:900, color:C.type, letterSpacing:'-0.02em', fontFamily:'Manrope,sans-serif' }}>Payment Successful!</h1>
      <p style={{ fontSize:14, color:C.muted, maxWidth:380, lineHeight:1.7 }}>Your payment for <strong style={{color:C.type}}>Hospital Companion — Nimal Perera</strong> has been confirmed.</p>
      <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'7px 18px', borderRadius:999, background:`${C.primary}10`, border:`1px solid ${C.primary}20`, margin:'10px 0' }}>
        <span style={{ fontSize:11, fontWeight:700, color:C.muted }}>Reference</span>
        <span style={{ fontSize:13, fontWeight:900, color:C.primary, letterSpacing:'0.04em', fontFamily:'Manrope,sans-serif' }}>{ref}</span>
      </div>
      <Card style={{ padding:20, maxWidth:360, width:'100%', marginBottom:12 }}>
        {[{l:'Amount Paid',v:'LKR 5,537'},{l:'Payment Method',v:'Visa •••• 4242'},{l:'Invoice',v:'INV-1047'},{l:'Date',v:'14 Jan 2025 · 9:30 AM'}].map(r=>(
          <div key={r.l} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:`1px solid ${C.border}` }}>
            <p style={{ fontSize:12, color:C.muted }}>{r.l}</p>
            <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{r.v}</p>
          </div>
        ))}
      </Card>
      <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
        <Btn label="Download Receipt" variant="primary" icon={I.download} />
        <Btn label="View Invoice" variant="secondary" icon={I.invoice} onClick={()=>{}} />
        <Btn label="Track Care Request" variant="ghost" />
      </div>
      <button onClick={onBack} style={{ marginTop:16, fontSize:12, fontWeight:700, color:C.muted, background:'none', border:'none', cursor:'pointer', fontFamily:'Manrope,sans-serif' }}>Back to Dashboard</button>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// PAYMENT FAILED
// ──────────────────────────────────────────────────────────────────────────────
function PaymentFailed({ onBack, onRetry }: { onBack:()=>void; onRetry:()=>void }) {
  const reasons = ['Insufficient funds on card','Bank declined the transaction','Card expired or incorrect details','Connection timeout — please retry']
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'48px 28px', textAlign:'center', gap:16 }}>
      <div style={{ width:90, height:90, borderRadius:'50%', background:`${C.error}10`, display:'flex', alignItems:'center', justifyContent:'center', border:`3px solid ${C.error}30` }}>
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none"><path d="M10 10l24 24M34 10L10 34" stroke={C.error} strokeWidth="3" strokeLinecap="round"/></svg>
      </div>
      <h1 style={{ fontSize:28, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', letterSpacing:'-0.02em' }}>Payment Failed</h1>
      <p style={{ fontSize:14, color:C.muted, maxWidth:380, lineHeight:1.7 }}>We were unable to process your payment. Please try again or use a different payment method.</p>
      <Card style={{ padding:20, maxWidth:380, width:'100%' }}>
        <p style={{ fontSize:13, fontWeight:800, color:C.type, marginBottom:12 }}>Possible Reasons</p>
        {reasons.map((r,i)=>(
          <div key={i} style={{ display:'flex', gap:8, alignItems:'flex-start', padding:'7px 0', borderBottom:i<reasons.length-1?`1px solid ${C.border}`:'none' }}>
            <span style={{ color:C.error, display:'flex', flexShrink:0, marginTop:1 }}>{I.warning}</span>
            <p style={{ fontSize:12, color:C.sub }}>{r}</p>
          </div>
        ))}
      </Card>
      <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
        <Btn label="Retry Payment" variant="primary" icon={I.refresh} onClick={onRetry} />
        <Btn label="Change Method" variant="secondary" icon={I.card} onClick={onBack} />
        <Btn label="Contact Support" variant="ghost" />
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// TRANSACTION HISTORY
// ──────────────────────────────────────────────────────────────────────────────
function TxnHistory({ onBack, onDetail }: { onBack:()=>void; onDetail:(id:string)=>void }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const filtered = TRANSACTIONS.filter(t=>{
    const q = search.toLowerCase()
    const matchS = statusFilter==='All'||t.status===statusFilter
    const matchQ = !q||t.agent.toLowerCase().includes(q)||t.service.toLowerCase().includes(q)||t.id.toLowerCase().includes(q)||t.beneficiary.toLowerCase().includes(q)
    return matchS&&matchQ
  })

  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', flexDirection:'column', gap:18 }}>
      <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', alignSelf:'flex-start' }}>{I.chevL} Dashboard</button>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Transaction History</h2>
        <div style={{ display:'flex', gap:8 }}>
          <Btn label="Export CSV" variant="secondary" icon={I.download} small />
          <Btn label="Print" variant="ghost" icon={I.print} small />
        </div>
      </div>
      <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:1, minWidth:200 }}>
          <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:C.muted, display:'flex' }}>{I.search}</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search transactions…" style={{ width:'100%', padding:'9px 10px 9px 30px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, outline:'none', background:'#FAFAFA', boxSizing:'border-box' as const }} />
        </div>
        <div style={{ display:'flex', gap:6 }}>
          {['All','Paid','Pending','Refunded','Failed'].map(s=>(
            <button key={s} onClick={()=>setStatusFilter(s)} style={{ padding:'8px 14px', borderRadius:9, border:`1.5px solid ${statusFilter===s?C.primary:C.border}`, background:statusFilter===s?`${C.primary}08`:'transparent', cursor:'pointer', fontSize:12, fontWeight:700, color:statusFilter===s?C.primary:C.sub, fontFamily:'Manrope,sans-serif' }}>{s}</button>
          ))}
        </div>
      </div>

      <Card style={{ padding:0, overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', minWidth:700 }}>
            <thead>
              <tr style={{ background:'#F9FAFB', borderBottom:`1px solid ${C.border}` }}>
                {['Reference','Date','Service / Agent','Beneficiary','Amount','Method','Status',''].map(h=>(
                  <th key={h} style={{ padding:'11px 16px', textAlign:'left' as const, fontSize:11, fontWeight:700, color:C.muted, whiteSpace:'nowrap' as const }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t,i)=>(
                <tr key={t.id} style={{ borderBottom:`1px solid ${C.border}`, background:i%2===0?C.surface:'#FAFAFA' }}>
                  <td style={{ padding:'12px 16px' }}><p style={{ fontSize:12, fontWeight:700, color:C.primary, fontFamily:'Manrope,sans-serif' }}>{t.id}</p><p style={{ fontSize:10, color:C.muted }}>{t.ref}</p></td>
                  <td style={{ padding:'12px 16px', fontSize:12, color:C.sub, whiteSpace:'nowrap' as const }}>{t.date}</td>
                  <td style={{ padding:'12px 16px' }}>
                    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                      <Avatar name={t.agent} size={28} />
                      <div><p style={{ fontSize:12, fontWeight:700, color:C.type }}>{t.service}</p><p style={{ fontSize:11, color:C.muted }}>{t.agent}</p></div>
                    </div>
                  </td>
                  <td style={{ padding:'12px 16px', fontSize:12, color:C.sub }}>{t.beneficiary}</td>
                  <td style={{ padding:'12px 16px' }}><p style={{ fontSize:13, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>LKR {t.total.toLocaleString()}</p></td>
                  <td style={{ padding:'12px 16px', fontSize:12, color:C.sub, whiteSpace:'nowrap' as const }}>{t.method}</td>
                  <td style={{ padding:'12px 16px' }}><PayBdg s={t.status} /></td>
                  <td style={{ padding:'12px 16px' }}>
                    <div style={{ display:'flex', gap:5 }}>
                      <button onClick={()=>onDetail(t.id)} style={{ padding:'4px 10px', borderRadius:7, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', fontSize:11, fontWeight:700, color:C.primary, fontFamily:'Manrope,sans-serif' }}>Details</button>
                      <button style={{ width:28, height:28, borderRadius:7, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.muted }}>{I.download}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!filtered.length && (
          <div style={{ padding:'40px', textAlign:'center' as const }}>
            <p style={{ fontSize:14, color:C.muted }}>No transactions found.</p>
          </div>
        )}
      </Card>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// TRANSACTION DETAIL
// ──────────────────────────────────────────────────────────────────────────────
function TxnDetail({ id, onBack }: { id:string; onBack:()=>void }) {
  const t = TRANSACTIONS.find(x=>x.id===id)??TRANSACTIONS[0]
  const timeline = [
    { e:'Payment Initiated',  t:`${t.date} · 9:28 AM`, done:true },
    { e:'Payment Authorized', t:`${t.date} · 9:28 AM`, done:true },
    { e:'Payment Captured',   t:`${t.date} · 9:29 AM`, done:true },
    { e:'Invoice Generated',  t:`${t.date} · 9:30 AM`, done:true },
    { e:'Receipt Sent',       t:`${t.date} · 9:30 AM`, done:t.status==='Paid'||t.status==='Refunded' },
    { e:'Refund Processed',   t:t.status==='Refunded'?`${t.date} · 11:00 AM`:'—', done:t.status==='Refunded' },
  ]
  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', gap:24, alignItems:'start', flexWrap:'wrap' }}>
      <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:18 }}>
        <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', alignSelf:'flex-start' }}>{I.chevL} Transactions</button>
        <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
          <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>{t.id}</h2>
          <PayBdg s={t.status} />
        </div>

        <Card style={{ padding:22 }}>
          <h3 style={{ fontSize:13, fontWeight:800, color:C.type, marginBottom:14, fontFamily:'Manrope,sans-serif' }}>Payment Breakdown</h3>
          {[
            { l:'Care Service',        v:`LKR ${t.amount.toLocaleString()}` },
            { l:'Platform Fee (15%)',   v:`LKR ${t.fee.toLocaleString()}` },
            { l:'Taxes',               v:'Included' },
          ].map(r=>(
            <div key={r.l} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:`1px solid ${C.border}` }}>
              <p style={{ fontSize:13, color:C.muted }}>{r.l}</p>
              <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{r.v}</p>
            </div>
          ))}
          <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 0 0' }}>
            <p style={{ fontSize:15, fontWeight:800, color:C.type }}>Total Charged</p>
            <p style={{ fontSize:18, fontWeight:900, color:C.primary, fontFamily:'Manrope,sans-serif' }}>LKR {t.total.toLocaleString()}</p>
          </div>
        </Card>

        <Card style={{ padding:22 }}>
          <h3 style={{ fontSize:13, fontWeight:800, color:C.type, marginBottom:14, fontFamily:'Manrope,sans-serif' }}>Payment Timeline</h3>
          {timeline.map((ev,i)=>(
            <div key={i} style={{ display:'flex', gap:12 }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                <div style={{ width:22, height:22, borderRadius:'50%', background:ev.done?C.primary:C.border, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {ev.done&&<span style={{ color:'#fff', display:'flex', transform:'scale(0.75)' }}>{I.check}</span>}
                </div>
                {i<timeline.length-1&&<div style={{ width:2, flex:1, minHeight:12, background:ev.done?C.primary:C.border, margin:'3px 0' }} />}
              </div>
              <div style={{ paddingBottom:i<timeline.length-1?12:0 }}>
                <p style={{ fontSize:13, fontWeight:ev.done?700:400, color:ev.done?C.type:C.muted }}>{ev.e}</p>
                <p style={{ fontSize:11, color:C.muted }}>{ev.t}</p>
              </div>
            </div>
          ))}
        </Card>
      </div>

      <div style={{ width:260, flexShrink:0, display:'flex', flexDirection:'column', gap:14, position:'sticky', top:24 }}>
        <Card style={{ padding:22 }}>
          <p style={{ fontSize:12, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:12 }}>Details</p>
          {[{l:'Agent',v:t.agent},{l:'Beneficiary',v:t.beneficiary},{l:'Service',v:t.service},{l:'Method',v:t.method},{l:'Invoice',v:t.ref},{l:'Task',v:t.task}].map(r=>(
            <div key={r.l} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:`1px solid ${C.border}` }}>
              <p style={{ fontSize:12, color:C.muted }}>{r.l}</p>
              <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{r.v}</p>
            </div>
          ))}
        </Card>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          <Btn label="Download Receipt" variant="primary" icon={I.download} />
          <Btn label="View Invoice" variant="secondary" icon={I.invoice} />
          {t.status==='Paid' && <Btn label="Request Refund" variant="danger" icon={I.refresh} />}
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// INVOICE CENTER
// ──────────────────────────────────────────────────────────────────────────────
function InvoiceCenter({ onBack }: { onBack:()=>void }) {
  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', flexDirection:'column', gap:18 }}>
      <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', alignSelf:'flex-start' }}>{I.chevL} Dashboard</button>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Invoice Center</h2>
        <div style={{ display:'flex', gap:8 }}><Btn label="Download All" variant="secondary" icon={I.download} small /><Btn label="Print" variant="ghost" icon={I.print} small /></div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {INVOICES.map(inv=>(
          <Card key={inv.num} hover style={{ padding:'18px 22px' }}>
            <div style={{ display:'flex', gap:14, alignItems:'center', flexWrap:'wrap' }}>
              <div style={{ width:48, height:48, borderRadius:14, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary, flexShrink:0 }}>
                <span style={{ transform:'scale(1.5)', display:'flex' }}>{I.invoice}</span>
              </div>
              <div style={{ flex:1, minWidth:180 }}>
                <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4, flexWrap:'wrap' }}>
                  <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{inv.num}</p>
                  <PayBdg s={inv.status} />
                </div>
                <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                  <span style={{ fontSize:12, color:C.muted }}>{inv.task}</span>
                  <span style={{ fontSize:12, color:C.muted }}>{inv.beneficiary}</span>
                  <span style={{ fontSize:12, color:C.muted }}>Issued {inv.issued}</span>
                  <span style={{ fontSize:12, color:inv.status==='Paid'?C.muted:C.warning }}>Due {inv.due}</span>
                </div>
              </div>
              <div style={{ display:'flex', gap:8, alignItems:'center', flexShrink:0 }}>
                <p style={{ fontSize:16, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>LKR {inv.amount.toLocaleString()}</p>
                <button style={{ width:32, height:32, borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.primary }}>{I.download}</button>
                <button style={{ width:32, height:32, borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.sub }}>{I.mail}</button>
                <button style={{ width:32, height:32, borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.sub }}>{I.share}</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// WALLET
// ──────────────────────────────────────────────────────────────────────────────
function Wallet({ onBack }: { onBack:()=>void }) {
  const [topUpAmt, setTopUpAmt] = useState('5000')
  const [topped, setTopped] = useState(false)
  const balance = topped ? 12500+Number(topUpAmt) : 12500

  const activity = [
    { desc:'Hospital Companion · Kasun Perera', type:'debit',  amt:6037, date:'14 Jan' },
    { desc:'Wallet Top Up',                     type:'credit', amt:15000, date:'10 Jan' },
    { desc:'Medication Collection',             type:'debit',  amt:4025, date:'8 Jan' },
    { desc:'Wallet Top Up',                     type:'credit', amt:10000, date:'2 Jan' },
    { desc:'Emergency Companion',               type:'debit',  amt:9200, date:'2 Jan' },
  ]

  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', gap:22, alignItems:'start', flexWrap:'wrap' }}>
      <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:18 }}>
        <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', alignSelf:'flex-start' }}>{I.chevL} Dashboard</button>

        {/* Balance card */}
        <Card style={{ padding:0, overflow:'hidden' }}>
          <div style={{ background:`linear-gradient(135deg,${C.primary},#00959E,#007A82)`, padding:'28px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:-20, right:-20, width:100, height:100, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }} />
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
              <div style={{ width:42, height:42, borderRadius:14, background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ color:'#fff', display:'flex', transform:'scale(1.3)' }}>{I.wallet}</span>
              </div>
              <div>
                <p style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:'0.08em' }}>ReadyPal Wallet</p>
                <p style={{ fontSize:11, color:'rgba(255,255,255,0.5)' }}>Mohamed Ihsan</p>
              </div>
            </div>
            <p style={{ fontSize:36, fontWeight:900, color:'#fff', fontFamily:'Manrope,sans-serif', letterSpacing:'-0.03em', marginBottom:6 }}>LKR {balance.toLocaleString()}</p>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.6)' }}>Available Balance</p>
          </div>
          <div style={{ padding:'16px 24px', display:'flex', gap:10 }}>
            <Btn label="Top Up" variant="primary" icon={I.plus} />
            <Btn label="Withdraw" variant="secondary" icon={I.download} disabled />
            <span style={{ fontSize:11, color:C.muted, display:'flex', alignItems:'center', marginLeft:4 }}>Withdraw coming soon</span>
          </div>
        </Card>

        {/* Top up */}
        <Card style={{ padding:22 }}>
          <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:14, fontFamily:'Manrope,sans-serif' }}>Top Up Wallet</h3>
          <div style={{ display:'flex', gap:8, marginBottom:12, flexWrap:'wrap' }}>
            {['2500','5000','10000','25000'].map(a=>(
              <button key={a} onClick={()=>setTopUpAmt(a)} style={{ padding:'8px 16px', borderRadius:9, border:`1.5px solid ${topUpAmt===a?C.primary:C.border}`, background:topUpAmt===a?`${C.primary}08`:'transparent', cursor:'pointer', fontSize:13, fontWeight:700, color:topUpAmt===a?C.primary:C.sub, fontFamily:'Manrope,sans-serif' }}>LKR {Number(a).toLocaleString()}</button>
            ))}
          </div>
          <div style={{ display:'flex', gap:8, marginBottom:14 }}>
            <div style={{ flex:1, display:'flex', alignItems:'center', padding:'10px 14px', borderRadius:10, border:`1.5px solid ${C.primary}40`, background:`${C.primary}04` }}>
              <span style={{ fontSize:13, fontWeight:700, color:C.sub, marginRight:6 }}>LKR</span>
              <input type="number" value={topUpAmt} onChange={e=>setTopUpAmt(e.target.value)} style={{ flex:1, border:'none', background:'transparent', fontFamily:'Manrope,sans-serif', fontSize:16, fontWeight:800, color:C.primary, outline:'none' }} />
            </div>
            <Btn label={topped?'✓ Topped Up':'Confirm Top Up'} variant="primary" onClick={()=>setTopped(true)} />
          </div>
          {topped && <p style={{ fontSize:12, color:C.success, fontWeight:700 }}>✓ Wallet updated — new balance: LKR {balance.toLocaleString()}</p>}
        </Card>

        {/* Activity */}
        <Card style={{ padding:22 }}>
          <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:14, fontFamily:'Manrope,sans-serif' }}>Recent Activity</h3>
          {activity.map((a,i)=>(
            <div key={i} style={{ display:'flex', gap:12, alignItems:'center', padding:'10px 0', borderBottom:i<activity.length-1?`1px solid ${C.border}`:'none' }}>
              <div style={{ width:38, height:38, borderRadius:11, background:a.type==='credit'?`${C.success}10`:`${C.error}08`, display:'flex', alignItems:'center', justifyContent:'center', color:a.type==='credit'?C.success:C.error, flexShrink:0 }}>
                {a.type==='credit'?I.plus:I.wallet}
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:13, fontWeight:600, color:C.type }}>{a.desc}</p>
                <p style={{ fontSize:11, color:C.muted }}>{a.date}</p>
              </div>
              <p style={{ fontSize:14, fontWeight:800, color:a.type==='credit'?C.success:C.type, fontFamily:'Manrope,sans-serif' }}>{a.type==='credit'?'+':'-'}LKR {a.amt.toLocaleString()}</p>
            </div>
          ))}
        </Card>
      </div>

      {/* Rewards sidebar */}
      <div style={{ width:260, flexShrink:0 }}>
        <Card style={{ padding:22 }}>
          <p style={{ fontSize:12, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:12 }}>ReadyPal Rewards</p>
          <div style={{ padding:'14px', borderRadius:14, background:`linear-gradient(135deg,${C.accent}10,${C.accent}20)`, border:`1px solid ${C.accent}25`, marginBottom:14 }}>
            <p style={{ fontSize:24, fontWeight:900, color:C.accent, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>1,240 pts</p>
            <p style={{ fontSize:12, color:C.sub }}>Redeem for care service discounts</p>
          </div>
          <p style={{ fontSize:12, fontWeight:700, color:C.muted, marginBottom:8 }}>Upcoming</p>
          <div style={{ padding:'10px 12px', borderRadius:10, background:'#F9FAFB', border:`1px solid ${C.border}` }}>
            <p style={{ fontSize:12, fontWeight:700, color:C.type, marginBottom:3 }}>Free 1-hr Visit</p>
            <p style={{ fontSize:11, color:C.muted }}>Unlock at 2,000 points</p>
            <div style={{ height:5, borderRadius:99, background:C.bg, overflow:'hidden', marginTop:8 }}>
              <div style={{ width:'62%', height:'100%', background:`linear-gradient(90deg,${C.accent},${C.accent}80)`, borderRadius:99 }} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// COUPONS
// ──────────────────────────────────────────────────────────────────────────────
function CouponView({ onBack }: { onBack:()=>void }) {
  const [input, setInput] = useState('')

  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', flexDirection:'column', gap:18 }}>
      <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', alignSelf:'flex-start' }}>{I.chevL} Dashboard</button>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Coupons & Discounts</h2>

      <Card style={{ padding:22 }}>
        <h3 style={{ fontSize:13, fontWeight:800, color:C.type, marginBottom:12, fontFamily:'Manrope,sans-serif' }}>Apply Coupon</h3>
        <div style={{ display:'flex', gap:8 }}>
          <input value={input} onChange={e=>setInput(e.target.value.toUpperCase())} placeholder="Enter coupon code"
            style={{ flex:1, padding:'10px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, outline:'none', background:'#FAFAFA', boxSizing:'border-box' as const }} />
          <Btn label="Apply" variant="primary" />
        </div>
      </Card>

      <h3 style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>Available Coupons</h3>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {COUPONS.map(c=>(
          <Card key={c.code} style={{ padding:0, overflow:'hidden', opacity:c.used?0.55:1 }}>
            <div style={{ display:'flex' }}>
              <div style={{ width:80, background:c.used?C.muted:`linear-gradient(135deg,${C.primary},#00959E)`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ color:'#fff', display:'flex', transform:'scale(1.4)' }}>{I.tag}</span>
              </div>
              <div style={{ flex:1, padding:'16px 18px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                  <p style={{ fontSize:16, fontWeight:900, color:c.used?C.muted:C.type, fontFamily:'Manrope,sans-serif', letterSpacing:'0.04em' }}>{c.code}</p>
                  <Bdg label={c.used?'Used':'Active'} color={c.used?C.muted:C.success} />
                  <p style={{ fontSize:18, fontWeight:900, color:c.used?C.muted:C.accent, fontFamily:'Manrope,sans-serif', marginLeft:'auto' }}>{c.type==='%'?`${c.discount}% OFF`:`LKR ${c.discount} OFF`}</p>
                </div>
                <p style={{ fontSize:13, color:C.sub, marginBottom:4 }}>{c.desc}</p>
                <p style={{ fontSize:11, color:c.expiry==='Expired'?C.error:C.muted }}>Expires: {c.expiry}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// REFUNDS
// ──────────────────────────────────────────────────────────────────────────────
function Refunds({ onBack }: { onBack:()=>void }) {
  const [reason, setReason] = useState('')
  const reasons = ['Service not delivered as expected','Care agent did not arrive','Overcharged','Duplicate payment','Other']

  const refund = TRANSACTIONS.find(t=>t.status==='Refunded')!
  const rfTimeline = [
    { e:'Refund Requested', t:'2 Jan · 12:00 PM', done:true },
    { e:'Under Review',     t:'2 Jan · 2:00 PM',  done:true },
    { e:'Refund Approved',  t:'3 Jan · 10:00 AM', done:true },
    { e:'Funds Returned',   t:'5 Jan · 9:00 AM',  done:true },
  ]

  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', gap:22, alignItems:'start', flexWrap:'wrap' }}>
      <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:18 }}>
        <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', alignSelf:'flex-start' }}>{I.chevL} Dashboard</button>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Refunds</h2>

        {/* Existing refund */}
        <Card style={{ padding:22 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14, flexWrap:'wrap', gap:8 }}>
            <h3 style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>Refund — {refund.id}</h3>
            <PayBdg s="Refunded" />
          </div>
          <div style={{ display:'flex', gap:10, marginBottom:14 }}>
            <div style={{ flex:1, padding:'14px', borderRadius:12, background:`${C.success}06`, border:`1px solid ${C.success}20`, textAlign:'center' as const }}>
              <p style={{ fontSize:22, fontWeight:900, color:C.success, fontFamily:'Manrope,sans-serif' }}>LKR {refund.total.toLocaleString()}</p>
              <p style={{ fontSize:11, color:C.muted }}>Amount Refunded</p>
            </div>
            <div style={{ flex:1, padding:'14px', borderRadius:12, background:'#F9FAFB', border:`1px solid ${C.border}`, textAlign:'center' as const }}>
              <p style={{ fontSize:14, fontWeight:800, color:C.type }}>5 Jan 2025</p>
              <p style={{ fontSize:11, color:C.muted }}>Returned To Wallet</p>
            </div>
          </div>
          {rfTimeline.map((ev,i)=>(
            <div key={i} style={{ display:'flex', gap:12 }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                <div style={{ width:22, height:22, borderRadius:'50%', background:ev.done?C.success:C.border, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {ev.done&&<span style={{ color:'#fff', display:'flex', transform:'scale(0.75)' }}>{I.check}</span>}
                </div>
                {i<rfTimeline.length-1&&<div style={{ width:2, flex:1, minHeight:10, background:ev.done?C.success:C.border, margin:'3px 0' }} />}
              </div>
              <div style={{ paddingBottom:i<rfTimeline.length-1?10:0 }}>
                <p style={{ fontSize:12, fontWeight:700, color:ev.done?C.type:C.muted }}>{ev.e}</p>
                <p style={{ fontSize:11, color:C.muted }}>{ev.t}</p>
              </div>
            </div>
          ))}
        </Card>

        {/* New refund request */}
        <Card style={{ padding:22 }}>
          <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:14, fontFamily:'Manrope,sans-serif' }}>Request New Refund</h3>
          <p style={{ fontSize:12, fontWeight:700, color:C.muted, marginBottom:10 }}>Reason</p>
          <div style={{ display:'flex', flexDirection:'column', gap:7, marginBottom:16 }}>
            {reasons.map(r=>(
              <button key={r} onClick={()=>setReason(r)} style={{ padding:'9px 14px', borderRadius:10, border:`1.5px solid ${reason===r?C.primary:C.border}`, background:reason===r?`${C.primary}06`:'transparent', cursor:'pointer', fontSize:13, fontWeight:600, color:reason===r?C.primary:C.type, fontFamily:'Manrope,sans-serif', textAlign:'left' as const, display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:16,height:16,borderRadius:'50%',border:`2px solid ${reason===r?C.primary:C.border}`,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center' }}>{reason===r&&<div style={{width:8,height:8,borderRadius:'50%',background:C.primary}} />}</div>
                {r}
              </button>
            ))}
          </div>
          <Btn label="Submit Refund Request" variant="primary" disabled={!reason} />
        </Card>
      </div>

      <div style={{ width:260, flexShrink:0 }}>
        <Card style={{ padding:22 }}>
          <p style={{ fontSize:12, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:12 }}>Refund Policy</p>
          {[{l:'Full refund',v:'Cancelled 24+ hrs in advance'},{l:'50% refund',v:'Cancelled within 24 hrs'},{l:'No refund',v:'No-show by client'},{l:'Full refund',v:'Agent did not arrive'}].map(r=>(
            <div key={r.l} style={{ display:'flex', flexDirection:'column', padding:'8px 0', borderBottom:`1px solid ${C.border}` }}>
              <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{r.l}</p>
              <p style={{ fontSize:11, color:C.muted }}>{r.v}</p>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// SPENDING ANALYTICS
// ──────────────────────────────────────────────────────────────────────────────
function Analytics({ onBack }: { onBack:()=>void }) {
  const categories = [
    { l:'Hospital Companion', v:38, c:C.primary },
    { l:'Medication Collection', v:24, c:C.accent },
    { l:'Emergency Companion', v:20, c:C.error },
    { l:'Home Wellness Visit', v:18, c:C.success },
  ]
  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', flexDirection:'column', gap:22 }}>
      <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', alignSelf:'flex-start' }}>{I.chevL} Dashboard</button>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Spending Analytics</h2>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }} className="pay-3col">
        {[{v:'LKR 5,802',l:'Avg Per Visit'},{v:'LKR 34,412',l:'This Month'},{v:'LKR 58,200',l:'All Time'}].map(s=>(
          <Card key={s.l} style={{ padding:'18px 20px' }}>
            <p style={{ fontSize:22, fontWeight:900, color:C.primary, fontFamily:'Manrope,sans-serif', letterSpacing:'-0.02em', marginBottom:4 }}>{s.v}</p>
            <p style={{ fontSize:12, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>

      {/* Bar chart */}
      <Card style={{ padding:24 }}>
        <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:18, fontFamily:'Manrope,sans-serif' }}>12-Month Trend</h3>
        <div style={{ display:'flex', gap:6, alignItems:'flex-end', height:140 }}>
          {MONTHLY.map((v,i)=>{
            const pct = v/Math.max(...MONTHLY)
            const recent = i>=10
            return (
              <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
                <p style={{ fontSize:9, color:C.muted, whiteSpace:'nowrap' as const }}>LKR {(v/1000).toFixed(0)}k</p>
                <div style={{ width:'100%', height:pct*100, borderRadius:8, background:recent?`linear-gradient(180deg,${C.accent},${C.accent}80)`:`${C.primary}20`, border:recent?'none':`1px solid ${C.border}`, minHeight:4 }} />
                <p style={{ fontSize:9, color:recent?C.type:C.muted, fontWeight:recent?700:400 }}>{MONTHS[i]}</p>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Category breakdown */}
      <Card style={{ padding:24 }}>
        <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:18, fontFamily:'Manrope,sans-serif' }}>Category Breakdown</h3>
        <div style={{ display:'flex', gap:20, alignItems:'center', flexWrap:'wrap' }}>
          {/* Donut placeholder */}
          <div style={{ width:140, height:140, borderRadius:'50%', background:`conic-gradient(${C.primary} 0% 38%, ${C.accent} 38% 62%, ${C.error} 62% 82%, ${C.success} 82% 100%)`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 4px 16px rgba(44,62,67,0.12)' }}>
            <div style={{ width:88, height:88, borderRadius:'50%', background:C.surface, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
              <p style={{ fontSize:16, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>4</p>
              <p style={{ fontSize:9, color:C.muted }}>categories</p>
            </div>
          </div>
          <div style={{ flex:1, display:'flex', flexDirection:'column', gap:10 }}>
            {categories.map(ct=>(
              <div key={ct.l} style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:12, height:12, borderRadius:3, background:ct.c, flexShrink:0 }} />
                <p style={{ fontSize:13, flex:1, color:C.type }}>{ct.l}</p>
                <div style={{ width:80, height:6, borderRadius:99, background:C.bg, overflow:'hidden' }}>
                  <div style={{ width:`${ct.v}%`, height:'100%', background:ct.c, borderRadius:99 }} />
                </div>
                <p style={{ fontSize:12, fontWeight:700, color:C.type, width:32, textAlign:'right' as const }}>{ct.v}%</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// PAYMENT METHODS
// ──────────────────────────────────────────────────────────────────────────────
function PaymentMethods({ onBack }: { onBack:()=>void }) {
  const [cards, setCards] = useState(CARDS)
  const [showAdd, setShowAdd] = useState(false)

  return (
    <div style={{ padding:'24px 28px 60px', display:'flex', flexDirection:'column', gap:18 }}>
      <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, fontWeight:700, fontFamily:'Manrope,sans-serif', alignSelf:'flex-start' }}>{I.chevL} Dashboard</button>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Payment Methods</h2>
        <Btn label="Add New Card" variant="primary" icon={I.plus} small onClick={()=>setShowAdd(v=>!v)} />
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {cards.map(card=>(
          <Card key={card.id} style={{ padding:22 }}>
            <div style={{ display:'flex', gap:16, alignItems:'center', flexWrap:'wrap' }}>
              {/* Card visual */}
              <div style={{ width:120, height:76, borderRadius:14, background:`linear-gradient(135deg,${card.color},${card.color}BB)`, padding:'12px 14px', display:'flex', flexDirection:'column', justifyContent:'space-between', flexShrink:0, boxShadow:`0 6px 20px ${card.color}30` }}>
                <p style={{ fontSize:10, fontWeight:800, color:'rgba(255,255,255,0.8)', letterSpacing:'0.1em' }}>{card.brand.toUpperCase()}</p>
                <div>
                  <p style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.85)', letterSpacing:'0.12em' }}>•••• •••• •••• {card.last4}</p>
                  <p style={{ fontSize:9, color:'rgba(255,255,255,0.6)', marginTop:2 }}>{card.expiry}</p>
                </div>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', gap:7, alignItems:'center', marginBottom:4 }}>
                  <p style={{ fontSize:15, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{card.brand} •••• {card.last4}</p>
                  {card.isDefault && <Bdg label="Default" color={C.primary} />}
                </div>
                <p style={{ fontSize:12, color:C.muted, marginBottom:6 }}>{card.holder} · Expires {card.expiry}</p>
                <div style={{ display:'flex', gap:7 }}>
                  {!card.isDefault && <button onClick={()=>setCards(prev=>prev.map(c=>({...c,isDefault:c.id===card.id})))} style={{ padding:'5px 12px', borderRadius:7, border:`1px solid ${C.primary}30`, background:`${C.primary}06`, cursor:'pointer', fontSize:11, fontWeight:700, color:C.primary, fontFamily:'Manrope,sans-serif' }}>Set Default</button>}
                  <button style={{ padding:'5px 12px', borderRadius:7, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', fontSize:11, fontWeight:700, color:C.sub, fontFamily:'Manrope,sans-serif' }}>Edit</button>
                  <button onClick={()=>setCards(prev=>prev.filter(c=>c.id!==card.id))} style={{ padding:'5px 12px', borderRadius:7, border:`1px solid ${C.error}20`, background:`${C.error}06`, cursor:'pointer', fontSize:11, fontWeight:700, color:C.error, fontFamily:'Manrope,sans-serif' }}>Remove</button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {showAdd && (
        <Card style={{ padding:24 }}>
          <h3 style={{ fontSize:14, fontWeight:800, color:C.type, marginBottom:16, fontFamily:'Manrope,sans-serif' }}>Add New Card</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {[{l:'Card Number',ph:'1234 5678 9012 3456'},{l:'Cardholder Name',ph:'Mohamed Ihsan'},{l:'Expiry Date',ph:'MM / YY'},{l:'CVV',ph:'•••'}].map(f=>(
              <div key={f.l}>
                <p style={{ fontSize:12, fontWeight:700, color:C.muted, marginBottom:5 }}>{f.l}</p>
                <input placeholder={f.ph} style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, outline:'none', background:'#FAFAFA', boxSizing:'border-box' as const }} />
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:10, marginTop:16 }}>
            <Btn label="Cancel" variant="secondary" onClick={()=>setShowAdd(false)} />
            <Btn label="Save Card" variant="primary" icon={I.lock} />
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:12 }}>
            <span style={{ color:C.success, display:'flex' }}>{I.shield}</span>
            <p style={{ fontSize:11, color:C.muted }}>Your card is encrypted and secured by Stripe. We never store raw card numbers.</p>
          </div>
        </Card>
      )}
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// ROOT
// ──────────────────────────────────────────────────────────────────────────────
export default function PaymentsBilling() {
  const [view, setView] = useState<SubView>('dashboard')
  const [detailId, setDetailId] = useState('TXN-29841')

  const NAV: {key:SubView; label:string}[] = [
    {key:'dashboard', label:'Overview'},
    {key:'checkout',  label:'Pay Now'},
    {key:'history',   label:'Transactions'},
    {key:'invoices',  label:'Invoices'},
    {key:'wallet',    label:'Wallet'},
    {key:'methods',   label:'Cards'},
    {key:'analytics', label:'Analytics'},
    {key:'refunds',   label:'Refunds'},
    {key:'coupons',   label:'Coupons'},
  ]

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:C.bg, fontFamily:'Manrope,sans-serif' }}>
      {/* Header */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'0 28px', position:'sticky', top:0, zIndex:30 }}>
        <div style={{ padding:'12px 0 0' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:0 }}>
            <p style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:'uppercase', letterSpacing:'0.07em' }}>Payments & Billing</p>
            <div style={{ display:'flex', alignItems:'center', gap:4, marginLeft:'auto' }}>
              <span style={{ color:C.success, display:'flex' }}>{I.lock}</span>
              <p style={{ fontSize:11, fontWeight:700, color:C.success }}>Secured</p>
            </div>
          </div>
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
        {view==='checkout'  && <Checkout onBack={()=>setView('dashboard')} onSuccess={()=>setView('success')} onFailed={()=>setView('failed')} />}
        {view==='history'   && <TxnHistory onBack={()=>setView('dashboard')} onDetail={id=>{ setDetailId(id); setView('detail') }} />}
        {view==='detail'    && <TxnDetail id={detailId} onBack={()=>setView('history')} />}
        {view==='invoices'  && <InvoiceCenter onBack={()=>setView('dashboard')} />}
        {view==='wallet'    && <Wallet onBack={()=>setView('dashboard')} />}
        {view==='methods'   && <PaymentMethods onBack={()=>setView('dashboard')} />}
        {view==='analytics' && <Analytics onBack={()=>setView('dashboard')} />}
        {view==='refunds'   && <Refunds onBack={()=>setView('dashboard')} />}
        {view==='coupons'   && <CouponView onBack={()=>setView('dashboard')} />}
        {view==='success'   && <PaymentSuccess onBack={()=>setView('dashboard')} />}
        {view==='failed'    && <PaymentFailed onBack={()=>setView('checkout')} onRetry={()=>setView('checkout')} />}
      </div>
    </div>
  )
}
