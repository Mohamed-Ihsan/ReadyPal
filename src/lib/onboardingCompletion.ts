// Single source of truth for "is onboarding step N complete?" — shared by
// CareAgentOnboarding.tsx (registration-progress restore) and
// CareAgentDashboard.tsx (Profile Completion). Pure function: callers fetch
// the raw rows themselves (Promise.all vs Promise.allSettled, error
// handling, etc. can differ per caller) and pass them in here unchanged.
//
// Every rule below is copied verbatim from CareAgentOnboarding.tsx's
// registration-progress restore effect — do not simplify or reinterpret
// any of them here. If onboarding's rules change, update them here and
// both callers pick up the change automatically.

export type OnboardingCompletionInput = {
  profile: any
  agentDetails: any
  skills: any
  certifications: any
  identityDocs: any
  bankAccount: any
  availability: any
  equipment: any
  references: any
  agreements: any
}

export type OnboardingStepStatus = {
  step: number
  label: string
  complete: boolean
}

export type OnboardingCompletion = {
  steps: OnboardingStepStatus[]
  completedSteps: number[]
  completedCount: number
  totalSteps: number
  percent: number
}

export function computeOnboardingCompletion(
  input: OnboardingCompletionInput
): OnboardingCompletion {
  const {
    profile,
    agentDetails,
    skills,
    certifications,
    identityDocs,
    bankAccount,
    availability,
    equipment,
    references,
    agreements,
  } = input

  // ─────────────────────────────
  // STEP 1 — Personal Information
  // ─────────────────────────────
  const step1Complete =
    Boolean(profile?.full_name?.trim()) &&
    Boolean(profile?.nic?.trim()) &&
    Boolean(profile?.date_of_birth) &&
    Boolean(profile?.email?.trim()) &&
    Boolean(profile?.phone?.trim()) &&
    Boolean(profile?.address?.trim()) &&
    Boolean(profile?.city?.trim())

  // ─────────────────────────────
  // STEP 2 — Professional Profile
  // ─────────────────────────────
  const step2Complete =
    Boolean(agentDetails?.professional_headline?.trim()) &&
    Boolean(agentDetails?.bio?.trim()) &&
    agentDetails?.experience_years != null &&
    Array.isArray(agentDetails?.languages) &&
    agentDetails.languages.length > 0

  // ─────────────────────────────
  // STEP 3 — Skills & Services
  // ─────────────────────────────
  const step3Complete =
    Array.isArray(skills) && skills.length > 0

  // ─────────────────────────────
  // STEP 4 — Certifications
  // ─────────────────────────────
  const step4Complete =
    Array.isArray(certifications) && certifications.length > 0

  // ─────────────────────────────
  // STEP 5 — Identity Verification
  // ─────────────────────────────
  const identityTypes =
    Array.isArray(identityDocs)
      ? identityDocs.map((doc: any) => doc.doc_type)
      : []

  const requiredIdentityTypes = [
    'nic-front',
    'nic-back',
    'police-clearance-certificate',
    'medical-fitness-certificate',
  ]

  const step5Complete =
    requiredIdentityTypes.every(type => identityTypes.includes(type))

  // ─────────────────────────────
  // STEP 6 — Banking & Payouts
  // ─────────────────────────────
  const step6Complete =
    Boolean(bankAccount?.bank_name?.trim()) &&
    Boolean(bankAccount?.branch?.trim()) &&
    Boolean(bankAccount?.account_name?.trim()) &&
    Boolean(bankAccount?.account_number?.trim())

  // ─────────────────────────────
  // STEP 7 — Availability
  // ─────────────────────────────
  const step7Complete =
    Array.isArray(availability?.working_days) &&
    availability.working_days.length > 0 &&
    Boolean(availability?.preferred_shift) &&
    availability?.max_weekly_hours != null &&
    availability.max_weekly_hours >= 10 &&
    availability?.max_travel_distance_km != null &&
    availability.max_travel_distance_km >= 5

  // ─────────────────────────────
  // STEP 8 — Equipment & Transport
  // ─────────────────────────────
  const step8Complete =
    equipment?.has_smartphone === true &&
    equipment?.has_internet_access === true

  // ─────────────────────────────
  // STEP 9 — References
  // ─────────────────────────────
  const validReferences =
    Array.isArray(references)
      ? references.filter(
          (reference: any) =>
            Boolean(reference?.full_name?.trim()) &&
            Boolean(reference?.organisation?.trim()) &&
            Boolean(reference?.relationship?.trim()) &&
            (Boolean(reference?.phone?.trim()) ||
              Boolean(reference?.email?.trim()))
        )
      : []

  const step9Complete = validReferences.length >= 2

  // ─────────────────────────────
  // STEP 10 — Agreements
  // ─────────────────────────────
  const step10Complete =
    agreements?.terms_accepted === true &&
    agreements?.privacy_accepted === true &&
    agreements?.conduct_accepted === true &&
    agreements?.care_standards_accepted === true &&
    agreements?.background_check_accepted === true

  const steps: OnboardingStepStatus[] = [
    { step: 1, label: 'Personal Information', complete: step1Complete },
    { step: 2, label: 'Professional Profile', complete: step2Complete },
    { step: 3, label: 'Skills & Services', complete: step3Complete },
    { step: 4, label: 'Certifications', complete: step4Complete },
    { step: 5, label: 'Identity Verification', complete: step5Complete },
    { step: 6, label: 'Banking & Payouts', complete: step6Complete },
    { step: 7, label: 'Availability', complete: step7Complete },
    { step: 8, label: 'Equipment & Transport', complete: step8Complete },
    { step: 9, label: 'References', complete: step9Complete },
    { step: 10, label: 'Agreements', complete: step10Complete },
  ]

  const completedSteps = steps.filter(s => s.complete).map(s => s.step)
  const totalSteps = steps.length
  const completedCount = completedSteps.length
  const percent = Math.round((completedCount / totalSteps) * 100)

  return { steps, completedSteps, completedCount, totalSteps, percent }
}
