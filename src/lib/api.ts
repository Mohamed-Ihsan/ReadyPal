import { supabase } from "./supabaseClient"

// ─── Avatars ────────────────────────────────────────────────────────────────
// profiles.avatar_url is normally already a fully-qualified public URL (see
// uploadProfilePhoto below), but resolves defensively here too in case a row
// ever holds a bare storage path (legacy data, a manual DB edit, etc.) so
// every screen that reads a profile gets something an <img> can load.
export function resolveAvatarUrl(path?: string | null): string | null {
  if (!path) return null
  if (/^https?:\/\//i.test(path) || path.startsWith("data:")) return path
  const { data } = supabase.storage.from("avatars").getPublicUrl(path)
  return data.publicUrl
}

// Lets UI that isn't in the same component tree as an avatar upload (the
// global Navbar, a dashboard's own sidebar) pick up a new photo immediately
// instead of waiting for their next full profile re-fetch.
type ProfilePatchListener = (patch: Record<string, any>) => void
const profilePatchListeners = new Set<ProfilePatchListener>()
export function onProfileUpdate(listener: ProfilePatchListener) {
  profilePatchListeners.add(listener)
  return () => { profilePatchListeners.delete(listener) }
}
function emitProfileUpdate(patch: Record<string, any>) {
  profilePatchListeners.forEach(listener => listener(patch))
}

export async function getCurrentProfile() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not logged in')
  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (error) throw error
  return { ...data, avatar_url: resolveAvatarUrl(data.avatar_url) }
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

  return { ...data, avatar_url: resolveAvatarUrl(data.avatar_url) }
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
  avatar_url?: string
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
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}

// Live marketplace-visibility flag shown on agent cards elsewhere in the app
// (getAgentsForBrowse/getAgentDetail read this same column) — kept as its
// own narrow update rather than folded into saveMyAgentDetails, since that
// function's typed input is for the onboarding/profile-edit fields, not
// this one-off toggle.
export async function updateMyAvailability(availability: "Available Now" | "Available Today" | "Available Tomorrow" | "Booked") {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data, error } = await supabase
    .from("agent_details")
    .update({ availability })
    .eq("id", user.id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}


export async function signUpUser(
  email: string,
  password: string,
  fullName: string,
  role: "client" | "agent" = "client"
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
      },
    },
  })

  if (error) {
    throw error
  }

  return data
}

export async function signInUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw error
  }

  return data
}

