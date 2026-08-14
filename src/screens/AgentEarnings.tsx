import { useState, type ReactNode, type CSSProperties } from 'react'

// ─── Brand ────────────────────────────────────────────────────────────────────
const C = {
  primary:'#00737A', accent:'#EE8153', type:'#2C3E43', sub:'#6B7E85',
  muted:'#9AAAB0', border:'#E4E8EA', bg:'#F2F4F5', surface:'#FFFFFF',
  success:'#22C55E', warning:'#F59E0B', error:'#EF4444', info:'#3B82F6',
}
const fmt = (n:number) => `LKR ${n.toLocaleString()}`

// ─── Icons ────────────────────────────────────────────────────────────────────
const I: Record<string,ReactNode> = {
  wallet:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="3" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M1 6h12" stroke="currentColor" strokeWidth="1.3"/><circle cx="10.5" cy="8.5" r="1" fill="currentColor"/></svg>,
  trending:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 10l3.5-3.5 3 3L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8.5 4H11v2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  download:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2v7M4 6.5L6.5 9 9 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M1.5 10.5h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  bank:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 5.5l5.5-4 5.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><rect x="2" y="5.5" width="9" height="5" stroke="currentColor" strokeWidth="1.3"/><path d="M1 10.5h11M4 5.5v5M7 5.5v5M10 5.5v5" stroke="currentColor" strokeWidth="1.1"/></svg>,
  gift:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="5" width="11" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M6.5 5V12M1 7.5h11" stroke="currentColor" strokeWidth="1.1"/><path d="M4.5 5C4.5 3.5 6.5 2.5 6.5 5M8.5 5C8.5 3.5 6.5 2.5 6.5 5" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/></svg>,
  target:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.3"/><circle cx="6.5" cy="6.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/><circle cx="6.5" cy="6.5" r="0.8" fill="currentColor"/></svg>,
  star:      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M6 1l1.5 3 3.3.5-2.4 2.3.6 3.3L6 8.8 3 10.1l.6-3.3L1.2 4.5l3.3-.5L6 1z"/></svg>,
  chevR:     <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  check:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 6.5l3 3.5 5-6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  refresh:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M11 6.5a4.5 4.5 0 1 1-1-2.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M11 3v2.5H8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  alert:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5L1 12h11L6.5 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M6.5 5.5v3M6.5 10v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  copy:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M1 9V2.5A1.5 1.5 0 0 1 2.5 1H9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  share:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="10.5" cy="2.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="2.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="10.5" cy="10.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 5.5l5-2.5M4 7.5l5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  edit:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M9.5 1.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  trash:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 3.5h9M5 3.5V2h3v1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M3.5 3.5l.5 7.5h5l.5-7.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  people:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5" cy="4" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M1 11c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="10" cy="4.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M12 11c0-1.66-1.34-3-3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
}

// ─── Primitives ───────────────────────────────────────────────────────────────
function Card({ children, style={}, hover=false, onClick }:{ children:ReactNode; style?:CSSProperties; hover?:boolean; onClick?:()=>void }) {
  const [h,setH] = useState(false)
  return (
    <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ background:C.surface, borderRadius:16, border:`1px solid ${h&&hover?C.primary+'40':C.border}`, boxShadow:h&&hover?'0 8px 28px rgba(44,62,67,0.11)':'0 1px 4px rgba(44,62,67,0.06)', transition:'all 0.18s', cursor:onClick?'pointer':undefined, ...style }}>
      {children}
    </div>
  )
}

function Btn({ label, icon, onClick, variant='primary', small=false, disabled=false, full=false }:{
  label:string; icon?:ReactNode; onClick?:()=>void
  variant?:'primary'|'secondary'|'ghost'|'danger'|'accent'|'success'
  small?:boolean; disabled?:boolean; full?:boolean
}) {
  const [h,setH] = useState(false)
  const vs: Record<string,CSSProperties> = {
    primary:   { background:disabled?'#C8D0D4':h?'#005D63':C.primary, color:'#fff', border:'none', boxShadow:disabled?'none':h?`0 4px 16px ${C.primary}50`:`0 2px 8px ${C.primary}30` },
    secondary: { background:h?'#EEF5F5':'#fff', color:C.primary, border:`1.5px solid ${h?C.primary:C.border}` },
    ghost:     { background:h?C.bg:'transparent', color:C.sub, border:'none' },
    danger:    { background:h?'#DC2626':C.error, color:'#fff', border:'none', boxShadow:`0 2px 8px ${C.error}30` },
    accent:    { background:h?'#D4663D':C.accent, color:'#fff', border:'none', boxShadow:`0 2px 8px ${C.accent}30` },
    success:   { background:h?'#16A34A':C.success, color:'#fff', border:'none', boxShadow:`0 2px 8px ${C.success}30` },
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

// ─── SVG Bar Chart ────────────────────────────────────────────────────────────
function BarChart({ data, color=C.primary, height=120 }:{ data:{label:string;value:number}[]; color?:string; height?:number }) {
  const max = Math.max(...data.map(d=>d.value), 1)
  const w = 560, pad = 32
  const bw = (w - pad*2) / data.length
  return (
    <svg viewBox={`0 0 ${w} ${height+32}`} style={{ width:'100%', overflow:'visible' }}>
      {data.map((d,i)=>{
        const bh = (d.value/max)*(height-8)
        const x = pad + i*bw + bw*0.15
        const bwActual = bw*0.7
        return (
          <g key={i}>
            <rect x={x} y={height-bh} width={bwActual} height={bh} rx={5} fill={`${color}30`}/>
            <rect x={x} y={height-bh} width={bwActual} height={Math.min(bh,6)} rx={5} fill={color} opacity={0.9}/>
            {bh>6&&<rect x={x} y={height-bh+4} width={bwActual} height={bh-6} fill={`${color}18`}/>}
            <text x={x+bwActual/2} y={height+20} textAnchor="middle" fontSize={9} fill={C.muted} fontFamily="Manrope,sans-serif">{d.label}</text>
          </g>
        )
      })}
    </svg>
  )
}

function LineChart({ data, color=C.primary, height=100 }:{ data:{label:string;value:number}[]; color?:string; height?:number }) {
  const max = Math.max(...data.map(d=>d.value), 1)
  const w = 560, pad = 28
  const step = (w-pad*2)/(data.length-1)
  const pts = data.map((d,i)=>({ x:pad+i*step, y:height-(d.value/max)*(height-12)+4 }))
  const pathD = pts.map((p,i)=>i===0?`M${p.x},${p.y}`:`L${p.x},${p.y}`).join(' ')
  const areaD = `${pathD} L${pts[pts.length-1].x},${height} L${pts[0].x},${height} Z`
  return (
    <svg viewBox={`0 0 ${w} ${height+28}`} style={{ width:'100%', overflow:'visible' }}>
      <defs>
        <linearGradient id={`lg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.01"/>
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#lg-${color.replace('#','')})`}/>
      <path d={pathD} stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p,i)=>(
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={3.5} fill={color} stroke="#fff" strokeWidth={1.5}/>
          <text x={p.x} y={height+22} textAnchor="middle" fontSize={9} fill={C.muted} fontFamily="Manrope,sans-serif">{data[i].label}</text>
        </g>
      ))}
    </svg>
  )
}

// ─── Progress Ring ────────────────────────────────────────────────────────────
function ProgressRing({ pct, color=C.primary, size=80, label='', sub='' }:{ pct:number; color?:string; size?:number; label?:string; sub?:string }) {
  const r = (size-10)/2, circ = 2*Math.PI*r
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} stroke={`${color}15`} strokeWidth={7} fill="none"/>
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={7} fill="none"
          strokeDasharray={`${circ*pct/100} ${circ*(1-pct/100)}`}
          strokeDashoffset={circ*0.25} strokeLinecap="round" style={{ transition:'stroke-dasharray 0.6s ease' }}/>
        <text x={size/2} y={size/2+5} textAnchor="middle" fontSize={13} fontWeight={900} fill={color} fontFamily="Manrope,sans-serif">{pct}%</text>
      </svg>
      {label&&<p style={{ fontSize:12, fontWeight:700, color:C.type, textAlign:'center' as const }}>{label}</p>}
      {sub&&<p style={{ fontSize:10, color:C.muted, textAlign:'center' as const }}>{sub}</p>}
    </div>
  )
}

