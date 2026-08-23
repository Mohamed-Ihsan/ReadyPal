import { supabase } from "./supabaseClient"

export async function getCurrentProfile() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not logged in')
  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (error) throw error
  return data
}

export async function updateProfile(fields: Record<string, any>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not logged in')
  const { error } = await supabase.from('profiles').update(fields).eq('id', user.id)
  if (error) throw error
}

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    throw error
  }

  return user
}

export async function getMyProfile() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function updateMyProfile(updates: {
  full_name?: string
  preferred_name?: string
  nic?: string
  date_of_birth?: string
  nationality?: string
  phone?: string
  email?: string
  emergency_contact?: string
  address?: string
  gender?: string
  province?: string
  district?: string
  city?: string
  postal_code?: string
}) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function getMyAgentDetails() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data, error } = await supabase
    .from("agent_details")
    .select("*")
    .eq("id", user.id)
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function getAgentsForBrowse() {
  const { data, error } = await supabase
    .from('agent_details')
    .select('*, profiles(full_name, gender, city, province, district)')
  if (error) throw error

  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.profiles?.full_name || 'Unnamed Agent',
    age: row.age || 0,
    gender: row.profiles?.gender || '',
    city: row.profiles?.city || '',
    province: row.profiles?.province || '',
    district: row.profiles?.district || '',
    rating: row.rating || 0,
    reviews: row.review_count || 0,
    jobs: row.jobs_completed || 0,
    responseTime: row.response_time || '',
    experience: row.experience_years || 0,
    hourlyRate: row.hourly_rate || 0,
    maxRate: row.max_rate || 0,
    languages: row.languages || [],
    skills: row.skills || [],
    verified: row.verified || false,
    policeCleared: row.police_cleared || false,
    medCertified: row.med_certified || false,
    vehicleAvail: row.vehicle_avail || false,
    emergencyReady: row.emergency_ready || false,
    availability: row.availability || 'Booked',
    lastActive: row.last_active || '',
    bio: row.bio || '',
    education: row.education || '',
    badges: row.badges || [],
    matchScore: 0,
    lat: row.lat || 0,
    lng: row.lng || 0,
  }))
}

export async function getAgentDetail(id: string) {
  const { data, error } = await supabase
    .from('agent_details')
    .select('*, profiles(full_name, gender, city, province, district)')
    .eq('id', id)
    .single()
  if (error) throw error

  return {
    name: data.profiles?.full_name || 'Unnamed Agent',
    age: data.age || 0,
    gender: data.profiles?.gender || '',
    city: data.profiles?.city || '',
    province: data.profiles?.province || '',
    district: data.profiles?.district || '',
    rating: data.rating || 0,
    reviews: data.review_count || 0,
    jobs: data.jobs_completed || 0,
    responseTime: data.response_time || '',
    experience: data.experience_years || 0,
    hourlyRate: data.hourly_rate || 0,
    languages: data.languages || [],
    skills: data.skills || [],
    verified: data.verified || false,
    policeCleared: data.police_cleared || false,
    medCertified: data.med_certified || false,
    vehicleAvail: data.vehicle_avail || false,
    emergencyReady: data.emergency_ready || false,
    availability: data.availability || 'Booked',
    lastActive: data.last_active || '',
    bio: data.bio || '',
    badges: data.badges || [],
  }
}

export async function createCareRequestFromWizard(data: any, clientId: string) {
  const { data: row, error } = await supabase.from('care_requests').insert({
    client_id: clientId,
    beneficiary_id: data.beneficiaryId || null,
    title: data.beneficiaryName ? `Care for ${data.beneficiaryName}` : 'New Care Request',
    service_type: data.services[0] || '',
    tasks: data.services,
    required_skills: data.requiredSkills,
    languages: data.languages,
    agent_gender_pref: data.agentGender,
    scheduled_date: data.date || null,
    scheduled_time: data.time || null,
    duration: data.duration,
    recurring: data.recurring,
    frequency: data.frequency,
    budget_min: data.budget,
    budget_max: data.budget,
    currency: data.currency.split(' ')[0], // "LKR – Sri Lankan Rupee" -> "LKR"
    negotiable: data.negotiable,
    city: data.city,
    province: data.province,
    address1: data.address1,
    address2: data.address2,
    postal_code: data.postalCode,
    landmarks: data.landmarks,
    access_notes: data.accessNotes,
    instructions: data.instructions,
    med_conditions: data.medConditions,
    mobility: data.mobility,
    emergency_contact: { name: data.emergencyName, phone: data.emergencyPhone },
    household_notes: data.householdNotes,
    parking_notes: data.parkingNotes,
    has_pets: data.hasPets,
    parking_avail: data.parkingAvail,
    status: 'open',
  }).select().single()

  if (error) throw error
  return row
}


