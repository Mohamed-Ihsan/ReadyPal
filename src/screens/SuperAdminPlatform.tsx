import { useState, type ReactNode, type CSSProperties } from 'react'

const C = {
  primary:'#00737A', accent:'#EE8153', type:'#2C3E43', sub:'#6B7E85',
  muted:'#9AAAB0', border:'#E4E8EA', bg:'#F2F4F5', surface:'#FFFFFF',
  success:'#22C55E', warning:'#F59E0B', error:'#EF4444', info:'#3B82F6',
  dark:'#1A2A30', darkSub:'rgba(255,255,255,0.08)', purple:'#7C3AED',
}

// ─── Status maps ──────────────────────────────────────────────────────────────
const SBADGES: Record<string,{color:string;label:string}> = {
  healthy:     {color:C.success,  label:'Healthy'     },
  warning:     {color:C.warning,  label:'Warning'     },
  critical:    {color:C.error,    label:'Critical'    },
  online:      {color:C.success,  label:'Online'      },
  offline:     {color:C.error,    label:'Offline'     },
  enabled:     {color:C.success,  label:'Enabled'     },
  disabled:    {color:C.muted,    label:'Disabled'    },
  beta:        {color:C.accent,   label:'Beta'        },
  stable:      {color:C.primary,  label:'Stable'      },
  maintenance: {color:C.warning,  label:'Maintenance' },
}

// ─── Module-level data ────────────────────────────────────────────────────────
const DASH_KPIS = [
  { l:'Active Users',      v:'3,542',     c:C.primary,  sub:'287 new this month'    },
  { l:'Care Agents',       v:'684',       c:C.success,  sub:'12 pending approval'   },
  { l:'Monthly Revenue',   v:'LKR 12.4M', c:C.accent,   sub:'+18% vs last month'    },
  { l:'System Uptime',     v:'99.98%',    c:C.success,  sub:'Last 30 days'          },
  { l:'API Requests Today',v:'1.48M',     c:C.primary,  sub:'Avg 61k/hr'            },
  { l:'Storage Used',      v:'2.4 TB',    c:C.warning,  sub:'of 5 TB provisioned'   },
  { l:'AI Conversations',  v:'12,870',    c:C.purple,   sub:'Today'                 },
  { l:'Security Score',    v:'94/100',    c:C.success,  sub:'2 recommendations'     },
]

const SERVICES = [
  { name:'API Gateway',     status:'healthy',  latency:'18ms',  uptime:'99.99%' },
  { name:'Auth Service',    status:'healthy',  latency:'12ms',  uptime:'100%'   },
  { name:'Database Primary',status:'healthy',  latency:'4ms',   uptime:'99.99%' },
  { name:'Database Replica',status:'healthy',  latency:'5ms',   uptime:'99.98%' },
  { name:'Cache (Redis)',   status:'healthy',  latency:'1ms',   uptime:'100%'   },
  { name:'File Storage',    status:'healthy',  latency:'38ms',  uptime:'99.97%' },
  { name:'Email Gateway',   status:'warning',  latency:'142ms', uptime:'99.82%' },
  { name:'SMS Gateway',     status:'healthy',  latency:'64ms',  uptime:'99.90%' },
  { name:'AI Service',      status:'healthy',  latency:'420ms', uptime:'99.95%' },
  { name:'Push Notifications',status:'healthy',latency:'22ms',  uptime:'99.99%' },
]

const FEATURE_FLAGS = [
  { name:'AI Assistant',          cat:'AI',        env:'Production', status:'enabled',  rollout:100, targets:'All Users',   deps:'OpenAI API'         },
  { name:'Instant Booking',       cat:'Bookings',  env:'Production', status:'enabled',  rollout:100, targets:'All Clients', deps:'Payments'           },
  { name:'Voice Care Notes',      cat:'AI',        env:'Staging',    status:'beta',     rollout:20,  targets:'Agents',      deps:'AI Assistant'       },
  { name:'Video Consultation',    cat:'Care',      env:'Development',status:'disabled', rollout:0,   targets:'Premium',     deps:'Twilio'             },
  { name:'Predictive Matching',   cat:'AI',        env:'Staging',    status:'beta',     rollout:50,  targets:'All',         deps:'AI Assistant'       },
  { name:'Smart Invoicing',       cat:'Finance',   env:'Production', status:'enabled',  rollout:100, targets:'All',         deps:'Finance Module'     },
  { name:'WhatsApp Integration',  cat:'Comms',     env:'Development',status:'disabled', rollout:0,   targets:'All',         deps:'Twilio'             },
]

const CMS_PAGES = [
  { title:'Home',             slug:'/',                status:'published', updated:'22 Jan 2026', author:'Admin' },
  { title:'About ReadyPal',   slug:'/about',           status:'published', updated:'18 Jan 2026', author:'Admin' },
  { title:'How It Works',     slug:'/how-it-works',    status:'published', updated:'15 Jan 2026', author:'Admin' },
  { title:'Pricing',          slug:'/pricing',         status:'published', updated:'20 Jan 2026', author:'Admin' },
  { title:'For Care Agents',  slug:'/for-agents',      status:'published', updated:'12 Jan 2026', author:'Admin' },
  { title:'Privacy Policy',   slug:'/privacy',         status:'published', updated:'01 Jan 2026', author:'Legal' },
  { title:'Terms of Service', slug:'/terms',           status:'published', updated:'01 Jan 2026', author:'Legal' },
  { title:'Cookie Policy',    slug:'/cookies',         status:'published', updated:'01 Jan 2026', author:'Legal' },
  { title:'Jan Newsletter',   slug:'/blog/jan-2026',   status:'draft',     updated:'21 Jan 2026', author:'Content' },
]

const BLOG_POSTS = [
  { title:'5 Signs Your Elderly Parent Needs Professional Care', cat:'Care Guide', author:'Admin', status:'published', views:1842, date:'15 Jan 2026' },
  { title:'How ReadyPal Screens Care Agents',                   cat:'Trust',      author:'Admin', status:'published', views:1124, date:'10 Jan 2026' },
  { title:'Understanding Dementia Care at Home',                cat:'Care Guide', author:'Admin', status:'published', views:987,  date:'05 Jan 2026' },
  { title:'Care Agent Tips for Hospital Visits',               cat:'Agent Tips', author:'Kasun P.',status:'published',views:632,  date:'01 Jan 2026' },
  { title:'February Feature Updates',                          cat:'Updates',    author:'Admin', status:'draft',     views:0,    date:'22 Jan 2026' },
]

const AI_MODELS = [
  { name:'Claude claude-sonnet-5', provider:'Anthropic', purpose:'Primary Assistant',   status:'active',  tokens:8420000, cost:'LKR 24,180' },
  { name:'Claude Haiku 4.5',  provider:'Anthropic', purpose:'Quick Replies',       status:'active',  tokens:3200000, cost:'LKR 3,840'  },
  { name:'GPT-4o',            provider:'OpenAI',    purpose:'Fallback',            status:'standby', tokens:184000,  cost:'LKR 2,208'  },
  { name:'text-embedding-3',  provider:'OpenAI',    purpose:'Search Embeddings',   status:'active',  tokens:12400000,cost:'LKR 1,488'  },
]

const INTEGRATIONS_DATA = [
  { name:'Stripe',        type:'Payments',   status:'connected', version:'v3',  health:'healthy',  lastCall:'2 min ago' },
  { name:'Twilio',        type:'SMS/Voice',  status:'connected', version:'v2',  health:'healthy',  lastCall:'4 min ago' },
  { name:'Firebase',      type:'Push/Auth',  status:'connected', version:'v9',  health:'healthy',  lastCall:'1 min ago' },
  { name:'Google Maps',   type:'Geo',        status:'connected', version:'v3',  health:'healthy',  lastCall:'12 min ago'},
  { name:'OpenAI',        type:'AI',         status:'connected', version:'v1',  health:'healthy',  lastCall:'1 min ago' },
  { name:'Mailgun',       type:'Email',      status:'connected', version:'v4',  health:'warning',  lastCall:'18 min ago'},
  { name:'WhatsApp',      type:'Messaging',  status:'pending',   version:'-',   health:'offline',  lastCall:'Never'     },
  { name:'Segment',       type:'Analytics',  status:'connected', version:'v2',  health:'healthy',  lastCall:'5 min ago' },
]

const AUDIT_LOGS = [
  { action:'Feature flag "AI Assistant" updated',       admin:'Nirosha J.',   cat:'Config',   time:'22 Jan 14:30', ip:'10.0.0.42', risk:'low'  },
  { action:'Super admin role granted to Amara S.',      admin:'Nirosha J.',   cat:'Access',   time:'22 Jan 13:15', ip:'10.0.0.42', risk:'high' },
  { action:'Backup initiated manually',                  admin:'System',       cat:'Backup',   time:'22 Jan 02:00', ip:'internal',  risk:'low'  },
  { action:'Email gateway configuration changed',        admin:'Ranjith B.',   cat:'Config',   time:'21 Jan 16:40', ip:'10.0.0.18', risk:'med'  },
  { action:'Stripe API key rotated',                     admin:'Thilina S.',   cat:'Security', time:'21 Jan 11:00', ip:'10.0.0.55', risk:'high' },
  { action:'Maintenance mode enabled on staging',        admin:'Amara S.',     cat:'Deploy',   time:'20 Jan 09:30', ip:'10.0.0.12', risk:'med'  },
]

const BACKUP_DATA = [
  { label:'Full Backup',       time:'22 Jan 02:00', size:'842 GB', status:'success', duration:'48 min', location:'S3 ap-south-1'   },
  { label:'Incremental',       time:'22 Jan 14:00', size:'12 GB',  status:'success', duration:'4 min',  location:'S3 ap-south-1'   },
  { label:'Database Snapshot', time:'22 Jan 06:00', size:'284 GB', status:'success', duration:'22 min', location:'S3 ap-southeast-1'},
  { label:'Full Backup',       time:'21 Jan 02:00', size:'838 GB', status:'success', duration:'47 min', location:'S3 ap-south-1'   },
  { label:'Database Snapshot', time:'21 Jan 06:00', size:'280 GB', status:'success', duration:'21 min', location:'S3 ap-southeast-1'},
]

const RELEASES = [
  { version:'v2.8.1', env:'Production', date:'20 Jan 2026', author:'DevOps', status:'stable',  notes:'Hotfix: SLA calculation edge case' },
  { version:'v2.8.0', env:'Production', date:'15 Jan 2026', author:'DevOps', status:'stable',  notes:'AI chat improvements, Finance module v2' },
  { version:'v2.9.0-rc', env:'Staging', date:'22 Jan 2026', author:'DevOps', status:'beta',    notes:'Super Admin module, performance optimizations' },
  { version:'v2.7.4', env:'Production', date:'01 Jan 2026', author:'DevOps', status:'stable',  notes:'Security patches, dependency updates' },
]

const BRAND_ASSETS = [
  {l:'Light Logo',    sz:'SVG / PNG',  note:'Used on white backgrounds',       preview:'RP'},
  {l:'Dark Logo',     sz:'SVG / PNG',  note:'Used on dark backgrounds',        preview:'RP'},
  {l:'Favicon',       sz:'ICO / PNG',  note:'Browser tab icon (16×16, 32×32)', preview:'R'},
  {l:'App Icon',      sz:'PNG 1024px', note:'iOS and Android app icon',        preview:'RP'},
  {l:'Splash Screen', sz:'PNG',        note:'App loading screen',              preview:'ReadyPal'},
  {l:'Email Header',  sz:'PNG',        note:'Used in transactional emails',    preview:'RP'},
  {l:'PDF Branding',  sz:'PNG',        note:'Report headers and footers',      preview:'RP'},
  {l:'Invoice Logo',  sz:'PNG',        note:'Payment invoice logo',            preview:'RP'},
]

const MEDIA_FOLDERS = ['Brand Assets','Blog Images','Care Guides','Care Agents','Clients','Documents','Videos']

const MEDIA_ASSETS = [
  {n:'hero-banner.jpg',t:'Image',sz:'284 KB',d:'22 Jan 2026'},
  {n:'about-team.jpg',t:'Image',sz:'192 KB',d:'18 Jan 2026'},
  {n:'care-guide-v3.pdf',t:'PDF',sz:'1.2 MB',d:'15 Jan 2026'},
  {n:'rp-logo-light.svg',t:'SVG',sz:'8 KB',d:'01 Jan 2026'},
  {n:'promo-video.mp4',t:'Video',sz:'48 MB',d:'10 Jan 2026'},
  {n:'care-icon-set.zip',t:'Archive',sz:'384 KB',d:'05 Jan 2026'},
]

const FAQ_DATA = [
  {q:'How are care agents screened?',       cat:'Trust',     views:1284, status:'published'},
  {q:'What payment methods are accepted?',  cat:'Payments',  views:842,  status:'published'},
  {q:'Can I cancel a booking?',             cat:'Bookings',  views:634,  status:'published'},
  {q:'How do I add a beneficiary?',         cat:'Account',   views:521,  status:'published'},
  {q:'What is the refund policy?',          cat:'Payments',  views:418,  status:'published'},
  {q:'How do I contact support?',           cat:'Support',   views:312,  status:'published'},
]

const I18N_LANGS = [
  {l:'English', code:'en', total:842, translated:842, pct:100, status:'complete'    },
  {l:'Sinhala', code:'si', total:842, translated:710, pct:84,  status:'in-progress' },
  {l:'Tamil',   code:'ta', total:842, translated:482, pct:57,  status:'in-progress' },
]

const PROMPT_LIST = [
  {cat:'System',    name:'Main Assistant Prompt',  v:'v4.2', status:'active', modified:'20 Jan 2026'},
  {cat:'System',    name:'Booking Confirmation',   v:'v2.1', status:'active', modified:'15 Jan 2026'},
  {cat:'Assistant', name:'Agent Recommendation',   v:'v3.0', status:'active', modified:'10 Jan 2026'},
  {cat:'Assistant', name:'Complaint Handling',     v:'v1.8', status:'active', modified:'05 Jan 2026'},
  {cat:'System',    name:'Emergency Escalation',   v:'v1.2', status:'draft',  modified:'22 Jan 2026'},
]

const SYS_HEALTH_METRICS = [
  {l:'CPU Usage',     v:72, c:'#F59E0B', unit:'%', detail:'8 cores — peak 78%'},
  {l:'Memory',        v:68, c:'#22C55E', unit:'%', detail:'12.4 GB of 18 GB'  },
  {l:'Disk I/O',      v:34, c:'#22C55E', unit:'%', detail:'Avg 340 MB/s'      },
  {l:'Network In',    v:52, c:'#00737A', unit:'%', detail:'4.2 Gbps of 8 Gbps'},
  {l:'Network Out',   v:38, c:'#22C55E', unit:'%', detail:'3.0 Gbps of 8 Gbps'},
  {l:'DB Connections',v:44, c:'#22C55E', unit:'%', detail:'88 of 200 max'     },
]

