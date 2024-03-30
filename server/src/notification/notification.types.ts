export type NewSubscriber = {
  email: string
  firstName: string
  lastName: string
  phone: string
}

export type UpdateSubscriber = Partial<Omit<NewSubscriber, 'email'>>

export type NewNotificationPayload = Record<string, string>