export async function getBeneficiaries(clientId: string) {
  const { data, error } = await supabase.from('beneficiaries').select('*').eq('client_id', clientId)
  if (error) throw error
  return data
}

export async function createBeneficiary(fields: Record<string, any>, clientId: string) {
  const { data, error } = await supabase.from('beneficiaries').insert({ ...fields, client_id: clientId }).select().single()
  if (error) throw error
  return data
}


export async function getCareRequestDetail(id: string) {
  const { data, error } = await supabase
    .from('care_requests')
    .select('*, beneficiaries(name, age)')
    .eq('id', id)
    .single()
  if (error) throw error

  const { count: appCount } = await supabase.from('applications').select('*', { count: 'exact', head: true }).eq('care_request_id', id)
  const { count: shortlistedCount } = await supabase.from('applications').select('*', { count: 'exact', head: true }).eq('care_request_id', id).eq('status', 'shortlisted')

  return {
    id: data.id,
    title: data.title,
    service: data.service_type,
    beneficiary: data.beneficiaries ? `${data.beneficiaries.name}${data.beneficiaries.age ? ', ' + data.beneficiaries.age : ''}` : '',
    budget: `${data.currency} ${data.budget_min}–${data.budget_max}`,
    dates: data.scheduled_date || '',
    status: data.status,
    views: data.views || 0,
    applications: appCount || 0,
    shortlisted: shortlistedCount || 0,
  }
}

export async function getApplicationsForRequest(careRequestId: string) {
  const { data, error } = await supabase
    .from('applications')
    .select('*, profiles!agent_id(full_name, city, agent_details(*))')
    .eq('care_request_id', careRequestId)
  if (error) throw error

  return (data || []).map((row: any) => {
    const ad = row.profiles?.agent_details
    return {
      id: row.id,
      name: row.profiles?.full_name || 'Unknown Agent',
      city: row.profiles?.city || '',
      rating: ad?.rating || 0,
      reviews: ad?.review_count || 0,
      jobs: ad?.jobs_completed || 0,
      experience: ad?.experience_years || 0,
      price: row.price || 0,
      originalPrice: row.original_price || row.price || 0,
      duration: row.duration || '',
      languages: ad?.languages || [],
      skills: ad?.skills || [],
      verified: ad?.verified || false,
      policeCleared: ad?.police_cleared || false,
      medCertified: ad?.med_certified || false,
      responseTime: ad?.response_time || '',
      distance: '—',
      appliedDate: row.applied_at || '',
      status: row.status,
      trustScore: row.trust_score_snapshot || 0,
      coverLetter: row.cover_letter || '',
      notes: row.notes || '',
      repeatClients: 0,
      matchScore: row.match_score || 0,
      agentId: row.agent_id,
    }
  })
}

export async function updateApplicationStatus(applicationId: string, status: string) {
  const { error } = await supabase.from('applications').update({ status }).eq('id', applicationId)
  if (error) throw error
}

export async function hireApplication(applicationId: string, careRequestId: string, agentId: string, clientId: string, beneficiaryId: string) {
  await supabase.from('applications').update({ status: 'hired' }).eq('id', applicationId)
  await supabase.from('care_requests').update({ status: 'assigned' }).eq('id', careRequestId)
  const { error } = await supabase.from('bookings').insert({
    care_request_id: careRequestId,
    application_id: applicationId,
    client_id: clientId,
    agent_id: agentId,
    beneficiary_id: beneficiaryId,
    status: 'confirmed',
  })
  if (error) throw error
}

export async function getDashboardOverview(clientId: string) {
  const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', clientId).single()

  const { data: requests } = await supabase
    .from('care_requests')
    .select('id, title, status, scheduled_date, city, applications(count)')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
    .limit(6)

  const requestIds = (requests || []).map((r: any) => r.id)
  let bookingsByRequest: Record<string, string> = {}
  if (requestIds.length) {
    const { data: bookings } = await supabase
      .from('bookings')
      .select('care_request_id, profiles!agent_id(full_name)')
      .in('care_request_id', requestIds)
    bookingsByRequest = Object.fromEntries((bookings || []).map((b: any) => [b.care_request_id, b.profiles?.full_name || 'Agent']))
  }

  const progressMap: Record<string, number> = { open:0, applied:20, shortlisted:30, assigned:60, in_progress:65, completed:100, cancelled:0, expired:0 }

  const mappedRequests = (requests || []).map((r: any) => ({
    id: r.id,
    title: r.title,
    status: r.status,
    agent: bookingsByRequest[r.id] || (r.applications?.[0]?.count ? `${r.applications[0].count} agents applied` : '—'),
    date: r.scheduled_date || '',
    location: r.city || '',
    progress: progressMap[r.status] ?? 0,
  }))

  const { data: notifs } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', clientId)
    .order('created_at', { ascending: false })
    .limit(5)

  const { count: activeRequests } = await supabase
    .from('care_requests')
    .select('*', { count: 'exact', head: true })
    .eq('client_id', clientId)
    .in('status', ['open','applied','shortlisted','assigned','in_progress'])

  const today = new Date().toISOString().slice(0, 10)
  const { count: upcomingVisits } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('client_id', clientId)
    .in('status', ['confirmed','assigned'])
    .gte('scheduled_date', today)

  return {
    fullName: profile?.full_name || 'there',
    requests: mappedRequests,
    notifications: (notifs || []).map((n: any) => ({
      title: n.title, detail: n.body, time: n.created_at, unread: !n.read, color: '#00737A',
    })),
    counts: { upcomingVisits: upcomingVisits || 0, activeRequests: activeRequests || 0 },
  }
}

