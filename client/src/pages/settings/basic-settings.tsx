import { CircleAlertIcon, PencilIcon } from 'lucide-react'
import { useState } from 'react'
import { Alert, AlertDescription, AlertTitle, Button } from '@/components/ui'
import { useAuthenticatedUser } from '@/hooks'
import UpdateUserForm from './components/update-user-form'
import UpdateLocation from './components/update-location'
import AvatarUpdate from './components/avatar-update'

export function BasicSettings() {
  const [isEdit, setIsEdit] = useState(false)
  const { user } = useAuthenticatedUser()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Contact Info</h1>

      <div className="mb-8">
        {isEdit ? (
          <UpdateUserForm
            onCancel={() => {
              setIsEdit(false)
            }}
          />
        ) : (
          <div className="px-8 py-6 rounded-xl border relative flex flex-col md:flex-row gap-4">
            <Button
              icon={<PencilIcon />}
              variant="outline"
              className="text-primary absolute right-8 top-6 rounded-2xl hover:text-primary"
              onClick={() => {
                setIsEdit(true)
              }}
            />

            <AvatarUpdate avatar={user.avatar} />

            <div className="flex-1">
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
          </div>
        )}
      </div>

      <h1 className="text-2xl font-bold mb-4">Location</h1>
      <div className="px-8 py-6 rounded-xl border">
        <div className="mb-4">
          {!user.location ? (
            <Alert variant="warning">
              <CircleAlertIcon className="size-4" />

              <AlertTitle>Location not updated!</AlertTitle>
              <AlertDescription>
                You have not updated yor location yet, you set set it by clicking on the button below.
              </AlertDescription>
            </Alert>
          ) : (
            <div>
              <p>
                Latitude : <span className="font-medium">{user.location.latitude}</span>
              </p>
              <p>
                Longitude : <span className="font-medium">{user.location.longitude}</span>
              </p>
            </div>
          )}
        </div>

        <UpdateLocation />
      </div>
    </div>
  )
}