// Redirects to Google's consent screen, then back to /auth — not the bare
// site origin — so AuthOnboarding's own auth-state listener (which already
// knows how to route a returning user by their real stored role, and falls
// back to /dashboard if no profile row exists yet) is what picks the
// session back up, instead of needing a second copy of that logic on the
// page the origin resolves to.
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth`,
    },
  })

  if (error) {
    throw error
  }

  return data
}


export async function uploadProfilePhoto(file: File) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Please select an image file")
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image must be smaller than 5MB")
  }

  const filePath = `${user.id}/avatar`

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
      cacheControl: "0",
    })

  if (uploadError) {
    throw uploadError
  }

  const { data } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath)

  const avatarUrl = `${data.publicUrl}?v=${Date.now()}`

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .update({
      avatar_url: avatarUrl,
    })
    .eq("id", user.id)
    .select()
    .single()

  if (profileError) {
    throw profileError
  }

  emitProfileUpdate({ avatar_url: avatarUrl })

  return {
    avatarUrl,
    profile,
  }
}

// ─── Account Settings: activity log ────────────────────────────────────────
// Best-effort: a failed log write should never block the real action (a
// password change, a profile edit) that triggered it, so this swallows its
// own errors instead of throwing.
export async function logUserActivity(
  eventType: string,
  description?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    const user = await getCurrentUser()
    if (!user) return
    const { error } = await supabase.from('user_activity_logs').insert({
      user_id: user.id,
      event_type: eventType,
      description: description ?? null,
      metadata: metadata ?? null,
    })
    if (error) throw error
  } catch (err) {
    console.error('Failed to log user activity:', err)
  }
}

export async function getUserActivityLog(limit = 25) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('No authenticated user found')
  }

  const { data, error } = await supabase
    .from('user_activity_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw error
  }

  return data ?? []
}

export async function deleteUserActivityLog(id: string): Promise<void> {
  const { error } = await supabase.from('user_activity_logs').delete().eq('id', id)
  if (error) {
    throw error
  }
}

// ─── Account Settings: auth (MFA + linked identities) ──────────────────────
export async function getMfaFactors() {
  const { data, error } = await supabase.auth.mfa.listFactors()
  if (error) {
    throw error
  }
  return data
}

export async function getLinkedIdentities() {
  const { data, error } = await supabase.auth.getUserIdentities()
  if (error) {
    throw error
  }
  return data.identities
}

export async function linkOAuthIdentity(provider: 'google' | 'apple' | 'facebook' | 'azure' | 'linkedin_oidc') {
  const { data, error } = await supabase.auth.linkIdentity({ provider })
  if (error) {
    throw error
  }
  return data
}

export async function unlinkOAuthIdentity(identity: Awaited<ReturnType<typeof getLinkedIdentities>>[number]) {
  const { error } = await supabase.auth.unlinkIdentity(identity)
  if (error) {
    throw error
  }
}

// ─── Account Settings: data export ──────────────────────────────────────────
export async function exportMyAccountData() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('No authenticated user found')
  }

  const [{ data: profile, error: profileError }, { data: careRequests, error: crError }, { data: bookings, error: bookingsError }] =
    await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
      supabase.from('care_requests').select('*').eq('client_id', user.id),
      supabase.from('bookings').select('*').eq('client_id', user.id),
    ])

  if (profileError) throw profileError
  if (crError) throw crError
  if (bookingsError) throw bookingsError

  return {
    exported_at: new Date().toISOString(),
    profile: profile ?? null,
    care_requests: careRequests ?? [],
    bookings: bookings ?? [],
  }
}

// ─── Account Settings: account deletion ─────────────────────────────────────
// Soft-delete: flips profiles.status so the account can be recovered/purged
// by a backend process, rather than attempting to delete the auth.users row
// directly from the client (that requires the service role and must happen
// server-side).
export async function requestAccountDeletion(): Promise<void> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('No authenticated user found')
  }
  const { error } = await supabase.from('profiles').update({ status: 'deleted' }).eq('id', user.id)
  if (error) {
    throw error
  }
}

export async function saveMyAgentDetails(details: {
  professional_headline?: string
  bio?: string
  education?: string
  experience_years?: number
  hourly_rate?: number
  max_rate?: number
  languages?: string[]
  current_employer?: string
  previous_employment?: string
  service_areas?: string[]
  lat?: number | null
  lng?: number | null
}) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data, error } = await supabase
    .from("agent_details")
    .upsert(
      {
        id: user.id,
        ...details,
      },
      {
        onConflict: "id",
      }
    )
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}


export async function saveMyAgentSkills(
  skills: {
    service_name: string
    skill_level: string
    experience_years: string
    certified: boolean
  }[]
) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { error: deleteError } = await supabase
    .from("agent_skills")
    .delete()
    .eq("agent_id", user.id)

  if (deleteError) {
    throw deleteError
  }

  if (skills.length === 0) {
    return []
  }

  const rows = skills.map(skill => ({
    agent_id: user.id,
    service_name: skill.service_name,
    skill_level: skill.skill_level,
    experience_years: skill.experience_years,
    certified: skill.certified,
  }))

  const { data, error } = await supabase
    .from("agent_skills")
    .insert(rows)
    .select()

  if (error) {
    throw error
  }

  return data
}

export async function getMyAgentSkills() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data, error } = await supabase
    .from("agent_skills")
    .select("*")
    .eq("agent_id", user.id)
    .order("created_at", { ascending: true })

  if (error) {
    throw error
  }

  return data
}



function certificationSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export async function saveMyCertification(
  certificateName: string,
  file: File | null,
  issueDate: string,
  expiryDate: string
) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const docType = certificationSlug(certificateName)

  let filePath: string | undefined

  // Upload only if user selected a new file
  if (file) {
    if (
      ![
        "application/pdf",
        "image/jpeg",
        "image/png",
      ].includes(file.type)
    ) {
      throw new Error("Only PDF, JPG and PNG files are allowed")
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error("File must be smaller than 10MB")
    }

    filePath = `${user.id}/certifications/${docType}`

    const { error: uploadError } = await supabase.storage
      .from("verification-documents")
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
        cacheControl: "0",
      })

    if (uploadError) {
      throw uploadError
    }
  }

  // Check whether this certificate already exists
  const { data: existing, error: findError } = await supabase
    .from("verification_documents")
    .select("*")
    .eq("agent_id", user.id)
    .eq("doc_type", docType)
    .maybeSingle()

  if (findError) {
    throw findError
  }

  if (existing) {
    const { data, error } = await supabase
      .from("verification_documents")
      .update({
        ...(filePath && { file_url: filePath }),
        issue_date: issueDate || null,
        expiry_date: expiryDate || null,
        status: "pending",
      })
      .eq("id", existing.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  }

  if (!filePath) {
    throw new Error(`Please upload ${certificateName}`)
  }

  const { data, error } = await supabase
    .from("verification_documents")
    .insert({
      agent_id: user.id,
      doc_type: docType,
      file_url: filePath,
      issue_date: issueDate || null,
      expiry_date: expiryDate || null,
      status: "pending",
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function getMyCertifications() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const certificateTypes = [
    "caregiving-certificate",
    "first-aid-certificate",
    "cpr-certificate",
    "nursing-qualification",
    "medical-training-certificate",
    "other-certification",
  ]

  const { data, error } = await supabase
    .from("verification_documents")
    .select("*")
    .eq("agent_id", user.id)
    .in("doc_type", certificateTypes)

  if (error) {
    throw error
  }

  return data
}



export async function deleteMyCertification(docType: string) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data: existing, error: findError } = await supabase
    .from("verification_documents")
    .select("*")
    .eq("agent_id", user.id)
    .eq("doc_type", docType)
    .maybeSingle()

  if (findError) {
    throw findError
  }

  if (!existing) {
    return
  }

  if (existing.file_url) {
    const { error: storageError } = await supabase.storage
      .from("verification-documents")
      .remove([existing.file_url])

    if (storageError) {
      throw storageError
    }
  }

  const { error: deleteError } = await supabase
    .from("verification_documents")
    .delete()
    .eq("id", existing.id)

  if (deleteError) {
    throw deleteError
  }
}



function identityDocSlug(name: string) {
  return name
    .replace(' (Optional)', '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function saveMyIdentityDocument(
  documentName: string,
  file: File
) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const docType = identityDocSlug(documentName)

  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
  ]

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Only PDF, JPG and PNG files are allowed")
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error("File must be smaller than 10MB")
  }

  const filePath = `${user.id}/identity/${docType}`

  const { error: uploadError } = await supabase.storage
    .from("verification-documents")
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
      cacheControl: "0",
    })

  if (uploadError) {
    throw uploadError
  }

  const { data: existing, error: findError } = await supabase
    .from("verification_documents")
    .select("*")
    .eq("agent_id", user.id)
    .eq("doc_type", docType)
    .maybeSingle()

  if (findError) {
    throw findError
  }

  if (existing) {
    const { data, error } = await supabase
      .from("verification_documents")
      .update({
        file_url: filePath,
        status: "pending",
      })
      .eq("id", existing.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  }

  const { data, error } = await supabase
    .from("verification_documents")
    .insert({
      agent_id: user.id,
      doc_type: docType,
      file_url: filePath,
      status: "pending",
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function getMyIdentityDocuments() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const identityTypes = [
    "nic-front",
    "nic-back",
    "police-clearance-certificate",
    "medical-fitness-certificate",
    "passport",
    "driving-licence",
  ]

  const { data, error } = await supabase
    .from("verification_documents")
    .select("*")
    .eq("agent_id", user.id)
    .in("doc_type", identityTypes)

  if (error) {
    throw error
  }

  return data
}



export type BankAccountInput = {
  bank_name: string
  branch: string
  account_name: string
  account_number: string
  swift_code?: string
  payout_preference?: string
}

export async function getMyBankAccount() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data, error } = await supabase
    .from("bank_accounts")
    .select("*")
    .eq("agent_id", user.id)
    .eq("is_default", true)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}

export async function saveMyBankAccount(input: BankAccountInput) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  // Check whether this agent already has a default bank account
  const { data: existing, error: findError } = await supabase
    .from("bank_accounts")
    .select("id")
    .eq("agent_id", user.id)
    .eq("is_default", true)
    .maybeSingle()

  if (findError) {
    throw findError
  }

  // Existing account → update it
  if (existing) {
    const { data, error } = await supabase
      .from("bank_accounts")
      .update({
        bank_name: input.bank_name,
        branch: input.branch,
        account_name: input.account_name,
        account_number: input.account_number,
        swift_code: input.swift_code || null,
        payout_preference: input.payout_preference || null,

        // Bank details changed → require verification again
        verification_status: "pending",
        verified_at: null,
        verified_by: null,
      })
      .eq("id", existing.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  }

  // No account yet → create one
  const { data, error } = await supabase
    .from("bank_accounts")
    .insert({
      agent_id: user.id,
      bank_name: input.bank_name,
      branch: input.branch,
      account_name: input.account_name,
      account_number: input.account_number,
      swift_code: input.swift_code || null,
      payout_preference: input.payout_preference || null,
      is_default: true,

      // New bank account must be checked by Admin / Finance
      verification_status: "pending",
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}



export type AgentAvailabilityInput = {
  working_days: string[]
  preferred_shift: 'morning' | 'afternoon' | 'evening' | 'night'
  emergency_available: boolean
  holiday_available: boolean
  max_weekly_hours: number
  max_travel_distance_km: number
}

export async function getMyAvailability() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data, error } = await supabase
    .from("agent_availability")
    .select("*")
    .eq("agent_id", user.id)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}

export async function saveMyAvailability(
  input: AgentAvailabilityInput
) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data, error } = await supabase
    .from("agent_availability")
    .upsert(
      {
        agent_id: user.id,
        working_days: input.working_days,
        preferred_shift: input.preferred_shift,
        emergency_available: input.emergency_available,
        holiday_available: input.holiday_available,
        max_weekly_hours: input.max_weekly_hours,
        max_travel_distance_km: input.max_travel_distance_km,
        updated_at: new Date().toISOString()
      },
      {
        onConflict: "agent_id"
      }
    )
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}



export type AgentEquipmentTransportInput = {
  has_car: boolean
  has_motorbike: boolean
  has_three_wheeler: boolean
  uses_public_transport: boolean
  has_wheelchair_equipment: boolean
  has_medical_equipment: boolean
  has_smartphone: boolean
  has_internet_access: boolean
}

export async function getMyEquipmentTransport() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data, error } = await supabase
    .from("agent_equipment_transport")
    .select("*")
    .eq("agent_id", user.id)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}

export async function saveMyEquipmentTransport(
  input: AgentEquipmentTransportInput
) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data, error } = await supabase
    .from("agent_equipment_transport")
    .upsert(
      {
        agent_id: user.id,

        has_car: input.has_car,
        has_motorbike: input.has_motorbike,
        has_three_wheeler: input.has_three_wheeler,
        uses_public_transport: input.uses_public_transport,

        has_wheelchair_equipment:
          input.has_wheelchair_equipment,

        has_medical_equipment:
          input.has_medical_equipment,

        has_smartphone: input.has_smartphone,
        has_internet_access: input.has_internet_access,

        updated_at: new Date().toISOString()
      },
      {
        onConflict: "agent_id"
      }
    )
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}



export type AgentReferenceInput = {
  full_name: string
  organisation: string
  relationship: string
  phone: string
  email?: string
}

export async function getMyReferences() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data, error } = await supabase
    .from("agent_references")
    .select("*")
    .eq("agent_id", user.id)
    .order("created_at", { ascending: true })

  if (error) {
    throw error
  }

  return data
}

export async function saveMyReferences(
  references: AgentReferenceInput[]
) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  // Remove previous reference rows
  const { error: deleteError } = await supabase
    .from("agent_references")
    .delete()
    .eq("agent_id", user.id)

  if (deleteError) {
    throw deleteError
  }

  const rows = references.map(reference => ({
    agent_id: user.id,
    full_name: reference.full_name,
    organisation: reference.organisation,
    relationship: reference.relationship,
    phone: reference.phone,
    email: reference.email || null,
  }))

  const { data, error } = await supabase
    .from("agent_references")
    .insert(rows)
    .select()

  if (error) {
    throw error
  }

  return data
}


export async function getMyRecommendationLetter() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data, error } = await supabase
    .from("verification_documents")
    .select("*")
    .eq("agent_id", user.id)
    .eq("doc_type", "recommendation-letter")
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}

export async function saveMyRecommendationLetter(file: File) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ]

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Only PDF, DOC and DOCX files are allowed")
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Recommendation letter must be smaller than 10MB")
  }

  const filePath = `${user.id}/references/recommendation-letter`

  const { error: uploadError } = await supabase.storage
    .from("verification-documents")
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
      cacheControl: "0",
    })

  if (uploadError) {
    throw uploadError
  }

  const { data: existing, error: findError } = await supabase
    .from("verification_documents")
    .select("id")
    .eq("agent_id", user.id)
    .eq("doc_type", "recommendation-letter")
    .maybeSingle()

  if (findError) {
    throw findError
  }

  if (existing) {
    const { data, error } = await supabase
      .from("verification_documents")
      .update({
        file_url: filePath,
        status: "pending",
      })
      .eq("id", existing.id)
      .select()
      .single()

    if (error) throw error

    return data
  }

  const { data, error } = await supabase
    .from("verification_documents")
    .insert({
      agent_id: user.id,
      doc_type: "recommendation-letter",
      file_url: filePath,
      status: "pending",
    })
    .select()
    .single()

  if (error) throw error

  return data
}

export async function deleteMyRecommendationLetter() {
  return deleteMyCertification("recommendation-letter")
}



export type AgentAgreementsInput = {
  terms_accepted: boolean
  privacy_accepted: boolean
  conduct_accepted: boolean
  care_standards_accepted: boolean
  background_check_accepted: boolean
}

export async function getMyAgreements() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data, error } = await supabase
    .from("agent_agreements")
    .select("*")
    .eq("agent_id", user.id)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}

export async function saveMyAgreements(
  input: AgentAgreementsInput
) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const allAccepted =
    input.terms_accepted &&
    input.privacy_accepted &&
    input.conduct_accepted &&
    input.care_standards_accepted &&
    input.background_check_accepted

  const { data, error } = await supabase
    .from("agent_agreements")
    .upsert(
      {
        agent_id: user.id,

        terms_accepted: input.terms_accepted,
        privacy_accepted: input.privacy_accepted,
        conduct_accepted: input.conduct_accepted,
        care_standards_accepted:
          input.care_standards_accepted,
        background_check_accepted:
          input.background_check_accepted,

        accepted_at: allAccepted
          ? new Date().toISOString()
          : null,

        updated_at: new Date().toISOString()
      },
      {
        onConflict: "agent_id"
      }
    )
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}



// ─────────────────────────────────────────────────────────────────────────
// Marketplace: care requests, applications, saved items, notifications
// ─────────────────────────────────────────────────────────────────────────

const CARE_REQUEST_SELECT =
  "*, client:profiles!client_id(id, full_name, avatar_url), beneficiary:beneficiaries!beneficiary_id(id, name, preferred_name, age)"

export async function getOpenCareRequests() {
  const { data, error } = await supabase
    .from("care_requests")
    .select(CARE_REQUEST_SELECT)
    .eq("status", "open")
    .order("created_at", { ascending: false })

  if (error) {
    throw error
  }

  return data
}

export async function applyToCareRequest(input: {
  care_request_id: string
  price: number
  original_price?: number | null
  duration?: string | null
  cover_letter?: string | null
  notes?: string | null
}) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  // Defends against a stale Browse Jobs page: once a client hires an agent,
  // hireApplication() flips the care request's status away from 'open', so
  // any other agent still looking at a cached "open" card can't slip in a
  // late application for a job that's already been filled.
  const { data: careRequest, error: careRequestError } = await supabase
    .from("care_requests")
    .select("status")
    .eq("id", input.care_request_id)
    .maybeSingle()

  if (careRequestError) {
    throw careRequestError
  }

  if (!careRequest || careRequest.status !== "open") {
    const closedError = new Error(
      "This care request is no longer open."
    ) as Error & { code?: string }
    closedError.code = "REQUEST_CLOSED"
    throw closedError
  }

  // No DB constraint enforces one application per agent per care request,
  // so check here before inserting.
  const { data: existing, error: existingError } = await supabase
    .from("applications")
    .select("id")
    .eq("care_request_id", input.care_request_id)
    .eq("agent_id", user.id)
    .maybeSingle()

  if (existingError) {
    throw existingError
  }

  if (existing) {
    const duplicateError = new Error(
      "You have already applied for this job."
    ) as Error & { code?: string }
    duplicateError.code = "ALREADY_APPLIED"
    throw duplicateError
  }

  const { data, error } = await supabase
    .from("applications")
    .insert({
      care_request_id: input.care_request_id,
      agent_id: user.id,
      price: input.price,
      original_price: input.original_price ?? null,
      duration: input.duration ?? null,
      cover_letter: input.cover_letter ?? null,
      notes: input.notes ?? null,
      status: "applied",
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// Embed used by getMyApplications for the joined care_request — broadened
// beyond the original title/service_type/currency/client subset to also
// carry scheduling/location fields, needed by CareAgentDashboard's
// Schedule/Calendar views. Purely additive (existing callers that only read
// title/service_type/client.full_name/duration are unaffected).
const APPLICATION_CARE_REQUEST_SELECT =
  "id, title, service_type, currency, status, scheduled_date, scheduled_time, duration, address1, address2, city, client:profiles!client_id(full_name), beneficiary:beneficiaries!beneficiary_id(id, name, preferred_name, age)"

export async function getMyApplications() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data, error } = await supabase
    .from("applications")
    .select(`*, care_request:care_requests(${APPLICATION_CARE_REQUEST_SELECT})`)
    .eq("agent_id", user.id)
    .order("applied_at", { ascending: false })

  if (error) {
    throw error
  }

  return data
}

export async function getMySavedCareRequests() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  // `saved_items.target_id` is polymorphic (no FK to care_requests), so
  // PostgREST can't embed care_requests through it directly. Resolve in
  // two steps instead: fetch the saved rows, then fetch the matching
  // care_requests by id.
  const { data: savedRows, error: savedError } = await supabase
    .from("saved_items")
    .select("id, target_id, created_at")
    .eq("user_id", user.id)
    .eq("target_type", "care_request")
    .order("created_at", { ascending: false })

  if (savedError) {
    throw savedError
  }

  const targetIds = (savedRows ?? []).map((row) => row.target_id)

  if (targetIds.length === 0) {
    return []
  }

  const { data: careRequests, error: careRequestsError } = await supabase
    .from("care_requests")
    .select(CARE_REQUEST_SELECT)
    .in("id", targetIds)

  if (careRequestsError) {
    throw careRequestsError
  }

  const careRequestById = new Map(
    (careRequests ?? []).map((row: any) => [row.id, row])
  )

  return savedRows.map((row) => ({
    id: row.id,
    target_id: row.target_id,
    created_at: row.created_at,
    care_request: careRequestById.get(row.target_id) ?? null,
  }))
}

export async function saveCareRequest(careRequestId: string) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data, error } = await supabase
    .from("saved_items")
    .insert({
      user_id: user.id,
      target_type: "care_request",
      target_id: careRequestId,
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function unsaveCareRequest(careRequestId: string) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { error } = await supabase
    .from("saved_items")
    .delete()
    .eq("user_id", user.id)
    .eq("target_type", "care_request")
    .eq("target_id", careRequestId)

  if (error) {
    throw error
  }
}

export async function getMyNotifications() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    throw error
  }

  return data
}

export async function markNotificationRead(notificationId: string) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data, error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function markAllNotificationsRead() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data, error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", user.id)
    .eq("read", false)
    .select()

  if (error) {
    throw error
  }

  return data ?? []
}

export async function submitMyCareAgentApplication() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data, error } = await supabase
    .from("agent_details")
    .update({
      application_status: "under_review",
      submitted_at: new Date().toISOString()
    })
    .eq("id", user.id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}



// ─────────────────────────────────────────────────────────────────────────
// Care Execution: active booking + visit log
//
// visit_logs.status and bookings.status are constrained enums — only the
// values below are ever written. No other status string is valid.
// ─────────────────────────────────────────────────────────────────────────

export type VisitStatus =
  | "not_started"
  | "en_route"
  | "checked_in"
  | "in_progress"
  | "checked_out"
  | "completed"

export type BookingStatus =
  | "assigned"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "rescheduled"

// Bookings in one of these statuses represent a visit that is upcoming or
// underway. Cancelled, completed and rescheduled bookings are excluded.
const ACTIVE_BOOKING_STATUSES: BookingStatus[] = ["assigned", "confirmed", "in_progress"]

const BOOKING_SELECT = `
  *,
  care_request:care_requests(id, title, service_type, duration, tasks, address1, address2, city, province),
  client:profiles!client_id(id, full_name, avatar_url, phone),
  beneficiary:beneficiaries!beneficiary_id(id, name, preferred_name, age)