export async function getAllCareRequests(clientId: string) {
  const { data: requests } = await supabase
    .from('care_requests')
    .select('id, title, status, scheduled_date, city, budget_min, budget_max, currency, applications(count)')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })

  const requestIds = (requests || []).map((r: any) => r.id)
  let bookingsByRequest: Record<string, string> = {}
  if (requestIds.length) {
    const { data: bookings } = await supabase
      .from('bookings')
      .select('care_request_id, profiles!agent_id(full_name)')
      .in('care_request_id', requestIds)
    bookingsByRequest = Object.fromEntries((bookings || []).map((b: any) => [b.care_request_id, b.profiles?.full_name || 'Agent']))
  }

  const progressMap: Record<string, number> = { open:0, applied:20, shortlisted:30, assigned:60, in_progress:65, completed:100, cancelled:0, expired:0 }

  return (requests || []).map((r: any) => ({
    id: r.id,
    title: r.title,
    status: (r.status || 'open').replace('_', '-'),
    agent: bookingsByRequest[r.id] || (r.applications?.[0]?.count ? `${r.applications[0].count} agents applied` : '—'),
    date: r.scheduled_date || '',
    loc: r.city || '',
    budget: r.budget_max ? `${r.currency || 'LKR'} ${Number(r.budget_max).toLocaleString()}` : '—',
    progress: progressMap[r.status] ?? 0,
  }))
}


export async function getAllNotifications(clientId: string) {
  const { data } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', clientId)
    .order('created_at', { ascending: false })

  const validTypes = ['request', 'visit', 'payment', 'review', 'task', 'system']
  return (data || []).map((n: any) => ({
    title: n.title || 'Notification',
    detail: n.body || '',
    time: n.created_at ? new Date(n.created_at).toLocaleString() : '',
    type: validTypes.includes(n.type) ? n.type : 'system',
    unread: !n.read,
  }))
}

export async function getPaymentsData(clientId: string) {
  const { data } = await supabase
    .from('transactions')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })

  const rows = data || []
  const paid = rows.filter((r: any) => r.status === 'completed' && r.type === 'payment').reduce((s: number, r: any) => s + Number(r.amount || 0), 0)
  const outstanding = rows.filter((r: any) => r.status === 'pending').reduce((s: number, r: any) => s + Number(r.amount || 0), 0)
  const openInvoices = rows.filter((r: any) => r.status === 'pending').length

  return {
    summary: { walletBalance: 0, outstanding, paid, openInvoices },
    history: rows.map((r: any) => ({
      id: r.id.slice(0, 8).toUpperCase(),
      desc: r.method ? `${r.type} via ${r.method}` : r.type,
      date: r.created_at ? new Date(r.created_at).toLocaleDateString() : '',
      amount: `${r.currency || 'LKR'} ${Number(r.amount || 0).toLocaleString()}`,
      status: r.status,
    })),
  }
}

export async function getMyReviews(clientId: string) {
  const { data } = await supabase
    .from('reviews')
    .select('*, profiles!reviewee_id(full_name), bookings(care_requests(service_type))')
    .eq('reviewer_id', clientId)
    .order('created_at', { ascending: false })

  return (data || []).map((r: any) => ({
    agent: r.profiles?.full_name || 'Agent',
    date: r.created_at ? new Date(r.created_at).toLocaleDateString() : '',
    rating: r.rating || 0,
    text: r.comment || '',
    service: r.bookings?.care_requests?.service_type || 'Care Service',
  }))
}


export async function getMyAgents(clientId: string) {
  const { data: bookings } = await supabase
    .from('bookings')
    .select('agent_id, profiles!agent_id(full_name, city, agent_details(*))')
    .eq('client_id', clientId)

  const seen = new Set<string>()
  const agents: any[] = []
  for (const b of bookings || []) {
    if (!b.agent_id || seen.has(b.agent_id)) continue
    seen.add(b.agent_id)
    const ad = (b.profiles as any)?.agent_details
    agents.push({
      id: b.agent_id,
      name: (b.profiles as any)?.full_name || 'Agent',
      rating: ad?.rating || 0,
      jobs: ad?.jobs_completed || 0,
      langs: ad?.languages || [],
      dist: '—',
      loc: (b.profiles as any)?.city || '',
      avail: ad?.availability === 'Available Now',
      services: ad?.skills || [],
    })
  }
  return agents
}

