import { z } from 'zod'
import dayjs from 'dayjs'
import { ExperienceLevel } from '@/types'

export const updateUserSchema = z.object({
  fullName: z.string(),
  mobileNumber: z.string(),
  country: z.string(),
  avatar: z.string().optional(),
})
export type UpdateUserSchema = z.infer<typeof updateUserSchema>

export const educationSchema = z
  .object({
    school: z.string().min(2, 'Please enter at least 2 characters!'),
    degree: z.string().min(2, 'Please enter at least 2 characters!'),
    fieldOfStudy: z.string().optional(),
    startDate: z.date(),
    endDate: z.date(),
    description: z.string().min(10, 'Please enter at least 10 characters!'),
  })
  .superRefine((values, ctx) => {
    if (dayjs(values.endDate).isBefore(values.startDate)) {
      ctx.addIssue({
        message: 'End date must be after start date',
        code: 'custom',
        path: ['endDate'],
      })
    }
  })
export type Education = z.infer<typeof educationSchema>

export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  SELF_EMPLOYED = 'SELF_EMPLOYED',
  FREELANCE = 'FREELANCE',
  INTERNSHIP = 'INTERNSHIP',
  TRAINEE = 'TRAINEE',
}

export const experienceSchema = z
  .object({
    title: z.string().min(2, 'Please enter at least 2 characters!').max(200, 'Please enter at most 200 characters!'),
    employmentType: z.nativeEnum(EmploymentType),
    company: z.string().min(2, 'Please enter at least 2 character!').max(200, 'Please enter at most 200 characters!'),
    industry: z.string().min(2, 'Please enter at least 2 character!').max(200, 'Please enter at most 200 characters!'),
    currentlyWorkingHere: z.boolean().default(false),
    startDate: z.date(),
    endDate: z.date().optional(),
    description: z
      .string()
      .min(10, 'Please enter at least 10 characters!')
      .max(2000, 'Please enter at most 2000 characters!'),
  })
  .superRefine((values, ctx) => {
    if (!values.currentlyWorkingHere && !values.endDate) {
      ctx.addIssue({
        message: 'Please enter your end date!',
        code: 'custom',
        path: ['endDate'],
      })
    }

    if (values.startDate && values.endDate && dayjs(values.endDate).isBefore(values.startDate)) {
      ctx.addIssue({
        message: 'End date must be after start date!',
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