`

function bookingSortKey(b: any): string {
  const d = b.scheduled_date ?? ""
  const t = b.scheduled_time ?? ""
  return `${d}T${t}`
}

// Picks the single most relevant active booking for this agent: an
// in-progress booking always wins; otherwise the nearest upcoming
// assigned/confirmed booking; only falls back to the most recent past one
// if nothing upcoming exists. Never blindly returns the oldest row.
export async function getMyActiveBooking() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data, error } = await supabase
    .from("bookings")
    .select(BOOKING_SELECT)
    .eq("agent_id", user.id)
    .in("status", ACTIVE_BOOKING_STATUSES)

  if (error) {
    throw error
  }

  if (!data || data.length === 0) {
    return null
  }

  const inProgress = data.filter(b => b.status === "in_progress")
  if (inProgress.length) {
    return [...inProgress].sort((a, b) => bookingSortKey(a).localeCompare(bookingSortKey(b)))[0]
  }

  const today = new Date().toISOString().slice(0, 10)
  const withDate = data.filter(b => b.scheduled_date)
  const upcoming = withDate
    .filter(b => b.scheduled_date >= today)
    .sort((a, b) => bookingSortKey(a).localeCompare(bookingSortKey(b)))
  if (upcoming.length) {
    return upcoming[0]
  }

  const past = [...withDate].sort((a, b) => bookingSortKey(b).localeCompare(bookingSortKey(a)))
  if (past.length) {
    return past[0]
  }

  return data[0]
}

// Loads one specific booking by id (as opposed to getMyActiveBooking's
// auto-picked "most relevant" one) — for deep-linking into CareExecution
// from a specific booking/task card elsewhere in the app. Scoped to the
// authenticated agent's own bookings, same as getMyActiveBooking.
export async function getBookingById(bookingId: string) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data, error } = await supabase
    .from("bookings")
    .select(BOOKING_SELECT)
    .eq("id", bookingId)
    .eq("agent_id", user.id)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}

export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
  const { data, error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", bookingId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// Job Management's agent-facing "Confirm Assignment" action. Kept separate
// from updateBookingStatus() — which CareExecution reuses for other valid
// status transitions that must never also flip `confirmed` — because this
// is the one workflow where status and the confirmed flag change together.
// Scoped to the authenticated agent's own booking, and only while it's
// still "assigned", so it can't be used to confirm someone else's booking
// or re-confirm one that's already moved on.
export async function confirmBooking(bookingId: string) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data, error } = await supabase
    .from("bookings")
    .update({
      status: "confirmed" satisfies BookingStatus,
      confirmed: true,
    })
    .eq("id", bookingId)
    .eq("agent_id", user.id)
    .eq("status", "assigned")
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function getVisitLog(bookingId: string) {
  const { data, error } = await supabase
    .from("visit_logs")
    .select("*")
    .eq("booking_id", bookingId)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}

// Creates the visit_logs row for a booking on check-in (idempotent — if a
// row already exists for this booking, it is returned as-is rather than
// duplicated) and marks the booking in_progress. GPS is only saved if the
// browser actually reported a location; failure to obtain it is never
// papered over with a fake coordinate.
export async function startVisit(
  bookingId: string,
  gps?: { lat: number; lng: number } | null
) {
  const existing = await getVisitLog(bookingId)

  if (existing) {
    return existing
  }

  const { data, error } = await supabase
    .from("visit_logs")
    .insert({
      booking_id: bookingId,
      status: "checked_in" satisfies VisitStatus,
      check_in_time: new Date().toISOString(),
      gps_lat: gps?.lat ?? null,
      gps_lng: gps?.lng ?? null,
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  await updateBookingStatus(bookingId, "in_progress")

  return data
}

export async function updateVisitStatus(visitLogId: string, status: VisitStatus) {
  const { data, error } = await supabase
    .from("visit_logs")
    .update({ status })
    .eq("id", visitLogId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function updateVisitChecklist(visitLogId: string, checklist: unknown) {
  const { data, error } = await supabase
    .from("visit_logs")
    .update({ checklist })
    .eq("id", visitLogId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function updateVisitMedication(visitLogId: string, medicationLog: unknown) {
  const { data, error } = await supabase
    .from("visit_logs")
    .update({ medication_log: medicationLog })
    .eq("id", visitLogId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function updateVisitVitals(visitLogId: string, vitals: unknown) {
  const { data, error } = await supabase
    .from("visit_logs")
    .update({ vitals })
    .eq("id", visitLogId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function updateVisitNotes(visitLogId: string, notes: string) {
  const { data, error } = await supabase
    .from("visit_logs")
    .update({ notes })
    .eq("id", visitLogId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function submitIncidentReport(visitLogId: string, incidentReport: string) {
  const { data, error } = await supabase
    .from("visit_logs")
    .update({ incident_report: incidentReport })
    .eq("id", visitLogId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// Ends the visit: visit_logs and the booking both move to their terminal
// "completed" state together, since this app has no separate post-visit
// review/approval step.
export async function endVisit(visitLogId: string, bookingId?: string) {
  const { data, error } = await supabase
    .from("visit_logs")
    .update({
      check_out_time: new Date().toISOString(),
      status: "completed" satisfies VisitStatus,
    })
    .eq("id", visitLogId)
    .select()
    .single()

  if (error) {
    throw error
  }

  if (bookingId) {
    await updateBookingStatus(bookingId, "completed")
  }

  return data
}



// ─────────────────────────────────────────────────────────────────────────
// Agent Earnings: completed-booking earnings, transactions, payouts
//
// bookings.payment_amount (status = 'completed') is the source of truth for
// gross earnings. transactions is a separate, supplementary payment-record
// table — its rows are never added to bookings.payment_amount, since doing
// so could double-count the same money.
// ─────────────────────────────────────────────────────────────────────────

const COMPLETED_BOOKING_SELECT = `
  id,
  payment_amount,
  status,
  scheduled_date,
  scheduled_time,
  duration,
  location,
  created_at,
  care_request:care_requests(id, title, service_type),
  client:profiles!client_id(id, full_name)
