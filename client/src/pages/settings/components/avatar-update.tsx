import { ImageUpIcon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cn, handleError, USER_QUERY_KEY, VALID_IMAGE_MIME_TYPES } from '@/lib'
import { BasicProps, File } from '@/types'
import { useUploadFile } from '@/hooks'
import { updateUser } from '@/queries'

type AvatarUpdateProps = BasicProps & {
  avatar?: File | null
}

export default function AvatarUpdate({ className, style, avatar }: AvatarUpdateProps) {
  const qc = useQueryClient()

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onError: handleError,
    onSuccess(updatedUser) {
      qc.setQueryData(USER_QUERY_KEY, updatedUser)
    },
  })

  const { isUploading, upload } = useUploadFile({
    onSuccess: (uploadedFile) => {
      updateUserMutation.mutate({ avatar: uploadedFile.id })
    },
  })

  function handleAvatarUpdate(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target?.files?.[0]
    if (!file) return

    if (!VALID_IMAGE_MIME_TYPES.includes(file.type)) {
      return toast.error('This file is not supported!')
    }

    upload(file)
  }

  return (
    <div
      className={cn(
        'bg-gray-100 flex items-center justify-center h-96 w-96 relative group overflow-hidden rounded-full',
        className,
      )}
      style={style}
    >
      {avatar?.publicUrl ? (
        <img src={avatar.publicUrl} alt={avatar.originalName} className="w-full h-full object-cover" />
      ) : null}

      <div className="absolute inset-0 bg-black/40 hidden group-hover:block z-10">
        <label htmlFor="avatar-input" className="w-full h-full flex items-center justify-center cursor-pointer">
          {isUploading ? (
            <Loader2 className="size-10 text-white animate-spin" />
          ) : (
            <ImageUpIcon className="size-10 text-white" />
          )}
        </label>

        <input
          type="file"
          accept=".jpg,.png,.jpeg"
          id="avatar-input"
          className="hidden"
          onChange={handleAvatarUpdate}
          disabled={isUploading}
        />
      </div>
    </div>
  )
}
