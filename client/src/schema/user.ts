import { z } from 'zod'
import { ExperienceLevel } from '@/types'

export const updateUserSchema = z.object({
  fullName: z.string(),
  mobileNumber: z.string(),
  country: z.string(),
  avatar: z.string().optional(),
})
export type UpdateUserSchema = z.infer<typeof updateUserSchema>

export const educationSchema = z.object({
  school: z.string(),
  degree: z.string(),
  fieldOfStudy: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  description: z.string(),
})
export type Education = z.infer<typeof educationSchema>

export const experienceSchema = z
  .object({
    title: z.string().min(2, 'Please enter at least 2 characters!').max(200, 'Please enter at least 200 characters!'),
    employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'SELF_EMPLOYED', 'FREELANCE', 'INTERNSHIP', 'TRAINEE']),
    company: z.string(),
    startDate: z.date(),
    currentlyWorkingHere: z.boolean().default(false),
    endDate: z.date().optional(),
    industry: z.string(),
    description: z.string(),
  })
  .superRefine((values, ctx) => {
    if (values.currentlyWorkingHere && !values.endDate) {
      ctx.addIssue({
        message: 'Please enter your end date!',
        code: 'custom',
        path: ['endDate'],
      })
    }
  })
export type Experience = z.infer<typeof experienceSchema>

export const updateProfileSchema = z
  .object({
    occupation: z.string(),
    about: z.string().min(10, 'Please enter at least 10 characters!'),
    fullAddress: z.string().min(10, 'Please enter at least 10 characters!'),
    languages: z.array(z.string().min(2, 'Please enter at least 2 characters!')),
    skills: z.array(z.string().min(2, 'Please enter at least 2 characters!')),
    experienceLevel: z.nativeEnum(ExperienceLevel),
    education: z.array(educationSchema),
    experience: z.array(experienceSchema),
  })
  .partial()
export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>