`

export async function getMyCompletedBookings() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data, error } = await supabase
    .from("bookings")
    .select(COMPLETED_BOOKING_SELECT)
    .eq("agent_id", user.id)
    .eq("status", "completed")

  if (error) {
    throw error
  }

  return data ?? []
}

const TRANSACTION_SELECT = `
  id,
  booking_id,
  amount,
  currency,
  method,
  type,
  status,
  invoice_url,
  created_at,
  booking:bookings(id, scheduled_date, care_request:care_requests(title, service_type)),
  client:profiles!client_id(id, full_name)
`

export async function getMyTransactions() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data, error } = await supabase
    .from("transactions")
    .select(TRANSACTION_SELECT)
    .eq("agent_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    throw error
  }

  return data ?? []
}

// payouts.bank_account_id has no declared foreign key to bank_accounts in
// the schema, so it cannot be embedded in this select — resolve it
// separately (e.g. against getMyBankAccount()) if a bank label is needed.
export async function getMyPayouts() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data, error } = await supabase
    .from("payouts")
    .select("*")
    .eq("agent_id", user.id)
    .order("requested_at", { ascending: false })

  if (error) {
    throw error
  }

  return data ?? []
}



// ─────────────────────────────────────────────────────────────────────────
// Job Management: all of an agent's bookings (any status), beneficiary
// documents, and a minimal support-ticket helper.
// ─────────────────────────────────────────────────────────────────────────

const AGENT_BOOKING_SELECT = `
  id,
  care_request_id,
  application_id,
  client_id,
  beneficiary_id,
  status,
  scheduled_date,
  scheduled_time,
  duration,
  payment_amount,
  priority,
  recurring,
  confirmed,
  location,
  created_at,
  care_request:care_requests(id, title, service_type, tasks, instructions, access_notes, household_notes, parking_notes, urgent, address1, address2, city, province, lat, lng),
  client:profiles!client_id(id, full_name, avatar_url, phone),
  beneficiary:beneficiaries!beneficiary_id(id, name, preferred_name, dob, age, gender, relationship, address, blood_group, allergies, conditions, medications, doctor, hospital, mobility, vision, hearing, memory, med_notes, emergency_contacts, pref_languages, dietary, special_req)