const ACCESS_ROLES = [
  {r:'Super Admin',    users:1, perms:'Full platform access',                c:'#7C3AED'},
  {r:'Platform Admin', users:2, perms:'Operations, settings, reporting',     c:'#EF4444'},
  {r:'Finance Admin',  users:1, perms:'Finance, payments, invoices',         c:'#EE8153'},
  {r:'Support Admin',  users:2, perms:'Support, CRM, complaints',            c:'#3B82F6'},
  {r:'Content Admin',  users:1, perms:'CMS, blog, media, FAQs',             c:'#00737A'},
  {r:'Read Only',      users:3, perms:'View all modules, no editing',        c:'#9AAAB0'},
]

const NOTIF_TEMPLATES = [
  {n:'Welcome Email',        ch:'Email',     tvar:['name','link'],       status:'active' },
  {n:'Booking Confirmation', ch:'Email',     tvar:['booking_id','date'], status:'active' },
  {n:'OTP SMS',              ch:'SMS',       tvar:['otp','expiry'],      status:'active' },
  {n:'Booking Reminder',     ch:'Push',      tvar:['time','agent'],      status:'active' },
  {n:'Payment Receipt',      ch:'Email',     tvar:['amount','txn_id'],   status:'active' },
  {n:'WhatsApp Welcome',     ch:'WhatsApp',  tvar:['name'],              status:'pending'},
]

const SA_REPORTS = [
  {t:'Platform Business Report',  d:'Revenue, bookings, growth KPIs — Jan 2026'},
  {t:'Financial Report',          d:'Payments, payouts, fee reconciliation'     },
  {t:'Operations Report',         d:'Booking ops, agent performance, SLA'       },
  {t:'Compliance Report',         d:'GDPR, data retention, audit summary'       },
  {t:'Security Report',           d:'Threat analysis, failed logins, access log'},
  {t:'System Performance Report', d:'Uptime, latency, API health — Jan 2026'   },
  {t:'AI Usage Report',           d:'Token usage, cost, model analytics'        },
  {t:'Content Engagement Report', d:'Blog views, FAQ searches, KB usage'        },
]

const SA_NOTIF_ITEMS = [
  {t:'Security Alert',         b:'3 failed admin login attempts from IP 195.82.xx.xx',        c:'#EF4444', read:false},
  {t:'Deployment Complete',    b:'v2.9.0-rc deployed to Staging environment successfully.',    c:'#22C55E', read:false},
  {t:'Backup Successful',      b:'Daily full backup completed — 842 GB, 48 min duration.',    c:'#00737A', read:false},
  {t:'Feature Flag Enabled',   b:'AI Voice Notes enabled in Staging environment.',             c:'#7C3AED', read:false},
  {t:'API Failure',            b:'Email gateway (Mailgun) elevated latency — 142ms avg.',     c:'#F59E0B', read:false},
  {t:'Maintenance Scheduled',  b:'Platform maintenance window — 25 Jan 02:00–04:00 AST.',    c:'#EE8153', read:true },
]

const DASH_BI_METRICS = [
  {l:'Monthly Revenue',    v:'LKR 12.4M', c:'#22C55E', sub:'+18%'},
  {l:'Total Bookings',     v:'4,842',     c:'#00737A', sub:'This month'},
  {l:'Active Sessions',    v:'284',       c:'#7C3AED', sub:'Right now'},
  {l:'New Registrations',  v:'287',       c:'#22C55E', sub:'This month'},
  {l:'Conversion Rate',    v:'68.4%',     c:'#EE8153', sub:'Signup to book'},
  {l:'Avg Booking Value',  v:'LKR 9,200', c:'#00737A', sub:'This month'},
]

const DASH_QUICK_ACTIONS = [
  'Feature Flags','Deploy Release','CMS Content','Security Scan',
  'AI Config','Backup Now','View BI','Audit Logs',
]

const PAGE_BUILDER_BLOCKS = ['Hero Section','Features Grid','How It Works','Testimonials','Pricing Table','Team Section','CTA Banner','Footer']

const BIZ_HOURS = [
  {d:'Monday — Friday',h:'08:00 — 20:00'},
  {d:'Saturday',        h:'09:00 — 17:00'},
  {d:'Sunday',          h:'10:00 — 15:00'},
  {d:'Public Holidays', h:'Closed'},
]

const CRON_JOBS = [
  { name:'Daily Backup',          schedule:'0 2 * * *',   last:'22 Jan 02:00', next:'23 Jan 02:00', status:'healthy' },
  { name:'SLA Review',            schedule:'*/30 * * * *', last:'22 Jan 14:30', next:'22 Jan 15:00', status:'healthy' },
  { name:'Agent Cert Check',      schedule:'0 8 * * *',   last:'22 Jan 08:00', next:'23 Jan 08:00', status:'healthy' },
  { name:'Payment Reconciliation',schedule:'0 23 * * *',  last:'21 Jan 23:00', next:'22 Jan 23:00', status:'healthy' },
  { name:'Email Digest',          schedule:'0 7 * * *',   last:'22 Jan 07:00', next:'23 Jan 07:00', status:'warning' },
  { name:'Sitemap Regeneration',  schedule:'0 1 * * 0',   last:'19 Jan 01:00', next:'26 Jan 01:00', status:'healthy' },
]

const ACCESS_USERS = [
  { name:'Nirosha Jayasena',   role:'Super Admin',  access:'Full',        mfa:true,  lastLogin:'22 Jan 14:40' },
  { name:'Ranjith Bandara',    role:'Platform Admin',access:'Operations', mfa:true,  lastLogin:'22 Jan 13:10' },
  { name:'Thilina Senanayake', role:'Finance Admin', access:'Finance',    mfa:true,  lastLogin:'22 Jan 12:00' },
  { name:'Amara Subasinghe',   role:'Support Admin', access:'Support',    mfa:true,  lastLogin:'22 Jan 11:30' },
]

// ─── Icons ────────────────────────────────────────────────────────────────────
const I: Record<string,ReactNode> = {
  home:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 5.5l5.5-4.5 5.5 4.5V12H8.5V8.5h-4V12H1V5.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  settings:<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M6.5 1v1.5M6.5 10.5V12M1 6.5h1.5M10.5 6.5H12M2.6 2.6l1 1M9.4 9.4l1 1M2.6 10.4l1-1M9.4 3.6l1-1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  brand:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1.5" y="1.5" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M4 6.5h5M6.5 4v5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  flag:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 1.5v10M2.5 1.5h8l-2 3.5 2 3.5H2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  cms:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="1" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 4.5h11M4.5 4.5v7.5" stroke="currentColor" strokeWidth="1.1"/></svg>,
  page:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M3 1h5.5L11 3.5V12H3V1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M8.5 1v2.5H11" stroke="currentColor" strokeWidth="1.2"/><path d="M5 5.5h4M5 7.5h4M5 9.5h2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  blog:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1.5" y="1" width="10" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 4h5M4 6.5h5M4 9h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  media:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="2" width="11" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 8l3-3 2.5 2.5 2-2 3.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><circle cx="9.5" cy="5" r="1" fill="currentColor"/></svg>,
  faq:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 5a1.5 1.5 0 0 1 3 .5c0 1-1.5 1.5-1.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="6.5" cy="10" r=".7" fill="currentColor"/></svg>,
  i18n:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M6.5 1.5c-1.5 2-1.5 8 0 10M1.5 6.5h10" stroke="currentColor" strokeWidth="1.1"/></svg>,
  notif:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5c-2.5 0-4 1.8-4 4v2.5L1 9.5h11l-1.5-1.5V5.5c0-2.2-1.5-4-4-4z" stroke="currentColor" strokeWidth="1.2"/><path d="M5 9.5c0 .83.67 1.5 1.5 1.5S8 10.33 8 9.5" stroke="currentColor" strokeWidth="1.1"/></svg>,
  ai:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 10.5l3-3M6.5 2.5c1.5 0 4 1 4 4s-2.5 4-4 4-4-1-4-4 2.5-4 4-4z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="6.5" cy="6.5" r="1.5" fill="currentColor" opacity=".5"/></svg>,
  prompt:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 3h10v7.5H7.5L4.5 13V10.5H1.5V3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M4 6h5M4 8h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  bi:      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="1" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 9V7M6.5 9V5M9 9V3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  sysmon:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="1" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 12h4M6.5 9v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M3 5l2 2 2-2.5 2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  security:<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1L1.5 3v4c0 3 5 4.5 5 4.5s5-1.5 5-4.5V3L6.5 1z" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 6.5l1.5 2 3-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  api:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 6.5h2.5v-2h6v2H12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M8.5 3l3 3.5-3 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M4.5 3L1.5 6.5 4.5 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  auto:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5c0-2.5 2-4.5 4.5-4.5S11 4 11 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M5.5 10l1 1.5 1-1.5M6.5 8v3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  audit:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="1" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 4.5h5M4 7h5M4 9.5h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/><circle cx="3" cy="4.5" r="0.7" fill="currentColor"/><circle cx="3" cy="7" r="0.7" fill="currentColor"/><circle cx="3" cy="9.5" r="0.7" fill="currentColor"/></svg>,
  backup:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 9V3M4 5.5L6.5 3 9 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M2.5 9a2 2 0 0 0 0 4h8a2 2 0 0 0 0-4" stroke="currentColor" strokeWidth="1.2"/></svg>,
  health:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 7l2.5-4 2.5 3 2-2.5 2.5 4L12 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  release: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1L8.5 5l4 .5-3 2.8.7 4-3.7-2L3 12.3l.7-4-3-2.8 4-.5L6.5 1z" stroke="currentColor" strokeWidth="1.1"/></svg>,
  access:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 11c0-2.21 1.79-4 4-4M9.5 8v3M8 9.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  report:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="1" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 9V7M6.5 9V5M9 9V3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  bell:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5c-2.5 0-4 1.8-4 4v2.5L1 9.5h11l-1.5-1.5V5.5c0-2.2-1.5-4-4-4z" stroke="currentColor" strokeWidth="1.2"/><path d="M5 9.5c0 .83.67 1.5 1.5 1.5S8 10.33 8 9.5" stroke="currentColor" strokeWidth="1.1"/></svg>,
  badge:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1L1.5 3v4c0 3 5 4.5 5 4.5s5-1.5 5-4.5V3L6.5 1z" stroke="currentColor" strokeWidth="1.2"/></svg>,
  check:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 6.5l3 3.5 5-6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  alert:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5L1 12h11L6.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M6.5 5v3M6.5 10v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  plus:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2v9M2 6.5h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  edit:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M9.5 1.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  eye:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 6.5C1 6.5 3 3.5 6.5 3.5S12 6.5 12 6.5 10 9.5 6.5 9.5 1 6.5 1 6.5z" stroke="currentColor" strokeWidth="1.2"/><circle cx="6.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/></svg>,
  search:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="3.5" stroke="currentColor" strokeWidth="1.2"/><path d="M8.5 8.5L11 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  export:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2v7M4 6.5L6.5 9 9 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M1.5 10.5h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  refresh: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M11 6.5a4.5 4.5 0 1 1-1-2.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M11 3v2.5H8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  upload:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 9V2M4 4.5L6.5 2 9 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M1.5 10.5h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  chevR:   <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M3.5 2l3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  toggle:  <svg width="28" height="16" viewBox="0 0 28 16" fill="none"><rect x="0.5" y="0.5" width="27" height="15" rx="7.5" stroke="currentColor" strokeWidth="1"/><circle cx="20" cy="8" r="5" fill="currentColor"/></svg>,
  toggleOff:<svg width="28" height="16" viewBox="0 0 28 16" fill="none"><rect x="0.5" y="0.5" width="27" height="15" rx="7.5" stroke="currentColor" strokeWidth="1"/><circle cx="8" cy="8" r="5" fill="currentColor"/></svg>,
}

// ─── Primitives ───────────────────────────────────────────────────────────────
function Card({ children, style={}, hover=false, onClick }:{ children:ReactNode; style?:CSSProperties; hover?:boolean; onClick?:()=>void }) {
  return (
    <div onClick={onClick}
      onMouseEnter={e=>{ if(hover){const el=e.currentTarget as HTMLDivElement;el.style.borderColor=C.purple+'50';el.style.boxShadow='0 8px 24px rgba(44,62,67,0.10)'}}}
      onMouseLeave={e=>{ if(hover){const el=e.currentTarget as HTMLDivElement;el.style.borderColor=C.border;el.style.boxShadow='0 1px 4px rgba(44,62,67,0.06)'}}}
      style={{ background:C.surface, borderRadius:14, border:`1px solid ${C.border}`, boxShadow:'0 1px 4px rgba(44,62,67,0.06)', transition:'all 0.18s', cursor:onClick?'pointer':undefined, ...style }}>
      {children}
    </div>
  )
}

const BTN_BASE: Record<string,{background:string;color:string;border:string}> = {
  primary:  { background:C.purple,  color:'#fff', border:'none' },
  secondary:{ background:'#fff',    color:C.sub,  border:`1.5px solid ${C.border}` },
  ghost:    { background:'transparent', color:C.sub, border:'none' },
  danger:   { background:C.error,   color:'#fff', border:'none' },
  warning:  { background:C.warning, color:'#fff', border:'none' },
  success:  { background:C.success, color:'#fff', border:'none' },
  teal:     { background:C.primary, color:'#fff', border:'none' },
}
const BTN_HBG: Record<string,string> = {
  primary:'#6D28D9', secondary:'#F2F4F5', ghost:C.bg,
  danger:'#DC2626',  warning:'#D97706',   success:'#16A34A', teal:'#005D63',
}

function Btn({ label, icon, onClick, variant='primary', small=false, full=false }:{
  label:string; icon?:ReactNode; onClick?:()=>void
  variant?:'primary'|'secondary'|'ghost'|'danger'|'warning'|'success'|'teal'
  small?:boolean; full?:boolean
}) {
  return (
    <button onClick={onClick}
      onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background=BTN_HBG[variant]}
      onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background=BTN_BASE[variant].background}
      style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:small?'6px 13px':'10px 18px', borderRadius:9, cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:small?11:13, fontWeight:700, transition:'all 0.15s', width:full?'100%':undefined, ...BTN_BASE[variant] }}>
      {icon&&<span style={{display:'flex'}}>{icon}</span>}{label}
    </button>
  )
}

