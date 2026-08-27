// Small reusable helper to resolve a real-world Sri Lankan address into
// coordinates. Uses OpenStreetMap's Nominatim search API — no API key
// required, and consistent with the Leaflet/OSM map tiles already used
// elsewhere in the app. Never fabricates coordinates: a failed lookup,
// empty result, or invalid response simply resolves to `null` so callers
// can leave location-based features gracefully unavailable.

export interface GeocodeInput {
  address?: string | null
  city?: string | null
  district?: string | null
  province?: string | null
}

export interface GeocodeResult {
  lat: number
  lng: number
}

const NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search"
const REQUEST_TIMEOUT_MS = 8000

function isValidCoordinate(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    !(lat === 0 && lng === 0)
  )
}

/**
 * Resolves real coordinates for a Sri Lankan address using the most
 * specific fields available. Returns `null` (never fake/default
 * coordinates) if the address can't be resolved, the network request
 * fails, or the response is malformed.
 */
export async function geocodeAddress(
  input: GeocodeInput
): Promise<GeocodeResult | null> {
  const parts = [input.address, input.city, input.district, input.province, "Sri Lanka"]
    .map(part => (part ?? "").trim())
    .filter(Boolean)

  // Need at least one real location field beyond the trailing "Sri Lanka".
  if (parts.length <= 1) {
    return null
  }

  const query = parts.join(", ")
  const url = `${NOMINATIM_SEARCH_URL}?format=json&limit=1&countrycodes=lk&q=${encodeURIComponent(query)}`

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    })

    if (!response.ok) {
      console.warn("[geocode] Nominatim request failed with status", response.status)
      return null
    }

    const results = await response.json()

    if (!Array.isArray(results) || results.length === 0) {
      console.warn("[geocode] No results for address query")
      return null
    }

    const lat = Number(results[0]?.lat)
    const lng = Number(results[0]?.lon)

    if (!isValidCoordinate(lat, lng)) {
      console.warn("[geocode] Received invalid coordinates for address query")
      return null
    }

    return { lat, lng }
  } catch (error) {
    console.warn("[geocode] Geocoding failed:", error)
    return null
  } finally {
    clearTimeout(timeoutId)
  }
}