`

// All bookings for the agent, any status — Job Management needs upcoming,
// active, completed, cancelled and rescheduled jobs, not just the single
// active one CareExecution cares about.
export async function getMyBookings() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data, error } = await supabase
    .from("bookings")
    .select(AGENT_BOOKING_SELECT)
    .eq("agent_id", user.id)
    .order("scheduled_date", { ascending: true })
    .order("scheduled_time", { ascending: true })

  if (error) {
    throw error
  }

  return data ?? []
}

// RLS already scopes this to documents belonging to a beneficiary of one of
// the caller's own bookings — no extra client-side filtering needed.
export async function getBeneficiaryDocuments(beneficiaryId: string) {
  const { data, error } = await supabase
    .from("beneficiary_documents")
    .select("*")
    .eq("beneficiary_id", beneficiaryId)
    .order("uploaded_at", { ascending: false })

  if (error) {
    throw error
  }

  return data ?? []
}

// The "beneficiary-documents" bucket is private, so file_url stores the
// storage object path (never a public URL) — mirroring the same convention
// already used for the private "verification-documents" bucket elsewhere in
// this file. Callers must resolve a path to a real URL via
// getBeneficiaryDocumentUrl() at click time rather than using it as a href.
function safeStorageFileName(name: string): string {
  const trimmed = name.trim() || "document"
  return trimmed.replace(/[^a-zA-Z0-9.\-_]/g, "_")
}

// Sanitizes a document type for use as a Storage filename prefix (e.g. "Doctor
// Recommendation" -> "Doctor-Recommendation"), so files are identifiable by
// type in the Supabase Storage dashboard without touching the UUID collision
// guard already in the path.
function safeStorageDocumentType(type: string): string {
  const trimmed = type.trim() || "Other"
  return trimmed.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.\-_]/g, "")
}

const BENEFICIARY_DOCUMENT_ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"]
const BENEFICIARY_DOCUMENT_MAX_BYTES = 10 * 1024 * 1024

// Uploads a real file to Supabase Storage, then inserts the matching
// beneficiary_documents row — only after the storage write succeeds. Ownership
// is verified explicitly (the beneficiary must belong to the authenticated
// client) in addition to whatever RLS enforces, so one client can never
// attach a document to another client's beneficiary. If the row insert fails
// after the file was already uploaded, the orphaned storage object is
// removed rather than left behind.
export async function uploadBeneficiaryDocument(
  beneficiaryId: string,
  file: File,
  documentType: string,
  expiryDate?: string | null
) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data: beneficiary, error: beneficiaryError } = await supabase
    .from("beneficiaries")
    .select("id")
    .eq("id", beneficiaryId)
    .eq("client_id", user.id)
    .maybeSingle()

  if (beneficiaryError) {
    throw beneficiaryError
  }

  if (!beneficiary) {
    throw new Error("You don't have access to this beneficiary")
  }

  if (!file) {
    throw new Error("Please select a file")
  }

  if (!BENEFICIARY_DOCUMENT_ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Only PDF, JPG and PNG files are allowed")
  }

  if (file.size > BENEFICIARY_DOCUMENT_MAX_BYTES) {
    throw new Error("File must be smaller than 10MB")
  }

  const path = `${user.id}/${beneficiaryId}/${safeStorageDocumentType(documentType)}-${crypto.randomUUID()}-${safeStorageFileName(file.name)}`

  const { error: uploadError } = await supabase.storage
    .from("beneficiary-documents")
    .upload(path, file, {
      contentType: file.type,
      cacheControl: "3600",
    })

  if (uploadError) {
    console.error("Beneficiary document storage upload failed:", { path, bucket: "beneficiary-documents", error: uploadError })
    throw uploadError
  }

  const { data, error: insertError } = await supabase
    .from("beneficiary_documents")
    .insert({
      beneficiary_id: beneficiaryId,
      name: file.name,
      type: documentType,
      file_url: path,
      expiry_date: expiryDate || null,
    })
    .select()
    .single()

  if (insertError) {
    console.error("beneficiary_documents insert failed after a successful storage upload:", { path, beneficiaryId, error: insertError })
    // Storage upload succeeded but the row failed — don't leave an orphaned
    // file behind. Best-effort: a cleanup failure here doesn't change the
    // fact that the original insert failed, so the original error still wins.
    const { error: cleanupError } = await supabase.storage.from("beneficiary-documents").remove([path])
    if (cleanupError) {
      console.error("Failed to clean up orphaned beneficiary document after failed insert:", cleanupError)
    }
    throw insertError
  }

  return data
}

// beneficiary-documents is a private bucket, so a stored path is only ever
// opened via a short-lived signed URL generated at click time — never a
// public URL, and never by flipping the bucket to public.
export async function getBeneficiaryDocumentUrl(path: string) {
  const { data, error } = await supabase.storage
    .from("beneficiary-documents")
    .createSignedUrl(path, 300)

  if (error) {
    throw error
  }

  return data.signedUrl
}

// Looks up the current row for one (beneficiaryId, type) slot, or null if
// nothing has been uploaded there yet. beneficiary_documents has a real
// UNIQUE (beneficiary_id, type) constraint (confirmed against the live
// schema — "beneficiary_documents_beneficiary_type_key"), so there is at
// most one row to find.
export async function getBeneficiaryDocumentByType(beneficiaryId: string, type: string) {
  const { data, error } = await supabase
    .from("beneficiary_documents")
    .select("*")
    .eq("beneficiary_id", beneficiaryId)
    .eq("type", type)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}

// "One current document per beneficiary per type" upload, used by the
// beneficiary Edit wizard's Documents step. The new file is uploaded to
// Storage first; only once that succeeds does the beneficiary_documents row
// change: UPDATE the existing row for this type if one exists (never a
// second INSERT — the UNIQUE (beneficiary_id, type) constraint would reject
// it anyway), otherwise INSERT the first row for this slot. The old storage
// object is removed only after the DB row already points at the new one, so
// a failure at any earlier step leaves the previous document fully intact.
export async function replaceBeneficiaryDocument(
  beneficiaryId: string,
  file: File,
  documentType: string,
  expiryDate?: string | null
) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data: beneficiary, error: beneficiaryError } = await supabase
    .from("beneficiaries")
    .select("id")
    .eq("id", beneficiaryId)
    .eq("client_id", user.id)
    .maybeSingle()

  if (beneficiaryError) {
    throw beneficiaryError
  }

  if (!beneficiary) {
    throw new Error("You don't have access to this beneficiary")
  }

  if (!file) {
    throw new Error("Please select a file")
  }

  if (!BENEFICIARY_DOCUMENT_ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Only PDF, JPG and PNG files are allowed")
  }

  if (file.size > BENEFICIARY_DOCUMENT_MAX_BYTES) {
    throw new Error("File must be smaller than 10MB")
  }

  const existingDoc = await getBeneficiaryDocumentByType(beneficiaryId, documentType)

  const path = `${user.id}/${beneficiaryId}/${safeStorageDocumentType(documentType)}-${crypto.randomUUID()}-${safeStorageFileName(file.name)}`

  const { error: uploadError } = await supabase.storage
    .from("beneficiary-documents")
    .upload(path, file, {
      contentType: file.type,
      cacheControl: "3600",
    })

  if (uploadError) {
    console.error("Beneficiary document replacement upload failed:", { path, bucket: "beneficiary-documents", error: uploadError })
    throw uploadError
  }

  if (existingDoc) {
    const { data, error: updateError } = await supabase
      .from("beneficiary_documents")
      .update({
        name: file.name,
        file_url: path,
        uploaded_at: new Date().toISOString(),
        expiry_date: expiryDate || null,
      })
      .eq("id", existingDoc.id)
      .select()
      .single()

    if (updateError) {
      console.error("beneficiary_documents update failed after a successful storage upload:", { path, docId: existingDoc.id, error: updateError })
      // The DB still points at the old file, which is untouched — don't
      // leave the newly uploaded (now-orphaned) object behind.
      const { error: cleanupError } = await supabase.storage.from("beneficiary-documents").remove([path])
      if (cleanupError) {
        console.error("Failed to clean up newly uploaded file after a failed replace:", cleanupError)
      }
      throw updateError
    }

    // The DB row now points at the new file — safe to remove the old one.
    // A failure here is non-blocking: the new document is already active,
    // so this is surfaced to the caller as a warning, not an error.
    let cleanupWarning: string | null = null
    if (existingDoc.file_url && existingDoc.file_url !== path) {
      const { error: oldRemoveError } = await supabase.storage.from("beneficiary-documents").remove([existingDoc.file_url])
      if (oldRemoveError) {
        console.error("Failed to remove old storage object after a successful replace:", { path: existingDoc.file_url, error: oldRemoveError })
        cleanupWarning = "The old file couldn't be removed from storage, but the new document is now active."
      }
    }

    return { ...data, cleanupWarning }
  }

  const { data, error: insertError } = await supabase
    .from("beneficiary_documents")
    .insert({
      beneficiary_id: beneficiaryId,
      name: file.name,
      type: documentType,
      file_url: path,
      expiry_date: expiryDate || null,
    })
    .select()
    .single()

  if (insertError) {
    console.error("beneficiary_documents insert failed after a successful storage upload:", { path, beneficiaryId, error: insertError })
    const { error: cleanupError } = await supabase.storage.from("beneficiary-documents").remove([path])
    if (cleanupError) {
      console.error("Failed to clean up orphaned beneficiary document after failed insert:", cleanupError)
    }
    throw insertError
  }

  return { ...data, cleanupWarning: null as string | null }
}

// Deletes one beneficiary document: the storage object first, then its
// beneficiary_documents row. Both the storage DELETE policy and the table's
// DELETE policy (scoped to the owning client) were confirmed against the
// live schema/RLS before this was implemented — see getBeneficiaryDocuments
// / uploadBeneficiaryDocument above for the same ownership convention.
export async function deleteBeneficiaryDocument(beneficiaryId: string, doc: { id: string; file_url: string }) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data: beneficiary, error: beneficiaryError } = await supabase
    .from("beneficiaries")
    .select("id")
    .eq("id", beneficiaryId)
    .eq("client_id", user.id)
    .maybeSingle()

  if (beneficiaryError) {
    throw beneficiaryError
  }

  if (!beneficiary) {
    throw new Error("You don't have access to this beneficiary")
  }

  if (doc.file_url) {
    const { error: removeError } = await supabase.storage.from("beneficiary-documents").remove([doc.file_url])
    if (removeError) {
      console.error("Failed to delete beneficiary document storage object:", { path: doc.file_url, error: removeError })
      throw removeError
    }
  }

  const { error: deleteError } = await supabase
    .from("beneficiary_documents")
    .delete()
    .eq("id", doc.id)
    .eq("beneficiary_id", beneficiaryId)

  if (deleteError) {
    console.error("beneficiary_documents delete failed after its storage object was already removed:", { docId: doc.id, error: deleteError })
    throw deleteError
  }
}

// support_tickets has no booking_id column, so job context is folded into
// the subject text by the caller rather than a real relation. category is
// NOT NULL with no confirmed CHECK constraint, so a stable, truthful,
// general category is used rather than guessing an enum. priority/status
// use the confirmed-valid values ("medium"/"open") since neither column
// has a known usable default.
export async function createSupportTicket(subject: string) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data, error } = await supabase
    .from("support_tickets")
    .insert({
      user_id: user.id,
      subject,
      category: "Job Issue",
      priority: "medium",
      status: "open",
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// Scoped to the authenticated user's own tickets — same table
// createSupportTicket already writes to.
export async function getMySupportTickets() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data, error } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    throw error
  }

  return data ?? []
}



// ─────────────────────────────────────────────────────────────────────────
// Messaging Hub: conversations, participants, messages.
//
// conversations.type / .category and messages.type / .status are
// constrained to the values below — only these are ever written.
// ─────────────────────────────────────────────────────────────────────────

export type ConversationType = "direct" | "group" | "support"
export type ConversationCategory = "care" | "task" | "completed" | "support"
export type MessageType = "text" | "image" | "document" | "voice" | "location" | "task_update" | "system" | "checklist"
export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed"

const CONVERSATION_SELECT = `
  id, booking_id, name, type, category, is_emergency, created_at,
  booking:bookings(
    id, status, scheduled_date, scheduled_time, duration, location, priority,
    care_request:care_requests(title, service_type),
    beneficiary:beneficiaries!beneficiary_id(name, preferred_name)
  )
`

const MESSAGE_SELECT = `
  id, conversation_id, sender_id, type, text, attachment, status, starred, pinned, edited, deleted, created_at,
  sender:profiles!sender_id(id, full_name, preferred_name, avatar_url)
