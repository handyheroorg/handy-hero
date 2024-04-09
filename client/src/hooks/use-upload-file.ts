import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { uploadFile } from '@/queries'
import { File } from '@/types'
import { handleError } from '@/lib'

type UseUploadFileProps = {
  onSuccess?: (file: File) => void
}

export function useUploadFile({ onSuccess }: UseUploadFileProps) {
  const uploadFileMutation = useMutation({
    mutationFn: uploadFile,
    onError: handleError,
    onSuccess: (uploadedFile) => {
      onSuccess?.(uploadedFile)
      toast.success('File uploaded successfully!')
    },
  })

  return {
    isUploading: uploadFileMutation.isPending,
    upload: uploadFileMutation.mutate,
    uploadedFile: uploadFileMutation.data,
    error: uploadFileMutation.error,
  }
}
