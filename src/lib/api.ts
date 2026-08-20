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
  travel_radius_km?: number
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