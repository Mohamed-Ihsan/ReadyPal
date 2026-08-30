import { supabase } from "./supabaseClient"

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

  return {
    avatarUrl,
    profile,
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