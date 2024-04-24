import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { LogInIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SignupSchema, signupSchema } from '@/schema'
import { Role } from '@/types'
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui'
import { useAuthContext } from '@/hooks'

export function Signup() {
  const { signupMutation } = useAuthContext()

  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      role: Role.SERVICE_PROVIDER,
    },
  })

  return (
    <div>
      <p className="text-sm italic md:hidden text-primary">Handy Hero</p>
      <h1 className="text-2xl font-bold mb-4">Signup Now</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            signupMutation.mutate(data)
          })}
          className="grid grid-cols-1 gap-4 mb-4"
        >
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>

                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>

                <FormControl>
                  <Select
                    defaultValue={Role.SERVICE_PROVIDER}
                    onValueChange={field.onChange}
                    disabled={signupMutation.isPending}
                    {...field}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your role" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value={Role.SERVICE_PROVIDER}>Service Provider</SelectItem>
                      <SelectItem value={Role.CLIENT}>Client</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>

                <div className="text-xs text-muted-foreground">
                  <p>
                    Choose <span>&ldquo;Service Provider&rdquo;</span> if you are looking to hire or request services.
                  </p>
                  <p>
                    Choose <span>&ldquo;Client&rdquo;</span> if you offer services or seek job opportunities.
                  </p>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>

                <FormControl>
                  <Input placeholder="Enter your email address" disabled={signupMutation.isPending} {...field} />
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
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    disabled={signupMutation.isPending}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
            <FormField
            control={form.control}
            name="mobileNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number</FormLabel>

                <FormControl>
                  <Input placeholder="Enter your Mobile Number" disabled={signupMutation.isPending} {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

<FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>

                <FormControl>
                  <Input placeholder="Enter your Country" disabled={signupMutation.isPending} {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-max" type="submit" icon={<LogInIcon />} loading={signupMutation.isPending}>
            Signup
          </Button>
        </form>

        <div className="flex items-center text-sm text-center text-muted-foreground gap-2">
          <p>Already have an account? </p>
          <Link to="/auth/login" className="text-secondary-foreground">
            Login Now
          </Link>
        </div>
      </Form>
    </div>
  )
}
