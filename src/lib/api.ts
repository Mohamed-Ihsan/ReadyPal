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