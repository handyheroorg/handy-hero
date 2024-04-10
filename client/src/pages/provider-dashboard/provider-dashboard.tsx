import { MailIcon, PhoneIcon, PlusIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '@/components/container'
import VerifyCard from '@/components/verify-card'
import { useAuthenticatedUser } from '@/hooks'
import { Button } from '@/components/ui'
import ServicesList from './components/services-list'

export default function ProviderDashboard() {
  const { user } = useAuthenticatedUser()

  return (
    <Container className="!py-8">
      <h1 className="text-2xl font-bold mb-4">{user.fullName.split(' ')[0]}&apos;s Workspace</h1>

      <div className="flex items-center justify-end">
        <Link to="/services/new">
          <Button icon={<PlusIcon />} className="mb-4">
            Add Service
          </Button>
        </Link>
      </div>

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

      <ServicesList />
    </Container>
  )
}
