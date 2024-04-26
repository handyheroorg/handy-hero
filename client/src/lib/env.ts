import { z } from 'zod'

export const env = z
  .object({
    VITE_API_URL: z.string().url(),
    VITE_NOVU_APP_ID: z.string(),
    VITE_SQUARE_APP_ID: z.string(),
    VITE_SQUARE_LOCATION_ID: z.string(),
  })
  .parse(import.meta.env)
