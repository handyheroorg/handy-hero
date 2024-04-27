import { MailIcon, PhoneIcon, PlusIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '@/components/container'
import VerifyCard from '@/components/verify-card'
import { useAuthenticatedUser } from '@/hooks'
import { Button } from '@/components/ui'
import ServicesList from './components/services-list'
import Stats from './components/stats'
import ChatRooms from '@/components/chat-rooms'

export default function ProviderDashboard() {
  const { user } = useAuthenticatedUser()

  return (
    <Container className="!py-8">
      <h1 className="text-2xl font-bold mb-4">{user.fullName.split(' ')[0]}&apos;s Workspace</h1>

      <div className="flex items-center justify-end mb-4">
        <Link to="/services/new">
          <Button icon={<PlusIcon />}>Add Service</Button>
        </Link>
      </div>

      <Stats className="mb-4" />

      <div className="flex items-center gap-4 flex-col md:flex-row mb-4">
        <VerifyCard
          icon={<MailIcon />}
          title="Verify Your Email Address"
          description="Please verify your email address to activate your account and access all features."
          iconClassName="text-teal-500"
        />
        <VerifyCard
          icon={<PhoneIcon />}
          title="Verify Your Phone Number"
          description="Please verify your phone number to secure your account and enable additional features."
          iconClassName="text-amber-500"
        />
      </div>

      <div className="flex gap-4">
        <ServicesList className="flex-[2]" />
        <ChatRooms className="flex-1" />
      </div>
    </Container>
  )
}
