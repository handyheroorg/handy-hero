export type NewSubscriber = {
  email: string
  firstName: string
  lastName: string
  phone: string
}

export type UpdateSubscriber = Partial<Omit<NewSubscriber, 'email'>>

export type NewNotificationPayload = {
  body: string
  redirect_url?: string
} & Record<string, string>

export type NewEmailInAppPayload = {
  receiverId: string
  receiverEmail: string
  receiverName: string
  subject: string
  buttonUrl: string
  body: string
} & Record<string, string>
