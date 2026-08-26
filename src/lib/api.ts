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
  // ─── TEMP DEBUG — remove once the empty Browse Jobs issue is diagnosed ───
  const debugUser = await getCurrentUser()
  console.log("[DEBUG getOpenCareRequests] current user:", debugUser)

  const withBeneficiary = await supabase
    .from("care_requests")
    .select(CARE_REQUEST_SELECT)
    .eq("status", "open")
    .order("created_at", { ascending: false })
  console.log("[DEBUG getOpenCareRequests] WITH beneficiary embed -> data:", withBeneficiary.data)
  console.log("[DEBUG getOpenCareRequests] WITH beneficiary embed -> error:", withBeneficiary.error)

  const withoutBeneficiary = await supabase
    .from("care_requests")
    .select("*, client:profiles!client_id(id, full_name, avatar_url)")
    .eq("status", "open")
    .order("created_at", { ascending: false })
  console.log("[DEBUG getOpenCareRequests] WITHOUT beneficiary embed -> data:", withoutBeneficiary.data)
  console.log("[DEBUG getOpenCareRequests] WITHOUT beneficiary embed -> error:", withoutBeneficiary.error)
  // ─── END TEMP DEBUG ───

  const { data, error } = withBeneficiary

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

export async function getMyApplications() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("No authenticated user found")
  }

  const { data, error } = await supabase
    .from("applications")
    .select("*, care_request:care_requests(id, title, service_type, currency, client:profiles!client_id(full_name))")
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

  const { data, error } = await supabase
    .from("saved_items")
    .select(`id, target_id, created_at, care_request:care_requests(${CARE_REQUEST_SELECT})`)
    .eq("user_id", user.id)
    .eq("target_type", "care_request")
    .order("created_at", { ascending: false })

  if (error) {
    throw error
  }

  return data
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