`

// Lists every conversation the authenticated user participates in, with
// enough context to render the inbox: the caller's own pinned/muted
// participant settings, the other participant(s)' real profiles (resolved
// separately since "who else is in this conversation" isn't a simple FK
// embed), any linked booking/care_request/beneficiary context, and the
// most recent real message — there is no last_message_at column, so it is
// derived from messages directly rather than faked.
export async function getMyConversations() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data: myRows, error: myError } = await supabase
    .from("conversation_participants")
    .select("conversation_id, pinned, muted")
    .eq("user_id", user.id)

  if (myError) {
    throw myError
  }

  if (!myRows || myRows.length === 0) {
    return []
  }

  const conversationIds = myRows.map((r) => r.conversation_id)

  const { data: conversations, error: convError } = await supabase
    .from("conversations")
    .select(CONVERSATION_SELECT)
    .in("id", conversationIds)

  if (convError) {
    throw convError
  }

  const { data: allParticipants, error: partError } = await supabase
    .from("conversation_participants")
    .select("conversation_id, user_id")
    .in("conversation_id", conversationIds)

  if (partError) {
    throw partError
  }

  const otherUserIds = Array.from(
    new Set((allParticipants ?? []).filter((p) => p.user_id !== user.id).map((p) => p.user_id))
  )

  let profilesById = new Map<string, any>()
  if (otherUserIds.length > 0) {
    const { data: profiles, error: profError } = await supabase
      .from("profiles")
      .select("id, full_name, preferred_name, avatar_url, phone, role")
      .in("id", otherUserIds)

    if (profError) {
      throw profError
    }

    profilesById = new Map((profiles ?? []).map((p) => [p.id, p]))
  }

  const { data: recentMessages, error: msgError } = await supabase
    .from("messages")
    .select("id, conversation_id, sender_id, type, text, deleted, created_at")
    .in("conversation_id", conversationIds)
    .order("created_at", { ascending: false })
    .limit(500)

  if (msgError) {
    throw msgError
  }

  const lastMessageByConversation = new Map<string, any>()
  for (const m of recentMessages ?? []) {
    if (!lastMessageByConversation.has(m.conversation_id)) {
      lastMessageByConversation.set(m.conversation_id, m)
    }
  }

  const otherParticipantsByConversation = new Map<string, any[]>()
  for (const p of allParticipants ?? []) {
    if (p.user_id === user.id) continue
    const arr = otherParticipantsByConversation.get(p.conversation_id) ?? []
    const profile = profilesById.get(p.user_id)
    if (profile) arr.push(profile)
    otherParticipantsByConversation.set(p.conversation_id, arr)
  }

  const myRowByConversation = new Map(myRows.map((r) => [r.conversation_id, r]))

  const result = (conversations ?? []).map((c: any) => {
    const mine = myRowByConversation.get(c.id)
    return {
      ...c,
      pinned: mine?.pinned ?? false,
      muted: mine?.muted ?? false,
      otherParticipants: otherParticipantsByConversation.get(c.id) ?? [],
      lastMessage: lastMessageByConversation.get(c.id) ?? null,
    }
  })

  result.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    const aTime = a.lastMessage?.created_at ?? a.created_at
    const bTime = b.lastMessage?.created_at ?? b.created_at
    return new Date(bTime).getTime() - new Date(aTime).getTime()
  })

  return result
}

// RLS already restricts this to conversations the caller participates in.
export async function getConversationMessages(conversationId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select(MESSAGE_SELECT)
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })

  if (error) {
    throw error
  }

  return data ?? []
}

export async function sendMessage(conversationId: string, text: string) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const trimmed = text.trim()
  if (!trimmed) {
    throw new Error("Message cannot be empty")
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      type: "text" satisfies MessageType,
      text: trimmed,
      status: "sent" satisfies MessageStatus,
    })
    .select(MESSAGE_SELECT)
    .single()

  if (error) {
    throw error
  }

  return data
}

// Only the sender's own, not-yet-deleted message may be edited — scoped
// explicitly to sender_id in addition to RLS.
export async function editMessage(messageId: string, text: string) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const trimmed = text.trim()
  if (!trimmed) {
    throw new Error("Message cannot be empty")
  }

  const { data, error } = await supabase
    .from("messages")
    .update({ text: trimmed, edited: true })
    .eq("id", messageId)
    .eq("sender_id", user.id)
    .eq("deleted", false)
    .select(MESSAGE_SELECT)
    .single()

  if (error) {
    throw error
  }

  return data
}

// Soft delete only, per the confirmed schema — the row is kept but its
// content is cleared so the UI can show an honest "message deleted" state.
export async function deleteMessage(messageId: string) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data, error } = await supabase
    .from("messages")
    .update({ deleted: true, text: null, attachment: null })
    .eq("id", messageId)
    .eq("sender_id", user.id)
    .select(MESSAGE_SELECT)
    .single()

  if (error) {
    throw error
  }

  return data
}

// RLS only allows updating one's own messages, so starring/pinning a
// received message is not possible at the database level — this is scoped
// to sender_id accordingly rather than pretending otherwise.
export async function toggleMessageStar(messageId: string, starred: boolean) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data, error } = await supabase
    .from("messages")
    .update({ starred })
    .eq("id", messageId)
    .eq("sender_id", user.id)
    .select(MESSAGE_SELECT)
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function toggleMessagePin(messageId: string, pinned: boolean) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data, error } = await supabase
    .from("messages")
    .update({ pinned })
    .eq("id", messageId)
    .eq("sender_id", user.id)
    .select(MESSAGE_SELECT)
    .single()

  if (error) {
    throw error
  }

  return data
}

// conversation_participants holds one row per (conversation, user) — this
// only ever touches the caller's own row, never another participant's.
export async function updateConversationPreferences(
  conversationId: string,
  updates: { pinned?: boolean; muted?: boolean }
) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data, error } = await supabase
    .from("conversation_participants")
    .update(updates)
    .eq("conversation_id", conversationId)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// Finds or creates the direct conversation for a booking.
//
// This used to do a client-side check-then-insert (select existing ->
// insert conversation -> insert participants). That insert reliably hit a
// 403 (Postgres 42501 "new row violates row-level security policy for
// table conversations"): the INSERT policy requires the caller to already
// be a conversation_participants row for the conversation being created,
// which is impossible for a brand-new row since participants are only
// added *after* the conversation exists — a circular bootstrap dependency
// no client-side ordering of statements can satisfy.
//
// The fix is a SECURITY DEFINER RPC (see
// supabase/migrations/20260830000000_create_booking_conversation_rpc.sql)
// that performs its own authorization check (auth.uid() must be the
// booking's agent or client) instead of relying on RLS for the write, and
// atomically creates the conversation plus both participant rows in one
// transaction, guarded by a unique index on (booking_id) for type='direct'
// so concurrent/retried calls can't create duplicates. The RPC only takes
// booking_uuid — participant ids are resolved server-side from the
// booking, never accepted from the frontend.
export async function getOrCreateBookingConversation(bookingId: string) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data, error } = await supabase.rpc("create_booking_conversation", {
    booking_uuid: bookingId,
  })

  if (error) {
    console.error("create_booking_conversation failed:", error)
    if (error.message?.includes("Not authorized")) {
      throw new Error("You are not part of this booking")
    }
    if (error.message?.includes("no one to message")) {
      throw new Error("This booking has no one to message yet")
    }
    if (error.message?.includes("Booking not found")) {
      throw new Error("Booking not found")
    }
    throw new Error("Failed to start conversation")
  }

  return data as string
}

// Client <-> agent direct conversation, started outside of a booking (e.g.
// from the hiring/negotiation flow). Reuses an existing direct conversation
// between the two users if one already exists.
export async function getOrCreateDirectConversation(otherUserId: string): Promise<string> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  if (!otherUserId) {
    throw new Error("No agent to message yet")
  }

  const { data, error } = await supabase.rpc("create_direct_conversation", {
    other_user_id: otherUserId,
  })

  if (error) {
    console.error("create_direct_conversation failed:", error)
    throw new Error("Failed to start conversation")
  }

  return data as string
}

export async function getAgentsForBrowse() {
  const { data, error } = await supabase
    .from('agent_details')
    .select('*, profiles(full_name, gender, city, province, district)')
  if (error) throw error

  const ids = (data || []).map((r: any) => r.id)
  let skillsByAgent: Record<string, string[]> = {}
  if (ids.length) {
    const { data: skillRows } = await supabase.from('agent_skills').select('agent_id, service_name').in('agent_id', ids)
    for (const s of skillRows || []) {
      if (!skillsByAgent[s.agent_id]) skillsByAgent[s.agent_id] = []
      skillsByAgent[s.agent_id].push(s.service_name)
    }
  }

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
    skills: skillsByAgent[row.id] || [],
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

  const { data: skillRows } = await supabase.from('agent_skills').select('service_name').eq('agent_id', id)

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
    skills: (skillRows || []).map((s: any) => s.service_name),
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
    lat: data.lat,
    lng: data.lng,
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

// The "care-request-attachments" bucket is private (10MB limit, confirmed
// MIME allowlist below), so file_path stores the storage object path, never
// a public URL — same convention as beneficiary_documents.file_url. One
// current attachment per (care_request_id, type) slot: replacing an
// existing slot UPDATEs its row rather than inserting a duplicate.
export type CareRequestAttachmentType = 'Photo' | 'Medical' | 'Voice'

const CARE_REQUEST_ATTACHMENT_ALLOWED_TYPES: Record<CareRequestAttachmentType, string[]> = {
  Photo: ['image/jpeg', 'image/png'],
  Medical: ['application/pdf', 'image/jpeg', 'image/png'],
  Voice: ['audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/webm'],
}
const CARE_REQUEST_ATTACHMENT_TYPE_LABEL: Record<CareRequestAttachmentType, string> = {
  Photo: 'Only JPG and PNG images are allowed',
  Medical: 'Only PDF, JPG and PNG files are allowed',
  Voice: 'Only MP3, M4A, WAV and WebM audio files are allowed',
}
const CARE_REQUEST_ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024

// Shared with the wizard UI so client-side pre-upload validation can never
// drift from what uploadCareRequestAttachment() actually enforces.
export function validateCareRequestAttachmentFile(type: CareRequestAttachmentType, file: File): string | null {
  if (!CARE_REQUEST_ATTACHMENT_ALLOWED_TYPES[type].includes(file.type)) {
    return CARE_REQUEST_ATTACHMENT_TYPE_LABEL[type]
  }
  if (file.size > CARE_REQUEST_ATTACHMENT_MAX_BYTES) {
    return "File must be smaller than 10MB"
  }
  return null
}

// Looks up the current row for one (careRequestId, type) slot, or null if
// nothing has been uploaded there yet.
export async function getCareRequestAttachmentByType(careRequestId: string, type: CareRequestAttachmentType) {
  const { data, error } = await supabase
    .from("care_request_attachments")
    .select("*")
    .eq("care_request_id", careRequestId)
    .eq("type", type)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}

// Uploads a real file to Storage, then UPDATEs the existing
// care_request_attachments row for this (careRequestId, type) slot if one
// exists, or INSERTs the first one otherwise — never a second row for the
// same slot. The new file is uploaded before any DB write, and the old
// storage object (on replace) is only removed after the DB row already
// points at the new one, so a failure at any step never leaves the request
// with no file for that type. Ownership is verified explicitly (the care
// request must belong to the authenticated client) in addition to RLS.
export async function uploadCareRequestAttachment(
  careRequestId: string,
  type: CareRequestAttachmentType,
  file: File
) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data: careRequest, error: careRequestError } = await supabase
    .from("care_requests")
    .select("id")
    .eq("id", careRequestId)
    .eq("client_id", user.id)
    .maybeSingle()

  if (careRequestError) {
    throw careRequestError
  }

  if (!careRequest) {
    throw new Error("You don't have access to this care request")
  }

  if (!file) {
    throw new Error("Please select a file")
  }

  if (!CARE_REQUEST_ATTACHMENT_ALLOWED_TYPES[type].includes(file.type)) {
    throw new Error(CARE_REQUEST_ATTACHMENT_TYPE_LABEL[type])
  }

  if (file.size > CARE_REQUEST_ATTACHMENT_MAX_BYTES) {
    throw new Error("File must be smaller than 10MB")
  }

  const existingAttachment = await getCareRequestAttachmentByType(careRequestId, type)

  const path = `${user.id}/${careRequestId}/${type}-${crypto.randomUUID()}-${safeStorageFileName(file.name)}`

  const { error: uploadError } = await supabase.storage
    .from("care-request-attachments")
    .upload(path, file, {
      contentType: file.type,
      cacheControl: "3600",
    })

  if (uploadError) {
    console.error("Care request attachment upload failed:", { path, bucket: "care-request-attachments", error: uploadError })
    throw uploadError
  }

  if (existingAttachment) {
    const { data, error: updateError } = await supabase
      .from("care_request_attachments")
      .update({
        name: file.name,
        file_path: path,
        mime_type: file.type,
        file_size: file.size,
      })
      .eq("id", existingAttachment.id)
      .select()
      .single()

    if (updateError) {
      console.error("care_request_attachments update failed after a successful storage upload:", { path, attachmentId: existingAttachment.id, error: updateError })
      const { error: cleanupError } = await supabase.storage.from("care-request-attachments").remove([path])
      if (cleanupError) {
        console.error("Failed to clean up newly uploaded file after a failed replace:", cleanupError)
      }
      throw updateError
    }

    if (existingAttachment.file_path && existingAttachment.file_path !== path) {
      const { error: oldRemoveError } = await supabase.storage.from("care-request-attachments").remove([existingAttachment.file_path])
      if (oldRemoveError) {
        console.error("Failed to remove old storage object after a successful replace:", { path: existingAttachment.file_path, error: oldRemoveError })
      }
    }

    return data
  }

  const { data, error: insertError } = await supabase
    .from("care_request_attachments")
    .insert({
      care_request_id: careRequestId,
      type,
      name: file.name,
      file_path: path,
      mime_type: file.type,
      file_size: file.size,
    })
    .select()
    .single()

  if (insertError) {
    console.error("care_request_attachments insert failed after a successful storage upload:", { path, careRequestId, error: insertError })
    const { error: cleanupError } = await supabase.storage.from("care-request-attachments").remove([path])
    if (cleanupError) {
      console.error("Failed to clean up orphaned care request attachment after failed insert:", cleanupError)
    }
    throw insertError
  }

  return data
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
    beneficiaryId: data.beneficiary_id,
    title: data.title,
    service: data.service_type,
    beneficiary: data.beneficiaries ? `${data.beneficiaries.name}${data.beneficiaries.age ? ', ' + data.beneficiaries.age : ''}` : '',
    budget: `${data.currency} ${data.budget_min}–${data.budget_max}`,
    dates: data.scheduled_date || '',
    status: data.status,
    createdAt: data.created_at || '',
    views: data.views || 0,
    applications: appCount || 0,
    shortlisted: shortlistedCount || 0,
  }
}

export async function getApplicationsForRequest(careRequestId: string, clientId: string) {
  const { data, error } = await supabase
    .from('applications')
    .select('*, profiles!agent_id(full_name, city, agent_details(*))')
    .eq('care_request_id', careRequestId)
  if (error) throw error

  const agentIds = (data || []).map((row: any) => row.agent_id).filter(Boolean)
  let skillsByAgent: Record<string, string[]> = {}
  let repeatCountByAgent: Record<string, number> = {}
  if (agentIds.length) {
    const { data: skillRows } = await supabase.from('agent_skills').select('agent_id, service_name').in('agent_id', agentIds)
    for (const s of skillRows || []) {
      if (!skillsByAgent[s.agent_id]) skillsByAgent[s.agent_id] = []
      skillsByAgent[s.agent_id].push(s.service_name)
    }

    const { data: pastBookings } = await supabase
      .from('bookings')
      .select('agent_id')
      .eq('client_id', clientId)
      .in('agent_id', agentIds)
      .eq('status', 'completed')
    for (const b of pastBookings || []) {
      repeatCountByAgent[b.agent_id] = (repeatCountByAgent[b.agent_id] || 0) + 1
    }
  }

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
      skills: skillsByAgent[row.agent_id] || [],
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
      repeatClients: repeatCountByAgent[row.agent_id] || 0,
      matchScore: row.match_score || 0,
      agentId: row.agent_id,
    }
  })
}

export async function updateApplicationStatus(applicationId: string, status: string) {
  const { error } = await supabase.from('applications').update({ status }).eq('id', applicationId)
  if (error) throw error
}

// ─── Hiring & Negotiation ──────────────────────────────────────────────────
// negotiation_messages already has RLS confirmed live ("Agent or client
// involved can view/send negotiation messages") that scopes rows to the
// client who owns the application's care request and the agent who owns the
// application, and separately enforces sender_id = auth.uid() on insert — no
// service-role, no client-side ownership re-check needed here.
export type NegotiationMessage = {
  id: string
  application_id: string
  sender_id: string
  message: string
  proposed_price: number | null
  created_at: string
  senderName: string
}

function mapNegotiationMessageRow(row: any): NegotiationMessage {
  return {
    id: row.id,
    application_id: row.application_id,
    sender_id: row.sender_id,
    message: row.message,
    proposed_price: row.proposed_price,
    created_at: row.created_at,
    senderName: row.sender?.full_name || 'Unknown',
  }
}

export async function getNegotiationMessages(applicationId: string): Promise<NegotiationMessage[]> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('No authenticated user found')
  }

  const { data, error } = await supabase
    .from('negotiation_messages')
    .select('*, sender:profiles!sender_id(full_name)')
    .eq('application_id', applicationId)
    .order('created_at', { ascending: true })

  if (error) {
    throw error
  }

  return (data || []).map(mapNegotiationMessageRow)
}

const NEGOTIATION_TERMINAL_STATUSES = ['hired', 'declined', 'withdrawn']

// Inserts a real negotiation_messages row. sender_id is always the
// authenticated caller — never accepted from the UI. After a successful
// insert, the application is nudged into "negotiating" (best-effort: a
// failure here doesn't undo the message, which already persisted) unless
// it's already in a terminal state, so a stray request can never move a
// hired/declined/withdrawn application backwards.
export async function sendNegotiationMessage(input: {
  applicationId: string
  message: string
  proposedPrice?: number | null
}): Promise<NegotiationMessage> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('No authenticated user found')
  }

  const message = input.message.trim()
  if (!message) {
    throw new Error('Please enter a message')
  }
  if (message.length > 2000) {
    throw new Error('Message is too long')
  }

  let proposedPrice: number | null = null
  if (input.proposedPrice !== undefined && input.proposedPrice !== null) {
    if (!Number.isFinite(input.proposedPrice) || input.proposedPrice <= 0) {
      throw new Error('Please enter a valid price')
    }
    proposedPrice = input.proposedPrice
  }

  const { data, error } = await supabase
    .from('negotiation_messages')
    .insert({
      application_id: input.applicationId,
      sender_id: user.id,
      message,
      proposed_price: proposedPrice,
    })
    .select('*, sender:profiles!sender_id(full_name)')
    .single()

  if (error) {
    throw error
  }

  let statusQuery = supabase.from('applications').update({ status: 'negotiating' }).eq('id', input.applicationId)
  for (const terminal of NEGOTIATION_TERMINAL_STATUSES) {
    statusQuery = statusQuery.neq('status', terminal)
  }
  const { error: statusError } = await statusQuery
  if (statusError) {
    console.error('Failed to move application to negotiating after a new negotiation message:', statusError)
  }

  return mapNegotiationMessageRow(data)
}

// Hires an application: verifies the care request belongs to this client,
// derives the final price from the negotiation transcript (falling back to
// the application's own price if nothing was negotiated), and creates
// exactly one booking.
//
// There is no multi-statement database transaction available from the
// client here, so this can't be made fully atomic the way a
// SECURITY DEFINER RPC would be. What actually prevents two concurrent hire
// attempts from both succeeding is the single guarded UPDATE below — it only
// matches (and only one caller can only ever win it) if the application
// isn't already hired/declined/withdrawn, which is itself one atomic
// statement. A pre-check against an existing booking makes retrying after a
// partial failure (e.g. the booking insert failing after the status flip)
// idempotent instead of creating a second booking — closing the specific gap
// confirmed live: bookings.application_id currently has no UNIQUE
// constraint, so a naive duplicate insert previously succeeded silently.
// bookings.application_id has no UNIQUE constraint, so more than one
// booking can legitimately exist for the same application (e.g. left over
// from an earlier duplicate-insert bug). Every lookup keyed by
// application_id goes through here instead of .single()/.maybeSingle(),
// both of which throw PGRST116 ("multiple rows returned") the moment more
// than one row matches — .limit(1) + data?.[0] tolerates that.
export async function getBookingForApplication(applicationId: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('application_id', applicationId)
    .order('created_at', { ascending: true })
    .limit(1)

  if (error) {
    throw error
  }

  return data?.[0] ?? null
}

// For the Application Timeline: whether any negotiation_messages row exists
// across a set of applications (i.e. a real counter-offer was ever sent),
// plus the most recent one's timestamp for display.
export async function getNegotiationActivityForRequest(
  applicationIds: string[]
): Promise<{ hasActivity: boolean; lastMessageAt: string | null }> {
  if (applicationIds.length === 0) {
    return { hasActivity: false, lastMessageAt: null }
  }

  const { data, error } = await supabase
    .from('negotiation_messages')
    .select('created_at')
    .in('application_id', applicationIds)
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) {
    throw error
  }

  const latest = data?.[0]
  return { hasActivity: !!latest, lastMessageAt: latest?.created_at ?? null }
}

export async function hireApplication(applicationId: string, careRequestId: string, agentId: string, clientId: string, beneficiaryId: string) {
  const { data: careRequest, error: careRequestError } = await supabase
    .from('care_requests')
    .select('id')
    .eq('id', careRequestId)
    .eq('client_id', clientId)
    .maybeSingle()

  if (careRequestError) {
    throw careRequestError
  }
  if (!careRequest) {
    throw new Error("You don't have access to this care request")
  }

  const existingBooking = await getBookingForApplication(applicationId)
  if (existingBooking) {
    // Already hired and booked (e.g. a retry after the first attempt's
    // response was lost) — return the existing booking instead of creating
    // a duplicate.
    return existingBooking
  }

  const { data: application, error: applicationError } = await supabase
    .from('applications')
    .select('*')
    .eq('id', applicationId)
    .eq('care_request_id', careRequestId)
    .maybeSingle()

  if (applicationError) {
    throw applicationError
  }
  if (!application) {
    throw new Error("This application doesn't belong to this care request")
  }
  if (application.status === 'declined' || application.status === 'withdrawn') {
    throw new Error(`This application was ${application.status} and can no longer be hired.`)
  }

  const messages = await getNegotiationMessages(applicationId)
  let finalPrice = application.price
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].proposed_price != null) {
      finalPrice = messages[i].proposed_price
      break
    }
  }

  if (application.status === 'hired') {
    // Recovering from a prior attempt that flipped the application to hired
    // but failed before the booking was created — keep the price in sync.
    await supabase.from('applications').update({ price: finalPrice }).eq('id', applicationId)
  } else {
    const { data: updatedApp, error: updateError } = await supabase
      .from('applications')
      .update({ status: 'hired', price: finalPrice })
      .eq('id', applicationId)
      .neq('status', 'hired')
      .neq('status', 'declined')
      .neq('status', 'withdrawn')
      .select()
      .maybeSingle()

    if (updateError) {
      throw updateError
    }
    if (!updatedApp) {
      // Someone else won the race between our read above and this update —
      // see if they already finished creating the booking.
      const raceBooking = await getBookingForApplication(applicationId)
      if (raceBooking) {
        return raceBooking
      }
      throw new Error('This application is no longer available to hire.')
    }
  }

  const { error: careRequestUpdateError } = await supabase
    .from('care_requests')
    .update({ status: 'assigned' })
    .eq('id', careRequestId)
    .eq('client_id', clientId)

  if (careRequestUpdateError) {
    throw careRequestUpdateError
  }

  const bookingPayload = {
    care_request_id: careRequestId,
    application_id: applicationId,
    client_id: clientId,
    agent_id: agentId,
    beneficiary_id: beneficiaryId,
    status: 'confirmed',
    payment_amount: finalPrice,
  }

  // Guard against a bookings insert failing on an opaque FK/RLS/constraint
  // error when one of these came through missing or malformed.
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  const requiredIdFields = ['care_request_id', 'application_id', 'client_id', 'agent_id', 'beneficiary_id'] as const
  const invalidFields = requiredIdFields.filter((key) => !UUID_RE.test(String(bookingPayload[key] ?? '')))

  if (invalidFields.length > 0) {
    throw new Error(`Cannot create booking — missing or invalid: ${invalidFields.join(', ')}`)
  }

  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert(bookingPayload)
    .select()
    .maybeSingle()

  if (bookingError) {
    if ((bookingError as any).code === '23505') {
      const raceBooking = await getBookingForApplication(applicationId)
      if (raceBooking) {
        return raceBooking
      }
    }
    throw bookingError
  }

  if (!booking) {
    // The insert succeeded (no error) but RETURNING came back empty — most
    // likely an RLS SELECT policy hiding the row from the immediate
    // read-back. Reload it explicitly instead of throwing "no rows" at the
    // caller for a booking that was actually created.
    const createdBooking = await getBookingForApplication(applicationId)
    if (createdBooking) {
      return createdBooking
    }
    throw new Error('The booking was created but could not be loaded. Please refresh and check your bookings.')
  }

  return booking
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
  const { count: upcomingVisitsCount } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('client_id', clientId)
    .in('status', ['confirmed','assigned'])
    .gte('scheduled_date', today)

  // Real upcoming visit rows (not just the count above) so the dashboard's
  // "Upcoming Visits" panel can show actual bookings instead of fabricated
  // sample data.
  const { data: upcomingVisitRows } = await supabase
    .from('bookings')
    .select(`
      id, status, scheduled_date, scheduled_time, duration, location,
      care_request:care_requests(title, service_type),
      beneficiary:beneficiaries!beneficiary_id(name, preferred_name),
      agent:profiles!agent_id(full_name)
    `)
    .eq('client_id', clientId)
    .in('status', ['confirmed','assigned'])
    .gte('scheduled_date', today)
    .order('scheduled_date', { ascending: true })
    .order('scheduled_time', { ascending: true })
    .limit(8)

  return {
    fullName: profile?.full_name || 'there',
    requests: mappedRequests,
    notifications: (notifs || []).map((n: any) => ({
      id: n.id, title: n.title, detail: n.body, time: n.created_at, unread: !n.read, color: '#00737A',
    })),
    upcomingVisits: (upcomingVisitRows || []).map((b: any) => ({
      id: b.id,
      title: b.care_request?.title || b.care_request?.service_type || 'Care Visit',
      agent: b.agent?.full_name || 'Care Agent',
      beneficiary: b.beneficiary?.preferred_name || b.beneficiary?.name || '',
      date: b.scheduled_date || '',
      time: b.scheduled_time || '',
      duration: b.duration || '',
      location: b.location || '',
      status: b.status,
    })),
    counts: { upcomingVisits: upcomingVisitsCount || 0, activeRequests: activeRequests || 0 },
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
    id: n.id,
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

// beneficiaries.conditions/medications/pref_languages/emergency_contacts have
// no confirmed column type (jsonb vs text vs text[] could not be verified
// against the live schema) — the same uncertainty already documented and
// handled defensively in JobManagement.tsx's BeneficiaryInfo rendering.
// These mirror that exact normalization so both the agent and client sides
// treat the columns identically instead of assuming a shape.
function toStringList(value: unknown): string[] {
  if (value == null) return []
  if (Array.isArray(value)) return value.map((v) => (typeof v === "string" ? v : JSON.stringify(v))).filter(Boolean)
  if (typeof value === "string") {
    const trimmed = value.trim()
    if (!trimmed) return []
    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) return parsed.map((v) => (typeof v === "string" ? v : JSON.stringify(v))).filter(Boolean)
    } catch { /* not JSON — treat as plain text below */ }
    return trimmed.split(",").map((s) => s.trim()).filter(Boolean)
  }
  if (typeof value === "object") return Object.values(value as Record<string, unknown>).map((v) => (typeof v === "string" ? v : JSON.stringify(v)))
  return [String(value)]
}

type EmergencyContactRow = { name?: string; relationship?: string; phone?: string; email?: string }
function toContactList(value: unknown): EmergencyContactRow[] {
  let arr: unknown[] = []
  if (Array.isArray(value)) arr = value
  else if (typeof value === "string") {
    try { const p = JSON.parse(value); if (Array.isArray(p)) arr = p } catch { /* not JSON */ }
  } else if (value && typeof value === "object") arr = [value]
  return arr.filter((x) => x && typeof x === "object").map((x) => x as EmergencyContactRow)
}

// Shared by getBeneficiariesFull and getBeneficiaryById so both read the
// same real columns the same way.
function mapBeneficiaryRow(r: any, upcoming: any, careHistory: any[]) {
  const careStatusMap: Record<string, string> = { assigned:'In Progress', confirmed:'In Progress', in_progress:'In Progress', completed:'Completed', cancelled:'Cancelled', rescheduled:'In Progress' }
  return {
    id: r.id, name: r.name, preferred: r.preferred_name || r.name, dob: r.dob || '', age: r.age || 0,
    gender: r.gender || '', relationship: r.relationship || '', nic: r.nic || '', province: r.province || '',
    city: r.city || '', address: r.address || '', postalCode: r.postal_code || '', landmark: r.landmark || '',
    bloodGroup: r.blood_group || '', allergies: r.allergies || '', conditions: toStringList(r.conditions),
    medications: toStringList(r.medications), doctor: r.doctor || '', hospital: r.hospital || '', mobility: r.mobility || '',
    vision: r.vision || '', hearing: r.hearing || '', memory: r.memory || '', medNotes: r.med_notes || '',
    emergencyContacts: toContactList(r.emergency_contacts), prefLang: toStringList(r.pref_languages), prefGender: r.pref_gender || '',
    dietary: r.dietary || '', religious: r.religious || '', visitTimes: r.visit_times || '', commPref: r.comm_pref || '',
    specialReq: r.special_req || '', documents: [] as any[], careHistory, notes: [] as any[],
    status: r.status || 'active',
    careStatus: upcoming ? (careStatusMap[upcoming.status] || 'Open Request') : 'Open Request',
    assignedAgent: (upcoming?.profiles as any)?.full_name || '—',
    nextVisit: upcoming?.scheduled_date ? `${upcoming.scheduled_date}${upcoming.scheduled_time ? ' · ' + upcoming.scheduled_time : ''}` : '—',
    rating: 0,
    createdAt: r.created_at || null,
  }
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

  return (rows || []).map((r: any) => {
    const bks = bookingsByBene[r.id] || []
    const today = new Date().toISOString().slice(0, 10)
    const upcoming = bks.find((b: any) => b.scheduled_date >= today) || bks[bks.length - 1]
    return mapBeneficiaryRow(r, upcoming, [])
  })
}

// Fetches one beneficiary directly (not via the bulk list) so a detail view
// reload/deep-link always reads fresh from Supabase rather than depending on
// previously-loaded list state. Scoped to the authenticated client in
// addition to RLS. Includes real completed-booking care history and the
// same upcoming-booking-derived care status as getBeneficiariesFull.
export async function getBeneficiaryById(id: string, clientId: string) {
  const { data: row, error } = await supabase
    .from('beneficiaries')
    .select('*')
    .eq('id', id)
    .eq('client_id', clientId)
    .maybeSingle()

  if (error) throw error
  if (!row) return null

  const { data: bookings } = await supabase
    .from('bookings')
    .select('status, scheduled_date, scheduled_time, payment_amount, care_request:care_requests(title, service_type), profiles!agent_id(full_name)')
    .eq('beneficiary_id', id)
    .order('scheduled_date', { ascending: false })

  const today = new Date().toISOString().slice(0, 10)
  const rows = bookings || []
  const upcomingCandidates = rows.filter((b: any) => b.scheduled_date >= today && ['assigned','confirmed','in_progress'].includes(b.status))
  const upcoming = upcomingCandidates[upcomingCandidates.length - 1] || rows[0]

  const careHistory = rows
    .filter((b: any) => b.status === 'completed')
    .map((b: any) => ({
      date: b.scheduled_date || '',
      service: b.care_request?.title || b.care_request?.service_type || 'Care Visit',
      agent: (b.profiles as any)?.full_name || 'Care Agent',
      cost: b.payment_amount != null ? `LKR ${Number(b.payment_amount).toLocaleString()}` : '',
    }))

  return mapBeneficiaryRow(row, upcoming, careHistory)
}

// Update is scoped to the beneficiary id AND the authenticated client, in
// addition to RLS — a client can never update another client's beneficiary.
export async function updateBeneficiary(id: string, fields: Record<string, any>, clientId: string) {
  const { data, error } = await supabase
    .from('beneficiaries')
    .update(fields)
    .eq('id', id)
    .eq('client_id', clientId)
    .select()
    .single()

  if (error) throw error
  return data
}