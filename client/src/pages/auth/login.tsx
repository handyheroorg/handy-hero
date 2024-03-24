import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LogInIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { loginSchema, LoginSchema } from '@/schema'
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@/components/ui'

export function Login() {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function handleLogin(values: LoginSchema) {
    console.log(values)
  }

  return (
    <div>
      <p className="text-sm italic md:hidden text-primary">Handy Hero</p>
      <h1 className="text-2xl font-bold mb-4">Login Now</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)} className="grid grid-cols-1 gap-4 mb-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>

                <FormControl>
                  <Input placeholder="Enter your email address" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>

                <FormControl>
                  <Input type="password" placeholder="Enter your password" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-max" type="submit" icon={<LogInIcon />}>
            Login
          </Button>
        </form>

        <div className="flex items-center text-sm text-center text-muted-foreground gap-2">
          <p>Do not have an account? </p>{' '}
          <Link to="/auth/signup" className="text-secondary-foreground">
            {' '}
            Signup Now
          </Link>
        </div>
      </Form>
    </div>
  )
}