export async function getMyConversations(clientId: string) {
  const { data: myParts } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('user_id', clientId)

  const convIds = (myParts || []).map((p: any) => p.conversation_id)
  if (!convIds.length) return []

  const { data: conversations } = await supabase.from('conversations').select('*').in('id', convIds)

  const { data: allParts } = await supabase
    .from('conversation_participants')
    .select('conversation_id, user_id, profiles(full_name)')
    .in('conversation_id', convIds)

  const { data: lastMsgs } = await supabase
    .from('messages')
    .select('conversation_id, text, created_at')
    .in('conversation_id', convIds)
    .order('created_at', { ascending: false })

  const lastByConv: Record<string, any> = {}
  for (const m of lastMsgs || []) {
    if (!lastByConv[m.conversation_id]) lastByConv[m.conversation_id] = m
  }

  return (conversations || []).map((c: any) => {
    const other = (allParts || []).find((p: any) => p.conversation_id === c.id && p.user_id !== clientId)
    const last = lastByConv[c.id]
    return {
      id: c.id,
      name: (other?.profiles as any)?.full_name || c.name || 'Conversation',
      role: c.category === 'support' ? 'Support' : 'Care Agent',
      last: last?.text || 'No messages yet',
      time: last?.created_at ? new Date(last.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
    }
  })
}

export async function getConversationMessages(conversationId: string) {
  const { data } = await supabase.from('messages').select('*').eq('conversation_id', conversationId).order('created_at', { ascending: true })
  return data || []
}

export async function sendMessage(conversationId: string, senderId: string, text: string) {
  const { error } = await supabase.from('messages').insert({ conversation_id: conversationId, sender_id: senderId, type: 'text', text, status: 'sent' })
  if (error) throw error
}

export async function getBeneficiariesFull(clientId: string) {
  const { data: rows } = await supabase
    .from('beneficiaries')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })

  const ids = (rows || []).map((r: any) => r.id)
  let bookingsByBene: Record<string, any[]> = {}
  if (ids.length) {
    const { data: bookings } = await supabase
      .from('bookings')
      .select('beneficiary_id, status, scheduled_date, scheduled_time, profiles!agent_id(full_name)')
      .in('beneficiary_id', ids)
      .order('scheduled_date', { ascending: true })
    for (const b of bookings || []) {
      const key = b.beneficiary_id
      if (!bookingsByBene[key]) bookingsByBene[key] = []
      bookingsByBene[key].push(b)
    }
  }

  const careStatusMap: Record<string, string> = { assigned:'In Progress', confirmed:'In Progress', in_progress:'In Progress', completed:'Completed', cancelled:'Cancelled', rescheduled:'In Progress' }

  return (rows || []).map((r: any) => {
    const bks = bookingsByBene[r.id] || []
    const today = new Date().toISOString().slice(0, 10)
    const upcoming = bks.find((b: any) => b.scheduled_date >= today) || bks[bks.length - 1]
    return {
      id: r.id, name: r.name, preferred: r.preferred_name || r.name, dob: r.dob || '', age: r.age || 0,
      gender: r.gender || '', relationship: r.relationship || '', nic: r.nic || '', province: r.province || '',
      city: r.city || '', address: r.address || '', postalCode: r.postal_code || '', landmark: r.landmark || '',
      bloodGroup: r.blood_group || '', allergies: r.allergies || '', conditions: r.conditions || [],
      medications: r.medications || [], doctor: r.doctor || '', hospital: r.hospital || '', mobility: r.mobility || '',
      vision: r.vision || '', hearing: r.hearing || '', memory: r.memory || '', medNotes: r.med_notes || '',
      emergencyContacts: r.emergency_contacts || [], prefLang: r.pref_languages || [], prefGender: r.pref_gender || '',
      dietary: r.dietary || '', religious: r.religious || '', visitTimes: r.visit_times || '', commPref: r.comm_pref || '',
      specialReq: r.special_req || '', documents: [], careHistory: [], notes: [],
      status: r.status || 'active',
      careStatus: upcoming ? (careStatusMap[upcoming.status] || 'Open Request') : 'Open Request',
      assignedAgent: (upcoming?.profiles as any)?.full_name || '—',
      nextVisit: upcoming?.scheduled_date ? `${upcoming.scheduled_date}${upcoming.scheduled_time ? ' · ' + upcoming.scheduled_time : ''}` : '—',
      rating: 0,
    }
  })
}