function Bdg({ label, color=C.purple, dot=false }:{ label:string; color?:string; dot?:boolean }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:dot?5:0, padding:'3px 9px', borderRadius:999, fontSize:10, fontWeight:700, background:`${color}15`, color, whiteSpace:'nowrap' as const }}>
      {dot&&<div style={{width:6,height:6,borderRadius:'50%',background:color,flexShrink:0}}/>}{label}
    </span>
  )
}

function SBdg({ status }:{ status:string }) {
  const s = SBADGES[status] || {color:C.muted, label:status}
  return <Bdg label={s.label} color={s.color} dot />
}

function SectionTitle({ title, action, onAction }:{ title:string; action?:string; onAction?:()=>void }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
      <h3 style={{ fontSize:14, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>{title}</h3>
      {action&&<button onClick={onAction} style={{ fontSize:11, fontWeight:700, color:C.purple, background:'none', border:'none', cursor:'pointer', fontFamily:'Manrope,sans-serif', display:'flex', alignItems:'center', gap:3 }}>{action}<span style={{display:'flex'}}>{I.chevR}</span></button>}
    </div>
  )
}

function Toast({ msg }:{ msg:string }) {
  return (
    <div style={{ position:'fixed', bottom:28, left:'50%', transform:'translateX(-50%)', zIndex:999, display:'flex', alignItems:'center', gap:10, padding:'12px 22px', borderRadius:14, background:C.dark, color:'#fff', fontFamily:'Manrope,sans-serif', fontSize:13, fontWeight:700, boxShadow:'0 8px 28px rgba(0,0,0,0.25)', pointerEvents:'none', whiteSpace:'nowrap' as const }}>
      <span style={{display:'flex',color:C.success}}>{I.check}</span>{msg}
    </div>
  )
}

function Shimmer({ w='100%', h=14 }:{ w?:string; h?:number }) {
  return <div style={{ width:w, height:h, borderRadius:7, background:'linear-gradient(90deg,#E4E8EA 25%,#F2F4F5 50%,#E4E8EA 75%)', backgroundSize:'200% 100%', animation:'shimmer 1.6s ease-in-out infinite' }} />
}

function UA({ name, size=36, color=C.purple }:{ name:string; size?:number; color?:string }) {
  const ini = name.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase()
  return <div style={{ width:size, height:size, borderRadius:'50%', background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', color, fontFamily:'Manrope,sans-serif', fontWeight:900, fontSize:size*0.3, flexShrink:0 }}>{ini}</div>
}

function HealthPulse({ status }:{ status:string }) {
  const c = status==='healthy'?C.success:status==='warning'?C.warning:C.error
  return <div style={{ width:10, height:10, borderRadius:'50%', background:c, flexShrink:0, animation:status!=='healthy'?'pulse-dot 1s ease-in-out infinite':undefined }}/>
}

// ─── Settings form helper ─────────────────────────────────────────────────────
function SettingRow({ label, children }:{ label:string; children:ReactNode }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', gap:16, padding:'14px 0', borderBottom:`1px solid ${C.border}`, alignItems:'center' }}>
      <p style={{ fontSize:12, fontWeight:600, color:C.type }}>{label}</p>
      <div>{children}</div>
    </div>
  )
}

function TextInput({ value, placeholder, onChange }:{ value:string; placeholder?:string; onChange?:(v:string)=>void }) {
  return (
    <input value={value} onChange={e=>onChange?.(e.target.value)} placeholder={placeholder}
      style={{ width:'100%', padding:'8px 12px', borderRadius:9, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, background:'#FAFAFA', outline:'none', boxSizing:'border-box' as const }} />
  )
}

// ─── Super Admin Dashboard ────────────────────────────────────────────────────
function SADashboard({ onNav, onToast }:{ onNav:(s:SubView)=>void; onToast:(m:string)=>void }) {
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      {/* Platform alert */}
      <div style={{ padding:'12px 20px', borderRadius:12, background:`${C.warning}06`, border:`1.5px solid ${C.warning}30`, marginBottom:18, display:'flex', gap:12, alignItems:'center' }}>
        <div style={{ width:8, height:8, borderRadius:'50%', background:C.warning, animation:'pulse-dot 1s ease-in-out infinite', flexShrink:0 }}/>
        <p style={{ flex:1, fontSize:12, fontWeight:700, color:C.warning }}>Email gateway response time elevated — avg 142ms. Investigate or switch provider.</p>
        <Btn label="Investigate" variant="warning" small onClick={()=>onNav('integrations')} />
      </div>
      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }} className="sa-4col">
        {DASH_KPIS.map((k,i)=>(
          <Card key={i} hover style={{ padding:18 }}>
            <p style={{ fontSize:10, color:C.muted, marginBottom:8 }}>{k.l}</p>
            <p style={{ fontSize:24, fontWeight:900, color:k.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:3 }}>{k.v}</p>
            <p style={{ fontSize:10, color:C.muted }}>{k.sub}</p>
          </Card>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:14 }} className="sa-2col">
        {/* Service health */}
        <Card style={{ padding:22 }}>
          <SectionTitle title="Service Health" action="System Health" onAction={()=>onNav('health')} />
          {SERVICES.slice(0,6).map((s,i)=>(
            <div key={i} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom:i<5?`1px solid ${C.border}`:'none', alignItems:'center' }}>
              <HealthPulse status={s.status} />
              <p style={{ flex:1, fontSize:12, color:C.type, fontWeight:500 }}>{s.name}</p>
              <p style={{ fontSize:10, color:C.muted }}>{s.latency}</p>
              <SBdg status={s.status} />
            </div>
          ))}
        </Card>
        {/* Recent activity */}
        <Card style={{ padding:22 }}>
          <SectionTitle title="Recent Admin Activity" action="Audit Logs" onAction={()=>onNav('audit')} />
          {AUDIT_LOGS.slice(0,5).map((l,i)=>(
            <div key={i} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom:i<4?`1px solid ${C.border}`:'none', alignItems:'flex-start' }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:l.risk==='high'?C.error:l.risk==='med'?C.warning:C.success, flexShrink:0, marginTop:3 }}/>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:11, color:C.type }}>{l.action}</p>
                <p style={{ fontSize:9, color:C.muted }}>{l.admin} · {l.time}</p>
              </div>
            </div>
          ))}
        </Card>
      </div>
      {/* Quick actions + System overview */}
      <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:16 }} className="sa-2col">
        <Card style={{ padding:22 }}>
          <SectionTitle title="Business Intelligence Snapshot" action="Full BI" onAction={()=>onNav('bi')} />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
            {DASH_BI_METRICS.map((m,i)=>(
              <div key={i} style={{ padding:'12px', borderRadius:10, background:'#FAFAFA', border:`1px solid ${C.border}` }}>
                <p style={{ fontSize:9, color:C.muted, marginBottom:4 }}>{m.l}</p>
                <p style={{ fontSize:16, fontWeight:900, color:m.c, fontFamily:'Manrope,sans-serif' }}>{m.v}</p>
                <p style={{ fontSize:9, color:C.muted }}>{m.sub}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card style={{ padding:22 }}>
          <SectionTitle title="Quick Actions" />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {DASH_QUICK_ACTIONS.map((label,i)=>(
              <button key={i} onClick={()=>{ if(label==='Feature Flags')onNav('flags'); else if(label==='CMS Content')onNav('cms'); else if(label==='Security Scan')onNav('security'); else if(label==='AI Config')onNav('ai'); else if(label==='View BI')onNav('bi'); else if(label==='Audit Logs')onNav('audit'); else onToast(`${label}…`) }}
                style={{ padding:'10px 4px', borderRadius:10, border:`1px solid ${C.border}`, background:'#FAFAFA', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:10, fontWeight:700, color:C.sub, transition:'all 0.12s' }}
                onMouseEnter={e=>{ const b=e.currentTarget as HTMLButtonElement; b.style.borderColor=C.purple; b.style.color=C.purple }}
                onMouseLeave={e=>{ const b=e.currentTarget as HTMLButtonElement; b.style.borderColor=C.border; b.style.color=C.sub }}>
                {label}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

// ─── Global Platform Settings ─────────────────────────────────────────────────
function PlatformSettings({ onToast }:{ onToast:(m:string)=>void }) {
  const [orgName, setOrgName] = useState('ReadyPal Healthcare')
  const [tz, setTz] = useState('Asia/Colombo (UTC+5:30)')
  const [currency, setCurrency] = useState('LKR — Sri Lankan Rupee')
  const [supportEmail, setSupportEmail] = useState('support@readypal.lk')
  const [maintenance, setMaintenance] = useState(false)
  return (
    <div style={{ maxWidth:760, margin:'0 auto', padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Global Platform Settings</h2>
        <Btn label="Save Changes" variant="primary" icon={I.check} onClick={()=>onToast('Settings saved!')} />
      </div>
      <Card style={{ padding:24, marginBottom:14 }}>
        <SectionTitle title="Organization" />
        <SettingRow label="Organization Name"><TextInput value={orgName} onChange={setOrgName} /></SettingRow>
        <SettingRow label="Support Email"><TextInput value={supportEmail} onChange={setSupportEmail} /></SettingRow>
        <SettingRow label="Support Phone"><TextInput value="+94 11 234 5678" /></SettingRow>
        <SettingRow label="Headquarters"><TextInput value="Colombo, Sri Lanka" /></SettingRow>
      </Card>
      <Card style={{ padding:24, marginBottom:14 }}>
        <SectionTitle title="Regional" />
        <SettingRow label="Timezone"><TextInput value={tz} onChange={setTz} /></SettingRow>
        <SettingRow label="Currency"><TextInput value={currency} onChange={setCurrency} /></SettingRow>
        <SettingRow label="Date Format"><TextInput value="DD MMM YYYY" /></SettingRow>
        <SettingRow label="Languages">
          <div style={{ display:'flex', gap:8 }}>
            {['English','Sinhala','Tamil'].map((l,i)=>(
              <Bdg key={i} label={l} color={i===0?C.success:C.primary} dot />
            ))}
          </div>
        </SettingRow>
      </Card>
      <Card style={{ padding:24, marginBottom:14 }}>
        <SectionTitle title="Business Hours" />
        {BIZ_HOURS.map((r,i)=>(
          <SettingRow key={i} label={r.d}><TextInput value={r.h} /></SettingRow>
        ))}
      </Card>
      <Card style={{ padding:24 }}>
        <SectionTitle title="System" />
        <SettingRow label="Maintenance Mode">
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <button onClick={()=>{ setMaintenance(v=>!v); onToast(maintenance?'Maintenance mode off':'Maintenance mode ON!') }}
              style={{ background:'none', border:'none', cursor:'pointer', color:maintenance?C.success:C.muted, display:'flex' }}>
              {maintenance?I.toggle:I.toggleOff}
            </button>
            <Bdg label={maintenance?'ENABLED':'DISABLED'} color={maintenance?C.warning:C.muted} dot />
            <p style={{ fontSize:11, color:C.muted }}>Disables all user-facing services</p>
          </div>
        </SettingRow>
        <SettingRow label="Platform Version"><TextInput value="v2.9.0-rc" /></SettingRow>
        <SettingRow label="App Store Version"><TextInput value="2.8.1 (Build 124)" /></SettingRow>
      </Card>
    </div>
  )
}

// ─── Branding Center ──────────────────────────────────────────────────────────
function BrandingCenter({ onToast }:{ onToast:(m:string)=>void }) {
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Branding Center</h2>
        <Btn label="Save Branding" variant="primary" icon={I.check} onClick={()=>onToast('Branding saved!')} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
        {BRAND_ASSETS.map((a,i)=>(
          <Card key={i} hover style={{ padding:20 }}>
            <div style={{ display:'flex', gap:14, alignItems:'center' }}>
              <div style={{ width:64, height:64, borderRadius:14, background:`linear-gradient(135deg,${C.primary}18,${C.purple}10)`, border:`1.5px dashed ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <p style={{ fontSize:14, fontWeight:900, color:C.primary, fontFamily:'Manrope,sans-serif' }}>{a.preview}</p>
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:3 }}>{a.l}</p>
                <p style={{ fontSize:10, color:C.muted, marginBottom:8 }}>{a.sz} · {a.note}</p>
                <div style={{ display:'flex', gap:6 }}>
                  <Btn label="Upload" variant="primary" small icon={I.upload} onClick={()=>onToast(`Uploading ${a.l}…`)} />
                  <Btn label="Preview" variant="ghost" small icon={I.eye} onClick={()=>onToast('Previewing…')} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Card style={{ padding:24 }}>
        <SectionTitle title="Brand Colors" />
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
          {[{l:'Primary',v:'#00737A'},{l:'Accent',v:'#EE8153'},{l:'Text',v:'#2C3E43'},{l:'Background',v:'#F2F4F5'}].map((col,i)=>(
            <div key={i} style={{ display:'flex', gap:10, alignItems:'center', padding:'10px', borderRadius:10, border:`1px solid ${C.border}` }}>
              <div style={{ width:32, height:32, borderRadius:8, background:col.v, flexShrink:0 }}/>
              <div>
                <p style={{ fontSize:11, fontWeight:700, color:C.type }}>{col.l}</p>
                <p style={{ fontSize:10, color:C.muted, fontFamily:'monospace' }}>{col.v}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Feature Flags ────────────────────────────────────────────────────────────
function FeatureFlags({ onToast }:{ onToast:(m:string)=>void }) {
  const ec = (e:string) => e==='Production'?C.error:e==='Staging'?C.warning:C.muted
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Feature Flags</h2>
        <Btn label="New Flag" variant="primary" small icon={I.plus} onClick={()=>onToast('Opening flag editor…')} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:18 }} className="sa-3col">
        {[{l:'Active Flags',v:'4',c:C.success},{l:'Beta',v:'2',c:C.accent},{l:'Disabled',v:'2',c:C.muted}].map((s,i)=>(
          <Card key={i} style={{ padding:16, textAlign:'center' as const }}>
            <p style={{ fontSize:24, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:3 }}>{s.v}</p>
            <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      <Card style={{ overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1.4fr 90px 110px 90px 80px 120px 130px 100px', padding:'10px 14px', background:'#FAFAFA', borderBottom:`1px solid ${C.border}`, minWidth:900 }}>
          {['Feature','Category','Environment','Status','Rollout','Target','Dependencies','Actions'].map((h,i)=>(
            <p key={i} style={{ fontSize:9, fontWeight:800, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.06em', paddingInline:4 }}>{h}</p>
          ))}
        </div>
        <div style={{ overflowX:'auto' }}>
          {FEATURE_FLAGS.map((f,i)=>(
            <div key={i}
              onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='#FAFBFB'}
              onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}
              style={{ display:'grid', gridTemplateColumns:'1.4fr 90px 110px 90px 80px 120px 130px 100px', padding:'10px 14px', borderBottom:i<FEATURE_FLAGS.length-1?`1px solid ${C.border}`:'none', transition:'background 0.12s', minWidth:900 }}>
              <p style={{ fontSize:12, fontWeight:700, color:C.type, paddingInline:4, display:'flex', alignItems:'center' }}>{f.name}</p>
              <div style={{ paddingInline:4, display:'flex', alignItems:'center' }}><Bdg label={f.cat} color={C.info} /></div>
              <div style={{ paddingInline:4, display:'flex', alignItems:'center' }}><Bdg label={f.env} color={ec(f.env)} /></div>
              <div style={{ paddingInline:4, display:'flex', alignItems:'center' }}><SBdg status={f.status==='beta'?'beta':f.status==='enabled'?'enabled':'disabled'} /></div>
              <div style={{ paddingInline:4, display:'flex', alignItems:'center' }}>
                <div style={{ display:'flex', flexDirection:'column', gap:3, flex:1 }}>
                  <p style={{ fontSize:10, fontWeight:700, color:f.rollout===100?C.success:f.rollout===0?C.muted:C.warning }}>{f.rollout}%</p>
                  <div style={{ height:4, borderRadius:99, background:`${C.primary}12` }}>
                    <div style={{ width:`${f.rollout}%`, height:'100%', background:f.rollout===100?C.success:f.rollout===0?C.muted:C.warning, borderRadius:99 }}/>
                  </div>
                </div>
              </div>
              <p style={{ fontSize:10, color:C.muted, paddingInline:4, display:'flex', alignItems:'center' }}>{f.targets}</p>
              <p style={{ fontSize:9, color:C.muted, paddingInline:4, display:'flex', alignItems:'center' }}>{f.deps}</p>
              <div style={{ paddingInline:4, display:'flex', gap:4, alignItems:'center' }}>
                {f.status==='enabled'&&<button onClick={()=>onToast(`${f.name} disabled`)} style={{ fontSize:9, fontWeight:700, padding:'4px 8px', borderRadius:6, border:`1px solid ${C.border}`, background:'none', cursor:'pointer', color:C.muted }}>Disable</button>}
                {f.status!=='enabled'&&<button onClick={()=>onToast(`${f.name} enabled!`)} style={{ fontSize:9, fontWeight:700, padding:'4px 8px', borderRadius:6, border:`1px solid ${C.success}`, background:C.success, cursor:'pointer', color:'#fff' }}>Enable</button>}
                <button onClick={()=>onToast('Editing…')} style={{ background:'none', border:'none', cursor:'pointer', color:C.primary, display:'flex', padding:3 }}>{I.edit}</button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── CMS Dashboard ────────────────────────────────────────────────────────────
function CMSDashboard({ onNav, onToast }:{ onNav:(s:SubView)=>void; onToast:(m:string)=>void }) {
  const ss = (s:string) => s==='published'?C.success:s==='draft'?C.warning:C.muted
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>CMS Dashboard</h2>
        <div style={{ display:'flex', gap:8 }}>
          <Btn label="New Page" variant="secondary" small icon={I.plus} onClick={()=>onNav('pageBuilder')} />
          <Btn label="New Blog Post" variant="primary" small icon={I.plus} onClick={()=>onNav('blog')} />
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }} className="sa-4col">
        {[{l:'Published Pages',v:'8',c:C.success},{l:'Blog Articles',v:'4',c:C.primary},{l:'Draft Content',v:'2',c:C.warning},{l:'Media Assets',v:'284',c:C.purple}].map((s,i)=>(
          <Card key={i} style={{ padding:16, textAlign:'center' as const }}>
            <p style={{ fontSize:24, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:3 }}>{s.v}</p>
            <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="sa-2col">
        {/* Pages */}
        <Card style={{ padding:20 }}>
          <SectionTitle title="Website Pages" action="Page Builder" onAction={()=>onNav('pageBuilder')} />
          {CMS_PAGES.slice(0,5).map((p,i)=>(
            <div key={i} style={{ display:'flex', gap:10, padding:'9px 0', borderBottom:i<4?`1px solid ${C.border}`:'none', alignItems:'center' }}>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:12, fontWeight:600, color:C.type }}>{p.title}</p>
                <p style={{ fontSize:10, color:C.muted, fontFamily:'monospace' }}>{p.slug}</p>
              </div>
              <div style={{ display:'flex', gap:6, alignItems:'center', flexShrink:0 }}>
                <Bdg label={p.status} color={ss(p.status)} dot />
                <button onClick={()=>onToast(`Editing ${p.title}…`)} style={{ background:'none', border:'none', cursor:'pointer', color:C.primary, display:'flex' }}>{I.edit}</button>
                <button onClick={()=>onToast('Previewing…')} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, display:'flex' }}>{I.eye}</button>
              </div>
            </div>
          ))}
        </Card>
        {/* Blog */}
        <Card style={{ padding:20 }}>
          <SectionTitle title="Blog Articles" action="Blog Management" onAction={()=>onNav('blog')} />
          {BLOG_POSTS.slice(0,5).map((p,i)=>(
            <div key={i} style={{ display:'flex', gap:10, padding:'9px 0', borderBottom:i<4?`1px solid ${C.border}`:'none', alignItems:'center' }}>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:12, fontWeight:600, color:C.type, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as const }}>{p.title}</p>
                <p style={{ fontSize:10, color:C.muted }}>{p.cat} · {p.date}</p>
              </div>
              <div style={{ display:'flex', gap:6, alignItems:'center', flexShrink:0 }}>
                <p style={{ fontSize:10, color:C.muted }}>{p.views>0?`${p.views} views`:''}</p>
                <Bdg label={p.status} color={ss(p.status)} dot />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

// ─── Page Builder ─────────────────────────────────────────────────────────────
function PageBuilder({ onToast }:{ onToast:(m:string)=>void }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'220px 1fr 260px', gap:0, height:'calc(100vh - 52px)' }} className="sa-builder-wrap">
      {/* Blocks panel */}
      <div style={{ background:C.surface, borderRight:`1px solid ${C.border}`, padding:16, overflowY:'auto' }}>
        <p style={{ fontSize:10, fontWeight:800, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.08em', marginBottom:12 }}>Content Blocks</p>
        {PAGE_BUILDER_BLOCKS.map((b,i)=>(
          <div key={i}
            onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background=`${C.purple}06`}
            onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}
            style={{ padding:'10px 12px', borderRadius:9, cursor:'grab', marginBottom:4, border:`1px solid ${C.border}`, background:'transparent', transition:'background 0.12s' }}>
            <p style={{ fontSize:12, fontWeight:600, color:C.type }}>{b}</p>
          </div>
        ))}
        <p style={{ fontSize:10, fontWeight:800, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.08em', marginTop:16, marginBottom:12 }}>Page History</p>
        {['v3 — Current','v2 — 15 Jan','v1 — 01 Jan'].map((h,i)=>(
          <div key={i} style={{ padding:'8px 12px', borderRadius:8, marginBottom:4, cursor:'pointer', border:`1px solid ${i===0?C.purple:C.border}`, background:i===0?`${C.purple}05`:'transparent' }}>
            <p style={{ fontSize:11, color:i===0?C.purple:C.sub, fontWeight:i===0?700:400 }}>{h}</p>
          </div>
        ))}
      </div>
      {/* Canvas */}
      <div style={{ background:'#E8ECEE', padding:24, overflowY:'auto', display:'flex', flexDirection:'column', gap:8 }}>
        <div style={{ background:C.surface, borderRadius:12, padding:32, textAlign:'center' as const, border:`2px dashed ${C.primary}40` }}>
          <div style={{ height:60, background:`linear-gradient(135deg,${C.primary}18,${C.purple}08)`, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12 }}>
            <p style={{ fontSize:14, fontWeight:800, color:C.primary }}>Hero Section</p>
          </div>
          <p style={{ fontSize:10, color:C.muted }}>Click to edit · Drag to reorder</p>
        </div>
        {['Features Grid','How It Works','CTA Banner'].map((s,i)=>(
          <div key={i} style={{ background:C.surface, borderRadius:12, padding:'20px 24px', border:`1px solid ${C.border}` }}>
            <div style={{ height:36, background:i%2===0?`${C.primary}08`:`${C.purple}06`, borderRadius:8, display:'flex', alignItems:'center', paddingLeft:12 }}>
              <p style={{ fontSize:12, fontWeight:600, color:C.type }}>{s}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Properties */}
      <div style={{ background:C.surface, borderLeft:`1px solid ${C.border}`, padding:16, overflowY:'auto' }}>
        <p style={{ fontSize:10, fontWeight:800, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.08em', marginBottom:12 }}>Page Settings</p>
        {[{l:'Page Title',v:'Home'},{l:'Slug',v:'/'},{l:'Meta Title',v:'ReadyPal — Professional Care'},{l:'Meta Description',v:'Find trusted care agents…'},{l:'Open Graph Image',v:'og-home.png'}].map((f,i)=>(
          <div key={i} style={{ marginBottom:10 }}>
            <p style={{ fontSize:10, color:C.muted, marginBottom:4 }}>{f.l}</p>
            <input defaultValue={f.v} style={{ width:'100%', padding:'7px 10px', borderRadius:8, border:`1px solid ${C.border}`, fontSize:11, fontFamily:'Manrope,sans-serif', color:C.type, background:'#FAFAFA', outline:'none', boxSizing:'border-box' as const }} />
          </div>
        ))}
        <div style={{ marginTop:14, display:'flex', flexDirection:'column', gap:8 }}>
          <Btn label="Save Draft" variant="secondary" full onClick={()=>onToast('Draft saved')} />
          <Btn label="Publish Page" variant="primary" full icon={I.check} onClick={()=>onToast('Page published!')} />
        </div>
      </div>
    </div>
  )
}

// ─── Blog Management ──────────────────────────────────────────────────────────
function BlogManagement({ onToast }:{ onToast:(m:string)=>void }) {
  const ss = (s:string) => s==='published'?C.success:C.warning
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Blog Management</h2>
        <Btn label="New Article" variant="primary" small icon={I.plus} onClick={()=>onToast('Opening editor…')} />
      </div>
      {BLOG_POSTS.map((p,i)=>(
        <Card key={i} hover style={{ padding:22, marginBottom:10 }}>
          <div style={{ display:'flex', gap:14, alignItems:'center', flexWrap:'wrap' as const }}>
            <div style={{ width:48, height:48, borderRadius:12, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ display:'flex', color:C.primary, transform:'scale(1.1)' }}>{I.blog}</span>
            </div>
            <div style={{ flex:1, minWidth:120 }}>
              <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:3 }}>{p.title}</p>
              <div style={{ display:'flex', gap:8 }}>
                <Bdg label={p.cat} color={C.info} />
                <Bdg label={p.author} color={C.sub} />
                {p.status==='published'&&<p style={{ fontSize:10, color:C.muted }}>{p.views.toLocaleString()} views</p>}
              </div>
            </div>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <Bdg label={p.status} color={ss(p.status)} dot />
              <p style={{ fontSize:10, color:C.muted }}>{p.date}</p>
              <Btn label="Edit" variant="ghost" small icon={I.edit} onClick={()=>onToast(`Editing "${p.title.slice(0,20)}…"`)} />
              {p.status==='draft'&&<Btn label="Publish" variant="success" small onClick={()=>onToast('Article published!')} />}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Media Library ────────────────────────────────────────────────────────────
function MediaLibrary({ onToast }:{ onToast:(m:string)=>void }) {
  const tc = (t:string) => t==='Image'?C.primary:t==='PDF'?C.error:t==='Video'?C.purple:C.accent
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Media Library</h2>
        <div style={{ display:'flex', gap:8 }}>
          <Btn label="Bulk Upload" variant="secondary" small icon={I.upload} onClick={()=>onToast('Opening upload…')} />
          <Btn label="New Folder" variant="ghost" small icon={I.plus} onClick={()=>onToast('Creating folder…')} />
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', gap:14 }} className="sa-media-wrap">
        {/* Folder list */}
        <Card style={{ padding:16, height:'fit-content' }}>
          <p style={{ fontSize:10, fontWeight:800, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.08em', marginBottom:10 }}>Folders</p>
          {MEDIA_FOLDERS.map((f,i)=>(
            <div key={i}
              onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background=`${C.purple}06`}
              onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}
              style={{ padding:'8px 10px', borderRadius:8, cursor:'pointer', transition:'background 0.12s', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <p style={{ fontSize:12, color:C.type }}>{f}</p>
              <span style={{ display:'flex', color:C.muted }}>{I.chevR}</span>
            </div>
          ))}
        </Card>
        {/* Assets grid */}
        <Card style={{ padding:20 }}>
          <div style={{ display:'flex', gap:10, marginBottom:14, alignItems:'center' }}>
            <div style={{ flex:1, display:'flex', gap:8, padding:'7px 12px', borderRadius:9, border:`1px solid ${C.border}`, background:'#FAFAFA' }}>
              <span style={{ display:'flex', color:C.muted }}>{I.search}</span>
              <input placeholder="Search media…" style={{ border:'none', background:'transparent', fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, outline:'none', flex:1 }} />
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
            {MEDIA_ASSETS.map((a,i)=>(
              <div key={i} style={{ borderRadius:12, border:`1px solid ${C.border}`, overflow:'hidden' }}
                onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.borderColor=C.purple}
                onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.borderColor=C.border}>
                <div style={{ height:80, background:`${tc(a.t)}10`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Bdg label={a.t} color={tc(a.t)} />
                </div>
                <div style={{ padding:'8px 10px' }}>
                  <p style={{ fontSize:11, fontWeight:600, color:C.type, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as const }}>{a.n}</p>
                  <p style={{ fontSize:9, color:C.muted }}>{a.sz} · {a.d}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

// ─── FAQ Management ────────────────────────────────────────────────────────────
function FAQManagement({ onToast }:{ onToast:(m:string)=>void }) {
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>FAQ Management</h2>
        <Btn label="New FAQ" variant="primary" small icon={I.plus} onClick={()=>onToast('Opening FAQ editor…')} />
      </div>
      {FAQ_DATA.map((f,i)=>(
        <Card key={i} hover style={{ padding:20, marginBottom:8 }}>
          <div style={{ display:'flex', gap:12, alignItems:'center', flexWrap:'wrap' as const }}>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:4 }}>{f.q}</p>
              <div style={{ display:'flex', gap:8 }}>
                <Bdg label={f.cat} color={C.info} />
                <p style={{ fontSize:10, color:C.muted }}>{f.views.toLocaleString()} views</p>
                <Bdg label={f.status} color={C.success} dot />
              </div>
            </div>
            <div style={{ display:'flex', gap:6 }}>
              <Btn label="Edit" variant="ghost" small icon={I.edit} onClick={()=>onToast('Editing FAQ…')} />
              <Btn label="Unpublish" variant="warning" small onClick={()=>onToast('Unpublished')} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Localization Center ──────────────────────────────────────────────────────
function LocalizationCenter({ onToast }:{ onToast:(m:string)=>void }) {
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>Localization Center</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:18 }} className="sa-3col">
        {I18N_LANGS.map((lang,i)=>(
          <Card key={i} style={{ padding:22 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
              <div>
                <p style={{ fontSize:15, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>{lang.l}</p>
                <p style={{ fontSize:10, color:C.muted, fontFamily:'monospace' }}>{lang.code}</p>
              </div>
              <Bdg label={lang.status==='complete'?'Complete':'In Progress'} color={lang.pct===100?C.success:C.warning} dot />
            </div>
            <div style={{ height:6, borderRadius:99, background:`${C.primary}12`, marginBottom:6 }}>
              <div style={{ width:`${lang.pct}%`, height:'100%', background:lang.pct===100?C.success:C.warning, borderRadius:99 }}/>
            </div>
            <p style={{ fontSize:11, color:C.muted }}>{lang.translated}/{lang.total} strings · {lang.pct}%</p>
            {lang.pct<100&&(
              <div style={{ marginTop:10 }}>
                <Btn label="Continue Translating" variant="teal" small full onClick={()=>onToast(`Editing ${lang.l} strings…`)} />
              </div>
            )}
          </Card>
        ))}
      </div>
      <Card style={{ padding:22 }}>
        <SectionTitle title="Missing Strings (Sinhala)" />
        {['Cancel Booking','Refund Initiated','Agent Verified','New Message','Payment Failed'].map((s,i)=>(
          <div key={i}
            onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='#FAFBFB'}
            onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}
            style={{ display:'grid', gridTemplateColumns:'1fr 1fr 100px', padding:'9px 0', borderBottom:i<4?`1px solid ${C.border}`:'none', alignItems:'center', transition:'background 0.12s' }}>
            <p style={{ fontSize:12, color:C.type, fontFamily:'monospace' }}>{s}</p>
            <input placeholder={`Enter Sinhala translation for "${s}"…`}
              style={{ padding:'6px 10px', borderRadius:8, border:`1px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:11, color:C.type, background:'#FAFAFA', outline:'none', marginRight:8 }} />
            <Btn label="Save" variant="teal" small onClick={()=>onToast('Translation saved')} />
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── AI Operations Center ─────────────────────────────────────────────────────
function AIOperationsCenter({ onNav, onToast }:{ onNav:(s:SubView)=>void; onToast:(m:string)=>void }) {
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>AI Operations Center</h2>
        <Btn label="Prompt Library" variant="primary" small icon={I.prompt} onClick={()=>onNav('prompts')} />
      </div>
      {/* AI KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }} className="sa-4col">
        {[{l:'AI Conversations',v:'12,870',c:C.purple,sub:'Today'},{l:'Tokens Used',v:'23.8M',c:C.primary,sub:'This month'},{l:'Avg Response',v:'1.8s',c:C.success,sub:'P95 latency'},{l:'AI Cost',v:'LKR 29,516',c:C.accent,sub:'This month'}].map((s,i)=>(
          <Card key={i} style={{ padding:18, textAlign:'center' as const }}>
            <p style={{ fontSize:24, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:3 }}>{s.v}</p>
            <p style={{ fontSize:11, fontWeight:700, color:C.type, marginBottom:2 }}>{s.l}</p>
            <p style={{ fontSize:9, color:C.muted }}>{s.sub}</p>
          </Card>
        ))}
      </div>
      {/* Model status */}
      <Card style={{ padding:22, marginBottom:14 }}>
        <SectionTitle title="Model Configuration" />
        {AI_MODELS.map((m,i)=>(
          <div key={i} style={{ display:'grid', gridTemplateColumns:'200px 120px 160px 80px 100px 100px 100px', gap:8, padding:'10px 0', borderBottom:i<AI_MODELS.length-1?`1px solid ${C.border}`:'none', alignItems:'center' }}>
            <div>
              <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{m.name}</p>
              <p style={{ fontSize:10, color:C.muted }}>{m.provider}</p>
            </div>
            <Bdg label={m.purpose} color={C.info} />
            <Bdg label={m.status} color={m.status==='active'?C.success:C.muted} dot />
            <p style={{ fontSize:10, color:C.muted }}>{(m.tokens/1000000).toFixed(1)}M tok</p>
            <p style={{ fontSize:11, fontWeight:700, color:C.type }}>{m.cost}</p>
            <Btn label={m.status==='active'?'Configure':'Activate'} variant={m.status==='active'?'secondary':'teal'} small onClick={()=>onToast(`Configuring ${m.name}…`)} />
          </div>
        ))}
      </Card>
      {/* Knowledge sources */}
      <Card style={{ padding:22 }}>
        <SectionTitle title="Knowledge Sources" action="Manage" onAction={()=>onToast('Opening knowledge base…')} />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {[{l:'FAQ Database',docs:284,status:'synced'},{l:'Care Guidelines',docs:128,status:'synced'},{l:'Legal Documents',docs:42,status:'synced'},{l:'Agent Handbook',docs:84,status:'outdated'}].map((s,i)=>(
            <div key={i} style={{ padding:'14px', borderRadius:10, border:`1px solid ${C.border}`, background:'#FAFAFA' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{s.l}</p>
                <Bdg label={s.status} color={s.status==='synced'?C.success:C.warning} dot />
              </div>
              <p style={{ fontSize:10, color:C.muted }}>{s.docs} documents</p>
              {s.status==='outdated'&&<div style={{ marginTop:8 }}><Btn label="Re-sync" variant="warning" small onClick={()=>onToast('Re-syncing…')} /></div>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Prompt Management ────────────────────────────────────────────────────────
function PromptManagement({ onToast }:{ onToast:(m:string)=>void }) {
  const [test, setTest] = useState('')
  const [result, setResult] = useState('')
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Prompt Library</h2>
        <Btn label="New Prompt" variant="primary" small icon={I.plus} onClick={()=>onToast('Opening prompt editor…')} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:14 }} className="sa-2col">
        <div>
          {PROMPT_LIST.map((p,i)=>(
            <Card key={i} hover style={{ padding:20, marginBottom:8 }}>
              <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                <div style={{ width:40, height:40, borderRadius:12, background:`${C.purple}10`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <span style={{ display:'flex', color:C.purple, transform:'scale(1.1)' }}>{I.prompt}</span>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                    <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{p.name}</p>
                    <Bdg label={p.cat} color={C.info} />
                    <Bdg label={p.v} color={C.sub} />
                    <Bdg label={p.status} color={p.status==='active'?C.success:C.warning} dot />
                  </div>
                  <p style={{ fontSize:10, color:C.muted }}>Modified {p.modified}</p>
                </div>
                <div style={{ display:'flex', gap:6 }}>
                  <Btn label="Edit" variant="ghost" small icon={I.edit} onClick={()=>onToast(`Editing ${p.name}`)} />
                  <Btn label="Test" variant="secondary" small onClick={()=>setTest(`Testing: ${p.name}`)} />
                </div>
              </div>
            </Card>
          ))}
        </div>
        {/* Playground */}
        <Card style={{ padding:22 }}>
          <SectionTitle title="Testing Playground" />
          <textarea value={test} onChange={e=>setTest(e.target.value)} placeholder="Enter a test prompt or user message to evaluate against selected prompt…" rows={4}
            style={{ width:'100%', padding:'10px 12px', borderRadius:10, border:`1.5px solid ${C.border}`, fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, background:'#FAFAFA', outline:'none', resize:'none', boxSizing:'border-box' as const, marginBottom:8 }} />
          <Btn label="Run Test" variant="primary" full icon={I.ai} onClick={()=>{ setResult('AI Response: This is a simulated response demonstrating how the AI would reply to the given test input using the selected system prompt configuration.') }} />
          {result&&(
            <div style={{ marginTop:12, padding:'12px', borderRadius:10, background:`${C.purple}06`, border:`1px solid ${C.purple}20` }}>
              <p style={{ fontSize:10, fontWeight:700, color:C.purple, marginBottom:4 }}>AI Response</p>
              <p style={{ fontSize:11, color:C.sub, lineHeight:1.6 }}>{result}</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

// ─── Business Intelligence ────────────────────────────────────────────────────
const BI_MONTHS = ['Jul','Aug','Sep','Oct','Nov','Dec','Jan']
const BI_REV    = [7.2, 8.4, 9.1, 10.2, 11.0, 11.8, 12.4]
const BI_USERS  = [2100, 2280, 2520, 2810, 3050, 3290, 3542]
const BI_MAX_R  = Math.max(...BI_REV)
const BI_MAX_U  = Math.max(...BI_USERS)

function BusinessIntelligence() {
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>Business Intelligence</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }} className="sa-4col">
        {[{l:'Monthly Revenue',v:'LKR 12.4M',c:C.success,sub:'+18% MoM'},{l:'Total Users',v:'3,542',c:C.primary,sub:'+287 this month'},{l:'Conversion Rate',v:'68.4%',c:C.purple,sub:'+2.1% MoM'},{l:'Retention Rate',v:'84.2%',c:C.success,sub:'+1.4% MoM'}].map((s,i)=>(
          <Card key={i} style={{ padding:18, textAlign:'center' as const }}>
            <p style={{ fontSize:24, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:3 }}>{s.v}</p>
            <p style={{ fontSize:11, fontWeight:700, color:C.type, marginBottom:2 }}>{s.l}</p>
            <p style={{ fontSize:9, color:C.muted }}>{s.sub}</p>
          </Card>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }} className="sa-2col">
        {/* Revenue trend */}
        <Card style={{ padding:22 }}>
          <SectionTitle title="Revenue Trend (LKR M)" />
          <svg width="100%" height="140" viewBox="0 0 340 140" preserveAspectRatio="none">
            <defs>
              <linearGradient id="saRevGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.success} stopOpacity="0.18"/>
                <stop offset="100%" stopColor={C.success} stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d={`M${BI_REV.map((v,i)=>`${i*(340/6)},${130-((v/BI_MAX_R)*110)}`).join('L')} L340,130 L0,130 Z`} fill="url(#saRevGrad)"/>
            <polyline points={BI_REV.map((v,i)=>`${i*(340/6)},${130-((v/BI_MAX_R)*110)}`).join(' ')} fill="none" stroke={C.success} strokeWidth="2.5" strokeLinejoin="round"/>
            {BI_REV.map((v,i)=>(
              <circle key={i} cx={i*(340/6)} cy={130-((v/BI_MAX_R)*110)} r="4" fill={C.surface} stroke={C.success} strokeWidth="2"/>
            ))}
          </svg>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:4 }}>
            {BI_MONTHS.map(m=><p key={m} style={{ fontSize:9, color:C.muted }}>{m}</p>)}
          </div>
        </Card>
        {/* User growth */}
        <Card style={{ padding:22 }}>
          <SectionTitle title="User Growth" />
          <svg width="100%" height="140" viewBox="0 0 340 140" preserveAspectRatio="none">
            <defs>
              <linearGradient id="saUserGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.purple} stopOpacity="0.15"/>
                <stop offset="100%" stopColor={C.purple} stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d={`M${BI_USERS.map((v,i)=>`${i*(340/6)},${130-((v/BI_MAX_U)*110)}`).join('L')} L340,130 L0,130 Z`} fill="url(#saUserGrad)"/>
            <polyline points={BI_USERS.map((v,i)=>`${i*(340/6)},${130-((v/BI_MAX_U)*110)}`).join(' ')} fill="none" stroke={C.purple} strokeWidth="2.5" strokeLinejoin="round"/>
            {BI_USERS.map((v,i)=>(
              <circle key={i} cx={i*(340/6)} cy={130-((v/BI_MAX_U)*110)} r="4" fill={C.surface} stroke={C.purple} strokeWidth="2"/>
            ))}
          </svg>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:4 }}>
            {BI_MONTHS.map(m=><p key={m} style={{ fontSize:9, color:C.muted }}>{m}</p>)}
          </div>
        </Card>
      </div>
      {/* Segments */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }} className="sa-3col">
        {[{l:'New Users',v:'287',pct:8.1,c:C.success},{l:'Returning',v:'2,948',pct:83.2,c:C.primary},{l:'Churned',v:'307',pct:8.7,c:C.error},{l:'Colombo',v:'1,842',pct:52,c:C.purple},{l:'Kandy',v:'712',pct:20.1,c:C.accent},{l:'Other Regions',v:'988',pct:27.9,c:C.muted}].map((s,i)=>(
          <Card key={i} style={{ padding:16 }}>
            <p style={{ fontSize:10, color:C.muted, marginBottom:4 }}>{s.l}</p>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
              <p style={{ fontSize:18, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif' }}>{s.v}</p>
              <p style={{ fontSize:11, fontWeight:700, color:s.c }}>{s.pct}%</p>
            </div>
            <div style={{ height:4, borderRadius:99, background:`${s.c}12` }}>
              <div style={{ width:`${s.pct}%`, height:'100%', background:s.c, borderRadius:99 }}/>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── System Analytics ─────────────────────────────────────────────────────────
const SA_HOURS = ['0','2','4','6','8','10','12','14','16','18','20','22']
const SA_API   = [12,14,18,10,62,84,96,104,98,88,72,48]
const SA_CPU   = [18,20,24,15,55,68,72,78,74,66,58,40]
const SA_MAX_A = Math.max(...SA_API)
const SA_MAX_C = Math.max(...SA_CPU)

function SystemAnalytics() {
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>System Analytics</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }} className="sa-4col">
        {[{l:'API Requests Today',v:'1.48M',c:C.primary,sub:'Peak 104k/hr at 14:00'},{l:'Avg Latency',v:'18ms',c:C.success,sub:'P99: 142ms'},{l:'CPU Usage',v:'72%',c:C.warning,sub:'Peak at 14:00'},{l:'Memory Usage',v:'68%',c:C.success,sub:'12.4 GB of 18 GB'}].map((s,i)=>(
          <Card key={i} style={{ padding:18, textAlign:'center' as const }}>
            <p style={{ fontSize:22, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:3 }}>{s.v}</p>
            <p style={{ fontSize:11, fontWeight:700, color:C.type, marginBottom:2 }}>{s.l}</p>
            <p style={{ fontSize:9, color:C.muted }}>{s.sub}</p>
          </Card>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }} className="sa-2col">
        <Card style={{ padding:22 }}>
          <SectionTitle title="API Requests (1k/hr)" />
          <svg width="100%" height="120" viewBox="0 0 330 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="saApiGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.primary} stopOpacity="0.14"/>
                <stop offset="100%" stopColor={C.primary} stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d={`M${SA_API.map((v,i)=>`${i*(330/11)},${110-((v/SA_MAX_A)*95)}`).join('L')} L330,110 L0,110 Z`} fill="url(#saApiGrad)"/>
            <polyline points={SA_API.map((v,i)=>`${i*(330/11)},${110-((v/SA_MAX_A)*95)}`).join(' ')} fill="none" stroke={C.primary} strokeWidth="2" strokeLinejoin="round"/>
          </svg>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:4 }}>
            {SA_HOURS.map(h=><p key={h} style={{ fontSize:9, color:C.muted }}>{h}h</p>)}
          </div>
        </Card>
        <Card style={{ padding:22 }}>
          <SectionTitle title="CPU Utilization (%)" />
          <svg width="100%" height="120" viewBox="0 0 330 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="saCpuGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.warning} stopOpacity="0.14"/>
                <stop offset="100%" stopColor={C.warning} stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d={`M${SA_CPU.map((v,i)=>`${i*(330/11)},${110-((v/SA_MAX_C)*95)}`).join('L')} L330,110 L0,110 Z`} fill="url(#saCpuGrad)"/>
            <polyline points={SA_CPU.map((v,i)=>`${i*(330/11)},${110-((v/SA_MAX_C)*95)}`).join(' ')} fill="none" stroke={C.warning} strokeWidth="2" strokeLinejoin="round"/>
          </svg>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:4 }}>
            {SA_HOURS.map(h=><p key={h} style={{ fontSize:9, color:C.muted }}>{h}h</p>)}
          </div>
        </Card>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }} className="sa-4col">
        {[{l:'Storage Used',v:'2.4 TB',max:'5 TB',pct:48,c:C.primary},{l:'Database Size',v:'284 GB',max:'500 GB',pct:57,c:C.success},{l:'Cache Hit Rate',v:'94.2%',max:'100%',pct:94,c:C.success},{l:'Bandwidth',v:'1.8 TB',max:'5 TB/mo',pct:36,c:C.info}].map((s,i)=>(
          <Card key={i} style={{ padding:18 }}>
            <p style={{ fontSize:10, color:C.muted, marginBottom:4 }}>{s.l}</p>
            <p style={{ fontSize:18, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', marginBottom:3 }}>{s.v}</p>
            <p style={{ fontSize:9, color:C.muted, marginBottom:6 }}>of {s.max}</p>
            <div style={{ height:5, borderRadius:99, background:`${s.c}12` }}>
              <div style={{ width:`${s.pct}%`, height:'100%', background:s.c, borderRadius:99 }}/>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Security Center ──────────────────────────────────────────────────────────
function SecurityCenter({ onToast }:{ onToast:(m:string)=>void }) {
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>Security Center</h2>
      <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap:16, marginBottom:16 }} className="sa-2col">
        {/* Score ring */}
        <Card style={{ padding:32, textAlign:'center' as const, background:`linear-gradient(135deg,${C.success}05,${C.primary}03)` }}>
          <svg width="120" height="120" viewBox="0 0 120 120" style={{ margin:'0 auto 12px', display:'block' }}>
            <circle cx="60" cy="60" r="50" fill="none" stroke={`${C.success}20`} strokeWidth="10"/>
            <circle cx="60" cy="60" r="50" fill="none" stroke={C.success} strokeWidth="10" strokeDasharray={`${(94/100)*314} 314`} strokeDashoffset="78.5" strokeLinecap="round" transform="rotate(-90 60 60)"/>
            <text x="60" y="55" textAnchor="middle" fill={C.success} fontSize="24" fontWeight="900" fontFamily="Manrope,sans-serif">94</text>
            <text x="60" y="70" textAnchor="middle" fill={C.muted} fontSize="11" fontFamily="Manrope,sans-serif">/100</text>
          </svg>
          <p style={{ fontSize:14, fontWeight:800, color:C.type }}>Security Score</p>
          <p style={{ fontSize:11, color:C.muted }}>2 recommendations open</p>
          <div style={{ marginTop:12 }}>
            <Bdg label="Strong Security" color={C.success} dot />
          </div>
        </Card>
        <Card style={{ padding:22 }}>
          <SectionTitle title="Security Metrics" />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {[{l:'MFA Adoption',v:'94.2%',c:C.success,sub:'of all admin accounts'},{l:'Failed Logins (24h)',v:'12',c:C.success,sub:'0 from known IPs'},{l:'Active Sessions',v:'8',c:C.primary,sub:'4 admin, 4 support'},{l:'API Keys Active',v:'24',c:C.info,sub:'3 expiring in 30 days'},{l:'SSL Certificate',v:'142 days',c:C.success,sub:'Auto-renew enabled'},{l:'Last Security Scan',v:'6h ago',c:C.success,sub:'0 vulnerabilities found'}].map((m,i)=>(
              <div key={i} style={{ padding:'12px', borderRadius:10, background:'#FAFAFA', border:`1px solid ${C.border}` }}>
                <p style={{ fontSize:9, color:C.muted, marginBottom:3 }}>{m.l}</p>
                <p style={{ fontSize:16, fontWeight:900, color:m.c, fontFamily:'Manrope,sans-serif', marginBottom:1 }}>{m.v}</p>
                <p style={{ fontSize:9, color:C.muted }}>{m.sub}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="sa-2col">
        <Card style={{ padding:22 }}>
          <SectionTitle title="Security Recommendations" />
          {[{l:'Rotate API keys older than 90 days',severity:'medium'},{l:'Enable IP allowlist for admin panel',severity:'low'},{l:'Review 3 inactive admin accounts',severity:'low'}].map((r,i)=>(
            <div key={i} style={{ display:'flex', gap:10, padding:'10px 0', borderBottom:i<2?`1px solid ${C.border}`:'none', alignItems:'center' }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:r.severity==='high'?C.error:r.severity==='medium'?C.warning:C.info, flexShrink:0 }}/>
              <p style={{ flex:1, fontSize:12, color:C.type }}>{r.l}</p>
              <Btn label="Resolve" variant="teal" small onClick={()=>onToast('Resolving…')} />
            </div>
          ))}
        </Card>
        <Card style={{ padding:22 }}>
          <SectionTitle title="Session Management" />
          {ACCESS_USERS.map((u,i)=>(
            <div key={i} style={{ display:'flex', gap:10, padding:'9px 0', borderBottom:i<ACCESS_USERS.length-1?`1px solid ${C.border}`:'none', alignItems:'center' }}>
              <UA name={u.name} size={28} color={C.primary} />
              <div style={{ flex:1 }}>
                <p style={{ fontSize:11, fontWeight:700, color:C.type }}>{u.name}</p>
                <p style={{ fontSize:9, color:C.muted }}>Last login: {u.lastLogin}</p>
              </div>
              <Bdg label={u.mfa?'MFA On':'MFA Off'} color={u.mfa?C.success:C.error} dot />
              <button onClick={()=>onToast(`${u.name} session revoked`)} style={{ fontSize:9, fontWeight:700, padding:'4px 8px', borderRadius:6, border:`1px solid ${C.error}`, background:'none', cursor:'pointer', color:C.error, fontFamily:'Manrope,sans-serif' }}>Revoke</button>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

// ─── API & Integrations ───────────────────────────────────────────────────────
function APIIntegrations({ onToast }:{ onToast:(m:string)=>void }) {
  const hc = (h:string) => h==='healthy'?C.success:h==='warning'?C.warning:C.error
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>API & Integrations</h2>
        <div style={{ display:'flex', gap:8 }}>
          <Btn label="API Keys" variant="secondary" small icon={I.api} onClick={()=>onToast('Opening API keys…')} />
          <Btn label="Webhooks" variant="secondary" small onClick={()=>onToast('Opening webhooks…')} />
          <Btn label="Add Integration" variant="primary" small icon={I.plus} onClick={()=>onToast('Opening marketplace…')} />
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        {INTEGRATIONS_DATA.map((int,i)=>(
          <Card key={i} hover style={{ padding:22 }}>
            <div style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
              <div style={{ width:48, height:48, borderRadius:14, background:`${hc(int.health)}10`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <HealthPulse status={int.health==='offline'?'critical':int.health} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                  <p style={{ fontSize:14, fontWeight:800, color:C.type }}>{int.name}</p>
                  <Bdg label={int.type} color={C.info} />
                  <Bdg label={`API ${int.version}`} color={C.sub} />
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:10 }}>
                  <div><p style={{ fontSize:9, color:C.muted }}>Status</p><SBdg status={int.status==='connected'?'online':'offline'} /></div>
                  <div><p style={{ fontSize:9, color:C.muted }}>Health</p><SBdg status={int.health} /></div>
                  <div><p style={{ fontSize:9, color:C.muted }}>Last call</p><p style={{ fontSize:10, fontWeight:600, color:C.type }}>{int.lastCall}</p></div>
                </div>
                <div style={{ display:'flex', gap:6 }}>
                  <Btn label="Configure" variant="secondary" small icon={I.settings} onClick={()=>onToast(`Configuring ${int.name}…`)} />
                  {int.status==='pending'&&<Btn label="Connect" variant="success" small onClick={()=>onToast(`Connecting ${int.name}…`)} />}
                  {int.health==='warning'&&<Btn label="Diagnose" variant="warning" small onClick={()=>onToast('Running diagnostics…')} />}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Automation Center ────────────────────────────────────────────────────────
function AutomationCenter({ onToast }:{ onToast:(m:string)=>void }) {
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Automation Center</h2>
        <Btn label="New Job" variant="primary" small icon={I.plus} onClick={()=>onToast('Opening job editor…')} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }} className="sa-4col">
        {[{l:'Active Jobs',v:'5',c:C.success},{l:'Runs Today',v:'84',c:C.primary},{l:'Failed Runs',v:'1',c:C.warning},{l:'Queued',v:'3',c:C.info}].map((s,i)=>(
          <Card key={i} style={{ padding:16, textAlign:'center' as const }}>
            <p style={{ fontSize:22, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:3 }}>{s.v}</p>
            <p style={{ fontSize:10, color:C.muted }}>{s.l}</p>
          </Card>
        ))}
      </div>
      {CRON_JOBS.map((job,i)=>(
        <Card key={i} hover style={{ padding:20, marginBottom:8 }}>
          <div style={{ display:'flex', gap:14, alignItems:'center', flexWrap:'wrap' as const }}>
            <div style={{ width:40, height:40, borderRadius:12, background:`${C.primary}10`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ display:'flex', color:C.primary, transform:'scale(1.1)' }}>{I.auto}</span>
            </div>
            <div style={{ flex:1, minWidth:120 }}>
              <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:4 }}>{job.name}</p>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' as const }}>
                <code style={{ fontSize:10, color:C.sub, background:'#F2F4F5', padding:'2px 6px', borderRadius:5, fontFamily:'monospace' }}>{job.schedule}</code>
                <p style={{ fontSize:10, color:C.muted }}>Last: {job.last}</p>
                <p style={{ fontSize:10, color:C.muted }}>Next: {job.next}</p>
              </div>
            </div>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <SBdg status={job.status} />
              <Btn label="Run Now" variant="teal" small onClick={()=>onToast(`${job.name} triggered`)} />
              <Btn label="Edit" variant="ghost" small icon={I.edit} onClick={()=>onToast('Editing…')} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Audit Center ─────────────────────────────────────────────────────────────
function AuditCenter({ onToast }:{ onToast:(m:string)=>void }) {
  const rc = (r:string) => r==='high'?C.error:r==='med'?C.warning:C.success
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Audit Center</h2>
        <div style={{ display:'flex', gap:8 }}>
          <Btn label="Export Logs" variant="secondary" small icon={I.export} onClick={()=>onToast('Exporting…')} />
          <Btn label="Filter" variant="ghost" small icon={I.search} onClick={()=>onToast('Opening filter…')} />
        </div>
      </div>
      <Card style={{ overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 130px 100px 80px 140px 90px', padding:'10px 18px', background:'#FAFAFA', borderBottom:`1px solid ${C.border}` }}>
          {['Action','Admin','Category','Risk','Timestamp','IP'].map((h,i)=>(
            <p key={i} style={{ fontSize:9, fontWeight:800, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.06em' }}>{h}</p>
          ))}
        </div>
        {AUDIT_LOGS.map((l,i)=>(
          <div key={i}
            onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='#FAFBFB'}
            onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}
            style={{ display:'grid', gridTemplateColumns:'1fr 130px 100px 80px 140px 90px', padding:'11px 18px', borderBottom:i<AUDIT_LOGS.length-1?`1px solid ${C.border}`:'none', transition:'background 0.12s' }}>
            <p style={{ fontSize:12, color:C.type }}>{l.action}</p>
            <div style={{ display:'flex', gap:6, alignItems:'center' }}><UA name={l.admin==='System'?'S ':l.admin} size={20} color={C.primary}/><p style={{ fontSize:10, color:C.sub }}>{l.admin.split(' ')[0]}</p></div>
            <Bdg label={l.cat} color={C.info} />
            <Bdg label={l.risk.toUpperCase()} color={rc(l.risk)} />
            <p style={{ fontSize:10, color:C.muted }}>{l.time}</p>
            <p style={{ fontSize:10, color:C.muted, fontFamily:'monospace' }}>{l.ip}</p>
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── Backup & Recovery ────────────────────────────────────────────────────────
function BackupRecovery({ onToast }:{ onToast:(m:string)=>void }) {
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Backup & Recovery</h2>
        <div style={{ display:'flex', gap:8 }}>
          <Btn label="Backup Now" variant="primary" small icon={I.backup} onClick={()=>onToast('Backup initiated!')} />
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }} className="sa-4col">
        {[{l:'Last Backup',v:'2h ago',c:C.success,sub:'22 Jan 02:00'},{l:'Total Backups',v:'142',c:C.primary,sub:'30-day retention'},{l:'Recovery Points',v:'8',c:C.info,sub:'Last 7 days'},{l:'Total Storage',v:'842 GB',c:C.purple,sub:'S3 ap-south-1'}].map((s,i)=>(
          <Card key={i} style={{ padding:18, textAlign:'center' as const }}>
            <p style={{ fontSize:24, fontWeight:900, color:s.c, fontFamily:'Manrope,sans-serif', lineHeight:1, marginBottom:3 }}>{s.v}</p>
            <p style={{ fontSize:11, fontWeight:700, color:C.type, marginBottom:1 }}>{s.l}</p>
            <p style={{ fontSize:9, color:C.muted }}>{s.sub}</p>
          </Card>
        ))}
      </div>
      <Card style={{ overflow:'hidden', marginBottom:14 }}>
        <div style={{ display:'grid', gridTemplateColumns:'160px 160px 100px 100px 100px 160px 100px', padding:'10px 18px', background:'#FAFAFA', borderBottom:`1px solid ${C.border}` }}>
          {['Backup','Time','Size','Status','Duration','Location','Action'].map((h,i)=>(
            <p key={i} style={{ fontSize:9, fontWeight:800, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.06em' }}>{h}</p>
          ))}
        </div>
        {BACKUP_DATA.map((b,i)=>(
          <div key={i}
            onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='#FAFBFB'}
            onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}
            style={{ display:'grid', gridTemplateColumns:'160px 160px 100px 100px 100px 160px 100px', padding:'11px 18px', borderBottom:i<BACKUP_DATA.length-1?`1px solid ${C.border}`:'none', transition:'background 0.12s' }}>
            <p style={{ fontSize:12, fontWeight:600, color:C.type }}>{b.label}</p>
            <p style={{ fontSize:11, color:C.muted }}>{b.time}</p>
            <p style={{ fontSize:11, color:C.type }}>{b.size}</p>
            <SBdg status={b.status==='success'?'healthy':'critical'} />
            <p style={{ fontSize:11, color:C.muted }}>{b.duration}</p>
            <p style={{ fontSize:10, color:C.muted, fontFamily:'monospace' }}>{b.location}</p>
            <button onClick={()=>onToast(`Restoring ${b.label}…`)} style={{ fontSize:9, fontWeight:700, padding:'4px 8px', borderRadius:6, border:`1px solid ${C.border}`, background:'none', cursor:'pointer', color:C.primary, fontFamily:'Manrope,sans-serif' }}>Restore</button>
          </div>
        ))}
      </Card>
      <Card style={{ padding:22 }}>
        <SectionTitle title="Backup Schedule" />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {[{l:'Full Backup',schedule:'Daily at 02:00 AST',retention:'30 days'},{l:'Incremental',schedule:'Every 6 hours',retention:'7 days'},{l:'DB Snapshot',schedule:'Daily at 06:00 AST',retention:'14 days'},{l:'Off-site Replication',schedule:'Every 24 hours',retention:'90 days'}].map((s,i)=>(
            <div key={i} style={{ padding:'14px', borderRadius:10, background:'#FAFAFA', border:`1px solid ${C.border}` }}>
              <p style={{ fontSize:12, fontWeight:700, color:C.type, marginBottom:3 }}>{s.l}</p>
              <p style={{ fontSize:10, color:C.muted, marginBottom:2 }}>Schedule: {s.schedule}</p>
              <p style={{ fontSize:10, color:C.muted }}>Retention: {s.retention}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── System Health ────────────────────────────────────────────────────────────
function SystemHealth() {
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>System Health</h2>
        <div style={{ display:'flex', gap:6, alignItems:'center' }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:C.success, animation:'pulse-dot 1s ease-in-out infinite' }}/>
          <p style={{ fontSize:11, fontWeight:700, color:C.success }}>All Systems Operational</p>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12, marginBottom:18 }} className="sa-2col">
        {SYS_HEALTH_METRICS.map((m,i)=>(
          <Card key={i} style={{ padding:18 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
              <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{m.l}</p>
              <p style={{ fontSize:16, fontWeight:900, color:m.c, fontFamily:'Manrope,sans-serif' }}>{m.v}{m.unit}</p>
            </div>
            <div style={{ height:8, borderRadius:99, background:`${m.c}12`, marginBottom:4 }}>
              <div style={{ width:`${m.v}%`, height:'100%', background:m.c, borderRadius:99 }}/>
            </div>
            <p style={{ fontSize:10, color:C.muted }}>{m.detail}</p>
          </Card>
        ))}
      </div>
      <Card style={{ padding:22 }}>
        <SectionTitle title="Service Status" />
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:8 }}>
          {SERVICES.map((s,i)=>(
            <div key={i} style={{ padding:'12px', borderRadius:10, background:'#FAFAFA', border:`1px solid ${s.status==='healthy'?C.border:C.warning+'40'}`, textAlign:'center' as const }}>
              <HealthPulse status={s.status} />
              <p style={{ fontSize:11, fontWeight:600, color:C.type, marginTop:8, marginBottom:2 }}>{s.name.replace(' Gateway','').replace(' Service','')}</p>
              <p style={{ fontSize:9, color:C.muted }}>{s.latency}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Release Management ───────────────────────────────────────────────────────
function ReleaseManagement({ onToast }:{ onToast:(m:string)=>void }) {
  const ec = (e:string) => e==='Production'?C.error:e==='Staging'?C.warning:C.info
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Release Management</h2>
        <Btn label="Deploy to Staging" variant="primary" small icon={I.release} onClick={()=>onToast('Deploy triggered…')} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:18 }} className="sa-3col">
        {[{l:'Production',v:'v2.8.1',c:C.error,sub:'Stable · 20 Jan 2026'},{l:'Staging',v:'v2.9.0-rc',c:C.warning,sub:'RC · 22 Jan 2026'},{l:'Development',v:'v2.9.0-dev',c:C.info,sub:'In progress'}].map((e,i)=>(
          <Card key={i} style={{ padding:20, border:`2px solid ${e.c}25`, background:`${e.c}03` }}>
            <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:8 }}>
              <Bdg label={e.l} color={e.c} />
              <SBdg status={i===0?'stable':i===1?'beta':'maintenance'} />
            </div>
            <p style={{ fontSize:18, fontWeight:900, color:e.c, fontFamily:'Manrope,sans-serif', marginBottom:3 }}>{e.v}</p>
            <p style={{ fontSize:10, color:C.muted }}>{e.sub}</p>
          </Card>
        ))}
      </div>
      {RELEASES.map((r,i)=>(
        <Card key={i} hover style={{ padding:22, marginBottom:10 }}>
          <div style={{ display:'flex', gap:14, alignItems:'center', flexWrap:'wrap' as const }}>
            <div style={{ width:48, height:48, borderRadius:14, background:`${ec(r.env)}10`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ display:'flex', color:ec(r.env), transform:'scale(1.2)' }}>{I.release}</span>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                <p style={{ fontSize:14, fontWeight:800, color:C.type, fontFamily:'Manrope,sans-serif' }}>{r.version}</p>
                <Bdg label={r.env} color={ec(r.env)} />
                <SBdg status={r.status} />
              </div>
              <p style={{ fontSize:11, color:C.muted }}>{r.notes}</p>
              <p style={{ fontSize:10, color:C.muted }}>{r.date} · Deployed by {r.author}</p>
            </div>
            <div style={{ display:'flex', gap:6 }}>
              <Btn label="Release Notes" variant="ghost" small icon={I.eye} onClick={()=>onToast('Opening notes…')} />
              {r.env!=='Production'&&<Btn label="Promote" variant="success" small onClick={()=>onToast(`Promoting ${r.version} to ${r.env==='Staging'?'Production':'Staging'}…`)} />}
              {r.env==='Production'&&<Btn label="Rollback" variant="danger" small onClick={()=>onToast('Initiating rollback…')} />}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Access Control ────────────────────────────────────────────────────────────
function AccessControl({ onToast }:{ onToast:(m:string)=>void }) {
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Access Control</h2>
        <div style={{ display:'flex', gap:8 }}>
          <Btn label="Invite Admin" variant="primary" small icon={I.plus} onClick={()=>onToast('Sending invitation…')} />
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }} className="sa-2col">
        {/* Roles */}
        <Card style={{ padding:22 }}>
          <SectionTitle title="Roles" />
          {ACCESS_ROLES.map((r,i)=>(
            <div key={i} style={{ display:'flex', gap:10, padding:'9px 0', borderBottom:i<ACCESS_ROLES.length-1?`1px solid ${C.border}`:'none', alignItems:'center' }}>
              <div style={{ width:10, height:10, borderRadius:3, background:r.c, flexShrink:0 }}/>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{r.r}</p>
                <p style={{ fontSize:10, color:C.muted }}>{r.perms}</p>
              </div>
              <Bdg label={`${r.users} user${r.users>1?'s':''}`} color={r.c} />
            </div>
          ))}
        </Card>
        {/* Users */}
        <Card style={{ padding:22 }}>
          <SectionTitle title="Admin Users" />
          {ACCESS_USERS.map((u,i)=>(
            <div key={i} style={{ display:'flex', gap:10, padding:'9px 0', borderBottom:i<ACCESS_USERS.length-1?`1px solid ${C.border}`:'none', alignItems:'center' }}>
              <UA name={u.name} size={34} color={C.primary} />
              <div style={{ flex:1 }}>
                <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{u.name}</p>
                <div style={{ display:'flex', gap:6 }}>
                  <Bdg label={u.role} color={C.purple} />
                  <Bdg label={u.mfa?'MFA On':'MFA Off'} color={u.mfa?C.success:C.error} dot />
                </div>
              </div>
              <div style={{ display:'flex', gap:6 }}>
                <button onClick={()=>onToast(`Editing ${u.name}`)} style={{ background:'none', border:'none', cursor:'pointer', color:C.primary, display:'flex' }}>{I.edit}</button>
                <button onClick={()=>onToast(`${u.name} access revoked`)} style={{ background:'none', border:'none', cursor:'pointer', color:C.error, display:'flex' }}>{I.alert}</button>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

// ─── Notification Management ─────────────────────────────────────────────────
function NotificationManagement({ onToast }:{ onToast:(m:string)=>void }) {
  const cc = (ch:string) => ch==='Email'?C.primary:ch==='SMS'?C.accent:ch==='Push'?C.success:C.warning
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Notification Management</h2>
        <Btn label="New Template" variant="primary" small icon={I.plus} onClick={()=>onToast('Opening template editor…')} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        {NOTIF_TEMPLATES.map((t,i)=>(
          <Card key={i} hover style={{ padding:20 }}>
            <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
              <div style={{ width:44, height:44, borderRadius:14, background:`${cc(t.ch)}10`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Bdg label={t.ch} color={cc(t.ch)} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:6 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:C.type }}>{t.n}</p>
                  <SBdg status={t.status==='active'?'enabled':'warning'} />
                </div>
                <div style={{ display:'flex', gap:4, flexWrap:'wrap' as const, marginBottom:10 }}>
                  {t.tvar.map((v,j)=>(<code key={j} style={{ fontSize:9, background:'#F2F4F5', color:C.sub, padding:'2px 6px', borderRadius:5, fontFamily:'monospace' }}>{`{{${v}}}`}</code>))}
                </div>
                <div style={{ display:'flex', gap:6 }}>
                  <Btn label="Edit" variant="ghost" small icon={I.edit} onClick={()=>onToast(`Editing ${t.n}…`)} />
                  <Btn label="Preview" variant="secondary" small icon={I.eye} onClick={()=>onToast('Previewing…')} />
                  <Btn label="Test Send" variant="teal" small onClick={()=>onToast('Test sent!')} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Reports ─────────────────────────────────────────────────────────────────
function SAReports({ onToast }:{ onToast:(m:string)=>void }) {
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>Reports & Exports</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        {SA_REPORTS.map((r,i)=>(
          <Card key={i} hover style={{ padding:22 }}>
            <div style={{ display:'flex', gap:14 }}>
              <div style={{ width:44, height:44, borderRadius:14, background:`${C.purple}10`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ display:'flex', color:C.purple, transform:'scale(1.2)' }}>{I.report}</span>
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:13, fontWeight:700, color:C.type, marginBottom:3 }}>{r.t}</p>
                <p style={{ fontSize:11, color:C.muted, lineHeight:1.5, marginBottom:10 }}>{r.d}</p>
                <div style={{ display:'flex', gap:6 }}>
                  <Btn label="View" variant="ghost" small icon={I.eye} onClick={()=>onToast(`Opening ${r.t}…`)} />
                  <Btn label="PDF" variant="secondary" small icon={I.export} onClick={()=>onToast('Exporting PDF…')} />
                  <Btn label="Excel" variant="secondary" small icon={I.export} onClick={()=>onToast('Exporting Excel…')} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Notifications ────────────────────────────────────────────────────────────
function SANotifications() {
  return (
    <div style={{ maxWidth:680, margin:'0 auto', padding:'20px 24px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif' }}>Notifications</h2>
        <Bdg label={`${SA_NOTIF_ITEMS.filter(n=>!n.read).length} unread`} color={C.error} dot />
      </div>
      {SA_NOTIF_ITEMS.map((n,i)=>(
        <Card key={i} style={{ padding:16, marginBottom:8, background:n.read?C.surface:`${n.c}04`, border:`1px solid ${n.read?C.border:n.c+'30'}` }}>
          <div style={{ display:'flex', gap:12 }}>
            <div style={{ width:10, height:10, borderRadius:'50%', background:n.c, flexShrink:0, marginTop:3 }}/>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:3 }}>
                <p style={{ fontSize:12, fontWeight:700, color:C.type }}>{n.t}</p>
                {!n.read&&<div style={{ width:6, height:6, borderRadius:'50%', background:n.c }}/>}
              </div>
              <p style={{ fontSize:11, color:C.sub, lineHeight:1.5 }}>{n.b}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Status Badges ─────────────────────────────────────────────────────────────
function StatusBadgesView() {
  return (
    <div style={{ maxWidth:680, margin:'0 auto', padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:18 }}>Status Badges</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
        {Object.entries(SBADGES).map(([k,s],i)=>(
          <Card key={i} style={{ padding:18, display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
            <div style={{ width:12, height:12, borderRadius:'50%', background:s.color }}/>
            <SBdg status={k} />
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Empty / Loading / Error / Success ────────────────────────────────────────
function EmptyStates() {
  return (
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:16 }}>Empty States</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        {[{t:'No Reports',d:'No reports generated yet. Configure analytics to get started.'},{t:'No Alerts',d:'No security alerts. Platform running without incidents.'},{t:'No Backups',d:'No backups found. Configure a backup schedule to protect your data.'},{t:'No Blog Posts',d:'No blog articles published. Create your first article.'},{t:'No Pages',d:'No pages configured in the CMS. Add your first page.'}].map((s,i)=>(
          <Card key={i} style={{ padding:'38px 22px', textAlign:'center' as const }}>
            <div style={{ width:48, height:48, borderRadius:16, background:`${C.purple}08`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
              <span style={{ display:'flex', color:`${C.purple}60`, transform:'scale(1.3)' }}>{I.badge}</span>
            </div>
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
    <div style={{ padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:16 }}>Loading States</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        {['Loading Dashboard','Loading Analytics','Loading CMS','Loading AI','Loading Reports'].map((l,i)=>(
          <Card key={i} style={{ padding:22 }}>
            <p style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:14 }}>{l}</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:14 }}>
              {[...Array(4)].map((_,j)=><div key={j} style={{ height:56, borderRadius:10, background:'#F2F4F5' }}/>)}
            </div>
            {[...Array(3)].map((_,j)=>(
              <div key={j} style={{ display:'flex', gap:10, padding:'9px 0', borderBottom:j<2?`1px solid ${C.border}`:'none' }}>
                <div style={{ width:34, height:34, borderRadius:'50%', background:'#E4E8EA', flexShrink:0 }}/>
                <div style={{ flex:1 }}><Shimmer h={11} w="65%"/><div style={{height:5}}/><Shimmer h={9} w="40%"/></div>
              </div>
            ))}
          </Card>
        ))}
      </div>
    </div>
  )
}

function ErrorStates({ onToast }:{ onToast:(m:string)=>void }) {
  return (
    <div style={{ maxWidth:580, margin:'0 auto', padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:16 }}>Error States</h2>
      {[{t:'API Failure',        d:'Integration endpoint unreachable. Service may be down.', c:C.error},{t:'Backup Failed',      d:'Last backup failed. Storage quota may be exceeded.',   c:C.error},{t:'Deployment Failed', d:'Deployment to staging failed at step 4/6.',             c:C.error},{t:'CMS Error',          d:'Content management service temporarily unavailable.',   c:C.warning}].map((er,i)=>(
        <Card key={i} style={{ padding:20, marginBottom:12, border:`1.5px solid ${er.c}30`, background:`${er.c}04` }}>
          <div style={{ display:'flex', gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:`${er.c}12`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ display:'flex', color:er.c, transform:'scale(1.1)' }}>{I.alert}</span>
            </div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:13, fontWeight:800, color:er.c, marginBottom:4 }}>{er.t}</p>
              <p style={{ fontSize:11, color:C.sub, marginBottom:10 }}>{er.d}</p>
              <Btn label="Retry" variant="secondary" small icon={I.refresh} onClick={()=>onToast('Retrying…')} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

function SuccessStates() {
  return (
    <div style={{ maxWidth:580, margin:'0 auto', padding:'20px 24px 60px' }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.type, fontFamily:'Manrope,sans-serif', marginBottom:16 }}>Success States</h2>
      {[{t:'Settings Saved',         d:'Platform configuration updated successfully.',         c:C.success},{t:'Feature Enabled',        d:'AI Voice Notes enabled for Staging environment.',     c:C.purple},{t:'Deployment Successful',  d:'v2.9.0-rc deployed to Staging. All health checks passed.',c:C.success},{t:'Backup Completed',       d:'Full backup (842 GB) completed in 48 minutes.',           c:C.primary},{t:'Article Published',      d:'"5 Signs Your Parent Needs Care" is now live.',           c:C.success}].map((s,i)=>(
        <Card key={i} style={{ padding:18, marginBottom:10, border:`1.5px solid ${s.c}30`, background:`${s.c}04` }}>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <div style={{ width:40, height:40, borderRadius:12, background:`${s.c}12`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ display:'flex', color:s.c, transform:'scale(1.1)' }}>{I.check}</span>
            </div>
            <div>
              <p style={{ fontSize:13, fontWeight:700, color:s.c, marginBottom:2 }}>{s.t}</p>
              <p style={{ fontSize:11, color:C.sub }}>{s.d}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Sub-view type ────────────────────────────────────────────────────────────
type SubView = 'home'|'settings'|'branding'|'flags'|'cms'|'pageBuilder'|'blog'|'media'|'faq'|'i18n'|'notifMgmt'|'ai'|'prompts'|'bi'|'sysAnalytics'|'security'|'integrations'|'automation'|'audit'|'backup'|'health'|'releases'|'access'|'reports'|'notifications'|'statusBadges'|'empty'|'loading'|'error'|'success'

const NAV: { k:SubView; l:string; icon:ReactNode; group:string }[] = [
  { k:'home',         l:'Super Admin Dashboard', icon:I.home,      group:'Overview'  },
  { k:'settings',     l:'Platform Settings',     icon:I.settings,  group:'Overview'  },
  { k:'branding',     l:'Branding Center',       icon:I.brand,     group:'Overview'  },
  { k:'flags',        l:'Feature Flags',         icon:I.flag,      group:'Overview'  },
  { k:'cms',          l:'CMS Dashboard',         icon:I.cms,       group:'Content'   },
  { k:'pageBuilder',  l:'Visual Page Builder',   icon:I.page,      group:'Content'   },
  { k:'blog',         l:'Blog Management',       icon:I.blog,      group:'Content'   },
  { k:'media',        l:'Media Library',         icon:I.media,     group:'Content'   },
  { k:'faq',          l:'FAQ Management',        icon:I.faq,       group:'Content'   },
  { k:'i18n',         l:'Localization',          icon:I.i18n,      group:'Content'   },
  { k:'notifMgmt',    l:'Notification Templates',icon:I.notif,     group:'Content'   },
  { k:'ai',           l:'AI Operations',         icon:I.ai,        group:'AI & Ops'  },
  { k:'prompts',      l:'Prompt Library',        icon:I.prompt,    group:'AI & Ops'  },
  { k:'bi',           l:'Business Intelligence', icon:I.bi,        group:'AI & Ops'  },
  { k:'sysAnalytics', l:'System Analytics',      icon:I.sysmon,    group:'AI & Ops'  },
  { k:'security',     l:'Security Center',       icon:I.security,  group:'Security'  },
  { k:'integrations', l:'API & Integrations',    icon:I.api,       group:'Security'  },
  { k:'automation',   l:'Automation Center',     icon:I.auto,      group:'Security'  },
  { k:'audit',        l:'Audit Center',          icon:I.audit,     group:'Security'  },
  { k:'backup',       l:'Backup & Recovery',     icon:I.backup,    group:'Security'  },
  { k:'health',       l:'System Health',         icon:I.health,    group:'Security'  },
  { k:'releases',     l:'Release Management',    icon:I.release,   group:'Security'  },
  { k:'access',       l:'Access Control',        icon:I.access,    group:'Security'  },
  { k:'reports',      l:'Reports',               icon:I.report,    group:'Dev'       },
  { k:'notifications',l:'Notifications',         icon:I.bell,      group:'Dev'       },
  { k:'statusBadges', l:'Status Badges',         icon:I.badge,     group:'Dev'       },
  { k:'empty',        l:'Empty States',          icon:I.flag,      group:'Dev'       },
  { k:'loading',      l:'Loading States',        icon:I.refresh,   group:'Dev'       },
  { k:'error',        l:'Error States',          icon:I.alert,     group:'Dev'       },
  { k:'success',      l:'Success States',        icon:I.check,     group:'Dev'       },
]

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function SuperAdminPlatform() {
  const [sub, setSub] = useState<SubView>('home')
  const [toast, setToast] = useState<string|null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const showToast = (m:string) => { setToast(m); setTimeout(()=>setToast(null),2800) }
  const groups = [...new Set(NAV.map(n=>n.group))]

  const fullHeight = sub==='pageBuilder'

  const renderMain = () => {
    switch(sub) {
      case 'home':         return <SADashboard onNav={setSub} onToast={showToast} />
      case 'settings':     return <PlatformSettings onToast={showToast} />
      case 'branding':     return <BrandingCenter onToast={showToast} />
      case 'flags':        return <FeatureFlags onToast={showToast} />
      case 'cms':          return <CMSDashboard onNav={setSub} onToast={showToast} />
      case 'pageBuilder':  return <PageBuilder onToast={showToast} />
      case 'blog':         return <BlogManagement onToast={showToast} />
      case 'media':        return <MediaLibrary onToast={showToast} />
      case 'faq':          return <FAQManagement onToast={showToast} />
      case 'i18n':         return <LocalizationCenter onToast={showToast} />
      case 'notifMgmt':    return <NotificationManagement onToast={showToast} />
      case 'ai':           return <AIOperationsCenter onNav={setSub} onToast={showToast} />
      case 'prompts':      return <PromptManagement onToast={showToast} />
      case 'bi':           return <BusinessIntelligence />
      case 'sysAnalytics': return <SystemAnalytics />
      case 'security':     return <SecurityCenter onToast={showToast} />
      case 'integrations': return <APIIntegrations onToast={showToast} />
      case 'automation':   return <AutomationCenter onToast={showToast} />
      case 'audit':        return <AuditCenter onToast={showToast} />
      case 'backup':       return <BackupRecovery onToast={showToast} />
      case 'health':       return <SystemHealth />
      case 'releases':     return <ReleaseManagement onToast={showToast} />
      case 'access':       return <AccessControl onToast={showToast} />
      case 'reports':      return <SAReports onToast={showToast} />
      case 'notifications':return <SANotifications />
      case 'statusBadges': return <StatusBadgesView />
      case 'empty':        return <EmptyStates />
      case 'loading':      return <LoadingStates />
      case 'error':        return <ErrorStates onToast={showToast} />
      case 'success':      return <SuccessStates />
      default: return null
    }
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:C.bg, fontFamily:'Manrope,sans-serif' }}>
      {/* Sidebar */}
      <div className="sa-sidebar" style={{ width:224, background:C.dark, display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh', overflowY:'auto', flexShrink:0 }}>
        <div style={{ padding:'16px 18px 14px', borderBottom:`1px solid ${C.darkSub}` }}>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <div style={{ width:30, height:30, borderRadius:9, background:`linear-gradient(135deg,${C.purple},#5B21B6)`, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ display:'flex', color:'white', transform:'scale(0.85)' }}>{I.security}</span>
            </div>
            <div>
              <p style={{ fontSize:13, fontWeight:900, color:'rgba(255,255,255,0.95)', fontFamily:'Manrope,sans-serif', lineHeight:1 }}>ReadyPal</p>
              <p style={{ fontSize:9, color:'rgba(255,255,255,0.4)', fontWeight:700, textTransform:'uppercase' as const, letterSpacing:'0.08em' }}>Super Admin</p>
            </div>
          </div>
        </div>
        {groups.map(group=>(
          <div key={group}>
            <p style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.28)', textTransform:'uppercase' as const, letterSpacing:'0.09em', padding:'10px 18px 4px' }}>{group}</p>
            {NAV.filter(n=>n.group===group).map(n=>{
              const active = sub===n.k
              return (
                <button key={n.k} onClick={()=>{ setSub(n.k); setSidebarOpen(false) }}
                  style={{ width:'100%', display:'flex', gap:9, alignItems:'center', padding:'9px 18px', border:'none', background:active?`${C.purple}22`:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:active?700:400, color:active?'rgba(255,255,255,0.95)':'rgba(255,255,255,0.5)', textAlign:'left' as const, borderLeft:active?`3px solid ${C.purple}`:'3px solid transparent', transition:'all 0.12s' }}>
                  <span style={{ display:'flex', color:active?C.purple:'rgba(255,255,255,0.32)', flexShrink:0 }}>{n.icon}</span>
                  <span style={{ flex:1 }}>{n.l}</span>
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* Mobile overlay */}
      {sidebarOpen&&(
        <div style={{ position:'fixed', inset:0, zIndex:50, background:'rgba(0,0,0,0.5)' }} onClick={()=>setSidebarOpen(false)}>
          <div onClick={e=>e.stopPropagation()} style={{ width:240, height:'100%', background:C.dark, overflowY:'auto' }}>
            <div style={{ padding:'16px 18px', borderBottom:`1px solid ${C.darkSub}` }}>
              <p style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.9)' }}>Super Admin</p>
            </div>
            {NAV.map(n=>(
              <button key={n.k} onClick={()=>{ setSub(n.k); setSidebarOpen(false) }}
                style={{ width:'100%', display:'flex', gap:9, alignItems:'center', padding:'10px 18px', border:'none', background:sub===n.k?`${C.purple}22`:'transparent', cursor:'pointer', fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:sub===n.k?700:400, color:sub===n.k?'rgba(255,255,255,0.95)':'rgba(255,255,255,0.5)', textAlign:'left' as const }}>
                <span style={{ display:'flex', color:sub===n.k?C.purple:'rgba(255,255,255,0.32)' }}>{n.icon}</span>{n.l}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        {/* Topbar */}
        <div style={{ height:52, background:C.surface, borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', paddingInline:20, gap:12, position:'sticky', top:0, zIndex:30, flexShrink:0 }}>
          <button className="sa-menu-btn" onClick={()=>setSidebarOpen(v=>!v)}
            style={{ background:'none', border:'none', cursor:'pointer', color:C.type, padding:4, display:'none' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
          <div style={{ flex:1, display:'flex', gap:8, alignItems:'center', maxWidth:360, padding:'7px 12px', borderRadius:9, border:`1px solid ${C.border}`, background:'#FAFAFA' }}>
            <span style={{ display:'flex', color:C.muted }}>{I.search}</span>
            <input placeholder="Search settings, features, logs…" style={{ border:'none', background:'transparent', fontFamily:'Manrope,sans-serif', fontSize:12, color:C.type, outline:'none', flex:1 }} />
          </div>
          <div style={{ marginLeft:'auto', display:'flex', gap:6, alignItems:'center' }}>
            <div style={{ display:'flex', gap:6, alignItems:'center', padding:'4px 10px', borderRadius:99, background:`${C.success}08`, border:`1px solid ${C.success}25` }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:C.success, animation:'pulse-dot 1s ease-in-out infinite' }}/>
              <p style={{ fontSize:10, fontWeight:700, color:C.success }}>All Systems Operational</p>
            </div>
            <Bdg label="v2.8.1" color={C.purple} />
            <Bdg label="ReadyPal Healthcare" color={C.sub} />
          </div>
        </div>
        <div style={{ flex:1, overflowY:fullHeight?'hidden':'auto' }}>
          {renderMain()}
        </div>
      </div>

      {toast&&<Toast msg={toast} />}
    </div>
  )
}
