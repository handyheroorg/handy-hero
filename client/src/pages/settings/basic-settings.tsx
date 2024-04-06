import { PencilIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui'
import { useAuthenticatedUser } from '@/hooks'
import UpdateUserForm from './components/update-user-form'

export function BasicSettings() {
  const [isEdit, setIsEdit] = useState(false)
  const { user } = useAuthenticatedUser()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Contact Info</h1>

      {isEdit ? (
        <UpdateUserForm
          onCancel={() => {
            setIsEdit(false)
          }}
        />
      ) : (
        <div className="px-8 py-6 rounded-3xl border relative">
          <Button
            icon={<PencilIcon />}
            variant="outline"
            className="text-primary absolute right-8 top-6 rounded-2xl hover:text-primary"
            onClick={() => {
              setIsEdit(true)
            }}
          />

          <div className="mb-4">
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>

          <div className="mb-4">
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{user.fullName}</p>
          </div>

          <div className="mb-4">
            <p className="text-sm text-muted-foreground">Mobile Number</p>
            <p className="font-medium">{user.mobileNumber}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Country</p>
            <p className="font-medium">{user.country}</p>
          </div>
        </div>
      )}
    </div>
  )
}