// ─── Status config ────────────────────────────────────────────────────────────
const PAY_STATUS: Record<string,{color:string;label:string}> = {
  pending:    { color:C.warning, label:'Pending'    },
  processing: { color:C.info,    label:'Processing' },
  paid:       { color:C.success, label:'Paid'       },
  scheduled:  { color:C.primary, label:'Scheduled'  },
  failed:     { color:C.error,   label:'Failed'     },
  cancelled:  { color:C.muted,   label:'Cancelled'  },
  bonus:      { color:C.accent,  label:'Bonus Earned'},
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const TRANSACTIONS = [
  { id:'TXN-001', date:'20 Jan', service:'Hospital Appointment Assistance', client:'Mohamed Ihsan', base:6000, tips:500, bonus:0,  fee:480, net:6020, status:'paid',       method:'Bank Transfer' },
  { id:'TXN-002', date:'18 Jan', service:'Home Wellness Visit',             client:'Priya Fernando',base:7000, tips:0,   bonus:500, fee:560, net:6940, status:'paid',       method:'Bank Transfer' },
  { id:'TXN-003', date:'15 Jan', service:'Medication Collection',           client:'Arjuna W.',     base:3500, tips:200, bonus:0,  fee:280, net:3420, status:'paid',       method:'Bank Transfer' },
  { id:'TXN-004', date:'22 Jan', service:'Post-Surgery Care',               client:'Chamari D.',    base:9500, tips:0,   bonus:0,  fee:760, net:8740, status:'pending',    method:'—' },
  { id:'TXN-005', date:'26 Jan', service:'Physiotherapy Support',           client:'Nirosha J.',    base:4500, tips:0,   bonus:0,  fee:360, net:4140, status:'scheduled',  method:'—' },
  { id:'TXN-006', date:'12 Jan', service:'Night Care Assistance',           client:'Suresh P.',     base:12000,tips:1000,bonus:800,fee:960, net:12840,status:'paid',       method:'Bank Transfer' },
]

const WEEKLY = [
  {label:'Mon',value:8500},{label:'Tue',value:12000},{label:'Wed',value:0},{label:'Thu',value:9500},
  {label:'Fri',value:7000},{label:'Sat',value:3500},{label:'Sun',value:1500},
]
const MONTHLY = [
  {label:'Jan',value:168000},{label:'Feb',value:142000},{label:'Mar',value:155000},
  {label:'Apr',value:132000},{label:'May',value:178000},{label:'Jun',value:162000},
  {label:'Jul',value:195000},{label:'Aug',value:188000},{label:'Sep',value:172000},
  {label:'Oct',value:210000},{label:'Nov',value:198000},{label:'Dec',value:168000},
]

// ─── Earnings Dashboard ───────────────────────────────────────────────────────
function EarningsDashboard({ onNav, onToast }:{ onNav:(s:SubView)=>void; onToast:(m:string)=>void }) {
  const stats = [
    { l:"Today's Earnings",  v:8500,   color:C.primary,  trend:'+12%' },
    { l:'Weekly Earnings',   v:42000,  color:C.success,  trend:'+8%'  },
    { l:'Monthly Earnings',  v:168000, color:C.info,     trend:'+15%' },
    { l:'Annual Earnings',   v:1850000,color:C.accent,   trend:'+22%' },
  ]
  const quickActions = [
    {e:'💸', l:'Withdraw',      cb:()=>onNav('withdraw')},
    {e:'📊', l:'Analytics',     cb:()=>onNav('analytics')},
    {e:'🏦', l:'Bank Accounts', cb:()=>onNav('bankAccounts')},
    {e:'🎁', l:'Bonuses',       cb:()=>onNav('bonuses')},
    {e:'📋', l:'Reports',       cb:()=>onNav('reports')},
    {e:'🎯', l:'Goals',         cb:()=>onNav('goals')},
  ]
  return (
    <div style={{ padding:'24px 28px 60px' }}>
      {/* Hero wallet card */}
      <Card style={{ padding:'26px 28px', marginBottom:20, background:`linear-gradient(135deg,${C.primary},#005D63)`, border:'none', boxShadow:`0 10px 36px ${C.primary}35`, position:'relative' as const, overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-20%', right:'-4%', width:220, height:220, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }} />
        <div style={{ position:'absolute', bottom:'-30%', left:'10%', width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,0.04)' }} />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap' as const, gap:16 }}>
          <div>
            <p style={{ fontSize:12, color:'rgba(255,255,255,0.65)', marginBottom:4 }}>Wallet Balance · Kasun Perera</p>
            <p style={{ fontSize:38, fontWeight:900, color:'#fff', fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:8 }}>LKR 32,450</p>
            <div style={{ display:'flex', gap:16, flexWrap:'wrap' as const }}>
              {[{l:'Pending',v:'LKR 12,800'},{l:'Next Payout',v:'Friday 5 PM'},{l:'Completed',v:'LKR 1.85M'}].map((s,i)=>(
                <div key={i}>
                  <p style={{ fontSize:10, color:'rgba(255,255,255,0.55)', marginBottom:2 }}>{s.l}</p>
                  <p style={{ fontSize:14, fontWeight:700, color:'#fff', fontFamily:'Manrope,sans-serif' }}>{s.v}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <Btn label="Withdraw Funds" variant="secondary" icon={I.wallet} onClick={()=>onNav('withdraw')} />
            <Btn label="View Payouts" variant="ghost" small onClick={()=>onNav('payouts')} />
          </div>
        </div>
        {/* Balance bar */}
        <div style={{ marginTop:18 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
            <p style={{ fontSize:10, color:'rgba(255,255,255,0.6)' }}>Monthly goal: LKR 200,000</p>
            <p style={{ fontSize:10, color:'rgba(255,255,255,0.8)', fontWeight:700 }}>84%</p>
          </div>
          <div style={{ height:6, borderRadius:99, background:'rgba(255,255,255,0.15)' }}>
            <div style={{ width:'84%', height:'100%', background:'rgba(255,255,255,0.7)', borderRadius:99 }} />
          </div>
        </div>
      </Card>

      {/* KPI grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }} className="ew-4col">
        {stats.map((s,i)=>(
          <Card key={i} style={{ padding:20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
              <div style={{ width:38, height:38, borderRadius:12, background:`${s.color}12`, display:'flex', alignItems:'center', justifyContent:'center', color:s.color }}>
                <span style={{display:'flex'}}>{I.trending}</span>
              </div>
              <span style={{ fontSize:11, fontWeight:700, color:C.success, background:`${C.success}10`, padding:'2px 8px', borderRadius:99 }}>{s.trend}</span>
            </div>
            <p style={{ fontSize:11, color:C.muted, marginBottom:4 }}>{s.l}</p>
            <p style={{ fontSize:s.v>999999?18:22, fontWeight:900, color:s.color, fontFamily:'Manrope,sans-serif', lineHeight:1 }}>{fmt(s.v)}</p>
          </Card>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:18, marginBottom:18 }} className="ew-main-split">
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Weekly chart */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="This Week" action="Analytics" onAction={()=>onNav('analytics')} />
            <BarChart data={WEEKLY} color={C.primary} height={110} />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginTop:12 }}>
              {[{l:'Daily Avg',v:'LKR 6,000'},{l:'Best Day',v:'Tue LKR 12k'},{l:'Hours',v:'21 hrs'}].map((s,i)=>(
                <div key={i} style={{ textAlign:'center' as const, padding:'8px', borderRadius:10, background:C.bg }}>
                  <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{s.v}</p>
                  <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
                </div>
              ))}
            </div>
          </Card>
          {/* Recent transactions */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Recent Transactions" action="View All" onAction={()=>onNav('transactions')} />
            {TRANSACTIONS.slice(0,4).map(t=>(
              <div key={t.id} style={{ display:'flex', gap:12, alignItems:'center', padding:'10px 0', borderBottom:`1px solid ${C.border}` }}>
                <div style={{ width:38, height:38, borderRadius:12, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, flexShrink:0 }}>
                  {t.service.includes('Hospital')?'🏥':t.service.includes('Medication')?'💊':'🏠'}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:12, fontWeight:700, color:C.type, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as const }}>{t.service}</p>
                  <p style={{ fontSize:11, color:C.muted }}>{t.date} · {t.client}</p>
                </div>
                <div style={{ textAlign:'right' as const, flexShrink:0 }}>
                  <p style={{ fontSize:13, fontWeight:800, color:t.status==='paid'?C.success:C.warning, fontFamily:'Manrope,sans-serif' }}>{fmt(t.net)}</p>
                  <Bdg label={PAY_STATUS[t.status].label} color={PAY_STATUS[t.status].color} />
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Right */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Quick actions */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Quick Actions" />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
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
          {/* Payout info */}
          <Card style={{ padding:22, background:`linear-gradient(135deg,${C.success}08,${C.surface})`, border:`1.5px solid ${C.success}20` }}>
            <SectionTitle title="Next Payout" />
            <div style={{ textAlign:'center' as const, marginBottom:14 }}>
              <p style={{ fontSize:11, color:C.muted, marginBottom:4 }}>Scheduled for</p>
              <p style={{ fontSize:22, fontWeight:900, color:C.success, fontFamily:'Manrope,sans-serif', marginBottom:2 }}>Friday, 5:00 PM</p>
              <p style={{ fontSize:12, color:C.muted }}>3 days from now · Bank Transfer</p>
            </div>
            <div style={{ padding:'12px', borderRadius:12, background:`${C.success}08`, border:`1px solid ${C.success}20`, marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <p style={{ fontSize:12, color:C.sub }}>Scheduled amount</p>
                <p style={{ fontSize:14, fontWeight:900, color:C.success, fontFamily:'Manrope,sans-serif' }}>LKR 32,450</p>
              </div>
            </div>
            <Btn label="View Payout Center" variant="secondary" small full onClick={()=>onNav('payouts')} />
          </Card>
          {/* Pending */}
          <Card style={{ padding:22 }}>
            <SectionTitle title="Pending Review" />
            {TRANSACTIONS.filter(t=>t.status==='pending'||t.status==='scheduled').map(t=>(
              <div key={t.id} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:`1px solid ${C.border}` }}>
                <div>
                  <p style={{ fontSize:12, color:C.type, fontWeight:600 }}>{t.service.split(' ')[0]}</p>
                  <p style={{ fontSize:10, color:C.muted }}>{t.date}</p>
                </div>
                <div style={{ textAlign:'right' as const }}>
                  <p style={{ fontSize:13, fontWeight:700, color:C.warning, fontFamily:'Manrope,sans-serif' }}>{fmt(t.net)}</p>
                  <Bdg label={PAY_STATUS[t.status].label} color={PAY_STATUS[t.status].color} />
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}

// ─── Earnings Analytics ───────────────────────────────────────────────────────
function EarningsAnalytics() {
  const [period, setPeriod] = useState<'week'|'month'|'year'>('month')
  const chartData = period==='week'?WEEKLY:period==='year'?MONTHLY:[
    {label:'W1',value:42000},{label:'W2',value:38000},{label:'W3',value:51000},{label:'W4',value:37000},
  ]
  return (
    <div style={{ padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Earnings Analytics</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }} className="ew-4col">
        {[{l:'Avg Per Visit',v:'LKR 7,200',c:C.primary},{l:'Avg Hourly',v:'LKR 2,400',c:C.info},{l:'Best Month',v:'Oct — LKR 210k',c:C.success},{l:'YoY Growth',v:'+22%',c:C.accent}].map((s,i)=>(
          <Card key={i} style={{ padding:20, textAlign:'center' as const }}>
            <p style={{ fontSize:22, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{s.v}</p>
            <p style={{ fontSize:11, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      <Card style={{ padding:22, marginBottom:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
          <h3 style={{ fontSize:15, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Earnings Trend</h3>
          <div style={{ display:'flex', gap:4, border:`1px solid ${C.border}`, borderRadius:10, overflow:'hidden' }}>
            {(['week','month','year'] as const).map(p=>(
              <button key={p} onClick={()=>setPeriod(p)} style={{ padding:'6px 14px', border:'none', cursor:'pointer', background:period===p?C.primary:'#FAFAFA', color:period===p?'#fff':C.sub, fontFamily:'Manrope,sans-serif', fontSize:11, fontWeight:700, transition:'all 0.12s' }}>
                {p.charAt(0).toUpperCase()+p.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <LineChart data={chartData} color={C.primary} height={120} />
      </Card>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="ew-2col">
        <Card style={{ padding:22 }}>
          <SectionTitle title="By Service Type" />
          {[{l:'Hospital Appointment',pct:45,v:'LKR 75,600',c:C.primary},{l:'Home Wellness',pct:30,v:'LKR 50,400',c:C.info},{l:'Medication Collection',pct:15,v:'LKR 25,200',c:C.accent},{l:'Other',pct:10,v:'LKR 16,800',c:C.muted}].map((s,i)=>(
            <div key={i} style={{ marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                <p style={{ fontSize:12, color:C.type }}>{s.l}</p>
                <p style={{ fontSize:12, fontWeight:700, color:s.c }}>{s.v}</p>
              </div>
              <div style={{ height:6, borderRadius:99, background:`${s.c}15` }}>
                <div style={{ width:`${s.pct}%`, height:'100%', background:s.c, borderRadius:99 }} />
              </div>
            </div>
          ))}
        </Card>
        <Card style={{ padding:22 }}>
          <SectionTitle title="Time-of-Day Breakdown" />
          {[{l:'Morning (6–12)',pct:50,v:'LKR 84,000',c:C.primary},{l:'Afternoon (12–18)',pct:35,v:'LKR 58,800',c:C.warning},{l:'Evening (18–22)',pct:15,v:'LKR 25,200',c:C.muted}].map((s,i)=>(
            <div key={i} style={{ marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                <p style={{ fontSize:12, color:C.type }}>{s.l}</p>
                <p style={{ fontSize:12, fontWeight:700, color:s.c }}>{s.v}</p>
              </div>
              <div style={{ height:6, borderRadius:99, background:`${s.c}15` }}>
                <div style={{ width:`${s.pct}%`, height:'100%', background:s.c, borderRadius:99 }} />
              </div>
            </div>
          ))}
          <BarChart data={[{label:'6AM',value:14000},{label:'9AM',value:28000},{label:'12PM',value:22000},{label:'3PM',value:18000},{label:'6PM',value:10000}]} color={C.warning} height={80} />
        </Card>
      </div>
    </div>
  )
}

// ─── Job Earnings ─────────────────────────────────────────────────────────────
function JobEarnings({ onToast }:{ onToast:(m:string)=>void }) {
  return (
    <div style={{ padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Job Earnings</h2>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {TRANSACTIONS.map(t=>{
          const st = PAY_STATUS[t.status]
          return (
            <Card key={t.id} hover style={{ padding:22 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                  <div style={{ width:44, height:44, borderRadius:14, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
                    {t.service.includes('Hospital')?'🏥':t.service.includes('Medication')?'💊':'🏠'}
                  </div>
                  <div>
                    <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:3 }}>{t.service}</p>
                    <p style={{ fontSize:12, color:C.muted }}>{t.client} · {t.date}</p>
                    <div style={{ marginTop:5 }}><Bdg label={st.label} color={st.color} dot /></div>
                  </div>
                </div>
                <div style={{ textAlign:'right' as const }}>
                  <p style={{ fontSize:22, fontWeight:900, color:t.status==='paid'?C.success:C.warning, fontFamily:'Manrope,sans-serif', lineHeight:1 }}>{fmt(t.net)}</p>
                  <p style={{ fontSize:10, color:C.muted, marginTop:2 }}>Net Earnings</p>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10, paddingTop:14, borderTop:`1px solid ${C.border}` }} className="ew-5col">
                {[{l:'Base',v:fmt(t.base)},{l:'Tips',v:fmt(t.tips),c:t.tips>0?C.success:undefined},{l:'Bonus',v:fmt(t.bonus),c:t.bonus>0?C.accent:undefined},{l:'Platform Fee',v:`−${fmt(t.fee)}`,c:C.muted},{l:'Net',v:fmt(t.net),c:C.success}].map((s,i)=>(
                  <div key={i} style={{ textAlign:'center' as const, padding:'8px', borderRadius:10, background:i===4?`${C.success}06`:C.bg }}>
                    <p style={{ fontSize:11, fontWeight:700, color:(s as any).c??C.type }}>{s.v}</p>
                    <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:10, display:'flex', gap:8 }}>
                <Btn label="Download Receipt" variant="ghost" small icon={I.download} onClick={()=>onToast('Downloading…')} />
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// ─── Transaction History ──────────────────────────────────────────────────────
function TransactionHistory({ onToast }:{ onToast:(m:string)=>void }) {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<string>('all')
  const filtered = TRANSACTIONS.filter(t=>(filter==='all'||t.status===filter)&&(t.service.toLowerCase().includes(q.toLowerCase())||t.client.toLowerCase().includes(q.toLowerCase())))
  return (
    <div style={{ padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Transaction History</h2>
      {/* Search + filter */}
      <Card style={{ padding:18, marginBottom:18 }}>
        <div style={{ display:'flex', gap:12, alignItems:'center', flexWrap:'wrap' as const }}>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by service or client…"
            style={{ flex:1, minWidth:200, padding:'10px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:13, color:C.type, background:'#FAFAFA', outline:'none' }} />
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' as const }}>
            {['all',...Object.keys(PAY_STATUS)].map(f=>(
              <button key={f} onClick={()=>setFilter(f)}
                style={{ padding:'6px 14px', borderRadius:99, border:`1.5px solid ${filter===f?C.primary:C.border}`, background:filter===f?`${C.primary}08`:'#FAFAFA', cursor:'pointer', fontSize:11, fontWeight:700, color:filter===f?C.primary:C.muted, fontFamily:'Manrope,sans-serif', transition:'all 0.1s' }}>
                {f.charAt(0).toUpperCase()+f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {filtered.map(t=>{
          const st = PAY_STATUS[t.status]
          return (
            <Card key={t.id} hover style={{ padding:18 }}>
              <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                <div style={{ width:42, height:42, borderRadius:12, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
                  {t.service.includes('Hospital')?'🏥':t.service.includes('Medication')?'💊':'🏠'}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:2 }}>
                    <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{t.service}</p>
                    <Bdg label={st.label} color={st.color} />
                  </div>
                  <p style={{ fontSize:11, color:C.muted }}>{t.id} · {t.date} · {t.client} · {t.method}</p>
                </div>
                <div style={{ textAlign:'right' as const, flexShrink:0 }}>
                  <p style={{ fontSize:15, fontWeight:900, color:t.status==='paid'?C.success:C.warning, fontFamily:'Manrope,sans-serif' }}>{fmt(t.net)}</p>
                  {t.status==='paid'&&<button onClick={()=>onToast('Downloading receipt…')} style={{ color:C.muted, background:'none', border:'none', cursor:'pointer', display:'flex', marginLeft:'auto', marginTop:4 }}><span style={{display:'flex'}}>{I.download}</span></button>}
                </div>
              </div>
            </Card>
          )
        })}
        {filtered.length===0&&(
          <div style={{ textAlign:'center' as const, padding:'60px 0' }}>
            <p style={{ fontSize:32, marginBottom:12 }}>🔍</p>
            <p style={{ fontSize:14, fontWeight:700, color:C.type }}>No transactions found</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Transaction Details ──────────────────────────────────────────────────────
function TransactionDetails({ t, onBack, onToast }:{ t:typeof TRANSACTIONS[0]; onBack:()=>void; onToast:(m:string)=>void }) {
  const st = PAY_STATUS[t.status]
  return (
    <div style={{ maxWidth:680, margin:'0 auto', padding:'24px 28px 60px' }}>
      <button onClick={onBack} style={{ display:'flex', gap:5, alignItems:'center', background:'none', border:'none', cursor:'pointer', color:C.muted, fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:700, marginBottom:18, padding:0 }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Back
      </button>
      <Card style={{ padding:24, marginBottom:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
          <div>
            <Bdg label={st.label} color={st.color} dot />
            <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', margin:'8px 0 4px' }}>{t.service}</h2>
            <p style={{ fontSize:12, color:C.muted }}>{t.id} · {t.date} · {t.client}</p>
          </div>
          <p style={{ fontSize:28, fontWeight:900, color:t.status==='paid'?C.success:C.warning, fontFamily:'Manrope,sans-serif', lineHeight:1 }}>{fmt(t.net)}</p>
        </div>
        {/* Payment breakdown */}
        <div style={{ borderRadius:14, overflow:'hidden', border:`1px solid ${C.border}` }}>
          {[{l:'Base Service Fee',v:fmt(t.base),c:C.type},{l:'Tips',v:fmt(t.tips),c:C.success},{l:'Performance Bonus',v:fmt(t.bonus),c:C.accent},{l:'Platform Fee (8%)',v:`−${fmt(t.fee)}`,c:C.error},{l:'Taxes (Placeholder)',v:'—',c:C.muted},{l:'Net Income',v:fmt(t.net),c:C.success,bold:true}].map((r,i,arr)=>(
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'11px 16px', background:r.bold?`${C.success}06`:i%2===0?'#FAFAFA':C.surface, borderBottom:i<arr.length-1?`1px solid ${C.border}`:'none' }}>
              <p style={{ fontSize:12, color:C.sub, fontWeight:r.bold?700:400 }}>{r.l}</p>
              <p style={{ fontSize:12, fontWeight:r.bold?900:600, color:r.c, fontFamily:r.bold?'Manrope,sans-serif':undefined }}>{r.v}</p>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:8, marginTop:16 }}>
          <Btn label="Download Receipt" icon={I.download} onClick={()=>onToast('Generating receipt…')} />
          <Btn label="Download Invoice" variant="secondary" icon={I.download} onClick={()=>onToast('Generating invoice…')} />
        </div>
      </Card>
      {/* Timeline */}
      <Card style={{ padding:22 }}>
        <SectionTitle title="Payment Timeline" />
        {[{l:'Service Completed',t:'20 Jan, 12:30 PM',done:true},{l:'Payment Initiated',t:'20 Jan, 12:35 PM',done:true},{l:'Under Review',t:'20 Jan, 12:40 PM',done:t.status!=='pending'},{l:'Funds Released',t:'21 Jan, 9:00 AM',done:t.status==='paid'},{l:'Bank Transfer Sent',t:'21 Jan, 9:05 AM',done:t.status==='paid'}].map((ev,i,arr)=>(
          <div key={i} style={{ display:'flex', gap:12 }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
              <div style={{ width:22, height:22, borderRadius:'50%', background:ev.done?C.success:`${C.success}10`, border:`2px solid ${ev.done?C.success:C.border}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {ev.done&&<span style={{display:'flex',color:'#fff',transform:'scale(0.65)'}}>{I.check}</span>}
              </div>
              {i<arr.length-1&&<div style={{ width:2, flex:1, background:ev.done?`${C.success}40`:C.border, margin:'3px 0' }}/>}
            </div>
            <div style={{ paddingBottom:i<arr.length-1?12:0 }}>
              <p style={{ fontSize:12, fontWeight:600, color:ev.done?C.type:C.muted }}>{ev.l}</p>
              <p style={{ fontSize:10, color:C.muted }}>{ev.t}</p>
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── Payout Center ────────────────────────────────────────────────────────────
function PayoutCenter({ onNav, onToast }:{ onNav:(s:SubView)=>void; onToast:(m:string)=>void }) {
  const sections = [
    { l:'Available for Withdrawal',v:32450, c:C.success, e:'💰', status:'ready' },
    { l:'Pending Review',           v:9500,  c:C.warning, e:'⏳', status:'pending' },
    { l:'Scheduled Payout',         v:32450, c:C.primary, e:'📅', status:'scheduled' },
    { l:'Completed Payouts',        v:1850000,c:C.info,   e:'✅', status:'paid' },
    { l:'Failed Transfers',         v:0,     c:C.error,   e:'❌', status:'failed' },
  ]
  return (
    <div style={{ padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Payout Center</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:20 }} className="ew-3col">
        {sections.slice(0,3).map((s,i)=>(
          <Card key={i} hover style={{ padding:22, border:`1.5px solid ${s.c}20`, background:`${s.c}04` }}>
            <p style={{ fontSize:28, marginBottom:10 }}>{s.e}</p>
            <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:4 }}>{s.l}</p>
            <p style={{ fontSize:22, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1 }}>{fmt(s.v)}</p>
          </Card>
        ))}
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:20 }}>
        <Btn label="Withdraw Funds" icon={I.wallet} onClick={()=>onNav('withdraw')} />
        <Btn label="View History" variant="secondary" onClick={()=>onNav('transactions')} />
      </div>
      <Card style={{ padding:22, marginBottom:16 }}>
        <SectionTitle title="Completed Payouts" />
        {[
          {date:'15 Jan',amount:45000,ref:'PAY-0042',bank:'Peoples Bank ••4231',status:'paid'},
          {date:'8 Jan', amount:38500,ref:'PAY-0038',bank:'Peoples Bank ••4231',status:'paid'},
          {date:'1 Jan', amount:52000,ref:'PAY-0031',bank:'Peoples Bank ••4231',status:'paid'},
        ].map((p,i)=>(
          <div key={i} style={{ display:'flex', gap:12, alignItems:'center', padding:'12px 0', borderBottom:i<2?`1px solid ${C.border}`:'none' }}>
            <div style={{ width:38, height:38, borderRadius:12, background:`${C.success}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>💳</div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{fmt(p.amount)}</p>
              <p style={{ fontSize:11, color:C.muted }}>{p.ref} · {p.date} · {p.bank}</p>
            </div>
            <div style={{ display:'flex', gap:6, alignItems:'center' }}>
              <Bdg label="Paid" color={C.success} dot />
              <button onClick={()=>onToast('Downloading…')} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, display:'flex' }}><span style={{display:'flex'}}>{I.download}</span></button>
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── Withdraw Funds ───────────────────────────────────────────────────────────
function WithdrawFunds({ onToast, onNav }:{ onToast:(m:string)=>void; onNav:(s:SubView)=>void }) {
  const [step, setStep] = useState(1)
  const [amount, setAmount] = useState('32450')
  const [selectedBank, setSelectedBank] = useState(0)
  const banks = [{name:"People's Bank",branch:'Colombo 3 Branch',acc:'••••4231',verified:true},{name:'Sampath Bank',branch:'Fort Branch',acc:'••••8872',verified:true}]
  const numAmt = parseInt(amount)||0

  return (
    <div style={{ maxWidth:580, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:24 }}>Withdraw Funds</h2>
      {/* Stepper */}
      <div style={{ display:'flex', gap:0, marginBottom:28 }}>
        {['Amount','Bank','Review','Done'].map((l,i)=>{
          const done = step>i+1, active=step===i+1
          return (
            <div key={l} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', position:'relative' as const }}>
              {i>0&&<div style={{ position:'absolute', left:'-50%', right:'50%', top:17, height:3, background:done?C.primary:C.border, zIndex:0 }}/>}
              <div style={{ width:36, height:36, borderRadius:'50%', background:done?C.primary:active?`${C.primary}15`:C.bg, border:`2.5px solid ${done||active?C.primary:C.border}`, display:'flex', alignItems:'center', justifyContent:'center', zIndex:1 }}>
                {done?<span style={{display:'flex',color:'#fff',transform:'scale(0.8)'}}>{I.check}</span>:<p style={{ fontSize:12, fontWeight:800, color:active?C.primary:C.muted }}>{i+1}</p>}
              </div>
              <p style={{ fontSize:10, fontWeight:700, color:active?C.primary:C.muted, marginTop:6 }}>{l}</p>
            </div>
          )
        })}
      </div>

      {step===1&&(
        <Card style={{ padding:24 }}>
          <h3 style={{ fontSize:16, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:16 }}>Select Amount</h3>
          <div style={{ padding:'14px', borderRadius:12, background:`${C.success}08`, border:`1.5px solid ${C.success}20`, marginBottom:18 }}>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <p style={{ fontSize:12, color:C.sub }}>Available Balance</p>
              <p style={{ fontSize:16, fontWeight:900, color:C.success, fontFamily:'Manrope,sans-serif' }}>LKR 32,450</p>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
              <p style={{ fontSize:11, color:C.muted }}>Min: LKR 1,000</p>
              <p style={{ fontSize:11, color:C.muted }}>Max: LKR 32,450</p>
            </div>
          </div>
          <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:6 }}>Withdrawal Amount (LKR)</p>
          <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} min={1000} max={32450}
            style={{ width:'100%', padding:'14px', borderRadius:12, border:`2px solid ${C.primary}`, fontFamily:'Manrope,sans-serif', fontSize:22, fontWeight:900, color:C.primary, background:'#FAFAFA', outline:'none', boxSizing:'border-box' as const, marginBottom:12 }} />
          <div style={{ display:'flex', gap:8, marginBottom:18 }}>
            {[5000,10000,20000].map(v=>(
              <button key={v} onClick={()=>setAmount(String(v))} style={{ flex:1, padding:'8px', borderRadius:9, border:`1.5px solid ${C.border}`, background:amount===String(v)?`${C.primary}08`:'#FAFAFA', cursor:'pointer', fontSize:11, fontWeight:700, color:amount===String(v)?C.primary:C.sub, fontFamily:'Manrope,sans-serif' }}>
                {fmt(v)}
              </button>
            ))}
            <button onClick={()=>setAmount('32450')} style={{ flex:1, padding:'8px', borderRadius:9, border:`1.5px solid ${C.border}`, background:amount==='32450'?`${C.primary}08`:'#FAFAFA', cursor:'pointer', fontSize:11, fontWeight:700, color:amount==='32450'?C.primary:C.sub, fontFamily:'Manrope,sans-serif' }}>All</button>
          </div>
          <Btn label="Continue" full disabled={numAmt<1000||numAmt>32450} onClick={()=>setStep(2)} />
        </Card>
      )}

      {step===2&&(
        <Card style={{ padding:24 }}>
          <h3 style={{ fontSize:16, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:16 }}>Choose Bank Account</h3>
          {banks.map((b,i)=>(
            <button key={i} onClick={()=>setSelectedBank(i)}
              style={{ width:'100%', display:'flex', gap:12, alignItems:'center', padding:'16px', borderRadius:14, border:`2px solid ${selectedBank===i?C.primary:C.border}`, background:selectedBank===i?`${C.primary}06`:'#FAFAFA', cursor:'pointer', marginBottom:10, textAlign:'left' as const, transition:'all 0.12s' }}>
              <div style={{ width:44, height:44, borderRadius:14, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>🏦</div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:3 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{b.name}</p>
                  {b.verified&&<Bdg label="Verified" color={C.success} />}
                </div>
                <p style={{ fontSize:11, color:C.muted }}>{b.branch} · {b.acc}</p>
              </div>
              {selectedBank===i&&<span style={{ display:'flex', color:C.primary, transform:'scale(1.1)' }}>{I.check}</span>}
            </button>
          ))}
          <button onClick={()=>onToast('Opening add account form…')} style={{ width:'100%', padding:'14px', borderRadius:12, border:`2px dashed ${C.border}`, background:'transparent', cursor:'pointer', fontSize:12, fontWeight:700, color:C.muted, fontFamily:'Manrope,sans-serif', display:'flex', gap:8, alignItems:'center', justifyContent:'center' }}>
            <span style={{display:'flex'}}>{I.bank}</span>Add New Account
          </button>
          <div style={{ display:'flex', gap:8, marginTop:16 }}>
            <Btn label="Back" variant="ghost" small onClick={()=>setStep(1)} />
            <Btn label="Continue" full onClick={()=>setStep(3)} />
          </div>
        </Card>
      )}

      {step===3&&(
        <Card style={{ padding:24 }}>
          <h3 style={{ fontSize:16, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:16 }}>Review Withdrawal</h3>
          {[{l:'Amount',v:fmt(numAmt)},{l:'Bank Account',v:`${banks[selectedBank].name} ${banks[selectedBank].acc}`},{l:'Processing Time',v:'1–2 business days'},{l:'Transfer Fee',v:'LKR 0'},{l:'You receive',v:fmt(numAmt),bold:true},{l:'Expected Arrival',v:'Thursday, 23 Jan'}].map((r,i,arr)=>(
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:i<arr.length-1?`1px solid ${C.border}`:'none' }}>
              <p style={{ fontSize:12, color:C.sub }}>{r.l}</p>
              <p style={{ fontSize:12, fontWeight:(r as any).bold?900:600, color:(r as any).bold?C.success:C.type, fontFamily:(r as any).bold?'Manrope,sans-serif':undefined }}>{r.v}</p>
            </div>
          ))}
          <div style={{ display:'flex', gap:8, marginTop:18 }}>
            <Btn label="Back" variant="ghost" small onClick={()=>setStep(2)} />
            <Btn label="Confirm Withdrawal" variant="success" full onClick={()=>{ setStep(4); onToast('Withdrawal submitted successfully!') }} />
          </div>
        </Card>
      )}

      {step===4&&(
        <Card style={{ padding:32, textAlign:'center' as const }}>
          <div style={{ fontSize:64, marginBottom:16 }}>🎉</div>
          <h3 style={{ fontSize:22, fontWeight:900, color:C.success, fontFamily:'Manrope,sans-serif', marginBottom:6 }}>Withdrawal Submitted!</h3>
          <p style={{ fontSize:13, color:C.muted, marginBottom:20 }}>Reference: WDR-{Math.floor(Math.random()*90000)+10000}</p>
          {[{l:'Amount',v:fmt(numAmt)},{l:'Bank',v:`${banks[selectedBank].name} ${banks[selectedBank].acc}`},{l:'Estimated Arrival',v:'Thursday, 23 Jan 2025'}].map((r,i)=>(
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:`1px solid ${C.border}` }}>
              <p style={{ fontSize:12, color:C.muted }}>{r.l}</p>
              <p style={{ fontSize:12, fontWeight:600, color:C.type }}>{r.v}</p>
            </div>
          ))}
          <div style={{ display:'flex', gap:8, marginTop:20 }}>
            <Btn label="Back to Wallet" full onClick={()=>{ setStep(1); onNav('dashboard') }} />
          </div>
        </Card>
      )}
    </div>
  )
}

// ─── Bank Account Management ──────────────────────────────────────────────────
function BankAccounts({ onToast }:{ onToast:(m:string)=>void }) {
  const [accounts, setAccounts] = useState([
    {id:0,bank:"People's Bank",branch:'Colombo 3',acc:'••••4231',primary:true, verified:true},
    {id:1,bank:'Sampath Bank',branch:'Fort Branch',acc:'••••8872',primary:false,verified:true},
  ])
  return (
    <div style={{ maxWidth:680, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Bank Account Management</h2>
      {accounts.map(a=>(
        <Card key={a.id} style={{ padding:22, marginBottom:14, border:a.primary?`1.5px solid ${C.primary}30`:undefined, background:a.primary?`${C.primary}03`:C.surface }}>
          <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
            <div style={{ width:52, height:52, borderRadius:16, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>🏦</div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:4 }}>
                <p style={{ fontSize:14, fontWeight:800, color:C.type }}>{a.bank}</p>
                {a.primary&&<Bdg label="Primary" color={C.primary} />}
                {a.verified&&<Bdg label="Verified" color={C.success} />}
              </div>
              <p style={{ fontSize:12, color:C.muted, marginBottom:12 }}>{a.branch} · Account {a.acc}</p>
              <div style={{ display:'flex', gap:8 }}>
                <Btn label="Edit" variant="ghost" small icon={I.edit} onClick={()=>onToast('Opening edit…')} />
                {!a.primary&&<Btn label="Set Default" variant="secondary" small onClick={()=>{ setAccounts(s=>s.map(x=>({...x,primary:x.id===a.id}))); onToast('Primary account updated') }} />}
                {!a.primary&&<Btn label="Remove" variant="danger" small icon={I.trash} onClick={()=>{ setAccounts(s=>s.filter(x=>x.id!==a.id)); onToast('Account removed') }} />}
              </div>
            </div>
          </div>
        </Card>
      ))}
      <button onClick={()=>onToast('Opening add account form…')}
        style={{ width:'100%', padding:'18px', borderRadius:14, border:`2px dashed ${C.border}`, background:'transparent', cursor:'pointer', fontSize:13, fontWeight:700, color:C.muted, fontFamily:'Manrope,sans-serif', display:'flex', gap:8, alignItems:'center', justifyContent:'center' }}>
        <span style={{display:'flex'}}>{I.bank}</span>+ Add New Bank Account
      </button>
    </div>
  )
}

// ─── Bonuses & Incentives ─────────────────────────────────────────────────────
function BonusesIncentives({ onToast }:{ onToast:(m:string)=>void }) {
  const bonuses = [
    {e:'⭐',l:'Weekly Bonus',    sub:'Complete 10+ visits this week',      earned:true,  v:5000,  progress:80},
    {e:'🏆',l:'Monthly Bonus',   sub:'Top 10% agent this month',           earned:true,  v:15000, progress:100},
    {e:'⚡',l:'Peak Hour Bonus', sub:'Work 8–10 AM, 5–7 PM weekdays',      earned:false, v:2000,  progress:55},
    {e:'👥',l:'Referral Bonus',  sub:'Refer 3 new agents this month',       earned:false, v:10000, progress:33},
    {e:'📈',l:'Performance Bonus',sub:'Maintain 4.8+ rating for 30 days',  earned:true,  v:8000,  progress:100},
    {e:'🎯',l:'Milestone Reward',sub:'Complete 100 total visits',           earned:false, v:20000, progress:72},
  ]
  return (
    <div style={{ padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:8 }}>Bonuses & Incentives</h2>
      <p style={{ fontSize:13, color:C.muted, marginBottom:22 }}>Total earned this month: <strong style={{ color:C.accent }}>LKR 28,000</strong></p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }} className="ew-3col">
        {bonuses.map((b,i)=>(
          <Card key={i} hover style={{ padding:22, border:b.earned?`1.5px solid ${C.success}30`:undefined, background:b.earned?`${C.success}04`:C.surface }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
              <div style={{ width:48, height:48, borderRadius:16, background:b.earned?`${C.success}12`:`${C.accent}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>{b.e}</div>
              {b.earned&&<Bdg label="Earned" color={C.success} />}
            </div>
            <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:4 }}>{b.l}</p>
            <p style={{ fontSize:11, color:C.muted, lineHeight:1.5, marginBottom:10 }}>{b.sub}</p>
            <div style={{ height:5, borderRadius:99, background:`${b.earned?C.success:C.primary}15`, marginBottom:6 }}>
              <div style={{ width:`${b.progress}%`, height:'100%', background:b.earned?C.success:C.primary, borderRadius:99 }} />
            </div>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <p style={{ fontSize:11, fontWeight:700, color:b.earned?C.success:C.primary }}>{b.progress}%</p>
              <p style={{ fontSize:13, fontWeight:900, color:b.earned?C.success:C.type, fontFamily:'Manrope,sans-serif' }}>{fmt(b.v)}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Performance vs Earnings ──────────────────────────────────────────────────
function PerformanceEarnings() {
  const metrics = [
    {l:'Rating',             v:'4.9',  sub:'/ 5.0',  pct:98, c:C.success},
    {l:'Acceptance Rate',    v:'94%',  sub:'',        pct:94, c:C.primary},
    {l:'Completion Rate',    v:'98%',  sub:'',        pct:98, c:C.info},
    {l:'Response Time',      v:'4 min',sub:'avg',     pct:85, c:C.accent},
    {l:'Repeat Clients',     v:'67%',  sub:'',        pct:67, c:C.warning},
    {l:'Monthly Earnings',   v:'168k', sub:'LKR',     pct:84, c:C.success},
  ]
  return (
    <div style={{ padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Performance vs Earnings</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:20 }} className="ew-3col">
        {metrics.map((m,i)=>(
          <Card key={i} style={{ padding:22, textAlign:'center' as const }}>
            <ProgressRing pct={m.pct} color={m.c} size={80} label={m.l} sub={`${m.v}${m.sub?` ${m.sub}`:''}`} />
          </Card>
        ))}
      </div>
      <Card style={{ padding:22 }}>
        <SectionTitle title="How Performance Drives Earnings" />
        {[{l:'Higher rating → More repeat clients → Stable income',e:'⭐ → 👥 → 💰'},{l:'Fast response rate → More job offers → Higher weekly earnings',e:'⚡ → 📋 → 📈'},{l:'High acceptance → Bonuses → Milestone rewards',e:'✅ → 🎁 → 🏆'}].map((r,i)=>(
          <div key={i} style={{ display:'flex', gap:14, alignItems:'center', padding:'12px', borderRadius:12, background:C.bg, marginBottom:8 }}>
            <p style={{ fontSize:22 }}>{r.e}</p>
            <p style={{ fontSize:12, color:C.type }}>{r.l}</p>
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── Financial Reports ────────────────────────────────────────────────────────
function FinancialReports({ onToast }:{ onToast:(m:string)=>void }) {
  const reports = [
    {e:'📋', l:'Monthly Statement',  sub:'January 2025 · LKR 168,000 income'},
    {e:'📊', l:'Annual Summary',     sub:'2024 Full Year · LKR 1,850,000 total'},
    {e:'💰', l:'Income Report',      sub:'Q4 2024 Breakdown by service type'},
    {e:'🏥', l:'Service Breakdown',  sub:'Hospital, Medication, Wellness visits'},
  ]
  return (
    <div style={{ maxWidth:700, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Financial Reports</h2>
      {reports.map((r,i)=>(
        <Card key={i} hover style={{ padding:22, marginBottom:12 }}>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <div style={{ width:52, height:52, borderRadius:16, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0 }}>{r.e}</div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:14, fontWeight:700, color:C.type, marginBottom:3 }}>{r.l}</p>
              <p style={{ fontSize:12, color:C.muted }}>{r.sub}</p>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <Btn label="PDF" variant="secondary" small icon={I.download} onClick={()=>onToast('Generating PDF…')} />
              <Btn label="CSV" variant="ghost" small icon={I.download} onClick={()=>onToast('Exporting CSV…')} />
            </div>
          </div>
        </Card>
      ))}
      <Card style={{ padding:22, marginTop:8 }}>
        <SectionTitle title="January 2025 Quick Summary" />
        <BarChart data={MONTHLY.slice(0,6)} color={C.primary} height={100} />
      </Card>
    </div>
  )
}

// ─── Tax Center ───────────────────────────────────────────────────────────────
function TaxCenter({ onToast }:{ onToast:(m:string)=>void }) {
  return (
    <div style={{ maxWidth:700, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:8 }}>Tax Center</h2>
      <p style={{ fontSize:13, color:C.muted, marginBottom:22 }}>Future-ready. Consult a tax professional for Sri Lankan income tax guidance.</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:18 }} className="ew-2col">
        {[{l:'Annual Income',v:'LKR 1,850,000',c:C.type},{l:'Estimated Tax',v:'TBD',c:C.warning},{l:'Tax Year',v:'2024/2025',c:C.primary},{l:'Filing Status',v:'Self-employed',c:C.info}].map((s,i)=>(
          <Card key={i} style={{ padding:20, textAlign:'center' as const }}>
            <p style={{ fontSize:20, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:4 }}>{s.v}</p>
            <p style={{ fontSize:11, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      <Card style={{ padding:22 }}>
        <SectionTitle title="Income History" />
        <LineChart data={[{label:'Jul',value:195000},{label:'Aug',value:188000},{label:'Sep',value:172000},{label:'Oct',value:210000},{label:'Nov',value:198000},{label:'Dec',value:168000}]} color={C.primary} height={100} />
        <div style={{ marginTop:14 }}>
          <Btn label="Download Tax Report (Placeholder)" icon={I.download} variant="secondary" onClick={()=>onToast('Tax report generation coming soon')} />
        </div>
      </Card>
    </div>
  )
}

// ─── Referrals ────────────────────────────────────────────────────────────────
function Referrals({ onToast }:{ onToast:(m:string)=>void }) {
  const referrals = [
    {name:'Nimal Siripala',date:'15 Jan',status:'Active',reward:2000},
    {name:'Kumari Perera', date:'10 Jan',status:'Pending',reward:2000},
    {name:'Ravi Fernando',  date:'3 Jan', status:'Active',reward:2000},
  ]
  const link = 'readypal.lk/ref/kasun-perera'
  return (
    <div style={{ maxWidth:700, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Referral Program</h2>
      {/* Summary */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }} className="ew-4col">
        {[{e:'👥',l:'Invited',v:'3'},{e:'⏳',l:'Pending',v:'1',c:C.warning},{e:'✅',l:'Active',v:'2',c:C.success},{e:'💰',l:'Total Earned',v:'LKR 4,000',c:C.success}].map((s,i)=>(
          <Card key={i} style={{ padding:18, textAlign:'center' as const }}>
            <p style={{ fontSize:28, marginBottom:6 }}>{s.e}</p>
            <p style={{ fontSize:17, fontWeight:900, color:(s as any).c??C.type, fontFamily:'Manrope,sans-serif', lineHeight:1 }}>{s.v}</p>
            <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      {/* Link */}
      <Card style={{ padding:22, marginBottom:18 }}>
        <SectionTitle title="Your Referral Link" />
        <div style={{ display:'flex', gap:8, alignItems:'center', padding:'12px 16px', borderRadius:12, background:C.bg, border:`1.5px solid ${C.border}`, marginBottom:12 }}>
          <p style={{ flex:1, fontSize:12, fontWeight:700, color:C.primary, fontFamily:'Manrope,sans-serif' }}>{link}</p>
          <button onClick={()=>onToast('Link copied!')} style={{ display:'flex', gap:5, alignItems:'center', padding:'6px 12px', borderRadius:8, border:`1px solid ${C.border}`, background:'#fff', cursor:'pointer', fontSize:11, fontWeight:700, color:C.sub, fontFamily:'Manrope,sans-serif' }}>
            <span style={{display:'flex'}}>{I.copy}</span>Copy
          </button>
          <button onClick={()=>onToast('Sharing…')} style={{ display:'flex', gap:5, alignItems:'center', padding:'6px 12px', borderRadius:8, border:`1px solid ${C.border}`, background:'#fff', cursor:'pointer', fontSize:11, fontWeight:700, color:C.sub, fontFamily:'Manrope,sans-serif' }}>
            <span style={{display:'flex'}}>{I.share}</span>Share
          </button>
        </div>
        <p style={{ fontSize:11, color:C.muted }}>Earn LKR 2,000 for every new Care Agent you refer who completes their first job.</p>
      </Card>
      <Card style={{ padding:22 }}>
        <SectionTitle title="Invited Friends" />
        {referrals.map((r,i)=>(
          <div key={i} style={{ display:'flex', gap:10, alignItems:'center', padding:'10px 0', borderBottom:i<referrals.length-1?`1px solid ${C.border}`:'none' }}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:`${C.primary}15`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary, fontSize:12, fontWeight:900, flexShrink:0 }}>
              {r.name.split(' ').map(x=>x[0]).join('')}
            </div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{r.name}</p>
              <p style={{ fontSize:11, color:C.muted }}>Joined {r.date}</p>
            </div>
            <div style={{ display:'flex', gap:6, alignItems:'center' }}>
              <Bdg label={r.status} color={r.status==='Active'?C.success:C.warning} dot />
              <p style={{ fontSize:12, fontWeight:700, color:r.status==='Active'?C.success:C.muted }}>{r.status==='Active'?`+${fmt(r.reward)}`:'Pending'}</p>
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── Goals ────────────────────────────────────────────────────────────────────
function Goals({ onToast }:{ onToast:(m:string)=>void }) {
  const goals = [
    {l:'Daily',     target:12000, current:8500,  unit:'LKR', period:'Today',   c:C.primary},
    {l:'Weekly',    target:50000, current:42000, unit:'LKR', period:'This Week',c:C.success},
    {l:'Monthly',   target:200000,current:168000,unit:'LKR', period:'January', c:C.info},
    {l:'Yearly',    target:2500000,current:1850000,unit:'LKR',period:'2025',   c:C.accent},
    {l:'Visits',    target:10,    current:7,     unit:'visits',period:'This Week',c:C.warning},
    {l:'Rating',    target:5,     current:4.9,   unit:'stars', period:'All Time',c:C.error},
  ]
  return (
    <div style={{ padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Goals</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:20 }} className="ew-3col">
        {goals.map((g,i)=>{
          const pct = Math.min(Math.round((g.current/g.target)*100),100)
          return (
            <Card key={i} hover style={{ padding:22 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                <div>
                  <Bdg label={g.period} color={g.c} />
                  <p style={{ fontSize:16, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginTop:8 }}>{g.l} Goal</p>
                </div>
                <ProgressRing pct={pct} color={g.c} size={60} />
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <p style={{ fontSize:12, color:C.muted }}>Progress</p>
                <p style={{ fontSize:12, fontWeight:700, color:g.c }}>{g.unit==='LKR'?fmt(g.current):`${g.current} ${g.unit}`} / {g.unit==='LKR'?fmt(g.target):`${g.target} ${g.unit}`}</p>
              </div>
              <div style={{ height:6, borderRadius:99, background:`${g.c}15` }}>
                <div style={{ width:`${pct}%`, height:'100%', background:g.c, borderRadius:99 }} />
              </div>
            </Card>
          )
        })}
      </div>
      <Card style={{ padding:22 }}>
        <SectionTitle title="Milestones" action="Set New Goal" onAction={()=>onToast('Opening goal editor…')} />
        {[{e:'🏆',l:'100 Visits Completed',target:100,current:72,c:C.accent},{e:'⭐',l:'1,000 Days on Platform',target:1000,current:342,c:C.primary},{e:'💰',l:'Earned LKR 2,000,000',target:2000000,current:1850000,c:C.success}].map((m,i)=>(
          <div key={i} style={{ display:'flex', gap:12, alignItems:'center', padding:'12px 0', borderBottom:i<2?`1px solid ${C.border}`:'none' }}>
            <div style={{ width:44, height:44, borderRadius:14, background:`${m.c}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{m.e}</div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:12, fontWeight:700, color:C.type, marginBottom:5 }}>{m.l}</p>
              <div style={{ height:5, borderRadius:99, background:`${m.c}15` }}>
                <div style={{ width:`${Math.round((m.current/m.target)*100)}%`, height:'100%', background:m.c, borderRadius:99 }} />
              </div>
              <p style={{ fontSize:10, color:C.muted, marginTop:3 }}>{typeof m.current==='number'&&m.current>999?fmt(m.current).replace('LKR ',''):m.current} / {typeof m.target==='number'&&m.target>999?fmt(m.target).replace('LKR ',''):m.target}</p>
            </div>
            <p style={{ fontSize:13, fontWeight:800, color:m.c, fontFamily:'Manrope,sans-serif' }}>{Math.round((m.current/m.target)*100)}%</p>
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── Notifications ────────────────────────────────────────────────────────────
function EarningsNotifications() {
  const items = [
    {e:'💸', t:'Payout Sent',             b:'LKR 45,000 transferred to your Peoples Bank account.',  col:C.success, read:false},
    {e:'🎁', t:'Bonus Earned',            b:"You've earned the Monthly Top Agent bonus — LKR 15,000!", col:C.accent, read:false},
    {e:'🎯', t:'Goal Achieved',           b:'Weekly earnings goal reached! You hit LKR 42,000.',       col:C.primary, read:false},
    {e:'✅', t:'Withdrawal Approved',     b:'Your withdrawal of LKR 32,450 has been approved.',        col:C.success, read:true },
    {e:'🏦', t:'Bank Verification Done',  b:"People's Bank account ending ••4231 is now verified.",    col:C.info,   read:true },
    {e:'❌', t:'Payout Failed',           b:'Transfer failed for unknown reason. Please retry.',       col:C.error,  read:true },
  ]
  return (
    <div style={{ maxWidth:660, margin:'0 auto', padding:'24px 28px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
        <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Notifications</h2>
        <Bdg label={`${items.filter(n=>!n.read).length} new`} color={C.primary} dot />
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
        {items.map((n,i)=>(
          <Card key={i} style={{ padding:18, background:n.read?C.surface:`${n.col}04`, border:`1px solid ${n.read?C.border:n.col+'25'}` }}>
            <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
              <div style={{ width:42, height:42, borderRadius:12, background:`${n.col}12`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{n.e}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:3 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{n.t}</p>
                  {!n.read&&<div style={{ width:7, height:7, borderRadius:'50%', background:n.col }}/>}
                </div>
                <p style={{ fontSize:12, color:C.sub, lineHeight:1.5 }}>{n.b}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Status Badges ────────────────────────────────────────────────────────────
function StatusBadgesView() {
  return (
    <div style={{ maxWidth:700, margin:'0 auto', padding:'24px 28px 60px' }}>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:22 }}>Status Badges</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }} className="ew-4col">
        {(Object.entries(PAY_STATUS) as [string, {color:string;label:string}][]).map(([k,s])=>(
          <Card key={k} style={{ padding:22, textAlign:'center' as const }}>
            <div style={{ width:12, height:12, borderRadius:'50%', background:s.color, margin:'0 auto 10px' }} />
            <Bdg label={s.label} color={s.color} dot />
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Empty / Loading / Error / Success ────────────────────────────────────────
function EmptyStates() {
  return (
    <div style={{ padding:'28px 28px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:20 }}>Empty States</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        {[{e:'💰',t:'No Earnings',      d:"You haven't earned anything yet. Complete your first job to get started."},{e:'📋',t:'No Transactions',  d:'No transactions found for the selected period.'},{e:'🎁',t:'No Bonuses',       d:"You haven't earned any bonuses yet. Keep up the great work!"},{e:'💸',t:'No Withdrawals',   d:"You haven't made any withdrawals yet."},{e:'📊',t:'No Reports',       d:'No financial reports are available for this period.'}].map((s,i)=>(
          <Card key={i} style={{ padding:'38px 22px', textAlign:'center' as const }}>
            <div style={{ fontSize:48, marginBottom:14 }}>{s.e}</div>
            <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:8 }}>{s.t}</p>
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
        {['Loading Wallet','Loading Transactions','Loading Analytics','Loading Payouts'].map((l,i)=>(
          <Card key={i} style={{ padding:22 }}>
            <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:14 }}>{l}</p>
            <Shimmer h={80} /><div style={{height:10}}/>
            {[...Array(4)].map((_,j)=><div key={j} style={{marginBottom:9}}><Shimmer h={14} w={`${60+j*10}%`}/></div>)}
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
      {[{e:'💸',t:'Withdrawal Failed',         d:'Your withdrawal could not be processed. Please check your bank account details.',col:C.error},{e:'🏦',t:'Bank Verification Failed',  d:'We could not verify your bank account. Please re-enter your details.',           col:C.warning},{e:'❌',t:'Payment Error',             d:'A payment could not be completed. Please contact ReadyPal Support.',             col:C.error},{e:'📶',t:'Connection Lost',          d:'Unable to load your wallet data. Check your internet connection.',               col:C.muted}].map((er,i)=>(
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
  return (
    <div style={{ maxWidth:600, margin:'0 auto', padding:'28px 28px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:20 }}>Success States</h2>
      {[{e:'💸',t:'Withdrawal Submitted',  d:'LKR 32,450 is on its way to your Peoples Bank account.',    col:C.success},{e:'🏦',t:'Bank Account Added',    d:"People's Bank account ••4231 has been verified and added.",  col:C.primary},{e:'🎁',t:'Bonus Earned',         d:"You've unlocked the Monthly Top Agent bonus — LKR 15,000!", col:C.accent},{e:'✅',t:'Payout Completed',     d:'LKR 45,000 deposited to your bank account on 15 Jan.',      col:C.success}].map((s,i)=>(
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

// ─── Sub-view type ────────────────────────────────────────────────────────────
type SubView = 'dashboard'|'analytics'|'jobEarnings'|'transactions'|'txnDetail'|'payouts'|'withdraw'|'bankAccounts'|'bonuses'|'performance'|'reports'|'tax'|'referrals'|'goals'|'notifications'|'statusBadges'|'empty'|'loading'|'error'|'success'

const NAV: { k:SubView; l:string; icon:ReactNode; group:string }[] = [
  { k:'dashboard',   l:'Earnings Overview',  icon:I.wallet,   group:'Earnings'    },
  { k:'analytics',   l:'Analytics',          icon:I.trending, group:'Earnings'    },
  { k:'jobEarnings', l:'Job Earnings',        icon:I.star,     group:'Earnings'    },
  { k:'transactions',l:'Transactions',        icon:I.download, group:'Earnings'    },
  { k:'payouts',     l:'Payout Center',       icon:I.bank,     group:'Payouts'     },
  { k:'withdraw',    l:'Withdraw Funds',      icon:I.wallet,   group:'Payouts'     },
  { k:'bankAccounts',l:'Bank Accounts',       icon:I.bank,     group:'Payouts'     },
  { k:'bonuses',     l:'Bonuses',             icon:I.gift,     group:'Incentives'  },
  { k:'performance', l:'Performance',         icon:I.star,     group:'Incentives'  },
  { k:'goals',       l:'Goals',               icon:I.target,   group:'Incentives'  },
  { k:'referrals',   l:'Referrals',           icon:I.people,   group:'Incentives'  },
  { k:'reports',     l:'Financial Reports',   icon:I.download, group:'Reports'     },
  { k:'tax',         l:'Tax Center',          icon:I.alert,    group:'Reports'     },
  { k:'notifications',l:'Notifications',      icon:I.alert,    group:'Reports'     },
  { k:'statusBadges',l:'Status Badges',       icon:I.check,    group:'Dev'         },
  { k:'empty',       l:'Empty States',        icon:I.alert,    group:'Dev'         },
  { k:'loading',     l:'Loading States',      icon:I.refresh,  group:'Dev'         },
  { k:'error',       l:'Error States',        icon:I.alert,    group:'Dev'         },
  { k:'success',     l:'Success States',      icon:I.check,    group:'Dev'         },
]

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function AgentEarnings() {
  const [sub, setSub] = useState<SubView>('dashboard')
  const [selectedTxn, setSelectedTxn] = useState<typeof TRANSACTIONS[0]|null>(null)
  const [toast, setToast] = useState<string|null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const showToast = (m:string) => { setToast(m); setTimeout(()=>setToast(null),2800) }
  const groups = [...new Set(NAV.map(n=>n.group))]

  const renderMain = () => {
    if (sub==='txnDetail'&&selectedTxn) {
      return <TransactionDetails t={selectedTxn} onBack={()=>setSub('transactions')} onToast={showToast} />
    }
    switch(sub) {
      case 'dashboard':    return <EarningsDashboard onNav={setSub} onToast={showToast} />
      case 'analytics':    return <EarningsAnalytics />
      case 'jobEarnings':  return <JobEarnings onToast={showToast} />
      case 'transactions': return <TransactionHistory onToast={t=>{ if(t==='view') { setSelectedTxn(TRANSACTIONS[0]); setSub('txnDetail') } else showToast(t) }} />
      case 'payouts':      return <PayoutCenter onNav={setSub} onToast={showToast} />
      case 'withdraw':     return <WithdrawFunds onToast={showToast} onNav={setSub} />
      case 'bankAccounts': return <BankAccounts onToast={showToast} />
      case 'bonuses':      return <BonusesIncentives onToast={showToast} />
      case 'performance':  return <PerformanceEarnings />
      case 'reports':      return <FinancialReports onToast={showToast} />
      case 'tax':          return <TaxCenter onToast={showToast} />
      case 'referrals':    return <Referrals onToast={showToast} />
      case 'goals':        return <Goals onToast={showToast} />
      case 'notifications':return <EarningsNotifications />
      case 'statusBadges': return <StatusBadgesView />
      case 'empty':        return <EmptyStates />
      case 'loading':      return <LoadingStates />
      case 'error':        return <ErrorStates onToast={showToast} />
      case 'success':      return <SuccessStates onToast={showToast} />
      default: return null
    }
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:C.bg, fontFamily:'Manrope,sans-serif' }}>
      {/* Sidebar */}
      <div className="ew-sidebar" style={{ width:218, background:C.surface, borderRight:`1px solid ${C.border}`, display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh', overflowY:'auto', flexShrink:0 }}>
        <div style={{ padding:'16px 18px 14px', borderBottom:`1px solid ${C.border}` }}>
          <p style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.08em', marginBottom:4 }}>Earnings & Wallet</p>
          <p style={{ fontSize:20, fontWeight:900, color:C.success, fontFamily:'Manrope,sans-serif' }}>LKR 32,450</p>
          <p style={{ fontSize:11, color:C.muted }}>Available balance</p>
        </div>
        {groups.map(group=>(
          <div key={group}>
            <p style={{ fontSize:9, fontWeight:800, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.09em', padding:'10px 18px 4px' }}>{group}</p>
            {NAV.filter(n=>n.group===group).map(n=>{
              const active = (sub===n.k)||(sub==='txnDetail'&&n.k==='transactions')
              return (
                <button key={n.k} onClick={()=>{ setSub(n.k); setSidebarOpen(false) }}
                  style={{ width:'100%', display:'flex', gap:9, alignItems:'center', padding:'9px 18px', border:'none', background:active?`${C.primary}08`:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:active?700:500, color:active?C.primary:C.type, textAlign:'left' as const, borderLeft:active?`3px solid ${C.primary}`:'3px solid transparent', transition:'all 0.12s' }}>
                  <span style={{ display:'flex', color:active?C.primary:C.muted }}>{n.icon}</span>
                  {n.l}
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
            <div style={{ padding:'16px 18px', borderBottom:`1px solid ${C.border}` }}>
              <p style={{ fontSize:13, fontWeight:800, color:C.type }}>Earnings & Wallet</p>
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
      <div className="ew-mobile-nav" style={{ display:'none', position:'fixed', top:0, left:0, right:0, zIndex:40, background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'12px 18px', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <p style={{ fontSize:13, fontWeight:800, color:C.type }}>{NAV.find(n=>n.k===sub)?.l??'Earnings'}</p>
          <p style={{ fontSize:11, fontWeight:700, color:C.success }}>LKR 32,450</p>
        </div>
        <button onClick={()=>setSidebarOpen(v=>!v)} style={{ background:'none', border:'none', cursor:'pointer', color:C.type, fontSize:12, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>Menu</button>
      </div>

      {/* Main */}
      <div style={{ flex:1, overflowY:'auto' }} className="ew-main">
        {renderMain()}
      </div>

      {toast&&<Toast msg={toast} />}
    </div>
  )
}
