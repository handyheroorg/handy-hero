import { MailIcon, PhoneIcon } from 'lucide-react'
import Container from '@/components/container'
import VerifyCard from '@/components/verify-card'
import { useAuthenticatedUser } from '@/hooks'

export default function ProviderDashboard() {
  const { user } = useAuthenticatedUser()

  return (
    <Container className="!py-8">
      <h1 className="text-2xl font-bold mb-4">{user.fullName.split(' ')[0]}&apos;s Workspace</h1>

      <div className="flex items-center gap-4 flex-col md:flex-row">
        <VerifyCard
          icon={<MailIcon />}
          title="Verify your email"
          description="baad mai likhunga"
          iconClassName="text-teal-500"
        />
        <VerifyCard
          icon={<PhoneIcon />}
          title="Verify your phone"
          description="baad mai likhunga"
          iconClassName="text-amber-500"
        />
      </div>
    </Container>
  )
}
