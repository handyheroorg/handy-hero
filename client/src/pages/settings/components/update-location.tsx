import { MapPinIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui'
import { BasicProps, User } from '@/types'
import { updateLocation } from '@/queries'
import { handleError, USER_QUERY_KEY } from '@/lib'

type UpdateLocationProps = BasicProps

export default function UpdateLocation({ className, style }: UpdateLocationProps) {
  const qc = useQueryClient()

  const updateLocationMutation = useMutation({
    mutationFn: updateLocation,
    onError: handleError,
    onSuccess(updatedLocation) {
      qc.setQueryData<User | undefined>(USER_QUERY_KEY, (prev) => {
        if (!prev) return prev

        return {
          ...prev,
          location: updatedLocation,
        }
      })

      toast.success('Location updated successfully!')
    },
  })

  function handleUpdateLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        updateLocationMutation.mutate({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      })
    } else {
      toast.error('Geolocation is not available in your browser!')
    }
  }

  return (
    <Button
      icon={<MapPinIcon />}
      className={className}
      style={style}
      onClick={handleUpdateLocation}
      loading={updateLocationMutation.isPending}
    >
      Update Location
    </Button>
  )
}
