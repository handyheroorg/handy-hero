import Lottie from 'lottie-react'
import { Link } from 'react-router-dom'
import Container from '@/components/container'
import { Button } from '@/components/ui'
import { useAuthenticatedUser } from '@/hooks'
import { Role } from '@/types'
import welcomeAnimation from '@/assets/animations/welcome.json'

export default function Welcome() {
  const { user } = useAuthenticatedUser()

  return (
    <Container className="py-4 h-screen flex items-center gap-4 flex-col md:flex-row -mt-16">
      <div className="flex-1">
        <h1 className="mb-4 text-5xl md:text-6xl font-bold font-amita tracking-tighter leading-[1.2] md:leading-[1.2]">
          Welcome {user.fullName.split(' ')[0]}! <br />
          Let&apos;s start your journey with handy hero.
        </h1>

        <p className="mb-8 text-muted-foreground md:max-w-[500px]">
          {user.role === Role.SERVICE_PROVIDER
            ? 'Display your skills and services to local businesses, expanding your reach and opportunities.'
            : 'Connect with skilled professionals in your community to meet your business needs effortlessly.'}
        </p>

        <Link to={user.role === Role.SERVICE_PROVIDER ? '/services/new' : '/services'}>
          <Button className="rounded-full">
            {user.role === Role.SERVICE_PROVIDER ? 'Create Service Now' : 'Find Talent Now'}
          </Button>
        </Link>
      </div>

      <div className="flex-1">
        <Lottie animationData={welcomeAnimation} loop />
      </div>
    </Container>
  )
}
